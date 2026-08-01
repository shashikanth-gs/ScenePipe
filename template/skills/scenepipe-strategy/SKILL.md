---
name: scenepipe-strategy
description: Decide which platform/asset-type/treatment artifacts to produce from a piece of source material, scoped by scenepipe.config.json and brand/BRAND.md
metadata:
  tags: strategy, content-planning, scenepipe
---

# Strategy: deciding what to make

This is the first step for any new input. Its output is a **plan**, not
content — no narration, no copy, just decisions about what gets produced.

## Inputs to read, in this order

1. `brand/BRAND.md` — voice, audience, what this brand always/never does.
2. `scenepipe.config.json` — `platforms.*.enabled` + `platforms.*.assetTypes`
   (the universe of what you're allowed to produce), and `strategy.mode`.
3. `templates/registry.ts` — the finite list of available treatments and
   what content shape each one fits. Read each treatment's description.
4. The source material itself (article text, fetched URL, or file/directory
   the user pointed you at).

## Deciding the mix

- If `strategy.mode` is `"fixed"`: plan exactly one artifact per enabled
  `(platform, assetType)` pair, using whichever treatment's description best
  matches the source's shape.
- If `strategy.mode` is `"auto"`: judge which enabled `(platform, assetType)`
  combinations the source material actually supports well. A short, punchy
  fact deserves a reel, not a 10-slide carousel padded with filler. A deep
  piece with several distinct sub-points might support a reel *and* a
  carousel with different angles — that's fine, plan both.
- **Never plan an artifact just because a slot is enabled.** If the source
  doesn't support a good carousel, don't make one — say so in your final
  summary to the user instead.
- **Never plan a treatment that doesn't fit.** If no registered treatment
  matches the content's actual shape, don't force it into the closest one —
  report that a new treatment would need to be hand-authored, and stop there
  for that artifact.

## Output

For each planned artifact, create a job directory and write `plan.json`:

```
content/<slug>/plan.json
```

Where `<slug>` is a short kebab-case identifier unique to this artifact
(include the platform/assetType if you're producing more than one from the
same source, e.g. `agent-harness-explainer-reel`,
`agent-harness-explainer-carousel`).

```json
{
  "platform": "instagram",
  "assetType": "reel",
  "treatment": "comparison",
  "angle": "one sentence: what specific angle this artifact takes on the source",
  "keyPoints": ["the 3-5 concrete facts/claims from the source this artifact will use"]
}
```

Do not write `content-model.json` yourself — that's the
`scenepipe-author-<treatment>` skill's job, using this `plan.json` plus the
source material as its input.

## After planning

Summarize your plan to the user in plain language before authoring content:
how many artifacts, which platforms/types, and the angle for each — this is
the checkpoint where a human catches a bad plan before any copy gets written.
