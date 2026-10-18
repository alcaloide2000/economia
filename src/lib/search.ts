import { courseParts } from "@/data/course";
import mindmaps from "@/data/mindmaps.json";
import transcripts from "@/data/transcripts.json";

type Segment = [startSeconds: number, text: string];

type TranscriptVideo = {
  day: string;
  lessonTitle: string;
  videoTitle: string;
  videoId: string;
  segments: Segment[];
};

type MindMap = {
  day: string;
  lessonTitle: string;
  url: string;
  /** [kind, text]: kind says where on the map the text is (Mapa, Diagrama, Notas · rama…) */
  entries: [string, string][];
};

export type VideoHit = {
  seconds: number;
  /** The matching caption line plus its neighbours, as plain text */
  before: string;
  match: string;
  after: string;
};

export type MapHit = { kind: string; text: string };

export type LessonResult = {
  day: string;
  lessonTitle: string;
  mindMapUrl?: string;
  videos: { videoTitle: string; videoId: string; hits: VideoHit[] }[];
  mapHits: MapHit[];
};

export type SearchResponse = {
  results: LessonResult[];
  videoTotal: number;
  mapTotal: number;
  truncated: boolean;
};

const MAX_HITS = 400;

/** Lowercase and drop accents, so "economia" finds "economía". One char in, one char out. */
export const normalize = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type IndexedVideo = TranscriptVideo & {
  /** All segments joined by single spaces, normalized */
  text: string;
  /** Offset in `text` where each segment starts */
  offsets: number[];
};

type IndexedMap = MindMap & { normalized: string[] };

let index: { videos: IndexedVideo[]; maps: IndexedMap[]; order: Map<string, number> } | null = null;

function getIndex() {
  if (index) return index;
  const videos = (transcripts.videos as TranscriptVideo[]).map((video) => {
    const offsets: number[] = [];
    let text = "";
    for (const [, segmentText] of video.segments) {
      if (text) text += " ";
      offsets.push(text.length);
      text += normalize(segmentText);
    }
    return { ...video, text, offsets };
  });
  const maps = (mindmaps.maps as MindMap[]).map((map) => ({
    ...map,
    normalized: map.entries.map(([, text]) => normalize(text).replace(/\s+/g, " ")),
  }));
  // Results are listed in temario order
  const order = new Map(
    courseParts.flatMap((part) => part.lessons).map((lesson, i) => [lesson.dayLabel ?? String(lesson.day), i]),
  );
  index = { videos, maps, order };
  return index;
}

/** Index of the segment that contains character `pos` of the joined text */
function segmentAt(offsets: number[], pos: number) {
  let lo = 0;
  let hi = offsets.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (offsets[mid] <= pos) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function search(query: string): SearchResponse {
  const needle = normalize(query).replace(/\s+/g, " ").trim();
  const empty = { results: [], videoTotal: 0, mapTotal: 0, truncated: false };
  if (needle.length < 2) return empty;

  const { videos, maps, order } = getIndex();
  const lessons = new Map<string, LessonResult>();
  const lessonFor = (day: string, lessonTitle: string) => {
    let lesson = lessons.get(day);
    if (!lesson) {
      lesson = { day, lessonTitle, videos: [], mapHits: [] };
      lessons.set(day, lesson);
    }
    return lesson;
  };
  let videoTotal = 0;
  let mapTotal = 0;
  let shown = 0;

  for (const video of videos) {
    const hits: VideoHit[] = [];
    let lastSegment = -1;
    for (let pos = video.text.indexOf(needle); pos !== -1; pos = video.text.indexOf(needle, pos + needle.length)) {
      const i = segmentAt(video.offsets, pos);
      // Several hits on the same caption line read as one mention
      if (i === lastSegment) continue;
      lastSegment = i;
      videoTotal++;
      if (++shown > MAX_HITS) continue;
      hits.push({
        seconds: video.segments[i][0],
        before: video.segments[i - 1]?.[1] ?? "",
        match: video.segments[i][1],
        after: video.segments[i + 1]?.[1] ?? "",
      });
    }
    if (hits.length > 0) {
      lessonFor(video.day, video.lessonTitle).videos.push({ videoTitle: video.videoTitle, videoId: video.videoId, hits });
    }
  }

  for (const map of maps) {
    const hits: MapHit[] = [];
    map.normalized.forEach((text, i) => {
      if (!text.includes(needle)) return;
      mapTotal++;
      if (++shown > MAX_HITS) return;
      const [kind, original] = map.entries[i];
      hits.push({ kind, text: original });
    });
    if (hits.length > 0) lessonFor(map.day, map.lessonTitle).mapHits = hits;
  }

  // Every result card links to its map, even when only the video matched
  for (const map of maps) {
    const lesson = lessons.get(map.day);
    if (lesson) lesson.mindMapUrl = map.url;
  }

  const results = [...lessons.values()].sort((a, b) => (order.get(a.day) ?? 0) - (order.get(b.day) ?? 0));
  return { results, videoTotal, mapTotal, truncated: shown > MAX_HITS };
}
