// Tes skrip skill tulis-soal-bintang. Semua dijalankan terhadap salinan sementara bank dan buku tinjauan
// (di bawah os.tmpdir()), tidak pernah bank atau buku asli.
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SOAL_BINTANG_N5 } from '../../../../server/domain/bankSoal/bintangN5.js';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const AKAR = path.resolve(DIR, '../../../..');
const BANK_ASLI = ['N5', 'N4'].map((n) => path.join(AKAR, `server/domain/bankSoal/bintang${n}.js`));
const sidik = (j) => crypto.createHash('sha256').update(fs.readFileSync(j)).digest('hex');
const SEBELUM = BANK_ASLI.map(sidik);
after(() => assert.deepEqual(BANK_ASLI.map(sidik), SEBELUM, 'bank asli tidak boleh berubah oleh tes skrip'));

const jalankan = (skrip, ...argumen) => {
  const r = spawnSync(process.execPath, [path.join(DIR, skrip), ...argumen], { encoding: 'utf8' });
  return { kode: r.status, keluar: r.stdout, galat: r.stderr };
};
const salin = (x) => JSON.parse(JSON.stringify(x));

// Empat varian satu pola dari pilot (sudah sah di bank), dipakai sebagai draf.
const DRAF = SOAL_BINTANG_N5.filter((s) => s.pola === 'wa-desu').map(salin);

function siapkan(draf = DRAF, dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bintang-skrip-'))) {
  const bank = path.join(dir, 'bintangN5.js');
  if (!fs.existsSync(bank)) fs.writeFileSync(bank, '// bank uji\nexport const SOAL_BINTANG_N5 = [];\n');
  const berkasDraf = path.join(dir, `draf-${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(berkasDraf, JSON.stringify(draf));
  const sub = fs.mkdtempSync(path.join(dir, 'putaran-'));
  const keluar = path.join(sub, 'peninjau');
  const rahasia = path.join(sub, 'rahasia');
  const r = jalankan('buat-buta.mjs', berkasDraf, '--tingkat', 'N5', '--keluar', keluar, '--rahasia', rahasia);
  assert.equal(r.kode, 0, r.galat);
  return {
    dir, bank, draf: berkasDraf, keluar, rahasia, buku: path.join(dir, 'buku'), semua: draf,
    peta: JSON.parse(fs.readFileSync(path.join(rahasia, 'peta-rahasia.json'), 'utf8')),
  };
}

/** Jawaban peninjau yang benar untuk semua soal (dari peta), dengan perubahan per id. */
function jawabanBenar(t, ubah = {}) {
  return Object.entries(t.peta).map(([kode, p]) => {
    const s = t.semua.find((x) => x.id === p.id);
    const nomorDari = (idx) => p.urutanTampil.indexOf(idx) + 1;
    return { kode, bintang: nomorDari(s.bintang), urutan: [0, 1, 2, 3].map(nomorDari), urutanLain: [], kewajaran: 'ok', tingkat: 'ok', gagal: [], ...(ubah[p.id] || {}) };
  });
}
function banding(t, jawaban) {
  const berkas = path.join(t.dir, `jawaban-${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(berkas, JSON.stringify(jawaban));
  t.jawaban = berkas;
  const r = jalankan('bandingkan.mjs', t.draf, berkas, '--keluar', t.keluar, '--rahasia', t.rahasia);
  const h = path.join(t.rahasia, 'hasil-banding.json');
  return { ...r, hasil: fs.existsSync(h) ? JSON.parse(fs.readFileSync(h, 'utf8')) : null };
}
/** Salin keempat berkas putaran ke buku tinjauan (seperti yang dilakukan manusia sesudah putaran selesai). */
function keBuku(t, nama) {
  const dir = path.join(t.buku, nama);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(t.keluar, 'buta.json'), path.join(dir, 'buta.json'));
  fs.copyFileSync(t.jawaban, path.join(dir, 'jawaban.json'));
  fs.copyFileSync(path.join(t.rahasia, 'peta-rahasia.json'), path.join(dir, 'peta-rahasia.json'));
  fs.copyFileSync(path.join(t.rahasia, 'hasil-banding.json'), path.join(dir, 'hasil-banding.json'));
}
const status = (hasil, id) => hasil.find((h) => h.id === id).status;
const inject = (t, draf, ...x) => jalankan('inject-bintang.mjs', draf, '--tingkat', 'N5', '--bank', t.bank, '--buku', t.buku, ...x);
const bacaBank = async (bank) => (await import(`data:text/javascript;base64,${fs.readFileSync(bank).toString('base64')}`)).SOAL_BINTANG_N5;

test('skill tidak lagi punya jalur --tinjauan-lama yang ditulis tangan', () => {
  const berkas = [...fs.readdirSync(DIR).filter((f) => f.endsWith('.mjs')).map((f) => path.join(DIR, f)), path.join(DIR, '..', 'SKILL.md')];
  for (const b of berkas) assert.ok(!fs.readFileSync(b, 'utf8').includes('tinjauan-lama'), b);
  const t = siapkan();
  const tulisan = path.join(t.dir, 'tangan.json');
  fs.writeFileSync(tulisan, JSON.stringify(DRAF.map((s) => ({ id: s.id, status: 'LOLOS' }))));
  const r = inject(t, t.draf, '--tinjauan-lama', tulisan);
  assert.notEqual(r.kode, 0);
  assert.match(r.galat, /tidak ada penilaian peninjau buta/);
});

test('buat-buta: kertas peninjau tanpa kunci; peta rahasia di folder lain, bukan di dalam folder peninjau', () => {
  const t = siapkan();
  const teks = fs.readFileSync(path.join(t.keluar, 'buta.json'), 'utf8');
  for (const terlarang of ['pembahasan', 'terjemahan', 'urutanLain', 'status', 'hash', 'urutanTampil']) assert.ok(!teks.includes(`"${terlarang}"`), terlarang);
  assert.ok(!fs.existsSync(path.join(t.keluar, 'peta-rahasia.json')));
  const buta = JSON.parse(teks);
  assert.equal(buta.length, DRAF.length);
  for (const k of Object.values(t.peta)) assert.match(k.hash, /^[0-9a-f]{16}$/);
  for (const soal of buta) {
    assert.equal(soal.pilihan.length, 4);
    assert.equal(soal.baris.flatMap((b) => b.kotak || []).filter((x) => x === '★').length, 1);
  }
  const sama = jalankan('buat-buta.mjs', t.draf, '--tingkat', 'N5', '--keluar', t.rahasia, '--rahasia', t.rahasia);
  assert.notEqual(sama.kode, 0, '--rahasia sama dengan --keluar ditolak');
  const dalam = jalankan('buat-buta.mjs', t.draf, '--tingkat', 'N5', '--keluar', t.keluar, '--rahasia', path.join(t.keluar, 'rahasia'));
  assert.notEqual(dalam.kode, 0, '--rahasia di dalam --keluar ditolak');
  assert.match(dalam.galat, /tidak boleh sama dengan atau berada di dalam/);
  assert.ok(!fs.existsSync(path.join(t.keluar, 'rahasia')));
});

test('bandingkan: LOLOS; tidak lengkap GAGAL; gagal[] memaksa GAGAL; catatan biasa CATATAN; kunci tak ditemukan CATATAN; kode ganda galat', () => {
  const t = siapkan();
  const [a, b, c, d] = DRAF.map((s) => s.id);
  const hasil = banding(t, jawabanBenar(t, {
    [b]: { kewajaran: undefined },
    [c]: { urutan: [1, 2, 3] },
    [d]: { gagal: ['bocor'], kewajaran: 'ok' },
  })).hasil;
  assert.equal(status(hasil, a), 'LOLOS');
  assert.equal(status(hasil, b), 'GAGAL');
  assert.match(hasil.find((h) => h.id === b).masalah.join(), /jawaban tidak lengkap/);
  assert.equal(status(hasil, c), 'GAGAL');
  assert.equal(status(hasil, d), 'GAGAL');
  assert.match(hasil.find((h) => h.id === d).masalah.join(), /GAGAL: bocor/);
  for (const h of hasil) assert.equal(h.hash, t.peta[h.kode].hash);

  const tanpaGagal = jawabanBenar(t);
  delete tanpaGagal.find((j) => t.peta[j.kode].id === a).gagal;
  assert.equal(status(banding(t, tanpaGagal).hasil, a), 'GAGAL', 'field gagal wajib ada');
  const asing = jawabanBenar(t, { [a]: { gagal: ['aneh'] } });
  assert.equal(status(banding(t, asing).hasil, a), 'GAGAL', 'jenis gagal harus dari daftar');

  const catatan = banding(t, jawabanBenar(t, { [a]: { kewajaran: '★ bisa ditempatkan dari bentuk pola' } })).hasil;
  assert.equal(status(catatan, a), 'CATATAN', 'catatan biasa tidak menggagalkan');

  const s = DRAF.find((x) => x.id === a);
  const kodeA = Object.keys(t.peta).find((k) => t.peta[k].id === a);
  const nomorDari = (idx) => t.peta[kodeA].urutanTampil.indexOf(idx) + 1;
  const bebas = [0, 1, 2, 3].filter((i) => i !== s.bintang);
  const tukar = [0, 1, 2, 3];
  [tukar[bebas[0]], tukar[bebas[1]]] = [tukar[bebas[1]], tukar[bebas[0]]];
  const h2 = banding(t, jawabanBenar(t, { [a]: { urutan: tukar.map(nomorDari) } })).hasil;
  assert.equal(status(h2, a), 'CATATAN');
  assert.match(h2.find((h) => h.id === a).masalah.join(), /urutan kunci tidak ditemukan peninjau/);

  const ganda = jawabanBenar(t);
  ganda.push({ ...ganda[0] });
  const berkas = path.join(t.dir, 'ganda.json');
  fs.writeFileSync(berkas, JSON.stringify(ganda));
  const r = jalankan('bandingkan.mjs', t.draf, berkas, '--keluar', t.keluar, '--rahasia', t.rahasia);
  assert.notEqual(r.kode, 0);
  assert.match(r.galat, /kode ganda/);
});

test('inject: menolak tanpa penilaian di buku, sidik berubah, CATATAN tanpa --terima, GAGAL di buku, status/kunci asing', async () => {
  const t = siapkan();
  const [a, b, c, d] = DRAF.map((s) => s.id);
  const bankAwal = fs.readFileSync(t.bank, 'utf8');

  assert.match(inject(t, t.draf).galat, /tidak ada penilaian peninjau buta/, 'buku kosong');
  const hasil = banding(t, jawabanBenar(t, {
    [b]: { kewajaran: 'agak kaku' },
    [c]: { gagal: ['ganda'] },
  })).hasil;
  assert.deepEqual([a, b, c, d].map((id) => status(hasil, id)), ['LOLOS', 'CATATAN', 'GAGAL', 'LOLOS']);
  keBuku(t, 'putaran-1');
  const r1 = inject(t, t.draf);
  assert.notEqual(r1.kode, 0);
  assert.match(r1.galat, new RegExp(`${b}: berstatus CATATAN`));
  assert.match(r1.galat, new RegExp(`${c}: ada penilaian GAGAL`));
  assert.equal(fs.readFileSync(t.bank, 'utf8'), bankAwal, 'bank tidak boleh berubah saat ditolak');

  const diedit = salin(DRAF[0]);
  diedit.situasi = '（ここで）';
  const berkasEdit = path.join(t.dir, 'diedit.json');
  fs.writeFileSync(berkasEdit, JSON.stringify([diedit]));
  assert.match(inject(t, berkasEdit).galat, /tidak ada penilaian peninjau buta untuk isi ini/);

  const berkasAsing = path.join(t.dir, 'asing.json');
  fs.writeFileSync(berkasAsing, JSON.stringify([{ ...DRAF[0], status: 'ditinjau', ekstra: 1 }]));
  const r3 = inject(t, berkasAsing);
  assert.match(r3.galat, /harus berstatus 'draf'/);
  assert.match(r3.galat, /kunci di luar bentuk soal: ekstra/);

  // Putaran kedua meluluskan isi yang sama, tetapi GAGAL di buku tetap memblokir.
  const t2 = siapkan(DRAF, t.dir);
  banding(t2, jawabanBenar(t2, { [b]: { kewajaran: 'agak kaku' } }));
  keBuku(t2, 'putaran-2');
  const r5 = inject(t, t.draf, '--terima', b, '--alasan', 'cek teks ok');
  assert.match(r5.galat, new RegExp(`${c}: ada penilaian GAGAL`), 'GAGAL di putaran lama memblokir walau putaran baru LOLOS');

  const tanpaC = path.join(t.dir, 'tanpa-c.json');
  fs.writeFileSync(tanpaC, JSON.stringify(DRAF.filter((s) => s.id !== c)));
  assert.match(inject(t, tanpaC, '--terima', b).galat, /--alasan/, '--terima wajib --alasan');
  const r4 = inject(t, tanpaC, '--terima', b, '--alasan', 'cek teks: kewajaran kecil');
  assert.equal(r4.kode, 0, r4.galat);
  const terima = JSON.parse(fs.readFileSync(path.join(t.buku, 'terima.json'), 'utf8'));
  assert.deepEqual(terima.map((x) => [x.id, x.alasan]), [[b, 'cek teks: kewajaran kecil']]);
  assert.match(terima[0].hash, /^[0-9a-f]{16}$/);
  assert.match(terima[0].tanggal, /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
  assert.equal((await bacaBank(t.bank)).length, 3);
  assert.ok(!fs.readdirSync(t.dir).some((f) => f.includes('.tmp-')), 'berkas sementara harus hilang');
});

test('inject: --bank dan --buku di luar os.tmpdir() ditolak, bank asli tidak tersentuh', () => {
  const t = siapkan();
  banding(t, jawabanBenar(t));
  keBuku(t, 'p1');
  const asli = BANK_ASLI[0];
  const r = jalankan('inject-bintang.mjs', t.draf, '--tingkat', 'N5', '--bank', asli, '--buku', t.buku, '--ganti');
  assert.notEqual(r.kode, 0);
  assert.match(r.galat, /--bank hanya boleh di bawah/);
  const r2 = jalankan('inject-bintang.mjs', t.draf, '--tingkat', 'N5', '--bank', t.bank, '--buku', path.join(AKAR, 'docs/bunpou-adventure/tinjauan'));
  assert.notEqual(r2.kode, 0);
  assert.match(r2.galat, /--buku hanya boleh di bawah/);
  assert.equal(sidik(asli), SEBELUM[0]);
  assert.ok(!fs.readdirSync(path.dirname(asli)).some((f) => f.includes('.tmp-')));
});

test('inject: tulis lewat berkas sementara, impor ulang sama persis (\\r, kutip, garis miring), --ganti idempoten', async () => {
  const t = siapkan();
  const aneh = salin(DRAF);
  aneh[0].pembahasan = `${aneh[0].pembahasan} Kutip ' dan " serta \\ dan \r baris\nbaru.`;
  const berkas = path.join(t.dir, 'aneh.json');
  fs.writeFileSync(berkas, JSON.stringify(aneh));
  banding(t, jawabanBenar(t));
  keBuku(t, 'p1');
  const r = inject(t, berkas);
  assert.equal(r.kode, 0, r.galat);
  assert.ok(!fs.readFileSync(t.bank, 'utf8').includes('\r'), 'tidak ada CR mentah di berkas');
  assert.deepEqual(salin(await bacaBank(t.bank)), aneh);
  assert.notEqual(inject(t, berkas).kode, 0, 'tanpa --ganti id yang ada ditolak');
  assert.equal(inject(t, berkas, '--ganti').kode, 0);
});

test('setujui-bintang + --ganti: ditinjau dipertahankan bila sidik isi sama, kembali draf bila isi berubah', async () => {
  const t = siapkan();
  banding(t, jawabanBenar(t));
  keBuku(t, 'p1');
  assert.equal(inject(t, t.draf).kode, 0);
  const [a, b] = DRAF.map((s) => s.id);
  assert.ok((await bacaBank(t.bank)).every((s) => s.status === 'draf'));

  assert.notEqual(jalankan('setujui-bintang.mjs', '--id', a, '--bank', t.bank, '--buku', t.buku).kode, 0, '--oleh wajib');
  const r = jalankan('setujui-bintang.mjs', '--id', `${a},${b}`, '--oleh', 'Sensei Uji', '--bank', t.bank, '--buku', t.buku);
  assert.equal(r.kode, 0, r.galat);
  const bank = await bacaBank(t.bank);
  assert.deepEqual(bank.filter((s) => s.status === 'ditinjau').map((s) => s.id).sort(), [a, b].sort());
  const catatan = JSON.parse(fs.readFileSync(path.join(t.buku, 'persetujuan.json'), 'utf8'));
  assert.deepEqual(catatan.map((x) => [x.id, x.oleh]), [[a, 'Sensei Uji'], [b, 'Sensei Uji']]);
  assert.match(catatan[0].tanggal, /^\d{4}-\d\d-\d\d$/);
  assert.match(catatan[0].hash, /^[0-9a-f]{16}$/);

  // Isi sama (hanya terjemahan berubah): status tetap ditinjau.
  const teks = salin(DRAF).filter((s) => s.id === a);
  teks[0].terjemahan = `${teks[0].terjemahan} (diperjelas)`;
  const berkasTeks = path.join(t.dir, 'teks.json');
  fs.writeFileSync(berkasTeks, JSON.stringify(teks));
  assert.equal(inject(t, berkasTeks, '--ganti').kode, 0);
  assert.equal((await bacaBank(t.bank)).find((s) => s.id === a).status, 'ditinjau');

  // Isi berubah (situasi) dan ditinjau ulang: kembali ke draf.
  const isi = salin(DRAF).filter((s) => s.id === b);
  isi[0].situasi = '（ここで）';
  const t2 = siapkan(isi, t.dir);
  banding(t2, jawabanBenar(t2));
  keBuku(t2, 'p2');
  assert.equal(inject(t, t2.draf, '--ganti').kode, 0);
  const akhir = await bacaBank(t.bank);
  assert.equal(akhir.find((s) => s.id === b).status, 'draf');
  assert.equal(akhir.find((s) => s.id === a).status, 'ditinjau');
});

test('--buku tanpa --bank ditolak (bank asli selalu memakai buku repo), juga di setujui-bintang', () => {
  const t = siapkan();
  banding(t, jawabanBenar(t));
  keBuku(t, 'p1');
  const r = jalankan('inject-bintang.mjs', t.draf, '--tingkat', 'N5', '--buku', t.buku);
  assert.notEqual(r.kode, 0);
  assert.match(r.galat, /--buku hanya boleh bersama --bank/);
  const r2 = jalankan('setujui-bintang.mjs', '--id', DRAF[0].id, '--oleh', 'X', '--buku', t.buku);
  assert.notEqual(r2.kode, 0);
  assert.match(r2.galat, /--buku hanya boleh bersama --bank/);
  assert.equal(sidik(BANK_ASLI[0]), SEBELUM[0]);
});

test('inject: baris GAGAL memblokir sidik isi yang sama walau id berbeda', () => {
  const t = siapkan();
  const c = DRAF[2];
  banding(t, jawabanBenar(t, { [c.id]: { gagal: ['bocor'] } }));
  keBuku(t, 'p1');
  const kembaran = salin(c);
  kembaran.id = 'N5-wa-desu-9';
  const berkas = path.join(t.dir, 'kembaran.json');
  fs.writeFileSync(berkas, JSON.stringify([kembaran]));
  const r = inject(t, berkas);
  assert.notEqual(r.kode, 0);
  assert.match(r.galat, /ada penilaian GAGAL untuk isi ini/);
});

test('inject: buku yang diubah, kurang berkas, atau tak cocok dengan hitung ulang menolak semua inject', () => {
  const siapBuku = () => {
    const t = siapkan();
    banding(t, jawabanBenar(t, { [DRAF[2].id]: { gagal: ['ganda'] } }));
    keBuku(t, 'p1');
    const lolos = path.join(t.dir, 'lolos.json');
    fs.writeFileSync(lolos, JSON.stringify([DRAF[0]]));
    assert.equal(inject(t, lolos, '--uji').kode, 0, 'sebelum diubah, buku sah');
    return { t, lolos, hasil: path.join(t.buku, 'p1', 'hasil-banding.json') };
  };
  // GAGAL diubah menjadi LOLOS di hasil-banding.json
  let { t, lolos, hasil } = siapBuku();
  const baris = JSON.parse(fs.readFileSync(hasil, 'utf8'));
  baris.find((x) => x.id === DRAF[2].id).status = 'LOLOS';
  fs.writeFileSync(hasil, JSON.stringify(baris));
  let r = inject(t, lolos, '--uji');
  assert.notEqual(r.kode, 0);
  assert.match(r.galat, /buku tinjauan tidak sah/);
  assert.match(r.galat, /!= hitung ulang/);
  // LOLOS dengan gagal tidak kosong
  ({ t, lolos, hasil } = siapBuku());
  const b2 = JSON.parse(fs.readFileSync(hasil, 'utf8'));
  b2.find((x) => x.id === DRAF[0].id).gagal = ['bocor'];
  fs.writeFileSync(hasil, JSON.stringify(b2));
  r = inject(t, lolos, '--uji');
  assert.match(r.galat, /gagal tidak kosong/);
  // field wajib hilang
  ({ t, lolos, hasil } = siapBuku());
  const b3 = JSON.parse(fs.readFileSync(hasil, 'utf8'));
  delete b3[0].hash;
  fs.writeFileSync(hasil, JSON.stringify(b3));
  assert.match(inject(t, lolos, '--uji').galat, /kekurangan field hash/);
  // berkas putaran hilang
  ({ t, lolos } = siapBuku());
  fs.rmSync(path.join(t.buku, 'p1', 'peta-rahasia.json'));
  assert.match(inject(t, lolos, '--uji').galat, /peta-rahasia.json tidak ada/);
  // jawaban.json diubah: hitung ulang berbeda dari hasil-banding.json
  ({ t, lolos } = siapBuku());
  const jw = path.join(t.buku, 'p1', 'jawaban.json');
  const j = JSON.parse(fs.readFileSync(jw, 'utf8'));
  j.forEach((x) => { x.gagal = ['ganda']; });
  fs.writeFileSync(jw, JSON.stringify(j));
  assert.match(inject(t, lolos, '--uji').galat, /buku tinjauan tidak sah/);
});

test('setujui-bintang: id tak ada membatalkan semuanya; wajib bukti buku atau pilot-pra-buku; CATATAN perlu terima.json', async () => {
  const t = siapkan();
  const [a, b, , d] = DRAF.map((s) => s.id);
  banding(t, jawabanBenar(t, { [b]: { kewajaran: 'agak kaku' } }));
  keBuku(t, 'p1');
  const sub = path.join(t.dir, 'sub.json');
  fs.writeFileSync(sub, JSON.stringify(DRAF.filter((s) => s.id !== b)));
  assert.equal(inject(t, sub).kode, 0);
  const setujui = (...x) => jalankan('setujui-bintang.mjs', '--oleh', 'Sensei Uji', '--bank', t.bank, '--buku', t.buku, ...x);
  const bankAwal = fs.readFileSync(t.bank, 'utf8');
  const r = setujui('--id', `${a},N5-tidak-ada-1`);
  assert.notEqual(r.kode, 0);
  assert.equal(fs.readFileSync(t.bank, 'utf8'), bankAwal, 'bank tidak berubah');
  assert.ok(!fs.existsSync(path.join(t.buku, 'persetujuan.json')), 'persetujuan.json tidak dibuat');
  assert.equal(setujui('--id', `${a},${a}`).kode, 2, 'id kembar ditolak');

  // Bukti dari buku: a (LOLOS) diterima, dan hanya a berubah.
  assert.equal(setujui('--id', a).kode, 0);
  const bank = await bacaBank(t.bank);
  assert.deepEqual(bank.filter((s) => s.status === 'ditinjau').map((s) => s.id), [a]);

  // CATATAN: tanpa terima.json ditolak; setelah dicatat diterima (soal b dimasukkan lewat --terima).
  assert.equal(inject(t, path.join(t.dir, 'sub.json'), '--ganti', '--uji').kode, 0);
  const bberkas = path.join(t.dir, 'b.json');
  fs.writeFileSync(bberkas, JSON.stringify(DRAF.filter((s) => s.id === b)));
  assert.equal(inject(t, bberkas, '--terima', b, '--alasan', 'cek teks ok').kode, 0);
  assert.equal(setujui('--id', b).kode, 0, 'CATATAN tercatat di terima.json');
  fs.rmSync(path.join(t.buku, 'terima.json'));
  assert.match(setujui('--id', b).galat, /berstatus CATATAN/);

  // Tanpa bukti di buku: ditolak. Dengan pilot-pra-buku: diterima.
  fs.rmSync(path.join(t.buku, 'p1'), { recursive: true });
  const r2 = setujui('--id', d);
  assert.notEqual(r2.kode, 0);
  assert.match(r2.galat, /tidak ada penilaian peninjau buta/);
  const soal = (await bacaBank(t.bank)).find((s) => s.id === d);
  const hash = crypto.createHash('sha256').update(JSON.stringify({ situasi: soal.situasi ?? null, baris: soal.baris, potongan: soal.potongan, bintang: soal.bintang })).digest('hex').slice(0, 16);
  fs.writeFileSync(path.join(t.buku, 'pilot-pra-buku.json'), JSON.stringify([{ id: d, hash }]));
  assert.equal(setujui('--id', d).kode, 0);
  assert.equal((await bacaBank(t.bank)).find((s) => s.id === d).status, 'ditinjau');
  assert.ok(!fs.readdirSync(t.dir).some((f) => f.includes('.tmp-')));
});
