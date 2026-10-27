# JOYdata - techStack.md

Dokumen ini adalah dokumen teknis untuk mendefinisikan [main idea](mainIdea.md) kedalam bahasa teknis.

## 0. Draft Awal (dipertahankan)

```
Backend: nodeJs
Frontend: vuetify 3
internalDB: supabase
externalDB: MySQL
```

Seluruh isi di bawah adalah pengembangan dari draft awal ini.

## 1. Ringkasan Stack

| Lapisan | Teknologi | Status |
|---|---|---|
| Bahasa | JavaScript (ESM) | diputuskan |
| Frontend | Vue 3 + Vuetify 3 + Vite | diputuskan |
| i18n | `vue-i18n` + locale pack Vuetify (`id`, `ja`) | diputuskan |
| State management | Pinia | rekomendasi |
| Routing | `vue-router` | rekomendasi |
| Backend | Node.js sebagai Vercel Serverless Functions | diputuskan |
| HTTP framework | Express | diputuskan |
| Auth | JWT (access + refresh) + hash bcrypt/argon2 | diputuskan |
| DB internal | Supabase (PostgreSQL, managed) | diputuskan |
| Akses DB internal | `pg` (node-postgres) + SQL mentah | diputuskan |
| DB eksternal | MySQL / MariaDB (mancation, live read-only) | diputuskan |
| Driver MySQL | `mysql2` (connection pool) | rekomendasi |
| Migrasi internal | Supabase CLI | rekomendasi |
| Ekspor | `exceljs` (.xlsx), `pdfmake` (.pdf) server-side | diputuskan |
| Chart dashboard | ApexCharts (`vue3-apexcharts`) | diputuskan |
| Validasi input | `zod` | rekomendasi |
| Logging | `pino` | rekomendasi |
| Guard khusus | Ubah tag peserta: `requireRole('admin')` | diputuskan |
| PWA | `vite-plugin-pwa` (Workbox) | rekomendasi |
| Push notification | Web Push (VAPID) + `web-push` | rekomendasi |
| Penjadwalan | Vercel Cron | rekomendasi |
| Deploy | Vercel (frontend + API) | diputuskan |

## 2. Arsitektur

```
Browser
  └─ Vuetify 3 SPA (Vite)  +  vue-i18n (id/ja)
        │  HTTPS + JSON, Authorization: Bearer <JWT>
        ▼
  Node API (Vercel Serverless Functions)
        ├─ Auth internal (JWT, password ter-hash)        ──► Supabase/Postgres
        ├─ CRUD rekap (nilai, kaiwa, sikap, absensi, master) ──► Supabase/Postgres
        └─ Data peserta & kelas (live, read-only)         ──► MySQL mancation
                                                 └─► snapshot fallback (Supabase)
```

- **Write** bisnis selalu ke Supabase (internal) → tetap berfungsi walau MySQL mancation down. Snapshot fallback ditulis ke Supabase, bukan ke mancation (MySQL tetap read-only).
- **Read** data peserta/kelas **live** dari MySQL mancation; *cache-on-read snapshot* dipakai sebagai fallback saat MySQL tidak dapat dijangkau (ditandai "data mungkin tidak terbaru"). **Kloning data dibatalkan** (`mainIdea.md` §14.1).

## 3. Frontend

- **Framework:** Vue 3 + Vuetify 3, bundler Vite.
- **i18n:** `vue-i18n` dengan berkas `src/i18n/locales/id.json` dan `ja.json`; locale Vuetify (`id`, `ja`) untuk komponen bawaan. Default `id`, switcher di app bar, pilihan disimpan di `localStorage`. Tidak ada string hardcode di komponen.
- **Label dari DB:** judul halaman dan master dwibahasa (`titleId`/`titleJa`, `namaId`/`namaJa`, `roleNameId`/`roleNameJa`) — lihat `mainIdea.md` §3.
- **State:** Pinia untuk state global (sesi auth, daftar akses halaman, preferensi bahasa).
- **Routing & guard:** `vue-router`; guard memeriksa daftar `page` yang boleh diakses role (akses per-halaman, tanpa read/write).
- **HTTP:** satu instance klien (mis. `axios`) yang menyisipkan token JWT dan menangani refresh/401 secara terpusat.
- **Format:** tanggal & angka mengikuti locale aktif (`Intl` / `toLocaleDateString`).
- **Fitur UI:** halaman Dashboard & Progres Peserta; halaman rekap (nilai ujian, nilai kaiwa, nilai sikap, absensi) dengan filter periode/kelas + ekspor; wizard absensi harian; CRUD master (kelas, peserta, staff, program, kategori sikap); halaman Role & Akses.

## 4. Backend

- **Runtime:** Node.js (LTS) pada Vercel Serverless Functions.
- **Bahasa:** JavaScript (ESM) untuk backend dan frontend.
- **Framework:** Express (routing + middleware). Middleware: parser JSON, autentikasi JWT, otorisasi per-halaman (menegakkan `page` yang diizinkan role — **bukan** menyembunyikan tombol), error handler terpusat.
- **Auth:** password `staff` disimpan sebagai hash bcrypt/argon2; sesi memakai JWT (access + refresh).
- **Validasi:** `zod` untuk payload request.
- **Integrasi DB:**
  - Supabase/Postgres via `pg` (node-postgres) dengan **SQL mentah**, koneksi ke pooler (port 6543).
  - MySQL via `mysql2`, pool dibuat di scope modul (bukan per-request) dengan `connectionLimit` kecil (1–3).
- **Ketahanan query eksternal:** timeout query ~5s, retry terbatas + circuit breaker, lalu fallback ke snapshot.
- **Ekspor:** `exceljs` untuk .xlsx dan `pdfmake` untuk .pdf; judul kolom mengikuti bahasa yang dipilih saat ekspor. Mencakup Rekap Nilai Ujian, Rekap Nilai Kaiwa, Rekap Absensi, dan Rekap Nilai Sikap.

## 5. Database Internal — Supabase (PostgreSQL)

- Managed Postgres; akses dari serverless lewat pooler (port 6543) memakai `pg` (SQL mentah).
- Skema lengkap: `mainIdea.md` §3.
- Migrasi via Supabase CLI (file migrasi masuk repo).
- Index pendukung agregasi: `(kelasId, tanggalAbsensi)` dan `(pesertaId, kelasId)` untuk absensi; `(kelasId, tanggalUjian)` dan `(pesertaId, kelasId)` untuk `nilai_ujian`; `(kelasId, tanggalKaiwa)` dan `(pesertaId, kelasId)` untuk `nilai_kaiwa`; `(pesertaId, kelasId)` untuk `nilai_sikap`.
- Soft delete (`deletedAt`) pada tabel master; `createdBy`/`updatedBy` pada tabel transaksi untuk audit.
- Snapshot fallback data mancation disimpan di tabel internal `mancation_kelas_cache` dan `mancation_peserta_cache` (`mainIdea.md` §3); hanya diisi *cache-on-read*, aman dikosongkan kapan saja.
- **Tabel tambahan:** `peserta_penempatan` (kolom 名簿 yang tidak ada di mancation), `settings` (pengaturan aplikasi), `audit_log` (riwayat aktivitas), `push_subscription` + `push_log` (langganan & idempotensi notifikasi). Lihat `mainIdea.md` §3.
- **Peserta internal:** tabel `peserta` menyimpan data pelengkap lokal + entri Peserta Luar Kelas (`sumber='manual'`); identitas tetap dibaca live dari mancation (**tidak ada kloning**).

## 6. Dashboard, Progres Peserta & Agregasi Statistik

Dashboard (lihat `mainIdea.md` §11) **tidak membutuhkan tabel data baru** — semua metrik dihitung dari tabel yang ada (tabel `mancation_*_cache` hanya untuk fallback roster, bukan sumber metrik).

- **Endpoint:** `GET /api/dashboard?periode=YYYY-MM&kelasId=`.
- **SQL view yang disarankan** (agar logika rekap tidak tersebar di aplikasi):
  - `v_nilai_ujian_avg` — rata-rata `nilaiAVG` per peserta/kelas/bulan.
  - `v_absensi_rasio_bulanan` — `hadir / COUNT(DISTINCT tanggalAbsensi)` per peserta/kelas/bulan (rumus `mainIdea.md` §5).
  - `v_sikap_skor_bulanan` — `clamp(75 + Σbobot, 0, 100)` per peserta/kelas/bulan (`mainIdea.md` §4).
- **Query:** SQL mentah via `pg`; agregasi per periode & kelas memakai index di §5. **View hanya menghitung data internal** — tidak dapat menjangkau MySQL; setiap metrik yang bergantung roster digabung di layer aplikasi.
- **Roster live:** daftar peserta per kelas diambil dari MySQL mancation (bukan dari view), lalu KPI digabung di layer aplikasi.
- **Chart (frontend):** **ApexCharts** via `vue3-apexcharts` (line, bar, stacked bar; visual modern & interaktif).
- **Performa:** skala kecil (44 peserta) → query langsung cukup; bila perlu, cache singkat (TTL 60s) selaras pola snapshot.
- **i18n:** label kartu/grafik lewat `vue-i18n`; angka & tanggal mengikuti locale aktif.
- **Cakupan fase 1:** seluruh widget (5 KPI + 6 grafik + 2 tabel watchlist). "Kelas aktif" = `kelas.status = 'aktif'`; "peserta aktif" = peserta pada kelas berstatus `aktif`.
- **Akses:** halaman Dashboard mengikuti model per-halaman. **Kebijakan:** `viewer` diberi akses Dashboard, namun akses sebenarnya tetap ditetapkan admin lewat UI Role & Akses (`mainIdea.md` §11) — seed awal hanya `admin`.

### Progres Peserta (manager)

- **Endpoint:** `GET /api/progres?periode=YYYY-MM&kelasId=&mode=kelas|peserta`.
- **Sumber data:** view agregasi yang sama dengan dashboard (§5) + `peserta.statusTag`; roster live dari MySQL mancation.
- **Kandidat interview:** ditentukan dari **tag** `siap_interview`; manager menyaring lewat filter tag. Tidak ada perhitungan skor kelayakan (lihat `mainIdea.md` §12.1).
- **Filter:** periode, kelas, tag; ekspor Excel/PDF mengikuti bahasa aktif.
- **Tanpa aksi tulis** dari sisi manager (lihat `mainIdea.md` §12.1).

### Tag status peserta (khusus admin)

- **Endpoint:** `PATCH /api/peserta/:id/tag` dengan middleware **`requireRole('admin')`** — satu-satunya pengecualian eksplisit terhadap aturan "akses per-halaman boleh apa saja" (lihat `mainIdea.md` §12.2).
- Menulis `peserta.statusTag` **dan** menyisipkan baris `peserta_status_log (pesertaId, statusTag, changedBy, changedAt, note)` dalam **satu transaksi**.
- UI menyembunyikan kontrol ubah tag untuk non-admin (lapisan UX; penegakan sebenarnya di endpoint). Tombol 3 status ditampilkan pada halaman Progres Peserta dan/atau Data Peserta.
- **Tidak ada perhitungan kelayakan** — "kelayakan interview" = nilai tag itu sendiri.

### Rekap Nilai Kaiwa (halaman terpisah)

- **Endpoint:** `GET /api/kaiwa?periode=&kelasId=`, plus CRUD (`POST`/`PATCH`/`DELETE`).
- **Nilai:** grade `A`/`B`/`C` (enum), **bukan angka** → tidak ada pola/variabel/`nilaiAVG` (lihat `mainIdea.md` §13).
- **Banyak baris per periode:** satu baris = satu penilaian; kaiwa renshuu harian dan sensei dapat menilai kapan saja (tidak ada batas satu baris per periode).
- **View agregasi (tiga metrik terpisah, `mainIdea.md` §13.1):**
  - `v_kaiwa_distribusi_bulanan` — distribusi per peserta memakai **grade terakhir** (butuh window function `DISTINCT ON` / `ROW_NUMBER` di PostgreSQL).
  - `v_kaiwa_tren_bulanan` — rata-rata poin ordinal (`A=3`, `B=2`, `C=1`) dari **semua baris** per bulan.
  - `v_kaiwa_sesi_bulanan` — jumlah baris penilaian per bulan.
- **Metrik terpisah** dari nilai ujian pada Dashboard & Progres Peserta; ringkasan peserta memakai **grade terakhir**.
- **Ekspor:** Excel/PDF mengikuti bahasa aktif.

## 7. Database Eksternal — MySQL mancation

- MariaDB (terverifikasi 11.8.9), diakses **read-only**; kredensial dari `.env`.
- Tabel yang dipakai: `t_kelas` (kelas), `t_akun` (peserta & staff), `t_datapeserta` (identitas peserta), `t_prefecture` (47 prefektur), `t_accepting_comp` (master perusahaan naitei), `t_hasiltest` (hasil tes, tanpa tanggal).
- **Kelengkapan:** hanya 17 dari 44 peserta JOY punya baris `t_datapeserta`; `t_akun.tgl_masuk` selalu `0000-00-00`; `t_akun.old_comp` (perusahaan naitei) 0 terisi → lihat pemetaan `mainIdea.md` §15.
- Pemetaan: `kelas.mancationClassId` → `t_kelas.id` (JOY: 139, 142, 144); `peserta.mancationAkunId` → `t_akun.akun_id`.
- Enrollment peserta–kelas **diatur di mancation** (`t_akun.id_kelas`) — JOYdata tidak menuliskannya.
- Tidak ada FK fisik lintas database — relasi bersifat logis, ditegakkan di layer aplikasi.
- Akses publik terverifikasi, sehingga serverless Vercel dapat menjangkau langsung.

## 8. Konfigurasi & Secret

Semua nilai sensitif lewat environment variables (Vercel untuk produksi, `.env` lokal, tidak di-commit):

| Variabel | Isi |
|---|---|
| `host_name`, `db_name`, `db_user`, `db_password` | koneksi MySQL mancation (sudah ada) |
| `DATABASE_URL` | koneksi Postgres Supabase via pooler (untuk `pg`) |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | penandatanganan token |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | kunci Web Push (`mainIdea.md` §14.8) |
| `CRON_SECRET` | proteksi endpoint cron pengingat |
| `JOY_MANCATION_CLASS_IDS` | daftar kelas JOY (139, 142, 144) **hanya untuk seed awal**; sumber kebenaran tetap `kelas.mancationClassId` |

Catatan: jangan pernah menaruh kredensial di kode, log, atau dokumentasi.

**Risiko duplikasi:** `JOY_MANCATION_CLASS_IDS` dan `kelas.mancationClassId` dapat menyimpang. Rekomendasi: jangan membacanya saat runtime — pakai sekali untuk seed, lalu hapus.

## 9. Deployment (Vercel)

- **Frontend:** SPA statis (hasil build Vite) → Vercel.
- **Backend:** Node API sebagai Serverless Functions.
- **Region:** pilih terdekat ke MySQL & pengguna (mis. `sin1`).
- **Timeout fungsi:** default 10s (dapat dinaikkan); pastikan query eksternal ≤ ~5s + fallback.
- **Koneksi:** pool `mysql2` di scope modul; Supabase lewat pooler.
- **Secret:** environment variables Vercel.
- **Cron:** **Vercel Cron** (lihat §13) menjalankan fungsi pengingat harian pada zona **Asia/Jakarta**; endpoint cron dilindungi `CRON_SECRET`.
- **Rencana cadangan:** bila koneksi MySQL bermasalah di serverless, pindahkan hanya API ke host always-on (Railway/Fly/VPS), frontend tetap di Vercel.

## 10. Tooling & Konvensi

- Ikuti `AGENTS.md` untuk alur kerja, dan `mainIdea.md` sebagai sumber keputusan desain.
- Testing mengikuti `AGENTS.md` §19 (`*.test.js`, `npm test` / `node test.js` / `jtest`).
- Gaya kode, struktur folder, dan pola harus konsisten dengan yang sudah ada (lihat `AGENTS.md` §2 *Consistency Rule*).

## 11. Keputusan Teknis

Sudah diputuskan:
- **Bahasa:** JavaScript (ESM) — selaras `AGENTS.md` §19 (`*.test.js`, `jtest`, `node test.js`).
- **Framework HTTP:** Express.
- **Akses Supabase:** `pg` (node-postgres) + SQL mentah — cukup untuk agregasi rasio absensi dan view `nilaiAVG`.
- **Query builder/ORM:** tidak dipakai.

Masih berupa rekomendasi (dapat diubah saat implementasi): Pinia, `vue-router`, `mysql2`, Supabase CLI, `zod`, `pino`.

## 12. Risiko Teknis & Mitigasi

Hasil review dokumen (2026-10-27).

| # | Risiko | Mitigasi |
|---|---|---|
| 1 | Duplikasi input nilai ujian | UNIQUE `(pesertaId, kelasId, tanggalUjian, codeUjian)` + upsert |
| 2 | Negasi ganda pada skor sikap | `bobot` = magnitude positif; tanda dari `sentiment` |
| 3 | `nilaiAVG` salah bila variabel kosong dianggap 0 | rata-rata hanya atas variabel NOT NULL |
| 4 | View agregasi tidak dapat menjangkau MySQL | view hanya data internal; roster digabung di aplikasi |
| 5 | Koneksi MySQL habis akibat concurrency serverless | pool di scope modul, `connectionLimit` 1–3, timeout 5s |
| 6 | MySQL down → halaman kosong | snapshot cache-on-read + banner "data mungkin tidak terbaru" |
| 7 | Baris `access` yatim saat role/page dihapus | `ON DELETE CASCADE` pada `access` |
| 8 | Divergensi `JOY_MANCATION_CLASS_IDS` vs tabel `kelas` | env hanya untuk seed; runtime membaca tabel `kelas` |
| 9 | Baris `peserta` belum ada saat menulis transaksi/tag | sync roster saat buka kelas; upsert baris sebelum menulis |
| 10 | Absensi ganda akibat submit wizard berulang | UNIQUE `(pesertaId, kelasId, tanggalAbsensi)` + upsert |
| 11 | Rasio absensi bias untuk peserta masuk tengah bulan | keterbatasan terdokumentasi; `kelas_peserta.tanggalMasuk` bila tersedia |
| 12 | `-` disalahartikan sebagai `0%` (atau sebaliknya) | `-` hanya bila `S = 0`; tanpa record saat `S > 0` = `0%` |
| 13 | Staff merangkap dua role | di luar cakupan saat ini (satu role per staff); perlu tabel penghubung bila dibutuhkan |
| 14 | Multi-sensei dalam satu kelas | di luar cakupan saat ini (`kelas.senseiId` tunggal); perlu tabel penghubung bila dibutuhkan |
| 15 | Pemetaan grade kaiwa ordinal tersimpan sebagai angka | pemetaan `A=3/B=2/C=1` **hanya di tampilan**, tidak disimpan |
| 16 | Data alumni/peserta luar kelas hilang bila mancation berubah | dicatat manual di halaman Peserta Luar Kelas (`sumber='manual'`), bukan mengandalkan mancation |
| 17 | `audit_log` tertulis tetapi mutasi gagal (atau sebaliknya) | tulis log dalam **transaksi yang sama** dengan mutasi |
| 18 | Langganan push kedaluwarsa | hapus saat respons `410`/`404`; `lastUsedAt` untuk pemangkasan |
| 19 | Notifikasi terkirim pada jam yang salah | jadwal eksplisit di zona **Asia/Jakarta** |
| 20 | Push tidak jalan di iOS | hanya bila PWA terpasang (iOS 16.4+); badge in-app sebagai fallback |
| 21 | Data basi karena service worker | jangan cache respons API; cache hanya aset statis |
| 22 | Notifikasi terkirim ganda saat cron di-retry | helper `kirimPush` mencatat ke `push_log`; UNIQUE `(jenis, tanggal, staffId)` |

## 13. Fitur Tambahan (2026-10-27)

Detail keputusan di `mainIdea.md` §14.

- **Rapor peserta (PDF):** `GET /api/rapor/:pesertaId?periode=YYYY-MM` → `pdfmake`; opsi `?format=xlsx` memakai `exceljs`; bahasa mengikuti locale aktif.
- **Akun & sandi staff:** `PATCH /api/staff/me/password` (sendiri) dan `PATCH /api/staff/:id/password` (admin, `requireRole('admin')`); hash bcrypt/argon2; **cabut refresh token** saat sandi berubah.
- **Pengaturan aplikasi:** tabel `settings`; `GET/PATCH /api/settings` (ubah hanya admin); dikonsumsi view/agregasi (KKM, batas label, periode default, rentang tren, bobot default sikap).
- **Audit log:** tulis baris `audit_log` untuk setiap mutasi penting (nilai, absensi, sikap, kaiwa, tag, pengaturan, staff) **dalam transaksi yang sama**.
- **Pengingat absensi:** `GET /api/absensi/belum-diisi?tanggal=` (kelas `aktif` yang belum punya catatan absensi pada tanggal itu) untuk badge/notifikasi.
- **Peserta Luar Kelas:** `GET /api/peserta-luar` (daftar `sumber='manual'`), `POST /api/peserta-luar` body `{ mancationAkunId, keterangan, alasan }` → validasi `t_akun` (ada + `cli_id = 9`) → buat baris `peserta` dengan `sumber='manual'`; `DELETE /api/peserta-luar/:id` untuk membuang baris manual. Bila akun muncul di kelas JOY, baris berpindah menjadi `sumber='roster'` (`mainIdea.md` §14.1).
- **Frontend:** halaman Peserta Luar Kelas memakai komponen tabel yang sama dengan Data Peserta (kolom identik, tambah dialog input `mancationAkunId`).
- **PWA (mobilitas):** `vite-plugin-pwa` + Workbox — precache **aset statis & app shell** saja (`registerType: 'autoUpdate'`), **respons API tidak di-cache** agar data tidak basi. Manifest + ikon + `display: standalone`.
- **Push notification (Web Push/VAPID):** `POST/DELETE /api/push/subscribe` menyimpan/menghapus langganan ke `push_subscription`; pengiriman memakai `web-push`; langganan dengan respons `410`/`404` dihapus otomatis. Payload memuat judul & isi dwibahasa serta `url` deep link (mis. `/absensi?tanggal=...&kelasId=...`).
- **Jenis notifikasi:** pengingat absensi, pengingat input nilai/kaiwa, rapor/ekspor selesai, pemberitahuan sistem. Kirim melalui satu helper `kirimPush(jenis, tanggal, staffIds, payload)` yang membaca `push_subscription` dan **mencatat setiap pengiriman ke `push_log`** (`UNIQUE(jenis, tanggal, staffId)`) sehingga cron yang di-retry tidak mengirim ganda.
- **Penjadwalan pengingat:** `vercel.json` → `crons` **dua kali sehari (08:00 & 16:00 WIB)** memanggil `GET /api/cron/pengingat-absensi` (guard `CRON_SECRET`); hari libur/akhir pekan dapat dikecualikan memakai `t_harilibur` mancation.
- **Fase 2:** *Background Sync* untuk menampung submit absensi saat offline; aman karena `UNIQUE(pesertaId, kelasId, tanggalAbsensi)` membuat submit idempoten (upsert).
