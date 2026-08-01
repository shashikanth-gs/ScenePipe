---
name: scenepipe-author-comparison
description: Fill a content-model.json for the "comparison" treatment (two concepts, one extends/wraps the other) from a plan.json + source material
metadata:
  tags: content-authoring, comparison-treatment, scenepipe
---

# Authoring: the "comparison" treatment

Use this after the `scenepipe-strategy` skill has written a `plan.json` with
`"treatment": "comparison"`. This treatment fits content shaped as
**"X vs X+Y"** — a simple concept, its limitation, and a second concept that
extends/wraps it to remove that limitation (e.g. "LLM vs Agent Harness",
"a function vs a retry-safe function", "a map vs a routing engine"). If the
source doesn't actually have this shape, go back to the strategy step —
don't force it here.

## Required output

Write `content/<slug>/content-model.json` (same `<slug>` as the `plan.json`
directory) matching exactly the schema in
`templates/comparison/contentModel.schema.mjs`. See
`templates/comparison/example.content-model.json` for a complete, correct
reference — match its shape field-for-field.

## The narration/on-screen split — read this carefully

Every scene has **on-screen fields** (`label`, `bullets`, `blockedActions`,
etc.) and a separate **`narration` field**. They are not the same text:

- On-screen fields are short, punchy, built to be read in under a second —
  1-3 words per bullet, never a full sentence.
- `narration` is the actual spoken line(s) for that scene — full sentences,
  written to be heard, not read. It becomes both the TTS audio and (via
  Whisper) the captions, so write it exactly as it should be spoken aloud.
- Don't just repeat the on-screen label as the narration. "Reads, Reasons,
  Writes" on screen might be narrated as "It reads, reasons, and writes
  text" — same idea, different register.

## Field-by-field guidance

- `hook.question` / `hook.subtitle`: the on-screen hook (short). `hook.narration`
  is the spoken hook question — these are usually close in wording since it's
  a direct question, but subtitle stays terse (≤6 words).
- `conceptA` / `conceptB`: `icon` is a single emoji (pick one that reads
  clearly at small size — avoid ambiguous or rarely-rendered emoji).
  `bullets`: max 3, each 1-2 words. `conceptB` is the one that extends/wraps
  `conceptA` — its narration is the "here's what gets added" beat.
- `limitation.blockedActions`: max 2, concrete and specific ("Run code", not
  "Do things"). This is what `conceptA` alone can't do.
- `analogy`: a concrete, physical analogy for the A/B relationship (pilot/plane,
  key/lock, seed/soil — whatever fits the actual content, not a generic
  metaphor). `takeaway` is one short sentence closing the analogy.
- `closer.lineA` / `lineB`: the two-line payoff, mirroring the analogy's
  logic (e.g. "X talks. Y acts.").
- `outroSubtitle`: the CTA line (e.g. "Follow for more on X").

## Length discipline

Total narration across all six beats (`hook`, `conceptA`, `limitation`,
`conceptB`, `analogy`, `closer`) should read naturally in **25-30 seconds**
at a normal speaking pace (roughly 75-85 words total, including punctuation
pauses). This isn't enforced by the schema — it's your judgment call, guided
by `brand/BRAND.md`'s tone. Too short reads as thin; too long gets cut off or
rushed. Do not pad narration to hit a duration — trim the source's ideas
instead.

## What you never do here

- Never invent facts not present in (or reasonably inferable from) the
  source material.
- Never write to anything outside `content/<slug>/content-model.json`.
- Never guess at frame timings or durations — `scripts/render.mjs` computes
  those deterministically from the real synthesized audio.
