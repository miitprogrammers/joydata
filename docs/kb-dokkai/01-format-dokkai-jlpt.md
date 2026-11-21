# Format dokkai JLPT N5 & N4 — bedah tiga sampel soal

Tujuan file ini: menunjukkan seperti apa **soal dokkai JLPT yang asli**, supaya prompt AI JOYdata bisa meniru bentuknya
(jenis teks, jenis pertanyaan, cara membuat pengecoh), bukan hanya tingkat tata bahasanya.

Isi bacaan sampel **diringkas dengan kata-kata sendiri**; yang dikutip hanya potongan pendek yang menjadi kunci. Teks
lengkap ada di sumbernya.

## Sumber

| Kode | Sampel | Dari mana | Kunci |
|---|---|---|---|
| **A** | Ujian internal LPK "SOAL N5 VER.2", Bagian 2 文法・読解 — isinya **sama dengan sampel resmi JLPT N5 2018** ([N5R.pdf](https://www.jlpt.jp/samples/sample2018/pdf/N5R.pdf)) | PDF lampiran user (2026-11-20) | tabel 正答表 di PDF; dicek ulang satu per satu |
| **B** | JLPT N5 Official Practice Workbook (公式問題集), bagian 読解 | [jlptsensei.com/downloads/jlpt-n5-practice-test](https://jlptsensei.com/downloads/jlpt-n5-practice-test/) | correct-answer-sheet.pdf resmi |
| **C** | JLPT N4 Official Practice Workbook, bagian 読解 | [jlptsensei.com/downloads/jlpt-n4-practice-test](https://jlptsensei.com/downloads/jlpt-n4-practice-test/) | correct-answer-sheet.pdf resmi |

Semua kunci jawaban dokkai di A, B, dan C sudah saya kerjakan sendiri dulu, lalu dicocokkan dengan kunci: **semuanya cocok**.
Catatan koreksi untuk PDF A ada di [bagian 5](#5-catatan-koreksi-untuk-pdf-ujian-internal-a).

## 1. Posisi dokkai di kertas ujian

Di N5 dan N4, dokkai (読解) ada di kertas yang sama dengan tata bahasa: **言語知識（文法）・読解**. Ini sejalan dengan
keputusan JOYdata menggabungkan Bunpou-Dokkai menjadi satu bagian nilai.

Bagian dokkai terdiri dari tiga jenis soal (nomor もんだい mengikuti sampel):

| もんだい | Nama resmi | Isi |
|---|---|---|
| 4 | 内容理解（短文） pemahaman teks pendek | beberapa teks pendek, masing-masing **1 soal** |
| 5 | 内容理解（中文） pemahaman teks sedang | satu teks lebih panjang, **2–4 soal** |
| 6 | 情報検索 mencari informasi | brosur, jadwal, atau tabel + soal dengan syarat |

Ditambah satu jenis di bagian tata bahasa yang juga berupa bacaan: **もんだい3 文章の文法** (bacaan rumpang, contoh:
A no. 22–26, dua karangan pendek dengan 5 kotak kosong: konjungsi, akhiran ajakan, bentuk lampau, partikel, ～に行きます).

## 2. Jumlah, panjang, dan bentuk

| | N5 · A | N5 · B | N4 · C |
|---|---|---|---|
| もんだい4 短文 | 3 teks × 1 soal | 3 teks × 1 soal | 4 teks × 1 soal |
| もんだい5 中文 | 1 teks × 2 soal | 1 teks × 2 soal | 1 teks × 4 soal |
| もんだい6 情報検索 | 1 tabel × 1 soal | 1 brosur × 1 soal | 1 pengumuman + tabel × 2 soal |
| **Soal dokkai** | **6** | **6** | **10** |
| Pilihan per soal | 4 | 4 | 4 |
| Panjang teks pendek* | ±90–130 | ±70–110 | ±100–130 |
| Panjang teks sedang* | ±300 | ±265 | ±440 |

\* Jumlah karakter tanpa furigana, dihitung kasar dari sampel (termasuk kalimat bingkai dan isi memo).

> **Jumlah soal resmi sekarang berbeda dari sampel.** Sejak Desember 2020 ([pengumuman jlpt.jp](https://www.jlpt.jp/topics/202011051597200631.html)):
> N5 = 短文 **2** · 中文 **2** · 情報検索 **1** (5 soal), N4 = **3** · **3** · **2** (8 soal). Ketiga sampel di atas memakai
> jumlah lama (N5 3·2·1, N4 4·4·2). Panjang resmi ([大問のねらい N5](https://www.jlpt.jp/guideline/pdf/n5_revised.pdf),
> [N4](https://www.jlpt.jp/guideline/pdf/n4_revised.pdf)): N5 = 80 / 250 / 250 字程度, N4 = 100–200 / 450 / 400 字程度.
> Rincian dan sumber lain: [11-sumber-pembanding.md](11-sumber-pembanding.md).

Bandingkan dengan JOYdata (spesifikasi bank `tingkat-N5.md` / `tingkat-N4.md`):

| | JOYdata | JLPT (sampel) |
|---|---|---|
| N5 | L1 30–58 · L2 45–85 · L3 50–95 · L4 60–115 · L5 90–165 | 短文 ±70–130 · 中文 ±265–300 (resmi: 80 · 250) |
| N4 | L1 45–90 · L2 65–130 · L3 75–145 · L4 90–175 · L5 135–250 | 短文 ±100–130 · 中文 ±440 (resmi: 100–200 · 450) |
| Soal per bacaan | selalu 2 (validator: 2–3) | 短文 1 · 中文 2 (N5) / 3–4 (N4) · 情報検索 1–2 |
| Pilihan | 3 | 4 |

Artinya: L2–L4 JOYdata kira-kira setara teks pendek JLPT; **teks sedang JLPT lebih panjang daripada L5 JOYdata** (N5:
±265–300 vs maks 165; N4: ±440 vs maks 250).

## 3. Bedah per soal

Kolom "Teknik" merujuk ke katalog di [02-pola-soal-dan-pengecoh.md](02-pola-soal-dan-pengecoh.md) (J = jenis
pertanyaan, P = teknik pengecoh, K = bentuk kunci).

### Sampel A — ujian internal N5

| No | Teks | Pertanyaan | Kunci & bukti | Pengecoh | Teknik |
|---|---|---|---|---|---|
| 27 | **Narasi わたし**, 3 kalimat: biasanya sarapan nasi + natto atau roti + telur; pagi ini tidak makan apa-apa, membawa pisang ke sekolah, karena bangun kesiangan. | けさ 学校へ 行く 前に、何を 食べましたか。 | 3 なにも 食べませんでした ← "けさは なにも 食べませんでした" | 1, 2 = kebiasaan sehari-hari (ada di teks); 4 = pisang (dibawa, bukan dimakan sebelum berangkat) | J1 · P1 · P5 |
| 28 | **Pengumuman kertas** di kampus, bingkai "学生が この 紙を 見ました": dosen libur sampai siang; kelas pagi 日本語1 ditiadakan, kelas sore 日本語2 tetap; PR 日本語1 dikumpulkan minggu depan. | 大学は「日本語1」の クラスの 学生に 何が 言いたいですか。 | 2 kelas tidak ada, PR minggu depan | Matriks 2×2: kelas ada/tidak × PR sore/minggu depan; info untuk 日本語2 sebagai jebakan | J4 · P3 · P10 |
| 29 | **Memo** di meja kantor, dari 多田 untuk ボゴ, jam 9:30: jam 10 petugas pos mengambil paket; serahkan paket + uang; uang dipegang 中西, ambil sebelum petugas datang. | この メモを 読んで、ボゴさんは はじめに 何を しますか。 | 1 中西さんに お金を もらいます | 4 = langkah yang disebut lebih dulu di teks tetapi dikerjakan belakangan; 2, 3 = arah pemberian tertukar | J3 · P7 · P4 |
| 30 | **Karangan** (さくぶん) berjudul "まちがえました" + nama penulis: Minggu main bola sampai sore, capek, langsung tidur, tidak sempat belajar untuk tes kanji "hari ini". Pagi bangun jam 5 (**garis bawah ①**), mandi, sarapan, belajar hal. 41–60, ke sekolah. | どうして ①けさは 5時に 起きましたか。 | 2 ingin belajar untuk tes kanji — **disimpulkan** dari paragraf sebelumnya, tidak ada kalimat "～から" | 1, 3, 4 = kegiatan lain yang memang disebut, dibungkus "～たかったから" | J5 · J2 · P6 |
| 31 | (lanjutan) Di kelas tidak ada yang belajar kanji. **まちがえました②**: tesnya besok, bukan hari ini. | チンさんは 何を ②まちがえましたか。 | 3 hari tes ← "テストは 今日ではなくて、あしたでした" | 1, 2, 4 = unsur lain yang disebut (buku teks, halaman, kelas) | J5 · K1 |
| 32 | **Tabel 4 rute** ke kampus: stasiun asal, moda, waktu, biaya. | Berangkat dari 花田 atau 糸川, biaya ≤ 500 yen, waktu sesingkat mungkin: rute mana? | 4 (糸川, 35 menit, 430 yen) | ① stasiun lain (寺西) walau termurah; ② tercepat tetapi 550 yen; ③ memenuhi syarat tetapi 40 menit | J10 · P13 |

### Sampel B — Official Practice Workbook N5

| No | Teks | Pertanyaan | Kunci & bukti | Pengecoh | Teknik |
|---|---|---|---|---|---|
| 27 | **Narasi わたし**, 3 kalimat: hari ini belanja dengan teman karena ingin DVD film yang ditonton 3 bulan lalu; DVD itu nanti ditonton bersama teman dan kakak perempuan. | 「わたし」は 今日、何を しましたか。 | 2 友だちと DVDを 買いに 行きました | Matriks 2×2: (teman / kakak) × (menonton film / membeli DVD); semua unsur ada di teks, beda waktu | J1 · P3 · P1 |
| 28 | **Narasi**: kamar punya 1 meja, 2 kursi, 1 rak; buku banyak, jadi ingin rak yang lebih besar. | 今の へやは どれですか。 (pilihan **gambar**) | gambar dengan 1 rak dan buku menumpuk | gambar dengan 2 rak (= keinginan, bukan keadaan sekarang) | J9 · P2 |
| 29 | **Memo** dari 山口先生 untuk 森, bingkai "森さんの 机の 上に、… メモと 本が あります": buku dipinjam dari 中川先生; fotokopi hal. 5 sebanyak 25 lembar; fotokopi diserahkan ke 南; buku diletakkan di meja Yamaguchi (dia sendiri yang mengembalikan besok). | 森さんは コピーを した あとで、本を どうしますか。 | 4 山口先生の 机の 上に おきます | 2 = yang diserahkan ke 南 adalah fotokopinya; 3 = mengembalikan ke 中川先生 dilakukan Yamaguchi; 1 = buku dipakai di kelas | J3 · P5 · P4 |
| 30 | **Cerita** (teks sedang): pulang larut dan capek; turun di stasiun, hujan, tidak punya payung, **こまりました** (garis bawah); petugas menawarkan payung di kotak ("payung bersama", gratis, kembalikan besok). | どうして こまりましたか。 | 4 かさが なかったから | 1–3 = fakta yang benar di teks (pulang larut, banyak kerja, capek) tetapi bukan sebab "bingung" | J5 · J2 · P6 |
| 31 | (lanjutan) | 「わたし」は、あした どうしますか。 | 1 かさを はこの 中に 入れます | Matriks 2×2: (payung / uang) × (masukkan ke kotak / serahkan ke petugas); "お金は いりません" menjadikan uang pengecoh | J8 · P3 |
| 32 | **Brosur toko**: diskon 11–14 Juni (termasuk tisu toilet), 15–18 Juni (barang lain), dan diskon mingguan per hari (Rabu–Kamis: tahu, daging, sayur). | Ingin membeli tisu toilet, daging, dan sayur pada hari yang sama: kapan murah? | 2 13 (Rabu) dan 14 (Kamis) | Pasangan hari lain yang tidak memenuhi kedua jadwal sekaligus (mis. 11–12: tisu murah, daging tidak) | J10 · P13 |

### Sampel C — Official Practice Workbook N4

| No | Teks | Pertanyaan | Kunci & bukti | Pengecoh | Teknik |
|---|---|---|---|---|---|
| 26 | **Memo** dari 石川 untuk アリ: mengembalikan buku yang dipinjam; juga meletakkan buku yang ingin dipinjam Ari; karena berat hari ini hanya 2 buku, minggu depan bawa 3 lagi. | 石川さんは、来週、何をすると言っていますか。 | 4 アリさんに本を3冊貸します | Matriks 2×2: (2 / 3 buku) × (返す / 貸す) | J8 · P3 · P4 · P9 |
| 27 | **Papan pengumuman** di pintu taman: buka jam 6–21; sepeda/motor diparkir di pintu masuk, tidak boleh dibawa masuk; dilarang main bola dan merokok. | このお知らせから、公園についてわかることは何ですか。 | 3 サッカーの練習をしてはいけません ← "ボールを使って遊ぶこと" | 1, 2, 4 = aturan yang dibalik (jam 22 boleh masuk, motor tidak boleh di pintu masuk, merokok boleh) | J7 · P8 · K2 |
| 28 | **Email** dari 山田先生 untuk トム: janji besok (tgl 30) batal karena rapat; bisakah diganti tgl 31 jam 3 sore; balas setelah membaca. | トムさんは、山田先生に何を知らせなければなりませんか。 | 2 約束をあさってに変えられるかどうか | 1 "besok" (tgl 30 = besok, bukan tgl 31); 3, 4 = jadwal Tom pada waktu yang salah | J4 · K3 · P9 |
| 29 | **Deskripsi orang ketiga**: pekerjaan 石田 di perpustakaan (melayani konsultasi, menentukan letak buku, **menulis** resensi untuk koran perpustakaan, membacakan buku bergambar). | 石田さんの仕事**ではない**ものはどれですか。 (bergaris bawah) | 3 新聞にのっている…紹介文を**さがします** | 1, 2, 4 = parafrase pekerjaan yang benar; kunci mengganti satu kata kerja (書く → さがす) | J6 · K2 |
| 30 | **Cerita** (teks sedang, ±440 karakter): menginap di hotel di gunung; bus 2 jam lebih + jalan kaki hampir 30 menit; hotel kecil dan tua tetapi bersih; tidak ada TV, game, kulkas, AC; setelah sampai istirahat sebentar lalu jalan-jalan; tiap hari jalan, berenang di danau, menangkap serangga, tidur siang; "こんな生活もたまにはいいね" (garis bawah ②). | どんな①ホテルに泊まりましたか。 | 2 古いが、中はきれいなホテル | 1 hotel besar; 3 ada TV/game; 4 praktis — semuanya kebalikan teks | J5 · P11 |
| 31 | (lanjutan) | 駅からホテルまでどうやって行きましたか。 | 4 bus 2 jam **lebih**, jalan kaki **hampir** 30 menit | Angka dan moda tertukar; 以上 vs 近く dibalik | J1 · P9 |
| 32 | (lanjutan) | ホテルに着いてから、何をしましたか。 | 4 部屋で少し休んでから、散歩に行きました | Urutan lain atau kegiatan yang tidak ada (TV) | J3 · P11 |
| 33 | (lanjutan) | ②こんな生活とありますが、どんな生活ですか。 | 1 山で遊んだり、昼寝をしたりする生活 | 2, 3 = satu kegiatan benar + satu yang tidak ada (game, TV); 4 = "makan enak, tidak melakukan apa-apa" (tidak ada di teks) | J5 · P11 |
| 34 | **Pengumuman + tabel** "一日スポーツ教室": olahraga, jam, tempat, biaya; tabel menulis sepeda "ただ※", catatan kaki: sewa sepeda 200 yen. | 自転車を借りて乗りたい人は、いくら払わなければなりませんか。 | 3 200円 ← catatan kaki ※ | 1 ただ (isi tabel tanpa catatan kaki); 2, 4 = biaya olahraga lain | J10 · P12 |
| 35 | (lanjutan) Basket: pagi belajar aturan (datang ke 体育館 sebelum 10:00), sore pertandingan (ke 受付 sebelum 13:00). | Ingin belajar aturan basket lalu ikut pertandingan: pertama harus bagaimana? | 2 10:00までに体育館に行きます | Matriks 2×2: (10:00 / 13:00) × (受付 / 体育館) | J3 · J10 · P3 |

## 4. Ciri yang konsisten di semua sampel

1. **Kalimat bingkai.** Teks selain narasi diawali kalimat yang menjelaskan situasinya:
   "(nama)さんの机の上に、このメモがあります", "学生がこの紙を見ました", "これは、(A)から(B)に届いたメールです",
   "これは (nama)さんが書いたさくぶんです". Memo dan email ditutup nama pengirim, kadang tanggal dan jam.
2. **Jenis teks bervariasi**: narasi わたし, memo, pengumuman/papan, email, deskripsi orang ketiga, karangan berjudul,
   brosur/tabel. Di satu kertas ujian, tiap teks pendek berbeda jenis.
3. **Pertanyaan merujuk penanda di teks**: 「わたし」, garis bawah dengan nomor ①②, "～とありますが".
4. **Semua pengecoh berasal dari teks itu sendiri.** Tidak ada pengecoh yang ngawur. Yang paling sering: unsur yang sama
   dengan waktu/pelaku/objek yang berbeda, dan fakta yang benar tetapi tidak menjawab pertanyaan.
5. **Kunci sering parafrase**, tidak mengulang kata teks: ボールを使って遊ぶこと → サッカーの練習; 31日 → あさって;
   "tidak sempat belajar" → べんきょうが したかったから.
6. **Pilihan sejajar**: keempatnya berbentuk sama (semua kalimat ～ます, semua frasa ～から, semua tanggal).
7. **Soal "kenapa" tidak selalu dijawab kalimat ～から.** Di A30 alasannya harus disimpulkan dari paragraf sebelumnya.
8. **Teks sedang punya 2–4 soal yang menyisir teks dari awal ke akhir**, satu soal per bagian.

Ciri tampilan (untuk diketahui saja; beberapa sudah diputuskan berbeda di JOYdata):

| Hal | JLPT | JOYdata sekarang |
|---|---|---|
| Furigana | N5: di setiap kanji. N4: hanya kanji yang lebih sulit (公園, 約束, 都合, 相談). | Bacaan resmi tampil tanpa furigana saat menjawab (keputusan user 2026-11-03); furigana muncul di pembahasan. |
| Spasi | N5 ditulis dengan spasi antar frasa (わたしは 今日、友だちと …). N4 tanpa spasi. | Tanpa spasi. |
| Angka | Angka Arab di teks mendatar: 3か月, 25枚, 10時, 500円, 6月11日. | Spesifikasi bank: angka kanji (六時, 三百円). Prompt AI: contohnya angka kanji. |
| Huruf Latin | Muncul bila memang begitu ditulis (DVD). | Spesifikasi: tidak ada huruf Latin; validator menolak kata Latin di pilihan. |
| Pilihan gambar | Ada (B28). | Tidak didukung. |
| Garis bawah ①② | Ada (A30–31, B30, C29–33). | Tidak didukung di tampilan. |
| Tabel/brosur | Ada di setiap もんだい6. | Teks bacaan satu paragraf; tampilan belum memecah baris. |

## 5. Catatan koreksi untuk PDF ujian internal (A)

Ditemukan saat mengecek kunci; tidak ada hubungannya dengan prompt, tetapi perlu dibetulkan di PDF:

1. **文字・語彙 no. 32: kunci salah.** Soal: たんじょうびは ６がつ 15 にちです。 Jawaban yang benar **3** (6がつ15にちに
   うまれました); tabel kunci menulis **2** (テストが はじまりました). Sebagai pembanding, kunci resmi workbook N5 untuk
   問題4 no. 29–32 adalah 3·1·2·**3**, sedangkan PDF internal 3·1·2·**2** — kemungkinan salah salin.
2. **文法 もんだい2 no. 18: kotak isian kurang satu.** Pilihannya 4 (の・と・子ども・いっしょに), tetapi di soal hanya ada 3
   kotak (2 garis + ★). Seharusnya 兄 ＿ ＿ ★ ＿ 出かけました (兄 の 子ども と いっしょに 出かけました; ★ = と = 2, kunci 2
   sudah benar).
3. **Halaman 15: judul もんだい５ hilang.** Halaman langsung mulai dengan "こたえは、１・２・３・４から…"; instruksi
   "もんだい５ つぎの ぶんしょうを 読んで、しつもんに こたえて ください。" tidak tercetak.
4. Kunci 文法・読解 lainnya (32 soal) sudah dicek dengan mengerjakan soalnya: **semua benar**.
