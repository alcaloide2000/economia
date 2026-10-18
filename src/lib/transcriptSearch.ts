import transcripts from "@/data/transcripts.json";

type Segment = [startSeconds: number, text: string];

type TranscriptVideo = {
  day: string;
  lessonTitle: string;
  videoTitle: string;
  videoId: string;
  segments: Segment[];
};

export type SearchHit = {
  seconds: number;
  /** The matching caption line plus its neighbours, as plain text */
  before: string;
  match: string;
  after: string;
};

export type VideoResult = {
  day: string;
  lessonTitle: string;
  videoTitle: string;
  videoId: string;
  hits: SearchHit[];
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

let index: IndexedVideo[] | null = null;

function getIndex(): IndexedVideo[] {
  if (index) return index;
  index = (transcripts.videos as TranscriptVideo[]).map((video) => {
    const offsets: number[] = [];
    let text = "";
    for (const [, segmentText] of video.segments) {
      if (text) text += " ";
      offsets.push(text.length);
      text += normalize(segmentText);
    }
    return { ...video, text, offsets };
  });
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

export function searchTranscripts(query: string): { results: VideoResult[]; total: number; truncated: boolean } {
  const needle = normalize(query).replace(/\s+/g, " ").trim();
  if (needle.length < 2) return { results: [], total: 0, truncated: false };

  const results: VideoResult[] = [];
  let total = 0;

  for (const video of getIndex()) {
    const hits: SearchHit[] = [];
    let lastSegment = -1;
    for (let pos = video.text.indexOf(needle); pos !== -1; pos = video.text.indexOf(needle, pos + needle.length)) {
      const i = segmentAt(video.offsets, pos);
      // Several hits on the same caption line read as one mention
      if (i === lastSegment) continue;
      lastSegment = i;
      total++;
      if (total > MAX_HITS) continue;
      hits.push({
        seconds: video.segments[i][0],
        before: video.segments[i - 1]?.[1] ?? "",
        match: video.segments[i][1],
        after: video.segments[i + 1]?.[1] ?? "",
      });
    }
    if (hits.length > 0) {
      results.push({
        day: video.day,
        lessonTitle: video.lessonTitle,
        videoTitle: video.videoTitle,
        videoId: video.videoId,
        hits,
      });
    }
  }

  return { results, total, truncated: total > MAX_HITS };
}
