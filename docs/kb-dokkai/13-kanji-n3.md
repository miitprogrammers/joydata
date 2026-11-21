# Kanji N3 — daftar rirekishobuilder vs jlptsensei vs volume kanji JOYdata

> Sumber utama (referensi user): [rirekishobuilder.com — JLPT N3 Kanji PDF](https://rirekishobuilder.com/learn-japanese-kanji/jlpt-n3-kanji-pdf),
> berkas [kanji_N3.pdf](https://rirekishobuilder.com/downloads/jlpt-list/kanji_N3.pdf) (81 halaman) · diambil 2026-11-20 · **369 kanji**,
> nomor 1–369 berurutan tanpa celah.
> Pembanding: [jlptsensei.com/jlpt-n3-kanji-list](https://jlptsensei.com/jlpt-n3-kanji-list/) · **370 kanji** (cocok dengan total situs).
> Volume JOYdata dari `kanjiDariVolume()` di `server/domain/tesOnline.js`.

## Ringkasan

| Hal | Angka |
|---|---|
| Kanji di daftar rirekishobuilder | 369 |
| Kanji di daftar jlptsensei | 370 |
| Sama di kedua daftar | 368 |
| Hanya di rirekishobuilder | 1: 分 (jlptsensei: N5) |
| Hanya di jlptsensei | 2: 働 誰 |
| Kanji N3 (rirekishobuilder) yang sudah ada di **volume N5** JOYdata | 102 |
| … yang hanya ada di **volume N4** JOYdata | 125 |
| … yang **tidak ada di volume mana pun** | **142** |
| … dari 100 kanji N3 paling sering (urutan daftar), yang tidak ada di volume | 36 |

Catatan:

- Kedua daftar praktis sama (368 kanji). rirekishobuilder memasukkan **分**, yang di jlptsensei (dan umumnya)
  tergolong N5; jlptsensei memasukkan **働** dan **誰**. Urutan rirekishobuilder mengikuti frekuensi pemakaian
  (愛, 薬, 変, 更, 最, …), bukan urutan belajar.
- **227 dari 369 kanji N3 sudah dipelajari peserta** lewat volume kata N5/N4 JOYdata. Volume disusun dari kata
  (mis. 洗濯, 郵便局, 結婚), jadi banyak kanji yang di daftar JLPT tergolong N3 sudah masuk di tahap N5.
- **142 kanji N3 tidak ada di volume mana pun.** Kode dokkai berpola N3 memakai volume N5 + N4 secara bawaan, sehingga semua
  kata yang memuat kanji ini ditulis kana di bacaan (mis. 愛・更・老・歳・民・市 …). Bacaan N3 yang ditulis dengan gaya
  JLPT (artikel, esai) akan berisi banyak deretan kana panjang. Lihat keputusan D9 di [12-n3.md](12-n3.md).
- Kolom "Contoh" hanya memuat kata dari PDF yang benar-benar mengandung kanji itu; contoh lain di PDF (mis. 美しい di bawah 愛,
  新 di bawah 更) dibuang karena tidak memuat kanjinya. Data lengkap apa adanya: [data/kanji-n3-rireki.json](data/kanji-n3-rireki.json).

## Kanji N3 yang tidak ada di volume JOYdata (142)

愛 更 老 歳 民 市 相 実 表 現 的 制 成 期 和 平 加 権 支 共 得 解 資 面 告 判 認 参 信 在 件 側 任 求 論 官 感 情 示 式 容 演 談 能 位 流 格 疑 放 状 球 職 与 構 身 費 収 断 神 備 害 配 訪 想 助 労 然 限 追 商 失 末 守 種 命 福 望 観 申 識 良 阪 候 程 満 敗 突 路 積 処 否 殺 破 完 責 給 馬 富 未 適 婦 寄 込 顔 類 余 王 船 許 抜 罪 努 精 浮 絶 幸 等 曲 居 招 欠 刻 賛 抱 犯 恐 願 越 互 列 暮 到 陽 誤 貧 杯 煙 頂 才 偶 偉 幾

## Daftar lengkap (urutan rirekishobuilder)

| # | Kanji | On | Kun | Arti (EN) | Contoh (dari PDF) | jlptsensei | Volume JOYdata |
|---|---|---|---|---|---|---|---|
| 1 | 愛 | アイ | いと.しい, お.しむ, かな.しい, まな, め.でる | affection, favourite, love | 愛（あい） love; 愛（まな） beloved | N3 | ❌ |
| 2 | 薬 | ヤク | くすり | benefit, chemical, enamel, gunpowder, medicine | 薬（くすり） medicine; 薬（やく） dope | N3 | VOL2 |
| 3 | 変 | ヘン | か.える, か.わり, か.わる | change, strange, unusual | 変（へん） strange; 変わる（かわる） to change | N3 | N4VOL1, N4VOL2, N4VOL4 |
| 4 | 更 | コウ | さら, さら.に, ふ.かす, ふ.ける | again, further, grow late, more and more, night watch, of course, renew, renovate, sit up late | 更け（ふけ） growing late; 更（こう） one-fifth of the night (approx. 2 hours) | N3 | ❌ |
| 5 | 最 | サイ, シュ | つま, もっと.も | extreme, most, utmost | 最（さい） the most; 最近（さいきん） recently | N3 | N4VOL2 |
| 6 | 分 | フン, ブ, ブン | わ.かつ, わ.かる, わ.かれる, わ.け, わ.ける | 1%, chances, degree, duty, know, minute of time, one's lot, part, rate, segment, shaku/100, share, understand | 分（ぶん） part; 分（ふん） minute (unit of time) | N5 | DASAR, VOL3, VOL5, N4VOL2, N4VOL3 |
| 7 | 他 | タ | ほか | another, other, the others | 他（ほか） another place; 他（た） other (esp. people and abstract matters) | N3 | VOL5 |
| 8 | 老 | ロウ | お.いる, ふ.ける | grow old, old age, old man | 老（ろう） old age; 老人（ろうじん） old person | N3 | ❌ |
| 9 | 付 | フ | -つ.き, -つ.け, -つ.ける, -つき, -づ.き, -づ.く, -づ.け, -づ.ける, | adhere, append, attach, refer to | 付き（つき） furnished with; 付（づけ） dated (e.g. a letter) | N3 | N4VOL2, N4VOL3 |
| 10 | 歳 | サイ, セイ | とし, とせ, よわい | age, occasion, opportunity, year-end | 歳（さい） ... years old; 歳入（さいにゅう） annual revenue (government) | N3 | ❌ |
| 11 | 決 | ケツ | -ぎ.め, き.まる, き.める, さ.く | agree upon, appoint, decide, fix | 決（けつ） decision; 決して（けっして） (not) ever | N3 | N4VOL2 |
| 12 | 確 | カク, コウ | たし.か, たし.かめる | assurance, clear, confirm, evident, firm, hard, solid, tight | 確か（たしか） sure; 確（かく） certain | N3 | N4VOL3 |
| 13 | 番 | バン | つが.い | number in a series, turn | 番（ばん） number (in a series); 番い（つがい） pair (esp. of mated animals) | N3 | VOL2, VOL3, VOL4, N4VOL4 |
| 14 | 調 | チョウ | しら.べ, しら.べる, ととの.う, ととの.える | exorcise, harmonize, investigate, key (music), mediate, meter, prepare, tone, tune, writing style | 調（ちょう） key; 調査（ちょうさ） investigation | N3 | N4VOL3 |
| 15 | 葉 | ヨウ | は | blade, counter for flat things, fragment, leaf, lobe, needle, piece, plane, spear | 葉（は） leaf; 葉（よう） counter for leaves, pieces of paper, etc. | N3 | VOL3, VOL4 |
| 16 | 政 | ショウ, セイ | まつりごと, まん | government, politics | 政（まつりごと） rule; 政治（せいじ） politics | N3 | N4VOL3 |
| 17 | 議 | ギ |  | consideration, consultation, debate, deliberation | 議（ぎ） discussion; 議長（ぎちょう） chair | N3 | N4VOL1 |
| 18 | 民 | ミン | たみ | nation, people, subjects | 民（たみ） people; 民（みん） citizen | N3 | ❌ |
| 19 | 連 | レン | -づ.れ, つ.れる, つら.なる, つら.ねる | clique, connect, gang, join, lead, party, take along | 連（れん） two reams (of paper); 連（むらじ） Muraji (hereditary title | N3 | N4VOL5 |
| 20 | 対 | タイ, ツイ | あいて, こた.える, そろ.い, つれあ.い, なら.ぶ, むか.う | anti-, compare, equal, even, opposite, versus, vis-a-vis | 対（つい） pair; 対（たい） versus | N3 | N4VOL4 |
| 21 | 部 | ブ | -べ | bureau, class, copy, counter for copies of a newspaper or magazine, dept, part, portion, section | 部（ぶ） department (in an organization, company, etc.); 部（べ） hereditary occupational group (Yamato period) | N3 | VOL3, VOL5 |
| 22 | 合 | カッ, ガッ, ゴウ | -あ.い, -あ.う, -あ.わせる, -あい, あ.い, あ.う, あ.わす, あ.わせる, | 0.1, fit, join, suit | 合（ごう） gō; 合い（あい） between- season wear | N3 | N4VOL1, N4VOL2, N4VOL3, N4VOL5 |
| 23 | 市 | シ | いち | city, market, town | 市（し） city; 市（いち） market | N3 | ❌ |
| 24 | 内 | ダイ, ナイ | うち | among, between, home, house, inside, within | 内（うち） inside; 内（ない） within ... | N3 | N4VOL1 |
| 25 | 相 | ショウ, ソウ | あい- | aspect, councillor, each other, inter-, minister of state, mutual, phase, physiognomy, together | 相（あい） together; 相（しょう） minister (of a government department) | N3 | ❌ |
| 26 | 定 | ジョウ, テイ | さだ.か, さだ.まる, さだ.める | decide, determine, establish, fix | 定（じょう） certainty; 定（さだ） certainly | N3 | N4VOL5 |
| 27 | 回 | エ, カイ | -まわ.し, -まわ.す, -まわ.り, -まわ.る, か.える, まわ.し-, まわ.す, -times, counter | for occurrences, game, revolve, round | 回（かい） counter for occurrences; 回転（かいてん） rotation | N3 | N4VOL5 |
| 28 | 選 | セン | え.る, えら.ぶ, よ.る | choose, elect, prefer, select | 選（せん） selection; 選ぶ（えらぶ） to choose | N3 | N4VOL1 |
| 29 | 米 | ベイ, マイ, メエトル | こめ, よね | USA, metre, rice | 米（メートル） metre (unit of length); 米（こめ） (husked grains of) rice | N3 | N4VOL2 |
| 30 | 実 | シツ, ジツ | まこと, み, みち.る, みの, みの.る | fruit, nut, reality, seed, truth | 実（じつ） truth; 実（み） fruit | N3 | ❌ |
| 31 | 関 | カン | -ぜき, かか.わる, からくり, かんぬき, せき | barrier, concerning, connection, gateway, involve | 関（せき） barrier; 関（ぜき） honorific added to names of makuuchi and juryo division wrestlers | N3 | VOL2, N4VOL2 |
| 32 | 全 | ゼン | すべ.て, まった.く | all, complete, entire, fulfill, whole | 全（ぜん） all; 全部（ぜんぶ） all | N3 | VOL3, N4VOL1 |
| 33 | 表 | ヒョウ | -おもて, あら.わす, あらわ.す, あらわ.れる, おもて | chart, diagram, surface, table | 表（おもて） surface; 表（ひょう） table | N3 | ❌ |
| 34 | 戦 | セン | いくさ, おのの.く, そよ.ぐ, たたか.う, わなな.く | battle, match, war | 戦（いくさ） war; 戦（せん） war | N3 | N4VOL3 |
| 35 | 経 | キョウ, キン, ケイ | た.つ, たていと, のり, はか.る, へ.る | expire, longitude, pass thru, sutra, warp | 経（きょう） sutra; 経（けい） warp (weaving) | N3 | N4VOL2 |
| 36 | 現 | ゲン | あらわ.す, あらわ.れる, うつ.つ, うつつ | actual, existing, present | 現（げん） present (e.g. government, administration); 現つ（うつつ） reality | N3 | ❌ |
| 37 | 化 | カ, ケ | け.する, ば.かす, ば.ける, ふ.ける-ization, | change, delude, enchant, influence, take the form of | 化（か） change to ...; 化学（かがく） chemistry | N3 | N4VOL4 |
| 38 | 当 | トウ | あ.たり, あ.たる, あ.て, あ.てる, まさ.に, まさ.にべし | appropriate, himself, hit, right | 当（とう） this; 当時（とうじ） at that time | N3 | VOL2 |
| 39 | 約 | ヤク | つづ.まる, つづ.める, つづま.やか | approximately, promise, shrink | 約（やく） approximately; 約束（やくそく） promise | N3 | N4VOL5 |
| 40 | 首 | シュ | くび | counter for songs and poems, neck | 首（くび） neck; 首級（しゅきゅう） decapitated head of an enemy | N3 | N4VOL2 |
| 41 | 法 | ハッ, フラン, ホウ, ホッ | のり | law, method, model, principle, rule, system | 法（ほう） law; 法（のり） rule | N3 | N4VOL4 |
| 42 | 性 | ショウ, セイ | さが | gender, nature, sex | 性（せい） nature (of a person); 性（さが） one's nature | N3 | N4VOL3 |
| 43 | 的 | テキ | まと | adjective ending, bull's eye, mark, object, target | 的（てき） -ical; 的（まと） mark | N3 | ❌ |
| 44 | 要 | ヨウ | い.る, かなめ | essence, key to, main point, need, pivot | 要（かなめ） pivot; 要（よう） main point | N3 | VOL1, N4VOL4 |
| 45 | 制 | セイ |  | law, rule, system | 制（せい） system; 制度（せいど） system | N3 | ❌ |
| 46 | 治 | ジ, チ | おさ.まる, おさ.める, なお.す, なお.る | be at peace, calm down, conserve, cure, govt, heal, quell, reign, rule, subdue | 治（ち） politics; 治療（ちりょう） (medical) treatment | N3 | N4VOL3 |
| 47 | 務 | ム | つと.める | duties, task | 務まる（つとまる） to be fit (for a role) | N3 | N4VOL2, N4VOL3 |
| 48 | 成 | ジョウ, セイ | -な.す, な.す, な.る | become, elapse, get, grow, reach, turn into | 成る（なる） to become; 成る程（なるほど） I see | N3 | ❌ |
| 49 | 期 | キ, ゴ |  | date, period, term, time | 期（き） period; 期（ご） time | N3 | ❌ |
| 50 | 取 | シュ | -ど.り, と.り, と.り-, と.る, とり | fetch, take, take up | 取り（とり） taking; 取（しゅ） appropriation | N3 | VOL4, N4VOL4 |
| 51 | 都 | ツ, ト | みやこ | all, capital, everything, metropolis | 都（みやこ） capital (esp. Kyoto, Japan's former capital); 都（と） Metropolis (of Tokyo) | N3 | N4VOL3 |
| 52 | 和 | オ, カ, ワ | あ.える, なご.む, なご.やか, やわ.らぐ, やわ.らげる | Japan, Japanese style, harmony, peace, soften | 和（わ） sum | N3 | ❌ |
| 53 | 機 | キ | はた | airplane, efficacy, loom, machine, mechanism, occasion, opportunity, potency | 機（き） chance; 機（はた） loom | N3 | VOL4, N4VOL2 |
| 54 | 平 | ヒョウ, ビョウ, ヘイ | たい.ら, たい.らげる, ひら | even, flat, peace | 平（ひら） something broad and flat; 平（だいら） plain | N3 | ❌ |
| 55 | 加 | カ | くわ.える, くわ.わる | Canada, add, addition, include, increase, join | 加（か） addition; 加える（くわえる） to add | N3 | ❌ |
| 56 | 受 | ジュ | -う.け, う.かる, う.ける | accept, answer (phone), catch, get, receive, take, undergo | 受（じゅ） vedana (sensation); 受ける（うける） to receive | N3 | N4VOL1 |
| 57 | 続 | キョウ, コウ, ショク, ゾク | つぐ.ない, つづ.く, つづ.ける | continue, sequel, series | 続（ぞく） sequel; 続ける（つづける） to continue | N3 | N4VOL3 |
| 58 | 進 | シン | すす.む, すす.める | advance, proceed, progress, promote | 進歩（しんぽ） progress; 進む（すすむ） to advance | N3 | N4VOL3 |
| 59 | 数 | サク, シュ, ス, スウ, ソク | かず, かぞ.える, しばしば, せ.める, わずらわ.しい | fate, figures, law, number, strength | 数（すう） several; 数（かず） number | N3 | N4VOL3 |
| 60 | 記 | キ | しる.す | account, narrative, scribe | 記（き） account; 記録（きろく） record | N3 | N4VOL4 |
| 61 | 初 | ショ | -そ.める, -ぞ.め, うい-, はじ.め, はじ.めて, はつ, はつ- | beginning, first time | 初（はつ） first; 初め（ぞめ） first doing of ... (ever, in one's life, in the new year, etc.) | N3 | VOL4, N4VOL2 |
| 62 | 指 | シ | -さ.し, さ.す, ゆび | finger, indicate, measure (ruler), play (chess), point to, put into | 指（ゆび） finger; 指輪（ゆびわ） (finger) ring | N3 | N4VOL5 |
| 63 | 権 | ケン, ゴン | おもり, かり, はか.る | authority, power, rights | 権（けん） right (to do something); 権利（けんり） right | N3 | ❌ |
| 64 | 支 | シ | か.う, ささ.える, つか.える | branch, branch radical (no. 65), support, sustain | 支（し） China; 支払う（しはらう） to pay | N3 | ❌ |
| 65 | 産 | サン | う.まれる, う.む, うぶ-, む.す | bear, childbirth, give birth, native, products, property, yield | 産（さん） (giving) birth; 産（うぶ） birth- | N3 | N4VOL1, N4VOL3 |
| 66 | 点 | テン | さ.す, た.てる, つ.く, つ.ける, とぼ.す, とも.す, ぼち | decimal point, mark, point, speck, spot | 点（てん） dot; 点（ちょぼ） dot | N3 | VOL2, N4VOL4 |
| 67 | 報 | ホウ | むく.いる | news, report, retribution, reward | 報（ほう） information; 報道（ほうどう） report (of news) | N3 | N4VOL4 |
| 68 | 済 | サイ, セイ | -す.ます, -ず.み, -ずみ, す.ます, す.まない, す.む, すく.う, な.す, | come to an end, excusable, finish, need not, relieve (burden), settle (debt, etc.) | 済み（ずみ） arranged; 済む（すむ） to finish | N3 | N4VOL2, N4VOL3 |
| 69 | 活 | カツ | い.かす, い.きる, い.ける | being helped, lively, living, resuscitation | 活（かつ） living; 活用（かつよう） practical use | N3 | N4VOL3 |
| 70 | 原 | ゲン | はら | field, meadow, original, plain, prairie, primitive, tundra, wilderness | 原（はら） field; 原（げん） original | N3 | N4VOL2 |
| 71 | 共 | キョウ | -ども, とも, とも.に | alike, all, and, both, neither, together, with | 共（とも） together with; 共（ども） first-person plural (or singular) | N3 | ❌ |
| 72 | 得 | トク | う.る, え.る | able to, acquire, advantage, benefit, can, earn, find, gain, get, may, profit | 得（とく） profit; 得（う） to get | N3 | ❌ |
| 73 | 解 | カイ, ゲ | さと.る, と.かす, と.く, と.ける, ほど.く, ほど.ける, わか.る | absolve, answer, cancel, explain, explanation, key, minute, notes, solve, understanding, undo, unravel, untie | 解（かい） solution (of an equation, inequality, etc.); 解決（かいけつ） settlement | N3 | ❌ |
| 74 | 交 | コウ | -か.う, か.わす, かわ.す, こもごも, ま.ざる, ま.じる, ま.ぜる, まじ.える, | association, coming & going, mingle, mixing | 交（こう） association; 交々（こもごも） alternately | N3 | VOL2, N4VOL2 |
| 75 | 資 | シ |  | assets, be conducive to, capital, contribute to, data, funds, resources | 資（し） funds; 資源（しげん） resources | N3 | ❌ |
| 76 | 予 | シャ, ヨ | あらかじ.め | I, beforehand, myself, previous | 予（よ） I; 予算（よさん） estimate (of costs) | N3 | N4VOL4, N4VOL5 |
| 77 | 向 | コウ | -む.き, -む.け, む.い, む.かい, む.かう, む.く, む.ける, む.こう, | approach, beyond, confront, defy, facing, tend toward, yonder | 向こう（むこう） opposite side; 向かう（むかう） to face | N3 | N4VOL5 |
| 78 | 際 | サイ | -ぎわ, きわ | adventurous, dangerous, edge, indecent, occasion, side, time, verge, when | 際（さい） occasion; 際（きわ） edge | N3 | N4VOL2 |
| 79 | 勝 | ショウ | -が.ち, か.つ, かつ, すぐ.れる, まさ.る | excel, prevail, victory, win | 勝（しょう） win; 勝利（しょうり） victory | N3 | N4VOL2 |
| 80 | 面 | ベン, メン | おも, おもて, つら | face, features, mask, surface | 面（めん） face; 面（つら） face | N3 | ❌ |
| 81 | 告 | コク | つ.げる | announce, inform, revelation, tell | 告げる（つげる） to tell; 告白（こくはく） confession (to a crime, wrongdoing, etc.) | N3 | ❌ |
| 82 | 反 | タン, ハン, ホ, ホン | -かえ.る, かえ.す, かえ.る, そ.らす, そ.る | anti- | 反（はん） anti-; 反（たん） variable measure of fabric (28.8 cm in width) | N3 | N4VOL4 |
| 83 | 判 | ハン, バン | わか.る | judgement, judgment, seal, signature, stamp | 判（はん） seal; 判決（はんけつ） judicial decision | N3 | ❌ |
| 84 | 認 | ニン | したた.める, みと.める | acknowledge, appreciate, believe, discern, recognize, witness | 認識（にんしき） recognition; 認める（みとめる） to recognize | N3 | ❌ |
| 85 | 参 | サン, シン | まい-, まい.る, まじわる, みつ | be defeated, be madly in love, coming, die, going, nonplussed, participate, take part in, three (in documents), visit, visiting | 参（しん） Chinese "Three Stars" constellation (one of the 28 mansions); 参議院（さんぎいん） House of Councillors (upper house of the National Diet of Japan) | N3 | ❌ |
| 86 | 利 | リ | き.く | advantage, benefit, profit | 利（り） advantage; 利益（りえき） profit | N3 | VOL5, N4VOL5 |
| 87 | 組 | ソ | -ぐみ, く.む, くみ | assemble, association, braid, construct, cooperate, grapple, plait, unite | 組（くみ） class (of students); 組合（くみあい） association | N3 | N4VOL4 |
| 88 | 信 | シン |  | faith, fidelity, trust, truth | 信（しん） honesty; 信頼（しんらい） trust (in) | N3 | ❌ |
| 89 | 在 | ザイ | あ.る | exist, located in, outskirts, suburbs | 在（ざい） the country; 在庫（ざいこ） stock | N3 | ❌ |
| 90 | 件 | ケン | くだん | affair, case, item, matter | 件（けん） matter; 件（くだん） the aforementioned | N3 | ❌ |
| 91 | 側 | ソク | かわ, がわ, そば | lean, oppose, regret, side | 側（がわ） side (of something, or taking someone's side); 側（そば） near | N3 | ❌ |
| 92 | 任 | ニン | まか.す, まか.せる | appoint, duty, entrust to, responsibility, term | 任（にん） obligation; 任せる（まかせる） to leave (a matter, decision, etc. to someone) | N3 | ❌ |
| 93 | 引 | イン | ひ.く, ひ.ける | admit, install, jerk, pull, quote, refer to, tug | 引き（びき） -off (price reduction); 引用（いんよう） quotation | N3 | VOL4, N4VOL4 |
| 94 | 求 | キュウ, グ | もと.める | demand, request, require, want, wish for | 求める（もとめる） to want; 求人（きゅうじん） recruiting | N3 | ❌ |
| 95 | 所 | ショ | -ところ, とこ, ところ, どころ | extent, place | 所（ところ） place; 所（しょ） counter for places | N3 | VOL3, N4VOL2, N4VOL3, N4VOL4 |
| 96 | 次 | シ, ジ | つ.ぐ, つぎ | next, order, sequence | 次（つぎ） next; 次（じ） next | N3 | VOL4 |
| 97 | 昨 | サク |  | previous, yesterday | 昨（さく） last (year); 昨日（きのう） yesterday | N3 | VOL1, VOL2, VOL5 |
| 98 | 論 | ロン | あげつら.う | argument, discourse | 論（ろん） argument; 論文（ろんぶん） thesis | N3 | ❌ |
| 99 | 官 | カン |  | bureaucrat, organ, the government | 官（かん） government; 官（つかさ） office | N3 | ❌ |
| 100 | 増 | ゾウ | ふ.える, ふ.やす, ま.し, ま.す | add, augment, gain, increase, promote | 増（ぞう） increase; 増える（ふえる） to increase | N3 | N4VOL4 |
| 101 | 係 | ケイ | -がかり, かか.る, かか.わる, かかり | concern oneself, connection, duty, person in charge | 係（かかり） charge; 係（がかり） charge | N3 | N4VOL2 |
| 102 | 感 | カン |  | emotion, feeling, sensation | 感（かん） feeling; 感情（かんじょう） emotion | N3 | ❌ |
| 103 | 情 | ジョウ, セイ | なさ.け | circumstances, emotion, facts, feelings, passion, sympathy | 情（じょう） feelings; 情報（じょうほう） information | N3 | ❌ |
| 104 | 投 | トウ | -な.げ, な.げる | abandon, discard, give up, hurl, invest in, join, launch into, sell at a loss, throw | 投（とう） pitching ability; 投票（とうひょう） voting | N3 | N4VOL4 |
| 105 | 示 | シ, ジ | しめ.す | display, express, indicate, point out, show | 示す（しめす） to (take out and) show; 示唆（しさ） suggestion | N3 | ❌ |
| 106 | 打 | ダ, ダース | う.ち-, う.つ, ぶ.つ | dozen, hit, knock, pound, strike | 打（ダース） dozen; 打（だ） hitting a ball (with a bat, golf club, etc.) | N3 | N4VOL1 |
| 107 | 直 | ジカ, ジキ, チョク | -なお.す, す.ぐ, ただ.ちに, なお.き, なお.す, なお.る | fix, frankness, honesty, repair, straightaway | 直（じき） soon; 直（ちょく） direct | N3 | N4VOL4 |
| 108 | 両 | リョウ | てる, ふたつ | both, counter for carriages (e.g., in a train), old Japanese coin, two | 両（りょう） both (hands, parents, sides, etc.); 両（りゃん） two | N3 | VOL5, N4VOL5 |
| 109 | 式 | シキ |  | ceremony, expression, form, function, method, rite, style, system | 式（しき） way; 式典（しきてん） ceremony | N3 | ❌ |
| 110 | 果 | カ | -は.たす, -は.てる, は.たす, は.て, は.てる, はた.す | achieve, carry out, complete, end, finish, fruit, reward, succeed | 果て（はて） end; 果（か） phala (attained state, result) | N3 | VOL2 |
| 111 | 容 | ヨウ | い.れる | contain, form, looks |  | N3 | ❌ |
| 112 | 必 | ヒツ | かなら.ず | certain, inevitable, invariably | 必（ひつ） definiteness; 必要（ひつよう） necessary | N3 | N4VOL2, N4VOL4 |
| 113 | 演 | エン |  | act, performance, play, render, stage | 演説（えんぜつ） speech; 演劇（えんげき） drama | N3 | ❌ |
| 114 | 争 | ソウ | あらそ.う, いか.でか | argue, contend, dispute | 争う（あらそう） to compete; 争い（あらそい） fight | N3 | N4VOL2, N4VOL3 |
| 115 | 談 | ダン |  | discuss, talk | 談（だん） talk; 談話（だんわ） talk | N3 | ❌ |
| 116 | 能 | ノウ | あた.う, よ.く | ability, capacity, skill, talent | 能（のう） talent; 能力（のうりょく） ability | N3 | ❌ |
| 117 | 位 | イ | くらい, ぐらい | about, crown, grade, rank, some, throne | 位（くらい） throne; 位（い） rank | N3 | ❌ |
| 118 | 置 | チ | -お.き, お.く | deposit, employ, keep, leave behind, pawn, placement, put, set | 置く（おく） to put; 置き去り（おきざり） leaving behind | N3 | VOL1 |
| 119 | 流 | リュウ, ル | -なが.す, なが.す, なが.れ, なが.れる | a sink, current, flow, forfeit | 流（りゅう） way; 流（る） exile (second most severe of the five ritsuryō punishments) | N3 | ❌ |
| 120 | 格 | カク, キャク, コウ, ゴウ |  | capacity, case (law, grammar), character, rank, status | 格（かく） status; 格（きゃく） amendment (to ritsuryō) | N3 | ❌ |
| 121 | 疑 | ギ | うたが.う | be suspicious, distrust, doubt, question | 疑（ぎ） doubt; 疑う（うたがう） to doubt | N3 | ❌ |
| 122 | 過 | カ | あやま.ち, あやま.つ, す.ぎる, す.ごす, よ.ぎる, よぎ.る | error, exceed, go beyond, overdo | 過（か） surplus-; 過去（かこ） the past | N3 | N4VOL3 |
| 123 | 局 | キョク | つぼね | affair, board, bureau, conclusion, court lady, her apartment, lady-in-waiting, office | 局（きょく） bureau; 局（つぼね） court lady (Heian period) | N3 | VOL5 |
| 124 | 放 | ホウ | -っぱな.し, こ.く, はな.す, はな.つ, はな.れる, ほう.る | banish, emit, fire, liberate, release, set free, shoot | 放送（ほうそう） broadcasting; 放射（ほうしゃ） radiation | N3 | ❌ |
| 125 | 常 | ジョウ | つね, とこ- | always, common, continually, long-lasting, normal, ordinary, regular, usual | 常（つね） usual state of things; 常（とこ） constant | N3 | N4VOL4 |
| 126 | 状 | ジョウ |  | appearance, circumstances, conditions, form, status quo | 状（じょう） form; 状況（じょうきょう） state of affairs | N3 | ❌ |
| 127 | 球 | キュウ | たま | ball, sphere | 球（きゅう） sphere; 球技（きゅうぎ） ball game (e.g. baseball, tennis, soccer) | N3 | ❌ |
| 128 | 職 | ショク, ソク |  | employment, post, work | 職（しょく） job; 職（しき） agency (government department between a ministry and a bureau under the ritsuryō system) | N3 | ❌ |
| 129 | 与 | ヨ | あずか.る, あた.える, くみ.する, ともに | award, bestow, cause, gift, give, godsend, impart, participate in, provide | 与（むた） together with ...; 与党（よとう） ruling party | N3 | ❌ |
| 130 | 供 | キョウ, ク, クウ, グ | -ども, そな.える, とも | accompany, offer, present, serve (meal), submit | 供（とも） companion; 供給（きょうきゅう） supply | N3 | VOL3 |
| 131 | 役 | エキ, ヤク |  | campaign, drafted labor, duty, office, role, service, war | 役（やく） role; 役（えき） war | N3 | N4VOL5 |
| 132 | 構 | コウ | かま.う, かま.える | appearance, build, posture, set up, stance | 構え（かまえ） structure; 構う（かまう） to mind | N3 | ❌ |
| 133 | 割 | カツ | さ.く, わ.り, わ.る, わ.れる, わり | comparatively, cut, divide, proportion, separate, split | 割り（わり） rate; 割合（わりあい） rate | N3 | N4VOL5 |
| 134 | 身 | シン | み | one's station in life, person, somebody | 身（み） one's body | N3 | ❌ |
| 135 | 費 | ヒ | つい.える, つい.やす | consume, cost, expense, spend, waste | 費（ひ） cost; 費用（ひよう） cost | N3 | ❌ |
| 136 | 由 | ユ, ユイ, ユウ | よ.る, よし | a reason, wherefore | 由（よし） reason; 由来（ゆらい） origin | N3 | N4VOL3, N4VOL5 |
| 137 | 説 | セツ, ゼイ | と.く | explanation, opinion, rumor, theory | 説（せつ） theory; 説明（せつめい） explanation | N3 | N4VOL3 |
| 138 | 難 | ナン | -がた.い, -にく.い, かた.い, むずか.しい, むつか.しい, | accident, defect, difficult, impossible, trouble | 難（なん） difficulty; 難しい（むずかしい） difficult | N3 | VOL5 |
| 139 | 優 | ウ, ユウ | すぐ.れる, まさ.る, やさ.しい | actor, excel, gentleness, superiority, surpass, tenderness | 優（ゆう） Excellent (grade); 優（やさ） gentle | N3 | N4VOL5 |
| 140 | 夫 | フ, フウ, ブ | おっと, それ | husband, man | 夫（おっと） husband | N3 | VOL3, N4VOL1 |
| 141 | 収 | シュウ | おさ.まる, おさ.める | income, obtain, pay, reap, store, supply | 収入（しゅうにゅう） income; 収穫（しゅうかく） harvest | N3 | ❌ |
| 142 | 断 | ダン | ことわ.る, さだ.める, た.つ | apologize, cutting, decision, decline, dismiss, judgement, prohibit, refuse, severance, warn | 断（だん） decision; 断る（ことわる） to refuse | N3 | ❌ |
| 143 | 石 | コク, シャク, セキ | いし | stone | 石（いし） stone; 石（こく） koku | N3 | N4VOL1 |
| 144 | 違 | イ | -ちが.える, たが.う, たが.える, ちが.い, ちが.う, ちが.える | differ, difference | 違う（ちがう） to differ (from); 違い（ちがい） difference | N3 | VOL3, N4VOL5 |
| 145 | 消 | ショウ | き.える, け.す | blow out, cancel, extinguish, neutralize, turn off | 消費（しょうひ） consumption; 消す（けす） to erase | N3 | VOL2, N4VOL2 |
| 146 | 神 | シン, ジン | かみ, かん-, こう- | gods, mind, soul | 神（かみ） god; 神（しん） spirit | N3 | ❌ |
| 147 | 規 | キ |  | measure, standard | 規制（きせい） regulation; 規範（きはん） model | N3 | N4VOL2 |
| 148 | 術 | ジュツ | すべ | art, magic, means, resources, skill, technique, trick | 術（じゅつ） art; 術（すべ） way | N3 | N4VOL4 |
| 149 | 備 | ビ | そな.える, そな.わる, つぶさ.に | equip, preparation, provision | 備える（そなえる） to furnish with; 備わる（そなわる） to be furnished with | N3 | ❌ |
| 150 | 宅 | タク |  | home, house, my husband, our house, residence | 宅（たく） house; 宅配便（たくはいびん） express home delivery service | N3 | N4VOL1 |
| 151 | 害 | ガイ |  | harm, injury | 害（がい） injury; 害する（がいする） to injure | N3 | ❌ |
| 152 | 配 | ハイ | くば.る | distribute, exile, rationing, spouse | 配達（はいたつ） delivery; 配る（くばる） to distribute | N3 | ❌ |
| 153 | 警 | ケイ | いまし.める | admonish, commandment | 警察（けいさつ） police; 警官（けいかん） police officer | N3 | N4VOL2 |
| 154 | 育 | イク | そだ.ち, そだ.つ, そだ.てる, はぐく.む | bring up, grow up, raise, rear | 育てる（そだてる） to raise; 育つ（そだつ） to be raised (e.g. child) | N3 | N4VOL2, N4VOL3 |
| 155 | 席 | セキ | むしろ | mat, occasion, place, seat | 席（せき） seat; 席上（せきじょう） at the meeting | N3 | N4VOL3 |
| 156 | 訪 | ホウ | おとず.れる, たず.ねる, と.う | call on, look up, offer sympathy, visit | 訪ねる（たずねる） to visit; 訪問（ほうもん） call | N3 | ❌ |
| 157 | 乗 | ショウ, ジョウ | -の.り, の.せる, の.る | board, counter for vehicles, join, mount, multiplication, power, record, ride | 乗（じょう） (nth) power; 乗り物（のりもの） vehicle | N3 | VOL4, N4VOL4 |
| 158 | 残 | サン, ザン | そこな.う, のこ.す, のこ.り, のこ.る | balance, leftover, remainder | 残（ざん） remainder; 残念（ざんねん） regrettable | N3 | N4VOL3, N4VOL4 |
| 159 | 想 | ソ, ソウ | おも.う | concept, idea, think, thought | 想（そう） conception; 想像（そうぞう） imagination | N3 | ❌ |
| 160 | 声 | ショウ, セイ | こえ, こわ- | voice | 声（こえ） voice; 声（しょう） voice | N3 | VOL2 |
| 161 | 助 | ジョ | す.ける, すけ, たす.かる, たす.ける | assist, help, rescue | 助（じょ） help; 助（すけ） assistance | N3 | ❌ |
| 162 | 労 | ロウ | いた.ずき, いたわ.る, つか.れる, ねぎら, ねぎら.う, ろう.する | labor, reward for, thank for, toil, trouble | 労（ろう） labor; 労働（ろうどう） labor | N3 | ❌ |
| 163 | 例 | レイ | たと.える | custom, example, precedent, usage | 例（れい） example; 例（ためし） precedent | N3 | N4VOL3 |
| 164 | 然 | ゼン, ネン | さ, しか, しか.し, しか.り | if so, in that case, so, sort of thing, well | 然（しか） like that; 然（さ） so | N3 | ❌ |
| 165 | 限 | ゲン | -かぎ.り, かぎ.り, かぎ.る | limit, restrict, to best of ability | 限る（かぎる） to restrict; 限界（げんかい） limit | N3 | ❌ |
| 166 | 追 | ツイ | お.う | chase, drive away, follow, meanwhile, pursue | 追いつく（おいつく） to catch up (with); 追う（おう） to chase | N3 | ❌ |
| 167 | 商 | ショウ | あきな.う | dealing in, make a deal, merchant, selling | 商（しょう） quotient; 商人（しょうにん） merchant | N3 | ❌ |
| 168 | 伝 | テン, デン | -づた.い, つた.う, つた.える, つた.わる, つだ.う, つて | communicate, follow, go along, legend, report, tradition, transmit, walk along | 伝（でん） legend; 伝（つて） means of making contact | N3 | N4VOL3, N4VOL4 |
| 169 | 形 | ギョウ, ケイ | -がた, かた, かたち, なり | form, shape, style | 形（かたち） form; 形（かた） shape | N3 | N4VOL4 |
| 170 | 景 | ケイ |  | scenery, view | 景（けい） vista; 景色（けしき） scenery | N3 | N4VOL2 |
| 171 | 落 | ラク | お.ち, お.ちる, お.とす | come down, drop, fall, hamlet, village | 落ち（おち） slip; 落ちる（おちる） to fall | N3 | N4VOL1 |
| 172 | 好 | コウ | い.い, この.む, す.く, よ.い | fond, like something, pleasing | 好（こう） good; 好き（すき） liking | N3 | VOL3 |
| 173 | 頭 | ズ, ト, トウ | -がしら, あたま, かしら, かぶり | counter for large animals, head | 頭（あたま） head; 頭（とう） counter for large animals (e.g. head of cattle) | N3 | VOL1 |
| 174 | 退 | タイ | しりぞ.く, しりぞ.ける, ど.く, の.く, の.ける, ひ.く | expel, reject, repel, resign, retire, retreat, withdraw | 退屈（たいくつ） tedious; 退院（たいいん） leaving hospital | N3 | N4VOL3 |
| 175 | 負 | フ | お.う, ま.かす, ま.ける-, assume a | responsibility, bear, defeat, minus, negative, owe | 負（ふ） negative; 負債（ふさい） debt | N3 | N4VOL4 |
| 176 | 渡 | ト | -わた.る, わた.す, わた.る | cross, deliver, diameter, ferry, ford, import, migrate, transit | 渡す（わたす） to ferry across (e.g. a river); 渡る（わたる） to cross over | N3 | VOL5 |
| 177 | 失 | シツ | う.せる, うしな.う | disadvantage, error, fault, lose, loss | 失（しつ） loss (of something); 失業（しつぎょう） unemployment | N3 | ❌ |
| 178 | 差 | サ | さ.し, さ.す | balance, difference, discrepancy, distinction, margin, variation | 差（さ） difference; 差し（さし） between (e.g. two people) | N3 | VOL2, VOL3 |
| 179 | 末 | バツ, マツ | うら, うれ, すえ | close, end, posterity, powder, tip | 末（すえ） end; 末（まつ） the end (of) | N3 | ❌ |
| 180 | 守 | シュ, ス | -もり, かみ, まも.り, まも.る, もり | defend, guard, obey, protect | 守り（まもり） protection; 守り（もり） babysitting | N3 | ❌ |
| 181 | 若 | ジャク, ニャ, ニャク | ごと.し, も.し, も.しくは, も.しくわ, わか-, わか.い | if, immature, low number, perhaps, possibly, young | 若（わか） youth; 若い（わかい） young | N3 | VOL5 |
| 182 | 種 | シュ | -ぐさ, たね | class, kind, seed, species, variety | 種（たね） seed (e.g. of a plant); 種（しゅ） kind | N3 | ❌ |
| 183 | 美 | ビ, ミ | うつく.しい | beautiful, beauty | 美（び） beauty; 美術館（びじゅつかん） art museum | N3 | N4VOL1, N4VOL4 |
| 184 | 命 | ミョウ, メイ | いのち | appoint, command, decree, destiny, fate, life | 命（いのち） life; 命（めい） order | N3 | ❌ |
| 185 | 福 | フク |  | blessing, fortune, luck, wealth | 福（ふく） good fortune; 福祉（ふくし） welfare | N3 | ❌ |
| 186 | 望 | ボウ, モウ | のぞ.む, もち | ambition, aspire to, desire, expect, full moon, hope | 望（もち） full moon; 望遠鏡（ぼうえんきょう） telescope | N3 | ❌ |
| 187 | 非 | ヒ | あら.ず | injustice, mistake, negative, non-, un- | 非（ひ） fault; 非常（ひじょう） emergency | N3 | N4VOL4 |
| 188 | 観 | カン | しめ.す, み.る | appearance, condition, look, outlook, view | 観（かん） look; 観客（かんきゃく） spectator | N3 | ❌ |
| 189 | 察 | サツ |  | guess, judge, presume, surmise, understand | 察（さつ） cops; 察する（さっする） to guess | N3 | N4VOL2 |
| 190 | 段 | タン, ダン |  | grade, stairs, steps | 段（だん） step; 段々（だんだん） gradually | N3 | VOL2, N4VOL4 |
| 191 | 横 | オウ | よこ | horizontal, perverse, side, sideways, unreasonable, width, woof | 横（よこ） horizontal (as opposed to vertical); 横断（おうだん） crossing (a road, river, etc.) | N3 | VOL5 |
| 192 | 深 | シン | -ぶか.い, ふか.い, ふか.まる, ふか.める, み- | deep, heighten, intensify, strengthen | 深夜（しんや） late at night | N3 | N4VOL4 |
| 193 | 申 | シン | さる, もう.し-, もう.す | 3-5PM, have the honor to, ninth sign of Chinese zodiac, sign of the monkey | 申（さる） the Monkey (ninth sign of the Chinese zodiac); 申し上げる（もうしあげ る） to say | N3 | ❌ |
| 194 | 様 | ショウ, ヨウ | さま, さん | Esq., manner, polite suffix, situation, way | 様（よう） appearing ...; 様（さま） Mr | N3 | N4VOL2 |
| 195 | 財 | サイ, ザイ, ゾク | たから | assets, money, property, wealth | 財（ざい） fortune; 財布（さいふ） wallet | N3 | VOL3 |
| 196 | 港 | コウ | みなと | harbor | 港（みなと） harbour; 港（こう） harbour | N3 | N4VOL2, N4VOL5 |
| 197 | 識 | シキ | し.る, しる.す | discriminating, know, write | 識（しき） acquaintanceship; 識別（しきべつ） distinction | N3 | ❌ |
| 198 | 呼 | コ | よ.ぶ | call, call out to, invite | 呼吸（こきゅう） breathing; 呼ぶ（よぶ） to call out (to) | N3 | VOL5 |
| 199 | 達 | タツ, ダ | -たち | accomplished, arrive, attain, reach | 達（たち） pluralizing suffix (esp. for people and animals; 達（だち） friend | N3 | VOL4 |
| 200 | 良 | リョウ | -い.い, -よ.い, い.い, よ.い | good, pleasing, skilled | 良（りょう） good (quality, condition, etc.); 良い（よい） good | N3 | ❌ |
| 201 | 阪 | ハン | さか | heights, slope | 阪神（はんしん） Osaka-Kobe; 阪神大震災（はんしんだ いしんさい） Great Hanshin Earthquake (1995) | N3 | ❌ |
| 202 | 候 | コウ | そうろう | climate, expect, season, wait for, weather | 候（こう） season; 候（そろ） to be | N3 | ❌ |
| 203 | 程 | テイ | -ほど, ほど | amount, degree, distance, extent, formula, law, limits | 程（ほど） extent; 程度（ていど） degree | N3 | ❌ |
| 204 | 満 | バン, マン | み.たす, み.ちる, み.つ | enough, full, fullness, satisfy | 満（まん） being full; 満月（まんげつ） full moon | N3 | ❌ |
| 205 | 敗 | ハイ | やぶ.れる | defeat, failure, reversal | 敗（はい） loss; 敗戦（はいせん） defeat | N3 | ❌ |
| 206 | 値 | チ | あたい, ね | cost, price, value | 値（あたい） price; 値（ね） price | N3 | N4VOL4 |
| 207 | 突 | カ, トツ | つ.く | collision, pierce, prick, protruding, stab, sudden, thrust | 突然（とつぜん） abrupt; 突く（つく） to prick | N3 | ❌ |
| 208 | 光 | コウ | ひか.る, ひかり | light, ray | 光（ひかり） light; 光線（こうせん） beam | N3 | N4VOL4 |
| 209 | 路 | ル, ロ | -じ, みち | distance, path, road, route | 路（じ） route; 路（ち） way | N3 | ❌ |
| 210 | 科 | カ |  | course, department, section | 科（か） department; 科（しな） Japanese linden (Tilia japonica) | N3 | N4VOL1 |
| 211 | 積 | セキ | -づ.み, つ.む, つ.もり, つ.もる | acreage, amass, contents, load, pile up, product (x*y), stack, volume | 積（せき） product; 積もり（つもり） intention | N3 | ❌ |
| 212 | 処 | ショ | -こ, お.る, ところ | act, behave, condemn, deal with, dispose, manage, place, sentence | 処（どころ） restaurant; 処罰（しょばつ） punishment | N3 | ❌ |
| 213 | 園 | エン | その | farm, garden, park, yard | 園（えん） garden; 園（その） garden | N3 | VOL2, N4VOL4 |
| 214 | 太 | タ, タイ | ふと.い, ふと.る | big around, plump, thick | 太（ふと） fat; 太陽（たいよう） Sun | N3 | VOL5, N4VOL4 |
| 215 | 客 | カク, キャク |  | client, customer, guest, visitor | 客（きゃく） guest; 客（まれびと） visitor from afar | N3 | N4VOL2 |
| 216 | 否 | ヒ | いな, いや | decline, deny, negate, no, noes, refuse | 否（いや） no; 否（いな） no | N3 | ❌ |
| 217 | 師 | シ | いくさ | army (incl. counter), exemplar, expert, master, model, teacher, war | 師（し） teacher; 師団（しだん） (army) division | N3 | N4VOL2 |
| 218 | 登 | ショウ, チョウ, ト, トウ, ドウ | あ.がる, のぼ.る | ascend, climb up | 登山（とざん） mountain climbing; 登場（とうじょう） entrance (on the stage) | N3 | VOL4 |
| 219 | 易 | イ, エキ | やさ.しい, やす.い | divination, easy, fortune- telling, ready to, simple | 易（えき） type of cleromancy divination (described in the Book of Changes) performed with long sticks; 易（い） easiness | N3 | VOL5 |
| 220 | 速 | ソク | すみ.やか, はや-, はや.い, はや.める | fast, quick | 速（そく） gear; 速度（そくど） speed | N3 | VOL4 |
| 221 | 存 | ソン, ゾン | あ.る, たも.つ, と.う, ながら.える | be aware of, believe, exist, feel, suppose | 存在（そんざい） existence; 存じる（ぞんじる） to know | N3 | N4VOL2 |
| 222 | 飛 | ヒ | -と.ばす, と.ばす, と.ぶ | fly, scatter, skip (pages) | 飛（ひ） rook; 飛行機（ひこうき） airplane | N3 | VOL4 |
| 223 | 殺 | サイ, サツ, セツ | -ごろ.し, あや.める, ころ.す, そ.ぐ | butcher, diminish, kill, murder, reduce, slice off, split, spoil | 殺人（さつじん） murder; 殺す（ころす） to kill | N3 | ❌ |
| 224 | 号 | ゴウ | さけ.ぶ, よびな | call, item, name, nickname, number, pseudonym, title | 号（ごう） number; 号車（ごうしゃ） suffix for train car numbers | N3 | VOL4 |
| 225 | 単 | タン | ひとえ | merely, one, simple, single | 単（たん） single; 単位（たんい） unit | N3 | N4VOL2 |
| 226 | 座 | ザ | すわ.る | cushion, gathering, seat, sit, squat | 座（ざ） seat; 座席（ざせき） seat | N3 | VOL3 |
| 227 | 破 | ハ | やぶ.る, やぶ.れる, わ.れる | break, defeat, destroy, frustrate, rend, rip, tear | 破（は） middle section of a song (in gagaku or noh); 破壊（はかい） destruction | N3 | ❌ |
| 228 | 除 | ジ, ジョ | -よ.け, のぞ.く | abolish, cancel, division (x/3), except, exclude, remove | 除（じょ） division; 除く（のぞく） to remove | N3 | VOL3 |
| 229 | 完 | カン |  | completion, end, perfect | 完（かん） The End; 完全（かんぜん） perfect | N3 | ❌ |
| 230 | 降 | コウ, ゴ | お.りる, お.ろす, くだ.す, くだ.る, ふ.り, ふ.る | descend, fall, precipitate, surrender | 降りる（おりる） to descend (e.g. a mountain); 降る（ふる） to fall (of rain, snow, ash, etc.) | N3 | VOL2, VOL5 |
| 231 | 責 | セキ | せ.める | blame, censure, condemn | 責（せき） responsibility; 責任（せきにん） duty | N3 | ❌ |
| 232 | 捕 | ホ | つか.まえる, つか.まる, と.らえる, と.らわれる, と.る, とら.える, | capture, catch | 捕虜（ほりょ） prisoner (of war); 捕鯨（ほげい） whaling | N3 | N4VOL3 |
| 233 | 危 | キ | あぶ.ない, あや.うい, あや.ぶむ | dangerous, fear, uneasy | 危（き） danger; 危険（きけん） danger | N3 | VOL1, N4VOL2 |
| 234 | 給 | キュウ | -たま.え, たま.う, たも.う | allow, bestow on, gift, grant, salary, wage | 給（きゅう） wage; 給与（きゅうよ） pay | N3 | ❌ |
| 235 | 苦 | ク | -ぐる.しい, くる.しい, くる.しむ, くる.しめる, にが.い, にが.る | feel bitter, hardship, scowl, suffering, trial, worry | 苦（く） pain; 苦い（にがい） bitter | N3 | N4VOL4 |
| 236 | 迎 | ゲイ | むか.える | greet, meet, welcome | 迎える（むかえる） to go out to meet; 迎え（むかえ） meeting | N3 | N4VOL5 |
| 237 | 具 | グ | そな.える, つぶさ.に | counter for armor, suits, sets of furniture, ingredients, means, possess, tool, utensil | 具（ぐ） tool; 具合（ぐあい） condition | N3 | N4VOL2, N4VOL4 |
| 238 | 辞 | ジ | いな.む, や.める | expression, resign, term, word | 辞（じ） address (e.g. opening or closing remarks); 辞典（じてん） dictionary | N3 | VOL3 |
| 239 | 因 | イン | ちな.む, よ.る | be associated with, be limited to, cause, depend on, factor | 因（いん） cause | N3 | N4VOL2 |
| 240 | 馬 | バ | うま, うま-, ま | horse | 馬（うま） horse; 馬鹿（ばか） idiot | N3 | ❌ |
| 241 | 富 | フ, フウ | と.む, とみ | abundant, enrich, wealth | 富（とみ） riches; 富豪（ふごう） wealthy person | N3 | ❌ |
| 242 | 彼 | ヒ | か.の, かの, かれ | he, that, the | 彼（かれ） he; 彼（あれ） that | N3 | N4VOL2 |
| 243 | 未 | ビ, ミ | いま.だ, ひつじ, ま.だ | 1-3PM, eighth sign of Chinese zodiac, even now, hitherto, not yet, sign of the ram, still, un- | 未（み） not yet; 未（ひつじ） the Sheep (eighth sign of the Chinese zodiac) | N3 | ❌ |
| 244 | 舞 | ブ | -ま.う, ま.う, まい | circle, dance, flit, wheel | 舞（まい） dancing; 舞台（ぶたい） stage (of a theatre, concert hall, etc.) | N3 | N4VOL1 |
| 245 | 亡 | ボウ, モウ | な.い, な.き-, ほろ.びる, ほろ.ぶ, ほろ.ぼす | deceased, dying, perish, the late | 亡（ぼう） death; 亡くなる（なくなる） to die | N3 | N4VOL4 |
| 246 | 冷 | レイ | さ.ます, さ.める, つめ.たい, ひ.える, ひ.や, ひ.やかす, ひ.やす, ひ.ややか | chill, cold (beer, person), cool | 冷や（ひや） cold water; 冷（れい） refrigerator | N3 | VOL4, VOL5 |
| 247 | 適 | テキ | かな.う | capable, occasional, qualified, rare, suitable | 適当（てきとう） suitable | N3 | ❌ |
| 248 | 婦 | フ | よめ | bride, lady, wife, woman | 婦（ふ） married woman; 婦人（ふじん） woman | N3 | ❌ |
| 249 | 寄 | キ | -よ.り, よ.せる, よ.る | bring near, collect, draw near, forward, gather, send, stop in | 寄付（きふ） contribution; 寄る（よる） to approach | N3 | ❌ |
| 250 | 込 |  | -こ.み, -こ.む, こ.み, こ.む, こ.める | (kokuji), crowded, in bulk, included, mixture | 込み（こみ） including ...; 込む（こむ） to be crowded | N3 | ❌ |
| 251 | 顔 | ガン | かお | expression, face | 顔（かお） face; 顔（かんばせ） countenance | N3 | ❌ |
| 252 | 類 | ルイ | たぐ.い | class, genus, kind, sort, variety | 類（るい） kind; 類い（たぐい） kind | N3 | ❌ |
| 253 | 余 | ヨ | あま.す, あま.り, あま.る, あんま.り | myself, other, remainder, surplus, too much | 余（よ） other; 余り（あまり） remainder | N3 | ❌ |
| 254 | 王 | -ノウ, オウ |  | king, magnate, rule | 王（おう） king; 王様（おうさま） king | N3 | ❌ |
| 255 | 返 | ヘン | -かえ.す, -かえ.る, かえ.す, かえ.る | answer, fade, repay, return | 返（へん） reply; 返す（かえす） to return (something) | N3 | VOL2, N4VOL4 |
| 256 | 妻 | サイ | つま | spouse, wife | 妻（つま） wife; 妻（つま） my dear | N3 | N4VOL4 |
| 257 | 背 | ハイ | せ, せい, そむ.く, そむ.ける | back, behind, defy, disobey, go back on, height, rebel, stature | 背（せ） back; 背（せい） height | N3 | N4VOL3 |
| 258 | 熱 | ネツ | あつ.い | fever, heat, mania, passion, temperature | 熱（ねつ） heat; 熱（ねち） fever | N3 | VOL1, N4VOL4 |
| 259 | 宿 | シュク | やど, やど.す, やど.る | be pregnant, dwell, dwelling, home, inn, lodge, lodging, relay station | 宿（やど） lodging; 宿（しゅく） lodging | N3 | VOL3, N4VOL2 |
| 260 | 険 | ケン | けわ.しい | impregnable position, inaccessible place, precipitous, sharp eyes, steep place | 険（けん） steepness; 険しい（けわしい） precipitous | N3 | N4VOL2 |
| 261 | 頼 | ライ | たの.む, たの.もしい, たよ.る | request, trust | 頼む（たのむ） to request; 頼る（たよる） to rely on | N3 | VOL3 |
| 262 | 覚 | カク | おぼ.える, さ.ます, さ.める, さと.る | awake, learn, memorize, remember, sober up | 覚（さとり） Satori; 覚える（おぼえる） to memorize | N3 | VOL2 |
| 263 | 船 | セン | ふな-, ふね | boat, ship | 船（ふね） ship; 船（せん） ship | N3 | ❌ |
| 264 | 途 | ト | みち | road, route, way | 途（と） way; 途中（とちゅう） on the way | N3 | N4VOL4 |
| 265 | 許 | キョ | もと, ゆる.す | approve, permit | 許り（ばかり） only; 許し（ばかし） approximately | N3 | ❌ |
| 266 | 抜 | ハイ, ハツ, バツ | -ぬ.く, ぬ.かす, ぬ.かる, ぬ.き, ぬ.く, ぬ.ける | extract, omit, pilfer, pull out, quote, remove, slip out | 抜く（ぬく） to pull out; 抜ける（ぬける） to come out | N3 | ❌ |
| 267 | 便 | ビン, ベン | たよ.り | chance, convenience, excrement, facility, feces, letter | 便（びん） flight (e.g. airline flight); 便（べん） convenience | N3 | VOL5, N4VOL4 |
| 268 | 留 | リュウ, ル | と.まる, と.める, とど.まる, とど.める, るうぶる | detain, fasten, halt, stop | 留（りゅう） stationary point; 留（ルーブル） ruble (Russian currency) | N3 | VOL5 |
| 269 | 罪 | ザイ | つみ | blame, crime, fault, guilt, offense, sin | 罪（つみ） crime; 罪（ざい） crime | N3 | ❌ |
| 270 | 努 | ド | つと.める | as much as possible, diligent, toil | 努（ど） third principle of the Eight Principles of Yong; 努（ゆめ） never | N3 | ❌ |
| 271 | 精 | ショウ, セイ | くわ.しい, しら.げる | energy, excellence, fairy, ghost, purity, refined, semen, skill, vitality | 精（せい） spirit; 精神（せいしん） mind | N3 | ❌ |
| 272 | 散 | サン | -ち.らす, ち.らかす, ち.らかる, ち.らす, ち.らばる, ち.る, ばら, | disperse, scatter, spend, squander | 散（ばら） loose articles (not packaged with other things); 散歩（さんぽ） walk | N3 | VOL3 |
| 273 | 静 | ジョウ, セイ | しず-, しず.か, しず.まる, しず.める | quiet | 静（しず） quiet; 静（せい） stillness | N3 | VOL3 |
| 274 | 婚 | コン |  | marriage | 婚（こん） marriage; 婚（くながい） sexual intercourse | N3 | VOL2 |
| 275 | 喜 | キ | よろこ.ばす, よろこ.ぶ | rejoice, take pleasure in | 喜ぶ（よろこぶ） to be delighted; 喜劇（きげき） comedy | N3 | N4VOL5 |
| 276 | 浮 | フ | う.かぶ, う.かべる, う.かれる, う.く | float, floating, rise to surface | 浮力（ふりょく） buoyancy; 浮かべる（うかべる） to float | N3 | ❌ |
| 277 | 絶 | ゼツ | た.える, た.つ, た.やす | abstain, be beyond, cut off, discontinue, interrupt, peerless, sever, suppress, unparalleled, without match | 絶（ぜつ） starting field which contains the November and/or December 20-point card; 絶滅（ぜつめつ） extinction | N3 | ❌ |
| 278 | 幸 | コウ | さいわ.い, さち, しあわ.せ | blessing, fortune, happiness | 幸（さち） good luck; 幸福（こうふく） happiness | N3 | ❌ |
| 279 | 押 | オウ | お.さえる, お.し-, お.す, お.っ-, おさ.える | attach, check, do in spite of, press, push, seal, seize, shove, stop, subdue, weight | 押入れ（おしいれ） closet (built into the wall, usu. with sliding doors); 押す（おす） to push | N3 | VOL1, N4VOL1 |
| 280 | 倒 | トウ | -だお.れ, さかさ, さかさま, さかしま, たお.す, たお.れる | break down, collapse, drop, fall, overthrow | 倒れる（たおれる） to fall (over, down) | N3 | N4VOL3 |
| 281 | 等 | トウ | -ら, など, ひと.しい | and so forth, class (first), equal, etc., quality, similar | 等（など） et cetera; 等（ら） pluralizing suffix | N3 | ❌ |
| 282 | 曲 | キョク | くま, ま.がる, ま.げる | bend, composition, crooked, curve, fault, injustice, lean, melody, music, perverse, pleasure | 曲（きょく） composition; 曲（くせ） long segment of a noh play forming its musical highlight | N3 | ❌ |
| 283 | 払 | ヒツ, フツ, ホツ | -はら.い, -ばら.い, はら.う | banish, clear out, dispose of, pay, prune | 払う（はらう） to pay (e.g. money, bill); 払い戻す（はらいもどす） to repay | N3 | N4VOL4 |
| 284 | 庭 | テイ | にわ | courtyard, garden, yard | 庭（にわ） garden; 庭園（ていえん） garden | N3 | VOL2, VOL4 |
| 285 | 徒 | ト | あだ, いたずら | emptiness, ephemeral thing, futility, gang, junior, on foot, party, people, set, uselessness, vanity | 徒（いたずら） useless; 徒（あだ） vain | N3 | VOL3 |
| 286 | 勤 | キン, ゴン | -づと.め, いそ.しむ, つと.まる, つと.める | become employed, diligence, serve | 勤める（つとめる） to work (for); 勤め（つとめ） service | N3 | VOL4 |
| 287 | 遅 | チ | おく.らす, おく.れる, おそ.い | back, late, later, slow | 遅い（おそい） slow; 遅れる（おくれる） to be late | N3 | VOL1, N4VOL1 |
| 288 | 居 | キョ, コ | -い, い.る, お.る | exist, live with, reside, to be | 居（きょ） residence; 居（い） being (somewhere) | N3 | ❌ |
| 289 | 雑 | ザツ, ゾウ | まじ.える, まじ.る | miscellaneous | 雑（ざつ） rough; 雑（ぞう） miscellany (classification of Japanese poetry unrelated to the seasons or to love) | N3 | VOL3, N4VOL4 |
| 290 | 招 | ショウ | まね.く | beckon, engage, invite, summon | 招待（しょうたい） invitation; 招く（まねく） to invite | N3 | ❌ |
| 291 | 困 | コン | こま.る | annoyed, become distressed, quandary | 困る（こまる） to be troubled; 困難（こんなん） difficulty | N3 | VOL3 |
| 292 | 欠 | ケツ, ケン | か.く, か.ける | fail, gap, lack, yawning radical (no. 76) | 欠伸（あくび） yawn; 欠（けつ） lack | N3 | ❌ |
| 293 | 刻 | コク | きざ.み, きざ.む | carving, chop, cut fine, engrave, hash, mince, time | 刻（こく） period of time (usu. a period of approx. two hours corresponding to one of the signs of the Chinese zodiac); 刻（きざ） scratch | N3 | ❌ |
| 294 | 賛 | サン | たす.ける, たた.える | agree with, approve, assist, praise, title or inscription on picture | 賛（さん） praise; 賛成（さんせい） approval | N3 | ❌ |
| 295 | 抱 | ホウ | いだ.く, かか.える, だ.く | embrace, hold in arms, hug | 抱える（かかえる） to hold in one's arms; 抱きしめる（だきしめる） to hug (someone) tight | N3 | ❌ |
| 296 | 犯 | ハン, ボン | おか.す | crime, offense, sin | 犯（はん） perpetrators of (some) crime; 犯罪（はんざい） crime | N3 | ❌ |
| 297 | 恐 | キョウ | おそ.る, おそ.れる, おそ.ろしい, こわ.い, こわ.がる | awe, dread, fear | 恐怖（きょうふ） fear | N3 | ❌ |
| 298 | 息 | ソク | いき | breath, coming to an end, interest (on money), nuture, respiration, rest, son | 息（いき） breath; 息子（むすこ） son | N3 | N4VOL5 |
| 299 | 遠 | エン, オン | とお.い | distant, far | 遠（とお） distant; 遠い（とおい） far | N3 | VOL4, N4VOL1, N4VOL4 |
| 300 | 戻 | レイ | もど.す, もど.る | go backwards, re-, restore, resume, return, revert | 戻る（もどる） to turn back (e.g. half-way); 戻す（もどす） to put back | N3 | N4VOL5 |
| 301 | 願 | ガン | -ねがい, ねが.う | hope, petition, request, vow, wish | 願い（ねがい） desire; 願（がん） prayer | N3 | ❌ |
| 302 | 絵 | エ, カイ |  | drawing, painting, picture, sketch | 絵（え） picture; 絵画（かいが） painting | N3 | VOL1 |
| 303 | 越 | エツ, オツ | -こ.す, -ご.え, -ご.し, こ.える, こ.す | Vietnam, cross over, exceed, move to, surpass | 越（えつ） Yue (kingdom in ancient China; 越える（こえる） to cross over | N3 | ❌ |
| 304 | 欲 | ヨク | ほ.しい, ほっ.する | covetousness, craving, desire, greed, longing, passion | 欲（よく） greed; 欲しい（ほしい） wanting (to have) | N3 | VOL5 |
| 305 | 痛 | ツウ | いた.い, いた.ましい, いた.む, いた.める | bruise, damage, hurt, pain | 痛（いた） ouch; 痛（つう） pain | N3 | VOL1 |
| 306 | 笑 | ショウ | え.む, わら.う | laugh | 笑い（わらい） laugh; 笑（わら） LOL | N3 | N4VOL5 |
| 307 | 互 | ゴ | かたみ.に, たが.い | mutually, reciprocally, together | 互い（たがい） each other; 互いに（たがいに） mutually | N3 | ❌ |
| 308 | 束 | ソク | たば, たば.ねる, つか, つか.ねる | bundle, control, govern, manage, ream, sheaf, tie in bundles | 束（たば） bundle; 束（そく） lattice | N3 | N4VOL5 |
| 309 | 似 | ジ | に.る, ひ.る | becoming, counterfeit, imitate, resemble, suitable | 似（に） looking like (someone); 似る（にる） to resemble | N3 | N4VOL4 |
| 310 | 列 | レ, レツ |  | column, file, rank, row, tier | 列（れつ） row; 列車（れっしゃ） train | N3 | ❌ |
| 311 | 探 | タン | さが.す, さぐ.る | grope, look for, search | 探す（さがす） to search for; 探検（たんけん） exploration | N3 | N4VOL2 |
| 312 | 逃 | トウ | に.がす, に.げる, のが.す, のが.れる | escape, evade, flee, set free, shirk | 逃げる（にげる） to run away; 逃がす（にがす） to set free | N3 | N4VOL4 |
| 313 | 遊 | ユ, ユウ | あそ.ばす, あそ.ぶ | play | 遊び（あそび） play; 遊園地（ゆうえんち） amusement park | N3 | VOL1, N4VOL1 |
| 314 | 迷 | メイ | まよ.う | astray, be perplexed, err, illusion, in doubt, lost | 迷信（めいしん） superstition; 迷惑（めいわく） trouble | N3 | N4VOL5 |
| 315 | 夢 | ボウ, ム | くら.い, ゆめ, ゆめ.みる | dream, illusion, vision | 夢（ゆめ） dream; 夢中（むちゅう） absorbed in | N3 | N4VOL5 |
| 316 | 君 | クン | -ぎみ, きみ | male name suffix, mister, ruler, you | 君（きみ） you; 君（くん） Mr | N3 | N4VOL1 |
| 317 | 閉 | ヘイ | し.まる, し.める, た.てる, と.ざす, と.じる | closed, shut | 閉める（しめる） to close; 閉まる（しまる） to be shut | N3 | VOL3 |
| 318 | 緒 | ショ, チョ | いとぐち, お | beginning, cord, end, inception, mental or emotional state, strap, thong | 緒（お） cord; 緒（しょ） beginning | N3 | VOL1 |
| 319 | 折 | シャク, セツ | -お.り, お.り, お.る, お.れる, おり | bend, break, fold, fracture, submit, yield | 折（おり） opportunity; 折る（おる） to break | N3 | N4VOL1 |
| 320 | 草 | ソウ | -ぐさ, くさ, くさ- | draft, grass, herbs, pasture, weeds, write | 草（くさ） grass; 草（そう） draft | N3 | N4VOL2 |
| 321 | 暮 | ボ | く.らす, く.れる | evening, livelihood, make a living, season's end, spend time, twilight | 暮れ（くれ） sunset; 暮れる（くれる） to get dark | N3 | ❌ |
| 322 | 酒 | シュ | さか-, さけ | alcohol, sake | 酒（さけ） alcohol; 酒（しゅ） alcohol | N3 | VOL1 |
| 323 | 悲 | ヒ | かな.しい, かな.しむ | deplore, grieve, regret, sad | 悲（ひ） karuna (compassion); 悲しい（かなしい） sad | N3 | N4VOL2 |
| 324 | 晴 | セイ | -ば.れ, は.らす, は.れ, は.れ-, は.れる | clear up | 晴れ（はれ） clear weather; 晴れる（はれる） to clear up | N3 | VOL4 |
| 325 | 掛 | カイ, ケイ | -か.かる, -か.け, -か.ける, -が.かり, -が.かる, -が.け, -がかり, か.かり, | arrive at, depend, hang, pour, suspend, tax | 掛け（かけ） credit; 掛け（がけ） -clad | N3 | N4VOL1 |
| 326 | 到 | トウ | いた.る | arrival, attain, proceed, reach, result in | 到頭（とうとう） finally; 到着（とうちゃく） arrival | N3 | ❌ |
| 327 | 寝 | シン | い.ぬ, ね.かす, ね.る, みたまや, や.める | bed, lie down, remain unsold, rest, sleep | 寝（ね） sleep; 寝（ぬ） to lie down | N3 | VOL4 |
| 328 | 暗 | アン | くら.い, くら.む, くれ.る | be blinded, darkness, disappear, grow dark, informal, shade | 暗（あん） darkness; 暗記（あんき） memorization | N3 | VOL2 |
| 329 | 盗 | トウ | ぬす.み, ぬす.む | pilfer, rob, steal | 盗む（ぬすむ） to steal; 盗難（とうなん） theft | N3 | N4VOL4 |
| 330 | 吸 | キュウ | す.う | imbibe, inhale, sip, suck | 吸収（きゅうしゅう） absorption; 吸う（すう） to smoke | N3 | VOL3 |
| 331 | 陽 | ヨウ | ひ | daytime, heaven, male, positive, sunshine, yang principle | 陽（ひ） sun; 陽（よう） (the) positive | N3 | ❌ |
| 332 | 御 | ギョ, ゴ | お-, おん-, み- | govern, honorable, manipulate | 御（ご） honorific/polite/humble prefix; 御（お） honorific/polite/humble prefix | N3 | VOL1, VOL3, VOL4, VOL5, N4VOL2 |
| 333 | 歯 | シ | は, よわ.い, よわい, よわい.する | cog, tooth | 歯（は） tooth; 歯（し） tooth | N3 | VOL4, N4VOL4 |
| 334 | 忘 | ボウ | わす.れる | forget | 忘れ物（わすれもの） lost article; 忘年会（ぼうねんかい） year-end party | N3 | VOL5, N4VOL5 |
| 335 | 雪 | セツ | ゆき | snow | 雪（ゆき） snow; 雪崩（なだれ） avalanche | N3 | VOL5 |
| 336 | 吹 | スイ | ふ.く | blow, breathe, emit, puff, smoke | 吹っ（ふっ） indicates that the action is done forcefully; 吹く（ふく） to blow (of the wind) | N3 | VOL5 |
| 337 | 娘 | ジョウ | こ, むすめ | daughter, girl | 娘（むすめ） daughter; 娘婿（むすめむこ） son-in-law | N3 | N4VOL5 |
| 338 | 誤 | ゴ | -あやま.る, あやま.る | do wrong, err, mislead, mistake | 誤（ご） mistake; 誤り（あやまり） error | N3 | ❌ |
| 339 | 洗 | セン | あら.う | inquire into, probe, wash | 洗（せん） washing machine; 洗濯（せんたく） washing | N3 | VOL1, VOL3 |
| 340 | 慣 | カン | な.らす, な.れる | accustomed, become experienced, get used to | 慣れる（なれる） to get used to; 慣習（かんしゅう） custom | N3 | N4VOL3, N4VOL4 |
| 341 | 礼 | ライ, レイ |  | bow, ceremony, remuneration, salute, thanks | 礼（れい） thanks; 礼儀（れいぎ） manners | N3 | N4VOL1 |
| 342 | 窓 | ス, ソウ | けむだし, てんまど, まど | pane, window | 窓（まど） window; 窓口（まどぐち） counter | N3 | VOL5 |
| 343 | 昔 | シャク, セキ | むかし | antiquity, old times, once upon a time | 昔（むかし） the old days; 昔話（むかしばなし） old tale | N3 | N4VOL5 |
| 344 | 貧 | ヒン, ビン | まず.しい | poor, poverty | 貧（ひん） poverty; 貧困（ひんこん） poverty | N3 | ❌ |
| 345 | 怒 | ド, ヌ | いか.る, おこ.る | angry, be offended | 怒る（おこる） to get angry; 怒り（いかり） anger | N3 | N4VOL1 |
| 346 | 泳 | エイ | およ.ぐ | swim | 泳ぐ（およぐ） to swim; 泳ぎ（およぎ） swimming | N3 | VOL2, N4VOL1, N4VOL3 |
| 347 | 祖 | ソ |  | ancestor, founder, pioneer | 祖（そ） ancestor; 祖父（そふ） grandfather | N3 | N4VOL3 |
| 348 | 杯 | ハイ | さかずき | counter for cupfuls, glass, toast, wine glass | 杯（はい） sake cup; 杯（さかずき） sake cup | N3 | ❌ |
| 349 | 疲 | ヒ | -づか.れ, つか.らす, つか.れる | exhausted, tire, weary | 疲れる（つかれる） to get tired; 疲労（ひろう） fatigue | N3 | VOL4 |
| 350 | 皆 | カイ | みな, みんな | all, everything | 皆（みな） everyone; 皆さん（みなさん） all | N3 | VOL5 |
| 351 | 鳴 | メイ | な.く, な.らす, な.る | bark, chirp, cry, echo, honk, ring, sound | 鳴く（なく） to make sound (of an animal); 鳴る（なる） to sound | N3 | VOL4, N4VOL4 |
| 352 | 腹 | フク | はら | abdomen, belly, stomach | 腹（はら） abdomen; 腹立ち（はらだち） anger | N3 | VOL2 |
| 353 | 煙 | エン | けむ.い, けむ.る, けむり | smoke | 煙（けむり） smoke; 煙草（タバコ） tobacco | N3 | ❌ |
| 354 | 眠 | ミン | ねむ.い, ねむ.る | die, sleep, sleepy | 眠る（ねむる） to sleep; 眠い（ねむい） sleepy | N3 | N4VOL4 |
| 355 | 怖 | フ, ホ | お.じる, おそ.れる, こわ.い, こわ.がる | be frightened, dreadful, fearful | 怖（こわ） frightening; 怖い（こわい） scary | N3 | N4VOL2 |
| 356 | 耳 | ジ | みみ | ear | 耳（みみ） ear; 耳元（みみもと） close to the ear | N3 | VOL5 |
| 357 | 頂 | チョウ | いただ.く, いただき | peak, place on the head, receive, summit, top, top of head | 頂（いただき） crown (of head); 頂点（ちょうてん） vertex | N3 | ❌ |
| 358 | 箱 | ソウ | はこ | bin, box, case, chest, railway car | 箱（はこ） box; 箱舟（はこぶね） ark (i.e. Noah's) | N3 | VOL4 |
| 359 | 晩 | バン |  | night, nightfall | 晩（ばん） evening; 晩御飯（ばんごはん） dinner | N3 | VOL3, VOL4 |
| 360 | 寒 | カン | さむ.い | cold | 寒（さむ） cold; 寒（かん） midwinter | N3 | VOL3 |
| 361 | 髪 | ハツ | かみ | hair of the head | 髪（かみ） hair (on the head); 髪（はつ） (a) hair | N3 | N4VOL2 |
| 362 | 忙 | ボウ, モウ | いそが.しい, うれえるさま, おそ.れる, せわ.しい | busy, occupied, restless | 忙しい（いそがしい） busy; 忙殺（ぼうさつ） being extremely busy | N3 | VOL1 |
| 363 | 才 | サイ |  | cubic shaku, genius, years old | 才（さい） ability; 才能（さいのう） talent | N3 | ❌ |
| 364 | 靴 | カ | くつ | shoes | 靴（くつ） shoe; 靴下（くつした） socks | N3 | VOL2 |
| 365 | 恥 | チ | は.じらう, は.じる, は.ずかしい, はじ | dishonor, shame | 恥（はじ） shame; 恥ずかしい（はずかしい） embarrassing | N3 | N4VOL4 |
| 366 | 偶 | グウ | たま | accidentally, couple, even number, man & wife, same kind | 偶々（たまたま） by chance; 偶（たま） occasional | N3 | ❌ |
| 367 | 偉 | イ | えら.い | admirable, conceited, excellent, famous, greatness, remarkable | 偉（えら） tremendous; 偉（い） greatness | N3 | ❌ |
| 368 | 猫 | ビョウ | ねこ | cat | 猫（ねこ） cat (esp. the domestic cat, Felis catus); 猫（ねこま） cat | N3 | VOL4 |
| 369 | 幾 | キ | いく-, いく.つ, いく.ら | how far, how long, how many, how much, several, some | 幾（いく） some; 幾つ（いくつ） how many | N3 | ❌ |
