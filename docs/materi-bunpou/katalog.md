# Katalog Materi Bunpou (F1)

> Daftar semua pola yang direncanakan untuk Materi Bunpou, yaitu `server/domain/materiBunpou/katalog.js`. Disusun 2026-11-21
> dari tabel pola Minna JPF (`docs/kb-dokkai/data/minna-pola.json`, 212 baris pola), modul 111 Bunpo N4
> (`server/domain/bankSoal/bunpouN4.js`, 104 pola), dan daftar jlptsensei N5/N4 (`grammar-n5.json`, `grammar-n4.json`).
> **Mohon dicek sebelum isi materi ditulis.** Bagian [Perlu dicek](#perlu-dicek) memuat keputusan yang paling mungkin keliru.

## Ringkasan

| | Jumlah |
|---|---|
| Entri N5 (bab Minna terkecil 1–25) | 66 |
| Entri N4 dari Minna II (bab terkecil 26–50) | 78 |
| Entri N4 yang hanya ada di modul | 19 |
| **Total entri** | **163** |
| Nomor modul 1–104 yang tercakup | 104 / 104, setiap nomor tepat di satu entri |
| Baris pola Minna yang dipakai | 206 / 212 (6 dikeluarkan, lihat [daftarnya](#baris-minna-yang-tidak-dijadikan-entri)) |
| Entri yang berasal dari baris catatan Minna (bukan baris pola) | 2 (`amari-nai`, `toka`) |

- **20 entri N5 juga membawa nomor modul** (24 nomor), misalnya #10 `kata`, #11 `tara`, #33 `koto-ga-dekiru`, dan #62–64
  `te-ageru`/`te-kureru`/`te-morau`. Tingkat mengikuti bab Minna terkecil, jadi pola-pola ini tetap N5. Di kelas N4 modul
  mengulangnya.
- **Pemeriksaan:** `validasiKatalog` 0 masalah, `cakupanModul` kosong, dan `npx tsx --test server/domain/materiBunpou/materiBunpou.test.js`
  lolos. Selain itu, untuk setiap entri dicek bahwa `minnaBab` sama dengan bab dari baris Minna yang digabung ke entri itu.

## Cara menggabung

- **Satu entri = satu pola yang diajarkan dalam satu pelajaran.** Baris Minna yang hanya beda bentuk (positif/negatif/tanya,
  sekarang/lampau, atau fungsi 〈…〉 dari pola yang sama) digabung. Contoh: Bab 1 はNです／じゃありません／ですか → `wa-desu`;
  Bab 30 ておきます〈準備〉〈措置〉〈放置〉 → `te-oku`.
- **Minna dan modul dijadikan satu entri** bila mengajarkan hal yang sama: `nara` = Bab 35 + #14 #15, `tokoro` = Bab 46 + #42–44,
  `ukemi` = Bab 37 + #56–58. Isi materi boleh memuat sampai 3 makna, jadi satu entri cukup untuk pola dengan beberapa fungsi.
- **Bentuk sama, bab dan makna berbeda → dipisah** (mis. `deshou-kakunin` Bab 21 vs `deshou` Bab 32), supaya bab dan tingkat
  setiap materi tepat.
- **Pola yang hanya ada di modul → entri sendiri, tingkat N4.**
- `pola` memakai bentuk Minna (～ます) bila pola ada di Minna, bentuk kamus bila hanya ada di modul. Bentuk lain yang mungkin
  diketik sensei (bentuk kamus, bentuk negatif, bentuk modul) ada di `varian`.
- Urutan di file: bab Minna terkecil, lalu nomor modul terkecil, lalu urutan baris Minna; entri modul saja di akhir menurut nomor modul.

## Perlu dicek

**Gabung atau pisah**

1. **Modul #1 (～たい / V(よ)うと思う) → `you-to-omou` (Bab 31), bukan `tai` (Bab 13).** Arti dan contoh di modul membahas
   ようと思う; ～たい di kelas N4 hanya pengulangan. Akibatnya `tai` tidak punya nomor modul.
2. **Modul #21 ～なくてはいけない digabung ke `nakereba-narimasen`** (bersama #20), karena modul sendiri menyebut keduanya sepadan.
3. **Modul #71 + #72 (お～する / お～いたす) → satu entri `o-suru`** (Bab 50); お～いたします dianggap varian yang lebih merendah.
4. **Modul #55, #98, #100 → `dochira-hou-ga`** (Bab 12, どちらが…？ ／ ～のほうが), sedangkan **#97 → `yori`** terpisah.
5. **#29 みたい dipisah dari `you-desu` (Bab 47 ようです).** みたい juga bermakna "mirip/seperti", dan KB 04 menilai ようだ belum
   tercakup modul.
6. **`te-kimasu` (Bab 43, pergi lalu kembali) dipisah dari `te-kuru` (#37, perubahan sampai sekarang):** bentuknya sama, maknanya lain.
7. **Bab 29 Nが V-ています (自動詞, keadaan benda) → `jidoushi-te-imasu`**, terpisah dari `te-imasu` (Bab 14, 15, 28).
8. **Bab 35 ［疑問詞］V-ばいいですか menjadi varian `tara-ii-desu-ka`**, bukan bagian `ba`. **Bab 41 V-てくださいませんか masuk
   `te-itadakemasen-ka`** (permintaan sopan), bukan `te-kudasaru`.
9. **Baris Bab 35 イA-ければ／ナA-なら／Nなら dipakai dua entri:** `ba` (bagian ければ) dan `nara` (bagian なら).
10. **Memberi dan menerima:** Bab 7 あげます／もらいます (benda) satu entri sendiri. Bab 24 dibagi per kata kerja: `te-ageru`,
    `te-kureru` (Nをくれます + V-てくれます), `te-morau`. Bab 41 juga per kata kerja; bentuk benda dan bentuk て digabung karena
    diajarkan di bab yang sama.
11. **Keigo khusus: satu entri per kata kerja** (6 sonkeigo di Bab 49, 7 kenjougo di Bab 50, ditambah もうしあげる dari modul),
    mengikuti nomor modul. Tabel JPF hanya menulis 「特別な尊敬語」/「特別な謙譲語」; pembagian ke tiap kata kerja dari pengetahuan kami.

**Tingkat dan bab**

12. **`ato-de` (Bab 34) = N4** menurut aturan, padahal sampel resmi JLPT N5 memakainya dan aturan dokkai N5 membolehkannya
    sebagai pengecualian.
13. **`made-ni` (#45) = Bab 17, N5.** Minna Bab 17 mengajarkan N（時間）までに, tetapi tabel JPF tidak mencantumkannya. Bab 17
    diisi dari pengetahuan tentang buku (dikoreksi orkestrator 2026-11-21), jadi mohon dicocokkan dengan buku.
14. **Entri modul saja yang mungkin ada di Minna** (dibiarkan tanpa bab karena tidak ada di tabel JPF; tingkatnya tetap N4 apa pun
    jawabannya): `te-sashiageru` (さしあげます, Bab 41?), `kenjougo-moushiageru` dan `de-gozaimasu` (Bab 50?), `gimonshi-demo`
    (judul percakapan Bab 27 「何でも作れるんですね」), `mitai` (percakapan Bab 44 「この写真みたいにしてください」).
15. **Dua entri berasal dari baris catatan (＊新出語彙), bukan baris pola:** `amari-nai` (あまり／ぜんぜん～ません, Bab 8–9) dan
    `toka` (Bab 30, dibutuhkan untuk modul #54).
16. **`kata` (V-かた) = Bab 14** mengikuti tabel JPF, padahal percakapan Bab 16 berjudul 「使い方を教えてください」. Mohon cek di buku.
17. **Bab 11 tetap punya entri** (`josuushi`, `ni-kai`) walaupun isinya bilangan, karena letak kata bilangan dalam kalimat
    (りんごを4つ買いました) adalah pola. Baris angka murni (umur, harga, jam, hari, tanggal) dikeluarkan.

**Di luar cakupan**

18. Pola N4 jlptsensei yang tidak ada di Minna maupun modul (mis. ～始める, ～間に, ～たがる, ～てよかった, ～おきに,
    ～ことがある "kadang-kadang") **tidak dimasukkan**. Bisa ditambahkan kemudian sebagai entri N4 tanpa bab dan tanpa modul.

## Perubahan pada 15 entri awal

`id`, `pola`, `arti`, dan `tingkat` tidak ada yang berubah. `to`, `tara`, `ba`, dan `nara` sama persis.

| id | Perubahan | Alasan |
|---|---|---|
| `nakereba-narimasen` | `modulN4` [20] → [20, 21]; `varian` baru: ～なければならない, ～なくてはいけません, ～なくてはいけない | modul #21 sepadan dengan #20 (lihat butir 2) |
| `tara-ii-desu-ka` | `minnaBab` [26] → [26, 35]; `varian` baru: ～ばいいですか, どうしたらいいですか; `kataKunci` + "minta saran" | baris Bab 35 ［疑問詞］V-ばいいですか digabung ke sini (butir 8) |
| `kata`, `naide-kudasai` | `kataKunci` ditambah satu ("cara melakukan", "tolong jangan") | minimal 2 kata kunci |
| `te-kudasai`, `te-imasu`, `kata`, `te-mo-ii`, `te-wa-ikemasen`, `te-kara`, `naide-kudasai`, `nakereba-narimasen`, `toki`, `temo` | nomor `jlptsensei` ditambahkan | rujukan saja, tidak memengaruhi validasi |

## Per bab Minna

Kolom ketiga menunjukkan baris tabel JPF yang digabung ke entri itu (tanpa tanda 【】), nomor modul, dan bab lain tempat entri
yang sama muncul. Baris yang dicoret tidak dijadikan entri.

### Jilid I · Bab 1–25 (N5)

| Bab | Entri | Baris Minna yang digabung |
|---|---|---|
| 1 | `wa-desu` N1はN2です | ［人］はNです〈名前・身分など〉 · ［人］はNじゃありません · ［人］はNですか |
|  | `n-no-n` N1のN2 | N1のN2〈所属〉 · juga Bab 2, 3 |
|  | `mo` N1もN2です | ［人］もNです |
|  | — | ~~［人］は～歳です~~ (tidak dijadikan entri) |
| 2 | `n-no-n` N1のN2 | N1のN2〈内容〉 · ［人］のＮ〈持ち主〉 · これ/それ/あれは［人］のです〈所有〉 · juga Bab 1, 3 |
|  | `kore-sore-are` これ／それ／あれ | これ/それ/あれはＮです |
|  | `desu-ka-desu-ka` N1ですか、N2ですか | これ/それ/あれはN1ですか、N2ですか |
|  | `kono-sono-ano` この／その／あのN | この/その/あのNは［人］のです〈所有〉 |
| 3 | `n-no-n` N1のN2 | N1（国名/会社名）のN2［～製の］ · juga Bab 1, 2 |
|  | `koko-soko-asoko` ここ／そこ／あそこ | ここは［場所］です · ［場所・物・人］はここ/そこ/あそこです · ［物・人］は［場所］です · ［場所・物・人］はこちら/そちら/あちらです · 国/会社はＮです |
|  | — | ~~Nは～円です~~ (tidak dijadikan entri) |
| 4 | `kara-made` ～から～まで | Ｎは～時から～時までです · ～時から～時までVます |
|  | `ni-jikan` ［時間］にVます | ～時にVます · juga Bab 5 |
|  | `masu` ～ます／～ました | Vます/ません/ました/ませんでした |
|  | — | ~~～時～分です~~ (tidak dijadikan entri) · ~~Ｎは～曜日です~~ (tidak dijadikan entri) |
| 5 | `ni-jikan` ［時間］にVます | ［日時］に行きます/来ます/帰ります · juga Bab 4 |
|  | `e-ikimasu` ［場所］へ行きます | ［場所］へ行きます/来ます/帰ります |
|  | `de-shudan` ［道具・手段］でVます | ［乗り物］で行きます/来ます/帰ります · juga Bab 7 |
|  | `to-ikimasu` ［人］と行きます | ［人］と行きます/来ます/帰ります |
|  | — | ~~誕生日は～月～日です~~ (tidak dijadikan entri) |
| 6 | `wo` NをVます | NをVます（他動詞） · 何をしますか |
|  | `de-basho` ［場所］でVます | ［場所］でVます |
|  | `masen-ka` ～ませんか | Vませんか |
|  | `mashou` ～ましょう | Vましょう |
| 7 | `de-shudan` ［道具・手段］でVます | ［道具・手段］でVます · ［言語］でVます · ～は［言語］で～です · juga Bab 5 |
|  | `agemasu-moraimasu` ［人］に［物］をあげます | 私は［人］に［物］をあげます · 私は［人］に［物］をもらいました |
|  | `mou-mashita` もう～ました | もうVました |
| 8 | `keiyoushi` イA-いです／ナA-です | ＮはナA-/イA-です · ＮはナA-じゃありません/イA-くないです · ～はナA-な+Nです/イA-+Nです |
|  | `amari-nai` あまり～ません | *(catatan 新出語彙)* · juga Bab 9 |
| 9 | `amari-nai` あまり～ません | *(catatan 新出語彙)* · juga Bab 8 |
|  | `ga-suki` ～はNが好きです | ～はNが好きです/嫌いです · ～はNが上手です/下手です · ～はNがわかります · ～はNがあります |
|  | `kara-riyuu` ～から、～ | S1から〈理由〉、S2 |
| 10 | `ni-ga-arimasu` ［場所］にNがあります | ［場所］にNがあります · ［場所］にNがいます · ［場所］の［位置］にNがあります/います · Ｎは［場所］にあります/います · modul #47 |
| 11 | `josuushi` ～つ／～枚／～人 | ひとつ～とお〈助数詞〉 · ～枚/～台〈助数詞〉 · ～人〈助数詞〉 · ［期間］Ｖます · ～から～まで［時間・期間］かかります |
|  | `ni-kai` ［期間］に～回 | ［期間］に［～回］〈頻度〉 |
| 12 | `dochira-hou-ga` N1とN2とどちらが～ですか | N1とN2とどちらが イA-い/ナA-ですか。…～の方が イA-い/ナA- です · modul #55, #98, #100 |
|  | `yori` N1はN2より～ | N1はN2より イA-い/ナA- です · modul #97 |
|  | `keiyoushi-kako` ～かったです／～でした | ナA-/Nでした・イA-かったです · ナA-/Nじゃありませんでした・イA-くなかったです |
|  | `ichiban` ～で～が一番～ | N1でN2が一番 イA-い/ナA- です |
| 13 | `hoshii` Nが欲しいです | 私はNが欲しいです |
|  | `tai` ～たいです | 私は V-たいです |
|  | `ni-ikimasu` ［V-ます／N］に行きます | ［場所］へV-/Nに行きます |
| 14 | `kata` V-かた | V-かた〈手段・方法〉 · modul #10 |
|  | `te-kudasai` ～てください | V-てください |
|  | `mashou-ka` ～ましょうか | V-ましょうか |
|  | `te-imasu` ～ています | V-ています · juga Bab 15, 28 |
| 15 | `te-imasu` ～ています | V-ています〈結果の状態〉〈習慣的行為・職業〉 · juga Bab 14, 28 |
|  | `te-mo-ii` ～てもいいです | V-てもいいですか · modul #18 |
|  | `te-wa-ikemasen` ～てはいけません | V-てはいけません · modul #19 |
| 16 | `te-te` V1-て、V2-て、～ | V1-て、V2-て、～ |
|  | `te-kara` ～てから | V1-てから、V2 |
|  | `wa-ga` N1はN2が～ | N1はN2がナA-/イA-です |
|  | `kute-de` イA-くて、～／ナA-で、～ | イA-くて、～・ナA-/Nで、～ |
| 17 | `nakereba-narimasen` ～なければなりません | V-なければなりません · modul #20, #21 |
|  | `nakute-mo-ii` ～なくてもいいです | V-なくてもいいです · modul #22 |
|  | `made-ni` ～までに | *(tidak ada di tabel JPF; bab dari buku, lihat Perlu dicek no. 13)* · modul #45 |
|  | `naide-kudasai` ～ないでください | V-ないでください |
|  | `wa-toritate` Nは～（目的語） | ～は〈目的語の取り立て〉 |
| 18 | `koto-ga-dekiru` ～ことができます | N/V-る ことができます〈能力〉 · N/V-る ことができます〈状況可能〉 · modul #33 |
|  | `koto` ～こと | 趣味は N/V-る ことです · modul #94 |
|  | `mae-ni` ～まえに | V-る/Nの/［期間］まえに、～ |
| 19 | `ta-koto-ga-aru` ～たことがあります | V-た ことがあります · modul #40, #41 |
|  | `tari-tari` ～たり～たりします | V1-たり、V2-たりします |
|  | `naru` ～くなります／～になります | イA-くなります・ナA-/Nになります |
| 20 | `futsuutai` 普通体（～る／～た／～ない／～だ） | 普通体（動詞文） · 普通体（い形容詞文） · 普通体（な形容詞・名詞文） · 後続詞を用いた文の普通体 |
| 21 | `to-omou` ～と思います | ［普通形］と思います〈推量〉 · ［普通形］と思います〈意見〉 · modul #26 |
|  | `to-iu` ～と言います | S /［普通形］と言います · modul #104 |
|  | `deshou-kakunin` ～でしょう？ | ［普通形］でしょう？ |
| 22 | `meishi-shuushoku` ［普通形］＋N | ～はS［N（人・物・場所）］です〈名詞修飾〉 · S［N（人・物・場所）］は～〈名詞修飾〉 · S［N（人・物・場所）］をVます〈名詞修飾〉 · S［N（人・物・場所）］が～〈名詞修飾〉 · V-る［N（時間・約束・用事）］があります/ありません |
| 23 | `to` ～と | V-ると、～ · modul #13 |
|  | `toki` ～とき | V-る/V-ない とき、～ · V-る/V-た とき、～ · イA-い/ナA-な/Nの とき、～ |
| 24 | `te-ageru` ～てあげます | V-てあげます · modul #62 |
|  | `te-kureru` ～てくれます | Nをくれます · V-てくれます · modul #63 |
|  | `te-morau` ～てもらいます | V-てもらいます · modul #64 |
| 25 | `tara` ～たら | ［普通形過去］ら、～〈仮定条件〉 · V-たら、～〈確定条件〉 · modul #11 |
|  | `temo` ～ても | V-ても/イA-くても/ナA-・Nでも、～〈逆説の仮定条件〉 · modul #16 |

### Jilid II · Bab 26–50 (N4)

| Bab | Entri | Baris Minna yang digabung |
|---|---|---|
| 26 | `n-desu` ～んです | ～んですか · どうして～んですか…～んです · ～。～んです · modul #103 |
|  | `te-itadakemasen-ka` ～ていただけませんか | ～んですが、V-ていただけませんか · juga Bab 41 |
|  | `tara-ii-desu-ka` ～たらいいですか | ～んですが、［疑問詞］V-たらいいですか · juga Bab 35 |
| 27 | `kanoukei` ～（ら）れます（可能形） | Nが可能動詞 · modul #34 |
|  | `mieru-kikoeru` Nが見えます／聞こえます | Nが見えます／聞こえます |
|  | `shika-nai` ～しか～ません | NしかVません |
|  | `wa-taihi` N1は～が、N2は～ | N1はVますが、N2はVません〈対比〉 |
|  | — | ~~Nができます~~ (tidak dijadikan entri) |
| 28 | `te-imasu` ～ています | V-ています〈習慣〉 · juga Bab 14, 15 |
|  | `shi` ～し、～し | ～し、～し、それに～〈並列描写〉 · ～し、～し、～〈理由の列挙〉 · どうして～んですか…～し、（～し、）～から。 · modul #53 |
|  | `nagara` ～ながら | V1-ながらV2 |
| 29 | `jidoushi-te-imasu` Nが～ています（自動詞） | Nが V-ています〈自動詞・状態〉 · Nは V-ています〈自動詞・状態〉 |
|  | `te-shimau` ～てしまいます | V-てしまいます/ました〈完了〉 · V-てしまいました〈遺憾〉 |
| 30 | `te-oku` ～ておきます | V-ておきます〈準備〉 · V-ておきます〈措置〉 · V-ておきます〈放置〉 · modul #7 |
|  | `toka` ～とか | *(catatan 新出語彙)* · modul #54 |
|  | `te-aru` ～てあります | ～に～が V-てあります〈状態・目的〉 · ～は ～にV-てあります〈状態・目的〉 |
| 31 | `you-to-omou` ～（よ）うと思っています | ［V意向形］と思っています · modul #1 |
|  | `tsumori` ～つもりです | V-る/V-ない つもりです · modul #3 |
|  | `mada-te-imasen` まだ～ていません | まだV-ていません · modul #39 |
|  | `ikoukei` V-（よ）う（意向形） | V意向形 |
|  | `yotei` ～予定です | V-る/Nの 予定です |
| 32 | `kamoshirenai` ～かもしれません | ［普通形］かもしれません · modul #24 |
|  | `deshou` ～でしょう | ［普通形］でしょう · modul #27 |
|  | `hou-ga-ii` ～ほうがいいです | V-た/V-ない ほうがいいです · modul #99 |
| 33 | `kinshikei` V-るな（禁止形） | V禁止形 · modul #23 |
|  | `meireikei` V-え／V-ろ（命令形） | V命令形 · modul #50 |
|  | `to-iu-imi` ～という意味です | 「～」と書いてあります/読みます · ～は～という意味です |
|  | `to-itte-imashita` ～と言っていました | S/［普通形］と言っていました · S/［普通形］と伝えていただけませんか |
| 34 | `toori-ni` ～とおりに | V1-る・V1-た/Nの とおりに、V2 |
|  | `ato-de` ～あとで | V1-た/Nの あとで、V2 |
|  | `naide` ～ないで、～ | V1-て/V1-ないでV2 · V1-ないで、V2 |
| 35 | `tara-ii-desu-ka` ～たらいいですか | ［疑問詞］V-ば いいですか · juga Bab 26 |
|  | `ba` ～ば | V-ば/V-なければ、〜〈仮定条件〉 · イA-ければ/ナA-なら/Nなら、～〈仮定条件〉 · modul #12 |
|  | `nara` ～なら | イA-ければ/ナA-なら/Nなら、～〈仮定条件〉 · Nなら、～〈助言〉 · modul #14, #15 |
| 36 | `you-ni-naru` ～ようになります | V-る ようになります · modul #35 |
|  | `you-ni` ～ように、～ | V1-る/V1-ない ように、V2 |
|  | `you-ni-suru` ～ようにしています | V-る/V-ない ようにしています · V-る/V-ない ようにしてください |
| 37 | `ukemi` ～（ら）れます（受身） | ［人］は～に［～を］V-（ら）れます · ［人］は～に［所有物］をV-（ら）れます · ［物/こと］が/はV-（ら）れます · modul #56, #57, #58 |
| 38 | `no-meishika` ～のは／～のが／～のを | V-る のはイA-/ナA- です · V-る のがイA-/ナA- です · V-る のを忘れました · V［普通形］のを知っています · ［普通形］のはNです · modul #102 |
| 39 | `node` ～ので | ［普通形］ので、～ · modul #51 |
|  | `te-riyuu` ～て、～（理由） | V-て/V-なくて、～ · Nで、～ · イA-くて、～/ナA-で、～ |
| 40 | `te-miru` ～てみます | V-てみます · modul #8 |
|  | `ka-dou-ka` ～かどうか | ～かどうか、～ · modul #31 |
|  | `gimonshi-ka` ［疑問詞］～か、～ | [疑問詞]～か、～ · modul #32 |
| 41 | `te-itadakemasen-ka` ～ていただけませんか | V-てくださいませんか · juga Bab 26 |
|  | `te-kudasaru` ～てくださいます | Nをくださいます · V-てくださいます · modul #66 |
|  | `te-itadaku` ～ていただきます | Nをいただきます · V-ていただきます · modul #67 |
|  | `te-yaru` ～てやります | Nをやります · V-てやります · modul #68 |
| 42 | `tame-ni` ～ために | V-る/Nの ために、Vます〈目的〉 · modul #4 |
|  | `noni-youto` ～のに（用途） | V-る のに/N に～かかります · ～はV-る のに/N に、～〈用途・評価〉 |
| 43 | `sou-youtai` ～そうです（様態） | V-そうです〈様態〉 · イA-/ナA- そうです〈様態〉 · modul #25 |
|  | `te-kimasu` ～て来ます | V-て 来ます |
| 44 | `ni-suru` Nにします | Nにします · modul #49 |
|  | `yasui-nikui` ～やすいです／～にくいです | V-やすい/にくいです · modul #90, #91, #92 |
|  | `sugiru` ～すぎます | V-/イA-/ナA- すぎます · modul #93 |
|  | `ku-suru` イA-くします／ナA-にします | イA-く/ナA-に/Nに します |
| 45 | `noni` ～のに、～ | ［普通形］のに、～ · modul #52 |
|  | `baai` ～場合は、～ | ～場合は、～ |
| 46 | `hazu` ～はずです | ～はずです · modul #28 |
|  | `tokoro` ～ところです | V-る/V-ている/V-た ところです · modul #42, #43, #44 |
|  | `ta-bakari` ～たばかりです | V-た ばかりです |
| 47 | `sou-denbun` ～そうです（伝聞） | ［普通形］そうです（伝聞） |
|  | `you-desu` ～ようです | ［普通形］ようです |
| 48 | `shieki` ～（さ）せます | V（さ）せます〈強制〉 · V（さ）せます〈容認〉 · modul #59, #60 |
|  | `sasete-kudasai` ～（さ）せていただけませんか | V（さ）せていただけませんか · modul #61 |
| 49 | `o-ni-naru` お～になります | おVになります · modul #69 |
|  | `o-kudasai` お～ください | おV/ごN ください · modul #70 |
|  | `sonkeigo-irassharu` いらっしゃいます | 特別な尊敬語 · modul #74 |
|  | `sonkeigo-ossharu` おっしゃいます | 特別な尊敬語 · modul #75 |
|  | `sonkeigo-goran-ni-naru` ごらんになります | 特別な尊敬語 · modul #76 |
|  | `sonkeigo-gozonji` ごぞんじです | 特別な尊敬語 · modul #77 |
|  | `sonkeigo-meshiagaru` めしあがります | 特別な尊敬語 · modul #78 |
|  | `sonkeigo-nasaru` なさいます | 特別な尊敬語 · modul #79 |
|  | `sonkei-rareru` ～（ら）れます（尊敬） | V（ら）れます〈尊敬〉 · modul #80 |
| 50 | `o-suru` お～します | おV/ごN します · modul #71, #72 |
|  | `kenjougo-itasu` いたします | 特別な謙譲語（自分自身のこと） · modul #81 |
|  | `kenjougo-ukagau` うかがいます | 特別な謙譲語（目上のための行為） · modul #82 |
|  | `kenjougo-oru` おります | 特別な謙譲語（自分自身のこと） · modul #83 |
|  | `kenjougo-zonjiru` ぞんじます | 特別な謙譲語（自分自身のこと） · modul #84 |
|  | `kenjougo-haiken-suru` はいけんします | 特別な謙譲語（目上のための行為） · modul #85 |
|  | `kenjougo-mairu` まいります | 特別な謙譲語（自分自身のこと） · modul #86 |
|  | `kenjougo-mousu` ～と申します | 特別な謙譲語（自分自身のこと） · modul #88 |


## Per kategori modul N4

Setiap nomor modul menunjuk tepat satu entri. Kolom terakhir: tingkat entri dan bab Minna-nya.

### Kategori 1 · Keinginan, Niat, Rencana, & Tujuan

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 1 | ～たい / V(よ)うと思う | L1 | `you-to-omou` | N4 · Bab 31 |
| 2 | V(よ)うとする | L4 | `you-to-suru` | N4 · modul saja |
| 3 | V つもりだ | L1 | `tsumori` | N4 · Bab 31 |
| 4 | V ため(に) | L3 | `tame-ni` | N4 · Bab 42 |
| 5 | V ことにする | L3 | `koto-ni-suru` | N4 · modul saja |
| 6 | V ことになる | L3 | `koto-ni-naru` | N4 · modul saja |
| 7 | V ておく | L2 | `te-oku` | N4 · Bab 30 |
| 8 | V てみる | L2 | `te-miru` | N4 · Bab 40 |
| 9 | V てほしい | L3 | `te-hoshii` | N4 · modul saja |
| 10 | V 方 | L1 | `kata` | N5 · Bab 14 |

### Kategori 2 · Pengandaian & Syarat (Kondisional)

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 11 | ～たら | L2 | `tara` | N5 · Bab 25 |
| 12 | ～ば | L3 | `ba` | N4 · Bab 35 |
| 13 | ～と | L2 | `to` | N5 · Bab 23 |
| 14 | ～なら [仮定] | L3 | `nara` | N4 · Bab 35 |
| 15 | ～なら [話題] | L3 | `nara` | N4 · Bab 35 |
| 16 | ～ても / ～でも | L2 | `temo` | N5 · Bab 25 |
| 17 | 疑問詞 + でも | L3 | `gimonshi-demo` | N4 · modul saja |

### Kategori 3 · Izin, Larangan, Keharusan, & Ketidakharusan

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 18 | ～てもいい | L1 | `te-mo-ii` | N5 · Bab 15 |
| 19 | ～てはいけない | L1 | `te-wa-ikemasen` | N5 · Bab 15 |
| 20 | ～なければならない | L2 | `nakereba-narimasen` | N5 · Bab 17 |
| 21 | ～なくてはいけない | L2 | `nakereba-narimasen` | N5 · Bab 17 |
| 22 | ～なくてもいい | L2 | `nakute-mo-ii` | N5 · Bab 17 |
| 23 | V な | L3 | `kinshikei` | N4 · Bab 33 |

### Kategori 4 · Dugaan, Perkiraan, Kesimpulan, & Kabar Burung

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 24 | ～かもしれない | L3 | `kamoshirenai` | N4 · Bab 32 |
| 25 | ～そうだ | L3 | `sou-youtai` | N4 · Bab 43 |
| 26 | ～(だろう)と思う | L2 | `to-omou` | N5 · Bab 21 |
| 27 | ～だろう | L3 | `deshou` | N4 · Bab 32 |
| 28 | ～はずだ | L3 | `hazu` | N4 · Bab 46 |
| 29 | ～みたい | L4 | `mitai` | N4 · modul saja |
| 30 | ～らしい | L4 | `rashii` | N4 · modul saja |
| 31 | ～かどうか | L3 | `ka-dou-ka` | N4 · Bab 40 |
| 32 | 疑問詞 + ～か | L3 | `gimonshi-ka` | N4 · Bab 40 |

### Kategori 5 · Kemampuan, Perubahan State, & Kebiasaan

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 33 | V ことができる | L1 | `koto-ga-dekiru` | N5 · Bab 18 |
| 34 | V(ら)れる [可能] | L1 | `kanoukei` | N4 · Bab 27 |
| 35 | V ようになる | L2 | `you-ni-naru` | N4 · Bab 36 |
| 36 | V ていく | L4 | `te-iku` | N4 · modul saja |
| 37 | V てくる | L4 | `te-kuru` | N4 · modul saja |
| 38 | V てばかりいる | L4 | `te-bakari-iru` | N4 · modul saja |
| 39 | まだ V ていない | L1 | `mada-te-imasen` | N4 · Bab 31 |

### Kategori 6 · Keterangan Waktu, Alur Aksi, & Pengalaman

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 40 | V たことがある | L1 | `ta-koto-ga-aru` | N5 · Bab 19 |
| 41 | V たことがない | L1 | `ta-koto-ga-aru` | N5 · Bab 19 |
| 42 | V ところだ | L4 | `tokoro` | N4 · Bab 46 |
| 43 | V ているところだ | L2 | `tokoro` | N4 · Bab 46 |
| 44 | V たところだ | L4 | `tokoro` | N4 · Bab 46 |
| 45 | ～までに | L2 | `made-ni` | N5 · Bab 17 |
| 46 | ～まま | L3 | `mama` | N4 · modul saja |
| 47 | N がある | L1 | `ni-ga-arimasu` | N5 · Bab 10 |
| 48 | N がする | L3 | `ga-suru` | N4 · modul saja |
| 49 | N にする | L1 | `ni-suru` | N4 · Bab 44 |
| 50 | V 命令形 | L3 | `meireikei` | N4 · Bab 33 |

### Kategori 7 · Hubungan Akibat, Alasan, & Pertentangan

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 51 | ～ので | L2 | `node` | N4 · Bab 39 |
| 52 | ～のに | L3 | `noni` | N4 · Bab 45 |
| 53 | ～し | L2 | `shi` | N4 · Bab 28 |
| 54 | ～とか | L2 | `toka` | N4 · Bab 30 |
| 55 | N と N と どちら | L1 | `dochira-hou-ga` | N5 · Bab 12 |

### Kategori 8 · Kalimat Pasif & Kausatif (Ukemi & Shieki)

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 56 | V(ら)れる [受け身] | L4 | `ukemi` | N4 · Bab 37 |
| 57 | V(ら)れる [迷惑の受け身] | L4 | `ukemi` | N4 · Bab 37 |
| 58 | V(ら)れる [ものや出来事が主語の受け身] | L4 | `ukemi` | N4 · Bab 37 |
| 59 | V(さ)せる [強制] | L4 | `shieki` | N4 · Bab 48 |
| 60 | V(さ)せる [誘発] | L4 | `shieki` | N4 · Bab 48 |
| 61 | V(さ)せてください | L4 | `sasete-kudasai` | N4 · Bab 48 |

### Kategori 9 · Hubungan Bantuan & Pemberian-Penerimaan (Yaru/Kureru/Morau)

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 62 | あげる / V てあげる | L4 | `te-ageru` | N5 · Bab 24 |
| 63 | くれる / V てくれる | L4 | `te-kureru` | N5 · Bab 24 |
| 64 | もらう / V てもらう | L4 | `te-morau` | N5 · Bab 24 |
| 65 | さしあげる / V てさしあげる | L5 | `te-sashiageru` | N4 · modul saja |
| 66 | くださる / V てくださる | L5 | `te-kudasaru` | N4 · Bab 41 |
| 67 | いただく / V ていただく | L5 | `te-itadaku` | N4 · Bab 41 |
| 68 | やる / V てやる | L4 | `te-yaru` | N4 · Bab 41 |

### Kategori 10 · Keigo (Bahasa Penghormatan 尊敬語 & Merendahkan Diri 謙譲語)

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 69 | お～になる / ご～になる | L5 | `o-ni-naru` | N4 · Bab 49 |
| 70 | お～くださる / ご～くださる / お～ください / ご～ください | L4 | `o-kudasai` | N4 · Bab 49 |
| 71 | お～する / ご～する | L5 | `o-suru` | N4 · Bab 50 |
| 72 | お～いたす / ご～いたす | L5 | `o-suru` | N4 · Bab 50 |
| 73 | お～いただく / ご～いただく | L5 | `o-itadaku` | N4 · modul saja |
| 74 | いらっしゃる / V ていらっしゃる | L5 | `sonkeigo-irassharu` | N4 · Bab 49 |
| 75 | おっしゃる | L5 | `sonkeigo-ossharu` | N4 · Bab 49 |
| 76 | ごらんになる / ごらんください / ごらんくださる | L5 | `sonkeigo-goran-ni-naru` | N4 · Bab 49 |
| 77 | ごぞんじ | L5 | `sonkeigo-gozonji` | N4 · Bab 49 |
| 78 | めしあがる | L5 | `sonkeigo-meshiagaru` | N4 · Bab 49 |
| 79 | なさる | L5 | `sonkeigo-nasaru` | N4 · Bab 49 |
| 80 | V(ら)れる [敬語] | L5 | `sonkei-rareru` | N4 · Bab 49 |
| 81 | いたす | L5 | `kenjougo-itasu` | N4 · Bab 50 |
| 82 | うかがう | L5 | `kenjougo-ukagau` | N4 · Bab 50 |
| 83 | おる / V ておる | L4 | `kenjougo-oru` | N4 · Bab 50 |
| 84 | ぞんじる / ぞんずる | L5 | `kenjougo-zonjiru` | N4 · Bab 50 |
| 85 | はいけんする | L5 | `kenjougo-haiken-suru` | N4 · Bab 50 |
| 86 | まいる | L5 | `kenjougo-mairu` | N4 · Bab 50 |
| 87 | もうしあげる | L5 | `kenjougo-moushiageru` | N4 · modul saja |
| 88 | もうす | L5 | `kenjougo-mousu` | N4 · Bab 50 |
| 89 | AN・N でございます | L4 | `de-gozaimasu` | N4 · modul saja |

### Kategori 11 · Tingkat Kemudahan, Kecenderungan, & Batas Kuantitas

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 90 | V やすい [容易] | L1 | `yasui-nikui` | N4 · Bab 44 |
| 91 | V やすい [傾向] | L4 | `yasui-nikui` | N4 · Bab 44 |
| 92 | V にくい | L1 | `yasui-nikui` | N4 · Bab 44 |
| 93 | ～すぎる | L1 | `sugiru` | N4 · Bab 44 |
| 94 | ～こと | L2 | `koto` | N5 · Bab 18 |
| 95 | N ばかり | L2 | `bakari` | N4 · modul saja |
| 96 | 数詞 + も | L2 | `suushi-mo` | N4 · modul saja |

### Kategori 12 · Perbandingan, Derajat, & Sifat

| # | Pola modul | Level | Entri | Tingkat · Bab |
|---|---|---|---|---|
| 97 | は ～より | L1 | `yori` | N5 · Bab 12 |
| 98 | ～ほう | L1 | `dochira-hou-ga` | N5 · Bab 12 |
| 99 | ～ほうがいい | L2 | `hou-ga-ii` | N4 · Bab 32 |
| 100 | ～より ～ほう | L1 | `dochira-hou-ga` | N5 · Bab 12 |
| 101 | A さ / AN さ | L3 | `sa` | N4 · modul saja |
| 102 | ～の | L2 | `no-meishika` | N4 · Bab 38 |
| 103 | ～のだ / ～んだ | L3 | `n-desu` | N4 · Bab 26 |
| 104 | ～と言う | L1 | `to-iu` | N5 · Bab 21 |


## Baris Minna yang tidak dijadikan entri

| Bab | Baris tabel JPF | Alasan |
|---|---|---|
| 1 | 【［人］は～歳です】 | umur ～歳: kosakata angka, bukan pola |
| 3 | 【Nは～円です】 | harga ～円 / いくら: kosakata angka |
| 4 | 【～時～分です】 | jam ～時～分: kosakata angka |
| 4 | 【Ｎは～曜日です】 | hari ～曜日: kosakata |
| 5 | 【誕生日は～月～日です】 | tanggal ～月～日: kosakata angka |
| 27 | 【Nができます】 | Nができます (jadi/selesai dibangun): makna kosakata できる; disinggung di materi kanoukei/koto-ga-dekiru |

Baris catatan (＊新出語彙 dsb., 20 baris) dan judul percakapan (50 baris) memang bukan pola; dua catatan tetap dipakai sebagai sumber bab (butir 15).

## Entri yang hanya ada di modul

Tingkat N4, tanpa bab Minna.

| # | id | Pola | Arti |
|---|---|---|---|
| 2 | `you-to-suru` | ～（よ）うとする | baru mau … / hendak … |
| 5 | `koto-ni-suru` | ～ことにする | memutuskan untuk … |
| 6 | `koto-ni-naru` | ～ことになる | diputuskan (pihak lain) bahwa … |
| 9 | `te-hoshii` | ～てほしい | ingin orang lain … |
| 17 | `gimonshi-demo` | ［疑問詞］＋でも | siapa pun / di mana pun / kapan pun |
| 29 | `mitai` | ～みたいだ | sepertinya … / mirip … |
| 30 | `rashii` | ～らしい | sepertinya … / katanya … |
| 36 | `te-iku` | ～ていく | akan terus … (ke depan) |
| 37 | `te-kuru` | ～てくる | mulai … / makin … (sampai kini) |
| 38 | `te-bakari-iru` | ～てばかりいる | kerjanya … melulu |
| 46 | `mama` | ～まま | dalam keadaan … (dibiarkan) |
| 48 | `ga-suru` | Nがする | terdengar / tercium / terasa |
| 65 | `te-sashiageru` | ～てさしあげる | memberi / melakukan … untuk atasan |
| 73 | `o-itadaku` | お～いただく | menerima kebaikan dari atasan |
| 87 | `kenjougo-moushiageru` | もうしあげる | menyampaikan / mengucapkan (merendah) |
| 89 | `de-gozaimasu` | ～でございます | adalah (sangat sopan) |
| 95 | `bakari` | Nばかり | hanya … saja / melulu … |
| 96 | `suushi-mo` | 数詞＋も | sampai … (jumlah yang banyak) |
| 101 | `sa` | ～さ | kata sifat jadi kata benda (-nya) |
