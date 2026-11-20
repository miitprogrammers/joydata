# Tingkat N4 — modul bunpou, kanji, tata bahasa, dan ciri level

Pelengkap [spesifikasi-soal.md](spesifikasi-soal.md) untuk bank N4 (`server/domain/bankSoal/dokkaiN4.js`, id `N4L1-21`).
Sumber aturan: `docs/kb-dokkai/17-aturan-final.md` § 4. Kelas N4 memakai **Minna no Nihongo Bab 26–50** bersama modul
bunpou; peserta sudah belajar Bab 1–25 di tahap N5.

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

1. Semua pola Minna Bab 1–50 (`docs/kb-dokkai/15-tata-bahasa-minna.md`) — **kecuali** pola modul dari level berikutnya
   (urutan level modul tetap berlaku walau polanya sudah diajarkan di Minna II).
2. Pola modul dari level ini (fokus) dan dari level sebelumnya.
3. Sebagai pendukung (jangan menjadi inti soal): あまり～ない, 全然～ない, きっと, ぜひ, など, なかなか～ない, そんなに, ～場合は,
   ～が必要, ～予定だ, ～ようだ, それに, それでも, ～たばかり, **～ようにする** (Minna Bab 36), ～てすみません, ～て (sebab),
   ～のに (tujuan), ～たらいいですか, 急に, さっき, やっと, ～そうだ "katanya" (mulai L4), penjelas kata benda, ～とき,
   ～ながら, ～てしまう, ～はじめる／おわる, ～あいだ(に), ～について, ～という N, ～しか～ない, ～でしょう.

Tidak boleh:

- Pola modul dari level berikutnya (daftarnya di akhir `pola-<level>.md`). Yang paling sering terselip:
  ～てあげる／くれる／もらう, pasif, dan kausatif sebelum L4; keigo sebelum L5 (kecuali お～ください, おります,
  ～でございます yang masuk L4). `ください`, `いただきます` sebelum makan, dan `ございます` dalam salam bukan keigo
  yang dimaksud — itu kosakata N5.
- Pola di luar Minna dan modul: ～わけ, ～によって (sampai dicek di Minna Bab 37), ～として, ～にとって, ～べき, ～うちに, ～たびに,
  ～おかげで／せいで, ～だけでなく, ～さえ, ～に対して／に関して／に比べて, kausatif-pasif (～させられる), ～っぽい／がち／ぎみ,
  ～はずがない, ～おきに, ～続ける, ～出す (mulai), ～ということ, ～ように／～ような ("seperti"), ～ではないか, ～がる. Partikel
  lisan かしら, かい, かな, って hanya di dalam kutipan.
- Bentuk biasa di akhir kalimat narasi. Pola yang memang berbentuk biasa — V な (larangan), 命令形, ～だろう,
  ～のだ／んだ — ditaruh di dalam kutipan `「…」`, tulisan papan atau rambu, atau ucapan/pikiran yang dikutip
  (～と言{い}いました, ～と書{か}いてあります, ～と思{おも}いました). ～んです dan ～でしょう boleh di narasi. Bacaan L3–L5
  boleh berupa memo atau catatan harian bergaya biasa bila pola fokusnya menuntut; pertanyaan dan pilihan tetap
  です・ます.

Gate memberi PERINGATAN bila menemukan pola N3 atau pola level berikutnya. Peringatan bisa keliru (`いただきます`,
`みたいです` yang berarti "ingin melihat"), jadi baca tiap peringatan.

## Kosakata dan angka

- Kosakata Minna Bab 1–50 (`docs/kb-dokkai/16-kosakata-minna.md`), termasuk kata kerja yang di N5 dilarang: 工場, ごみ,
  給料, 規則, 安全. 先輩, 作業, 機械 (di luar Minna) boleh seperlunya dengan konteks jelas. Gate memberi PERINGATAN untuk
  kata yang tidak ada di Minna.
- Angka Arab seperti di [spesifikasi-soal.md](spesifikasi-soal.md) (gate: angka kanji + satuan = ERROR).

## Ciri tiap level

Panjang dihitung dari teks tanpa furigana, sesudah dirapikan; gate menolak yang di luar batas.

| Level | Panjang | Kalimat | Isi bacaan | Jenis pertanyaan |
|---|---|---|---|---|
| L1 Pola dasar | 45–90 | 3–5 | Cerita pendek tentang diri sendiri: niat dan rencana, pengalaman, yang bisa/belum dilakukan, aturan sederhana, pilihan dan perbandingan. | Dua fakta yang tertulis langsung. |
| L2 Syarat, keharusan, alasan | 65–130 | 4–6 | Rutinitas kerja atau asrama, persiapan, tenggat, kewajiban, sebab-akibat, saran. | Satu fakta; satu "mengapa", "apa yang harus / tidak perlu dilakukan", atau "kalau …, bagaimana". |
| L3 Keputusan, dugaan, pengandaian | 75–145 | 4–7 | Pengumuman, memo, pesan, catatan: keputusan, ketetapan, perkiraan, larangan dan perintah di papan. | Satu fakta; satu yang memisahkan yang pasti dari yang baru dugaan, keputusan sendiri dari ketetapan, atau syarat dari akibatnya. |
| L4 Pasif, kausatif, beri-terima | 90–175 | 5–8 | Cerita dengan dua–tiga tokoh: siapa melakukan apa untuk siapa, kejadian yang menimpa seseorang, kabar dari orang lain, pengumuman sopan. | Satu detail; satu "siapa yang melakukan / menerima / disuruh" atau gabungan dua detail. |
| L5 Keigo | **250–450** | **10–20** | Email atau surat kepada atasan atau guru, pengumuman toko/hotel/perusahaan, percakapan dengan tamu, perkenalan diri resmi; **sebagian bacaan 情報検索** (selebaran toko/hotel/kantor dalam keigo, satu butir per baris — spesifikasi-soal.md butir 12). | Soal 1 detail yang menuntut paham kata hormat (siapa yang datang, siapa yang melihat); soal 2 simpulan sederhana dari satu–dua kalimat. |

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
