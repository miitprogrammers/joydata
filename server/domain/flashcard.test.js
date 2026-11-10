import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VOLUME_FLASHCARD,
  MAKS_MS_KARTU,
  kartuVolume,
  judulVolumeFlashcard,
  lengkapiAcak,
  urutanKartu,
  bersihkanWaktu,
  ringkasProgres,
} from './flashcard.js';
import {
  DETIK_AKTIF,
  sedangAktif,
  terapkanDetak,
  statusSesi,
  awalPeriode,
  rentangPeriode,
  statistikLatihan,
} from './aktivitasLatihan.js';

function rngDari(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test('Flashcard volumes: N5 Dasar and Vol 1-5, N4 Vol 1-5, with readings and meanings on the back', () => {
  assert.deepEqual(VOLUME_FLASHCARD, ['DASAR', 'VOL1', 'VOL2', 'VOL3', 'VOL4', 'VOL5', 'N4VOL1', 'N4VOL2', 'N4VOL3', 'N4VOL4', 'N4VOL5']);
  assert.equal(kartuVolume('DASAR').length, 80);
  assert.equal(kartuVolume('N4VOL5').length, 56);
  assert.equal(kartuVolume('SEMUA'), null);
  assert.equal(kartuVolume('VOL9'), null);
  const dasar = kartuVolume('DASAR').find((k) => k.kanji === '一');
  assert.deepEqual([dasar.on[0], dasar.kun[0], dasar.arti], ['イチ', 'ひと(つ)', 'Satu']);
  const asu = kartuVolume('N4VOL1').find((k) => k.kanji === '明日');
  assert.equal(asu.bacaan, 'あす');
  assert.deepEqual(asu.bacaanLain, ['あした']);
  assert.equal(judulVolumeFlashcard('N4VOL3'), 'N4 · Volume 3');
  assert.equal(judulVolumeFlashcard('DASAR'), 'N5 · Dasar (80 kanji)');
});

test('The first random order is kept; cards new to the bank join at the end, removed ones drop out', () => {
  const ids = ['a', 'b', 'c', 'd', 'e'];
  const acak = lengkapiAcak(null, ids, rngDari(1));
  assert.deepEqual([...acak].sort(), ids);
  assert.notDeepEqual(acak, ids);
  assert.deepEqual(lengkapiAcak(acak, ids, rngDari(2)), acak);
  const lebih = lengkapiAcak(acak, [...ids, 'f'], rngDari(3));
  assert.deepEqual(lebih.slice(0, 5), acak);
  assert.equal(lebih[5], 'f');
  assert.deepEqual(lengkapiAcak(['c', 'x', 'c', 'a'], ['a', 'c']), ['c', 'a']);
});

test('Order: never shown first, then the longest display time first; equal times keep the random order', () => {
  // The example agreed with the user: A 3 s, B 12 s, C 1 s, D 8 s, E 5 s → B D E A C.
  const acak = ['A', 'B', 'C', 'D', 'E'];
  assert.deepEqual(urutanKartu(acak, { A: 3000, B: 12000, C: 1000, D: 8000, E: 5000 }), ['B', 'D', 'E', 'A', 'C']);
  // A deck left halfway: the cards not shown yet come first, in their random order.
  assert.deepEqual(urutanKartu(acak, { A: 3000, D: 8000 }), ['B', 'C', 'E', 'D', 'A']);
  assert.deepEqual(urutanKartu(acak, { A: 2000, B: 2000, C: 2000, D: 2000, E: 2000 }), acak);
  assert.deepEqual(urutanKartu(acak, {}), acak);
});

test('Display times from the app: only cards of the volume, capped at one minute, whole milliseconds', () => {
  const ids = ['VOL1:海', 'VOL1:秋'];
  assert.deepEqual(bersihkanWaktu({ 'VOL1:海': 1234.6, 'VOL1:秋': 999999, 'VOL2:箱': 5, x: 'a' }, ids), {
    'VOL1:海': 1235,
    'VOL1:秋': MAKS_MS_KARTU,
  });
  assert.deepEqual(bersihkanWaktu({ 'VOL1:海': -1 }, ids), {});
  assert.deepEqual(bersihkanWaktu(null, ids), {});
  assert.deepEqual(ringkasProgres(ids, { 'VOL1:海': 0 }), { total: 2, dilihat: 1 });
});

const sesi = (ubah = {}) => ({
  id: 1,
  pesertaId: 7,
  jenis: 'kanji',
  mode: 'latihan',
  jumlahItem: 20,
  itemSelesai: 3,
  posisi: 4,
  detikAktif: 50,
  skor: null,
  mulaiAt: '2026-11-10T03:00:00.000Z',
  terakhirAt: '2026-11-10T03:01:00.000Z',
  selesaiAt: null,
  ...ubah,
});

test('Signals only move forward, never beyond the time since the start or the questions of the paper', () => {
  const now = new Date('2026-11-10T03:02:00.000Z'); // 120 s after the start
  assert.deepEqual(terapkanDetak(sesi(), { detikAktif: 90, itemSelesai: 5, posisi: 6 }, now), {
    detikAktif: 90,
    itemSelesai: 5,
    posisi: 6,
    terakhirAt: now.toISOString(),
  });
  const curang = terapkanDetak(sesi(), { detikAktif: 9999, itemSelesai: 99, posisi: 99 }, now);
  assert.deepEqual([curang.detikAktif, curang.itemSelesai, curang.posisi], [125, 20, 20]);
  const mundur = terapkanDetak(sesi(), { detikAktif: 10, itemSelesai: 1 }, now);
  assert.deepEqual([mundur.detikAktif, mundur.itemSelesai, mundur.posisi], [50, 3, 4]);
  // Flashcard swipes may go round the deck: at most four per second.
  const kartu = terapkanDetak(sesi({ jenis: 'flashcard', jumlahItem: 84 }), { itemSelesai: 300 }, now);
  assert.equal(kartu.itemSelesai, 300);
  assert.equal(terapkanDetak(sesi({ jenis: 'flashcard' }), { itemSelesai: 5000 }, now).itemSelesai, 500);
});

test('Running = a signal in the last minute; a paper left before the end is "berhenti"', () => {
  const now = new Date('2026-11-10T03:01:30.000Z');
  assert.equal(DETIK_AKTIF, 60);
  assert.equal(sedangAktif(sesi(), now), true);
  assert.equal(statusSesi(sesi(), now), 'berjalan');
  assert.equal(sedangAktif(sesi(), new Date('2026-11-10T03:02:01.000Z')), false);
  assert.equal(statusSesi(sesi({ selesaiAt: now.toISOString() }), now), 'berhenti');
  assert.equal(statusSesi(sesi({ selesaiAt: now.toISOString(), skor: 80 }), now), 'selesai');
  assert.equal(statusSesi(sesi({ jenis: 'flashcard', terakhirAt: '2026-11-10T02:00:00.000Z' }), now), 'selesai');
});

test('Periods start at 00:00 WIB', () => {
  // 10 Nov 2026 08:00 WIB → the last 7 days start 4 Nov 00:00 WIB = 3 Nov 17:00 UTC.
  assert.equal(awalPeriode(7, new Date('2026-11-10T01:00:00.000Z')), '2026-11-03T17:00:00.000Z');
  // 23:30 UTC on 9 Nov is already 10 Nov in WIB.
  assert.equal(awalPeriode(1, new Date('2026-11-09T23:30:00.000Z')), '2026-11-09T17:00:00.000Z');
  assert.equal(awalPeriode(null), null);
});

test('One-day period: one whole WIB day, today when the date is missing, invalid or in the future', () => {
  const now = new Date('2026-11-10T01:00:00.000Z'); // 10 Nov 08:00 WIB
  const hari = (tanggal) => rentangPeriode({ periode: '1', tanggal }, now);
  assert.deepEqual(hari('2026-11-08'), {
    periode: '1',
    tanggal: '2026-11-08',
    dari: '2026-11-07T17:00:00.000Z',
    sampai: '2026-11-08T17:00:00.000Z',
  });
  for (const salah of [undefined, '', '2026-11-11', '2026-02-30', '10-11-2026', 'x']) assert.equal(hari(salah).tanggal, '2026-11-10');
  assert.deepEqual(rentangPeriode({ periode: '30' }, now), { periode: '30', tanggal: null, dari: awalPeriode(30, now), sampai: null });
  assert.equal(rentangPeriode({ periode: '99' }, now).periode, '7');

  // Only sessions started inside the day count; the roster is still listed.
  const sesi = (pesertaId, mulaiAt, detikAktif) => ({ pesertaId, jenis: 'kanji', mode: 'latihan', mulaiAt, terakhirAt: mulaiAt, detikAktif, itemSelesai: 1, skor: null });
  const { dari, sampai } = hari('2026-11-08');
  const rows = statistikLatihan(
    [sesi(1, '2026-11-07T16:59:59.000Z', 900), sesi(1, '2026-11-07T17:00:00.000Z', 60), sesi(2, '2026-11-08T16:59:00.000Z', 120), sesi(2, '2026-11-08T17:00:00.000Z', 999)],
    [1, 2, 3],
    { dari, sampai }
  );
  assert.deepEqual(rows.map((r) => [r.pesertaId, r.detikAktif, r.jumlahSesi]), [[2, 120, 1], [1, 60, 1], [3, 0, 0]]);
});

test('Most diligent first: active time, then days with practice; everyone on the roster is listed', () => {
  const rows = statistikLatihan(
    [
      sesi({ pesertaId: 1, jenis: 'flashcard', detikAktif: 600, itemSelesai: 120 }),
      sesi({ pesertaId: 2, detikAktif: 300, itemSelesai: 20, skor: 80, selesaiAt: 'x' }),
      sesi({ pesertaId: 2, jenis: 'dokkai', detikAktif: 300, itemSelesai: 10, skor: 60, mulaiAt: '2026-11-08T03:00:00.000Z' }),
      sesi({ pesertaId: 3, mode: 'resmi', detikAktif: 100, itemSelesai: 20, skor: 90, mulaiAt: '2026-11-01T03:00:00.000Z' }),
    ],
    [1, 2, 3, 4],
    { dari: '2026-11-03T17:00:00.000Z' }
  );
  assert.deepEqual(rows.map((r) => r.pesertaId), [2, 1, 3, 4]); // 2 and 1 both 600 s; 2 practised on two days
  assert.deepEqual(
    [rows[0].detikAktif, rows[0].hariAktif, rows[0].soal, rows[0].rataSkorLatihan, rows[0].perJenis],
    [600, 2, 30, 70, { flashcard: 0, kanji: 300, dokkai: 300 }]
  );
  assert.equal(rows[1].kartu, 120);
  // Peserta 3 only practised before the period; peserta 4 never did.
  assert.deepEqual([rows[2].jumlahSesi, rows[3].jumlahSesi, rows[3].rataSkorLatihan], [0, 0, null]);
});
