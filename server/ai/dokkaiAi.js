import { generateJson, jsonObjectFrom } from './llm.js';
import { kanjiTingkat } from '../domain/tesOnline.js';
import { MIN_FOKUS_BACAAN, MODUL_BUNPOU, polaBunpouLevel } from '../domain/bunpou.js';

/**
 * Writes new dokkai passages for one Tes Online code. Only the level, sentence-pattern level, allowed kanji, topic
 * hints and (N4) the bunpou module's patterns go to the model, never peserta data. What comes back is raw:
 * domain/tesOnline.js validasiBacaanAi checks every passage, and a sensei reviews the set before the code can be used.
 *
 * The rules come from docs/kb-dokkai/17-aturan-final.md (the class follows Minna no Nihongo: N5 = lessons 1-25,
 * N4 = lessons 26-50 + the N4 bunpou module); docs/kb-dokkai/implementasi/spek-01-prompt-dokkai.md holds the text.
 */

// Everyday topics close to the peserta's life now and later in Japan; each request draws a few at random.
export const TOPIK_UMUM = [
  'keluarga', 'hobi', 'cuaca dan musim', 'belanja di supermarket', 'makan di restoran', 'naik kereta atau bus',
  'kantor pos', 'pergi ke dokter', 'kelas bahasa Jepang', 'libur akhir pekan', 'ulang tahun teman', 'hewan peliharaan',
  'kamar atau apartemen', 'olahraga', 'memasak di rumah', 'perpustakaan', 'pesan telepon', 'email kepada teman',
  'festival musim panas', 'salju di musim dingin', 'perjalanan wisata', 'petunjuk jalan', 'jadwal minggu ini',
  'membeli pakaian', 'flu dan istirahat', 'belajar untuk ujian', 'taman di dekat rumah', 'membeli tiket',
  'barang yang hilang', 'tetangga baru', 'teman sekamar',
];
// Trainee life that can be written with the vocabulary of Minna lessons 1-25.
export const TOPIK_KERJA_N5 = [
  'kerja paruh waktu', 'pengumuman di kantor', 'yang boleh dan tidak boleh di asrama', 'jam kerja dan istirahat siang', 'lembur',
  'mengirim uang ke keluarga', 'rapat di kantor', 'makan siang dengan rekan kerja',
];
// Needs vocabulary of lessons 26-50 (工場, ごみ, 給料, 規則, 安全), so never at N5.
export const TOPIK_KERJA_N4 = [
  'hari pertama kerja di pabrik', 'membuang sampah sesuai aturan', 'gaji bulan ini', 'aturan keselamatan kerja',
  'senior di tempat kerja', 'shift malam', 'mesin baru di tempat kerja',
];
export const TOPIK_DOKKAI = [...TOPIK_UMUM, ...TOPIK_KERJA_N5, ...TOPIK_KERJA_N4];

/** The topics a sentence-pattern level may draw from: factory, garbage and pay topics start at N4. */
export function topikDokkai(jlpt = 'N5') {
  return jlpt === 'N5' ? [...TOPIK_UMUM, ...TOPIK_KERJA_N5] : TOPIK_DOKKAI;
}

// L1-L5 per sentence-pattern level: length (characters without furigana), kind of text and kind of question, the
// same steps as the fixed banks (bankSoal/dokkaiN5.js, dokkaiN4.js, dokkaiN3.js). N3 follows the official JLPT N3
// reading types (短文 150-200, 中文 350, 長文 550).
const PANDUAN_LEVEL = {
  N5: {
    L1: 'Level 1: 30–58 karakter: 3 kalimat pendek (±15 karakter per kalimat), paling banyak 4. Narasi わたし tentang diri, benda, keluarga, atau kegiatan sederhana; satu informasi per kalimat. Kedua soal menanyakan fakta yang tertulis langsung (siapa, apa, di mana, kapan, berapa) atau rencana.',
    L2: 'Level 2: 45–85 karakter, 3–4 kalimat. Rutinitas, letak tempat, belanja, atau orang lain; ada jam, harga, jumlah, atau posisi. Soal tentang angka, waktu, tempat, atau keadaan sekarang vs keinginan; pengecoh dari angka/tempat lain di teks.',
    L3: 'Level 3: 50–95 karakter, 3–5 kalimat pendek termasuk kalimat bingkai. Memo atau pengumuman dengan kalimat bingkai: ajakan, permintaan (～てください), larangan, aturan, alasan (～から). Satu soal fakta; satu soal "mengapa", "apa yang harus / tidak boleh dilakukan", atau "apa yang dilakukan lebih dulu".',
    L4: 'Level 4: 60–115 karakter, 4–6 kalimat. Memo berjadwal, email, atau pengumuman dengan beberapa jam, harga, atau hari. Satu soal detail; satu soal yang menggabungkan dua detail (urutan, jumlah harga, hari yang memenuhi dua syarat, atau apa yang ingin disampaikan penulis kepada penerima).',
    L5: 'Level 5: 150–250 karakter (targetkan ±200), 10–14 kalimat; jangan kurang dari 150 karakter. Karangan berjudul dengan nama penulis, cerita, atau email panjang. Soal 1 detail; soal 2 alasan atau simpulan dari 1–2 kalimat (jawabannya tidak tertulis persis). Boleh merujuk bagian teks: 「…」とありますが、….',
  },
  N4: {
    L1: 'Level 1: 45–90 karakter, 3–5 kalimat. Cerita pendek tentang diri sendiri: niat, pengalaman, yang bisa/belum dilakukan, aturan sederhana, pilihan. Kedua soal fakta yang tertulis langsung.',
    L2: 'Level 2: 65–130 karakter, 4–6 kalimat pendek (jangan lebih dari 130 karakter). Rutinitas kerja atau asrama, persiapan, tenggat, kewajiban, sebab-akibat, saran. Satu soal fakta; satu soal "mengapa", "apa yang harus / tidak perlu dilakukan", atau "kalau …, bagaimana".',
    L3: 'Level 3: 75–145 karakter, 4–7 kalimat. Pengumuman, memo, pesan, atau catatan dengan kalimat bingkai: keputusan, ketetapan, perkiraan, larangan dan perintah. Satu soal fakta; satu soal yang memisahkan yang pasti dari dugaan, keputusan sendiri dari ketetapan, atau syarat dari akibatnya.',
    L4: 'Level 4: 90–175 karakter, 5–8 kalimat. Cerita dengan dua–tiga tokoh atau email/pengumuman sopan: siapa melakukan apa untuk siapa, kejadian yang menimpa seseorang, kabar dari orang lain. Satu soal detail; satu soal "siapa yang melakukan / menerima / disuruh" atau gabungan dua detail.',
    L5: 'Level 5: 250–450 karakter (targetkan ±320), 12–20 kalimat; jangan kurang dari 250 karakter. Email atau surat kepada atasan/guru, pengumuman toko/hotel/perusahaan, percakapan dengan tamu, atau karangan. Soal 1 detail yang menuntut paham kata hormat (siapa yang datang, siapa yang melihat); soal 2 simpulan dari 1–2 kalimat.',
  },
  N3: {
    L1: 'Level 1 (短文): 150–200 karakter (targetkan ±180). Teks penjelasan atau instruksi tentang hidup dan kerja: memo kantor, pengumuman, email kerja (baris kepala あて先・件名 bila perlu). Soal: apa yang harus dilakukan pembaca, atau apa yang ingin disampaikan penulis.',
    L2: 'Level 2 (短文): 150–200 karakter (targetkan ±180). Esai pendek atau cerita pengalaman, boleh gaya biasa (だ・である). Soal: maksud bagian yang dirujuk (「…」とあるが、どのようなことか。) atau pendapat penulis.',
    L3: 'Level 3 (中文): 300–350 karakter (targetkan ±330). Penjelasan atau esai. Soal 1: kata tunjuk (このこと／それ は何を指しているか); soal 2: sebab-akibat atau alasan menurut penulis.',
    L4: 'Level 4 (中文): 330–380 karakter (targetkan ±350). Esai atau artikel tentang kebiasaan, pekerjaan, atau masyarakat. Soal 1: contoh dari pernyataan umum (例えばどんな…か); soal 2: pendapat penulis (この文章を書いた人は…と考えているか).',
    L5: 'Level 5 (長文): 500–550 karakter (targetkan ±520). Esai, artikel, atau surat dengan alur argumen. Soal 1: satu detail atau rujukan; soal 2: gagasan utama atau tema (この文章で一番言いたいことは何か／全体のテーマは何か). Pengecoh soal tema: bagian teks yang benar tetapi terlalu sempit, atau simpulan yang lebih jauh dari teks.',
  },
};

// D7 stage 2: the JLPT 情報検索 item (a notice or list to search) at L5 of N5 and N4. Its form; tulisBacaanDokkai asks for
// one such passage per call (the JLPT reading section has one 情報検索 item among about five).
export const PANDUAN_INFO = 'Bacaan cari-informasi (情報検索): baris 1 kalimat bingkai (「(tempat)に、このお知{し}らせがあります。」), baris 2 judul selebaran, lalu 4–6 butir yang sengaja mirip, satu per baris diawali 「・」 (nama, hari, jam, harga dipisah 「、」 atau 「：」, tanpa spasi), boleh 1–2 baris catatan diawali 「※」. Tiap butir memenuhi sebagian syarat; tepat satu memenuhi semuanya. Soal 1: orang dengan dua–tiga syarat (hari, jam, harga, umur) memilih satu butir — pengecoh = butir yang gagal di satu syarat saja. Soal 2: hitungan atau langkah dari catatan (harga untuk dua orang, apa yang dibawa, sampai kapan mendaftar). Pilihan menyebut butir dengan namanya. Panjang tetap mengikuti panduanLevel.';
const LEVEL_INFO = { N5: 'L5', N4: 'L5' };

/**
 * How one call is split into requests: [{ n, info }] where info = the 1-based position of the passage that is a
 * 情報検索 item in that request (only in the first request, at L5 of N5/N4, when at least two passages are asked).
 */
export function rencanaPermintaan(jlpt, level, jumlah) {
  const per = ukuranPermintaan(jlpt, level);
  const hasil = [];
  for (let sisa = jumlah; sisa > 0; sisa -= per) hasil.push({ n: Math.min(per, sisa), info: null });
  if (LEVEL_INFO[jlpt] === level && jumlah >= 2) hasil[0].info = hasil[0].n;
  return hasil;
}

/** The length/text/question guidance for one level at one sentence-pattern level; null when either is unknown. */
export function panduanLevel(jlpt, level) {
  return PANDUAN_LEVEL[jlpt]?.[level] ?? null;
}

// Sentence-pattern level: grammar, vocabulary and style. Kanji always come from the code's kanji volumes.
const PANDUAN_JLPT = {
  N5: `Pola kalimat N5 (peserta sudah belajar Minna no Nihongo Bab 1–25):
- Gaya です・ます di bacaan, pertanyaan, dan pilihan. Bentuk biasa hanya di dalam kalimat (sebelum ～と思{おも}います,
  ～と言{い}いました, penjelas kata benda) atau di dalam kutipan 「」.
- BOLEH: ～ます／～ました／～ません, kata sifat (sekarang, lampau, negatif), あります／います, ～より／～のほうが／～でいちばん,
  ～ませんか／～ましょう／～ましょうか, ～たいです, Nが欲{ほ}しいです, ～に行{い}きます (tujuan), ～てください, ～ています,
  V-かた (読{よ}み方{かた}), ～てもいいです, ～てはいけません, ～て、～, ～てから, ～ないでください, ～なければなりません,
  ～なくてもいいです, ～ことができます, ～まえに, ～たことがあります, ～たり～たりします, ～くなります／～になります,
  ～と思{おも}います, ～と言{い}いました, ～でしょう？, ～とき, ～と (kondisi: 押{お}すと), ～てもらいます／～てくれます／
  ～てあげます, ～たら, ～ても, ～あとで.
- Penjelas kata benda (きのう見{み}た映画{えいが}) hanya mulai L3.
- JANGAN (diajarkan setelah Bab 25): ～んです, ～ながら, ～し (～ですし, ～ますし), ～てしまいます, ～てあります, ～ておきます, bentuk maksud
  (行{い}こう), ～つもり, ～予定, まだ～ていません, ～ほうがいい, ～かもしれません, ～でしょう (dugaan), bentuk perintah atau
  larangan, ～ば, ～なら, ～ように, ～ようになります, pasif, bentuk potensial (読{よ}める), ～のが好{す}き, ～ので, ～のに,
  ～ために, ～そうです, ～ようです, ～すぎます, Nにします, ～はずです, ～ところ, ～ばかり, ～ないで (tanpa
  melakukan: 消{け}さないで帰{かえ}ります), ～とおりに, kausatif, keigo.
- Kosakata hanya dari Minna no Nihongo Bab 1–25. Kata kerja yang boleh: 事務所{じむしょ}, 昼休{ひるやす}み, 寮{りょう}, アルバイト,
  残業{ざんぎょう}, 捨{す}てます, 部長{ぶちょう}, 社長{しゃちょう}, 会議{かいぎ}, お弁当{べんとう}.
- JANGAN kata ini, baik ditulis dengan kanji maupun kana (belum diajarkan): 工場 (pakai 会社{かいしゃ}), 先輩 (pakai 会社{かいしゃ}の人{ひと}), ごみ, 給料, 規則, 安全,
  機械, 計画, 動物園, 台所, 授業, 映画館, 言葉, 大人, 運動会, 花火, 入口, 結婚式, 夕方 (pakai 午後{ごご}／夜{よる}), 予定 (pakai
  ～ます), 場所 (pakai ところ), 返事. Aturan ditulis dengan ～てはいけません／～なければなりません, bukan kata 規則.`,
  // Which N4 patterns a passage practises is not listed here: panduanModul adds them per dokkai level from the module.
  N4: `Pola kalimat N4 (peserta sudah belajar Minna no Nihongo Bab 1–50 dan modul bunpou N4):
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
  boleh seperlunya dengan konteks yang jelas.`,
  N3: `Pola kalimat N3:
- Tata bahasa sampai N3. Pakai pola N3 dengan wajar, tidak dipamerkan, misalnya ～わけではない, ～によって, ～として,
  ～にとって, ～に対{たい}して, ～うちに, ～たびに, ～おかげで, ～ばかりでなく, ～さえ, ～に比{くら}べて, ～ば～ほど,
  bercampur dengan pola N4.
- Esai, artikel, dan cerita boleh bergaya biasa (だ・である); memo dan email bergaya です・ます.
- Pertanyaan dan pilihan memakai bentuk biasa seperti JLPT N3: 「…何か。」「…どうしなければならないか。」
  「この文章を書いた人は…と考えているか。」
- Kata di atas N3 boleh dipakai bila diberi catatan di baris terakhir teks: 「（注）ほっとする：安心{あんしん}する」
  (maksimal 2 catatan per bacaan). Baris catatan juga ber-furigana penuh: 「（注）高価{こうか}：値段{ねだん}が高{たか}いこと」.`,
};

// A pattern level with a bunpou module (N4) spreads its patterns over the dokkai levels (domain/bunpou.js), the
// same spread the fixed bank follows: a code for "L3 · N4" practises the L3 patterns whether its passages come
// from the bank or from here. AI passages are not tagged with pattern numbers; the sensei reviews them instead.
function panduanModul(jlpt, level) {
  const kelompok = polaBunpouLevel(jlpt, level);
  if (!kelompok) return '';
  const nama = (pola) => pola.map((p) => p.pola).join(' · ');
  return [
    '',
    `Modul bunpou ${jlpt} JOYdata ("${MODUL_BUNPOU[jlpt].judul}"), level ${level}:`,
    '- Pola fokus level ini (nomor modul. pola = arti; contoh):',
    ...kelompok.fokus.map((p) => `  ${p.nomor}. ${p.pola} = ${p.arti}; ${p.contoh[0].jp}`),
    `- Setiap bacaan memakai minimal ${MIN_FOKUS_BACAAN} pola fokus, dengan bentuk dan arti seperti di daftar, muncul dengan wajar di`,
    '  teks. Tiap bacaan memakai pasangan pola fokus yang berbeda. Contoh modul banyak yang berbentuk biasa; bacaan tetap です・ます.',
    '- Minimal satu dari dua soal hanya terjawab benar oleh peserta yang paham pola fokus itu. Yang ditanyakan tetap isi',
    '  bacaan, bukan istilah tata bahasa.',
    '- Jenis teks di panduan level boleh disesuaikan supaya pola fokus muncul dengan wajar.',
    kelompok.boleh.length ? `- Pola level sebelumnya, boleh dipakai: ${nama(kelompok.boleh)}.` : null,
    kelompok.nanti.length ? `- Pola level berikutnya, JANGAN dipakai di bacaan, pertanyaan, maupun pilihan: ${nama(kelompok.nanti)}.` : null,
  ].filter((baris) => baris !== null).join('\n');
}

/** The grammar guidance sent to the model for one pattern level and dokkai level; null when either is unknown. */
export function panduanPolaDokkai(jlpt, level) {
  return PANDUAN_JLPT[jlpt] && panduanLevel(jlpt, level) ? PANDUAN_JLPT[jlpt] + panduanModul(jlpt, level) : null;
}

export const SISTEM = `Anda guru bahasa Jepang di sebuah LPK di Indonesia. Peserta adalah orang dewasa Indonesia yang belajar dengan buku
Minna no Nihongo untuk bekerja di Jepang. Tulis bacaan dokkai (membaca) BARU beserta soal pilihan ganda seperti soal
読解 JLPT, sesuai "panduanLevel" (panjang, jenis teks, jenis pertanyaan) dan "panduanPola" (tata bahasa, kosakata, gaya).

Aturan bahasa Jepang:
- Kalimat alami seperti di buku latihan JLPT.
- Kanji hanya dari daftar "kanjiBoleh" (kanji yang sudah dipelajari peserta). Kata dengan kanji lain ditulis dengan
  hiragana atau katakana; bila kata itu sulit, pilih kata lain yang lebih mudah.
- SETIAP kanji wajib diberi furigana tepat setelah rangkaian kanjinya dengan format 漢字{かんじ}, di semua medan Jepang:
  judul, teks (termasuk baris （注）), pertanyaan, dan pilihan — juga kata yang sangat umum (食{た}べます, 何{なに}).
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
  memo → 「(nama)さんの机{つくえ}の上{うえ}に、このメモがあります。」 lalu nama penerima, isi, nama pengirim
  pengumuman → 「(tempat)に、このお知{し}らせがあります。」
  email → 「これは、(A)から(B)にきたメールです。」 lalu sapaan, isi, nama pengirim
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
  (a) kebiasaan vs kejadian kali ini (毎朝{まいあさ}… でも、けさは…);
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
(4) tepat satu pilihan benar dan kedua pengecoh berasal dari teks; (5) setiap kanji di judul, teks (juga baris （注）),
pertanyaan, dan pilihan diikuti furigana {かな}. Perbaiki yang belum sesuai.

Setiap bacaan memakai topik yang berbeda, dipilih dari "topik". Jangan memakai judul atau cerita yang mirip dengan
"hindariJudul". Jawab hanya dengan objek JSON {"bacaan": [...]}.`;

const SCHEMA = {
  type: 'object',
  properties: {
    bacaan: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          judul: { type: 'string' },
          teks: { type: 'string' },
          terjemahan: { type: 'string' },
          soal: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tanya: { type: 'string' },
                tanyaId: { type: 'string' },
                opsi: { type: 'array', items: { type: 'string' } },
                benar: { type: 'integer' },
                pembahasan: { type: 'string' },
              },
              required: ['tanya', 'tanyaId', 'opsi', 'benar', 'pembahasan'],
            },
          },
        },
        required: ['judul', 'teks', 'terjemahan', 'soal'],
      },
    },
  },
  required: ['bacaan'],
};

/**
 * Passages per request. Smaller requests answer faster, so a set of 8 is written as parallel requests of 4; long
 * passages (L5, and N3 from L3) go 2 per request to stay inside the 50 s budget of llm.js.
 */
export function ukuranPermintaan(jlpt, level) {
  if (level === 'L5') return 2;
  if (jlpt === 'N3' && ['L3', 'L4'].includes(level)) return 2;
  return 4;
}

function parseBacaan(text) {
  const parsed = jsonObjectFrom(text);
  return Array.isArray(parsed?.bacaan) && parsed.bacaan.length ? parsed.bacaan : null;
}

function acak(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Raw passages for `level` (L1-L5) at sentence-pattern level `jlpt` (N5, N4, N3), with kanji from kanjiBoleh only,
 * about `jumlah` of them (fewer when a request fails). Throws the AI_* error of the first failed request when none
 * succeeds.
 */
export async function tulisBacaanDokkai(
  { level, jlpt = 'N5', jumlah, hindariJudul = [], kanjiBoleh = kanjiTingkat(jlpt) },
  rng = Math.random
) {
  const panduanPola = panduanPolaDokkai(jlpt, level);
  if (!panduanPola) throw new Error('INVALID_TES_ONLINE');
  const topik = acak(topikDokkai(jlpt), rng);
  let ambil = 0;
  const permintaan = rencanaPermintaan(jlpt, level, jumlah).map(({ n, info }) => {
    // Each request gets its own topics (a few spare ones to choose from), so the requests do not overlap.
    const topikIni = topik.slice(ambil, ambil + n + 2);
    ambil += n + 2;
    return generateJson({
      system: SISTEM,
      user: JSON.stringify({
        level,
        panduanLevel: panduanLevel(jlpt, level),
        pola: jlpt,
        panduanPola,
        jumlahBacaan: n,
        ...(info ? { bacaanInfo: `Bacaan ke-${info} berupa 情報検索 (lihat panduanInfo); bacaan lain seperti biasa.`, panduanInfo: PANDUAN_INFO } : {}),
        topik: topikIni,
        hindariJudul,
        kanjiBoleh: [...kanjiBoleh].join(''),
      }),
      schema: SCHEMA,
      schemaName: 'bacaan_dokkai',
      parse: parseBacaan,
      temperature: 0.9,
      title: 'JOYdata Tes Online',
    });
  });

  const hasil = await Promise.allSettled(permintaan);
  const berhasil = hasil.filter((h) => h.status === 'fulfilled');
  if (!berhasil.length) throw hasil[0].reason;
  return {
    bacaan: berhasil.flatMap((h) => h.value.value),
    model: berhasil[0].value.model,
  };
}
