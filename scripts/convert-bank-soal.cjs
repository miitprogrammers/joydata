#!/usr/bin/env node
/**
 * Convert bank soal from markdown to JS modules
 */
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../docs/bunpou-adventure');
const outputDir = path.join(__dirname, '../server/domain/bankSoal');

// Global ID tracker untuk hindari collision
const usedIds = { N5: new Set(), N4: new Set() };
const polaCounter = { N5: {}, N4: {} };

// Generate ID unik dengan nomor sequensial
function getUniqueId(tingkat, pola) {
  const counter = polaCounter[tingkat];
  const used = usedIds[tingkat];
  
  if (!counter[pola]) counter[pola] = 1;
  
  let num = counter[pola];
  let newId = `${tingkat}-${pola}-${num}`;
  
  while (used.has(newId)) {
    num++;
    newId = `${tingkat}-${pola}-${num}`;
  }
  
  used.add(newId);
  counter[pola] = num + 1;
  return newId;
}

// Pola yang ada di bank N4 tapi sebenarnya N5 (harus difilter)
const N5_POLA_IN_N4 = ['te-morau', 'te-ageru', 'te-kureru'];

// Pola yang ada di bank N4 tapi sebenarnya N3 (harus difilter)
const N3_POLA_IN_N4 = ['you-to-suru']; // ～として adalah N3

// Mapping dari nama pola di YAML ke ID katalog yang valid
const POLA_MAP = {
  // N4 pola yang perlu dipetakan
  'saseru': 'shieki',
  'rareru-passive': 'ukemi',
  'rareru-passive-creation': 'ukemi', // sama dengan ukemi
  'keigo-sonkei': 'sonkei-rareru',
  'keigo-kenjou': 'o-suru',
  'noni-purpose': 'noni-youto',
  'noni-contrast': 'noni',
  'sou-appearance': 'sou-youtai',
  'sou-hearsay': 'sou-denbun',
  'tame-ni-purpose': 'tame-ni',
  'you-da': 'you-desu',
  'te-conditional': 'ba',
  'yasui': 'yasui-nikui',
  'nikui': 'yasui-nikui',
  'morau-te': 'te-morau',
  'kudasaru': 'te-kudasaru',
  'itadaku': 'te-itadaku',
  'go-verb-suru': 'o-suru',
  'o-verb-suru': 'o-suru',
};

function extractSoalFromMd(mdContent) {
  const soalList = [];
  
  // Find all JS code blocks (handle Windows \r\n)
  const jsBlockRegex = /```js\r?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = jsBlockRegex.exec(mdContent)) !== null) {
    const jsBlock = match[1];
    
    // Find export const draf_xxx = [...]; patterns
    const exportRegex = /export const \w+ = \[([\s\S]*?)\];/g;
    let exportMatch;
    
    while ((exportMatch = exportRegex.exec(jsBlock)) !== null) {
      const arrayContent = exportMatch[1].trim();
      if (!arrayContent) continue;
      
      // Parse individual soal objects - more robust approach
      // Split by pattern matching object boundaries
      const soalStrings = [];
      let depth = 0;
      let currentSoal = '';
      let inString = false;
      let stringChar = '';
      
      for (let i = 0; i < arrayContent.length; i++) {
        const char = arrayContent[i];
        const prevChar = i > 0 ? arrayContent[i - 1] : '';
        
        // Track string state
        if ((char === "'" || char === '"') && prevChar !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
        }
        
        if (!inString) {
          if (char === '{') {
            depth++;
            if (depth === 1) {
              currentSoal = '{'; // Include opening brace
              continue;
            }
          }
          if (char === '}') {
            depth--;
            if (depth === 0) {
              currentSoal += char;
              soalStrings.push(currentSoal);
              currentSoal = '';
              continue;
            }
          }
        }
        
        if (depth > 0) {
          currentSoal += char;
        }
      }
      
      // Parse each soal string
      for (const soalStr of soalStrings) {
        try {
          // Use Function constructor to safely evaluate - soalStr already has braces
          const soal = Function('return ' + soalStr)();
          if (soal && soal.id) {
            soalList.push(soal);
          }
        } catch (e) {
          console.error('Failed to parse soal:', e.message);
          console.error('String:', soalStr.substring(0, 100));
        }
      }
    }
  }
  
  // Also find YAML code blocks and convert to JS format
  const yamlBlockRegex = /```yaml\r?\n([\s\S]*?)```/g;
  while ((match = yamlBlockRegex.exec(mdContent)) !== null) {
    const yamlBlock = match[1];
    const yamlSoal = parseYamlSoal(yamlBlock);
    soalList.push(...yamlSoal);
  }
  
  return soalList;
}

// Parse YAML format soal and convert to JS conversation format
function parseYamlSoal(yamlContent) {
  const soalList = [];
  
  // Split by "- id:" pattern to get individual entries
  const entries = yamlContent.split(/(?=^- id:)/m).filter(e => e.trim());
  
  for (const entry of entries) {
    try {
      // Extract fields using regex
      const idMatch = entry.match(/id:\s*(\S+)/);
      const bintangMatch = entry.match(/bintang:\s*(\d+)/);
      const soalMatch = entry.match(/soal:\s*"([^"]+)"/);
      const potonganMatch = entry.match(/potongan:\s*\[([^\]]+)\]/);
      const jawabanMatch = entry.match(/jawaban:\s*(\d+)/);
      const penjelasanMatch = entry.match(/penjelasan:\s*"([^"]+)"/);
      
      if (!idMatch || !bintangMatch || !soalMatch || !potonganMatch) {
        continue;
      }
      
      const id = idMatch[1];
      const bintang = parseInt(bintangMatch[1]);
      const soalText = soalMatch[1];
      const penjelasan = penjelasanMatch ? penjelasanMatch[1] : '';
      
      // Parse potongan array
      const potonganStr = potonganMatch[1];
      const potongan = potonganStr.match(/'([^']+)'/g).map(p => p.slice(1, -1));
      
      // Extract pola from id (e.g., "N4-n-desu-1" -> "n-desu")
      const polaMatch = id.match(/N\d-(.+?)-\d+$/);
      let pola = polaMatch ? polaMatch[1] : id;
      
      // Map to valid katalog ID if needed
      if (POLA_MAP[pola]) {
        pola = POLA_MAP[pola];
      }
      
      // Get unique ID using global tracker
      const tingkat = id.match(/^(N\d)-/)?.[1] || 'N4';
      const finalId = getUniqueId(tingkat, pola);
      
      // Convert soal text to sebelum/sesudah format
      // Format: "どうして ＿＿ ＿＿ ＿＿ ★。" -> sebelum="どうして", sesudah="。"
      const parts = soalText.split(/[＿★]+/).filter(p => p.trim());
      const sebelum = parts[0] ? parts[0].trim() : '';
      const sesudah = parts.length > 1 ? parts[parts.length - 1].trim() : '。';
      
      const soal = {
        id: finalId,
        pola,
        situasi: null,
        baris: [
          { pembicara: null, sebelum, sesudah }
        ],
        potongan,
        bintang,
        urutanLain: [],
        terjemahan: '',
        pembahasan: penjelasan,
        status: 'draf',
      };
      
      soalList.push(soal);
    } catch (e) {
      console.error('Failed to parse YAML entry:', e.message);
    }
  }
  
  return soalList;
}

// Deduplicate soal berdasarkan kalimat utuh (sebelum + sorted potongan + sesudah)
function deduplicateSoal(soalList) {
  const seen = new Set();
  const result = [];
  
  for (const soal of soalList) {
    const baris = soal.baris[0] || {};
    const sebelum = baris.sebelum || baris.teks || '';
    const sesudah = baris.sesudah || '';
    const potonganSorted = [...(soal.potongan || [])].sort().join('|');
    const signature = `${sebelum}||${potonganSorted}||${sesudah}`;
    
    if (!seen.has(signature)) {
      seen.add(signature);
      result.push(soal);
    } else {
      console.log(`Skipping duplicate: ${soal.originalId || soal.id}`);
    }
  }
  
  return result;
}

function formatSoal(soal) {
  const lines = [];
  lines.push('  {');
  lines.push(`    id: '${soal.id}',`);
  lines.push(`    pola: '${soal.pola}',`);
  lines.push(`    situasi: ${soal.situasi === null ? 'null' : `'${soal.situasi}'`},`);
  
  // Format baris
  lines.push('    baris: [');
  for (const b of soal.baris) {
    const parts = [];
    parts.push(`pembicara: ${b.pembicara === null ? 'null' : `'${b.pembicara}'`}`);
    if (b.teks !== undefined) parts.push(`teks: '${b.teks}'`);
    if (b.sebelum !== undefined) parts.push(`sebelum: '${b.sebelum}'`);
    if (b.sesudah !== undefined) parts.push(`sesudah: '${b.sesudah}'`);
    lines.push(`      { ${parts.join(', ')} },`);
  }
  lines.push('    ],');
  
  // Format potongan
  lines.push(`    potongan: [${soal.potongan.map(p => `'${p}'`).join(', ')}],`);
  lines.push(`    bintang: ${soal.bintang},`);
  lines.push(`    urutanLain: [${(soal.urutanLain || []).map(u => `[${u.map(i => `'${i}'`).join(', ')}]`).join(', ')}],`);
  lines.push(`    terjemahan: '${(soal.terjemahan || '').replace(/'/g, "\\'")}',`);
  lines.push(`    pembahasan: '${(soal.pembahasan || '').replace(/'/g, "\\'")}',`);
  lines.push(`    status: '${soal.status || 'draf'}',`);
  lines.push('  }');
  
  return lines.join('\n');
}

// Process N5 files
const n5Volumes = ['BN5V1', 'BN5V2', 'BN5V3', 'BN5V4', 'BN5V5'];
const n5Soal = [];

for (const vol of n5Volumes) {
  const mdPath = path.join(baseDir, `bank-soal-bunpou-adventure-${vol}.md`);
  if (!fs.existsSync(mdPath)) {
    console.log(`Skipping ${vol} - file not found`);
    continue;
  }
  
  const content = fs.readFileSync(mdPath, 'utf8');
  const soal = extractSoalFromMd(content);
  console.log(`${vol}: ${soal.length} soal`);
  n5Soal.push(...soal);
}

// Deduplicate N5 and write output
const n5Deduped = deduplicateSoal(n5Soal);
const n5Output = `// Bank Soal Bintang N5 - Auto-generated
// Total: ${n5Deduped.length} soal

export const SOAL_BINTANG_N5 = [
${n5Deduped.map(formatSoal).join(',\n')}
];
`;

fs.writeFileSync(path.join(outputDir, 'bintangN5.js'), n5Output);
console.log(`\nWritten bintangN5.js with ${n5Deduped.length} soal (${n5Soal.length - n5Deduped.length} duplicates removed)`);

// Process N4 files
const n4Volumes = ['BN4V1', 'BN4V2', 'BN4V3', 'BN4V4', 'BN4V5'];
const n4Soal = [];

for (const vol of n4Volumes) {
  const mdPath = path.join(baseDir, `bank-soal-bunpou-adventure-${vol}.md`);
  if (!fs.existsSync(mdPath)) {
    console.log(`Skipping ${vol} - file not found`);
    continue;
  }
  
  const content = fs.readFileSync(mdPath, 'utf8');
  const soal = extractSoalFromMd(content);
  console.log(`${vol}: ${soal.length} soal`);
  n4Soal.push(...soal);
}

// Filter out N5 and N3 pola from N4 bank
const n4Filtered = n4Soal.filter(soal => {
  if (N5_POLA_IN_N4.includes(soal.pola)) {
    console.log(`Filtering N5 pola from N4: ${soal.id} (${soal.pola})`);
    return false;
  }
  if (N3_POLA_IN_N4.includes(soal.pola)) {
    console.log(`Filtering N3 pola from N4: ${soal.id} (${soal.pola})`);
    return false;
  }
  return true;
});
console.log(`Filtered: ${n4Soal.length - n4Filtered.length} wrong-level soal removed`);

// Deduplicate N4 and write output  
const n4Deduped = deduplicateSoal(n4Filtered);
const n4Output = `// Bank Soal Bintang N4 - Auto-generated
// Total: ${n4Deduped.length} soal

export const SOAL_BINTANG_N4 = [
${n4Deduped.map(formatSoal).join(',\n')}
];
`;

fs.writeFileSync(path.join(outputDir, 'bintangN4.js'), n4Output);
console.log(`Written bintangN4.js with ${n4Deduped.length} soal (${n4Soal.length - n4Deduped.length} duplicates removed)`);

console.log(`\n${n5Deduped.length} N5 + ${n4Deduped.length} N4 = ${n5Deduped.length + n4Deduped.length} soal total!`);
