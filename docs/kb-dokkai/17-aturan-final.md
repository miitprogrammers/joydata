# Aturan dokkai yang disepakati

> **Diputuskan user 2026-11-20:** D1–D8 sesuai rekomendasi ([11](11-sumber-pembanding.md)), **工場 masuk N4**, D9–D10: belum ada
> kelas N3 ([12](12-n3.md)). File ini merangkum hasilnya menjadi satu aturan yang akan dipakai untuk merevisi prompt AI
> (`server/ai/dokkaiAi.js`) dan spesifikasi bank (skill `generate-soal`). **Belum ada kode yang diubah.**
>
> Kurikulum: Minna no Nihongo Shokyu I (Bab 1–25) = tahap N5; Minna II (Bab 26–50) + modul 111 Bunpo N4 = tahap N4.

## 1. Daftar keputusan

| No | Keputusan | Sumber |
|---|---|---|
| D1 | ～ので dan ～つもり **dilarang di N5** (Minna Bab 39 / 31). | [11 § D1](11-sumber-pembanding.md) |
| D2 | **Tata bahasa N5 = pola Minna Jilid I (Bab 1–25) + pola yang dipakai sampel resmi JLPT N5.** Pola Jilid II dilarang di N5. | [11 § D2](11-sumber-pembanding.md), [15](15-tata-bahasa-minna.md) |
| D3 | **Kosakata N5 = kosakata Minna Jilid I**, termasuk kata kerja pemagang yang ada di Jilid I. **工場 masuk N4** (keputusan user). Kata Jilid II dan kata di luar Minna dihindari di N5. | [11 § D3](11-sumber-pembanding.md), [16](16-kosakata-minna.md) |
| D4 | **Angka Arab** untuk jam, tanggal, harga, jumlah, halaman; angka kanji hanya untuk kata tetap (一つ, 一人, 二人, 一緒, 一度, 一日中). | [11 § D4](11-sumber-pembanding.md) |
| D5 | **L5 lebih panjang:** N5 ±150–250 karakter, N4 ±250–450 karakter. | [11 § D5](11-sumber-pembanding.md) |
| D6 | **Tetap 3 pilihan.** Kode yang dinilai memakai lebih banyak soal (saran: minimal 8 bacaan = 16 soal). | [11 § D6](11-sumber-pembanding.md) |
| D7 | **Ya, bertahap:** (1) baris baru untuk memo/email/pengumuman, (2) soal cari-informasi (情報検索) sederhana di L4–L5. Perlu kode. | [11 § D7](11-sumber-pembanding.md) |
| D8 | **Tata bahasa N4 = Minna I + II + modul.** Pola N4 di luar modul: kelompok A–C (diajarkan Minna) boleh, D dihindari, E dilarang. ～ようにする boleh di N4. | [11 § D8](11-sumber-pembanding.md) |
| D9 | ~~Kanji N3 di luar volume tetap ditulis kana.~~ **Diubah user 2026-11-20:** ada volume kanji N3; bacaan N3 memakai kanji N5+N4+N3. | [12 § 9](12-n3.md), [implementasi/spek-05](implementasi/spek-05-materi-n3.md) |
| D10 | ~~Belum ada kelas N3.~~ **Diubah user 2026-11-20:** materi N3 ditambahkan — kanji N3 (tes kode, latihan, flashcard, Kanji Adventure) dan bank dokkai N3 awal 50 soal per level; semua bank direvisi sesuai KB. | [implementasi/plan.md](implementasi/plan.md) |

## 2. Aturan umum (semua tingkat)

Bentuk soal mengikuti JLPT ([01](01-format-dokkai-jlpt.md), [02](02-pola-soal-dan-pengecoh.md)):

1. **Kalimat bingkai** untuk teks selain narasi (memo, pengumuman, email, karangan); memo dan email ditutup nama pengirim.
2. **Jenis teks bervariasi** sesuai level (pemetaan di [02](02-pola-soal-dan-pengecoh.md#usulan-pemetaan-ke-level-joydata-n5)).
3. **Semua pengecoh berasal dari teks**, minimal satu teknik P per soal (P1 kebiasaan vs kali ini, P3 matriks, P4 arah
   tertukar, P6 benar-tapi-bukan-alasan, P7 urutan, P8 aturan dibalik, P9 angka/waktu).
4. **Kunci boleh parafrase** mulai L3 (minimal satu soal per bacaan); `pembahasan` tetap kutipan persis + penalaran.
5. Pilihan sejajar; 3 pilihan; 2 soal per bacaan; soal kedua tidak terjawab dari soal pertama.
6. **Angka Arab** (D4). Pengecualian: 一つ／二つ…, 一人／二人, 一緒, 一度, 一日中.
7. Kanji tetap mengikuti volume pilihan sensei; furigana tetap ditulis di data (tes resmi menampilkannya tanpa furigana).

## 3. N5

### Tata bahasa — boleh (Minna Jilid I, nomor = bab)

| Bab | Pola |
|---|---|
| 1–12 | です／ではありません／でした; ～ます／ません／ました／ませんでした; kata sifat -i/-na (sekarang, lampau, negatif); あります／います; ～より／～のほうが／～でいちばん; ～ませんか／～ましょう; あげます／もらいます (benda) |
| 13 | ～たいです · Nが欲しいです · **～に行きます (tujuan)** |
| 14 | ～てください · ～ましょうか · ～ています · **V-かた** |
| 15 | ～てもいいです · ～てはいけません · ～ています (keadaan, kebiasaan) |
| 16 | ～て、～て · ～てから · ～くて／～で |
| 17 | ～ないでください · **～なければなりません** · **～なくてもいいです** |
| 18 | **～ことができます** ⚠️ · 趣味は～ことです · ～まえに |
| 19 | **～たことがあります** · ～たり～たりします · ～くなります／～になります |
| 20–21 | bentuk biasa (hanya di dalam kalimat, kutipan, atau sebelum ～と思います); ～と思います; ～と言います; ～でしょう？ |
| 22 | **penjelas kata benda** (見た映画) — **mulai L3** |
| 23 | ～とき · V-ると (kondisi) |
| 24 | ～をくれます · **～てもらいます／～てくれます／～てあげます** ⚠️ |
| 25 | **～たら** ⚠️ · **～ても** ⚠️ |
| pengecualian | **Vたあとで／Nのあとで** (Bab 34, tetapi dipakai sampel resmi JLPT N5) |

⚠️ = **sebelumnya dilarang** di spesifikasi bank N5 (`tingkat-N5.md`), menjadi boleh karena prinsip D2 (pola Minna Jilid I).
Kalau ada yang tetap ingin dilarang, cukup sebutkan; selebihnya aturan ini yang berlaku.

### Tata bahasa — dilarang di N5 (Minna Jilid II, nomor = bab)

～んです (26) · ～ながら, ～し (28) · ～てしまいます (29) · ～てあります, ～ておきます (30) · bentuk maksud, **～つもり**, ～予定, まだ～ていません (31) ·
～ほうがいい, ～かもしれません, ～でしょう (dugaan) (32) · perintah/larangan, ～と書いてあります (33) · ～とおりに, ～ないで (tanpa) (34) ·
～ば, ～なら (35) · ～ように, ～ようになります (36) · pasif (37) · ～のが／～のを (38) · **～ので**, ～て (sebab) (39) · ～かどうか, ～てみます (40) ·
いただきます／くださいます／やります (41) · ～ために, ～のに (42) · ～そうです (43, 47) · ～すぎます, Nにします (44) · ～場合, ～のに (45) ·
～ところ, ～ばかり, ～はず (46) · ～ようです (47) · kausatif (48) · keigo (49–50). Ditambah semua pola N4/N3 di luar Minna.

Gaya: narasi, pertanyaan, dan pilihan tetap です・ます.

### Kosakata

- **Boleh:** kosakata Minna Jilid I ([16](16-kosakata-minna.md), Bab 1–25), termasuk kata kerja pemagang Jilid I: 事務所 (3), 昼休み (4),
  寮 (8), アルバイト (9), 残業 (17), 捨てます (18), 部長／社長 (18), 会議 (3–4), 定食 (13), お弁当 (22).
- **Dihindari (Jilid II → N4):** **工場 (38)**, ごみ (26), 給料 (28), 規則 (33), 安全 (44), dan kata Jilid II lain yang selama ini muncul di
  bank N5: 動物園, 台所, 授業, 映画館, 言葉, 大人, 運動会, 花火, 入口, 結婚式, 夕方, 予定, 場所, 運動, 台風, 茶色, 材料, 返事.
- **Dihindari (tidak ada di Minna):** 先輩, 作業, 機械, 計画.
- Pengganti yang wajar (kata Jilid I): 工場 → 会社; 先輩 → 会社の 人.

### Panjang dan jenis soal per level (karakter tanpa furigana)

| Level | Panjang | Jenis teks | Jenis pertanyaan |
|---|---|---|---|
| L1 | 30–58 | narasi わたし | fakta langsung (J1), rencana (J8) |
| L2 | 45–85 | narasi, deskripsi orang ketiga | fakta dengan angka/waktu/tempat (J1), keadaan vs keinginan (J9) |
| L3 | 50–95 | memo, papan pengumuman (dengan bingkai) | alasan (J2), urutan (J3), yang bisa diketahui (J7) |
| L4 | 60–115 | memo berjadwal, email, pengumuman dengan jam/harga | urutan (J3), maksud pesan (J4), cari info tanpa tabel (J10) |
| L5 | **±150–250** | karangan berjudul, cerita, email panjang | rujukan bagian (J5), alasan/simpulan (J2), negatif (J6) |

## 4. N4

- **Tata bahasa:** pola Minna I + II + modul 111 Bunpo N4. **Pola fokus dan urutan level tetap dari modul** — pola modul level
  berikutnya tetap dilarang walau sudah diajarkan di Minna II.
- **Pola N4 di luar modul** ([11 § D8](11-sumber-pembanding.md)):
  - boleh: kelompok A (Minna I: あまり～ない, きっと, ぜひ, など, …), B dan C (Minna II: 場合は, 予定だ, ようだ, それに, そうだ 'katanya'
    mulai L4, たばかり, …);
  - dihindari: kelompok D (だけで, たがる, てよかった, …; partikel lisan かしら／かい／かな／って dilarang di narasi);
  - dilarang: kelompok E (～だす, はずがない, ～おきに, ～続ける, ということ, ように／ような 'seperti', …).
- **～ようにする boleh** (Minna Bab 36). **～させられる tetap dilarang** (tidak ada di Minna maupun modul). Larangan N3 lain tetap
  (～わけ, ～として, ～にとって, ～うちに, ～たびに, ～おかげで／せいで, ～だけでなく, ～さえ, ～に対して／関して／比べて, ～っぽい／がち／ぎみ);
  ～によって tetap dilarang sampai dicek di buku Bab 37.
- **Kosakata:** kosakata Minna I + II; **工場, ごみ, 給料, 規則, 安全 boleh**; 先輩, 作業, 機械 boleh seperlunya dengan konteks jelas.
- **Panjang:** L1–L4 tetap (45–175); **L5 ±250–450**.

## 5. N3

Tingkat penuh (D10 direvisi): bank dokkai N3 (L1–L2 短文 150–200, L3 中文 300–350, L4 中文 330–380, L5 長文 500–550), pertanyaan
bentuk biasa, catatan (注) untuk kata di atas level, soal rujukan/contoh/pendapat/tema, contoh pola N3 diganti yang benar-benar
N3 (R12–R16, [12 § 8](12-n3.md)). Kanji = volume N5+N4+N3 (D9 direvisi). Rincian teknis: [implementasi/spek-05](implementasi/spek-05-materi-n3.md).

## 6. Pekerjaan lanjutan — status (2026-11-21: semua terlaksana)

> Rencana implementasi lengkap (fase F0–F7, spesifikasi teknis, uji): [implementasi/plan.md](implementasi/plan.md). Tabel di
> bawah adalah ringkasan awal; cakupan sekarang juga mencakup materi N3 dan revisi semua bank. Status per fase dan buktinya:
> [implementasi/progres.md](implementasi/progres.md).

| No | Pekerjaan | Jenis | Dasar | Status |
|---|---|---|---|---|
| L1 | Revisi teks prompt `dokkaiAi.js`: `SISTEM`, `PANDUAN_LEVEL`, `PANDUAN_JLPT` (N5/N4/N3), contoh kata di `SISTEM` (工場, 用事), `TOPIK_DOKKAI` dipisah per tingkat (topik pabrik/sampah/gaji hanya N4) | teks prompt | §2–§5, R1–R16 | selesai (F1; 情報検索 L5 ditambah F8) |
| L2 | Samakan spesifikasi skill `generate-soal` (`spesifikasi-soal.md`, `tingkat-N5.md`, `tingkat-N4.md`) dengan aturan ini | dokumen skill | §2–§4 | selesai (F3, F8) |
| L3 | Perbaiki bank N5: ～ので di L5-2; 工場 (61×) dan kata Jilid II lain; 先輩 (14×); angka kanji → Arab (176 bacaan) — lewat skill `generate-soal` dengan tinjauan ulang | data bank | D1, D3, D4 | selesai (F5; mutu dan panjang L5 baru F8) |
| L4 | Baris baru di `FuriganaText.vue` + format memo/email/pengumuman | kode kecil | D7 tahap 1 | selesai (F2) |
| L5 | Saran jumlah bacaan untuk kode yang dinilai (mis. default 8 bacaan) | kode/setelan | D6 | selesai (F2) |
| L6 | Peringatan otomatis kata di luar Minna Jilid I untuk bacaan N5 (gate/validator), memakai `data/minna-kosakata.json` | kode | D3, C5 | selesai (F8): gate skill + peringatan di dialog Tinjau Bacaan AI (`server/domain/aturanDokkai.js`; daftar kata hindari, bukan daftar Minna lengkap) |
| L7 | Soal 情報検索 sederhana | kode + prompt | D7 tahap 2 | selesai (F8): prompt AI L5 N5/N4, spesifikasi butir 12, 10 bacaan bank |
