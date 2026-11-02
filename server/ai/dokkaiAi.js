import { generateJson, jsonObjectFrom } from './llm.js';
import { KANJI_DIPELAJARI } from '../domain/tesOnline.js';

/**
 * Writes new dokkai passages for one Tes Online code. Only the level, sentence-pattern level, allowed kanji and topic
 * hints go to the model, never peserta data. What comes back is raw: domain/tesOnline.js validasiBacaanAi checks every passage,
 * and a sensei reviews the set before the code can be used.
 */

// Everyday topics close to the peserta's life now and later in Japan; each request draws a few at random.
export const TOPIK_DOKKAI = [
  'keluarga', 'hobi', 'cuaca dan musim', 'belanja di supermarket', 'makan di restoran', 'naik kereta atau bus',
  'kantor pos', 'pergi ke dokter', 'kelas bahasa Jepang', 'kerja paruh waktu', 'libur akhir pekan', 'ulang tahun teman',
  'hewan peliharaan', 'kamar atau apartemen', 'olahraga', 'memasak di rumah', 'perpustakaan', 'pesan telepon',
  'email kepada teman', 'pengumuman di kantor', 'festival musim panas', 'salju di musim dingin', 'perjalanan wisata',
  'petunjuk jalan', 'jadwal minggu ini', 'membeli pakaian', 'flu dan istirahat', 'aturan di asrama', 'teman sekamar',
  'hari pertama kerja di pabrik', 'jam kerja dan istirahat', 'membuang sampah sesuai aturan', 'mengirim uang ke keluarga',
  'belajar untuk ujian', 'taman di dekat rumah', 'membeli tiket', 'barang yang hilang', 'tetangga baru',
];

// L1-L5: length and kind of text, the same steps as the fixed bank (bankSoal/dokkaiN5.js).
const PANDUAN_LEVEL = {
  L1: 'Level 1: 3 kalimat sangat pendek tentang hal sehari-hari (benda, keluarga, angka, waktu, suka/tidak suka).',
  L2: 'Level 2: 3-4 kalimat tentang rutinitas, tempat, transportasi, atau belanja, dengan angka, harga, jam, atau satuan.',
  L3: 'Level 3: 3-4 kalimat berupa pengumuman, informasi, atau cerita dengan alasan sederhana.',
  L4: 'Level 4: 4-5 kalimat tentang jadwal atau rencana dengan beberapa detail (hari, jam, tempat, harga).',
  L5: 'Level 5: 5-7 kalimat berupa surat, email, pesan, atau cerita pendek; satu soal meminta simpulan sederhana.',
};

// Sentence-pattern level: grammar and vocabulary only. Kanji always come from the code's kanji volumes.
const PANDUAN_JLPT = {
  N5: `Pola kalimat JLPT N5:
- Hanya tata bahasa dan kosakata N5, gaya です・ます. Contoh pola: ～ます/～ました, ～たいです, ～てください,
  ～ないでください, ～てもいいです, ～から (alasan), ～まえに, ～あとで, ～ています, ～と思います, ～より.
- JANGAN memakai tata bahasa di atas N5, antara lain: ～なければなりません, ～ので, ～てしまう, ～ようになる,
  ～ことができる, ～つもり, ～そうです, bentuk potensial, pasif, kausatif, dan keigo.
- Kosakata di atas N5 (misalnya 規則, 家賃, 安心, 不便) diganti dengan kata N5 yang sederhana.`,
  N4: `Pola kalimat JLPT N4:
- Tata bahasa dan kosakata sampai N4; gunakan beberapa pola khas N4, misalnya ～ので, ～なければなりません,
  ～てしまう, ～ようになる, ～ことができる, ～つもりです, ～そうです, ～たら, ～ば, bentuk potensial, pasif,
  dan keigo sederhana. Gaya です・ます.
- JANGAN memakai tata bahasa N3 ke atas (misalnya ～わけ, ～はず, ～によって, ～として, ～ばかり).
- Bacaan boleh sekitar 1,5 kali lebih panjang dari panduan level.`,
  N3: `Pola kalimat JLPT N3:
- Tata bahasa dan kosakata sampai N3; gunakan beberapa pola khas N3, misalnya ～ようにする, ～ことになる,
  ～わけではない, ～はずです, ～ばかり, ～によって, ～について, ～として, ～ために, kausatif-pasif.
- Gaya です・ます, atau gaya biasa (だ・である) untuk teks seperti artikel atau catatan.
- Bacaan boleh sekitar 2 kali lebih panjang dari panduan level.`,
};

const SISTEM = `Anda guru bahasa Jepang di sebuah LPK di Indonesia. Peserta adalah orang dewasa Indonesia yang belajar bahasa
Jepang untuk bekerja di Jepang. Tulis bacaan dokkai (membaca) BARU beserta soal pilihan ganda, sesuai "panduanLevel"
(panjang dan jenis teks) dan "panduanPola" (tata bahasa dan kosakata).

Aturan bahasa Jepang:
- Kalimat alami seperti di buku latihan JLPT.
- Kanji hanya dari daftar "kanjiBoleh" (kanji yang sudah dipelajari peserta), di level pola kalimat mana pun.
  Kata dengan kanji lain ditulis dengan hiragana atau katakana.
- SETIAP kanji wajib diberi furigana tepat setelah rangkaian kanjinya dengan format 漢字{かんじ}.
  Contoh: 毎朝{まいあさ}六時{ろくじ}に起{お}きます。 Okurigana ditulis di luar kurung kurawal.
- Furigana harus bacaan yang benar untuk konteksnya. Perhatikan satuan, jam, dan tanggal:
  一人{ひとり}, 二人{ふたり}, 三本{さんぼん}, 一冊{いっさつ}, 四時{よじ}, 九時{くじ}, 十分{じゅっぷん}, 一日{ついたち}, 四日{よっか}, 二十日{はつか}.
- Kurung kurawal {} hanya untuk furigana, tidak untuk hal lain.
- Nama orang: nama Jepang sederhana (田中{たなか}さん) atau nama dalam katakana (リナさん). Jangan memakai nama orang terkenal.

Aturan soal:
- Setiap bacaan punya tepat 2 soal.
- "tanya": pertanyaan dalam bahasa Jepang dengan furigana, memakai pola kalimat yang sama dengan bacaan.
  "tanyaId": terjemahan pertanyaan dalam bahasa Indonesia.
- "opsi": tepat 3 pilihan jawaban dalam bahasa Indonesia, pendek dan sejajar. Tepat SATU yang benar menurut bacaan;
  dua lainnya masuk akal tetapi jelas salah menurut bacaan (misalnya hari, jam, tempat, atau benda lain yang juga
  disebut di bacaan). Pilihan yang benar harus persis sesuai isi bacaan, jangan digabung dengan hal lain
  (kalau yang baru adalah mesinnya, jangan tulis "pabriknya baru").
- "benar": indeks pilihan yang benar (0, 1, atau 2). Variasikan posisinya.
- Jawaban harus bisa ditemukan atau disimpulkan langsung dari bacaan. Jangan bertanya tentang hal yang tidak disebut.
- "pembahasan": kutip kalimat Jepang dari bacaan yang menjadi kunci (tanpa furigana), lalu " = " dan artinya dalam
  bahasa Indonesia.
- "terjemahan": terjemahan seluruh bacaan ke bahasa Indonesia yang wajar.
- "judul": judul pendek dalam bahasa Jepang dengan furigana.

Setiap bacaan memakai topik yang berbeda, dipilih dari "topik". Jangan memakai judul atau cerita yang mirip dengan
"hindariJudul". Jawab hanya dengan objek JSON {"bacaan": [...]}.`;

const SCHEMA = {
  type: 'object',
  properties: {
    bacaan: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          judul: { type: 'string' },
          teks: { type: 'string' },
          terjemahan: { type: 'string' },
          soal: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tanya: { type: 'string' },
                tanyaId: { type: 'string' },
                opsi: { type: 'array', items: { type: 'string' } },
                benar: { type: 'integer' },
                pembahasan: { type: 'string' },
              },
              required: ['tanya', 'tanyaId', 'opsi', 'benar', 'pembahasan'],
            },
          },
        },
        required: ['judul', 'teks', 'terjemahan', 'soal'],
      },
    },
  },
  required: ['bacaan'],
};

// Smaller requests answer faster, so a set of 8 is written as two parallel requests of 4.
const PER_PERMINTAAN = 4;

function parseBacaan(text) {
  const parsed = jsonObjectFrom(text);
  return Array.isArray(parsed?.bacaan) && parsed.bacaan.length ? parsed.bacaan : null;
}

function acak(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Raw passages for `level` (L1-L5) at sentence-pattern level `jlpt` (N5, N4, N3), with kanji from kanjiBoleh only,
 * about `jumlah` of them (fewer when a request fails). Throws the AI_* error of the first failed request when none
 * succeeds.
 */
export async function tulisBacaanDokkai(
  { level, jlpt = 'N5', jumlah, hindariJudul = [], kanjiBoleh = KANJI_DIPELAJARI },
  rng = Math.random
) {
  if (!PANDUAN_LEVEL[level] || !PANDUAN_JLPT[jlpt]) throw new Error('INVALID_TES_ONLINE');
  const topik = acak(TOPIK_DOKKAI, rng);
  const ukuran = [];
  for (let sisa = jumlah; sisa > 0; sisa -= PER_PERMINTAAN) ukuran.push(Math.min(PER_PERMINTAAN, sisa));

  let ambil = 0;
  const permintaan = ukuran.map((n) => {
    // Each request gets its own topics (a few spare ones to choose from), so the requests do not overlap.
    const topikIni = topik.slice(ambil, ambil + n + 2);
    ambil += n + 2;
    return generateJson({
      system: SISTEM,
      user: JSON.stringify({
        level,
        panduanLevel: PANDUAN_LEVEL[level],
        pola: jlpt,
        panduanPola: PANDUAN_JLPT[jlpt],
        jumlahBacaan: n,
        topik: topikIni,
        hindariJudul,
        kanjiBoleh: [...kanjiBoleh].join(''),
      }),
      schema: SCHEMA,
      schemaName: 'bacaan_dokkai',
      parse: parseBacaan,
      temperature: 0.9,
      title: 'JOYdata Tes Online',
    });
  });

  const hasil = await Promise.allSettled(permintaan);
  const berhasil = hasil.filter((h) => h.status === 'fulfilled');
  if (!berhasil.length) throw hasil[0].reason;
  return {
    bacaan: berhasil.flatMap((h) => h.value.value),
    model: berhasil[0].value.model,
  };
}
