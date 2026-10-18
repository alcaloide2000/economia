"use client";

import { useEffect, useState } from "react";
import type { SearchHit, VideoResult } from "@/lib/transcriptSearch";

type Response = { results: VideoResult[]; total: number; truncated: boolean };

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
};

// Start the video a few seconds early so the word isn't cut off
const videoLink = (videoId: string, seconds: number) =>
  `https://www.youtube.com/watch?v=${videoId}&t=${Math.max(0, seconds - 3)}s`;

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Response | null>(null);
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
            ? data.total === 0
              ? "Sin resultados."
              : `${data.total} menciones en ${data.results.length} ${data.results.length === 1 ? "clase" : "clases"}` +
                (data.truncated ? " (se muestran las primeras 400)" : "")
            : "Busca sin preocuparte por las tildes ni las mayúsculas. Los subtítulos son los automáticos de YouTube, así que algún nombre propio puede estar mal transcrito."}
      </p>

      {data?.results.map((video) => (
        <section className="lesson-card search-result" key={video.videoId}>
          <span className="day-badge">Día {video.day}</span>
          <h3>{video.lessonTitle}</h3>
          <p className="search-video-title">▶ {video.videoTitle}</p>
          <ul className="search-hits">
            {video.hits.map((hit) => (
              <li key={hit.seconds}>
                <a href={videoLink(video.videoId, hit.seconds)} target="_blank" rel="noreferrer" className="search-time">
                  {formatTime(hit.seconds)}
                </a>
                <Snippet hit={hit} query={query} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Caption context with the searched words highlighted (accent-insensitive) */
function Snippet({ hit, query }: { hit: SearchHit; query: string }) {
  const text = [hit.before, hit.match, hit.after].filter(Boolean).join(" ");
  const folded = fold(text);
  const words = fold(query).split(/\s+/).filter((w) => w.length >= 2);

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
  return <span className="search-snippet">…{parts}…</span>;
}
