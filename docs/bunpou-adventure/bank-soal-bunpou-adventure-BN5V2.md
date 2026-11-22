# Bank Soal Bunpou Adventure — N5 Vol 2 (BN5V2) · Bab 5-9

Status: draf (belum lolos gate mekanis / peninjau buta)

## Bab 5 — ［場所］へ行きます (`e-ikimasu`)

```js
export const draf_e_ikimasu = [
  {
    id: 'N5-e-ikimasu-1',
    pola: 'e-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きのう どこ へ 行{い}き ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['デパート', 'へ', '行{い}き', 'ました'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Kemarin pergi ke mana? B: Saya pergi ke departemen store.',
    pembahasan: 'Partikel へ menunjukkan arah/tujuan pergerakan, diikuti kata kerja 行{い}きます/来{き}ます/帰{かえ}ります.',
    status: 'draf',
  },
  {
    id: 'N5-e-ikimasu-2',
    pola: 'e-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'にちようび どこ へ 行{い}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['きょうと', 'へ', '行{い}き', 'ます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Hari Minggu mau pergi ke mana? B: Saya mau pergi ke Kyoto.',
    pembahasan: 'へ行{い}きます bisa berarti rencana/akan pergi bila konteksnya masa depan.',
    status: 'draf',
  },
  {
    id: 'N5-e-ikimasu-3',
    pola: 'e-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '毎日{まいにち} 何時{なんじ} に うち へ 帰{かえ}り ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['6時{じ}に', 'うち', 'へ', '帰{かえ}ります'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Setiap hari pulang ke rumah jam berapa? B: Saya pulang ke rumah jam 6.',
    pembahasan: 'へ juga dipakai dengan 帰{かえ}ります untuk menyatakan arah pulang.',
    status: 'draf',
  },
  {
    id: 'N5-e-ikimasu-4',
    pola: 'e-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '先週{せんしゅう} どこ へ 行{い}き ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['どこ', 'へも', '行{い}き', 'ませんでした'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Minggu lalu pergi ke mana? B: Saya tidak pergi ke mana-mana.',
    pembahasan: 'どこへも + negatif berarti "tidak ke mana-mana"; も memperkuat negasi.',
    status: 'draf',
  },
];
```

## Bab 5 — ［道具・手段］でVます (`de-shudan`)

```js
export const draf_de_shudan = [
  {
    id: 'N5-de-shudan-1',
    pola: 'de-shudan',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '何{なに} で とうきょう へ 行{い}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['しんかんせん', 'で', '行{い}き', 'ます'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Naik apa ke Tokyo? B: Saya naik shinkansen.',
    pembahasan: 'Partikel で menunjukkan alat/sarana transportasi yang dipakai.',
    status: 'draf',
  },
  {
    id: 'N5-de-shudan-2',
    pola: 'de-shudan',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '日本語{にほんご} で レポート を 書{か}き ます か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['英語{えいご}', 'で', '書{か}き', 'ます'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Apakah menulis laporan dalam bahasa Jepang? B: Tidak, menulis dalam bahasa Inggris.',
    pembahasan: 'で juga menunjukkan bahasa/cara yang dipakai untuk melakukan sesuatu.',
    status: 'draf',
  },
  {
    id: 'N5-de-shudan-3',
    pola: 'de-shudan',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '何{なに} で ごはん を 食{た}べ ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['はし', 'で', '食{た}べ', 'ます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Makan pakai apa? B: Makan pakai sumpit.',
    pembahasan: 'で menunjukkan alat yang digunakan untuk suatu kegiatan.',
    status: 'draf',
  },
  {
    id: 'N5-de-shudan-4',
    pola: 'de-shudan',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '会社{かいしゃ} へ 何{なに} で 来{き} ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['バス', 'で', '来{き}', 'ます'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Ke kantor naik apa? B: Saya naik bus.',
    pembahasan: 'で dipakai sebelum kata kerja pergerakan untuk menyatakan moda transportasi.',
    status: 'draf',
  },
];
```

## Bab 5 — ［人］と行きます (`to-ikimasu`)

```js
export const draf_to_ikimasu = [
  {
    id: 'N5-to-ikimasu-1',
    pola: 'to-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'だれ と きょうと へ 行{い}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['友達{ともだち}', 'と', '行{い}き', 'ます'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Pergi ke Kyoto dengan siapa? B: Saya pergi dengan teman.',
    pembahasan: 'Partikel と menunjukkan orang yang menemani melakukan suatu kegiatan.',
    status: 'draf',
  },
  {
    id: 'N5-to-ikimasu-2',
    pola: 'to-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きのう だれ と 映画{えいが} を 見{み} ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['家族{かぞく}', 'と', '見{み}', 'ました'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Kemarin nonton film dengan siapa? B: Saya nonton dengan keluarga.',
    pembahasan: 'と dipakai untuk menyatakan "bersama siapa" dalam kegiatan apa pun.',
    status: 'draf',
  },
  {
    id: 'N5-to-ikimasu-3',
    pola: 'to-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'にちようび だれ と スーパー へ 行{い}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['一人{ひとり}', 'で', '行{い}き', 'ます'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Hari Minggu pergi ke supermarket dengan siapa? B: Saya pergi sendiri.',
    pembahasan: '一人{ひとり}で berarti "sendiri", dipakai sebagai kebalikan dari [人{ひと}]と.',
    status: 'draf',
  },
  {
    id: 'N5-to-ikimasu-4',
    pola: 'to-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'だれ と 昼{ひる}ごはん を 食{た}べ ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['やまださん', 'と', '食{た}べ', 'ました'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Makan siang dengan siapa? B: Saya makan dengan Pak Yamada.',
    pembahasan: 'と diletakkan setelah nama orang untuk menyatakan teman melakukan kegiatan.',
    status: 'draf',
  },
];
```

## Bab 6 — NをVます (`wo`)

```js
export const draf_wo = [
  {
    id: 'N5-wo-1',
    pola: 'wo',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '毎朝{まいあさ} 何{なに} を 飲{の}み ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['コーヒー', 'を', '飲{の}み', 'ます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Setiap pagi minum apa? B: Saya minum kopi.',
    pembahasan: 'Partikel を menandai objek langsung dari kata kerja transitif.',
    status: 'draf',
  },
  {
    id: 'N5-wo-2',
    pola: 'wo',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きのう 何{なに} を 買{か}い ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['本{ほん}', 'を', '買{か}い', 'ました'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Kemarin beli apa? B: Saya beli buku.',
    pembahasan: 'を diletakkan setelah kata benda yang menjadi objek dari kata kerja.',
    status: 'draf',
  },
  {
    id: 'N5-wo-3',
    pola: 'wo',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '今晩{こんばん} 何{なに} を 食{た}べ ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['すし', 'を', '食{た}べ', 'ます'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Malam ini makan apa? B: Saya makan sushi.',
    pembahasan: 'を menghubungkan makanan (objek) dengan kata kerja 食{た}べます.',
    status: 'draf',
  },
  {
    id: 'N5-wo-4',
    pola: 'wo',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'にちようび 何{なに} を し ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['テニス', 'を', 'し', 'ます'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Hari Minggu mau ngapain? B: Saya bermain tenis.',
    pembahasan: '[Olahraga]をします berarti "bermain/melakukan olahraga tersebut".',
    status: 'draf',
  },
];
```

## Bab 6 — ［場所］でVます (`de-basho`)

```js
export const draf_de_basho = [
  {
    id: 'N5-de-basho-1',
    pola: 'de-basho',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'どこ で 昼{ひる}ごはん を 食{た}べ ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['食堂{しょくどう}', 'で', '食{た}べ', 'ます'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Makan siang di mana? B: Saya makan di kantin.',
    pembahasan: 'Partikel で menunjukkan tempat berlangsungnya suatu kegiatan.',
    status: 'draf',
  },
  {
    id: 'N5-de-basho-2',
    pola: 'de-basho',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きのう どこ で 本{ほん} を 買{か}い ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['駅{えき}', 'で', '買{か}い', 'ました'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Kemarin beli buku di mana? B: Saya beli di stasiun.',
    pembahasan: 'で menunjukkan lokasi di mana kegiatan (membeli) dilakukan.',
    status: 'draf',
  },
  {
    id: 'N5-de-basho-3',
    pola: 'de-basho',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '毎日{まいにち} どこ で 勉強{べんきょう} し ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['図書館{としょかん}', 'で', '勉強{べんきょう}', 'します'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Setiap hari belajar di mana? B: Saya belajar di perpustakaan.',
    pembahasan: 'で dipakai untuk tempat kegiatan, berbeda dengan に untuk keberadaan.',
    status: 'draf',
  },
  {
    id: 'N5-de-basho-4',
    pola: 'de-basho',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'どこ で サッカー を し ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['公園{こうえん}', 'で', 'し', 'ます'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Main sepak bola di mana? B: Saya main di taman.',
    pembahasan: 'で diletakkan setelah nama tempat, sebelum kata kerja kegiatan.',
    status: 'draf',
  },
];
```

## Bab 6 — ～ませんか (`masen-ka`)

```js
export const draf_masen_ka = [
  {
    id: 'N5-masen-ka-1',
    pola: 'masen-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '一緒{いっしょ}に ', sesudah: '。' },
      { pembicara: 'B', teks: 'ええ、 いい です ね。' },
    ],
    potongan: ['映画{えいが}を', '見{み}', 'ません', 'か'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Mau nonton film bareng? B: Ya, boleh juga.',
    pembahasan: '～ませんか adalah bentuk ajakan sopan, mengundang lawan bicara untuk ikut.',
    status: 'draf',
  },
  {
    id: 'N5-masen-ka-2',
    pola: 'masen-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: 'にちようび ', sesudah: '。' },
      { pembicara: 'B', teks: 'すみません、 にちようび は ちょっと……。' },
    ],
    potongan: ['テニスを', 'し', 'ません', 'か'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Hari Minggu mau main tenis? B: Maaf, hari Minggu agak…',
    pembahasan: 'Jawaban "ちょっと…" adalah penolakan halus dalam bahasa Jepang.',
    status: 'draf',
  },
  {
    id: 'N5-masen-ka-3',
    pola: 'masen-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '一緒{いっしょ}に ', sesudah: '。' },
      { pembicara: 'B', teks: 'ええ、 行{い}き ましょう。' },
    ],
    potongan: ['デパートへ', '行{い}き', 'ません', 'か'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Mau pergi ke departemen store bareng? B: Ya, ayo pergi.',
    pembahasan: 'Jawaban positif untuk ～ませんか bisa dengan ～ましょう (ayo).',
    status: 'draf',
  },
  {
    id: 'N5-masen-ka-4',
    pola: 'masen-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '今晩{こんばん} 一緒{いっしょ}に ', sesudah: '。' },
      { pembicara: 'B', teks: 'いい です ね。 どこ で 食{た}べ ます か。' },
    ],
    potongan: ['晩{ばん}ごはんを', '食{た}べ', 'ません', 'か'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Malam ini mau makan malam bareng? B: Boleh juga. Makan di mana?',
    pembahasan: '～ませんか dipakai untuk mengajak makan bersama dengan sopan.',
    status: 'draf',
  },
];
```

## Bab 6 — ～ましょう (`mashou`)

```js
export const draf_mashou = [
  {
    id: 'N5-mashou-1',
    pola: 'mashou',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ちょっと 休{やす}み ましょう。' },
      { pembicara: 'B', sebelum: 'ええ、', sesudah: '。' },
    ],
    potongan: ['休{やす}み', 'ま', 'しょ', 'う'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Istirahat sebentar yuk. B: Ya, ayo istirahat.',
    pembahasan: '～ましょう dipakai untuk mengajak atau menyetujui ajakan.',
    status: 'draf',
  },
  {
    id: 'N5-mashou-2',
    pola: 'mashou',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '何{なに} を 飲{の}み ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['コーヒー', 'を', '飲{の}み', 'ましょう'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Mau minum apa? B: Ayo minum kopi.',
    pembahasan: '～ましょう juga dipakai untuk menyarankan kegiatan bersama.',
    status: 'draf',
  },
  {
    id: 'N5-mashou-3',
    pola: 'mashou',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '昼{ひる}ごはん を 食{た}べ ませんか。' },
      { pembicara: 'B', sebelum: 'ええ、', sesudah: '。' },
    ],
    potongan: ['食{た}べ', 'ま', 'しょ', 'う'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Mau makan siang? B: Ya, ayo makan.',
    pembahasan: '～ましょう sering dipakai sebagai jawaban setuju atas ajakan ～ませんか.',
    status: 'draf',
  },
  {
    id: 'N5-mashou-4',
    pola: 'mashou',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'どこ へ 行{い}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['公園{こうえん}', 'へ', '行{い}き', 'ましょう'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Mau pergi ke mana? B: Ayo pergi ke taman.',
    pembahasan: '～ましょう menyatakan keinginan bersama untuk pergi ke suatu tempat.',
    status: 'draf',
  },
];
```

## Bab 7 — ［人］に［物］をあげます (`agemasu-moraimasu`)

```js
export const draf_agemasu_moraimasu = [
  {
    id: 'N5-agemasu-moraimasu-1',
    pola: 'agemasu-moraimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きれい な 花{はな} です ね。 だれ に もらい ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['友達{ともだち}', 'に', 'もらい', 'ました'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Bunga yang cantik ya. Dapat dari siapa? B: Saya dapat dari teman.',
    pembahasan: '[人{ひと}]にもらいます berarti menerima sesuatu dari seseorang.',
    status: 'draf',
  },
  {
    id: 'N5-agemasu-moraimasu-2',
    pola: 'agemasu-moraimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '誕生日{たんじょうび} に 何{なに} を あげ ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['時計{とけい}', 'を', 'あげ', 'ます'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Mau memberi apa di hari ulang tahun? B: Saya akan memberi jam tangan.',
    pembahasan: '[物{もの}]をあげます berarti memberi sesuatu kepada orang lain.',
    status: 'draf',
  },
  {
    id: 'N5-agemasu-moraimasu-3',
    pola: 'agemasu-moraimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'だれ に この 本{ほん} を あげ ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['やまださん', 'に', 'あげ', 'ます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Mau memberi buku ini ke siapa? B: Saya akan memberi ke Pak Yamada.',
    pembahasan: '[人{ひと}]に[物{もの}]をあげます: に menandai penerima, を menandai barang.',
    status: 'draf',
  },
  {
    id: 'N5-agemasu-moraimasu-4',
    pola: 'agemasu-moraimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'クリスマス に 何{なに} を もらい ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['セーター', 'を', 'もらい', 'ました'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Dapat apa waktu Natal? B: Saya dapat sweater.',
    pembahasan: '[物{もの}]をもらいました menyatakan barang yang diterima di masa lampau.',
    status: 'draf',
  },
];
```

## Bab 7 — もう～ました (`mou-mashita`)

```js
export const draf_mou_mashita = [
  {
    id: 'N5-mou-mashita-1',
    pola: 'mou-mashita',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'もう 昼{ひる}ごはん を 食{た}べ ました か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['もう', '食{た}べ', 'まし', 'た'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Sudah makan siang? B: Ya, sudah makan.',
    pembahasan: 'もう + ～ました menyatakan suatu kegiatan sudah selesai dilakukan.',
    status: 'draf',
  },
  {
    id: 'N5-mou-mashita-2',
    pola: 'mou-mashita',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'もう 映画{えいが} を 見{み} ました か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['もう', '見{み}', 'まし', 'た'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Sudah nonton filmnya? B: Ya, sudah nonton.',
    pembahasan: 'もう + ～ました menunjukkan aksi sudah selesai dilakukan.',
    status: 'draf',
  },
  {
    id: 'N5-mou-mashita-3',
    pola: 'mou-mashita',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'もう レポート を 書{か}き ました か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['もう', '書{か}き', 'まし', 'た'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Sudah menulis laporan? B: Ya, sudah menulis.',
    pembahasan: 'もう diletakkan di awal kalimat untuk menekankan "sudah".',
    status: 'draf',
  },
  {
    id: 'N5-mou-mashita-4',
    pola: 'mou-mashita',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'もう きっぷ を 買{か}い ました か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['もう', '買{か}い', 'まし', 'た'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Sudah beli tiket? B: Ya, sudah beli.',
    pembahasan: 'もう di awal menekankan aksi sudah dilakukan.',
    status: 'draf',
  },
];
```

## Bab 8 — イA-いです／ナA-です (`keiyoushi`)

```js
export const draf_keiyoushi = [
  {
    id: 'N5-keiyoushi-1',
    pola: 'keiyoushi',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '日本語{にほんご} の 勉強{べんきょう} は どう です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['おもしろい', 'です', 'が', 'むずかしいです'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Bagaimana belajar bahasa Jepang? B: Menarik, tapi sulit.',
    pembahasan: 'Kata sifat -i langsung + です; が menyambung dua kata sifat kontras.',
    status: 'draf',
  },
  {
    id: 'N5-keiyoushi-2',
    pola: 'keiyoushi',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'この 部屋{へや} は どう です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['きれい', 'です', 'が', '小{ちい}さいです'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Bagaimana kamar ini? B: Bersih/cantik, tapi kecil.',
    pembahasan: 'Kata sifat -na + です langsung tanpa な saat menjadi predikat.',
    status: 'draf',
  },
  {
    id: 'N5-keiyoushi-3',
    pola: 'keiyoushi',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ふじさん は どう です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['とても', '高{たか}い', 'で', 'す'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Bagaimana Gunung Fuji? B: Sangat tinggi.',
    pembahasan: 'とても (sangat) diletakkan sebelum kata sifat untuk memperkuat makna.',
    status: 'draf',
  },
  {
    id: 'N5-keiyoushi-4',
    pola: 'keiyoushi',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'あの レストラン は どう です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['おいしい', 'です', 'が', '高{たか}いです'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Bagaimana restoran itu? B: Enak, tapi mahal.',
    pembahasan: 'Pola [kata sifat positif] + が + [kata sifat negatif] umum untuk evaluasi.',
    status: 'draf',
  },
];
```

## Bab 8 — あまり～ません (`amari-nai`)

```js
export const draf_amari_nai = [
  {
    id: 'N5-amari-nai-1',
    pola: 'amari-nai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'よく テレビ を 見{み} ます か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['あまり', '見{み}', 'ま', 'せん'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Sering nonton TV? B: Tidak, tidak begitu nonton.',
    pembahasan: 'あまり + ～ません berarti "tidak begitu" atau "jarang".',
    status: 'draf',
  },
  {
    id: 'N5-amari-nai-2',
    pola: 'amari-nai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '日本{にほん} の 食{た}べ物{もの} は どう です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['あまり', 'おいしく', 'ない', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Bagaimana makanan Jepang? B: Tidak begitu enak.',
    pembahasan: 'あまり + kata sifat -i negatif (-くないです) untuk evaluasi negatif ringan.',
    status: 'draf',
  },
  {
    id: 'N5-amari-nai-3',
    pola: 'amari-nai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'よく 本{ほん} を 読{よ}み ます か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['あまり', '読{よ}み', 'ま', 'せん'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Sering baca buku? B: Tidak, tidak begitu baca.',
    pembahasan: 'あまり selalu diikuti bentuk negatif, tidak pernah bentuk afirmatif.',
    status: 'draf',
  },
  {
    id: 'N5-amari-nai-4',
    pola: 'amari-nai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'この 映画{えいが} は どう です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['あまり', 'おもしろく', 'ない', 'です'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Bagaimana film ini? B: Tidak begitu menarik.',
    pembahasan: 'あまり + おもしろくないです adalah cara sopan menyatakan ketidaktertarikan.',
    status: 'draf',
  },
];
```

## Bab 9 — ～はNが好きです (`ga-suki`)

```js
export const draf_ga_suki = [
  {
    id: 'N5-ga-suki-1',
    pola: 'ga-suki',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'どんな 音楽{おんがく} が 好{す}き です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['ジャズ', 'が', '好{す}き', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Suka musik apa? B: Saya suka jazz.',
    pembahasan: 'Nが好{す}きです menyatakan kesukaan; が menandai objek perasaan.',
    status: 'draf',
  },
  {
    id: 'N5-ga-suki-2',
    pola: 'ga-suki',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'やまだ さん は 何{なに} が 上手{じょうず} です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['料理{りょうり}', 'が', '上手{じょうず}', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Pak Yamada pandai apa? B: Beliau pandai memasak.',
    pembahasan: 'Nが上手{じょうず}です menyatakan kepandaian/keterampilan seseorang.',
    status: 'draf',
  },
  {
    id: 'N5-ga-suki-3',
    pola: 'ga-suki',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ミラー さん は 日本語{にほんご} が わかり ます か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['少{すこ}し', 'わかり', 'ま', 'す'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Apakah Pak Miller mengerti bahasa Jepang? B: Ya, sedikit mengerti.',
    pembahasan: 'Nがわかります menyatakan pemahaman; 少{すこ}し berarti "sedikit".',
    status: 'draf',
  },
  {
    id: 'N5-ga-suki-4',
    pola: 'ga-suki',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '何{なに} が 嫌{きら}い です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['野菜{やさい}', 'が', '嫌{きら}い', 'です'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Tidak suka apa? B: Saya tidak suka sayuran.',
    pembahasan: 'Nが嫌{きら}いです adalah kebalikan dari Nが好{す}きです, menyatakan ketidaksukaan.',
    status: 'draf',
  },
];
```

## Bab 9 — ～から、～ (`kara-riyuu`)

```js
export const draf_kara_riyuu = [
  {
    id: 'N5-kara-riyuu-1',
    pola: 'kara-riyuu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'どうして きのう 休{やす}み ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['熱{ねつ}が', 'あった', 'から', '休{やす}みました'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Kenapa kemarin tidak masuk? B: Karena demam, saya tidak masuk.',
    pembahasan: '～から menyatakan alasan; kalimat alasan diletakkan sebelum から.',
    status: 'draf',
  },
  {
    id: 'N5-kara-riyuu-2',
    pola: 'kara-riyuu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'どうして 日本語{にほんご} を 勉強{べんきょう} し ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['日本{にほん}で', '働{はたら}きたい', 'から', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Kenapa belajar bahasa Jepang? B: Karena ingin bekerja di Jepang.',
    pembahasan: '～からです dipakai saat menjawab pertanyaan alasan secara langsung.',
    status: 'draf',
  },
  {
    id: 'N5-kara-riyuu-3',
    pola: 'kara-riyuu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'どうして 早{はや}く 起{お}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['仕事{しごと}が', 'ある', 'から', '早{はや}く起{お}きます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Kenapa bangun pagi? B: Karena ada kerjaan, saya bangun pagi.',
    pembahasan: 'Pola [alasan] + から + [akibat] menyatakan hubungan sebab-akibat.',
    status: 'draf',
  },
  {
    id: 'N5-kara-riyuu-4',
    pola: 'kara-riyuu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'どうして この レストラン が 好{す}き です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['安{やす}くて', 'おいしい', 'から', 'です'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Kenapa suka restoran ini? B: Karena murah dan enak.',
    pembahasan: '～くて menyambung dua kata sifat -i sebelum から untuk alasan gabungan.',
    status: 'draf',
  },
];
```
