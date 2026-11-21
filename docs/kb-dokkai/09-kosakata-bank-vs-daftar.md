# Kosakata bank dokkai vs daftar jlptsensei

> Pembanding yang lebih tepat untuk LPK ini adalah kosakata per bab Minna no Nihongo (yang benar-benar diajarkan):
> [16-kosakata-minna.md](16-kosakata-minna.md). File ini tetap berguna untuk melihat level JLPT sebuah kata.

> Dihitung 2026-11-20 dari `server/domain/bankSoal/dokkaiN5.js` (225 bacaan) dan `dokkaiN4.js` (125 bacaan): judul, teks,
> pertanyaan, dan pilihan. Bank ditulis dengan aturan yang hampir sama dengan prompt AI (tata bahasa N5, topik
> sehari-hari + kehidupan pemagang), jadi kebiasaan bank menunjukkan apa yang juga dihasilkan oleh aturan prompt.

## Metode dan batasnya

- Yang dihitung hanya **rangkaian 2 kanji atau lebih** (sesudah furigana dibuang). Kata satu kanji (食べる, 山) tidak
  dihitung karena memisahkan okurigananya butuh analisis morfologi.
- Rangkaian dicocokkan dengan daftar kosakata N5/N4 jlptsensei, termasuk okurigana sesudahnya (昼休み) dan awalan お/ご.
  Rangkaian yang bukan satu kata dipecah menjadi kata-kata di daftar bila bisa (日本語教室 → gagal, 花火 → 花+火).
- Angka, tanggal, satuan, dan nama orang (diikuti さん) dilewati.
- "Tidak ada di daftar" sering hanya berarti daftar jlptsensei tidak lengkap (lihat [06](06-kosakata-n5.md)) atau dua kata
  yang menempel tanpa spasi (朝早く → 朝 + 早く). Kolom itu perlu dibaca manual.

## Bank N5

| Status di daftar jlptsensei | Kata unik | Kemunculan |
|---|---|---|
| N5 | 87 | 1388 |
| gabungan kata N5 | 6 | 11 |
| **N4** | 22 | 155 |
| gabungan berisi N4 | 2 | 5 |
| nama/tempat | 6 | 54 |
| tidak ada di daftar | 27 | 112 |
| **Total** | 150 | 1725 |

### Kata N4 (menurut jlptsensei) yang dipakai bank N5

| Kata | Muncul | Level |
|---|---|---|
| 工場 | 61 | L1,L2,L3,L4,L5 |
| 昼休み | 18 | L1,L2,L3,L4,L5 |
| 先輩 | 14 | L1,L3,L4,L5 |
| 事務所 | 13 | L1,L3,L4,L5 |
| 動物園 | 13 | L2,L4,L5 |
| 美術館 | 4 | L5 |
| 予定 | 3 | L4 |
| 場所 | 3 | L4 |
| 準備 | 3 | L4,L5 |
| 試合 | 3 | L4,L5 |
| 約束 | 3 | L5 |
| 試験 | 3 | L5 |
| 歯医者 | 2 | L3 |
| 台風 | 2 | L3 |
| 空港 | 2 | L5 |
| 花見 | 2 | L5 |
| 用事 | 1 | L2 |
| 計画 | 1 | L4 |
| 大学生 | 1 | L4 |
| 予約 | 1 | L5 |
| 返事 | 1 | L5 |
| 高校生 | 1 | L5 |

**工場 (pabrik) muncul 61 kali** di bank N5 — terbanyak dari semua kata N4. Ini datang dari
aturan topik (separuh topik = kehidupan pemagang: pabrik, senior, kantor) yang bertabrakan dengan aturan "kosakata N5 saja".
Prompt AI mewarisi tabrakan yang sama: `TOPIK_DOKKAI` berisi 'hari pertama kerja di pabrik', 'aturan di asrama',
'membuang sampah sesuai aturan', 'mengirim uang ke keluarga', 'kerja paruh waktu' — topik yang hampir mustahil ditulis
tanpa kata N4 menurut jlptsensei (工場, ごみ, 捨てる, 送る, アルバイト, 規則) atau kata yang tidak ada di daftar N5/N4 sama
sekali (りょう).

### Rangkaian yang tidak ada di daftar (perlu dibaca manual)

| Kata | Muncul | Level |
|---|---|---|
| 日本語 | 34 | L1,L2,L3,L4,L5 |
| 弁当 | 14 | L1,L4 |
| 本屋 | 7 | L2,L4 |
| 給料 | 6 | L3,L4,L5 |
| 日本語教室 | 4 | L1,L5 |
| 運動会 | 4 | L3 |
| 機械 | 4 | L3 |
| 新幹線 | 4 | L4,L5 |
| 結婚式 | 4 | L4 |
| 花屋 | 4 | L5 |
| 山田先生 | 3 | L1,L3,L5 |
| 自転車置 | 3 | L3 |
| 運動 | 2 | L2,L5 |
| 注文 | 2 | L3 |
| 食事 | 2 | L3,L5 |
| 朝早 | 2 | L3,L5 |
| 山田駅 | 2 | L4 |
| 夜寝 | 2 | L5 |
| 会社員 | 1 | L1 |
| 朝出 | 1 | L3 |
| 夜早 | 1 | L3 |
| 水着 | 1 | L4 |
| 材料 | 1 | L4 |
| 朝起 | 1 | L5 |
| 日本人 | 1 | L5 |
| 全部食 | 1 | L5 |
| 今住 | 1 | L5 |

## Bank N4

| Status di daftar jlptsensei | Kata unik | Kemunculan |
|---|---|---|
| N5 | 79 | 644 |
| gabungan kata N5 | 15 | 37 |
| **N4** | 42 | 247 |
| gabungan berisi N4 | 4 | 11 |
| nama/tempat | 2 | 26 |
| tidak ada di daftar | 64 | 231 |
| **Total** | 206 | 1196 |

### Kata N4 yang dipakai bank N4 (wajar)

| Kata | Muncul | Level |
|---|---|---|
| 工場 | 48 | L1,L2,L3,L4,L5 |
| 先輩 | 41 | L1,L2,L3,L4,L5 |
| 社長 | 20 | L1,L3,L5 |
| 事務所 | 17 | L1,L2,L3,L5 |
| 空港 | 14 | L1,L3,L5 |
| 予約 | 10 | L1,L4,L5 |
| 試験 | 9 | L2,L3 |
| 受付 | 7 | L4,L5 |
| 部長 | 6 | L4,L5 |
| 予定 | 6 | L5 |
| 昼休み | 4 | L1,L4,L5 |
| 花見 | 4 | L2 |
| 連絡 | 4 | L3,L4,L5 |
| 最後 | 4 | L3,L5 |
| 今度 | 3 | L2,L4 |
| 手袋 | 3 | L2 |
| 説明 | 3 | L2,L5 |
| 途中 | 3 | L3,L4 |
| 住所 | 3 | L4 |
| 店員 | 3 | L4 |
| 美術館 | 3 | L5 |
| 会議 | 3 | L5 |
| 趣味 | 2 | L2 |
| 最近 | 2 | L3 |
| 場所 | 2 | L3,L4 |
| 歯医者 | 2 | L4 |
| 約束 | 2 | L4 |
| 利用 | 2 | L5 |
| 旅館 | 2 | L5 |
| 故障 | 2 | L5 |
| 卒業 | 2 | L5 |
| 安全 | 1 | L3 |
| 無理 | 1 | L3 |
| 気持ち | 1 | L4 |
| 高校生 | 1 | L4 |
| 会議室 | 1 | L5 |
| 用意 | 1 | L5 |
| 用事 | 1 | L5 |
| 返事 | 1 | L5 |
| 道具 | 1 | L5 |
| 以上 | 1 | L5 |
| 原因 | 1 | L5 |

### Rangkaian yang tidak ada di daftar N5/N4 (perlu dibaca manual)

Sebagian adalah kosakata kerja/keigo yang memang dibutuhkan topik (残業, 夜勤, 部品, 作業服, お客様) — kandidat
"glosarium kerja" yang diizinkan walau di luar daftar.

| Kata | Muncul | Level |
|---|---|---|
| 日本語 | 22 | L1,L2,L3,L4,L5 |
| 客様 | 19 | L5 |
| 定食 | 10 | L1,L4 |
| 本屋 | 10 | L1,L2,L4,L5 |
| 花屋 | 8 | L2,L4,L5 |
| 部品 | 7 | L1,L2,L5 |
| 運転 | 7 | L1,L2 |
| 工事 | 7 | L3,L5 |
| 奥様 | 7 | L5 |
| 朝礼 | 6 | L2 |
| 山田部長 | 6 | L5 |
| 中田先生 | 6 | L5 |
| 皆様 | 6 | L5 |
| 大会 | 5 | L5 |
| 森様 | 5 | L5 |
| 店長 | 5 | L5 |
| 日本語教室 | 4 | L4,L5 |
| 運動会 | 4 | L4 |
| 残業 | 4 | L4 |
| 料金 | 4 | L5 |
| 夜勤 | 3 | L2 |
| 朝早 | 3 | L2,L3 |
| 弁当 | 3 | L3,L4 |
| 後輩 | 3 | L4,L5 |
| 社員 | 3 | L4 |
| 山田先生 | 3 | L4 |
| 手伝 | 3 | L4 |
| 山下様 | 3 | L5 |
| 教科書 | 3 | L5 |
| 当店 | 3 | L5 |
| 今住 | 2 | L1 |
| 苦手 | 2 | L2 |
| 作業服 | 2 | L2 |
| 電気代 | 2 | L3 |
| 朝起 | 2 | L3 |
| 洗濯機 | 2 | L4 |
| 朝食 | 2 | L5 |
| 出発 | 2 | L5 |
| 上田様 | 2 | L5 |
| 冬休 | 2 | L5 |
| 田中部長 | 2 | L5 |
| 森工場長 | 2 | L5 |
| 工場長 | 2 | L5 |
| 西田先生 | 2 | L5 |
| 田山 | 2 | L5 |
| 夜早 | 1 | L2 |
| 日本人 | 1 | L2 |
| 今月買 | 1 | L2 |
| 来週買 | 1 | L2 |
| 夜作 | 1 | L2 |
| 全部乾 | 1 | L3 |
| 全部飲 | 1 | L3 |
| 来年日本 | 1 | L4 |
| 田中様 | 1 | L5 |
| 組合 | 1 | L5 |
| 見学 | 1 | L5 |
| 主人 | 1 | L5 |
| 子様 | 1 | L5 |
| 入社 | 1 | L5 |
| 注文 | 1 | L5 |
| 無料 | 1 | L5 |
| 日本語学校 | 1 | L5 |
| 全部読 | 1 | L5 |
| 田山部長 | 1 | L5 |
