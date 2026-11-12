import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detikLaporan, totalSetelahLaporan, MAKS_DETIK_PER_LAPORAN, DETIK_SEHARI } from './pemakaianPortal.js';

test('detikLaporan: bilangan bulat 0..maks, selain itu 0', () => {
  assert.equal(detikLaporan(45), 45);
  assert.equal(detikLaporan(45.9), 45);
  assert.equal(detikLaporan(10_000), MAKS_DETIK_PER_LAPORAN);
  for (const v of [0, -5, 'abc', null, undefined, NaN, Infinity]) assert.equal(detikLaporan(v), 0);
});

test('totalSetelahLaporan: menambah, tidak melewati sehari', () => {
  assert.equal(totalSetelahLaporan(100, 60), 160);
  assert.equal(totalSetelahLaporan(null, 60), 60);
  assert.equal(totalSetelahLaporan(DETIK_SEHARI - 10, 60), DETIK_SEHARI);
  assert.equal(totalSetelahLaporan(500, -60), 500);
});
