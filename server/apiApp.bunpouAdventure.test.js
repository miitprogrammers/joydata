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
let server;
let base;
let uid;
let uid2;
let token;
let token2;
let staffToken;
let senseiToken;
let earlierCwd;
let ba;
// Bank fixture yang disuntikkan ke router; bank nyata masih kosong. Diisi per tes lewat isiBank().
const BANK = [];

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

function isiBank(kode, jumlah = 4) {
  const vol = ba.cariVolume(kode);
  for (const pola of ba.polaVolume(kode)) {
    for (let n = 1; n <= jumlah; n += 1) {
      BANK.push({
        id: `${vol.jlpt}-${pola}-${n}`,
        pola,
        situasi: null,
        baris: [{ sebelum: 'a', sesudah: 'b' }],
        potongan: [`${pola}${n}a`, `${pola}${n}b`, `${pola}${n}c`, `${pola}${n}d`],
        bintang: n % 4,
        urutanLain: [],
        terjemahan: 't',
        pembahasan: 'p',
      });
    }
  }
}

/** Satu sesi penuh: mulai lalu nilai. `salahPola` dijawab salah, selebihnya benar. */
async function mainkan(volume, input, { salahPola = [], auth = token } = {}) {
  const mulai = await call('POST', '/portal/bunpou-adventure/mulai', { volume, ...input }, auth);
  assert.equal(mulai.status, 200, JSON.stringify(mulai.data));
  const jawaban = Object.fromEntries(mulai.data.soal.map((k) => [
    k.id,
    salahPola.includes(k.pola) ? [1, 2, 3, 4].find((n) => n !== k.benar) : k.benar,
  ]));
  const nilai = await call('POST', '/portal/bunpou-adventure/nilai', { sesiId: mulai.data.sesiId, jawaban, detikAktif: 30 }, auth);
  assert.equal(nilai.status, 200, JSON.stringify(nilai.data));
  return { mulai, nilai };
}

async function selesaikanBersih(kode) {
  const jumlahTahap = ba.tahapVolume(kode).length;
  for (let i = 0; i < jumlahTahap; i += 1) {
    const { nilai } = await mainkan(kode, { tahapIndex: i });
    assert.equal(nilai.data.tahapTuntas, true);
  }
}

async function buatPeserta(urutan) {
  const cache = new Map((db.mancationPesertaCache || []).map((c) => [Number(c.mancationAkunId), c]));
  const kandidat = (db.peserta || []).filter((p) => cache.has(Number(p.mancationAkunId)));
  const peserta = kandidat[urutan];
  assert.ok(peserta, 'seed demo harus punya cukup peserta');
  cache.get(Number(peserta.mancationAkunId)).email = `api.bunpou${urutan}@example.test`;
  db.pesertaAkun ||= [];
  db.pesertaAkun.push({ pesertaId: peserta.id, passwordHash: 'x', wajibGantiSandi: false, aktif: true, versiToken: 1 });
  engine.saveLocalState();
  return peserta.id;
}

before(async () => {
  delete process.env.DATABASE_URL;
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bunpou-adventure-api-'));
  earlierCwd = process.cwd();
  process.chdir(tmp);

  engine = await import(moduleUrl('server/db/engine.js'));
  engine.writeLocalStateFile(engine.createInitialLocalState({ demo: true }));
  db = engine.readLocalState();
  uid = await buatPeserta(0);
  uid2 = await buatPeserta(1);

  ba = await import(moduleUrl('server/domain/bunpouAdventure.js'));
  const { signPortalToken } = await import(moduleUrl('server/middleware/portalAuth.js'));
  const { signTokens } = await import(moduleUrl('server/middleware/auth.js'));
  token = signPortalToken({ id: uid, versiToken: 1 });
  token2 = signPortalToken({ id: uid2, versiToken: 1 });
  staffToken = signTokens({ id: 1, username: 'admin', role: { kode: 'admin' } }).accessToken;
  // Sensei demo tidak punya akses halaman monitor-latihan.
  senseiToken = signTokens({ id: 2, username: 'sensei_joy1', role: { kode: 'sensei' } }).accessToken;

  const express = nodeRequire('express');
  const { createApiRouter } = await import(moduleUrl('server/apiApp.js'));
  const app = express();
  app.use(express.json());
  app.use('/api', createApiRouter({ bankBintang: BANK }));
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (earlierCwd) process.chdir(earlierCwd);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('tanpa token 401; endpoint sensei menolak token peserta dan sensei tanpa akses monitor-latihan', async () => {
  for (const [metode, rute] of [
    ['GET', '/portal/bunpou-adventure/volume'],
    ['GET', '/portal/bunpou-adventure/volume/BN5V1'],
    ['POST', '/portal/bunpou-adventure/mulai'],
    ['POST', '/portal/bunpou-adventure/detak'],
    ['POST', '/portal/bunpou-adventure/nilai'],
    ['GET', '/portal/bunpou-adventure/riwayat'],
    ['GET', `/monitor-latihan/bunpou-adventure/peserta/${uid}`],
  ]) {
    assert.equal((await call(metode, rute, metode === 'POST' ? {} : undefined, null)).status, 401, rute);
  }
  assert.equal((await call('GET', `/monitor-latihan/bunpou-adventure/peserta/${uid}`, undefined, token)).status, 401);
  const tanpaAkses = await call('GET', `/monitor-latihan/bunpou-adventure/peserta/${uid}`, undefined, senseiToken);
  assert.equal(tanpaAkses.status, 403);
  assert.equal(tanpaAkses.data.error, 'FORBIDDEN_PAGE_ACCESS');
});

test('daftar volume: 10 volume, Vol 1 tiap tingkat terbuka (N4 tanpa N5), lainnya terkunci, bank kosong belum dirilis', async () => {
  const res = await call('GET', '/portal/bunpou-adventure/volume');
  assert.equal(res.status, 200);
  assert.deepEqual(res.data.map((v) => v.kode), ba.VOLUME_BUNPOU.map((v) => v.kode));
  const v1 = res.data[0];
  assert.deepEqual(Object.keys(v1).sort(), ['bab', 'dirilis', 'jlpt', 'jumlahPola', 'judul', 'kode', 'nomor', 'progres', 'tahapCount', 'terkunci'].sort());
  assert.equal(v1.jumlahPola, 10);
  assert.equal(v1.tahapCount, 3);
  assert.equal(v1.dirilis, false);
  assert.deepEqual(res.data.map((v) => v.terkunci), [false, true, true, true, true, false, true, true, true, true]);
  assert.deepEqual(v1.progres, { tahap_terbuka: 0, dikuasai: 0, bos: 0, selesai: false, perlu_perhatian: false });
});

test('volume yang belum dirilis ditolak mulai (403 VOLUME_BELUM_DIRILIS) walau tidak terkunci', async () => {
  const res = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', tahapIndex: 0 });
  assert.equal(res.status, 403);
  assert.equal(res.data.error, 'VOLUME_BELUM_DIRILIS');
  assert.equal(engine.readLocalState().latihanSesi.length, 0, 'tidak ada sesi latihan tercatat');
});

test('volume terkunci 403 walau dipanggil langsung dan bank penuh; input salah 400/404', async () => {
  isiBank('BN5V1');
  isiBank('BN5V2');
  const terkunci = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V2', tahapIndex: 0 });
  assert.equal(terkunci.status, 403);
  assert.equal(terkunci.data.error, 'VOLUME_TERKUNCI');
  assert.equal((await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'NGAWUR', tahapIndex: 0 })).data.error, 'INVALID_BUNPOU_VOLUME');
  assert.equal((await call('POST', '/portal/bunpou-adventure/mulai', {})).status, 400);
  assert.equal((await call('GET', '/portal/bunpou-adventure/volume/NGAWUR')).status, 404);
  const detail = await call('GET', '/portal/bunpou-adventure/volume/BN5V2');
  assert.equal(detail.status, 200);
  assert.equal(detail.data.terkunci, true);
  assert.ok(detail.data.tahap.every((t) => t.status === 'terkunci'));
});

test('tahap terkunci, tidak valid, dan bos sebelum waktunya ditolak di API', async () => {
  const kunci = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', tahapIndex: 1 });
  assert.equal(kunci.status, 403);
  assert.equal(kunci.data.error, 'TAHAP_TERKUNCI');
  const bos = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', mode: 'bos' });
  assert.equal(bos.status, 403);
  assert.equal(bos.data.error, 'TAHAP_TERKUNCI');
  const luar = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', tahapIndex: 99 });
  assert.equal(luar.status, 400);
  assert.equal(luar.data.error, 'TAHAP_TIDAK_VALID');
  assert.equal((await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1' })).data.error, 'TAHAP_TIDAK_VALID');
});

test('peta volume setelah dirilis: bentuk respons tahap dan bos', async () => {
  const res = await call('GET', '/portal/bunpou-adventure/volume/BN5V1');
  assert.equal(res.status, 200);
  assert.equal(res.data.dirilis, true);
  assert.equal(res.data.terkunci, false);
  assert.deepEqual(res.data.tahap.map((t) => t.status), ['tersedia', 'terkunci', 'terkunci']);
  assert.deepEqual(res.data.tahap.map((t) => t.jumlah), [3, 3, 4]);
  assert.equal(res.data.tahap[0].label, 'Bab 1');
  assert.equal(res.data.tahap[2].label, 'Bab 3–4');
  assert.deepEqual(res.data.bos, { status: 'terkunci', jumlah: 0, rondeBerikut: 1, ukuranRonde: 0, pola: [] });
});

test('alur sesi: kertas, detak, nilai dari kertas tersimpan, latihan_sesi jenis bunpou mode latihan, grade', async () => {
  const mulai = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', tahapIndex: 0 });
  assert.equal(mulai.status, 200);
  assert.equal(mulai.data.mode, 'tahap');
  assert.equal(mulai.data.tahapIndex, 0);
  assert.equal(mulai.data.volume, 'BN5V1');
  assert.equal(mulai.data.soal.length, 6, '3 pola x 2 varian');
  const kertas = mulai.data.soal[0];
  assert.deepEqual(Object.keys(kertas).sort(), ['baris', 'benar', 'bintang', 'id', 'pilihan', 'pola', 'pembahasan', 'situasi', 'terjemahan', 'urutan'].sort());
  assert.equal(kertas.pilihan.length, 4);
  assert.equal(engine.readLocalState().bunpouAdventureSesi.length, 1);

  const detak = await call('POST', '/portal/bunpou-adventure/detak', { sesiId: mulai.data.sesiId, detikAktif: 30 });
  assert.equal(detak.status, 200);
  assert.equal(detak.data.aktivitasId, mulai.data.aktivitasId);

  // Client mengirim kunci palsu (kertas dengan `benar` diubah): server hanya membaca nomor jawaban.
  const jawaban = Object.fromEntries(mulai.data.soal.map((k) => [k.id, k.benar]));
  const nilai = await call('POST', '/portal/bunpou-adventure/nilai', {
    sesiId: mulai.data.sesiId,
    jawaban,
    soal: mulai.data.soal.map((k) => ({ ...k, benar: 1 })),
    kunci: { [kertas.id]: 1 },
    detikAktif: 30,
  });
  assert.equal(nilai.status, 200);
  assert.equal(nilai.data.benar, 6);
  assert.equal(nilai.data.total, 6);
  assert.equal(nilai.data.skor, 100);
  assert.equal(nilai.data.lulus, true);
  assert.equal(nilai.data.tahapTuntas, true);
  assert.equal(nilai.data.sisa, 0);
  assert.equal(nilai.data.bosBaru, 0);
  assert.equal(nilai.data.tahapTerbuka, 1);
  assert.equal(nilai.data.selesai, false);
  // Grade comes from the real practice history: this is the only scored session, so the average is exactly 100.
  const riwayatGrade = await call('GET', '/portal/bunpou-adventure/riwayat');
  assert.equal(riwayatGrade.data.ringkasan.rataSkorLatihan, 100);
  assert.ok(nilai.data.grade && nilai.data.grade.nilai > 0);
  assert.deepEqual(nilai.data.grade, riwayatGrade.data.ringkasan.grade);
  assert.equal(nilai.data.detail.length, 6);
  assert.deepEqual(Object.keys(nilai.data.detail[0]).sort(), ['benar', 'dipilih', 'kunci', 'pola', 'soalId', 'urutan']);
  assert.deepEqual(nilai.data.progres, { tahap_terbuka: 1, dikuasai: 3, bos: 0, selesai: false, perlu_perhatian: false });
  assert.deepEqual(nilai.data.bos, { status: 'terkunci', jumlah: 0, rondeBerikut: 1, ukuranRonde: 0, pola: [] });
  assert.equal(engine.readLocalState().bunpouAdventureSesi.length, 0);

  const sesiLatihan = engine.readLocalState().latihanSesi.find((s) => s.id === mulai.data.aktivitasId);
  assert.equal(sesiLatihan.jenis, 'bunpou');
  assert.equal(sesiLatihan.mode, 'latihan');
  assert.equal(sesiLatihan.materi, 'adventure');
  assert.equal(sesiLatihan.jlpt, 'N5');
  assert.ok(sesiLatihan.selesaiAt, 'sesi latihan ditutup');
  assert.equal(sesiLatihan.skor, 100);

  const pakaiLagi = await call('POST', '/portal/bunpou-adventure/nilai', { sesiId: mulai.data.sesiId, jawaban });
  assert.equal(pakaiLagi.status, 404);
});

test('penilaian memakai kertas tersimpan: jawaban salah tetap salah walau client mengirim kunci palsu', async () => {
  const mulai = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', tahapIndex: 1 });
  assert.equal(mulai.status, 200);
  const salah = Object.fromEntries(mulai.data.soal.map((k) => [k.id, [1, 2, 3, 4].find((n) => n !== k.benar)]));
  const nilai = await call('POST', '/portal/bunpou-adventure/nilai', {
    sesiId: mulai.data.sesiId,
    jawaban: salah,
    soal: mulai.data.soal.map((k) => ({ ...k, benar: salah[k.id] })),
  });
  assert.equal(nilai.status, 200);
  assert.equal(nilai.data.benar, 0);
  assert.equal(nilai.data.lulus, false);
  assert.equal(nilai.data.bosBaru, 3, 'tiga pola masuk bos');
  assert.equal(nilai.data.tahapTuntas, false);
  assert.equal(nilai.data.tahapTerbuka, 1);
  assert.equal(nilai.data.bos.jumlah, 3);
  assert.equal(nilai.data.bos.status, 'terkunci', 'tahap belum semua lulus');
});

test('nilai dengan sesi orang lain ditolak (404) dan sesi tetap utuh untuk pemiliknya', async () => {
  const mulai = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', tahapIndex: 1 });
  assert.equal(mulai.status, 200);
  const jawaban = Object.fromEntries(mulai.data.soal.map((k) => [k.id, k.benar]));
  const orangLain = await call('POST', '/portal/bunpou-adventure/nilai', { sesiId: mulai.data.sesiId, jawaban }, token2);
  assert.equal(orangLain.status, 404);
  assert.equal((await call('POST', '/portal/bunpou-adventure/detak', { sesiId: mulai.data.sesiId }, token2)).status, 404);
  assert.equal(engine.readLocalState().bunpouAdventureSesi.length, 1);
  const milikSendiri = await call('POST', '/portal/bunpou-adventure/nilai', { sesiId: mulai.data.sesiId, jawaban });
  assert.equal(milikSendiri.status, 200);
  assert.equal(milikSendiri.data.tahapTuntas, true);
  assert.equal(milikSendiri.data.tahapTerbuka, 2);
  assert.equal((await call('POST', '/portal/bunpou-adventure/nilai', { sesiId: 123, jawaban })).status, 404);
});

test('gerbang dicek ulang saat nilai: tahap yang dikunci ulang membuat nilai ditolak 403', async () => {
  const mulai = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', tahapIndex: 2 });
  assert.equal(mulai.status, 200);
  const baris = engine.readLocalState().bunpouAdventureProgres.find((p) => Number(p.pesertaId) === uid && p.volume === 'BN5V1');
  const terbukaAwal = baris.tahap_terbuka;
  const riwayatAwal = baris.riwayat.length;
  baris.tahap_terbuka = 0;
  engine.saveLocalState();
  try {
    const jawaban = Object.fromEntries(mulai.data.soal.map((k) => [k.id, k.benar]));
    const nilai = await call('POST', '/portal/bunpou-adventure/nilai', { sesiId: mulai.data.sesiId, jawaban });
    assert.equal(nilai.status, 403);
    assert.equal(nilai.data.error, 'TAHAP_TERKUNCI');
    assert.equal(engine.readLocalState().bunpouAdventureSesi.length, 1, 'kertas tidak terpakai oleh gerbang yang menolak');
    const sesudah = engine.readLocalState().bunpouAdventureProgres.find((p) => Number(p.pesertaId) === uid && p.volume === 'BN5V1');
    assert.equal(sesudah.riwayat.length, riwayatAwal, 'progres tidak berubah');
  } finally {
    baris.tahap_terbuka = terbukaAwal;
    engine.saveLocalState();
    await call('POST', '/portal/bunpou-adventure/detak', { sesiId: mulai.data.sesiId, selesai: true });
  }
});

test('volume berikutnya terbuka hanya setelah volume sebelumnya selesai; volume bersih melewati bos', async () => {
  // BN5V1: tahap 0 dan 1 sudah lulus (dengan bos dari tes sebelumnya). Selesaikan tahap 2, lalu bos.
  const t2 = await mainkan('BN5V1', { tahapIndex: 2 });
  assert.equal(t2.nilai.data.tahapTuntas, true);
  assert.equal(t2.nilai.data.selesai, false, 'masih ada 3 bos dari sesi salah tadi');
  assert.equal(t2.nilai.data.bos.status, 'tersedia');
  assert.equal(t2.nilai.data.bos.jumlah, 3);
  assert.equal((await call('GET', '/portal/bunpou-adventure/volume')).data[1].terkunci, true);

  const bos = await mainkan('BN5V1', { mode: 'bos' });
  assert.equal(bos.mulai.data.mode, 'bos');
  assert.equal(bos.mulai.data.tahapIndex, -1);
  assert.equal(bos.mulai.data.ronde, 1);
  assert.equal(bos.mulai.data.soal.length, 3);
  assert.equal(bos.nilai.data.selesai, true);
  assert.equal(bos.nilai.data.tahapTuntas, true);
  assert.equal(bos.nilai.data.progres.bos, 0);
  assert.equal(bos.nilai.data.bos.status, 'selesai');
  assert.equal((await call('GET', '/portal/bunpou-adventure/volume')).data[1].terkunci, false);
  // Bos sudah kosong dan volume selesai: ronde bos tidak bisa diminta lagi.
  assert.equal((await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', mode: 'bos' })).data.error, 'TAHAP_TERKUNCI');
});

test('volume dengan kesalahan berakhir di ronde bos: pola yang pernah salah tetap bos walau sudah dikuasai', async () => {
  const pola = ba.polaVolume('BN5V2');
  const lemah = pola[0];
  const awal = await mainkan('BN5V2', { tahapIndex: 0 }, { salahPola: [lemah] });
  assert.equal(awal.nilai.data.bosBaru, 1);
  assert.equal(awal.nilai.data.tahapTuntas, false);
  const ulang = await mainkan('BN5V2', { tahapIndex: 0 });
  assert.equal(ulang.nilai.data.tahapTuntas, true);
  assert.equal(ulang.nilai.data.bos.jumlah, 1, 'benar di tahap tidak mengeluarkan dari bos');
  // Ulangan hanya memuat pola yang belum dikuasai: tidak ada soal untuk pola lain.
  assert.deepEqual([...new Set(ulang.mulai.data.soal.map((k) => k.pola))], [lemah]);

  for (let i = 1; i < ba.tahapVolume('BN5V2').length; i += 1) await mainkan('BN5V2', { tahapIndex: i });
  const detail = await call('GET', '/portal/bunpou-adventure/volume/BN5V2');
  assert.equal(detail.data.progres.selesai, false);
  assert.equal(detail.data.bos.status, 'tersedia');
  assert.equal(detail.data.bos.pola[0].id, lemah);
  assert.ok(detail.data.bos.pola[0].arti.length > 0);
  assert.equal(detail.data.bos.pola[0].salah, 2);

  // Bos dijawab salah: tetap bos, ronde naik.
  const salahBos = await mainkan('BN5V2', { mode: 'bos' }, { salahPola: [lemah] });
  assert.equal(salahBos.nilai.data.selesai, false);
  assert.equal(salahBos.nilai.data.sisa, 1);
  assert.equal(salahBos.nilai.data.bos.rondeBerikut, 2);
  const benarBos = await mainkan('BN5V2', { mode: 'bos' });
  assert.equal(benarBos.mulai.data.ronde, 2);
  assert.equal(benarBos.nilai.data.selesai, true);
});

test('N4 Vol 1 terbuka tanpa menamatkan N5: dirilis hanya bila bank N4 Vol 1 lengkap', async () => {
  const sebelum = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN4V1', tahapIndex: 0 });
  assert.equal(sebelum.status, 403);
  assert.equal(sebelum.data.error, 'VOLUME_BELUM_DIRILIS');
  // N4 Vol 2 tetap terkunci walau banknya penuh.
  isiBank('BN4V2');
  assert.equal((await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN4V2', tahapIndex: 0 })).data.error, 'VOLUME_TERKUNCI');
  // Dua pola kurang satu varian: tetap belum dirilis.
  isiBank('BN4V1');
  const dibuang = BANK.findIndex((s) => s.id.startsWith('N4-') && s.pola === ba.polaVolume('BN4V1')[0]);
  const [diambil] = BANK.splice(dibuang, 1);
  assert.equal((await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN4V1', tahapIndex: 0 })).data.error, 'VOLUME_BELUM_DIRILIS');
  BANK.push(diambil);
  const { nilai } = await mainkan('BN4V1', { tahapIndex: 0 });
  assert.equal(nilai.data.tahapTuntas, true);
});

test('kertas yang sama dikirim dua kali bersamaan hanya dinilai sekali; yang kedua 404', async () => {
  const mulai = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN4V1', tahapIndex: 1 });
  assert.equal(mulai.status, 200);
  const jawaban = Object.fromEntries(mulai.data.soal.map((k) => [k.id, k.benar]));
  const kirim = () => call('POST', '/portal/bunpou-adventure/nilai', { sesiId: mulai.data.sesiId, jawaban });
  const hasil = await Promise.all([kirim(), kirim()]);
  assert.deepEqual(hasil.map((h) => h.status).sort(), [200, 404]);
  const baris = engine.readLocalState().bunpouAdventureProgres.find((p) => Number(p.pesertaId) === uid && p.volume === 'BN4V1');
  assert.equal(baris.riwayat.filter((r) => r.tahapIndex === 1).length, 1, 'progres dilipat sekali');
});

test('VOLUME_TERKUNCI saat nilai: volume dikunci ulang di antara mulai dan nilai', async () => {
  const mulai = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V2', tahapIndex: 0 });
  assert.equal(mulai.status, 200);
  const sebelumnya = engine.readLocalState().bunpouAdventureProgres.find((p) => Number(p.pesertaId) === uid && p.volume === 'BN5V1');
  sebelumnya.selesai = false;
  engine.saveLocalState();
  try {
    const jawaban = Object.fromEntries(mulai.data.soal.map((k) => [k.id, k.benar]));
    const nilai = await call('POST', '/portal/bunpou-adventure/nilai', { sesiId: mulai.data.sesiId, jawaban });
    assert.equal(nilai.status, 403);
    assert.equal(nilai.data.error, 'VOLUME_TERKUNCI');
    assert.equal(engine.readLocalState().bunpouAdventureSesi.length, 1, 'kertas tetap ada');
  } finally {
    sebelumnya.selesai = true;
    engine.saveLocalState();
    await call('POST', '/portal/bunpou-adventure/detak', { sesiId: mulai.data.sesiId, selesai: true });
  }
});

test('galat baca database pada jalur gerbang = 503, bukan terkunci; rute tampilan tetap menjawab', async () => {
  const asli = db.bunpouAdventureProgres;
  Object.defineProperty(db, 'bunpouAdventureProgres', { configurable: true, enumerable: true, get() { throw new Error('db mati'); }, set() {} });
  try {
    const mulai = await call('POST', '/portal/bunpou-adventure/mulai', { volume: 'BN5V1', tahapIndex: 0 });
    assert.equal(mulai.status, 503);
    assert.equal(mulai.data.error, 'GAGAL_SESI_BUNPOU');
    const tampil = await call('GET', '/portal/bunpou-adventure/volume');
    assert.equal(tampil.status, 200);
  } finally {
    Object.defineProperty(db, 'bunpouAdventureProgres', { configurable: true, enumerable: true, writable: true, value: asli });
  }
});

test('riwayat dan monitor sensei: progres per volume, sesi bunpou, pola lemah', async () => {
  const riwayat = await call('GET', '/portal/bunpou-adventure/riwayat');
  assert.equal(riwayat.status, 200);
  assert.deepEqual(riwayat.data.progres.map((p) => p.volume), ['BN5V1', 'BN5V2', 'BN4V1']);
  assert.equal(riwayat.data.progres[0].judul, 'N5 Vol 1 · Bab 1–4');
  assert.equal(riwayat.data.progres[0].selesai, true);
  assert.ok(riwayat.data.sesiBunpou.length >= 8);
  assert.ok(riwayat.data.sesiBunpou.every((s) => s.jenis === 'bunpou' && s.materi === 'adventure' && s.mode === 'latihan'));
  assert.ok(riwayat.data.ringkasan.rataSkorLatihan > 0);

  const monitor = await call('GET', `/monitor-latihan/bunpou-adventure/peserta/${uid}`, undefined, staffToken);
  assert.equal(monitor.status, 200);
  assert.equal(monitor.data.peserta.pesertaId, uid);
  assert.equal(monitor.data.volume.length, 10);
  assert.equal(monitor.data.volume[0].progres.selesai, true);
  assert.equal(monitor.data.volume[1].terkunci, false);
  assert.ok(monitor.data.ringkasan.grade);
  assert.ok(monitor.data.polaLemah.length >= 4);
  assert.deepEqual(Object.keys(monitor.data.polaLemah[0]).sort(), ['arti', 'bab', 'id', 'pola', 'salah']);
  const salahUrut = monitor.data.polaLemah.map((p) => p.salah);
  assert.deepEqual(salahUrut, [...salahUrut].sort((a, b) => b - a));
  assert.ok(monitor.data.polaLemah.length <= 10);
  assert.equal(monitor.data.sesiBunpou.length, riwayat.data.sesiBunpou.length);
  assert.equal((await call('GET', '/monitor-latihan/bunpou-adventure/peserta/abc', undefined, staffToken)).status, 400);
});

test('peserta lain tidak melihat progres peserta ini', async () => {
  const res = await call('GET', '/portal/bunpou-adventure/volume', undefined, token2);
  assert.equal(res.status, 200);
  assert.ok(res.data.every((v) => !v.progres.selesai && v.progres.dikuasai === 0));
  assert.equal(res.data[1].terkunci, true);
});
