---
name: scenepipe-comparison-kinetic-typography
description: Alternative visual style for the "comparison" treatment — pure moving type, no cards or icons, words punch into frame in rhythm with the narration
metadata:
  tags: visual-style, comparison-treatment, kinetic-typography, scenepipe
---

# Style: comparison / kinetic-typography

Read `scenepipe-visual-standards` first. Set `visualStyle:
"kinetic-typography"` in `content-model.json` to use this instead of the
`cinematic` default.

## When to pick this over cinematic

- The brand voice is punchy/high-energy rather than editorial.
- The content is short, declarative statements rather than anything needing
  a supporting diagram (this style has no icons or generated graphics at
  all — if a concept genuinely needs a visual aid, use `cinematic` instead).
- You want maximum contrast against `cinematic` when producing multiple
  videos in a row, for visual variety across a feed.

## What this style looks like

- No cards, no background color blocks per scene, no generated graphics —
  every scene is the same dark background, and the *only* visual element is
  huge, centered, punch-in type.
- Words/short phrases scale in from nothing with a slight overshoot and a
  small rotation that settles to 0 — never a plain fade.
- Long lines (the hook question) are broken into 2-word chunks that punch in
  sequentially rather than appearing as one static block of text.
- This is the one style where big centered text is correct — see the
  exception noted in `scenepipe-visual-standards`.

## Authoring implications (for scenepipe-author-comparison)

- Keep every field shorter than you would for `cinematic`. Long labels or
  bullets look worse here because each one fills most of the frame alone —
  aim for 1-3 words per bullet/label, not full clauses.
- `icon` fields are ignored entirely by this style (no icons render) — still
  fill them in for schema validity, but don't over-invest in picking a
  perfect emoji for a style that won't show it.

## Implementation notes

`component.tsx` exports `KineticTypographyComparisonScenes`, matching the
same `ComparisonScenesProps` shape every comparison style implements (see
`templates/comparison/styleTypes.ts`). Internal building blocks: `Punch`
(one word/phrase punch-in) and `Stage` (shared dark background + kicker).
