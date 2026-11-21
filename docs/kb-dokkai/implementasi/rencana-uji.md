# Rencana uji

Pendamping [plan.md](plan.md). Setiap fase ditutup dengan `npm test` + `npm run build` hijau dan catatan di [progres.md](progres.md).

## 1. Baseline (F0)

| Yang dicatat | Cara |
|---|---|
| Jumlah uji lolos | `npm test` → catat total (mis. "107/107") |
| Build | `npm run build` lolos |
| Sampel AI "sebelum" | 6 permintaan nyata ke `tulisBacaanDokkai` (N5 L1, N5 L3, N5 L5, N4 L2, N4 L5, N3 L3; 4 bacaan tiap permintaan, kanji = volume bawaan): simpan JSON mentah, hasil `validasiBacaanAi` (alasan tolak), dan durasi permintaan. Disimpan di scratchpad, **bukan** di repo |

Permintaan nyata memakai API key (`GEMINI_API_KEY`) dari `.env` lokal; dijalankan lewat skrip sekali pakai di scratchpad.

## 2. Uji unit per fase

| Fase | File | Kasus |
|---|---|---|
| F1 | `server/ai/dokkaiAi.test.js` (baru) | daftar di spek-01 §6 |
| F1 | `server/domain/bunpou.test.js` | 134–156 tetap lolos; tambah: N3 tidak memuat contoh ～ようにする |
| F2 | `server/domain/tesOnline.test.js` | `teks` bergaris lolos dan utuh; baris baru di `tanya`/`opsi`/`judul` jadi spasi; `\n\n\n` → `\n\n`; `tanpaFurigana` mempertahankan baris |
| F4 | `server/domain/tesOnline.test.js` | `JLPT_KANJI` memuat N3; katalog kanji memuat `N3VOL1…`, `N3SEMUA`, `KJ-N3-V1`, `KJ-N3-ALL`; `jlptKanji('N3VOL2') === 'N3'`; `nomorVolume('N3VOL2') === '2'`; `volumeKanjiDefault('N4')` tidak memuat volume N3; `volumeKanjiDefault('N3')` memuat N3; `kanjiTingkat('N4')` ⊂ `kanjiTingkat('N3')`; baris 268 tetap |
| F4 | `server/domain/flashcard.test.js` | volume N3 tersedia dan berlabel "N3 · Volume n" |
| F4 | `server/domain/kanjiAdventure.test.js`, `src/views/portal/kanjiAdventureUI.test.js`, `src/services/kanjiAdventure.test.js` | urutan volume: N3VOL1 tepat setelah N4VOL5; `itemVolume('N3VOL1')` berisi; pemilih tingkat menampilkan N3 |
| F4 | uji data `kanjiN3.js` | tiap entri lengkap; tidak ada arti beririsan dalam satu volume |
| F5 | (tidak ada uji baru) | angka bank tetap (225/450, 125/250); `bunpou.test.js:115` memakai `kanjiTingkat('N4')` |
| F6 | `server/domain/tesOnline.test.js:53` dan pool | N3 125/250; pool L2 N3 = 25 + AI; kode bank N3 bisa dibuka; kanji bank N3 ⊂ `kanjiTingkat('N3')` |

Semua file uji baru didaftarkan di script `test` `package.json`.

## 3. Gerbang mutu bank (F5, F6)

- Gate mekanis tanpa error untuk setiap bacaan baru/berubah.
- Tinjauan buta: peninjau baru menjawab tanpa kunci; jawaban ≠ kunci → bacaan diblokir sampai diperbaiki dan ditinjau ulang.
- `gate.mjs --audit` pada seluruh bank setelah fase selesai: bukti kriteria spek-04 §4.

## 4. Evaluasi keluaran AI (F1, diulang di F7)

Ulangi 6 permintaan baseline dengan prompt baru, lalu bandingkan.

| Ukuran | Cara | Target |
|---|---|---|
| Tingkat tolak validator | jumlah bacaan ditolak / diminta, per alasan | tidak lebih buruk dari baseline |
| Durasi permintaan | ms per permintaan, terutama L5 dan N3 | < 45 s (batas total 50 s) |
| Panjang | karakter tanpa furigana vs rentang `panduanLevel` | ≥ 80% bacaan di dalam rentang |
| Pola & kosakata | jalankan pemeriksaan gate (`gate.mjs --audit --file <json>`) pada keluaran AI | 0 error angka; 0 kata hindari N5; peringatan pola dibaca manual |
| Rubrik bentuk soal | per bacaan, 0/1: bingkai bila bukan narasi · kedua pengecoh dari teks · minimal satu kunci parafrase (L3+) · pilihan sejajar · judul tidak membocorkan jawaban | ≥ 90% butir terpenuhi |
| Kunci | satu subagen peninjau menjawab tanpa kunci (cara tinjauan buta skill) | 0 kunci salah |

Hasil ditulis di [progres.md](progres.md) sebagai tabel sebelum/sesudah dan dilaporkan ke user. Bila target tidak tercapai,
prompt disesuaikan (spek-01 diperbarui dulu) sebelum lanjut ke F5/F6.

## 5. Cek visual

Dengan fixture lokal (Playwright menjawab `/api` dari fixture; dev server di-restart setiap edit):

| Halaman | Yang dicek |
|---|---|
| Tes Online → Bank Soal | bacaan bergaris; materi kanji N3; filter volume N3 |
| Tes Online → form kode | default 8 bacaan + teks saran; pilihan volume N3; tingkat dokkai N3 dengan bank |
| Tinjau Bacaan AI | bacaan email bergaris |
| Portal → tes/latihan | dokkai resmi (tanpa furigana) dan latihan (dengan furigana) bergaris; tombol kanji N3; tombol dokkai N3 aktif |
| Portal → flashcard | volume N3 |
| Portal → Kanji Adventure | N3VOL1 terkunci sebelum N4VOL5 tuntas; terbuka sesudahnya |
| Monitor Latihan | label volume N3 |

## 6. Regresi

- Kode tes lama (N5/N4, bank dan AI) tetap bisa dibuka dan dinilai; hasil percobaan lama tampil sama (kertas tersimpan).
- Progres Kanji Adventure dan flashcard peserta lama tidak berubah.
- Kode dokkai N4 dengan pilihan volume `null` tetap memakai kanji N5+N4.

## 7. Sebelum deploy (hanya bila user meminta)

- Tidak ada migrasi database; variabel lingkungan Vercel tidak berubah.
- `npm test`, `npm run build` hijau di branch; ringkasan perubahan untuk user; commit dan push atas izin user.
