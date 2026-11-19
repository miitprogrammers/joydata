# Idea: Kanji Adventure

Status: usulan, belum diimplementasi · 2026-11-19 · branch `kanji-adventure`

Dokumen ini merangkum pemahaman terhadap ide latihan kanji baru untuk JOYdata. Sumber utama adalah
keterangan pemilik aplikasi. Bagian yang bersumber dari kode repo disebutkan eksplisit beserta
letak filenya. Keputusan final pemilik aplikasi dicatat di bagian 7; tidak ada pertanyaan terbuka.

---

## 1. Ringkasan singkat

Latihan kanji sekarang bersifat acak: tiap sesi mengambil kanji dan jumlah soal secara acak, jadi kanji
yang dijawab salah di satu sesi belum tentu muncul lagi di sesi berikutnya. **Kanji Adventure** mengubah
ini menjadi perjalanan yang **terarah dan berurutan**: satu volume kanji dipecah menjadi pecahan kecil
(chunk) berisi 10 butir kata, peserta mengulang chunk sampai **semua kanji di dalamnya benar bacaan dan
artinya** sebelum chunk berikutnya terbuka, dan kanji yang salah di salah satu bagian dikumpulkan
menjadi "bos" yang diulang sampai benar semua di akhir volume. Volume berikutnya hanya terbuka setelah
chunk bos tersebut tuntas.

Intinya, latihan berubah dari "mengulang sampai kebetulan bertemu lagi" menjadi "tidak ada kanji yang
terlewat sampai benar-benar dikuasai". Mode lama tetap dipakai berdampingan, hasilnya tetap murni
latihan, dan semua percobaan tetap tercatat di monitoring latihan serta berkontribusi ke grade.

---

## 2. Kondisi saat ini

Berdasarkan keterangan pemilik aplikasi:

- Peserta berlatih kanji lewat **flash card** dan **latihan soal**.
- Latihan soal mengacak dua hal sekaligus: **kanji yang dipakai** dan **jumlah soal**.
- Karena pengacakan itu, **jawaban salah belum tentu muncul lagi** di sesi acak berikutnya. Status
  "belum hafal" tidak punya mekanisme untuk membawa kanji itu kembali ke hadapan peserta.

Catatan: pernyataan di atas berasal dari deskripsi pemilik aplikasi dan sesuai dengan kode yang
dicek di bagian 6. Rincian teknisnya ada di `PLAN.md`.

---

## 3. Masalah yang diselesaikan

1. **Tidak ada jaminan pengulangan.** Kanji yang belum dikuasai bisa hilang dari radar karena undian
   sesi berikutnya.
2. **Tidak ada urutan belajar.** Peserta tidak tahu kanji mana yang sudah "selesai" dan mana yang
   harus dilanjutkan.
3. **Tidak ada umpan balik terakumulasi.** Kesalahan tercatat di sesi itu saja, belum membentuk
   daftar kelemahan yang bisa ditinjau ulang secara terstruktur.

---

## 4. Aturan main yang diusulkan

### 4.1 Pemecahan volume

- Satu volume kanji dipecah menjadi beberapa **chunk**, masing-masing berisi **10 butir kata**
  (kata seperti pola latihan sekarang, bukan karakter unik); hanya chunk terakhir yang boleh kurang dari 10.
- Urutan chunk mengikuti urutan kanji di dalam volume (bukan diacak).
- Contoh: volume 80 butir → 8 chunk, chunk 1 berisi butir 1–10, chunk 2 berisi 11–20, dst. Chunk
  terakhir boleh kurang dari 10 butir.

### 4.2 Pola soal

- **Pola soal sama seperti latihan kanji biasa** yang sudah ada. Yang berubah bukan bentuk soalnya,
  melainkan **sumber kanji-nya**.
- Pada mode adventure, kanji yang menjadi soal **ditentukan dan disimpan**, bukan diambil secara acak
  tiap sesi. Artinya, untuk chunk tertentu, daftar 10 kanji dan susunannya bersifat tetap dan bisa
  dilacak.

### 4.3 Gerbang antar-chunk

- Peserta **belum boleh membuka chunk berikutnya** sebelum **semua kanji di chunk saat ini benar bacaan
  dan artinya**. Satu butir dianggap benar hanya jika kedua bagian benar.
- Boleh dikumpulkan lintas sesi, tetapi chunk **harus diulang sampai semua butir benar**. Tidak ada
  jalan pintas dan tidak ada batas jumlah pengulangan.
- Berlaku berulang: chunk 2 terkunci sampai chunk 1 tuntas, chunk 3 terkunci sampai chunk 2 tuntas,
  dan seterusnya sampai akhir volume.
- Server yang memeriksa gerbang ini, bukan client.

### 4.4 Pola "volume boss" dan gerbang volume

- Di setiap sesi, kanji yang **salah di bacaan atau salah di arti** langsung ditandai belum dikuasai dan
  dimasukkan ke daftar **boss**.
- Daftar boss dikumpulkan sepanjang volume, lalu pada **akhir volume** dibentuk menjadi **chunk boss**
  yang berisi kumpulan kanji tersebut.
- Chunk boss **harus diulang sampai semua kanji di dalamnya benar bacaan dan arti**. Item yang benar
  dikeluarkan dari boss aktif; item yang masih salah tetap muncul di ronde berikutnya.
- **Volume berikutnya baru terbuka setelah chunk boss tuntas.** Status volume dan daftar kanji yang
  masih jadi boss bisa dilihat sensei, tetapi tidak membatasi jumlah percobaan peserta.
- Jadi struktur akhir volume = chunk-chunk reguler (masing-masing 10 butir, kecuali chunk terakhir) + chunk boss yang
  isinya berasal dari kesalahan peserta sepanjang volume itu.

---

## 5. Alur yang diharapkan (ringkas)

```
Pilih volume (volume ke-2 terkunci sampai volume ke-1 selesai)
   │
   ├─ Chunk 1 (10 butir tetap) ──► ada yang salah ──► masuk daftar boss
   │        │                                      │
   │        │                                      └─► diulang lagi saat chunk diulang
   │        └─ semua benar bacaan + arti ──► Chunk 2 terbuka
   │
   ├─ Chunk 2 ... Chunk N (sama, sampai akhir volume)
   │
   └─ Chunk boss (kanji yang pernah salah) ──► diulang sampai semua benar
                                                   │
                                                   └─► volume selesai ──► volume berikutnya terbuka
```

Setiap percobaan chunk, termasuk pengulangan boss, tetap dicatat sebagai sesi latihan.

---

## 6. Yang sudah diverifikasi dari repo (bukan dari user)

Bagian ini sudah dicek baris demi baris di worktree `kanji-adventure`.

| Fakta | Letak kode |
| --- | --- |
| Rute portal peserta memuat `tes` dan `flashcard` sebagai halaman tersendiri | `src/router/index.js:118-129` |
| Soal kanji di portal berupa dua kolom per butir: **bacaan** dan **arti**, masing-masing 4 opsi, diacak. Opsi dirender inline di `KanjiRunner.vue:28-35, 46-54` | `src/components/portal/tes/KanjiRunner.vue`, `server/domain/tesOnline.js:18, 224-227, 229-263` |
| Kumpulan volume kanji sudah berupa konstanta. Kode server: `DASAR`, `VOL1`–`VOL5`, `N4VOL1`–`N4VOL5`; label UI: `N5 Dasar`, `N5 Vol 1`–`5`, `N4 Vol 1`–`5` | `server/domain/bankSoal/kanjiN5.js:5,88`, `kanjiN4.js:5` (import `tesOnline.js:7-8`), `VOLUME_KANJI` di `tesOnline.js:479`; label `src/utils/volumeKanji.js:3-11` |
| Belum ada data kanji N3; N3 hanya level dokkai (`JLPT_DOKKAI`) | `server/domain/tesOnline.js:15-16` |
| Daftar kanji per volume tersedia lewat `kanjiItems(materi)` (DASAR = 80 entri satu karakter; VOL/N4 = entri kata `[kata, bacaan, arti]`); `daftarMateriTes()` menyediakan judul, JLPT, dan jumlah item | `server/domain/tesOnline.js:41-94` |
| Data kanji hidup sebagai array JavaScript di `server/domain/bankSoal/kanjiN5.js` (`KANJI_DASAR`, `KANJI_VOLUME`) dan `kanjiN4.js` (`KANJI_VOLUME_N4`); file XLSX hanya disebut di komentar header sebagai sumber historis | `server/domain/bankSoal/kanjiN5.js:1-3`, `kanjiN4.js:1-2` |
| Latihan tes mengambil **jumlah soal acak** lewat `getLatihanTes({ jenis, materi, jumlah, jlpt, volume })` lalu `buatSoalTes` | `server/db/tesOnlineRepo.js:690-715` |
| Jawaban latihan tidak disimpan per butir; yang disimpan hanya skor + waktu pada sesi latihan | `server/db/tesOnlineRepo.js:717-734` (`jawabanBersih`, `nilaiLatihanTes`) |
| Satu butir kanji dianggap benar hanya jika **bacaan dan arti keduanya benar** | `server/domain/tesOnline.js:322-346` (`nilaiTes`, field `benar`) |
| Flashcard **sudah** menyimpan urutan acak dan waktu tampil per kartu, dan mengurutkan ulang kartu yang lama dibaca lebih dulu sebagai proxy "belum hafal" | `server/db/latihanRepo.js:329-341, 373-400`, `server/domain/flashcard.js` |
| Tabel `tes_online_sesi` (207), `flashcard_progres` (268), dan `latihan_sesi` (281) sudah ada | `supabase/migrations/001_initial_schema.sql:207, 268, 281` |
| Endpoint latihan (`371-402`) dan flashcard (`420-440`) dilindungi `requirePeserta` | `server/apiApp.js`, `server/middleware/portalAuth.js` |
| Styling = utility Tailwind (`joy-surface`, `font-display`, `tabular-nums`) + Vuetify untuk kontrol/dialog; teks UI lewat `src/locales/id.js` (`portal.menu` di 1337, `flashcard` di 1348) dan `ja.js` | `src/index.css`, `src/locales/id.js` |
| Tes dijalankan dengan `node:test` lewat `npx --yes tsx --test` pada `npm test`; sudah ada `flashcard.test.js` dan `tesOnline.test.js` | `package.json:6-17`, `server/domain/*.test.js` |
| Sesi latihan (`mode: 'latihan'`) menyimpan `skor`, `itemSelesai`, `detikAktif`; dibuat oleh `catatLatihanBaru`, ditutup oleh `tutupLatihan`, detak 15 detik oleh `detakAktivitas` | `server/db/latihanRepo.js:267, 294, 314` |
| `rataSkorLatihan` adalah field turunan dari sesi latihan bukan tes resmi (`aktivitasLatihan.js:131`), lalu `hitungGradeLatihan` mengubahnya ke grade A–E | `server/domain/aktivitasLatihan.js:131`, `server/domain/gradeLatihan.js:93`, `server/db/latihanRepo.js:437` |
| Monitoring latihan sudah punya endpoint live, statistik, dan detail per peserta dengan `requirePageAccess('monitor-latihan')`; detail diambil di UI lewat `/monitor-latihan/peserta/:id` | `server/apiApp.js:469, 477, 485`, `src/views/MonitorLatihanView.vue:557` |

Konsekuensi penting: komponen soal, daftar volume, mekanisme simpan progres, dan jalur grade **sudah
ada**, sehingga `Kanji Adventure` sebagian besar adalah **mode baru di atas fondasi yang sama**, bukan
fitur dari nol.

---

## 7. Keputusan final pemilik aplikasi

Ketujuh keputusan sudah ditetapkan pemilik aplikasi pada 2026-11-19 dan mengikat rencana di `PLAN.md`:

| # | Keputusan | Penerjemahan ke desain |
| --- | --- | --- |
| 1 | Semua kanji harus benar bacaan dan arti; ini syarat chunk berikutnya bisa diakses | Satu butir hanya lulus jika `bacaanOk && artiOk`. Chunk berikutnya terbuka hanya jika semua butir di chunk sebelumnya sudah benar penuh. |
| 2 | Per kata seperti pola latihan sekarang | Satuan chunk = 10 butir mengikuti bentuk item sumber: `DASAR` satu karakter, `VOL1`–`VOL5`/`N4VOL1`–`N4VOL5` satu kata. Bukan 10 karakter unik. `KanjiRunner` dipakai apa adanya. |
| 3 | Salah di salah satu | Salah di bacaan **atau** arti membuat butir itu belum dikuasai dan masuk boss. |
| 4 | HARUS diulang sampai benar semua; ini syarat membuka volume berikutnya | Chunk reguler dan chunk boss diulang tanpa batas sampai semua butir benar. Tidak ada penghentian karena "sudah 2 ronde". Baru setelah boss tuntas, volume berikutnya terbuka. |
| 5 | Berdampingan | Mode acak lama dan flashcard tidak diubah; adventure menjadi menu tambahan. |
| 6 | Sensei bisa melihat progres per peserta | Endpoint monitoring adventure per peserta wajib, dengan akses halaman `monitor-latihan`, plus tampilan rincian di halaman monitoring yang sudah ada. |
| 7 | Murni latihan; masuk variabel yang dimonitor di "monitoring latihan"; masukan ke variabel grade | Adventure tidak masuk `nilai_ujian`/rapor, tetapi setiap percobaan wajib menjadi `latihan_sesi` bermode `latihan` agar `detikAktif`, `skor`, `rataSkorLatihan`, dan `grade` ikut terisi. |

Tidak ada keputusan terbuka yang menghalangi implementasi. Rincian teknis, endpoint, dan urutan kerja
ada di `PLAN.md`.

---

## 8. Batasan dokumen ini

`IDEA.md` berisi pemahaman, keputusan final, dan fakta repo; rincian teknis, perubahan skema, endpoint,
komponen, dan urutan pengerjaan ada di [PLAN.md](PLAN.md).
