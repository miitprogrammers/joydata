import { DEFAULT_SETTINGS, loadReportState, getStudentNameMap } from './fase3Repo.js';
import { getStatistikLatihan, getAktivitasLatihanDashboard } from './latihanRepo.js';
import { buildPesertaJourney } from '../domain/smartReport.js';
import { buildDashboard, HARI_GRAFIK_LATIHAN } from '../domain/dashboard.js';
import { todayJakarta } from '../domain/kaiwaMingguan.js';

/**
 * The staff dashboard (domain/dashboard.js): every record loaded once, the journeys of the peserta in active
 * classes, and the practice of the last 7 / 14 days. Practice data that fails to load leaves its parts out
 * instead of failing the whole page.
 */
export async function getDashboardData() {
  const [state, statistik, aktivitas] = await Promise.all([
    loadReportState(),
    getStatistikLatihan({ periode: '7' }).catch(() => null),
    getAktivitasLatihanDashboard({ hari: HARI_GRAFIK_LATIHAN }).catch(() => null),
  ]);
  const settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };

  const kelasAktif = new Set((state.kelas || []).filter((k) => !k.deletedAt && k.status === 'aktif').map((k) => Number(k.id)));
  const kategori = new Map((state.sikapKategori || []).map((k) => [k.id, k]));
  const sikapRows = (state.nilaiSikap || []).map((s) => ({
    ...s,
    kategoriNamaId: kategori.get(s.kategoriId)?.namaId,
    kategoriNamaJa: kategori.get(s.kategoriId)?.namaJa,
  }));
  const journeys = new Map(
    (state.peserta || [])
      .filter((p) => !p.deletedAt && p.sumber === 'roster' && kelasAktif.has(Number(p.kelasId)))
      .map((p) => [
        Number(p.id),
        buildPesertaJourney({
          pesertaId: p.id,
          kelasId: p.kelasId,
          ujianRows: state.nilaiUjian || [],
          kaiwaRows: state.nilaiKaiwa || [],
          mensetsuRows: state.nilaiMensetsu || [],
          sikapRows,
          absensiRows: state.absensi || [],
          fisikRows: state.nilaiFisik || [],
          settings,
        }),
      ])
  );

  return buildDashboard({
    state,
    journeys,
    settings,
    nameMap: getStudentNameMap(state),
    hariIni: todayJakarta(),
    latihan:
      statistik && aktivitas
        ? { statistik: statistik.items, aturanGrade: statistik.aturanGrade, sesi: aktivitas.sesi, terakhir: aktivitas.terakhir }
        : null,
  });
}
