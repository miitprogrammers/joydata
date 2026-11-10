// Step 1: prepare the work folder.
//   node siapkan.mjs --kerja <folder> --bacaan 25 [--jlpt N4] [--level L1,L3]
// Writes rencana.json (the level's JLPT, which ids each level gets and, for a level with a bunpou module, which
// two patterns each new passage practises), the furigana reference taken from the banks, the titles already in
// use, recent bank passages per level as style examples, and pola-<level>.md (the module patterns of the level).
import fs from 'fs';
import path from 'path';
import { TINGKAT, argumen, dirKerja, idBacaan, muatBank, muatBunpou, muatSemuaBank, petaFurigana, polos, tingkat } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const jumlah = Number(arg.bacaan);
if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 60) {
  console.log('Wajib: --bacaan <jumlah bacaan baru per level, 1–60> (tiap bacaan = 2 soal)');
  process.exit(2);
}
const jlpt = arg.jlpt && arg.jlpt !== true ? String(arg.jlpt).toUpperCase() : 'N5';
const cfg = tingkat(jlpt);

const bank = await muatBank(jlpt);
const semuaKode = bank.map((l) => l.kode);
const minta = arg.level && arg.level !== true ? String(arg.level).split(',').map((x) => x.trim().toUpperCase()) : semuaKode;
const asing = minta.filter((l) => !semuaKode.includes(l) || !cfg.batas[l]);
if (asing.length) {
  console.log(`Level tidak dikenal: ${asing.join(', ')} (ada: ${semuaKode.join(', ')})`);
  process.exit(2);
}

const fileRencana = path.join(kerja, 'rencana.json');
if (fs.existsSync(fileRencana) && !arg.timpa) {
  console.log(`${fileRencana} sudah ada. Pakai folder kerja baru, atau tambahkan --timpa bila memang mau mulai ulang.`);
  process.exit(2);
}
for (const d of ['gen', 'blind', 'review', 'gate']) fs.mkdirSync(path.join(kerja, d), { recursive: true });

const bunpou = cfg.modul ? await muatBunpou() : null;

/**
 * Two patterns of the level per new passage, so the whole level's list gets practised evenly: the patterns the
 * bank has used least come first, then the list is walked again with a different stride each round, which pairs
 * every pattern with new neighbours instead of repeating the same couples.
 */
function bagiPola(level, sudahAda) {
  const fokus = bunpou.polaBunpouLevel(jlpt, level).fokus.map((p) => p.nomor);
  const pakai = new Map(fokus.map((n) => [n, 0]));
  for (const b of sudahAda) for (const n of b.bunpou || []) if (pakai.has(n)) pakai.set(n, pakai.get(n) + 1);
  const urut = [...fokus].sort((a, b) => pakai.get(a) - pakai.get(b));
  const n = urut.length;
  const fpb = (a, b) => (b ? fpb(b, a % b) : a);
  const langkah = [1, 7, 3, 5, 11, 13, 17, 19].filter((s) => fpb(s, n) === 1);
  const deret = [];
  for (let putaran = 0; deret.length < jumlah * 2; putaran++) {
    const s = langkah[putaran % langkah.length];
    for (let i = 0; i < n; i++) deret.push(urut[(i * s + putaran) % n]);
  }
  const pasangan = [];
  const kunci = new Set();
  for (let i = 0; pasangan.length < jumlah; i += 2) {
    let [a, b] = [deret[i], deret[i + 1]];
    // A seam between two rounds can pair a pattern with itself, or repeat a couple: take the next free pattern.
    for (let geser = 1; a === b || kunci.has([a, b].sort((x, y) => x - y).join()); geser++) {
      if (geser > n) break;
      b = urut[(urut.indexOf(b) + 1) % n];
    }
    kunci.add([a, b].sort((x, y) => x - y).join());
    pasangan.push([a, b].sort((x, y) => x - y));
  }
  return pasangan;
}

const tulisPola = (level, rc) => {
  const { fokus, boleh, nanti } = bunpou.polaBunpouLevel(jlpt, level);
  const singkat = (p) => `- ${p.nomor} · ${p.pola} — ${p.arti}`;
  const isi = [
    `# Pola bunpou ${jlpt} — ${level} (${rc.deskripsi})`,
    '',
    `Sumber: ${bunpou.MODUL_BUNPOU[jlpt].sumber}. Nomor = nomor pola di modul; nomor itulah yang ditulis di field \`bunpou\`.`,
    '',
    '## Pembagian pola per bacaan',
    '',
    'Tiap bacaan wajib benar-benar memakai dua pola ini (boleh menambah pola lain dari level ini atau level sebelumnya, paling banyak empat nomor di `bunpou`).',
    '',
    ...rc.pola.map((p, i) => `- ${idBacaan(jlpt, level, rc.mulai + i)}: ${p.map((n) => `${n} (${bunpou.cariPolaBunpou(jlpt, n).pola})`).join(' + ')}`),
    '',
    '## Pola fokus level ini',
    '',
    ...fokus.flatMap((p) => [
      `### ${p.nomor} · ${p.pola} — ${p.arti}`,
      '',
      p.penjelasan,
      '',
      `Rumus: ${p.rumus.join(' ／ ')}`,
      '',
      ...p.contoh.map((c) => `Contoh: ${c.jp} — ${c.id}`),
      '',
    ]),
    '## Pola level sebelumnya (sudah dikenal — boleh dipakai sebagai pendukung)',
    '',
    ...(boleh.length ? boleh.map(singkat) : ['- (tidak ada: ini level pertama)']),
    '',
    '## Pola level berikutnya (JANGAN dipakai di level ini)',
    '',
    ...(nanti.length ? nanti.map(singkat) : ['- (tidak ada: ini level terakhir)']),
    '',
  ];
  fs.writeFileSync(path.join(kerja, `pola-${level}.md`), isi.join('\n'));
};

const rencana = { dibuat: new Date().toISOString(), jlpt, soalPerBacaan: 2, level: {} };
// A bank that is still empty has no style of its own yet: the N5 passages of the same level show the data shape
// and the kind of question, not the grammar.
const bankContoh = jlpt === 'N5' ? bank : await muatBank('N5');
for (const l of bank) {
  if (!minta.includes(l.kode)) continue;
  const rc = {
    mulai: l.bacaan.length + 1,
    jumlah,
    deskripsi: l.deskripsi,
    panjang: cfg.batas[l.kode].pjg,
    kalimat: cfg.batas[l.kode].kal,
    ...(cfg.modul ? { pola: bagiPola(l.kode, l.bacaan) } : {}),
  };
  rencana.level[l.kode] = rc;
  const contoh = l.bacaan.length ? l.bacaan.slice(-10) : (bankContoh.find((x) => x.kode === l.kode)?.bacaan || []).slice(-5);
  fs.writeFileSync(path.join(kerja, `contoh-${l.kode}.json`), JSON.stringify(contoh, null, 2));
  if (cfg.modul) tulisPola(l.kode, rc);
}
fs.writeFileSync(fileRencana, JSON.stringify(rencana, null, 2));

// Readings from every bank, and from the module's example sentences when there is one.
const sumberBaca = (await muatSemuaBank()).flatMap((l) => l.bacaan);
if (cfg.modul) for (const p of bunpou.polaBunpou(jlpt)) for (const c of p.contoh) sumberBaca.push({ judul: '', teks: c.jp, soal: [] });
const peta = petaFurigana(sumberBaca);
const baris = [...peta].sort((a, b) => a[0].localeCompare(b[0], 'ja')).map(([kata, set]) => `${kata}\t${[...set].join(' / ')}`);
fs.writeFileSync(
  path.join(kerja, 'referensi-furigana.txt'),
  `# Cara baca yang sudah dipakai bank (kata<TAB>bacaan). Pakai bacaan yang sama untuk kata yang sama.\n${baris.join('\n')}\n`,
);
const judul = [];
for (const j of Object.keys(TINGKAT)) {
  for (const l of await muatBank(j)) {
    if (l.bacaan.length) judul.push(`## ${j} ${l.kode} — ${l.deskripsi}\n${l.bacaan.map((b) => `${b.id}\t${polos(b.judul)}`).join('\n')}`);
  }
}
fs.writeFileSync(
  path.join(kerja, 'judul-terpakai.txt'),
  `# Judul bacaan yang sudah ada di bank — judul baru tidak boleh sama dengan judul ${jlpt}, topik sebaiknya tidak mengulang.\n${judul.join('\n\n')}\n`,
);

console.log(`Folder kerja: ${kerja} (pola kalimat ${jlpt})`);
for (const [kode, r] of Object.entries(rencana.level)) {
  console.log(`  ${kode} (${r.deskripsi}): ${r.jumlah} bacaan baru → ${idBacaan(jlpt, kode, r.mulai)} … ${idBacaan(jlpt, kode, r.mulai + r.jumlah - 1)} (${r.jumlah * 2} soal), ${r.panjang.join('–')} huruf, ${r.kalimat.join('–')} kalimat`);
  if (r.pola) {
    const hitung = new Map();
    for (const n of r.pola.flat()) hitung.set(n, (hitung.get(n) || 0) + 1);
    const fokus = bunpou.polaBunpouLevel(jlpt, kode).fokus;
    const belum = fokus.filter((p) => !hitung.has(p.nomor) && !bank.find((x) => x.kode === kode).bacaan.some((b) => (b.bunpou || []).includes(p.nomor)));
    console.log(`      pola: ${fokus.length} pola level ini, tiap pola dipakai ${Math.min(...fokus.map((p) => hitung.get(p.nomor) || 0))}–${Math.max(...hitung.values())} kali di bacaan baru${belum.length ? `; BELUM tercakup: ${belum.map((p) => p.nomor).join(', ')} (tambah bacaan)` : ''}`);
  }
}
console.log(`Referensi: referensi-furigana.txt (${baris.length} kata), judul-terpakai.txt, contoh-<level>.json${cfg.modul ? ', pola-<level>.md' : ''}`);
