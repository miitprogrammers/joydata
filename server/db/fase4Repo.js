import webpush from 'web-push';
import { readLocalState, saveLocalState } from './engine.js';
import {
  validatePushSubscription,
  isPushDuplicate,
  createPushNotificationPayload,
  identifyClassesNeedingAbsensiReminder,
} from '../domain/rules.js';

let vapidConfigured = false;

function ensureVapidDetails() {
  if (vapidConfigured) return;
  const state = readLocalState();
  state.settings = state.settings || {};

  let publicKey = process.env.VAPID_PUBLIC_KEY;
  let privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    if (state.settings.vapidKeys?.publicKey && state.settings.vapidKeys?.privateKey) {
      publicKey = state.settings.vapidKeys.publicKey;
      privateKey = state.settings.vapidKeys.privateKey;
    } else {
      const generated = webpush.generateVAPIDKeys();
      publicKey = generated.publicKey;
      privateKey = generated.privateKey;
      state.settings.vapidKeys = { publicKey, privateKey };
      saveLocalState();
    }
  }

  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@lpk-mizuno.id';
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    vapidConfigured = true;
  } catch (err) {
    console.warn('VAPID setup warning:', err.message);
  }
}

export function getVapidPublicKey() {
  ensureVapidDetails();
  const state = readLocalState();
  return process.env.VAPID_PUBLIC_KEY || state.settings?.vapidKeys?.publicKey || '';
}

export function getPushSubscriptionStatus(staffId) {
  ensureVapidDetails();
  const state = readLocalState();
  const subs = (state.pushSubscriptions || []).filter(
    (s) => Number(s.staffId) === Number(staffId)
  );
  return {
    subscribed: subs.length > 0,
    count: subs.length,
    vapidPublicKey: getVapidPublicKey(),
  };
}

export function savePushSubscriptionRecord(staffId, payload) {
  ensureVapidDetails();
  const validation = validatePushSubscription(payload);
  if (!validation.ok) {
    throw new Error(validation.code);
  }

  const state = readLocalState();
  state.pushSubscriptions = state.pushSubscriptions || [];
  state.seq = state.seq || {};
  state.seq.pushSubscription = state.seq.pushSubscription || 1;

  const now = new Date().toISOString();
  const subData = validation.subscription;
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

export function removePushSubscriptionRecord(staffId, endpoint = null) {
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

/**
 * Dispatches web push notification to target staff members (§14.8 mainIdea.md).
 * Automatically cleans up expired/gone (410, 404) subscriptions.
 * Enforces UNIQUE(jenis, tanggal, staffId) deduplication.
 */
export async function kirimPush({ jenis, tanggal, staffIds = [], payload, force = false }) {
  ensureVapidDetails();
  const state = readLocalState();
  state.pushSubscriptions = state.pushSubscriptions || [];
  state.pushLogs = state.pushLogs || [];
  state.seq = state.seq || {};
  state.seq.pushLog = state.seq.pushLog || 1;

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
    if (!force && isPushDuplicate(state.pushLogs, { jenis, tanggal: targetDate, staffId: staffIdNum })) {
      results.skippedDuplicateCount++;
      continue;
    }

    const userSubs = state.pushSubscriptions.filter(
      (s) => Number(s.staffId) === staffIdNum
    );

    if (userSubs.length === 0) {
      results.noSubCount++;
      const logEntry = {
        id: state.seq.pushLog++,
        jenis,
        tanggal: targetDate,
        staffId: staffIdNum,
        status: 'no_subscription',
        endpointCount: 0,
        payload,
        sentAt: now,
      };
      state.pushLogs.push(logEntry);
      results.logs.push(logEntry);
      continue;
    }

    let deliveredToOneOrMore = false;
    for (const sub of userSubs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          JSON.stringify(payload)
        );
        deliveredToOneOrMore = true;
      } catch (err) {
        console.warn(`Web push error for staff ${staffIdNum}:`, err.statusCode || err.message);
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Remove stale subscription
          state.pushSubscriptions = state.pushSubscriptions.filter(
            (s) => s.endpoint !== sub.endpoint
          );
          results.cleanedStaleSubs++;
        }
      }
    }

    const logEntry = {
      id: state.seq.pushLog++,
      jenis,
      tanggal: targetDate,
      staffId: staffIdNum,
      status: deliveredToOneOrMore ? 'sent' : 'failed',
      endpointCount: userSubs.length,
      payload,
      sentAt: now,
    };
    state.pushLogs.push(logEntry);
    results.logs.push(logEntry);
    if (deliveredToOneOrMore) results.sentCount++;
  }

  saveLocalState();
  return results;
}

export function listPushLogs(limit = 50) {
  const state = readLocalState();
  const logs = [...(state.pushLogs || [])].reverse().slice(0, limit);
  const staffMap = new Map((state.staff || []).map((s) => [Number(s.id), s.nama]));

  return logs.map((l) => ({
    ...l,
    staffNama: staffMap.get(Number(l.staffId)) || `Staff #${l.staffId}`,
  }));
}

/**
 * Daily cron runner for absensi reminder (§14.8 & §14.5 mainIdea.md).
 * Triggered at 08:00 (reminder) and 16:00 (follow-up) WIB via Vercel Cron.
 */
export async function runPengingatAbsensiCron(customDate = null) {
  const state = readLocalState();
  // Get date in Asia/Jakarta timezone
  const todayWIB =
    customDate ||
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

  const check = identifyClassesNeedingAbsensiReminder({
    classes: state.kelas || [],
    absensiRecords: state.absensi || [],
    targetDate: todayWIB,
    hariLiburList: state.hariLibur || [],
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

  const results = [];
  const senseiStaff = (state.staff || []).filter(
    (s) => s.active && !s.deletedAt && (s.roleId === 3 || s.roleId === 1) // sensei & admin
  );

  for (const item of check.classesNeedingReminder) {
    const targetStaffIds = item.senseiPengajarId
      ? [item.senseiPengajarId]
      : senseiStaff.map((s) => s.id);

    const payload = createPushNotificationPayload({
      jenis: 'pengingat_absensi',
      titleId: `Pengingat Absensi: ${item.namaKelas}`,
      titleJa: `出席登録リマインダー: ${item.namaKelas}`,
      bodyId: `Presensi kelas ${item.namaKelas} untuk tanggal ${todayWIB} belum diisi. Silakan lengkapi segera.`,
      bodyJa: `${item.namaKelas}の${todayWIB}の出席データがまだ入力されていません。登録をお願いします。`,
      deepLink: `/absensi?kelasId=${item.kelasId}&tanggal=${todayWIB}`,
      metadata: { kelasId: item.kelasId, tanggal: todayWIB },
    });

    const pushResult = await kirimPush({
      jenis: 'pengingat_absensi',
      tanggal: todayWIB,
      staffIds: targetStaffIds,
      payload,
      force: false, // Deduplication enforced
    });

    results.push({
      kelasId: item.kelasId,
      namaKelas: item.namaKelas,
      staffNotified: targetStaffIds,
      pushResult,
    });
  }

  return {
    ok: true,
    targetDate: todayWIB,
    executed: true,
    totalClassesChecked: (state.kelas || []).length,
    classesNeedingReminderCount: check.classesNeedingReminder.length,
    remindersSent: results,
  };
}
