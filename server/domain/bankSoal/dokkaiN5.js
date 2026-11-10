// Bank soal dokkai N5 (Tes Online): 5 level × 45 bacaan × 2 soal. Bacaan 1–3 tiap level disempurnakan dari
// quiz_dokkai_n5_5_level.html, bacaan 4–45 ditulis baru (tata bahasa N5, topik sehari-hari dan kerja di Jepang);
// bacaan 21–45 lewat skill generate-soal (.claude/skills/generate-soal): gate mekanis + peninjau tanpa kunci.
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
      {
        id: 'L1-21',
        judul: '寮{りょう}のわたしの部屋{へや}',
        teks: 'わたしの部屋{へや}は寮{りょう}の二階{にかい}にあります。部屋{へや}にベッドとつくえがあります。テレビはありません。',
        terjemahan: 'Kamar saya ada di lantai dua asrama. Di kamar ada tempat tidur dan meja. Televisi tidak ada.',
        soal: [
          { id: 'L1-21-1', tanya: '部屋{へや}は何階{なんがい}にありますか。', tanyaId: 'Kamarnya ada di lantai berapa?', opsi: ['一階{いっかい}', '二階{にかい}', '三階{さんがい}'], benar: 1, pembahasan: 'わたしの部屋は寮の二階にあります = kamar saya ada di lantai dua asrama.' },
          { id: 'L1-21-2', tanya: '部屋{へや}に何{なに}がありませんか。', tanyaId: 'Apa yang tidak ada di kamar?', opsi: ['ベッド', 'つくえ', 'テレビ'], benar: 2, pembahasan: 'テレビはありません = televisi tidak ada.' },
        ],
      },
      {
        id: 'L1-22',
        judul: '妹{いもうと}の新{あたら}しいくつ',
        teks: '妹{いもうと}は先週{せんしゅう}、くつを買{か}いました。白{しろ}くて、かるいくつです。三千円{さんぜんえん}でした。',
        terjemahan: 'Adik perempuan saya membeli sepatu minggu lalu. Sepatunya putih dan ringan. Harganya 3.000 yen.',
        soal: [
          { id: 'L1-22-1', tanya: '妹{いもうと}さんはいつくつを買{か}いましたか。', tanyaId: 'Kapan adik perempuan membeli sepatu?', opsi: ['先週{せんしゅう}', 'きのう', '先月{せんげつ}'], benar: 0, pembahasan: '妹は先週、くつを買いました = adik perempuan membeli sepatu minggu lalu.' },
          { id: 'L1-22-2', tanya: 'くつはいくらでしたか。', tanyaId: 'Berapa harga sepatunya?', opsi: ['千円{せんえん}', '二千円{にせんえん}', '三千円{さんぜんえん}'], benar: 2, pembahasan: '三千円でした = harganya 3.000 yen.' },
        ],
      },
      {
        id: 'L1-23',
        judul: '朝{あさ}の会社{かいしゃ}バス',
        teks: 'わたしは毎朝{まいあさ}会社{かいしゃ}のバスに乗{の}ります。バスは七時{しちじ}に寮{りょう}の前{まえ}に来{き}ます。工場{こうじょう}まで二十分{にじゅっぷん}です。',
        terjemahan: 'Setiap pagi saya naik bus perusahaan. Bus datang ke depan asrama pukul 7. Sampai pabrik 20 menit.',
        soal: [
          { id: 'L1-23-1', tanya: 'バスは何時{なんじ}に来{き}ますか。', tanyaId: 'Bus datang pukul berapa?', opsi: ['六時{ろくじ}', '七時{しちじ}', '八時{はちじ}'], benar: 1, pembahasan: 'バスは七時に寮の前に来ます = bus datang ke depan asrama pukul 7.' },
          { id: 'L1-23-2', tanya: '工場{こうじょう}まで何分{なんぷん}ですか。', tanyaId: 'Berapa menit sampai pabrik?', opsi: ['二十分{にじゅっぷん}', '三十分{さんじゅっぷん}', '十分{じゅっぷん}'], benar: 0, pembahasan: '工場まで二十分です = sampai pabrik 20 menit.' },
        ],
      },
      {
        id: 'L1-24',
        judul: '料理{りょうり}が上手{じょうず}な母{はは}',
        teks: '母{はは}は料理{りょうり}が上手{じょうず}です。わたしは母{はは}のたまご料理{りょうり}が大好{だいす}きです。日曜日{にちようび}にいっしょに作{つく}ります。',
        terjemahan: 'Ibu saya pandai memasak. Saya sangat suka masakan telur buatan ibu. Pada hari Minggu kami memasak bersama.',
        soal: [
          { id: 'L1-24-1', tanya: '何{なん}の料理{りょうり}が大好{だいす}きですか。', tanyaId: 'Masakan apa yang sangat disukai?', opsi: ['たまご料理{りょうり}', '魚{さかな}料理{りょうり}', '肉{にく}料理{りょうり}'], benar: 0, pembahasan: 'わたしは母のたまご料理が大好きです = saya sangat suka masakan telur buatan ibu.' },
          { id: 'L1-24-2', tanya: 'いつお母{かあ}さんと料理{りょうり}を作{つく}りますか。', tanyaId: 'Kapan memasak bersama ibu?', opsi: ['土曜日{どようび}', '日曜日{にちようび}', '毎日{まいにち}'], benar: 1, pembahasan: '日曜日にいっしょに作ります = pada hari Minggu memasak bersama.' },
        ],
      },
      {
        id: 'L1-25',
        judul: 'ブディさんの夜{よる}の仕事{しごと}',
        teks: 'ブディさんは今週{こんしゅう}、夜{よる}の仕事{しごと}です。夜{よる}八時{はちじ}から朝{あさ}五時{ごじ}まで働{はたら}きます。昼{ひる}は寮{りょう}で寝{ね}ます。',
        terjemahan: 'Minggu ini Budi bekerja malam. Ia bekerja dari pukul 8 malam sampai pukul 5 pagi. Siang hari ia tidur di asrama.',
        soal: [
          { id: 'L1-25-1', tanya: 'ブディさんは何時{なんじ}から働{はたら}きますか。', tanyaId: 'Budi bekerja mulai pukul berapa?', opsi: ['朝{あさ}五時{ごじ}', '夜{よる}十時{じゅうじ}', '夜{よる}八時{はちじ}'], benar: 2, pembahasan: '夜八時から朝五時まで働きます = bekerja dari pukul 8 malam sampai pukul 5 pagi.' },
          { id: 'L1-25-2', tanya: '昼{ひる}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pada siang hari?', opsi: ['寮{りょう}で寝{ね}ます', '工場{こうじょう}で働{はたら}きます', '町{まち}へ行{い}きます'], benar: 0, pembahasan: '昼は寮で寝ます = siang hari tidur di asrama.' },
        ],
      },
      {
        id: 'L1-26',
        judul: '赤{あか}いかさ',
        teks: 'わたしのかさは赤{あか}いです。先月{せんげつ}、デパートで買{か}いました。千五百円{せんごひゃくえん}でした。',
        terjemahan: 'Payung saya berwarna merah. Saya membelinya bulan lalu di toserba. Harganya 1.500 yen.',
        soal: [
          { id: 'L1-26-1', tanya: 'かさはどこで買{か}いましたか。', tanyaId: 'Di mana payung itu dibeli?', opsi: ['スーパー', 'デパート', 'コンビニ'], benar: 1, pembahasan: '先月、デパートで買いました = dibeli bulan lalu di toserba.' },
          { id: 'L1-26-2', tanya: 'かさはいくらでしたか。', tanyaId: 'Berapa harga payungnya?', opsi: ['五百円{ごひゃくえん}', '千円{せんえん}', '千五百円{せんごひゃくえん}'], benar: 2, pembahasan: '千五百円でした = harganya 1.500 yen.' },
        ],
      },
      {
        id: 'L1-27',
        judul: '寮{りょう}のごみの日{ひ}',
        teks: '月曜日{げつようび}はごみの日{ひ}です。わたしは朝{あさ}七時{しちじ}にごみを出{だ}します。ごみは寮{りょう}の前{まえ}に出{だ}します。',
        terjemahan: 'Hari Senin adalah hari buang sampah. Saya mengeluarkan sampah pukul 7 pagi. Sampah diletakkan di depan asrama.',
        soal: [
          { id: 'L1-27-1', tanya: 'ごみの日{ひ}は何曜日{なんようび}ですか。', tanyaId: 'Hari buang sampah itu hari apa?', opsi: ['月曜日{げつようび}', '水曜日{すいようび}', '木曜日{もくようび}'], benar: 0, pembahasan: '月曜日はごみの日です = hari Senin adalah hari buang sampah.' },
          { id: 'L1-27-2', tanya: 'ごみはどこに出{だ}しますか。', tanyaId: 'Sampah diletakkan di mana?', opsi: ['寮{りょう}のうしろ', '寮{りょう}の前{まえ}', '工場{こうじょう}の前{まえ}'], benar: 1, pembahasan: 'ごみは寮の前に出します = sampah diletakkan di depan asrama.' },
        ],
      },
      {
        id: 'L1-28',
        judul: '先週{せんしゅう}の海{うみ}',
        teks: '先週{せんしゅう}、友{とも}だちと海{うみ}へ行{い}きました。電車{でんしゃ}で一時間{いちじかん}でした。海{うみ}はとてもきれいでした。',
        terjemahan: 'Minggu lalu saya pergi ke laut bersama teman. Naik kereta satu jam. Lautnya sangat indah.',
        soal: [
          { id: 'L1-28-1', tanya: 'だれと海{うみ}へ行{い}きましたか。', tanyaId: 'Dengan siapa pergi ke laut?', opsi: ['友{とも}だち', '家族{かぞく}', '会社{かいしゃ}の人{ひと}'], benar: 0, pembahasan: '先週、友だちと海へ行きました = minggu lalu pergi ke laut bersama teman.' },
          { id: 'L1-28-2', tanya: '海{うみ}まで電車{でんしゃ}でどのくらいでしたか。', tanyaId: 'Berapa lama naik kereta sampai ke laut?', opsi: ['三十分{さんじゅっぷん}', '一時間{いちじかん}', '二時間{にじかん}'], benar: 1, pembahasan: '電車で一時間でした = naik kereta satu jam.' },
        ],
      },
      {
        id: 'L1-29',
        judul: '工場{こうじょう}の服{ふく}とぼうし',
        teks: 'わたしは工場{こうじょう}で青{あお}い服{ふく}を着{き}ます。ぼうしは白{しろ}いです。くつは黒{くろ}いです。',
        terjemahan: 'Di pabrik saya memakai baju biru. Topinya putih. Sepatunya hitam.',
        soal: [
          { id: 'L1-29-1', tanya: '工場{こうじょう}の服{ふく}は何色{なにいろ}ですか。', tanyaId: 'Baju di pabrik berwarna apa?', opsi: ['白{しろ}', '黒{くろ}', '青{あお}'], benar: 2, pembahasan: 'わたしは工場で青い服を着ます = di pabrik saya memakai baju biru.' },
          { id: 'L1-29-2', tanya: '白{しろ}いのは何{なん}ですか。', tanyaId: 'Yang berwarna putih itu apa?', opsi: ['ぼうし', 'くつ', '服{ふく}'], benar: 0, pembahasan: 'ぼうしは白いです = topinya putih.' },
        ],
      },
      {
        id: 'L1-30',
        judul: '姉{あね}の子{こ}ども',
        teks: '姉{あね}には子{こ}どもが二人{ふたり}います。男{おとこ}の子{こ}と女{おんな}の子{こ}です。男{おとこ}の子{こ}は八歳{はっさい}です。',
        terjemahan: 'Kakak perempuan saya punya dua anak. Seorang anak laki-laki dan seorang anak perempuan. Anak laki-lakinya berumur 8 tahun.',
        soal: [
          { id: 'L1-30-1', tanya: 'お姉{ねえ}さんの子{こ}どもは何人{なんにん}ですか。', tanyaId: 'Ada berapa anak kakak perempuan?', opsi: ['一人{ひとり}', '二人{ふたり}', '三人{さんにん}'], benar: 1, pembahasan: '姉には子どもが二人います = kakak perempuan punya dua anak.' },
          { id: 'L1-30-2', tanya: '男{おとこ}の子{こ}は何歳{なんさい}ですか。', tanyaId: 'Berapa umur anak laki-lakinya?', opsi: ['八歳{はっさい}', '九歳{きゅうさい}', '十歳{じゅっさい}'], benar: 0, pembahasan: '男の子は八歳です = anak laki-lakinya berumur 8 tahun.' },
        ],
      },
      {
        id: 'L1-31',
        judul: '母{はは}へのお金{かね}',
        teks: 'わたしは毎月{まいつき}母{はは}にお金{かね}を送{おく}ります。銀行{ぎんこう}は工場{こうじょう}のとなりにあります。昼休{ひるやす}みに行{い}きます。',
        terjemahan: 'Setiap bulan saya mengirim uang kepada ibu. Bank ada di sebelah pabrik. Saya pergi ke sana pada waktu istirahat siang.',
        soal: [
          { id: 'L1-31-1', tanya: '銀行{ぎんこう}はどこにありますか。', tanyaId: 'Di mana banknya?', opsi: ['寮{りょう}のとなり', '駅{えき}のとなり', '工場{こうじょう}のとなり'], benar: 2, pembahasan: '銀行は工場のとなりにあります = bank ada di sebelah pabrik.' },
          { id: 'L1-31-2', tanya: 'いつ銀行{ぎんこう}へ行{い}きますか。', tanyaId: 'Kapan pergi ke bank?', opsi: ['昼休{ひるやす}み', '仕事{しごと}のあと', '休{やす}みの日{ひ}'], benar: 0, pembahasan: '昼休みに行きます = pergi pada waktu istirahat siang.' },
        ],
      },
      {
        id: 'L1-32',
        judul: '土曜日{どようび}のせんたく',
        teks: '土曜日{どようび}の朝{あさ}、せんたくをします。それから、部屋{へや}をそうじします。午後{ごご}はスーパーへ行{い}きます。',
        terjemahan: 'Sabtu pagi saya mencuci pakaian. Setelah itu saya membersihkan kamar. Sore harinya saya pergi ke supermarket.',
        soal: [
          { id: 'L1-32-1', tanya: 'いつせんたくをしますか。', tanyaId: 'Kapan mencuci pakaian?', opsi: ['土曜日{どようび}の午後{ごご}', '土曜日{どようび}の朝{あさ}', '日曜日{にちようび}の朝{あさ}'], benar: 1, pembahasan: '土曜日の朝、せんたくをします = Sabtu pagi mencuci pakaian.' },
          { id: 'L1-32-2', tanya: '午後{ごご}はどこへ行{い}きますか。', tanyaId: 'Sore harinya pergi ke mana?', opsi: ['公園{こうえん}', '図書館{としょかん}', 'スーパー'], benar: 2, pembahasan: '午後はスーパーへ行きます = sore harinya pergi ke supermarket.' },
        ],
      },
      {
        id: 'L1-33',
        judul: '先輩{せんぱい}の佐藤{さとう}さん',
        teks: '佐藤{さとう}さんは工場{こうじょう}の先輩{せんぱい}です。とてもしんせつな人{ひと}です。わたしは仕事{しごと}のあとで、佐藤{さとう}さんと日本語{にほんご}で話{はな}します。',
        terjemahan: 'Sato-san adalah senior saya di pabrik. Ia orang yang sangat ramah. Sesudah bekerja, saya berbicara dengan Sato-san dalam bahasa Jepang.',
        soal: [
          { id: 'L1-33-1', tanya: '佐藤{さとう}さんはどんな人{ひと}ですか。', tanyaId: 'Sato-san orang yang seperti apa?', opsi: ['しずかな人{ひと}', 'しんせつな人{ひと}', 'おもしろい人{ひと}'], benar: 1, pembahasan: 'とてもしんせつな人です = orang yang sangat ramah.' },
          { id: 'L1-33-2', tanya: 'いつ佐藤{さとう}さんと話{はな}しますか。', tanyaId: 'Kapan berbicara dengan Sato-san?', opsi: ['仕事{しごと}のまえ', '昼休{ひるやす}み', '仕事{しごと}のあと'], benar: 2, pembahasan: 'わたしは仕事のあとで、佐藤さんと日本語で話します = sesudah bekerja, saya berbicara dengan Sato-san dalam bahasa Jepang.' },
        ],
      },
      {
        id: 'L1-34',
        judul: 'アグスさんのギター',
        teks: 'アグスさんはギターが上手{じょうず}です。毎晩{まいばん}三十分{さんじゅっぷん}れんしゅうします。でも、歌{うた}は上手{じょうず}ではありません。',
        terjemahan: 'Agus pandai bermain gitar. Setiap malam ia berlatih 30 menit. Tetapi ia tidak pandai bernyanyi.',
        soal: [
          { id: 'L1-34-1', tanya: '毎晩{まいばん}どのくらいれんしゅうしますか。', tanyaId: 'Setiap malam berlatih berapa lama?', opsi: ['三十分{さんじゅっぷん}', '一時間{いちじかん}', '二時間{にじかん}'], benar: 0, pembahasan: '毎晩三十分れんしゅうします = setiap malam berlatih 30 menit.' },
          { id: 'L1-34-2', tanya: 'アグスさんは何{なに}が上手{じょうず}ではありませんか。', tanyaId: 'Agus tidak pandai dalam hal apa?', opsi: ['ギター', '歌{うた}', 'ピアノ'], benar: 1, pembahasan: 'でも、歌は上手ではありません = tetapi ia tidak pandai bernyanyi.' },
        ],
      },
      {
        id: 'L1-35',
        judul: '十時{じゅうじ}の休{やす}み',
        teks: '十時{じゅうじ}に十五分{じゅうごふん}の休{やす}みがあります。わたしは食堂{しょくどう}でお茶{ちゃ}を飲{の}みます。それから、また働{はたら}きます。',
        terjemahan: 'Pukul 10 ada istirahat 15 menit. Saya minum teh di kantin. Setelah itu saya bekerja lagi.',
        soal: [
          { id: 'L1-35-1', tanya: '休{やす}みは何分{なんぷん}ですか。', tanyaId: 'Istirahatnya berapa menit?', opsi: ['十分{じゅっぷん}', '二十分{にじゅっぷん}', '十五分{じゅうごふん}'], benar: 2, pembahasan: '十時に十五分の休みがあります = pukul 10 ada istirahat 15 menit.' },
          { id: 'L1-35-2', tanya: 'どこでお茶{ちゃ}を飲{の}みますか。', tanyaId: 'Di mana minum teh?', opsi: ['事務所{じむしょ}', '食堂{しょくどう}', '外{そと}'], benar: 1, pembahasan: 'わたしは食堂でお茶を飲みます = saya minum teh di kantin.' },
        ],
      },
      {
        id: 'L1-36',
        judul: '四月{しがつ}の公園{こうえん}',
        teks: '四月{しがつ}です。公園{こうえん}の花{はな}がとてもきれいです。日曜日{にちようび}に姉{あね}と公園{こうえん}へ行{い}きました。たくさん写真{しゃしん}をとりました。',
        terjemahan: 'Sekarang bulan April. Bunga di taman sangat indah. Pada hari Minggu saya pergi ke taman bersama kakak perempuan. Kami mengambil banyak foto.',
        soal: [
          { id: 'L1-36-1', tanya: 'いつ公園{こうえん}へ行{い}きましたか。', tanyaId: 'Kapan pergi ke taman?', opsi: ['土曜日{どようび}', '月曜日{げつようび}', '日曜日{にちようび}'], benar: 2, pembahasan: '日曜日に姉と公園へ行きました = pada hari Minggu pergi ke taman bersama kakak perempuan.' },
          { id: 'L1-36-2', tanya: '公園{こうえん}で何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan di taman?', opsi: ['弁当{べんとう}を食{た}べました', '写真{しゃしん}をとりました', '絵{え}をかきました'], benar: 1, pembahasan: 'たくさん写真をとりました = mengambil banyak foto.' },
        ],
      },
      {
        id: 'L1-37',
        judul: '同{おな}じ部屋{へや}のリオさん',
        teks: 'リオさんはわたしと同{おな}じ部屋{へや}です。フィリピンから来{き}ました。毎晩{まいばん}いっしょに日本語{にほんご}を勉強{べんきょう}します。',
        terjemahan: 'Rio sekamar dengan saya. Ia datang dari Filipina. Setiap malam kami belajar bahasa Jepang bersama.',
        soal: [
          { id: 'L1-37-1', tanya: 'リオさんはどこから来{き}ましたか。', tanyaId: 'Rio datang dari mana?', opsi: ['フィリピン', 'ベトナム', 'タイ'], benar: 0, pembahasan: 'フィリピンから来ました = datang dari Filipina.' },
          { id: 'L1-37-2', tanya: '毎晩{まいばん}いっしょに何{なに}をしますか。', tanyaId: 'Setiap malam melakukan apa bersama-sama?', opsi: ['料理{りょうり}を作{つく}ります', '日本語{にほんご}を勉強{べんきょう}します', 'テレビを見{み}ます'], benar: 1, pembahasan: '毎晩いっしょに日本語を勉強します = setiap malam belajar bahasa Jepang bersama.' },
        ],
      },
      {
        id: 'L1-38',
        judul: '田中{たなか}さんと犬{いぬ}',
        teks: '田中{たなか}さんは毎朝{まいあさ}犬{いぬ}と散歩{さんぽ}します。六時{ろくじ}に家{いえ}を出{で}ます。川{かわ}の近{ちか}くを歩{ある}きます。',
        terjemahan: 'Setiap pagi Tanaka-san berjalan-jalan dengan anjingnya. Ia berangkat dari rumah pukul 6. Ia berjalan di dekat sungai.',
        soal: [
          { id: 'L1-38-1', tanya: '田中{たなか}さんは何時{なんじ}に家{いえ}を出{で}ますか。', tanyaId: 'Tanaka-san berangkat dari rumah pukul berapa?', opsi: ['五時{ごじ}', '七時{しちじ}', '六時{ろくじ}'], benar: 2, pembahasan: '六時に家を出ます = berangkat dari rumah pukul 6.' },
          { id: 'L1-38-2', tanya: 'どこを歩{ある}きますか。', tanyaId: 'Berjalan di mana?', opsi: ['川{かわ}の近{ちか}く', '公園{こうえん}の中{なか}', '駅{えき}の前{まえ}'], benar: 0, pembahasan: '川の近くを歩きます = berjalan di dekat sungai.' },
        ],
      },
      {
        id: 'L1-39',
        judul: '夜{よる}の日本語{にほんご}教室{きょうしつ}',
        teks: '毎週{まいしゅう}水曜日{すいようび}の夜{よる}、日本語{にほんご}の教室{きょうしつ}へ行{い}きます。教室{きょうしつ}は寮{りょう}の近{ちか}くにあります。先生{せんせい}は木村{きむら}さんです。',
        terjemahan: 'Setiap Rabu malam saya pergi ke kelas bahasa Jepang. Kelasnya ada di dekat asrama. Gurunya Kimura-san.',
        soal: [
          { id: 'L1-39-1', tanya: '何曜日{なんようび}に教室{きょうしつ}へ行{い}きますか。', tanyaId: 'Hari apa pergi ke kelas?', opsi: ['水曜日{すいようび}', '火曜日{かようび}', '金曜日{きんようび}'], benar: 0, pembahasan: '毎週水曜日の夜、日本語の教室へ行きます = setiap Rabu malam pergi ke kelas bahasa Jepang.' },
          { id: 'L1-39-2', tanya: '先生{せんせい}はだれですか。', tanyaId: 'Siapa gurunya?', opsi: ['山田{やまだ}さん', '佐藤{さとう}さん', '木村{きむら}さん'], benar: 2, pembahasan: '先生は木村さんです = gurunya Kimura-san.' },
        ],
      },
      {
        id: 'L1-40',
        judul: '国{くに}の家族{かぞく}への電話{でんわ}',
        teks: 'わたしの家族{かぞく}はインドネシアにいます。毎週{まいしゅう}日曜日{にちようび}の夜{よる}、電話{でんわ}をします。いつも母{はは}と三十分{さんじゅっぷん}ぐらい話{はな}します。',
        terjemahan: 'Keluarga saya ada di Indonesia. Setiap Minggu malam saya menelepon. Saya selalu berbicara dengan ibu kira-kira 30 menit.',
        soal: [
          { id: 'L1-40-1', tanya: 'いつ家族{かぞく}に電話{でんわ}をしますか。', tanyaId: 'Kapan menelepon keluarga?', opsi: ['土曜日{どようび}の夜{よる}', '日曜日{にちようび}の朝{あさ}', '日曜日{にちようび}の夜{よる}'], benar: 2, pembahasan: '毎週日曜日の夜、電話をします = setiap Minggu malam menelepon.' },
          { id: 'L1-40-2', tanya: 'いつもだれと話{はな}しますか。', tanyaId: 'Selalu berbicara dengan siapa?', opsi: ['父{ちち}', '母{はは}', '妹{いもうと}'], benar: 1, pembahasan: 'いつも母と三十分ぐらい話します = selalu berbicara dengan ibu kira-kira 30 menit.' },
        ],
      },
      {
        id: 'L1-41',
        judul: '古{ふる}い自転車{じてんしゃ}',
        teks: '先週{せんしゅう}、自転車{じてんしゃ}を買{か}いました。古{ふる}い自転車{じてんしゃ}です。八千円{はっせんえん}でした。毎日{まいにち}自転車{じてんしゃ}でスーパーへ行{い}きます。',
        terjemahan: 'Minggu lalu saya membeli sepeda. Itu sepeda tua. Harganya 8.000 yen. Setiap hari saya pergi ke supermarket naik sepeda.',
        soal: [
          { id: 'L1-41-1', tanya: '自転車{じてんしゃ}はいくらでしたか。', tanyaId: 'Berapa harga sepedanya?', opsi: ['三千円{さんぜんえん}', '六千円{ろくせんえん}', '八千円{はっせんえん}'], benar: 2, pembahasan: '八千円でした = harganya 8.000 yen.' },
          { id: 'L1-41-2', tanya: '毎日{まいにち}自転車{じてんしゃ}でどこへ行{い}きますか。', tanyaId: 'Setiap hari pergi ke mana naik sepeda?', opsi: ['スーパー', '工場{こうじょう}', '駅{えき}'], benar: 0, pembahasan: '毎日自転車でスーパーへ行きます = setiap hari pergi ke supermarket naik sepeda.' },
        ],
      },
      {
        id: 'L1-42',
        judul: 'マヤさんへのプレゼント',
        teks: 'あしたはマヤさんの誕生日{たんじょうび}です。わたしは花{はな}をあげます。花{はな}は駅{えき}の前{まえ}の店{みせ}で買{か}いました。',
        terjemahan: 'Besok ulang tahun Maya. Saya akan memberinya bunga. Bunganya saya beli di toko di depan stasiun.',
        soal: [
          { id: 'L1-42-1', tanya: 'マヤさんに何{なに}をあげますか。', tanyaId: 'Apa yang diberikan kepada Maya?', opsi: ['本{ほん}', '花{はな}', 'ケーキ'], benar: 1, pembahasan: 'わたしは花をあげます = saya akan memberinya bunga.' },
          { id: 'L1-42-2', tanya: '花{はな}はどこで買{か}いましたか。', tanyaId: 'Di mana bunganya dibeli?', opsi: ['駅{えき}の前{まえ}の店{みせ}', '公園{こうえん}の近{ちか}くの店{みせ}', '学校{がっこう}のとなりの店{みせ}'], benar: 0, pembahasan: '花は駅の前の店で買いました = bunganya dibeli di toko di depan stasiun.' },
        ],
      },
      {
        id: 'L1-43',
        judul: '寮{りょう}から駅{えき}まで',
        teks: '寮{りょう}から駅{えき}まで歩{ある}いて十五分{じゅうごふん}です。自転車{じてんしゃ}で五分{ごふん}です。わたしはいつも歩{ある}いて行{い}きます。',
        terjemahan: 'Dari asrama ke stasiun 15 menit berjalan kaki. Naik sepeda 5 menit. Saya selalu pergi dengan berjalan kaki.',
        soal: [
          { id: 'L1-43-1', tanya: '駅{えき}まで自転車{じてんしゃ}で何分{なんぷん}ですか。', tanyaId: 'Berapa menit ke stasiun naik sepeda?', opsi: ['五分{ごふん}', '十分{じゅっぷん}', '十五分{じゅうごふん}'], benar: 0, pembahasan: '自転車で五分です = naik sepeda 5 menit.' },
          { id: 'L1-43-2', tanya: 'いつもどうやって駅{えき}へ行{い}きますか。', tanyaId: 'Selalu pergi ke stasiun dengan cara apa?', opsi: ['バスで行{い}きます', '自転車{じてんしゃ}で行{い}きます', '歩{ある}いて行{い}きます'], benar: 2, pembahasan: 'わたしはいつも歩いて行きます = saya selalu pergi dengan berjalan kaki.' },
        ],
      },
      {
        id: 'L1-44',
        judul: '日本{にほん}へ来{き}ました',
        teks: 'わたしは去年{きょねん}の四月{しがつ}に日本{にほん}へ来{き}ました。今{いま}、工場{こうじょう}で働{はたら}いています。仕事{しごと}は大変{たいへん}ですが、楽{たの}しいです。',
        terjemahan: 'Saya datang ke Jepang pada bulan April tahun lalu. Sekarang saya bekerja di pabrik. Pekerjaannya berat, tetapi menyenangkan.',
        soal: [
          { id: 'L1-44-1', tanya: 'いつ日本{にほん}へ来{き}ましたか。', tanyaId: 'Kapan datang ke Jepang?', opsi: ['今年{ことし}の四月{しがつ}', '去年{きょねん}の四月{しがつ}', '去年{きょねん}の七月{しちがつ}'], benar: 1, pembahasan: 'わたしは去年の四月に日本へ来ました = saya datang ke Jepang pada bulan April tahun lalu.' },
          { id: 'L1-44-2', tanya: '仕事{しごと}はどうですか。', tanyaId: 'Bagaimana pekerjaannya?', opsi: ['大変{たいへん}ですが、楽{たの}しいです', '大変{たいへん}で、楽{たの}しくないです', 'かんたんで、楽{たの}しいです'], benar: 0, pembahasan: '仕事は大変ですが、楽しいです = pekerjaannya berat, tetapi menyenangkan.' },
        ],
      },
      {
        id: 'L1-45',
        judul: '夜{よる}の安{やす}い弁当{べんとう}',
        teks: '仕事{しごと}のあとで、スーパーへ行{い}きます。夜{よる}七時{しちじ}から弁当{べんとう}が安{やす}いです。わたしはよく魚{さかな}の弁当{べんとう}を買{か}います。',
        terjemahan: 'Sesudah bekerja, saya pergi ke supermarket. Mulai pukul 7 malam bento murah. Saya sering membeli bento ikan.',
        soal: [
          { id: 'L1-45-1', tanya: '弁当{べんとう}は何時{なんじ}から安{やす}いですか。', tanyaId: 'Bento murah mulai pukul berapa?', opsi: ['夜{よる}六時{ろくじ}', '夜{よる}七時{しちじ}', '夜{よる}九時{くじ}'], benar: 1, pembahasan: '夜七時から弁当が安いです = mulai pukul 7 malam bento murah.' },
          { id: 'L1-45-2', tanya: 'よく何{なん}の弁当{べんとう}を買{か}いますか。', tanyaId: 'Sering membeli bento apa?', opsi: ['肉{にく}の弁当{べんとう}', '野菜{やさい}の弁当{べんとう}', '魚{さかな}の弁当{べんとう}'], benar: 2, pembahasan: 'わたしはよく魚の弁当を買います = saya sering membeli bento ikan.' },
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
      {
        id: 'L2-21',
        judul: '夕方{ゆうがた}のスーパー',
        teks: '駅{えき}の前{まえ}のスーパーは、夕方{ゆうがた}六時{ろくじ}から肉{にく}と魚{さかな}が安{やす}くなります。わたしは仕事{しごと}のあとで行{い}きます。きのうはとり肉{にく}を三百円{さんびゃくえん}で買{か}いました。',
        terjemahan: 'Di supermarket depan stasiun, daging dan ikan menjadi murah mulai pukul 6 sore. Saya pergi ke sana sesudah bekerja. Kemarin saya membeli daging ayam seharga 300 yen.',
        soal: [
          { id: 'L2-21-1', tanya: '肉{にく}と魚{さかな}は何時{なんじ}から安{やす}くなりますか。', tanyaId: 'Mulai pukul berapa daging dan ikan menjadi murah?', opsi: ['五時{ごじ}', '六時{ろくじ}', '七時{しちじ}'], benar: 1, pembahasan: '夕方六時から肉と魚が安くなります = daging dan ikan menjadi murah mulai pukul 6 sore.' },
          { id: 'L2-21-2', tanya: 'きのう何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli kemarin?', opsi: ['魚{さかな}', '野菜{やさい}', 'とり肉{にく}'], benar: 2, pembahasan: 'きのうはとり肉を三百円で買いました = kemarin membeli daging ayam seharga 300 yen.' },
        ],
      },
      {
        id: 'L2-22',
        judul: '朝{あさ}の会社{かいしゃ}のバス',
        teks: 'わたしは毎朝{まいあさ}、会社{かいしゃ}のバスで工場{こうじょう}へ行{い}きます。バスは七時{しちじ}十分{じゅっぷん}に寮{りょう}の前{まえ}を出{で}ます。工場{こうじょう}まで二十分{にじゅっぷん}かかります。',
        terjemahan: 'Setiap pagi saya pergi ke pabrik naik bus perusahaan. Bus berangkat dari depan asrama pukul 7.10. Ke pabrik perlu 20 menit.',
        soal: [
          { id: 'L2-22-1', tanya: 'バスは何時{なんじ}に出{で}ますか。', tanyaId: 'Pukul berapa bus berangkat?', opsi: ['七時{しちじ}', '七時{しちじ}二十分{にじゅっぷん}', '七時{しちじ}十分{じゅっぷん}'], benar: 2, pembahasan: 'バスは七時十分に寮の前を出ます = bus berangkat dari depan asrama pukul 7.10.' },
          { id: 'L2-22-2', tanya: 'バスはどこから出{で}ますか。', tanyaId: 'Bus berangkat dari mana?', opsi: ['寮{りょう}の前{まえ}', '駅{えき}の前{まえ}', '工場{こうじょう}の前{まえ}'], benar: 0, pembahasan: '寮の前を出ます = berangkat dari depan asrama.' },
        ],
      },
      {
        id: 'L2-23',
        judul: 'おばあさんのうち',
        teks: 'おばあさんのうちは海{うみ}の近{ちか}くにあります。わたしのうちから車{くるま}で二時間{にじかん}かかります。夏休{なつやす}みに家族{かぞく}と行{い}って、海{うみ}で泳{およ}ぎました。',
        terjemahan: 'Rumah nenek ada di dekat laut. Dari rumah saya perlu dua jam naik mobil. Pada liburan musim panas saya pergi ke sana bersama keluarga dan berenang di laut.',
        soal: [
          { id: 'L2-23-1', tanya: 'おばあさんのうちまで車{くるま}でどのぐらいかかりますか。', tanyaId: 'Berapa lama perjalanan ke rumah nenek naik mobil?', opsi: ['一時間{いちじかん}', '二時間{にじかん}', '三時間{さんじかん}'], benar: 1, pembahasan: 'わたしのうちから車で二時間かかります = dari rumah saya perlu dua jam naik mobil.' },
          { id: 'L2-23-2', tanya: 'おばあさんのうちはどこにありますか。', tanyaId: 'Di mana rumah nenek berada?', opsi: ['海{うみ}の近{ちか}く', '山{やま}の近{ちか}く', '駅{えき}の近{ちか}く'], benar: 0, pembahasan: 'おばあさんのうちは海の近くにあります = rumah nenek ada di dekat laut.' },
        ],
      },
      {
        id: 'L2-24',
        judul: '燃{も}えるごみの日{ひ}',
        teks: 'わたしの町{まち}では、燃{も}えるごみの日{ひ}は火曜日{かようび}と金曜日{きんようび}です。ごみは朝{あさ}八時{はちじ}まえに出{だ}します。寮{りょう}のごみは、となりの公園{こうえん}の前{まえ}に出{だ}します。',
        terjemahan: 'Di kota saya, hari sampah yang bisa dibakar adalah Selasa dan Jumat. Sampah dikeluarkan sebelum pukul 8 pagi. Sampah asrama dikeluarkan di depan taman di sebelah asrama.',
        soal: [
          { id: 'L2-24-1', tanya: '燃{も}えるごみの日{ひ}は何曜日{なんようび}ですか。', tanyaId: 'Hari apa hari sampah yang bisa dibakar?', opsi: ['火曜日{かようび}と金曜日{きんようび}', '月曜日{げつようび}と木曜日{もくようび}', '火曜日{かようび}と土曜日{どようび}'], benar: 0, pembahasan: '燃えるごみの日は火曜日と金曜日です = hari sampah yang bisa dibakar adalah Selasa dan Jumat.' },
          { id: 'L2-24-2', tanya: '寮{りょう}のごみはどこに出{だ}しますか。', tanyaId: 'Di mana sampah asrama dikeluarkan?', opsi: ['寮{りょう}の前{まえ}', '公園{こうえん}の前{まえ}', '駅{えき}の前{まえ}'], benar: 1, pembahasan: '寮のごみは、となりの公園の前に出します = sampah asrama dikeluarkan di depan taman di sebelah asrama.' },
        ],
      },
      {
        id: 'L2-25',
        judul: '寮{りょう}の近{ちか}くのコインランドリー',
        teks: '寮{りょう}の近{ちか}くにコインランドリーがあります。朝{あさ}六時{ろくじ}から夜{よる}十一時{じゅういちじ}まで開{あ}いています。せんたくは一回{いっかい}三百円{さんびゃくえん}で、四十分{よんじゅっぷん}かかります。',
        terjemahan: 'Di dekat asrama ada tempat cuci koin. Tempat itu buka dari pukul 6 pagi sampai pukul 11 malam. Mencuci sekali 300 yen dan perlu 40 menit.',
        soal: [
          { id: 'L2-25-1', tanya: 'コインランドリーは夜{よる}何時{なんじ}まで開{あ}いていますか。', tanyaId: 'Tempat cuci koin buka sampai pukul berapa malam?', opsi: ['九時{くじ}', '十時{じゅうじ}', '十一時{じゅういちじ}'], benar: 2, pembahasan: '朝六時から夜十一時まで開いています = buka dari pukul 6 pagi sampai pukul 11 malam.' },
          { id: 'L2-25-2', tanya: 'せんたくは何分{なんぷん}かかりますか。', tanyaId: 'Mencuci perlu berapa menit?', opsi: ['二十分{にじゅっぷん}', '三十分{さんじゅっぷん}', '四十分{よんじゅっぷん}'], benar: 2, pembahasan: 'せんたくは一回三百円で、四十分かかります = mencuci sekali 300 yen dan perlu 40 menit.' },
        ],
      },
      {
        id: 'L2-26',
        judul: 'アグスさんの夜{よる}の仕事{しごと}',
        teks: 'アグスさんは今週{こんしゅう}、夜{よる}の仕事{しごと}です。夜{よる}十時{じゅうじ}から朝{あさ}六時{ろくじ}まで工場{こうじょう}で働{はたら}きます。午前{ごぜん}二時{にじ}に一時間{いちじかん}休{やす}みます。仕事{しごと}のあとで、寮{りょう}へ帰{かえ}って寝{ね}ます。',
        terjemahan: 'Minggu ini Agus bekerja malam. Ia bekerja di pabrik dari pukul 10 malam sampai pukul 6 pagi. Pukul 2 dini hari ia beristirahat satu jam. Sesudah bekerja ia pulang ke asrama dan tidur.',
        soal: [
          { id: 'L2-26-1', tanya: 'アグスさんの仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Pukul berapa pekerjaan Agus selesai?', opsi: ['朝{あさ}六時{ろくじ}', '午前{ごぜん}二時{にじ}', '夜{よる}十時{じゅうじ}'], benar: 0, pembahasan: '夜十時から朝六時まで工場で働きます = bekerja di pabrik dari pukul 10 malam sampai pukul 6 pagi (jadi selesai pukul 6 pagi).' },
          { id: 'L2-26-2', tanya: 'アグスさんはどのぐらい休{やす}みますか。', tanyaId: 'Berapa lama Agus beristirahat?', opsi: ['三十分{さんじゅっぷん}', '一時間{いちじかん}', '二時間{にじかん}'], benar: 1, pembahasan: '午前二時に一時間休みます = pukul 2 dini hari beristirahat satu jam.' },
        ],
      },
      {
        id: 'L2-27',
        judul: '国{くに}への荷物{にもつ}',
        teks: 'きのう、郵便局{ゆうびんきょく}からインドネシアの母{はは}に荷物{にもつ}を送{おく}りました。中{なか}はおかしと服{ふく}です。四千円{よんせんえん}かかりました。荷物{にもつ}は十日{とおか}ぐらいで着{つ}きます。',
        terjemahan: 'Kemarin saya mengirim paket dari kantor pos kepada ibu di Indonesia. Isinya kue dan pakaian. Biayanya 4.000 yen. Paket akan tiba dalam kira-kira sepuluh hari.',
        soal: [
          { id: 'L2-27-1', tanya: '荷物{にもつ}の中{なか}は何{なん}ですか。', tanyaId: 'Apa isi paket itu?', opsi: ['おかしと本{ほん}', '服{ふく}とくつ', 'おかしと服{ふく}'], benar: 2, pembahasan: '中はおかしと服です = isinya kue dan pakaian.' },
          { id: 'L2-27-2', tanya: '荷物{にもつ}は何日{なんにち}ぐらいで着{つ}きますか。', tanyaId: 'Paket tiba dalam kira-kira berapa hari?', opsi: ['十日{とおか}ぐらい', '四日{よっか}ぐらい', '七日{なのか}ぐらい'], benar: 0, pembahasan: '荷物は十日ぐらいで着きます = paket tiba dalam kira-kira sepuluh hari.' },
        ],
      },
      {
        id: 'L2-28',
        judul: '駅{えき}のビルの百円{ひゃくえん}ショップ',
        teks: '駅{えき}のビルの二階{にかい}に百円{ひゃくえん}ショップがあります。きのう、ここでさらを三枚{さんまい}とコップを二{ふた}つ買{か}いました。さらもコップも一{ひと}つ百十円{ひゃくじゅうえん}です。全部{ぜんぶ}で五百五十円{ごひゃくごじゅうえん}でした。',
        terjemahan: 'Di lantai dua gedung stasiun ada toko serba seratus yen. Kemarin saya membeli tiga piring dan dua gelas di sini. Piring maupun gelas harganya 110 yen per buah. Semuanya 550 yen.',
        soal: [
          { id: 'L2-28-1', tanya: 'さらを何枚{なんまい}買{か}いましたか。', tanyaId: 'Berapa piring yang dibeli?', opsi: ['二枚{にまい}', '三枚{さんまい}', '五枚{ごまい}'], benar: 1, pembahasan: 'さらを三枚とコップを二つ買いました = membeli tiga piring dan dua gelas.' },
          { id: 'L2-28-2', tanya: '百円{ひゃくえん}ショップはどこにありますか。', tanyaId: 'Di mana toko serba seratus yen itu berada?', opsi: ['駅{えき}のビルの一階{いっかい}', '駅{えき}のビルの二階{にかい}', '駅{えき}のビルの三階{さんがい}'], benar: 1, pembahasan: '駅のビルの二階に百円ショップがあります = di lantai dua gedung stasiun ada toko serba seratus yen.' },
        ],
      },
      {
        id: 'L2-29',
        judul: '動物園{どうぶつえん}のきっぷ',
        teks: '日曜日{にちようび}に妹{いもうと}と動物園{どうぶつえん}へ行{い}きました。きっぷは大人{おとな}が六百円{ろっぴゃくえん}、子{こ}どもが二百円{にひゃくえん}です。動物園{どうぶつえん}は午後{ごご}五時{ごじ}に閉{し}まります。',
        terjemahan: 'Hari Minggu saya pergi ke kebun binatang bersama adik perempuan. Tiketnya 600 yen untuk dewasa dan 200 yen untuk anak-anak. Kebun binatang tutup pukul 5 sore.',
        soal: [
          { id: 'L2-29-1', tanya: '子{こ}どものきっぷはいくらですか。', tanyaId: 'Berapa harga tiket anak-anak?', opsi: ['二百円{にひゃくえん}', '六百円{ろっぴゃくえん}', '八百円{はっぴゃくえん}'], benar: 0, pembahasan: 'きっぷは大人が六百円、子どもが二百円です = tiket 600 yen untuk dewasa dan 200 yen untuk anak-anak.' },
          { id: 'L2-29-2', tanya: '動物園{どうぶつえん}は何時{なんじ}に閉{し}まりますか。', tanyaId: 'Pukul berapa kebun binatang tutup?', opsi: ['三時{さんじ}', '四時{よじ}', '五時{ごじ}'], benar: 2, pembahasan: '動物園は午後五時に閉まります = kebun binatang tutup pukul 5 sore.' },
        ],
      },
      {
        id: 'L2-30',
        judul: '土曜日{どようび}の教室{きょうしつ}',
        teks: 'わたしは毎週{まいしゅう}土曜日{どようび}に日本語{にほんご}の教室{きょうしつ}へ行{い}きます。教室{きょうしつ}は駅{えき}の近{ちか}くのビルの三階{さんがい}にあります。午前{ごぜん}十時{じゅうじ}から十二時{じゅうにじ}まで勉強{べんきょう}します。',
        terjemahan: 'Setiap hari Sabtu saya pergi ke kelas bahasa Jepang. Kelasnya ada di lantai tiga gedung dekat stasiun. Saya belajar dari pukul 10 pagi sampai pukul 12.',
        soal: [
          { id: 'L2-30-1', tanya: '教室{きょうしつ}は何階{なんがい}にありますか。', tanyaId: 'Kelasnya ada di lantai berapa?', opsi: ['二階{にかい}', '三階{さんがい}', '四階{よんかい}'], benar: 1, pembahasan: '教室は駅の近くのビルの三階にあります = kelasnya ada di lantai tiga gedung dekat stasiun.' },
          { id: 'L2-30-2', tanya: '何時{なんじ}まで勉強{べんきょう}しますか。', tanyaId: 'Belajar sampai pukul berapa?', opsi: ['十時{じゅうじ}', '十一時{じゅういちじ}', '十二時{じゅうにじ}'], benar: 2, pembahasan: '午前十時から十二時まで勉強します = belajar dari pukul 10 pagi sampai pukul 12.' },
        ],
      },
      {
        id: 'L2-31',
        judul: '二階{にかい}の部屋{へや}',
        teks: 'わたしの部屋{へや}は寮{りょう}の二階{にかい}にあります。となりの部屋{へや}にベトナム人{じん}のアンさんが住{す}んでいます。おふろとせんたくきは一階{いっかい}にあります。',
        terjemahan: 'Kamar saya ada di lantai dua asrama. Di kamar sebelah tinggal An, orang Vietnam. Kamar mandi dan mesin cuci ada di lantai satu.',
        soal: [
          { id: 'L2-31-1', tanya: 'おふろは何階{なんがい}にありますか。', tanyaId: 'Kamar mandi ada di lantai berapa?', opsi: ['一階{いっかい}', '二階{にかい}', '三階{さんがい}'], benar: 0, pembahasan: 'おふろとせんたくきは一階にあります = kamar mandi dan mesin cuci ada di lantai satu.' },
          { id: 'L2-31-2', tanya: 'アンさんはどこの国{くに}の人{ひと}ですか。', tanyaId: 'An orang dari negara mana?', opsi: ['インドネシア', '日本{にほん}', 'ベトナム'], benar: 2, pembahasan: 'となりの部屋にベトナム人のアンさんが住んでいます = di kamar sebelah tinggal An, orang Vietnam.' },
        ],
      },
      {
        id: 'L2-32',
        judul: '工場{こうじょう}の朝{あさ}の運動{うんどう}',
        teks: 'わたしは毎朝{まいあさ}八時{はちじ}に工場{こうじょう}に着{つ}きます。八時{はちじ}二十分{にじゅっぷん}から、みんなで十分{じゅっぷん}運動{うんどう}をします。仕事{しごと}は八時半{はちじはん}に始{はじ}まります。',
        terjemahan: 'Setiap pagi saya tiba di pabrik pukul 8. Mulai pukul 8.20 kami semua berolahraga selama 10 menit. Pekerjaan mulai pukul setengah sembilan.',
        soal: [
          { id: 'L2-32-1', tanya: '仕事{しごと}は何時{なんじ}に始{はじ}まりますか。', tanyaId: 'Pukul berapa pekerjaan mulai?', opsi: ['八時{はちじ}', '八時{はちじ}二十分{にじゅっぷん}', '八時半{はちじはん}'], benar: 2, pembahasan: '仕事は八時半に始まります = pekerjaan mulai pukul setengah sembilan.' },
          { id: 'L2-32-2', tanya: 'みんなで何分{なんぷん}運動{うんどう}をしますか。', tanyaId: 'Berapa menit mereka semua berolahraga?', opsi: ['五分{ごふん}', '十分{じゅっぷん}', '二十分{にじゅっぷん}'], benar: 1, pembahasan: 'みんなで十分運動をします = semua berolahraga selama 10 menit.' },
        ],
      },
      {
        id: 'L2-33',
        judul: '妹{いもうと}のピアノ',
        teks: '妹{いもうと}は毎週{まいしゅう}月曜日{げつようび}と木曜日{もくようび}にピアノを習{なら}っています。午後{ごご}四時{よじ}から一時間{いちじかん}です。先生{せんせい}のうちは学校{がっこう}のとなりにあります。',
        terjemahan: 'Adik perempuan saya belajar piano setiap hari Senin dan Kamis. Lesnya satu jam mulai pukul 4 sore. Rumah gurunya ada di sebelah sekolah.',
        soal: [
          { id: 'L2-33-1', tanya: 'ピアノは午後{ごご}何時{なんじ}からですか。', tanyaId: 'Les piano mulai pukul berapa sore?', opsi: ['四時{よじ}', '五時{ごじ}', '六時{ろくじ}'], benar: 0, pembahasan: '午後四時から一時間です = satu jam mulai pukul 4 sore.' },
          { id: 'L2-33-2', tanya: '先生{せんせい}のうちはどこにありますか。', tanyaId: 'Di mana rumah guru berada?', opsi: ['学校{がっこう}のとなり', '駅{えき}のとなり', '公園{こうえん}のとなり'], benar: 0, pembahasan: '先生のうちは学校のとなりにあります = rumah guru ada di sebelah sekolah.' },
        ],
      },
      {
        id: 'L2-34',
        judul: '新{あたら}しい自転車{じてんしゃ}',
        teks: '先週{せんしゅう}、駅{えき}の近{ちか}くの店{みせ}で自転車{じてんしゃ}を買{か}いました。一万二千円{いちまんにせんえん}でした。工場{こうじょう}まで歩{ある}いて四十分{よんじゅっぷん}ですが、自転車{じてんしゃ}で十五分{じゅうごふん}です。',
        terjemahan: 'Minggu lalu saya membeli sepeda di toko dekat stasiun. Harganya 12.000 yen. Ke pabrik 40 menit jalan kaki, tetapi 15 menit naik sepeda.',
        soal: [
          { id: 'L2-34-1', tanya: '自転車{じてんしゃ}はいくらでしたか。', tanyaId: 'Berapa harga sepedanya?', opsi: ['一万円{いちまんえん}', '一万二千円{いちまんにせんえん}', '二万円{にまんえん}'], benar: 1, pembahasan: '一万二千円でした = harganya 12.000 yen.' },
          { id: 'L2-34-2', tanya: '工場{こうじょう}まで自転車{じてんしゃ}で何分{なんぷん}ですか。', tanyaId: 'Ke pabrik berapa menit naik sepeda?', opsi: ['十五分{じゅうごふん}', '二十五分{にじゅうごふん}', '四十分{よんじゅっぷん}'], benar: 0, pembahasan: '工場まで歩いて四十分ですが、自転車で十五分です = ke pabrik 40 menit jalan kaki, tetapi 15 menit naik sepeda.' },
        ],
      },
      {
        id: 'L2-35',
        judul: 'となりの町{まち}へ',
        teks: 'ブディさんは休{やす}みの日{ひ}に、電車{でんしゃ}でとなりの町{まち}へ行{い}きます。きっぷは三百二十円{さんびゃくにじゅうえん}です。電車{でんしゃ}は一時間{いちじかん}に二本{にほん}あります。となりの町{まち}まで二十分{にじゅっぷん}です。',
        terjemahan: 'Pada hari libur Budi pergi ke kota sebelah naik kereta. Tiketnya 320 yen. Keretanya ada dua kali dalam satu jam. Ke kota sebelah 20 menit.',
        soal: [
          { id: 'L2-35-1', tanya: 'きっぷはいくらですか。', tanyaId: 'Berapa harga tiketnya?', opsi: ['二百三十円{にひゃくさんじゅうえん}', '三百円{さんびゃくえん}', '三百二十円{さんびゃくにじゅうえん}'], benar: 2, pembahasan: 'きっぷは三百二十円です = tiketnya 320 yen.' },
          { id: 'L2-35-2', tanya: '電車{でんしゃ}は一時間{いちじかん}に何本{なんぼん}ありますか。', tanyaId: 'Dalam satu jam ada berapa kereta?', opsi: ['一本{いっぽん}', '二本{にほん}', '三本{さんぼん}'], benar: 1, pembahasan: '電車は一時間に二本あります = keretanya ada dua kali dalam satu jam.' },
        ],
      },
      {
        id: 'L2-36',
        judul: 'かみを切{き}りました',
        teks: 'きのう、駅{えき}の北口{きたぐち}の店{みせ}でかみを切{き}りました。千二百円{せんにひゃくえん}でした。店{みせ}は朝{あさ}九時{くじ}から夜{よる}七時{しちじ}までです。月曜日{げつようび}は休{やす}みです。',
        terjemahan: 'Kemarin saya potong rambut di toko di pintu utara stasiun. Harganya 1.200 yen. Toko itu buka dari pukul 9 pagi sampai pukul 7 malam. Hari Senin libur.',
        soal: [
          { id: 'L2-36-1', tanya: '店{みせ}はどこにありますか。', tanyaId: 'Di mana toko itu berada?', opsi: ['駅{えき}の北口{きたぐち}', '銀行{ぎんこう}のとなり', '寮{りょう}の近{ちか}く'], benar: 0, pembahasan: '駅の北口の店でかみを切りました = potong rambut di toko di pintu utara stasiun.' },
          { id: 'L2-36-2', tanya: '店{みせ}の休{やす}みは何曜日{なんようび}ですか。', tanyaId: 'Hari apa toko itu libur?', opsi: ['土曜日{どようび}', '日曜日{にちようび}', '月曜日{げつようび}'], benar: 2, pembahasan: '月曜日は休みです = hari Senin libur.' },
        ],
      },
      {
        id: 'L2-37',
        judul: '広{ひろ}い公園{こうえん}',
        teks: '川{かわ}のそばに広{ひろ}い公園{こうえん}があります。うちから歩{ある}いて五分{ごふん}です。わたしは毎週{まいしゅう}日曜日{にちようび}の朝{あさ}、ここで友{とも}だちとサッカーをします。',
        terjemahan: 'Di tepi sungai ada taman yang luas. Dari rumah 5 menit jalan kaki. Setiap Minggu pagi saya bermain sepak bola di sini bersama teman.',
        soal: [
          { id: 'L2-37-1', tanya: '公園{こうえん}はどこにありますか。', tanyaId: 'Di mana taman itu berada?', opsi: ['駅{えき}のそば', '川{かわ}のそば', '学校{がっこう}のそば'], benar: 1, pembahasan: '川のそばに広い公園があります = di tepi sungai ada taman yang luas.' },
          { id: 'L2-37-2', tanya: 'いつサッカーをしますか。', tanyaId: 'Kapan bermain sepak bola?', opsi: ['土曜日{どようび}の朝{あさ}', '日曜日{にちようび}の夕方{ゆうがた}', '日曜日{にちようび}の朝{あさ}'], benar: 2, pembahasan: '毎週日曜日の朝、ここで友だちとサッカーをします = setiap Minggu pagi bermain sepak bola di sini bersama teman.' },
        ],
      },
      {
        id: 'L2-38',
        judul: '白{しろ}い薬{くすり}と赤{あか}い薬{くすり}',
        teks: '病院{びょういん}で薬{くすり}を二{ふた}つもらいました。白{しろ}い薬{くすり}は一日{いちにち}に三回{さんかい}、ごはんのあとで飲{の}みます。赤{あか}い薬{くすり}は夜{よる}、寝{ね}るまえに一回{いっかい}飲{の}みます。',
        terjemahan: 'Di rumah sakit saya mendapat dua obat. Obat putih diminum tiga kali sehari sesudah makan. Obat merah diminum satu kali pada malam hari sebelum tidur.',
        soal: [
          { id: 'L2-38-1', tanya: '白{しろ}い薬{くすり}は一日{いちにち}に何回{なんかい}飲{の}みますか。', tanyaId: 'Obat putih diminum berapa kali sehari?', opsi: ['一回{いっかい}', '二回{にかい}', '三回{さんかい}'], benar: 2, pembahasan: '白い薬は一日に三回、ごはんのあとで飲みます = obat putih diminum tiga kali sehari sesudah makan.' },
          { id: 'L2-38-2', tanya: '赤{あか}い薬{くすり}はいつ飲{の}みますか。', tanyaId: 'Kapan obat merah diminum?', opsi: ['寝{ね}るまえ', 'ごはんのまえ', 'ごはんのあと'], benar: 0, pembahasan: '赤い薬は夜、寝るまえに一回飲みます = obat merah diminum satu kali pada malam hari sebelum tidur.' },
        ],
      },
      {
        id: 'L2-39',
        judul: '日曜日{にちようび}の電話{でんわ}',
        teks: 'わたしは毎週{まいしゅう}日曜日{にちようび}の夜{よる}九時{くじ}に、国{くに}の母{はは}に電話{でんわ}をかけます。日本{にほん}の九時{くじ}はインドネシアの七時{しちじ}です。いつも三十分{さんじゅっぷん}ぐらい話{はな}します。',
        terjemahan: 'Setiap hari Minggu pukul 9 malam saya menelepon ibu di negara asal. Pukul 9 di Jepang adalah pukul 7 di Indonesia. Kami selalu berbicara sekitar 30 menit.',
        soal: [
          { id: 'L2-39-1', tanya: 'わたしは何時{なんじ}に電話{でんわ}をかけますか。', tanyaId: 'Pukul berapa penulis menelepon?', opsi: ['夜{よる}九時{くじ}', '夜{よる}八時{はちじ}', '夜{よる}十時{じゅうじ}'], benar: 0, pembahasan: '毎週日曜日の夜九時に、国の母に電話をかけます = setiap hari Minggu pukul 9 malam menelepon ibu di negara asal.' },
          { id: 'L2-39-2', tanya: 'お母{かあ}さんとどのぐらい話{はな}しますか。', tanyaId: 'Berapa lama berbicara dengan ibu?', opsi: ['十分{じゅっぷん}ぐらい', '三十分{さんじゅっぷん}ぐらい', '一時間{いちじかん}ぐらい'], benar: 1, pembahasan: 'いつも三十分ぐらい話します = selalu berbicara sekitar 30 menit.' },
        ],
      },
      {
        id: 'L2-40',
        judul: '土曜日{どようび}の朝{あさ}のそうじ',
        teks: '寮{りょう}では毎週{まいしゅう}土曜日{どようび}の朝{あさ}八時{はちじ}からそうじをします。わたしは台所{だいどころ}をそうじします。リオさんはトイレをそうじします。二十分{にじゅっぷん}ぐらいで終{お}わります。',
        terjemahan: 'Di asrama kami bersih-bersih setiap hari Sabtu mulai pukul 8 pagi. Saya membersihkan dapur. Rio membersihkan toilet. Selesai dalam kira-kira 20 menit.',
        soal: [
          { id: 'L2-40-1', tanya: 'リオさんはどこをそうじしますか。', tanyaId: 'Rio membersihkan bagian mana?', opsi: ['台所{だいどころ}', 'トイレ', 'おふろ'], benar: 1, pembahasan: 'リオさんはトイレをそうじします = Rio membersihkan toilet.' },
          { id: 'L2-40-2', tanya: 'そうじは朝{あさ}何時{なんじ}からですか。', tanyaId: 'Bersih-bersih mulai pukul berapa pagi?', opsi: ['八時{はちじ}', '九時{くじ}', '十時{じゅうじ}'], benar: 0, pembahasan: '毎週土曜日の朝八時からそうじをします = bersih-bersih setiap hari Sabtu mulai pukul 8 pagi.' },
        ],
      },
      {
        id: 'L2-41',
        judul: 'インドネシアの食{た}べ物{もの}の店{みせ}',
        teks: '大{おお}きい駅{えき}の近{ちか}くにインドネシアの食{た}べ物{もの}の店{みせ}があります。寮{りょう}から電車{でんしゃ}で三十分{さんじゅっぷん}かかります。わたしは月{つき}に一回{いっかい}行{い}って、サンバルやおかしを買{か}います。',
        terjemahan: 'Di dekat stasiun besar ada toko makanan Indonesia. Dari asrama perlu 30 menit naik kereta. Saya pergi ke sana sebulan sekali dan membeli sambal, kue, dan lain-lain.',
        soal: [
          { id: 'L2-41-1', tanya: 'インドネシアの食{た}べ物{もの}の店{みせ}はどこにありますか。', tanyaId: 'Di mana toko makanan Indonesia itu berada?', opsi: ['寮{りょう}の近{ちか}く', '工場{こうじょう}の近{ちか}く', '大{おお}きい駅{えき}の近{ちか}く'], benar: 2, pembahasan: '大きい駅の近くにインドネシアの食べ物の店があります = di dekat stasiun besar ada toko makanan Indonesia.' },
          { id: 'L2-41-2', tanya: '寮{りょう}から店{みせ}まで電車{でんしゃ}でどのぐらいかかりますか。', tanyaId: 'Berapa lama perjalanan dari asrama ke toko naik kereta?', opsi: ['二十分{にじゅっぷん}', '三十分{さんじゅっぷん}', '一時間{いちじかん}'], benar: 1, pembahasan: '寮から電車で三十分かかります = dari asrama perlu 30 menit naik kereta.' },
        ],
      },
      {
        id: 'L2-42',
        judul: '八月{はちがつ}のおまつり',
        teks: '八月{はちがつ}十日{とおか}に、公園{こうえん}で町{まち}のおまつりがありました。午後{ごご}六時{ろくじ}から九時{くじ}まででした。わたしは会社{かいしゃ}の田中{たなか}さんと行{い}って、やきそばを食{た}べました。',
        terjemahan: 'Pada tanggal 10 Agustus ada festival kota di taman. Acaranya dari pukul 6 sore sampai pukul 9 malam. Saya pergi bersama Tanaka dari perusahaan dan makan yakisoba.',
        soal: [
          { id: 'L2-42-1', tanya: 'おまつりはいつでしたか。', tanyaId: 'Kapan festival itu diadakan?', opsi: ['八月{はちがつ}八日{ようか}', '八月{はちがつ}十日{とおか}', '八月{はちがつ}二十日{はつか}'], benar: 1, pembahasan: '八月十日に、公園で町のおまつりがありました = pada tanggal 10 Agustus ada festival kota di taman.' },
          { id: 'L2-42-2', tanya: 'だれとおまつりへ行{い}きましたか。', tanyaId: 'Pergi ke festival bersama siapa?', opsi: ['会社{かいしゃ}の田中{たなか}さん', '会社{かいしゃ}の山田{やまだ}さん', '寮{りょう}の田中{たなか}さん'], benar: 0, pembahasan: 'わたしは会社の田中さんと行って、やきそばを食べました = saya pergi bersama Tanaka dari perusahaan dan makan yakisoba.' },
        ],
      },
      {
        id: 'L2-43',
        judul: '喫茶店{きっさてん}のコーヒー',
        teks: '銀行{ぎんこう}のとなりに古{ふる}い喫茶店{きっさてん}があります。コーヒーは四百円{よんひゃくえん}で、ケーキは三百五十円{さんびゃくごじゅうえん}です。わたしは土曜日{どようび}の午後{ごご}、ここで本{ほん}を読{よ}みます。',
        terjemahan: 'Di sebelah bank ada kedai kopi tua. Kopinya 400 yen dan kuenya 350 yen. Pada Sabtu siang saya membaca buku di sini.',
        soal: [
          { id: 'L2-43-1', tanya: '喫茶店{きっさてん}はどこにありますか。', tanyaId: 'Di mana kedai kopi itu berada?', opsi: ['銀行{ぎんこう}のとなり', '銀行{ぎんこう}の前{まえ}', '本屋{ほんや}のとなり'], benar: 0, pembahasan: '銀行のとなりに古い喫茶店があります = di sebelah bank ada kedai kopi tua.' },
          { id: 'L2-43-2', tanya: 'ケーキはいくらですか。', tanyaId: 'Berapa harga kuenya?', opsi: ['三百円{さんびゃくえん}', '四百円{よんひゃくえん}', '三百五十円{さんびゃくごじゅうえん}'], benar: 2, pembahasan: 'コーヒーは四百円で、ケーキは三百五十円です = kopinya 400 yen dan kuenya 350 yen.' },
        ],
      },
      {
        id: 'L2-44',
        judul: 'リナさんの休{やす}みの日{ひ}',
        teks: 'リナさんは休{やす}みの日{ひ}、九時{くじ}に起{お}きます。朝{あさ}ごはんを食{た}べてから、せんたくをします。十一時{じゅういちじ}ごろ、自転車{じてんしゃ}でスーパーへ行{い}きます。',
        terjemahan: 'Pada hari libur Rina bangun pukul 9. Sesudah sarapan ia mencuci pakaian. Sekitar pukul 11 ia pergi ke supermarket naik sepeda.',
        soal: [
          { id: 'L2-44-1', tanya: 'リナさんは休{やす}みの日{ひ}、何時{なんじ}に起{お}きますか。', tanyaId: 'Pada hari libur Rina bangun pukul berapa?', opsi: ['七時{しちじ}', '十一時{じゅういちじ}', '九時{くじ}'], benar: 2, pembahasan: 'リナさんは休みの日、九時に起きます = pada hari libur Rina bangun pukul 9.' },
          { id: 'L2-44-2', tanya: 'リナさんは何{なに}でスーパーへ行{い}きますか。', tanyaId: 'Rina pergi ke supermarket naik apa?', opsi: ['バスで行{い}きます', '自転車{じてんしゃ}で行{い}きます', '歩{ある}いて行{い}きます'], benar: 1, pembahasan: '自転車でスーパーへ行きます = pergi ke supermarket naik sepeda.' },
        ],
      },
      {
        id: 'L2-45',
        judul: '工場{こうじょう}の前{まえ}のお弁当{べんとう}の店{みせ}',
        teks: '工場{こうじょう}の前{まえ}にお弁当{べんとう}の店{みせ}があります。午前{ごぜん}十一時{じゅういちじ}から午後{ごご}二時{にじ}まで開{あ}いています。肉{にく}のお弁当{べんとう}は五百円{ごひゃくえん}ですが、魚{さかな}のお弁当{べんとう}は四百五十円{よんひゃくごじゅうえん}で、いちばん安{やす}いです。',
        terjemahan: 'Di depan pabrik ada toko bento. Toko itu buka dari pukul 11 pagi sampai pukul 2 siang. Bento daging harganya 500 yen, tetapi bento ikan 450 yen dan paling murah.',
        soal: [
          { id: 'L2-45-1', tanya: 'お弁当{べんとう}の店{みせ}は何時{なんじ}から開{あ}いていますか。', tanyaId: 'Toko bento buka mulai pukul berapa?', opsi: ['午前{ごぜん}十時{じゅうじ}', '午前{ごぜん}十一時{じゅういちじ}', '午後{ごご}二時{にじ}'], benar: 1, pembahasan: '午前十一時から午後二時まで開いています = buka dari pukul 11 pagi sampai pukul 2 siang.' },
          { id: 'L2-45-2', tanya: 'いちばん安{やす}いお弁当{べんとう}はどれですか。', tanyaId: 'Bento mana yang paling murah?', opsi: ['肉{にく}のお弁当{べんとう}', '野菜{やさい}のお弁当{べんとう}', '魚{さかな}のお弁当{べんとう}'], benar: 2, pembahasan: '魚のお弁当は四百五十円で、いちばん安いです = bento ikan 450 yen dan paling murah.' },
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
      {
        id: 'L3-21',
        judul: '寮{りょう}のせんたく機{き}',
        teks: '寮{りょう}のせんたく機{き}は一階{いっかい}にあります。朝{あさ}六時{ろくじ}から夜{よる}九時{くじ}まで使{つか}ってもいいです。夜{よる}九時{くじ}からは、音{おと}がうるさいですから、使{つか}わないでください。',
        terjemahan: 'Mesin cuci asrama ada di lantai satu. Boleh dipakai dari pukul 6 pagi sampai pukul 9 malam. Mulai pukul 9 malam, jangan dipakai karena suaranya berisik.',
        soal: [
          { id: 'L3-21-1', tanya: 'せんたく機{き}は何時{なんじ}から使{つか}ってもいいですか。', tanyaId: 'Mesin cuci boleh dipakai mulai pukul berapa?', opsi: ['朝{あさ}五時{ごじ}', '朝{あさ}六時{ろくじ}', '朝{あさ}九時{くじ}'], benar: 1, pembahasan: '朝六時から夜九時まで使ってもいいです = boleh dipakai dari pukul 6 pagi sampai pukul 9 malam.' },
          { id: 'L3-21-2', tanya: 'どうして夜{よる}九時{くじ}からは使{つか}ってはいけませんか。', tanyaId: 'Mengapa mulai pukul 9 malam tidak boleh dipakai?', opsi: ['水{みず}が出{で}ないからです', '電気{でんき}が高{たか}いからです', '音{おと}がうるさいからです'], benar: 2, pembahasan: '夜九時からは、音がうるさいですから、使わないでください = mulai pukul 9 malam jangan dipakai karena suaranya berisik.' },
        ],
      },
      {
        id: 'L3-22',
        judul: '会社{かいしゃ}のバスのお知{し}らせ',
        teks: '来月{らいげつ}から会社{かいしゃ}のバスの時間{じかん}がかわります。朝{あさ}のバスは七時{しちじ}十分{じゅっぷん}に寮{りょう}の前{まえ}を出{で}ます。バスに乗{の}る人{ひと}は、金曜日{きんようび}までに事務所{じむしょ}で名前{なまえ}を書{か}いてください。',
        terjemahan: 'Mulai bulan depan jam bus perusahaan berubah. Bus pagi berangkat dari depan asrama pukul 7.10. Orang yang naik bus, silakan menulis nama di kantor paling lambat hari Jumat.',
        soal: [
          { id: 'L3-22-1', tanya: '来月{らいげつ}から、朝{あさ}のバスは何時{なんじ}に出{で}ますか。', tanyaId: 'Mulai bulan depan, bus pagi berangkat pukul berapa?', opsi: ['七時{しちじ}', '七時半{しちじはん}', '七時{しちじ}十分{じゅっぷん}'], benar: 2, pembahasan: '朝のバスは七時十分に寮の前を出ます = bus pagi berangkat dari depan asrama pukul 7.10.' },
          { id: 'L3-22-2', tanya: 'バスに乗{の}る人{ひと}は何{なに}をしますか。', tanyaId: 'Apa yang harus dilakukan orang yang naik bus?', opsi: ['事務所{じむしょ}で名前{なまえ}を書{か}きます', '事務所{じむしょ}に電話{でんわ}をします', '寮{りょう}の前{まえ}で名前{なまえ}を言{い}います'], benar: 0, pembahasan: 'バスに乗る人は、金曜日までに事務所で名前を書いてください = orang yang naik bus, silakan menulis nama di kantor paling lambat hari Jumat.' },
        ],
      },
      {
        id: 'L3-23',
        judul: '食堂{しょくどう}のカレーの日{ひ}',
        teks: '会社{かいしゃ}の食堂{しょくどう}は、毎週{まいしゅう}水曜日{すいようび}がカレーの日{ひ}です。カレーは三百円{さんびゃくえん}で、安{やす}くておいしいですから、水曜日{すいようび}は人{ひと}が多{おお}いです。わたしは早{はや}く食堂{しょくどう}へ行{い}きます。',
        terjemahan: 'Di kantin perusahaan, setiap hari Rabu adalah hari kari. Karinya 300 yen, murah dan enak, jadi hari Rabu orangnya banyak. Saya pergi ke kantin lebih awal.',
        soal: [
          { id: 'L3-23-1', tanya: 'カレーはいくらですか。', tanyaId: 'Berapa harga karinya?', opsi: ['三百円{さんびゃくえん}', '三百五十円{さんびゃくごじゅうえん}', '五百円{ごひゃくえん}'], benar: 0, pembahasan: 'カレーは三百円で = karinya 300 yen.' },
          { id: 'L3-23-2', tanya: 'どうして水曜日{すいようび}は食堂{しょくどう}に人{ひと}が多{おお}いですか。', tanyaId: 'Mengapa hari Rabu di kantin banyak orang?', opsi: ['食堂{しょくどう}が小{ちい}さいからです', 'カレーが安{やす}くておいしいからです', '仕事{しごと}が早{はや}く終{お}わるからです'], benar: 1, pembahasan: '安くておいしいですから、水曜日は人が多いです = murah dan enak, jadi hari Rabu orangnya banyak.' },
        ],
      },
      {
        id: 'L3-24',
        judul: '工場{こうじょう}のぼうしと手{て}ぶくろ',
        teks: '工場{こうじょう}の中{なか}では、いつもぼうしをかぶってください。機械{きかい}を使{つか}うときは、手{て}ぶくろもしてください。あぶないですから、機械{きかい}の近{ちか}くで走{はし}らないでください。',
        terjemahan: 'Di dalam pabrik, selalu pakailah topi. Saat memakai mesin, pakailah juga sarung tangan. Karena berbahaya, jangan berlari di dekat mesin.',
        soal: [
          { id: 'L3-24-1', tanya: '手{て}ぶくろはいつしますか。', tanyaId: 'Kapan sarung tangan dipakai?', opsi: ['工場{こうじょう}に入{はい}るとき', 'そうじをするとき', '機械{きかい}を使{つか}うとき'], benar: 2, pembahasan: '機械を使うときは、手ぶくろもしてください = saat memakai mesin, pakailah juga sarung tangan.' },
          { id: 'L3-24-2', tanya: '機械{きかい}の近{ちか}くで何{なに}をしてはいけませんか。', tanyaId: 'Apa yang tidak boleh dilakukan di dekat mesin?', opsi: ['話{はな}してはいけません', '走{はし}ってはいけません', '休{やす}んではいけません'], benar: 1, pembahasan: 'あぶないですから、機械の近くで走らないでください = karena berbahaya, jangan berlari di dekat mesin.' },
        ],
      },
      {
        id: 'L3-25',
        judul: '来週{らいしゅう}は夜{よる}の仕事{しごと}',
        teks: 'わたしは来週{らいしゅう}、夜{よる}の仕事{しごと}です。夜{よる}十時{じゅうじ}から朝{あさ}六時{ろくじ}まで働{はたら}きます。昼{ひる}に寝{ね}ますから、昼{ひる}は電話{でんわ}をしないでください。メールを送{おく}ってください。',
        terjemahan: 'Minggu depan saya kerja malam. Saya bekerja dari pukul 10 malam sampai pukul 6 pagi. Saya tidur pada siang hari, jadi jangan menelepon pada siang hari. Silakan kirim email.',
        soal: [
          { id: 'L3-25-1', tanya: '来週{らいしゅう}、仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Minggu depan, pekerjaan selesai pukul berapa?', opsi: ['夜{よる}十時{じゅうじ}', '朝{あさ}六時{ろくじ}', '朝{あさ}十時{じゅうじ}'], benar: 1, pembahasan: '夜十時から朝六時まで働きます = bekerja dari pukul 10 malam sampai pukul 6 pagi (jadi selesai pukul 6 pagi).' },
          { id: 'L3-25-2', tanya: 'どうして昼{ひる}に電話{でんわ}をしてはいけませんか。', tanyaId: 'Mengapa tidak boleh menelepon pada siang hari?', opsi: ['わたしが寝{ね}ているからです', 'わたしが働{はたら}いているからです', '電話{でんわ}がこわれているからです'], benar: 0, pembahasan: '昼に寝ますから、昼は電話をしないでください = saya tidur pada siang hari, jadi jangan menelepon pada siang hari.' },
        ],
      },
      {
        id: 'L3-26',
        judul: '国{くに}へお金{かね}を送{おく}ります',
        teks: '今日{きょう}は給料{きゅうりょう}の日{ひ}です。わたしは毎月{まいつき}、国{くに}の家族{かぞく}に五万円{ごまんえん}送{おく}ります。銀行{ぎんこう}は午後{ごご}三時{さんじ}に閉{し}まりますから、昼休{ひるやす}みに行{い}きます。',
        terjemahan: 'Hari ini hari gajian. Setiap bulan saya mengirim 50.000 yen kepada keluarga di negara saya. Bank tutup pukul 3 sore, jadi saya pergi pada jam istirahat siang.',
        soal: [
          { id: 'L3-26-1', tanya: 'わたしは毎月{まいつき}いくら送{おく}りますか。', tanyaId: 'Setiap bulan penulis mengirim berapa?', opsi: ['五万円{ごまんえん}', '三万円{さんまんえん}', '六万円{ろくまんえん}'], benar: 0, pembahasan: '国の家族に五万円送ります = mengirim 50.000 yen kepada keluarga di negara saya.' },
          { id: 'L3-26-2', tanya: 'どうして昼休{ひるやす}みに銀行{ぎんこう}へ行{い}きますか。', tanyaId: 'Mengapa ia pergi ke bank pada jam istirahat siang?', opsi: ['昼{ひる}は人{ひと}が少{すく}ないからです', '銀行{ぎんこう}が会社{かいしゃ}から近{ちか}いからです', '銀行{ぎんこう}が三時{さんじ}に閉{し}まるからです'], benar: 2, pembahasan: '銀行は午後三時に閉まりますから、昼休みに行きます = bank tutup pukul 3 sore, jadi pergi pada jam istirahat siang.' },
        ],
      },
      {
        id: 'L3-27',
        judul: '郵便局{ゆうびんきょく}からの紙{かみ}',
        teks: '寮{りょう}に帰{かえ}ったとき、ドアに郵便局{ゆうびんきょく}の紙{かみ}がありました。昼{ひる}、わたしがいませんでしたから、荷物{にもつ}は郵便局{ゆうびんきょく}にあります。あした、仕事{しごと}のあとで取{と}りに行{い}きます。',
        terjemahan: 'Ketika pulang ke asrama, ada kertas dari kantor pos di pintu. Siang tadi saya tidak ada, jadi paketnya ada di kantor pos. Besok, sesudah kerja, saya akan pergi mengambilnya.',
        soal: [
          { id: 'L3-27-1', tanya: 'わたしはいつ荷物{にもつ}を取{と}りに行{い}きますか。', tanyaId: 'Kapan penulis pergi mengambil paket?', opsi: ['今日{きょう}の夜{よる}', 'あしたの昼休{ひるやす}み', 'あしたの仕事{しごと}のあと'], benar: 2, pembahasan: 'あした、仕事のあとで取りに行きます = besok, sesudah kerja, pergi mengambilnya.' },
          { id: 'L3-27-2', tanya: 'どうしてドアに紙{かみ}がありましたか。', tanyaId: 'Mengapa ada kertas di pintu?', opsi: ['荷物{にもつ}が大{おお}きかったからです', '寮{りょう}の名前{なまえ}が違{ちが}ったからです', '昼{ひる}、わたしがいなかったからです'], benar: 2, pembahasan: '昼、わたしがいませんでしたから、荷物は郵便局にあります = siang tadi saya tidak ada, jadi paketnya ada di kantor pos (karena penulis tidak ada pada siang hari, petugas pos meninggalkan kertas pemberitahuan di pintu).' },
        ],
      },
      {
        id: 'L3-28',
        judul: '夏{なつ}まつりに行{い}きませんか',
        teks: 'アリさん、土曜日{どようび}の夜{よる}、町{まち}の夏{なつ}まつりに行{い}きませんか。花火{はなび}は八時{はちじ}からです。人{ひと}が多{おお}いですから、六時半{ろくじはん}に駅{えき}で会{あ}いましょう。',
        terjemahan: 'Ali, maukah pergi ke festival musim panas kota pada Sabtu malam? Kembang apinya mulai pukul 8. Karena orangnya banyak, mari bertemu di stasiun pukul 6.30.',
        soal: [
          { id: 'L3-28-1', tanya: '花火{はなび}は何時{なんじ}からですか。', tanyaId: 'Kembang api mulai pukul berapa?', opsi: ['七時{しちじ}', '八時{はちじ}', '九時{くじ}'], benar: 1, pembahasan: '花火は八時からです = kembang apinya mulai pukul 8.' },
          { id: 'L3-28-2', tanya: 'どうして六時半{ろくじはん}に会{あ}いますか。', tanyaId: 'Mengapa bertemu pukul 6.30?', opsi: ['人{ひと}が多{おお}いからです', '駅{えき}が遠{とお}いからです', '電車{でんしゃ}が少{すく}ないからです'], benar: 0, pembahasan: '人が多いですから、六時半に駅で会いましょう = karena orangnya banyak, mari bertemu di stasiun pukul 6.30.' },
        ],
      },
      {
        id: 'L3-29',
        judul: '薬{くすり}の飲{の}み方{かた}',
        teks: '病院{びょういん}で薬{くすり}をもらいました。この薬{くすり}は一日{いちにち}に三回{さんかい}、ごはんのあとで飲{の}んでください。薬{くすり}を飲{の}んでいるときは、お茶{ちゃ}は飲{の}んでもいいですが、お酒{さけ}は飲{の}まないでください。',
        terjemahan: 'Saya mendapat obat di rumah sakit. Obat ini diminum tiga kali sehari, sesudah makan. Selama minum obat ini, boleh minum teh, tetapi jangan minum minuman keras.',
        soal: [
          { id: 'L3-29-1', tanya: '薬{くすり}は一日{いちにち}に何回{なんかい}飲{の}みますか。', tanyaId: 'Obat diminum berapa kali sehari?', opsi: ['三回{さんかい}', '二回{にかい}', '一回{いっかい}'], benar: 0, pembahasan: 'この薬は一日に三回、ごはんのあとで飲んでください = obat ini diminum tiga kali sehari, sesudah makan.' },
          { id: 'L3-29-2', tanya: '薬{くすり}を飲{の}んでいるとき、何{なに}を飲{の}んではいけませんか。', tanyaId: 'Selama minum obat, apa yang tidak boleh diminum?', opsi: ['お茶{ちゃ}', 'お酒{さけ}', '牛乳{ぎゅうにゅう}'], benar: 1, pembahasan: '薬を飲んでいるときは、お茶は飲んでもいいですが、お酒は飲まないでください = selama minum obat, boleh minum teh, tetapi jangan minum minuman keras.' },
        ],
      },
      {
        id: 'L3-30',
        judul: '自転車{じてんしゃ}置{お}き場{ば}',
        teks: '寮{りょう}の自転車{じてんしゃ}置{お}き場{ば}は、建物{たてもの}のうしろにあります。自転車{じてんしゃ}に名前{なまえ}を書{か}いて、そこに置{お}いてください。入口{いりぐち}の前{まえ}はせまいですから、置{お}かないでください。',
        terjemahan: 'Tempat parkir sepeda asrama ada di belakang gedung. Tulislah nama pada sepeda, lalu letakkan di sana. Di depan pintu masuk sempit, jadi jangan meletakkan sepeda di situ.',
        soal: [
          { id: 'L3-30-1', tanya: '自転車{じてんしゃ}置{お}き場{ば}はどこにありますか。', tanyaId: 'Tempat parkir sepeda ada di mana?', opsi: ['建物{たてもの}の前{まえ}', '建物{たてもの}の中{なか}', '建物{たてもの}のうしろ'], benar: 2, pembahasan: '建物のうしろにあります = ada di belakang gedung.' },
          { id: 'L3-30-2', tanya: 'どうして入口{いりぐち}の前{まえ}に自転車{じてんしゃ}を置{お}いてはいけませんか。', tanyaId: 'Mengapa tidak boleh meletakkan sepeda di depan pintu masuk?', opsi: ['せまいからです', 'あぶないからです', 'きたないからです'], benar: 0, pembahasan: '入口の前はせまいですから、置かないでください = di depan pintu masuk sempit, jadi jangan meletakkan di situ.' },
        ],
      },
      {
        id: 'L3-31',
        judul: '台風{たいふう}の日{ひ}',
        teks: 'あしたは大{おお}きい台風{たいふう}が来{き}ます。電車{でんしゃ}とバスが止{と}まりますから、工場{こうじょう}は休{やす}みです。あぶないですから、外{そと}に出{で}ないでください。あさっては、いつもと同{おな}じ時間{じかん}に来{き}てください。',
        terjemahan: 'Besok akan datang topan besar. Kereta dan bus berhenti, jadi pabrik libur. Karena berbahaya, jangan keluar. Lusa, silakan datang pada jam yang sama seperti biasa.',
        soal: [
          { id: 'L3-31-1', tanya: 'どうしてあした工場{こうじょう}は休{やす}みですか。', tanyaId: 'Mengapa besok pabrik libur?', opsi: ['工場{こうじょう}をそうじするからです', '電車{でんしゃ}とバスが止{と}まるからです', '雪{ゆき}がたくさん降{ふ}るからです'], benar: 1, pembahasan: '電車とバスが止まりますから、工場は休みです = kereta dan bus berhenti, jadi pabrik libur.' },
          { id: 'L3-31-2', tanya: 'あした、何{なに}をしてはいけませんか。', tanyaId: 'Besok, apa yang tidak boleh dilakukan?', opsi: ['寮{りょう}で休{やす}んではいけません', '電話{でんわ}をしてはいけません', '外{そと}に出{で}てはいけません'], benar: 2, pembahasan: 'あぶないですから、外に出ないでください = karena berbahaya, jangan keluar.' },
        ],
      },
      {
        id: 'L3-32',
        judul: '電車{でんしゃ}の中{なか}で',
        teks: '日本{にほん}の電車{でんしゃ}の中{なか}はとても静{しず}かです。電車{でんしゃ}の中{なか}で電話{でんわ}をしてはいけません。メールはしてもいいです。朝{あさ}は人{ひと}が多{おお}いですから、かばんは手{て}に持{も}ってください。',
        terjemahan: 'Di dalam kereta di Jepang sangat tenang. Di dalam kereta tidak boleh menelepon. Mengirim pesan boleh. Pada pagi hari orangnya banyak, jadi tas harap dipegang di tangan.',
        soal: [
          { id: 'L3-32-1', tanya: '電車{でんしゃ}の中{なか}で何{なに}をしてはいけませんか。', tanyaId: 'Apa yang tidak boleh dilakukan di dalam kereta?', opsi: ['電話{でんわ}をしてはいけません', 'メールをしてはいけません', '本{ほん}を読{よ}んではいけません'], benar: 0, pembahasan: '電車の中で電話をしてはいけません。メールはしてもいいです = di dalam kereta tidak boleh menelepon; mengirim pesan boleh.' },
          { id: 'L3-32-2', tanya: 'どうして朝{あさ}はかばんを手{て}に持{も}ちますか。', tanyaId: 'Mengapa pada pagi hari tas dipegang di tangan?', opsi: ['朝{あさ}は人{ひと}が多{おお}いからです', 'かばんが大{おお}きいからです', '電車{でんしゃ}の中{なか}が暑{あつ}いからです'], benar: 0, pembahasan: '朝は人が多いですから、かばんは手に持ってください = pada pagi hari orangnya banyak, jadi tas harap dipegang di tangan.' },
        ],
      },
      {
        id: 'L3-33',
        judul: '母{はは}へのプレゼント',
        teks: '来週{らいしゅう}は母{はは}の誕生日{たんじょうび}です。母{はは}の町{まち}は冬{ふゆ}とても寒{さむ}いですから、あたたかいセーターをあげます。きのうデパートで買{か}いました。色{いろ}は母{はは}の好{す}きな赤{あか}です。',
        terjemahan: 'Minggu depan ulang tahun ibu saya. Kota ibu sangat dingin pada musim dingin, jadi saya memberi sweter yang hangat. Kemarin saya membelinya di toserba. Warnanya merah, warna kesukaan ibu.',
        soal: [
          { id: 'L3-33-1', tanya: 'どうしてセーターをあげますか。', tanyaId: 'Mengapa ia memberi sweter?', opsi: ['母{はは}のセーターが古{ふる}いからです', 'デパートで安{やす}かったからです', '母{はは}の町{まち}が寒{さむ}いからです'], benar: 2, pembahasan: '母の町は冬とても寒いですから、あたたかいセーターをあげます = kota ibu sangat dingin pada musim dingin, jadi memberi sweter yang hangat.' },
          { id: 'L3-33-2', tanya: 'セーターは何色{なにいろ}ですか。', tanyaId: 'Sweternya berwarna apa?', opsi: ['白{しろ}', '赤{あか}', '青{あお}'], benar: 1, pembahasan: '色は母の好きな赤です = warnanya merah, warna kesukaan ibu.' },
        ],
      },
      {
        id: 'L3-34',
        judul: '漢字{かんじ}のテストのお知{し}らせ',
        teks: '来週{らいしゅう}の月曜日{げつようび}に漢字{かんじ}のテストをします。テストは九時{くじ}から三十分{さんじゅっぷん}です。えんぴつとけしゴムを持{も}って来{き}てください。テストのとき、けいたい電話{でんわ}はかばんに入{い}れてください。',
        terjemahan: 'Senin depan ada tes kanji. Tesnya 30 menit mulai pukul 9. Silakan membawa pensil dan penghapus. Saat tes, masukkan telepon genggam ke dalam tas.',
        soal: [
          { id: 'L3-34-1', tanya: 'テストは何分{なんぷん}ですか。', tanyaId: 'Tesnya berapa menit?', opsi: ['二十分{にじゅっぷん}', '三十分{さんじゅっぷん}', '九十分{きゅうじゅっぷん}'], benar: 1, pembahasan: 'テストは九時から三十分です = tesnya 30 menit mulai pukul 9.' },
          { id: 'L3-34-2', tanya: 'テストのとき、けいたい電話{でんわ}をどうしますか。', tanyaId: 'Saat tes, telepon genggam harus diapakan?', opsi: ['先生{せんせい}に出{だ}します', 'つくえの上{うえ}に置{お}きます', 'かばんに入{い}れます'], benar: 2, pembahasan: 'テストのとき、けいたい電話はかばんに入れてください = saat tes, masukkan telepon genggam ke dalam tas.' },
        ],
      },
      {
        id: 'L3-35',
        judul: '公園{こうえん}でのお願{ねが}い',
        teks: 'この公園{こうえん}は朝{あさ}六時{ろくじ}から夜{よる}八時{はちじ}まで開{あ}いています。小{ちい}さい子{こ}どもがたくさん遊{あそ}んでいますから、公園{こうえん}の中{なか}で自転車{じてんしゃ}に乗{の}らないでください。ごみは持{も}って帰{かえ}ってください。',
        terjemahan: 'Taman ini buka dari pukul 6 pagi sampai pukul 8 malam. Banyak anak kecil bermain, jadi jangan naik sepeda di dalam taman. Sampah harap dibawa pulang.',
        soal: [
          { id: 'L3-35-1', tanya: '公園{こうえん}は何時{なんじ}まで開{あ}いていますか。', tanyaId: 'Taman buka sampai pukul berapa?', opsi: ['夜{よる}八時{はちじ}', '夜{よる}六時{ろくじ}', '夜{よる}九時{くじ}'], benar: 0, pembahasan: '朝六時から夜八時まで開いています = buka dari pukul 6 pagi sampai pukul 8 malam.' },
          { id: 'L3-35-2', tanya: 'ごみはどうしますか。', tanyaId: 'Sampah harus diapakan?', opsi: ['公園{こうえん}のごみばこに入{い}れます', '公園{こうえん}の入口{いりぐち}に置{お}きます', 'うちへ持{も}って帰{かえ}ります'], benar: 2, pembahasan: 'ごみは持って帰ってください = sampah harap dibawa pulang.' },
        ],
      },
      {
        id: 'L3-36',
        judul: 'リナさんへのメモ',
        teks: 'リナさんへ。わたしは今{いま}からスーパーへ行{い}って、五時{ごじ}ごろ帰{かえ}ります。雨{あめ}が降{ふ}っていますから、まどを開{あ}けないでください。れいぞうこのケーキは食{た}べてもいいですよ。',
        terjemahan: 'Untuk Rina. Saya sekarang pergi ke supermarket dan pulang sekitar pukul 5. Sedang hujan, jadi jangan membuka jendela. Kue di kulkas boleh dimakan.',
        soal: [
          { id: 'L3-36-1', tanya: 'わたしは何時{なんじ}ごろ帰{かえ}りますか。', tanyaId: 'Penulis pulang sekitar pukul berapa?', opsi: ['四時{よじ}ごろ', '五時{ごじ}ごろ', '六時{ろくじ}ごろ'], benar: 1, pembahasan: '五時ごろ帰ります = pulang sekitar pukul 5.' },
          { id: 'L3-36-2', tanya: 'どうしてまどを開{あ}けてはいけませんか。', tanyaId: 'Mengapa tidak boleh membuka jendela?', opsi: ['外{そと}が寒{さむ}いからです', '雨{あめ}が降{ふ}っているからです', '外{そと}がうるさいからです'], benar: 1, pembahasan: '雨が降っていますから、まどを開けないでください = sedang hujan, jadi jangan membuka jendela.' },
        ],
      },
      {
        id: 'L3-37',
        judul: '暑{あつ}い日{ひ}の仕事{しごと}',
        teks: '今週{こんしゅう}は毎日{まいにち}とても暑{あつ}いですから、午後{ごご}の休{やす}みは三時{さんじ}から二十分{にじゅっぷん}です。水{みず}をたくさん飲{の}んでください。頭{あたま}がいたいときは、すぐリーダーに言{い}って、休{やす}んでください。',
        terjemahan: 'Minggu ini setiap hari sangat panas, jadi istirahat sore 20 menit mulai pukul 3. Minumlah banyak air. Kalau kepala sakit, segera katakan kepada ketua regu, lalu beristirahatlah.',
        soal: [
          { id: 'L3-37-1', tanya: '頭{あたま}がいたいときは、どうしますか。', tanyaId: 'Kalau kepala sakit, apa yang harus dilakukan?', opsi: ['薬{くすり}を飲{の}んで働{はたら}きます', 'すぐ寮{りょう}に帰{かえ}ります', 'リーダーに言{い}って休{やす}みます'], benar: 2, pembahasan: '頭がいたいときは、すぐリーダーに言って、休んでください = kalau kepala sakit, segera katakan kepada ketua regu, lalu beristirahatlah.' },
          { id: 'L3-37-2', tanya: '午後{ごご}の休{やす}みは何分{なんぷん}ですか。', tanyaId: 'Istirahat sore berapa menit?', opsi: ['二十分{にじゅっぷん}', '十分{じゅっぷん}', '三十分{さんじゅっぷん}'], benar: 0, pembahasan: '午後の休みは三時から二十分です = istirahat sore 20 menit mulai pukul 3.' },
        ],
      },
      {
        id: 'L3-38',
        judul: '寮{りょう}の夜{よる}は静{しず}かに',
        teks: 'この寮{りょう}には、朝{あさ}五時{ごじ}から仕事{しごと}の人{ひと}がいます。その人{ひと}は夜{よる}早{はや}く寝{ね}ますから、十時{じゅうじ}からは静{しず}かにしてください。音楽{おんがく}を聞{き}くときは、イヤホンを使{つか}ってください。',
        terjemahan: 'Di asrama ini ada orang yang bekerja mulai pukul 5 pagi. Orang itu tidur cepat pada malam hari, jadi mulai pukul 10 harap tenang. Saat mendengarkan musik, pakailah earphone.',
        soal: [
          { id: 'L3-38-1', tanya: 'どうして夜{よる}十時{じゅうじ}からは静{しず}かにしますか。', tanyaId: 'Mengapa mulai pukul 10 malam harus tenang?', opsi: ['寮{りょう}の人{ひと}が早{はや}く寝{ね}るからです', '寮{りょう}の人{ひと}が勉強{べんきょう}するからです', '寮{りょう}に子{こ}どもがいるからです'], benar: 0, pembahasan: '夜早く寝ますから、十時からは静かにしてください = (orang itu) tidur cepat pada malam hari, jadi mulai pukul 10 harap tenang.' },
          { id: 'L3-38-2', tanya: '音楽{おんがく}を聞{き}くとき、どうしますか。', tanyaId: 'Saat mendengarkan musik, apa yang harus dilakukan?', opsi: ['部屋{へや}のドアを閉{し}めます', 'イヤホンを使{つか}います', '小{ちい}さい音{おと}で聞{き}きます'], benar: 1, pembahasan: '音楽を聞くときは、イヤホンを使ってください = saat mendengarkan musik, pakailah earphone.' },
        ],
      },
      {
        id: 'L3-39',
        judul: '山{やま}へ行{い}きませんか',
        teks: '来週{らいしゅう}の日曜日{にちようび}、みんなで山{やま}へ行{い}きませんか。朝{あさ}八時{はちじ}に駅{えき}の前{まえ}で会{あ}いましょう。山{やま}の上{うえ}には店{みせ}がありませんから、お弁当{べんとう}と飲{の}み物{もの}を持{も}って来{き}てください。',
        terjemahan: 'Hari Minggu depan, maukah kita semua pergi ke gunung? Mari bertemu di depan stasiun pukul 8 pagi. Di atas gunung tidak ada toko, jadi bawalah bento dan minuman.',
        soal: [
          { id: 'L3-39-1', tanya: '日曜日{にちようび}の朝{あさ}、どこで会{あ}いますか。', tanyaId: 'Minggu pagi, bertemu di mana?', opsi: ['山{やま}の上{うえ}', '駅{えき}の前{まえ}', '店{みせ}の前{まえ}'], benar: 1, pembahasan: '朝八時に駅の前で会いましょう = mari bertemu di depan stasiun pukul 8 pagi.' },
          { id: 'L3-39-2', tanya: 'どうしてお弁当{べんとう}を持{も}って行{い}きますか。', tanyaId: 'Mengapa membawa bento?', opsi: ['山{やま}の店{みせ}は高{たか}いからです', '朝{あさ}早{はや}く出{で}るからです', '山{やま}の上{うえ}に店{みせ}がないからです'], benar: 2, pembahasan: '山の上には店がありませんから、お弁当と飲み物を持って来てください = di atas gunung tidak ada toko, jadi bawalah bento dan minuman.' },
        ],
      },
      {
        id: 'L3-40',
        judul: 'エアコンがこわれました',
        teks: 'きのう、部屋{へや}のエアコンがこわれました。事務所{じむしょ}に電話{でんわ}しましたが、電気屋{でんきや}さんは木曜日{もくようび}に来{き}ます。とても暑{あつ}いですから、今日{きょう}は友{とも}だちの部屋{へや}で寝{ね}ます。',
        terjemahan: 'Kemarin AC kamar saya rusak. Saya sudah menelepon kantor, tetapi tukang listrik baru datang hari Kamis. Karena sangat panas, hari ini saya tidur di kamar teman.',
        soal: [
          { id: 'L3-40-1', tanya: '電気屋{でんきや}さんはいつ来{き}ますか。', tanyaId: 'Kapan tukang listrik datang?', opsi: ['今日{きょう}', '火曜日{かようび}', '木曜日{もくようび}'], benar: 2, pembahasan: '電気屋さんは木曜日に来ます = tukang listrik datang hari Kamis.' },
          { id: 'L3-40-2', tanya: 'どうして今日{きょう}は友{とも}だちの部屋{へや}で寝{ね}ますか。', tanyaId: 'Mengapa hari ini ia tidur di kamar teman?', opsi: ['エアコンがこわれて暑{あつ}いからです', '友{とも}だちと話{はな}したいからです', '部屋{へや}をそうじしているからです'], benar: 0, pembahasan: '部屋のエアコンがこわれました…とても暑いですから、今日は友だちの部屋で寝ます = AC kamar rusak; karena sangat panas, hari ini tidur di kamar teman.' },
        ],
      },
      {
        id: 'L3-41',
        judul: 'ロッカーのお知{し}らせ',
        teks: '工場{こうじょう}に入{はい}る前{まえ}に、けいたい電話{でんわ}をロッカーに入{い}れてください。仕事{しごと}の時間{じかん}は使{つか}ってはいけません。昼休{ひるやす}みは使{つか}ってもいいです。ロッカーのかぎは事務所{じむしょ}にあります。',
        terjemahan: 'Sebelum masuk pabrik, masukkan telepon genggam ke loker. Pada jam kerja tidak boleh dipakai. Pada istirahat siang boleh dipakai. Kunci loker ada di kantor.',
        soal: [
          { id: 'L3-41-1', tanya: '工場{こうじょう}に入{はい}る前{まえ}に、けいたい電話{でんわ}をどうしますか。', tanyaId: 'Sebelum masuk pabrik, telepon genggam harus diapakan?', opsi: ['ロッカーに入{い}れます', '事務所{じむしょ}に置{お}きます', 'かばんに入{い}れます'], benar: 0, pembahasan: '工場に入る前に、けいたい電話をロッカーに入れてください = sebelum masuk pabrik, masukkan telepon genggam ke loker.' },
          { id: 'L3-41-2', tanya: 'ロッカーのかぎはどこにありますか。', tanyaId: 'Kunci loker ada di mana?', opsi: ['工場{こうじょう}の入口{いりぐち}', '事務所{じむしょ}', '食堂{しょくどう}'], benar: 1, pembahasan: 'ロッカーのかぎは事務所にあります = kunci loker ada di kantor.' },
        ],
      },
      {
        id: 'L3-42',
        judul: '先輩{せんぱい}と海{うみ}でつり',
        teks: '日曜日{にちようび}、先輩{せんぱい}と海{うみ}へつりに行{い}きました。朝{あさ}は魚{さかな}がたくさんいますから、五時{ごじ}に寮{りょう}を出{で}ました。わたしは小{ちい}さい魚{さかな}を三匹{さんびき}つりました。先輩{せんぱい}は八匹{はっぴき}つりました。',
        terjemahan: 'Hari Minggu saya pergi memancing ke laut bersama senior. Pagi hari ikannya banyak, jadi kami berangkat dari asrama pukul 5. Saya mendapat tiga ekor ikan kecil. Senior mendapat delapan ekor.',
        soal: [
          { id: 'L3-42-1', tanya: 'わたしは魚{さかな}を何匹{なんびき}つりましたか。', tanyaId: 'Penulis mendapat berapa ekor ikan?', opsi: ['五匹{ごひき}', '三匹{さんびき}', '八匹{はっぴき}'], benar: 1, pembahasan: 'わたしは小さい魚を三匹つりました = saya mendapat tiga ekor ikan kecil.' },
          { id: 'L3-42-2', tanya: 'どうして五時{ごじ}に寮{りょう}を出{で}ましたか。', tanyaId: 'Mengapa mereka berangkat dari asrama pukul 5?', opsi: ['朝{あさ}は魚{さかな}がたくさんいるからです', '海{うみ}が寮{りょう}から遠{とお}いからです', '昼{ひる}から仕事{しごと}があるからです'], benar: 0, pembahasan: '朝は魚がたくさんいますから、五時に寮を出ました = pagi hari ikannya banyak, jadi berangkat dari asrama pukul 5.' },
        ],
      },
      {
        id: 'L3-43',
        judul: '山田{やまだ}さんのりんご',
        teks: 'きのう、となりの部屋{へや}の山田{やまだ}さんにりんごを十{じゅっ}こもらいました。山田{やまだ}さんのお父{とう}さんがりんごを作{つく}っています。一人{ひとり}で十{じゅっ}こは多{おお}いですから、あした会社{かいしゃ}の人{ひと}に半分{はんぶん}あげます。',
        terjemahan: 'Kemarin saya mendapat sepuluh buah apel dari Yamada, penghuni kamar sebelah. Ayah Yamada menanam apel. Sepuluh buah terlalu banyak untuk satu orang, jadi besok separuhnya saya berikan kepada orang kantor.',
        soal: [
          { id: 'L3-43-1', tanya: 'だれがりんごを作{つく}っていますか。', tanyaId: 'Siapa yang menanam apel?', opsi: ['山田{やまだ}さんのお母{かあ}さん', '山田{やまだ}さんのお兄{にい}さん', '山田{やまだ}さんのお父{とう}さん'], benar: 2, pembahasan: '山田さんのお父さんがりんごを作っています = ayah Yamada menanam apel.' },
          { id: 'L3-43-2', tanya: 'どうして会社{かいしゃ}の人{ひと}にりんごをあげますか。', tanyaId: 'Mengapa ia memberikan apel kepada orang kantor?', opsi: ['会社{かいしゃ}の人{ひと}がりんごが好{す}きだからです', '一人{ひとり}で十{じゅっ}こは多{おお}いからです', 'りんごがあまり好{す}きではないからです'], benar: 1, pembahasan: '一人で十こは多いですから、あした会社の人に半分あげます = sepuluh buah terlalu banyak untuk satu orang, jadi besok separuhnya diberikan kepada orang kantor.' },
        ],
      },
      {
        id: 'L3-44',
        judul: '教室{きょうしつ}を休{やす}みます',
        teks: '山田{やまだ}先生{せんせい}、こんばんは。あしたは仕事{しごと}が夜{よる}八時{はちじ}までありますから、日本語{にほんご}の教室{きょうしつ}を休{やす}みます。宿題{しゅくだい}は来週{らいしゅう}の火曜日{かようび}に出{だ}します。すみません。',
        terjemahan: 'Yamada-sensei, selamat malam. Besok saya ada pekerjaan sampai pukul 8 malam, jadi saya tidak masuk kelas bahasa Jepang. PR akan saya kumpulkan hari Selasa minggu depan. Mohon maaf.',
        soal: [
          { id: 'L3-44-1', tanya: 'どうしてあした教室{きょうしつ}を休{やす}みますか。', tanyaId: 'Mengapa besok ia tidak masuk kelas?', opsi: ['仕事{しごと}が夜{よる}まであるからです', '宿題{しゅくだい}をしていないからです', 'かぜをひいているからです'], benar: 0, pembahasan: 'あしたは仕事が夜八時までありますから、日本語の教室を休みます = besok ada pekerjaan sampai pukul 8 malam, jadi tidak masuk kelas bahasa Jepang.' },
          { id: 'L3-44-2', tanya: '宿題{しゅくだい}はいつ出{だ}しますか。', tanyaId: 'Kapan PR dikumpulkan?', opsi: ['あしたの夜{よる}', '今週{こんしゅう}の火曜日{かようび}', '来週{らいしゅう}の火曜日{かようび}'], benar: 2, pembahasan: '宿題は来週の火曜日に出します = PR dikumpulkan hari Selasa minggu depan.' },
        ],
      },
      {
        id: 'L3-45',
        judul: '寮{りょう}の台所{だいどころ}のそうじ',
        teks: '寮{りょう}の台所{だいどころ}は、みんなで使{つか}います。料理{りょうり}のあとで、すぐさらをあらってください。毎週{まいしゅう}日曜日{にちようび}の朝{あさ}九時{くじ}から、みんなで台所{だいどころ}をそうじします。仕事{しごと}の人{ひと}は土曜日{どようび}にしてください。',
        terjemahan: 'Dapur asrama dipakai bersama. Sesudah memasak, segera cucilah piring. Setiap hari Minggu mulai pukul 9 pagi, semua orang bersama-sama membersihkan dapur. Orang yang bekerja, silakan melakukannya pada hari Sabtu.',
        soal: [
          { id: 'L3-45-1', tanya: '料理{りょうり}のあとで、何{なに}をしますか。', tanyaId: 'Sesudah memasak, apa yang harus dilakukan?', opsi: ['台所{だいどころ}をそうじします', 'さらをあらいます', 'ごみを出{だ}します'], benar: 1, pembahasan: '料理のあとで、すぐさらをあらってください = sesudah memasak, segera cucilah piring.' },
          { id: 'L3-45-2', tanya: '日曜日{にちようび}に仕事{しごと}の人{ひと}は、いつそうじをしますか。', tanyaId: 'Orang yang bekerja pada hari Minggu, kapan membersihkan dapur?', opsi: ['日曜日{にちようび}の夜{よる}', '月曜日{げつようび}', '土曜日{どようび}'], benar: 2, pembahasan: '仕事の人は土曜日にしてください = orang yang bekerja, silakan melakukannya pada hari Sabtu.' },
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
      {
        id: 'L4-21',
        judul: '工場{こうじょう}の休{やす}み時間{じかん}',
        teks: 'わたしの工場{こうじょう}の仕事{しごと}は朝{あさ}八時{はちじ}に始{はじ}まります。十時{じゅうじ}から十分{じゅっぷん}休{やす}みます。昼休{ひるやす}みは十二時{じゅうにじ}から一時間{いちじかん}です。午後{ごご}は三時{さんじ}から十五分{じゅうごふん}休{やす}みます。仕事{しごと}は五時{ごじ}に終{お}わります。',
        terjemahan: 'Pekerjaan di pabrik saya mulai pukul 8 pagi. Mulai pukul 10 kami istirahat 10 menit. Istirahat siang mulai pukul 12 selama satu jam. Sore hari kami istirahat 15 menit mulai pukul 3. Pekerjaan selesai pukul 5.',
        soal: [
          { id: 'L4-21-1', tanya: '昼休{ひるやす}みは何時{なんじ}までですか。', tanyaId: 'Istirahat siang sampai pukul berapa?', opsi: ['十二時{じゅうにじ}', '一時{いちじ}', '三時{さんじ}'], benar: 1, pembahasan: '昼休みは十二時から一時間です = istirahat siang mulai pukul 12 selama satu jam (jadi sampai pukul 1).' },
          { id: 'L4-21-2', tanya: '三時{さんじ}からの休{やす}みは何分{なんぷん}ですか。', tanyaId: 'Istirahat yang mulai pukul 3 berapa menit?', opsi: ['十分{じゅっぷん}', '二十五分{にじゅうごふん}', '十五分{じゅうごふん}'], benar: 2, pembahasan: '午後は三時から十五分休みます = sore hari istirahat 15 menit mulai pukul 3.' },
        ],
      },
      {
        id: 'L4-22',
        judul: '会社{かいしゃ}のバス',
        teks: '寮{りょう}から工場{こうじょう}まで会社{かいしゃ}のバスで行{い}きます。朝{あさ}のバスは六時{ろくじ}四十分{よんじゅっぷん}と七時{しちじ}十分{じゅっぷん}に寮{りょう}の前{まえ}を出{で}ます。工場{こうじょう}まで二十分{にじゅっぷん}かかります。わたしはいつも七時{しちじ}十分{じゅっぷん}のバスに乗{の}ります。帰{かえ}りのバスは午後{ごご}五時半{ごじはん}です。',
        terjemahan: 'Dari asrama ke pabrik saya naik bus perusahaan. Bus pagi berangkat dari depan asrama pukul 6.40 dan pukul 7.10. Sampai pabrik perlu 20 menit. Saya selalu naik bus pukul 7.10. Bus pulang pukul 5.30 sore.',
        soal: [
          { id: 'L4-22-1', tanya: 'わたしはいつも何時{なんじ}に工場{こうじょう}に着{つ}きますか。', tanyaId: 'Penulis selalu tiba di pabrik pukul berapa?', opsi: ['七時{しちじ}三十分{さんじゅっぷん}', '七時{しちじ}十分{じゅっぷん}', '七時{しちじ}'], benar: 0, pembahasan: '工場まで二十分かかります。わたしはいつも七時十分のバスに乗ります = sampai pabrik 20 menit, dan saya selalu naik bus pukul 7.10 (jadi tiba pukul 7.30).' },
          { id: 'L4-22-2', tanya: '帰{かえ}りのバスは何時{なんじ}ですか。', tanyaId: 'Bus pulang pukul berapa?', opsi: ['午後{ごご}五時{ごじ}', '午後{ごご}六時半{ろくじはん}', '午後{ごご}五時半{ごじはん}'], benar: 2, pembahasan: '帰りのバスは午後五時半です = bus pulang pukul 5.30 sore.' },
        ],
      },
      {
        id: 'L4-23',
        judul: '一週間{いっしゅうかん}のごみの日{ひ}',
        teks: '寮{りょう}のごみの日{ひ}は一週間{いっしゅうかん}に四日{よっか}あります。燃{も}えるごみは月曜日{げつようび}と木曜日{もくようび}です。プラスチックは水曜日{すいようび}、びんとかんは金曜日{きんようび}です。朝{あさ}八時{はちじ}より前{まえ}に出{だ}してください。前{まえ}の日{ひ}の夜{よる}に出{だ}してはいけません。',
        terjemahan: 'Hari buang sampah di asrama ada empat hari dalam seminggu. Sampah yang bisa dibakar hari Senin dan Kamis. Plastik hari Rabu, botol dan kaleng hari Jumat. Keluarkanlah sebelum pukul 8 pagi. Tidak boleh mengeluarkannya pada malam hari sebelumnya.',
        soal: [
          { id: 'L4-23-1', tanya: 'びんとかんは何曜日{なんようび}に出{だ}しますか。', tanyaId: 'Botol dan kaleng dikeluarkan hari apa?', opsi: ['水曜日{すいようび}', '木曜日{もくようび}', '金曜日{きんようび}'], benar: 2, pembahasan: 'びんとかんは金曜日です = botol dan kaleng hari Jumat.' },
          { id: 'L4-23-2', tanya: '燃{も}えるごみの日{ひ}は一週間{いっしゅうかん}に何日{なんにち}ありますか。', tanyaId: 'Hari sampah yang bisa dibakar ada berapa hari dalam seminggu?', opsi: ['二日{ふつか}', '三日{みっか}', '四日{よっか}'], benar: 0, pembahasan: '燃えるごみは月曜日と木曜日です = sampah yang bisa dibakar hari Senin dan Kamis (jadi dua hari; empat hari adalah jumlah semua hari sampah).' },
        ],
      },
      {
        id: 'L4-24',
        judul: '家族{かぞく}へのお金{かね}',
        teks: 'わたしの給料{きゅうりょう}は毎月{まいつき}十五万円{じゅうごまんえん}です。毎月{まいつき}、国{くに}の家族{かぞく}に五万円{ごまんえん}送{おく}ります。寮{りょう}のお金{かね}は二万円{にまんえん}、食{た}べ物{もの}は三万円{さんまんえん}ぐらいです。家族{かぞく}へのお金{かね}は毎月{まいつき}二十五日{にじゅうごにち}に銀行{ぎんこう}から送{おく}ります。',
        terjemahan: 'Gaji saya 150.000 yen setiap bulan. Setiap bulan saya mengirim 50.000 yen kepada keluarga di negara asal. Biaya asrama 20.000 yen dan makanan kira-kira 30.000 yen. Uang untuk keluarga saya kirim dari bank setiap tanggal 25.',
        soal: [
          { id: 'L4-24-1', tanya: '家族{かぞく}へのお金{かね}は毎月{まいつき}何日{なんにち}に送{おく}りますか。', tanyaId: 'Uang untuk keluarga dikirim tanggal berapa setiap bulan?', opsi: ['十五日{じゅうごにち}', '二十五日{にじゅうごにち}', '五日{いつか}'], benar: 1, pembahasan: '家族へのお金は毎月二十五日に銀行から送ります = uang untuk keluarga dikirim dari bank setiap tanggal 25.' },
          { id: 'L4-24-2', tanya: '寮{りょう}のお金{かね}と食{た}べ物{もの}で、毎月{まいつき}いくらぐらいですか。', tanyaId: 'Biaya asrama dan makanan kira-kira berapa setiap bulan?', opsi: ['三万円{さんまんえん}', '五万円{ごまんえん}', '七万円{ななまんえん}'], benar: 1, pembahasan: '寮のお金は二万円、食べ物は三万円ぐらいです = biaya asrama 20.000 yen dan makanan kira-kira 30.000 yen (jumlahnya kira-kira 50.000 yen).' },
        ],
      },
      {
        id: 'L4-25',
        judul: 'せんたくの時間{じかん}',
        teks: '寮{りょう}のせんたくきは二階{にかい}に三{みっ}つあります。朝{あさ}六時{ろくじ}から夜{よる}十時{じゅうじ}まで使{つか}ってもいいです。一回{いっかい}百円{ひゃくえん}で、四十分{よんじゅっぷん}ぐらいかかります。わたしは土曜日{どようび}の朝{あさ}にせんたくをして、それから部屋{へや}のそうじをします。',
        terjemahan: 'Mesin cuci asrama ada tiga buah di lantai dua. Boleh dipakai dari pukul 6 pagi sampai pukul 10 malam. Sekali pakai 100 yen dan perlu kira-kira 40 menit. Saya mencuci pada Sabtu pagi, setelah itu membersihkan kamar.',
        soal: [
          { id: 'L4-25-1', tanya: 'せんたくきは何時{なんじ}まで使{つか}ってもいいですか。', tanyaId: 'Mesin cuci boleh dipakai sampai pukul berapa?', opsi: ['夜{よる}十時{じゅうじ}', '夜{よる}六時{ろくじ}', '朝{あさ}十時{じゅうじ}'], benar: 0, pembahasan: '朝六時から夜十時まで使ってもいいです = boleh dipakai dari pukul 6 pagi sampai pukul 10 malam.' },
          { id: 'L4-25-2', tanya: 'せんたくきを二回{にかい}使{つか}います。いくらですか。', tanyaId: 'Mesin cuci dipakai dua kali. Berapa biayanya?', opsi: ['百円{ひゃくえん}', '二百円{にひゃくえん}', '四百円{よんひゃくえん}'], benar: 1, pembahasan: '一回百円で = sekali pakai 100 yen (dua kali jadi 200 yen).' },
        ],
      },
      {
        id: 'L4-26',
        judul: '八月{はちがつ}三日{みっか}の夏{なつ}まつり',
        teks: '八月{はちがつ}三日{みっか}の土曜日{どようび}に町{まち}の夏{なつ}まつりがあります。場所{ばしょ}は駅{えき}の近{ちか}くの公園{こうえん}です。午後{ごご}四時{よじ}に始{はじ}まって、夜{よる}九時{くじ}に終{お}わります。七時{しちじ}からおどりがあります。わたしは寮{りょう}の友{とも}だちと五時{ごじ}に行{い}きます。',
        terjemahan: 'Hari Sabtu tanggal 3 Agustus ada festival musim panas di kota. Tempatnya di taman dekat stasiun. Mulai pukul 4 sore dan selesai pukul 9 malam. Mulai pukul 7 ada tarian. Saya pergi pukul 5 bersama teman asrama.',
        soal: [
          { id: 'L4-26-1', tanya: '夏{なつ}まつりは何時間{なんじかん}ありますか。', tanyaId: 'Festival musim panas berlangsung berapa jam?', opsi: ['三時間{さんじかん}', '四時間{よじかん}', '五時間{ごじかん}'], benar: 2, pembahasan: '午後四時に始まって、夜九時に終わります = mulai pukul 4 sore dan selesai pukul 9 malam (jadi lima jam).' },
          { id: 'L4-26-2', tanya: 'おどりは何時{なんじ}からですか。', tanyaId: 'Tarian mulai pukul berapa?', opsi: ['四時{よじ}', '五時{ごじ}', '七時{しちじ}'], benar: 2, pembahasan: '七時からおどりがあります = mulai pukul 7 ada tarian.' },
        ],
      },
      {
        id: 'L4-27',
        judul: 'さくら病院{びょういん}の時間{じかん}',
        teks: 'さくら病院{びょういん}は月曜日{げつようび}から土曜日{どようび}まで開{あ}いています。午前{ごぜん}は九時{くじ}から十二時{じゅうにじ}まで、午後{ごご}は三時{さんじ}から六時{ろくじ}までです。水曜日{すいようび}と土曜日{どようび}は午前{ごぜん}だけです。日曜日{にちようび}は休{やす}みです。',
        terjemahan: 'Rumah Sakit Sakura buka dari Senin sampai Sabtu. Pagi dari pukul 9 sampai pukul 12, sore dari pukul 3 sampai pukul 6. Hari Rabu dan Sabtu hanya buka pagi. Hari Minggu libur.',
        soal: [
          { id: 'L4-27-1', tanya: '午後{ごご}は何時{なんじ}に開{あ}きますか。', tanyaId: 'Sore hari buka pukul berapa?', opsi: ['九時{くじ}', '三時{さんじ}', '六時{ろくじ}'], benar: 1, pembahasan: '午後は三時から六時までです = sore dari pukul 3 sampai pukul 6.' },
          { id: 'L4-27-2', tanya: '水曜日{すいようび}は何時{なんじ}まで開{あ}いていますか。', tanyaId: 'Hari Rabu buka sampai pukul berapa?', opsi: ['十二時{じゅうにじ}', '三時{さんじ}', '六時{ろくじ}'], benar: 0, pembahasan: '午前は九時から十二時まで…水曜日と土曜日は午前だけです = pagi dari pukul 9 sampai pukul 12, dan hari Rabu serta Sabtu hanya buka pagi (jadi hari Rabu sampai pukul 12).' },
        ],
      },
      {
        id: 'L4-28',
        judul: '母{はは}への荷物{にもつ}',
        teks: 'きのう、郵便局{ゆうびんきょく}から国{くに}の母{はは}に荷物{にもつ}を送{おく}りました。中{なか}は日本{にほん}のおかしとくつです。ひこうきで送{おく}って、四千円{よんせんえん}でした。船{ふね}は二千円{にせんえん}ですが、二{に}か月{げつ}かかります。ひこうきは一週間{いっしゅうかん}ぐらいで着{つ}きます。',
        terjemahan: 'Kemarin saya mengirim paket dari kantor pos kepada ibu di negara asal. Isinya kue Jepang dan sepatu. Saya mengirimnya dengan pesawat, biayanya 4.000 yen. Dengan kapal 2.000 yen, tetapi perlu dua bulan. Dengan pesawat tiba dalam kira-kira satu minggu.',
        soal: [
          { id: 'L4-28-1', tanya: '荷物{にもつ}の中{なか}に何{なに}がありますか。', tanyaId: 'Apa isi paketnya?', opsi: ['おかしとくつ', 'おかしと服{ふく}', 'くつと本{ほん}'], benar: 0, pembahasan: '中は日本のおかしとくつです = isinya kue Jepang dan sepatu.' },
          { id: 'L4-28-2', tanya: 'ひこうきは船{ふね}よりいくら高{たか}いですか。', tanyaId: 'Pesawat lebih mahal berapa daripada kapal?', opsi: ['二千円{にせんえん}', '四千円{よんせんえん}', '六千円{ろくせんえん}'], benar: 0, pembahasan: 'ひこうきで送って、四千円でした。船は二千円ですが = dengan pesawat 4.000 yen, dengan kapal 2.000 yen (selisihnya 2.000 yen).' },
        ],
      },
      {
        id: 'L4-29',
        judul: '食堂{しょくどう}の昼{ひる}ごはん',
        teks: '工場{こうじょう}の食堂{しょくどう}は十一時半{じゅういちじはん}から一時{いちじ}まで開{あ}いています。ラーメンは三百五十円{さんびゃくごじゅうえん}、カレーは四百円{よんひゃくえん}、魚{さかな}の弁当{べんとう}は五百円{ごひゃくえん}です。お茶{ちゃ}はお金{かね}がいりません。わたしは今日{きょう}、カレーとサラダを食{た}べました。サラダは百円{ひゃくえん}でした。',
        terjemahan: 'Kantin pabrik buka dari pukul 11.30 sampai pukul 1. Ramen 350 yen, kari 400 yen, dan bento ikan 500 yen. Teh tidak perlu bayar. Hari ini saya makan kari dan salad. Saladnya 100 yen.',
        soal: [
          { id: 'L4-29-1', tanya: '食堂{しょくどう}は何時{なんじ}に閉{し}まりますか。', tanyaId: 'Kantin tutup pukul berapa?', opsi: ['十一時半{じゅういちじはん}', '十二時{じゅうにじ}', '一時{いちじ}'], benar: 2, pembahasan: '食堂は十一時半から一時まで開いています = kantin buka dari pukul 11.30 sampai pukul 1.' },
          { id: 'L4-29-2', tanya: 'わたしの今日{きょう}の昼{ひる}ごはんは、全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Makan siang penulis hari ini semuanya berapa?', opsi: ['四百円{よんひゃくえん}', '五百円{ごひゃくえん}', '六百円{ろっぴゃくえん}'], benar: 1, pembahasan: 'カレーは四百円…カレーとサラダを食べました。サラダは百円でした = kari 400 yen; saya makan kari dan salad, saladnya 100 yen (jumlahnya 500 yen).' },
        ],
      },
      {
        id: 'L4-30',
        judul: '会社{かいしゃ}のはじめての日{ひ}',
        teks: 'あしたは会社{かいしゃ}のはじめての日{ひ}です。八時半{はちじはん}に事務所{じむしょ}へ行{い}って、九時{くじ}から会社{かいしゃ}の話{はなし}を聞{き}きます。十時{じゅうじ}から工場{こうじょう}の中{なか}を見{み}ます。昼{ひる}ごはんのあとで、仕事{しごと}の服{ふく}とくつをもらいます。仕事{しごと}はあさってからです。',
        terjemahan: 'Besok adalah hari pertama saya di perusahaan. Pukul 8.30 saya pergi ke kantor, lalu mulai pukul 9 mendengarkan penjelasan tentang perusahaan. Mulai pukul 10 saya melihat bagian dalam pabrik. Setelah makan siang, saya menerima baju dan sepatu kerja. Pekerjaan dimulai lusa.',
        soal: [
          { id: 'L4-30-1', tanya: '八時半{はちじはん}にどこへ行{い}きますか。', tanyaId: 'Pukul 8.30 pergi ke mana?', opsi: ['工場{こうじょう}', '事務所{じむしょ}', '食堂{しょくどう}'], benar: 1, pembahasan: '八時半に事務所へ行って = pukul 8.30 pergi ke kantor.' },
          { id: 'L4-30-2', tanya: '工場{こうじょう}の中{なか}を見{み}るまえに、何{なに}をしますか。', tanyaId: 'Sebelum melihat bagian dalam pabrik, apa yang dilakukan?', opsi: ['昼{ひる}ごはんを食{た}べます', '仕事{しごと}の服{ふく}をもらいます', '会社{かいしゃ}の話{はなし}を聞{き}きます'], benar: 2, pembahasan: '九時から会社の話を聞きます。十時から工場の中を見ます = mulai pukul 9 mendengarkan penjelasan perusahaan, mulai pukul 10 melihat bagian dalam pabrik (makan siang dan menerima baju sesudahnya).' },
        ],
      },
      {
        id: 'L4-31',
        judul: '土曜日{どようび}の日本語{にほんご}クラス',
        teks: '町{まち}の日本語{にほんご}クラスは毎週{まいしゅう}土曜日{どようび}にあります。午前{ごぜん}のクラスは十時{じゅうじ}から十二時{じゅうにじ}まで、午後{ごご}のクラスは二時{にじ}から四時{よじ}までです。一回{いっかい}二百円{にひゃくえん}です。場所{ばしょ}は図書館{としょかん}の二階{にかい}です。わたしは午後{ごご}のクラスで漢字{かんじ}を習{なら}っています。',
        terjemahan: 'Kelas bahasa Jepang di kota diadakan setiap hari Sabtu. Kelas pagi dari pukul 10 sampai pukul 12, kelas sore dari pukul 2 sampai pukul 4. Sekali datang 200 yen. Tempatnya di lantai dua perpustakaan. Saya belajar kanji di kelas sore.',
        soal: [
          { id: 'L4-31-1', tanya: 'わたしのクラスは何時{なんじ}に始{はじ}まりますか。', tanyaId: 'Kelas penulis mulai pukul berapa?', opsi: ['二時{にじ}', '十時{じゅうじ}', '四時{よじ}'], benar: 0, pembahasan: '午後のクラスは二時から四時までです…わたしは午後のクラスで漢字を習っています = kelas sore dari pukul 2 sampai pukul 4, dan saya belajar di kelas sore (jadi mulai pukul 2).' },
          { id: 'L4-31-2', tanya: 'クラスの場所{ばしょ}はどこですか。', tanyaId: 'Di mana tempat kelasnya?', opsi: ['学校{がっこう}の二階{にかい}', '図書館{としょかん}の一階{いっかい}', '図書館{としょかん}の二階{にかい}'], benar: 2, pembahasan: '場所は図書館の二階です = tempatnya di lantai dua perpustakaan.' },
        ],
      },
      {
        id: 'L4-32',
        judul: '赤{あか}い自転車{じてんしゃ}と青{あお}い自転車{じてんしゃ}',
        teks: '自転車{じてんしゃ}の店{みせ}へ行{い}きました。赤{あか}い自転車{じてんしゃ}は新{あたら}しくて、二万円{にまんえん}です。青{あお}い自転車{じてんしゃ}は古{ふる}いですが、八千円{はっせんえん}です。赤{あか}いほうが軽{かる}いです。でも、わたしはお金{かね}があまりありませんから、安{やす}いほうを買{か}いました。',
        terjemahan: 'Saya pergi ke toko sepeda. Sepeda merah masih baru dan harganya 20.000 yen. Sepeda biru sudah tua, tetapi harganya 8.000 yen. Yang merah lebih ringan. Namun, karena uang saya tidak banyak, saya membeli yang lebih murah.',
        soal: [
          { id: 'L4-32-1', tanya: 'わたしはどの自転車{じてんしゃ}を買{か}いましたか。', tanyaId: 'Sepeda mana yang dibeli penulis?', opsi: ['赤{あか}い自転車{じてんしゃ}', '黒{くろ}い自転車{じてんしゃ}', '青{あお}い自転車{じてんしゃ}'], benar: 2, pembahasan: '青い自転車は古いですが、八千円です…安いほうを買いました = sepeda biru sudah tua tetapi 8.000 yen; saya membeli yang lebih murah (yaitu sepeda biru).' },
          { id: 'L4-32-2', tanya: '赤{あか}い自転車{じてんしゃ}はどんな自転車{じてんしゃ}ですか。', tanyaId: 'Sepeda merah itu sepeda yang bagaimana?', opsi: ['新{あたら}しくて軽{かる}いです', '古{ふる}くて軽{かる}いです', '新{あたら}しくて安{やす}いです'], benar: 0, pembahasan: '赤い自転車は新しくて、二万円です…赤いほうが軽いです = sepeda merah masih baru dan harganya 20.000 yen; yang merah lebih ringan.' },
        ],
      },
      {
        id: 'L4-33',
        judul: 'スーパーの安{やす}い日{ひ}',
        teks: '寮{りょう}の近{ちか}くのスーパーは、火曜日{かようび}に野菜{やさい}が安{やす}いです。金曜日{きんようび}は肉{にく}と魚{さかな}が安{やす}いです。五百円{ごひゃくえん}の弁当{べんとう}は、夜{よる}七時{しちじ}から三百円{さんびゃくえん}になります。わたしは金曜日{きんようび}の夜{よる}、仕事{しごと}のあとで行{い}って、肉{にく}と弁当{べんとう}を買{か}います。',
        terjemahan: 'Di supermarket dekat asrama, sayuran murah pada hari Selasa. Hari Jumat daging dan ikan murah. Bento seharga 500 yen menjadi 300 yen mulai pukul 7 malam. Saya pergi Jumat malam sepulang kerja, lalu membeli daging dan bento.',
        soal: [
          { id: 'L4-33-1', tanya: '野菜{やさい}は何曜日{なんようび}に安{やす}いですか。', tanyaId: 'Sayuran murah pada hari apa?', opsi: ['金曜日{きんようび}', '火曜日{かようび}', '土曜日{どようび}'], benar: 1, pembahasan: '火曜日に野菜が安いです = sayuran murah pada hari Selasa.' },
          { id: 'L4-33-2', tanya: '夜{よる}七時{しちじ}からの弁当{べんとう}は、五百円{ごひゃくえん}よりいくら安{やす}いですか。', tanyaId: 'Bento mulai pukul 7 malam lebih murah berapa yen daripada 500 yen?', opsi: ['二百円{にひゃくえん}', '三百円{さんびゃくえん}', '五百円{ごひゃくえん}'], benar: 0, pembahasan: '五百円の弁当は、夜七時から三百円になります = bento 500 yen menjadi 300 yen mulai pukul 7 malam (lebih murah 200 yen).' },
        ],
      },
      {
        id: 'L4-34',
        judul: '三人{さんにん}の兄弟{きょうだい}',
        teks: 'わたしは三人{さんにん}兄弟{きょうだい}です。兄{あに}は二十八歳{にじゅうはっさい}で、ジャカルタの銀行{ぎんこう}で働{はたら}いています。わたしは兄{あに}より四歳{よんさい}若{わか}いです。弟{おとうと}は十九歳{じゅうきゅうさい}の大学生{だいがくせい}です。三人{さんにん}の中{なか}で、弟{おとうと}がいちばん背{せ}が高{たか}いです。',
        terjemahan: 'Saya tiga bersaudara. Kakak laki-laki saya berumur 28 tahun dan bekerja di bank di Jakarta. Saya empat tahun lebih muda daripada kakak. Adik laki-laki saya mahasiswa berumur 19 tahun. Di antara kami bertiga, adik yang paling tinggi badannya.',
        soal: [
          { id: 'L4-34-1', tanya: 'わたしは何歳{なんさい}ですか。', tanyaId: 'Berapa umur penulis?', opsi: ['二十三歳{にじゅうさんさい}', '三十二歳{さんじゅうにさい}', '二十四歳{にじゅうよんさい}'], benar: 2, pembahasan: '兄は二十八歳で…わたしは兄より四歳若いです = kakak berumur 28 tahun, dan saya empat tahun lebih muda (jadi 24 tahun).' },
          { id: 'L4-34-2', tanya: 'いちばん背{せ}が高{たか}い人{ひと}はだれですか。', tanyaId: 'Siapa yang paling tinggi badannya?', opsi: ['兄{あに}', '弟{おとうと}', 'わたし'], benar: 1, pembahasan: '三人の中で、弟がいちばん背が高いです = di antara bertiga, adik yang paling tinggi badannya.' },
        ],
      },
      {
        id: 'L4-35',
        judul: '今週{こんしゅう}の天気{てんき}',
        teks: '今週{こんしゅう}の天気{てんき}です。月曜日{げつようび}と火曜日{かようび}は晴{は}れで、暑{あつ}くなります。水曜日{すいようび}はくもりです。木曜日{もくようび}から土曜日{どようび}まで雨{あめ}が降{ふ}ります。日曜日{にちようび}はまた晴{は}れますが、風{かぜ}が強{つよ}いです。',
        terjemahan: 'Ini cuaca minggu ini. Hari Senin dan Selasa cerah dan menjadi panas. Hari Rabu berawan. Dari Kamis sampai Sabtu hujan turun. Hari Minggu cerah lagi, tetapi anginnya kencang.',
        soal: [
          { id: 'L4-35-1', tanya: '水曜日{すいようび}の天気{てんき}はどうですか。', tanyaId: 'Bagaimana cuaca hari Rabu?', opsi: ['くもりです', '晴{は}れです', '雨{あめ}です'], benar: 0, pembahasan: '水曜日はくもりです = hari Rabu berawan.' },
          { id: 'L4-35-2', tanya: '今週{こんしゅう}、雨{あめ}の日{ひ}は何日{なんにち}ありますか。', tanyaId: 'Minggu ini ada berapa hari hujan?', opsi: ['二日{ふつか}', '三日{みっか}', '四日{よっか}'], benar: 1, pembahasan: '木曜日から土曜日まで雨が降ります = dari Kamis sampai Sabtu hujan turun (Kamis, Jumat, Sabtu = tiga hari).' },
        ],
      },
      {
        id: 'L4-36',
        judul: '東京{とうきょう}までの行{い}き方{かた}',
        teks: '寮{りょう}から東京{とうきょう}までの行{い}き方{かた}です。はじめに、寮{りょう}の前{まえ}からバスに十五分{じゅうごふん}乗{の}って、みどり駅{えき}で降{お}ります。それから、電車{でんしゃ}に四十分{よんじゅっぷん}乗{の}ります。バスは二百円{にひゃくえん}、電車{でんしゃ}は六百円{ろっぴゃくえん}です。',
        terjemahan: 'Ini cara pergi dari asrama ke Tokyo. Pertama, naik bus dari depan asrama selama 15 menit, lalu turun di Stasiun Midori. Setelah itu, naik kereta selama 40 menit. Bus 200 yen, kereta 600 yen.',
        soal: [
          { id: 'L4-36-1', tanya: '寮{りょう}から東京{とうきょう}まで、全部{ぜんぶ}でいくらかかりますか。', tanyaId: 'Dari asrama sampai Tokyo, semuanya perlu biaya berapa?', opsi: ['六百円{ろっぴゃくえん}', '八百円{はっぴゃくえん}', '千円{せんえん}'], benar: 1, pembahasan: 'バスは二百円、電車は六百円です = bus 200 yen, kereta 600 yen (jumlahnya 800 yen).' },
          { id: 'L4-36-2', tanya: 'バスに何分{なんぷん}乗{の}りますか。', tanyaId: 'Naik bus berapa menit?', opsi: ['四十分{よんじゅっぷん}', '五十五分{ごじゅうごふん}', '十五分{じゅうごふん}'], benar: 2, pembahasan: '寮の前からバスに十五分乗って = naik bus dari depan asrama selama 15 menit.' },
        ],
      },
      {
        id: 'L4-37',
        judul: '日曜日{にちようび}の買{か}い物{もの}',
        teks: '日曜日{にちようび}にスーパーで買{か}い物{もの}をしました。たまごは二百円{にひゃくえん}、牛乳{ぎゅうにゅう}は百八十円{ひゃくはちじゅうえん}でした。りんごは一{ひと}つ百円{ひゃくえん}で、三{みっ}つ買{か}いました。パンは高{たか}かったですから、買{か}いませんでした。千円{せんえん}出{だ}して、おつりをもらいました。',
        terjemahan: 'Hari Minggu saya berbelanja di supermarket. Telur 200 yen dan susu 180 yen. Apel satu buah 100 yen, dan saya membeli tiga buah. Roti mahal, jadi saya tidak membelinya. Saya membayar dengan 1.000 yen dan menerima kembalian.',
        soal: [
          { id: 'L4-37-1', tanya: 'りんごは全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Apelnya semuanya berapa?', opsi: ['百円{ひゃくえん}', '二百円{にひゃくえん}', '三百円{さんびゃくえん}'], benar: 2, pembahasan: 'りんごは一つ百円で、三つ買いました = apel satu buah 100 yen dan saya membeli tiga buah (jadi 300 yen).' },
          { id: 'L4-37-2', tanya: 'わたしは何{なに}を買{か}いませんでしたか。', tanyaId: 'Apa yang tidak dibeli penulis?', opsi: ['パン', '牛乳{ぎゅうにゅう}', 'たまご'], benar: 0, pembahasan: 'パンは高かったですから、買いませんでした = roti mahal, jadi tidak dibeli.' },
        ],
      },
      {
        id: 'L4-38',
        judul: '土曜日{どようび}の映画{えいが}',
        teks: '土曜日{どようび}に友{とも}だちと映画{えいが}を見{み}に行{い}きます。映画{えいが}は午後{ごご}一時{いちじ}と四時{よじ}にあります。わたしたちは四時{よじ}の映画{えいが}を見{み}ます。映画{えいが}は二時間{にじかん}です。三時半{さんじはん}に映画館{えいがかん}の前{まえ}で会{あ}って、映画{えいが}のあとで晩{ばん}ごはんを食{た}べます。',
        terjemahan: 'Hari Sabtu saya pergi menonton film bersama teman. Filmnya diputar pukul 1 siang dan pukul 4 sore. Kami menonton film yang pukul 4. Filmnya dua jam. Kami bertemu pukul 3.30 di depan bioskop, dan setelah film kami makan malam.',
        soal: [
          { id: 'L4-38-1', tanya: 'わたしたちの映画{えいが}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Film yang ditonton penulis dan temannya selesai pukul berapa?', opsi: ['六時{ろくじ}', '三時{さんじ}', '四時{よじ}'], benar: 0, pembahasan: 'わたしたちは四時の映画を見ます。映画は二時間です = kami menonton film pukul 4, dan filmnya dua jam (jadi selesai pukul 6).' },
          { id: 'L4-38-2', tanya: '友{とも}だちと何時{なんじ}に会{あ}いますか。', tanyaId: 'Bertemu teman pukul berapa?', opsi: ['一時{いちじ}', '三時半{さんじはん}', '四時{よじ}'], benar: 1, pembahasan: '三時半に映画館の前で会って = bertemu pukul 3.30 di depan bioskop.' },
        ],
      },
      {
        id: 'L4-39',
        judul: 'リナさんの誕生日{たんじょうび}パーティー',
        teks: '来週{らいしゅう}の日曜日{にちようび}はリナさんの誕生日{たんじょうび}です。寮{りょう}の食堂{しょくどう}で六時{ろくじ}からパーティーをします。アグスさんはケーキを買{か}います。サリさんは料理{りょうり}を作{つく}ります。わたしは飲{の}み物{もの}と花{はな}を持{も}っていきます。準備{じゅんび}は五時{ごじ}からです。',
        terjemahan: 'Hari Minggu depan adalah ulang tahun Rina. Kami mengadakan pesta di kantin asrama mulai pukul 6. Agus membeli kue. Sari memasak makanan. Saya membawa minuman dan bunga. Persiapannya mulai pukul 5.',
        soal: [
          { id: 'L4-39-1', tanya: 'だれがケーキを買{か}いますか。', tanyaId: 'Siapa yang membeli kue?', opsi: ['サリさん', 'アグスさん', 'リナさん'], benar: 1, pembahasan: 'アグスさんはケーキを買います = Agus membeli kue.' },
          { id: 'L4-39-2', tanya: 'パーティーの前{まえ}に、何時間{なんじかん}準備{じゅんび}をしますか。', tanyaId: 'Sebelum pesta, persiapannya berapa jam?', opsi: ['三時間{さんじかん}', '二時間{にじかん}', '一時間{いちじかん}'], benar: 2, pembahasan: '六時からパーティーをします…準備は五時からです = pesta mulai pukul 6 dan persiapan mulai pukul 5 (jadi satu jam).' },
        ],
      },
      {
        id: 'L4-40',
        judul: '日曜日{にちようび}の動物園{どうぶつえん}',
        teks: '日曜日{にちようび}に、大人{おとな}二人{ふたり}と子{こ}ども二人{ふたり}で動物園{どうぶつえん}へ行{い}きました。きっぷは大人{おとな}が六百円{ろっぴゃくえん}、子{こ}どもが二百円{にひゃくえん}です。九時{くじ}に入{はい}って、午後{ごご}三時{さんじ}に出{で}ました。昼{ひる}ごはんは動物園{どうぶつえん}の中{なか}のレストランで食{た}べました。',
        terjemahan: 'Hari Minggu kami pergi ke kebun binatang, dua orang dewasa dan dua anak. Tiket dewasa 600 yen dan anak-anak 200 yen. Kami masuk pukul 9 dan keluar pukul 3 sore. Makan siang kami di restoran di dalam kebun binatang.',
        soal: [
          { id: 'L4-40-1', tanya: 'きっぷは全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Tiketnya semuanya berapa?', opsi: ['八百円{はっぴゃくえん}', '千四百円{せんよんひゃくえん}', '千六百円{せんろっぴゃくえん}'], benar: 2, pembahasan: '大人二人と子ども二人で…きっぷは大人が六百円、子どもが二百円です = dua dewasa dan dua anak; tiket dewasa 600 yen, anak 200 yen (1.200 + 400 = 1.600 yen).' },
          { id: 'L4-40-2', tanya: '昼{ひる}ごはんはどこで食{た}べましたか。', tanyaId: 'Makan siang di mana?', opsi: ['動物園{どうぶつえん}の前{まえ}のレストラン', '駅{えき}の近{ちか}くのレストラン', '動物園{どうぶつえん}の中{なか}のレストラン'], benar: 2, pembahasan: '昼ごはんは動物園の中のレストランで食べました = makan siang di restoran di dalam kebun binatang.' },
        ],
      },
      {
        id: 'L4-41',
        judul: 'サッカーの練習{れんしゅう}',
        teks: '会社{かいしゃ}のサッカーチームの練習{れんしゅう}は、火曜日{かようび}と金曜日{きんようび}の夜{よる}です。七時{しちじ}から八時半{はちじはん}まで、工場{こうじょう}のとなりの公園{こうえん}で練習{れんしゅう}をします。雨{あめ}の日{ひ}は休{やす}みです。来月{らいげつ}の十日{とおか}に、となりの町{まち}のチームと試合{しあい}をします。',
        terjemahan: 'Latihan tim sepak bola perusahaan diadakan Selasa malam dan Jumat malam. Latihannya dari pukul 7 sampai pukul 8.30 di taman sebelah pabrik. Kalau hari hujan, latihan libur. Tanggal 10 bulan depan kami bertanding dengan tim dari kota sebelah.',
        soal: [
          { id: 'L4-41-1', tanya: '練習{れんしゅう}は一回{いっかい}どのくらいですか。', tanyaId: 'Latihan sekali berapa lama?', opsi: ['一時間半{いちじかんはん}', '一時間{いちじかん}', '二時間{にじかん}'], benar: 0, pembahasan: '七時から八時半まで = dari pukul 7 sampai pukul 8.30 (jadi satu setengah jam).' },
          { id: 'L4-41-2', tanya: '練習{れんしゅう}はどこでしますか。', tanyaId: 'Latihannya di mana?', opsi: ['工場{こうじょう}のとなりの公園{こうえん}', 'となりの町{まち}の公園{こうえん}', '会社{かいしゃ}の前{まえ}の公園{こうえん}'], benar: 0, pembahasan: '工場のとなりの公園で練習をします = latihan dilakukan di taman sebelah pabrik.' },
        ],
      },
      {
        id: 'L4-42',
        judul: 'アグスさんの休{やす}みの日{ひ}',
        teks: 'アグスさんは休{やす}みの日{ひ}、朝{あさ}八時{はちじ}に起{お}きます。朝{あさ}ごはんを食{た}べてから、部屋{へや}をそうじします。それから、国{くに}の家族{かぞく}と一時間{いちじかん}ぐらい電話{でんわ}で話{はな}します。午後{ごご}は友{とも}だちとバドミントンをします。夜{よる}は寮{りょう}で日本語{にほんご}を勉強{べんきょう}します。',
        terjemahan: 'Pada hari libur, Agus bangun pukul 8 pagi. Setelah sarapan, ia membersihkan kamar. Setelah itu, ia berbicara lewat telepon dengan keluarga di negara asal kira-kira satu jam. Sore hari ia bermain bulu tangkis bersama teman. Malam hari ia belajar bahasa Jepang di asrama.',
        soal: [
          { id: 'L4-42-1', tanya: 'アグスさんは家族{かぞく}と電話{でんわ}で話{はな}すまえに、何{なに}をしますか。', tanyaId: 'Sebelum berbicara lewat telepon dengan keluarga, apa yang dilakukan Agus?', opsi: ['バドミントンをします', '部屋{へや}をそうじします', '日本語{にほんご}を勉強{べんきょう}します'], benar: 1, pembahasan: '部屋をそうじします。それから、国の家族と一時間ぐらい電話で話します = ia membersihkan kamar, setelah itu berbicara lewat telepon dengan keluarga (bulu tangkis dan belajar sesudahnya).' },
          { id: 'L4-42-2', tanya: 'アグスさんは午後{ごご}、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan Agus pada sore hari?', opsi: ['友{とも}だちとバドミントンをします', '家族{かぞく}と電話{でんわ}で話{はな}します', '寮{りょう}で日本語{にほんご}を勉強{べんきょう}します'], benar: 0, pembahasan: '午後は友だちとバドミントンをします = sore hari bermain bulu tangkis bersama teman.' },
        ],
      },
      {
        id: 'L4-43',
        judul: '寮{りょう}のそうじ',
        teks: '寮{りょう}では毎週{まいしゅう}日曜日{にちようび}の朝{あさ}九時{くじ}から、みんなでそうじをします。今週{こんしゅう}、アリさんとわたしは台所{だいどころ}です。ブディさんはおふろとトイレです。そうじは一時間{いちじかん}ぐらいで終{お}わります。そのあとで、みんなで買{か}い物{もの}に行{い}きます。',
        terjemahan: 'Di asrama, setiap Minggu pagi mulai pukul 9 semua orang bersih-bersih bersama. Minggu ini Ali dan saya membersihkan dapur. Budi membersihkan kamar mandi dan toilet. Bersih-bersih selesai dalam kira-kira satu jam. Setelah itu, kami semua pergi berbelanja.',
        soal: [
          { id: 'L4-43-1', tanya: '今週{こんしゅう}、ブディさんはどこをそうじしますか。', tanyaId: 'Minggu ini Budi membersihkan bagian mana?', opsi: ['台所{だいどころ}とおふろ', '台所{だいどころ}とトイレ', 'おふろとトイレ'], benar: 2, pembahasan: 'ブディさんはおふろとトイレです = Budi bagian kamar mandi dan toilet.' },
          { id: 'L4-43-2', tanya: 'そうじは何時{なんじ}ごろ終{お}わりますか。', tanyaId: 'Bersih-bersih selesai kira-kira pukul berapa?', opsi: ['九時{くじ}ごろ', '十時{じゅうじ}ごろ', '十一時{じゅういちじ}ごろ'], benar: 1, pembahasan: '朝九時から、みんなでそうじをします…そうじは一時間ぐらいで終わります = bersih-bersih mulai pukul 9 pagi dan selesai dalam kira-kira satu jam (jadi kira-kira pukul 10).' },
        ],
      },
      {
        id: 'L4-44',
        judul: '田中{たなか}さんと木村{きむら}さん',
        teks: '田中{たなか}さんと木村{きむら}さんはわたしの工場{こうじょう}の先輩{せんぱい}です。田中{たなか}さんは工場{こうじょう}で十年{じゅうねん}働{はたら}いています。木村{きむら}さんは田中{たなか}さんより三年{さんねん}長{なが}く働{はたら}いています。田中{たなか}さんは毎朝{まいあさ}七時半{しちじはん}に来{き}ますが、木村{きむら}さんはいつも田中{たなか}さんより三十分{さんじゅっぷん}早{はや}く来{き}ます。',
        terjemahan: 'Tanaka dan Kimura adalah senior di pabrik saya. Tanaka sudah bekerja di pabrik selama sepuluh tahun. Kimura bekerja tiga tahun lebih lama daripada Tanaka. Tanaka datang setiap pagi pukul 7.30, tetapi Kimura selalu datang 30 menit lebih awal daripada Tanaka.',
        soal: [
          { id: 'L4-44-1', tanya: '田中{たなか}さんは工場{こうじょう}で何年{なんねん}働{はたら}いていますか。', tanyaId: 'Tanaka sudah bekerja di pabrik berapa tahun?', opsi: ['十年{じゅうねん}', '三年{さんねん}', '十三年{じゅうさんねん}'], benar: 0, pembahasan: '田中さんは工場で十年働いています = Tanaka sudah bekerja di pabrik selama sepuluh tahun.' },
          { id: 'L4-44-2', tanya: '木村{きむら}さんは毎朝{まいあさ}何時{なんじ}に来{き}ますか。', tanyaId: 'Kimura datang pukul berapa setiap pagi?', opsi: ['七時半{しちじはん}', '八時{はちじ}', '七時{しちじ}'], benar: 2, pembahasan: '田中さんは毎朝七時半に来ますが、木村さんはいつも田中さんより三十分早く来ます = Tanaka datang pukul 7.30, tetapi Kimura selalu datang 30 menit lebih awal daripada Tanaka (jadi pukul 7).' },
        ],
      },
      {
        id: 'L4-45',
        judul: '日曜日{にちようび}の山{やま}のぼり',
        teks: '来週{らいしゅう}の日曜日{にちようび}、会社{かいしゃ}の人{ひと}とみどり山{やま}にのぼります。朝{あさ}七時{しちじ}に駅{えき}で会{あ}って、電車{でんしゃ}で山{やま}の下{した}まで行{い}きます。八時{はちじ}から歩{ある}いて、十一時{じゅういちじ}ごろ山{やま}の上{うえ}に着{つ}きます。上{うえ}で弁当{べんとう}を食{た}べて、一時{いちじ}に帰{かえ}ります。',
        terjemahan: 'Hari Minggu depan saya mendaki Gunung Midori bersama orang-orang perusahaan. Kami bertemu di stasiun pukul 7 pagi, lalu naik kereta sampai kaki gunung. Kami berjalan mulai pukul 8 dan tiba di puncak sekitar pukul 11. Di atas kami makan bento, lalu pulang pukul 1.',
        soal: [
          { id: 'L4-45-1', tanya: '何時{なんじ}にどこで会{あ}いますか。', tanyaId: 'Bertemu pukul berapa dan di mana?', opsi: ['七時{しちじ}に山{やま}の下{した}で', '七時{しちじ}に駅{えき}で', '八時{はちじ}に駅{えき}で'], benar: 1, pembahasan: '朝七時に駅で会って = bertemu di stasiun pukul 7 pagi.' },
          { id: 'L4-45-2', tanya: '山{やま}の上{うえ}まで何時間{なんじかん}ぐらい歩{ある}きますか。', tanyaId: 'Berjalan kira-kira berapa jam sampai puncak gunung?', opsi: ['二時間{にじかん}', '三時間{さんじかん}', '四時間{よじかん}'], benar: 1, pembahasan: '八時から歩いて、十一時ごろ山の上に着きます = berjalan mulai pukul 8 dan tiba di puncak sekitar pukul 11 (jadi kira-kira tiga jam).' },
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
      {
        id: 'L5-21',
        judul: '同{おな}じ部屋{へや}のアグスさん',
        teks: 'わたしは会社{かいしゃ}の寮{りょう}に住{す}んでいます。部屋{へや}はアグスさんと二人{ふたり}で使{つか}っています。アグスさんは料理{りょうり}が上手{じょうず}ですから、晩{ばん}ごはんはいつもアグスさんが作{つく}ります。わたしは料理{りょうり}が下手{へた}ですから、食{た}べたあとで皿{さら}を洗{あら}います。そうじは土曜日{どようび}に二人{ふたり}でします。来月{らいげつ}、アグスさんに料理{りょうり}を習{なら}いたいです。',
        terjemahan: 'Saya tinggal di asrama perusahaan. Kamar saya pakai berdua dengan Agus. Agus pandai memasak, jadi makan malam selalu dibuat oleh Agus. Saya tidak pandai memasak, jadi setelah makan saya mencuci piring. Bersih-bersih kami lakukan berdua pada hari Sabtu. Bulan depan saya ingin belajar memasak dari Agus.',
        soal: [
          { id: 'L5-21-1', tanya: '晩{ばん}ごはんのあとで、「わたし」は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan "saya" setelah makan malam?', opsi: ['料理{りょうり}を習{なら}います', '皿{さら}を洗{あら}います', '部屋{へや}をそうじします'], benar: 1, pembahasan: '食べたあとで皿を洗います = setelah makan, saya mencuci piring.' },
          { id: 'L5-21-2', tanya: 'どうして「わたし」はアグスさんに料理{りょうり}を習{なら}いたいですか。', tanyaId: 'Mengapa "saya" ingin belajar memasak dari Agus?', opsi: ['アグスさんが国{くに}へ帰{かえ}るからです', '料理{りょうり}の仕事{しごと}がしたいからです', '今{いま}は料理{りょうり}が下手{へた}だからです'], benar: 2, pembahasan: 'わたしは料理が下手ですから…アグスさんに料理を習いたいです = saya tidak pandai memasak … ingin belajar memasak dari Agus (ingin belajar karena sekarang belum pandai).' },
        ],
      },
      {
        id: 'L5-22',
        judul: '家族{かぞく}にお金{かね}を送{おく}る日{ひ}',
        teks: '毎月{まいつき}二十五日{にじゅうごにち}は給料{きゅうりょう}の日{ひ}です。プトリさんは次{つぎ}の日{ひ}の昼休{ひるやす}みに銀行{ぎんこう}へ行{い}って、国{くに}の家族{かぞく}にお金{かね}を送{おく}ります。先月{せんげつ}までは五万円{ごまんえん}送{おく}りました。でも、妹{いもうと}が大学{だいがく}に入{はい}りましたから、今月{こんげつ}から七万円{ななまんえん}送{おく}ります。昼{ひる}ごはんは、今月{こんげつ}からお弁当{べんとう}を作{つく}って持{も}っていきます。',
        terjemahan: 'Setiap bulan tanggal 25 adalah hari gajian. Putri pergi ke bank pada istirahat siang hari berikutnya dan mengirim uang kepada keluarganya di negara asal. Sampai bulan lalu ia mengirim 50.000 yen. Tetapi adik perempuannya masuk universitas, jadi mulai bulan ini ia mengirim 70.000 yen. Untuk makan siang, mulai bulan ini ia membuat bekal dan membawanya.',
        soal: [
          { id: 'L5-22-1', tanya: 'プトリさんは今月{こんげつ}から、いくら送{おく}りますか。', tanyaId: 'Mulai bulan ini Putri mengirim berapa?', opsi: ['七万円{ななまんえん}', '五万円{ごまんえん}', '二万円{にまんえん}'], benar: 0, pembahasan: '今月から七万円送ります = mulai bulan ini mengirim 70.000 yen.' },
          { id: 'L5-22-2', tanya: 'プトリさんは毎月{まいつき}何日{なんにち}に銀行{ぎんこう}へ行{い}きますか。', tanyaId: 'Setiap bulan Putri pergi ke bank tanggal berapa?', opsi: ['二十五日{にじゅうごにち}', '二十六日{にじゅうろくにち}', '二十七日{にじゅうしちにち}'], benar: 1, pembahasan: '毎月二十五日は給料の日です…次の日の昼休みに銀行へ行って = tanggal 25 hari gajian … pergi ke bank pada istirahat siang hari berikutnya (sehari setelah tanggal 25, yaitu tanggal 26).' },
        ],
      },
      {
        id: 'L5-23',
        judul: 'バスにおくれた朝{あさ}',
        teks: '今朝{けさ}、リオさんは七時半{しちじはん}に起{お}きました。いつもは六時半{ろくじはん}に起{お}きます。きのうの夜{よる}はおそくまで映画{えいが}を見{み}ていました。会社{かいしゃ}のバスは七時{しちじ}四十分{よんじゅっぷん}に寮{りょう}の前{まえ}から出{で}ます。リオさんは朝{あさ}ごはんを食{た}べませんでした。寮{りょう}の前{まえ}まで走{はし}りましたが、バスはもう出{で}ていました。ですから、自転車{じてんしゃ}で会社{かいしゃ}へ行{い}きました。八時{はちじ}十分{じゅっぷん}に会社{かいしゃ}に着{つ}きましたが、仕事{しごと}は八時{はちじ}からでした。',
        terjemahan: 'Tadi pagi Rio bangun pukul 7.30. Biasanya ia bangun pukul 6.30. Tadi malam ia menonton film sampai larut. Bus perusahaan berangkat pukul 7.40 dari depan asrama. Rio tidak sarapan. Ia berlari sampai depan asrama, tetapi bus sudah berangkat. Karena itu ia pergi ke perusahaan naik sepeda. Ia tiba di perusahaan pukul 8.10, padahal pekerjaan mulai pukul 8.',
        soal: [
          { id: 'L5-23-1', tanya: 'リオさんは今朝{けさ}、何{なん}で会社{かいしゃ}へ行{い}きましたか。', tanyaId: 'Tadi pagi Rio pergi ke perusahaan naik apa?', opsi: ['会社{かいしゃ}のバス', '電車{でんしゃ}', '自転車{じてんしゃ}'], benar: 2, pembahasan: 'バスはもう出ていました。ですから、自転車で会社へ行きました = bus sudah berangkat, karena itu ia pergi ke perusahaan naik sepeda.' },
          { id: 'L5-23-2', tanya: 'リオさんは今朝{けさ}、仕事{しごと}に何分{なんぷん}おくれましたか。', tanyaId: 'Tadi pagi Rio terlambat kerja berapa menit?', opsi: ['十分{じゅっぷん}', '三十分{さんじゅっぷん}', '四十分{よんじゅっぷん}'], benar: 0, pembahasan: '八時十分に会社に着きましたが、仕事は八時からでした = tiba di perusahaan pukul 8.10, padahal pekerjaan mulai pukul 8 (jadi terlambat 10 menit).' },
        ],
      },
      {
        id: 'L5-24',
        judul: '町{まち}の夏{なつ}まつり',
        teks: 'みなさんへ。八月{はちがつ}十日{とおか}に、町{まち}の公園{こうえん}で夏{なつ}まつりがあります。時間{じかん}は午後{ごご}五時{ごじ}から九時{くじ}までです。食{た}べ物{もの}の店{みせ}がたくさん出{で}て、八時{はちじ}からは花火{はなび}があります。公園{こうえん}には車{くるま}を置{お}くところがありませんから、バスか自転車{じてんしゃ}で来{き}てください。十日{とおか}が雨{あめ}の時{とき}は、次{つぎ}の日{ひ}にします。',
        terjemahan: 'Kepada semuanya. Pada tanggal 10 Agustus ada festival musim panas di taman kota. Waktunya dari pukul 5 sore sampai pukul 9 malam. Akan ada banyak kedai makanan, dan mulai pukul 8 ada kembang api. Di taman tidak ada tempat untuk menaruh mobil, jadi datanglah naik bus atau sepeda. Kalau tanggal 10 hujan, festival diadakan pada hari berikutnya.',
        soal: [
          { id: 'L5-24-1', tanya: '花火{はなび}は何時{なんじ}からですか。', tanyaId: 'Kembang api mulai pukul berapa?', opsi: ['五時{ごじ}', '八時{はちじ}', '九時{くじ}'], benar: 1, pembahasan: '八時からは花火があります = mulai pukul 8 ada kembang api.' },
          { id: 'L5-24-2', tanya: '十日{とおか}が雨{あめ}の時{とき}、夏{なつ}まつりはいつしますか。', tanyaId: 'Kalau tanggal 10 hujan, festival musim panas diadakan kapan?', opsi: ['八月{はちがつ}九日{ここのか}', '八月{はちがつ}十一日{じゅういちにち}', '八月{はちがつ}十七日{じゅうしちにち}'], benar: 1, pembahasan: '十日が雨の時は、次の日にします = kalau tanggal 10 hujan, diadakan pada hari berikutnya (sehari setelah 10 Agustus, yaitu 11 Agustus).' },
        ],
      },
      {
        id: 'L5-25',
        judul: 'かぜの薬{くすり}',
        teks: 'きのうの夜{よる}から熱{ねつ}がありましたから、今朝{けさ}、会社{かいしゃ}を休{やす}んで病院{びょういん}へ行{い}きました。お医者{いしゃ}さんは「かぜですね。薬{くすり}を出{だ}します」と言{い}いました。白{しろ}い薬{くすり}は一日{いちにち}三回{さんかい}、ごはんのあとで飲{の}みます。赤{あか}い薬{くすり}は夜{よる}寝{ね}る前{まえ}に一回{いっかい}だけ飲{の}みます。あしたも会社{かいしゃ}を休{やす}んで、うちで寝{ね}ます。',
        terjemahan: 'Sejak tadi malam saya demam, jadi tadi pagi saya tidak masuk kerja dan pergi ke rumah sakit. Dokter berkata, "Ini masuk angin, ya. Saya beri obat." Obat putih diminum tiga kali sehari, setelah makan. Obat merah diminum satu kali saja, malam sebelum tidur. Besok saya juga tidak masuk kerja dan tidur di rumah.',
        soal: [
          { id: 'L5-25-1', tanya: '赤{あか}い薬{くすり}はいつ飲{の}みますか。', tanyaId: 'Obat merah diminum kapan?', opsi: ['夜{よる}寝{ね}る前{まえ}', 'ごはんのあと', '朝{あさ}起{お}きた時{とき}'], benar: 0, pembahasan: '赤い薬は夜寝る前に一回だけ飲みます = obat merah diminum satu kali saja, malam sebelum tidur.' },
          { id: 'L5-25-2', tanya: 'この人{ひと}は一日{いちにち}に全部{ぜんぶ}で何回{なんかい}薬{くすり}を飲{の}みますか。', tanyaId: 'Orang ini minum obat berapa kali seluruhnya dalam sehari?', opsi: ['一回{いっかい}', '三回{さんかい}', '四回{よんかい}'], benar: 2, pembahasan: '白い薬は一日三回…赤い薬は夜寝る前に一回だけ飲みます = obat putih tiga kali sehari … obat merah satu kali sebelum tidur (3 + 1 = 4 kali).' },
        ],
      },
      {
        id: 'L5-26',
        judul: 'となりの鈴木{すずき}さん',
        teks: 'わたしの町{まち}では、燃{も}えるごみは月曜日{げつようび}と木曜日{もくようび}、びんとかんは水曜日{すいようび}に出{だ}します。今日{きょう}は水曜日{すいようび}ですが、今朝{けさ}、わたしは燃{も}えるごみを出{だ}しました。となりの鈴木{すずき}さんが「今日{きょう}はびんとかんの日{ひ}ですよ」と言{い}いました。わたしはごみを部屋{へや}に持{も}って帰{かえ}りました。あしたの朝{あさ}、もう一度{いちど}出{だ}します。鈴木{すずき}さんにごみの日{ひ}の紙{かみ}をもらいました。',
        terjemahan: 'Di kota saya, sampah yang bisa dibakar dibuang pada hari Senin dan Kamis, sedangkan botol dan kaleng pada hari Rabu. Hari ini hari Rabu, tetapi tadi pagi saya membuang sampah yang bisa dibakar. Suzuki, tetangga saya, berkata, "Hari ini hari botol dan kaleng, lho." Saya membawa pulang sampah itu ke kamar. Besok pagi saya akan membuangnya sekali lagi. Saya menerima kertas jadwal hari sampah dari Suzuki.',
        soal: [
          { id: 'L5-26-1', tanya: 'びんとかんは何曜日{なんようび}に出{だ}しますか。', tanyaId: 'Botol dan kaleng dibuang pada hari apa?', opsi: ['月曜日{げつようび}', '木曜日{もくようび}', '水曜日{すいようび}'], benar: 2, pembahasan: 'びんとかんは水曜日に出します = botol dan kaleng dibuang pada hari Rabu.' },
          { id: 'L5-26-2', tanya: 'どうしてあしたの朝{あさ}、もう一度{いちど}ごみを出{だ}しますか。', tanyaId: 'Mengapa besok pagi penulis membuang sampah itu sekali lagi?', opsi: ['あしたはびんとかんの日{ひ}だからです', 'あしたは燃{も}えるごみの日{ひ}だからです', 'あしたは仕事{しごと}が休{やす}みだからです'], benar: 1, pembahasan: '燃えるごみは月曜日と木曜日…今日は水曜日ですが…あしたの朝、もう一度出します = sampah yang bisa dibakar hari Senin dan Kamis … hari ini Rabu … besok pagi dibuang sekali lagi (besok hari Kamis, yaitu hari sampah yang bisa dibakar).' },
        ],
      },
      {
        id: 'L5-27',
        judul: '弟{おとうと}へ送{おく}る荷物{にもつ}',
        teks: '来月{らいげつ}は弟{おとうと}の誕生日{たんじょうび}です。デウィさんは日本{にほん}のおかしと時計{とけい}を買{か}って、箱{はこ}に入{い}れました。きのう、郵便局{ゆうびんきょく}へ持{も}っていきました。飛行機{ひこうき}の荷物{にもつ}は一週間{いっしゅうかん}ぐらいで着{つ}きますが、四千円{よんせんえん}です。船{ふね}の荷物{にもつ}は二{に}か月{げつ}ぐらいかかりますが、千八百円{せんはっぴゃくえん}です。デウィさんは高{たか}いほうで送{おく}りました。',
        terjemahan: 'Bulan depan adalah ulang tahun adik laki-laki Dewi. Dewi membeli kue Jepang dan jam, lalu memasukkannya ke dalam kotak. Kemarin ia membawanya ke kantor pos. Paket lewat pesawat tiba dalam waktu sekitar satu minggu, tetapi biayanya 4.000 yen. Paket lewat kapal memakan waktu sekitar dua bulan, tetapi biayanya 1.800 yen. Dewi mengirim dengan cara yang lebih mahal.',
        soal: [
          { id: 'L5-27-1', tanya: 'デウィさんは箱{はこ}に何{なに}を入{い}れましたか。', tanyaId: 'Apa yang dimasukkan Dewi ke dalam kotak?', opsi: ['服{ふく}と時計{とけい}', 'おかしと時計{とけい}', 'おかしと手紙{てがみ}'], benar: 1, pembahasan: '日本のおかしと時計を買って、箱に入れました = membeli kue Jepang dan jam, lalu memasukkannya ke dalam kotak.' },
          { id: 'L5-27-2', tanya: '荷物{にもつ}を送{おく}るお金{かね}はいくらでしたか。', tanyaId: 'Berapa biaya mengirim paket itu?', opsi: ['四千円{よんせんえん}', '千八百円{せんはっぴゃくえん}', '五千八百円{ごせんはっぴゃくえん}'], benar: 0, pembahasan: '飛行機の荷物は一週間ぐらいで着きますが、四千円です…デウィさんは高いほうで送りました = paket lewat pesawat 4.000 yen … Dewi mengirim dengan cara yang lebih mahal (yang lebih mahal adalah pesawat, 4.000 yen).' },
        ],
      },
      {
        id: 'L5-28',
        judul: '寮{りょう}のナシゴレンパーティー',
        teks: '先週{せんしゅう}の日曜日{にちようび}、寮{りょう}でパーティーをしました。わたしたちインドネシア人{じん}三人{さんにん}がナシゴレンを作{つく}って、日本人{にほんじん}の先輩{せんぱい}を四人{よにん}呼{よ}びました。少{すこ}し辛{から}かったですが、先輩{せんぱい}たちは「おいしいです」と言{い}って、全部{ぜんぶ}食{た}べました。山田{やまだ}さんは作{つく}り方{かた}を聞{き}いて、紙{かみ}に書{か}きました。次{つぎ}は先輩{せんぱい}たちが日本{にほん}の料理{りょうり}を作{つく}ります。',
        terjemahan: 'Hari Minggu lalu kami mengadakan pesta di asrama. Kami, tiga orang Indonesia, membuat nasi goreng dan mengundang empat orang senior Jepang. Rasanya agak pedas, tetapi para senior berkata "Enak" dan menghabiskan semuanya. Pak Yamada menanyakan cara membuatnya dan menulisnya di kertas. Berikutnya para senior yang akan membuat masakan Jepang.',
        soal: [
          { id: 'L5-28-1', tanya: '山田{やまだ}さんはナシゴレンの作{つく}り方{かた}を聞{き}いて、どうしましたか。', tanyaId: 'Setelah menanyakan cara membuat nasi goreng, apa yang dilakukan Pak Yamada?', opsi: ['すぐ作{つく}りました', '写真{しゃしん}をとりました', '紙{かみ}に書{か}きました'], benar: 2, pembahasan: '山田さんは作り方を聞いて、紙に書きました = Pak Yamada menanyakan cara membuatnya dan menulisnya di kertas.' },
          { id: 'L5-28-2', tanya: 'パーティーには全部{ぜんぶ}で何人{なんにん}いましたか。', tanyaId: 'Seluruhnya ada berapa orang di pesta itu?', opsi: ['三人{さんにん}', '四人{よにん}', '七人{しちにん}'], benar: 2, pembahasan: 'わたしたちインドネシア人三人が…日本人の先輩を四人呼びました = kami tiga orang Indonesia … mengundang empat orang senior Jepang (3 + 4 = 7 orang).' },
        ],
      },
      {
        id: 'L5-29',
        judul: 'マヤさんへの手紙{てがみ}',
        teks: 'マヤさん、お元気{げんき}ですか。わたしは先月{せんげつ}から海{うみ}の近{ちか}くの小{ちい}さい町{まち}に住{す}んでいます。魚{さかな}の工場{こうじょう}で働{はたら}いています。仕事{しごと}は朝{あさ}五時{ごじ}からですから、毎晩{まいばん}九時{くじ}に寝{ね}ます。町{まち}には映画館{えいがかん}もデパートもありませんが、魚{さかな}がおいしくて、人{ひと}もやさしいです。休{やす}みの日{ひ}は、会社{かいしゃ}の人{ひと}と海{うみ}の近{ちか}くを散歩{さんぽ}します。マヤさんも一度{いちど}遊{あそ}びに来{き}てください。',
        terjemahan: 'Maya, apa kabar? Sejak bulan lalu saya tinggal di sebuah kota kecil di dekat laut. Saya bekerja di pabrik ikan. Pekerjaan mulai pukul 5 pagi, jadi setiap malam saya tidur pukul 9. Di kota ini tidak ada bioskop maupun toserba, tetapi ikannya enak dan orang-orangnya juga baik hati. Pada hari libur saya berjalan-jalan di dekat laut bersama orang-orang perusahaan. Maya juga datanglah bermain sekali waktu.',
        soal: [
          { id: 'L5-29-1', tanya: 'この人{ひと}はどこで働{はたら}いていますか。', tanyaId: 'Orang ini bekerja di mana?', opsi: ['魚{さかな}の工場{こうじょう}', '映画館{えいがかん}', 'デパート'], benar: 0, pembahasan: '魚の工場で働いています = bekerja di pabrik ikan.' },
          { id: 'L5-29-2', tanya: 'この人{ひと}は今{いま}住{す}んでいる町{まち}をどう思{おも}っていますか。', tanyaId: 'Bagaimana pendapat orang ini tentang kota tempat tinggalnya sekarang?', opsi: ['遊{あそ}ぶところがなくて、つまらない町{まち}です', '映画館{えいがかん}やデパートはありませんが、いい町{まち}です', 'デパートがあって、にぎやかな町{まち}です'], benar: 1, pembahasan: '町には映画館もデパートもありませんが、魚がおいしくて、人もやさしいです = di kota ini tidak ada bioskop maupun toserba, tetapi ikannya enak dan orangnya baik hati (bioskop dan toserba tidak ada, tetapi ia menyukai kotanya).' },
        ],
      },
      {
        id: 'L5-30',
        judul: 'ハディさんの自転車{じてんしゃ}',
        teks: '寮{りょう}から工場{こうじょう}まで歩{ある}いて三十分{さんじゅっぷん}かかります。ですから、ハディさんは自転車{じてんしゃ}を買{か}いに行{い}きました。新{あたら}しい自転車{じてんしゃ}は二万円{にまんえん}でしたが、古{ふる}い自転車{じてんしゃ}は六千円{ろくせんえん}でした。ハディさんは古{ふる}いのを買{か}いました。色{いろ}は青{あお}で、少{すこ}し重{おも}いですが、よく走{はし}ります。今{いま}は工場{こうじょう}まで十分{じゅっぷん}です。朝{あさ}、前{まえ}よりゆっくりごはんを食{た}べます。',
        terjemahan: 'Dari asrama ke pabrik perlu 30 menit berjalan kaki. Karena itu Hadi pergi membeli sepeda. Sepeda baru harganya 20.000 yen, sedangkan sepeda bekas 6.000 yen. Hadi membeli yang bekas. Warnanya biru dan agak berat, tetapi jalannya lancar. Sekarang ke pabrik hanya 10 menit. Pagi hari ia sarapan lebih santai daripada dulu.',
        soal: [
          { id: 'L5-30-1', tanya: 'ハディさんが買{か}った自転車{じてんしゃ}はいくらでしたか。', tanyaId: 'Berapa harga sepeda yang dibeli Hadi?', opsi: ['二万円{にまんえん}', '六千円{ろくせんえん}', '一万四千円{いちまんよんせんえん}'], benar: 1, pembahasan: '古い自転車は六千円でした。ハディさんは古いのを買いました = sepeda bekas 6.000 yen. Hadi membeli yang bekas.' },
          { id: 'L5-30-2', tanya: '今{いま}、工場{こうじょう}までの時間{じかん}は前{まえ}より何分{なんぷん}短{みじか}いですか。', tanyaId: 'Sekarang waktu ke pabrik lebih singkat berapa menit daripada dulu?', opsi: ['十分{じゅっぷん}', '三十分{さんじゅっぷん}', '二十分{にじゅっぷん}'], benar: 2, pembahasan: '寮から工場まで歩いて三十分かかります…今は工場まで十分です = dari asrama ke pabrik 30 menit berjalan kaki … sekarang 10 menit (30 − 10 = 20 menit lebih singkat).' },
        ],
      },
      {
        id: 'L5-31',
        judul: '公園{こうえん}で会{あ}うおばあさん',
        teks: 'わたしは毎朝{まいあさ}、仕事{しごと}の前{まえ}に公園{こうえん}を走{はし}ります。公園{こうえん}でいつも同{おな}じおばあさんに会{あ}います。おばあさんは小{ちい}さい白{しろ}い犬{いぬ}と散歩{さんぽ}しています。はじめはあいさつだけでしたが、今{いま}は天気{てんき}や国{くに}の話{はなし}をします。おばあさんはゆっくり話{はな}しますから、よくわかります。きのうは、おばあさんのうちのみかんをもらいました。',
        terjemahan: 'Setiap pagi sebelum bekerja saya berlari di taman. Di taman saya selalu bertemu dengan nenek yang sama. Nenek itu berjalan-jalan dengan anjing putih kecil. Awalnya kami hanya saling menyapa, tetapi sekarang kami mengobrol tentang cuaca dan negara saya. Nenek itu berbicara pelan-pelan, jadi saya mengerti dengan baik. Kemarin saya menerima jeruk dari rumah nenek itu.',
        soal: [
          { id: 'L5-31-1', tanya: 'きのう、「わたし」はおばあさんに何{なに}をもらいましたか。', tanyaId: 'Kemarin "saya" menerima apa dari nenek itu?', opsi: ['白{しろ}い犬{いぬ}', 'お茶{ちゃ}', 'みかん'], benar: 2, pembahasan: 'きのうは、おばあさんのうちのみかんをもらいました = kemarin menerima jeruk dari rumah nenek itu.' },
          { id: 'L5-31-2', tanya: '「わたし」はいつおばあさんに会{あ}いますか。', tanyaId: 'Kapan "saya" bertemu dengan nenek itu?', opsi: ['朝{あさ}、仕事{しごと}の前{まえ}です', '昼休{ひるやす}みの時間{じかん}です', '夜{よる}、仕事{しごと}のあとです'], benar: 0, pembahasan: 'わたしは毎朝、仕事の前に公園を走ります。公園でいつも同じおばあさんに会います = setiap pagi sebelum bekerja saya berlari di taman; di taman saya selalu bertemu nenek yang sama (jadi bertemunya pagi, sebelum bekerja).' },
        ],
      },
      {
        id: 'L5-32',
        judul: '六月{ろくがつ}の雨{あめ}',
        teks: '日本{にほん}では六月{ろくがつ}に雨{あめ}がたくさん降{ふ}ります。今週{こんしゅう}は月曜日{げつようび}から金曜日{きんようび}まで仕事{しごと}でしたが、毎日{まいにち}雨{あめ}でした。わたしはいつも自転車{じてんしゃ}で会社{かいしゃ}へ行{い}きますが、雨{あめ}の日{ひ}はバスに乗{の}ります。バスは人{ひと}が多{おお}くて、大変{たいへん}でした。土曜日{どようび}の朝{あさ}は晴{は}れました。わたしは服{ふく}をたくさん洗{あら}って、外{そと}に出{だ}しました。',
        terjemahan: 'Di Jepang pada bulan Juni hujan turun banyak. Minggu ini saya bekerja dari Senin sampai Jumat, tetapi setiap hari hujan. Saya biasanya pergi ke perusahaan naik sepeda, tetapi pada hari hujan saya naik bus. Bus penuh orang dan melelahkan. Sabtu pagi cuaca cerah. Saya mencuci banyak pakaian dan menjemurnya di luar.',
        soal: [
          { id: 'L5-32-1', tanya: '雨{あめ}の日{ひ}、「わたし」は何{なん}で会社{かいしゃ}へ行{い}きますか。', tanyaId: 'Pada hari hujan, "saya" pergi ke perusahaan naik apa?', opsi: ['バス', '自転車{じてんしゃ}', '電車{でんしゃ}'], benar: 0, pembahasan: '雨の日はバスに乗ります = pada hari hujan naik bus.' },
          { id: 'L5-32-2', tanya: '今週{こんしゅう}、「わたし」は何日{なんにち}バスに乗{の}って会社{かいしゃ}へ行{い}きましたか。', tanyaId: 'Minggu ini "saya" pergi ke perusahaan naik bus berapa hari?', opsi: ['五日{いつか}', '二日{ふつか}', '六日{むいか}'], benar: 0, pembahasan: '今週は月曜日から金曜日まで仕事でしたが、毎日雨でした…雨の日はバスに乗ります = minggu ini bekerja dari Senin sampai Jumat dan setiap hari hujan … pada hari hujan naik bus (Senin sampai Jumat = 5 hari).' },
        ],
      },
      {
        id: 'L5-33',
        judul: '日本語{にほんご}教室{きょうしつ}のフォンさん',
        teks: 'わたしは毎週{まいしゅう}日曜日{にちようび}、市{し}の日本語{にほんご}教室{きょうしつ}へ行{い}きます。先月{せんげつ}、教室{きょうしつ}でベトナム人{じん}のフォンさんと友{とも}だちになりました。フォンさんはわたしの国{くに}の言葉{ことば}がわかりません。わたしもベトナムの言葉{ことば}がわかりません。ですから、二人{ふたり}はいつも日本語{にほんご}で話{はな}します。きのうは電話{でんわ}で一時間{いちじかん}も話{はな}しました。今{いま}、日本語{にほんご}の勉強{べんきょう}は前{まえ}より楽{たの}しいです。',
        terjemahan: 'Setiap hari Minggu saya pergi ke kelas bahasa Jepang milik kota. Bulan lalu di kelas saya berteman dengan Phuong, orang Vietnam. Phuong tidak mengerti bahasa negara saya. Saya juga tidak mengerti bahasa Vietnam. Karena itu kami berdua selalu berbicara dalam bahasa Jepang. Kemarin kami mengobrol lewat telepon sampai satu jam. Sekarang belajar bahasa Jepang lebih menyenangkan daripada dulu.',
        soal: [
          { id: 'L5-33-1', tanya: '「わたし」は何曜日{なんようび}に日本語{にほんご}教室{きょうしつ}へ行{い}きますか。', tanyaId: '"Saya" pergi ke kelas bahasa Jepang pada hari apa?', opsi: ['土曜日{どようび}', '日曜日{にちようび}', '月曜日{げつようび}'], benar: 1, pembahasan: 'わたしは毎週日曜日、市の日本語教室へ行きます = setiap hari Minggu saya pergi ke kelas bahasa Jepang milik kota.' },
          { id: 'L5-33-2', tanya: 'どうして二人{ふたり}は日本語{にほんご}で話{はな}しますか。', tanyaId: 'Mengapa mereka berdua berbicara dalam bahasa Jepang?', opsi: ['日本語{にほんご}のテストがあるからです', 'フォンさんが日本語{にほんご}の先生{せんせい}だからです', '二人{ふたり}の国{くに}の言葉{ことば}がちがうからです'], benar: 2, pembahasan: 'フォンさんはわたしの国の言葉がわかりません。わたしもベトナムの言葉がわかりません。ですから、二人はいつも日本語で話します = Phuong tidak mengerti bahasa negara saya, saya juga tidak mengerti bahasa Vietnam, karena itu selalu berbicara dalam bahasa Jepang (bahasa negara mereka berbeda).' },
        ],
      },
      {
        id: 'L5-34',
        judul: 'イマムさんの昼{ひる}ごはん',
        teks: '工場{こうじょう}の食堂{しょくどう}の昼{ひる}ごはんは、月曜日{げつようび}から木曜日{もくようび}まで二{ふた}つあります。肉{にく}の料理{りょうり}と魚{さかな}の料理{りょうり}で、どちらも四百円{よんひゃくえん}です。イマムさんは毎日{まいにち}ここで食{た}べますが、豚肉{ぶたにく}は食{た}べません。ですから、いつも食堂{しょくどう}の人{ひと}に「今日{きょう}の肉{にく}は何{なん}ですか」と聞{き}きます。今日{きょう}は水曜日{すいようび}で、肉{にく}は豚肉{ぶたにく}でした。金曜日{きんようび}はみんなカレーを食{た}べます。カレーは三百円{さんびゃくえん}で、とり肉{にく}です。',
        terjemahan: 'Makan siang di kantin pabrik ada dua macam dari Senin sampai Kamis. Masakan daging dan masakan ikan, keduanya 400 yen. Imam makan di sini setiap hari, tetapi ia tidak makan daging babi. Karena itu ia selalu bertanya kepada petugas kantin, "Daging hari ini daging apa?" Hari ini hari Rabu, dan dagingnya daging babi. Hari Jumat semua orang makan kari. Karinya 300 yen dan memakai daging ayam.',
        soal: [
          { id: 'L5-34-1', tanya: '食堂{しょくどう}のカレーはいくらですか。', tanyaId: 'Berapa harga kari di kantin?', opsi: ['四百円{よんひゃくえん}', '七百円{ななひゃくえん}', '三百円{さんびゃくえん}'], benar: 2, pembahasan: 'カレーは三百円で、とり肉です = karinya 300 yen dan memakai daging ayam.' },
          { id: 'L5-34-2', tanya: '今日{きょう}、イマムさんは食堂{しょくどう}でどれを食{た}べましたか。', tanyaId: 'Hari ini Imam makan yang mana di kantin?', opsi: ['肉{にく}の料理{りょうり}', '魚{さかな}の料理{りょうり}', 'カレー'], benar: 1, pembahasan: 'イマムさんは毎日ここで食べますが、豚肉は食べません…今日は水曜日で、肉は豚肉でした = Imam makan di sini setiap hari, tetapi tidak makan daging babi … hari ini Rabu dan dagingnya daging babi (jadi ia memilih masakan ikan; kari hanya hari Jumat).' },
        ],
      },
      {
        id: 'L5-35',
        judul: '銀行{ぎんこう}のカード',
        teks: '先週{せんしゅう}、会社{かいしゃ}の田中{たなか}さんと銀行{ぎんこう}へ行{い}って、カードを作{つく}りました。紙{かみ}に名前{なまえ}や電話番号{でんわばんごう}を書{か}きました。漢字{かんじ}がむずかしかったですから、田中{たなか}さんに聞{き}きました。銀行{ぎんこう}の人{ひと}は「カードは来週{らいしゅう}、寮{りょう}に送{おく}ります」と言{い}いました。今日{きょう}、そのカードが来{き}ました。あした、このカードではじめてお金{かね}を出{だ}します。',
        terjemahan: 'Minggu lalu saya pergi ke bank bersama Pak Tanaka dari perusahaan dan membuat kartu. Saya menulis nama, nomor telepon, dan lain-lain di kertas. Kanjinya sulit, jadi saya bertanya kepada Pak Tanaka. Petugas bank berkata, "Kartunya kami kirim ke asrama minggu depan." Hari ini kartu itu datang. Besok untuk pertama kalinya saya akan mengambil uang dengan kartu ini.',
        soal: [
          { id: 'L5-35-1', tanya: '紙{かみ}に書{か}く時{とき}、「わたし」はだれに聞{き}きましたか。', tanyaId: 'Saat menulis di kertas, "saya" bertanya kepada siapa?', opsi: ['田中{たなか}さん', '銀行{ぎんこう}の人{ひと}', '寮{りょう}の人{ひと}'], benar: 0, pembahasan: '漢字がむずかしかったですから、田中さんに聞きました = kanjinya sulit, jadi bertanya kepada Pak Tanaka.' },
          { id: 'L5-35-2', tanya: 'カードはどこに来{き}ましたか。', tanyaId: 'Kartu itu datang ke mana?', opsi: ['会社{かいしゃ}', '銀行{ぎんこう}', '寮{りょう}'], benar: 2, pembahasan: 'カードは来週、寮に送ります…今日、そのカードが来ました = "kartunya kami kirim ke asrama minggu depan" … hari ini kartu itu datang (jadi datangnya ke asrama).' },
        ],
      },
      {
        id: 'L5-36',
        judul: '夏{なつ}の海{うみ}',
        teks: '八月{はちがつ}の休{やす}みに、友{とも}だち三人{さんにん}と電車{でんしゃ}で海{うみ}へ行{い}きました。朝{あさ}六時{ろくじ}に寮{りょう}を出{で}て、九時{くじ}に海{うみ}に着{つ}きました。海{うみ}はとても青{あお}くて、きれいでした。午前中{ごぜんちゅう}は泳{およ}いで、昼{ひる}は海{うみ}の近{ちか}くの店{みせ}で魚{さかな}を食{た}べました。午後{ごご}は疲{つか}れましたから、木{き}の下{した}で寝{ね}ました。帰{かえ}りの電車{でんしゃ}でもみんな寝{ね}ていました。',
        terjemahan: 'Pada libur bulan Agustus saya pergi ke laut naik kereta bersama tiga orang teman. Kami berangkat dari asrama pukul 6 pagi dan tiba di laut pukul 9. Lautnya sangat biru dan indah. Sebelum tengah hari kami berenang, lalu siang hari makan ikan di kedai dekat laut. Sore hari kami lelah, jadi tidur di bawah pohon. Di kereta pulang pun semuanya tidur.',
        soal: [
          { id: 'L5-36-1', tanya: '昼{ひる}、海{うみ}の近{ちか}くの店{みせ}で何{なに}を食{た}べましたか。', tanyaId: 'Siang hari, makan apa di kedai dekat laut?', opsi: ['お弁当{べんとう}', '魚{さかな}', 'カレー'], benar: 1, pembahasan: '昼は海の近くの店で魚を食べました = siang hari makan ikan di kedai dekat laut.' },
          { id: 'L5-36-2', tanya: '寮{りょう}から海{うみ}までどのぐらいかかりましたか。', tanyaId: 'Dari asrama sampai ke laut memakan waktu berapa lama?', opsi: ['三時間{さんじかん}', '六時間{ろくじかん}', '九時間{くじかん}'], benar: 0, pembahasan: '朝六時に寮を出て、九時に海に着きました = berangkat dari asrama pukul 6 pagi dan tiba di laut pukul 9 (dari pukul 6 sampai pukul 9 = 3 jam).' },
        ],
      },
      {
        id: 'L5-37',
        judul: '森{もり}さんへのプレゼント',
        teks: '森{もり}さんは来月{らいげつ}、会社{かいしゃ}をやめて、北海道{ほっかいどう}へ帰{かえ}ります。森{もり}さんは三年間{さんねんかん}、わたしたちに仕事{しごと}を教{おし}えました。ですから、わたしたち五人{ごにん}でプレゼントをあげます。一人{ひとり}千円{せんえん}出{だ}して、あたたかい手{て}ぶくろを買{か}いました。北海道{ほっかいどう}の冬{ふゆ}はとても寒{さむ}いからです。金曜日{きんようび}の昼休{ひるやす}みに、森{もり}さんにあげます。',
        terjemahan: 'Bulan depan Pak Mori berhenti dari perusahaan dan pulang ke Hokkaido. Selama tiga tahun Pak Mori mengajari kami pekerjaan. Karena itu kami berlima akan memberinya hadiah. Masing-masing mengeluarkan 1.000 yen, lalu kami membeli sarung tangan yang hangat. Itu karena musim dingin di Hokkaido sangat dingin. Kami akan memberikannya kepada Pak Mori pada istirahat siang hari Jumat.',
        soal: [
          { id: 'L5-37-1', tanya: '森{もり}さんへのプレゼントは何{なん}ですか。', tanyaId: 'Apa hadiah untuk Pak Mori?', opsi: ['セーター', 'ぼうし', '手{て}ぶくろ'], benar: 2, pembahasan: 'あたたかい手ぶくろを買いました = membeli sarung tangan yang hangat.' },
          { id: 'L5-37-2', tanya: '五人{ごにん}は全部{ぜんぶ}でいくら出{だ}しましたか。', tanyaId: 'Berapa jumlah uang yang dikeluarkan kelima orang itu seluruhnya?', opsi: ['千円{せんえん}', '五千円{ごせんえん}', '六千円{ろくせんえん}'], benar: 1, pembahasan: 'わたしたち五人でプレゼントをあげます。一人千円出して = kami berlima memberi hadiah; masing-masing mengeluarkan 1.000 yen (5 × 1.000 = 5.000 yen).' },
        ],
      },
      {
        id: 'L5-38',
        judul: '夜{よる}八時{はちじ}のスーパー',
        teks: '寮{りょう}の近{ちか}くのスーパーは、夜{よる}九時{くじ}に閉{し}まります。夜{よる}八時{はちじ}から、お弁当{べんとう}が安{やす}くなります。五百円{ごひゃくえん}のお弁当{べんとう}が三百円{さんびゃくえん}です。ユダさんは仕事{しごと}が七時{しちじ}に終{お}わりますが、すぐスーパーへは行{い}きません。寮{りょう}でシャワーをあびて、八時{はちじ}にスーパーへ行{い}きます。きのうはお弁当{べんとう}を二{ふた}つ買{か}いました。',
        terjemahan: 'Supermarket di dekat asrama tutup pukul 9 malam. Mulai pukul 8 malam, bekal makanan menjadi murah. Bekal seharga 500 yen menjadi 300 yen. Pekerjaan Yuda selesai pukul 7, tetapi ia tidak langsung pergi ke supermarket. Ia mandi dulu di asrama, lalu pergi ke supermarket pukul 8. Kemarin ia membeli dua bekal.',
        soal: [
          { id: 'L5-38-1', tanya: 'スーパーは何時{なんじ}に閉{し}まりますか。', tanyaId: 'Supermarket tutup pukul berapa?', opsi: ['九時{くじ}', '八時{はちじ}', '七時{しちじ}'], benar: 0, pembahasan: 'スーパーは、夜九時に閉まります = supermarket tutup pukul 9 malam.' },
          { id: 'L5-38-2', tanya: 'どうしてユダさんは八時{はちじ}にスーパーへ行{い}きますか。', tanyaId: 'Mengapa Yuda pergi ke supermarket pukul 8?', opsi: ['仕事{しごと}が八時{はちじ}に終{お}わるからです', 'スーパーが八時{はちじ}に開{あ}くからです', '八時{はちじ}からお弁当{べんとう}が安{やす}いからです'], benar: 2, pembahasan: '夜八時から、お弁当が安くなります…八時にスーパーへ行きます = mulai pukul 8 malam bekal menjadi murah … ia pergi ke supermarket pukul 8 (menunggu sampai harganya murah).' },
        ],
      },
      {
        id: 'L5-39',
        judul: '弟{おとうと}のギター',
        teks: '弟{おとうと}は高校生{こうこうせい}で、ギターが大好{だいす}きです。毎日{まいにち}学校{がっこう}から帰{かえ}って、二時間{にじかん}ぐらい練習{れんしゅう}します。はじめは下手{へた}でしたから、家族{かぞく}はみんな「うるさいです」と言{い}いました。でも、今{いま}はとても上手{じょうず}です。先月{せんげつ}、学校{がっこう}のコンサートでひきました。母{はは}は一番{いちばん}前{まえ}で聞{き}きました。今{いま}、母{はは}は「毎日{まいにち}ひいてください」と言{い}います。',
        terjemahan: 'Adik laki-laki saya siswa SMA dan sangat menyukai gitar. Setiap hari sepulang sekolah ia berlatih sekitar dua jam. Awalnya ia tidak pandai, jadi seluruh keluarga berkata "Berisik". Tetapi sekarang ia sangat pandai. Bulan lalu ia bermain di konser sekolah. Ibu mendengarkan di barisan paling depan. Sekarang ibu berkata, "Mainkanlah setiap hari."',
        soal: [
          { id: 'L5-39-1', tanya: '弟{おとうと}は毎日{まいにち}どのぐらいギターを練習{れんしゅう}しますか。', tanyaId: 'Setiap hari adik berlatih gitar berapa lama?', opsi: ['一時間{いちじかん}ぐらい', '二時間{にじかん}ぐらい', '三時間{さんじかん}ぐらい'], benar: 1, pembahasan: '二時間ぐらい練習します = berlatih sekitar dua jam.' },
          { id: 'L5-39-2', tanya: '今{いま}、母{はは}は弟{おとうと}のギターをどう思{おも}っていますか。', tanyaId: 'Sekarang, bagaimana pendapat ibu tentang permainan gitar adik?', opsi: ['うるさいですから、きらいです', '上手{じょうず}ですから、聞{き}きたいです', '下手{へた}ですから、聞{き}きたくないです'], benar: 1, pembahasan: '今はとても上手です…今、母は「毎日ひいてください」と言います = sekarang ia sangat pandai … sekarang ibu berkata "Mainkanlah setiap hari" (ibu senang mendengarnya).' },
        ],
      },
      {
        id: 'L5-40',
        judul: '夏{なつ}の仕事{しごと}の時間{じかん}',
        teks: '工場{こうじょう}のみなさんへ。来月{らいげつ}から仕事{しごと}の時間{じかん}が早{はや}くなります。今{いま}は朝{あさ}八時{はちじ}から午後{ごご}五時{ごじ}までですが、来月{らいげつ}からは朝{あさ}七時{しちじ}から午後{ごご}四時{よじ}までです。夏{なつ}は午後{ごご}とても暑{あつ}いからです。昼休{ひるやす}みは今{いま}と同{おな}じで、十二時{じゅうにじ}から一時間{いちじかん}です。会社{かいしゃ}のバスも一時間{いちじかん}早{はや}く出{で}ます。事務所{じむしょ}の山田{やまだ}',
        terjemahan: 'Kepada seluruh karyawan pabrik. Mulai bulan depan jam kerja menjadi lebih awal. Sekarang dari pukul 8 pagi sampai pukul 5 sore, tetapi mulai bulan depan dari pukul 7 pagi sampai pukul 4 sore. Itu karena pada musim panas siang hari sangat panas. Istirahat siang sama seperti sekarang, satu jam mulai pukul 12. Bus perusahaan juga berangkat satu jam lebih awal. Yamada, bagian kantor',
        soal: [
          { id: 'L5-40-1', tanya: '来月{らいげつ}から、仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Mulai bulan depan, pekerjaan selesai pukul berapa?', opsi: ['午後{ごご}五時{ごじ}', '午後{ごご}三時{さんじ}', '午後{ごご}四時{よじ}'], benar: 2, pembahasan: '来月からは朝七時から午後四時までです = mulai bulan depan dari pukul 7 pagi sampai pukul 4 sore.' },
          { id: 'L5-40-2', tanya: '昼休{ひるやす}みは何時{なんじ}までですか。', tanyaId: 'Istirahat siang sampai pukul berapa?', opsi: ['一時{いちじ}', '十二時{じゅうにじ}', '二時{にじ}'], benar: 0, pembahasan: '昼休みは今と同じで、十二時から一時間です = istirahat siang sama seperti sekarang, satu jam mulai pukul 12 (jadi sampai pukul 1).' },
        ],
      },
      {
        id: 'L5-41',
        judul: '京都{きょうと}の一日{いちにち}',
        teks: '先月{せんげつ}、友{とも}だちと二人{ふたり}で京都{きょうと}へ行{い}きました。朝{あさ}、新幹線{しんかんせん}で行{い}って、二時間{にじかん}で着{つ}きました。古{ふる}いお寺{てら}を三{みっ}つ見{み}て、昼{ひる}ごはんにうどんを食{た}べました。午後{ごご}は店{みせ}で母{はは}に赤{あか}いさいふを買{か}いました。帰{かえ}りは新幹線{しんかんせん}のきっぷが高{たか}かったですから、バスに乗{の}りました。バスは安{やす}いですが、五時間{ごじかん}かかりました。',
        terjemahan: 'Bulan lalu saya pergi ke Kyoto berdua dengan teman. Pagi hari kami berangkat naik shinkansen dan tiba dalam dua jam. Kami melihat tiga kuil tua, lalu makan udon untuk makan siang. Sore hari saya membeli dompet merah untuk ibu di toko. Untuk pulang, tiket shinkansen mahal, jadi kami naik bus. Bus memang murah, tetapi memakan waktu lima jam.',
        soal: [
          { id: 'L5-41-1', tanya: '京都{きょうと}でお寺{てら}をいくつ見{み}ましたか。', tanyaId: 'Di Kyoto melihat berapa kuil?', opsi: ['三{みっ}つ', '二{ふた}つ', '五{いつ}つ'], benar: 0, pembahasan: '古いお寺を三つ見て = melihat tiga kuil tua.' },
          { id: 'L5-41-2', tanya: '帰{かえ}りのバスは、朝{あさ}の新幹線{しんかんせん}より何時間{なんじかん}長{なが}くかかりましたか。', tanyaId: 'Bus saat pulang memakan waktu berapa jam lebih lama daripada shinkansen pagi itu?', opsi: ['二時間{にじかん}', '三時間{さんじかん}', '五時間{ごじかん}'], benar: 1, pembahasan: '新幹線で行って、二時間で着きました…バスは安いですが、五時間かかりました = naik shinkansen tiba dalam dua jam … bus murah, tetapi memakan waktu lima jam (lima jam dikurangi dua jam = tiga jam lebih lama).' },
        ],
      },
      {
        id: 'L5-42',
        judul: '木村{きむら}さんのうちで',
        teks: '土曜日{どようび}の夜{よる}、先輩{せんぱい}の木村{きむら}さんのうちへ行{い}きました。奥{おく}さんのすきやきをみんなで食{た}べました。木村{きむら}さんの子{こ}どもは二人{ふたり}で、七歳{ななさい}の男{おとこ}の子{こ}と四歳{よんさい}の女{おんな}の子{こ}です。男{おとこ}の子{こ}は「インドネシアの言葉{ことば}を教{おし}えてください」と言{い}いました。わたしは「ありがとう」の言{い}い方{かた}を教{おし}えました。「テリマカシ」です。帰{かえ}る時{とき}、二人{ふたり}は大{おお}きい声{こえ}で「テリマカシ」と言{い}いました。',
        terjemahan: 'Sabtu malam saya pergi ke rumah Pak Kimura, senior saya. Kami semua makan sukiyaki buatan istrinya. Anak Pak Kimura dua orang: anak laki-laki berumur 7 tahun dan anak perempuan berumur 4 tahun. Anak laki-laki itu berkata, "Tolong ajari saya bahasa Indonesia." Saya mengajarkan cara mengucapkan "arigatou". Yaitu "terima kasih". Saat saya pulang, keduanya berkata "terima kasih" dengan suara keras.',
        soal: [
          { id: 'L5-42-1', tanya: '木村{きむら}さんの女{おんな}の子{こ}は何歳{なんさい}ですか。', tanyaId: 'Anak perempuan Pak Kimura berumur berapa tahun?', opsi: ['七歳{ななさい}', '四歳{よんさい}', '二歳{にさい}'], benar: 1, pembahasan: '七歳の男の子と四歳の女の子です = anak laki-laki berumur 7 tahun dan anak perempuan berumur 4 tahun.' },
          { id: 'L5-42-2', tanya: '帰{かえ}る時{とき}、子{こ}どもたちは何{なん}と言{い}いましたか。', tanyaId: 'Saat "saya" pulang, anak-anak itu berkata apa?', opsi: ['日本語{にほんご}で「さようなら」と言{い}いました', 'インドネシアの言葉{ことば}で「さようなら」と言{い}いました', 'インドネシアの言葉{ことば}で「ありがとう」と言{い}いました'], benar: 2, pembahasan: 'わたしは「ありがとう」の言い方を教えました。「テリマカシ」です…二人は大きい声で「テリマカシ」と言いました = saya mengajarkan cara mengucapkan "arigatou", yaitu "terima kasih" … keduanya berkata "terima kasih" dengan suara keras (mereka mengucapkan "arigatou" dalam bahasa Indonesia).' },
        ],
      },
      {
        id: 'L5-43',
        judul: '駅{えき}の前{まえ}の花屋{はなや}',
        teks: '駅{えき}の前{まえ}に小{ちい}さい花屋{はなや}があります。店{みせ}の人{ひと}は七十歳{ななじゅっさい}ぐらいのおじいさんです。わたしは毎週{まいしゅう}金曜日{きんようび}に、そこで部屋{へや}の花{はな}を買{か}います。先週{せんしゅう}は赤{あか}い花{はな}を三本{さんぼん}買{か}いました。花{はな}は一本{いっぽん}二百円{にひゃくえん}です。おじいさんは「いつもありがとうございます」と言{い}いました。それから、白{しろ}い花{はな}を一本{いっぽん}もらいました。',
        terjemahan: 'Di depan stasiun ada toko bunga kecil. Penjualnya seorang kakek berumur sekitar 70 tahun. Setiap hari Jumat saya membeli bunga untuk kamar di sana. Minggu lalu saya membeli tiga tangkai bunga merah. Harga bunga 200 yen setangkai. Kakek itu berkata, "Terima kasih selalu datang." Lalu saya menerima setangkai bunga putih.',
        soal: [
          { id: 'L5-43-1', tanya: '「わたし」はいつ花屋{はなや}で花{はな}を買{か}いますか。', tanyaId: 'Kapan "saya" membeli bunga di toko bunga?', opsi: ['毎日{まいにち}', '毎月{まいつき}一日{ついたち}', '毎週{まいしゅう}金曜日{きんようび}'], benar: 2, pembahasan: 'わたしは毎週金曜日に、そこで部屋の花を買います = setiap hari Jumat saya membeli bunga untuk kamar di sana.' },
          { id: 'L5-43-2', tanya: '先週{せんしゅう}、「わたし」は花屋{はなや}でいくら出{だ}しましたか。', tanyaId: 'Minggu lalu "saya" membayar berapa di toko bunga?', opsi: ['六百円{ろっぴゃくえん}', '八百円{はっぴゃくえん}', '二百円{にひゃくえん}'], benar: 0, pembahasan: '先週は赤い花を三本買いました。花は一本二百円です…白い花を一本もらいました = minggu lalu membeli tiga tangkai bunga merah; bunga 200 yen setangkai … menerima setangkai bunga putih (3 × 200 = 600 yen; bunga putih diberi, tidak dibayar).' },
        ],
      },
      {
        id: 'L5-44',
        judul: '寮{りょう}のそうじの日{ひ}',
        teks: 'わたしの寮{りょう}では、月{つき}に一回{いっかい}、日曜日{にちようび}の朝{あさ}にみんなでそうじをします。九時{くじ}に始{はじ}めて、十一時{じゅういちじ}に終{お}わります。今月{こんげつ}、わたしは台所{だいどころ}をそうじしました。台所{だいどころ}は広{ひろ}くて、とても大変{たいへん}でした。来月{らいげつ}はトイレで、その次{つぎ}はげんかんです。そうじのあとで、寮{りょう}の小林{こばやし}さんがみんなにジュースを出{だ}します。',
        terjemahan: 'Di asrama saya, sebulan sekali pada Minggu pagi kami semua bersih-bersih bersama. Mulai pukul 9 dan selesai pukul 11. Bulan ini saya membersihkan dapur. Dapurnya luas dan sangat melelahkan. Bulan depan giliran toilet, dan berikutnya pintu masuk. Setelah bersih-bersih, Pak Kobayashi dari asrama menyuguhkan jus kepada semuanya.',
        soal: [
          { id: 'L5-44-1', tanya: '今月{こんげつ}、「わたし」はどこをそうじしましたか。', tanyaId: 'Bulan ini "saya" membersihkan bagian mana?', opsi: ['台所{だいどころ}', 'トイレ', 'げんかん'], benar: 0, pembahasan: '今月、わたしは台所をそうじしました = bulan ini saya membersihkan dapur.' },
          { id: 'L5-44-2', tanya: '寮{りょう}のそうじは何時間{なんじかん}しますか。', tanyaId: 'Bersih-bersih asrama dilakukan berapa jam?', opsi: ['一時間{いちじかん}', '三時間{さんじかん}', '二時間{にじかん}'], benar: 2, pembahasan: '九時に始めて、十一時に終わります = mulai pukul 9 dan selesai pukul 11 (dari pukul 9 sampai pukul 11 = 2 jam).' },
        ],
      },
      {
        id: 'L5-45',
        judul: '日本{にほん}に来{き}て一年{いちねん}',
        teks: '去年{きょねん}の四月{しがつ}に日本{にほん}へ来{き}ました。はじめは日本語{にほんご}がぜんぜんわかりませんでしたから、買{か}い物{もの}はいつも先輩{せんぱい}といっしょでした。でも、毎晩{まいばん}一時間{いちじかん}勉強{べんきょう}しましたから、今{いま}は一人{ひとり}で買{か}い物{もの}にも病院{びょういん}にも行{い}きます。今年{ことし}の四月{しがつ}に、新{あたら}しい人{ひと}が三人{さんにん}来{き}ました。三人{さんにん}はまだ日本語{にほんご}がよくわかりません。今{いま}はわたしが先輩{せんぱい}です。あした、三人{さんにん}と買{か}い物{もの}に行{い}きます。',
        terjemahan: 'Saya datang ke Jepang pada bulan April tahun lalu. Awalnya saya sama sekali tidak mengerti bahasa Jepang, jadi belanja selalu bersama senior. Tetapi saya belajar satu jam setiap malam, jadi sekarang saya pergi belanja maupun ke rumah sakit sendirian. Pada bulan April tahun ini datang tiga orang baru. Ketiganya belum begitu mengerti bahasa Jepang. Sekarang sayalah seniornya. Besok saya pergi belanja bersama mereka bertiga.',
        soal: [
          { id: 'L5-45-1', tanya: '「わたし」は毎晩{まいばん}どのぐらい勉強{べんきょう}しましたか。', tanyaId: 'Setiap malam "saya" belajar berapa lama?', opsi: ['三十分{さんじゅっぷん}', '一時間{いちじかん}', '三時間{さんじかん}'], benar: 1, pembahasan: '毎晩一時間勉強しましたから = karena belajar satu jam setiap malam.' },
          { id: 'L5-45-2', tanya: 'どうして「わたし」はあした、新{あたら}しい三人{さんにん}と買{か}い物{もの}に行{い}きますか。', tanyaId: 'Mengapa besok "saya" pergi belanja bersama tiga orang baru itu?', opsi: ['三人{さんにん}はまだ日本語{にほんご}がよくわからないからです', '「わたし」は一人{ひとり}で買{か}い物{もの}に行{い}かないからです', '三人{さんにん}が「わたし」の先輩{せんぱい}だからです'], benar: 0, pembahasan: '三人はまだ日本語がよくわかりません。今はわたしが先輩です。あした、三人と買い物に行きます = ketiganya belum begitu mengerti bahasa Jepang; sekarang sayalah seniornya; besok pergi belanja bersama mereka (seperti dulu "saya" ditemani senior karena belum mengerti bahasa Jepang).' },
        ],
      },
    ],
  },
];
