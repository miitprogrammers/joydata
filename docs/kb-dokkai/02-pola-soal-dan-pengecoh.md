# Katalog jenis soal, pengecoh, dan kunci — dari sampel JLPT

Disarikan dari 22 soal dokkai di tiga sampel ([01-format-dokkai-jlpt.md](01-format-dokkai-jlpt.md)): A = ujian internal N5,
B = workbook resmi N5, C = workbook resmi N4. Kode di bawah (J, P, K) dipakai di tabel bedah soal file 01.

Bahan ini disiapkan untuk prompt AI dan spesifikasi bank: apa saja yang bisa diminta, dengan contoh nyata di belakangnya.

## J — Jenis pertanyaan

| Kode | Jenis | Bentuk pertanyaan (pola) | Sampel |
|---|---|---|---|
| J1 | Fakta langsung | 何を／どこで／だれと／いつ／どうやって ～ましたか。 | A27, B27, C31 |
| J2 | Alasan | どうして ～ましたか。 → pilihan berakhiran ～から | A30, B30 |
| J3 | Urutan / langkah | はじめに 何を しますか。／～た あとで、～を どうしますか。／～てから、何を しましたか。／まず どうしなければなりませんか。 | A29, B29, C32, C35 |
| J4 | Maksud pesan bagi penerima | (pengirim)は (penerima)に 何が 言いたいですか。／(penerima)は 何を 知らせなければなりませんか。 | A28, C28 |
| J5 | Rujukan bagian bergaris bawah | どうして ①～か。／何を ②～か。／②～と ありますが、どんな ～ですか。 | A30, A31, B30, C30, C33 |
| J6 | Negatif | ～ではない ものは どれですか。 (kata ではない digarisbawahi) | C29 |
| J7 | Yang bisa diketahui dari teks | この お知らせから、～について わかる ことは 何ですか。 | C27 |
| J8 | Rencana / masa depan | あした どうしますか。／来週、何を すると 言っていますか。 | B31, C26 |
| J9 | Keadaan sekarang vs keinginan | 今の ～は どれですか。 | B28 |
| J10 | Cari informasi dengan syarat | (syarat 1)、(syarat 2)。どれに しますか／いつが 安いですか／いくら はらわなければなりませんか。 | A32, B32, C34, C35 |

## P — Teknik pengecoh

Prinsip yang berlaku di **semua** sampel: pengecoh dibuat dari isi teks itu sendiri. Peserta yang hanya mengenali
kata (tanpa memahami hubungannya) akan terjebak; peserta yang tidak membaca sama sekali tidak bisa menyingkirkan
pilihan apa pun dengan akal sehat.

| Kode | Teknik | Cara membuat | Sampel |
|---|---|---|---|
| P1 | Kebiasaan vs kali ini | Teks menyebut kebiasaan (毎朝、いつも) lalu kejadian hari ini yang berbeda; pengecoh = kebiasaan. | A27, B27 |
| P2 | Keinginan vs keadaan | Teks menyebut keadaan dan keinginan (～が ほしい、～たい); pengecoh = yang diinginkan. | B28 |
| P3 | Matriks 2×2 | Dua unsur teks, masing-masing punya dua nilai (siapa × apa, kapan × di mana); empat kombinasi, satu benar. Dengan 3 pilihan: tiga dari empat kombinasi. | A28, B27, B31, C26, C35 |
| P4 | Peran/arah tertukar | Siapa memberi dan siapa menerima, 借りる／貸す／返す, あげる／もらう — pengecoh membalik arahnya. | A29, B29, C26 |
| P5 | Objek tertukar | Dua benda dalam satu teks (buku vs fotokopinya, pisang dibawa vs dimakan); pengecoh memasangkan tindakan dengan benda yang salah. | B29, A27 |
| P6 | Benar tetapi bukan jawaban | Fakta yang benar di teks tetapi tidak menjawab pertanyaan (capek ≠ alasan "bingung"). Paling kuat untuk soal どうして. | A30, B30 |
| P7 | Urutan teks ≠ urutan kerja | Langkah yang disebut lebih dulu di teks tetapi dikerjakan belakangan. Untuk soal はじめに. | A29 |
| P8 | Aturan dibalik | Larangan dijadikan izin dan sebaliknya (～ては いけません ↔ ～ても いいです). | C27 |
| P9 | Angka/waktu tertukar | Angka atau waktu dari bagian lain teks; batas 以上 vs 近く; tanggal vs あした／あさって. | C26, C28, C31 |
| P10 | Info untuk pihak lain | Pengumuman untuk dua kelompok; pengecoh = aturan kelompok lain. | A28 |
| P11 | Yang "tidak ada" dijadikan ada | Teks menyebut benda/kegiatan yang tidak ada atau tidak dilakukan; pengecoh menawarkannya sebagai ada. | C30, C32, C33 |
| P12 | Pengecualian / catatan | Isi tabel diubah oleh catatan (※); pengecoh = isi tabel tanpa catatan. | C34 |
| P13 | Gagal di satu syarat | Soal cari informasi: tiap pengecoh memenuhi semua syarat kecuali satu, dan syaratnya berbeda-beda. | A32, B32 |

## K — Bentuk kunci

| Kode | Bentuk | Contoh | Sampel |
|---|---|---|---|
| K1 | Hampir sama dengan kalimat teks | "テストは 今日ではなくて、あしたでした" → かんじの テストが ある 日 | A27, A31 |
| K2 | Parafrase: sinonim, kata umum ↔ khusus | ボールを使って遊ぶこと → サッカーの練習 | C27, C29 |
| K3 | Konversi | 明日(30日) … 31日 → あさって | C28 |
| K4 | Simpulan dari beberapa kalimat | tidak sempat belajar semalam + bangun jam 5 + belajar hal. 41–60 → べんきょうが したかったから | A30 |

Di JOYdata, `pembahasan` tetap **kutipan persis** dari teks + artinya; kunci yang berupa parafrase (K2, K3) tetap bisa
dibuktikan karena kutipannya menunjuk kalimat aslinya, dan penalaran ditulis dalam kurung (aturan yang sudah ada di
spesifikasi bank).

## Jenis teks dan kalimat bingkai

Template di bawah ditulis dengan kana dan kanji dasar supaya aman di N5. Bingkai adalah kalimat narator sebelum teks.

| Jenis teks | Kalimat bingkai (template) | Isi yang khas | Sampel |
|---|---|---|---|
| Narasi わたし | — (langsung) | 3–5 kalimat tentang hari ini/kebiasaan; satu "tapi hari ini…" | A27, B27, B28 |
| Deskripsi orang ketiga | — | pekerjaan atau kegiatan seseorang, daftar ～たり～たり | C29 |
| Memo | (なまえ)さんの つくえの 上に、この メモが あります。 | nama penerima → 2–4 instruksi berurutan → nama pengirim (+ jam) | A29, B29, C26 |
| Pengumuman / papan | (だれ)が この 紙を 見ました。／(場所)に、この お知らせが あります。 | untuk siapa → jam, aturan (～て ください、～ては いけません) → pengirim, tanggal | A28, C27 |
| Email | これは、(A)から (B)に きた メールです。 | sapaan nama → masalah → permintaan (～て ください、～ませんか) → nama | C28 |
| Karangan | これは (なまえ)さんが 書いた さくぶんです。 | judul + nama, 3–5 paragraf, bagian bergaris bawah ①② | A30–31 |
| Cerita (teks sedang) | — | urutan kejadian, satu masalah dan penyelesaiannya | B30–31, C30–33 |
| Brosur / jadwal / tabel | 右の (お知らせ／ひょう)を 見て、しつもんに こたえて ください。 | 3–4 baris pilihan dengan angka (jam, harga, hari), kadang catatan ※ | A32, B32, C34–35 |

## Usulan pemetaan ke level JOYdata (N5)

Level JOYdata naik karena panjang dan tuntutan pertanyaan, bukan tata bahasa ([tingkat-N5.md](../../.claude/skills/generate-soal/references/tingkat-N5.md)).
Usulan di bawah menambahkan jenis teks dan teknik JLPT ke tiap level; **belum diterapkan** di prompt maupun spesifikasi.

| Level | Jenis teks | Jenis pertanyaan | Pengecoh | Kunci |
|---|---|---|---|---|
| L1 | Narasi わたし | J1, J8 | P1, P3 | K1 |
| L2 | Narasi, deskripsi orang ketiga | J1, J9 | P1, P2, P9 | K1 |
| L3 | Memo, papan pengumuman (dengan bingkai) | J2, J3, J7 | P4, P5, P6, P8 | K1, K2 |
| L4 | Memo berjadwal, email, pengumuman dengan jam/harga | J3, J4, J10 (tanpa tabel) | P3, P7, P9, P10, P13 | K2, K3 |
| L5 | Karangan berjudul, cerita, email panjang (teks sedang) | J5, J2 (simpulan), J6 | P6, P11 | K4 |

Untuk N4, pemetaan yang sama bisa dipakai di atas pembagian pola modul (L1 pola dasar … L5 keigo); spesifikasi N4
sudah punya bagian "Soal yang menguji pola" yang sejalan dengan P4 (beri-terima) dan J4 (keharusan, keputusan).

## Daftar periksa "soal mirip JLPT"

Ringkasan yang bisa dipindahkan ke prompt (setelah disetujui):

1. Teks selain narasi diawali kalimat bingkai dan, untuk memo/email, ditutup nama pengirim.
2. Setiap soal menanyakan bagian teks yang berbeda; soal kedua tidak terjawab dari soal pertama.
3. Semua pengecoh diambil dari teks itu (minimal satu teknik P per soal); tidak ada pengecoh yang bisa disingkirkan
   dengan akal sehat.
4. Kunci boleh parafrase (K2–K4) di level atas; pembahasan tetap mengutip kalimat asli.
5. Pilihan sejajar: bentuk sama, panjang mirip.
6. Untuk どうして, minimal satu pengecoh adalah fakta benar di teks yang bukan alasannya (P6).
7. Untuk はじめに／まず, urutan di teks dibuat berbeda dari urutan kerja (P7).

## Yang belum bisa ditiru JOYdata tanpa perubahan kode

| Ciri JLPT | Hambatan sekarang |
|---|---|
| 4 pilihan | Validator (`validasiBacaanAi`: tepat 3 opsi), skema JSON AI, tampilan, bank 3 opsi. |
| 1 soal per teks pendek, 4 soal per teks sedang (N4) | Validator AI menerima 2–3 soal; bank selalu 2. |
| Garis bawah ①② | Tampilan `FuriganaText` hanya teks + ruby; tidak ada penanda garis bawah. |
| Memo, email, tabel dengan baris baru | Bank tidak memakai baris baru; `FuriganaText` tidak memecah baris. |
| Pilihan gambar | Tidak didukung (pilihan hanya teks). |
