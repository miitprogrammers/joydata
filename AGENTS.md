# Aturan untuk agen di repo ini

1. **Soal bintang** (`server/domain/bankSoal/bintang*.js`) hanya boleh ditambah lewat skill `.claude/skills/tulis-soal-bintang` (alur di
   [`docs/bunpou-adventure/spek-kode.md`](docs/bunpou-adventure/spek-kode.md) §8): penulis → gate mekanis →
   peninjau buta (menjawab tanpa kunci) → baru inject. Jangan menulis soal langsung ke berkas bank atau membuat dump markdown/skrip konversi.
2. **Jangan melonggarkan validator** (`server/domain/soalBintang.js`, `server/domain/aturanDokkai.js`) dan jangan mengubah tes agar konten lolos.
   Bila konten ditolak, perbaiki kontennya. Bila validator salah tangkap, perbaiki aturannya secara sempit dengan tes, dan lapor ke user.
3. **Jangan push ke `main` tanpa persetujuan user.** Push `main` men-deploy produksi di Vercel.
