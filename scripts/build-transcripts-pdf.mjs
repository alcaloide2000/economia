// Prints every class transcript in src/data/transcripts.json to one PDF
// (transcripciones.pdf in the repo root), one paragraph per minute with a timestamp
// that links to that moment of the video. Run build-transcripts.mjs first to refresh
// the data. Uses a local Chrome (or Edge) in headless mode to render the PDF.
//
//   node scripts/build-transcripts-pdf.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dirname, "..");
const { videos } = JSON.parse(readFileSync(join(root, "src", "data", "transcripts.json"), "utf8"));
const htmlFile = join(root, ".transcripts-cache", "transcripciones.html");
const pdfFile = join(root, "transcripciones.pdf");
mkdirSync(join(root, ".transcripts-cache"), { recursive: true });

const browser = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
if (!browser) throw new Error("No se encontró Chrome ni Edge para generar el PDF.");

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(h ? 2 : 1, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return h ? `${h}:${m}:${s}` : `${m}:${s}`;
};
const anchor = (video) => `v-${video.videoId}`;

// A day with more than one video gets "(vídeo 2)", "(vídeo 3)"… after its first
const seen = {};
for (const v of videos) {
  seen[v.day] = (seen[v.day] ?? 0) + 1;
  v.label = seen[v.day] > 1 ? `${v.lessonTitle} (vídeo ${seen[v.day]})` : v.lessonTitle;
}

// Group caption lines into one paragraph per minute of video
function paragraphs(segments) {
  const out = [];
  for (const [start, text] of segments) {
    const last = out.at(-1);
    if (last && start < last.start + 60) last.text.push(text);
    else out.push({ start, text: [text] });
  }
  return out;
}

const toc = videos
  .map((v) => `<li><a href="#${anchor(v)}"><b>Día ${escape(v.day)}</b> · ${escape(v.label)}</a></li>`)
  .join("\n");

const body = videos
  .map((v) => {
    const url = `https://www.youtube.com/watch?v=${v.videoId}`;
    const paras = paragraphs(v.segments)
      .map((p) => `<p><a class="t" href="${url}&t=${p.start}s">${formatTime(p.start)}</a> ${escape(p.text.join(" "))}</p>`)
      .join("\n");
    return `<section id="${anchor(v)}">
  <div class="day">Día ${escape(v.day)}</div>
  <h2>${escape(v.label)}</h2>
  <p class="video">▶ <a href="${url}">${escape(v.videoTitle)}</a></p>
  ${paras}
</section>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Acción Humana · Transcripciones de las clases</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font-family: "Palatino Linotype", Palatino, Georgia, serif; color: #211c14; font-size: 10pt; line-height: 1.45; }
  a { color: #7c5814; text-decoration: none; }
  .cover { page-break-after: always; }
  .cover h1 { font-size: 26pt; margin: 30mm 0 4mm; }
  .cover .sub { color: #5a5346; font-size: 12pt; }
  .cover .note { color: #5a5346; font-size: 9pt; margin-top: 8mm; }
  .toc { columns: 1; padding-left: 0; list-style: none; }
  .toc li { margin: 1.5mm 0; }
  section { page-break-before: always; }
  .day { display: inline-block; font: 700 8pt system-ui, sans-serif; letter-spacing: .05em; text-transform: uppercase;
         color: #7c5814; background: #f5ecd7; border-radius: 4px; padding: 1px 6px; }
  h2 { font-size: 15pt; margin: 3mm 0 1mm; }
  .video { color: #5a5346; font-size: 9pt; margin: 0 0 5mm; }
  p { margin: 0 0 2.2mm; text-align: justify; }
  .t { font: 600 8pt system-ui, sans-serif; color: #7c5814; background: #f5ecd7; border-radius: 3px; padding: 0 4px; }
</style></head><body>
<div class="cover">
  <h1>Acción Humana</h1>
  <div class="sub">Curso de Jesús Huerta de Soto · Transcripciones de las ${videos.length} clases</div>
  <div class="note">Texto de los subtítulos automáticos de YouTube, sin corregir: algunos nombres propios pueden
    estar mal transcritos. Cada marca de tiempo enlaza con ese minuto del vídeo. Generado el
    ${new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}.</div>
  <h2>Índice</h2>
  <ul class="toc">${toc}</ul>
</div>
${body}
</body></html>`;

writeFileSync(htmlFile, html);
execFileSync(browser, [
  "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
  `--print-to-pdf=${pdfFile}`, pathToFileURL(htmlFile).href,
], { stdio: "ignore" });
console.log(`PDF escrito en ${pdfFile}`);
