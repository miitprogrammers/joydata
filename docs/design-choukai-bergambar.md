# Desain: Tes Choukai Bergambar dengan TTS (AI sebagai generator)

Status: usulan, belum diimplementasi · 2026-11-06

Dokumen ini menjelaskan cara menambah jenis tes ketiga, **choukai** (聴解, menyimak), ke Tes Online yang sudah
ada (kanji, dokkai). AI menulis naskah, membuat suara (TTS), dan membuat gambar. Sensei meninjau hasilnya sebelum
kode tes dipakai. Desain ini sengaja mengikuti pola dokkai AI yang sudah berjalan, supaya kode, alur sensei, dan
aturan datanya tetap sama.

---

## 1. Ringkasan keputusan

| Hal | Usulan | Alasan singkat |
|---|---|---|
| Naskah & soal | Gemini lewat `server/ai/llm.js` (`generateJson`), divalidasi domain seperti `validasiBacaanAi` | Pipa, fallback OpenRouter, dan pola validasinya sudah ada |
| Suara | **Gemini TTS**, dibuat **sekali saat draf**, disimpan sebagai file MP3 | `GEMINI_API_KEY` sudah ada; semua peserta mendengar audio yang sama; tidak ada biaya atau jeda saat tes |
| Gambar | **Hibrida**: gambar data (jam, kalender, harga) dan ikon benda dirender dari data terstruktur; hanya **adegan** yang dibuat AI | Kebanyakan gambar choukai N5 berisi benda, jumlah, dan jam. AI gambar sering salah hitung dan menulis huruf rusak |
| Penyimpanan media | Supabase Storage, bucket privat, URL bertanda tangan saat tes dimulai | Belum ada penyimpanan file; Vercel tidak bisa menyimpan file |
| Nilai | 1 poin per soal → kolom `nilai_ujian.choukai` (pola variable) | Kolom `choukai` sudah ada tapi belum pernah diisi Tes Online |
| Skema DB | Hanya tambahan (additive) | Tes Online sudah dipakai sungguhan sejak 2026-11-02 |

---

## 2. Tujuan dan batasan

**Tujuan**
- Sensei bisa membuka kode tes choukai seperti kode dokkai AI: pilih kelas, jenis soal (mondai), jumlah soal, tanggal,
  dan kode ujian. AI membuat draf, sensei meninjau dan mengaktifkan.
- Peserta mengerjakan di HP, termasuk dengan sinyal lemah (screenshot 2026-11-06: 6 KB/s di 4G).
- Mode latihan tanpa kode, sama seperti kanji dan dokkai.
- Soal yang sudah disetujui masuk bank, lalu dipakai untuk latihan dan kode bersumber bank.

**Di luar cakupan (versi pertama)**
- Pengenalan suara peserta (berbicara). Itu wilayah Kaiwa.
- Audio rekaman manusia. Bisa ditambah nanti karena format filenya sama.
- Level N3 ke atas. Mulai dari N5, lalu N4 setelah formatnya terbukti.

---

## 3. Format soal (mengikuti JLPT N5 聴解)

| Kode | Mondai JLPT | Isi audio | Yang terlihat di layar | Pilihan |
|---|---|---|---|---|
| `M1` | 課題理解 (memahami tugas) | Situasi → pertanyaan → percakapan → pertanyaan diulang | **4 gambar** (atau 4 teks) | 4 |
| `M2` | ポイント理解 (memahami poin) | Sama dengan M1 | 4 teks Jepang, kadang gambar | 4 |
| `M3` | 発話表現 (ungkapan) | Situasi → 3 kalimat pilihan **dibacakan** | **1 gambar adegan dengan panah** ke pembicara | 3 tombol `1 2 3` |
| `M4` | 即時応答 (respons cepat) | 1 kalimat → 3 respons dibacakan | Tanpa gambar | 3 tombol `1 2 3` |

"Bergambar" paling penting di **M1** dan **M3**. M2 dan M4 ikut dibuat karena memakai pipa yang sama, dan tanpa
keduanya tes choukai terasa tidak lengkap.

### Struktur satu soal (disimpan di JSON)

```js
{
  id: 'CK41-3',                    // AI<sesi>-<nomor>, sama dengan pola id bacaan AI
  mondai: 'M1',
  jlpt: 'N5',
  judul: '買{か}い物{もの}',
  situasi: '女{おんな}の人{ひと}と男{おとこ}の人{ひと}が話{はな}しています。',
  pertanyaan: '女{おんな}の人{ひと}は何{なに}を買{か}いますか。',
  naskah: [                        // urutan baris percakapan
    { pembicara: 'F', teks: 'りんごを三{みっ}つください。' },
    { pembicara: 'M', teks: 'すみません、りんごは二{ふた}つしかありません。' },
    { pembicara: 'F', teks: 'じゃあ、二{ふた}つとみかんを一{ひと}つください。' },
  ],
  opsi: [                          // M1/M2: 4 pilihan; M3/M4: 3 pilihan berupa kalimat yang dibacakan
    { teks: 'りんご 3', gambar: { tipe: 'ikon', item: [{ ikon: 'apple', jumlah: 3 }] } },
    { teks: 'りんご 2・みかん 1', gambar: { tipe: 'ikon', item: [{ ikon: 'apple', jumlah: 2 }, { ikon: 'tangerine', jumlah: 1 }] } },
    { teks: 'みかん 3', gambar: { tipe: 'ikon', item: [{ ikon: 'tangerine', jumlah: 3 }] } },
    { teks: 'りんご 2', gambar: { tipe: 'ikon', item: [{ ikon: 'apple', jumlah: 2 }] } },
  ],
  benar: 1,
  kutipanKunci: 'じゃあ、二つとみかんを一つください。',   // harus ada persis di naskah (dicek validator)
  gambarSoal: null,                // M3: { tipe: 'adegan', prompt, path, panah: { x: 0.62, y: 0.35 } }
  terjemahan: '…',                 // seluruh naskah dalam bahasa Indonesia, hanya setelah tes
  tanyaId: 'Apa yang dibeli si perempuan?',
  pembahasan: '二つとみかんを一つください = dua (apel) dan satu jeruk.',
  audio: { path: 'choukai/ab12…/CK41-3.mp3', durasiMs: 38400, hash: 'sha256…', model: 'gemini-…-tts' },
}
```

Aturan teks Jepang sama dengan dokkai: kanji hanya dari volume yang dipilih sensei, setiap kanji diberi furigana
`漢字{かな}`, dan pilihan jawaban ditulis dalam bahasa Jepang. Furigana tidak terlihat saat tes. Naskah lengkap
dengan furigana baru muncul di pembahasan.

---

## 4. Alur besar

```
Sensei: buka kode choukai (sumber 'ai', status 'draf')
   │
   ├─ 1. Tulis naskah ─── Gemini (JSON) ──► validasiChoukaiAi ──► simpan di tes_online_sesi.bacaan
   │
   ├─ 2. Render audio (per soal) ─── Gemini TTS ──► PCM ──► gabung + jeda ──► MP3 ──► Storage
   │
   ├─ 3. Gambar (per soal, hanya jika perlu)
   │       ikon / jam / kalender / harga ──► tidak perlu dibuat, dirender di browser dari data
   │       adegan ──► Gemini image ──► WebP ──► Storage
   │
   ├─ 4. Tinjau: dengarkan, lihat gambar, ganti kunci, render ulang, buat ulang gambar, letakkan panah (M3), hapus
   │
   └─ 5. Aktifkan ──► soal masuk tabel choukai_soal_ai (bank) ──► kode bisa dipakai peserta

Peserta: masukkan kode ──► mulaiTes: soal tanpa kunci & tanpa naskah + URL media bertanda tangan
   ──► unduh semua media dulu ──► kerjakan ──► selesaiTes ──► nilai ke nilai_ujian.choukai
```

**Batas 60 detik Vercel** (`vercel.json`, `llm.js` memakai anggaran 50 detik) menjadi pertimbangan utama desain.
Karena itu pekerjaan dipecah **per soal dan per aset**, dan browser sensei yang memanggilnya satu per satu sambil
menampilkan progres ("Audio 3/8 · Gambar 2/3"). Tidak perlu antrean atau worker. Dokkai sudah memakai pola yang
mirip, dengan batch 4 bacaan per permintaan.

---

## 5. Generator naskah (AI teks)

File baru `server/ai/choukaiAi.js`, dengan bentuk yang sama seperti `dokkaiAi.js`:

- **Masukan ke model**: mondai, panduan mondai, pola JLPT (pakai ulang `PANDUAN_JLPT`), `kanjiBoleh`, topik acak
  (pakai ulang `TOPIK_DOKKAI` dan tambah topik khas menyimak, misalnya pengumuman stasiun, instruksi di pabrik,
  telepon), `hindariJudul`, dan **katalog ikon** (daftar kunci ikon yang boleh dipakai di `gambar.tipe = 'ikon'`).
  Data peserta tidak pernah dikirim ke model.
- **Panduan per mondai** (dimasukkan ke prompt):
  - M1/M2: 4–8 baris percakapan antara 2 orang. Ketiga pengecoh **harus disebut** di percakapan lalu
    ditolak atau diubah, seperti gaya JLPT ("…三つ… → 二つしかありません").
  - M3: satu situasi dan 3 kalimat pilihan. Hanya satu yang pantas diucapkan.
  - M4: satu kalimat dan 3 respons. Hanya satu yang alami.
- **Gambar dalam JSON**: model memilih `tipe` dari `ikon | jam | kalender | harga | adegan | teks`. Untuk
  `adegan`, model menulis `prompt` deskripsi gambar dalam bahasa Inggris. Model gambar lebih patuh pada prompt
  bahasa Inggris, dan aturan gaya ditambahkan server (§7).

### Validator `validasiChoukaiAi` (di `server/domain/tesOnline.js` atau `choukai.js` baru)

Pemeriksaan otomatis untuk menolak soal yang buruk sebelum sensei melihatnya:

1. Bentuk: jumlah opsi (4 atau 3 sesuai mondai), `benar` adalah indeks yang sah, pembicara ∈ `{F, M}`, jumlah baris
   naskah sesuai mondai.
2. Furigana lengkap dan kanji hanya dari volume yang dipilih. Pakai ulang `furiganaLengkap` dan
   `sederhanakanKanji`.
3. Opsi berbahasa Jepang (pakai ulang `opsiBahasaJepang`) dan tidak ada opsi yang kembar.
4. `kutipanKunci` ada persis di naskah (dibandingkan tanpa furigana).
5. M1/M2: setiap opsi yang salah punya jejak di naskah (minimal satu kata bendanya disebut), supaya pengecohnya
   seperti JLPT dan tidak asal tempel.
6. Gambar: `ikon` hanya dari katalog, `jumlah` 1–5, `jam` berformat `HH:MM`, `harga` bilangan bulat. Gambar ikon
   antar-opsi tidak boleh sama.
7. Panjang audio dari jumlah mora naskah: tolak kalau perkiraannya > 60 detik untuk N5.

---

## 6. Suara (TTS)

### Pilihan yang dibandingkan

| Opsi | Kelebihan | Kekurangan | Putusan |
|---|---|---|---|
| **Gemini TTS** (model `*-tts`) | Kunci API sudah ada; suara Jepang alami; mendukung **2 pembicara** dalam satu panggilan; gaya bisa diatur lewat prompt ("ゆっくり、はっきり") | Status model masih bisa berubah (nama model perlu dicek saat implementasi); keluarannya PCM mentah | **Dipakai** |
| Google Cloud TTS (Neural2/Chirp, ja-JP) | Stabil, SSML untuk jeda dan bacaan | Perlu service account GCP terpisah | Cadangan jika Gemini TTS tidak cocok |
| Web Speech API di browser | Gratis | Banyak HP Android tidak punya suara ja-JP, kualitasnya berbeda tiap HP, tidak adil untuk tes resmi | **Ditolak** |
| VOICEVOX (open source) | Gratis, suara Jepang bagus | Perlu server sendiri; tidak bisa di Vercel | Ditolak untuk sekarang |

### Cara render satu soal

File baru `server/ai/choukaiTts.js`:

1. **Pecah menjadi segmen**: narator (situasi, pertanyaan), percakapan (F/M), pertanyaan diulang, lalu untuk M3/M4
   "1. …", "2. …", "3. …".
2. **Panggil TTS**: segmen narator dengan satu suara tetap; percakapan dalam **satu panggilan multi-speaker**
   (F dan M), supaya intonasi antar-baris tetap nyambung. Panggilan dijalankan paralel.
3. **Gabung PCM** (16-bit, 24 kHz, mono) dengan jeda hening yang tetap: 1,0 detik setelah situasi, 1,5 detik
   sebelum pertanyaan diulang, 1,0 detik antar-pilihan. Karena formatnya mentah dan seragam, penggabungan cukup
   menyambung buffer, tanpa pustaka audio.
4. **Encode ke MP3 mono 32–40 kbps** dengan encoder JS murni (`lamejs` atau fork ESM-nya). Audio 40 detik jadi
   sekitar 160–200 KB, dibanding sekitar 1,9 MB untuk WAV. Ini penting untuk HP dengan sinyal lemah.
5. **Unggah** ke Storage dengan path dari hash `sha256(naskah + suara + model)`. Naskah yang sama tidak dirender dua
   kali, dan soal bank yang dipakai ulang tidak menambah biaya.

### Bacaan yang benar

TTS bisa salah membaca kanji, terutama angka, satuan, tanggal, dan nama (四時 → よじ, 一日 → ついたち). Karena
naskah sudah membawa furigana, **teks yang dikirim ke TTS dibuat dari furigana** untuk rangkaian yang berisi angka
atau satuan, tanggal, dan nama orang. Kanji lain dibiarkan apa adanya supaya intonasinya alami. Aturan ini
diuji di prototipe (§12).

**Pemeriksaan otomatis (fase 2)**: audio yang sudah jadi ditranskripsikan kembali oleh Gemini (memahami audio),
diubah ke kana, lalu dibandingkan dengan naskah. Kalau kemiripannya di bawah ambang, soal ditandai
"Periksa audio" di layar tinjau.

### Suara

Tiga suara tetap per kode, yaitu narator, perempuan, dan laki-laki, dari daftar suara bawaan Gemini. Pilihan awal
dicatat di konstanta dan sensei bisa menggantinya per kode. Suara ditulis di `audio.model` dan ikut masuk hash.

---

## 7. Gambar

### Kenapa hibrida

Model gambar AI kuat untuk adegan ("seorang pria di loket stasiun"), tapi sering keliru di hal yang justru diuji
choukai N5: **jumlah benda, jarum jam, angka, dan tulisan**. Satu kesalahan di sini membuat kunci jawaban salah.
Karena itu:

| `gambar.tipe` | Contoh soal | Dibuat oleh | Biaya |
|---|---|---|---|
| `ikon` | "Beli apa?" (2 apel, 1 jeruk) | Komponen Vue; ikon SVG dari pustaka emoji berlisensi bebas (mis. Fluent Emoji, MIT), disimpan di `public/choukai-ikon/`, diulang sebanyak `jumlah` | 0 |
| `jam` | "Jam berapa bertemu?" | Komponen SVG jam analog dari `HH:MM` | 0 |
| `kalender` | "Tanggal berapa?" | Komponen SVG halaman kalender | 0 |
| `harga` | "Berapa harganya?" | Komponen label harga `¥350` | 0 |
| `teks` | M2 | Teks Jepang biasa | 0 |
| `adegan` | M3 (situasi + panah), M1 tindakan ("cuci tangan dulu") | **Gemini image** | per gambar |

Dengan pembagian ini, kebanyakan soal M1 tidak memerlukan AI gambar sama sekali. AI gambar hanya dipakai untuk M3
dan soal tindakan.

### Gambar adegan AI

File baru `server/ai/choukaiGambar.js`:

- Model gambar Gemini (`responseModalities: ['IMAGE']`, nama model dicek saat implementasi) lewat SDK
  `@google/genai` yang sudah terpasang.
- Prompt = `prompt` dari naskah + **gaya tetap dari server**: *"simple flat vector illustration, soft colors, plain
  white background, adult Asian characters, no text, no letters, no numbers, no speech bubbles"*. Satu **gambar
  referensi gaya** ikut dikirim supaya semua gambar terlihat satu set.
- **Tanpa tulisan di gambar.** Nomor pilihan (1–4) dan panah M3 digambar UI di atas gambar, bukan oleh AI.
- Hasil PNG diperkecil ke 640 px dan dikonversi ke **WebP** (`sharp`, sekitar 40–70 KB), lalu diunggah ke Storage.
- **Panah M3**: saat tinjau, sensei mengetuk orang yang berbicara di gambar. Titik itu disimpan sebagai koordinat
  relatif `panah: { x, y }`, lalu UI menggambar panah di sana. Cara ini lebih andal daripada meminta AI
  menggambar panah.
- Tombol "Buat ulang gambar" di layar tinjau (maks. misalnya 3 kali per gambar per draf, dicatat di audit).

---

## 8. Penyimpanan media

- **Supabase Storage**, bucket privat `tes-media`, diakses lewat REST (`fetch` + `SUPABASE_SECRET_KEY` yang sudah
  ada di env). Tidak perlu dependensi baru.
- Path: `choukai/<hash>.mp3`, `choukai/<hash>.webp`. Isi file tidak pernah berubah (immutable), jadi
  `Cache-Control: public, max-age=31536000, immutable`.
- **URL bertanda tangan** (signed URL) dibuat saat `mulaiTes`, berlaku selama durasi tes ditambah cadangan.
  Peserta tidak bisa mendengar audio soal resmi sebelum memasukkan kode.
- Mode lokal (`storageMode === 'local'` di `engine.js`): simpan di folder lokal dan sajikan lewat route Express,
  supaya pengembangan tanpa Supabase tetap jalan.
- Draf yang dihapus ikut menghapus filenya, kecuali file dengan hash yang masih dipakai soal bank.

---

## 9. Perubahan data (semuanya tambahan)

```sql
-- jenis 'choukai' diizinkan (constraint dibuat ulang, pola yang sama dengan status 'draf')
ALTER TABLE tes_online_sesi DROP CONSTRAINT IF EXISTS tes_online_sesi_jenis_check;
ALTER TABLE tes_online_sesi ADD CONSTRAINT tes_online_sesi_jenis_check CHECK (jenis IN ('kanji', 'dokkai', 'choukai'));
-- pengaturan khusus choukai per kode: suara, batas putar, dsb.
ALTER TABLE tes_online_sesi ADD COLUMN IF NOT EXISTS opsi_media JSONB NULL;

-- soal choukai yang disetujui sensei, setara dokkai_bacaan_ai
CREATE TABLE IF NOT EXISTS choukai_soal_ai (
  id VARCHAR(40) PRIMARY KEY,
  mondai VARCHAR(4) NOT NULL,
  jlpt VARCHAR(2) NOT NULL CHECK (jlpt IN ('N5', 'N4', 'N3')),
  data JSONB NOT NULL,
  sesi_id INTEGER NULL REFERENCES tes_online_sesi(id) ON DELETE SET NULL,
  disetujui_oleh_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

- `tes_online_sesi.materi` untuk choukai = `M1 | M2 | M3 | M4 | CAMPUR`.
- `tes_online_sesi.bacaan` dipakai ulang untuk menyimpan soal choukai draf. Nama kolomnya kurang pas, tapi jalur
  draf, tinjau, dan aktifkan (`sesiDrafAi`, `patchSesi`) tetap bisa dipakai tanpa kolom baru. Dicatat di komentar
  skema.
- `JENIS_TES` di domain jadi `['kanji', 'dokkai', 'choukai']`.
- **Bank tetap**: `server/domain/bankSoal/choukaiN5.js` (naskah ditulis manual, sama seperti `dokkaiN5.js`) +
  skrip `scripts/render-choukai-bank.mjs` yang merender audio dan gambar sekali lalu mengunggahnya. Path media
  dihitung dari hash, jadi file bank tetap berupa kode biasa.

---

## 10. API

Staff (akses halaman `tes-online`, sama seperti sekarang):

| Metode & path | Fungsi |
|---|---|
| `POST /tes-online` | Sudah ada; terima `jenis: 'choukai'`, `materi`, `sumber: 'ai'` |
| `POST /tes-online/:id/choukai/naskah` `{ jumlah }` | AI menulis naskah (maks. 6 per permintaan, 2×3 paralel) |
| `POST /tes-online/:id/choukai/:soalId/audio` | Render TTS satu soal |
| `POST /tes-online/:id/choukai/:soalId/gambar` `{ target: 'soal' \| 'opsi-<i>' }` | Buat atau buat ulang satu gambar adegan |
| `PATCH /tes-online/:id/choukai/:soalId` `{ benar?, panah?, suara? }` | Hasil tinjau sensei |
| `DELETE /tes-online/:id/choukai/:soalId` | Hapus dari draf |
| `PATCH /tes-online/:id` `{ status: 'aktif' }` | Sudah ada; untuk choukai ditolak (`TES_CHOUKAI_MEDIA_BELUM_LENGKAP`) jika ada soal tanpa audio atau tanpa gambar adegan yang dibutuhkan |

Portal peserta (endpoint yang sudah ada, dengan isi tambahan):

- `POST /portal/tes/mulai` → untuk choukai `soalTanpaKunci` mengembalikan `mondai`, `opsi` (gambar/teks, tanpa
  teks untuk M3/M4), `gambarSoal`, `audio.url` (signed), `audio.durasiMs`. **Tanpa** naskah, pertanyaan tertulis,
  kunci, terjemahan.
- `POST /portal/tes/selesai` → sama; hasil membawa naskah dengan furigana, terjemahan, dan pembahasan.
- `GET /portal/tes/latihan?jenis=choukai&materi=M1&jumlah=5` → dari bank + soal AI yang sudah disetujui.

---

## 11. Antarmuka

### Sensei: tinjau draf (`TinjauChoukaiAiDialog.vue`, pendamping `TinjauBacaanAiDialog.vue`)

- Daftar soal: pemutar audio, naskah dengan furigana dan terjemahan, opsi dengan gambarnya, dan kunci yang
  ditandai.
- Tombol per soal: **Render audio** / **Render ulang**, **Buat gambar** / **Buat ulang**, **Ganti kunci**,
  **Hapus**. Untuk M3 ada mode "Ketuk pembicara" untuk menaruh panah.
- Progres pembuatan ditampilkan di atas ("Audio 5/8 · Gambar adegan 2/3"). Tombol **Aktifkan** baru menyala kalau
  semuanya lengkap.
- Tab **Bank Soal** yang sudah ada (`BankSoalTes.vue`) ikut menampilkan soal choukai, dengan pemutar audio.

### Peserta: `ChoukaiRunner.vue` (pendamping `DokkaiRunner.vue`)

- **Unduh dulu**: sebelum tes dimulai, semua audio dan gambar diunduh dengan progres ("Menyiapkan audio 4/10").
  Timer baru berjalan setelah semua siap, supaya peserta dengan sinyal lemah tidak dirugikan. Jika gagal, tombol
  "Coba lagi" mengulang file yang gagal saja.
- **Satu soal per layar**: gambar besar dan tombol pilihan besar (`1 2 3 4`). Tidak ada teks naskah.
- **Batas putar** (`opsi_media.putarMaks`, dipilih sensei saat membuka kode): `1` (seperti JLPT), `2` (bawaan untuk
  kelas), atau tanpa batas. Selama audio berjalan, peserta tidak bisa memajukan audio (seek). Batas ini dijaga di
  browser saja; jumlah putar dikirim bersama jawaban dan ditampilkan ke sensei di hasil sebagai informasi.
- **Mode latihan**: putar tanpa batas. Setelah "Periksa", naskah, furigana, terjemahan, dan pembahasan muncul.
- **Jawaban tersimpan lokal**: jawaban disimpan ke `localStorage` per `percobaanId` sambil peserta mengerjakan,
  supaya tidak hilang kalau halaman ter-refresh atau koneksi putus saat mengirim. Kejadian 2026-11-06 (API mati
  saat "Kirim jawaban") menunjukkan perlunya ini. Sebaiknya diterapkan juga ke kanji dan dokkai.

### Hasil

`HasilTes.vue` menampilkan audio (bisa diputar ulang), naskah dengan furigana, jawaban peserta, kunci, dan
pembahasan.

---

## 12. Penilaian dan Rekap Nilai Ujian

- 1 poin per soal, skor 0–100 (sama dengan dokkai).
- `skorNilaiUjian('choukai', skor)` → `{ pola: 'variable', nilaiChoukai: skor }`. Rata-rata bagian di rapor dan
  Smart Report sudah menghitung `choukai` (`v_nilai_ujian…`, `RaporSheet`, `PesertaReport`), jadi tidak perlu
  diubah.
- `catatanHasilTes` mendapat cabang choukai: "Tes online Choukai M1 (kode …) · Benar 7/10 · Perlu diulang: …".
- **Catatan penting**: `upsertNilaiUjian` saat ini **menimpa semua kolom** pada konflik
  `(peserta, kelas, tanggal, kode ujian)`. Choukai harus memakai **kode ujian sendiri** (mis. `CK-M1-261110`). Ini
  sudah dijaga oleh `TES_KODE_UJIAN_DIPAKAI`. Lihat keputusan terbuka no. 2 kalau ingin satu baris ujian berisi tiga
  bagian.

---

## 13. Biaya, kuota, dan ukuran

Angka di bawah adalah **perkiraan dari harga publik terakhir yang diketahui** dan harus dicek ulang sebelum
implementasi.

| Item | Perkiraan per unit | Satu kode 10 soal |
|---|---|---|
| Naskah (Gemini Flash) | sangat kecil | < US$0,01 |
| TTS | ± US$0,02 per menit audio | ± US$0,15 (±7 menit) |
| Gambar adegan | ± US$0,04 per gambar | ± US$0,15 (±4 gambar) |
| **Total** | | **± US$0,30 per kode**, sekali bayar. Peserta tidak menambah biaya |

Ukuran unduhan per peserta: 10 audio × ±180 KB + ±4 gambar × ±60 KB ≈ **2 MB**. Satu kelas 25 orang ≈ 50 MB per
tes. **Egress Supabase Storage** perlu dicek terhadap paket yang dipakai. Cache service worker (PWA sudah ada) dan
header `immutable` mengurangi unduhan ulang di latihan.

---

## 14. Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| TTS salah membaca angka/nama | Teks TTS dari furigana untuk angka, satuan, dan nama; transkripsi balik otomatis (fase 2); sensei mendengarkan saat tinjau |
| Gambar AI salah atau aneh | Benda, jumlah, jam, dan harga tidak memakai AI gambar; adegan tanpa teks; tombol buat ulang; sensei wajib melihat sebelum aktif |
| Model Gemini TTS/gambar berganti nama atau dihentikan | Nama model di env (`GEMINI_TTS_MODEL`, `GEMINI_IMAGE_MODEL`); media yang sudah dirender tetap tersimpan dan tidak tergantung model |
| Gemini kelebihan beban (503, sudah terjadi 2026-11-02) | Per aset bisa diulang; draf tidak hilang; naskah tetap punya fallback OpenRouter (TTS dan gambar tidak punya, jadi cukup ulangi) |
| Batas 60 detik Vercel | Satu aset per permintaan; panggilan TTS per soal paralel |
| Sinyal peserta lemah | MP3 32–40 kbps, WebP kecil, unduh semua sebelum timer berjalan, simpan jawaban lokal |
| Audio soal resmi bocor sebelum tes | Bucket privat, URL bertanda tangan hanya dari `mulaiTes`, berlaku terbatas |
| Batas putar bisa diakali di browser | Diterima untuk tes kelas; jumlah putar dilaporkan ke sensei |

---

## 15. Tahapan

1. **Prototipe (1–2 hari)**: skrip lokal yang merender 5 naskah N5 dengan Gemini TTS ke MP3, dan 3 gambar adegan.
   Didengar dan dilihat bersama sensei. Hal yang diputuskan: suara, kecepatan, aturan teks-dari-furigana, dan gaya
   gambar. **Belum menyentuh database.**
2. **Fase 1: choukai tanpa AI gambar**: jenis `choukai`, M1 (ikon/jam/kalender/harga), M2, M4; generator naskah,
   TTS, Storage, tinjau, runner, latihan, nilai ke `choukai`, simpan jawaban lokal; bank `choukaiN5.js` ±20 soal.
3. **Fase 2: adegan & M3**: Gemini image, panah oleh sensei, transkripsi balik otomatis untuk memeriksa audio.
4. **Fase 3**: N4, pilihan suara per kode, edit teks baris naskah oleh sensei (dengan render ulang).

---

## 16. Keputusan terbuka (untuk pemilik aplikasi)

1. **Batas putar bawaan** saat tes resmi: 1× (seperti JLPT) atau 2×?
2. **Satu ujian tiga bagian**: apakah Moji-Goi, Bunpou-Dokkai, dan Choukai dari Tes Online perlu masuk ke **satu**
   baris ujian dengan kode yang sama? Kalau ya, `upsertNilaiUjian` harus diubah agar hanya mengisi kolom bagian
   yang dikerjakan, dan `TES_KODE_UJIAN_DIPAKAI` harus mengizinkan jenis yang berbeda.
3. **Mondai apa yang dipakai dulu**: semua (M1–M4) atau M1 + M3 (yang bergambar) dulu?
4. **Anggaran AI**: apakah perkiraan ± US$0,30 per kode dan egress Storage bisa diterima, atau sebaiknya mulai dari
   bank tetap dulu (sekali render) lalu AI menyusul?
5. **Kecepatan bicara**: kecepatan JLPT asli, atau sedikit lebih lambat untuk kelas dasar? Bisa juga dibuat dua
   versi audio, dengan biaya TTS dua kali.
