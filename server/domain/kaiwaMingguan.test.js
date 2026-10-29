import test from 'node:test';
import assert from 'node:assert/strict';
import {
  todayJakarta,
  weekOf,
  kaiwaRule,
  normalizeKaiwaRuleSettings,
  kaiwaWeekProgress,
  kaiwaWeeklyHistory,
} from './kaiwaMingguan.js';

test('Kaiwa Card weeks run Monday to Sunday in Jakarta time', () => {
  assert.deepEqual(weekOf('2026-10-29'), { mulai: '2026-10-26', selesai: '2026-11-01' });
  assert.deepEqual(weekOf('2026-10-26'), { mulai: '2026-10-26', selesai: '2026-11-01' });
  assert.deepEqual(weekOf('2026-11-01'), { mulai: '2026-10-26', selesai: '2026-11-01' });
  assert.deepEqual(weekOf('2027-01-01'), { mulai: '2026-12-28', selesai: '2027-01-03' });
  // 18:30 UTC on Sunday is already Monday 01:30 in Jakarta.
  assert.equal(todayJakarta(new Date('2026-11-01T18:30:00Z')), '2026-11-02');
});

test('Kaiwa Card rule: settings fall back to 4 sessions, no required sensei and every week', () => {
  assert.deepEqual(kaiwaRule({}), { target: 4, senseiWajibId: null, mulai: null });
  assert.deepEqual(kaiwaRule({ kaiwa_target_mingguan: 5, kaiwa_sensei_wajib_id: 4, kaiwa_berlaku_mulai: '2026-10-29' }), {
    target: 5,
    senseiWajibId: 4,
    mulai: '2026-10-26',
  });
  assert.deepEqual(normalizeKaiwaRuleSettings({ kaiwa_target_mingguan: '4', kaiwa_sensei_wajib_id: '' }).normalized, {
    kaiwa_target_mingguan: 4,
    kaiwa_sensei_wajib_id: null,
    kaiwa_berlaku_mulai: null,
  });
  assert.equal(normalizeKaiwaRuleSettings({ kaiwa_target_mingguan: 4, kaiwa_berlaku_mulai: '26-10-2026' }).code, 'VALIDATION_ERROR');
  assert.equal(normalizeKaiwaRuleSettings({ kaiwa_target_mingguan: 0 }).code, 'INVALID_KAIWA_TARGET');
  assert.equal(normalizeKaiwaRuleSettings({ kaiwa_target_mingguan: 4, kaiwa_sensei_wajib_id: -1 }).code, 'VALIDATION_ERROR');
});

test('Kaiwa Card progress needs the session count and one session with the required sensei', () => {
  const rule = { target: 4, senseiWajibId: 4 };
  const withOthers = [{ senseiId: 2 }, { senseiId: 3 }, { senseiId: 2 }, { senseiId: 3 }];
  assert.deepEqual(kaiwaWeekProgress(withOthers, rule), {
    jumlah: 4, target: 4, kurang: 0, denganWajib: 0, wajibTerpenuhi: false, tercapai: false,
  });
  assert.equal(kaiwaWeekProgress([...withOthers.slice(0, 3), { senseiId: 4 }], rule).tercapai, true);
  assert.equal(kaiwaWeekProgress([{ senseiId: 4 }, { senseiId: 2 }], rule).kurang, 2);
  // A session whose sensei is not filled in yet still counts toward the number of sessions.
  assert.equal(kaiwaWeekProgress([{ senseiId: null }, { senseiId: 4 }, { senseiId: 2 }, { senseiId: 3 }], rule).tercapai, true);
  assert.equal(kaiwaWeekProgress(withOthers, { target: 4, senseiWajibId: null }).tercapai, true);
});

test('Kaiwa Card history lists every week from joining to now, empty weeks included', () => {
  const history = kaiwaWeeklyHistory(
    [
      { tanggal: '2026-10-27', senseiId: 4 },
      { tanggal: '2026-10-28', senseiId: 2 },
      { tanggal: '2026-10-14', senseiId: 2 },
    ],
    { dari: '2026-10-13', sampai: '2026-10-29', target: 2, senseiWajibId: 4 }
  );
  assert.deepEqual(
    history.map((w) => [w.mulai, w.jumlah, w.tercapai]),
    [
      ['2026-10-26', 2, true],
      ['2026-10-19', 0, false],
      ['2026-10-12', 1, false],
    ]
  );
});
