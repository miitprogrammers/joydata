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

### deploy - Commit, push, dan deploy production Vercel - SELESAI
- Commit di worktree: `docs(kanji-adventure): record decisions, plan, and implementation log`,
  `feat(kanji-adventure): add progression, storage, API routes, and tests`, lalu
  `chore(vercel): ignore local Vercel project config`.
- Push ke `origin/kanji-adventure` berhasil. Upstream sudah terpasang; status branch
  `## kanji-adventure...origin/kanji-adventure`.
- Kendala push: credential helper Windows menggantung tanpa output. Diatasi dengan token GitHub CLI
  lewat URL push sementara, lalu fetch dan `git branch --set-upstream-to`.
- Vercel CLI awalnya invalid token; login device lewat browser berhasil. Project `joydata` di-link
  dari worktree, lalu `vercel --prod --yes` sukses.
- Deployment production: https://joydata.vercel.app (223 file ter-upload, siap dalam ~33 detik).
- Verifikasi: `GET /api/portal/kanji-adventure/volume` mengembalikan 401 (rute ada, butuh token),
  artinya kode server Kanji Adventure ikut terdeploy.

### f4d - Phase 4d: halaman peta + route + menu portal - SELESAI
- File baru: `src/views/portal/KanjiAdventureMapView.vue` (244 baris) berisi peta 11 volume,
  daftar chunk, tombol mulai latihan, dan tombol riwayat.
- `src/router/index.js`: rute `/portal/kanji-adventure` dengan `meta.portalTitle`;
  tes menemukan rute absolut, bukan lagi path relatif yang tertanam di `/portal`.
- `src/i18n/index.js` dan `src/components/portal/PortalSidebar.vue`: menu `portal.menu.kanjiAdventure`
  tersedia dalam bahasa Indonesia dan Inggris.
- Bukti: `npm test` 130/130 pass (termasuk 4 test UI), `npm run lint` bersih, `npm run build` sukses.
- Kendala: satu test awal gagal karena rute didefinisikan relatif; diperbaiki dengan path absolut.

### f4e - Phase 4e: integrasi API dan blokir UI - SELESAI
- `src/services/kanjiAdventure.js` memakai helper `apiFetch` yang sama dengan halaman lain,
  membawa token dan menaikkan `ApiError` dengan kode server.
- Halaman memanggil `fetchVolumes`, `fetchVolume`, `startSession`, `fetchRiwayat`, dan `submitNilai`;
  tombol dinonaktifkan bila volume terkunci, chunk tidak tersedia, atau boss belum terbuka.
- Error server (`VOLUME_TERKUNCI`, `CHUNK_TERKUNCI`, `AKSES_SESI_DITOLAK`, `SESI_TIDAK_ADA`)
  diterjemahkan menjadi pesat peringatan di halaman, bukan exception mentah.
- Bukti: test UI memeriksa kelima endpoint dipakai dan `npm test` 130/130 pass.

### f4f - Phase 4f: verifikasi Phase4 - SELESAI
- Verifikasi penuh: `npm test` 130/130 pass, `npm run lint` (`tsc --noEmit`) bersih,
  `npm run build` sukses (hanya peringatan ukuran chunk bawaan Vite).
- Fitur kini bisa dibuka dari menu samping portal, bukan hanya lewat API.
- Kendala: tidak ada.

### f5b - Phase 5b: test gagal domain lock ketat dan daftar boss - SELESAI
- Test baru: normalisasi boss lawas (string id), gabung boss duplikat, daftar boss terurut.
- Test baru: `evaluasiProgres` tidak crash saat `bosses` berisi string id.
- Test baru: permintaan boss ditolak bila ada id boss yang tidak dikenal, bukan dibuang diam-diam.
- Bukti RED: `npx tsx --test server/domain/kanjiAdventure.test.js` gagal karena
  `daftarBossAdventure` belum diekspor (1 file test gagal).

### f5c - Phase 5c: implement domain attempts, boss, lock - SELESAI
- `entriBoss` menormalkan string/objek boss menjadi `{ id, salah, terakhirSalah }`.
- `daftarBossAdventure` menggabungkan duplikat, membuang entri kosong, dan mengurutkan
  berdasarkan jumlah salah terbanyak lalu id.
- `evaluasiProgres` sekarang memakai daftar boss ternormalisasi, sehingga data lama tidak merusak evaluasi.
- `rencanaSesiAdventure` menolak `CHUNK_TERKUNCI` bila boss request mengandung id di luar snapshot.
- Bukti GREEN: 16/16 test domain lulus.
- Kendala: patch pertama salah menimpa deklarasi test lama, diperbaiki sebelum dijalankan.

### f5d - Phase 5d: test gagal repo attempts/boss - SELESAI
- Test baru di `server/db/kanjiAdventureRepo.test.js`: repo harus menggabung attempt boss duplikat,
  menormalkan boss lawas berupa string, membuang entri null, dan mengisi `terakhirSalah: null`.
- Bukti RED: `npx tsx --test server/db/kanjiAdventureRepo.test.js` gagal 1/6 karena `bacaProgresAdventure`
  mengembalikan `['V2', { id: 'V2', ... }, { id: 'V3', salah: 1 }, null]` mentah.

### f5e - Phase 5e: implement repo attempts/boss - SELESAI
- `progresView` sekarang memakai `domain.daftarBossAdventure({ bosses: r.bosses })`, jadi baik
  `bacaProgresAdventure`, `daftarProgresAdventure`, maupun `simpanProgresAdventure` melihat bentuk boss yang sama.
- Bukti GREEN: test repo 6/6 pass; `npm test` 134/134 pass (tidak ada regresi).
- Kendala: tidak ada.

### f5f - Phase 5f: test gagal API lock ketat - SELESAI
- Test baru di `server/apiApp.kanjiAdventure.test.js`: peserta tidak bisa memulai
  `mode: 'boss'` sebelum chunk biasa tuntas, tidak bisa memulai chunk ke-2 lewat
  `chunkIndex` palsu, dan tidak bisa memulai volume ke-2 yang masih terkunci.
- Bukti RED: `node --test server/apiApp.kanjiAdventure.test.js` gagal 1/5 karena server
  mengembalikan 200 untuk permintaan boss yang seharusnya 403.

### f5g - Phase 5g: enforcement lock di server - SELESAI
- `rencanaSesiAdventure` menolak boss request bila ada item belum dikuasai, dan
  membatasi `chunkIndex` maksimal `chunk_terbuka` dari snapshot progres.
- Rute `POST /mulai` meneruskan error `CHUNK_TERKUNCI`, `VOLUME_TERKUNCI`, dan
  `AKSES_SESI_DITOLAK` sebagai 403, bukan 500.
- Bukti GREEN: test API 5/5 pass; `npm test` 135/135 pass.

### f5h - Phase 5h: verifikasi Phase5 - SELESAI
- Verifikasi penuh: `npm test` 135/135 pass, `npm run lint` (`tsc --noEmit`) bersih,
  `npm run build` sukses.
- Kendala: tidak ada. `bun` tetap tidak dipakai.

### f6a - Phase 6: QA menyeluruh - SELESAI
- Verifikasi: `npm test` 135/135 pass, `npm run lint` (`tsc --noEmit`) bersih,
  `npm run build` sukses (PWA 19 entries).
- Koreksi dokumentasi: `PLAN.md` bagian 9 "Tahap implementasi" hanya memuat Tahap 0–6;
  Tahap 6 adalah QA manual di browser, lalu selesai. Tidak ada spesifikasi "bank soal v2",
  "creating_mode", "deep link", "token staff", maupun Phase 7–11 di kode, di `PLAN.md`,
  maupun dalam permintaan pengguna. Baris lama yang menyebutkan itu dihapus karena merupakan
  catatan keliru yang menyebabkan pengulangan pencarian spesifikasi yang tidak ada.
- Kendala: tidak ada.

## Status saat ini
- Phase 3, 4, 5 (f5a–f5h), dan 6 (f6a) tuntas. Rencana resmi `PLAN.md` selesai.

### f6b - Push, deploy, dan verifikasi produksi - SELESAI
- Commit `88d4df4` (`feat(kanji-adventure): add portal map UI, sensei service, i18n and locks`)
  berhasil di-push ke `origin/kanji-adventure`; working tree bersih.
- Kendala push: credential helper global `helper-selector` menggantung saat HTTPS push.
  Atasi dengan mereset helper (`git -c credential.helper=`) sebelum helper one-off
  yang mengambil token dari `gh auth token`.
- Deploy production Vercel project `joydata` sukses, deployment `joydata-oalwkewbm`
  berstatus Ready.
- Verifikasi produksi: hash aset `index-B5b2BXgk.js` dan `index-Cvy8nxtQ.css` di
  `https://joydata.vercel.app/portal/kanji-adventure` sama persis dengan `dist/` lokal,
  jadi production memakai kode terbaru. Rute SPA termuat. Endpoint
  `/api/portal/kanji-adventure/volume` balas `{"error":"UNAUTHORIZED"}`, artinya rute
  server hidup dan proteksi auth berjalan. Catatan: path lama
  `/api/kanji-adventure/volume` tidak ada dan kini dikoreksi.
- Kendala: tidak ada yang tersisa. Fitur bisa diakses di
  `https://joydata.vercel.app/portal/kanji-adventure`.

### f6c - Perbaikan GENERIC_ERROR pada peta adventure (dari laporan screenshot) - SELESAI
- Laporan user: screenshot `dashboard_20261119_181204_30a8fd6a_IMG_7319.jpg` menunjukkan
  halaman portal termuat, tetapi panel peta adventure gagal dengan `Status: GENERIC_ERROR`.
- Root cause: `src/services/kanjiAdventure.js` memakai `DASAR = '/portal/kanji-adventure'`,
  padahal `src/services/portalApi.js` sudah menambahkan awalan `/api/portal`. URL akhir yang
  dikirim browser menjadi `/api/portal/portal/kanji-adventure/volume` (dobel `/portal`).
  Server menjawab 404 berisi HTML (`Cannot GET ...`), `portalApi.js` gagal melakukan
  `res.json()`, payload menjadi null, lalu melempar `code: 'GENERIC_ERROR'`.
- Bukti produksi: `vercel curl /api/portal/portal/kanji-adventure/volume` -> 404 HTML,
  sedangkan `vercel curl /api/portal/kanji-adventure/volume` -> `{"error":"UNAUTHORIZED"}`.
- TDD: test baru `URL akhir klien adventure tidak boleh dobel /portal` di
  `src/services/kanjiAdventure.test.js` awalnya gagal dengan URL aktual
  `/api/portal/portal/kanji-adventure/volume`, lalu hijau setelah `DASAR` diubah menjadi
  `/kanji-adventure`. Assertion lama yang mengunci path keliru ikut diperbarui.
- Verifikasi: `npm test` 136/136 pass, `npm run lint` (`tsc --noEmit`) bersih,
  `npm run build` sukses (PWA 19 entries).
- Kendala: verifikasi f6b hanya mengecek hash aset dan status rute, bukan alur data setelah
  login, sehingga bug ini lolos. Kini pengecekan sampai ke URL akhir yang dipanggil browser.
