# Spek 01 — Prompt AI dokkai (`server/ai/dokkaiAi.js`)

Fase F1 di [plan.md](plan.md). Sumber aturan: [../17-aturan-final.md](../17-aturan-final.md). Teks di bawah adalah **draf final** yang
disalin ke kode; ubah di sini dulu bila ada koreksi, lalu di kode.

## 1. Perubahan struktur kode

| Sekarang | Sesudah | Alasan |
|---|---|---|
| `TOPIK_DOKKAI` satu daftar (12–20) | `TOPIK_UMUM`, `TOPIK_KERJA_N5`, `TOPIK_KERJA_N4` + `export function topikDokkai(jlpt)`; `TOPIK_DOKKAI` tetap diekspor = gabungan semua | D3: topik pabrik/sampah/gaji tidak untuk N5 |
| `PANDUAN_LEVEL` satu set (23–29) | `PANDUAN_LEVEL = { N5: {…}, N4: {…}, N3: {…} }` + `export function panduanLevel(jlpt, level)` | panjang & jenis soal berbeda per tingkat (D5, R2, R12) |
| `PANDUAN_JLPT` (32–51) | teks baru §4 | D1, D2, D3, D8, R12–R16 |
| `panduanModul` (56–73) | **tetap** | modul N4 tidak berubah |
| `panduanPolaDokkai` (76–78) | tetap, memakai `PANDUAN_JLPT` baru; mengembalikan `null` bila `panduanLevel(jlpt, level)` null | |
| `SISTEM` (80–117) | teks baru §2 | R1, R3, R4, D4, D7 |
| `SCHEMA` (119–150) | **tetap** (3 opsi, 2 soal) | D6 |
| `PER_PERMINTAAN = 4` (153) | `export function ukuranPermintaan(jlpt, level)` → 2 bila `level === 'L5'` atau (`jlpt === 'N3'` dan level ∈ L3–L5), selain itu 4 | bacaan panjang vs batas waktu 50 s (`llm.js:24`) |
| payload `panduanLevel: PANDUAN_LEVEL[level]` (193) | `panduanLevel: panduanLevel(jlpt, level)`; `topik` dari `topikDokkai(jlpt)` | |

`tulisBacaanDokkai` tidak berubah tanda tangannya; pemanggil (`tesOnlineRepo.js:469`) tidak perlu diubah.

## 2. `SISTEM` (teks baru)

```text
Anda guru bahasa Jepang di sebuah LPK di Indonesia. Peserta adalah orang dewasa Indonesia yang belajar dengan buku
Minna no Nihongo untuk bekerja di Jepang. Tulis bacaan dokkai (membaca) BARU beserta soal pilihan ganda seperti soal
読解 JLPT, sesuai "panduanLevel" (panjang, jenis teks, jenis pertanyaan) dan "panduanPola" (tata bahasa, kosakata, gaya).

Aturan bahasa Jepang:
- Kalimat alami seperti di buku latihan JLPT.
- Kanji hanya dari daftar "kanjiBoleh" (kanji yang sudah dipelajari peserta). Kata dengan kanji lain ditulis dengan
  hiragana atau katakana; bila kata itu sulit, pilih kata lain yang lebih mudah.
- SETIAP kanji wajib diberi furigana tepat setelah rangkaian kanjinya dengan format 漢字{かんじ}.
  Contoh: 毎朝{まいあさ}6時{じ}に起{お}きます。 Okurigana ditulis di luar kurung kurawal.
- Angka ditulis dengan angka Arab: 6時{じ}, 300円{えん}, 3か月{げつ}, 10分{ぷん}, 2階{かい}, 5月{がつ}12日{にち}.
  Kanji angka hanya untuk kata tetap: 一{ひと}つ, 二{ふた}つ, 一人{ひとり}, 二人{ふたり}, 一緒{いっしょ}, 一度{いちど}, 一日中{いちにちじゅう}.
- Furigana kanji satuan setelah angka mengikuti bunyinya: 1本{ぽん}, 3本{ぼん}, 6本{ぽん}, 1分{ぷん}, 3分{ぷん}, 4時{じ}, 1日{ついたち},
  2日{ふつか}, 20日{はつか}, 4人{にん}, 1回{かい}.
- Kurung kurawal {} hanya untuk furigana.
- Baris baru hanya di "teks", untuk memo, email, pengumuman, dan daftar (satu bagian per baris). Judul, pertanyaan,
  dan pilihan satu baris.
- Nama orang: nama Jepang sederhana (田中{たなか}さん) atau nama dalam katakana (リナさん). Jangan nama orang terkenal.

Jenis teks:
- Narasi orang pertama (わたし) atau cerita boleh langsung dimulai.
- Teks lain diawali satu kalimat bingkai yang menjelaskan situasinya, lalu teksnya (tanpa spasi antar-kata):
  memo   → 「(nama)さんの机{つくえ}の上{うえ}に、このメモがあります。」 lalu nama penerima, isi, nama pengirim
  pengumuman → 「(tempat)に、このお知{し}らせがあります。」
  email  → 「これは、(A)から(B)にきたメールです。」 lalu sapaan, isi, nama pengirim
  karangan → 「これは(nama)さんが書{か}いたさくぶんです。」 lalu judul dan isi
- Tiap bacaan memakai jenis teks dan topik yang berbeda.

Aturan soal:
- Setiap bacaan punya tepat 2 soal, masing-masing tentang bagian teks yang berbeda. Soal kedua tidak boleh terjawab
  dari soal pertama.
- "tanya": pertanyaan bahasa Jepang dengan furigana, memakai pola kalimat setingkat bacaan.
  "tanyaId": terjemahan pertanyaan dalam bahasa Indonesia (hanya tampil di pembahasan setelah tes).
- "opsi": tepat 3 pilihan dalam BAHASA JEPANG dengan furigana. JANGAN PERNAH bahasa Indonesia atau huruf Latin
  (salah: "Pukul enam"; benar: 6時{じ}). Pilihan pendek dan sejajar bentuknya (semua kata benda, atau semua kalimat
  ～ます/～からです), panjangnya mirip.
- Tepat SATU pilihan benar menurut bacaan. Dua pengecoh diambil dari isi bacaan itu sendiri, dengan minimal satu cara:
  (a) kebiasaan vs kejadian kali ini (毎朝 … でも、けさは …);
  (b) keinginan vs keadaan sekarang (～が欲{ほ}しい vs yang ada);
  (c) dua unsur teks digabung silang (orang × tindakan, hari × tempat, jumlah × benda);
  (d) arah tertukar (siapa memberi/menerima; 借{か}ります／貸{か}します／返{かえ}します);
  (e) fakta yang benar di teks tetapi bukan jawaban pertanyaan (untuk どうして);
  (f) urutan di teks berbeda dari urutan pengerjaan (untuk はじめに／まず);
  (g) aturan dibalik (～てもいいです ↔ ～てはいけません);
  (h) angka, jam, atau hari dari bagian lain teks.
  Jangan pengecoh yang bisa disingkirkan dengan akal sehat tanpa membaca.
- Kunci: mulai level L3, minimal satu soal per bacaan berkunci parafrase — sinonim, kata umum ↔ khusus, atau tanggal
  ↔ あした/あさって — bukan salinan kata-kata teks. Pilihan yang benar tetap persis sesuai isi bacaan, jangan digabung
  dengan hal lain.
- "benar": indeks pilihan yang benar (0, 1, atau 2). Variasikan posisinya.
- Jawaban harus bisa ditemukan atau disimpulkan langsung dari bacaan.
- "pembahasan": kutip kalimat Jepang dari bacaan yang menjadi kunci (persis, tanpa furigana), lalu " = " dan artinya
  dalam bahasa Indonesia. Untuk kunci parafrase, hitungan, atau simpulan, tambahkan penalaran singkat dalam kurung.
- "terjemahan": terjemahan seluruh bacaan ke bahasa Indonesia yang wajar.
- "judul": judul pendek bahasa Jepang dengan furigana, menyebut topik, tidak membocorkan jawaban.

Sebelum menjawab, periksa setiap bacaan beserta soal dan pilihannya: (1) panjang teks sesuai "panduanLevel";
(2) tidak ada pola atau kata dari daftar JANGAN di "panduanPola", juga bila ditulis dengan kana; (3) angka Arab;
(4) tepat satu pilihan benar dan kedua pengecoh berasal dari teks. Perbaiki yang belum sesuai.

Setiap bacaan memakai topik yang berbeda, dipilih dari "topik". Jangan memakai judul atau cerita yang mirip dengan
"hindariJudul". Jawab hanya dengan objek JSON {"bacaan": [...]}.
```

Catatan untuk N4: contoh bingkai memo di N4 boleh 「…に、このメモと本{ほん}が置{お}いてあります。」 — `panduanPola` N4 yang
menentukan pola apa yang boleh. ～てあります tidak dipakai di bingkai N5 (Bab 30).

## 3. `PANDUAN_LEVEL` per tingkat

Panjang = karakter tanpa furigana. Jenis pertanyaan merujuk katalog J di [../02-pola-soal-dan-pengecoh.md](../02-pola-soal-dan-pengecoh.md).

### N5

```text
L1: Level 1: 30–58 karakter: 3 kalimat pendek (±15 karakter per kalimat), paling banyak 4. Narasi わたし tentang diri, benda, keluarga, atau kegiatan sederhana; satu informasi per kalimat. Kedua soal menanyakan fakta yang tertulis langsung (siapa, apa, di mana, kapan, berapa) atau rencana.
L2: Level 2: 45–85 karakter, 3–4 kalimat. Rutinitas, letak tempat, belanja, atau orang lain; ada jam, harga, jumlah, atau posisi. Soal tentang angka, waktu, tempat, atau keadaan sekarang vs keinginan; pengecoh dari angka/tempat lain di teks.
L3: Level 3: 50–95 karakter, 3–5 kalimat pendek termasuk kalimat bingkai. Memo atau pengumuman dengan kalimat bingkai: ajakan, permintaan (～てください), larangan, aturan, alasan (～から). Satu soal fakta; satu soal "mengapa", "apa yang harus / tidak boleh dilakukan", atau "apa yang dilakukan lebih dulu".
L4: Level 4: 60–115 karakter, 4–6 kalimat. Memo berjadwal, email, atau pengumuman dengan beberapa jam, harga, atau hari. Satu soal detail; satu soal yang menggabungkan dua detail (urutan, jumlah harga, hari yang memenuhi dua syarat, atau apa yang ingin disampaikan penulis kepada penerima).
L5: Level 5: 150–250 karakter (targetkan ±200), 10–14 kalimat; jangan kurang dari 150 karakter. Karangan berjudul dengan nama penulis, cerita, atau email panjang. Soal 1 detail; soal 2 alasan atau simpulan dari 1–2 kalimat (jawabannya tidak tertulis persis). Boleh merujuk bagian teks: 「…」と ありますが、….
```

### N4

```text
L1: Level 1: 45–90 karakter, 3–5 kalimat. Cerita pendek tentang diri sendiri: niat, pengalaman, yang bisa/belum dilakukan, aturan sederhana, pilihan. Kedua soal fakta yang tertulis langsung.
L2: Level 2: 65–130 karakter, 4–6 kalimat pendek (jangan lebih dari 130 karakter). Rutinitas kerja atau asrama, persiapan, tenggat, kewajiban, sebab-akibat, saran. Satu soal fakta; satu soal "mengapa", "apa yang harus / tidak perlu dilakukan", atau "kalau …, bagaimana".
L3: Level 3: 75–145 karakter, 4–7 kalimat. Pengumuman, memo, pesan, atau catatan dengan kalimat bingkai: keputusan, ketetapan, perkiraan, larangan dan perintah. Satu soal fakta; satu soal yang memisahkan yang pasti dari dugaan, keputusan sendiri dari ketetapan, atau syarat dari akibatnya.
L4: Level 4: 90–175 karakter, 5–8 kalimat. Cerita dengan dua–tiga tokoh atau email/pengumuman sopan: siapa melakukan apa untuk siapa, kejadian yang menimpa seseorang, kabar dari orang lain. Satu soal detail; satu soal "siapa yang melakukan / menerima / disuruh" atau gabungan dua detail.
L5: Level 5: 250–450 karakter (targetkan ±320), 12–20 kalimat; jangan kurang dari 250 karakter. Email atau surat kepada atasan/guru, pengumuman toko/hotel/perusahaan, percakapan dengan tamu, karangan. Soal 1 detail yang menuntut paham kata hormat (siapa yang datang, siapa yang melihat); soal 2 simpulan dari 1–2 kalimat.
```

### N3

```text
L1: Level 1 (短文): 150–200 karakter (targetkan ±180). Teks penjelasan atau instruksi tentang hidup dan kerja: memo kantor, pengumuman, email kerja dengan baris kepala (あて先・件名) bila perlu. Soal: apa yang harus dilakukan pembaca, atau apa yang ingin disampaikan penulis.
L2: Level 2 (短文): 150–200 karakter (targetkan ±180). Esai pendek atau cerita pengalaman, boleh gaya biasa (だ・である). Soal: maksud bagian yang dirujuk (「…」とあるが、どのようなことか。) atau pendapat penulis.
L3: Level 3 (中文): 300–350 karakter (targetkan ±330). Penjelasan atau esai. Soal 1: kata tunjuk (このこと／それ は何を指しているか); soal 2: sebab-akibat atau alasan menurut penulis.
L4: Level 4 (中文): 330–380 karakter (targetkan ±350). Esai atau artikel tentang kebiasaan, pekerjaan, atau masyarakat. Soal 1: contoh dari pernyataan umum (例えばどんな…か); soal 2: pendapat penulis (この文章を書いた人は…と考えているか).
L5: Level 5 (長文): 500–550 karakter (targetkan ±520). Esai, artikel, atau surat dengan alur argumen. Soal 1: satu detail atau rujukan; soal 2: gagasan utama atau tema (この文章で一番言いたいことは何か／全体のテーマは何か). Pengecoh soal tema: bagian teks yang benar tetapi terlalu sempit, atau simpulan yang lebih jauh dari teks.
```

## 4. `PANDUAN_JLPT` (teks baru)

### N5

```text
Pola kalimat N5 (peserta sudah belajar Minna no Nihongo Bab 1–25):
- Gaya です・ます di bacaan, pertanyaan, dan pilihan. Bentuk biasa hanya di dalam kalimat (sebelum ～と思{おも}います,
  ～と言{い}いました, penjelas kata benda) atau di dalam kutipan 「」.
- BOLEH: ～ます／～ました／～ません, kata sifat (sekarang, lampau, negatif), あります／います, ～より／～のほうが／～でいちばん,
  ～ませんか／～ましょう／～ましょうか, ～たいです, Nが欲{ほ}しいです, ～に行{い}きます (tujuan), ～てください, ～ています,
  V-かた (読{よ}み方{かた}), ～てもいいです, ～てはいけません, ～て、～, ～てから, ～ないでください, ～なければなりません,
  ～なくてもいいです, ～ことができます, ～まえに, ～たことがあります, ～たり～たりします, ～くなります／～になります,
  ～と思{おも}います, ～と言{い}いました, ～でしょう？, ～とき, ～と (kondisi: 押{お}すと), ～てもらいます／～てくれます／
  ～てあげます, ～たら, ～ても, ～あとで.
- Penjelas kata benda (きのう 見{み}た 映画{えいが}) hanya mulai L3.
- JANGAN (diajarkan setelah Bab 25): ～んです, ～ながら, ～し (～ですし, ～ますし), ～てしまいます, ～てあります, ～ておきます, bentuk maksud
  (行{い}こう), ～つもり, ～予定, まだ～ていません, ～ほうがいい, ～かもしれません, ～でしょう (dugaan), bentuk perintah atau
  larangan, ～ば, ～なら, ～ように, ～ようになります, pasif, bentuk potensial (読{よ}める), ～のが好{す}き, ～ので, ～のに,
  ～ために, ～そうです, ～ようです, ～すぎます, Nにします, ～はずです, ～ところ, ～ばかり, ～ないで (tanpa
  melakukan: 消{け}さないで帰{かえ}ります), ～とおりに, kausatif, keigo.
- Kosakata hanya dari Minna no Nihongo Bab 1–25. Kata kerja yang boleh: 事務所{じむしょ}, 昼休{ひるやす}み, 寮{りょう}, アルバイト,
  残業{ざんぎょう}, 捨{す}てます, 部長{ぶちょう}, 社長{しゃちょう}, 会議{かいぎ}, お弁当{べんとう}.
- JANGAN kata ini, baik ditulis dengan kanji maupun kana (belum diajarkan): 工場 (pakai 会社{かいしゃ}), 先輩 (pakai 会社{かいしゃ}の 人{ひと}), ごみ, 給料, 規則, 安全,
  機械, 計画, 動物園, 台所, 授業, 映画館, 言葉, 大人, 運動会, 花火, 入口, 結婚式, 夕方 (pakai 午後{ごご}／夜{よる}), 予定 (pakai
  ～ます), 場所 (pakai ところ), 返事. Aturan ditulis dengan ～てはいけません／～なければなりません, bukan kata 規則.
```

### N4

```text
Pola kalimat N4 (peserta sudah belajar Minna no Nihongo Bab 1–50 dan modul bunpou N4):
- Gaya です・ます di narasi, pertanyaan, dan pilihan. Bentuk biasa hanya di dalam kutipan 「」, tulisan papan atau rambu,
  dan memo/catatan harian bila pola fokus menuntutnya.
- Boleh: semua pola Minna Bab 1–50 dan pola modul sesuai panduan modul di bawah. Pola modul level berikutnya tetap
  dilarang walaupun sudah diajarkan di Minna.
- Boleh sebagai pendukung (bukan inti soal): あまり～ない, 全然～ない, きっと, ぜひ, など, なかなか～ない, そんなに, ～場合{ばあい}は,
  ～が必要{ひつよう}, ～予定{よてい}だ, ～ようだ, それに, それでも, ～たばかり, ～ようにする, ～てすみません, ～て (sebab),
  ～のに (tujuan), ～たらいいですか, 急{きゅう}に, さっき, やっと, ～そうだ (katanya, mulai L4).
- JANGAN (di luar Minna dan modul): ～させられる, ～わけ, ～として, ～にとって, ～によって, ～うちに, ～たびに,
  ～おかげで／～せいで, ～だけでなく, ～さえ, ～に対{たい}して／～に関{かん}して／～に比{くら}べて, ～っぽい／～がち／～ぎみ,
  ～はずがない, ～おきに, ～続{つづ}ける, ～出{だ}す (mulai), ～ということ, ～ように／～ような (berarti "seperti"),
  ～ではないか, ～がる. Partikel lisan かしら, かい, かな, って hanya di dalam kutipan.
- Kosakata dari Minna Bab 1–50, termasuk 工場{こうじょう}, ごみ, 給料{きゅうりょう}, 規則{きそく}, 安全{あんぜん}. 先輩, 作業, 機械
  boleh seperlunya dengan konteks yang jelas.
```

(`panduanModul('N4', level)` tetap ditambahkan di belakang teks ini, seperti sekarang.)

### N3

```text
Pola kalimat N3:
- Tata bahasa sampai N3. Pakai pola N3 dengan wajar, tidak dipamerkan, misalnya ～わけではない, ～によって, ～として,
  ～にとって, ～に対{たい}して, ～うちに, ～たびに, ～おかげで, ～ばかりでなく, ～さえ, ～に比{くら}べて, ～ば～ほど,
  bercampur dengan pola N4.
- Esai, artikel, dan cerita boleh bergaya biasa (だ・である); memo dan email bergaya です・ます.
- Pertanyaan dan pilihan memakai bentuk biasa seperti JLPT N3: 「…何か。」「…どうしなければならないか。」
  「この文章を書いた人は…と考えているか。」
- Kata di atas N3 boleh dipakai bila diberi catatan di baris terakhir teks: 「（注）ほっとする：安心{あんしん}する」
  (maksimal 2 catatan per bacaan).
```

## 5. Topik per tingkat

```js
// Untuk semua tingkat.
TOPIK_UMUM = ['keluarga', 'hobi', 'cuaca dan musim', 'belanja di supermarket', 'makan di restoran',
  'naik kereta atau bus', 'kantor pos', 'pergi ke dokter', 'kelas bahasa Jepang', 'libur akhir pekan',
  'ulang tahun teman', 'hewan peliharaan', 'kamar atau apartemen', 'olahraga', 'memasak di rumah', 'perpustakaan',
  'pesan telepon', 'email kepada teman', 'festival musim panas', 'salju di musim dingin', 'perjalanan wisata',
  'petunjuk jalan', 'jadwal minggu ini', 'membeli pakaian', 'flu dan istirahat', 'belajar untuk ujian',
  'taman di dekat rumah', 'membeli tiket', 'barang yang hilang', 'tetangga baru', 'teman sekamar'];
// Kehidupan pemagang yang bisa ditulis dengan kosakata Minna Bab 1–25.
TOPIK_KERJA_N5 = ['kerja paruh waktu', 'pengumuman di kantor', 'yang boleh dan tidak boleh di asrama', 'jam kerja dan istirahat siang',
  'lembur', 'mengirim uang ke keluarga', 'rapat di kantor', 'makan siang dengan rekan kerja'];
// Butuh kosakata Bab 26–50 (工場, ごみ, 給料, 規則, 安全).
TOPIK_KERJA_N4 = ['hari pertama kerja di pabrik', 'membuang sampah sesuai aturan', 'gaji bulan ini',
  'aturan keselamatan kerja', 'senior di tempat kerja', 'shift malam', 'mesin baru di tempat kerja'];

topikDokkai(jlpt) = jlpt === 'N5' ? [...TOPIK_UMUM, ...TOPIK_KERJA_N5] : [...TOPIK_UMUM, ...TOPIK_KERJA_N5, ...TOPIK_KERJA_N4]
```

## 6. Uji (file baru `server/ai/dokkaiAi.test.js`, didaftarkan di `package.json`)

| Uji | Harapan |
|---|---|
| `panduanLevel('N5','L5')` | memuat "150–250" |
| `panduanLevel('N4','L5')` | memuat "250–450" |
| `panduanLevel('N3','L5')` | memuat "500–550" dan "長文" |
| `panduanLevel('N2','L1')`, `panduanLevel('N5','SEMUA')` | `null` |
| `panduanPolaDokkai('N5','L2')` | bagian BOLEH memuat ～なければなりません, ～ことができます, ～たら; bagian JANGAN memuat ～ので, ～つもり, ～んです; memuat "工場" di daftar JANGAN |
| `panduanPolaDokkai('N4','L3')` | tidak memuat ～ようにする di daftar JANGAN; memuat ～させられる di daftar JANGAN; tetap memuat "Modul bunpou" |
| `panduanPolaDokkai('N3','L2')` | tidak memuat ～ようにする maupun "kausatif-pasif" sebagai contoh N3; memuat "（注）" |
| `topikDokkai('N5')` | tidak memuat 'hari pertama kerja di pabrik' |
| `ukuranPermintaan` | N5 L1 → 4; N5 L5 → 2; N3 L3 → 2; N4 L2 → 4 |
| `SISTEM` (diekspor untuk uji, atau diuji lewat string) | memuat "angka Arab" dan "kalimat bingkai" |

`server/domain/bunpou.test.js:134-156` tetap lolos (modul N4 tidak berubah); baris 152–153 (`!includes('Modul bunpou')`)
tetap benar.
