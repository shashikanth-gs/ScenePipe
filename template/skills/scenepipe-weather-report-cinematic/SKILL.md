---
name: scenepipe-weather-report-cinematic
description: The default visual style for the "weather-report" treatment — illustrated condition icons, real TransitionSeries cuts, brand chrome
metadata:
  tags: visual-style, weather-report-treatment, cinematic, scenepipe
---

# Style: weather-report / cinematic

Read `scenepipe-visual-standards` first. This is the **default** style for
the `weather-report` treatment.

## What this style looks like

- Five scenes (intro, current conditions, forecast strip, closing tip,
  outro), cut together with real `TransitionSeries` blends.
- Custom-illustrated SVG weather icons (sun/cloud/rain/wind/humidity, from
  `templates/weather-report/icons.tsx`) — never emoji.
- A persistent location/date header, and the sky background's gradient
  reacts to the live condition category.

## Honest limitation (read before extending this style)

The `IntroScene` and `CurrentConditionsScene` layouts are still
center-composed (icon + big number + chips, stacked and centered as one
group) rather than fully asymmetric left/corner-anchored like the
`comparison` treatment's cinematic style. This was a deliberate scope
tradeoff, not an oversight — dense multi-element weather content (a big
number + icon + stat chips together) reads reasonably as a "widget," unlike
sparse single-line text sitting alone in empty space, which is what the
asymmetric rule is actually guarding against. If you're extending this
style, moving these two scenes to a true asymmetric layout (data left,
icon/graphic right, matching the comparison treatment's convention) is the
next real improvement here — don't treat the current centering as the
intended final state.

## Implementation notes

`component.tsx` exports the original scene components (`LocationHeader`,
`IntroScene`, `CurrentConditionsScene`, `ForecastScene`, `ClosingScene`,
`WeatherOutroScene`) plus `CinematicWeatherScenes`, the `TransitionSeries`
assembler matching `WeatherScenesProps` (see
`templates/weather-report/styleTypes.ts`). No cold-open/outro padding is
added beyond the original 1s tail baked into `timings.totalFrames` —
unlike the comparison treatment, this style doesn't need it since the
intro/outro scenes already carry their own visual weight.
