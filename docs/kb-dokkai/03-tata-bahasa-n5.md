# Tata bahasa N5 — daftar jlptsensei vs aturan JOYdata

> Sumber: [jlptsensei.com/jlpt-n5-grammar-list](https://jlptsensei.com/jlpt-n5-grammar-list/) · diambil 2026-11-20 · **84 pola** (cocok dengan total di situs).
> Kolom "Arti (EN)" disalin dari situs; "Arti (ID)" terjemahan ringkas untuk KB ini. Klik pola untuk membuka pelajarannya.

## Cara membaca kolom "Status JOYdata"

Status diturunkan dari dua tempat yang sekarang mengatur tata bahasa dokkai N5:

- **Prompt AI**: `PANDUAN_JLPT.N5` di `server/ai/dokkaiAi.js` (dipakai saat sensei membuat kode dokkai sumber AI).
- **Spesifikasi bank**: `.claude/skills/generate-soal/references/tingkat-N5.md` (dipakai saat menulis bank tetap).

| Status | Arti | Jumlah |
|---|---|---|
| ✅ boleh | disebut boleh di prompt atau spesifikasi | 31 |
| ✅ dasar | partikel/kata dasar, dipakai tanpa perlu disebut | 17 |
| ⚠️ hanya L5 | spesifikasi membatasinya ke L5 | 3 |
| ➖ tidak disebut | tidak diizinkan maupun dilarang secara tertulis | 27 |
| ⛔ gaya biasa/lisan | bentuk biasa/lisan, sedangkan narasi wajib です・ます | 4 |
| ⛔ dilarang | tertulis dilarang di N5 | 2 |

Kolom "Modul N4" menunjukkan pola yang **juga** diajarkan modul "111 Bunpo N4" (nomor modul + level dokkai N4).

## Temuan utama

1. **Dua pola yang dilarang di N5 justru N5 menurut jlptsensei:** `～ので` (#58) dan `～つもり` (#78). Keduanya diajarkan
   modul N4 (#51 L2, #3 L1), jadi larangan ini konsisten dengan pembagian kelas JOYdata, tetapi tidak dengan JLPT.
2. **Dua pola yang dibolehkan di N5 menurut prompt adalah N4 menurut jlptsensei:** `～と思います` (N4 #114) dan `～あとで`
   (N4 #4). Untuk `～あとで`, sampel resmi N5 sendiri memakainya ("コピーを した あとで", "食べた あとで"), jadi aman.
3. **Pola N5 yang sering muncul di sampel resmi tetapi tidak disebut sama sekali:** `～に行く` (pergi untuk …, #49),
   `～がほしい` (#13), `～んです` (#46), dan penjelas kata benda pendek ("3か月前に 見た えいが", "買った DVD").
   Spesifikasi bank membatasi penjelas kata benda ke L5, padahal sampel N5 memakainya di teks pendek もんだい4.
4. **Keharusan:** prompt melarang `～なければなりません` (memang N4 #53), tetapi jlptsensei menaruh padanannya di N5:
   `～なくてはいけない` (#43), `～なくてはならない` (#44), `～ないといけない` (#40). Prompt diam soal ketiganya.
5. **Pola N5 jlptsensei yang di JOYdata diajarkan sebagai N4:** `～たことがある`, `～すぎる`, `～ほうがいい`, `～なくてもいい`,
   `まだ～ていません`, `V方`, `Nにする` (lihat kolom Modul N4). Perlu keputusan: N5 dokkai mengikuti JLPT (boleh) atau
   kurikulum kelas (dihindari sampai N4).

> ⚠️ Daftar jlptsensei **bukan daftar resmi**. Sejak 2010 JLPT tidak menerbitkan daftar tata bahasa per level; tiap
> situs/buku membagi sedikit berbeda. Pakai daftar ini sebagai acuan umum, dan sampel resmi (lihat
> [01-format-dokkai-jlpt.md](01-format-dokkai-jlpt.md)) sebagai bukti terkuat.

## Daftar lengkap

| # | Pola | Romaji | Arti (EN) | Arti (ID) | Status JOYdata | Modul N4 | Catatan |
|---|---|---|---|---|---|---|---|
| 1 | [ちゃいけない・じゃいけない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A1%E3%82%83%E3%81%84%E3%81%91%E3%81%AA%E3%81%84-%E3%81%98%E3%82%83%E3%81%84%E3%81%91%E3%81%AA%E3%81%84-cha-ikenai-ja-dame/) | cha ikenai / ja ikenai | must not do (spoken Japanese) | tidak boleh (lisan dari ～てはいけない) | ⛔ gaya biasa/lisan |  | Versi sopan ～てはいけません: boleh (spesifikasi bank). |
| 2 | [だ / です](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A0-da-%E3%81%A7%E3%81%99-desu-meaning/) | da / desu | to be (am, is, are, were, used to) | adalah (kopula) | ✅ boleh |  | です boleh; だ di akhir kalimat = gaya biasa. |
| 3 | [だけ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A0%E3%81%91-dake-meaning/) | dake | only; just; as much as ~ | hanya, saja | ➖ tidak disebut |  |  |
| 4 | [だろう](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A0%E3%82%8D%E3%81%86-darou-meaning/) | darou | I think; it seems; probably; right? | mungkin; …kan? (bentuk biasa でしょう) | ⛔ gaya biasa/lisan | #27 L3 | Modul N4 menaruh ～だろう di L3. |
| 5 | [で](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A7-de-particle-meaning/) | de | in; at; on; by; with; via ~ | di (tempat kegiatan), dengan (alat), naik (kendaraan) | ✅ dasar |  |  |
| 6 | [でも](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A7%E3%82%82-demo-meaning/) | demo | but; however; though ~ | tetapi (awal kalimat) | ✅ boleh |  |  |
| 7 | [でしょう](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A7%E3%81%97%E3%82%87%E3%81%86-deshou-meaning/) | deshou | I think; it seems; probably; right? | mungkin; …kan? (dugaan, konfirmasi) | ➖ tidak disebut |  | Spesifikasi N4 membolehkan ～でしょう sebagai pendukung. |
| 8 | [どんな](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A9%E3%82%93%E3%81%AA-donna-meaning/) | donna | what kind of; what sort of | … yang bagaimana | ✅ dasar |  |  |
| 9 | [どうして](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A9%E3%81%86%E3%81%97%E3%81%A6-doushite-meaning/) | doushite | why; for what reason; how | mengapa | ✅ boleh |  | Contoh prompt: どうして…からです. |
| 10 | [どうやって](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A9%E3%81%86%E3%82%84%E3%81%A3%E3%81%A6-douyatte-meaning/) | douyatte | how; in what way; by what means​ | bagaimana caranya | ✅ dasar |  |  |
| 11 | [が](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8C-ga-subject-marker-particle/) | ga | subject marker; however; but ~ | penanda subjek; tetapi | ✅ boleh |  |  |
| 12 | [があります](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99-ga-arimasu-%E3%81%8C%E3%81%82%E3%82%8B-ga-aru-meaning/) | ga arimasu | there is; is (non-living things) | ada (benda mati) | ✅ boleh | #47 L1 |  |
| 13 | [がほしい](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8C%E3%81%BB%E3%81%97%E3%81%84-ga-hoshii-%E3%81%8C%E6%AC%B2%E3%81%97%E3%81%84-meaning/) | ga hoshii | to want something | ingin (memiliki) sesuatu | ➖ tidak disebut |  | Sampel resmi N5 memakai ほしかったからです. |
| 14 | [がいます](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8C%E3%81%84%E3%81%BE%E3%81%99-ga-imasu-%E3%81%8C%E3%81%84%E3%82%8B-ga-iru-meaning/) | ga imasu | there is; to be; is (living things) | ada (makhluk hidup) | ✅ boleh |  |  |
| 15 | [ほうがいい](https://jlptsensei.com/learn-japanese-grammar/%E6%96%B9%E3%81%8C%E3%81%84%E3%81%84-%E3%81%BB%E3%81%86%E3%81%8C%E3%81%84%E3%81%84-hou-ga-ii-meaning/) | hou ga ii | had better; it'd be better to; should ~ | sebaiknya | ➖ tidak disebut | #99 L2 |  |
| 16 | [い-adjectives](https://jlptsensei.com/learn-japanese-grammar/japanese-%E3%81%84-adjectives-%E3%81%84%E5%BD%A2%E5%AE%B9%E8%A9%9E-meaning/) | i-adjectives | i-adjectives | kata sifat -i | ✅ boleh |  |  |
| 17 | [一番（いちばん）](https://jlptsensei.com/learn-japanese-grammar/%E4%B8%80%E7%95%AA-%E3%81%84%E3%81%A1%E3%81%B0%E3%82%93-ichiban-meaning/) | ichiban | the most; the best | paling | ✅ boleh |  |  |
| 18 | [一緒に（いっしょに）](https://jlptsensei.com/learn-japanese-grammar/%E4%B8%80%E7%B7%92%E3%81%AB-%E3%81%84%E3%81%A3%E3%81%97%E3%82%87%E3%81%AB-issho-ni-meaning/) | issho ni | together | bersama-sama | ✅ dasar |  |  |
| 19 | [いつも](https://jlptsensei.com/learn-japanese-grammar/%E3%81%84%E3%81%A4%E3%82%82-itsumo-meaning/) | itsumo | always; usually; habitually | selalu, biasanya | ✅ boleh |  |  |
| 20 | [じゃない・ではない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%98%E3%82%83%E3%81%AA%E3%81%84-janai-%E3%81%A7%E3%81%AF%E3%81%AA%E3%81%84-dewa-nai-meaning/) | janai / dewa nai | to not be (am not; is not; are not) | bukan | ✅ boleh |  | ではありません boleh; じゃない = lisan. |
| 21 | [か](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B-ka-question-particle-meaning/) | ka | question particle | partikel tanya | ✅ dasar |  |  |
| 22 | [か～か](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B%EF%BD%9E%E3%81%8B-ka-ka-or-meaning/) | ka~ka | or | … atau … | ➖ tidak disebut |  |  |
| 23 | [から](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B%E3%82%89-kara-meaning/) | kara | because; since; from | karena; dari | ✅ boleh |  |  |
| 24 | [方（かた）](https://jlptsensei.com/learn-japanese-grammar/%E6%96%B9-%E3%81%8B%E3%81%9F-kata-meaning/) | kata | the way of doing something; how to do ~ | cara melakukan | ➖ tidak disebut | #10 L1 |  |
| 25 | [けど](https://jlptsensei.com/learn-japanese-grammar/%E3%81%91%E3%81%A9-kedo-meaning/) | kedo | but; however; although ~ | tetapi (lisan) | ➖ tidak disebut |  | Lisan; narasi です・ます memakai ～が. |
| 26 | [けれども](https://jlptsensei.com/learn-japanese-grammar/%E3%81%91%E3%82%8C%E3%81%A9%E3%82%82-keredo-mo-meaning/) | keredo mo | but; however; although ~ | tetapi, walaupun | ➖ tidak disebut |  |  |
| 27 | [まだ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%A0-mada-meaning/) | mada | still; not yet | masih; belum | ➖ tidak disebut |  | Kata dasar. |
| 28 | [まだ～ていません](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%A0%EF%BD%9E%E3%81%A6%E3%81%84%E3%81%BE%E3%81%9B%E3%82%93-mada-te-imasen-meaning/) | mada ~te imasen | have not yet ~ | belum … | ➖ tidak disebut | #39 L1 |  |
| 29 | [まで](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%A7-made-meaning/) | made | until; as far as; to (an extent); even ~ | sampai | ✅ boleh |  |  |
| 30 | [前に（まえに）](https://jlptsensei.com/learn-japanese-grammar/%E5%89%8D%E3%81%AB-%E3%81%BE%E3%81%88%E3%81%AB-mae-ni-meaning/) | mae ni | before; in front of ~ | sebelum; di depan | ✅ boleh |  |  |
| 31 | [ませんか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%9B%E3%82%93%E3%81%8B-masen-ka-meaning/) | masen ka | would you; do you want to; shall we ~ | maukah …? (ajakan) | ✅ boleh |  |  |
| 32 | [ましょう](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%97%E3%82%87%E3%81%86-mashou-meaning/) | mashou | let's ~; shall we ~ | mari … | ✅ boleh |  |  |
| 33 | [ましょうか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%97%E3%82%87%E3%81%86%E3%81%8B-mashouka-meaning/) | mashouka | shall I ~; used to offer help to the listener | bagaimana kalau saya …? (menawarkan) | ➖ tidak disebut |  |  |
| 34 | [も](https://jlptsensei.com/learn-japanese-grammar/%E3%82%82-mo-particle-meaning/) | mo | too; also; as well | juga | ✅ dasar |  |  |
| 35 | [もう](https://jlptsensei.com/learn-japanese-grammar/%E3%82%82%E3%81%86-mou-meaning/) | mou | already; anymore; again; other | sudah; lagi | ➖ tidak disebut |  | Kata dasar. |
| 36 | [な-adjectives](https://jlptsensei.com/learn-japanese-grammar/japanese-%E3%81%AA-adjectives-%E3%81%AA%E5%BD%A2%E5%AE%B9%E8%A9%9E-meaning/) | na-adjectives | na-adjectives | kata sifat -na | ✅ boleh |  |  |
| 37 | [なあ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%82-naa-sentence-ending-particle-meaning/) | naa | sentence ending particle; confirmation; admiration, etc | partikel akhir: kagum (lisan) | ⛔ gaya biasa/lisan |  |  |
| 38 | [ないで](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%84%E3%81%A7-naide-meaning/) | naide | without doing ~; to do [B] without doing [A] | tanpa … | ➖ tidak disebut |  |  |
| 39 | [ないでください](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%84%E3%81%A7%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84-naide-kudasai-meaning/) | naide kudasai | please don't do ~ | tolong jangan … | ✅ boleh |  |  |
| 40 | [ないといけない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%84%E3%81%A8%E3%81%84%E3%81%91%E3%81%AA%E3%81%84-naito-ikenai-meaning/) | naito ikenai | must do; have an obligation to do ~ | harus … | ➖ tidak disebut |  | Padanannya ～なければなりません dilarang di N5. |
| 41 | [なくてもいい](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%8F%E3%81%A6%E3%82%82%E3%81%84%E3%81%84-naku-temo-ii-meaning/) | naku temo ii | don't have to | tidak perlu … | ➖ tidak disebut | #22 L2 |  |
| 42 | [なくちゃ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%8F%E3%81%A1%E3%82%83-%E3%83%80%E3%83%A1-nakucha-dame-meaning/) | nakucha | must do; need to; gotta do ~ | harus … (lisan) | ⛔ gaya biasa/lisan |  |  |
| 43 | [なくてはいけない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%8F%E3%81%A6%E3%81%AF%E3%81%84%E3%81%91%E3%81%AA%E3%81%84-nakute-wa-ikenai-meaning/) | nakute wa ikenai | must do; need to do | harus … | ➖ tidak disebut | #21 L2 |  |
| 44 | [なくてはならない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%8F%E3%81%A6%E3%81%AF%E3%81%AA%E3%82%89%E3%81%AA%E3%81%84-nakute-wa-naranai-meaning/) | nakute wa naranai | must do; need to do ~ | harus … | ➖ tidak disebut |  |  |
| 45 | [なる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%82%8B-naru-meaning/) | naru | to become | menjadi | ✅ boleh |  | ～くなります／～になります. |
| 46 | [んです](https://jlptsensei.com/learn-japanese-grammar/%E3%82%93%E3%81%A7%E3%81%99-ndesu-%E3%82%93%E3%81%A0-nda-meaning/) | ndesu | to explain something; show emphasis | penjelasan/penekanan (lisan) | ➖ tidak disebut | #103 L3 | Sampel resmi N5: いいんですか. Spesifikasi N4: ～んです boleh di narasi. |
| 47 | [ね](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AD-ne-particle-meaning/) | ne | isn't it? right? eh? | …ya? (partikel akhir) | ✅ dasar |  |  |
| 48 | [に](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AB-ni-destination-particle-meaning/) | ni | destination particle; in; at; on; to | ke, pada, di (keberadaan, waktu) | ✅ dasar |  |  |
| 49 | [に行く（にいく）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%97%E3%81%AB%E3%81%84%E3%81%8F-ni-iku-meaning/) | ni iku | go to do ~ | pergi untuk … | ➖ tidak disebut |  | Sampel resmi N5: 見に行きました, 買いに行きました, 飲みに行きます. |
| 50 | [にする](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AB%E3%81%99%E3%82%8B-ni-suru-meaning/) | ni suru | to decide on | memilih/memutuskan (N にします) | ➖ tidak disebut | #49 L1 |  |
| 51 | [に/へ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AB-%E3%81%B8-ni-e-directional-particle-meaning/) | ni/e | to (indicates direction / destination) | ke (arah) | ✅ dasar |  |  |
| 52 | [の](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE-no-possessive-particle-meaning/) | no | possessive particle | milik; penghubung kata benda | ✅ dasar | #102 L2 |  |
| 53 | [のです](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E3%81%A7%E3%81%99-no-desu-%E3%81%AE%E3%81%A0-noda-meaning/) | no desu | to explain something; show emphasis | penjelasan/penekanan | ➖ tidak disebut | #103 L3 |  |
| 54 | [のが下手（のがへた）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E3%81%8C%E4%B8%8B%E6%89%8B-%E3%81%AE%E3%81%8C%E3%81%B8%E3%81%9F-no-ga-heta-meaning/) | no ga heta | to be bad at doing something | tidak pandai … | ⚠️ hanya L5 |  | V kamus + の hanya di L5 (spesifikasi bank). |
| 55 | [のが上手（のがじょうず）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E3%81%8C%E4%B8%8A%E6%89%8B-no-ga-jouzu-%E3%81%AE%E3%81%8C%E3%81%98%E3%82%87%E3%81%86%E3%81%9A%E3%81%A7%E3%81%99-meaning/) | no ga jouzu | to be good at | pandai … | ⚠️ hanya L5 |  | Idem. |
| 56 | [のが好き（のがすき）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E3%81%8C%E5%A5%BD%E3%81%8D-no-ga-suki-%E3%81%AE%E3%81%8C%E3%81%99%E3%81%8D%E3%81%A7%E3%81%99-meaning/) | no ga suki | to like doing something | suka (melakukan) … | ⚠️ hanya L5 |  | Idem. |
| 57 | [の中で[A]が一番（のなかで[A]がいちばん）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E4%B8%AD%E3%81%A7%E3%81%8C%E4%B8%80%E7%95%AA-%E3%81%AE%E3%81%AA%E3%81%8B%E3%81%A7%E3%81%8C%E3%81%84%E3%81%A1%E3%81%B0%E3%82%93-no-naka-de-ga-ichiban-meaning/) | no naka de [A] ga ichiban | out of this group, [A] is best | di antara …, yang paling … adalah ～ | ✅ boleh |  |  |
| 58 | [ので](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E3%81%A7-node-meaning/) | node | because of; given that; since ~ | karena (halus, obyektif) | ⛔ dilarang | #51 L2 | Dilarang di prompt N5 dan spesifikasi bank. |
| 59 | [お / ご](https://jlptsensei.com/learn-japanese-grammar/%E5%BE%A1-%E3%81%8A-%E3%81%94-o-go-polite-marker-particle-meaning/) | o / go | polite marker; honorific prefix particle | awalan sopan | ✅ dasar |  |  |
| 60 | [を](https://jlptsensei.com/learn-japanese-grammar/%E3%82%92-wo-object-marker-meaning/) | o / wo | object marker particle | penanda objek | ✅ dasar |  |  |
| 61 | [をください](https://jlptsensei.com/learn-japanese-grammar/%E3%82%92%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84-o-kudasai-meaning/) | o kudasai | please give me ~ | minta … | ➖ tidak disebut |  | Ujian internal (文法 no.15) menguji ～を二つください. |
| 62 | [しかし](https://jlptsensei.com/learn-japanese-grammar/%E3%81%97%E3%81%8B%E3%81%97-shikashi-meaning/) | shikashi | but; however ~ | akan tetapi | ➖ tidak disebut |  |  |
| 63 | [それから](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9D%E3%82%8C%E3%81%8B%E3%82%89-sore-kara-meaning/) | sore kara | and; and then; after that; since then | lalu, setelah itu | ✅ boleh |  |  |
| 64 | [そして](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9D%E3%81%97%E3%81%A6-soshite-meaning/) | soshite | and; and then; thus; and now ~ | dan, lalu | ✅ boleh |  |  |
| 65 | [すぎる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%99%E3%81%8E%E3%82%8B-sugiru-%E9%81%8E%E3%81%8E%E3%82%8B-meaning/) | sugiru | too much | terlalu | ➖ tidak disebut | #93 L1 |  |
| 66 | [たことがある](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%81%93%E3%81%A8%E3%81%8C%E3%81%82%E3%82%8B-ta-koto-ga-aru-meaning/) | ta koto ga aru | to have done something before | pernah … | ➖ tidak disebut | #40 L1, #41 L1 |  |
| 67 | [たい](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%81%84-tai-meaning/) | tai | want to do something | ingin (melakukan) | ✅ boleh | #1 L1 |  |
| 68 | [たり～たり](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%82%8A%EF%BD%9E%E3%81%9F%E3%82%8A%E3%81%99%E3%82%8B-tari-tari-suru-meaning/) | tari~tari | do such things as A and B | melakukan … dan … (antara lain) | ✅ boleh |  |  |
| 69 | [てある](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%82%E3%82%8B-te-aru-meaning/) | te aru | is/has been done (resulting state) | sudah di-… (keadaan hasil) | ➖ tidak disebut |  | Tidak ada di modul N4 juga. |
| 70 | [ている](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%84%E3%82%8B-te-iru-meaning/) | te iru | ongoing action or current state | sedang …; keadaan | ✅ boleh |  |  |
| 71 | [てから](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%8B%E3%82%89-te-kara-meaning/) | te kara | after doing ~ | setelah … | ✅ boleh |  |  |
| 72 | [てください](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84-te-kudasai-meaning/) | te kudasai | please do | tolong … | ✅ boleh |  |  |
| 73 | [てはいけない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%AF%E3%81%84%E3%81%91%E3%81%AA%E3%81%84-te-wa-ikenai-meaning/) | te wa ikenai | must not; may not; cannot | tidak boleh … | ✅ boleh | #19 L1 | Disebut di spesifikasi bank, tidak di prompt AI. |
| 74 | [てもいいです](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%82%82%E3%81%84%E3%81%84%E3%81%A7%E3%81%99%E3%81%8B-temo-ii-desu-ka-meaning/) | temo ii desu | is OK to ~; is alright to ~; may I ~? | boleh … | ✅ boleh | #18 L1 |  |
| 75 | [と](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8-to-particle-meaning/) | to | and; with; as; connecting particle | dan; bersama; (kutipan) | ✅ dasar |  |  |
| 76 | [とき](https://jlptsensei.com/learn-japanese-grammar/%E6%99%82-%E3%81%A8%E3%81%8D-toki-meaning/) | toki | when; at this time | ketika, saat | ✅ boleh |  | Disebut di spesifikasi bank. |
| 77 | [とても](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E3%81%A6%E3%82%82-totemo-meaning/) | totemo | very; awfully; exceedingly​ | sangat | ✅ dasar |  |  |
| 78 | [つもり](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A4%E3%82%82%E3%82%8A-tsumori-meaning/) | tsumori | plan to ~; intend to ~ | berniat, berencana | ⛔ dilarang | #3 L1 | Dilarang di prompt N5 dan spesifikasi bank. |
| 79 | [は](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AF-wa-topic-marker-meaning/) | wa - topic marker | topic marker | penanda topik | ✅ dasar |  |  |
| 80 | [は〜より・・・です](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AF%E3%80%9C%E3%82%88%E3%82%8A-%E3%81%A7%E3%81%99-wa-yori-desu-meaning/) | wa ~yori... desu | [Noun-1] is more ~ than [Noun-2] | A lebih … daripada B | ✅ boleh | #97 L1 |  |
| 81 | [はどうですか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AF%E3%81%A9%E3%81%86%E3%81%A7%E3%81%99%E3%81%8B-wa-dou-desu-ka-meaning/) | wa dou desu ka | how about; how is | bagaimana dengan …? | ➖ tidak disebut |  |  |
| 82 | [や](https://jlptsensei.com/learn-japanese-grammar/%E3%82%84-ya-particle-meaning/) | ya | and; or; connecting particle | … dan … (dsb.) | ✅ dasar |  |  |
| 83 | [よ](https://jlptsensei.com/learn-japanese-grammar/%E3%82%88-yo-ending-particle-meaning/) | yo | you know; emphasis (ending particle) | lho (penegasan) | ✅ dasar |  |  |
| 84 | [より～ほうが](https://jlptsensei.com/learn-japanese-grammar/%E3%82%88%E3%82%8A%EF%BD%9E%E3%81%AE%E3%81%BB%E3%81%86%E3%81%8C-yori-no-hou-ga-meaning/) | yori ~hou ga | [2] is more than [1] | B lebih … daripada A | ✅ boleh | #98 L1, #100 L1 |  |
