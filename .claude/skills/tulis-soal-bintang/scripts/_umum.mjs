// Pembantu bersama skrip skill tulis-soal-bintang: jalur repo, katalog, argumen, buku tinjauan, penulisan bank.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const AKAR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
export const impor = (rel) => import(pathToFileURL(path.join(AKAR, rel)).href);

const { KATALOG_MATERI } = await impor('server/domain/materiBunpou/katalog.js');
const BA = await impor('server/domain/bunpouAdventure.js');
const SB = await impor('server/domain/soalBintang.js');
export { KATALOG_MATERI as katalog, BA, SB };

/** Argumen: posisi + --opsi nilai + --bendera. Mengembalikan { _: [...], opsi: {...} }. */
export function bacaArgumen(argv, bendera = []) {
  const hasil = { _: [], opsi: {} };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith('--')) { hasil._.push(a); continue; }
    const nama = a.slice(2);
    if (bendera.includes(nama)) hasil.opsi[nama] = true;
    else { hasil.opsi[nama] = argv[i + 1]; i += 1; }
  }
  return hasil;
}

export function tingkatSah(t) {
  if (t !== 'N5' && t !== 'N4') { console.error('--tingkat harus N5 atau N4'); process.exit(2); }
  return t;
}

export const bacaJson = (berkas) => JSON.parse(fs.readFileSync(berkas, 'utf8'));
export const tulisJson = (berkas, data) => fs.writeFileSync(berkas, JSON.stringify(data, null, 2));

/** Bab Minna sebuah pola dari katalog (bab terkecil; BAB_MODUL untuk pola modul-saja). */
export function babDariPola(idPola) {
  return BA.babPola(KATALOG_MATERI.find((e) => e.id === idPola));
}

/** Kelompok id pola per volume sebuah tingkat, untuk validasiBankBintang (sebaran ★ per volume). */
export function kelompokTingkat(tingkat) {
  return BA.VOLUME_BUNPOU.filter((v) => v.jlpt === tingkat).map((v) => BA.polaVolume(v.kode));
}

export const urutanKatalog = (idPola) => {
  const i = KATALOG_MATERI.findIndex((e) => e.id === idPola);
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
};
export const nomorId = (id) => Number(String(id).match(/-(\d+)$/)?.[1] ?? 0);
export const urutSoal = (a, b) => urutanKatalog(a.pola) - urutanKatalog(b.pola) || nomorId(a.id) - nomorId(b.id);

/** Sidik isi yang ditinjau (situasi, baris, potongan, bintang). Berubah bila soal diedit setelah tinjauan. */
export function hashSoal(s) {
  const isi = JSON.stringify({ situasi: s.situasi ?? null, baris: s.baris, potongan: s.potongan, bintang: s.bintang });
  return crypto.createHash('sha256').update(isi).digest('hex').slice(0, 16);
}

/** Folder rahasia bawaan: saudara folder peninjau bernama `rahasia/` (di luar yang diberikan ke peninjau). */
export const rahasiaBawaan = (keluar) => path.join(path.dirname(path.resolve(keluar)), 'rahasia');

// ---------- Jalur kerja, buku tinjauan, dan penulisan bank ----------
export const BUKU_BAWAAN = path.join(AKAR, 'docs/bunpou-adventure/tinjauan');
export const KUNCI_SOAL = ['id', 'pola', 'situasi', 'baris', 'potongan', 'bintang', 'urutanLain', 'terjemahan', 'pembahasan', 'status'];
export const KUNCI_BARIS = ['pembicara', 'teks', 'sebelum', 'sesudah'];

const dalam = (induk, anak) => {
  const r = path.relative(induk, anak);
  return r !== '' && !r.startsWith('..') && !path.isAbsolute(r);
};
/** Apakah jalur (yang sudah ada, atau induknya) berada di bawah os.tmpdir()? */
export function dalamTmp(jalur) {
  const nyata = (p) => { try { return fs.realpathSync(p); } catch { return path.resolve(p); } };
  const abs = path.resolve(jalur);
  const ada = fs.existsSync(abs) ? abs : path.dirname(abs);
  return [os.tmpdir(), nyata(os.tmpdir())].some((t) => dalam(t, nyata(ada)) || dalam(t, abs));
}

/**
 * Jalur bank dan buku tinjauan. `--bank` dan `--buku` hanya untuk tes: harus di bawah os.tmpdir(), dan `--buku` hanya
 * boleh bersama `--bank`. Dengan bank asli, buku selalu buku di repo.
 */
export function jalurKerja(opsi, tingkat) {
  if (opsi.buku && !opsi.bank) { console.error('--buku hanya boleh bersama --bank (khusus tes); dengan bank asli buku tinjauan repo selalu dipakai'); process.exit(2); }
  const bank = opsi.bank ? path.resolve(opsi.bank) : path.join(AKAR, `server/domain/bankSoal/bintang${tingkat}.js`);
  const buku = opsi.buku ? path.resolve(opsi.buku) : BUKU_BAWAAN;
  for (const [nama, nilai] of [['--bank', opsi.bank], ['--buku', opsi.buku]]) {
    if (nilai && !dalamTmp(nilai)) { console.error(`${nama} hanya boleh di bawah ${os.tmpdir()} (khusus tes)`); process.exit(2); }
  }
  return { bank, buku };
}

export const muatBank = async (jalur, namaEkspor) => (await import(`${pathToFileURL(jalur).href}?t=${Date.now()}${Math.random()}`))[namaEkspor];

const nilai = (v) => {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(nilai).join(', ')}]`;
  return `{ ${Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => `${k}: ${nilai(x)}`).join(', ')} }`;
};
const tulisSoal = (s) => {
  const baris = KUNCI_SOAL.filter((k) => s[k] !== undefined).map((k) => {
    if (k === 'baris') return `    baris: [\n${s.baris.map((b) => `      ${nilai(b)},`).join('\n')}\n    ],`;
    return `    ${k}: ${nilai(s[k])},`;
  });
  return `  {\n${baris.join('\n')}\n  },`;
};

/**
 * Menyiapkan bank baru: menulis `${bank}.tmp-${pid}.mjs`, mengimpor ulang, membandingkan dengan bank yang dimaksud.
 * Mengembalikan { galat } atau { sementara, berkasBank }; panggil `terapkanBank` untuk mengganti nama, atau `buangBank`.
 */
export async function siapkanBank(berkasBank, namaEkspor, bank) {
  const teksLama = fs.readFileSync(berkasBank, 'utf8');
  const kepala = teksLama.split('\n').filter((l, i, a) => l.startsWith('//') && a.slice(0, i).every((x) => x.startsWith('//'))).join('\n');
  const isi = `${kepala}\nexport const ${namaEkspor} = [\n${bank.map(tulisSoal).join('\n')}\n];\n`;
  const sementara = `${berkasBank}.tmp-${process.pid}.mjs`;
  fs.writeFileSync(sementara, isi);
  try {
    const terbaca = await muatBank(sementara, namaEkspor);
    if (!isDeepStrictEqual(JSON.parse(JSON.stringify(terbaca)), JSON.parse(JSON.stringify(bank)))) throw new Error('isi berkas sementara tidak sama dengan bank yang dimaksud');
    return { sementara, berkasBank };
  } catch (e) {
    fs.rmSync(sementara, { force: true });
    return { galat: e.message };
  }
}
export const terapkanBank = (h) => fs.renameSync(h.sementara, h.berkasBank);
export const buangBank = (h) => { if (h?.sementara) fs.rmSync(h.sementara, { force: true }); };

/** Menulis bank lewat berkas sementara lalu mengganti nama. Mengembalikan null bila berhasil, atau pesan galat. */
export async function tulisBankAman(berkasBank, namaEkspor, bank) {
  const h = await siapkanBank(berkasBank, namaEkspor, bank);
  if (h.galat) return h.galat;
  terapkanBank(h);
  return null;
}
