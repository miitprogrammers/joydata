// Shared logic of the generate-soal skill: the work plan, the mechanical gate, and the review verdict.
// The CLIs (siapkan, gate, buta, banding, inject) are thin wrappers around these functions, so inject can
// re-run both gates itself instead of trusting an earlier run.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const DIR_SKRIP = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(DIR_SKRIP, '../../../..');

// What differs per sentence-pattern level (JLPT): the bank file and its export, the id prefix (N5 ids are L1-21,
// N4 ids N4L1-21), and the size of a passage per level (characters without furigana, sentences).
// modul = the level has a bunpou module (server/domain/bunpou.js): every passage then carries `bunpou`, the module
// numbers it practises, and keeps only the kanji peserta study (other words in kana) — a paper with the default
// kanji setting shows bank passages as written, without furigana, so an unstudied kanji would be unreadable.
export const TINGKAT = {
  N5: {
    file: 'server/domain/bankSoal/dokkaiN5.js',
    ekspor: 'DOKKAI_LEVEL',
    awalan: '',
    modul: false,
    batas: {
      L1: { pjg: [30, 58], kal: [3, 4] },
      L2: { pjg: [45, 85], kal: [3, 4] },
      L3: { pjg: [50, 95], kal: [3, 5] },
      L4: { pjg: [60, 115], kal: [4, 6] },
      L5: { pjg: [90, 165], kal: [5, 8] },
    },
  },
  N4: {
    file: 'server/domain/bankSoal/dokkaiN4.js',
    ekspor: 'DOKKAI_N4_LEVEL',
    awalan: 'N4',
    modul: true,
    batas: {
      L1: { pjg: [45, 90], kal: [3, 5] },
      L2: { pjg: [65, 130], kal: [4, 6] },
      L3: { pjg: [75, 145], kal: [4, 7] },
      L4: { pjg: [90, 175], kal: [5, 8] },
      L5: { pjg: [135, 250], kal: [6, 10] },
    },
  },
};
export function tingkat(jlpt) {
  const t = TINGKAT[jlpt];
  if (!t) {
    console.log(`Tingkat ${jlpt} belum punya bank dokkai (ada: ${Object.keys(TINGKAT).join(', ')}). Tambahkan dulu di TINGKAT, scripts/_umum.mjs.`);
    process.exit(2);
  }
  return t;
}
/** Work folders made before --jlpt existed are N5. */
export const jlptRencana = (rencana) => rencana.jlpt || 'N5';
export const fileBank = (jlpt) => path.join(ROOT, tingkat(jlpt).file);
export const idBacaan = (jlpt, level, n) => `${tingkat(jlpt).awalan}${level}-${n}`;

// The bank file is imported with a cache-buster so a re-run after inject sees the new content.
export async function muatBank(jlpt = 'N5') {
  const url = `${pathToFileURL(fileBank(jlpt)).href}?t=${Date.now()}`;
  return (await import(url))[tingkat(jlpt).ekspor];
}
/** Every bank, for what is language-wide: the readings already in use. */
export async function muatSemuaBank() {
  const semua = [];
  for (const jlpt of Object.keys(TINGKAT)) semua.push(...(await muatBank(jlpt)));
  return semua;
}
export async function muatValidator() {
  return import(pathToFileURL(path.join(ROOT, 'server/domain/tesOnline.js')).href);
}
export async function muatBunpou() {
  return import(pathToFileURL(path.join(ROOT, 'server/domain/bunpou.js')).href);
}

export const RUBY = /([㐀-鿿々〆ヶ]+)\{([^{}]*)\}/g;
const ADA_JEPANG = /[぀-ヿ㐀-鿿]/;
export const polos = (s) => String(s || '').replace(/\{[^}]*\}/g, '');
// How a text sounds: titles are compared by reading, so 土曜日{どようび}の… and どようびの… are the same title.
export const bunyi = (s) => String(s || '').replace(RUBY, '$2');
export const semuaTeks = (b) => [b.judul, b.teks, ...(b.soal || []).flatMap((s) => [s.tanya, ...(s.opsi || [])])];

export function argumen(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      out[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    } else out._.push(argv[i]);
  }
  return out;
}

export function dirKerja(arg) {
  if (!arg.kerja || arg.kerja === true) {
    console.log('Wajib: --kerja <folder kerja> (folder di scratchpad sesi, bukan di dalam repo)');
    process.exit(2);
  }
  return path.resolve(arg.kerja);
}

export function bacaRencana(kerja) {
  const file = path.join(kerja, 'rencana.json');
  if (!fs.existsSync(file)) {
    console.log(`Belum ada ${file}. Jalankan siapkan.mjs dulu.`);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function bacaGen(kerja, level) {
  const file = path.join(kerja, 'gen', `${level}.json`);
  if (!fs.existsSync(file)) return { file, galat: 'file belum ada' };
  try {
    return { file, data: JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')) };
  } catch (e) {
    return { file, galat: `bukan JSON yang sah: ${e.message}` };
  }
}

/**
 * Fingerprint of everything a peserta or sensei can see of a passage: a review only counts for the text it read.
 * The pattern tag counts too (the reviewer confirms those patterns are really used); a passage without a tag
 * keeps the fingerprint it always had.
 */
export function sidik(b) {
  const inti = {
    judul: b.judul,
    teks: b.teks,
    terjemahan: b.terjemahan,
    soal: (b.soal || []).map((s) => ({ tanya: s.tanya, tanyaId: s.tanyaId, opsi: s.opsi, benar: s.benar, pembahasan: s.pembahasan })),
    ...(Array.isArray(b.bunpou) ? { bunpou: b.bunpou } : {}),
  };
  return crypto.createHash('sha1').update(JSON.stringify(inti)).digest('hex').slice(0, 12);
}

/** A passage with its fields in the order the bank file writes them (bunpou only when the level has a module). */
export function kanonik(b) {
  return {
    id: b.id,
    judul: b.judul,
    ...(Array.isArray(b.bunpou) ? { bunpou: b.bunpou } : {}),
    teks: b.teks,
    terjemahan: b.terjemahan,
    soal: (b.soal || []).map((s) => ({ id: s.id, tanya: s.tanya, tanyaId: s.tanyaId, opsi: s.opsi, benar: s.benar, pembahasan: s.pembahasan })),
  };
}

function kumpulkanBaca(teks, map) {
  for (const m of String(teks).matchAll(RUBY)) {
    if (!map.has(m[1])) map.set(m[1], new Set());
    map.get(m[1]).add(m[2]);
  }
}
export function petaFurigana(daftarBacaan) {
  const map = new Map();
  for (const b of daftarBacaan) for (const t of semuaTeks(b)) kumpulkanBaca(t, map);
  return map;
}

const bigram = (s) => {
  const set = new Set();
  for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
  return set;
};
export function kemiripan(a, b) {
  const A = bigram(a);
  const B = bigram(b);
  let sama = 0;
  for (const x of A) if (B.has(x)) sama++;
  return sama / (A.size + B.size - sama || 1);
}

// Patterns above N5. A hit is a warning, not an error: the reviewer and the orchestrator decide (ので inside
// くだもので is fine, そうですか is fine).
const POLA_DI_ATAS_N5 = [
  [/なければ|なくては|ないといけ/, '～なければなりません'],
  [/ので(?!す)/, '～ので (abaikan bila bagian dari kata lain)'],
  [/[てで]しま[ういっわ]/, '～てしまう'],
  [/ように(な|し)/, '～ようになる/する'],
  [/ことができ/, '～ことができる'],
  [/つもり/, '～つもり'],
  [/そうです|そうでした/, '～そうです (boleh bila berarti "begitu")'],
  [/られ(ます|ません|ました|る|て)/, 'bentuk potensial/pasif?'],
  [/[いきしちにひみりぎじびぴっん]たら|[いきしちにひみりぎじびぴっん]だら|かったら/, '～たら'],
  [/れば|ければ/, '～ば'],
  [/かもしれ/, '～かもしれません'],
  [/はずです/, '～はずです'],
  [/ために/, '～ために'],
  [/て(あげ|くれ|もら)|で(あげ|くれ|もら)/, '～てあげる/くれる/もらう'],
  [/させ(ます|ました|て)/, 'kausatif'],
  [/いらっしゃ|おります|いたします|くださいませ/, 'keigo'],
  [/[A-Za-z０-９0-9]/, 'huruf Latin atau angka Arab (bank memakai angka kanji)'],
];

// N4 passages: patterns above N4, and module patterns that belong to a harder level (third item = the first
// level where the pattern is fine). Warnings as well: いただきます before a meal is not keigo practice.
const POLA_AWAS_N4 = [
  [/わけ(だ|です|では|には|が|に)/, '～わけ (N3)'],
  [/によって|により|による/, '～によって (N3)'],
  [/として/, '～として (N3)'],
  [/にとって/, '～にとって (N3)'],
  [/ようにし(ます|ません|ました|て|た)/, '～ようにする (N3, tidak ada di modul)'],
  [/べき/, '～べき (N3)'],
  [/うちに/, '～うちに (N3)'],
  [/たびに/, '～たびに (N3)'],
  [/おかげで|せいで/, '～おかげで／せいで (N3)'],
  [/だけでなく|ばかりでなく/, '～だけでなく (N3)'],
  [/さえ/, '～さえ (N3)'],
  [/に対して|に関して|に比べて|にたいして|にかんして|にくらべて/, '～に対して／に関して／に比べて (N3)'],
  [/させられ/, 'kausatif-pasif (N3)'],
  [/っぽい|がち|ぎみ/, '～っぽい／がち／ぎみ (N3)'],
  [/て(あげ|くれ|もら|や[りるっ])|で(あげ|くれ|もら|や[りるっ])/, '～てあげる／くれる／もらう／やる', 'L4'],
  [/させ(ます|ません|ました|て|る|ない)/, 'kausatif', 'L4'],
  [/らしい|みたい/, '～らしい／みたい', 'L4'],
  [/おります|おりました|ございま/, 'おる／でございます', 'L4'],
  [/いらっしゃ|おっしゃ|めしあが|ごらん|ぞんじ|はいけん|うかが|まいり|もうし|いたし|さしあげ|いただ[きくけい]|くださ[るっ]|くださいま|なさ[るっ]|なさいま/, 'keigo', 'L5'],
  [/[A-Za-z０-９0-9]/, 'huruf Latin atau angka Arab (bank memakai angka kanji)'],
];
const POLA_AWAS = { N5: POLA_DI_ATAS_N5, N4: POLA_AWAS_N4 };
const LEVEL_URUT = ['L1', 'L2', 'L3', 'L4', 'L5'];
const KANJI_SATU = /[㐀-鿿々]/g;
const ARTI_TAG = {
  tanpa_modul: 'tingkat ini tidak punya modul bunpou',
  bentuk: 'harus array 2–4 nomor pola yang berbeda',
  nomor: 'ada nomor yang bukan pola modul',
  level: 'ada pola dari level yang lebih sulit',
  fokus: 'harus memuat minimal dua pola dari level ini',
};

/**
 * Gate 1 (mechanical) for one level. Returns { error, peringatan, furiganaBaru, kunci, ... }.
 * error = must be fixed; peringatan = a human or the reviewer looks at it.
 */
export async function periksaGate(kerja, level, rencana = bacaRencana(kerja)) {
  const rc = rencana.level[level];
  if (!rc) return { level, error: [{ id: level, pesan: `level ${level} tidak ada di rencana.json` }], peringatan: [], furiganaBaru: [], kunci: [0, 0, 0], daftar: [] };
  const jlpt = jlptRencana(rencana);
  const cfg = tingkat(jlpt);
  const batas = cfg.batas[level];
  const { validasiBacaanAi, KANJI_DIPELAJARI } = await muatValidator();
  const { alasanTagBunpou } = cfg.modul ? await muatBunpou() : {};
  const bank = await muatBank(jlpt);
  const bankBacaan = bank.flatMap((l) => l.bacaan);
  const judulBank = new Set(bankBacaan.map((b) => bunyi(b.judul)));
  // Readings are the same at every level, so every bank vouches for them.
  const semuaBank = (await muatSemuaBank()).flatMap((l) => l.bacaan);
  const refBaca = petaFurigana(semuaBank);
  // A title of another level's bank is not forbidden (a test never mixes pattern levels) but worth a look.
  const idBank = new Set(bankBacaan.map((b) => b.id));
  const judulBankLain = new Map(semuaBank.filter((b) => !idBank.has(b.id)).map((b) => [bunyi(b.judul), b.id]));
  const fieldBacaan = cfg.modul ? 'bunpou,id,judul,soal,teks,terjemahan' : 'id,judul,soal,teks,terjemahan';

  const error = [];
  const peringatan = [];
  const err = (id, pesan) => error.push({ id, pesan });
  const warn = (id, pesan) => peringatan.push({ id, pesan });

  const gen = bacaGen(kerja, level);
  if (gen.galat) return { level, error: [{ id: level, pesan: `${gen.file}: ${gen.galat}` }], peringatan, furiganaBaru: [], kunci: [0, 0, 0], daftar: [] };
  const daftar = Array.isArray(gen.data) ? gen.data : [];
  if (!Array.isArray(gen.data)) err(level, 'file harus berisi array bacaan');
  if (daftar.length !== rc.jumlah) err(level, `jumlah bacaan ${daftar.length}, seharusnya ${rc.jumlah}`);

  // Titles of the other new levels count too: one test can mix levels.
  const judulLevelLain = new Map();
  for (const lain of Object.keys(rencana.level)) {
    if (lain === level) continue;
    const g = bacaGen(kerja, lain);
    if (Array.isArray(g.data)) for (const b of g.data) if (b?.judul) judulLevelLain.set(bunyi(b.judul), b.id);
  }

  const judulBaru = new Map();
  const kunci = [0, 0, 0];
  const bacaBaru = new Map();
  const hitungTanya = new Map();

  daftar.forEach((b, i) => {
    const idHarus = idBacaan(jlpt, level, rc.mulai + i);
    const id = b?.id || `#${i + 1}`;
    if (b?.id !== idHarus) err(id, `id seharusnya ${idHarus}`);
    const field = Object.keys(b || {}).sort().join();
    if (field !== fieldBacaan) err(id, `field bacaan harus tepat ${fieldBacaan.split(',').join(', ')} (ada: ${field})`);

    // The same validator the app runs on AI passages. Every kanji is allowed through here: an N5 bank passage gets
    // its volumes at draw time, and a passage of a level with a module is checked against the studied kanji below.
    const v = validasiBacaanAi(b, idHarus, { jlpt, kanjiBoleh: { has: () => true } });
    if (!v.ok) {
      const arti = {
        furigana: 'ada kanji tanpa {かな} tepat di belakangnya, bacaan lebih pendek dari jumlah kanjinya, atau kurung {} dipakai untuk hal lain',
        opsi: 'harus 3 pilihan yang berbeda',
        opsi_bahasa: 'pilihan harus bahasa Jepang dengan furigana, tanpa kata Latin',
        kunci: '"benar" harus 0, 1, atau 2',
        soal: 'tanya/tanyaId/pembahasan kosong, tanya tanpa furigana lengkap, atau dua soal dengan pertanyaan sama',
        jumlah_soal: 'harus 2 soal',
        panjang: 'judul kosong/terlalu panjang, teks terlalu pendek/panjang, atau terjemahan kosong',
      }[v.alasan];
      err(id, `validator JOYdata menolak (${v.alasan}): ${arti}`);
      return;
    }
    if (b.soal.length !== 2) err(id, `harus tepat 2 soal (ada ${b.soal.length})`);

    if (cfg.modul) {
      const alasan = alasanTagBunpou(jlpt, level, b.bunpou);
      const tugas = rc.pola?.[i] || [];
      const kurang = alasan ? [] : tugas.filter((n) => !b.bunpou.includes(n));
      if (alasan) err(id, `tag bunpou tidak sah — ${ARTI_TAG[alasan] || alasan}`);
      else if (kurang.length) err(id, `bunpou harus memuat pola yang ditugaskan ke bacaan ini (${tugas.join(' + ')}); belum ada: ${kurang.join(', ')}`);
      const luar = [...new Set(semuaTeks(b).flatMap((x) => String(x).match(KANJI_SATU) || []))].filter((c) => !KANJI_DIPELAJARI.has(c));
      if (luar.length) err(id, `kanji di luar volume yang dipelajari: ${luar.join('')} — jalankan rapikan.mjs (kata itu ditulis dengan kana)`);
    }

    const teksPolos = polos(b.teks);
    for (const [k, s] of b.soal.entries()) {
      const sid = `${idHarus}-${k + 1}`;
      if (s.id !== sid) err(id, `id soal seharusnya ${sid}`);
      const f = Object.keys(s).sort().join();
      if (f !== 'benar,id,opsi,pembahasan,tanya,tanyaId') err(sid, `field soal harus tepat id, tanya, tanyaId, opsi, benar, pembahasan (ada: ${f})`);
      if (/[{}]/.test(s.pembahasan)) err(sid, 'pembahasan tidak memakai furigana {}');
      if (!/ = /.test(s.pembahasan)) err(sid, 'pembahasan berbentuk "kutipan Jepang = arti Indonesia"');
      if (!/[?？]$/.test(s.tanyaId.trim())) err(sid, 'tanyaId = kalimat tanya bahasa Indonesia yang diakhiri ?');
      if (ADA_JEPANG.test(s.tanyaId)) err(sid, 'tanyaId bahasa Indonesia, tanpa huruf Jepang');
      if (!/か。?$/.test(polos(s.tanya).trim())) warn(sid, 'tanya tidak diakhiri か。');
      kunci[s.benar]++;

      // The quote in the explanation is the evidence: it has to be in the passage word for word.
      const kutipan = s.pembahasan.split(' = ')[0];
      for (const potong of kutipan.split(/…|\.\.\./).map((x) => x.trim().replace(/。$/, '')).filter(Boolean)) {
        if (!teksPolos.includes(potong)) err(sid, `kutipan pembahasan tidak ada di bacaan: "${potong}" (salin persis dari teks tanpa furigana; sambung dua bagian dengan …)`);
      }

      const pjg = s.opsi.map((o) => polos(o).length);
      const lain = pjg.filter((_, x) => x !== s.benar);
      if (pjg[s.benar] > Math.max(...lain) * 1.6 && pjg[s.benar] - Math.max(...lain) >= 5) warn(sid, 'pilihan benar jauh lebih panjang dari pengecoh (mudah ditebak)');
      const t = polos(s.tanya);
      hitungTanya.set(t, (hitungTanya.get(t) || 0) + 1);
    }

    const judulPolos = polos(b.judul);
    const judulBunyi = bunyi(b.judul);
    if (judulBank.has(judulBunyi)) err(id, `judul "${judulPolos}" sudah ada di bank`);
    if (judulBaru.has(judulBunyi)) err(id, `judul "${judulPolos}" sama dengan ${judulBaru.get(judulBunyi)}`);
    if (judulLevelLain.has(judulBunyi)) warn(id, `judul "${judulPolos}" juga dipakai ${judulLevelLain.get(judulBunyi)}`);
    if (judulBankLain.has(judulBunyi)) warn(id, `judul "${judulPolos}" sama bunyinya dengan ${judulBankLain.get(judulBunyi)} di bank tingkat lain`);
    judulBaru.set(judulBunyi, id);

    const kal = (teksPolos.match(/[。？！]/g) || []).length;
    if (teksPolos.length < batas.pjg[0] || teksPolos.length > batas.pjg[1]) err(id, `panjang teks ${teksPolos.length} huruf (tanpa furigana), batas ${level} ${batas.pjg.join('–')}`);
    if (kal < batas.kal[0] || kal > batas.kal[1]) err(id, `${kal} kalimat, batas ${level} ${batas.kal.join('–')}`);
    if (!/[a-z]/.test(b.terjemahan) || ADA_JEPANG.test(b.terjemahan)) err(id, 'terjemahan harus bahasa Indonesia');

    for (const lama of bankBacaan) {
      const m = kemiripan(teksPolos, polos(lama.teks));
      if (m > 0.5) warn(id, `teks mirip ${Math.round(m * 100)}% dengan ${lama.id} di bank`);
    }
    for (const lain of daftar.slice(0, i)) {
      if (!lain?.teks) continue;
      const m = kemiripan(teksPolos, polos(lain.teks));
      if (m > 0.5) warn(id, `teks mirip ${Math.round(m * 100)}% dengan ${lain.id}`);
    }

    const gabung = semuaTeks(b).map(polos).join(' / ');
    for (const [re, nama, sejak] of POLA_AWAS[jlpt] || []) {
      if (sejak && LEVEL_URUT.indexOf(level) >= LEVEL_URUT.indexOf(sejak)) continue;
      const m = gabung.match(re);
      if (m) warn(id, `cek pola ${sejak ? `level ${sejak}` : `di atas ${jlpt}`}: ${nama} → "…${gabung.slice(Math.max(0, m.index - 6), m.index + m[0].length + 4)}…"`);
    }

    const lokal = petaFurigana([b]);
    for (const [base, set] of lokal) {
      for (const r of set) {
        if (!bacaBaru.has(base)) bacaBaru.set(base, new Map());
        const m = bacaBaru.get(base);
        if (!m.has(r)) m.set(r, []);
        m.get(r).push(id);
      }
    }
  });

  // Readings the bank never used: a wrong furigana passes every format check, so each one is listed for a human look.
  const furiganaBaru = [];
  for (const [base, m] of bacaBaru) {
    for (const [r, ids] of m) {
      const ref = refBaca.get(base);
      if (ref?.has(r)) continue;
      furiganaBaru.push({ kata: base, baca: r, diBank: ref ? [...ref] : null, di: [...new Set(ids)] });
    }
  }

  const total = kunci[0] + kunci[1] + kunci[2];
  const rata = total / 3;
  if (total === rc.jumlah * 2 && total >= 12 && kunci.some((n) => n < rata * 0.75 || n > rata * 1.25)) {
    err(level, `sebaran kunci ${kunci.join('/')} (indeks 0/1/2) terlalu timpang — tiap indeks ${Math.ceil(rata * 0.75)}–${Math.floor(rata * 1.25)} dari ${total}`);
  }
  for (const [t, n] of hitungTanya) if (n > 3) warn(level, `pertanyaan "${t}" dipakai ${n} kali — variasikan`);

  return { level, jumlahBacaan: daftar.length, jumlahSoal: total, kunci, error, peringatan, furiganaBaru, daftar };
}

/** Every review entry in review/*.json, later files winning for the same passage text. */
export function bacaTinjauan(kerja) {
  const dir = path.join(kerja, 'review');
  const map = new Map();
  const rusak = [];
  if (!fs.existsSync(dir)) return { map, rusak };
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => a.t - b.t);
  for (const { f } of files) {
    try {
      const isi = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8').replace(/^﻿/, ''));
      for (const e of Array.isArray(isi) ? isi : []) if (e?.id && e?.sidik) map.set(`${e.id}:${e.sidik}`, { ...e, file: f });
    } catch (e) {
      rusak.push(`${f}: ${e.message}`);
    }
  }
  return { map, rusak };
}

/** Orchestrator rulings in putusan.json: [{ id, sidik, alasan }] sets aside a reviewer's non-answer blocker. */
export function bacaPutusan(kerja) {
  const file = path.join(kerja, 'putusan.json');
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  const isi = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  for (const p of Array.isArray(isi) ? isi : []) {
    if (p?.id && p?.sidik && String(p.alasan || '').trim().length >= 15) map.set(`${p.id}:${p.sidik}`, String(p.alasan).trim());
  }
  return map;
}

const tulisMasalah = (m, id) => `${m.soal || id} [${m.jenis || 'lainnya'}] ${m.catatan || ''}${m.saran ? ` → saran: ${m.saran}` : ''}`;

/**
 * Gate 2 (independent review) for one level: every passage needs a review of its current text whose blind
 * answers equal the key and that raises no blocking problem. A wrong blind answer can never be set aside —
 * the passage has to change (and be reviewed again); other blockers can, with a written reason.
 */
export function periksaTinjauan(kerja, level, daftar) {
  const { map, rusak } = bacaTinjauan(kerja);
  const putusan = bacaPutusan(kerja);
  const hasil = [];
  for (const b of daftar) {
    const s = sidik(b);
    const e = map.get(`${b.id}:${s}`);
    if (!e) {
      hasil.push({ id: b.id, sidik: s, status: 'BELUM', alasan: ['belum ada tinjauan untuk isi bacaan yang sekarang'], minor: [] });
      continue;
    }
    const salahJawab = [];
    const jawab = Array.isArray(e.jawaban) ? e.jawaban : [];
    b.soal.forEach((q, k) => {
      if (jawab[k] !== q.benar) {
        salahJawab.push(`${q.id}: peninjau menjawab ${jawab[k] ?? '-'} (${q.opsi[jawab[k]] ?? '?'}), kunci ${q.benar} (${q.opsi[q.benar]})`);
      }
    });
    const masalah = Array.isArray(e.masalah) ? e.masalah : [];
    const blokir = masalah.filter((x) => x.parah === 'blokir').map((m) => tulisMasalah(m, b.id));
    const minor = masalah.filter((x) => x.parah !== 'blokir').map((m) => tulisMasalah(m, b.id));
    const dikesampingkan = !salahJawab.length && blokir.length ? putusan.get(`${b.id}:${s}`) : undefined;
    const alasan = dikesampingkan ? [] : [...salahJawab, ...blokir];
    hasil.push({
      id: b.id,
      sidik: s,
      status: alasan.length ? 'BLOKIR' : 'LOLOS',
      alasan,
      minor,
      ...(dikesampingkan ? { dikesampingkan: { keberatan: blokir, alasan: dikesampingkan } } : {}),
      file: e.file,
    });
  }
  return { level, hasil, rusak };
}

export const levelDipilih = (arg, rencana) => {
  const semua = Object.keys(rencana.level);
  const minta = arg._.length ? arg._ : semua;
  const asing = minta.filter((l) => !semua.includes(l));
  if (asing.length) {
    console.log(`Level tidak ada di rencana.json: ${asing.join(', ')} (ada: ${semua.join(', ')})`);
    process.exit(2);
  }
  return minta;
};
