# Tingkat N4 — modul bunpou, kanji, tata bahasa, dan ciri level

Pelengkap [spesifikasi-soal.md](spesifikasi-soal.md) untuk bank N4 (`server/domain/bankSoal/dokkaiN4.js`, id `N4L1-21`).

Bank N4 mengikuti modul bunpou resmi JOYdata, "111 Bunpo N4" (104 pola; datanya di
`server/domain/bankSoal/bunpouN4.js`). Tiap pola modul menjadi **pola fokus** di satu level dokkai, jadi level
di N4 bukan hanya soal panjang bacaan: L1 melatih pola yang paling dasar, L5 melatih keigo. Sensei memakai
bank ini untuk memastikan peserta bisa *membaca* kalimat berpola N4, bukan menghafal rumusnya.

Bahan per level ada di folder kerja, `pola-<level>.md`: pembagian pola per bacaan, pola fokus level itu lengkap
dengan penjelasan, rumus, dan contoh dari modul, daftar pola level sebelumnya (boleh dipakai), dan daftar pola
level berikutnya (jangan dipakai).

## Field `bunpou`

Tiap bacaan N4 punya satu field tambahan di antara `judul` dan `teks`:

```json
{
  "id": "N4L2-1",
  "judul": "レポートのしめきり",
  "bunpou": [20, 45, 51],
  "teks": "来週{らいしゅう}のきんようびまでに、日本語{にほんご}のレポートを出{だ}さなければなりません。今週{こんしゅう}は仕事{しごと}がいそがしいので、まだ書{か}いていません。どようびは休{やす}みですから、図書館{としょかん}で書{か}くつもりです。先生{せんせい}は「わからないときは、すいようびまでに聞{き}いてください」と言{い}いました。",
  "terjemahan": "Paling lambat hari Jumat minggu depan, saya harus mengumpulkan laporan bahasa Jepang. Karena minggu ini pekerjaan sibuk, saya belum menulisnya. Hari Sabtu libur, jadi saya berniat menulisnya di perpustakaan. Guru berkata, \"Kalau ada yang tidak dimengerti, tanyakan paling lambat hari Rabu.\"",
  "soal": [
    { "id": "N4L2-1-1", "tanya": "レポートはいつまでに出{だ}さなければなりませんか。", "tanyaId": "Laporan harus dikumpulkan paling lambat kapan?", "opsi": ["今週{こんしゅう}のすいようび", "来週{らいしゅう}のきんようび", "今週{こんしゅう}のどようび"], "benar": 1, "pembahasan": "来週のきんようびまでに、日本語のレポートを出さなければなりません = Paling lambat hari Jumat minggu depan harus mengumpulkan laporan bahasa Jepang." },
    { "id": "N4L2-1-2", "tanya": "どうしてまだレポートを書{か}いていませんか。", "tanyaId": "Mengapa laporannya belum ditulis?", "opsi": ["仕事{しごと}がいそがしいからです", "図書館{としょかん}が休{やす}みだからです", "先生{せんせい}に聞{き}いていないからです"], "benar": 0, "pembahasan": "今週は仕事がいそがしいので、まだ書いていません = Karena minggu ini pekerjaan sibuk, belum menulisnya." }
  ]
}
```

- `bunpou` = 2–4 nomor pola modul yang berbeda. Wajib memuat **dua pola yang ditugaskan** ke bacaan itu di
  `pola-<level>.md` (contoh di atas: tugasnya 20 ～なければならない dan 45 ～までに). Pembagian itu membuat semua
  pola modul terlatih merata; gate menolak bacaan yang tidak memuat tugasnya.
- Boleh menambah pola lain yang benar-benar dipakai (contoh: 51 ～ので), dari level ini atau level sebelumnya.
  Pola dari level berikutnya tidak boleh ada di `bunpou` — dan tidak boleh dipakai di bacaan.
- "Dipakai" berarti polanya muncul di `teks` dengan bentuk dan arti seperti di modul. Pola yang hanya muncul di
  pertanyaan atau pilihan tidak dihitung. Peninjau memeriksa tiap nomor.
- `bunpou` hanya tampil untuk staf di Bank Soal; peserta tidak melihatnya.

## Kanji

Hanya kanji dari volume kanji yang dipelajari peserta (N5 Dasar dan Vol 1–5, N4 Vol 1–5; 667 kanji) yang
tinggal sebagai kanji; kata dengan kanji lain ditulis kana. Sebabnya: tes resmi menampilkan bacaan **tanpa
furigana**, dan dengan pengaturan kanji bawaan bacaan bank ditampilkan apa adanya — kanji yang belum dipelajari
tidak akan terbaca.

Tidak perlu menghafal daftarnya. Tulis seperti biasa dengan furigana, lalu jalankan `rapikan.mjs`: kata yang
memuat kanji di luar daftar diubah menjadi kana (`寮{りょう}` → `りょう`; `金曜日{きんようび}` → `きんようび`, karena 曜
belum dipelajari — contoh di atas sudah dirapikan), termasuk di kutipan pembahasan. Gate
menolak kanji di luar daftar yang masih tersisa. Sesudah dirapikan, baca ulang hasilnya: deretan kana yang
panjang sulit dibaca, jadi kata yang jadi janggal lebih baik diganti kata lain. Panjang teks dihitung dari
hasil yang sudah dirapikan.

## Tata bahasa

Gaya です・ます di narasi, pertanyaan, dan pilihan.

Boleh:

1. Semua pola N5 (daftar "Boleh" di [tingkat-N5.md](tingkat-N5.md)).
2. Pola modul dari level ini (fokus) dan dari level sebelumnya.
3. Seperlunya, pola N4 umum yang tidak ada di modul, supaya kalimatnya wajar: penjelas kata benda
   (`きのう買{か}った本{ほん}`), ～とき, ～ながら, ～てしまう, ～はじめる／おわる, ～あいだ(に), ～について, ～という N,
   ～しか～ない, ～でしょう. Pola ini pendukung saja: jangan menjadi inti soal.

Tidak boleh:

- Pola modul dari level berikutnya (daftarnya di akhir `pola-<level>.md`). Yang paling sering terselip:
  ～てあげる／くれる／もらう, pasif, dan kausatif sebelum L4; keigo sebelum L5 (kecuali お～ください, おります,
  ～でございます yang masuk L4). `ください`, `いただきます` sebelum makan, dan `ございます` dalam salam bukan keigo
  yang dimaksud — itu kosakata N5.
- Pola N3 ke atas: ～わけ, ～によって, ～として, ～にとって, ～ようにする, ～べき, ～うちに, ～たびに, ～おかげで／せいで,
  ～だけでなく, ～さえ, ～に対して／に関して／に比べて, kausatif-pasif (～させられる), ～っぽい／がち／ぎみ.
- Bentuk biasa di akhir kalimat narasi. Pola yang memang berbentuk biasa — V な (larangan), 命令形, ～だろう,
  ～のだ／んだ — ditaruh di dalam kutipan `「…」`, tulisan papan atau rambu, atau ucapan/pikiran yang dikutip
  (～と言{い}いました, ～と書{か}いてあります, ～と思{おも}いました). ～んです dan ～でしょう boleh di narasi. Bacaan L3–L5
  boleh berupa memo atau catatan harian bergaya biasa bila pola fokusnya menuntut; pertanyaan dan pilihan tetap
  です・ます.

Gate memberi PERINGATAN bila menemukan pola N3 atau pola level berikutnya. Peringatan bisa keliru (`いただきます`,
`みたいです` yang berarti "ingin melihat"), jadi baca tiap peringatan.

## Ciri tiap level

Panjang dihitung dari teks tanpa furigana, sesudah dirapikan; gate menolak yang di luar batas.

| Level | Panjang | Kalimat | Isi bacaan | Jenis pertanyaan |
|---|---|---|---|---|
| L1 Pola dasar | 45–90 | 3–5 | Cerita pendek tentang diri sendiri: niat dan rencana, pengalaman, yang bisa/belum dilakukan, aturan sederhana, pilihan dan perbandingan. | Dua fakta yang tertulis langsung. |
| L2 Syarat, keharusan, alasan | 65–130 | 4–6 | Rutinitas kerja atau asrama, persiapan, tenggat, kewajiban, sebab-akibat, saran. | Satu fakta; satu "mengapa", "apa yang harus / tidak perlu dilakukan", atau "kalau …, bagaimana". |
| L3 Keputusan, dugaan, pengandaian | 75–145 | 4–7 | Pengumuman, memo, pesan, catatan: keputusan, ketetapan, perkiraan, larangan dan perintah di papan. | Satu fakta; satu yang memisahkan yang pasti dari yang baru dugaan, keputusan sendiri dari ketetapan, atau syarat dari akibatnya. |
| L4 Pasif, kausatif, beri-terima | 90–175 | 5–8 | Cerita dengan dua–tiga tokoh: siapa melakukan apa untuk siapa, kejadian yang menimpa seseorang, kabar dari orang lain, pengumuman sopan. | Satu detail; satu "siapa yang melakukan / menerima / disuruh" atau gabungan dua detail. |
| L5 Keigo | 135–250 | 6–10 | Email atau surat kepada atasan atau guru, pengumuman toko/hotel/perusahaan, percakapan dengan tamu, perkenalan diri resmi. | Soal 1 detail yang menuntut paham kata hormat (siapa yang datang, siapa yang melihat); soal 2 simpulan sederhana dari satu–dua kalimat. |

## Soal yang menguji pola

Minimal satu dari dua soal tiap bacaan bertumpu pada pola fokus: peserta yang tidak paham polanya akan memilih
pengecoh. Ini tes membaca, jadi yang ditanyakan tetap isi bacaan — jangan menanyakan istilah tata bahasa
("pola apa yang dipakai?", "bentuk apa ini?").

- ～なければならない / ～なくてもいい → "apa yang harus dilakukan?"; pengecohnya hal yang justru tidak perlu.
- まだ～ていない / ～たことがある → "apa yang belum / sudah pernah dilakukan?".
- ～つもり / ～ことにする / ～ことになる → "apa rencananya?", "siapa yang memutuskan?".
- ～そうだ / ～らしい / ～かもしれない / ～はずだ → "apa yang sudah pasti?", "apa yang baru dugaan penulis?".
- ～てあげる / ～てくれる / ～てもらう → "siapa membantu siapa?".
- Pasif dan kausatif → "siapa yang dimarahi?", "siapa yang membersihkan?".
- Keigo → "siapa yang datang / makan / berkata?" (いらっしゃる vs まいる, めしあがる vs いただく).

Pilihan jawaban boleh memakai bentuk yang lebih sederhana daripada bacaannya (bacaan `めしあがりました`, pilihan
`食{た}べました`): mengenali padanannya adalah bagian dari yang diuji. Pilihan tidak memakai pola dari level
berikutnya.

Contoh gaya di `contoh-<level>.json`: selama bank N4 level itu masih kosong, isinya bacaan N5 dari level yang
sama — tiru bentuk data dan mutu soalnya, bukan tingkat bahasanya.
