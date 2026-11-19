import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const moduleUrl = (rel) => pathToFileURL(path.join(root, rel).replace(/\\/g, '/')).href;
const nodeRequire = createRequire(pathToFileURL(path.join(root, 'package.json').replace(/\\/g, '/')));

let tmp;
let engine;
let db;
let app;
let server;
let base;
let uid;
let token;
let staffToken;
let earlierCwd;

async function call(method, route, body, auth = token) {
  const res = await fetch(base + route, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(auth ? { authorization: `Bearer ${auth}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

before(async () => {
  delete process.env.DATABASE_URL;
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kanji-adventure-api-'));
  earlierCwd = process.cwd();
  process.chdir(tmp);

  engine = await import(moduleUrl('server/db/engine.js'));
  engine.writeLocalStateFile(engine.createInitialLocalState({ demo: true }));
  db = engine.readLocalState();
  const cache = new Map((db.mancationPesertaCache || []).map((c) => [Number(c.mancationAkunId), c]));
  const peserta = (db.peserta || []).find((p) => cache.has(Number(p.mancationAkunId)));
  assert.ok(peserta, 'seed demo harus punya peserta');
  cache.get(Number(peserta.mancationAkunId)).email = 'api.test@example.test';
  uid = peserta.id;
  db.pesertaAkun ||= [];
  db.pesertaAkun.push({
    pesertaId: uid,
    passwordHash: 'x',
    wajibGantiSandi: false,
    aktif: true,
    versiToken: 1,
  });
  engine.saveLocalState();

  const { signPortalToken } = await import(moduleUrl('server/middleware/portalAuth.js'));
  const { signTokens } = await import(moduleUrl('server/middleware/auth.js'));
  token = signPortalToken({ id: uid, versiToken: 1 });
  staffToken = signTokens({ id: 1, username: 'admin', role: { kode: 'admin' } }).accessToken;

  const express = nodeRequire('express');
  const { createApiRouter } = await import(moduleUrl('server/apiApp.js'));
  app = express();
  app.use(express.json());
  app.use('/api', createApiRouter());
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (earlierCwd) process.chdir(earlierCwd);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('p3e: rute portal dan sensei menolak token yang salah', async () => {
  assert.equal((await call('GET', '/portal/kanji-adventure/volume', undefined, null)).status, 401);
  assert.equal(
    (await call('GET', `/monitor-latihan/kanji-adventure/peserta/${uid}`, undefined, token)).status,
    401,
  );
  assert.equal(
    (await call('GET', `/monitor-latihan/kanji-adventure/peserta/${uid}`, undefined, null)).status,
    401,
  );
});

test('p3e: portal menolak peserta yang belum mengganti sandi default', async () => {
  const akun = db.pesertaAkun.find((a) => a.pesertaId === uid);
  const sebelumnya = akun.wajibGantiSandi;
  akun.wajibGantiSandi = true;
  engine.saveLocalState();
  try {
    const res = await call('GET', '/portal/kanji-adventure/volume');
    assert.equal(res.status, 403);
    assert.equal(res.data.error, 'PORTAL_PASSWORD_CHANGE_REQUIRED');
  } finally {
    akun.wajibGantiSandi = sebelumnya;
    engine.saveLocalState();
  }
});

test('p3d/p3e: alur sesi dinilai, session token habis, riwayat dan grade muncul', async () => {
  const volumes = await call('GET', '/portal/kanji-adventure/volume');
  assert.equal(volumes.status, 200);
  assert.ok(volumes.data.length >= 11);
  assert.equal(volumes.data[0].materi, 'DASAR');

  const materi = volumes.data[0].materi;
  const detail = await call('GET', `/portal/kanji-adventure/volume/${materi}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.data.materi, materi);
  assert.ok(detail.data.chunks.length > 0);

  const mulai = await call('POST', '/portal/kanji-adventure/mulai', { materi, chunkIndex: 0 });
  assert.equal(mulai.status, 200);
  assert.ok(mulai.data.sesiId);
  assert.ok(mulai.data.soal.length > 0);
  assert.equal(engine.readLocalState().kanjiAdventureSesi.length, 1);

  const detak = await call('POST', '/portal/kanji-adventure/detak', {
    sesiId: mulai.data.sesiId,
    detikAktif: 60,
  });
  assert.equal(detak.status, 200);
  assert.equal(detak.data.aktivitasId, mulai.data.aktivitasId);

  const jawaban = Object.fromEntries(
    mulai.data.soal.map((q) => [q.id, { bacaan: q.bacaan.benar, arti: q.arti.benar }]),
  );
  const nilai = await call('POST', '/portal/kanji-adventure/nilai', {
    sesiId: mulai.data.sesiId,
    jawaban,
    detikAktif: 60,
  });
  assert.equal(nilai.status, 200);
  assert.equal(nilai.data.benar, mulai.data.soal.length);
  assert.equal(nilai.data.skor, 100);
  assert.equal(nilai.data.lulus, true);
  assert.equal(nilai.data.nextChunk, 1);
  assert.equal(nilai.data.chunkTuntas, true);
  assert.equal(nilai.data.sisa, 0);
  assert.equal(nilai.data.detail.length, mulai.data.soal.length);
  assert.ok(nilai.data.grade && nilai.data.grade.nilai >= 0);
  assert.equal(engine.readLocalState().kanjiAdventureSesi.length, 0);

  const pakaiLagi = await call('POST', '/portal/kanji-adventure/nilai', { sesiId: mulai.data.sesiId, jawaban });
  assert.equal(pakaiLagi.status, 404);

  const riwayat = await call('GET', '/portal/kanji-adventure/riwayat');
  assert.equal(riwayat.status, 200);
  assert.equal(riwayat.data.progres[0].materi, materi);
  assert.equal(riwayat.data.progres[0].chunk_terbuka, 1);
  assert.equal(riwayat.data.sesiAdventure.length, 1);
  assert.ok(riwayat.data.ringkasan.rataSkorLatihan > 0);
});

test('p3e: sensei melihat progres, grade, dan status kunci setiap volume', async () => {
  const res = await call('GET', `/monitor-latihan/kanji-adventure/peserta/${uid}`, undefined, staffToken);
  assert.equal(res.status, 200);
  assert.equal(res.data.peserta.pesertaId, uid);
  assert.equal(res.data.volume.length, 11);
  assert.equal(res.data.volume[0].materi, 'DASAR');
  assert.equal(res.data.volume[0].chunk_terbuka, 1);
  assert.equal(res.data.volume[0].chunks[0].status, 'selesai');
  assert.equal(res.data.volume[0].chunks[0].dikuasai, res.data.volume[0].chunks[0].jumlah);
  assert.equal(res.data.volume[0].boss.status, 'terkunci');
  assert.equal(res.data.volume[0].boss.jumlah, 0);
  assert.equal(res.data.volume[1].terkunci, true);
  assert.ok(res.data.ringkasan.grade);
  assert.equal(res.data.sesiAdventure.length, 1);
});

test('f5f: server menolak nilai bila chunk sesi sudah dikunci ulang', async () => {
  const mulai = await call('POST', '/portal/kanji-adventure/mulai', { materi: 'DASAR', chunkIndex: 1 });
  assert.equal(mulai.status, 200);

  const progres = db.kanjiAdventureProgres.find(
    (p) => Number(p.pesertaId) === Number(uid) && p.materi === 'DASAR',
  );
  assert.ok(progres, 'progres DASAR harus ada di local state');
  const terbukaAwal = progres.chunk_terbuka;
  const riwayatAwal = (progres.riwayat || []).length;
  progres.chunk_terbuka = 0;
  engine.saveLocalState();

  const jawaban = Object.fromEntries(
    mulai.data.soal.map((q) => [q.id, { bacaan: q.bacaan.benar, arti: q.arti.benar }]),
  );
  try {
    const nilai = await call('POST', '/portal/kanji-adventure/nilai', {
      sesiId: mulai.data.sesiId,
      jawaban,
      detikAktif: 60,
    });
    assert.equal(nilai.status, 403);
    assert.equal(nilai.data.error, 'CHUNK_TERKUNCI');

    const riwayat = await call('GET', '/portal/kanji-adventure/riwayat');
    const progresSesudah = riwayat.data.progres.find((p) => p.materi === 'DASAR');
    assert.equal(progresSesudah.chunk_terbuka, 0);

    const progresTersimpan = engine.readLocalState().kanjiAdventureProgres.find(
      (p) => Number(p.pesertaId) === Number(uid) && p.materi === 'DASAR',
    );
    assert.equal((progresTersimpan.riwayat || []).length, riwayatAwal);
  } finally {
    progres.chunk_terbuka = terbukaAwal;
    engine.saveLocalState();
    await call('POST', '/portal/kanji-adventure/detak', { sesiId: mulai.data.sesiId, selesai: true });
  }
});
