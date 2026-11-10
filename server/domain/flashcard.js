/**
 * Kanji flashcards in the peserta portal. Pure rules: the cards of a volume, their order and the display times.
 *
 * The first time a peserta opens a volume its cards are shuffled and that order is stored on the server. Every card
 * then keeps how long it was on screen in its last round (capped, see MAKS_MS_KARTU). Whenever the deck is opened
 * and after every full round the cards are put in order again: cards never shown first (in the stored random order),
 * then the longest time first, assumed not memorised yet. Equal times keep the random order.
 */

import { kanjiItems, VOLUME_KANJI, jlptKanji, nomorVolume } from './tesOnline.js';

/** The volumes with flashcards: N5 Dasar and Vol 1-5, N4 Vol 1-5. */
export const VOLUME_FLASHCARD = VOLUME_KANJI;

// A card left on screen (a chat, a call) counts as one minute, so it does not stay ahead of every other card.
export const MAKS_MS_KARTU = 60_000;

export function judulVolumeFlashcard(volume) {
  return volume === 'DASAR' ? 'N5 · Dasar (80 kanji)' : `${jlptKanji(volume)} · Volume ${nomorVolume(volume)}`;
}

/**
 * The cards of a volume, null for an unknown volume. Front: the kanji. Back: on'yomi and kun'yomi (Dasar) or the
 * reading of the word with its other right readings, and the meaning.
 */
export function kartuVolume(volume) {
  if (!VOLUME_FLASHCARD.includes(volume)) return null;
  return kanjiItems(volume).map((i) =>
    i.on
      ? { id: i.id, kanji: i.kanji, on: i.on, kun: i.kun, arti: i.arti }
      : { id: i.id, kanji: i.kanji, bacaan: i.bacaan, bacaanLain: i.bacaanLain.filter((b) => b !== i.bacaan), arti: i.arti }
  );
}

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * The stored random order for these card ids: kept as it is, cards no longer in the bank dropped, cards new to
 * the bank added at random places at the end. Without a stored order: a fresh shuffle.
 */
export function lengkapiAcak(acak, ids, rng = Math.random) {
  const ada = new Set(ids);
  const tetap = (Array.isArray(acak) ? acak : []).filter((id, i, arr) => ada.has(id) && arr.indexOf(id) === i);
  const sudah = new Set(tetap);
  return [...tetap, ...shuffle(ids.filter((id) => !sudah.has(id)), rng)];
}

/** Cards in the order they are shown: never shown first, then the slowest first. */
export function urutanKartu(acak, waktu = {}) {
  const posisi = new Map(acak.map((id, i) => [id, i]));
  const ms = (id) => (Number.isFinite(waktu?.[id]) ? waktu[id] : null);
  return [...acak].sort((a, b) => {
    const wa = ms(a);
    const wb = ms(b);
    if ((wa === null) !== (wb === null)) return wa === null ? -1 : 1;
    if (wa !== null && wa !== wb) return wb - wa;
    return posisi.get(a) - posisi.get(b);
  });
}

/**
 * Display times sent by the app ({ cardId: ms }, the card's total time in the current round): only cards of this
 * volume, whole milliseconds between 0 and MAKS_MS_KARTU. A card swiped in under a second still counts as shown.
 */
export function bersihkanWaktu(raw, ids) {
  const ada = new Set(ids);
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [id, v] of Object.entries(raw)) {
    const ms = Number(v);
    if (!ada.has(id) || !Number.isFinite(ms) || ms < 0) continue;
    out[id] = Math.min(MAKS_MS_KARTU, Math.round(ms));
  }
  return out;
}

/** How far a peserta is in a volume: cards shown at least once, of all cards. */
export function ringkasProgres(ids, waktu = {}) {
  const dilihat = ids.filter((id) => Number.isFinite(waktu?.[id])).length;
  return { total: ids.length, dilihat };
}
