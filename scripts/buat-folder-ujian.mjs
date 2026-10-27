/**
 * JOYdata buat-folder-ujian — creates the upload tree peserta use for photos of their exam papers:
 *   <root>/<Nama Kelas>/<Nama Peserta>/<KODE - Nama Ujian>/
 *
 * - Roster comes from the database (Postgres/Supabase via DATABASE_URL), names formatted like the app.
 * - Exam folders per class come from jadwal-ujian.json (field `folder`), plus one LAINNYA folder for
 *   papers whose code the peserta does not know.
 * - Idempotent: existing folders and files are left alone, so re-run it after adding codes or peserta.
 * - --rapikan also renames an existing folder of the same code (e.g. "M001") to the jadwal name and removes
 *   code folders that are no longer in the jadwal, but only when they hold no files (desktop.ini aside).
 *
 * Usage:
 *   node scripts/buat-folder-ujian.mjs "<root folder>" --dry-run [--rapikan]   # list what would change
 *   node scripts/buat-folder-ujian.mjs "<root folder>" [--rapikan]
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { formatPersonName } from '../server/domain/nameFormat.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LAINNYA = 'LAINNYA - kode tidak diketahui';
const IGNORED_FILES = new Set(['desktop.ini', '.DS_Store', 'Thumbs.db']);

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const rapikan = argv.includes('--rapikan');
const root = argv.find((a) => !a.startsWith('--'));
if (!root) {
  console.error('Pakai: node scripts/buat-folder-ujian.mjs "<root folder>" [--dry-run] [--rapikan]');
  process.exit(1);
}
if (!fs.existsSync(root)) {
  console.error(`Folder root tidak ditemukan: ${root}`);
  process.exit(1);
}

const jadwal = JSON.parse(fs.readFileSync(path.join(projectRoot, 'jadwal-ujian.json'), 'utf8'));
const foldersByKelas = Object.fromEntries(
  Object.entries(jadwal.kelas).map(([kelas, entries]) => [kelas, [...entries.map((e) => e.folder), LAINNYA]])
);

// Windows-safe folder name: no reserved characters, no trailing dots/spaces.
const safe = (name) => String(name).replace(/[\\/:*?"<>|]/g, '').replace(/[. ]+$/, '').trim();
// "M001 - Kotoba Minggu 1" and a bare "M001" share the code "M001".
const codeOf = (folderName) => folderName.split(' - ')[0].trim();
const hasContent = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).some((d) => d.isDirectory() || !IGNORED_FILES.has(d.name));

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});
const { rows } = await pool.query(
  `SELECT k.nama_kelas AS "namaKelas", c.nama, p.mancation_akun_id AS "akunId"
   FROM peserta p
   JOIN kelas k ON k.id = p.kelas_id AND k.deleted_at IS NULL
   LEFT JOIN mancation_peserta_cache c ON c.mancation_akun_id = p.mancation_akun_id
   ORDER BY k.nama_kelas, c.nama`
);
await pool.end();

const count = { dibuat: 0, diganti: 0, dihapus: 0, ada: 0 };
const keptWithFiles = [];
const summary = new Map();
for (const r of rows) {
  const folders = foldersByKelas[r.namaKelas];
  if (!folders) {
    console.warn(`! kelas tidak ada di jadwal-ujian.json, dilewati: ${r.namaKelas}`);
    continue;
  }
  const pesertaDir = path.join(root, safe(r.namaKelas), safe(formatPersonName(r.nama || `Peserta ${r.akunId}`)));
  const existing = fs.existsSync(pesertaDir)
    ? fs.readdirSync(pesertaDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];
  const wantedCodes = new Set(folders.map(codeOf));

  for (const folder of folders) {
    const target = path.join(pesertaDir, folder);
    if (fs.existsSync(target)) {
      count.ada++;
      continue;
    }
    const sameCode = existing.find((name) => name !== folder && codeOf(name) === codeOf(folder));
    if (rapikan && sameCode) {
      if (!dryRun) fs.renameSync(path.join(pesertaDir, sameCode), target);
      count.diganti++;
    } else {
      if (!dryRun) fs.mkdirSync(target, { recursive: true });
      count.dibuat++;
    }
  }

  if (rapikan) {
    for (const name of existing) {
      if (wantedCodes.has(codeOf(name))) continue;
      const dir = path.join(pesertaDir, name);
      if (hasContent(dir)) {
        keptWithFiles.push(path.relative(root, dir));
        continue;
      }
      if (!dryRun) fs.rmSync(dir, { recursive: true, force: true });
      count.dihapus++;
    }
  }
  summary.set(r.namaKelas, (summary.get(r.namaKelas) || 0) + 1);
}

for (const [kelas, n] of summary) {
  console.log(`${kelas}: ${n} peserta × ${foldersByKelas[kelas].length} folder (${foldersByKelas[kelas].map(codeOf).join(', ')})`);
}
const verb = dryRun ? 'akan ' : '';
console.log(
  `Folder ${verb}dibuat: ${count.dibuat}, ${verb}diganti nama: ${count.diganti}, ${verb}dihapus (kosong): ${count.dihapus}, sudah sesuai: ${count.ada}`
);
for (const dir of keptWithFiles) console.log(`  ! tidak ada di jadwal tapi berisi file, dibiarkan: ${dir}`);
