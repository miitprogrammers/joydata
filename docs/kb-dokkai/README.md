# Knowledge base dokkai JOYdata

Bahan acuan untuk memperbaiki prompt pembuatan soal dokkai (`server/ai/dokkaiAi.js`) dan spesifikasi bank soal
(skill `generate-soal`). Disusun 2026-11-20.

> **Status:** knowledge base saja. Belum ada prompt atau kode yang diubah. Keputusan D1–D10 sudah diambil user
> (2026-11-20); **aturan yang berlaku dirangkum di [17-aturan-final.md](17-aturan-final.md)** — mulai baca dari sana bila
> ingin merevisi prompt. Latar belakang dan bukti: [10](10-temuan-dan-rekomendasi-prompt.md), [11](11-sumber-pembanding.md).

## Isi

| File | Isi | Dipakai untuk bagian prompt |
|---|---|---|
| [01-format-dokkai-jlpt.md](01-format-dokkai-jlpt.md) | Format bagian dokkai JLPT N5/N4 dan bedah 22 soal dari 3 sampel (ujian internal LPK, workbook resmi N5 & N4); catatan koreksi PDF ujian internal | `SISTEM`, `PANDUAN_LEVEL` |
| [02-pola-soal-dan-pengecoh.md](02-pola-soal-dan-pengecoh.md) | Katalog: 10 jenis pertanyaan (J), 13 teknik pengecoh (P), 4 bentuk kunci (K), jenis teks + kalimat bingkai, usulan pemetaan ke L1–L5 | `SISTEM` (aturan soal), `PANDUAN_LEVEL` |
| [03-tata-bahasa-n5.md](03-tata-bahasa-n5.md) | 84 pola N5 jlptsensei + arti Indonesia + status di aturan JOYdata + tumpang-tindih dengan modul N4 | `PANDUAN_JLPT.N5` |
| [04-tata-bahasa-n4.md](04-tata-bahasa-n4.md) | 132 pola N4 jlptsensei dipetakan ke modul "111 Bunpo N4"; pola modul yang tidak ada di daftar jlptsensei | `PANDUAN_JLPT.N4`, `panduanModul` |
| [05-tata-bahasa-n3.md](05-tata-bahasa-n3.md) | 182 pola N3 jlptsensei; ditandai yang disebut prompt sebagai larangan N4 / contoh N3 | larangan di `PANDUAN_JLPT.N4`, `PANDUAN_JLPT.N3` |
| [06-kosakata-n5.md](06-kosakata-n5.md) | 644 kata N5 jlptsensei | aturan "kosakata N5" |
| [07-kosakata-n4.md](07-kosakata-n4.md) | 571 kata N4 jlptsensei | aturan kosakata N4 |
| [08-kanji-n5-n4.md](08-kanji-n5-n4.md) | 80 + 167 kanji jlptsensei vs volume kanji JOYdata | `kanjiBoleh` (hanya pembanding) |
| [09-kosakata-bank-vs-daftar.md](09-kosakata-bank-vs-daftar.md) | Kata N4 yang terpakai di bank N5, dan kata di luar daftar di bank N4 | `TOPIK_DOKKAI`, aturan kosakata |
| [10-temuan-dan-rekomendasi-prompt.md](10-temuan-dan-rekomendasi-prompt.md) | Yang sudah sejalan, 11 rekomendasi prompt, 6 perubahan kode (nanti), 8 keputusan untuk user + rekomendasinya | — |
| [11-sumber-pembanding.md](11-sumber-pembanding.md) | Sumber pembanding untuk keputusan D1–D8: dokumen resmi JLPT, pedoman pemerintah Jepang, Minna no Nihongo (via Japan Foundation), Tanos/Bunpro/TRY!/Genki, Irodori & JFT-Basic, riset jumlah pilihan; bukti + rekomendasi per keputusan | semua |
| [12-n3.md](12-n3.md) | Bahasan N3: posisi N3 di JOYdata, format resmi (短文 150–200 · 中文 350 · 長文 550 · 情報検索 600 karakter), bedah 16 soal workbook resmi N3, ciri baru N3 (gaya biasa, catatan 注, pertanyaan pendapat/tema), katalog J11–J14 & P14–P16, rekomendasi R12–R16, keputusan D9–D10 | `PANDUAN_JLPT.N3`, `PANDUAN_LEVEL` |
| [13-kanji-n3.md](13-kanji-n3.md) | 369 kanji N3 (referensi user: rirekishobuilder) vs 370 kanji jlptsensei vs volume JOYdata — 142 kanji N3 tidak ada di volume | `kanjiBoleh` untuk kode N3 |
| [14-kosakata-n3.md](14-kosakata-n3.md) | 192 kata N3 jlptsensei (tidak lengkap; hanya contoh) | aturan kosakata N3 |
| [15-tata-bahasa-minna.md](15-tata-bahasa-minna.md) | 212 pola Minna no Nihongo per bab (Jilid I = tahap N5, Jilid II = tahap N4) dari tabel Japan Foundation, + indeks cepat pola → bab | acuan "pola yang sudah diajarkan" untuk `PANDUAN_JLPT.N5/N4` |
| [16-kosakata-minna.md](16-kosakata-minna.md) | 2.193 kata Minna edisi 2 per bab (kata + kana saja; ⚠️ hak cipta 3A, internal), kata kerja pemagang per bab, dan cek kosakata bank N5/N4 terhadap Minna | aturan kosakata, `TOPIK_DOKKAI`, D3 |
| [17-aturan-final.md](17-aturan-final.md) | **Aturan yang disepakati** (D1–D10): aturan umum, N5 (pola boleh/dilarang per bab, kosakata, panjang & jenis soal per level), N4, N3, dan daftar pekerjaan lanjutan L1–L7 | semua — acuan revisi prompt |
| [implementasi/](implementasi/plan.md) | **Rencana implementasi kode**: [plan.md](implementasi/plan.md) (fase F0–F7, temuan kode, risiko, file, definition of done, pertanyaan Q1–Q7) + spesifikasi teknis 01–05, rencana uji, log progres | — |
| [data/](data/) | Data mentah JSON (grammar, kosakata, kanji) + anotasi, `sumber.json`, dan `pembanding-tata-bahasa.json` (20 + 62 pola × Minna/Tanos/Bunpro/TRY!/Genki, dengan URL per sel) | untuk gate/prompt nanti |

## Sumber dan cara pengambilan

- **jlptsensei.com** (sumber yang diminta user). Halaman daftar grammar N5/N4/N3, kosakata N5/N4, dan kanji N5/N4
  diambil langsung (HTML, 30 halaman, jeda 1,5 detik; robots.txt mengizinkan). Jumlah baris hasil olahan **sama persis**
  dengan total yang tertulis di situs: grammar 84 / 132 / 182, kosakata 644 / 571, kanji 80 / 167. Isi daftar tidak
  diubah; arti Indonesia, status, dan pemetaan modul adalah tambahan KB ini.
- **Sampel soal resmi** yang disediakan jlptsensei: bagian reading **JLPT Official Practice Workbook** N5 dan N4 beserta
  lembar kunci resminya.
- **PDF "SOAL N5 VER.2"** (ujian internal LPK, lampiran user).
- **N3** (permintaan user): daftar kanji N3 dari [rirekishobuilder.com](https://rirekishobuilder.com/learn-japanese-kanji/jlpt-n3-kanji-pdf)
  (PDF 81 halaman, 369 kanji), daftar kanji (370) dan kosakata (192) N3 jlptsensei, 「N3 大問のねらい」 jlpt.jp, dan bagian
  reading **JLPT N3 Official Practice Workbook** + kunci resmi (lewat jlptsensei).
- **Sumber pembanding** (untuk keputusan D1–D8, lihat [11](11-sumber-pembanding.md)): dokumen resmi jlpt.jp (大問のねらい,
  perubahan jumlah soal 2020, FAQ, sampel 2009/2012/2018), pedoman 「公用文作成の考え方」 (2022), tabel pola Minna no Nihongo
  dari Japan Foundation, daftar kosakata Irodori, JFT-Basic, aturan pekerja asing (e-Gov, JITCO, ISA), daftar Tanos,
  Bunpro, TRY!, Genki, dan riset jumlah pilihan (Rodriguez 2005, Haladyna dkk. 2002, Shizuka dkk. 2006, Lee & Winke 2013).
- **Kode JOYdata** untuk pembanding: `server/ai/dokkaiAi.js`, `server/domain/tesOnline.js`,
  `server/domain/bankSoal/{bunpouN4,dokkaiN5,dokkaiN4}.js`, dan referensi skill `generate-soal`.

## Seberapa bisa dipercaya

- **Daftar jlptsensei bukan daftar resmi.** Sejak 2010 JLPT tidak menerbitkan daftar tata bahasa/kosakata per level;
  setiap situs membagi sedikit berbeda. Contoh: jlptsensei menaruh ～あとで di N4, padahal sampel resmi N5 memakainya.
  Urutan kekuatan bukti di KB ini: **dokumen & sampel resmi JLPT > kurikulum yang benar-benar diajarkan (Minna I/II,
  modul N4) > daftar pihak ketiga (jlptsensei, Tanos, Bunpro)**.
- **Data Minna**: pola per bab dari dokumen Japan Foundation (cukup kuat); kosakata per bab dari dataset pihak ketiga
  MinnaNoDS (perlu dicocokkan sensei dengan buku). Kosakata Minna adalah hak cipta 3A Corporation — file 16 hanya untuk
  pemakaian internal LPK.
- **Daftar kosakata jlptsensei tidak lengkap** (べんとう, にほんご, しょくじ tidak ada di N5 maupun N4). "Tidak ada di
  daftar" bukan berarti "di atas level"; "ada di daftar N4" adalah tanda yang cukup kuat bahwa kata itu bukan N5.
- Pemetaan jlptsensei N4 ↔ modul (file 04) dibuat manual karena penulisan polanya berbeda. Mohon dicek.
- Analisis kosakata bank (file 09) hanya menghitung rangkaian 2 kanji atau lebih; batasnya dijelaskan di file itu.

## Temuan utama (ringkas)

1. **Bentuk soal.** JLPT memakai kalimat bingkai ("…の机の上に、このメモがあります"), jenis teks yang bervariasi
   (memo, pengumuman, email, karangan, tabel), pengecoh yang selalu diambil dari teks itu sendiri (13 teknik), dan kunci
   yang sering berupa parafrase. Prompt AI belum menyebut semua ini. → [01](01-format-dokkai-jlpt.md), [02](02-pola-soal-dan-pengecoh.md)
2. **Prompt AI tertinggal dari spesifikasi bank**: rentang panjang, jenis pertanyaan per level, dan daftar tata bahasa
   lengkap hanya ada di spesifikasi bank. → [10 § B](10-temuan-dan-rekomendasi-prompt.md#b-rekomendasi-yang-hanya-mengubah-teks-prompt)
3. **N5:** ～ので dan ～つもり dilarang di JOYdata, padahal N5 di jlptsensei (keduanya diajarkan modul N4). Prompt diam
   soal 27 pola N5, termasuk ～に行く, ～がほしい, ～んです yang dipakai sampel resmi N5. → [03](03-tata-bahasa-n5.md)
4. **N4/N3:** ～ようにする dan ～させられる dilabeli "N3" di prompt, padahal N4 di jlptsensei. 62 pola N4 jlptsensei
   tidak ada di modul dan tidak disebut aturan mana pun. → [04](04-tata-bahasa-n4.md)
5. **Kosakata:** 工場 (N4) muncul 61 kali di bank N5; topik pemagang di `TOPIK_DOKKAI` hampir mustahil ditulis dengan
   kosakata N5. Contoh di `SISTEM` sendiri memakai 工場 dan 用事 (N4). → [09](09-kosakata-bank-vs-daftar.md)
6. **Panjang & jumlah:** teks sedang JLPT (N5 ±265–300, N4 ±440 karakter) lebih panjang daripada L5 JOYdata; JLPT
   memakai 4 pilihan dan 1–4 soal per teks, JOYdata 3 pilihan dan selalu 2 soal. → [01 § 2](01-format-dokkai-jlpt.md#2-jumlah-panjang-dan-bentuk)
7. **Kanji:** volume N5 JOYdata (405 kanji) mencakup semua 80 kanji N5 jlptsensei; 曜, 京, 字, 洋, 漢 tidak ada di volume
   mana pun (月曜日 selalu jadi げつようび). → [08](08-kanji-n5-n4.md)
8. **N3:** hanya lewat AI (tanpa bank, tanpa modul). Format resmi N3 jauh lebih panjang (sampai 550–600 karakter) dan memakai
   gaya biasa, catatan kosakata (注), serta pertanyaan pendapat/tema. 142 dari 369 kanji N3 tidak ada di volume JOYdata,
   jadi bacaan N3 dengan volume bawaan memuat banyak kana. Keputusan user 2026-11-20: **belum ada kelas N3**, jadi N3 cukup
   diperbaiki di teks prompt (R12–R16). → [12](12-n3.md), [13](13-kanji-n3.md)
9. **Kurikulum Minna sebagai acuan:** pola dan kosakata per bab (Jilid I = N5, Jilid II = N4) kini ada di KB. Bank N5 memakai
   24 kata yang baru diajarkan di Jilid II (工場 Bab 38 — 61 kali, 動物園, 台所, 授業, …) dan 3 kata yang tidak ada di Minna
   (先輩 14 kali, 機械, 計画). → [15](15-tata-bahasa-minna.md), [16](16-kosakata-minna.md)

## Temuan sampingan: PDF ujian internal

- Kunci **文字・語彙 no. 32 salah**: tertulis 2, seharusnya **3** (うまれました).
- **文法 no. 18** kekurangan satu kotak isian (3 kotak untuk 4 pilihan).
- **Halaman 15**: judul/instruksi もんだい５ tidak tercetak.

Rincian di [01 § 5](01-format-dokkai-jlpt.md#5-catatan-koreksi-untuk-pdf-ujian-internal-a).
