// Step 2b (levels with a bunpou module only): write the kanji peserta have not studied in kana.
//   node rapikan.mjs --kerja <folder> [L1 …]
// Rewrites gen/<level>.json with the app's own sederhanakanBacaan: a kanji run with any kanji outside the kanji
// volumes becomes its reading (寮{りょう} → りょう), in the title, text, questions, options and the quotes of the
// explanations. Fields come back in bank order. Run it before gate.mjs; the gate rejects what is left.
import fs from 'fs';
import { argumen, bacaGen, bacaRencana, dirKerja, jlptRencana, kanonik, levelDipilih, muatValidator, tingkat } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const rencana = bacaRencana(kerja);
const jlpt = jlptRencana(rencana);
if (!tingkat(jlpt).modul) {
  console.log(`Bank ${jlpt} menerima kanji apa pun (volume diterapkan saat tes dibuat) — tidak ada yang dirapikan.`);
  process.exit(0);
}
const { sederhanakanBacaan, KANJI_DIPELAJARI } = await muatValidator();
let gagal = false;

for (const level of levelDipilih(arg, rencana)) {
  const gen = bacaGen(kerja, level);
  if (gen.galat || !Array.isArray(gen.data)) {
    console.log(`${level}: ${gen.file} — ${gen.galat || 'harus berisi array bacaan'}`);
    gagal = true;
    continue;
  }
  const diganti = new Map();
  const hasil = gen.data.map((b) => {
    if (!b || typeof b.judul !== 'string' || typeof b.teks !== 'string' || !Array.isArray(b.soal) || b.soal.some((s) => typeof s?.tanya !== 'string' || !Array.isArray(s.opsi))) return b;
    const rapi = sederhanakanBacaan(b, KANJI_DIPELAJARI);
    if (rapi !== b) {
      const lama = JSON.stringify([b.judul, b.teks, b.soal.map((s) => [s.tanya, s.opsi])]);
      for (const m of lama.matchAll(/([㐀-鿿々〆ヶ]+)\{([^{}]*)\}/g)) {
        if (![...m[1]].every((c) => KANJI_DIPELAJARI.has(c))) diganti.set(m[1], m[2]);
      }
    }
    return kanonik(rapi);
  });
  fs.writeFileSync(gen.file, `${JSON.stringify(hasil, null, 2)}\n`);
  console.log(`${level}: ${diganti.size ? `${diganti.size} kata ditulis dengan kana — ${[...diganti].map(([k, v]) => `${k}→${v}`).join(', ')}` : 'semua kanji sudah dari volume yang dipelajari'}`);
}
process.exit(gagal ? 1 : 0);
