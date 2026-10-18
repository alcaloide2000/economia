// Builds src/data/transcripts.json: the timestamped YouTube captions of every lesson
// video in course.ts, used by the /buscar page to find the class and minute where a
// word is said. Needs yt-dlp on PATH. Downloaded captions are cached in
// .transcripts-cache/ so re-runs only fetch videos that are new.
//
//   node scripts/build-transcripts.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { courseParts } from "../src/data/course.ts";

const root = join(import.meta.dirname, "..");
const cacheDir = join(root, ".transcripts-cache");
const outFile = join(root, "src", "data", "transcripts.json");
mkdirSync(cacheDir, { recursive: true });

const videoId = (url) => url.match(/(?:[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1];

function fetchCaptions(id) {
  const file = join(cacheDir, `${id}.es.json3`);
  // YouTube fails a request now and then (rate limiting), so retry before giving up.
  for (let attempt = 1; attempt <= 3 && !existsSync(file); attempt++) {
    console.log(`Descargando subtítulos de ${id} (intento ${attempt})…`);
    try {
      execFileSync(
        "yt-dlp",
        ["--skip-download", "--write-subs", "--write-auto-subs", "--sub-langs", "es", "--sub-format", "json3",
          "-o", join(cacheDir, "%(id)s.%(ext)s"), `https://www.youtube.com/watch?v=${id}`],
        { stdio: "ignore" },
      );
    } catch {
      // fall through to the next attempt
    }
  }
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
}

// One [startSeconds, text] pair per caption event, skipping the empty line-break events
// that auto-generated captions are full of.
function toSegments(json3) {
  const segments = [];
  for (const event of json3.events ?? []) {
    if (!event.segs) continue;
    const text = event.segs.map((s) => s.utf8).join("").replace(/\s+/g, " ").trim();
    if (text) segments.push([Math.floor(event.tStartMs / 1000), text]);
  }
  return segments;
}

const videos = [];
for (const part of courseParts) {
  for (const lesson of part.lessons) {
    for (const video of lesson.notebookVideos ?? []) {
      const id = video.url && videoId(video.url);
      if (!id) continue;
      const json3 = fetchCaptions(id);
      if (!json3) {
        console.warn(`Sin subtítulos en español: Día ${lesson.dayLabel ?? lesson.day} (${id})`);
        continue;
      }
      videos.push({
        day: lesson.dayLabel ?? String(lesson.day),
        lessonTitle: lesson.title,
        videoTitle: video.title,
        videoId: id,
        segments: toSegments(json3),
      });
    }
  }
}

writeFileSync(outFile, JSON.stringify({ videos }));
console.log(`${videos.length} vídeos escritos en ${outFile}`);
