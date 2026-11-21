// Content of the N4 materials (patterns first taught in Minna no Nihongo II, Bab 26–50, or only in the 111 Bunpo N4
// module). Data only; shape and limits in docs/materi-bunpou/spek-kode.md § 1.2, checked by validasiIsi (index.js).
// Written by Claude, status 'draf' until a sensei has checked it.

export const MATERI_N4 = [
  // ～ば (Bab 35, modul #12). Includes [kata tanya] V-ばいいですか, taught in the same bab and not a catalog entry of
  // its own. Example sentences stay within Bab 1–35 (no ～ようになる, ～ので).
  {
    id: 'ba',
    status: 'draf',
    inti: 'Kalau syarat A terpenuhi, hasilnya B.',
    rumusKolom: { dasar: 'Bentuk kamus', hasil: 'Bentuk ば' },
    rumusPengantar: 'Kata kerja: bunyi terakhir pindah ke baris え, lalu ＋ ば (いく → いけば). Kata sifat -i: い → ければ. Kata sifat -na dan kata benda: なら.',
    rumus: [
      { jenis: 'Grup 1: u → e ＋ ば', dasar: '行{い}く', hasil: '行{い}[[けば]]' },
      { jenis: '', dasar: 'ある', hasil: 'あ[[れば]]' },
      { jenis: 'Grup 2: る → れば', dasar: '食{た}べる', hasil: '食{た}べ[[れば]]' },
      { jenis: 'Grup 3', dasar: 'する・来{く}る', hasil: '[[すれば]]・来{く}[[れば]]' },
      { jenis: 'Negatif: ない → なければ', dasar: '行{い}かない', hasil: '行{い}か[[なければ]]' },
      { jenis: 'Kata sifat -i: い → ければ', dasar: '安{やす}い', hasil: '安{やす}[[ければ]]' },
      { jenis: '', dasar: 'いい', hasil: '[[よければ]]', catatan: 'bukan いいければ' },
      { jenis: 'Kata sifat -na / benda', dasar: '暇{ひま}だ・雨{あめ}だ', hasil: '暇{ひま}[[なら]]・雨{あめ}[[なら]]', catatan: 'ならば juga boleh' },
    ],
    makna: [
      {
        judul: 'Syarat → hasil',
        penjelasan: 'A adalah syarat. Kalau A terpenuhi, B terjadi atau bisa terwujud. B biasanya hasil, bukan permintaan.',
        padanan: ['jika …', 'kalau …', 'asalkan …'],
        contohMini: { jp: '急{いそ}[[げば]]、間{ま}に合{あ}いますよ。', id: 'Kalau bergegas, masih keburu, kok.' },
      },
      {
        judul: 'Minta petunjuk',
        penjelasan: 'Kata tanya (どう, なに, どこ, なんじ) ＋ ～ばいいですか: bertanya apa yang sebaiknya dilakukan.',
        padanan: ['sebaiknya … bagaimana?', 'perlu … apa / di mana?'],
        contohMini: { jp: '何{なに}を[[持{も}って行{い}けばいい]]ですか。', id: 'Apa saja yang perlu saya bawa?' },
      },
    ],
    perhatikan: 'Padanan "jika" atau "asalkan" cocok karena ～ば menekankan syarat. Tetapi "kalau" bebas diikuti permintaan atau keinginan, sedangkan ～ば tidak: bila A berupa tindakan dan pelakunya sama dengan B, B tidak boleh berupa permintaan, ajakan, atau keinginan. Bila A berupa keadaan (あれば, やすければ), B boleh. Ragu? Pakai ～たら.',
    contoh: [
      {
        tempat: 'kerja',
        makna: 0,
        situasi: 'Pemagang baru pertama kali memakai alat di tempat kerja.',
        baris: [
          { penutur: 'Anda', jp: 'これ、初{はじ}めて使{つか}うんですが……。', id: 'Saya baru pertama kali memakai ini …' },
          { penutur: 'Senpai', jp: '説明書{せつめいしょ}のとおりに[[すれば]]、大丈夫{だいじょうぶ}ですよ。', id: 'Kalau kamu ikuti buku petunjuknya, tidak masalah, kok.' },
          { penutur: 'Anda', jp: 'はい、わかりました。', id: 'Baik, saya mengerti.' },
        ],
        catatan: 'A (mengikuti petunjuk) adalah syarat, B (aman) adalah hasilnya. Inilah pemakaian ～ば yang paling khas.',
      },
      {
        tempat: 'transportasi',
        makna: 0,
        label: 'Negatif: ～なければ',
        situasi: 'Di taksi, Anda menanyakan lama perjalanan ke bandara.',
        baris: [
          { penutur: 'Anda', jp: '空港{くうこう}まで、どのくらいかかりますか。', id: 'Sampai bandara, kira-kira berapa lama?' },
          { penutur: 'Sopir taksi', jp: '道{みち}が[[込{こ}まなければ]]、1時間{じかん}ぐらいです。', id: 'Kalau jalannya tidak macet, sekitar 1 jam.' },
          { penutur: 'Anda', jp: 'そうですか。じゃ、お願{ねが}いします。', id: 'Oh, begitu. Baik, tolong antar ke sana, ya.' },
        ],
        catatan: '～なければ = "kalau tidak …". Jangan tertukar dengan ～なければなりません (harus): di sini tidak ada なりません, jadi artinya syarat.',
      },
      {
        tempat: 'asrama',
        makna: 1,
        situasi: 'AC di kamar rusak. Anda bertanya kepada pengurus asrama.',
        baris: [
          { penutur: 'Anda', jp: 'エアコンが壊{こわ}れたんですが、どう[[すればいい]]ですか。', id: 'AC-nya rusak. Sebaiknya saya bagaimana?' },
          { penutur: 'Pengurus', jp: 'この紙{かみ}に部屋{へや}の番号{ばんごう}を書{か}いて、事務所{じむしょ}に出{だ}してください。', id: 'Tulis nomor kamar di kertas ini, lalu serahkan ke kantor.' },
          { penutur: 'Anda', jp: 'わかりました。', id: 'Baik.' },
        ],
        catatan: 'どう ＋ ～ばいいですか = minta petunjuk. Sangat berguna saat ada masalah. ～たらいいですか (Bab 26) artinya sama.',
      },
      {
        tempat: 'mensetsu',
        makna: 0,
        situasi: 'Latihan mensetsu: pewawancara menanyakan soal lembur.',
        baris: [
          { penutur: 'Pewawancara', jp: '残業{ざんぎょう}は大丈夫{だいじょうぶ}ですか。', id: 'Kalau lembur, tidak apa-apa?' },
          { penutur: 'Peserta', jp: 'はい、大丈夫{だいじょうぶ}です。仕事{しごと}が[[あれば]]、残業{ざんぎょう}もしたいです。', id: 'Ya, tidak apa-apa. Kalau ada pekerjaan, saya juga mau lembur.' },
        ],
        catatan: 'A (あれば) berupa keadaan, jadi B boleh berupa keinginan (～たいです). Bila A berupa tindakan, B seperti ini tidak bisa; pakai ～たら.',
      },
      {
        tempat: 'telepon',
        makna: 1,
        situasi: 'Anda menelepon perusahaan untuk menanyakan jam datang besok.',
        baris: [
          { penutur: 'Anda', jp: 'もしもし、ブディです。あした、何時{なんじ}にそちらへ[[行{い}けばいい]]ですか。', id: 'Halo, saya Budi. Besok saya sebaiknya datang ke sana jam berapa?' },
          { penutur: 'Staf', jp: '9時{じ}に、受付{うけつけ}に来{き}てください。', id: 'Datanglah ke resepsionis jam 9.' },
        ],
        catatan: 'Kata tanya ＋ ～ばいいですか dipakai untuk menanyakan waktu, tempat, atau cara. Jawabannya sering memakai ～てください.',
      },
    ],
    bandingkan: {
      kolom: [
        { id: 'ba', pola: '～ば', sub: 'Bab 35' },
        { id: 'tara', pola: '～たら', sub: 'Bab 25' },
        { id: 'to', pola: '～と', sub: 'Bab 23' },
        { id: 'nara', pola: '～なら', sub: 'Bab 35' },
      ],
      baris: [
        { label: 'Inti', isi: ['A adalah syarat agar B terwujud', 'A terjadi dulu → B', 'A → B selalu / otomatis terjadi', 'kalau memang A (sering ucapan lawan bicara) → saran / sikap'] },
        { label: 'Diikuti permintaan, ajakan, keinginan?', isi: ['⚠️ boleh bila A keadaan (あれば, やすければ)', '✅ boleh', '❌ tidak', '✅ boleh'] },
        { label: 'Urutan waktu', isi: ['A lalu B', 'A lalu B', 'A lalu langsung B', 'B boleh lebih dulu'] },
        { label: 'Contoh', jp: true, isi: ['練習{れんしゅう}[[すれば]]、上手{じょうず}になります。', '駅{えき}に[[着{つ}いたら]]、電話{でんわ}してください。', 'このボタンを[[押{お}すと]]、お湯{ゆ}が出{で}ます。', '日本{にほん}へ[[行{い}くなら]]、冬{ふゆ}の服{ふく}を持{も}って行{い}ってください。'] },
      ],
      kaki: '～ば menekankan syarat. Bila A tindakan dan B permintaan atau keinginan, pakai ～たら.',
    },
    kesalahan: [
      { salah: '駅{えき}に着{つ}けば、電話{でんわ}してください。', benar: '駅{えき}に[[着{つ}いたら]]、電話{でんわ}してください。', alasan: 'A (つく) berupa tindakan dan B permintaan, jadi ～ば tidak cocok. Pakai ～たら.' },
      { salah: '安{やす}いければ', benar: '[[安{やす}ければ]]', alasan: 'Kata sifat -i: い diganti ければ, bukan ditambah.' },
      { salah: 'いいければ', benar: '[[よければ]]', alasan: 'いい adalah bentuk lain dari よい. Bentuk ば dibuat dari よい: よければ.' },
      { salah: '暇{ひま}ければ', benar: '[[暇{ひま}なら]]', alasan: 'Kata sifat -na tidak memakai ければ. Pakai なら.' },
    ],
    latihan: [
      { tanya: 'Ubah ke bentuk ～ば:', jp: '行{い}く ・ ある ・ 安{やす}い ・ 来{く}る', jawabJp: '行{い}けば ・ あれば ・ 安{やす}ければ ・ 来{く}れば' },
      { tanya: 'Pilih yang benar:', jp: '日本{にほん}へ（a. 行{い}けば ／ b. 行{い}ったら）、富士山{ふじさん}に登{のぼ}りたいです。', jawab: 'b. A berupa tindakan (いく) dan B keinginan (～たいです), jadi ～ば tidak cocok.' },
      { tanya: 'Terjemahkan: "Dokumen ini sebaiknya saya serahkan ke mana?"', jawabJp: 'この書類{しょるい}は、どこに出{だ}せばいいですか。' },
    ],
    ringkasan: [
      'Bentuk: kata kerja ke baris え ＋ ば (いけば, あれば, すれば). Kata sifat -i: ければ (よければ). -na/benda: なら.',
      'Makna: syarat → hasil ("jika / asalkan"). Kata tanya ＋ ～ばいいですか = minta petunjuk.',
      'Bila A tindakan dan pelakunya sama, B tidak boleh permintaan, ajakan, atau keinginan; pakai ～たら.',
    ],
    terkait: ['tara', 'to', 'nara', 'tara-ii-desu-ka', 'nakereba-narimasen'],
    catatanSensei: [
      'Latih perubahan ke baris え dengan tabel hiragana (く → け, ぐ → げ, む → め, る → れ) sebelum masuk ke makna.',
      'Peserta sering mengira ～なければ selalu berarti "harus". "Harus" baru lengkap dengan ～なければなりません (Bab 17); tanpa なりません artinya "kalau tidak …".',
      'Aturan "A tindakan + B permintaan" dikenalkan lewat contoh 4 dan slide Kesalahan. Bila pelaku A dan B berbeda, ajakan boleh (たなかさんがくれば、はじめましょう), tapi belum perlu diajarkan. Pegangan: ragu, pakai ～たら.',
      'どう～ばいいですか sama artinya dengan どう～たらいいですか (Bab 26). Keduanya sangat berguna saat ada masalah di asrama atau tempat kerja.',
    ],
  },

  // ～なら (Bab 35, modul #14 仮定 and #15 話題): one material, two meanings. Example sentences stay within Bab 1–35.
  {
    id: 'nara',
    status: 'draf',
    inti: 'Kalau memang A (sering ucapan lawan bicara) → saran/sikap.',
    rumusKolom: { dasar: 'Bentuk biasa', hasil: '＋なら' },
    rumusPengantar: 'Bentuk biasa ＋ なら. Untuk kata benda dan kata sifat -na, だ dibuang: あめなら, ひまなら (bukan ～だなら).',
    rumus: [
      { jenis: 'Kata benda', dasar: '雨{あめ}だ', hasil: '雨{あめ}[[なら]]', catatan: 'だ dibuang' },
      { jenis: 'Kata sifat -na', dasar: '暇{ひま}だ', hasil: '暇{ひま}[[なら]]', catatan: 'だ dibuang' },
      { jenis: 'Kata sifat -i', dasar: '安{やす}い', hasil: '安{やす}い[[なら]]' },
      { jenis: 'Kata kerja', dasar: '行{い}く', hasil: '行{い}く[[なら]]' },
      { jenis: 'Kata kerja negatif', dasar: '行{い}かない', hasil: '行{い}かない[[なら]]' },
    ],
    makna: [
      {
        judul: 'Kalau soal …',
        penjelasan: 'Mengambil topik yang baru disebut lawan bicara, lalu memberi saran atau info tentang topik itu.',
        padanan: ['kalau soal …', 'kalau … sih', 'kalau mencari …'],
        contohMini: { jp: 'すし[[なら]]、あの店{みせ}がおいしいですよ。', id: 'Kalau soal sushi, restoran itu enak, lho.' },
      },
      {
        judul: 'Kalau memang …',
        penjelasan: 'Pengandaian ("kalau memang A"), sering menanggapi rencana atau ucapan orang lain, lalu saran atau sikap. B boleh lebih dulu dari A.',
        padanan: ['kalau (memang) …', 'kalau mau …', 'jika memang …'],
        contohMini: { jp: 'パソコンを[[買{か}うなら]]、この店{みせ}が安{やす}いですよ。', id: 'Kalau mau beli komputer, toko ini murah, lho.' },
      },
    ],
    perhatikan: 'Padanan "kalau soal …" hanya cocok untuk makna ①. Untuk makna ②, "kalau" terlalu luas: ～なら dipakai bila A baru kita dengar atau kita andaikan, lalu kita tanggapi dengan saran atau sikap. B boleh dilakukan sebelum A. Untuk urutan biasa ("kalau sudah sampai, telepon"), pakai ～たら. Hal yang pasti terjadi memakai ～と.',
    contoh: [
      {
        tempat: 'kerja',
        makna: 0,
        situasi: 'Pemagang mencari gunting di tempat kerja.',
        baris: [
          { penutur: 'Anda', jp: 'すみません、はさみはどこですか。', id: 'Permisi, guntingnya di mana, ya?' },
          { penutur: 'Senpai', jp: 'はさみ[[なら]]、あの机{つくえ}の引{ひ}き出{だ}しにありますよ。', id: 'Kalau gunting, ada di laci meja itu.' },
          { penutur: 'Anda', jp: 'ありがとうございます。', id: 'Terima kasih.' },
        ],
        catatan: 'Senpai mengambil kata はさみ dari pertanyaan, lalu memberi info. Polanya: topik dari lawan bicara ＋ なら, lalu jawabannya.',
      },
      {
        tempat: 'asrama',
        makna: 1,
        situasi: 'Teman sekamar bilang besok mau ke rumah sakit.',
        baris: [
          { penutur: 'Teman', jp: 'あした、病院{びょういん}へ行{い}きます。', id: 'Besok saya mau ke rumah sakit.' },
          { penutur: 'Anda', jp: '病院{びょういん}へ[[行{い}くなら]]、保険証{ほけんしょう}を忘{わす}れないでくださいね。', id: 'Kalau mau ke rumah sakit, jangan lupa kartu asuransinya, ya.' },
          { penutur: 'Teman', jp: 'あ、そうですね。ありがとう。', id: 'Oh, iya. Makasih.' },
        ],
        catatan: 'Kartu asuransi disiapkan sebelum berangkat, jadi B terjadi lebih dulu daripada A. Urutan seperti ini cocok dengan ～なら.',
      },
      {
        tempat: 'telepon',
        makna: 1,
        situasi: 'Staf perusahaan menelepon peserta sehari sebelum mensetsu.',
        baris: [
          { penutur: 'Staf', jp: 'あした、会社{かいしゃ}まで何{なん}で来{き}ますか。', id: 'Besok Anda datang ke perusahaan naik apa?' },
          { penutur: 'Anda', jp: 'バスで行{い}きます。', id: 'Saya naik bus.' },
          { penutur: 'Staf', jp: 'バスで[[来{く}るなら]]、「市役所前{しやくしょまえ}」で降{お}りてください。', id: 'Kalau naik bus, turunlah di halte "Shiyakusho-mae".' },
        ],
        catatan: 'Staf menanggapi rencana peserta (naik bus), lalu memberi petunjuk. Permintaan (～てください) boleh sesudah ～なら.',
      },
      {
        tempat: 'mensetsu',
        makna: 1,
        situasi: 'Pewawancara menjelaskan bahwa kadang ada kerja di hari Minggu.',
        baris: [
          { penutur: 'Pewawancara', jp: '忙{いそが}しいときは、日曜日{にちようび}も仕事{しごと}がありますよ。', id: 'Kalau sedang sibuk, hari Minggu pun ada kerja, lho.' },
          { penutur: 'Peserta', jp: 'はい。[[必要{ひつよう}なら]]、日曜日{にちようび}も働{はたら}きます。', id: 'Baik. Kalau memang diperlukan, saya bekerja juga di hari Minggu.' },
        ],
        catatan: 'ひつようなら = "kalau memang perlu". Kata sifat -na langsung ＋ なら, tanpa だ. Jawaban seperti ini memberi kesan siap bekerja.',
      },
      {
        tempat: 'belanja',
        makna: 0,
        situasi: 'Anda bertanya kepada tetangga tempat membeli sayur yang murah.',
        baris: [
          { penutur: 'Anda', jp: '野菜{やさい}を買{か}いたいんですが、安{やす}い店{みせ}はありませんか。', id: 'Saya mau beli sayur. Ada toko yang murah?' },
          { penutur: 'Tetangga', jp: '野菜{やさい}[[なら]]、駅前{えきまえ}のスーパーが安{やす}いですよ。', id: 'Kalau sayur, supermarket di depan stasiun murah, lho.' },
          { penutur: 'Anda', jp: 'そうですか。ありがとうございます。', id: 'Oh, begitu. Terima kasih.' },
        ],
        catatan: 'Tetangga mengambil topik やさい dari pertanyaan Anda. Sesudah ～なら biasanya saran atau info.',
      },
    ],
    bandingkan: {
      kolom: [
        { id: 'nara', pola: '～なら', sub: 'Bab 35' },
        { id: 'tara', pola: '～たら', sub: 'Bab 25' },
        { id: 'to', pola: '～と', sub: 'Bab 23' },
        { id: 'ba', pola: '～ば', sub: 'Bab 35' },
      ],
      baris: [
        { label: 'Inti', isi: ['kalau memang A (sering ucapan lawan bicara) → saran / sikap', 'A terjadi dulu → B', 'A → B selalu / otomatis terjadi', 'A adalah syarat agar B terwujud'] },
        { label: 'Diikuti permintaan, ajakan, keinginan?', isi: ['✅ boleh', '✅ boleh', '❌ tidak', '⚠️ boleh bila A keadaan (あれば, やすければ)'] },
        { label: 'Urutan waktu', isi: ['B boleh lebih dulu', 'A lalu B', 'A lalu langsung B', 'A lalu B'] },
        { label: 'Contoh', jp: true, isi: ['日本{にほん}へ[[行{い}くなら]]、冬{ふゆ}の服{ふく}を持{も}って行{い}ってください。', '駅{えき}に[[着{つ}いたら]]、電話{でんわ}してください。', 'このボタンを[[押{お}すと]]、お湯{ゆ}が出{で}ます。', '練習{れんしゅう}[[すれば]]、上手{じょうず}になります。'] },
      ],
      kaki: '～なら mengambil A sebagai titik tolak (sering ucapan lawan bicara), lalu saran atau sikap. Untuk urutan biasa, pakai ～たら.',
    },
    kesalahan: [
      { salah: '暇{ひま}だなら、来{き}てください。', benar: '[[暇{ひま}なら]]、来{き}てください。', alasan: 'Kata sifat -na dan kata benda langsung ＋ なら; だ dibuang.' },
      { salah: '駅{えき}に着{つ}くなら、電話{でんわ}してください。', benar: '駅{えき}に[[着{つ}いたら]]、電話{でんわ}してください。', alasan: 'Maksudnya "telepon setelah sampai", jadi pakai ～たら. Dengan ～なら artinya jadi "kalau memang akan ke stasiun, telepon dulu sebelum berangkat".' },
      { salah: '冬{ふゆ}になるなら、寒{さむ}くなります。', benar: '冬{ふゆ}に[[なると]]、寒{さむ}くなります。', alasan: 'Hal alam yang pasti terjadi memakai ～と. ～なら dipakai untuk menanggapi hal yang belum pasti atau baru didengar.' },
    ],
    latihan: [
      { tanya: 'Ubah ke bentuk ～なら:', jp: '行{い}く ・ 暇{ひま}だ ・ 雨{あめ}だ ・ 安{やす}い', jawabJp: '行{い}くなら ・ 暇{ひま}なら ・ 雨{あめ}なら ・ 安{やす}いなら' },
      { tanya: 'Pilih yang benar:', jp: '日本{にほん}へ（a. 行{い}ったら ／ b. 行{い}くなら）、早{はや}くパスポートを作{つく}ってください。', jawab: 'b. Paspor dibuat sebelum berangkat (B sebelum A). Dengan ～たら artinya jadi "setelah sampai di Jepang".' },
      { tanya: 'Terjemahkan: "Kalau soal kanji, Tanaka Sensei paham betul, lho."', jawabJp: '漢字{かんじ}なら、田中{たなか}先生{せんせい}が詳{くわ}しいですよ。' },
    ],
    ringkasan: [
      'Bentuk: bentuk biasa ＋ なら. Kata benda dan kata sifat -na tanpa だ (あめなら, ひまなら).',
      'Dua makna: "kalau soal …" (menanggapi topik) dan "kalau memang …" (menanggapi rencana atau keadaan).',
      'Sesudah ～なら biasanya saran, permintaan, atau sikap, dan B boleh terjadi lebih dulu daripada A.',
    ],
    terkait: ['tara', 'ba', 'to'],
    catatanSensei: [
      'Latih berpasangan: satu peserta menyebut rencana ("Saya mau ke Osaka"), pasangannya menanggapi dengan ～なら ＋ saran.',
      'Untuk kata sifat -na dan kata benda, ～なら juga bentuk syarat yang dipakai di materi ～ば (ひまなら, あめなら). Hubungkan kedua materi.',
      'Jangan masuk ke ～たなら atau ～のなら dulu. Cukup bentuk biasa sekarang ＋ なら.',
    ],
  },
];
