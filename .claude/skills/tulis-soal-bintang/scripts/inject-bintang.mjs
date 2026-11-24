// Memasukkan soal bintang yang SUDAH lolos gate dan peninjau buta ke server/domain/bankSoal/bintang<N5|N4>.js.
// Pakai: node inject-bintang.mjs <draf.json> --tingkat N5 --tinjauan <tinjauan.json> [--ganti] [--uji]
//   tinjauan.json: [{ "id": "N5-wa-desu-1", "status": "LOLOS" }, ...]
//   Tanpa --ganti: id yang sudah ada di bank ditolak. Dengan --ganti: hanya id yang sudah ada diganti.
//   --uji: periksa saja, jangan menulis berkas.
// Menolak SELURUH batch bila ada soal yang tidak berstatus LOLOS di tinjauan atau gagal validator.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { AKAR, SB, katalog, bacaArgumen, bacaJson, tingkatSah, kelompokTingkat, urutSoal } from './_umum.mjs';

const { _: [berkas], opsi } = bacaArgumen(process.argv.slice(2), ['ganti', 'uji']);
if (!berkas || !opsi.tinjauan) { console.error('Pakai: node inject-bintang.mjs <draf.json> --tingkat N5|N4 --tinjauan <tinjauan.json> [--ganti] [--uji]'); process.exit(2); }
const jlpt = tingkatSah(opsi.tingkat);
const draf = bacaJson(berkas);
const tinjauan = new Map(bacaJson(opsi.tinjauan).map((t) => [t.id, t.status]));
const berkasBank = path.join(AKAR, `server/domain/bankSoal/bintang${jlpt}.js`);
const namaEkspor = `SOAL_BINTANG_${jlpt}`;
const bankLama = (await import(pathToFileURL(berkasBank).href))[namaEkspor];
const idLama = new Set(bankLama.map((s) => s.id));

const tolak = [];
const idDraf = new Set();
for (const s of draf) {
  if (idDraf.has(s.id)) tolak.push(`${s.id}: id kembar di draf`);
  idDraf.add(s.id);
  if (tinjauan.get(s.id) !== 'LOLOS') tolak.push(`${s.id}: tidak berstatus LOLOS di tinjauan (${tinjauan.get(s.id) ?? 'tidak terdaftar'})`);
  if (opsi.ganti && !idLama.has(s.id)) tolak.push(`${s.id}: --ganti hanya untuk id yang sudah ada di bank`);
  if (!opsi.ganti && idLama.has(s.id)) tolak.push(`${s.id}: sudah ada di bank (pakai --ganti untuk menggantinya)`);
  for (const m of SB.validasiSoalBintang(s, { katalog, jlpt })) tolak.push(`${s.id}: ${m}`);
}
const bankBaru = [...bankLama.filter((s) => !(opsi.ganti && idDraf.has(s.id))), ...draf].sort(urutSoal);
if (!tolak.length) tolak.push(...SB.validasiBankBintang(bankBaru, { katalog, jlpt, kelompok: kelompokTingkat(jlpt) }));
if (tolak.length) {
  console.error(`DITOLAK, tidak ada yang ditulis (${tolak.length} masalah):\n${[...new Set(tolak)].join('\n')}`);
  process.exit(1);
}

const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
const nilai = (v) => {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string') return q(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return `[${v.map(nilai).join(', ')}]`;
  return `{ ${Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => `${k}: ${nilai(x)}`).join(', ')} }`;
};
const URUTAN_KUNCI = ['id', 'pola', 'situasi', 'baris', 'potongan', 'bintang', 'urutanLain', 'terjemahan', 'pembahasan', 'status'];
const tulisSoal = (s) => {
  const kunci = [...URUTAN_KUNCI, ...Object.keys(s).filter((k) => !URUTAN_KUNCI.includes(k))].filter((k) => s[k] !== undefined);
  const baris = kunci.map((k) => {
    if (k === 'baris') return `    baris: [\n${s.baris.map((b) => `      ${nilai(b)},`).join('\n')}\n    ],`;
    return `    ${k}: ${nilai(s[k])},`;
  });
  return `  {\n${baris.join('\n')}\n  },`;
};

const lama = fs.readFileSync(berkasBank, 'utf8');
const kepala = lama.split('\n').filter((l, i, a) => l.startsWith('//') && a.slice(0, i).every((x) => x.startsWith('//'))).join('\n');
const isi = `${kepala}\nexport const ${namaEkspor} = [\n${bankBaru.map(tulisSoal).join('\n')}\n];\n`;
if (opsi.uji) { console.log(`lolos: ${draf.length} soal akan ${opsi.ganti ? 'diganti' : 'ditambah'}; bank jadi ${bankBaru.length}`); process.exit(0); }
fs.writeFileSync(berkasBank, isi);
console.log(`${draf.length} soal ${opsi.ganti ? 'diganti' : 'ditambah'}; ${namaEkspor} sekarang ${bankBaru.length} soal. Jalankan npm test.`);
