# Temuan dan rekomendasi untuk prompt dokkai

> **Status: belum ada kode yang diubah.** Tiap butir menunjuk bukti di file KB lain.
> **D1–D10 sudah diputuskan user (2026-11-20)** — D1–D8 sesuai rekomendasi, 工場 masuk N4, belum ada kelas N3. Aturan
> hasilnya: [17-aturan-final.md](17-aturan-final.md).

## Yang dibandingkan

| Bagian sistem | Lokasi | Isi |
|---|---|---|
| Prompt AI | [server/ai/dokkaiAi.js](../../server/ai/dokkaiAi.js) | `SISTEM` (aturan umum), `PANDUAN_LEVEL` (L1–L5), `PANDUAN_JLPT` (N5/N4/N3), `panduanModul` (N4 dari modul), `TOPIK_DOKKAI` |
| Validator AI | [server/domain/tesOnline.js](../../server/domain/tesOnline.js) `validasiBacaanAi` | 2–3 soal, tepat 3 opsi unik, furigana lengkap, kanji di luar volume → kana |
| Spesifikasi bank | `.claude/skills/generate-soal/references/` | `spesifikasi-soal.md`, `tingkat-N5.md`, `tingkat-N4.md` |

Catatan penting: **spesifikasi bank lebih rinci daripada prompt AI.** Bank tetap ditulis dengan tabel panjang karakter,
jenis pertanyaan per level, daftar tata bahasa lengkap, dan daftar periksa mutu; prompt AI hanya membawa versi
ringkasnya. Banyak rekomendasi di bawah pada dasarnya menyamakan prompt AI dengan spesifikasi bank, lalu menambah
temuan dari JLPT.

## A. Sudah sejalan dengan JLPT — pertahankan

1. Pertanyaan dan pilihan dalam bahasa Jepang (JLPT juga begitu).
2. Pengecoh "masuk akal tetapi jelas salah menurut bacaan … hal lain yang juga disebut di bacaan" — ini prinsip yang
   dipakai di **semua** 22 soal sampel ([02 § P](02-pola-soal-dan-pengecoh.md#p--teknik-pengecoh)).
3. Pilihan sejajar bentuknya; jawaban harus bisa dibuktikan dari bacaan.
4. N4: soal menguji pola tanpa menanyakan istilah tata bahasa — sama dengan C26 (借りる／貸す) dan C28 (～なければならない).
5. `pembahasan` berupa kutipan + arti: cocok untuk kunci parafrase sekalipun (lihat R4).

## B. Rekomendasi yang hanya mengubah teks prompt

| No | Temuan | Bukti | Usulan |
|---|---|---|---|
| R1 | `PANDUAN_LEVEL` menyebut jenis teks ("pengumuman", "surat, email, pesan") tanpa bentuknya. Di JLPT setiap memo/pengumuman/email punya **kalimat bingkai** dan penutup nama pengirim. | [01 § 4](01-format-dokkai-jlpt.md#4-ciri-yang-konsisten-di-semua-sampel) butir 1–2; [02 § jenis teks](02-pola-soal-dan-pengecoh.md#jenis-teks-dan-kalimat-bingkai) | Tambahkan tabel jenis teks + template bingkai, dan pemetaan jenis teks per level (usulan di 02). |
| R2 | `PANDUAN_LEVEL` tidak menyebut jenis pertanyaan per level (kecuali "simpulan" di L5) dan memakai jumlah kalimat, sedangkan spesifikasi bank memakai rentang karakter + jenis pertanyaan. Prompt AI tertinggal dari spesifikasi bank. | `tingkat-N5.md` tabel "Ciri tiap level" vs `PANDUAN_LEVEL` | Samakan `PANDUAN_LEVEL` dengan tabel tingkat-N5/N4, ditambah kode J dari 02 (mis. L3: alasan, urutan, "yang bisa diketahui"). |
| R3 | Prompt hanya memberi satu teknik pengecoh (detail lain di bacaan). | [02 § P](02-pola-soal-dan-pengecoh.md#p--teknik-pengecoh): 13 teknik dari sampel | Daftar 6–7 teknik paling berguna dengan satu baris contoh: P1 kebiasaan vs kali ini, P3 matriks, P4 arah tertukar, P6 benar-tapi-bukan-alasan, P7 urutan, P8 aturan dibalik, P9 angka/waktu. |
| R4 | Aturan "pilihan yang benar harus persis sesuai isi bacaan" mencegah kunci ganda, tetapi mendorong kunci = salinan kata teks, sehingga soal bisa dijawab dengan mencocokkan kata. JLPT sering memakai parafrase/konversi. | [01 § 4](01-format-dokkai-jlpt.md#4-ciri-yang-konsisten-di-semua-sampel) butir 5; K2–K3 | L1–L2: boleh menyalin. L3 ke atas: minimal satu soal per bacaan berkunci parafrase atau konversi (あした／あさって, kata umum ↔ khusus); `pembahasan` tetap mengutip kalimat asli + penalaran dalam kurung. |
| R5 | Soal "kenapa" di JLPT tidak selalu dijawab kalimat ～から; di L5 alasannya disimpulkan dari paragraf sebelumnya. | A30 (K4) | Untuk L5, izinkan soal どうして yang jawabannya disimpulkan dari 1–2 kalimat (sejalan dengan "simpulan" yang sudah ada). |
| R6 | Daftar tata bahasa N5 di prompt hanya 11 contoh boleh + 11 larangan. 27 pola N5 jlptsensei tidak disebut sama sekali, termasuk yang dipakai sampel resmi N5: ～に行く (見に行きました), ～がほしい, ～んです, penjelas kata benda pendek (見た えいが). | [03](03-tata-bahasa-n5.md) temuan 3; status ➖ | Ganti contoh di `PANDUAN_JLPT.N5` dengan daftar "boleh" dan "dilarang" yang lengkap, mengikuti spesifikasi bank + keputusan D1–D2. |
| R7 | Prompt N4 melarang ～ようにする dan ～させられる dengan label "pola N3", dan prompt N3 memakai keduanya sebagai contoh pola N3. jlptsensei: keduanya **N4**. Modul tidak memuatnya, tetapi **～ようにする diajarkan di Minna Bab 36** (kelas N4 memakai Minna II). | [04](04-tata-bahasa-n4.md) temuan 1; [05](05-tata-bahasa-n3.md); [11 § D8](11-sumber-pembanding.md) | N4: **～ようにする boleh**; ～させられる tetap dilarang dengan label "di luar kurikulum" (tidak ada di Minna maupun modul). N3: ganti contoh ～ようにする dengan pola N3 sungguhan (mis. ～ばかりでなく, ～さえ, ～に比べて). |
| R8 | Larangan N4 di prompt (9 contoh) lebih sedikit daripada di spesifikasi bank (20). | `PANDUAN_JLPT.N4` vs `tingkat-N4.md` "Tidak boleh"; [05](05-tata-bahasa-n3.md) kolom catatan | Tambahkan yang ada di spesifikasi bank: ～おかげで／せいで, ～だけでなく, ～さえ, ～に対して／に関して／に比べて, ～っぽい／がち／ぎみ. |
| R9 | Contoh di `SISTEM` — yang berlaku juga untuk N5 — memakai kata N4: 工場 (contoh pilihan) dan 用事 (contoh "用事があったからです"). AI cenderung meniru contoh. | [06](06-kosakata-n5.md) / [07](07-kosakata-n4.md): 工場, 用事 = N4 | Ganti contoh dengan kata N5 (mis. 会社{かいしゃ} untuk 工場, dan alasan seperti かぜを ひいたからです untuk 用事), kecuali D3 memutuskan kata kerja itu boleh. |
| R10 | Aturan "kosakata N5 saja" bertabrakan dengan `TOPIK_DOKKAI` (pabrik, asrama, sampah, kirim uang, kerja paruh waktu). Bank N5 yang ditulis dengan aturan serupa memakai 工場 61 kali, 先輩 14, 事務所 13, 昼休み 18 — semuanya N4. | [09](09-kosakata-bank-vs-daftar.md) | Tergantung D3: (a) daftar "kosakata kerja" yang boleh di N5 dikirim ke AI, atau (b) topik pemagang dipindah ke N4 dan topik N5 dibatasi pada yang bisa ditulis dengan kosakata N5. |
| R11 | Teks sedang JLPT lebih panjang daripada L5 JOYdata (N5 ±265–300 vs maks 165; N4 ±440 vs maks 250); prompt L5 = "5-7 kalimat". | [01 § 2](01-format-dokkai-jlpt.md#2-jumlah-panjang-dan-bentuk) | Tergantung D5. Batas validator (N5 800, N4 1200 karakter termasuk furigana) masih cukup untuk ±300 karakter. |

## C. Perlu perubahan kode (nanti, setelah disetujui)

| No | Ciri JLPT / kebutuhan | Yang perlu diubah |
|---|---|---|
| C1 | 4 pilihan jawaban | `SCHEMA` + `SISTEM` di dokkaiAi.js, `validasiBacaanAi` (tepat 3), tampilan runner & tinjau, bank 450+250 soal (3 opsi). |
| C2 | 1 soal untuk teks pendek, 3–4 soal untuk teks sedang | Validator (2–3 soal), bank (selalu 2), penilaian 1 poin/soal tetap aman. |
| C3 | Memo, email, pengumuman, tabel dengan baris baru (dan jenis 情報検索) | `FuriganaText.vue` belum memecah baris; bank belum memakai baris baru; prompt perlu format baris. |
| C4 | Garis bawah ①② untuk soal rujukan (J5) | Penanda di teks + tampilan. Alternatif tanpa kode: tulis 「…」① dan tanya「…」とありますが. |
| C5 | Gate kosakata otomatis | `data/vocab-n5.json` / `vocab-n4.json` bisa dipakai validator atau gate skill untuk **memperingatkan** kata N4 di bacaan N5 (seperti peringatan pola di gate skill). |
| C6 | Gate tata bahasa otomatis | `data/grammar-*.json` (dengan status) bisa menjadi sumber daftar boleh/dilarang di prompt dan gate, supaya prompt, spesifikasi bank, dan KB tidak berbeda-beda. |

## D. Keputusan (sudah diputuskan 2026-11-20)

| No | Pertanyaan | Pilihan | Bukti | Keputusan 2026-11-20 ([17](17-aturan-final.md)) |
|---|---|---|---|---|
| D1 | ～ので dan ～つもり di dokkai N5? | (a) tetap dilarang — ikut kurikulum (modul N4 #51 L2, #3 L1); (b) boleh — ikut JLPT/jlptsensei (N5 #58, #78) | [03](03-tata-bahasa-n5.md) temuan 1 | ✅ (a) tetap dilarang — Minna Bab 31/39, TRY! N4 |
| D2 | Pola N5 jlptsensei yang diajarkan modul N4 L1–L2 (～たことがある, ～すぎる, ～ほうがいい, ～なくてもいい, まだ～ていません, V方, Nにする) di dokkai N5? | (a) dihindari sampai N4; (b) boleh di N5; (c) boleh mulai L4/L5 N5 | [03](03-tata-bahasa-n5.md) temuan 5, kolom Modul N4 | ✅ Minna I boleh, Minna II hindari; ～なければなりません jadi boleh |
| D3 | Kosakata kerja pemagang (工場, りょう, 先輩, ごみ, 捨てる, アルバイト, 事務所, 昼休み) di dokkai N5? | (a) glosarium kecil yang diizinkan; (b) topik pemagang hanya di N4; (c) biarkan seperti sekarang | [09](09-kosakata-bank-vs-daftar.md) | ✅ (a) glosarium kata Minna Jilid I; **工場 masuk N4** (keputusan user) |
| D4 | Angka di bacaan | (a) tetap kanji (六時, 三百円); (b) angka Arab seperti JLPT (6時, 300円) | [01 § 4](01-format-dokkai-jlpt.md#4-ciri-yang-konsisten-di-semua-sampel) tabel tampilan | ✅ (b) angka Arab, kecuali 一つ／一人 dsb. — sampel JLPT + 公用文 |
| D5 | Panjang teks sedang | (a) L5 tetap; (b) L5 dinaikkan mendekati JLPT; (c) jenis baru "format JLPT" terpisah dari L1–L5 | [01 § 2](01-format-dokkai-jlpt.md#2-jumlah-panjang-dan-bentuk) | ✅ (b) N5 L5 ±150–250, N4 L5 ±250–450 karakter |
| D6 | 4 pilihan seperti JLPT (perlu C1) | ya / tidak | [01 § 2](01-format-dokkai-jlpt.md#2-jumlah-panjang-dan-bentuk) | ✅ tidak; tetap 3 pilihan, naikkan jumlah soal kode bernilai |
| D7 | Jenis teks memo/email/tabel dengan baris baru (perlu C3) | ya / tidak | [02 § yang belum bisa](02-pola-soal-dan-pengecoh.md#yang-belum-bisa-ditiru-joydata-tanpa-perubahan-kode) | ✅ ya, bertahap (baris baru dulu) |
| D8 | N4: 62 pola N4 jlptsensei yang tidak ada di modul dan tidak disebut (mis. ～そうだ "katanya", ～予定だ, ～ようだ, ～場合は) | (a) boleh sebagai pendukung; (b) dilarang; (c) pilih sebagian | [04](04-tata-bahasa-n4.md) temuan 2 | ✅ (c) kelompok A–C (Minna I/II) boleh, D hindari, E dilarang; ～ようにする boleh |

Untuk N3 ada rekomendasi tambahan R12–R16 dan dua keputusan lagi di [12-n3.md § 8–9](12-n3.md). D10 semula "belum ada kelas
N3", lalu **diubah user (2026-11-20): materi N3 ditambahkan** (kanji N3 di semua fitur, bank dokkai N3 50 soal per level);
D9 ikut berubah (ada volume kanji N3). Rencana: [implementasi/plan.md](implementasi/plan.md).

## E. Urutan kerja yang disarankan

1. User memutuskan D1–D8 (boleh sebagian; yang belum diputuskan tetap seperti sekarang).
2. Ubah teks prompt saja: R1–R9 (+ R10/R11 sesuai keputusan). Uji dengan membuat beberapa kode dokkai AI per level
   dan membandingkan hasilnya dengan sampel di 01.
3. Samakan spesifikasi bank (skill generate-soal) dengan prompt supaya bank dan AI memakai aturan yang sama.
4. Perubahan kode C1–C6 bila disetujui, satu per satu.
