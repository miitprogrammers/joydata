/**
 * Evaluasi Fisik (physical test), the formula agreed with the user on 2026-11-10:
 *   - push-up in 2 minutes, sit-up in 2 minutes (repetitions), the longest plank (seconds);
 *   - round trips carrying ONE sack for 5 minutes (laki-laki 20 kg, perempuan 10 kg). One round trip = from the
 *     start line to the turn line and back; reaching the turn line when time is up counts 0.5. Walking, no running.
 * Each item scores 0-100 against two benchmarks per gender, Minimal (= 60) and Target (= 100):
 *   result <= Minimal           → 60 × result ÷ Minimal
 *   Minimal < result < Target   → 60 + 40 × (result − Minimal) ÷ (Target − Minimal)
 *   result >= Target            → 100
 * The sack benchmarks are total metres (round trips × 2 × track length), so they hold for any track length; the
 * track length of a test is stored with it. Nilai Fisik = weighted mean of the four items (default 20/20/20/40,
 * the sack heaviest as the closest to real work), only when all four are filled; predikat follows batas_grade,
 * lulus = Nilai Fisik >= KKM Fisik (default 60, i.e. the minimal standard on average).
 * Benchmarks, weights, KKM and track length live in settings key `evaluasi_fisik` (Pengaturan, admin).
 *
 * Pure module without imports: the staff form imports it too, so its preview and the server always agree.
 */

export const ITEM_FISIK = ['pushUp', 'plank', 'sitUp', 'karung'];
export const JENIS_KELAMIN = ['L', 'P'];
export const BEBAN_KARUNG_KG = { L: 20, P: 10 };

export const DEFAULT_EVALUASI_FISIK = {
  lintasanM: 10,
  kkm: 60,
  bobot: { pushUp: 20, plank: 20, sitUp: 20, karung: 40 },
  // Minimal → Target. Push-up / sit-up: repetitions in 2 minutes; plank: seconds; karung: total metres.
  patokan: {
    pushUp: { L: { minimal: 30, target: 60 }, P: { minimal: 12, target: 35 } },
    plank: { L: { minimal: 90, target: 180 }, P: { minimal: 90, target: 180 } },
    sitUp: { L: { minimal: 40, target: 70 }, P: { minimal: 30, target: 60 } },
    karung: { L: { minimal: 200, target: 320 }, P: { minimal: 200, target: 320 } },
  },
};

// Upper bounds of a result typed in, to catch typos (e.g. 3000 push-ups).
export const BATAS_HASIL = { pushUp: 300, plankDetik: 3600, sitUp: 300, karungBolakBalik: 100 };

const round1 = (v) => Math.round(v * 10) / 10;
const angka = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));
const atau = (v, cadangan) => angka(v) ?? cadangan;

/** The physical-test rules of the settings, every missing or broken value filled from the defaults. */
export function aturanFisik(settings) {
  const s = settings?.evaluasi_fisik || {};
  const d = DEFAULT_EVALUASI_FISIK;
  return {
    lintasanM: atau(s.lintasanM, d.lintasanM),
    kkm: atau(s.kkm, d.kkm),
    bobot: Object.fromEntries(ITEM_FISIK.map((k) => [k, atau(s.bobot?.[k], d.bobot[k])])),
    patokan: Object.fromEntries(
      ITEM_FISIK.map((k) => [
        k,
        Object.fromEntries(
          JENIS_KELAMIN.map((g) => [
            g,
            {
              minimal: atau(s.patokan?.[k]?.[g]?.minimal, d.patokan[k][g].minimal),
              target: atau(s.patokan?.[k]?.[g]?.target, d.patokan[k][g].target),
            },
          ])
        ),
      ])
    ),
  };
}

/** Score 0-100 (one decimal) of one result against { minimal, target }; null without a result. */
export function nilaiItemFisik(hasil, { minimal, target }) {
  const x = angka(hasil);
  if (x === null) return null;
  const v = Math.max(0, x);
  if (v >= target) return 100;
  if (v <= minimal) return round1((60 * v) / minimal);
  return round1(60 + (40 * (v - minimal)) / (target - minimal));
}

// Same thresholds as rules.getGradeLabel (kept here so this module stays import-free for the browser).
function predikatDari(nilai, batas = {}) {
  if (nilai >= (batas.A ?? 90)) return 'A';
  if (nilai >= (batas.B ?? 75)) return 'B';
  if (nilai >= (batas.C ?? 60)) return 'C';
  return 'D';
}

/**
 * Scores of one test record { jenisKelamin, pushUp, plankDetik, sitUp, karungBolakBalik, lintasanM } with the
 * current settings: per item { hasil, nilai } (karung also bolakBalik; its hasil is metres), Nilai Fisik,
 * predikat and lulus. Without a known gender nothing can be scored.
 */
export function hitungNilaiFisik(record, settings) {
  const aturan = aturanFisik(settings);
  const jk = JENIS_KELAMIN.includes(record?.jenisKelamin) ? record.jenisKelamin : null;
  const lintasanM = angka(record?.lintasanM) > 0 ? angka(record.lintasanM) : aturan.lintasanM;
  const bolakBalik = angka(record?.karungBolakBalik);
  const hasil = {
    pushUp: angka(record?.pushUp),
    plank: angka(record?.plankDetik),
    sitUp: angka(record?.sitUp),
    karung: bolakBalik === null ? null : round1(bolakBalik * 2 * lintasanM),
  };
  const items = Object.fromEntries(
    ITEM_FISIK.map((k) => [k, { hasil: hasil[k], nilai: jk ? nilaiItemFisik(hasil[k], aturan.patokan[k][jk]) : null }])
  );
  items.karung.bolakBalik = bolakBalik;
  const lengkap = ITEM_FISIK.every((k) => items[k].nilai !== null);
  const totalBobot = ITEM_FISIK.reduce((n, k) => n + aturan.bobot[k], 0);
  const nilaiFisik =
    lengkap && totalBobot > 0 ? round1(ITEM_FISIK.reduce((n, k) => n + items[k].nilai * aturan.bobot[k], 0) / totalBobot) : null;
  return {
    jenisKelamin: jk,
    bebanKg: jk ? BEBAN_KARUNG_KG[jk] : null,
    lintasanM,
    items,
    lengkap,
    nilaiFisik,
    predikat: nilaiFisik === null ? null : predikatDari(nilaiFisik, settings?.batas_grade),
    lulusKkm: nilaiFisik === null ? null : nilaiFisik >= aturan.kkm,
    kkm: aturan.kkm,
  };
}

/** Scored tests of one peserta, oldest first, and the latest one (null without tests). */
export function ringkasFisik(rows, settings) {
  const daftar = (rows || [])
    .filter((r) => r?.tanggal)
    .map((r) => ({
      id: r.id,
      tanggal: String(r.tanggal).slice(0, 10),
      pushUp: angka(r.pushUp),
      plankDetik: angka(r.plankDetik),
      sitUp: angka(r.sitUp),
      karungBolakBalik: angka(r.karungBolakBalik),
      lintasanM: angka(r.lintasanM),
      catatan: r.catatan || '',
      ...hitungNilaiFisik(r, settings),
    }))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || (a.id ?? 0) - (b.id ?? 0));
  return { daftar, terakhir: daftar.length ? daftar[daftar.length - 1] : null };
}

/** Plank seconds as m:ss (95 → "1:35"); "-" without a value. */
export function formatDetik(detik) {
  const d = angka(detik);
  if (d === null) return '-';
  const bulat = Math.max(0, Math.round(d));
  return `${Math.floor(bulat / 60)}:${String(bulat % 60).padStart(2, '0')}`;
}

/**
 * A test record from a client: { ok, normalized } or { ok: false, code }. Results are optional one by one (a
 * peserta may skip an item), at least one is required; round trips go in steps of 0.5.
 */
export function validateNilaiFisikInput(input) {
  const pesertaId = Number(input?.pesertaId);
  const kelasRaw = input?.kelasId;
  const kelasId = kelasRaw === null || kelasRaw === undefined || kelasRaw === '' ? null : Number(kelasRaw);
  const tanggal = String(input?.tanggal || '').trim();
  const jenisKelamin = String(input?.jenisKelamin || '').trim().toUpperCase();
  if (!Number.isInteger(pesertaId) || pesertaId <= 0) return { ok: false, code: 'VALIDATION_ERROR' };
  if (kelasId !== null && (!Number.isInteger(kelasId) || kelasId <= 0)) return { ok: false, code: 'VALIDATION_ERROR' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal) || Number.isNaN(Date.parse(`${tanggal}T00:00:00Z`))) {
    return { ok: false, code: 'INVALID_NILAI_FISIK' };
  }
  if (!JENIS_KELAMIN.includes(jenisKelamin)) return { ok: false, code: 'FISIK_JENIS_KELAMIN_KOSONG' };

  const hasil = {};
  for (const [key, maks] of Object.entries(BATAS_HASIL)) {
    const v = angka(input?.[key]);
    if (input?.[key] !== null && input?.[key] !== undefined && input?.[key] !== '' && v === null) {
      return { ok: false, code: 'INVALID_NILAI_FISIK' };
    }
    if (v === null) {
      hasil[key] = null;
      continue;
    }
    const langkahOk = key === 'karungBolakBalik' ? Number.isInteger(v * 2) : Number.isInteger(v);
    if (v < 0 || v > maks || !langkahOk) return { ok: false, code: 'INVALID_NILAI_FISIK' };
    hasil[key] = v;
  }
  if (Object.values(hasil).every((v) => v === null)) return { ok: false, code: 'FISIK_KOSONG' };

  const catatan = String(input?.catatan || '').trim();
  if (catatan.length > 500) return { ok: false, code: 'INVALID_NILAI_FISIK' };
  return { ok: true, normalized: { pesertaId, kelasId, tanggal, jenisKelamin, ...hasil, catatan } };
}

/**
 * The `evaluasi_fisik` settings from Pengaturan: { ok, normalized } or { ok: false, code }. Weights are whole
 * numbers adding up to 100; every Target must be above its Minimal.
 */
export function normalizeEvaluasiFisikSettings(raw) {
  const gagal = { ok: false, code: 'INVALID_EVALUASI_FISIK' };
  const lintasanM = angka(raw?.lintasanM);
  const kkm = angka(raw?.kkm);
  if (lintasanM === null || lintasanM < 1 || lintasanM > 100) return gagal;
  if (kkm === null || kkm < 0 || kkm > 100) return gagal;
  const bobot = {};
  for (const k of ITEM_FISIK) {
    const v = angka(raw?.bobot?.[k]);
    if (v === null || v < 0 || v > 100 || !Number.isInteger(v)) return gagal;
    bobot[k] = v;
  }
  if (ITEM_FISIK.reduce((n, k) => n + bobot[k], 0) !== 100) return gagal;
  const patokan = {};
  for (const k of ITEM_FISIK) {
    patokan[k] = {};
    for (const g of JENIS_KELAMIN) {
      const minimal = angka(raw?.patokan?.[k]?.[g]?.minimal);
      const target = angka(raw?.patokan?.[k]?.[g]?.target);
      if (minimal === null || target === null || minimal <= 0 || target <= minimal || target > 100000) return gagal;
      patokan[k][g] = { minimal: round1(minimal), target: round1(target) };
    }
  }
  return { ok: true, normalized: { lintasanM: round1(lintasanM), kkm: round1(kkm), bobot, patokan } };
}
