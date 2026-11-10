// Step 3: blind copies for the independent reviewers.
//   node buta.mjs --kerja <folder> [L1 …]     → blind/<level>.json + blind/<level>-audit.json
//   node buta.mjs --kerja <folder> --ulang    → blind/ulang.json + blind/ulang-audit.json: only the passages
//                                               that have no review of their current text (new or edited)
//   node buta.mjs --kerja <folder> --ulang --id L2-31,L4-40   also sends these to a second reviewer (use it
//                                               when a reviewer's blind answer looks like the reviewer's mistake)
// <level>.json holds what a peserta sees (no key, no translation). <level>-audit.json holds the Indonesian
// parts, opened by the reviewer only after their answers are on disk. <level>-furigana-baru.json lists the
// readings the bank never used, so a reviewer needs nothing outside blind/ (gate/ and gen/ stay closed to them).
import fs from 'fs';
import path from 'path';
import { argumen, bacaRencana, dirKerja, levelDipilih, periksaGate, periksaTinjauan, sidik } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const rencana = bacaRencana(kerja);

const buta = (b) => ({ id: b.id, sidik: sidik(b), judul: b.judul, teks: b.teks, soal: b.soal.map((s) => ({ id: s.id, tanya: s.tanya, opsi: s.opsi })) });
const audit = (b) => ({
  id: b.id,
  sidik: sidik(b),
  terjemahan: b.terjemahan,
  soal: b.soal.map((s) => ({ id: s.id, tanyaId: s.tanyaId, pembahasan: s.pembahasan })),
});
const tulis = (nama, daftar, furiganaBaru) => {
  const ids = new Set(daftar.map((b) => b.id));
  const baru = furiganaBaru.map((f) => ({ ...f, di: f.di.filter((id) => ids.has(id)) })).filter((f) => f.di.length);
  fs.writeFileSync(path.join(kerja, 'blind', `${nama}.json`), JSON.stringify(daftar.map(buta), null, 2));
  fs.writeFileSync(path.join(kerja, 'blind', `${nama}-audit.json`), JSON.stringify(daftar.map(audit), null, 2));
  fs.writeFileSync(path.join(kerja, 'blind', `${nama}-furigana-baru.json`), JSON.stringify(baru, null, 2));
};

const paksa = new Set(arg.id && arg.id !== true ? String(arg.id).split(',').map((x) => x.trim()) : []);
const ulang = [];
const furiganaUlang = [];
for (const level of levelDipilih(arg, rencana)) {
  const g = await periksaGate(kerja, level, rencana);
  if (g.error.length) {
    console.log(`${level}: gate mekanis belum lolos (${g.error.length} error) — perbaiki dulu, peninjau tidak membaca naskah yang masih salah format.`);
    process.exit(1);
  }
  if (arg.ulang) {
    const belum = new Set(periksaTinjauan(kerja, level, g.daftar).hasil.filter((h) => h.status === 'BELUM').map((h) => h.id));
    ulang.push(...g.daftar.filter((b) => belum.has(b.id) || paksa.has(b.id)));
    furiganaUlang.push(...g.furiganaBaru);
  } else {
    tulis(level, g.daftar, g.furiganaBaru);
    console.log(`${level}: ${g.daftar.length} bacaan → blind/${level}.json (+ blind/${level}-audit.json)`);
  }
}
if (arg.ulang) {
  if (!ulang.length) {
    console.log('Tidak ada bacaan yang menunggu tinjauan.');
  } else {
    tulis('ulang', ulang, furiganaUlang);
    console.log(`${ulang.length} bacaan menunggu tinjauan → blind/ulang.json (+ blind/ulang-audit.json): ${ulang.map((b) => b.id).join(', ')}`);
    console.log('Minta peninjau BARU menulis hasilnya ke review/ulang-<n>.json (nama file baru tiap putaran).');
  }
}
