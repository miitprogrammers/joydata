// Bank soal dokkai N5 (Tes Online): 5 level × 10 bacaan × 2 soal. Bacaan 1–3 tiap level disempurnakan dari
// quiz_dokkai_n5_5_level.html, bacaan 4–10 ditulis baru.
// Furigana ditulis langsung setelah kanjinya: 毎朝{まいあさ} → <ruby>毎朝<rt>まいあさ</rt></ruby>.
// Pilihan jawaban dalam bahasa Indonesia; `benar` = indeks pilihan yang benar.

export const DOKKAI_LEVEL = [
  {
    kode: 'L1',
    judul: 'Level 1',
    deskripsi: 'Kalimat sangat dasar',
    bacaan: [
      {
        id: 'L1-1',
        judul: 'わたしの一日{いちにち}',
        teks: 'わたしは毎朝{まいあさ}六時{ろくじ}に起{お}きます。七時{しちじ}にパンとたまごを食{た}べます。それから、学校{がっこう}へ行{い}きます。',
        terjemahan: 'Saya bangun setiap pagi pukul enam. Pukul tujuh saya makan roti dan telur. Setelah itu, saya pergi ke sekolah.',
        soal: [
          { id: 'L1-1-1', tanya: '何時{なんじ}に起{お}きますか。', tanyaId: 'Pukul berapa tokoh bangun?', opsi: ['Pukul lima', 'Pukul enam', 'Pukul tujuh'], benar: 1, pembahasan: '毎朝六時に起きます = setiap pagi bangun pukul enam.' },
          { id: 'L1-1-2', tanya: '朝{あさ}ごはんに何{なに}を食{た}べますか。', tanyaId: 'Apa yang dimakan saat sarapan?', opsi: ['Nasi dan ikan', 'Roti dan telur', 'Buah dan susu'], benar: 1, pembahasan: 'パンとたまご = roti dan telur.' },
        ],
      },
      {
        id: 'L1-2',
        judul: '家族{かぞく}',
        teks: 'わたしの家族{かぞく}は四人{よにん}です。父{ちち}と母{はは}と妹{いもうと}とわたしです。妹{いもうと}は十歳{じゅっさい}で、わたしより小{ちい}さいです。',
        terjemahan: 'Keluarga saya terdiri dari empat orang: ayah, ibu, adik perempuan, dan saya. Adik perempuan berusia sepuluh tahun dan lebih kecil daripada saya.',
        soal: [
          { id: 'L1-2-1', tanya: '家族{かぞく}は何人{なんにん}ですか。', tanyaId: 'Ada berapa orang dalam keluarga?', opsi: ['Tiga orang', 'Empat orang', 'Lima orang'], benar: 1, pembahasan: '家族は四人です = keluarga terdiri dari empat orang.' },
          { id: 'L1-2-2', tanya: '妹{いもうと}は何歳{なんさい}ですか。', tanyaId: 'Berapa umur adik perempuan?', opsi: ['8 tahun', '9 tahun', '10 tahun'], benar: 2, pembahasan: '妹は十歳 = adik perempuan berumur sepuluh tahun.' },
        ],
      },
      {
        id: 'L1-3',
        judul: '好{す}きな食{た}べ物{もの}',
        teks: '田中{たなか}さんはりんごが好{す}きです。でも、バナナはあまり好{す}きではありません。毎週{まいしゅう}日曜日{にちようび}にりんごを買{か}います。',
        terjemahan: 'Tanaka suka apel. Namun, ia tidak terlalu suka pisang. Setiap hari Minggu ia membeli apel.',
        soal: [
          { id: 'L1-3-1', tanya: '田中{たなか}さんは何{なに}が好{す}きですか。', tanyaId: 'Apa yang disukai Tanaka?', opsi: ['Apel', 'Pisang', 'Jeruk'], benar: 0, pembahasan: 'りんごが好きです = suka apel.' },
          { id: 'L1-3-2', tanya: 'いつりんごを買{か}いますか。', tanyaId: 'Kapan Tanaka membeli apel?', opsi: ['Setiap hari Sabtu', 'Setiap hari Minggu', 'Setiap hari Senin'], benar: 1, pembahasan: '毎週日曜日に = setiap hari Minggu.' },
        ],
      },
      {
        id: 'L1-4',
        judul: 'わたしの部屋{へや}',
        teks: 'わたしの部屋{へや}は二階{にかい}にあります。部屋{へや}にはつくえといすがあります。まどのそばにベッドがあります。',
        terjemahan: 'Kamar saya ada di lantai dua. Di kamar ada meja dan kursi. Di dekat jendela ada tempat tidur.',
        soal: [
          { id: 'L1-4-1', tanya: 'わたしの部屋{へや}は何階{なんがい}にありますか。', tanyaId: 'Kamar penulis ada di lantai berapa?', opsi: ['Lantai satu', 'Lantai dua', 'Lantai tiga'], benar: 1, pembahasan: '部屋は二階にあります = kamar ada di lantai dua.' },
          { id: 'L1-4-2', tanya: 'まどのそばに何{なに}がありますか。', tanyaId: 'Apa yang ada di dekat jendela?', opsi: ['Meja', 'Kursi', 'Tempat tidur'], benar: 2, pembahasan: 'まどのそばにベッドがあります = di dekat jendela ada tempat tidur.' },
        ],
      },
      {
        id: 'L1-5',
        judul: '友{とも}だちのアンナさん',
        teks: 'アンナさんはわたしの友{とも}だちです。アメリカ人{じん}で、日本語{にほんご}の学生{がくせい}です。アンナさんは毎日{まいにち}バスで学校{がっこう}へ来{き}ます。',
        terjemahan: 'Anna adalah teman saya. Ia orang Amerika dan pelajar bahasa Jepang. Anna datang ke sekolah naik bus setiap hari.',
        soal: [
          { id: 'L1-5-1', tanya: 'アンナさんはどこの国{くに}の人{ひと}ですか。', tanyaId: 'Anna orang dari negara mana?', opsi: ['Jepang', 'Amerika', 'Indonesia'], benar: 1, pembahasan: 'アメリカ人 = orang Amerika.' },
          { id: 'L1-5-2', tanya: 'アンナさんは何{なに}で学校{がっこう}へ来{き}ますか。', tanyaId: 'Anna datang ke sekolah naik apa?', opsi: ['Bus', 'Kereta', 'Sepeda'], benar: 0, pembahasan: 'バスで来ます = datang naik bus.' },
        ],
      },
      {
        id: 'L1-6',
        judul: 'わたしのかばん',
        teks: 'これはわたしのかばんです。かばんの中{なか}に本{ほん}が二冊{にさつ}とペンが三本{さんぼん}あります。このかばんは黒{くろ}くて、大{おお}きいです。',
        terjemahan: 'Ini tas saya. Di dalam tas ada dua buku dan tiga pena. Tas ini hitam dan besar.',
        soal: [
          { id: 'L1-6-1', tanya: 'かばんの中{なか}にペンは何本{なんぼん}ありますか。', tanyaId: 'Ada berapa pena di dalam tas?', opsi: ['Dua', 'Tiga', 'Empat'], benar: 1, pembahasan: 'ペンが三本 = tiga pena.' },
          { id: 'L1-6-2', tanya: 'どんなかばんですか。', tanyaId: 'Tas itu seperti apa?', opsi: ['Hitam dan besar', 'Putih dan kecil', 'Merah dan besar'], benar: 0, pembahasan: '黒くて、大きいです = hitam dan besar.' },
        ],
      },
      {
        id: 'L1-7',
        judul: '今日{きょう}の天気{てんき}',
        teks: '今日{きょう}は天気{てんき}がいいです。あまり暑{あつ}くないです。午後{ごご}、友{とも}だちと公園{こうえん}へ行{い}きます。',
        terjemahan: 'Hari ini cuacanya bagus. Tidak terlalu panas. Sore nanti saya pergi ke taman bersama teman.',
        soal: [
          { id: 'L1-7-1', tanya: '今日{きょう}の天気{てんき}はどうですか。', tanyaId: 'Bagaimana cuaca hari ini?', opsi: ['Hujan', 'Bagus dan tidak terlalu panas', 'Sangat panas'], benar: 1, pembahasan: '天気がいいです。あまり暑くないです = cuacanya bagus, tidak terlalu panas.' },
          { id: 'L1-7-2', tanya: '午後{ごご}、どこへ行{い}きますか。', tanyaId: 'Ke mana tokoh pergi sore nanti?', opsi: ['Ke taman', 'Ke sekolah', 'Ke toko'], benar: 0, pembahasan: '公園へ行きます = pergi ke taman.' },
        ],
      },
      {
        id: 'L1-8',
        judul: 'うちのねこ',
        teks: 'うちにねこが一匹{いっぴき}います。名前{なまえ}はタマです。タマは白{しろ}いねこです。毎日{まいにち}よく寝{ね}ます。',
        terjemahan: 'Di rumah ada seekor kucing. Namanya Tama. Tama adalah kucing putih. Setiap hari ia banyak tidur.',
        soal: [
          { id: 'L1-8-1', tanya: 'ねこの名前{なまえ}は何{なん}ですか。', tanyaId: 'Siapa nama kucingnya?', opsi: ['Tama', 'Pochi', 'Mika'], benar: 0, pembahasan: '名前はタマです = namanya Tama.' },
          { id: 'L1-8-2', tanya: 'タマはどんなねこですか。', tanyaId: 'Tama kucing seperti apa?', opsi: ['Kucing hitam', 'Kucing putih', 'Kucing cokelat'], benar: 1, pembahasan: '白いねこです = kucing putih.' },
        ],
      },
      {
        id: 'L1-9',
        judul: 'わたしの日曜日{にちようび}',
        teks: 'わたしは日曜日{にちようび}に料理{りょうり}をします。日曜日{にちようび}の夜{よる}は家族{かぞく}といっしょにテレビを見{み}ます。月曜日{げつようび}の朝{あさ}は早{はや}く起{お}きます。',
        terjemahan: 'Saya memasak pada hari Minggu. Minggu malam saya menonton TV bersama keluarga. Senin pagi saya bangun pagi-pagi.',
        soal: [
          { id: 'L1-9-1', tanya: '日曜日{にちようび}の夜{よる}、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pada Minggu malam?', opsi: ['Memasak', 'Menonton TV bersama keluarga', 'Belajar'], benar: 1, pembahasan: '日曜日の夜は家族といっしょにテレビを見ます。' },
          { id: 'L1-9-2', tanya: 'いつ早{はや}く起{お}きますか。', tanyaId: 'Kapan tokoh bangun pagi-pagi?', opsi: ['Minggu pagi', 'Senin pagi', 'Sabtu pagi'], benar: 1, pembahasan: '月曜日の朝は早く起きます = Senin pagi bangun pagi-pagi.' },
        ],
      },
      {
        id: 'L1-10',
        judul: 'わたしの町{まち}',
        teks: 'わたしの町{まち}は小{ちい}さいです。でも、きれいな川{かわ}があります。駅{えき}の前{まえ}に大{おお}きいスーパーがあります。',
        terjemahan: 'Kota saya kecil. Tetapi ada sungai yang indah. Di depan stasiun ada supermarket besar.',
        soal: [
          { id: 'L1-10-1', tanya: 'わたしの町{まち}はどんな町{まち}ですか。', tanyaId: 'Kota penulis seperti apa?', opsi: ['Besar', 'Kecil', 'Ramai'], benar: 1, pembahasan: '町は小さいです = kotanya kecil.' },
          { id: 'L1-10-2', tanya: 'スーパーはどこにありますか。', tanyaId: 'Di mana supermarketnya?', opsi: ['Di depan stasiun', 'Di dekat sungai', 'Di belakang sekolah'], benar: 0, pembahasan: '駅の前に大きいスーパーがあります = di depan stasiun ada supermarket besar.' },
        ],
      },
    ],
  },
  {
    kode: 'L2',
    judul: 'Level 2',
    deskripsi: 'Rutinitas & tempat',
    bacaan: [
      {
        id: 'L2-1',
        judul: '図書館{としょかん}で',
        teks: 'きのう、わたしは学校{がっこう}のあとで図書館{としょかん}へ行{い}きました。本{ほん}を二冊{にさつ}借{か}りました。図書館{としょかん}は午後{ごご}五時{ごじ}に閉{し}まります。',
        terjemahan: 'Kemarin, setelah sekolah saya pergi ke perpustakaan. Saya meminjam dua buku. Perpustakaan tutup pukul lima sore.',
        soal: [
          { id: 'L2-1-1', tanya: 'どこへ行{い}きましたか。', tanyaId: 'Ke mana tokoh pergi?', opsi: ['Ke toko', 'Ke perpustakaan', 'Ke rumah sakit'], benar: 1, pembahasan: '図書館へ行きました = pergi ke perpustakaan.' },
          { id: 'L2-1-2', tanya: '本{ほん}を何冊{なんさつ}借{か}りましたか。', tanyaId: 'Berapa buku yang dipinjam?', opsi: ['Satu', 'Dua', 'Tiga'], benar: 1, pembahasan: '本を二冊借りました = meminjam dua buku.' },
        ],
      },
      {
        id: 'L2-2',
        judul: '駅{えき}で友{とも}だちに会{あ}う',
        teks: '土曜日{どようび}の午後{ごご}二時{にじ}に駅{えき}でミカさんに会{あ}います。わたしは一時{いちじ}五十分{ごじゅっぷん}に駅{えき}に着{つ}きます。ミカさんは電車{でんしゃ}で来{き}ます。',
        terjemahan: 'Hari Sabtu pukul dua siang saya bertemu Mika di stasiun. Saya tiba di stasiun pukul 1.50. Mika datang dengan kereta.',
        soal: [
          { id: 'L2-2-1', tanya: 'どこでミカさんに会{あ}いますか。', tanyaId: 'Di mana tokoh bertemu Mika?', opsi: ['Di sekolah', 'Di stasiun', 'Di taman'], benar: 1, pembahasan: '駅で会います = bertemu di stasiun.' },
          { id: 'L2-2-2', tanya: 'ミカさんは何{なに}で来{き}ますか。', tanyaId: 'Mika datang dengan apa?', opsi: ['Bus', 'Sepeda', 'Kereta'], benar: 2, pembahasan: '電車で来ます = datang dengan kereta.' },
        ],
      },
      {
        id: 'L2-3',
        judul: '買{か}い物{もの}',
        teks: 'スーパーで牛乳{ぎゅうにゅう}とパンを買{か}いました。牛乳{ぎゅうにゅう}は百五十円{ひゃくごじゅうえん}で、パンは二百円{にひゃくえん}でした。全部{ぜんぶ}で三百五十円{さんびゃくごじゅうえん}でした。',
        terjemahan: 'Saya membeli susu dan roti di supermarket. Susu seharga 150 yen dan roti 200 yen. Totalnya 350 yen.',
        soal: [
          { id: 'L2-3-1', tanya: '牛乳{ぎゅうにゅう}はいくらでしたか。', tanyaId: 'Berapa harga susu?', opsi: ['150 yen', '200 yen', '350 yen'], benar: 0, pembahasan: '牛乳は百五十円 = susu 150 yen.' },
          { id: 'L2-3-2', tanya: '全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Berapa total harganya?', opsi: ['300 yen', '350 yen', '400 yen'], benar: 1, pembahasan: '全部で三百五十円 = totalnya 350 yen (150 + 200).' },
        ],
      },
      {
        id: 'L2-4',
        judul: 'きのうの夜{よる}',
        teks: 'きのうの夜{よる}、わたしは七時{しちじ}に家{いえ}へ帰{かえ}りました。それから、晩{ばん}ごはんを食{た}べて、おふろに入{はい}りました。十一時{じゅういちじ}に寝{ね}ました。',
        terjemahan: 'Kemarin malam saya pulang ke rumah pukul tujuh. Setelah itu saya makan malam dan mandi berendam. Saya tidur pukul sebelas.',
        soal: [
          { id: 'L2-4-1', tanya: '何時{なんじ}に家{いえ}へ帰{かえ}りましたか。', tanyaId: 'Pukul berapa tokoh pulang ke rumah?', opsi: ['Pukul enam', 'Pukul tujuh', 'Pukul sebelas'], benar: 1, pembahasan: '七時に家へ帰りました = pulang pukul tujuh.' },
          { id: 'L2-4-2', tanya: '晩{ばん}ごはんのあとで、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan setelah makan malam?', opsi: ['Tidur', 'Mandi berendam', 'Menonton TV'], benar: 1, pembahasan: '晩ごはんを食べて、おふろに入りました = makan malam, lalu mandi berendam.' },
        ],
      },
      {
        id: 'L2-5',
        judul: 'デパートで',
        teks: '先週{せんしゅう}の土曜日{どようび}、母{はは}とデパートへ行{い}きました。わたしは青{あお}いシャツを買{か}いました。シャツは三千円{さんぜんえん}でした。母{はは}はくつを買{か}いました。',
        terjemahan: 'Sabtu minggu lalu saya pergi ke department store bersama ibu. Saya membeli kemeja biru. Kemeja itu harganya 3.000 yen. Ibu membeli sepatu.',
        soal: [
          { id: 'L2-5-1', tanya: 'わたしは何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli penulis?', opsi: ['Kemeja biru', 'Sepatu', 'Tas biru'], benar: 0, pembahasan: '青いシャツを買いました = membeli kemeja biru.' },
          { id: 'L2-5-2', tanya: 'シャツはいくらでしたか。', tanyaId: 'Berapa harga kemejanya?', opsi: ['300 yen', '3.000 yen', '30.000 yen'], benar: 1, pembahasan: '三千円 = 3.000 yen.' },
        ],
      },
      {
        id: 'L2-6',
        judul: '病院{びょういん}へ行{い}きました',
        teks: 'けさ、頭{あたま}がいたかったですから、学校{がっこう}を休{やす}みました。病院{びょういん}へ行{い}って、くすりをもらいました。午後{ごご}は家{いえ}で寝{ね}ました。',
        terjemahan: 'Pagi ini kepala saya sakit, jadi saya tidak masuk sekolah. Saya pergi ke rumah sakit dan mendapat obat. Sore hari saya tidur di rumah.',
        soal: [
          { id: 'L2-6-1', tanya: 'どうして学校{がっこう}を休{やす}みましたか。', tanyaId: 'Mengapa tokoh tidak masuk sekolah?', opsi: ['Karena kepalanya sakit', 'Karena hujan', 'Karena ada urusan keluarga'], benar: 0, pembahasan: '頭がいたかったですから = karena kepalanya sakit.' },
          { id: 'L2-6-2', tanya: '午後{ごご}、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan sore hari?', opsi: ['Pergi ke sekolah', 'Tidur di rumah', 'Pergi ke rumah sakit'], benar: 1, pembahasan: '午後は家で寝ました = sore hari tidur di rumah.' },
        ],
      },
      {
        id: 'L2-7',
        judul: '郵便局{ゆうびんきょく}',
        teks: 'きのう、郵便局{ゆうびんきょく}へ行{い}って、手紙{てがみ}を出{だ}しました。切手{きって}を五枚{ごまい}買{か}いました。郵便局{ゆうびんきょく}は銀行{ぎんこう}のとなりにあります。',
        terjemahan: 'Kemarin saya pergi ke kantor pos dan mengirim surat. Saya membeli lima prangko. Kantor pos ada di sebelah bank.',
        soal: [
          { id: 'L2-7-1', tanya: '切手{きって}を何枚{なんまい}買{か}いましたか。', tanyaId: 'Berapa lembar prangko yang dibeli?', opsi: ['Tiga', 'Lima', 'Sepuluh'], benar: 1, pembahasan: '切手を五枚買いました = membeli lima prangko.' },
          { id: 'L2-7-2', tanya: '郵便局{ゆうびんきょく}はどこにありますか。', tanyaId: 'Di mana kantor pos?', opsi: ['Di sebelah bank', 'Di depan stasiun', 'Di belakang sekolah'], benar: 0, pembahasan: '銀行のとなりにあります = ada di sebelah bank.' },
        ],
      },
      {
        id: 'L2-8',
        judul: '食堂{しょくどう}で',
        teks: '昼{ひる}ごはんは学校{がっこう}の食堂{しょくどう}で食{た}べました。わたしはカレーを食{た}べました。カレーは四百円{よんひゃくえん}で、とてもおいしかったです。',
        terjemahan: 'Saya makan siang di kantin sekolah. Saya makan kari. Karinya 400 yen dan sangat enak.',
        soal: [
          { id: 'L2-8-1', tanya: 'どこで昼{ひる}ごはんを食{た}べましたか。', tanyaId: 'Di mana tokoh makan siang?', opsi: ['Di rumah', 'Di kantin sekolah', 'Di restoran dekat stasiun'], benar: 1, pembahasan: '学校の食堂で食べました = makan di kantin sekolah.' },
          { id: 'L2-8-2', tanya: 'カレーはいくらでしたか。', tanyaId: 'Berapa harga karinya?', opsi: ['400 yen', '500 yen', '600 yen'], benar: 0, pembahasan: '四百円 = 400 yen.' },
        ],
      },
      {
        id: 'L2-9',
        judul: '自転車{じてんしゃ}で会社{かいしゃ}へ',
        teks: 'わたしは毎朝{まいあさ}、自転車{じてんしゃ}で会社{かいしゃ}へ行{い}きます。家{いえ}から会社{かいしゃ}まで二十分{にじゅっぷん}ぐらいかかります。雨{あめ}の日{ひ}はバスに乗{の}ります。',
        terjemahan: 'Setiap pagi saya pergi ke kantor naik sepeda. Dari rumah ke kantor memakan waktu sekitar 20 menit. Pada hari hujan saya naik bus.',
        soal: [
          { id: 'L2-9-1', tanya: '家{いえ}から会社{かいしゃ}まで何分{なんぷん}ぐらいかかりますか。', tanyaId: 'Berapa lama dari rumah ke kantor?', opsi: ['Sekitar 10 menit', 'Sekitar 20 menit', 'Sekitar 30 menit'], benar: 1, pembahasan: '二十分ぐらいかかります = sekitar 20 menit.' },
          { id: 'L2-9-2', tanya: '雨{あめ}の日{ひ}は何{なに}で会社{かいしゃ}へ行{い}きますか。', tanyaId: 'Pada hari hujan naik apa ke kantor?', opsi: ['Sepeda', 'Bus', 'Kereta'], benar: 1, pembahasan: '雨の日はバスに乗ります = pada hari hujan naik bus.' },
        ],
      },
      {
        id: 'L2-10',
        judul: '本屋{ほんや}で',
        teks: 'きのう、駅{えき}の近{ちか}くの本屋{ほんや}へ行{い}きました。日本語{にほんご}の辞書{じしょ}を買{か}いたかったですが、高{たか}かったですから、買{か}いませんでした。雑誌{ざっし}を一冊{いっさつ}買{か}いました。',
        terjemahan: 'Kemarin saya pergi ke toko buku dekat stasiun. Saya ingin membeli kamus bahasa Jepang, tetapi karena mahal, saya tidak membelinya. Saya membeli satu majalah.',
        soal: [
          { id: 'L2-10-1', tanya: 'どうして辞書{じしょ}を買{か}いませんでしたか。', tanyaId: 'Mengapa tokoh tidak membeli kamus?', opsi: ['Karena mahal', 'Karena tidak ada', 'Karena tokonya tutup'], benar: 0, pembahasan: '高かったですから = karena mahal.' },
          { id: 'L2-10-2', tanya: '本屋{ほんや}で何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli di toko buku?', opsi: ['Kamus', 'Satu majalah', 'Dua buku'], benar: 1, pembahasan: '雑誌を一冊買いました = membeli satu majalah.' },
        ],
      },
    ],
  },
  {
    kode: 'L3',
    judul: 'Level 3',
    deskripsi: 'Informasi & alasan sederhana',
    bacaan: [
      {
        id: 'L3-1',
        judul: '雨{あめ}の日曜日{にちようび}',
        teks: '日曜日{にちようび}は雨{あめ}でしたから、公園{こうえん}へ行{い}きませんでした。午前中{ごぜんちゅう}は家{いえ}でそうじをして、午後{ごご}は弟{おとうと}と映画{えいが}を見{み}ました。',
        terjemahan: 'Hari Minggu hujan, jadi saya tidak pergi ke taman. Pagi hari saya bersih-bersih di rumah, lalu sore hari menonton film bersama adik laki-laki.',
        soal: [
          { id: 'L3-1-1', tanya: 'どうして公園{こうえん}へ行{い}きませんでしたか。', tanyaId: 'Mengapa tokoh tidak pergi ke taman?', opsi: ['Karena hujan', 'Karena sakit', 'Karena sibuk bekerja'], benar: 0, pembahasan: '雨でしたから = karena hujan.' },
          { id: 'L3-1-2', tanya: '午後{ごご}、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan pada sore hari?', opsi: ['Bersih-bersih', 'Menonton film', 'Pergi ke taman'], benar: 1, pembahasan: '午後は弟と映画を見ました = sore hari menonton film bersama adik.' },
        ],
      },
      {
        id: 'L3-2',
        judul: '学校{がっこう}のお知{し}らせ',
        teks: '来週{らいしゅう}の月曜日{げつようび}はテストがあります。テストは午前{ごぜん}九時{くじ}から十時{じゅうじ}までです。えんぴつと消{け}しゴムを持{も}ってきてください。',
        terjemahan: 'Senin minggu depan ada ujian. Ujian berlangsung dari pukul 9 sampai 10 pagi. Harap bawa pensil dan penghapus.',
        soal: [
          { id: 'L3-2-1', tanya: 'テストは何時{なんじ}に終{お}わりますか。', tanyaId: 'Pukul berapa ujian selesai?', opsi: ['Pukul 9', 'Pukul 10', 'Pukul 11'], benar: 1, pembahasan: '九時から十時まで = dari pukul 9 sampai pukul 10.' },
          { id: 'L3-2-2', tanya: '何{なに}を持{も}ってきますか。', tanyaId: 'Apa yang harus dibawa?', opsi: ['Pulpen dan buku', 'Pensil dan penghapus', 'Tas dan kamus'], benar: 1, pembahasan: 'えんぴつと消しゴム = pensil dan penghapus.' },
        ],
      },
      {
        id: 'L3-3',
        judul: 'レストラン',
        teks: 'このレストランは魚{さかな}の料理{りょうり}が有名{ゆうめい}です。わたしは魚{さかな}を食{た}べましたが、友{とも}だちは肉{にく}の料理{りょうり}を注文{ちゅうもん}しました。食事{しょくじ}のあとでコーヒーを飲{の}みました。',
        terjemahan: 'Restoran ini terkenal dengan masakan ikan. Saya makan ikan, tetapi teman saya memesan masakan daging. Setelah makan, kami minum kopi.',
        soal: [
          { id: 'L3-3-1', tanya: 'このレストランは何{なに}が有名{ゆうめい}ですか。', tanyaId: 'Restoran ini terkenal karena apa?', opsi: ['Masakan ikan', 'Kue', 'Kopi'], benar: 0, pembahasan: '魚の料理が有名です = terkenal dengan masakan ikan.' },
          { id: 'L3-3-2', tanya: '友{とも}だちは何{なに}を注文{ちゅうもん}しましたか。', tanyaId: 'Apa yang dipesan teman?', opsi: ['Masakan ikan', 'Masakan daging', 'Mi'], benar: 1, pembahasan: '肉の料理を注文しました = memesan masakan daging.' },
        ],
      },
      {
        id: 'L3-4',
        judul: '図書館{としょかん}の時間{じかん}',
        teks: '図書館{としょかん}は月曜日{げつようび}が休{やす}みです。火曜日{かようび}から金曜日{きんようび}までは午前{ごぜん}九時{くじ}から午後{ごご}七時{しちじ}まで開{あ}いています。土曜日{どようび}と日曜日{にちようび}は午後{ごご}五時{ごじ}までです。本{ほん}は五冊{ごさつ}まで借{か}りてもいいです。',
        terjemahan: 'Perpustakaan libur pada hari Senin. Dari Selasa sampai Jumat buka pukul 9 pagi sampai 7 malam. Sabtu dan Minggu sampai pukul 5 sore. Buku boleh dipinjam sampai lima buku.',
        soal: [
          { id: 'L3-4-1', tanya: '図書館{としょかん}が休{やす}みの日{ひ}はいつですか。', tanyaId: 'Kapan perpustakaan libur?', opsi: ['Hari Senin', 'Hari Sabtu', 'Hari Minggu'], benar: 0, pembahasan: '月曜日が休みです = libur hari Senin.' },
          { id: 'L3-4-2', tanya: '土曜日{どようび}は何時{なんじ}までですか。', tanyaId: 'Hari Sabtu buka sampai pukul berapa?', opsi: ['Pukul 5 sore', 'Pukul 7 malam', 'Pukul 9 pagi'], benar: 0, pembahasan: '土曜日と日曜日は午後五時までです = Sabtu dan Minggu sampai pukul 5 sore.' },
        ],
      },
      {
        id: 'L3-5',
        judul: 'かぜ',
        teks: '田中{たなか}さんはかぜをひきましたから、きのうから会社{かいしゃ}を休{やす}んでいます。熱{ねつ}がありますが、あまり高{たか}くないです。あしたは会社{かいしゃ}へ行{い}きたいと言{い}っています。',
        terjemahan: 'Tanaka masuk angin, jadi sejak kemarin ia tidak masuk kerja. Ia demam, tetapi tidak terlalu tinggi. Ia bilang besok ingin pergi ke kantor.',
        soal: [
          { id: 'L3-5-1', tanya: '田中{たなか}さんはどうして会社{かいしゃ}を休{やす}んでいますか。', tanyaId: 'Mengapa Tanaka tidak masuk kerja?', opsi: ['Karena masuk angin', 'Karena sedang liburan', 'Karena keluarganya datang'], benar: 0, pembahasan: 'かぜをひきましたから = karena masuk angin.' },
          { id: 'L3-5-2', tanya: '田中{たなか}さんはあした何{なに}をしたいですか。', tanyaId: 'Apa yang ingin dilakukan Tanaka besok?', opsi: ['Pergi ke rumah sakit', 'Pergi ke kantor', 'Istirahat di rumah'], benar: 1, pembahasan: 'あしたは会社へ行きたいと言っています = besok ingin pergi ke kantor.' },
        ],
      },
      {
        id: 'L3-6',
        judul: 'プールのお知{し}らせ',
        teks: '市{し}のプールは七月{しちがつ}一日{ついたち}から八月{はちがつ}三十一日{さんじゅういちにち}までです。子{こ}どもは二百円{にひゃくえん}、大人{おとな}は五百円{ごひゃくえん}です。プールの中{なか}で食{た}べ物{もの}を食{た}べないでください。',
        terjemahan: 'Kolam renang kota buka dari 1 Juli sampai 31 Agustus. Anak-anak 200 yen, orang dewasa 500 yen. Jangan makan makanan di dalam area kolam renang.',
        soal: [
          { id: 'L3-6-1', tanya: '大人{おとな}はいくらですか。', tanyaId: 'Berapa harga tiket untuk orang dewasa?', opsi: ['200 yen', '500 yen', '700 yen'], benar: 1, pembahasan: '大人は五百円です = orang dewasa 500 yen.' },
          { id: 'L3-6-2', tanya: 'プールの中{なか}で何{なに}をしてはいけませんか。', tanyaId: 'Apa yang tidak boleh dilakukan di area kolam?', opsi: ['Berenang', 'Makan makanan', 'Memakai topi'], benar: 1, pembahasan: '食べ物を食べないでください = jangan makan makanan.' },
        ],
      },
      {
        id: 'L3-7',
        judul: '学校{がっこう}におくれました',
        teks: 'けさ、電車{でんしゃ}がとまりましたから、学校{がっこう}におくれました。教室{きょうしつ}に入{はい}ったとき、もう九時{くじ}十五分{じゅうごふん}でした。先生{せんせい}に「すみません」と言{い}いました。',
        terjemahan: 'Pagi ini kereta berhenti, jadi saya terlambat ke sekolah. Ketika saya masuk kelas, sudah pukul 9.15. Saya berkata "maaf" kepada guru.',
        soal: [
          { id: 'L3-7-1', tanya: 'どうして学校{がっこう}におくれましたか。', tanyaId: 'Mengapa tokoh terlambat ke sekolah?', opsi: ['Karena bangun kesiangan', 'Karena kereta berhenti', 'Karena hujan'], benar: 1, pembahasan: '電車がとまりましたから = karena kereta berhenti.' },
          { id: 'L3-7-2', tanya: '教室{きょうしつ}に入{はい}ったのは何時{なんじ}でしたか。', tanyaId: 'Pukul berapa tokoh masuk kelas?', opsi: ['Pukul 9.00', 'Pukul 9.15', 'Pukul 9.50'], benar: 1, pembahasan: 'もう九時十五分でした = sudah pukul 9.15.' },
        ],
      },
      {
        id: 'L3-8',
        judul: 'パーティーをします',
        teks: '来週{らいしゅう}の土曜日{どようび}、わたしの家{いえ}でパーティーをします。夕方{ゆうがた}六時{ろくじ}からです。飲{の}み物{もの}と食{た}べ物{もの}はわたしが買{か}います。友{とも}だちもいっしょに来{き}てください。',
        terjemahan: 'Sabtu minggu depan saya mengadakan pesta di rumah saya. Mulai pukul enam sore. Minuman dan makanan saya yang beli. Silakan datang bersama teman juga.',
        soal: [
          { id: 'L3-8-1', tanya: 'パーティーは何時{なんじ}からですか。', tanyaId: 'Pesta mulai pukul berapa?', opsi: ['Pukul 5 sore', 'Pukul 6 sore', 'Pukul 7 malam'], benar: 1, pembahasan: '夕方六時からです = mulai pukul enam sore.' },
          { id: 'L3-8-2', tanya: '飲{の}み物{もの}はだれが買{か}いますか。', tanyaId: 'Siapa yang membeli minuman?', opsi: ['Tamu yang datang', 'Penulis (tuan rumah)', 'Teman penulis'], benar: 1, pembahasan: '飲み物と食べ物はわたしが買います = penulis yang membeli.' },
        ],
      },
      {
        id: 'L3-9',
        judul: '宿題{しゅくだい}',
        teks: '今日{きょう}は宿題{しゅくだい}がたくさんありました。英語{えいご}の宿題{しゅくだい}はむずかしかったですから、兄{あに}に聞{き}きました。兄{あに}は英語{えいご}がとても上手{じょうず}です。',
        terjemahan: 'Hari ini ada banyak PR. PR bahasa Inggris sulit, jadi saya bertanya kepada kakak laki-laki. Kakak sangat pandai bahasa Inggris.',
        soal: [
          { id: 'L3-9-1', tanya: 'どうして兄{あに}に聞{き}きましたか。', tanyaId: 'Mengapa tokoh bertanya kepada kakaknya?', opsi: ['Karena PR bahasa Inggris sulit', 'Karena kakaknya guru', 'Karena tidak ada PR'], benar: 0, pembahasan: '英語の宿題はむずかしかったですから = karena PR bahasa Inggris sulit.' },
          { id: 'L3-9-2', tanya: '兄{あに}は何{なに}が上手{じょうず}ですか。', tanyaId: 'Kakak pandai dalam hal apa?', opsi: ['Bahasa Jepang', 'Bahasa Inggris', 'Memasak'], benar: 1, pembahasan: '兄は英語がとても上手です = kakak sangat pandai bahasa Inggris.' },
        ],
      },
      {
        id: 'L3-10',
        judul: 'パン屋{や}のお知{し}らせ',
        teks: '山田{やまだ}パン屋{や}は、来週{らいしゅう}の水曜日{すいようび}と木曜日{もくようび}は休{やす}みです。金曜日{きんようび}からまた開{あ}きます。金曜日{きんようび}は、パンがぜんぶ百円{ひゃくえん}安{やす}くなります。',
        terjemahan: 'Toko Roti Yamada libur hari Rabu dan Kamis minggu depan. Mulai hari Jumat buka lagi. Pada hari Jumat, semua roti menjadi 100 yen lebih murah.',
        soal: [
          { id: 'L3-10-1', tanya: 'パン屋{や}が休{やす}みの日{ひ}はいつですか。', tanyaId: 'Kapan toko roti libur?', opsi: ['Rabu dan Kamis', 'Kamis dan Jumat', 'Sabtu dan Minggu'], benar: 0, pembahasan: '水曜日と木曜日は休みです = libur Rabu dan Kamis.' },
          { id: 'L3-10-2', tanya: '金曜日{きんようび}はどうなりますか。', tanyaId: 'Apa yang terjadi pada hari Jumat?', opsi: ['Toko tetap tutup', 'Semua roti 100 yen lebih murah', 'Hanya roti baru yang dijual'], benar: 1, pembahasan: 'パンがぜんぶ百円安くなります = semua roti 100 yen lebih murah.' },
        ],
      },
    ],
  },
  {
    kode: 'L4',
    judul: 'Level 4',
    deskripsi: 'Jadwal & detail bacaan',
    bacaan: [
      {
        id: 'L4-1',
        judul: '旅行{りょこう}の計画{けいかく}',
        teks: 'わたしたちは来月{らいげつ}、京都{きょうと}へ旅行{りょこう}します。土曜日{どようび}の朝{あさ}、新幹線{しんかんせん}で行{い}って、ホテルに荷物{にもつ}を置{お}きます。それから、お寺{てら}を見{み}に行{い}く予定{よてい}です。日曜日{にちようび}の夕方{ゆうがた}に帰{かえ}ります。',
        terjemahan: 'Bulan depan kami akan berwisata ke Kyoto. Sabtu pagi kami pergi dengan Shinkansen dan meletakkan barang di hotel. Setelah itu, kami berencana melihat kuil. Kami pulang Minggu sore.',
        soal: [
          { id: 'L4-1-1', tanya: '京都{きょうと}へ行{い}くのはいつですか。', tanyaId: 'Kapan mereka pergi ke Kyoto?', opsi: ['Minggu ini', 'Bulan depan', 'Tahun depan'], benar: 1, pembahasan: '来月 = bulan depan.' },
          { id: 'L4-1-2', tanya: 'ホテルに荷物{にもつ}を置{お}いたあと、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan setelah meletakkan barang di hotel?', opsi: ['Makan siang', 'Melihat kuil', 'Pulang ke rumah'], benar: 1, pembahasan: 'それから、お寺を見に行く予定です = setelah itu berencana melihat kuil.' },
        ],
      },
      {
        id: 'L4-2',
        judul: 'アルバイト',
        teks: 'ユキさんは大学{だいがく}の近{ちか}くの喫茶店{きっさてん}でアルバイトをしています。月曜日{げつようび}から金曜日{きんようび}まで、午後{ごご}四時{よじ}から八時{はちじ}まで働{はたら}きます。土曜日{どようび}と日曜日{にちようび}は休{やす}みです。',
        terjemahan: 'Yuki bekerja paruh waktu di kafe dekat universitas. Dari Senin sampai Jumat, ia bekerja pukul 4 sampai 8 sore. Sabtu dan Minggu libur.',
        soal: [
          { id: 'L4-2-1', tanya: 'ユキさんはどこで働{はたら}いていますか。', tanyaId: 'Di mana Yuki bekerja?', opsi: ['Di toko buku', 'Di kafe', 'Di rumah sakit'], benar: 1, pembahasan: '喫茶店 = kedai kopi / kafe.' },
          { id: 'L4-2-2', tanya: 'ユキさんは何曜日{なんようび}が休{やす}みですか。', tanyaId: 'Hari apa Yuki libur?', opsi: ['Sabtu dan Minggu', 'Senin dan Selasa', 'Jumat dan Sabtu'], benar: 0, pembahasan: '土曜日と日曜日は休みです = Sabtu dan Minggu libur.' },
        ],
      },
      {
        id: 'L4-3',
        judul: '忘{わす}れ物{もの}',
        teks: '今朝{けさ}、電車{でんしゃ}の中{なか}にかばんを忘{わす}れました。駅員{えきいん}さんに話{はな}すと、かばんは駅{えき}の事務所{じむしょ}にあると言{い}いました。学校{がっこう}の帰{かえ}りに取{と}りに行{い}きます。',
        terjemahan: 'Pagi ini saya meninggalkan tas di dalam kereta. Ketika saya memberi tahu petugas stasiun, ia mengatakan tas itu ada di kantor stasiun. Saya akan mengambilnya saat pulang dari sekolah.',
        soal: [
          { id: 'L4-3-1', tanya: 'どこにかばんを忘{わす}れましたか。', tanyaId: 'Di mana tas tertinggal?', opsi: ['Di sekolah', 'Di dalam kereta', 'Di kantor'], benar: 1, pembahasan: '電車の中にかばんを忘れました = tas tertinggal di dalam kereta.' },
          { id: 'L4-3-2', tanya: 'いつかばんを取{と}りに行{い}きますか。', tanyaId: 'Kapan tas akan diambil?', opsi: ['Sebelum sekolah', 'Saat istirahat', 'Saat pulang sekolah'], benar: 2, pembahasan: '学校の帰りに = saat pulang dari sekolah.' },
        ],
      },
      {
        id: 'L4-4',
        judul: '今週{こんしゅう}の予定{よてい}',
        teks: '今週{こんしゅう}は忙{いそが}しいです。月曜日{げつようび}と水曜日{すいようび}は日本語{にほんご}の授業{じゅぎょう}があります。木曜日{もくようび}は午後{ごご}三時{さんじ}に病院{びょういん}へ行{い}きます。土曜日{どようび}と日曜日{にちようび}は家{いえ}でゆっくり休{やす}みたいです。',
        terjemahan: 'Minggu ini saya sibuk. Senin dan Rabu ada pelajaran bahasa Jepang. Kamis pukul 3 sore saya pergi ke rumah sakit. Sabtu dan Minggu saya ingin beristirahat dengan santai di rumah.',
        soal: [
          { id: 'L4-4-1', tanya: '日本語{にほんご}の授業{じゅぎょう}は何曜日{なんようび}ですか。', tanyaId: 'Hari apa pelajaran bahasa Jepang?', opsi: ['Senin dan Rabu', 'Selasa dan Kamis', 'Rabu dan Jumat'], benar: 0, pembahasan: '月曜日と水曜日は日本語の授業があります = Senin dan Rabu.' },
          { id: 'L4-4-2', tanya: '木曜日{もくようび}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan hari Kamis?', opsi: ['Belajar bahasa Jepang', 'Pergi ke rumah sakit', 'Beristirahat di rumah'], benar: 1, pembahasan: '木曜日は午後三時に病院へ行きます = Kamis pergi ke rumah sakit.' },
        ],
      },
      {
        id: 'L4-5',
        judul: 'バスの時間{じかん}',
        teks: 'このバスは駅{えき}から大学{だいがく}まで行{い}きます。朝{あさ}は十分{じゅっぷん}に一本{いっぽん}ありますが、昼{ひる}は三十分{さんじゅっぷん}に一本{いっぽん}です。大学{だいがく}まで二十五分{にじゅうごふん}かかります。',
        terjemahan: 'Bus ini pergi dari stasiun ke universitas. Pagi hari ada satu bus setiap 10 menit, tetapi siang hari satu bus setiap 30 menit. Sampai ke universitas memakan waktu 25 menit.',
        soal: [
          { id: 'L4-5-1', tanya: '昼{ひる}は何分{なんぷん}に一本{いっぽん}バスがありますか。', tanyaId: 'Siang hari ada bus setiap berapa menit?', opsi: ['Setiap 10 menit', 'Setiap 25 menit', 'Setiap 30 menit'], benar: 2, pembahasan: '昼は三十分に一本です = siang hari satu bus setiap 30 menit.' },
          { id: 'L4-5-2', tanya: '駅{えき}から大学{だいがく}まで何分{なんぷん}かかりますか。', tanyaId: 'Berapa lama dari stasiun ke universitas?', opsi: ['10 menit', '25 menit', '30 menit'], benar: 1, pembahasan: '大学まで二十五分かかります = 25 menit.' },
        ],
      },
      {
        id: 'L4-6',
        judul: '新{あたら}しいアパート',
        teks: '先月{せんげつ}から新{あたら}しいアパートに住{す}んでいます。前{まえ}のアパートより駅{えき}に近{ちか}くて、歩{ある}いて五分{ごふん}です。でも、部屋{へや}は少{すこ}しせまいです。このアパートは一{いっ}か月{げつ}六万円{ろくまんえん}です。',
        terjemahan: 'Sejak bulan lalu saya tinggal di apartemen baru. Lebih dekat ke stasiun daripada apartemen lama, lima menit jalan kaki. Tetapi kamarnya agak sempit. Apartemen ini 60.000 yen per bulan.',
        soal: [
          { id: 'L4-6-1', tanya: '新{あたら}しいアパートから駅{えき}までどのぐらいですか。', tanyaId: 'Seberapa jauh dari apartemen baru ke stasiun?', opsi: ['5 menit jalan kaki', '15 menit jalan kaki', '5 menit naik bus'], benar: 0, pembahasan: '歩いて五分です = lima menit jalan kaki.' },
          { id: 'L4-6-2', tanya: '新{あたら}しいアパートはどうですか。', tanyaId: 'Bagaimana apartemen baru itu?', opsi: ['Dekat stasiun, tetapi kamarnya agak sempit', 'Jauh dari stasiun, tetapi luas', 'Murah dan luas'], benar: 0, pembahasan: '駅に近くて…でも、部屋は少しせまいです = dekat stasiun, tetapi kamarnya agak sempit.' },
        ],
      },
      {
        id: 'L4-7',
        judul: '電話{でんわ}のメッセージ',
        teks: '「もしもし、リンです。今日{きょう}の映画{えいが}は七時{しちじ}からですね。わたしは仕事{しごと}が六時半{ろくじはん}に終{お}わりますから、映画館{えいがかん}の前{まえ}で六時{ろくじ}五十分{ごじゅっぷん}に会{あ}いましょう。」',
        terjemahan: '"Halo, ini Rin. Film hari ini mulai pukul tujuh, ya. Pekerjaan saya selesai pukul setengah tujuh, jadi mari bertemu di depan bioskop pukul 6.50."',
        soal: [
          { id: 'L4-7-1', tanya: 'リンさんの仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Pukul berapa pekerjaan Rin selesai?', opsi: ['Pukul 6.00', 'Pukul 6.30', 'Pukul 7.00'], benar: 1, pembahasan: '六時半 = pukul setengah tujuh (6.30).' },
          { id: 'L4-7-2', tanya: '二人{ふたり}はどこで会{あ}いますか。', tanyaId: 'Di mana mereka akan bertemu?', opsi: ['Di depan bioskop', 'Di stasiun', 'Di kantor Rin'], benar: 0, pembahasan: '映画館の前で会いましょう = bertemu di depan bioskop.' },
        ],
      },
      {
        id: 'L4-8',
        judul: '学校{がっこう}の旅行{りょこう}',
        teks: '来月{らいげつ}、学校{がっこう}の旅行{りょこう}で海{うみ}へ行{い}きます。朝{あさ}八時{はちじ}に学校{がっこう}の前{まえ}にあつまって、バスで行{い}きます。昼{ひる}ごはんはお弁当{べんとう}を持{も}っていきます。水着{みずぎ}とタオルもわすれないでください。',
        terjemahan: 'Bulan depan, dalam wisata sekolah, kami pergi ke laut. Kami berkumpul di depan sekolah pukul 8 pagi dan pergi naik bus. Untuk makan siang, kami membawa bekal. Jangan lupa baju renang dan handuk.',
        soal: [
          { id: 'L4-8-1', tanya: '何時{なんじ}に、どこにあつまりますか。', tanyaId: 'Pukul berapa dan di mana berkumpul?', opsi: ['Pukul 8 di depan sekolah', 'Pukul 8 di stasiun', 'Pukul 9 di depan sekolah'], benar: 0, pembahasan: '朝八時に学校の前にあつまって = berkumpul pukul 8 di depan sekolah.' },
          { id: 'L4-8-2', tanya: '昼{ひる}ごはんはどうしますか。', tanyaId: 'Bagaimana dengan makan siang?', opsi: ['Membeli di restoran', 'Membawa bekal', 'Makan di sekolah'], benar: 1, pembahasan: '昼ごはんはお弁当を持っていきます = membawa bekal.' },
        ],
      },
      {
        id: 'L4-9',
        judul: 'アルバイトがしたいです',
        teks: 'わたしは一週間{いっしゅうかん}に三日{みっか}アルバイトをしたいです。授業{じゅぎょう}は午後{ごご}三時{さんじ}に終{お}わりますから、月曜日{げつようび}から金曜日{きんようび}までは四時{よじ}からできます。土曜日{どようび}は朝{あさ}からでもいいです。日曜日{にちようび}は家族{かぞく}と出{で}かけますから、できません。',
        terjemahan: 'Saya ingin kerja paruh waktu tiga hari dalam seminggu. Pelajaran selesai pukul 3 sore, jadi Senin sampai Jumat saya bisa mulai pukul 4. Hari Sabtu boleh mulai pagi. Hari Minggu saya pergi bersama keluarga, jadi tidak bisa.',
        soal: [
          { id: 'L4-9-1', tanya: '月曜日{げつようび}から金曜日{きんようび}までは何時{なんじ}からアルバイトができますか。', tanyaId: 'Senin–Jumat bisa kerja mulai pukul berapa?', opsi: ['Pukul 3', 'Pukul 4', 'Pagi hari'], benar: 1, pembahasan: '月曜日から金曜日までは四時からできます = mulai pukul 4.' },
          { id: 'L4-9-2', tanya: 'どうして日曜日{にちようび}はできませんか。', tanyaId: 'Mengapa tidak bisa hari Minggu?', opsi: ['Karena ada pelajaran', 'Karena pergi bersama keluarga', 'Karena tokonya tutup'], benar: 1, pembahasan: '日曜日は家族と出かけますから = karena pergi bersama keluarga.' },
        ],
      },
      {
        id: 'L4-10',
        judul: '料理{りょうり}教室{きょうしつ}',
        teks: '駅{えき}の近{ちか}くに料理{りょうり}教室{きょうしつ}があります。毎週{まいしゅう}金曜日{きんようび}の夜{よる}七時{しちじ}から九時{くじ}まで、日本{にほん}の料理{りょうり}を作{つく}ります。一回{いっかい}二千円{にせんえん}です。エプロンを持{も}ってきてください。',
        terjemahan: 'Di dekat stasiun ada kelas memasak. Setiap Jumat malam pukul 7 sampai 9, peserta memasak masakan Jepang. Sekali datang 2.000 yen. Harap bawa celemek.',
        soal: [
          { id: 'L4-10-1', tanya: '料理{りょうり}教室{きょうしつ}は何時間{なんじかん}ですか。', tanyaId: 'Berapa jam kelas memasaknya?', opsi: ['1 jam', '2 jam', '3 jam'], benar: 1, pembahasan: '七時から九時まで = dari pukul 7 sampai 9, jadi 2 jam.' },
          { id: 'L4-10-2', tanya: '何{なに}を持{も}っていきますか。', tanyaId: 'Apa yang harus dibawa?', opsi: ['Celemek', 'Bahan makanan', 'Pisau'], benar: 0, pembahasan: 'エプロンを持ってきてください = harap bawa celemek.' },
        ],
      },
    ],
  },
  {
    kode: 'L5',
    judul: 'Level 5',
    deskripsi: 'Bacaan lebih panjang & simpulan',
    bacaan: [
      {
        id: 'L5-1',
        judul: '町{まち}の新{あたら}しい図書館{としょかん}',
        teks: 'わたしの町{まち}に新{あたら}しい図書館{としょかん}ができました。前{まえ}の図書館{としょかん}より大{おお}きくて、勉強{べんきょう}する部屋{へや}もあります。日曜日{にちようび}には子{こ}どものための本{ほん}の読{よ}み聞{き}かせがあります。わたしは来週{らいしゅう}、妹{いもうと}と行{い}こうと思{おも}っています。',
        terjemahan: 'Di kota saya telah dibuka perpustakaan baru. Tempat itu lebih besar daripada perpustakaan lama dan juga memiliki ruang belajar. Pada hari Minggu ada kegiatan membacakan buku untuk anak-anak. Minggu depan saya berencana pergi bersama adik perempuan.',
        soal: [
          { id: 'L5-1-1', tanya: '新{あたら}しい図書館{としょかん}は前{まえ}の図書館{としょかん}とどう違{ちが}いますか。', tanyaId: 'Apa perbedaan perpustakaan baru dengan yang lama?', opsi: ['Lebih kecil', 'Lebih besar dan punya ruang belajar', 'Hanya buka malam hari'], benar: 1, pembahasan: '大きくて、勉強する部屋もあります = lebih besar dan ada ruang belajar.' },
          { id: 'L5-1-2', tanya: 'わたしは来週{らいしゅう}、何{なに}をしようと思{おも}っていますか。', tanyaId: 'Apa rencana penulis minggu depan?', opsi: ['Pergi ke perpustakaan bersama adik perempuan', 'Membaca buku di rumah', 'Pergi ke perpustakaan bersama guru'], benar: 0, pembahasan: '来週、妹と行こうと思っています = minggu depan berencana pergi bersama adik perempuan.' },
        ],
      },
      {
        id: 'L5-2',
        judul: '料理{りょうり}を作{つく}る日{ひ}',
        teks: '先週{せんしゅう}の日曜日{にちようび}、家族{かぞく}みんなでカレーを作{つく}りました。父{ちち}は野菜{やさい}を切{き}り、母{はは}は肉{にく}をいためました。わたしと弟{おとうと}はテーブルを準備{じゅんび}しました。少{すこ}し時間{じかん}がかかりましたが、みんなで作{つく}ったので、いつもよりおいしく感{かん}じました。',
        terjemahan: 'Minggu lalu, seluruh keluarga membuat kari bersama. Ayah memotong sayuran dan ibu menumis daging. Saya dan adik laki-laki menyiapkan meja. Walaupun memakan sedikit waktu, karena dibuat bersama-sama, rasanya lebih enak daripada biasanya.',
        soal: [
          { id: 'L5-2-1', tanya: 'わたしと弟{おとうと}は何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan penulis dan adiknya?', opsi: ['Memotong sayuran', 'Menumis daging', 'Menyiapkan meja'], benar: 2, pembahasan: 'テーブルを準備しました = menyiapkan meja.' },
          { id: 'L5-2-2', tanya: 'カレーがいつもよりおいしかったのはどうしてですか。', tanyaId: 'Mengapa kari terasa lebih enak dari biasanya?', opsi: ['Karena dibeli di restoran', 'Karena dibuat bersama keluarga', 'Karena tidak memakai sayuran'], benar: 1, pembahasan: 'みんなで作ったので = karena dibuat bersama-sama.' },
        ],
      },
      {
        id: 'L5-3',
        judul: '雨{あめ}の日{ひ}の約束{やくそく}',
        teks: 'アキさんと動物園{どうぶつえん}へ行{い}く約束{やくそく}をしましたが、朝{あさ}から雨{あめ}が降{ふ}っていました。アキさんに電話{でんわ}すると、「動物園{どうぶつえん}はやめて、駅{えき}の近{ちか}くの美術館{びじゅつかん}に行{い}きませんか」と言{い}いました。美術館{びじゅつかん}では日本{にほん}の昔{むかし}の絵{え}を見{み}ることができました。雨{あめ}でしたが、楽{たの}しい一日{いちにち}になりました。',
        terjemahan: 'Saya berjanji pergi ke kebun binatang dengan Aki, tetapi sejak pagi turun hujan. Ketika saya menelepon Aki, ia berkata, "Bagaimana kalau batal ke kebun binatang dan pergi ke museum seni dekat stasiun?" Di museum kami bisa melihat lukisan Jepang zaman dulu. Walaupun hujan, hari itu menjadi menyenangkan.',
        soal: [
          { id: 'L5-3-1', tanya: '二人{ふたり}はどうして動物園{どうぶつえん}へ行{い}きませんでしたか。', tanyaId: 'Mengapa mereka tidak pergi ke kebun binatang?', opsi: ['Karena hujan', 'Karena kebun binatang tutup', 'Karena tidak punya tiket'], benar: 0, pembahasan: '朝から雨が降っていました = sejak pagi turun hujan.' },
          { id: 'L5-3-2', tanya: '二人{ふたり}はどこへ行{い}きましたか。', tanyaId: 'Ke mana mereka pergi?', opsi: ['Ke perpustakaan', 'Ke museum seni', 'Ke pusat perbelanjaan'], benar: 1, pembahasan: '駅の近くの美術館に行きませんか → mereka pergi ke museum seni dekat stasiun.' },
        ],
      },
      {
        id: 'L5-4',
        judul: '先生{せんせい}へのメール',
        teks: '山田{やまだ}先生{せんせい}、こんにちは。リナです。来週{らいしゅう}の月曜日{げつようび}は、国{くに}から母{はは}が来{き}ますから、空港{くうこう}へ迎{むか}えに行{い}きます。ですから、授業{じゅぎょう}を休{やす}みます。宿題{しゅくだい}は火曜日{かようび}に出{だ}してもいいですか。よろしくお願{ねが}いします。',
        terjemahan: 'Pak/Bu Yamada, selamat siang. Ini Rina. Senin minggu depan ibu saya datang dari negara asal, jadi saya akan menjemputnya di bandara. Karena itu, saya tidak masuk kelas. Bolehkah PR saya serahkan hari Selasa? Terima kasih.',
        soal: [
          { id: 'L5-4-1', tanya: 'リナさんはどうして月曜日{げつようび}に授業{じゅぎょう}を休{やす}みますか。', tanyaId: 'Mengapa Rina tidak masuk kelas hari Senin?', opsi: ['Karena sakit', 'Karena menjemput ibunya di bandara', 'Karena pulang ke negaranya'], benar: 1, pembahasan: '母が来ますから、空港へ迎えに行きます = ibunya datang, jadi ia menjemput di bandara.' },
          { id: 'L5-4-2', tanya: 'リナさんは先生{せんせい}に何{なに}を聞{き}いていますか。', tanyaId: 'Apa yang ditanyakan Rina kepada guru?', opsi: ['Apakah PR boleh diserahkan hari Selasa', 'Apakah ibunya boleh ikut kelas', 'Kapan ujian berikutnya'], benar: 0, pembahasan: '宿題は火曜日に出してもいいですか = bolehkah PR diserahkan hari Selasa?' },
        ],
      },
      {
        id: 'L5-5',
        judul: 'わたしのしゅみ',
        teks: 'わたしのしゅみは写真{しゃしん}をとることです。休{やす}みの日{ひ}は、カメラを持{も}って山{やま}や海{うみ}へ行{い}きます。花{はな}や鳥{とり}の写真{しゃしん}が好{す}きです。去年{きょねん}、町{まち}のコンテストで一番{いちばん}になりました。今{いま}は新{あたら}しいカメラがほしいです。',
        terjemahan: 'Hobi saya memotret. Pada hari libur saya membawa kamera ke gunung atau laut. Saya suka foto bunga dan burung. Tahun lalu saya menjadi juara satu di lomba kota. Sekarang saya ingin kamera baru.',
        soal: [
          { id: 'L5-5-1', tanya: '休{やす}みの日{ひ}、この人{ひと}はどこへ行{い}きますか。', tanyaId: 'Ke mana orang ini pergi pada hari libur?', opsi: ['Ke gunung atau laut', 'Ke museum', 'Ke toko kamera'], benar: 0, pembahasan: 'カメラを持って山や海へ行きます = membawa kamera ke gunung atau laut.' },
          { id: 'L5-5-2', tanya: 'この人{ひと}は今{いま}、何{なに}がほしいですか。', tanyaId: 'Apa yang diinginkan orang ini sekarang?', opsi: ['Kamera baru', 'Album foto', 'Komputer baru'], benar: 0, pembahasan: '今は新しいカメラがほしいです = sekarang ingin kamera baru.' },
        ],
      },
      {
        id: 'L5-6',
        judul: 'はじめての雪{ゆき}',
        teks: 'わたしはインドネシアから来{き}ました。去年{きょねん}の十二月{じゅうにがつ}、はじめて雪{ゆき}を見{み}ました。とてもきれいでしたが、とても寒{さむ}かったです。インドネシアは一年中{いちねんじゅう}暑{あつ}いですから、冬{ふゆ}の服{ふく}を持{も}っていませんでした。友{とも}だちといっしょにデパートへ厚{あつ}いコートを買{か}いに行{い}きました。',
        terjemahan: 'Saya datang dari Indonesia. Bulan Desember tahun lalu, saya melihat salju untuk pertama kali. Sangat indah, tetapi sangat dingin. Indonesia panas sepanjang tahun, jadi saya tidak punya pakaian musim dingin. Saya pergi ke department store bersama teman untuk membeli mantel tebal.',
        soal: [
          { id: 'L5-6-1', tanya: 'この人{ひと}はいつはじめて雪{ゆき}を見{み}ましたか。', tanyaId: 'Kapan orang ini pertama kali melihat salju?', opsi: ['Desember tahun lalu', 'Januari tahun ini', 'Desember tahun ini'], benar: 0, pembahasan: '去年の十二月、はじめて雪を見ました = Desember tahun lalu.' },
          { id: 'L5-6-2', tanya: 'どうしてデパートへ行{い}きましたか。', tanyaId: 'Mengapa ia pergi ke department store?', opsi: ['Untuk membeli mantel tebal', 'Untuk bertemu teman', 'Untuk membeli hadiah'], benar: 0, pembahasan: '厚いコートを買いに行きました = pergi untuk membeli mantel tebal.' },
        ],
      },
      {
        id: 'L5-7',
        judul: 'おばあさんの誕生日{たんじょうび}',
        teks: '来週{らいしゅう}の日曜日{にちようび}はおばあさんの八十歳{はちじゅっさい}の誕生日{たんじょうび}です。家族{かぞく}みんなでレストランで食事{しょくじ}をします。わたしは花{はな}をプレゼントしたいと思{おも}っています。姉{あね}はケーキを作{つく}ります。おばあさんは甘{あま}いものが大好{だいす}きですから、きっとよろこぶと思{おも}います。',
        terjemahan: 'Minggu depan hari ulang tahun ke-80 nenek. Seluruh keluarga akan makan di restoran. Saya ingin memberi hadiah bunga. Kakak perempuan akan membuat kue. Nenek sangat suka makanan manis, jadi saya rasa ia pasti senang.',
        soal: [
          { id: 'L5-7-1', tanya: 'おばあさんは何歳{なんさい}になりますか。', tanyaId: 'Nenek akan berumur berapa?', opsi: ['70 tahun', '80 tahun', '88 tahun'], benar: 1, pembahasan: '八十歳の誕生日 = ulang tahun ke-80.' },
          { id: 'L5-7-2', tanya: '姉{あね}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan kakak perempuan?', opsi: ['Membeli bunga', 'Membuat kue', 'Memesan restoran'], benar: 1, pembahasan: '姉はケーキを作ります = kakak membuat kue.' },
        ],
      },
      {
        id: 'L5-8',
        judul: 'わたしの家{いえ}までの道{みち}',
        teks: '駅{えき}の北口{きたぐち}を出{で}て、まっすぐ行{い}ってください。二{ふた}つ目{め}のかどを右{みぎ}にまがってください。左{ひだり}に郵便局{ゆうびんきょく}があります。郵便局{ゆうびんきょく}のとなりの白{しろ}いアパートがわたしの家{いえ}です。部屋{へや}は三階{さんがい}のいちばん右{みぎ}です。',
        terjemahan: 'Keluar dari pintu utara stasiun, lalu jalan lurus. Belok kanan di tikungan kedua. Di sebelah kiri ada kantor pos. Apartemen putih di sebelah kantor pos adalah rumah saya. Kamarnya di lantai tiga, paling kanan.',
        soal: [
          { id: 'L5-8-1', tanya: '二{ふた}つ目{め}のかどでどうしますか。', tanyaId: 'Apa yang dilakukan di tikungan kedua?', opsi: ['Belok kanan', 'Belok kiri', 'Jalan lurus'], benar: 0, pembahasan: '二つ目のかどを右にまがってください = belok kanan di tikungan kedua.' },
          { id: 'L5-8-2', tanya: 'わたしの家{いえ}はどれですか。', tanyaId: 'Rumah penulis yang mana?', opsi: ['Apartemen putih di sebelah kantor pos', 'Gedung di depan stasiun', 'Rumah di belakang kantor pos'], benar: 0, pembahasan: '郵便局のとなりの白いアパートがわたしの家です。' },
        ],
      },
      {
        id: 'L5-9',
        judul: '二{ふた}つの店{みせ}',
        teks: '駅{えき}の前{まえ}に店{みせ}が二{ふた}つあります。Aの店{みせ}は安{やす}いですが、いつも人{ひと}が多{おお}くて、レジで長{なが}く待{ま}ちます。Bの店{みせ}は少{すこ}し高{たか}いですが、野菜{やさい}や肉{にく}がとても新{あたら}しいです。わたしは時間{じかん}がない日{ひ}はBの店{みせ}で、休{やす}みの日{ひ}はAの店{みせ}で買{か}い物{もの}をします。',
        terjemahan: 'Di depan stasiun ada dua toko. Toko A murah, tetapi selalu ramai dan harus menunggu lama di kasir. Toko B agak mahal, tetapi sayuran dan dagingnya sangat segar. Pada hari ketika saya tidak punya waktu, saya berbelanja di toko B, dan pada hari libur di toko A.',
        soal: [
          { id: 'L5-9-1', tanya: 'Aの店{みせ}はどんな店{みせ}ですか。', tanyaId: 'Toko A toko seperti apa?', opsi: ['Murah tetapi ramai', 'Mahal tetapi segar', 'Murah dan sepi'], benar: 0, pembahasan: 'Aの店は安いですが、いつも人が多くて = murah tetapi selalu ramai.' },
          { id: 'L5-9-2', tanya: '休{やす}みの日{ひ}、わたしはどこで買{か}い物{もの}をしますか。', tanyaId: 'Pada hari libur penulis berbelanja di mana?', opsi: ['Di toko A', 'Di toko B', 'Di supermarket dekat rumah'], benar: 0, pembahasan: '休みの日はAの店で買い物をします = pada hari libur di toko A.' },
        ],
      },
      {
        id: 'L5-10',
        judul: '日本語{にほんご}の勉強{べんきょう}',
        teks: 'わたしは日本{にほん}で働{はたら}きたいですから、毎日{まいにち}日本語{にほんご}を勉強{べんきょう}しています。朝{あさ}は三十分{さんじゅっぷん}ぐらい新{あたら}しい言葉{ことば}を覚{おぼ}えます。夜{よる}は日本{にほん}のドラマを見{み}ます。はじめはぜんぜんわかりませんでしたが、今{いま}は少{すこ}しわかります。来年{らいねん}、N4の試験{しけん}を受{う}けたいです。',
        terjemahan: 'Saya ingin bekerja di Jepang, jadi setiap hari saya belajar bahasa Jepang. Pagi hari saya menghafal kosakata baru sekitar 30 menit. Malam hari saya menonton drama Jepang. Awalnya saya sama sekali tidak mengerti, tetapi sekarang saya sedikit mengerti. Tahun depan saya ingin mengikuti ujian N4.',
        soal: [
          { id: 'L5-10-1', tanya: 'どうして毎日{まいにち}日本語{にほんご}を勉強{べんきょう}していますか。', tanyaId: 'Mengapa ia belajar bahasa Jepang setiap hari?', opsi: ['Karena ingin bekerja di Jepang', 'Karena suka drama Jepang', 'Karena ada ujian minggu depan'], benar: 0, pembahasan: '日本で働きたいですから = karena ingin bekerja di Jepang.' },
          { id: 'L5-10-2', tanya: '夜{よる}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pada malam hari?', opsi: ['Menghafal kosakata baru', 'Menonton drama Jepang', 'Mengikuti ujian'], benar: 1, pembahasan: '夜は日本のドラマを見ます = malam hari menonton drama Jepang.' },
        ],
      },
    ],
  },
];
