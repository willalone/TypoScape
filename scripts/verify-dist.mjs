/* eslint-disable no-undef */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const assetsDir = path.join(distDir, 'assets');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const referenced = new Set();

for (const match of indexHtml.matchAll(/\/TypoScape\/assets\/([^"'`\s]+)/g)) {
  referenced.add(match[1]);
}

for (const file of fs.readdirSync(assetsDir)) {
  if (!file.endsWith('.js')) continue;
  const source = fs.readFileSync(path.join(assetsDir, file), 'utf8');
  for (const match of source.matchAll(/assets\/([^"'`\s]+\.js)/g)) {
    referenced.add(match[1]);
  }
}

const missing = [...referenced].filter((file) => !fs.existsSync(path.join(assetsDir, file)));

if (missing.length > 0) {
  console.error('Missing dist assets referenced by build:');
  missing.forEach((file) => console.error(`  - assets/${file}`));
  process.exit(1);
}

for (const required of ['docs/preview.svg', 'fonts/helvetiker_bold.typeface.json', '.nojekyll']) {
  if (!fs.existsSync(path.join(distDir, required))) {
    console.error(`Missing required dist file: ${required}`);
    process.exit(1);
  }
}

console.log(`verify-dist: OK (${referenced.size} assets checked)`);
