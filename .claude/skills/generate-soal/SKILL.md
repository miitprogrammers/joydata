---
name: generate-soal
description: Menulis soal dokkai (bacaan + pertanyaan pilihan ganda bahasa Jepang N5, level L1–L5) baru untuk bank soal Tes Online JOYdata lewat alur multi-agen bergerbang mutu — agen penulis per level, gate mekanis, peninjau independen yang menjawab tanpa kunci, lalu inject ke server/domain/bankSoal/dokkaiN5.js hanya bila semuanya lolos. Pakai skill ini setiap kali user meminta "generate soal", "tambah soal", "buat soal baru", "tambah bacaan dokkai", "perbanyak bank soal", "soal dokkai kurang", atau menyebut jumlah soal/bacaan baru per level — juga bila user hanya berkata "tambah 20 soal lagi" tanpa menyebut kata dokkai, dan bila diminta memperbaiki atau mengganti soal dokkai yang sudah ada di bank.
---

# Generate soal dokkai

Soal di bank dipakai untuk tes bernilai: nilainya masuk rapor peserta. Satu furigana salah atau satu soal
berjawaban ganda merugikan orang sungguhan, dan begitu masuk bank, soal itu ikut terundi di setiap tes. Karena
itu alur ini memisahkan tiga peran — yang menulis, yang memeriksa, yang memasukkan — dan tidak ada soal yang
masuk bank sebelum dua gate lolos:

1. **Gate mekanis** (`gate.mjs`): format, furigana tiap kanji, panjang per level, kutipan pembahasan ada di
   teks, sebaran kunci, judul/teks kembar. Memakai validator aplikasi sendiri (`validasiBacaanAi`).
2. **Gate tinjauan** (`banding.mjs`): peninjau independen menjawab tiap soal tanpa melihat kunci. Jawaban yang
   berbeda dari kunci = soalnya ambigu atau kuncinya salah → diblokir. Peninjau juga mengaudit furigana, tata
   bahasa, dan terjemahan.

`inject.mjs` menjalankan ulang kedua gate itu sendiri dan menolak menulis bila ada yang gagal, termasuk bila
sebuah bacaan diubah setelah ditinjau (tinjauan terikat pada sidik isi bacaan).

Cakupan: bank dokkai (`server/domain/bankSoal/dokkaiN5.js`). Soal kanji tidak dibuat di sini — kosakatanya
berasal dari file Excel user.

## Yang perlu diketahui sebelum mulai

- **Satuan.** Satu bacaan = 2 soal. "50 soal per level" = 25 bacaan per level. Kalau jumlah soal ganjil atau
  levelnya tidak disebut, tanyakan; kalau jelas, langsung kerjakan.
- **Folder kerja** di scratchpad sesi (bukan di repo), mis. `<scratchpad>/soal-dokkai-<tanggal>`. Semua naskah,
  salinan buta, dan tinjauan tinggal di sana. Repo hanya disentuh pada langkah inject.
- Semua skrip dijalankan dengan `node` dari root repo; `SKILL` di bawah = folder skill ini
  (`.claude/skills/generate-soal`), `KERJA` = folder kerja.
- Spesifikasi soal ada di [references/spesifikasi-soal.md](references/spesifikasi-soal.md). Baca sebelum
  menilai keberatan peninjau atau memperbaiki soal sendiri.

## Alur

### 1. Siapkan

```bash
node SKILL/scripts/siapkan.mjs --kerja KERJA --bacaan 25            # semua level
node SKILL/scripts/siapkan.mjs --kerja KERJA --bacaan 10 --level L4,L5
```

Menulis `rencana.json` (id yang dipakai tiap level, dihitung dari isi bank saat ini), `referensi-furigana.txt`,
`judul-terpakai.txt`, dan `contoh-<level>.json`.

### 2. Tulis — satu agen per level, serentak

```bash
node SKILL/scripts/brief.mjs --kerja KERJA --penulis    # → prompt/gen-<level>.md
```

Luncurkan satu subagen per level dalam satu giliran; promptnya isi file `prompt/gen-<level>.md` (templatnya
[references/brief-generator.md](references/brief-generator.md)). Tiap agen menulis `KERJA/gen/<level>.json` dan
mengulang `gate.mjs` untuk levelnya sampai lolos.

Per level, bukan per bacaan: agen perlu melihat seluruh levelnya untuk menjaga variasi topik dan sebaran kunci.

### 3. Gate mekanis

```bash
node SKILL/scripts/gate.mjs --kerja KERJA
```

Jalankan sendiri — jangan mengandalkan laporan agen. ERROR harus nol. Baca PERINGATAN dan daftar FURIGANA BARU:
peringatan pola di atas N5 bisa keliru deteksi, tetapi furigana baru tidak dijamin siapa pun selain pembacanya.
Perbaikan kecil boleh dikerjakan langsung di `gen/<level>.json`; level yang rusak berat dikembalikan ke agen
penulisnya (atau agen baru) beserta keluaran gate.

### 4. Tinjauan independen

```bash
node SKILL/scripts/buta.mjs --kerja KERJA
node SKILL/scripts/brief.mjs --kerja KERJA --peninjau   # → prompt/tinjau-<level>.md
```

Membuat `blind/<level>.json` (tanpa kunci, tanpa terjemahan), `blind/<level>-audit.json`, dan
`blind/<level>-furigana-baru.json`. Luncurkan satu
subagen **baru** per level dengan prompt `prompt/tinjau-<level>.md` (templatnya
[references/brief-peninjau.md](references/brief-peninjau.md)); hasilnya `review/<level>.json`.

Peninjau harus benar-benar independen, sebab itulah nilai gate ini: jangan memakai agen penulis sebagai
peninjau, jangan memberi tahu soal mana yang kamu ragukan, dan jangan pernah menulis atau mengubah file
`review/` sendiri.

### 5. Banding, perbaiki, tinjau ulang

```bash
node SKILL/scripts/banding.mjs --kerja KERJA
```

Tiap bacaan berstatus LOLOS, BLOKIR, atau BELUM (belum ada tinjauan untuk isinya yang sekarang).

- **Jawaban peninjau ≠ kunci.** Anggap soalnya yang salah sampai terbukti sebaliknya: baca teksnya, lalu
  perbaiki pengecoh, pertanyaan, atau kuncinya. Ini tidak bisa dikesampingkan. Bila setelah dibaca teliti
  soalnya jelas benar dan peninjaunya yang keliru, minta pendapat kedua dari peninjau baru:
  `buta.mjs --ulang --id <id>`.
- **Keberatan blokir lain** (furigana, tata bahasa, terjemahan…). Kalau benar, perbaiki. Kalau keliru — peninjau
  juga bisa salah — catat putusan di `KERJA/putusan.json`: `[{ "id": "L3-27", "sidik": "…", "alasan": "…" }]`
  dengan alasan yang bisa diperiksa orang lain (mis. "行{おこな}います memang dibaca おこないます; lihat L4-12").
  Putusan ikut dilaporkan ke user.
- **Catatan minor.** Terapkan yang memperbaiki soal; sisanya biarkan.

Setiap bacaan yang diubah kehilangan tinjauannya. Setelah perbaikan:

```bash
node SKILL/scripts/gate.mjs --kerja KERJA
node SKILL/scripts/buta.mjs --kerja KERJA --ulang      # → blind/ulang.json: hanya yang berubah
node SKILL/scripts/brief.mjs --kerja KERJA --peninjau --ulang   # → prompt/tinjau-ulang-<n>.md
```

lalu luncurkan peninjau baru dengan prompt itu (keluaran `review/ulang-<n>.json`, nomor baru tiap putaran) dan
jalankan `banding.mjs` lagi. Perbaikanmu sendiri juga bisa memasukkan masalah baru — judul pengganti yang
membocorkan jawaban, kata yang dobel — jadi jangan melewatkan tinjauan ulang untuk perubahan "kecil". Ulangi sampai tertulis `HASIL: SEMUA LOLOS gate tinjauan`. Bacaan yang tetap
bermasalah setelah dua putaran lebih baik ditulis ulang dari nol daripada ditambal.

### 6. Inject

```bash
node SKILL/scripts/inject.mjs --kerja KERJA --uji     # periksa ulang, tidak menulis
node SKILL/scripts/inject.mjs --kerja KERJA
```

Menyisipkan bacaan baru di akhir tiap level dengan gaya penulisan file itu, memuat ulang filenya, dan
mengembalikan file lama bila hasilnya berbeda dari naskah yang ditinjau. Sesudah itu:

1. Perbarui komentar kepala `dokkaiN5.js` (jumlah bacaan per level, rentang bacaan yang ditulis baru).
2. Jalankan `npm test`: tes yang gagal menunjukkan angka bank yang tertulis di
   `server/domain/tesOnline.test.js` — jumlah per level, total bacaan, total soal, `perJlpt`, dan dua pool
   "bank + 1 bacaan AI" (jumlah per level + 1). Ganti dengan angka yang dicetak inject, lalu `npm test` lagi
   sampai lolos semua.
3. Lihat `git status` untuk memastikan tugas ini hanya mengubah dua file itu.

Tidak ada migrasi database: bank ini file kode, aplikasi membacanya saat start. Commit dan push hanya bila
user memintanya.

## Laporan ke user

Singkat dan apa adanya: berapa bacaan/soal masuk per level dan total bank sekarang; berapa yang ditahan gate
mekanis dan gate tinjauan serta apa yang dilakukan (diperbaiki, ditulis ulang, dibuang); putusan yang
mengesampingkan keberatan peninjau beserta alasannya; hasil `npm test`; dan bahwa perubahan belum di-commit.
Kalau ada level yang tidak mencapai jumlah yang diminta, katakan — jangan menurunkan standar gate demi angka.

## Memperbaiki soal yang sudah ada di bank

Alurnya sama dalam skala kecil: salin bacaan itu ke folder kerja, perbaiki, lalu minta peninjau independen
menjawabnya tanpa kunci sebelum mengubah `dokkaiN5.js` dengan tangan. `siapkan.mjs`/`inject.mjs` hanya untuk
menambah bacaan baru di akhir level.
