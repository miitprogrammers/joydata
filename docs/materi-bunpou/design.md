# Desain: Materi Bunpou (dashboard sensei)

Status: usulan, belum diimplementasi · 2026-11-21 · branch `materi-bunpou`

Halaman baru di dashboard staf untuk **menjelaskan pola tata bahasa di kelas**. Sensei mencari pola yang ingin
dijelaskan, daftar hasilnya muncul, lalu satu klik membuka **halaman presentasi**: slide yang bisa langsung
diproyeksikan. Isinya mencakup cara membentuk pola, makna, padanan bahasa Indonesia, contoh kasus pemakaian, kesalahan
yang sering terjadi, dan latihan singkat.

Isi penjelasan ditulis Claude dengan knowledge base `docs/kb-dokkai/` sebagai acuan. Acuan "pola apa diajarkan di bab
berapa" adalah Minna no Nihongo dan modul 111 Bunpo N4. Mockup yang bisa diklik: [mockup.html](mockup.html) (buka di browser).
Contoh isi satu materi lengkap: [contoh-materi-tara.md](contoh-materi-tara.md).

---

## 1. Ringkasan keputusan

| Hal | Usulan | Alasan singkat |
|---|---|---|
| Alur | **Cari → daftar → klik → presentasi**, dua layar saja | Permintaan user. Sensei datang dengan satu pola di kepala, bukan untuk menjelajah |
| Satuan isi | **Satu materi = satu pola**. Tingkatnya ditentukan oleh tempat pola itu pertama kali diajarkan, dan semua sumbernya dicatat | ～たら ada di Minna Bab 25 *dan* modul N4 #11. Dua salinan akan saling berbeda seiring waktu |
| Tempat isi | **File data di repo** (`server/domain/materiBunpou/`), seperti bank soal | Bisa ditinjau lewat git, diuji otomatis, dan tidak perlu tabel baru |
| Penulis isi | Claude, lewat skill baru `tulis-materi-bunpou`: penulis, gate mekanis, peninjau buta, lalu inject | Pola yang sama dengan `generate-soal`, yang sudah terbukti menahan kesalahan |
| Bentuk presentasi | **Template slide tetap** (12 jenis slide), diisi dari data | Ritme pelajaran sama untuk semua pola. Sensei tidak perlu menyusun slide |
| Kanvas slide | 1280×720 (16:9), diskalakan agar pas di layar; font besar untuk proyektor | Tata letak sama di laptop, proyektor, dan TV kelas |
| Terjemahan & jawaban | **Tersembunyi** di slide contoh dan latihan, dibuka dengan klik atau tombol `T` | Sensei bisa bertanya dulu kepada peserta |
| Furigana | Tampil secara bawaan, bisa dimatikan (`R`) | Kelas N5–N4 masih bergantung pada furigana |
| Status isi | `belum` (ada di katalog, isi belum ditulis) · `draf` (ditulis Claude, lolos gate dan peninjau) · `ditinjau` (sudah dicek sensei) | Isi AI harus terlihat jelas sebagai draf sampai dicek manusia |
| Akses | Halaman baru `materi-bunpou`, bawaan untuk admin, manager, dan sensei | Sama dengan Tes Online dan Monitor Latihan |
| Skema DB | **Tidak ada perubahan** di versi pertama | Isi statis. Tinjauan sensei di aplikasi = fase opsional (plan F6) |

---

## 2. Alur pengguna

```
┌──────────────┐  ketik "kalau"   ┌─────────────────┐  klik / Enter  ┌───────────────────────────┐
│ Materi       │ ───────────────▶ │ Daftar hasil    │ ─────────────▶ │ Presentasi ～たら          │
│ Bunpou       │                  │ (langsung, di   │                │ slide 1/12 … ←/→          │
│ (kotak cari) │ ◀─────────────── │ browser)        │ ◀───────────── │ [Esc] / "← Kembali"       │
└──────────────┘   hapus kueri    └─────────────────┘  kueri tetap   └───────────────────────────┘
        │                                                                │
        └── kueri kosong: "Terakhir dibuka" + jelajah per Bab/Kategori   └── pola terkait → presentasi lain
```

- **URL menyimpan keadaan**, jadi tombol Back browser dan tautan yang dibagikan tetap bekerja:
  `/materi-bunpou?q=kalau&tingkat=N4` untuk daftar, `/materi-bunpou/tara?slide=4` untuk presentasi.
- Kembali dari presentasi membuka daftar dengan kueri dan posisi gulir yang sama.
- Dari presentasi, chip "pola terkait" langsung membuka presentasi pola lain.

---

## 3. Layar 1: Cari & daftar

### 3.1 Mockup (desktop)

Saat sensei mengetik. Hasil muncul langsung tanpa tombol Cari, karena pencarian berjalan di browser.

```
┌─ JOYdata ─────────┬──────────────────────────────────────────────────────────────────────────────┐
│ ▢ Dashboard       │  Materi Bunpou                                                               │
│ ▢ Progres Peserta │  Cari pola yang ingin dijelaskan, lalu buka presentasinya di kelas.          │
│ ▢ Rekap Nilai     │                                                                              │
│ ▢ Tes Online      │  ┌────────────────────────────────────────────────────────────────────────┐  │
│ ▢ Monitor Latihan │  │ 🔍  kalau                                                         ✕  │  │
│ ▣ Materi Bunpou   │  └────────────────────────────────────────────────────────────────────────┘  │
│ ▢ Rekap Kaiwa     │   ( Semua )  ( N5 · Minna I )  ( N4 · Minna II + Modul )  ( N3 )             │
│ ▢ …               │                                                                              │
│                   │  5 pola · "kalau"                         ⇄ Bandingkan ～たら・と・ば・なら   │
│                   │  ┌────────────────────────────────────────────────────────────────────────┐  │
│                   │  │ ～たら      tara        kalau … / setelah …                          › │  │
│                   │  │             [N5 · Bab 25] [Modul N4 #11 · L2]            ● Draf        │  │
│                   │  ├────────────────────────────────────────────────────────────────────────┤  │
│                   │  │ ～と        to          kalau / begitu … (pasti terjadi)             › │  │
│                   │  │             [N5 · Bab 23] [Modul N4 #13 · L2]            ● Draf        │  │
│                   │  ├────────────────────────────────────────────────────────────────────────┤  │
│                   │  │ ～ば        ba          jika … (syarat)                              › │  │
│                   │  │             [N4 · Bab 35] [Modul N4 #12 · L3]            ✓ Ditinjau    │  │
│                   │  ├────────────────────────────────────────────────────────────────────────┤  │
│                   │  │ ～なら      nara        kalau (soal) …                               › │  │
│                   │  │             [N4 · Bab 35] [Modul N4 #14 #15 · L3]        ● Draf        │  │
│                   │  ├────────────────────────────────────────────────────────────────────────┤  │
│                   │  │ ～たらいいですか  tara ii desu ka   sebaiknya … bagaimana?            │  │
│                   │  │             [N4 · Bab 26]                      ○ Belum ditulis (abu)   │  │
│                   │  └────────────────────────────────────────────────────────────────────────┘  │
└───────────────────┴──────────────────────────────────────────────────────────────────────────────┘
```

Saat kueri kosong (sensei baru membuka halaman):

```
│  🔍  Cari pola: たら · tara · kalau · Bab 25 · #11                          │
│   ( Semua ) ( N5 ) ( N4 ) ( N3 )            Kelompokkan: [Bab Minna ▾]      │
│                                                                            │
│  Terakhir dibuka   [～たら] [～ても] [～てください]        ← per perangkat  │
│                                                                            │
│  ▸ Bab 23   ～とき · ～と                                         2 pola    │
│  ▸ Bab 24   くれます · ～てあげます／もらいます／くれます        2 pola    │
│  ▾ Bab 25   ～たら · ～ても · いくら～ても                        3 pola    │
│      ～たら     kalau … / setelah …                       ● Draf  ›        │
│      ～ても     meskipun …                                ● Draf  ›        │
│      …                                                                     │
│  ▸ Bab 26   ～んです · ～ていただけませんか · ～たらいいですか     4 pola    │
```

- Pilihan "Kelompokkan": **Bab Minna** (bawaan, 1–50) atau **Kategori modul N4** (12 kategori, urutan nomor modul).
  N3 dikelompokkan per fungsi karena tidak punya buku ajar atau modul.
- "Terakhir dibuka" disimpan di `localStorage` (hanya kenyamanan per perangkat). Kalau penyimpanan kosong atau diblokir,
  bagian ini disembunyikan.
- Materi berstatus `belum` tetap tampil (abu-abu, tidak bisa diklik) supaya sensei tahu pola itu sudah direncanakan.

### 3.2 Mockup (HP)

```
┌────────────────────────────┐
│ ☰  Materi Bunpou           │
│ ┌────────────────────────┐ │
│ │ 🔍 kalau             ✕ │ │
│ └────────────────────────┘ │
│ (Semua)(N5)(N4)(N3)  →     │  ← chip bisa digeser
│                            │
│ ～たら                   › │
│ kalau … / setelah …        │
│ N5·Bab 25 · Modul #11 ●    │
│ ────────────────────────── │
│ ～と                     › │
│ kalau / begitu …           │
│ N5·Bab 23 · Modul #13 ●    │
└────────────────────────────┘
```

### 3.3 Aturan pencarian

Semua daftar ringkas (±200–400 materi, ±60 KB) diambil sekali, lalu dicari di browser. Setiap ketikan langsung memberi
hasil, dan internet kelas yang lambat tidak mengganggu.

| Yang diketik sensei | Cocok dengan | Contoh |
|---|---|---|
| Jepang (kanji/kana) | `pola`, `varian` (bentuk lain seperti もし～たら) | `たら`, `ても`, `なければ` |
| Romaji | `romaji` + romaji kueri yang diubah ke kana | `tara`, `te kudasai`, `nakereba` |
| Bahasa Indonesia | `arti`, `padanan`, `kataKunci` | `kalau`, `meskipun`, `harus`, `boleh` |
| Bab | `sumber.minnaBab` | `bab 25`, `b25` |
| Nomor modul | `sumber.modulN4` | `#11`, `modul 11` |

- **Normalisasi** (berlaku untuk kueri dan data): huruf kecil; katakana diubah ke hiragana; ～〜~・ dan spasi dihapus;
  romaji diubah ke kana (`tara` → `たら`), supaya sensei tanpa IME Jepang tetap bisa mencari.
- **Urutan hasil:** pola persis → awalan pola → romaji → arti/padanan → lainnya. Hasil dengan skor sama diurutkan
  menurut bab, lalu nomor modul.
- **Keyboard:** `/` memfokuskan kotak cari, `↑`/`↓` memilih, `Enter` membuka, `Esc` menghapus kueri.
- Bila kueri cocok dengan satu kelompok perbandingan (mis. `kalau`), muncul tautan **"⇄ Bandingkan …"** di atas daftar,
  yang membuka slide Bandingkan milik materi pertama.

---

## 4. Layar 2: Presentasi

### 4.1 Mockup (desktop, slide contoh)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ← Kembali ke "kalau"     ～たら  ● Draf          あ Furigana  文A Terjemahan  ☰ Mode baca  ⛶  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │  CONTOH 2 / 5 · 🏠 Di asrama                                        ② Pengandaian         │   │
│   │  Pengurus asrama menjelaskan apa yang harus dilakukan kalau sakit.                        │   │
│   │                                                                                            │   │
│   │          ねつ                     かいしゃ  でんわ                                         │   │
│   │    もし 熱 が ▓あったら▓、すぐ 会社 に 電話 してください。          ← 44 px, pola disorot  │   │
│   │                                                                                            │   │
│   │   ┌──────────────────────────────────────────────────────────────────────────────────┐    │   │
│   │   │  👁  Klik atau tekan T untuk menampilkan terjemahan                                │    │   │
│   │   └──────────────────────────────────────────────────────────────────────────────────┘    │   │
│   │                                                                                            │   │
│   │  💡 Belum tentu demam, jadi ini pengandaian. もし menegaskan "seandainya".                 │   │
│   └──────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                  │
│   ‹  Judul · Bentuk · Makna · [Contoh ●●○○○] · Bandingkan · Kesalahan · Latihan · Ringkasan  ›   │
│                                                                                       5 / 12     │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ▸ Catatan sensei (tidak tampil saat layar penuh)                                                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Saat **layar penuh** (`F`), hanya kanvas slide yang tampil: tanpa menu aplikasi, toolbar, dan catatan sensei. Panah kiri
dan kanan muncul samar saat tetikus bergerak.

### 4.2 Urutan slide (template tetap)

| # | Slide | Isi | Dari field | Muncul bila |
|---|---|---|---|---|
| 1 | **Judul** | pola besar (±120 px), romaji, arti ringkas, satu kalimat inti, chip sumber | `pola`, `romaji`, `arti`, `inti`, `sumber` | selalu |
| 2 | **Cara membentuk** | tabel per jenis kata: bentuk dasar → bentuk antara → hasil (warna per bagian) | `rumus[]` | selalu |
| 3 | **Makna & padanan** | 1–3 kartu makna, masing-masing dengan chip padanan Indonesia + contoh mini; kotak "Perhatikan" | `makna[]`, `perhatikan` | selalu |
| 4… | **Contoh kasus** (3–5 slide) | situasi + ikon tempat, kalimat/dialog (≤4 baris), terjemahan tersembunyi, catatan | `contoh[]` | selalu |
| … | **Bandingkan** | tabel 2–4 pola mirip; pola yang belum diajarkan diberi label "lanjutan" | `bandingkan` | bila ada |
| … | **Kesalahan umum** | 2–4 baris ❌ / ✅ / kenapa | `kesalahan[]` | bila ada |
| … | **Cek pemahaman** | 2–4 soal pendek; jawaban dibuka dengan klik | `latihan[]` | selalu |
| akhir | **Ringkasan** | 3 poin + chip pola terkait (bisa diklik) | `ringkasan[]`, `terkait[]` | selalu |

Satu materi berisi 8–13 slide. Bila sensei hanya ingin menunjukkan contoh, strip navigasi di bawah bisa langsung
melompat ke kelompok slide mana saja.

### 4.3 Kontrol

| Tombol | Aksi |
|---|---|
| `→` `Space` `PageDown` / klik sisi kanan kanvas | slide berikutnya (bila slide punya bagian tersembunyi, bagian itu dibuka dulu) |
| `←` `PageUp` / klik sisi kiri kanvas | slide sebelumnya |
| `T` | tampilkan atau sembunyikan terjemahan dan jawaban di slide ini |
| `R` | furigana tampil/hilang (berlaku untuk semua slide, diingat per perangkat) |
| `F` | layar penuh |
| `B` | mode baca (semua slide disusun ke bawah, ukuran huruf normal) |
| `Esc` | keluar layar penuh, lalu kembali ke daftar |
| `1`–`9` | lompat ke slide ke-n |

Pointer presentasi (clicker) mengirim `PageDown`/`PageUp`, jadi sudah otomatis didukung.

### 4.4 Mode baca & HP

- **Mode baca**: semua slide disusun berurutan sebagai kartu biasa, lengkap dengan catatan sensei dan semua terjemahan
  terbuka. Dipakai sensei untuk persiapan, atau untuk dibaca di HP.
- Di layar < 600 px, halaman otomatis terbuka di mode baca. Slide 16:9 di HP terlalu kecil untuk dibaca.

```
┌────────────────────────────┐
│ ←  ～たら      ● Draf  ⋯   │
│ ┌────────────────────────┐ │
│ │ ～たら                 │ │
│ │ tara · kalau/setelah   │ │
│ │ A terjadi dulu, lalu B │ │
│ └────────────────────────┘ │
│ ┌ Cara membentuk ────────┐ │
│ │ 行く → 行った → 行ったら│ │
│ │ …                      │ │
│ └────────────────────────┘ │
│ ┌ Contoh 2 · Di asrama ──┐ │
│ │ もし熱があったら、…    │ │
│ │ Kalau (seandainya) …   │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

### 4.5 Tipografi & warna (untuk proyektor)

- Ukuran di kanvas 1280×720: pola judul 120 px, kalimat Jepang contoh 44 px, furigana 0,5 em, terjemahan 28 px, teks
  biasa minimal 24 px. Proyektor kelas sering buram dan ruangan terang, jadi tidak ada teks di bawah 20 px.
- Font: Noto Sans JP untuk Jepang (sudah dipakai aplikasi), Plus Jakarta Sans/Public Sans untuk Indonesia.
- **Sorotan pola**: latar kuning stabilo (#FEF08A) dengan teks tebal. Warnanya berbeda dari furigana (biru primer) dan
  tetap terlihat di proyektor yang pudar.
- Tabel "Cara membentuk": bagian dasar slate, bagian bentuk antara biru (#1D4ED8), tambahan pola amber (#B45309).
- Latar kanvas putih, teks slate-900. Kontras ≥ 7:1 untuk teks utama.
- **Patahan baris Jepang**: setiap frasa yang diakhiri 「、」 dibungkus `inline-block`, sehingga baris dipatahkan setelah
  「、」 bila muat, bukan di tengah kata (くださ／い). Tabel memakai lebar kolom tetap. Keduanya terbukti perlu di mockup.

---

## 5. Model data

### 5.1 Bentuk satu materi

```js
// server/domain/materiBunpou/materiN5.js (dan materiN4.js, materiN3.js)
export const MATERI_N5 = [
  {
    id: 'tara',                      // slug romaji, unik di semua tingkat, dipakai di URL; tidak pernah diubah
    tingkat: 'N5',                   // tingkat tempat pola pertama kali diajarkan
    status: 'draf',                  // 'draf' | 'ditinjau'  (entri 'belum' hanya ada di katalog)
    pola: '～たら',
    varian: ['もし～たら', '～かったら', '～だったら'],   // bentuk lain yang ikut dicari
    romaji: 'tara',
    arti: 'kalau … / setelah …',
    inti: 'A terjadi dulu, lalu B.',
    kataKunci: ['jika', 'seandainya', 'kalau sudah'],
    sumber: { minnaBab: [25], modulN4: [11], jlptsensei: { N4: [88] } },
    kelompok: { minna: 25, modul: 2 },  // untuk tampilan "Kelompokkan"

    rumus: [
      { jenis: 'Kata kerja', dasar: '行{い}く', antara: '行{い}った', hasil: '行{い}ったら' },
      { jenis: 'Kata sifat -i', dasar: 'いい', antara: 'よかった', hasil: 'よかったら', catatan: 'bukan いいたら' },
      // …
    ],
    rumusPengantar: 'Kalau sudah bisa bentuk た (Bab 19), tinggal tambahkan ら.',

    makna: [
      {
        judul: 'Urutan pasti',
        penjelasan: 'A pasti terjadi, B dilakukan sesudahnya.',
        padanan: ['kalau sudah …', 'setelah …', 'nanti kalau …'],
        contohMini: { jp: '10時{じ}に[[なったら]]、出{で}かけましょう。', id: 'Nanti kalau sudah jam 10, kita berangkat.' },
      },
      // …
    ],
    perhatikan: 'Kata "kalau" mencakup empat pola Jepang: ～たら, ～と, ～ば, ～なら. …',

    contoh: [
      {
        tempat: 'asrama',            // ikon & label tetap: kerja | asrama | kelas | belanja | mensetsu | jalan | rumah | …
        makna: 1,                    // indeks ke makna[] (chip "② Pengandaian" di slide)
        situasi: 'Pengurus asrama menjelaskan apa yang harus dilakukan kalau sakit.',
        baris: [
          { penutur: null, jp: 'もし熱{ねつ}が[[あったら]]、すぐ会社{かいしゃ}に電話{でんわ}してください。',
            id: 'Kalau (seandainya) kamu demam, segera telepon perusahaan.' },
        ],
        catatan: 'Belum tentu demam, jadi ini pengandaian. もし menegaskan "seandainya".',
      },
      // 3–5 contoh
    ],

    bandingkan: {
      pola: ['tara', 'to', 'ba', 'nara'],          // id materi; sel tabel dari baris di bawah
      baris: [
        { label: 'Inti', isi: ['A terjadi dulu → B', 'A → B selalu terjadi', 'syarat agar B terwujud', 'menanggapi topik'] },
        { label: 'Boleh diikuti permintaan/ajakan?', isi: ['✅', '❌', '⚠️ bila A keadaan', '✅'] },
      ],
      contoh: ['着{つ}いたら、電話{でんわ}してください。', /* … satu per pola */],
    },
    kesalahan: [
      { salah: '雨{あめ}が降{ふ}るたら', benar: '雨{あめ}が[[降{ふ}ったら]]', alasan: 'ら menempel pada bentuk た.' },
    ],
    latihan: [
      { jenis: 'pilih', soal: '駅{えき}に（a. 着{つ}くと ／ b. 着{つ}いたら）、電話{でんわ}してください。',
        jawaban: 'b', penjelasan: 'Kalimat sesudahnya permintaan, jadi ～と tidak bisa dipakai.' },
    ],
    ringkasan: ['Bentuk: bentuk た ＋ ら (いい → よかったら).', '…', '…'],
    terkait: ['to', 'temo', 'ba', 'nara', 'tara-ii-desu-ka'],
    catatanSensei: ['Ulang bentuk た (Bab 19) 2–3 menit dulu.', '…'],
  },
];
```

### 5.2 Penanda di teks Jepang

- **Furigana**: `漢字{かな}`, sama dengan bank soal (`FuriganaText.vue`, `furiganaLengkap` di `tesOnline.js`). Setiap
  rangkaian kanji wajib punya furigana (dicek gate).
- **Sorotan pola**: `[[…]]`. Isi sorotan boleh memuat furigana: `[[降{ふ}ったら]]`. Bank soal tidak pernah memakai `[[`,
  jadi `FuriganaText` bisa diberi prop `sorot` tanpa mengubah tampilan tes.
- Baris tanpa sorotan di slide contoh ditolak gate, karena sorotan itulah yang ditunjuk sensei di layar.

### 5.3 Katalog

Sebelum isi ditulis, seluruh daftar pola disusun sebagai **katalog** (`server/domain/materiBunpou/katalog.js`): id, pola,
romaji, arti, tingkat, sumber, kelompok. Entri katalog yang belum punya isi tampil berstatus `belum`. Katalog dibentuk dari:

| Sumber KB | Dipakai untuk |
|---|---|
| `data/minna-pola.json` + [15-tata-bahasa-minna.md](../kb-dokkai/15-tata-bahasa-minna.md) | daftar pola per bab (212 baris; baris varian digabung, mis. はNです／じゃありません／ですか) |
| `server/domain/bankSoal/bunpouN4.js` | 104 pola modul N4 + nomor, kategori, level L1–L5, rumus resmi modul |
| `data/grammar-n5/n4/n3.json` + file 03–05 | arti EN/ID, pola N4 di luar modul, daftar N3 |
| [17-aturan-final.md](../kb-dokkai/17-aturan-final.md) | batas pola per tingkat (mis. ～ので dan ～つもり bukan N5) |
| `data/minna-kosakata.json` + [16](../kb-dokkai/16-kosakata-minna.md) | batas kosakata kalimat contoh per bab |
| `data/pembanding-tata-bahasa.json` | pemetaan silang Minna/Tanos/Bunpro bila sumber tidak sepakat |

---

## 6. Arsitektur

```
server/domain/materiBunpou/
  katalog.js        semua pola terencana (id, pola, sumber, kelompok)
  materiN5.js       isi materi N5 (data saja)
  materiN4.js       isi materi N4
  index.js          gabung katalog + isi; ringkasanMateri(); ambilMateri(id); validasiMateri()
  materiBunpou.test.js   skema, id unik, rujukan terkait valid, furigana lengkap, sorotan ada, batas panjang

server/apiApp.js
  GET /api/materi-bunpou        requireAuth + requirePageAccess('materi-bunpou') → { materi: [ringkas…], kelompok }
  GET /api/materi-bunpou/:id    → materi lengkap + ringkas pola terkait/bandingkan

src/views/MateriBunpouView.vue              layar cari & daftar
src/views/MateriBunpouPresentasiView.vue    layar presentasi (kanvas, toolbar, navigasi, layar penuh, mode baca)
src/components/materi-bunpou/
  SlideJudul.vue · SlideRumus.vue · SlideMakna.vue · SlideContoh.vue · SlideBandingkan.vue
  SlideKesalahan.vue · SlideLatihan.vue · SlideRingkasan.vue · KanvasSlide.vue (skala 1280×720)
src/utils/cariBunpou.js         normalisasi + skor pencarian (diuji di npm test)
src/components/portal/tes/FuriganaText.vue   + prop `sorot` untuk [[…]]
src/router/index.js             /materi-bunpou dan /materi-bunpou/:id, meta.pageKode 'materi-bunpou'
server/db/seedData.js           halaman id 24, kode materi-bunpou, bar main, ikon mdi-presentation,
                                defaultRoles ['admin','manager','sensei'], urutan setelah Monitor Latihan
src/locales/id.js, ja.js        kunci materiBunpou.* (label UI saja; isi materi berbahasa Indonesia)
```

- Isi materi dimuat saat server mulai, divalidasi saat `npm test`, dan dikirim dengan `Cache-Control` + ETag. Isi hanya
  berubah saat deploy.
- Teks Jepang diberi `lang="ja" translate="no"`. Staf Jepang yang memakai Google Translate di UI berbahasa Indonesia
  pernah mendapat kanji rusak (面雪, カイワ). Atribut ini mencegah hal yang sama terjadi pada kalimat contoh.
- Layar penuh memakai Fullscreen API pada elemen kanvas. Bila ditolak browser, kanvas diperbesar ke seluruh jendela.
- Tidak ada pemanggilan AI saat runtime. Semua isi sudah ditulis dan ditinjau sebelum deploy.

---

## 7. Aturan penulisan isi

Aturan ini menjadi `references/gaya-materi.md` di skill `tulis-materi-bunpou`, dan sebagian dicek otomatis oleh gate.

**Bahasa & gaya**
- Penjelasan dalam bahasa Indonesia baku yang santai, dengan kalimat pendek. Pembacanya peserta lulusan SMA/SMK. Istilah
  linguistik dihindari ("kata kerja", bukan "verba"; "bentuk た", bukan "perfektif").
- Penjelasan **ditulis sendiri**, bukan saduran. Buku penjelasan tata bahasa Minna (terbitan 3A), halaman jlptsensei, dan
  kalimat contoh Minna dilindungi hak cipta. Yang dipakai dari sumber tersebut hanyalah *nama pola dan nomor bab*. Rumus
  dan penomoran modul 111 Bunpo N4 milik LPK sendiri, jadi boleh diikuti.

**Padanan bahasa Indonesia**
- Setiap makna punya 1–4 padanan, dari yang paling umum.
- Bila padanan Indonesia lebih luas atau lebih sempit daripada pola Jepangnya (mis. *kalau* = 4 pola), hal itu
  **wajib** dijelaskan di `perhatikan`. Di bagian inilah penutur Indonesia paling sering salah.
- Terjemahan contoh berupa bahasa Indonesia yang alami, bukan terjemahan kata per kata. Bila struktur harfiahnya
  membantu, tulis di `catatan`.

**Contoh kasus pemakaian**
- 3–5 contoh. Setiap makna di `makna[]` mendapat paling sedikit satu contoh.
- **Konteks hidup pemagang**: tempat kerja, asrama, kelas LPK, belanja, transportasi, rumah sakit, mensetsu, telepon
  dengan perusahaan. Dalam satu materi, tempatnya tidak boleh sama semua.
- Kalimat contoh **hanya memakai pola dan kosakata yang sudah diajarkan sampai bab materi itu** (Minna). Contohnya,
  materi Bab 25 tidak boleh memakai ～ので (Bab 39). Kosakata di luar daftar menjadi peringatan gate, dan peninjau yang
  memutuskan, karena data kosakata Minna belum lengkap.
- Dialog paling banyak 4 baris, dan setiap baris Jepang paling banyak ±40 karakter (tanpa furigana) supaya muat di slide.
- Angka mengikuti D4 KB: angka Arab untuk jam, harga, dan jumlah (10時, 500円).

**Batas panjang (dicek gate, diturunkan dari kanvas 1280×720)**

| Field | Batas |
|---|---|
| `arti` | ≤ 40 karakter |
| `inti` | ≤ 60 karakter |
| `makna[]` | 1–3 butir; `penjelasan` ≤ 140 karakter; `padanan` 1–4 |
| `perhatikan` | ≤ 320 karakter |
| `rumus[]` | 2–8 baris |
| `contoh[]` | 3–5; `situasi` ≤ 120; `baris` 1–4; `id` ≤ 120; `catatan` ≤ 160 |
| `bandingkan.pola` | 2–4 kolom |
| `kesalahan[]` | 0–4 |
| `latihan[]` | 2–4 |
| `ringkasan[]` | 2–4 butir, ≤ 110 karakter |

**Alur penulisan** (skill `tulis-materi-bunpou`, meniru `generate-soal`)

```
katalog (batch ±8 pola, satu bab/kategori)
  → agen penulis      : entri katalog + bab Minna & pola sebelumnya + kosakata ≤ bab + rumus modul + gaya-materi.md
  → gate mekanis      : skema · batas panjang · furigana lengkap · sorotan di setiap baris contoh · rujukan valid
                        · peringatan kosakata di atas bab
  → peninjau buta     : menerima kalimat Jepang TANPA terjemahan dan latihan TANPA jawaban; menerjemahkan dan menjawab
                        sendiri; menilai kebenaran, kealamian, fungsi pola, batas bab, ketepatan penjelasan
  → bandingkan        : terjemahan dan jawaban peninjau vs penulis; yang berbeda direvisi atau dibuang
  → inject            : tulis ke materiN5/N4.js, status 'draf'; laporan batch
  → sensei            : membaca dan memberi koreksi → status 'ditinjau'
```

---

## 8. Di luar cakupan versi pertama

- Sensei menyunting isi di aplikasi. Koreksi dikirim ke Claude (atau lewat fitur F6 bila dipilih), lalu diperbaiki di
  repo.
- Halaman materi di portal peserta. Datanya sudah siap untuk itu (status `ditinjau` saja), tetapi perlu keputusan
  terpisah.
- Audio pelafalan, cetak/PDF slide, dan kuis yang dinilai. Latihan di slide hanya untuk dibahas bersama di kelas.
- N3. Katalog N3 bisa disusun dari `grammar-n3.json` (182 pola), tetapi isinya ditulis setelah N5 dan N4 selesai.
