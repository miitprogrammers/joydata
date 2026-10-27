# JOYdata - mainIdea.md

Aplikasi ini adalah aplikasi sederhana untuk merekap data akademis dan database kepesertaan di cabang LPK Mizuno Semangat Bangsa - kelas/cabang JOY.

## Scope

Aplikasi ini adalah pelengkap aplikasi internal LPK Mizuno Semangat Bangsa yang saat ini sudah live production. Oleh karena itu, sebagian data (data peserta beserta kelengkapan datanya, dan kelas) diambil dari database aplikasi internal tersebut. Semua data auth diambil dari database aplikasi tersebut yang ada di .env.

> **Catatan revisi (2026-10-27):** Kalimat "Semua data auth diambil dari database aplikasi tersebut" **DIBATALKAN**. Auth JOYdata sepenuhnya internal (lihat bagian *Keputusan Desain* di akhir dokumen). Database eksternal (mancation/MySQL) hanya dipakai untuk membaca data peserta & kelas. Konsekuensinya: akun staff dikelola di dalam JOYdata dan tidak lagi memakai kredensial app production.

## Features

### Database Kelas dan Peserta

#### Table Kelas
Tabel kelas pada dasarnya menggunakan database internal aplikasi ini. Namun, karena ada ID yang harus diambil dari aplikasi LPK, maka tabel kelas harus menyimpan ID dari aplikasi LPK tersebut agar bisa mengambil peserta yang berada di kelas tersebut dari aplikasi LPK.

**Struktur data:**

- id
- namaKelas (text)
- Program (dropdown)
- Tanggal Start (tanggal kelas pertama dibuka) (date yyyymmdd)
- description (text)
- mancationClassId (ini id kelas aplikasi LPK)
- senseiPengajar (id dari table staff dengan role sensei)

#### Database Peserta
Tabel peserta pada dasarnya full menggunakan database aplikasi LPK (mancation). Namun, data di aplikasi tersebut kurang lengkap. Jadi, database internal aplikasi ini akan melengkapi data yang belum ada di mancation.

**Struktur data:**

- id
- mancationAkunId
- data lain belum diputuskan tapi pasti ada

### Table Rekap Nilai Ujian

Ada 2 pola penilaian di lembaga kami sehingga diperlukan 2 table berbeda (atau mungkin bisa sama)

#### Pola dengan variable
Pola ini menggunakan variable: mojigoi, bunpou, dokkai dan choukai, dengan setiap variable diisi optional (karena biasanya ada ujian tanpa choukai).

#### Pola tanpa variable
Pola ini tidak menggunakan variable, biasanya diterapkan dikelas dasar, nilai yang direkap hanya 1 nilai ujian secara general tanpa variable.

Dari kedua pola tersebut, struktur table bila dibuat 1 table seharusnya:

- id
- akunId (fk dari id di database peserta)
- tanggalUjian (yyyymmdd)
- codeUjian (text, biasanya untuk mengisi kode seperti M001 artinya ujian minggu pertama, buat text bebas saja)
- nilaiTunggal (ini bila crud nilai ujian tanpa pola, 1-100)
- nilaiMojiGoi (ini bila crud dengan nilai mojigoi, 1-100)
- nilaiBunpou (ini bila crud dengan nilai bunpou, 1-100)
- nilaiDokkai (ini bila crud dengan nilai dokkai, 1-100)
- nilaiChoukai (ini bila crud dengan nilai choukai, 1-100)
- nilaiAVG (ini rata-rata nilai, ambil langsung dari nilaiTunggal jika nilai tunggal, ambil average dari banyak variable terisi jika menggunakan variable)
- penilai (id staff yang menginput nilai)

### Table Nilai Sikap

Nilai sikap adalah penilaian attitude peserta pelatihan.

**Struktur:**

- id
- akunId (fk dari table peserta)
- description (text, di sini sensei memberi note mengenai atitude peserta selama menjalani pelatihan)
- negative (1 jika penilaian negatif)
- positive (1 jika penilaian positive)
- senseiId (id akun sensei, table sensei belum dibahas, table ini internal aplikasi ini )
- tanggalPenilaian (yyyymmdd)

### Table Absensi
Table ini berisi absensi peserta

**Struktur:**

- id
- akunId (fk dari id peserta)
- tanggalAbsensi (yyyymmdd)
- hadir (1 jika hadir)
- sakit (1 jika sakit)
- izin (1 jika izin)
- alfa (1 jika tanpa keterangan)

### Table Staff

Table ini berisi data sensei pengajar, table ini internal

**Struktur:**

- id
- nama
- username
- password
- role

### Table Role

Table ini adalah table role yang nantinya mengatur hak akses halaman (bukan read/write hanya hak akses halaman)

- id
- roleName

### Table Access

Table ini adalah table yang mengatur role mana boleh mengakses halaman mana

**Struktur:**

- id
- roleId
- pageId

### Table Pages

Table ini adalah kumpulan page fitur yang dimiliki aplikasi ini

**Struktur:**

- id
- pageName
- title
- icon
- path
- bar (main/config)

### Crud Staff

Halaman crud sederhana untuk mengelola akun Staff

### Halaman Rekap Nilai Ujian

Halaman yang menampilkan nilai-nilai ujian peserta, dengan kolom search peserta, filter periode (bulan), filter kelas

Ada tombol (+) untuk menambah nilai baru (CRUD ke table nilai)

### Halaman Rekap Nilai Sikap

Aku masih bingung rumus ini, kita buat fitur ini bareng2.

### Halaman Rekap Absensi

Halaman ini merupakan wizard yang bisa diinput sensei setiap hari.

Step:

- pilih tanggal absen
- pilih kelas
- ceklis checkbox di list nama peserta sesuai kelas (hadir, izin, sakit, alfa) default hadir checked

Ketika submit isi table absensi.

---

# Keputusan Desain (Revisi 2026-10-27)

Bagian ini adalah hasil pematan ide. Isi di atas dipertahankan sebagai draft awal. Jika terdapat konflik, **bagian ini yang berlaku** (kecuali ada instruksi user yang lebih baru).

## 1. Keputusan Final

| # | Topik | Keputusan |
|---|-------|-----------|
| 1 | Autentikasi | **Internal penuh.** Tabel `staff` menyimpan `username` + `passwordHash` sendiri. JOYdata punya login independen dari app production. |
| 2 | Data peserta & kelas | **Live query ke MySQL (mancation) setiap request.** Tidak ada replikasi untuk data utama; ada snapshot sebagai fallback (lihat revisi di bawah). Tidak ada FK fisik lintas database. |
| 3 | Nilai Sikap | **Log kejadian + skor terhitung.** Setiap penilaian = 1 baris (sentimen + bobot + catatan). Skor periode diturunkan dengan basis `75` + clamp 0–100 (§4). |
| 4 | Relasi transaksi | **Tambah `kelasId`** ke `nilai_ujian`, `nilai_sikap`, `nilai_kaiwa`, `absensi`. **Enrollment peserta–kelas diatur di mancation**, bukan tabel internal. |
| 5 | Akun Staff | **Input manual via halaman Crud Staff.** Tidak ada import/sync dari mancation. |
| 6 | Identitas peserta | Tabel `peserta` lokal = **data pelengkap saja**, di-key oleh `mancationAkunId` (UNIQUE). Identitas selalu diambil live dari MySQL. |
| 7 | Role | `admin`, `manager`, `sensei`, `viewer`. Akses **hanya per halaman** (tanpa read/write); bila halaman boleh diakses, semua operasi di halaman itu boleh (§8). |
| 8 | Deployment | **Vercel** untuk frontend (SPA) + Node API (serverless functions); MySQL publik, Supabase managed (§10). |
| 9 | Dashboard | Halaman statistik baru (ringkasan peserta, nilai, sikap, kehadiran) — **belum ada di desain awal**, diusulkan di §11. |
| 10 | Tag peserta | `peserta.statusTag` ∈ {`standar`, `berkembang`, `siap_interview`}, default `standar`. **Hanya admin** yang boleh mengubah (guard endpoint, bukan model per-halaman) + riwayat `peserta_status_log` (§12). |
| 11 | Halaman Progres Peserta | Halaman baru untuk **manager**: progres per kelas & per peserta; kandidat interview disaring lewat filter **tag** (§12). |
| 12 | Penilaian Kaiwa | Tabel **terpisah** `nilai_kaiwa`; nilainya **grade `A`/`B`/`C`** (bukan angka) dari kaiwa dengan sensei; halaman rekap sendiri; ditampilkan **terpisah** dari nilai ujian (§13). |
| 13 | Rapor peserta (PDF) | Rapor per peserta per periode (nilai ujian, kaiwa, sikap, kehadiran) + kolom 名簿 (§14). |
| 14 | Akun staff | Ganti password sendiri + reset oleh admin (§14). |
| 15 | Pengaturan aplikasi | Tabel `settings`: KKM, batas label A–D, periode default, rentang tren, bobot default sikap (§14). |
| 16 | Audit & pengingat | Log aktivitas umum + pengingat absensi belum diisi (§14). |
| 17 | Halaman Peserta Luar Kelas | Halaman terpisah untuk peserta di luar kelas JOY (keluar/alumni/cuti); pengisian **manual by `mancationAkunId`** (§14.1). |
| 18 | PWA & Push Notification | Aplikasi dapat dipasang di HP (PWA) dan mengirim notifikasi pengingat via Web Push (§14.7, §14.8). |

Revisi 2026-10-27 (setelah inspeksi skema mancation):
- **#2 dipertahankan:** peserta dibaca **live** dari mancation + *snapshot fallback* (§16). **Kloning data dibatalkan** — alumni & peserta di luar kelas dicatat manual lewat halaman Peserta Luar Kelas (§14.1).
- **#3 dikonfirmasi**: Nilai Sikap internal penuh, tidak mengambil data penilaian dari mancation; kategori internal (§4).
- **#4 dikonfirmasi**: kelas JOY = `mancationClassId` 139, 142, 144 **disimpan pada tabel `kelas`** (§3/§6).
- **#6 dikonfirmasi**: `mancationAkunId` = `t_akun.akun_id` (§6).

## 2. Koreksi terhadap Draft di Atas

- **Baris 7** — pernyataan "semua data auth dari DB eksternal" dibatalkan (lihat catatan di atas).
- **Baris 70** — "table sensei belum dibahas" tidak berlaku: `sensei` adalah `staff` dengan role sensei. `senseiPengajar`/`senseiId` merujuk ke `staff.id`. Tidak ada tabel sensei terpisah.
- **Baris 55** — typo `1-00` diperbaiki menjadi `1-100`.
- **Baris 20** — `Program (dropdown)` yang belum punya tabel → dibuat tabel lookup `program`.
- **Baris 48, 67, 79** — transaksi hanya FK ke `akunId` tanpa `kelasId`. Tanpa `kelasId`, filter & rekap per kelas tidak akurat bila peserta mengikuti lebih dari satu kelas → ditambahkan.
- **Baris 82–84 (Absensi)** — 4 flag boolean diganti satu kolom `status` enum, karena peserta hanya berada di satu status. Ditambah UNIQUE constraint agar submit ulang wizard bersifat idempoten (update, bukan duplikat).
- **Baris 56 (nilaiAVG)** — tidak disimpan sebagai kolom agar tidak drift; dihitung di DB view / layer aplikasi.
- **Keseluruhan** — semua tabel internal mendapat `createdAt`, `updatedAt`; tabel master (staff/kelas/peserta) memakai soft delete (`deletedAt`).
- **Format tanggal** — di database pakai tipe `date` (bukan string `yyyymmdd`); format `yyyymmdd` hanya untuk tampilan.

## 3. Skema v2 (Internal — Supabase/Postgres)

```
role(id, roleNameId, roleNameJa, timestamps)
page(id, pageName, titleId, titleJa, icon, path, bar['main'|'config'], timestamps)
access(id, roleId→role, pageId→page, UNIQUE(roleId,pageId), timestamps)
  -- ON DELETE CASCADE saat role/page dihapus (hindari baris access yatim)

staff(id, nama, username UNIQUE, passwordHash, roleId→role,
      active, deletedAt, timestamps)                 # auth internal

program(id, namaId, namaJa, timestamps)              # lookup Program

kelas(id, namaKelas, programId→program, tanggalStart date, description,
      mancationClassId UNIQUE, senseiId→staff, status['aktif'|'selesai']
      DEFAULT 'aktif', deletedAt, timestamps)

peserta(id, mancationAkunId UNIQUE, nama, sumber['roster'|'manual'] DEFAULT 'roster',
        statusTag['standar'|'berkembang'|'siap_interview'] DEFAULT 'standar',
        statusMancation, keteranganLuarKelas['keluar'|'alumni'|'cuti'] NULL, alasan,
        tanggalMasuk date, <field pelengkap>, deletedAt, timestamps)
  -- data pelengkap lokal + peserta luar kelas; identitas dibaca live dari mancation (tanpa kloning)

peserta_status_log(id, pesertaId→peserta, statusTag, changedBy→staff, changedAt, note)

peserta_penempatan(id, pesertaId→peserta, tanggalLulusUjian date, perusahaanNaitei,
                   jenisPekerjaan, prefekturId, rencanaMulaiKerja date, timestamps)
  -- kolom 名簿 yang TIDAK tersedia di mancation (lihat §15)

settings(key UNIQUE, value, timestamps)
audit_log(id, staffId→staff, aksi, entitas, entitasId, dataLama, dataBaru, createdAt)

push_subscription(id, staffId→staff, endpoint UNIQUE, p256dh, auth, locale,
                  userAgent, createdAt, lastUsedAt)
  -- langganan Web Push per perangkat staff (§14.8)

push_log(id, jenis, tanggal date, staffId→staff, sentAt, status,
         UNIQUE(jenis, tanggal, staffId))
  -- idempotensi: satu notifikasi per (jenis, tanggal, staff)

nilai_ujian(id, pesertaId→peserta, kelasId→kelas, tanggalUjian date, codeUjian,
            pola['tunggal'|'variable'], nilaiTunggal, nilaiMojiGoi, nilaiBunpou,
            nilaiDokkai, nilaiChoukai, penilaiId→staff, timestamps,
            UNIQUE(pesertaId,kelasId,tanggalUjian,codeUjian))
  CHECK: pola='tunggal'  → nilaiTunggal NOT NULL dan 4 variabel NULL
         pola='variable' → minimal 1 variabel terisi dan nilaiTunggal NULL
  -- nilaiAVG: 'tunggal' → nilaiTunggal; 'variable' → rata-rata variabel NOT NULL

nilai_kaiwa(id, pesertaId→peserta, kelasId→kelas, tanggalKaiwa date,
            grade['A'|'B'|'C'], description, penilaiId→staff, timestamps)
  -- grade kualitatif; banyak baris per periode; tanpa pola/variabel/nilaiAVG

sikap_kategori(id, namaId, namaJa, sentimentDefault['positif'|'negatif'],
               bobotDefault, aktif, timestamps)

nilai_sikap(id, pesertaId→peserta, kelasId→kelas, kategoriId→sikap_kategori,
            sentiment['positif'|'negatif'], bobot, description, penilaiId→staff,
            tanggalPenilaian date, timestamps)
  -- `bobot` disimpan sebagai MAGNITUDE positif; tanda ditentukan `sentiment`

absensi(id, pesertaId→peserta, kelasId→kelas, tanggalAbsensi date,
        status['hadir'|'sakit'|'izin'|'alfa'], pencatatId→staff, timestamps,
        UNIQUE(pesertaId,kelasId,tanggalAbsensi))

mancation_kelas_cache(id, mancationClassId UNIQUE, nama, syncedAt)
mancation_peserta_cache(id, mancationAkunId, mancationClassId, nama, syncedAt,
                        UNIQUE(mancationAkunId, mancationClassId))
  -- snapshot fallback (cache-on-read); bukan sumber data utama
```

Catatan:
- `mancationClassId` / `mancationAkunId` adalah ID eksternal → hanya **logical FK**, bukan constraint fisik.
- Keanggotaan peserta per kelas **diatur di mancation** (via `t_akun.id_kelas`) — tidak ada tabel enrollment internal.
- **Dua konsep status berbeda, jangan dicampur:** `peserta.statusTag` = progres internal JOYdata (`standar`/`berkembang`/`siap_interview`); `peserta.statusMancation` = status kepegawaian/kelulusan dari mancation (`在籍中`/`休学中`/`退学`/`在籍中＆合格`/`卒業`). Lihat §15.
- **Tidak ada kloning data.** Identitas peserta (nama, kelas, identitas) dibaca **live** dari mancation; tabel `peserta` hanya menyimpan data pelengkap lokal + entri Peserta Luar Kelas.
- **`peserta.sumber`:** `roster` = peserta kelas JOY (139/142/144); `manual` = ditambahkan lewat halaman Peserta Luar Kelas dengan memasukkan `mancationAkunId`. Bila peserta `manual` kemudian muncul di kelas JOY, baris berpindah menjadi `roster` (§14.1).
- **Validasi tambah manual:** `mancationAkunId` wajib ada di `t_akun` dan ber-`cli_id = 9`; baris duplikat ditolak karena `mancationAkunId` UNIQUE.
- **Alumni & cuti** tidak dibekukan otomatis; dicatat manual sebagai entri Peserta Luar Kelas beserta `keteranganLuarKelas`.
- Daftar peserta per kelas diambil live dari roster mancation berdasarkan `mancationClassId`.
- **Konvensi kolom penilai:** `penilaiId` = pemberi nilai (`nilai_ujian`, `nilai_kaiwa`, `nilai_sikap`); `pencatatId` = pencatat absensi. Satu arti per nama.
- **`bobot` (nilai_sikap)** selalu disimpan sebagai magnitude positif; tanda mengikuti `sentiment`. Jangan menyimpan nilai bertanda, agar tidak terjadi negasi ganda saat menghitung skor.
- **`kelas.status`** ∈ {`aktif`, `selesai`}; default `aktif`. Dipakai untuk definisi "kelas aktif" pada Dashboard (§11).
- **`senseiId` pada `kelas` = satu sensei utama.** Multi-sensei per kelas belum didukung; bila dibutuhkan, perlu tabel penghubung.
- **`staff.roleId` = satu role per staff.** Staff yang merangkap (mis. admin sekaligus sensei) memerlukan dua akun atau perluasan ke tabel penghubung.
- **Soft delete `peserta`** hanya menyembunyikan baris lokal (data pelengkap); transaksi (nilai, absensi, sikap, kaiwa) tetap utuh dan tetap dapat dilaporkan.
- **`nilaiAVG`** (dihitung di view): pola `tunggal` → `nilaiTunggal`; pola `variable` → rata-rata dari variabel yang **NOT NULL** saja (variabel opsional tidak menurunkan rata-rata).
- **Tabel `mancation_*_cache`** hanya diisi *cache-on-read* saat query mancation berhasil; tidak pernah menjadi sumber data utama dan boleh dikosongkan tanpa kehilangan data.

## 4. Aturan Bisnis Nilai Sikap (basis 75, clamp 0–100)

- Nilai Sikap **internal penuh** — JOYdata tidak mengambil data penilaian dari mancation; kategori bersifat internal (tabel `sikap_kategori`), tidak terikat `t_sikap`/`t_indsikap`.
- Periode penilaian **bulanan** (selaras dengan absensi).
- Skor dasar tiap peserta per periode = **`75`** (batas bawah label B; peserta tanpa kejadian = B).
- Setiap kejadian `positif` menambah `bobot`; setiap `negatif` mengurangi `bobot`.
- Skor akhir periode = `clamp(75 + Σ(bobot·sign), 0, 100)`.
- **Alasan basis 75 (di bawah 100):** bila basis 100 dengan clamp atas 100, kejadian positif tidak pernah menaikkan skor (hanya menetralkan negatif). Dengan basis 75, positif benar-benar menghargai dan negatif bisa menjatuhkan skor.
- Label kualitatif (tampilan): A ≥ 90, B ≥ 75, C ≥ 60, D < 60.
- **Dua skala berbeda:** KKM institusi = **70** (ambang kelulusan sikap), sedangkan A/B/C/D adalah label berjenjang. Keduanya tidak identik — nilai `C` (60–74.9) sudah di bawah KKM walau bukan `D`.
- `bobot` disimpan sebagai snapshot di baris `nilai_sikap` (bisa di-override per kejadian); nilai default diambil dari `sikap_kategori`.

### Kategori & bobot (rekomendasi final)

| Sentimen | Kategori | Bobot |
|---|---|---|
| positif | Kehadiran & ketepatan waktu | +5 |
| positif | Kedisiplinan aturan & pakaian | +5 |
| positif | Kerapian & kebersihan (5S/5R) | +5 |
| positif | Kerja sama & membantu teman | +5 |
| positif | Keaktifan pelatihan | +5 |
| positif | Horenso (lapor / konsultasi / komunikasi) | +5 |
| positif | Ibadah & kerohanian | +5 |
| positif | Prestasi (ujian / lomba) | +10 |
| negatif | Terlambat | −5 |
| negatif | Tidak mengumpulkan tugas | −10 |
| negatif | Mengganggu kelas | −10 |
| negatif | Alfa tanpa kabar | −10 |
| negatif | Tidak sopan | −15 |
| negatif | Pelanggaran berat (merokok, dsb.) | −20 |

Contoh: 2× "Kerja sama" (+5) + 1× "Terlambat" (−5) → `75 + 10 − 5 = 80`.

## 5. Aturan Bisnis Absensi

Rasio dihitung murni dari tabel `absensi` (tanpa kolom tambahan), per **bulan** dan per **kelas**.

Definisi:
- `S` = jumlah sesi tercatat kelas pada bulan itu = `COUNT(DISTINCT tanggalAbsensi)` untuk kelas + bulan tersebut.
- `hadirₚ` = jumlah record peserta `p` berstatus `hadir`.
- `nonHadirₚ` = `sakit + izin + alfa` milik peserta `p`.
- `total` = `S`, sehingga denominator sama untuk semua peserta di kelas itu.

Rumus:
- `rasioKehadiranₚ = hadirₚ / S`
- `rasioKetidakhadiranₚ = nonHadirₚ / S`
- `rasioKehadiran + rasioKetidakhadiran = 1`
- Rasio kelas = `Σ hadirₚ / (S × jumlah peserta kelas)`

Ketentuan:
- Hari tanpa catatan sensei **tidak dihitung sebagai alfa** dan tidak menambah denominator → ketelitian laporan bergantung pada disiplin sensei.
- Rasio `-` (tidak dapat dihitung) **hanya** bila `S = 0` (kelas belum punya catatan absensi pada periode itu). Peserta yang sama sekali tidak punya record sementara `S > 0` dihitung **`0%`**, bukan `-`.
- Pembulatan **1 desimal** (mis. `83.3%`); presisi penuh tetap tersimpan, pembulatan hanya untuk tampilan.
- Peserta yang tidak punya record pada hari yang tercatat otomatis terhitung tidak hadir, karena denominator memakai `S`.
- Rasio kelas memakai jumlah peserta dari **roster live**, sehingga peserta yang tidak pernah dicatat tetap menurunkan rasio kelas.
- Keterbatasan: peserta yang bergabung di tengah bulan belum bisa diproporsikan akurat karena tanggal enrollment di mancation (`t_akun.tgl_masuk`) selalu `0000-00-00`; gunakan `peserta.tanggalMasuk` (diisi manual/dari sumber lain) bila tersedia.
- Index pendukung: `(kelasId, tanggalAbsensi)` dan `(pesertaId, kelasId)`.

## 6. Referensi Skema Mancation (hasil inspeksi read-only, 2026-10-27)

Diverifikasi langsung ke MySQL mancation (MariaDB 11.8.9). Fakta yang dipakai:

- **Identifikasi cabang JOY (TERJAWAB):** `t_kelas.cli_id = 9` adalah tenant LPK Mizuno Semangat Bangsa (berisi kelas ARASHI, HIKARI, RAKU, ASK, JOY, KEIZOKU, ARAKU, cuti). **Kelas JOY ditetapkan eksplisit sebagai `mancationClassId` 139 (JOY 1), 142 (JOY 2), 144 (JOY 3)** — disimpan pada kolom `kelas.mancationClassId` (tabel internal, sesuai dokumen baris 23), bukan dicocokkan lewat nama. Kolom `t_kelas.kel_code` kosong.
- **Akun peserta/staff:** `t_akun` (`akun_id` = PK) menampung peserta maupun staff. `mancationAkunId` JOYdata = `t_akun.akun_id`.
- **Roster JOY:** via `t_akun.id_kelas` → 17 (JOY 1) + 15 (JOY 2) + 12 (JOY 3) = 44 peserta.
- **Tanggal enrollment tidak tersedia:** `t_akun.tgl_masuk` selalu `0000-00-00` untuk peserta JOY → batasan prorata bulan berjalan tetap berlaku (lihat §5).
- **Program:** `t_akun.program = 0` untuk seluruh cli 9 → program tidak tersedia dari mancation; tabel `program` internal diisi manual.
- **Role:** role pada cli 9 = administrator, direktur, manager, divhead, staff, instruktur, coach. Tidak ada role "sensei" di cli 9 (role sensei hanya ada di cli lain). Karena auth JOYdata internal, pemetaan role tidak diperlukan.
- **Model nilai sikap mancation:** berjenjang `t_sikap` (aspek + `kkm` = 70) → `t_indsikap` (indikator) → `t_penilaian_sikap` (opsi penilaian + nilai); hasil disimpan di `t_nilaisikap (akun_id, id_sikap, id_ind, id_penilaian, nilai, date, ket)` dengan 885 baris. Aspek pada cli 9: `5S/5R`, `PERATURAN`, `KEROHANIAN`, `KERJA SAMA`, `PELATIHAN`, `HORENSO`, `LAINNYA`, `KEPERCAYAAN DIRI` (semua KKM 70). **Keputusan: tidak dipakai** — JOYdata tidak mengambil data penilaian sikap dari mancation; model internal tetap log + bobot (§4).
- **Model nilai ujian mancation:** `t_nilaiujian (akun_id, id_materi, id_lapngajar, nilai)` → penilaian per materi, bukan mojigoi/bunpou/dokkai/choukai. Model JOYdata sengaja berbeda karena berperan sebagai lapisan rekap.
- **Absensi mancation:** `t_absen` / `t_absenpeserta` (`kehadiran`) dan `t_absensi_baru` (absen staff harian) — tidak dipakai JOYdata; absensi peserta tetap internal.
- **Akses mancation:** pola `t_menu` + `t_menu_access (menu_id, role_id, div_id, cli_id)` mirip desain `page`/`access` JOYdata.
- **Reachability:** MySQL dapat diakses dari luar jaringan → backend boleh di-deploy ke PaaS publik.

## 7. Keamanan

- `passwordHash` memakai bcrypt/argon2 — dilarang menyimpan plaintext.
- Sesi memakai JWT internal; otorisasi per halaman diperiksa middleware berdasarkan `access` (role↔page), bukan sekadar menyembunyikan menu.
- `.env` hanya untuk kredensial koneksi MySQL (mancation) & konfigurasi Supabase.
- **Pengecualian otorisasi:** perubahan `peserta.statusTag` hanya boleh oleh role `admin`, ditegakkan di endpoint (`requireRole('admin')`) — bukan oleh model akses per-halaman (§12.2).

## 8. Role & Akses

`admin`, `manager`, `sensei`, `viewer` hanya *nama role* yang membedakan **daftar halaman** yang boleh diakses. Pengelolaan akses dilakukan lewat **halaman UI Role & Akses**, bukan seed statis.

**Seed awal: hanya `admin`** yang diberi seluruh halaman (`main` + `config`); role lain **dibiarkan kosong** dan diatur admin lewat UI setelah aplikasi berjalan.

| Halaman | bar | admin (seed) | manager | sensei | viewer |
|---|---|---|---|---|---|
| Dashboard | main | ✓ | – | – | – |
| Progres Peserta | main | ✓ | – | – | – |
| Rekap Nilai Ujian | main | ✓ | – | – | – |
| Rekap Nilai Kaiwa | main | ✓ | – | – | – |
| Rekap Nilai Sikap | main | ✓ | – | – | – |
| Rekap Absensi | main | ✓ | – | – | – |
| Data Kelas | main | ✓ | – | – | – |
| Data Peserta | main | ✓ | – | – | – |
| Peserta Luar Kelas | main | ✓ | – | – | – |
| Rapor Peserta | main | ✓ | – | – | – |
| Crud Staff | config | ✓ | – | – | – |
| Akun & Notifikasi Staff | config | ✓ | – | – | – |
| Kategori Sikap | config | ✓ | – | – | – |
| Program | config | ✓ | – | – | – |
| Pengaturan | config | ✓ | – | – | – |
| Role & Akses | config | ✓ | – | – | – |
| Riwayat Aktivitas | config | ✓ | – | – | – |

Konsekuensi yang disadari: karena model akses hanya per-halaman, siapa pun yang diberi akses ke suatu halaman **dapat menambah/mengubah data** di halaman itu — tidak ada pembatasan write. `viewer` disediakan untuk kebutuhan "melihat-lihat" data peserta (mis. staf Jepang).

Mitigasi tanpa menambah read/write:
- Tabel transaksi menyimpan `createdBy`/`updatedBy` → jejak audit.
- Tabel master memakai soft delete (`deletedAt`) → kesalahan bisa dipulihkan.
- Aksi destruktif di UI dapat disembunyikan untuk role tertentu (catatan: ini lapisan UX saja, **bukan** pengamanan server).

## 9. Bahasa (i18n)

Aplikasi **dwibahasa: Indonesia + Jepang**, berlaku di **semua halaman**.

- **Library:** `vue-i18n` (untuk Vuetify 3) + locale pack bawaan Vuetify (`id`, `ja`).
- **Struktur:** `src/i18n/locales/id.json` & `ja.json`; semua teks UI lewat key, tanpa string hardcode.
- **Pemilih bahasa:** di app bar; pilihan disimpan di `localStorage` (dan/atau profil staff). Default: `id`.
- **Label dari database:** karena judul halaman dan beberapa master tersimpan di DB, sediakan kolom dwibahasa (`titleId`/`titleJa`, `namaId`/`namaJa`, `roleNameId`/`roleNameJa`) — lihat §3.
- **Format:** tanggal & angka mengikuti locale aktif (`Intl`/`toLocaleDateString`).
- **Ekspor (Excel/PDF):** judul kolom & label mengikuti bahasa yang dipilih saat ekspor.

## 10. Deployment

Target: **Vercel**.

- **Frontend:** Vuetify 3 (Vite) sebagai SPA statis → Vercel.
- **Backend:** Node API sebagai Vercel Serverless Functions.
- **Database:** Supabase managed (pooler) + MySQL mancation (dapat diakses publik).

Catatan penting untuk Vercel:
- **Koneksi MySQL di serverless:** buat pool `mysql2` di scope modul (bukan per-request) agar dipakai ulang antar-invocation; `connectionLimit` kecil (1–3) supaya tidak menghabiskan `max_connections` MariaDB saat concurrency naik.
- **Timeout:** hormati batas durasi fungsi Vercel (default 10s, dapat dinaikkan); terapkan timeout query ~5s + fallback snapshot (§16).
- **Region:** pilih region Vercel terdekat ke MySQL & pengguna (mis. `sin1`).
- **Supabase dari serverless:** gunakan Supabase pooler (port 6543).
- **Secret:** MySQL + Supabase via environment variables Vercel; jangan commit.
- **Skala:** 1 cabang, 3 kelas, 44 peserta → beban kecil, Vercel memadai.
- **Fallback:** bila koneksi MySQL bermasalah di serverless, pindahkan hanya API ke host always-on (Railway/Fly/VPS) dan biarkan frontend tetap di Vercel.

## 11. Dashboard Statistik

**Status:** ditetapkan sebagai **halaman baru** (tidak ada di draft awal).

**Tujuan:** ringkasan cepat kondisi akademik cabang JOY (peserta, kelas, nilai, sikap, kehadiran) dalam satu halaman, dengan filter **periode (bulan)** dan **kelas**.

**Widget yang diusulkan**

Kartu KPI (mengikuti filter aktif):
1. Jumlah peserta aktif — `peserta aktif` = peserta pada kelas berstatus `aktif`; dihitung live dari mancation (per kelas atau total JOY).
2. Jumlah kelas aktif.
3. Rata-rata nilai ujian (`nilaiAVG`) per kelas & total — dihitung dari **semua baris** penilaian pada periode (bukan rata-rata dari rata-rata peserta).
4. Rata-rata skor sikap (§4, basis 75).
5. Rasio kehadiran bulan berjalan (§5).

Grafik:
6. Tren rata-rata nilai ujian per bulan (line).
7. Distribusi nilai ujian — bucket A ≥ 90 / B ≥ 75 / C ≥ 60 / D < 60 (bar).
8. Rasio kehadiran per kelas (bar) — memakai rumus §5.
9. Kejadian sikap positif vs negatif per bulan (stacked bar).
10. Distribusi grade kaiwa A/B/C per kelas (stacked bar) — **per peserta (grade terakhir)**, terpisah dari nilai ujian.
11. Tren poin kaiwa per bulan (line; A = 3, B = 2, C = 1) dan jumlah sesi kaiwa per bulan (bar) — terpisah dari nilai ujian.

Tabel perhatian (watchlist):
12. Peserta dengan skor sikap terendah.
13. Peserta dengan rasio kehadiran terendah (mis. < 75%).

**Catatan penting**
- Dashboard **tidak menyimpan data baru** — semua dihitung dari tabel yang sudah ada (`nilai_ujian`, `nilai_sikap`, `absensi`) + roster live mancation.
- Bila MySQL mancation down, KPI berbasis roster memakai snapshot fallback (§16) dan ditandai "data mungkin tidak terbaru".
- Akses halaman mengikuti model §8 (per-halaman). **Kebijakan:** role `viewer` (staf Jepang) diberi akses ke Dashboard; akses sebenarnya tetap ditetapkan admin lewat UI Role & Akses.
- Termasuk halaman baru `Dashboard` pada tabel `page` (bar `main`) dengan label dwibahasa (`titleId`/`titleJa`, §9).

**Keputusan (2026-10-27)**
- **MVP = semua widget sekaligus** (5 KPI + 6 grafik + 2 tabel watchlist) pada fase pertama.
- **Definisi "kelas aktif":** `kelas.status = 'aktif'`.
- **`viewer` boleh mengakses halaman Dashboard**; pemberian akses tetap diatur admin lewat UI Role & Akses (§8).
- **Library chart:** **ApexCharts** (`vue3-apexcharts`) — lihat `techStack.md` §6.
- Periode default (rekomendasi): bulan berjalan; rentang tren 12 bulan terakhir.

## 12. Halaman Progres Peserta & Tag Status Peserta

**Tujuan:** memudahkan manager melihat progres peserta per bulan (per kelas maupun per peserta) dan menentukan siapa yang akan dipanggil **interview dengan user Jepang**.

### 12.1 Halaman Progres Peserta (untuk manager)

Satu halaman, dua mode, dengan filter **periode (bulan)** + **kelas** + **tag**:

- **Mode per kelas:** jumlah peserta, distribusi tag, rata-rata nilai ujian, distribusi grade kaiwa (per peserta), tren poin kaiwa & jumlah sesi kaiwa, rata-rata skor sikap (§4), rasio kehadiran (§5), tren per bulan.
- **Mode per peserta:** tabel `nama / kelas / rata-rata nilai ujian / grade kaiwa terakhir / skor sikap / rasio kehadiran / tag`; klik baris → detail tren bulanan peserta.
- **"Grade kaiwa terakhir"** dihitung **di dalam periode yang sedang difilter** (§13.1).
- **Kandidat interview:** ditentukan dari **tag** `siap_interview` (bukan perhitungan ambang). Manager menyaring daftar lewat filter tag, lalu **admin** mengubah tag memakai tombol status.

**Keputusan (2026-10-27)**
- Manager **hanya melihat/menyaring** (tanpa aksi tulis, tanpa "usulan"); penentuan kandidat lewat filter + ekspor, lalu admin yang men-set tag.
- **Kelayakan interview tidak dihitung** — hanya berupa **tombol perubahan tag** (3 tombol: `standar` / `berkembang` / `siap_interview`) yang aktif hanya untuk admin.
- Halaman ini **tidak menyimpan data baru** — dihitung dari `nilai_ujian`, `nilai_sikap`, `absensi` + roster live mancation.

### 12.2 Tag Status Peserta

- Field baru: `peserta.statusTag` dengan nilai `standar` | `berkembang` | `siap_interview`, default **`standar`**; label dwibahasa ID/JP (§9).
- Disimpan pada baris `peserta` internal. Karena identitas peserta live dari mancation, baris `peserta` dibuat saat membuka kelas (§3 catatan).
- **Hak ubah:** **hanya role `admin`**. Ditegakkan lewat **guard endpoint** `requireRole('admin')` (pengecualian bisnis yang eksplisit), bukan lewat model akses per-halaman (§8). UI menyembunyikan kontrol ubah tag untuk non-admin (lapisan UX, bukan pengamanan).
- **Arti status:** `standar` = baru mulai belajar; `berkembang` = sedang menuju siap mensetsu; `siap_interview` = siap mensetsu.
- **Label dwibahasa (usulan Jepang):** `standar` → 学習開始, `berkembang` → 面接準備中, `siap_interview` → 面接可能 (dapat disesuaikan saat implementasi berkas i18n).
- **Riwayat:** setiap perubahan dicatat di `peserta_status_log (pesertaId, statusTag, changedBy, changedAt, note)` — karena ini aksi khusus dan perlu jejak audit.
- **UI:** tombol perubahan tag (3 status) ditampilkan pada halaman Progres Peserta dan/atau Data Peserta, **aktif hanya untuk admin**.

## 13. Penilaian Kaiwa

**Konsep:** penilaian kaiwa (percakapan peserta dengan sensei) — alurnya mirip penilaian ujian, tetapi hasilnya **kualitatif berupa grade**, bukan angka.

**Keputusan (2026-10-27)**
- **Tabel terpisah** `nilai_kaiwa` (tidak menumpang `nilai_ujian`).
- **Nilai berupa grade `A` / `B` / `C`**, bukan angka 1–100 → **tidak ada** pola tunggal/variabel dan tidak ada `nilaiAVG`.
- **Halaman rekap terpisah:** "Rekap Nilai Kaiwa" — struktur mirip Rekap Nilai Ujian (filter peserta/periode/kelas + CRUD).
- **Ditampilkan terpisah** dari nilai ujian pada Dashboard (§11) dan Progres Peserta (§12); yang ditampilkan adalah **distribusi grade A/B/C**, bukan rata-rata.
- **Penilai:** `penilaiId` → `staff` (sensei); ada `description` untuk catatan hasil kaiwa.
- Label grade dwibahasa ID/JP (§9).

**Keputusan tambahan (2026-10-27)**
- Grade **hanya A/B/C** (tidak ada D atau grade lain).
- **Banyak baris per periode diperbolehkan** — kaiwa renshuu berlangsung setiap hari dan sensei berhak memberi nilai kapan saja (satu baris = satu penilaian).
- **Tanpa `codeKaiwa`.**
- Karena banyak baris per periode, tampilan ringkas memakai **grade terakhir** dan/atau **distribusi** grade, bukan satu nilai tunggal per periode.

### 13.1 Perhitungan & Tampilan Kaiwa

Karena kaiwa punya banyak baris per periode, dipakai **tiga metrik terpisah** (jangan dicampur):

| Metrik | Basis | Kegunaan |
|---|---|---|
| Distribusi grade kelas | **1 peserta = 1 nilai** — grade terakhir pada periode | Posisi terkini kelas → bahan keputusan interview |
| Tren perkembangan | **semua baris** — rata-rata poin ordinal (`A=3`, `B=2`, `C=1`) per bulan | Melihat naik/turun kemampuan |
| Aktivitas kaiwa | **jumlah baris** (sesi penilaian) per bulan | Menunjukkan kerajinan renshuu |

Aturan:
- **"Grade terakhir"** = baris dengan `tanggalKaiwa` terbaru; bila satu hari ada beberapa baris, ambil `id`/timestamp terbesar.
- Peserta **tanpa kaiwa** pada periode tersebut masuk kategori **"belum ada nilai"** — **bukan** dihitung sebagai `C` dan ditampilkan `-`.
- Pemetaan `A=3, B=2, C=1` hanya untuk perhitungan tren di tampilan; **tidak disimpan** di database.
- Distribusi kelas memakai basis per peserta (bukan per baris) agar peserta yang sering renshuu tidak mendominasi grafik.

## 14. Fitur Tambahan yang Disetujui

Hasil penelusuran alur end-to-end (2026-10-27).

### 14.1 Peserta Luar Kelas & Alumni

**Kloning data dibatalkan.** Alumni dan peserta yang tidak berada di kelas ditangani lewat halaman ini, bukan dengan menyalin seluruh data mancation.

- Halaman terpisah (bar `main`), **isi kolom sama seperti Data Peserta**, untuk peserta yang **tidak terdaftar di kelas JOY** (keluar, alumni, cuti).
- **Pengisian murni manual:** menambah data dengan memasukkan `mancationAkunId`; sistem menarik identitas dari mancation.
- **Validasi:** akun wajib ada di `t_akun` dan ber-`cli_id = 9`; `mancationAkunId` unik → duplikat ditolak.
- Penanda: `peserta.sumber = 'manual'` + `keteranganLuarKelas` (`keluar` / `alumni` / `cuti`) + `alasan`.
- **Hak tambah:** mengikuti akses halaman (tidak ada pembatasan tambahan).
- **Perpindahan otomatis:** bila akun tersebut masuk kelas JOY (139/142/144), baris berpindah menjadi `sumber='roster'` → muncul di Data Peserta.
- **Konteks data:** 2.011 akun cli 9 ber-`id_kelas = 0` dan ada kelas `149 (cuti)` — terlalu banyak untuk ditampilkan otomatis, karena itu pengisian dilakukan manual.

### 14.2 Rapor peserta (PDF)
- Per peserta per periode: nilai ujian (+ `nilaiAVG`), grade kaiwa, skor sikap, rasio kehadiran, dan tag status.
- Memakai `pdfmake` server-side (sudah diputuskan) dengan opsi ekspor Excel; bilingual ID/JP.

### 14.3 Akun, sandi & notifikasi staff
- Staff dapat mengganti sandi sendiri; admin dapat mereset sandi staff. Halaman `Akun & Notifikasi Staff` (config) juga menampung **opt-in push notification** (§14.8).

### 14.4 Pengaturan aplikasi
- Tabel `settings`: KKM, batas label A–D, periode default, rentang tren (bulan), bobot default sikap. Halaman `Pengaturan` (config).

### 14.5 Audit log & pengingat absensi
- `audit_log` merekam perubahan penting (nilai, absensi, sikap, kaiwa, tag, pengaturan): siapa, kapan, entitas, nilai lama → baru. Halaman `Riwayat Aktivitas` (config).
- **Pengingat absensi:** penanda/notifikasi bila absensi kelas pada hari itu belum diisi — mendukung disiplin sensei.

### 14.6 Enrollment & status peserta diatur mancation
- Enrollment peserta–kelas **tidak** dikelola JOYdata; ditampilkan dari mancation.
- Status peserta (`在籍中`/`休学中`/`退学`/`在籍中＆合格`/`卒業`) berasal dari mancation → `peserta.statusMancation`.

### 14.7 PWA (mobilitas)
- **Tujuan:** sensei dapat membuka JOYdata dari HP tanpa memasang dari app store — input absensi harian, nilai, dan kaiwa langsung dari kelas.
- **Implementasi:** `vite-plugin-pwa` (Workbox) → manifest + service worker; **app shell** di-cache agar terbuka cepat/di sinyal lemah; dapat dipasang (*Add to Home Screen*) dengan `display: standalone`.
- **Cache strategi:** hanya **aset statis** yang di-cache; **respons API tidak di-cache** agar data tidak basi.
- **Offline:** kerangka aplikasi tetap terbuka, tetapi data tetap butuh jaringan (Supabase/MySQL).
- **Fase 2:** *Background Sync* untuk menampung submit absensi saat sinyal buruk lalu mengirim ulang — aman karena `UNIQUE(pesertaId, kelasId, tanggalAbsensi)` membuat submit idempoten (upsert).
- **Catatan iOS:** instalasi manual lewat Safari → *Add to Home Screen*; push hanya berjalan bila sudah terpasang (iOS 16.4+).

### 14.8 Push notification
- **Tujuan:** pengingat operasional dan pemberitahuan aktivitas kepada staff.
- **Mekanisme:** **Web Push (VAPID)** + service worker; langganan per perangkat disimpan di `push_subscription`.
- **Opt-in wajib** (izin browser tidak dapat otomatis); diatur di halaman `Akun & Notifikasi Staff`.
- **Jenis notifikasi (semua):**
  1. Pengingat **absensi belum diisi**.
  2. Pengingat **nilai ujian / kaiwa belum diinput** untuk sesi yang sudah lewat.
  3. **Rapor/ekspor selesai** diproses.
  4. **Pemberitahuan sistem** (mis. pengaturan diubah admin).
- **Penjadwalan:** **Vercel Cron dua kali sehari** — **08:00** (pengingat) dan **16:00** (penagih), zona **Asia/Jakarta**; hari libur/akhir pekan dapat dikecualikan memakai kalender `t_harilibur` mancation.
- **Bahasa & tautan:** payload mengikuti preferensi bahasa penerima (ID/JP); klik notifikasi membuka halaman relevan (deep link, mis. wizard absensi dengan tanggal & kelas terisi).
- **Fallback:** badge/indikator di dalam aplikasi tetap ada.
- **Idempotensi:** setiap pengiriman dicatat di `push_log` dengan `UNIQUE(jenis, tanggal, staffId)` — cron yang di-retry atau dijalankan dua kali sehari tidak akan mengirim notifikasi ganda.
- **Batasan:** izin bisa ditolak; langganan kedaluwarsa (respons `410 Gone`) dibersihkan otomatis.

## 15. Pemetaan Data 名簿 ↔ mancation (inspeksi 2026-10-27)

Hasil pemeriksaan `docs/datamiyata.xlsx` (form 名簿) terhadap database mancation.

### 15.1 Pemetaan kolom

| Kolom 名簿 | Sumber mancation | Status |
|---|---|---|
| 番号 Nomor | — | turunan (urutan tampilan) |
| 写真 Foto | `t_datapeserta.data_foto_db` | ada; **hanya 17 dari 44** peserta JOY punya baris `t_datapeserta` |
| 名前 Nama | `t_akun.akun_nama` | ada |
| 生年月日 Tanggal lahir | `t_datapeserta.data_tl` | ada (17/44) |
| 結婚 Status menikah | `t_datapeserta.status_pernikahan` | ada |
| 子供 Anak | `t_datapeserta.anak` | ada |
| 宗教 Agama | `t_datapeserta.data_agama` (FK) | ada |
| 最終学歴 Pendidikan akhir | `t_datapeserta.p_terakhir` | **ragu** — isinya seperti level bahasa Jepang ("hiragana", "belum pernah"), bukan pendidikan |
| 出身 Daerah asal | `t_datapeserta.data_prof` / `data_kota` / `data_kec` / `data_des` | ada |
| 入学日 Tanggal masuk | `t_akun.tgl_masuk` | **KOSONG** (`0000-00-00`) → harus disediakan JOYdata |
| クラス名 Nama kelas | `t_kelas.kel_nama` via `t_akun.id_kelas` | ada |
| 現状 Status saat ini | kandidat `t_akun.akun_stat` (hanya 4 nilai: 0–3) | **tidak cocok** — 名簿 butuh 6 status |
| 合格日 Tgl lulus ujian | — | **TIDAK ADA** (`t_hasiltest` tanpa kolom tanggal) → JOYdata |
| 内定企業名 Perusahaan naitei | `t_akun.old_comp` → `t_accepting_comp` | master ada, tetapi **0 terisi** untuk JOY |
| 内定した業務 Jenis pekerjaan | — | **TIDAK ADA** → JOYdata |
| 勤務地 Lokasi kerja | `t_prefecture` (47 prefektur) + `t_accepting_comp.comp_pref` | master ada; penghubung ke peserta belum jelas |
| 就業開始予定日 Rencana mulai kerja | `t_pengpeserta.start_work` | praktis kosong (2 baris, `0000-00-00`) |
| 自由記入欄 Kolom bebas | `t_akun.ket` | ada tetapi kosong |

### 15.2 Kesimpulan

- **Tersedia di mancation:** nama, tanggal lahir, status menikah, anak, agama, daerah asal, nama kelas, foto (sebagian).
- **Tidak tersedia/tidak lengkap → disediakan JOYdata:** `入学日`, `合格日`, `内定企業名`, `内定した業務`, `勤務地`, `就業開始予定日`, `最終学歴` (pemetaan ragu), `自由記入欄`.
- Kolom tersebut disimpan di `peserta_penempatan` (§3): `tanggalLulusUjian`, `perusahaanNaitei`, `jenisPekerjaan`, `prefekturId`, `rencanaMulaiKerja`; sedangkan `tanggalMasuk` ada di `peserta`.
- **Kelengkapan data:** 27 dari 44 peserta JOY **belum punya baris `t_datapeserta`** di mancation → data identitas memang perlu dilengkapi (lihat Peserta Luar Kelas, §14.1).
- **Perlu klarifikasi lanjutan:** arti `t_akun.akun_stat` (4 nilai vs 6 status 名簿) dan kolom mana yang benar-benar menyimpan 最終学歴.

## 16. Yang Masih Terbuka (perlu diputuskan)

Sudah terjawab 2026-10-27 (dikeluarkan dari daftar terbuka):
- ~~Identifikasi kelas cabang JOY~~ → `mancationClassId` **139, 142, 144** disimpan pada tabel `kelas` (§3/§6).
- ~~Fallback live query~~ → *live-first + cache-on-read snapshot* + banner "data mungkin tidak terbaru" + TTL 60s + sync roster saat buka kelas.
- ~~Ekspor rekap~~ → Excel (server-side, `exceljs`) + PDF (server-side, `pdfmake`), mencakup Rekap Nilai Ujian, Rekap Nilai Kaiwa, Rekap Absensi, dan Rekap Nilai Sikap.
- ~~Reachability MySQL~~ → dapat diakses publik.
- ~~Model Nilai Sikap~~ → internal penuh, tanpa data penilaian dari mancation; tetap log kejadian + bobot (§4).
- ~~Role~~ → `admin`, `manager`, `sensei`, `viewer` + matriks akses (§8).
- ~~Deployment~~ → Vercel (§10).
- ~~Diferensiasi akses antar-role~~ → halaman per role diatur lewat UI Role & Akses; seed hanya `admin` = semua halaman, role lain dibiarkan kosong (§8).
- ~~Bahasa~~ → dwibahasa Indonesia + Jepang di semua halaman via `vue-i18n` (§9).
- ~~Halaman Progres Peserta~~ → halaman manager, mode per kelas & per peserta, filter tag (§12.1).
- ~~Tag status peserta~~ → `peserta.statusTag` (standar/berkembang/siap_interview), ubah **hanya admin** via guard endpoint, dengan riwayat `peserta_status_log`; kelayakan interview = tombol ubah tag, bukan skor otomatis (§12.2).
- ~~Penilaian Kaiwa~~ → tabel terpisah `nilai_kaiwa`, grade A/B/C saja, banyak baris per periode (setiap kaiwa renshuu), tanpa `codeKaiwa`, halaman rekap sendiri, ditampilkan terpisah dari nilai ujian (§13).
- ~~Arti & label tag~~ → `standar` = baru mulai belajar, `berkembang` = menuju siap mensetsu, `siap_interview` = siap mensetsu; label JP: 学習開始 / 面接準備中 / 面接可能 (§12.2).
- ~~Basis distribusi grade kaiwa~~ → **per peserta (grade terakhir)**; tren poin ordinal & jumlah sesi ditampilkan sebagai metrik terpisah (§13.1).
- ~~Rapor peserta (PDF)~~ → rapor per peserta per periode, `pdfmake` + opsi Excel (§14.2).
- ~~Akun & sandi staff~~ → ganti sandi sendiri + reset oleh admin (§14.3).
- ~~Pengaturan aplikasi~~ → tabel `settings` + halaman Pengaturan (§14.4).
- ~~Audit log & pengingat absensi~~ → `audit_log` + halaman Riwayat Aktivitas + penanda absensi belum diisi (§14.5).
- ~~Enrollment & status peserta~~ → diatur di mancation; `kelas_peserta` **dihapus** dari skema (§14.6).
- ~~Pemetaan 名簿 ↔ mancation~~ → hasil inspeksi lengkap di §15.
- ~~Kloning data peserta~~ → **dibatalkan**; alumni & peserta luar kelas dicatat manual lewat halaman Peserta Luar Kelas (§14.1).
- ~~PWA & push notification~~ → aplikasi dapat dipasang di HP (PWA, `vite-plugin-pwa`) dan mengirim pengingat via Web Push + Vercel Cron (§14.7, §14.8).

Masih terbuka:
- **Arti kolom `t_akun.akun_stat`** (4 nilai: 0–3) vs 6 status `現状` pada 名簿 — perlu klarifikasi/verifikasi sebelum dipakai sebagai `peserta.statusMancation`.
- **Kolom sumber `最終学歴`** — `t_datapeserta.p_terakhir` isinya mencurigakan (level bahasa Jepang), perlu dipastikan.
- **Penyedia data penempatan** (`合格日`, `内定企業名`, `内定した業務`, `勤務地`, `就業開始予定日`): diisi manual di JOYdata, atau diisi di mancation lalu dibaca live? (§15.2)
- _(selain di atas tidak ada keputusan desain tersisa.)_ Seed tabel `page`/`role`/`access`, berkas `i18n`, dan teks label Jepang dilakukan saat implementasi.



