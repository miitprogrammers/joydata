# Spek 03 — Tampilan dan validator

Fase F2 di [plan.md](plan.md). Kecil, tanpa perubahan API atau skema.

## 1. Baris baru di teks bacaan (D7 tahap 1)

### 1.1 Format data

- Baris baru (`\n`) **hanya** di field `teks`, untuk memo, email, pengumuman, dan daftar. Contoh (N5, L3):

```text
森{もり}さんの机{つくえ}の上{うえ}に、このメモがあります。\n森{もり}さん\nこの資料{しりょう}を20枚{まい}コピーしてください。3時{じ}から会議{かいぎ}で使{つか}います。\n山田{やまだ}
```

  (ilustrasi format; isi tetap mengikuti aturan tata bahasa dan kosakata tingkatnya. Bank JOYdata ditulis tanpa spasi
  antar-kata.)
- Paling banyak dua baris baru berturut-turut (satu baris kosong). Spasi di awal/akhir baris dibuang.
- `judul`, `tanya`, `opsi`, `pembahasan`, `tanyaId`, `terjemahan`: satu baris.

### 1.2 Validator (`server/domain/tesOnline.js`)

Di `validasiBacaanAi` (572–599), sebelum pemeriksaan:

```js
const satuBaris = (v) => teksBersih(v).replace(/\s*\n\s*/g, ' ');
const rapikanTeks = (v) => teksBersih(v).replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n');
```

- `teks` memakai `rapikanTeks` (di kode: `teksBergaris`); field lain memakai `satuBaris`.
- **Perbaikan furigana otomatis** (`perbaikiFurigana`, ditambahkan di F2 setelah evaluasi AI F1 menemukan bacaan panjang
  ditolak karena dua slip mekanis): okurigana di dalam kurung (`悪い{わるい}` → `悪{わる}い`, `お書き{かき}` → `お書{か}き`) dan
  kurung setelah kana/katakana (`カード{かーど}` → `カード`). Dipakai pada judul, teks, pertanyaan, dan pilihan sebelum
  `furiganaLengkap`; bentuk lain tetap ditolak.
- `furiganaLengkap` tetap benar untuk teks bergaris baru (baris baru bukan kanji maupun `{}`).
- `PANJANG_MAKS` tetap (N5 800, N4 1.200, N3 1.600; sudah cukup untuk L5 baru termasuk furigana).
- `tanpaFurigana` (305) mempertahankan baris baru → kertas resmi tanpa furigana tetap bergaris.

Uji (`tesOnline.test.js`): bacaan dengan `teks` bergaris lolos dan barisnya utuh; `tanya` dengan `\n` dinormalkan jadi spasi;
`\n\n\n` dirapatkan jadi `\n\n`.

### 1.3 Tampilan (`src/components/portal/tes/FuriganaText.vue`)

```css
.furigana-text { white-space: pre-line; }
```

Berlaku di semua pemakaian: `DokkaiRunner.vue:15` (portal tes/latihan), `BankSoalTes.vue:207`, `TinjauBacaanAiDialog.vue:50`,
`HasilTes.vue:57-63`. Judul/pertanyaan/pilihan tidak pernah bergaris (validator), jadi tidak ada efek samping di sana.

Pencarian di Bank Soal (`BankSoalTes.vue:302`) memakai teks polos; baris baru tidak mengganggu.

## 2. Default jumlah bacaan kode dokkai (D6)

- `src/views/TesOnlineView.vue:460`: `form.value.jumlahSoal = jenis === 'kanji' ? 20 : 5;` → `… : 8;`
- Teks bantuan di form (i18n `id.js`/`ja.js`, kunci baru `tesOnline.saranJumlahDokkai`): "Untuk tes bernilai, disarankan
  minimal 8 bacaan (16 soal)." Ditampilkan di bawah field jumlah saat jenis = dokkai.
- Latihan tanpa kode (portal, default 3 bacaan) tidak diubah.
- Kode dengan sumber AI: `TinjauBacaanAiDialog` sudah memberi peringatan "kurang" bila bacaan < jumlah (143–144); tidak
  berubah.

## 3. Label volume N3 di frontend

Bagian dari F4 (lihat [spek-05-materi-n3.md](spek-05-materi-n3.md) §A.3), dicatat di sini karena sama-sama tampilan:

- `src/utils/volumeKanji.js`: `jlptVolume` mengenali awalan `N3`; `labelVolumeKanji` regex `/^(N[34])?VOL(\d+)$/`.
- `src/components/BankSoalTes.vue:291`: `['SEMUA', 'N4SEMUA', 'N3SEMUA']`.

## 4. Cek visual

Dengan fixture lokal (cara cek visual halaman staf yang sudah dipakai: Playwright menjawab `/api` dari fixture, dev server
di-restart setiap edit):

1. Bank Soal: bacaan memo bergaris (N5 L3) dan bacaan L5 panjang.
2. Tinjau Bacaan AI: bacaan email bergaris.
3. Portal: tes dokkai resmi (tanpa furigana) dan latihan (dengan furigana) — baris tetap.
4. Hasil tes: judul dan pertanyaan tetap satu baris.
