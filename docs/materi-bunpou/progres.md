# Progres implementasi Materi Bunpou

Branch `materi-bunpou` (worktree `.worktree/materi-bunpou`), di-merge ke `main` 2026-11-21. Rencana: [plan.md](plan.md) · spesifikasi
kode: [spek-kode.md](spek-kode.md).

## Status per fase (2026-11-21)

| Fase | Status | Catatan |
|---|---|---|
| F0 Persiapan | ✅ sebagian | Q1–Q7 memakai jawaban bawaan. KB `docs/kb-dokkai/` **tidak** di-commit (Q7 menunggu izin); agen membacanya dari checkout `main`. `node_modules` worktree = junction ke `main` |
| F1 Katalog | ✅ | 163 pola: N5 66 · N4 Minna II 78 · N4 modul saja 19. Modul #1–104 tercakup tepat sekali. Laporan + hal yang perlu dicek: [katalog.md](katalog.md) |
| F2 Halaman | ✅ | Layar cari + layar presentasi, API, halaman `materi-bunpou` di menu (id 24, admin/manager/sensei), i18n id/ja, tes |
| F3 Pilot isi | ✅ menunggu tinjauan sensei | ～てください · ～ています · ～と · ～たら (N5), ～ば · ～なら (N4), masing-masing 12 slide, status `draf` |
| F4 Skill `tulis-materi-bunpou` | ⏳ | setelah gaya pilot disetujui |
| F5 Produksi isi | ⏳ | 157 pola masih `belum ditulis` |
| F6 / F7 | ⏳ opsional | |

## Cara kerja yang dipakai

- **Kode:** dua agen Sonnet (server, klien) menulis kode paralel dari `spek-kode.md`. Agen Opus meninjau kode; temuan
  (5 bug + ±12 catatan kecil, termasuk regex lookbehind yang bisa mematikan bundel di Safari < 16.4, keluar dari layar penuh
  saat membuka pola terkait, dan input IME) dikembalikan ke agen Sonnet dan diperbaiki.
- **Data:** agen Opus menyusun katalog dan menulis isi pilot. Peninjau buta Opus menerjemahkan 168 kalimat Jepang tanpa
  melihat terjemahan penulis, lalu menilai penjelasan. Hasil: tidak ada kalimat yang salah tata bahasa; 8 perbaikan wajib
  (sel "Inti" ～なら di tabel bersama, contoh ～と yang bentuknya sama dengan pola yang dilarang) dan saran lain sudah diterapkan.
- **Cek visual:** Playwright pada hasil build (`vite preview`), semua `/api` dijawab dari fixture yang dihitung dengan fungsi
  server. Diperiksa: 72 slide dalam keadaan tersembunyi dan terbuka (tidak ada yang meluber, padding bawah tetap utuh), layar
  cari, mode baca, HP 390 px (tanpa gulir horizontal), halaman 404.

## Hasil pemeriksaan terakhir

- `npm test`: 182 lolos (156 lama + 17 materiBunpou + 9 cariBunpou).
- `npm run build`: lolos; tidak ada regex lookbehind di bundel.
- Cek visual: 6 materi × 12 slide tanpa luberan; lebar halaman HP 390 px.

## Keputusan teknis yang muncul saat implementasi

- **Auto-fit slide:** isi nyata lebih padat daripada mockup, jadi `KanvasSlide` mencari `--u` terbesar di [0,7; 1] yang
  muat (pencarian biner; tinggi teks tidak linear karena baris ikut berkurang). Patokan "muat" menyertakan padding bawah.
- **Makna:** jumlah kolom = jumlah makna (3 makna = 3 kolom).
- **Tabel Bandingkan di HP:** bergulir di dalam kartunya sendiri, halaman tidak ikut melebar.
- **Pencarian:** `kataKunci` katalog diberi bobot sebelum `padanan` isi, supaya "kalau" tetap menaruh ～たら di urutan pertama.
- **Katalog:** ～までに dipindah ke Minna Bab 17 (N5); tabel Japan Foundation tidak mencantumkannya, jadi mohon dicocokkan
  dengan buku.

## Perlu dicek user/sensei

1. **Gaya isi pilot:** buka keenam presentasi (lihat bagian "Cara mencoba"). Ini yang akan ditiru oleh ±157 materi lain.
2. **Katalog:** 18 butir di [katalog.md § Perlu dicek](katalog.md#perlu-dicek), misalnya modul #1 masuk ke ～ようと思う (Bab 31),
   bukan ～たい.
3. **Contoh tabel ～と** `このボタンを押すと、お湯が出ます` mirip bentuknya dengan kalimat Minna Bab 23 (kata kuncinya berbeda).
   Bila dianggap terlalu mirip, ganti.
4. **Q7:** commit KB ke `main`, karena skill F4 akan membacanya.

## Cara mencoba (lokal)

Worktree belum punya `.env` (file itu hanya ada di folder utama). Salin `.env` ke worktree, lalu `npm run dev`, login sebagai
admin/manager/sensei, dan buka menu **Materi Bunpou**. Saat server mulai, halaman ini otomatis ditambahkan ke DB beserta role
bawaannya. Di DB JSON lokal, urutan menu yang sudah ada tidak ikut bergeser (perilaku lama `engine.js`); di Supabase urutannya
diperbarui. Catatan: pemeriksaan di atas memakai hasil build + fixture, **belum** dengan server sungguhan dan login nyata.
