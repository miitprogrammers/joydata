// Step 1: prepare the work folder.
//   node siapkan.mjs --kerja <folder> --bacaan 25 [--jlpt N4] [--level L1,L3]
//   node siapkan.mjs --kerja <folder> --jlpt N5 --revisi L5-2,L5-1 [--alasan pola]
//   node siapkan.mjs --kerja <folder> --jlpt N5 --revisi-dari <dampak-bank.json> --kategori kata,pola [--level L3]
// Writes rencana.json (the level's JLPT, which ids each level gets and, for a level with a bunpou module, which
// two patterns each new passage practises), the furigana reference taken from the banks, the titles already in
// use, recent bank passages per level as style examples, and pola-<level>.md (the module patterns of the level).
// Revision mode copies the chosen bank passages to asli/<level>.json (as they were) and gen/<level>.json (to edit);
// inject.mjs --ganti writes them back under the same ids.
import fs from 'fs';
import path from 'path';
import { TINGKAT, argumen, dirKerja, idBacaan, kanonik, muatBank, muatBunpou, muatSemuaBank, petaFurigana, polos, tingkat } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const jlpt = arg.jlpt && arg.jlpt !== true ? String(arg.jlpt).toUpperCase() : 'N5';
const cfg = tingkat(jlpt);
const modeRevisi = Boolean(arg.revisi || arg['revisi-dari']);
const jumlah = Number(arg.bacaan);
if (!modeRevisi && (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 60)) {
  console.log('Wajib: --bacaan <jumlah bacaan baru per level, 1–60> (tiap bacaan = 2 soal), atau --revisi <id,…> / --revisi-dari <json>');
  process.exit(2);
}

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

// Revision mode: which passages, and why (pola / kata / angka / mutu — from dampak-bank.json or --alasan).
if (modeRevisi) {
  rencana.mode = 'revisi';
  // --ketat: the revised passages must meet the current length ranges (no allowance for old lengths).
  if (arg.ketat) rencana.ketat = true;
  const alasan = new Map();
  // What exactly is wrong, per id and reason (words, patterns, gate messages), for the writer's brief.
  const rincian = new Map();
  if (arg.revisi && arg.revisi !== true) {
    for (const id of String(arg.revisi).split(',').map((x) => x.trim()).filter(Boolean)) {
      alasan.set(id, arg.alasan && arg.alasan !== true ? String(arg.alasan).split(',') : ['mutu']);
    }
  }
  if (arg['revisi-dari'] && arg['revisi-dari'] !== true) {
    const dampak = JSON.parse(fs.readFileSync(path.resolve(arg['revisi-dari']), 'utf8'));
    const kategori = arg.kategori && arg.kategori !== true ? String(arg.kategori).split(',') : ['pola', 'kata', 'angka'];
    for (const x of dampak[jlpt.toLowerCase()] || []) {
      const kena = kategori.filter((k) => Array.isArray(x[k]) && x[k].length);
      if (kena.length) alasan.set(x.id, [...new Set([...(alasan.get(x.id) || []), ...kena])]);
      for (const k of kena) rincian.set(x.id, { ...(rincian.get(x.id) || {}), [k]: x[k].map((v) => (typeof v === 'string' ? v : JSON.stringify(v))) });
    }
  }
  for (const l of bank) {
    if (!minta.includes(l.kode)) continue;
    const dipilih = l.bacaan.filter((b) => alasan.has(b.id)).map(kanonik);
    if (!dipilih.length) continue;
    rencana.level[l.kode] = {
      ids: dipilih.map((b) => b.id),
      jumlah: dipilih.length,
      deskripsi: l.deskripsi,
      panjang: cfg.batas[l.kode].pjg,
      kalimat: cfg.batas[l.kode].kal,
      alasan: Object.fromEntries(dipilih.map((b) => [b.id, alasan.get(b.id)])),
      rincian: Object.fromEntries(dipilih.filter((b) => rincian.has(b.id)).map((b) => [b.id, rincian.get(b.id)])),
    };
    fs.mkdirSync(path.join(kerja, 'asli'), { recursive: true });
    fs.writeFileSync(path.join(kerja, 'asli', `${l.kode}.json`), `${JSON.stringify(dipilih, null, 2)}\n`);
    fs.writeFileSync(path.join(kerja, 'gen', `${l.kode}.json`), `${JSON.stringify(dipilih, null, 2)}\n`);
    const contoh = l.bacaan.filter((b) => !alasan.has(b.id)).slice(-10);
    fs.writeFileSync(path.join(kerja, `contoh-${l.kode}.json`), JSON.stringify(contoh, null, 2));
  }
  const tidakAda = [...alasan.keys()].filter((id) => !Object.values(rencana.level).some((r) => r.ids.includes(id)));
  if (tidakAda.length) console.log(`PERINGATAN: id tidak ada di bank ${jlpt} (atau levelnya tidak diminta): ${tidakAda.join(', ')}`);
}

// A bank that is still empty has no style of its own yet: the N5 passages of the same level show the data shape
// and the kind of question, not the grammar.
const bankContoh = jlpt === 'N5' ? bank : await muatBank('N5');
for (const l of modeRevisi ? [] : bank) {
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

console.log(`Folder kerja: ${kerja} (pola kalimat ${jlpt}${modeRevisi ? ', MODE REVISI' : ''})`);
for (const [kode, r] of Object.entries(rencana.level)) {
  if (modeRevisi) {
    const per = {};
    for (const a of Object.values(r.alasan).flat()) per[a] = (per[a] || 0) + 1;
    console.log(`  ${kode} (${r.deskripsi}): ${r.jumlah} bacaan direvisi (${Object.entries(per).map(([k, n]) => `${k} ${n}`).join(', ')}) → asli/${kode}.json, gen/${kode}.json`);
    continue;
  }
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
