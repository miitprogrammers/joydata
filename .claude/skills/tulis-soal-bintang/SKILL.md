---
name: tulis-soal-bintang
description: Menulis soal bintang (並べ替え, susun kalimat dengan kotak ★) baru untuk bank Bunpou Adventure JOYdata (server/domain/bankSoal/bintangN5.js dan bintangN4.js) lewat alur bergerbang mutu — agen penulis (Sonnet), gate mekanis periksa-bintang.mjs, peninjau buta (Opus) yang menjawab tanpa kunci, cek teks, lalu inject-bintang.mjs hanya bila semuanya lolos; juga mengganti soal bank yang sudah ada (--ganti). Pakai skill ini setiap kali user meminta "tulis soal bintang", "isi bank Bunpou Adventure", "tambah soal Bunpou Adventure", "soal susun kalimat", "lengkapi volume N5/N4", "perbaiki soal bintang", atau menyebut pola/volume Bunpou Adventure yang soalnya belum ada. Soal bintang TIDAK BOLEH ditambahkan ke bank dengan cara lain.
---

# Tulis soal bintang

Soal bintang dipakai peserta sungguhan; begitu sebuah volume punya 4 soal di setiap polanya, volume itu terbuka untuk
semua peserta. Bank pernah diisi 678 soal tanpa tinjauan (kata terputus di tengah, kunci bukan kalimat nyata, tanpa
terjemahan) dan harus dibuang. Karena itu tiga peran dipisah dan tidak ada soal masuk bank sebelum semua gerbang lolos.
Spesifikasi: `docs/bunpou-adventure/spek-kode.md` §2 dan §8. Pelacak: `docs/bunpou-adventure/progres-soal.md`.

**Jangan** melonggarkan `server/domain/soalBintang.js` atau `aturanDokkai.js`, mengubah tes agar soal lolos, atau mengedit
`bintangN5.js`/`bintangN4.js` dengan tangan. Soal ditolak = tulis ulang soalnya.

## Alur

Semua skrip ada di `.claude/skills/tulis-soal-bintang/scripts/` dan dijalankan dari akar repo dengan `node`.
`--tingkat` = `N5` atau `N4`. Folder kerja batch (draf, kertas buta, jawaban) taruh di scratchpad, bukan di repo.

1. **Siapkan.** Pilih pola (daftar `polaVolume(kode)` di `server/domain/bunpouAdventure.js`; urut bab). Ambil entri katalog
   (`server/domain/materiBunpou/katalog.js`) dan kosakata Minna sampai bab pola itu (`docs/kb-dokkai/data/minna-kosakata.json`).
2. **Penulis (Sonnet).** Satu agen per kelompok ±20 pola. Brief: `references/gaya-soal.md` + pola + entri katalog + kosakata.
   Menulis `MIN_VARIAN` (4) varian per pola ke `draf.json` (larik soal bentuk spek §2.1, `status: 'draf'`). Antarvarian
   berbeda konteks dan posisi ★. Penulis memeriksa sendiri dengan langkah 3 dan memperbaiki sampai bersih.
3. **Gate mekanis:**
   `node .claude/skills/tulis-soal-bintang/scripts/periksa-bintang.mjs draf.json --tingkat N5 --varian 4`
   Memanggil `validasiSoalBintang` dan `validasiBankBintang` (sumber yang sama dengan `npm test`). Keluar 0 = lolos.
4. **Peninjau buta (Opus), tanpa kunci:**
   - `node .../buat-buta.mjs draf.json --tingkat N5 --keluar <peninjau> [--rahasia <rahasia>]` menulis `buta.json` (kerangka +
     4 potongan bernomor acak, tanpa kunci) ke `<peninjau>`, dan `peta-rahasia.json` (kunci + sidik isi tiap soal) ke
     `<rahasia>` (bawaan: folder `rahasia/` di samping `<peninjau>`). `<rahasia>` TIDAK BOLEH sama dengan atau di dalam
     `<peninjau>` (skrip menolak). Simpan `draf.json` dan `<rahasia>` di luar pohon scratchpad yang dituju peninjau.
   - **Tempel ISI `buta.json` ke prompt peninjau**, jangan beri folder atau jalur berkas. Peninjau hanya boleh membuka
     `references/gaya-soal.md`; ia dilarang membuka berkas lain (terutama `draf.json`, peta, folder rahasia, atau bank).
     Gunakan **agen peninjau baru untuk setiap putaran** (termasuk tinjauan ulang `--subset`, dengan folder baru), supaya ia
     tidak mengingat kunci dari putaran lalu.
   - **Standar yang harus tertulis di prompt peninjau:** standar soal JLPT N5. ★ yang bisa ditempatkan dari bentuk pola
     saja BOLEH; tulis di `catatan` (tidak menggagalkan). Peninjau WAJIB memakai larik `gagal` untuk lima jenis kegagalan,
     dan hanya itu yang menggagalkan soal: `ganda` (lebih dari satu urutan wajar memberi ★ berbeda), `bocor` (★ dibocorkan
     baris dialog lain), `tanda-baca` (★ ditentukan hanya oleh tanda baca), `tidak-wajar` (kalimat tidak wajar atau tidak
     logis), `di-atas-bab` (kosakata/tata bahasa di atas bab). Kosongkan `gagal: []` bila tidak ada.
   - Untuk tiap soal peninjau menulis (a) nomor ★ (1-4) dan urutan lengkap (permutasi 1-4), (b) setiap urutan lain yang juga
     gramatikal, (c) `kewajaran` dan `tingkat` (`ok` atau catatan; wajib), (d) `gagal` (wajib, boleh kosong), (e) `catatan`.
     Jawaban disimpan ke `jawaban.json`: `[{ kode, bintang, urutan, urutanLain, kewajaran, tingkat, gagal, catatan }]`.
     **Peninjau tidak pernah melihat kunci sebelum menyimpan jawabannya.**
   - `node .../bandingkan.mjs draf.json jawaban.json --keluar <peninjau> [--rahasia <rahasia>]` menulis
     `<rahasia>/hasil-banding.json` (LOLOS / CATATAN / GAGAL per id, dengan sidik isi yang ditinjau). GAGAL = ★ peninjau
     berbeda dari kunci, urutan sah memberi ★ lain, `gagal` tidak kosong, atau jawaban tidak lengkap. Soal GAGAL **ditulis
     ulang** (bukan ditambal) dan diulang dari langkah 3. CATATAN juga muncul bila `kewajaran`/`tingkat` bukan `ok`, atau
     urutan kunci tidak ditemukan peninjau. `urutanLainBaru` = urutan sah yang terlewat penulis: tambahkan ke `urutanLain`
     (tidak mengubah sidik isi).
5. **Cek teks.** Untuk CATATAN dan sampel LOLOS: terjemahan lengkap dan benar, `pembahasan` tepat, aturan R1–R10
   (`references/gaya-soal.md`) terpenuhi. Perbaikan teks (terjemahan, pembahasan, urutanLain) tidak mengubah sidik isi; perubahan
   situasi/baris/potongan/★ membuat soal ditolak inject sampai ditinjau ulang.
6. **Buku tinjauan.** Setelah SETIAP putaran selesai (juga yang gagal), salin keempat berkasnya ke
   `docs/bunpou-adventure/tinjauan/<putaran>/`: `buta.json`, `jawaban.json`, `peta-rahasia.json`, `hasil-banding.json`.
   Peta rahasia baru boleh masuk repo sesudah putaran berakhir (kebutaan hanya perlu selama peninjauan). Commit buku itu
   bersama perubahan bank. Buku dapat diverifikasi: inject dan tes menghitung ulang status tiap baris dari ketiga berkas
   lain dengan fungsi penilai yang sama dengan `bandingkan.mjs` (`_penilaian.mjs`).
7. **Inject:** `node .../inject-bintang.mjs draf.json --tingkat N5 [--terima id1,id2 --alasan "<teks>"]`
   Skrip membaca SENDIRI semua folder putaran di buku tinjauan (tidak ada argumen berkas, jadi putaran gagal tidak bisa
   dilewatkan), menghitung ulang tiap putaran, dan menolak SEMUA bila ada yang tak cocok, kurang berkas, atau field hilang.
   Soal ditolak bila: tidak ada penilaian dengan sidik isi dan id yang sama (belum ditinjau atau diedit sesudahnya); ADA baris
   GAGAL dengan sidik isi yang sama (id apa pun); atau baris terakhir bukan LOLOS (CATATAN hanya untuk id di `--terima`,
   setelah cek teks, dan `--alasan` wajib; keputusan dicatat ke `tinjauan/terima.json` bersama sidik dan tanggal). Soal baru
   harus `draf` dan hanya berkunci bentuk soal. Seluruh batch ditolak bila satu soal gagal. Bank ditulis berurutan katalog
   lalu id lewat berkas sementara yang diimpor ulang dan dibandingkan sebelum menimpa bank. `--ganti` mengganti soal berid
   sama: status `ditinjau` dipertahankan bila sidik isi tidak berubah, kembali `draf` bila isi berubah. `--uji` hanya
   memeriksa. Lalu `npm test` dan `npm run build`. (`--bank` dan `--buku` khusus tes: di bawah `os.tmpdir()`, dan `--buku`
   hanya boleh bersama `--bank`; dengan bank asli buku repo selalu dipakai.)
   `npm test` juga memeriksa bahwa setiap soal di bank punya bukti untuk isinya sekarang: tanpa baris GAGAL, baris terakhir
   LOLOS atau CATATAN yang tercatat di `terima.json`, atau soal ada di `tinjauan/pilot-pra-buku.json` (daftar tetap soal
   pilot putaran 1-3, sebelum buku ada; panjangnya dipatok di tes, jadi menambah isinya terlihat sebagai perubahan tes).
8. **Persetujuan sensei (jarang):** `node .../setujui-bintang.mjs --id a,b,c --oleh "<nama sensei>"` mengubah `draf` ke
   `ditinjau` dan mencatat penyetuju + tanggal di `docs/bunpou-adventure/tinjauan/persetujuan.json`. Semua id divalidasi dulu
   dan tiap soal harus punya bukti tinjauan (LOLOS, CATATAN di `terima.json`, atau pilot-pra-buku); penulisan atomik (semua
   bank dan `persetujuan.json`, atau tidak sama sekali). Jalankan HANYA bila user berkata bahwa sensei telah menyetujui
   soal-soal itu.
9. **Catat** di `docs/bunpou-adventure/progres-soal.md` (baris per pola dan "Riwayat batch").

Tes skrip: `scripts/skrip.test.js` (ikut `npm test`, memakai salinan bank dan buku sementara; bank asli tidak boleh berubah).
Mengubah skrip, aturan validator, atau konstanta rilis (`MIN_VARIAN`, `BENAR_DIKUASAI`, `statusRilis`, `VOLUME_BUNPOU`,
`tahapVolume`) perlu persetujuan user lebih dulu (AGENTS.md).

Model: penulis Sonnet, peninjau Opus. Jangan push ke `main` tanpa persetujuan user (push `main` men-deploy produksi).
Status soal baru selalu `draf`; `ditinjau` hanya setelah sensei menyetujui.
