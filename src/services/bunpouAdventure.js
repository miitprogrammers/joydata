// Helper tampilan murni untuk Bunpou Adventure (tanpa Vue atau jam) plus klien API fitur.
// Status selalu berasal dari server; helper ini hanya menerjemahkan bentuk respons ke bentuk tampilan.
import { portalRequest } from './portalApi.js';
import { apiRequest } from './api.js';

const STATUS_VALID = ['selesai', 'tersedia', 'terkunci'];

/** Volume yang bank soalnya belum ada ("Segera") tidak bisa dimulai, apa pun status gemboknya. */
export function volumeDirilis(volume) {
  return volume?.dirilis !== false;
}

/** Status volume: selesai menang atas segera, segera menang atas terkunci, lalu terkunci, lalu tersedia. */
export function statusVolume(volume) {
  if (volume?.progres?.selesai) return 'selesai';
  if (!volumeDirilis(volume)) return 'segera';
  if (volume?.terkunci) return 'terkunci';
  return 'tersedia';
}

export function statusTahap(tahap) {
  return STATUS_VALID.includes(tahap?.status) ? tahap.status : 'terkunci';
}

export function statusBos(bos) {
  return STATUS_VALID.includes(bos?.status) ? bos.status : 'terkunci';
}

/** Tombol mulai aktif untuk tahap yang tersedia; tahap selesai boleh diulang. Volume "Segera" tidak bisa dimulai. */
export function bisaMulaiTahap(volume, tahap) {
  return Boolean(volume && volumeDirilis(volume) && !volume.terkunci && ['tersedia', 'selesai'].includes(statusTahap(tahap)));
}

export function bisaMulaiBos(volume, bos) {
  return Boolean(volume && volumeDirilis(volume) && !volume.terkunci && statusBos(bos) === 'tersedia');
}

/** Kunci i18n untuk label status. */
export function i18nStatusKey(status, jenis) {
  const peta = {
    tahap: { selesai: 'tahapSelesai', tersedia: 'tahapTersedia', terkunci: 'tahapTerkunci' },
    volume: { selesai: 'volumeSelesai', tersedia: 'volumeTersedia', terkunci: 'volumeTerkunci', segera: 'volumeSegera' },
    bos: { selesai: 'tahapSelesai', tersedia: 'tahapTersedia', terkunci: 'tahapTerkunci' },
  };
  const kunci = peta[jenis]?.[status] || peta.tahap.terkunci;
  return `portal.bunpouAdventure.${kunci}`;
}

/** Judul volume dalam bahasa aktif, dari angka di respons ("N5 Vol 4 · Bab 16–21"); `t` = fungsi terjemahan. */
export function judulVolume(volume, t) {
  if (!volume) return '';
  const [dari, sampai] = Array.isArray(volume.bab) ? volume.bab : [];
  if (!volume.jlpt || !volume.nomor || dari === undefined) return String(volume.judul || volume.kode || '');
  return t('portal.bunpouAdventure.volumeJudul', { jlpt: volume.jlpt, n: volume.nomor, dari, sampai });
}

/** Label tahap dalam bahasa aktif: "Bab 16", "Bab 37–38", "Bab 49 (1/2)". */
export function labelTahap(tahap, t) {
  if (!tahap) return '';
  const bab = tahap.babDari === tahap.babSampai
    ? t('portal.bunpouAdventure.babSatu', { n: tahap.babDari })
    : t('portal.bunpouAdventure.babRentang', { dari: tahap.babDari, sampai: tahap.babSampai });
  return tahap.jumlahBagian > 1 ? `${bab} (${tahap.bagian}/${tahap.jumlahBagian})` : bab;
}

/**
 * Ringkasan kartu volume. Persentasenya adalah pola yang sudah dikuasai dari seluruh volume; 100% hanya saat
 * volume benar-benar selesai (bos tuntas).
 */
export function ringkasProgresBunpou(progres = {}, volume = {}) {
  const dikuasai = Number(progres.dikuasai ?? 0);
  const jumlah = Number(volume.jumlahPola ?? 0);
  const selesai = Boolean(progres.selesai);
  let persen = 0;
  if (selesai) persen = 100;
  else if (jumlah > 0) persen = Math.min(99, Math.max(0, Math.round((dikuasai / jumlah) * 100)));
  return { selesai, persen, dikuasai, jumlah, bos: Number(progres.bos ?? 0) };
}

/** Jumlah pola berbeda dalam satu kertas sesi. */
export function jumlahPolaSesi(soal) {
  return new Set((soal || []).map((k) => k.pola)).size;
}

/** Pola sesi tahap yang sudah dikuasai: seluruh pola sesi dikurangi `sisa` dari server. */
export function polaDikuasaiSesi(soal, sisa) {
  return Math.max(0, jumlahPolaSesi(soal) - Math.max(0, Number(sisa) || 0));
}

/** Banyak soal bos dalam satu ronde (maksimal 10 pola, terburuk dulu); jumlah = seluruh pola di bos. */
export function ukuranRondeBos(jumlah, maks = 10) {
  return Math.min(Math.max(0, Number(jumlah) || 0), maks);
}

/** Kotak dalam baris soal: indeks `bintang` membawa tanda ★. */
export function kotakSoal(kertas) {
  const bintang = Number(kertas?.bintang);
  return [0, 1, 2, 3].map((i) => ({ i, bintang: i === bintang }));
}

/** Baris yang berisi soal (punya `sebelum`/`sesudah`). */
export function barisSoal(kertas) {
  return (kertas?.baris || []).find((b) => 'sebelum' in b || 'sesudah' in b) || null;
}

/**
 * Kalimat utuh dalam urutan benar: { sebelum, bagian: [{ teks, bintang }], sesudah }.
 * `bintang` menandai potongan yang jatuh di kotak ★ (nomor `benar`).
 */
export function susunKalimat(kertas) {
  const baris = barisSoal(kertas) || {};
  const peta = new Map((kertas?.pilihan || []).map((p) => [p.nomor, p.teks]));
  const bagian = (kertas?.urutan || []).map((nomor) => ({
    nomor,
    teks: peta.get(nomor) ?? '',
    bintang: nomor === kertas.benar,
  }));
  return { pembicara: baris.pembicara ?? '', sebelum: baris.sebelum ?? '', bagian, sesudah: baris.sesudah ?? '' };
}

// portalApi sudah menambahkan awalan /api/portal, jadi path di sini TANPA /portal.
// Menulis /portal/bunpou-adventure di sini menghasilkan /api/portal/portal/... yang 404 HTML.
const DASAR = '/bunpou-adventure';

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
 * Klien API Bunpou Adventure. Terima `request`/`requestStaff` injectable supaya mudah di-test;
 * di aplikasi cukup `buatKlienBunpou()` tanpa argumen.
 */
export function buatKlienBunpou({ request = portalRequest, requestStaff = apiRequest } = {}) {
  const kirim = (path, opsi = {}) => request(path, opsi);
  const mintaStaff = (path, opsi = {}) => requestStaff(path, opsi);

  return {
    daftarVolume: () => kirim(`${DASAR}/volume`, {}),
    bacaVolume: (kode) => kirim(`${DASAR}/volume/${encodeURIComponent(kode)}`, {}),
    mulai: ({ volume, mode, tahapIndex }) => {
      const body = { volume };
      if (mode !== undefined) body.mode = mode;
      if (tahapIndex !== undefined) body.tahapIndex = tahapIndex;
      return kirim(`${DASAR}/mulai`, { method: 'POST', body });
    },
    // keepalive and diam are request options, not part of the JSON body (as in PortalTesView).
    detak: (sesiId, { keepalive, ...payload } = {}) => kirim(`${DASAR}/detak`, {
      method: 'POST',
      body: { sesiId, ...payload },
      diam: true,
      keepalive,
    }),
    nilai: (sesiId, jawaban, payload = {}) => kirim(`${DASAR}/nilai`, {
      method: 'POST',
      body: { sesiId, jawaban, ...payload },
    }),
    riwayat: (query) => kirim(denganQuery(`${DASAR}/riwayat`, query), {}),
    monitorPeserta: (pesertaId, query) =>
      mintaStaff(denganQuery(`/monitor-latihan/bunpou-adventure/peserta/${encodeURIComponent(pesertaId)}`, query), {}),
  };
}
