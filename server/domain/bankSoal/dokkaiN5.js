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
        teks: 'わたしは毎朝{まいあさ}6時{じ}に起{お}きます。7時{じ}にパンとたまごを食{た}べます。それから、学校{がっこう}へ行{い}きます。',
        terjemahan: 'Saya bangun setiap pagi pukul enam. Pukul tujuh saya makan roti dan telur. Setelah itu, saya pergi ke sekolah.',
        soal: [
          { id: 'L1-1-1', tanya: '何時{なんじ}に起{お}きますか。', tanyaId: 'Pukul berapa tokoh bangun?', opsi: ['5時{じ}', '6時{じ}', '7時{じ}'], benar: 1, pembahasan: '毎朝6時に起きます = setiap pagi bangun pukul enam.' },
          { id: 'L1-1-2', tanya: '朝{あさ}ごはんに何{なに}を食{た}べますか。', tanyaId: 'Apa yang dimakan saat sarapan?', opsi: ['ごはんと魚{さかな}', 'パンとたまご', 'くだものと牛乳{ぎゅうにゅう}'], benar: 1, pembahasan: 'パンとたまご = roti dan telur.' },
        ],
      },
      {
        id: 'L1-2',
        judul: '家族{かぞく}',
        teks: 'わたしの家族{かぞく}は4人{にん}です。父{ちち}と母{はは}と妹{いもうと}とわたしです。妹{いもうと}は10歳{さい}で、わたしより小{ちい}さいです。',
        terjemahan: 'Keluarga saya terdiri dari empat orang: ayah, ibu, adik perempuan, dan saya. Adik perempuan berusia sepuluh tahun dan lebih kecil daripada saya.',
        soal: [
          { id: 'L1-2-1', tanya: '家族{かぞく}は何人{なんにん}ですか。', tanyaId: 'Ada berapa orang dalam keluarga?', opsi: ['3人{にん}', '4人{にん}', '5人{にん}'], benar: 1, pembahasan: '家族は4人です = keluarga terdiri dari empat orang.' },
          { id: 'L1-2-2', tanya: '妹{いもうと}は何歳{なんさい}ですか。', tanyaId: 'Berapa umur adik perempuan?', opsi: ['8歳{さい}', '9歳{さい}', '10歳{さい}'], benar: 2, pembahasan: '妹は10歳 = adik perempuan berumur sepuluh tahun.' },
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
        teks: 'わたしの部屋{へや}は2階{かい}にあります。部屋{へや}にはつくえといすがあります。まどのそばにベッドがあります。',
        terjemahan: 'Kamar saya ada di lantai dua. Di kamar ada meja dan kursi. Di dekat jendela ada tempat tidur.',
        soal: [
          { id: 'L1-4-1', tanya: 'わたしの部屋{へや}は何階{なんがい}にありますか。', tanyaId: 'Kamar penulis ada di lantai berapa?', opsi: ['1階{かい}', '2階{かい}', '3階{がい}'], benar: 1, pembahasan: '部屋は2階にあります = kamar ada di lantai dua.' },
          { id: 'L1-4-2', tanya: 'まどのそばに何{なに}がありますか。', tanyaId: 'Apa yang ada di dekat jendela?', opsi: ['つくえ', 'いす', 'ベッド'], benar: 2, pembahasan: 'まどのそばにベッドがあります = di dekat jendela ada tempat tidur.' },
        ],
      },
      {
        id: 'L1-5',
        judul: '友{とも}だちのアンナさん',
        teks: 'アンナさんはわたしの友{とも}だちです。アメリカ人{じん}で、日本語{にほんご}の学生{がくせい}です。アンナさんは毎日{まいにち}バスで学校{がっこう}へ来{き}ます。',
        terjemahan: 'Anna adalah teman saya. Ia orang Amerika dan pelajar bahasa Jepang. Anna datang ke sekolah naik bus setiap hari.',
        soal: [
          { id: 'L1-5-1', tanya: 'アンナさんはどこの国{くに}の人{ひと}ですか。', tanyaId: 'Anna orang dari negara mana?', opsi: ['イギリス', 'アメリカ', 'インドネシア'], benar: 1, pembahasan: 'アメリカ人 = orang Amerika.' },
          { id: 'L1-5-2', tanya: 'アンナさんは何{なん}で学校{がっこう}へ来{き}ますか。', tanyaId: 'Anna datang ke sekolah naik apa?', opsi: ['バス', '電車{でんしゃ}', '自転車{じてんしゃ}'], benar: 0, pembahasan: '毎日バスで学校へ来ます = setiap hari datang ke sekolah naik bus.' },
        ],
      },
      {
        id: 'L1-6',
        judul: 'わたしのかばん',
        teks: 'これはわたしのかばんです。かばんの中{なか}に本{ほん}が2冊{さつ}とペンが3本{ぼん}あります。このかばんは黒{くろ}くて、大{おお}きいです。',
        terjemahan: 'Ini tas saya. Di dalam tas ada dua buku dan tiga pena. Tas ini hitam dan besar.',
        soal: [
          { id: 'L1-6-1', tanya: 'かばんの中{なか}にペンは何本{なんぼん}ありますか。', tanyaId: 'Ada berapa pena di dalam tas?', opsi: ['2本{ほん}', '3本{ぼん}', '4本{ほん}'], benar: 1, pembahasan: 'ペンが3本 = tiga pena.' },
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
        teks: 'うちにねこが1匹{ぴき}います。名前{なまえ}はタマです。タマは白{しろ}いねこです。毎日{まいにち}よく寝{ね}ます。',
        terjemahan: 'Di rumah ada seekor kucing. Namanya Tama. Tama adalah kucing putih. Setiap hari ia banyak tidur.',
        soal: [
          { id: 'L1-8-1', tanya: 'ねこの名前{なまえ}は何{なん}ですか。', tanyaId: 'Siapa nama kucingnya?', opsi: ['タマ', 'モモ', 'ミカ'], benar: 0, pembahasan: '名前はタマです = namanya Tama.' },
          { id: 'L1-8-2', tanya: 'うちのねこはどんなねこですか。', tanyaId: 'Kucing di rumah itu kucing seperti apa?', opsi: ['黒{くろ}いねこ', '白{しろ}いねこ', '白{しろ}と黒{くろ}のねこ'], benar: 1, pembahasan: '白いねこです = kucing putih.' },
        ],
      },
      {
        id: 'L1-9',
        judul: 'わたしの日曜日{にちようび}',
        teks: 'わたしは日曜日{にちようび}の昼{ひる}に料理{りょうり}をします。日曜日{にちようび}の夜{よる}は家族{かぞく}といっしょにテレビを見{み}ます。月曜日{げつようび}の朝{あさ}は早{はや}く起{お}きます。',
        terjemahan: 'Saya memasak pada hari Minggu siang. Minggu malam saya menonton TV bersama keluarga. Senin pagi saya bangun pagi-pagi.',
        soal: [
          { id: 'L1-9-1', tanya: '日曜日{にちようび}の夜{よる}、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pada Minggu malam?', opsi: ['料理{りょうり}をします', 'テレビを見{み}ます', '勉強{べんきょう}をします'], benar: 1, pembahasan: '日曜日の夜は家族といっしょにテレビを見ます = Minggu malam menonton TV bersama keluarga.' },
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
        teks: 'わたしには兄{あに}が一人{ひとり}と弟{おとうと}が二人{ふたり}います。兄{あに}は25歳{さい}です。弟{おとうと}たちは学生{がくせい}です。',
        terjemahan: 'Saya punya satu kakak laki-laki dan dua adik laki-laki. Kakak berumur 25 tahun. Adik-adik saya pelajar.',
        soal: [
          { id: 'L1-14-1', tanya: '弟{おとうと}は何人{なんにん}いますか。', tanyaId: 'Ada berapa adik laki-laki?', opsi: ['一人{ひとり}', '二人{ふたり}', '3人{にん}'], benar: 1, pembahasan: '弟が二人います = punya dua adik laki-laki.' },
          { id: 'L1-14-2', tanya: 'お兄{にい}さんは何歳{なんさい}ですか。', tanyaId: 'Berapa umur kakak laki-laki?', opsi: ['20歳{はたち}', '22歳{さい}', '25歳{さい}'], benar: 2, pembahasan: '兄は25歳です = kakak laki-laki berumur 25 tahun.' },
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
        teks: '今日{きょう}はわたしの誕生日{たんじょうび}です。20歳{はたち}になりました。夜{よる}、家族{かぞく}とケーキを食{た}べます。',
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
        teks: 'わたしの学校{がっこう}は駅{えき}の近{ちか}くにあります。学生{がくせい}は300人{にん}です。学校{がっこう}の前{まえ}に大{おお}きい木{き}があります。',
        terjemahan: 'Sekolah saya ada di dekat stasiun. Siswanya 300 orang. Di depan sekolah ada pohon besar.',
        soal: [
          { id: 'L1-20-1', tanya: '学校{がっこう}はどこにありますか。', tanyaId: 'Di mana sekolahnya?', opsi: ['駅{えき}の近{ちか}く', '川{かわ}の近{ちか}く', '公園{こうえん}の中{なか}'], benar: 0, pembahasan: 'わたしの学校は駅の近くにあります = sekolah saya ada di dekat stasiun.' },
          { id: 'L1-20-2', tanya: '学生{がくせい}は何人{なんにん}ですか。', tanyaId: 'Ada berapa siswa?', opsi: ['100人{にん}', '300人{にん}', '3000人{にん}'], benar: 1, pembahasan: '学生は300人です = siswanya 300 orang.' },
        ],
      },
      {
        id: 'L1-21',
        judul: '寮{りょう}のわたしの部屋{へや}',
        teks: 'わたしの部屋{へや}は寮{りょう}の2階{かい}にあります。部屋{へや}にベッドとつくえがあります。テレビはありません。',
        terjemahan: 'Kamar saya ada di lantai dua asrama. Di kamar ada tempat tidur dan meja. Televisi tidak ada.',
        soal: [
          { id: 'L1-21-1', tanya: '部屋{へや}は何階{なんがい}にありますか。', tanyaId: 'Kamarnya ada di lantai berapa?', opsi: ['1階{かい}', '2階{かい}', '3階{がい}'], benar: 1, pembahasan: 'わたしの部屋は寮の2階にあります = kamar saya ada di lantai dua asrama.' },
          { id: 'L1-21-2', tanya: '部屋{へや}に何{なに}がありませんか。', tanyaId: 'Apa yang tidak ada di kamar?', opsi: ['ベッド', 'つくえ', 'テレビ'], benar: 2, pembahasan: 'テレビはありません = televisi tidak ada.' },
        ],
      },
      {
        id: 'L1-22',
        judul: '妹{いもうと}の新{あたら}しいくつ',
        teks: '妹{いもうと}は先週{せんしゅう}、くつを買{か}いました。白{しろ}くて、かるいくつです。3000円{えん}でした。',
        terjemahan: 'Adik perempuan saya membeli sepatu minggu lalu. Sepatunya putih dan ringan. Harganya 3.000 yen.',
        soal: [
          { id: 'L1-22-1', tanya: '妹{いもうと}さんはいつくつを買{か}いましたか。', tanyaId: 'Kapan adik perempuan membeli sepatu?', opsi: ['先週{せんしゅう}', 'きのう', '先月{せんげつ}'], benar: 0, pembahasan: '妹は先週、くつを買いました = adik perempuan membeli sepatu minggu lalu.' },
          { id: 'L1-22-2', tanya: 'くつはいくらでしたか。', tanyaId: 'Berapa harga sepatunya?', opsi: ['1000円{えん}', '2000円{えん}', '3000円{えん}'], benar: 2, pembahasan: '3000円でした = harganya 3.000 yen.' },
        ],
      },
      {
        id: 'L1-23',
        judul: '朝{あさ}の会社{かいしゃ}バス',
        teks: 'わたしは毎朝{まいあさ}会社{かいしゃ}のバスに乗{の}ります。バスは7時{じ}に寮{りょう}の前{まえ}に来{き}ます。会社{かいしゃ}まで20分{ぷん}です。',
        terjemahan: 'Setiap pagi saya naik bus perusahaan. Bus datang ke depan asrama pukul 7. Sampai perusahaan 20 menit.',
        soal: [
          { id: 'L1-23-1', tanya: 'バスは何時{なんじ}に来{き}ますか。', tanyaId: 'Bus datang pukul berapa?', opsi: ['6時{じ}', '7時{じ}', '8時{じ}'], benar: 1, pembahasan: 'バスは7時に寮の前に来ます = bus datang ke depan asrama pukul 7.' },
          { id: 'L1-23-2', tanya: '会社{かいしゃ}まで何分{なんぷん}ですか。', tanyaId: 'Berapa menit sampai perusahaan?', opsi: ['20分{ぷん}', '30分{ぷん}', '10分{ぷん}'], benar: 0, pembahasan: '会社まで20分です = sampai perusahaan 20 menit.' },
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
        judul: 'ブディさんの今週{こんしゅう}',
        teks: 'ブディさんは今週{こんしゅう}、夜{よる}の仕事{しごと}です。夜{よる}8時{じ}から朝{あさ}5時{じ}まで働{はたら}きます。昼{ひる}は寮{りょう}で寝{ね}ます。',
        terjemahan: 'Minggu ini Budi bekerja malam. Ia bekerja dari pukul 8 malam sampai pukul 5 pagi. Siang hari ia tidur di asrama.',
        soal: [
          { id: 'L1-25-1', tanya: 'ブディさんは何時{なんじ}から働{はたら}きますか。', tanyaId: 'Budi bekerja mulai pukul berapa?', opsi: ['朝{あさ}5時{じ}', '夜{よる}10時{じ}', '夜{よる}8時{じ}'], benar: 2, pembahasan: '夜8時から朝5時まで働きます = bekerja dari pukul 8 malam sampai pukul 5 pagi.' },
          { id: 'L1-25-2', tanya: '昼{ひる}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pada siang hari?', opsi: ['寮{りょう}で寝{ね}ます', '友{とも}だちのうちで寝{ね}ます', '寮{りょう}でテレビを見{み}ます'], benar: 0, pembahasan: '昼は寮で寝ます = siang hari tidur di asrama.' },
        ],
      },
      {
        id: 'L1-26',
        judul: '赤{あか}いかさ',
        teks: 'わたしのかさは赤{あか}いです。先月{せんげつ}、デパートで買{か}いました。1500円{えん}でした。',
        terjemahan: 'Payung saya berwarna merah. Saya membelinya bulan lalu di toserba. Harganya 1.500 yen.',
        soal: [
          { id: 'L1-26-1', tanya: 'かさはどこで買{か}いましたか。', tanyaId: 'Di mana payung itu dibeli?', opsi: ['スーパー', 'デパート', 'コンビニ'], benar: 1, pembahasan: '先月、デパートで買いました = dibeli bulan lalu di toserba.' },
          { id: 'L1-26-2', tanya: 'かさはいくらでしたか。', tanyaId: 'Berapa harga payungnya?', opsi: ['500円{えん}', '1000円{えん}', '1500円{えん}'], benar: 2, pembahasan: '1500円でした = harganya 1.500 yen.' },
        ],
      },
      {
        id: 'L1-27',
        judul: '会社{かいしゃ}の会議{かいぎ}',
        teks: '毎週{まいしゅう}月曜日{げつようび}に会議{かいぎ}があります。朝{あさ}8時{じ}から9時{じ}までです。会議{かいぎ}は2階{かい}の事務所{じむしょ}です。',
        terjemahan: 'Setiap hari Senin ada rapat. Rapatnya dari pukul 8 sampai pukul 9 pagi. Rapatnya di kantor lantai 2.',
        soal: [
          { id: 'L1-27-1', tanya: '何曜日{なんようび}に会議{かいぎ}がありますか。', tanyaId: 'Rapat diadakan hari apa?', opsi: ['月曜日{げつようび}', '水曜日{すいようび}', '木曜日{もくようび}'], benar: 0, pembahasan: '毎週月曜日に会議があります = setiap hari Senin ada rapat.' },
          { id: 'L1-27-2', tanya: '会議{かいぎ}はどこですか。', tanyaId: 'Rapatnya di mana?', opsi: ['1階{かい}の事務所{じむしょ}', '2階{かい}の事務所{じむしょ}', '2階{かい}の食堂{しょくどう}'], benar: 1, pembahasan: '会議は2階の事務所です = rapatnya di kantor lantai 2.' },
        ],
      },
      {
        id: 'L1-28',
        judul: '先週{せんしゅう}の海{うみ}',
        teks: '先週{せんしゅう}、友{とも}だちと海{うみ}へ行{い}きました。電車{でんしゃ}で1時間{じかん}でした。海{うみ}はとてもきれいでした。',
        terjemahan: 'Minggu lalu saya pergi ke laut bersama teman. Naik kereta satu jam. Lautnya sangat indah.',
        soal: [
          { id: 'L1-28-1', tanya: 'だれと海{うみ}へ行{い}きましたか。', tanyaId: 'Dengan siapa pergi ke laut?', opsi: ['友{とも}だち', '家族{かぞく}', '会社{かいしゃ}の人{ひと}'], benar: 0, pembahasan: '先週、友だちと海へ行きました = minggu lalu pergi ke laut bersama teman.' },
          { id: 'L1-28-2', tanya: '海{うみ}まで電車{でんしゃ}でどのくらいでしたか。', tanyaId: 'Berapa lama naik kereta sampai ke laut?', opsi: ['30分{ぷん}', '1時間{じかん}', '2時間{じかん}'], benar: 1, pembahasan: '電車で1時間でした = naik kereta satu jam.' },
        ],
      },
      {
        id: 'L1-29',
        judul: '会社{かいしゃ}の服{ふく}とぼうし',
        teks: 'わたしは会社{かいしゃ}で青{あお}い服{ふく}を着{き}ます。ぼうしは白{しろ}いです。くつは黒{くろ}いです。',
        terjemahan: 'Di perusahaan saya memakai baju biru. Topinya putih. Sepatunya hitam.',
        soal: [
          { id: 'L1-29-1', tanya: '会社{かいしゃ}の服{ふく}は何色{なにいろ}ですか。', tanyaId: 'Baju di perusahaan berwarna apa?', opsi: ['白{しろ}', '黒{くろ}', '青{あお}'], benar: 2, pembahasan: 'わたしは会社で青い服を着ます = di perusahaan saya memakai baju biru.' },
          { id: 'L1-29-2', tanya: '白{しろ}いのは何{なん}ですか。', tanyaId: 'Yang berwarna putih itu apa?', opsi: ['ぼうし', 'くつ', '服{ふく}'], benar: 0, pembahasan: 'ぼうしは白いです = topinya putih.' },
        ],
      },
      {
        id: 'L1-30',
        judul: '姉{あね}の子{こ}ども',
        teks: '姉{あね}には子{こ}どもが二人{ふたり}います。男{おとこ}の子{こ}と女{おんな}の子{こ}です。男{おとこ}の子{こ}は8歳{さい}です。',
        terjemahan: 'Kakak perempuan saya punya dua anak. Seorang anak laki-laki dan seorang anak perempuan. Anak laki-lakinya berumur 8 tahun.',
        soal: [
          { id: 'L1-30-1', tanya: 'お姉{ねえ}さんの子{こ}どもは何人{なんにん}ですか。', tanyaId: 'Ada berapa anak kakak perempuan?', opsi: ['一人{ひとり}', '二人{ふたり}', '3人{にん}'], benar: 1, pembahasan: '姉には子どもが二人います = kakak perempuan punya dua anak.' },
          { id: 'L1-30-2', tanya: '男{おとこ}の子{こ}は何歳{なんさい}ですか。', tanyaId: 'Berapa umur anak laki-lakinya?', opsi: ['8歳{さい}', '9歳{さい}', '10歳{さい}'], benar: 0, pembahasan: '男の子は8歳です = anak laki-lakinya berumur 8 tahun.' },
        ],
      },
      {
        id: 'L1-31',
        judul: '母{はは}へのお金{かね}',
        teks: 'わたしは毎月{まいつき}母{はは}にお金{かね}を送{おく}ります。銀行{ぎんこう}は会社{かいしゃ}のとなりにあります。昼休{ひるやす}みに行{い}きます。',
        terjemahan: 'Setiap bulan saya mengirim uang kepada ibu. Bank ada di sebelah perusahaan. Saya pergi ke sana pada waktu istirahat siang.',
        soal: [
          { id: 'L1-31-1', tanya: '銀行{ぎんこう}はどこにありますか。', tanyaId: 'Di mana banknya?', opsi: ['寮{りょう}のとなり', '駅{えき}のとなり', '会社{かいしゃ}のとなり'], benar: 2, pembahasan: '銀行は会社のとなりにあります = bank ada di sebelah perusahaan.' },
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
        judul: '会社{かいしゃ}の佐藤{さとう}さん',
        teks: '佐藤{さとう}さんは会社{かいしゃ}の友{とも}だちです。とてもしんせつな人{ひと}です。わたしは仕事{しごと}のあとで、佐藤{さとう}さんと日本語{にほんご}で話{はな}します。',
        terjemahan: 'Sato-san adalah teman saya di perusahaan. Ia orang yang sangat ramah. Sesudah bekerja, saya berbicara dengan Sato-san dalam bahasa Jepang.',
        soal: [
          { id: 'L1-33-1', tanya: '佐藤{さとう}さんはどんな人{ひと}ですか。', tanyaId: 'Sato-san orang yang seperti apa?', opsi: ['しずかな人{ひと}', 'しんせつな人{ひと}', 'おもしろい人{ひと}'], benar: 1, pembahasan: 'とてもしんせつな人です = orang yang sangat ramah.' },
          { id: 'L1-33-2', tanya: 'いつ佐藤{さとう}さんと話{はな}しますか。', tanyaId: 'Kapan berbicara dengan Sato-san?', opsi: ['仕事{しごと}のまえ', '昼休{ひるやす}み', '仕事{しごと}のあと'], benar: 2, pembahasan: 'わたしは仕事のあとで、佐藤さんと日本語で話します = sesudah bekerja, saya berbicara dengan Sato-san dalam bahasa Jepang.' },
        ],
      },
      {
        id: 'L1-34',
        judul: 'アグスさんのギター',
        teks: 'アグスさんはギターが上手{じょうず}です。毎晩{まいばん}30分{ぷん}れんしゅうします。でも、歌{うた}は上手{じょうず}ではありません。',
        terjemahan: 'Agus pandai bermain gitar. Setiap malam ia berlatih 30 menit. Tetapi ia tidak pandai bernyanyi.',
        soal: [
          { id: 'L1-34-1', tanya: '毎晩{まいばん}どのくらいれんしゅうしますか。', tanyaId: 'Setiap malam berlatih berapa lama?', opsi: ['30分{ぷん}', '1時間{じかん}', '2時間{じかん}'], benar: 0, pembahasan: '毎晩30分れんしゅうします = setiap malam berlatih 30 menit.' },
          { id: 'L1-34-2', tanya: 'アグスさんは何{なに}が上手{じょうず}ではありませんか。', tanyaId: 'Agus tidak pandai dalam hal apa?', opsi: ['ギター', '歌{うた}', 'ピアノ'], benar: 1, pembahasan: 'でも、歌は上手ではありません = tetapi ia tidak pandai bernyanyi.' },
        ],
      },
      {
        id: 'L1-35',
        judul: '10時{じ}の休{やす}み',
        teks: '10時{じ}に15分{ふん}の休{やす}みがあります。わたしは食堂{しょくどう}でお茶{ちゃ}を飲{の}みます。それから、また働{はたら}きます。',
        terjemahan: 'Pukul 10 ada istirahat 15 menit. Saya minum teh di kantin. Setelah itu saya bekerja lagi.',
        soal: [
          { id: 'L1-35-1', tanya: '休{やす}みは何分{なんぷん}ですか。', tanyaId: 'Istirahatnya berapa menit?', opsi: ['10分{ぷん}', '20分{ぷん}', '15分{ふん}'], benar: 2, pembahasan: '10時に15分の休みがあります = pukul 10 ada istirahat 15 menit.' },
          { id: 'L1-35-2', tanya: 'どこでお茶{ちゃ}を飲{の}みますか。', tanyaId: 'Di mana minum teh?', opsi: ['事務所{じむしょ}', '食堂{しょくどう}', '外{そと}'], benar: 1, pembahasan: 'わたしは食堂でお茶を飲みます = saya minum teh di kantin.' },
        ],
      },
      {
        id: 'L1-36',
        judul: '4月{がつ}の公園{こうえん}',
        teks: '4月{がつ}です。公園{こうえん}の花{はな}がとてもきれいです。日曜日{にちようび}に姉{あね}と公園{こうえん}へ行{い}きました。たくさん写真{しゃしん}をとりました。',
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
        teks: '田中{たなか}さんは毎朝{まいあさ}犬{いぬ}と散歩{さんぽ}します。6時{じ}に家{いえ}を出{で}ます。川{かわ}の近{ちか}くを歩{ある}きます。',
        terjemahan: 'Setiap pagi Tanaka-san berjalan-jalan dengan anjingnya. Ia berangkat dari rumah pukul 6. Ia berjalan di dekat sungai.',
        soal: [
          { id: 'L1-38-1', tanya: '田中{たなか}さんは何時{なんじ}に家{いえ}を出{で}ますか。', tanyaId: 'Tanaka-san berangkat dari rumah pukul berapa?', opsi: ['5時{じ}', '7時{じ}', '6時{じ}'], benar: 2, pembahasan: '6時に家を出ます = berangkat dari rumah pukul 6.' },
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
        teks: 'わたしの家族{かぞく}はインドネシアにいます。毎週{まいしゅう}日曜日{にちようび}の夜{よる}、電話{でんわ}をします。いつも母{はは}と30分{ぷん}ぐらい話{はな}します。',
        terjemahan: 'Keluarga saya ada di Indonesia. Setiap Minggu malam saya menelepon. Saya selalu berbicara dengan ibu kira-kira 30 menit.',
        soal: [
          { id: 'L1-40-1', tanya: 'いつ家族{かぞく}に電話{でんわ}をしますか。', tanyaId: 'Kapan menelepon keluarga?', opsi: ['土曜日{どようび}の夜{よる}', '日曜日{にちようび}の朝{あさ}', '日曜日{にちようび}の夜{よる}'], benar: 2, pembahasan: '毎週日曜日の夜、電話をします = setiap Minggu malam menelepon.' },
          { id: 'L1-40-2', tanya: 'いつもだれと話{はな}しますか。', tanyaId: 'Selalu berbicara dengan siapa?', opsi: ['父{ちち}', '母{はは}', '妹{いもうと}'], benar: 1, pembahasan: 'いつも母と30分ぐらい話します = selalu berbicara dengan ibu kira-kira 30 menit.' },
        ],
      },
      {
        id: 'L1-41',
        judul: '古{ふる}い自転車{じてんしゃ}',
        teks: '先週{せんしゅう}、自転車{じてんしゃ}を買{か}いました。古{ふる}い自転車{じてんしゃ}です。8000円{えん}でした。毎日{まいにち}自転車{じてんしゃ}でスーパーへ行{い}きます。',
        terjemahan: 'Minggu lalu saya membeli sepeda. Itu sepeda tua. Harganya 8.000 yen. Setiap hari saya pergi ke supermarket naik sepeda.',
        soal: [
          { id: 'L1-41-1', tanya: '自転車{じてんしゃ}はいくらでしたか。', tanyaId: 'Berapa harga sepedanya?', opsi: ['3000円{えん}', '6000円{えん}', '8000円{えん}'], benar: 2, pembahasan: '8000円でした = harganya 8.000 yen.' },
          { id: 'L1-41-2', tanya: '毎日{まいにち}自転車{じてんしゃ}でどこへ行{い}きますか。', tanyaId: 'Setiap hari pergi ke mana naik sepeda?', opsi: ['スーパー', '会社{かいしゃ}', '駅{えき}'], benar: 0, pembahasan: '毎日自転車でスーパーへ行きます = setiap hari pergi ke supermarket naik sepeda.' },
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
        teks: '寮{りょう}から駅{えき}まで歩{ある}いて15分{ふん}です。自転車{じてんしゃ}で5分{ふん}です。わたしはいつも歩{ある}いて行{い}きます。',
        terjemahan: 'Dari asrama ke stasiun 15 menit berjalan kaki. Naik sepeda 5 menit. Saya selalu pergi dengan berjalan kaki.',
        soal: [
          { id: 'L1-43-1', tanya: '駅{えき}まで自転車{じてんしゃ}で何分{なんぷん}ですか。', tanyaId: 'Berapa menit ke stasiun naik sepeda?', opsi: ['5分{ふん}', '10分{ぷん}', '15分{ふん}'], benar: 0, pembahasan: '自転車で5分です = naik sepeda 5 menit.' },
          { id: 'L1-43-2', tanya: 'いつもどうやって駅{えき}へ行{い}きますか。', tanyaId: 'Selalu pergi ke stasiun dengan cara apa?', opsi: ['バスで行{い}きます', '自転車{じてんしゃ}で行{い}きます', '歩{ある}いて行{い}きます'], benar: 2, pembahasan: 'わたしはいつも歩いて行きます = saya selalu pergi dengan berjalan kaki.' },
        ],
      },
      {
        id: 'L1-44',
        judul: '日本{にほん}へ来{き}ました',
        teks: 'わたしは去年{きょねん}の4月{がつ}に日本{にほん}へ来{き}ました。今{いま}、会社{かいしゃ}で働{はたら}いています。仕事{しごと}は大変{たいへん}ですが、楽{たの}しいです。',
        terjemahan: 'Saya datang ke Jepang pada bulan April tahun lalu. Sekarang saya bekerja di perusahaan. Pekerjaannya berat, tetapi menyenangkan.',
        soal: [
          { id: 'L1-44-1', tanya: 'いつ日本{にほん}へ来{き}ましたか。', tanyaId: 'Kapan datang ke Jepang?', opsi: ['今年{ことし}の4月{がつ}', '去年{きょねん}の4月{がつ}', '去年{きょねん}の7月{がつ}'], benar: 1, pembahasan: 'わたしは去年の4月に日本へ来ました = saya datang ke Jepang pada bulan April tahun lalu.' },
          { id: 'L1-44-2', tanya: '仕事{しごと}はどうですか。', tanyaId: 'Bagaimana pekerjaannya?', opsi: ['大変{たいへん}ですが、楽{たの}しいです', '大変{たいへん}で、楽{たの}しくないです', 'かんたんで、楽{たの}しいです'], benar: 0, pembahasan: '仕事は大変ですが、楽しいです = pekerjaannya berat, tetapi menyenangkan.' },
        ],
      },
      {
        id: 'L1-45',
        judul: '夜{よる}の安{やす}い弁当{べんとう}',
        teks: '仕事{しごと}のあとで、スーパーへ行{い}きます。夜{よる}7時{じ}から弁当{べんとう}が安{やす}いです。わたしはよく魚{さかな}の弁当{べんとう}を買{か}います。',
        terjemahan: 'Sesudah bekerja, saya pergi ke supermarket. Mulai pukul 7 malam bento murah. Saya sering membeli bento ikan.',
        soal: [
          { id: 'L1-45-1', tanya: '弁当{べんとう}は何時{なんじ}から安{やす}いですか。', tanyaId: 'Bento murah mulai pukul berapa?', opsi: ['夜{よる}6時{じ}', '夜{よる}7時{じ}', '夜{よる}9時{じ}'], benar: 1, pembahasan: '夜7時から弁当が安いです = mulai pukul 7 malam bento murah.' },
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
        teks: 'きのう、わたしは学校{がっこう}のあとで図書館{としょかん}へ行{い}きました。本{ほん}を2冊{さつ}借{か}りました。図書館{としょかん}は午後{ごご}5時{じ}に閉{し}まります。',
        terjemahan: 'Kemarin, setelah sekolah saya pergi ke perpustakaan. Saya meminjam dua buku. Perpustakaan tutup pukul lima sore.',
        soal: [
          { id: 'L2-1-1', tanya: 'どこへ行{い}きましたか。', tanyaId: 'Ke mana tokoh pergi?', opsi: ['店{みせ}', '図書館{としょかん}', '病院{びょういん}'], benar: 1, pembahasan: '図書館へ行きました = pergi ke perpustakaan.' },
          { id: 'L2-1-2', tanya: '本{ほん}を何冊{なんさつ}借{か}りましたか。', tanyaId: 'Berapa buku yang dipinjam?', opsi: ['1冊{さつ}', '2冊{さつ}', '3冊{さつ}'], benar: 1, pembahasan: '本を2冊借りました = meminjam dua buku.' },
        ],
      },
      {
        id: 'L2-2',
        judul: '土曜日{どようび}の午後{ごご}',
        teks: '土曜日{どようび}の午後{ごご}2時{じ}に駅{えき}でミカさんに会{あ}います。わたしは1時{じ}50分{ぷん}に駅{えき}に着{つ}きます。ミカさんは電車{でんしゃ}で来{き}ます。',
        terjemahan: 'Hari Sabtu pukul dua siang saya bertemu Mika di stasiun. Saya tiba di stasiun pukul 1.50. Mika datang dengan kereta.',
        soal: [
          { id: 'L2-2-1', tanya: 'どこでミカさんに会{あ}いますか。', tanyaId: 'Di mana tokoh bertemu Mika?', opsi: ['学校{がっこう}', '駅{えき}', '公園{こうえん}'], benar: 1, pembahasan: '駅でミカさんに会います = bertemu Mika di stasiun.' },
          { id: 'L2-2-2', tanya: 'ミカさんは何{なん}で来{き}ますか。', tanyaId: 'Mika datang dengan apa?', opsi: ['バス', '自転車{じてんしゃ}', '電車{でんしゃ}'], benar: 2, pembahasan: '電車で来ます = datang dengan kereta.' },
        ],
      },
      {
        id: 'L2-3',
        judul: '買{か}い物{もの}',
        teks: 'スーパーで牛乳{ぎゅうにゅう}とパンを買{か}いました。牛乳{ぎゅうにゅう}は150円{えん}で、パンは200円{えん}でした。全部{ぜんぶ}で350円{えん}でした。',
        terjemahan: 'Saya membeli susu dan roti di supermarket. Susu seharga 150 yen dan roti 200 yen. Totalnya 350 yen.',
        soal: [
          { id: 'L2-3-1', tanya: '牛乳{ぎゅうにゅう}はいくらでしたか。', tanyaId: 'Berapa harga susu?', opsi: ['150円{えん}', '200円{えん}', '350円{えん}'], benar: 0, pembahasan: '牛乳は150円 = susu 150 yen.' },
          { id: 'L2-3-2', tanya: '全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Berapa total harganya?', opsi: ['300円{えん}', '350円{えん}', '400円{えん}'], benar: 1, pembahasan: '全部で350円 = totalnya 350 yen (150 + 200).' },
        ],
      },
      {
        id: 'L2-4',
        judul: 'きのうの夜{よる}',
        teks: 'きのうの夜{よる}、わたしは7時{じ}に家{いえ}へ帰{かえ}りました。それから、晩{ばん}ごはんを食{た}べて、おふろに入{はい}りました。11時{じ}に寝{ね}ました。',
        terjemahan: 'Kemarin malam saya pulang ke rumah pukul tujuh. Setelah itu saya makan malam dan mandi berendam. Saya tidur pukul sebelas.',
        soal: [
          { id: 'L2-4-1', tanya: '何時{なんじ}に家{いえ}へ帰{かえ}りましたか。', tanyaId: 'Pukul berapa tokoh pulang ke rumah?', opsi: ['6時{じ}', '7時{じ}', '11時{じ}'], benar: 1, pembahasan: '7時に家へ帰りました = pulang pukul tujuh.' },
          { id: 'L2-4-2', tanya: '晩{ばん}ごはんのあとで、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan setelah makan malam?', opsi: ['寝{ね}ました', 'おふろに入{はい}りました', 'テレビを見{み}ました'], benar: 1, pembahasan: '晩ごはんを食べて、おふろに入りました = makan malam, lalu mandi berendam.' },
        ],
      },
      {
        id: 'L2-5',
        judul: 'デパートで',
        teks: '先週{せんしゅう}の土曜日{どようび}、母{はは}とデパートへ行{い}きました。わたしは青{あお}いシャツを買{か}いました。シャツは3000円{えん}でした。母{はは}はくつを買{か}いました。',
        terjemahan: 'Sabtu minggu lalu saya pergi ke department store bersama ibu. Saya membeli kemeja biru. Kemeja itu harganya 3.000 yen. Ibu membeli sepatu.',
        soal: [
          { id: 'L2-5-1', tanya: 'わたしは何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli penulis?', opsi: ['青{あお}いシャツ', 'くつ', '青{あお}いかばん'], benar: 0, pembahasan: '青いシャツを買いました = membeli kemeja biru.' },
          { id: 'L2-5-2', tanya: 'シャツはいくらでしたか。', tanyaId: 'Berapa harga kemejanya?', opsi: ['300円{えん}', '3000円{えん}', '3万円{まんえん}'], benar: 1, pembahasan: '3000円 = 3.000 yen.' },
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
        teks: 'きのう、郵便局{ゆうびんきょく}へ行{い}って、手紙{てがみ}を出{だ}しました。切手{きって}を5枚{まい}買{か}いました。郵便局{ゆうびんきょく}は銀行{ぎんこう}のとなりにあります。',
        terjemahan: 'Kemarin saya pergi ke kantor pos dan mengirim surat. Saya membeli lima prangko. Kantor pos ada di sebelah bank.',
        soal: [
          { id: 'L2-7-1', tanya: '切手{きって}を何枚{なんまい}買{か}いましたか。', tanyaId: 'Berapa lembar prangko yang dibeli?', opsi: ['3枚{まい}', '5枚{まい}', '10枚{まい}'], benar: 1, pembahasan: '切手を5枚買いました = membeli lima prangko.' },
          { id: 'L2-7-2', tanya: '郵便局{ゆうびんきょく}はどこにありますか。', tanyaId: 'Di mana kantor pos?', opsi: ['銀行{ぎんこう}のとなり', '駅{えき}の前{まえ}', '学校{がっこう}のうしろ'], benar: 0, pembahasan: '銀行のとなりにあります = ada di sebelah bank.' },
        ],
      },
      {
        id: 'L2-8',
        judul: '食堂{しょくどう}で',
        teks: '昼{ひる}ごはんは学校{がっこう}の食堂{しょくどう}で食{た}べました。わたしはカレーを食{た}べました。カレーは400円{えん}で、とてもおいしかったです。',
        terjemahan: 'Saya makan siang di kantin sekolah. Saya makan kari. Karinya 400 yen dan sangat enak.',
        soal: [
          { id: 'L2-8-1', tanya: 'どこで昼{ひる}ごはんを食{た}べましたか。', tanyaId: 'Di mana tokoh makan siang?', opsi: ['家{いえ}', '学校{がっこう}の食堂{しょくどう}', '駅{えき}の近{ちか}くのレストラン'], benar: 1, pembahasan: '学校の食堂で食べました = makan di kantin sekolah.' },
          { id: 'L2-8-2', tanya: 'カレーはいくらでしたか。', tanyaId: 'Berapa harga karinya?', opsi: ['400円{えん}', '500円{えん}', '600円{えん}'], benar: 0, pembahasan: '400円 = 400 yen.' },
        ],
      },
      {
        id: 'L2-9',
        judul: '自転車{じてんしゃ}で会社{かいしゃ}へ',
        teks: 'わたしは毎朝{まいあさ}、自転車{じてんしゃ}で会社{かいしゃ}へ行{い}きます。家{いえ}から会社{かいしゃ}まで20分{ぷん}ぐらいかかります。雨{あめ}の日{ひ}はバスに乗{の}ります。',
        terjemahan: 'Setiap pagi saya pergi ke kantor naik sepeda. Dari rumah ke kantor memakan waktu sekitar 20 menit. Pada hari hujan saya naik bus.',
        soal: [
          { id: 'L2-9-1', tanya: '家{いえ}から会社{かいしゃ}まで何分{なんぷん}ぐらいかかりますか。', tanyaId: 'Berapa lama dari rumah ke kantor?', opsi: ['10分{ぷん}ぐらい', '20分{ぷん}ぐらい', '30分{ぷん}ぐらい'], benar: 1, pembahasan: '20分ぐらいかかります = sekitar 20 menit.' },
          { id: 'L2-9-2', tanya: '雨{あめ}の日{ひ}は何{なに}で会社{かいしゃ}へ行{い}きますか。', tanyaId: 'Pada hari hujan naik apa ke kantor?', opsi: ['自転車{じてんしゃ}', 'バス', '電車{でんしゃ}'], benar: 1, pembahasan: '雨の日はバスに乗ります = pada hari hujan naik bus.' },
        ],
      },
      {
        id: 'L2-10',
        judul: '本屋{ほんや}で',
        teks: 'きのう、駅{えき}の近{ちか}くの本屋{ほんや}へ行{い}きました。日本語{にほんご}の辞書{じしょ}を買{か}いたかったですが、高{たか}かったですから、買{か}いませんでした。雑誌{ざっし}を1冊{さつ}買{か}いました。',
        terjemahan: 'Kemarin saya pergi ke toko buku dekat stasiun. Saya ingin membeli kamus bahasa Jepang, tetapi karena mahal, saya tidak membelinya. Saya membeli satu majalah.',
        soal: [
          { id: 'L2-10-1', tanya: 'どうして辞書{じしょ}を買{か}いませんでしたか。', tanyaId: 'Mengapa tokoh tidak membeli kamus?', opsi: ['高{たか}かったからです', '店{みせ}になかったからです', '店{みせ}が休{やす}みだったからです'], benar: 0, pembahasan: '高かったですから = karena mahal.' },
          { id: 'L2-10-2', tanya: '本屋{ほんや}で何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli di toko buku?', opsi: ['辞書{じしょ}', '雑誌{ざっし}を1冊{さつ}', '本{ほん}を2冊{さつ}'], benar: 1, pembahasan: '雑誌を1冊買いました = membeli satu majalah.' },
        ],
      },
      {
        id: 'L2-11',
        judul: 'コンビニで',
        teks: 'けさ、コンビニでおにぎりを二{ふた}つとお茶{ちゃ}を1本{ぽん}買{か}いました。おにぎりは一{ひと}つ120円{えん}でした。お茶{ちゃ}は150円{えん}でした。',
        terjemahan: 'Tadi pagi saya membeli dua onigiri dan sebotol teh di minimarket. Onigiri harganya 120 yen per buah. Tehnya 150 yen.',
        soal: [
          { id: 'L2-11-1', tanya: 'おにぎりをいくつ買{か}いましたか。', tanyaId: 'Berapa onigiri yang dibeli?', opsi: ['一{ひと}つ', '二{ふた}つ', '三{みっ}つ'], benar: 1, pembahasan: 'おにぎりを二つとお茶を1本買いました = membeli dua onigiri dan sebotol teh.' },
          { id: 'L2-11-2', tanya: 'お茶{ちゃ}はいくらでしたか。', tanyaId: 'Berapa harga tehnya?', opsi: ['150円{えん}', '120円{えん}', '240円{えん}'], benar: 0, pembahasan: 'お茶は150円でした = tehnya 150 yen.' },
        ],
      },
      {
        id: 'L2-12',
        judul: '会社{かいしゃ}まで',
        teks: 'わたしは毎朝{まいあさ}7時{じ}半{はん}にうちを出{で}ます。駅{えき}まで歩{ある}いて10分{ぷん}です。それから、電車{でんしゃ}に30分{ぷん}乗{の}ります。',
        terjemahan: 'Setiap pagi saya keluar rumah pukul setengah delapan. Ke stasiun 10 menit jalan kaki. Setelah itu saya naik kereta 30 menit.',
        soal: [
          { id: 'L2-12-1', tanya: '何時{なんじ}にうちを出{で}ますか。', tanyaId: 'Pukul berapa keluar rumah?', opsi: ['7時{じ}半{はん}', '7時{じ}', '8時{じ}'], benar: 0, pembahasan: '毎朝7時半にうちを出ます = setiap pagi keluar rumah pukul setengah delapan.' },
          { id: 'L2-12-2', tanya: '駅{えき}まで何{なに}で行{い}きますか。', tanyaId: 'Ke stasiun naik apa?', opsi: ['自転車{じてんしゃ}で行{い}きます', 'バスで行{い}きます', '歩{ある}いて行{い}きます'], benar: 2, pembahasan: '駅まで歩いて10分です = ke stasiun 10 menit jalan kaki.' },
        ],
      },
      {
        id: 'L2-13',
        judul: '駅{えき}の前{まえ}のパン屋{や}',
        teks: '駅{えき}の前{まえ}に小{ちい}さいパン屋{や}があります。朝{あさ}6時{じ}から夜{よる}8時{じ}まで開{あ}いています。わたしはいつもここでメロンパンを買{か}います。メロンパンは一{ひと}つ200円{えん}です。',
        terjemahan: 'Di depan stasiun ada toko roti kecil. Toko itu buka dari pukul 6 pagi sampai pukul 8 malam. Saya selalu membeli roti melon di sini. Roti melon harganya 200 yen per buah.',
        soal: [
          { id: 'L2-13-1', tanya: 'パン屋{や}は何時{なんじ}に閉{し}まりますか。', tanyaId: 'Pukul berapa toko roti tutup?', opsi: ['6時{じ}', '7時{じ}', '8時{じ}'], benar: 2, pembahasan: '朝6時から夜8時まで開いています = buka dari pukul 6 pagi sampai pukul 8 malam.' },
          { id: 'L2-13-2', tanya: 'メロンパンはいくらですか。', tanyaId: 'Berapa harga roti melon?', opsi: ['100円{えん}', '200円{えん}', '600円{えん}'], benar: 1, pembahasan: 'メロンパンは一つ200円です = roti melon 200 yen per buah.' },
        ],
      },
      {
        id: 'L2-14',
        judul: '友{とも}だちと買{か}い物{もの}',
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
        teks: '母{はは}は毎週{まいしゅう}水曜日{すいようび}に病院{びょういん}へ行{い}きます。うちの前{まえ}から11番{ばん}のバスに乗{の}ります。病院{びょういん}まで25分{ふん}ぐらいかかります。',
        terjemahan: 'Setiap hari Rabu ibu pergi ke rumah sakit. Ia naik bus nomor 11 dari depan rumah. Ke rumah sakit perlu sekitar 25 menit.',
        soal: [
          { id: 'L2-15-1', tanya: 'お母{かあ}さんは何曜日{なんようび}に病院{びょういん}へ行{い}きますか。', tanyaId: 'Hari apa ibu pergi ke rumah sakit?', opsi: ['水曜日{すいようび}', '月曜日{げつようび}', '金曜日{きんようび}'], benar: 0, pembahasan: '母は毎週水曜日に病院へ行きます = setiap hari Rabu ibu pergi ke rumah sakit.' },
          { id: 'L2-15-2', tanya: '何番{なんばん}のバスに乗{の}りますか。', tanyaId: 'Naik bus nomor berapa?', opsi: ['一番{いちばん}', '10番{ばん}', '11番{ばん}'], benar: 2, pembahasan: '11番のバスに乗ります = naik bus nomor 11.' },
        ],
      },
      {
        id: 'L2-16',
        judul: '銀行{ぎんこう}で',
        teks: 'きのう、銀行{ぎんこう}へ行{い}きました。国{くに}の家族{かぞく}にお金{かね}を送{おく}りました。銀行{ぎんこう}は午後{ごご}3時{じ}に閉{し}まりますから、昼休{ひるやす}みに行{い}きました。',
        terjemahan: 'Kemarin saya pergi ke bank. Saya mengirim uang kepada keluarga di negara asal. Bank tutup pukul 3 sore, jadi saya pergi saat istirahat siang.',
        soal: [
          { id: 'L2-16-1', tanya: '銀行{ぎんこう}で何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan di bank?', opsi: ['お金{かね}を送{おく}りました', 'お金{かね}をもらいました', '手紙{てがみ}を出{だ}しました'], benar: 0, pembahasan: '国の家族にお金を送りました = mengirim uang kepada keluarga di negara asal.' },
          { id: 'L2-16-2', tanya: 'どうして昼休{ひるやす}みに銀行{ぎんこう}へ行{い}きましたか。', tanyaId: 'Mengapa ia pergi ke bank saat istirahat siang?', opsi: ['昼休{ひるやす}みはひまだったからです', '銀行{ぎんこう}が3時{じ}に閉{し}まるからです', '家族{かぞく}に電話{でんわ}したからです'], benar: 1, pembahasan: '銀行は午後3時に閉まりますから、昼休みに行きました = bank tutup pukul 3 sore, jadi pergi saat istirahat siang.' },
        ],
      },
      {
        id: 'L2-17',
        judul: '八百屋{やおや}で',
        teks: '八百屋{やおや}でりんごを三{みっ}つとバナナを1ふさ買{か}いました。りんごは一{ひと}つ100円{えん}で、バナナは200円{えん}でした。全部{ぜんぶ}で500円{えん}でした。',
        terjemahan: 'Di toko sayur saya membeli tiga apel dan satu sisir pisang. Apel 100 yen per buah dan pisang 200 yen. Semuanya 500 yen.',
        soal: [
          { id: 'L2-17-1', tanya: 'りんごをいくつ買{か}いましたか。', tanyaId: 'Berapa apel yang dibeli?', opsi: ['二{ふた}つ', '三{みっ}つ', '五{いつ}つ'], benar: 1, pembahasan: 'りんごを三つ…買いました = membeli tiga apel.' },
          { id: 'L2-17-2', tanya: '全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Berapa totalnya?', opsi: ['300円{えん}', '400円{えん}', '500円{えん}'], benar: 2, pembahasan: '全部で500円でした = semuanya 500 yen.' },
        ],
      },
      {
        id: 'L2-18',
        judul: '兄{あに}の朝{あさ}',
        teks: '兄{あに}は毎朝{まいあさ}6時{じ}に起{お}きて、公園{こうえん}を走{はし}ります。1時間{じかん}ぐらい走{はし}ります。それから、シャワーをあびて、会社{かいしゃ}へ行{い}きます。',
        terjemahan: 'Setiap pagi kakak laki-laki saya bangun pukul enam dan berlari di taman. Ia berlari sekitar satu jam. Setelah itu ia mandi dan pergi ke kantor.',
        soal: [
          { id: 'L2-18-1', tanya: 'お兄{にい}さんは毎朝{まいあさ}どこを走{はし}りますか。', tanyaId: 'Di mana kakak berlari setiap pagi?', opsi: ['学校{がっこう}', '公園{こうえん}', '駅{えき}の前{まえ}'], benar: 1, pembahasan: '公園を走ります = berlari di taman.' },
          { id: 'L2-18-2', tanya: 'どのぐらい走{はし}りますか。', tanyaId: 'Berapa lama ia berlari?', opsi: ['1時間{じかん}ぐらい', '30分{ぷん}ぐらい', '2時間{じかん}ぐらい'], benar: 0, pembahasan: '1時間ぐらい走ります = berlari sekitar satu jam.' },
        ],
      },
      {
        id: 'L2-19',
        judul: '弟{おとうと}と映画{えいが}',
        teks: '土曜日{どようび}に弟{おとうと}と映画{えいが}を見{み}に行{い}きました。映画{えいが}は午後{ごご}1時{じ}から3時{じ}まででした。チケットは1枚{まい}1800円{えん}でした。',
        terjemahan: 'Hari Sabtu saya pergi menonton film bersama adik laki-laki. Filmnya dari pukul 1 sampai pukul 3 siang. Tiketnya 1.800 yen per lembar.',
        soal: [
          { id: 'L2-19-1', tanya: '映画{えいが}は何時{なんじ}に終{お}わりましたか。', tanyaId: 'Pukul berapa film selesai?', opsi: ['1時{じ}', '2時{じ}', '3時{じ}'], benar: 2, pembahasan: '映画は午後1時から3時まででした = film dari pukul 1 sampai pukul 3 siang.' },
          { id: 'L2-19-2', tanya: 'チケットは1枚{まい}いくらでしたか。', tanyaId: 'Berapa harga satu lembar tiket?', opsi: ['800円{えん}', '1800円{えん}', '3600円{えん}'], benar: 1, pembahasan: 'チケットは1枚1800円でした = tiket 1.800 yen per lembar.' },
        ],
      },
      {
        id: 'L2-20',
        judul: '寮{りょう}の食堂{しょくどう}',
        teks: 'わたしは会社{かいしゃ}の寮{りょう}に住{す}んでいます。寮{りょう}の食堂{しょくどう}の朝{あさ}ごはんは6時{じ}から9時{じ}までです。晩{ばん}ごはんは6時{じ}から8時{じ}までです。1回{かい}400円{えん}です。',
        terjemahan: 'Saya tinggal di asrama perusahaan. Sarapan di kantin asrama dari pukul 6 sampai pukul 9. Makan malam dari pukul 6 sampai pukul 8. Sekali makan 400 yen.',
        soal: [
          { id: 'L2-20-1', tanya: '食堂{しょくどう}の朝{あさ}ごはんは何時{なんじ}までですか。', tanyaId: 'Sarapan di kantin sampai pukul berapa?', opsi: ['6時{じ}', '8時{じ}', '9時{じ}'], benar: 2, pembahasan: '朝ごはんは6時から9時までです = sarapan dari pukul 6 sampai pukul 9.' },
          { id: 'L2-20-2', tanya: '1回{かい}いくらですか。', tanyaId: 'Berapa harga sekali makan?', opsi: ['400円{えん}', '600円{えん}', '800円{えん}'], benar: 0, pembahasan: '1回400円です = sekali makan 400 yen.' },
        ],
      },
      {
        id: 'L2-21',
        judul: '駅{えき}の前{まえ}のスーパー',
        teks: '駅{えき}の前{まえ}のスーパーは、午後{ごご}6時{じ}から肉{にく}と魚{さかな}が安{やす}くなります。わたしは仕事{しごと}のあとで行{い}きます。きのうはとり肉{にく}を300円{えん}で買{か}いました。',
        terjemahan: 'Di supermarket depan stasiun, daging dan ikan menjadi murah mulai pukul 6 sore. Saya pergi ke sana sesudah bekerja. Kemarin saya membeli daging ayam seharga 300 yen.',
        soal: [
          { id: 'L2-21-1', tanya: '肉{にく}と魚{さかな}は何時{なんじ}から安{やす}くなりますか。', tanyaId: 'Mulai pukul berapa daging dan ikan menjadi murah?', opsi: ['5時{じ}', '6時{じ}', '7時{じ}'], benar: 1, pembahasan: '午後6時から肉と魚が安くなります = daging dan ikan menjadi murah mulai pukul 6 sore.' },
          { id: 'L2-21-2', tanya: 'きのう何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli kemarin?', opsi: ['魚{さかな}', '野菜{やさい}', 'とり肉{にく}'], benar: 2, pembahasan: 'きのうはとり肉を300円で買いました = kemarin membeli daging ayam seharga 300 yen.' },
        ],
      },
      {
        id: 'L2-22',
        judul: '朝{あさ}の会社{かいしゃ}のバス',
        teks: 'わたしは毎朝{まいあさ}、会社{かいしゃ}のバスで仕事{しごと}に行{い}きます。バスは7時{じ}10分{ぷん}に寮{りょう}の前{まえ}を出{で}ます。会社{かいしゃ}まで20分{ぷん}かかります。',
        terjemahan: 'Setiap pagi saya pergi bekerja naik bus perusahaan. Bus berangkat dari depan asrama pukul 7.10. Ke kantor perlu 20 menit.',
        soal: [
          { id: 'L2-22-1', tanya: 'バスは何時{なんじ}に出{で}ますか。', tanyaId: 'Pukul berapa bus berangkat?', opsi: ['7時{じ}', '7時{じ}20分{ぷん}', '7時{じ}10分{ぷん}'], benar: 2, pembahasan: 'バスは7時10分に寮の前を出ます = bus berangkat dari depan asrama pukul 7.10.' },
          { id: 'L2-22-2', tanya: 'バスはどこから出{で}ますか。', tanyaId: 'Bus berangkat dari mana?', opsi: ['寮{りょう}の前{まえ}', '駅{えき}の前{まえ}', '会社{かいしゃ}の前{まえ}'], benar: 0, pembahasan: '寮の前を出ます = berangkat dari depan asrama.' },
        ],
      },
      {
        id: 'L2-23',
        judul: 'おばあさんのうち',
        teks: 'おばあさんのうちは海{うみ}の近{ちか}くにあります。わたしのうちから車{くるま}で2時間{じかん}かかります。夏休{なつやす}みに家族{かぞく}と行{い}って、海{うみ}で泳{およ}ぎました。',
        terjemahan: 'Rumah nenek ada di dekat laut. Dari rumah saya perlu dua jam naik mobil. Pada liburan musim panas saya pergi ke sana bersama keluarga dan berenang di laut.',
        soal: [
          { id: 'L2-23-1', tanya: 'おばあさんのうちまで車{くるま}でどのぐらいかかりますか。', tanyaId: 'Berapa lama perjalanan ke rumah nenek naik mobil?', opsi: ['1時間{じかん}', '2時間{じかん}', '3時間{じかん}'], benar: 1, pembahasan: 'わたしのうちから車で2時間かかります = dari rumah saya perlu dua jam naik mobil.' },
          { id: 'L2-23-2', tanya: 'おばあさんのうちはどこにありますか。', tanyaId: 'Di mana rumah nenek berada?', opsi: ['海{うみ}の近{ちか}く', '山{やま}の近{ちか}く', '駅{えき}の近{ちか}く'], benar: 0, pembahasan: 'おばあさんのうちは海の近くにあります = rumah nenek ada di dekat laut.' },
        ],
      },
      {
        id: 'L2-24',
        judul: '町{まち}のプール',
        teks: 'わたしは毎週{まいしゅう}火曜日{かようび}と金曜日{きんようび}に、町{まち}のプールで泳{およ}ぎます。プールは朝{あさ}8時{じ}から夜{よる}9時{じ}までです。駅{えき}のとなりにありますから、寮{りょう}から電車{でんしゃ}で行{い}きます。',
        terjemahan: 'Setiap hari Selasa dan Jumat saya berenang di kolam renang kota. Kolam renang itu buka dari pukul 8 pagi sampai pukul 9 malam. Kolam renang itu ada di sebelah stasiun, jadi saya pergi ke sana dari asrama naik kereta.',
        soal: [
          { id: 'L2-24-1', tanya: '何曜日{なんようび}にプールで泳{およ}ぎますか。', tanyaId: 'Hari apa tokoh berenang di kolam renang?', opsi: ['火曜日{かようび}と金曜日{きんようび}', '月曜日{げつようび}と木曜日{もくようび}', '火曜日{かようび}と土曜日{どようび}'], benar: 0, pembahasan: 'わたしは毎週火曜日と金曜日に、町のプールで泳ぎます = setiap hari Selasa dan Jumat saya berenang di kolam renang kota.' },
          { id: 'L2-24-2', tanya: 'プールはどこにありますか。', tanyaId: 'Di mana kolam renang itu berada?', opsi: ['寮{りょう}のとなり', '公園{こうえん}のとなり', '駅{えき}のとなり'], benar: 2, pembahasan: '駅のとなりにありますから、寮から電車で行きます = kolam renang itu ada di sebelah stasiun, jadi tokoh pergi ke sana dari asrama naik kereta.' },
        ],
      },
      {
        id: 'L2-25',
        judul: '寮{りょう}の近{ちか}くのコインランドリー',
        teks: '寮{りょう}の近{ちか}くにコインランドリーがあります。朝{あさ}6時{じ}から夜{よる}11時{じ}まで開{あ}いています。せんたくは1回{かい}300円{えん}で、40分{ぷん}かかります。',
        terjemahan: 'Di dekat asrama ada tempat cuci koin. Tempat itu buka dari pukul 6 pagi sampai pukul 11 malam. Mencuci sekali 300 yen dan perlu 40 menit.',
        soal: [
          { id: 'L2-25-1', tanya: 'コインランドリーは夜{よる}何時{なんじ}まで開{あ}いていますか。', tanyaId: 'Tempat cuci koin buka sampai pukul berapa malam?', opsi: ['9時{じ}', '10時{じ}', '11時{じ}'], benar: 2, pembahasan: '朝6時から夜11時まで開いています = buka dari pukul 6 pagi sampai pukul 11 malam.' },
          { id: 'L2-25-2', tanya: 'せんたくは何分{なんぷん}かかりますか。', tanyaId: 'Mencuci perlu berapa menit?', opsi: ['20分{ぷん}', '30分{ぷん}', '40分{ぷん}'], benar: 2, pembahasan: 'せんたくは1回300円で、40分かかります = mencuci sekali 300 yen dan perlu 40 menit.' },
        ],
      },
      {
        id: 'L2-26',
        judul: 'アグスさんの今週{こんしゅう}',
        teks: 'アグスさんは今週{こんしゅう}、夜{よる}に仕事{しごと}をします。夜{よる}10時{じ}から朝{あさ}6時{じ}まで会社{かいしゃ}で働{はたら}きます。午前{ごぜん}2時{じ}に1時間{じかん}休{やす}みます。仕事{しごと}のあとで、寮{りょう}へ帰{かえ}って寝{ね}ます。',
        terjemahan: 'Minggu ini Agus bekerja pada malam hari. Ia bekerja di perusahaan dari pukul 10 malam sampai pukul 6 pagi. Pukul 2 dini hari ia beristirahat satu jam. Sesudah bekerja ia pulang ke asrama dan tidur.',
        soal: [
          { id: 'L2-26-1', tanya: 'アグスさんの仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Pukul berapa pekerjaan Agus selesai?', opsi: ['朝{あさ}6時{じ}', '午前{ごぜん}2時{じ}', '夜{よる}10時{じ}'], benar: 0, pembahasan: '夜10時から朝6時まで会社で働きます = bekerja di perusahaan dari pukul 10 malam sampai pukul 6 pagi (jadi selesai pukul 6 pagi).' },
          { id: 'L2-26-2', tanya: 'アグスさんはどのぐらい休{やす}みますか。', tanyaId: 'Berapa lama Agus beristirahat?', opsi: ['30分{ぷん}', '1時間{じかん}', '2時間{じかん}'], benar: 1, pembahasan: '午前2時に1時間休みます = pukul 2 dini hari beristirahat satu jam.' },
        ],
      },
      {
        id: 'L2-27',
        judul: '国{くに}への荷物{にもつ}',
        teks: 'きのう、郵便局{ゆうびんきょく}からインドネシアの母{はは}に荷物{にもつ}を送{おく}りました。中{なか}はおかしと服{ふく}です。4000円{えん}かかりました。荷物{にもつ}は10日{とおか}ぐらいで着{つ}きます。',
        terjemahan: 'Kemarin saya mengirim paket dari kantor pos kepada ibu di Indonesia. Isinya kue dan pakaian. Biayanya 4.000 yen. Paket akan tiba dalam kira-kira sepuluh hari.',
        soal: [
          { id: 'L2-27-1', tanya: '荷物{にもつ}の中{なか}は何{なん}ですか。', tanyaId: 'Apa isi paket itu?', opsi: ['おかしと本{ほん}', '服{ふく}とくつ', 'おかしと服{ふく}'], benar: 2, pembahasan: '中はおかしと服です = isinya kue dan pakaian.' },
          { id: 'L2-27-2', tanya: '荷物{にもつ}は何日{なんにち}ぐらいで着{つ}きますか。', tanyaId: 'Paket tiba dalam kira-kira berapa hari?', opsi: ['10日{とおか}ぐらい', '4日{よっか}ぐらい', '7日{なのか}ぐらい'], benar: 0, pembahasan: '荷物は10日ぐらいで着きます = paket tiba dalam kira-kira sepuluh hari.' },
        ],
      },
      {
        id: 'L2-28',
        judul: '駅{えき}のビルの100円{えん}ショップ',
        teks: '駅{えき}のビルの2階{かい}に100円{えん}ショップがあります。きのう、ここでさらを3枚{まい}とコップを二{ふた}つ買{か}いました。さらもコップも一{ひと}つ110円{えん}です。全部{ぜんぶ}で550円{えん}でした。',
        terjemahan: 'Di lantai dua gedung stasiun ada toko serba seratus yen. Kemarin saya membeli tiga piring dan dua gelas di sini. Piring maupun gelas harganya 110 yen per buah. Semuanya 550 yen.',
        soal: [
          { id: 'L2-28-1', tanya: 'さらを何枚{なんまい}買{か}いましたか。', tanyaId: 'Berapa piring yang dibeli?', opsi: ['2枚{まい}', '3枚{まい}', '5枚{まい}'], benar: 1, pembahasan: 'さらを3枚とコップを二つ買いました = membeli tiga piring dan dua gelas.' },
          { id: 'L2-28-2', tanya: '100円{えん}ショップはどこにありますか。', tanyaId: 'Di mana toko serba seratus yen itu berada?', opsi: ['駅{えき}のビルの1階{かい}', '駅{えき}のビルの2階{かい}', '駅{えき}のビルの3階{がい}'], benar: 1, pembahasan: '駅のビルの2階に100円ショップがあります = di lantai dua gedung stasiun ada toko serba seratus yen.' },
        ],
      },
      {
        id: 'L2-29',
        judul: '公園{こうえん}のきっぷ',
        teks: '日曜日{にちようび}に母{はは}と妹{いもうと}と公園{こうえん}へ行{い}きました。きっぷは、母{はは}とわたしが600円{えん}、妹{いもうと}が200円{えん}でした。公園{こうえん}は午後{ごご}5時{じ}までですが、わたしたちは3時{じ}に帰{かえ}りました。',
        terjemahan: 'Hari Minggu saya pergi ke taman bersama ibu dan adik perempuan. Tiket untuk ibu dan saya 600 yen, dan untuk adik perempuan 200 yen. Taman itu buka sampai pukul 5 sore, tetapi kami pulang pukul 3.',
        soal: [
          { id: 'L2-29-1', tanya: '妹{いもうと}のきっぷはいくらでしたか。', tanyaId: 'Berapa harga tiket adik perempuan?', opsi: ['200円{えん}', '600円{えん}', '800円{えん}'], benar: 0, pembahasan: 'きっぷは、母とわたしが600円、妹が200円でした = tiket untuk ibu dan saya 600 yen, untuk adik perempuan 200 yen.' },
          { id: 'L2-29-2', tanya: '公園{こうえん}は何時{なんじ}までですか。', tanyaId: 'Taman itu buka sampai pukul berapa?', opsi: ['3時{じ}', '4時{じ}', '5時{じ}'], benar: 2, pembahasan: '公園は午後5時までですが、わたしたちは3時に帰りました = taman itu buka sampai pukul 5 sore, tetapi kami pulang pukul 3 (jadi pukul 3 adalah jam pulang, bukan jam tutup).' },
        ],
      },
      {
        id: 'L2-30',
        judul: '土曜日{どようび}の教室{きょうしつ}',
        teks: 'わたしは毎週{まいしゅう}土曜日{どようび}に日本語{にほんご}の教室{きょうしつ}へ行{い}きます。教室{きょうしつ}は駅{えき}の近{ちか}くのビルの3階{がい}にあります。午前{ごぜん}10時{じ}から12時{じ}まで勉強{べんきょう}します。',
        terjemahan: 'Setiap hari Sabtu saya pergi ke kelas bahasa Jepang. Kelasnya ada di lantai tiga gedung dekat stasiun. Saya belajar dari pukul 10 pagi sampai pukul 12.',
        soal: [
          { id: 'L2-30-1', tanya: '教室{きょうしつ}は何階{なんがい}にありますか。', tanyaId: 'Kelasnya ada di lantai berapa?', opsi: ['2階{かい}', '3階{がい}', '4階{かい}'], benar: 1, pembahasan: '教室は駅の近くのビルの3階にあります = kelasnya ada di lantai tiga gedung dekat stasiun.' },
          { id: 'L2-30-2', tanya: '何時{なんじ}まで勉強{べんきょう}しますか。', tanyaId: 'Belajar sampai pukul berapa?', opsi: ['10時{じ}', '11時{じ}', '12時{じ}'], benar: 2, pembahasan: '午前10時から12時まで勉強します = belajar dari pukul 10 pagi sampai pukul 12.' },
        ],
      },
      {
        id: 'L2-31',
        judul: '2階{かい}の部屋{へや}',
        teks: 'わたしの部屋{へや}は寮{りょう}の2階{かい}にあります。となりの部屋{へや}にベトナム人{じん}のアンさんが住{す}んでいます。おふろとせんたくきは1階{かい}にあります。',
        terjemahan: 'Kamar saya ada di lantai dua asrama. Di kamar sebelah tinggal An, orang Vietnam. Kamar mandi dan mesin cuci ada di lantai satu.',
        soal: [
          { id: 'L2-31-1', tanya: 'おふろは何階{なんがい}にありますか。', tanyaId: 'Kamar mandi ada di lantai berapa?', opsi: ['1階{かい}', '2階{かい}', '3階{がい}'], benar: 0, pembahasan: 'おふろとせんたくきは1階にあります = kamar mandi dan mesin cuci ada di lantai satu.' },
          { id: 'L2-31-2', tanya: 'アンさんはどこの国{くに}の人{ひと}ですか。', tanyaId: 'An orang dari negara mana?', opsi: ['インドネシア', '日本{にほん}', 'ベトナム'], benar: 2, pembahasan: 'となりの部屋にベトナム人のアンさんが住んでいます = di kamar sebelah tinggal An, orang Vietnam.' },
        ],
      },
      {
        id: 'L2-32',
        judul: '会社{かいしゃ}の朝{あさ}',
        teks: 'わたしは毎朝{まいあさ}8時{じ}に会社{かいしゃ}に着{つ}きます。8時{じ}20分{ぷん}から10分{ぷん}、みんなで部長{ぶちょう}の話{はなし}を聞{き}きます。仕事{しごと}は8時{じ}半{はん}に始{はじ}まります。',
        terjemahan: 'Setiap pagi saya tiba di kantor pukul 8. Mulai pukul 8.20, selama 10 menit kami semua mendengarkan pembicaraan kepala bagian. Pekerjaan mulai pukul setengah sembilan.',
        soal: [
          { id: 'L2-32-1', tanya: '仕事{しごと}は何時{なんじ}に始{はじ}まりますか。', tanyaId: 'Pukul berapa pekerjaan mulai?', opsi: ['8時{じ}', '8時{じ}20分{ぷん}', '8時{じ}半{はん}'], benar: 2, pembahasan: '仕事は8時半に始まります = pekerjaan mulai pukul setengah sembilan.' },
          { id: 'L2-32-2', tanya: '部長{ぶちょう}の話{はなし}はどのぐらいですか。', tanyaId: 'Berapa lama pembicaraan kepala bagian?', opsi: ['5分{ふん}', '10分{ぷん}', '20分{ぷん}'], benar: 1, pembahasan: '8時20分から10分、みんなで部長の話を聞きます = mulai pukul 8.20, selama 10 menit semua mendengarkan pembicaraan kepala bagian (20 adalah menit jam mulainya, bukan lamanya).' },
        ],
      },
      {
        id: 'L2-33',
        judul: '妹{いもうと}のピアノ',
        teks: '妹{いもうと}は毎週{まいしゅう}月曜日{げつようび}と木曜日{もくようび}にピアノを習{なら}っています。午後{ごご}4時{じ}から1時間{じかん}です。先生{せんせい}のうちは学校{がっこう}のとなりにあります。',
        terjemahan: 'Adik perempuan saya belajar piano setiap hari Senin dan Kamis. Lesnya satu jam mulai pukul 4 sore. Rumah gurunya ada di sebelah sekolah.',
        soal: [
          { id: 'L2-33-1', tanya: 'ピアノは午後{ごご}何時{なんじ}からですか。', tanyaId: 'Les piano mulai pukul berapa sore?', opsi: ['4時{じ}', '5時{じ}', '6時{じ}'], benar: 0, pembahasan: '午後4時から1時間です = satu jam mulai pukul 4 sore.' },
          { id: 'L2-33-2', tanya: '先生{せんせい}のうちはどこにありますか。', tanyaId: 'Di mana rumah guru berada?', opsi: ['学校{がっこう}のとなり', '駅{えき}のとなり', '公園{こうえん}のとなり'], benar: 0, pembahasan: '先生のうちは学校のとなりにあります = rumah guru ada di sebelah sekolah.' },
        ],
      },
      {
        id: 'L2-34',
        judul: '新{あたら}しい自転車{じてんしゃ}',
        teks: '先週{せんしゅう}、駅{えき}の近{ちか}くの店{みせ}で自転車{じてんしゃ}を買{か}いました。12000円{えん}でした。会社{かいしゃ}まで歩{ある}いて40分{ぷん}ですが、自転車{じてんしゃ}で15分{ふん}です。',
        terjemahan: 'Minggu lalu saya membeli sepeda di toko dekat stasiun. Harganya 12.000 yen. Ke kantor 40 menit jalan kaki, tetapi 15 menit naik sepeda.',
        soal: [
          { id: 'L2-34-1', tanya: '自転車{じてんしゃ}はいくらでしたか。', tanyaId: 'Berapa harga sepedanya?', opsi: ['10000円{えん}', '12000円{えん}', '20000円{えん}'], benar: 1, pembahasan: '12000円でした = harganya 12.000 yen.' },
          { id: 'L2-34-2', tanya: '会社{かいしゃ}まで自転車{じてんしゃ}で何分{なんぷん}ですか。', tanyaId: 'Ke kantor berapa menit naik sepeda?', opsi: ['15分{ふん}', '25分{ふん}', '40分{ぷん}'], benar: 0, pembahasan: '会社まで歩いて40分ですが、自転車で15分です = ke kantor 40 menit jalan kaki, tetapi 15 menit naik sepeda.' },
        ],
      },
      {
        id: 'L2-35',
        judul: 'となりの町{まち}へ',
        teks: 'ブディさんは休{やす}みの日{ひ}に、電車{でんしゃ}でとなりの町{まち}へ行{い}きます。きっぷは320円{えん}です。電車{でんしゃ}は1時間{じかん}に2本{ほん}あります。となりの町{まち}まで20分{ぷん}です。',
        terjemahan: 'Pada hari libur Budi pergi ke kota sebelah naik kereta. Tiketnya 320 yen. Keretanya ada dua kali dalam satu jam. Ke kota sebelah 20 menit.',
        soal: [
          { id: 'L2-35-1', tanya: 'きっぷはいくらですか。', tanyaId: 'Berapa harga tiketnya?', opsi: ['230円{えん}', '300円{えん}', '320円{えん}'], benar: 2, pembahasan: 'きっぷは320円です = tiketnya 320 yen.' },
          { id: 'L2-35-2', tanya: '電車{でんしゃ}は1時間{じかん}に何本{なんぼん}ありますか。', tanyaId: 'Dalam satu jam ada berapa kereta?', opsi: ['1本{ぽん}', '2本{ほん}', '3本{ぼん}'], benar: 1, pembahasan: '電車は1時間に2本あります = keretanya ada dua kali dalam satu jam.' },
        ],
      },
      {
        id: 'L2-36',
        judul: 'かみを切{き}りました',
        teks: 'きのう、駅{えき}の前{まえ}の店{みせ}でかみを切{き}りました。1200円{えん}でした。店{みせ}は朝{あさ}9時{じ}から夜{よる}7時{じ}までです。月曜日{げつようび}は休{やす}みです。',
        terjemahan: 'Kemarin saya potong rambut di toko di depan stasiun. Harganya 1.200 yen. Toko itu buka dari pukul 9 pagi sampai pukul 7 malam. Hari Senin libur.',
        soal: [
          { id: 'L2-36-1', tanya: '店{みせ}はどこにありますか。', tanyaId: 'Di mana toko itu berada?', opsi: ['駅{えき}の前{まえ}', '銀行{ぎんこう}のとなり', '寮{りょう}の近{ちか}く'], benar: 0, pembahasan: '駅の前の店でかみを切りました = potong rambut di toko di depan stasiun.' },
          { id: 'L2-36-2', tanya: '店{みせ}の休{やす}みは何曜日{なんようび}ですか。', tanyaId: 'Hari apa toko itu libur?', opsi: ['土曜日{どようび}', '日曜日{にちようび}', '月曜日{げつようび}'], benar: 2, pembahasan: '月曜日は休みです = hari Senin libur.' },
        ],
      },
      {
        id: 'L2-37',
        judul: '広{ひろ}い公園{こうえん}',
        teks: '川{かわ}のそばに広{ひろ}い公園{こうえん}があります。うちから歩{ある}いて5分{ふん}です。わたしは毎週{まいしゅう}日曜日{にちようび}の朝{あさ}、ここで友{とも}だちとサッカーをします。',
        terjemahan: 'Di tepi sungai ada taman yang luas. Dari rumah 5 menit jalan kaki. Setiap Minggu pagi saya bermain sepak bola di sini bersama teman.',
        soal: [
          { id: 'L2-37-1', tanya: '公園{こうえん}はどこにありますか。', tanyaId: 'Di mana taman itu berada?', opsi: ['駅{えき}のそば', '川{かわ}のそば', '学校{がっこう}のそば'], benar: 1, pembahasan: '川のそばに広い公園があります = di tepi sungai ada taman yang luas.' },
          { id: 'L2-37-2', tanya: 'いつサッカーをしますか。', tanyaId: 'Kapan bermain sepak bola?', opsi: ['土曜日{どようび}の朝{あさ}', '日曜日{にちようび}の午後{ごご}', '日曜日{にちようび}の朝{あさ}'], benar: 2, pembahasan: '毎週日曜日の朝、ここで友だちとサッカーをします = setiap Minggu pagi bermain sepak bola di sini bersama teman.' },
        ],
      },
      {
        id: 'L2-38',
        judul: '白{しろ}い薬{くすり}と赤{あか}い薬{くすり}',
        teks: '病院{びょういん}で薬{くすり}を二{ふた}つもらいました。白{しろ}い薬{くすり}は一日{いちにち}に3回{かい}、ごはんのあとで飲{の}みます。赤{あか}い薬{くすり}は夜{よる}、寝{ね}るまえに1回{かい}飲{の}みます。',
        terjemahan: 'Di rumah sakit saya mendapat dua obat. Obat putih diminum tiga kali sehari sesudah makan. Obat merah diminum satu kali pada malam hari sebelum tidur.',
        soal: [
          { id: 'L2-38-1', tanya: '白{しろ}い薬{くすり}は一日{いちにち}に何回{なんかい}飲{の}みますか。', tanyaId: 'Obat putih diminum berapa kali sehari?', opsi: ['1回{かい}', '2回{かい}', '3回{かい}'], benar: 2, pembahasan: '白い薬は一日に3回、ごはんのあとで飲みます = obat putih diminum tiga kali sehari sesudah makan.' },
          { id: 'L2-38-2', tanya: '赤{あか}い薬{くすり}はいつ飲{の}みますか。', tanyaId: 'Kapan obat merah diminum?', opsi: ['寝{ね}るまえ', 'ごはんのまえ', 'ごはんのあと'], benar: 0, pembahasan: '赤い薬は夜、寝るまえに1回飲みます = obat merah diminum satu kali pada malam hari sebelum tidur.' },
        ],
      },
      {
        id: 'L2-39',
        judul: '日曜日{にちようび}の電話{でんわ}',
        teks: 'わたしは毎週{まいしゅう}日曜日{にちようび}の夜{よる}9時{じ}に、国{くに}の母{はは}に電話{でんわ}をかけます。日本{にほん}の9時{じ}はインドネシアの7時{じ}です。いつも30分{ぷん}ぐらい話{はな}します。',
        terjemahan: 'Setiap hari Minggu pukul 9 malam saya menelepon ibu di negara asal. Pukul 9 di Jepang adalah pukul 7 di Indonesia. Kami selalu berbicara sekitar 30 menit.',
        soal: [
          { id: 'L2-39-1', tanya: 'わたしは何時{なんじ}に電話{でんわ}をかけますか。', tanyaId: 'Pukul berapa penulis menelepon?', opsi: ['夜{よる}9時{じ}', '夜{よる}8時{じ}', '夜{よる}10時{じ}'], benar: 0, pembahasan: '毎週日曜日の夜9時に、国の母に電話をかけます = setiap hari Minggu pukul 9 malam menelepon ibu di negara asal.' },
          { id: 'L2-39-2', tanya: 'お母{かあ}さんとどのぐらい話{はな}しますか。', tanyaId: 'Berapa lama berbicara dengan ibu?', opsi: ['10分{ぷん}ぐらい', '30分{ぷん}ぐらい', '1時間{じかん}ぐらい'], benar: 1, pembahasan: 'いつも30分ぐらい話します = selalu berbicara sekitar 30 menit.' },
        ],
      },
      {
        id: 'L2-40',
        judul: '土曜日{どようび}の朝{あさ}のそうじ',
        teks: '寮{りょう}では毎週{まいしゅう}土曜日{どようび}の朝{あさ}8時{じ}からそうじをします。わたしは食堂{しょくどう}をそうじします。リオさんはトイレをそうじします。20分{ぷん}ぐらいで終{お}わります。',
        terjemahan: 'Di asrama kami bersih-bersih setiap hari Sabtu mulai pukul 8 pagi. Saya membersihkan ruang makan. Rio membersihkan toilet. Selesai dalam kira-kira 20 menit.',
        soal: [
          { id: 'L2-40-1', tanya: 'リオさんはどこをそうじしますか。', tanyaId: 'Rio membersihkan bagian mana?', opsi: ['食堂{しょくどう}', 'トイレ', 'おふろ'], benar: 1, pembahasan: 'リオさんはトイレをそうじします = Rio membersihkan toilet.' },
          { id: 'L2-40-2', tanya: 'そうじは朝{あさ}何時{なんじ}からですか。', tanyaId: 'Bersih-bersih mulai pukul berapa pagi?', opsi: ['8時{じ}', '9時{じ}', '10時{じ}'], benar: 0, pembahasan: '毎週土曜日の朝8時からそうじをします = bersih-bersih setiap hari Sabtu mulai pukul 8 pagi.' },
        ],
      },
      {
        id: 'L2-41',
        judul: 'インドネシアの食{た}べ物{もの}の店{みせ}',
        teks: '大{おお}きい駅{えき}の近{ちか}くにインドネシアの食{た}べ物{もの}の店{みせ}があります。寮{りょう}から電車{でんしゃ}で30分{ぷん}かかります。わたしは月{つき}に1回{かい}行{い}って、サンバルやおかしを買{か}います。',
        terjemahan: 'Di dekat stasiun besar ada toko makanan Indonesia. Dari asrama perlu 30 menit naik kereta. Saya pergi ke sana sebulan sekali dan membeli sambal, kue, dan lain-lain.',
        soal: [
          { id: 'L2-41-1', tanya: 'インドネシアの食{た}べ物{もの}の店{みせ}はどこにありますか。', tanyaId: 'Di mana toko makanan Indonesia itu berada?', opsi: ['寮{りょう}の近{ちか}く', '会社{かいしゃ}の近{ちか}く', '大{おお}きい駅{えき}の近{ちか}く'], benar: 2, pembahasan: '大きい駅の近くにインドネシアの食べ物の店があります = di dekat stasiun besar ada toko makanan Indonesia.' },
          { id: 'L2-41-2', tanya: '寮{りょう}から店{みせ}まで電車{でんしゃ}でどのぐらいかかりますか。', tanyaId: 'Berapa lama perjalanan dari asrama ke toko naik kereta?', opsi: ['20分{ぷん}', '30分{ぷん}', '1時間{じかん}'], benar: 1, pembahasan: '寮から電車で30分かかります = dari asrama perlu 30 menit naik kereta.' },
        ],
      },
      {
        id: 'L2-42',
        judul: '8月{がつ}のおまつり',
        teks: '8月{がつ}10日{とおか}に、公園{こうえん}で町{まち}のおまつりがありました。午後{ごご}6時{じ}から9時{じ}まででした。わたしは会社{かいしゃ}の田中{たなか}さんと行{い}って、やきそばを食{た}べました。',
        terjemahan: 'Pada tanggal 10 Agustus ada festival kota di taman. Acaranya dari pukul 6 sore sampai pukul 9 malam. Saya pergi bersama Tanaka dari perusahaan dan makan yakisoba.',
        soal: [
          { id: 'L2-42-1', tanya: 'おまつりはいつでしたか。', tanyaId: 'Kapan festival itu diadakan?', opsi: ['8月{がつ}8日{ようか}', '8月{がつ}10日{とおか}', '8月{がつ}20日{はつか}'], benar: 1, pembahasan: '8月10日に、公園で町のおまつりがありました = pada tanggal 10 Agustus ada festival kota di taman.' },
          { id: 'L2-42-2', tanya: 'だれとおまつりへ行{い}きましたか。', tanyaId: 'Pergi ke festival bersama siapa?', opsi: ['会社{かいしゃ}の田中{たなか}さん', '会社{かいしゃ}の山田{やまだ}さん', '寮{りょう}の田中{たなか}さん'], benar: 0, pembahasan: 'わたしは会社の田中さんと行って、やきそばを食べました = saya pergi bersama Tanaka dari perusahaan dan makan yakisoba.' },
        ],
      },
      {
        id: 'L2-43',
        judul: '喫茶店{きっさてん}のコーヒー',
        teks: '銀行{ぎんこう}のとなりに古{ふる}い喫茶店{きっさてん}があります。コーヒーは400円{えん}で、ケーキは350円{えん}です。わたしは土曜日{どようび}の午後{ごご}、ここで本{ほん}を読{よ}みます。',
        terjemahan: 'Di sebelah bank ada kedai kopi tua. Kopinya 400 yen dan kuenya 350 yen. Pada Sabtu siang saya membaca buku di sini.',
        soal: [
          { id: 'L2-43-1', tanya: '喫茶店{きっさてん}はどこにありますか。', tanyaId: 'Di mana kedai kopi itu berada?', opsi: ['銀行{ぎんこう}のとなり', '銀行{ぎんこう}の前{まえ}', '本屋{ほんや}のとなり'], benar: 0, pembahasan: '銀行のとなりに古い喫茶店があります = di sebelah bank ada kedai kopi tua.' },
          { id: 'L2-43-2', tanya: 'ケーキはいくらですか。', tanyaId: 'Berapa harga kuenya?', opsi: ['300円{えん}', '400円{えん}', '350円{えん}'], benar: 2, pembahasan: 'コーヒーは400円で、ケーキは350円です = kopinya 400 yen dan kuenya 350 yen.' },
        ],
      },
      {
        id: 'L2-44',
        judul: 'リナさんの休{やす}みの日{ひ}',
        teks: 'リナさんは休{やす}みの日{ひ}、9時{じ}に起{お}きます。朝{あさ}ごはんを食{た}べてから、せんたくをします。11時{じ}ごろ、自転車{じてんしゃ}でスーパーへ行{い}きます。',
        terjemahan: 'Pada hari libur Rina bangun pukul 9. Sesudah sarapan ia mencuci pakaian. Sekitar pukul 11 ia pergi ke supermarket naik sepeda.',
        soal: [
          { id: 'L2-44-1', tanya: 'リナさんは休{やす}みの日{ひ}、何時{なんじ}に起{お}きますか。', tanyaId: 'Pada hari libur Rina bangun pukul berapa?', opsi: ['7時{じ}', '11時{じ}', '9時{じ}'], benar: 2, pembahasan: 'リナさんは休みの日、9時に起きます = pada hari libur Rina bangun pukul 9.' },
          { id: 'L2-44-2', tanya: 'リナさんは何{なに}でスーパーへ行{い}きますか。', tanyaId: 'Rina pergi ke supermarket naik apa?', opsi: ['バスで行{い}きます', '自転車{じてんしゃ}で行{い}きます', '歩{ある}いて行{い}きます'], benar: 1, pembahasan: '自転車でスーパーへ行きます = pergi ke supermarket naik sepeda.' },
        ],
      },
      {
        id: 'L2-45',
        judul: '会社{かいしゃ}の前{まえ}のお弁当{べんとう}の店{みせ}',
        teks: '会社{かいしゃ}の前{まえ}にお弁当{べんとう}の店{みせ}があります。午前{ごぜん}11時{じ}から午後{ごご}2時{じ}までです。肉{にく}のお弁当{べんとう}は500円{えん}ですが、魚{さかな}のお弁当{べんとう}は450円{えん}で、いちばん安{やす}いです。',
        terjemahan: 'Di depan kantor ada toko bento. Toko itu buka dari pukul 11 pagi sampai pukul 2 siang. Bento daging harganya 500 yen, tetapi bento ikan 450 yen dan paling murah.',
        soal: [
          { id: 'L2-45-1', tanya: 'お弁当{べんとう}の店{みせ}は何時{なんじ}からですか。', tanyaId: 'Toko bento buka mulai pukul berapa?', opsi: ['午前{ごぜん}10時{じ}', '午前{ごぜん}11時{じ}', '午後{ごご}2時{じ}'], benar: 1, pembahasan: '午前11時から午後2時までです = buka dari pukul 11 pagi sampai pukul 2 siang.' },
          { id: 'L2-45-2', tanya: 'いちばん安{やす}いお弁当{べんとう}はどれですか。', tanyaId: 'Bento mana yang paling murah?', opsi: ['肉{にく}のお弁当{べんとう}', '野菜{やさい}のお弁当{べんとう}', '魚{さかな}のお弁当{べんとう}'], benar: 2, pembahasan: '魚のお弁当は450円で、いちばん安いです = bento ikan 450 yen dan paling murah.' },
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
        teks: '日曜日{にちようび}は雨{あめ}でしたから、弟{おとうと}と公園{こうえん}でサッカーをしませんでした。午前中{ごぜんちゅう}は家{いえ}でそうじをしました。午後{ごご}は、弟{おとうと}が「映画{えいが}を見{み}たい」と言{い}いましたから、二人{ふたり}で町{まち}へ見{み}に行{い}きました。',
        terjemahan: 'Hari Minggu hujan, jadi saya tidak bermain sepak bola di taman bersama adik laki-laki. Pagi hari saya bersih-bersih di rumah. Sore hari adik berkata, "Aku ingin menonton film," jadi kami berdua pergi ke kota untuk menontonnya.',
        soal: [
          { id: 'L3-1-1', tanya: 'どうして午後{ごご}、町{まち}へ行{い}きましたか。', tanyaId: 'Mengapa sore hari mereka pergi ke kota?', opsi: ['わたしが映画{えいが}を見{み}たかったからです', '家{いえ}のそうじが終{お}わったからです', '弟{おとうと}が映画{えいが}を見{み}たかったからです'], benar: 2, pembahasan: '弟が「映画を見たい」と言いましたから、二人で町へ見に行きました = adik berkata ingin menonton film, jadi kami berdua pergi ke kota untuk menontonnya (yang ingin menonton film adalah adik, bukan penulis).' },
          { id: 'L3-1-2', tanya: '午前中{ごぜんちゅう}、わたしは何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan penulis pada pagi hari?', opsi: ['家{いえ}でそうじをしました', '公園{こうえん}でサッカーをしました', '町{まち}で映画{えいが}を見{み}ました'], benar: 0, pembahasan: '午前中は家でそうじをしました = pagi hari saya bersih-bersih di rumah.' },
        ],
      },
      {
        id: 'L3-2',
        judul: '学校{がっこう}のお知{し}らせ',
        teks: '学校{がっこう}に、このお知{し}らせがあります。\n来週{らいしゅう}の水曜日{すいようび}は日本語{にほんご}のテストがあります。テストは午後{ごご}2時{じ}から1時間{じかん}です。えんぴつと辞書{じしょ}を持{も}ってきてください。ノートは持{も}ってこなくてもいいです。',
        terjemahan: 'Di sekolah ada pengumuman ini. Rabu minggu depan ada ujian bahasa Jepang. Ujiannya mulai pukul 2 siang selama 1 jam. Harap bawa pensil dan kamus. Buku catatan tidak perlu dibawa.',
        soal: [
          { id: 'L3-2-1', tanya: 'テストは何時{なんじ}に終{お}わりますか。', tanyaId: 'Pukul berapa ujian selesai?', opsi: ['2時{じ}', '1時{じ}', '3時{じ}'], benar: 2, pembahasan: 'テストは午後2時から1時間です = ujian mulai pukul 2 siang selama 1 jam (jadi selesai pukul 3).' },
          { id: 'L3-2-2', tanya: '何{なに}を持{も}ってこなければなりませんか。', tanyaId: 'Apa yang harus dibawa?', opsi: ['えんぴつとノート', 'ノートと辞書{じしょ}', 'えんぴつと辞書{じしょ}'], benar: 2, pembahasan: 'えんぴつと辞書を持ってきてください。ノートは持ってこなくてもいいです = bawalah pensil dan kamus; buku catatan tidak perlu dibawa.' },
        ],
      },
      {
        id: 'L3-3',
        judul: 'レストラン',
        teks: 'このレストランは魚{さかな}の料理{りょうり}が有名{ゆうめい}です。わたしは魚{さかな}を食{た}べましたが、友{とも}だちは魚{さかな}が好{す}きではありませんから、肉{にく}の料理{りょうり}を注文{ちゅうもん}しました。食事{しょくじ}のあとで、二人{ふたり}でコーヒーを飲{の}みました。',
        terjemahan: 'Restoran ini terkenal dengan masakan ikan. Saya makan ikan, tetapi teman saya tidak suka ikan, jadi ia memesan masakan daging. Setelah makan, kami berdua minum kopi.',
        soal: [
          { id: 'L3-3-1', tanya: '食事{しょくじ}のあとで、何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan setelah makan?', opsi: ['コーヒーを飲{の}みました', 'ケーキを食{た}べました', '魚{さかな}の料理{りょうり}を食{た}べました'], benar: 0, pembahasan: '食事のあとで、二人でコーヒーを飲みました = setelah makan, kami berdua minum kopi.' },
          { id: 'L3-3-2', tanya: 'どうして友{とも}だちは肉{にく}の料理{りょうり}を注文{ちゅうもん}しましたか。', tanyaId: 'Mengapa teman memesan masakan daging?', opsi: ['肉{にく}の料理{りょうり}が有名{ゆうめい}だからです', '魚{さかな}の料理{りょうり}が高{たか}かったからです', '魚{さかな}が嫌{きら}いだからです'], benar: 2, pembahasan: '友だちは魚が好きではありませんから、肉の料理を注文しました = teman tidak suka ikan, jadi memesan masakan daging (tidak suka ikan = 魚が嫌い; yang terkenal adalah masakan ikan, bukan daging).' },
        ],
      },
      {
        id: 'L3-4',
        judul: '図書館{としょかん}の時間{じかん}',
        teks: '図書館{としょかん}は月曜日{げつようび}が休{やす}みです。火曜日{かようび}から金曜日{きんようび}までは午前{ごぜん}9時{じ}から午後{ごご}7時{じ}まで開{あ}いています。土曜日{どようび}と日曜日{にちようび}は午後{ごご}5時{じ}までです。本{ほん}は5冊{さつ}まで借{か}りてもいいです。',
        terjemahan: 'Perpustakaan libur pada hari Senin. Dari Selasa sampai Jumat buka pukul 9 pagi sampai 7 malam. Sabtu dan Minggu sampai pukul 5 sore. Buku boleh dipinjam sampai lima buku.',
        soal: [
          { id: 'L3-4-1', tanya: '本{ほん}は何冊{なんさつ}まで借{か}りてもいいですか。', tanyaId: 'Buku boleh dipinjam sampai berapa buku?', opsi: ['5冊{さつ}', '7冊{さつ}', '9冊{さつ}'], benar: 0, pembahasan: '本は5冊まで借りてもいいです = buku boleh dipinjam sampai lima buku.' },
          { id: 'L3-4-2', tanya: '午後{ごご}6時{じ}に図書館{としょかん}へ行{い}きたいです。何曜日{なんようび}がいいですか。', tanyaId: 'Ingin pergi ke perpustakaan pukul 6 sore. Hari apa yang cocok?', opsi: ['月曜日{げつようび}', '水曜日{すいようび}', '日曜日{にちようび}'], benar: 1, pembahasan: '火曜日から金曜日までは午前9時から午後7時まで開いています。土曜日と日曜日は午後5時までです = Selasa sampai Jumat buka pukul 9 pagi sampai 7 malam; Sabtu dan Minggu sampai pukul 5 sore (jadi pukul 6 sore perpustakaan buka pada hari Rabu; hari Senin libur dan hari Minggu sudah tutup).' },
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
        teks: 'プールに、このお知{し}らせがあります。\n7月{がつ}と8月{がつ}だけ開{あ}いています。月曜日{げつようび}から金曜日{きんようび}までは200円{えん}、土曜日{どようび}と日曜日{にちようび}は500円{えん}です。中{なか}で飲{の}み物{もの}は飲{の}んでもいいですが、食{た}べ物{もの}は食{た}べないでください。',
        terjemahan: 'Di kolam renang ada pengumuman ini. Hanya buka pada bulan Juli dan Agustus. Senin sampai Jumat 200 yen, Sabtu dan Minggu 500 yen. Di dalam boleh minum, tetapi jangan makan makanan.',
        soal: [
          { id: 'L3-6-1', tanya: '日曜日{にちようび}はいくらですか。', tanyaId: 'Berapa harga tiket pada hari Minggu?', opsi: ['200円{えん}', '700円{えん}', '500円{えん}'], benar: 2, pembahasan: '土曜日と日曜日は500円です = hari Sabtu dan Minggu 500 yen.' },
          { id: 'L3-6-2', tanya: 'プールの中{なか}で何{なに}をしてはいけませんか。', tanyaId: 'Apa yang tidak boleh dilakukan di area kolam?', opsi: ['ジュースを飲{の}むこと', 'パンを食{た}べること', '土曜日{どようび}に泳{およ}ぐこと'], benar: 1, pembahasan: '飲み物は飲んでもいいですが、食べ物は食べないでください = boleh minum, tetapi jangan makan makanan (roti adalah makanan, jus adalah minuman; hari Sabtu kolam buka dengan harga 500 yen).' },
        ],
      },
      {
        id: 'L3-7',
        judul: '学校{がっこう}におくれました',
        teks: 'けさ、電車{でんしゃ}がとまりましたから、学校{がっこう}におくれました。教室{きょうしつ}に入{はい}ったとき、もう9時{じ}15分{ふん}でした。先生{せんせい}に「すみません」と言{い}いました。',
        terjemahan: 'Pagi ini kereta berhenti, jadi saya terlambat ke sekolah. Ketika saya masuk kelas, sudah pukul 9.15. Saya berkata "maaf" kepada guru.',
        soal: [
          { id: 'L3-7-1', tanya: 'どうして学校{がっこう}におくれましたか。', tanyaId: 'Mengapa tokoh terlambat ke sekolah?', opsi: ['朝{あさ}おそく起{お}きたからです', '電車{でんしゃ}がとまったからです', '雨{あめ}が降{ふ}ったからです'], benar: 1, pembahasan: '電車がとまりましたから = karena kereta berhenti.' },
          { id: 'L3-7-2', tanya: '教室{きょうしつ}に入{はい}ったのは何時{なんじ}でしたか。', tanyaId: 'Pukul berapa tokoh masuk kelas?', opsi: ['9時{じ}', '9時{じ}15分{ふん}', '9時{じ}50分{ぷん}'], benar: 1, pembahasan: 'もう9時15分でした = sudah pukul 9.15.' },
        ],
      },
      {
        id: 'L3-8',
        judul: 'パーティーをします',
        teks: 'これは、サリさんからアニさんにきたメールです。\nアニさん、来週{らいしゅう}の土曜日{どようび}、わたしの家{いえ}でパーティーをします。午後{ごご}6時{じ}からです。飲{の}み物{もの}と食{た}べ物{もの}はわたしが買{か}います。友{とも}だちも来{き}てください。\nサリ',
        terjemahan: 'Ini adalah email dari Sari kepada Ani. Ani, Sabtu minggu depan saya mengadakan pesta di rumah saya. Mulai pukul enam sore. Minuman dan makanan saya yang beli. Teman-teman juga silakan datang. Sari',
        soal: [
          { id: 'L3-8-1', tanya: 'パーティーは何時{なんじ}からですか。', tanyaId: 'Pesta mulai pukul berapa?', opsi: ['5時{じ}', '6時{じ}', '7時{じ}'], benar: 1, pembahasan: '午後6時からです = mulai pukul enam sore.' },
          { id: 'L3-8-2', tanya: '飲{の}み物{もの}と食{た}べ物{もの}は、だれが買{か}いますか。', tanyaId: 'Siapa yang membeli minuman dan makanan?', opsi: ['メールをもらった人{ひと}', 'パーティーに来{く}る友{とも}だち', 'メールを書{か}いた人{ひと}'], benar: 2, pembahasan: '飲み物と食べ物はわたしが買います = minuman dan makanan saya yang beli (わたし = Sari, orang yang menulis email ini).' },
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
        teks: 'パン屋{や}に、このお知{し}らせがあります。\n来週{らいしゅう}の水曜日{すいようび}と木曜日{もくようび}は休{やす}みです。金曜日{きんようび}からまた開{あ}きます。金曜日{きんようび}は、パンがぜんぶ100円{えん}安{やす}くなります。',
        terjemahan: 'Di toko roti ada pengumuman ini. Hari Rabu dan Kamis minggu depan libur. Mulai hari Jumat buka lagi. Pada hari Jumat, semua roti menjadi 100 yen lebih murah.',
        soal: [
          { id: 'L3-10-1', tanya: 'パン屋{や}が休{やす}みの日{ひ}はいつですか。', tanyaId: 'Kapan toko roti libur?', opsi: ['水曜日{すいようび}と木曜日{もくようび}', '木曜日{もくようび}と金曜日{きんようび}', '金曜日{きんようび}と土曜日{どようび}'], benar: 0, pembahasan: '来週の水曜日と木曜日は休みです = hari Rabu dan Kamis minggu depan libur.' },
          { id: 'L3-10-2', tanya: 'いつも300円{えん}のパンは、金曜日{きんようび}はいくらですか。', tanyaId: 'Roti yang biasanya 300 yen, berapa harganya pada hari Jumat?', opsi: ['200円{えん}', '100円{えん}', '300円{えん}'], benar: 0, pembahasan: '金曜日は、パンがぜんぶ100円安くなります = pada hari Jumat semua roti menjadi 100 yen lebih murah (jadi roti 300 yen menjadi 200 yen).' },
        ],
      },
      {
        id: 'L3-11',
        judul: '会社{かいしゃ}のお知{し}らせ',
        teks: '事務所{じむしょ}に、このお知{し}らせがあります。\n来週{らいしゅう}の金曜日{きんようび}は会社{かいしゃ}をそうじしますから、仕事{しごと}は休{やす}みです。土曜日{どようび}はいつもと同{おな}じです。朝{あさ}8時{じ}に来{き}てください。',
        terjemahan: 'Di kantor ada pengumuman ini. Jumat depan perusahaan akan dibersihkan, jadi pekerjaan libur. Hari Sabtu seperti biasa. Silakan datang pukul 8 pagi.',
        soal: [
          { id: 'L3-11-1', tanya: 'どうして金曜日{きんようび}は仕事{しごと}が休{やす}みですか。', tanyaId: 'Mengapa hari Jumat pekerjaan libur?', opsi: ['会社{かいしゃ}のそうじの日{ひ}だからです', '会社{かいしゃ}の人{ひと}が旅行{りょこう}に行{い}くからです', '国{くに}の休{やす}みの日{ひ}だからです'], benar: 0, pembahasan: '来週の金曜日は会社をそうじしますから、仕事は休みです = Jumat depan perusahaan dibersihkan, jadi pekerjaan libur (jadi hari Jumat adalah hari bersih-bersih perusahaan).' },
          { id: 'L3-11-2', tanya: '土曜日{どようび}は何時{なんじ}に来{き}ますか。', tanyaId: 'Hari Sabtu datang pukul berapa?', opsi: ['7時{じ}', '8時{じ}', '9時{じ}'], benar: 1, pembahasan: '朝8時に来てください = silakan datang pukul 8 pagi.' },
        ],
      },
      {
        id: 'L3-12',
        judul: '寮{りょう}のピアノ',
        teks: '寮{りょう}に、このお知{し}らせがあります。1階{かい}の部屋{へや}のピアノは、朝{あさ}10時{じ}から夜{よる}8時{じ}までひいてもいいです。日曜日{にちようび}は午後{ごご}1時{じ}からです。ひくときは、まどを閉{し}めてください。',
        terjemahan: 'Di asrama ada pengumuman ini. Piano di ruangan lantai 1 boleh dimainkan dari pukul 10 pagi sampai pukul 8 malam. Hari Minggu mulai pukul 1 siang. Saat memainkan piano, tutuplah jendela.',
        soal: [
          { id: 'L3-12-1', tanya: '日曜日{にちようび}は、何時{なんじ}からピアノをひいてもいいですか。', tanyaId: 'Pada hari Minggu, mulai pukul berapa piano boleh dimainkan?', opsi: ['朝{あさ}10時{じ}', '夜{よる}8時{じ}', '午後{ごご}1時{じ}'], benar: 2, pembahasan: '日曜日は午後1時からです = hari Minggu mulai pukul 1 siang.' },
          { id: 'L3-12-2', tanya: '1階{かい}の部屋{へや}で、してはいけないことはどれですか。', tanyaId: 'Di ruangan lantai 1, apa yang tidak boleh dilakukan?', opsi: ['まどを開{あ}けてピアノをひくこと', '火曜日{かようび}の午前{ごぜん}11時{じ}にピアノをひくこと', '夜{よる}7時{じ}にピアノをひくこと'], benar: 0, pembahasan: 'ひくときは、まどを閉めてください = saat memainkan piano, tutuplah jendela (jadi tidak boleh bermain dengan jendela terbuka; hari Selasa pukul 11 pagi dan pukul 7 malam masih di dalam jam yang boleh, pukul 10 pagi sampai 8 malam).' },
        ],
      },
      {
        id: 'L3-13',
        judul: '雪{ゆき}の朝{あさ}',
        teks: '今朝{けさ}は雪{ゆき}がたくさん降{ふ}りましたから、バスが20分{ぷん}おそく来{き}ました。いつも8時{じ}半{はん}に会社{かいしゃ}に着{つ}きますが、今日{きょう}は20分{ぷん}おそく着{つ}きました。バスの中{なか}から会社{かいしゃ}に電話{でんわ}して、「少{すこ}しおそくなります」と言{い}いました。',
        terjemahan: 'Tadi pagi salju turun banyak, jadi bus datang 20 menit lebih lambat. Biasanya saya tiba di kantor pukul 8.30, tetapi hari ini saya tiba 20 menit lebih lambat. Dari dalam bus saya menelepon kantor dan berkata, "Saya akan sedikit terlambat."',
        soal: [
          { id: 'L3-13-1', tanya: '今日{きょう}、わたしは何時{なんじ}に会社{かいしゃ}に着{つ}きましたか。', tanyaId: 'Hari ini pukul berapa penulis tiba di kantor?', opsi: ['8時{じ}半{はん}', '8時{じ}20分{ぷん}', '8時{じ}50分{ぷん}'], benar: 2, pembahasan: 'いつも8時半に会社に着きますが、今日は20分おそく着きました = biasanya tiba di kantor pukul 8.30, tetapi hari ini tiba 20 menit lebih lambat (jadi pukul 8.50).' },
          { id: 'L3-13-2', tanya: '会社{かいしゃ}に着{つ}く前{まえ}に、わたしは何{なに}をしましたか。', tanyaId: 'Sebelum tiba di kantor, apa yang dilakukan penulis?', opsi: ['会社{かいしゃ}に電話{でんわ}しました', '会社{かいしゃ}にメールを送{おく}りました', 'バスを降{お}りて歩{ある}きました'], benar: 0, pembahasan: 'バスの中から会社に電話して、「少しおそくなります」と言いました = dari dalam bus menelepon kantor dan berkata akan sedikit terlambat.' },
        ],
      },
      {
        id: 'L3-14',
        judul: '教室{きょうしつ}のお知{し}らせ',
        teks: '2階{かい}の教室{きょうしつ}のドアに、このお知{し}らせがあります。\n来週{らいしゅう}から学生{がくせい}が10人{にん}から20人{にん}になりますから、日本語{にほんご}のクラスは3階{がい}の大{おお}きい教室{きょうしつ}です。時間{じかん}はいつもと同{おな}じで、午後{ごご}2時{じ}からです。',
        terjemahan: 'Di pintu ruang kelas lantai 2 ada pengumuman ini. Mulai minggu depan siswanya bertambah dari 10 menjadi 20 orang, jadi kelas bahasa Jepang pindah ke ruang kelas besar di lantai 3. Jamnya sama seperti biasa, mulai pukul 2 siang.',
        soal: [
          { id: 'L3-14-1', tanya: 'どうして来週{らいしゅう}から3階{がい}の教室{きょうしつ}になりますか。', tanyaId: 'Mengapa mulai minggu depan kelasnya di ruang lantai 3?', opsi: ['学生{がくせい}が多{おお}くなるからです', '2階{かい}の教室{きょうしつ}を会議{かいぎ}で使{つか}うからです', 'クラスの時間{じかん}が長{なが}くなるからです'], benar: 0, pembahasan: '来週から学生が10人から20人になりますから、日本語のクラスは3階の大きい教室です = mulai minggu depan siswanya bertambah dari 10 menjadi 20 orang, jadi kelas bahasa Jepang di ruang besar lantai 3 (jadi alasannya siswa bertambah banyak; jamnya tetap sama).' },
          { id: 'L3-14-2', tanya: '日本語{にほんご}のクラスは何時{なんじ}からですか。', tanyaId: 'Kelas bahasa Jepang mulai pukul berapa?', opsi: ['午後{ごご}2時{じ}', '午後{ごご}1時{じ}', '午後{ごご}3時{じ}'], benar: 0, pembahasan: '時間はいつもと同じで、午後2時からです = jamnya sama, mulai pukul 2 siang.' },
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
        teks: '今日{きょう}は5月{がつ}1日{ついたち}です。図書館{としょかん}で本{ほん}を3冊{さつ}借{か}りました。図書館{としょかん}の人{ひと}は「本{ほん}は2週間{しゅうかん}借{か}りてもいいです。でも、雑誌{ざっし}は借{か}りてはいけません。図書館{としょかん}の中{なか}で読{よ}んでください」と言{い}いました。',
        terjemahan: 'Hari ini tanggal 1 Mei. Saya meminjam tiga buku di perpustakaan. Petugas perpustakaan berkata, "Buku boleh dipinjam selama dua minggu. Tetapi majalah tidak boleh dipinjam. Silakan baca di dalam perpustakaan."',
        soal: [
          { id: 'L3-16-1', tanya: '本{ほん}は、いつまで借{か}りてもいいですか。', tanyaId: 'Buku boleh dipinjam sampai tanggal berapa?', opsi: ['5月{がつ}8日{ようか}', '5月{がつ}15日{にち}', '5月{がつ}22日{にち}'], benar: 1, pembahasan: '今日は5月1日です。…本は2週間借りてもいいです = hari ini tanggal 1 Mei; buku boleh dipinjam selama dua minggu (jadi sampai tanggal 15 Mei).' },
          { id: 'L3-16-2', tanya: '雑誌{ざっし}は、どうしなければなりませんか。', tanyaId: 'Majalah harus diperlakukan bagaimana?', opsi: ['図書館{としょかん}の中{なか}で読{よ}みます', 'うちで読{よ}みます', '3冊{さつ}まで借{か}ります'], benar: 0, pembahasan: '雑誌は借りてはいけません。図書館の中で読んでください = majalah tidak boleh dipinjam; bacalah di dalam perpustakaan.' },
        ],
      },
      {
        id: 'L3-17',
        judul: '新{あたら}しいラーメン屋{や}',
        teks: '駅{えき}の前{まえ}に新{あたら}しいラーメン屋{や}ができました。とてもおいしいですから、いつも人{ひと}がたくさん並{なら}んでいます。わたしはきのう30分{ぷん}待{ま}ちました。',
        terjemahan: 'Di depan stasiun ada kedai ramen baru. Ramennya sangat enak, jadi selalu banyak orang mengantre. Kemarin saya menunggu 30 menit.',
        soal: [
          { id: 'L3-17-1', tanya: 'どうしていつも人{ひと}がたくさん並{なら}んでいますか。', tanyaId: 'Mengapa selalu banyak orang mengantre?', opsi: ['安{やす}いからです', 'おいしいからです', '駅{えき}から近{ちか}いからです'], benar: 1, pembahasan: 'とてもおいしいですから、いつも人がたくさん並んでいます = sangat enak, jadi selalu banyak orang mengantre.' },
          { id: 'L3-17-2', tanya: 'きのう、わたしはどのぐらい待{ま}ちましたか。', tanyaId: 'Kemarin penulis menunggu berapa lama?', opsi: ['10分{ぷん}', '20分{ぷん}', '30分{ぷん}'], benar: 2, pembahasan: 'わたしはきのう30分待ちました = kemarin saya menunggu 30 menit.' },
        ],
      },
      {
        id: 'L3-18',
        judul: '電話{でんわ}のメモ',
        teks: '田中{たなか}さんの机{つくえ}の上{うえ}に、このメモがあります。\n田中{たなか}さんへ\n10時{じ}ごろ、木村{きむら}さんから電話{でんわ}がありました。あしたの会議{かいぎ}は2時{じ}からではありません。3時{じ}からです。木村{きむら}さんに電話{でんわ}をしてください。\n山本{やまもと}',
        terjemahan: 'Di atas meja Tanaka ada memo ini. Untuk Tanaka. Sekitar pukul sepuluh ada telepon dari Kimura. Rapat besok bukan mulai pukul 2, tetapi pukul 3. Silakan telepon Kimura. Yamamoto',
        soal: [
          { id: 'L3-18-1', tanya: 'あしたの会議{かいぎ}の時間{じかん}は、どうなりましたか。', tanyaId: 'Bagaimana jam rapat besok sekarang?', opsi: ['1時間{じかん}早{はや}くなりました', '1時間{じかん}おそくなりました', '時間{じかん}は同{おな}じです'], benar: 1, pembahasan: 'あしたの会議は2時からではありません。3時からです = rapat besok bukan mulai pukul 2, tetapi pukul 3 (jadi 1 jam lebih lambat).' },
          { id: 'L3-18-2', tanya: '田中{たなか}さんは何{なに}をしますか。', tanyaId: 'Apa yang harus dilakukan Tanaka?', opsi: ['山本{やまもと}さんに電話{でんわ}をします', '木村{きむら}さんに会{あ}いに行{い}きます', '木村{きむら}さんに電話{でんわ}をします'], benar: 2, pembahasan: '木村さんに電話をしてください = silakan telepon Kimura.' },
        ],
      },
      {
        id: 'L3-19',
        judul: '弟{おとうと}のサッカーの試合{しあい}',
        teks: '弟{おとうと}の学校{がっこう}のサッカーの試合{しあい}は今週{こんしゅう}の土曜日{どようび}でした。でも、雨{あめ}が降{ふ}りましたから、来週{らいしゅう}の日曜日{にちようび}になりました。弟{おとうと}は「早{はや}くサッカーがしたい」と言{い}っています。',
        terjemahan: 'Pertandingan sepak bola sekolah adik laki-laki saya seharusnya Sabtu ini. Tetapi karena hujan, diundur menjadi Minggu depan. Adik berkata, "Aku ingin cepat main sepak bola."',
        soal: [
          { id: 'L3-19-1', tanya: '試合{しあい}はいつになりましたか。', tanyaId: 'Pertandingan diundur menjadi kapan?', opsi: ['今週{こんしゅう}の土曜日{どようび}', '来週{らいしゅう}の土曜日{どようび}', '来週{らいしゅう}の日曜日{にちようび}'], benar: 2, pembahasan: '来週の日曜日になりました = menjadi hari Minggu depan.' },
          { id: 'L3-19-2', tanya: 'どうして今週{こんしゅう}の土曜日{どようび}に試合{しあい}をしませんでしたか。', tanyaId: 'Mengapa pertandingan tidak diadakan Sabtu ini?', opsi: ['雨{あめ}が降{ふ}ったからです', '先生{せんせい}が病気{びょうき}だったからです', '弟{おとうと}が休{やす}んだからです'], benar: 0, pembahasan: '雨が降りましたから、来週の日曜日になりました = karena hujan, diundur ke Minggu depan.' },
        ],
      },
      {
        id: 'L3-20',
        judul: '病院{びょういん}のお知{し}らせ',
        teks: 'さくら病院{びょういん}のドアに、このお知{し}らせがあります。\n来週{らいしゅう}の月曜日{げつようび}から水曜日{すいようび}まで、病院{びょういん}は休{やす}みです。木曜日{もくようび}から、また朝{あさ}9時{じ}に開{あ}きます。休{やす}みの日{ひ}は、駅{えき}の前{まえ}のみどり病院{びょういん}へ行{い}ってください。',
        terjemahan: 'Di pintu Rumah Sakit Sakura ada pengumuman ini. Senin sampai Rabu minggu depan rumah sakit libur. Mulai Kamis buka lagi pukul 9 pagi. Pada hari libur, silakan pergi ke Rumah Sakit Midori di depan stasiun.',
        soal: [
          { id: 'L3-20-1', tanya: '来週{らいしゅう}、何曜日{なんようび}にさくら病院{びょういん}へ行{い}くことができますか。', tanyaId: 'Minggu depan, pada hari apa bisa pergi ke Rumah Sakit Sakura?', opsi: ['月曜日{げつようび}', '水曜日{すいようび}', '金曜日{きんようび}'], benar: 2, pembahasan: '来週の月曜日から水曜日まで、病院は休みです。木曜日から、また朝9時に開きます = Senin sampai Rabu minggu depan rumah sakit libur; mulai Kamis buka lagi pukul 9 pagi (jadi hari Jumat bisa pergi ke Rumah Sakit Sakura; Senin dan Rabu masih libur).' },
          { id: 'L3-20-2', tanya: '休{やす}みの日{ひ}はどこへ行{い}きますか。', tanyaId: 'Pada hari libur pergi ke mana?', opsi: ['さくら病院{びょういん}', '駅{えき}の前{まえ}のみどり病院{びょういん}', '駅{えき}の前{まえ}のくすり屋{や}'], benar: 1, pembahasan: '休みの日は、駅の前のみどり病院へ行ってください = pada hari libur pergi ke Rumah Sakit Midori di depan stasiun.' },
        ],
      },
      {
        id: 'L3-21',
        judul: '寮{りょう}のせんたく機{き}',
        teks: '寮{りょう}に、このお知{し}らせがあります。\n寮{りょう}のせんたく機{き}は1階{かい}にあります。朝{あさ}6時{じ}から夜{よる}9時{じ}まで使{つか}ってもいいです。夜{よる}9時{じ}からは、事務所{じむしょ}の人{ひと}がせんたく機{き}をそうじしますから、使{つか}わないでください。',
        terjemahan: 'Di asrama ada pengumuman ini. Mesin cuci asrama ada di lantai satu. Boleh dipakai dari pukul 6 pagi sampai pukul 9 malam. Mulai pukul 9 malam, petugas kantor membersihkan mesin cuci, jadi jangan dipakai.',
        soal: [
          { id: 'L3-21-1', tanya: 'せんたく機{き}を使{つか}ってもいい時間{じかん}はどれですか。', tanyaId: 'Jam berapa mesin cuci boleh dipakai?', opsi: ['朝{あさ}5時{じ}', '朝{あさ}7時{じ}', '夜{よる}10時{じ}'], benar: 1, pembahasan: '朝6時から夜9時まで使ってもいいです = boleh dipakai dari pukul 6 pagi sampai pukul 9 malam (jadi pukul 7 pagi boleh; pukul 5 pagi dan pukul 10 malam tidak boleh).' },
          { id: 'L3-21-2', tanya: 'どうして夜{よる}9時{じ}からは使{つか}ってはいけませんか。', tanyaId: 'Mengapa mulai pukul 9 malam tidak boleh dipakai?', opsi: ['夜{よる}は水{みず}が出{で}ないからです', '夜{よる}は電気{でんき}が高{たか}いからです', '事務所{じむしょ}の人{ひと}がそうじするからです'], benar: 2, pembahasan: '夜9時からは、事務所の人がせんたく機をそうじしますから、使わないでください = mulai pukul 9 malam petugas kantor membersihkan mesin cuci, jadi jangan dipakai.' },
        ],
      },
      {
        id: 'L3-22',
        judul: '会社{かいしゃ}のバスのお知{し}らせ',
        teks: '寮{りょう}に、このお知{し}らせがあります。\n朝{あさ}の会社{かいしゃ}のバスは今{いま}7時{じ}半{はん}に出{で}ますが、来月{らいげつ}からは7時{じ}10分{ぷん}に寮{りょう}の前{まえ}を出{で}ます。バスに乗{の}る人{ひと}は、金曜日{きんようび}までに事務所{じむしょ}で名前{なまえ}を書{か}いてください。',
        terjemahan: 'Di asrama ada pengumuman ini. Bus perusahaan pagi sekarang berangkat pukul 7.30, tetapi mulai bulan depan berangkat dari depan asrama pukul 7.10. Orang yang naik bus, silakan menulis nama di kantor paling lambat hari Jumat.',
        soal: [
          { id: 'L3-22-1', tanya: '来月{らいげつ}から、朝{あさ}のバスは今{いま}より何分{なんぷん}早{はや}く出{で}ますか。', tanyaId: 'Mulai bulan depan, bus pagi berangkat berapa menit lebih awal daripada sekarang?', opsi: ['30分{ぷん}', '10分{ぷん}', '20分{ぷん}'], benar: 2, pembahasan: '朝の会社のバスは今7時半に出ますが、来月からは7時10分に寮の前を出ます = bus perusahaan pagi sekarang berangkat pukul 7.30, tetapi mulai bulan depan berangkat pukul 7.10 (jadi 20 menit lebih awal).' },
          { id: 'L3-22-2', tanya: 'バスに乗{の}る人{ひと}は何{なに}をしますか。', tanyaId: 'Apa yang harus dilakukan orang yang naik bus?', opsi: ['事務所{じむしょ}で名前{なまえ}を書{か}きます', '事務所{じむしょ}に電話{でんわ}をします', '寮{りょう}の前{まえ}で名前{なまえ}を言{い}います'], benar: 0, pembahasan: 'バスに乗る人は、金曜日までに事務所で名前を書いてください = orang yang naik bus, silakan menulis nama di kantor paling lambat hari Jumat.' },
        ],
      },
      {
        id: 'L3-23',
        judul: '食堂{しょくどう}のカレーの日{ひ}',
        teks: '会社{かいしゃ}の食堂{しょくどう}は、毎週{まいしゅう}水曜日{すいようび}がカレーの日{ひ}です。カレーは300円{えん}で、安{やす}くておいしいですから、水曜日{すいようび}は人{ひと}が多{おお}いです。わたしは早{はや}く食堂{しょくどう}へ行{い}きます。',
        terjemahan: 'Di kantin perusahaan, setiap hari Rabu adalah hari kari. Karinya 300 yen, murah dan enak, jadi hari Rabu orangnya banyak. Saya pergi ke kantin lebih awal.',
        soal: [
          { id: 'L3-23-1', tanya: 'カレーはいくらですか。', tanyaId: 'Berapa harga karinya?', opsi: ['300円{えん}', '350円{えん}', '500円{えん}'], benar: 0, pembahasan: 'カレーは300円で = karinya 300 yen.' },
          { id: 'L3-23-2', tanya: 'どうして水曜日{すいようび}は食堂{しょくどう}に人{ひと}が多{おお}いですか。', tanyaId: 'Mengapa hari Rabu di kantin banyak orang?', opsi: ['食堂{しょくどう}が小{ちい}さいからです', 'カレーが安{やす}くておいしいからです', '仕事{しごと}が早{はや}く終{お}わるからです'], benar: 1, pembahasan: '安くておいしいですから、水曜日は人が多いです = murah dan enak, jadi hari Rabu orangnya banyak.' },
        ],
      },
      {
        id: 'L3-24',
        judul: 'お弁当{べんとう}の店{みせ}のアルバイト',
        teks: 'お弁当{べんとう}の店{みせ}に、このお知{し}らせがあります。アルバイトの人{ひと}は、店{みせ}に来{き}たら、ぼうしをかぶって、手{て}を洗{あら}ってください。その前{まえ}に、事務所{じむしょ}で名前{なまえ}を書{か}いてください。昼{ひる}は忙{いそが}しいですから、昼休{ひるやす}みは2時{じ}からです。',
        terjemahan: 'Di toko bento ada pengumuman ini. Pekerja paruh waktu, setelah datang ke toko, pakailah topi dan cucilah tangan. Sebelum itu, tulislah nama di kantor. Siang hari sibuk, jadi istirahat siang mulai pukul 2.',
        soal: [
          { id: 'L3-24-1', tanya: 'アルバイトの人{ひと}は、店{みせ}に来{き}たら、はじめに何{なに}をしますか。', tanyaId: 'Setelah datang ke toko, apa yang pertama-tama dilakukan pekerja paruh waktu?', opsi: ['ぼうしをかぶります', '手{て}を洗{あら}います', '事務所{じむしょ}で名前{なまえ}を書{か}きます'], benar: 2, pembahasan: 'その前に、事務所で名前を書いてください = sebelum itu, tulislah nama di kantor (jadi yang pertama dilakukan adalah menulis nama di kantor, sesudah itu memakai topi dan mencuci tangan).' },
          { id: 'L3-24-2', tanya: '昼休{ひるやす}みは何時{なんじ}からですか。', tanyaId: 'Istirahat siang mulai pukul berapa?', opsi: ['2時{じ}', '12時{じ}', '1時{じ}'], benar: 0, pembahasan: '昼は忙しいですから、昼休みは2時からです = siang hari sibuk, jadi istirahat siang mulai pukul 2.' },
        ],
      },
      {
        id: 'L3-25',
        judul: 'お母{かあ}さんへのメール',
        teks: 'これは、ハディさんからお母{かあ}さんにきたメールです。\nお母{かあ}さん、来週{らいしゅう}は夜{よる}の仕事{しごと}です。夜{よる}10時{じ}から朝{あさ}6時{じ}まで働{はたら}きます。昼{ひる}に寝{ね}ますから、昼{ひる}は電話{でんわ}をしないでください。メールを送{おく}ってください。\nハディ',
        terjemahan: 'Ini adalah email dari Hadi kepada ibunya. Ibu, minggu depan saya kerja malam. Saya bekerja dari pukul 10 malam sampai pukul 6 pagi. Saya tidur pada siang hari, jadi jangan menelepon pada siang hari. Silakan kirim email. Hadi',
        soal: [
          { id: 'L3-25-1', tanya: '来週{らいしゅう}、仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Minggu depan, pekerjaan selesai pukul berapa?', opsi: ['夜{よる}10時{じ}', '朝{あさ}6時{じ}', '朝{あさ}10時{じ}'], benar: 1, pembahasan: '夜10時から朝6時まで働きます = bekerja dari pukul 10 malam sampai pukul 6 pagi (jadi selesai pukul 6 pagi).' },
          { id: 'L3-25-2', tanya: 'どうして昼{ひる}に電話{でんわ}をしてはいけませんか。', tanyaId: 'Mengapa tidak boleh menelepon pada siang hari?', opsi: ['ハディさんが寝{ね}ているからです', 'ハディさんが働{はたら}いているからです', 'お母{かあ}さんが寝{ね}ているからです'], benar: 0, pembahasan: '昼に寝ますから、昼は電話をしないでください = saya tidur pada siang hari, jadi jangan menelepon pada siang hari (yang tidur pada siang hari adalah Hadi, penulis email; Hadi bekerja pada malam hari).' },
        ],
      },
      {
        id: 'L3-26',
        judul: '国{くに}へお金{かね}を送{おく}ります',
        teks: 'わたしは毎月{まいつき}、国{くに}の家族{かぞく}に5万円{まんえん}送{おく}ります。今月{こんげつ}は妹{いもうと}の誕生日{たんじょうび}がありますから、6万円{まんえん}送{おく}ります。銀行{ぎんこう}は午後{ごご}3時{じ}に閉{し}まりますから、昼休{ひるやす}みに行{い}きます。',
        terjemahan: 'Setiap bulan saya mengirim 50.000 yen kepada keluarga di negara saya. Bulan ini ada ulang tahun adik perempuan saya, jadi saya mengirim 60.000 yen. Bank tutup pukul 3 sore, jadi saya pergi pada jam istirahat siang.',
        soal: [
          { id: 'L3-26-1', tanya: 'わたしは今月{こんげつ}いくら送{おく}りますか。', tanyaId: 'Bulan ini penulis mengirim berapa?', opsi: ['5万円{まんえん}', '3万円{まんえん}', '6万円{まんえん}'], benar: 2, pembahasan: '今月は妹の誕生日がありますから、6万円送ります = bulan ini ada ulang tahun adik perempuan, jadi mengirim 60.000 yen (50.000 yen adalah jumlah yang biasa dikirim setiap bulan).' },
          { id: 'L3-26-2', tanya: 'どうして昼休{ひるやす}みに銀行{ぎんこう}へ行{い}きますか。', tanyaId: 'Mengapa ia pergi ke bank pada jam istirahat siang?', opsi: ['昼{ひる}は人{ひと}が少{すく}ないからです', '銀行{ぎんこう}が会社{かいしゃ}から近{ちか}いからです', '銀行{ぎんこう}が3時{じ}に閉{し}まるからです'], benar: 2, pembahasan: '銀行は午後3時に閉まりますから、昼休みに行きます = bank tutup pukul 3 sore, jadi pergi pada jam istirahat siang.' },
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
        teks: 'アリさん、土曜日{どようび}の夜{よる}、町{まち}の夏{なつ}まつりに行{い}きませんか。まつりは7時{じ}から10時{じ}までです。人{ひと}が多{おお}いですから、6時{じ}半{はん}に駅{えき}で会{あ}いましょう。',
        terjemahan: 'Ali, maukah pergi ke festival musim panas kota pada Sabtu malam? Festivalnya dari pukul 7 sampai pukul 10. Karena orangnya banyak, mari bertemu di stasiun pukul 6.30.',
        soal: [
          { id: 'L3-28-1', tanya: 'まつりは何時{なんじ}までですか。', tanyaId: 'Festival berlangsung sampai pukul berapa?', opsi: ['7時{じ}', '6時{じ}半{はん}', '10時{じ}'], benar: 2, pembahasan: 'まつりは7時から10時までです = festivalnya dari pukul 7 sampai pukul 10.' },
          { id: 'L3-28-2', tanya: 'どうして6時{じ}半{はん}に会{あ}いますか。', tanyaId: 'Mengapa bertemu pukul 6.30?', opsi: ['人{ひと}が多{おお}いからです', '駅{えき}が遠{とお}いからです', '電車{でんしゃ}が少{すく}ないからです'], benar: 0, pembahasan: '人が多いですから、6時半に駅で会いましょう = karena orangnya banyak, mari bertemu di stasiun pukul 6.30.' },
        ],
      },
      {
        id: 'L3-29',
        judul: '薬{くすり}の飲{の}み方{かた}',
        teks: '病院{びょういん}で、薬{くすり}とこの紙{かみ}をもらいました。\nこの薬{くすり}は一日{いちにち}に2回{かい}、ごはんのあとで飲{の}んでください。昼{ひる}は飲{の}まないでください。熱{ねつ}が高{たか}いときは、夜{よる}寝{ね}る前{まえ}にも飲{の}んでもいいです。お酒{さけ}は飲{の}まないでください。',
        terjemahan: 'Di rumah sakit saya mendapat obat dan kertas ini. Obat ini diminum dua kali sehari, sesudah makan. Siang hari jangan diminum. Kalau demamnya tinggi, boleh diminum juga sebelum tidur malam. Jangan minum minuman keras.',
        soal: [
          { id: 'L3-29-1', tanya: 'この薬{くすり}は、いつ飲{の}みますか。', tanyaId: 'Kapan obat ini diminum?', opsi: ['朝{あさ}と晩{ばん}のごはんのあと', '朝{あさ}と昼{ひる}と晩{ばん}のごはんのあと', '昼{ひる}と晩{ばん}のごはんのあと'], benar: 0, pembahasan: 'この薬は一日に2回、ごはんのあとで飲んでください。昼は飲まないでください = obat ini diminum dua kali sehari sesudah makan; siang hari jangan diminum (jadi sesudah sarapan dan sesudah makan malam).' },
          { id: 'L3-29-2', tanya: '熱{ねつ}が高{たか}いときは、何{なに}をしてもいいですか。', tanyaId: 'Kalau demamnya tinggi, apa yang boleh dilakukan?', opsi: ['寝{ね}る前{まえ}にも薬{くすり}を飲{の}みます', 'ごはんの前{まえ}にも薬{くすり}を飲{の}みます', '朝{あさ}起{お}きたときにも薬{くすり}を飲{の}みます'], benar: 0, pembahasan: '熱が高いときは、夜寝る前にも飲んでもいいです = kalau demamnya tinggi, boleh diminum juga sebelum tidur malam.' },
        ],
      },
      {
        id: 'L3-30',
        judul: '自転車{じてんしゃ}を置{お}くところ',
        teks: '寮{りょう}に、このお知{し}らせがあります。\n自転車{じてんしゃ}を置{お}くところは、建物{たてもの}のうしろにあります。自転車{じてんしゃ}に名前{なまえ}を書{か}いて、そこに置{お}いてください。ドアの前{まえ}はせまいですから、置{お}かないでください。',
        terjemahan: 'Di asrama ada pengumuman ini. Tempat menaruh sepeda ada di belakang gedung. Tulislah nama pada sepeda, lalu letakkan di sana. Di depan pintu sempit, jadi jangan meletakkan sepeda di situ.',
        soal: [
          { id: 'L3-30-1', tanya: '自転車{じてんしゃ}を置{お}くところはどこにありますか。', tanyaId: 'Tempat parkir sepeda ada di mana?', opsi: ['建物{たてもの}の前{まえ}', '建物{たてもの}の中{なか}', '建物{たてもの}のうしろ'], benar: 2, pembahasan: '建物のうしろにあります = ada di belakang gedung.' },
          { id: 'L3-30-2', tanya: 'どうしてドアの前{まえ}に自転車{じてんしゃ}を置{お}いてはいけませんか。', tanyaId: 'Mengapa tidak boleh meletakkan sepeda di depan pintu?', opsi: ['ドアの前{まえ}は人{ひと}が多{おお}いからです', 'ドアの前{まえ}は広{ひろ}くないからです', 'ドアの前{まえ}はきたないからです'], benar: 1, pembahasan: 'ドアの前はせまいですから、置かないでください = di depan pintu sempit, jadi jangan meletakkan di situ (sempit = tidak luas, 広くない).' },
        ],
      },
      {
        id: 'L3-31',
        judul: '雨{あめ}の日{ひ}のお知{し}らせ',
        teks: '寮{りょう}に、このお知{し}らせがあります。\nあしたは雨{あめ}がたくさん降{ふ}ります。電車{でんしゃ}とバスが止{と}まりますから、会社{かいしゃ}は休{やす}みです。あぶないですから、外{そと}に出{で}ないでください。あさっては、いつもと同{おな}じ時間{じかん}に来{き}てください。',
        terjemahan: 'Di asrama ada pengumuman ini. Besok akan turun hujan yang sangat lebat. Kereta dan bus berhenti, jadi kantor libur. Karena berbahaya, jangan keluar. Lusa, silakan datang pada jam yang sama seperti biasa.',
        soal: [
          { id: 'L3-31-1', tanya: 'どうしてあした会社{かいしゃ}は休{やす}みですか。', tanyaId: 'Mengapa besok kantor libur?', opsi: ['会社{かいしゃ}をそうじするからです', '電車{でんしゃ}とバスが止{と}まるからです', '会社{かいしゃ}の電気{でんき}が止{と}まるからです'], benar: 1, pembahasan: '電車とバスが止まりますから、会社は休みです = kereta dan bus berhenti, jadi kantor libur.' },
          { id: 'L3-31-2', tanya: 'あさっては、どうしますか。', tanyaId: 'Lusa, apa yang dilakukan?', opsi: ['会社{かいしゃ}を休{やす}みます', 'いつもより早{はや}く行{い}きます', 'いつもの時間{じかん}に行{い}きます'], benar: 2, pembahasan: 'あさっては、いつもと同じ時間に来てください = lusa, datanglah pada jam yang sama seperti biasa.' },
        ],
      },
      {
        id: 'L3-32',
        judul: '電車{でんしゃ}の中{なか}で',
        teks: '寮{りょう}に、このお知{し}らせがあります。\n電車{でんしゃ}の中{なか}で電話{でんわ}をしてはいけません。電話{でんわ}は、駅{えき}で降{お}りてからしてください。朝{あさ}7時{じ}から9時{じ}までは人{ひと}が多{おお}いですから、大{おお}きい荷物{にもつ}を持{も}って乗{の}らないでください。',
        terjemahan: 'Di asrama ada pengumuman ini. Di dalam kereta tidak boleh menelepon. Teleponlah sesudah turun di stasiun. Dari pukul 7 sampai pukul 9 pagi orangnya banyak, jadi jangan naik kereta dengan membawa barang besar.',
        soal: [
          { id: 'L3-32-1', tanya: '電車{でんしゃ}の中{なか}で、友{とも}だちに電話{でんわ}をしたいです。どうしますか。', tanyaId: 'Di dalam kereta, ingin menelepon teman. Apa yang dilakukan?', opsi: ['駅{えき}で降{お}りてから電話{でんわ}をします', '寮{りょう}に帰{かえ}ってから電話{でんわ}をします', '電車{でんしゃ}の中{なか}で少{すこ}し電話{でんわ}をします'], benar: 0, pembahasan: '電話は、駅で降りてからしてください = teleponlah sesudah turun di stasiun.' },
          { id: 'L3-32-2', tanya: '大{おお}きい荷物{にもつ}を持{も}って電車{でんしゃ}に乗{の}ってもいい時間{じかん}はどれですか。', tanyaId: 'Jam berapa boleh naik kereta dengan membawa barang besar?', opsi: ['朝{あさ}7時{じ}半{はん}', '朝{あさ}8時{じ}半{はん}', '朝{あさ}9時{じ}半{はん}'], benar: 2, pembahasan: '朝7時から9時までは人が多いですから、大きい荷物を持って乗らないでください = dari pukul 7 sampai pukul 9 pagi orangnya banyak, jadi jangan naik dengan membawa barang besar (jadi pukul 9.30 boleh; pukul 7.30 dan 8.30 tidak boleh).' },
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
        teks: '教室{きょうしつ}に、このお知{し}らせがあります。\n来週{らいしゅう}の月曜日{げつようび}に漢字{かんじ}のテストをします。テストは9時{じ}から30分{ぷん}です。えんぴつと消{け}しゴムを持{も}って来{き}てください。テストのとき、けいたい電話{でんわ}はかばんに入{い}れてください。',
        terjemahan: 'Di kelas ada pengumuman ini. Senin depan ada tes kanji. Tesnya 30 menit mulai pukul 9. Silakan membawa pensil dan penghapus. Saat tes, masukkan telepon genggam ke dalam tas.',
        soal: [
          { id: 'L3-34-1', tanya: 'テストは何分{なんぷん}ですか。', tanyaId: 'Tesnya berapa menit?', opsi: ['20分{ぷん}', '30分{ぷん}', '90分{ぷん}'], benar: 1, pembahasan: 'テストは9時から30分です = tesnya 30 menit mulai pukul 9.' },
          { id: 'L3-34-2', tanya: 'テストのとき、けいたい電話{でんわ}はどこにありますか。', tanyaId: 'Saat tes, telepon genggam ada di mana?', opsi: ['かばんの中{なか}', 'つくえの上{うえ}', '先生{せんせい}のところ'], benar: 0, pembahasan: 'テストのとき、けいたい電話はかばんに入れてください = saat tes, masukkan telepon genggam ke dalam tas (jadi teleponnya ada di dalam tas).' },
        ],
      },
      {
        id: 'L3-35',
        judul: '公園{こうえん}でのお願{ねが}い',
        teks: '公園{こうえん}に、このお知{し}らせがあります。\n公園{こうえん}は朝{あさ}6時{じ}から夜{よる}8時{じ}まで開{あ}いています。小{ちい}さい子{こ}どもがたくさん遊{あそ}んでいますから、公園{こうえん}の中{なか}で自転車{じてんしゃ}に乗{の}らないでください。自転車{じてんしゃ}は、公園{こうえん}の前{まえ}に置{お}いてください。',
        terjemahan: 'Di taman ada pengumuman ini. Taman buka dari pukul 6 pagi sampai pukul 8 malam. Banyak anak kecil bermain, jadi jangan naik sepeda di dalam taman. Sepeda harap diletakkan di depan taman.',
        soal: [
          { id: 'L3-35-1', tanya: '公園{こうえん}で遊{あそ}ぶことができる時間{じかん}はどれですか。', tanyaId: 'Jam berapa bisa bermain di taman?', opsi: ['朝{あさ}5時{じ}', '夜{よる}7時{じ}', '夜{よる}9時{じ}'], benar: 1, pembahasan: '公園は朝6時から夜8時まで開いています = taman buka dari pukul 6 pagi sampai pukul 8 malam (jadi pukul 7 malam masih bisa bermain; pukul 5 pagi dan pukul 9 malam taman tidak buka).' },
          { id: 'L3-35-2', tanya: '自転車{じてんしゃ}はどこに置{お}きますか。', tanyaId: 'Sepeda diletakkan di mana?', opsi: ['公園{こうえん}の中{なか}', '駅{えき}の前{まえ}', '公園{こうえん}の前{まえ}'], benar: 2, pembahasan: '自転車は、公園の前に置いてください = sepeda harap diletakkan di depan taman.' },
        ],
      },
      {
        id: 'L3-36',
        judul: 'リナさんへのメモ',
        teks: 'リナさんの机{つくえ}の上{うえ}に、このメモがあります。\nリナさんへ\n今{いま}からスーパーへ行{い}って、5時{じ}ごろ帰{かえ}ります。雨{あめ}が降{ふ}っていますから、まどを開{あ}けないでください。れいぞうこのケーキは食{た}べてもいいですよ。\nマヤ',
        terjemahan: 'Di atas meja Rina ada memo ini. Untuk Rina. Saya sekarang pergi ke supermarket dan pulang sekitar pukul 5. Sedang hujan, jadi jangan membuka jendela. Kue di kulkas boleh dimakan, ya. Maya',
        soal: [
          { id: 'L3-36-1', tanya: 'マヤさんは何時{なんじ}ごろ帰{かえ}りますか。', tanyaId: 'Maya pulang sekitar pukul berapa?', opsi: ['4時{じ}ごろ', '5時{じ}ごろ', '6時{じ}ごろ'], benar: 1, pembahasan: '今からスーパーへ行って、5時ごろ帰ります = sekarang pergi ke supermarket dan pulang sekitar pukul 5 (yang menulis memo ini adalah Maya).' },
          { id: 'L3-36-2', tanya: 'どうしてまどを開{あ}けてはいけませんか。', tanyaId: 'Mengapa tidak boleh membuka jendela?', opsi: ['外{そと}が寒{さむ}いからです', '外{そと}がうるさいからです', '外{そと}は雨{あめ}だからです'], benar: 2, pembahasan: '雨が降っていますから、まどを開けないでください = sedang hujan, jadi jangan membuka jendela (hujan turun = di luar sedang hujan).' },
        ],
      },
      {
        id: 'L3-37',
        judul: '暑{あつ}い日{ひ}の仕事{しごと}',
        teks: '会社{かいしゃ}に、このお知{し}らせがあります。\n今週{こんしゅう}は毎日{まいにち}とても暑{あつ}いですから、午後{ごご}の休{やす}みは3時{じ}から20分{ぷん}です。水{みず}をたくさん飲{の}んでください。頭{あたま}がいたいときは、すぐリーダーに言{い}って、事務所{じむしょ}で休{やす}んでください。',
        terjemahan: 'Di perusahaan ada pengumuman ini. Minggu ini setiap hari sangat panas, jadi istirahat sore 20 menit mulai pukul 3. Minumlah banyak air. Kalau kepala sakit, segera katakan kepada ketua regu, lalu beristirahatlah di kantor.',
        soal: [
          { id: 'L3-37-1', tanya: '頭{あたま}がいたいときは、どこで休{やす}みますか。', tanyaId: 'Kalau kepala sakit, beristirahat di mana?', opsi: ['食堂{しょくどう}', '事務所{じむしょ}', '寮{りょう}の部屋{へや}'], benar: 1, pembahasan: '頭がいたいときは、すぐリーダーに言って、事務所で休んでください = kalau kepala sakit, segera katakan kepada ketua regu, lalu beristirahatlah di kantor.' },
          { id: 'L3-37-2', tanya: '午後{ごご}の休{やす}みは何時{なんじ}に終{お}わりますか。', tanyaId: 'Istirahat sore selesai pukul berapa?', opsi: ['3時{じ}20分{ぷん}', '3時{じ}', '3時{じ}半{はん}'], benar: 0, pembahasan: '午後の休みは3時から20分です = istirahat sore 20 menit mulai pukul 3 (jadi selesai pukul 3.20).' },
        ],
      },
      {
        id: 'L3-38',
        judul: '寮{りょう}の夜{よる}は静{しず}かに',
        teks: '寮{りょう}に、このお知{し}らせがあります。\nこの寮{りょう}には、朝{あさ}5時{じ}から仕事{しごと}の人{ひと}がいます。その人{ひと}は夜{よる}早{はや}く寝{ね}ますから、10時{じ}からは静{しず}かにしてください。音楽{おんがく}を聞{き}くときは、イヤホンを使{つか}ってください。',
        terjemahan: 'Di asrama ada pengumuman ini. Di asrama ini ada orang yang bekerja mulai pukul 5 pagi. Orang itu tidur cepat pada malam hari, jadi mulai pukul 10 harap tenang. Saat mendengarkan musik, pakailah earphone.',
        soal: [
          { id: 'L3-38-1', tanya: 'どうして夜{よる}10時{じ}からは静{しず}かな時間{じかん}ですか。', tanyaId: 'Mengapa mulai pukul 10 malam adalah waktu tenang?', opsi: ['寮{りょう}の人{ひと}が夜{よる}勉強{べんきょう}するからです', '寮{りょう}に小{ちい}さい子{こ}どもがいるからです', '朝{あさ}早{はや}く仕事{しごと}がある人{ひと}がいるからです'], benar: 2, pembahasan: '朝5時から仕事の人がいます。その人は夜早く寝ますから、10時からは静かにしてください = ada orang yang bekerja mulai pukul 5 pagi; orang itu tidur cepat pada malam hari, jadi mulai pukul 10 harap tenang (jadi alasannya ada orang yang bekerja pagi-pagi sekali).' },
          { id: 'L3-38-2', tanya: '音楽{おんがく}を聞{き}くとき、どうしますか。', tanyaId: 'Saat mendengarkan musik, apa yang harus dilakukan?', opsi: ['部屋{へや}のドアを閉{し}めます', 'イヤホンを使{つか}います', '小{ちい}さい音{おと}で聞{き}きます'], benar: 1, pembahasan: '音楽を聞くときは、イヤホンを使ってください = saat mendengarkan musik, pakailah earphone.' },
        ],
      },
      {
        id: 'L3-39',
        judul: '山{やま}へ行{い}きませんか',
        teks: 'これは、森{もり}さんから寮{りょう}のみんなにきたメールです。\n来週{らいしゅう}の日曜日{にちようび}、みんなで山{やま}へ行{い}きませんか。朝{あさ}8時{じ}に駅{えき}の前{まえ}で会{あ}いましょう。山{やま}の上{うえ}には店{みせ}がありませんから、お弁当{べんとう}と飲{の}み物{もの}を持{も}って来{き}てください。\n森{もり}',
        terjemahan: 'Ini adalah email dari Mori kepada semua penghuni asrama. Hari Minggu depan, maukah kita semua pergi ke gunung? Mari bertemu di depan stasiun pukul 8 pagi. Di atas gunung tidak ada toko, jadi bawalah bento dan minuman. Mori',
        soal: [
          { id: 'L3-39-1', tanya: '日曜日{にちようび}の朝{あさ}、どこで会{あ}いますか。', tanyaId: 'Minggu pagi, bertemu di mana?', opsi: ['山{やま}の上{うえ}', '駅{えき}の前{まえ}', '店{みせ}の前{まえ}'], benar: 1, pembahasan: '朝8時に駅の前で会いましょう = mari bertemu di depan stasiun pukul 8 pagi.' },
          { id: 'L3-39-2', tanya: 'どうしてお弁当{べんとう}を持{も}って行{い}きますか。', tanyaId: 'Mengapa membawa bento?', opsi: ['山{やま}の上{うえ}の店{みせ}は高{たか}いからです', 'みんなでいっしょに食{た}べたいからです', '山{やま}の上{うえ}で買{か}い物{もの}ができないからです'], benar: 2, pembahasan: '山の上には店がありませんから、お弁当と飲み物を持って来てください = di atas gunung tidak ada toko, jadi bawalah bento dan minuman (tidak ada toko = tidak bisa berbelanja di sana).' },
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
        teks: '会社{かいしゃ}に、このお知{し}らせがあります。\nけいたい電話{でんわ}はロッカーに入{い}れてください。仕事{しごと}の時間{じかん}と10時{じ}の休{やす}みは、けいたい電話{でんわ}を使{つか}ってはいけません。昼休{ひるやす}みは使{つか}ってもいいです。かぎは事務所{じむしょ}にあります。',
        terjemahan: 'Di perusahaan ada pengumuman ini. Telepon genggam harap dimasukkan ke loker. Pada jam kerja dan istirahat pukul 10, telepon genggam tidak boleh dipakai. Pada istirahat siang boleh dipakai. Kuncinya ada di kantor.',
        soal: [
          { id: 'L3-41-1', tanya: 'けいたい電話{でんわ}は、いつ使{つか}ってもいいですか。', tanyaId: 'Kapan telepon genggam boleh dipakai?', opsi: ['昼{ひる}ごはんの時間{じかん}', '10時{じ}の休{やす}み', '仕事{しごと}の時間{じかん}'], benar: 0, pembahasan: '仕事の時間と10時の休みは、けいたい電話を使ってはいけません。昼休みは使ってもいいです = pada jam kerja dan istirahat pukul 10 telepon genggam tidak boleh dipakai; pada istirahat siang boleh dipakai (istirahat siang = waktu makan siang).' },
          { id: 'L3-41-2', tanya: 'ロッカーのかぎはどこにありますか。', tanyaId: 'Kunci loker ada di mana?', opsi: ['会社{かいしゃ}の受付{うけつけ}', '事務所{じむしょ}', '食堂{しょくどう}'], benar: 1, pembahasan: 'かぎは事務所にあります = kuncinya ada di kantor.' },
        ],
      },
      {
        id: 'L3-42',
        judul: '木村{きむら}さんと海{うみ}でつり',
        teks: '日曜日{にちようび}、会社{かいしゃ}の木村{きむら}さんと海{うみ}へつりに行{い}きました。朝{あさ}は魚{さかな}がたくさんいますから、5時{じ}に寮{りょう}を出{で}ました。わたしは小{ちい}さい魚{さかな}を3匹{びき}つりました。木村{きむら}さんは8匹{ぴき}つりました。',
        terjemahan: 'Hari Minggu saya pergi memancing ke laut bersama Kimura dari kantor. Pagi hari ikannya banyak, jadi kami berangkat dari asrama pukul 5. Saya mendapat tiga ekor ikan kecil. Kimura mendapat delapan ekor.',
        soal: [
          { id: 'L3-42-1', tanya: 'わたしは魚{さかな}を何匹{なんびき}つりましたか。', tanyaId: 'Penulis mendapat berapa ekor ikan?', opsi: ['5匹{ひき}', '3匹{びき}', '8匹{ぴき}'], benar: 1, pembahasan: 'わたしは小さい魚を3匹つりました = saya mendapat tiga ekor ikan kecil.' },
          { id: 'L3-42-2', tanya: 'どうして5時{じ}に寮{りょう}を出{で}ましたか。', tanyaId: 'Mengapa mereka berangkat dari asrama pukul 5?', opsi: ['朝{あさ}は魚{さかな}がたくさんいるからです', '海{うみ}が寮{りょう}から遠{とお}いからです', '昼{ひる}から仕事{しごと}があるからです'], benar: 0, pembahasan: '朝は魚がたくさんいますから、5時に寮を出ました = pagi hari ikannya banyak, jadi berangkat dari asrama pukul 5.' },
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
        teks: '山田{やまだ}先生{せんせい}、こんばんは。あしたは仕事{しごと}が夜{よる}8時{じ}までありますから、日本語{にほんご}の教室{きょうしつ}を休{やす}みます。宿題{しゅくだい}は来週{らいしゅう}の火曜日{かようび}に出{だ}します。すみません。',
        terjemahan: 'Yamada-sensei, selamat malam. Besok saya ada pekerjaan sampai pukul 8 malam, jadi saya tidak masuk kelas bahasa Jepang. PR akan saya kumpulkan hari Selasa minggu depan. Mohon maaf.',
        soal: [
          { id: 'L3-44-1', tanya: 'どうしてあした教室{きょうしつ}を休{やす}みますか。', tanyaId: 'Mengapa besok ia tidak masuk kelas?', opsi: ['仕事{しごと}が夜{よる}まであるからです', '宿題{しゅくだい}をしていないからです', 'かぜをひいているからです'], benar: 0, pembahasan: 'あしたは仕事が夜8時までありますから、日本語の教室を休みます = besok ada pekerjaan sampai pukul 8 malam, jadi tidak masuk kelas bahasa Jepang.' },
          { id: 'L3-44-2', tanya: '宿題{しゅくだい}はいつ出{だ}しますか。', tanyaId: 'Kapan PR dikumpulkan?', opsi: ['あしたの夜{よる}', '今週{こんしゅう}の火曜日{かようび}', '来週{らいしゅう}の火曜日{かようび}'], benar: 2, pembahasan: '宿題は来週の火曜日に出します = PR dikumpulkan hari Selasa minggu depan.' },
        ],
      },
      {
        id: 'L3-45',
        judul: '寮{りょう}の食堂{しょくどう}のそうじ',
        teks: '寮{りょう}の食堂{しょくどう}に、このお知{し}らせがあります。\n食{た}べたあとで、さらはテーブルに置{お}いてください。毎週{まいしゅう}日曜日{にちようび}の朝{あさ}9時{じ}から、みんなで食堂{しょくどう}をそうじします。日曜日{にちようび}に仕事{しごと}がある人{ひと}は、土曜日{どようび}にそうじをしてください。',
        terjemahan: 'Di ruang makan asrama ada pengumuman ini. Sesudah makan, letakkan piring di meja. Setiap hari Minggu mulai pukul 9 pagi, semua orang bersama-sama membersihkan ruang makan. Orang yang bekerja pada hari Minggu, silakan membersihkannya pada hari Sabtu.',
        soal: [
          { id: 'L3-45-1', tanya: '食{た}べたあとで、何{なに}をしますか。', tanyaId: 'Sesudah makan, apa yang harus dilakukan?', opsi: ['さらをあらいます', 'さらをテーブルに置{お}きます', '食堂{しょくどう}をそうじします'], benar: 1, pembahasan: '食べたあとで、さらはテーブルに置いてください = sesudah makan, letakkan piring di meja.' },
          { id: 'L3-45-2', tanya: '日曜日{にちようび}に仕事{しごと}がある人{ひと}は、いつそうじをしますか。', tanyaId: 'Orang yang bekerja pada hari Minggu, kapan membersihkan ruang makan?', opsi: ['日曜日{にちようび}の前{まえ}の日{ひ}', '日曜日{にちようび}の夜{よる}', '日曜日{にちようび}の次{つぎ}の日{ひ}'], benar: 0, pembahasan: '日曜日に仕事がある人は、土曜日にそうじをしてください = orang yang bekerja pada hari Minggu, silakan membersihkan pada hari Sabtu (Sabtu = sehari sebelum Minggu).' },
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
        judul: '京都{きょうと}への旅行{りょこう}',
        teks: 'わたしたちは来月{らいげつ}、京都{きょうと}へ旅行{りょこう}します。土曜日{どようび}の朝{あさ}、新幹線{しんかんせん}で行{い}って、ホテルに荷物{にもつ}を置{お}きます。それから、お寺{てら}を見{み}に行{い}きます。日曜日{にちようび}の午後{ごご}6時{じ}ごろ帰{かえ}ります。',
        terjemahan: 'Bulan depan kami akan berwisata ke Kyoto. Sabtu pagi kami pergi dengan Shinkansen dan meletakkan barang di hotel. Setelah itu, kami pergi melihat kuil. Kami pulang hari Minggu sekitar pukul 6 sore.',
        soal: [
          { id: 'L4-1-1', tanya: '京都{きょうと}へ行{い}くのはいつですか。', tanyaId: 'Kapan mereka pergi ke Kyoto?', opsi: ['今週{こんしゅう}', '来月{らいげつ}', '来年{らいねん}'], benar: 1, pembahasan: '来月 = bulan depan.' },
          { id: 'L4-1-2', tanya: 'ホテルに荷物{にもつ}を置{お}いたあと、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan setelah meletakkan barang di hotel?', opsi: ['昼{ひる}ごはんを食{た}べます', 'お寺{てら}へ行{い}きます', '家{いえ}へ帰{かえ}ります'], benar: 1, pembahasan: 'それから、お寺を見に行きます = setelah itu pergi melihat kuil.' },
        ],
      },
      {
        id: 'L4-2',
        judul: 'アルバイト',
        teks: 'ユキさんは大学{だいがく}の近{ちか}くの喫茶店{きっさてん}でアルバイトをしています。月曜日{げつようび}から金曜日{きんようび}まで、午後{ごご}4時{じ}から8時{じ}まで働{はたら}きます。土曜日{どようび}と日曜日{にちようび}は休{やす}みです。アルバイトは1時間{じかん}1000円{えん}です。',
        terjemahan: 'Yuki bekerja paruh waktu di kafe dekat universitas. Dari Senin sampai Jumat, ia bekerja pukul 4 sore sampai 8 malam. Sabtu dan Minggu libur. Kerja paruh waktunya dibayar 1.000 yen per jam.',
        soal: [
          { id: 'L4-2-1', tanya: 'ユキさんはどこで働{はたら}いていますか。', tanyaId: 'Di mana Yuki bekerja?', opsi: ['本屋{ほんや}', '喫茶店{きっさてん}', '病院{びょういん}'], benar: 1, pembahasan: '喫茶店 = kedai kopi / kafe.' },
          { id: 'L4-2-2', tanya: 'ユキさんは一日{いちにち}いくらもらいますか。', tanyaId: 'Berapa yang diterima Yuki dalam sehari?', opsi: ['1000円{えん}', '8000円{えん}', '4000円{えん}'], benar: 2, pembahasan: '午後4時から8時まで働きます…アルバイトは1時間1000円です = bekerja dari pukul 4 sampai 8 malam, dan kerja paruh waktunya 1.000 yen per jam (4 jam × 1.000 yen = 4.000 yen sehari).' },
        ],
      },
      {
        id: 'L4-3',
        judul: '忘{わす}れ物{もの}',
        teks: '今朝{けさ}、電車{でんしゃ}の中{なか}にかばんを忘{わす}れました。駅員{えきいん}さんに話{はな}しました。駅員{えきいん}さんは、かばんは駅{えき}の事務所{じむしょ}にあると言{い}いました。事務所{じむしょ}は夜{よる}7時{じ}までです。学校{がっこう}は午後{ごご}5時{じ}に終{お}わります。学校{がっこう}が終{お}わってから、駅{えき}まで20分{ぷん}歩{ある}いて、取{と}りに行{い}きます。',
        terjemahan: 'Pagi ini saya meninggalkan tas di dalam kereta. Ketika saya memberi tahu petugas stasiun, ia mengatakan tas itu ada di kantor stasiun. Kantornya buka sampai pukul 7 malam. Sekolah selesai pukul 5 sore. Setelah sekolah selesai, saya berjalan 20 menit ke stasiun untuk mengambilnya.',
        soal: [
          { id: 'L4-3-1', tanya: 'どこにかばんを忘{わす}れましたか。', tanyaId: 'Di mana tas tertinggal?', opsi: ['学校{がっこう}', '電車{でんしゃ}の中{なか}', '駅{えき}の事務所{じむしょ}'], benar: 1, pembahasan: '電車の中にかばんを忘れました = tas tertinggal di dalam kereta.' },
          { id: 'L4-3-2', tanya: 'わたしは何時{なんじ}ごろ駅{えき}に着{つ}きますか。', tanyaId: 'Kira-kira pukul berapa penulis tiba di stasiun?', opsi: ['7時{じ}ごろ', '4時{じ}40分{ぷん}ごろ', '5時{じ}20分{ぷん}ごろ'], benar: 2, pembahasan: '学校は午後5時に終わります。学校が終わってから、駅まで20分歩いて = sekolah selesai pukul 5 sore, dan setelah itu saya berjalan 20 menit ke stasiun (jadi tiba sekitar pukul 5.20).' },
        ],
      },
      {
        id: 'L4-4',
        judul: 'わたしの今週{こんしゅう}',
        teks: '今週{こんしゅう}は忙{いそが}しいです。月曜日{げつようび}と水曜日{すいようび}は日本語{にほんご}のクラスがあります。クラスは夜{よる}7時{じ}から1時間{じかん}半{はん}です。木曜日{もくようび}は午後{ごご}3時{じ}に病院{びょういん}へ行{い}きます。土曜日{どようび}と日曜日{にちようび}は家{いえ}でゆっくり休{やす}みたいです。',
        terjemahan: 'Minggu ini saya sibuk. Senin dan Rabu ada kelas bahasa Jepang. Kelasnya mulai pukul 7 malam selama satu setengah jam. Kamis pukul 3 sore saya pergi ke rumah sakit. Sabtu dan Minggu saya ingin beristirahat dengan santai di rumah.',
        soal: [
          { id: 'L4-4-1', tanya: '日本語{にほんご}のクラスは何時{なんじ}に終{お}わりますか。', tanyaId: 'Kelas bahasa Jepang selesai pukul berapa?', opsi: ['8時{じ}半{はん}', '8時{じ}', '7時{じ}半{はん}'], benar: 0, pembahasan: 'クラスは夜7時から1時間半です = kelasnya mulai pukul 7 malam selama satu setengah jam (jadi selesai pukul 8.30).' },
          { id: 'L4-4-2', tanya: '木曜日{もくようび}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan hari Kamis?', opsi: ['日本語{にほんご}のクラスに行{い}きます', '病院{びょういん}へ行{い}きます', '家{いえ}で休{やす}みます'], benar: 1, pembahasan: '木曜日は午後3時に病院へ行きます = Kamis pergi ke rumah sakit.' },
        ],
      },
      {
        id: 'L4-5',
        judul: 'バスの時間{じかん}',
        teks: 'このバスは駅{えき}から大学{だいがく}まで行{い}きます。朝{あさ}は10分{ぷん}に1本{ぽん}ありますが、昼{ひる}は30分{ぷん}に1本{ぽん}です。大学{だいがく}まで25分{ふん}かかります。わたしは毎朝{まいあさ}8時{じ}のバスに乗{の}ります。',
        terjemahan: 'Bus ini pergi dari stasiun ke universitas. Pagi hari ada satu bus setiap 10 menit, tetapi siang hari satu bus setiap 30 menit. Sampai ke universitas memakan waktu 25 menit. Setiap pagi saya naik bus pukul 8.',
        soal: [
          { id: 'L4-5-1', tanya: '昼{ひる}は何分{なんぷん}に1本{ぽん}バスがありますか。', tanyaId: 'Siang hari ada bus setiap berapa menit?', opsi: ['10分{ぷん}に1本{ぽん}', '25分{ふん}に1本{ぽん}', '30分{ぷん}に1本{ぽん}'], benar: 2, pembahasan: '昼は30分に1本です = siang hari satu bus setiap 30 menit.' },
          { id: 'L4-5-2', tanya: 'わたしは毎朝{まいあさ}何時{なんじ}何分{なんぷん}に大学{だいがく}に着{つ}きますか。', tanyaId: 'Setiap pagi penulis tiba di universitas pukul berapa?', opsi: ['8時{じ}10分{ぷん}', '8時{じ}25分{ふん}', '8時{じ}30分{ぷん}'], benar: 1, pembahasan: '大学まで25分かかります。わたしは毎朝8時のバスに乗ります = sampai ke universitas memakan waktu 25 menit, dan setiap pagi saya naik bus pukul 8 (jadi tiba pukul 8.25).' },
        ],
      },
      {
        id: 'L4-6',
        judul: '新{あたら}しいアパート',
        teks: '先月{せんげつ}から新{あたら}しいアパートに住{す}んでいます。前{まえ}のアパートより駅{えき}に近{ちか}くて、歩{ある}いて5分{ふん}です。でも、部屋{へや}は少{すこ}しせまいです。このアパートは1か月{げつ}6万円{まんえん}です。',
        terjemahan: 'Sejak bulan lalu saya tinggal di apartemen baru. Lebih dekat ke stasiun daripada apartemen lama, lima menit jalan kaki. Tetapi kamarnya agak sempit. Apartemen ini 60.000 yen per bulan.',
        soal: [
          { id: 'L4-6-1', tanya: '新{あたら}しいアパートから駅{えき}までどのぐらいですか。', tanyaId: 'Seberapa jauh dari apartemen baru ke stasiun?', opsi: ['歩{ある}いて5分{ふん}', '歩{ある}いて15分{ふん}', 'バスで5分{ふん}'], benar: 0, pembahasan: '歩いて5分です = lima menit jalan kaki.' },
          { id: 'L4-6-2', tanya: '新{あたら}しいアパートはどうですか。', tanyaId: 'Bagaimana apartemen baru itu?', opsi: ['駅{えき}に近{ちか}いですが、部屋{へや}は少{すこ}しせまいです', '駅{えき}から遠{とお}いですが、部屋{へや}は広{ひろ}いです', '安{やす}くて、部屋{へや}も広{ひろ}いです'], benar: 0, pembahasan: '駅に近くて…でも、部屋は少しせまいです = dekat stasiun, tetapi kamarnya agak sempit.' },
        ],
      },
      {
        id: 'L4-7',
        judul: '電話{でんわ}のメッセージ',
        teks: 'これは、リンさんからわたしにきた電話{でんわ}のメッセージです。\n「もしもし、リンです。今日{きょう}の映画{えいが}は7時{じ}からですね。わたしは仕事{しごと}が6時{じ}半{はん}に終{お}わりますから、駅{えき}の前{まえ}で6時{じ}50分{ぷん}に会{あ}いましょう。」',
        terjemahan: 'Ini pesan telepon dari Rin untuk saya. "Halo, ini Rin. Film hari ini mulai pukul tujuh, ya. Pekerjaan saya selesai pukul setengah tujuh, jadi mari bertemu di depan stasiun pukul 6.50."',
        soal: [
          { id: 'L4-7-1', tanya: 'リンさんの仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Pukul berapa pekerjaan Rin selesai?', opsi: ['6時{じ}', '6時{じ}半{はん}', '7時{じ}'], benar: 1, pembahasan: 'わたしは仕事が6時半に終わります = pekerjaan saya selesai pukul setengah tujuh (6.30).' },
          { id: 'L4-7-2', tanya: '二人{ふたり}は映画{えいが}が始{はじ}まる何分{なんぷん}前{まえ}に会{あ}いますか。', tanyaId: 'Berapa menit sebelum film mulai mereka berdua bertemu?', opsi: ['30分{ぷん}前{まえ}', '20分{ぷん}前{まえ}', '10分{ぷん}前{まえ}'], benar: 2, pembahasan: '今日の映画は7時からですね…駅の前で6時50分に会いましょう = film hari ini mulai pukul 7 … mari bertemu di depan stasiun pukul 6.50 (jadi 10 menit sebelum film mulai).' },
        ],
      },
      {
        id: 'L4-8',
        judul: '学校{がっこう}の旅行{りょこう}',
        teks: '学校{がっこう}に、このお知{し}らせがあります。\n来月{らいげつ}、学校{がっこう}の旅行{りょこう}で海{うみ}へ行{い}きます。朝{あさ}8時{じ}に学校{がっこう}の前{まえ}にあつまって、バスで行{い}きます。海{うみ}まではバスで2時間{じかん}です。昼{ひる}ごはんはお弁当{べんとう}を持{も}っていきます。水着{みずぎ}とタオルもわすれないでください。',
        terjemahan: 'Di sekolah ada pengumuman ini. Bulan depan, dalam wisata sekolah, kami pergi ke laut. Kami berkumpul di depan sekolah pukul 8 pagi dan pergi naik bus. Sampai ke laut naik bus dua jam. Untuk makan siang, kami membawa bekal. Jangan lupa baju renang dan handuk.',
        soal: [
          { id: 'L4-8-1', tanya: '何時{なんじ}ごろ海{うみ}に着{つ}きますか。', tanyaId: 'Kira-kira pukul berapa tiba di laut?', opsi: ['10時{じ}ごろ', '8時{じ}ごろ', '2時{じ}ごろ'], benar: 0, pembahasan: '朝8時に学校の前にあつまって、バスで行きます。海まではバスで2時間です = berkumpul di depan sekolah pukul 8 pagi lalu naik bus, dan sampai ke laut naik bus dua jam (jadi tiba sekitar pukul 10).' },
          { id: 'L4-8-2', tanya: '昼{ひる}ごはんはどうしますか。', tanyaId: 'Bagaimana dengan makan siang?', opsi: ['レストランで食{た}べます', 'お弁当{べんとう}を持{も}っていきます', '海{うみ}の近{ちか}くの店{みせ}で買{か}います'], benar: 1, pembahasan: '昼ごはんはお弁当を持っていきます = membawa bekal.' },
        ],
      },
      {
        id: 'L4-9',
        judul: 'アルバイトがしたいです',
        teks: 'わたしは1週間{しゅうかん}に3日{みっか}アルバイトをしたいです。学校{がっこう}は午後{ごご}3時{じ}に終{お}わりますから、月曜日{げつようび}から金曜日{きんようび}までは4時{じ}からできます。土曜日{どようび}は朝{あさ}からでもいいです。日曜日{にちようび}は家族{かぞく}と出{で}かけますから、できません。',
        terjemahan: 'Saya ingin kerja paruh waktu tiga hari dalam seminggu. Sekolah selesai pukul 3 sore, jadi Senin sampai Jumat saya bisa mulai pukul 4. Hari Sabtu boleh mulai pagi. Hari Minggu saya pergi bersama keluarga, jadi tidak bisa.',
        soal: [
          { id: 'L4-9-1', tanya: '月曜日{げつようび}から金曜日{きんようび}までは何時{なんじ}からアルバイトができますか。', tanyaId: 'Senin–Jumat bisa kerja mulai pukul berapa?', opsi: ['3時{じ}', '4時{じ}', '朝{あさ}'], benar: 1, pembahasan: '月曜日から金曜日までは4時からできます = mulai pukul 4.' },
          { id: 'L4-9-2', tanya: 'どうして日曜日{にちようび}はできませんか。', tanyaId: 'Mengapa tidak bisa hari Minggu?', opsi: ['学校{がっこう}があるからです', '家族{かぞく}と出{で}かけるからです', '店{みせ}が休{やす}みだからです'], benar: 1, pembahasan: '日曜日は家族と出かけますから = karena pergi bersama keluarga.' },
        ],
      },
      {
        id: 'L4-10',
        judul: '料理{りょうり}教室{きょうしつ}',
        teks: '駅{えき}に、このお知{し}らせがあります。\n駅{えき}の近{ちか}くに料理{りょうり}教室{きょうしつ}があります。毎週{まいしゅう}金曜日{きんようび}の夜{よる}7時{じ}から9時{じ}まで、日本{にほん}の料理{りょうり}を作{つく}ります。1回{かい}2000円{えん}です。エプロンを持{も}ってきてください。',
        terjemahan: 'Di stasiun ada pengumuman ini. Di dekat stasiun ada kelas memasak. Setiap Jumat malam pukul 7 sampai 9, peserta memasak masakan Jepang. Sekali datang 2.000 yen. Harap bawa celemek.',
        soal: [
          { id: 'L4-10-1', tanya: '料理{りょうり}教室{きょうしつ}は何時間{なんじかん}ですか。', tanyaId: 'Berapa jam kelas memasaknya?', opsi: ['1時間{じかん}', '2時間{じかん}', '3時間{じかん}'], benar: 1, pembahasan: '7時から9時まで = dari pukul 7 sampai 9, jadi 2 jam.' },
          { id: 'L4-10-2', tanya: '料理{りょうり}教室{きょうしつ}に2回{かい}行{い}くと、全部{ぜんぶ}でいくらですか。', tanyaId: 'Kalau datang ke kelas memasak dua kali, semuanya berapa?', opsi: ['4000円{えん}', '2000円{えん}', '1000円{えん}'], benar: 0, pembahasan: '1回2000円です = sekali datang 2.000 yen (jadi dua kali 4.000 yen).' },
        ],
      },
      {
        id: 'L4-11',
        judul: '今週{こんしゅう}の仕事{しごと}',
        teks: '今週{こんしゅう}、わたしは月曜日{げつようび}から水曜日{すいようび}まで朝{あさ}の仕事{しごと}です。朝{あさ}6時{じ}から午後{ごご}3時{じ}まで働{はたら}きます。木曜日{もくようび}と金曜日{きんようび}は夜{よる}の仕事{しごと}で、夜{よる}10時{じ}からです。土曜日{どようび}は休{やす}みです。',
        terjemahan: 'Minggu ini saya bekerja sif pagi dari Senin sampai Rabu. Saya bekerja dari pukul 6 pagi sampai pukul 3 sore. Kamis dan Jumat saya sif malam, mulai pukul 10 malam. Hari Sabtu libur.',
        soal: [
          { id: 'L4-11-1', tanya: '水曜日{すいようび}は何時{なんじ}から働{はたら}きますか。', tanyaId: 'Hari Rabu mulai bekerja pukul berapa?', opsi: ['朝{あさ}6時{じ}', '午後{ごご}3時{じ}', '夜{よる}10時{じ}'], benar: 0, pembahasan: '月曜日から水曜日まで朝の仕事です。朝6時から午後3時まで働きます = Senin sampai Rabu sif pagi, pukul 6 pagi sampai 3 sore.' },
          { id: 'L4-11-2', tanya: '今週{こんしゅう}、夜{よる}の仕事{しごと}は何日{なんにち}ありますか。', tanyaId: 'Minggu ini ada berapa hari sif malam?', opsi: ['3日{みっか}', '5日{いつか}', '2日{ふつか}'], benar: 2, pembahasan: '木曜日と金曜日は夜の仕事で = Kamis dan Jumat sif malam (jadi dua hari).' },
        ],
      },
      {
        id: 'L4-12',
        judul: 'マリアさんのうちへ',
        teks: '日曜日{にちようび}にマリアさんのうちへ遊{あそ}びに行{い}きます。マリアさんのうちは山田{やまだ}駅{えき}から歩{ある}いて15分{ふん}です。わたしは11時{じ}に山田{やまだ}駅{えき}に着{つ}きます。マリアさんは駅{えき}の前{まえ}で待{ま}っています。うちでいっしょに昼{ひる}ごはんを作{つく}ります。',
        terjemahan: 'Hari Minggu saya akan main ke rumah Maria. Rumah Maria 15 menit jalan kaki dari Stasiun Yamada. Saya tiba di Stasiun Yamada pukul 11. Maria menunggu di depan stasiun. Kami akan memasak makan siang bersama di rumahnya.',
        soal: [
          { id: 'L4-12-1', tanya: 'わたしは何時{なんじ}ごろマリアさんのうちに着{つ}きますか。', tanyaId: 'Kira-kira pukul berapa penulis tiba di rumah Maria?', opsi: ['11時{じ}ごろ', '10時{じ}45分{ふん}ごろ', '11時{じ}15分{ふん}ごろ'], benar: 2, pembahasan: 'マリアさんのうちは山田駅から歩いて15分です。わたしは11時に山田駅に着きます = rumah Maria 15 menit jalan kaki dari Stasiun Yamada, dan saya tiba di Stasiun Yamada pukul 11 (jadi tiba di rumah Maria sekitar pukul 11.15).' },
          { id: 'L4-12-2', tanya: 'マリアさんのうちで何{なに}をしますか。', tanyaId: 'Apa yang dilakukan di rumah Maria?', opsi: ['昼{ひる}ごはんを作{つく}ります', '映画{えいが}を見{み}ます', '昼{ひる}ごはんを食{た}べに出{で}かけます'], benar: 0, pembahasan: 'うちでいっしょに昼ごはんを作ります = memasak makan siang bersama di rumah.' },
        ],
      },
      {
        id: 'L4-13',
        judul: '会社{かいしゃ}の旅行{りょこう}',
        teks: '来月{らいげつ}の15日{にち}に会社{かいしゃ}の旅行{りょこう}があります。朝{あさ}7時{じ}に会社{かいしゃ}の前{まえ}からバスで出{で}ます。昼{ひる}は山{やま}の上{うえ}のレストランで食{た}べます。旅行{りょこう}のお金{かね}は一人{ひとり}5000円{えん}ですが、会社{かいしゃ}が3000円{えん}出{だ}します。夜{よる}8時{じ}ごろ会社{かいしゃ}に帰{かえ}ります。',
        terjemahan: 'Tanggal 15 bulan depan ada wisata perusahaan. Bus berangkat pukul 7 pagi dari depan kantor. Siang hari makan di restoran di atas gunung. Biaya wisatanya 5.000 yen per orang, tetapi perusahaan membayar 3.000 yen. Sekitar pukul 8 malam kembali ke kantor.',
        soal: [
          { id: 'L4-13-1', tanya: 'バスは何時{なんじ}に、どこから出{で}ますか。', tanyaId: 'Bus berangkat pukul berapa dan dari mana?', opsi: ['8時{じ}に会社{かいしゃ}の前{まえ}から', '8時{じ}に駅{えき}の前{まえ}から', '7時{じ}に会社{かいしゃ}の前{まえ}から'], benar: 2, pembahasan: '朝7時に会社の前からバスで出ます = bus berangkat pukul 7 pagi dari depan kantor.' },
          { id: 'L4-13-2', tanya: '旅行{りょこう}のお金{かね}は、一人{ひとり}いくら払{はら}いますか。', tanyaId: 'Berapa biaya wisata yang dibayar tiap orang?', opsi: ['3000円{えん}', '2000円{えん}', '8000円{えん}'], benar: 1, pembahasan: '旅行のお金は一人5000円ですが、会社が3000円出します = biaya wisatanya 5.000 yen per orang, tetapi perusahaan membayar 3.000 yen (jadi tiap orang membayar 2.000 yen).' },
        ],
      },
      {
        id: 'L4-14',
        judul: '日本語{にほんご}のテスト',
        teks: '教室{きょうしつ}に、このお知{し}らせがあります。\n来週{らいしゅう}の水曜日{すいようび}に日本語{にほんご}のテストがあります。テストは9時{じ}から11時{じ}までです。9時{じ}より前{まえ}に教室{きょうしつ}に入{はい}ってください。テストの時{とき}、辞書{じしょ}を使{つか}ってはいけません。えんぴつを2本{ほん}持{も}ってきてください。',
        terjemahan: 'Di ruang kelas ada pengumuman ini. Rabu depan ada ujian bahasa Jepang. Ujian dari pukul 9 sampai pukul 11. Masuklah ke kelas sebelum pukul 9. Saat ujian tidak boleh memakai kamus. Bawalah dua pensil.',
        soal: [
          { id: 'L4-14-1', tanya: 'テストはいつ終{お}わりますか。', tanyaId: 'Kapan ujian selesai?', opsi: ['今週{こんしゅう}の水曜日{すいようび}の11時{じ}', '来週{らいしゅう}の水曜日{すいようび}の11時{じ}', '今週{こんしゅう}の水曜日{すいようび}の9時{じ}'], benar: 1, pembahasan: '来週の水曜日に日本語のテストがあります。テストは9時から11時までです = Rabu depan ada ujian bahasa Jepang, dan ujiannya dari pukul 9 sampai pukul 11 (jadi selesai Rabu depan pukul 11).' },
          { id: 'L4-14-2', tanya: 'えんぴつを何本{なんぼん}持{も}っていきますか。', tanyaId: 'Berapa pensil yang dibawa?', opsi: ['2本{ほん}', '1本{ぽん}', '3本{ぼん}'], benar: 0, pembahasan: 'えんぴつを2本持ってきてください = bawalah dua pensil.' },
        ],
      },
      {
        id: 'L4-15',
        judul: '姉{あね}の結婚{けっこん}パーティー',
        teks: '来月{らいげつ}の3日{みっか}は姉{あね}の結婚{けっこん}パーティーです。パーティーはジャカルタのホテルで、午前{ごぜん}10時{じ}からです。わたしは1日{ついたち}に日本{にほん}を出{で}て、国{くに}へ帰{かえ}ります。6日{むいか}にまた日本{にほん}へ来{き}ます。',
        terjemahan: 'Tanggal 3 bulan depan adalah pesta pernikahan kakak perempuan saya. Pestanya di sebuah hotel di Jakarta, mulai pukul 10 pagi. Saya berangkat dari Jepang tanggal 1 dan pulang ke negara asal. Tanggal 6 saya kembali ke Jepang.',
        soal: [
          { id: 'L4-15-1', tanya: '姉{あね}のパーティーはいつですか。', tanyaId: 'Kapan pesta kakak perempuan itu?', opsi: ['来月{らいげつ}の1日{ついたち}', '来月{らいげつ}の6日{むいか}', '来月{らいげつ}の3日{みっか}'], benar: 2, pembahasan: '来月の3日は姉の結婚パーティーです = tanggal 3 bulan depan adalah pesta pernikahan kakak.' },
          { id: 'L4-15-2', tanya: 'わたしはいつ日本{にほん}を出{で}ますか。', tanyaId: 'Kapan penulis berangkat dari Jepang?', opsi: ['来月{らいげつ}の3日{みっか}', '来月{らいげつ}の6日{むいか}', '来月{らいげつ}の1日{ついたち}'], benar: 2, pembahasan: 'わたしは1日に日本を出て = saya berangkat dari Jepang tanggal 1.' },
        ],
      },
      {
        id: 'L4-16',
        judul: 'スポーツセンター',
        teks: '町{まち}のスポーツセンターは火曜日{かようび}から日曜日{にちようび}まで開{あ}いています。月曜日{げつようび}は休{やす}みです。時間{じかん}は朝{あさ}9時{じ}から夜{よる}9時{じ}までです。1回{かい}300円{えん}ですが、子{こ}どもは100円{えん}です。',
        terjemahan: 'Pusat olahraga kota buka dari Selasa sampai Minggu. Hari Senin libur. Jam bukanya dari pukul 9 pagi sampai pukul 9 malam. Sekali masuk 300 yen, tetapi anak-anak 100 yen.',
        soal: [
          { id: 'L4-16-1', tanya: 'スポーツセンターが休{やす}みの日{ひ}はいつですか。', tanyaId: 'Kapan pusat olahraga libur?', opsi: ['月曜日{げつようび}', '火曜日{かようび}', '日曜日{にちようび}'], benar: 0, pembahasan: '月曜日は休みです = hari Senin libur.' },
          { id: 'L4-16-2', tanya: 'お父{とう}さん一人{ひとり}と子{こ}ども一人{ひとり}で、いくらですか。', tanyaId: 'Seorang ayah dan seorang anak, berapa totalnya?', opsi: ['300円{えん}', '400円{えん}', '600円{えん}'], benar: 1, pembahasan: '1回300円ですが、子どもは100円です = sekali masuk 300 yen, tetapi anak-anak 100 yen (ayah 300 yen + anak 100 yen = 400 yen).' },
        ],
      },
      {
        id: 'L4-17',
        judul: 'わたしの夏休{なつやす}み',
        teks: '夏休{なつやす}みは8月{がつ}10日{とおか}から16日{にち}までです。10日{とおか}から12日{にち}まで、友{とも}だちと北海道{ほっかいどう}へ行{い}きます。13日{にち}から15日{にち}まではうちでゆっくり休{やす}みます。16日{にち}に部屋{へや}のそうじをします。',
        terjemahan: 'Libur musim panas dari tanggal 10 sampai 16 Agustus. Tanggal 10 sampai 12 saya pergi ke Hokkaido bersama teman. Tanggal 13 sampai 15 saya beristirahat santai di rumah. Tanggal 16 saya membersihkan kamar.',
        soal: [
          { id: 'L4-17-1', tanya: 'わたしはいつうちでゆっくり休{やす}みますか。', tanyaId: 'Kapan penulis beristirahat santai di rumah?', opsi: ['北海道{ほっかいどう}へ行{い}くまえ', '部屋{へや}のそうじのあと', '北海道{ほっかいどう}から帰{かえ}ったあと'], benar: 2, pembahasan: '10日から12日まで、友だちと北海道へ行きます。13日から15日まではうちでゆっくり休みます = tanggal 10 sampai 12 pergi ke Hokkaido bersama teman, dan tanggal 13 sampai 15 beristirahat santai di rumah (jadi setelah pulang dari Hokkaido; membersihkan kamar baru tanggal 16).' },
          { id: 'L4-17-2', tanya: '16日{にち}に何{なに}をしますか。', tanyaId: 'Apa yang dilakukan tanggal 16?', opsi: ['北海道{ほっかいどう}へ行{い}きます', '部屋{へや}のそうじをします', 'うちでゆっくり休{やす}みます'], benar: 1, pembahasan: '16日に部屋のそうじをします = tanggal 16 membersihkan kamar.' },
        ],
      },
      {
        id: 'L4-18',
        judul: 'カレーの作{つく}り方{かた}',
        teks: 'カレーの作{つく}り方{かた}です。はじめに、肉{にく}とやさいを小{ちい}さく切{き}ります。それから、なべで肉{にく}を5分{ふん}ぐらい焼{や}きます。やさいと水{みず}を入{い}れて、20分{ぷん}ぐらい待{ま}ちます。そして、カレーのルーを入{い}れます。',
        terjemahan: 'Cara membuat kari. Pertama, potong kecil daging dan sayuran. Setelah itu, panggang daging di panci sekitar 5 menit. Masukkan sayuran dan air, lalu tunggu sekitar 20 menit. Kemudian masukkan bumbu kari.',
        soal: [
          { id: 'L4-18-1', tanya: 'やさいはいつなべに入{い}れますか。', tanyaId: 'Kapan sayuran dimasukkan ke panci?', opsi: ['肉{にく}を焼{や}いたあと', '肉{にく}を焼{や}くまえ', 'カレーのルーを入{い}れたあと'], benar: 0, pembahasan: 'なべで肉を5分ぐらい焼きます。やさいと水を入れて = panggang daging di panci sekitar 5 menit, lalu masukkan sayuran dan air (jadi sayuran masuk ke panci setelah daging dipanggang; bumbu kari paling akhir).' },
          { id: 'L4-18-2', tanya: '肉{にく}を焼{や}く時間{じかん}と待{ま}つ時間{じかん}は、全部{ぜんぶ}で何分{なんぷん}ぐらいですか。', tanyaId: 'Waktu memanggang daging dan waktu menunggu, semuanya sekitar berapa menit?', opsi: ['15分{ふん}ぐらい', '20分{ぷん}ぐらい', '25分{ふん}ぐらい'], benar: 2, pembahasan: 'なべで肉を5分ぐらい焼きます。やさいと水を入れて、20分ぐらい待ちます = panggang daging di panci sekitar 5 menit, lalu masukkan sayuran dan air dan tunggu sekitar 20 menit (5 + 20 = sekitar 25 menit).' },
        ],
      },
      {
        id: 'L4-19',
        judul: '寮{りょう}のおふろ',
        teks: '寮{りょう}に、このお知{し}らせがあります。\n寮{りょう}のおふろは1階{かい}にあります。男{おとこ}の人{ひと}は午後{ごご}5時{じ}から8時{じ}まで、女{おんな}の人{ひと}は8時{じ}から11時{じ}まで入{はい}ってもいいです。おふろの中{なか}でせんたくをしないでください。タオルは部屋{へや}から持{も}ってきてください。',
        terjemahan: 'Di asrama ada pengumuman ini. Kamar mandi asrama ada di lantai satu. Laki-laki boleh mandi pukul 5 sampai 8 malam, perempuan pukul 8 sampai 11 malam. Jangan mencuci pakaian di kamar mandi. Bawalah handuk dari kamar.',
        soal: [
          { id: 'L4-19-1', tanya: '寮{りょう}のおふろは何階{なんがい}にありますか。', tanyaId: 'Kamar mandi asrama ada di lantai berapa?', opsi: ['1階{かい}', '2階{かい}', '3階{がい}'], benar: 0, pembahasan: '寮のおふろは1階にあります = kamar mandi asrama ada di lantai satu.' },
          { id: 'L4-19-2', tanya: '女{おんな}の人{ひと}は、何時{なんじ}におふろに入{はい}ってもいいですか。', tanyaId: 'Perempuan boleh mandi pada pukul berapa?', opsi: ['7時{じ}半{はん}', '9時{じ}半{はん}', '11時{じ}半{はん}'], benar: 1, pembahasan: '男の人は午後5時から8時まで、女の人は8時から11時まで入ってもいいです = laki-laki boleh mandi pukul 5 sampai 8 malam, perempuan pukul 8 sampai 11 (jadi perempuan boleh pukul 9.30; pukul 7.30 jam laki-laki, pukul 11.30 sudah lewat).' },
        ],
      },
      {
        id: 'L4-20',
        judul: '本屋{ほんや}のアルバイト',
        teks: 'さくら本屋{ほんや}に、このお知{し}らせがあります。\nアルバイトの人{ひと}がほしいです。時間{じかん}は午後{ごご}5時{じ}から9時{じ}までで、1週間{しゅうかん}に3日{みっか}です。1時間{じかん}1100円{えん}です。店{みせ}の人{ひと}に話{はな}してください。',
        terjemahan: 'Di Toko Buku Sakura ada pengumuman ini. Kami mencari pekerja paruh waktu. Jam kerjanya pukul 5 sampai 9 malam, tiga hari dalam seminggu. Upahnya 1.100 yen per jam. Silakan bicara dengan pegawai toko.',
        soal: [
          { id: 'L4-20-1', tanya: 'このアルバイトは、1週間{しゅうかん}に何時間{なんじかん}働{はたら}きますか。', tanyaId: 'Kerja paruh waktu ini berapa jam dalam seminggu?', opsi: ['9時間{じかん}', '4時間{じかん}', '12時間{じかん}'], benar: 2, pembahasan: '時間は午後5時から9時までで、1週間に3日です = jam kerjanya pukul 5 sampai 9 malam, tiga hari dalam seminggu (4 jam × 3 hari = 12 jam).' },
          { id: 'L4-20-2', tanya: '1時間{じかん}いくらですか。', tanyaId: 'Berapa upah per jam?', opsi: ['1100円{えん}', '1000円{えん}', '1500円{えん}'], benar: 0, pembahasan: '1時間1100円です = 1.100 yen per jam.' },
        ],
      },
      {
        id: 'L4-21',
        judul: '会社{かいしゃ}の休{やす}み時間{じかん}',
        teks: 'わたしの会社{かいしゃ}の仕事{しごと}は朝{あさ}8時{じ}に始{はじ}まります。10時{じ}から10分{ぷん}休{やす}みます。昼休{ひるやす}みは11時{じ}半{はん}から1時間{じかん}です。午後{ごご}は3時{じ}から15分{ふん}休{やす}みます。仕事{しごと}は5時{じ}に終{お}わります。',
        terjemahan: 'Pekerjaan di perusahaan saya mulai pukul 8 pagi. Mulai pukul 10 kami istirahat 10 menit. Istirahat siang mulai pukul 11.30 selama satu jam. Sore hari kami istirahat 15 menit mulai pukul 3. Pekerjaan selesai pukul 5.',
        soal: [
          { id: 'L4-21-1', tanya: '昼休{ひるやす}みは何時{なんじ}までですか。', tanyaId: 'Istirahat siang sampai pukul berapa?', opsi: ['11時{じ}半{はん}', '12時{じ}半{はん}', '1時{じ}'], benar: 1, pembahasan: '昼休みは11時半から1時間です = istirahat siang mulai pukul 11.30 selama satu jam (jadi sampai pukul 12.30).' },
          { id: 'L4-21-2', tanya: '10時{じ}の休{やす}みと3時{じ}の休{やす}みは、全部{ぜんぶ}で何分{なんぷん}ですか。', tanyaId: 'Istirahat pukul 10 dan istirahat pukul 3, semuanya berapa menit?', opsi: ['25分{ふん}', '15分{ふん}', '85分{ふん}'], benar: 0, pembahasan: '10時から10分休みます…午後は3時から15分休みます = mulai pukul 10 istirahat 10 menit … sore hari mulai pukul 3 istirahat 15 menit (10 + 15 = 25 menit).' },
        ],
      },
      {
        id: 'L4-22',
        judul: '会社{かいしゃ}のバス',
        teks: '寮{りょう}から会社{かいしゃ}まで、会社{かいしゃ}のバスで行{い}きます。朝{あさ}のバスは6時{じ}40分{ぷん}と7時{じ}10分{ぷん}に寮{りょう}の前{まえ}を出{で}ます。会社{かいしゃ}まで20分{ぷん}かかります。わたしはいつも7時{じ}10分{ぷん}のバスに乗{の}ります。帰{かえ}りのバスは午後{ごご}5時{じ}半{はん}です。',
        terjemahan: 'Dari asrama ke perusahaan saya naik bus perusahaan. Bus pagi berangkat dari depan asrama pukul 6.40 dan pukul 7.10. Sampai perusahaan perlu 20 menit. Saya selalu naik bus pukul 7.10. Bus pulang pukul 5.30 sore.',
        soal: [
          { id: 'L4-22-1', tanya: 'わたしはいつも何時{なんじ}に会社{かいしゃ}に着{つ}きますか。', tanyaId: 'Penulis selalu tiba di perusahaan pukul berapa?', opsi: ['7時{じ}30分{ぷん}', '7時{じ}10分{ぷん}', '7時{じ}'], benar: 0, pembahasan: '会社まで20分かかります。わたしはいつも7時10分のバスに乗ります = sampai perusahaan 20 menit, dan saya selalu naik bus pukul 7.10 (jadi tiba pukul 7.30).' },
          { id: 'L4-22-2', tanya: '帰{かえ}りのバスは何時{なんじ}ですか。', tanyaId: 'Bus pulang pukul berapa?', opsi: ['午後{ごご}5時{じ}', '午後{ごご}6時{じ}半{はん}', '午後{ごご}5時{じ}半{はん}'], benar: 2, pembahasan: '帰りのバスは午後5時半です = bus pulang pukul 5.30 sore.' },
        ],
      },
      {
        id: 'L4-23',
        judul: '今週{こんしゅう}の会議{かいぎ}',
        teks: '事務所{じむしょ}に、このお知{し}らせがあります。\n今週{こんしゅう}の会議{かいぎ}は4回{かい}です。月曜日{げつようび}と木曜日{もくようび}は朝{あさ}9時{じ}から、水曜日{すいようび}は午後{ごご}2時{じ}から、金曜日{きんようび}は午後{ごご}4時{じ}からです。会議{かいぎ}の5分{ふん}前{まえ}に会議室{かいぎしつ}に来{き}てください。会議{かいぎ}のとき、電話{でんわ}をしてはいけません。',
        terjemahan: 'Di kantor ada pengumuman ini. Rapat minggu ini ada empat kali. Senin dan Kamis mulai pukul 9 pagi, Rabu mulai pukul 2 siang, dan Jumat mulai pukul 4 sore. Datanglah ke ruang rapat 5 menit sebelum rapat. Saat rapat, tidak boleh menelepon.',
        soal: [
          { id: 'L4-23-1', tanya: '金曜日{きんようび}の会議{かいぎ}は何時{なんじ}からですか。', tanyaId: 'Rapat hari Jumat mulai pukul berapa?', opsi: ['朝{あさ}9時{じ}', '午後{ごご}2時{じ}', '午後{ごご}4時{じ}'], benar: 2, pembahasan: '金曜日は午後4時からです = rapat hari Jumat mulai pukul 4 sore.' },
          { id: 'L4-23-2', tanya: '朝{あさ}の会議{かいぎ}は今週{こんしゅう}何回{なんかい}ありますか。', tanyaId: 'Rapat pagi ada berapa kali minggu ini?', opsi: ['2回{かい}', '3回{かい}', '4回{かい}'], benar: 0, pembahasan: '月曜日と木曜日は朝9時から = hari Senin dan Kamis mulai pukul 9 pagi (jadi rapat pagi dua kali; empat kali adalah jumlah semua rapat minggu ini).' },
        ],
      },
      {
        id: 'L4-24',
        judul: '家族{かぞく}へのお金{かね}',
        teks: 'わたしは会社{かいしゃ}の寮{りょう}に住{す}んでいます。毎月{まいつき}、国{くに}の家族{かぞく}に5万円{まんえん}送{おく}ります。寮{りょう}のお金{かね}は2万円{まんえん}、食{た}べ物{もの}は4万円{まんえん}ぐらいです。寮{りょう}のお金{かね}は毎月{まいつき}15日{にち}に払{はら}います。家族{かぞく}へのお金{かね}は毎月{まいつき}25日{にち}に銀行{ぎんこう}から送{おく}ります。',
        terjemahan: 'Saya tinggal di asrama perusahaan. Setiap bulan saya mengirim 50.000 yen kepada keluarga di negara asal. Biaya asrama 20.000 yen dan makanan kira-kira 40.000 yen. Biaya asrama saya bayar setiap tanggal 15. Uang untuk keluarga saya kirim dari bank setiap tanggal 25.',
        soal: [
          { id: 'L4-24-1', tanya: '家族{かぞく}へのお金{かね}は毎月{まいつき}何日{なんにち}に送{おく}りますか。', tanyaId: 'Uang untuk keluarga dikirim tanggal berapa setiap bulan?', opsi: ['15日{にち}', '25日{にち}', '5日{いつか}'], benar: 1, pembahasan: '家族へのお金は毎月25日に銀行から送ります = uang untuk keluarga dikirim dari bank setiap tanggal 25.' },
          { id: 'L4-24-2', tanya: '寮{りょう}のお金{かね}と食{た}べ物{もの}で、毎月{まいつき}いくらぐらいですか。', tanyaId: 'Biaya asrama dan makanan kira-kira berapa setiap bulan?', opsi: ['4万円{まんえん}', '6万円{まんえん}', '5万円{まんえん}'], benar: 1, pembahasan: '寮のお金は2万円、食べ物は4万円ぐらいです = biaya asrama 20.000 yen dan makanan kira-kira 40.000 yen (jumlahnya kira-kira 60.000 yen).' },
        ],
      },
      {
        id: 'L4-25',
        judul: 'せんたくの時間{じかん}',
        teks: '寮{りょう}のせんたくきは2階{かい}に三{みっ}つあります。朝{あさ}6時{じ}から夜{よる}10時{じ}まで使{つか}ってもいいです。1回{かい}100円{えん}で、40分{ぷん}ぐらいかかります。わたしは土曜日{どようび}の朝{あさ}にせんたくをして、それから部屋{へや}のそうじをします。',
        terjemahan: 'Mesin cuci asrama ada tiga buah di lantai dua. Boleh dipakai dari pukul 6 pagi sampai pukul 10 malam. Sekali pakai 100 yen dan perlu kira-kira 40 menit. Saya mencuci pada Sabtu pagi, setelah itu membersihkan kamar.',
        soal: [
          { id: 'L4-25-1', tanya: 'せんたくきは何時{なんじ}まで使{つか}ってもいいですか。', tanyaId: 'Mesin cuci boleh dipakai sampai pukul berapa?', opsi: ['夜{よる}10時{じ}', '夜{よる}6時{じ}', '朝{あさ}10時{じ}'], benar: 0, pembahasan: '朝6時から夜10時まで使ってもいいです = boleh dipakai dari pukul 6 pagi sampai pukul 10 malam.' },
          { id: 'L4-25-2', tanya: 'せんたくきを2回{かい}使{つか}います。いくらですか。', tanyaId: 'Mesin cuci dipakai dua kali. Berapa biayanya?', opsi: ['100円{えん}', '200円{えん}', '400円{えん}'], benar: 1, pembahasan: '1回100円で = sekali pakai 100 yen (dua kali jadi 200 yen).' },
        ],
      },
      {
        id: 'L4-26',
        judul: '8月{がつ}3日{みっか}の夏{なつ}まつり',
        teks: '8月{がつ}3日{みっか}の土曜日{どようび}に、公園{こうえん}で町{まち}の夏{なつ}まつりがあります。公園{こうえん}は駅{えき}の近{ちか}くです。午後{ごご}4時{じ}に始{はじ}まって、夜{よる}9時{じ}に終{お}わります。7時{じ}からおどりがあります。わたしは寮{りょう}の友{とも}だちと5時{じ}に行{い}きます。',
        terjemahan: 'Hari Sabtu tanggal 3 Agustus ada festival musim panas kota di taman. Taman itu dekat stasiun. Mulai pukul 4 sore dan selesai pukul 9 malam. Mulai pukul 7 ada tarian. Saya pergi pukul 5 bersama teman asrama.',
        soal: [
          { id: 'L4-26-1', tanya: '夏{なつ}まつりは何時間{なんじかん}ありますか。', tanyaId: 'Festival musim panas berlangsung berapa jam?', opsi: ['3時間{じかん}', '4時間{じかん}', '5時間{じかん}'], benar: 2, pembahasan: '午後4時に始まって、夜9時に終わります = mulai pukul 4 sore dan selesai pukul 9 malam (jadi lima jam).' },
          { id: 'L4-26-2', tanya: 'おどりは何時{なんじ}からですか。', tanyaId: 'Tarian mulai pukul berapa?', opsi: ['4時{じ}', '5時{じ}', '7時{じ}'], benar: 2, pembahasan: '7時からおどりがあります = mulai pukul 7 ada tarian.' },
        ],
      },
      {
        id: 'L4-27',
        judul: 'さくら病院{びょういん}の時間{じかん}',
        teks: 'さくら病院{びょういん}は月曜日{げつようび}から土曜日{どようび}まで開{あ}いています。午前{ごぜん}は9時{じ}から12時{じ}まで、午後{ごご}は3時{じ}から6時{じ}までです。水曜日{すいようび}と土曜日{どようび}は午前{ごぜん}だけです。日曜日{にちようび}は休{やす}みです。',
        terjemahan: 'Rumah Sakit Sakura buka dari Senin sampai Sabtu. Pagi dari pukul 9 sampai pukul 12, sore dari pukul 3 sampai pukul 6. Hari Rabu dan Sabtu hanya buka pagi. Hari Minggu libur.',
        soal: [
          { id: 'L4-27-1', tanya: '午後{ごご}は何時{なんじ}からですか。', tanyaId: 'Sore hari mulai pukul berapa?', opsi: ['1時{じ}', '3時{じ}', '12時{じ}'], benar: 1, pembahasan: '午後は3時から6時までです = sore hari dari pukul 3 sampai pukul 6 (pukul 12 adalah akhir jam pagi).' },
          { id: 'L4-27-2', tanya: '午後{ごご}5時{じ}に病院{びょういん}へ行{い}きたいです。何曜日{なんようび}に行{い}くことができますか。', tanyaId: 'Ingin pergi ke rumah sakit pukul 5 sore. Hari apa bisa pergi?', opsi: ['金曜日{きんようび}', '水曜日{すいようび}', '日曜日{にちようび}'], benar: 0, pembahasan: '月曜日から土曜日まで開いています…午後は3時から6時までです。水曜日と土曜日は午前だけです。日曜日は休みです = buka Senin sampai Sabtu … sore dari pukul 3 sampai pukul 6; Rabu dan Sabtu hanya pagi; Minggu libur (jadi pukul 5 sore bisa pada hari Jumat).' },
        ],
      },
      {
        id: 'L4-28',
        judul: '母{はは}への荷物{にもつ}',
        teks: 'きのう、郵便局{ゆうびんきょく}から国{くに}の母{はは}に荷物{にもつ}を送{おく}りました。中{なか}は日本{にほん}のおかしとくつです。ひこうきで送{おく}って、4000円{えん}でした。船{ふね}は1500円{えん}ですが、2か月{げつ}かかります。ひこうきは1週間{しゅうかん}ぐらいで着{つ}きます。',
        terjemahan: 'Kemarin saya mengirim paket dari kantor pos kepada ibu di negara asal. Isinya kue Jepang dan sepatu. Saya mengirimnya dengan pesawat, biayanya 4.000 yen. Dengan kapal 1.500 yen, tetapi perlu dua bulan. Dengan pesawat tiba dalam kira-kira satu minggu.',
        soal: [
          { id: 'L4-28-1', tanya: '荷物{にもつ}の中{なか}に何{なに}がありますか。', tanyaId: 'Apa isi paketnya?', opsi: ['おかしとくつ', 'おかしと服{ふく}', '服{ふく}と本{ほん}'], benar: 0, pembahasan: '中は日本のおかしとくつです = isinya kue Jepang dan sepatu.' },
          { id: 'L4-28-2', tanya: 'ひこうきは船{ふね}よりいくら高{たか}いですか。', tanyaId: 'Pesawat lebih mahal berapa daripada kapal?', opsi: ['1500円{えん}', '5500円{えん}', '2500円{えん}'], benar: 2, pembahasan: 'ひこうきで送って、4000円でした。船は1500円ですが = dengan pesawat 4.000 yen, dengan kapal 1.500 yen (selisihnya 2.500 yen).' },
        ],
      },
      {
        id: 'L4-29',
        judul: '食堂{しょくどう}の昼{ひる}ごはん',
        teks: '会社{かいしゃ}の食堂{しょくどう}は11時{じ}半{はん}から1時{じ}まで開{あ}いています。ラーメンは350円{えん}、カレーは400円{えん}、魚{さかな}の弁当{べんとう}は500円{えん}です。お茶{ちゃ}はお金{かね}がいりません。わたしは今日{きょう}、カレーとサラダを食{た}べました。サラダは150円{えん}でした。',
        terjemahan: 'Kantin perusahaan buka dari pukul 11.30 sampai pukul 1. Ramen 350 yen, kari 400 yen, dan bento ikan 500 yen. Teh tidak perlu bayar. Hari ini saya makan kari dan salad. Saladnya 150 yen.',
        soal: [
          { id: 'L4-29-1', tanya: '食堂{しょくどう}は何時{なんじ}に閉{し}まりますか。', tanyaId: 'Kantin tutup pukul berapa?', opsi: ['1時{じ}半{はん}', '11時{じ}半{はん}', '1時{じ}'], benar: 2, pembahasan: '食堂は11時半から1時まで開いています = kantin buka dari pukul 11.30 sampai pukul 1.' },
          { id: 'L4-29-2', tanya: 'わたしの今日{きょう}の昼{ひる}ごはんは、全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Makan siang penulis hari ini semuanya berapa?', opsi: ['400円{えん}', '500円{えん}', '550円{えん}'], benar: 2, pembahasan: 'カレーは400円…カレーとサラダを食べました。サラダは150円でした = kari 400 yen … saya makan kari dan salad, saladnya 150 yen (jumlahnya 550 yen).' },
        ],
      },
      {
        id: 'L4-30',
        judul: '会社{かいしゃ}のはじめての日{ひ}',
        teks: 'あしたは4月{がつ}1日{ついたち}で、会社{かいしゃ}のはじめての日{ひ}です。8時{じ}半{はん}に事務所{じむしょ}へ行{い}って、9時{じ}から会議室{かいぎしつ}で会社{かいしゃ}の話{はなし}を聞{き}きます。10時{じ}から会社{かいしゃ}の中{なか}を見{み}ます。昼{ひる}ごはんのあとで、仕事{しごと}の服{ふく}とくつをもらいます。仕事{しごと}はあさってからです。',
        terjemahan: 'Besok tanggal 1 April, hari pertama saya di perusahaan. Pukul 8.30 saya pergi ke kantor, lalu mulai pukul 9 mendengarkan penjelasan tentang perusahaan di ruang rapat. Mulai pukul 10 saya melihat bagian dalam perusahaan. Setelah makan siang, saya menerima baju dan sepatu kerja. Pekerjaan dimulai lusa.',
        soal: [
          { id: 'L4-30-1', tanya: '仕事{しごと}は4月{がつ}何日{なんにち}からですか。', tanyaId: 'Pekerjaan mulai tanggal berapa April?', opsi: ['1日{ついたち}', '2日{ふつか}', '3日{みっか}'], benar: 1, pembahasan: 'あしたは4月1日で…仕事はあさってからです = besok tanggal 1 April … pekerjaan mulai lusa (jadi tanggal 2 April).' },
          { id: 'L4-30-2', tanya: '会社{かいしゃ}の中{なか}を見{み}るまえに、何{なに}をしますか。', tanyaId: 'Sebelum melihat bagian dalam perusahaan, apa yang dilakukan?', opsi: ['昼{ひる}ごはんを食{た}べます', '仕事{しごと}の服{ふく}をもらいます', '会社{かいしゃ}の話{はなし}を聞{き}きます'], benar: 2, pembahasan: '9時から会議室で会社の話を聞きます。10時から会社の中を見ます = mulai pukul 9 mendengarkan penjelasan perusahaan di ruang rapat, mulai pukul 10 melihat bagian dalam perusahaan (makan siang dan menerima baju sesudahnya).' },
        ],
      },
      {
        id: 'L4-31',
        judul: '土曜日{どようび}の日本語{にほんご}クラス',
        teks: '町{まち}の日本語{にほんご}クラスは毎週{まいしゅう}土曜日{どようび}にあります。午前{ごぜん}のクラスは9時{じ}から12時{じ}まで、午後{ごご}のクラスは2時{じ}から4時{じ}までです。1回{かい}200円{えん}です。教室{きょうしつ}は図書館{としょかん}の2階{かい}です。わたしは午後{ごご}のクラスで漢字{かんじ}を習{なら}っています。',
        terjemahan: 'Kelas bahasa Jepang di kota diadakan setiap hari Sabtu. Kelas pagi dari pukul 9 sampai pukul 12, kelas sore dari pukul 2 sampai pukul 4. Sekali datang 200 yen. Ruang kelasnya di lantai dua perpustakaan. Saya belajar kanji di kelas sore.',
        soal: [
          { id: 'L4-31-1', tanya: 'わたしのクラスは何時間{なんじかん}ですか。', tanyaId: 'Kelas penulis berapa jam?', opsi: ['2時間{じかん}', '3時間{じかん}', '4時間{じかん}'], benar: 0, pembahasan: '午後のクラスは2時から4時までです…わたしは午後のクラスで漢字を習っています = kelas sore dari pukul 2 sampai pukul 4, dan saya belajar di kelas sore (jadi dua jam; kelas pagi tiga jam).' },
          { id: 'L4-31-2', tanya: '教室{きょうしつ}はどこですか。', tanyaId: 'Di mana ruang kelasnya?', opsi: ['図書館{としょかん}の1階{かい}', '学校{がっこう}の1階{かい}', '図書館{としょかん}の2階{かい}'], benar: 2, pembahasan: '教室は図書館の2階です = ruang kelasnya di lantai dua perpustakaan.' },
        ],
      },
      {
        id: 'L4-32',
        judul: '赤{あか}い自転車{じてんしゃ}と青{あお}い自転車{じてんしゃ}',
        teks: '自転車{じてんしゃ}の店{みせ}へ行{い}きました。赤{あか}い自転車{じてんしゃ}は新{あたら}しくて、2万円{まんえん}です。青{あお}い自転車{じてんしゃ}は古{ふる}いですが、8000円{えん}です。赤{あか}いほうが軽{かる}いです。でも、わたしはお金{かね}があまりありませんから、安{やす}いほうを買{か}いました。',
        terjemahan: 'Saya pergi ke toko sepeda. Sepeda merah masih baru dan harganya 20.000 yen. Sepeda biru sudah tua, tetapi harganya 8.000 yen. Yang merah lebih ringan. Namun, karena uang saya tidak banyak, saya membeli yang lebih murah.',
        soal: [
          { id: 'L4-32-1', tanya: 'わたしはどの自転車{じてんしゃ}を買{か}いましたか。', tanyaId: 'Sepeda mana yang dibeli penulis?', opsi: ['赤{あか}い自転車{じてんしゃ}', '黒{くろ}い自転車{じてんしゃ}', '青{あお}い自転車{じてんしゃ}'], benar: 2, pembahasan: '青い自転車は古いですが、8000円です…安いほうを買いました = sepeda biru sudah tua tetapi 8.000 yen; saya membeli yang lebih murah (yaitu sepeda biru).' },
          { id: 'L4-32-2', tanya: '赤{あか}い自転車{じてんしゃ}はどんな自転車{じてんしゃ}ですか。', tanyaId: 'Sepeda merah itu sepeda yang bagaimana?', opsi: ['新{あたら}しくて軽{かる}いです', '古{ふる}くて軽{かる}いです', '新{あたら}しくて安{やす}いです'], benar: 0, pembahasan: '赤い自転車は新しくて、2万円です…赤いほうが軽いです = sepeda merah masih baru dan harganya 20.000 yen; yang merah lebih ringan.' },
        ],
      },
      {
        id: 'L4-33',
        judul: 'スーパーの安{やす}い日{ひ}',
        teks: '寮{りょう}の近{ちか}くのスーパーは、火曜日{かようび}に野菜{やさい}が安{やす}いです。金曜日{きんようび}は肉{にく}と魚{さかな}が安{やす}いです。500円{えん}の弁当{べんとう}は、夜{よる}7時{じ}から300円{えん}になります。わたしは金曜日{きんようび}の夜{よる}、仕事{しごと}のあとで行{い}って、肉{にく}と弁当{べんとう}を買{か}います。',
        terjemahan: 'Di supermarket dekat asrama, sayuran murah pada hari Selasa. Hari Jumat daging dan ikan murah. Bento seharga 500 yen menjadi 300 yen mulai pukul 7 malam. Saya pergi Jumat malam sepulang kerja, lalu membeli daging dan bento.',
        soal: [
          { id: 'L4-33-1', tanya: '野菜{やさい}は何曜日{なんようび}に安{やす}いですか。', tanyaId: 'Sayuran murah pada hari apa?', opsi: ['金曜日{きんようび}', '火曜日{かようび}', '土曜日{どようび}'], benar: 1, pembahasan: '火曜日に野菜が安いです = sayuran murah pada hari Selasa.' },
          { id: 'L4-33-2', tanya: '夜{よる}7時{じ}からの弁当{べんとう}は、500円{えん}よりいくら安{やす}いですか。', tanyaId: 'Bento mulai pukul 7 malam lebih murah berapa yen daripada 500 yen?', opsi: ['200円{えん}', '300円{えん}', '500円{えん}'], benar: 0, pembahasan: '500円の弁当は、夜7時から300円になります = bento 500 yen menjadi 300 yen mulai pukul 7 malam (lebih murah 200 yen).' },
        ],
      },
      {
        id: 'L4-34',
        judul: '3人{にん}の兄弟{きょうだい}',
        teks: 'わたしは3人{にん}兄弟{きょうだい}です。兄{あに}は28歳{さい}で、ジャカルタの銀行{ぎんこう}で働{はたら}いています。わたしは兄{あに}より4歳{さい}若{わか}いです。弟{おとうと}は19歳{さい}の大学生{だいがくせい}です。3人{にん}の中{なか}で、弟{おとうと}がいちばん背{せ}が高{たか}いです。',
        terjemahan: 'Saya tiga bersaudara. Kakak laki-laki saya berumur 28 tahun dan bekerja di bank di Jakarta. Saya empat tahun lebih muda daripada kakak. Adik laki-laki saya mahasiswa berumur 19 tahun. Di antara kami bertiga, adik yang paling tinggi badannya.',
        soal: [
          { id: 'L4-34-1', tanya: 'わたしは何歳{なんさい}ですか。', tanyaId: 'Berapa umur penulis?', opsi: ['23歳{さい}', '32歳{さい}', '24歳{さい}'], benar: 2, pembahasan: '兄は28歳で…わたしは兄より4歳若いです = kakak berumur 28 tahun, dan saya empat tahun lebih muda (jadi 24 tahun).' },
          { id: 'L4-34-2', tanya: 'いちばん背{せ}が高{たか}い人{ひと}はだれですか。', tanyaId: 'Siapa yang paling tinggi badannya?', opsi: ['兄{あに}', '弟{おとうと}', 'わたし'], benar: 1, pembahasan: '3人の中で、弟がいちばん背が高いです = di antara bertiga, adik yang paling tinggi badannya.' },
        ],
      },
      {
        id: 'L4-35',
        judul: '今週{こんしゅう}の天気{てんき}',
        teks: '今週{こんしゅう}の天気{てんき}です。月曜日{げつようび}と火曜日{かようび}は晴{は}れで、暑{あつ}くなります。水曜日{すいようび}はくもりです。木曜日{もくようび}から土曜日{どようび}まで雨{あめ}が降{ふ}ります。日曜日{にちようび}はまた晴{は}れますが、風{かぜ}が強{つよ}いです。',
        terjemahan: 'Ini cuaca minggu ini. Hari Senin dan Selasa cerah dan menjadi panas. Hari Rabu berawan. Dari Kamis sampai Sabtu hujan turun. Hari Minggu cerah lagi, tetapi anginnya kencang.',
        soal: [
          { id: 'L4-35-1', tanya: '水曜日{すいようび}の天気{てんき}はどうですか。', tanyaId: 'Bagaimana cuaca hari Rabu?', opsi: ['くもりです', '晴{は}れです', '雨{あめ}です'], benar: 0, pembahasan: '水曜日はくもりです = hari Rabu berawan.' },
          { id: 'L4-35-2', tanya: '今週{こんしゅう}、雨{あめ}の日{ひ}は何日{なんにち}ありますか。', tanyaId: 'Minggu ini ada berapa hari hujan?', opsi: ['2日{ふつか}', '3日{みっか}', '4日{よっか}'], benar: 1, pembahasan: '木曜日から土曜日まで雨が降ります = dari Kamis sampai Sabtu hujan turun (Kamis, Jumat, Sabtu = tiga hari).' },
        ],
      },
      {
        id: 'L4-36',
        judul: '東京{とうきょう}までの行{い}き方{かた}',
        teks: '寮{りょう}から東京{とうきょう}までの行{い}き方{かた}です。はじめに、寮{りょう}の前{まえ}からバスに15分{ふん}乗{の}って、みどり駅{えき}で降{お}ります。それから、電車{でんしゃ}に40分{ぷん}乗{の}ります。バスは200円{えん}、電車{でんしゃ}は600円{えん}です。',
        terjemahan: 'Ini cara pergi dari asrama ke Tokyo. Pertama, naik bus dari depan asrama selama 15 menit, lalu turun di Stasiun Midori. Setelah itu, naik kereta selama 40 menit. Bus 200 yen, kereta 600 yen.',
        soal: [
          { id: 'L4-36-1', tanya: '寮{りょう}から東京{とうきょう}まで、全部{ぜんぶ}でいくらかかりますか。', tanyaId: 'Dari asrama sampai Tokyo, semuanya perlu biaya berapa?', opsi: ['600円{えん}', '800円{えん}', '1000円{えん}'], benar: 1, pembahasan: 'バスは200円、電車は600円です = bus 200 yen, kereta 600 yen (jumlahnya 800 yen).' },
          { id: 'L4-36-2', tanya: 'バスに何分{なんぷん}乗{の}りますか。', tanyaId: 'Naik bus berapa menit?', opsi: ['40分{ぷん}', '55分{ふん}', '15分{ふん}'], benar: 2, pembahasan: '寮の前からバスに15分乗って = naik bus dari depan asrama selama 15 menit.' },
        ],
      },
      {
        id: 'L4-37',
        judul: '日曜日{にちようび}の買{か}い物{もの}',
        teks: '日曜日{にちようび}にスーパーで買{か}い物{もの}をしました。たまごは200円{えん}、牛乳{ぎゅうにゅう}は180円{えん}でした。りんごは一{ひと}つ100円{えん}で、三{みっ}つ買{か}いました。パンは高{たか}かったですから、買{か}いませんでした。1000円{えん}出{だ}して、おつりをもらいました。',
        terjemahan: 'Hari Minggu saya berbelanja di supermarket. Telur 200 yen dan susu 180 yen. Apel satu buah 100 yen, dan saya membeli tiga buah. Roti mahal, jadi saya tidak membelinya. Saya membayar dengan 1.000 yen dan menerima kembalian.',
        soal: [
          { id: 'L4-37-1', tanya: 'りんごは全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Apelnya semuanya berapa?', opsi: ['100円{えん}', '200円{えん}', '300円{えん}'], benar: 2, pembahasan: 'りんごは一つ100円で、三つ買いました = apel satu buah 100 yen dan saya membeli tiga buah (jadi 300 yen).' },
          { id: 'L4-37-2', tanya: 'わたしは何{なに}を買{か}いませんでしたか。', tanyaId: 'Apa yang tidak dibeli penulis?', opsi: ['パン', '牛乳{ぎゅうにゅう}', 'たまご'], benar: 0, pembahasan: 'パンは高かったですから、買いませんでした = roti mahal, jadi tidak dibeli.' },
        ],
      },
      {
        id: 'L4-38',
        judul: '土曜日{どようび}の映画{えいが}',
        teks: '土曜日{どようび}に友{とも}だちと映画{えいが}を見{み}に行{い}きます。映画{えいが}は午後{ごご}1時{じ}と4時{じ}にあります。わたしたちは4時{じ}の映画{えいが}を見{み}ます。映画{えいが}は2時間{じかん}です。3時{じ}半{はん}に駅{えき}の前{まえ}で会{あ}って、映画{えいが}のあとで晩{ばん}ごはんを食{た}べます。',
        terjemahan: 'Hari Sabtu saya pergi menonton film bersama teman. Filmnya diputar pukul 1 siang dan pukul 4 sore. Kami menonton film yang pukul 4. Filmnya dua jam. Kami bertemu pukul 3.30 di depan stasiun, dan setelah film kami makan malam.',
        soal: [
          { id: 'L4-38-1', tanya: 'わたしたちの映画{えいが}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Film yang ditonton penulis dan temannya selesai pukul berapa?', opsi: ['6時{じ}', '3時{じ}', '4時{じ}'], benar: 0, pembahasan: 'わたしたちは4時の映画を見ます。映画は2時間です = kami menonton film pukul 4, dan filmnya dua jam (jadi selesai pukul 6).' },
          { id: 'L4-38-2', tanya: '友{とも}だちと何時{なんじ}に会{あ}いますか。', tanyaId: 'Bertemu teman pukul berapa?', opsi: ['1時{じ}', '3時{じ}半{はん}', '4時{じ}'], benar: 1, pembahasan: '3時半に駅の前で会って = bertemu pukul 3.30 di depan stasiun.' },
        ],
      },
      {
        id: 'L4-39',
        judul: 'リナさんの誕生日{たんじょうび}パーティー',
        teks: '来週{らいしゅう}の日曜日{にちようび}はリナさんの誕生日{たんじょうび}です。寮{りょう}の食堂{しょくどう}で6時{じ}からパーティーをします。アグスさんはケーキを買{か}います。サリさんは料理{りょうり}を作{つく}ります。わたしは飲{の}み物{もの}と花{はな}を持{も}っていきます。準備{じゅんび}は5時{じ}からです。',
        terjemahan: 'Hari Minggu depan adalah ulang tahun Rina. Kami mengadakan pesta di kantin asrama mulai pukul 6. Agus membeli kue. Sari memasak makanan. Saya membawa minuman dan bunga. Persiapannya mulai pukul 5.',
        soal: [
          { id: 'L4-39-1', tanya: 'だれがケーキを買{か}いますか。', tanyaId: 'Siapa yang membeli kue?', opsi: ['サリさん', 'アグスさん', 'リナさん'], benar: 1, pembahasan: 'アグスさんはケーキを買います = Agus membeli kue.' },
          { id: 'L4-39-2', tanya: 'パーティーの前{まえ}に、何時間{なんじかん}準備{じゅんび}をしますか。', tanyaId: 'Sebelum pesta, persiapannya berapa jam?', opsi: ['3時間{じかん}', '2時間{じかん}', '1時間{じかん}'], benar: 2, pembahasan: '6時からパーティーをします…準備は5時からです = pesta mulai pukul 6 dan persiapan mulai pukul 5 (jadi satu jam).' },
        ],
      },
      {
        id: 'L4-40',
        judul: '日曜日{にちようび}の公園{こうえん}',
        teks: '森{もり}さんの家族{かぞく}は、お父{とう}さんとお母{かあ}さんと子{こ}ども二人{ふたり}です。日曜日{にちようび}に、4人{にん}で大{おお}きい公園{こうえん}へ行{い}きました。きっぷは600円{えん}ですが、子{こ}どもは200円{えん}です。9時{じ}に入{はい}って、午後{ごご}3時{じ}に出{で}ました。昼{ひる}ごはんは公園{こうえん}の中{なか}のレストランで食{た}べました。',
        terjemahan: 'Keluarga Mori terdiri dari ayah, ibu, dan dua anak. Hari Minggu mereka berempat pergi ke taman besar. Tiketnya 600 yen, tetapi anak-anak 200 yen. Mereka masuk pukul 9 dan keluar pukul 3 sore. Makan siangnya di restoran di dalam taman.',
        soal: [
          { id: 'L4-40-1', tanya: 'きっぷは全部{ぜんぶ}でいくらでしたか。', tanyaId: 'Tiketnya semuanya berapa?', opsi: ['800円{えん}', '1400円{えん}', '1600円{えん}'], benar: 2, pembahasan: 'お父さんとお母さんと子ども二人です…きっぷは600円ですが、子どもは200円です = ayah, ibu, dan dua anak; tiket 600 yen, tetapi anak-anak 200 yen (1.200 + 400 = 1.600 yen).' },
          { id: 'L4-40-2', tanya: '昼{ひる}ごはんはどこで食{た}べましたか。', tanyaId: 'Makan siang di mana?', opsi: ['公園{こうえん}の前{まえ}のレストラン', '駅{えき}の近{ちか}くのレストラン', '公園{こうえん}の中{なか}のレストラン'], benar: 2, pembahasan: '昼ごはんは公園の中のレストランで食べました = makan siang di restoran di dalam taman.' },
        ],
      },
      {
        id: 'L4-41',
        judul: 'サッカーの練習{れんしゅう}',
        teks: '会社{かいしゃ}のサッカーチームの練習{れんしゅう}は、火曜日{かようび}と金曜日{きんようび}の夜{よる}です。7時{じ}から8時{じ}半{はん}まで、会社{かいしゃ}のとなりの公園{こうえん}で練習{れんしゅう}をします。雨{あめ}の日{ひ}は休{やす}みです。来月{らいげつ}の10日{とおか}に、となりの町{まち}のチームと試合{しあい}をします。',
        terjemahan: 'Latihan tim sepak bola perusahaan diadakan Selasa malam dan Jumat malam. Latihannya dari pukul 7 sampai pukul 8.30 di taman sebelah perusahaan. Kalau hari hujan, latihan libur. Tanggal 10 bulan depan kami bertanding dengan tim dari kota sebelah.',
        soal: [
          { id: 'L4-41-1', tanya: '練習{れんしゅう}は1回{かい}どのくらいですか。', tanyaId: 'Latihan sekali berapa lama?', opsi: ['1時間{じかん}半{はん}', '1時間{じかん}', '2時間{じかん}'], benar: 0, pembahasan: '7時から8時半まで = dari pukul 7 sampai pukul 8.30 (jadi satu setengah jam).' },
          { id: 'L4-41-2', tanya: '練習{れんしゅう}はどこでしますか。', tanyaId: 'Latihannya di mana?', opsi: ['会社{かいしゃ}のとなりの公園{こうえん}', 'となりの町{まち}の公園{こうえん}', '駅{えき}の前{まえ}の公園{こうえん}'], benar: 0, pembahasan: '会社のとなりの公園で練習をします = latihan dilakukan di taman sebelah perusahaan.' },
        ],
      },
      {
        id: 'L4-42',
        judul: 'アグスさんの休{やす}みの日{ひ}',
        teks: 'アグスさんは休{やす}みの日{ひ}、朝{あさ}8時{じ}に起{お}きます。朝{あさ}ごはんを食{た}べてから、部屋{へや}をそうじします。それから、国{くに}の家族{かぞく}と1時間{じかん}ぐらい電話{でんわ}で話{はな}します。午後{ごご}は友{とも}だちとバドミントンをします。夜{よる}は寮{りょう}で日本語{にほんご}を勉強{べんきょう}します。',
        terjemahan: 'Pada hari libur, Agus bangun pukul 8 pagi. Setelah sarapan, ia membersihkan kamar. Setelah itu, ia berbicara lewat telepon dengan keluarga di negara asal kira-kira satu jam. Sore hari ia bermain bulu tangkis bersama teman. Malam hari ia belajar bahasa Jepang di asrama.',
        soal: [
          { id: 'L4-42-1', tanya: 'アグスさんは家族{かぞく}と電話{でんわ}で話{はな}すまえに、何{なに}をしますか。', tanyaId: 'Sebelum berbicara lewat telepon dengan keluarga, apa yang dilakukan Agus?', opsi: ['日本語{にほんご}を勉強{べんきょう}します', '部屋{へや}をそうじします', 'せんたくをします'], benar: 1, pembahasan: '部屋をそうじします。それから、国の家族と1時間ぐらい電話で話します = ia membersihkan kamar, setelah itu berbicara lewat telepon dengan keluarga (belajar bahasa Jepang baru malam hari; mencuci tidak disebut).' },
          { id: 'L4-42-2', tanya: 'アグスさんは午後{ごご}、何{なに}をしますか。', tanyaId: 'Apa yang dilakukan Agus pada sore hari?', opsi: ['友{とも}だちとスポーツをします', '国{くに}の家族{かぞく}と電話{でんわ}で話{はな}します', '寮{りょう}で日本語{にほんご}を勉強{べんきょう}します'], benar: 0, pembahasan: '午後は友だちとバドミントンをします = sore hari bermain bulu tangkis bersama teman (bulu tangkis = olahraga).' },
        ],
      },
      {
        id: 'L4-43',
        judul: '寮{りょう}のそうじ',
        teks: '寮{りょう}では毎週{まいしゅう}日曜日{にちようび}の朝{あさ}9時{じ}から、みんなでそうじをします。今週{こんしゅう}、アリさんとわたしは食堂{しょくどう}です。ブディさんはおふろとトイレです。そうじは1時間{じかん}ぐらいで終{お}わります。そのあとで、みんなで買{か}い物{もの}に行{い}きます。',
        terjemahan: 'Di asrama, setiap Minggu pagi mulai pukul 9 semua orang bersih-bersih bersama. Minggu ini Ali dan saya membersihkan ruang makan. Budi membersihkan kamar mandi dan toilet. Bersih-bersih selesai dalam kira-kira satu jam. Setelah itu, kami semua pergi berbelanja.',
        soal: [
          { id: 'L4-43-1', tanya: '今週{こんしゅう}、ブディさんはどこをそうじしますか。', tanyaId: 'Minggu ini Budi membersihkan bagian mana?', opsi: ['食堂{しょくどう}とおふろ', '食堂{しょくどう}とトイレ', 'おふろとトイレ'], benar: 2, pembahasan: 'ブディさんはおふろとトイレです = Budi bagian kamar mandi dan toilet.' },
          { id: 'L4-43-2', tanya: 'そうじは何時{なんじ}ごろ終{お}わりますか。', tanyaId: 'Bersih-bersih selesai kira-kira pukul berapa?', opsi: ['9時{じ}ごろ', '10時{じ}ごろ', '11時{じ}ごろ'], benar: 1, pembahasan: '朝9時から、みんなでそうじをします…そうじは1時間ぐらいで終わります = bersih-bersih mulai pukul 9 pagi dan selesai dalam kira-kira satu jam (jadi kira-kira pukul 10).' },
        ],
      },
      {
        id: 'L4-44',
        judul: '田中{たなか}さんと木村{きむら}さん',
        teks: '田中{たなか}さんと木村{きむら}さんはわたしの会社{かいしゃ}の人{ひと}です。田中{たなか}さんは会社{かいしゃ}で10年{ねん}働{はたら}いています。木村{きむら}さんは田中{たなか}さんより3年{ねん}長{なが}く働{はたら}いています。田中{たなか}さんは毎朝{まいあさ}7時{じ}半{はん}に来{き}ますが、木村{きむら}さんはいつも田中{たなか}さんより30分{ぷん}早{はや}く来{き}ます。',
        terjemahan: 'Tanaka dan Kimura adalah orang di perusahaan saya. Tanaka sudah bekerja di perusahaan selama sepuluh tahun. Kimura bekerja tiga tahun lebih lama daripada Tanaka. Tanaka datang setiap pagi pukul 7.30, tetapi Kimura selalu datang 30 menit lebih awal daripada Tanaka.',
        soal: [
          { id: 'L4-44-1', tanya: '木村{きむら}さんは会社{かいしゃ}で何年{なんねん}働{はたら}いていますか。', tanyaId: 'Kimura sudah bekerja di perusahaan berapa tahun?', opsi: ['10年{ねん}', '7年{ねん}', '13年{ねん}'], benar: 2, pembahasan: '田中さんは会社で10年働いています。木村さんは田中さんより3年長く働いています = Tanaka sudah bekerja di perusahaan selama sepuluh tahun, dan Kimura bekerja tiga tahun lebih lama daripada Tanaka (jadi 13 tahun).' },
          { id: 'L4-44-2', tanya: '木村{きむら}さんは毎朝{まいあさ}何時{なんじ}に来{き}ますか。', tanyaId: 'Kimura datang pukul berapa setiap pagi?', opsi: ['7時{じ}', '7時{じ}半{はん}', '8時{じ}'], benar: 0, pembahasan: '田中さんは毎朝7時半に来ますが、木村さんはいつも田中さんより30分早く来ます = Tanaka datang pukul 7.30, tetapi Kimura selalu datang 30 menit lebih awal daripada Tanaka (jadi pukul 7).' },
        ],
      },
      {
        id: 'L4-45',
        judul: '日曜日{にちようび}の山{やま}のぼり',
        teks: '来週{らいしゅう}の日曜日{にちようび}、会社{かいしゃ}の人{ひと}とみどり山{やま}にのぼります。朝{あさ}7時{じ}に駅{えき}で会{あ}って、電車{でんしゃ}で山{やま}の下{した}まで行{い}きます。8時{じ}から歩{ある}いて、11時{じ}ごろ山{やま}の上{うえ}に着{つ}きます。上{うえ}で弁当{べんとう}を食{た}べて、1時{じ}に帰{かえ}ります。',
        terjemahan: 'Hari Minggu depan saya mendaki Gunung Midori bersama orang-orang perusahaan. Kami bertemu di stasiun pukul 7 pagi, lalu naik kereta sampai kaki gunung. Kami berjalan mulai pukul 8 dan tiba di puncak sekitar pukul 11. Di atas kami makan bento, lalu pulang pukul 1.',
        soal: [
          { id: 'L4-45-1', tanya: '何時{なんじ}にどこで会{あ}いますか。', tanyaId: 'Bertemu pukul berapa dan di mana?', opsi: ['7時{じ}に山{やま}の下{した}で', '7時{じ}に駅{えき}で', '8時{じ}に駅{えき}で'], benar: 1, pembahasan: '朝7時に駅で会って = bertemu di stasiun pukul 7 pagi.' },
          { id: 'L4-45-2', tanya: '山{やま}の上{うえ}まで何時間{なんじかん}ぐらい歩{ある}きますか。', tanyaId: 'Berjalan kira-kira berapa jam sampai puncak gunung?', opsi: ['2時間{じかん}', '3時間{じかん}', '4時間{じかん}'], benar: 1, pembahasan: '8時から歩いて、11時ごろ山の上に着きます = berjalan mulai pukul 8 dan tiba di puncak sekitar pukul 11 (jadi kira-kira tiga jam).' },
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
        teks: 'わたしの町{まち}には、先月{せんげつ}から新{あたら}しい図書館{としょかん}があります。駅{えき}から歩{ある}いて5分{ふん}です。前{まえ}の図書館{としょかん}より大{おお}きくて、勉強{べんきょう}する部屋{へや}もあります。わたしは毎週{まいしゅう}土曜日{どようび}に、その部屋{へや}で宿題{しゅくだい}をします。図書館{としょかん}は朝{あさ}9時{じ}から夜{よる}8時{じ}までですが、日曜日{にちようび}は午後{ごご}5時{じ}までです。月曜日{げつようび}は休{やす}みです。本{ほん}は2週間{しゅうかん}借{か}りることができます。日曜日{にちようび}の午前{ごぜん}は、図書館{としょかん}の人{ひと}が子{こ}どもに本{ほん}を読{よ}みます。妹{いもうと}は5歳{さい}で、本{ほん}がとても好{す}きですが、まだ字{じ}をあまり読{よ}むことができません。ですから、来週{らいしゅう}の日曜日{にちようび}、妹{いもうと}と図書館{としょかん}へ行{い}きたいです。',
        terjemahan: 'Di kota saya ada perpustakaan baru sejak bulan lalu. Dari stasiun berjalan kaki 5 menit. Perpustakaan itu lebih besar daripada perpustakaan lama dan juga memiliki ruang belajar. Setiap hari Sabtu saya mengerjakan PR di ruang itu. Perpustakaan buka dari pukul 9 pagi sampai pukul 8 malam, tetapi hari Minggu hanya sampai pukul 5 sore. Hari Senin libur. Buku boleh dipinjam selama dua minggu. Pada hari Minggu sebelum tengah hari, petugas perpustakaan membacakan buku untuk anak-anak. Adik perempuan saya berumur 5 tahun dan sangat suka buku, tetapi ia belum begitu bisa membaca huruf. Karena itu, hari Minggu minggu depan saya ingin pergi ke perpustakaan bersama adik.',
        soal: [
          { id: 'L5-1-1', tanya: '図書館{としょかん}は日曜日{にちようび}、何時{なんじ}までですか。', tanyaId: 'Pada hari Minggu, perpustakaan buka sampai pukul berapa?', opsi: ['夜{よる}8時{じ}', '午後{ごご}5時{じ}', '夜{よる}9時{じ}'], benar: 1, pembahasan: '図書館は朝9時から夜8時までですが、日曜日は午後5時までです = perpustakaan buka dari pukul 9 pagi sampai pukul 8 malam, tetapi hari Minggu hanya sampai pukul 5 sore (pukul 8 malam berlaku untuk hari lain).' },
          { id: 'L5-1-2', tanya: 'どうして「わたし」は来週{らいしゅう}の日曜日{にちようび}、妹{いもうと}と図書館{としょかん}へ行{い}きたいですか。', tanyaId: 'Mengapa "saya" ingin pergi ke perpustakaan bersama adik pada hari Minggu minggu depan?', opsi: ['図書館{としょかん}の人{ひと}が妹{いもうと}に本{ほん}を読{よ}んでくれるからです', '妹{いもうと}は字{じ}をたくさん読{よ}むことができるからです', '日曜日{にちようび}に勉強{べんきょう}する部屋{へや}で宿題{しゅくだい}をするからです'], benar: 0, pembahasan: '日曜日の午前は、図書館の人が子どもに本を読みます…まだ字をあまり読むことができません。ですから、来週の日曜日、妹と図書館へ行きたいです = hari Minggu sebelum tengah hari petugas membacakan buku untuk anak-anak … adik belum begitu bisa membaca huruf; karena itu saya ingin pergi hari Minggu (petugas akan membacakan buku untuk adik; adik justru belum bisa banyak membaca, dan PR dikerjakan hari Sabtu).' },
        ],
      },
      {
        id: 'L5-2',
        judul: '料理{りょうり}を作{つく}る日{ひ}',
        teks: '先週{せんしゅう}の日曜日{にちようび}、家族{かぞく}みんなでカレーを作{つく}りました。いつもは母{はは}が一人{ひとり}で晩{ばん}ごはんを作{つく}りますが、その日{ひ}は母{はは}が「みんなで作{つく}りましょう」と言{い}いました。いつもの店{みせ}は日曜日{にちようび}が休{やす}みですから、駅{えき}の前{まえ}の大{おお}きいスーパーへ行{い}きました。大{おお}きいスーパーは少{すこ}し高{たか}いです。そこで肉{にく}と野菜{やさい}を買{か}いました。うちへ帰{かえ}ってから、父{ちち}は野菜{やさい}を洗{あら}って、母{はは}は肉{にく}と野菜{やさい}を切{き}りました。わたしと弟{おとうと}はテーブルを準備{じゅんび}しました。少{すこ}し時間{じかん}がかかりましたが、みんなで作{つく}りましたから、いつもよりおいしかったです。',
        terjemahan: 'Hari Minggu minggu lalu, seluruh keluarga membuat kari bersama. Biasanya ibu memasak makan malam sendirian, tetapi hari itu ibu berkata, "Ayo kita masak bersama-sama." Toko langganan kami libur pada hari Minggu, jadi kami pergi ke supermarket besar di depan stasiun. Supermarket besar itu agak mahal. Di sana kami membeli daging dan sayuran. Setelah pulang ke rumah, ayah mencuci sayuran, dan ibu memotong daging dan sayuran. Saya dan adik laki-laki menyiapkan meja. Memang memakan sedikit waktu, tetapi karena dibuat bersama-sama, rasanya lebih enak daripada biasanya.',
        soal: [
          { id: 'L5-2-1', tanya: '父{ちち}は何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan ayah?', opsi: ['テーブルを準備{じゅんび}しました', '肉{にく}と野菜{やさい}を切{き}りました', '野菜{やさい}を洗{あら}いました'], benar: 2, pembahasan: '父は野菜を洗って、母は肉と野菜を切りました = ayah mencuci sayuran, dan ibu memotong daging dan sayuran (meja disiapkan oleh saya dan adik).' },
          { id: 'L5-2-2', tanya: 'どうして駅{えき}の前{まえ}の大{おお}きいスーパーへ行{い}きましたか。', tanyaId: 'Mengapa mereka pergi ke supermarket besar di depan stasiun?', opsi: ['大{おお}きいスーパーはいつもの店{みせ}より安{やす}いからです', 'いつもの店{みせ}がその日{ひ}は休{やす}みだったからです', '母{はは}が「大{おお}きいスーパーへ行{い}きましょう」と言{い}ったからです'], benar: 1, pembahasan: 'いつもの店は日曜日が休みですから、駅の前の大きいスーパーへ行きました = toko langganan libur pada hari Minggu, jadi kami pergi ke supermarket besar di depan stasiun (hari itu hari Minggu; supermarket besar justru agak mahal, dan yang dikatakan ibu hanya "ayo masak bersama-sama").' },
        ],
      },
      {
        id: 'L5-3',
        judul: 'アキさんとの約束{やくそく}',
        teks: '土曜日{どようび}、アキさんと公園{こうえん}へ行{い}く約束{やくそく}をしました。公園{こうえん}でテニスをして、お弁当{べんとう}を食{た}べたかったです。でも、その日{ひ}は朝{あさ}から雨{あめ}が降{ふ}っていました。わたしはアキさんに電話{でんわ}しました。アキさんは「公園{こうえん}はやめて、駅{えき}の近{ちか}くの美術館{びじゅつかん}に行{い}きませんか」と言{い}いました。わたしたちは10時{じ}に駅{えき}で会{あ}って、いっしょに美術館{びじゅつかん}へ行{い}きました。美術館{びじゅつかん}では日本{にほん}の古{ふる}い絵{え}を見{み}ることができました。昼{ひる}ごはんは美術館{びじゅつかん}の近{ちか}くのレストランで食{た}べました。雨{あめ}でしたが、楽{たの}しい一日{いちにち}になりました。',
        terjemahan: 'Pada hari Sabtu, saya berjanji pergi ke taman dengan Aki. Saya ingin bermain tenis dan makan bekal di taman. Tetapi hari itu sejak pagi turun hujan. Saya menelepon Aki. Aki berkata, "Bagaimana kalau batal ke taman dan pergi ke museum seni dekat stasiun?" Kami bertemu di stasiun pukul 10, lalu pergi bersama ke museum seni. Di museum kami bisa melihat lukisan Jepang yang tua. Makan siang kami di restoran dekat museum. Walaupun hujan, hari itu menjadi menyenangkan.',
        soal: [
          { id: 'L5-3-1', tanya: '二人{ふたり}は昼{ひる}ごはんをどこで食{た}べましたか。', tanyaId: 'Di mana mereka berdua makan siang?', opsi: ['公園{こうえん}で', '美術館{びじゅつかん}から近{ちか}いレストランで', '駅{えき}の中{なか}のレストランで'], benar: 1, pembahasan: '昼ごはんは美術館の近くのレストランで食べました = makan siang kami di restoran dekat museum (makan bekal di taman hanya keinginan awal).' },
          { id: 'L5-3-2', tanya: 'どうして二人{ふたり}は美術館{びじゅつかん}へ行{い}きましたか。', tanyaId: 'Mengapa mereka berdua pergi ke museum seni?', opsi: ['「わたし」が日本{にほん}の古{ふる}い絵{え}を見{み}たかったからです', '公園{こうえん}でテニスをしたくなかったからです', 'アキさんが「美術館{びじゅつかん}に行{い}きませんか」と言{い}ったからです'], benar: 2, pembahasan: 'アキさんは「公園はやめて、駅の近くの美術館に行きませんか」と言いました = Aki berkata, "Bagaimana kalau batal ke taman dan pergi ke museum seni dekat stasiun?" (mereka pergi karena ajakan Aki; "saya" sebenarnya ingin bermain tenis di taman).' },
        ],
      },
      {
        id: 'L5-4',
        judul: '先生{せんせい}へのメール',
        teks: 'これは、リナさんから山田{やまだ}先生{せんせい}にきたメールです。\n山田{やまだ}先生{せんせい}、こんにちは。リナです。来週{らいしゅう}の月曜日{げつようび}に、国{くに}から母{はは}が日本{にほん}へ来{き}ます。飛行機{ひこうき}は午後{ごご}3時{じ}に空港{くうこう}に着{つ}きますから、わたしは空港{くうこう}へ迎{むか}えに行{い}きます。ですから、月曜日{げつようび}の日本語{にほんご}のクラスを休{やす}みます。すみません。母{はは}は2週間{しゅうかん}日本{にほん}にいます。水曜日{すいようび}のクラスには行{い}きます。月曜日{げつようび}の宿題{しゅくだい}は、火曜日{かようび}に事務所{じむしょ}に出{だ}してもいいですか。よろしくお願{ねが}いします。\nリナ',
        terjemahan: 'Ini email dari Rina kepada Guru Yamada. Guru Yamada, selamat siang. Ini Rina. Senin minggu depan ibu saya datang ke Jepang dari negara asal. Pesawatnya tiba di bandara pukul 3 sore, jadi saya akan menjemputnya di bandara. Karena itu, saya tidak masuk kelas bahasa Jepang hari Senin. Mohon maaf. Ibu saya akan berada di Jepang selama dua minggu. Kelas hari Rabu akan saya hadiri. Bolehkah PR hari Senin saya serahkan ke kantor pada hari Selasa? Terima kasih. Rina',
        soal: [
          { id: 'L5-4-1', tanya: 'リナさんは来週{らいしゅう}、何曜日{なんようび}の日本語{にほんご}のクラスに行{い}きますか。', tanyaId: 'Minggu depan, Rina akan masuk kelas bahasa Jepang hari apa?', opsi: ['月曜日{げつようび}', '火曜日{かようび}', '水曜日{すいようび}'], benar: 2, pembahasan: '水曜日のクラスには行きます = kelas hari Rabu akan ia hadiri (kelas Senin ia tidak masuk; hari Selasa ia hanya menyerahkan PR ke kantor).' },
          { id: 'L5-4-2', tanya: 'リナさんはどうして月曜日{げつようび}のクラスを休{やす}みますか。', tanyaId: 'Mengapa Rina tidak masuk kelas hari Senin?', opsi: ['空港{くうこう}でお母{かあ}さんに会{あ}うからです', 'お母{かあ}さんといっしょに国{くに}へ帰{かえ}るからです', '事務所{じむしょ}へ宿題{しゅくだい}を出{だ}しに行{い}くからです'], benar: 0, pembahasan: 'わたしは空港へ迎えに行きます。ですから、月曜日の日本語のクラスを休みます = saya pergi menjemput (ibu) di bandara; karena itu saya tidak masuk kelas bahasa Jepang hari Senin (ia menemui ibunya yang datang ke Jepang, bukan pulang bersama; PR diserahkan hari Selasa).' },
        ],
      },
      {
        id: 'L5-5',
        judul: 'わたしのしゅみ',
        teks: 'わたしのしゅみは写真{しゃしん}をとることです。休{やす}みの日{ひ}は、カメラを持{も}って山{やま}や海{うみ}へ行{い}きます。人{ひと}の写真{しゃしん}より、花{はな}や山{やま}の写真{しゃしん}が好{す}きです。父{ちち}はもう写真{しゃしん}をとりませんから、わたしに今{いま}のカメラをくれました。とてもいいカメラですが、父{ちち}が若{わか}い時{とき}に買{か}ったカメラですから、とても重{おも}いです。山{やま}へ行{い}く時{とき}は、大変{たいへん}です。ですから、今{いま}は軽{かる}い新{あたら}しいカメラがほしいです。新{あたら}しいカメラは8万円{まんえん}です。今{いま}、毎週{まいしゅう}土曜日{どようび}にアルバイトをしています。',
        terjemahan: 'Hobi saya memotret. Pada hari libur saya membawa kamera ke gunung atau laut. Saya lebih suka foto bunga dan gunung daripada foto orang. Ayah sudah tidak memotret lagi, jadi ia memberi saya kamera yang sekarang. Kameranya sangat bagus, tetapi itu kamera yang dibeli ayah waktu masih muda, jadi sangat berat. Saat pergi ke gunung, rasanya repot sekali. Karena itu, sekarang saya ingin kamera baru yang ringan. Kamera baru harganya 80.000 yen. Sekarang saya bekerja paruh waktu setiap hari Sabtu.',
        soal: [
          { id: 'L5-5-1', tanya: '休{やす}みの日{ひ}、この人{ひと}はどこへ行{い}きますか。', tanyaId: 'Ke mana orang ini pergi pada hari libur?', opsi: ['美術館{びじゅつかん}', 'カメラの店{みせ}', '山{やま}や海{うみ}'], benar: 2, pembahasan: '休みの日は、カメラを持って山や海へ行きます = pada hari libur saya membawa kamera ke gunung atau laut.' },
          { id: 'L5-5-2', tanya: 'どうしてこの人{ひと}は新{あたら}しいカメラがほしいですか。', tanyaId: 'Mengapa orang ini menginginkan kamera baru?', opsi: ['父{ちち}が今{いま}のカメラを使{つか}いたいからです', '今{いま}のカメラが軽{かる}くないからです', '花{はな}より人{ひと}の写真{しゃしん}をとりたいからです'], benar: 1, pembahasan: 'とても重いです。山へ行く時は、大変です。ですから、今は軽い新しいカメラがほしいです = kameranya sangat berat; saat pergi ke gunung terasa repot; karena itu sekarang ingin kamera baru yang ringan (kamera sekarang tidak ringan; ayah sudah tidak memotret lagi, dan ia lebih suka foto bunga dan gunung daripada foto orang).' },
        ],
      },
      {
        id: 'L5-6',
        judul: 'はじめての雪{ゆき}',
        teks: 'わたしはインドネシアから来{き}ました。去年{きょねん}の12月{がつ}、はじめて雪{ゆき}を見{み}ました。雪{ゆき}はきれいでしたが、外{そと}はとても寒{さむ}かったです。寮{りょう}の部屋{へや}はエアコンがありますから、あたたかいです。でも、インドネシアは一年中{いちねんじゅう}暑{あつ}いですから、わたしは冬{ふゆ}の服{ふく}を持{も}っていませんでした。となりの部屋{へや}のマヤさんは日本{にほん}に来{き}て2年{ねん}ですから、あたたかいコートを持{も}っています。日曜日{にちようび}、マヤさんと二人{ふたり}でデパートへ行{い}きました。わたしは黒{くろ}いコートを、マヤさんは赤{あか}いぼうしを買{か}いました。コートは8000円{えん}で、少{すこ}し高{たか}かったです。',
        terjemahan: 'Saya datang dari Indonesia. Bulan Desember tahun lalu, saya melihat salju untuk pertama kali. Saljunya indah, tetapi di luar sangat dingin. Kamar asrama ada AC-nya, jadi hangat. Tetapi Indonesia panas sepanjang tahun, jadi saya tidak punya pakaian musim dingin. Maya, penghuni kamar sebelah, sudah dua tahun di Jepang, jadi ia punya mantel yang hangat. Hari Minggu saya pergi berdua dengan Maya ke department store. Saya membeli mantel hitam, dan Maya membeli topi merah. Mantelnya 8.000 yen, agak mahal.',
        soal: [
          { id: 'L5-6-1', tanya: 'マヤさんはデパートで何{なに}を買{か}いましたか。', tanyaId: 'Apa yang dibeli Maya di department store?', opsi: ['赤{あか}いぼうし', '赤{あか}いコート', '黒{くろ}いぼうし'], benar: 0, pembahasan: 'わたしは黒いコートを、マヤさんは赤いぼうしを買いました = saya membeli mantel hitam, dan Maya membeli topi merah.' },
          { id: 'L5-6-2', tanya: 'どうして「わたし」はデパートでコートを買{か}いましたか。', tanyaId: 'Mengapa "saya" membeli mantel di department store?', opsi: ['寮{りょう}の部屋{へや}がとても寒{さむ}かったからです', 'デパートのコートが安{やす}かったからです', '冬{ふゆ}の服{ふく}がなかったからです'], benar: 2, pembahasan: 'インドネシアは一年中暑いですから、わたしは冬の服を持っていませんでした = Indonesia panas sepanjang tahun, jadi saya tidak punya pakaian musim dingin (karena itu ia membeli mantel; kamar asrama hangat karena ada AC, dan mantelnya justru agak mahal).' },
        ],
      },
      {
        id: 'L5-7',
        judul: 'おばあさんの誕生日{たんじょうび}',
        teks: '来週{らいしゅう}の日曜日{にちようび}はおばあさんの80歳{さい}の誕生日{たんじょうび}です。家族{かぞく}みんなでレストランで食事{しょくじ}をします。父{ちち}と母{はは}はおばあさんに新{あたら}しいめがねをあげます。わたしは赤{あか}い花{はな}をあげたいと思{おも}います。ケーキは、母{はは}は「レストランで買{か}いましょう」と言{い}いましたが、姉{あね}は「わたしが作{つく}ります」と言{い}いました。去年{きょねん}の誕生日{たんじょうび}に、姉{あね}はチョコレートのケーキを作{つく}りました。その時{とき}、おばあさんは「店{みせ}のケーキよりおいしいです」と言{い}いました。ですから、今年{ことし}も姉{あね}が作{つく}ります。おばあさんは甘{あま}いものがとても好{す}きですから、きっと「おいしいです」と言{い}うと思{おも}います。',
        terjemahan: 'Hari Minggu minggu depan adalah ulang tahun nenek yang ke-80. Seluruh keluarga akan makan di restoran. Ayah dan ibu akan memberi nenek kacamata baru. Saya ingin memberi bunga merah. Soal kue, ibu berkata, "Kita beli di restoran saja," tetapi kakak perempuan berkata, "Saya yang akan membuatnya." Pada ulang tahun tahun lalu, kakak membuat kue cokelat. Waktu itu nenek berkata, "Ini lebih enak daripada kue toko." Karena itu, tahun ini pun kakak yang membuat. Nenek sangat suka makanan manis, jadi saya rasa ia pasti akan berkata "enak".',
        soal: [
          { id: 'L5-7-1', tanya: '「わたし」はおばあさんに何{なに}をあげたいですか。', tanyaId: 'Apa yang ingin diberikan "saya" kepada nenek?', opsi: ['新{あたら}しいめがね', 'チョコレートのケーキ', '赤{あか}い花{はな}'], benar: 2, pembahasan: 'わたしは赤い花をあげたいと思います = saya ingin memberi bunga merah (kacamata dari ayah dan ibu, kue dari kakak).' },
          { id: 'L5-7-2', tanya: '「ですから、今年{ことし}も姉{あね}が作{つく}ります」とありますが、どうしてですか。', tanyaId: 'Tertulis "karena itu, tahun ini pun kakak yang membuat"; mengapa demikian?', opsi: ['母{はは}が「ケーキは姉{あね}が作{つく}ってください」と言{い}ったからです', 'おばあさんは店{みせ}のケーキより姉{あね}のケーキが好{す}きだからです', 'そのレストランにはケーキがないからです'], benar: 1, pembahasan: 'おばあさんは「店のケーキよりおいしいです」と言いました。ですから、今年も姉が作ります = nenek berkata "lebih enak daripada kue toko"; karena itu tahun ini pun kakak yang membuat (nenek lebih menyukai kue buatan kakak; ibu justru mengusulkan membeli kue di restoran, jadi di restoran ada kue).' },
        ],
      },
      {
        id: 'L5-8',
        judul: 'ナディアさんのうちまでの道{みち}',
        teks: 'これは、ナディアさんから会社{かいしゃ}の田中{たなか}さんにきたメールです。\n田中{たなか}さん、土曜日{どようび}のパーティーは午後{ごご}6時{じ}からです。わたしは土曜日{どようび}も5時{じ}まで仕事{しごと}がありますから、少{すこ}しおそいです。すみません。わたしのうちまでの道{みち}を書{か}きます。駅{えき}を出{で}て、前{まえ}の道{みち}をまっすぐ行{い}ってください。二{ふた}つ目{め}のかどを右{みぎ}にまがってください。左{ひだり}に郵便局{ゆうびんきょく}があります。郵便局{ゆうびんきょく}のとなりに白{しろ}いビルがあります。わたしのうちは、そのビルの3階{がい}のいちばん右{みぎ}です。駅{えき}から歩{ある}いて10分{ぷん}ぐらいです。\nナディア',
        terjemahan: 'Ini email dari Nadia kepada Tanaka, rekan di kantor. Tanaka, pesta hari Sabtu mulai pukul 6 sore. Hari Sabtu pun saya ada pekerjaan sampai pukul 5, jadi waktunya agak lambat. Maaf. Saya tuliskan jalan ke rumah saya. Keluar dari stasiun, lalu jalan lurus di jalan depan stasiun. Beloklah ke kanan di tikungan kedua. Di sebelah kiri ada kantor pos. Di sebelah kantor pos ada gedung putih. Rumah saya di lantai 3 gedung itu, paling kanan. Dari stasiun berjalan kaki sekitar 10 menit. Nadia',
        soal: [
          { id: 'L5-8-1', tanya: '二{ふた}つ目{め}のかどでどうしますか。', tanyaId: 'Apa yang dilakukan di tikungan kedua?', opsi: ['左{ひだり}にまがります', 'まっすぐ行{い}きます', '右{みぎ}にまがります'], benar: 2, pembahasan: '二つ目のかどを右にまがってください = beloklah ke kanan di tikungan kedua (jalan lurus dilakukan sebelumnya; kantor pos ada di sebelah kiri).' },
          { id: 'L5-8-2', tanya: 'どうしてパーティーは6時{じ}からですか。', tanyaId: 'Mengapa pestanya mulai pukul 6?', opsi: ['ナディアさんが土曜日{どようび}も5時{じ}まで働{はたら}くからです', '田中{たなか}さんが土曜日{どようび}も5時{じ}まで働{はたら}くからです', '駅{えき}からナディアさんのうちまで1時間{じかん}かかるからです'], benar: 0, pembahasan: 'わたしは土曜日も5時まで仕事がありますから、少しおそいです = hari Sabtu pun saya ada pekerjaan sampai pukul 5, jadi (pestanya) agak lambat (yang bekerja adalah Nadia sendiri; dari stasiun hanya sekitar 10 menit berjalan kaki).' },
        ],
      },
      {
        id: 'L5-9',
        judul: '二{ふた}つの店{みせ}',
        teks: '駅{えき}の前{まえ}にスーパーが二{ふた}つあります。「さくら」と「ふじ」です。さくらは安{やす}いですが、いつも人{ひと}が多{おお}くて、お金{かね}を払{はら}う時{とき}、長{なが}く待{ま}ちます。ふじは少{すこ}し高{たか}いですが、野菜{やさい}や肉{にく}がとても新{あたら}しいです。そして、人{ひと}が少{すく}ないですから、あまり待{ま}ちません。さくらは朝{あさ}9時{じ}から夜{よる}8時{じ}まで、ふじは朝{あさ}10時{じ}から夜{よる}11時{じ}までです。わたしは仕事{しごと}がある日{ひ}は時間{じかん}がありませんから、ふじで買{か}い物{もの}をします。休{やす}みの日{ひ}は、さくらで1週間{しゅうかん}の野菜{やさい}や肉{にく}を買{か}います。きのうは休{やす}みでしたから、さくらへ行{い}って、30分{ぷん}待{ま}ちました。',
        terjemahan: 'Di depan stasiun ada dua supermarket, yaitu "Sakura" dan "Fuji". Sakura murah, tetapi selalu ramai, dan saat membayar harus menunggu lama. Fuji agak mahal, tetapi sayuran dan dagingnya sangat segar. Selain itu, pengunjungnya sedikit, jadi tidak lama menunggu. Sakura buka dari pukul 9 pagi sampai pukul 8 malam, dan Fuji dari pukul 10 pagi sampai pukul 11 malam. Pada hari kerja saya tidak punya waktu, jadi saya berbelanja di Fuji. Pada hari libur saya membeli sayuran dan daging untuk satu minggu di Sakura. Kemarin hari libur, jadi saya pergi ke Sakura dan menunggu 30 menit.',
        soal: [
          { id: 'L5-9-1', tanya: 'きのう、「わたし」はさくらで何分{なんぷん}待{ま}ちましたか。', tanyaId: 'Kemarin "saya" menunggu berapa menit di Sakura?', opsi: ['10分{ぷん}', '20分{ぷん}', '30分{ぷん}'], benar: 2, pembahasan: 'きのうは休みでしたから、さくらへ行って、30分待ちました = kemarin hari libur, jadi saya pergi ke Sakura dan menunggu 30 menit.' },
          { id: 'L5-9-2', tanya: 'どうして「わたし」は仕事{しごと}がある日{ひ}、ふじで買{か}い物{もの}をしますか。', tanyaId: 'Mengapa pada hari kerja "saya" berbelanja di Fuji?', opsi: ['ふじでは買{か}い物{もの}に時間{じかん}がかからないからです', 'ふじは野菜{やさい}や肉{にく}がさくらより安{やす}いからです', 'ふじはさくらより早{はや}い時間{じかん}から買{か}い物{もの}ができるからです'], benar: 0, pembahasan: '人が少ないですから、あまり待ちません…わたしは仕事がある日は時間がありませんから、ふじで買い物をします = (di Fuji) pengunjungnya sedikit, jadi tidak lama menunggu … pada hari kerja saya tidak punya waktu, jadi berbelanja di Fuji (belanja di Fuji tidak makan waktu; Fuji justru lebih mahal daripada Sakura dan baru buka pukul 10, sedangkan Sakura pukul 9).' },
        ],
      },
      {
        id: 'L5-10',
        judul: '日本語{にほんご}の勉強{べんきょう}',
        teks: 'これはアニさんが書{か}いたさくぶんです。\nわたしは日本{にほん}で働{はたら}きたいですから、毎日{まいにち}日本語{にほんご}を勉強{べんきょう}しています。朝{あさ}は30分{ぷん}ぐらい新{あたら}しい漢字{かんじ}を覚{おぼ}えます。土曜日{どようび}は町{まち}の日本語教室{にほんごきょうしつ}へ行{い}きます。先生{せんせい}は木村{きむら}さんで、とても親切{しんせつ}です。先月{せんげつ}、教室{きょうしつ}で試験{しけん}がありました。漢字{かんじ}の試験{しけん}はよくできましたが、聞{き}く試験{しけん}はあまりできませんでした。ですから、今{いま}は毎晩{まいばん}、日本{にほん}のテレビを1時間{じかん}見{み}ます。はじめはぜんぜんわかりませんでしたが、今{いま}は少{すこ}しわかります。',
        terjemahan: 'Ini adalah karangan yang ditulis oleh Ani. Saya ingin bekerja di Jepang, jadi setiap hari saya belajar bahasa Jepang. Pagi hari saya menghafal kanji baru sekitar 30 menit. Hari Sabtu saya pergi ke kelas bahasa Jepang di kota. Gurunya Kimura, orangnya sangat baik. Bulan lalu ada ujian di kelas. Ujian kanji bisa saya kerjakan dengan baik, tetapi ujian mendengar kurang bisa saya kerjakan. Karena itu, sekarang setiap malam saya menonton televisi Jepang selama satu jam. Awalnya saya sama sekali tidak mengerti, tetapi sekarang sedikit mengerti.',
        soal: [
          { id: 'L5-10-1', tanya: '朝{あさ}は何{なに}をしますか。', tanyaId: 'Apa yang dilakukan pada pagi hari?', opsi: ['漢字{かんじ}の勉強{べんきょう}をします', '日本{にほん}のテレビを見{み}ます', '日本語教室{にほんごきょうしつ}へ行{い}きます'], benar: 0, pembahasan: '朝は30分ぐらい新しい漢字を覚えます = pagi hari saya menghafal kanji baru sekitar 30 menit (menghafal kanji = belajar kanji; televisi ditonton malam hari, kelas pada hari Sabtu).' },
          { id: 'L5-10-2', tanya: '「今{いま}は少{すこ}しわかります」とありますが、何{なに}が少{すこ}しわかりますか。', tanyaId: '"Sekarang sedikit mengerti" — apa yang sedikit dimengerti?', opsi: ['新{あたら}しい漢字{かんじ}', '日本{にほん}のテレビ', '教室{きょうしつ}の試験{しけん}'], benar: 1, pembahasan: '今は毎晩、日本のテレビを1時間見ます。はじめはぜんぜんわかりませんでしたが、今は少しわかります = sekarang setiap malam ia menonton televisi Jepang satu jam; awalnya sama sekali tidak mengerti, tetapi sekarang sedikit mengerti (yang sedikit dimengerti adalah televisi Jepang).' },
        ],
      },
      {
        id: 'L5-11',
        judul: '母{はは}への手紙{てがみ}',
        teks: 'これは、デウィさんが国{くに}のお母{かあ}さんに書{か}いた手紙{てがみ}です。\nお母{かあ}さん、お元気{げんき}ですか。わたしは元気{げんき}です。日本{にほん}に来{き}て、3か月{げつ}になりました。今{いま}は車{くるま}の会社{かいしゃ}で働{はたら}いています。仕事{しごと}は少{すこ}し大変{たいへん}ですが、会社{かいしゃ}の人{ひと}はみんな親切{しんせつ}です。毎晩{まいばん}、寮{りょう}で日本語{にほんご}を勉強{べんきょう}しています。日本{にほん}の食{た}べ物{もの}はおいしいですが、とても高{たか}いです。ですから、晩{ばん}ごはんはいつも寮{りょう}で作{つく}ります。きのう、お母{かあ}さんに3万円{まんえん}送{おく}りました。弟{おとうと}の学校{がっこう}のお金{かね}に使{つか}ってください。来年{らいねん}の3月{がつ}に一度{いちど}国{くに}へ帰{かえ}ります。\nデウィ',
        terjemahan: 'Ini surat yang ditulis Dewi untuk ibunya di negara asal. Ibu, apa kabar? Saya baik-baik saja. Sudah tiga bulan sejak saya datang ke Jepang. Sekarang saya bekerja di perusahaan mobil. Pekerjaannya agak berat, tetapi semua orang di perusahaan baik hati. Setiap malam saya belajar bahasa Jepang di asrama. Makanan Jepang enak, tetapi sangat mahal. Karena itu, makan malam selalu saya masak sendiri di asrama. Kemarin saya mengirim 30.000 yen kepada Ibu. Tolong pakai untuk biaya sekolah adik. Bulan Maret tahun depan saya pulang sekali ke negara asal. Dewi',
        soal: [
          { id: 'L5-11-1', tanya: 'デウィさんは日本{にほん}に来{き}て、どのぐらいになりましたか。', tanyaId: 'Sudah berapa lama Dewi berada di Jepang?', opsi: ['3か月{げつ}', '1か月{げつ}', '1年{ねん}'], benar: 0, pembahasan: '日本に来て、3か月になりました = sudah tiga bulan sejak datang ke Jepang.' },
          { id: 'L5-11-2', tanya: 'どうしてデウィさんは晩{ばん}ごはんを寮{りょう}で作{つく}りますか。', tanyaId: 'Mengapa Dewi memasak makan malam di asrama?', opsi: ['日本{にほん}の食{た}べ物{もの}はおいしくないからです', '日本{にほん}の食{た}べ物{もの}は安{やす}くないからです', '毎晩{まいばん}、寮{りょう}で日本語{にほんご}を勉強{べんきょう}するからです'], benar: 1, pembahasan: '日本の食べ物はおいしいですが、とても高いです。ですから、晩ごはんはいつも寮で作ります = makanan Jepang enak, tetapi sangat mahal; karena itu makan malam selalu dimasak di asrama (mahal = tidak murah; makanannya justru enak, dan belajar di asrama bukan alasannya).' },
        ],
      },
      {
        id: 'L5-12',
        judul: '会社{かいしゃ}の人{ひと}からのメール',
        teks: 'これは、会社{かいしゃ}の佐藤{さとう}さんからアディさんにきたメールです。\nアディさん、来週{らいしゅう}から夜{よる}の仕事{しごと}になりますね。夜{よる}の仕事{しごと}は10時{じ}から朝{あさ}7時{じ}までです。会社{かいしゃ}のバスは9時{じ}半{はん}に寮{りょう}の前{まえ}から出{で}ます。夜{よる}は会社{かいしゃ}の中{なか}がとても寒{さむ}いですから、あたたかい服{ふく}を着{き}てきてください。会社{かいしゃ}の食堂{しょくどう}は、夜{よる}は休{やす}みです。ですから、晩{ばん}ごはんは寮{りょう}で食{た}べてから、バスに乗{の}ってください。休{やす}みは2時{じ}から3時{じ}までの1時間{じかん}です。その時{とき}、パンを食{た}べてもいいです。わからないことは、わたしに聞{き}いてください。\n佐藤{さとう}',
        terjemahan: 'Ini email dari Sato, rekan di kantor, kepada Adi. Adi, mulai minggu depan kamu masuk kerja malam, ya. Kerja malam dari pukul 10 malam sampai pukul 7 pagi. Bus perusahaan berangkat dari depan asrama pukul 9.30. Pada malam hari di dalam kantor sangat dingin, jadi datanglah dengan memakai baju hangat. Kantin perusahaan tutup pada malam hari. Karena itu, makan malamlah dulu di asrama, baru naik bus. Istirahatnya satu jam, dari pukul 2 sampai pukul 3. Pada waktu itu boleh makan roti. Kalau ada yang tidak dimengerti, tanyakan kepada saya. Sato',
        soal: [
          { id: 'L5-12-1', tanya: '夜{よる}の仕事{しごと}の休{やす}みは何時{なんじ}からですか。', tanyaId: 'Istirahat kerja malam mulai pukul berapa?', opsi: ['10時{じ}', '3時{じ}', '2時{じ}'], benar: 2, pembahasan: '休みは2時から3時までの1時間です = istirahat satu jam, dari pukul 2 sampai pukul 3 (pukul 10 adalah mulai kerja, pukul 3 akhir istirahat).' },
          { id: 'L5-12-2', tanya: 'どうして晩{ばん}ごはんは寮{りょう}で食{た}べますか。', tanyaId: 'Mengapa makan malam harus di asrama?', opsi: ['夜{よる}、会社{かいしゃ}の食堂{しょくどう}で食{た}べることができないからです', '仕事{しごと}の休{やす}みの時間{じかん}に食{た}べてはいけないからです', '夜{よる}は会社{かいしゃ}の中{なか}がとても寒{さむ}くなるからです'], benar: 0, pembahasan: '会社の食堂は、夜は休みです。ですから、晩ごはんは寮で食べてから、バスに乗ってください = kantin perusahaan tutup pada malam hari; karena itu makan malamlah di asrama dulu, baru naik bus (malam hari tidak bisa makan di kantin; saat istirahat boleh makan roti; udara dingin adalah alasan memakai baju hangat).' },
        ],
      },
      {
        id: 'L5-13',
        judul: 'はじめての残業{ざんぎょう}',
        teks: '先週{せんしゅう}の金曜日{きんようび}、はじめて残業{ざんぎょう}をしました。いつもは午後{ごご}5時{じ}に仕事{しごと}が終{お}わりますが、その日{ひ}は8時{じ}まで働{はたら}きました。その日{ひ}は仕事{しごと}がとても多{おお}かったです。仕事{しごと}のあとで、会社{かいしゃ}の田中{たなか}さんが寮{りょう}まで車{くるま}で送{おく}ってくれました。いつもは寮{りょう}で晩{ばん}ごはんを作{つく}ります。でも、その日{ひ}はとても疲{つか}れていましたから、晩{ばん}ごはんはコンビニのお弁当{べんとう}でした。土曜日{どようび}は昼{ひる}まで寝{ね}ました。来週{らいしゅう}は水曜日{すいようび}に残業{ざんぎょう}があります。',
        terjemahan: 'Hari Jumat minggu lalu, untuk pertama kalinya saya kerja lembur. Biasanya pekerjaan selesai pukul 5 sore, tetapi hari itu saya bekerja sampai pukul 8. Hari itu pekerjaannya sangat banyak. Setelah bekerja, Tanaka dari kantor mengantar saya dengan mobil sampai ke asrama. Biasanya saya memasak makan malam di asrama. Tetapi hari itu saya sangat lelah, jadi makan malam saya adalah bekal dari minimarket. Hari Sabtu saya tidur sampai siang. Minggu depan ada lembur pada hari Rabu.',
        soal: [
          { id: 'L5-13-1', tanya: '先週{せんしゅう}の金曜日{きんようび}、「わたし」はいつもより何時間{なんじかん}長{なが}く働{はたら}きましたか。', tanyaId: 'Hari Jumat minggu lalu, "saya" bekerja berapa jam lebih lama daripada biasanya?', opsi: ['3時間{じかん}', '5時間{じかん}', '8時間{じかん}'], benar: 0, pembahasan: 'いつもは午後5時に仕事が終わりますが、その日は8時まで働きました = biasanya pekerjaan selesai pukul 5 sore, tetapi hari itu bekerja sampai pukul 8 (dari pukul 5 sampai pukul 8 = 3 jam lebih lama).' },
          { id: 'L5-13-2', tanya: 'どうして晩{ばん}ごはんはコンビニのお弁当{べんとう}でしたか。', tanyaId: 'Mengapa makan malamnya bekal dari minimarket?', opsi: ['田中{たなか}さんがお弁当{べんとう}を買{か}ってくれたからです', 'とても疲{つか}れていたからです', 'いつもコンビニのお弁当{べんとう}を食{た}べるからです'], benar: 1, pembahasan: 'でも、その日はとても疲れていましたから、晩ごはんはコンビニのお弁当でした = tetapi hari itu saya sangat lelah, jadi makan malamnya bekal dari minimarket (biasanya ia memasak di asrama; Tanaka hanya mengantar dengan mobil, tidak membelikan bekal).' },
        ],
      },
      {
        id: 'L5-14',
        judul: 'きのうの朝{あさ}',
        teks: 'きのう、はじめて一人{ひとり}で電車{でんしゃ}に乗{の}りました。いつもは会社{かいしゃ}のバスで行{い}きますが、きのうはバスが休{やす}みでした。駅{えき}はとても大{おお}きくて、人{ひと}がたくさんいました。きっぷの買{か}い方{かた}がわかりませんでしたから、駅{えき}の人{ひと}に聞{き}きました。駅{えき}の人{ひと}はすぐ教{おし}えてくれました。電車{でんしゃ}もすぐ来{き}ました。電車{でんしゃ}の中{なか}はあたたかかったですから、わたしは少{すこ}し寝{ね}ました。起{お}きた時{とき}、そこはもう会社{かいしゃ}の駅{えき}から三{みっ}つ目{め}の駅{えき}でした。仕事{しごと}は9時{じ}からですが、会社{かいしゃ}に着{つ}いた時{とき}は、もう9時{じ}半{はん}でした。',
        terjemahan: 'Kemarin untuk pertama kalinya saya naik kereta sendirian. Biasanya saya pergi dengan bus perusahaan, tetapi kemarin busnya libur. Stasiunnya sangat besar dan banyak orang. Saya tidak tahu cara membeli tiket, jadi saya bertanya kepada petugas stasiun. Petugas itu segera mengajari saya. Keretanya juga segera datang. Di dalam kereta hangat, jadi saya tidur sebentar. Saat bangun, tempat itu sudah stasiun ketiga dari stasiun kantor. Pekerjaan mulai pukul 9, tetapi saat saya tiba di kantor, sudah pukul 9.30.',
        soal: [
          { id: 'L5-14-1', tanya: '「わたし」はいつも何{なん}で会社{かいしゃ}へ行{い}きますか。', tanyaId: 'Biasanya "saya" pergi ke kantor dengan apa?', opsi: ['会社{かいしゃ}のバス', '電車{でんしゃ}', '自転車{じてんしゃ}'], benar: 0, pembahasan: 'いつもは会社のバスで行きますが、きのうはバスが休みでした = biasanya saya pergi dengan bus perusahaan, tetapi kemarin busnya libur (kereta hanya dinaiki kemarin).' },
          { id: 'L5-14-2', tanya: '「もう9時{じ}半{はん}でした」とありますが、どうしてですか。', tanyaId: 'Tertulis "sudah pukul 9.30"; mengapa demikian?', opsi: ['駅{えき}で電車{でんしゃ}を長{なが}く待{ま}ったからです', '電車{でんしゃ}で寝{ね}て、会社{かいしゃ}の駅{えき}で降{お}りなかったからです', 'きっぷの買{か}い方{かた}がわからなかったからです'], benar: 1, pembahasan: 'わたしは少し寝ました。起きた時、そこはもう会社の駅から三つ目の駅でした = saya tidur sebentar; saat bangun, tempat itu sudah stasiun ketiga dari stasiun kantor (ia terlewat turun; keretanya segera datang dan petugas segera mengajari cara membeli tiket).' },
        ],
      },
      {
        id: 'L5-15',
        judul: 'はじめての花見{はなみ}',
        teks: '先週{せんしゅう}の土曜日{どようび}、会社{かいしゃ}の人{ひと}たちと公園{こうえん}へ花見{はなみ}に行{い}きました。公園{こうえん}にはさくらの木{き}がたくさんあって、とてもきれいでした。部長{ぶちょう}は午後{ごご}1時{じ}から用事{ようじ}がありました。ですから、わたしたちは朝{あさ}7時{じ}に行{い}って、大{おお}きい木{き}の下{した}にすわりました。10時{じ}まで、みんなで話{はな}したり、写真{しゃしん}をとったりしました。11時{じ}に、そこでお弁当{べんとう}を食{た}べて、歌{うた}を歌{うた}いました。お弁当{べんとう}は田中{たなか}さんが作{つく}りました。インドネシアにはさくらがありませんから、わたしははじめて見{み}ました。来年{らいねん}もまた行{い}きたいです。',
        terjemahan: 'Sabtu minggu lalu saya pergi melihat bunga sakura ke taman bersama orang-orang kantor. Di taman ada banyak pohon sakura dan sangat indah. Kepala bagian ada urusan mulai pukul 1 siang. Karena itu, kami datang pukul 7 pagi dan duduk di bawah pohon besar. Sampai pukul 10 kami semua mengobrol dan memotret. Pukul 11 kami makan bekal di sana dan bernyanyi. Bekalnya dibuat oleh Tanaka. Di Indonesia tidak ada sakura, jadi itu pertama kalinya saya melihatnya. Tahun depan saya ingin pergi lagi.',
        soal: [
          { id: 'L5-15-1', tanya: 'お弁当{べんとう}はだれが作{つく}りましたか。', tanyaId: 'Siapa yang membuat bekalnya?', opsi: ['部長{ぶちょう}', '田中{たなか}さん', '「わたし」'], benar: 1, pembahasan: 'お弁当は田中さんが作りました = bekalnya dibuat oleh Tanaka.' },
          { id: 'L5-15-2', tanya: 'どうして朝{あさ}7時{じ}に公園{こうえん}へ行{い}きましたか。', tanyaId: 'Mengapa mereka pergi ke taman pukul 7 pagi?', opsi: ['部長{ぶちょう}が午後{ごご}いそがしかったからです', '11時{じ}から会社{かいしゃ}で仕事{しごと}があったからです', '朝{あさ}ごはんを公園{こうえん}で食{た}べたかったからです'], benar: 0, pembahasan: '部長は午後1時から用事がありました。ですから、わたしたちは朝7時に行って = kepala bagian ada urusan mulai pukul 1 siang; karena itu kami datang pukul 7 pagi (kepala bagian sibuk pada sore hari; pukul 11 mereka masih makan bekal di taman, bukan bekerja, dan bekal itu bukan sarapan).' },
        ],
      },
      {
        id: 'L5-16',
        judul: 'ユミさんへのメール',
        teks: 'これは、サリさんからユミさんにきたメールです。\nユミさん、こんにちは。今週{こんしゅう}の土曜日{どようび}、いっしょに買{か}い物{もの}に行{い}く約束{やくそく}をしましたね。でも、すみません。土曜日{どようび}は会社{かいしゃ}で仕事{しごと}をします。会社{かいしゃ}の人{ひと}が一人{ひとり}休{やす}みますから、わたしが働{はたら}かなければなりません。日曜日{にちようび}はどうですか。日曜日{にちようび}は一日{いちにち}ひまです。わたしは冬{ふゆ}のくつがほしいです。ユミさんはあたたかいセーターがほしいと言{い}いましたね。駅{えき}の前{まえ}のデパートで10時{じ}に会{あ}いませんか。メールを待{ま}っています。\nサリ',
        terjemahan: 'Ini email dari Sari kepada Yumi. Yumi, halo. Kita sudah berjanji pergi belanja bersama hari Sabtu minggu ini, ya. Tetapi maaf. Hari Sabtu saya bekerja di kantor. Ada satu orang kantor yang libur, jadi saya harus bekerja. Bagaimana kalau hari Minggu? Hari Minggu saya bebas seharian. Saya ingin sepatu musim dingin. Yumi bilang ingin sweter yang hangat, ya. Bagaimana kalau kita bertemu di department store depan stasiun pukul 10? Saya tunggu balasan emailnya. Sari',
        soal: [
          { id: 'L5-16-1', tanya: 'サリさんは何{なに}がほしいですか。', tanyaId: 'Apa yang diinginkan Sari?', opsi: ['あたたかいセーター', '冬{ふゆ}のくつ', '冬{ふゆ}のコート'], benar: 1, pembahasan: 'わたしは冬のくつがほしいです = saya ingin sepatu musim dingin (sweter hangat adalah keinginan Yumi).' },
          { id: 'L5-16-2', tanya: '「日曜日{にちようび}はどうですか」とありますが、サリさんは何{なに}をしたいですか。', tanyaId: 'Tertulis "bagaimana kalau hari Minggu?"; apa yang ingin dilakukan Sari?', opsi: ['日曜日{にちようび}に一人{ひとり}でデパートへ行{い}きたいです', '日曜日{にちようび}にユミさんにセーターをあげたいです', '日曜日{にちようび}にユミさんと買{か}い物{もの}に行{い}きたいです'], benar: 2, pembahasan: 'でも、すみません。土曜日は会社で仕事をします…日曜日はどうですか…駅の前のデパートで10時に会いませんか = tetapi maaf, hari Sabtu saya bekerja di kantor … bagaimana kalau hari Minggu? … bagaimana kalau bertemu di department store depan stasiun pukul 10? (Sari ingin memindahkan acara belanja bersama Yumi ke hari Minggu; ia tidak pergi sendirian, dan sweter adalah barang yang ingin dibeli Yumi sendiri).' },
        ],
      },
      {
        id: 'L5-17',
        judul: 'コンビニのアルバイト',
        teks: 'リンさんは大学{だいがく}で英語{えいご}を勉強{べんきょう}しています。そして、大学{だいがく}の近{ちか}くのコンビニでアルバイトをしています。毎週{まいしゅう}火曜日{かようび}と木曜日{もくようび}の夜{よる}、6時{じ}から10時{じ}まで働{はたら}きます。はじめは日本語{にほんご}がよくわかりませんでしたから、大変{たいへん}でした。店{みせ}に来{く}る人{ひと}はみんな速{はや}く話{はな}しました。でも、店{みせ}の人{ひと}たちがゆっくり話{はな}してくれましたから、今{いま}は大丈夫{だいじょうぶ}です。今{いま}は店{みせ}に来{く}る人{ひと}ともよく話{はな}します。とても楽{たの}しいです。日本語{にほんご}も前{まえ}より上手{じょうず}になりました。',
        terjemahan: 'Lin belajar bahasa Inggris di universitas. Selain itu, ia bekerja paruh waktu di minimarket dekat kampus. Setiap Selasa dan Kamis malam ia bekerja dari pukul 6 sampai pukul 10. Awalnya ia kurang mengerti bahasa Jepang, jadi terasa berat. Orang-orang yang datang ke toko semuanya berbicara cepat. Tetapi orang-orang toko berbicara pelan-pelan untuknya, jadi sekarang ia tidak apa-apa. Sekarang ia juga sering mengobrol dengan orang yang datang ke toko. Sangat menyenangkan. Bahasa Jepangnya juga lebih lancar daripada dulu.',
        soal: [
          { id: 'L5-17-1', tanya: 'リンさんは1週間{しゅうかん}に何日{なんにち}働{はたら}きますか。', tanyaId: 'Lin bekerja berapa hari seminggu?', opsi: ['4日{よっか}', '2日{ふつか}', '一日{いちにち}'], benar: 1, pembahasan: '毎週火曜日と木曜日の夜、6時から10時まで働きます = setiap Selasa dan Kamis malam bekerja dari pukul 6 sampai pukul 10 (dua hari seminggu; 4 adalah jumlah jamnya).' },
          { id: 'L5-17-2', tanya: '「今{いま}は大丈夫{だいじょうぶ}です」とありますが、どうしてですか。', tanyaId: 'Tertulis "sekarang tidak apa-apa"; mengapa demikian?', opsi: ['いっしょに働{はたら}く人{ひと}たちがゆっくり話{はな}してくれたからです', '店{みせ}に来{く}る人{ひと}がみんなゆっくり話{はな}したからです', '大学{だいがく}で日本語{にほんご}を勉強{べんきょう}しているからです'], benar: 0, pembahasan: 'でも、店の人たちがゆっくり話してくれましたから、今は大丈夫です = tetapi orang-orang toko berbicara pelan-pelan untuknya, jadi sekarang tidak apa-apa (yang berbicara pelan adalah rekan kerjanya di toko; orang yang datang ke toko justru berbicara cepat, dan di universitas Lin belajar bahasa Inggris).' },
        ],
      },
      {
        id: 'L5-18',
        judul: 'わたしのおじいさん',
        teks: 'わたしのおじいさんは75歳{さい}です。でも、とても元気{げんき}です。毎朝{まいあさ}5時{じ}に起{お}きて、犬{いぬ}と1時間{じかん}ぐらい散歩{さんぽ}します。昼{ひる}はうちの庭{にわ}で野菜{やさい}を作{つく}ります。作{つく}った野菜{やさい}は、近{ちか}くの人{ひと}にもあげます。午後{ごご}は図書館{としょかん}へ歩{ある}いて行{い}って、新聞{しんぶん}を読{よ}みます。夜{よる}は9時{じ}に寝{ね}ます。先月{せんげつ}、おじいさんは病院{びょういん}で体{からだ}を見{み}てもらいました。お医者{いしゃ}さんは「おじいさんは若{わか}い人{ひと}より元気{げんき}ですね」と言{い}いました。おじいさんは「毎日{まいにち}よく歩{ある}きますから」と言{い}いました。',
        terjemahan: 'Kakek saya berumur 75 tahun. Tetapi ia sangat sehat. Setiap pagi ia bangun pukul 5 dan berjalan-jalan dengan anjing sekitar satu jam. Siang hari ia menanam sayuran di halaman rumah. Sayuran yang ditanamnya juga ia berikan kepada orang-orang di sekitar. Sore hari ia berjalan kaki ke perpustakaan dan membaca koran. Malam hari ia tidur pukul 9. Bulan lalu kakek memeriksakan badannya di rumah sakit. Dokter berkata, "Kakek lebih sehat daripada orang muda, ya." Kakek menjawab, "Karena setiap hari saya banyak berjalan."',
        soal: [
          { id: 'L5-18-1', tanya: 'おじいさんは毎朝{まいあさ}何時{なんじ}に起{お}きますか。', tanyaId: 'Setiap pagi kakek bangun pukul berapa?', opsi: ['6時{じ}', '5時{じ}', '9時{じ}'], benar: 1, pembahasan: '毎朝5時に起きて = setiap pagi bangun pukul 5 (pukul 9 adalah jam tidurnya).' },
          { id: 'L5-18-2', tanya: 'おじいさんはどうして元気{げんき}ですか。', tanyaId: 'Mengapa kakek sehat?', opsi: ['毎日{まいにち}たくさん歩{ある}くからです', '毎晩{まいばん}9時間{じかん}寝{ね}るからです', '毎日{まいにち}図書館{としょかん}で新聞{しんぶん}を読{よ}むからです'], benar: 0, pembahasan: 'おじいさんは「毎日よく歩きますから」と言いました = kakek berkata, "Karena setiap hari saya banyak berjalan" (ia berjalan-jalan dengan anjing dan berjalan kaki ke perpustakaan; ia tidur pukul 9 dan bangun pukul 5, jadi tidurnya 8 jam, bukan 9 jam; membaca koran bukan alasan yang ia sebut).' },
        ],
      },
      {
        id: 'L5-19',
        judul: '寮{りょう}のお知{し}らせ',
        teks: '寮{りょう}の食堂{しょくどう}に、このお知{し}らせがあります。\n寮{りょう}のみなさんへ。\nあしたの朝{あさ}は雪{ゆき}がたくさん降{ふ}ります。道{みち}があぶないですから、自転車{じてんしゃ}に乗{の}らないでください。会社{かいしゃ}のバスは、いつもより30分{ぷん}早{はや}く、朝{あさ}7時{じ}に寮{りょう}の前{まえ}から出{で}ます。バスに乗{の}る人{ひと}は、6時{じ}50分{ぷん}に寮{りょう}の前{まえ}に来{き}てください。食堂{しょくどう}の朝{あさ}ごはんも、いつもより30分{ぷん}早{はや}く、6時{じ}から食{た}べることができます。外{そと}はとても寒{さむ}いですから、あたたかい服{ふく}を着{き}てください。わからない時{とき}は、山田{やまだ}に電話{でんわ}してください。\n寮{りょう}の山田{やまだ}',
        terjemahan: 'Di kantin asrama ada pengumuman ini. Kepada seluruh penghuni asrama. Besok pagi salju akan turun banyak. Jalan berbahaya, jadi jangan naik sepeda. Bus perusahaan berangkat 30 menit lebih awal dari biasanya, pukul 7 pagi dari depan asrama. Yang naik bus, datanglah ke depan asrama pukul 6.50. Sarapan di kantin juga 30 menit lebih awal dari biasanya, bisa mulai pukul 6. Di luar sangat dingin, jadi pakailah baju hangat. Kalau ada yang tidak jelas, teleponlah Yamada. Yamada, pengurus asrama',
        soal: [
          { id: 'L5-19-1', tanya: 'あした、バスに乗{の}る人{ひと}は何時{なんじ}に寮{りょう}の前{まえ}に来{き}なければなりませんか。', tanyaId: 'Besok, orang yang naik bus harus datang ke depan asrama pukul berapa?', opsi: ['6時{じ}50分{ぷん}', '7時{じ}', '6時{じ}'], benar: 0, pembahasan: 'バスに乗る人は、6時50分に寮の前に来てください = yang naik bus, datanglah ke depan asrama pukul 6.50 (pukul 7 adalah jam bus berangkat, pukul 6 jam mulai sarapan).' },
          { id: 'L5-19-2', tanya: '食堂{しょくどう}の朝{あさ}ごはんは、いつもは何時{なんじ}からですか。', tanyaId: 'Biasanya sarapan di kantin mulai pukul berapa?', opsi: ['6時{じ}', '6時{じ}半{はん}', '7時{じ}半{はん}'], benar: 1, pembahasan: '食堂の朝ごはんも、いつもより30分早く、6時から食べることができます = sarapan di kantin juga 30 menit lebih awal dari biasanya, bisa mulai pukul 6 (jadi biasanya pukul 6.30; pukul 7.30 adalah jam bus yang biasa).' },
        ],
      },
      {
        id: 'L5-20',
        judul: 'わたしのゆめ',
        teks: 'わたしは今{いま}、インドネシアで日本語{にほんご}を勉強{べんきょう}しています。来年{らいねん}から日本{にほん}の会社{かいしゃ}で3年{ねん}働{はたら}きます。日本{にほん}で働{はたら}いて、国{くに}の家族{かぞく}にお金{かね}を送{おく}りたいです。そのあとで、国{くに}へ帰{かえ}って、小{ちい}さいレストランを始{はじ}めたいです。インドネシアの料理{りょうり}と日本{にほん}の料理{りょうり}を作{つく}る店{みせ}です。インドネシアの料理{りょうり}は母{はは}がとても上手{じょうず}ですから、母{はは}に作{つく}ってもらいます。でも、わたしの町{まち}には日本{にほん}の料理{りょうり}の店{みせ}がありません。ですから、日本{にほん}にいる時{とき}、日本{にほん}の料理{りょうり}もたくさん習{なら}いたいです。',
        terjemahan: 'Sekarang saya belajar bahasa Jepang di Indonesia. Mulai tahun depan saya akan bekerja tiga tahun di sebuah perusahaan di Jepang. Saya ingin bekerja di Jepang dan mengirim uang kepada keluarga di negara asal. Setelah itu saya ingin pulang dan membuka restoran kecil. Restoran yang membuat masakan Indonesia dan masakan Jepang. Ibu saya sangat pandai memasak masakan Indonesia, jadi masakan Indonesia akan dibuatkan oleh ibu. Tetapi di kota saya tidak ada restoran masakan Jepang. Karena itu, selama di Jepang saya juga ingin banyak belajar masakan Jepang.',
        soal: [
          { id: 'L5-20-1', tanya: 'この人{ひと}はいつから日本{にほん}の会社{かいしゃ}で働{はたら}きますか。', tanyaId: 'Mulai kapan orang ini akan bekerja di perusahaan Jepang?', opsi: ['今月{こんげつ}から', '来月{らいげつ}から', '来年{らいねん}から'], benar: 2, pembahasan: '来年から日本の会社で3年働きます = mulai tahun depan ia akan bekerja tiga tahun di perusahaan di Jepang (sekarang ia masih belajar bahasa Jepang di Indonesia).' },
          { id: 'L5-20-2', tanya: 'どうして日本{にほん}の料理{りょうり}を習{なら}いたいですか。', tanyaId: 'Mengapa ia ingin belajar masakan Jepang?', opsi: ['町{まち}の日本{にほん}の料理{りょうり}の店{みせ}で働{はたら}きたいからです', '国{くに}で日本{にほん}の料理{りょうり}も作{つく}る店{みせ}を始{はじ}めたいからです', '母{はは}に日本{にほん}の料理{りょうり}を作{つく}ってあげたいからです'], benar: 1, pembahasan: 'インドネシアの料理と日本の料理を作る店です…ですから、日本にいる時、日本の料理もたくさん習いたいです = restorannya akan membuat masakan Indonesia dan masakan Jepang … karena itu selama di Jepang ia ingin banyak belajar masakan Jepang (di kotanya tidak ada restoran Jepang, dan di Jepang ia bekerja di perusahaan, bukan di restoran).' },
        ],
      },
      {
        id: 'L5-21',
        judul: '同{おな}じ部屋{へや}のアグスさん',
        teks: 'わたしは会社{かいしゃ}の寮{りょう}に住{す}んでいます。部屋{へや}はアグスさんと二人{ふたり}で使{つか}っています。アグスさんは料理{りょうり}が上手{じょうず}ですから、晩{ばん}ごはんはいつもアグスさんが作{つく}ります。わたしは料理{りょうり}が下手{へた}ですから、毎日{まいにち}スーパーへ買{か}い物{もの}に行{い}きます。部屋{へや}のそうじは土曜日{どようび}に二人{ふたり}でします。来月{らいげつ}、アグスさんは仕事{しごと}で2週間{しゅうかん}大阪{おおさか}へ行{い}きます。その時{とき}、わたしは一人{ひとり}で晩{ばん}ごはんを作{つく}らなければなりません。ですから、今週{こんしゅう}、アグスさんにカレーの作{つく}り方{かた}を習{なら}います。',
        terjemahan: 'Saya tinggal di asrama perusahaan. Kamar saya pakai berdua dengan Agus. Agus pandai memasak, jadi makan malam selalu dibuat oleh Agus. Saya tidak pandai memasak, jadi setiap hari saya pergi berbelanja ke supermarket. Kamar kami bersihkan berdua pada hari Sabtu. Bulan depan Agus pergi ke Osaka selama dua minggu karena pekerjaan. Saat itu saya harus memasak makan malam sendiri. Karena itu, minggu ini saya belajar cara membuat kari dari Agus.',
        soal: [
          { id: 'L5-21-1', tanya: '「わたし」は毎日{まいにち}何{なに}をしますか。', tanyaId: 'Apa yang dilakukan "saya" setiap hari?', opsi: ['晩{ばん}ごはんを作{つく}ります', 'スーパーへ買{か}い物{もの}に行{い}きます', '部屋{へや}のそうじをします'], benar: 1, pembahasan: 'わたしは料理が下手ですから、毎日スーパーへ買い物に行きます = saya tidak pandai memasak, jadi setiap hari saya pergi berbelanja ke supermarket (makan malam dibuat Agus, kamar dibersihkan hari Sabtu).' },
          { id: 'L5-21-2', tanya: 'どうして「わたし」は今週{こんしゅう}、アグスさんにカレーの作{つく}り方{かた}を習{なら}いますか。', tanyaId: 'Mengapa minggu ini "saya" belajar cara membuat kari dari Agus?', opsi: ['アグスさんが来月{らいげつ}、国{くに}へ帰{かえ}るからです', '来月{らいげつ}、アグスさんと大阪{おおさか}へ行{い}くからです', '来月{らいげつ}、晩{ばん}ごはんを一人{ひとり}で作{つく}るからです'], benar: 2, pembahasan: 'その時、わたしは一人で晩ごはんを作らなければなりません。ですから、今週、アグスさんにカレーの作り方を習います = saat itu (bulan depan) saya harus memasak makan malam sendiri; karena itu minggu ini saya belajar cara membuat kari dari Agus (Agus pergi sendiri ke Osaka karena pekerjaan, bukan pulang ke negaranya).' },
        ],
      },
      {
        id: 'L5-22',
        judul: '朝{あさ}の会議{かいぎ}',
        teks: 'わたしの会社{かいしゃ}では、毎週{まいしゅう}月曜日{げつようび}の朝{あさ}9時{じ}から会議{かいぎ}があります。会議{かいぎ}は30分{ぷん}ぐらいです。部長{ぶちょう}が今週{こんしゅう}の仕事{しごと}の話{はなし}をします。今週{こんしゅう}は月曜日{げつようび}が休{やす}みでした。ですから、会議{かいぎ}は次{つぎ}の日{ひ}の朝{あさ}にありました。会議{かいぎ}の前{まえ}に、わたしは会議室{かいぎしつ}のそうじをしました。会議{かいぎ}で部長{ぶちょう}は「来月{らいげつ}、インドネシアから新{あたら}しい人{ひと}が二人{ふたり}来{き}ます」と言{い}いました。わたしもインドネシア人{じん}ですから、二人{ふたり}に会社{かいしゃ}を案内{あんない}します。',
        terjemahan: 'Di perusahaan saya, setiap hari Senin ada rapat mulai pukul 9 pagi. Rapatnya sekitar 30 menit. Kepala bagian berbicara tentang pekerjaan minggu itu. Minggu ini hari Senin libur. Karena itu, rapat diadakan pagi hari berikutnya. Sebelum rapat, saya membersihkan ruang rapat. Dalam rapat, kepala bagian berkata, "Bulan depan akan datang dua orang baru dari Indonesia." Saya juga orang Indonesia, jadi saya yang akan mengantar mereka berdua berkeliling perusahaan.',
        soal: [
          { id: 'L5-22-1', tanya: '今週{こんしゅう}の会議{かいぎ}は何曜日{なんようび}にありましたか。', tanyaId: 'Rapat minggu ini diadakan pada hari apa?', opsi: ['月曜日{げつようび}', '水曜日{すいようび}', '火曜日{かようび}'], benar: 2, pembahasan: '今週は月曜日が休みでした。ですから、会議は次の日の朝にありました = minggu ini hari Senin libur; karena itu rapat diadakan pagi hari berikutnya (hari setelah Senin, yaitu Selasa).' },
          { id: 'L5-22-2', tanya: 'どうして「わたし」が新{あたら}しい二人{ふたり}に会社{かいしゃ}を案内{あんない}しますか。', tanyaId: 'Mengapa "saya" yang akan mengantar dua orang baru itu berkeliling perusahaan?', opsi: ['新{あたら}しい二人{ふたり}は「わたし」の国{くに}の人{ひと}だからです', '部長{ぶちょう}が来月{らいげつ}、会社{かいしゃ}を休{やす}むからです', '部長{ぶちょう}が「わたし」に「案内{あんない}してください」と言{い}ったからです'], benar: 0, pembahasan: '「来月、インドネシアから新しい人が二人来ます」と言いました。わたしもインドネシア人ですから、二人に会社を案内します = "bulan depan akan datang dua orang baru dari Indonesia" … saya juga orang Indonesia, jadi saya yang mengantar mereka berkeliling perusahaan (mereka sebangsa dengan "saya").' },
        ],
      },
      {
        id: 'L5-23',
        judul: '映画{えいが}を見{み}た次{つぎ}の朝{あさ}',
        teks: '今朝{けさ}、リオさんは7時{じ}半{はん}に起{お}きました。いつもは6時{じ}半{はん}に起{お}きて、寮{りょう}の食堂{しょくどう}で朝{あさ}ごはんを食{た}べます。でも、きのうの夜{よる}は、おそくまで部屋{へや}で映画{えいが}を見{み}ていました。会社{かいしゃ}のバスは7時{じ}40分{ぷん}に寮{りょう}の前{まえ}から出{で}ます。リオさんは朝{あさ}ごはんを食{た}べませんでした。急{いそ}いで寮{りょう}の前{まえ}まで走{はし}りましたが、バスはもう出{で}ていました。ですから、自転車{じてんしゃ}で会社{かいしゃ}へ行{い}きました。会社{かいしゃ}に着{つ}いた時{とき}、もう8時{じ}半{はん}でした。仕事{しごと}は8時{じ}からです。リオさんは部長{ぶちょう}に「すみません。あしたから早{はや}く寝{ね}ます」と言{い}いました。',
        terjemahan: 'Tadi pagi Rio bangun pukul 7.30. Biasanya ia bangun pukul 6.30 dan sarapan di ruang makan asrama. Tetapi tadi malam ia menonton film di kamar sampai larut. Bus perusahaan berangkat pukul 7.40 dari depan asrama. Rio tidak sarapan. Ia bergegas berlari sampai depan asrama, tetapi bus sudah berangkat. Karena itu ia pergi ke perusahaan naik sepeda. Saat tiba di perusahaan, sudah pukul 8.30. Pekerjaan mulai pukul 8. Rio berkata kepada kepala bagian, "Maaf. Mulai besok saya akan tidur lebih awal."',
        soal: [
          { id: 'L5-23-1', tanya: 'リオさんは今朝{けさ}、何{なん}で会社{かいしゃ}へ行{い}きましたか。', tanyaId: 'Tadi pagi Rio pergi ke perusahaan naik apa?', opsi: ['会社{かいしゃ}のバス', '電車{でんしゃ}', '自転車{じてんしゃ}'], benar: 2, pembahasan: 'バスはもう出ていました。ですから、自転車で会社へ行きました = bus sudah berangkat, karena itu ia pergi ke perusahaan naik sepeda.' },
          { id: 'L5-23-2', tanya: 'リオさんは今朝{けさ}、仕事{しごと}が始{はじ}まってから何分{なんぷん}あとで会社{かいしゃ}に着{つ}きましたか。', tanyaId: 'Tadi pagi Rio tiba di kantor berapa menit setelah pekerjaan dimulai?', opsi: ['10分{ぷん}', '30分{ぷん}', '50分{ぷん}'], benar: 1, pembahasan: '会社に着いた時、もう8時半でした。仕事は8時からです = saat tiba di perusahaan sudah pukul 8.30; pekerjaan mulai pukul 8 (jadi terlambat 30 menit).' },
        ],
      },
      {
        id: 'L5-24',
        judul: '町{まち}の夏{なつ}まつり',
        teks: '町{まち}の駅{えき}の前{まえ}に、このお知{し}らせがあります。\n町{まち}のみなさんへ\n8月{がつ}10日{とおか}に、町{まち}の公園{こうえん}で夏{なつ}まつりがあります。時間{じかん}は午後{ごご}5時{じ}から9時{じ}までです。食{た}べ物{もの}や飲{の}み物{もの}の店{みせ}がたくさん出{で}ます。7時{じ}からは子{こ}どもたちのダンスがあって、8時{じ}からはコンサートがあります。公園{こうえん}には車{くるま}を置{お}くところがありませんから、バスか自転車{じてんしゃ}で来{き}てください。バスは駅{えき}の前{まえ}から15分{ふん}に1回{かい}出{で}ます。10日{とおか}が雨{あめ}の時{とき}は、次{つぎ}の日{ひ}にあります。次{つぎ}の日{ひ}も雨{あめ}の時{とき}は、まつりはありません。',
        terjemahan: 'Pengumuman ini ada di depan stasiun kota. Kepada warga kota. Pada tanggal 10 Agustus ada festival musim panas di taman kota. Waktunya dari pukul 5 sore sampai pukul 9 malam. Akan ada banyak kedai makanan dan minuman. Mulai pukul 7 ada tarian anak-anak, dan mulai pukul 8 ada konser. Di taman tidak ada tempat untuk menaruh mobil, jadi datanglah naik bus atau sepeda. Bus berangkat dari depan stasiun 15 menit sekali. Kalau tanggal 10 hujan, festival diadakan pada hari berikutnya. Kalau hari berikutnya juga hujan, festival tidak diadakan.',
        soal: [
          { id: 'L5-24-1', tanya: 'コンサートは何時{なんじ}からですか。', tanyaId: 'Konser mulai pukul berapa?', opsi: ['7時{じ}', '8時{じ}', '9時{じ}'], benar: 1, pembahasan: '8時からはコンサートがあります = mulai pukul 8 ada konser.' },
          { id: 'L5-24-2', tanya: '10日{とおか}が雨{あめ}の時{とき}、夏{なつ}まつりはいつありますか。', tanyaId: 'Kalau tanggal 10 hujan, festival musim panas diadakan kapan?', opsi: ['8月{がつ}11日{にち}', '8月{がつ}17日{にち}', '8月{がつ}12日{にち}'], benar: 0, pembahasan: '10日が雨の時は、次の日にあります = kalau tanggal 10 hujan, festival diadakan pada hari berikutnya (sehari setelah 10 Agustus, yaitu 11 Agustus).' },
        ],
      },
      {
        id: 'L5-25',
        judul: 'かぜの薬{くすり}',
        teks: 'きのうの夜{よる}から熱{ねつ}がありましたから、今朝{けさ}、会社{かいしゃ}を休{やす}んで病院{びょういん}へ行{い}きました。病院{びょういん}には人{ひと}がたくさんいましたから、1時間{じかん}待{ま}ちました。お医者{いしゃ}さんは「かぜですね。薬{くすり}を出{だ}します」と言{い}いました。白{しろ}い薬{くすり}は一日{いちにち}3回{かい}、ごはんのあとで飲{の}みます。赤{あか}い薬{くすり}は夜{よる}寝{ね}る前{まえ}に1回{かい}だけ飲{の}みます。お医者{いしゃ}さんは「熱{ねつ}がある時{とき}は、おふろに入{はい}らないでください」と言{い}いました。うちへ帰{かえ}って、部長{ぶちょう}に電話{でんわ}をかけました。部長{ぶちょう}は「あしたも休{やす}んでもいいですよ」と言{い}いました。ですから、あしたも会社{かいしゃ}を休{やす}んで、うちで寝{ね}ます。',
        terjemahan: 'Sejak tadi malam saya demam, jadi tadi pagi saya tidak masuk kerja dan pergi ke rumah sakit. Di rumah sakit ada banyak orang, jadi saya menunggu satu jam. Dokter berkata, "Ini masuk angin, ya. Saya beri obat." Obat putih diminum tiga kali sehari, setelah makan. Obat merah diminum satu kali saja, malam sebelum tidur. Dokter berkata, "Selama masih demam, jangan mandi berendam." Setelah pulang, saya menelepon kepala bagian. Kepala bagian berkata, "Besok juga boleh libur." Karena itu besok saya juga tidak masuk kerja dan tidur di rumah.',
        soal: [
          { id: 'L5-25-1', tanya: '赤{あか}い薬{くすり}はいつ飲{の}みますか。', tanyaId: 'Obat merah diminum kapan?', opsi: ['ごはんのあと', '朝{あさ}起{お}きた時{とき}', '夜{よる}寝{ね}る前{まえ}'], benar: 2, pembahasan: '赤い薬は夜寝る前に1回だけ飲みます = obat merah diminum satu kali saja, malam sebelum tidur.' },
          { id: 'L5-25-2', tanya: 'どうして、あしたも会社{かいしゃ}を休{やす}みますか。', tanyaId: 'Mengapa besok saya juga tidak masuk kerja?', opsi: ['お医者{いしゃ}さんが休{やす}んでくださいと言{い}ったからです', '部長{ぶちょう}が休{やす}んでもいいと言{い}ったからです', 'あしたも病院{びょういん}へ行{い}くからです'], benar: 1, pembahasan: '部長は「あしたも休んでもいいですよ」と言いました。ですから、あしたも会社を休んで = kepala bagian berkata "Besok juga boleh libur", karena itu besok juga tidak masuk kerja (yang mengizinkan libur adalah kepala bagian; dokter hanya melarang mandi berendam).' },
        ],
      },
      {
        id: 'L5-26',
        judul: 'となりの鈴木{すずき}さん',
        teks: 'わたしのアパートのとなりの部屋{へや}に、鈴木{すずき}さんが住{す}んでいます。鈴木{すずき}さんは駅{えき}の前{まえ}の本屋{ほんや}で働{はたら}いています。仕事{しごと}は月曜日{げつようび}から金曜日{きんようび}までです。きのうの夜{よる}、会社{かいしゃ}から帰{かえ}る時{とき}、雨{あめ}が降{ふ}りました。わたしはかさを持{も}っていませんでしたが、本屋{ほんや}の前{まえ}で鈴木{すずき}さんがかさを貸{か}してくれました。今日{きょう}は金曜日{きんようび}です。かさを返{かえ}しに鈴木{すずき}さんの部屋{へや}へ行{い}きましたが、鈴木{すずき}さんはいませんでした。あした、もう一度{いちど}行{い}きます。',
        terjemahan: 'Di kamar sebelah apartemen saya tinggal Suzuki. Suzuki bekerja di toko buku di depan stasiun. Ia bekerja dari hari Senin sampai Jumat. Kemarin malam, saat saya pulang dari kantor, hujan turun. Saya tidak membawa payung, tetapi di depan toko buku Suzuki meminjamkan payungnya kepada saya. Hari ini hari Jumat. Saya pergi ke kamar Suzuki untuk mengembalikan payung itu, tetapi Suzuki tidak ada. Besok saya akan pergi sekali lagi.',
        soal: [
          { id: 'L5-26-1', tanya: '鈴木{すずき}さんはどこで働{はたら}いていますか。', tanyaId: 'Suzuki bekerja di mana?', opsi: ['会社{かいしゃ}の前{まえ}の本屋{ほんや}', '駅{えき}の前{まえ}の本屋{ほんや}', '駅{えき}の前{まえ}のパン屋{や}'], benar: 1, pembahasan: '鈴木さんは駅の前の本屋で働いています = Suzuki bekerja di toko buku di depan stasiun.' },
          { id: 'L5-26-2', tanya: 'どうして「わたし」はあした、もう一度{いちど}鈴木{すずき}さんの部屋{へや}へ行{い}きますか。', tanyaId: 'Mengapa besok "saya" pergi lagi ke kamar Suzuki?', opsi: ['鈴木{すずき}さんが「あした来{き}てください」と言{い}ったからです', '鈴木{すずき}さんは土曜日{どようび}も本屋{ほんや}で働{はたら}くからです', 'あしたは鈴木{すずき}さんの仕事{しごと}が休{やす}みだからです'], benar: 2, pembahasan: '仕事は月曜日から金曜日までです…今日は金曜日です = ia bekerja dari hari Senin sampai Jumat … hari ini hari Jumat (besok hari Sabtu, jadi pekerjaan Suzuki libur).' },
        ],
      },
      {
        id: 'L5-27',
        judul: '弟{おとうと}へ送{おく}る荷物{にもつ}',
        teks: '来月{らいげつ}はデウィさんの弟{おとうと}の誕生日{たんじょうび}です。弟{おとうと}は電話{でんわ}で「新{あたら}しい時計{とけい}が欲{ほ}しいです」と言{い}いました。デウィさんは日本{にほん}のおかしと時計{とけい}を買{か}って、箱{はこ}に入{い}れました。きのう、その箱{はこ}を郵便局{ゆうびんきょく}へ持{も}っていきました。飛行機{ひこうき}の荷物{にもつ}は1週間{しゅうかん}ぐらいで着{つ}きますが、4000円{えん}です。船{ふね}の荷物{にもつ}は2か月{げつ}ぐらいかかりますが、1800円{えん}です。郵便局{ゆうびんきょく}の人{ひと}は「船{ふね}のほうが安{やす}いですよ」と言{い}いました。でも、デウィさんは高{たか}いほうで送{おく}りました。荷物{にもつ}が着{つ}いたら、弟{おとうと}に電話{でんわ}をかけます。',
        terjemahan: 'Bulan depan adalah ulang tahun adik laki-laki Dewi. Adiknya berkata lewat telepon, "Saya ingin jam yang baru." Dewi membeli kue Jepang dan jam, lalu memasukkannya ke dalam kotak. Kemarin ia membawa kotak itu ke kantor pos. Paket lewat pesawat tiba dalam waktu sekitar satu minggu, tetapi biayanya 4.000 yen. Paket lewat kapal memakan waktu sekitar dua bulan, tetapi biayanya 1.800 yen. Petugas kantor pos berkata, "Lewat kapal lebih murah, lho." Tetapi Dewi mengirim dengan cara yang lebih mahal. Setelah paketnya tiba, ia akan menelepon adiknya.',
        soal: [
          { id: 'L5-27-1', tanya: 'デウィさんは箱{はこ}に何{なに}を入{い}れましたか。', tanyaId: 'Apa yang dimasukkan Dewi ke dalam kotak?', opsi: ['服{ふく}と時計{とけい}', 'おかしと時計{とけい}', 'おかしと手紙{てがみ}'], benar: 1, pembahasan: '日本のおかしと時計を買って、箱に入れました = membeli kue Jepang dan jam, lalu memasukkannya ke dalam kotak.' },
          { id: 'L5-27-2', tanya: 'どうしてデウィさんは高{たか}いほうで送{おく}りましたか。', tanyaId: 'Mengapa Dewi mengirim dengan cara yang lebih mahal?', opsi: ['弟{おとうと}が飛行機{ひこうき}で送{おく}ってくださいと言{い}ったからです', '郵便局{ゆうびんきょく}の人{ひと}が飛行機{ひこうき}がいいと言{い}ったからです', '船{ふね}の荷物{にもつ}は誕生日{たんじょうび}までに着{つ}かないからです'], benar: 2, pembahasan: '来月はデウィさんの弟の誕生日です…船の荷物は2か月ぐらいかかりますが、1800円です = bulan depan ulang tahun adik Dewi … paket lewat kapal memakan waktu sekitar dua bulan, tetapi biayanya 1.800 yen (lewat kapal paket baru tiba setelah ulang tahun; adiknya hanya meminta jam, dan petugas pos justru menyarankan kapal).' },
        ],
      },
      {
        id: 'L5-28',
        judul: '寮{りょう}のナシゴレンパーティー',
        teks: '先週{せんしゅう}の日曜日{にちようび}、寮{りょう}でパーティーをしました。わたしたちインドネシア人{じん}3人{にん}がナシゴレンを作{つく}って、会社{かいしゃ}の日本人{にほんじん}を4人{にん}呼{よ}びました。朝{あさ}、3人{にん}でスーパーへ行{い}って、卵{たまご}や肉{にく}や野菜{やさい}を買{か}いました。ナシゴレンは少{すこ}し辛{から}かったですが、4人{にん}は「おいしいです」と言{い}って、全部{ぜんぶ}食{た}べました。山田{やまだ}さんは辛{から}い料理{りょうり}があまり好{す}きではありません。でも、「これはおいしいですね」と言{い}って、作{つく}り方{かた}を聞{き}きました。そして、「来週{らいしゅう}、うちで奥{おく}さんと子{こ}どもに作{つく}ってあげます」と言{い}いました。次{つぎ}のパーティーでは、会社{かいしゃ}の人{ひと}たちが日本{にほん}の料理{りょうり}を作{つく}ります。',
        terjemahan: 'Hari Minggu lalu kami mengadakan pesta di asrama. Kami, tiga orang Indonesia, membuat nasi goreng dan mengundang empat orang Jepang dari kantor. Pagi harinya kami bertiga pergi ke supermarket dan membeli telur, daging, sayur, dan lain-lain. Nasi gorengnya agak pedas, tetapi keempat orang itu berkata "Enak" dan menghabiskan semuanya. Yamada kurang suka masakan pedas. Tetapi ia berkata "Yang ini enak, ya" lalu menanyakan cara membuatnya. Lalu ia berkata, "Minggu depan saya akan membuatkannya untuk istri dan anak saya di rumah." Di pesta berikutnya, orang-orang kantor itu yang akan membuat masakan Jepang.',
        soal: [
          { id: 'L5-28-1', tanya: 'パーティーには全部{ぜんぶ}で何人{なんにん}いましたか。', tanyaId: 'Seluruhnya ada berapa orang di pesta itu?', opsi: ['3人{にん}', '4人{にん}', '7人{にん}'], benar: 2, pembahasan: 'わたしたちインドネシア人3人が…会社の日本人を4人呼びました = kami tiga orang Indonesia … mengundang empat orang Jepang dari kantor (3 + 4 = 7 orang).' },
          { id: 'L5-28-2', tanya: 'どうして山田{やまだ}さんはナシゴレンの作{つく}り方{かた}を聞{き}きましたか。', tanyaId: 'Mengapa Yamada menanyakan cara membuat nasi goreng?', opsi: ['うちで家族{かぞく}に作{つく}りたいからです', '辛{から}い料理{りょうり}がとても好{す}きだからです', '次{つぎ}のパーティーで作{つく}りたいからです'], benar: 0, pembahasan: '「来週、うちで奥さんと子どもに作ってあげます」と言いました = ia berkata "Minggu depan saya akan membuatkannya untuk istri dan anak saya di rumah" (istri dan anak = keluarganya; ia kurang suka masakan pedas, dan di pesta berikutnya yang dibuat adalah masakan Jepang).' },
        ],
      },
      {
        id: 'L5-29',
        judul: 'マヤさんへの手紙{てがみ}',
        teks: 'これは、リナさんが友{とも}だちのマヤさんに書{か}いた手紙{てがみ}です。\nマヤさん、お元気{げんき}ですか。わたしは先月{せんげつ}から、海{うみ}の近{ちか}くの小{ちい}さい町{まち}に住{す}んでいます。魚{さかな}の会社{かいしゃ}で働{はたら}いています。仕事{しごと}は朝{あさ}5時{じ}からですから、毎朝{まいあさ}4時{じ}に起{お}きて、毎晩{まいばん}9時{じ}に寝{ね}ます。はじめは、朝{あさ}4時{じ}に起{お}きることがとても大変{たいへん}でした。でも、今{いま}は大丈夫{だいじょうぶ}です。町{まち}には喫茶店{きっさてん}もデパートもありませんが、魚{さかな}がおいしくて、人{ひと}もやさしいです。休{やす}みの日{ひ}は、会社{かいしゃ}の人{ひと}と海{うみ}の近{ちか}くを散歩{さんぽ}します。マヤさんも一度{いちど}遊{あそ}びに来{き}てください。\nリナ',
        terjemahan: 'Ini adalah surat yang ditulis Rina untuk temannya, Maya. Maya, apa kabar? Sejak bulan lalu saya tinggal di sebuah kota kecil di dekat laut. Saya bekerja di perusahaan ikan. Pekerjaan mulai pukul 5 pagi, jadi setiap pagi saya bangun pukul 4 dan setiap malam tidur pukul 9. Awalnya bangun pukul 4 pagi terasa sangat berat. Tetapi sekarang sudah tidak apa-apa. Di kota ini tidak ada kafe maupun toserba, tetapi ikannya enak dan orang-orangnya juga baik hati. Pada hari libur saya berjalan-jalan di dekat laut bersama orang-orang perusahaan. Maya juga datanglah bermain sekali waktu. Rina',
        soal: [
          { id: 'L5-29-1', tanya: 'リナさんはどこで働{はたら}いていますか。', tanyaId: 'Rina bekerja di mana?', opsi: ['魚{さかな}の会社{かいしゃ}', '喫茶店{きっさてん}', 'デパート'], benar: 0, pembahasan: '魚の会社で働いています = bekerja di perusahaan ikan.' },
          { id: 'L5-29-2', tanya: '「今{いま}は大丈夫{だいじょうぶ}です」とありますが、何{なに}が大丈夫{だいじょうぶ}ですか。', tanyaId: 'Tertulis "sekarang sudah tidak apa-apa"; apa yang sudah tidak apa-apa?', opsi: ['夜{よる}9時{じ}に寝{ね}ること', '町{まち}の人{ひと}と話{はな}すこと', '朝{あさ}早{はや}く起{お}きること'], benar: 2, pembahasan: 'はじめは、朝4時に起きることがとても大変でした。でも、今は大丈夫です = awalnya bangun pukul 4 pagi sangat berat, tetapi sekarang sudah tidak apa-apa (yang dulu berat dan sekarang tidak apa-apa adalah bangun pagi-pagi sekali).' },
        ],
      },
      {
        id: 'L5-30',
        judul: 'ハディさんの自転車{じてんしゃ}',
        teks: '寮{りょう}から会社{かいしゃ}まで歩{ある}いて30分{ぷん}かかります。ですから、ハディさんは先週{せんしゅう}、自転車{じてんしゃ}を買{か}いに行{い}きました。新{あたら}しい自転車{じてんしゃ}は20000円{えん}でしたが、古{ふる}い自転車{じてんしゃ}は6000円{えん}でした。ハディさんは古{ふる}いのを買{か}いました。色{いろ}は青{あお}で、少{すこ}し重{おも}いですが、よく走{はし}ります。今{いま}は自転車{じてんしゃ}で会社{かいしゃ}まで10分{ぷん}です。ハディさんは前{まえ}も今{いま}も、毎朝{まいあさ}6時{じ}半{はん}に起{お}きます。仕事{しごと}も前{まえ}と同{おな}じで、8時{じ}からです。でも、今{いま}は前{まえ}よりゆっくり朝{あさ}ごはんを食{た}べることができます。',
        terjemahan: 'Dari asrama ke kantor perlu 30 menit berjalan kaki. Karena itu minggu lalu Hadi pergi membeli sepeda. Sepeda baru harganya 20.000 yen, sedangkan sepeda bekas 6.000 yen. Hadi membeli yang bekas. Warnanya biru dan agak berat, tetapi jalannya lancar. Sekarang dengan sepeda ke kantor hanya 10 menit. Dulu maupun sekarang, Hadi bangun pukul 6.30 setiap pagi. Pekerjaannya juga sama seperti dulu, mulai pukul 8. Tetapi sekarang ia bisa sarapan lebih santai daripada dulu.',
        soal: [
          { id: 'L5-30-1', tanya: 'ハディさんが買{か}った自転車{じてんしゃ}はいくらでしたか。', tanyaId: 'Berapa harga sepeda yang dibeli Hadi?', opsi: ['20000円{えん}', '6000円{えん}', '14000円{えん}'], benar: 1, pembahasan: '古い自転車は6000円でした。ハディさんは古いのを買いました = sepeda bekas 6.000 yen. Hadi membeli yang bekas.' },
          { id: 'L5-30-2', tanya: '「前{まえ}よりゆっくり朝{あさ}ごはんを食{た}べることができます」とありますが、どうしてですか。', tanyaId: 'Tertulis "bisa sarapan lebih santai daripada dulu"; mengapa demikian?', opsi: ['前{まえ}より早{はや}く起{お}きるからです', '仕事{しごと}が前{まえ}よりおそく始{はじ}まるからです', '会社{かいしゃ}まで行{い}く時間{じかん}が短{みじか}くなったからです'], benar: 2, pembahasan: '寮から会社まで歩いて30分かかります…今は自転車で会社まで10分です = dari asrama ke kantor 30 menit berjalan kaki … sekarang dengan sepeda hanya 10 menit (waktu perjalanan menjadi lebih singkat; jam bangun 6.30 dan jam mulai kerja pukul 8 tetap sama seperti dulu).' },
        ],
      },
      {
        id: 'L5-31',
        judul: '公園{こうえん}で会{あ}うおばあさん',
        teks: 'わたしは毎朝{まいあさ}、仕事{しごと}の前{まえ}に公園{こうえん}を走{はし}ります。公園{こうえん}でいつも同{おな}じおばあさんに会{あ}います。おばあさんは小{ちい}さい白{しろ}い犬{いぬ}と散歩{さんぽ}しています。はじめはあいさつだけでしたが、今{いま}は天気{てんき}や国{くに}の話{はなし}をします。おばあさんはゆっくり話{はな}しますから、よくわかります。先週{せんしゅう}は毎日{まいにち}いい天気{てんき}でしたが、おばあさんは一度{いちど}も来{き}ませんでした。わたしはとても心配{しんぱい}しました。今週{こんしゅう}の月曜日{げつようび}、おばあさんはまた公園{こうえん}に来{き}ました。そして、「先週{せんしゅう}は東京{とうきょう}の子{こ}どものうちにいました」と言{い}いました。犬{いぬ}もいっしょで、元気{げんき}でした。',
        terjemahan: 'Setiap pagi sebelum bekerja saya berlari di taman. Di taman saya selalu bertemu dengan nenek yang sama. Nenek itu berjalan-jalan dengan anjing putih kecil. Awalnya kami hanya saling menyapa, tetapi sekarang kami mengobrol tentang cuaca dan negara saya. Nenek itu berbicara pelan-pelan, jadi saya mengerti dengan baik. Minggu lalu cuaca cerah setiap hari, tetapi nenek itu tidak datang sekali pun. Saya sangat khawatir. Hari Senin minggu ini nenek itu datang lagi ke taman. Lalu ia berkata, "Minggu lalu saya berada di rumah anak saya di Tokyo." Anjingnya juga ikut dan sehat.',
        soal: [
          { id: 'L5-31-1', tanya: 'おばあさんはどんな犬{いぬ}と散歩{さんぽ}していますか。', tanyaId: 'Nenek itu berjalan-jalan dengan anjing seperti apa?', opsi: ['小{ちい}さい白{しろ}い犬{いぬ}', '大{おお}きい白{しろ}い犬{いぬ}', '小{ちい}さい黒{くろ}い犬{いぬ}'], benar: 0, pembahasan: 'おばあさんは小さい白い犬と散歩しています = nenek itu berjalan-jalan dengan anjing putih kecil.' },
          { id: 'L5-31-2', tanya: 'どうしておばあさんは先週{せんしゅう}、公園{こうえん}に来{き}ませんでしたか。', tanyaId: 'Mengapa minggu lalu nenek itu tidak datang ke taman?', opsi: ['犬{いぬ}が病気{びょうき}だったからです', '東京{とうきょう}の家族{かぞく}のうちにいたからです', '毎日{まいにち}雨{あめ}が降{ふ}ったからです'], benar: 1, pembahasan: '「先週は東京の子どものうちにいました」と言いました = ia berkata "Minggu lalu saya berada di rumah anak saya di Tokyo" (rumah anaknya = rumah keluarganya; cuacanya cerah setiap hari dan anjingnya ikut serta dalam keadaan sehat).' },
        ],
      },
      {
        id: 'L5-32',
        judul: '6月{がつ}の雨{あめ}',
        teks: '日本{にほん}では6月{がつ}に雨{あめ}がたくさん降{ふ}ります。今週{こんしゅう}は月曜日{げつようび}から金曜日{きんようび}まで仕事{しごと}でしたが、毎日{まいにち}雨{あめ}でした。わたしはいつも自転車{じてんしゃ}で会社{かいしゃ}へ行{い}きますが、雨{あめ}の日{ひ}はバスに乗{の}ります。自転車{じてんしゃ}は15分{ふん}ですが、バスは30分{ぷん}ぐらいかかります。朝{あさ}のバスはいつも人{ひと}が多{おお}いですから、大変{たいへん}でした。土曜日{どようび}の朝{あさ}は晴{は}れました。わたしは服{ふく}をたくさん洗{あら}って、外{そと}に出{だ}しました。午後{ごご}は自転車{じてんしゃ}でスーパーへ行{い}きました。日曜日{にちようび}はまた雨{あめ}でした。',
        terjemahan: 'Di Jepang pada bulan Juni hujan turun banyak. Minggu ini saya bekerja dari Senin sampai Jumat, tetapi setiap hari hujan. Saya biasanya pergi ke perusahaan naik sepeda, tetapi pada hari hujan saya naik bus. Dengan sepeda perlu 15 menit, tetapi bus memakan waktu sekitar 30 menit. Bus pagi selalu penuh orang, jadi melelahkan. Sabtu pagi cuaca cerah. Saya mencuci banyak pakaian dan menjemurnya di luar. Siang harinya saya pergi ke supermarket naik sepeda. Hari Minggu hujan lagi.',
        soal: [
          { id: 'L5-32-1', tanya: '雨{あめ}の日{ひ}、「わたし」は何{なん}で会社{かいしゃ}へ行{い}きますか。', tanyaId: 'Pada hari hujan, "saya" pergi ke perusahaan naik apa?', opsi: ['バス', '自転車{じてんしゃ}', '電車{でんしゃ}'], benar: 0, pembahasan: '雨の日はバスに乗ります = pada hari hujan naik bus.' },
          { id: 'L5-32-2', tanya: '今週{こんしゅう}、「わたし」は何日{なんにち}バスに乗{の}って会社{かいしゃ}へ行{い}きましたか。', tanyaId: 'Minggu ini "saya" pergi ke perusahaan naik bus berapa hari?', opsi: ['2日{ふつか}', '5日{いつか}', '6日{むいか}'], benar: 1, pembahasan: '今週は月曜日から金曜日まで仕事でしたが、毎日雨でした…雨の日はバスに乗ります = minggu ini bekerja dari Senin sampai Jumat dan setiap hari hujan … pada hari hujan naik bus (Senin sampai Jumat = 5 hari; hari Minggu juga hujan, tetapi tidak bekerja, dan hari Sabtu cerah).' },
        ],
      },
      {
        id: 'L5-33',
        judul: '日本語{にほんご}教室{きょうしつ}のフォンさん',
        teks: 'わたしは毎週{まいしゅう}日曜日{にちようび}、市{し}の日本語{にほんご}教室{きょうしつ}へ行{い}きます。教室{きょうしつ}は午前{ごぜん}10時{じ}から12時{じ}までです。先月{せんげつ}、教室{きょうしつ}でベトナム人{じん}のフォンさんと友{とも}だちになりました。フォンさんはインドネシア語{ご}がわかりません。わたしもベトナム語{ご}がわかりません。二人{ふたり}は英語{えいご}もあまり上手{じょうず}ではありません。ですから、二人{ふたり}はいつも日本語{にほんご}で話{はな}します。わからない時{とき}は、いっしょに辞書{じしょ}を見{み}ます。きのうは電話{でんわ}で1時間{じかん}も話{はな}しました。今{いま}、日本語{にほんご}の勉強{べんきょう}は前{まえ}より楽{たの}しいです。',
        terjemahan: 'Setiap hari Minggu saya pergi ke kelas bahasa Jepang milik kota. Kelasnya dari pukul 10 pagi sampai pukul 12. Bulan lalu di kelas saya berteman dengan Phuong, orang Vietnam. Phuong tidak mengerti bahasa Indonesia. Saya juga tidak mengerti bahasa Vietnam. Bahasa Inggris kami berdua juga kurang lancar. Karena itu kami berdua selalu berbicara dalam bahasa Jepang. Kalau ada yang tidak dimengerti, kami melihat kamus bersama. Kemarin kami mengobrol lewat telepon sampai satu jam. Sekarang belajar bahasa Jepang lebih menyenangkan daripada dulu.',
        soal: [
          { id: 'L5-33-1', tanya: '「わたし」は何曜日{なんようび}に日本語{にほんご}教室{きょうしつ}へ行{い}きますか。', tanyaId: '"Saya" pergi ke kelas bahasa Jepang pada hari apa?', opsi: ['土曜日{どようび}', '日曜日{にちようび}', '月曜日{げつようび}'], benar: 1, pembahasan: 'わたしは毎週日曜日、市の日本語教室へ行きます = setiap hari Minggu saya pergi ke kelas bahasa Jepang milik kota.' },
          { id: 'L5-33-2', tanya: 'どうして二人{ふたり}は日本語{にほんご}で話{はな}しますか。', tanyaId: 'Mengapa mereka berdua berbicara dalam bahasa Jepang?', opsi: ['日本語{にほんご}のテストがあるからです', 'フォンさんが日本語{にほんご}の先生{せんせい}だからです', 'フォンさんはインドネシア語{ご}がわからないからです'], benar: 2, pembahasan: 'フォンさんはインドネシア語がわかりません。わたしもベトナム語がわかりません…ですから、二人はいつも日本語で話します = Phuong tidak mengerti bahasa Indonesia, saya juga tidak mengerti bahasa Vietnam … karena itu kami selalu berbicara dalam bahasa Jepang (bahasa Inggris pun keduanya kurang lancar, jadi bahasa yang dimengerti keduanya adalah bahasa Jepang; Phuong teman sekelas, bukan guru).' },
        ],
      },
      {
        id: 'L5-34',
        judul: 'イマムさんの昼{ひる}ごはん',
        teks: '会社{かいしゃ}の食堂{しょくどう}の昼{ひる}ごはんは、月曜日{げつようび}から木曜日{もくようび}まで二{ふた}つあります。肉{にく}の料理{りょうり}と魚{さかな}の料理{りょうり}で、どちらも400円{えん}です。イマムさんは毎日{まいにち}ここで食{た}べますが、豚肉{ぶたにく}は食{た}べません。ですから、いつも食堂{しょくどう}の人{ひと}に「今日{きょう}の肉{にく}は何{なん}ですか」と聞{き}きます。食堂{しょくどう}の人{ひと}はいつも親切{しんせつ}に教{おし}えてくれます。今日{きょう}は水曜日{すいようび}で、肉{にく}は豚肉{ぶたにく}でした。金曜日{きんようび}はみんなカレーを食{た}べます。カレーは300円{えん}で、とり肉{にく}です。イマムさんは金曜日{きんようび}のカレーが一番{いちばん}好{す}きです。',
        terjemahan: 'Makan siang di kantin perusahaan ada dua macam dari Senin sampai Kamis. Masakan daging dan masakan ikan, keduanya 400 yen. Imam makan di sini setiap hari, tetapi ia tidak makan daging babi. Karena itu ia selalu bertanya kepada petugas kantin, "Daging hari ini daging apa?" Petugas kantin selalu memberi tahu dengan ramah. Hari ini hari Rabu, dan dagingnya daging babi. Hari Jumat semua orang makan kari. Karinya 300 yen dan memakai daging ayam. Imam paling suka kari hari Jumat.',
        soal: [
          { id: 'L5-34-1', tanya: '食堂{しょくどう}のカレーは、肉{にく}の料理{りょうり}よりいくら安{やす}いですか。', tanyaId: 'Kari di kantin lebih murah berapa yen daripada masakan daging?', opsi: ['100円{えん}', '300円{えん}', '700円{えん}'], benar: 0, pembahasan: '肉の料理と魚の料理で、どちらも400円です…カレーは300円で = masakan daging dan masakan ikan keduanya 400 yen … kari 300 yen (400 − 300 = 100 yen lebih murah).' },
          { id: 'L5-34-2', tanya: '今日{きょう}、イマムさんは食堂{しょくどう}でどれを食{た}べましたか。', tanyaId: 'Hari ini Imam makan yang mana di kantin?', opsi: ['肉{にく}の料理{りょうり}', '魚{さかな}の料理{りょうり}', 'カレー'], benar: 1, pembahasan: 'イマムさんは毎日ここで食べますが、豚肉は食べません…今日は水曜日で、肉は豚肉でした = Imam makan di sini setiap hari, tetapi tidak makan daging babi … hari ini Rabu dan dagingnya daging babi (jadi ia memilih masakan ikan; kari hanya hari Jumat).' },
        ],
      },
      {
        id: 'L5-35',
        judul: '銀行{ぎんこう}のカード',
        teks: '先週{せんしゅう}、会社{かいしゃ}の田中{たなか}さんと駅{えき}の前{まえ}の銀行{ぎんこう}へ行{い}って、カードを作{つく}りました。紙{かみ}に名前{なまえ}や住所{じゅうしょ}や電話番号{でんわばんごう}を書{か}きました。漢字{かんじ}がむずかしかったですから、田中{たなか}さんに聞{き}きました。銀行{ぎんこう}の人{ひと}は「カードは来週{らいしゅう}、寮{りょう}に送{おく}ります」と言{い}いました。今日{きょう}、そのカードが来{き}ました。来週{らいしゅう}の日曜日{にちようび}は国{くに}の母{はは}の誕生日{たんじょうび}です。ですから、あした、このカードではじめてお金{かね}を出{だ}して、母{はは}に送{おく}ります。寮{りょう}のお金{かね}は、毎月{まいつき}会社{かいしゃ}で払{はら}います。新{あたら}しい自転車{じてんしゃ}は来月{らいげつ}買{か}いたいです。',
        terjemahan: 'Minggu lalu saya pergi ke bank di depan stasiun bersama Tanaka dari perusahaan dan membuat kartu. Saya menulis nama, alamat, nomor telepon, dan lain-lain di kertas. Kanjinya sulit, jadi saya bertanya kepada Tanaka. Petugas bank berkata, "Kartunya kami kirim ke asrama minggu depan." Hari ini kartu itu datang. Hari Minggu depan adalah ulang tahun ibu saya di negara asal. Karena itu besok untuk pertama kalinya saya akan mengambil uang dengan kartu ini dan mengirimkannya kepada ibu. Uang asrama saya bayar setiap bulan di perusahaan. Sepeda baru ingin saya beli bulan depan.',
        soal: [
          { id: 'L5-35-1', tanya: '紙{かみ}に書{か}く時{とき}、「わたし」はだれに聞{き}きましたか。', tanyaId: 'Saat menulis di kertas, "saya" bertanya kepada siapa?', opsi: ['田中{たなか}さん', '銀行{ぎんこう}の人{ひと}', '寮{りょう}の人{ひと}'], benar: 0, pembahasan: '漢字がむずかしかったですから、田中さんに聞きました = kanjinya sulit, jadi bertanya kepada Tanaka.' },
          { id: 'L5-35-2', tanya: 'どうして「わたし」はあした、お金{かね}を出{だ}しますか。', tanyaId: 'Mengapa besok "saya" mengambil uang?', opsi: ['寮{りょう}のお金{かね}を払{はら}うからです', '新{あたら}しい自転車{じてんしゃ}を買{か}うからです', '母{はは}の誕生日{たんじょうび}にお金{かね}を送{おく}るからです'], benar: 2, pembahasan: '来週の日曜日は国の母の誕生日です。ですから、あした、このカードではじめてお金を出して、母に送ります = hari Minggu depan ulang tahun ibu di negara asal, karena itu besok untuk pertama kalinya saya mengambil uang dengan kartu ini dan mengirimkannya kepada ibu (uang asrama dibayar di perusahaan, sepeda baru baru akan dibeli bulan depan).' },
        ],
      },
      {
        id: 'L5-36',
        judul: '夏{なつ}の海{うみ}',
        teks: '8月{がつ}の休{やす}みに、友{とも}だち3人{にん}と電車{でんしゃ}で海{うみ}へ行{い}きました。朝{あさ}6時{じ}に寮{りょう}を出{で}て、9時{じ}に海{うみ}に着{つ}きました。海{うみ}はとても青{あお}くて、きれいでした。午前中{ごぜんちゅう}は泳{およ}いで、昼{ひる}は海{うみ}の近{ちか}くの店{みせ}に入{はい}りました。わたしは肉{にく}が食{た}べたかったですが、その店{みせ}は魚{さかな}の料理{りょうり}だけでした。ですから、みんなで魚{さかな}を食{た}べました。魚{さかな}はとてもおいしかったです。午後{ごご}は疲{つか}れましたから、木{き}の下{した}で寝{ね}ました。帰{かえ}りの電車{でんしゃ}でもみんな寝{ね}ていました。',
        terjemahan: 'Pada libur bulan Agustus saya pergi ke laut naik kereta bersama tiga orang teman. Kami berangkat dari asrama pukul 6 pagi dan tiba di laut pukul 9. Lautnya sangat biru dan indah. Sebelum tengah hari kami berenang, lalu siang hari masuk ke sebuah kedai dekat laut. Saya ingin makan daging, tetapi kedai itu hanya punya masakan ikan. Karena itu kami semua makan ikan. Ikannya sangat enak. Sore hari kami lelah, jadi tidur di bawah pohon. Di kereta pulang pun semuanya tidur.',
        soal: [
          { id: 'L5-36-1', tanya: '午後{ごご}は何{なに}をしましたか。', tanyaId: 'Apa yang dilakukan pada sore hari?', opsi: ['海{うみ}で泳{およ}ぎました', '木{き}の下{した}で寝{ね}ました', '店{みせ}で魚{さかな}を食{た}べました'], benar: 1, pembahasan: '午後は疲れましたから、木の下で寝ました = sore hari lelah, jadi tidur di bawah pohon.' },
          { id: 'L5-36-2', tanya: 'どうして昼{ひる}に魚{さかな}を食{た}べましたか。', tanyaId: 'Mengapa siang itu kami makan ikan?', opsi: ['その店{みせ}には肉{にく}の料理{りょうり}がなかったからです', '「わたし」は魚{さかな}が一番{いちばん}好{す}きだからです', '友{とも}だちが魚{さかな}を食{た}べたいと言{い}ったからです'], benar: 0, pembahasan: 'わたしは肉が食べたかったですが、その店は魚の料理だけでした。ですから、みんなで魚を食べました = saya ingin makan daging, tetapi kedai itu hanya punya masakan ikan, karena itu kami semua makan ikan (hanya ada ikan = tidak ada masakan daging).' },
        ],
      },
      {
        id: 'L5-37',
        judul: '森{もり}さんへのプレゼント',
        teks: '森{もり}さんは来月{らいげつ}、会社{かいしゃ}をやめて、北海道{ほっかいどう}へ帰{かえ}ります。森{もり}さんは3年{ねん}間{かん}、わたしたちに仕事{しごと}を教{おし}えました。ですから、わたしたち5人{にん}でプレゼントをあげます。きのう、みんなでデパートへ行{い}きました。はじめはセーターを見{み}ましたが、とても高{たか}かったです。それから、一人{ひとり}1000円{えん}出{だ}して、あたたかい手{て}ぶくろを買{か}いました。北海道{ほっかいどう}の冬{ふゆ}はとても寒{さむ}いからです。金曜日{きんようび}の昼休{ひるやす}みに、森{もり}さんにあげます。森{もり}さんの誕生日{たんじょうび}は来月{らいげつ}の10日{とおか}ですが、その日{ひ}はもう会社{かいしゃ}にいません。',
        terjemahan: 'Bulan depan Mori berhenti dari perusahaan dan pulang ke Hokkaido. Selama tiga tahun Mori mengajari kami pekerjaan. Karena itu kami berlima akan memberinya hadiah. Kemarin kami semua pergi ke toserba. Awalnya kami melihat sweter, tetapi harganya sangat mahal. Lalu masing-masing mengeluarkan 1.000 yen, dan kami membeli sarung tangan yang hangat. Itu karena musim dingin di Hokkaido sangat dingin. Kami akan memberikannya kepada Mori pada istirahat siang hari Jumat. Ulang tahun Mori tanggal 10 bulan depan, tetapi pada hari itu ia sudah tidak ada di perusahaan.',
        soal: [
          { id: 'L5-37-1', tanya: '森{もり}さんへのプレゼントは何{なん}ですか。', tanyaId: 'Apa hadiah untuk Mori?', opsi: ['セーター', 'ぼうし', '手{て}ぶくろ'], benar: 2, pembahasan: 'あたたかい手ぶくろを買いました = membeli sarung tangan yang hangat.' },
          { id: 'L5-37-2', tanya: 'どうして5人{にん}は森{もり}さんにプレゼントをあげますか。', tanyaId: 'Mengapa kelima orang itu memberi Mori hadiah?', opsi: ['森{もり}さんが仕事{しごと}を教{おし}えてくれたからです', '森{もり}さんの誕生日{たんじょうび}が金曜日{きんようび}だからです', '森{もり}さんが北海道{ほっかいどう}で結婚{けっこん}するからです'], benar: 0, pembahasan: '森さんは3年間、わたしたちに仕事を教えました。ですから、わたしたち5人でプレゼントをあげます = selama tiga tahun Mori mengajari kami pekerjaan, karena itu kami berlima memberinya hadiah (ulang tahunnya tanggal 10 bulan depan, bukan hari Jumat ini).' },
        ],
      },
      {
        id: 'L5-38',
        judul: '夜{よる}8時{じ}のスーパー',
        teks: '寮{りょう}の近{ちか}くのスーパーは、夜{よる}9時{じ}までです。お弁当{べんとう}はいつも500円{えん}ですが、夜{よる}8時{じ}から300円{えん}になります。ユダさんは仕事{しごと}が7時{じ}に終{お}わりますが、すぐスーパーへは行{い}きません。寮{りょう}に帰{かえ}って、シャワーをあびます。それから、8時{じ}にスーパーへ行{い}きます。8時{じ}半{はん}ごろには、お弁当{べんとう}はもうあまりありません。きのうも8時{じ}に行{い}って、お弁当{べんとう}を二{ふた}つ買{か}いました。一{ひと}つは晩{ばん}ごはんに、もう一{ひと}つは次{つぎ}の日{ひ}の朝{あさ}に食{た}べます。スーパーの人{ひと}は、ユダさんの顔{かお}をよく知{し}っています。',
        terjemahan: 'Supermarket di dekat asrama buka sampai pukul 9 malam. Bekal makanan biasanya 500 yen, tetapi mulai pukul 8 malam menjadi 300 yen. Pekerjaan Yuda selesai pukul 7, tetapi ia tidak langsung pergi ke supermarket. Ia pulang ke asrama dan mandi. Setelah itu, pukul 8 ia pergi ke supermarket. Sekitar pukul 8.30, bekal sudah tinggal sedikit. Kemarin pun ia pergi pukul 8 dan membeli dua bekal. Satu ia makan untuk makan malam, satu lagi pada pagi keesokan harinya. Petugas supermarket sudah kenal betul wajah Yuda.',
        soal: [
          { id: 'L5-38-1', tanya: 'スーパーは何時{なんじ}までですか。', tanyaId: 'Supermarket buka sampai pukul berapa?', opsi: ['9時{じ}', '8時{じ}', '7時{じ}'], benar: 0, pembahasan: 'スーパーは、夜9時までです = supermarket buka sampai pukul 9 malam.' },
          { id: 'L5-38-2', tanya: 'きのう、ユダさんはお弁当{べんとう}二{ふた}つでいくら払{はら}いましたか。', tanyaId: 'Kemarin Yuda membayar berapa untuk dua bekal?', opsi: ['800円{えん}', '1000円{えん}', '600円{えん}'], benar: 2, pembahasan: '夜8時から300円になります…きのうも8時に行って、お弁当を二つ買いました = mulai pukul 8 malam menjadi 300 yen … kemarin juga pergi pukul 8 dan membeli dua bekal (300 × 2 = 600 yen).' },
        ],
      },
      {
        id: 'L5-39',
        judul: '弟{おとうと}のギター',
        teks: '弟{おとうと}は高校生{こうこうせい}で、ギターがとても好{す}きです。学校{がっこう}がある日{ひ}は、学校{がっこう}から帰{かえ}って、2時間{じかん}ぐらい練習{れんしゅう}します。土曜日{どようび}と日曜日{にちようび}は4時間{じかん}ぐらい練習{れんしゅう}します。はじめは下手{へた}でしたから、家族{かぞく}はみんな「うるさいです」と言{い}いました。父{ちち}は「夜{よる}はひかないでください」と言{い}いました。でも、弟{おとうと}は毎日{まいにち}練習{れんしゅう}しましたから、今{いま}はとても上手{じょうず}です。先月{せんげつ}、学校{がっこう}のコンサートでひきました。母{はは}は一番{いちばん}前{まえ}で聞{き}きました。今{いま}、母{はは}は「毎日{まいにち}ひいてください」と言{い}います。',
        terjemahan: 'Adik laki-laki saya siswa SMA dan sangat menyukai gitar. Pada hari sekolah, sepulang sekolah ia berlatih sekitar dua jam. Hari Sabtu dan Minggu ia berlatih sekitar empat jam. Awalnya ia tidak pandai, jadi seluruh keluarga berkata "Berisik". Ayah berkata, "Jangan main pada malam hari." Tetapi adik berlatih setiap hari, jadi sekarang ia sangat pandai. Bulan lalu ia bermain di konser sekolah. Ibu mendengarkan di barisan paling depan. Sekarang ibu berkata, "Mainkanlah setiap hari."',
        soal: [
          { id: 'L5-39-1', tanya: '弟{おとうと}は土曜日{どようび}、どのぐらいギターを練習{れんしゅう}しますか。', tanyaId: 'Pada hari Sabtu adik berlatih gitar berapa lama?', opsi: ['2時間{じかん}ぐらい', '4時間{じかん}ぐらい', '6時間{じかん}ぐらい'], benar: 1, pembahasan: '土曜日と日曜日は4時間ぐらい練習します = hari Sabtu dan Minggu berlatih sekitar empat jam.' },
          { id: 'L5-39-2', tanya: '今{いま}、母{はは}は弟{おとうと}のギターをどう思{おも}っていますか。', tanyaId: 'Sekarang, bagaimana pendapat ibu tentang permainan gitar adik?', opsi: ['下手{へた}ですから、聞{き}きたくないです', '上手{じょうず}ですが、うるさいです', '上手{じょうず}ですから、もっと聞{き}きたいです'], benar: 2, pembahasan: '今はとても上手です…今、母は「毎日ひいてください」と言います = sekarang ia sangat pandai … sekarang ibu berkata "Mainkanlah setiap hari" (ibu menganggapnya pandai dan ingin lebih sering mendengarnya, tidak lagi menganggapnya berisik).' },
        ],
      },
      {
        id: 'L5-40',
        judul: '夏{なつ}の仕事{しごと}の時間{じかん}',
        teks: '会社{かいしゃ}の事務所{じむしょ}の前{まえ}に、このお知{し}らせがあります。\n会社{かいしゃ}のみなさんへ\n来月{らいげつ}から仕事{しごと}の時間{じかん}が早{はや}くなります。今{いま}は朝{あさ}8時{じ}から午後{ごご}5時{じ}までですが、来月{らいげつ}からは朝{あさ}7時{じ}から午後{ごご}4時{じ}までです。夏{なつ}は午後{ごご}とても暑{あつ}いからです。昼休{ひるやす}みは今{いま}と同{おな}じで、12時{じ}から1時間{じかん}です。今{いま}、会社{かいしゃ}のバスは7時{じ}20分{ぷん}に寮{りょう}の前{まえ}を出{で}ます。来月{らいげつ}からは、バスも1時間{じかん}早{はや}く出{で}ます。9月{がつ}からは、また今{いま}と同{おな}じ時間{じかん}になります。わからない人{ひと}は、事務所{じむしょ}に来{き}てください。\n事務所{じむしょ}の山田{やまだ}',
        terjemahan: 'Pengumuman ini ada di depan kantor perusahaan. Kepada seluruh karyawan perusahaan. Mulai bulan depan jam kerja menjadi lebih awal. Sekarang dari pukul 8 pagi sampai pukul 5 sore, tetapi mulai bulan depan dari pukul 7 pagi sampai pukul 4 sore. Itu karena pada musim panas siang hari sangat panas. Istirahat siang sama seperti sekarang, satu jam mulai pukul 12. Sekarang bus perusahaan berangkat dari depan asrama pukul 7.20. Mulai bulan depan bus juga berangkat satu jam lebih awal. Mulai bulan September jamnya kembali sama seperti sekarang. Yang kurang jelas, silakan datang ke kantor. Yamada, bagian kantor',
        soal: [
          { id: 'L5-40-1', tanya: '来月{らいげつ}から、仕事{しごと}は何時{なんじ}に終{お}わりますか。', tanyaId: 'Mulai bulan depan, pekerjaan selesai pukul berapa?', opsi: ['午後{ごご}5時{じ}', '午後{ごご}3時{じ}', '午後{ごご}4時{じ}'], benar: 2, pembahasan: '来月からは朝7時から午後4時までです = mulai bulan depan dari pukul 7 pagi sampai pukul 4 sore.' },
          { id: 'L5-40-2', tanya: '来月{らいげつ}から、会社{かいしゃ}のバスは何時{なんじ}に寮{りょう}の前{まえ}を出{で}ますか。', tanyaId: 'Mulai bulan depan, bus perusahaan berangkat dari depan asrama pukul berapa?', opsi: ['6時{じ}20分{ぷん}', '7時{じ}20分{ぷん}', '8時{じ}20分{ぷん}'], benar: 0, pembahasan: '今、会社のバスは7時20分に寮の前を出ます。来月からは、バスも1時間早く出ます = sekarang bus perusahaan berangkat dari depan asrama pukul 7.20; mulai bulan depan bus juga berangkat satu jam lebih awal (7.20 dikurangi satu jam = pukul 6.20).' },
        ],
      },
      {
        id: 'L5-41',
        judul: '京都{きょうと}の一日{いちにち}',
        teks: '先月{せんげつ}、友{とも}だちと二人{ふたり}で京都{きょうと}へ行{い}きました。朝{あさ}7時{じ}に新幹線{しんかんせん}に乗{の}って、2時間{じかん}で着{つ}きました。駅{えき}からバスで古{ふる}いお寺{てら}へ行{い}きました。お寺{てら}を三{みっ}つ見{み}て、昼{ひる}ごはんにうどんを食{た}べました。午後{ごご}は店{みせ}で母{はは}に赤{あか}いさいふを買{か}いました。友{とも}だちは日本{にほん}のお茶{ちゃ}を買{か}いました。帰{かえ}りは新幹線{しんかんせん}のきっぷが高{たか}かったですから、バスに乗{の}りました。バスは安{やす}いですが、5時間{じかん}かかりました。寮{りょう}に着{つ}いた時{とき}は、もう夜{よる}11時{じ}でした。',
        terjemahan: 'Bulan lalu saya pergi ke Kyoto berdua dengan teman. Pukul 7 pagi kami naik shinkansen dan tiba dalam dua jam. Dari stasiun kami naik bus ke kuil tua. Kami melihat tiga kuil, lalu makan udon untuk makan siang. Sore hari saya membeli dompet merah untuk ibu di toko. Teman saya membeli teh Jepang. Untuk pulang, tiket shinkansen mahal, jadi kami naik bus. Bus memang murah, tetapi memakan waktu lima jam. Saat tiba di asrama, sudah pukul 11 malam.',
        soal: [
          { id: 'L5-41-1', tanya: '京都{きょうと}でお寺{てら}をいくつ見{み}ましたか。', tanyaId: 'Di Kyoto melihat berapa kuil?', opsi: ['二{ふた}つ', '五{いつ}つ', '三{みっ}つ'], benar: 2, pembahasan: 'お寺を三つ見て = melihat tiga kuil.' },
          { id: 'L5-41-2', tanya: '帰{かえ}りのバスは、朝{あさ}の新幹線{しんかんせん}より何時間{なんじかん}長{なが}くかかりましたか。', tanyaId: 'Bus saat pulang memakan waktu berapa jam lebih lama daripada shinkansen pagi itu?', opsi: ['2時間{じかん}', '3時間{じかん}', '5時間{じかん}'], benar: 1, pembahasan: '朝7時に新幹線に乗って、2時間で着きました…バスは安いですが、5時間かかりました = pukul 7 pagi naik shinkansen dan tiba dalam dua jam … bus murah, tetapi memakan waktu lima jam (lima jam dikurangi dua jam = tiga jam lebih lama).' },
        ],
      },
      {
        id: 'L5-42',
        judul: '木村{きむら}さんのうちで',
        teks: '土曜日{どようび}の夜{よる}、会社{かいしゃ}の木村{きむら}さんのうちへ行{い}きました。奥{おく}さんのすきやきをみんなで食{た}べました。すきやきはとてもおいしかったです。木村{きむら}さんの子{こ}どもは二人{ふたり}で、7歳{さい}の男{おとこ}の子{こ}と4歳{さい}の女{おんな}の子{こ}です。男{おとこ}の子{こ}は「インドネシア語{ご}を教{おし}えてください」と言{い}いました。わたしは「ありがとう」の言{い}い方{かた}を教{おし}えました。「テリマカシ」です。帰{かえ}る時{とき}、二人{ふたり}は大{おお}きい声{こえ}で「テリマカシ」と言{い}いました。木村{きむら}さんは「また来{き}てください」と言{い}いました。',
        terjemahan: 'Sabtu malam saya pergi ke rumah Kimura, rekan di kantor saya. Kami semua makan sukiyaki buatan istrinya. Sukiyakinya sangat enak. Anak Kimura dua orang: anak laki-laki berumur 7 tahun dan anak perempuan berumur 4 tahun. Anak laki-laki itu berkata, "Tolong ajari saya bahasa Indonesia." Saya mengajarkan cara mengucapkan "arigatou". Yaitu "terima kasih". Saat saya pulang, keduanya berkata "terima kasih" dengan suara keras. Kimura berkata, "Datanglah lagi."',
        soal: [
          { id: 'L5-42-1', tanya: '木村{きむら}さんの女{おんな}の子{こ}は何歳{なんさい}ですか。', tanyaId: 'Anak perempuan Kimura berumur berapa tahun?', opsi: ['7歳{さい}', '4歳{さい}', '2歳{さい}'], benar: 1, pembahasan: '7歳の男の子と4歳の女の子です = anak laki-laki berumur 7 tahun dan anak perempuan berumur 4 tahun.' },
          { id: 'L5-42-2', tanya: '帰{かえ}る時{とき}、子{こ}どもたちは何{なん}と言{い}いましたか。', tanyaId: 'Saat "saya" pulang, anak-anak itu berkata apa?', opsi: ['日本語{にほんご}で「さようなら」と言{い}いました', 'インドネシア語{ご}で「さようなら」と言{い}いました', 'インドネシア語{ご}で「ありがとう」と言{い}いました'], benar: 2, pembahasan: 'わたしは「ありがとう」の言い方を教えました。「テリマカシ」です…二人は大きい声で「テリマカシ」と言いました = saya mengajarkan cara mengucapkan "arigatou", yaitu "terima kasih" … keduanya berkata "terima kasih" dengan suara keras (mereka mengucapkan "arigatou" dalam bahasa Indonesia).' },
        ],
      },
      {
        id: 'L5-43',
        judul: '駅{えき}の前{まえ}の花屋{はなや}',
        teks: '駅{えき}の前{まえ}に小{ちい}さい花屋{はなや}があります。店{みせ}の人{ひと}は70歳{さい}ぐらいのおじいさんです。わたしは毎週{まいしゅう}金曜日{きんようび}に、そこで部屋{へや}の花{はな}を買{か}います。おじいさんは花{はな}の名前{なまえ}をいろいろ教{おし}えてくれます。先週{せんしゅう}の金曜日{きんようび}は、赤{あか}い花{はな}を3本{ぼん}買{か}いました。花{はな}は1本{ぽん}200円{えん}です。お金{かね}を払{はら}った時{とき}、おじいさんは「いつもありがとうございます」と言{い}いました。それから、白{しろ}い花{はな}を1本{ぽん}くれました。白{しろ}い花{はな}は今{いま}、わたしの部屋{へや}の机{つくえ}の上{うえ}にあります。',
        terjemahan: 'Di depan stasiun ada toko bunga kecil. Penjualnya seorang kakek berumur sekitar 70 tahun. Setiap hari Jumat saya membeli bunga untuk kamar di sana. Kakek itu suka mengajari saya berbagai nama bunga. Jumat minggu lalu saya membeli tiga tangkai bunga merah. Harga bunga 200 yen setangkai. Saat saya membayar, kakek itu berkata, "Terima kasih selalu datang." Lalu ia memberi saya setangkai bunga putih. Bunga putih itu sekarang ada di atas meja di kamar saya.',
        soal: [
          { id: 'L5-43-1', tanya: '先週{せんしゅう}、「わたし」は花屋{はなや}でいくら払{はら}いましたか。', tanyaId: 'Minggu lalu "saya" membayar berapa di toko bunga?', opsi: ['600円{えん}', '800円{えん}', '200円{えん}'], benar: 0, pembahasan: '赤い花を3本買いました。花は1本200円です…白い花を1本くれました = membeli tiga tangkai bunga merah; bunga 200 yen setangkai … kakek itu memberi setangkai bunga putih (3 × 200 = 600 yen; bunga putih diberikan, tidak dibayar).' },
          { id: 'L5-43-2', tanya: 'どうしておじいさんは「わたし」に白{しろ}い花{はな}をくれましたか。', tanyaId: 'Mengapa kakek itu memberi "saya" bunga putih?', opsi: ['「わたし」の誕生日{たんじょうび}だったからです', '「わたし」がいつも花{はな}を買{か}いに来{く}るからです', '「わたし」が来{き}た時{とき}、赤{あか}い花{はな}がもうなかったからです'], benar: 1, pembahasan: 'おじいさんは「いつもありがとうございます」と言いました。それから、白い花を1本くれました = kakek itu berkata "Terima kasih selalu datang", lalu memberi setangkai bunga putih (bunga itu ucapan terima kasih karena "saya" membeli bunga di sana setiap minggu, bukan karena jumlah yang dibeli kali ini).' },
        ],
      },
      {
        id: 'L5-44',
        judul: '寮{りょう}のそうじの日{ひ}',
        teks: 'わたしの寮{りょう}では、月{つき}に1回{かい}、日曜日{にちようび}の朝{あさ}にみんなでそうじをします。9時{じ}に始{はじ}めて、11時{じ}に終{お}わります。今月{こんげつ}、わたしは食堂{しょくどう}をそうじしました。食堂{しょくどう}は広{ひろ}いですが、いつもは4人{にん}でしますから、あまり大変{たいへん}ではありません。でも、今月{こんげつ}は二人{ふたり}が国{くに}へ帰{かえ}っていましたから、アリさんとわたしの二人{ふたり}だけでしました。ですから、とても大変{たいへん}でした。来月{らいげつ}はトイレで、その次{つぎ}はげんかんです。そうじのあとで、寮{りょう}の小林{こばやし}さんがみんなにジュースを出{だ}します。今月{こんげつ}はアイスクリームもありました。',
        terjemahan: 'Di asrama saya, sebulan sekali pada Minggu pagi kami semua bersih-bersih bersama. Mulai pukul 9 dan selesai pukul 11. Bulan ini saya membersihkan ruang makan. Ruang makannya luas, tetapi biasanya dikerjakan empat orang, jadi tidak terlalu berat. Tetapi bulan ini dua orang sedang pulang ke negaranya, jadi hanya dikerjakan berdua oleh Ari dan saya. Karena itu sangat berat. Bulan depan giliran toilet, dan berikutnya pintu masuk. Setelah bersih-bersih, Kobayashi dari asrama menyuguhkan jus kepada semuanya. Bulan ini ada es krim juga.',
        soal: [
          { id: 'L5-44-1', tanya: '今月{こんげつ}、「わたし」はどこをそうじしましたか。', tanyaId: 'Bulan ini "saya" membersihkan bagian mana?', opsi: ['食堂{しょくどう}', 'トイレ', 'げんかん'], benar: 0, pembahasan: '今月、わたしは食堂をそうじしました = bulan ini saya membersihkan ruang makan.' },
          { id: 'L5-44-2', tanya: 'どうして今月{こんげつ}のそうじはとても大変{たいへん}でしたか。', tanyaId: 'Mengapa bersih-bersih bulan ini sangat berat?', opsi: ['いつもより人{ひと}が少{すく}なかったからです', 'そうじの時間{じかん}がいつもより短{みじか}かったからです', '二{ふた}つのところをそうじしたからです'], benar: 0, pembahasan: 'いつもは4人でしますから、あまり大変ではありません。でも、今月は二人が国へ帰っていましたから、アリさんとわたしの二人だけでしました。ですから、とても大変でした = biasanya dikerjakan empat orang, jadi tidak terlalu berat; tetapi bulan ini dua orang sedang pulang ke negaranya, jadi hanya dikerjakan berdua; karena itu sangat berat (orangnya lebih sedikit dari biasanya; waktunya tetap pukul 9 sampai 11 dan yang dibersihkan hanya ruang makan).' },
        ],
      },
      {
        id: 'L5-45',
        judul: '日本{にほん}に来{き}て1年{ねん}',
        teks: '去年{きょねん}の4月{がつ}に日本{にほん}へ来{き}ました。はじめは日本語{にほんご}がぜんぜんわかりませんでしたから、買{か}い物{もの}はいつも会社{かいしゃ}の人{ひと}といっしょでした。でも、毎晩{まいばん}1時間{じかん}勉強{べんきょう}しましたから、今{いま}は一人{ひとり}で買{か}い物{もの}にも病院{びょういん}にも行{い}きます。先月{せんげつ}は一人{ひとり}で電車{でんしゃ}に乗{の}って、東京{とうきょう}へ遊{あそ}びに行{い}きました。今年{ことし}の4月{がつ}に、新{あたら}しい人{ひと}が3人{にん}来{き}ました。3人{にん}はまだ日本語{にほんご}がよくわかりません。今{いま}は、わたしが3人{にん}を手伝{てつだ}います。あした、3人{にん}と買{か}い物{もの}に行{い}きます。日本{にほん}の生活{せいかつ}は、今{いま}はとても楽{たの}しいです。',
        terjemahan: 'Saya datang ke Jepang pada bulan April tahun lalu. Awalnya saya sama sekali tidak mengerti bahasa Jepang, jadi belanja selalu bersama orang kantor. Tetapi saya belajar satu jam setiap malam, jadi sekarang saya pergi belanja maupun ke rumah sakit sendirian. Bulan lalu saya naik kereta sendirian dan pergi bermain ke Tokyo. Pada bulan April tahun ini datang tiga orang baru. Ketiganya belum begitu mengerti bahasa Jepang. Sekarang sayalah yang membantu mereka bertiga. Besok saya pergi belanja bersama mereka bertiga. Kehidupan di Jepang sekarang sangat menyenangkan.',
        soal: [
          { id: 'L5-45-1', tanya: '「わたし」は毎晩{まいばん}どのぐらい勉強{べんきょう}しましたか。', tanyaId: 'Setiap malam "saya" belajar berapa lama?', opsi: ['30分{ぷん}', '1時間{じかん}', '3時間{じかん}'], benar: 1, pembahasan: '毎晩1時間勉強しましたから = karena belajar satu jam setiap malam.' },
          { id: 'L5-45-2', tanya: 'どうして「わたし」はあした、新{あたら}しい3人{にん}と買{か}い物{もの}に行{い}きますか。', tanyaId: 'Mengapa besok "saya" pergi belanja bersama tiga orang baru itu?', opsi: ['3人{にん}はまだ日本語{にほんご}が上手{じょうず}ではないからです', '「わたし」は一人{ひとり}で買{か}い物{もの}に行{い}かないからです', '3人{にん}が「わたし」を手伝{てつだ}うからです'], benar: 0, pembahasan: '3人はまだ日本語がよくわかりません。今は、わたしが3人を手伝います。あした、3人と買い物に行きます = ketiganya belum begitu mengerti bahasa Jepang; sekarang sayalah yang membantu mereka bertiga; besok pergi belanja bersama mereka (belum begitu mengerti bahasa Jepang = bahasa Jepangnya belum lancar; seperti dulu "saya" ditemani orang kantor; sekarang "saya" sudah bisa belanja sendiri, dan yang membantu adalah "saya", bukan ketiga orang itu).' },
        ],
      },
      {
        id: 'L5-46',
        judul: '空港{くうこう}までのバス',
        teks: '駅{えき}の前{まえ}に、このお知{し}らせがあります。\n空港{くうこう}へ行{い}くバスの時間{じかん}\n・8時{じ}45分{ふん}→空港{くうこう}10時{じ}15分{ふん}、1200円{えん}\n・9時{じ}15分{ふん}→空港{くうこう}10時{じ}30分{ぷん}、1800円{えん}\n・9時{じ}30分{ぷん}→空港{くうこう}10時{じ}50分{ぷん}、1300円{えん}\n・9時{じ}50分{ぷん}→空港{くうこう}11時{じ}20分{ぷん}、1200円{えん}\n・10時{じ}→空港{くうこう}11時{じ}10分{ぷん}、1800円{えん}\n※日曜日{にちようび}は、8時{じ}45分{ふん}のバスはありません。\n※きっぷはバスの中{なか}でも買{か}うことができますが、駅{えき}の店{みせ}で買{か}うと、1枚{まい}100円{えん}安{やす}いです。\nわからないことは、駅{えき}の店{みせ}の人{ひと}に聞{き}いてください。',
        terjemahan: 'Di depan stasiun ada pengumuman ini. Jadwal bus ke bandara: berangkat 8.45 → tiba di bandara 10.15, 1.200 yen; berangkat 9.15 → tiba 10.30, 1.800 yen; berangkat 9.30 → tiba 10.50, 1.300 yen; berangkat 9.50 → tiba 11.20, 1.200 yen; berangkat 10.00 → tiba 11.10, 1.800 yen. Catatan: pada hari Minggu tidak ada bus pukul 8.45. Tiket bisa dibeli juga di dalam bus, tetapi kalau dibeli di toko stasiun, 100 yen lebih murah per lembar. Hal yang tidak dimengerti, tanyakan kepada petugas toko stasiun.',
        soal: [
          { id: 'L5-46-1', tanya: 'ハディさんは9時{じ}に駅{えき}に着{つ}きます。空港{くうこう}に11時{じ}までに着{つ}きたいです。1500円{えん}より安{やす}いバスがいいです。どのバスに乗{の}りますか。', tanyaId: 'Hadi tiba di stasiun pukul 9. Ia ingin tiba di bandara paling lambat pukul 11. Ia ingin bus yang lebih murah dari 1.500 yen. Bus mana yang ia naiki?', opsi: ['9時{じ}15分{ふん}のバス', '9時{じ}50分{ぷん}のバス', '9時{じ}30分{ぷん}のバス'], benar: 2, pembahasan: '9時30分→空港10時50分、1300円 = bus pukul 9.30 tiba di bandara pukul 10.50, harganya 1.300 yen (berangkat sesudah pukul 9, tiba sebelum pukul 11, lebih murah dari 1.500 yen; bus 9.15 harganya 1.800 yen, bus 9.50 baru tiba pukul 11.20).' },
          { id: 'L5-46-2', tanya: '二人{ふたり}で9時{じ}15分{ふん}のバスに乗{の}ります。きっぷは駅{えき}の店{みせ}で買{か}います。二人{ふたり}でいくらですか。', tanyaId: 'Dua orang naik bus pukul 9.15. Tiketnya dibeli di toko stasiun. Berapa harganya untuk berdua?', opsi: ['3400円{えん}', '3600円{えん}', '1700円{えん}'], benar: 0, pembahasan: '9時15分→空港10時30分、1800円…駅の店で買うと、1枚100円安いです = bus pukul 9.15 harganya 1.800 yen … kalau dibeli di toko stasiun, 100 yen lebih murah per lembar ((1.800 − 100) × 2 orang = 3.400 yen).' },
        ],
      },
      {
        id: 'L5-47',
        judul: '寮{りょう}の近{ちか}くの病院{びょういん}',
        teks: '寮{りょう}の事務所{じむしょ}に、このお知{し}らせがあります。\n近{ちか}くの病院{びょういん}の時間{じかん}\n・山田{やまだ}病院{びょういん}：月曜日{げつようび}～土曜日{どようび}、午前{ごぜん}9時{じ}～午後{ごご}1時{じ}、英語{えいご}ができます\n・中村{なかむら}病院{びょういん}：月曜日{げつようび}～金曜日{きんようび}、午前{ごぜん}9時{じ}～午後{ごご}6時{じ}、英語{えいご}ができます\n・森{もり}病院{びょういん}：火曜日{かようび}～土曜日{どようび}、午後{ごご}2時{じ}～7時{じ}、英語{えいご}ができます\n・木村{きむら}病院{びょういん}：月曜日{げつようび}～土曜日{どようび}、午後{ごご}1時{じ}～6時{じ}、日本語{にほんご}だけです\n※受付{うけつけ}は、病院{びょういん}が終{お}わる時間{じかん}の30分{ぷん}前{まえ}までです。\n※病院{びょういん}へ行{い}くときは、保険証{ほけんしょう}を持{も}って行{い}ってください。\n日曜日{にちようび}は、四{よっ}つの病院{びょういん}は休{やす}みです。',
        terjemahan: 'Di kantor asrama ada pengumuman ini. Jam buka rumah sakit di dekat sini: Rumah Sakit Yamada, Senin–Sabtu, pukul 9 pagi–1 siang, bisa berbahasa Inggris; Rumah Sakit Nakamura, Senin–Jumat, pukul 9 pagi–6 sore, bisa berbahasa Inggris; Rumah Sakit Mori, Selasa–Sabtu, pukul 2–7 sore, bisa berbahasa Inggris; Rumah Sakit Kimura, Senin–Sabtu, pukul 1–6 sore, hanya bahasa Jepang. Catatan: pendaftaran sampai 30 menit sebelum jam tutup rumah sakit. Kalau pergi ke rumah sakit, bawalah kartu asuransi kesehatan. Pada hari Minggu, keempat rumah sakit itu libur.',
        soal: [
          { id: 'L5-47-1', tanya: 'デウィさんは土曜日{どようび}の午後{ごご}3時{じ}ごろ、病院{びょういん}へ行{い}きたいです。英語{えいご}で話{はな}したいです。どの病院{びょういん}がいいですか。', tanyaId: 'Dewi ingin pergi ke rumah sakit hari Sabtu sekitar pukul 3 sore. Ia ingin berbicara dalam bahasa Inggris. Rumah sakit mana yang cocok?', opsi: ['木村{きむら}病院{びょういん}', '森{もり}病院{びょういん}', '中村{なかむら}病院{びょういん}'], benar: 1, pembahasan: '森病院：火曜日～土曜日、午後2時～7時、英語ができます = Rumah Sakit Mori: Selasa–Sabtu, pukul 2–7 sore, bisa berbahasa Inggris (Rumah Sakit Kimura buka hari Sabtu sore tetapi hanya bahasa Jepang; Rumah Sakit Nakamura tidak buka hari Sabtu).' },
          { id: 'L5-47-2', tanya: '中村{なかむら}病院{びょういん}の受付{うけつけ}は、何時{なんじ}までですか。', tanyaId: 'Pendaftaran di Rumah Sakit Nakamura sampai pukul berapa?', opsi: ['午後{ごご}6時{じ}', '午後{ごご}6時{じ}30分{ぷん}', '午後{ごご}5時{じ}30分{ぷん}'], benar: 2, pembahasan: '中村病院：月曜日～金曜日、午前9時～午後6時…受付は、病院が終わる時間の30分前までです = Rumah Sakit Nakamura: Senin–Jumat, pukul 9 pagi–6 sore … pendaftaran sampai 30 menit sebelum jam tutup rumah sakit (pukul 6 sore − 30 menit = pukul 5.30 sore).' },
        ],
      },
      {
        id: 'L5-48',
        judul: 'おふろに入{はい}る時間{じかん}',
        teks: '寮{りょう}の1階{かい}に、このお知{し}らせがあります。\n寮{りょう}のおふろ\n・1階{かい}の大{おお}きいおふろ：男{おとこ}の人{ひと}、毎日{まいにち}、午後{ごご}5時{じ}～10時{じ}\n・2階{かい}の大{おお}きいおふろ：女{おんな}の人{ひと}、毎日{まいにち}、午後{ごご}5時{じ}～9時{じ}\n・2階{かい}の小{ちい}さいおふろ：女{おんな}の人{ひと}、月曜日{げつようび}～金曜日{きんようび}、午後{ごご}9時{じ}～11時{じ}\n・3階{がい}の小{ちい}さいおふろ：女{おんな}の人{ひと}、土曜日{どようび}と日曜日{にちようび}、午後{ごご}9時{じ}～11時{じ}\n※月曜日{げつようび}は1階{かい}のおふろをそうじしますから、男{おとこ}の人{ひと}は2階{かい}の大{おお}きいおふろに入{はい}ってください。時間{じかん}は午後{ごご}9時{じ}から10時{じ}までです。\n※寮{りょう}の人{ひと}の友{とも}だちは、おふろに入{はい}ってはいけません。',
        terjemahan: 'Di lantai 1 asrama ada pengumuman ini. Kamar mandi (ofuro) asrama: ofuro besar lantai 1, untuk laki-laki, setiap hari, pukul 5–10 malam; ofuro besar lantai 2, untuk perempuan, setiap hari, pukul 5–9 malam; ofuro kecil lantai 2, untuk perempuan, Senin–Jumat, pukul 9–11 malam; ofuro kecil lantai 3, untuk perempuan, Sabtu dan Minggu, pukul 9–11 malam. Catatan: hari Senin ofuro lantai 1 dibersihkan, jadi laki-laki harap memakai ofuro besar lantai 2. Waktunya dari pukul 9 sampai pukul 10 malam. Teman dari penghuni asrama tidak boleh memakai ofuro.',
        soal: [
          { id: 'L5-48-1', tanya: 'サリさんは女{おんな}の人{ひと}です。土曜日{どようび}の夜{よる}10時{じ}ごろ、おふろに入{はい}りたいです。どこがいいですか。', tanyaId: 'Sari seorang perempuan. Ia ingin mandi berendam hari Sabtu sekitar pukul 10 malam. Di mana sebaiknya?', opsi: ['3階{がい}の小{ちい}さいおふろ', '2階{かい}の小{ちい}さいおふろ', '2階{かい}の大{おお}きいおふろ'], benar: 0, pembahasan: '3階の小さいおふろ：女の人、土曜日と日曜日、午後9時～11時 = ofuro kecil lantai 3: untuk perempuan, Sabtu dan Minggu, pukul 9–11 malam (ofuro kecil lantai 2 hanya Senin–Jumat; ofuro besar lantai 2 hanya sampai pukul 9).' },
          { id: 'L5-48-2', tanya: '月曜日{げつようび}、男{おとこ}の人{ひと}は何時{なんじ}からおふろに入{はい}ることができますか。', tanyaId: 'Pada hari Senin, laki-laki bisa mandi berendam mulai pukul berapa?', opsi: ['午後{ごご}5時{じ}', '午後{ごご}9時{じ}', '午後{ごご}10時{じ}'], benar: 1, pembahasan: '月曜日は1階のおふろをそうじしますから、男の人は2階の大きいおふろに入ってください。時間は午後9時から10時までです = hari Senin ofuro lantai 1 dibersihkan, jadi laki-laki memakai ofuro besar lantai 2; waktunya pukul 9 sampai 10 malam (pukul 5 adalah jam biasa di lantai 1, bukan untuk hari Senin).' },
        ],
      },
      {
        id: 'L5-49',
        judul: '学生{がくせい}のアルバイト',
        teks: '日本語{にほんご}学校{がっこう}に、このお知{し}らせがあります。\nアルバイトのお知{し}らせ\n・パン屋{や}：月曜日{げつようび}～金曜日{きんようび}、朝{あさ}6時{じ}～9時{じ}、1時間{じかん}1200円{えん}\n・レストラン：土曜日{どようび}と日曜日{にちようび}、午前{ごぜん}11時{じ}～午後{ごご}4時{じ}、1時間{じかん}1050円{えん}\n・コンビニ：土曜日{どようび}と日曜日{にちようび}、午後{ごご}5時{じ}～10時{じ}、1時間{じかん}1200円{えん}\n・スーパー：土曜日{どようび}と日曜日{にちようび}、午前{ごぜん}9時{じ}～午後{ごご}2時{じ}、1時間{じかん}1150円{えん}\n※アルバイトをしたい人{ひと}は、店{みせ}に電話{でんわ}をかけてください。その前{まえ}に、学校{がっこう}の事務所{じむしょ}で紙{かみ}に名前{なまえ}と電話{でんわ}番号{ばんごう}を書{か}いて、出{だ}してください。\n※アルバイトは来月{らいげつ}1日{ついたち}からです。',
        terjemahan: 'Di sekolah bahasa Jepang ada pengumuman ini. Pengumuman kerja paruh waktu: toko roti, Senin–Jumat, pukul 6–9 pagi, 1.200 yen per jam; restoran, Sabtu dan Minggu, pukul 11 siang–4 sore, 1.050 yen per jam; minimarket, Sabtu dan Minggu, pukul 5–10 malam, 1.200 yen per jam; supermarket, Sabtu dan Minggu, pukul 9 pagi–2 siang, 1.150 yen per jam. Catatan: yang ingin bekerja paruh waktu, teleponlah tokonya. Sebelum itu, tulislah nama dan nomor telepon di kertas di kantor sekolah, lalu serahkan. Kerja paruh waktu mulai tanggal 1 bulan depan.',
        soal: [
          { id: 'L5-49-1', tanya: 'ロンさんは、土曜日{どようび}と日曜日{にちようび}だけアルバイトができます。午後{ごご}5時{じ}までに終{お}わって、1時間{じかん}1100円{えん}より高{たか}いアルバイトがいいです。どれがいいですか。', tanyaId: 'Ron hanya bisa bekerja paruh waktu pada hari Sabtu dan Minggu. Ia ingin kerja paruh waktu yang selesai paling lambat pukul 5 sore dan bayarannya lebih tinggi dari 1.100 yen per jam. Mana yang cocok?', opsi: ['コンビニ', 'レストラン', 'スーパー'], benar: 2, pembahasan: 'スーパー：土曜日と日曜日、午前9時～午後2時、1時間1150円 = supermarket: Sabtu dan Minggu, pukul 9 pagi–2 siang, 1.150 yen per jam (restoran hanya 1.050 yen; minimarket mulai pukul 5 sore sampai pukul 10 malam).' },
          { id: 'L5-49-2', tanya: 'アルバイトをしたい人{ひと}は、はじめに何{なに}をしますか。', tanyaId: 'Orang yang ingin bekerja paruh waktu, pertama-tama melakukan apa?', opsi: ['店{みせ}に電話{でんわ}をかけます', '事務所{じむしょ}で紙{かみ}に名前{なまえ}を書{か}きます', '店{みせ}で紙{かみ}に名前{なまえ}を書{か}きます'], benar: 1, pembahasan: '店に電話をかけてください。その前に、学校の事務所で紙に名前と電話番号を書いて、出してください = teleponlah tokonya; sebelum itu, tulislah nama dan nomor telepon di kertas di kantor sekolah, lalu serahkan (yang dilakukan lebih dulu adalah menulis di kantor sekolah, baru menelepon toko).' },
        ],
      },
      {
        id: 'L5-50',
        judul: '駅{えき}の近{ちか}くの部屋{へや}',
        teks: '大学{だいがく}に、このお知{し}らせがあります。\n学生{がくせい}のみなさんの部屋{へや}\n・さくらハイツ：駅{えき}から歩{ある}いて5分{ふん}、家賃{やちん}6万円{まんえん}、ねこもいいです\n・みどりハイツ：駅{えき}から歩{ある}いて8分{ぷん}、家賃{やちん}4万円{まんえん}、ねこはだめです\n・ひかりハイツ：駅{えき}から歩{ある}いて9分{ふん}、家賃{やちん}5万円{まんえん}、ねこもいいです\n・あおばハイツ：駅{えき}から歩{ある}いて15分{ふん}、家賃{やちん}3万円{まんえん}、ねこもいいです\n・もみじハイツ：駅{えき}から歩{ある}いて12分{ふん}、家賃{やちん}7万円{まんえん}、ねこはだめです\n※はじめの月{つき}だけ、家賃{やちん}といっしょに2万円{まんえん}払{はら}ってください。\n部屋{へや}を見{み}たい人{ひと}は、大学{だいがく}の事務所{じむしょ}に電話{でんわ}をかけてください。',
        terjemahan: 'Di universitas ada pengumuman ini. Kamar untuk para mahasiswa: Sakura Heights, 5 menit jalan kaki dari stasiun, sewa 60.000 yen, kucing boleh; Midori Heights, 8 menit jalan kaki dari stasiun, sewa 40.000 yen, kucing tidak boleh; Hikari Heights, 9 menit jalan kaki dari stasiun, sewa 50.000 yen, kucing boleh; Aoba Heights, 15 menit jalan kaki dari stasiun, sewa 30.000 yen, kucing boleh; Momiji Heights, 12 menit jalan kaki dari stasiun, sewa 70.000 yen, kucing tidak boleh. Catatan: hanya pada bulan pertama, bayarlah 20.000 yen bersama uang sewa. Yang ingin melihat kamar, teleponlah kantor universitas.',
        soal: [
          { id: 'L5-50-1', tanya: 'ワヤンさんは、駅{えき}から歩{ある}いて10分{ぷん}までの部屋{へや}に住{す}みたいです。家賃{やちん}は5万円{まんえん}までがいいです。ねこといっしょに住{す}みます。どれがいいですか。', tanyaId: 'Wayan ingin tinggal di kamar yang paling jauh 10 menit jalan kaki dari stasiun. Sewanya sebaiknya paling mahal 50.000 yen. Ia tinggal bersama kucing. Mana yang cocok?', opsi: ['ひかりハイツ', 'あおばハイツ', 'みどりハイツ'], benar: 0, pembahasan: 'ひかりハイツ：駅から歩いて9分、家賃5万円、ねこもいいです = Hikari Heights: 9 menit jalan kaki dari stasiun, sewa 50.000 yen, kucing boleh (Aoba Heights 15 menit dari stasiun; Midori Heights tidak boleh ada kucing).' },
          { id: 'L5-50-2', tanya: 'みどりハイツに住{す}む人{ひと}は、はじめの月{つき}にいくら払{はら}いますか。', tanyaId: 'Orang yang tinggal di Midori Heights membayar berapa pada bulan pertama?', opsi: ['4万円{まんえん}', '2万円{まんえん}', '6万円{まんえん}'], benar: 2, pembahasan: 'みどりハイツ：駅から歩いて8分、家賃4万円…はじめの月だけ、家賃といっしょに2万円払ってください = Midori Heights: 8 menit jalan kaki dari stasiun, sewa 40.000 yen … hanya pada bulan pertama, bayarlah 20.000 yen bersama uang sewa (40.000 + 20.000 = 60.000 yen).' },
        ],
      },
    ],
  },
];
