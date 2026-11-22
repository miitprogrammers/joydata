# Progres Pembuatan Soal Bintang

Pelacak produksi bank soal Bunpou Adventure. Daftar pola dan tahap di bawah dibuat dari `tahapVolume` di
`server/domain/bunpouAdventure.js`, jadi sama persis dengan yang dilihat peserta. Aturan penulisan: [spek-kode §2.1 dan §8](spek-kode.md).

**Target:** 163 pola × 4 varian = **652 soal** (N5 dan N4). N3 menyusul setelah ada modul N3 dari sensei.

## Alur satu soal

| Tahap | Arti | Siapa |
|---|---|---|
| Ditulis | draf ada di berkas kerja batch | penulis (Sonnet) |
| Lolos gate | lolos `validasiSoalBintang` / `validasiBankBintang` (furigana, kanji N5/N4, 4 kotak, ★ sama di semua urutan sah, sebaran ★) | skrip |
| Lolos peninjau | peninjau menjawab **tanpa kunci**, nomor ★-nya sama dengan kunci, tidak menemukan urutan sah yang memberi ★ lain, dan menilai kalimat wajar serta sesuai bab | peninjau (Opus) + skrip pembanding |
| Di bank | masuk `server/domain/bankSoal/bintangN5.js` / `bintangN4.js` dan `npm test` hijau | inject |
| Dicek sensei | status soal diubah dari `draf` ke `ditinjau` setelah sensei menyetujui | sensei |

Sebuah volume **terbuka untuk peserta** bila setiap polanya punya 4 soal di bank (`statusRilis`). Volume yang belum
lengkap tampil "Segera".

## Ringkasan per volume

| Volume | Bab | Tahap | Pola | Target soal | Ditulis | Di bank | Rilis | Catatan |
|---|---|---:|---:|---:|---:|---:|---|---|
| N5 Vol 1 | Bab 1–4 | 3 | 10 | 40 | 24 | 0 | belum | |
| N5 Vol 2 | Bab 5–9 | 5 | 13 | 52 | 0 | 0 | belum | |
| N5 Vol 3 | Bab 10–15 | 5 | 16 | 64 | 0 | 0 | belum | |
| N5 Vol 4 | Bab 16–21 | 5 | 19 | 76 | 28 | 0 | belum | |
| N5 Vol 5 | Bab 22–25 | 3 | 8 | 32 | 0 | 0 | belum | |
| N4 Vol 1 | Bab 26–30 | 5 | 14 | 56 | 0 | 0 | belum | |
| N4 Vol 2 | Bab 31–35 | 5 | 19 | 76 | 0 | 0 | belum | |
| N4 Vol 3 | Bab 36–40 | 4 | 13 | 52 | 0 | 0 | belum | |
| N4 Vol 4 | Bab 41–45 | 5 | 19 | 76 | 0 | 0 | belum | |
| N4 Vol 5 | Bab 46–50 | 7 | 32 | 128 | 0 | 0 | belum | |
| **Total** | | | **163** | **652** | **52** | **0** | | |

Urutan produksi: pilot (Bab 1, 2, 16, 19) → lengkapi N5 Vol 1 (Bab 3–4) dan N4 Vol 1 untuk rilis pertama → N5 Vol 2–5 →
N4 Vol 2–5.

## Riwayat batch

| Tanggal | Batch | Isi | Hasil | Catatan |
|---|---|---|---|---|
| 2026-11-22 | Pilot, putaran 1 | 13 pola (Bab 1, 2, 16, 19) × 4 = 52 soal | gate 52/52; peninjau buta: ★ cocok 52/52, lolos bersih 29, catatan 18, gagal 5 (urutan lain memberi ★ berbeda); teks: 11 perbaikan | penulis Sonnet, peninjau buta Opus. Validator salah tangkap かいしゃいんです/ぎんこういんです sebagai ～んです |
| 2026-11-22 | Pilot, putaran 2 | tulis ulang 26 soal, perbaiki teks 5 | berjalan | aturan baru R1–R9: ★ tidak boleh tertebak tanpa menyusun (penutup kalimat tunggal, potongan tetap, topik は tunggal, tanda baca unik); hindari unsur mengambang; jangan pakai tokoh Minna dengan fakta berbeda; tata bahasa ≤ bab; tulisan konsisten; terjemahan lengkap tanpa Pak/Bu; pembahasan tepat soal kata yang diterangkan; urutanLain hanya yang wajar |

## Rincian per pola

Kolom angka = jumlah varian (dari 4) yang sudah melewati tahap itu.

### N5 Vol 1 · Bab 1–4 (10 pola, 40 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 1 | N1はN2です | `wa-desu` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 1 | N1のN2 | `n-no-n` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 1 | N1もN2です | `mo` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 2 | これ／それ／あれ | `kore-sore-are` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 2 | N1ですか、N2ですか | `desu-ka-desu-ka` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 2 | この／その／あのN | `kono-sono-ano` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 3–4 | ここ／そこ／あそこ | `koko-soko-asoko` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 3–4 | ～から～まで | `kara-made` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 3–4 | ［時間］にVます | `ni-jikan` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 3–4 | ～ます／～ました | `masu` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N5 Vol 2 · Bab 5–9 (13 pola, 52 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 5 | ［場所］へ行きます | `e-ikimasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 5 | ［道具・手段］でVます | `de-shudan` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 5 | ［人］と行きます | `to-ikimasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 6 | NをVます | `wo` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 6 | ［場所］でVます | `de-basho` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 6 | ～ませんか | `masen-ka` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 6 | ～ましょう | `mashou` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 7 | ［人］に［物］をあげます | `agemasu-moraimasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 7 | もう～ました | `mou-mashita` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 8 | イA-いです／ナA-です | `keiyoushi` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 8 | あまり～ません | `amari-nai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 9 | ～はNが好きです | `ga-suki` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 9 | ～から、～ | `kara-riyuu` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N5 Vol 3 · Bab 10–15 (16 pola, 64 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 10–11 | ［場所］にNがあります | `ni-ga-arimasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 10–11 | ～つ／～枚／～人 | `josuushi` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 10–11 | ［期間］に～回 | `ni-kai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 12 | N1とN2とどちらが～ですか | `dochira-hou-ga` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 12 | N1はN2より～ | `yori` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 12 | ～かったです／～でした | `keiyoushi-kako` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 12 | ～で～が一番～ | `ichiban` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 13 | Nが欲しいです | `hoshii` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 13 | ～たいです | `tai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 13 | ［V-ます／N］に行きます | `ni-ikimasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 14 | V-かた | `kata` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 14 | ～てください | `te-kudasai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 14 | ～ましょうか | `mashou-ka` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 14 | ～ています | `te-imasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 15 | ～てもいいです | `te-mo-ii` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 15 | ～てはいけません | `te-wa-ikemasen` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N5 Vol 4 · Bab 16–21 (19 pola, 76 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 16 | V1-て、V2-て、～ | `te-te` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 16 | ～てから | `te-kara` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 16 | N1はN2が～ | `wa-ga` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 16 | イA-くて、～／ナA-で、～ | `kute-de` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 17 | ～なければなりません | `nakereba-narimasen` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 17 | ～なくてもいいです | `nakute-mo-ii` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 17 | ～までに | `made-ni` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 17 | ～ないでください | `naide-kudasai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 17 | Nは～（目的語） | `wa-toritate` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 18 | ～ことができます | `koto-ga-dekiru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 18 | ～こと | `koto` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 18 | ～まえに | `mae-ni` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 19 | ～たことがあります | `ta-koto-ga-aru` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 19 | ～たり～たりします | `tari-tari` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 19 | ～くなります／～になります | `naru` | 4/4 | 4/4 | 0/4 | 0/4 | pilot: putaran 2 |
| Bab 20–21 | 普通体（～る／～た／～ない／～だ） | `futsuutai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 20–21 | ～と思います | `to-omou` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 20–21 | ～と言います | `to-iu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 20–21 | ～でしょう？ | `deshou-kakunin` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N5 Vol 5 · Bab 22–25 (8 pola, 32 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 22–23 | ［普通形］＋N | `meishi-shuushoku` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 22–23 | ～と | `to` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 22–23 | ～とき | `toki` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 24 | ～てあげます | `te-ageru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 24 | ～てくれます | `te-kureru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 24 | ～てもらいます | `te-morau` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 25 | ～たら | `tara` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 25 | ～ても | `temo` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N4 Vol 1 · Bab 26–30 (14 pola, 56 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 26 | ～んです | `n-desu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 26 | ～ていただけませんか | `te-itadakemasen-ka` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 26 | ～たらいいですか | `tara-ii-desu-ka` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 27 | ～（ら）れます（可能形） | `kanoukei` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 27 | Nが見えます／聞こえます | `mieru-kikoeru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 27 | ～しか～ません | `shika-nai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 27 | N1は～が、N2は～ | `wa-taihi` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 28 | ～し、～し | `shi` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 28 | ～ながら | `nagara` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 29 | Nが～ています（自動詞） | `jidoushi-te-imasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 29 | ～てしまいます | `te-shimau` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 30 | ～ておきます | `te-oku` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 30 | ～とか | `toka` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 30 | ～てあります | `te-aru` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N4 Vol 2 · Bab 31–35 (19 pola, 76 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 31 | ～（よ）うと思っています | `you-to-omou` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 31 | ～つもりです | `tsumori` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 31 | まだ～ていません | `mada-te-imasen` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 31 | V-（よ）う（意向形） | `ikoukei` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 31 | ～予定です | `yotei` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 31 | ～（よ）うとする | `you-to-suru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 32 | ～かもしれません | `kamoshirenai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 32 | ～でしょう | `deshou` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 32 | ～ほうがいいです | `hou-ga-ii` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 33 | V-るな（禁止形） | `kinshikei` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 33 | V-え／V-ろ（命令形） | `meireikei` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 33 | ～という意味です | `to-iu-imi` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 33 | ～と言っていました | `to-itte-imashita` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 34 | ～とおりに | `toori-ni` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 34 | ～あとで | `ato-de` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 34 | ～ないで、～ | `naide` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 34 | ～まま | `mama` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 35 | ～ば | `ba` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 35 | ～なら | `nara` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N4 Vol 3 · Bab 36–40 (13 pola, 52 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 36 | ～ようになります | `you-ni-naru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 36 | ～ように、～ | `you-ni` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 36 | ～ようにしています | `you-ni-suru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 36 | ～ことにする | `koto-ni-suru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 36 | ～ことになる | `koto-ni-naru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 37–38 | ～（ら）れます（受身） | `ukemi` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 37–38 | ～のは／～のが／～のを | `no-meishika` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 39 | ～ので | `node` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 39 | ～て、～（理由） | `te-riyuu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 40 | ～てみます | `te-miru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 40 | ～かどうか | `ka-dou-ka` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 40 | ［疑問詞］～か、～ | `gimonshi-ka` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 40 | ［疑問詞］＋でも | `gimonshi-demo` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N4 Vol 4 · Bab 41–45 (19 pola, 76 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 41 | ～てくださいます | `te-kudasaru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 41 | ～ていただきます | `te-itadaku` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 41 | ～てやります | `te-yaru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 41 | ～てほしい | `te-hoshii` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 41 | ～てさしあげる | `te-sashiageru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 42 | ～ために | `tame-ni` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 42 | ～のに（用途） | `noni-youto` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 43 | ～そうです（様態） | `sou-youtai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 43 | ～て来ます | `te-kimasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 43 | ～ていく | `te-iku` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 43 | ～てくる | `te-kuru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 44 | Nにします | `ni-suru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 44 | ～やすいです／～にくいです | `yasui-nikui` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 44 | ～すぎます | `sugiru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 44 | イA-くします／ナA-にします | `ku-suru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 44 | 数詞＋も | `suushi-mo` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 44 | ～さ | `sa` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 45 | ～のに、～ | `noni` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 45 | ～場合は、～ | `baai` | 0/4 | 0/4 | 0/4 | 0/4 |  |

### N4 Vol 5 · Bab 46–50 (32 pola, 128 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 46 | ～はずです | `hazu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 46 | ～ところです | `tokoro` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 46 | ～たばかりです | `ta-bakari` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 46 | ～てばかりいる | `te-bakari-iru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 46 | Nばかり | `bakari` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 47 | ～そうです（伝聞） | `sou-denbun` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 47 | ～ようです | `you-desu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 47 | ～みたいだ | `mitai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 47 | ～らしい | `rashii` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 47 | Nがする | `ga-suru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 48 | ～（さ）せます | `shieki` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 48 | ～（さ）せていただけませんか | `sasete-kudasai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (1/2) | お～になります | `o-ni-naru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (1/2) | お～ください | `o-kudasai` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (1/2) | いらっしゃいます | `sonkeigo-irassharu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (1/2) | おっしゃいます | `sonkeigo-ossharu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (1/2) | ごらんになります | `sonkeigo-goran-ni-naru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (2/2) | ごぞんじです | `sonkeigo-gozonji` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (2/2) | めしあがります | `sonkeigo-meshiagaru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (2/2) | なさいます | `sonkeigo-nasaru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 49 (2/2) | ～（ら）れます（尊敬） | `sonkei-rareru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (1/2) | お～します | `o-suru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (1/2) | いたします | `kenjougo-itasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (1/2) | うかがいます | `kenjougo-ukagau` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (1/2) | おります | `kenjougo-oru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (1/2) | ぞんじます | `kenjougo-zonjiru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (1/2) | はいけんします | `kenjougo-haiken-suru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (2/2) | まいります | `kenjougo-mairu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (2/2) | ～と申します | `kenjougo-mousu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (2/2) | お～いただく | `o-itadaku` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (2/2) | もうしあげる | `kenjougo-moushiageru` | 0/4 | 0/4 | 0/4 | 0/4 |  |
| Bab 50 (2/2) | ～でございます | `de-gozaimasu` | 0/4 | 0/4 | 0/4 | 0/4 |  |
