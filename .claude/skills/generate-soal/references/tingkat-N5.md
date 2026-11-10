# Tingkat N5 — tata bahasa, kanji, dan ciri level

Pelengkap [spesifikasi-soal.md](spesifikasi-soal.md) untuk bank N5 (`server/domain/bankSoal/dokkaiN5.js`, id `L1-21`).

## Kanji

Kanji apa pun boleh asal berfurigana: aplikasi mengubah kanji di luar volume pilihan sensei menjadi kana saat
tes dibuat. Tetapi kosakatanya tetap harus N5 — kata sulit lebih baik diganti kata lain, bukan ditulis kana.

## Tata bahasa: N5 saja

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

## Ciri tiap level

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
