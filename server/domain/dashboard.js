/**
 * Staff dashboard: what JOYdata records, summed up for the active classes —
 *   - today and this week: absensi per class, practice now and today, Kaiwa Card of the running week;
 *   - this month against last month: exams, attendance, sikap, Kaiwa Card (finished weeks), mensetsu, practice of
 *     the last 7 days and the latest Evaluasi Fisik;
 *   - exams over 6 months, per section and per paper; practice per day and type over 14 days;
 *   - the classes side by side, and the peserta who need attention, with every reason at once.
 *
 * Pure module: the repo hands in the state (fase3Repo.loadReportState), the peserta journeys and the practice data.
 * Monthly peserta figures come from the Smart Report journey, so attendance and sikap match the rapor (a month's
 * attendance counts the classes the peserta sat in that month; sikap starts every month from the basis).
 */
import { computeNilaiUjianAvg, getGradeLabel } from './rules.js';
import { BAGIAN_UJIAN } from './smartReport.js';
import { kaiwaRule, kaiwaWeekProgress, kaiwaCardRekap, weekOf, addDays } from './kaiwaMingguan.js';
import { sedangAktif, tanggalWib } from './aktivitasLatihan.js';

export const JUMLAH_BULAN_TREN = 6;
export const HARI_GRAFIK_LATIHAN = 14;
// A peserta is flagged when their last practice is this many days ago or more (or they never practised).
export const HARI_TANPA_LATIHAN = 3;
export const JUMLAH_UJIAN_TERBARU = 6;
export const JUMLAH_SIKAP_TERBARU = 6;

const round1 = (n) => Math.round(n * 10) / 10;
const toDay = (v) => String(v).slice(0, 10);
const toMonth = (v) => String(v).slice(0, 7);
const angka = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));
const mean = (values) => {
  const nums = values.filter((v) => Number.isFinite(v));
  return nums.length ? round1(nums.reduce((a, b) => a + b, 0) / nums.length) : null;
};
const selisih = (a, b) => (a === null || b === null ? null : round1(a - b));
const persen = (bagian, total) => (total > 0 ? round1((bagian / total) * 100) : null);
const hariAntara = (dari, sampai) => Math.round((Date.parse(`${sampai}T00:00:00Z`) - Date.parse(`${dari}T00:00:00Z`)) / 86_400_000);

/** The month before a YYYY-MM month. */
export function bulanSebelumnya(periode) {
  const [y, m] = periode.split('-').map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
}

/** The n months up to and including `periode`, oldest first. */
export function daftarBulan(periode, n) {
  const bulan = [periode];
  while (bulan.length < n) bulan.unshift(bulanSebelumnya(bulan[0]));
  return bulan;
}

function hitungGrade(values, batasGrade) {
  const dist = { A: 0, B: 0, C: 0, D: 0 };
  for (const v of values) dist[getGradeLabel(v, batasGrade)] += 1;
  return dist;
}

// ---------------------------------------------------------------------------------------------------------------
// Practice

/**
 * Practice sessions of the last `hari` days per WIB day and type (active seconds and peserta who practised),
 * today's totals, and how many peserta are practising right now.
 */
export function ringkasAktivitasHarian(sesiList, { hari = HARI_GRAFIK_LATIHAN, now = new Date() } = {}) {
  const hariIni = tanggalWib(now);
  const per = new Map();
  for (let i = hari - 1; i >= 0; i -= 1) {
    const tanggal = addDays(hariIni, -i);
    per.set(tanggal, { tanggal, detik: { flashcard: 0, kanji: 0, dokkai: 0 }, peserta: new Set() });
  }
  const sekarang = new Set();
  for (const s of sesiList) {
    const hariSesi = per.get(tanggalWib(s.mulaiAt));
    if (hariSesi && s.detikAktif > 0) {
      if (hariSesi.detik[s.jenis] !== undefined) hariSesi.detik[s.jenis] += s.detikAktif;
      hariSesi.peserta.add(Number(s.pesertaId));
    }
    if (sedangAktif(s, now)) sekarang.add(Number(s.pesertaId));
  }
  const harian = [...per.values()].map((d) => ({
    tanggal: d.tanggal,
    detik: d.detik,
    total: d.detik.flashcard + d.detik.kanji + d.detik.dokkai,
    peserta: d.peserta.size,
  }));
  const terakhir = harian[harian.length - 1];
  return { harian, hariIni: { peserta: terakhir.peserta, detikAktif: terakhir.total }, sedangLatihan: sekarang.size };
}

// ---------------------------------------------------------------------------------------------------------------
// Exams

/**
 * Exams of every peserta: per month the mean of each peserta's monthly average (everyone weighs the same), how
 * many peserta reached the KKM, the grade spread and the section means; the latest papers (one per date and code).
 */
export function ringkasUjian(ujianRows, { periode, settings, namaKelas = new Map() }) {
  const kkm = settings.kkm_ujian;
  const rows = ujianRows
    .filter((u) => u.tanggalUjian)
    .map((u) => {
      const stored = angka(u.nilaiAvg);
      return {
        pesertaId: Number(u.pesertaId),
        kelasId: u.kelasId == null ? null : Number(u.kelasId),
        tanggal: toDay(u.tanggalUjian),
        kode: u.codeUjian || '',
        rata: stored !== null ? stored : computeNilaiUjianAvg(u),
        bagian: {
          mojiGoi: angka(u.nilaiMojiGoi),
          bunpou: angka(u.nilaiBunpou ?? u.nilaiDokkai),
          choukai: angka(u.nilaiChoukai),
        },
      };
    })
    .filter((r) => r.rata !== null);

  function statBulan(bulan) {
    const isi = rows.filter((r) => toMonth(r.tanggal) === bulan);
    const perPeserta = new Map();
    for (const r of isi) {
      if (!perPeserta.has(r.pesertaId)) perPeserta.set(r.pesertaId, []);
      perPeserta.get(r.pesertaId).push(r.rata);
    }
    const nilai = [...perPeserta.values()].map(mean);
    return {
      bulan,
      rata: mean(nilai),
      peserta: nilai.length,
      lulusKkm: nilai.filter((v) => v >= kkm).length,
      jumlahUjian: new Set(isi.map((r) => `${r.tanggal}|${r.kode}`)).size,
      distribusi: hitungGrade(nilai, settings.batas_grade),
      bagian: Object.fromEntries(BAGIAN_UJIAN.map((b) => [b.key, mean(isi.map((r) => r.bagian[b.key]))])),
    };
  }

  const grup = new Map();
  for (const r of rows) {
    const key = `${r.tanggal}|${r.kode}`;
    if (!grup.has(key)) grup.set(key, { kode: r.kode, tanggal: r.tanggal, rows: [] });
    grup.get(key).rows.push(r);
  }
  const terbaru = [...grup.values()]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || a.kode.localeCompare(b.kode))
    .slice(0, JUMLAH_UJIAN_TERBARU)
    .map((g) => ({
      kode: g.kode,
      tanggal: g.tanggal,
      kelas: [...new Set(g.rows.map((r) => namaKelas.get(r.kelasId)).filter(Boolean))].sort(),
      peserta: new Set(g.rows.map((r) => r.pesertaId)).size,
      rata: mean(g.rows.map((r) => r.rata)),
      persenLulus: persen(g.rows.filter((r) => r.rata >= kkm).length, g.rows.length),
      bagian: Object.fromEntries(BAGIAN_UJIAN.map((b) => [b.key, mean(g.rows.map((r) => r.bagian[b.key]))])),
    }));

  const ini = statBulan(periode);
  const lalu = statBulan(bulanSebelumnya(periode));
  return {
    bulanIni: { ...ini, delta: selisih(ini.rata, lalu.rata), bagianLalu: lalu.bagian },
    tren: daftarBulan(periode, JUMLAH_BULAN_TREN).map((b) => {
      const s = b === periode ? ini : statBulan(b);
      return { bulan: b, rata: s.rata, peserta: s.peserta, jumlahUjian: s.jumlahUjian };
    }),
    terbaru,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// The dashboard

/** A peserta's figures for one month from their journey; a month without records has the sikap basis. */
function metrikBulan(journey, periode, basis) {
  const b = journey.bulanan.find((x) => x.periode === periode);
  return {
    ujian: b?.ujianRata ?? null,
    sikap: b ? b.sikap.skor : basis,
    positif: b?.sikap.positif ?? 0,
    negatif: b?.sikap.negatif ?? 0,
    sesi: b?.absensi.sesi ?? 0,
    hadir: b?.absensi.hadir ?? 0,
    rasio: b?.absensi.rasio ?? null,
  };
}

/** Attendance pooled over peserta (present ÷ sessions), sikap mean and how many are under the KKM. */
function ringkasMetrik(daftar, settings) {
  const sesi = daftar.reduce((n, m) => n + m.sesi, 0);
  const hadir = daftar.reduce((n, m) => n + m.hadir, 0);
  return {
    kehadiran: { rasio: persen(hadir, sesi), sesi, hadir },
    sikap: {
      rata: mean(daftar.map((m) => m.sikap)),
      bawahKkm: daftar.filter((m) => m.sikap < settings.kkm_sikap).length,
      positif: daftar.reduce((n, m) => n + m.positif, 0),
      negatif: daftar.reduce((n, m) => n + m.negatif, 0),
    },
  };
}

/**
 * Everything on the dashboard. Input:
 *   state      — loadReportState(): kelas, peserta, staff, programs, sikapKategori, nilai*, absensi, nilaiFisik
 *   journeys   — Map pesertaId → buildPesertaJourney() for the active peserta
 *   settings   — merged settings; nameMap — mancationAkunId → name; hariIni — today in WIB (YYYY-MM-DD)
 *   latihan    — { statistik: rows of getStatistikLatihan (7 days, with grade), aturanGrade, sesi (last 14 days),
 *                  terakhir: { pesertaId: ISO of the last practice } }; now — the time for "practising now"
 */
export function buildDashboard({ state, journeys, settings, nameMap, hariIni, latihan, now = new Date() }) {
  const periode = toMonth(hariIni);
  const periodeLalu = bulanSebelumnya(periode);
  const basis = settings.sikap_basis;
  const rule = kaiwaRule(settings);

  const kelasAktif = (state.kelas || [])
    .filter((k) => !k.deletedAt && k.status === 'aktif')
    .sort((a, b) => String(a.namaKelas).localeCompare(String(b.namaKelas)));
  const kelasById = new Map((state.kelas || []).map((k) => [Number(k.id), k]));
  const namaKelas = new Map((state.kelas || []).map((k) => [Number(k.id), k.namaKelas]));
  const staffNama = new Map((state.staff || []).map((s) => [Number(s.id), s.nama]));
  const programNama = new Map((state.programs || []).map((p) => [Number(p.id), p]));
  const idKelasAktif = new Set(kelasAktif.map((k) => Number(k.id)));

  const peserta = (state.peserta || [])
    .filter((p) => !p.deletedAt && p.sumber === 'roster' && idKelasAktif.has(Number(p.kelasId)))
    .map((p) => {
      const kelas = kelasById.get(Number(p.kelasId));
      return {
        pesertaId: Number(p.id),
        nama: nameMap.get(Number(p.mancationAkunId)) || `Peserta #${p.mancationAkunId}`,
        kelasId: Number(p.kelasId),
        namaKelas: kelas?.namaKelas || '-',
        mulai: p.tanggalMasuk || kelas?.tanggalStart || null,
      };
    })
    .sort((a, b) => a.nama.localeCompare(b.nama));
  const pesertaById = new Map(peserta.map((p) => [p.pesertaId, p]));
  // An active class nobody sits in (left over from a new class formation) has no absensi to fill and nothing to compare.
  const kelasBerisi = kelasAktif.filter((k) => peserta.some((p) => p.kelasId === Number(k.id)));

  // --- per peserta -------------------------------------------------------------------------------------------
  const minggu = weekOf(hariIni);
  const mingguLalu = weekOf(addDays(minggu.mulai, -7));
  const kaiwaPerPeserta = new Map();
  for (const k of state.nilaiKaiwa || []) {
    if (!k.tanggalKaiwa) continue;
    const pid = Number(k.pesertaId);
    if (!kaiwaPerPeserta.has(pid)) kaiwaPerPeserta.set(pid, []);
    kaiwaPerPeserta.get(pid).push({ tanggal: toDay(k.tanggalKaiwa), senseiId: k.senseiId ?? null });
  }
  const statistikLatihan = new Map((latihan?.statistik || []).map((r) => [Number(r.pesertaId), r]));

  const baris = peserta.map((p) => {
    const journey = journeys.get(p.pesertaId);
    const sesiKaiwa = kaiwaPerPeserta.get(p.pesertaId) || [];
    const berlaku = (w) => (!rule.mulai || rule.mulai <= w.mulai) && (!p.mulai || p.mulai <= w.selesai);
    const dalam = (w) => sesiKaiwa.filter((s) => s.tanggal >= w.mulai && s.tanggal <= w.selesai);
    const lat = statistikLatihan.get(p.pesertaId);
    const terakhirLatihan = latihan?.terakhir?.[p.pesertaId] ? tanggalWib(latihan.terakhir[p.pesertaId]) : null;
    return {
      ...p,
      ini: metrikBulan(journey, periode, basis),
      lalu: metrikBulan(journey, periodeLalu, basis),
      kaiwaIni: berlaku(minggu) ? kaiwaWeekProgress(dalam(minggu), rule) : null,
      kaiwaLalu: berlaku(mingguLalu) ? kaiwaWeekProgress(dalam(mingguLalu), rule) : null,
      // Only finished weeks: the running week would count as missed until Sunday.
      kaiwaBulan: kaiwaCardRekap(sesiKaiwa, { rule, tanggalMasuk: p.mulai, bulan: periode, hariIni: addDays(minggu.mulai, -1) }),
      latihan: lat ? { detikAktif: lat.detikAktif, ...lat.grade } : null,
      terakhirLatihan,
      fisik: journey.fisik.terakhir,
    };
  });

  // --- today ---------------------------------------------------------------------------------------------------
  const absensiHariIni = (state.absensi || []).filter(
    (a) => a.tanggalAbsensi && toDay(a.tanggalAbsensi) === hariIni && idKelasAktif.has(Number(a.kelasId))
  );
  const status = { hadir: 0, sakit: 0, izin: 0, alfa: 0 };
  for (const a of absensiHariIni) if (status[a.status] !== undefined) status[a.status] += 1;
  const aktivitas = ringkasAktivitasHarian(latihan?.sesi || [], { now });
  const dariSenin = hariAntara(minggu.mulai, hariIni);

  const hari = {
    absensi: {
      kelas: kelasBerisi.map((k) => ({
        kelasId: Number(k.id),
        namaKelas: k.namaKelas,
        terisi: absensiHariIni.some((a) => Number(a.kelasId) === Number(k.id)),
      })),
      status,
      tidakHadir: absensiHariIni
        .filter((a) => a.status !== 'hadir')
        .map((a) => {
          const p = pesertaById.get(Number(a.pesertaId));
          return { pesertaId: Number(a.pesertaId), nama: p?.nama || `#${a.pesertaId}`, namaKelas: namaKelas.get(Number(a.kelasId)) || '-', status: a.status };
        })
        .sort((a, b) => a.status.localeCompare(b.status) || a.nama.localeCompare(b.nama)),
    },
    latihan: { sedangLatihan: aktivitas.sedangLatihan, ...aktivitas.hariIni },
    kaiwa: {
      minggu,
      sisaHari: 6 - dariSenin,
      target: rule.target,
      senseiWajib: rule.senseiWajibId ? staffNama.get(rule.senseiWajibId) || null : null,
      dinilai: baris.filter((b) => b.kaiwaIni).length,
      tercapai: baris.filter((b) => b.kaiwaIni?.tercapai).length,
      sudahMulai: baris.filter((b) => b.kaiwaIni?.jumlah > 0).length,
      sesi: baris.reduce((n, b) => n + (b.kaiwaIni?.jumlah || 0), 0),
    },
  };

  // --- this month ----------------------------------------------------------------------------------------------
  const ujian = ringkasUjian(state.nilaiUjian || [], { periode, settings, namaKelas });
  const metrikIni = ringkasMetrik(baris.map((b) => b.ini), settings);
  const metrikLalu = ringkasMetrik(baris.map((b) => b.lalu), settings);
  const kaiwaMinggu = baris.reduce((n, b) => n + b.kaiwaBulan.jumlahMinggu, 0);
  const kaiwaTercapai = baris.reduce((n, b) => n + b.kaiwaBulan.tercapai, 0);
  const dalamBulan = (rows, field) => rows.filter((r) => r[field] && toMonth(r[field]) === periode);
  const mensetsuBulan = dalamBulan(state.nilaiMensetsu || [], 'tanggalMensetsu');
  const mensetsuDist = { A: 0, B: 0, C: 0 };
  for (const m of mensetsuBulan) if (mensetsuDist[m.grade] !== undefined) mensetsuDist[m.grade] += 1;
  const denganLatihan = baris.filter((b) => b.latihan?.grade);
  const denganFisik = baris.filter((b) => b.fisik?.nilaiFisik !== null && b.fisik?.nilaiFisik !== undefined);

  const bulan = {
    ujian: ujian.bulanIni,
    kehadiran: { ...metrikIni.kehadiran, delta: selisih(metrikIni.kehadiran.rasio, metrikLalu.kehadiran.rasio) },
    sikap: { ...metrikIni.sikap, delta: selisih(metrikIni.sikap.rata, metrikLalu.sikap.rata) },
    kaiwaCard: {
      minggu: kaiwaMinggu,
      tercapai: kaiwaTercapai,
      persen: persen(kaiwaTercapai, kaiwaMinggu),
      sesi: dalamBulan(state.nilaiKaiwa || [], 'tanggalKaiwa').length,
    },
    mensetsu: { sesi: mensetsuBulan.length, peserta: new Set(mensetsuBulan.map((m) => Number(m.pesertaId))).size, distribusi: mensetsuDist },
    latihan: {
      menitPerHari: mean(denganLatihan.map((b) => b.latihan.menitPerHari)),
      berlatih: baris.filter((b) => b.latihan?.detikAktif > 0).length,
      grade: Object.fromEntries(['A', 'B', 'C', 'D'].map((g) => [g, denganLatihan.filter((b) => b.latihan.grade === g).length])),
    },
    fisik: {
      dites: denganFisik.length,
      rata: mean(denganFisik.map((b) => b.fisik.nilaiFisik)),
      bawahKkm: denganFisik.filter((b) => b.fisik.lulusKkm === false).length,
    },
  };

  // --- classes side by side ------------------------------------------------------------------------------------
  const perKelas = kelasBerisi.map((k) => {
    const anggota = baris.filter((b) => b.kelasId === Number(k.id));
    const nilaiUjian = anggota.map((b) => b.ini.ujian).filter((v) => v !== null);
    const m = ringkasMetrik(anggota.map((b) => b.ini), settings);
    const lat = anggota.filter((b) => b.latihan?.grade);
    const fis = anggota.filter((b) => b.fisik?.nilaiFisik !== null && b.fisik?.nilaiFisik !== undefined);
    const program = programNama.get(Number(k.programId));
    return {
      kelasId: Number(k.id),
      namaKelas: k.namaKelas,
      senseiNama: staffNama.get(Number(k.senseiId)) || null,
      programNama: program?.namaId || null,
      programNamaJa: program?.namaJa || null,
      peserta: anggota.length,
      ujian: { rata: mean(nilaiUjian), dinilai: nilaiUjian.length, lulusKkm: nilaiUjian.filter((v) => v >= settings.kkm_ujian).length },
      kehadiran: m.kehadiran,
      sikap: { rata: m.sikap.rata, bawahKkm: m.sikap.bawahKkm },
      kaiwaMingguIni: { dinilai: anggota.filter((b) => b.kaiwaIni).length, tercapai: anggota.filter((b) => b.kaiwaIni?.tercapai).length },
      latihan: { menitPerHari: mean(lat.map((b) => b.latihan.menitPerHari)), nilai: mean(lat.map((b) => b.latihan.nilai)) },
      fisik: { rata: mean(fis.map((b) => b.fisik.nilaiFisik)), dites: fis.length },
    };
  });

  // --- peserta who need attention ------------------------------------------------------------------------------
  const adaLatihan = Boolean(latihan);
  const perhatian = baris
    .map((b) => {
      const alasan = [];
      if (b.ini.ujian !== null && b.ini.ujian < settings.kkm_ujian) alasan.push({ jenis: 'ujian', nilai: b.ini.ujian });
      if (b.ini.rasio !== null && b.ini.rasio < settings.ambang_kehadiran_rendah) alasan.push({ jenis: 'kehadiran', nilai: b.ini.rasio });
      if (b.ini.sikap < settings.kkm_sikap) alasan.push({ jenis: 'sikap', nilai: b.ini.sikap });
      if (b.kaiwaLalu && !b.kaiwaLalu.tercapai) {
        alasan.push({ jenis: 'kaiwa', jumlah: b.kaiwaLalu.jumlah, target: b.kaiwaLalu.target, wajibTerpenuhi: b.kaiwaLalu.wajibTerpenuhi });
      }
      if (adaLatihan) {
        const sejak = b.terakhirLatihan ? hariAntara(b.terakhirLatihan, hariIni) : null;
        if (sejak === null || sejak >= HARI_TANPA_LATIHAN) alasan.push({ jenis: 'latihan', terakhir: b.terakhirLatihan, hari: sejak });
      }
      if (b.fisik?.lulusKkm === false) alasan.push({ jenis: 'fisik', nilai: b.fisik.nilaiFisik });
      return { pesertaId: b.pesertaId, nama: b.nama, namaKelas: b.namaKelas, alasan };
    })
    .filter((r) => r.alasan.length)
    .sort((a, b) => b.alasan.length - a.alasan.length || a.nama.localeCompare(b.nama));

  // --- latest sikap notes --------------------------------------------------------------------------------------
  const kategori = new Map((state.sikapKategori || []).map((k) => [Number(k.id), k]));
  const sikapTerbaru = (state.nilaiSikap || [])
    .filter((s) => s.tanggalPenilaian && pesertaById.has(Number(s.pesertaId)))
    .sort((a, b) => toDay(b.tanggalPenilaian).localeCompare(toDay(a.tanggalPenilaian)) || Number(b.id) - Number(a.id))
    .slice(0, JUMLAH_SIKAP_TERBARU)
    .map((s) => {
      const p = pesertaById.get(Number(s.pesertaId));
      const kat = kategori.get(Number(s.kategoriId));
      return {
        id: Number(s.id),
        tanggal: toDay(s.tanggalPenilaian),
        pesertaId: p.pesertaId,
        nama: p.nama,
        namaKelas: p.namaKelas,
        kategoriNamaId: kat?.namaId || 'Lainnya',
        kategoriNamaJa: kat?.namaJa || 'その他',
        sentiment: s.sentiment,
        bobot: Math.abs(Number(s.bobot) || 0),
        keterangan: s.description || '',
      };
    });

  return {
    hariIni,
    periode,
    periodeLalu,
    pesertaAktif: peserta.length,
    hari,
    bulan,
    trenUjian: ujian.tren,
    ujianTerbaru: ujian.terbaru,
    // Days before the first practice was ever logged would read as days nobody practised.
    latihanHarian: aktivitas.harian.filter(
      (h, i, all) => !latihan?.aturanGrade?.mulaiData || h.tanggal >= latihan.aturanGrade.mulaiData || i === all.length - 1
    ),
    perKelas,
    perhatian,
    sikapTerbaru,
    aturan: {
      kkmUjian: settings.kkm_ujian,
      kkmSikap: settings.kkm_sikap,
      ambangKehadiran: settings.ambang_kehadiran_rendah,
      batasGrade: settings.batas_grade,
      hariTanpaLatihan: HARI_TANPA_LATIHAN,
      gradeLatihan: latihan?.aturanGrade || null,
    },
  };
}
