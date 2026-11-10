# Bentuk data modul bunpou

Satu modul = satu file `server/domain/bankSoal/bunpou<JLPT>.js` yang mengekspor satu objek. File ini data saja:
tanpa `import`, tanpa logika. Contoh hidupnya `server/domain/bankSoal/bunpouN4.js` — buka file itu bila ragu.

```js
// Bunpou (sentence pattern) module for JLPT N4: JOYdata's official list of N4 patterns.
// Source: "Modul Pembelajaran Lengkap 111 Bunpo N4", Kelas RAKU Class (LPK Mizuno Semangat Bangsa).
// … (komentar kepala: jumlah pola, apa yang dilebur, dari mana nomor dan level berasal)

export const BUNPOU_N4 = {
  jlpt: 'N4',
  judul: '111 Bunpo N4',
  sumber: 'Modul Pembelajaran Lengkap 111 Bunpo N4 · Kelas RAKU Class (LPK Mizuno Semangat Bangsa)',
  kategori: [
    {
      nomor: 1,
      judul: 'Keinginan, Niat, Rencana, & Tujuan',
      pola: [
        {
          nomor: 3, pola: 'V つもりだ', arti: 'Berniat/Berencana', level: 'L1',
          penjelasan: 'Menyatakan rencana atau niat matang yang sudah dipikirkan sebelumnya.',
          rumus: ['V-Kamus / V-Nai + つもりだ'],
          contoh: [{ jp: '授業{じゅぎょう}のあとに図書館{としょかん}に行{い}くつもりだ。', id: 'Saya berencana pergi ke perpustakaan setelah kelas.' }],
        },
      ],
    },
  ],
  koreksi: [
    { nomor: 0, catatan: 'Contoh ditulis tanpa spasi antarkata, furigana 漢字{かな} pada setiap kanji, …' },
    { nomor: 10, catatan: 'Contoh di modul tertulis 買い方 (かいかた), padahal terjemahannya "cara penggunaan": ditulis 使{つか}い方{かた}.' },
  ],
  gabungan: { 105: 72, 106: 73 },
};
```

Gaya kode repo: kutip tunggal, indentasi 2 spasi, komentar berbahasa Inggris, baris panjang tidak dipotong.
Nama ekspor `BUNPOU_<JLPT>`.

## Field modul

| Field | Isi |
|---|---|
| `jlpt` | `'N5'`, `'N4'`, `'N3'` … — kunci modul di `MODUL_BUNPOU`. |
| `judul` | Nama pendek modul seperti disebut sensei (`'111 Bunpo N4'`). Muncul di panduan AI. |
| `sumber` | Judul lengkap dokumen dan penerbit/kelasnya, supaya asal-usulnya terlacak. |
| `kategori` | Bab modul, berurutan: `nomor` 1, 2, 3 … tanpa lompat, `judul` seperti di modul. |
| `koreksi` | Semua tempat teks di sini berbeda dari dokumen sumber. Lihat di bawah. |
| `gabungan` | Nomor modul yang dilebur ke pola lain: `{ nomorYangHilang: nomorTujuan }`. Lihat di bawah. |

## Field pola

- **`nomor`** — nomor pola **di dokumen sumber**, apa adanya. Jangan dinomori ulang walau ada nomor yang
  dilebur: sensei mencari pola di modul cetak dengan nomor ini, dan bacaan bank menyimpannya di `bunpou`. Nomor
  naik dari pola ke pola di seluruh modul dan tidak berulang.
- **`pola`** — bentuk pola seperti judulnya di modul: `'～なければならない'`, `'V つもりだ'`, `'N にする'`,
  `'お～いたす / ご～いたす'`. Dua pola yang bentuknya sama tetapi fungsinya beda diberi penanda dalam kurung
  siku seperti di modul: `'V(ら)れる [可能]'` (potensial) dan `'V(ら)れる [敬語]'` (keigo). Teks ini dikirim ke AI
  penulis dan tampil sebagai chip di Bank Soal, jadi harus cukup untuk mengenali polanya tanpa membaca
  penjelasan.
- **`arti`** — padanan singkat bahasa Indonesia (`'Harus'`, `'Memutuskan untuk...'`). Bila modul memakai bahasa
  lain, terjemahkan dan catat di `koreksi`.
- **`level`** — level dokkai tempat pola ini menjadi pola fokus, `'L1'`–`'L5'`. Ini keputusan JOYdata, bukan
  isi modul; cara membaginya ada di SKILL.md.
- **`penjelasan`** — penjelasan modul, boleh dirapikan kalimatnya tetapi tidak ditambah teori baru.
- **`rumus`** — daftar cara membentuk, satu baris per rumus (`['V-Kamus / V-Nai + つもりだ']`). Minimal satu.
- **`contoh`** — kalimat contoh dari modul, minimal satu: `{ jp, id }`.

Tidak ada teks yang diawali atau diakhiri spasi.

## Kalimat contoh (`contoh.jp`)

Ditulis dengan gaya bank dokkai, karena dipakai sebagai contoh untuk AI penulis dan penulis bank, dan cara
bacanya masuk ke referensi furigana skill generate-soal:

- **Tanpa spasi** antarkata (modul cetak sering memberi spasi).
- **Furigana di setiap kanji**, `漢字{かな}` tepat setelah rangkaian kanjinya; okurigana di luar kurung:
  `降{ふ}ります`, `使{つか}い方{かた}`. Modul biasanya menulis furigana di atas atau dalam kurung biasa — ubah.
- **Angka ditulis kanji** berfurigana (`九時{くじ}`, `五百年{ごひゃくねん}`), tanpa angka Arab dan tanpa huruf Latin.
- Bacaan satuan mengikuti pengucapan: `三{さん}ばい`, `一人{ひとり}`, `二十日{はつか}`.
- Kanjinya dibiarkan seperti di modul, walau di luar kanji yang dipelajari peserta — contoh ini tidak tampil
  ke peserta.
- Bentuk kalimatnya (biasa atau です・ます) dibiarkan seperti di modul.

`contoh.id` = terjemahan Indonesia dari modul, tanpa `{}`.

## `koreksi`: setiap perbedaan dari sumber dicatat

Modul buatan sendiri hampir selalu memuat salah ketik, dan hasil `pdftotext` menambah kerusakan tata letak.
Memperbaikinya benar — menyalin kesalahan ke bank soal berarti mengujikan kesalahan itu ke peserta. Tetapi
perbaikan diam-diam membuat sensei yang membandingkan dengan modul cetak mengira datanya yang salah. Maka tiap
perbedaan dicatat: `{ nomor: <nomor pola>, catatan: '<apa yang tertulis di modul → apa yang ditulis di sini>' }`.
`nomor: 0` untuk catatan yang berlaku bagi seluruh modul.

Yang dicatat di N4, sebagai gambaran jenisnya:

- Aturan penulisan untuk seluruh modul (nomor 0): contoh tanpa spasi, furigana, angka Arab menjadi kanji.
- Kanji salah: contoh tertulis 買い方 padahal terjemahannya "cara penggunaan" → `使{つか}い方{かた}` (pola 10, 66).
- Rumus salah: "i-Adj (く) + も" → "i-Adj (くて) + も" (16); "ぞんじ知っております" → "ぞんじております" (84).
- Judul pola salah ketik: "お～くだされ" → "お～くださる", mengikuti daftar isi modul (70).
- Bacaan salah: "3 ぱい" → `三{さん}ばい` (96).
- Terjemahan: nama "Tamayama" untuk 田山 → "Tayama" (27); arti berbahasa Inggris "Say/Tell" → Indonesia (87).
- Tata letak rusak: baris rumus dan contoh tercampur, disusun ulang tanpa mengubah isi (60); kutipan yang
  hilang dipulihkan dari terjemahannya (104).
- Peleburan (nomor 0): pola 105–111 adalah pengulangan, digabung ke pola aslinya.

Yang **tidak** diubah: pilihan pola, urutan, pengelompokan kategori, dan penjelasan yang sekadar berbeda gaya
dari buku lain. Modul ini pegangan sensei; tugas di sini menyalinnya dengan benar, bukan menyuntingnya. Kalau
ada isi yang tampak keliru secara tata bahasa tetapi bukan salah ketik yang jelas, biarkan seperti sumber dan
laporkan ke user.

## `gabungan`: nomor yang mengulang pola lain

Bila modul memuat pola yang sama dua kali (N4: "Kategori 13" bernomor 105–111 mengulang pola keigo Kategori 10,
dan modulnya sendiri menulis "Digabungkan ke Keigo Kategori 10"), jangan dijadikan dua pola — bank akan
melatih hal yang sama dua kali dan chip di Bank Soal jadi membingungkan. Caranya:

1. Pola aslinya tetap dengan nomornya sendiri.
2. Contoh dari pengulangan ditambahkan sebagai contoh berikutnya di pola asli (pola 72 punya dua contoh: yang
   kedua berasal dari nomor 105).
3. `gabungan` mencatat `{ 105: 72 }`, dan `koreksi` nomor 0 menyebut peleburannya.

Nomor yang dilebur tidak boleh masih ada sebagai pola, dan tujuannya harus ada — validator menolak keduanya.
Dua pola yang mirip tetapi diajarkan modul sebagai hal berbeda (～なければならない dan ～なくてはいけない) **tidak**
dilebur.

## Yang diperiksa validator

`periksaModulBunpou` (`server/domain/bunpou.js`), dijalankan lewat `scripts/periksa-modul.mjs` dan oleh
`server/domain/bunpou.test.js`:

- `jlpt` N1–N5; `judul` dan `sumber` terisi; kategori bernomor 1, 2, 3 … dan masing-masing punya pola.
- Tiap pola: nomor bilangan bulat positif, naik, tidak berulang; `pola`, `arti`, `penjelasan` terisi; `level`
  salah satu L1–L5; `rumus` daftar teks; minimal satu contoh.
- Tiap contoh: ada teks Jepang, furigana lengkap, tanpa spasi, tanpa angka Arab dan huruf Latin; terjemahan
  terisi tanpa `{}`.
- Tiap level L1–L5 punya minimal 6 pola (`MIN_POLA_PER_LEVEL`).
- `gabungan` menunjuk pola yang ada; `koreksi` menunjuk pola yang ada (atau 0) dan catatannya terisi.

`periksa-modul.mjs` menambahkan yang perlu dinilai manusia ("PERLU DILIHAT"): nomor yang terlewat, dua pola
bernama sama, sebaran level yang timpang, level yang polanya terlalu banyak untuk jumlah bacaan bank, dan
contoh yang tampak terpotong.
