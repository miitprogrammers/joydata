import test from 'node:test';
import assert from 'node:assert/strict';
import {
  daftarMateriTes,
  bankSoalTes,
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
  opsiBahasaJepang,
  furiganaLengkap,
  sederhanakanKanji,
  kanjiDariVolume,
  VOLUME_KANJI,
  volumeKanjiDefault,
  kanjiItems,
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
  assert.equal(dokkai.find((m) => m.kode === 'L1').jumlah, 45);
  const semua = dokkai.find((m) => m.kode === 'SEMUA');
  assert.equal(semua.jumlah, 225);
  assert.equal(semua.jumlahSoal, 450);
  assert.deepEqual(semua.perJlpt, { N5: { jumlah: 225, jumlahSoal: 450 }, N4: { jumlah: 0, jumlahSoal: 0 }, N3: { jumlah: 0, jumlahSoal: 0 } });
});

test('Kanji N4: five volumes from the Excel, own exam codes, and the test takes the level of its material', () => {
  const { kanji } = daftarMateriTes();
  const n4 = kanji.filter((m) => m.jlpt === 'N4');
  assert.deepEqual(
    n4.map((m) => [m.kode, m.jumlah, m.saranNamaUjian]),
    [
      ['N4VOL1', 84, 'KJ-N4-V1'],
      ['N4VOL2', 84, 'KJ-N4-V2'],
      ['N4VOL3', 84, 'KJ-N4-V3'],
      ['N4VOL4', 84, 'KJ-N4-V4'],
      ['N4VOL5', 56, 'KJ-N4-V5'],
      ['N4SEMUA', 391, 'KJ-N4-ALL'], // 止める is in Vol 4 and Vol 5 but asked once
    ]
  );
  assert.equal(kanji.find((m) => m.kode === 'VOL1').judul, 'N5 · Volume 1');
  assert.equal(n4[0].judul, 'N4 · Volume 1');
  assert.equal(n4[0].judulPendek, 'Volume 1');

  // Readings without する, the second reading of 明日 kept as a right answer.
  const vol1 = Object.fromEntries(kanjiItems('N4VOL1').map((i) => [i.kanji, i]));
  assert.equal(vol1['遠慮'].bacaan, 'えんりょ');
  assert.equal(vol1['明日'].bacaan, 'あす');
  assert.ok(vol1['明日'].bacaanLain.includes('あした'));
  for (let seed = 1; seed <= 30; seed++) {
    for (const s of buatSoalTes({ jenis: 'kanji', materi: 'N4VOL1' }, rngDari(seed))) {
      if (s.kanji === '明日') assert.ok(!s.bacaan.opsi.includes('あした'));
      assert.equal(new Set(s.bacaan.opsi).size, 4);
      assert.equal(new Set(s.arti.opsi).size, 4);
    }
  }
  // 彼 and 彼女 share "pacar" (the Excel's commas became " / "): never offered together.
  const vol2 = Object.fromEntries(kanjiItems('N4VOL2').map((i) => [i.kanji, i]));
  assert.equal(vol2['彼'].arti, 'Dia (laki-laki) / pacar');
  assert.equal(artiBeririsan(vol2['彼'].arti, vol2['彼女'].arti), true);

  const kode = validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'N4VOL2', tanggalUjian: '2026-11-10', namaUjian: 'KJ-N4-V2' });
  assert.equal(kode.ok, true);
  assert.equal(kode.normalized.jlpt, 'N4');
  // An N5 material stays N5 whatever the form sends.
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', jlpt: 'N4', tanggalUjian: '2026-11-10', namaUjian: 'KJ-V1' }).normalized.jlpt, 'N5');
  assert.equal(bankSoalTes({ jenis: 'kanji', materi: 'N4SEMUA' }).items.length, 391);
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
    for (const t of [b.judul, b.teks, ...b.soal.flatMap((s) => [s.tanya, ...s.opsi])]) assert.doesNotMatch(t, /[{}]/);
    // Japanese only while answering: no Indonesian question, no Latin option.
    for (const s of b.soal) {
      assert.equal(s.tanyaId, undefined);
      for (const o of s.opsi) assert.doesNotMatch(o, /[A-Za-z]{2,}/);
    }
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
    { tanya: 'どこに住{す}んでいますか。', tanyaId: 'Di mana ia tinggal?', opsi: ['会社{かいしゃ}の寮{りょう}', 'ホテル', '友{とも}だちの家{いえ}'], benar: 0, pembahasan: 'わたしは会社の寮に住んでいます = tinggal di asrama perusahaan' },
    { tanya: 'いつごみを捨{す}てますか。', tanyaId: 'Kapan sampah dibuang?', opsi: ['毎晩{まいばん}', '毎朝{まいあさ}', '日曜日{にちようび}'], benar: 1, pembahasan: 'ごみは毎朝捨てます = setiap pagi' },
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
  assert.equal(rusak((b) => { b.soal[0].opsi = ['ホテル', 'ホテル', 'バス']; }), 'opsi');
  // Options are Japanese like the passage, never Indonesian, with furigana on every kanji.
  assert.equal(rusak((b) => { b.soal[0].opsi = ['Asrama perusahaan', 'Hotel', 'Rumah teman']; }), 'opsi_bahasa');
  assert.equal(rusak((b) => { b.soal[0].opsi = ['会社の寮', 'ホテル', '友{とも}だちの家{いえ}']; }), 'opsi_bahasa');
  assert.equal(opsiBahasaJepang('Aの店{みせ}'), true);
  assert.equal(rusak((b) => { b.soal[1].benar = 3; }), 'kunci');
  assert.equal(rusak((b) => { b.soal[1].tanya = b.soal[0].tanya; }), 'soal');
});

test('Kanji outside the chosen volumes become kana, in the text, the questions and the explanations', () => {
  const kanjiN5 = kanjiDariVolume(volumeKanjiDefault('N5'));
  assert.equal(sederhanakanKanji('寮{りょう}の規則{きそく}は同{おな}じです。', new Map(), kanjiN5), 'りょうのきそくは同{おな}じです。');
  // 規則 is an N4 word: with every volume (the default list) it stays.
  assert.equal(sederhanakanKanji('寮{りょう}の規則{きそく}は同{おな}じです。'), 'りょうの規則{きそく}は同{おな}じです。');
  const hanyaDasar = kanjiDariVolume(['DASAR']);
  assert.equal(hanyaDasar.size, 80);
  assert.equal(kanjiDariVolume().size, kanjiDariVolume(VOLUME_KANJI).size);

  // Every JLPT level: the level is about grammar, the kanji follow the volumes.
  for (const jlpt of ['N5', 'N4', 'N3']) {
    const { bacaan } = validasiBacaanAi(bacaanAi(), 'AI7-1', { jlpt, kanjiBoleh: hanyaDasar });
    assert.equal(bacaan.teks, 'わたしはかいしゃのりょうにすんでいます。ごみはまいあさすてます。');
    assert.equal(bacaan.soal[1].tanya, 'いつごみをすてますか。');
    assert.deepEqual(bacaan.soal[0].opsi, ['かいしゃのりょう', 'ホテル', '友{とも}だちのいえ']);
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
  assert.equal(poolDokkai('L2', tambahan).length, 46);
  assert.deepEqual(poolDokkai('L2', tambahan, 'N4').map((b) => b.id), ['AI1-1']);
  assert.deepEqual(poolDokkai('SEMUA', tambahan, 'N4').map((b) => b.id), ['AI1-1', 'AI2-1']);
  assert.equal(poolDokkai('L2', tambahan, 'N3').length, 0);
  assert.deepEqual(daftarMateriTes(tambahan).dokkai.find((m) => m.kode === 'L2').perJlpt.N4, { jumlah: 1, jumlahSoal: 2 });
});

test('Bank Soal: every question a code draws from, with keys, bank and AI passages, kanji by volume', () => {
  const dasar = bankSoalTes({ jenis: 'kanji', materi: 'DASAR' });
  assert.equal(dasar.items.length, 80);
  assert.ok(dasar.items.every((k) => k.on && k.kun && k.arti));
  assert.equal(bankSoalTes({ jenis: 'kanji', materi: 'SEMUA' }).items.length, 417);
  assert.ok(bankSoalTes({ jenis: 'kanji', materi: 'VOL1' }).items.every((k) => k.id.startsWith('VOL1:') && k.bacaan));

  const ai = { ...DOKKAI_LEVEL[1].bacaan[0], id: 'AI9-1', level: 'L2', jlpt: 'N5' };
  const l2 = bankSoalTes({ jenis: 'dokkai', materi: 'L2' }, [ai]);
  assert.equal(l2.items.length, 46);
  assert.equal(l2.items.filter((b) => b.sumber === 'ai').length, 1);
  assert.ok(l2.items.every((b) => b.soal.every((s) => s.opsi[s.benar])));
  assert.equal(bankSoalTes({ jenis: 'dokkai', materi: 'L2', jlpt: 'N4' }, [ai]).items.length, 0);

  // Same kana as a code with only the basic kanji would give peserta; all volumes = no change and kanjiVolume null.
  const hanyaDasar = kanjiDariVolume(['DASAR']);
  const sederhana = bankSoalTes({ jenis: 'dokkai', materi: 'L2', kanjiVolume: ['DASAR'] });
  assert.deepEqual(sederhana.kanjiVolume, ['DASAR']);
  for (const b of sederhana.items) {
    for (const [, base] of b.teks.matchAll(/([㐀-鿿々]+)\{/g)) for (const c of base) assert.ok(hanyaDasar.has(c), c);
  }
  // The level's default volumes = no limit: the bank passage as written.
  const semuaVol = bankSoalTes({ jenis: 'dokkai', materi: 'L2', kanjiVolume: volumeKanjiDefault('N5') });
  assert.equal(semuaVol.kanjiVolume, null);
  assert.equal(semuaVol.items[0].teks, DOKKAI_LEVEL[1].bacaan[0].teks);
  assert.deepEqual(bankSoalTes({ jenis: 'dokkai', materi: 'L2', kanjiVolume: VOLUME_KANJI }).kanjiVolume, VOLUME_KANJI);

  assert.throws(() => bankSoalTes({ jenis: 'kanji', materi: 'L2' }), /INVALID_TES_ONLINE/);
  assert.equal(bankSoalTes({ jenis: 'kanji', materi: 'VOL1', jlpt: 'N4' }).jlpt, 'N5');
  assert.throws(() => bankSoalTes({ jenis: 'dokkai', materi: 'L2', kanjiVolume: [] }), /INVALID_TES_ONLINE/);
  assert.throws(() => bankSoalTes({ jenis: 'dokkai', materi: 'L2', kanjiVolume: ['VOL9'] }), /INVALID_TES_ONLINE/);
});

test('Opening a dokkai code: AI only for one level, N4/N3 from the bank only once passages exist, kanji volumes', () => {
  const dasar = { kelasId: 3, jenis: 'dokkai', materi: 'L2', tanggalUjian: '2026-11-05', namaUjian: 'DK-L2' };
  const ai = validateSesiTes({ ...dasar, sumber: 'ai', jlpt: 'N4', jumlahSoal: 5, kanjiVolume: ['VOL1', 'DASAR'] });
  assert.equal(ai.ok, true);
  assert.deepEqual(
    { sumber: ai.normalized.sumber, jlpt: ai.normalized.jlpt, jumlahSoal: ai.normalized.jumlahSoal, kanjiVolume: ai.normalized.kanjiVolume },
    { sumber: 'ai', jlpt: 'N4', jumlahSoal: 5, kanjiVolume: ['DASAR', 'VOL1'] }
  );
  assert.equal(validateSesiTes({ ...dasar, kanjiVolume: volumeKanjiDefault('N5') }).normalized.kanjiVolume, null);
  // N4/N3 grammar starts with the N5 and N4 kanji; an N4 code with only the N5 volumes keeps that choice.
  assert.deepEqual(volumeKanjiDefault('N4'), VOLUME_KANJI);
  const n4 = { ...dasar, sumber: 'ai', jlpt: 'N4' };
  assert.equal(validateSesiTes({ ...n4, kanjiVolume: VOLUME_KANJI }).normalized.kanjiVolume, null);
  assert.deepEqual(validateSesiTes({ ...n4, kanjiVolume: volumeKanjiDefault('N5') }).normalized.kanjiVolume, volumeKanjiDefault('N5'));
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
