# Tingkat N3 — tata bahasa, gaya, kanji, dan ciri level

Pelengkap [spesifikasi-soal.md](spesifikasi-soal.md) untuk bank N3 (`server/domain/bankSoal/dokkaiN3.js`, id `N3L1-1`).
Sumber aturan: `docs/kb-dokkai/12-n3.md` (format resmi JLPT N3, bedah 16 soal workbook resmi) dan
`docs/kb-dokkai/17-aturan-final.md` § 5. Bank N3 tidak punya modul bunpou: level mengikuti **jenis bacaan resmi N3**.

## Kanji

Hanya kanji dari volume yang dipelajari sampai N3 (N5 Dasar + Vol 1–5, N4 Vol 1–5, N3 Vol 1–5) yang tinggal sebagai
kanji; kata dengan kanji lain ditulis kana. Tulis seperti biasa dengan furigana, lalu jalankan `rapikan.mjs`; gate menolak
kanji di luar daftar yang masih tersisa. Deretan kana yang panjang sulit dibaca — ganti katanya bila hasilnya janggal.

## Tata bahasa dan gaya

- Tata bahasa sampai N3. Pakai pola N3 dengan wajar, tidak dipamerkan: ～わけではない, ～によって, ～として, ～にとって,
  ～に対して, ～うちに, ～たびに, ～おかげで, ～ばかりでなく, ～さえ, ～に比べて, ～ば～ほど, bercampur dengan pola N4
  (～ことになった, ～てしまう, ～ようにする, ～ずに, ～のだそうだ). Daftar pola N3: `docs/kb-dokkai/05-tata-bahasa-n3.md`.
- Pola N2 yang sering ikut tertulis diperingatkan gate: ～おそれがある (→ ～かもしれない), ～ものの (→ ～が), ～に限らず
  (→ ～だけでなく), ～次第で (→ ～すれば), ～ざるを得ない, ～かねない, ～に際して, ～に伴って, ～に基づいて, ～にわたって.
- **Esai, artikel, dan cerita bergaya biasa** (だ・である, lampau biasa); memo dan email bergaya です・ます.
- **Pertanyaan dan pilihan bergaya biasa**, seperti JLPT N3: 「…何か。」「…どうしなければならないか。」
  「この文章を書いた人は…と考えているか。」 (gate tetap meminta pertanyaan diakhiri 「か。」).
- **Catatan (注)** untuk kata di atas N3: di baris terakhir teks, 「（注）ほっとする：安心{あんしん}する」, paling banyak 2
  catatan per bacaan. Kata yang dijelaskan tidak boleh menjadi kunci jawaban.
- Angka Arab seperti di [spesifikasi-soal.md](spesifikasi-soal.md).

## Ciri tiap level

Panjang dihitung dari teks tanpa furigana, sesudah dirapikan; gate menolak yang di luar batas.

| Level | Jenis resmi | Panjang | Kalimat | Isi bacaan | Jenis pertanyaan |
|---|---|---|---|---|---|
| L1 | 短文 | 150–200 | 5–10 | Penjelasan atau instruksi tentang hidup dan kerja: memo kantor, pengumuman, email kerja (baris kepala あて先・件名 boleh). | Apa yang harus dilakukan pembaca; maksud pesan bagi penerima. |
| L2 | 短文 | 150–200 | 5–10 | Esai pendek atau cerita pengalaman, gaya biasa. | Maksud bagian yang dirujuk (「…」とあるが、どのようなことか。); pendapat penulis. |
| L3 | 中文 | 300–350 | 9–18 | Penjelasan atau esai. | Kata tunjuk (このこと／それ は何を指しているか); sebab-akibat atau alasan menurut penulis. |
| L4 | 中文 | 330–380 | 10–20 | Esai atau artikel tentang kebiasaan, pekerjaan, masyarakat. | Contoh dari pernyataan umum (例えばどんな…か); pendapat penulis (…と考えているか). |
| L5 | 長文 | 500–550 | 15–30 | Esai, artikel, atau surat dengan alur argumen. | Satu detail/rujukan; gagasan utama atau tema (一番言いたいことは何か／全体のテーマは何か). |

## Pengecoh khas N3

Selain teknik (a)–(h) di [spesifikasi-soal.md](spesifikasi-soal.md):

- **Satu kata diganti/dihilangkan**: parafrase yang benar kecuali satu kata kunci (同じ給料 → 給料; 順番に → 土日に).
- **Konsep mirip tapi beda**: "pengalaman masa kecil" vs "hati anak"; "teman" vs "kakek-nenek".
- **Terlalu sempit / terlalu luas** untuk soal tema dan gagasan utama: bagian teks yang benar tetapi bukan
  keseluruhan, atau simpulan yang lebih jauh dari teks.

Contoh nyata (workbook resmi N3, no. 24–39): `docs/kb-dokkai/12-n3.md` § 3.
