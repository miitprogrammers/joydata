# Rencana: Materi Bunpou

Status: F1–F3 selesai, menunggu tinjauan pilot ([progres.md](progres.md)) · 2026-11-21 · branch `materi-bunpou` (worktree `.worktree/materi-bunpou`)

Desain lengkap: [design.md](design.md) · mockup yang bisa diklik: [mockup.html](mockup.html) · contoh isi:
[contoh-materi-tara.md](contoh-materi-tara.md)

## 1. Tujuan

Sensei membuka **Materi Bunpou** di dashboard, mengetik pola yang ingin dijelaskan (`たら`, `tara`, `kalau`, `Bab 25`,
`#11`), memilih dari daftar, lalu mendapat **halaman presentasi** yang siap diproyeksikan. Isinya: cara membentuk,
makna, padanan bahasa Indonesia, 3–5 contoh kasus pemakaian dalam kehidupan pemagang, perbandingan dengan pola mirip,
kesalahan umum, dan latihan singkat.

Kriteria berhasil:
- Dari halaman dibuka sampai slide pertama tampil: ≤ 3 interaksi (ketik, pilih, buka), tanpa menunggu server per ketikan.
- Slide terbaca dari belakang kelas: teks utama ≥ 24 px pada kanvas 1280×720.
- Setiap kalimat contoh hanya memakai pola dan kosakata yang sudah diajarkan sampai bab materinya.
- Semua isi berstatus jelas: `draf` (tulisan Claude, lolos gate dan peninjau) atau `ditinjau` (sudah dicek sensei).

## 2. Kenapa urutannya seperti ini

Joy 1 dan Joy 2 sudah lulus Ujian N5 (23 Okt 2026), jadi sekarang di tahap N4 (Minna II + modul 111 Bunpo N4). Joy 3
sedang di tahap N5 (Shiken Bunpou Bab 1–15 sudah lewat, 9 Okt). Karena itu, yang paling cepat terpakai adalah **pola modul
N4** dan **Minna Bab 16–25**. Isi ditulis setelah tampilannya jadi dan gayanya disetujui lewat pilot, supaya ratusan materi
tidak perlu ditulis ulang.

## 3. Fase

| Fase | Isi | Hasil | Menunggu |
|---|---|---|---|
| **F0** | Persiapan: bawa KB ke branch, putuskan pertanyaan §7 | `docs/kb-dokkai/` tersedia di branch | jawaban user |
| **F1** | Katalog semua pola N5 + N4 | `katalog.js` + laporan `docs/materi-bunpou/katalog.md` untuk dicek | — |
| **F2** | Halaman (kode) dengan data pilot | cari, daftar, presentasi, mode baca, layar penuh, akses, i18n, tes | F1 |
| **F3** | Pilot isi: 6 materi | ～たら · ～と · ～ば · ～なら · ～てください · ～ています | F2 |
| — | **Tinjauan pilot oleh user/sensei** | gaya disetujui atau `gaya-materi.md` direvisi | sensei |
| **F4** | Skill `tulis-materi-bunpou` | SKILL.md, `gaya-materi.md`, `periksa-materi.mjs`, `inject-materi.mjs` | F3 disetujui |
| **F5** | Produksi isi per batch (±8 pola/batch) | urutan di §4 | F4 |
| **F6** *(opsional)* | Tinjauan sensei di aplikasi | tombol "Sudah dicek" / "Laporkan koreksi" + tabel Supabase | keputusan Q3 |
| **F7** *(opsional)* | Integrasi | chip pola di Bank Soal → materi; "dipakai di N bacaan bank" di slide ringkasan | — |

### F0 · Persiapan
- `docs/kb-dokkai/` **belum di-commit di branch mana pun** (masih untracked di `main`), sehingga tidak ikut ke worktree ini.
  Skill dan generator katalog perlu membacanya. Pilihan: (a) commit KB ke `main` lalu merge ke branch ini, atau
  (b) salin ke worktree tanpa commit. Lihat Q7.
- Jawaban §7 menentukan F1 (cakupan) dan F2 (akses, perilaku terjemahan).

### F1 · Katalog
- Skrip di scratchpad menyusun katalog dari `minna-pola.json` (212 baris), `bunpouN4.js` (104 pola), dan
  `grammar-n5/n4.json`. Baris varian digabung (はNです／じゃありません／ですか → satu materi), dan pola yang muncul di
  Minna *dan* modul dijadikan satu entri dengan dua sumber.
- Perkiraan **±180–220 materi N5 + N4**. Angka pastinya keluar dari F1.
- Hasilnya `katalog.md` (tabel per bab dan per kategori modul, berisi kolom sumber) untuk dicek user sebelum isi
  ditulis. Pengelompokan yang salah lebih murah diperbaiki di tahap ini.
- Aturan: `id` = slug romaji yang stabil (`tara`, `te-kudasai`, `nakereba-narimasen`). Nomor modul tidak pernah diubah
  (bacaan bank menunjuk nomor itu).

### F2 · Halaman
- Server: `server/domain/materiBunpou/{katalog,materiN5,materiN4,index}.js`, dua endpoint GET, halaman `materi-bunpou`
  di `SEED_PAGES` (id 24, bawaan admin/manager/sensei, urutan setelah Monitor Latihan). Saat server mulai, halaman ini
  otomatis ditambahkan ke DB dengan role bawaannya (`engine.js`).
- Klien: `MateriBunpouView.vue`, `MateriBunpouPresentasiView.vue`, `components/materi-bunpou/*`, `utils/cariBunpou.js`,
  prop `sorot` di `FuriganaText.vue`, route, kunci i18n `materiBunpou.*` (id + ja).
- Tes: `materiBunpou.test.js` (skema, id unik, rujukan valid, furigana lengkap, sorotan, batas panjang) dan
  `cariBunpou.test.js` (normalisasi kana/romaji, urutan hasil). Keduanya ditambahkan ke `npm test`.
- Cek visual memakai Playwright dengan fixture lokal (cara di memori proyek: tanpa token staf, `/api` dijawab dari file),
  di lebar 1280, 1920, dan 390 px, ditambah layar penuh.

### F3 · Pilot isi
- Enam materi dipilih karena mewakili hal yang berbeda. Empat *kalau* (～たら・と・ば・なら) menguji slide Bandingkan dan
  bagian "Perhatikan". ～てください adalah pola N5 awal dengan kosakata sangat terbatas. ～ています punya banyak makna
  (Bab 14, 15, 28) yang menguji materi dengan lebih dari satu sumber bab.
- Ditulis dengan alur skill (penulis → gate → peninjau buta), meski skillnya belum dibakukan, lalu ditampilkan di
  halaman. User/sensei menilai **di layar presentasi**, bukan di file data.

### F4 · Skill `tulis-materi-bunpou`
- `.claude/skills/tulis-materi-bunpou/`: `SKILL.md` (alur, kapan dipakai), `references/gaya-materi.md` (aturan
  [design § 7](design.md#7-aturan-penulisan-isi) ditambah pelajaran dari pilot), `references/skema.md`,
  `scripts/periksa-materi.mjs` (gate; memanggil validator domain yang sama dengan `npm test`), `scripts/inject-materi.mjs`
  (tambah atau `--ganti` per id), serta mode revisi untuk koreksi sensei.
- Peninjau buta meniru pelajaran dari `generate-soal`. Peninjau menerima kalimat Jepang tanpa terjemahan dan latihan
  tanpa jawaban. Kalau terjemahan atau jawabannya berbeda dari penulis, kalimat itu ambigu atau salah.

### F5 · Produksi isi
Urutan bawaan (bisa diubah lewat Q1):

| Batch | Cakupan | Perkiraan |
|---|---|---|
| 1–13 | **Modul N4**, kategori 1–12 (urut nomor modul). Pola modul yang sudah ditulis sebagai materi N5 cukup diberi sumber modul | ±70–90 materi baru |
| 14–19 | **N5 Minna Bab 16–25** (kelas Joy 3 sedang/akan di bab ini) | ±40 |
| 20–25 | **N5 Minna Bab 1–15** | ±45 |
| 26–30 | **N4 Minna II** yang belum tercakup modul | ±30–40 |
| (nanti) | N3 (182 pola jlptsensei), hanya bila diminta | — |

Setelah setiap batch: gate 0 error, peninjau lolos, `npm test` lolos, laporan singkat ke user (pola apa saja, catatan
peninjau yang dibiarkan).

### F6 · Tinjauan sensei di aplikasi (opsional)
- Tabel `materi_bunpou_tinjauan` (materi_id, staff_id, jenis `ok`/`koreksi`, catatan, dibuat). Perubahannya hanya
  menambah tabel (additive).
- Di toolbar presentasi: "✓ Sudah saya cek" dan "✎ Laporkan koreksi" (teks bebas, slide mana). Di daftar: "✓ dicek 2
  sensei" / "1 koreksi terbuka".
- Koreksi dikerjakan Claude lewat mode revisi skill, lalu di-deploy. Status `ditinjau` di data diubah setelah koreksi
  selesai.

## 4. File yang akan disentuh

| Baru | Diubah |
|---|---|
| `server/domain/materiBunpou/{katalog,materiN5,materiN4,index}.js` + `materiBunpou.test.js` | `server/apiApp.js` (2 route) |
| `src/views/MateriBunpouView.vue`, `MateriBunpouPresentasiView.vue` | `server/db/seedData.js` (1 halaman + urutan) |
| `src/components/materi-bunpou/*.vue` (±9 komponen) | `src/router/index.js` |
| `src/utils/cariBunpou.js` + tes | `src/components/portal/tes/FuriganaText.vue` (prop `sorot`, perilaku lama tetap) |
| `.claude/skills/tulis-materi-bunpou/**` | `src/locales/id.js`, `ja.js` |
| `docs/materi-bunpou/katalog.md`, `progres.md` | `package.json` (daftar tes) |

Tidak ada perubahan skema DB sampai F6.

## 5. Definition of done (F2–F3)

- [ ] `/materi-bunpou` muncul di menu sensei/admin/manager. Role lain tidak bisa membuka halaman dan API-nya (403).
- [ ] Kueri `kalau`, `tara`, `たら`, `bab 25`, `#11` memberi hasil yang benar. Kata tanpa hasil menampilkan pesan dan saran.
- [ ] Presentasi: navigasi keyboard/klik/clicker, terjemahan dan jawaban tersembunyi lalu terbuka, furigana on/off, layar
      penuh, mode baca, `?slide=` di URL, kembali ke daftar dengan kueri tetap.
- [ ] Tidak ada teks yang terpotong atau meluber di kanvas pada 6 materi pilot (cek visual 1280, 1920, 390 px).
- [ ] `npm test` dan `npm run build` lolos. Tampilan Tes Online/Bank Soal yang memakai `FuriganaText` tidak berubah.
- [ ] UI berbahasa Jepang (staf Jepang) tetap rapi, dan teks Jepang tidak ikut diterjemahkan browser.

## 6. Risiko

| Risiko | Tanggapan |
|---|---|
| **Penjelasan AI keliru secara halus** (nuansa, batasan pola) | Peninjau buta + pilot + status `draf` yang selalu terlihat. Materi baru disebut `ditinjau` setelah dicek sensei |
| Kalimat contoh memakai pola/kosakata yang belum diajarkan | Batas bab dimasukkan ke prompt penulis, gate memberi peringatan kosakata, dan peninjau menilai batas pola. Data kosakata Minna pihak ketiga belum lengkap, jadi gate hanya memberi peringatan |
| Hak cipta (buku penjelasan Minna, jlptsensei) | Penjelasan dan contoh ditulis sendiri. Dari sumber luar hanya nama pola dan nomor bab yang dipakai (design § 7) |
| Isi terlalu panjang untuk slide | Batas panjang dicek gate, ditambah cek visual pilot |
| Katalog salah gabung atau salah bab | F1 berhenti untuk dicek user sebelum isi ditulis |
| Volume isi besar (±200 materi) | Batch kecil berlaporan; urutan mengikuti kelas yang sedang berjalan, jadi materi terpakai sebelum semuanya selesai |
| Google Translate merusak teks Jepang untuk staf Jepang | `translate="no"` + `lang="ja"` di semua teks Jepang |

## 7. Pertanyaan untuk user

Setiap pertanyaan punya jawaban bawaan. Bila tidak dijawab, rencana memakai jawaban bawaan itu.

| No | Pertanyaan | Bawaan (rekomendasi) |
|---|---|---|
| **Q1** | Urutan produksi isi | Modul N4 → Minna Bab 16–25 → Bab 1–15 → Minna II di luar modul (§3 F5) |
| **Q2** | Satu materi per pola (dengan beberapa sumber), atau materi N5 dan N4 dipisah walau polanya sama | **Satu materi**; tingkat = tempat pertama diajarkan |
| **Q3** | Perlukah tombol "sudah dicek / laporkan koreksi" di aplikasi (F6), atau koreksi cukup disampaikan lewat Anda | Cukup lewat Anda dulu; F6 setelah produksi berjalan |
| **Q4** | Role yang bisa membuka halaman | admin, manager, sensei (viewer bisa ditambah di Role & Akses) |
| **Q5** | Terjemahan dan jawaban latihan di slide: tersembunyi dulu, atau langsung tampil | **Tersembunyi**, dibuka dengan klik/`T` |
| **Q6** | N3 masuk cakupan sekarang | Belum; katalog N3 disusun setelah N4 selesai |
| **Q7** | KB `docs/kb-dokkai/` belum di-commit. Commit ke `main` (lalu merge ke branch ini), atau salin ke worktree saja | Commit ke `main` dulu, karena skill baru akan bergantung padanya |
