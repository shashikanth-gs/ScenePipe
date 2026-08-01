# scenepipe — agent brief

This project turns source material (an article, a URL, a topic, a directory
of notes) into branded social media content — reels, carousels, stories,
posts — for the platforms enabled in `scenepipe.config.json`.

## Current scope (be honest with the user about this)

Two treatments exist today: `comparison` (two concepts, one extends the
other) and `weather-report` (linear "current state of X" update — intro,
current conditions, short forecast, closing tip). Both render to
**Instagram reels only**. Carousel/story/post asset types are declared in
`scenepipe.config.json` as the intended surface area, but have no registered
treatment or render path yet — `templates/registry.ts` is the source of
truth for what's actually buildable right now. If the strategy step decides
a carousel would suit the source well, say so explicitly and note it's not
implemented yet, rather than quietly only producing the reel.

Your job here is narrow, on purpose: **decide what to make and write what
gets said.** You never touch rendering, config, brand assets, or Remotion
code. Everything mechanical (voice synthesis, captions, video rendering) is
already built and runs deterministically via `scripts/render.mjs` — you don't
write code, you don't call it, you don't need to know how it works.

## The workflow, end to end

1. **Read `brand/BRAND.md`** — the brand's voice, tone, audience, and rules.
   This is not optional context, it's the spec for every decision below.
2. **Read `scenepipe.config.json`** — which platforms/asset types are
   enabled, and whether `strategy.mode` is `"auto"` (you decide the mix) or
   `"fixed"` (generate one of everything enabled).
3. **Read the source material** the user gave you (article text, a URL to
   fetch, a file/directory path).
4. Run the **`scenepipe-strategy`** skill to decide what to produce.
5. For each planned artifact, run the matching **`scenepipe-author-<treatment>`**
   skill to write its `content/<slug>/content-model.json`.
6. Tell the user the render will pick up automatically (or run
   `npm run render <slug>` yourself if asked to) — do not attempt to invoke
   Remotion, ffmpeg, or any TTS provider directly.

## Hard boundaries — never do these

- Never edit anything under `scripts/`, `templates/*/scenes.tsx`,
  `templates/*/index.tsx`, `src/Root.tsx`, `remotion.config.ts`, or
  `scenepipe.config.json`. These are deterministic, human-reviewed, and
  version-controlled on purpose.
- Never invent a new visual treatment. Pick one from
  `templates/registry.ts`'s finite list. If nothing fits well, say so
  explicitly in your response instead of forcing a mismatched treatment —
  that's a signal for a human to hand-author a new treatment, not something
  you solve at runtime.
- Never write narration into the `text`/label fields or vice versa — a
  treatment's on-screen text and its spoken narration are different fields
  for a reason (captions come from the narration, not the labels).
- Never pad content to fill a format. If the source material only supports
  one solid artifact, produce one — say so rather than manufacturing filler
  for formats that don't fit.

## Content model validation

Every `content-model.json` you write gets schema-validated by
`scripts/render.mjs` before anything renders — an invalid or incomplete file
fails loudly rather than silently producing a broken asset. See each
treatment's `contentModel.schema.mjs` for the exact required shape, and its
`example.content-model.json` for a filled-in reference.

## Status

Each job's `content/<slug>/status.json` is written by the deterministic
render step, not by you — don't create or edit it yourself.
