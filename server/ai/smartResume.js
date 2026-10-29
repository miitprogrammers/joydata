import { GoogleGenAI } from '@google/genai';

/**
 * Smart Report resume writer. Receives anonymous facts built by domain/smartReport.js and returns the resume
 * in Indonesian and Japanese. Providers, in order: Gemini (preferred model, then fallback models), then
 * OpenRouter as a backup when OPENROUTER_API_KEY is set. Bump PROMPT_VERSION when the prompts change so
 * stored resumes are marked out of date.
 */
export const PROMPT_VERSION = 1;

// gemini-flash-latest (the newest Flash) was measured at 30-120 s or 503 under load; 2.5 Flash with a small
// thinking budget writes the same resume in about 7 s.
const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';
const GEMINI_THINKING_BUDGET = 1024;
// Tried in order when the preferred model is overloaded, too slow or out of quota.
const GEMINI_FALLBACK_MODELS = ['gemini-flash-lite-latest'];
const OPENROUTER_DEFAULT_MODEL = 'openrouter/free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Overload (503) and server errors get one more try on the same model; a deadline (504), quota (429)
// or unusable output (502) moves on to the next model.
const RETRY_SAME_MODEL = new Set([500, 503]);
const TRY_NEXT_MODEL = new Set([408, 429, 500, 502, 503, 504]);

// The whole request has to fit in the 60 s serverless limit (vercel.json), database work included.
const TOTAL_BUDGET_MS = 50000;
const OPENROUTER_RESERVE_MS = 22000;
const MIN_CALL_MS = 8000;

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

class ProviderError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function geminiKey() {
  const key = process.env.GEMINI_API_KEY || '';
  return key && key !== 'MY_GEMINI_API_KEY' ? key : '';
}

function openRouterKey() {
  return process.env.OPENROUTER_API_KEY || '';
}

let geminiClient = null;

function getGeminiClient() {
  if (!geminiClient) geminiClient = new GoogleGenAI({ apiKey: geminiKey() });
  return geminiClient;
}

function statusOf(err) {
  if (err?.name === 'TimeoutError' || err?.name === 'AbortError') return 504;
  return Number(err?.status) || 0;
}

function toResumeError(err) {
  const status = statusOf(err);
  if (status === 401 || status === 403 || (status === 400 && /api key/i.test(err?.message || ''))) {
    return new Error('AI_ACCESS_DENIED');
  }
  if (status === 429) return new Error('AI_RATE_LIMITED');
  if ([408, 500, 503, 504].includes(status)) return new Error('AI_OVERLOADED');
  return new Error('AI_FAILED');
}

/** Accepts plain JSON or JSON wrapped in prose / code fences, as some backup models return. */
function parseResume(text) {
  const raw = String(text || '');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    const teksId = String(parsed?.id || '').trim();
    const teksJa = String(parsed?.ja || '').trim();
    return teksId && teksJa ? { teksId, teksJa } : null;
  } catch {
    return null;
  }
}

async function writeWithGemini(request, deadline) {
  const ai = getGeminiClient();
  const preferred = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
  const models = [preferred, ...GEMINI_FALLBACK_MODELS.filter((m) => m !== preferred)];
  let lastError = new ProviderError(504, 'no time left for Gemini');

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const remaining = deadline - Date.now();
      if (remaining < MIN_CALL_MS) throw lastError;
      try {
        const response = await ai.models.generateContent({
          model,
          contents: request.user,
          config: {
            systemInstruction: request.system,
            temperature: 0.4,
            responseMimeType: 'application/json',
            responseJsonSchema: RESPONSE_SCHEMA,
            httpOptions: { timeout: remaining },
            // The thinking budget is a Gemini 2.5 setting; newer models pick their own level.
            ...(model.startsWith('gemini-2.5') ? { thinkingConfig: { thinkingBudget: GEMINI_THINKING_BUDGET } } : {}),
          },
        });
        const resume = parseResume(response.text);
        if (!resume) throw new ProviderError(502, `unusable output: ${String(response.text || '').slice(0, 120)}`);
        return { ...resume, model: response.modelVersion || model };
      } catch (err) {
        lastError = err;
        const status = statusOf(err);
        console.error(`Gemini request failed (${model}, attempt ${attempt}):`, status, err?.message);
        if (attempt === 1 && RETRY_SAME_MODEL.has(status)) {
          await sleep(1500);
          continue;
        }
        if (TRY_NEXT_MODEL.has(status)) break;
        throw err;
      }
    }
  }
  throw lastError;
}

async function writeWithOpenRouter(request, deadline) {
  const model = process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;
  const remaining = deadline - Date.now();
  if (remaining < MIN_CALL_MS) throw new ProviderError(504, 'no time left for OpenRouter');

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterKey()}`,
        'Content-Type': 'application/json',
        'X-Title': 'JOYdata Smart Report',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: 'system', content: request.system },
          { role: 'user', content: request.user },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'resume', strict: true, schema: { ...RESPONSE_SCHEMA, additionalProperties: false } },
        },
      }),
      signal: AbortSignal.timeout(remaining),
    });
    const body = await res.json().catch(() => null);
    // OpenRouter can also report a provider failure inside a 200 response.
    if (!res.ok || body?.error) {
      throw new ProviderError(Number(body?.error?.code) || res.status, body?.error?.message || `HTTP ${res.status}`);
    }
    const content = body?.choices?.[0]?.message?.content;
    const resume = parseResume(content);
    if (!resume) throw new ProviderError(502, `unusable output: ${String(content || '').slice(0, 120)}`);
    return { ...resume, model: `openrouter:${body.model || model}`.slice(0, 80) };
  } catch (err) {
    console.error(`OpenRouter request failed (${model}):`, statusOf(err), err?.message);
    throw err;
  }
}

/** scope: 'peserta' | 'kelas'. Returns { teksId, teksJa, model }. */
export async function writeResume(scope, facts) {
  const hasGemini = !!geminiKey();
  const hasOpenRouter = !!openRouterKey();
  if (!hasGemini && !hasOpenRouter) throw new Error('AI_NOT_CONFIGURED');

  const request = { system: scope === 'kelas' ? INSTRUKSI_KELAS : INSTRUKSI_PESERTA, user: JSON.stringify(facts) };
  const end = Date.now() + TOTAL_BUDGET_MS;

  if (hasGemini) {
    try {
      // Leave time for the backup when there is one.
      return await writeWithGemini(request, hasOpenRouter ? end - OPENROUTER_RESERVE_MS : end);
    } catch (err) {
      if (!hasOpenRouter) throw toResumeError(err);
    }
  }
  try {
    return await writeWithOpenRouter(request, end);
  } catch (err) {
    throw toResumeError(err);
  }
}
