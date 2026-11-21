# Spek 05 — Materi N3: kanji (tes kode, latihan, flashcard, Kanji Adventure) dan bank dokkai N3

Fase F4 (bagian A) dan F6 (bagian B) di [plan.md](plan.md). Mengubah keputusan D9/D10 lama ([../12-n3.md](../12-n3.md) §9):
**N3 sekarang mendapat materi penuh** (permintaan user 2026-11-20).

---

## A. Kanji N3

### A.1 Data: `server/domain/bankSoal/kanjiN3.js` (baru)

Bentuk sama dengan `kanjiN4.js`:

```js
// Bank kanji JLPT N3 (Tes Online, latihan, flashcard, Kanji Adventure): [kata, bacaan, arti]. Sumber: … (lihat Q1).
export const KANJI_VOLUME_N3 = {
  VOL1: [["愛", "あい", "Cinta / kasih sayang"], ["最近", "さいきん", "Akhir-akhir ini"], …],
  …
  VOL5: […],
};
// Bacaan benar lain yang tidak boleh menjadi pengecoh.
export const BACAAN_LAIN_N3 = { … };
```

Aturan isi (sama dengan N4, `kanjiN4.js:1-3`): arti bahasa Indonesia, beberapa arti dipisah `" / "`; bacaan tanpa する;
bacaan kedua ke `BACAAN_LAIN_N3`; satu kata boleh muncul di dua volume (ditanya sekali di N3SEMUA).

**Sumber data (plan §9 Q1):**

| Pilihan | Isi | Catatan |
|---|---|---|
| (a) Excel sensei | seperti N4 | Paling sesuai materi kelas; diproses dengan skrip konversi yang sama seperti N4 |
| (b) Disusun dari KB | 369 kanji N3 ([../13-kanji-n3.md](../13-kanji-n3.md)), 5 volume menurut urutan frekuensi (±74 kanji/volume). Tiap kanji → satu kata yang memuatnya (contoh di PDF rirekishobuilder bila memuat kanjinya; selain itu kata umum), bacaan, arti Indonesia | **Wajib ditinjau sensei** sebelum dipakai di kode bernilai; dahulukan 142 kanji yang belum ada di volume N5/N4 di volume awal. **Dipilih; sudah ditinjau sensei (2026-11-21).** |

Pemeriksaan data (skrip, seperti `periksa` saat N4 dibuat): tiap entri punya kanji, bacaan kana, arti; tidak ada arti
beririsan dalam satu volume (`artiBeririsan`, `tesOnline.js:218`); semua kanji N3 daftar 13 tercakup (bila pilihan b).

### A.2 Server: `server/domain/tesOnline.js`

| Baris | Sekarang | Sesudah |
|---|---|---|
| 8 | import N4 | + `import { KANJI_VOLUME_N3, BACAAN_LAIN_N3 } from './bankSoal/kanjiN3.js';` |
| 19–20 | `JLPT_KANJI = ['N5', 'N4']` | `['N5', 'N4', 'N3']` |
| 21–24 | `VOLUME_KATA` N5 + N4 | + `N3VOL1…` (prefix `N3`) |
| 26 | `SEMUA_LEVEL = { SEMUA: 'N5', N4SEMUA: 'N4' }` | + `N3SEMUA: 'N3'` |
| 29 | `jlptKanji` = startsWith('N4') | `/^N([34])/.exec(kode)?.[0] ?? 'N5'` (N3/N4, selain itu N5) |
| 32 | `nomorVolume` regex `/^(N4)?VOL/` | `/^(N[34])?VOL/` |
| 35 | `bacaanLain` N5 + N4 | + N3 |
| 91–101 | `daftarMateriTes` kanji per `JLPT_KANJI` | otomatis: `N3VOL1…`, `N3SEMUA`, nama ujian `KJ-N3-V1…KJ-N3-ALL` (awalan `KJ-${jlpt}-` sudah generik) |
| 143–145 | `volumeKanjiDefault`: N5 → N5; lainnya → **semua** volume | **kumulatif per tingkat**: N5 → N5; N4 → N5+N4; N3 → N5+N4+N3 |
| 505 | `KANJI_DIPELAJARI = kanjiDariVolume()` (semua) | tetap (= semua volume), **ditambah** `export const kanjiTingkat = (jlpt) => kanjiDariVolume(volumeKanjiDefault(jlpt))` |

**Mengapa `volumeKanjiDefault` harus diubah:** sekarang N4/N3 memakai `[...VOLUME_KANJI]`; begitu volume N3 ditambahkan,
kode dokkai N4 tanpa pilihan volume akan diam-diam boleh memakai kanji N3. Dengan versi kumulatif, kode N4 lama
(pilihan volume `null`) tetap N5+N4 persis seperti sekarang. Kode N3 lama (`null`) mulai memakai N5+N4+N3 — wajar,
karena bacaan N3 memang memakai kanji N3.

Pemakai `KANJI_DIPELAJARI` sebagai batas tingkat diganti `kanjiTingkat(jlpt)`:

- `server/ai/dokkaiAi.js:175` (default `kanjiBoleh`) → `kanjiTingkat(jlpt)` (pemanggil di repo sudah mengirim nilai sendiri).
- `validasiBacaanAi` (572) default → `kanjiTingkat(jlpt)`.
- `server/domain/bunpou.test.js:115` (kanji bank N4 harus dipelajari) → `kanjiTingkat('N4')`, supaya uji tetap bermakna.
- Skill `generate-soal` (`_umum.mjs:309`) → `kanjiTingkat(jlpt)`.

### A.3 Frontend

| File | Perubahan |
|---|---|
| `src/utils/volumeKanji.js:1-10` | `jlptVolume`: N3/N4/N5 dari awalan; `labelVolumeKanji`: regex `/^(N[34])?VOL(\d+)$/` |
| `src/components/BankSoalTes.vue:291` | `['SEMUA', 'N4SEMUA', 'N3SEMUA']` |
| `src/views/portal/PortalTesView.vue` | tidak ada perubahan logika (baris volume per tingkat dibangun dari data, 262–272; tombol N3 dari `res.jlptKanji`, 338); perbarui komentar 254–261 |
| `src/views/TesOnlineView.vue` | tidak ada perubahan logika; komentar 366 |
| `src/views/portal/PortalKanjiAdventureView.vue` | cek tampilan pemilih tingkat (`level`, 288, 408) dengan tiga tingkat |
| `src/locales/*` | label bila ada teks "N5/N4" tertulis langsung (cek saat implementasi) |

### A.4 Flashcard

`server/domain/flashcard.js:13` `VOLUME_FLASHCARD = VOLUME_KANJI` → volume N3 otomatis ada; label (19) memakai
`jlptKanji`/`nomorVolume` yang sudah diperbarui. Progres flashcard tersimpan per volume (`flashcard_progres`), jadi volume baru
mulai kosong; tidak ada migrasi. Uji: `flashcard.test.js` — volume N3 muncul dan berlabel "N3 · Volume 1".

### A.5 Kanji Adventure

`server/domain/kanjiAdventure.js:10` `URUTAN_VOLUME = [...VOLUME_KANJI]` → N3VOL1–N3VOL5 ditambahkan di belakang N4VOL5; aturan
buka yang ada berlaku (volume berikutnya terbuka setelah volume sebelumnya tuntas). Progres lama tidak berubah; peserta yang
sudah menuntaskan N4VOL5 langsung melihat N3VOL1 terbuka. Uji: `kanjiAdventure.test.js` — urutan volume (panjang + posisi
N3VOL1 setelah N4VOL5), `volumeTersedia` untuk N3, `itemVolume('N3VOL1')`; uji lama `itemVolume('N3')` tetap melempar
`VOLUME_KANJI_TIDAK_VALID` (kode materi, bukan volume).

### A.6 Tes kode dan latihan tanpa kode

- Kode kanji: materi `N3VOL1…N3VOL5`, `N3SEMUA` muncul di form sensei dan Bank Soal; penilaian kanji (½ bacaan + ½ arti) sama.
- Latihan kanji portal: tombol N3 muncul dari `jlptKanji`.
- Dokkai: pilihan volume kanji N3 muncul di form kode dan latihan (baris N3) secara otomatis; default per tingkat dari
  `volumeKanjiDefault`.

---

## B. Bank dokkai N3 (50 soal per level)

### B.1 Ukuran

"50 soal awal per kategori" = **50 soal per level L1–L5** = 25 bacaan × 2 soal per level → **125 bacaan / 250 soal**
(plan §9 Q2). Ukuran sama dengan bank N4.

### B.2 File: `server/domain/bankSoal/dokkaiN3.js` (baru)

```js
// Bank soal dokkai N3 (Tes Online): 5 level × 25 bacaan × 2 soal. Ditulis lewat skill generate-soal (--jlpt N3).
export const DOKKAI_N3_LEVEL = [
  { kode: 'L1', judul: 'Level 1', deskripsi: '短文 · penjelasan & instruksi', bacaan: [ /* N3L1-1 … N3L1-25 */ ] },
  { kode: 'L2', judul: 'Level 2', deskripsi: '短文 · esai & pengalaman', bacaan: [] },
  { kode: 'L3', judul: 'Level 3', deskripsi: '中文 · kata tunjuk & sebab-akibat', bacaan: [] },
  { kode: 'L4', judul: 'Level 4', deskripsi: '中文 · contoh & pendapat penulis', bacaan: [] },
  { kode: 'L5', judul: 'Level 5', deskripsi: '長文 · gagasan utama', bacaan: [] },
];
```

- ID `N3L1-1`; field sama dengan bank N5 (tanpa `bunpou`): `id, judul, teks, terjemahan, soal[{id, tanya, tanyaId, opsi, benar, pembahasan}]`.
- `tesOnline.js:65`: `BANK_DOKKAI = { N5, N4, N3: DOKKAI_N3_LEVEL }`; komentar 59 diperbarui. `judulPerJlpt` otomatis memakai
  judul level N3 (`judulLevel`, 104–107).
- Validasi pembuka kode (`tesOnline.js:439`): kode bank N3 tidak lagi butuh bacaan AI yang disetujui.

### B.3 Isi per level

| Level | Jenis (resmi N3) | Panjang | Jenis pertanyaan | Topik |
|---|---|---|---|---|
| L1 | 短文: memo kantor, pengumuman, email kerja | 150–200 | apa yang harus dilakukan; maksud pesan | kerja, asrama, kantor, kota |
| L2 | 短文: esai pendek, pengalaman | 150–200 | maksud bagian yang dirujuk; pendapat penulis | pengalaman di Jepang, budaya, kebiasaan |
| L3 | 中文: penjelasan, esai | 300–350 | kata tunjuk; sebab-akibat | kerja, masyarakat, kesehatan |
| L4 | 中文: esai, artikel | 330–380 | contoh dari pernyataan umum; pendapat penulis | perubahan kota, teknologi, keluarga |
| L5 | 長文: esai, artikel, surat | 500–550 | satu detail/rujukan; gagasan utama/tema | isu sosial, pekerjaan, pendidikan |

Aturan tata bahasa, gaya (bentuk biasa di esai dan pertanyaan), catatan (注), dan pengecoh: spek-01 §3–§4 dan
[../12-n3.md](../12-n3.md) §4–§5. Kanji dirapikan ke volume N5+N4+N3 (`rapikan.mjs`), jadi **F4 harus selesai lebih dulu**.

### B.4 Pelaksanaan (skill `generate-soal`, mode tambah)

```text
node SKILL/scripts/siapkan.mjs --jlpt N3 --jumlah 25     # kelima level
```

- Penulis per level, paling banyak 5 bacaan per panggilan alat (L5: 3), sesuai pelajaran pemakaian skill sebelumnya
  (batas 32.000 token keluaran per balasan subagen).
- Gate mekanis (batas N3 di spek-02 §2.1) → `rapikan.mjs` → peninjau buta → banding → perbaiki → `inject.mjs`.
- Setelah inject: angka uji baru di `tesOnline.test.js:53` → `N3: { jumlah: 125, jumlahSoal: 250 }`, pool L2 N3 = 25 + AI;
  `npm test`.

### B.5 Uji

- `tesOnline.test.js`: katalog perJlpt N3 125/250; kode bank N3 bisa dibuka tanpa AI; kertas N3 tidak memuat kanji di
  luar volume yang dipilih.
- Bank N3: semua kanji ∈ `kanjiTingkat('N3')` (uji seperti `bunpou.test.js:115`).
