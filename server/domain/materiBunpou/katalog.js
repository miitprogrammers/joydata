// Every sentence pattern Materi Bunpou plans to explain, one entry per pattern (variants merged).
// tingkat = where the pattern is first taught: Minna no Nihongo I (Bab 1–25) = N5, Minna II (Bab 26–50) or only the
// 111 Bunpo N4 module = N4. sumber keeps every place the pattern appears, so a sensei can find it in the book or module.
// An entry without content in materiN5.js / materiN4.js is listed as "belum ditulis".
// ids are stable URL slugs: never rename one.
//
// Built from the JPF Minna pattern table (docs/kb-dokkai/data/minna-pola.json) and the module (bankSoal/bunpouN4.js);
// which Minna rows and module numbers each entry merges is reviewed in docs/materi-bunpou/katalog.md.
// Order: smallest Minna bab, then smallest module number, then Minna row order; module-only entries last.

export const KATALOG_MATERI = [
  // ── Minna I, Bab 1–25 (N5) ──
  // Bab 1
  { id: 'wa-desu', pola: 'N1はN2です', varian: ['～じゃありません', '～ではありません', '～ですか'], romaji: 'wa desu', arti: '… adalah … / bukan … / apakah …?', kataKunci: ['adalah', 'bukan', 'apakah', 'kalimat kata benda'], tingkat: 'N5', sumber: { minnaBab: [1], modulN4: [], jlptsensei: { N5: [2, 20, 21, 79] } } },
  { id: 'n-no-n', pola: 'N1のN2', varian: ['Nのです'], romaji: 'no', arti: 'milik / dari (penghubung kata benda)', kataKunci: ['milik', 'punya', 'dari', 'kepunyaan'], tingkat: 'N5', sumber: { minnaBab: [1, 2, 3], modulN4: [], jlptsensei: { N5: [52] } } },
  { id: 'mo', pola: 'N1もN2です', varian: ['～も'], romaji: 'mo', arti: 'juga', kataKunci: ['juga', 'pun'], tingkat: 'N5', sumber: { minnaBab: [1], modulN4: [], jlptsensei: { N5: [34] } } },
  // Bab 2
  { id: 'kore-sore-are', pola: 'これ／それ／あれ', varian: ['どれ'], romaji: 'kore sore are', arti: 'ini / itu / itu (yang jauh)', kataKunci: ['ini', 'itu', 'kata tunjuk'], tingkat: 'N5', sumber: { minnaBab: [2], modulN4: [] } },
  { id: 'desu-ka-desu-ka', pola: 'N1ですか、N2ですか', romaji: 'desu ka, desu ka', arti: '… atau …? (pertanyaan pilihan)', kataKunci: ['atau', 'pilihan', 'pertanyaan'], tingkat: 'N5', sumber: { minnaBab: [2], modulN4: [], jlptsensei: { N5: [22] } } },
  { id: 'kono-sono-ano', pola: 'この／その／あのN', varian: ['どのN'], romaji: 'kono sono ano', arti: '… ini / … itu (sebelum kata benda)', kataKunci: ['ini', 'itu', 'kata tunjuk', 'yang mana'], tingkat: 'N5', sumber: { minnaBab: [2], modulN4: [] } },
  // Bab 3
  { id: 'koko-soko-asoko', pola: 'ここ／そこ／あそこ', varian: ['こちら／そちら／あちら', 'どこ', 'どちら'], romaji: 'koko soko asoko', arti: 'di sini / di situ / di sana', kataKunci: ['di sini', 'di sana', 'tempat', 'arah', 'di mana'], tingkat: 'N5', sumber: { minnaBab: [3], modulN4: [] } },
  // Bab 4
  { id: 'kara-made', pola: '～から～まで', romaji: 'kara made', arti: 'dari … sampai …', kataKunci: ['dari', 'sampai', 'hingga'], tingkat: 'N5', sumber: { minnaBab: [4], modulN4: [], jlptsensei: { N5: [29] } } },
  { id: 'ni-jikan', pola: '［時間{じかん}］にVます', varian: ['～時{じ}に', '～日{にち}に'], romaji: 'ni', arti: 'pada (jam, hari, tanggal)', kataKunci: ['pada', 'jam', 'waktu', 'tanggal'], tingkat: 'N5', sumber: { minnaBab: [4, 5], modulN4: [], jlptsensei: { N5: [48] } } },
  { id: 'masu', pola: '～ます／～ました', varian: ['～ません', '～ませんでした'], romaji: 'masu, mashita', arti: 'kata kerja sopan: sekarang & lampau', kataKunci: ['bentuk sopan', 'lampau', 'negatif', 'kata kerja'], tingkat: 'N5', sumber: { minnaBab: [4], modulN4: [] } },
  // Bab 5
  { id: 'e-ikimasu', pola: '［場所{ばしょ}］へ行{い}きます', varian: ['～へ来{き}ます', '～へ帰{かえ}ります'], romaji: 'e ikimasu', arti: 'pergi / datang / pulang ke …', kataKunci: ['ke', 'pergi', 'datang', 'pulang', 'arah'], tingkat: 'N5', sumber: { minnaBab: [5], modulN4: [], jlptsensei: { N5: [51] } } },
  { id: 'de-shudan', pola: '［道具{どうぐ}・手段{しゅだん}］でVます', varian: ['［乗{の}り物{もの}］で行{い}きます', '［言語{げんご}］で～'], romaji: 'de', arti: 'dengan / naik / memakai (alat, bahasa)', kataKunci: ['dengan', 'naik', 'memakai', 'alat', 'kendaraan', 'bahasa'], tingkat: 'N5', sumber: { minnaBab: [5, 7], modulN4: [], jlptsensei: { N5: [5] } } },
  { id: 'to-ikimasu', pola: '［人{ひと}］と行{い}きます', romaji: 'to', arti: 'bersama (orang)', kataKunci: ['bersama', 'dengan', 'teman'], tingkat: 'N5', sumber: { minnaBab: [5], modulN4: [], jlptsensei: { N5: [75] } } },
  // Bab 6
  { id: 'wo', pola: 'NをVます', varian: ['何{なに}をしますか'], romaji: 'wo', arti: 'penanda objek (を)', kataKunci: ['objek', 'penanda objek', 'melakukan'], tingkat: 'N5', sumber: { minnaBab: [6], modulN4: [], jlptsensei: { N5: [60] } } },
  { id: 'de-basho', pola: '［場所{ばしょ}］でVます', romaji: 'de', arti: 'di (tempat kegiatan)', kataKunci: ['di', 'tempat', 'kegiatan'], tingkat: 'N5', sumber: { minnaBab: [6], modulN4: [], jlptsensei: { N5: [5] } } },
  { id: 'masen-ka', pola: '～ませんか', romaji: 'masen ka', arti: 'maukah …? (ajakan)', kataKunci: ['ajakan', 'mengajak', 'maukah'], tingkat: 'N5', sumber: { minnaBab: [6], modulN4: [], jlptsensei: { N5: [31] } } },
  { id: 'mashou', pola: '～ましょう', romaji: 'mashou', arti: 'mari … / ayo …', kataKunci: ['mari', 'ayo', 'ajakan'], tingkat: 'N5', sumber: { minnaBab: [6], modulN4: [], jlptsensei: { N5: [32] } } },
  // Bab 7
  { id: 'agemasu-moraimasu', pola: '［人{ひと}］に［物{もの}］をあげます', varian: ['～をもらいます'], romaji: 'agemasu, moraimasu', arti: 'memberi / menerima (barang)', kataKunci: ['memberi', 'menerima', 'hadiah', 'dapat'], tingkat: 'N5', sumber: { minnaBab: [7], modulN4: [] } },
  { id: 'mou-mashita', pola: 'もう～ました', romaji: 'mou mashita', arti: 'sudah …', kataKunci: ['sudah', 'telah'], tingkat: 'N5', sumber: { minnaBab: [7], modulN4: [], jlptsensei: { N5: [35] } } },
  // Bab 8
  { id: 'keiyoushi', pola: 'イA-いです／ナA-です', varian: ['～くないです', 'ナA-なN'], romaji: 'keiyoushi', arti: 'kata sifat -i dan -na', kataKunci: ['kata sifat', 'sifat', 'adjektiva'], tingkat: 'N5', sumber: { minnaBab: [8], modulN4: [], jlptsensei: { N5: [16, 36] } } },
  { id: 'amari-nai', pola: 'あまり～ません', varian: ['ぜんぜん～ません', 'あまり～ない'], romaji: 'amari masen, zenzen masen', arti: 'tidak begitu … / sama sekali tidak …', kataKunci: ['tidak begitu', 'sama sekali', 'tidak terlalu'], tingkat: 'N5', sumber: { minnaBab: [8, 9], modulN4: [], jlptsensei: { N4: [3, 131] } } },
  // Bab 9
  { id: 'ga-suki', pola: '～はNが好{す}きです', varian: ['～が上手{じょうず}です', '～がわかります', '～があります'], romaji: 'ga suki desu', arti: 'suka / pandai / paham / punya …', kataKunci: ['suka', 'pandai', 'mengerti', 'punya', 'benci'], tingkat: 'N5', sumber: { minnaBab: [9], modulN4: [] } },
  { id: 'kara-riyuu', pola: '～から、～', varian: ['どうして～か'], romaji: 'kara', arti: 'karena … (alasan)', kataKunci: ['karena', 'sebab', 'alasan', 'mengapa'], tingkat: 'N5', sumber: { minnaBab: [9], modulN4: [], jlptsensei: { N5: [9, 23] } } },
  // Bab 10
  { id: 'ni-ga-arimasu', pola: '［場所{ばしょ}］にNがあります', varian: ['～にNがいます', 'Nは［場所{ばしょ}］にあります', 'Nがある'], romaji: 'ni ga arimasu', arti: 'ada … di … (keberadaan)', kataKunci: ['ada', 'keberadaan', 'letak', 'posisi'], tingkat: 'N5', sumber: { minnaBab: [10], modulN4: [47], jlptsensei: { N5: [12, 14] } } },
  // Bab 11
  { id: 'josuushi', pola: '～つ／～枚{まい}／～人{にん}', varian: ['ひとつ', '～台{だい}', '～ぐらい', '～かかります'], romaji: 'josuushi', arti: 'kata bantu bilangan (jumlah)', kataKunci: ['bilangan', 'jumlah', 'menghitung', 'berapa', 'satuan'], tingkat: 'N5', sumber: { minnaBab: [11], modulN4: [] } },
  { id: 'ni-kai', pola: '［期間{きかん}］に～回{かい}', romaji: 'ni kai', arti: '… kali dalam (seminggu, sebulan)', kataKunci: ['kali', 'frekuensi', 'seminggu', 'sering'], tingkat: 'N5', sumber: { minnaBab: [11], modulN4: [] } },
  // Bab 12
  { id: 'dochira-hou-ga', pola: 'N1とN2とどちらが～ですか', varian: ['～のほうが～です', 'N1よりN2のほうが～'], romaji: 'dochira ga, hou ga', arti: 'mana yang lebih …? / … lebih …', kataKunci: ['mana', 'lebih', 'pilihan', 'perbandingan', 'daripada'], tingkat: 'N5', sumber: { minnaBab: [12], modulN4: [55, 98, 100], jlptsensei: { N5: [84] } } },
  { id: 'yori', pola: 'N1はN2より～', romaji: 'yori', arti: 'A lebih … daripada B', kataKunci: ['lebih', 'daripada', 'perbandingan'], tingkat: 'N5', sumber: { minnaBab: [12], modulN4: [97], jlptsensei: { N5: [80], N4: [123] } } },
  { id: 'keiyoushi-kako', pola: '～かったです／～でした', varian: ['～くなかったです', '～じゃありませんでした'], romaji: 'katta desu, deshita', arti: 'bentuk lampau kata sifat & kata benda', kataKunci: ['lampau', 'dulu', 'kemarin', 'kata sifat'], tingkat: 'N5', sumber: { minnaBab: [12], modulN4: [] } },
  { id: 'ichiban', pola: '～で～が一番{いちばん}～', romaji: 'ichiban', arti: 'paling … (di antara …)', kataKunci: ['paling', 'terbaik', 'di antara'], tingkat: 'N5', sumber: { minnaBab: [12], modulN4: [], jlptsensei: { N5: [17, 57], N4: [61] } } },
  // Bab 13
  { id: 'hoshii', pola: 'Nが欲{ほ}しいです', romaji: 'hoshii desu', arti: 'ingin (memiliki) …', kataKunci: ['ingin', 'mau', 'pengen'], tingkat: 'N5', sumber: { minnaBab: [13], modulN4: [], jlptsensei: { N5: [13] } } },
  { id: 'tai', pola: '～たいです', varian: ['～たい'], romaji: 'tai desu', arti: 'ingin (melakukan) …', kataKunci: ['ingin', 'mau', 'keinginan'], tingkat: 'N5', sumber: { minnaBab: [13], modulN4: [], jlptsensei: { N5: [67] } } },
  { id: 'ni-ikimasu', pola: '［V-ます／N］に行{い}きます', romaji: 'ni ikimasu', arti: 'pergi untuk …', kataKunci: ['pergi untuk', 'tujuan'], tingkat: 'N5', sumber: { minnaBab: [13], modulN4: [], jlptsensei: { N5: [49] } } },
  // Bab 14
  { id: 'kata', pola: 'V-かた', varian: ['～方{かた}'], romaji: 'kata', arti: 'cara …', kataKunci: ['cara', 'cara melakukan'], tingkat: 'N5', sumber: { minnaBab: [14], modulN4: [10], jlptsensei: { N5: [24] } } },
  { id: 'te-kudasai', pola: '～てください', romaji: 'te kudasai', arti: 'tolong … / silakan …', kataKunci: ['tolong', 'silakan', 'mohon'], tingkat: 'N5', sumber: { minnaBab: [14], modulN4: [], jlptsensei: { N5: [72] } } },
  { id: 'mashou-ka', pola: '～ましょうか', romaji: 'mashou ka', arti: 'bagaimana kalau saya …? (menawarkan)', kataKunci: ['menawarkan', 'bantuan', 'bagaimana kalau'], tingkat: 'N5', sumber: { minnaBab: [14], modulN4: [], jlptsensei: { N5: [33] } } },
  { id: 'te-imasu', pola: '～ています', romaji: 'te imasu', arti: 'sedang … / (keadaan) …', kataKunci: ['sedang', 'masih', 'sudah'], tingkat: 'N5', sumber: { minnaBab: [14, 15, 28], modulN4: [], jlptsensei: { N5: [70] } } },
  // Bab 15
  { id: 'te-mo-ii', pola: '～てもいいです', romaji: 'te mo ii desu', arti: 'boleh …', kataKunci: ['boleh', 'diizinkan'], tingkat: 'N5', sumber: { minnaBab: [15], modulN4: [18], jlptsensei: { N5: [74] } } },
  { id: 'te-wa-ikemasen', pola: '～てはいけません', romaji: 'te wa ikemasen', arti: 'tidak boleh …', kataKunci: ['tidak boleh', 'dilarang'], tingkat: 'N5', sumber: { minnaBab: [15], modulN4: [19], jlptsensei: { N5: [1, 73] } } },
  // Bab 16
  { id: 'te-te', pola: 'V1-て、V2-て、～', romaji: 'te, te', arti: '… lalu … (urutan kegiatan)', kataKunci: ['lalu', 'kemudian', 'urutan'], tingkat: 'N5', sumber: { minnaBab: [16], modulN4: [] } },
  { id: 'te-kara', pola: '～てから', romaji: 'te kara', arti: 'setelah …, (baru) …', kataKunci: ['setelah', 'sesudah'], tingkat: 'N5', sumber: { minnaBab: [16], modulN4: [], jlptsensei: { N5: [71] } } },
  { id: 'wa-ga', pola: 'N1はN2が～', romaji: 'wa ga', arti: '(sesuatu) …-nya … (は～が)', kataKunci: ['-nya', 'ciri', 'topik dan subjek'], tingkat: 'N5', sumber: { minnaBab: [16], modulN4: [] } },
  { id: 'kute-de', pola: 'イA-くて、～／ナA-で、～', romaji: 'kute, de', arti: '… dan … (menyambung kata sifat)', kataKunci: ['dan', 'menyambung', 'kata sifat'], tingkat: 'N5', sumber: { minnaBab: [16], modulN4: [] } },
  // Bab 17
  { id: 'nakereba-narimasen', pola: '～なければなりません', varian: ['～なければならない', '～なくてはいけません', '～なくてはいけない'], romaji: 'nakereba narimasen', arti: 'harus …', kataKunci: ['harus', 'wajib'], tingkat: 'N5', sumber: { minnaBab: [17], modulN4: [20, 21], jlptsensei: { N5: [40, 42, 43, 44], N4: [52, 53] } } },
  { id: 'nakute-mo-ii', pola: '～なくてもいいです', varian: ['～なくてもいい'], romaji: 'nakute mo ii desu', arti: 'tidak perlu …', kataKunci: ['tidak perlu', 'tidak harus', 'tidak usah'], tingkat: 'N5', sumber: { minnaBab: [17], modulN4: [22], jlptsensei: { N5: [41] } } },
  { id: 'made-ni', pola: '～までに', romaji: 'made ni', arti: 'paling lambat … / sebelum …', kataKunci: ['paling lambat', 'sebelum', 'batas waktu'], tingkat: 'N5', sumber: { minnaBab: [17], modulN4: [45], jlptsensei: { N4: [41] } } },
  { id: 'naide-kudasai', pola: '～ないでください', romaji: 'naide kudasai', arti: 'tolong jangan …', kataKunci: ['jangan', 'tolong jangan'], tingkat: 'N5', sumber: { minnaBab: [17], modulN4: [], jlptsensei: { N5: [39] } } },
  { id: 'wa-toritate', pola: 'Nは～（目的語{もくてきご}）', romaji: 'wa', arti: 'は menggantikan を (objek jadi topik)', kataKunci: ['topik', 'objek', 'partikel は'], tingkat: 'N5', sumber: { minnaBab: [17], modulN4: [] } },
  // Bab 18
  { id: 'koto-ga-dekiru', pola: '～ことができます', varian: ['Nができます', '～ことができる'], romaji: 'koto ga dekimasu', arti: 'bisa / dapat …', kataKunci: ['bisa', 'dapat', 'mampu', 'kemampuan'], tingkat: 'N5', sumber: { minnaBab: [18], modulN4: [33], jlptsensei: { N4: [36] } } },
  { id: 'koto', pola: '～こと', varian: ['趣味{しゅみ}は～ことです'], romaji: 'koto', arti: 'hal … (membendakan kata kerja)', kataKunci: ['hobi', 'hal', 'pembendaan'], tingkat: 'N5', sumber: { minnaBab: [18], modulN4: [94], jlptsensei: { N4: [34] } } },
  { id: 'mae-ni', pola: '～まえに', varian: ['～前{まえ}に'], romaji: 'mae ni', arti: 'sebelum …', kataKunci: ['sebelum'], tingkat: 'N5', sumber: { minnaBab: [18], modulN4: [], jlptsensei: { N5: [30] } } },
  // Bab 19
  { id: 'ta-koto-ga-aru', pola: '～たことがあります', varian: ['～たことがありません', '～たことがない'], romaji: 'ta koto ga arimasu', arti: 'pernah … / tidak pernah …', kataKunci: ['pernah', 'pengalaman', 'belum pernah'], tingkat: 'N5', sumber: { minnaBab: [19], modulN4: [40, 41], jlptsensei: { N5: [66] } } },
  { id: 'tari-tari', pola: '～たり～たりします', romaji: 'tari tari shimasu', arti: '… dan … (antara lain)', kataKunci: ['antara lain', 'dan', 'kegiatan'], tingkat: 'N5', sumber: { minnaBab: [19], modulN4: [], jlptsensei: { N5: [68] } } },
  { id: 'naru', pola: '～くなります／～になります', romaji: 'naru', arti: 'menjadi …', kataKunci: ['menjadi', 'berubah'], tingkat: 'N5', sumber: { minnaBab: [19], modulN4: [], jlptsensei: { N5: [45] } } },
  // Bab 20
  { id: 'futsuutai', pola: '普通体{ふつうたい}（～る／～た／～ない／～だ）', romaji: 'futsuutai', arti: 'bentuk biasa (gaya akrab)', kataKunci: ['bentuk biasa', 'kasual', 'akrab', 'santai'], tingkat: 'N5', sumber: { minnaBab: [20], modulN4: [] } },
  // Bab 21
  { id: 'to-omou', pola: '～と思{おも}います', varian: ['～と思{おも}う', '～だろうと思{おも}う'], romaji: 'to omoimasu', arti: 'saya pikir … / menurut saya …', kataKunci: ['pikir', 'menurut saya', 'pendapat', 'kira'], tingkat: 'N5', sumber: { minnaBab: [21], modulN4: [26], jlptsensei: { N4: [114] } } },
  { id: 'to-iu', pola: '～と言{い}います', varian: ['～と言{い}う'], romaji: 'to iimasu', arti: 'berkata bahwa … / mengatakan …', kataKunci: ['berkata', 'mengatakan', 'kutipan'], tingkat: 'N5', sumber: { minnaBab: [21], modulN4: [104], jlptsensei: { N4: [110] } } },
  { id: 'deshou-kakunin', pola: '～でしょう？', romaji: 'deshou', arti: '… kan? (minta persetujuan)', kataKunci: ['kan', 'persetujuan', 'konfirmasi'], tingkat: 'N5', sumber: { minnaBab: [21], modulN4: [], jlptsensei: { N5: [7] } } },
  // Bab 22
  { id: 'meishi-shuushoku', pola: '［普通形{ふつうけい}］＋N', romaji: 'meishi shuushoku', arti: 'kalimat penjelas kata benda (yang …)', kataKunci: ['yang', 'penjelas', 'anak kalimat', 'kata benda'], tingkat: 'N5', sumber: { minnaBab: [22], modulN4: [] } },
  // Bab 23
  { id: 'to', pola: '～と', romaji: 'to', arti: 'kalau / begitu … (pasti terjadi)', kataKunci: ['begitu', 'kalau', 'setiap kali'], tingkat: 'N5', sumber: { minnaBab: [23], modulN4: [13], jlptsensei: { N4: [108] } } },
  { id: 'toki', pola: '～とき', romaji: 'toki', arti: 'ketika … / saat …', kataKunci: ['ketika', 'saat', 'waktu'], tingkat: 'N5', sumber: { minnaBab: [23], modulN4: [], jlptsensei: { N5: [76] } } },
  // Bab 24
  { id: 'te-ageru', pola: '～てあげます', varian: ['～てあげる'], romaji: 'te agemasu', arti: 'melakukan … untuk orang lain', kataKunci: ['membantu', 'untuk orang lain', 'memberi'], tingkat: 'N5', sumber: { minnaBab: [24], modulN4: [62], jlptsensei: { N4: [92] } } },
  { id: 'te-kureru', pola: '～てくれます', varian: ['Nをくれます', '～てくれる'], romaji: 'te kuremasu', arti: 'memberi / melakukan … untuk saya', kataKunci: ['memberi', 'untuk saya', 'membantu', 'kebaikan'], tingkat: 'N5', sumber: { minnaBab: [24], modulN4: [63], jlptsensei: { N4: [97] } } },
  { id: 'te-morau', pola: '～てもらいます', varian: ['～てもらう'], romaji: 'te moraimasu', arti: 'menerima bantuan / minta …', kataKunci: ['menerima', 'minta tolong', 'dibantu'], tingkat: 'N5', sumber: { minnaBab: [24], modulN4: [64], jlptsensei: { N4: [100] } } },
  // Bab 25
  { id: 'tara', pola: '～たら', varian: ['もし～たら', '～かったら', '～だったら'], romaji: 'tara', arti: 'kalau … / setelah …', kataKunci: ['kalau', 'jika', 'setelah', 'seandainya'], tingkat: 'N5', sumber: { minnaBab: [25], modulN4: [11], jlptsensei: { N4: [88] } } },
  { id: 'temo', pola: '～ても', varian: ['いくら～ても', '～くても', '～でも'], romaji: 'temo', arti: 'meskipun …', kataKunci: ['meskipun', 'walaupun', 'biarpun'], tingkat: 'N5', sumber: { minnaBab: [25], modulN4: [16], jlptsensei: { N4: [107] } } },

  // ── Minna II, Bab 26–50 (N4) ──
  // Bab 26
  { id: 'n-desu', pola: '～んです', varian: ['～のです', '～んですか', '～んですが'], romaji: 'n desu', arti: 'penjelasan / menanyakan alasan', kataKunci: ['penjelasan', 'alasan', 'karena', 'mengapa'], tingkat: 'N4', sumber: { minnaBab: [26], modulN4: [103], jlptsensei: { N5: [46, 53] } } },
  { id: 'te-itadakemasen-ka', pola: '～ていただけませんか', varian: ['～てくださいませんか'], romaji: 'te itadakemasen ka', arti: 'bisakah Anda …? (permintaan sopan)', kataKunci: ['tolong', 'permintaan sopan', 'bisakah', 'mohon'], tingkat: 'N4', sumber: { minnaBab: [26, 41], modulN4: [], jlptsensei: { N4: [96] } } },
  { id: 'tara-ii-desu-ka', pola: '～たらいいですか', varian: ['～ばいいですか', 'どうしたらいいですか'], romaji: 'tara ii desu ka', arti: 'sebaiknya … bagaimana?', kataKunci: ['sebaiknya', 'bagaimana', 'minta saran'], tingkat: 'N4', sumber: { minnaBab: [26, 35], modulN4: [], jlptsensei: { N4: [90] } } },
  // Bab 27
  { id: 'kanoukei', pola: '～（ら）れます（可能形{かのうけい}）', varian: ['～えます', '可能動詞{かのうどうし}'], romaji: 'kanoukei', arti: 'bentuk potensial (bisa …)', kataKunci: ['bisa', 'dapat', 'potensial', 'mampu'], tingkat: 'N4', sumber: { minnaBab: [27], modulN4: [34], jlptsensei: { N4: [69] } } },
  { id: 'mieru-kikoeru', pola: 'Nが見{み}えます／聞{き}こえます', romaji: 'miemasu, kikoemasu', arti: 'terlihat / terdengar', kataKunci: ['terlihat', 'kelihatan', 'terdengar'], tingkat: 'N4', sumber: { minnaBab: [27], modulN4: [] } },
  { id: 'shika-nai', pola: '～しか～ません', varian: ['～しか～ない'], romaji: 'shika masen', arti: 'hanya … (tidak lebih)', kataKunci: ['hanya', 'cuma', 'saja'], tingkat: 'N4', sumber: { minnaBab: [27], modulN4: [] } },
  { id: 'wa-taihi', pola: 'N1は～が、N2は～', romaji: 'wa', arti: 'は untuk membandingkan (kontras)', kataKunci: ['kontras', 'membandingkan', 'tetapi'], tingkat: 'N4', sumber: { minnaBab: [27], modulN4: [], jlptsensei: { N4: [120] } } },
  // Bab 28
  { id: 'shi', pola: '～し、～し', varian: ['～し、それに～'], romaji: 'shi', arti: 'lagi pula … / sudah …, juga …', kataKunci: ['lagi pula', 'selain itu', 'alasan', 'juga'], tingkat: 'N4', sumber: { minnaBab: [28], modulN4: [53], jlptsensei: { N4: [77] } } },
  { id: 'nagara', pola: '～ながら', romaji: 'nagara', arti: 'sambil …', kataKunci: ['sambil', 'bersamaan'], tingkat: 'N4', sumber: { minnaBab: [28], modulN4: [], jlptsensei: { N4: [50] } } },
  // Bab 29
  { id: 'jidoushi-te-imasu', pola: 'Nが～ています（自動詞{じどうし}）', romaji: 'ga te imasu', arti: 'keadaan benda (terbuka, rusak, dsb.)', kataKunci: ['keadaan', 'intransitif', 'jidoushi', 'terbuka'], tingkat: 'N4', sumber: { minnaBab: [29], modulN4: [], jlptsensei: { N4: [86] } } },
  { id: 'te-shimau', pola: '～てしまいます', varian: ['～てしまいました', '～てしまう', '～ちゃう'], romaji: 'te shimaimasu', arti: 'sudah habis … / telanjur …', kataKunci: ['telanjur', 'habis', 'menyesal', 'selesai', 'tidak sengaja'], tingkat: 'N4', sumber: { minnaBab: [29], modulN4: [], jlptsensei: { N4: [102] } } },
  // Bab 30
  { id: 'te-oku', pola: '～ておきます', varian: ['～ておく'], romaji: 'te okimasu', arti: '… dulu (persiapan) / dibiarkan', kataKunci: ['persiapan', 'terlebih dahulu', 'dulu', 'dibiarkan'], tingkat: 'N4', sumber: { minnaBab: [30], modulN4: [7], jlptsensei: { N4: [101] } } },
  { id: 'toka', pola: '～とか', varian: ['～とか～とか'], romaji: 'toka', arti: 'misalnya … atau … (contoh)', kataKunci: ['misalnya', 'seperti', 'atau', 'contoh'], tingkat: 'N4', sumber: { minnaBab: [30], modulN4: [54], jlptsensei: { N4: [115] } } },
  { id: 'te-aru', pola: '～てあります', varian: ['～てある'], romaji: 'te arimasu', arti: 'sudah di-… (keadaan, disengaja)', kataKunci: ['sudah', 'keadaan', 'disiapkan', 'tertulis'], tingkat: 'N4', sumber: { minnaBab: [30], modulN4: [], jlptsensei: { N5: [69] } } },
  // Bab 31
  { id: 'you-to-omou', pola: '～（よ）うと思{おも}っています', varian: ['～（よ）うと思{おも}う'], romaji: 'you to omotte imasu', arti: 'bermaksud / berniat …', kataKunci: ['bermaksud', 'berniat', 'rencana', 'ingin'], tingkat: 'N4', sumber: { minnaBab: [31], modulN4: [1], jlptsensei: { N4: [129] } } },
  { id: 'tsumori', pola: '～つもりです', varian: ['～つもりだ'], romaji: 'tsumori desu', arti: 'berniat / berencana …', kataKunci: ['berniat', 'berencana', 'rencana', 'niat'], tingkat: 'N4', sumber: { minnaBab: [31], modulN4: [3], jlptsensei: { N5: [78] } } },
  { id: 'mada-te-imasen', pola: 'まだ～ていません', varian: ['まだ～ていない'], romaji: 'mada te imasen', arti: 'belum …', kataKunci: ['belum', 'masih belum'], tingkat: 'N4', sumber: { minnaBab: [31], modulN4: [39], jlptsensei: { N5: [28] } } },
  { id: 'ikoukei', pola: 'V-（よ）う（意向形{いこうけい}）', varian: ['～おう', '～よう'], romaji: 'ikoukei', arti: 'bentuk maksud: ayo … (gaya akrab)', kataKunci: ['ayo', 'ajakan', 'bentuk maksud'], tingkat: 'N4', sumber: { minnaBab: [31], modulN4: [], jlptsensei: { N4: [22] } } },
  { id: 'yotei', pola: '～予定{よてい}です', romaji: 'yotei desu', arti: 'rencananya … / dijadwalkan …', kataKunci: ['rencana', 'jadwal', 'dijadwalkan'], tingkat: 'N4', sumber: { minnaBab: [31], modulN4: [], jlptsensei: { N4: [124] } } },
  // Bab 32
  { id: 'kamoshirenai', pola: '～かもしれません', varian: ['～かもしれない'], romaji: 'kamo shiremasen', arti: 'mungkin … / bisa jadi …', kataKunci: ['mungkin', 'bisa jadi', 'kemungkinan'], tingkat: 'N4', sumber: { minnaBab: [32], modulN4: [24], jlptsensei: { N4: [29] } } },
  { id: 'deshou', pola: '～でしょう', varian: ['～だろう'], romaji: 'deshou', arti: 'mungkin … / barangkali … (dugaan)', kataKunci: ['mungkin', 'barangkali', 'dugaan', 'perkiraan'], tingkat: 'N4', sumber: { minnaBab: [32], modulN4: [27], jlptsensei: { N5: [4] } } },
  { id: 'hou-ga-ii', pola: '～ほうがいいです', varian: ['～たほうがいい', '～ないほうがいい'], romaji: 'hou ga ii desu', arti: 'sebaiknya … / lebih baik …', kataKunci: ['sebaiknya', 'lebih baik', 'saran', 'nasihat'], tingkat: 'N4', sumber: { minnaBab: [32], modulN4: [99], jlptsensei: { N5: [15] } } },
  // Bab 33
  { id: 'kinshikei', pola: 'V-るな（禁止形{きんしけい}）', romaji: 'na', arti: 'jangan …! (larangan keras)', kataKunci: ['jangan', 'larangan', 'dilarang'], tingkat: 'N4', sumber: { minnaBab: [33], modulN4: [23], jlptsensei: { N4: [48] } } },
  { id: 'meireikei', pola: 'V-え／V-ろ（命令形{めいれいけい}）', varian: ['～しろ', '～こい'], romaji: 'meireikei', arti: 'bentuk perintah (…lah!)', kataKunci: ['perintah', 'menyuruh', 'bentuk perintah'], tingkat: 'N4', sumber: { minnaBab: [33], modulN4: [50] } },
  { id: 'to-iu-imi', pola: '～という意味{いみ}です', varian: ['～と書{か}いてあります', '～と読{よ}みます'], romaji: 'to iu imi desu', arti: 'artinya … / tertulis …', kataKunci: ['artinya', 'arti', 'tertulis', 'dibaca'], tingkat: 'N4', sumber: { minnaBab: [33], modulN4: [] } },
  { id: 'to-itte-imashita', pola: '～と言{い}っていました', varian: ['～と伝{つた}えていただけませんか'], romaji: 'to itte imashita', arti: 'katanya … / tolong sampaikan …', kataKunci: ['katanya', 'pesan', 'menyampaikan', 'titip pesan'], tingkat: 'N4', sumber: { minnaBab: [33], modulN4: [] } },
  // Bab 34
  { id: 'toori-ni', pola: '～とおりに', romaji: 'toori ni', arti: 'sesuai dengan … / seperti …', kataKunci: ['sesuai', 'seperti', 'mengikuti'], tingkat: 'N4', sumber: { minnaBab: [34], modulN4: [] } },
  { id: 'ato-de', pola: '～あとで', varian: ['～後{あと}で'], romaji: 'ato de', arti: 'setelah …', kataKunci: ['setelah', 'sesudah', 'nanti'], tingkat: 'N4', sumber: { minnaBab: [34], modulN4: [], jlptsensei: { N4: [4] } } },
  { id: 'naide', pola: '～ないで、～', romaji: 'naide', arti: 'tanpa … / tidak …, melainkan …', kataKunci: ['tanpa', 'tidak', 'melainkan', 'alih-alih'], tingkat: 'N4', sumber: { minnaBab: [34], modulN4: [], jlptsensei: { N5: [38] } } },
  // Bab 35
  { id: 'ba', pola: '～ば', varian: ['～ければ', '～なければ'], romaji: 'ba', arti: 'jika … (syarat)', kataKunci: ['jika', 'kalau', 'asalkan'], tingkat: 'N4', sumber: { minnaBab: [35], modulN4: [12], jlptsensei: { N4: [5] } } },
  { id: 'nara', pola: '～なら', romaji: 'nara', arti: 'kalau (soal) …', kataKunci: ['kalau soal', 'kalau'], tingkat: 'N4', sumber: { minnaBab: [35], modulN4: [14, 15], jlptsensei: { N4: [54] } } },
  // Bab 36
  { id: 'you-ni-naru', pola: '～ようになります', varian: ['～ようになる'], romaji: 'you ni narimasu', arti: 'menjadi bisa / mulai terbiasa …', kataKunci: ['menjadi bisa', 'terbiasa', 'perubahan'], tingkat: 'N4', sumber: { minnaBab: [36], modulN4: [35], jlptsensei: { N4: [127] } } },
  { id: 'you-ni', pola: '～ように、～', romaji: 'you ni', arti: 'supaya … / agar …', kataKunci: ['supaya', 'agar', 'tujuan'], tingkat: 'N4', sumber: { minnaBab: [36], modulN4: [] } },
  { id: 'you-ni-suru', pola: '～ようにしています', varian: ['～ようにしてください', '～ようにする'], romaji: 'you ni shite imasu', arti: 'berusaha (membiasakan) …', kataKunci: ['berusaha', 'membiasakan', 'usahakan'], tingkat: 'N4', sumber: { minnaBab: [36], modulN4: [], jlptsensei: { N4: [128] } } },
  // Bab 37
  { id: 'ukemi', pola: '～（ら）れます（受身{うけみ}）', varian: ['～れる', '～られる'], romaji: 'ukemi', arti: 'kalimat pasif (di-…)', kataKunci: ['pasif', 'di-', 'kena', 'ukemi'], tingkat: 'N4', sumber: { minnaBab: [37], modulN4: [56, 57, 58], jlptsensei: { N4: [119] } } },
  // Bab 38
  { id: 'no-meishika', pola: '～のは／～のが／～のを', varian: ['～のは～です'], romaji: 'no', arti: 'membendakan kata kerja (の)', kataKunci: ['pembendaan', 'suka', 'lupa', 'yang'], tingkat: 'N4', sumber: { minnaBab: [38], modulN4: [102], jlptsensei: { N5: [54, 55, 56], N4: [64] } } },
  // Bab 39
  { id: 'node', pola: '～ので', romaji: 'node', arti: 'karena … (halus, objektif)', kataKunci: ['karena', 'sebab', 'alasan'], tingkat: 'N4', sumber: { minnaBab: [39], modulN4: [51], jlptsensei: { N5: [58] } } },
  { id: 'te-riyuu', pola: '～て、～（理由{りゆう}）', varian: ['～なくて、～', '～くて、～'], romaji: 'te', arti: 'karena … (sebab, bentuk て)', kataKunci: ['karena', 'sebab', 'perasaan'], tingkat: 'N4', sumber: { minnaBab: [39], modulN4: [], jlptsensei: { N4: [91] } } },
  // Bab 40
  { id: 'te-miru', pola: '～てみます', varian: ['～てみる'], romaji: 'te mimasu', arti: 'mencoba …', kataKunci: ['mencoba', 'coba'], tingkat: 'N4', sumber: { minnaBab: [40], modulN4: [8], jlptsensei: { N4: [99] } } },
  { id: 'ka-dou-ka', pola: '～かどうか', romaji: 'ka dou ka', arti: 'apakah … atau tidak', kataKunci: ['apakah', 'atau tidak'], tingkat: 'N4', sumber: { minnaBab: [40], modulN4: [31], jlptsensei: { N4: [26] } } },
  { id: 'gimonshi-ka', pola: '［疑問詞{ぎもんし}］～か、～', romaji: 'ka', arti: 'kalimat tanya di dalam kalimat', kataKunci: ['kata tanya', 'apa', 'siapa', 'kapan', 'tanya tersirat'], tingkat: 'N4', sumber: { minnaBab: [40], modulN4: [32] } },
  // Bab 41
  { id: 'te-kudasaru', pola: '～てくださいます', varian: ['くださいます', '～てくださる'], romaji: 'te kudasaimasu', arti: '(atasan) melakukan … untuk saya', kataKunci: ['atasan', 'memberi', 'sopan', 'untuk saya'], tingkat: 'N4', sumber: { minnaBab: [41], modulN4: [66] } },
  { id: 'te-itadaku', pola: '～ていただきます', varian: ['いただきます', '～ていただく'], romaji: 'te itadakimasu', arti: 'menerima (bantuan) dari atasan', kataKunci: ['menerima', 'atasan', 'sopan', 'dibantu'], tingkat: 'N4', sumber: { minnaBab: [41], modulN4: [67] } },
  { id: 'te-yaru', pola: '～てやります', varian: ['やります', '～てやる'], romaji: 'te yarimasu', arti: 'memberi … ke bawahan / hewan / tanaman', kataKunci: ['memberi', 'hewan', 'tanaman', 'adik', 'bawahan'], tingkat: 'N4', sumber: { minnaBab: [41], modulN4: [68], jlptsensei: { N4: [104] } } },
  // Bab 42
  { id: 'tame-ni', pola: '～ために', varian: ['Nのために'], romaji: 'tame ni', arti: 'demi … / untuk (tujuan) …', kataKunci: ['demi', 'untuk', 'tujuan'], tingkat: 'N4', sumber: { minnaBab: [42], modulN4: [4] } },
  { id: 'noni-youto', pola: '～のに（用途{ようと}）', varian: ['～のに～かかります', '～のに使{つか}います'], romaji: 'noni', arti: 'untuk (keperluan) …', kataKunci: ['untuk', 'keperluan', 'kegunaan', 'dibutuhkan'], tingkat: 'N4', sumber: { minnaBab: [42], modulN4: [], jlptsensei: { N4: [63] } } },
  // Bab 43
  { id: 'sou-youtai', pola: '～そうです（様態{ようたい}）', varian: ['～そうな', '～そうに', '～そうだ'], romaji: 'sou desu', arti: 'kelihatannya … (dari penampilan)', kataKunci: ['kelihatannya', 'tampaknya', 'sepertinya', 'hampir'], tingkat: 'N4', sumber: { minnaBab: [43], modulN4: [25], jlptsensei: { N4: [82, 83] } } },
  { id: 'te-kimasu', pola: '～て来{き}ます', varian: ['～てきます'], romaji: 'te kimasu', arti: 'pergi … lalu kembali', kataKunci: ['pergi sebentar', 'lalu kembali'], tingkat: 'N4', sumber: { minnaBab: [43], modulN4: [] } },
  // Bab 44
  { id: 'ni-suru', pola: 'Nにします', varian: ['Nにする'], romaji: 'ni shimasu', arti: 'memilih / memutuskan (N)', kataKunci: ['memilih', 'memutuskan', 'pesan'], tingkat: 'N4', sumber: { minnaBab: [44], modulN4: [49], jlptsensei: { N5: [50] } } },
  { id: 'yasui-nikui', pola: '～やすいです／～にくいです', varian: ['～やすい', '～にくい'], romaji: 'yasui, nikui', arti: 'mudah … / sulit …', kataKunci: ['mudah', 'sulit', 'gampang', 'susah', 'cenderung'], tingkat: 'N4', sumber: { minnaBab: [44], modulN4: [90, 91, 92], jlptsensei: { N4: [60, 121] } } },
  { id: 'sugiru', pola: '～すぎます', varian: ['～すぎる'], romaji: 'sugimasu', arti: 'terlalu …', kataKunci: ['terlalu', 'kebanyakan'], tingkat: 'N4', sumber: { minnaBab: [44], modulN4: [93], jlptsensei: { N5: [65] } } },
  { id: 'ku-suru', pola: 'イA-くします／ナA-にします', romaji: 'ku shimasu, ni shimasu', arti: 'membuat jadi …', kataKunci: ['membuat', 'mengubah', 'menjadikan'], tingkat: 'N4', sumber: { minnaBab: [44], modulN4: [], jlptsensei: { N4: [39, 59] } } },
  // Bab 45
  { id: 'noni', pola: '～のに、～', romaji: 'noni', arti: 'padahal …', kataKunci: ['padahal', 'meskipun', 'sayangnya'], tingkat: 'N4', sumber: { minnaBab: [45], modulN4: [52], jlptsensei: { N4: [62] } } },
  { id: 'baai', pola: '～場合{ばあい}は、～', romaji: 'baai wa', arti: 'jika (terjadi) … / dalam hal …', kataKunci: ['jika terjadi', 'dalam hal', 'kalau', 'darurat'], tingkat: 'N4', sumber: { minnaBab: [45], modulN4: [], jlptsensei: { N4: [6] } } },
  // Bab 46
  { id: 'hazu', pola: '～はずです', varian: ['～はずだ'], romaji: 'hazu desu', arti: 'seharusnya … / mestinya …', kataKunci: ['seharusnya', 'mestinya', 'pasti'], tingkat: 'N4', sumber: { minnaBab: [46], modulN4: [28], jlptsensei: { N4: [19] } } },
  { id: 'tokoro', pola: '～ところです', varian: ['～ているところです', '～たところです'], romaji: 'tokoro desu', arti: 'baru akan / sedang / baru saja …', kataKunci: ['baru akan', 'sedang', 'baru saja'], tingkat: 'N4', sumber: { minnaBab: [46], modulN4: [42, 43, 44], jlptsensei: { N4: [85, 106, 116] } } },
  { id: 'ta-bakari', pola: '～たばかりです', romaji: 'ta bakari desu', arti: 'baru saja … (terasa belum lama)', kataKunci: ['baru saja', 'belum lama'], tingkat: 'N4', sumber: { minnaBab: [46], modulN4: [], jlptsensei: { N4: [84] } } },
  // Bab 47
  { id: 'sou-denbun', pola: '～そうです（伝聞{でんぶん}）', romaji: 'sou desu', arti: 'katanya … / kabarnya …', kataKunci: ['katanya', 'kabarnya', 'dengar-dengar', 'berita'], tingkat: 'N4', sumber: { minnaBab: [47], modulN4: [], jlptsensei: { N4: [81] } } },
  { id: 'you-desu', pola: '～ようです', varian: ['～ようだ'], romaji: 'you desu', arti: 'tampaknya … (dari keadaan)', kataKunci: ['tampaknya', 'sepertinya', 'kelihatannya'], tingkat: 'N4', sumber: { minnaBab: [47], modulN4: [], jlptsensei: { N4: [125] } } },
  // Bab 48
  { id: 'shieki', pola: '～（さ）せます', varian: ['～せる', '～させる'], romaji: 'shieki', arti: 'menyuruh / membiarkan … (kausatif)', kataKunci: ['menyuruh', 'membiarkan', 'kausatif', 'membuat'], tingkat: 'N4', sumber: { minnaBab: [48], modulN4: [59, 60], jlptsensei: { N4: [74] } } },
  { id: 'sasete-kudasai', pola: '～（さ）せていただけませんか', varian: ['～（さ）せてください'], romaji: 'sasete itadakemasen ka', arti: 'izinkan saya … / bolehkah saya …', kataKunci: ['izin', 'izinkan', 'bolehkah', 'minta izin'], tingkat: 'N4', sumber: { minnaBab: [48], modulN4: [61], jlptsensei: { N4: [75] } } },
  // Bab 49
  { id: 'o-ni-naru', pola: 'お～になります', varian: ['ご～になります', 'お～になる'], romaji: 'o ni narimasu', arti: 'bentuk hormat (sonkeigo)', kataKunci: ['hormat', 'sopan', 'keigo', 'sonkeigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [69], jlptsensei: { N4: [66] } } },
  { id: 'o-kudasai', pola: 'お～ください', varian: ['ご～ください', 'お～くださる'], romaji: 'o kudasai', arti: 'silakan … (sangat sopan)', kataKunci: ['silakan', 'mohon', 'sopan', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [70], jlptsensei: { N4: [65] } } },
  { id: 'sonkeigo-irassharu', pola: 'いらっしゃいます', varian: ['いらっしゃる', '～ていらっしゃる'], romaji: 'irasshaimasu', arti: 'ada / datang / pergi (hormat)', kataKunci: ['datang', 'pergi', 'ada', 'hormat', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [74], jlptsensei: { N4: [23] } } },
  { id: 'sonkeigo-ossharu', pola: 'おっしゃいます', varian: ['おっしゃる'], romaji: 'osshaimasu', arti: 'berkata (hormat)', kataKunci: ['berkata', 'bilang', 'hormat', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [75] } },
  { id: 'sonkeigo-goran-ni-naru', pola: 'ごらんになります', varian: ['ごらんください', 'ごらんになる'], romaji: 'goran ni narimasu', arti: 'melihat (hormat)', kataKunci: ['melihat', 'hormat', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [76] } },
  { id: 'sonkeigo-gozonji', pola: 'ごぞんじです', varian: ['ご存{ぞん}じです'], romaji: 'gozonji desu', arti: 'tahu / kenal (hormat)', kataKunci: ['tahu', 'kenal', 'hormat', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [77] } },
  { id: 'sonkeigo-meshiagaru', pola: 'めしあがります', varian: ['召{め}し上{あ}がります', 'めしあがる'], romaji: 'meshiagarimasu', arti: 'makan / minum (hormat)', kataKunci: ['makan', 'minum', 'hormat', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [78] } },
  { id: 'sonkeigo-nasaru', pola: 'なさいます', varian: ['なさる'], romaji: 'nasaimasu', arti: 'melakukan (hormat)', kataKunci: ['melakukan', 'hormat', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [79], jlptsensei: { N4: [56] } } },
  { id: 'sonkei-rareru', pola: '～（ら）れます（尊敬{そんけい}）', romaji: 'reru, rareru', arti: 'bentuk hormat dengan ～れる／～られる', kataKunci: ['hormat', 'keigo', 'sonkeigo'], tingkat: 'N4', sumber: { minnaBab: [49], modulN4: [80] } },
  // Bab 50
  { id: 'o-suru', pola: 'お～します', varian: ['ご～します', 'お～いたします', 'お～する'], romaji: 'o shimasu', arti: 'bentuk merendahkan diri (kenjougo)', kataKunci: ['merendah', 'sopan', 'keigo', 'kenjougo'], tingkat: 'N4', sumber: { minnaBab: [50], modulN4: [71, 72] } },
  { id: 'kenjougo-itasu', pola: 'いたします', varian: ['いたす'], romaji: 'itashimasu', arti: 'melakukan (merendah)', kataKunci: ['melakukan', 'merendah', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [50], modulN4: [81], jlptsensei: { N4: [24] } } },
  { id: 'kenjougo-ukagau', pola: 'うかがいます', varian: ['伺{うかが}います', 'うかがう'], romaji: 'ukagaimasu', arti: 'berkunjung / bertanya (merendah)', kataKunci: ['berkunjung', 'bertanya', 'mendengar', 'merendah', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [50], modulN4: [82] } },
  { id: 'kenjougo-oru', pola: 'おります', varian: ['～ております', 'おる'], romaji: 'orimasu', arti: 'ada / sedang … (merendah)', kataKunci: ['ada', 'sedang', 'merendah', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [50], modulN4: [83] } },
  { id: 'kenjougo-zonjiru', pola: 'ぞんじます', varian: ['ぞんじております', 'ぞんじません', '存{ぞん}じます'], romaji: 'zonjimasu', arti: 'tahu / berpikir (merendah)', kataKunci: ['tahu', 'kenal', 'merendah', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [50], modulN4: [84] } },
  { id: 'kenjougo-haiken-suru', pola: 'はいけんします', varian: ['拝見{はいけん}します', 'はいけんする'], romaji: 'haiken shimasu', arti: 'melihat / membaca (merendah)', kataKunci: ['melihat', 'membaca', 'merendah', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [50], modulN4: [85] } },
  { id: 'kenjougo-mairu', pola: 'まいります', varian: ['参{まい}ります', 'まいる'], romaji: 'mairimasu', arti: 'datang / pergi (merendah)', kataKunci: ['datang', 'pergi', 'merendah', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [50], modulN4: [86] } },
  { id: 'kenjougo-mousu', pola: '～と申{もう}します', varian: ['もうします', 'もうす'], romaji: 'to moushimasu', arti: 'nama saya … / berkata (merendah)', kataKunci: ['nama saya', 'perkenalan', 'merendah', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [50], modulN4: [88] } },

  // ── Only in the 111 Bunpo N4 module (N4) ──
  { id: 'you-to-suru', pola: '～（よ）うとする', varian: ['～（よ）うとしたとき'], romaji: 'you to suru', arti: 'baru mau … / hendak …', kataKunci: ['baru mau', 'hendak', 'mencoba'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [2] } },
  { id: 'koto-ni-suru', pola: '～ことにする', varian: ['～ことにしました'], romaji: 'koto ni suru', arti: 'memutuskan untuk …', kataKunci: ['memutuskan', 'keputusan'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [5], jlptsensei: { N4: [38] } } },
  { id: 'koto-ni-naru', pola: '～ことになる', varian: ['～ことになりました'], romaji: 'koto ni naru', arti: 'diputuskan (pihak lain) bahwa …', kataKunci: ['diputuskan', 'ditetapkan', 'keputusan'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [6], jlptsensei: { N4: [37] } } },
  { id: 'te-hoshii', pola: '～てほしい', romaji: 'te hoshii', arti: 'ingin orang lain …', kataKunci: ['ingin', 'berharap', 'orang lain'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [9], jlptsensei: { N4: [93] } } },
  { id: 'gimonshi-demo', pola: '［疑問詞{ぎもんし}］＋でも', varian: ['だれでも', 'どこでも', 'いつでも', 'なんでも'], romaji: 'demo', arti: 'siapa pun / di mana pun / kapan pun', kataKunci: ['siapa pun', 'apa pun', 'kapan pun', 'di mana pun'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [17] } },
  { id: 'mitai', pola: '～みたいだ', varian: ['～みたいな', '～みたいに'], romaji: 'mitai da', arti: 'sepertinya … / mirip …', kataKunci: ['sepertinya', 'seperti', 'mirip'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [29], jlptsensei: { N4: [44, 45, 46] } } },
  { id: 'rashii', pola: '～らしい', romaji: 'rashii', arti: 'sepertinya … / katanya …', kataKunci: ['sepertinya', 'katanya', 'kabarnya'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [30], jlptsensei: { N4: [70] } } },
  { id: 'te-iku', pola: '～ていく', romaji: 'te iku', arti: 'akan terus … (ke depan)', kataKunci: ['terus', 'ke depan', 'semakin'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [36], jlptsensei: { N4: [94] } } },
  { id: 'te-kuru', pola: '～てくる', romaji: 'te kuru', arti: 'mulai … / makin … (sampai kini)', kataKunci: ['mulai', 'semakin', 'sampai sekarang'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [37], jlptsensei: { N4: [98] } } },
  { id: 'te-bakari-iru', pola: '～てばかりいる', romaji: 'te bakari iru', arti: 'kerjanya … melulu', kataKunci: ['melulu', 'terus-terusan', 'hanya'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [38] } },
  { id: 'mama', pola: '～まま', varian: ['～たまま', '～ないまま'], romaji: 'mama', arti: 'dalam keadaan … (dibiarkan)', kataKunci: ['dibiarkan', 'tetap', 'keadaan'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [46], jlptsensei: { N4: [42] } } },
  { id: 'ga-suru', pola: 'Nがする', varian: ['音{おと}がする', 'においがする', '味{あじ}がする'], romaji: 'ga suru', arti: 'terdengar / tercium / terasa', kataKunci: ['terdengar', 'tercium', 'terasa', 'bau', 'suara'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [48], jlptsensei: { N4: [14] } } },
  { id: 'te-sashiageru', pola: '～てさしあげる', varian: ['さしあげる'], romaji: 'te sashiageru', arti: 'memberi / melakukan … untuk atasan', kataKunci: ['memberi', 'atasan', 'sopan', 'merendah'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [65] } },
  { id: 'o-itadaku', pola: 'お～いただく', varian: ['ご～いただく', 'お～いただけませんか'], romaji: 'o itadaku', arti: 'menerima kebaikan dari atasan', kataKunci: ['menerima', 'atasan', 'keigo', 'sopan'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [73] } },
  { id: 'kenjougo-moushiageru', pola: 'もうしあげる', varian: ['申{もう}し上{あ}げます'], romaji: 'moushiageru', arti: 'menyampaikan / mengucapkan (merendah)', kataKunci: ['menyampaikan', 'mengucapkan', 'merendah', 'keigo'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [87] } },
  { id: 'de-gozaimasu', pola: '～でございます', varian: ['ございます'], romaji: 'de gozaimasu', arti: 'adalah (sangat sopan)', kataKunci: ['adalah', 'sangat sopan', 'keigo', 'ada'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [89], jlptsensei: { N4: [10, 17] } } },
  { id: 'bakari', pola: 'Nばかり', romaji: 'bakari', arti: 'hanya … saja / melulu …', kataKunci: ['hanya', 'melulu', 'saja'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [95], jlptsensei: { N4: [7] } } },
  { id: 'suushi-mo', pola: '数詞{すうし}＋も', romaji: 'mo', arti: 'sampai … (jumlah yang banyak)', kataKunci: ['sampai', 'sebanyak', 'jumlah'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [96], jlptsensei: { N4: [47] } } },
  { id: 'sa', pola: '～さ', varian: ['大{おお}きさ', '高{たか}さ'], romaji: 'sa', arti: 'kata sifat jadi kata benda (-nya)', kataKunci: ['ukuran', 'tingkat', 'pembendaan', 'kata sifat'], tingkat: 'N4', sumber: { minnaBab: [], modulN4: [101], jlptsensei: { N4: [71] } } },
];
