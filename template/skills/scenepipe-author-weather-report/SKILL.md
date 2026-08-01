---
name: scenepipe-author-weather-report
description: Fill a content-model.json for the "weather-report" treatment (intro, current conditions, short forecast, closing tip) from a plan.json + real weather data
metadata:
  tags: content-authoring, weather-report-treatment, scenepipe
---

# Authoring: the "weather-report" treatment

Use this after the `scenepipe-strategy` skill has written a `plan.json` with
`"treatment": "weather-report"`. This treatment fits any **linear "here's the
current state of X" update** — weather, a stats snapshot, a status report —
not just weather specifically. It renders with custom SVG graphics (sun,
cloud, rain, wind, humidity gauge) driven by data fields, not emoji.

## Required output

Write `content/<slug>/content-model.json` matching exactly the schema in
`templates/weather-report/contentModel.schema.mjs`. See
`templates/weather-report/example.content-model.json` for a complete,
correct reference (real Bangalore data) — match its shape field-for-field.

## Never fabricate the data fields

Every numeric/categorical field (`tempC`, `feelsLikeC`, `humidityPercent`,
`windKph`, `windDirection`, `forecast.days[].highC/lowC/rainChancePercent`,
`conditionCategory`) must come from the actual source material (a fetched
weather API/page, or whatever data the user gave you) — never invented or
estimated. If the source doesn't give you a field this schema requires (e.g.
no wind data available), say so explicitly rather than guessing a plausible
number.

`conditionCategory` must be one of exactly `"sunny"`, `"partly-cloudy"`,
`"cloudy"`, `"rainy"` — pick whichever best matches the real reported
condition text; don't invent a new category value.

## The narration/on-screen split

Same principle as every treatment: on-screen fields (`introHeadline`,
`conditionLabel`, forecast `label`s, `closing.tip`) are short and built to be
read in under a second. Each section's separate `narration` field is the
full spoken sentence(s) for that beat — write it to be heard, and make sure
any number in it reads naturally aloud (macOS `say` and most TTS providers
read "26" as "twenty-six" correctly on their own — don't spell out numbers
yourself).

## Field-by-field guidance

- `intro.headline` / `intro.narration`: a one-line hook naming the location
  and that this is a weather update.
- `current`: the live conditions right now. `conditionCategory` drives both
  the icon and the background sky gradient for the whole video, so pick it
  carefully — it sets the tone for everything that follows.
- `forecast.days`: 2-4 entries, each a real forecasted day. Use short labels
  (a date like "Aug 2", or "Tomorrow" — pick whichever the source data makes
  clearest, don't guess a weekday name if you're not certain of the date).
- `closing.tip`: one practical, concrete takeaway a viewer can act on (bring
  an umbrella, it's a good day for outdoor plans, etc.) grounded in the
  actual forecast — not a generic sign-off.
- `outroSubtitle`: the CTA line.

## Length discipline

Total narration across the four beats (`intro`, `current`, `forecast`,
`closing`) doesn't need to hit exactly 30 seconds — a tight, accurate weather
update naturally runs shorter (20-25s) than a concept explainer, and that's
fine. Don't pad it with filler to reach a target duration.

## What you never do here

- Never fabricate weather data. If you don't have real data for a field,
  don't write this content model — go back and get the data first, or tell
  the user you need it.
- Never write to anything outside `content/<slug>/content-model.json`.
- Never guess at frame timings — `scripts/render.mjs` computes those
  deterministically from the real synthesized audio.
