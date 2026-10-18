// Generates a book mind-map page (the Ricardo, Smith and Menger maps linked from the
// temario header): blocks and leaves come from a data module, coordinates are computed.
//
// Usage: node scripts/book-maps/build-book-map.cjs <book> <out.html>
//   <book> names both the data module (<book>.cjs) and the page template (<book>.tpl.html)
//   in this folder. Publish <out.html> to the book's existing map Artifact URL.
//
// A data module exports:
//   SUM       the summary Artifact URL; leaves link to `${SUM}#cap-${id}`
//   aria      the SVG's aria-label
//   trunk     [eyebrow, [title line 1, line 2, line 3], author]
//   notesKey  notes textarea key stem (`bloque` → keys bloque1, bloque2…); default 'bloque'
//   notesNoun word in the textarea placeholder ("Tus notas sobre el capítulo 1…");
//             defaults to notesKey, set it when the key drops an accent
//   numbered  true to prefix legend/notes labels with "Bloque N: " (blocks that are the
//             summary's own grouping, as in Ricardo); false when `title` already names the
//             book's own part ("Libro I: …", "Capítulo I: …")
//   BLOCKS    [{ c: CSS colour var (p1…p8), tag, name: [line 1, line 2], course, title,
//                leaves: [[anchor id, badge, title, one-line idea], …] }, …]
const fs = require('fs');
const path = require('path');

const [book, out] = process.argv.slice(2);
if (!book || !out) {
  console.error('Usage: node scripts/book-maps/build-book-map.cjs <book> <out.html>');
  process.exit(1);
}
const DATA = require(path.join(__dirname, `${book}.cjs`));
const SUM = DATA.SUM, BLOCKS = DATA.BLOCKS;
const KEY = DATA.notesKey || 'bloque';
const NOUN = DATA.notesNoun || KEY;

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const LEAF_H = 50, LEAF_STEP = 58, BLOCK_GAP = 34, TOP = 30;
let y = TOP;
const blocks = BLOCKS.map(b => {
  const leaves = b.leaves.map(l => { const ly = y; y += LEAF_STEP; return { id: l[0], n: l[1], t: l[2], idea: l[3], y: ly, cy: ly + LEAF_H / 2 }; });
  y += BLOCK_GAP;
  const cy = Math.round((leaves[0].cy + leaves[leaves.length - 1].cy) / 2);
  return { ...b, leaves, cy };
});
const H = y - BLOCK_GAP + TOP;
const CY = Math.round(H / 2);

let svg = `<svg viewBox="0 0 1330 ${H}" role="img" aria-label="${esc(DATA.aria)}">\n`;
svg += '<g fill="none" stroke-width="2.25" opacity="0.75">\n';
for (const b of blocks) svg += `<path d="M240,${CY} C 285,${CY} 285,${b.cy} 330,${b.cy}" stroke="var(--${b.c})" />\n`;
svg += '</g>\n<g fill="none" stroke-width="1.4" opacity="0.5">\n';
for (const b of blocks) for (const l of b.leaves) svg += `<path d="M600,${b.cy} C 640,${b.cy} 640,${l.cy} 680,${l.cy}" stroke="var(--${b.c})" />\n`;
svg += '</g>\n';
const serif = `font-family="'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif"`;
svg += `<g><rect x="30" y="${CY - 90}" width="210" height="180" rx="18" fill="var(--trunk)" />
<text x="135" y="${CY - 52}" text-anchor="middle" font-size="11.5" letter-spacing="0.08em" fill="var(--trunk-ink)" opacity="0.7">${esc(DATA.trunk[0])}</text>
<text x="135" y="${CY - 22}" text-anchor="middle" font-size="20" font-weight="700" fill="var(--trunk-ink)" ${serif}>${esc(DATA.trunk[1][0])}</text>
<text x="135" y="${CY + 3}" text-anchor="middle" font-size="20" font-weight="700" fill="var(--trunk-ink)" ${serif}>${esc(DATA.trunk[1][1])}</text>
<text x="135" y="${CY + 28}" text-anchor="middle" font-size="20" font-weight="700" fill="var(--trunk-ink)" ${serif}>${esc(DATA.trunk[1][2])}</text>
<text x="135" y="${CY + 56}" text-anchor="middle" font-size="11" fill="var(--trunk-ink)" opacity="0.65">${esc(DATA.trunk[2])}</text></g>\n`;
for (const b of blocks) {
  const top = b.cy - 47;
  svg += `<g><rect x="330" y="${top}" width="270" height="94" rx="14" fill="var(--${b.c}-soft)" stroke="var(--${b.c})" stroke-width="1.5" />
<text x="465" y="${top + 22}" text-anchor="middle" class="bnum" fill="var(--${b.c})">${esc(b.tag)}</text>
<text x="465" y="${top + 44}" text-anchor="middle" class="bname" fill="var(--${b.c})">${esc(b.name[0])}</text>
<text x="465" y="${top + 62}" text-anchor="middle" class="bname" fill="var(--${b.c})">${esc(b.name[1])}</text>
<text x="465" y="${top + 80}" text-anchor="middle" class="bcourse" fill="var(--ink-soft)">${esc(b.course)}</text></g>\n`;
}
for (const b of blocks) for (const l of b.leaves) {
  svg += `<a href="${SUM}#cap-${l.id}" target="_blank" rel="noopener" class="leaf"><title>${esc(l.n)} · ${esc(l.t)}: abrir el resumen</title>
<rect x="680" y="${l.y}" width="620" height="50" rx="10" fill="var(--bg-raised)" stroke="var(--${b.c})" stroke-width="1.2" />
<rect x="690" y="${l.y + 14}" width="84" height="22" rx="6" fill="var(--${b.c}-soft)" />
<text x="732" y="${l.y + 29}" text-anchor="middle" class="lday" fill="var(--${b.c})">${esc(l.n)}</text>
<text x="788" y="${l.y + 21}" class="ltitle">${esc(l.t)}</text>
<text x="788" y="${l.y + 38}" class="lidea">${esc(l.idea)}</text>
<text x="1286" y="${l.y + 30}" text-anchor="end" class="larrow" fill="var(--${b.c})">→</text></a>\n`;
}
svg += '</svg>';

const label = (b, i) => (DATA.numbered ? `Bloque ${i + 1}: ` : '') + esc(b.title);
const legend = blocks.map((b, i) => `    <span><span class="dot" style="background:var(--${b.c})"></span>${label(b, i)}</span>`).join('\n');
const rows = blocks.map((b, i) => `      <div class="notes-row" style="--branch-accent:var(--${b.c})">
        <div class="notes-branch"><span class="dot" style="background:var(--${b.c})"></span><strong>${label(b, i)}</strong></div>
        <div class="notes-field">
          <textarea id="notes-${KEY}${i + 1}" data-notes-key="${KEY}${i + 1}" placeholder="Tus notas sobre el ${NOUN} ${i + 1}…"></textarea>
          <span class="notes-status" data-notes-status></span>
        </div>
      </div>`).join('\n');

const tpl = fs.readFileSync(path.join(__dirname, `${book}.tpl.html`), 'utf8');
fs.writeFileSync(out, tpl.replace('%%SVG%%', svg).replace('%%LEGEND%%', legend).replace('%%ROWS%%', rows));
console.log('height', H, 'leaves', blocks.reduce((n, b) => n + b.leaves.length, 0));
