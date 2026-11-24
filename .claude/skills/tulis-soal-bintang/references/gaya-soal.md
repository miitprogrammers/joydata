# Gaya soal bintang

Soal bintang (並べ替え): satu kalimat dengan 4 kotak, satu bertanda ★, dan 4 potongan. Peserta memilih nomor potongan
yang jatuh di ★ (potongan ditampilkan dalam urutan acak). Spek lengkap: `docs/bunpou-adventure/spek-kode.md` §2.

## Bentuk (spek §2.1)

```js
{
  id: 'N5-to-omou-1',            // `${tingkat}-${pola}-${n}`, tetap selamanya
  pola: 'to-omou',               // id di KATALOG_MATERI, tingkatnya = tingkat soal
  situasi: null,                 // atau mis. '（タクシーの 中{なか}で）'
  baris: [
    { pembicara: 'A', teks: 'ミラーさんは どこですか。' },
    { pembicara: 'B', sebelum: 'たぶん', sesudah: '。' },   // TEPAT satu baris soal (sebelum/sesudah, tanpa teks)
  ],
  potongan: ['かいぎしつに', 'いる', 'と', '思{おも}います'],  // urutan kunci, 4 butir
  bintang: 2,                    // indeks 0-3 potongan yang jatuh di ★
  urutanLain: [],                // urutan lain yang sah; ★ wajib tetap di potongan yang sama
  terjemahan: '...',
  pembahasan: '...',
  status: 'draf',
}
```

## Aturan yang dijaga validator (`validasiSoalBintang`)

- Furigana `漢字{かな}` pada setiap kanji; kanji hanya dari `kanjiTingkat(tingkat)`; tanpa angka Latin atau huruf Latin
  di teks Jepang; angka Arab untuk bilangan; spasi antarfrasa untuk N5.
- Kalimat utuh (tanpa furigana dan spasi): N5 maks 40, N4 maks 55 karakter. Pola di atas tingkat (`polaDiAtasTingkat`) ditolak.
- 4 potongan, tidak kosong, tidak kembar, bukan tanda baca saja.
- **Potongan tidak boleh memotong kata.** Potongan tidak boleh diawali kana kecil, ん, ー, atau って (pengecualian: ん yang
  membuka ～んです / んでした / んでしょう / んじゃ). Potongan satu kana wajib partikel (は が を に へ で と も の や か ね よ).
  Akhiran konjugasi tidak boleh lepas dari batangnya di batas potongan (ま|しょ|う, くだ|さい, で|す, まし|た, いけま|せん).
  Potong di batas **bunsetsu** (kata + partikel/akhiran): ほんを / よんで / います.
- `terjemahan` bahasa Indonesia lengkap (>= 10 huruf Latin); `pembahasan` berisi penjelasan bahasa Indonesia (>= 15 huruf
  Latin), bukan kalimat Jepang saja.
- `status` = `draf` atau `ditinjau`. Sebaran ★ per volume tidak miring (> 60% di satu kotak ditolak), dan tidak sama di semua
  varian satu pola.

## Aturan gaya R1–R10 (pelajaran pilot)

- **R1.** ★ tidak boleh tertebak tanpa menyusun kalimat: tidak jatuh di satu-satunya potongan penutup kalimat, potongan
  tetap (fixed chunk), satu-satunya topik は, atau potongan dengan tanda baca unik.
- **R2.** ★ di kotak 1 atau 4 butuh paling sedikit dua kandidat masuk akal untuk kotak itu.
- **R3.** Hindari unsur mengambang (kebangsaan + nama, dua pewatas の, kata keterangan, keterangan teman atau tempat) kecuali
  ★ tetap sama di semua urutan sah.
- **R4.** Jangan memakai tokoh utama Minna dengan fakta yang bertentangan; pilih nama peserta Indonesia (Sari, Adi, Budi, ...).
- **R5.** Tata bahasa dan kosakata dari bab <= bab soal itu (Minna no Nihongo; N4 = bab 26–50 + modul).
- **R6.** Kata yang sama ditulis dalam aksara yang sama di seluruh soal (kanji atau kana, tidak campur).
- **R7.** Terjemahan lengkap; ～さん diterjemahkan nama telanjang (tanpa Pak/Bu); 先生 = "dosen" di universitas dan "dokter" di rumah sakit.
- **R8.** `pembahasan` menyebut pewatas dengan benar (siapa menerangkan siapa) dan mengutip potongan persis seperti tertulis.
- **R9.** `urutanLain` hanya berisi urutan yang wajar (bukan semua permutasi yang secara tata bahasa mungkin).
- **R10.** Baris dialog lain tidak boleh membocorkan jawaban.

Catatan pilot lain: antarvarian satu pola, ganti konteks dan posisi ★ (jangan rotasi mekanis); soal yang ditolak peninjau
ditulis ulang, bukan ditambal; setiap soal ditulis sebagai kalimat Jepang yang sungguh wajar, lalu dipotong.
