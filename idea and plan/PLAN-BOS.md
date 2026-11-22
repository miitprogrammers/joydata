# Rencana Perbaikan: Bos Kanji Adventure

Status: rencana final, belum ada kode (user: "jangan dulu code") · pilihan §8 disetujui user 2026-11-21 · branch `kanji-adventure-bos` (worktree `.worktree/kanji-adventure-bos`, dari
`main` 9471516) · dokumen induk: [IDEA.md](IDEA.md) §4.4, [PLAN.md](PLAN.md) §5

---

## 1. Masalah

IDEA §4.4: *"kanji yang salah di salah satu bagian dikumpulkan menjadi bos yang diulang sampai benar semua di akhir
volume. Volume berikutnya baru terbuka setelah chunk bos tuntas."*

Kenyataannya, **ronde bos tidak pernah terisi dalam permainan normal**:

| Langkah | Kode | Akibat |
|---|---|---|
| Butir yang salah masuk `bosses` | `server/domain/kanjiAdventure.js:117-123` | benar |
| Butir yang sudah dikuasai dihapus dari `bosses`, **di mana pun dijawab** | `kanjiAdventure.js:125` | kesalahan langsung hilang begitu butir itu benar di ulangan chunk |
| Chunk baru terbuka hanya bila semua butirnya dikuasai | `kanjiAdventure.js:115, 127-129` | saat chunk terakhir lulus, **semua** butir volume sudah dikuasai |
| `selesai = semuaRegulerTuntas && bosses.length === 0` | `kanjiAdventure.js:132` | daftar bos selalu kosong → volume langsung selesai, ronde bos dilewati |

Bukti: simulasi volume DASAR (3 butir salah di setiap chunk, lalu chunk diulang sampai benar) menghasilkan
`{ chunk_terbuka: 8, chunks: 8, bosses: 0, selesai: true }`, yaitu 24 kesalahan tanpa satu pun ronde bos.

Tes yang ada justru mengunci perilaku ini: `kanjiAdventure.test.js:131` *"mastered items leave the boss list and the chunk
advances"* mengharapkan `bosses` kosong setelah ulangan chunk. Tes bos lain (`:153`, `:271`) memakai state buatan, sehingga
tidak pernah melewati alur yang sebenarnya.

---

## 2. Perilaku yang benar

1. **Chunk reguler:** butir yang salah (bacaan **atau** arti) masuk bos atau ditambah hitungan `salah`-nya. Jawaban benar di
   chunk reguler **tidak** mengeluarkan butir dari bos. Syarat lulus chunk tidak berubah: semua butir pernah benar penuh.
2. **Ronde bos** terbuka setelah semua chunk reguler lulus dan bos tidak kosong. Butir yang benar penuh keluar dari bos,
   butir yang salah tetap ada (`salah + 1`).
3. **Satu ronde bos berisi paling banyak 10 butir** (`UKURAN_CHUNK`), urut dari `salah` terbanyak. Sesudah perbaikan, bos
   bisa berisi puluhan butir (volume 80–84 butir, kesalahan awal 30–50% itu wajar), dan satu sesi 40 soal terlalu panjang
   untuk ponsel. Ronde diulang sampai bos kosong.
4. **Volume selesai** bila semua chunk lulus dan bos kosong. Bila volume bersih tanpa kesalahan sama sekali, ronde bos
   dilewati.
5. **`selesai` bersifat tetap.** Volume yang sudah selesai tidak pernah kembali belum selesai. Mengulang chunk di volume yang
   sudah selesai tetap boleh sebagai latihan, tetapi kesalahannya tidak menambah bos. Tanpa aturan ini, mengulang volume lama
   lalu salah satu butir akan **mengunci kembali** volume-volume sesudahnya lewat `volumeTersedia`. Di kode sekarang hal ini
   tidak terjadi hanya karena bos selalu kosong.
6. `perlu_perhatian` dan `boss_ronde` tidak berubah. Keduanya tetap penanda untuk sensei, bukan batas.

---

## 3. Data yang sudah ada

| Keadaan | Penanganan |
|---|---|
| Volume `selesai: true` | Tetap selesai (aturan 5). Tidak ada volume yang dibuka ulang dan tidak ada peserta yang tiba-tiba terkunci. |
| Volume sedang berjalan | `bosses` yang tersimpan (butir yang sampai kini belum dikuasai) tetap dipakai, lalu kesalahan baru ditambahkan. |
| Kesalahan lama yang sudah terhapus | **Tidak bisa dipulihkan.** `kanji_adventure_sesi` hanya menyimpan kertas yang sedang dikerjakan (baris dihapus setelah dinilai, `003_kanji_adventure_sesi.sql`), dan `riwayat` hanya berisi ringkasan `{ chunkIndex, benar, total }` tanpa id butir. Bos untuk volume yang sedang berjalan hanya memuat kesalahan sejak perbaikan ini dideploy. |

**Tidak perlu migration:** kolom `bosses`, `boss_ronde`, dan `selesai` sudah ada, dan bentuk datanya tetap.

---

## 4. Perubahan kode

### 4.1 Domain: `server/domain/kanjiAdventure.js`

`evaluasiProgres`:

```js
const sudahSelesai = Boolean(progres.selesai);
const modeBoss = chunkIndex < 0;
let bosses = daftarBossAdventure(progres);
if (!sudahSelesai) {
  for (const id of hasil.itemSalah) { /* upsert salah + 1, terakhirSalah = sekarang (seperti sekarang) */ }
}
if (modeBoss) {
  // Hanya ronde bos yang mengeluarkan butir: yang dijawab benar penuh di sesi ini.
  const benarSesiIni = new Set(hasil.detail.filter((d) => d.benar).map((d) => d.itemId));
  bosses = bosses.filter((b) => !benarSesiIni.has(b.id));
}
// baris 125 (filter by dikuasai) DIHAPUS
const selesai = sudahSelesai || (semuaRegulerTuntas && bosses.length === 0);
const chunkTuntas = modeBoss ? bosses.length === 0 : chunkLulus;
```

`rencanaSesiAdventure` (mode bos): ambil `daftarBossAdventure(progres).slice(0, UKURAN_CHUNK)` (sudah diurutkan dari
`salah` terbanyak, lalu id). Pemeriksaan id usang (`CHUNK_TERKUNCI`) tetap.

### 4.2 API: `server/apiApp.js`

- `petaChunkAdventure` (`:273`): logika status bos sudah benar untuk aturan baru (`tersedia` bila reguler tuntas dan bos
  tidak kosong, `selesai` bila `progres.selesai`). Tambahkan `rondeBerikut: Math.min(jumlah, 10)` supaya UI bisa menulis
  "10 dari 23 kanji di ronde ini".
- `nilai` (`:666`): `sisa` di mode bos = seluruh bos tersisa (sudah begitu). `bossesBaru` tetap dihitung terhadap bos sebelum
  sesi. Tidak ada perubahan lain.

### 4.3 Tampilan dan teks

| Kunci | Sekarang | Menjadi |
|---|---|---|
| `portal.kanjiAdventure.bossInfo` | Kanji yang masih salah akan muncul lagi di sini… | Kanji yang pernah salah di volume ini dikumpulkan di sini dan diuji lagi setelah semua langkah selesai. Satu ronde berisi paling banyak 10 kanji; ulangi sampai semua benar. |
| `bossKosong` | Belum ada boss. Selesaikan semua langkah reguler dulu. | Belum ada kanji yang salah di volume ini. |
| `bossDaftar` | Kanji yang masih perlu diulang | Kanji yang akan diuji lagi di langkah boss |
| *(baru)* `bossRonde` | — | Ronde ini: {a} dari {n} kanji |

`ja.js` diperbarui bersamaan. Di `PortalKanjiAdventureView.vue`, hasil ronde bos yang benar semua tetapi bosnya belum habis
harus menampilkan "Ronde berikutnya" (tombol yang sama dengan `mulaiBoss`), bukan "Ulangi". Tidak ada komponen baru.

Monitor Latihan (`MonitorLatihanView.vue:282`) tidak perlu diubah. Label "Boss n" sekarang berarti kanji yang pernah salah
dan belum lolos bos, yang memang yang ingin dilihat sensei.

### 4.4 File yang tidak diubah

`kanjiAdventureRepo.js` (bentuk data sama), migration, `tesOnline.js`, flashcard, Grade Latihan.

---

## 5. Tes

| File | Tes |
|---|---|
| `server/domain/kanjiAdventure.test.js` | **Ganti** `:131` menjadi "butir yang benar di ulangan chunk tetap di bos sampai ronde bos". |
| | **Baru:** simulasi satu volume penuh dengan kesalahan → setelah chunk terakhir `selesai: false`, bos berisi semua butir yang pernah salah, `volumeTersedia(volume berikutnya) === false`; ronde bos benar semua (per 10) → `selesai: true`. Ini tes regresi untuk masalah §1. |
| | **Baru:** volume tanpa kesalahan → selesai tanpa ronde bos. |
| | **Baru:** ronde bos berisi ≤ 10 butir, urut `salah` terbanyak; butir di luar ronde tetap di bos. |
| | **Baru:** `selesai` tetap: mengulang chunk di volume selesai dengan jawaban salah → `selesai: true`, `bosses` tidak berubah, volume berikutnya tetap terbuka. |
| | Tes bos yang ada (`:153`, `:226`, `:234`, `:252`, `:264`, `:271`) tetap lolos tanpa diubah, kecuali yang mengandalkan penghapusan oleh `dikuasai`. |
| `server/apiApp.kanjiAdventure.test.js` | **Baru:** alur lewat API: chunk dengan salah lalu ulangi sampai lulus → `/volume/:materi` bos `tersedia`, `/mulai` mode bos mengembalikan ≤ 10 soal, volume berikutnya 403 sampai bos kosong. |
| `src/views/portal/kanjiAdventureUI.test.js` | Sesuaikan bila ada teks bos yang diperiksa. |

Lalu `npm test` lengkap dan `npm run build`.

---

## 6. Langkah kerja

| No | Langkah | Selesai bila |
|---|---|---|
| 1 | Tes regresi §5 ditulis dulu dan **gagal** pada kode sekarang | membuktikan tes menangkap masalahnya |
| 2 | Ubah domain (§4.1) | tes domain hijau |
| 3 | API + teks + tombol "Ronde berikutnya" (§4.2–4.3) | tes API dan UI hijau |
| 4 | Cek visual Playwright di 390 px: peta dengan bos terisi, hasil ronde bos yang masih bersisa | tangkapan layar dicek |
| 5 | `npm test`, `npm run build`, commit, merge ke `main`, deploy | sesuai urutan deploy Kanji Adventure (PROGRES Phase 6) |
| 6 | Verifikasi produksi: satu akun uji menamatkan volume dengan kesalahan dan bertemu ronde bos | ronde bos muncul |

Perkiraan: kecil. Inti perubahannya sekitar 15 baris di domain, sisanya tes dan teks.

---

## 7. Dampak yang perlu diketahui sensei

- Peserta yang sedang berada di tengah volume akan bertemu ronde bos di akhir volume itu, yang sebelumnya tidak pernah
  terjadi. Volume berikutnya baru terbuka setelah bos tuntas.
- Volume yang sudah selesai tidak berubah.
- Label "Boss n" di Monitor Latihan akan lebih sering terisi, karena sekarang memang menghitung kesalahan.

## 8. Pilihan dalam rencana ini

Disetujui user 2026-11-21 ("semua sesuai usulan").

| Pilihan | Dipakai | Alternatif |
|---|---|---|
| Ukuran ronde bos | maks. 10 butir per ronde | semua bos sekaligus (seperti sekarang) |
| Volume selesai | tetap selesai, mengulangnya tidak menambah bos | mengulang menambah bos tanpa mengunci (lebih rumit) |
| Kesalahan lama | tidak dipulihkan (datanya memang tidak tersimpan) | — |
