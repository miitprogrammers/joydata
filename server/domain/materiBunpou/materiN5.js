// Content of the N5 materials (patterns first taught in Minna no Nihongo I, Bab 1–25). Data only; the shape and the
// limits are in docs/materi-bunpou/spek-kode.md § 1.2 and are checked by validasiIsi (index.js).
// Written by Claude, status 'draf' until a sensei has checked it.

export const MATERI_N5 = [
  // ～てください (Bab 14). Example sentences stay within Bab 1–14: no ～てから, ～てもいい, ～ないでください yet.
  {
    id: 'te-kudasai',
    status: 'draf',
    inti: 'Meminta tolong, memberi instruksi, atau mempersilakan.',
    rumusKolom: { dasar: 'Bentuk ます', antara: 'Bentuk て', hasil: '＋ください' },
    rumusPengantar: 'Buang ます, ubah ke bentuk て, lalu tambahkan ください. Perubahan Grup 1 tergantung bunyi sebelum ます.',
    rumus: [
      { jenis: 'Grup 1: き → いて', dasar: '書{か}きます', antara: '書{か}いて', hasil: '書{か}いて[[ください]]' },
      { jenis: 'ぎ → いで', dasar: '急{いそ}ぎます', antara: '急{いそ}いで', hasil: '急{いそ}いで[[ください]]' },
      { jenis: 'い・ち・り → って', dasar: '待{ま}ちます', antara: '待{ま}って', hasil: '待{ま}って[[ください]]' },
      { jenis: 'み・び・に → んで', dasar: '読{よ}みます', antara: '読{よ}んで', hasil: '読{よ}んで[[ください]]' },
      { jenis: 'し → して', dasar: '話{はな}します', antara: '話{はな}して', hasil: '話{はな}して[[ください]]' },
      { jenis: 'Pengecualian', dasar: '行{い}きます', antara: '行{い}って', hasil: '行{い}って[[ください]]', catatan: 'bukan いいて' },
      { jenis: 'Grup 2: buang ます', dasar: '食{た}べます', antara: '食{た}べて', hasil: '食{た}べて[[ください]]' },
      { jenis: 'Grup 3', dasar: 'します・来{き}ます', antara: 'して・来{き}て', hasil: 'して[[ください]]・来{き}て[[ください]]' },
    ],
    makna: [
      {
        judul: 'Meminta & memberi instruksi',
        penjelasan: 'Meminta orang lain melakukan sesuatu. Dari atasan atau sensei, artinya instruksi yang harus dikerjakan.',
        padanan: ['tolong …', 'mohon …', 'harap …'],
        contohMini: { jp: 'すみません、ちょっと[[待{ま}ってください]]。', id: 'Maaf, tolong tunggu sebentar.' },
      },
      {
        judul: 'Mempersilakan',
        penjelasan: 'Menawarkan atau mengizinkan dengan ramah. Biasanya diawali どうぞ.',
        padanan: ['silakan …'],
        contohMini: { jp: 'どうぞ、たくさん[[食{た}べてください]]。', id: 'Silakan, makan yang banyak.' },
      },
    ],
    perhatikan: 'Bahasa Indonesia membedakan "tolong …" (meminta) dan "silakan …" (mempersilakan). Bahasa Jepang memakai satu bentuk untuk keduanya: すみません untuk meminta, どうぞ untuk mempersilakan. Hati-hati: "tolong" sopan kepada siapa saja, tetapi ～てください kepada atasan atau pelanggan bisa terdengar menyuruh.',
    contoh: [
      {
        tempat: 'kelas',
        makna: 0,
        situasi: 'Sensei menjelaskan terlalu cepat, dan peserta belum bisa menangkapnya.',
        baris: [
          { penutur: 'Peserta', jp: 'すみません、もう少{すこ}しゆっくり[[話{はな}してください]]。', id: 'Maaf, tolong bicara sedikit lebih pelan.' },
          { penutur: 'Sensei', jp: 'はい、わかりました。', id: 'Ya, baik.' },
        ],
        catatan: 'Kalimat ini sangat berguna untuk peserta baru. すみません di depan membuat permintaan terdengar sopan.',
      },
      {
        tempat: 'kerja',
        makna: 0,
        situasi: 'Atasan memanggil pemagang untuk membantu di area kerja.',
        baris: [
          { penutur: 'Atasan', jp: 'ブディさん、ちょっと[[手伝{てつだ}ってください]]。', id: 'Budi, tolong bantu sebentar.' },
          { penutur: 'Anda', jp: 'はい、すぐ行{い}きます。', id: 'Baik, saya segera ke sana.' },
        ],
        catatan: 'Dari atasan, ～てください adalah instruksi kerja, bukan sekadar permintaan. Jawab dengan はい, lalu segera bergerak.',
      },
      {
        tempat: 'asrama',
        makna: 1,
        situasi: 'Pengurus asrama menunjukkan dapur bersama kepada penghuni baru.',
        baris: [
          { penutur: 'Pengurus', jp: 'この冷蔵庫{れいぞうこ}は、みんなのです。どうぞ[[使{つか}ってください]]。', id: 'Kulkas ini milik bersama. Silakan dipakai.' },
          { penutur: 'Anda', jp: 'ありがとうございます。', id: 'Terima kasih.' },
        ],
        catatan: 'どうぞ ＋ ～てください = "silakan". Di sini bukan permintaan, melainkan tawaran dan izin.',
      },
      {
        tempat: 'mensetsu',
        makna: 1,
        situasi: 'Latihan mensetsu: peserta mengetuk pintu ruang wawancara.',
        baris: [
          { penutur: 'Pewawancara', jp: 'どうぞ、[[入{はい}ってください]]。', id: 'Silakan masuk.' },
          { penutur: 'Peserta', jp: '失礼{しつれい}します。', id: 'Permisi.' },
          { penutur: 'Pewawancara', jp: 'どうぞ、[[座{すわ}ってください]]。', id: 'Silakan duduk.' },
          { penutur: 'Peserta', jp: 'はい。失礼{しつれい}します。', id: 'Baik. Permisi.' },
        ],
        catatan: 'Di sini ～てください berarti "silakan", bukan "tolong". Jawaban sopan peserta: しつれいします (permisi), lalu masuk atau duduk.',
      },
      {
        tempat: 'belanja',
        makna: 0,
        situasi: 'Di toko jam, Anda ingin melihat jam yang ada di dalam etalase.',
        baris: [
          { penutur: 'Anda', jp: 'すみません、その時計{とけい}を[[見{み}せてください]]。', id: 'Permisi, tolong perlihatkan jam itu.' },
          { penutur: 'Penjual', jp: 'はい、どうぞ。', id: 'Baik, silakan.' },
          { penutur: 'Anda', jp: 'いいですね。じゃ、これをください。', id: 'Bagus, ya. Kalau begitu, saya beli yang ini.' },
        ],
        catatan: 'Bandingkan: みせてください = kata kerja bentuk て ＋ ください (minta dilakukan). これをください = benda ＋ を ＋ ください (minta bendanya).',
      },
    ],
    bandingkan: {
      kolom: [
        { id: 'te-kudasai', pola: '～てください', sub: 'Bab 14' },
        { id: null, pola: 'Nをください', sub: 'Bab 3' },
        { id: null, pola: '～ましょうか', sub: 'Bab 14' },
      ],
      baris: [
        { label: 'Fungsi', isi: ['meminta orang lain berbuat sesuatu', 'meminta atau membeli benda', 'menawarkan bantuan dari saya'] },
        { label: 'Padanan', isi: ['tolong … / silakan …', 'minta … / saya beli …', 'perlu saya …? / saya …, ya?'] },
        { label: 'Contoh', jp: true, isi: ['窓{まど}を[[開{あ}けてください]]。', '水{みず}を[[ください]]。', '窓{まど}を[[開{あ}けましょうか]]。'] },
      ],
      kaki: 'Kata kerja ＋ ください harus memakai bentuk て. Benda ＋ を ＋ ください tidak memakai bentuk て.',
    },
    kesalahan: [
      { salah: '待{ま}ちてください', benar: '[[待{ま}ってください]]', alasan: 'Di Grup 1, bentuk て tidak dibuat dengan membuang ます saja. Bunyi ち berubah menjadi って: まちます → まって.' },
      { salah: '書{か}ってください', benar: '[[書{か}いてください]]', alasan: 'Kata kerja yang berakhir き memakai いて: かきます → かいて.' },
      { salah: '行{い}いてください', benar: '[[行{い}ってください]]', alasan: 'いきます adalah pengecualian: bentuk て-nya いって, bukan いいて.' },
    ],
    latihan: [
      { tanya: 'Ubah ke bentuk ～てください:', jp: '書{か}きます ・ 待{ま}ちます ・ 読{よ}みます ・ 来{き}ます', jawabJp: '書{か}いてください ・ 待{ま}ってください ・ 読{よ}んでください ・ 来{き}てください' },
      { tanya: 'Anda mempersilakan tamu masuk ke kamar. Kata mana yang tepat?', jp: '（a. どうぞ ／ b. すみません）、入{はい}ってください。', jawab: 'a. どうぞ dipakai untuk mempersilakan. すみません dipakai untuk meminta tolong.' },
      { tanya: 'Terjemahkan: "Tolong tulis nama dan alamat di sini."', jawabJp: 'ここに名前{なまえ}と住所{じゅうしょ}を書{か}いてください。' },
    ],
    ringkasan: [
      'Bentuk: bentuk て ＋ ください. Bentuk て mengikuti grup kata kerja (かいて, まって, よんで, いって, して, きて).',
      'Dua fungsi: meminta atau memberi instruksi ("tolong …") dan mempersilakan ("silakan …", sering dengan どうぞ).',
      'Untuk meminta benda, pakai benda ＋ を ＋ ください, tanpa bentuk て.',
    ],
    terkait: ['te-imasu', 'naide-kudasai', 'te-mo-ii', 'te-kara', 'kata'],
    catatanSensei: [
      'Bab 14 adalah bab pertama bentuk て. Latih perubahannya berirama ("き → いて, ぎ → いで, …") sebelum masuk ke makna.',
      'Kepada atasan, ～てください bisa terdengar menyuruh. Ajarkan すみません di depannya. Bentuk yang lebih sopan (～ていただけませんか) baru muncul di Bab 26.',
      'Peragakan di kelas: sensei memberi instruksi (たってください, すわってください), peserta bergerak. Lalu peserta bergantian memberi instruksi.',
      'Di mensetsu sungguhan pewawancara biasanya berkata どうぞ、おかけください (bentuk hormat dari すわってください, Bab 49). Kenalkan sebagai ungkapan untuk dikenali, bukan untuk dibuat.',
    ],
  },

  // ～ています (Bab 14 sedang, Bab 15 keadaan & pekerjaan, Bab 28 kebiasaan). Each example keeps to the bab of the
  // meaning it shows; the Bab 28 one is labelled lanjutan.
  {
    id: 'te-imasu',
    status: 'draf',
    inti: 'Sedang berlangsung, keadaan hasil, atau kegiatan rutin.',
    rumusKolom: { dasar: 'Bentuk ます', antara: 'Bentuk て', hasil: '＋います' },
    rumusPengantar: 'Ubah kata kerja ke bentuk て, lalu tambahkan います. Cara membuat bentuk て sama dengan ～てください (Bab 14).',
    rumus: [
      { jenis: 'Grup 1', dasar: '読{よ}みます', antara: '読{よ}んで', hasil: '読{よ}んで[[います]]' },
      { jenis: '', dasar: '降{ふ}ります', antara: '降{ふ}って', hasil: '降{ふ}って[[います]]' },
      { jenis: 'Grup 2', dasar: '寝{ね}ます', antara: '寝{ね}て', hasil: '寝{ね}て[[います]]' },
      { jenis: 'Grup 3', dasar: 'します・来{き}ます', antara: 'して・来{き}て', hasil: 'して[[います]]・来{き}て[[います]]' },
      { jenis: 'Negatif', dasar: '読{よ}みます', antara: '読{よ}んで', hasil: '読{よ}んで[[いません]]' },
      { jenis: 'Kata khusus', dasar: '知{し}ります', antara: '知{し}って', hasil: '知{し}って[[います]]', catatan: 'negatif: しりません' },
    ],
    makna: [
      {
        judul: 'Sedang berlangsung',
        penjelasan: 'Kegiatan yang sedang berjalan pada saat bicara.',
        padanan: ['sedang …', 'lagi …'],
        contohMini: { jp: 'いま、雨{あめ}が[[降{ふ}っています]]。', id: 'Sekarang sedang hujan.' },
      },
      {
        judul: 'Keadaan hasil',
        penjelasan: 'Sesuatu sudah terjadi dan hasilnya masih berlaku sekarang: menikah, tahu, tinggal, punya.',
        padanan: ['sudah … (sampai sekarang)', 'tahu / tinggal / punya'],
        contohMini: { jp: 'サリさんは車{くるま}を[[持{も}っています]]。', id: 'Sari punya mobil.' },
      },
      {
        judul: 'Pekerjaan & kegiatan rutin',
        penjelasan: 'Pekerjaan atau usaha yang terus berjalan. Kebiasaan pribadi (setiap pagi …, biasanya …) adalah pemakaian lanjutan, Bab 28.',
        padanan: ['bekerja di …', 'membuat / menjual …', 'biasanya …'],
        contohMini: { jp: '姉{あね}は病院{びょういん}で[[働{はたら}いています]]。', id: 'Kakak perempuan saya bekerja di rumah sakit.' },
      },
    ],
    perhatikan: 'Peserta sering menyamakan ～ています dengan "sedang". Itu hanya benar untuk makna ①. けっこんしています berarti "sudah menikah", bukan "sedang menikah" (yang artinya sedang di acara pernikahan). しっています cukup "tahu", すんでいます cukup "tinggal". Sebaliknya, "sudah" untuk status sekarang menjadi ～ています, bukan ～ました.',
    contoh: [
      {
        tempat: 'telepon',
        makna: 0,
        situasi: 'Malam hari, seorang teman menelepon Anda.',
        baris: [
          { penutur: 'Teman', jp: 'ブディさん、いま何{なに}を[[しています]]か。', id: 'Budi, sekarang kamu sedang apa?' },
          { penutur: 'Anda', jp: '寮{りょう}で晩{ばん}ごはんを[[食{た}べています]]。', id: 'Saya sedang makan malam di asrama.' },
          { penutur: 'Teman', jp: 'そうですか。じゃ、またあとで。', id: 'Oh, begitu. Kalau begitu, nanti saja.' },
        ],
        catatan: 'Kegiatan yang sedang berjalan saat bicara. Di sini padanan "sedang" tepat.',
      },
      {
        tempat: 'asrama',
        makna: 1,
        situasi: 'Teman sekamar perlu menelepon kantor asrama.',
        baris: [
          { penutur: 'Teman', jp: 'サリさん、事務所{じむしょ}の電話番号{でんわばんごう}を[[知{し}っています]]か。', id: 'Sari, kamu tahu nomor telepon kantor?' },
          { penutur: 'Anda', jp: 'いいえ、知{し}りません。', id: 'Tidak, saya tidak tahu.' },
        ],
        catatan: 'しっています = "tahu" (keadaan), bukan "sedang tahu". Jawaban negatifnya しりません, bukan しっていません.',
      },
      {
        tempat: 'mensetsu',
        makna: 1,
        situasi: 'Latihan mensetsu: pewawancara menanyakan data pribadi peserta.',
        baris: [
          { penutur: 'Pewawancara', jp: '[[結婚{けっこん}しています]]か。', id: 'Apakah Anda sudah menikah?' },
          { penutur: 'Peserta', jp: 'いいえ、独身{どくしん}です。', id: 'Belum, saya masih lajang.' },
          { penutur: 'Pewawancara', jp: 'どこに[[住{す}んでいます]]か。', id: 'Anda tinggal di mana?' },
          { penutur: 'Peserta', jp: 'ジャカルタに[[住{す}んでいます]]。', id: 'Saya tinggal di Jakarta.' },
        ],
        catatan: 'けっこんしています = "sudah menikah" (statusnya sekarang), bukan "sedang menikah". Pertanyaan seperti ini sering muncul di mensetsu.',
      },
      {
        tempat: 'kerja',
        makna: 2,
        situasi: 'Hari pertama di perusahaan: staf memperkenalkan perusahaan kepada pemagang baru.',
        baris: [
          { penutur: 'Staf', jp: 'この会社{かいしゃ}は、ドアや窓{まど}を[[作{つく}っています]]。', id: 'Perusahaan ini membuat pintu, jendela, dan lain-lain.' },
          { penutur: 'Staf', jp: 'インドネシアの人{ひと}も10人{にん}[[働{はたら}いています]]。', id: 'Ada 10 orang Indonesia juga yang bekerja di sini.' },
          { penutur: 'Anda', jp: 'そうですか。よろしくお願{ねが}いします。', id: 'Oh, begitu. Mohon bimbingannya.' },
        ],
        catatan: 'Usaha perusahaan dan pekerjaan orang memakai ～ています karena terus berjalan. Dalam bahasa Indonesia cukup "membuat", "bekerja".',
      },
      {
        tempat: 'kelas',
        makna: 2,
        label: 'Kebiasaan · lanjutan Bab 28',
        situasi: 'Sensei bertanya tentang kegiatan peserta di hari libur.',
        baris: [
          { penutur: 'Sensei', jp: '休{やす}みの日{ひ}は、何{なに}を[[しています]]か。', id: 'Di hari libur, biasanya kamu melakukan apa?' },
          { penutur: 'Peserta', jp: 'たいてい、友達{ともだち}とサッカーを[[しています]]。', id: 'Biasanya saya main sepak bola dengan teman.' },
          { penutur: 'Sensei', jp: 'そうですか。いいですね。', id: 'Oh, begitu. Asyik, ya.' },
        ],
        catatan: 'Kegiatan yang diulang terus juga memakai ～ています, sering bersama たいてい atau まいあさ. Pemakaian ini dibahas lengkap di Bab 28.',
      },
    ],
    bandingkan: {
      kolom: [
        { id: 'te-imasu', pola: '～ています', sub: 'Bab 14・15' },
        { id: null, pola: '～ます', sub: 'Bab 4' },
        { id: null, pola: '～ました', sub: 'Bab 4' },
      ],
      baris: [
        { label: 'Kegiatan', jp: true, isi: ['[[食{た}べています]]', '[[食{た}べます]]', '[[食{た}べました]]'] },
        { label: 'Artinya', isi: ['sedang makan', 'akan makan / biasa makan', 'sudah makan'] },
        { label: 'Keadaan', jp: true, isi: ['[[結婚{けっこん}しています]]', '[[結婚{けっこん}します]]', '[[結婚{けっこん}しました]]'] },
        { label: 'Artinya', isi: ['sudah menikah (statusnya sekarang)', 'akan menikah', 'menikah (peristiwanya)'] },
      ],
      kaki: '"Sudah" dalam bahasa Indonesia bisa menjadi ～ました (peristiwa) atau ～ています (status sekarang).',
    },
    kesalahan: [
      { salah: '（知{し}っていますか。）いいえ、知{し}っていません。', benar: 'いいえ、[[知{し}りません]]。', alasan: 'Untuk "tidak tahu", bentuk negatifnya しりません. しっていません tidak dipakai.' },
      { salah: '（結婚{けっこん}していますか。）はい、結婚{けっこん}します。', benar: 'はい、[[結婚{けっこん}しています]]。', alasan: 'Untuk "sudah menikah" pakai けっこんしています. けっこんします berarti "akan menikah".' },
      { salah: '（どこに住{す}んでいますか。）ジャカルタに住{す}みます。', benar: 'ジャカルタに[[住{す}んでいます]]。', alasan: 'すみます berarti "akan tinggal" (pindah nanti). Untuk tempat tinggal sekarang, pakai すんでいます.' },
    ],
    latihan: [
      { tanya: 'Ubah ke bentuk ～ています:', jp: '読{よ}みます ・ 待{ま}ちます ・ 寝{ね}ます ・ します', jawabJp: '読{よ}んでいます ・ 待{ま}っています ・ 寝{ね}ています ・ しています' },
      { tanya: 'Sedang, keadaan, atau pekerjaan?', jp: '① 姉{あね}は結婚{けっこん}しています。 ② いま雨{あめ}が降{ふ}っています。 ③ 父{ちち}は銀行{ぎんこう}で働{はたら}いています。', jawab: '① keadaan (sudah menikah) · ② sedang (hujan) · ③ pekerjaan' },
      { tanya: 'Terjemahkan: "Kakak laki-laki saya sudah menikah."', jawabJp: '兄{あに}は結婚{けっこん}しています。' },
    ],
    ringkasan: [
      'Bentuk: bentuk て ＋ います (よんでいます, ねています, しています). Negatif: ～ていません.',
      'Tiga makna: sedang berlangsung, keadaan hasil (sudah menikah, tahu, tinggal), dan pekerjaan/kegiatan rutin.',
      '"Sedang" hanya cocok untuk makna pertama. しっています = tahu; negatifnya しりません.',
    ],
    terkait: ['te-kudasai', 'te-kara', 'te-mo-ii'],
    catatanSensei: [
      'Pastikan peserta lancar membuat bentuk て (materi ～てください) sebelum masuk ke makna ② dan ③.',
      'Urutan di kelas: makna ① di Bab 14, makna ② dan pekerjaan di Bab 15, kebiasaan (contoh 5) saat Bab 28. Slide bisa dilompati lewat strip navigasi.',
      'Peragakan beda けっこんします (akan), けっこんしました (peristiwa), dan けっこんしています (status) dengan garis waktu di papan.',
    ],
  },

  // ～と (Bab 23). Example sentences stay within Bab 1–23, so the correction for "と + request" uses ～てから, not ～たら.
  {
    id: 'to',
    status: 'draf',
    inti: 'Setiap kali A terjadi, B pasti ikut terjadi.',
    rumusKolom: { dasar: 'Bentuk ます', antara: 'Bentuk kamus / ない', hasil: '＋と' },
    rumusPengantar: 'Ubah kata kerja ke bentuk kamus (Bab 18) atau bentuk ない (Bab 17), lalu tambahkan と.',
    rumus: [
      { jenis: 'Grup 1', dasar: '押{お}します', antara: '押{お}す', hasil: '押{お}す[[と]]' },
      { jenis: '', dasar: '曲{ま}がります', antara: '曲{ま}がる', hasil: '曲{ま}がる[[と]]' },
      { jenis: '', dasar: 'なります', antara: 'なる', hasil: 'なる[[と]]' },
      { jenis: 'Grup 2', dasar: '入{い}れます', antara: '入{い}れる', hasil: '入{い}れる[[と]]' },
      { jenis: 'Grup 3', dasar: 'します・来{き}ます', antara: 'する・来{く}る', hasil: 'する[[と]]・来{く}る[[と]]', catatan: 'きます → くる' },
      { jenis: 'Negatif', dasar: '押{お}しません', antara: '押{お}さない', hasil: '押{お}さない[[と]]' },
    ],
    makna: [
      {
        judul: 'Hasil otomatis',
        penjelasan: 'Setiap kali A terjadi, B selalu ikut terjadi: cara kerja alat, alam, tubuh. B bukan kemauan pembicara.',
        padanan: ['kalau …', 'begitu …', 'setiap kali …'],
        contohMini: { jp: 'たくさん[[歩{ある}くと]]、足{あし}が痛{いた}くなります。', id: 'Kalau banyak berjalan, kaki jadi sakit.' },
      },
      {
        judul: 'Petunjuk arah',
        penjelasan: 'Kalau Anda berjalan atau berbelok di A, Anda akan menemukan B. Kalimat B menyebut apa yang ada di sana.',
        padanan: ['kalau …, nanti ada …', 'begitu …, ketemu …'],
        contohMini: { jp: 'この道{みち}をまっすぐ[[行{い}くと]]、駅{えき}があります。', id: 'Kalau jalan lurus terus di jalan ini, nanti ada stasiun.' },
      },
    ],
    perhatikan: 'Kata "kalau" jauh lebih luas daripada ～と. ～と hanya untuk hasil yang pasti terjadi setiap kali A terjadi: cara kerja alat, alam, tubuh, dan arah jalan. Bila B berupa permintaan, ajakan, keinginan, atau niat ("kalau sudah pulang, tolong telepon"), ～と salah. Padanan "begitu …" atau "setiap kali …" sering lebih dekat.',
    contoh: [
      {
        tempat: 'kerja',
        makna: 0,
        situasi: 'Senpai memperingatkan pemagang baru di area kerja.',
        baris: [
          { penutur: 'Senpai', jp: 'あ、そこは手{て}で[[触{さわ}ると]]、危{あぶ}ないですよ。', id: 'Eh, bagian itu berbahaya kalau disentuh dengan tangan.' },
          { penutur: 'Anda', jp: 'すみません。気{き}をつけます。', id: 'Maaf. Saya akan hati-hati.' },
        ],
        catatan: 'Bagian itu selalu berbahaya bila disentuh, oleh siapa pun dan kapan pun. Peringatan keselamatan kerja sering memakai ～と.',
      },
      {
        tempat: 'asrama',
        makna: 0,
        situasi: 'Pengurus asrama menjelaskan cara memakai shower.',
        baris: [
          { penutur: 'Pengurus', jp: 'シャワーは、左{ひだり}へ[[回{まわ}すと]]、お湯{ゆ}が出{で}ます。', id: 'Shower ini, kalau diputar ke kiri, keluar air panas.' },
          { penutur: 'Anda', jp: '右{みぎ}へ[[回{まわ}すと]]、どうなりますか。', id: 'Kalau diputar ke kanan, bagaimana?' },
          { penutur: 'Pengurus', jp: '冷{つめ}たい水{みず}が出{で}ます。', id: 'Keluar air dingin.' },
        ],
        catatan: 'Cara kerja alat selalu sama setiap kali dipakai, jadi cocok dengan ～と. Pertanyaan ～と、どうなりますか juga sering dipakai.',
      },
      {
        tempat: 'jalan',
        makna: 1,
        situasi: 'Anda menanyakan jalan ke stasiun kepada orang di jalan.',
        baris: [
          { penutur: 'Anda', jp: 'すみません、駅{えき}はどこですか。', id: 'Permisi, stasiun di mana, ya?' },
          { penutur: 'Orang di jalan', jp: 'あの橋{はし}を[[渡{わた}ると]]、すぐ左{ひだり}にありますよ。', id: 'Kalau Anda menyeberangi jembatan itu, stasiunnya langsung di sebelah kiri.' },
          { penutur: 'Anda', jp: 'ありがとうございます。', id: 'Terima kasih.' },
        ],
        catatan: 'Pada petunjuk arah, ～と berarti "kalau (Anda) …, nanti ketemu …". Kalimat B menyebut apa yang ada di sana.',
      },
      {
        tempat: 'kelas',
        makna: 0,
        situasi: 'Sensei bercerita tentang musim di Jepang kepada peserta yang akan berangkat.',
        baris: [
          { penutur: 'Sensei', jp: '日本{にほん}は12月{がつ}に[[なると]]、寒{さむ}くなりますよ。', id: 'Di Jepang, begitu masuk bulan Desember, cuacanya jadi dingin, lho.' },
          { penutur: 'Peserta', jp: 'じゃ、冬{ふゆ}の服{ふく}を買{か}わなければなりませんね。', id: 'Kalau begitu, saya harus beli baju musim dingin, ya.' },
        ],
        catatan: 'Pergantian musim selalu terjadi dengan cara yang sama, jadi ～と cocok. Pola ～になると、～くなります sering dipakai.',
      },
      {
        tempat: 'rumahsakit',
        makna: 0,
        situasi: 'Di klinik, dokter menjelaskan obat flu.',
        baris: [
          { penutur: 'Dokter', jp: 'この薬{くすり}を[[飲{の}むと]]、眠{ねむ}くなります。ですから、自転車{じてんしゃ}に乗{の}らないでください。', id: 'Kalau minum obat ini, Anda akan mengantuk. Jadi, jangan naik sepeda, ya.' },
          { penutur: 'Anda', jp: 'はい、わかりました。', id: 'Baik, saya mengerti.' },
        ],
        catatan: 'B dari ～と adalah ねむくなります (pasti terjadi). Larangan ～ないでください ada di kalimat baru sesudah ですから, bukan sesudah ～と.',
      },
    ],
    bandingkan: {
      kolom: [
        { id: 'to', pola: '～と', sub: 'Bab 23' },
        { id: 'tara', pola: '～たら', sub: 'Bab 25', lanjutan: true },
        { id: 'ba', pola: '～ば', sub: 'Bab 35', lanjutan: true },
        { id: 'nara', pola: '～なら', sub: 'Bab 35', lanjutan: true },
      ],
      baris: [
        { label: 'Inti', isi: ['A → B selalu / otomatis terjadi', 'A terjadi dulu → B', 'A adalah syarat agar B terwujud', 'kalau memang A (sering ucapan lawan bicara) → saran / sikap'] },
        { label: 'Diikuti permintaan, ajakan, keinginan?', isi: ['❌ tidak', '✅ boleh', '⚠️ boleh bila A keadaan (あれば, やすければ)', '✅ boleh'] },
        { label: 'Urutan waktu', isi: ['A lalu langsung B', 'A lalu B', 'A lalu B', 'B boleh lebih dulu'] },
        { label: 'Contoh', jp: true, isi: ['このボタンを[[押{お}すと]]、お湯{ゆ}が出{で}ます。', '駅{えき}に[[着{つ}いたら]]、電話{でんわ}してください。', '練習{れんしゅう}[[すれば]]、上手{じょうず}になります。', '日本{にほん}へ[[行{い}くなら]]、冬{ふゆ}の服{ふく}を持{も}って行{い}ってください。'] },
      ],
      kaki: '～と hanya untuk hasil yang pasti. Untuk permintaan atau rencana, nanti pakai ～たら (Bab 25).',
    },
    kesalahan: [
      { salah: '仕事{しごと}が終{お}わると、電話{でんわ}してください。', benar: '仕事{しごと}が[[終{お}わってから]]、電話{でんわ}してください。', alasan: 'Sesudah ～と tidak boleh ada permintaan, ajakan, atau keinginan. Pakai ～てから (nanti juga ～たら, Bab 25).' },
      { salah: 'このボタンを押{お}しないと、動{うご}きません。', benar: 'このボタンを[[押{お}さないと]]、動{うご}きません。', alasan: 'Bentuk ない dari おします adalah おさない. と menempel pada bentuk kamus atau bentuk ない yang benar.' },
    ],
    latihan: [
      { tanya: 'Ubah ke bentuk ～と:', jp: '押{お}します ・ 曲{ま}がります ・ 来{き}ます', jawabJp: '押{お}すと ・ 曲{ま}がると ・ 来{く}ると' },
      { tanya: 'Pilih yang benar:', jp: 'うちへ（a. 帰{かえ}ると ／ b. 帰{かえ}ってから）、メールしてください。', jawab: 'b. Kalimat sesudahnya permintaan (～てください), jadi ～と tidak bisa dipakai.' },
      { tanya: 'Terjemahkan: "Kalau belok kiri di sudut itu, ada bank."', jawabJp: 'あの角{かど}を左{ひだり}へ曲{ま}がると、銀行{ぎんこう}があります。' },
    ],
    ringkasan: [
      'Bentuk: bentuk kamus atau bentuk ない ＋ と (おすと, まがると, くると, おさないと).',
      'Untuk hasil yang selalu atau otomatis terjadi: alat dan mesin, alam, tubuh, serta petunjuk arah.',
      'Sesudah ～と tidak boleh ada permintaan, ajakan, atau keinginan. Pakai ～てから, atau ～たら (Bab 25).',
    ],
    terkait: ['toki', 'tara', 'ba', 'nara', 'te-kara'],
    catatanSensei: [
      'Ulang bentuk kamus (Bab 18) dan bentuk ない (Bab 17) sebelum masuk ke ～と.',
      'Peragakan dengan benda nyata di kelas: sakelar lampu, kipas, keran. Pertanyaan "kalau ini ditekan, apa yang terjadi?" membuat pola ini mudah diingat.',
      'Peserta akan bertanya bedanya dengan "kalau" lain. Untuk sekarang cukup: ～と = hasil otomatis, tidak bisa diikuti permintaan. ～たら menyusul di Bab 25.',
      '～てから hanya mengganti arti "setelah / kalau sudah". Untuk pengandaian (もし …, "kalau hujan …"), ～てから tidak bisa; tunggu ～たら di Bab 25.',
    ],
  },

  // ～たら (Bab 25): the approved pilot (docs/materi-bunpou/contoh-materi-tara.md) in schema form. Changed from the
  // pilot: both mini examples (the originals were too close to the textbook's own), テスト → 試験 (テスト is Bab 40),
  // and the ～と example in the comparison table.
  {
    id: 'tara',
    status: 'draf',
    inti: 'A terjadi dulu, lalu B.',
    rumusKolom: { dasar: 'Bentuk biasa', antara: 'Bentuk た', hasil: '＋ら' },
    rumusPengantar: 'Kalau sudah bisa membuat bentuk た (Bab 19), tinggal tambahkan ら.',
    rumus: [
      { jenis: 'Kata kerja', dasar: '行{い}く', antara: '行{い}った', hasil: '行{い}った[[ら]]' },
      { jenis: '', dasar: '食{た}べる', antara: '食{た}べた', hasil: '食{た}べた[[ら]]' },
      { jenis: '', dasar: 'する・来{く}る', antara: 'した・来{き}た', hasil: 'した[[ら]]・来{き}た[[ら]]' },
      { jenis: 'Negatif', dasar: '行{い}かない', antara: '行{い}かなかった', hasil: '行{い}かなかった[[ら]]' },
      { jenis: 'Kata sifat -i', dasar: '安{やす}い', antara: '安{やす}かった', hasil: '安{やす}かった[[ら]]' },
      { jenis: '', dasar: 'いい', antara: 'よかった', hasil: 'よかった[[ら]]', catatan: 'bukan いいたら' },
      { jenis: 'Kata sifat -na', dasar: '暇{ひま}だ', antara: '暇{ひま}だった', hasil: '暇{ひま}だった[[ら]]' },
      { jenis: 'Kata benda', dasar: '雨{あめ}だ', antara: '雨{あめ}だった', hasil: '雨{あめ}だった[[ら]]' },
    ],
    makna: [
      {
        judul: 'Urutan pasti',
        penjelasan: 'A pasti terjadi, B dilakukan sesudahnya.',
        padanan: ['kalau sudah …', 'setelah …', 'nanti kalau …'],
        contohMini: { jp: '6時{じ}に[[なったら]]、帰{かえ}りましょう。', id: 'Nanti kalau sudah jam 6, kita pulang.' },
      },
      {
        judul: 'Pengandaian',
        penjelasan: 'A belum tentu terjadi. Sering diawali もし.',
        padanan: ['kalau …', 'jika …', 'seandainya …'],
        contohMini: { jp: 'もしあした雨{あめ}[[だったら]]、うちで勉強{べんきょう}します。', id: 'Seandainya besok hujan, saya belajar di rumah saja.' },
      },
    ],
    perhatikan: 'Kata "kalau" mencakup empat pola Jepang: ～たら, ～と, ～ば, dan ～なら. Dari keempatnya, ～たら paling luas: hampir selalu benar bila A terjadi lebih dulu daripada B, dan kalimat sesudahnya boleh berupa permintaan, ajakan, atau keinginan. ～たら juga berarti "setelah", yang dalam bahasa Indonesia memakai kata lain.',
    contoh: [
      {
        tempat: 'kerja',
        makna: 0,
        situasi: 'Senpai mengajak istirahat setelah bersih-bersih area kerja.',
        baris: [
          { penutur: 'Senpai', jp: '掃除{そうじ}が[[終{お}わったら]]、休{やす}みましょう。', id: 'Kalau bersih-bersihnya sudah selesai, kita istirahat.' },
          { penutur: 'Anda', jp: 'はい、わかりました。', id: 'Baik, saya mengerti.' },
        ],
        catatan: 'Bersih-bersih pasti akan selesai, jadi ～たら di sini berarti "kalau sudah / setelah".',
      },
      {
        tempat: 'asrama',
        makna: 1,
        situasi: 'Pengurus asrama menjelaskan apa yang harus dilakukan kalau sakit.',
        baris: [
          { penutur: null, jp: 'もし熱{ねつ}が[[あったら]]、すぐ会社{かいしゃ}に電話{でんわ}してください。', id: 'Kalau (seandainya) kamu demam, segera telepon perusahaan.' },
        ],
        catatan: 'Belum tentu demam, jadi ini pengandaian. もし menegaskan "seandainya". Bentuk た dari あります adalah あった.',
      },
      {
        tempat: 'kelas',
        makna: 0,
        situasi: 'Peserta bertanya kepada sensei saat ujian.',
        baris: [
          { penutur: 'Peserta', jp: '先生{せんせい}、試験{しけん}が[[終{お}わったら]]、帰{かえ}ってもいいですか。', id: 'Sensei, kalau ujiannya sudah selesai, boleh saya pulang?' },
          { penutur: 'Sensei', jp: 'ええ、いいですよ。', id: 'Ya, boleh.' },
        ],
        catatan: 'Kalimat sesudah ～たら boleh berupa permintaan izin (～てもいいですか). Ini salah satu kelebihan ～たら.',
      },
      {
        tempat: 'tawar',
        makna: 1,
        label: 'Ungkapan tetap',
        situasi: 'Anda memberi kopi oleh-oleh dari Indonesia kepada rekan kerja orang Jepang.',
        baris: [
          { penutur: null, jp: 'これ、インドネシアのコーヒーです。[[よかったら]]、どうぞ。', id: 'Ini kopi Indonesia. Kalau berkenan, silakan.' },
        ],
        catatan: 'よかったら adalah cara sopan untuk menawarkan sesuatu. Asalnya いい → よかった → よかったら, bukan いいたら.',
      },
      {
        tempat: 'mensetsu',
        makna: 0,
        situasi: 'Latihan mensetsu: pewawancara menanyakan rencana peserta.',
        baris: [
          { penutur: 'Pewawancara', jp: '日本{にほん}へ[[行{い}ったら]]、何{なに}をしたいですか。', id: 'Kalau nanti sudah di Jepang, Anda ingin melakukan apa?' },
          { penutur: 'Peserta', jp: '富士山{ふじさん}に登{のぼ}りたいです。', id: 'Saya ingin mendaki Gunung Fuji.' },
        ],
        catatan: 'Mendaki terjadi sesudah tiba di Jepang. Itulah ciri ～たら: A dulu, baru B.',
      },
    ],
    bandingkan: {
      kolom: [
        { id: 'tara', pola: '～たら', sub: 'Bab 25' },
        { id: 'to', pola: '～と', sub: 'Bab 23' },
        { id: 'ba', pola: '～ば', sub: 'Bab 35', lanjutan: true },
        { id: 'nara', pola: '～なら', sub: 'Bab 35', lanjutan: true },
      ],
      baris: [
        { label: 'Inti', isi: ['A terjadi dulu → B', 'A → B selalu / otomatis terjadi', 'A adalah syarat agar B terwujud', 'kalau memang A (sering ucapan lawan bicara) → saran / sikap'] },
        { label: 'Diikuti permintaan, ajakan, keinginan?', isi: ['✅ boleh', '❌ tidak', '⚠️ boleh bila A keadaan (あれば, やすければ)', '✅ boleh'] },
        { label: 'Urutan waktu', isi: ['A lalu B', 'A lalu langsung B', 'A lalu B', 'B boleh lebih dulu'] },
        { label: 'Contoh', jp: true, isi: ['駅{えき}に[[着{つ}いたら]]、電話{でんわ}してください。', 'このボタンを[[押{お}すと]]、お湯{ゆ}が出{で}ます。', '練習{れんしゅう}[[すれば]]、上手{じょうず}になります。', '日本{にほん}へ[[行{い}くなら]]、冬{ふゆ}の服{ふく}を持{も}って行{い}ってください。'] },
      ],
      kaki: 'Ragu memilih "kalau" yang mana? ～たら adalah pilihan paling aman.',
    },
    kesalahan: [
      { salah: '雨{あめ}が降{ふ}るたら', benar: '雨{あめ}が[[降{ふ}ったら]]', alasan: 'ら menempel pada bentuk た, bukan bentuk kamus.' },
      { salah: 'いいたら', benar: '[[よかったら]]', alasan: 'Bentuk た dari いい adalah よかった.' },
      { salah: '駅{えき}に着{つ}くと、電話{でんわ}してください。', benar: '駅{えき}に[[着{つ}いたら]]、電話{でんわ}してください。', alasan: '～と tidak boleh diikuti permintaan atau ajakan, sedangkan ～たら boleh.' },
    ],
    latihan: [
      { tanya: 'Ubah ke bentuk ～たら:', jp: '終{お}わる ・ 安{やす}い ・ 暇{ひま}だ', jawabJp: '終{お}わったら ・ 安{やす}かったら ・ 暇{ひま}だったら' },
      { tanya: 'Pilih yang benar:', jp: '駅{えき}に（a. 着{つ}くと ／ b. 着{つ}いたら）、電話{でんわ}してください。', jawab: 'b. Kalimat sesudahnya permintaan, jadi ～と tidak bisa dipakai.' },
      { tanya: 'Terjemahkan: "Kalau sudah sampai di asrama, tolong telepon saya."', jawabJp: '寮{りょう}に着{つ}いたら、電話{でんわ}してください。' },
    ],
    ringkasan: [
      'Bentuk: bentuk た ＋ ら (いい → よかったら).',
      'Dua makna: "kalau sudah / setelah" (A pasti) dan "kalau / seandainya" (A belum pasti, sering dengan もし).',
      'Kalimat sesudahnya bebas: boleh berupa permintaan, ajakan, atau keinginan.',
    ],
    terkait: ['to', 'temo', 'ba', 'nara', 'tara-ii-desu-ka'],
    catatanSensei: [
      'Ulang bentuk た (Bab 19) selama 2–3 menit sebelum masuk ke ～たら. Kebanyakan kesalahan peserta berasal dari bentuk た.',
      'Ajarkan makna ① lebih dulu. Contohnya mudah dibayangkan dari rutinitas sehari-hari (kerja, asrama).',
      'Kesalahan ～と ＋ ～てください hampir pasti muncul karena ～と baru dipelajari di Bab 23. Pakai slide Kesalahan.',
      'Bentuk た di ～たら bukan tanda lampau: ～になったら dipakai untuk hal yang akan datang. Untuk cerita lampau ("kemarin setelah pulang, saya makan"), pakai ～てから, bukan ～たら.',
    ],
  },
];
