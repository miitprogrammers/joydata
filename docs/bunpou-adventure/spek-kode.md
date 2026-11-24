# Spesifikasi Kode: Bunpou Adventure

Status: rencana implementasi final, belum ada kode (user: "jangan dulu code") · 2026-11-21 · branch `bunpou-adventure` (sudah disusulkan ke `main` 9471516:
KB dan katalog Materi Bunpou tersedia) · dokumen induk: [plan.md](plan.md)

Dokumen ini menjelaskan **cara** membangun fitur: berkas, fungsi, bentuk data, API, dan tes per fase. Alasan desain dan
keputusan ada di plan.md.

---

## 0. Keputusan yang dipakai

| No | Keputusan | Sumber |
|---|---|---|
| Q1 | Judul **Bunpou Adventure** | bawaan (rekomendasi) |
| Q2 | **Peserta memilih nomor potongan untuk ★** (format JLPT) | **user** |
| Q3 | Satuan kemajuan = pola, tiap pola punya beberapa varian soal | bawaan |
| Q4 | Volume N5 = blok ujian: Bab 1–4, 5–9, 10–15, 16–21, 22–25 | bawaan |
| Q5 | Volume N4 = **urutan bab Minna II** (26–30, 31–35, 36–40, 41–45, 46–50); pola modul ditempel ke bab | **user** |
| Q6 | N3 menunggu modul N3 dari sensei, dikerjakan terakhir | bawaan |
| Q7 | Gembok per tingkat (Vol 1 tiap tingkat terbuka) | bawaan |
| Q8 | Ulangan tahap hanya berisi pola yang belum dikuasai | bawaan |
| Q9 | Bos Kanji Adventure diperbaiki terpisah: branch `kanji-adventure-bos`, `idea and plan/PLAN-BOS.md` | **user** |
| Q10 | `docs/kb-dokkai/` di-commit ke `main` (9471516) | **user, selesai** |
| Q11 | Pola dikuasai setelah **2 jawaban benar pada 2 varian berbeda** (`BENAR_DIKUASAI = 2`) | **user** (sesuai usulan) |
| F1a | Bab untuk 19 pola modul-saja = tabel §3.2 | **user** (sesuai usulan) |
| F1b | N4 Vol 5 tetap satu volume; Bab 49 dan 50 masing-masing 2 tahap | **user** (sesuai usulan) |
| Q12 | Kunci tetap dikirim bersama kertas untuk umpan balik langsung (risiko devtools diterima) | **user** 2026-11-22 |

Semua keputusan sudah diambil user. Butir yang tertulis "bawaan" diputuskan user 2026-11-21 dengan "semua sesuai usulan".
Q11 muncul karena Q2: bila peserta hanya memilih nomor ★, peluang menebak benar 1/4. Dua jawaban benar pada dua varian
menurunkan peluang lolos dengan menebak ke 1/16, sama dengan Kanji Adventure.

---

## 1. Peta berkas

| Berkas | Status | Isi |
|---|---|---|
| `server/domain/materiBunpou/katalog.js` | **sudah ada** | `KATALOG_MATERI`: 163 pola (N5 66, N4 97), id slug tetap, `tingkat`, `sumber.minnaBab`, `sumber.modulN4` |
| `server/domain/soalBintang.js` | baru | validator satu soal & satu bank, pembuat kertas (acak nomor), penilaian satu soal |
| `server/domain/bankSoal/bintangN5.js`, `bintangN4.js` | baru | `SOAL_BINTANG_N5`, `SOAL_BINTANG_N4` (N3 menyusul) |
| `server/domain/bunpouAdventure.js` | baru | volume, tahap, pemilihan varian, rencana sesi, penilaian sesi, evaluasi progres, gembok |
| `server/db/bunpouAdventureRepo.js` | baru | progres + kertas sesi, Postgres/lokal, pencatatan `latihan_sesi` |
| `supabase/migrations/004_bunpou_adventure.sql` | baru | 2 tabel + CHECK `latihan_sesi.jenis` |
| `server/apiApp.js` | diubah | 7 rute, kode galat baru |
| `server/db/engine.js` | diubah | state lokal `bunpouAdventureProgres`, `bunpouAdventureSesi` |
| `server/domain/aktivitasLatihan.js`, `server/domain/dashboard.js` | diubah | jenis `bunpou` |
| `src/services/bunpouAdventure.js` | baru | helper tampilan + klien API |
| `src/views/portal/PortalBunpouAdventureView.vue` | baru | pilih tingkat → volume → peta tahap → runner → hasil |
| `src/components/portal/bunpou/SoalBintang.vue`, `BintangRunner.vue` | baru | satu soal; rangkaian soal satu sesi |
| `src/components/monitor/MonitorBunpouAdventure.vue` | baru | panel per peserta di Monitor Latihan |
| `src/router/index.js`, `src/views/portal/PortalLayout.vue` | diubah | rute + menu |
| `src/views/MonitorLatihanView.vue` | diubah | memuat panel baru |
| `src/services/latihanHariIni.js`, `src/components/portal/LatihanHariIni.vue`, `src/components/dashboard/DashLatihanHarian.vue` | diubah | jenis `bunpou` di rincian waktu latihan |
| `src/locales/id.js`, `ja.js` | diubah | `portal.menu.bunpouAdventure`, `portal.bunpouAdventure.*`, `monitorLatihan.bunpou*`, label jenis |
| `.claude/skills/tulis-soal-bintang/` | baru | produksi bank (§8) |
| `package.json` | diubah | tes baru masuk `npm test` |

**Tidak diubah:** `kanjiAdventure.js` dan tabelnya (perbaikan bos di branch sendiri), Tes Online, flashcard, `nilai_ujian`,
katalog (hanya dibaca).

---

## 2. Bank soal dan `soalBintang.js`

### 2.1 Bentuk satu soal

```js
// server/domain/bankSoal/bintangN5.js
export const SOAL_BINTANG_N5 = [
  {
    id: 'N5-to-omou-1',                    // `${jlpt}-${pola}-${n}`; tetap selamanya
    pola: 'to-omou',                        // id di KATALOG_MATERI
    situasi: null,                          // mis. '（タクシーの 中{なか}で）'
    baris: [
      { pembicara: 'A', teks: 'ミラーさんは どこですか。' },
      { pembicara: 'B', sebelum: 'たぶん', sesudah: '。' },     // baris soal: sebelum/sesudah, tanpa teks
    ],
    potongan: ['かいぎしつに', 'いる', 'と', '思{おも}います'],   // urutan kunci
    bintang: 2,                             // kotak ke-3 bertanda ★ → kunci = 'と'
    urutanLain: [],                         // urutan lain yang sah (indeks potongan); ★ wajib jatuh di potongan yang sama
    terjemahan: 'A: Pak Miller di mana? B: Mungkin dia ada di ruang rapat.',
    pembahasan: '～と思います mengutip isi pikiran: kalimat bentuk biasa (かいぎしつに いる) + と + 思います.',
    status: 'draf',                         // 'draf' (lolos gate + peninjau) | 'ditinjau' (dicek sensei)
  },
];
```

Aturan teks sama dengan bank dokkai: furigana `漢字{かな}` pada setiap kanji, kanji dalam `kanjiTingkat(jlpt)`, angka Arab
(D4), tanpa huruf Latin, spasi antar frasa untuk N5 seperti sampel JLPT N5.

### 2.2 Fungsi

```js
export const JUMLAH_KOTAK = 4;

/** Masalah mekanis satu soal; [] = lolos. Dipakai npm test dan gate skill. */
export function validasiSoalBintang(soal, { katalog, jlpt }) → string[]
//  - id berformat `${jlpt}-${pola}-${n}`; pola ada di katalog dan tingkatnya = jlpt
//  - tepat satu baris soal (punya sebelum/sesudah, tidak punya teks); baris lain punya teks
//  - 4 potongan, tidak kosong, teks polos tidak kembar, bukan tanda baca saja
//  - bintang bilangan bulat 0–3
//  - setiap urutanLain permutasi [0..3], berbeda dari kunci, dan potongan[urutan[bintang]] === potongan[bintang]
//  - furiganaLengkap() untuk setiap teks; kanji ⊆ kanjiTingkat(jlpt); tanpa huruf Latin
//  - panjang baris soal (tanpa furigana dan tanpa spasi pemisah frasa): N5 ≤ 40, N4 ≤ 55, N3 ≤ 70 karakter
//  - polaDiAtasTingkat() dari aturanDokkai.js kosong (pola di atas tingkat tidak boleh dipakai)
//  - terjemahan dan pembahasan terisi
//  - terjemahan memuat >= 10 huruf Latin; pembahasan memuat >= 15 huruf Latin (penjelasan bahasa Indonesia, bukan kalimat Jepang saja)
//  - tidak ada potongan yang diawali huruf yang tak bisa memulai kata (kana kecil, ん/ン, ー; って) — pengecualian: ん yang
//    membuka ～んです / んでした / んでしょう / んじゃ
//  - potongan satu kana wajib partikel (は が を に へ で と も の や か ね よ)
//  - kata tidak boleh terputus di batas potongan: kalimat digabung dengan "|" (sebelum | potongan kunci | sesudah), akhiran
//    konjugasi yang lepas dari batangnya ditolak (ま|しょ|う, くだ|さい, で|す, まし|た, いけま|せん)
//  - status hanya 'draf' (lolos gate + peninjau buta) atau 'ditinjau' (juga disetujui sensei)
//  Semua penjaga ini tidak boleh dilonggarkan agar konten lolos: perbaiki kontennya (AGENTS.md).

/** Masalah tingkat bank: id unik, kalimat utuh tidak kembar, sebaran posisi ★ per volume. */
export function validasiBankBintang(bank, { katalog, jlpt }) → string[]

/** Kalimat utuh dengan urutan kunci, untuk tampilan hasil dan pemeriksaan. */
export function kalimatUtuh(soal) → string

/**
 * Kertas untuk peserta. Urutan potongan diacak, lalu diberi nomor 1–4.
 * `benar` dan `urutan` ikut dikirim agar umpan balik langsung tampil (seperti KanjiRunner);
 * server tetap menilai ulang dari kertas yang disimpan.
 */
export function kertasSoalBintang(soal, rng = Math.random) → {
  id, pola, situasi, baris, bintang,
  pilihan: [{ nomor: 1, teks }, …],   // 4 butir
  benar: 3,                            // nomor potongan yang jatuh di ★
  urutan: [2, 4, 3, 1],                // nomor dalam urutan kunci (untuk menampilkan kalimat benar)
  terjemahan, pembahasan,
}

export function nilaiSoalBintang(kertas, nomorDipilih) → boolean
```

---

## 3. Domain `bunpouAdventure.js`

### 3.1 Konstanta dan volume

```js
export const BENAR_DIKUASAI = 2;      // Q11
export const MIN_VARIAN = 4;          // BENAR_DIKUASAI + 2: cadangan untuk ulangan dan bos
export const MAKS_POLA_TAHAP = 6;
export const MIN_POLA_TAHAP = 2;      // bab dengan 1 pola digabung ke bab berikutnya
export const MAKS_POLA_BOS = 10;      // per ronde
export const AMBANG_PERHATIAN = 3;
export const MAKS_RIWAYAT = 20;
export const MAKS_JEJAK = 12;         // jejak jawaban per pola

export const VOLUME_BUNPOU = [
  { kode: 'BN5V1', jlpt: 'N5', nomor: 1, bab: [1, 4] },
  { kode: 'BN5V2', jlpt: 'N5', nomor: 2, bab: [5, 9] },
  { kode: 'BN5V3', jlpt: 'N5', nomor: 3, bab: [10, 15] },
  { kode: 'BN5V4', jlpt: 'N5', nomor: 4, bab: [16, 21] },
  { kode: 'BN5V5', jlpt: 'N5', nomor: 5, bab: [22, 25] },
  { kode: 'BN4V1', jlpt: 'N4', nomor: 1, bab: [26, 30] },
  { kode: 'BN4V2', jlpt: 'N4', nomor: 2, bab: [31, 35] },
  { kode: 'BN4V3', jlpt: 'N4', nomor: 3, bab: [36, 40] },
  { kode: 'BN4V4', jlpt: 'N4', nomor: 4, bab: [41, 45] },
  { kode: 'BN4V5', jlpt: 'N4', nomor: 5, bab: [46, 50] },
];

/** Pola yang tidak cocok dijadikan soal bintang (diisi di F1; kosong bila semua cocok). */
export const POLA_TANPA_BINTANG = [];
```

### 3.2 Pola modul tanpa bab Minna (Q5)

Bab sebuah pola = bab Minna terkecil di `sumber.minnaBab`. Ada 19 pola N4 yang hanya ada di modul 111 Bunpo N4, sehingga
tidak punya bab. Pola-pola itu diberi bab lewat `BAB_MODUL`. **Tabel ini disetujui user (2026-11-21).**

| Pola (id) | Modul | Bab | Alasan |
|---|---:|---:|---|
| ～（よ）うとする `you-to-suru` | 2 | 31 | bentuk maksud (意向形) diajarkan di Bab 31 |
| ～ことにする `koto-ni-suru` | 5 | 36 | berpasangan dengan ～ようにします (Bab 36), pasangan yang sering tertukar |
| ～ことになる `koto-ni-naru` | 6 | 36 | berpasangan dengan ～ようになります (Bab 36) |
| ～てほしい `te-hoshii` | 9 | 41 | keinginan atas tindakan orang lain, dekat dengan beri-terima Bab 41 |
| 疑問詞＋でも `gimonshi-demo` | 17 | 40 | Bab 40 mengajarkan 疑問詞＋か |
| ～みたいだ `mitai` | 29 | 47 | dugaan, satu bab dengan ～ようです |
| ～らしい `rashii` | 30 | 47 | kabar/dugaan, satu bab dengan ～そうです (kabar) |
| ～ていく `te-iku` | 36 | 43 | bentuknya sama dengan ～てきます (Bab 43) |
| ～てくる `te-kuru` | 37 | 43 | idem |
| ～てばかりいる `te-bakari-iru` | 38 | 46 | satu bab dengan ～たばかりです |
| ～まま `mama` | 46 | 34 | keadaan saat melakukan, dekat ～て／～ないで (Bab 34) |
| Nがする `ga-suru` | 48 | 47 | 音／声／においがします dipakai di Bab 47 |
| ～てさしあげる `te-sashiageru` | 65 | 41 | beri-terima sopan Bab 41 |
| お～いただく `o-itadaku` | 73 | 50 | kenjougo Bab 50 |
| もうしあげる `kenjougo-moushiageru` | 87 | 50 | kenjougo Bab 50 |
| ～でございます `de-gozaimasu` | 89 | 50 | bahasa sopan Bab 50 |
| Nばかり `bakari` | 95 | 46 | satu bab dengan ～たばかりです |
| 数詞＋も `suushi-mo` | 96 | 44 | penekanan jumlah/derajat, dekat ～すぎます (Bab 44) |
| ～さ `sa` | 101 | 44 | mengubah kata sifat, dekat ～く／～にします (Bab 44) |

Isi volume dari katalog + tabel ini:

| Volume | N5 | Volume | N4 (Minna + modul) |
|---|---:|---|---:|
| Vol 1 (Bab 1–4) | 10 | Vol 1 (Bab 26–30) | 14 |
| Vol 2 (Bab 5–9) | 13 | Vol 2 (Bab 31–35) | 17 + 2 = 19 |
| Vol 3 (Bab 10–15) | 16 | Vol 3 (Bab 36–40) | 10 + 3 = 13 |
| Vol 4 (Bab 16–21) | 19 | Vol 4 (Bab 41–45) | 13 + 6 = 19 |
| Vol 5 (Bab 22–25) | 8 | Vol 5 (Bab 46–50) | 24 + 8 = 32 |

N4 Vol 5 paling berat (Bab 49 dan 50 adalah keigo, 20 pola), tetapi **tetap satu volume** (keputusan user). Bab 49
(9 pola) dan Bab 50 (11 pola) masing-masing dipecah menjadi 2 tahap oleh `MAKS_POLA_TAHAP = 6`.

### 3.3 Fungsi

```js
export function babPola(entri) → number | null            // min(minnaBab) atau BAB_MODUL[id]
export function polaVolume(kode, { katalog }) → string[]   // urut bab, lalu urutan katalog

/** Tahap = satu bab; bab dengan 1 pola digabung ke bab berikutnya; bab dengan > 6 pola dipecah rata. */
export function tahapVolume(kode, { katalog }) → [{ index, babDari, babSampai, bagian, jumlahBagian, pola: [id] }]

/** Volume dirilis bila setiap polanya punya ≥ MIN_VARIAN soal di bank. */
export function statusRilis(kode, { katalog, bank }) → { dirilis, kurang: [{ pola, ada }] }

/** Vol 1 tiap tingkat selalu terbuka; Vol n perlu Vol n-1 di tingkat yang sama selesai. */
export function volumeTersedia(semuaProgres, kode) → boolean

/**
 * Varian untuk satu pola, deterministik:
 * buang varian yang sudah benar (di tahap) dan varian percobaan terakhir; urutkan belum pernah dilihat →
 * paling lama tidak dilihat → urutan bank. Bila calon kurang, isi dengan varian yang dibuang (kecuali yang terakhir,
 * selama ada pilihan lain). Satu sesi tidak pernah memuat varian yang sama dua kali.
 */
export function pilihVarian(soalPola, jejakPola, { jumlah, benarIds = [] }) → soal[]

/**
 * Rencana satu sesi. Melempar TAHAP_TIDAK_VALID / TAHAP_TERKUNCI.
 * - tahap: setiap pola yang belum dikuasai mendapat (BENAR_DIKUASAI − benar[pola].length) varian. Bila semua
 *   pola sudah dikuasai (mengulang tahap lama), setiap pola mendapat 1 varian sebagai latihan bebas.
 *   Urutan soal diselang-seling: varian ke-1 semua pola, lalu varian ke-2.
 * - bos: perlu semua tahap lulus dan bos tidak kosong; maks. MAKS_POLA_BOS pola (salah terbanyak dulu), 1 varian.
 */
export function rencanaSesi(progres, kode, input, { bank, rng }) → { mode, tahapIndex, ronde, polaIds, kertas }

export function nilaiSesi(kertas, jawaban) → {
  detail: [{ soalId, pola, dipilih, benar, kunci, urutan }], benar, total, skor, lulus,
}

export function evaluasiProgres(progres, hasil, { tahapIndex, sekarang }) → progresBaru   // murni
export function ringkasProgres(progres) → { tahap_terbuka, dikuasai, bos, selesai, perlu_perhatian }
```

### 3.4 Bentuk progres

```js
{
  volume: 'BN5V4',
  tahap: [{ babDari: 16, babSampai: 16, bagian: 1, jumlahBagian: 1, pola: ['te-te', 'te-kara', 'wa-ga', 'kute-de'] }, …],
  tahap_terbuka: 0,
  benar: { 'te-kara': ['N5-te-kara-2'] },          // varian berbeda yang pernah dijawab benar
  dikuasai: ['te-te'],                              // benar[pola].length >= BENAR_DIKUASAI; tidak pernah berkurang
  bosses: [{ id: 'te-kara', salah: 2, terakhirSalah: '2026-…' }],   // pernah salah dan belum lolos bos
  salah: { 'te-kara': 2 },                          // hitungan kumulatif untuk sensei (tidak ikut berkurang)
  jejak: { 'te-kara': [{ soal: 'N5-te-kara-1', waktu: '2026-…', benar: false }] },   // maks. MAKS_JEJAK per pola
  bos_ronde: 0, selesai: false, perlu_perhatian: false,
  riwayat: [{ tahapIndex, ronde, benar, total, lulus, waktu }],    // maks. MAKS_RIWAYAT
}
```

`bosses` sengaja memakai nama dan bentuk yang sama dengan Kanji Adventure, dengan arti yang sudah diperbaiki (pernah
salah), supaya panel monitor dan helper status bisa disusun dengan pola yang sama.

### 3.5 Aturan `evaluasiProgres`

1. Tambah jejak setiap jawaban (potong ke `MAKS_JEJAK`).
2. Jawaban benar menambah id soal ke `benar[pola]` (unik). `dikuasai` = gabungan lama + pola dengan
   `benar[pola].length >= BENAR_DIKUASAI`.
3. Jawaban salah selalu menambah `salah[pola]`.
4. Bila volume belum selesai: jawaban salah memasukkan pola ke `bosses` atau menambah `salah`-nya. Jawaban benar di
   tahap **tidak** mengeluarkan pola dari bos.
5. Mode bos: pola yang dijawab benar keluar dari `bosses`. Satu jawaban benar sudah cukup.
6. Tahap lulus bila semua polanya dikuasai: `tahap_terbuka = max(tahap_terbuka, index + 1)`.
7. `selesai = progres.selesai || (tahap_terbuka >= tahap.length && bosses.length === 0)`. Nilainya tetap: mengulang
   tahap di volume yang sudah selesai tidak pernah mengunci volume berikutnya.
8. `bos_ronde + 1` di mode bos. `perlu_perhatian = bos_ronde >= 3 || ada pola dengan salah >= 3`.

---

## 4. Penyimpanan

### 4.1 Migration `004_bunpou_adventure.sql`

Migration dijalankan otomatis setiap kali server mulai (`engine.js:445-450`), jadi harus idempoten.

```sql
-- Bunpou Adventure: satu baris progres per peserta per volume. tahap dibekukan saat volume dibuka.
CREATE TABLE IF NOT EXISTS bunpou_adventure_progres (
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  volume VARCHAR(16) NOT NULL,
  tahap JSONB NOT NULL DEFAULT '[]'::jsonb,
  tahap_terbuka INTEGER NOT NULL DEFAULT 0,
  benar JSONB NOT NULL DEFAULT '{}'::jsonb,
  dikuasai JSONB NOT NULL DEFAULT '[]'::jsonb,
  bosses JSONB NOT NULL DEFAULT '[]'::jsonb,
  salah JSONB NOT NULL DEFAULT '{}'::jsonb,
  jejak JSONB NOT NULL DEFAULT '{}'::jsonb,
  bos_ronde INTEGER NOT NULL DEFAULT 0,
  selesai BOOLEAN NOT NULL DEFAULT FALSE,
  perlu_perhatian BOOLEAN NOT NULL DEFAULT FALSE,
  riwayat JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (peserta_id, volume)
);
CREATE INDEX IF NOT EXISTS idx_bunpou_adventure_progres_peserta ON bunpou_adventure_progres (peserta_id);

-- Kertas yang sedang dikerjakan (kunci hanya di server). Dihapus setelah dinilai atau kedaluwarsa.
CREATE TABLE IF NOT EXISTS bunpou_adventure_sesi (
  id VARCHAR(64) PRIMARY KEY,
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  volume VARCHAR(16) NOT NULL,
  mode VARCHAR(16) NOT NULL DEFAULT 'tahap',
  tahap_index INTEGER NOT NULL,
  ronde INTEGER NOT NULL DEFAULT 0,
  aktivitas_id INTEGER,
  pola_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  soal JSONB NOT NULL DEFAULT '[]'::jsonb,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  kedaluwarsa_pada TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bunpou_adventure_sesi_peserta ON bunpou_adventure_sesi (peserta_id);
CREATE INDEX IF NOT EXISTS idx_bunpou_adventure_sesi_kedaluwarsa ON bunpou_adventure_sesi (kedaluwarsa_pada);

-- latihan_sesi.jenis menerima 'bunpou'. Hanya diganti sekali (dicek dari definisinya).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'latihan_sesi_jenis_check' AND pg_get_constraintdef(oid) LIKE '%bunpou%'
  ) THEN
    ALTER TABLE latihan_sesi DROP CONSTRAINT IF EXISTS latihan_sesi_jenis_check;
    ALTER TABLE latihan_sesi ADD CONSTRAINT latihan_sesi_jenis_check
      CHECK (jenis IN ('flashcard', 'kanji', 'dokkai', 'bunpou'));
  END IF;
END $$;
```

Nama constraint `latihan_sesi_jenis_check` adalah nama bawaan Postgres untuk CHECK sebaris di `001_initial_schema.sql:285`.
Sebelum deploy, nama itu dicek di Supabase (`SELECT conname FROM pg_constraint WHERE conrelid = 'latihan_sesi'::regclass`).

### 4.2 Repo `bunpouAdventureRepo.js`

Meniru `kanjiAdventureRepo.js` fungsi demi fungsi (Postgres bila `DATABASE_URL` valid, selain itu state lokal; `tanpaGagal`
untuk baca):

`bacaProgresBunpou`, `daftarProgresBunpou`, `simpanProgresBunpou`, `pastikanProgresBunpou(pesertaId, volume, tahap)`
(snapshot sekali, idempoten), `tambahSesiBunpou` → `catatLatihanBaru(pesertaId, { jenis: 'bunpou', materi: 'adventure',
materiJudul: 'Bunpou Adventure · N5 Vol 4 · Bab 16', jlpt, jumlahItem })`, `simpanSesiBunpou`, `bacaSesiBunpou`,
`hapusSesiBunpou` (kedaluwarsa 30 menit, seperti Kanji Adventure).

### 4.3 Jenis latihan `bunpou`

| Tempat | Perubahan |
|---|---|
| `server/domain/aktivitasLatihan.js:10, 92` | `JENIS_AKTIVITAS` dan `perJenis` mendapat `bunpou` |
| `server/domain/dashboard.js:68` | `detik` harian mendapat `bunpou` |
| `src/services/latihanHariIni.js:17, 62` | `perJenis` mendapat `bunpou` |
| `src/components/portal/LatihanHariIni.vue:43` | baris jenis baru (warna baru dari palet yang ada) |
| `src/components/dashboard/DashLatihanHarian.vue:88, 97` | idem |
| `src/locales/*` | label jenis "Bunpou" / 「文法」 |

`gradeLatihan.js` tidak diubah. Grade dihitung dari semua sesi latihan, sehingga sesi `bunpou` otomatis ikut.

---

## 5. API (`server/apiApp.js`)

| Method | Path | Auth | Respons |
|---|---|---|---|
| GET | `/api/portal/bunpou-adventure/volume` | `requirePeserta` | `[{ kode, jlpt, nomor, judul, bab, jumlahPola, tahapCount, dirilis, terkunci, progres }]` |
| GET | `/api/portal/bunpou-adventure/volume/:kode` | `requirePeserta` | `{ …info, dirilis, terkunci, tahap: [{ index, label, jumlah, dikuasai, status }], bos: { status, jumlah, rondeBerikut, pola: [{ id, pola, arti, salah }] } }` |
| POST | `/api/portal/bunpou-adventure/mulai` | `requirePeserta` | body `{ volume, tahapIndex }` atau `{ volume, mode: 'bos' }` → `{ sesiId, aktivitasId, mode, tahapIndex, ronde, soal: kertas[] }` |
| POST | `/api/portal/bunpou-adventure/detak` | `requirePeserta` | `{ ok, aktivitasId }` |
| POST | `/api/portal/bunpou-adventure/nilai` | `requirePeserta` | body `{ sesiId, jawaban: { [soalId]: nomor }, detikAktif }` → `{ benar, total, skor, lulus, detail, tahapTuntas, sisa, bosBaru, tahapTerbuka, selesai, grade, progres, bos }` |
| GET | `/api/portal/bunpou-adventure/riwayat` | `requirePeserta` | progres semua volume + sesi `materi: 'adventure'` berjenis `bunpou` |
| GET | `/api/monitor-latihan/bunpou-adventure/peserta/:id` | `requireAuth` + `requirePageAccess('monitor-latihan')` | volume seperti di atas + `polaLemah: [{ id, pola, arti, salah, bab }]` (10 teratas dari `salah`) |

- Alur `mulai`, `detak`, dan `nilai` sama persis dengan rute Kanji Adventure (`apiApp.js:595-738`): gerbang diperiksa
  saat `mulai` **dan** saat `nilai`, kunci hanya dari kertas tersimpan, progres disimpan dulu baru sesi latihan ditutup,
  dan grade diambil dari `getRiwayatLatihanPeserta`.
- Volume yang belum dirilis ditolak `mulai` dengan `VOLUME_BELUM_DIRILIS`.
- Kode galat baru masuk `handleRouteError` (`apiApp.js:215-240`): `INVALID_BUNPOU_VOLUME`, `TAHAP_TIDAK_VALID` (400),
  `GAGAL_SESI_BUNPOU` (503), `TAHAP_TERKUNCI`, `VOLUME_BELUM_DIRILIS` (403; `VOLUME_TERKUNCI` sudah ada).
- *(F7b, opsional)* `GET /api/monitor-latihan/bunpou-adventure/kelas/:kelasId/pola-lemah`: jumlah `salah` per pola untuk
  semua peserta di kelas itu.

---

## 6. Tampilan

### 6.1 Portal peserta

- Rute `{ path: 'bunpou-adventure', name: 'portal-bunpou-adventure', component: PortalBunpouAdventureView, meta: {
  portalTitle: 'portal.menu.bunpouAdventure' } }` di bawah rute Kanji Adventure (`router/index.js:129`). Menu di
  `PortalLayout.vue:145`, ikon `mdi-star-four-points` (sejalan dengan `mdi-sword-cross` milik Kanji Adventure).
- `PortalBunpouAdventureView.vue` mengikuti tata letak `PortalKanjiAdventureView.vue`: pilihan tingkat (N5/N4), kartu
  volume dengan progres dan sisa bos (volume belum dirilis: "Segera"), peta tahap per bab, kartu bos, hasil sesi.
- `SoalBintang.vue` (satu soal, format JLPT):

```
（タクシーの 中で）                                 ← situasi (bila ada)
A「すみません、つぎの ＿＿＿ ★ ＿＿＿ ＿＿＿ まがって ください。」
B「はい、わかりました。」

  ( 1  に )   ( 2  しんごう )   ( 3  右 )   ( 4  を )     ← pilihan; satu dipilih

Setelah memilih:
  ✓ / ✗   すみません、つぎの しんごう を★ 右 に まがって ください。   ← kalimat utuh, ★ disorot
  Jawaban ★ = 4 · Tolong belok kanan di lampu lalu lintas berikutnya.
  Pembahasan: …
```

  Kotak isian berupa garis bawah; kotak ★ diberi tanda dan warna aksen. Pilihan berupa tombol radio besar (≥ 44 px),
  bisa dipilih dengan tombol 1–4. Kalimat dirender lewat `FuriganaText` (furigana selalu tampil). Semua teks Jepang
  diberi `lang="ja"` dan `translate="no"`.
- `BintangRunner.vue` menjalankan satu sesi: nomor soal, umpan balik per soal (seperti `KanjiRunner`), detak 15 detik
  lewat `src/services/aktivitasLatihan.js`, dan kirim jawaban di akhir.
- Teks hasil: "Pola dikuasai 3/4", "2 pola masuk bos", "Tahap berikutnya terbuka", "Ronde bos: 10 dari 14 pola".

### 6.2 Sensei

`MonitorBunpouAdventure.vue` dimuat di detail peserta `MonitorLatihanView.vue` di bawah panel Kanji Adventure (dimuat
terpisah, seperti panel Kanji Adventure, supaya tabel yang belum ada tidak menghalangi halaman). Isinya progres per volume
dan daftar **pola lemah**. Di samping setiap pola ada tautan ke halaman Materi Bunpou pola itu
(`/materi-bunpou/:id`, rute yang sudah ada di `main`), yang hanya tampil bila user punya akses halaman `materi-bunpou`.

---

## 7. Tes

| Berkas | Isi |
|---|---|
| `server/domain/soalBintang.test.js` | validator menolak: 3 kotak (kasus no. 18 PDF), potongan kembar, ★ tidak sama di urutanLain, furigana kurang, kanji di luar tingkat, pola tidak ada di katalog. Kertas: nomor teracak tetapi `benar` selalu menunjuk potongan di ★; `urutan` membentuk kalimat kunci. Bank nyata: setiap soal di `bintangN5.js`/`bintangN4.js` lolos validator (tes ini sekaligus gate di `npm test`). |
| `server/domain/bunpouAdventure.test.js` | `tahapVolume`: gabung bab 1 pola, pecah bab > 6 pola, semua pola volume tercakup tepat sekali. Setiap pola N4 punya bab (`babPola` tidak null). `pilihVarian`: tidak mengulang varian terakhir, tidak memberi varian yang sudah benar, tidak ada duplikat dalam sesi, deterministik. `evaluasiProgres`: dikuasai baru setelah 2 varian benar; benar di tahap tidak mengeluarkan dari bos; **volume dengan kesalahan selalu berakhir di ronde bos**; volume bersih melewati bos; bos maks. 10 per ronde; `selesai` tetap. `volumeTersedia`: Vol 1 N4 terbuka tanpa N5; Vol 2 perlu Vol 1. |
| `server/db/bunpouAdventureRepo.test.js` | snapshot tahap tidak berubah saat dipanggil ulang; bentuk objek sama di mode lokal dan Postgres palsu; kertas kedaluwarsa tidak terbaca. |
| `server/apiApp.bunpouAdventure.test.js` | tanpa token 401; tahap/volume terkunci 403 walau dipanggil langsung; volume belum dirilis 403; `nilai` dengan sesi orang lain ditolak; jawaban dinilai dari kertas tersimpan; sesi tercatat `latihan_sesi` jenis `bunpou` mode `latihan`; grade berubah; endpoint sensei ditolak tanpa akses `monitor-latihan`. |
| `src/services/bunpouAdventure.test.js`, `src/views/portal/bunpouAdventureUI.test.js` | helper status dan teks, mengikuti tes Kanji Adventure. |
| Regresi | `aktivitasLatihan`, `gradeLatihan`, `dashboard`, `kanjiAdventure*`, `materiBunpou` tetap hijau. |

Cek visual: Playwright dengan fixture lokal (cara di memori proyek `cek-visual-halaman-staf`), lebar 390 px dan 1280 px:
peta volume, soal bintang sebelum/sesudah memilih, soal dialog dengan situasi, hasil sesi, kartu bos, panel monitor.

---

## 8. Skill `tulis-soal-bintang`

`.claude/skills/tulis-soal-bintang/`: `SKILL.md`, `references/gaya-soal.md` (aturan §2.1 + pelajaran pilot),
`scripts/periksa-bintang.mjs` (memanggil `validasiSoalBintang`/`validasiBankBintang`, jadi gate dan `npm test` memakai satu
sumber), `scripts/inject-bintang.mjs` (tambah, atau `--ganti` per id).

Alur per volume:
1. **Penulis** (satu agen per volume, maks. ±20 pola per agen): daftar pola tahap + entri katalog + kosakata Minna sampai bab
   itu (`docs/kb-dokkai/data/minna-kosakata.json`) + aturan teks KB. Menulis `MIN_VARIAN` (4) varian per pola. Antarvarian
   berbeda konteks dan posisi ★.
2. **Gate mekanis** `periksa-bintang.mjs`.
3. **Peninjau buta**: menerima kerangka kalimat + 4 potongan bernomor acak **tanpa kunci**. Tugasnya (a) memilih nomor ★
   dan menyusun urutan lengkap, (b) mendaftar setiap urutan lain yang juga gramatikal, (c) menilai kewajaran dan tingkat,
   (d) memeriksa terjemahan. Soal lolos bila nomor ★ peninjau sama dengan kunci dan setiap urutan sah memberi ★ yang sama.
   Urutan lain dicatat ke `urutanLain`. Soal yang gagal ditulis ulang, bukan ditambal.
4. **Inject** ke `bintangN5.js`/`bintangN4.js`, lalu `npm test`.

Perkiraan bank: N5 66 pola × 4 = **264 soal**, N4 97 × 4 = **388 soal** (berkurang bila ada pola di `POLA_TANPA_BINTANG`).

---

## 9. Urutan kerja

| Fase | Langkah | Selesai bila |
|---|---|---|
| **F1** | `BAB_MODUL`, `POLA_TANPA_BINTANG`, `tahapVolume` + laporan `docs/bunpou-adventure/volume.md` (pola per volume per tahap) | laporan cocok dengan keputusan F1a/F1b (pembagian sudah disetujui) |
| **F2** | Pilot: `soalBintang.js` + validator, 12 pola (Bab 1, 2, 16, 19) × 4 varian = 48 soal lewat alur §8 secara manual, pratinjau HTML di scratchpad | user/sensei menyetujui gaya, tingkat kesulitan, dan pembahasan |
| **F3** | `bunpouAdventure.js` + tes domain | `npm test` hijau |
| **F4** | migration 004, repo, state lokal, jenis `bunpou` di §4.3 | tes repo hijau, mode lokal jalan |
| **F5** | 7 rute API + tes API | semua kasus §7 lolos |
| **F6** | UI portal, i18n id/ja, menu, cek visual | tangkapan layar 390/1280 px dicek |
| **F7** | panel sensei (+ F7b ringkasan kelas, opsional) | sensei melihat pola lemah per peserta |
| **F8** | skill + produksi: N5 Vol 1 → Vol 5, lalu N4 Vol 1 → Vol 5 | setiap volume lolos gate + peninjau + `npm test` |
| **F9** | rilis bertahap: deploy saat N5 Vol 1 dan N4 Vol 1 lengkap; volume lain tampil "Segera" sampai banknya penuh | verifikasi produksi dengan akun uji |

F3–F7 tidak bergantung pada isi pilot dan bisa dikerjakan bersamaan dengan F2. Tes F3–F5 memakai bank kecil buatan
(fixture), bukan bank nyata.
