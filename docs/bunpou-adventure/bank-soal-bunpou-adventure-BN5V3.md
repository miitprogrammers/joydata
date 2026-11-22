# Bank Soal Bunpou Adventure — N5 Vol 3 (BN5V3) · Bab 10-15

Status: draf (belum lolos gate mekanis / peninjau buta)

## Bab 10-11 — ［場所］にNがあります (`ni-ga-arimasu`)

```js
export const draf_ni_ga_arimasu = [
  {
    id: 'N5-ni-ga-arimasu-1',
    pola: 'ni-ga-arimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '机{つくえ} の 上{うえ} に 何{なに} が あり ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['本{ほん}', 'が', 'あり', 'ます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Di atas meja ada apa? B: Ada buku.',
    pembahasan: 'Nがあります menyatakan keberadaan benda mati di suatu tempat.',
    status: 'draf',
  },
  {
    id: 'N5-ni-ga-arimasu-2',
    pola: 'ni-ga-arimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '郵便局{ゆうびんきょく} は どこ に あり ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['駅{えき}の', '前{まえ}', 'に', 'あります'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Kantor pos ada di mana? B: Ada di depan stasiun.',
    pembahasan: '[場所{ばしょ}]にあります menyatakan lokasi keberadaan sesuatu.',
    status: 'draf',
  },
  {
    id: 'N5-ni-ga-arimasu-3',
    pola: 'ni-ga-arimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '部屋{へや} に だれ が い ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['やまださん', 'が', 'い', 'ます'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Di kamar ada siapa? B: Ada Pak Yamada.',
    pembahasan: 'います dipakai untuk makhluk hidup (orang, hewan), あります untuk benda mati.',
    status: 'draf',
  },
  {
    id: 'N5-ni-ga-arimasu-4',
    pola: 'ni-ga-arimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '冷蔵庫{れいぞうこ} の 中{なか} に 何{なに} が あり ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['何{なに}', 'も', 'あり', 'ません'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Di dalam kulkas ada apa? B: Tidak ada apa-apa.',
    pembahasan: '何{なに}もありません adalah bentuk negatif yang berarti "tidak ada apa-apa".',
    status: 'draf',
  },
];
```

## Bab 10-11 — 助数詞 (`josuushi`)

```js
export const draf_josuushi = [
  {
    id: 'N5-josuushi-1',
    pola: 'josuushi',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'りんご を いくつ 買{か}い ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['3つ', '買{か}い', 'まし', 'た'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Beli apel berapa buah? B: Saya beli 3 buah.',
    pembahasan: '～つ adalah kata bantu bilangan untuk benda umum (1-10).',
    status: 'draf',
  },
  {
    id: 'N5-josuushi-2',
    pola: 'josuushi',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '切手{きって} を なんまい 買{か}い ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['5まい', '買{か}い', 'ま', 'す'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Beli perangko berapa lembar? B: Saya beli 5 lembar.',
    pembahasan: '～枚{まい} untuk benda tipis/datar seperti kertas, tiket, perangko.',
    status: 'draf',
  },
  {
    id: 'N5-josuushi-3',
    pola: 'josuushi',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '家族{かぞく} は 何人{なんにん} です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['4人{よにん}', 'です', 'よ', 'ね'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Keluarga berapa orang? B: 4 orang.',
    pembahasan: '～人{ひと} untuk menghitung orang; 1人{ひと} (ひとり), 2人{ひと} (ふたり), 3人{ひと} (さんにん).',
    status: 'draf',
  },
  {
    id: 'N5-josuushi-4',
    pola: 'josuushi',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '傘{かさ} を 何本{なんぼん} 持{も}って い ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['2本{にほん}', '持{も}って', 'い', 'ます'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Punya berapa batang payung? B: Saya punya 2 batang.',
    pembahasan: '～本{ほん} untuk benda panjang/silindris seperti payung, pensil, botol.',
    status: 'draf',
  },
];
```

## Bab 10-11 — ［期間］に～回 (`ni-kai`)

```js
export const draf_ni_kai = [
  {
    id: 'N5-ni-kai-1',
    pola: 'ni-kai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '1週間{いっしゅうかん} に なんかい 日本語{にほんご} を 勉強{べんきょう} し ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['3かい', '勉強{べんきょう}', 'し', 'ます'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Seminggu berapa kali belajar bahasa Jepang? B: Saya belajar 3 kali.',
    pembahasan: '[期間{きかん}]に[N]回{かい} menyatakan frekuensi kegiatan dalam periode tertentu.',
    status: 'draf',
  },
  {
    id: 'N5-ni-kai-2',
    pola: 'ni-kai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '1か月{いっかげつ} に なんかい 映画{えいが} を 見{み} ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['2かい', '見{み}', 'ま', 'す'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Sebulan berapa kali nonton film? B: Saya nonton 2 kali.',
    pembahasan: '1か月{つき}に adalah "dalam sebulan"; diikuti 回{かい} untuk frekuensi.',
    status: 'draf',
  },
  {
    id: 'N5-ni-kai-3',
    pola: 'ni-kai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '1年{いちねん} に なんかい 国{くに} へ 帰{かえ}り ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['1かい', '帰{かえ}り', 'ま', 'す'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Setahun berapa kali pulang ke negara asal? B: Saya pulang 1 kali.',
    pembahasan: '1年{ねん}に1かい berarti "sekali dalam setahun".',
    status: 'draf',
  },
  {
    id: 'N5-ni-kai-4',
    pola: 'ni-kai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '1日{いちにち} に なんかい ごはん を 食{た}べ ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['3かい', '食{た}べ', 'ま', 'す'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Sehari berapa kali makan? B: Saya makan 3 kali.',
    pembahasan: '1日{にち}に3かい adalah frekuensi makan standar orang dewasa.',
    status: 'draf',
  },
];
```

## Bab 12 — N1とN2とどちらが～ですか (`dochira-hou-ga`)

```js
export const draf_dochira_hou_ga = [
  {
    id: 'N5-dochira-hou-ga-1',
    pola: 'dochira-hou-ga',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: '日本語{にほんご} の ほう が むずかしい です。' },
    ],
    potongan: ['日本語{にほんご}と', '英語{えいご}と', 'どちらが', 'むずかしいですか'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Bahasa Jepang dan bahasa Inggris, mana yang lebih sulit? B: Bahasa Jepang lebih sulit.',
    pembahasan: 'N1とN2とどちらが～ dipakai untuk membandingkan dua pilihan.',
    status: 'draf',
  },
  {
    id: 'N5-dochira-hou-ga-2',
    pola: 'dochira-hou-ga',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: 'サッカー の ほう が 好{す}き です。' },
    ],
    potongan: ['サッカーと', 'やきゅうと', 'どちらが', '好{す}きですか'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Sepak bola dan bisbol, mana yang lebih disukai? B: Saya lebih suka sepak bola.',
    pembahasan: 'どちらが好{す}きですか menanyakan preferensi di antara dua pilihan.',
    status: 'draf',
  },
  {
    id: 'N5-dochira-hou-ga-3',
    pola: 'dochira-hou-ga',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: '電車{でんしゃ} の ほう が 速{はや}い です。' },
    ],
    potongan: ['電車{でんしゃ}と', 'バスと', 'どちらが', '速{はや}いですか'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Kereta dan bus, mana yang lebih cepat? B: Kereta lebih cepat.',
    pembahasan: 'どちらが + kata sifat untuk membandingkan karakteristik.',
    status: 'draf',
  },
  {
    id: 'N5-dochira-hou-ga-4',
    pola: 'dochira-hou-ga',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: 'どちら も おいしい です。' },
    ],
    potongan: ['すしと', 'てんぷらと', 'どちらが', 'おいしいですか'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Sushi dan tempura, mana yang lebih enak? B: Keduanya enak.',
    pembahasan: 'どちらも berarti "keduanya", dipakai saat tidak ingin memilih salah satu.',
    status: 'draf',
  },
];
```

## Bab 12 — N1はN2より～ (`yori`)

```js
export const draf_yori = [
  {
    id: 'N5-yori-1',
    pola: 'yori',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'とうきょう と おおさか と どちら が 大{おお}きい です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['とうきょうは', 'おおさか', 'より', '大{おお}きいです'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Tokyo dan Osaka, mana yang lebih besar? B: Tokyo lebih besar dari Osaka.',
    pembahasan: 'N1はN2より～ menyatakan bahwa N1 lebih ～ daripada N2.',
    status: 'draf',
  },
  {
    id: 'N5-yori-2',
    pola: 'yori',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '日本{にほん} の 夏{なつ} は どう です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['インドネシア', 'より', '涼{すず}しい', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Bagaimana musim panas di Jepang? B: Lebih sejuk dari Indonesia.',
    pembahasan: 'より diletakkan setelah kata yang menjadi pembanding (standar).',
    status: 'draf',
  },
  {
    id: 'N5-yori-3',
    pola: 'yori',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '車{くるま} と バイク と どちら が 高{たか}い です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['車{くるま}は', 'バイク', 'より', '高{たか}いです'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Mobil dan motor, mana yang lebih mahal? B: Mobil lebih mahal dari motor.',
    pembahasan: 'より dapat dipakai untuk membandingkan harga, ukuran, kualitas, dll.',
    status: 'draf',
  },
  {
    id: 'N5-yori-4',
    pola: 'yori',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'コーヒー と 紅茶{こうちゃ} と どちら が 好{す}き です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['コーヒーは', '紅茶{こうちゃ}', 'より', '好{す}きです'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Kopi dan teh, mana yang lebih disukai? B: Saya lebih suka kopi daripada teh.',
    pembahasan: '好{す}き juga bisa dipakai dengan より untuk menyatakan preferensi.',
    status: 'draf',
  },
];
```

## Bab 12 — 形容詞過去形 (`keiyoushi-kako`)

```js
export const draf_keiyoushi_kako = [
  {
    id: 'N5-keiyoushi-kako-1',
    pola: 'keiyoushi-kako',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きのう の パーティー は どう でした か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['とても', 'たのしかった', 'で', 'す'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Bagaimana pesta kemarin? B: Sangat menyenangkan.',
    pembahasan: 'Kata sifat -i bentuk lampau: い → かったです (楽{たの}しい → 楽{たの}しかったです).',
    status: 'draf',
  },
  {
    id: 'N5-keiyoushi-kako-2',
    pola: 'keiyoushi-kako',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '旅行{りょこう} は どう でした か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['天気{てんき}が', 'よかった', 'で', 'す'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Bagaimana perjalanannya? B: Cuacanya bagus.',
    pembahasan: 'いい bentuk lampaunya adalah よかったです (tidak規則{きそく}変化{へんか}).',
    status: 'draf',
  },
  {
    id: 'N5-keiyoushi-kako-3',
    pola: 'keiyoushi-kako',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'にちようび は ひま でした か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['ひま', 'じゃ', 'なかった', 'です'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Hari Minggu senggang? B: Tidak, tidak senggang.',
    pembahasan: 'Kata sifat -na bentuk lampau negatif: ～じゃなかったです.',
    status: 'draf',
  },
  {
    id: 'N5-keiyoushi-kako-4',
    pola: 'keiyoushi-kako',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きのう は 忙{いそが}しかった です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['あまり', '忙{いそが}しく', 'なかった', 'です'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Kemarin sibuk? B: Tidak, tidak begitu sibuk.',
    pembahasan: 'Kata sifat -i bentuk lampau negatif: い → くなかったです.',
    status: 'draf',
  },
];
```

## Bab 12 — ～で～が一番～ (`ichiban`)

```js
export const draf_ichiban = [
  {
    id: 'N5-ichiban-1',
    pola: 'ichiban',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '日本{にほん} で 何{なに} が 一番{いちばん} 有名{ゆうめい} です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['ふじさん', 'が', '一番{いちばん}', '有名{ゆうめい}です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Di Jepang apa yang paling terkenal? B: Gunung Fuji paling terkenal.',
    pembahasan: '[範囲{はんい}]で[N]が一番{いちばん}～ menyatakan superlatif dalam kelompok tertentu.',
    status: 'draf',
  },
  {
    id: 'N5-ichiban-2',
    pola: 'ichiban',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'クラス で だれ が 一番{いちばん} せ が 高{たか}い です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['やまださん', 'が', '一番{いちばん}', '高{たか}いです'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Di kelas siapa yang paling tinggi? B: Pak Yamada paling tinggi.',
    pembahasan: 'だれが一番{いちばん} menanyakan siapa yang paling ～ dalam kelompok.',
    status: 'draf',
  },
  {
    id: 'N5-ichiban-3',
    pola: 'ichiban',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '1年{いちねん} で いつ が 一番{いちばん} 暑{あつ}い です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['8月{はちがつ}', 'が', '一番{いちばん}', '暑{あつ}いです'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Dalam setahun kapan paling panas? B: Agustus paling panas.',
    pembahasan: 'いつが一番{いちばん} menanyakan waktu yang paling ～.',
    status: 'draf',
  },
  {
    id: 'N5-ichiban-4',
    pola: 'ichiban',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '果物{くだもの} の 中{なか} で 何{なに} が 一番{いちばん} 好{す}き です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['りんご', 'が', '一番{いちばん}', '好{す}きです'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Di antara buah-buahan, apa yang paling disukai? B: Saya paling suka apel.',
    pembahasan: '[N]の中{なか}で dipakai untuk menentukan cakupan perbandingan.',
    status: 'draf',
  },
];
```

## Bab 13 — Nが欲しいです (`hoshii`)

```js
export const draf_hoshii = [
  {
    id: 'N5-hoshii-1',
    pola: 'hoshii',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '誕生日{たんじょうび} に 何{なに} が 欲{ほ}しい です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['新{あたら}しい', '時計{とけい}が', '欲{ほ}しい', 'です'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Hari ulang tahun ingin apa? B: Saya ingin jam tangan baru.',
    pembahasan: 'Nが欲{ほ}しいです menyatakan keinginan memiliki sesuatu (benda).',
    status: 'draf',
  },
  {
    id: 'N5-hoshii-2',
    pola: 'hoshii',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '今{いま} 何{なに} が 一番{いちばん} 欲{ほ}しい です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['休{やす}み', 'が', '欲{ほ}しい', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Sekarang paling ingin apa? B: Saya ingin libur.',
    pembahasan: '休{やす}みが欲{ほ}しい berarti ingin (mendapat) waktu libur/istirahat.',
    status: 'draf',
  },
  {
    id: 'N5-hoshii-3',
    pola: 'hoshii',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'コーヒー が 欲{ほ}しい です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['何{なに}', 'も', '欲{ほ}しく', 'ないです'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Mau kopi? B: Tidak, saya tidak ingin apa-apa.',
    pembahasan: '欲{ほ}しくないです adalah bentuk negatif dari 欲{ほ}しいです.',
    status: 'draf',
  },
  {
    id: 'N5-hoshii-4',
    pola: 'hoshii',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '車{くるま} が 欲{ほ}しい です か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['とても', '欲{ほ}しい', 'で', 'す'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Ingin punya mobil? B: Ya, sangat ingin.',
    pembahasan: 'とても欲{ほ}しいです memperkuat intensitas keinginan.',
    status: 'draf',
  },
];
```

## Bab 13 — ～たいです (`tai`)

```js
export const draf_tai = [
  {
    id: 'N5-tai-1',
    pola: 'tai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'しゅうまつ 何{なに} を し たい です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['映画{えいが}を', '見{み}', 'たい', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Akhir pekan mau ngapain? B: Saya ingin nonton film.',
    pembahasan: 'V-ます stem + たいです menyatakan keinginan melakukan sesuatu.',
    status: 'draf',
  },
  {
    id: 'N5-tai-2',
    pola: 'tai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '今日{きょう} どこ へ 行{い}き たい です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['海{うみ}', 'へ', '行{い}きたい', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Hari ini mau pergi ke mana? B: Saya ingin pergi ke laut.',
    pembahasan: '行{い}きたいです adalah bentuk keinginan dari 行{い}きます.',
    status: 'draf',
  },
  {
    id: 'N5-tai-3',
    pola: 'tai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '日本{にほん} で 何{なに} を 食{た}べ たい です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['ラーメン', 'を', '食{た}べたい', 'です'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Di Jepang ingin makan apa? B: Saya ingin makan ramen.',
    pembahasan: '～を食{た}べたいです menyatakan keinginan makan sesuatu.',
    status: 'draf',
  },
  {
    id: 'N5-tai-4',
    pola: 'tai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '今日{きょう} 勉強{べんきょう} し たい です か。' },
      { pembicara: 'B', sebelum: 'いいえ、あまり', sesudah: '。' },
    ],
    potongan: ['勉強{べんきょう}', 'したく', 'ない', 'です'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Hari ini mau belajar? B: Tidak, tidak begitu ingin belajar.',
    pembahasan: '～たくないです adalah bentuk negatif dari ～たいです.',
    status: 'draf',
  },
];
```

## Bab 13 — ［V-ます／N］に行きます (`ni-ikimasu`)

```js
export const draf_ni_ikimasu = [
  {
    id: 'N5-ni-ikimasu-1',
    pola: 'ni-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きのう どこ へ 行{い}き ました か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['映画{えいが}を', '見{み}', 'に', '行{い}きました'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Kemarin pergi ke mana? B: Saya pergi untuk nonton film.',
    pembahasan: 'V-ますstem + に行{い}きます menyatakan tujuan pergi.',
    status: 'draf',
  },
  {
    id: 'N5-ni-ikimasu-2',
    pola: 'ni-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'にちようび 何{なに} を し に デパート へ 行{い}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['買{か}い物{もの}', 'に', '行{い}き', 'ます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Hari Minggu mau ngapain ke departemen store? B: Saya pergi untuk belanja.',
    pembahasan: 'N + に行{い}きます: kata benda tujuan + に + kata kerja pergerakan.',
    status: 'draf',
  },
  {
    id: 'N5-ni-ikimasu-3',
    pola: 'ni-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'しゅうまつ 何{なに} を し に 公園{こうえん} へ 行{い}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['散歩{さんぽ}', 'に', '行{い}き', 'ます'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Akhir pekan mau ngapain ke taman? B: Saya pergi jalan-jalan.',
    pembahasan: '散歩{さんぽ}に行{い}きます berarti "pergi jalan-jalan" atau "pergi untuk berjalan santai".',
    status: 'draf',
  },
  {
    id: 'N5-ni-ikimasu-4',
    pola: 'ni-ikimasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '夏休{なつやす}み に どこ へ 行{い}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['海{うみ}へ', '泳{およ}ぎ', 'に', '行{い}きます'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Liburan musim panas mau pergi ke mana? B: Saya pergi ke laut untuk berenang.',
    pembahasan: '泳{およ}ぎに行{い}きます: V-ますstem (泳{およ}ぎ) + に + 行{い}きます.',
    status: 'draf',
  },
];
```

## Bab 14 — V-かた (`kata`)

```js
export const draf_kata = [
  {
    id: 'N5-kata-1',
    pola: 'kata',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '駅{えき} へ の 行{い}き 方{かた} を 教{おし}えて ください。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['この', '道{みち}を', 'まっすぐ', '行{い}ってください'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Tolong ajarkan cara ke stasiun. B: Silakan jalan lurus.',
    pembahasan: 'V-ます stem + 方{ほう} menyatakan cara melakukan sesuatu.',
    status: 'draf',
  },
  {
    id: 'N5-kata-2',
    pola: 'kata',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: 'この かんじ の ', sesudah: 'わかり ません。' },
      { pembicara: 'B', teks: '「やま」 です よ。' },
    ],
    potongan: ['ただしい', '読{よ}み', '方{かた}が', 'よく'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Saya tidak tahu cara baca kanji ini. B: Itu "yama" lho.',
    pembahasan: '読{よ}み方{ほう} berarti "cara membaca" atau "bacaan".',
    status: 'draf',
  },
  {
    id: 'N5-kata-3',
    pola: 'kata',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: 'すみません、 ', sesudah: 'を 教{おし}えて ください。' },
      { pembicara: 'B', teks: 'はい、 まず この ボタン を 押{お}して ください。' },
    ],
    potongan: ['この', 'カメラの', '使{つか}い', '方{かた}'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Maaf, tolong ajarkan cara pakai kamera ini. B: Ya, pertama silakan tekan tombol ini.',
    pembahasan: '使{つか}い方{ほう} berarti "cara pakai" atau "cara menggunakan".',
    status: 'draf',
  },
  {
    id: 'N5-kata-4',
    pola: 'kata',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: 'を 教{おし}えて ください。' },
      { pembicara: 'B', teks: 'はい、 まず 野菜{やさい} を 切{き}り ます。' },
    ],
    potongan: ['この', '料理{りょうり}の', '作{つく}り', '方{かた}'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Tolong ajarkan cara buat masakan ini. B: Ya, pertama potong sayuran.',
    pembahasan: '作{つく}り方{ほう} berarti "cara membuat".',
    status: 'draf',
  },
];
```

## Bab 14 — ～てください (`te-kudasai`)

```js
export const draf_te_kudasai = [
  {
    id: 'N5-te-kudasai-1',
    pola: 'te-kudasai',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'すみません、 ちょっと 待{ま}って ください。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['はい', 'わかり', 'まし', 'た'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Maaf, tolong tunggu sebentar. B: Ya, baik.',
    pembahasan: 'V-て + ください adalah bentuk permintaan sopan.',
    status: 'draf',
  },
  {
    id: 'N5-te-kudasai-2',
    pola: 'te-kudasai',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: 'すみません、 ', sesudah: '。' },
      { pembicara: 'B', teks: 'はい、 どうぞ。' },
    ],
    potongan: ['塩{しお}を', '取{と}って', 'くだ', 'さい'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Maaf, tolong ambilkan garam. B: Ya, silakan.',
    pembahasan: '[物{もの}]を取{と}ってください meminta seseorang mengambilkan sesuatu.',
    status: 'draf',
  },
  {
    id: 'N5-te-kudasai-3',
    pola: 'te-kudasai',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: 'もう 一度{いちど} ', sesudah: '。' },
      { pembicara: 'B', teks: 'はい、 これ は 「山{やま}」 です。' },
    ],
    potongan: ['言{い}って', 'くだ', 'さ', 'い'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Tolong katakan sekali lagi. B: Ya, ini adalah "yama".',
    pembahasan: 'もう一度{いちど}言{い}ってください adalah permintaan untuk mengulang.',
    status: 'draf',
  },
  {
    id: 'N5-te-kudasai-4',
    pola: 'te-kudasai',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: 'ここ に 名前{なまえ} を ', sesudah: '。' },
      { pembicara: 'B', teks: 'はい、 わかり ました。' },
    ],
    potongan: ['書{か}いて', 'くだ', 'さ', 'い'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Tolong tulis nama di sini. B: Ya, baik.',
    pembahasan: '[場所{ばしょ}]に[N]を書{か}いてください untuk meminta menulis sesuatu di suatu tempat.',
    status: 'draf',
  },
];
```

## Bab 14 — ～ましょうか (`mashou-ka`)

```js
export const draf_mashou_ka = [
  {
    id: 'N5-mashou-ka-1',
    pola: 'mashou-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '荷物{にもつ} を 持{も}ち ましょう か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['ありがとう', 'ござい', 'ま', 'す'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Bagaimana kalau saya bawakan barang? B: Terima kasih.',
    pembahasan: 'V-ましょうか dipakai untuk menawarkan bantuan kepada orang lain.',
    status: 'draf',
  },
  {
    id: 'N5-mashou-ka-2',
    pola: 'mashou-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: 'はい、 おねがい します。' },
    ],
    potongan: ['窓{まど}を', '開{あ}け', 'ましょう', 'か'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Bagaimana kalau saya buka jendelanya? B: Ya, tolong.',
    pembahasan: '～ましょうか menawarkan untuk melakukan sesuatu untuk orang lain.',
    status: 'draf',
  },
  {
    id: 'N5-mashou-ka-3',
    pola: 'mashou-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: 'いいえ、 大丈夫{だいじょうぶ} です。' },
    ],
    potongan: ['てつだい', 'ましょ', 'う', 'か'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Bagaimana kalau saya bantu? B: Tidak, tidak apa-apa.',
    pembahasan: 'てつだいましょうか adalah cara sopan menawarkan bantuan.',
    status: 'draf',
  },
  {
    id: 'N5-mashou-ka-4',
    pola: 'mashou-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '道{みち} が わかり ません。 ', sesudah: '。' },
      { pembicara: 'B', teks: 'はい、 おねがい します。' },
    ],
    potongan: ['地図{ちず}を', '見{み}せ', 'ましょう', 'か'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Saya tidak tahu jalannya. Bagaimana kalau saya tunjukkan peta? B: Ya, tolong.',
    pembahasan: '見{み}せましょうか menawarkan untuk menunjukkan sesuatu.',
    status: 'draf',
  },
];
```

## Bab 14 — ～ています (`te-imasu`)

```js
export const draf_te_imasu = [
  {
    id: 'N5-te-imasu-1',
    pola: 'te-imasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'やまだ さん は 何{なに} を して い ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['本{ほん}を', '読{よ}んで', 'い', 'ます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Pak Yamada sedang ngapain? B: Beliau sedang membaca buku.',
    pembahasan: 'V-ています menyatakan kegiatan yang sedang berlangsung.',
    status: 'draf',
  },
  {
    id: 'N5-te-imasu-2',
    pola: 'te-imasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ミラー さん は 結婚{けっこん} して い ます か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['結婚{けっこん}', 'して', 'い', 'ます'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Apakah Pak Miller sudah menikah? B: Ya, sudah menikah.',
    pembahasan: '結婚{けっこん}しています menyatakan keadaan (sudah menikah), bukan sedang menikah.',
    status: 'draf',
  },
  {
    id: 'N5-te-imasu-3',
    pola: 'te-imasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'やまだ さん を 知{し}って い ます か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['知{し}り', 'ま', 'せ', 'ん'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Apakah kenal Pak Yamada? B: Tidak, tidak kenal.',
    pembahasan: 'Bentuk negatif dari 知{し}っています adalah 知{し}りません (bukan 知{し}っていません).',
    status: 'draf',
  },
  {
    id: 'N5-te-imasu-4',
    pola: 'te-imasu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'さとう さん は どこ に 住{す}んで い ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['とうきょう', 'に', '住{す}んでい', 'ます'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Pak Sato tinggal di mana? B: Beliau tinggal di Tokyo.',
    pembahasan: '住{す}んでいます menyatakan keadaan tinggal di suatu tempat.',
    status: 'draf',
  },
];
```

## Bab 15 — ～てもいいです (`te-mo-ii`)

```js
export const draf_te_mo_ii = [
  {
    id: 'N5-te-mo-ii-1',
    pola: 'te-mo-ii',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ここ で 写真{しゃしん} を 撮{と}って も いい です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['はい', 'いい', 'です', 'よ'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Boleh foto di sini? B: Ya, boleh.',
    pembahasan: 'V-てもいいですか menanyakan izin untuk melakukan sesuatu.',
    status: 'draf',
  },
  {
    id: 'N5-te-mo-ii-2',
    pola: 'te-mo-ii',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: 'すみません、 ちょっと……。' },
    ],
    potongan: ['ここで', '食{た}べて', 'もいい', 'ですか'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Boleh makan di sini? B: Maaf, sedikit…',
    pembahasan: 'Jawaban "ちょっと…" adalah penolakan halus dalam bahasa Jepang.',
    status: 'draf',
  },
  {
    id: 'N5-te-mo-ii-3',
    pola: 'te-mo-ii',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: 'どうぞ。' },
    ],
    potongan: ['この', '本{ほん}を', '借{か}りても', 'いいですか'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Boleh pinjam buku ini? B: Silakan.',
    pembahasan: '借{か}りてもいいですか meminta izin untuk meminjam sesuatu.',
    status: 'draf',
  },
  {
    id: 'N5-te-mo-ii-4',
    pola: 'te-mo-ii',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: 'ええ、 いい です よ。' },
    ],
    potongan: ['窓{まど}を', '開{あ}けて', 'もいい', 'ですか'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Boleh buka jendela? B: Ya, boleh.',
    pembahasan: '開{あ}けてもいいですか meminta izin untuk membuka sesuatu.',
    status: 'draf',
  },
];
```

## Bab 15 — ～てはいけません (`te-wa-ikemasen`)

```js
export const draf_te_wa_ikemasen = [
  {
    id: 'N5-te-wa-ikemasen-1',
    pola: 'te-wa-ikemasen',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ここ で タバコ を 吸{す}って も いい です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['吸{す}って', 'は', 'いけ', 'ません'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Boleh merokok di sini? B: Tidak, tidak boleh merokok.',
    pembahasan: 'V-てはいけません menyatakan larangan (tidak boleh).',
    status: 'draf',
  },
  {
    id: 'N5-te-wa-ikemasen-2',
    pola: 'te-wa-ikemasen',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '図書館{としょかん} で 何{なに} を して は いけ ません か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['大{おお}きい', '声{こえ}で', '話{はな}しては', 'いけません'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Apa yang tidak boleh dilakukan di perpustakaan? B: Tidak boleh berbicara dengan suara keras.',
    pembahasan: '大{おお}きい声{こえ}で話{はな}してはいけません adalah larangan berbicara keras.',
    status: 'draf',
  },
  {
    id: 'N5-te-wa-ikemasen-3',
    pola: 'te-wa-ikemasen',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ここ で 写真{しゃしん} を 撮{と}って も いい です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['撮{と}って', 'は', 'いけ', 'ません'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Boleh foto di sini? B: Tidak, tidak boleh foto.',
    pembahasan: 'V-てはいけません adalah jawaban negatif untuk permintaan izin.',
    status: 'draf',
  },
  {
    id: 'N5-te-wa-ikemasen-4',
    pola: 'te-wa-ikemasen',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '電車{でんしゃ} の 中{なか} で 何{なに} を して は いけ ません か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['電話{でんわ}', 'を', 'かけては', 'いけません'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Di dalam kereta tidak boleh ngapain? B: Tidak boleh menelepon.',
    pembahasan: '電話{でんわ}をかけてはいけません menyatakan larangan menelepon.',
    status: 'draf',
  },
];
```
