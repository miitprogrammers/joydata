# Bank Soal Bunpou Adventure — N5 Vol 1 (BN5V1) · Bab 1-4

Status: draf (belum lolos gate mekanis / peninjau buta)

## Bab 1 — N1はN2です (`wa-desu`)

```js
export const draf_wa_desu = [
  {
    id: 'N5-wa-desu-1',
    pola: 'wa-desu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'すみません、 ミラー さん です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: 'です。' },
    ],
    potongan: ['わたし', 'は', 'たなか', 'さん'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Maaf, apakah Anda Pak Miller? B: Bukan, saya Tanaka.',
    pembahasan: 'Pola N1はN2です menyatakan "N1 adalah N2". Jawaban menyangkal memakai nama lain setelah いいえ.',
    status: 'draf',
  },
  {
    id: 'N5-wa-desu-2',
    pola: 'wa-desu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ミラー さん は アメリカ 人{じん} です か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['わたし', 'は', 'アメリカ人{じん}', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Apakah Pak Miller orang Amerika? B: Ya, saya orang Amerika.',
    pembahasan: 'Jawaban "はい" diikuti N1はN2です untuk menegaskan kewarganegaraan dengan sopan.',
    status: 'draf',
  },
  {
    id: 'N5-wa-desu-3',
    pola: 'wa-desu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'やまだ さん は 学生{がくせい} です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['やまださん', 'は', '学生{がくせい}', 'じゃありません'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Apakah Pak/Bu Yamada mahasiswa? B: Bukan, Pak/Bu Yamada bukan mahasiswa.',
    pembahasan: 'Bentuk negatif dari です adalah じゃありません, dipasang setelah kata benda yang disangkal.',
    status: 'draf',
  },
  {
    id: 'N5-wa-desu-4',
    pola: 'wa-desu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'はじめまして。 わたし は ワン です。 タイ 人{じん} です。' },
      { pembicara: 'B', sebelum: 'はじめまして。', sesudah: '。' },
    ],
    potongan: ['わたし', 'は', 'ミラー', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Perkenalkan, saya Wan. Saya orang Thailand. B: Perkenalkan, saya Miller.',
    pembahasan: 'Saat berkenalan, pola N1はN2です dipakai untuk menyebutkan nama diri sendiri.',
    status: 'draf',
  },
];
```

## Bab 1 — N1のN2 (`n-no-n`)

```js
export const draf_n_no_n = [
  {
    id: 'N5-n-no-n-1',
    pola: 'n-no-n',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'すずき さん、 辞書{じしょ} は だれ の です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['わたし', 'の', '辞書{じしょ}', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Bu Suzuki, kamus ini milik siapa? B: Itu kamus saya.',
    pembahasan: '"だれの" artinya "milik siapa"; N2 (辞書{か}) boleh diulang atau cukup pakai のです saja.',
    status: 'draf',
  },
  {
    id: 'N5-n-no-n-2',
    pola: 'n-no-n',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'すずき さん の 雑誌{ざっし} は 何{なん} の 雑誌{ざっし} です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['日本語{にほんご}', 'の', '雑誌{ざっし}', 'です'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Majalah Bu Suzuki itu majalah apa? B: Itu majalah bahasa Jepang.',
    pembahasan: '"何{なに}の+N" berarti "N apa/jenis apa"; jawabannya pakai N1のN2 untuk menyebut jenisnya.',
    status: 'draf',
  },
  {
    id: 'N5-n-no-n-3',
    pola: 'n-no-n',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ミラー さん の 会社{かいしゃ} は 何{なん} です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['ミラーさん', 'の', '会社{かいしゃ}は', 'さくらです'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Apa nama perusahaan Pak Miller? B: Perusahaan Pak Miller adalah Sakura.',
    pembahasan: 'N1のN2 juga dipakai sebagai topik kalimat, seperti "perusahaan milik Pak Miller".',
    status: 'draf',
  },
  {
    id: 'N5-n-no-n-4',
    pola: 'n-no-n',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'たなか さん は 何{なん} の 先生{せんせい} です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['日本語{にほんご}', 'の', '先生{せんせい}', 'です'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Pak Tanaka itu guru apa? B: Beliau guru bahasa Jepang.',
    pembahasan: 'N1のN2 menjelaskan jenis profesi, misalnya "guru bahasa Jepang" = 日本語{にほんご}の先生{せんせい}.',
    status: 'draf',
  },
];
```

## Bab 1 — N1もN2です (`mo`)

```js
export const draf_mo = [
  {
    id: 'N5-mo-1',
    pola: 'mo',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ミラー さん は かいしゃいん です。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['たなかさん', 'も', 'かいしゃいん', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Pak Miller adalah karyawan perusahaan. B: Pak Tanaka juga karyawan perusahaan.',
    pembahasan: 'も menggantikan は saat predikatnya sama dengan kalimat sebelumnya, artinya "juga".',
    status: 'draf',
  },
  {
    id: 'N5-mo-2',
    pola: 'mo',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'わたし は 学生{がくせい} です。 あなた も 学生{がくせい} です か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['わたし', 'も', '学生{がくせい}', 'です'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Saya mahasiswa. Apakah Anda juga mahasiswa? B: Ya, saya juga mahasiswa.',
    pembahasan: 'Pertanyaan dengan も bisa dijawab はい lalu diikuti pola N1もN2です yang sama.',
    status: 'draf',
  },
  {
    id: 'N5-mo-3',
    pola: 'mo',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'サントス さん は 医者{いしゃ} じゃありません。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['ワンさん', 'も', '医者{いしゃ}', 'じゃありません'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Pak Santos bukan dokter. B: Pak Wan juga bukan dokter.',
    pembahasan: 'も bisa dipakai dengan bentuk negatif じゃありません untuk menyatakan "juga bukan".',
    status: 'draf',
  },
  {
    id: 'N5-mo-4',
    pola: 'mo',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'ミラー さん は 大学生{だいがくせい} です。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['ワンさん', 'も', '大学生{だいがくせい}', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Pak Miller adalah mahasiswa universitas. B: Pak Wan juga mahasiswa universitas.',
    pembahasan: 'N1もN2です dipakai berulang untuk menyamakan status/profesi dua orang berbeda.',
    status: 'draf',
  },
];
```

## Bab 2 — これ／それ／あれ (`kore-sore-are`)

```js
export const draf_kore_sore_are = [
  {
    id: 'N5-kore-sore-are-1',
    pola: 'kore-sore-are',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'すみません、 それ は 辞書{じしょ} です か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['これ', 'は', '辞書{じしょ}', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Maaf, apakah itu kamus? B: Ya, ini kamus.',
    pembahasan: 'それ dipakai A untuk benda dekat B; B menjawab dengan これ karena benda itu dekat dirinya.',
    status: 'draf',
  },
  {
    id: 'N5-kore-sore-are-2',
    pola: 'kore-sore-are',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'あれ は 何{なん} です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['あれ', 'は', 'かばん', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Itu (yang jauh) apa? B: Itu tas.',
    pembahasan: 'あれ dipakai untuk benda yang jauh dari pembicara maupun lawan bicara.',
    status: 'draf',
  },
  {
    id: 'N5-kore-sore-are-3',
    pola: 'kore-sore-are',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'それ は あなた の 傘{かさ} です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['それ', 'は', 'わたしの', 'じゃありません'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Apakah itu payung Anda? B: Bukan, itu bukan milik saya.',
    pembahasan: 'それ dipakai karena benda itu dekat lawan bicara (B); jawaban negatif tetap pakai それ.',
    status: 'draf',
  },
  {
    id: 'N5-kore-sore-are-4',
    pola: 'kore-sore-are',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'これ は サントス さん の 本{ほん} です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['それ', 'は', 'わたしの', '本{ほん}です'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Apakah ini buku Pak Santos? B: Bukan, itu buku saya.',
    pembahasan: 'Karena benda dekat A, B menyebutnya dengan それ (dekat lawan bicara) saat menjawab.',
    status: 'draf',
  },
];
```

## Bab 2 — N1ですか、N2ですか (`desu-ka-desu-ka`)

```js
export const draf_desu_ka_desu_ka = [
  {
    id: 'N5-desu-ka-desu-ka-1',
    pola: 'desu-ka-desu-ka',
    situasi: '（教室{きょうしつ}で）',
    baris: [
      { pembicara: 'A', sebelum: '', sesudah: '。' },
      { pembicara: 'B', teks: '辞書{じしょ} です。' },
    ],
    potongan: ['これは', '辞書{じしょ}ですか、', '雑誌{ざっし}', 'ですか'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Ini kamus atau majalah? B: Ini kamus.',
    pembahasan: 'Pola N1ですか、N2ですか dipakai untuk bertanya pilihan antara dua benda.',
    status: 'draf',
  },
  {
    id: 'N5-desu-ka-desu-ka-2',
    pola: 'desu-ka-desu-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: 'ミラー さん は ', sesudah: '。' },
      { pembicara: 'B', teks: '学生{がくせい} です。' },
    ],
    potongan: ['先生{せんせい}', 'ですか、', '学生{がくせい}', 'ですか'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Apakah Pak Miller guru atau mahasiswa? B: Beliau mahasiswa.',
    pembahasan: 'Pilihan profesi ditanyakan dengan N1ですか、N2ですか di akhir kalimat tanya.',
    status: 'draf',
  },
  {
    id: 'N5-desu-ka-desu-ka-3',
    pola: 'desu-ka-desu-ka',
    situasi: '（会社{かいしゃ}で）',
    baris: [
      { pembicara: 'A', teks: 'すみません、 あの 人{ひと} は だれ です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['たなかさん', 'ですか、', 'やまださん', 'ですか'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Maaf, orang itu siapa? B: Apakah Pak Tanaka atau Pak Yamada?',
    pembahasan: 'N1ですか、N2ですか juga dipakai untuk menebak pilihan nama orang.',
    status: 'draf',
  },
  {
    id: 'N5-desu-ka-desu-ka-4',
    pola: 'desu-ka-desu-ka',
    situasi: null,
    baris: [
      { pembicara: 'A', sebelum: 'これ は ', sesudah: 'ですか。' },
      { pembicara: 'B', teks: 'タイ の 雑誌{ざっし} です。' },
    ],
    potongan: ['日本{にほん}の', '雑誌{ざっし}ですか、', 'タイの', '雑誌{ざっし}'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Ini majalah Jepang atau majalah Thailand? B: Ini majalah Thailand.',
    pembahasan: 'Kedua pilihan bisa berupa frasa N1のN2 yang diulang dengan struktur ですか、…ですか.',
    status: 'draf',
  },
];
```

## Bab 2 — この／その／あのN (`kono-sono-ano`)

```js
export const draf_kono_sono_ano = [
  {
    id: 'N5-kono-sono-ano-1',
    pola: 'kono-sono-ano',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'これ は 先生{せんせい} の 本{ほん} です か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['この', '本{ほん}は', '先生{せんせい}の', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Apakah ini buku pak/bu guru? B: Ya, buku ini milik pak/bu guru.',
    pembahasan: 'この selalu diikuti kata benda langsung (この本{ほん}), berbeda dengan これ yang berdiri sendiri.',
    status: 'draf',
  },
  {
    id: 'N5-kono-sono-ano-2',
    pola: 'kono-sono-ano',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'あの 傘{かさ} は だれ の です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['あの', '傘{かさ}は', 'やまださんの', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Payung yang di sana itu milik siapa? B: Payung itu milik Pak Yamada.',
    pembahasan: 'あの dipakai untuk benda yang jauh dari pembicara dan lawan bicara, selalu + kata benda.',
    status: 'draf',
  },
  {
    id: 'N5-kono-sono-ano-3',
    pola: 'kono-sono-ano',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'その 雑誌{ざっし} は 日本語{にほんご} の 雑誌{ざっし} です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['その', '雑誌{ざっし}は', '英語{えいご}の', '雑誌{ざっし}です'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Apakah majalah itu majalah bahasa Jepang? B: Bukan, majalah itu majalah bahasa Inggris.',
    pembahasan: 'その dipakai untuk benda dekat lawan bicara; tetap dipertahankan saat menjawab.',
    status: 'draf',
  },
  {
    id: 'N5-kono-sono-ano-4',
    pola: 'kono-sono-ano',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'この 時計{とけい} は たなか さん の です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['この', '時計{とけい}は', 'わたし', 'のです'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Apakah jam ini milik Pak Tanaka? B: Bukan, jam ini milik saya.',
    pembahasan: 'この+N dipakai saat benda berada dekat pembicara saat berbicara.',
    status: 'draf',
  },
];
```

## Bab 3-4 — ここ／そこ／あそこ (`koko-soko-asoko`)

```js
export const draf_koko_soko_asoko = [
  {
    id: 'N5-koko-soko-asoko-1',
    pola: 'koko-soko-asoko',
    situasi: '（学校{がっこう}で）',
    baris: [
      { pembicara: 'A', teks: 'すみません、 トイレ は どこ です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['トイレ', 'は', 'あそこ', 'です'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Maaf, toilet di mana? B: Toilet di sana (jauh).',
    pembahasan: 'あそこ dipakai untuk tempat yang jauh dari pembicara maupun lawan bicara.',
    status: 'draf',
  },
  {
    id: 'N5-koko-soko-asoko-2',
    pola: 'koko-soko-asoko',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '郵便局{ゆうびんきょく} は ここ です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['郵便局{ゆうびんきょく}', 'は', 'そこ', 'です'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Apakah kantor pos ada di sini? B: Bukan, kantor pos ada di situ.',
    pembahasan: 'そこ dipakai untuk tempat yang dekat dengan lawan bicara, bukan pembicara.',
    status: 'draf',
  },
  {
    id: 'N5-koko-soko-asoko-3',
    pola: 'koko-soko-asoko',
    situasi: '（教室{きょうしつ}で）',
    baris: [
      { pembicara: 'A', teks: '先生{せんせい} の じむしょ は どこ です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['先生{せんせい}の', 'じむしょ', 'は', 'あそこです'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Kantor pak/bu guru di mana? B: Kantor pak/bu guru ada di sana.',
    pembahasan: 'あそこ menunjuk lokasi jauh dari kedua pembicara, sering dijawab untuk pertanyaan どこ.',
    status: 'draf',
  },
  {
    id: 'N5-koko-soko-asoko-4',
    pola: 'koko-soko-asoko',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '銀行{ぎんこう} は あそこ です か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['銀行{ぎんこう}', 'は', 'ここ', 'です'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Apakah bank ada di sana? B: Bukan, bank ada di sini.',
    pembahasan: 'ここ dipakai untuk tempat dekat pembicara saat berbicara.',
    status: 'draf',
  },
];
```

## Bab 3-4 — ～から～まで (`kara-made`)

```js
export const draf_kara_made = [
  {
    id: 'N5-kara-made-1',
    pola: 'kara-made',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '銀行{ぎんこう} は 何時{なんじ} から 何時{なんじ} まで です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['銀行{ぎんこう}は', '9時{くじ}から', '3時{さんじ}', 'までです'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Bank buka dari jam berapa sampai jam berapa? B: Bank buka dari jam 9 sampai jam 3.',
    pembahasan: '～から～まで menyatakan rentang waktu, dari titik awal (から) sampai titik akhir (まで).',
    status: 'draf',
  },
  {
    id: 'N5-kara-made-2',
    pola: 'kara-made',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'デパート は 何時{なんじ} から 何時{なんじ} まで です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['デパートは', '10時{じゅうじ}から', '8時{はちじ}', 'までです'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Departement store buka dari jam berapa sampai jam berapa? B: Buka dari jam 10 sampai jam 8.',
    pembahasan: 'まで menandai batas akhir waktu; jawaban meniru struktur pertanyaan dengan angka konkret.',
    status: 'draf',
  },
  {
    id: 'N5-kara-made-3',
    pola: 'kara-made',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'やまだ さん の 仕事{しごと} は 何時{なんじ} から 何時{なんじ} まで です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['仕事{しごと}は', '9時{くじ}から', '5時{ごじ}', 'までです'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Jam kerja Pak Yamada dari jam berapa sampai jam berapa? B: Jam kerjanya dari jam 9 sampai jam 5.',
    pembahasan: 'から menunjukkan waktu mulai, まで menunjukkan waktu selesai suatu kegiatan.',
    status: 'draf',
  },
  {
    id: 'N5-kara-made-4',
    pola: 'kara-made',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '図書館{としょかん} は 何時{なんじ} から 何時{なんじ} まで です か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['図書館{としょかん}は', '8時{はちじ}半{はん}から', '6時{ろくじ}', 'までです'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Perpustakaan buka dari jam berapa sampai jam berapa? B: Buka dari jam 8.30 sampai jam 6.',
    pembahasan: 'Angka waktu bisa memakai 半{はん} (setengah/30 menit) sebelum から dalam pola yang sama.',
    status: 'draf',
  },
];
```

## Bab 3-4 — ［時間］にVます (`ni-jikan`)

```js
export const draf_ni_jikan = [
  {
    id: 'N5-ni-jikan-1',
    pola: 'ni-jikan',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '毎日{まいにち}、 何時{なんじ} に 起{お}き ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['わたしは', '6時{ろくじ}', 'に', '起{お}きます'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Setiap hari, Anda bangun jam berapa? B: Saya bangun jam 6.',
    pembahasan: 'Partikel に menandai jam/waktu terjadinya kegiatan, diletakkan sebelum kata kerja ~ます.',
    status: 'draf',
  },
  {
    id: 'N5-ni-jikan-2',
    pola: 'ni-jikan',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'たなか さん は 何時{なんじ} に 寝{ね} ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['たなかさんは', '11時{じゅういちじ}', 'に', '寝{ね}ます'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Pak Tanaka tidur jam berapa? B: Pak Tanaka tidur jam 11.',
    pembahasan: '[Jam]に寝{ね}ます menyatakan waktu tidur; に tidak boleh dihilangkan sebelum kata kerja.',
    status: 'draf',
  },
  {
    id: 'N5-ni-jikan-3',
    pola: 'ni-jikan',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'いつ 休{やす}み ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['にちようび', 'に', '休{やす}み', 'ます'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Kapan Anda libur? B: Saya libur pada hari Minggu.',
    pembahasan: 'に juga dipakai setelah nama hari (曜日{ようび}) untuk menyatakan "pada hari itu".',
    status: 'draf',
  },
  {
    id: 'N5-ni-jikan-4',
    pola: 'ni-jikan',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '仕事{しごと} は 何時{なんじ} に 終{お}わり ます か。' },
      { pembicara: 'B', sebelum: '', sesudah: '。' },
    ],
    potongan: ['仕事{しごと}は', '6時{ろくじ}', 'に', '終{お}わります'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Pekerjaan selesai jam berapa? B: Pekerjaan selesai jam 6.',
    pembahasan: '終{お}わります adalah kata kerja tanpa objek, sehingga waktunya cukup ditandai dengan に.',
    status: 'draf',
  },
];
```

## Bab 3-4 — ～ます／～ました (`masu`)

```js
export const draf_masu = [
  {
    id: 'N5-masu-1',
    pola: 'masu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '毎日{まいにち} 勉強{べんきょう} します か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['毎日{まいにち}', '3時間{さんじかん}', '勉強{べんきょう}', 'します'],
    bintang: 2,
    urutanLain: [],
    terjemahan: 'A: Apakah Anda belajar setiap hari? B: Ya, saya belajar 3 jam setiap hari.',
    pembahasan: '~ます dipakai untuk kegiatan rutin masa sekarang/akan datang dalam bentuk sopan.',
    status: 'draf',
  },
  {
    id: 'N5-masu-2',
    pola: 'masu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: 'きのう 働{はたら}き ました か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['きのうは', '働{はたら}き', 'ません', 'でした'],
    bintang: 1,
    urutanLain: [],
    terjemahan: 'A: Apakah Anda bekerja kemarin? B: Tidak, kemarin saya tidak bekerja.',
    pembahasan: 'Bentuk lampau negatif dari ~ます adalah ~ませんでした.',
    status: 'draf',
  },
  {
    id: 'N5-masu-3',
    pola: 'masu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '先週{せんしゅう} 休{やす}み ました か。' },
      { pembicara: 'B', sebelum: 'はい、', sesudah: '。' },
    ],
    potongan: ['先週{せんしゅう}', 'は', '休{やす}み', 'ました'],
    bintang: 3,
    urutanLain: [],
    terjemahan: 'A: Apakah Anda libur minggu lalu? B: Ya, minggu lalu saya libur.',
    pembahasan: 'Bentuk lampau afirmatif dari ~ます adalah ~ました, dipakai untuk kejadian sudah lewat.',
    status: 'draf',
  },
  {
    id: 'N5-masu-4',
    pola: 'masu',
    situasi: null,
    baris: [
      { pembicara: 'A', teks: '今日{きょう} 勉強{べんきょう} します か。' },
      { pembicara: 'B', sebelum: 'いいえ、', sesudah: '。' },
    ],
    potongan: ['今日{きょう}は', '勉強{べんきょう}', 'し', 'ません'],
    bintang: 0,
    urutanLain: [],
    terjemahan: 'A: Apakah Anda belajar hari ini? B: Tidak, hari ini saya tidak belajar.',
    pembahasan: 'Bentuk negatif sekarang dari ~ます adalah ~ません, menggantikan akhiran します menjadi しません.',
    status: 'draf',
  },
];
```
