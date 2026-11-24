// Penilaian jawaban peninjau buta + verifikasi buku tinjauan. Dipakai bandingkan.mjs (menilai), inject-bintang.mjs,
// setujui-bintang.mjs dan tes buku (menghitung ulang). Satu fungsi penilai untuk semuanya, jadi hasil-banding.json
// yang disalin ke buku selalu bisa dihitung ulang dari buta.json + jawaban.json + peta-rahasia.json.
import fs from 'node:fs';
import path from 'node:path';
import { hashSoal } from './_umum.mjs';

export const KIND_GAGAL = ['ganda', 'bocor', 'tanda-baca', 'tidak-wajar', 'di-atas-bab'];
const sama = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const permutasi1sd4 = (u) => Array.isArray(u) && u.length === 4 && [...u].sort((a, b) => a - b).every((n, i) => n === i + 1);
const ada = (v) => typeof v === 'string' && v.trim() !== '';

/**
 * Menilai satu jawaban. `soal` = { potongan, bintang, urutanLain? } (kunci), `p` = entri peta { id, urutanTampil, hash },
 * `j` = jawaban peninjau. Mengembalikan baris hasil tanpa `dinilai`.
 */
export function nilaiSatu(soal, p, j) {
  const dasar = { kode: j.kode, id: p.id, hash: p.hash };
  const tidakLengkap = [];
  if (!Number.isInteger(j.bintang) || j.bintang < 1 || j.bintang > 4) tidakLengkap.push('bintang bukan 1-4');
  if (!permutasi1sd4(j.urutan)) tidakLengkap.push('urutan bukan permutasi 1-4');
  if (!ada(j.kewajaran)) tidakLengkap.push('kewajaran kosong');
  if (!ada(j.tingkat)) tidakLengkap.push('tingkat kosong');
  if (!(Array.isArray(j.gagal) && j.gagal.every((g) => KIND_GAGAL.includes(g)))) tidakLengkap.push(`gagal harus larik dari ${KIND_GAGAL.join(' | ')}`);
  if (j.urutanLain !== undefined && !(Array.isArray(j.urutanLain) && j.urutanLain.every(permutasi1sd4))) tidakLengkap.push('urutanLain berisi bukan permutasi 1-4');
  if (tidakLengkap.length) {
    return { ...dasar, status: 'GAGAL', masalah: [`jawaban tidak lengkap: ${tidakLengkap.join('; ')}`], urutanLainBaru: [] };
  }

  const keIndeks = (nomor) => nomor.map((n) => p.urutanTampil[n - 1]);
  const kunci = soal.potongan[soal.bintang];
  const sah = [[0, 1, 2, 3], ...(soal.urutanLain || [])];
  const masalah = j.gagal.map((g) => `peninjau menandai GAGAL: ${g}`);
  const pilihan = soal.potongan[p.urutanTampil[j.bintang - 1]];
  if (pilihan !== kunci) masalah.push(`★ peninjau "${pilihan}" != kunci "${kunci}"`);
  const utama = keIndeks(j.urutan);
  if (soal.potongan[utama[soal.bintang]] !== pilihan) masalah.push('urutan peninjau tidak cocok dengan pilihan ★-nya sendiri');
  const baru = [];
  const semuaUrutan = [utama, ...(j.urutanLain || []).map(keIndeks)];
  for (const u of semuaUrutan) {
    if (soal.potongan[u[soal.bintang]] !== kunci) masalah.push(`urutan sah menurut peninjau [${u.map((i) => soal.potongan[i]).join(' / ')}] memberi ★ lain`);
    else if (!sah.some((v) => sama(v, u))) baru.push(u);
  }
  const catatanKunci = semuaUrutan.some((u) => sama(u, [0, 1, 2, 3])) ? [] : ['urutan kunci tidak ditemukan peninjau'];
  const catatan = [j.kewajaran, j.tingkat].filter((x) => x && x !== 'ok');
  return {
    ...dasar,
    status: j.gagal.length || masalah.length ? 'GAGAL' : (catatan.length || catatanKunci.length) ? 'CATATAN' : 'LOLOS',
    masalah: [...masalah, ...catatanKunci],
    urutanLainBaru: baru, gagal: j.gagal, kewajaran: j.kewajaran, tingkat: j.tingkat, catatan: j.catatan,
  };
}

/** Menilai seluruh jawaban sebuah putaran. `soalPerId`: Map id -> soal (kunci). Kode ganda = galat (Error). */
export function nilaiSemua(soalPerId, peta, jawaban, waktu = undefined) {
  const kode = jawaban.map((j) => j.kode);
  const ganda = kode.filter((k, i) => kode.indexOf(k) !== i);
  if (ganda.length) throw new Error(`kode ganda di jawaban.json: ${[...new Set(ganda)].join(', ')}`);
  const hasil = [];
  const dijawab = new Set();
  const cap = waktu ? { dinilai: waktu } : {};
  for (const j of jawaban) {
    const p = peta[j.kode];
    if (!p) { hasil.push({ kode: j.kode, status: 'GAGAL', masalah: ['kode tidak dikenal'], ...cap }); continue; }
    dijawab.add(j.kode);
    hasil.push({ ...nilaiSatu(soalPerId.get(p.id), p, j), ...cap });
  }
  for (const [k, p] of Object.entries(peta)) {
    if (!dijawab.has(k)) hasil.push({ kode: k, id: p.id, hash: p.hash, status: 'GAGAL', masalah: ['tidak dijawab peninjau'], ...cap });
  }
  return hasil;
}

/** Menyusun ulang kunci satu soal dari kertas buta + peta (potongan urutan kunci, bintang, baris, situasi). */
export function rekonstruksi(butaItem, p) {
  const potongan = [];
  butaItem.pilihan.forEach((x, n) => { potongan[p.urutanTampil[n]] = x.teks; });
  let bintang = -1;
  const baris = butaItem.baris.map((b) => {
    const pembicara = b.pembicara != null ? { pembicara: b.pembicara } : {};
    if (!b.kotak) return { ...pembicara, teks: b.teks };
    bintang = b.kotak.indexOf('★');
    return { ...pembicara, sebelum: b.sebelum, sesudah: b.sesudah };
  });
  return { situasi: butaItem.situasi ?? null, baris, potongan, bintang };
}

const WAJIB_BARIS = ['kode', 'id', 'hash', 'dinilai', 'status', 'masalah'];
const FILE_RONDE = ['buta.json', 'jawaban.json', 'peta-rahasia.json', 'hasil-banding.json'];
const baca = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

/** Verifikasi satu folder putaran di buku: 4 berkas lengkap, hasil dihitung ulang sama persis. Mengembalikan galat[]. */
export function verifikasiRonde(dir) {
  const nama = path.basename(dir);
  const galat = [];
  for (const f of FILE_RONDE) if (!fs.existsSync(path.join(dir, f))) galat.push(`${nama}: berkas ${f} tidak ada`);
  if (galat.length) return galat;
  let buta; let jawaban; let peta; let hasil;
  try {
    [buta, jawaban, peta, hasil] = FILE_RONDE.map((f) => baca(path.join(dir, f)));
  } catch (e) { return [`${nama}: berkas rusak (${e.message})`]; }
  if (![buta, jawaban, hasil].every(Array.isArray) || typeof peta !== 'object') return [`${nama}: bentuk berkas salah`];

  const soalPerId = new Map();
  for (const b of buta) {
    const p = peta[b.kode];
    if (!p) { galat.push(`${nama}: kode ${b.kode} di buta.json tidak ada di peta`); continue; }
    const s = rekonstruksi(b, p);
    if (!Array.isArray(p.urutanTampil) || s.potongan.length !== 4 || s.potongan.some((x) => typeof x !== 'string') || s.bintang < 0) { galat.push(`${nama}: ${b.kode} tidak bisa direkonstruksi`); continue; }
    if (hashSoal(s) !== p.hash) galat.push(`${nama}: ${b.kode} (${p.id}) sidik di peta tidak cocok dengan isi buta.json`);
    soalPerId.set(p.id, s);
  }
  for (const k of Object.keys(peta)) if (!buta.some((b) => b.kode === k)) galat.push(`${nama}: kode ${k} di peta tidak ada di buta.json`);
  if (galat.length) return galat;

  let hitung;
  try { hitung = nilaiSemua(soalPerId, peta, jawaban); } catch (e) { return [`${nama}: ${e.message}`]; }
  if (hitung.length !== hasil.length) galat.push(`${nama}: ${hasil.length} baris di hasil-banding.json, seharusnya ${hitung.length}`);
  for (const h of hasil) {
    const hilang = WAJIB_BARIS.filter((k) => h[k] === undefined || h[k] === null || h[k] === '');
    if (hilang.length) { galat.push(`${nama}: baris ${h.kode ?? '?'} kekurangan field ${hilang.join(', ')}`); continue; }
    if ((h.status === 'LOLOS' || h.status === 'CATATAN') && Array.isArray(h.gagal) && h.gagal.length) galat.push(`${nama}: ${h.id} berstatus ${h.status} tetapi gagal tidak kosong`);
    const c = hitung.find((x) => x.kode === h.kode);
    if (!c) { galat.push(`${nama}: baris ${h.kode} tidak punya jawaban`); continue; }
    for (const k of ['id', 'hash', 'status']) if (c[k] !== h[k]) galat.push(`${nama}: ${h.id} ${k} di hasil-banding.json (${h[k]}) != hitung ulang (${c[k]})`);
    if (JSON.stringify(c.masalah) !== JSON.stringify(h.masalah)) galat.push(`${nama}: ${h.id} masalah tidak sama dengan hitung ulang`);
  }
  return galat;
}

/** Semua baris penilaian di buku, urut waktu `dinilai` lalu urutan folder, dan galat verifikasi semua putaran. */
export function bacaBukuTerverifikasi(buku) {
  const baris = [];
  const galat = [];
  if (!fs.existsSync(buku)) return { baris, galat };
  for (const nama of fs.readdirSync(buku).sort()) {
    const dir = path.join(buku, nama);
    if (!fs.statSync(dir).isDirectory()) continue;
    galat.push(...verifikasiRonde(dir));
    const berkas = path.join(dir, 'hasil-banding.json');
    if (fs.existsSync(berkas)) { try { for (const b of baca(berkas)) baris.push({ ...b, putaran: nama }); } catch { /* sudah dilaporkan */ } }
  }
  const urut = baris.map((b, i) => ({ b, i })).sort((x, y) => String(x.b.dinilai || '').localeCompare(String(y.b.dinilai || '')) || x.i - y.i).map((x) => x.b);
  return { baris: urut, galat };
}

const bacaDaftar = (berkas) => (fs.existsSync(berkas) ? baca(berkas) : []);
/** Daftar keputusan --terima, persetujuan, dan pilot-pra-buku dari buku. */
export const bacaTerima = (buku) => bacaDaftar(path.join(buku, 'terima.json'));
export const bacaPilot = (buku) => bacaDaftar(path.join(buku, 'pilot-pra-buku.json'));

/**
 * Masalah bukti tinjauan sebuah soal (kosong = ada bukti sah). `ctx`: { baris (ledger), terimaBaru: Set id (CATATAN yang
 * diterima sekarang), terima: terima.json, pilot: pilot-pra-buku.json atau null }.
 */
export function masalahBukti(soal, ctx) {
  const hash = hashSoal(soal);
  const sama = ctx.baris.filter((b) => b.hash === hash);
  const gagal = sama.find((b) => b.status === 'GAGAL');
  if (gagal) return [`${soal.id}: ada penilaian GAGAL untuk isi ini (putaran ${gagal.putaran}, id ${gagal.id}); ubah isinya dan tinjau ulang`];
  const miliknya = sama.filter((b) => b.id === soal.id);
  if (miliknya.length) {
    const akhir = miliknya[miliknya.length - 1];
    if (akhir.status === 'LOLOS') return [];
    if (akhir.status === 'CATATAN') {
      if (ctx.terimaBaru?.has(soal.id) || (ctx.terima || []).some((t) => t.id === soal.id && t.hash === hash)) return [];
      return [`${soal.id}: berstatus CATATAN; cek teks lalu sebut di --terima (dengan --alasan)`];
    }
    return [`${soal.id}: status penilaian tidak dikenal: ${akhir.status}`];
  }
  if (ctx.pilot && ctx.pilot.some((x) => x.id === soal.id && x.hash === hash)) return [];
  return [`${soal.id}: tidak ada penilaian peninjau buta untuk isi ini (belum ditinjau, atau diedit sesudah ditinjau)`];
}
