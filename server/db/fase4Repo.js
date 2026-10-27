import webpush from 'web-push';
import { readLocalState, saveLocalState, ensureInitialized, getMode, getPool } from './engine.js';
import {
  validatePushSubscription,
  isPushDuplicate,
  createPushNotificationPayload,
  identifyClassesNeedingAbsensiReminder,
} from '../domain/rules.js';

let vapidConfigured = false;
let vapidPublicKey = '';

const isPostgres = () => getMode() === 'postgres';

// Generated VAPID keys (when the env vars are absent) are kept in settings under this key.
export const VAPID_SETTINGS_KEY = 'vapidKeys';

async function readStoredVapidKeys() {
  if (!isPostgres()) return readLocalState().settings?.[VAPID_SETTINGS_KEY] || null;
  const res = await getPool().query('SELECT value FROM settings WHERE key = $1', [VAPID_SETTINGS_KEY]);
  return res.rows[0]?.value || null;
}

async function writeStoredVapidKeys(keys) {
  if (!isPostgres()) {
    const state = readLocalState();
    state.settings = { ...(state.settings || {}), [VAPID_SETTINGS_KEY]: keys };
    saveLocalState();
    return;
  }
  await getPool().query(
    `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [VAPID_SETTINGS_KEY, JSON.stringify(keys)]
  );
}

async function ensureVapidDetails() {
  if (vapidConfigured) return;
  await ensureInitialized();

  let publicKey = process.env.VAPID_PUBLIC_KEY;
  let privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    const stored = await readStoredVapidKeys();
    if (stored?.publicKey && stored?.privateKey) {
      publicKey = stored.publicKey;
      privateKey = stored.privateKey;
    } else {
      const generated = webpush.generateVAPIDKeys();
      publicKey = generated.publicKey;
      privateKey = generated.privateKey;
      await writeStoredVapidKeys({ publicKey, privateKey });
    }
  }

  vapidPublicKey = publicKey;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@lpk-mizuno.id';
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    vapidConfigured = true;
  } catch (err) {
    console.warn('VAPID setup warning:', err.message);
  }
}

export async function getVapidPublicKey() {
  await ensureVapidDetails();
  return vapidPublicKey;
}

export async function getPushSubscriptionStatus(staffId) {
  await ensureVapidDetails();
  let count;
  if (isPostgres()) {
    const res = await getPool().query(
      'SELECT COUNT(*)::int AS n FROM push_subscription WHERE staff_id = $1 AND aktif',
      [Number(staffId)]
    );
    count = res.rows[0].n;
  } else {
    count = (readLocalState().pushSubscriptions || []).filter((s) => Number(s.staffId) === Number(staffId)).length;
  }
  return {
    subscribed: count > 0,
    count,
    vapidPublicKey,
  };
}

export async function savePushSubscriptionRecord(staffId, payload) {
  await ensureVapidDetails();
  const validation = validatePushSubscription(payload);
  if (!validation.ok) {
    throw new Error(validation.code);
  }
  const subData = validation.subscription;

  if (isPostgres()) {
    const res = await getPool().query(
      `INSERT INTO push_subscription (staff_id, endpoint, p256dh, auth, user_agent, aktif)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       ON CONFLICT (endpoint) DO UPDATE SET
         staff_id = EXCLUDED.staff_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth,
         user_agent = EXCLUDED.user_agent, aktif = TRUE
       RETURNING id`,
      [Number(staffId), subData.endpoint, subData.keys.p256dh, subData.keys.auth, subData.userAgent]
    );
    return { ok: true, id: res.rows[0].id, subscribed: true };
  }

  const state = readLocalState();
  state.pushSubscriptions = state.pushSubscriptions || [];
  state.seq = state.seq || {};
  state.seq.pushSubscription = state.seq.pushSubscription || 1;

  const now = new Date().toISOString();
  const existingIdx = state.pushSubscriptions.findIndex(
    (s) => s.endpoint === subData.endpoint
  );

  let recordId;
  if (existingIdx >= 0) {
    state.pushSubscriptions[existingIdx] = {
      ...state.pushSubscriptions[existingIdx],
      staffId: Number(staffId),
      keys: subData.keys,
      userAgent: subData.userAgent,
      updatedAt: now,
    };
    recordId = state.pushSubscriptions[existingIdx].id;
  } else {
    recordId = state.seq.pushSubscription++;
    state.pushSubscriptions.push({
      id: recordId,
      staffId: Number(staffId),
      endpoint: subData.endpoint,
      keys: subData.keys,
      userAgent: subData.userAgent,
      createdAt: now,
      updatedAt: now,
    });
  }

  saveLocalState();
  return { ok: true, id: recordId, subscribed: true };
}

export async function removePushSubscriptionRecord(staffId, endpoint = null) {
  await ensureInitialized();
  if (isPostgres()) {
    const res = endpoint
      ? await getPool().query('DELETE FROM push_subscription WHERE endpoint = $1', [endpoint])
      : await getPool().query('DELETE FROM push_subscription WHERE staff_id = $1', [Number(staffId)]);
    return { ok: true, removedCount: res.rowCount };
  }

  const state = readLocalState();
  state.pushSubscriptions = state.pushSubscriptions || [];
  const initialLen = state.pushSubscriptions.length;

  if (endpoint) {
    state.pushSubscriptions = state.pushSubscriptions.filter(
      (s) => s.endpoint !== endpoint
    );
  } else {
    state.pushSubscriptions = state.pushSubscriptions.filter(
      (s) => Number(s.staffId) !== Number(staffId)
    );
  }

  const removed = initialLen - state.pushSubscriptions.length;
  saveLocalState();
  return { ok: true, removedCount: removed };
}

// Storage used by kirimPush: push_subscription/push_log tables, or the local store collections.
function localPushStore() {
  const state = readLocalState();
  state.pushSubscriptions = state.pushSubscriptions || [];
  state.pushLogs = state.pushLogs || [];
  state.seq = state.seq || {};
  state.seq.pushLog = state.seq.pushLog || 1;
  return {
    async isDuplicate(key) {
      return isPushDuplicate(state.pushLogs, key);
    },
    async subscriptionsOf(staffId) {
      return state.pushSubscriptions.filter((s) => Number(s.staffId) === staffId);
    },
    async removeSubscription(endpoint) {
      state.pushSubscriptions = state.pushSubscriptions.filter((s) => s.endpoint !== endpoint);
    },
    async addLog(entry) {
      const log = { id: state.seq.pushLog++, ...entry };
      state.pushLogs.push(log);
      return log;
    },
    async flush() {
      saveLocalState();
    },
  };
}

function pgPushStore() {
  const pool = getPool();
  return {
    async isDuplicate({ jenis, tanggal, staffId }) {
      const res = await pool.query(
        `SELECT 1 FROM push_log WHERE tipe_jadwal = $1 AND tanggal = $2 AND detail->>'staffId' = $3 LIMIT 1`,
        [jenis, tanggal, String(staffId)]
      );
      return res.rows.length > 0;
    },
    async subscriptionsOf(staffId) {
      const res = await pool.query(
        'SELECT endpoint, p256dh, auth FROM push_subscription WHERE staff_id = $1 AND aktif',
        [staffId]
      );
      return res.rows.map((r) => ({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }));
    },
    async removeSubscription(endpoint) {
      await pool.query('DELETE FROM push_subscription WHERE endpoint = $1', [endpoint]);
    },
    async addLog(entry, deliveredCount) {
      const { jenis, tanggal, staffId, status, endpointCount, payload } = entry;
      const res = await pool.query(
        `INSERT INTO push_log (tipe_jadwal, tanggal, jumlah_terkirim, detail) VALUES ($1, $2, $3, $4) RETURNING id`,
        [jenis, tanggal, deliveredCount, JSON.stringify({ staffId, status, endpointCount, payload })]
      );
      return { id: res.rows[0].id, ...entry };
    },
    async flush() {},
  };
}

/**
 * Dispatches web push notification to target staff members (§14.8 mainIdea.md).
 * Automatically cleans up expired/gone (410, 404) subscriptions.
 * Enforces UNIQUE(jenis, tanggal, staffId) deduplication.
 */
export async function kirimPush({ jenis, tanggal, staffIds = [], payload, force = false }) {
  await ensureVapidDetails();
  const store = isPostgres() ? pgPushStore() : localPushStore();

  const results = {
    sentCount: 0,
    skippedDuplicateCount: 0,
    noSubCount: 0,
    cleanedStaleSubs: 0,
    logs: [],
  };

  const targetDate = tanggal || new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();

  for (const sId of staffIds) {
    const staffIdNum = Number(sId);

    // Idempotency check: don't send duplicate of the same notification type to the same staff on the same date
    if (!force && (await store.isDuplicate({ jenis, tanggal: targetDate, staffId: staffIdNum }))) {
      results.skippedDuplicateCount++;
      continue;
    }

    const userSubs = await store.subscriptionsOf(staffIdNum);

    if (userSubs.length === 0) {
      results.noSubCount++;
      const logEntry = await store.addLog(
        {
          jenis,
          tanggal: targetDate,
          staffId: staffIdNum,
          status: 'no_subscription',
          endpointCount: 0,
          payload,
          sentAt: now,
        },
        0
      );
      results.logs.push(logEntry);
      continue;
    }

    let deliveredCount = 0;
    for (const sub of userSubs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          JSON.stringify(payload)
        );
        deliveredCount++;
      } catch (err) {
        console.warn(`Web push error for staff ${staffIdNum}:`, err.statusCode || err.message);
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Remove stale subscription
          await store.removeSubscription(sub.endpoint);
          results.cleanedStaleSubs++;
        }
      }
    }

    const logEntry = await store.addLog(
      {
        jenis,
        tanggal: targetDate,
        staffId: staffIdNum,
        status: deliveredCount > 0 ? 'sent' : 'failed',
        endpointCount: userSubs.length,
        payload,
        sentAt: now,
      },
      deliveredCount
    );
    results.logs.push(logEntry);
    if (deliveredCount > 0) results.sentCount++;
  }

  await store.flush();
  return results;
}

export async function listPushLogs(limit = 50) {
  await ensureInitialized();
  if (isPostgres()) {
    const res = await getPool().query(
      `SELECT l.id, l.tipe_jadwal AS "jenis", l.tanggal::text AS "tanggal",
              (l.detail->>'staffId')::int AS "staffId", l.detail->>'status' AS "status",
              (l.detail->>'endpointCount')::int AS "endpointCount", l.detail->'payload' AS "payload",
              l.created_at AS "sentAt", s.nama AS "staffNama"
       FROM push_log l
       LEFT JOIN staff s ON s.id = (l.detail->>'staffId')::int
       ORDER BY l.id DESC
       LIMIT $1`,
      [limit]
    );
    return res.rows.map((l) => ({ ...l, staffNama: l.staffNama || `Staff #${l.staffId}` }));
  }

  const state = readLocalState();
  const logs = [...(state.pushLogs || [])].reverse().slice(0, limit);
  const staffMap = new Map((state.staff || []).map((s) => [Number(s.id), s.nama]));

  return logs.map((l) => ({
    ...l,
    staffNama: staffMap.get(Number(l.staffId)) || `Staff #${l.staffId}`,
  }));
}

async function loadReminderData(targetDate) {
  if (!isPostgres()) {
    const state = readLocalState();
    return {
      kelas: (state.kelas || []).map((k) => ({ ...k, senseiPengajar: k.senseiId ?? null })),
      absensi: state.absensi || [],
      staff: state.staff || [],
      hariLibur: state.hariLibur || [],
    };
  }
  const pool = getPool();
  const [kelasRes, absensiRes, staffRes] = await Promise.all([
    pool.query(
      `SELECT id, nama_kelas AS "namaKelas", mancation_class_id AS "mancationClassId", status, deleted_at AS "deletedAt",
              sensei_id AS "senseiPengajar"
       FROM kelas`
    ),
    pool.query(
      `SELECT kelas_id AS "kelasId", tanggal::text AS "tanggalAbsensi" FROM absensi WHERE tanggal = $1`,
      [targetDate]
    ),
    pool.query(`SELECT id, role_id AS "roleId", active, deleted_at AS "deletedAt" FROM staff`),
  ]);
  return { kelas: kelasRes.rows, absensi: absensiRes.rows, staff: staffRes.rows, hariLibur: [] };
}

const REMINDER_SLOTS = ['pagi', 'sore', 'manual'];

/**
 * Daily cron runner for absensi reminder (§14.8 & §14.5 mainIdea.md).
 * Triggered at 08:00 (pagi) and 16:00 (sore follow-up) WIB via Vercel Cron; deduplicated per slot,
 * so the follow-up still goes out when the morning reminder was not acted on.
 */
export async function runPengingatAbsensiCron(customDate = null, slot = 'pagi') {
  await ensureInitialized();
  const slotKey = REMINDER_SLOTS.includes(slot) ? slot : 'pagi';
  // Get date in Asia/Jakarta timezone
  const todayWIB =
    customDate ||
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const data = await loadReminderData(todayWIB);

  const check = identifyClassesNeedingAbsensiReminder({
    classes: data.kelas,
    absensiRecords: data.absensi,
    targetDate: todayWIB,
    hariLiburList: data.hariLibur,
  });

  if (!check.isWorkDay) {
    return {
      ok: true,
      targetDate: todayWIB,
      executed: false,
      reason: check.reason,
      message:
        check.reason === 'WEEKEND'
          ? 'Hari libur akhir pekan, pengingat absensi dilewati.'
          : 'Hari libur nasional/lembaga, pengingat absensi dilewati.',
      classesNeedingReminder: [],
    };
  }

  const senseiStaff = data.staff.filter(
    (s) => s.active && !s.deletedAt && (s.roleId === 3 || s.roleId === 1) // sensei & admin
  );

  // The class's own sensei is reminded; classes without one fall back to every sensei & admin.
  // Each staff member gets one notification per slot listing all of their classes still missing absensi.
  const classesByStaff = new Map();
  for (const item of check.classesNeedingReminder) {
    const targetStaffIds = item.senseiPengajarId
      ? [item.senseiPengajarId]
      : senseiStaff.map((s) => s.id);
    for (const staffId of targetStaffIds) {
      if (!classesByStaff.has(staffId)) classesByStaff.set(staffId, []);
      classesByStaff.get(staffId).push(item);
    }
  }

  const results = [];
  for (const [staffId, items] of classesByStaff) {
    const namaKelas = items.map((i) => i.namaKelas).join(', ');
    const status = slotKey === 'sore' ? 'masih belum diisi' : 'belum diisi';
    const payload = createPushNotificationPayload({
      jenis: 'pengingat_absensi',
      titleId: `Pengingat Absensi: ${namaKelas}`,
      titleJa: `出席登録リマインダー: ${namaKelas}`,
      bodyId: `Presensi kelas ${namaKelas} untuk tanggal ${todayWIB} ${status}. Silakan lengkapi segera.`,
      bodyJa: `${namaKelas}の${todayWIB}の出席データがまだ入力されていません。登録をお願いします。`,
      deepLink: `/absensi?kelasId=${items[0].kelasId}&tanggal=${todayWIB}`,
      metadata: { kelasId: items[0].kelasId, kelasIds: items.map((i) => i.kelasId), tanggal: todayWIB, slot: slotKey },
    });

    const pushResult = await kirimPush({
      jenis: `pengingat_absensi_${slotKey}`,
      tanggal: todayWIB,
      staffIds: [staffId],
      payload,
      force: false, // Deduplication enforced per slot
    });

    results.push({
      staffId,
      kelas: items.map((i) => ({ kelasId: i.kelasId, namaKelas: i.namaKelas })),
      pushResult,
    });
  }

  return {
    ok: true,
    targetDate: todayWIB,
    slot: slotKey,
    executed: true,
    totalClassesChecked: data.kelas.length,
    classesNeedingReminderCount: check.classesNeedingReminder.length,
    remindersSent: results,
  };
}
