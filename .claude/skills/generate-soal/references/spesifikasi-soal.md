# Spesifikasi soal dokkai (bank JOYdata)

Pembaca soal ini adalah calon pemagang Indonesia yang sedang belajar bahasa Jepang tingkat N5 dan akan bekerja
di Jepang. Soal dipakai untuk tes bernilai, jadi satu furigana salah atau satu soal berjawaban ganda langsung
merugikan peserta. Semua aturan di bawah berasal dari bank yang sudah ada dan dari keputusan pemilik aplikasi.

## 1. Bentuk data

Satu file per level, `gen/<level>.json`, berisi array bacaan. Field harus tepat ini, tidak lebih tidak kurang:

```json
{
  "id": "L2-21",
  "judul": "スーパーの買{か}い物{もの}",
  "teks": "…bacaan bahasa Jepang dengan furigana…",
  "terjemahan": "…terjemahan Indonesia seluruh bacaan…",
  "soal": [
    { "id": "L2-21-1", "tanya": "…か。", "tanyaId": "…?", "opsi": ["…", "…", "…"], "benar": 0, "pembahasan": "kutipan = arti." },
    { "id": "L2-21-2", "tanya": "…か。", "tanyaId": "…?", "opsi": ["…", "…", "…"], "benar": 2, "pembahasan": "kutipan = arti." }
  ]
}
```

- `id` berurutan mulai dari nomor di `rencana.json`; id soal = id bacaan + `-1` / `-2`. Tiap bacaan tepat 2 soal.
- `tanya` dan ketiga `opsi` bahasa Jepang dengan furigana. `benar` = indeks (0, 1, 2) pilihan yang benar.
- `tanyaId` = terjemahan Indonesia dari `tanya`, diakhiri `?`. Hanya tampil di pembahasan setelah tes.
- `pembahasan` = **kutipan persis dari bacaan, tanpa furigana** + ` = ` + artinya dalam bahasa Indonesia.
  Dua potongan kalimat disambung dengan `…`. Untuk soal hitungan atau simpulan, tambahkan penalaran singkat
  dalam kurung: `いつもより三十分早く、朝七時に…出ます = 30 menit lebih awal dari biasanya, yaitu pukul 7 (jadi biasanya pukul 7.30).`
  Gate menolak kutipan yang tidak ada di teks kata demi kata.

## 2. Furigana

Format: bacaan kana di dalam `{}` **tepat setelah rangkaian kanjinya**; okurigana di luar kurung.

| Benar | Salah |
|---|---|
| `食{た}べます` | `食べ{たべ}ます`, `食べます{たべます}` |
| `買{か}い物{もの}` | `買い物{かいもの}` |
| `日本語{にほんご}` | `日{に}本{ほん}語{ご}` boleh, tetapi bank menulis per kata |
| `お弁当{べんとう}`, `お知{し}らせ` | `お弁当{おべんとう}` |

- Setiap kanji wajib berfurigana, di mana pun: judul, teks, pertanyaan, pilihan — termasuk kanji yang berulang.
- Kata yang sudah ada di `referensi-furigana.txt` memakai bacaan yang sama. Kata baru: tulis bacaan yang benar
  untuk konteksnya, lalu periksa lagi satu per satu di daftar "FURIGANA BARU" keluaran gate.
- Perubahan bunyi adalah sumber salah yang paling sering:
  `一本{いっぽん}` `三本{さんぼん}` `六本{ろっぽん}` · `三百{さんびゃく}` `六百{ろっぴゃく}` `八百{はっぴゃく}` · `三千{さんぜん}` `八千{はっせん}` ·
  `一分{いっぷん}` `三分{さんぷん}` `十分{じゅっぷん}` · `四時{よじ}` `七時{しちじ}` `九時{くじ}` · `四月{しがつ}` `七月{しちがつ}` `九月{くがつ}` ·
  `一日{ついたち}` (tanggal) vs `一日{いちにち}` (sehari) · `二日{ふつか}` … `十日{とおか}` `二十日{はつか}` ·
  `一人{ひとり}` `二人{ふたり}` `四人{よにん}` · `一つ{ひとつ}` ditulis `一{ひと}つ` · `今日{きょう}` `今年{ことし}` `今朝{けさ}` `大人{おとな}` `上手{じょうず}` `下手{へた}` ·
  `何{なに}を` vs `何{なん}で／何時{なんじ}／何人{なんにん}` · `十歳{じゅっさい}` `二十歳{はたち}` · `月曜日{げつようび}` `木{き}` vs `木曜日{もくようび}`.
- Angka ditulis dengan kanji (`六時{ろくじ}`, `三百円{さんびゃくえん}`), bukan angka Arab. Tidak ada huruf Latin.
  Kata serapan dan nama orang asing dengan katakana; nama Jepang boleh kanji + furigana (`山田{やまだ}さん`).
- Kurung `{}` hanya untuk furigana. `pembahasan`, `tanyaId`, dan `terjemahan` tidak memuat `{}`.
- Kanji apa pun boleh asal berfurigana: aplikasi mengubah kanji di luar volume pilihan sensei menjadi kana saat
  tes dibuat. Tetapi kosakatanya tetap harus N5 — kata sulit lebih baik diganti kata lain, bukan ditulis kana.

## 3. Tata bahasa: N5 saja

Gaya です・ます di seluruh bacaan dan pertanyaan.

Boleh: ～ます／ません／ました／ませんでした · です／でした／ではありません · kata sifat い／な (lampau, negatif, ～くて／～で) ·
～ています · ～てください · ～ないでください · ～てもいいです · ～てはいけません · ～てから · ～て、～ · ～たい ·
～ましょう／～ませんか · ～から (alasan) · ～が (tetapi) · でも／それから／そして／ですから · ～とき · ～まえに／～あとで ·
～たり～たりします · ～より／～のほうが／いちばん · ～くなります／～になります · あげます／もらいます (kata kerja saja) ·
～と言{い}いました · あります／います · から…まで · kata keterangan waktu dan frekuensi (いつも、よく、ときどき、あまり、ぜんぜん) ·
kata kerja bentuk kamus + の／こと (`話{はな}すのは楽{たの}しいです`) dan penjelas kata benda pendek (`日本{にほん}の料理{りょうり}を作{つく}る店{みせ}`) hanya di L5.

Tidak boleh: ～なければなりません · ～ので · ～のに · ～てしまう · ～ようになる／～ようにする · ～ことができる dan bentuk potensial ·
～つもり · ～そうです (kabar/kesan) · ～たら · ～ば · ～なら · ～かもしれません · ～はずです · ～ために · ～てあげる／くれる／もらう ·
bentuk pasif, kausatif, perintah, volisional biasa (行こう) · keigo (いらっしゃいます、おります、～でございます) · bentuk biasa di akhir kalimat.

Gate memberi PERINGATAN bila menemukan pola ini. Peringatan bisa keliru (`くだもので`, `そうですか`), jadi baca
tiap peringatan: kalau memang pola terlarang, tulis ulang kalimatnya.

## 4. Ciri tiap level

Panjang dihitung dari teks tanpa furigana; gate menolak yang di luar batas. Contoh gaya ada di `contoh-<level>.json`.

| Level | Panjang | Kalimat | Isi bacaan | Jenis pertanyaan |
|---|---|---|---|---|
| L1 Kalimat sangat dasar | 30–58 | 3–4 | Kalimat pendek tentang diri, benda, keluarga, kegiatan sederhana. Satu informasi per kalimat. | Dua-duanya mencari satu fakta yang tertulis langsung (siapa, apa, di mana, kapan, berapa). |
| L2 Rutinitas & tempat | 45–85 | 3–4 | Rutinitas, letak tempat, belanja: ada jam, harga, jumlah, atau posisi. | Fakta langsung tentang angka, waktu, tempat. Pengecoh diambil dari angka/tempat lain yang masuk akal. |
| L3 Informasi & alasan sederhana | 50–95 | 3–5 | Pengumuman, catatan, ajakan, penjelasan pendek dengan alasan (～から) atau permintaan (～てください). | Satu soal fakta; satu soal "mengapa" atau "apa yang harus/tidak boleh dilakukan". |
| L4 Jadwal & detail bacaan | 60–115 | 4–6 | Jadwal, urutan kegiatan, perbandingan, beberapa angka sekaligus. | Satu soal detail; satu soal yang menggabungkan dua detail (urutan, lama waktu, jumlah harga, mana yang lebih …). |
| L5 Bacaan lebih panjang & simpulan | 90–165 | 5–8 | Surat, email, catatan harian, cerita pendek, pengumuman agak panjang. | Soal 1 detail; soal 2 simpulan sederhana: jawabannya tidak tertulis persis, tetapi pasti dari satu–dua kalimat. |

Level naik karena bacaannya lebih panjang dan pertanyaannya lebih menuntut, bukan karena tata bahasanya naik
ke N4. L5 tetap N5.

## 5. Mutu pertanyaan

Peninjau independen akan menjawab tiap soal **tanpa melihat kunci**. Kalau jawabannya berbeda dari kunci,
bacaan itu diblokir. Jadi tulis soal yang jawabannya hanya satu dan bisa dibuktikan dari teks:

1. **Tepat satu pilihan benar.** Dua pilihan lain harus pasti salah menurut bacaan, bukan sekadar "kurang tepat".
   Jangan membuat pengecoh yang juga benar bila dibaca dengan cara lain.
2. **Harus membaca untuk menjawab.** Jangan soal yang terjawab dengan akal sehat ("apa yang dimakan saat
   sarapan?" dengan pengecoh "sepatu"). Pengecoh terbaik berasal dari detail lain di bacaan yang sama (jam lain,
   orang lain, tempat lain) atau hal yang sangat wajar tetapi tidak dikatakan teks.
3. **Pilihan sejajar.** Ketiganya berbentuk sama (tiga jam, tiga tempat, tiga kalimat) dan panjangnya mirip.
   Pilihan benar jangan selalu yang terpanjang atau satu-satunya yang rinci.
4. **Dua soal, dua bagian teks.** Soal 1 tidak membocorkan jawaban soal 2, dan keduanya tidak menanyakan hal sama.
5. **Kunci tersebar rata.** Dalam satu level, indeks 0, 1, dan 2 masing-masing kira-kira sepertiga (gate menolak
   bila satu indeks di luar ±25% dari rata-rata). Jangan berpola (0,1,2,0,1,2…).
6. **Pertanyaan bervariasi.** Kalimat tanya yang sama dipakai paling banyak tiga kali per level.
7. **Terjemahan setia.** `terjemahan` dan `tanyaId` mengatakan hal yang sama dengan bahasa Jepangnya — angka,
   hari, dan subjeknya cocok. `～さん` tidak menyebut jenis kelamin: tulis namanya saja, bukan "Pak"/"Bu".
8. **Judul tidak membocorkan jawaban.** Peserta melihat judul. `海の近くのうち` menjawab "rumah nenek ada di
   mana?", `水曜日のごみ` menjawab "botol dibuang hari apa?". Judul menyebut topik, bukan fakta yang ditanyakan.

Yang paling sering ditahan peninjau adalah butir 2, dalam tiga bentuk: aturan yang bisa ditebak ("apa yang
tidak boleh dipakai saat tes?" → kamus), pengetahuan umum (selisih jam Jepang–Indonesia), dan perbandingan
yang sudah jelas dari dunia nyata (bus lebih murah tetapi lebih lama daripada shinkansen). Obatnya: tanyakan
angka atau detail yang hanya ada di teks itu, atau jadikan hitungan dari dua angka di teks.

## 6. Topik

- Jangan mengulang judul atau cerita di `judul-terpakai.txt`; gate menolak judul yang sama dan memberi
  peringatan bila teks mirip lebih dari 50% dengan bacaan lain.
- Kira-kira separuh topik sehari-hari (keluarga, makanan, belanja, cuaca, hobi, kota, liburan, sekolah bahasa)
  dan separuh kehidupan pemagang di Jepang (asrama, pabrik, shift, kantin, bus perusahaan, sampah dan aturan
  lingkungan, bank, kantor pos, rumah sakit, festival, rekan kerja, kirim uang ke keluarga).
- Tokoh bervariasi: nama Indonesia dan nama Jepang, "わたし", orang ketiga. Isi harus wajar di dunia nyata
  (harga, jam kerja, jarak, musim).
