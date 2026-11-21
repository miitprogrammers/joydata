# Rencana Implementasi: Revisi Dokkai berbasis KB + Materi N3

Status: usulan teknis, belum dieksekusi · 2026-11-20 · branch usulan `kb-dokkai-n3` (dari `main` @ `4b636f1`)
Dokumen pendamping (folder ini):

| Dokumen | Isi |
|---|---|
| [spek-01-prompt-dokkai.md](spek-01-prompt-dokkai.md) | Teks prompt AI baru (`server/ai/dokkaiAi.js`) untuk N5, N4, N3 + perubahan struktur kode |
| [spek-02-skill-gate.md](spek-02-skill-gate.md) | Skill `generate-soal`: referensi, gate mekanis, dukungan N3, mode revisi (ganti per ID) |
| [spek-03-tampilan-dan-validator.md](spek-03-tampilan-dan-validator.md) | Baris baru di bacaan, normalisasi validator, default jumlah bacaan |
| [spek-04-revisi-bank.md](spek-04-revisi-bank.md) | Revisi bank dokkai N5 (190 bacaan) dan N4 (97 bacaan): angka, tata bahasa, kosakata |
| [spek-05-materi-n3.md](spek-05-materi-n3.md) | Kanji N3 (tes kode, latihan, flashcard, Kanji Adventure) + bank dokkai N3 (50 soal per level) |
| [rencana-uji.md](rencana-uji.md) | Uji unit, regresi, evaluasi keluaran AI, cek visual |
| [progres.md](progres.md) | Log langkah implementasi (diisi saat eksekusi) |

Sumber aturan: [../17-aturan-final.md](../17-aturan-final.md) (keputusan D1–D10). Bukti dan latar belakang: [../README.md](../README.md).

---

## 1. Tujuan dan prinsip

Tujuan:

1. Soal dokkai buatan AI dan bank soal mengikuti aturan KB: bentuk soal JLPT, tata bahasa dan kosakata sesuai
   kurikulum Minna no Nihongo (N5 = Bab 1–25, N4 = Bab 26–50 + modul), angka Arab, panjang L5 baru.
2. Semua bank dokkai yang ada (N5, N4) direvisi agar sesuai aturan yang sama.
3. N3 menjadi tingkat penuh: volume kanji N3 (tes kode, latihan tanpa kode, flashcard, Kanji Adventure) dan bank
   dokkai N3 awal **50 soal per level** (L1–L5).

Prinsip:

1. **17-aturan-final.md adalah satu-satunya sumber aturan.** Prompt, spesifikasi skill, dan gate disalin dari sana;
   bila berbeda, file 17 yang benar dan yang lain diperbaiki.
2. **Additif, tanpa perubahan skema database.** Tidak ada migrasi Supabase. Bacaan AI yang sudah disetujui
   (`dokkai_bacaan_ai`) dan kertas yang sudah dikerjakan tidak diubah: setiap percobaan menyimpan salinan soalnya
   (`insertPercobaan`, `server/db/tesOnlineRepo.js:204-207`), jadi revisi bank hanya berlaku untuk kertas baru.
3. **ID bank tetap.** Revisi mengganti isi bacaan dengan ID yang sama (`L3-12`, `N4L2-5`); jumlah bacaan per level
   tidak berubah, sehingga angka di `tesOnline.test.js` tetap.
4. **Tidak ada soal masuk bank tanpa dua gate** (gate mekanis + peninjau independen tanpa kunci), termasuk revisi
   kecil — aturan skill `generate-soal` yang sudah berlaku.
5. **Kanji tetap mengikuti volume** (aturan user). N3 menambah volume baru; perilaku N5/N4 tidak berubah.
6. **Pemakaian nyata berjalan** (kode tes dipakai sejak 2026-11-02): setiap fase harus meninggalkan aplikasi dalam
   keadaan bisa dipakai; perubahan perilaku tes bernilai diumumkan ke user sebelum di-deploy.
7. **Commit dan deploy hanya atas permintaan user.**

---

## 2. Ringkasan temuan kode

| Bagian | Lokasi | Catatan |
|---|---|---|
| Prompt AI dokkai | `server/ai/dokkaiAi.js` | `TOPIK_DOKKAI` (12–20), `PANDUAN_LEVEL` (23–29, satu set untuk semua tingkat), `PANDUAN_JLPT` (32–51), `panduanModul` (56–73), `panduanPolaDokkai` (76–78, diekspor dan diuji), `SISTEM` (80–117), `SCHEMA` (119–150), `PER_PERMINTAAN = 4` (153), `tulisBacaanDokkai` (174–216) |
| Pemanggil AI | `server/db/tesOnlineRepo.js:459-503` `tambahBacaanAi` | Maks 8 bacaan per permintaan (456); kanji = volume sesi atau `volumeKanjiDefault(jlpt)` (465); setiap bacaan lewat `validasiBacaanAi` (485) |
| Validator | `server/domain/tesOnline.js:572-599` | 2–3 soal, tepat 3 opsi unik, furigana lengkap, `PANJANG_MAKS` N5 800 / N4 1.200 / N3 1.600 (566, termasuk furigana); `teksBersih` hanya trim (554), baris baru di tengah teks lolos |
| LLM | `server/ai/llm.js` | Gemini 2.5 Flash → flash-lite → OpenRouter; batas waktu total 50 s (24) karena serverless 60 s; tidak ada `maxOutputTokens` |
| Tampilan teks | `src/components/portal/tes/FuriganaText.vue` | `<span>` tanpa `white-space` → baris baru hilang. Dipakai di `DokkaiRunner.vue:15`, `BankSoalTes.vue:207`, `TinjauBacaanAiDialog.vue:50`, `HasilTes.vue:57-63` |
| Default jumlah bacaan | `src/views/TesOnlineView.vue:460` | dokkai = 5 bacaan (10 soal) |
| Kertas tersimpan | `server/db/tesOnlineRepo.js:204-207` | `tes_online_percobaan.soal` = salinan kertas |
| Bank dokkai | `server/domain/bankSoal/dokkaiN5.js` (`DOKKAI_LEVEL`, 225 bacaan), `dokkaiN4.js` (`DOKKAI_N4_LEVEL`, 125) | `BANK_DOKKAI = { N5, N4 }` (`tesOnline.js:65`); N3 hanya bacaan AI (59–60) |
| Volume kanji | `server/domain/tesOnline.js:20-32, 488-505` | `JLPT_KANJI = ['N5','N4']`, `VOLUME_KATA`, `SEMUA_LEVEL`, `jlptKanji`/`nomorVolume` (regex `N4`), `VOLUME_KANJI`, `kanjiDariVolume`, `volumeKanjiDefault` (143) |
| Konsumen volume | `server/domain/flashcard.js:10-27` (`VOLUME_FLASHCARD = VOLUME_KANJI`), `server/domain/kanjiAdventure.js:9-10` (`URUTAN_VOLUME = [...VOLUME_KANJI]` = urutan buka) | Volume baru otomatis ikut; label memakai `jlptKanji`/`nomorVolume` |
| Katalog tes | `server/domain/tesOnline.js:81-125` `daftarMateriTes` | Materi kanji per `JLPT_KANJI` (kode `KJ-`, `KJ-N4-`), dokkai per level + `judulPerJlpt` dari `BANK_DOKKAI` |
| Frontend volume | `src/utils/volumeKanji.js:4-10` (regex `N4`), `src/components/BankSoalTes.vue:291` (`['SEMUA','N4SEMUA']`) | Sisanya data-driven dari API (`PortalTesView.vue:262-272`, `TesOnlineView.vue:364-367`, `PortalKanjiAdventureView.vue:288, 408`) |
| Skill bank | `.claude/skills/generate-soal/scripts/_umum.mjs` | `TINGKAT` hanya N5/N4 (17–44; `modul` mengikat tag bunpou **dan** cek kanji volume), batas L5 (28, 41), peringatan pola N5/N4 (176–219), `inject.mjs` hanya menambah (cek `ada === rc.mulai - 1`) |
| Uji | `package.json` script `test` | `bunpou.test.js:134-156` (isi `panduanPolaDokkai`), `tesOnline.test.js:241-280` (validator), angka bank 225/125, `kanjiAdventure.test.js` (urutan volume), `flashcard.test.js` |

Dampak terhadap bank (dihitung 2026-11-20, [../data/dampak-bank.json](../data/dampak-bank.json)):

| Bank | Bacaan terdampak | Angka kanji → Arab | Tata bahasa | Kosakata |
|---|---|---|---|---|
| N5 (225) | 190 | 173 | 4 (L5-2 ので, L5-1 ～ようと思っています, L5-24 Nにします, L3-38 静かにします) | 80 (工場 31, ごみ 7, 先輩 7, …) |
| N4 (125) | 97 | 97 | ditinjau lewat gate baru | ditinjau lewat gate baru |

---

## 3. Keputusan desain

### 3.1 Dari user (17-aturan-final.md)

D1–D8 sesuai rekomendasi; 工場 masuk N4; D9/D10 **direvisi user 2026-11-20**: N3 mendapat materi penuh (kanji
N3 di tes kode, latihan, flashcard, Kanji Adventure; bank dokkai N3). Lihat §9 untuk hal yang masih perlu dikonfirmasi.

### 3.2 Teknis (diusulkan di dokumen ini)

1. **Panduan level per tingkat.** `PANDUAN_LEVEL` menjadi `{ N5: {L1…L5}, N4: {…}, N3: {…} }` dengan rentang karakter dan
   jenis pertanyaan; fungsi baru `panduanLevel(jlpt, level)` diekspor untuk diuji.
2. **Topik per tingkat.** `TOPIK_DOKKAI` dipecah menjadi `TOPIK_UMUM`, `TOPIK_KERJA_N5`, `TOPIK_KERJA_N4`; fungsi
   `topikDokkai(jlpt)`. Topik pabrik/sampah/gaji tidak pernah dikirim untuk N5.
3. **Ukuran permintaan AI per level.** `ukuranPermintaan(jlpt, level)`: 4 bacaan, tetapi 2 untuk L5 dan untuk N3 L3–L5
   (bacaan panjang; batas waktu 50 s). Diukur di F1 dan disesuaikan.
4. **Baris baru hanya di `teks`.** Validator menormalkan baris baru di judul/pertanyaan/pilihan menjadi spasi;
   `FuriganaText` menampilkan baris baru (`white-space: pre-line`).
5. **3 pilihan tetap** (D6); default jumlah bacaan kode dokkai **8** (16 soal).
6. **Gate kosakata Minna hanya di skill (lokal).** Data Minna (hak cipta 3A) tidak masuk kode server; aplikasi cukup
   mengandalkan prompt + tinjauan sensei. Peringatan otomatis di aplikasi ditunda (lihat §9 Q6).
7. **N3 tanpa modul bunpou.** Bank N3 seperti N5: `modul: false`, tetapi kanji dibatasi volume (N5+N4+N3). Di skill,
   flag `modul` dipisah dari flag baru `kanjiVolume`.
8. **Volume kanji N3** mengikuti pola N4: `server/domain/bankSoal/kanjiN3.js` (`KANJI_VOLUME_N3`, `BACAAN_LAIN_N3`), kode
   `N3VOL1…N3VOLn`, `N3SEMUA`, nama ujian `KJ-N3-V1…KJ-N3-ALL`; dibuka di Kanji Adventure setelah `N4VOL5`.
9. **Revisi bank dengan ID tetap** lewat mode baru skill: `siapkan.mjs --revisi <id…>` + `inject.mjs --ganti`.
10. **Konversi angka bank secara mekanis** (`konversi-angka.mjs`) dengan tabel bacaan, lalu gate + cek sampel; perubahan
    isi (tata bahasa, kosakata) lewat penulis + peninjau.

---

## 4. Tahap implementasi

Urutan mengikuti ketergantungan. Setiap fase diakhiri `npm test` hijau, `npm run build`, dan catatan di
[progres.md](progres.md).

| Fase | Isi | Dokumen | Bergantung pada |
|---|---|---|---|
| **F0** | Persiapan: branch, baseline `npm test`, sampel keluaran AI "sebelum" (3 kode per level N5/N4), konfirmasi §9 | — | — |
| **F1** | Prompt AI baru (N5, N4, N3) + uji `dokkaiAi.test.js` | spek-01 | F0 |
| **F2** | Validator & tampilan: normalisasi baris baru, `FuriganaText` pre-line, default 8 bacaan | spek-03 | F0 |
| **F3** | Skill `generate-soal`: referensi baru, gate baru (pola, angka, kosakata Minna), TINGKAT N3, mode revisi | spek-02 | F1 (teks aturan), F2 |
| **F4** | Kanji N3: data volume, `tesOnline.js`, utils frontend, flashcard, Kanji Adventure, latihan, uji | spek-05 §A | F0; data dari §9 Q1 |
| **F5** | Revisi bank N5 dan N4: (a) konversi angka, (b) perbaikan tata bahasa & kosakata N5, (c) tinjauan N4 | spek-04 | F3 |
| **F6** | Bank dokkai N3: `dokkaiN3.js`, `BANK_DOKKAI.N3`, 5 level × 25 bacaan × 2 soal = **250 soal** | spek-05 §B | F3, F4 |
| **F7** | Evaluasi akhir: sampel AI "sesudah" vs "sebelum", cek visual, ringkasan ke user | rencana-uji | F1–F6 |
| (nanti) | 情報検索 (D7 tahap 2), peringatan kosakata di aplikasi (Q6) | — | dirancang terpisah |

Perkiraan beban: F1–F3 dan F4 (kode) kecil–sedang; F5 dan F6 besar karena konten (±290 bacaan direvisi, 125 bacaan N3
ditulis) dan masing-masing melewati dua gate. F5 dan F6 dijalankan per level supaya bisa dihentikan dan dilanjutkan.

---

## 5. Pengujian

Ringkas (rinci di [rencana-uji.md](rencana-uji.md)):

- **Unit:** `dokkaiAi.test.js` baru (panduan level, pola, topik, ukuran permintaan); `bunpou.test.js` disesuaikan;
  `tesOnline.test.js` (baris baru, volume N3, katalog `KJ-N3-*`, bank N3 125/250); `kanjiAdventure.test.js` (urutan
  volume + N3); `flashcard.test.js` (volume N3).
- **Bank:** gate mekanis + tinjauan buta untuk setiap bacaan baru/berubah; `npm test` setelah setiap inject.
- **AI:** protokol sampel sebelum/sesudah dengan rubrik dari 02/17 (bingkai, pengecoh dari teks, kunci parafrase,
  kosakata, panjang).
- **Visual:** Bank Soal, Tinjau Bacaan AI, portal tes/latihan, flashcard, Kanji Adventure dengan volume N3 (Playwright
  + fixture lokal, seperti cek visual halaman staf yang sudah ada).

---

## 6. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Bacaan L5 lebih panjang → permintaan AI melewati 50 s | Kode AI gagal dibuat | `ukuranPermintaan` 2 untuk L5/N3; ukur waktu di F1; turunkan ke 1 bila perlu |
| Prompt lebih panjang → model fallback (flash-lite) lebih sering ditolak validator | Lebih banyak bacaan ditolak | Ukur tingkat tolak di F7; prompt dibuat ringkas (daftar, bukan paragraf) |
| Konversi angka salah bacaan (6本 ろっぽん) | Furigana salah di pembahasan | Tabel bacaan eksplisit, gate "furigana baru", cek manual semua bacaan angka tidak teratur |
| Volume revisi besar (±290 bacaan) | Lama, rawan kelelahan peninjau | Per level, batch ≤ 25 bacaan per agen, konversi angka mekanis terpisah dari revisi isi |
| Data kanji N3 tanpa materi sensei | Bacaan/arti salah di tes bernilai | §9 Q1: minta Excel sensei; bila disusun Claude, wajib ditinjau sensei sebelum dipakai di kode bernilai — **teratasi: sudah ditinjau sensei (2026-11-21)** |
| Empat pola N5 yang berubah jadi boleh (⚠️ di 17) | Bacaan N5 "lebih sulit" dari sebelumnya | §9 Q3 dikonfirmasi user sebelum F1 |
| Hak cipta kosakata Minna | Data 3A tersebar | Data hanya di `docs/` + skill lokal; tidak masuk bundle server/frontend |
| Angka di file uji berubah (N3 bank, volume N3) | `npm test` merah | Diperbarui di fase yang sama, dicatat di progres |
| Kanji Adventure: volume N3 baru | Progres peserta lama | Additif: volume N3 terkunci sampai N4VOL5 tuntas; progres lama tidak berubah |

---

## 7. Daftar file yang disentuh

| File | Fase | Perubahan |
|---|---|---|
| `server/ai/dokkaiAi.js` | F1 | SISTEM, PANDUAN_LEVEL per tingkat, PANDUAN_JLPT, topik per tingkat, ukuran permintaan |
| `server/ai/dokkaiAi.test.js` (baru) + `package.json` | F1 | uji prompt; didaftarkan di script `test` |
| `server/domain/bunpou.test.js` | F1 | sesuaikan ekspektasi `panduanPolaDokkai` N5/N3 |
| `server/domain/tesOnline.js` | F2, F4, F6 | normalisasi baris baru; N3: `JLPT_KANJI`, `VOLUME_KATA`, `SEMUA_LEVEL`, `jlptKanji`, `nomorVolume`, `volumeKanjiDefault`, `BANK_DOKKAI.N3`, komentar |
| `src/components/portal/tes/FuriganaText.vue` | F2 | `white-space: pre-line` |
| `src/views/TesOnlineView.vue` | F2 | default 8 bacaan |
| `src/utils/volumeKanji.js`, `src/components/BankSoalTes.vue:291` | F4 | regex & daftar SEMUA untuk N3 |
| `src/views/portal/PortalTesView.vue` | F4 | komentar; cek baris volume N3 |
| `src/locales/id.js`, `ja.js` | F2, F4 | teks bila perlu (label N3, petunjuk jumlah bacaan) |
| `server/domain/bankSoal/kanjiN3.js` (baru) | F4 | volume kata N3 |
| `server/domain/bankSoal/dokkaiN3.js` (baru) | F6 | bank dokkai N3 |
| `server/domain/bankSoal/dokkaiN5.js`, `dokkaiN4.js` | F5 | revisi isi, ID tetap |
| `server/domain/tesOnline.test.js`, `kanjiAdventure.test.js`, `flashcard.test.js` | F2, F4, F6 | angka dan kasus baru |
| `.claude/skills/generate-soal/SKILL.md`, `references/*.md`, `scripts/_umum.mjs`, `siapkan.mjs`, `inject.mjs`, `rapikan.mjs`, `scripts/konversi-angka.mjs` (baru) | F3, F5 | aturan baru, N3, mode revisi |
| `docs/kb-dokkai/17-aturan-final.md`, `implementasi/progres.md` | semua | catatan keputusan dan progres |

Tidak disentuh: skema Supabase, `server/ai/llm.js`, penilaian (`nilaiTes`), bacaan AI yang sudah disetujui.

---

## 8. Definition of done

1. Prompt AI N5/N4/N3 sama isinya dengan 17-aturan-final.md; uji prompt hijau.
2. Bacaan dengan baris baru tampil benar di portal, Bank Soal, dan Tinjau Bacaan AI.
3. Bank N5 dan N4: 0 angka kanji dengan satuan (kecuali pengecualian), 0 pola terlarang menurut gate baru, 0 kata N5 di
   luar Minna Jilid I (kecuali yang disetujui), semua bacaan yang berubah lolos tinjauan buta; jumlah bacaan tetap.
4. Kanji N3 tersedia sebagai materi tes kode, latihan, flashcard, dan Kanji Adventure; uji dan cek visual lolos.
5. Bank dokkai N3: 5 level × 25 bacaan × 2 soal, lolos kedua gate; kode bank berpola N3 bisa dibuka tanpa bacaan AI.
6. `npm test` dan `npm run build` hijau; ringkasan perubahan + hasil evaluasi AI dilaporkan ke user; belum di-commit
   sampai user meminta.

---

## 9. Pertanyaan yang perlu dijawab user sebelum/selama eksekusi

| No | Pertanyaan | Usulan bawaan bila tidak dijawab | Diperlukan sebelum |
|---|---|---|---|
| Q1 | **Sumber data kanji N3 per volume.** N4 berasal dari Excel sensei (`DATABASE_KANJI_JLPT_N4_PER_VOLUME.xlsx`). Untuk N3: ada Excel serupa dari sensei? | Claude menyusun 5 volume (±75 kata) dari daftar 369 kanji N3 (KB file 13) dengan kata contoh, bacaan, dan arti Indonesia — **wajib ditinjau sensei** sebelum dipakai di kode bernilai (**sudah ditinjau sensei, 2026-11-21**) | F4 |
| Q2 | "50 soal per kategori" = **50 soal per level L1–L5** (25 bacaan × 2 soal), total 125 bacaan / 250 soal? | Ya | F6 |
| Q3 | Empat pola yang kini boleh di N5 (～ことができます, ～てあげます／くれます／もらいます, ～たら, ～ても) — tetap boleh? | Ya (prinsip D2) | F1 |
| Q4 | ～によって di N4: sensei mengecek Minna Bab 37 | Tetap dilarang | F1 |
| Q5 | "Revisi semua bank" = bank dokkai N5 + N4. Bank kanji N5/N4 tidak terkena aturan KB baru — cukup tidak diubah? | Ya, kanji N5/N4 tidak diubah | F5 |
| Q6 | Peringatan otomatis "kata di luar Minna" di aplikasi (butuh data Minna di server)? | Tidak sekarang; hanya di skill lokal | (nanti) |
| Q7 | Bank N3 tanpa modul: level N3 dipetakan ke jenis teks resmi (L1–L2 短文, L3–L4 中文, L5 長文) | Ya | F6 |
