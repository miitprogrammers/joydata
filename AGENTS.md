# Aturan untuk agen di repo ini

1. **Soal bintang** (`server/domain/bankSoal/bintang*.js`) hanya boleh ditambah, diubah, atau dihapus lewat skill
   `.claude/skills/tulis-soal-bintang` (alur di [`docs/bunpou-adventure/spek-kode.md`](docs/bunpou-adventure/spek-kode.md) §8):
   penulis → gate mekanis → peninjau buta (menjawab tanpa kunci) → baru inject. **Jangan menambah, mengedit, atau menghapus soal
   dengan tangan**, dan jangan membuat dump markdown atau skrip konversi.
2. **Perubahan berikut perlu persetujuan user SEBELUM diubah, juga bila dicurigai salah tangkap (false positive):**
   aturan validasi (`server/domain/soalBintang.js`, `server/domain/aturanDokkai.js`), harapan di tes, skrip skill
   (`.claude/skills/tulis-soal-bintang/scripts/`), dan konstanta/fungsi rilis di `server/domain/bunpouAdventure.js`
   (`MIN_VARIAN`, `BENAR_DIKUASAI`, `statusRilis`, `VOLUME_BUNPOU`, `tahapVolume`). Agen melaporkan kasusnya (soal, aturan,
   alasan) dan menunggu. Bila konten ditolak, perbaiki kontennya, bukan aturannya.
3. **`setujui-bintang.mjs`** (status `ditinjau`) dijalankan hanya bila user berkata bahwa sensei menyetujui soal-soal itu.
4. **Push ke `main` men-deploy produksi (Vercel) dan perlu persetujuan user.**
