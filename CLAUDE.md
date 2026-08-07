min# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js (App Router, TypeScript) site that organizes the material for Jesús Huerta
de Soto's "Introducción a la Economía" course (Austrian School economics, Universidad
Rey Juan Carlos). It renders a structured syllabus (43 daily lessons across 7 parts,
plus a closing lecture) and a materials list.

The course content — the full syllabus, lecture-video titles, and PDF references — was
sourced from a NotebookLM notebook ("Huerta de Soto", notebook id
`7174958a-254b-47ae-bf50-bf52b9cce911`) that holds the official study guide PDF
(`Curso_Internet_JHS_ebook_pro.pdf`), a related paper on economic calculation and
socialism, and 22 YouTube lecture videos (24 sources total). If more course data needs
to be pulled in later (additional lecture transcripts, more days' videos, etc.), query
that notebook via the `notebooklm-mcp` MCP tools rather than re-deriving the syllabus
by hand.

`streamlit_app/` is a separate Python/Streamlit tool (not part of the Next.js site) that
shows a searchable index of that notebook's sources — see its own section below.

### notebooklm-mcp auth gotcha

The `nlm`/`notebooklm-mcp` CLI must be at v0.9.4+ (`nlm --version`). Versions before
that (e.g. 0.5.26) check the retired `notebooklm.google.com` domain to detect a
completed login, but Google renders the product at `notebook.google.com` now, so login
always times out on old versions. If `mcp__notebooklm-mcp__server_info` reports
`auth_status: stale` and `nlm login` keeps timing out despite signing in, run
`uv tool upgrade notebooklm-mcp-cli` first (the `notebooklm-mcp.exe` MCP server binary
may fail to overwrite if the MCP connection is currently active — that's fine, the `nlm`
CLI binary still updates and that's all `nlm login` needs).

Even on a current version, auth silently goes stale again mid-session (it seems to expire
every so often, not just once per machine). The symptom is
`mcp__notebooklm-mcp__source_get_content` returning
`{"status":"error","error":"Failed to get source content."}` with no other explanation.
Fix: run `nlm login` via Bash (opens a Chrome window for the Google sign-in), then call
`mcp__notebooklm-mcp__refresh_auth` so the MCP server picks up the new tokens — then
retry the `source_get_content` call. Expect to do this more than once per session.

## Commands

```
npm install       # install dependencies
npm run dev        # start dev server (http://localhost:3000)
npm run build      # production build
npm run start      # run the production build
npm run lint       # eslint (next lint)
```

There is no test suite yet.

To run the Streamlit source-index app:

```
cd streamlit_app
pip install -r requirements.txt
streamlit run app.py     # http://localhost:8501
```

## Architecture

- `src/data/course.ts` is the single source of truth for course content: `courseParts`
  (array of `{ title, lessons[] }`, where each lesson has `day`, `title`, `topics`, an
  optional `companionUrl` pointing at the per-day video index on anarcocapitalista.com,
  an optional `notebookVideos` array (one entry per lecture recording already saved as a
  source in the NotebookLM notebook for that day — a day can have more than one, e.g. a
  "bis"/supplementary recording alongside the main class), and an optional `mindMapUrl`
  pointing at a published mind-map Artifact for that lesson), `closingLesson`, and
  `courseMaterials` (the PDFs and extra videos in the notebook that aren't tied to a
  single day).
- `src/app/schedule/page.tsx` only renders lessons that have at least one entry in
  `notebookVideos` — days without a saved NotebookLM source (or whole course parts made
  up entirely of such days) are hidden from the temario. `src/app/page.tsx` is the
  overview/home page.
- To add or correct course content, edit `src/data/course.ts` directly; do not
  hardcode lesson data inside page components.
- To generate a mind map for a lesson: pull that lesson's video transcript(s) via
  `mcp__notebooklm-mcp__source_get_content` (match the source by the title in
  `notebookVideos` — if a day has more than one video, e.g. a "bis" recording, read both
  and build one combined map). Transcripts often exceed the tool's inline size limit and
  get saved to a file instead; extract the JSON's `content` field with a small Node
  script (`node -e "..."`, not python — this machine has no `python3`/`py` on PATH), then
  reflow it into ~200-char lines (again via a quick Node one-liner) so `Grep`/`Read` can
  page through it, since the raw transcript is one giant unbroken line. Build the map as
  a self-contained HTML mind map (inline SVG, no libraries) grounded in the transcript's
  actual content/examples, publish it with the `Artifact` tool, and set the resulting
  URL as that lesson's `mindMapUrl`.
  - **Bibliography citations**: grep the transcript for citation-worthy signals (`libro`,
    `cita`, `dice`, `escrito`, `página \d`, `ensayo`, `obra`, author surnames) and add a
    numbered citation (`[1]`, `[2]`, ...) only where the professor explicitly quotes or
    names a specific book/essay tied to that node's content — not for a passing mention
    of an author's name or an idea attributed to them without a titled work. Render each
    citation as a small `<a>`-wrapped `<text>` line inside the relevant SVG node (reuse
    the same citation number if the same book is quoted in multiple branches), and add a
    "Bibliografía citada en esta clase" section at the bottom listing each source once,
    with the author's name linked to their Wikipedia page (verify the page exists first —
    fetch it, don't guess the URL) and a link to a legitimate free/official edition of the
    work where one exists (e.g. mises.org, Project Gutenberg, dle.rae.es) — never link to
    unauthorized PDF-host copies. If no reliable external link exists (e.g. the professor's
    own course PDF), cite it as plain text instead of a link. Don't use an emoji as the
    citation marker (📖 rendered as a blank tofu box in this environment's Chrome — no
    color-emoji font); the `[n]` bracket-number convention is what's in use across the
    existing maps.
  - Growing a node to fit a citation line means manually shifting every following node in
    that branch's `y` coordinate (and its leaf→branch connector path endpoint) down to
    avoid overlap, then re-centering the branch's own label box on its leaf span's new
    midpoint — there's no auto-layout. When editing an *existing* map, fetch its current
    HTML first via `WebFetch` on the artifact URL (it returns the raw source, not a
    markdown summary, for `claude.ai/code/artifact/*` URLs) rather than rebuilding from
    scratch, since maps may already carry hand-authored content or a notes feature.
  - Every map also carries a "Tus notas, rama por rama" section: one `<textarea>` per
    branch, auto-saved to `localStorage` under a `economia-clase{N}-mindmap-notes-`
    prefix (see any existing mind map's trailing `<script>` for the exact snippet — it's
    copied verbatim across lessons, just swapping the storage prefix and branch keys).
  - If a `notebookVideos` entry has no `url`, don't guess one (searches for the exact
    title often surface nothing, or the wrong video) — ask the user for it rather than
    fabricating a YouTube link.
  - **Supplementary process diagrams**: when a branch's mechanism is a step-by-step
    process (an auction, a negotiation, a market-clearing calculation) that prose or a
    static leaf node can't make legible, add a dedicated inline-SVG diagram — reuse the
    same 980×460 `viewBox` and the axis/arc/bracket visual vocabulary across a lesson's
    diagrams so they read as one set. Place it inside that branch's own row in "Tus notas,
    rama por rama" (a `<figure><div class="diagram-wrap"><svg>…</svg></div><figcaption>…`
    appended right after the `<textarea>`'s `<span class="notes-status">`, not as a
    standalone section elsewhere on the page), and color its strokes/highlights with that
    branch's own CSS variable (`var(--b)`, `var(--c)`, etc.) so it visually matches the
    branch's color in the main map and legend. Ground every labeled value strictly in
    numbers the professor actually states — where the transcript only gives a count or a
    direction ("cinco vendedores más, piden menos de 200") without individual figures,
    say exactly that in a muted schematic callout instead of inventing precise numbers to
    fill out the picture. A written outline for the same branch (if one was produced) can
    be pre-filled as the `<textarea>`'s literal content (not just its `placeholder`) so it
    shows by default before any localStorage note overrides it; the diagram goes below
    that text, inside the same `<div class="notes-field">`.
- `streamlit_app/sources.py` holds a static, hand-maintained copy of the notebook's
  source list (id + title) pulled via `notebook_get`; `streamlit_app/app.py` renders it
  as a searchable/filterable table. Regenerate `sources.py` by re-running `notebook_get`
  on the notebook id above and updating the list by hand — it does not call the
  NotebookLM API at runtime.
