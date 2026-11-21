# Spesifikasi kode: Materi Bunpou (F1–F3)

Acuan bersama untuk agen yang menulis kode dan data. Desain: [design.md](design.md). Acuan visual dan perilaku yang
harus ditiru: [mockup.html](mockup.html) (CSS, ukuran font kanvas, warna, kontrol). Contoh isi: [contoh-materi-tara.md](contoh-materi-tara.md).

Keputusan Q1–Q7 = jawaban bawaan di [plan.md § 7](plan.md#7-pertanyaan-untuk-user): satu materi per pola; akses admin,
manager, sensei; terjemahan dan jawaban tersembunyi secara bawaan; tanpa N3; tanpa fitur tinjauan di aplikasi (F6).

## 0. Aturan kerja

- **Worktree:** `E:\joydata_gemini\.worktree\materi-bunpou` (branch `materi-bunpou`). Semua perubahan hanya di sini.
  **Jangan commit.** Jangan sentuh checkout `E:\joydata_gemini` (main).
- **Knowledge base** (belum di-commit, baca saja): `E:\joydata_gemini\docs\kb-dokkai\`. Data: `data/minna-pola.json`,
  `data/minna-kosakata.json`, `data/grammar-n5.json`, `data/grammar-n4.json`; teks: `15-tata-bahasa-minna.md`,
  `16-kosakata-minna.md`, `17-aturan-final.md`, `03-tata-bahasa-n5.md`, `04-tata-bahasa-n4.md`.
- **Gaya kode proyek:** ES modules; identifier berbahasa Indonesia; komentar bahasa Inggris, singkat, menjelaskan
  *kenapa*; Vue 3 `<script setup>`; Vuetify 4 + kelas Tailwind seperti view lain (`joy-surface`, `font-display`,
  `text-slate-*`); teks UI lewat `$t` (id + ja); API klien lewat `apiRequest` dari `src/services/api.js`.
- **Kepemilikan file** (jangan menyunting file milik agen lain):

| Pemilik | File |
|---|---|
| Agen server | `server/domain/materiBunpou/index.js`, `server/domain/materiBunpou/materiBunpou.test.js`, `server/apiApp.js`, `server/db/seedData.js`, `package.json` |
| Agen klien | `src/utils/cariBunpou.js`, `src/utils/cariBunpou.test.js`, `src/views/MateriBunpouView.vue`, `src/views/MateriBunpouPresentasiView.vue`, `src/components/materi-bunpou/**`, `src/components/portal/tes/FuriganaText.vue`, `src/router/index.js`, `src/locales/id.js`, `src/locales/ja.js`, `src/App.vue` |
| Agen katalog | `server/domain/materiBunpou/katalog.js`, `docs/materi-bunpou/katalog.md` |
| Agen isi | `server/domain/materiBunpou/materiN5.js`, `server/domain/materiBunpou/materiN4.js` |

## 1. Data

Semua data adalah modul JS berisi data saja (seperti `server/domain/bankSoal/*.js`).

### 1.1 `katalog.js`: semua pola terencana

```js
export const KATALOG_MATERI = [
  {
    id: 'tara',                         // slug: /^[a-z0-9]+(-[a-z0-9]+)*$/, unik, tidak pernah diubah (dipakai di URL)
    pola: '～たら',                      // boleh memuat furigana 漢字{かな} (mis. '～予定{よてい}です')
    varian: ['もし～たら', '～かったら'],  // opsional; bentuk lain yang ikut dicari
    romaji: 'tara',
    arti: 'kalau … / setelah …',        // ≤ 40 karakter, bahasa Indonesia
    kataKunci: ['kalau', 'jika'],       // opsional; kata Indonesia untuk pencarian, ≤ 8 butir
    tingkat: 'N5',                      // 'N5' bila bab Minna terkecil ≤ 25; selain itu 'N4'
    sumber: {
      minnaBab: [25],                   // bab Minna 1–50, urut naik; boleh [] bila hanya ada di modul
      modulN4: [11],                    // nomor pola modul 111 Bunpo N4; boleh []
      jlptsensei: { N4: [88] },         // opsional; nomor di daftar jlptsensei per tingkat
    },
  },
];
```

### 1.2 `materiN5.js` / `materiN4.js`: isi materi

`export const MATERI_N5 = [ … ]` dan `export const MATERI_N4 = [ … ]`. Setiap isi menunjuk satu entri katalog lewat `id`
(dan `tingkat` katalognya harus sama dengan nama file). Field:

| Field | Bentuk | Wajib | Batas |
|---|---|---|---|
| `id` | id katalog | ✅ | harus ada di katalog, satu isi per id |
| `status` | `'draf'` \| `'ditinjau'` | ✅ | |
| `inti` | teks ID | ✅ | ≤ 60 |
| `rumusKolom` | `{ dasar, antara?, hasil }` label kolom tabel | ✅ | tiap label ≤ 20; `antara` hanya bila baris memakai `antara` |
| `rumusPengantar` | teks ID | – | ≤ 140 |
| `rumus[]` | `{ jenis, dasar, antara?, hasil, catatan? }` | ✅ 2–8 | `jenis` teks ID ≤ 24 (boleh `''` = sama dengan baris atas); `dasar`/`antara`/`hasil` JP; `hasil` **wajib** memuat sorotan `[[…]]` pada bagian pola; `catatan` JP/ID ≤ 30 |
| `makna[]` | `{ judul, penjelasan, padanan[], contohMini? }` | ✅ 1–3 | `judul` ≤ 30; `penjelasan` ≤ 140; `padanan` 1–4 butir, tiap ≤ 30; `contohMini` = `{ jp, id }`, `id` ≤ 100 |
| `perhatikan` | teks ID | – | ≤ 320 |
| `contoh[]` | `{ tempat, makna, label?, situasi, baris[], catatan }` | ✅ 3–5 | lihat bawah |
| `bandingkan` | `{ kolom[], baris[], kaki? }` | – | lihat bawah |
| `kesalahan[]` | `{ salah, benar, alasan }` | – 0–4 | `salah`/`benar` JP; `benar` memuat `[[…]]`; `alasan` ≤ 140 |
| `latihan[]` | `{ tanya, jp?, jawab?, jawabJp? }` | ✅ 2–4 | `tanya` ≤ 140; `jp` JP; `jawab` ID ≤ 140; `jawabJp` JP; minimal salah satu `jawab`/`jawabJp` |
| `ringkasan[]` | teks ID | ✅ 2–4 | tiap ≤ 110 |
| `terkait[]` | id katalog | ✅ 0–6 | ada di katalog, bukan id sendiri, tanpa duplikat |
| `catatanSensei[]` | teks ID | – 0–4 | tiap ≤ 200 |

`contoh[]`:
- `tempat`: salah satu `kerja` · `asrama` · `kelas` · `belanja` · `transportasi` · `rumahsakit` · `mensetsu` · `telepon` ·
  `rumah` · `jalan` · `tawar` · `umum`.
- `makna`: indeks 0-based ke `makna[]`. Setiap makna dipakai paling sedikit oleh satu contoh.
- `label`: opsional, ≤ 30, menggantikan chip makna (mis. "Ungkapan tetap").
- `situasi` ≤ 120; `catatan` ≤ 160.
- `baris[]` 1–4: `{ penutur, jp, id }`. `penutur` = teks ID ≤ 16 atau `null` (kalimat tunggal); `jp` panjang tampak
  (tanpa furigana dan penanda) ≤ 40; `id` ≤ 120. **Paling sedikit satu baris per contoh memuat `[[…]]`.**
- Dalam satu materi dengan ≥ 3 contoh, `tempat` minimal 2 jenis berbeda.

`bandingkan`:
- `kolom[]` 2–4: `{ id, pola, sub, lanjutan? }`. `id` = id katalog atau `null`; `pola` JP (judul kolom); `sub` ≤ 24 (mis.
  "Bab 35"); `lanjutan: true` bila pola itu belum diajarkan di bab materi ini. Kolom pertama = materi ini.
- `baris[]` 1–5: `{ label, jp?, isi[] }`. `label` ≤ 40; `isi.length === kolom.length`; bila `jp: true`, setiap sel JP
  (furigana lengkap), selain itu teks ID ≤ 60.
- `kaki` ≤ 120.

### 1.3 Penanda teks

- **JP** (field yang ditandai JP di atas): setiap rangkaian kanji wajib berfurigana `漢字{かな}`, diperiksa dengan
  `furiganaLengkap()` dari `server/domain/tesOnline.js`. Sorotan pola ditulis `[[…]]`, tidak bersarang, tidak kosong,
  tidak memuat 「、」, dan boleh berisi furigana (`[[降{ふ}ったら]]`). Angka Arab untuk jam/harga/jumlah (10時, 500円).
- **ID** (teks bahasa Indonesia): **tanpa kanji** dan tanpa penanda `{`, `}`, `[[`, `]]`. Kana boleh (mis. "bentuk た",
  "～たら"). Klien menandai rangkaian kana di teks ID sebagai bahasa Jepang (lihat § 3.3).

### 1.4 Validator

`validasiKatalog(katalog)` dan `validasiIsi(isi, katalog)` mengembalikan array masalah `{ id, field, kode, pesan }` (kosong =
lolos). Kode masalah: `id`, `duplikat`, `wajib`, `panjang`, `jumlah`, `enum`, `furigana`, `sorot`, `kanji_di_id`,
`penanda_di_id`, `rujukan`, `tingkat`, `modul`, `makna_tak_dipakai`, `tempat_seragam`. Aturan katalog tambahan: setiap
nomor di `modulN4` ada di modul (`cariPolaBunpou('N4', n)`), satu nomor modul hanya muncul di satu entri, dan `tingkat`
sesuai aturan bab. `cakupanModul(katalog)` mengembalikan nomor modul 1–104 yang belum masuk katalog (target akhir: kosong).

## 2. Server (agen server)

`server/domain/materiBunpou/index.js`:
- `KATALOG` (dari katalog.js), `ISI` (gabungan MATERI_N5 + MATERI_N4), validator di § 1.4, `cakupanModul`.
- `ringkasanMateri()` → array ringkas untuk semua entri katalog:
  `{ id, pola, varian, romaji, arti, kataKunci, padanan, tingkat, sumber: { minnaBab, modulN4 }, level, kategoriModul, status }`
  - `padanan` = gabungan `makna[].padanan` dari isi (tanpa "…"), `[]` bila belum ada isi.
  - `level` = level modul terendah (urutan `LEVEL_BUNPOU` dari `server/domain/bunpou.js`) di antara `modulN4`, atau `null`.
  - `kategoriModul` = nomor kategori modul dari nomor modul pertama, atau `null`.
  - `status` = status isi, atau `'belum'` bila belum ada isi.
  - Urutan: bab Minna terkecil naik (entri tanpa bab di akhir), lalu nomor modul terkecil.
- `ambilMateri(id)` → `null` bila id tidak dikenal **atau belum ada isinya**; selain itu
  `{ materi: { ...katalog, ...isi, level, kategoriModul, status }, ringkas: { [id]: { id, pola, arti, status } } }`, dengan
  `ringkas` memuat semua id di `terkait` dan `bandingkan.kolom[].id`.
- `kategoriModul()` → `[{ nomor, judul }]` dari modul N4.

`server/apiApp.js` (pola sama dengan route lain; `requireAuth, requirePageAccess('materi-bunpou')`):
- `GET /materi-bunpou` → `{ materi: ringkasanMateri(), kategoriModul: kategoriModul() }`
- `GET /materi-bunpou/:id` → `ambilMateri(id)` atau `404 { error: 'materi_tidak_ditemukan' }`

`server/db/seedData.js`: halaman baru
`{ id: 24, kode: 'materi-bunpou', bar: 'main', routePath: '/materi-bunpou', titleId: 'Materi Bunpou', titleJa: '文法教材', icon: 'mdi-presentation', urutan: 6, fase: 2, defaultRoles: ['admin', 'manager', 'sensei'] }`,
diletakkan tepat setelah `monitor-latihan`. Halaman bar `main` sesudahnya digeser `urutan`-nya +1 (kaiwa 7 … smart-report 17).

Tes `server/domain/materiBunpou/materiBunpou.test.js` (node:test, `npx tsx --test`):
- semua data nyata (katalog + isi) lolos validator (menampilkan daftar masalah bila gagal);
- setiap aturan validator menolak contoh buruk (fixture kecil di dalam tes);
- `ringkasanMateri`: status `belum` untuk katalog tanpa isi, `level`/`kategoriModul` diturunkan dengan benar, urutan;
- `ambilMateri`: `null` untuk id tak dikenal dan untuk `belum`; `ringkas` lengkap.
- `cakupanModul` **tidak** diwajibkan kosong di tes sampai katalog lengkap; tulis tesnya dengan `test.todo` atau syarat
  `KATALOG.length > 50`.

`package.json`: tambahkan `server/domain/materiBunpou/materiBunpou.test.js` dan `src/utils/cariBunpou.test.js` ke skrip `test`.

## 3. Klien (agen klien)

### 3.1 Pencarian `src/utils/cariBunpou.js` (+ tes)

- `normalisasi(s)`: huruf kecil; katakana → hiragana; buang penanda furigana `{…}` dan `[[`/`]]`; buang `～〜~・-` dan spasi.
- `skorMateri(m, kueri)` (seperti `skor()` di mockup): `bab 25`/`b25` → 50 bila bab cocok; `#11`/`modul 11`/`m11` → 50 bila
  nomor modul cocok; pola persis 100; awalan pola 90; varian persis/awalan 85; romaji persis 82; awalan romaji 76; pola
  memuat 70; `padanan`/`kataKunci` persis 66 (butir pertama) / 64 (butir lain); `arti`/`padanan`/`kataKunci` memuat 58;
  dikurangi 8 bila `status === 'belum'`; 0 = tidak cocok.
- `cariMateri(daftar, kueri, { tingkat })` → hasil berskor > 0, urut skor turun, lalu bab terkecil, lalu nomor modul.
- `kelompokkan(daftar, mode, kategoriModul)` → `[{ kunci, label, materi[] }]` untuk mode `'bab'` (per bab Minna terkecil,
  grup "tanpa bab" di akhir) dan `'modul'` (per kategori modul, "tidak ada di modul" di akhir).
- Tes: normalisasi (katakana, furigana, tilde, spasi), `kalau` → `tara` pertama untuk fixture mockup, `bab 25`, `#11`,
  romaji `te kudasai`, filter tingkat, `belum` turun.

### 3.2 `FuriganaText.vue`

Tambah dua prop **opsional dengan bawaan `false`**: `sorot` (render `[[…]]` sebagai `<mark class="sorot">`) dan `frasa`
(bungkus setiap frasa yang diakhiri 「、」 dalam `<span class="frasa">` = inline-block). Bila keduanya `false`, keluaran
**harus sama persis** dengan sekarang (dipakai Tes Online/Bank Soal). Tambah `lang="ja" translate="no"` pada span akar
hanya bila prop baru dipakai, atau biarkan pemanggil yang menambahkannya.

### 3.3 Layar

- `src/router/index.js`: `/materi-bunpou` → `MateriBunpouView`, `/materi-bunpou/:id` → `MateriBunpouPresentasiView`, keduanya
  `meta: { pageKode: 'materi-bunpou' }`.
- `src/App.vue`: `currentPageTitle` juga mencocokkan halaman lewat `route.meta.pageKode` bila `routePath` tidak sama persis
  (supaya `/materi-bunpou/tara` berjudul "Materi Bunpou").
- **`MateriBunpouView.vue`** (layar cari) meniru mockup: judul + subjudul, kotak cari besar (autofocus, `/` untuk fokus,
  tombol hapus, tanpa tombol cancel bawaan browser), chip tingkat (Semua/N5/N4; tanpa N3), pilihan kelompok (Bab Minna /
  Kategori modul N4) saat kueri kosong, "Terakhir dibuka" (localStorage dalam try/catch, sembunyikan bila kosong/gagal),
  daftar berkelompok (`v-expansion-panels` atau `<details>`; bab berisi materi terakhir dibuka terbuka), hasil pencarian
  (pola, romaji, arti, chip `N5 · Bab 25`, chip `Modul N4 #11 · L2`, status Draf/Ditinjau/Belum ditulis), keyboard ↑↓ Enter
  Esc, tautan "Bandingkan" bila hasil memuat ≥ 2 kolom `bandingkan` suatu materi (cukup: bila hasil memuat ≥ 2 dari
  `tara`,`to`,`ba`,`nara`, tautan ke `/materi-bunpou/tara?slide=<nomor slide bandingkan>`; boleh disederhanakan), pesan
  kosong yang memberi saran. Kueri, tingkat, dan kelompok disimpan di query URL (`?q=&t=&k=`) lewat `router.replace`. Data
  dari `GET /materi-bunpou` sekali saat halaman dibuka.
- **`MateriBunpouPresentasiView.vue`** meniru mockup: toolbar (kembali ke daftar dengan query sebelumnya, pola + status,
  tombol Furigana/Terjemahan/Mode baca/Layar penuh), kanvas 1280×720 yang diskalakan (`KanvasSlide.vue`), panah tepi saat
  tetikus bergerak, strip navigasi per kelompok slide + titik, nomor `n / total`, panel "Catatan sensei" (tidak ada di
  layar penuh), mode baca (semua slide sebagai kartu, terjemahan terbuka, catatan sensei di atas; otomatis bila lebar
  < 600 px). Slide `?slide=n` (1-based) di URL lewat `router.replace`. Data dari `GET /materi-bunpou/:id`; 404 → pesan +
  tombol kembali.
- **Urutan slide** (design § 4.2): Judul · Cara membentuk · Makna & padanan · Contoh 1..n · Bandingkan (bila ada) ·
  Kesalahan (bila ada) · Cek pemahaman · Ringkasan. Komponen di `src/components/materi-bunpou/` (satu komponen per jenis
  slide atau satu komponen dengan cabang; bebas, asal rapi).
- **Tersembunyi:** terjemahan + catatan di slide contoh (satu grup), jawaban latihan (satu grup per soal). `→`/Space/PageDown
  membuka grup tersembunyi berikutnya dulu, baru pindah slide; `T` buka/tutup semua di slide ini; klik pada placeholder
  membuka grupnya; tombol Terjemahan di toolbar = tampilkan semua di semua slide. Catatan contoh tersembunyi tanpa
  placeholder (lihat `.senyap` di mockup).
- **Keyboard:** `←`/PageUp, `→`/Space/PageDown, `T`, `R` (furigana, diingat di localStorage), `F` (Fullscreen API pada
  elemen panggung; bila gagal, abaikan), `B`, `Esc` (bila tidak layar penuh → kembali ke daftar), `1`–`9`. Abaikan saat
  fokus di input atau dengan Ctrl/Meta/Alt.
- **Teks:** semua JP lewat `FuriganaText` dengan `sorot` + `frasa`; di tabel bentuk, sorotan tampil sebagai teks amber
  tebal, bukan stabilo. Teks ID yang memuat kana dirender lewat komponen kecil (mis. `TeksCampur.vue`) yang membungkus
  rangkaian kana/～ dengan `<span lang="ja" translate="no">`. Semua JP diberi `lang="ja" translate="no"`.
- **Ikon tempat** (mdi): kerja `mdi-factory`, asrama `mdi-home-city-outline`, kelas `mdi-school-outline`, belanja
  `mdi-cart-outline`, transportasi `mdi-train`, rumahsakit `mdi-hospital-box-outline`, mensetsu `mdi-account-tie-voice`,
  telepon `mdi-phone-outline`, rumah `mdi-home-outline`, jalan `mdi-map-marker-outline`, tawar `mdi-gift-outline`, umum
  `mdi-chat-outline`. Label tempat lewat i18n.
- **i18n:** semua label UI di `materiBunpou.*` (id dan ja). Isi materi tidak diterjemahkan.

## 4. Pemeriksaan sebelum selesai

- Agen server: `npm test` lolos (termasuk tes lama).
- Agen klien: `npx tsx --test src/utils/cariBunpou.test.js` lolos dan `npm run build` lolos.
- Tidak ada perubahan skema DB, tidak ada pemanggilan AI, tidak ada dependensi baru.
