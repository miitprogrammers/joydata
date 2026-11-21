# Catatan Progres Implementasi: Revisi Dokkai berbasis KB + Materi N3

Branch: `kb-dokkai-n3` (belum dibuat) · Rencana: [plan.md](plan.md) · Aturan: [../17-aturan-final.md](../17-aturan-final.md)

Aturan: setiap langkah dicatat di sini (status, bukti, kendala), lalu ringkasan kompak disimpan ke memory sesi supaya
bisa dilanjutkan kapan saja. Status: BELUM · JALAN · SELESAI · TERTAHAN.

## Status fase

| Fase | Isi | Status | Bukti |
|---|---|---|---|
| F0 | Persiapan & baseline | SELESAI | 141/141, sampel AI sebelum |
| F1 | Prompt AI | SELESAI | dokkaiAi.test.js 7/7, evaluasi f1b |
| F2 | Validator & tampilan | SELESAI | 149/149, build |
| F3 | Skill generate-soal | SELESAI | uji alur revisi N5 L1; audit awal N5 273 / N4 94 error |
| F4 | Kanji N3 | SELESAI | 150/150; 369 kata N3VOL1–5 |
| F5 | Revisi bank N5/N4 | SELESAI | N4 94 + N5 192 bacaan diganti; audit 0 error angka/kata; 150/150 |
| F6 | Bank dokkai N3 (250 soal) | SELESAI | 125 bacaan / 250 soal; audit 0/0; 151/151; build |
| F7 | Evaluasi akhir | SEBAGIAN | cek visual selesai; sampel AI model utama baru N5 L1 (kuota harian 20) |
| F8 | Penyelesaian sisa KB | SELESAI | 情報検索, peringatan aplikasi, revisi mutu N5 95 + N4 38; audit 0/0/0; 156/156 |

## Jawaban user untuk plan §9

| No | Jawaban | Tanggal |
|---|---|---|
| Q1 sumber kanji N3 | Disusun dari KB (369 kanji, file 13); **sudah ditinjau sensei** (dikonfirmasi user 2026-11-21) | 2026-11-20 |
| Q2 50 soal per level | Ya: 25 bacaan × 2 soal per level L1–L5 (125 bacaan / 250 soal) | 2026-11-20 |
| Q3 empat pola ⚠️ N5 | Sesuai usulan: ～ことができます, ～てあげます／くれます／もらいます, ～たら, ～ても boleh di N5 | 2026-11-20 |
| Q4 ～によって | Tidak dijawab → bawaan: tetap dilarang di N4 | 2026-11-20 |
| Q5 bank kanji tidak diubah | Tidak dijawab → bawaan: bank kanji N5/N4 tidak diubah | 2026-11-20 |
| Q6 peringatan kosakata di aplikasi | Tidak dijawab → bawaan: tidak sekarang (hanya di skill lokal) | 2026-11-20 |
| Q7 pemetaan level N3 | Tidak dijawab → bawaan: L1–L2 短文, L3–L4 中文, L5 長文 | 2026-11-20 |

## Log langkah

### F0 - Persiapan & baseline - SELESAI
- Branch `kb-dokkai-n3` dibuat dari `main` @ `4b636f1` (docs/kb-dokkai masih untracked, ikut terbawa).
- Bukti: `npm test` → 141/141 lolos.
- Sampel AI "sebelum" (6 permintaan × 4 bacaan, prompt lama, gemini-2.5-flash; disimpan di scratchpad `evalai/sebelum.json`):

  | Kasus | ms | Lolos validator | Panjang dalam rentang baru | Angka kanji | Bingkai | Kata hindari N5 | Pola terlarang N5 |
  |---|---|---|---|---|---|---|---|
  | N5 L1 | 13.854 | 3/4 (tolak: soal) | 3/3 | 0/3 | 0/3 | 0 | 0 |
  | N5 L3 | 14.362 | 3/4 (tolak: furigana) | 3/3 | 2/3 | 0/3 | 0 | 1 |
  | N5 L5 | 20.277 | 4/4 | 0/4 (97–109) | 2/4 | 0/4 | 0 | 2 |
  | N4 L2 | 16.602 | 4/4 | 4/4 | 1/4 | 0/4 | – | – |
  | N4 L5 | 17.397 | 4/4 | 0/4 (133–157) | 1/4 | 0/4 | – | – |
  | N3 L3 | 18.840 | 4/4 | 0/4 (107–166) | 1/4 | 0/4 | – | – |

### F1 - Prompt AI baru - SELESAI
- Perubahan: `server/ai/dokkaiAi.js` ditulis ulang sesuai spek-01 (`SISTEM`, `PANDUAN_LEVEL` per tingkat + `panduanLevel`,
  `PANDUAN_JLPT` N5/N4/N3, `topikDokkai`, `ukuranPermintaan`); `server/ai/dokkaiAi.test.js` baru (7 uji), didaftarkan di `package.json`.
- Iterasi setelah evaluasi (spek-01 ikut diperbarui): panjang dinyatakan juga dalam jumlah kalimat + target tengah; larangan kata
  berlaku "kanji maupun kana"; ～ないで (tanpa) dan ～とおりに masuk daftar JANGAN N5; padanan Jilid I untuk 夕方/予定/場所/規則;
  topik N5 "aturan di asrama" → "yang boleh dan tidak boleh di asrama" (topik lama memancing 規則/きそく); pemeriksaan mandiri di akhir `SISTEM`.
- Evaluasi (putaran f1b, model utama; scratchpad `evalai/`):

  | Kasus | Lolos | Panjang dalam rentang | Angka kanji | Bingkai | Kata hindari N5 | Pola terlarang N5 |
  |---|---|---|---|---|---|---|
  | N5 L1 | 4/4 | 4/4 | 0 | (narasi) | 0 | 0 |
  | N5 L3 | 4/4 | 3/4 | 0 | 4/4 | 1 (きそく → sudah diperbaiki lewat topik) | 0 |
  | N5 L5 | 4/4 | 4/4 (187–210) | 0 | 2/4 | 1 (夕方 → diberi padanan) | 0 |
  | N4 L2 | 3/4 | 3/3 | 0 | 1/3 | – | – |
  | N4 L5 | 3/4 | 1/3 (232–259) | 0 | 3/3 | – | – |

- Kendala: **API key di `.env` adalah tier gratis (5 permintaan/menit)**. Saat kuota habis, `llm.js` jatuh ke `gemini-flash-lite-latest`,
  yang sering ditolak validator (furigana pada katakana/hiragana, okurigana di dalam kurung). N3 L3 belum terukur dengan model
  utama karena itu. Bila kunci produksi juga tier gratis, kode AI L5/N3 (2 bacaan per permintaan → hingga 4 permintaan sekaligus)
  lebih rawan kena batas — dilaporkan ke user.
- Bukti: `npx tsx --test server/ai/dokkaiAi.test.js server/domain/bunpou.test.js` → 14/14.

### F2 - Validator & tampilan - SELESAI
- Perubahan: `validasiBacaanAi` — baris baru hanya di `teks` (dirapikan, maks satu baris kosong), field lain satu baris;
  `perbaikiFurigana` baru (okurigana di dalam kurung, kurung setelah kana/katakana) — ditambahkan karena evaluasi F1 menemukan
  bacaan N4 L5 dari model utama ditolak oleh `悪い{わるい}`, `お書き{かき}`; `FuriganaText.vue` `white-space: pre-line`;
  default jumlah bacaan dokkai 5 → 8 + saran di hint (`tesOnline.saranJumlahDokkai`, id/ja).
- Uji baru di `tesOnline.test.js` (baris baru, perbaikan furigana, teks benar tidak diubah).
- Bukti: `npm test` → 149/149; `npm run build` lolos.

### F3 - Skill generate-soal - SELESAI
- `_umum.mjs`: `TINGKAT` + flag `kanjiVolume` (dipisah dari `modul`) + tingkat N3 + batas L5 baru (+ `BATAS_LAMA` untuk revisi);
  `muatBank` aman bila file bank belum ada; daftar pola N5 = Minna Jilid II (pola Bab 17/18/24/25 dihapus dari peringatan),
  N4 tanpa ～ようにする + pola kelompok D/E, N3 kosong; **angka kanji + satuan = ERROR**; **kosakata Minna** (N5: kata dihindari
  = ERROR, di luar Bab 1–25 = peringatan; N4: tidak ada di Minna = peringatan; data dari `docs/kb-dokkai/data/minna-kosakata.json`);
  furigana harus sudah tepat (slip yang diperbaiki aplikasi = ERROR di bank); baris baru hanya di teks; kanji dicek per tingkat;
  mode revisi di `periksaGate` (id dari rencana, judul/kemiripan tidak dibandingkan dengan diri sendiri, pola penyebab yang
  masih ada = ERROR, sebaran kunci tidak dicek).
- Skrip: `gate.mjs --audit` (seluruh bank, tanpa folder kerja); `siapkan.mjs --revisi / --revisi-dari --kategori`;
  `inject.mjs` mode ganti (blok per id, verifikasi bacaan lain tidak berubah, revisi angka-saja tanpa tinjauan buta bila
  identik setelah dinormalkan, `ringkasan-revisi.md`); `konversi-angka.mjs` baru; `rapikan.mjs` memakai `kanjiVolume` dan
  volume per tingkat; `brief.mjs` blok `RAPIKAN`/`REVISI`/`TAMBAH`.
- Referensi: `SKILL.md` (tiga bank, gate baru, bagian mode revisi), `spesifikasi-soal.md` (angka Arab, baris baru, bingkai,
  teknik pengecoh a–h, kunci parafrase, topik per tingkat), `tingkat-N5.md` (ditulis ulang: Minna Bab 1–25), `tingkat-N4.md`
  (Minna 1–50 + modul, kelompok D8, L5 250–450), `tingkat-N3.md` (baru), `brief-generator.md`.
- Uji alur di folder sementara (N5 L1): `siapkan --revisi-dari --kategori angka` → 24 bacaan; `konversi-angka` → 101 angka,
  0 PERIKSA, semua bentuk sulit benar (六本→6本{ぽん}, 二十歳→20歳{はたち}, 十歳→10歳{さい}, 一人/一番/十分{じゅうぶん} tetap); gate
  menahan 5 bacaan yang masih memuat 工場/ごみ (benar); `inject --uji` menolak (benar). Bug yang ditemukan dan diperbaiki: bacaan
  yang direvisi dianggap "judul sama dengan bank tingkat lain".
- Audit awal (sebelum revisi): N5 273 error (angka 173, kata 75, jumlah kalimat 10, panjang 7, kutipan 4, format 3, judul 1);
  N4 94 error (semua angka). Rinciannya di spek-04 §3.
- Prosedur F5 disesuaikan: satu folder kerja per level untuk semua kategori (spek-04 §3).

### F4 - Kanji N3 - SELESAI
- Data `server/domain/bankSoal/kanjiN3.js` (baru): `KANJI_VOLUME_N3` 369 kata (satu kata per kanji daftar rirekishobuilder,
  urutan frekuensi), VOL1–VOL4 74 kata, VOL5 73; bacaan hiragana, arti Indonesia; `BACAAN_LAIN_N3` 8 kata (形 かた, 良い いい,
  背 せい, 船便 せんびん, 抱く いだく, 皆 みんな, 寒気 かんき, 工夫 こうふ). 136 kata dari contoh PDF; sisanya kata umum lain karena
  contohnya sudah ada di volume N5/N4, janggal, atau bersinonim dengan kata N5/N4. 働 dan 誰 (hanya di jlptsensei) sudah ada di
  volume N5. Pemeriksaan sendiri (skrip scratchpad `n3/scripts/cek-sendiri.mjs`): 0 kata dobel dengan N5/N4, semua kanji daftar
  tercakup, bacaan hiragana, tidak ada homofon dalam satu volume; seluruh 369 bacaan/arti dibaca manual.
- Kode: `tesOnline.js` (import N3, `JLPT_KANJI` + N3, `VOLUME_KATA` `N3VOL*`, `N3SEMUA`, `bacaanLain` + N3, `jlptKanji`/`nomorVolume`
  N3, `volumeKanjiDefault` kumulatif, `kanjiTingkat(jlpt)`, default `validasiBacaanAi` → `kanjiTingkat(jlpt)`); `dokkaiAi.js`
  default `kanjiTingkat(jlpt)`; `src/utils/volumeKanji.js`; `BankSoalTes.vue` `N3SEMUA`; komentar `PortalTesView.vue`,
  `TesOnlineView.vue`. Flashcard, Kanji Adventure, latihan portal, dan form kode mengikuti sendiri (`VOLUME_KANJI`, `jlptKanji`);
  tombol tingkat di flashcard/Kanji Adventure dibangun dari data.
- Uji: `tesOnline.test.js` (uji baru "Kanji N3", default volume kumulatif: kode N4 lama tetap N5+N4, kode N4 yang memilih N3
  tetap pilihannya), `flashcard.test.js` (16 volume, label N3), `apiApp.kanjiAdventure.test.js` (16 volume, terakhir N3VOL5).
- Bukti: `npm test` → 150/150.
- **Sudah ditinjau sensei (dikonfirmasi user 2026-11-21)** — daftar ini tidak lagi menghalangi kode kanji N3 bernilai. Yang diminta
  untuk ditinjau waktu itu (catatan agen penyusun): kata lemah karena kanjinya sedikit
  pilihan (大阪, 南米, 君たち, 昨年, 要因, 途端); kata yang biasa ditulis kana (御免, 掛かる, 幾ら, 恐らく); kata dengan kanji kedua di
  luar daftar N3 (福祉, 豊富, 貿易, 避難, 迷惑, 禁煙, 骨折, 節約, 義務, 御免); bacaan/arti yang perlu dipastikan (皆 みな/みんな,
  寒気 さむけ/かんき, 工夫 くふう/こうふ, 背 せ, 適当, 光熱費); arti dekat kata N5/N4 (遅刻/遅れる, 多忙/忙しい, 恥/恥ずかしい,
  頭痛/痛い, 怖がる/怖い, 打ち合わせ/会議).

### F5 - Revisi bank N5/N4 - SELESAI
- Perubahan skill sebelum revisi:
  - gate: bacaan revisi yang sejak awal di luar batas panjang/kalimat lolos asal tidak makin jauh (audit tetap melaporkannya);
    `15万円` tidak dianggap angka kanji; 一年中/一日中 kata tetap.
  - `konversi-angka.mjs`: blok gabungan (7時{じ}半{はん}, 7時{じ}10分{ぷん}, 3日{みっか}間{かん}, 3名{めい}様{さま}, 1年{ねん}目{め}),
    puluhan ribu bulat dengan 万 (15万円{まんえん}), batas angka sampai 10⁸ — catatan PERIKSA turun dari 120 ke 0.
  - `siapkan.mjs`/`brief.mjs`: rincian alasan per id (kata apa, pola apa, pesan gate) ikut ke brief penulis.
- Daftar revisi dari audit gate segar + temuan pola dampak-bank (scratchpad `f5/revisi-N5.json`, `revisi-N4.json`); ditambah 8 kata
  yang gate hanya tandai peringatan tetapi ada di spek-04 §2.2 (茶色 L1-8, 運動 L2-32/L3-19/L5-18, 北口 L2-36/L5-8, 台風 L3-31, 材料 L4-10).
- **N4 selesai:** 94 bacaan angka saja (L1 16, L2 18, L3 18, L4 19, L5 23), 463 angka dikonversi, 0 PERIKSA; angka dengan
  penghitung kana (10こ, 1ぱい, 3まい, 3さつ) dicek manual — benar. Inject mode ganti; audit N4 → **0 error**. Peringatan kosakata
  N4 (先輩 14×, 部品, 工事, 料金, 店員, 最後, nama + jabatan) tidak direvisi: D8 menjadikannya peringatan, bukan pelanggaran; dua
  peringatan pola (N4L2-21 ～出す, N4L3-5 ～ではないか) salah deteksi (出します = menyerahkan; ではないからです).
- N5: folder per level (scratchpad `f5/k-N5-L1` … `L5`): 30/44/35/44/39 bacaan; angka dikonversi (1.078); 87 bacaan revisi isi
  (L1 11, L2 15, L3 16, L4 21, L5 24) dikerjakan agen penulis.
- **N5 selesai:** 192 bacaan diganti (L1 30, L2 44, L3 35, L4 44, L5 39); 105 hanya angka (tanpa tinjauan buta), 87 revisi isi lolos
  tinjauan buta (satu peninjau per level + putaran ulang untuk yang diperbaiki). Semua jawaban buta = kunci di semua putaran.
  - Blokir peninjau yang diperbaiki (14): judul/pertanyaan yang membocorkan jawaban (L1-8, L1-25, L2-2, L5-3), soal yang bisa
    ditebak dari akal sehat (L3-6, L3-31, L3-41 ×2, L5-2, L5-12), rentang tanggal ambigu (L4-17), jumlah yang sama dengan angka
    di teks (L4-24). Ditambah catatan minor yang murah: 何{なん}で, 開いています/置き場/夜の仕事 (kata Bab 26–29), 切って, までに.
  - **Putusan (keberatan dikesampingkan, 6):** L4-4, L4-7, L4-9, L4-15, L4-17 (tipe soal L4 "gabungan dua detail/kunci
    parafrase") dan L3-41 (pengumuman tanpa bingkai) — desain bacaan bank lama yang tidak tersentuh revisi kata; jawaban buta =
    kunci. Isi `putusan.json` di folder kerja L3/L4.
  - Kunci yang berpindah indeks: L2-24-2, L3-6-1, L3-12-1/2, L3-24-2, L3-26-1, L3-28-1, L5-1-2, L5-13-1/2, L5-22-1/2, L5-26-1/2
    (topik/soal ditulis ulang); rinciannya, juga "jawaban ditulis ulang" dengan indeks tetap, di `ringkasan-revisi.md` tiap folder.
- Audit akhir N5: 0 error angka, 0 error kata; tersisa 14 error panjang/jumlah kalimat bacaan lama (L3-1, L3-13, L4-2/3/5/7,
  L5-1/2/3/5/8/9) — dibiarkan sesuai §3 spek-04 (sebelum revisi 17). `npm test` 150/150.
- **Catatan untuk tugas terpisah (dari peninjau):** banyak bacaan lama bernomor kecil memakai soal salin-satu-kalimat (tanpa gabungan
  detail/kunci parafrase) dan pengumuman tanpa kalimat bingkai; beberapa memakai kata Bab 26–29 yang tidak dideteksi gate
  (開いています, 閉まります, 止まります, 大好き). Perbaikan menyeluruh = revisi mutu terpisah, bukan cakupan F5.

### F6 - Bank dokkai N3 - SELESAI
- `server/domain/bankSoal/dokkaiN3.js` (kerangka 5 level kosong, deskripsi sesuai spek-05 B.2); `tesOnline.js` `BANK_DOKKAI.N3`
  + komentar; `PortalTesView.vue` komentar. `npm test` 150/150, `npm run build` lolos.
- Folder kerja scratchpad `f6/n3`; 5 agen penulis (25 bacaan per level), wilayah topik dipisah per level.
- Hasil penulis: L1 memo/pengumuman/email kerja (163–196 huruf), L2 esai pengalaman (168–194), L3 penjelasan kerja/keselamatan/
  kesehatan (302–346), L4 esai kebiasaan/teknologi/keluarga (334–380), L5 esai/surat isu sosial (509–546); semua lolos gate 0/0.
- Tinjauan buta: semua jawaban buta = kunci di semua putaran (L1–L5, 250 soal). Blokir yang diperbaiki: L1-10-1 (aturan kata sandi
  umum), L2-10/L2-12 (judul membocorkan jawaban), L4-3/6/25 (pengecoh bertentangan dengan pertanyaan sendiri), L4-23 (pengecoh juga
  benar), L4-25 (furigana か月{かげつ} — slip koordinator; gate kini menangkapnya). L3: 9 soal bertopik keselamatan bisa ditebak dari
  akal sehat → ditulis ulang; putaran 2 masih 6 → N3L3-12/16/23 ditulis ulang dengan topik baru, N3L3-1/20 diganti pengecohnya.
- L3 putaran 3 (N3L3-12/16/23 topik baru: 休みのお願い, 残業をしない日, 食堂のメニューと塩分; N3L3-1/20 pengecoh baru) lolos; pola N2
  yang tersisa (～おそれがある N3L3-6/24, ～ものの N3L3-5, ～に限らず/～次第で N3L5) diganti padanan N3 dan ditinjau ulang. Gate kini
  memperingatkan 10 pola N2 di bank N3 (`POLA_AWAS_N3`), dan menolak furigana yang mengulang kana di depannya (か月{かげつ}).
- **Inject:** `dokkaiN3.js` 125 bacaan / 250 soal (L1–L5 masing-masing 25). Audit N3: 0 error, 0 peringatan. Uji: `tesOnline.test.js`
  (perJlpt N3 125/250, pool N3 L2 = 25, kode bank N3 terbuka tanpa AI), `bunpou.test.js` uji baru "Dokkai N3 bank" (bentuk, id,
  furigana lengkap, kanji ⊂ `kanjiTingkat("N3")`, kertas N3). `npm test` 151/151; `npm run build` lolos.
- Catatan peninjau yang tidak dikerjakan (minor): beberapa soal L3/L4 masih condong ke akal sehat tetapi berjawaban tunggal
  (N3L3-1-2, 10-1/2, 24-2, N3L4-9-2, 10-1, 12-2, 22-1); pola kunci soal 1 di L4/L5 berulang (tidak terlihat peserta, urutan
  pilihan diacak per tes).
- **Celah data kanji (untuk user):** 京, 洋, 曜, 漢 (daftar JLPT N5–N3 jlptsensei) serta 枚 dan 寮 tidak ada di volume kanji mana pun,
  sehingga di bank N4/N3 (tanpa furigana di kertas) 日曜日, 東京, 漢字, 寮, 3枚 ditulis kana (にちようび, かんじ, りょう, 3まい). Bila
  sensei ingin kanji itu tampil, kata yang memuatnya perlu masuk volume (Excel N5/N4 atau kanjiN3.js).

### F7 - Evaluasi akhir - TERTAHAN (kuota model utama)
- Sampel 2026-11-20 (scratchpad `evalai/f7.json`, ukuran permintaan seperti aplikasi): **kuota harian tier gratis gemini-2.5-flash
  (20 permintaan/hari) sudah habis**, semua jatuh ke model cadangan (flash-lite). Hasil cadangan: N5 L1 2/4, N5 L5 2/2 (panjang
  239–242, tetapi 2/2 memuat pola terlarang N5), N4 L5 1/2, N3 L1 3/4, N3 L3 0/2, N3 L5 0/2 — hampir semua penolakan karena
  furigana: baris （注） N3 ditulis tanpa furigana, kata umum tanpa furigana (食べます, 何), 小さ{小さ}, 夫{お夫}.
- Perbaikan prompt: furigana wajib di semua medan termasuk baris （注） (contoh ber-furigana), pemeriksaan mandiri butir (5) furigana.
  `dokkaiAi.test.js` 7/7.
- Bacaan N3 yang lolos sudah memakai kanji N3 (械, 期, 責任, 求, 現, 相談, 禁) — volume N3 sampai ke AI.
- **Untuk user:** bila kunci produksi juga tier gratis, batas 20 permintaan/hari per model berarti hanya ±5–10 kode AI per hari
  sebelum jatuh ke model cadangan yang jauh lebih sering ditolak. Ulangi sampel dengan model utama setelah kuota pulih.

### F8 - Penyelesaian sisa KB (permintaan user "selesaikan", 2026-11-21) - SELESAI
- **Peringatan aturan KB di aplikasi (L6):** `server/domain/aturanDokkai.js` (baru) = satu sumber daftar kata hindari N5 dan pola di
  atas tingkat (N5 Bab 26–50, N4 di luar Minna/modul + gating level modul, N3 pola N2), dipakai skill (`_umum.mjs` mengimpornya)
  dan aplikasi: `getSesiTes` menambahkan `peringatan` ke tiap bacaan AI (dihitung tiap baca, tidak disimpan, tidak pernah ke
  kertas peserta); dialog **Tinjau Bacaan AI** menampilkan kotak kuning "Periksa sebelum mengaktifkan" (id/ja). Daftar Minna lengkap
  tetap tidak masuk aplikasi (hak cipta). Uji `aturanDokkai.test.js` 3/3.
- **情報検索 (D7 tahap 2, L7):** prompt AI — `PANDUAN_INFO` + `rencanaPermintaan`: di L5 N5/N4, bacaan terakhir permintaan pertama
  berupa 情報検索 (1 per pembuatan kode, ≥2 bacaan); spesifikasi skill butir 12 + baris L5 tingkat-N5/N4; gate menghitung baris
  「・」/「※」 sebagai kalimat. Bank: **N5 L5-46…50 dan N4L5-26…30** (selebaran bus, klinik, kamar mandi asrama, kerja paruh waktu,
  apartemen; menu, konser, kolam renang, supermarket, kelas bahasa — N4 dalam keigo), lolos tinjauan buta (blokir 3階{かい}→{がい}
  diperbaiki). Bank N5 230 bacaan / 460 soal (L5 50), N4 130 / 260 (L5 30). Uji `bunpou.test.js` "情報検索".
- **Revisi mutu bacaan lama ke standar KB (D5, §2):** `siapkan.mjs --ketat` (tanpa kelonggaran panjang lama); daftar dari
  `susun-mutu.mjs` (panjang/kalimat di luar batas sekarang, teks bukan narasi tanpa bingkai, L3+ kedua kunci salinan teks):
  N5 L3 28, L4 23, L5 44 (39 di antaranya L5 < 150 huruf) = 95; N4 L3 7, L4 7, L5 25 (semua L5 < 250) = 39. Penulis menambah bingkai,
  kunci parafrase, soal gabungan dua detail (L4), memperpanjang L5 (N5 150–250, N4 250–450), dan sekaligus mengganti kata Bab 26–29 yang
  tidak tertangkap gate (おくれます, 閉まります, 開いています, 大好き, ～のは, dll.). Tinjauan buta per folder; blokir yang diperbaiki
  terutama soal yang bisa ditebak dari akal sehat (jam istirahat/buka yang lazim, resep 3×sehari, cuci piring) dan pengecoh yang juga benar.
- **Hasil akhir revisi mutu:** N5 95 bacaan diganti (L3 28, L4 23, L5 44 — semua L5 lama kini 150–250 huruf), N4 38 diganti
  (L3 6, L4 7, L5 25 — semua L5 kini 250–450; N4L3-18 narasi tidak diubah). Semua lolos tinjauan buta (jawaban buta = kunci di semua
  putaran); soal 1 N4 L5 ditulis ulang agar benar-benar menguji keigo. **Audit gate: N5 0, N4 0, N3 0 error** (14 cacat panjang lama N5
  ikut hilang). Heuristik bentuk: 0 pengumuman tanpa bingkai di N5; sisa tanda = narasi (N4L3-18), esai N3 yang menyebut メール, dan
  bacaan 情報検索 yang kuncinya memang nama butir. `npm test` 156/156, `npm run build` lolos.
- Catatan minor peninjau yang dibiarkan (tidak mengubah kebenaran soal): beberapa soal masih condong ke akal sehat tetapi berjawaban
  tunggal; kata Bab 26–29 berkana/kanji tunggal yang tidak terdeteksi gate (テスト, うるさい, 止まります) di bacaan L1–L2 yang tidak direvisi.
- **Evaluasi AI (F7):** model utama sempat pulih: N5 L1 4/4 lolos, 0 angka kanji/kata hindari/pola terlarang; lalu kuota harian habis
  lagi (20/hari) dan permintaan L5/N3 jatuh ke cadangan yang gagal. Model cadangan menghasilkan 情報検索 sesuai format baru.
- **Cek visual** (Playwright di scratchpad, `/api` dari fixture domain, tanpa data peserta): dialog Tinjau Bacaan AI (peringatan kuning,
  bacaan 情報検索 bergaris), Bank Soal kanji N3 Semua Volume (369 kata, kolom volume), dokkai N5 L5 (情報検索), dokkai N3 L1 (email bergaris).

<!-- Format:
### F1a - <judul langkah> - SELESAI
- Bukti: …
- Perubahan: …
- Kendala/keputusan: …
-->
