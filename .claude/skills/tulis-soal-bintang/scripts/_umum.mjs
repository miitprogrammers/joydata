// Pembantu bersama skrip skill tulis-soal-bintang: jalur repo, katalog, argumen, pemuatan draf.
import fs from 'node:fs';
import path from 'node:path';
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
