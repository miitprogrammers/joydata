// Step 5: write the new passages into the bank file of the plan's JLPT (dokkaiN5.js, dokkaiN4.js, dokkaiN3.js) —
// only when both gates pass.
//   node inject.mjs --kerja <folder> --uji     dry run: re-checks everything, writes nothing
//   node inject.mjs --kerja <folder>           writes the bank file
// It re-runs gate 1 and gate 2 itself, so a passage edited after its review can never slip in.
// A work folder made with siapkan.mjs --revisi replaces passages under the same ids instead of adding (mode ganti).
// A revision that only turned kanji numerals into Arabic ones (konversi-angka.mjs) needs no blind review when
// everything else is identical to the original; every other change does.
import fs from 'fs';
import path from 'path';
import {
  ROOT,
  argumen,
  bacaAsli,
  bacaRencana,
  dirKerja,
  fileBank,
  jlptRencana,
  kanonik,
  muatBank,
  periksaGate,
  periksaTinjauan,
  perluTinjauan,
  polos,
  tingkat,
} from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const rencana = bacaRencana(kerja);
const levels = Object.keys(rencana.level);
const jlpt = jlptRencana(rencana);
const FILE_BANK = fileBank(jlpt);
const namaFile = path.basename(FILE_BANK);
const revisi = rencana.mode === 'revisi';

const bankLama = await muatBank(jlpt);
const masalah = [];
const baru = {};
for (const level of levels) {
  const rc = rencana.level[level];
  if (!revisi) {
    const ada = bankLama.find((l) => l.kode === level)?.bacaan.length ?? -1;
    if (ada !== rc.mulai - 1) {
      masalah.push(`${level}: bank berisi ${ada} bacaan, rencana dibuat saat ${rc.mulai - 1} — bank sudah berubah (atau sudah di-inject); buat folder kerja baru dengan siapkan.mjs`);
      continue;
    }
  } else {
    const idBank = new Set((bankLama.find((l) => l.kode === level)?.bacaan || []).map((b) => b.id));
    const hilang = rc.ids.filter((id) => !idBank.has(id));
    if (hilang.length) {
      masalah.push(`${level}: id tidak ada lagi di bank: ${hilang.join(', ')}`);
      continue;
    }
  }
  const g = await periksaGate(kerja, level, rencana);
  if (g.error.length) {
    masalah.push(`${level}: gate mekanis gagal (${g.error.length} error) — node gate.mjs --kerja … ${level}`);
    continue;
  }
  // Numbers-only revisions skip the blind review; everything else needs it.
  const butuhTinjauan = perluTinjauan(kerja, level, rencana, g.daftar);
  const t = periksaTinjauan(kerja, level, butuhTinjauan);
  const tahan = t.hasil.filter((h) => h.status !== 'LOLOS');
  if (tahan.length) {
    masalah.push(`${level}: ${tahan.length} bacaan belum lolos tinjauan (${tahan.map((h) => `${h.id} ${h.status}`).join(', ')}) — node banding.mjs --kerja …`);
    continue;
  }
  if (revisi && butuhTinjauan.length < g.daftar.length) {
    console.log(`${level}: ${g.daftar.length - butuhTinjauan.length} bacaan hanya berubah angka (tanpa tinjauan buta), ${butuhTinjauan.length} lolos tinjauan.`);
  }
  baru[level] = g.daftar.map(kanonik);
}
if (masalah.length) {
  console.log('INJECT DITOLAK — gate belum lolos:');
  for (const m of masalah) console.log(`  - ${m}`);
  process.exit(1);
}

// Same hand-written style as the rest of the file: single quotes, one question per line.
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n')}'`;
const tulisBacaan = (b) =>
  [
    '      {',
    `        id: ${q(b.id)},`,
    `        judul: ${q(b.judul)},`,
    ...(b.bunpou ? [`        bunpou: [${b.bunpou.join(', ')}],`] : []),
    `        teks: ${q(b.teks)},`,
    `        terjemahan: ${q(b.terjemahan)},`,
    '        soal: [',
    ...b.soal.map(
      (s) =>
        `          { id: ${q(s.id)}, tanya: ${q(s.tanya)}, tanyaId: ${q(s.tanyaId)}, opsi: [${s.opsi.map(q).join(', ')}], benar: ${s.benar}, pembahasan: ${q(s.pembahasan)} },`,
    ),
    '        ],',
    '      },',
  ].join('\n');

const asliFile = fs.readFileSync(FILE_BANK, 'utf8');
const eol = asliFile.includes('\r\n') ? '\r\n' : '\n';
let teks = asliFile.replace(/\r\n/g, '\n');

if (!revisi) {
  for (const level of levels) {
    const awal = teks.indexOf(`    kode: '${level}',`);
    if (awal < 0) {
      console.log(`INJECT DITOLAK — blok level ${level} tidak ditemukan di ${FILE_BANK}`);
      process.exit(1);
    }
    // The level block ends at the first "    ],\n  }," after its header: passages are indented deeper than that.
    const tutup = teks.indexOf('\n    ],\n  },', awal);
    // …and holds passages up to there, or nothing yet (a bank that is being filled for the first time).
    const blokLevel = tutup < 0 ? '' : teks.slice(awal, tutup);
    if (!blokLevel.endsWith('      },') && !blokLevel.endsWith('\n    bacaan: [')) {
      console.log(`INJECT DITOLAK — akhir blok ${level} tidak berbentuk seperti yang diharapkan; sisipkan manual atau perbaiki skrip.`);
      process.exit(1);
    }
    teks = `${teks.slice(0, tutup)}\n${baru[level].map(tulisBacaan).join('\n')}${teks.slice(tutup)}`;
  }
} else {
  // Replace each passage block in place: from "      {" before its id line to the "      }," that closes it.
  for (const level of levels) {
    for (const b of baru[level]) {
      const baris = `\n        id: ${q(b.id)},`;
      const posId = teks.indexOf(baris);
      if (posId < 0 || teks.indexOf(baris, posId + 1) >= 0) {
        console.log(`INJECT DITOLAK — blok ${b.id} tidak ditemukan tepat satu kali di ${namaFile}`);
        process.exit(1);
      }
      const awal = teks.lastIndexOf('\n      {', posId);
      const akhir = teks.indexOf('\n      },', posId);
      if (awal < 0 || akhir < 0) {
        console.log(`INJECT DITOLAK — batas blok ${b.id} tidak dikenali`);
        process.exit(1);
      }
      teks = `${teks.slice(0, awal + 1)}${tulisBacaan(b)}${teks.slice(akhir + '\n      },'.length)}`;
    }
  }
}
const hasil = teks.replace(/\n/g, eol);

const hitung = (bank) => ({
  perLevel: Object.fromEntries(bank.map((l) => [l.kode, l.bacaan.length])),
  bacaan: bank.reduce((n, l) => n + l.bacaan.length, 0),
  soal: bank.reduce((n, l) => n + l.bacaan.reduce((m, b) => m + b.soal.length, 0), 0),
});
const jumlahBaru = levels.reduce((n, l) => n + baru[l].length, 0);

if (arg.uji) {
  const lama = hitung(bankLama);
  console.log(`UJI (tidak menulis apa pun): kedua gate lolos untuk ${levels.join(', ')}.`);
  if (revisi) console.log(`Akan mengganti ${jumlahBaru} bacaan dengan id yang sama; total tetap ${lama.bacaan} bacaan / ${lama.soal} soal.`);
  else console.log(`Akan menambah ${jumlahBaru} bacaan / ${jumlahBaru * 2} soal → total ${lama.bacaan + jumlahBaru} bacaan / ${lama.soal + jumlahBaru * 2} soal.`);
  process.exit(0);
}

fs.writeFileSync(FILE_BANK, hasil);
// Read the file back as the app does; anything that differs from what was reviewed → restore the old file.
let salah = '';
try {
  const bankBaru = await muatBank(jlpt);
  for (const level of levels) {
    const lv = bankBaru.find((l) => l.kode === level);
    const lama = bankLama.find((l) => l.kode === level).bacaan;
    if (!revisi) {
      const rc = rencana.level[level];
      const ekor = lv.bacaan.slice(rc.mulai - 1);
      if (JSON.stringify(ekor.map(kanonik)) !== JSON.stringify(baru[level])) salah = `${level}: isi yang tertulis berbeda dari naskah yang ditinjau`;
      if (JSON.stringify(lv.bacaan.slice(0, rc.mulai - 1)) !== JSON.stringify(lama)) salah = `${level}: bacaan lama ikut berubah`;
    } else {
      const ganti = new Map(baru[level].map((b) => [b.id, b]));
      if (lv.bacaan.length !== lama.length) salah = `${level}: jumlah bacaan berubah`;
      lv.bacaan.forEach((b, i) => {
        if (b.id !== lama[i].id) salah = `${level}: urutan id berubah di posisi ${i + 1}`;
        else if (ganti.has(b.id)) {
          if (JSON.stringify(kanonik(b)) !== JSON.stringify(ganti.get(b.id))) salah = `${b.id}: isi yang tertulis berbeda dari naskah yang ditinjau`;
        } else if (JSON.stringify(b) !== JSON.stringify(lama[i])) salah = `${b.id}: bacaan yang tidak direvisi ikut berubah`;
      });
    }
  }
  if (!salah) {
    const h = hitung(bankBaru);
    if (revisi) {
      // Per passage: why it was revised, whether it went through the blind review, and every question whose key moved
      // (another index, or another right answer; the way its numbers are written does not count).
      const lipat = (t) => polos(t).replace(/[0-9一二三四五六七八九十百千万]+/g, '#');
      const ringkas = levels.flatMap((level) => {
        const asli = bacaAsli(kerja, level);
        const ditinjau = new Set(perluTinjauan(kerja, level, rencana, baru[level]).map((b) => b.id));
        return baru[level].map((b) => {
          const lama = asli.get(b.id);
          const kunci = b.soal
            .map((s, i) => [s, lama?.soal[i]])
            .filter(([s, l]) => l && (s.benar !== l.benar || lipat(s.opsi[s.benar]) !== lipat(l.opsi[l.benar])))
            .map(([s, l]) => (s.benar !== l.benar ? `${s.id} ${l.benar}→${s.benar}` : `${s.id} jawaban ditulis ulang`));
          const alasan = (rencana.level[level].alasan?.[b.id] || []).join(', ');
          return `- ${b.id}: ${alasan}${ditinjau.has(b.id) ? ' · ditinjau buta' : ' · angka saja'}${kunci.length ? ` · kunci berubah: ${kunci.join(', ')}` : ''}`;
        });
      });
      fs.writeFileSync(path.join(kerja, 'ringkasan-revisi.md'), `# Ringkasan revisi ${jlpt} (${new Date().toISOString()})\n\n${ringkas.join('\n')}\n`);
      console.log(`INJECT SELESAI (ganti): ${jumlahBaru} bacaan diganti dengan id yang sama → ${path.relative(ROOT, FILE_BANK)}`);
    } else {
      console.log(`INJECT SELESAI: +${jumlahBaru} bacaan / +${jumlahBaru * 2} soal → ${path.relative(ROOT, FILE_BANK)}`);
    }
    console.log(`Bank sekarang: ${h.bacaan} bacaan / ${h.soal} soal (${Object.entries(h.perLevel).map(([k, n]) => `${k} ${n}`).join(', ')}).`);
    console.log('Lanjutkan:');
    if (!revisi) console.log(`  1. Perbarui komentar kepala ${namaFile} (jumlah bacaan per level).`);
    console.log(`  ${revisi ? 1 : 2}. npm test${revisi ? ' (angka bank tidak berubah)' : ` — tes yang gagal menunjukkan angka lama ${jlpt} di server/domain/tesOnline.test.js: jumlah per level, total ${h.bacaan} bacaan, ${h.soal} soal, perJlpt, dan pool "bank + 1 bacaan AI" (jumlah per level + 1)${tingkat(jlpt).modul ? '; server/domain/bunpou.test.js memeriksa tag pola dan cakupan modul' : ''}`}.`);
  }
} catch (e) {
  salah = `file bank tidak bisa dimuat: ${e.message}`;
}
if (salah) {
  fs.writeFileSync(FILE_BANK, asliFile);
  console.log(`INJECT DIBATALKAN, file bank dikembalikan seperti semula — ${salah}`);
  process.exit(1);
}
