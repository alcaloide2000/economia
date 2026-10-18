"use client";

import { useEffect, useState } from "react";
import type { SearchResponse } from "@/lib/search";

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
};

// Start the video a few seconds early so the word isn't cut off
const videoLink = (videoId: string, seconds: number) =>
  `https://www.youtube.com/watch?v=${videoId}&t=${Math.max(0, seconds - 3)}s`;

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore a search from the URL (?q=...) so results can be linked
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  useEffect(() => {
    const q = query.trim();
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);

    if (q.length < 2) {
      setData(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        setData(await res.json());
      } catch {
        // aborted by a newer keystroke
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <input
        type="search"
        className="search-input"
        placeholder="Por ejemplo: utilidad marginal, Salamanca, coeficiente de caja…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <p className="search-status">
        {loading
          ? "Buscando…"
          : data
            ? data.results.length === 0
              ? "Sin resultados."
              : `${plural(data.videoTotal, "mención", "menciones")} en los vídeos y ` +
                `${data.mapTotal} en los mapas mentales, ` +
                `en ${plural(data.results.length, "clase", "clases")}` +
                (data.truncated ? " (se muestran las primeras 400)" : "")
            : "Busca en lo que se dice en los vídeos y en el texto de los mapas mentales, sin preocuparte por las tildes ni las mayúsculas. Los subtítulos de los vídeos son los automáticos de YouTube, así que algún nombre propio puede estar mal transcrito."}
      </p>

      {data?.results.map((lesson) => (
        <section className="lesson-card search-result" key={lesson.day}>
          <span className="day-badge">Día {lesson.day}</span>
          <h3>{lesson.lessonTitle}</h3>

          {lesson.videos.map((video) => (
            <div className="search-group" key={video.videoId}>
              <p className="search-group-title">▶ {video.videoTitle}</p>
              <ul className="search-hits">
                {video.hits.map((hit) => (
                  <li key={hit.seconds}>
                    <a href={videoLink(video.videoId, hit.seconds)} target="_blank" rel="noreferrer" className="search-tag">
                      {formatTime(hit.seconds)}
                    </a>
                    <Highlighted text={[hit.before, hit.match, hit.after].filter(Boolean).join(" ")} query={query} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {lesson.mapHits.length > 0 && (
            <div className="search-group">
              <p className="search-group-title">
                En el{" "}
                <a href={lesson.mindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link">
                  mapa mental →
                </a>
              </p>
              <ul className="search-hits">
                {lesson.mapHits.map((hit, i) => (
                  <li key={i}>
                    <a href={lesson.mindMapUrl} target="_blank" rel="noreferrer" className="search-tag search-tag-map">
                      {hit.kind}
                    </a>
                    <Highlighted text={hit.text} query={query} maxLength={260} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lesson.mapHits.length === 0 && lesson.mindMapUrl && (
            <a href={lesson.mindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link search-map-link">
              Mapa mental →
            </a>
          )}
        </section>
      ))}
    </>
  );
}

const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Text with the searched words highlighted (accent-insensitive). Text longer than
 * `maxLength` is cut to a window around the first match.
 */
function Highlighted({ text, query, maxLength }: { text: string; query: string; maxLength?: number }) {
  const words = fold(query).split(/\s+/).filter((w) => w.length >= 2);
  let prefix = "…";
  let suffix = "…";

  if (maxLength && text.length > maxLength) {
    const first = Math.max(0, fold(text).indexOf(fold(query).trim().split(/\s+/)[0] ?? ""));
    const start = Math.max(0, Math.min(first - maxLength / 3, text.length - maxLength));
    const end = start + maxLength;
    prefix = start > 0 ? "…" : "";
    suffix = end < text.length ? "…" : "";
    text = text.slice(start, end);
  } else if (maxLength) {
    prefix = suffix = "";
  }

  const folded = fold(text);
  const marks = new Array<boolean>(text.length).fill(false);
  for (const word of words) {
    for (let i = folded.indexOf(word); i !== -1; i = folded.indexOf(word, i + 1)) {
      marks.fill(true, i, i + word.length);
    }
  }

  const parts: React.ReactNode[] = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || marks[i] !== marks[start]) {
      const piece = text.slice(start, i);
      parts.push(marks[start] ? <mark key={start}>{piece}</mark> : piece);
      start = i;
    }
  }
  return <span className="search-snippet">{prefix}{parts}{suffix}</span>;
}
