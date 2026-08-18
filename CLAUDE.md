# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js (App Router, TypeScript) site that organizes the material for Jesús Huerta
de Soto's "Introducción a la Economía" course (Austrian School economics, Universidad
Rey Juan Carlos). It renders a structured syllabus (43 daily lessons grouped into the
course's 7 "Parte" sections in the underlying data — see below) and a materials list.

The course content — the full syllabus, lecture-video titles, and PDF references — was
sourced from a NotebookLM notebook ("Huerta de Soto", notebook id
`7174958a-254b-47ae-bf50-bf52b9cce911`) that holds the official study guide PDF
(`Curso_Internet_JHS_ebook_pro.pdf`), a related paper on economic calculation and
socialism, and 28 YouTube lecture videos (29 sources total). If more course data needs
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

### "Clase N" video numbers don't match "Día N" syllabus days

The YouTube video titled "Clase N" (the professor's own recording-session numbering) is
**not** guaranteed to cover the topic printed under Día N in the study guide — the two
numbering schemes drift apart. Confirmed cases so far: Clase 20 is actually the closing
lecture of the money-theory block, not "apertura del bloque de macroeconomía"; Clase 21
is a semester-opening/philosophy-of-teaching class; Clase 22 is a one-off commentary on
Javier Milei's Davos speech; Clase 23 is the actual "naturaleza jurídica del contrato de
depósito irregular" lecture (covering what the printed programme splits across two days).
From Clase 24 on, the drift becomes a sustained one-day lag rather than an isolated
mismatch: Clase 24's own map stops short of the Día 24 syllabus topic ("bancos en la
historia") and ends on a "lo que viene: la Escuela de Salamanca" teaser; Clase 25 mostly
finishes that same banking-history material (Barcelona, Salamanca, Ámsterdam, Cantillón)
and only introduces the real Día 25 topic (fundamentación jurídica de la reserva
fraccionaria) in its last few minutes, promising "el jueves"; Clase 26 is that promised
follow-up — it fully develops Día 25's doctrinal-justification topic and only lightly
touches Día 26's real topic (proceso de expansión crediticia), again deferring the detail
to the next class. Both Día 25 and Día 26 were relabeled (title/topics rewritten in
`course.ts`) to match what their videos actually cover, per the user's resolution choice
each time — see below. Always pull and read the transcript before trusting a
`notebookVideos` title-to-day assignment or writing a lesson's `title`/`topics` from it —
don't assume Clase N ≈ Día N, and don't assume a video finishes the topic it starts. When
a mismatch surfaces, ask the user how they want it resolved (there's no single correct
default: past sessions have both relabeled the day to match the video's real content, and
kept the naive 1:1 numbering with a documented caveat).

The drift isn't monotonic, though. Clase 27 broke the streak: it lines up cleanly with
Día 27's own topic (la teoría del capital) start to finish, no relabeling needed. Clase 28
mostly confirms this — its content matches Día 28's "la tasa o tipo de interés" as the
core topic throughout — but isn't a clean 1:1 either: the back half of the class runs into
Día 29's own material (estructura productiva, renta bruta y neta, crítica a la
contabilidad nacional) without finishing it, explicitly deferring Teoría Austríaca del
Ciclo Económico to "el jueves" (the next class). Since Día 28 was already the right day,
it wasn't relabeled — only its `topics` text was expanded to cover everything the video
actually teaches. Moral: don't assume the 24-26 lag pattern continues indefinitely either;
check each new transcript on its own terms.

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

## Git & deployment

- Hosted on GitHub at https://github.com/alcaloide2000/economia (public, `master`
  branch).
- Deployed to Render as a free-tier web service, defined by the `render.yaml` blueprint
  in the repo root (`npm install && npm run build` / `npm run start`); live at
  https://economia-o778.onrender.com. The service is connected to the GitHub repo, so
  pushing to `master` triggers an auto-deploy — there is no separate manual deploy step.
  Free-tier services spin down after inactivity, so the first request after a while can
  take ~30s+ to respond while it wakes back up.

## Architecture

- `src/data/course.ts` is the single source of truth for course content: `courseParts`
  (array of `{ title, lessons[], alwaysShow? }`). Most parts are the 7 numbered "Parte"
  sections of the official syllabus, but there are also a few unofficial, un-numbered
  divider sections (e.g. "Introducción a la Microeconomía y Complementos" at Día 1,
  "Dinero y Ciclos Económicos" at Día 21) used when a run of days doesn't belong to any
  of the 7 official parts — don't invent a "Quinta Parte:"-style ordinal for one of these
  unless it's actually the next real part in sequence, since the numbered ordinals are
  already used further down the syllabus. A lesson is filed under whichever part it
  thematically belongs to, which is not always the part its `day` number would suggest if
  the video's actual content runs ahead of or behind the printed programme — check the
  transcript, not just the day number, before trusting a lesson's placement or `topics`
  text (see the "Clase N" vs "Día N" gotcha above). `alwaysShow: true` on a part makes
  `schedule/page.tsx` render that part's heading even when none of its lessons have a
  `notebookVideos` entry yet — used for a just-created divider section whose days don't
  have videos yet, so the heading isn't silently hidden along with them. Each lesson has
  `day`, `title`, `topics`, an optional `companionUrl` pointing at the per-day video index
  on anarcocapitalista.com (kept in the data for every lesson but not currently rendered
  anywhere — see below), an optional `notebookVideos` array (one entry per lecture
  recording already saved as a source in the NotebookLM notebook for that day — a day
  can have more than one, e.g. a "bis"/supplementary recording alongside the main
  class), and an optional `mindMapUrl` pointing at a published mind-map Artifact for
  that lesson. `course.ts` also exports `closingLesson` (the course's closing lecture)
  and `courseMaterials` (the PDFs and extra videos in the notebook that aren't tied to a
  single day); `closingLesson` is no longer rendered by `schedule/page.tsx` (removed
  along with the `companionUrl` per-lesson link) but is left in the data in case it's
  wanted again.
- `src/app/schedule/page.tsx` only renders lessons that have at least one entry in
  `notebookVideos` — days without a saved NotebookLM source (or whole course parts made
  up entirely of such days, unless `alwaysShow` is set) are hidden from the temario. For
  each rendered lesson it shows the `notebookVideos` links and the `mindMapUrl` link, if
  set; it does not render `companionUrl` or `closingLesson`. Each lesson renders as a
  `.lesson-card` article with a `Día N` `.day-badge`; the card gets the `has-mindmap`
  class (a gold left-border accent) when `lesson.mindMapUrl` is set, so mapped days stand
  out at a glance while scanning the temario. `src/app/page.tsx` is the overview/home
  page — besides the course header/materials, it renders a `.mindmap-grid` of cards (one
  per lesson with a `mindMapUrl`, flattened across all `courseParts` and sorted by `day`)
  linking straight out to every published mind map, so new maps just need `mindMapUrl`
  set on their lesson to appear there automatically.
- The site's visual design (home and schedule pages) intentionally mirrors the mind-map
  Artifacts' own look: a cream/ink palette with a gold `--accent`, serif headings
  (`"Iowan Old Style", "Palatino Linotype", Palatino, Georgia`), and card-based layouts.
  The palette lives as CSS custom properties in `src/app/globals.css` (`--bg`,
  `--bg-raised`, `--ink`, `--ink-soft`, `--line`, `--accent`, `--accent-soft`,
  `--accent-ink`), redefined under `@media (prefers-color-scheme: dark)` — there's no
  light/dark toggle, just OS preference. Keep new UI on these pages built from the
  existing token/class vocabulary (`.pill`, `.cta-link`, `.day-badge`, card classes) for
  visual consistency rather than one-off colors, and reuse the same palette instinct if a
  mind map's own gold/citation accent color ever needs to change — the two are meant to
  stay recognizably related.
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
  - **Book reference images**: if the user drops a photo/scan of a figure from the course
    textbook into the repo (an untracked `src/*.png` sitting alongside course.ts, not
    referenced from any component) while a lesson's map is in progress, check it before
    finalizing any diagram that covers the same content — the professor's own book graphic
    with exact figures (e.g. Clase 28's "Gráfico V-2", giving precise before/after profit
    numbers for a saving-shock example) is more authoritative than a synthesized
    illustrative example built from the transcript alone, and should replace or supplement
    it. These images are reference input only, not repo content — leave them
    untracked/uncommitted unless the user says otherwise.
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
  - **Supplementary tables**: when a branch's content is an enumerated classification or
    checklist the professor recaps as a list (e.g. "siete calificaciones jurídicas de...")
    rather than a step-by-step mechanism, use a plain HTML `<table>` instead of forcing it
    into an SVG diagram — add a `.quali-table`-style block (see Clase 26's mind map for the
    reference markup: a `.quali-table-wrap` bordered container, a `<caption>`, and
    `qnum`/`qname` columns) rather than reusing the diagram's SVG vocabulary. It goes in the
    same place as a diagram would: inside that branch's `<div class="notes-field">`, right
    after the `<textarea>`, wrapped in its own `<figure>` with a `<figcaption>`.
- `streamlit_app/sources.py` holds a static, hand-maintained copy of the notebook's
  source list (id + title) pulled via `notebook_get`; `streamlit_app/app.py` renders it
  as a searchable/filterable table. Regenerate `sources.py` by re-running `notebook_get`
  on the notebook id above and updating the list by hand — it does not call the
  NotebookLM API at runtime.
