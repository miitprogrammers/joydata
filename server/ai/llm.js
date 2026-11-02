import { GoogleGenAI } from '@google/genai';

/**
 * Shared JSON generation for the AI features (Smart Report resume, dokkai passages). Providers, in order:
 * Gemini (preferred model, then fallback models), then OpenRouter as a backup when OPENROUTER_API_KEY is set.
 * Errors come out as AI_NOT_CONFIGURED / AI_ACCESS_DENIED / AI_RATE_LIMITED / AI_OVERLOADED / AI_FAILED.
 */

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

function toAiError(err) {
  const status = statusOf(err);
  if (status === 401 || status === 403 || (status === 400 && /api key/i.test(err?.message || ''))) {
    return new Error('AI_ACCESS_DENIED');
  }
  if (status === 429) return new Error('AI_RATE_LIMITED');
  if ([408, 500, 503, 504].includes(status)) return new Error('AI_OVERLOADED');
  return new Error('AI_FAILED');
}

// OpenRouter's strict json_schema needs additionalProperties: false on every object; Gemini gets the plain schema.
function strictSchema(schema) {
  if (Array.isArray(schema)) return schema.map(strictSchema);
  if (!schema || typeof schema !== 'object') return schema;
  const out = Object.fromEntries(Object.entries(schema).map(([k, v]) => [k, strictSchema(v)]));
  if (out.type === 'object') out.additionalProperties = false;
  return out;
}

/** The JSON object in a model reply, also when it is wrapped in prose or code fences (some backup models). */
export function jsonObjectFrom(text) {
  const raw = String(text || '');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function generateWithGemini(request, deadline) {
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
            temperature: request.temperature,
            responseMimeType: 'application/json',
            responseJsonSchema: request.schema,
            httpOptions: { timeout: remaining },
            // The thinking budget is a Gemini 2.5 setting; newer models pick their own level.
            ...(model.startsWith('gemini-2.5') ? { thinkingConfig: { thinkingBudget: GEMINI_THINKING_BUDGET } } : {}),
          },
        });
        const value = request.parse(response.text);
        if (!value) throw new ProviderError(502, `unusable output: ${String(response.text || '').slice(0, 120)}`);
        return { value, model: response.modelVersion || model };
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

async function generateWithOpenRouter(request, deadline) {
  const model = process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;
  const remaining = deadline - Date.now();
  if (remaining < MIN_CALL_MS) throw new ProviderError(504, 'no time left for OpenRouter');

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterKey()}`,
        'Content-Type': 'application/json',
        'X-Title': request.title,
      },
      body: JSON.stringify({
        model,
        temperature: request.temperature,
        messages: [
          { role: 'system', content: request.system },
          { role: 'user', content: request.user },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: request.schemaName, strict: true, schema: strictSchema(request.schema) },
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
    const value = request.parse(content);
    if (!value) throw new ProviderError(502, `unusable output: ${String(content || '').slice(0, 120)}`);
    return { value, model: `openrouter:${body.model || model}`.slice(0, 80) };
  } catch (err) {
    console.error(`OpenRouter request failed (${model}):`, statusOf(err), err?.message);
    throw err;
  }
}

/**
 * One JSON answer from the first provider that gives a usable one. parse(text) returns the value, or null when
 * the reply is unusable (then the next model is tried). Every object in the schema lists all its properties as
 * required, as OpenRouter's strict mode expects.
 */
export async function generateJson({ system, user, schema, schemaName, parse, temperature = 0.4, title = 'JOYdata' }) {
  const hasGemini = !!geminiKey();
  const hasOpenRouter = !!openRouterKey();
  if (!hasGemini && !hasOpenRouter) throw new Error('AI_NOT_CONFIGURED');

  const request = { system, user, schema, schemaName, parse, temperature, title };
  const end = Date.now() + TOTAL_BUDGET_MS;

  if (hasGemini) {
    try {
      // Leave time for the backup when there is one.
      return await generateWithGemini(request, hasOpenRouter ? end - OPENROUTER_RESERVE_MS : end);
    } catch (err) {
      if (!hasOpenRouter) throw toAiError(err);
    }
  }
  try {
    return await generateWithOpenRouter(request, end);
  } catch (err) {
    throw toAiError(err);
  }
}
