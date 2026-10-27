import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([lenBuf, combined, crcBuf]);
}

function createIconPng(size, maskable = false) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const pad = maskable ? Math.round(size * 0.16) : Math.round(size * 0.08);
  const innerMin = pad;
  const innerMax = size - pad;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    raw[rowOffset] = 0;
    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 4;
      const t = y / size;
      let r = Math.round(30 * (1 - t) + 15 * t);
      let g = Math.round(58 * (1 - t) + 23 * t);
      let b = Math.round(138 * (1 - t) + 42 * t);
      let a = 255;

      if (!maskable) {
        const rad = size * 0.18;
        const dx = Math.max(rad - x, 0, x - (size - 1 - rad));
        const dy = Math.max(rad - y, 0, y - (size - 1 - rad));
        if (dx * dx + dy * dy > rad * rad) a = 0;
      }

      const nx = (x - innerMin) / (innerMax - innerMin);
      const ny = (y - innerMin) / (innerMax - innerMin);
      if (a > 0 && nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
        const topBar = ny >= 0.22 && ny <= 0.32 && nx >= 0.26 && nx <= 0.74;
        const stem = nx >= 0.52 && nx <= 0.65 && ny >= 0.22 && ny <= 0.66;
        const hookDx = nx - 0.45;
        const hookDy = ny - 0.64;
        const hookDist = Math.sqrt(hookDx * hookDx + hookDy * hookDy);
        const hookArc = ny >= 0.56 && nx <= 0.65 && hookDist >= 0.08 && hookDist <= 0.205 && nx >= 0.24;
        const accentDot = Math.hypot(nx - 0.33, ny - 0.46) <= 0.055;

        if (topBar || stem || hookArc) {
          r = 255;
          g = 255;
          b = 255;
        } else if (accentDot) {
          r = 56;
          g = 189;
          b = 248;
        }
      }

      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
      raw[px + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const compressed = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const publicDir = path.resolve(process.cwd(), 'public');
fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createIconPng(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createIconPng(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createIconPng(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createIconPng(180, true));

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="24" fill="#1E3A8A"/>
  <path d="M36 34H92V46H78V80C78 93.2548 67.2548 104 54 104C42.402 104 33 95.4 32 84H45C45.8 89.2 49.5 92 54 92C60.6274 92 65 87.2 65 80V46H36V34Z" fill="#FFFFFF"/>
  <circle cx="44" cy="62" r="7" fill="#38BDF8"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon, 'utf8');
console.log('Generated PWA icons successfully');
