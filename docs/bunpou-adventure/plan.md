# Rencana: Bunpou Adventure

Status: rencana final, belum ada kode (user: "jangan dulu code") · 2026-11-21 · semua keputusan Q1–Q11 dan F1 sudah diambil
user · branch `bunpou-adventure` (worktree
`.worktree/bunpou-adventure`, disusulkan ke `main` 9471516)

Rincian teknis (berkas, fungsi, data, API, tes, urutan kerja): **[spek-kode.md](spek-kode.md)**.

Fitur latihan bunpou di portal peserta, satu keluarga dengan **Kanji Adventure**. Soalnya berbentuk **soal bintang**
(並べ替え／文の組み立て), seperti もんだい２ Bagian 2 di ujian internal *SOAL N5 VER.2*. Materi dibagi per tingkat (N5, N4,
lalu N3), dan tiap tingkat dipecah menjadi volume.

---

## 1. Judul

**Bunpou Adventure** (ja: 文法アドベンチャー), subjudul *"Susun kalimat, temukan ★"*.

- Satu keluarga dengan Kanji Adventure. Peserta yang sudah memainkannya langsung paham aturannya: tahap, gembok, bos.
- Kata *bunpou* sudah dipakai di kelas (Shiken Bunpou), jadi isinya jelas dari namanya.

---

## 2. Bentuk soal

### 2.1 Format JLPT (keputusan Q2)

```
A「すみません、つぎの ＿＿＿ ★ ＿＿＿ ＿＿＿ まがって ください。」
B「はい、わかりました。」
1 に   2 しんごう   3 右   4 を
→ つぎの しんごう を★ 右 に まがって  →  jawaban 4
```

Kalimat atau dialog A–B dengan **4 kotak**, satu bertanda ★, dan **4 potongan** bernomor. **Peserta memilih nomor
potongan yang jatuh di ★**, persis seperti di ujian. Setelah menjawab, layar menampilkan kalimat utuh dengan ★ disorot,
nomor jawaban, terjemahan, dan pembahasan singkat.

- Nomor 1–4 diacak server setiap kali soal muncul, jadi nomor jawaban tidak bisa dihafal.
- Posisi ★ bervariasi (paling sering kotak ke-2 dan ke-3, seperti sampel).
- No. 18 di PDF hanya punya 3 kotak padahal pilihannya 4 (tercatat di `docs/kb-dokkai/01` §5). Validator menolak soal
  seperti itu.

### 2.2 Lebih dari satu urutan sah

Kadang dua urutan sama-sama gramatikal. Aturan JLPT: soal tetap sah selama **★ jatuh di potongan yang sama di semua urutan
sah**.

```
わたしは ＿＿＿ ＿＿＿ ★ ＿＿＿ 。        1 ました  2 先生に  3 ほめられ  4 さくぶんを
  先生に さくぶんを ほめられ★ ました    ✓
  さくぶんを 先生に ほめられ★ ました    ✓  → ★ = 3 di kedua urutan: sah
  (bila ★ di kotak ke-1, isinya 2 atau 4 tergantung urutan → soal ditolak)
```

Peninjau soal wajib mencari urutan lain. Urutan yang ditemukan dicatat di data (`urutanLain`) dan diperiksa validator.

### 2.3 Contoh (tulisan Claude)

**N5 Vol 4 · Bab 19 · ～たことが あります**
```
わたしは ＿＿＿ ＿＿＿ ★ ＿＿＿ 。
1 のぼった   2 あります   3 ふじさんに   4 ことが
ふじさんに のぼった ことが★ あります → jawaban 4 · Saya pernah mendaki Gunung Fuji.
```

**N5 Vol 4 · Bab 21 · ～と 思います (dialog)**
```
A「ミラーさんは どこですか。」
B「たぶん ＿＿＿ ＿＿＿ ★ ＿＿＿ 。」
1 と   2 かいぎしつに   3 思います   4 いる
かいぎしつに いる と★ 思います → jawaban 1
```

**N4 · Bab 31 · ～つもりです**
```
らいねん ＿＿＿ ★ ＿＿＿ ＿＿＿ です。
1 はたらく   2 会社で   3 つもり   4 日本の
日本の 会社で★ はたらく つもり → jawaban 2
```

---

## 3. Tingkat, volume, tahap

- **Pola** diambil dari katalog Materi Bunpou yang sudah ada di `main` (`server/domain/materiBunpou/katalog.js`, 163 pola,
  id tetap). Kedua fitur memakai id yang sama, sehingga pola lemah di Bunpou Adventure bisa ditautkan langsung ke halaman
  presentasi Materi Bunpou.
- **Tahap** = satu bab Minna. Bab yang hanya punya 1 pola digabung ke bab berikutnya; bab dengan lebih dari 6 pola dipecah.
- Soal sebuah bab hanya memakai pola dan kosakata sampai bab itu (aturan KB D2/D3).

| N5 (Minna I) | Bab | Pola | Cocok dengan ujian kelas |
|---|---|---:|---|
| Vol 1 | 1–4 | 10 | SB01 Shiken Bunpou Bab 1–4 |
| Vol 2 | 5–9 | 13 | SB02 Bab 5–9 · (Vol 1–2) BK01 Bab 1–9 |
| Vol 3 | 10–15 | 16 | (Vol 1–3) SB03 / Tes Progres Bab 1–15 |
| Vol 4 | 16–21 | 19 | Ujian Minggu 11 Bab 16–21 |
| Vol 5 | 22–25 | 8 | (Vol 1–5) Komprehensif Bab 1–25 |

| N4 (Minna II + modul, keputusan Q5: urutan Minna) | Bab | Pola |
|---|---|---:|
| Vol 1 | 26–30 | 14 |
| Vol 2 | 31–35 | 19 |
| Vol 3 | 36–40 | 13 |
| Vol 4 | 41–45 | 19 |
| Vol 5 | 46–50 | 32 |

- Pola N4 yang ada di Minna II mengikuti babnya. **19 pola yang hanya ada di modul** diberi bab terdekat menurut temanya,
  sesuai tabel di [spek-kode §3.2](spek-kode.md#32-pola-modul-tanpa-bab-minna-q5) (disetujui user).
- N4 Vol 5 paling berat (Bab 49–50 = keigo, 20 pola), tetapi **tetap satu volume** (disetujui user). Bab 49 dan Bab 50
  masing-masing dipecah menjadi 2 tahap.
- **N3** dikerjakan terakhir, setelah sensei memberi modul N3 (lewat skill `tambah-modul-bunpou`).
- **Gembok per tingkat:** Vol 1 setiap tingkat selalu terbuka, volume berikutnya terbuka setelah volume sebelumnya selesai.
  Joy 1/2 bisa langsung mulai N4 tanpa menamatkan N5 lebih dulu.

---

## 4. Aturan main

### 4.1 Pola dan varian

Yang dilacak adalah **pola**, bukan soal. Setiap pola punya **4 varian soal**. Ulangan selalu memakai kalimat yang belum
dikerjakan, jadi peserta tidak bisa sekadar menghafal jawaban.

**Pola dikuasai setelah 2 jawaban benar pada 2 varian berbeda (Q11, disetujui user).**
Karena peserta hanya memilih nomor ★ (Q2), peluang menebak benar 1/4. Dua jawaban benar menurunkan peluang lolos dengan
menebak ke 1/16, sama dengan Kanji Adventure (bacaan dan arti masing-masing 4 pilihan). Peserta yang paham tetap selesai
dalam satu sesi, karena setiap pola langsung diberi dua soal. Di kode, aturan ini cukup satu konstanta
(`BENAR_DIKUASAI = 2`).

### 4.2 Tahap, bos, volume

```
Pilih tingkat → pilih volume
   │
   ├─ Tahap Bab 16 (4 pola × 2 soal) ──► pola yang salah masuk bos
   │        │                              ulangan tahap: hanya pola yang belum dikuasai, varian baru
   │        └─ semua pola dikuasai ──► Tahap Bab 17 terbuka
   ├─ … tahap terakhir volume
   │
   └─ Bos = pola yang PERNAH salah di volume ini (maks. 10 per ronde, varian baru)
            ├─ benar ──► keluar dari bos
            └─ salah ──► tetap, ronde berikutnya pakai varian lain
                          bos kosong ──► volume selesai ──► volume berikutnya terbuka
                          (tidak pernah salah ──► bos dilewati)
```

- Pola yang pernah salah tetap diuji di bos, walaupun kemudian benar di ulangan tahap. Inilah yang membuat bos berguna:
  pola yang sempat sulit diuji lagi di akhir volume dengan kalimat baru.
- Ulangan tanpa batas. `perlu_perhatian` (bos ≥ 3 ronde, atau satu pola salah ≥ 3 kali) hanya penanda untuk sensei.
- Volume yang sudah selesai tetap selesai. Mengulangnya untuk latihan tidak mengunci volume berikutnya.
- Server yang memeriksa semua gerbang. Client hanya mengirim nomor jawaban.

### 4.3 Bos Kanji Adventure

Saat merencanakan fitur ini ditemukan bahwa ronde bos Kanji Adventure tidak pernah terisi. Perbaikannya direncanakan
terpisah di branch `kanji-adventure-bos` (`idea and plan/PLAN-BOS.md`). Bunpou Adventure langsung memakai aturan yang
benar sejak awal (§4.2), dan ada tes yang memastikan volume dengan kesalahan selalu berakhir di ronde bos.

### 4.4 Nilai

Murni latihan: tidak masuk `nilai_ujian` atau rapor. Setiap sesi dicatat sebagai `latihan_sesi` mode `latihan` dengan
**jenis baru `bunpou`**, sehingga ikut menghitung waktu aktif, rata skor, Grade Latihan, dan tampil di Monitor Latihan serta
grafik latihan harian.

---

## 5. Tampilan

- **Peserta:** halaman seperti Kanji Adventure (tingkat → kartu volume → peta tahap per bab → kartu bos). Soal tampil
  dengan furigana. Pilihan berupa tombol besar yang nyaman di ponsel dan bisa dipilih dengan tombol 1–4. Umpan balik muncul
  langsung per soal.
- **Sensei (Monitor Latihan):** panel per peserta berisi progres per volume dan **pola lemah** (paling sering salah). Setiap
  pola punya tautan ke halaman Materi Bunpou-nya. *(Opsional)* ringkasan pola lemah per kelas, untuk memilih pola yang perlu
  diajarkan ulang.

---

## 6. Produksi soal

Isi adalah bagian terberat: **N5 ±264 soal, N4 ±388 soal** (4 varian × pola). Produksi memakai skill baru
`tulis-soal-bintang` dengan pola yang sama seperti `generate-soal`: penulis per volume → gate mekanis → **peninjau buta** yang
menjawab tanpa kunci dan wajib mencari urutan lain → inject. Pilot dulu: **12 pola (Bab 1, 2, 16, 19) × 4 varian = 48 soal**,
dinilai user/sensei di layar sebelum produksi massal.

Urutan produksi: N5 Vol 1 → 5 (Joy 3 di tahap N5, Komprehensif Bab 1–25 belum lewat), lalu N4 Vol 1 → 5 (Joy 1/2).
Rilis bisa dimulai begitu N5 Vol 1 dan N4 Vol 1 lengkap. Volume lain tampil "Segera" sampai banknya penuh.

---

## 7. Fase

| Fase | Isi | Menunggu |
|---|---|---|
| F1 | Pembagian volume/tahap + tabel pola modul → laporan `volume.md` | — (keputusan sudah diambil; tinggal laporan per tahap) |
| F2 | Pilot 48 soal + validator + pratinjau | user/sensei menyetujui gaya |
| F3–F5 | Domain, penyimpanan (migration 004, jenis `bunpou`), API | — (paralel dengan F2) |
| F6–F7 | Halaman peserta, panel sensei | F5 |
| F8 | Skill + produksi per volume | F2 disetujui |
| F9 | Rilis bertahap + verifikasi produksi | N5 Vol 1 dan N4 Vol 1 lengkap |

Rincian per fase dan kriteria selesai: [spek-kode §9](spek-kode.md#9-urutan-kerja).

---

## 8. Keputusan

Semua keputusan diambil user pada 2026-11-21. "Sesuai usulan" = user menyetujui rekomendasi rencana.

| No | Keputusan | Status |
|---|---|---|
| Q1 | Judul Bunpou Adventure | sesuai usulan |
| Q2 | Peserta memilih nomor ★ (format JLPT) | **dipilih user** (usulan awal: susun penuh) |
| Q3 | Satuan kemajuan = pola dengan 4 varian | sesuai usulan |
| Q4 | Volume N5 = blok ujian (1–4, 5–9, 10–15, 16–21, 22–25) | sesuai usulan |
| Q5 | Volume N4 = urutan bab Minna II, pola modul ditempel ke bab | **dipilih user** |
| Q6 | N3 menunggu modul dari sensei | sesuai usulan |
| Q7 | Gembok per tingkat | sesuai usulan |
| Q8 | Ulangan tahap hanya pola yang belum dikuasai | sesuai usulan |
| Q9 | Bos Kanji Adventure diperbaiki di branch terpisah | **dipilih user** (rencana: `kanji-adventure-bos`) |
| Q10 | `docs/kb-dokkai/` di-commit ke `main` | **dipilih user, selesai** (9471516) |
| Q11 | Pola dikuasai setelah 2 benar pada 2 varian | sesuai usulan |
| F1a | Bab untuk 19 pola modul-saja (spek-kode §3.2) | sesuai usulan |
| F1b | N4 Vol 5 tetap satu volume (Bab 49 dan 50 masing-masing 2 tahap) | sesuai usulan |
| Q12 | Kunci (`benar`, `urutan`) tetap dikirim bersama kertas agar umpan balik langsung tampil, seperti Kanji Adventure (peserta dengan devtools bisa membacanya; nilai tidak masuk rapor) | **dipilih user** 2026-11-22: dibiarkan |

---

## 9. Definition of done

- Peserta memilih tingkat dan volume, melihat peta tahap per bab, dan menjawab soal bintang format JLPT di ponsel maupun
  desktop.
- Tahap dan volume berikutnya benar-benar terkunci (diuji lewat API langsung). Vol 1 tiap tingkat terbuka.
- Ulangan memakai varian baru. Volume dengan kesalahan selalu berakhir di ronde bos, dan bos diulang sampai kosong.
- Nomor pilihan diacak setiap kali soal muncul, dan penilaian dilakukan di server dari kertas yang tersimpan.
- Setiap sesi tercatat sebagai `latihan_sesi` jenis `bunpou` mode `latihan`, tampil di Monitor Latihan, dan memengaruhi
  Grade Latihan. Tidak ada data yang masuk `nilai_ujian`.
- Sensei melihat progres dan pola lemah per peserta, dengan tautan ke Materi Bunpou.
- Setiap soal di bank lolos validator di `npm test`, dan setiap pola di volume yang dirilis punya 4 varian.
- `npm test` hijau, `npm run build` sukses, migration 004 berjalan di Supabase.
