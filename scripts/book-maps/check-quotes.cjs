// Checks that every «…» quote in a book-summary page appears verbatim in the source text.
//
// Usage: node scripts/book-maps/check-quotes.cjs <source.txt> <page.html> [--dta]
//   Whitespace, curly quotes and Gutenberg's _italic_ underscores are normalized away.
//   --dta: the source is a Deutsches Textarchiv plain-text download (Menger). Words
//   hyphenated across line breaks are joined, running heads are dropped, and each match
//   reports the printed page from the `[123/0139]` page-marker lines.
const fs = require('fs');

const [src, page, flag] = process.argv.slice(2);
if (!src || !page) {
  console.error('Usage: node scripts/book-maps/check-quotes.cjs <source.txt> <page.html> [--dta]');
  process.exit(1);
}
const norm = s => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/_/g, '').replace(/\s+/g, ' ').trim();

let text = '';
const marks = [];
if (flag === '--dta') {
  for (const line of fs.readFileSync(src, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\[\[?([^\]\/]+)\]?\/\d+\]$/);
    if (m) { marks.push([text.length, m[1]]); continue; }
    const t = line.trim();
    if (/^Menger, Volkswirthschaftslehre\.\s*\d*$/.test(t) || t === '*') continue;
    if (text.endsWith('-') && t) { text = text.slice(0, -1) + t; continue; }
    text += (text && !text.endsWith(' ') ? ' ' : '') + t;
  }
  // Page positions are recorded before whitespace is collapsed, so they can drift by a
  // few characters; close enough to name the page.
  text = norm(text);
} else {
  text = norm(fs.readFileSync(src, 'utf8'));
}
const pageAt = i => { let p = '?'; for (const [pos, pg] of marks) { if (pos <= i) p = pg; else break; } return p; };

let fails = 0;
for (const m of fs.readFileSync(page, 'utf8').matchAll(/«([^»]+)»/g)) {
  const q = norm(m[1]);
  const i = text.indexOf(q);
  if (i < 0) fails++;
  console.log((i < 0 ? 'FAIL ' : 'OK   ') + (marks.length && i >= 0 ? `[S. ${pageAt(i)}] ` : '') + q.slice(0, 80));
}
console.log(fails ? `${fails} quote(s) not found` : 'all quotes found');
process.exit(fails ? 1 : 0);
