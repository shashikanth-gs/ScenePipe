---
name: scenepipe-comparison-cinematic
description: The default visual style for the "comparison" treatment — full-bleed asymmetric color-block scenes, generated node/loop/path graphics, real TransitionSeries cuts, brand chrome
metadata:
  tags: visual-style, comparison-treatment, cinematic, scenepipe
---

# Style: comparison / cinematic

Read `scenepipe-visual-standards` first — everything there applies here.
This is the **default** style for the `comparison` treatment (`visualStyle:
"cinematic"` or the field omitted entirely). Pick a different comparison
style only when the content or brand voice specifically calls for it (see
`scenepipe-comparison-kinetic-typography` and `scenepipe-comparison-glitch-tape`).

## What this style looks like

- Eight scenes: a silent cold-open title card, then one scene per narration
  beat (hook, conceptA, limitation, conceptB, analogy, closer), then a
  silent outro lockup.
- Each scene is a full-bleed solid color block (alternating brand primary /
  secondary / background / text tokens) with the headline left-aligned in
  one zone and a generated graphic occupying an opposite zone — never both
  centered on top of each other.
- Scene cuts are real `TransitionSeries` blends (slide/wipe/fade, alternated
  for rhythm), not hard swaps.
- A cold open (title card, ~1.5s) plays before narration starts, and a
  longer outro (~3s, logo lockup + CTA) plays after it ends — both silent,
  padding beyond the raw narration timing.

## Authoring implications (for scenepipe-author-comparison)

None beyond the treatment's normal rules — this style renders the exact same
content-model fields as every other comparison style. Nothing about
`hook`/`conceptA`/`limitation`/`conceptB`/`analogy`/`closer` changes because
of the chosen style.

## Implementation notes

- `component.tsx` in this folder exports `ColdOpen`, `CinematicHook`,
  `CinematicConcept`, `CinematicLimitation`, `CinematicAnalogy`,
  `CinematicCloser`, `CinematicOutro` — assembled by
  `templates/comparison/index.tsx`'s style dispatcher.
- Timing constants (`COLD_OPEN = 45`, `OUTRO_TAIL = 90`, `TRANSITION = 10`
  frames) live in `templates/comparison/index.tsx` next to the dispatcher,
  since `calculateMetadata` in `src/Root.tsx` needs to know the total extra
  frames this style adds beyond raw narration timing.
- Uses `compensateForTransitions()` from `src/transitionTiming.ts` — do not
  hand-roll transition-overlap math, it's easy to get the drift wrong (this
  was a real bug once).
