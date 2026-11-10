// Kanji volume codes from the API: DASAR and VOL1-VOL5 are N5, N4VOL1-N4VOL5 are N4.

/** JLPT level of a kanji volume or kanji material code. */
export const jlptVolume = (kode) => (String(kode).startsWith('N4') ? 'N4' : 'N5');

/** "N5 Dasar", "N5 Vol 3", "N4 Vol 1". `t` = vue-i18n's translate function. */
export function labelVolumeKanji(kode, t) {
  if (kode === 'DASAR') return `N5 ${t('tesOnline.volDasar')}`;
  const m = /^(N4)?VOL(\d+)$/.exec(String(kode));
  return m ? `${m[1] || 'N5'} Vol ${m[2]}` : String(kode);
}
