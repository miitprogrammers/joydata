# Spek 02 — Skill `generate-soal`: referensi, gate, N3, dan mode revisi

Fase F3 di [plan.md](plan.md). Skill: `.claude/skills/generate-soal/`. Semua perubahan tetap "lokal" (alat penulis bank),
tidak ikut ter-deploy.

## 1. Referensi (`references/`)

| File | Perubahan |
|---|---|
| `spesifikasi-soal.md` | §2 Furigana: ganti "Angka ditulis dengan kanji" → **angka Arab** + daftar pengecualian dan tabel furigana satuan (sama dengan spek-01 §2). §3 Mutu: tambah kalimat bingkai, 8 teknik pengecoh (a–h), kunci parafrase mulai L3. §4 Topik: topik pabrik/sampah/gaji hanya N4/N3. Baris baru boleh di `teks` untuk memo/email/pengumuman. |
| `tingkat-N5.md` | Tata bahasa = tabel boleh/dilarang dari [../17-aturan-final.md](../17-aturan-final.md) §3 (per bab Minna); kosakata = Minna Bab 1–25 + daftar hindari; L5 **150–250**; tabel jenis teks/pertanyaan per level dari 17 §3. Hapus kalimat "bank memakai angka kanji". |
| `tingkat-N4.md` | Tata bahasa = Minna 1–50 + modul; daftar pendukung (kelompok A–C) dan larangan (D, E); ～ようにする boleh; ～させられる tetap dilarang; kosakata Minna 1–50 (工場 dll. boleh); L5 **250–450**. |
| `tingkat-N3.md` (baru) | Bank N3: tanpa modul; level = jenis teks resmi (L1–L2 短文 150–200, L3 中文 300–350, L4 中文 330–380, L5 長文 500–550); gaya biasa di esai dan pertanyaan; catatan (注); jenis pertanyaan J11–J14; kanji dibatasi volume N5+N4+N3 (`rapikan.mjs`). Isi dari [../12-n3.md](../12-n3.md) §4–§8. |
| `brief-generator.md`, `brief-peninjau.md` | Tambah butir cek: bingkai, pengecoh dari teks, kunci parafrase (L3+), angka Arab; peninjau N3 menilai soal tema/pendapat dengan kriteria "terlalu sempit/terlalu luas". |
| `SKILL.md` | Deskripsi: tambah N3 dan mode revisi; langkah "Memperbaiki soal yang sudah ada di bank" diganti dengan alur mode revisi (§4). |

## 2. Gate mekanis (`scripts/_umum.mjs`)

### 2.1 `TINGKAT` (17–44)

```js
N5: { …, batas: { …, L5: { pjg: [150, 250], kal: [8, 14] } }, modul: false, kanjiVolume: false },
N4: { …, batas: { …, L5: { pjg: [250, 450], kal: [10, 20] } }, modul: true,  kanjiVolume: true },
N3: {
  file: 'server/domain/bankSoal/dokkaiN3.js', ekspor: 'DOKKAI_N3_LEVEL', awalan: 'N3',
  modul: false, kanjiVolume: true,
  batas: {
    L1: { pjg: [150, 200], kal: [5, 10] },
    L2: { pjg: [150, 200], kal: [5, 10] },
    L3: { pjg: [300, 350], kal: [9, 18] },
    L4: { pjg: [330, 380], kal: [10, 20] },
    L5: { pjg: [500, 550], kal: [15, 30] },
  },
},
```

- Flag baru `kanjiVolume` memisahkan "kanji harus dari volume yang dipelajari" (sekarang menempel pada `modul`,
  baris 303–311) dari "bacaan wajib punya tag `bunpou`". Kode: `if (cfg.modul) { …tag… }` dan
  `if (cfg.kanjiVolume) { …cek kanji… }`.
- Untuk N3, `KANJI_DIPELAJARI` sudah mencakup volume N3 setelah F4 (`kanjiDariVolume()` tanpa argumen = semua volume).
- Bacaan L5 bank yang **sudah ada** (90–165 / 135–250) tidak diperiksa ulang oleh batas baru kecuali direvisi; mode
  revisi (§4) memakai batas lama untuk bacaan yang tidak sedang diperpanjang (`rencana.batasLama: true`).

### 2.2 Peringatan pola (176–219)

`POLA_DI_ATAS_N5` baru (peringatan, bukan error — teks polos tanpa furigana):

| Regex | Label |
|---|---|
| `/ので(?!す)/` | ～ので (Bab 39) |
| `/つもり/` | ～つもり (Bab 31) |
| `/(?<![さばかげじたほゃょぶこしろらめぱにてどごぺぜけせ])んです/` | ～んです (Bab 26; huruf sebelum ん menyaring kata seperti かばん, おじいさん, げんかん) |
| `/ながら/` | ～ながら (Bab 28) |
| `/[てで]しま[ういっわ]/` | ～てしまう (Bab 29) |
| `/(?<!ま)[てで]あります\|[てで]おき/` | ～てあります／～ておきます (Bab 30) |
| `/[おこそとのほもよろごぞどぼぽ]うと思/` | bentuk maksud (Bab 31) |
| `/まだ[^。]*ていません/` | まだ～ていません (Bab 31) |
| `/ほうがいい\|かもしれ/` | ～ほうがいい／～かもしれません (Bab 32) |
| `/れば\|ければ\|なら[、，]/` | ～ば／～なら (Bab 35) |
| `/ように/` | ～ように (Bab 36) |
| `/られ(ます\|ません\|ました\|る\|て)/` | pasif/potensial (Bab 27, 37) |
| `/[るたい]のが/` | ～のが (Bab 38) |
| `/ないで(?!くだ\|す\|し)/` | ～ないで (tanpa, Bab 34) |
| `/そうです\|そうでした/` | ～そうです (Bab 43/47; abaikan bila "そうですか") |
| `/すぎ\|にします\|くします/` | ～すぎます／Nにします／～くします (Bab 44) |
| `/ために\|はずです/` | ～ために／～はず (Bab 42, 46) |
| `/させ(ます\|ました\|て)/` | kausatif (Bab 48) |
| `/いらっしゃ\|おります\|いたします\|くださいませ/` | keigo (Bab 49–50) |

Dihapus dari daftar lama: ～なければ, ～ことができる, ～たら, ～てあげる／くれる／もらう (sekarang boleh, D2) dan
peringatan "angka Arab".

`POLA_AWAS_N4`: hapus baris `ようにし…` (203; boleh, Minna Bab 36); label `させられ` → "kausatif-pasif (di luar Minna dan
modul)"; tambah `/はずがない/`, `/おきに/`, `/続け/` (V-続ける), `/[いきしちにびみり]出し/` (～出す), `/ということ/`,
`/ではないか|じゃないか/`, `/[しいけ]がって|[しいけ]がる/` (～がる) sebagai peringatan; hapus peringatan "angka Arab".

`POLA_AWAS.N3 = []` (peninjau yang menilai; daftar N2 tidak tersedia di KB).

### 2.3 Aturan angka (baru, semua tingkat)

```js
const ANGKA_KANJI = /[一二三四五六七八九十百千万]+(時|分|円|人|本|枚|冊|日|月|年|回|階|番|歳|個|台|杯|週間|か月|ページ|度|時間|号|名)/g;
const PENGECUALIAN_ANGKA = /^(一人|二人|一日|一緒|一度)$/;
```

Setiap kecocokan selain pengecualian → **error** "angka harus ditulis dengan angka Arab (D4)". (`一日` diizinkan hanya
untuk `一日中` dan "sehari"; peninjau memeriksa konteksnya.)

### 2.4 Kosakata Minna (baru)

- Sumber: `docs/kb-dokkai/data/minna-kosakata.json` (hanya dibaca oleh skill; tidak di-bundle).
- Peta `rangkaian kanji → bab terkecil` dibangun seperti di `16-kosakata-minna.md` (rangkaian ≥ 2 kanji, kurung ［…］ dibuang,
  pemecahan menjadi kata Minna bila perlu).
- N5: rangkaian ≥ 2 kanji yang babnya > 25 atau tidak ada di Minna → **peringatan** "kata di luar Minna Bab 1–25: X (Bab n)".
  Daftar hindari eksplisit (工場, 先輩, ごみ, …, dari 17 §3) → **error**.
- N4: rangkaian yang tidak ada di Minna → peringatan.
- N3: tidak diperiksa.
- Nama orang (diikuti さん) dan angka dilewati; daftar nama tempat umum (東京, 京都, 大阪, 北海道, 日本) dikecualikan.

### 2.5 Lain-lain

- `tanya` N3 boleh bentuk biasa; cek `tanya tidak diakhiri か。` tetap (bentuk biasa N3 juga berakhir 「か。」).
- Baris baru: `polos()` untuk panjang dan kemiripan menghapus `\n`; hitung kalimat tidak memakai baris baru.

## 3. `rapikan.mjs`

Dipakai untuk tingkat dengan `kanjiVolume: true` (N4, N3). Untuk N3, `kanjiBoleh` = volume N5+N4+N3. Tidak ada perubahan
logika selain membaca flag baru.

## 4. Mode revisi (ganti bacaan yang sudah ada, ID tetap)

Kebutuhan: F5 merevisi ±290 bacaan tanpa mengubah ID atau jumlah.

### 4.1 `siapkan.mjs --revisi`

```text
node SKILL/scripts/siapkan.mjs --jlpt N5 --revisi L5-2,L5-1,L5-24,L3-38 [--alasan "D1/D2"]
node SKILL/scripts/siapkan.mjs --jlpt N5 --revisi-dari docs/kb-dokkai/data/dampak-bank.json --kategori kata
```

- Membuat folder kerja dengan `rencana.json`: `{ mode: 'revisi', jlpt, level: { L5: { ids: ['L5-1','L5-2'], … } } }`.
- Menyalin bacaan lama ke `asli/<level>.json` (pembanding) dan ke `gen/<level>.json` (yang akan diedit).
- Menulis `alasan.json` per ID (kategori dari `dampak-bank.json`: pola, kata, angka).

### 4.2 Gate untuk mode revisi

- ID harus sama dengan ID asli dan ada di bank; jumlah = jumlah ID di rencana.
- Pemeriksaan judul unik mengecualikan bacaan itu sendiri (judul lama boleh dipertahankan).
- Kemiripan teks dengan bacaan aslinya **tidak** diperingatkan.
- Error tambahan: bila alasan revisi masih terdeteksi (mis. 工場 masih ada di bacaan N5 berkategori "kata").

### 4.3 Tinjauan

Sama dengan alur sekarang (`buta.mjs` → peninjau baru → `banding.mjs`). Bacaan berkategori **angka saja** yang dikonversi
mekanis (§5) boleh melewati tinjauan buta bila teks, soal, dan kunci identik setelah angka dinormalkan — gate
membandingkan `normalAngka(asli) === normalAngka(baru)`; selain itu wajib ditinjau.

### 4.4 `gate.mjs --audit`

```text
node SKILL/scripts/gate.mjs --audit --jlpt N4 [--level L3]
node SKILL/scripts/gate.mjs --audit --jlpt N5 --level L5 --file <bacaan-ai.json>
```

Menjalankan semua pemeriksaan §2 (pola, angka, kosakata Minna, kanji volume) langsung pada bacaan di file bank — atau,
dengan `--file`, pada array bacaan dari file JSON (keluaran AI untuk evaluasi, [rencana-uji.md](rencana-uji.md) §4) — tanpa
folder kerja; error judul unik/kemiripan dengan bank sendiri dilewati. Keluaran: daftar error dan peringatan per ID →
dasar pemilihan bacaan yang direvisi (spek-04 §3 langkah 3) dan bukti kriteria selesai.

### 4.5 `inject.mjs --ganti`

- Mengganti bacaan berdasarkan ID di file bank; menolak bila ID tidak ada, bila jumlah per level berubah, atau bila
  bacaan berubah setelah ditinjau (sidik isi, seperti sekarang).
- Menulis ringkasan diff per ID ke folder kerja (`ringkasan-revisi.md`) untuk laporan ke user.

## 5. `scripts/konversi-angka.mjs` (baru)

Mengubah angka kanji + satuan menjadi angka Arab di `judul`, `teks`, `tanya`, `opsi`, dan kutipan `pembahasan`.

| Sebelum | Sesudah | Aturan |
|---|---|---|
| 六時{ろくじ} | 6時{じ} | bacaan satuan = bacaan penuh dikurangi bacaan angka |
| 三百円{さんびゃくえん} | 300円{えん} | angka ratusan/ribuan dihitung dari kanji |
| 十分{じゅっぷん} | 10分{ぷん} | perubahan bunyi satuan dipertahankan di furigana |
| 六本{ろっぽん} | 6本{ぽん} | idem |
| 四時{よじ} / 九時{くじ} / 七時{しちじ} | 4時{じ} / 9時{じ} / 7時{じ} | bacaan angka tidak teratur |
| 二十日{はつか}, 一日{ついたち}, 二日{ふつか}…十日{とおか} | 20日{はつか}, 1日{ついたち}, 2日{ふつか}… | bacaan khusus: seluruh bacaan ditaruh di 日 |
| 三か月{さんかげつ} | 3か月{げつ} | |
| 一人{ひとり}, 二人{ふたり}, 一緒{いっしょ}, 一度{いちど}, 一{ひと}つ | tidak diubah | pengecualian |
| 三人{さんにん} | 3人{にん} | |
| 一日{いちにち} (sehari) | 1日{にち} atau tetap? | **ditandai untuk keputusan manual** |

- Keluaran: folder kerja mode revisi (§4) dengan `gen/<level>.json` hasil konversi + `laporan-angka.md` (semua perubahan,
  kasus yang tidak bisa dipecah otomatis ditandai `PERIKSA`).
- `terjemahan` dan `tanyaId` tidak diubah (bahasa Indonesia sudah memakai angka Arab).
