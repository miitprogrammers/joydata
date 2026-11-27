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
| N5 Vol 1 | Bab 1–4 | 3 | 10 | 40 | 40 | 40 | terbuka | semua pola 4/4 |
| N5 Vol 2 | Bab 5–9 | 5 | 13 | 52 | 52 | 52 | terbuka | semua pola 4/4 |
| N5 Vol 3 | Bab 10–15 | 5 | 16 | 64 | 64 | 64 | terbuka | semua pola 4/4 |
| N5 Vol 4 | Bab 16–21 | 5 | 19 | 76 | 76 | 76 | terbuka | semua pola 4/4 |
| N5 Vol 5 | Bab 22–25 | 3 | 8 | 32 | 32 | 32 | terbuka | semua pola 4/4 |
| N4 Vol 1 | Bab 26–30 | 5 | 14 | 56 | 56 | 56 | terbuka | semua pola 4/4 |
| N4 Vol 2 | Bab 31–35 | 5 | 19 | 76 | 76 | 76 | terbuka | semua pola 4/4 |
| N4 Vol 3 | Bab 36–40 | 4 | 13 | 52 | 52 | 52 | terbuka | semua pola 4/4 |
| N4 Vol 4 | Bab 41–45 | 5 | 19 | 76 | 76 | 76 | terbuka | semua pola 4/4 |
| N4 Vol 5 | Bab 46–50 | 7 | 32 | 128 | 128 | 128 | terbuka | semua pola 4/4 |
| **Total** | | | **163** | **652** | **652** | **652** | | |

Urutan produksi: pilot (Bab 1, 2, 16, 19) → setoran agen luar untuk semua volume, ditinjau buta per volume, yang gagal
ditulis ulang Sonnet sampai lolos (2026-11-25–27). N3 menunggu modul sensei.

## Riwayat batch

| Tanggal | Batch | Isi | Hasil | Catatan |
|---|---|---|---|---|
| 2026-11-22 | Pilot, putaran 1 | 13 pola (Bab 1, 2, 16, 19) × 4 = 52 soal | gate 52/52; peninjau buta: ★ cocok 52/52, lolos bersih 29, catatan 18, gagal 5 (urutan lain memberi ★ berbeda); teks: 11 perbaikan | penulis Sonnet, peninjau buta Opus. Validator salah tangkap かいしゃいんです/ぎんこういんです sebagai ～んです |
| 2026-11-22 | Pilot, putaran 2 | tulis ulang 26 soal, perbaiki teks 5 | selesai: 52 soal final; peninjau buta terakhir 35 LOLOS dan 16 CATATAN; `wa-desu-2` diperiksa buta terpisah dan cocok. Dari 16 CATATAN, 12 hanya "★ bisa ditempatkan dari bentuk pola" (diterima menurut standar JLPT N5, plan Q13); 4 soal lain (`N5-mo-2`, `N5-mo-3`, `N5-mo-4`, `N5-kore-sore-are-2`) ★-nya dibocorkan baris A, bukan hanya bentuk pola; keempatnya ditulis ulang dan akan lewat alur baru | aturan baru R1–R9: ★ tidak boleh tertebak tanpa menyusun (penutup kalimat tunggal, potongan tetap, topik は tunggal, tanda baca unik); hindari unsur mengambang; jangan pakai tokoh Minna dengan fakta berbeda; tata bahasa ≤ bab; tulisan konsisten; terjemahan lengkap tanpa Pak/Bu; pembahasan tepat soal kata yang diterangkan; urutanLain hanya yang wajar |
| 2026-11-24 | Pembersihan bank | 678 soal tanpa tinjauan dari commit dec8098–a4af548 (N5 264, N4 414) dihapus beserta 10 berkas dump markdown dan scripts/convert-bank-soal.cjs; bank kosong lagi (Di bank = 0, tidak ada volume rilis) | validator dikembalikan dan diperketat | cacat terukur: 522 tanpa terjemahan, 288 pembahasan hanya kalimat Jepang, ±175 potongan terpotong di tengah kata, 89 kunci bukan kalimat nyata, 11 potongan hanya tanda baca, ★ dirotasi 66/66/66/66, tanpa analisis ambiguitas, salah bahasa Jepang; ditulis tanpa alur §8 (penulis → gate → peninjau buta → inject) |
| 2026-11-24 | Inject pilot | 52 soal pilot (13 pola) lewat `inject-bintang.mjs` ke `bintangN5.js` | 52 soal final putaran 1–3 (kemudian ditemukan 4 soal membocorkan ★ lewat baris A, lihat putaran 4); validator diperketat (kata terputus di batas potongan, potongan satu kana bukan partikel) dan 52/52 tetap lolos | tidak ada volume rilis (Vol 1: 6/10 pola, Vol 4: 7/19 pola); `tinjauan` diisi LOLOS untuk 52 id |
| 2026-11-24 | Standar soal | keputusan user: standar soal bintang = standar JLPT N5 (plan Q13); R1/R2 di `gaya-soal.md` dan prompt peninjau diubah | 12 soal pilot yang satu-satunya CATATAN-nya "★ bisa ditempatkan dari bentuk pola" diterima (4 lainnya dibocorkan baris A dan ditulis ulang) | gagal hanya bila jawaban ganda, ★ dibocorkan baris lain, ★ ditentukan tanda baca, kalimat tidak wajar, atau di atas bab |
| 2026-11-24 | Pengerasan alat | `inject-bintang.mjs` memakai sidik isi dari hasil bandingkan (CATATAN perlu `--terima`; soal diedit setelah tinjauan ditolak; tanpa jalur tinjauan tulisan tangan); `bandingkan.mjs` ketat (urutan permutasi, kewajaran/tingkat wajib, kode ganda galat); peta rahasia di folder terpisah; tulis bank lewat berkas sementara + impor ulang; buku tinjauan di repo (`docs/bunpou-adventure/tinjauan/`) dibaca inject sendiri, `--tinjauan-lama` dihapus, `gagal[]` bertipe pada jawaban peninjau, `setujui-bintang.mjs` + persetujuan sensei tercatat; tes skrip masuk `npm test`; aturan `で｜した` dipersempit | tes hijau | validator tetap menolak 34 (N5) dan 160 (N4) soal sampah tambahan, 0 dari 52 pilot |
| 2026-11-24 | Buku tinjauan terverifikasi | tiap putaran di `tinjauan/<putaran>/` berisi buta, jawaban, peta, hasil; inject dan `npm test` menghitung ulang status; GAGAL memblokir per sidik isi (id apa pun); `--terima` wajib `--alasan` dan dicatat di `terima.json`; `setujui-bintang` atomik dan wajib bukti; `--buku` hanya bersama `--bank`; `pilot-pra-buku.json` (46 soal putaran 1-3) dipatok di tes | `npm test` hijau | 6 soal ditinjau lewat alur nyata (putaran 4-5); 46 sisanya lewat daftar pilot-pra-buku |
| 2026-11-24 | Pilot, putaran 4–5 (alur baru) | tinjau ulang buta 6 soal: N5-mo-2, mo-3, mo-4, kore-sore-are-2 (ditulis ulang karena ★ dibocorkan baris A) serta desu-ka-desu-ka-1 dan naru-2 (dicurigai bocor ringan) | r4: LOLOS 2 (mo-2, kore-sore-are-2), CATATAN 3 (mo-3, mo-4, naru-2; diterima setelah cek teks, tercatat di `tinjauan/terima.json`), GAGAL 1 (desu-ka-desu-ka-1: tanda-baca dan bocor) → ditulis ulang, r5 LOLOS; 5 soal diganti lewat `inject-bintang.mjs --ganti` | uji nyata pertama alur buku tinjauan (peninjau Opus baru tiap putaran, isi buta.json ditempel di prompt); berkas putaran di `tinjauan/2026-11-24-pilot-r4/` dan `tinjauan/2026-11-24-pilot-r5/` |
| 2026-11-25 | Setoran agen luar, putaran 1 | soal setoran (`docs/bunpou-adventure/setoran/`, format [setoran-soal.md](setoran-soal.md)) yang lolos gate: 522 soal dari BN5V1–5 dan BN4V2–5, ditinjau buta per volume | LOLOS 406, CATATAN 24 (21 diterima setelah cek teks, 3 ditulis ulang), GAGAL 92; teks semua soal lolos dicek peninjau yang sama lalu diperbaiki (hanya terjemahan/pembahasan, sidik isi tetap) | peninjau Opus baru per batch, isi `buta.json` ditempel di prompt; berkas BN4V1 dan "bagian1" setoran rusak sehingga diganti di putaran 2; `pembicara: null` dibuang sebelum `buat-buta` agar sidik di buku cocok |
| 2026-11-27 | Setoran, putaran 2 | BN4V1 56 soal ditulis Sonnet dari nol; 22 soal setoran yang ditolak gate diperbaiki Sonnet | BN4V1: LOLOS 36, CATATAN 7 (diterima), GAGAL 13; perbaikan gate: LOLOS 21, GAGAL 1 | validator salah tangkap たいへんですね／きんえんです (～んです), よやく します (～くします), くだもので (ので), そうですね／そうですか (～そうです); penulis menghindarinya, aturan tidak diubah |
| 2026-11-27 | Setoran, putaran 3 | tulis ulang semua yang gagal di putaran 1–2: N5 55, N4 40, BN4V1 13 | N5: LOLOS 41, CATATAN 5 (diterima), GAGAL 9; N4: LOLOS 39, GAGAL 1; BN4V1: LOLOS 11, GAGAL 2 | sebab gagal terbanyak: `ganda` (keterangan/waktu/tempat mengambang, teman ～と, objek に/を tertukar, jumlah + benda) dan `di-atas-bab` (～ので Bab 39, くて sebab Bab 39, objek-は, Nにします Bab 44, bentuk potensial Bab 27, 店員, 遠く, せき, kanji di luar daftar tingkat) |
| 2026-11-27 | Setoran, putaran 4–6 | sisa 13 → 3 → 1 soal ditulis ulang | r4: LOLOS 10, GAGAL 3 (でした dan ～枚 di atas bab, 学校へ mengambang); r5: CATATAN 2 (diterima), GAGAL 1 (うーん Bab 28); r6: LOLOS 1 | semua 163 pola 4/4, 652 soal di bank, 10 volume terbuka; semua soal berstatus `draf` sampai sensei menyetujui |

## Rincian per pola

Kolom angka = jumlah varian (dari 4) yang sudah melewati tahap itu.

### N5 Vol 1 · Bab 1–4 (10 pola, 40 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 1 | N1はN2です | `wa-desu` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 1 | N1のN2 | `n-no-n` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 1 | N1もN2です | `mo` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: masuk bank 2026-11-24; mo-2, mo-3, mo-4 ★ dibocorkan baris A, ditulis ulang lewat alur baru |
| Bab 2 | これ／それ／あれ | `kore-sore-are` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: masuk bank 2026-11-24; kore-sore-are-2 ★ dibocorkan baris A, ditulis ulang lewat alur baru |
| Bab 2 | N1ですか、N2ですか | `desu-ka-desu-ka` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 2 | この／その／あのN | `kono-sono-ano` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 3–4 | ここ／そこ／あそこ | `koko-soko-asoko` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 3–4 | ～から～まで | `kara-made` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 3–4 | ［時間］にVます | `ni-jikan` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 3–4 | ～ます／～ました | `masu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N5 Vol 2 · Bab 5–9 (13 pola, 52 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 5 | ［場所］へ行きます | `e-ikimasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 5 | ［道具・手段］でVます | `de-shudan` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 5 | ［人］と行きます | `to-ikimasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 6 | NをVます | `wo` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 6 | ［場所］でVます | `de-basho` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 6 | ～ませんか | `masen-ka` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 6 | ～ましょう | `mashou` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 7 | ［人］に［物］をあげます | `agemasu-moraimasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 7 | もう～ました | `mou-mashita` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 8 | イA-いです／ナA-です | `keiyoushi` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 8 | あまり～ません | `amari-nai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 9 | ～はNが好きです | `ga-suki` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 9 | ～から、～ | `kara-riyuu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N5 Vol 3 · Bab 10–15 (16 pola, 64 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 10–11 | ［場所］にNがあります | `ni-ga-arimasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 10–11 | ～つ／～枚／～人 | `josuushi` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 10–11 | ［期間］に～回 | `ni-kai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 12 | N1とN2とどちらが～ですか | `dochira-hou-ga` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 12 | N1はN2より～ | `yori` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 12 | ～かったです／～でした | `keiyoushi-kako` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 12 | ～で～が一番～ | `ichiban` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 13 | Nが欲しいです | `hoshii` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 13 | ～たいです | `tai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 13 | ［V-ます／N］に行きます | `ni-ikimasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 14 | V-かた | `kata` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 14 | ～てください | `te-kudasai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 14 | ～ましょうか | `mashou-ka` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 14 | ～ています | `te-imasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 15 | ～てもいいです | `te-mo-ii` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 15 | ～てはいけません | `te-wa-ikemasen` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N5 Vol 4 · Bab 16–21 (19 pola, 76 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 16 | V1-て、V2-て、～ | `te-te` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 16 | ～てから | `te-kara` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 16 | N1はN2が～ | `wa-ga` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 16 | イA-くて、～／ナA-で、～ | `kute-de` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 17 | ～なければなりません | `nakereba-narimasen` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 17 | ～なくてもいいです | `nakute-mo-ii` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 17 | ～までに | `made-ni` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 17 | ～ないでください | `naide-kudasai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 17 | Nは～（目的語） | `wa-toritate` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 18 | ～ことができます | `koto-ga-dekiru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 18 | ～こと | `koto` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 18 | ～まえに | `mae-ni` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 19 | ～たことがあります | `ta-koto-ga-aru` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 19 | ～たり～たりします | `tari-tari` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 19 | ～くなります／～になります | `naru` | 4/4 | 4/4 | 4/4 | 4/4 | pilot: lolos peninjau buta, masuk bank 2026-11-24 |
| Bab 20–21 | 普通体（～る／～た／～ない／～だ） | `futsuutai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 20–21 | ～と思います | `to-omou` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 20–21 | ～と言います | `to-iu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 20–21 | ～でしょう？ | `deshou-kakunin` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N5 Vol 5 · Bab 22–25 (8 pola, 32 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 22–23 | ［普通形］＋N | `meishi-shuushoku` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 22–23 | ～と | `to` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 22–23 | ～とき | `toki` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 24 | ～てあげます | `te-ageru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 24 | ～てくれます | `te-kureru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 24 | ～てもらいます | `te-morau` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 25 | ～たら | `tara` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 25 | ～ても | `temo` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N4 Vol 1 · Bab 26–30 (14 pola, 56 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 26 | ～んです | `n-desu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 26 | ～ていただけませんか | `te-itadakemasen-ka` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 26 | ～たらいいですか | `tara-ii-desu-ka` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 27 | ～（ら）れます（可能形） | `kanoukei` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 27 | Nが見えます／聞こえます | `mieru-kikoeru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 27 | ～しか～ません | `shika-nai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 27 | N1は～が、N2は～ | `wa-taihi` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 28 | ～し、～し | `shi` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 28 | ～ながら | `nagara` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 29 | Nが～ています（自動詞） | `jidoushi-te-imasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 29 | ～てしまいます | `te-shimau` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 30 | ～ておきます | `te-oku` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 30 | ～とか | `toka` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 30 | ～てあります | `te-aru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N4 Vol 2 · Bab 31–35 (19 pola, 76 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 31 | ～（よ）うと思っています | `you-to-omou` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 31 | ～つもりです | `tsumori` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 31 | まだ～ていません | `mada-te-imasen` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 31 | V-（よ）う（意向形） | `ikoukei` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 31 | ～予定です | `yotei` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 31 | ～（よ）うとする | `you-to-suru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 32 | ～かもしれません | `kamoshirenai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 32 | ～でしょう | `deshou` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 32 | ～ほうがいいです | `hou-ga-ii` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 33 | V-るな（禁止形） | `kinshikei` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 33 | V-え／V-ろ（命令形） | `meireikei` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 33 | ～という意味です | `to-iu-imi` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 33 | ～と言っていました | `to-itte-imashita` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 34 | ～とおりに | `toori-ni` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 34 | ～あとで | `ato-de` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 34 | ～ないで、～ | `naide` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 34 | ～まま | `mama` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 35 | ～ば | `ba` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 35 | ～なら | `nara` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N4 Vol 3 · Bab 36–40 (13 pola, 52 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 36 | ～ようになります | `you-ni-naru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 36 | ～ように、～ | `you-ni` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 36 | ～ようにしています | `you-ni-suru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 36 | ～ことにする | `koto-ni-suru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 36 | ～ことになる | `koto-ni-naru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 37–38 | ～（ら）れます（受身） | `ukemi` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 37–38 | ～のは／～のが／～のを | `no-meishika` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 39 | ～ので | `node` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 39 | ～て、～（理由） | `te-riyuu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 40 | ～てみます | `te-miru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 40 | ～かどうか | `ka-dou-ka` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 40 | ［疑問詞］～か、～ | `gimonshi-ka` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 40 | ［疑問詞］＋でも | `gimonshi-demo` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N4 Vol 4 · Bab 41–45 (19 pola, 76 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 41 | ～てくださいます | `te-kudasaru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 41 | ～ていただきます | `te-itadaku` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 41 | ～てやります | `te-yaru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 41 | ～てほしい | `te-hoshii` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 41 | ～てさしあげる | `te-sashiageru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 42 | ～ために | `tame-ni` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 42 | ～のに（用途） | `noni-youto` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 43 | ～そうです（様態） | `sou-youtai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 43 | ～て来ます | `te-kimasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 43 | ～ていく | `te-iku` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 43 | ～てくる | `te-kuru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 44 | Nにします | `ni-suru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 44 | ～やすいです／～にくいです | `yasui-nikui` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 44 | ～すぎます | `sugiru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 44 | イA-くします／ナA-にします | `ku-suru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 44 | 数詞＋も | `suushi-mo` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 44 | ～さ | `sa` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 45 | ～のに、～ | `noni` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 45 | ～場合は、～ | `baai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |

### N4 Vol 5 · Bab 46–50 (32 pola, 128 soal)

| Tahap | Pola | id | Ditulis | Lolos gate | Lolos peninjau | Di bank | Catatan |
|---|---|---|---:|---:|---:|---:|---|
| Bab 46 | ～はずです | `hazu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 46 | ～ところです | `tokoro` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 46 | ～たばかりです | `ta-bakari` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 46 | ～てばかりいる | `te-bakari-iru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 46 | Nばかり | `bakari` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 47 | ～そうです（伝聞） | `sou-denbun` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 47 | ～ようです | `you-desu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 47 | ～みたいだ | `mitai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 47 | ～らしい | `rashii` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 47 | Nがする | `ga-suru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 48 | ～（さ）せます | `shieki` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 48 | ～（さ）せていただけませんか | `sasete-kudasai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (1/2) | お～になります | `o-ni-naru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (1/2) | お～ください | `o-kudasai` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (1/2) | いらっしゃいます | `sonkeigo-irassharu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (1/2) | おっしゃいます | `sonkeigo-ossharu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (1/2) | ごらんになります | `sonkeigo-goran-ni-naru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (2/2) | ごぞんじです | `sonkeigo-gozonji` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (2/2) | めしあがります | `sonkeigo-meshiagaru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (2/2) | なさいます | `sonkeigo-nasaru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 49 (2/2) | ～（ら）れます（尊敬） | `sonkei-rareru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (1/2) | お～します | `o-suru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (1/2) | いたします | `kenjougo-itasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (1/2) | うかがいます | `kenjougo-ukagau` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (1/2) | おります | `kenjougo-oru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (1/2) | ぞんじます | `kenjougo-zonjiru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (1/2) | はいけんします | `kenjougo-haiken-suru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (2/2) | まいります | `kenjougo-mairu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (2/2) | ～と申します | `kenjougo-mousu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (2/2) | お～いただく | `o-itadaku` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (2/2) | もうしあげる | `kenjougo-moushiageru` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
| Bab 50 (2/2) | ～でございます | `de-gozaimasu` | 4/4 | 4/4 | 4/4 | 4/4 | setoran 2026-11-25–27: lolos peninjau buta, masuk bank |
