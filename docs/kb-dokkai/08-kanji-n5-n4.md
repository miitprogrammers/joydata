# Kanji N5 & N4 — daftar jlptsensei vs volume kanji JOYdata

> Sumber: [jlpt-n5-kanji-list](https://jlptsensei.com/jlpt-n5-kanji-list/) (80) dan [jlpt-n4-kanji-list](https://jlptsensei.com/jlpt-n4-kanji-list/) (167) · diambil 2026-11-20.
> Volume JOYdata dari `kanjiDariVolume()` di `server/domain/tesOnline.js` (kanji dasar + kanji dari kata-kata tiap volume).

## Mengapa ini penting untuk prompt

Aturan user: **kanji di dokkai selalu mengikuti volume yang dipilih sensei**, berapa pun level pola kalimatnya; kanji di
luar volume ditulis kana. Prompt mengirim daftar itu sebagai `kanjiBoleh`. Jadi yang membatasi kanji adalah volume,
bukan daftar JLPT. Tabel ini hanya menunjukkan seberapa jauh volume itu dari daftar JLPT.

## Ringkasan

| Hal | Angka |
|---|---|
| Kanji di volume N5 JOYdata (DASAR, VOL1, VOL2, VOL3, VOL4, VOL5) | 405 |
| Kanji di volume N4 JOYdata (N4VOL1, N4VOL2, N4VOL3, N4VOL4, N4VOL5) | 415 |
| Kanji di semua volume | 667 |
| Kanji N5 jlptsensei yang **tidak** ada di volume N5 | 0 |
| Kanji N4 jlptsensei yang sudah ada di volume N5 | 130 dari 167 |
| Kanji N4 jlptsensei yang tidak ada di volume mana pun | 5: 京 字 洋 曜 漢 |
| Kanji di volume JOYdata yang tidak ada di daftar N5/N4 jlptsensei | 425 |

Catatan:

- Semua 80 kanji N5 jlptsensei sudah tercakup volume N5. Volume N5 JOYdata (405 kanji) jauh lebih luas daripada
  daftar kanji N5 (80) karena volume disusun dari **kata** yang dipelajari (mis. 洗濯, 掃除, 郵便局), bukan dari daftar kanji JLPT.
- **曜 tidak ada di volume mana pun**, jadi 月曜日 dsb. selalu menjadi げつようび di bacaan. Ini sudah tercatat di spesifikasi
  bank N4; prompt AI belum menyebutnya (AI menulis 曜日{ようび} lalu validator/penyederhana mengubahnya ke kana).
- Kanji N4 lain yang tidak ada di volume: 京 字 洋 漢 (京都, 漢字, 洋服, 文字 akan selalu kana).

## Kanji N5 (80)

| # | Kanji | On | Kun | Arti (EN) | Volume JOYdata |
|---|---|---|---|---|---|
| 1 | 日 | ニチ, ジツ | ひ, -び, -か | day, sun, Japan, counter for days | DASAR, VOL1, VOL2, VOL3, N4VOL1, N4VOL4 |
| 2 | 一 | イチ | ひと(つ) | one | DASAR, VOL1, VOL3, VOL5, N4VOL1 |
| 3 | 国 | コク | くに | country | DASAR, VOL2, VOL3, N4VOL2 |
| 4 | 人 | ジン、 ニン | ひと | person | DASAR, VOL2, VOL3, VOL4, N4VOL2, N4VOL3, N4VOL4 |
| 5 | 年 | ネン | とし | year, counter for years | DASAR, VOL1, VOL2, VOL3, VOL5 |
| 6 | 大 | ダイ、 タイ | おお(きい) | large, big | DASAR, VOL1, VOL2, VOL3, N4VOL3 |
| 7 | 十 | ジュウ | とお、 と | ten, 10 | DASAR, N4VOL3 |
| 8 | 二 | ニ、 ジ | ふた(つ) | two, 2 | DASAR |
| 9 | 本 | ホン | もと | book, present, true, counter for long cylindrical things | DASAR, VOL3, VOL5 |
| 10 | 中 | チュウ | なか、 うち、 あた(る) | in, inside, middle, mean, center | DASAR, VOL3, VOL4, N4VOL3, N4VOL4, N4VOL5 |
| 11 | 長 | チョウ | なが(い)、 おさ | long, leader, superior, senior | DASAR, VOL4, N4VOL2, N4VOL3 |
| 12 | 出 | シュツ、 スイ | で(る)、 だ(す)、 い(でる) | exit, leave, go out | DASAR, VOL3, VOL4, N4VOL1, N4VOL4 |
| 13 | 三 | サン | み(つ) | three, 3 | DASAR |
| 14 | 時 | ジ | とき、 -どき | time, hour | DASAR, VOL3, VOL4, N4VOL3 |
| 15 | 行 | コウ、 ギョウ、 アン | い(く)、 ゆ(く)、 おこな(う) | going, journey, carry out, line, row | DASAR, VOL1, VOL2, VOL4, VOL5, N4VOL1, N4VOL2 |
| 16 | 見 | ケン | み(る)、 み(せる) | see, hopes, chances, idea, opinion, look at, visible | DASAR, VOL5, N4VOL1, N4VOL2, N4VOL4, N4VOL5 |
| 17 | 月 | ゲツ、 ガツ | つき | month, moon | DASAR, VOL3, VOL5, N4VOL3 |
| 18 | 分 | ブン、 フン、 ブ | わ(ける) | part, minute of time, understand | DASAR, VOL3, VOL5, N4VOL2, N4VOL3 |
| 19 | 後 | ゴ、 コウ | のち、 うし(ろ)、 あと | behind, back, later | DASAR, VOL1, VOL2, N4VOL2 |
| 20 | 前 | ゼン | まえ | in front, before | DASAR, VOL3, VOL4, VOL5 |
| 21 | 生 | セイ、 ショウ | い(きる)、 う(む)、 お(う)、 は(える)、 なま | life, genuine, birth | DASAR, VOL1, VOL2, VOL3, VOL5, N4VOL1, N4VOL2, N4VOL3 |
| 22 | 五 | ゴ | いつ(つ) | five, 5 | DASAR |
| 23 | 間 | カン、 ケン | あいだ、 ま、 あい | interval, space | DASAR, VOL3, N4VOL1, N4VOL4, N4VOL5 |
| 24 | 上 | ジョウ、 ショウ、 シャン | うえ、 うわ-、 かみ、 あ(げる)、 のぼ(る)、 たてまつ(る) | above, up | DASAR, VOL1, VOL3, N4VOL1, N4VOL5 |
| 25 | 東 | トウ | ひがし | east | DASAR, VOL4 |
| 26 | 四 | シ | よ(つ)、 よん | four, 4 | DASAR |
| 27 | 今 | コン、 キン | いま | now; the present | DASAR, VOL1, VOL2, VOL3, N4VOL2 |
| 28 | 金 | キン、 コン、 ゴン | かね、 かな-、 -がね | gold | DASAR, VOL1, N4VOL2 |
| 29 | 九 | キュウ、 ク | ここの(つ) | nine, 9 | DASAR |
| 30 | 入 | ニュウ | い(る)、はい(る) | enter, insert | DASAR, VOL1, VOL4, N4VOL1, N4VOL4 |
| 31 | 学 | ガク | まな(ぶ) | study, learning, science | DASAR, VOL2, VOL3, VOL5, N4VOL1, N4VOL3, N4VOL4 |
| 32 | 高 | コウ | たか(い) | tall, high, expensive | DASAR, VOL3, N4VOL2 |
| 33 | 円 | エン | まる(い) | circle, yen, round | DASAR |
| 34 | 子 | シ、 ス、 ツ | こ、 ね | child | DASAR, VOL1, VOL3, VOL5, N4VOL2, N4VOL5 |
| 35 | 外 | ガイ、 ゲ | そと、 ほか、 はず(す)、 と- | outside | DASAR, VOL2, VOL3, N4VOL1 |
| 36 | 八 | ハチ | や(つ)、 よう | eight, 8 | DASAR, VOL5 |
| 37 | 六 | ロク | む(つ)、 むい | six, 6 | DASAR |
| 38 | 下 | カ、 ゲ | した、 しも、 もと、 さ(げる)、 くだ(る)、 お(ろす) | below, down, descend, give, low, inferior | DASAR, VOL2, VOL3, VOL4, VOL5, N4VOL1, N4VOL2, N4VOL3 |
| 39 | 来 | ライ、 タイ | く.る、 きた.る、 き、 こ | come, due, next, cause, become | DASAR, VOL2, VOL5, N4VOL3 |
| 40 | 気 | キ、 ケ | いき | spirit, mind, air, atmosphere, mood | DASAR, VOL2, VOL4, VOL5, N4VOL2, N4VOL4 |
| 41 | 小 | ショウ | ちい(さい)、 こ-、 お-、 さ- | little, small | DASAR, VOL3, N4VOL3 |
| 42 | 七 | シチ | なな(つ)、 なの | seven, 7 | DASAR |
| 43 | 山 | サン、 セン | やま | mountain | DASAR, VOL5 |
| 44 | 話 | ワ | はな(す)、 はなし | tale, talk | DASAR, VOL4, N4VOL1 |
| 45 | 女 | ジョ | おんな、 め | woman, female | DASAR, VOL2, N4VOL2, N4VOL3 |
| 46 | 北 | ホク | きた | north | DASAR, VOL2 |
| 47 | 午 | ゴ | うま | noon, sign of the horse | DASAR, VOL2, VOL3 |
| 48 | 百 | ヒャク、 ビャク | もも | hundred | DASAR, VOL4, VOL5 |
| 49 | 書 | ショ | か(く) | write | DASAR, VOL2, VOL3, VOL4 |
| 50 | 先 | セン | さき、 ま(ず) | before, ahead, previous, future, precedence | DASAR, VOL3, N4VOL3 |
| 51 | 名 | メイ、 ミョウ | な | name, noted, distinguished, reputation | DASAR, VOL3, VOL4, VOL5 |
| 52 | 川 | セン | かわ | river, stream | DASAR |
| 53 | 千 | セン | ち | thousand | DASAR, VOL3 |
| 54 | 水 | スイ | みず | water | DASAR, VOL5, N4VOL3 |
| 55 | 半 | ハン | なか(ば) | half, middle, odd number, semi- | DASAR |
| 56 | 男 | ダン、 ナン | おとこ、 お | male; man | DASAR, VOL1, N4VOL3 |
| 57 | 西 | セイ、 サイ | にし | west | DASAR, VOL4 |
| 58 | 電 | デン |  | electricity; electric powered | DASAR, VOL4 |
| 59 | 校 | コウ |  | school, exam | DASAR, VOL2, N4VOL2, N4VOL3 |
| 60 | 語 | ゴ | かた(る) | word, speech, language | DASAR, VOL1 |
| 61 | 土 | ド、 ト | つち | soil, earth, ground | DASAR, N4VOL1 |
| 62 | 木 | ボク、 モク | き、 こ- | tree, wood | DASAR, VOL2, N4VOL5 |
| 63 | 聞 | ブン、 モン | き(く) | to hear; to listen; to ask | DASAR, VOL2, VOL3, N4VOL2, N4VOL3 |
| 64 | 食 | ショク、 ジキ | く(う)、 た(べる)、 は(む) | eat, food | DASAR, VOL3, N4VOL3 |
| 65 | 車 | シャ | くるま | car, wheel | DASAR, VOL2, VOL3, VOL4, N4VOL3 |
| 66 | 何 | カ | なに、 なん | what | DASAR, VOL3, VOL4 |
| 67 | 南 | ナン、 ナ | みなみ | south | DASAR, VOL5 |
| 68 | 万 | マン、 バン |  | ten thousand, 10,000 | DASAR, VOL5 |
| 69 | 毎 | マイ | ごと(に) | every | DASAR |
| 70 | 白 | ハク、 ビャク | しろ(い) | white | DASAR, VOL3 |
| 71 | 天 | テン | あまつ | heavens, sky, imperial | DASAR, VOL4, N4VOL4 |
| 72 | 母 | ボ | はは、 かあ | mother | DASAR, VOL1, N4VOL3 |
| 73 | 火 | カ | ひ、 -び、 ほ- | fire | DASAR, N4VOL2 |
| 74 | 右 | ウ、 ユウ | みぎ | right (direction) | DASAR, VOL5 |
| 75 | 読 | ドク、 トク、 トウ | よ(む) | to read | DASAR, VOL5 |
| 76 | 友 | ユウ | とも | friend | DASAR, VOL4 |
| 77 | 左 | サ、 シャ | ひだり | left | DASAR, VOL4 |
| 78 | 休 | キュウ | やす(む) | rest, day off, retire, sleep | DASAR, VOL5, N4VOL4 |
| 79 | 父 | フ | ちち、 とう | father | DASAR, VOL1, N4VOL3 |
| 80 | 雨 | ウ | あめ、 あま | rain | DASAR, VOL1 |

## Kanji N4 (167)

| # | Kanji | On | Kun | Arti (EN) | Volume JOYdata |
|---|---|---|---|---|---|
| 1 | 会 | カイ | あ(う) | meeting; meet | VOL1, VOL2, N4VOL1, N4VOL2, N4VOL3, N4VOL4 |
| 2 | 同 | ドウ | おな(じ) | same, agree, equal | VOL2 |
| 3 | 事 | ジ | こと | matter, thing, fact, business, reason, possibly | VOL3, N4VOL2, N4VOL3, N4VOL4, N4VOL5 |
| 4 | 自 | ジ、 シ | みずか(ら) | oneself | VOL3, N4VOL3 |
| 5 | 社 | シャ | やしろ | company, firm, office, association, shrine | VOL2, N4VOL3 |
| 6 | 発 | ハツ、 ホツ |  | departure, discharge, emit, start from | N4VOL4 |
| 7 | 者 | シャ | もの | someone, person | VOL1, N4VOL4 |
| 8 | 地 | チ、 ジ |  | ground, earth | VOL4, N4VOL3 |
| 9 | 業 | ギョウ | わざ | business, vocation, arts, performance | VOL3, N4VOL3 |
| 10 | 方 | ホウ | かた | direction, person, alternative | VOL2, N4VOL1, N4VOL3, N4VOL5 |
| 11 | 新 | シン | あたら(しい)、 あら(た) | new | VOL1, VOL3, N4VOL3 |
| 12 | 場 | ジョウ | ば | location, place | N4VOL1, N4VOL2, N4VOL3, N4VOL4 |
| 13 | 員 | イン |  | employee, member, number, the one in charge | N4VOL2, N4VOL4 |
| 14 | 立 | リツ | た(つ) | stand up, rise | VOL3, N4VOL3, N4VOL5 |
| 15 | 開 | カイ | ひら(く)、 あ(ける) | open, unfold, unseal | VOL1, N4VOL4 |
| 16 | 手 | シュ | て | hand | VOL1, VOL2, VOL3, VOL4, VOL5, N4VOL1, N4VOL4 |
| 17 | 力 | リョク、 リキ | ちから | power, strength, strong, strain, bear up, exert | N4VOL3 |
| 18 | 問 | モン | と(う) | question, ask, problem | VOL3, VOL5 |
| 19 | 代 | ダイ | か(わり) | substitute, change, convert, replace, period | N4VOL2, N4VOL3 |
| 20 | 明 | メイ、 ミョウ | あか(るい) | bright, light | VOL1, N4VOL1, N4VOL3 |
| 21 | 動 | ドウ | うご(く) | move, motion, change | VOL3, VOL4, N4VOL1, N4VOL4 |
| 22 | 京 | キョウ、 ケイ、 キン | みやこ | capital | ❌ tidak ada |
| 23 | 目 | モク、 ボク | め | eye, class, look, insight, experience | VOL5 |
| 24 | 通 | ツウ | とお(る)、かよ(う) | traffic, pass through, avenue, commute | N4VOL2, N4VOL4 |
| 25 | 言 | ゲン、 ゴン | い（う）、 こと | say, word | VOL1, VOL3 |
| 26 | 理 | リ |  | logic, arrangement, reason, justice, truth | VOL5, N4VOL5 |
| 27 | 体 | タイ | からだ | body, substance, object, reality | VOL2, N4VOL3 |
| 28 | 田 | デン | た | rice field, rice paddy | N4VOL1 |
| 29 | 主 | シュ | ぬし、 おも | lord, chief, master, main thing, principal | N4VOL2 |
| 30 | 題 | ダイ |  | topic, subject | VOL3, VOL5 |
| 31 | 意 | イ |  | idea, mind, heart, taste, thought | VOL1, N4VOL1, N4VOL3, N4VOL5 |
| 32 | 不 | フ、 ブ |  | negative, non-, bad | N4VOL4 |
| 33 | 作 | サク、 サ | つく(る) | make, production, prepare, build | VOL4 |
| 34 | 用 | ヨウ | もち(いる) | utilize, business, service, use, employ | N4VOL5 |
| 35 | 度 | ド、 タク | たび、 た(い) | degrees, occurrence, time, counter for occurrences | VOL5, N4VOL1, N4VOL2 |
| 36 | 強 | キョウ、 ゴウ | つよ(い) | strong | VOL4, VOL5 |
| 37 | 公 | コウ |  | public, prince, official, governmental | VOL2, N4VOL2 |
| 38 | 持 | ジ | も(つ) | hold, have | VOL5, N4VOL2 |
| 39 | 野 | ヤ | の | plains, field, rustic, civilian life | VOL5 |
| 40 | 以 | イ | もっ(て) | by means of, because, in view of, compared with | N4VOL1 |
| 41 | 思 | シ | おも(う) | think | N4VOL1 |
| 42 | 家 | カ | いえ、 や、 うち | house, home, family, professional, expert | VOL1, VOL2 |
| 43 | 世 | セイ、 セ | よ | generation, world, society, public | N4VOL3 |
| 44 | 多 | タ | おお(い) | many, frequent, much | VOL1 |
| 45 | 正 | セイ、 ショウ | ただ(しい)、 まさ(に) | correct, justice, righteous | N4VOL3 |
| 46 | 安 | アン | やす(い) | safe, peaceful, cheap | VOL5, N4VOL1 |
| 47 | 院 | イン |  | institution, temple, mansion, school | VOL4, N4VOL3, N4VOL4 |
| 48 | 心 | シン | こころ | heart, mind, spirit | N4VOL1, N4VOL2 |
| 49 | 界 | カイ |  | world, boundary | N4VOL3 |
| 50 | 教 | キョウ | おし(える)、 おそ(わる) | teach, faith, doctrine | VOL1, VOL2, N4VOL2 |
| 51 | 文 | ブン、 モン | ふみ | sentence, literature, style, art | VOL5, N4VOL4 |
| 52 | 元 | ゲン、 ガン | もと | beginning, former time, origin | VOL2 |
| 53 | 重 | ジュウ、 チョウ | おも(い)、 かさ(ねる) | heavy, important, esteem, respect | VOL2 |
| 54 | 近 | キン | ちか(い) | near, early, akin, tantamount | VOL3, N4VOL2 |
| 55 | 考 | コウ | かんが(える) | consider, think over | N4VOL2 |
| 56 | 画 | ガ、 カク | かく(する) | brush-stroke, picture | VOL1, N4VOL5 |
| 57 | 海 | カイ | うみ | sea, ocean | VOL1, N4VOL1 |
| 58 | 売 | バイ | う(る) | sell | VOL1, N4VOL1 |
| 59 | 知 | チ | し(る) | know, wisdom | VOL3, N4VOL3 |
| 60 | 道 | ドウ | みち | road-way, street, district, journey, course | VOL5, N4VOL4 |
| 61 | 集 | シュウ | あつ(める) | gather, meet | N4VOL1 |
| 62 | 別 | ベツ | わか(れる)、 わ(ける) | separate, branch off, diverge | N4VOL4, N4VOL5 |
| 63 | 物 | ブツ、 モツ | もの | thing, object, matter | VOL2, VOL3, VOL4, VOL5, N4VOL1, N4VOL2, N4VOL3, N4VOL4, N4VOL5 |
| 64 | 使 | シ | つか(う) | use, order, messenger, ambassador | VOL3, VOL4 |
| 65 | 品 | ヒン | しな | goods, refinement, dignity, article | N4VOL3 |
| 66 | 計 | ケイ | はか(る) | plot, plan, scheme, measure | VOL4 |
| 67 | 死 | シ | し(ぬ) | death, die | VOL3 |
| 68 | 特 | トク |  | special | N4VOL4 |
| 69 | 私 | シ | わたくし、 わたし | private, I, me | VOL5 |
| 70 | 始 | シ | はじ(める) | commence, begin | VOL4, N4VOL4 |
| 71 | 朝 | チョウ | あさ | morning | VOL1, VOL2 |
| 72 | 運 | ウン | はこ(ぶ) | carry, luck, destiny, fate, transport | N4VOL1, N4VOL4 |
| 73 | 終 | シュウ | お(わる) | end, finish | VOL2, N4VOL1 |
| 74 | 台 | ダイ、 タイ | うてな | pedestal, a stand, counter for machines and vehicles | VOL3, N4VOL3 |
| 75 | 広 | コウ | ひろ(い) | wide, broad, spacious | VOL5 |
| 76 | 住 | ジュウ、 チュウ | す(む) | dwell, reside, live, inhabit | VOL3, N4VOL3 |
| 77 | 無 | ム、 ブ | な(い) | nothingness, none, ain't, nothing, nil, not | N4VOL4, N4VOL5 |
| 78 | 真 | シン | ま、 まこと | true, reality, Buddhist sect | VOL3, N4VOL5 |
| 79 | 有 | ユウ、 ウ | あ(る) | possess, have, exist, happen | VOL5 |
| 80 | 口 | コウ | くち | mouth | VOL1, VOL2, VOL4, N4VOL3 |
| 81 | 少 | ショウ | すく(ない)、 すこ(し) | few, little | VOL3 |
| 82 | 町 | チョウ | まち | town, village, block, street | VOL5 |
| 83 | 料 | リョウ |  | fee, materials | VOL5, N4VOL3 |
| 84 | 工 | コウ、 ク、 グ |  | craft, construction | N4VOL2 |
| 85 | 建 | ケン、 コン | た(てる) | build | VOL3, N4VOL3 |
| 86 | 空 | クウ | そら、 から、 あ(く)、 す(く)、 むな(しい) | empty, sky, void, vacant, vacuum | VOL3, N4VOL1, N4VOL2 |
| 87 | 急 | キュウ | いそ(ぐ) | hurry, emergency, sudden, steep | N4VOL1, N4VOL2 |
| 88 | 止 | シ | と(まる)、 とど(まる)、 や(める)、 よ(す) | stop, halt | N4VOL4, N4VOL5 |
| 89 | 送 | ソウ | おく(る) | escort, send | N4VOL1 |
| 90 | 切 | セツ、 サイ | き(る) | cut, cutoff, be sharp | VOL2, VOL3 |
| 91 | 転 | テン | ころ(がる) | revolve, turn around, change | VOL3, N4VOL1 |
| 92 | 研 | ケン | と(ぐ) | polish, study of, sharpen | N4VOL2 |
| 93 | 足 | ソク | あし、 た(りる) | leg, foot, be sufficient | VOL1, N4VOL3 |
| 94 | 究 | キュウ |  | research, study | N4VOL2 |
| 95 | 楽 | ガク、 ラク | たの(しい) | music, comfort, ease | VOL2, VOL3, N4VOL3 |
| 96 | 起 | キ | お(きる)、 おこ(す) | wake up, get up; rouse | VOL1, N4VOL1 |
| 97 | 着 | チャク | き(る)、つ(く) | arrive, wear, counter for suits of clothing | VOL1, VOL2, VOL4, N4VOL3 |
| 98 | 店 | テン | みせ | store, shop | VOL2, VOL5, N4VOL4 |
| 99 | 病 | ビョウ | や(む) | ill, sick | VOL4, VOL5 |
| 100 | 質 | シツ、 シチ | たち、 ただ(す) | substance, quality, matter, temperament | VOL3 |
| 101 | 待 | タイ | ま(つ) | wait, depend on | VOL5 |
| 102 | 試 | シ | こころ(みる)、 ため(す) | test, try, attempt, experiment | N4VOL3 |
| 103 | 族 | ゾク |  | tribe, family | VOL2 |
| 104 | 銀 | ギン |  | silver | VOL2 |
| 105 | 早 | ソウ、 サッ | はや(い) | early, fast | VOL4 |
| 106 | 映 | エイ | うつ(る)、 は(える) | reflect, reflection, projection | VOL1 |
| 107 | 親 | シン | おや、 した(しい) | parent, intimacy, relative, familiarity | VOL5, N4VOL1 |
| 108 | 験 | ケン |  | verification, effect, testing | N4VOL3 |
| 109 | 英 | エイ |  | England, English, hero, outstanding | VOL1 |
| 110 | 医 | イ |  | doctor, medicine | VOL1, N4VOL1, N4VOL4 |
| 111 | 仕 | シ |  | attend, doing, official, serve | VOL3, N4VOL3 |
| 112 | 去 | キョ、 コ | さ(る) | gone, past, quit, leave, elapse, eliminate | VOL2 |
| 113 | 味 | ミ | あじ | flavor, taste | VOL1, N4VOL1, N4VOL2, N4VOL3 |
| 114 | 写 | シャ | うつ(る) | copy, be photographed, describe | VOL3, N4VOL1 |
| 115 | 字 | ジ |  | character, letter, word | ❌ tidak ada |
| 116 | 答 | トウ | こた(える) | solution, answer | VOL3, N4VOL2 |
| 117 | 夜 | ヤ | よ、 よる | night, evening | VOL5, N4VOL2 |
| 118 | 音 | オン | おと、 ね | sound, noise | VOL2, N4VOL1, N4VOL4 |
| 119 | 注 | チュウ | そそ(ぐ)、 さ(す)、 つ(ぐ) | pour, irrigate, shed (tears), flow into, concentrate on | N4VOL3 |
| 120 | 帰 | キ | かえ(る)、 かえ(す) | homecoming, arrive at, lead to, result in | VOL2, N4VOL1 |
| 121 | 古 | コ | ふる(い) | old | VOL5 |
| 122 | 歌 | カ | うた、 うた(う) | song, sing | VOL1 |
| 123 | 買 | バイ | か(う) | buy | VOL2 |
| 124 | 悪 | アク | わる(い) | bad, evil, wrong | VOL5 |
| 125 | 図 | ズ、 ト | はか(る) | map, drawing, plan, extraordinary | VOL4 |
| 126 | 週 | シュウ |  | week | VOL3, VOL5, N4VOL3 |
| 127 | 室 | シツ | むろ | room, apartment, chamber, greenhouse, cellar | VOL2, N4VOL1, N4VOL2 |
| 128 | 歩 | ホ、 ブ | ある(く)、 あゆ(む) | walk, counter for steps | VOL1, VOL3 |
| 129 | 風 | フウ、 フ | かぜ、 かざ- | wind, air, style, manner | VOL2, N4VOL3 |
| 130 | 紙 | シ | かみ | paper | VOL2, VOL4 |
| 131 | 黒 | コク | くろ | black | VOL2 |
| 132 | 花 | カ、 ケ | はな | flower | VOL2, VOL4, N4VOL4 |
| 133 | 春 | シュン | はる | spring | VOL4 |
| 134 | 赤 | セキ、 シャク | あか(い) | red | VOL1, N4VOL1 |
| 135 | 青 | セイ、 ショウ | あお(い) | blue | VOL1 |
| 136 | 館 | カン | やかた | building, mansion, large building, palace | VOL1, VOL3, VOL4, N4VOL4, N4VOL5 |
| 137 | 屋 | オク | や | roof, house, shop, dealer, seller | VOL5, N4VOL1, N4VOL4 |
| 138 | 色 | ショク、 シキ | いろ | color | VOL1, VOL2, VOL4, N4VOL2 |
| 139 | 走 | ソウ | はし(る) | run | VOL4, N4VOL2 |
| 140 | 秋 | シュウ | あき | autumn, fall | VOL1 |
| 141 | 夏 | カ、 ゲ | なつ | summer | VOL4 |
| 142 | 習 | シュウ | なら(う) | learn | VOL4, VOL5, N4VOL3 |
| 143 | 駅 | エキ |  | station | VOL1 |
| 144 | 洋 | ヨウ |  | ocean, sea, foreign, Western style | ❌ tidak ada |
| 145 | 旅 | リョ | たび | trip, travel | VOL5, N4VOL5 |
| 146 | 服 | フク |  | clothing, admit, obey | VOL4, VOL5 |
| 147 | 夕 | (none) | ゆう | evening | VOL5 |
| 148 | 借 | シャク | か(りる) | borrow, rent | VOL2 |
| 149 | 曜 | ヨウ |  | weekday | ❌ tidak ada |
| 150 | 飲 | イン | の(む) | drink | VOL4 |
| 151 | 肉 | ニク |  | meat | VOL2, VOL4, VOL5 |
| 152 | 貸 | タイ | か(す)、 かし | lend | VOL2 |
| 153 | 堂 | ドウ |  | public chamber, hall | VOL3 |
| 154 | 鳥 | チョウ | とり | bird, chicken | VOL4 |
| 155 | 飯 | ハン | めし | meal, rice | VOL1, VOL3, VOL4, VOL5 |
| 156 | 勉 | ベン | つと(める) | exertion, endeavor, effort | VOL5 |
| 157 | 冬 | トウ | ふゆ | winter | VOL5 |
| 158 | 昼 | チュウ | ひる | daytime, noon | VOL5, N4VOL4 |
| 159 | 茶 | チャ、 サ |  | tea | VOL1, VOL2, VOL4 |
| 160 | 弟 | テイ、 ダイ、 デ | おとうと | younger brother | VOL1, VOL2 |
| 161 | 牛 | ギュウ | うし | cow | VOL2 |
| 162 | 魚 | ギョ | うお、 さかな | fish | VOL3 |
| 163 | 兄 | キョウ、 ケイ | あに | elder brother | VOL1, VOL2 |
| 164 | 犬 | ケン | いぬ | dog | VOL1 |
| 165 | 妹 | マイ | いもうと | younger sister | VOL1 |
| 166 | 姉 | シ | あね | elder sister | VOL1, VOL2 |
| 167 | 漢 | カン |  | China | ❌ tidak ada |
