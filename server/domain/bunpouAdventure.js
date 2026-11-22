// Bunpou Adventure: perjalanan tersimpan lewat volume pola kalimat (soal bintang), kembaran Kanji Adventure.
// Modul murni: tidak menyentuh DB, jam, atau sesi. Katalog dan bank soal bisa disuntikkan supaya tes memakai fixture.
// Aturan: docs/bunpou-adventure/spek-kode.md §3.

import { KATALOG_MATERI } from './materiBunpou/katalog.js';
import { SOAL_BINTANG_N5 } from './bankSoal/bintangN5.js';
import { SOAL_BINTANG_N4 } from './bankSoal/bintangN4.js';
import { kertasSoalBintang, nilaiSoalBintang } from './soalBintang.js';

export const BENAR_DIKUASAI = 2; // dua jawaban benar pada dua varian berbeda: menebak lolos 1/16
export const MIN_VARIAN = BENAR_DIKUASAI + 2; // cadangan untuk ulangan dan bos
export const MAKS_POLA_TAHAP = 6;
export const MIN_POLA_TAHAP = 2; // bab dengan 1 pola digabung ke bab tetangga
export const MAKS_POLA_BOS = 10; // per ronde
export const AMBANG_PERHATIAN = 3;
export const MAKS_RIWAYAT = 20;
export const MAKS_JEJAK = 12; // jejak jawaban per pola

export const VOLUME_BUNPOU = [
  { kode: 'BN5V1', jlpt: 'N5', nomor: 1, bab: [1, 4] },
  { kode: 'BN5V2', jlpt: 'N5', nomor: 2, bab: [5, 9] },
  { kode: 'BN5V3', jlpt: 'N5', nomor: 3, bab: [10, 15] },
  { kode: 'BN5V4', jlpt: 'N5', nomor: 4, bab: [16, 21] },
  { kode: 'BN5V5', jlpt: 'N5', nomor: 5, bab: [22, 25] },
  { kode: 'BN4V1', jlpt: 'N4', nomor: 1, bab: [26, 30] },
  { kode: 'BN4V2', jlpt: 'N4', nomor: 2, bab: [31, 35] },
  { kode: 'BN4V3', jlpt: 'N4', nomor: 3, bab: [36, 40] },
  { kode: 'BN4V4', jlpt: 'N4', nomor: 4, bab: [41, 45] },
  { kode: 'BN4V5', jlpt: 'N4', nomor: 5, bab: [46, 50] },
];
export const URUTAN_VOLUME_BUNPOU = VOLUME_BUNPOU.map((v) => v.kode);

// 19 pola yang hanya ada di modul 111 Bunpo N4 diberi bab Minna terdekat menurut temanya (spek-kode §3.2, disetujui user).
export const BAB_MODUL = {
  'you-to-suru': 31,
  'koto-ni-suru': 36,
  'koto-ni-naru': 36,
  'te-hoshii': 41,
  'gimonshi-demo': 40,
  mitai: 47,
  rashii: 47,
  'te-iku': 43,
  'te-kuru': 43,
  'te-bakari-iru': 46,
  mama: 34,
  'ga-suru': 47,
  'te-sashiageru': 41,
  'o-itadaku': 50,
  'kenjougo-moushiageru': 50,
  'de-gozaimasu': 50,
  bakari: 46,
  'suushi-mo': 44,
  sa: 44,
};

/** Pola yang tidak cocok dijadikan soal bintang (kosong: semua cocok; diputuskan di F1). */
export const POLA_TANPA_BINTANG = [];

const BANK_BAWAAN = [...SOAL_BINTANG_N5, ...SOAL_BINTANG_N4];
const unik = (daftar) => [...new Set(daftar)];

export function cariVolume(kode) {
  return VOLUME_BUNPOU.find((v) => v.kode === kode) || null;
}

/** Bab Minna sebuah pola: bab terkecil di sumber.minnaBab, atau BAB_MODUL untuk pola modul-saja. */
export function babPola(entri) {
  const bab = entri?.sumber?.minnaBab || [];
  if (bab.length) return Math.min(...bab);
  return BAB_MODUL[entri?.id] ?? null;
}

/** Id pola sebuah volume, urut bab lalu urutan katalog. */
export function polaVolume(kode, { katalog = KATALOG_MATERI } = {}) {
  const vol = cariVolume(kode);
  if (!vol) throw new Error('INVALID_BUNPOU_VOLUME');
  return katalog
    .map((entri, urutan) => ({ entri, urutan, bab: babPola(entri) }))
    .filter(({ entri, bab }) => entri.tingkat === vol.jlpt && bab !== null && bab >= vol.bab[0] && bab <= vol.bab[1]
      && !POLA_TANPA_BINTANG.includes(entri.id))
    .sort((a, b) => a.bab - b.bab || a.urutan - b.urutan)
    .map(({ entri }) => entri.id);
}

/** Bagi n pola menjadi bagian yang seimbang, masing-masing <= MAKS_POLA_TAHAP. */
function bagiSeimbang(daftar) {
  const bagian = Math.ceil(daftar.length / MAKS_POLA_TAHAP);
  const dasar = Math.floor(daftar.length / bagian);
  const lebih = daftar.length % bagian;
  const hasil = [];
  let awal = 0;
  for (let i = 0; i < bagian; i += 1) {
    const ukuran = dasar + (i < lebih ? 1 : 0);
    hasil.push(daftar.slice(awal, awal + ukuran));
    awal += ukuran;
  }
  return hasil;
}

/**
 * Tahap = satu bab. Bab dengan 1 pola digabung ke bab berikutnya di volume yang sama (atau ke sebelumnya bila
 * terakhir); gabungan atau bab dengan > 6 pola dipecah rata. Index tahap = urutan pembelajaran.
 */
export function tahapVolume(kode, { katalog = KATALOG_MATERI } = {}) {
  const babPerId = new Map(katalog.map((e) => [e.id, babPola(e)]));
  const perBab = new Map();
  for (const id of polaVolume(kode, { katalog })) {
    const bab = babPerId.get(id);
    if (!perBab.has(bab)) perBab.set(bab, []);
    perBab.get(bab).push(id);
  }
  const kelompok = [];
  let tertunda = null; // bab 1 pola yang menunggu bab berikutnya
  for (const bab of [...perBab.keys()].sort((a, b) => a - b)) {
    const pola = perBab.get(bab);
    if (tertunda) {
      kelompok.push({ babDari: tertunda.bab, babSampai: bab, pola: [...tertunda.pola, ...pola] });
      tertunda = null;
    } else if (pola.length < MIN_POLA_TAHAP) {
      tertunda = { bab, pola };
    } else {
      kelompok.push({ babDari: bab, babSampai: bab, pola });
    }
  }
  if (tertunda) {
    const terakhir = kelompok.at(-1);
    if (terakhir) {
      terakhir.babSampai = tertunda.bab;
      terakhir.pola = [...terakhir.pola, ...tertunda.pola];
    } else {
      kelompok.push({ babDari: tertunda.bab, babSampai: tertunda.bab, pola: tertunda.pola });
    }
  }
  const hasil = [];
  for (const k of kelompok) {
    const bagian = k.pola.length > MAKS_POLA_TAHAP ? bagiSeimbang(k.pola) : [k.pola];
    bagian.forEach((pola, i) => hasil.push({
      index: hasil.length, babDari: k.babDari, babSampai: k.babSampai, bagian: i + 1, jumlahBagian: bagian.length, pola,
    }));
  }
  return hasil;
}

/**
 * Volume dirilis bila setiap polanya punya >= MIN_VARIAN soal di bank. Dengan `progres`, yang dinilai adalah pola
 * snapshot tahap yang dibekukan (ditambah bos-nya), bukan katalog hidup: itulah yang akan diminta sesi peserta ini.
 */
export function statusRilis(kode, { katalog = KATALOG_MATERI, bank = BANK_BAWAAN, progres = null } = {}) {
  const ada = new Map();
  for (const s of bank) ada.set(s.pola, (ada.get(s.pola) || 0) + 1);
  const pola = progres?.tahap?.length
    ? unik([...progres.tahap.flatMap((t) => t.pola), ...daftarBossBunpou(progres).map((b) => b.id)])
    : polaVolume(kode, { katalog });
  const kurang = pola.filter((id) => (ada.get(id) || 0) < MIN_VARIAN).map((id) => ({ pola: id, ada: ada.get(id) || 0 }));
  return { dirilis: pola.length > 0 && kurang.length === 0, kurang };
}

/** Vol 1 tiap tingkat selalu terbuka; Vol n perlu Vol n-1 di tingkat yang sama selesai. */
export function volumeTersedia(semuaProgres, kode) {
  const vol = cariVolume(kode);
  if (!vol) return false;
  if (vol.nomor === 1) return true;
  const sebelumnya = VOLUME_BUNPOU.find((v) => v.jlpt === vol.jlpt && v.nomor === vol.nomor - 1);
  const progres = (semuaProgres || []).find((p) => p.volume === sebelumnya.kode);
  return Boolean(progres && progres.selesai);
}

function entriBoss(b) {
  if (typeof b === 'string') return { id: b, salah: 0, terakhirSalah: null };
  if (!b || typeof b !== 'object' || typeof b.id !== 'string') return null;
  const salah = Number(b.salah);
  return {
    id: b.id,
    salah: Number.isFinite(salah) && salah > 0 ? Math.floor(salah) : 0,
    terakhirSalah: typeof b.terakhirSalah === 'string' ? b.terakhirSalah : null,
  };
}

/** Daftar bos dari bentuk tersimpan apa pun, digabung per id, salah terbanyak dulu. */
export function daftarBossBunpou(progres) {
  const gabungan = new Map();
  for (const mentah of progres?.bosses || []) {
    const boss = entriBoss(mentah);
    if (!boss) continue;
    const lama = gabungan.get(boss.id);
    gabungan.set(boss.id, lama ? {
      id: boss.id,
      salah: lama.salah + boss.salah,
      terakhirSalah: [lama.terakhirSalah, boss.terakhirSalah].filter(Boolean).sort().at(-1) || null,
    } : boss);
  }
  return [...gabungan.values()].sort((a, b) => b.salah - a.salah || a.id.localeCompare(b.id));
}

/** Progres kosong sebuah volume; `tahap` dibekukan saat volume pertama dibuka. */
export function progresAwal(kode, tahap) {
  return {
    volume: kode,
    tahap,
    tahap_terbuka: 0,
    benar: {},
    dikuasai: [],
    bosses: [],
    salah: {},
    jejak: {},
    bos_ronde: 0,
    selesai: false,
    perlu_perhatian: false,
    riwayat: [],
  };
}

/**
 * Varian untuk satu pola, deterministik. Buang varian yang sudah benar dan percobaan terakhir; urutkan
 * belum pernah dilihat -> paling lama tidak dilihat -> urutan bank. Bila calon kurang, isi dengan varian yang
 * dibuang (percobaan terakhir paling akhir, hanya bila tak ada pilihan lain). Tidak ada id kembar dalam hasil.
 */
export function pilihVarian(soalPola, jejakPola, { jumlah, benarIds = [] }) {
  const jejak = jejakPola || [];
  const terakhir = jejak.length ? jejak[jejak.length - 1].soal : null;
  const terlihat = new Map(); // id -> urutan jejak terakhir; lebih kecil = lebih lama
  jejak.forEach((j, i) => terlihat.set(j.soal, i));
  const urutan = new Map(soalPola.map((s, i) => [s.id, i]));
  const bandingkan = (a, b) => (terlihat.has(a.id) ? terlihat.get(a.id) : -1) - (terlihat.has(b.id) ? terlihat.get(b.id) : -1)
    || urutan.get(a.id) - urutan.get(b.id);
  const unikSoal = soalPola.filter((s, i) => soalPola.findIndex((t) => t.id === s.id) === i);
  const calon = unikSoal.filter((s) => !benarIds.includes(s.id) && s.id !== terakhir).sort(bandingkan);
  const dibuang = unikSoal.filter((s) => benarIds.includes(s.id) && s.id !== terakhir).sort(bandingkan);
  const terakhirSaja = unikSoal.filter((s) => s.id === terakhir);
  // Varian benar yang sudah dikuasai lebih baik diulang daripada percobaan terakhir; yang terakhir hanya jalan keluar.
  const jatuhTerakhir = terakhirSaja.filter((s) => !benarIds.includes(s.id));
  const jatuhBenar = terakhirSaja.filter((s) => benarIds.includes(s.id));
  return [...calon, ...dibuang, ...jatuhTerakhir, ...jatuhBenar].slice(0, Math.max(0, jumlah));
}

/** Memeriksa gerbang sebuah sesi. Melempar TAHAP_TIDAK_VALID / TAHAP_TERKUNCI. */
export function periksaGerbang(progres, { mode, tahapIndex } = {}) {
  const tahap = progres?.tahap || [];
  const terbuka = Number(progres?.tahap_terbuka) || 0;
  if (mode === 'bos' || tahapIndex === -1 || tahapIndex === '-1') {
    if (tahap.length === 0 || terbuka < tahap.length || progres.selesai || daftarBossBunpou(progres).length === 0) {
      throw new Error('TAHAP_TERKUNCI');
    }
    return { mode: 'bos', tahapIndex: -1 };
  }
  const index = typeof tahapIndex === 'string' && tahapIndex.trim() !== '' ? Number(tahapIndex) : tahapIndex;
  if (!Number.isInteger(index) || index < 0 || index >= tahap.length) throw new Error('TAHAP_TIDAK_VALID');
  if (index > terbuka) throw new Error('TAHAP_TERKUNCI');
  return { mode: 'tahap', tahapIndex: index };
}

const sudahDikuasai = (progres, pola) => (progres.dikuasai || []).includes(pola)
  || ((progres.benar || {})[pola] || []).length >= BENAR_DIKUASAI;

/**
 * Rencana satu sesi. Melempar TAHAP_TIDAK_VALID / TAHAP_TERKUNCI.
 * - tahap: tiap pola yang belum dikuasai mendapat (BENAR_DIKUASAI - benar[pola].length) varian. Bila semua pola
 *   sudah dikuasai (mengulang tahap lama), tiap pola mendapat 1 varian sebagai latihan bebas. Urutan soal
 *   diselang-seling: varian ke-1 semua pola, lalu varian ke-2.
 * - bos: semua tahap lulus dan ada bos; maks. MAKS_POLA_BOS pola (salah terbanyak dulu), 1 varian.
 */
export function rencanaSesi(progres, kode, input = {}, { bank = BANK_BAWAAN, rng = Math.random } = {}) {
  const gerbang = periksaGerbang(progres, input);
  const bankPola = (id) => bank.filter((s) => s.pola === id);
  const jejakDari = (id) => (progres.jejak || {})[id] || [];

  if (gerbang.mode === 'bos') {
    const bos = daftarBossBunpou(progres).slice(0, MAKS_POLA_BOS);
    const soal = [];
    const polaIds = [];
    for (const b of bos) {
      const [pilihan] = pilihVarian(bankPola(b.id), jejakDari(b.id), { jumlah: 1 });
      // A boss without any variant could never be cleared; refuse instead of silently skipping it.
      if (!pilihan) throw new Error('VOLUME_BELUM_DIRILIS');
      soal.push(pilihan);
      polaIds.push(b.id);
    }
    return {
      mode: 'bos',
      tahapIndex: -1,
      ronde: (Number(progres.bos_ronde) || 0) + 1,
      volume: kode,
      polaIds,
      kertas: soal.map((s) => kertasSoalBintang(s, rng)),
    };
  }

  const tahap = progres.tahap[gerbang.tahapIndex];
  const belum = tahap.pola.filter((id) => !sudahDikuasai(progres, id));
  const latihan = belum.length === 0;
  const diminta = latihan ? tahap.pola : belum;
  const pilihanPola = diminta.map((id) => {
    const benarIds = ((progres.benar || {})[id] || []);
    const jumlah = latihan ? 1 : Math.max(1, BENAR_DIKUASAI - benarIds.length);
    const dipilih = pilihVarian(bankPola(id), jejakDari(id), { jumlah, benarIds: latihan ? [] : benarIds });
    // Too few variants make the pattern unpassable (needs distinct variants): refuse instead of dropping it.
    if (dipilih.length < jumlah) throw new Error('VOLUME_BELUM_DIRILIS');
    return { id, soal: dipilih };
  });
  const soal = [];
  const putaran = Math.max(0, ...pilihanPola.map((p) => p.soal.length));
  for (let r = 0; r < putaran; r += 1) {
    for (const p of pilihanPola) if (p.soal[r]) soal.push(p.soal[r]);
  }
  return {
    mode: 'tahap',
    tahapIndex: gerbang.tahapIndex,
    ronde: 0,
    volume: kode,
    latihan,
    polaIds: pilihanPola.map((p) => p.id),
    kertas: soal.map((s) => kertasSoalBintang(s, rng)),
  };
}

/** Nilai satu sesi dari kertas tersimpan; `jawaban` = { [soalId]: nomor }. Hanya nomor yang dibaca dari client. */
export function nilaiSesi(kertas, jawaban) {
  const detail = (kertas || []).map((k) => {
    const mentah = jawaban && typeof jawaban === 'object' ? jawaban[k.id] : undefined;
    const bisaAngka = typeof mentah === 'number' || (typeof mentah === 'string' && mentah.trim() !== '');
    const dipilih = bisaAngka && Number.isInteger(Number(mentah)) ? Number(mentah) : null;
    return {
      soalId: k.id,
      pola: k.pola,
      dipilih,
      benar: dipilih !== null && nilaiSoalBintang(k, dipilih),
      kunci: k.benar,
      urutan: k.urutan,
    };
  });
  const benar = detail.filter((d) => d.benar).length;
  const total = detail.length;
  return {
    detail,
    benar,
    total,
    skor: total ? Math.round((benar / total) * 100) : 0,
    lulus: total > 0 && benar === total,
  };
}

/** Apakah tahap yang dimainkan sekarang tuntas: tahap = semua polanya dikuasai; bos (-1) = tidak ada bos tersisa. */
export function tahapTuntas(progres, tahapIndex) {
  if (tahapIndex < 0) return daftarBossBunpou(progres).length === 0;
  const tahap = (progres.tahap || [])[tahapIndex];
  return Boolean(tahap) && tahap.pola.every((id) => (progres.dikuasai || []).includes(id));
}

/**
 * Lipat satu sesi bernilai ke progres tersimpan (aturan spek-kode §3.5). Murni: argumen tidak diubah.
 * `tahapIndex` = -1 untuk ronde bos.
 */
export function evaluasiProgres(progres, hasil, { tahapIndex, sekarang = new Date().toISOString() }) {
  const modeBos = tahapIndex < 0;
  const benar = Object.fromEntries(Object.entries(progres.benar || {}).map(([k, v]) => [k, [...v]]));
  const salah = { ...(progres.salah || {}) };
  const jejak = Object.fromEntries(Object.entries(progres.jejak || {}).map(([k, v]) => [k, [...v]]));
  let bosses = daftarBossBunpou(progres);
  const sudahSelesai = Boolean(progres.selesai);

  for (const d of hasil.detail) {
    jejak[d.pola] = [...(jejak[d.pola] || []), { soal: d.soalId, waktu: sekarang, benar: Boolean(d.benar) }].slice(-MAKS_JEJAK);
    if (d.benar) {
      benar[d.pola] = unik([...(benar[d.pola] || []), d.soalId]);
      // Hanya ronde bos yang mengeluarkan pola dari bos; benar di tahap tidak.
      if (modeBos) bosses = bosses.filter((b) => b.id !== d.pola);
      continue;
    }
    salah[d.pola] = (salah[d.pola] || 0) + 1;
    if (sudahSelesai) continue; // volume yang selesai tetap selesai: kesalahan hanya dihitung untuk sensei
    bosses = bosses.some((b) => b.id === d.pola)
      ? bosses.map((b) => (b.id === d.pola ? { ...b, salah: b.salah + 1, terakhirSalah: sekarang } : b))
      : [...bosses, { id: d.pola, salah: 1, terakhirSalah: sekarang }];
  }
  bosses = bosses.sort((a, b) => b.salah - a.salah || a.id.localeCompare(b.id));

  const dikuasai = unik([
    ...(progres.dikuasai || []),
    ...Object.keys(benar).filter((id) => benar[id].length >= BENAR_DIKUASAI),
  ]);
  const tahap = progres.tahap || [];
  const tahapSekarang = modeBos ? null : tahap[tahapIndex];
  const tahapLulus = Boolean(tahapSekarang) && tahapSekarang.pola.every((id) => dikuasai.includes(id));
  const tahapTerbuka = tahapLulus
    ? Math.max(Number(progres.tahap_terbuka) || 0, tahapIndex + 1)
    : Number(progres.tahap_terbuka) || 0;
  const bosRonde = (Number(progres.bos_ronde) || 0) + (modeBos ? 1 : 0);
  const selesai = sudahSelesai || (tahap.length > 0 && tahapTerbuka >= tahap.length && bosses.length === 0);

  return {
    ...progres,
    tahap_terbuka: tahapTerbuka,
    benar,
    dikuasai,
    bosses,
    salah,
    jejak,
    bos_ronde: bosRonde,
    selesai,
    perlu_perhatian: bosRonde >= AMBANG_PERHATIAN || Object.values(salah).some((n) => n >= AMBANG_PERHATIAN),
    riwayat: [
      ...(progres.riwayat || []),
      { tahapIndex, ronde: modeBos ? bosRonde : 0, benar: hasil.benar, total: hasil.total, lulus: hasil.lulus, waktu: sekarang },
    ].slice(-MAKS_RIWAYAT),
  };
}

export function ringkasProgres(progres) {
  return {
    tahap_terbuka: Number(progres?.tahap_terbuka) || 0,
    dikuasai: Array.isArray(progres?.dikuasai) ? progres.dikuasai.length : 0,
    bos: daftarBossBunpou(progres).length,
    selesai: Boolean(progres?.selesai),
    perlu_perhatian: Boolean(progres?.perlu_perhatian),
  };
}
