# Tingkat N5 — tata bahasa, kosakata, kanji, dan ciri level

Pelengkap [spesifikasi-soal.md](spesifikasi-soal.md) untuk bank N5 (`server/domain/bankSoal/dokkaiN5.js`, id `L1-21`).
Sumber aturan: `docs/kb-dokkai/17-aturan-final.md` § 3 (keputusan user 2026-11-20). Kelas memakai **Minna no Nihongo**;
peserta N5 sudah belajar **Bab 1–25**. Daftar pola per bab: `docs/kb-dokkai/15-tata-bahasa-minna.md`; kosakata per bab:
`docs/kb-dokkai/16-kosakata-minna.md`.

## Kanji

Kanji apa pun boleh asal berfurigana: aplikasi mengubah kanji di luar volume pilihan sensei menjadi kana saat tes dibuat.
Tetapi kosakatanya tetap harus dari Minna Bab 1–25 — kata sulit lebih baik diganti kata lain, bukan ditulis kana.

## Tata bahasa: Minna Bab 1–25

Gaya です・ます di bacaan, pertanyaan, dan pilihan. Bentuk biasa hanya di dalam kalimat (sebelum ～と思います, ～と言いました,
penjelas kata benda) atau di dalam kutipan 「」.

Boleh (nomor = bab): ～ます／ません／ました／ませんでした, です／でした／ではありません, kata sifat (1–12) · あります／います ·
～より／～のほうが／～でいちばん (12) · ～ませんか／～ましょう／～ましょうか · ～たいです, Nが欲しいです, **～に行きます (tujuan)** (13) ·
～てください, ～ています, **V-かた** (14) · ～てもいいです, ～てはいけません (15) · ～て、～, ～てから, ～くて／～で (16) ·
～ないでください, **～なければなりません**, **～なくてもいいです** (17) · **～ことができます**, 趣味は～ことです, ～まえに (18) ·
**～たことがあります**, ～たり～たりします, ～くなります／～になります (19) · bentuk biasa di dalam kalimat (20) ·
～と思います, ～と言いました, ～でしょう？ (21) · penjelas kata benda — **mulai L3** (22) · ～とき, ～と (kondisi) (23) ·
～をくれます, **～てもらいます／～てくれます／～てあげます** (24) · **～たら**, **～ても** (25) · pengecualian: **Vたあとで／Nのあとで**
(Bab 34, tetapi dipakai sampel resmi JLPT N5).

Tidak boleh (diajarkan setelah Bab 25): ～んです (26) · ～ながら, ～し (28) · ～てしまいます (29) · ～てあります, ～ておきます (30) ·
bentuk maksud, ～つもり, ～予定, まだ～ていません (31) · ～ほうがいい, ～かもしれません, ～でしょう (dugaan) (32) · perintah/larangan,
～と書いてあります (33) · ～とおりに, ～ないで (tanpa) (34) · ～ば, ～なら (35) · ～ように, ～ようになります (36) · pasif (37) ·
～のが／～のを (38) · ～ので, ～て (sebab) (39) · ～かどうか, ～てみます (40) · いただきます／くださいます／やります (41) · ～ために,
～のに (42) · ～そうです (43, 47) · ～すぎます, Nにします, ～くします (44) · ～場合 (45) · ～ところ, ～ばかり, ～はず (46) · ～ようです (47) ·
kausatif (48) · keigo (49–50).

Gate memberi PERINGATAN bila menemukan pola ini. Peringatan bisa keliru (`くだもので`, `そうですか`), jadi baca tiap peringatan:
kalau memang pola terlarang, tulis ulang kalimatnya.

## Kosakata: Minna Bab 1–25

- Kata kerja pemagang yang boleh: 事務所, 昼休み, 寮, アルバイト, 残業, 捨てます, 部長, 社長, 会議, お弁当.
- **Dilarang** (gate: ERROR), baik ditulis kanji maupun kana: 工場 (pakai 会社), 先輩 (pakai 会社の人), ごみ, 給料, 規則, 安全, 機械,
  計画, 動物園, 台所, 授業, 映画館, 言葉, 大人, 運動会, 花火, 入口, 結婚式, 夕方 (pakai 午後／夜), 予定 (pakai ～ます), 場所 (pakai
  ところ), 返事. Aturan ditulis dengan ～てはいけません／～なければなりません, bukan kata 規則.
- Kata lain di luar Bab 1–25 → gate memberi PERINGATAN ("kata di luar Minna Bab 1–25"); ganti bila ada padanan Jilid I.
- Topik pabrik, sampah, dan gaji hanya untuk N4/N3.

## Angka

Angka Arab untuk jam, tanggal, harga, jumlah, halaman (6時{じ}, 300円{えん}, 3か月{げつ}); angka kanji hanya untuk kata tetap
(一{ひと}つ, 一人{ひとり}, 二人{ふたり}, 一緒, 一度, 一日中). Gate: angka kanji + satuan = ERROR.

## Ciri tiap level

Panjang dihitung dari teks tanpa furigana; gate menolak yang di luar batas. Contoh gaya ada di `contoh-<level>.json`.

| Level | Panjang | Kalimat | Isi bacaan | Jenis pertanyaan |
|---|---|---|---|---|
| L1 Kalimat sangat dasar | 30–58 | 3–4 | Narasi わたし: diri, benda, keluarga, kegiatan sederhana. Satu informasi per kalimat. | Dua fakta yang tertulis langsung (siapa, apa, di mana, kapan, berapa) atau rencana. |
| L2 Rutinitas & tempat | 45–85 | 3–4 | Rutinitas, letak tempat, belanja, atau orang lain: ada jam, harga, jumlah, posisi. | Fakta angka/waktu/tempat; keadaan sekarang vs keinginan. Pengecoh dari angka/tempat lain di teks. |
| L3 Informasi & alasan | 50–95 | 3–5 | Memo atau pengumuman **dengan kalimat bingkai**; ajakan, permintaan, larangan, alasan (～から). | Satu fakta; satu "mengapa", "apa yang harus/tidak boleh dilakukan", atau "apa yang dilakukan lebih dulu". |
| L4 Jadwal & detail | 60–115 | 4–6 | Memo berjadwal, email, pengumuman dengan beberapa jam/harga/hari. | Satu detail; satu yang menggabungkan dua detail (urutan, jumlah harga, hari yang memenuhi dua syarat, maksud pesan). |
| L5 Bacaan lebih panjang & simpulan | **150–250** | **8–14** | Karangan berjudul dengan nama penulis, cerita, atau email panjang; **sebagian bacaan 情報検索** (selebaran/jadwal/daftar harga, satu butir per baris — spesifikasi-soal.md butir 12). | Soal 1 detail; soal 2 alasan/simpulan dari 1–2 kalimat (boleh 「…」とありますが). Bacaan 情報検索: soal 1 memilih butir yang memenuhi dua–tiga syarat, soal 2 hitungan/langkah dari catatan. |

Bacaan L5 bank yang lahir sebelum 2026-11-20 (90–165) boleh tetap pada panjang lamanya saat revisi kata/angka; revisi dengan
`siapkan.mjs --ketat` (menaikkan bacaan lama ke standar) memakai batas sekarang. Level naik karena
bacaannya lebih panjang dan pertanyaannya lebih menuntut, bukan karena tata bahasanya naik ke N4.
