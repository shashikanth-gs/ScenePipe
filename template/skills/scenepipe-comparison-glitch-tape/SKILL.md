---
name: scenepipe-comparison-glitch-tape
description: Alternative visual style for the "comparison" treatment — raw VHS/tape aesthetic with scan lines, chromatic aberration, and tracking-error glitches
metadata:
  tags: visual-style, comparison-treatment, glitch, vhs, scenepipe
---

# Style: comparison / glitch-tape

Read `scenepipe-visual-standards` first. Set `visualStyle: "glitch-tape"` in
`content-model.json` to use this instead of the `cinematic` default.

## When to pick this over cinematic

- The brand voice is raw/unpolished-on-purpose rather than editorial-clean —
  this leans directly into the 2026 "grit, grain, tape lines, visible
  imperfection" motion-design trend, not into premium/polished territory.
- The content itself is about something breaking, failing, or being
  incomplete (the built-in "ERROR:" / "404 ::" framing on the limitation
  beat fits naturally — don't force this style onto upbeat content where
  that framing would feel odd).

## What this style looks like

- Left-aligned headlines (same zone discipline as cinematic) but rendered
  with a chromatic-aberration text-shadow (red/cyan split that settles as
  the word "locks in"), plus a brief position jitter on entrance.
- Persistent scan-line overlay and occasional 2-3-frame tracking-error
  flashes (deterministic, not `Math.random()` — same frame always glitches
  the same way, so renders are reproducible).
- A blinking "REC ●" badge, on top of scenepipe's usual timecode chrome.
- Harder transition energy: wipes and fast fades rather than gentle slides.
- The limitation beat is explicitly framed as an error/404 — this is a
  deliberate thematic hook for this style, not a generic template.

## Authoring implications (for scenepipe-author-comparison)

No schema changes — same fields as every comparison style. Keep in mind the
limitation beat's on-screen framing here reads as "ERROR: {label}" and each
blocked action reads as "404 :: {action}" — write `limitation.label` and
`blockedActions` so they still read naturally inside that framing.

## Implementation notes

`component.tsx` exports `GlitchTapeComparisonScenes` (same
`ComparisonScenesProps` shape as every style). Internal building blocks:
`GlitchHeadline` (chromatic-aberration text), `ScanLines`, `RecBadge`,
`GlitchFlash` (deterministic tracking-error flash via a sine-based hash of
the frame number — reuse this hash pattern rather than introducing
`Math.random()` if you need pseudo-randomness in a new style; renders must
stay reproducible frame-for-frame).
