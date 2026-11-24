/**
 * Rules of docs/kb-dokkai/17-aturan-final.md that can be checked on a passage's text: words to avoid at N5 (D3) and
 * grammar patterns above a sentence-pattern level (D1, D2, D8, N3). One source for the app (warnings on AI passages
 * in the staff review) and for the generate-soal skill (its mechanical gate).
 *
 * Only this short list of words lives here. The full Minna no Nihongo word list (3A Corporation's selection) stays in
 * docs/ and is read by the skill alone; it never reaches the app.
 */

// D3: N5 vocabulary = Minna lessons 1-25. Words of lessons 26-50 or outside Minna that keep turning up in N5 passages.
export const HINDARI_N5 = ['工場', '先輩', 'ごみ', '給料', '規則', '安全', '機械', '計画', '動物園', '台所', '授業', '映画館', '言葉', '大人', '運動会', '花火', '入口', '結婚式', '夕方', '予定', '場所', '返事'];
export const HINDARI_N5_KANA = ['こうじょう', 'せんぱい', 'きゅうりょう', 'きそく', 'あんぜん', 'けいかく', 'どうぶつえん', 'だいどころ', 'じゅぎょう', 'えいがかん', 'うんどうかい', 'けっこんしき', 'ゆうがた', 'よてい', 'へんじ'];

// N5 passages: patterns of Minna lessons 26-50 (D1, D2). [pattern, name].
export const POLA_DI_ATAS_N5 = [
  [/ので(?!す)/, '～ので (Bab 39; abaikan bila bagian dari kata lain)'],
  [/つもり/, '～つもり (Bab 31)'],
  // ～んです bukan pola bila ん bagian dari nama benda yang ditulis kana: かいしゃいん/ぎんこういん/てんいん/こういん/
  // びょういん/きょういん/にゅういん (alternatif う+い), えきいん, かいいん, だいがくいん, ごはん, ふとん, かびん, ゆうびん.
  // いいん/かわいいん/おおきいん tidak dikecualikan, jadi いいんです/かわいいんです tetap ditandai.
  // くん (田中くんです) tidak dikecualikan: くんです tak bisa dibedakan dari いくんです.
  [/(?<![さばかげじたほゃょぶこしろらめぱにてどごぺぜけせ])(?<!(?:しゃ|こう|てん|う)い)(?<!(?:ごは|ふと|かび|ゆうび|えきい|かいい|だいがくい))んです/, '～んです (Bab 26)'],
  [/ながら/, '～ながら (Bab 28)'],
  [/(です|ます)し[、，]/, '～し (Bab 28)'],
  [/[てで]しま[ういっわ]/, '～てしまう (Bab 29)'],
  // て-form: …て, or …で after ん/い (読んで, 泳いで); noun + であります (会議は事務所であります) is not this pattern.
  [/(?<!ま)(?:て|(?<=[んい])で)あります|(?:て|(?<=[んい])で)おき/, '～てあります／～ておきます (Bab 30)'],
  [/[おこそとのほもよろごぞどぼぽ]うと思/, 'bentuk maksud (Bab 31)'],
  [/まだ[^。]*ていません/, 'まだ～ていません (Bab 31)'],
  [/ほうがいい|かもしれ/, '～ほうがいい／～かもしれません (Bab 32)'],
  [/(?<!な)ければ|(?<!け)れば|なら[、，]/, '～ば／～なら (Bab 35)'],
  [/ように/, '～ように (Bab 36)'],
  [/られ(ます|ません|ました|る|て)/, 'pasif/potensial (Bab 27, 37)'],
  [/[るたい]のが/, '～のが (Bab 38)'],
  [/ないで(?!くだ|す|し)/, '～ないで (tanpa, Bab 34)'],
  [/とおりに/, '～とおりに (Bab 34)'],
  [/そうです|そうでした/, '～そうです (Bab 43/47; abaikan bila "そうですか")'],
  [/すぎ|にします|くします/, '～すぎます／Nにします／～くします (Bab 44)'],
  [/ために|はずです/, '～ために／～はず (Bab 42, 46)'],
  [/させ(ます|ました|て)/, 'kausatif (Bab 48)'],
  [/いらっしゃ|おります|いたします|くださいませ/, 'keigo (Bab 49–50)'],
];

// N4 passages (D8): patterns outside Minna lessons 1-50 and the module, and module patterns that belong to a harder
// level (third item = the first level where the pattern is fine). ～ようにする is taught in Minna lesson 36 and is fine.
export const POLA_AWAS_N4 = [
  [/わけ(だ|です|では|には|が|に)/, '～わけ (N3)'],
  [/によって|により|による/, '～によって (N3; dicek di Minna Bab 37)'],
  [/として/, '～として (N3)'],
  [/にとって/, '～にとって (N3)'],
  [/べき/, '～べき (N3)'],
  [/うちに/, '～うちに (N3)'],
  [/たびに/, '～たびに (N3)'],
  [/おかげで|せいで/, '～おかげで／せいで (N3)'],
  [/だけでなく|ばかりでなく/, '～だけでなく (N3)'],
  [/さえ/, '～さえ (N3)'],
  [/に対して|に関して|に比べて|にたいして|にかんして|にくらべて/, '～に対して／に関して／に比べて (N3)'],
  [/させられ/, 'kausatif-pasif (di luar Minna dan modul)'],
  [/っぽい|がち|ぎみ/, '～っぽい／がち／ぎみ (N3)'],
  [/はずがない/, '～はずがない (di luar Minna dan modul)'],
  [/おきに/, '～おきに (di luar Minna dan modul)'],
  [/[いきしちにびみりえけせてねべめれ]続け/, '～続ける (di luar Minna dan modul)'],
  [/[いきしちにびみり]出し/, '～出す "mulai" (di luar Minna dan modul)'],
  [/ということ/, '～ということ (di luar Minna dan modul)'],
  [/ではないか|じゃないか/, '～ではないか (di luar Minna dan modul)'],
  [/[しいけ]がって|[しいけ]がる/, '～がる (di luar Minna dan modul)'],
  [/て(あげ|くれ|もら|や[りるっ])|で(あげ|くれ|もら|や[りるっ])/, '～てあげる／くれる／もらう／やる', 'L4'],
  [/させ(ます|ません|ました|て|る|ない)/, 'kausatif', 'L4'],
  [/らしい|みたい/, '～らしい／みたい', 'L4'],
  [/おります|おりました|ございま/, 'おる／でございます', 'L4'],
  [/いらっしゃ|おっしゃ|めしあが|ごらん|ぞんじ|はいけん|うかが|まいり|もうし|いたし|さしあげ|いただ[きくけい]|くださ[るっ]|くださいま|なさ[るっ]|なさいま/, 'keigo', 'L5'],
];

// N3 passages: N2 patterns that slip in (found by the reviewers of the first N3 bank, 2026-11-20).
export const POLA_AWAS_N3 = [
  [/おそれがあ|恐れがあ/, '～おそれがある (N2) → ～かもしれない'],
  [/ものの、/, '～ものの (N2) → ～が'],
  [/に限らず|にかぎらず/, '～に限らず (N2) → ～だけでなく'],
  [/次第で|しだいで/, '～次第で (N2) → ～すれば／～によって'],
  [/ざるを[得え]/, '～ざるを得ない (N2)'],
  [/かねな[いく]/, '～かねない (N2)'],
  [/に際し|にさいし/, '～に際して (N2)'],
  [/に伴[いう]|にともな[いう]/, '～に伴って (N2)'],
  [/に基づ|にもとづ/, '～に基づいて (N2)'],
  [/にわたっ|にわたり/, '～にわたって (N2)'],
];

export const POLA_AWAS = { N5: POLA_DI_ATAS_N5, N4: POLA_AWAS_N4, N3: POLA_AWAS_N3 };

const LEVEL_URUT = ['L1', 'L2', 'L3', 'L4', 'L5'];
const polos = (s) => String(s ?? '').replace(/\{[^}]*\}/g, '');

/** N5 words to avoid that occur in a plain (furigana-free) text. */
export function kataHindariN5(teksPolos) {
  return [...HINDARI_N5, ...HINDARI_N5_KANA].filter((k) => teksPolos.includes(k));
}

/** The patterns above `jlpt` in a plain text at dokkai level `level`: [{ nama, contoh }] (contoh = the text around it). */
export function polaDiAtasTingkat(teksPolos, jlpt, level) {
  const hasil = [];
  for (const [re, nama, sejak] of POLA_AWAS[jlpt] || []) {
    if (sejak && LEVEL_URUT.indexOf(level) >= LEVEL_URUT.indexOf(sejak)) continue;
    const m = teksPolos.match(re);
    if (m) hasil.push({ nama, contoh: teksPolos.slice(Math.max(0, m.index - 6), m.index + m[0].length + 4) });
  }
  return hasil;
}

/**
 * Warnings for a dokkai passage (title, text, questions, options) at a sentence-pattern level and dokkai level:
 * [{ jenis: 'kata', isi }] for N5 words to avoid, [{ jenis: 'pola', isi, contoh }] for patterns above the level.
 * A warning is for the sensei to look at, not a rejection: some hits are another word (ので in のです is skipped,
 * そうです in そうですか is not).
 */
export function peringatanBacaanDokkai(b, jlpt = 'N5', level = 'L1') {
  const teks = [b?.judul, b?.teks, ...(b?.soal || []).flatMap((s) => [s.tanya, ...(s.opsi || [])])].map(polos).join(' / ');
  return [
    ...(jlpt === 'N5' ? kataHindariN5(teks).map((isi) => ({ jenis: 'kata', isi })) : []),
    ...polaDiAtasTingkat(teks, jlpt, level).map(({ nama, contoh }) => ({ jenis: 'pola', isi: nama, contoh })),
  ];
}
