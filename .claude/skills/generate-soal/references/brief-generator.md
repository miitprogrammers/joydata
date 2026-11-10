# Brief agen penulis soal (satu agen per level)

Satu agen menulis satu level. `scripts/brief.mjs --penulis` mengisi `{{…}}` di bawah dari `rencana.json` dan
menyimpan hasilnya ke `KERJA/prompt/gen-<level>.md`; teks itulah prompt agennya. Bagian di antara
`{{#MODUL}}…{{/MODUL}}` hanya ikut untuk tingkat yang punya modul bunpou (N4), `{{#TANPAMODUL}}…{{/TANPAMODUL}}`
hanya untuk yang tidak (N5).

---

Kamu menulis soal dokkai (membaca) bahasa Jepang dengan pola kalimat tingkat {{JLPT}} untuk bank soal aplikasi
JOYdata. Pesertanya calon pemagang Indonesia; soal ini dipakai untuk tes bernilai. Setelah kamu selesai,
naskahmu melewati gate mekanis dan lalu dijawab oleh peninjau independen yang tidak melihat kunci — soal yang
jawabannya tidak tunggal atau furigananya salah akan ditolak, jadi ketelitian lebih penting daripada kecepatan.

**Tugas:** tulis {{JUMLAH}} bacaan level {{LEVEL}} ("{{DESKRIPSI}}"), masing-masing 2 soal, dengan id
`{{IDAWAL}}` sampai `{{IDAKHIR}}`. Simpan sebagai array JSON (UTF-8) ke:

`{{KERJA}}/gen/{{LEVEL}}.json`

**Baca dulu, seluruhnya:**
- `{{SKILL}}/references/spesifikasi-soal.md` — bentuk data, furigana, mutu pertanyaan, topik.
- `{{SKILL}}/references/tingkat-{{JLPT}}.md` — tata bahasa yang boleh, kanji, panjang dan ciri level {{LEVEL}}.
{{#MODUL}}
- `{{KERJA}}/pola-{{LEVEL}}.md` — pola modul bunpou untuk level ini: dua pola yang ditugaskan ke tiap bacaan,
  penjelasan, rumus, dan contoh tiap pola fokus, pola level sebelumnya (boleh), pola level berikutnya (dilarang).
{{/MODUL}}
- `{{KERJA}}/contoh-{{LEVEL}}.json` — bacaan contoh dari bank. Samakan bentuk data dan mutu soalnya.
- `{{KERJA}}/judul-terpakai.txt` — judul yang sudah ada; jangan mengulang judul maupun ceritanya.
- `{{KERJA}}/referensi-furigana.txt` — cara baca yang dipakai bank; pakai bacaan yang sama untuk kata yang sama.

**Cara kerja:**
1. Susun dulu daftar {{JUMLAH}} topik yang berbeda-beda (lihat bagian Topik di spesifikasi) dan rencana kunci
   jawaban yang tersebar rata di indeks 0/1/2 tanpa pola.
{{#MODUL}}
   Untuk tiap bacaan, lihat dua pola tugasnya di `pola-{{LEVEL}}.md` dan pilih situasi yang membuat kedua pola
   itu muncul dengan wajar — jangan menulis ceritanya dulu lalu menempelkan polanya.
{{/MODUL}}
2. Tulis bacaannya. Untuk tiap soal, pastikan kamu bisa menunjuk kalimat di teks yang membuktikan jawabannya
   dan kalimat yang menggugurkan tiap pengecoh.
   Tulis filenya **per bagian, paling banyak 5 bacaan per panggilan alat**: Write array JSON yang sah berisi 5
   bacaan pertama, lalu tambahkan 5 bacaan berikutnya dengan Edit (ganti akhir bacaan terakhir sampai `]` dengan
   akhir itu + `,` + bacaan baru + `]`). Jangan menyusun draf bacaan di teks balasan dan jangan menulis seluruh
   level dalam satu panggilan: satu balasan dibatasi 32.000 token keluaran, dan balasan yang melebihinya
   menghentikan pekerjaanmu tanpa hasil. Perbaikan sesudahnya juga dengan Edit per bacaan.
{{#MODUL}}
   Pakai tiap pola dengan bentuk dan arti seperti di modul (lihat rumus dan contohnya), isi `bunpou` dengan nomor
   pola yang benar-benar muncul di teks (dua pola tugas wajib ada), dan buat minimal satu dari dua soal bertumpu
   pada pola fokus.
3. Rapikan kanji, lalu jalankan gate mekanis:
   `node "{{SKILL}}/scripts/rapikan.mjs" --kerja "{{KERJA}}" {{LEVEL}}`
   `node "{{SKILL}}/scripts/gate.mjs" --kerja "{{KERJA}}" {{LEVEL}}`
   `rapikan.mjs` menulis ulang file hasilmu (kata dengan kanji di luar volume yang dipelajari menjadi kana, urutan
   field dirapikan), jadi baca lagi filenya sebelum mengedit. Jalankan keduanya lagi setiap kali kamu mengubah
   file. Perbaiki semua ERROR sampai tertulis `HASIL {{LEVEL}}: LOLOS gate mekanis`.
4. Baca tiap PERINGATAN: perbaiki yang memang masalah (pola N3 ke atas, pola dari level berikutnya, teks terlalu
   mirip, pilihan benar terlalu panjang). Yang keliru deteksi boleh dibiarkan, sebutkan di laporanmu.
{{/MODUL}}
{{#TANPAMODUL}}
3. Jalankan gate mekanis:
   `node "{{SKILL}}/scripts/gate.mjs" --kerja "{{KERJA}}" {{LEVEL}}`
   Perbaiki semua ERROR, lalu jalankan lagi sampai tertulis `HASIL {{LEVEL}}: LOLOS gate mekanis`.
4. Baca tiap PERINGATAN: perbaiki yang memang masalah (pola tata bahasa di atas N5, teks terlalu mirip, pilihan
   benar terlalu panjang). Yang keliru deteksi boleh dibiarkan, sebutkan di laporanmu.
{{/TANPAMODUL}}
5. Periksa daftar FURIGANA BARU satu per satu: itu kata yang belum pernah dipakai bank, jadi tidak ada yang
   menjamin bacaannya selain kamu. Perhatikan perubahan bunyi pada angka dan penghitung.
6. Terakhir, baca ulang file hasilmu dari awal sebagai peserta: jawab tiap soal hanya dari teksnya. Kalau ada
   soal yang bisa dijawab tanpa membaca, atau dua pilihan sama-sama bisa benar, perbaiki, lalu jalankan gate lagi.
{{#MODUL}}
   Sekalian periksa hasil rapikan: kata yang jadi deretan kana panjang dan sulit dibaca lebih baik diganti kata
   lain, dan tiap nomor di `bunpou` harus bisa kamu tunjuk kalimatnya di teks.
{{/MODUL}}

**Batasan:**
{{#MODUL}}
- Hanya menulis `{{KERJA}}/gen/{{LEVEL}}.json`. Jangan mengubah file apa pun di repo, jangan membaca atau menulis
  folder `blind/` dan `review/`, jangan menjalankan skrip selain `rapikan.mjs` dan `gate.mjs`.
{{/MODUL}}
{{#TANPAMODUL}}
- Hanya menulis `{{KERJA}}/gen/{{LEVEL}}.json`. Jangan mengubah file apa pun di repo, jangan membaca atau menulis
  folder `blind/` dan `review/`, jangan menjalankan skrip lain.
{{/TANPAMODUL}}
- Jangan melonggarkan gate atau mengakali pemeriksaannya; kalau menurutmu gate keliru, laporkan.

**Laporan akhir (singkat):** jumlah bacaan dan sebaran kunci, hasil gate terakhir (jumlah error/peringatan),
peringatan yang sengaja dibiarkan beserta alasannya, dan furigana baru yang kamu sendiri kurang yakin.
