# Catatan Progres Implementasi: Kanji Adventure

Branch: `kanji-adventure` · Worktree: `.worktree/kanji-adventure` · Mulai: 2026-11-19
Rencana: `idea and plan/PLAN.md` · Keputusan: `idea and plan/IDEA.md` bagian 7

Aturan: setiap langkah dicatat di sini (status, bukti, kendala), lalu ringkasan
kompak disimpan ke memory sesi supaya bisa dilanjutkan kapan saja.

## Log langkah

### p0 - Phase 0: verifikasi keputusan final - SELESAI
- Bukti: `IDEA.md` bagian 7 berisi 7 keputusan final, tidak ada opsi terbuka.
- Branch `kanji-adventure` ada, worktree bersih ("idea and plan/" masih untracked).
- File implementasi belum ada (domain, repo, migration belum dibuat).
- Memory: rencana dan lokasi worktree dicatat di memory sesi.

### p1a - Phase 1a: baca `server/domain/tesOnline.js` - SELESAI
- Bukti: `kanjiItems`, `VOLUME_KANJI`, `buatSoalKanji`, `nilaiTes` terbaca; bentuk soal kanji dipetakan.
- Perubahan: helper `susunSoalKanjiDariItems(items, dipilih, rng)` diekstrak dari `buatSoalKanji` dan diekspor agar snapshot chunk bisa dirender ulang tanpa reshuffle. Jalur acak lama tetap dipertahankan.

### p1b - Phase 1b: domain `server/domain/kanjiAdventure.js` - SELESAI
- Isi: `itemVolume`, `pecahChunk`, `susunSoalChunk`, `nilaiChunk`, `evaluasiProgres`, `volumeTersedia`, konstanta `UKURAN_CHUNK=10`, `MAKS_RIWAYAT=20`, `AMBANG_PERHATIAN=3`, `URUTAN_VOLUME`.
- Keputusan: boss hanya berisi item belum dikuasai; `perlu_perhatian` murni penanda, tidak menggantikan kewajiban ulang; `evaluasiProgres` murni tanpa mutasi.

### p1c - Phase 1c: `server/domain/kanjiAdventure.test.js` - SELESAI
- 10 test node:test: urutan volume, chunk 10 item, determinisme soal, penilaian setengah poin, boss entry, mastered item keluar boss, boss butuh ronde sempurna, batas riwayat, unlock volume, integrasi id katalog.

### p1d - Phase 1d: test domain hijau - SELESAI
- Bukti: `node --test server/domain/kanjiAdventure.test.js` → 10/10 pass.
- Regresi: `npm test` → 107/107 pass (97 lama + 10 baru) setelah test baru didaftarkan di `package.json`.
- Kendala: `bun` tidak ada di PATH, jadi test dijalankan lewat `node --test` dan `npm test` (tsx).

### p2a - Phase 2a: baca pola penyimpanan - SELESAI
- Bukti: `peserta_id` bertipe INTEGER di `001_initial_schema.sql` (`flashcard_progres`, baris 269); `hasValidPostgresUrl` di `engine.js:19` memakai `DATABASE_URL`; `isDemoSeedEnabled` di `seedData.js:6`. Pola `tanpaGagal` dan state sesi `getLatihanTes` terbaca.
- Kendala: marker `[SKILL_PRUNED]` pada `memory-never-forget` ternyata artifact historis; skill berhasil dimuat ulang penuh.

### p2b - Phase 2b: migration + state lokal - SELESAI
- File baru: `supabase/migrations/002_kanji_adventure.sql` berisi tabel `kanji_adventure_progres` (PK `(peserta_id, materi)`, kolom JSONB `item_ids`/`dikuasai`/`bosses`/`riwayat`, index peserta).
- `server/db/engine.js`: `createInitialLocalState` menambah `kanjiAdventureProgres: []`; `ensurePhase2Collections` menambah collection bila belum ada.

### p2c - Phase 2c: repo - SELESAI
- File baru: `server/db/kanjiAdventureRepo.js` dengan 5 fungsi: `bacaProgresAdventure`, `daftarProgresAdventure`, `simpanProgresAdventure`, `pastikanProgresAdventure`, `tambahSesiAdventure`.
- Dual mode Postgres/lokal lewat `getMode()`; `progresView` menyamakan bentuk respons; `pastikanProgresAdventure` mengunci `itemIds` (idempoten); `riwayat` dipotong `MAKS_RIWAYAT`.

### p2d - Phase 2d: test repo - SELESAI
- File baru: `server/db/kanjiAdventureRepo.test.js`, 5 test, mode lokal via `delete DATABASE_URL` + `process.chdir` ke folder scratch.
- Kendala: import awal salah (`../server/db/...` dari dalam `server/db`) → ERR_MODULE_NOT_FOUND; diperbaiki menjadi `./kanjiAdventureRepo.js`.

### p2e - Phase 2e: verifikasi penuh - SELESAI
- Bukti: `npm test` → 112/112 pass (107 lama + 5 baru); `npm run lint` (`tsc --noEmit`) bersih; `npm run build` sukses.
- `bun` tetap tidak dipakai; tidak ada perubahan di luar worktree.

### p3a - Phase 3a: baca pola rute dan sesi latihan - SELESAI
- Bukti: rute `router.get('/portal/tes/latihan', requirePeserta(), ...)` dan `router.post('/portal/aktivitas/:id/detak', requirePeserta(), ...)` di `apiApp.js`; identitas peserta diambil dari `req.peserta.id`, error lewat `handleRouteError`.
- `getLatihanTes` (`server/db/tesOnlineRepo.js:690`) menyusun soal lalu memanggil `catatLatihanBaru` yang mengembalikan `aktivitasId`; `nilaiLatihanTes` (`tesOnlineRepo.js:730`) menutup sesi lewat `tutupLatihan`.
- `detakAktivitas` (`server/db/latihanRepo.js:314`) hanya menerima sesi milik peserta yang belum selesai; `tutupLatihan` (`latihanRepo.js:294`) menyimpan skor, jumlah item selesai, dan detik aktif.
- Kendala: tidak ada. `bun` tetap tidak dipakai, verifikasi pakai `npm test`.

### p3b - Phase 3b: rute volume kanji adventure - SELESAI
- File: `server/apiApp.js`, dua rute `requirePeserta`:
  - `GET /portal/kanji-adventure/volume` → daftar `URUTAN_VOLUME` dengan `judul`, `jlpt`, `jumlah`,
    `chunkCount`, ringkasan `progres`, dan `terkunci` dari `volumeTersedia`.
  - `GET /portal/kanji-adventure/volume/:materi` → `chunks` + `boss`, tanpa soal/jawaban.
- Helper lokal: `infoVolumeAdventure`, `ringkasanProgresAdventure`, `petaChunkAdventure`;
  materi tidak dikenal dilempar `NOT_FOUND` → 404 lewat `handleRouteError`.
- Bukti: `npm test` 112/112 pass; `npm run lint` (`tsc --noEmit`) bersih; `npm run build` sukses.
- Kendala: tidak ada. `bun` tetap tidak dipakai.

### p3c - Phase 3c: `POST /mulai` + `POST /detak` dengan state sesi - SELESAI
- File: `server/domain/kanjiAdventure.js` (helper `rencanaSesiAdventure`) dan `server/apiApp.js`.
- `POST /portal/kanji-adventure/mulai`: cek unlock volume, `pastikanProgresAdventure`, rakit rencana chunk/boss,
  `tambahSesiAdventure`, simpan `sesiId` ke `sesiAdventureAktif` (Map in-memory, kedaluwarsa 30 menit),
  kembalikan soal lengkap dengan kunci jawaban hanya ke peserta pemilik sesi.
- `POST /portal/kanji-adventure/detak`: hanya menerima `sesiId` yang cocok dengan `req.peserta.id`,
  meneruskan ke `detakAktivitas` dengan `aktivitasId` dari state; sesi dihapus saat `selesai: true`.
- Error: `INVALID_ADVENTURE_MATERI`/`CHUNK_TIDAK_VALID` → 400, `VOLUME_TERKUNCI`/`CHUNK_TERKUNCI`/
  `AKSES_SESI_DITOLAK` → 403, `SESI_TIDAK_ADA`/`NOT_FOUND` → 404.
- Test baru: 3 test di `server/domain/kanjiAdventure.test.js` untuk chunk terbuka, chunk terkunci/index buruk,
  dan boss yang menaikkan ronde. Bukti: `npm test` 115/115 pass (112 lama + 3 baru), `npm run lint` bersih,
  `npm run build` sukses. `bun` tetap tidak dipakai.
- Kendala: tidak ada.

### p3d - Phase 3d: `POST /nilai` + integrasi latihan_sesi/grade - SELESAI
- File: `server/apiApp.js`. Rute `POST /portal/kanji-adventure/nilai` mengambil sesi dari `sesiAdventureAktif`
  (cocok dengan `req.peserta.id`, batas 30 menit), menilai jawaban lewat `nilaiChunk`, lalu
  `evaluasiProgres` menyimpan progres/chunk/boss/riwayat lewat `simpanProgresAdventure`.
- Sesi latihan ditutup lewat `detakAktivitas` + `tutupLatihan` dengan `skor`, `itemSelesai`, `detikAktif`;
  state sesi dihapus. Respons memuat benar/total/lulus/skor, `bossesBaru`, `nextChunk`, `selesai`,
  `grade` dari `getRiwayatLatihanPeserta`, ringkasan progres, dan boss.
- Error: `SESI_TIDAK_ADA`/`NOT_FOUND` → 404, `AKSES_SESI_DITOLAK` → 403.
- Bukti: alur lengkap lolos smoke test DB sementara dan test otomatis p3f; `npm test` 119/119 pass.
- Kendala: tidak ada.

### p3e - Phase 3e: `GET /riwayat` + endpoint sensei - SELESAI
- File: `server/apiApp.js`. `GET /portal/kanji-adventure/riwayat` menggabungkan
  `daftarProgresAdventure` dengan `getRiwayatLatihanPeserta` sebagai sumber tunggal grade,
  tanpa menyentuh nilai rapor.
- `GET /monitor-latihan/kanji-adventure/peserta/:id` (staff) memakai `requireStaff`,
  mengembalikan `peserta` (field `pesertaId`, `nama`, `fotoUrl`, `namaKelas`) dan `volume`
  berisi `materi`, `chunk_terbuka`, `dikuasai`, `bosses`, `grade`, status kunci.
- Bukti: token peserta ditolak 403, token staff lolos 200; test otomatis p3f memeriksa 11 volume,
  volume pertama `DASAR`, `chunk_terbuka` 1, status kunci dan grade.
- Kendala: asumsi awal test memakai `peserta.id`, padahal repo mengembalikan `pesertaId`;
  test disesuaikan dengan bentuk respons aktual.

### p3f - Phase 3f: test rute 403/token/grade + regresi penuh - SELESAI
- File baru: `server/apiApp.kanjiAdventure.test.js`, 4 test `node:test` dengan DB lokal sementara
  (`delete DATABASE_URL`, `mkdtempSync`, `process.chdir`) dan HTTP server nyata lewat `fetch`.
- Cakupan: rute peserta/sensei menolak token salah, peserta belum ganti sandi default ditolak,
  alur `mulai` → `detak` → `nilai` → token habis/404 → `riwayat` → grade, dan sensei melihat progres.
- Didaftarkan di `package.json`; `node --test server/apiApp.kanjiAdventure.test.js` → 4/4 pass.
- Verifikasi penuh: `npm test` 119/119 pass (115 lama + 4 baru), `npm run lint` (`tsc --noEmit`) bersih,
  `npm run build` sukses. `bun` tetap tidak dipakai.
- Kendala: `rmSync` folder temp gagal karena proses masih `chdir` ke folder itu; diperbaiki dengan
  menyimpan `earlierCwd` dan `process.chdir(earlierCwd)` sebelum hapus di `after()`.

## Status saat ini
- Todo aktif: lihat tool todo_list. Phase 3 tuntas (p3a sampai p3f).
- Berikutnya: cek `idea and plan/PLAN.md` untuk Phase 4.
