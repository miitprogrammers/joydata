# Setoran Soal Bintang: spesifikasi untuk agent penulis

Dokumen ini untuk **agent yang menulis draf soal** Bunpou Adventure. Draf disetor dalam bentuk berkas JSON, lalu ditinjau
oleh Claude lewat peninjau buta (menjawab tanpa kunci). Hanya soal yang lolos yang masuk bank. Kamu **tidak** memasukkan apa
pun ke bank.

**Bahan untuk agent (semuanya Markdown, tidak ada lampiran JSON):**

| Berkas | Isi |
|---|---|
| `docs/bunpou-adventure/setoran-soal.md` | dokumen ini (format setoran, aturan, contoh) |
| `docs/bunpou-adventure/setoran/daftar-pola.md` | 150 pola yang harus ditulis (600 soal) per volume: id soal, pola, arti, bab, tahap |
| `.claude/skills/tulis-soal-bintang/references/gaya-soal.md` | aturan gaya R1–R10 dan aturan validator |
| `docs/kb-dokkai/16-kosakata-minna.md` | kosakata Minna per bab (acuan batas kosakata) |
| `docs/kb-dokkai/15-tata-bahasa-minna.md` | tata bahasa Minna per bab (acuan batas tata bahasa) |

`docs/bunpou-adventure/setoran/daftar-pola.json` berisi data yang sama untuk alat di sisi Claude; tidak perlu diberikan ke agent.

---

## 1. Larangan

- **Jangan mengubah berkas apa pun di repo**: bank (`server/domain/bankSoal/bintang*.js`), validator, tes, skrip skill,
  `AGENTS.md`, dokumen. Jangan commit, jangan push.
- Jangan menjalankan `inject-bintang.mjs` atau `setujui-bintang.mjs`.
- Bila validator menolak soal yang menurutmu benar, **ubah soalnya**, lalu laporkan kasusnya. Jangan mengubah aturan.
- Hasil disimpan **di luar repo**, mis. `E:\setoran-bunpou\` (atau folder yang ditentukan user).

## 2. Yang disetor (per volume)

Kerjakan per volume sesuai urutan di `daftar-pola.md`: BN5V1, BN4V1, BN5V4, BN5V2, BN5V3, BN5V5, BN4V2, BN4V3, BN4V4, BN4V5.
Untuk setiap volume, hasilkan dua JSON (boleh sebagai teks JSON di jawaban; user yang menyimpannya ke berkas):

| Berkas | Isi |
|---|---|
| `<VOLUME>.json` | larik soal untuk semua pola volume itu di `daftar-pola.md` (bentuk §3) |
| `<VOLUME>.catatan.json` | larik catatan penulis, satu per soal (bentuk §4) |

JSON harus valid (tanpa komentar, tanpa koma di akhir larik). Bila satu volume terlalu panjang untuk satu jawaban, pecah per
tahap, tetapi setiap potongan tetap larik JSON yang utuh.

Satu volume boleh disetor begitu selesai; tidak perlu menunggu volume lain.

| Volume | Bab | Pola | Soal |
|---|---|---:|---:|
| BN5V1 | 1–4 (sisa Bab 3–4) | 4 | 16 |
| BN4V1 | 26–30 | 14 | 56 |
| BN5V4 | 16–21 (sisa) | 12 | 48 |
| BN5V2 | 5–9 | 13 | 52 |
| BN5V3 | 10–15 | 16 | 64 |
| BN5V5 | 22–25 | 8 | 32 |
| BN4V2 | 31–35 | 19 | 76 |
| BN4V3 | 36–40 | 13 | 52 |
| BN4V4 | 41–45 | 19 | 76 |
| BN4V5 | 46–50 | 32 | 128 |
| **Total** | | **150** | **600** |

## 3. Bentuk satu soal (`<VOLUME>.json`)

Contoh N4 (dialog):

```json
{
  "id": "N4-tsumori-1",
  "pola": "tsumori",
  "situasi": null,
  "baris": [
    { "pembicara": "A", "teks": "らいねんは 何{なに}を しますか。" },
    { "pembicara": "B", "sebelum": "", "sesudah": "です。" }
  ],
  "potongan": ["日本{にほん}の", "会社{かいしゃ}で", "働{はたら}く", "つもり"],
  "bintang": 2,
  "urutanLain": [],
  "terjemahan": "A: Tahun depan kamu akan melakukan apa? B: Saya berencana bekerja di perusahaan Jepang.",
  "pembahasan": "Pola V-る + つもりです menyatakan niat. 日本の menerangkan 会社, 会社で menunjukkan tempat bekerja, lalu 働く langsung sebelum つもり.",
  "status": "draf"
}
```

Contoh N5 (soal sudah ada di bank; baris soal di A, jawaban di B):

```json
{
  "id": "N5-ta-koto-ga-aru-1",
  "pola": "ta-koto-ga-aru",
  "situasi": null,
  "baris": [
    { "pembicara": "A", "sebelum": "", "sesudah": "？" },
    { "pembicara": "B", "teks": "いいえ、 一度{いちど}も ありません。" }
  ],
  "potongan": ["すもうを", "見{み}た", "ことが", "ありますか"],
  "bintang": 1,
  "urutanLain": [],
  "terjemahan": "A: Pernahkah kamu menonton sumo? B: Belum, sekali pun belum pernah.",
  "pembahasan": "Pengalaman: V-た + ことが あります. 見た langsung di depan ことが.",
  "status": "draf"
}
```

| Field | Aturan |
|---|---|
| `id` | **Pakai persis** id dari kolom "ID soal" di `daftar-pola.md` (`<tingkat>-<pola>-<n>`, n = 1–4). Jangan membuat id sendiri. |
| `pola` | id pola dari `daftar-pola.md` (bagian tengah ID soal, mis. `koko-soko-asoko`). Pola itu harus menjadi **inti yang diuji**; minimal satu potongan memuat penandanya. |
| `situasi` | `null`, atau keterangan adegan singkat berbahasa Jepang, mis. `"（きょうしつで）"`. |
| `baris` | 1 baris (kalimat tunggal) atau 2+ baris (dialog A/B). **Tepat satu** baris soal: punya `sebelum` dan `sesudah` (boleh `""`), tanpa `teks`. Baris lain punya `teks`. `pembicara`: `"A"`, `"B"`, atau `null`. |
| `potongan` | **4 potongan dalam URUTAN YANG BENAR** (urutan kunci). `sebelum + potongan[0..3] + sesudah` harus membentuk kalimat yang benar. Aplikasi sendiri yang mengacak nomornya; **jangan mengacak di sini**. |
| `bintang` | indeks 0–3 kotak yang bertanda ★ (dalam urutan kunci). Pilih dengan sengaja per soal, jangan dirotasi. |
| `urutanLain` | urutan lain yang **juga wajar**, sebagai larik indeks potongan, mis. `[[1,0,2,3]]`. Potongan di kotak ★ harus sama di semua urutan itu; kalau tidak, ubah soalnya. `[]` bila tidak ada. |
| `terjemahan` | terjemahan bahasa Indonesia **lengkap** untuk seluruh soal (semua baris dialog, sampai kata kerja terakhir). |
| `pembahasan` | 1–2 kalimat **bahasa Indonesia** yang menjelaskan mengapa urutannya begitu, berfokus pada pola. Boleh mengutip Jepang persis seperti di potongan. Bukan sekadar mengulang kalimat Jepang. |
| `status` | selalu `"draf"`. |

Tidak boleh ada field lain di soal maupun di baris.

## 4. Catatan penulis (`<VOLUME>.catatan.json`)

Dipakai peninjau untuk memeriksa kunci dan tingkat. Satu entri per soal:

```json
{
  "id": "N4-tsumori-1",
  "kalimat": "日本{にほん}の 会社{かいしゃ}で 働{はたら}く つもりです。",
  "kosakata": [{ "kata": "会社", "bab": 3 }, { "kata": "働きます", "bab": 4 }],
  "polaLain": ["n-no-n", "de-basho"],
  "urutanDipertimbangkan": [
    { "urutan": [1, 0, 2, 3], "wajar": false, "starSama": true, "alasan": "日本の harus langsung sebelum 会社." }
  ]
}
```

- `kalimat`: baris soal lengkap dalam urutan benar (`sebelum` + 4 potongan + `sesudah`). Ini dicocokkan secara otomatis dengan
  `potongan`; kalau berbeda, soal ditolak.
- `kosakata`: setiap kata isi beserta bab Minna tempat kata itu pertama diajarkan (cek di `16-kosakata-minna.md`). Kata yang
  tidak ada di Minna jangan dipakai, kecuali nama orang dan nama negara.
- `polaLain`: pola lain yang ikut terpakai. Semuanya harus dari bab ≤ bab soal.
- `urutanDipertimbangkan`: urutan lain yang kamu periksa dan alasannya ditolak atau diterima.

## 5. Aturan isi

**Standar = soal JLPT N5 resmi** (keputusan user). ★ yang bisa ditempatkan dari bentuk pola (mis. Vた + ことが) boleh.
Soal **gagal** bila:
1. **ganda**: ada urutan lain yang wajar dengan potongan berbeda di kotak ★;
2. **bocor**: baris dialog lain memuat potongan ★ dengan tetangga yang sama;
3. **tanda baca**: ★ hanya bisa ditentukan dari tanda baca (mis. koma yang menempel di satu potongan);
4. **tidak wajar**: kalimat atau dialog janggal atau tidak logis;
5. **di atas bab**: kosakata atau tata bahasa dari bab yang lebih tinggi dari `bab` pola.

Aturan teknis (dicek validator):
- Setiap kanji diberi furigana `漢字{かな}`. Hanya kanji dari daftar kanji aplikasi untuk tingkat itu (N5 untuk soal N5,
  N5+N4 untuk soal N4); kata di luar daftar ditulis kana (contoh: 思 tidak ada di N5, tulis おもいます). Validator memberi tahu.
- Angka Arab untuk jam, tanggal, harga, umur. Tanpa huruf Latin di teks Jepang (juga huruf lebar penuh).
- Spasi antarfrasa seperti buku Minna (わたしは あした …). Potongan tidak diawali atau diakhiri spasi.
- Panjang baris soal tanpa furigana dan spasi: N5 ≤ 40, N4 ≤ 55 karakter.
- **Potong di batas frasa (bunsetsu)**, jangan di tengah kata: うかが|って, ございま|す, わから|ない, ま|しょ|う, くだ|さい, で|す
  **dilarang**. Potongan satu kana harus partikel (は が を に へ で と も の や か ね よ).
- Sebaran ★ dalam satu volume: tidak boleh lebih dari 60% di satu kotak; empat varian satu pola tidak boleh ★ di kotak yang sama.

Aturan gaya R1–R10 (lengkap di `gaya-soal.md`), ringkasnya:
- Hindari unsur yang bisa berpindah bebas (kebangsaan + nama, dua pewatas の, kata keterangan, keterangan teman/tempat), kecuali
  ★ tetap sama di semua urutan.
- Jangan memakai tokoh utama Minna (ミラー, サントス, ワン, …) dengan fakta yang bertentangan dengan buku; pakai nama peserta
  Indonesia (サリさん, アディさん, デウィさん, ブディさん).
- Satu kata ditulis dengan aksara yang sama di seluruh soal.
- ～さん diterjemahkan nama saja (tanpa Pak/Bu); 先生 = "dosen" di universitas, "dokter" di rumah sakit.
- Empat varian satu pola memakai situasi dan kalimat yang berbeda, bukan satu kalimat dengan kata diganti. Campur kalimat
  tunggal dan dialog.
- Tulis dulu kalimat Jepang yang sungguh wajar, **baru** dipotong.

Kesalahan yang membuat 580 dari 678 soal sebelumnya ditolak (jangan diulang):

| Salah | Contoh |
|---|---|
| Potongan disimpan teracak, bukan urutan benar | `このかばんは 軽くて 便利 とても です` (benar: 軽くて とても 便利です) |
| Memakai さん untuk diri sendiri | いいえ、わたしは たなかさんです |
| Kata dipotong di tengah | `うかが` + `って`, `ございま` + `す` |
| Potongan hanya tanda baca | `？` sebagai potongan |
| Terjemahan kosong; pembahasan hanya kalimat Jepang | `"pembahasan": "寝る前に歯を磨きます"` |
| ★ dirotasi mekanis, urutan lain tidak dicek | dua urutan wajar memberi ★ berbeda |

## 6. Cek mandiri sebelum setor

Periksa setiap soal terhadap daftar ini:
- 4 potongan dalam urutan benar; `kalimat` di catatan sama dengan `sebelum` + potongan + `sesudah`.
- Tepat satu baris soal; `bintang` 0–3; urutan di `urutanLain` memberi potongan ★ yang sama.
- Setiap kanji berfurigana; tidak ada kata terpotong; potongan satu kana hanya partikel.
- Terjemahan lengkap dan pembahasan berbahasa Indonesia.
- Semua kosakata dan pola dari bab ≤ `bab`.
- Lima jenis kegagalan di §5 tidak ada.

Bila agent punya akses ke repo, jalankan juga gate mekanis dari akar repo (hanya membaca):

```
node .claude/skills/tulis-soal-bintang/scripts/periksa-bintang.mjs E:\setoran-bunpou\BN5V1.json --tingkat N5 --varian 4
```

(`--tingkat N4` untuk volume BN4; baris terakhir harus `ok` dan `Masalah: 0`). Tanpa akses repo, gate ini dijalankan Claude
saat menerima setoran.

## 7. Setelah disetor

Claude memeriksa `kalimat` terhadap `potongan`, menjalankan gate, lalu peninjau Opus menjawab setiap soal **tanpa kunci**. Soal
yang gagal dikembalikan dengan catatan untuk **ditulis ulang** (bukan ditambal), dan id-nya tetap. Soal yang lolos dimasukkan
ke bank lewat `inject-bintang.mjs`, dan hasil setiap putaran dicatat di `docs/bunpou-adventure/tinjauan/` serta
`progres-soal.md`. Sebuah volume terbuka untuk peserta begitu setiap polanya punya 4 soal lolos.
