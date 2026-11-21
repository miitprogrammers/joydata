# Spek 04 — Revisi bank dokkai N5 dan N4

Fase F5 di [plan.md](plan.md). Butuh F3 (gate baru + mode revisi + `konversi-angka.mjs`) selesai lebih dulu.
Data lengkap per bacaan: [../data/dampak-bank.json](../data/dampak-bank.json) (dihitung 2026-11-20 dari bank di `main` @ `4b636f1`).

## 1. Cakupan

"Revisi semua bank soal" = bank dokkai **N5** (`dokkaiN5.js`, 225 bacaan) dan **N4** (`dokkaiN4.js`, 125 bacaan). Bank kanji N5/N4
tidak terkena aturan KB baru dan tidak diubah (asumsi, plan §9 Q5). Bank N3 dibuat baru di F6 dengan aturan baru sejak awal.

| Bank | Terdampak | Hanya angka (mekanis) | Revisi isi | Dasar |
|---|---|---|---|---|
| N5 | 190 | 107 | 83 (80 kosakata, 4 tata bahasa; sebagian juga angka) | D1–D4 |
| N4 | 97 | 97 | ditentukan oleh gate baru (pola kelompok D/E, kosakata di luar Minna) | D4, D8 |

Per level N5 (bacaan terdampak / angka / kosakata / tata bahasa): L1 28/24/9/0 · L2 43/43/13/0 · L3 35/29/15/1 · L4 44/43/21/0 ·
L5 40/34/22/3. N4 per level (angka): L1 16 · L2 19 · L3 19 · L4 19 · L5 24.

## 2. Daftar revisi isi N5

### 2.1 Tata bahasa (D1, D2)

| ID | Temuan | Perbaikan |
|---|---|---|
| L5-2 | 「みんなで作{つく}ったので」 — ～ので (Bab 39) | ～から |
| L5-1 | 「行{い}こうと思{おも}っています」 + pertanyaan 「何{なに}をしようと思{おも}っていますか」 — bentuk maksud (Bab 31) | ～たいです／～に行{い}きます; tulis ulang soal |
| L5-24 | 「十日が雨の時は、次の日にします」 — Nにします (Bab 44) | 「…次{つぎ}の日{ひ}にやります」 (やります Bab 6) |
| L3-38 | Pertanyaan 「静{しず}かにしますか」 — ナA+にします (Bab 44); kasus perbatasan | Tulis ulang pertanyaan tanpa ～にします, mis. 「どうして夜{よる}10時{じ}から部屋{へや}で話{はな}してはいけませんか」 (disesuaikan dengan isi teks; jangan 声 — Bab 27) |

### 2.2 Kosakata (D3) — kata Jilid II / di luar Minna

| Kata | Bacaan | ID |
|---|---|---|
| 工場 | 31 | L1-23, L1-25, L1-27, L1-29, L1-31, L1-33, L1-41, L1-44, L2-22, L2-26, L2-32, L2-34, L2-41, L2-45, L3-11, L3-24, L3-31, L3-41, L4-21, L4-22, L4-29, L4-30, L4-41, L4-44, L5-11, L5-12, L5-20, L5-29, L5-30, L5-34, L5-40 |
| ごみ | 7 | L1-27, L2-24, L3-12, L3-35, L3-45, L4-23, L5-26 |
| 先輩 | 7 | L1-33, L3-42, L4-44, L5-12, L5-28, L5-42, L5-45 |
| 映画館 | 4 | L2-19, L4-7, L4-38, L5-29 |
| 夕方 | 4 | L2-21, L2-37, L3-8, L4-1 |
| 大人 | 4 | L2-29, L3-6, L4-16, L4-40 |
| 台所 | 4 | L2-40, L3-45, L4-43, L5-44 |
| 授業 | 4 | L3-14, L4-4, L4-9, L5-4 |
| 給料 | 4 | L3-26, L4-24, L5-13, L5-22 |
| 動物園 | 3 | L2-29, L4-40, L5-3 |
| 運動 | 3 | L2-32, L3-19, L5-18 |
| 入口 | 3 | L3-30, L3-35, L3-41 |
| 予定 | 3 | L4-1, L4-4, L4-17 |
| 言葉 | 3 | L5-10, L5-33, L5-42 |
| 北口 | 2 | L2-36, L5-8 |
| 花火 | 2 | L3-28, L5-24 |
| 場所 | 2 | L4-26, L4-31 |
| 茶色, 運動会, 機械, 台風, 計画, 材料, 結婚式, 返事 | 1 tiap kata | L1-8, L3-19, L3-24, L3-31, L4-1, L4-10, L4-15, L5-16 |

Pengganti yang dianjurkan (kata Minna Jilid I): 工場 → 会社; 先輩 → 会社の人; 映画館 → 映画 (を見に行きます); 夕方 → 午後 6時ごろ;
台所 → 部屋／うち; 授業 → 日本語のクラス／勉強; 予定 → (hapus, pakai ～ます); 場所 → ところ; 言葉 → 日本語; 入口 → 前;
給料・ごみ → pindahkan topiknya (bacaan diganti topik lain, ID tetap). Pengganti lain boleh asal ada di Minna Bab 1–25.

**Topik bacaan yang hanya hidup bila kata itu ada** (mis. bacaan tentang pabrik, gaji, atau buang sampah): tulis ulang
dengan topik lain dari `TOPIK_UMUM`/`TOPIK_KERJA_N5`; ID, level, dan panjang tetap.

## 3. Prosedur

Kerja **per level, satu folder kerja untuk semua kategori** (uji alur 2026-11-20: folder khusus angka tidak bisa di-inject
selama bacaannya juga butuh revisi kata). Paling banyak ±25 bacaan per agen penulis. Untuk tiap level:

1. `gate.mjs --audit --jlpt N5 --level Lx` → daftar error (angka, kata, mutu) per id.
2. `siapkan.mjs --jlpt N5 --level Lx --revisi-dari docs/kb-dokkai/data/dampak-bank.json` (semua kategori) **ditambah**
   `--revisi <id…> --alasan mutu` untuk cacat mutu dari audit (kutipan pembahasan, format, judul kembar).
3. `konversi-angka.mjs` → semua angka dikonversi mekanis; putuskan setiap `PERIKSA` di `laporan-angka.md`.
4. Penulis (brief mode revisi) memperbaiki bacaan berkategori `kata`, `pola`, `mutu`; `rapikan` (N4) → gate sampai lolos.
5. `buta.mjs` + peninjau independen untuk bacaan yang isinya berubah selain angka → banding → perbaiki → tinjau ulang.
6. `inject.mjs --uji` lalu `inject.mjs` (ganti per id) → `npm test` (angka bank tidak berubah) → `gate.mjs --audit` level
   itu: 0 error angka dan kata → catat di [progres.md](progres.md).

N4: langkah yang sama; kategorinya angka (97 bacaan) ditambah pelanggaran yang ditemukan audit (pola kelompok D/E,
kosakata di luar Minna) — hanya bacaan yang benar-benar melanggar yang direvisi.

Cacat mutu lama yang ditemukan audit pertama N5 (selain angka dan kata): kutipan pembahasan tidak ada di teks (L1-5, L2-2,
L4-7, L5-3), format pembahasan (L1-9, L5-3, L5-8), judul kembar (デパートで, L2-5). Bacaan lama yang hanya melanggar batas
panjang/jumlah kalimat (10 + 7 temuan, kebanyakan bacaan nomor 1–20) dibiarkan dan dicatat.

## 4. Kriteria selesai

- Audit gate pada bank N5 dan N4: 0 error angka; 0 kata N5 dari daftar hindari; peringatan pola tersisa sudah dibaca dan
  diputuskan (dicatat).
- Semua bacaan yang isinya berubah lolos tinjauan buta; kunci yang berubah tercatat di `ringkasan-revisi.md`.
- ID dan jumlah bacaan per level tidak berubah; `npm test` hijau.
- Bacaan L5 lama tidak wajib diperpanjang ke 150–250 (N5) / 250–450 (N4); bacaan L5 baru (AI, bank N3) mengikuti batas baru.
  Bila user ingin L5 lama diperpanjang, itu tugas terpisah.
