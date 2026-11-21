# Tata bahasa N4 — daftar jlptsensei vs modul "111 Bunpo N4"

> Sumber: [jlptsensei.com/jlpt-n4-grammar-list](https://jlptsensei.com/jlpt-n4-grammar-list/) · diambil 2026-11-20 · **132 pola** (cocok dengan total di situs).
> Modul: `server/domain/bankSoal/bunpouN4.js` (104 pola, level L1–L5). Untuk N4, **modul adalah acuan resmi
> JOYdata** (keputusan user 2026-11-10: dokkai N4 melatih pola yang diajarkan sensei). Daftar jlptsensei di sini
> dipakai untuk melihat **cakupan** dan **beda klasifikasi**, bukan untuk menggantikan modul.

## Ringkasan

| Status | Arti | Jumlah |
|---|---|---|
| 📘 modul | ada padanannya di modul (kolom Modul = nomor + level dokkai) | 62 |
| ✅ pendukung | tidak di modul, tetapi spesifikasi bank N4 membolehkannya sebagai pola pendukung | 6 |
| ➖ tidak disebut | tidak ada di modul, tidak disebut prompt/spesifikasi | 62 |
| ⛔ dilarang | prompt N4 melarangnya (sebagai "pola N3") | 2 |

Pemetaan pola jlptsensei ↔ modul dibuat manual (penulisan pola berbeda), jadi mohon dicek. Satu pola jlptsensei bisa
menunjuk beberapa nomor modul (mis. 受身形 → #56–58).

## Temuan utama

1. **Beda klasifikasi yang langsung memengaruhi prompt:** prompt N4 melarang `～ようにする` dan kausatif-pasif `～させられる`
   sebagai "pola N3", dan prompt N3 memakai keduanya sebagai contoh pola N3. jlptsensei menggolongkan keduanya **N4** (#128, #73).
   Modul tidak memuat keduanya, tetapi kelas N4 juga memakai Minna no Nihongo II, dan **～ようにする diajarkan di Bab 36**
   (ようにしています／ようにしてください). Jadi larangan ～ようにする bertentangan dengan kurikulum; ～させられる tidak ada di
   Minna maupun modul. Rekomendasi: [11-sumber-pembanding.md § D8](11-sumber-pembanding.md).
2. **Pola N4 jlptsensei yang tidak tercakup modul dan tidak disebut** (62 pola), antara lain yang lazim di
   bacaan sehari-hari: `～そうだ` (katanya, #81), `～予定だ` (#124), `～ようだ` (#125), `～ように／ような` (#126), `～と聞いた` (#113),
   `～場合は` (#6), `～おきに` (#67), `～ていた` (#95), `～たばかり` (#84), `～が必要` / `必要がある` (#13, #21), `～てよかった` (#105).
   Sampel resmi N4 sendiri memakai pola di luar modul, misalnya `～間` (#1), `～について` (N3 di jlptsensei), `ぜひ` (#130),
   dan `～しか～ない`. Perlu keputusan: biarkan bebas sebagai pendukung, atau larang agar bacaan tidak memakai pola yang
   belum diajarkan.
3. **Modul memuat 40 pola yang tidak ada di daftar N4 jlptsensei** — sebagian besar pola N5 (pengulangan
   dasar di L1–L2) dan kata kerja keigo yang jlptsensei catat sebagai **kosakata** N4. Tiga pola modul tergolong **N3** di
   jlptsensei: `ため(に)` (#4), `V(よ)うとする` (#2), `てばかりいる` (#38).

> ⚠️ Daftar jlptsensei bukan daftar resmi JLPT (lihat catatan di [03-tata-bahasa-n5.md](03-tata-bahasa-n5.md)).

## Daftar lengkap jlptsensei N4

| # | Pola | Romaji | Arti (EN) | Arti (ID) | Status JOYdata | Modul | Catatan |
|---|---|---|---|---|---|---|---|
| 1 | [間（あいだ）](https://jlptsensei.com/learn-japanese-grammar/%E9%96%93-aida-meaning/) | aida | while; during; between ~ | selama, di antara | ✅ pendukung |  | Spesifikasi bank N4: pendukung. |
| 2 | [間に（あいだに）](https://jlptsensei.com/learn-japanese-grammar/%E9%96%93%E3%81%AB-aida-ni-meaning/) | aida ni | while; during~ something happened | selagi … (terjadi sesuatu) | ✅ pendukung |  | Spesifikasi bank N4: pendukung. |
| 3 | [あまり～ない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%82%E3%81%BE%E3%82%8A%EF%BD%9E%E3%81%AA%E3%81%84-amarinai-meaning/) | amari~nai | not very, not much ~ | tidak begitu … | ➖ tidak disebut |  |  |
| 4 | [後で（あとで）](https://jlptsensei.com/learn-japanese-grammar/%E5%BE%8C%E3%81%A7-%E3%81%82%E3%81%A8%E3%81%A7-ato-de-meaning/) | ato de | after~; later | setelah …; nanti | ➖ tidak disebut |  | Prompt dan spesifikasi N5 membolehkan ～あとで; sampel resmi N5 juga memakainya. |
| 5 | [ば](https://jlptsensei.com/learn-japanese-grammar/%E3%81%B0-ba-conditional-form-meaning/) | ba | conditional form; If [A] then [B] | jika (bentuk ば) | 📘 modul | #12 L3 |  |
| 6 | [場合は（ばあいは）](https://jlptsensei.com/learn-japanese-grammar/%E5%A0%B4%E5%90%88%E3%81%AF-baai-wa-meaning/) | baai wa | in the event of; in the case that ~ | dalam hal …, jika terjadi … | ➖ tidak disebut |  |  |
| 7 | [ばかり](https://jlptsensei.com/learn-japanese-grammar/%E3%81%B0%E3%81%8B%E3%82%8A-bakari-meaning/) | bakari | only; nothing but ~ | hanya/melulu … | 📘 modul | #95 L2 |  |
| 8 | [だけで](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A0%E3%81%91%E3%81%A7-dake-de-meaning/) | dake de | just by; just by doing | hanya dengan … | ➖ tidak disebut |  |  |
| 9 | [出す（だす）](https://jlptsensei.com/learn-japanese-grammar/%E5%87%BA%E3%81%99-dasu-meaning/) | dasu | to begin to; to start to; to burst into; ... out (e.g. to jump out, to carry out)​ | mulai … (tiba-tiba); … keluar | ➖ tidak disebut |  |  |
| 10 | [でございます](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A7%E3%81%94%E3%81%96%E3%81%84%E3%81%BE%E3%81%99-de-gozaimasu-meaning/) | de gozaimasu | to be (honorific) | adalah (sangat sopan) | 📘 modul | #89 L4 |  |
| 11 | [でも](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A7%E3%82%82-demo-meaning-something/) | demo | ... or something; how about~ | … atau semacamnya (お茶でも) | ➖ tidak disebut |  |  |
| 12 | [ではないか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A7%E3%81%AF%E3%81%AA%E3%81%84%E3%81%8B-dewa-nai-ka-meaning/) | dewa nai ka | right?; isn't it? | bukankah …? | ➖ tidak disebut |  |  |
| 13 | [が必要（がひつよう）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8C%E5%BF%85%E8%A6%81-ga-hitsuyou-meaning/) | ga hitsuyou | need; necessary | perlu … | ➖ tidak disebut |  |  |
| 14 | [がする](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8C%E3%81%99%E3%82%8B-ga-suru-meaning/) | ga suru | to smell; hear; taste | tercium/terdengar/terasa | 📘 modul | #48 L3 |  |
| 15 | [がり](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8C%E3%82%8A-gari-meaning/) | gari | personality (someone tends to; has a tendency to; has a sensitivity to ~) | orang yang mudah … (さむがり) | ➖ tidak disebut |  |  |
| 16 | [がる / がっている](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8C%E3%82%8B-garu-%E3%81%8C%E3%81%A3%E3%81%A6%E3%81%84%E3%82%8B-gatteiru-meaning/) | garu / gatteiru | to show signs of; to appear; to feel, to think ~ | (orang lain) tampak merasa/ingin … | ➖ tidak disebut |  |  |
| 17 | [ございます](https://jlptsensei.com/learn-japanese-grammar/%E3%81%94%E3%81%96%E3%81%84%E3%81%BE%E3%81%99-gozaimasu-meaning/) | gozaimasu | to be, to exist (the polite form of いる/ある) | ada (sopan dari ある) | 📘 modul | #89 L4 |  |
| 18 | [始める（はじめる）](https://jlptsensei.com/learn-japanese-grammar/%E5%A7%8B%E3%82%81%E3%82%8B-hajimeru-%E5%A7%8B%E3%82%81%E3%81%9F-meaning/) | hajimeru | to start; to begin to ~ | mulai … | ✅ pendukung |  | Spesifikasi bank N4: pendukung. |
| 19 | [はずだ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AF%E3%81%9A%E3%81%A0-hazu-da-meaning/) | hazu da | it must be; it should be (expectation) | seharusnya, mestinya | 📘 modul | #28 L3 |  |
| 20 | [はずがない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AF%E3%81%9A%E3%81%8C%E3%81%AA%E3%81%84-hazu-ga-nai-meaning/) | hazu ga nai | cannot be (impossible) | tidak mungkin | ➖ tidak disebut |  |  |
| 21 | [必要がある（ひつようがある）](https://jlptsensei.com/learn-japanese-grammar/%E5%BF%85%E8%A6%81%E3%81%8C%E3%81%82%E3%82%8B-hitsuyou-ga-aru-meaning/) | hitsuyou ga aru | need to; it is necessary to | perlu … | ➖ tidak disebut |  |  |
| 22 | [意向形 （いこうけい）](https://jlptsensei.com/learn-japanese-grammar/%E6%84%8F%E5%90%91%E5%BD%A2-ikou-kei-volitional-form-meaning/) | ikou kei - volitional form | volitional form​; let's do ~ | bentuk maksud/ajakan (行こう) | 📘 modul | #1 L1, #2 L4 |  |
| 23 | [いらっしゃる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%84%E3%82%89%E3%81%A3%E3%81%97%E3%82%83%E3%82%8B-irassharu-meaning/) | irassharu | to be; to come; to go (polite version) | ada/datang/pergi (sonkeigo) | 📘 modul | #74 L5 |  |
| 24 | [いたします](https://jlptsensei.com/learn-japanese-grammar/%E3%81%84%E3%81%9F%E3%81%97%E3%81%BE%E3%81%99-itashimasu-meaning/) | itashimasu | to do (polite form of する) | melakukan (kenjougo dari する) | 📘 modul | #72 L5, #81 L5 |  |
| 25 | [じゃないか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%98%E3%82%83%E3%81%AA%E3%81%84%E3%81%8B-janai-ka-meaning/) | janai ka | right? isn't it? let's~; confirmation | bukankah …? / ayo … (lisan) | ➖ tidak disebut |  |  |
| 26 | [かどうか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B%E3%81%A9%E3%81%86%E3%81%8B-ka-dou-ka-meaning/) | ka dou ka | whether or not ~ | apakah … atau tidak | 📘 modul | #31 L3 |  |
| 27 | [かしら](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B%E3%81%97%E3%82%89-ka-shira-meaning/) | ka shira | I wonder (feminine) | kira-kira … ya (feminin) | ➖ tidak disebut |  |  |
| 28 | [かい](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B%E3%81%84-kai-meaning/) | kai | turns a sentence into a yes/no question | partikel tanya (lisan) | ➖ tidak disebut |  |  |
| 29 | [かもしれない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B%E3%82%82%E3%81%97%E3%82%8C%E3%81%AA%E3%81%84-kamo-shirenai-meaning/) | kamo shirenai | might; perhaps; indicates possibility | mungkin | 📘 modul | #24 L3 |  |
| 30 | [かな](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B%E3%81%AA-kana-meaning/) | kana | I wonder; should I? | kira-kira … ya? | ➖ tidak disebut |  |  |
| 31 | [から作る（からつくる）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8B%E3%82%89%E4%BD%9C%E3%82%8B-%E4%BD%9C%E3%82%89%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B-kara-tsukuru-meaning/) | kara tsukuru | made from; made with | dibuat dari | ➖ tidak disebut |  |  |
| 32 | [きっと](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8D%E3%81%A3%E3%81%A8-kitto-meaning/) | kitto | surely; undoubtedly; almost certainly; most likely | pasti, tentu | ➖ tidak disebut |  |  |
| 33 | [頃（ころ / ごろ）](https://jlptsensei.com/learn-japanese-grammar/%E9%A0%83-%E3%81%93%E3%82%8D-%E3%81%94%E3%82%8D-meaning/) | koro / goro | around; about; when | sekitar (waktu); ketika | ➖ tidak disebut |  |  |
| 34 | [こと](https://jlptsensei.com/learn-japanese-grammar/%E3%81%93%E3%81%A8-koto-meaning/) | koto | Verb nominalizer | pembendaan kata kerja | 📘 modul | #94 L2 |  |
| 35 | [ことがある](https://jlptsensei.com/learn-japanese-grammar/%E3%81%93%E3%81%A8%E3%81%8C%E3%81%82%E3%82%8B-koto-ga-aru-meaning/) | koto ga aru | there are times when | kadang-kadang … | ➖ tidak disebut |  |  |
| 36 | [ことができる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%82%8B-koto-ga-dekiru-%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%81%8B-meaning/) | koto ga dekiru | can; able to | dapat, bisa | 📘 modul | #33 L1 |  |
| 37 | [ことになる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%93%E3%81%A8%E3%81%AB%E3%81%AA%E3%82%8B-koto-ni-naru-meaning/) | koto ni naru | It has been decided that..; it turns out that.. | diputuskan bahwa … (oleh pihak lain) | 📘 modul | #6 L3 |  |
| 38 | [ことにする](https://jlptsensei.com/learn-japanese-grammar/%E3%81%93%E3%81%A8%E3%81%AB%E3%81%99%E3%82%8B-koto-ni-suru-meaning/) | koto ni suru | to decide on | memutuskan untuk … | 📘 modul | #5 L3 |  |
| 39 | [くする](https://jlptsensei.com/learn-japanese-grammar/%E3%81%84-adjective-%E3%81%8F%E3%81%99%E3%82%8B-ku-suru-meaning/) | ku suru | to make something ~ | membuat jadi … (kata sifat -i) | ➖ tidak disebut |  |  |
| 40 | [急に（きゅうに）](https://jlptsensei.com/learn-japanese-grammar/%E6%80%A5%E3%81%AB-kyuu-ni-meaning/) | kyuu ni | quickly; immediately; hastily; suddenly; abruptly; unexpectedly ~ | tiba-tiba | ➖ tidak disebut |  |  |
| 41 | [までに](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%A7%E3%81%AB-made-ni-meaning/) | made ni | by; by the time; indicates time limit | paling lambat, sebelum | 📘 modul | #45 L2 |  |
| 42 | [まま](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%BE-mama-meaning/) | mama | as it is; current state; without changing | dalam keadaan tetap, dibiarkan | 📘 modul | #46 L3 |  |
| 43 | [または](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BE%E3%81%9F%E3%81%AF-matawa-meaning/) | matawa | both; or; otherwise​; choice between [A] or [B] | atau | ➖ tidak disebut |  |  |
| 44 | [みたいだ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BF%E3%81%9F%E3%81%84%E3%81%A0-mitai-da-meaning/) | mitai da | like; similar to; resembling ~ | sepertinya, mirip | 📘 modul | #29 L4 |  |
| 45 | [みたいな](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BF%E3%81%9F%E3%81%84%E3%81%AA-mitai-na-meaning/) | mitai na | like, similar to ~ | … seperti (penjelas kata benda) | 📘 modul | #29 L4 |  |
| 46 | [みたいに](https://jlptsensei.com/learn-japanese-grammar/%E3%81%BF%E3%81%9F%E3%81%84%E3%81%AB-mitai-ni-meaning/) | mitai ni | like; similar to ~ | seperti (keterangan) | 📘 modul | #29 L4 |  |
| 47 | [も](https://jlptsensei.com/learn-japanese-grammar/%E3%82%82-mo-meaning-as-many-as/) | mo | as many as; as much as; up to; nearly ~ | sebanyak … (penekanan jumlah) | 📘 modul | #96 L2 |  |
| 48 | [な](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA-na-meaning-order-dont-do/) | na | don’t ~ (order somebody to not do something) | jangan! (larangan keras) | 📘 modul | #23 L3 |  |
| 49 | [など](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%A9-nado-meaning/) | nado | such as; things like ~ | dan sebagainya, seperti | ➖ tidak disebut |  |  |
| 50 | [ながら](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%8C%E3%82%89-nagara-meaning/) | nagara | while; during; as; simultaneously | sambil | ✅ pendukung |  | Spesifikasi bank N4: pendukung (boleh, bukan inti soal). |
| 51 | [なかなか～ない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%8B%E3%81%AA%E3%81%8B%EF%BD%9E%E3%81%AA%E3%81%84-nakanaka-nai-meaning/) | nakanaka~nai | not easy to; struggling to; not able to ~ | tidak mudah, tak kunjung … | ➖ tidak disebut |  |  |
| 52 | [なければいけない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%91%E3%82%8C%E3%81%B0%E3%81%84%E3%81%91%E3%81%AA%E3%81%84-nakereba-ikenai-meaning/) | nakereba ikenai | must do something; have to do something | harus … | 📘 modul | #20 L2 | Modul hanya memuat bentuk ならない (#20) dan なくてはいけない (#21). |
| 53 | [なければならない](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%91%E3%82%8C%E3%81%B0%E3%81%AA%E3%82%89%E3%81%AA%E3%81%84-nakereba-naranai-meaning/) | nakereba naranai | must do something; have to do something | harus … | 📘 modul | #20 L2 |  |
| 54 | [なら](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%82%89-nara-meaning/) | nara | if; in the case that ~ | kalau (mengenai) … | 📘 modul | #14 L3, #15 L3 |  |
| 55 | [なさい](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%95%E3%81%84-nasai-meaning/) | nasai | do this (soft/firm command) | …lah! (perintah halus) | ➖ tidak disebut |  | Modul #50 命令形 (perintah kasar), bukan ～なさい. |
| 56 | [なさる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA%E3%81%95%E3%82%8B-nasaru-%E3%81%AA%E3%81%95%E3%81%84%E3%81%BE%E3%81%99-meaning/) | nasaru | to do (honorific) | melakukan (sonkeigo) | 📘 modul | #79 L5 |  |
| 57 | [に気がつく（にきがつく）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AB%E6%B0%97%E3%81%8C%E3%81%A4%E3%81%8F-ni-ki-ga-tsuku-meaning/) | ni ki ga tsuku | to notice; to realize | menyadari | ➖ tidak disebut |  |  |
| 58 | [に見える（にみえる）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AB%E3%81%BF%E3%81%88%E3%82%8B-%E3%81%AB%E8%A6%8B%E3%81%88%E3%82%8B-ni-mieru-meaning/) | ni mieru | to look; to seem; to appear | kelihatan seperti | ➖ tidak disebut |  |  |
| 59 | [にする](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AA-adjective-%E3%81%AB%E3%81%99%E3%82%8B-ni-suru-meaning/) | ni suru | to make something ~ | membuat jadi … (kata sifat -na, kata benda) | ➖ tidak disebut |  |  |
| 60 | [にくい](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AB%E3%81%8F%E3%81%84-nikui-meaning/) | nikui | difficult to do ~ | sulit … | 📘 modul | #92 L1 |  |
| 61 | [の中で（のなかで）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E4%B8%AD%E3%81%A7-no-naka-de-meaning/) | no naka de | in; among ~ | di antara | ➖ tidak disebut |  |  |
| 62 | [のに](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E3%81%AB-noni-meaning-even-though/) | noni | although, in spite of, even though ~ | padahal | 📘 modul | #52 L3 |  |
| 63 | [のに](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E3%81%AB-noni-meaning-to-do/) | noni | to (do something); in order to ~ | untuk (tujuan) | ➖ tidak disebut |  |  |
| 64 | [のは〜だ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AE%E3%81%AF%E3%80%9C%E3%81%A0-nowa-da-meaning/) | nowa~da | [A] is [B]; the reason for [A] is [B] | yang … adalah ～ | ➖ tidak disebut |  |  |
| 65 | [お～ください](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8A%EF%BD%9E%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84-o-kudasai-meaning/) | o~kudasai | please do ~ (honorific) | silakan … (sopan) | 📘 modul | #70 L4 |  |
| 66 | [お～になる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8A%EF%BD%9E%E3%81%AB%E3%81%AA%E3%82%8B-o-ni-naru-meaning/) | o~ni naru | to do (honorific) | melakukan (sonkeigo) | 📘 modul | #69 L5 |  |
| 67 | [おきに](https://jlptsensei.com/learn-japanese-grammar/%E3%81%8A%E3%81%8D%E3%81%AB-oki-ni-meaning/) | oki ni | repeated at intervals, every ~ | setiap selang … | ➖ tidak disebut |  |  |
| 68 | [終わる（おわる）](https://jlptsensei.com/learn-japanese-grammar/%E7%B5%82%E3%82%8F%E3%82%8B-%E3%81%8A%E3%82%8F%E3%82%8B-owaru-meaning/) | owaru | to finish; to end~ | selesai … | ✅ pendukung |  | Spesifikasi bank N4: pendukung. |
| 69 | [られる](https://jlptsensei.com/learn-japanese-grammar/%E3%82%89%E3%82%8C%E3%82%8B-rareru-japanese-potential-form/) | rareru | potential form; ability or inability to do something | bentuk potensial (bisa) | 📘 modul | #34 L1 |  |
| 70 | [らしい](https://jlptsensei.com/learn-japanese-grammar/%E3%82%89%E3%81%97%E3%81%84-rashii-meaning/) | rashii | it seems like; I heard; apparently ~ | sepertinya; katanya | 📘 modul | #30 L4 |  |
| 71 | [さ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%95-sa-meaning/) | sa | -ness​ ; nominalizer for adjective | pembendaan kata sifat (-nya) | 📘 modul | #101 L3 |  |
| 72 | [さっき](https://jlptsensei.com/learn-japanese-grammar/%E3%81%95%E3%81%A3%E3%81%8D-sakki-meaning/) | sakki | some time ago; just now | tadi | ➖ tidak disebut |  |  |
| 73 | [させられる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%95%E3%81%9B%E3%82%89%E3%82%8C%E3%82%8B-saserareru-meaning-causative-passive-form/) | saserareru | causative-passive; to be made to do something | dipaksa … (kausatif-pasif) | ⛔ dilarang |  | Prompt N4 melarangnya sebagai pola N3; jlptsensei menggolongkannya N4. Tidak ada di modul. |
| 74 | [させる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%95%E3%81%9B%E3%82%8B-saseru-causative-form-meaning/) | saseru | causative form; to make/let somebody do something | menyuruh/membiarkan … (kausatif) | 📘 modul | #59 L4, #60 L4 |  |
| 75 | [させてください](https://jlptsensei.com/learn-japanese-grammar/%E3%81%95%E3%81%9B%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84-sasete-kudasai-meaning/) | sasete kudasai | please let me do | izinkan saya … | 📘 modul | #61 L4 |  |
| 76 | [さすが](https://jlptsensei.com/learn-japanese-grammar/%E3%81%95%E3%81%99%E3%81%8C%E3%81%AB-sasuga-ni-meaning/) | sasuga | as one would expect; as is to be expected; even ~ | memang hebat, sudah sewajarnya | ➖ tidak disebut |  |  |
| 77 | [し](https://jlptsensei.com/learn-japanese-grammar/%E3%81%97-shi-meaning/) | shi | and; and what’s more ~ (emphasis) | lagi pula …, dan juga | 📘 modul | #53 L2 |  |
| 78 | [そんなに](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9D%E3%82%93%E3%81%AA%E3%81%AB-sonnna-ni-meaning/) | sonna ni | so much; so; like that | begitu | ➖ tidak disebut |  |  |
| 79 | [それでも](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9D%E3%82%8C%E3%81%A7%E3%82%82-sore-demo-meaning/) | sore demo | but still; and yet; even so ~ | meskipun begitu | ➖ tidak disebut |  |  |
| 80 | [それに](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9D%E3%82%8C%E3%81%AB-sore-ni-meaning/) | sore ni | besides; in addition; also; moreover ~ | lagi pula, selain itu | ➖ tidak disebut |  |  |
| 81 | [そうだ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9D%E3%81%86%E3%81%A0-sou-da-i-heard-that/) | sou da [1] | I heard that; it is said that ~ | katanya (kabar) | ➖ tidak disebut |  | Modul #25 hanya ～そうだ "kelihatannya"; ～そうだ "katanya" tidak ada di modul. |
| 82 | [そうだ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9D%E3%81%86%E3%81%A0-sou-da-looks-like/) | sou da [2] | looks like; appears like; seeming ~ | kelihatannya (kesan) | 📘 modul | #25 L3 |  |
| 83 | [そうに / そうな](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9D%E3%81%86%E3%81%AB-%E3%81%9D%E3%81%86%E3%81%AA-sou-ni-sou-na-meaning/) | sou ni / sou na | seems like; looks like ~ | kelihatan … (keterangan, penjelas) | 📘 modul | #25 L3 |  |
| 84 | [たばかり](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%81%B0%E3%81%8B%E3%82%8A-ta-bakari-meaning/) | ta bakari | just finished; something just occurred | baru saja … | ➖ tidak disebut |  |  |
| 85 | [たところ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%81%A8%E3%81%93%E3%82%8D-ta-tokoro-meaning/) | ta tokoro | just finished doing, was just doing | baru saja selesai … | 📘 modul | #44 L4 |  |
| 86 | [他動詞 & 自動詞（たどうし & じどうし）](https://jlptsensei.com/learn-japanese-grammar/%E4%BB%96%E5%8B%95%E8%A9%9E-%E8%87%AA%E5%8B%95%E8%A9%9E-transitive-intransitive-verbs-meaning/) | tadoushi & jidoushi | Transitive & Intransitive Verbs | kata kerja transitif & intransitif | ➖ tidak disebut |  |  |
| 87 | [たがる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%81%8C%E3%82%8B-tagaru-meaning/) | tagaru | wants to do ~ (third person) | (orang lain) ingin … | ➖ tidak disebut |  |  |
| 88 | [たら](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%82%89-tara-meaning/) | tara | if; after; when ~ | kalau, setelah | 📘 modul | #11 L2 |  |
| 89 | [たらどう](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%82%89%E3%81%A9%E3%81%86-tara-dou-meaning/) | tara dou | why don't you; how about ~ (used to give advice) | bagaimana kalau …? (saran) | ➖ tidak disebut |  |  |
| 90 | [たらいいですか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9F%E3%82%89%E3%81%84%E3%81%84%E3%81%A7%E3%81%99%E3%81%8B-tara-ii-desu-ka-meaning/) | tara ii desu ka | what should I do?; speaker seeking instructions from listener | sebaiknya saya … bagaimana? | ➖ tidak disebut |  |  |
| 91 | [て / で](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6-%E3%81%A7-te-de-conjunctive-particle-meaning/) | te / de | conjunctive particle; so; because of [A], [B]... | karena (sebab) | ➖ tidak disebut |  |  |
| 92 | [てあげる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%82%E3%81%92%E3%82%8B-te-ageru-%E3%81%A6%E3%81%82%E3%81%92%E3%81%BE%E3%81%99-te-agemasu-meaning/) | te ageru | to do for; to do a favor | melakukan … untuk orang lain | 📘 modul | #62 L4 |  |
| 93 | [てほしい](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E6%AC%B2%E3%81%97%E3%81%84-%E3%81%A6%E3%81%BB%E3%81%97%E3%81%84-te-hoshii-meaning/) | te hoshii | I want you to; need you to ~ | ingin orang lain … | 📘 modul | #9 L3 |  |
| 94 | [ていく](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%84%E3%81%8F-te-iku-%E3%81%A6%E3%81%84%E3%81%A3%E3%81%9F-te-itta-meaning/) | te iku | to start; to continue; to go on | … terus (ke depan) | 📘 modul | #36 L4 |  |
| 95 | [ていた](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%84%E3%81%9F-te-ita-meaning/) | te ita | was doing something (past continuous) | tadinya sedang … | ➖ tidak disebut |  |  |
| 96 | [ていただけませんか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%84%E3%81%9F%E3%81%A0%E3%81%91%E3%81%BE%E3%81%9B%E3%82%93%E3%81%8B-te-itadakemasen-ka-meaning/) | te itadakemasen ka | could you please ~ | bisakah Anda … (sangat sopan) | 📘 modul | #67 L5 |  |
| 97 | [てくれる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%8F%E3%82%8C%E3%82%8B-te-kureru-%E3%81%A6%E3%81%8F%E3%82%8C%E3%81%9F-te-kureta-meaning/) | te kureru | to do a favor; do something for someone | (orang lain) melakukan … untuk saya | 📘 modul | #63 L4 |  |
| 98 | [てくる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%8F%E3%82%8B-te-kuru-%E3%81%A6%E3%81%8D%E3%81%BE%E3%81%99-te-kimasu-meaning/) | te kuru | to do… and come back; to become; to continue; to start ~ | mulai …; … terus sampai sekarang | 📘 modul | #37 L4 |  |
| 99 | [てみる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%BF%E3%82%8B-te-miru-%E3%81%A6%E3%81%BF%E3%81%9F%E3%81%84-te-mitai-meaning/) | te miru | try doing | mencoba … | 📘 modul | #8 L2 |  |
| 100 | [てもらう](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%82%82%E3%82%89%E3%81%86-te-morau-%E3%81%A6%E3%82%82%E3%82%89%E3%81%84%E3%81%9F%E3%81%84-te-moraitai-meaning/) | te morau | to get somebody to do something | meminta/mendapat bantuan … | 📘 modul | #64 L4 |  |
| 101 | [ておく](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%8A%E3%81%8F-te-oku-meaning/) | te oku | to do something in advance | melakukan … sebagai persiapan | 📘 modul | #7 L2 |  |
| 102 | [てしまう / ちゃう](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%97%E3%81%BE%E3%81%86-te-shimau-%E3%81%A1%E3%82%83%E3%81%86-meaning/) | te shimau / chau | to do something by accident, to finish completely | telanjur; sudah habis … | ✅ pendukung |  | Spesifikasi bank N4: pendukung. |
| 103 | [てすみません](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%99%E3%81%BF%E3%81%BE%E3%81%9B%E3%82%93-te-sumimasen-meaning/) | te sumimasen | I’m sorry for | maaf telah … | ➖ tidak disebut |  |  |
| 104 | [てやる](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%82%84%E3%82%8B-te-yaru-meaning/) | te yaru | to do for; to do a favor (casual) | melakukan … untuk bawahan/hewan (kasual) | 📘 modul | #68 L4 |  |
| 105 | [てよかった](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%82%88%E3%81%8B%E3%81%A3%E3%81%9F-te-yokatta-meaning/) | te yokatta | I’m glad that ~ | syukurlah sudah … | ➖ tidak disebut |  |  |
| 106 | [ているところ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%81%84%E3%82%8B%E3%81%A8%E3%81%93%E3%82%8D-teiru-tokoro-meaning/) | teiru tokoro | in the process of doing | sedang dalam proses … | 📘 modul | #43 L2 |  |
| 107 | [ても](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A6%E3%82%82-temo-meaning/) | temo | even; even if; even though ~ | meskipun | 📘 modul | #16 L2 |  |
| 108 | [と](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8-to-meaning-whenever/) | to | whenever [A] happens, [B] also happens | kalau/setiap … (pasti terjadi) | 📘 modul | #13 L2 |  |
| 109 | [と言ってもいい（といってもいい）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E8%A8%80%E3%81%A3%E3%81%A6%E3%82%82%E3%81%84%E3%81%84-to-ittemo-ii-meaning/) | to ittemo ii | you could say; one might say; I'd say ~ | bisa dikatakan | ➖ tidak disebut |  |  |
| 110 | [という](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E3%81%84%E3%81%86-to-iu-meaning/) | to iu | called; named; that ~ | yang bernama; bahwa | 📘 modul | #104 L1 | Modul #104 ～と言う (sebagian: menyebut nama). |
| 111 | [ということ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E3%81%84%E3%81%86%E3%81%93%E3%81%A8-to-iu-koto-meaning/) | to iu koto | convert phrase into noun | hal bahwa … | ➖ tidak disebut |  |  |
| 112 | [と言われている（といわれている）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E8%A8%80%E3%82%8F%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B-to-iwarete-iru-meaning/) | to iwarete iru | it is said that ~ | dikatakan bahwa … | ➖ tidak disebut |  |  |
| 113 | [と聞いた（ときいた）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E8%81%9E%E3%81%84%E3%81%9F-%E3%81%A8%E3%81%8D%E3%81%84%E3%81%9F-to-kiita-meaning/) | to kiita | I heard... | saya dengar … | ➖ tidak disebut |  |  |
| 114 | [と思う（とおもう）](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E6%80%9D%E3%81%86-to-omou-meaning/) | to omou | to think…; I think…; you think… | menurut saya, saya pikir | 📘 modul | #26 L2 | Prompt N5 membolehkan ～と思います. |
| 115 | [とか～とか](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E3%81%8B%EF%BD%9E%E3%81%A8%E3%81%8B-toka-toka-meaning/) | toka~toka | among other things; such as; like ~ | … atau … (contoh) | 📘 modul | #54 L2 |  |
| 116 | [ところ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A8%E3%81%93%E3%82%8D-tokoro-meaning/) | tokoro | just about to; on the verge of doing something | baru akan … | 📘 modul | #42 L4 |  |
| 117 | [続ける（つづける）](https://jlptsensei.com/learn-japanese-grammar/%E7%B6%9A%E3%81%91%E3%82%8B-tsuzukeru-%E7%B6%9A%E3%81%91%E3%81%A6%E3%81%84%E3%82%8B-meaning/) | tsuzukeru | continue to; keen on ~ | terus … | ➖ tidak disebut |  |  |
| 118 | [って](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A3%E3%81%A6-tte-meaning/) | tte | named; called ~ | yang bernama; katanya (lisan) | ➖ tidak disebut |  |  |
| 119 | [受身形（うけみけい）](https://jlptsensei.com/learn-japanese-grammar/%E5%8F%97%E8%BA%AB%E5%BD%A2-ukemi-japanese-passive-form/) | ukemi kei | passive form; passive voice | bentuk pasif | 📘 modul | #56 L4, #57 L4, #58 L4 |  |
| 120 | [は〜が… は](https://jlptsensei.com/learn-japanese-grammar/%E3%81%AF%E3%80%9C%E3%81%8C%EF%BD%9E%E3%81%AF-wa-ga-wa-meaning-but-however/) | wa~ga... wa | [A] but [B]; however; comparison | A …, tetapi B … (kontras) | ➖ tidak disebut |  |  |
| 121 | [やすい](https://jlptsensei.com/learn-japanese-grammar/%E3%82%84%E3%81%99%E3%81%84-yasui-meaning/) | yasui | easy to; likely to; prone to; have a tendency to ~ | mudah …; cenderung | 📘 modul | #90 L1, #91 L4 |  |
| 122 | [やっと](https://jlptsensei.com/learn-japanese-grammar/%E3%82%84%E3%81%A3%E3%81%A8-yatto-meaning/) | yatto | at last; finally; barely; narrowly ~ | akhirnya | ➖ tidak disebut |  |  |
| 123 | [より](https://jlptsensei.com/learn-japanese-grammar/%E3%82%88%E3%82%8A-yori-meaning/) | yori | than; rather than; more than ~ | daripada | 📘 modul | #97 L1, #100 L1 |  |
| 124 | [予定だ（よていだ）](https://jlptsensei.com/learn-japanese-grammar/%E4%BA%88%E5%AE%9A%E3%81%A0-yotei-da-meaning/) | yotei da | plan to, intend to | dijadwalkan, berencana | ➖ tidak disebut |  |  |
| 125 | [ようだ](https://jlptsensei.com/learn-japanese-grammar/%E3%82%88%E3%81%86%E3%81%A0-you-da-meaning/) | you da | appears; seems; looks as if ~ | tampaknya | ➖ tidak disebut |  |  |
| 126 | [ように / ような](https://jlptsensei.com/learn-japanese-grammar/%E3%82%88%E3%81%86%E3%81%AB-%E3%82%88%E3%81%86%E3%81%AA-you-ni-na-meaning/) | you ni / you na | like; as; similar to ~ | seperti | ➖ tidak disebut |  |  |
| 127 | [ようになる](https://jlptsensei.com/learn-japanese-grammar/%E3%82%88%E3%81%86%E3%81%AB%E3%81%AA%E3%82%8B-you-ni-naru-meaning/) | you ni naru | to reach the point that; to come to be that; to turn into ~ | menjadi (bisa/biasa) … | 📘 modul | #35 L2 |  |
| 128 | [ようにする](https://jlptsensei.com/learn-japanese-grammar/%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B-you-ni-suru-%E3%82%88%E3%81%86%E3%81%AB%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B-meaning/) | you ni suru | to try to; to make sure that ~ | berusaha agar … | ⛔ dilarang |  | Prompt N4 melarangnya sebagai pola N3 (dan prompt N3 memakainya sebagai contoh pola N3); jlptsensei: N4. Tidak ada di modul. |
| 129 | [ようと思う（ようとおもう）](https://jlptsensei.com/learn-japanese-grammar/%E3%82%88%E3%81%86%E3%81%A8%E6%80%9D%E3%81%86-you-to-omou-meaning/) | you to omou | thinking of doing; planning to ~ | bermaksud … | 📘 modul | #1 L1 |  |
| 130 | [ぜひ](https://jlptsensei.com/learn-japanese-grammar/%E3%81%9C%E3%81%B2-zehi-meaning/) | zehi | by all means; certainly; definitely ~ | pasti, sangat (berharap) | ➖ tidak disebut |  |  |
| 131 | [全然～ない（ぜんぜん～ない）](https://jlptsensei.com/learn-japanese-grammar/%E5%85%A8%E7%84%B6%EF%BD%9E%E3%81%AA%E3%81%84-zenzen-nai-meaning/) | zenzen~nai | (not) at all | sama sekali tidak | ➖ tidak disebut |  |  |
| 132 | [づらい](https://jlptsensei.com/learn-japanese-grammar/%E3%81%A5%E3%82%89%E3%81%84-zurai-meaning/) | zurai | difficult to do ~ | sulit/berat untuk … | ➖ tidak disebut |  |  |

## Pola modul yang tidak ada di daftar N4 jlptsensei

| Modul | Level | Pola modul | Arti (modul) | Posisi di jlptsensei |
|---|---|---|---|---|
| #3 | L1 | V つもりだ | Berniat/Berencana | N5 #78 つもり |
| #4 | L3 | V ため(に) | Demi/Untuk tujuan | N3 #118 ために |
| #10 | L1 | V 方 | Cara melakukan | N5 #24 方 |
| #17 | L3 | 疑問詞 + でも | Siapa pun / Mana pun / Kapan pun | — (tidak ada; mirip N4 #11 でも) |
| #18 | L1 | ～てもいい | Boleh/Diizinkan | N5 #74 てもいいです |
| #19 | L1 | ～てはいけない | Tidak boleh/Dilarang | N5 #73 てはいけない |
| #21 | L2 | ～なくてはいけない | Harus | N5 #43 なくてはいけない |
| #22 | L2 | ～なくてもいい | Tidak harus/Tidak perlu | N5 #41 なくてもいい |
| #27 | L3 | ～だろう | Mungkin/Sepertinya | N5 #4 だろう |
| #32 | L3 | 疑問詞 + ～か | Pertanyaan tersirat: Apakah/Siapa/Kapan... | — (tidak ada) |
| #38 | L4 | V てばかりいる | Kerjaannya melulu/Hanya... saja | N3 #124 てばかりいる |
| #39 | L1 | まだ V ていない | Masih belum melakukan | N5 #28 まだ～ていません |
| #40 | L1 | V たことがある | Pernah melakukan | N5 #66 たことがある |
| #41 | L1 | V たことがない | Tidak pernah melakukan | N5 #66 たことがある |
| #47 | L1 | N がある | Ada - Benda mati/Keberadaan | N5 #12 があります |
| #49 | L1 | N にする | Memilih/Menentukan pilihan | N5 #50 にする |
| #50 | L3 | V 命令形 | Bentuk Perintah | — (tidak ada di daftar grammar) |
| #51 | L2 | ～ので | Karena/Sebab - Halus & Obyektif | N5 #58 ので |
| #55 | L1 | N と N と どちら | Antara A dan B, yang mana...? | — (dekat N5 #57 / #84) |
| #65 | L5 | さしあげる / V てさしあげる | Memberi ke atasan/Sopan | kosakata N4 差し上げる |
| #66 | L5 | くださる / V てくださる | Atasan memberi ke saya | kosakata N4 下さる |
| #71 | L5 | お～する / ご～する | Bentuk Merendahkan Diri | — (pola keigo; tidak ada) |
| #73 | L5 | お～いただく / ご～いただく | Menerima kebaikan dari atasan | — (tidak ada) |
| #75 | L5 | おっしゃる | Berbicara/Berkata | kosakata N4 仰る |
| #76 | L5 | ごらんになる / ごらんください / ごらんくださる | Melihat | kosakata N4 ご覧になる |
| #77 | L5 | ごぞんじ | Mengetahui/Kenal | — (tidak ada) |
| #78 | L5 | めしあがる | Makan/Minum | kosakata N4 召し上がる |
| #80 | L5 | V(ら)れる [敬語] | Keigo Bentuk Pasif | — (tidak ada) |
| #82 | L5 | うかがう | Berkunjung/Bertanya | kosakata N4 伺う |
| #83 | L4 | おる / V ておる | Ada/Sedang | — (tidak ada) |
| #84 | L5 | ぞんじる / ぞんずる | Mengetahui/Pikir | — (tidak ada) |
| #85 | L5 | はいけんする | Melihat/Membaca | kosakata N4 拝見 |
| #86 | L5 | まいる | Datang/Pergi | kosakata N4 参る |
| #87 | L5 | もうしあげる | Mengucapkan/Menyampaikan - Kenjougo | kosakata N4 申し上げる |
| #88 | L5 | もうす | Nama saya... | kosakata N4 申す |
| #93 | L1 | ～すぎる | Terlalu... | N5 #65 すぎる |
| #98 | L1 | ～ほう | Pihak/Bagian yang... | N5 #84 より～ほうが |
| #99 | L2 | ～ほうがいい | Lebih baik... | N5 #15 ほうがいい |
| #102 | L2 | ～の | Pembendaan / Pengganti kata benda | N5 #52 の (sebagian) |
| #103 | L3 | ～のだ / ～んだ | Penjelasan/Alasan penjelas | N5 #46 んです / #53 のです |
