// Parse _chat.txt report messages (houkoku) -> compact list for inspection.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const raw = readFileSync(resolve(ROOT, '_chat.txt'), 'utf8');

const MSG = /^\u200e?\[(\d{2})\/(\d{2})\/(\d{2}), (\d{2})\.(\d{2})\.(\d{2})\]\s*([^:]+):\s?(.*)$/;
const lines = raw.split(/\r?\n/);
const messages = [];
for (const line of lines) {
  const m = line.match(MSG);
  if (m) {
    const [, dd, mm, yy, hh, mi, ss, who, body] = m;
    messages.push({ dd, mm, yy, hh, mi, ss, who: who.trim(), text: body });
  } else if (messages.length) {
    messages[messages.length - 1].text += '\n' + line.replace(/^\u200e/, '');
  }
}

const JP = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
function parseJaDate(text) {
  let m = text.match(/(\d{4})年\D*?(\d{1,2})月\D*?(\d{1,2})日/);
  if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
  m = text.match(/(\d{4})ねんの(\d{1,2})がつの(\d{1,2})にち/);
  if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
  return null;
}
function parseCount(text) {
  const m = text.match(/(だんせい|じょせい|しょせい)\D*?(\d{1,2})/);
  return m ? Number(m[2]) : null;
}
function namesAfter(text) {
  const out = [];
  for (const seg of text.split(/[:：]/).slice(1)) {
    for (const n of seg.split(/[、,。\n]/)) {
      const t = n.trim();
      if (!t) continue;
      if (/(さん|サン|君|くん)/.test(t) || /^[\u30A0-\u30FF\u3040-\u309Fー]+$/.test(t)) out.push(t.replace(/(さん|サン|君|くん)/g, '').trim());
    }
  }
  return out;
}

const reports = [];
for (const msg of messages) {
  if (!/けっせき|びょうき|きょか|きょうか|ほうこう|kesseki|Kesseki|byouki/.test(msg.text)) continue;
  const rec = {
    tglPesan: `20${msg.yy}-${msg.mm}-${msg.dd}`,
    jam: `${msg.hh}:${msg.mi}`,
    from: msg.who,
    tglLaporan: parseJaDate(msg.text) ?? `20${msg.yy}-${msg.mm}-${msg.dd}`,
    dansei: null, josei: null,
    sakit: [], izin: [],
  };
  const text = msg.text;
  // split into logical lines
  const lns = text.split('\n');
  let mode = null;
  for (let i = 0; i < lns.length; i++) {
    const l = lns[i];
    if (/だんせい/.test(l)) rec.dansei = parseCount(l);
    if (/じょせい|しょせい/.test(l)) rec.josei = parseCount(l);
    if (/びょうき/i.test(l)) {
      mode = 'sakit';
      const idx = l.search(/[:：]/);
      const rest = (idx >= 0 ? l.slice(idx + 1) : '') + '\n' + (lns[i + 1] ?? '');
      rec.sakit.push(...namesAfter(rest));
    } else if (/きょか|きょうか/.test(l)) {
      mode = 'izin';
      const idx = l.search(/[:：]/);
      const rest = (idx >= 0 ? l.slice(idx + 1) : '') + '\n' + (lns[i + 1] ?? '');
      rec.izin.push(...namesAfter(rest));
    } else if (mode && /さん|サン/.test(l) && !/ほうこう/.test(l)) {
      rec[mode].push(...namesAfter(':' + l));
    }
  }
  rec.sakit = [...new Set(rec.sakit)];
  rec.izin = [...new Set(rec.izin)];
  reports.push(rec);
}

writeFileSync(resolve(ROOT, 'scripts/_reports-dump.json'), JSON.stringify(reports, null, 2), 'utf8');
// distinct names
const set = new Set();
for (const r of reports) for (const n of [...r.sakit, ...r.izin]) set.add(n);
console.log('reports:', reports.length);
console.log('distinct names:', [...set].join(' | '));
for (const r of reports) console.log(`${r.tglLaporan} D${r.dansei ?? '?'} J${r.josei ?? '?'} sakit[${r.sakit.join(',')}] izin[${r.izin.join(',')}] (${r.from})`);
