/**
 * Kaiwa Card: every peserta needs at least `target` kaiwa sessions a week (Monday to Sunday, WIB), and at
 * least one of them with the required sensei (settings.kaiwa_sensei_wajib_id; none set = no such condition).
 * The rule counts from the week of settings.kaiwa_berlaku_mulai; earlier weeks are not judged.
 */

export const DEFAULT_KAIWA_TARGET = 4;
const MAX_KAIWA_TARGET = 14;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value) {
  return ISO_DATE.test(String(value || ''));
}

/** Today's date in Jakarta time, YYYY-MM-DD (the server itself runs in UTC). */
export function todayJakarta(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The Monday of the week that contains `iso`. */
export function weekStartOf(iso) {
  const dayFromMonday = (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;
  return addDays(iso, -dayFromMonday);
}

export function weekOf(iso) {
  const mulai = weekStartOf(iso);
  return { mulai, selesai: addDays(mulai, 6) };
}

/** Target, required sensei and first week from the stored settings, with defaults for values never saved. */
export function kaiwaRule(settings = {}) {
  const target = Number(settings.kaiwa_target_mingguan);
  const senseiId = Number(settings.kaiwa_sensei_wajib_id);
  return {
    target: Number.isInteger(target) && target >= 1 && target <= MAX_KAIWA_TARGET ? target : DEFAULT_KAIWA_TARGET,
    senseiWajibId: Number.isInteger(senseiId) && senseiId > 0 ? senseiId : null,
    // Monday of the first week the rule applies to; null = every week.
    mulai: isIsoDate(settings.kaiwa_berlaku_mulai) ? weekStartOf(settings.kaiwa_berlaku_mulai) : null,
  };
}

/** Validates the Kaiwa Card settings; `null` for the sensei = no required sensei, for the date = every week. */
export function normalizeKaiwaRuleSettings(input) {
  const target = Number(input?.kaiwa_target_mingguan);
  if (!Number.isInteger(target) || target < 1 || target > MAX_KAIWA_TARGET) {
    return { ok: false, code: 'INVALID_KAIWA_TARGET' };
  }
  const rawSensei = input?.kaiwa_sensei_wajib_id;
  const sensei = rawSensei === null || rawSensei === '' || rawSensei === undefined ? null : Number(rawSensei);
  if (sensei !== null && (!Number.isInteger(sensei) || sensei <= 0)) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  const mulai = input?.kaiwa_berlaku_mulai ? String(input.kaiwa_berlaku_mulai) : null;
  if (mulai !== null && !isIsoDate(mulai)) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  return {
    ok: true,
    normalized: { kaiwa_target_mingguan: target, kaiwa_sensei_wajib_id: sensei, kaiwa_berlaku_mulai: mulai },
  };
}

/** Progress of one peserta in one week, from that week's sessions ({ senseiId }). */
export function kaiwaWeekProgress(sessions, { target, senseiWajibId }) {
  const jumlah = sessions.length;
  const denganWajib = senseiWajibId ? sessions.filter((s) => Number(s.senseiId) === senseiWajibId).length : 0;
  const wajibTerpenuhi = senseiWajibId ? denganWajib > 0 : true;
  const kurang = Math.max(0, target - jumlah);
  return { jumlah, target, kurang, denganWajib, wajibTerpenuhi, tercapai: kurang === 0 && wajibTerpenuhi };
}

/**
 * Week-by-week progress from the week of `dari` up to the week of `sampai`, newest first.
 * sessions: [{ tanggal, senseiId }] of one peserta.
 */
export function kaiwaWeeklyHistory(sessions, { dari, sampai, target, senseiWajibId }) {
  const byWeek = new Map();
  for (const s of sessions) {
    if (!isIsoDate(s.tanggal)) continue;
    const key = weekStartOf(s.tanggal);
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key).push(s);
  }
  const weeks = [];
  for (let mulai = weekStartOf(sampai); mulai >= weekStartOf(dari); mulai = addDays(mulai, -7)) {
    weeks.push({ mulai, selesai: addDays(mulai, 6), ...kaiwaWeekProgress(byWeek.get(mulai) || [], { target, senseiWajibId }) });
  }
  return weeks;
}

/**
 * Kaiwa Card weeks for a report: every week that has started, from the week the rule applies and the peserta
 * joined; with `bulan` (YYYY-MM) only the weeks whose Monday falls in that month, so a week counts in one month.
 * sessions: [{ tanggal, senseiId }] of one peserta.
 */
export function kaiwaCardRekap(sessions, { rule, tanggalMasuk = null, bulan = null, hariIni = todayJakarta() }) {
  const dari =
    [tanggalMasuk, rule.mulai].filter(isIsoDate).reduce((a, b) => (a > b ? a : b), '') ||
    sessions.map((s) => s.tanggal).filter(isIsoDate).sort()[0];
  if (!dari || dari > hariIni) return { target: rule.target, jumlahMinggu: 0, tercapai: 0 };
  const weeks = kaiwaWeeklyHistory(sessions, { dari, sampai: hariIni, ...rule }).filter(
    (w) => !bulan || w.mulai.startsWith(bulan)
  );
  return { target: rule.target, jumlahMinggu: weeks.length, tercapai: weeks.filter((w) => w.tercapai).length };
}
