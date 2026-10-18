// Builds src/data/mindmaps.json: the searchable text of every lesson's mind map, used
// by the /buscar page alongside the video transcripts.
//
// The maps are private claude.ai Artifacts, so a plain script can't download them.
// Ask Claude to save each one first (Artifact read, path "index.html") into
// .mindmaps-cache/<Día label>/index.html, e.g. .mindmaps-cache/11 bis/index.html.
// Then run:
//
//   node scripts/build-mindmaps-index.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { courseParts } from "../src/data/course.ts";

const root = join(import.meta.dirname, "..");
const cacheDir = join(root, ".mindmaps-cache");
const outFile = join(root, "src", "data", "mindmaps.json");

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(e[1] === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : entities[e] ?? m);
const plain = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// Returns [kind, text] pairs, in page order within each kind
function extract(html) {
  html = html.replace(/<!--[\s\S]*?-->|<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
  const entries = [];
  const add = (kind, text) => {
    if (text && text.length > 2) entries.push([kind, text]);
  };

  // SVG boxes: every <rect> starts a new box; its <text> lines are one entry. The first
  // SVG is the map itself, the rest are the supplementary diagrams under the notes.
  for (const [n, [, svg]] of [...html.matchAll(/<svg\b[\s\S]*?>([\s\S]*?)<\/svg>/gi)].entries()) {
    const kind = n === 0 ? "Mapa" : "Diagrama";
    let box = [];
    for (const [tag, , inner] of svg.matchAll(/<rect\b[^>]*>|<text\b([^>]*)>([\s\S]*?)<\/text>/gi)) {
      if (tag.startsWith("<rect")) {
        add(kind, box.join(" "));
        box = [];
      } else {
        box.push(plain(inner));
      }
    }
    add(kind, box.join(" "));
  }
  html = html.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");

  // Branch summaries in "Tus notas, rama por rama": one entry per numbered point
  for (const [, branch, rest] of html.matchAll(/class="notes-branch"[\s\S]*?<strong>([\s\S]*?)<\/strong>([\s\S]*?)(?=class="notes-branch"|$)/gi)) {
    const outline = rest.match(/class="notes-outline"[^>]*>([\s\S]*?)<\/div>/i);
    if (!outline) continue;
    for (const line of decode(outline[1].replace(/<[^>]+>/g, "")).split(/\n+/)) {
      add(`Notas · ${plain(branch)}`, line.replace(/\s+/g, " ").trim());
    }
  }

  for (const [, inner] of html.matchAll(/<p class="dek">([\s\S]*?)<\/p>/gi)) add("Introducción", plain(inner));
  for (const [, inner] of html.matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/gi)) add("Pie de figura", plain(inner));
  for (const [, inner] of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) add("Tabla", plain(inner));
  for (const [, inner] of html.matchAll(/class="callout-box"[^>]*>([\s\S]*?)<\/div>/gi)) add("Nota", plain(inner));
  for (const [, inner] of html.matchAll(/class="biblio-item"[^>]*>([\s\S]*?)<\/div>/gi)) add("Bibliografía", plain(inner));
  return entries;
}

const maps = [];
for (const part of courseParts) {
  for (const lesson of part.lessons) {
    if (!lesson.mindMapUrl) continue;
    const day = lesson.dayLabel ?? String(lesson.day);
    const file = join(cacheDir, day, "index.html");
    if (!existsSync(file)) {
      console.warn(`Falta el mapa del Día ${day}: guárdalo en ${file}`);
      continue;
    }
    maps.push({ day, lessonTitle: lesson.title, url: lesson.mindMapUrl, entries: extract(readFileSync(file, "utf8")) });
  }
}

writeFileSync(outFile, JSON.stringify({ maps }));
console.log(`${maps.length} mapas escritos en ${outFile}`);
