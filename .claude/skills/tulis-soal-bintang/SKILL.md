---
name: tulis-soal-bintang
description: Menulis soal bintang (並べ替え, susun kalimat dengan kotak ★) baru untuk bank Bunpou Adventure JOYdata (server/domain/bankSoal/bintangN5.js dan bintangN4.js) lewat alur bergerbang mutu — agen penulis (Sonnet), gate mekanis periksa-bintang.mjs, peninjau buta (Opus) yang menjawab tanpa kunci, cek teks, lalu inject-bintang.mjs hanya bila semuanya lolos; juga mengganti soal bank yang sudah ada (--ganti). Pakai skill ini setiap kali user meminta "tulis soal bintang", "isi bank Bunpou Adventure", "tambah soal Bunpou Adventure", "soal susun kalimat", "lengkapi volume N5/N4", "perbaiki soal bintang", atau menyebut pola/volume Bunpou Adventure yang soalnya belum ada. Soal bintang TIDAK BOLEH ditambahkan ke bank dengan cara lain.
---

# Tulis soal bintang

Soal bintang dipakai peserta sungguhan; begitu sebuah volume punya 4 soal di setiap polanya, volume itu terbuka untuk
semua peserta. Bank pernah diisi 678 soal tanpa tinjauan (kata terputus di tengah, kunci bukan kalimat nyata, tanpa
terjemahan) dan harus dibuang. Karena itu tiga peran dipisah dan tidak ada soal masuk bank sebelum semua gerbang lolos.
Spesifikasi: `docs/bunpou-adventure/spek-kode.md` §2 dan §8. Pelacak: `docs/bunpou-adventure/progres-soal.md`.

**Jangan** melonggarkan `server/domain/soalBintang.js` atau `aturanDokkai.js`, mengubah tes agar soal lolos, atau mengedit
`bintangN5.js`/`bintangN4.js` dengan tangan. Soal ditolak = tulis ulang soalnya.

## Alur

Semua skrip ada di `.claude/skills/tulis-soal-bintang/scripts/` dan dijalankan dari akar repo dengan `node`.
`--tingkat` = `N5` atau `N4`. Folder kerja batch (draf, kertas buta, jawaban) taruh di scratchpad, bukan di repo.

1. **Siapkan.** Pilih pola (daftar `polaVolume(kode)` di `server/domain/bunpouAdventure.js`; urut bab). Ambil entri katalog
   (`server/domain/materiBunpou/katalog.js`) dan kosakata Minna sampai bab pola itu (`docs/kb-dokkai/data/minna-kosakata.json`).
2. **Penulis (Sonnet).** Satu agen per kelompok ±20 pola. Brief: `references/gaya-soal.md` + pola + entri katalog + kosakata.
   Menulis `MIN_VARIAN` (4) varian per pola ke `draf.json` (larik soal bentuk spek §2.1, `status: 'draf'`). Antarvarian
   berbeda konteks dan posisi ★. Penulis memeriksa sendiri dengan langkah 3 dan memperbaiki sampai bersih.
3. **Gate mekanis:**
   `node .claude/skills/tulis-soal-bintang/scripts/periksa-bintang.mjs draf.json --tingkat N5 --varian 4`
   Memanggil `validasiSoalBintang` dan `validasiBankBintang` (sumber yang sama dengan `npm test`). Keluar 0 = lolos.
4. **Peninjau buta (Opus), tanpa kunci:**
   - `node .../buat-buta.mjs draf.json --tingkat N5 --keluar <folder>` membuat `buta.json` (kerangka + 4 potongan bernomor
     acak, tanpa kunci) dan `peta-rahasia.json`.
   - Beri peninjau **hanya `buta.json`** dan `references/gaya-soal.md`; jangan berikan `draf.json`, `peta-rahasia.json`,
     atau pesan yang menyiratkan kunci. Peninjau lebih dulu menjawab, baru boleh melihat apa pun lain. Untuk tiap soal ia
     menulis (a) nomor ★ dan urutan lengkap, (b) setiap urutan lain yang juga gramatikal, (c) kewajaran dan tingkat (`ok`
     atau catatan), (d) catatan terjemahan/furigana. Jawaban disimpan ke `jawaban.json`:
     `[{ kode, bintang, urutan, urutanLain, kewajaran, tingkat, catatan }]`. **Peninjau tidak pernah melihat kunci sebelum
     menyimpan jawabannya.**
   - `node .../bandingkan.mjs draf.json jawaban.json --keluar <folder>` menulis `hasil-banding.json`
     (LOLOS / CATATAN / GAGAL per id). GAGAL = ★ peninjau berbeda dari kunci, atau urutan sah memberi ★ lain: soal
     ambigu, **tulis ulang** (bukan ditambal) dan ulangi dari langkah 3 untuk soal itu (`buat-buta.mjs --subset id1,id2`).
     `urutanLainBaru` = urutan sah yang terlewat penulis: tambahkan ke `urutanLain`.
5. **Cek teks.** Untuk CATATAN dan sampel LOLOS: terjemahan lengkap dan benar, `pembahasan` tepat, aturan R1–R10
   (`references/gaya-soal.md`) terpenuhi. Perbaikan teks saja (terjemahan, pembahasan, urutanLain) tidak mengubah kunci
   dan tidak perlu tinjauan ulang; perubahan potongan/baris/★ wajib ditinjau ulang.
6. **Berkas tinjauan.** Tulis `tinjauan.json` = `[{ "id": "...", "status": "LOLOS" }]` untuk soal yang lolos peninjau dan cek teks.
7. **Inject:**
   `node .../inject-bintang.mjs draf.json --tingkat N5 --tinjauan tinjauan.json`
   (`--ganti` mengganti soal berid sama; `--uji` hanya memeriksa). Skrip MENOLAK seluruh batch bila ada soal yang tidak
   LOLOS di tinjauan atau gagal validator, dan menulis bank berurutan katalog lalu id. Lalu `npm test` dan `npm run build`.
8. **Catat** di `docs/bunpou-adventure/progres-soal.md` (baris per pola dan "Riwayat batch").

Model: penulis Sonnet, peninjau Opus. Jangan push ke `main` tanpa persetujuan user (push `main` men-deploy produksi).
Status soal baru selalu `draf`; `ditinjau` hanya setelah sensei menyetujui.
