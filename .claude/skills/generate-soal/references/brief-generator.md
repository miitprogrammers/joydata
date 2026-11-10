# Brief agen penulis soal (satu agen per level)

Satu agen menulis satu level. `scripts/brief.mjs --penulis` mengisi `{{…}}` di bawah dari `rencana.json` dan
menyimpan hasilnya ke `KERJA/prompt/gen-<level>.md`; teks itulah prompt agennya.

---

Kamu menulis soal dokkai (membaca) bahasa Jepang tingkat N5 untuk bank soal aplikasi JOYdata. Pesertanya
calon pemagang Indonesia; soal ini dipakai untuk tes bernilai. Setelah kamu selesai, naskahmu melewati gate
mekanis dan lalu dijawab oleh peninjau independen yang tidak melihat kunci — soal yang jawabannya tidak
tunggal atau furigananya salah akan ditolak, jadi ketelitian lebih penting daripada kecepatan.

**Tugas:** tulis {{JUMLAH}} bacaan level {{LEVEL}} ("{{DESKRIPSI}}"), masing-masing 2 soal, dengan id
`{{LEVEL}}-{{MULAI}}` sampai `{{LEVEL}}-{{AKHIR}}`. Simpan sebagai array JSON (UTF-8) ke:

`{{KERJA}}/gen/{{LEVEL}}.json`

**Baca dulu, seluruhnya:**
1. `{{SKILL}}/references/spesifikasi-soal.md` — format, furigana, tata bahasa, ciri level, mutu pertanyaan.
2. `{{KERJA}}/contoh-{{LEVEL}}.json` — sepuluh bacaan terbaru level ini di bank. Samakan gaya dan tingkat sulitnya.
3. `{{KERJA}}/judul-terpakai.txt` — judul yang sudah ada; jangan mengulang judul maupun ceritanya.
4. `{{KERJA}}/referensi-furigana.txt` — cara baca yang dipakai bank; pakai bacaan yang sama untuk kata yang sama.

**Cara kerja:**
1. Susun dulu daftar {{JUMLAH}} topik yang berbeda-beda (lihat bagian Topik di spesifikasi) dan rencana kunci
   jawaban yang tersebar rata di indeks 0/1/2 tanpa pola.
2. Tulis bacaannya. Untuk tiap soal, pastikan kamu bisa menunjuk kalimat di teks yang membuktikan jawabannya
   dan kalimat yang menggugurkan tiap pengecoh.
3. Jalankan gate mekanis:
   `node "{{SKILL}}/scripts/gate.mjs" --kerja "{{KERJA}}" {{LEVEL}}`
   Perbaiki semua ERROR, lalu jalankan lagi sampai tertulis `HASIL {{LEVEL}}: LOLOS gate mekanis`.
4. Baca tiap PERINGATAN: perbaiki yang memang masalah (pola tata bahasa di atas N5, teks terlalu mirip, pilihan
   benar terlalu panjang). Yang keliru deteksi boleh dibiarkan, sebutkan di laporanmu.
5. Periksa daftar FURIGANA BARU satu per satu: itu kata yang belum pernah dipakai bank, jadi tidak ada yang
   menjamin bacaannya selain kamu. Perhatikan perubahan bunyi pada angka dan penghitung.
6. Terakhir, baca ulang file hasilmu dari awal sebagai peserta: jawab tiap soal hanya dari teksnya. Kalau ada
   soal yang bisa dijawab tanpa membaca, atau dua pilihan sama-sama bisa benar, perbaiki, lalu jalankan gate lagi.

**Batasan:**
- Hanya menulis `{{KERJA}}/gen/{{LEVEL}}.json`. Jangan mengubah file apa pun di repo, jangan membaca atau menulis
  folder `blind/` dan `review/`, jangan menjalankan skrip lain.
- Jangan melonggarkan gate atau mengakali pemeriksaannya; kalau menurutmu gate keliru, laporkan.

**Laporan akhir (singkat):** jumlah bacaan dan sebaran kunci, hasil gate terakhir (jumlah error/peringatan),
peringatan yang sengaja dibiarkan beserta alasannya, dan furigana baru yang kamu sendiri kurang yakin.
