// Tampilan murni untuk peta Kanji Adventure. Tidak ada fetch, Vue, atau jam di sini supaya mudah di-test.
// Status selalu berasal dari server; helper ini hanya menerjemahkan bentuk respons ke bentuk tampilan.

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

/** Tombol mulai hanya aktif kalau volume tidak terkunci DAN petaknya memang tersedia. */
export function bisaMulaiChunk(volume, chunk) {
  return Boolean(volume && !volume.terkunci && statusChunk(chunk) === 'tersedia');
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

/** Ringkasan progres untuk kartu volume: persentase chunk dibuka, bukan jumlah kanji. */
export function ringkasProgresAdventure(progres = {}, volume = {}) {
  const chunkCount = Number(volume.chunkCount ?? progres.chunkCount ?? 0);
  const terbuka = Number(progres.chunk_terbuka ?? 0);
  const persen = chunkCount > 0 ? Math.max(0, Math.min(100, Math.round((terbuka / chunkCount) * 100))) : 0;
  return {
    selesai: Boolean(progres.selesai),
    persen,
    dikuasai: Number(progres.dikuasai ?? 0),
    bosses: Number(progres.bosses ?? 0),
  };
}

// portalApi sudah menambahkan awalan /api/portal, jadi path di sini TANPA /portal.
// Menulis /portal/kanji-adventure di sini menghasilkan /api/portal/portal/... yang 404 HTML
// dan berujung pada GENERIC_ERROR di halaman peta.
const DASAR = '/kanji-adventure';

// Request bawaan di-import saat dipakai, bukan saat modul dimuat, supaya helper tetap bisa
// di-test di Node tanpa localStorage. Halaman Vue memakai request ini secara default.
async function requestPortal(path, opsi) {
  const modul = await import('./portalApi.js');
  return modul.portalRequest(path, opsi);
}

/**
 * Klien API Kanji Adventure. Terima `request` injectable supaya mudah di-test;
 * di aplikasi cukup `buatKlienAdventure()` tanpa argumen.
 */
export function buatKlienAdventure({ request = requestPortal } = {}) {
  const kirim = (path, opsi = {}) => request(path, opsi);

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
    riwayat: (query) => (query && Object.keys(query).length ? kirim(`${DASAR}/riwayat`, { query }) : kirim(`${DASAR}/riwayat`, {})),
    monitorPeserta: (pesertaId, query) => {
      const path = `/monitor-latihan/kanji-adventure/peserta/${encodeURIComponent(pesertaId)}`;
      return query && Object.keys(query).length ? kirim(path, { query }) : kirim(path, {});
    },
  };
}
