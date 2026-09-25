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
don't assume Clase N ≈ Día N, and don't assume a video finishes the topic it starts.

**Standing rule (user decision, 2026-09-25): the transcript leads, not the printed
temario.** Don't ask how to resolve a mismatch anymore: keep the naive Clase N ≈ Día N
pairing and write that Día's `title`/`topics` (and its mind map) purely from what the
video actually teaches, ignoring the printed "temario completo" description. Mind maps
don't need a "Nota sobre la numeración" callout comparing against the printed programme.
The case-by-case history below records how earlier mismatches were handled before this
rule existed; it's background, not a procedure to repeat.

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

Clase 32 is a different kind of mismatch again: its content doesn't lag by one day, it
skips a day entirely — the video never touches Día 32's printed topic (propuesta de
reforma bancaria, coeficiente de caja del 100%) at all. Instead it covers Día 33's topic
(el precio de los factores de producción, VDPM, trabajo y salarios, crítica a la
legislación laboral) start to finish, plus part of Día 34's material (revolución
industrial, factor tierra). The user's resolution this time was the third option: keep
the naive Clase 32 ≈ Día 32 numbering, but rewrite Día 32's `title`/`topics` in
`course.ts` to describe what the video actually teaches, dropping the old "reforma
bancaria" text rather than trying to relocate it elsewhere. Worth checking Día 33's own
video, whenever it turns up, in case its content has similarly shifted forward.

Día 33's video (Clase 33) confirmed that suspicion, and pushed the skip one step further.
It opens with the professor explicitly recapping what Clase 32 already covered (VDPM,
factor trabajo, revolución industrial, factor tierra) and then says "ahora vamos a dar un
paso más" — never touching Día 33's own printed topic at all. Instead it covers two
institutional topics: (1) externalidades positivas y negativas, argued as a failure of
undefined/undefended property rights rather than a market failure (pollution, tragedy of
the commons, public goods/free-rider, solved via privatization — lighthouses, barbed
wire, private game reserves) — the back half of Día 34's own topic list ("Externalidades");
and (2) the full Ley-en-sentido-material vs. mandato distinction (abstract general rules
vs. specific commands, spontaneous vs. hierarchical order, peace vs. conflict, traditional
justice vs. "justicia social", sociedad abierta vs. cerrada) — a near-exact match for all
of Día 35's topic. The user's resolution followed the same pattern as Clase 32: keep the
naive Clase 33 ≈ Día 33 numbering, but rewrite Día 33's `title`/`topics` in `course.ts` to
describe what the video actually teaches (externalidades + ley vs. mandato), dropping the
old VDPM/salarios text since Clase 32 already fully covers that. Día 34 and Día 35 still
have no `notebookVideos` of their own and their printed topics haven't been touched, so
their own future videos (whenever found) may well cover less than their titles promise,
or overlap with what Clase 33 already taught — check each on its own terms as usual.

Clase 34 pushed the skip further still — not by one day this time, but by two. Its
content doesn't touch Día 34's printed topic (Historia y política: beneficios de la
Revolución Industrial, el odio al capitalismo, factor tierra) at all; instead it's a
clean, complete lecture matching Día 36's own topic ("El socialismo") almost word for
word: redefining socialism/estatismo as institutional aggression against the free
exercise of the entrepreneurial function, the four reasons the socialist ideal is
scientifically impossible (information volume, the tacit/non-articulable nature of
entrepreneurial knowledge, its continuous change, and coercion itself blocking the
information the planner needs — the "paradoja del estatismo"), and the consequences
(social discoordination, corruption, degraded law/justice). The professor explicitly
defers "los diferentes tipos de socialismo" (Día 37's territory) to the next class, so
it doesn't bleed forward. The user's resolution this time was the same pattern as Clase
32/33 — keep the naive Clase 34 ≈ Día 34 numbering, but rewrite Día 34's `title`/`topics`
in `course.ts` to describe what the video actually teaches — even though this leaves
Día 34 and Día 36 carrying near-duplicate "why socialism can't work" content until
Día 36 gets its own video (whenever that surfaces, check it on its own terms too, same
as always).

Clase 34's own prediction held: Clase 35 delivers exactly the "diferentes tipos de
socialismo" lecture it deferred, confirming the skip pattern lands on Día 37's printed
topic rather than Día 35's own (already fully covered by Clase 33's ley-vs-mandato
material). After a brief opening Q&A on the 100%-reserve banking reform, the professor
explicitly announces "vamos a explicar los diferentes tipos o clases de socialismo" and
delivers a full taxonomy: socialismo real/soviético (with the China/Chicago
commodities-market anecdote), socialdemocracia, socialismo cientificista/ingeniería
social, socialismo cristiano-solidario and teología de la liberación, and socialismo
sindicalista (Yugoslavia) — then closes with a retrospective on how his own definition
of socialism evolved (Mises's static property-based definition → Hoppe's dynamic
aggression-against-property-rights definition → his own aggression-against-the-
entrepreneurial-function redefinition). The user's resolution was the same pattern as
Clase 32/33/34: keep the naive Clase 35 ≈ Día 35 numbering, but rewrite Día 35's
`title`/`topics` in `course.ts` to describe what the video actually teaches, dropping the
old "leyes, mandatos y orden social" text since Clase 33 already covers it. Día 37 keeps
its own "Diferentes clases de socialismo" title/topics untouched and still has no
`notebookVideos` of its own — its future video, whenever found, may well cover
something else entirely by this point, so check it fresh rather than assuming the skip
pattern continues at the same offset.

Clase 36 broke the naive-numbering pattern in a new way: not a content drift within the
same course "Parte", but a jump to an entirely different, later official part. It opens
with the professor explicitly announcing "hoy comenzamos una parte nueva... dedicada al
mercado intervenido" — i.e. it's the opening lecture of "Sexta Parte: El Mercado
Intervenido", not Día 36's own printed topic ("El socialismo", which belongs to "Quinta
Parte: La Cooperación Social en Ausencia del Mercado" and was already fully covered by
Clase 34/35's content). The lecture covers, in order: a unified definition of
intervencionismo as a partial manifestation of estatismo (every coercive measure is
self-frustrating; interventionism is inherently unstable); direct intervention in
consumption (drug/alcohol prohibition, black markets, mafias, blocked social learning) —
matching Día 37's own topic; the corruption interventionism generates, both
institutionally and in individual behavior; fiscal interventionism (which taxes are most
harmful, Reagan/Thatcher tax cuts); restrictionism (tariffs/protectionism, minimum wage);
and a brief teaser on maximum/minimum price controls "para el jueves" — this middle and
tail material matches Día 39's topics almost exactly ("Intervencionismo fiscal y
restricción de la producción (aranceles). Intervención de precios"), effectively
skipping over Día 38 (an unnumbered, off-syllabus "Conferencia fuera del programa" day).
Given the content belongs structurally to a different, later "Parte" than the one Día 36
sits in, the user's resolution this time went a step further than the title/topics-only
rewrites used for Clase 32-35: keep the naive Clase 36 ≈ Día 36 day-number pairing, but
physically move that lesson entry out of "Quinta Parte" (now left with an empty
`lessons: []`, so its heading is hidden from the temario like any other video-less
section) into "Sexta Parte: El Mercado Intervenido", positioned before Día 37, with
`title`/`topics` rewritten to describe the actual intervencionismo content. Worth
checking whatever video eventually surfaces for Día 37 (and Día 39) on its own terms,
since this class already covers a good chunk of both.

Clase 37 confirmed the first half of that prediction: it's the direct continuation of
the price-controls teaser Clase 36 ended on, and never touches Día 37's own printed
topic ("Diferentes clases de socialismo," already fully covered by Clase 35). The whole
class is one extended treatment of precios máximos y mínimos — the same mechanism from
both directions (a ceiling favoring consumers, a floor favoring producers), the static
shortage/surplus effects and the ad-hoc allocation systems a price ceiling provokes
(queues, rationing cards, favoritism, violence), the Austrian dynamic argument that free
prices are what mobilize entrepreneurial adaptation on both sides of the market, and a
run of historical illustrations (postwar Spain's rationing and black market, the fall of
Rome, Erhard's 1948 abolition of price controls in Germany, EU agricultural surpluses,
Spanish rent control, Venezuela). That content is really the tail of Día 39's own topic
list ("Intervención de precios (máximos y mínimos)"), not Día 37's — the same kind of
forward skip as Clase 32-36. The user's resolution was the same pattern as those: keep
the naive Clase 37 ≈ Día 37 numbering, but rewrite Día 37's `title`/`topics` in
`course.ts` to describe what the video actually teaches, dropping the old "socialismo"
text since Clase 35 already covers it. Día 39 keeps its own topic list untouched and
still has no `notebookVideos` of its own — check its future video fresh, same as always,
since this class already covers most of what it promises.

Clase 38 exposed a different kind of problem: Día 38 wasn't a content-drift mismatch at
all, it was a placeholder ("Conferencia fuera del programa del curso") that had never
actually been checked against a transcript, and turned out to be wrong — the video is a
real, on-programme lecture, not an off-syllabus extra like Día 41. Its content (a quick
recap of the intervention measures already covered, then sindicalismo y corporativismo,
relaciones internacionales/proteccionismo, a brief note on economía de guerra, ayuda a
países subdesarrollados y la política del hambre, and an extended treatment of the
Public Choice critique of democracy) matches Día 40's own topic list almost exactly,
short of Crisis de la Seguridad Social and economía española, which the professor
explicitly defers to the next class. Given the choice between moving the lesson
structurally into Séptima Parte (the Clase 36 pattern) or rewriting it in place, the
user chose to keep it simple: Día 38 stays at its naive position in Sexta Parte, with
`title`/`topics` rewritten from the transcript rather than left as an unverified
placeholder. Día 39 and Día 40 keep their own topic lists untouched and still have no
`notebookVideos` of their own — both are likely to arrive further preempted than usual
once their own videos surface, so check each on its own terms as always.

Clase 39 confirmed that prediction and, like Día 38 before it, exposed that Día 39's own
placeholder ("De la corrupción", with aranceles/precios topics already covered by earlier
classes) had never actually been checked against a transcript either. The video opens with
the professor's roadmap for the rest of the course, then explicitly frames the day's content
as closing the intervencionismo block with the public pension system (tema 60, Seguridad
Social) as the chosen case study — one of the Estado del Bienestar's three "legs" (pensiones,
educación, sanidad) — followed by closing conclusions on intervencionismo itself (tema 61).
It covers the technical problems of the reparto/pay-as-you-go system (false substitute for
saving, the aging population and falling birth rate collapsing the worker-to-retiree ratio
from 6:1 in 1964 to 2:1 today, the fiction that employers pay part of the contribution when
workers bear it entirely, and an actuarial imbalance the professor explicitly likens to a
pyramid scheme), the ethical problems (a fictitious "social contract," no real guarantees,
outdated Bismarckian paternalism), his reform proposal (splitting social assistance from
genuine retirement saving, moving to a capitalization system as Chile and the UK did,
funding the transition via his 100%-reserve banking reform), and closes with Mises's
conclusion that interventionism is inherently unstable — tending toward full socialism or a
course correction like Argentina's — plus an extended reflection on why the public doesn't
revolt despite the evidence. None of this is Día 39's placeholder topic, but it does belong
structurally where Día 39 already sits (Sexta Parte, as the closing lecture on
intervencionismo), so the resolution followed the Clase 38 pattern: keep the naive Clase 39
≈ Día 39 numbering, rewrite Día 39's `title`/`topics` in `course.ts` from the transcript.
Día 40 (Séptima Parte) keeps its own topic list untouched and still has no `notebookVideos`
of its own, and its "Crisis de la Seguridad Social" topic is now mostly already covered by
Clase 39 — check its future video fresh, same as always, since it may well be preempted
further still.

Clase 40 confirmed that Día 40's placeholder was wrong too, in the same way Día 38 and
39's turned out to be before their own videos arrived. The video never touches Día 40's
printed topic (sindicalismo y corporativismo, Public Choice) at all; instead the
professor opens by explicitly naming the day's three textbook temas — 65 (la economía
española), 66 (la Unión Europea) and 67 (teoría económica del nacionalismo y la
inmigración) — and closes by starting, but deliberately not finishing, the critique of
the Marxist/Rodbertus theory of exploitation, promising the full demolition "el jueves".
Content-wise this lines up almost exactly with Día 42's own topic list (Unión Europea,
nacionalismo/inmigración, crítica de la teoría de la explotación), skipping clean over
Día 40 and Día 41 — the same kind of forward skip as Clase 32-39, just a bigger jump.
The user's resolution was the same pattern as those: keep the naive Clase 40 ≈ Día 40
numbering, but rewrite Día 40's `title`/`topics` in `course.ts` to describe what the
video actually teaches (historia y apertura de la economía española, origen liberal y
deriva intervencionista de la Unión Europea, los cuatro principios del nacionalismo
liberal, e introducción a la crítica de la teoría de la explotación), dropping the old
sindicalismo/Public Choice text since Clase 38 already covers that ground. Día 41 (still
the unverified "Conferencia no incluida en el programa" placeholder) and Día 42 (whose
own topic list is now mostly already covered by Clase 40) both still have no
`notebookVideos` of their own — check each fresh against its own future video, same as
always, since either may turn out preempted or mislabeled in turn.

Clase 41 first got misidentified because of a tooling mistake, not a content mismatch —
worth recording since it's a trap the same command shape will spring again. When hunting
for its source in the notebook, a first pass piped `nlm source list <id> --json` through
`grep -i "41"` and eyeballed which `"id"` line sat next to which `"title"` line in the
filtered output. That's unsound: grep drops every non-matching line, so two lines that
end up adjacent in the output can belong to two different JSON objects whose *own*
matching substrings just happened to appear nearby (e.g. an id like
`...b141-ba0a2f727c94` matches `"41"` by coincidence, via the `b141` substring, with no
relation to Día 41 at all). That pairing pointed at a source whose real title, confirmed
only by looking it up individually with `nlm source get <id> --json`, was Día 35's own
video — so the first mind map built for "Clase 41" was actually built from Día 35's own
transcript, which is exactly why it looked like a word-for-word duplicate of Día 35 (it
was reading Día 35). The fix: always parse `nlm source list --json` as JSON (e.g. via a
small Node script) and filter/match on the parsed `title` field, never by grepping raw
multi-line JSON text and assuming adjacent matching lines share an object.

The real Clase 41 source (id `59d395c8-3c73-4f08-a929-3ed9453f6d9c`) turned out to match
exactly what Clase 40 had promised for "el jueves": it closes the critique of Rodbertus's
refined exploitation theory with four arguments, from least to most decisive — a circular-
reasoning objection (what determines the value of the labor itself?), the existence of
economic goods (natural resources) that aren't purely a product of labor (illustrated with
two otherwise-identical wines whose price differs tenfold purely from aging time), the
subjective (not objective/intrinsic) nature of value, and the definitive argument: because
production takes time, paying a worker today the full undiscounted value of what they will
produce once the process matures would be *overpaying* them, not exploiting them — which is
exactly why almost nobody voluntarily chooses to found a cooperative and wait instead of
taking an immediate wage. It then walks through Marx's own "innovations" on top of
Rodbertus — Hegelian dialectical dressing, narrowing the scope to "mercancías" to dodge the
natural-resources objection, an appeal to Aristotle to claim exchange implies equality
(when exchange is actually driven by unequal subjective valuations on both sides), the
concept of plusvalía via unpaid extra hours (feeding the modern labor movement's push for
shorter hours), polilogismo (dismissing any critic's argument as invalid because of their
class, race, or other identity — including Mises's rebuttal and the irony of Marx's own
bourgeois background), and the claimed historical inevitability of socialism and of capital
concentration — and closes with the acknowledged failure of Das Kapital's third volume
(where the theory's own defenders resorted to "differences cancel out in aggregate," an
absurdity even fellow socialists like Sombart and Bernstein conceded), recommending Juan
Ramón Rallo's El Antimarx for further reading. `course.ts`'s Día 41 `title`/`topics` (and
the mind map) have been rebuilt from this correct transcript; the earlier "grabación
adicional, duplicado de la Clase 35" text was wrong and has been discarded entirely, not
kept as a documented caveat.

Clase 42 turned out not to be a syllabus lecture at all: the transcript opens with "vamos
a comenzar la clase, la última clase del curso" and its second half is explicitly the
professor's traditional closing lecture — the "10 consejos para tener éxito en la vida"
he has delivered at the end of every course since 1984, already represented in the data by
the separate, currently-unrendered `closingLesson` export (`{title: "Clase de Clausura",
topics: "10 Consejos para tener éxito en la vida."}`). It shares nothing with Día 42's own
printed topic (La Unión Europea), which is unrelated and still open. Given the choice
between wiring the video into `closingLesson` (and reviving its rendering on the schedule
page) or keeping the naive Clase 42 ≈ Día 42 numbering with rewritten text, the user chose
the latter, consistent with every other class so far: `course.ts`'s Día 42 `title`/`topics`
were rewritten from the transcript to describe the ten consejos (entusiasmo, constancia,
excelencia, no preocuparse indebidamente, aprender inglés, mantenerse informado, equilibrar
familia/profesión/cultura, la función empresarial, el espíritu crítico y ir siempre a
contracorriente, y el comportamiento ético), dropping the old "La Unión Europea" text
entirely — that topic (already mostly covered by Clase 40, per the note above) has no
video of its own yet and remains unplaced in the syllabus. The `closingLesson` export
itself was left untouched, still unrendered, still waiting for whatever future resolution
the user picks if this situation is revisited.

Clase 4 showed that the "Clase N" vs "Día N" drift isn't confined to the later parts of
the course — this is the first time the gotcha turned up this early, and it had simply
never been checked before (Día 4's video had been in the data since early on, but nobody
had read its transcript against the printed topic). It never touches Día 4's own printed
topic (tiempo, sorpresa, serendipidad, coste, racionalidad, acción humana como axioma) at
all; instead it defines the entrepreneurial function operatively as an innate alertness to
profit opportunities (Kirzner's "alertness," the especulador/atalaya metaphor) and then
develops, in full, Día 5's own topic — "el conocimiento empresarial es ante todo un
conocimiento subjetivo, práctico y no científico," illustrated with examples (learning to
ride a bicycle, learning a language, Picasso, the TV economist who can't actually predict
GDP) — while lightly previewing, but explicitly not developing ("ya lo veremos"), Día 6's
own topic (el carácter tácito y no articulable, y la idea de Hayek del conocimiento
disperso). Same pattern as Clases 32-42: the user chose to keep the naive Clase 4 ≈ Día 4
numbering, rewriting Día 4's `title`/`topics` in `course.ts` to describe what the video
actually teaches, dropping the old tiempo/sorpresa/coste/racionalidad text entirely. Worth
treating this as a reminder to check early-course days on their own terms too, rather than
assuming the gotcha only applies from wherever it was first noticed onward — Días 5 and 6
in particular may turn out partially preempted by this video when their own transcripts
(if a separate video exists for each) are eventually checked.

That prediction held immediately: Clase 5 opens by explicitly recapping what Clase 4
already taught (subjetivo, práctico — the same grandfather anecdote, the same bicycle/
Velázquez/ligar examples), and then develops, in full, exactly what Día 6's printed topic
promises: privativo and disperso (Hayek), tácito y no articulable (Polanyi, with examples
from language and moral norms to scientific discovery), and the three effects of the
entrepreneurial act (creación, transmisión — prices as compressed signals — and
coordinación), ending mid-sentence on "coordinación" where the class runs out of time.
Nothing in it is specific to Día 5's own ground beyond the opening recap. Same resolution
as Día 4: the user chose to keep the naive Clase 5 ≈ Día 5 numbering, rewriting Día 5's
`title`/`topics` in `course.ts` to describe the recap-plus-privativo/disperso/tácito/tres-
efectos content, even though this now duplicates Día 6's own (still separately unverified)
topic list almost exactly. Note that Día 6 already has its own `notebookVideos` entry
("Clase 06: Creatividad Empresarial y la Sociedad") that has never been checked against its
transcript — given the lag pattern here, it likely covers something further ahead than its
own printed topic (maybe Día 7's ground, or beyond); check it fresh on its own terms,
same as always, rather than assuming it actually delivers Día 6's topic just because the
title sounds plausible.

Clase 6 confirmed it: the professor opens by announcing he'll "terminar hoy el tema dos"
and, after a student question on monopoly (deferred to the end of the course, with a nod
to Armentano), runs through exactly Día 7's printed topic list — arbitraje y especulación,
competencia (competitio; the "Big Bang social empresarial" that never stops, illustrated
with IBM and the personal computer), división del conocimiento (not "del trabajo":
specialization, population growth as the condition for prosperity, Hayek's "pocos y
pobres o muchos y ricos", Julian Simon's bet, the 1890s horse-manure panic), creatividad
versus maximización (physics-style maximization, homo economicus, Robbins), and the
concepto de sociedad as a spontaneous, highly complex process of human interaction. Only
Día 7's "derecho, dinero y cálculo económico" and "ubicuidad" items don't appear. Same
resolution as Días 4 and 5: keep Clase 6 ≈ Día 6, rewrite Día 6's `title`/`topics` from
the transcript. Día 7's own video ("Clase 07: Dualismo Metodológico y Complejidad Social")
by its title already sounds like Día 8's epistemology ground — check it fresh.

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
    scratch, since maps may already carry hand-authored content or a notes feature. The
    fetched HTML is the *served* page, not the authored source: it's wrapped in an
    injected `<!-- frame-runtime -->` preamble script plus `<html>/<head>/<body>` tags
    that the Artifact viewer adds at serve time. Before editing or republishing, slice out
    only the authored content — from the `<title>` tag through the trailing notes
    `<script>…</script>` block — since the `Artifact` tool wraps whatever file you publish
    in its own `<!doctype html>…<body>` skeleton; republishing the fetched HTML verbatim
    would double-wrap it.
  - Every map also carries a "Tus notas, rama por rama" section: one `<textarea>` per
    branch (not per individual leaf node), auto-saved to `localStorage` under a
    `economia-clase{N}-mindmap-notes-` prefix (see any existing mind map's trailing
    `<script>` for the exact snippet — it's copied verbatim across lessons, just swapping
    the storage prefix and branch keys). When the user asks for "more context" on text
    quoted from a specific leaf node (or pastes a timestamped transcript excerpt, e.g.
    `26:56 ... 27:08`), don't resize the main SVG map — re-pull that lesson's transcript,
    find the fuller passage the quote is drawn from, and extend *that node's parent
    branch's* shared textarea instead: append a new numbered point (renumbering the rest)
    grounded in what the transcript actually says, and add or extend that branch's
    supplementary diagram if the new content is numeric/mechanistic enough to warrant one.
    If the user supplies a video timestamp, cite it inline in the note text as
    `(min. MM:SS-MM:SS)`, the same way book citations cite a page number — it's a second,
    independent precision anchor alongside `página N` citations, not a replacement.
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
