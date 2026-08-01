# scenepipe

Bootstrap a brand-consistent, AI-authored, deterministically-rendered social
media content pipeline in one command.

```bash
npx scenepipe --claude
```

Give it an article, a URL, a topic, or a directory of notes; get back
branded reels, carousels, stories, and posts — narrated, captioned, on your
colors and fonts, without re-deriving Remotion setup, TTS plumbing, or
Instagram format conventions every time.

## Philosophy

- **The AI decides what to say and how to shape it. It never touches
  rendering, brand assets, or config.** Strategy and copy are agent-authored
  (via Claude Code, driven by versioned `AGENTS.md`/`SKILL.md` files);
  everything mechanical — voice synthesis, captioning, video rendering — is
  deterministic code that ships with the scaffold.
- **A finite, human-reviewed treatment + style library, not AI-generated
  code.** The agent picks a treatment (a content shape, e.g. `comparison`)
  and a visual style (e.g. `cinematic`, `kinetic-typography`) — it never
  writes new rendering components at runtime. Growing the library is a
  deliberate, reviewed, offline activity. **There is no plain/centered
  fallback style** — every style in the library has to clear the bar in
  `skills/scenepipe-visual-standards/SKILL.md` (asymmetric layout, real
  scene transitions, generated graphics, brand-kit-driven, some texture) or
  it doesn't get added.
- **Every treatment and every visual style is its own portable skill.**
  `skills/<name>/SKILL.md` bundles both the authoring instructions the AI
  reads *and* the Remotion component code that renders it, following the
  [skills.sh](https://skills.sh) spec (`skills/<name>/SKILL.md` +
  supporting files) — the same one `npx skills add <owner>/<repo>` and
  `remotion skills add` already use. `.claude/skills/*` are symlinks into
  this canonical `skills/` directory, so the same package works for Claude
  Code today and any other agent tool (Cursor, Codex, etc.) that speaks the
  same convention, with no duplication.
- **Everything ships with working defaults.** `npx scenepipe --claude` gets
  you a project that renders a real demo video immediately
  (`npm run dev`) — placeholder brand colors, on-device TTS, one working
  treatment. Customizing brand/voice/logo is optional, done after the fact.
- **Structured progress, not a black box.** Every job writes
  `content/<slug>/status.json` at each phase (`queued` → `validating` →
  `synthesizing-audio` → `computing-timings` → `rendering` → `done`/`error`)
  so a dashboard app can show what's actually happening.

## Quickstart

```bash
npx scenepipe --claude my-brand-content
cd my-brand-content
npm run dev          # Remotion Studio — see the demo reel render immediately
```

Then, before your first real job:
1. Edit `brand/BRAND.md` — your actual voice, tone, audience, rules. Read by
   the strategy skill on every run.
2. Edit `brand/brand-kit.json` — colors, fonts. Then **place your actual
   logo files in `public/brand/logo/`** (matching the paths in
   `brand-kit.json`'s `logo` field — `mark.svg` and `wordmark.svg` by
   default; the scaffold ships placeholders there so the demo renders, but
   they aren't your brand).
3. If you picked a paid voice provider during setup, its API key already
   went into `.env` for you — check there first. If you left it blank (or
   ran `--yes`), copy `.env.example` to `.env` and fill it in yourself; see
   `scripts/voice/README.md`. `macos-say` (the default) needs nothing here.
4. Review `scenepipe.config.json` — which platforms/asset types are enabled,
   and your voice provider + fallback chain.
5. Open Claude Code (`claude`) or Codex (`codex`) in the project — either
   already knows the workflow via the root `AGENTS.md` and `.claude/skills/`
   / `.codex/skills/`. Give it a topic or point it at an article.

## Choosing a visual style

The strategy/authoring skills pick a style automatically (each treatment
defaults to `cinematic`), but you can force one yourself by setting
`visualStyle` in a job's `content-model.json`:

| Treatment | Style | Best for |
|---|---|---|
| `comparison` | `cinematic` (default) | General explainer content — the safe, editorial-clean choice |
| `comparison` | `kinetic-typography` | Short, punchy, high-energy content with no need for a supporting diagram |
| `comparison` | `glitch-tape` | Raw/unpolished-on-purpose brand voice, or content about something breaking/failing |
| `weather-report` | `cinematic` (default) | Illustrated, "postcard" feel |
| `weather-report` | `data-infographic` | Numbers-heavy content where the figures themselves are the story |

Each style's own `skills/scenepipe-<treatment>-<style>/SKILL.md` has the
full detail (exactly what it looks like, what it needs from your content) —
this table is just the map to get you to the right one.

## Architecture

```
source material
     │
     ▼
scenepipe-strategy skill (agent)     → content/<slug>/plan.json
     │  decides which (platform, assetType, treatment) artifacts to make,
     │  scoped by scenepipe.config.json + brand/BRAND.md
     ▼
scenepipe-author-<treatment> skill   → content/<slug>/content-model.json
     │  (agent)  fills narration + on-screen copy for one treatment's schema,
     │  picks a visualStyle from that treatment's style skills (or the default)
     ▼
scripts/render.mjs (deterministic, no AI)
     │  1. validates content-model.json against the treatment's zod schema
     │  2. scripts/voice/ → narration audio + word-level captions
     │     (provider-agnostic: macos-say / ElevenLabs / Sarvam / Azure /
     │      Google, always falling back to on-device Whisper for captions)
     │  3. computes exact scene frame boundaries from real caption timing
     │  4. renders the matching Remotion composition
     │  5. writes content/<slug>/status.json at every phase
     ▼
content/<slug>/output/<platform>/<assetType>/<slug>.mp4
```

## Current scope

Honesty over marketing: this is a working v0, not a finished product.

- **Two treatments ship today**: `comparison` (two concepts, one extends the
  other) and `weather-report` (a linear "current state of X" update). Both
  render to **Instagram reels** only. Carousel/story/post are declared in
  `scenepipe.config.json` as the intended surface area but have no registered
  treatment/render path yet.
- **Five visual styles ship today, all meeting the same bar** (see
  `skills/scenepipe-visual-standards/SKILL.md`) — no plain/centered fallback
  exists anywhere:
  - `comparison`: `cinematic` (default — full-bleed asymmetric color-block
    scenes, generated node/loop/path graphics), `kinetic-typography`
    (frame-filling punch-in type, no cards/graphics), `glitch-tape`
    (chromatic aberration, scan lines, deterministic tracking-error glitches).
  - `weather-report`: `cinematic` (default — illustrated condition icons;
    honestly, its `Intro`/`Current` scenes are still center-composed rather
    than fully asymmetric, see that skill's own SKILL.md for the tradeoff),
    `data-infographic` (animated counters, bar gauges, a real bar chart for
    the forecast — fully asymmetric from the start).
- **Not yet published anywhere.** The `skills/` directory is structured to
  the skills.sh spec but lives only in this repo/scaffold for now — `npx
  skills add` against it doesn't work until it's pushed to a public repo.
- **Voice providers**: `macos-say` (on-device) and the Whisper caption
  fallback are implemented and tested end-to-end. ElevenLabs, Sarvam, Azure,
  and Google providers are implemented against each vendor's documented API
  shape but not exercised against live credentials — verify before
  production use.
- **No publishing/scheduling.** The pipeline stops at rendered files in
  `content/<slug>/output/`. Posting to Instagram is out of scope for now.
- **No dashboard app yet** — `status.json` is written in a shape meant to be
  read by one, but the reading/watching side doesn't exist yet.
- **Codex support is planned but not implemented** — today, `.claude/` is the
  only agent-tool integration; the portable parts of the brief live in
  `AGENTS.md` so a Codex integration can reuse it later.

## Adding a new treatment (a new content shape)

1. `templates/<name>/schema.ts` — the Remotion props shape (zod), including
   a `visualStyle` enum with at least one option.
2. `templates/<name>/styleTypes.ts` — the shared `<Name>ScenesProps` shape
   every style for this treatment implements (`{ content, durations,
   transitionLength }`).
3. `templates/<name>/contentModel.schema.mjs` — the shape the AI is allowed
   to write, plus `narrationBeats()` and `toTreatmentProps()`.
4. `templates/<name>/index.tsx` — the style dispatcher: computes shared
   timing (`compensateForTransitions`), picks a style component by
   `visualStyle`, wraps it with `Audio`/`CaptionsOverlay`/`Grain`/`Chrome`.
5. `templates/<name>/example.content-model.json` — a filled reference.
6. At least one style skill (see below) — a treatment with zero styles can't
   render anything.
7. Register it in `templates/registry.ts`, `scripts/render.mjs`'s
   `COMPOSITION_IDS`, and add a `.claude/skills/scenepipe-author-<name>/SKILL.md`.

## Adding a new visual style (for an existing treatment)

1. `skills/scenepipe-<treatment>-<style>/component.tsx` — the actual
   Remotion scenes, exporting one `<Treatment>Scenes` component matching
   that treatment's `styleTypes.ts` shape. Read
   `skills/scenepipe-visual-standards/SKILL.md` first — every style must
   clear that bar, no exceptions.
2. `skills/scenepipe-<treatment>-<style>/SKILL.md` — when to pick this style
   over the treatment's others, what it looks like, any style-specific
   authoring guidance.
3. Symlink it: `.claude/skills/scenepipe-<treatment>-<style> ->
   ../../skills/scenepipe-<treatment>-<style>` (matches what the real `npx
   skills add`/`remotion skills add` tools produce — verified against the
   actual output of `remotion skills add`, including the
   `verbatimSymlinks: true` fix needed so the scaffolding CLI's `fs.cp`
   doesn't rewrite these into absolute paths pointing at this package's own
   directory instead of the new project's copy).
4. Add the style name to that treatment's `schema.ts` and
   `contentModel.schema.mjs` `visualStyle` enums, and register the component
   in the treatment's `index.tsx` dispatcher map.
5. Render stills across the full timeline and check for layout collisions
   (captions overlap is the most common one) before considering it done.

Both are intentionally manual — the whole point is that the AI never does
this step itself, it only ever picks a treatment + style by name and fills
in content.

## Repo layout

- `bin/`, `src/` — the `scenepipe` CLI itself (scaffolding logic).
- `template/` — what gets copied into a new project by `npx scenepipe`.
  - `template/skills/<name>/` — canonical skill packages (skills.sh spec):
    `scenepipe-strategy`, `scenepipe-author-<treatment>`,
    `scenepipe-visual-standards`, and `scenepipe-<treatment>-<style>` per
    style. Each style skill bundles its `SKILL.md` + `component.tsx`.
  - `template/.claude/skills/*` — symlinks into the above, so Claude Code
    auto-discovers them with no duplication.
  - `template/templates/<treatment>/` — the treatment's schema, content-model
    validation, and style dispatcher (`index.tsx`). No rendering code lives
    here directly anymore — that's all in the style skills.
  - `template/src/` — shared, brand-agnostic infra used by every style:
    `Chrome.tsx` (logo/timecode/scrubber), `Grain.tsx`, `graphics.tsx`
    (generated vector primitives), `transitionTiming.ts`, `Logo.tsx`,
    `theme.ts`, `fonts.ts`.
