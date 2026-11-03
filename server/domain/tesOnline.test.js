import test from 'node:test';
import assert from 'node:assert/strict';
import {
  daftarMateriTes,
  buatSoalTes,
  soalTanpaKunci,
  nilaiTes,
  catatanHasilTes,
  skorNilaiUjian,
  validateSesiTes,
  buatKodeTes,
  normalisasiKodeTes,
  alasanKodeTidakBerlaku,
  artiBeririsan,
  PANJANG_KODE,
  poolDokkai,
  validasiBacaanAi,
  furiganaLengkap,
  sederhanakanKanji,
  kanjiDariVolume,
  VOLUME_KANJI,
} from './tesOnline.js';
import { KANJI_DASAR } from './bankSoal/kanjiN5.js';
import { validateAndNormalizeNilaiUjian } from './rules.js';
import { DOKKAI_LEVEL } from './bankSoal/dokkaiN5.js';

// Small seeded generator so a failing paper can be reproduced.
function rngDari(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test('Tes online catalogue: 80 kanji dasar, five volumes, and the dokkai levels', () => {
  const { kanji, dokkai } = daftarMateriTes();
  const byKode = Object.fromEntries(kanji.map((m) => [m.kode, m.jumlah]));
  assert.equal(byKode.DASAR, 80);
  assert.equal(byKode.VOL1, 84);
  assert.equal(byKode.SEMUA, 417); // 服 is in VOL4 and VOL5 but asked once
  assert.equal(dokkai.find((m) => m.kode === 'L1').jumlah, 10);
  const semua = dokkai.find((m) => m.kode === 'SEMUA');
  assert.equal(semua.jumlah, 50);
  assert.equal(semua.jumlahSoal, 100);
  assert.deepEqual(semua.perJlpt, { N5: { jumlah: 50, jumlahSoal: 100 }, N4: { jumlah: 0, jumlahSoal: 0 }, N3: { jumlah: 0, jumlahSoal: 0 } });
});

test('Kanji paper: random subset per attempt, four distinct options, and the key points at the right answer', () => {
  const a = buatSoalTes({ jenis: 'kanji', materi: 'VOL1', jumlah: 20 }, rngDari(1));
  const b = buatSoalTes({ jenis: 'kanji', materi: 'VOL1', jumlah: 20 }, rngDari(2));
  assert.equal(a.length, 20);
  assert.equal(new Set(a.map((s) => s.id)).size, 20);
  assert.notDeepEqual(a.map((s) => s.id), b.map((s) => s.id));

  for (const s of a) {
    for (const bagian of [s.bacaan, s.arti]) {
      assert.equal(bagian.opsi.length, 4);
      assert.equal(new Set(bagian.opsi).size, 4);
    }
    const artiBenar = s.arti.opsi[s.arti.benar];
    for (const opsi of s.arti.opsi) {
      if (opsi !== artiBenar) assert.equal(artiBeririsan(artiBenar, opsi), false, `${s.kanji}: ${opsi}`);
    }
  }
  const atsui = buatSoalTes({ jenis: 'kanji', materi: 'VOL1' }, rngDari(3)).find((s) => s.kanji === '暑い');
  assert.equal(atsui.bacaan.opsi[atsui.bacaan.benar], 'あつい');
  assert.equal(atsui.arti.opsi[atsui.arti.benar], 'Panas (cuaca)');
});

test('Kanji paper never offers another valid reading or an overlapping meaning as a wrong option', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const paper = buatSoalTes({ jenis: 'kanji', materi: 'SEMUA' }, rngDari(seed));
    const soto = paper.find((s) => s.kanji === '外');
    assert.ok(!soto.bacaan.opsi.includes('ほか'));
    const samui = paper.find((s) => s.kanji === '寒い');
    assert.ok(!samui.arti.opsi.includes('Dingin (benda/sentuhan)'));
  }
  assert.equal(artiBeririsan('Makan malam', 'Makan malam (santai)'), true);
  assert.equal(artiBeririsan('Bekerja', 'Bekerja di (suatu tempat)'), true);
  assert.equal(artiBeririsan('Musim semi', 'Musim panas'), false);
});

test('Kanji dasar asks one main reading, with distractors in the same script that are not readings of that kanji', () => {
  const dasar = new Map(KANJI_DASAR.map(([k, on, kun]) => [k, new Set([...on, ...kun])]));
  for (let seed = 1; seed <= 10; seed++) {
    for (const s of buatSoalTes({ jenis: 'kanji', materi: 'DASAR' }, rngDari(seed))) {
      const benar = s.bacaan.opsi[s.bacaan.benar];
      const katakana = /^[゠-ヿ]/.test(benar);
      assert.ok(dasar.get(s.kanji).has(benar));
      for (const opsi of s.bacaan.opsi) {
        assert.equal(/^[゠-ヿ]/.test(opsi), katakana, `${s.kanji}: ${opsi}`);
        if (opsi !== benar) assert.ok(!dasar.get(s.kanji).has(opsi), `${s.kanji}: ${opsi}`);
      }
      assert.ok(s.semuaBacaan);
    }
  }
});

test('Dokkai paper shuffles passages and options but keeps every answer key right', () => {
  const asli = new Map(DOKKAI_LEVEL.flatMap((l) => l.bacaan.flatMap((b) => b.soal)).map((s) => [s.id, s.opsi[s.benar]]));
  const paper = buatSoalTes({ jenis: 'dokkai', materi: 'SEMUA', jumlah: 5 }, rngDari(7));
  assert.equal(paper.length, 5);
  for (const b of paper) for (const s of b.soal) assert.equal(s.opsi[s.benar], asli.get(s.id));
  const urutan = (seed) => buatSoalTes({ jenis: 'dokkai', materi: 'SEMUA' }, rngDari(seed)).map((b) => b.id).join();
  assert.notEqual(urutan(1), urutan(2));
});

test('Official paper hides the key, translation, explanation and the dokkai furigana', () => {
  const kanji = soalTanpaKunci('kanji', buatSoalTes({ jenis: 'kanji', materi: 'VOL2', jumlah: 3 }, rngDari(1)));
  assert.equal(kanji[0].bacaan.benar, undefined);
  assert.equal(kanji[0].arti.benar, undefined);
  assert.equal(kanji[0].semuaBacaan, undefined);
  const dokkai = soalTanpaKunci('dokkai', buatSoalTes({ jenis: 'dokkai', materi: 'L2' }, rngDari(1)));
  assert.equal(dokkai[0].terjemahan, undefined);
  assert.equal(dokkai[0].soal[0].benar, undefined);
  assert.equal(dokkai[0].soal[0].pembahasan, undefined);
  for (const b of dokkai) {
    for (const t of [b.judul, b.teks, ...b.soal.map((s) => s.tanya)]) assert.doesNotMatch(t, /[{}]/);
  }
  assert.match(dokkai.map((b) => b.teks).join(''), /[㐀-鿿]/); // the kanji themselves stay
});

test('Grading: kanji reading and meaning are half a point each, dokkai one point per question', () => {
  const kanji = buatSoalTes({ jenis: 'kanji', materi: 'VOL3', jumlah: 2 }, rngDari(5));
  const [k1, k2] = kanji;
  const hasilKanji = nilaiTes('kanji', kanji, {
    [k1.id]: { bacaan: k1.bacaan.benar, arti: k1.arti.benar },
    [k2.id]: { bacaan: k2.bacaan.benar, arti: (k2.arti.benar + 1) % 4 },
  });
  assert.equal(hasilKanji.skor, 75);
  assert.equal(hasilKanji.benar, 1);
  assert.equal(hasilKanji.benarBacaan, 2);
  assert.equal(hasilKanji.benarArti, 1);
  assert.match(catatanHasilTes({ jenis: 'kanji', materiJudul: 'Volume 3', kode: 'ABC234' }, hasilKanji), /Bacaan 2\/2 · Arti 1\/2 · Perlu diulang: /);

  const dokkai = buatSoalTes({ jenis: 'dokkai', materi: 'L1', jumlah: 3 }, rngDari(5));
  const semuaSoal = dokkai.flatMap((b) => b.soal);
  const jawaban = Object.fromEntries(semuaSoal.map((s, i) => [s.id, i % 2 === 0 ? s.benar : (s.benar + 1) % 3]));
  const hasilDokkai = nilaiTes('dokkai', dokkai, jawaban);
  assert.equal(hasilDokkai.total, 6);
  assert.equal(hasilDokkai.skor, 50);
  assert.equal(nilaiTes('dokkai', dokkai, {}).skor, 0);
});

test('Test codes: six unambiguous characters, typed in any case', () => {
  const kode = buatKodeTes((n) => Math.floor(Math.random() * n));
  assert.equal(kode.length, PANJANG_KODE);
  assert.match(kode, /^[A-HJKMNP-Z2-9]+$/);
  assert.equal(normalisasiKodeTes(' k7m-2qx '), 'K7M2QX');

  const now = new Date('2026-11-02T10:00:00Z');
  assert.equal(alasanKodeTidakBerlaku(null, now), 'TES_KODE_TIDAK_DITEMUKAN');
  assert.equal(alasanKodeTidakBerlaku({ status: 'ditutup' }, now), 'TES_KODE_DITUTUP');
  assert.equal(alasanKodeTidakBerlaku({ status: 'aktif', berlakuSampai: '2026-11-02T09:00:00Z' }, now), 'TES_KODE_DITUTUP');
  assert.equal(alasanKodeTidakBerlaku({ status: 'aktif', berlakuSampai: null }, now), null);
});

test('Opening a test code: class, material and exam code are required; a count of all questions means "all"', () => {
  const ok = validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', jumlahSoal: 20, tanggalUjian: '2026-11-05', namaUjian: 'kj-v1' });
  assert.equal(ok.ok, true);
  assert.equal(ok.normalized.namaUjian, 'KJ-V1');
  assert.equal(ok.normalized.jumlahSoal, 20);
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', jumlahSoal: 84, tanggalUjian: '2026-11-05', namaUjian: 'X' }).normalized.jumlahSoal, null);
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'dokkai', materi: 'VOL1', tanggalUjian: '2026-11-05', namaUjian: 'X' }).code, 'INVALID_TES_ONLINE');
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', tanggalUjian: '', namaUjian: 'X' }).code, 'INVALID_TES_ONLINE');
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', jumlahSoal: 0, tanggalUjian: '2026-11-05', namaUjian: 'X' }).code, 'INVALID_TES_ONLINE');
});

// An AI passage as a model might return it: furigana on every kanji, two questions, three options each.
const bacaanAi = () => ({
  judul: '会社{かいしゃ}の寮{りょう}',
  teks: 'わたしは会社{かいしゃ}の寮{りょう}に住{す}んでいます。ごみは毎朝{まいあさ}捨{す}てます。',
  terjemahan: 'Saya tinggal di asrama perusahaan. Sampah dibuang setiap pagi.',
  soal: [
    { tanya: 'どこに住{す}んでいますか。', tanyaId: 'Di mana ia tinggal?', opsi: ['Asrama perusahaan', 'Hotel', 'Rumah teman'], benar: 0, pembahasan: 'わたしは会社の寮に住んでいます = tinggal di asrama perusahaan' },
    { tanya: 'いつごみを捨{す}てますか。', tanyaId: 'Kapan sampah dibuang?', opsi: ['Setiap malam', 'Setiap pagi', 'Hari Minggu'], benar: 1, pembahasan: 'ごみは毎朝捨てます = setiap pagi' },
  ],
});

test('AI passages: every kanji needs furigana, two or three questions with three options and one key', () => {
  assert.equal(furiganaLengkap('毎朝{まいあさ}六時{ろくじ}に起{お}きます。'), true);
  assert.equal(furiganaLengkap('毎朝六時{ろくじ}に起{お}きます。'), false);
  assert.equal(furiganaLengkap('休{やす}みのHobby{ほびー}'), false);

  const ok = validasiBacaanAi(bacaanAi(), 'AI7-1');
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.bacaan.soal.map((x) => x.id), ['AI7-1-1', 'AI7-1-2']);

  const rusak = (ubah) => {
    const b = bacaanAi();
    ubah(b);
    return validasiBacaanAi(b, 'AI7-1').alasan;
  };
  assert.equal(rusak((b) => { b.teks = '会社の寮に住んでいます。わたしは毎朝起きます。'; }), 'furigana');
  assert.equal(rusak((b) => { b.soal = b.soal.slice(0, 1); }), 'jumlah_soal');
  assert.equal(rusak((b) => { b.soal[0].opsi = ['A', 'A', 'B']; }), 'opsi');
  assert.equal(rusak((b) => { b.soal[1].benar = 3; }), 'kunci');
  assert.equal(rusak((b) => { b.soal[1].tanya = b.soal[0].tanya; }), 'soal');
});

test('Kanji outside the chosen volumes become kana, in the text, the questions and the explanations', () => {
  assert.equal(sederhanakanKanji('寮{りょう}の規則{きそく}は同{おな}じです。'), 'りょうのきそくは同{おな}じです。');
  const hanyaDasar = kanjiDariVolume(['DASAR']);
  assert.equal(hanyaDasar.size, 80);
  assert.equal(kanjiDariVolume().size, kanjiDariVolume(VOLUME_KANJI).size);

  // Every JLPT level: the level is about grammar, the kanji follow the volumes.
  for (const jlpt of ['N5', 'N4', 'N3']) {
    const { bacaan } = validasiBacaanAi(bacaanAi(), 'AI7-1', { jlpt, kanjiBoleh: hanyaDasar });
    assert.equal(bacaan.teks, 'わたしはかいしゃのりょうにすんでいます。ごみはまいあさすてます。');
    assert.equal(bacaan.soal[1].tanya, 'いつごみをすてますか。');
    assert.equal(bacaan.soal[0].pembahasan, 'わたしはかいしゃのりょうにすんでいます = tinggal di asrama perusahaan');
  }

  // A bank passage drawn for a code with only the basic kanji.
  const [kertas] = buatSoalTes({ jenis: 'dokkai', materi: 'L2', jumlah: 1, kanjiBoleh: hanyaDasar }, rngDari(4));
  assert.equal(furiganaLengkap(kertas.teks), true);
  for (const [, base] of kertas.teks.matchAll(/([\u3400-\u9FFF\u3005]+)\{/g)) {
    for (const c of base) assert.ok(hanyaDasar.has(c), c);
  }
});

test('Dokkai pools per sentence-pattern level: N5 = bank + approved AI, N4/N3 = approved AI only', () => {
  const tambahan = [
    { id: 'AI1-1', level: 'L2', jlpt: 'N4', soal: [{}, {}] },
    { id: 'AI1-2', level: 'L2', jlpt: 'N5', soal: [{}, {}] },
    { id: 'AI2-1', level: 'L3', jlpt: 'N4', soal: [{}, {}] },
  ];
  assert.equal(poolDokkai('L2', tambahan).length, 11);
  assert.deepEqual(poolDokkai('L2', tambahan, 'N4').map((b) => b.id), ['AI1-1']);
  assert.deepEqual(poolDokkai('SEMUA', tambahan, 'N4').map((b) => b.id), ['AI1-1', 'AI2-1']);
  assert.equal(poolDokkai('L2', tambahan, 'N3').length, 0);
  assert.deepEqual(daftarMateriTes(tambahan).dokkai.find((m) => m.kode === 'L2').perJlpt.N4, { jumlah: 1, jumlahSoal: 2 });
});

test('Opening a dokkai code: AI only for one level, N4/N3 from the bank only once passages exist, kanji volumes', () => {
  const dasar = { kelasId: 3, jenis: 'dokkai', materi: 'L2', tanggalUjian: '2026-11-05', namaUjian: 'DK-L2' };
  const ai = validateSesiTes({ ...dasar, sumber: 'ai', jlpt: 'N4', jumlahSoal: 5, kanjiVolume: ['VOL1', 'DASAR'] });
  assert.equal(ai.ok, true);
  assert.deepEqual(
    { sumber: ai.normalized.sumber, jlpt: ai.normalized.jlpt, jumlahSoal: ai.normalized.jumlahSoal, kanjiVolume: ai.normalized.kanjiVolume },
    { sumber: 'ai', jlpt: 'N4', jumlahSoal: 5, kanjiVolume: ['DASAR', 'VOL1'] }
  );
  assert.equal(validateSesiTes({ ...dasar, kanjiVolume: VOLUME_KANJI }).normalized.kanjiVolume, null);
  assert.equal(validateSesiTes({ ...dasar, kanjiVolume: [] }).code, 'INVALID_TES_ONLINE');
  assert.equal(validateSesiTes({ ...dasar, sumber: 'ai', materi: 'SEMUA' }).code, 'INVALID_TES_ONLINE');
  assert.equal(validateSesiTes({ ...dasar, jenis: 'kanji', materi: 'VOL1', sumber: 'ai' }).code, 'INVALID_TES_ONLINE');
  assert.equal(validateSesiTes({ ...dasar, jlpt: 'N3' }).code, 'INVALID_TES_ONLINE');
  assert.equal(
    validateSesiTes({ ...dasar, jlpt: 'N3' }, { tambahanDokkai: [{ id: 'AI1-1', level: 'L2', jlpt: 'N3', soal: [{}, {}] }] }).ok,
    true
  );
  assert.equal(alasanKodeTidakBerlaku({ status: 'draf' }), 'TES_KODE_BELUM_AKTIF');
});

test('Tes Online scores go to their JLPT section: kanji to Moji-Goi, dokkai to Bunpou-Dokkai', () => {
  const kanji = validateAndNormalizeNilaiUjian({ pesertaId: 1, kelasId: 3, tanggalUjian: '2026-11-03', codeUjian: 'KJ-V1', ...skorNilaiUjian('kanji', 87.5) });
  assert.equal(kanji.ok, true);
  assert.deepEqual(
    [kanji.normalized.pola, kanji.normalized.nilaiTunggal, kanji.normalized.nilaiMojiGoi, kanji.normalized.nilaiDokkai, kanji.normalized.nilaiAvg],
    ['variable', null, 87.5, null, 87.5]
  );
  const dokkai = validateAndNormalizeNilaiUjian({ pesertaId: 1, kelasId: 3, tanggalUjian: '2026-11-03', codeUjian: 'DK-L2', ...skorNilaiUjian('dokkai', 80) });
  assert.deepEqual(
    [dokkai.normalized.nilaiMojiGoi, dokkai.normalized.nilaiBunpou, dokkai.normalized.nilaiDokkai, dokkai.normalized.nilaiAvg],
    [null, 80, null, 80]
  );
});
