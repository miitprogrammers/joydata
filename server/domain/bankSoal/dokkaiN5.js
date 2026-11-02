// Bank soal dokkai N5 (Tes Online): 5 level × 3 bacaan × 2 soal, disempurnakan dari quiz_dokkai_n5_5_level.html.
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
    ],
  },
];
