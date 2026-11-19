# Rencana Implementasi: Kanji Adventure

Status: usulan teknis, belum dieksekusi · 2026-11-19 · branch `kanji-adventure`
Dokumen pendamping: `idea and plan/IDEA.md` · gaya mengikuti `docs/design-choukai-bergambar.md`

---

## 1. Tujuan dan prinsip

Tujuan: mengubah latihan kanji dari sesi acak menjadi **perjalanan terarah per volume**, supaya kanji yang
belum dikuasai tidak bisa terlewat.

Prinsip yang dipakai dalam rencana ini:

1. **Tidak memecah pola soal.** Bentuk soal (bacaan + arti, 4 opsi) tetap seperti `KanjiRunner` sekarang.
2. **Tidak mengubah mode lama.** Latihan kanji acak dan flashcard tetap berfungsi apa adanya.
3. **Deterministik dan tersimpan.** Kanji per chunk dipilih sekali, disimpan sebagai snapshot `itemIds`,
   dan dipakai ulang setiap sesi. Perubahan data sumber tidak menggeser isi chunk yang sudah berjalan.
4. **Server yang berkuasa.** Server yang menentukan isi chunk, menyusun soal, menilai, membuka chunk
   berikutnya, dan membuka volume berikutnya. Client hanya mengirim jawaban; client tidak bisa membuka
   chunk atau volume dengan memanipulasi URL.
5. **Murni latihan, tetap terukur.** Hasil adventure tidak masuk `nilai_ujian`/rapor, tetapi setiap
   percobaan wajib menjadi `latihan_sesi` bermode `latihan` agar muncul di monitoring latihan dan ikut
   menghitung grade lewat `rataSkorLatihan` → `hitungGradeLatihan`.
6. **Sensei melihat progres.** Setiap peserta punya ringkasan volume, chunk, dan daftar boss yang
   bisa dilihat dari halaman monitoring latihan yang sudah ada.

---

## 2. Ringkasan temuan kode

Rincian dan tautan baris ada di `IDEA.md` bagian 6. Pokoknya:

- Volume kanji terdefinisi di `server/domain/tesOnline.js` (`JLPT_KANJI`, `VOLUME_KANJI`,
  `VOLUME_KATA`, `kanjiItems(kode)`). Kode server: `DASAR`, `VOL1`–`VOL5`, `N4VOL1`–`N4VOL5`.
- `daftarMateriTes()` menyediakan judul, JLPT, jumlah item, dan saran kode ujian per materi.
- `buatSoalKanji(materi, jumlah, rng)` di `server/domain/tesOnline.js:229-263` (helper private, dipakai
  lewat `buatSoalTes()`) mengambil `shuffle(items).slice(0, jumlah)` lalu menghasilkan **satu objek per
  item** berisi `bacaan: { opsi, benar }` dan `arti: { opsi, benar }`, masing-masing 4 opsi. Id soal
  sama dengan `item.id`.
- `getLatihanTes()` di `server/db/tesOnlineRepo.js:690-715` saat ini mengambil `jumlah` item secara acak.
- `nilaiLatihanTes()` di file yang sama hanya menyimpan skor, bukan jawaban per butir.
- `flashcard_progres` (`supabase/migrations/001_initial_schema.sql:268-279`) menyimpan urutan acak
  dan waktu per kartu lewat `getFlashcardPortal()`, `mulaiFlashcard()`, `simpanFlashcard()`
  (`server/db/latihanRepo.js:329-410`, helper internal `kartuBerurutan` di 323).
- Rute portal memakai `requirePeserta` (`server/apiApp.js:371-402`); halaman memakai Vuetify + utility
  Tailwind dan teks dari `src/locales/id.js` / `ja.js`.
- Sesi latihan dibuat dengan `catatLatihanBaru(pesertaId, { jenis, materi, materiJudul, jlpt,
  jumlahItem })`; status `mode` di-set `'latihan'` di dalam repo. `tutupLatihan` menyimpan `skor`,
  `itemSelesai`, `detikAktif`, dan `detakAktivitas` menerima sinyal ~15 detik
  (`server/db/latihanRepo.js:267, 294, 314`).
- `rataSkorLatihan` adalah field yang dihitung dari sesi latihan di `server/domain/aktivitasLatihan.js:131`;
  `hitungGradeLatihan({ detikAktif, rataSkor }, ...)` memetakannya ke grade A–E di
  `server/domain/gradeLatihan.js:93` dan dipakai di `server/db/latihanRepo.js:437`.
- Monitoring latihan sudah punya `GET /monitor-latihan/live`, `/statistik`, dan `/peserta/:id` dengan
  `requireAuth` + `requirePageAccess('monitor-latihan')` (`server/apiApp.js:469, 477, 485`), serta
  halaman `src/views/MonitorLatihanView.vue` yang mengambil detail per peserta di baris 557.

Jumlah item yang dihitung langsung dari `kanjiItems(materi)`:

| Materi | Item | Chunk @10 |
| --- | ---: | ---: |
| `DASAR` | 80 | 8 |
| `VOL1`–`VOL5` | 83–84 | 9 |
| `N4VOL1`–`N4VOL4` | 84 | 9 |
| `N4VOL5` | 56 | 6 |

Artinya chunk terakhir boleh berisi **kurang dari 10 item** (`N4VOL5` berakhir dengan 6 item). Aturan
"10 kanji per level" dibaca sebagai **maksimal 10 item per chunk**, bukan jumlah tetap.

---

## 3. Keputusan desain final

| Keputusan | Hasil final | Alasan / konsekuensi |
| --- | --- | --- |
| Satuan chunk | 10 **butir soal kanji** (kata), bukan 10 karakter unik | Keputusan 2. Pola soal existing berbasis kata; `KanjiRunner` tidak diubah |
| Urutan chunk | Urutan asli array `kanjiItems(materi)`, tidak diacak | Kanji ditentukan dan disimpan, mudah dijelaskan ke peserta |
| Snapshot chunk | Disimpan sebagai `itemIds` per materi saat progres dibuat | Keamanan terhadap perubahan data sumber |
| Benar per item | `bacaanOk && artiOk` | Keputusan 1; konsisten dengan `benar` di `nilaiTes` |
| Lulus chunk | Semua item di chunk sudah benar penuh, boleh terkumpul lintas sesi; chunk diulang sampai tercapai | Keputusan 1 + 4. Tidak menghukum peserta yang butuh beberapa percobaan, tapi tetap menuntut semua butir dikuasai |
| Masuk boss | Salah di bacaan **atau** arti | Keputusan 3. Satu bagian yang salah sudah cukup disebut belum hafal |
| Boss chunk | Dibuka setelah semua chunk reguler tuntas; isinya item yang masih belum dikuasai | Sesuai permintaan "chunk baru di akhir volume" |
| Selesai boss / volume | **Diulang tanpa batas sampai semua item boss benar penuh.** Tidak ada batas 2 ronde. Volume berikutnya terbuka hanya setelah ini tercapai | Keputusan 4. `perlu_perhatian` boleh dicatat untuk sensei, tetapi tidak menghentikan kewajiban mengulang |
| Buka volume berikutnya | `URUTAN_VOLUME` + pengecekan `selesai` pada volume sebelumnya, dilakukan server | Keputusan 1 dan 4, diterapkan juga antar-volume |
| Mode acak lama | Dipertahankan, adventure menjadi menu tambahan | Keputusan 5, tidak ada regresi |
| Nilai | Tidak masuk `nilai_ujian`/rapor, tetapi **wajib** jadi `latihan_sesi` mode `latihan` | Keputusan 7: murni latihan, tetap memberi `detikAktif`, `skor`, `rataSkorLatihan`, dan `grade` |
| Sensei | Endpoint monitoring per peserta **wajib**, tampil di halaman `monitor-latihan` | Keputusan 6, bukan lagi opsi |

Rencana tidak memakai mode `sempurnaSesi` (wajib 10/10 dalam satu sesi). Keputusan final adalah
akumulatif per butir dengan pengulangan sampai semua benar.

---

## 4. Model data

### 4.1 Tabel baru `kanji_adventure_progres`

Ditambahkan di migration baru `supabase/migrations/002_kanji_adventure.sql` (mengikuti pola
`CREATE TABLE IF NOT EXISTS` dari `001_initial_schema.sql`):

```sql
CREATE TABLE IF NOT EXISTS kanji_adventure_progres (
  peserta_id        INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  materi            TEXT NOT NULL,                 -- DASAR / VOL1 / N4VOL1 / ...
  item_ids          JSONB NOT NULL,                -- snapshot semua item, urutan tetap
  chunk_count       INTEGER NOT NULL,
  chunk_terbuka     INTEGER NOT NULL DEFAULT 0,    -- index chunk tertinggi yang boleh dimainkan
  dikuasai          JSONB NOT NULL DEFAULT '[]'::jsonb,  -- itemId yang pernah benar penuh
  bosses            JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{id, salah, terakhirSalah}]
  boss_ronde        INTEGER NOT NULL DEFAULT 0,          -- informasi untuk sensei, bukan batas percobaan
  selesai           BOOLEAN NOT NULL DEFAULT false,      -- chunk reguler + chunk boss semua tuntas
  perlu_perhatian   BOOLEAN NOT NULL DEFAULT false,      -- penanda untuk sensei, tidak menghentikan pengulangan
  riwayat           JSONB NOT NULL DEFAULT '[]'::jsonb,  -- ringkasan tiap sesi
  dibuat_pada       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (peserta_id, materi)
);
CREATE INDEX IF NOT EXISTS idx_ka_progres_peserta ON kanji_adventure_progres (peserta_id);
```

Bentuk `bosses`: `[{ "id": "VOL1:言葉", "salah": 2, "terakhirSalah": "2026-11-19T04:12:00Z" }]`.

Tidak ada tabel soal baru. Soal dibangun ulang dari `itemIds` + `kanjiItems(materi)` setiap sesi, tetapi
**keanggotaan chunk** tidak pernah berubah.

### 4.2 Tabel `kanji_adventure_sesi` (wajib untuk MVP)

Dipakai karena endpoint `mulai` mengembalikan `sesiId` dan endpoint `detak` memakai `aktivitasId`.
`riwayat` JSONB di tabel utama tetap dipakai sebagai ringkasan cepat:

```sql
CREATE TABLE IF NOT EXISTS kanji_adventure_sesi (
  id            SERIAL PRIMARY KEY,
  peserta_id    INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  materi        TEXT NOT NULL,
  chunk_index   INTEGER NOT NULL,   -- 0..n-1 reguler, -1 = boss
  ronde         INTEGER NOT NULL DEFAULT 1,
  aktivitas_id  INTEGER,            -- dari latihan_sesi
  benar         INTEGER NOT NULL,
  total         INTEGER NOT NULL,
  detail        JSONB NOT NULL,     -- [{itemId, bacaanOk, artiOk}]
  dibuat_pada   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.3 Lokal / Postgres dual mode

`server/db/` memakai pola `getMode()` dengan `tanpaGagal()` supaya repo tetap jalan tanpa Postgres.
Tambahkan state `kanjiAdventureProgres` ke state lokal dan repo baru
`server/db/kanjiAdventureRepo.js` dengan fungsi:

- `bacaProgresAdventure(pesertaId, materi)`
- `pastikanProgresAdventure(pesertaId, materi, itemIds)` (snapshot sekali, idempoten)
- `simpanProgresAdventure(pesertaId, materi, progres)`
- `daftarProgresAdventure(pesertaId)` — semua progres peserta, dipakai untuk gerbang antar-volume dan
  monitoring sensei
- `tambahSesiAdventure(...)` (wajib, dipakai endpoint `mulai`/`detak`/`nilai`)

Semua fungsi memakai `tanpaGagal(rows, fallback)` dan return array/objek yang sama untuk kedua mode.
`perlu_perhatian` dan `boss_ronde` hanya penanda informasi; tidak ada batas gagal yang menghentikan
pengulangan boss.

---

## 5. Logika domain (file baru `server/domain/kanjiAdventure.js`)

Fungsi murni, tanpa DB, mudah di-test dengan `node:test`:

```js
export const UKURAN_CHUNK = 10;
export const MAKS_RIWAYAT = 20;
export const AMBANG_PERHATIAN = 3;          // informasi untuk sensei, bukan batas
export const URUTAN_VOLUME = [...VOLUME_KANJI]     // DASAR, VOL1..VOL5, N4VOL1..N4VOL5

export function itemVolume(materi)            // kanjiItems(materi), validasi materi ada
export function pecahChunk(items)             // [{ index, itemIds }], chunk terakhir boleh < 10
export function susunSoalChunk(items, itemIds, { mode = 'reguler' })
// -> satu soal per item: [{ id:'VOL1-1', kanji:'言葉', bacaan:{opsi,benar}, arti:{opsi,benar}, ... }, ...]
export function nilaiChunk(soal, jawaban)
// -> { detail:[{itemId,bacaanOk,artiOk,benar}], benar, total, lulus, itemSalah:[id] }
export function evaluasiProgres(progres, hasil)
// -> progres baru: dikuasai, bosses, boss_ronde, chunk_terbuka, selesai, perlu_perhatian
export function volumeTersedia(semuaProgres, materi)
// -> boolean; volume pertama selalu true, berikutnya hanya jika volume sebelumnya selesai
```

Aturan `evaluasiProgres` (final, tanpa opsi mode lulus alternatif):

1. Gabungkan `dikuasai` lama dengan `itemId` yang `benar` pada sesi ini (`bacaanOk && artiOk`).
2. `lulus` = semua `itemIds` chunk masuk `dikuasai`. Boleh terakumulasi lintas sesi; chunk diulang
   sampai kondisi ini tercapai. Tidak ada syarat 10/10 dalam satu sesi.
3. Jika `lulus` dan chunk reguler, `chunk_terbuka = max(chunk_terbuka, index + 1)`.
4. Item yang salah di bacaan **atau** arti di-upsert ke `bosses` (`salah + 1`, `terakhirSalah` sekarang).
5. Saat semua chunk reguler selesai, boss chunk dibuka. Boss berisi `bosses` aktif pada saat itu.
6. Di boss chunk, item yang benar penuh dihapus dari `bosses`; `boss_ronde` bertambah. Jika masih ada
   item yang belum benar, boss **tetap terbuka dan harus diulang**. Tidak ada `MAX_BOSS_RONDE`, tidak
   ada `selesai = true` paksa, tidak ada jalan pintas lewat penanda sensei.
7. `perlu_perhatian = true` hanya jika ambang tertentu terlampaui, sebagai informasi untuk sensei.
8. `selesai` bernilai `true` hanya jika semua chunk reguler tuntas **dan** `bosses` kosong. Ini syarat
   membuka volume berikutnya lewat `volumeTersedia`.

Fungsi `susunSoalChunk` memakai bentuk soal yang sama dengan `buatSoalKanji`. Karena helper itu masih
privat dan menerima `materi`, implementasinya bisa mengekspornya atau membuat helper baru di
`kanjiAdventure.js` yang menerima `items` yang sudah dipilih tanpa `shuffle(items).slice(0, jumlah)`.
Id soal tetap `item.id` (satu objek per item) dengan kolom `bacaan` dan `arti`, supaya jawaban dari
client bisa dicocokkan server lewat `nilaiTes('kanji', soal, jawaban)`.
`URUTAN_VOLUME` diimpor langsung dari `VOLUME_KANJI` di `server/domain/tesOnline.js`, bukan duplikat
daftar materi.

---

## 6. API

Semua endpoint baru di `server/apiApp.js`, dikelompokkan dengan rute portal existing.
Endpoint peserta memakai `requirePeserta` (pesertaId dari token, bukan body); endpoint sensei memakai
`requireAuth` + `requirePageAccess('monitor-latihan')`.

| Method | Path | Auth | Respons |
| --- | --- | --- | --- |
| `GET` | `/api/portal/kanji-adventure/volume` | `requirePeserta` | `[{ materi, judul, jlpt, jumlah, chunkCount, progres, terkunci }]` |
| `GET` | `/api/portal/kanji-adventure/volume/:materi` | `requirePeserta` | `{ materi, judul, chunks:[{index, jumlah, status}], boss:{status, jumlah} }` (tanpa soal) |
| `POST` | `/api/portal/kanji-adventure/mulai` | `requirePeserta` | `{ sesiId, aktivitasId, soal, chunkIndex, ronde }` |
| `POST` | `/api/portal/kanji-adventure/detak` | `requirePeserta` | `{ ok: true }`, memanggil `detakAktivitas(pesertaId, aktivitasId, { detikAktif })` |
| `POST` | `/api/portal/kanji-adventure/nilai` | `requirePeserta` | `{ benar, total, lulus, bossesBaru, nextChunk, selesai, grade }` |
| `GET` | `/api/portal/kanji-adventure/riwayat` | `requirePeserta` | ringkasan sesi untuk halaman progres |
| `GET` | `/api/monitor-latihan/kanji-adventure/peserta/:id` | `requireAuth, requirePageAccess('monitor-latihan')` | ringkasan + chunk + boss per peserta untuk sensei |

Catatan implementasi:

- `mulai` memanggil `pastikanProgresAdventure`, mengecek `volumeTersedia` dan
  `chunkIndex <= chunk_terbuka`, lalu `susunSoalChunk`. Volume/chunk yang terkunci ditolak 403,
  walaupun client disiasati. Sesi latihan dibuat di sini lewat
  `catatLatihanBaru(pesertaId, { jenis:'kanji', materi:'adventure', materiJudul:'Kanji Adventure ·
  <judul>', jlpt, jumlahItem })`; `aktivitasId`-nya disimpan di state sesi bersama soal. Ikuti pola
  `getLatihanTes`: soal dikirim dengan indeks `benar` yang dipakai `KanjiRunner` untuk umpan; jawaban
  peserta tetap dinilai ulang di server.
- `nilai` memanggil `nilaiChunk` + `evaluasiProgres`, menyimpan progres, lalu menutup sesi latihan.
  **Wajib** memanggil `detakAktivitas(pesertaId, aktivitasId, { detikAktif })` dan
  `tutupLatihan(pesertaId, aktivitasId, { skor, itemSelesai, detikAktif })` dengan `aktivitasId` dari
  state sesi. Dengan begitu `mode` tetap `'latihan'`, bukan `'resmi'`, sehingga tidak masuk rapor tetapi
  **masuk `rataSkorLatihan` dan `grade`**.
- `grade` diambil dari field `grade` yang sudah dihitung `getRiwayatLatihanPeserta(pesertaId)` lewat
  `hitungGradeLatihan` di `server/db/latihanRepo.js:437`; monitoring sensei memakai sumber data yang sama.
- Endpoint sensei **bukan opsional** dan sengaja memakai prefiks `/monitor-latihan/`, bukan
  `/portal/admin/`, supaya konsisten dengan halaman & izin monitoring yang sudah ada. Tidak memakai
  `requirePeserta`, karena yang dibaca adalah peserta lain.
- Tidak ada endpoint untuk menulis `itemIds`, `dikuasai`, `bosses`, atau `selesai` dari client.

---

## 7. Frontend

### 7.1 Rute dan menu

- `src/router/index.js`: tambah child di bawah portal:
  `{ path: 'kanji-adventure', name: 'portal-kanji-adventure', component: PortalKanjiAdventureView,
    meta: { portalTitle: 'portal.menu.kanjiAdventure' } }` (di sekitar blok `118-129`).
- Tambah kartu/menu masuk di halaman portal peserta, berdampingan dengan `tes` dan `flashcard`.

### 7.2 Komponen

| File | Peran |
| --- | --- |
| `src/views/portal/PortalKanjiAdventureView.vue` | Halaman utama: pilih volume, peta chunk, tombol lanjut |
| `src/components/portal/adventure/VolumePicker.vue` | Daftar volume dari `GET /volume`, tampilkan progres |
| `src/components/portal/adventure/ChunkMap.vue` | 8–9 petak chunk + petak boss, status terkunci/tersedia/selesai |
| `src/components/portal/adventure/AdventureRunner.vue` | Bungkus `KanjiRunner` dengan header chunk dan timer |
| `src/components/portal/adventure/BossList.vue` | Daftar kanji yang masih jadi boss |
| `src/services/kanjiAdventure.js` | Composable fetch + state, mengikuti pola `src/services/latihanHariIni.js` |
| `src/components/monitor/MonitorAdventurePeserta.vue` | Panel rincian di halaman monitoring: volume/chunk/boss per peserta dan ringkasan grade |

Untuk keputusan 6, `MonitorLatihanView.vue` cukup menambah satu tab/dialog detail yang memanggil
`/api/monitor-latihan/kanji-adventure/peserta/:id` lewat `src/services/kanjiAdventure.js`. Tidak perlu
halaman monitoring baru.

`AdventureRunner` sebaiknya **memakai ulang** `KanjiRunner.vue` (opsi dirender inline di dalamnya) dan
`src/services/aktivitasLatihan.js` apa adanya. Tidak ada komponen `SoalKanji.vue` atau
`OpsiJawaban.vue` di repo ini. Yang ditambahkan hanya route/URL parameter untuk `chunkIndex` dan
tampilan status.

### 7.3 Styling dan i18n

- Utamakan Tailwind utility yang sudah dipakai repo: `joy-surface`, `font-display`, `tabular-nums`,
  `grid`, `space-y-*`, `focus-visible:*`. Vuetify dipakai selektif untuk kontrol/dialog
  (`v-progress-linear`, `v-icon` `mdi-lock`, `v-chip`, `v-dialog`), bukan untuk layout; peta chunk
  memakai `joy-surface` seperti halaman lain.
- Hindari menambah warna baru; pakai palet existing.
- `src/locales/id.js` dan `src/locales/ja.js`: tambah `portal.menu.kanjiAdventure` (di blok `portal.menu`,
  sekitar baris 1337) dan namespace `portal.kanjiAdventure.*` (dekat `portal.flashcard`, `id.js:1348`).
  Semua teks UI harus lewat i18n, tidak hardcode.

### 7.4 RBAC

- Peserta: `requirePeserta` pada semua rute `/api/portal/kanji-adventure/*`, sama seperti
  `/api/portal/latihan/*`. Tidak perlu role baru.
- Sensei/admin: endpoint rincian memakai `requireAuth` + `requirePageAccess('monitor-latihan')`,
  persis seperti endpoint `GET /monitor-latihan/...` yang sudah ada. Tidak memakai `requirePeserta`
  karena yang dilihat adalah peserta lain. Tidak perlu seed page baru.
- Tidak ada role baru. `requireRole(['admin','guru'])` tidak dipakai di endpoint ini supaya aturan
  aksesnya identik dengan halaman monitoring latihan yang sudah ada.

---

## 8. Pengujian

`npm test` memakai `node:test` via `tsx` (`package.json:6-17`). Tambahan test:

1. `server/domain/kanjiAdventure.test.js`
   - `pecahChunk` menghasilkan 8 chunk untuk `DASAR` dan 6 chunk untuk `N4VOL5` (chunk terakhir 6 item).
   - `susunSoalChunk` menghasilkan satu soal per item dengan id stabil dan dua kolom `bacaan`/`arti`.
   - `nilaiChunk`: benar hanya jika bacaan dan arti keduanya benar; salah di salah satu sudah masuk
     `itemSalah`.
   - `evaluasiProgres`: chunk tidak terbuka sebelum semua item dikuasai; boleh terakumulasi lintas sesi;
     boss terisi saat ada salah dan tetap ada setelah 2 ronde; boss baru selesai setelah semua item
     benar; `perlu_perhatian` hanya penanda, bukan pengganti kewajiban ulang.
   - `selesai = false` → `volumeTersedia(materi berikutnya) = false`; `selesai = true` → `true`.
2. `server/db/kanjiAdventureRepo.test.js` (pola `latihanRepo.test.js`, `withFakeDb`)
   - snapshot `itemIds` tidak berubah saat `pastikanProgresAdventure` dipanggil ulang.
   - state lokal dan Postgres mengembalikan bentuk objek yang sama.
3. `server/apiApp.test.js` (atau file rute portal yang sudah ada)
   - peserta tidak bisa `mulai` chunk yang masih terkunci, tidak bisa `mulai` volume yang masih
     terkunci, dan tidak bisa `mulai` boss sebelum chunk reguler tuntas (403).
   - `nilai` dengan `sesiId` orang lain ditolak.
   - endpoint tanpa token ditolak.
   - endpoint sensei adventure ditolak untuk user tanpa akses halaman `monitor-latihan`, dan lolos untuk
     guru/admin yang punya akses.
   - `nilai` adventure benar-benar membuat `latihan_sesi` dengan `mode: 'latihan'`;
     `getRiwayatLatihanPeserta` lalu `hitungGradeLatihan` menghasilkan grade yang berubah sesuai skor.
4. Regresi: jalankan seluruh test yang menyentuh `tesOnline`, `flashcard`, `latihanRepo`,
   `aktivitasLatihan`, dan `gradeLatihan` untuk memastikan mode acak lama dan grade tidak berubah.

---

## 9. Tahap implementasi

| Tahap | Isi | Kriteria selesai |
| --- | --- | --- |
| 0 | Keputusan final sudah dicatat di `IDEA.md` bagian 7 | Tujuh poin tertutup, tidak ada opsi terbuka |
| 1 | Domain murni + test (`kanjiAdventure.js`, `.test.js`) | `npm test` hijau, belum ada API |
| 2 | Migration + repo (`002_kanji_adventure.sql`, `kanjiAdventureRepo.js`, state lokal) | Bisa baca/tulis progres di dua mode |
| 3 | API + test rute + integrasi `latihan_sesi`/grade | 7 endpoint bekerja, 403 untuk chunk/volume terkunci, grade ikut berubah |
| 4 | UI + i18n + menu | Peserta bisa mengulang chunk dan boss sampai semua benar |
| 5 | Sensei: endpoint + panel di `MonitorLatihanView.vue` | Guru/admin melihat progres per peserta, non-akses ditolak |
| 6 | QA manual di browser: acak lama, flashcard, adventure berdampingan | Tidak ada regresi |

Tahap 1–3 bisa digabung satu PR; tahap 4–5 PR terpisah supaya review UI tidak tercampur logika.

---

## 10. Risiko dan mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Data sumber berubah, chunk lama jadi tidak valid | Simpan `itemIds`; saat render, item yang hilang ditandai dan dilaporkan, chunk tidak silent bergeser |
| Peserta mengirim jawaban palsu | Server menyusun soal dan menyimpan kunci jawaban di state sesi; client hanya kirim pilihan |
| Boss bisa berlangsung lama karena tanpa batas ronde | Tampilkan progres dan sisa item di UI, catat `perlu_perhatian` untuk sensei, dan pastikan endpoint monitoring menyediakan daftar boss; jangan memaksa `selesai` saat masih ada item salah |
| Chunk/volume tidak sengaja terbuka | Gerbang dihitung server dari `dikuasai`/`selesai`; client hanya mengirim jawaban, bukan status |
| Adventure masuk rapor tidak sengaja | `nilai` wajib memanggil `catatLatihanBaru` yang men-set `mode: 'latihan'`; test regresi memeriksa `nilai_ujian` tidak bertambah |
| Grade tidak berubah walaupun sudah latihan | `tutupLatihan` menyimpan `skor`/`detikAktif`; test memastikan `rataSkorLatihan` dan `hitungGradeLatihan` membaca sesi adventure |
| Chunk terakhir < 10 item terasa "kalah" | Tampilkan sebagai `6 kanji` di UI, bukan progress 60% dari 10 |
| Perlambatan karena soal dibangun ulang | `kanjiItems` dari array statis, biaya render kecil; cache hasil per materi di memori bila perlu |
| Regresi mode acak | Tidak menyentuh `getLatihanTes`, `buatSoalKanji`, `flashcard.js` kecuali refactor helper kecil yang di-test. Helper `buatSoalKanji` saat ini private, jadi adventure memakai wrapper/ekspor baru |

---

## 11. Daftar file yang disentuh

**Baru**

- `server/domain/kanjiAdventure.js`
- `server/domain/kanjiAdventure.test.js`
- `server/db/kanjiAdventureRepo.js`
- `supabase/migrations/002_kanji_adventure.sql`
- `src/views/portal/PortalKanjiAdventureView.vue`
- `src/components/portal/adventure/{VolumePicker,ChunkMap,AdventureRunner,BossList}.vue`
- `src/services/kanjiAdventure.js`
- `src/components/monitor/MonitorAdventurePeserta.vue`

**Diubah**

- `server/apiApp.js` (rute baru)
- `server/db/localStore.js` (state `kanjiAdventureProgres`)
- `server/domain/tesOnline.js` (ekspor `buatSoalKanji` atau helper pembentuk soal agar `susunSoalChunk` memakai bentuk yang sama)
- `src/router/index.js`
- halaman portal peserta (menu)
- `src/views/MonitorLatihanView.vue` (panel detail adventure per peserta)
- `src/locales/id.js`, `src/locales/ja.js`

**Tidak diubah sengaja**

- `server/domain/flashcard.js`, perilaku `getLatihanTes()`, `nilai_ujian`, `flashcard_progres`.
- `server/domain/gradeLatihan.js` tidak diubah; cukup dipakai oleh sesi adventure yang bermode
  `latihan`, sehingga grade dan monitoring otomatis mengikuti.

---

## 12. Definition of done

- Peserta bisa memilih volume, melihat peta chunk, dan mengerjakan chunk pertama.
- Chunk kedua benar-benar terkunci sampai **semua** butir di chunk pertama benar bacaan dan arti,
  termasuk jika client memanggil API langsung.
- Butir yang salah di bacaan atau arti masuk daftar boss; chunk reguler dan chunk boss bisa diulang
  tanpa batas sampai semua butir benar. Tidak ada status "selesai" paksa karena 2 ronde.
- Volume berikutnya benar-benar terkunci sampai chunk boss volume sebelumnya tuntas, termasuk jika
  client memanggil API langsung.
- Mode latihan acak dan flashcard lama berdampingan dan tetap lolos test.
- Setiap sesi adventure tercatat sebagai `latihan_sesi` bermode `latihan`; muncul di monitoring latihan
  dan berpengaruh pada `rataSkorLatihan`/`grade`.
- Sensei bisa melihat progres, chunk, dan daftar boss per peserta di `monitor-latihan`; user tanpa
  akses halaman itu ditolak.
- Tidak ada data yang masuk `nilai_ujian`/rapor.
- `npm test` hijau, `npm run build` sukses.
- Dokumen ini dan `IDEA.md` sudah memuat tujuh keputusan final sebelum implementasi dimulai.
