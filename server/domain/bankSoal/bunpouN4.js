// Bunpou (sentence pattern) module for JLPT N4: JOYdata's official list of N4 patterns.
// Source: "Modul Pembelajaran Lengkap 111 Bunpo N4", Kelas RAKU Class (LPK Mizuno Semangat Bangsa).
//
// The module numbers 111 patterns; 105–111 repeat keigo patterns of category 10 ("Digabungkan ke Keigo
// Kategori 10"), so they are folded into those patterns as a second example: 104 patterns in 12 categories.
// Pattern numbers are the module's own, so a sensei can find a pattern in the printed module.
//
// level = the dokkai level (L1–L5) where the pattern is a focus pattern: the fixed N4 bank and the AI use a
// pattern from its level upward (L1 = patterns closest to N5 … L5 = keigo). The module itself has no levels;
// this spread is JOYdata's.
// contoh.jp is written like the dokkai bank: no spaces between words, furigana on every kanji as 漢字{かな},
// numbers in kanji. `koreksi` lists where the text here differs from the printed module.

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
          nomor: 1, pola: '～たい / V(よ)うと思う', arti: 'Bermaksud/Berencana', level: 'L1',
          penjelasan: '～たい digunakan untuk menyatakan keinginan pribadi. V(よ)うと思う digunakan untuk menyatakan niat atau maksud pribadi yang baru dipikirkan/berencana melakukan sesuatu.',
          rumus: ['V-Masu (buang ます) + たい', 'V-Maksud (意向形) + と思う'],
          contoh: [{ jp: '夏休{なつやす}みに旅行{りょこう}しようと思{おも}う。', id: 'Saya bermaksud untuk berwisata pada liburan musim panas.' }],
        },
        {
          nomor: 2, pola: 'V(よ)うとする', arti: 'Baru mau/Mencoba melakukan saat...', level: 'L4',
          penjelasan: 'Menyatakan tindakan yang baru saja akan/hendak dilakukan saat kejadian lain mendadak terjadi.',
          rumus: ['V-Maksud (意向形) + とする'],
          contoh: [{ jp: 'うちを出{で}ようとしたとき、雨{あめ}が降{ふ}ってきた。', id: 'Ketika saya baru mau keluar rumah, hujan turun.' }],
        },
        {
          nomor: 3, pola: 'V つもりだ', arti: 'Berniat/Berencana', level: 'L1',
          penjelasan: 'Menyatakan rencana atau niat matang yang sudah dipikirkan sebelumnya.',
          rumus: ['V-Kamus / V-Nai + つもりだ'],
          contoh: [{ jp: '授業{じゅぎょう}のあとに図書館{としょかん}に行{い}くつもりだ。', id: 'Saya berencana pergi ke perpustakaan setelah kelas.' }],
        },
        {
          nomor: 4, pola: 'V ため(に)', arti: 'Demi/Untuk tujuan', level: 'L3',
          penjelasan: 'Menyatakan tujuan atau alasan demi mencapai suatu tindakan.',
          rumus: ['V-Kamus / N-の + ため(に)'],
          contoh: [{ jp: '歌手{かしゅ}になるために、歌{うた}とダンスを習{なら}っています。', id: 'Demi menjadi penyanyi, saya belajar menyanyi dan menari.' }],
        },
        {
          nomor: 5, pola: 'V ことにする', arti: 'Memutuskan untuk...', level: 'L3',
          penjelasan: 'Menyatakan keputusan pribadi untuk melakukan atau tidak melakukan sesuatu.',
          rumus: ['V-Kamus / V-Nai + ことにする'],
          contoh: [{ jp: '太{ふと}ったので、ダイエットをすることにしました。', id: 'Karena gemuk, saya memutuskan untuk berdiet.' }],
        },
        {
          nomor: 6, pola: 'V ことになる', arti: 'Telah diputuskan/Ditetapkan bahwa...', level: 'L3',
          penjelasan: 'Menyatakan bahwa suatu keputusan telah ditetapkan oleh pihak luar/kelompok atau aturan yang harus diikuti.',
          rumus: ['V-Kamus / V-Nai + ことになる'],
          contoh: [{ jp: '来月{らいげつ}新{あたら}しい家{いえ}にひっこすことになりました。', id: 'Telah diputuskan bahwa bulan depan saya akan pindah ke rumah baru.' }],
        },
        {
          nomor: 7, pola: 'V ておく', arti: 'Melakukan persiapan terlebih dahulu', level: 'L2',
          penjelasan: 'Menyatakan tindakan persiapan yang dilakukan terlebih dahulu untuk keperluan di masa depan.',
          rumus: ['V-て + おく'],
          contoh: [{ jp: '留学{りゅうがく}する前{まえ}に、英語{えいご}を勉強{べんきょう}しておくつもりです。', id: 'Sebelum belajar di luar negeri, saya berencana belajar bahasa Inggris terlebih dahulu.' }],
        },
        {
          nomor: 8, pola: 'V てみる', arti: 'Mencoba melakukan', level: 'L2',
          penjelasan: 'Menyatakan tindakan mencoba melakukan sesuatu untuk mengetahui hasilnya.',
          rumus: ['V-て + みる'],
          contoh: [{ jp: 'このお菓子{かし}、おいしいので食{た}べてみてください。', id: 'Kue ini lezat, jadi silakan coba dimakan.' }],
        },
        {
          nomor: 9, pola: 'V てほしい', arti: 'Ingin orang lain melakukan sesuatu', level: 'L3',
          penjelasan: 'Menyatakan keinginan agar orang lain melakukan sesuatu untuk pembicara.',
          rumus: ['V-て + ほしい'],
          contoh: [{ jp: '図書館{としょかん}では静{しず}かにしてほしい。', id: 'Saya ingin (orang-orang) tenang di perpustakaan.' }],
        },
        {
          nomor: 10, pola: 'V 方', arti: 'Cara melakukan', level: 'L1',
          penjelasan: 'Menyatakan tata cara atau metode untuk melakukan suatu pekerjaan/tindakan.',
          rumus: ['V-Masu (buang ます) + 方 (かた)'],
          contoh: [{ jp: 'このカメラの使{つか}い方{かた}を教{おし}えてください。', id: 'Tolong ajarkan cara penggunaan kamera ini.' }],
        },
      ],
    },
    {
      nomor: 2,
      judul: 'Pengandaian & Syarat (Kondisional)',
      pola: [
        {
          nomor: 11, pola: '～たら', arti: 'Jika/Kalau/Setelah', level: 'L2',
          penjelasan: 'Menyatakan pengandaian secara umum (jika/kalau) atau kejadian berurutan (setelah A, baru B).',
          rumus: ['Bentuk-Ta (V-た / A-かった / AN-だった / N-だった) + ら'],
          contoh: [{ jp: '明日{あした}天気{てんき}がよかったら、花見{はなみ}に行{い}きませんか。', id: 'Jika esok cuacanya bagus, maukah pergi melihat bunga sakura?' }],
        },
        {
          nomor: 12, pola: '～ば', arti: 'Jika/Kalau - Syarat mutlak', level: 'L3',
          penjelasan: 'Syarat kondisi yang diperlukan agar suatu hal/hasil dapat terwujud.',
          rumus: ['V-e + ば / i-Adj (buang い) + ければ / na-Adj & N + ならば'],
          contoh: [{ jp: '一生懸命{いっしょうけんめい}勉強{べんきょう}すれば、きっと合格{ごうかく}できますよ。', id: 'Jika belajar dengan sungguh-sungguh, kamu pasti bisa lulus.' }],
        },
        {
          nomor: 13, pola: '～と', arti: 'Jika/Begitu... maka... - Hukum alam/Pasti', level: 'L2',
          penjelasan: 'Pengandaian untuk hukum alam, petunjuk arah, atau kondisi yang otomatis menghasilkan sesuatu.',
          rumus: ['V-Kamus + と'],
          contoh: [{ jp: '冬{ふゆ}になると、雪{ゆき}が降{ふ}ります。', id: 'Begitu masuk musim dingin, salju akan turun.' }],
        },
        {
          nomor: 14, pola: '～なら [仮定]', arti: 'Kalau/Jika pengandaian', level: 'L3',
          penjelasan: 'Menyatakan pengandaian jika suatu syarat/kondisi terpenuhi (仮定 = asumsi, pengandaian, atau hipotesis).',
          rumus: ['N / na-Adj / V-Kamus + なら'],
          contoh: [{ jp: '大事{だいじ}なものなら、かたづけておきなさい。', id: 'Kalau barang itu penting, rapikanlah terlebih dahulu.' }],
        },
        {
          nomor: 15, pola: '～なら [話題]', arti: 'Kalau/Jika mengenai topik...', level: 'L3',
          penjelasan: 'Memberikan tanggapan, saran, atau pendapat berdasarkan topik yang diangkat lawan bicara (話題 = topik, bahan pembicaraan).',
          rumus: ['N + なら'],
          contoh: [{ jp: 'ビールなら、やっぱりドイツのものがおいしいです。', id: 'Kalau soal bir, memang bir buatan Jerman yang lezat.' }],
        },
        {
          nomor: 16, pola: '～ても / ～でも', arti: 'Meskipun/Walaupun', level: 'L2',
          penjelasan: 'Menyatakan pertentangan pengandaian (meskipun/walaupun melakukan A, hasil B tidak berubah).',
          rumus: ['V-て / i-Adj (くて) / na-Adj (で) / N (で) + も'],
          contoh: [{ jp: '薬{くすり}を飲{の}んでも熱{ねつ}が下{さ}がりません。', id: 'Meskipun minum obat, demamnya tidak turun.' }],
        },
        {
          nomor: 17, pola: '疑問詞 + でも', arti: 'Siapa pun / Mana pun / Kapan pun', level: 'L3',
          penjelasan: 'Menyatakan keseluruhan/cakupan tanpa terkecuali (siapa pun, di mana pun, kapan pun). 疑問詞 = kata tanya.',
          rumus: ['Kata Tanya (どこ / だれ / いつ / なに) + でも'],
          contoh: [{ jp: '私{わたし}はどこでも寝{ね}ることができます。', id: 'Saya bisa tidur di mana saja.' }],
        },
      ],
    },
    {
      nomor: 3,
      judul: 'Izin, Larangan, Keharusan, & Ketidakharusan',
      pola: [
        {
          nomor: 18, pola: '～てもいい', arti: 'Boleh/Diizinkan', level: 'L1',
          penjelasan: 'Menyatakan pemberian izin atau meminta izin untuk melakukan sesuatu.',
          rumus: ['V-て + もいい'],
          contoh: [{ jp: 'ちょっとペンを借{か}りてもいいですか。', id: 'Bolehkah saya meminjam pulpennya sebentar?' }],
        },
        {
          nomor: 19, pola: '～てはいけない', arti: 'Tidak boleh/Dilarang', level: 'L1',
          penjelasan: 'Menyatakan larangan keras atas suatu tindakan.',
          rumus: ['V-て + はいけない'],
          contoh: [{ jp: 'ここに車{くるま}を止{と}めてはいけない。', id: 'Dilarang memarkir mobil di sini.' }],
        },
        {
          nomor: 20, pola: '～なければならない', arti: 'Harus', level: 'L2',
          penjelasan: 'Menyatakan keharusan atau kewajiban formal.',
          rumus: ['V-ない (buang ない) + なければならない'],
          contoh: [{ jp: '朝{あさ}九時{くじ}までに会社{かいしゃ}に行{い}かなければならない。', id: 'Harus pergi ke kantor sebelum jam 9 pagi.' }],
        },
        {
          nomor: 21, pola: '～なくてはいけない', arti: 'Harus', level: 'L2',
          penjelasan: 'Menyatakan keharusan atau kewajiban (sepadan dengan ～なければならない).',
          rumus: ['V-ない (buang ない) + なくてはいけない'],
          contoh: [{ jp: 'もう寝{ね}なくてはいけない時間{じかん}ですよ。', id: 'Sudah waktunya harus tidur, lho.' }],
        },
        {
          nomor: 22, pola: '～なくてもいい', arti: 'Tidak harus/Tidak perlu', level: 'L2',
          penjelasan: 'Menyatakan bahwa suatu tindakan tidak wajib/tidak perlu dilakukan.',
          rumus: ['V-ない (buang ない) + なくてもいい'],
          contoh: [{ jp: '明日{あした}は祝日{しゅくじつ}だから、学校{がっこう}に行{い}かなくてもいい。', id: 'Karena besok hari libur nasional, tidak perlu pergi ke sekolah.' }],
        },
        {
          nomor: 23, pola: 'V な', arti: 'Jangan! - Larangan keras', level: 'L3',
          penjelasan: 'Menyatakan perintah larangan yang sangat keras (biasanya digunakan pria/situasi darurat).',
          rumus: ['V-Kamus + な'],
          contoh: [{ jp: 'ここでたばこをすうな。', id: 'Jangan merokok di sini!' }],
        },
      ],
    },
    {
      nomor: 4,
      judul: 'Dugaan, Perkiraan, Kesimpulan, & Kabar Burung',
      pola: [
        {
          nomor: 24, pola: '～かもしれない', arti: 'Mungkin/Bisa jadi', level: 'L3',
          penjelasan: 'Menyatakan perkiraan atau kemungkinan yang tidak pasti (sekitar 50%).',
          rumus: ['Bentuk Biasa + かもしれない (N & na-Adj tanpa だ)'],
          contoh: [{ jp: '今日{きょう}は忙{いそが}しいから、帰{かえ}るのが遅{おそ}くなるかもしれない。', id: 'Karena hari ini sibuk, mungkin pulangnya akan terlambat.' }],
        },
        {
          nomor: 25, pola: '～そうだ', arti: 'Kelihatannya/Tampaknya', level: 'L3',
          penjelasan: 'Menyatakan perkiraan berdasarkan pengamatan visual langsung (kelihatannya/tampaknya).',
          rumus: ['V-Masu (buang ます) / i-Adj (buang い) / na-Adj + そうだ'],
          contoh: [{ jp: 'おいしそうなドーナツですね。', id: 'Kelihatannya donat yang lezat ya.' }],
        },
        {
          nomor: 26, pola: '～(だろう)と思う', arti: 'Saya pikir/kira...', level: 'L2',
          penjelasan: 'Menyatakan dugaan atau pendapat pribadi mengenai suatu hal di masa depan/kondisi yang belum pasti.',
          rumus: ['Bentuk Biasa + (だろう)と思う'],
          contoh: [{ jp: '空{そら}が明{あか}るくなってきたから、雨{あめ}はもうすぐやむと思{おも}う。', id: 'Karena langit mulai terang, saya pikir hujan akan segera reda.' }],
        },
        {
          nomor: 27, pola: '～だろう', arti: 'Mungkin/Sepertinya', level: 'L3',
          penjelasan: 'Menyatakan dugaan halus atau mengonfirmasi perkiraan pada pendengar.',
          rumus: ['Bentuk Biasa + だろう (N & na-Adj tanpa だ)'],
          contoh: [{ jp: 'これは多分{たぶん}田山{たやま}さんのものだろう。', id: 'Ini mungkin milik Tayama.' }],
        },
        {
          nomor: 28, pola: '～はずだ', arti: 'Seharusnya/Pasti', level: 'L3',
          penjelasan: 'Menyatakan keyakinan kuat bahwa sesuatu seharusnya terjadi berdasarkan alasan logis.',
          rumus: ['Bentuk Biasa + はずだ (N + の / na-Adj + な)'],
          contoh: [{ jp: '荷物{にもつ}は今日{きょう}着{つ}くはずだ。', id: 'Barang itu seharusnya tiba hari ini.' }],
        },
        {
          nomor: 29, pola: '～みたい', arti: 'Sepertinya/Mirip', level: 'L4',
          penjelasan: 'Menyatakan perkiraan berdasarkan situasi/bukti yang terlihat atau kesamaan fisik (sepertinya/mirip).',
          rumus: ['Bentuk Biasa + みたいだ (N & na-Adj tanpa だ)'],
          contoh: [{ jp: '天気{てんき}が悪{わる}いみたいだよ。', id: 'Sepertinya cuacanya buruk, lho.' }],
        },
        {
          nomor: 30, pola: '～らしい', arti: 'Sepertinya/Katanya', level: 'L4',
          penjelasan: 'Menyatakan perkiraan berdasarkan kabar burung atau informasi yang didengar dari sumber lain.',
          rumus: ['Bentuk Biasa + らしい'],
          contoh: [{ jp: '明日{あした}は雨{あめ}が降{ふ}るらしい。', id: 'Katanya esok akan turun hujan.' }],
        },
        {
          nomor: 31, pola: '～かどうか', arti: 'Apakah... atau tidak', level: 'L3',
          penjelasan: 'Menyatakan ketidakpastian antara dua pilihan (apakah... atau tidak).',
          rumus: ['Bentuk Biasa + かどうか (N & na-Adj tanpa だ)'],
          contoh: [{ jp: '銀行{ぎんこう}がまだ開{ひら}いているかどうか知{し}っていますか。', id: 'Apakah kamu tahu banknya masih buka atau tidak?' }],
        },
        {
          nomor: 32, pola: '疑問詞 + ～か', arti: 'Pertanyaan tersirat: Apakah/Siapa/Kapan...', level: 'L3',
          penjelasan: 'Menyatakan pertanyaan tersirat di dalam suatu kalimat. 疑問詞 = kata tanya (何, 誰, いつ, どこ, なぜ, どうして, どう, どれ, どの, いくら, いくつ, 何歳).',
          rumus: ['Kata Tanya (なに / だれ / いつ) + Bentuk Biasa + か'],
          contoh: [{ jp: '田中{たなか}さんが何時{なんじ}に来{く}るか分{わ}かりますか。', id: 'Apakah kamu tahu jam berapa Tanaka akan datang?' }],
        },
      ],
    },
    {
      nomor: 5,
      judul: 'Kemampuan, Perubahan State, & Kebiasaan',
      pola: [
        {
          nomor: 33, pola: 'V ことができる', arti: 'Bisa/Mampu melakukan', level: 'L1',
          penjelasan: 'Menyatakan kemampuan atau kemungkinan untuk melakukan suatu aktivitas.',
          rumus: ['V-Kamus + ことができる'],
          contoh: [{ jp: '私{わたし}は日本料理{にほんりょうり}を作{つく}ることができる。', id: 'Saya bisa memasak masakan Jepang.' }],
        },
        {
          nomor: 34, pola: 'V(ら)れる [可能]', arti: 'Bentuk Potensial/Bisa', level: 'L1',
          penjelasan: 'Bentuk potensial (kanoukei) yang menyatakan kemampuan atau kebiasaan melakukan sesuatu (可能 = mungkin, kemampuan untuk melakukan sesuatu).',
          rumus: ['Grup 1: v-i/u → v-e + る', 'Grup 2: Buang ます → られる', 'Grup 3: くる → こられる / する → できる'],
          contoh: [{ jp: '私{わたし}はベトナム語{ご}が少{すこ}し話{はな}せる。', id: 'Saya bisa berbicara bahasa Vietnam sedikit.' }],
        },
        {
          nomor: 35, pola: 'V ようになる', arti: 'Menjadi bisa/Terbiasa', level: 'L2',
          penjelasan: 'Menyatakan perubahan dari kondisi tidak mampu/tidak biasa menjadi mampu/biasa dilakukan.',
          rumus: ['V-Kamus / V-Kanoukei + ようになる'],
          contoh: [{ jp: '漢字{かんじ}が少{すこ}し書{か}けるようになりました。', id: 'Sekarang saya sudah menjadi bisa menulis sedikit kanji.' }],
        },
        {
          nomor: 36, pola: 'V ていく', arti: 'Akan terus berlangsung ke depan', level: 'L4',
          penjelasan: 'Menyatakan proses tindakan/perubahan yang terus berlanjut dari sekarang ke masa depan.',
          rumus: ['V-て + いく'],
          contoh: [{ jp: 'これからも日本語{にほんご}を勉強{べんきょう}していく。', id: 'Ke depannya pun saya akan terus belajar bahasa Jepang.' }],
        },
        {
          nomor: 37, pola: 'V てくる', arti: 'Mulai/Sedang berkembang hingga kini', level: 'L4',
          penjelasan: 'Menyatakan perubahan yang terjadi secara bertahap dari masa lalu hingga saat ini.',
          rumus: ['V-て + くる'],
          contoh: [{ jp: '四月{しがつ}になって、だんだんあたたかくなってきました。', id: 'Memasuki bulan April, cuaca bertahap mulai terasa hangat.' }],
        },
        {
          nomor: 38, pola: 'V てばかりいる', arti: 'Kerjaannya melulu/Hanya... saja', level: 'L4',
          penjelasan: 'Menyatakan kebiasaan berulang-ulang melulu/hanya melakukan hal itu saja secara terus-menerus.',
          rumus: ['V-て + ばかりいる'],
          contoh: [{ jp: '休{やす}みの日{ひ}は、ねてばかりいる。', id: 'Pada hari libur, kerjaannya hanya tidur saja.' }],
        },
        {
          nomor: 39, pola: 'まだ V ていない', arti: 'Masih belum melakukan', level: 'L1',
          penjelasan: 'Menyatakan bahwa suatu kegiatan masih belum dilakukan hingga saat ini.',
          rumus: ['まだ + V-て + いない'],
          contoh: [{ jp: '先生{せんせい}はまだ来{き}ていない。', id: 'Guru masih belum datang.' }],
        },
      ],
    },
    {
      nomor: 6,
      judul: 'Keterangan Waktu, Alur Aksi, & Pengalaman',
      pola: [
        {
          nomor: 40, pola: 'V たことがある', arti: 'Pernah melakukan', level: 'L1',
          penjelasan: 'Menyatakan pengalaman yang pernah dilakukan di masa lalu.',
          rumus: ['V-た + ことがある'],
          contoh: [{ jp: '私{わたし}は富士山{ふじさん}にのぼったことがある。', id: 'Saya pernah mendaki Gunung Fuji.' }],
        },
        {
          nomor: 41, pola: 'V たことがない', arti: 'Tidak pernah melakukan', level: 'L1',
          penjelasan: 'Menyatakan bahwa belum pernah memiliki pengalaman melakukan sesuatu.',
          rumus: ['V-た + ことがない'],
          contoh: [{ jp: '私{わたし}は一度{いちど}もひこうきに乗{の}ったことがない。', id: 'Saya sama sekali belum pernah naik pesawat.' }],
        },
        {
          nomor: 42, pola: 'V ところだ', arti: 'Baru akan melakukan', level: 'L4',
          penjelasan: 'Menyatakan momen atau urutan waktu di mana suatu pekerjaan baru akan mulai dilakukan.',
          rumus: ['V-Kamus + ところだ'],
          contoh: [{ jp: 'これからでかけるところだ。', id: 'Saya baru mau pergi sekarang.' }],
        },
        {
          nomor: 43, pola: 'V ているところだ', arti: 'Sedang melakukan', level: 'L2',
          penjelasan: 'Menyatakan momen di mana tindakan tepat sedang berlangsung dilakukan.',
          rumus: ['V-て + いるところだ'],
          contoh: [{ jp: '私{わたし}は今{いま}ケーキをやいているところだ。', id: 'Saya sekarang sedang memanggang kue.' }],
        },
        {
          nomor: 44, pola: 'V たところだ', arti: 'Baru saja selesai melakukan', level: 'L4',
          penjelasan: 'Menyatakan momen di mana tindakan baru saja selesai dilakukan beberapa saat yang lalu.',
          rumus: ['V-た + ところだ'],
          contoh: [{ jp: '今{いま}うちに着{つ}いたところだ。', id: 'Saya baru saja tiba di rumah.' }],
        },
        {
          nomor: 45, pola: '～までに', arti: 'Paling lambat/Sebelum', level: 'L2',
          penjelasan: 'Menyatakan batas waktu paling lambat di mana suatu hal harus diselesaikan.',
          rumus: ['N / V-Kamus + までに'],
          contoh: [{ jp: '明日{あした}までに作文{さくぶん}を出{だ}してください。', id: 'Tolong kumpulkan karangannya paling lambat besok.' }],
        },
        {
          nomor: 46, pola: '～まま', arti: 'Dalam keadaan tetap/Dibiarkan', level: 'L3',
          penjelasan: 'Menyatakan keadaan yang dibiarkan tetap berlangsung tanpa diubah saat melakukan hal lain.',
          rumus: ['V-た / V-ない / N-の + まま'],
          contoh: [{ jp: '昨日{きのう}暑{あつ}かったので、まどを開{あ}けたまま寝{ね}た。', id: 'Karena kemarin panas, saya tidur dalam keadaan jendela tetap terbuka.' }],
        },
        {
          nomor: 47, pola: 'N がある', arti: 'Ada - Benda mati/Keberadaan', level: 'L1',
          penjelasan: 'Menyatakan keberadaan benda mati atau memiliki sesuatu.',
          rumus: ['N + がある'],
          contoh: [{ jp: 'つくえの上{うえ}にペンがあります。', id: 'Ada pulpen di atas meja.' }],
        },
        {
          nomor: 48, pola: 'N がする', arti: 'Berasal/Terasa - Suara, bau, rasa', level: 'L3',
          penjelasan: 'Menyatakan fenomena yang ditangkap oleh pancaindra (suara, bau, rasa, atau firasat).',
          rumus: ['N (音 / におい / 味) + がする'],
          contoh: [{ jp: '外{そと}でへんな音{おと}がする。', id: 'Terdengar suara aneh di luar.' }],
        },
        {
          nomor: 49, pola: 'N にする', arti: 'Memilih/Menentukan pilihan', level: 'L1',
          penjelasan: 'Menyatakan keputusan dalam memilih menu, barang, atau opsi.',
          rumus: ['N + にする'],
          contoh: [{ jp: '私{わたし}はうどんにする。', id: 'Saya memilih/memesan udon.' }],
        },
        {
          nomor: 50, pola: 'V 命令形', arti: 'Bentuk Perintah', level: 'L3',
          penjelasan: 'Bentuk perintah langsung yang tegas/kasar.',
          rumus: ['Grup 1: v-i/u → v-e', 'Grup 2: Buang ます → ろ', 'Grup 3: くる → こい / する → しろ'],
          contoh: [{ jp: '静{しず}かにしろ！', id: 'Diamlah!' }],
        },
      ],
    },
    {
      nomor: 7,
      judul: 'Hubungan Akibat, Alasan, & Pertentangan',
      pola: [
        {
          nomor: 51, pola: '～ので', arti: 'Karena/Sebab - Halus & Obyektif', level: 'L2',
          penjelasan: 'Menyatakan alasan atau sebab yang bersifat halus dan obyektif.',
          rumus: ['Bentuk Biasa + ので (N & na-Adj + な)'],
          contoh: [{ jp: '今日{きょう}はつかれたので、早{はや}く寝{ね}ます。', id: 'Karena hari ini lelah, saya akan tidur lebih awal.' }],
        },
        {
          nomor: 52, pola: '～のに', arti: 'Padahal/Meskipun', level: 'L3',
          penjelasan: 'Menyatakan pertentangan (padahal/meskipun) yang mengandung kesan kecewa atau heran.',
          rumus: ['Bentuk Biasa + のに (N & na-Adj + な)'],
          contoh: [{ jp: 'がんばったのに、だめだった。', id: 'Padahal sudah berjuang keras, tetapi hasilnya gagal.' }],
        },
        {
          nomor: 53, pola: '～し', arti: 'Sudah... tambah lagi...', level: 'L2',
          penjelasan: 'Menyatakan beberapa alasan yang sejajar atau menambahkan poin plus/minus.',
          rumus: ['Bentuk Biasa + し (untuk N & KS な jadi だし)'],
          contoh: [{ jp: '彼女{かのじょ}はきれいだし、頭{あたま}もいい。', id: 'Dia cantik, dan lagi pula pintar.' }],
        },
        {
          nomor: 54, pola: '～とか', arti: 'Seperti... atau...', level: 'L2',
          penjelasan: 'Menyebutkan beberapa contoh dalam kelompok yang setara secara tidak terbatas.',
          rumus: ['N / V-Kamus + とか'],
          contoh: [{ jp: 'ケーキとか甘{あま}いものが食{た}べたい。', id: 'Saya ingin makan makanan manis seperti kue atau sejenisnya.' }],
        },
        {
          nomor: 55, pola: 'N と N と どちら', arti: 'Antara A dan B, yang mana...?', level: 'L1',
          penjelasan: 'Digunakan untuk menanyakan perbandingan antara dua pilihan objek.',
          rumus: ['N1 + と + N2 + と どちら (が...ですか)'],
          contoh: [{ jp: 'コーヒーとこうちゃとどちらが好{す}きですか。', id: 'Antara kopi dan teh, yang mana yang lebih kamu sukai?' }],
        },
      ],
    },
    {
      nomor: 8,
      judul: 'Kalimat Pasif & Kausatif (Ukemi & Shieki)',
      pola: [
        {
          nomor: 56, pola: 'V(ら)れる [受け身]', arti: 'Pasif Umum', level: 'L4',
          penjelasan: 'Bentuk pasif umum di mana subjek dikenai tindakan oleh pelakunya.',
          rumus: ['Grup 1: V-a + れる / Grup 2: + られる / Grup 3: される & こられる'],
          contoh: [{ jp: '今日{きょう}も遅刻{ちこく}して先生{せんせい}にしかられた。', id: 'Hari ini pun saya dimarahi oleh guru karena terlambat.' }],
        },
        {
          nomor: 57, pola: 'V(ら)れる [迷惑の受け身]', arti: 'Pasif Merugikan/Menderita', level: 'L4',
          penjelasan: 'Pasif penderitaan di mana subjek merasa dirugikan atas aksi yang dilakukan orang lain.',
          rumus: ['S + は/が + Pelaku + に + N + を + V-Pasif'],
          contoh: [{ jp: '弟{おとうと}にケーキを食{た}べられた。', id: 'Kue saya dimakan oleh adik (sehingga saya merasa dirugikan).' }],
        },
        {
          nomor: 58, pola: 'V(ら)れる [ものや出来事が主語の受け身]', arti: 'Pasif Subjek Benda/Kejadian', level: 'L4',
          penjelasan: 'Bentuk pasif yang subjeknya berupa benda mati, bangunan, atau objek kejadian umum.',
          rumus: ['Benda + が/は + V-Pasif'],
          contoh: [{ jp: 'このお寺{てら}は五百年前{ごひゃくねんまえ}にたてられました。', id: 'Candi/Kuil ini didirikan 500 tahun yang lalu.' }],
        },
        {
          nomor: 59, pola: 'V(さ)せる [強制]', arti: 'Kausatif Paksaan/Menyuruh', level: 'L4',
          penjelasan: 'Bentuk kausatif yang menyatakan perintah paksaan (menyuruh seseorang melakukan aksi).',
          rumus: ['Grup 1: v-a + せる / Grup 2: + させる / Grup 3: させる & こさせる'],
          contoh: [{ jp: '弟{おとうと}を買{か}い物{もの}に行{い}かせる。', id: 'Saya menyuruh adik pergi berbelanja.' }],
        },
        {
          nomor: 60, pola: 'V(さ)せる [誘発]', arti: 'Kausatif Memicu/Membuat', level: 'L4',
          penjelasan: 'Bentuk kausatif yang memicu emosi atau perasaan orang lain akibat ucapan/tindakan.',
          rumus: ['V-Kausatif'],
          contoh: [{ jp: '彼{かれ}はいつもおもしろいことを言{い}って、みんなをわらわせる。', id: 'Dia selalu mengatakan hal-hal lucu dan membuat semua orang tertawa.' }],
        },
        {
          nomor: 61, pola: 'V(さ)せてください', arti: 'Izinkan saya untuk...', level: 'L4',
          penjelasan: 'Ungkapan meminta izin dengan sopan agar pembicara dibiarkan/diizinkan melakukan sesuatu.',
          rumus: ['V-Kausatif (て-form) + ください'],
          contoh: [{ jp: '熱{ねつ}があるので、今日{きょう}は早{はや}く帰{かえ}らせてください。', id: 'Karena demam, izinkanlah saya pulang lebih awal hari ini.' }],
        },
      ],
    },
    {
      nomor: 9,
      judul: 'Hubungan Bantuan & Pemberian-Penerimaan (Yaru/Kureru/Morau)',
      pola: [
        {
          nomor: 62, pola: 'あげる / V てあげる', arti: 'Memberi / Membantu melakukan', level: 'L4',
          penjelasan: 'Memberikan benda atau melakukan tindakan bantuan untuk orang yang setara/lebih muda.',
          rumus: ['N を あげる / V-て + あげる'],
          contoh: [{ jp: '妹{いもうと}の宿題{しゅくだい}を見{み}てあげる。', id: 'Saya membantunya memeriksa PR adik perempuan saya.' }],
        },
        {
          nomor: 63, pola: 'くれる / V てくれる', arti: 'Memberi kepada saya', level: 'L4',
          penjelasan: 'Orang lain memberikan benda atau bantuan tindakan kepada pembicara/keluarga pembicara.',
          rumus: ['Pelaku + が + V-て + くれる'],
          contoh: [{ jp: '母{はは}はいつもおいしい料理{りょうり}を作{つく}ってくれる。', id: 'Ibu selalu membuatkan makanan yang lezat untuk saya.' }],
        },
        {
          nomor: 64, pola: 'もらう / V てもらう', arti: 'Menerima / Minta bantuan', level: 'L4',
          penjelasan: 'Pembicara menerima benda atau bantuan tindakan dari orang lain.',
          rumus: ['S + は + Pemberi + に + V-て + もらう'],
          contoh: [{ jp: '友{とも}だちに東京{とうきょう}をあんないしてもらう。', id: 'Saya mendapat bantuan dari teman untuk memandu keliling Tokyo.' }],
        },
        {
          nomor: 65, pola: 'さしあげる / V てさしあげる', arti: 'Memberi ke atasan/Sopan', level: 'L5',
          penjelasan: 'Bentuk sopan (kenjougo) dari あげる saat memberi ke atasan/tamu.',
          rumus: ['V-て + さしあげる'],
          contoh: [{ jp: 'お客{きゃく}さまにお茶{ちゃ}を出{だ}してさしあげてください。', id: 'Silakan sajikan teh untuk para tamu.' }],
        },
        {
          nomor: 66, pola: 'くださる / V てくださる', arti: 'Atasan memberi ke saya', level: 'L5',
          penjelasan: 'Bentuk penghormatan (sonkeigo) dari くれる di mana atasan/orang terhormat memberi pada pembicara.',
          rumus: ['Atasan + が + V-て + くださる'],
          contoh: [{ jp: '店長{てんちょう}がレジの使{つか}い方{かた}を教{おし}えてくださいました。', id: 'Manajer toko telah mengajarkan cara memakai mesin kasir kepada saya.' }],
        },
        {
          nomor: 67, pola: 'いただく / V ていただく', arti: 'Menerima dari atasan', level: 'L5',
          penjelasan: 'Bentuk merendahkan diri (謙譲語) dari もらう saat menerima dari atasan.',
          rumus: ['S + は + Atasan + に + V-て + いただく'],
          contoh: [{ jp: '先生{せんせい}に作文{さくぶん}をなおしていただく。', id: 'Saya menerima bantuan perbaikan karangan dari Bapak/Ibu Guru.' }],
        },
        {
          nomor: 68, pola: 'やる / V てやる', arti: 'Memberi ke bawahan/hewan/tanaman', level: 'L4',
          penjelasan: 'Memberikan benda atau tindakan kepada bawahan, anak kecil, hewan, atau tanaman.',
          rumus: ['V-て + やる'],
          contoh: [{ jp: '子{こ}どもにおもちゃを買{か}ってやる。', id: 'Saya membelikan mainan untuk anak.' }],
        },
      ],
    },
    {
      nomor: 10,
      judul: 'Keigo (Bahasa Penghormatan 尊敬語 & Merendahkan Diri 謙譲語)',
      pola: [
        {
          nomor: 69, pola: 'お～になる / ご～になる', arti: 'Bentuk Hormat', level: 'L5',
          penjelasan: 'Pola umum Sonkeigo untuk menghormati aktivitas yang dilakukan orang lain/atasan.',
          rumus: ['お + V-Masu (buang ます) + になる'],
          contoh: [
            { jp: '山下先生{やましたせんせい}はいつおもどりになりますか。', id: 'Kapan Bapak Guru Yamashita akan kembali?' },
            { jp: '切符{きっぷ}をお買{か}いになりますか。', id: 'Apakah Anda akan membeli tiket?' },
          ],
        },
        {
          nomor: 70, pola: 'お～くださる / ご～くださる / お～ください / ご～ください', arti: 'Mohon/Silakan', level: 'L4',
          penjelasan: 'Ungkapan penghormatan halus saat memohon atau mempersilakan orang lain/atasan melakukan aksi.',
          rumus: ['お / ご + V-い + ください'],
          contoh: [
            { jp: 'こちらにお名前{なまえ}をお書{か}きください。', id: 'Silakan tuliskan nama Anda di sebelah sini.' },
            { jp: 'どうぞこちらにお掛{か}けください。', id: 'Silakan duduk di sebelah sini.' },
          ],
        },
        {
          nomor: 71, pola: 'お～する / ご～する', arti: 'Bentuk Merendahkan Diri', level: 'L5',
          penjelasan: 'Pola umum Kenjougo untuk merendahkan diri saat tindakan pembicara berhubungan dengan atasan/tamu.',
          rumus: ['お / ご + V-い / Kata Benda Kerja + する'],
          contoh: [
            { jp: '先週{せんしゅう}、中田先生{なかたせんせい}にお会{あ}いしました。', id: 'Minggu lalu, saya telah bertemu dengan Bapak Guru Nakata.' },
            { jp: '明日{あした}の予定{よてい}をご連絡{れんらく}します。', id: 'Saya akan menghubungi/mengabarkan jadwal esok hari.' },
          ],
        },
        {
          nomor: 72, pola: 'お～いたす / ご～いたす', arti: 'Merendahkan Diri Sopan', level: 'L5',
          penjelasan: 'Pola Kenjougo (謙譲語) yang tingkat kesopanannya lebih tinggi daripada お～する; dipakai juga untuk menawarkan bantuan pada atasan dengan sangat sopan.',
          rumus: ['お / ご + V-い + いたす'],
          contoh: [
            { jp: '私{わたし}がお持{も}ちいたします。', id: 'Biar saya yang bawakan (barang Anda).' },
            { jp: 'お荷物{にもつ}は私{わたし}がお持{も}ちいたします。', id: 'Mengenai barang bawaan Anda, biar saya yang bawa.' },
          ],
        },
        {
          nomor: 73, pola: 'お～いただく / ご～いただく', arti: 'Menerima kebaikan dari atasan', level: 'L5',
          penjelasan: 'Bentuk halus merendahkan diri saat pembicara memohon bantuan atau telah menerima kebaikan/kesempatan dari atasan.',
          rumus: ['お / ご + V-Masu / N + いただく'],
          contoh: [
            { jp: 'ご招待{しょうたい}いただき、ありがとうございます。', id: 'Terima kasih banyak atas undangan dari Anda.' },
            { jp: '先生{せんせい}にご指導{しどう}いただき、感謝{かんしゃ}いたします。', id: 'Saya mengucapkan terima kasih karena telah menerima bimbingan dari Bapak/Ibu Guru.' },
          ],
        },
        {
          nomor: 74, pola: 'いらっしゃる / V ていらっしゃる', arti: 'Ada/Datang/Pergi / Sedang...', level: 'L5',
          penjelasan: 'Kata kerja Sonkeigo pengganti いく, くる, いる.',
          rumus: ['Kata Kerja Khusus Hormat / V-て + いらっしゃる'],
          contoh: [{ jp: '山下{やました}さんは今{いま}いらっしゃいますか。', id: 'Apakah Bapak Yamashita ada di tempat sekarang?' }],
        },
        {
          nomor: 75, pola: 'おっしゃる', arti: 'Berbicara/Berkata', level: 'L5',
          penjelasan: 'Kata kerja Sonkeigo pengganti kata いう (berkata/menyampaikan), untuk menghormati ucapan lawan bicara/atasan.',
          rumus: ['おっしゃる (おっしゃいます)'],
          contoh: [
            { jp: 'お名前{なまえ}は何{なん}とおっしゃいますか。', id: 'Siapa nama Anda?' },
            { jp: '社長{しゃちょう}がそのようにおっしゃいました。', id: 'Bapak Direktur telah berkata demikian.' },
          ],
        },
        {
          nomor: 76, pola: 'ごらんになる / ごらんください / ごらんくださる', arti: 'Melihat', level: 'L5',
          penjelasan: 'Kata kerja Sonkeigo pengganti kata みる (melihat).',
          rumus: ['ごらんになる / ごらんください'],
          contoh: [{ jp: '皆様{みなさま}、あちらをごらんください。', id: 'Hadirin sekalian, silakan lihat ke arah sana.' }],
        },
        {
          nomor: 77, pola: 'ごぞんじ', arti: 'Mengetahui/Kenal', level: 'L5',
          penjelasan: 'Bentuk Sonkeigo pengganti kata しっている (mengetahui).',
          rumus: ['ごぞんじです / ごぞんじですか'],
          contoh: [{ jp: 'あの方{かた}をごぞんじですか。', id: 'Apakah Anda mengenali orang itu?' }],
        },
        {
          nomor: 78, pola: 'めしあがる', arti: 'Makan/Minum', level: 'L5',
          penjelasan: 'Kata kerja Sonkeigo pengganti kata たべる dan のむ.',
          rumus: ['めしあがる (めしあがります)'],
          contoh: [{ jp: '何{なん}でも好{す}きなものをめしあがってください。', id: 'Silakan santap apa saja yang Anda sukai.' }],
        },
        {
          nomor: 79, pola: 'なさる', arti: 'Melakukan', level: 'L5',
          penjelasan: 'Kata kerja Sonkeigo pengganti kata する (melakukan).',
          rumus: ['なさる (なさいます)'],
          contoh: [{ jp: '飲{の}み物{もの}は何{なに}になさいますか。', id: 'Minumannya mau memilih apa?' }],
        },
        {
          nomor: 80, pola: 'V(ら)れる [敬語]', arti: 'Keigo Bentuk Pasif', level: 'L5',
          penjelasan: 'Penggunaan kata kerja bentuk pasif (受け身) yang difungsikan sebagai Keigo halus.',
          rumus: ['V-Pasif'],
          contoh: [{ jp: '先生{せんせい}は本{ほん}をよく読{よ}まれますか。', id: 'Apakah Bapak/Ibu guru sering membaca buku?' }],
        },
        {
          nomor: 81, pola: 'いたす', arti: 'Melakukan - Kenjougo', level: 'L5',
          penjelasan: 'Kata kerja Kenjougo pengganti kata する saat pembicara bertindak sopan.',
          rumus: ['いたす (いたします)'],
          contoh: [{ jp: 'すみません、失礼{しつれい}いたしました。', id: 'Mohon maaf, saya telah berbuat tidak sopan.' }],
        },
        {
          nomor: 82, pola: 'うかがう', arti: 'Berkunjung/Bertanya', level: 'L5',
          penjelasan: 'Kata kerja Kenjougo pengganti kata 行く, 来る, atau 聞く pada atasan.',
          rumus: ['うかがう (うかがいます)'],
          contoh: [{ jp: '明日{あした}、十時{じゅうじ}にそちらにうかがいます。', id: 'Besok saya akan berkunjung ke tempat Anda pada jam 10.' }],
        },
        {
          nomor: 83, pola: 'おる / V ておる', arti: 'Ada/Sedang', level: 'L4',
          penjelasan: 'Kata kerja Kenjougo pengganti kata いる untuk merendahkan keberadaan pembicara/pihak pembicara.',
          rumus: ['おる (おります) / V-て + おる'],
          contoh: [
            { jp: '会{あ}えるのを楽{たの}しみにしております。', id: 'Saya sangat menantikan kesempatan untuk bertemu.' },
            { jp: '父{ちち}は今{いま}おりません。', id: 'Ayah saya saat ini tidak ada di rumah.' },
          ],
        },
        {
          nomor: 84, pola: 'ぞんじる / ぞんずる', arti: 'Mengetahui/Pikir', level: 'L5',
          penjelasan: 'Kata kerja Kenjougo pengganti kata おもう atau しる.',
          rumus: ['ぞんじる (ぞんじません / ぞんじております)'],
          contoh: [{ jp: '社長{しゃちょう}に娘{むすめ}さんがいたとはぞんじませんでした。', id: 'Saya tidak mengetahui bahwa Bapak Direktur memiliki putri.' }],
        },
        {
          nomor: 85, pola: 'はいけんする', arti: 'Melihat/Membaca', level: 'L5',
          penjelasan: 'Kata kerja Kenjougo pengganti kata 見る / 読む saat melihat/membaca hal milik atasan.',
          rumus: ['はいけんする (はいけんしました)'],
          contoh: [{ jp: 'お手紙{てがみ}、はいけんしました。', id: 'Surat dari Anda sudah saya baca/lihat.' }],
        },
        {
          nomor: 86, pola: 'まいる', arti: 'Datang/Pergi', level: 'L5',
          penjelasan: 'Kata kerja Kenjougo pengganti kata 行く dan 来る.',
          rumus: ['まいる (まいりました)'],
          contoh: [{ jp: 'さくら会社{かいしゃ}からまいりました、中山{なかやま}ともうします。', id: 'Saya Nakayama, datang dari Perusahaan Sakura.' }],
        },
        {
          nomor: 87, pola: 'もうしあげる', arti: 'Mengucapkan/Menyampaikan - Kenjougo', level: 'L5',
          penjelasan: 'Kata kerja Kenjougo saat menyampaikan salam atau ucapan terima kasih/permohonan ke atasan.',
          rumus: ['もうしあげる'],
          contoh: [{ jp: 'どうぞよろしくおねがいもうしあげます。', id: 'Saya mengucapkan mohon bimbingannya dengan setulus hati.' }],
        },
        {
          nomor: 88, pola: 'もうす', arti: 'Nama saya...', level: 'L5',
          penjelasan: 'Kata kerja Kenjougo pengganti kata いう saat memperkenalkan nama diri.',
          rumus: ['[Nama] + と もうします'],
          contoh: [{ jp: '山田花子{やまだはなこ}ともうします。', id: 'Nama saya adalah Hanako Yamada.' }],
        },
        {
          nomor: 89, pola: 'AN・N でございます', arti: 'Adalah - Sangat Sopan', level: 'L4',
          penjelasan: 'Bentuk teineigo sangat sopan pengganti kata です.',
          rumus: ['N / na-Adj + でございます'],
          contoh: [{ jp: 'このかばんはフランスのものでございます。', id: 'Tas ini merupakan buatan Prancis.' }],
        },
      ],
    },
    {
      nomor: 11,
      judul: 'Tingkat Kemudahan, Kecenderungan, & Batas Kuantitas',
      pola: [
        {
          nomor: 90, pola: 'V やすい [容易]', arti: 'Mudah dipahami/dilakukan', level: 'L1',
          penjelasan: 'Menyatakan bahwa suatu kegiatan atau benda sangat mudah untuk dilakukan/dipakai (容易 = mudah).',
          rumus: ['V-Masu (buang ます) + やすい'],
          contoh: [{ jp: 'このくつは軽{かる}くて歩{ある}きやすいです。', id: 'Sepatu ini ringan sehingga mudah untuk dibuat berjalan.' }],
        },
        {
          nomor: 91, pola: 'V やすい [傾向]', arti: 'Cenderung/Mudah menjadi...', level: 'L4',
          penjelasan: 'Menyatakan bahwa sesuatu memiliki kecenderungan/sifat yang mudah berubah atau terjadi (傾向 = kecenderungan).',
          rumus: ['V-Masu (buang ます) + やすい'],
          contoh: [{ jp: '妹{いもうと}は体{からだ}が弱{よわ}くて、病気{びょうき}になりやすい。', id: 'Adik perempuan saya tubuhnya lemah sehingga mudah jatuh sakit.' }],
        },
        {
          nomor: 92, pola: 'V にくい', arti: 'Sulit dipahami/dilakukan', level: 'L1',
          penjelasan: 'Menyatakan bahwa suatu hal/kegiatan terasa sulit untuk dilakukan.',
          rumus: ['V-Masu (buang ます) + にくい'],
          contoh: [{ jp: 'このいすはかたくてすわりにくい。', id: 'Kursi ini keras sehingga sulit/tidak nyaman diduduki.' }],
        },
        {
          nomor: 93, pola: '～すぎる', arti: 'Terlalu...', level: 'L1',
          penjelasan: 'Menyatakan bahwa suatu batas/keadaan melebihi batas wajar (terlalu...).',
          rumus: ['V-Masu / i-Adj (buang い) / na-Adj + すぎる'],
          contoh: [{ jp: '歩{ある}きすぎて、足{あし}がいたくなりました。', id: 'Karena terlalu banyak berjalan, kaki saya menjadi sakit.' }],
        },
        {
          nomor: 94, pola: '～こと', arti: 'Hal/Pembendaan kata kerja', level: 'L2',
          penjelasan: 'Mengubah kata kerja menjadi kata benda (pembendaan/nominalisasi).',
          rumus: ['V-Kamus + こと'],
          contoh: [{ jp: '私{わたし}の趣味{しゅみ}は絵{え}をかくことです。', id: 'Hobi saya adalah menggambar lukisan.' }],
        },
        {
          nomor: 95, pola: 'N ばかり', arti: 'Hanya... saja / Melulu', level: 'L2',
          penjelasan: 'Menyatakan pembatasan di mana pembicara mengeluhkan hal tersebut terjadi melulu/hanya itu saja.',
          rumus: ['N + ばかり (+ V)'],
          contoh: [{ jp: 'うちの子{こ}は、ゲームばかりしています。', id: 'Anak saya kerjaannya main gim melulu.' }],
        },
        {
          nomor: 96, pola: '数詞 + も', arti: 'Sampai/Hingga [Jumlah banyak]', level: 'L2',
          penjelasan: 'Penekanan kuantitas atau jumlah yang sangat banyak di luar perkiraan (sampai/hingga). 数詞 = kata bilangan.',
          rumus: ['Kata Jumlah/Hitungan + も'],
          contoh: [{ jp: 'おなかがすいていたので、ご飯{はん}を三{さん}ばいも食{た}べました。', id: 'Karena lapar, saya makan nasi hingga 3 mangkuk.' }],
        },
      ],
    },
    {
      nomor: 12,
      judul: 'Perbandingan, Derajat, & Sifat',
      pola: [
        {
          nomor: 97, pola: 'は ～より', arti: 'A lebih... daripada B', level: 'L1',
          penjelasan: 'Menyatakan perbandingan tingkat sifat antara dua objek (Objek 1 lebih... dibanding Objek 2).',
          rumus: ['N1 + は + N2 + より + Adj'],
          contoh: [{ jp: '姉{あね}は私{わたし}よりせが高{たか}いです。', id: 'Kakak perempuan saya bertubuh lebih tinggi daripada saya.' }],
        },
        {
          nomor: 98, pola: '～ほう', arti: 'Pihak/Bagian yang...', level: 'L1',
          penjelasan: 'Menunjukkan kecenderungan pilihan pada suatu pihak/sisi objek.',
          rumus: ['N-の / Adj + ほう'],
          contoh: [{ jp: 'コーヒーのほうが好{す}きです。', id: 'Saya lebih menyukai kopi.' }],
        },
        {
          nomor: 99, pola: '～ほうがいい', arti: 'Lebih baik...', level: 'L2',
          penjelasan: 'Memberikan saran atau usulan tindakan yang sebaiknya dilakukan.',
          rumus: ['V-た / V-ない + ほうがいい'],
          contoh: [{ jp: 'かぜを引{ひ}いたときは、おふろに入{はい}らないほうがいいよ。', id: 'Saat masuk angin, sebaiknya jangan mandi.' }],
        },
        {
          nomor: 100, pola: '～より ～ほう', arti: 'Daripada A, lebih baik B', level: 'L1',
          penjelasan: 'Kalimat komparatif utuh (daripada A, lebih baik/suka B).',
          rumus: ['N1 + より + N2 + の ほうが + Adj'],
          contoh: [{ jp: 'バスより地下鉄{ちかてつ}のほうがはやいです。', id: 'Daripada bus, kereta bawah tanah lebih cepat.' }],
        },
        {
          nomor: 101, pola: 'A さ / AN さ', arti: 'Tingkat/Ke-an [Pengubah kata sifat jadi kata benda]', level: 'L3',
          penjelasan: 'Mengubah kata sifat menjadi kata benda derajat/tingkat (ke-an).',
          rumus: ['i-Adj (buang い) / na-Adj + さ'],
          contoh: [{ jp: '今年{ことし}の冬{ふゆ}は寒{さむ}さがきびしい。', id: 'Musim dingin tahun ini tingkat dinginnya sangat parah.' }],
        },
        {
          nomor: 102, pola: '～の', arti: 'Pembendaan / Pengganti kata benda', level: 'L2',
          penjelasan: 'Menggantikan kata benda yang sudah dipahami dari konteks pembicaraan atau pembendaan kalimat.',
          rumus: ['Bentuk Biasa + の'],
          contoh: [{ jp: '私{わたし}は朝{あさ}早{はや}く起{お}きるのが苦手{にがて}です。', id: 'Saya tidak mahir dalam hal bangun pagi-pagi.' }],
        },
        {
          nomor: 103, pola: '～のだ / ～んだ', arti: 'Penjelasan/Alasan penjelas', level: 'L3',
          penjelasan: 'Menyatakan penjelasan alasan, penekanan latar belakang, atau penguatan keterangan.',
          rumus: ['Bentuk Biasa + のだ / んだ (N & na-Adj + な)'],
          contoh: [{ jp: '昨日{きのう}どうして学校{がっこう}に来{こ}なかったんですか。', id: 'Mengapa kemarin kamu tidak datang ke sekolah? (meminta penjelasan)' }],
        },
        {
          nomor: 104, pola: '～と言う', arti: 'Mengucapkan/Menyebut', level: 'L1',
          penjelasan: 'Menyatakan isi ucapan, nama dari sesuatu, atau definisi.',
          rumus: ['Isi Kalimat + と言う'],
          contoh: [{ jp: '私{わたし}は食{た}べる前{まえ}にかならず「いただきます」と言{い}う。', id: 'Saya selalu mengucapkan "Itadakimasu" sebelum makan.' }],
        },
      ],
    },
  ],
  // Where this file differs from the printed module (nomor = the module's pattern number, 0 = the whole module).
  koreksi: [
    { nomor: 0, catatan: 'Contoh ditulis tanpa spasi antarkata, furigana 漢字{かな} pada setiap kanji, dan angka Arab (9 時, 4 月, 500 年, 10 時) ditulis dengan kanji.' },
    { nomor: 10, catatan: 'Contoh di modul tertulis 買い方 (かいかた), padahal terjemahannya "cara penggunaan": ditulis 使{つか}い方{かた}.' },
    { nomor: 16, catatan: 'Rumus "i-Adj (く) + も" ditulis "i-Adj (くて) + も".' },
    { nomor: 27, catatan: 'Terjemahan "Tamayama" diganti "Tayama" (田山{たやま}).' },
    { nomor: 60, catatan: 'Baris rumus dan contoh di modul tercampur tata letaknya; disusun ulang tanpa mengubah isi.' },
    { nomor: 66, catatan: 'Contoh di modul tertulis 買(つか)い方 dan "くだ いました": ditulis 使{つか}い方{かた} dan くださいました.' },
    { nomor: 70, catatan: 'Judul pola "お～くだされ" ditulis "お～くださる" seperti di daftar isi modul.' },
    { nomor: 81, catatan: 'Terjemahan "saya telah melakukan kelengahan/permisi" disederhanakan menjadi "saya telah berbuat tidak sopan".' },
    { nomor: 84, catatan: 'Rumus "ぞんじ知っております" ditulis "ぞんじております".' },
    { nomor: 87, catatan: 'Arti di daftar isi berbahasa Inggris ("Say/Tell"): ditulis "Mengucapkan/Menyampaikan".' },
    { nomor: 96, catatan: 'Contoh "3 ぱい" ditulis 三{さん}ばい (三杯 dibaca さんばい).' },
    { nomor: 104, catatan: 'Contoh di modul kehilangan kutipannya ("かならずと言う"): ditulis かならず「いただきます」と言{い}う sesuai terjemahannya.' },
    { nomor: 0, catatan: 'Pola 105–111 (Kategori 13) adalah pengulangan pola keigo Kategori 10; contohnya digabung sebagai contoh kedua pola aslinya (lihat gabungan).' },
  ],
  // Module numbers that repeat another pattern → the pattern they are folded into.
  gabungan: { 105: 72, 106: 73, 107: 70, 108: 71, 109: 75, 110: 69, 111: 83 },
};
