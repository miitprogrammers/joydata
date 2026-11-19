// Helper tampilan murni untuk peta Kanji Adventure (tanpa Vue atau jam) plus klien API fitur.
// Status selalu berasal dari server; helper ini hanya menerjemahkan bentuk respons ke bentuk tampilan.
import { portalRequest } from './portalApi.js';
import { apiRequest } from './api.js';

const STATUS_VALID = ['selesai', 'tersedia', 'terkunci'];

/** Status volume: selesai menang atas terkunci, supaya volume lama yang sudah tuntas tetap terlihat selesai. */
export function statusVolume(volume) {
  if (volume?.progres?.selesai) return 'selesai';
  if (volume?.terkunci) return 'terkunci';
  return 'tersedia';
}

export function statusChunk(chunk) {
  return STATUS_VALID.includes(chunk?.status) ? chunk.status : 'terkunci';
}

export function statusBoss(boss) {
  return STATUS_VALID.includes(boss?.status) ? boss.status : 'terkunci';
}

/** Tombol mulai aktif untuk langkah yang tersedia; langkah selesai boleh diulang. */
export function bisaMulaiChunk(volume, chunk) {
  return Boolean(volume && !volume.terkunci && ['tersedia', 'selesai'].includes(statusChunk(chunk)));
}

export function bisaMulaiBoss(volume, boss) {
  return Boolean(volume && !volume.terkunci && statusBoss(boss) === 'tersedia');
}

/** Kunci i18n untuk label status. */
export function i18nStatusKey(status, jenis) {
  const peta = {
    chunk: { selesai: 'chunkSelesai', tersedia: 'chunkTersedia', terkunci: 'chunkTerkunci' },
    volume: { selesai: 'volumeSelesai', tersedia: 'volumeTersedia', terkunci: 'volumeTerkunci' },
    boss: { selesai: 'chunkSelesai', tersedia: 'chunkTersedia', terkunci: 'bossTerkunci' },
  };
  const kunci = peta[jenis]?.[status] || peta.chunk.terkunci;
  return `portal.kanjiAdventure.${kunci}`;
}

/**
 * Ringkasan kartu volume. Persentasenya adalah kanji yang sudah dikuasai dari seluruh volume; 100% hanya
 * saat volume benar-benar selesai (boss tuntas), bukan saat semua langkah reguler baru terbuka.
 */
export function ringkasProgresAdventure(progres = {}, volume = {}) {
  const chunkCount = Number(volume.chunkCount ?? progres.chunkCount ?? 0);
  const terbuka = Number(progres.chunk_terbuka ?? 0);
  const dikuasai = Number(progres.dikuasai ?? 0);
  const jumlah = Number(volume.jumlah ?? progres.jumlah ?? 0);
  const selesai = Boolean(progres.selesai);
  let persen = 0;
  if (selesai) persen = 100;
  else if (jumlah > 0) persen = Math.min(99, Math.max(0, Math.round((dikuasai / jumlah) * 100)));
  else if (chunkCount > 0) persen = Math.min(99, Math.max(0, Math.round((terbuka / chunkCount) * 100)));
  return {
    selesai,
    persen,
    dikuasai,
    bosses: Number(progres.bosses ?? 0),
  };
}

// portalApi sudah menambahkan awalan /api/portal, jadi path di sini TANPA /portal.
// Menulis /portal/kanji-adventure di sini menghasilkan /api/portal/portal/... yang 404 HTML
// dan berujung pada GENERIC_ERROR di halaman peta.
const DASAR = '/kanji-adventure';

function denganQuery(path, query) {
  if (!query || typeof query !== 'object') return path;
  const params = new URLSearchParams();
  for (const [kunci, nilai] of Object.entries(query)) {
    if (nilai === undefined || nilai === null || nilai === '') continue;
    params.set(kunci, String(nilai));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/**
 * Klien API Kanji Adventure. Terima `request`/`requestStaff` injectable supaya mudah di-test;
 * di aplikasi cukup `buatKlienAdventure()` tanpa argumen.
 */
export function buatKlienAdventure({ request = portalRequest, requestStaff = apiRequest } = {}) {
  const kirim = (path, opsi = {}) => request(path, opsi);
  const mintaStaff = (path, opsi = {}) => requestStaff(path, opsi);

  return {
    daftarVolume: () => kirim(`${DASAR}/volume`, {}),
    bacaVolume: (materi) => kirim(`${DASAR}/volume/${encodeURIComponent(materi)}`, {}),
    mulai: ({ materi, mode, chunkIndex }) => {
      const body = { materi };
      if (mode !== undefined) body.mode = mode;
      if (chunkIndex !== undefined) body.chunkIndex = chunkIndex;
      return kirim(`${DASAR}/mulai`, { method: 'POST', body });
    },
    detak: (sesiId, payload = {}) => kirim(`${DASAR}/detak`, {
      method: 'POST',
      body: { sesiId, ...payload },
    }),
    nilai: (sesiId, jawaban, payload = {}) => kirim(`${DASAR}/nilai`, {
      method: 'POST',
      body: { sesiId, jawaban, ...payload },
    }),
    riwayat: (query) => kirim(denganQuery(`${DASAR}/riwayat`, query), {}),
    monitorPeserta: (pesertaId, query) =>
      mintaStaff(denganQuery(`/monitor-latihan/kanji-adventure/peserta/${encodeURIComponent(pesertaId)}`, query), {}),
  };
}
