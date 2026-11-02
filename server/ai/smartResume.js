import { generateJson, jsonObjectFrom } from './llm.js';

/**
 * Smart Report resume writer. Receives anonymous facts built by domain/smartReport.js and returns the resume
 * in Indonesian and Japanese, through the shared providers in llm.js. Bump PROMPT_VERSION when the prompts
 * change so stored resumes are marked out of date.
 */
export const PROMPT_VERSION = 1;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Resume dalam bahasa Indonesia' },
    ja: { type: 'string', description: '同じ内容の日本語の要約' },
  },
  required: ['id', 'ja'],
};

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
  Istilah: Moji-Goi = 文字・語彙, Bunpou = 文法, Dokkai = 読解, Choukai = 聴解, Kaiwa = 会話,
  Mensetsu Renshuu = 面接練習, KKM = 合格基準点.
- Jawab hanya dengan objek JSON {"id": "...", "ja": "..."}.`;

const INSTRUKSI_PESERTA = `Anda koordinator akademik LPK yang menyiapkan peserta untuk bekerja di Jepang.
Tulis resume evaluasi seluruh perjalanan belajar SATU peserta, untuk dibaca manajer LPK dan staf Jepang.
Data peserta diberikan sebagai JSON tanpa nama.

Isi resume, 2 paragraf:
1. Kemampuan akademik: rata-rata ujian dan predikatnya terhadap KKM, tren dari awal ke akhir, bagian terkuat dan
   terlemah (Moji-Goi, Bunpou, Dokkai, Choukai) bila ada, pola kesalahan yang berulang di catatan ujian, hasil kaiwa,
   dan hasil mensetsu renshuu (latihan wawancara) bila ada.
2. Sikap dan kehadiran, lalu 1-2 rekomendasi tindak lanjut yang konkret untuk sensei.

Sebut peserta sebagai "peserta" di teks Indonesia dan "本受講生" di teks Jepang.
Panjang: "id" 120-200 kata, "ja" 300-500 karakter.

${ATURAN_UMUM}`;

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

function parseResume(text) {
  const parsed = jsonObjectFrom(text);
  const teksId = String(parsed?.id || '').trim();
  const teksJa = String(parsed?.ja || '').trim();
  return teksId && teksJa ? { teksId, teksJa } : null;
}

/** scope: 'peserta' | 'kelas'. Returns { teksId, teksJa, model }. */
export async function writeResume(scope, facts) {
  const { value, model } = await generateJson({
    system: scope === 'kelas' ? INSTRUKSI_KELAS : INSTRUKSI_PESERTA,
    user: JSON.stringify(facts),
    schema: RESPONSE_SCHEMA,
    schemaName: 'resume',
    parse: parseResume,
    temperature: 0.4,
    title: 'JOYdata Smart Report',
  });
  return { ...value, model };
}
