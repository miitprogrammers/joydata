import { ensureInitialized, getMode, getPool, readLocalState, saveLocalState, appendAudit } from './engine.js';
import { DEFAULT_SETTINGS, loadReportState, getStudentNameMap, loadPenempatan } from './fase3Repo.js';
import {
  buildPesertaJourney,
  buildKelasSummary,
  buildPesertaAiFacts,
  buildKelasAiFacts,
  restoreAliases,
  hashFacts,
} from '../domain/smartReport.js';
import { writeResume, PROMPT_VERSION } from '../ai/smartResume.js';

const MAX_RESUME_LENGTH = 6000;

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error('VALIDATION_ERROR');
  return id;
}

function createContext(state) {
  const kategoriMap = new Map((state.sikapKategori || []).map((k) => [k.id, k]));
  return {
    state,
    settings: { ...DEFAULT_SETTINGS, ...(state.settings || {}) },
    nameMap: getStudentNameMap(state),
    sikapRows: (state.nilaiSikap || []).map((s) => {
      const kat = s.kategoriId ? kategoriMap.get(s.kategoriId) : null;
      return { ...s, kategoriNamaId: kat?.namaId, kategoriNamaJa: kat?.namaJa };
    }),
  };
}

function namaPeserta(ctx, p) {
  return ctx.nameMap.get(Number(p.mancationAkunId)) || p.nama || `Peserta #${p.mancationAkunId}`;
}

function kelasInfo(ctx, kelasId) {
  const kelas = kelasId ? (ctx.state.kelas || []).find((k) => k.id === kelasId) : null;
  if (!kelas) return null;
  const program = kelas.programId ? (ctx.state.programs || []).find((p) => p.id === kelas.programId) : null;
  const sensei = kelas.senseiId ? (ctx.state.staff || []).find((s) => s.id === kelas.senseiId) : null;
  return {
    id: kelas.id,
    namaKelas: kelas.namaKelas,
    tanggalStart: kelas.tanggalStart || null,
    programNama: program?.namaId || '-',
    programNamaJa: program?.namaJa || '-',
    senseiNama: sensei?.nama || '-',
  };
}

function activePeserta(ctx) {
  return (ctx.state.peserta || []).filter((p) => !p.deletedAt);
}

function findPeserta(ctx, pid) {
  const student = activePeserta(ctx).find((p) => p.id === pid);
  if (!student) throw new Error('NOT_FOUND');
  return student;
}

function journeyOf(ctx, student) {
  return buildPesertaJourney({
    pesertaId: student.id,
    kelasId: student.kelasId,
    ujianRows: ctx.state.nilaiUjian || [],
    kaiwaRows: ctx.state.nilaiKaiwa || [],
    sikapRows: ctx.sikapRows,
    absensiRows: ctx.state.absensi || [],
    settings: ctx.settings,
  });
}

function pesertaFacts(ctx, student, journey) {
  return buildPesertaAiFacts(journey, {
    nama: namaPeserta(ctx, student),
    programNama: kelasInfo(ctx, student.kelasId)?.programNama,
    settings: ctx.settings,
  });
}

function kelasMembers(ctx, kelasId) {
  return activePeserta(ctx)
    .filter((p) => p.kelasId === kelasId)
    .map((student) => ({ student, pesertaId: student.id, nama: namaPeserta(ctx, student), journey: journeyOf(ctx, student) }))
    .sort((a, b) => a.nama.localeCompare(b.nama));
}

function kelasFacts(ctx, kelasId, summary) {
  return buildKelasAiFacts(summary, { programNama: kelasInfo(ctx, kelasId)?.programNama, settings: ctx.settings });
}

// ---------------------------------------------------------------------------------------------------------
// Stored resumes: table smart_report_resume in postgres mode, state.smartReportResume in the local store.

async function readResumes(scope, refIds) {
  await ensureInitialized();
  const byRef = new Map();
  if (!refIds.length) return byRef;

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT r.ref_id AS "refId", r.teks_id AS "teksId", r.teks_ja AS "teksJa", r.data_hash AS "dataHash",
              r.model, r.dibuat_at AS "dibuatAt", r.diedit_at AS "dieditAt",
              s1.nama AS "dibuatOleh", s2.nama AS "dieditOleh"
       FROM smart_report_resume r
       LEFT JOIN staff s1 ON s1.id = r.dibuat_oleh_staff_id
       LEFT JOIN staff s2 ON s2.id = r.diedit_oleh_staff_id
       WHERE r.scope = $1 AND r.ref_id = ANY($2::int[])`,
      [scope, refIds]
    );
    for (const row of res.rows) byRef.set(row.refId, row);
    return byRef;
  }

  const state = readLocalState();
  const staffNama = (id) => (state.staff || []).find((s) => s.id === id)?.nama || null;
  for (const row of state.smartReportResume || []) {
    if (row.scope !== scope || !refIds.includes(row.refId)) continue;
    byRef.set(row.refId, { ...row, dibuatOleh: staffNama(row.dibuatOlehId), dieditOleh: staffNama(row.dieditOlehId) });
  }
  return byRef;
}

async function readResume(scope, refId) {
  return (await readResumes(scope, [refId])).get(refId) || null;
}

/** fields: teksId, teksJa and either { dataHash, model, actor } (generated) or { actor, edited: true }. */
async function storeResume(scope, refId, { teksId, teksJa, dataHash, model, actor, edited = false }) {
  await ensureInitialized();
  const now = new Date().toISOString();

  if (getMode() === 'postgres') {
    if (edited) {
      await getPool().query(
        `INSERT INTO smart_report_resume (scope, ref_id, teks_id, teks_ja, data_hash, diedit_oleh_staff_id, diedit_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (scope, ref_id) DO UPDATE SET
           teks_id = EXCLUDED.teks_id, teks_ja = EXCLUDED.teks_ja,
           diedit_oleh_staff_id = EXCLUDED.diedit_oleh_staff_id, diedit_at = NOW()`,
        [scope, refId, teksId, teksJa, dataHash, actor?.id || null]
      );
    } else {
      await getPool().query(
        `INSERT INTO smart_report_resume (scope, ref_id, teks_id, teks_ja, data_hash, model, dibuat_oleh_staff_id, dibuat_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (scope, ref_id) DO UPDATE SET
           teks_id = EXCLUDED.teks_id, teks_ja = EXCLUDED.teks_ja, data_hash = EXCLUDED.data_hash,
           model = EXCLUDED.model, dibuat_oleh_staff_id = EXCLUDED.dibuat_oleh_staff_id, dibuat_at = NOW(),
           diedit_oleh_staff_id = NULL, diedit_at = NULL`,
        [scope, refId, teksId, teksJa, dataHash, model, actor?.id || null]
      );
    }
    return;
  }

  const state = readLocalState();
  state.smartReportResume = state.smartReportResume || [];
  let row = state.smartReportResume.find((r) => r.scope === scope && r.refId === refId);
  if (!row) {
    row = { scope, refId, teksId: '', teksJa: '', dataHash, model: '', dibuatOlehId: null, dibuatAt: null, dieditOlehId: null, dieditAt: null };
    state.smartReportResume.push(row);
  }
  Object.assign(row, { teksId, teksJa });
  if (edited) {
    Object.assign(row, { dieditOlehId: actor?.id || null, dieditAt: now });
  } else {
    Object.assign(row, { dataHash, model, dibuatOlehId: actor?.id || null, dibuatAt: now, dieditOlehId: null, dieditAt: null });
  }
  saveLocalState();
}

function toResumeView(row, currentHash) {
  if (!row) return null;
  return {
    teksId: row.teksId,
    teksJa: row.teksJa,
    model: row.model || null,
    dibuatAt: row.dibuatAt || null,
    dibuatOleh: row.dibuatOleh || null,
    dieditAt: row.dieditAt || null,
    dieditOleh: row.dieditOleh || null,
    // The data behind the resume changed since it was written (new scores, notes or settings).
    usang: row.dataHash !== currentHash,
  };
}

// ---------------------------------------------------------------------------------------------------------

async function pesertaReport(ctx, student, journey, resumeRow) {
  return {
    student: {
      id: student.id,
      nama: namaPeserta(ctx, student),
      mancationAkunId: student.mancationAkunId,
      statusTag: student.statusTag || 'standar',
      tanggalMasuk: student.tanggalMasuk || null,
    },
    kelas: kelasInfo(ctx, student.kelasId),
    penempatan: await loadPenempatan(student.id, ctx.state),
    ...journey,
    resume: toResumeView(resumeRow, hashFacts(pesertaFacts(ctx, student, journey), PROMPT_VERSION)),
  };
}

export async function getSmartReportOptions() {
  const ctx = createContext(await loadReportState());
  const peserta = activePeserta(ctx);
  const kelas = (ctx.state.kelas || [])
    .filter((k) => !k.deletedAt)
    .map((k) => ({
      id: k.id,
      namaKelas: k.namaKelas,
      status: k.status,
      jumlahPeserta: peserta.filter((p) => p.kelasId === k.id).length,
    }))
    .sort((a, b) => a.namaKelas.localeCompare(b.namaKelas, undefined, { numeric: true }));
  const namaKelas = new Map(kelas.map((k) => [k.id, k.namaKelas]));
  return {
    kelas,
    peserta: peserta
      .map((p) => ({
        id: p.id,
        nama: namaPeserta(ctx, p),
        mancationAkunId: p.mancationAkunId,
        kelasId: p.kelasId,
        namaKelas: namaKelas.get(p.kelasId) || '-',
      }))
      .sort((a, b) => a.nama.localeCompare(b.nama)),
  };
}

export async function getSmartReportPeserta({ pesertaId }) {
  const pid = parseId(pesertaId);
  const ctx = createContext(await loadReportState());
  const student = findPeserta(ctx, pid);
  return {
    settings: ctx.settings,
    peserta: await pesertaReport(ctx, student, journeyOf(ctx, student), await readResume('peserta', pid)),
  };
}

export async function getSmartReportKelas({ kelasId }) {
  const kid = parseId(kelasId);
  const ctx = createContext(await loadReportState());
  const kelas = kelasInfo(ctx, kid);
  if (!kelas) throw new Error('NOT_FOUND');

  const members = kelasMembers(ctx, kid);
  const summary = buildKelasSummary(members, ctx.settings);
  const { facts } = kelasFacts(ctx, kid, summary);
  const [kelasResume, pesertaResumes] = await Promise.all([
    readResume('kelas', kid),
    readResumes('peserta', members.map((m) => m.pesertaId)),
  ]);

  return {
    settings: ctx.settings,
    kelas,
    ringkasan: summary,
    resume: toResumeView(kelasResume, hashFacts(facts, PROMPT_VERSION)),
    peserta: await Promise.all(
      members.map((m) => pesertaReport(ctx, m.student, m.journey, pesertaResumes.get(m.pesertaId) || null))
    ),
  };
}

/** The facts a resume is written from; also validates that the peserta or class exists. */
function resumeFacts(ctx, scope, refId) {
  if (scope === 'peserta') {
    const student = findPeserta(ctx, refId);
    return { facts: pesertaFacts(ctx, student, journeyOf(ctx, student)), aliases: null, kosong: false };
  }
  if (scope === 'kelas') {
    if (!kelasInfo(ctx, refId)) throw new Error('NOT_FOUND');
    const summary = buildKelasSummary(kelasMembers(ctx, refId), ctx.settings);
    return { ...kelasFacts(ctx, refId, summary), kosong: summary.statistik.jumlahPeserta === 0 };
  }
  throw new Error('VALIDATION_ERROR');
}

/** Writes (or rewrites) the AI resume of one peserta or class with Gemini. */
export async function generateSmartResume({ scope, id, actor }) {
  const refId = parseId(id);
  const ctx = createContext(await loadReportState());
  const { facts, aliases, kosong } = resumeFacts(ctx, scope, refId);
  if (kosong) throw new Error('SMART_REPORT_NO_DATA');

  const dataHash = hashFacts(facts, PROMPT_VERSION);
  const generated = await writeResume(scope, facts);
  const teksId = aliases ? restoreAliases(generated.teksId, aliases) : generated.teksId;
  const teksJa = aliases ? restoreAliases(generated.teksJa, aliases) : generated.teksJa;

  await storeResume(scope, refId, { teksId, teksJa, dataHash, model: generated.model, actor });
  await appendAudit(actor, 'GENERATE_SMART_RESUME', 'smart_report_resume', `${scope}:${refId}`, { model: generated.model });
  return toResumeView(await readResume(scope, refId), dataHash);
}

/**
 * Saves a reviewer's edit of the resume text, or a resume written by hand when none exists yet.
 * An edit keeps the data fingerprint of the generated version; a hand-written one is current as of now.
 */
export async function updateSmartResume({ scope, id, teksId, teksJa, actor }) {
  const refId = parseId(id);
  const nextId = String(teksId || '').trim();
  const nextJa = String(teksJa || '').trim();
  if (!nextId || !nextJa || nextId.length > MAX_RESUME_LENGTH || nextJa.length > MAX_RESUME_LENGTH) {
    throw new Error('VALIDATION_ERROR');
  }

  const ctx = createContext(await loadReportState());
  const currentHash = hashFacts(resumeFacts(ctx, scope, refId).facts, PROMPT_VERSION);
  const existing = await readResume(scope, refId);

  await storeResume(scope, refId, {
    teksId: nextId,
    teksJa: nextJa,
    dataHash: existing ? existing.dataHash : currentHash,
    actor,
    edited: true,
  });
  await appendAudit(actor, 'UPDATE_SMART_RESUME', 'smart_report_resume', `${scope}:${refId}`, {
    dataLama: existing ? { teksId: existing.teksId, teksJa: existing.teksJa } : null,
  });
  return toResumeView(await readResume(scope, refId), currentHash);
}
