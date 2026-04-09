// Fetch real interior photos from Naver Place and save to public/images/naver/
// Usage: node scripts/fetch-naver-photos.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'naver');
const PLACE_ID = '1333416518';
const PAGE_URL = `https://pcmap.place.naver.com/restaurant/${PLACE_ID}/photo`;
const NUM_PHOTOS = 25;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function main() {
  console.log('[1/3] Fetching Naver Place photo page...');
  const res = await fetch(PAGE_URL, { headers: { 'User-Agent': UA, 'Accept-Language': 'ko-KR,ko;q=0.9' } });
  if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
  const html = await res.text();

  console.log('[2/3] Extracting photo URLs from Apollo state...');
  const startIdx = html.indexOf('window.__APOLLO_STATE__');
  if (startIdx < 0) throw new Error('Could not find Apollo state in HTML');
  const eqIdx = html.indexOf('{', startIdx);
  const raw = html.slice(eqIdx);
  // Balance braces, respecting strings and escapes
  const BS = String.fromCharCode(92);
  let depth = 0, end = -1, inStr = false, esc = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (esc) { esc = false; continue; }
    if (c === BS) { esc = true; continue; }
    if (c === '"') inStr = !inStr;
    if (inStr) continue;
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end < 0) throw new Error('Could not balance Apollo state JSON');
  const json = JSON.parse(raw.slice(0, end));

  const urls = new Set();
  (function walk(o) {
    if (!o || typeof o !== 'object') return;
    for (const v of Object.values(o)) {
      if (typeof v === 'string' && /ldb-phinf\.pstatic\.net/.test(v) && /\.jpe?g$/i.test(v)) {
        urls.add(v);
      } else if (typeof v === 'object') walk(v);
    }
  })(json);

  const list = [...urls];
  console.log(`  → found ${list.length} JPEG URLs, downloading top ${NUM_PHOTOS}`);
  if (list.length === 0) throw new Error('No JPEG URLs found');

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('[3/3] Downloading images...');
  const take = list.slice(0, NUM_PHOTOS);
  for (let i = 0; i < take.length; i++) {
    const url = take[i];
    const name = `photo-${String(i + 1).padStart(2, '0')}.jpg`;
    const out = path.join(OUT_DIR, name);
    process.stdout.write(`  ${name} ... `);
    const r = await fetch(url, {
      headers: {
        'User-Agent': UA,
        'Referer': 'https://m.place.naver.com/',
      },
    });
    if (!r.ok) { console.log(`FAIL ${r.status}`); continue; }
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(out, buf);
    console.log(`${(buf.length / 1024).toFixed(0)} KB`);
    await new Promise((res) => setTimeout(res, 150));
  }

  console.log('\nDone. Saved to', OUT_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
