import { generateJson, jsonObjectFrom } from './llm.js';
import { batasiParagraf } from '../domain/smartReport.js';

/**
 * Smart Report writer: the overall review of one peserta, or of one class. Receives anonymous facts built by
 * domain/smartReport.js and returns the text in Indonesian and Japanese, through the shared providers in llm.js.
 * Bump the scope's PROMPT_VERSION when its prompt changes, so the reviews stored for that scope are marked out
 * of date (the other scope keeps its fingerprint).
 */
export const PROMPT_VERSION = { peserta: 3, kelas: 2 };

/** Paragraphs per scope; extra ones from the model are folded into the last allowed paragraph. */
const MAKS_PARAGRAF = { peserta: 2, kelas: 3 };

const SCHEMA_KELAS = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Resume dalam bahasa Indonesia' },
    ja: { type: 'string', description: '同じ内容の日本語の要約' },
  },
  required: ['id', 'ja'],
};

// The peserta review comes as exactly two paragraphs per language, so no paragraph can go missing in one
// language or run into the next one (free text lost the blank line between them).
const duaParagraf = (description) => ({ type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 2, description });
const SCHEMA_PESERTA = {
  type: 'object',
  properties: {
    id: duaParagraf('Dua paragraf review dalam bahasa Indonesia'),
    ja: duaParagraf('同じ内容の日本語の2段落'),
  },
  required: ['id', 'ja'],
};

// Rules of the class prompt (the peserta prompt carries its own, with the two-paragraph answer format).
const ATURAN_UMUM = `Aturan:
- Gunakan hanya fakta dari data JSON. Jangan menambah angka, tanggal, nama, atau kejadian yang tidak ada di data.
- Angka boleh dibulatkan ke satu desimal. Selalu bandingkan nilai dengan KKM dan batas predikat di "aturan".
- Bagian yang datanya kosong cukup disebut belum ada data; jangan ditebak.
- Nada objektif dan profesional: tidak berlebihan memuji dan tidak menghakimi.
- Catatan ujian: sebut hanya pola yang muncul di lebih dari satu ujian atau yang masih muncul di ujian terakhir.
  Satu hal tidak boleh disebut sebagai kekuatan sekaligus kelemahan. Abaikan catatan teknis input data
  (misalnya "dikoreksi saat input" dan rincian skor per bagian soal).
- Teks polos tanpa markdown, poin, atau judul. Pisahkan paragraf dengan satu baris kosong.
- "id" dan "ja" masing-masing wajib memuat SEMUA paragraf yang diminta, dengan isi yang sama.
- Di teks Indonesia gunakan koma desimal (81,8), di teks Jepang titik desimal (81.8).
- "ja" ditulis dalam bahasa Jepang bisnis (です・ます調), bukan terjemahan kata per kata.
  Istilah: Moji-Goi = 文字・語彙, Bunpou-Dokkai (kunci "bunpou") = 文法・読解, Choukai = 聴解, Kaiwa = 会話,
  Mensetsu Renshuu = 面接練習, KKM = 合格基準点.
- Jawab hanya dengan objek JSON {"id": "...", "ja": "..."}.`;

const INSTRUKSI_PESERTA = `Anda sensei senior sekaligus koordinator akademik LPK yang menyiapkan peserta untuk bekerja di Jepang.
Tugas Anda MEREVIEW SATU peserta, bukan membuat resume atau ringkasan data: berikan penilaian Anda atas kemampuan
dan kesiapan peserta dari semua aspek nilai yang tersedia, untuk dibaca manajer LPK dan staf Jepang.
Data peserta diberikan sebagai JSON tanpa nama.

Aspek yang wajib ditinjau (yang datanya ada):
- Ujian: rata-rata dan predikat terhadap KKM, arah tren dari awal ke akhir, bagian terkuat dan terlemah
  (Moji-Goi, Bunpou-Dokkai, Choukai), dan pola kesalahan yang berulang di catatan ujian.
- Kaiwa (percakapan): grade terakhir, sebaran grade, dan perkembangannya dari sesi ke sesi.
- Mensetsu renshuu (latihan wawancara): grade dan catatan sesinya.
- Sikap: skor bulanan terhadap KKM dan kejadian positif atau negatif yang menonjol.
- Kehadiran: rasio hadir serta jumlah sakit, izin, dan alfa.

Cara mereview:
- Nilai, jangan sekadar mengulang angka. Katakan apa arti angka itu bagi kesiapan peserta, apakah sudah memenuhi
  standar, dan di mana ia berdiri. Kutip angka secukupnya sebagai bukti, tidak semua angka.
- Kaitkan antaraspek bila datanya mendukung, misalnya kehadiran atau sikap yang sejalan dengan tren nilai, atau
  kaiwa yang tertinggal dari nilai ujian.
- Bila datanya masih sedikit (misalnya satu ujian atau satu sesi), sebut penilaiannya masih sementara.
- Tegas dan jujur dalam menilai, tetapi tetap profesional dan tidak menyerang pribadi.

Susunan, tepat 2 paragraf (tidak boleh lebih):
1. Review kemampuan bahasa Jepang: ujian per bagian beserta pola kesalahannya, kaiwa, dan mensetsu renshuu.
2. Review sikap dan kehadiran, lalu kesimpulan tentang kesiapan peserta secara keseluruhan dan 1-2 tindak lanjut
   konkret untuk sensei.

Sebut peserta sebagai "peserta" di teks Indonesia dan "本受講生" di teks Jepang.
Panjang total kedua paragraf: "id" 130-190 kata, "ja" 350-480 karakter. Batas atas ini wajib dipatuhi: pilih
temuan yang paling penting dan jangan mengulang hal yang sama di dua tempat.

Aturan:
- Gunakan hanya fakta dari data JSON. Jangan menambah angka, tanggal, nama, atau kejadian yang tidak ada di data.
- Angka boleh dibulatkan ke satu desimal. Selalu bandingkan nilai dengan KKM dan batas predikat di "aturan".
- Nilai ujian dan skor sikap adalah skor 0-100, bukan persen: tulis tanpa tanda %. Persen hanya untuk kehadiran.
- Aspek yang datanya kosong cukup disebut belum ada data; jangan ditebak.
- Catatan ujian: sebut hanya pola yang muncul di lebih dari satu ujian atau yang masih muncul di ujian terakhir.
  Satu hal tidak boleh disebut sebagai kekuatan sekaligus kelemahan. Abaikan catatan teknis input data
  (misalnya "dikoreksi saat input" dan rincian skor per bagian soal).
- Di teks Indonesia nama bagian ditulis dengan huruf Latin (Moji-Goi, Bunpou-Dokkai, Choukai, Kaiwa,
  Mensetsu Renshuu) dan gunakan koma desimal (81,8).
- "ja" ditulis dalam bahasa Jepang bisnis (です・ます調), bukan terjemahan kata per kata, dengan titik desimal (81.8).
  Istilah: Moji-Goi = 文字・語彙, Bunpou-Dokkai (kunci "bunpou") = 文法・読解, Choukai = 聴解, Kaiwa = 会話,
  Mensetsu Renshuu = 面接練習, KKM = 合格基準点.
- "id" dan "ja" masing-masing berupa daftar berisi tepat 2 paragraf dengan isi yang sama di kedua bahasa.
  Setiap paragraf teks polos tanpa markdown, poin, judul, atau baris baru.
- Jawab hanya dengan objek JSON {"id": ["paragraf 1", "paragraf 2"], "ja": ["第1段落", "第2段落"]}.`;

const INSTRUKSI_KELAS = `Anda koordinator akademik LPK yang menyiapkan peserta untuk bekerja di Jepang.
Tulis resume evaluasi SATU kelas, untuk dibaca manajer LPK dan staf Jepang.
Data kelas diberikan sebagai JSON. Peserta disamarkan dengan kode P01, P02, dan seterusnya sesuai urutan peringkat.

Isi resume, 3 paragraf:
1. Gambaran umum: rata-rata kelas, sebaran nilai dan predikat, jumlah peserta yang lulus KKM, dan tren rata-rata kelas
   dari ujian ke ujian.
2. Bagian terkuat dan terlemah kelas, peserta teratas, dan peserta yang perlu perhatian beserta alasannya.
3. Kehadiran dan sikap kelas, lalu 2-3 rekomendasi pengajaran untuk kelas ini.

Sebut peserta hanya dengan kodenya, persis seperti di data (misalnya P03), di kedua bahasa.
Panjang: "id" 150-250 kata, "ja" 400-650 karakter.

${ATURAN_UMUM}`;

/**
 * One language of the answer as stored text: a list of paragraphs (peserta) or one string (class, or a backup
 * model that ignored the schema), at most `maks` paragraphs separated by a blank line.
 */
function teksParagraf(nilai, maks, penyambung) {
  const daftar = (Array.isArray(nilai) ? nilai : [nilai]).map((p) => String(p ?? '').trim()).filter(Boolean);
  return batasiParagraf(daftar.join('\n\n'), maks, penyambung);
}

function parserUntuk(scope) {
  const maks = MAKS_PARAGRAF[scope];
  return (text) => {
    const parsed = jsonObjectFrom(text);
    const teksId = teksParagraf(parsed?.id, maks, ' ');
    const teksJa = teksParagraf(parsed?.ja, maks, '');
    return teksId && teksJa ? { teksId, teksJa } : null;
  };
}

/** scope: 'peserta' | 'kelas'. Returns { teksId, teksJa, model }. */
export async function writeResume(scope, facts) {
  const kelas = scope === 'kelas';
  const { value, model } = await generateJson({
    system: kelas ? INSTRUKSI_KELAS : INSTRUKSI_PESERTA,
    user: JSON.stringify(facts),
    schema: kelas ? SCHEMA_KELAS : SCHEMA_PESERTA,
    schemaName: 'resume',
    parse: parserUntuk(kelas ? 'kelas' : 'peserta'),
    temperature: 0.4,
    title: 'JOYdata Smart Report',
  });
  return { ...value, model };
}
