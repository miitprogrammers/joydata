---
name: generate-soal
description: Menulis soal dokkai (bacaan + pertanyaan pilihan ganda bahasa Jepang, pola kalimat N5, N4, atau N3, level L1–L5) baru untuk bank soal Tes Online JOYdata lewat alur multi-agen bergerbang mutu — agen penulis per level, gate mekanis, peninjau independen yang menjawab tanpa kunci, lalu inject ke server/domain/bankSoal/dokkaiN5.js, dokkaiN4.js, atau dokkaiN3.js hanya bila semuanya lolos; juga merevisi bacaan bank yang sudah ada dengan id tetap (mode revisi, konversi angka, audit bank). Bank N4 mengikuti modul bunpou (tiap bacaan ditandai pola modul yang dilatihnya). Pakai skill ini setiap kali user meminta "generate soal", "tambah soal", "buat soal baru", "tambah bacaan dokkai", "perbanyak bank soal", "soal dokkai kurang", "tambah soal N4", "tambah soal N3", "revisi bank soal", "audit bank dokkai", atau menyebut jumlah soal/bacaan baru per level — juga bila user hanya berkata "tambah 20 soal lagi" tanpa menyebut kata dokkai, dan bila diminta memperbaiki atau mengganti soal dokkai yang sudah ada di bank.
---

# Generate soal dokkai

Soal di bank dipakai untuk tes bernilai: nilainya masuk rapor peserta. Satu furigana salah atau satu soal
berjawaban ganda merugikan orang sungguhan, dan begitu masuk bank, soal itu ikut terundi di setiap tes. Karena
itu alur ini memisahkan tiga peran — yang menulis, yang memeriksa, yang memasukkan — dan tidak ada soal yang
masuk bank sebelum dua gate lolos:

1. **Gate mekanis** (`gate.mjs`): format, furigana tiap kanji (dan tanpa slip yang biasanya diperbaiki aplikasi),
   panjang per level, kutipan pembahasan ada di teks, sebaran kunci, judul/teks kembar, **angka Arab** (angka kanji +
   satuan = error; jumlah 10000 ke atas satu format per bacaan, 2万円 atau 20000円), furigana yang mengulang kana di
   depannya (か月{かげつ}, お茶{おちゃ}), dan **kosakata Minna** (N5: kata yang dihindari = error, kata di luar Bab 1–25 = peringatan);
   di bank N4 juga tag pola modul; di N4 dan N3 kanji di luar volume yang dipelajari. Memakai validator aplikasi
   sendiri (`validasiBacaanAi`). Aturannya: `docs/kb-dokkai/17-aturan-final.md`.
2. **Gate tinjauan** (`banding.mjs`): peninjau independen menjawab tiap soal tanpa melihat kunci. Jawaban yang
   berbeda dari kunci = soalnya ambigu atau kuncinya salah → diblokir. Peninjau juga mengaudit furigana, tata
   bahasa, dan terjemahan.

`inject.mjs` menjalankan ulang kedua gate itu sendiri dan menolak menulis bila ada yang gagal, termasuk bila
sebuah bacaan diubah setelah ditinjau (tinjauan terikat pada sidik isi bacaan).

Cakupan: bank dokkai. Soal kanji tidak dibuat di sini — kosakatanya berasal dari file Excel user.

## Tiga bank: N5, N4, N3

Bank dipisah per tingkat pola kalimat; `siapkan.mjs --jlpt` memilihnya (bawaan N5) dan menyimpannya di
`rencana.json`, sehingga skrip lain mengikuti sendiri.

| | N5 | N4 | N3 |
|---|---|---|---|
| File bank | `server/domain/bankSoal/dokkaiN5.js` | `server/domain/bankSoal/dokkaiN4.js` | `server/domain/bankSoal/dokkaiN3.js` |
| Id bacaan | `L2-21` | `N4L2-21` | `N3L2-1` |
| Aturan tingkat | [references/tingkat-N5.md](references/tingkat-N5.md) | [references/tingkat-N4.md](references/tingkat-N4.md) | [references/tingkat-N3.md](references/tingkat-N3.md) |
| Tata bahasa | Minna Bab 1–25 | Minna Bab 1–50 + modul bunpou N4 (`server/domain/bankSoal/bunpouN4.js`): tiap pola menjadi fokus satu level | sampai N3 (tanpa modul); level = jenis bacaan resmi N3 |
| Tambahan | — | field `bunpou` per bacaan, `pola-<level>.md` di folder kerja, langkah `rapikan.mjs` | langkah `rapikan.mjs` (kanji volume N5+N4+N3) |

Di N4, `siapkan.mjs` membagi pola modul ke bacaan baru (dua pola per bacaan, pola yang paling jarang dipakai
didahulukan) supaya seluruh modul terlatih merata; gate menolak bacaan yang tidak memuat pola tugasnya, dan
peninjau memeriksa apakah tiap pola yang ditandai benar-benar dipakai. Kalau user hanya berkata "tambah soal"
tanpa menyebut tingkat, tanyakan N5 atau N4.

Tingkat lain (mis. N2) tidak cukup dengan `--jlpt`: perlu file bank, entri `TINGKAT` di `scripts/_umum.mjs`, dan
`references/tingkat-<JLPT>.md` (modul bunpou lewat skill `tambah-modul-bunpou` bila ada).

## Yang perlu diketahui sebelum mulai

- **Satuan.** Satu bacaan = 2 soal. "50 soal per level" = 25 bacaan per level. Kalau jumlah soal ganjil atau
  levelnya tidak disebut, tanyakan; kalau jelas, langsung kerjakan.
- **Folder kerja** di scratchpad sesi (bukan di repo), mis. `<scratchpad>/soal-dokkai-<tanggal>`. Semua naskah,
  salinan buta, dan tinjauan tinggal di sana. Repo hanya disentuh pada langkah inject.
- Semua skrip dijalankan dengan `node` dari root repo; `SKILL` di bawah = folder skill ini
  (`.claude/skills/generate-soal`), `KERJA` = folder kerja.
- Spesifikasi soal: aturan umum di [references/spesifikasi-soal.md](references/spesifikasi-soal.md), aturan per
  tingkat di `references/tingkat-<JLPT>.md`. Baca keduanya sebelum menilai keberatan peninjau atau memperbaiki
  soal sendiri.

## Alur

### 1. Siapkan

```bash
node SKILL/scripts/siapkan.mjs --kerja KERJA --bacaan 25            # bank N5, semua level
node SKILL/scripts/siapkan.mjs --kerja KERJA --bacaan 10 --level L4,L5
node SKILL/scripts/siapkan.mjs --kerja KERJA --bacaan 25 --jlpt N4  # bank N4
```

Menulis `rencana.json` (tingkat, id yang dipakai tiap level, dihitung dari isi bank saat ini),
`referensi-furigana.txt`, `judul-terpakai.txt`, dan `contoh-<level>.json`; untuk N4 juga `pola-<level>.md`
(pembagian pola per bacaan dan isi modul untuk level itu). Satu folder kerja = satu tingkat.

### 2. Tulis — satu agen per level, serentak

```bash
node SKILL/scripts/brief.mjs --kerja KERJA --penulis    # → prompt/gen-<level>.md
```

Luncurkan satu subagen per level dalam satu giliran; promptnya isi file `prompt/gen-<level>.md` (templatnya
[references/brief-generator.md](references/brief-generator.md)). Tiap agen menulis `KERJA/gen/<level>.json` dan
mengulang `gate.mjs` (di N4: `rapikan.mjs` lalu `gate.mjs`) untuk levelnya sampai lolos.

Per level, bukan per bacaan: agen perlu melihat seluruh levelnya untuk menjaga variasi topik dan sebaran kunci.

Satu balasan agen dibatasi 32.000 token keluaran, dan 25 bacaan tidak muat di dalamnya: agen yang menulis
seluruh level dalam satu panggilan berhenti dengan galat `max_output_tokens` tanpa menghasilkan file. Brief
penulis karena itu meminta file ditulis per 5 bacaan (Write, lalu Edit). Bila sebuah agen tetap gagal begitu,
lanjutkan agen yang sama dengan pesan yang mengulang aturan itu — naskah yang sudah ada di `gen/` diteruskan,
bukan ditulis ulang.

### 3. Gate mekanis

```bash
node SKILL/scripts/rapikan.mjs --kerja KERJA   # N4 dan N3: kanji di luar volume yang dipelajari → kana
node SKILL/scripts/gate.mjs --kerja KERJA
```

Jalankan sendiri — jangan mengandalkan laporan agen. ERROR harus nol. Baca PERINGATAN dan daftar FURIGANA BARU:
peringatan pola di atas tingkatnya bisa keliru deteksi, tetapi furigana baru tidak dijamin siapa pun selain
pembacanya. Di N4 dan N3, `rapikan.mjs` dijalankan lagi setiap kali naskah diubah (juga sesudah perbaikan di langkah 5):
tes resmi tampil tanpa furigana, jadi kanji yang belum dipelajari tidak boleh tersisa.
Perbaikan kecil boleh dikerjakan langsung di `gen/<level>.json`; level yang rusak berat dikembalikan ke agen
penulisnya (atau agen baru) beserta keluaran gate.

### 4. Tinjauan independen

```bash
node SKILL/scripts/buta.mjs --kerja KERJA
node SKILL/scripts/brief.mjs --kerja KERJA --peninjau   # → prompt/tinjau-<level>.md
```

Membuat `blind/<level>.json` (tanpa kunci, tanpa terjemahan), `blind/<level>-audit.json` (di N4 juga memuat
pola yang ditandai tiap bacaan), dan `blind/<level>-furigana-baru.json`. Luncurkan satu
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
- **Keberatan blokir lain** (furigana, tata bahasa, terjemahan, pola yang ditandai tetapi tidak dipakai…). Kalau
  benar, perbaiki. Kalau keliru — peninjau
  juga bisa salah — catat putusan di `KERJA/putusan.json`: `[{ "id": "L3-27", "sidik": "…", "alasan": "…" }]`
  dengan alasan yang bisa diperiksa orang lain (mis. "行{おこな}います memang dibaca おこないます; lihat L4-12").
  Putusan ikut dilaporkan ke user.
- **Catatan minor.** Terapkan yang memperbaiki soal; sisanya biarkan.

Setiap bacaan yang diubah kehilangan tinjauannya. Setelah perbaikan:

```bash
node SKILL/scripts/rapikan.mjs --kerja KERJA           # N4 dan N3
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

1. Perbarui komentar kepala file bank itu (jumlah bacaan per level, rentang bacaan yang ditulis baru).
2. Jalankan `npm test`: tes yang gagal menunjukkan angka bank yang tertulis di
   `server/domain/tesOnline.test.js` — jumlah per level, total bacaan, total soal, `perJlpt`, dan pool
   "bank + 1 bacaan AI" (jumlah per level + 1). Ganti dengan angka yang dicetak inject, lalu `npm test` lagi
   sampai lolos semua. Untuk N4, `server/domain/bunpou.test.js` juga memeriksa tag pola tiap bacaan dan bahwa
   setiap pola modul dilatih minimal satu bacaan di levelnya.
3. Lihat `git status` untuk memastikan tugas ini hanya mengubah file bank dan file tes itu.

Tidak ada migrasi database: bank ini file kode, aplikasi membacanya saat start. Commit dan push hanya bila
user memintanya.

## Laporan ke user

Singkat dan apa adanya: berapa bacaan/soal masuk per level dan total bank sekarang; berapa yang ditahan gate
mekanis dan gate tinjauan serta apa yang dilakukan (diperbaiki, ditulis ulang, dibuang); putusan yang
mengesampingkan keberatan peninjau beserta alasannya; hasil `npm test`; dan bahwa perubahan belum di-commit.
Kalau ada level yang tidak mencapai jumlah yang diminta, katakan — jangan menurunkan standar gate demi angka.

## Memperbaiki soal yang sudah ada di bank (mode revisi)

Bacaan bank diganti dengan id yang sama; jumlah bacaan per level tidak berubah. Alurnya sama dengan menambah
bacaan, dengan tiga perbedaan:

```bash
node SKILL/scripts/gate.mjs --audit --jlpt N5 [--level L3] [--keluar audit.json]   # temukan yang melanggar
node SKILL/scripts/siapkan.mjs --kerja KERJA --jlpt N5 --revisi L5-2,L5-1 --alasan pola
node SKILL/scripts/siapkan.mjs --kerja KERJA --jlpt N5 --revisi-dari docs/kb-dokkai/data/dampak-bank.json --kategori kata,pola
node SKILL/scripts/konversi-angka.mjs --kerja KERJA     # khusus kategori angka: kanji → angka Arab, lihat laporan-angka.md
… tulis/perbaiki gen/<level>.json, rapikan (N4/N3), gate, buta, peninjau, banding seperti biasa …
node SKILL/scripts/inject.mjs --kerja KERJA --uji
node SKILL/scripts/inject.mjs --kerja KERJA             # mengganti blok bacaan per id
```

- `asli/<level>.json` = bacaan sebelum revisi (pembanding); `gen/<level>.json` = yang diedit. `rencana.json` memuat
  `alasan` per id (pola, kata, angka, mutu) — penulis wajib menghilangkan alasannya; gate menolak bila pola penyebabnya
  masih ada.
- Bacaan yang hanya berubah angka dan identik setelah angka dinormalkan tidak perlu tinjauan buta (`buta.mjs`, `banding.mjs`,
  dan `inject.mjs` sama-sama melewatinya); perubahan lain wajib
  ditinjau. Semua catatan PERIKSA di `laporan-angka.md` diputuskan sebelum inject.
- Bacaan L5 lama boleh tetap pada panjang lamanya (batas lama diterima untuk revisi). Bacaan lama yang sejak awal di luar
  batas panjang/jumlah kalimat lolos asal revisinya tidak membuatnya makin jauh; `gate.mjs --audit` tetap melaporkannya.
- `konversi-angka.mjs` mengenali blok gabungan (7時{じ}半{はん}, 3日{みっか}間{かん}, 7時{じ}10分{ぷん}) dan memakai 万 hanya bila semua
  jumlah 10000 ke atas di bacaan itu bulat puluhan ribu. `siapkan.mjs --revisi-dari` meneruskan rincian alasan (kata, pola, pesan
  gate) ke brief penulis; `ringkasan-revisi.md` mencatat per bacaan apakah ditinjau buta dan soal mana yang kuncinya berpindah.
- Keberatan peninjau atas desain bacaan lama yang tidak tersentuh revisi (tipe soal, kalimat bingkai) boleh dicatat di
  `putusan.json` bila jawaban buta = kunci; sebutkan di laporan ke user.
- Di bank N4, perbaikan tidak boleh menghilangkan pola yang ditandai di `bunpou` (atau tandanya ikut diperbarui), dan
  kanji di luar volume yang dipelajari tetap ditulis kana. Inject menulis `ringkasan-revisi.md` untuk laporan ke user.
