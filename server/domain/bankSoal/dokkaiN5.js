// Bank soal dokkai N5 (Tes Online): 5 level × 20 bacaan × 2 soal. Bacaan 1–3 tiap level disempurnakan dari
// quiz_dokkai_n5_5_level.html, bacaan 4–20 ditulis baru (tata bahasa N5, topik sehari-hari dan kerja di Jepang).
// Furigana ditulis langsung setelah kanjinya: 毎朝{まいあさ} → <ruby>毎朝<rt>まいあさ</rt></ruby>.
// Pertanyaan dan pilihan jawaban dalam bahasa Jepang (furigana dengan format yang sama). `tanyaId` = terjemahan
// pertanyaan, hanya tampil di pembahasan setelah tes. `benar` = indeks pilihan yang benar.

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
          { id: 'L1-1-1', tanya: '何時{なんじ}に起{お}きますか。', tanyaId: 'Pukul berapa tokoh bangun?', opsi: ['五時{ごじ}', '六時{ろくじ}', '七時{しちじ}'], benar: 1, pembahasan: '毎朝六時に起きます = setiap pagi bangun pukul enam.' },
          { id: 'L1-1-2', tanya: '朝{あさ}ごはんに何{なに}を食{た}べますか。', tanyaId: 'Apa yang dimakan saat sarapan?', opsi: ['ごはんと魚{さかな}', 'パンとたまご', 'くだものと牛乳{ぎゅうにゅう}'], benar: 1, pembahasan: 'パンとたまご = roti dan telur.' },
        ],
      },
      {
        id: 'L1-2',
        judul: '家族{かぞく}',
        teks: 'わたしの家族{かぞく}は四人{よにん}です。父{ちち}と母{はは}と妹{いもうと}とわたしです。妹{いもうと}は十歳{じゅっさい}で、わたしより小{ちい}さいです。',
        terjemahan: 'Keluarga saya terdiri dari empat orang: ayah, ibu, adik perempuan, dan saya. Adik perempuan berusia sepuluh tahun dan lebih kecil daripada saya.',
        soal: [
          { id: 'L1-2-1', tanya: '家族{かぞく}は何人{なんにん}ですか。', tanyaId: 'Ada berapa orang dalam keluarga?', opsi: ['三人{さんにん}', '四人{よにん}', '五人{ごにん}'], benar: 1, pembahasan: '家族は四人です = keluarga terdiri dari empat orang.' },
          { id: 'L1-2-2', tanya: '妹{いもうと}は何歳{なんさい}ですか。', tanyaId: 'Berapa umur adik perempuan?', opsi: ['八歳{はっさい}', '九歳{きゅうさい}', '十歳{じゅっさい}'], benar: 2, pembahasan: '妹は十歳 = adik perempuan berumur sepuluh tahun.' },
        ],
      },
      {
        id: 'L1-3',
        judul: '好{す}きな食{た}べ物{もの}',
        teks: '田中{たなか}さんはりんごが好{す}きです。でも、バナナはあまり好{す}きではありません。毎週{まいしゅう}日曜日{にちようび}にりんごを買{か}います。',
        terjemahan: 'Tanaka suka apel. Namun, ia tidak terlalu suka pisang. Setiap hari Minggu ia membeli apel.',
        soal: [
          { id: 'L1-3-1', tanya: '田中{たなか}さんは何{なに}が好{す}きですか。', tanyaId: 'Apa yang disukai Tanaka?', opsi: ['りんご', 'バナナ', 'みかん'], benar: 0, pembahasan: 'りんごが好きです = suka apel.' },
          { id: 'L1-3-2', tanya: 'いつりんごを買{か}いますか。', tanyaId: 'Kapan Tanaka membeli apel?', opsi: ['毎週{まいしゅう}土曜日{どようび}', '毎週{まいしゅう}日曜日{にちようび}', '毎週{まいしゅう}月曜日{げつようび}'], benar: 1, pembahasan: '毎週日曜日に = setiap hari Minggu.' },
        ],
      },
      {
        id: 'L1-4',
        judul: 'わたしの部屋{へや}',
        teks: 'わたしの部屋{へや}は二階{にかい}にあります。部屋{へや}にはつくえといすがあります。まどのそばにベッドがあります。',
        terjemahan: 'Kamar saya ada di lantai dua. Di kamar ada meja dan kursi. Di dekat jendela ada tempat tidur.',
        soal: [
          { id: 'L1-4-1', tanya: 'わたしの部屋{へや}は何階{なんがい}にありますか。', tanyaId: 'Kamar penulis ada di lantai berapa?', opsi: ['一階{いっかい}', '二階{にかい}', '三階{さんがい}'], benar: 1, pembahasan: '部屋は二階にあります = kamar ada di lantai dua.' },
          { id: 'L1-4-2', tanya: 'まどのそばに何{なに}がありますか。', tanyaId: 'Apa yang ada di dekat jendela?', opsi: ['つくえ', 'いす', 'ベッド'], benar: 2, pembahasan: 'まどのそばにベッドがあります = di dekat jendela ada tempat tidur.' },
        ],
      },
      {
        id: 'L1-5',
        judul: '友{とも}だちのアンナさん',
        teks: 'アンナさんはわたしの友{とも}だちです。アメリカ人{じん}で、日本語{にほんご}の学生{がくせい}です。アンナさんは毎日{まいにち}バスで学校{がっこう}へ来{き}ます。',
        terjemahan: 'Anna adalah teman saya. Ia orang Amerika dan pelajar bahasa Jepang. Anna datang ke sekolah naik bus setiap hari.',
        soal: [
          { id: 'L1-5-1', tanya: 'アンナさんはどこの国{くに}の人{ひと}ですか。', tanyaId: 'Anna orang dari negara mana?', opsi: ['日本{にほん}', 'アメリカ', 'インドネシア'], benar: 1, pembahasan: 'アメリカ人 = orang Amerika.' },
          { id: 'L1-5-2', tanya: 'アンナさんは何{なに}で学校{がっこう}へ来{き}ますか。', tanyaId: 'Anna datang ke sekolah naik apa?', opsi: ['バス', '電車{でんしゃ}', '自転車{じてんしゃ}'], benar: 0, pembahasan: 'バスで来ます = datang naik bus.' },
        ],
      },
      {
        id: 'L1-6',
        judul: 'わたしのかばん',
        teks: 'これはわたしのかばんです。かばんの中{なか}に本{ほん}が二冊{にさつ}とペンが三本{さんぼん}あります。このかばんは黒{くろ}くて、大{おお}きいです。',
        terjemahan: 'Ini tas saya. Di dalam tas ada dua buku dan tiga pena. Tas ini hitam dan besar.',
        soal: [
          { id: 'L1-6-1', tanya: 'かばんの中{なか}にペンは何本{なんぼん}ありますか。', tanyaId: 'Ada berapa pena di dalam tas?', opsi: ['二本{にほん}', '三本{さんぼん}', '四本{よんほん}'], benar: 1, pembahasan: 'ペンが三本 = tiga pena.' },
          { id: 'L1-6-2', tanya: 'どんなかばんですか。', tanyaId: 'Tas itu seperti apa?', opsi: ['黒{くろ}くて大{おお}きいかばん', '白{しろ}くて小{ちい}さいかばん', '赤{あか}くて大{おお}きいかばん'], benar: 0, pembahasan: '黒くて、大きいです = hitam dan besar.' },
        ],
      },
      {
        id: 'L1-7',
        judul: '今日{きょう}の天気{てんき}',
        teks: '今日{きょう}は天気{てんき}がいいです。あまり暑{あつ}くないです。午後{ごご}、友{とも}だちと公園{こうえん}へ行{い}きます。',
        terjemahan: 'Hari ini cuacanya bagus. Tidak terlalu panas. Sore nanti saya pergi ke taman bersama teman.',
        soal: [
          { id: 'L1-7-1', tanya: '今日{きょう}の天気{てんき}はどうですか。', tanyaId: 'Bagaimana cuaca hari ini?', opsi: ['雨{あめ}です', '天気{てんき}がよくて、あまり暑{あつ}くないです', 'とても暑{あつ}いです'], benar: 1, pembahasan: '天気がいいです。あまり暑くないです = cuacanya bagus, tidak terlalu panas.' },
          { id: 'L1-7-2', tanya: '午後{ごご}、どこへ行{い}きますか。', tanyaId: 'Ke mana tokoh pergi sore nanti?', opsi: ['公園{こうえん}', '学校{がっこう}', '店{みせ}'], benar: 0, pembahasan: '公園へ行きます = pergi ke taman.' },
        ],
      },
      {
        id: 'L1-8',
        judul: 'うちのねこ',
        teks: 'うちにねこが一匹{いっぴき}います。名前{なまえ}はタマです。タマは白{しろ}いねこです。毎日{まいにち}よく寝{ね}ます。',
        terjemahan: 'Di rumah ada seekor kucing. Namanya Tama. Tama adalah kucing putih. Setiap hari ia banyak tidur.',
        soal: [
          { id: 'L1-8-1', tanya: 'ねこの名前{なまえ}は何{なん}ですか。', tanyaId: 'Siapa nama kucingnya?', opsi: ['タマ', 'ポチ', 'ミカ'], benar: 0, pembahasan: '名前はタマです = namanya Tama.' },
          { id: 'L1-8-2', tanya: 'タマはどんなねこですか。', tanyaId: 'Tama kucing seperti apa?', opsi: ['黒{くろ}いねこ', '白{しろ}いねこ', '茶色{ちゃいろ}のねこ'], benar: 1, pembahasan: '白いねこです = kucing putih.' },
        ],
      },
      {
        id: 'L1-9',
        judul: 'わたしの日曜日{にちようび}',
        teks: 'わたしは日曜日{にちようび}に料理{りょうり}をします。日曜日{にちようび}の夜{よる}は家族{かぞく}といっしょにテレビを見{み}ます。月曜日{げつようび}の朝{あさ}は早{はや}く起{お}きます。',
        terjemahan: 'Saya memasak pada hari Minggu. Minggu malam saya menonton TV bersama keluarga. Senin pagi saya bangun pagi-pagi.',
        soal: [
          { id: 'L1-9-1', tanya: '日曜日{にちようび}の夜{よる}、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pada Minggu malam?', opsi: ['料理{りょうり}をします', '家族{かぞく}といっしょにテレビを見{み}ます', '勉強{べんきょう}をします'], benar: 1, pembahasan: '日曜日の夜は家族といっしょにテレビを見ます。' },
          { id: 'L1-9-2', tanya: 'いつ早{はや}く起{お}きますか。', tanyaId: 'Kapan tokoh bangun pagi-pagi?', opsi: ['日曜日{にちようび}の朝{あさ}', '月曜日{げつようび}の朝{あさ}', '土曜日{どようび}の朝{あさ}'], benar: 1, pembahasan: '月曜日の朝は早く起きます = Senin pagi bangun pagi-pagi.' },
        ],
      },
      {
        id: 'L1-10',
        judul: 'わたしの町{まち}',
        teks: 'わたしの町{まち}は小{ちい}さいです。でも、きれいな川{かわ}があります。駅{えき}の前{まえ}に大{おお}きいスーパーがあります。',
        terjemahan: 'Kota saya kecil. Tetapi ada sungai yang indah. Di depan stasiun ada supermarket besar.',
        soal: [
          { id: 'L1-10-1', tanya: 'わたしの町{まち}はどんな町{まち}ですか。', tanyaId: 'Kota penulis seperti apa?', opsi: ['大{おお}きい町{まち}', '小{ちい}さい町{まち}', 'にぎやかな町{まち}'], benar: 1, pembahasan: '町は小さいです = kotanya kecil.' },
          { id: 'L1-10-2', tanya: 'スーパーはどこにありますか。', tanyaId: 'Di mana supermarketnya?', opsi: ['駅{えき}の前{まえ}', '川{かわ}の近{ちか}く', '学校{がっこう}のうしろ'], benar: 0, pembahasan: '駅の前に大きいスーパーがあります = di depan stasiun ada supermarket besar.' },
        ],
      },
      {
        id: 'L1-11',
        judul: '父{ちち}の仕事{しごと}',
        teks: 'わたしの父{ちち}は医者{いしゃ}です。毎日{まいにち}病院{びょういん}で働{はたら}きます。父{ちち}は魚{さかな}がとても好{す}きです。',
        terjemahan: 'Ayah saya seorang dokter. Setiap hari ia bekerja di rumah sakit. Ayah sangat suka ikan.',
        soal: [
          { id: 'L1-11-1', tanya: 'お父{とう}さんの仕事{しごと}は何{なん}ですか。', tanyaId: 'Apa pekerjaan ayah penulis?', opsi: ['先生{せんせい}', '医者{いしゃ}', '会社員{かいしゃいん}'], benar: 1, pembahasan: 'わたしの父は医者です = ayah saya seorang dokter.' },
          { id: 'L1-11-2', tanya: 'お父{とう}さんは何{なに}が好{す}きですか。', tanyaId: 'Apa yang disukai ayah?', opsi: ['魚{さかな}', '肉{にく}', 'やさい'], benar: 0, pembahasan: '父は魚がとても好きです = ayah sangat suka ikan.' },
        ],
      },
      {
        id: 'L1-12',
        judul: '新{あたら}しい時計{とけい}',
        teks: 'これは新{あたら}しい時計{とけい}です。母{はは}にもらいました。この時計{とけい}は青{あお}くて、小{ちい}さいです。',
        terjemahan: 'Ini jam tangan baru. Saya menerimanya dari ibu. Jam ini biru dan kecil.',
        soal: [
          { id: 'L1-12-1', tanya: '時計{とけい}はだれにもらいましたか。', tanyaId: 'Dari siapa jam itu diterima?', opsi: ['父{ちち}', '友{とも}だち', '母{はは}'], benar: 2, pembahasan: '母にもらいました = diterima dari ibu.' },
          { id: 'L1-12-2', tanya: 'どんな時計{とけい}ですか。', tanyaId: 'Jam itu seperti apa?', opsi: ['青{あお}くて、小{ちい}さい時計{とけい}', '白{しろ}くて、大{おお}きい時計{とけい}', '青{あお}くて、大{おお}きい時計{とけい}'], benar: 0, pembahasan: 'この時計は青くて、小さいです = jam ini biru dan kecil.' },
        ],
      },
      {
        id: 'L1-13',
        judul: '好{す}きな飲{の}み物{もの}',
        teks: 'わたしは毎朝{まいあさ}コーヒーを飲{の}みます。でも、夜{よる}はお茶{ちゃ}を飲{の}みます。ジュースはあまり飲{の}みません。',
        terjemahan: 'Setiap pagi saya minum kopi. Tetapi malam hari saya minum teh. Saya jarang minum jus.',
        soal: [
          { id: 'L1-13-1', tanya: '毎朝{まいあさ}何{なに}を飲{の}みますか。', tanyaId: 'Apa yang diminum setiap pagi?', opsi: ['お茶{ちゃ}', 'コーヒー', 'ジュース'], benar: 1, pembahasan: '毎朝コーヒーを飲みます = setiap pagi minum kopi.' },
          { id: 'L1-13-2', tanya: '夜{よる}は何{なに}を飲{の}みますか。', tanyaId: 'Apa yang diminum pada malam hari?', opsi: ['お茶{ちゃ}', 'コーヒー', '牛乳{ぎゅうにゅう}'], benar: 0, pembahasan: '夜はお茶を飲みます = malam hari minum teh.' },
        ],
      },
      {
        id: 'L1-14',
        judul: '兄{あに}と弟{おとうと}',
        teks: 'わたしには兄{あに}が一人{ひとり}と弟{おとうと}が二人{ふたり}います。兄{あに}は二十五歳{にじゅうごさい}です。弟{おとうと}たちは学生{がくせい}です。',
        terjemahan: 'Saya punya satu kakak laki-laki dan dua adik laki-laki. Kakak berumur 25 tahun. Adik-adik saya pelajar.',
        soal: [
          { id: 'L1-14-1', tanya: '弟{おとうと}は何人{なんにん}いますか。', tanyaId: 'Ada berapa adik laki-laki?', opsi: ['一人{ひとり}', '二人{ふたり}', '三人{さんにん}'], benar: 1, pembahasan: '弟が二人います = punya dua adik laki-laki.' },
          { id: 'L1-14-2', tanya: 'お兄{にい}さんは何歳{なんさい}ですか。', tanyaId: 'Berapa umur kakak laki-laki?', opsi: ['二十歳{はたち}', '二十二歳{にじゅうにさい}', '二十五歳{にじゅうごさい}'], benar: 2, pembahasan: '兄は二十五歳です = kakak laki-laki berumur 25 tahun.' },
        ],
      },
      {
        id: 'L1-15',
        judul: '好{す}きなスポーツ',
        teks: 'リナさんはテニスが好{す}きです。毎週{まいしゅう}土曜日{どようび}に友{とも}だちとテニスをします。サッカーは好{す}きではありません。',
        terjemahan: 'Rina suka tenis. Setiap hari Sabtu ia bermain tenis bersama teman. Ia tidak suka sepak bola.',
        soal: [
          { id: 'L1-15-1', tanya: 'リナさんは何{なに}が好{す}きですか。', tanyaId: 'Apa yang disukai Rina?', opsi: ['サッカー', 'やきゅう', 'テニス'], benar: 2, pembahasan: 'リナさんはテニスが好きです = Rina suka tenis.' },
          { id: 'L1-15-2', tanya: 'いつテニスをしますか。', tanyaId: 'Kapan ia bermain tenis?', opsi: ['毎週{まいしゅう}土曜日{どようび}', '毎週{まいしゅう}日曜日{にちようび}', '毎日{まいにち}'], benar: 0, pembahasan: '毎週土曜日に友だちとテニスをします = setiap hari Sabtu bermain tenis bersama teman.' },
        ],
      },
      {
        id: 'L1-16',
        judul: '先生{せんせい}の車{くるま}',
        teks: '山田{やまだ}先生{せんせい}の車{くるま}は白{しろ}いです。とても古{ふる}いですが、きれいです。先生{せんせい}は毎朝{まいあさ}車{くるま}で学校{がっこう}へ来{き}ます。',
        terjemahan: 'Mobil Guru Yamada berwarna putih. Mobilnya sangat tua, tetapi bersih. Setiap pagi guru datang ke sekolah naik mobil.',
        soal: [
          { id: 'L1-16-1', tanya: '先生{せんせい}の車{くるま}は何色{なにいろ}ですか。', tanyaId: 'Mobil guru berwarna apa?', opsi: ['黒{くろ}', '白{しろ}', '赤{あか}'], benar: 1, pembahasan: '山田先生の車は白いです = mobil Guru Yamada putih.' },
          { id: 'L1-16-2', tanya: '先生{せんせい}の車{くるま}はどうですか。', tanyaId: 'Bagaimana mobil guru itu?', opsi: ['新{あたら}しくて、きれいです', '古{ふる}くて、きたないです', '古{ふる}いですが、きれいです'], benar: 2, pembahasan: 'とても古いですが、きれいです = sangat tua, tetapi bersih.' },
        ],
      },
      {
        id: 'L1-17',
        judul: 'わたしの誕生日{たんじょうび}',
        teks: '今日{きょう}はわたしの誕生日{たんじょうび}です。二十歳{はたち}になりました。夜{よる}、家族{かぞく}とケーキを食{た}べます。',
        terjemahan: 'Hari ini ulang tahun saya. Saya berumur dua puluh tahun. Malam nanti saya makan kue bersama keluarga.',
        soal: [
          { id: 'L1-17-1', tanya: '今日{きょう}は何{なん}の日{ひ}ですか。', tanyaId: 'Hari ini hari apa?', opsi: ['わたしの誕生日{たんじょうび}', '母{はは}の誕生日{たんじょうび}', '学校{がっこう}の休{やす}み'], benar: 0, pembahasan: '今日はわたしの誕生日です = hari ini ulang tahun saya.' },
          { id: 'L1-17-2', tanya: '夜{よる}、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan malam nanti?', opsi: ['友{とも}だちとレストランへ行{い}きます', '家族{かぞく}とケーキを食{た}べます', '一人{ひとり}でテレビを見{み}ます'], benar: 1, pembahasan: '夜、家族とケーキを食べます = malam hari makan kue bersama keluarga.' },
        ],
      },
      {
        id: 'L1-18',
        judul: 'つくえの上{うえ}',
        teks: 'つくえの上{うえ}に本{ほん}とノートがあります。いすの下{した}にかばんがあります。かばんの中{なか}にさいふがあります。',
        terjemahan: 'Di atas meja ada buku dan buku tulis. Di bawah kursi ada tas. Di dalam tas ada dompet.',
        soal: [
          { id: 'L1-18-1', tanya: 'つくえの上{うえ}に何{なに}がありますか。', tanyaId: 'Apa yang ada di atas meja?', opsi: ['かばん', '本{ほん}とノート', 'さいふ'], benar: 1, pembahasan: 'つくえの上に本とノートがあります = di atas meja ada buku dan buku tulis.' },
          { id: 'L1-18-2', tanya: 'さいふはどこにありますか。', tanyaId: 'Di mana dompetnya?', opsi: ['つくえの上{うえ}', 'いすの上{うえ}', 'かばんの中{なか}'], benar: 2, pembahasan: 'かばんの中にさいふがあります = di dalam tas ada dompet.' },
        ],
      },
      {
        id: 'L1-19',
        judul: '雨{あめ}の日{ひ}',
        teks: 'きのうは雨{あめ}でした。とても寒{さむ}かったです。わたしは一日{いちにち}うちで本{ほん}を読{よ}みました。',
        terjemahan: 'Kemarin hujan. Cuacanya sangat dingin. Seharian saya membaca buku di rumah.',
        soal: [
          { id: 'L1-19-1', tanya: 'きのうの天気{てんき}はどうでしたか。', tanyaId: 'Bagaimana cuaca kemarin?', opsi: ['雨{あめ}で、寒{さむ}かったです', 'いい天気{てんき}で、暑{あつ}かったです', '雪{ゆき}でした'], benar: 0, pembahasan: 'きのうは雨でした。とても寒かったです = kemarin hujan dan sangat dingin.' },
          { id: 'L1-19-2', tanya: 'きのう、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan kemarin?', opsi: ['公園{こうえん}へ行{い}きました', 'うちで本{ほん}を読{よ}みました', '買{か}い物{もの}をしました'], benar: 1, pembahasan: 'わたしは一日うちで本を読みました = seharian membaca buku di rumah.' },
        ],
      },
      {
        id: 'L1-20',
        judul: 'わたしの学校{がっこう}',
        teks: 'わたしの学校{がっこう}は駅{えき}の近{ちか}くにあります。学生{がくせい}は三百人{さんびゃくにん}です。学校{がっこう}の前{まえ}に大{おお}きい木{き}があります。',
        terjemahan: 'Sekolah saya ada di dekat stasiun. Siswanya 300 orang. Di depan sekolah ada pohon besar.',
        soal: [
          { id: 'L1-20-1', tanya: '学校{がっこう}はどこにありますか。', tanyaId: 'Di mana sekolahnya?', opsi: ['駅{えき}の近{ちか}く', '川{かわ}の近{ちか}く', '公園{こうえん}の中{なか}'], benar: 0, pembahasan: 'わたしの学校は駅の近くにあります = sekolah saya ada di dekat stasiun.' },
          { id: 'L1-20-2', tanya: '学生{がくせい}は何人{なんにん}ですか。', tanyaId: 'Ada berapa siswa?', opsi: ['百人{ひゃくにん}', '三百人{さんびゃくにん}', '三千人{さんぜんにん}'], benar: 1, pembahasan: '学生は三百人です = siswanya 300 orang.' },
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
          { id: 'L2-1-1', tanya: 'どこへ行{い}きましたか。', tanyaId: 'Ke mana tokoh pergi?', opsi: ['店{みせ}', '図書館{としょかん}', '病院{びょういん}'], benar: 1, pembahasan: '図書館へ行きました = pergi ke perpustakaan.' },
          { id: 'L2-1-2', tanya: '本{ほん}を何冊{なんさつ}借{か}りましたか。', tanyaId: 'Berapa buku yang dipinjam?', opsi: ['一冊{いっさつ}', '二冊{にさつ}', '三冊{さんさつ}'], benar: 1, pembahasan: '本を二冊借りました = meminjam dua buku.' },
        ],
      },
      {
        id: 'L2-2',
        judul: '駅{えき}で友{とも}だちに会{あ}う',
        teks: '土曜日{どようび}の午後{ごご}二時{にじ}に駅{えき}でミカさんに会{あ}います。わたしは一時{いちじ}五十分{ごじゅっぷん}に駅{えき}に着{つ}きます。ミカさんは電車{でんしゃ}で来{き}ます。',
        terjemahan: 'Hari Sabtu pukul dua siang saya bertemu Mika di stasiun. Saya tiba di stasiun pukul 1.50. Mika datang dengan kereta.',
        soal: [
          { id: 'L2-2-1', tanya: 'どこでミカさんに会{あ}いますか。', tanyaId: 'Di mana tokoh bertemu Mika?', opsi: ['学校{がっこう}', '駅{えき}', '公園{こうえん}'], benar: 1, pembahasan: '駅で会います = bertemu di stasiun.' },
          { id: 'L2-2-2', tanya: 'ミカさんは何{なに}で来{き}ますか。', tanyaId: 'Mika datang dengan apa?', opsi: ['バス', '自転車{じてんしゃ}', '電車{でんしゃ}'], benar: 2, pembahasan: '電車で来ます = datang dengan kereta.' },
        ],
      },
      {
        id: 'L2-3',
        judul: '買{か}い物{もの}',
        teks: 'スーパーで牛乳{ぎゅうにゅう}とパンを買{か}いました。牛乳{ぎゅうにゅう}は百五十円{ひゃくごじゅうえん}で、パンは二百円{にひゃくえん}でした。全部{ぜんぶ}で三百五十円{さんびゃくごじゅうえん}でした。',
        terjemahan: 'Saya membeli susu dan roti di supermarket. Susu seharga 150 yen dan roti 200 yen. Totalnya 350 yen.',
        soal: [
          { id: 'L2-3-1', tanya: '牛乳{ぎゅうにゅう}はいくらでしたか。', tanyaId: 'Berapa harga susu?', opsi: ['百五十円{ひゃくごじゅうえん}', '二百円{にひゃくえん}', '三百五十円{さんびゃくごじゅうえん}'], benar: 0, pembahasan: '牛乳は百五十円 = susu 150 yen.' },
          { id: 'L2-3-2', tanya: '全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Berapa total harganya?', opsi: ['三百円{さんびゃくえん}', '三百五十円{さんびゃくごじゅうえん}', '四百円{よんひゃくえん}'], benar: 1, pembahasan: '全部で三百五十円 = totalnya 350 yen (150 + 200).' },
        ],
      },
      {
        id: 'L2-4',
        judul: 'きのうの夜{よる}',
        teks: 'きのうの夜{よる}、わたしは七時{しちじ}に家{いえ}へ帰{かえ}りました。それから、晩{ばん}ごはんを食{た}べて、おふろに入{はい}りました。十一時{じゅういちじ}に寝{ね}ました。',
        terjemahan: 'Kemarin malam saya pulang ke rumah pukul tujuh. Setelah itu saya makan malam dan mandi berendam. Saya tidur pukul sebelas.',
        soal: [
          { id: 'L2-4-1', tanya: '何時{なんじ}に家{いえ}へ帰{かえ}りましたか。', tanyaId: 'Pukul berapa tokoh pulang ke rumah?', opsi: ['六時{ろくじ}', '七時{しちじ}', '十一時{じゅういちじ}'], benar: 1, pembahasan: '七時に家へ帰りました = pulang pukul tujuh.' },
          { id: 'L2-4-2', tanya: '晩{ばん}ごはんのあとで、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan setelah makan malam?', opsi: ['寝{ね}ました', 'おふろに入{はい}りました', 'テレビを見{み}ました'], benar: 1, pembahasan: '晩ごはんを食べて、おふろに入りました = makan malam, lalu mandi berendam.' },
        ],
      },
      {
        id: 'L2-5',
        judul: 'デパートで',
        teks: '先週{せんしゅう}の土曜日{どようび}、母{はは}とデパートへ行{い}きました。わたしは青{あお}いシャツを買{か}いました。シャツは三千円{さんぜんえん}でした。母{はは}はくつを買{か}いました。',
        terjemahan: 'Sabtu minggu lalu saya pergi ke department store bersama ibu. Saya membeli kemeja biru. Kemeja itu harganya 3.000 yen. Ibu membeli sepatu.',
        soal: [
          { id: 'L2-5-1', tanya: 'わたしは何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli penulis?', opsi: ['青{あお}いシャツ', 'くつ', '青{あお}いかばん'], benar: 0, pembahasan: '青いシャツを買いました = membeli kemeja biru.' },
          { id: 'L2-5-2', tanya: 'シャツはいくらでしたか。', tanyaId: 'Berapa harga kemejanya?', opsi: ['三百円{さんびゃくえん}', '三千円{さんぜんえん}', '三万円{さんまんえん}'], benar: 1, pembahasan: '三千円 = 3.000 yen.' },
        ],
      },
      {
        id: 'L2-6',
        judul: '病院{びょういん}へ行{い}きました',
        teks: 'けさ、頭{あたま}がいたかったですから、学校{がっこう}を休{やす}みました。病院{びょういん}へ行{い}って、くすりをもらいました。午後{ごご}は家{いえ}で寝{ね}ました。',
        terjemahan: 'Pagi ini kepala saya sakit, jadi saya tidak masuk sekolah. Saya pergi ke rumah sakit dan mendapat obat. Sore hari saya tidur di rumah.',
        soal: [
          { id: 'L2-6-1', tanya: 'どうして学校{がっこう}を休{やす}みましたか。', tanyaId: 'Mengapa tokoh tidak masuk sekolah?', opsi: ['頭{あたま}がいたかったからです', '雨{あめ}が降{ふ}ったからです', '家族{かぞく}の用事{ようじ}があったからです'], benar: 0, pembahasan: '頭がいたかったですから = karena kepalanya sakit.' },
          { id: 'L2-6-2', tanya: '午後{ごご}、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan sore hari?', opsi: ['学校{がっこう}へ行{い}きました', '家{いえ}で寝{ね}ました', '病院{びょういん}へ行{い}きました'], benar: 1, pembahasan: '午後は家で寝ました = sore hari tidur di rumah.' },
        ],
      },
      {
        id: 'L2-7',
        judul: '郵便局{ゆうびんきょく}',
        teks: 'きのう、郵便局{ゆうびんきょく}へ行{い}って、手紙{てがみ}を出{だ}しました。切手{きって}を五枚{ごまい}買{か}いました。郵便局{ゆうびんきょく}は銀行{ぎんこう}のとなりにあります。',
        terjemahan: 'Kemarin saya pergi ke kantor pos dan mengirim surat. Saya membeli lima prangko. Kantor pos ada di sebelah bank.',
        soal: [
          { id: 'L2-7-1', tanya: '切手{きって}を何枚{なんまい}買{か}いましたか。', tanyaId: 'Berapa lembar prangko yang dibeli?', opsi: ['三枚{さんまい}', '五枚{ごまい}', '十枚{じゅうまい}'], benar: 1, pembahasan: '切手を五枚買いました = membeli lima prangko.' },
          { id: 'L2-7-2', tanya: '郵便局{ゆうびんきょく}はどこにありますか。', tanyaId: 'Di mana kantor pos?', opsi: ['銀行{ぎんこう}のとなり', '駅{えき}の前{まえ}', '学校{がっこう}のうしろ'], benar: 0, pembahasan: '銀行のとなりにあります = ada di sebelah bank.' },
        ],
      },
      {
        id: 'L2-8',
        judul: '食堂{しょくどう}で',
        teks: '昼{ひる}ごはんは学校{がっこう}の食堂{しょくどう}で食{た}べました。わたしはカレーを食{た}べました。カレーは四百円{よんひゃくえん}で、とてもおいしかったです。',
        terjemahan: 'Saya makan siang di kantin sekolah. Saya makan kari. Karinya 400 yen dan sangat enak.',
        soal: [
          { id: 'L2-8-1', tanya: 'どこで昼{ひる}ごはんを食{た}べましたか。', tanyaId: 'Di mana tokoh makan siang?', opsi: ['家{いえ}', '学校{がっこう}の食堂{しょくどう}', '駅{えき}の近{ちか}くのレストラン'], benar: 1, pembahasan: '学校の食堂で食べました = makan di kantin sekolah.' },
          { id: 'L2-8-2', tanya: 'カレーはいくらでしたか。', tanyaId: 'Berapa harga karinya?', opsi: ['四百円{よんひゃくえん}', '五百円{ごひゃくえん}', '六百円{ろっぴゃくえん}'], benar: 0, pembahasan: '四百円 = 400 yen.' },
        ],
      },
      {
        id: 'L2-9',
        judul: '自転車{じてんしゃ}で会社{かいしゃ}へ',
        teks: 'わたしは毎朝{まいあさ}、自転車{じてんしゃ}で会社{かいしゃ}へ行{い}きます。家{いえ}から会社{かいしゃ}まで二十分{にじゅっぷん}ぐらいかかります。雨{あめ}の日{ひ}はバスに乗{の}ります。',
        terjemahan: 'Setiap pagi saya pergi ke kantor naik sepeda. Dari rumah ke kantor memakan waktu sekitar 20 menit. Pada hari hujan saya naik bus.',
        soal: [
          { id: 'L2-9-1', tanya: '家{いえ}から会社{かいしゃ}まで何分{なんぷん}ぐらいかかりますか。', tanyaId: 'Berapa lama dari rumah ke kantor?', opsi: ['十分{じゅっぷん}ぐらい', '二十分{にじゅっぷん}ぐらい', '三十分{さんじゅっぷん}ぐらい'], benar: 1, pembahasan: '二十分ぐらいかかります = sekitar 20 menit.' },
          { id: 'L2-9-2', tanya: '雨{あめ}の日{ひ}は何{なに}で会社{かいしゃ}へ行{い}きますか。', tanyaId: 'Pada hari hujan naik apa ke kantor?', opsi: ['自転車{じてんしゃ}', 'バス', '電車{でんしゃ}'], benar: 1, pembahasan: '雨の日はバスに乗ります = pada hari hujan naik bus.' },
        ],
      },
      {
        id: 'L2-10',
        judul: '本屋{ほんや}で',
        teks: 'きのう、駅{えき}の近{ちか}くの本屋{ほんや}へ行{い}きました。日本語{にほんご}の辞書{じしょ}を買{か}いたかったですが、高{たか}かったですから、買{か}いませんでした。雑誌{ざっし}を一冊{いっさつ}買{か}いました。',
        terjemahan: 'Kemarin saya pergi ke toko buku dekat stasiun. Saya ingin membeli kamus bahasa Jepang, tetapi karena mahal, saya tidak membelinya. Saya membeli satu majalah.',
        soal: [
          { id: 'L2-10-1', tanya: 'どうして辞書{じしょ}を買{か}いませんでしたか。', tanyaId: 'Mengapa tokoh tidak membeli kamus?', opsi: ['高{たか}かったからです', '店{みせ}になかったからです', '店{みせ}が休{やす}みだったからです'], benar: 0, pembahasan: '高かったですから = karena mahal.' },
          { id: 'L2-10-2', tanya: '本屋{ほんや}で何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli di toko buku?', opsi: ['辞書{じしょ}', '雑誌{ざっし}を一冊{いっさつ}', '本{ほん}を二冊{にさつ}'], benar: 1, pembahasan: '雑誌を一冊買いました = membeli satu majalah.' },
        ],
      },
      {
        id: 'L2-11',
        judul: 'コンビニで',
        teks: 'けさ、コンビニでおにぎりを二{ふた}つとお茶{ちゃ}を一本{いっぽん}買{か}いました。おにぎりは一{ひと}つ百二十円{ひゃくにじゅうえん}でした。お茶{ちゃ}は百五十円{ひゃくごじゅうえん}でした。',
        terjemahan: 'Tadi pagi saya membeli dua onigiri dan sebotol teh di minimarket. Onigiri harganya 120 yen per buah. Tehnya 150 yen.',
        soal: [
          { id: 'L2-11-1', tanya: 'おにぎりをいくつ買{か}いましたか。', tanyaId: 'Berapa onigiri yang dibeli?', opsi: ['一{ひと}つ', '二{ふた}つ', '三{みっ}つ'], benar: 1, pembahasan: 'おにぎりを二つとお茶を一本買いました = membeli dua onigiri dan sebotol teh.' },
          { id: 'L2-11-2', tanya: 'お茶{ちゃ}はいくらでしたか。', tanyaId: 'Berapa harga tehnya?', opsi: ['百五十円{ひゃくごじゅうえん}', '百二十円{ひゃくにじゅうえん}', '二百四十円{にひゃくよんじゅうえん}'], benar: 0, pembahasan: 'お茶は百五十円でした = tehnya 150 yen.' },
        ],
      },
      {
        id: 'L2-12',
        judul: '会社{かいしゃ}まで',
        teks: 'わたしは毎朝{まいあさ}七時半{しちじはん}にうちを出{で}ます。駅{えき}まで歩{ある}いて十分{じゅっぷん}です。それから、電車{でんしゃ}に三十分{さんじゅっぷん}乗{の}ります。',
        terjemahan: 'Setiap pagi saya keluar rumah pukul setengah delapan. Ke stasiun 10 menit jalan kaki. Setelah itu saya naik kereta 30 menit.',
        soal: [
          { id: 'L2-12-1', tanya: '何時{なんじ}にうちを出{で}ますか。', tanyaId: 'Pukul berapa keluar rumah?', opsi: ['七時半{しちじはん}', '七時{しちじ}', '八時{はちじ}'], benar: 0, pembahasan: '毎朝七時半にうちを出ます = setiap pagi keluar rumah pukul setengah delapan.' },
          { id: 'L2-12-2', tanya: '駅{えき}まで何{なに}で行{い}きますか。', tanyaId: 'Ke stasiun naik apa?', opsi: ['自転車{じてんしゃ}で行{い}きます', 'バスで行{い}きます', '歩{ある}いて行{い}きます'], benar: 2, pembahasan: '駅まで歩いて十分です = ke stasiun 10 menit jalan kaki.' },
        ],
      },
      {
        id: 'L2-13',
        judul: '駅{えき}の前{まえ}のパン屋{や}',
        teks: '駅{えき}の前{まえ}に小{ちい}さいパン屋{や}があります。朝{あさ}六時{ろくじ}から夜{よる}八時{はちじ}まで開{あ}いています。わたしはいつもここでメロンパンを買{か}います。メロンパンは一{ひと}つ二百円{にひゃくえん}です。',
        terjemahan: 'Di depan stasiun ada toko roti kecil. Toko itu buka dari pukul 6 pagi sampai pukul 8 malam. Saya selalu membeli roti melon di sini. Roti melon harganya 200 yen per buah.',
        soal: [
          { id: 'L2-13-1', tanya: 'パン屋{や}は何時{なんじ}に閉{し}まりますか。', tanyaId: 'Pukul berapa toko roti tutup?', opsi: ['六時{ろくじ}', '七時{しちじ}', '八時{はちじ}'], benar: 2, pembahasan: '朝六時から夜八時まで開いています = buka dari pukul 6 pagi sampai pukul 8 malam.' },
          { id: 'L2-13-2', tanya: 'メロンパンはいくらですか。', tanyaId: 'Berapa harga roti melon?', opsi: ['百円{ひゃくえん}', '二百円{にひゃくえん}', '六百円{ろっぴゃくえん}'], benar: 1, pembahasan: 'メロンパンは一つ二百円です = roti melon 200 yen per buah.' },
        ],
      },
      {
        id: 'L2-14',
        judul: 'デパートで',
        teks: '日曜日{にちようび}に友{とも}だちとデパートへ行{い}きました。わたしはくつを買{か}いました。友{とも}だちは赤{あか}いかばんを買{か}いました。それから、デパートのレストランで昼{ひる}ごはんを食{た}べました。',
        terjemahan: 'Hari Minggu saya pergi ke department store bersama teman. Saya membeli sepatu. Teman saya membeli tas merah. Setelah itu kami makan siang di restoran department store.',
        soal: [
          { id: 'L2-14-1', tanya: '友{とも}だちは何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli teman?', opsi: ['くつ', '赤{あか}いかばん', '赤{あか}いくつ'], benar: 1, pembahasan: '友だちは赤いかばんを買いました = teman membeli tas merah.' },
          { id: 'L2-14-2', tanya: '昼{ひる}ごはんはどこで食{た}べましたか。', tanyaId: 'Di mana mereka makan siang?', opsi: ['デパートのレストラン', '駅{えき}の前{まえ}の店{みせ}', '友{とも}だちのうち'], benar: 0, pembahasan: 'デパートのレストランで昼ごはんを食べました = makan siang di restoran department store.' },
        ],
      },
      {
        id: 'L2-15',
        judul: 'バスで病院{びょういん}へ',
        teks: '母{はは}は毎週{まいしゅう}水曜日{すいようび}に病院{びょういん}へ行{い}きます。うちの前{まえ}から十一番{じゅういちばん}のバスに乗{の}ります。病院{びょういん}まで二十五分{にじゅうごふん}ぐらいかかります。',
        terjemahan: 'Setiap hari Rabu ibu pergi ke rumah sakit. Ia naik bus nomor 11 dari depan rumah. Ke rumah sakit perlu sekitar 25 menit.',
        soal: [
          { id: 'L2-15-1', tanya: 'お母{かあ}さんは何曜日{なんようび}に病院{びょういん}へ行{い}きますか。', tanyaId: 'Hari apa ibu pergi ke rumah sakit?', opsi: ['水曜日{すいようび}', '月曜日{げつようび}', '金曜日{きんようび}'], benar: 0, pembahasan: '母は毎週水曜日に病院へ行きます = setiap hari Rabu ibu pergi ke rumah sakit.' },
          { id: 'L2-15-2', tanya: '何番{なんばん}のバスに乗{の}りますか。', tanyaId: 'Naik bus nomor berapa?', opsi: ['一番{いちばん}', '十番{じゅうばん}', '十一番{じゅういちばん}'], benar: 2, pembahasan: '十一番のバスに乗ります = naik bus nomor 11.' },
        ],
      },
      {
        id: 'L2-16',
        judul: '銀行{ぎんこう}で',
        teks: 'きのう、銀行{ぎんこう}へ行{い}きました。国{くに}の家族{かぞく}にお金{かね}を送{おく}りました。銀行{ぎんこう}は午後{ごご}三時{さんじ}に閉{し}まりますから、昼休{ひるやす}みに行{い}きました。',
        terjemahan: 'Kemarin saya pergi ke bank. Saya mengirim uang kepada keluarga di negara asal. Bank tutup pukul 3 sore, jadi saya pergi saat istirahat siang.',
        soal: [
          { id: 'L2-16-1', tanya: '銀行{ぎんこう}で何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan di bank?', opsi: ['お金{かね}を送{おく}りました', 'お金{かね}をもらいました', '手紙{てがみ}を出{だ}しました'], benar: 0, pembahasan: '国の家族にお金を送りました = mengirim uang kepada keluarga di negara asal.' },
          { id: 'L2-16-2', tanya: 'どうして昼休{ひるやす}みに銀行{ぎんこう}へ行{い}きましたか。', tanyaId: 'Mengapa ia pergi ke bank saat istirahat siang?', opsi: ['昼休{ひるやす}みはひまだったからです', '銀行{ぎんこう}が三時{さんじ}に閉{し}まるからです', '家族{かぞく}に電話{でんわ}したからです'], benar: 1, pembahasan: '銀行は午後三時に閉まりますから、昼休みに行きました = bank tutup pukul 3 sore, jadi pergi saat istirahat siang.' },
        ],
      },
      {
        id: 'L2-17',
        judul: '八百屋{やおや}で',
        teks: '八百屋{やおや}でりんごを三{みっ}つとバナナを一{ひと}ふさ買{か}いました。りんごは一{ひと}つ百円{ひゃくえん}で、バナナは二百円{にひゃくえん}でした。全部{ぜんぶ}で五百円{ごひゃくえん}でした。',
        terjemahan: 'Di toko sayur saya membeli tiga apel dan satu sisir pisang. Apel 100 yen per buah dan pisang 200 yen. Semuanya 500 yen.',
        soal: [
          { id: 'L2-17-1', tanya: 'りんごをいくつ買{か}いましたか。', tanyaId: 'Berapa apel yang dibeli?', opsi: ['二{ふた}つ', '三{みっ}つ', '五{いつ}つ'], benar: 1, pembahasan: 'りんごを三つ…買いました = membeli tiga apel.' },
          { id: 'L2-17-2', tanya: '全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Berapa totalnya?', opsi: ['三百円{さんびゃくえん}', '四百円{よんひゃくえん}', '五百円{ごひゃくえん}'], benar: 2, pembahasan: '全部で五百円でした = semuanya 500 yen.' },
        ],
      },
      {
        id: 'L2-18',
        judul: '兄{あに}の朝{あさ}',
        teks: '兄{あに}は毎朝{まいあさ}六時{ろくじ}に起{お}きて、公園{こうえん}を走{はし}ります。一時間{いちじかん}ぐらい走{はし}ります。それから、シャワーをあびて、会社{かいしゃ}へ行{い}きます。',
        terjemahan: 'Setiap pagi kakak laki-laki saya bangun pukul enam dan berlari di taman. Ia berlari sekitar satu jam. Setelah itu ia mandi dan pergi ke kantor.',
        soal: [
          { id: 'L2-18-1', tanya: 'お兄{にい}さんは毎朝{まいあさ}どこを走{はし}りますか。', tanyaId: 'Di mana kakak berlari setiap pagi?', opsi: ['学校{がっこう}', '公園{こうえん}', '駅{えき}の前{まえ}'], benar: 1, pembahasan: '公園を走ります = berlari di taman.' },
          { id: 'L2-18-2', tanya: 'どのぐらい走{はし}りますか。', tanyaId: 'Berapa lama ia berlari?', opsi: ['一時間{いちじかん}ぐらい', '三十分{さんじゅっぷん}ぐらい', '二時間{にじかん}ぐらい'], benar: 0, pembahasan: '一時間ぐらい走ります = berlari sekitar satu jam.' },
        ],
      },
      {
        id: 'L2-19',
        judul: '映画館{えいがかん}',
        teks: '土曜日{どようび}に弟{おとうと}と映画館{えいがかん}へ行{い}きました。映画{えいが}は午後{ごご}一時{いちじ}から三時{さんじ}まででした。チケットは一枚{いちまい}千八百円{せんはっぴゃくえん}でした。',
        terjemahan: 'Hari Sabtu saya pergi ke bioskop bersama adik laki-laki. Filmnya dari pukul 1 sampai pukul 3 siang. Tiketnya 1.800 yen per lembar.',
        soal: [
          { id: 'L2-19-1', tanya: '映画{えいが}は何時{なんじ}に終{お}わりましたか。', tanyaId: 'Pukul berapa film selesai?', opsi: ['一時{いちじ}', '二時{にじ}', '三時{さんじ}'], benar: 2, pembahasan: '映画は午後一時から三時まででした = film dari pukul 1 sampai pukul 3 siang.' },
          { id: 'L2-19-2', tanya: 'チケットは一枚{いちまい}いくらでしたか。', tanyaId: 'Berapa harga satu lembar tiket?', opsi: ['八百円{はっぴゃくえん}', '千八百円{せんはっぴゃくえん}', '三千六百円{さんぜんろっぴゃくえん}'], benar: 1, pembahasan: 'チケットは一枚千八百円でした = tiket 1.800 yen per lembar.' },
        ],
      },
      {
        id: 'L2-20',
        judul: '寮{りょう}の食堂{しょくどう}',
        teks: 'わたしは会社{かいしゃ}の寮{りょう}に住{す}んでいます。寮{りょう}の食堂{しょくどう}の朝{あさ}ごはんは六時{ろくじ}から九時{くじ}までです。晩{ばん}ごはんは六時{ろくじ}から八時{はちじ}までです。一回{いっかい}四百円{よんひゃくえん}です。',
        terjemahan: 'Saya tinggal di asrama perusahaan. Sarapan di kantin asrama dari pukul 6 sampai pukul 9. Makan malam dari pukul 6 sampai pukul 8. Sekali makan 400 yen.',
        soal: [
          { id: 'L2-20-1', tanya: '食堂{しょくどう}の朝{あさ}ごはんは何時{なんじ}までですか。', tanyaId: 'Sarapan di kantin sampai pukul berapa?', opsi: ['六時{ろくじ}', '八時{はちじ}', '九時{くじ}'], benar: 2, pembahasan: '朝ごはんは六時から九時までです = sarapan dari pukul 6 sampai pukul 9.' },
          { id: 'L2-20-2', tanya: '一回{いっかい}いくらですか。', tanyaId: 'Berapa harga sekali makan?', opsi: ['四百円{よんひゃくえん}', '六百円{ろっぴゃくえん}', '八百円{はっぴゃくえん}'], benar: 0, pembahasan: '一回四百円です = sekali makan 400 yen.' },
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
          { id: 'L3-1-1', tanya: 'どうして公園{こうえん}へ行{い}きませんでしたか。', tanyaId: 'Mengapa tokoh tidak pergi ke taman?', opsi: ['雨{あめ}だったからです', '病気{びょうき}だったからです', '仕事{しごと}がいそがしかったからです'], benar: 0, pembahasan: '雨でしたから = karena hujan.' },
          { id: 'L3-1-2', tanya: '午後{ごご}、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan pada sore hari?', opsi: ['そうじをしました', '映画{えいが}を見{み}ました', '公園{こうえん}へ行{い}きました'], benar: 1, pembahasan: '午後は弟と映画を見ました = sore hari menonton film bersama adik.' },
        ],
      },
      {
        id: 'L3-2',
        judul: '学校{がっこう}のお知{し}らせ',
        teks: '来週{らいしゅう}の月曜日{げつようび}はテストがあります。テストは午前{ごぜん}九時{くじ}から十時{じゅうじ}までです。えんぴつと消{け}しゴムを持{も}ってきてください。',
        terjemahan: 'Senin minggu depan ada ujian. Ujian berlangsung dari pukul 9 sampai 10 pagi. Harap bawa pensil dan penghapus.',
        soal: [
          { id: 'L3-2-1', tanya: 'テストは何時{なんじ}に終{お}わりますか。', tanyaId: 'Pukul berapa ujian selesai?', opsi: ['九時{くじ}', '十時{じゅうじ}', '十一時{じゅういちじ}'], benar: 1, pembahasan: '九時から十時まで = dari pukul 9 sampai pukul 10.' },
          { id: 'L3-2-2', tanya: '何{なに}を持{も}ってきますか。', tanyaId: 'Apa yang harus dibawa?', opsi: ['ペンとノート', 'えんぴつと消{け}しゴム', 'かばんと辞書{じしょ}'], benar: 1, pembahasan: 'えんぴつと消しゴム = pensil dan penghapus.' },
        ],
      },
      {
        id: 'L3-3',
        judul: 'レストラン',
        teks: 'このレストランは魚{さかな}の料理{りょうり}が有名{ゆうめい}です。わたしは魚{さかな}を食{た}べましたが、友{とも}だちは肉{にく}の料理{りょうり}を注文{ちゅうもん}しました。食事{しょくじ}のあとでコーヒーを飲{の}みました。',
        terjemahan: 'Restoran ini terkenal dengan masakan ikan. Saya makan ikan, tetapi teman saya memesan masakan daging. Setelah makan, kami minum kopi.',
        soal: [
          { id: 'L3-3-1', tanya: 'このレストランは何{なに}が有名{ゆうめい}ですか。', tanyaId: 'Restoran ini terkenal karena apa?', opsi: ['魚{さかな}の料理{りょうり}', 'ケーキ', 'コーヒー'], benar: 0, pembahasan: '魚の料理が有名です = terkenal dengan masakan ikan.' },
          { id: 'L3-3-2', tanya: '友{とも}だちは何{なに}を注文{ちゅうもん}しましたか。', tanyaId: 'Apa yang dipesan teman?', opsi: ['魚{さかな}の料理{りょうり}', '肉{にく}の料理{りょうり}', 'ラーメン'], benar: 1, pembahasan: '肉の料理を注文しました = memesan masakan daging.' },
        ],
      },
      {
        id: 'L3-4',
        judul: '図書館{としょかん}の時間{じかん}',
        teks: '図書館{としょかん}は月曜日{げつようび}が休{やす}みです。火曜日{かようび}から金曜日{きんようび}までは午前{ごぜん}九時{くじ}から午後{ごご}七時{しちじ}まで開{あ}いています。土曜日{どようび}と日曜日{にちようび}は午後{ごご}五時{ごじ}までです。本{ほん}は五冊{ごさつ}まで借{か}りてもいいです。',
        terjemahan: 'Perpustakaan libur pada hari Senin. Dari Selasa sampai Jumat buka pukul 9 pagi sampai 7 malam. Sabtu dan Minggu sampai pukul 5 sore. Buku boleh dipinjam sampai lima buku.',
        soal: [
          { id: 'L3-4-1', tanya: '図書館{としょかん}が休{やす}みの日{ひ}はいつですか。', tanyaId: 'Kapan perpustakaan libur?', opsi: ['月曜日{げつようび}', '土曜日{どようび}', '日曜日{にちようび}'], benar: 0, pembahasan: '月曜日が休みです = libur hari Senin.' },
          { id: 'L3-4-2', tanya: '土曜日{どようび}は何時{なんじ}までですか。', tanyaId: 'Hari Sabtu buka sampai pukul berapa?', opsi: ['午後{ごご}五時{ごじ}', '午後{ごご}七時{しちじ}', '午前{ごぜん}九時{くじ}'], benar: 0, pembahasan: '土曜日と日曜日は午後五時までです = Sabtu dan Minggu sampai pukul 5 sore.' },
        ],
      },
      {
        id: 'L3-5',
        judul: 'かぜ',
        teks: '田中{たなか}さんはかぜをひきましたから、きのうから会社{かいしゃ}を休{やす}んでいます。熱{ねつ}がありますが、あまり高{たか}くないです。あしたは会社{かいしゃ}へ行{い}きたいと言{い}っています。',
        terjemahan: 'Tanaka masuk angin, jadi sejak kemarin ia tidak masuk kerja. Ia demam, tetapi tidak terlalu tinggi. Ia bilang besok ingin pergi ke kantor.',
        soal: [
          { id: 'L3-5-1', tanya: '田中{たなか}さんはどうして会社{かいしゃ}を休{やす}んでいますか。', tanyaId: 'Mengapa Tanaka tidak masuk kerja?', opsi: ['かぜをひいたからです', '旅行{りょこう}に行{い}っているからです', '家族{かぞく}が来{き}たからです'], benar: 0, pembahasan: 'かぜをひきましたから = karena masuk angin.' },
          { id: 'L3-5-2', tanya: '田中{たなか}さんはあした何{なに}をしたいですか。', tanyaId: 'Apa yang ingin dilakukan Tanaka besok?', opsi: ['病院{びょういん}へ行{い}きたいです', '会社{かいしゃ}へ行{い}きたいです', '家{いえ}で休{やす}みたいです'], benar: 1, pembahasan: 'あしたは会社へ行きたいと言っています = besok ingin pergi ke kantor.' },
        ],
      },
      {
        id: 'L3-6',
        judul: 'プールのお知{し}らせ',
        teks: '市{し}のプールは七月{しちがつ}一日{ついたち}から八月{はちがつ}三十一日{さんじゅういちにち}までです。子{こ}どもは二百円{にひゃくえん}、大人{おとな}は五百円{ごひゃくえん}です。プールの中{なか}で食{た}べ物{もの}を食{た}べないでください。',
        terjemahan: 'Kolam renang kota buka dari 1 Juli sampai 31 Agustus. Anak-anak 200 yen, orang dewasa 500 yen. Jangan makan makanan di dalam area kolam renang.',
        soal: [
          { id: 'L3-6-1', tanya: '大人{おとな}はいくらですか。', tanyaId: 'Berapa harga tiket untuk orang dewasa?', opsi: ['二百円{にひゃくえん}', '五百円{ごひゃくえん}', '七百円{ななひゃくえん}'], benar: 1, pembahasan: '大人は五百円です = orang dewasa 500 yen.' },
          { id: 'L3-6-2', tanya: 'プールの中{なか}で何{なに}をしてはいけませんか。', tanyaId: 'Apa yang tidak boleh dilakukan di area kolam?', opsi: ['泳{およ}ぐこと', '食{た}べ物{もの}を食{た}べること', 'ぼうしをかぶること'], benar: 1, pembahasan: '食べ物を食べないでください = jangan makan makanan.' },
        ],
      },
      {
        id: 'L3-7',
        judul: '学校{がっこう}におくれました',
        teks: 'けさ、電車{でんしゃ}がとまりましたから、学校{がっこう}におくれました。教室{きょうしつ}に入{はい}ったとき、もう九時{くじ}十五分{じゅうごふん}でした。先生{せんせい}に「すみません」と言{い}いました。',
        terjemahan: 'Pagi ini kereta berhenti, jadi saya terlambat ke sekolah. Ketika saya masuk kelas, sudah pukul 9.15. Saya berkata "maaf" kepada guru.',
        soal: [
          { id: 'L3-7-1', tanya: 'どうして学校{がっこう}におくれましたか。', tanyaId: 'Mengapa tokoh terlambat ke sekolah?', opsi: ['朝{あさ}おそく起{お}きたからです', '電車{でんしゃ}がとまったからです', '雨{あめ}が降{ふ}ったからです'], benar: 1, pembahasan: '電車がとまりましたから = karena kereta berhenti.' },
          { id: 'L3-7-2', tanya: '教室{きょうしつ}に入{はい}ったのは何時{なんじ}でしたか。', tanyaId: 'Pukul berapa tokoh masuk kelas?', opsi: ['九時{くじ}', '九時{くじ}十五分{じゅうごふん}', '九時{くじ}五十分{ごじゅっぷん}'], benar: 1, pembahasan: 'もう九時十五分でした = sudah pukul 9.15.' },
        ],
      },
      {
        id: 'L3-8',
        judul: 'パーティーをします',
        teks: '来週{らいしゅう}の土曜日{どようび}、わたしの家{いえ}でパーティーをします。夕方{ゆうがた}六時{ろくじ}からです。飲{の}み物{もの}と食{た}べ物{もの}はわたしが買{か}います。友{とも}だちもいっしょに来{き}てください。',
        terjemahan: 'Sabtu minggu depan saya mengadakan pesta di rumah saya. Mulai pukul enam sore. Minuman dan makanan saya yang beli. Silakan datang bersama teman juga.',
        soal: [
          { id: 'L3-8-1', tanya: 'パーティーは何時{なんじ}からですか。', tanyaId: 'Pesta mulai pukul berapa?', opsi: ['五時{ごじ}', '六時{ろくじ}', '七時{しちじ}'], benar: 1, pembahasan: '夕方六時からです = mulai pukul enam sore.' },
          { id: 'L3-8-2', tanya: '飲{の}み物{もの}はだれが買{か}いますか。', tanyaId: 'Siapa yang membeli minuman?', opsi: ['来{く}る人{ひと}', 'わたし', 'わたしの友{とも}だち'], benar: 1, pembahasan: '飲み物と食べ物はわたしが買います = penulis yang membeli.' },
        ],
      },
      {
        id: 'L3-9',
        judul: '宿題{しゅくだい}',
        teks: '今日{きょう}は宿題{しゅくだい}がたくさんありました。英語{えいご}の宿題{しゅくだい}はむずかしかったですから、兄{あに}に聞{き}きました。兄{あに}は英語{えいご}がとても上手{じょうず}です。',
        terjemahan: 'Hari ini ada banyak PR. PR bahasa Inggris sulit, jadi saya bertanya kepada kakak laki-laki. Kakak sangat pandai bahasa Inggris.',
        soal: [
          { id: 'L3-9-1', tanya: 'どうして兄{あに}に聞{き}きましたか。', tanyaId: 'Mengapa tokoh bertanya kepada kakaknya?', opsi: ['英語{えいご}の宿題{しゅくだい}がむずかしかったからです', '兄{あに}は先生{せんせい}だからです', '宿題{しゅくだい}がなかったからです'], benar: 0, pembahasan: '英語の宿題はむずかしかったですから = karena PR bahasa Inggris sulit.' },
          { id: 'L3-9-2', tanya: '兄{あに}は何{なに}が上手{じょうず}ですか。', tanyaId: 'Kakak pandai dalam hal apa?', opsi: ['日本語{にほんご}', '英語{えいご}', '料理{りょうり}'], benar: 1, pembahasan: '兄は英語がとても上手です = kakak sangat pandai bahasa Inggris.' },
        ],
      },
      {
        id: 'L3-10',
        judul: 'パン屋{や}のお知{し}らせ',
        teks: '山田{やまだ}パン屋{や}は、来週{らいしゅう}の水曜日{すいようび}と木曜日{もくようび}は休{やす}みです。金曜日{きんようび}からまた開{あ}きます。金曜日{きんようび}は、パンがぜんぶ百円{ひゃくえん}安{やす}くなります。',
        terjemahan: 'Toko Roti Yamada libur hari Rabu dan Kamis minggu depan. Mulai hari Jumat buka lagi. Pada hari Jumat, semua roti menjadi 100 yen lebih murah.',
        soal: [
          { id: 'L3-10-1', tanya: 'パン屋{や}が休{やす}みの日{ひ}はいつですか。', tanyaId: 'Kapan toko roti libur?', opsi: ['水曜日{すいようび}と木曜日{もくようび}', '木曜日{もくようび}と金曜日{きんようび}', '土曜日{どようび}と日曜日{にちようび}'], benar: 0, pembahasan: '水曜日と木曜日は休みです = libur Rabu dan Kamis.' },
          { id: 'L3-10-2', tanya: '金曜日{きんようび}はどうなりますか。', tanyaId: 'Apa yang terjadi pada hari Jumat?', opsi: ['まだ休{やす}みです', 'パンがぜんぶ百円{ひゃくえん}安{やす}くなります', '新{あたら}しいパンだけ売{う}ります'], benar: 1, pembahasan: 'パンがぜんぶ百円安くなります = semua roti 100 yen lebih murah.' },
        ],
      },
      {
        id: 'L3-11',
        judul: '工場{こうじょう}のお知{し}らせ',
        teks: '来週{らいしゅう}の金曜日{きんようび}は工場{こうじょう}をそうじしますから、仕事{しごと}は休{やす}みです。土曜日{どようび}はいつもと同{おな}じです。朝{あさ}八時{はちじ}に来{き}てください。',
        terjemahan: 'Jumat depan pabrik akan dibersihkan, jadi pekerjaan libur. Hari Sabtu seperti biasa. Silakan datang pukul 8 pagi.',
        soal: [
          { id: 'L3-11-1', tanya: 'どうして金曜日{きんようび}は仕事{しごと}が休{やす}みですか。', tanyaId: 'Mengapa hari Jumat pekerjaan libur?', opsi: ['工場{こうじょう}をそうじするからです', '工場{こうじょう}の人{ひと}が旅行{りょこう}に行{い}くからです', '国{くに}の休{やす}みの日{ひ}だからです'], benar: 0, pembahasan: '工場をそうじしますから、仕事は休みです = pabrik dibersihkan, jadi pekerjaan libur.' },
          { id: 'L3-11-2', tanya: '土曜日{どようび}は何時{なんじ}に来{き}ますか。', tanyaId: 'Hari Sabtu datang pukul berapa?', opsi: ['七時{しちじ}', '八時{はちじ}', '九時{くじ}'], benar: 1, pembahasan: '朝八時に来てください = silakan datang pukul 8 pagi.' },
        ],
      },
      {
        id: 'L3-12',
        judul: 'ごみの出{だ}し方{かた}',
        teks: 'このアパートでは、燃{も}えるごみは火曜日{かようび}と金曜日{きんようび}に出{だ}してください。びんとかんは水曜日{すいようび}です。ごみは朝{あさ}出{だ}してください。夜{よる}は出{だ}さないでください。',
        terjemahan: 'Di apartemen ini, sampah yang bisa dibakar dibuang hari Selasa dan Jumat. Botol kaca dan kaleng hari Rabu. Buanglah sampah pada pagi hari. Jangan membuang sampah pada malam hari.',
        soal: [
          { id: 'L3-12-1', tanya: 'びんとかんは何曜日{なんようび}に出{だ}しますか。', tanyaId: 'Botol kaca dan kaleng dibuang hari apa?', opsi: ['火曜日{かようび}', '水曜日{すいようび}', '金曜日{きんようび}'], benar: 1, pembahasan: 'びんとかんは水曜日です = botol kaca dan kaleng hari Rabu.' },
          { id: 'L3-12-2', tanya: 'ごみはいつ出{だ}してはいけませんか。', tanyaId: 'Kapan sampah tidak boleh dibuang?', opsi: ['朝{あさ}', '昼{ひる}', '夜{よる}'], benar: 2, pembahasan: '夜は出さないでください = jangan membuang pada malam hari.' },
        ],
      },
      {
        id: 'L3-13',
        judul: '雪{ゆき}の朝{あさ}',
        teks: '今朝{けさ}は雪{ゆき}がたくさん降{ふ}りましたから、バスが二十分{にじゅっぷん}おくれました。わたしは会社{かいしゃ}に電話{でんわ}して、「少{すこ}しおくれます」と言{い}いました。',
        terjemahan: 'Tadi pagi salju turun banyak, jadi bus terlambat 20 menit. Saya menelepon kantor dan berkata, "Saya akan sedikit terlambat."',
        soal: [
          { id: 'L3-13-1', tanya: 'どうしてバスがおくれましたか。', tanyaId: 'Mengapa bus terlambat?', opsi: ['雨{あめ}がたくさん降{ふ}ったからです', '道{みち}がこんでいたからです', '雪{ゆき}がたくさん降{ふ}ったからです'], benar: 2, pembahasan: '雪がたくさん降りましたから、バスが二十分おくれました = salju turun banyak, jadi bus terlambat 20 menit.' },
          { id: 'L3-13-2', tanya: 'わたしはどうしましたか。', tanyaId: 'Apa yang dilakukan penulis?', opsi: ['会社{かいしゃ}に電話{でんわ}しました', '会社{かいしゃ}を休{やす}みました', 'タクシーで会社{かいしゃ}へ行{い}きました'], benar: 0, pembahasan: '会社に電話して、「少しおくれます」と言いました = menelepon kantor dan berkata akan sedikit terlambat.' },
        ],
      },
      {
        id: 'L3-14',
        judul: '教室{きょうしつ}のお知{し}らせ',
        teks: '来週{らいしゅう}から、日本語{にほんご}の授業{じゅぎょう}は二階{にかい}の教室{きょうしつ}ではありません。三階{さんがい}の大{おお}きい教室{きょうしつ}です。時間{じかん}はいつもと同{おな}じで、午後{ごご}二時{にじ}からです。',
        terjemahan: 'Mulai minggu depan, pelajaran bahasa Jepang tidak di kelas lantai dua. Pelajaran pindah ke kelas besar di lantai tiga. Jamnya sama seperti biasa, mulai pukul 2 siang.',
        soal: [
          { id: 'L3-14-1', tanya: '来週{らいしゅう}から、授業{じゅぎょう}はどこですか。', tanyaId: 'Mulai minggu depan, pelajaran di mana?', opsi: ['二階{にかい}の教室{きょうしつ}', '三階{さんがい}の大{おお}きい教室{きょうしつ}', '三階{さんがい}の小{ちい}さい教室{きょうしつ}'], benar: 1, pembahasan: '三階の大きい教室です = di kelas besar lantai tiga.' },
          { id: 'L3-14-2', tanya: '授業{じゅぎょう}は何時{なんじ}からですか。', tanyaId: 'Pelajaran mulai pukul berapa?', opsi: ['午後{ごご}二時{にじ}', '午後{ごご}一時{いちじ}', '午後{ごご}三時{さんじ}'], benar: 0, pembahasan: '時間はいつもと同じで、午後二時からです = jamnya sama, mulai pukul 2 siang.' },
        ],
      },
      {
        id: 'L3-15',
        judul: '歯医者{はいしゃ}',
        teks: 'きのうの夜{よる}から歯{は}がいたいです。今日{きょう}は仕事{しごと}を休{やす}んで、歯医者{はいしゃ}へ行{い}きました。歯医者{はいしゃ}さんは「あまいものを食{た}べないでください」と言{い}いました。',
        terjemahan: 'Sejak kemarin malam gigi saya sakit. Hari ini saya libur kerja dan pergi ke dokter gigi. Dokter gigi berkata, "Jangan makan makanan manis."',
        soal: [
          { id: 'L3-15-1', tanya: 'どうして仕事{しごと}を休{やす}みましたか。', tanyaId: 'Mengapa ia libur kerja?', opsi: ['頭{あたま}がいたいからです', 'かぜをひいたからです', '歯{は}がいたいからです'], benar: 2, pembahasan: 'きのうの夜から歯がいたいです = sejak kemarin malam gigi sakit.' },
          { id: 'L3-15-2', tanya: '歯医者{はいしゃ}さんは何{なん}と言{い}いましたか。', tanyaId: 'Apa kata dokter gigi?', opsi: ['「あまいものを食{た}べないでください」', '「毎日{まいにち}歯{は}をみがいてください」', '「あした、また来{き}てください」'], benar: 0, pembahasan: '歯医者さんは「あまいものを食べないでください」と言いました = dokter gigi berkata jangan makan makanan manis.' },
        ],
      },
      {
        id: 'L3-16',
        judul: '図書館{としょかん}の本{ほん}',
        teks: '図書館{としょかん}で本{ほん}を三冊{さんさつ}借{か}りました。本{ほん}は二週間{にしゅうかん}借{か}りてもいいです。でも、雑誌{ざっし}は借{か}りてはいけません。雑誌{ざっし}は図書館{としょかん}の中{なか}で読{よ}んでください。',
        terjemahan: 'Saya meminjam tiga buku di perpustakaan. Buku boleh dipinjam selama dua minggu. Tetapi majalah tidak boleh dipinjam. Majalah dibaca di dalam perpustakaan.',
        soal: [
          { id: 'L3-16-1', tanya: '本{ほん}はどのぐらい借{か}りてもいいですか。', tanyaId: 'Buku boleh dipinjam berapa lama?', opsi: ['一週間{いっしゅうかん}', '二週間{にしゅうかん}', '三週間{さんしゅうかん}'], benar: 1, pembahasan: '本は二週間借りてもいいです = buku boleh dipinjam dua minggu.' },
          { id: 'L3-16-2', tanya: '雑誌{ざっし}はどうしますか。', tanyaId: 'Bagaimana dengan majalah?', opsi: ['図書館{としょかん}の中{なか}で読{よ}みます', 'うちで読{よ}みます', '二冊{にさつ}まで借{か}ります'], benar: 0, pembahasan: '雑誌は図書館の中で読んでください = majalah dibaca di dalam perpustakaan.' },
        ],
      },
      {
        id: 'L3-17',
        judul: '新{あたら}しいラーメン屋{や}',
        teks: '駅{えき}の前{まえ}に新{あたら}しいラーメン屋{や}ができました。とてもおいしいですから、いつも人{ひと}がたくさん並{なら}んでいます。わたしはきのう三十分{さんじゅっぷん}待{ま}ちました。',
        terjemahan: 'Di depan stasiun ada kedai ramen baru. Ramennya sangat enak, jadi selalu banyak orang mengantre. Kemarin saya menunggu 30 menit.',
        soal: [
          { id: 'L3-17-1', tanya: 'どうしていつも人{ひと}がたくさん並{なら}んでいますか。', tanyaId: 'Mengapa selalu banyak orang mengantre?', opsi: ['安{やす}いからです', 'おいしいからです', '駅{えき}から近{ちか}いからです'], benar: 1, pembahasan: 'とてもおいしいですから、いつも人がたくさん並んでいます = sangat enak, jadi selalu banyak orang mengantre.' },
          { id: 'L3-17-2', tanya: 'きのう、わたしはどのぐらい待{ま}ちましたか。', tanyaId: 'Kemarin penulis menunggu berapa lama?', opsi: ['十分{じゅっぷん}', '二十分{にじゅっぷん}', '三十分{さんじゅっぷん}'], benar: 2, pembahasan: 'わたしはきのう三十分待ちました = kemarin saya menunggu 30 menit.' },
        ],
      },
      {
        id: 'L3-18',
        judul: '電話{でんわ}のメモ',
        teks: '田中{たなか}さんへ。十時{じゅうじ}ごろ、木村{きむら}さんから電話{でんわ}がありました。あしたのミーティングは二時{にじ}からではありません。三時{さんじ}からです。木村{きむら}さんに電話{でんわ}をしてください。',
        terjemahan: 'Untuk Tanaka. Sekitar pukul sepuluh ada telepon dari Kimura. Rapat besok bukan mulai pukul 2, tetapi pukul 3. Silakan telepon Kimura.',
        soal: [
          { id: 'L3-18-1', tanya: 'あしたのミーティングは何時{なんじ}からですか。', tanyaId: 'Rapat besok mulai pukul berapa?', opsi: ['二時{にじ}', '三時{さんじ}', '十時{じゅうじ}'], benar: 1, pembahasan: '二時からではありません。三時からです = bukan pukul 2, tetapi pukul 3.' },
          { id: 'L3-18-2', tanya: '田中{たなか}さんは何{なに}をしますか。', tanyaId: 'Apa yang harus dilakukan Tanaka?', opsi: ['木村{きむら}さんに電話{でんわ}をします', '木村{きむら}さんに会{あ}いに行{い}きます', 'ミーティングを休{やす}みます'], benar: 0, pembahasan: '木村さんに電話をしてください = silakan telepon Kimura.' },
        ],
      },
      {
        id: 'L3-19',
        judul: '弟{おとうと}の運動会{うんどうかい}',
        teks: '弟{おとうと}の学校{がっこう}の運動会{うんどうかい}は今週{こんしゅう}の土曜日{どようび}でした。でも、雨{あめ}が降{ふ}りましたから、来週{らいしゅう}の日曜日{にちようび}になりました。弟{おとうと}は「早{はや}く走{はし}りたい」と言{い}っています。',
        terjemahan: 'Hari olahraga di sekolah adik laki-laki saya seharusnya Sabtu ini. Tetapi karena hujan, diundur menjadi Minggu depan. Adik berkata, "Aku ingin cepat berlari."',
        soal: [
          { id: 'L3-19-1', tanya: '運動会{うんどうかい}はいつになりましたか。', tanyaId: 'Hari olahraga diundur menjadi kapan?', opsi: ['今週{こんしゅう}の土曜日{どようび}', '来週{らいしゅう}の土曜日{どようび}', '来週{らいしゅう}の日曜日{にちようび}'], benar: 2, pembahasan: '来週の日曜日になりました = menjadi hari Minggu depan.' },
          { id: 'L3-19-2', tanya: 'どうして今週{こんしゅう}の土曜日{どようび}に運動会{うんどうかい}をしませんでしたか。', tanyaId: 'Mengapa hari olahraga tidak diadakan Sabtu ini?', opsi: ['雨{あめ}が降{ふ}ったからです', '先生{せんせい}が病気{びょうき}だったからです', '弟{おとうと}が休{やす}んだからです'], benar: 0, pembahasan: '雨が降りましたから、来週の日曜日になりました = karena hujan, diundur ke Minggu depan.' },
        ],
      },
      {
        id: 'L3-20',
        judul: '病院{びょういん}のお知{し}らせ',
        teks: 'さくら病院{びょういん}のお知{し}らせです。来週{らいしゅう}の月曜日{げつようび}から水曜日{すいようび}まで、病院{びょういん}は休{やす}みです。木曜日{もくようび}から、また朝{あさ}九時{くじ}に開{あ}きます。休{やす}みの日{ひ}は、駅{えき}の前{まえ}のみどり病院{びょういん}へ行{い}ってください。',
        terjemahan: 'Pengumuman dari Rumah Sakit Sakura. Senin sampai Rabu minggu depan rumah sakit libur. Mulai Kamis buka lagi pukul 9 pagi. Pada hari libur, silakan pergi ke Rumah Sakit Midori di depan stasiun.',
        soal: [
          { id: 'L3-20-1', tanya: 'さくら病院{びょういん}はいつからまた開{あ}きますか。', tanyaId: 'Kapan Rumah Sakit Sakura buka lagi?', opsi: ['月曜日{げつようび}', '水曜日{すいようび}', '木曜日{もくようび}'], benar: 2, pembahasan: '木曜日から、また朝九時に開きます = mulai Kamis buka lagi pukul 9 pagi.' },
          { id: 'L3-20-2', tanya: '休{やす}みの日{ひ}はどこへ行{い}きますか。', tanyaId: 'Pada hari libur pergi ke mana?', opsi: ['さくら病院{びょういん}', '駅{えき}の前{まえ}のみどり病院{びょういん}', '駅{えき}の前{まえ}のくすり屋{や}'], benar: 1, pembahasan: '休みの日は、駅の前のみどり病院へ行ってください = pada hari libur pergi ke Rumah Sakit Midori di depan stasiun.' },
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
          { id: 'L4-1-1', tanya: '京都{きょうと}へ行{い}くのはいつですか。', tanyaId: 'Kapan mereka pergi ke Kyoto?', opsi: ['今週{こんしゅう}', '来月{らいげつ}', '来年{らいねん}'], benar: 1, pembahasan: '来月 = bulan depan.' },
          { id: 'L4-1-2', tanya: 'ホテルに荷物{にもつ}を置{お}いたあと、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan setelah meletakkan barang di hotel?', opsi: ['昼{ひる}ごはんを食{た}べます', 'お寺{てら}を見{み}に行{い}きます', '家{いえ}へ帰{かえ}ります'], benar: 1, pembahasan: 'それから、お寺を見に行く予定です = setelah itu berencana melihat kuil.' },
        ],
      },
      {
        id: 'L4-2',
        judul: 'アルバイト',
        teks: 'ユキさんは大学{だいがく}の近{ちか}くの喫茶店{きっさてん}でアルバイトをしています。月曜日{げつようび}から金曜日{きんようび}まで、午後{ごご}四時{よじ}から八時{はちじ}まで働{はたら}きます。土曜日{どようび}と日曜日{にちようび}は休{やす}みです。',
        terjemahan: 'Yuki bekerja paruh waktu di kafe dekat universitas. Dari Senin sampai Jumat, ia bekerja pukul 4 sampai 8 sore. Sabtu dan Minggu libur.',
        soal: [
          { id: 'L4-2-1', tanya: 'ユキさんはどこで働{はたら}いていますか。', tanyaId: 'Di mana Yuki bekerja?', opsi: ['本屋{ほんや}', '喫茶店{きっさてん}', '病院{びょういん}'], benar: 1, pembahasan: '喫茶店 = kedai kopi / kafe.' },
          { id: 'L4-2-2', tanya: 'ユキさんは何曜日{なんようび}が休{やす}みですか。', tanyaId: 'Hari apa Yuki libur?', opsi: ['土曜日{どようび}と日曜日{にちようび}', '月曜日{げつようび}と火曜日{かようび}', '金曜日{きんようび}と土曜日{どようび}'], benar: 0, pembahasan: '土曜日と日曜日は休みです = Sabtu dan Minggu libur.' },
        ],
      },
      {
        id: 'L4-3',
        judul: '忘{わす}れ物{もの}',
        teks: '今朝{けさ}、電車{でんしゃ}の中{なか}にかばんを忘{わす}れました。駅員{えきいん}さんに話{はな}すと、かばんは駅{えき}の事務所{じむしょ}にあると言{い}いました。学校{がっこう}の帰{かえ}りに取{と}りに行{い}きます。',
        terjemahan: 'Pagi ini saya meninggalkan tas di dalam kereta. Ketika saya memberi tahu petugas stasiun, ia mengatakan tas itu ada di kantor stasiun. Saya akan mengambilnya saat pulang dari sekolah.',
        soal: [
          { id: 'L4-3-1', tanya: 'どこにかばんを忘{わす}れましたか。', tanyaId: 'Di mana tas tertinggal?', opsi: ['学校{がっこう}', '電車{でんしゃ}の中{なか}', '駅{えき}の事務所{じむしょ}'], benar: 1, pembahasan: '電車の中にかばんを忘れました = tas tertinggal di dalam kereta.' },
          { id: 'L4-3-2', tanya: 'いつかばんを取{と}りに行{い}きますか。', tanyaId: 'Kapan tas akan diambil?', opsi: ['学校{がっこう}へ行{い}く前{まえ}', '昼休{ひるやす}み', '学校{がっこう}の帰{かえ}り'], benar: 2, pembahasan: '学校の帰りに = saat pulang dari sekolah.' },
        ],
      },
      {
        id: 'L4-4',
        judul: '今週{こんしゅう}の予定{よてい}',
        teks: '今週{こんしゅう}は忙{いそが}しいです。月曜日{げつようび}と水曜日{すいようび}は日本語{にほんご}の授業{じゅぎょう}があります。木曜日{もくようび}は午後{ごご}三時{さんじ}に病院{びょういん}へ行{い}きます。土曜日{どようび}と日曜日{にちようび}は家{いえ}でゆっくり休{やす}みたいです。',
        terjemahan: 'Minggu ini saya sibuk. Senin dan Rabu ada pelajaran bahasa Jepang. Kamis pukul 3 sore saya pergi ke rumah sakit. Sabtu dan Minggu saya ingin beristirahat dengan santai di rumah.',
        soal: [
          { id: 'L4-4-1', tanya: '日本語{にほんご}の授業{じゅぎょう}は何曜日{なんようび}ですか。', tanyaId: 'Hari apa pelajaran bahasa Jepang?', opsi: ['月曜日{げつようび}と水曜日{すいようび}', '火曜日{かようび}と木曜日{もくようび}', '水曜日{すいようび}と金曜日{きんようび}'], benar: 0, pembahasan: '月曜日と水曜日は日本語の授業があります = Senin dan Rabu.' },
          { id: 'L4-4-2', tanya: '木曜日{もくようび}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan hari Kamis?', opsi: ['日本語{にほんご}の授業{じゅぎょう}に出{で}ます', '病院{びょういん}へ行{い}きます', '家{いえ}で休{やす}みます'], benar: 1, pembahasan: '木曜日は午後三時に病院へ行きます = Kamis pergi ke rumah sakit.' },
        ],
      },
      {
        id: 'L4-5',
        judul: 'バスの時間{じかん}',
        teks: 'このバスは駅{えき}から大学{だいがく}まで行{い}きます。朝{あさ}は十分{じゅっぷん}に一本{いっぽん}ありますが、昼{ひる}は三十分{さんじゅっぷん}に一本{いっぽん}です。大学{だいがく}まで二十五分{にじゅうごふん}かかります。',
        terjemahan: 'Bus ini pergi dari stasiun ke universitas. Pagi hari ada satu bus setiap 10 menit, tetapi siang hari satu bus setiap 30 menit. Sampai ke universitas memakan waktu 25 menit.',
        soal: [
          { id: 'L4-5-1', tanya: '昼{ひる}は何分{なんぷん}に一本{いっぽん}バスがありますか。', tanyaId: 'Siang hari ada bus setiap berapa menit?', opsi: ['十分{じゅっぷん}に一本{いっぽん}', '二十五分{にじゅうごふん}に一本{いっぽん}', '三十分{さんじゅっぷん}に一本{いっぽん}'], benar: 2, pembahasan: '昼は三十分に一本です = siang hari satu bus setiap 30 menit.' },
          { id: 'L4-5-2', tanya: '駅{えき}から大学{だいがく}まで何分{なんぷん}かかりますか。', tanyaId: 'Berapa lama dari stasiun ke universitas?', opsi: ['十分{じゅっぷん}', '二十五分{にじゅうごふん}', '三十分{さんじゅっぷん}'], benar: 1, pembahasan: '大学まで二十五分かかります = 25 menit.' },
        ],
      },
      {
        id: 'L4-6',
        judul: '新{あたら}しいアパート',
        teks: '先月{せんげつ}から新{あたら}しいアパートに住{す}んでいます。前{まえ}のアパートより駅{えき}に近{ちか}くて、歩{ある}いて五分{ごふん}です。でも、部屋{へや}は少{すこ}しせまいです。このアパートは一{いっ}か月{げつ}六万円{ろくまんえん}です。',
        terjemahan: 'Sejak bulan lalu saya tinggal di apartemen baru. Lebih dekat ke stasiun daripada apartemen lama, lima menit jalan kaki. Tetapi kamarnya agak sempit. Apartemen ini 60.000 yen per bulan.',
        soal: [
          { id: 'L4-6-1', tanya: '新{あたら}しいアパートから駅{えき}までどのぐらいですか。', tanyaId: 'Seberapa jauh dari apartemen baru ke stasiun?', opsi: ['歩{ある}いて五分{ごふん}', '歩{ある}いて十五分{じゅうごふん}', 'バスで五分{ごふん}'], benar: 0, pembahasan: '歩いて五分です = lima menit jalan kaki.' },
          { id: 'L4-6-2', tanya: '新{あたら}しいアパートはどうですか。', tanyaId: 'Bagaimana apartemen baru itu?', opsi: ['駅{えき}に近{ちか}いですが、部屋{へや}は少{すこ}しせまいです', '駅{えき}から遠{とお}いですが、部屋{へや}は広{ひろ}いです', '安{やす}くて、部屋{へや}も広{ひろ}いです'], benar: 0, pembahasan: '駅に近くて…でも、部屋は少しせまいです = dekat stasiun, tetapi kamarnya agak sempit.' },
        ],
      },
      {
        id: 'L4-7',
        judul: '電話{でんわ}のメッセージ',
        teks: '「もしもし、リンです。今日{きょう}の映画{えいが}は七時{しちじ}からですね。わたしは仕事{しごと}が六時半{ろくじはん}に終{お}わりますから、映画館{えいがかん}の前{まえ}で六時{ろくじ}五十分{ごじゅっぷん}に会{あ}いましょう。」',
        terjemahan: '"Halo, ini Rin. Film hari ini mulai pukul tujuh, ya. Pekerjaan saya selesai pukul setengah tujuh, jadi mari bertemu di depan bioskop pukul 6.50."',
        soal: [
          { id: 'L4-7-1', tanya: 'リンさんの仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Pukul berapa pekerjaan Rin selesai?', opsi: ['六時{ろくじ}', '六時半{ろくじはん}', '七時{しちじ}'], benar: 1, pembahasan: '六時半 = pukul setengah tujuh (6.30).' },
          { id: 'L4-7-2', tanya: '二人{ふたり}はどこで会{あ}いますか。', tanyaId: 'Di mana mereka akan bertemu?', opsi: ['映画館{えいがかん}の前{まえ}', '駅{えき}', 'リンさんの会社{かいしゃ}'], benar: 0, pembahasan: '映画館の前で会いましょう = bertemu di depan bioskop.' },
        ],
      },
      {
        id: 'L4-8',
        judul: '学校{がっこう}の旅行{りょこう}',
        teks: '来月{らいげつ}、学校{がっこう}の旅行{りょこう}で海{うみ}へ行{い}きます。朝{あさ}八時{はちじ}に学校{がっこう}の前{まえ}にあつまって、バスで行{い}きます。昼{ひる}ごはんはお弁当{べんとう}を持{も}っていきます。水着{みずぎ}とタオルもわすれないでください。',
        terjemahan: 'Bulan depan, dalam wisata sekolah, kami pergi ke laut. Kami berkumpul di depan sekolah pukul 8 pagi dan pergi naik bus. Untuk makan siang, kami membawa bekal. Jangan lupa baju renang dan handuk.',
        soal: [
          { id: 'L4-8-1', tanya: '何時{なんじ}に、どこにあつまりますか。', tanyaId: 'Pukul berapa dan di mana berkumpul?', opsi: ['八時{はちじ}に学校{がっこう}の前{まえ}', '八時{はちじ}に駅{えき}', '九時{くじ}に学校{がっこう}の前{まえ}'], benar: 0, pembahasan: '朝八時に学校の前にあつまって = berkumpul pukul 8 di depan sekolah.' },
          { id: 'L4-8-2', tanya: '昼{ひる}ごはんはどうしますか。', tanyaId: 'Bagaimana dengan makan siang?', opsi: ['レストランで買{か}います', 'お弁当{べんとう}を持{も}っていきます', '学校{がっこう}で食{た}べます'], benar: 1, pembahasan: '昼ごはんはお弁当を持っていきます = membawa bekal.' },
        ],
      },
      {
        id: 'L4-9',
        judul: 'アルバイトがしたいです',
        teks: 'わたしは一週間{いっしゅうかん}に三日{みっか}アルバイトをしたいです。授業{じゅぎょう}は午後{ごご}三時{さんじ}に終{お}わりますから、月曜日{げつようび}から金曜日{きんようび}までは四時{よじ}からできます。土曜日{どようび}は朝{あさ}からでもいいです。日曜日{にちようび}は家族{かぞく}と出{で}かけますから、できません。',
        terjemahan: 'Saya ingin kerja paruh waktu tiga hari dalam seminggu. Pelajaran selesai pukul 3 sore, jadi Senin sampai Jumat saya bisa mulai pukul 4. Hari Sabtu boleh mulai pagi. Hari Minggu saya pergi bersama keluarga, jadi tidak bisa.',
        soal: [
          { id: 'L4-9-1', tanya: '月曜日{げつようび}から金曜日{きんようび}までは何時{なんじ}からアルバイトができますか。', tanyaId: 'Senin–Jumat bisa kerja mulai pukul berapa?', opsi: ['三時{さんじ}', '四時{よじ}', '朝{あさ}'], benar: 1, pembahasan: '月曜日から金曜日までは四時からできます = mulai pukul 4.' },
          { id: 'L4-9-2', tanya: 'どうして日曜日{にちようび}はできませんか。', tanyaId: 'Mengapa tidak bisa hari Minggu?', opsi: ['授業{じゅぎょう}があるからです', '家族{かぞく}と出{で}かけるからです', '店{みせ}が休{やす}みだからです'], benar: 1, pembahasan: '日曜日は家族と出かけますから = karena pergi bersama keluarga.' },
        ],
      },
      {
        id: 'L4-10',
        judul: '料理{りょうり}教室{きょうしつ}',
        teks: '駅{えき}の近{ちか}くに料理{りょうり}教室{きょうしつ}があります。毎週{まいしゅう}金曜日{きんようび}の夜{よる}七時{しちじ}から九時{くじ}まで、日本{にほん}の料理{りょうり}を作{つく}ります。一回{いっかい}二千円{にせんえん}です。エプロンを持{も}ってきてください。',
        terjemahan: 'Di dekat stasiun ada kelas memasak. Setiap Jumat malam pukul 7 sampai 9, peserta memasak masakan Jepang. Sekali datang 2.000 yen. Harap bawa celemek.',
        soal: [
          { id: 'L4-10-1', tanya: '料理{りょうり}教室{きょうしつ}は何時間{なんじかん}ですか。', tanyaId: 'Berapa jam kelas memasaknya?', opsi: ['一時間{いちじかん}', '二時間{にじかん}', '三時間{さんじかん}'], benar: 1, pembahasan: '七時から九時まで = dari pukul 7 sampai 9, jadi 2 jam.' },
          { id: 'L4-10-2', tanya: '何{なに}を持{も}っていきますか。', tanyaId: 'Apa yang harus dibawa?', opsi: ['エプロン', '料理{りょうり}の材料{ざいりょう}', 'ほうちょう'], benar: 0, pembahasan: 'エプロンを持ってきてください = harap bawa celemek.' },
        ],
      },
      {
        id: 'L4-11',
        judul: '今週{こんしゅう}の仕事{しごと}',
        teks: '今週{こんしゅう}、わたしは月曜日{げつようび}から水曜日{すいようび}まで朝{あさ}の仕事{しごと}です。朝{あさ}六時{ろくじ}から午後{ごご}三時{さんじ}まで働{はたら}きます。木曜日{もくようび}と金曜日{きんようび}は夜{よる}の仕事{しごと}で、夜{よる}十時{じゅうじ}からです。土曜日{どようび}は休{やす}みです。',
        terjemahan: 'Minggu ini saya bekerja sif pagi dari Senin sampai Rabu. Saya bekerja dari pukul 6 pagi sampai pukul 3 sore. Kamis dan Jumat saya sif malam, mulai pukul 10 malam. Hari Sabtu libur.',
        soal: [
          { id: 'L4-11-1', tanya: '水曜日{すいようび}は何時{なんじ}から働{はたら}きますか。', tanyaId: 'Hari Rabu mulai bekerja pukul berapa?', opsi: ['朝{あさ}六時{ろくじ}', '午後{ごご}三時{さんじ}', '夜{よる}十時{じゅうじ}'], benar: 0, pembahasan: '月曜日から水曜日まで朝の仕事です。朝六時から午後三時まで働きます = Senin sampai Rabu sif pagi, pukul 6 pagi sampai 3 sore.' },
          { id: 'L4-11-2', tanya: '夜{よる}の仕事{しごと}は何曜日{なんようび}ですか。', tanyaId: 'Sif malam hari apa?', opsi: ['月曜日{げつようび}と火曜日{かようび}', '木曜日{もくようび}と金曜日{きんようび}', '金曜日{きんようび}と土曜日{どようび}'], benar: 1, pembahasan: '木曜日と金曜日は夜の仕事で = Kamis dan Jumat sif malam.' },
        ],
      },
      {
        id: 'L4-12',
        judul: 'マリアさんのうちへ',
        teks: '日曜日{にちようび}にマリアさんのうちへ遊{あそ}びに行{い}きます。マリアさんのうちは山田{やまだ}駅{えき}から歩{ある}いて十五分{じゅうごふん}です。わたしは十一時{じゅういちじ}に山田{やまだ}駅{えき}に着{つ}きます。マリアさんは駅{えき}の前{まえ}で待{ま}っています。うちでいっしょに昼{ひる}ごはんを作{つく}ります。',
        terjemahan: 'Hari Minggu saya akan main ke rumah Maria. Rumah Maria 15 menit jalan kaki dari Stasiun Yamada. Saya tiba di Stasiun Yamada pukul 11. Maria menunggu di depan stasiun. Kami akan memasak makan siang bersama di rumahnya.',
        soal: [
          { id: 'L4-12-1', tanya: 'わたしは何時{なんじ}に駅{えき}に着{つ}きますか。', tanyaId: 'Pukul berapa penulis tiba di stasiun?', opsi: ['十時{じゅうじ}', '十一時{じゅういちじ}十五分{じゅうごふん}', '十一時{じゅういちじ}'], benar: 2, pembahasan: 'わたしは十一時に山田駅に着きます = saya tiba di Stasiun Yamada pukul 11.' },
          { id: 'L4-12-2', tanya: 'マリアさんのうちで何{なに}をしますか。', tanyaId: 'Apa yang dilakukan di rumah Maria?', opsi: ['昼{ひる}ごはんを作{つく}ります', '映画{えいが}を見{み}ます', '昼{ひる}ごはんを食{た}べに出{で}かけます'], benar: 0, pembahasan: 'うちでいっしょに昼ごはんを作ります = memasak makan siang bersama di rumah.' },
        ],
      },
      {
        id: 'L4-13',
        judul: '会社{かいしゃ}の旅行{りょこう}',
        teks: '来月{らいげつ}の十五日{じゅうごにち}に会社{かいしゃ}の旅行{りょこう}があります。朝{あさ}七時{しちじ}に会社{かいしゃ}の前{まえ}からバスで出{で}ます。昼{ひる}は山{やま}の上{うえ}のレストランで食{た}べます。旅行{りょこう}のお金{かね}はいりません。夜{よる}八時{はちじ}ごろ会社{かいしゃ}に帰{かえ}ります。',
        terjemahan: 'Tanggal 15 bulan depan ada wisata perusahaan. Bus berangkat pukul 7 pagi dari depan kantor. Siang hari makan di restoran di atas gunung. Tidak perlu membayar biaya wisata. Sekitar pukul 8 malam kembali ke kantor.',
        soal: [
          { id: 'L4-13-1', tanya: 'バスは何時{なんじ}に、どこから出{で}ますか。', tanyaId: 'Bus berangkat pukul berapa dan dari mana?', opsi: ['七時{しちじ}に駅{えき}の前{まえ}から', '八時{はちじ}に会社{かいしゃ}の前{まえ}から', '七時{しちじ}に会社{かいしゃ}の前{まえ}から'], benar: 2, pembahasan: '朝七時に会社の前からバスで出ます = bus berangkat pukul 7 pagi dari depan kantor.' },
          { id: 'L4-13-2', tanya: '昼{ひる}ごはんはどこで食{た}べますか。', tanyaId: 'Makan siang di mana?', opsi: ['バスの中{なか}', '山{やま}の上{うえ}のレストラン', '会社{かいしゃ}の食堂{しょくどう}'], benar: 1, pembahasan: '昼は山の上のレストランで食べます = siang makan di restoran di atas gunung.' },
        ],
      },
      {
        id: 'L4-14',
        judul: '日本語{にほんご}のテスト',
        teks: '来週{らいしゅう}の水曜日{すいようび}に日本語{にほんご}のテストがあります。テストは九時{くじ}から十一時{じゅういちじ}までです。九時{くじ}より前{まえ}に教室{きょうしつ}に入{はい}ってください。テストの時{とき}、辞書{じしょ}を使{つか}ってはいけません。えんぴつを二本{にほん}持{も}ってきてください。',
        terjemahan: 'Rabu depan ada ujian bahasa Jepang. Ujian dari pukul 9 sampai pukul 11. Masuklah ke kelas sebelum pukul 9. Saat ujian tidak boleh memakai kamus. Bawalah dua pensil.',
        soal: [
          { id: 'L4-14-1', tanya: 'テストの時{とき}、何{なに}をしてはいけませんか。', tanyaId: 'Saat ujian, apa yang tidak boleh dilakukan?', opsi: ['えんぴつを使{つか}うこと', '辞書{じしょ}を使{つか}うこと', '教室{きょうしつ}に入{はい}ること'], benar: 1, pembahasan: 'テストの時、辞書を使ってはいけません = saat ujian tidak boleh memakai kamus.' },
          { id: 'L4-14-2', tanya: 'えんぴつを何本{なんぼん}持{も}っていきますか。', tanyaId: 'Berapa pensil yang dibawa?', opsi: ['二本{にほん}', '一本{いっぽん}', '三本{さんぼん}'], benar: 0, pembahasan: 'えんぴつを二本持ってきてください = bawalah dua pensil.' },
        ],
      },
      {
        id: 'L4-15',
        judul: '姉{あね}の結婚式{けっこんしき}',
        teks: '来月{らいげつ}の三日{みっか}は姉{あね}の結婚式{けっこんしき}です。結婚式{けっこんしき}はジャカルタのホテルで、午前{ごぜん}十時{じゅうじ}からです。わたしは一日{ついたち}に日本{にほん}を出{で}て、国{くに}へ帰{かえ}ります。六日{むいか}にまた日本{にほん}へ来{き}ます。',
        terjemahan: 'Tanggal 3 bulan depan adalah hari pernikahan kakak perempuan saya. Pernikahannya di sebuah hotel di Jakarta, mulai pukul 10 pagi. Saya berangkat dari Jepang tanggal 1 dan pulang ke negara asal. Tanggal 6 saya kembali ke Jepang.',
        soal: [
          { id: 'L4-15-1', tanya: '結婚式{けっこんしき}はいつですか。', tanyaId: 'Kapan pernikahannya?', opsi: ['来月{らいげつ}の一日{ついたち}', '来月{らいげつ}の六日{むいか}', '来月{らいげつ}の三日{みっか}'], benar: 2, pembahasan: '来月の三日は姉の結婚式です = tanggal 3 bulan depan pernikahan kakak.' },
          { id: 'L4-15-2', tanya: 'わたしはいつ日本{にほん}を出{で}ますか。', tanyaId: 'Kapan penulis berangkat dari Jepang?', opsi: ['来月{らいげつ}の三日{みっか}', '来月{らいげつ}の六日{むいか}', '来月{らいげつ}の一日{ついたち}'], benar: 2, pembahasan: 'わたしは一日に日本を出て = saya berangkat dari Jepang tanggal 1.' },
        ],
      },
      {
        id: 'L4-16',
        judul: 'スポーツセンター',
        teks: '町{まち}のスポーツセンターは火曜日{かようび}から日曜日{にちようび}まで開{あ}いています。月曜日{げつようび}は休{やす}みです。時間{じかん}は朝{あさ}九時{くじ}から夜{よる}九時{くじ}までです。大人{おとな}は一回{いっかい}三百円{さんびゃくえん}、子{こ}どもは百円{ひゃくえん}です。',
        terjemahan: 'Pusat olahraga kota buka dari Selasa sampai Minggu. Hari Senin libur. Jam bukanya dari pukul 9 pagi sampai pukul 9 malam. Orang dewasa 300 yen sekali masuk, anak-anak 100 yen.',
        soal: [
          { id: 'L4-16-1', tanya: 'スポーツセンターが休{やす}みの日{ひ}はいつですか。', tanyaId: 'Kapan pusat olahraga libur?', opsi: ['月曜日{げつようび}', '火曜日{かようび}', '日曜日{にちようび}'], benar: 0, pembahasan: '月曜日は休みです = hari Senin libur.' },
          { id: 'L4-16-2', tanya: '大人{おとな}一人{ひとり}と子{こ}ども一人{ひとり}で、いくらですか。', tanyaId: 'Satu orang dewasa dan satu anak, berapa totalnya?', opsi: ['三百円{さんびゃくえん}', '四百円{よんひゃくえん}', '六百円{ろっぴゃくえん}'], benar: 1, pembahasan: '大人は一回三百円、子どもは百円です = dewasa 300 yen, anak 100 yen (jumlahnya 400 yen).' },
        ],
      },
      {
        id: 'L4-17',
        judul: '夏休{なつやす}みの予定{よてい}',
        teks: '夏休{なつやす}みは八月{はちがつ}十日{とおか}から十六日{じゅうろくにち}までです。十日{とおか}から十二日{じゅうににち}まで、友{とも}だちと北海道{ほっかいどう}へ行{い}きます。十三日{じゅうさんにち}からはうちでゆっくり休{やす}みます。十六日{じゅうろくにち}に部屋{へや}のそうじをします。',
        terjemahan: 'Libur musim panas dari tanggal 10 sampai 16 Agustus. Tanggal 10 sampai 12 saya pergi ke Hokkaido bersama teman. Mulai tanggal 13 saya beristirahat santai di rumah. Tanggal 16 saya membersihkan kamar.',
        soal: [
          { id: 'L4-17-1', tanya: '北海道{ほっかいどう}へ行{い}くのは何日{なんにち}から何日{なんにち}までですか。', tanyaId: 'Ke Hokkaido dari tanggal berapa sampai tanggal berapa?', opsi: ['十日{とおか}から十二日{じゅうににち}まで', '十日{とおか}から十六日{じゅうろくにち}まで', '十三日{じゅうさんにち}から十六日{じゅうろくにち}まで'], benar: 0, pembahasan: '十日から十二日まで、友だちと北海道へ行きます = tanggal 10 sampai 12 pergi ke Hokkaido bersama teman.' },
          { id: 'L4-17-2', tanya: '十六日{じゅうろくにち}に何{なに}をしますか。', tanyaId: 'Apa yang dilakukan tanggal 16?', opsi: ['北海道{ほっかいどう}へ行{い}きます', '部屋{へや}のそうじをします', 'うちでゆっくり休{やす}みます'], benar: 1, pembahasan: '十六日に部屋のそうじをします = tanggal 16 membersihkan kamar.' },
        ],
      },
      {
        id: 'L4-18',
        judul: 'カレーの作{つく}り方{かた}',
        teks: 'カレーの作{つく}り方{かた}です。はじめに、肉{にく}とやさいを小{ちい}さく切{き}ります。それから、なべで肉{にく}を五分{ごふん}ぐらい焼{や}きます。やさいと水{みず}を入{い}れて、二十分{にじゅっぷん}ぐらい待{ま}ちます。そして、カレーのルーを入{い}れます。',
        terjemahan: 'Cara membuat kari. Pertama, potong kecil daging dan sayuran. Setelah itu, panggang daging di panci sekitar 5 menit. Masukkan sayuran dan air, lalu tunggu sekitar 20 menit. Kemudian masukkan bumbu kari.',
        soal: [
          { id: 'L4-18-1', tanya: 'はじめに何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pertama kali?', opsi: ['肉{にく}を焼{や}きます', '肉{にく}とやさいを小{ちい}さく切{き}ります', '水{みず}を入{い}れます'], benar: 1, pembahasan: 'はじめに、肉とやさいを小さく切ります = pertama, potong kecil daging dan sayuran.' },
          { id: 'L4-18-2', tanya: '肉{にく}は何分{なんぷん}ぐらい焼{や}きますか。', tanyaId: 'Daging dipanggang berapa menit?', opsi: ['二十分{にじゅっぷん}', '二十五分{にじゅうごふん}', '五分{ごふん}'], benar: 2, pembahasan: 'なべで肉を五分ぐらい焼きます = panggang daging di panci sekitar 5 menit.' },
        ],
      },
      {
        id: 'L4-19',
        judul: '寮{りょう}のおふろ',
        teks: '寮{りょう}のおふろは一階{いっかい}にあります。男{おとこ}の人{ひと}は午後{ごご}五時{ごじ}から八時{はちじ}まで、女{おんな}の人{ひと}は八時{はちじ}から十一時{じゅういちじ}まで入{はい}ってもいいです。おふろの中{なか}でせんたくをしないでください。タオルは部屋{へや}から持{も}ってきてください。',
        terjemahan: 'Kamar mandi asrama ada di lantai satu. Laki-laki boleh mandi pukul 5 sampai 8 malam, perempuan pukul 8 sampai 11 malam. Jangan mencuci pakaian di kamar mandi. Bawalah handuk dari kamar.',
        soal: [
          { id: 'L4-19-1', tanya: '女{おんな}の人{ひと}は何時{なんじ}からおふろに入{はい}ってもいいですか。', tanyaId: 'Perempuan boleh mandi mulai pukul berapa?', opsi: ['五時{ごじ}', '八時{はちじ}', '十一時{じゅういちじ}'], benar: 1, pembahasan: '女の人は八時から十一時まで入ってもいいです = perempuan boleh mandi pukul 8 sampai 11.' },
          { id: 'L4-19-2', tanya: 'おふろの中{なか}で何{なに}をしてはいけませんか。', tanyaId: 'Apa yang tidak boleh dilakukan di kamar mandi?', opsi: ['シャワーをあびること', 'タオルを使{つか}うこと', 'せんたくをすること'], benar: 2, pembahasan: 'おふろの中でせんたくをしないでください = jangan mencuci pakaian di kamar mandi.' },
        ],
      },
      {
        id: 'L4-20',
        judul: '本屋{ほんや}のアルバイト',
        teks: 'さくら本屋{ほんや}のお知{し}らせです。アルバイトの人{ひと}がほしいです。時間{じかん}は午後{ごご}五時{ごじ}から九時{くじ}までで、一週間{いっしゅうかん}に三日{みっか}です。一時間{いちじかん}千百円{せんひゃくえん}です。店{みせ}の人{ひと}に話{はな}してください。',
        terjemahan: 'Pengumuman dari Toko Buku Sakura. Kami mencari pekerja paruh waktu. Jam kerjanya pukul 5 sampai 9 malam, tiga hari dalam seminggu. Upahnya 1.100 yen per jam. Silakan bicara dengan pegawai toko.',
        soal: [
          { id: 'L4-20-1', tanya: 'アルバイトは一週間{いっしゅうかん}に何日{なんにち}ですか。', tanyaId: 'Kerja paruh waktunya berapa hari seminggu?', opsi: ['二日{ふつか}', '三日{みっか}', '五日{いつか}'], benar: 1, pembahasan: '一週間に三日です = tiga hari dalam seminggu.' },
          { id: 'L4-20-2', tanya: '一時間{いちじかん}いくらですか。', tanyaId: 'Berapa upah per jam?', opsi: ['千百円{せんひゃくえん}', '千円{せんえん}', '千五百円{せんごひゃくえん}'], benar: 0, pembahasan: '一時間千百円です = 1.100 yen per jam.' },
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
          { id: 'L5-1-1', tanya: '新{あたら}しい図書館{としょかん}は前{まえ}の図書館{としょかん}とどう違{ちが}いますか。', tanyaId: 'Apa perbedaan perpustakaan baru dengan yang lama?', opsi: ['前{まえ}の図書館{としょかん}より小{ちい}さいです', '前{まえ}の図書館{としょかん}より大{おお}きくて、勉強{べんきょう}する部屋{へや}もあります', '夜{よる}だけ開{あ}いています'], benar: 1, pembahasan: '大きくて、勉強する部屋もあります = lebih besar dan ada ruang belajar.' },
          { id: 'L5-1-2', tanya: 'わたしは来週{らいしゅう}、何{なに}をしようと思{おも}っていますか。', tanyaId: 'Apa rencana penulis minggu depan?', opsi: ['妹{いもうと}と図書館{としょかん}へ行{い}くこと', '家{いえ}で本{ほん}を読{よ}むこと', '先生{せんせい}と図書館{としょかん}へ行{い}くこと'], benar: 0, pembahasan: '来週、妹と行こうと思っています = minggu depan berencana pergi bersama adik perempuan.' },
        ],
      },
      {
        id: 'L5-2',
        judul: '料理{りょうり}を作{つく}る日{ひ}',
        teks: '先週{せんしゅう}の日曜日{にちようび}、家族{かぞく}みんなでカレーを作{つく}りました。父{ちち}は野菜{やさい}を切{き}り、母{はは}は肉{にく}をいためました。わたしと弟{おとうと}はテーブルを準備{じゅんび}しました。少{すこ}し時間{じかん}がかかりましたが、みんなで作{つく}ったので、いつもよりおいしく感{かん}じました。',
        terjemahan: 'Minggu lalu, seluruh keluarga membuat kari bersama. Ayah memotong sayuran dan ibu menumis daging. Saya dan adik laki-laki menyiapkan meja. Walaupun memakan sedikit waktu, karena dibuat bersama-sama, rasanya lebih enak daripada biasanya.',
        soal: [
          { id: 'L5-2-1', tanya: 'わたしと弟{おとうと}は何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan penulis dan adiknya?', opsi: ['野菜{やさい}を切{き}りました', '肉{にく}をいためました', 'テーブルを準備{じゅんび}しました'], benar: 2, pembahasan: 'テーブルを準備しました = menyiapkan meja.' },
          { id: 'L5-2-2', tanya: 'カレーがいつもよりおいしかったのはどうしてですか。', tanyaId: 'Mengapa kari terasa lebih enak dari biasanya?', opsi: ['レストランで買{か}ったからです', '家族{かぞく}みんなで作{つく}ったからです', '野菜{やさい}を入{い}れなかったからです'], benar: 1, pembahasan: 'みんなで作ったので = karena dibuat bersama-sama.' },
        ],
      },
      {
        id: 'L5-3',
        judul: '雨{あめ}の日{ひ}の約束{やくそく}',
        teks: 'アキさんと動物園{どうぶつえん}へ行{い}く約束{やくそく}をしましたが、朝{あさ}から雨{あめ}が降{ふ}っていました。アキさんに電話{でんわ}すると、「動物園{どうぶつえん}はやめて、駅{えき}の近{ちか}くの美術館{びじゅつかん}に行{い}きませんか」と言{い}いました。美術館{びじゅつかん}では日本{にほん}の昔{むかし}の絵{え}を見{み}ることができました。雨{あめ}でしたが、楽{たの}しい一日{いちにち}になりました。',
        terjemahan: 'Saya berjanji pergi ke kebun binatang dengan Aki, tetapi sejak pagi turun hujan. Ketika saya menelepon Aki, ia berkata, "Bagaimana kalau batal ke kebun binatang dan pergi ke museum seni dekat stasiun?" Di museum kami bisa melihat lukisan Jepang zaman dulu. Walaupun hujan, hari itu menjadi menyenangkan.',
        soal: [
          { id: 'L5-3-1', tanya: '二人{ふたり}はどうして動物園{どうぶつえん}へ行{い}きませんでしたか。', tanyaId: 'Mengapa mereka tidak pergi ke kebun binatang?', opsi: ['雨{あめ}が降{ふ}っていたからです', '動物園{どうぶつえん}が休{やす}みだったからです', 'チケットがなかったからです'], benar: 0, pembahasan: '朝から雨が降っていました = sejak pagi turun hujan.' },
          { id: 'L5-3-2', tanya: '二人{ふたり}はどこへ行{い}きましたか。', tanyaId: 'Ke mana mereka pergi?', opsi: ['図書館{としょかん}', '美術館{びじゅつかん}', 'デパート'], benar: 1, pembahasan: '駅の近くの美術館に行きませんか → mereka pergi ke museum seni dekat stasiun.' },
        ],
      },
      {
        id: 'L5-4',
        judul: '先生{せんせい}へのメール',
        teks: '山田{やまだ}先生{せんせい}、こんにちは。リナです。来週{らいしゅう}の月曜日{げつようび}は、国{くに}から母{はは}が来{き}ますから、空港{くうこう}へ迎{むか}えに行{い}きます。ですから、授業{じゅぎょう}を休{やす}みます。宿題{しゅくだい}は火曜日{かようび}に出{だ}してもいいですか。よろしくお願{ねが}いします。',
        terjemahan: 'Pak/Bu Yamada, selamat siang. Ini Rina. Senin minggu depan ibu saya datang dari negara asal, jadi saya akan menjemputnya di bandara. Karena itu, saya tidak masuk kelas. Bolehkah PR saya serahkan hari Selasa? Terima kasih.',
        soal: [
          { id: 'L5-4-1', tanya: 'リナさんはどうして月曜日{げつようび}に授業{じゅぎょう}を休{やす}みますか。', tanyaId: 'Mengapa Rina tidak masuk kelas hari Senin?', opsi: ['病気{びょうき}だからです', '空港{くうこう}へ母{はは}を迎{むか}えに行{い}くからです', '国{くに}へ帰{かえ}るからです'], benar: 1, pembahasan: '母が来ますから、空港へ迎えに行きます = ibunya datang, jadi ia menjemput di bandara.' },
          { id: 'L5-4-2', tanya: 'リナさんは先生{せんせい}に何{なに}を聞{き}いていますか。', tanyaId: 'Apa yang ditanyakan Rina kepada guru?', opsi: ['宿題{しゅくだい}を火曜日{かようび}に出{だ}してもいいか', '母{はは}が授業{じゅぎょう}に来{き}てもいいか', '次{つぎ}の試験{しけん}はいつか'], benar: 0, pembahasan: '宿題は火曜日に出してもいいですか = bolehkah PR diserahkan hari Selasa?' },
        ],
      },
      {
        id: 'L5-5',
        judul: 'わたしのしゅみ',
        teks: 'わたしのしゅみは写真{しゃしん}をとることです。休{やす}みの日{ひ}は、カメラを持{も}って山{やま}や海{うみ}へ行{い}きます。花{はな}や鳥{とり}の写真{しゃしん}が好{す}きです。去年{きょねん}、町{まち}のコンテストで一番{いちばん}になりました。今{いま}は新{あたら}しいカメラがほしいです。',
        terjemahan: 'Hobi saya memotret. Pada hari libur saya membawa kamera ke gunung atau laut. Saya suka foto bunga dan burung. Tahun lalu saya menjadi juara satu di lomba kota. Sekarang saya ingin kamera baru.',
        soal: [
          { id: 'L5-5-1', tanya: '休{やす}みの日{ひ}、この人{ひと}はどこへ行{い}きますか。', tanyaId: 'Ke mana orang ini pergi pada hari libur?', opsi: ['山{やま}や海{うみ}', '美術館{びじゅつかん}', 'カメラの店{みせ}'], benar: 0, pembahasan: 'カメラを持って山や海へ行きます = membawa kamera ke gunung atau laut.' },
          { id: 'L5-5-2', tanya: 'この人{ひと}は今{いま}、何{なに}がほしいですか。', tanyaId: 'Apa yang diinginkan orang ini sekarang?', opsi: ['新{あたら}しいカメラ', '写真{しゃしん}のアルバム', '新{あたら}しいパソコン'], benar: 0, pembahasan: '今は新しいカメラがほしいです = sekarang ingin kamera baru.' },
        ],
      },
      {
        id: 'L5-6',
        judul: 'はじめての雪{ゆき}',
        teks: 'わたしはインドネシアから来{き}ました。去年{きょねん}の十二月{じゅうにがつ}、はじめて雪{ゆき}を見{み}ました。とてもきれいでしたが、とても寒{さむ}かったです。インドネシアは一年中{いちねんじゅう}暑{あつ}いですから、冬{ふゆ}の服{ふく}を持{も}っていませんでした。友{とも}だちといっしょにデパートへ厚{あつ}いコートを買{か}いに行{い}きました。',
        terjemahan: 'Saya datang dari Indonesia. Bulan Desember tahun lalu, saya melihat salju untuk pertama kali. Sangat indah, tetapi sangat dingin. Indonesia panas sepanjang tahun, jadi saya tidak punya pakaian musim dingin. Saya pergi ke department store bersama teman untuk membeli mantel tebal.',
        soal: [
          { id: 'L5-6-1', tanya: 'この人{ひと}はいつはじめて雪{ゆき}を見{み}ましたか。', tanyaId: 'Kapan orang ini pertama kali melihat salju?', opsi: ['去年{きょねん}の十二月{じゅうにがつ}', '今年{ことし}の一月{いちがつ}', '今年{ことし}の十二月{じゅうにがつ}'], benar: 0, pembahasan: '去年の十二月、はじめて雪を見ました = Desember tahun lalu.' },
          { id: 'L5-6-2', tanya: 'どうしてデパートへ行{い}きましたか。', tanyaId: 'Mengapa ia pergi ke department store?', opsi: ['厚{あつ}いコートを買{か}いに行{い}きました', '友{とも}だちに会{あ}いに行{い}きました', 'プレゼントを買{か}いに行{い}きました'], benar: 0, pembahasan: '厚いコートを買いに行きました = pergi untuk membeli mantel tebal.' },
        ],
      },
      {
        id: 'L5-7',
        judul: 'おばあさんの誕生日{たんじょうび}',
        teks: '来週{らいしゅう}の日曜日{にちようび}はおばあさんの八十歳{はちじゅっさい}の誕生日{たんじょうび}です。家族{かぞく}みんなでレストランで食事{しょくじ}をします。わたしは花{はな}をプレゼントしたいと思{おも}っています。姉{あね}はケーキを作{つく}ります。おばあさんは甘{あま}いものが大好{だいす}きですから、きっとよろこぶと思{おも}います。',
        terjemahan: 'Minggu depan hari ulang tahun ke-80 nenek. Seluruh keluarga akan makan di restoran. Saya ingin memberi hadiah bunga. Kakak perempuan akan membuat kue. Nenek sangat suka makanan manis, jadi saya rasa ia pasti senang.',
        soal: [
          { id: 'L5-7-1', tanya: 'おばあさんは何歳{なんさい}になりますか。', tanyaId: 'Nenek akan berumur berapa?', opsi: ['七十歳{ななじゅっさい}', '八十歳{はちじゅっさい}', '八十八歳{はちじゅうはっさい}'], benar: 1, pembahasan: '八十歳の誕生日 = ulang tahun ke-80.' },
          { id: 'L5-7-2', tanya: '姉{あね}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan kakak perempuan?', opsi: ['花{はな}を買{か}います', 'ケーキを作{つく}ります', 'レストランを予約{よやく}します'], benar: 1, pembahasan: '姉はケーキを作ります = kakak membuat kue.' },
        ],
      },
      {
        id: 'L5-8',
        judul: 'わたしの家{いえ}までの道{みち}',
        teks: '駅{えき}の北口{きたぐち}を出{で}て、まっすぐ行{い}ってください。二{ふた}つ目{め}のかどを右{みぎ}にまがってください。左{ひだり}に郵便局{ゆうびんきょく}があります。郵便局{ゆうびんきょく}のとなりの白{しろ}いアパートがわたしの家{いえ}です。部屋{へや}は三階{さんがい}のいちばん右{みぎ}です。',
        terjemahan: 'Keluar dari pintu utara stasiun, lalu jalan lurus. Belok kanan di tikungan kedua. Di sebelah kiri ada kantor pos. Apartemen putih di sebelah kantor pos adalah rumah saya. Kamarnya di lantai tiga, paling kanan.',
        soal: [
          { id: 'L5-8-1', tanya: '二{ふた}つ目{め}のかどでどうしますか。', tanyaId: 'Apa yang dilakukan di tikungan kedua?', opsi: ['右{みぎ}にまがります', '左{ひだり}にまがります', 'まっすぐ行{い}きます'], benar: 0, pembahasan: '二つ目のかどを右にまがってください = belok kanan di tikungan kedua.' },
          { id: 'L5-8-2', tanya: 'わたしの家{いえ}はどれですか。', tanyaId: 'Rumah penulis yang mana?', opsi: ['郵便局{ゆうびんきょく}のとなりの白{しろ}いアパート', '駅{えき}の前{まえ}のビル', '郵便局{ゆうびんきょく}のうしろの家{いえ}'], benar: 0, pembahasan: '郵便局のとなりの白いアパートがわたしの家です。' },
        ],
      },
      {
        id: 'L5-9',
        judul: '二{ふた}つの店{みせ}',
        teks: '駅{えき}の前{まえ}に店{みせ}が二{ふた}つあります。Aの店{みせ}は安{やす}いですが、いつも人{ひと}が多{おお}くて、レジで長{なが}く待{ま}ちます。Bの店{みせ}は少{すこ}し高{たか}いですが、野菜{やさい}や肉{にく}がとても新{あたら}しいです。わたしは時間{じかん}がない日{ひ}はBの店{みせ}で、休{やす}みの日{ひ}はAの店{みせ}で買{か}い物{もの}をします。',
        terjemahan: 'Di depan stasiun ada dua toko. Toko A murah, tetapi selalu ramai dan harus menunggu lama di kasir. Toko B agak mahal, tetapi sayuran dan dagingnya sangat segar. Pada hari ketika saya tidak punya waktu, saya berbelanja di toko B, dan pada hari libur di toko A.',
        soal: [
          { id: 'L5-9-1', tanya: 'Aの店{みせ}はどんな店{みせ}ですか。', tanyaId: 'Toko A toko seperti apa?', opsi: ['安{やす}いですが、いつも人{ひと}が多{おお}いです', '高{たか}いですが、野菜{やさい}が新{あたら}しいです', '安{やす}くて、人{ひと}が少{すく}ないです'], benar: 0, pembahasan: 'Aの店は安いですが、いつも人が多くて = murah tetapi selalu ramai.' },
          { id: 'L5-9-2', tanya: '休{やす}みの日{ひ}、わたしはどこで買{か}い物{もの}をしますか。', tanyaId: 'Pada hari libur penulis berbelanja di mana?', opsi: ['Aの店{みせ}', 'Bの店{みせ}', '家{いえ}の近{ちか}くのスーパー'], benar: 0, pembahasan: '休みの日はAの店で買い物をします = pada hari libur di toko A.' },
        ],
      },
      {
        id: 'L5-10',
        judul: '日本語{にほんご}の勉強{べんきょう}',
        teks: 'わたしは日本{にほん}で働{はたら}きたいですから、毎日{まいにち}日本語{にほんご}を勉強{べんきょう}しています。朝{あさ}は三十分{さんじゅっぷん}ぐらい新{あたら}しい言葉{ことば}を覚{おぼ}えます。夜{よる}は日本{にほん}のドラマを見{み}ます。はじめはぜんぜんわかりませんでしたが、今{いま}は少{すこ}しわかります。来年{らいねん}、N4の試験{しけん}を受{う}けたいです。',
        terjemahan: 'Saya ingin bekerja di Jepang, jadi setiap hari saya belajar bahasa Jepang. Pagi hari saya menghafal kosakata baru sekitar 30 menit. Malam hari saya menonton drama Jepang. Awalnya saya sama sekali tidak mengerti, tetapi sekarang saya sedikit mengerti. Tahun depan saya ingin mengikuti ujian N4.',
        soal: [
          { id: 'L5-10-1', tanya: 'どうして毎日{まいにち}日本語{にほんご}を勉強{べんきょう}していますか。', tanyaId: 'Mengapa ia belajar bahasa Jepang setiap hari?', opsi: ['日本{にほん}で働{はたら}きたいからです', '日本{にほん}のドラマが好{す}きだからです', '来週{らいしゅう}試験{しけん}があるからです'], benar: 0, pembahasan: '日本で働きたいですから = karena ingin bekerja di Jepang.' },
          { id: 'L5-10-2', tanya: '夜{よる}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pada malam hari?', opsi: ['新{あたら}しい言葉{ことば}を覚{おぼ}えます', '日本{にほん}のドラマを見{み}ます', '試験{しけん}を受{う}けます'], benar: 1, pembahasan: '夜は日本のドラマを見ます = malam hari menonton drama Jepang.' },
        ],
      },
      {
        id: 'L5-11',
        judul: '母{はは}への手紙{てがみ}',
        teks: 'お母{かあ}さん、お元気{げんき}ですか。わたしは元気{げんき}です。日本{にほん}に来{き}て、三{さん}か月{げつ}になりました。仕事{しごと}は工場{こうじょう}で、少{すこ}し大変{たいへん}ですが、会社{かいしゃ}の人{ひと}はみんなやさしいです。毎晩{まいばん}、寮{りょう}で日本語{にほんご}を勉強{べんきょう}しています。来年{らいねん}の三月{さんがつ}に一度{いちど}国{くに}へ帰{かえ}ります。',
        terjemahan: 'Ibu, apa kabar? Saya baik-baik saja. Sudah tiga bulan sejak saya datang ke Jepang. Saya bekerja di pabrik; pekerjaannya agak berat, tetapi semua orang di perusahaan baik hati. Setiap malam saya belajar bahasa Jepang di asrama. Bulan Maret tahun depan saya pulang sekali ke negara asal.',
        soal: [
          { id: 'L5-11-1', tanya: 'この人{ひと}は日本{にほん}に来{き}て、どのぐらいになりましたか。', tanyaId: 'Sudah berapa lama orang ini di Jepang?', opsi: ['三{さん}か月{げつ}', '一{いっ}か月{げつ}', '一年{いちねん}'], benar: 0, pembahasan: '日本に来て、三か月になりました = sudah tiga bulan sejak datang ke Jepang.' },
          { id: 'L5-11-2', tanya: 'この人{ひと}の仕事{しごと}はどうですか。', tanyaId: 'Bagaimana pekerjaan orang ini?', opsi: ['仕事{しごと}はかんたんですが、さびしいです', '仕事{しごと}が大変{たいへん}ですから、国{くに}へ帰{かえ}りたいです', '仕事{しごと}は少{すこ}し大変{たいへん}ですが、会社{かいしゃ}の人{ひと}がやさしいです'], benar: 2, pembahasan: '少し大変ですが、会社の人はみんなやさしいです = agak berat, tetapi semua orang di perusahaan baik hati.' },
        ],
      },
      {
        id: 'L5-12',
        judul: '先輩{せんぱい}からのメール',
        teks: 'アディさん、来週{らいしゅう}から夜{よる}の仕事{しごと}になりますね。夜{よる}の仕事{しごと}は十時{じゅうじ}から朝{あさ}七時{しちじ}までです。夜{よる}は工場{こうじょう}がとても寒{さむ}いですから、あたたかい服{ふく}を着{き}てきてください。晩{ばん}ごはんは十時{じゅうじ}の前{まえ}に食{た}べてください。休{やす}みは二時{にじ}から三時{さんじ}までの一時間{いちじかん}です。わからないことは、わたしに聞{き}いてください。佐藤{さとう}',
        terjemahan: 'Adi, mulai minggu depan kamu masuk sif malam, ya. Sif malam dari pukul 10 malam sampai pukul 7 pagi. Pada malam hari pabrik sangat dingin, jadi pakailah baju hangat. Makan malamlah sebelum pukul 10. Istirahatnya satu jam, dari pukul 2 sampai pukul 3. Kalau ada yang tidak dimengerti, tanyakan kepada saya. Sato',
        soal: [
          { id: 'L5-12-1', tanya: '夜{よる}の仕事{しごと}の休{やす}みは何時{なんじ}からですか。', tanyaId: 'Istirahat sif malam mulai pukul berapa?', opsi: ['二時{にじ}', '十時{じゅうじ}', '三時{さんじ}'], benar: 0, pembahasan: '休みは二時から三時までの一時間です = istirahat satu jam, dari pukul 2 sampai pukul 3.' },
          { id: 'L5-12-2', tanya: 'どうしてあたたかい服{ふく}を着{き}ていきますか。', tanyaId: 'Mengapa harus memakai baju hangat?', opsi: ['外{そと}で仕事{しごと}をするからです', '夜{よる}の工場{こうじょう}はとても寒{さむ}いからです', '仕事{しごと}が朝{あさ}七時{しちじ}までだからです'], benar: 1, pembahasan: '夜は工場がとても寒いですから、あたたかい服を着てきてください = malam hari pabrik sangat dingin, jadi pakailah baju hangat.' },
        ],
      },
      {
        id: 'L5-13',
        judul: 'はじめての給料{きゅうりょう}',
        teks: '先週{せんしゅう}、はじめて日本{にほん}の会社{かいしゃ}から給料{きゅうりょう}をもらいました。とてもうれしかったです。半分{はんぶん}は国{くに}の家族{かぞく}に送{おく}りました。少{すこ}しは銀行{ぎんこう}に入{い}れました。それから、弟{おとうと}に新{あたら}しいサッカーのくつを買{か}いました。弟{おとうと}は来月{らいげつ}、サッカーの試合{しあい}に出{で}ます。',
        terjemahan: 'Minggu lalu untuk pertama kalinya saya menerima gaji dari perusahaan Jepang. Saya sangat senang. Separuhnya saya kirim kepada keluarga di negara asal. Sedikit saya simpan di bank. Lalu saya membelikan sepatu sepak bola baru untuk adik laki-laki. Bulan depan adik akan ikut pertandingan sepak bola.',
        soal: [
          { id: 'L5-13-1', tanya: '給料{きゅうりょう}の半分{はんぶん}をどうしましたか。', tanyaId: 'Separuh gaji digunakan untuk apa?', opsi: ['銀行{ぎんこう}に入{い}れました', '家族{かぞく}に送{おく}りました', 'くつを買{か}いました'], benar: 1, pembahasan: '半分は国の家族に送りました = separuhnya dikirim kepada keluarga di negara asal.' },
          { id: 'L5-13-2', tanya: 'どうして弟{おとうと}にサッカーのくつを買{か}いましたか。', tanyaId: 'Mengapa ia membelikan sepatu sepak bola untuk adik?', opsi: ['弟{おとうと}が来月{らいげつ}サッカーの試合{しあい}に出{で}るからです', '弟{おとうと}の誕生日{たんじょうび}だからです', '弟{おとうと}が日本{にほん}へ来{く}るからです'], benar: 0, pembahasan: '弟は来月、サッカーの試合に出ます = bulan depan adik ikut pertandingan sepak bola (karena itu dibelikan sepatu).' },
        ],
      },
      {
        id: 'L5-14',
        judul: 'はじめての電車{でんしゃ}',
        teks: 'きのう、はじめて一人{ひとり}で電車{でんしゃ}に乗{の}りました。駅{えき}はとても大{おお}きくて、人{ひと}がたくさんいました。きっぷの買{か}い方{かた}がわかりませんでしたから、駅員{えきいん}さんに聞{き}きました。電車{でんしゃ}の中{なか}では少{すこ}し寝{ね}ました。起{お}きた時{とき}、もう会社{かいしゃ}の駅{えき}の三{みっ}つ先{さき}の駅{えき}でした。ですから、会社{かいしゃ}に三十分{さんじゅっぷん}おくれました。',
        terjemahan: 'Kemarin untuk pertama kalinya saya naik kereta sendirian. Stasiunnya sangat besar dan banyak orang. Saya tidak tahu cara membeli tiket, jadi saya bertanya kepada petugas stasiun. Di dalam kereta saya tidur sebentar. Saat bangun, kereta sudah tiga stasiun melewati stasiun kantor saya. Karena itu saya terlambat 30 menit ke kantor.',
        soal: [
          { id: 'L5-14-1', tanya: 'どうして駅員{えきいん}さんに聞{き}きましたか。', tanyaId: 'Mengapa ia bertanya kepada petugas stasiun?', opsi: ['駅{えき}が大{おお}きかったからです', '電車{でんしゃ}がおくれたからです', 'きっぷの買{か}い方{かた}がわからなかったからです'], benar: 2, pembahasan: 'きっぷの買い方がわかりませんでしたから、駅員さんに聞きました = tidak tahu cara membeli tiket, jadi bertanya kepada petugas.' },
          { id: 'L5-14-2', tanya: 'どうして会社{かいしゃ}におくれましたか。', tanyaId: 'Mengapa ia terlambat ke kantor?', opsi: ['電車{でんしゃ}の中{なか}で寝{ね}て、会社{かいしゃ}の駅{えき}で降{お}りなかったからです', 'きっぷを買{か}うのに時間{じかん}がかかったからです', '電車{でんしゃ}が来{き}なかったからです'], benar: 0, pembahasan: '起きた時、もう会社の駅の三つ先の駅でした = saat bangun sudah tiga stasiun melewati stasiun kantor.' },
        ],
      },
      {
        id: 'L5-15',
        judul: 'はじめての花見{はなみ}',
        teks: '先週{せんしゅう}の土曜日{どようび}、会社{かいしゃ}の人{ひと}たちと公園{こうえん}へ花見{はなみ}に行{い}きました。公園{こうえん}にはさくらの木{き}がたくさんあって、とてもきれいでした。わたしたちは朝{あさ}早{はや}く行{い}って、大{おお}きい木{き}の下{した}にすわりました。そこでお弁当{べんとう}を食{た}べて、歌{うた}を歌{うた}いました。インドネシアにはさくらがありませんから、わたしははじめて見{み}ました。来年{らいねん}もまた行{い}きたいです。',
        terjemahan: 'Sabtu lalu saya pergi melihat bunga sakura ke taman bersama orang-orang kantor. Di taman ada banyak pohon sakura dan sangat indah. Kami datang pagi-pagi dan duduk di bawah pohon besar. Di sana kami makan bekal dan bernyanyi. Di Indonesia tidak ada sakura, jadi itu pertama kalinya saya melihatnya. Tahun depan saya ingin pergi lagi.',
        soal: [
          { id: 'L5-15-1', tanya: '公園{こうえん}で何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan di taman?', opsi: ['お弁当{べんとう}を食{た}べて、歌{うた}を歌{うた}いました', 'さくらの木{き}を買{か}いました', '会社{かいしゃ}の人{ひと}とテニスをしました'], benar: 0, pembahasan: 'そこでお弁当を食べて、歌を歌いました = di sana makan bekal dan bernyanyi.' },
          { id: 'L5-15-2', tanya: 'どうして「わたし」ははじめてさくらを見{み}ましたか。', tanyaId: 'Mengapa penulis baru pertama kali melihat sakura?', opsi: ['いつも仕事{しごと}がいそがしかったからです', 'インドネシアにはさくらがないからです', 'さくらがきらいだったからです'], benar: 1, pembahasan: 'インドネシアにはさくらがありませんから、わたしははじめて見ました = di Indonesia tidak ada sakura, jadi baru pertama kali melihat.' },
        ],
      },
      {
        id: 'L5-16',
        judul: 'ユミさんへのメール',
        teks: 'ユミさん、こんにちは。今週{こんしゅう}の土曜日{どようび}、いっしょに買{か}い物{もの}に行{い}く約束{やくそく}をしましたね。でも、ごめんなさい。土曜日{どようび}は会社{かいしゃ}で仕事{しごと}をします。日曜日{にちようび}はどうですか。日曜日{にちようび}は一日{いちにち}ひまです。駅{えき}の前{まえ}で十時{じゅうじ}に会{あ}いませんか。返事{へんじ}を待{ま}っています。サリ',
        terjemahan: 'Yumi, halo. Kita sudah berjanji pergi belanja bersama Sabtu ini, ya. Tetapi maaf, hari Sabtu saya bekerja di kantor. Bagaimana kalau hari Minggu? Hari Minggu saya bebas seharian. Bagaimana kalau bertemu di depan stasiun pukul 10? Saya menunggu balasanmu. Sari',
        soal: [
          { id: 'L5-16-1', tanya: 'サリさんは土曜日{どようび}、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan Sari hari Sabtu?', opsi: ['ユミさんと買{か}い物{もの}に行{い}きます', 'うちで休{やす}みます', '会社{かいしゃ}で仕事{しごと}をします'], benar: 2, pembahasan: '土曜日は会社で仕事をします = hari Sabtu bekerja di kantor.' },
          { id: 'L5-16-2', tanya: 'サリさんはユミさんに何{なに}を聞{き}いていますか。', tanyaId: 'Apa yang ditanyakan Sari kepada Yumi?', opsi: ['日曜日{にちようび}に会{あ}ってもいいか', '土曜日{どようび}に何時{なんじ}に会{あ}うか', 'どこで買{か}い物{もの}をするか'], benar: 0, pembahasan: '日曜日はどうですか。…十時に会いませんか = bagaimana kalau hari Minggu, bertemu pukul 10.' },
        ],
      },
      {
        id: 'L5-17',
        judul: 'コンビニのアルバイト',
        teks: 'リンさんは大学{だいがく}の近{ちか}くのコンビニでアルバイトをしています。毎週{まいしゅう}火曜日{かようび}と木曜日{もくようび}の夜{よる}、六時{ろくじ}から十時{じゅうじ}まで働{はたら}きます。はじめは日本語{にほんご}がよくわかりませんでしたから、大変{たいへん}でした。でも、店長{てんちょう}さんやほかの人{ひと}がゆっくり話{はな}しましたから、今{いま}は大丈夫{だいじょうぶ}です。お客{きゃく}さんと話{はな}すのはとても楽{たの}しいです。日本語{にほんご}も前{まえ}より上手{じょうず}になりました。',
        terjemahan: 'Lin bekerja paruh waktu di minimarket dekat kampus. Setiap Selasa dan Kamis malam ia bekerja dari pukul 6 sampai pukul 10. Awalnya ia kurang mengerti bahasa Jepang, jadi terasa berat. Tetapi manajer dan orang lain berbicara pelan-pelan, jadi sekarang ia baik-baik saja. Berbicara dengan pelanggan sangat menyenangkan. Bahasa Jepangnya juga lebih lancar daripada dulu.',
        soal: [
          { id: 'L5-17-1', tanya: 'リンさんは一週間{いっしゅうかん}に何日{なんにち}働{はたら}きますか。', tanyaId: 'Lin bekerja berapa hari seminggu?', opsi: ['四日{よっか}', '二日{ふつか}', '一日{いちにち}'], benar: 1, pembahasan: '毎週火曜日と木曜日の夜…働きます = bekerja setiap Selasa dan Kamis malam (dua hari).' },
          { id: 'L5-17-2', tanya: 'リンさんは今{いま}、アルバイトをどう思{おも}っていますか。', tanyaId: 'Bagaimana perasaan Lin tentang kerja paruh waktunya sekarang?', opsi: ['楽{たの}しいです', '大変{たいへん}ですから、やめたいです', 'あまりおもしろくないです'], benar: 0, pembahasan: 'お客さんと話すのはとても楽しいです = berbicara dengan pelanggan sangat menyenangkan.' },
        ],
      },
      {
        id: 'L5-18',
        judul: 'わたしのおじいさん',
        teks: 'わたしのおじいさんは七十五歳{ななじゅうごさい}です。でも、とても元気{げんき}です。毎朝{まいあさ}五時{ごじ}に起{お}きて、犬{いぬ}と一時間{いちじかん}ぐらい散歩{さんぽ}します。昼{ひる}はうちの前{まえ}の小{ちい}さい畑{はたけ}でトマトやなすを作{つく}ります。夜{よる}は九時{くじ}に寝{ね}ます。お医者{いしゃ}さんは「おじいさんは若{わか}い人{ひと}より元気{げんき}ですね」と言{い}いました。',
        terjemahan: 'Kakek saya berumur 75 tahun. Tetapi ia sangat sehat. Setiap pagi ia bangun pukul 5 dan berjalan-jalan dengan anjing sekitar satu jam. Siang hari ia menanam tomat dan terung di kebun kecil di depan rumah. Malam hari ia tidur pukul 9. Dokter berkata, "Kakek lebih sehat daripada orang muda, ya."',
        soal: [
          { id: 'L5-18-1', tanya: 'おじいさんは毎朝{まいあさ}何{なに}をしますか。', tanyaId: 'Apa yang dilakukan kakek setiap pagi?', opsi: ['犬{いぬ}と散歩{さんぽ}します', 'やさいを買{か}いに行{い}きます', '病院{びょういん}へ行{い}きます'], benar: 0, pembahasan: '毎朝五時に起きて、犬と一時間ぐらい散歩します = setiap pagi bangun pukul 5 dan berjalan-jalan dengan anjing sekitar satu jam.' },
          { id: 'L5-18-2', tanya: 'お医者{いしゃ}さんは、おじいさんをどう思{おも}っていますか。', tanyaId: 'Bagaimana pendapat dokter tentang kakek?', opsi: ['あまり元気{げんき}ではありません', 'とても元気{げんき}です', 'もっと運動{うんどう}をしてください'], benar: 1, pembahasan: 'おじいさんは若い人より元気ですね = kakek lebih sehat daripada orang muda.' },
        ],
      },
      {
        id: 'L5-19',
        judul: '寮{りょう}のお知{し}らせ',
        teks: '寮{りょう}のみなさんへ。あしたの朝{あさ}は雪{ゆき}がたくさん降{ふ}ります。道{みち}があぶないですから、自転車{じてんしゃ}に乗{の}らないでください。会社{かいしゃ}のバスは、いつもより三十分{さんじゅっぷん}早{はや}く、朝{あさ}七時{しちじ}に寮{りょう}の前{まえ}から出{で}ます。バスに乗{の}る人{ひと}は、六時{ろくじ}五十分{ごじゅっぷん}に寮{りょう}の前{まえ}に来{き}てください。寮{りょう}の山田{やまだ}',
        terjemahan: 'Kepada seluruh penghuni asrama. Besok pagi salju akan turun banyak. Jalan berbahaya, jadi jangan naik sepeda. Bus perusahaan berangkat 30 menit lebih awal dari biasanya, pukul 7 pagi dari depan asrama. Yang naik bus, datanglah ke depan asrama pukul 6.50. Yamada, pengurus asrama',
        soal: [
          { id: 'L5-19-1', tanya: 'あした、会社{かいしゃ}のバスは何時{なんじ}に出{で}ますか。', tanyaId: 'Besok bus perusahaan berangkat pukul berapa?', opsi: ['六時{ろくじ}五十分{ごじゅっぷん}', '七時{しちじ}', '七時半{しちじはん}'], benar: 1, pembahasan: '朝七時に寮の前から出ます = berangkat pukul 7 pagi dari depan asrama.' },
          { id: 'L5-19-2', tanya: 'いつもは、会社{かいしゃ}のバスは何時{なんじ}に出{で}ますか。', tanyaId: 'Biasanya bus perusahaan berangkat pukul berapa?', opsi: ['六時半{ろくじはん}', '七時{しちじ}', '七時半{しちじはん}'], benar: 2, pembahasan: 'いつもより三十分早く、朝七時に…出ます = 30 menit lebih awal dari biasanya, yaitu pukul 7 (jadi biasanya pukul 7.30).' },
        ],
      },
      {
        id: 'L5-20',
        judul: 'わたしのゆめ',
        teks: 'わたしは今{いま}、インドネシアで日本語{にほんご}を勉強{べんきょう}しています。来年{らいねん}から日本{にほん}の工場{こうじょう}で三年{さんねん}働{はたら}きます。日本{にほん}で働{はたら}いて、国{くに}の家族{かぞく}にお金{かね}を送{おく}りたいです。三年後{さんねんご}に国{くに}へ帰{かえ}って、小{ちい}さいレストランを始{はじ}めたいです。インドネシアの料理{りょうり}と日本{にほん}の料理{りょうり}を作{つく}る店{みせ}です。ですから、日本{にほん}にいる時{とき}、日本{にほん}の料理{りょうり}もたくさん習{なら}いたいです。',
        terjemahan: 'Sekarang saya belajar bahasa Jepang di Indonesia. Mulai tahun depan saya akan bekerja tiga tahun di sebuah pabrik di Jepang. Saya ingin bekerja di Jepang dan mengirim uang kepada keluarga di negara asal. Tiga tahun kemudian saya ingin pulang dan membuka restoran kecil. Restoran yang membuat masakan Indonesia dan masakan Jepang. Karena itu, selama di Jepang saya juga ingin banyak belajar masakan Jepang.',
        soal: [
          { id: 'L5-20-1', tanya: 'この人{ひと}は日本{にほん}で何年{なんねん}働{はたら}きますか。', tanyaId: 'Berapa tahun orang ini akan bekerja di Jepang?', opsi: ['一年{いちねん}', '二年{にねん}', '三年{さんねん}'], benar: 2, pembahasan: '日本の工場で三年働きます = bekerja tiga tahun di pabrik di Jepang.' },
          { id: 'L5-20-2', tanya: 'どうして日本{にほん}の料理{りょうり}を習{なら}いたいですか。', tanyaId: 'Mengapa ia ingin belajar masakan Jepang?', opsi: ['日本{にほん}の料理{りょうり}が一番{いちばん}好{す}きだからです', '国{くに}で日本{にほん}の料理{りょうり}も作{つく}る店{みせ}を始{はじ}めたいからです', '日本{にほん}のレストランで働{はたら}きたいからです'], benar: 1, pembahasan: 'インドネシアの料理と日本の料理を作る店です。ですから…日本の料理もたくさん習いたいです = restorannya akan membuat masakan Indonesia dan Jepang, karena itu ingin belajar masakan Jepang.' },
        ],
      },
    ],
  },
];
