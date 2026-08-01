---
name: scenepipe-weather-report-data-infographic
description: Alternative visual style for the "weather-report" treatment — animated counters, bar charts, and gauges instead of illustrated scenes
metadata:
  tags: visual-style, weather-report-treatment, data-infographic, scenepipe
---

# Style: weather-report / data-infographic

Read `scenepipe-visual-standards` first. Set `visualStyle:
"data-infographic"` in `content-model.json` to use this instead of the
`cinematic` default.

## When to pick this over cinematic

- The content is genuinely numbers-heavy and the numbers themselves are the
  interesting part (a multi-day forecast, a stats recap) — this style makes
  every figure count up and every comparison a bar, rather than illustrating
  the weather as a scene.
- You want a "dashboard" feel rather than a "postcard" feel.

## What this style looks like

- Fully asymmetric: data/labels live on the left, the visual (icon, bars,
  chart) occupies the right or bottom zone — this is the style that gets
  the asymmetric-layout rule right where `scenepipe-weather-report-cinematic`
  currently takes a shortcut (see that skill's honest-limitation note).
- Every number animates in via count-up (0 → value), never appears static.
- Humidity is a filling horizontal bar gauge, not just a number next to an
  icon.
- The forecast beat is a real bar chart — bar height scaled to each day's
  high temperature, rain-chance percentage labeled above each bar.
- A faint grid-line background (`Grid` component) instead of the cinematic
  style's sky gradient — reinforces the dashboard feel.

## Authoring implications (for scenepipe-author-weather-report)

No schema changes — identical content-model fields regardless of style.
This style benefits especially from real precision in the numeric fields
(`tempC`, `humidityPercent`, `forecastDays[].highC/rainChancePercent`) since
every one of them is visually foregrounded — a rounded-off or estimated
number is more noticeable here than in the cinematic style.

## Implementation notes

`component.tsx` exports `DataInfographicWeatherScenes` (matches
`WeatherScenesProps`, same shape as the cinematic style). Reusable pieces:
`CountUp` (animated number), `BarGauge` (filling horizontal bar with
label), `Grid` (background texture), `Panel` (shared background + kicker
wrapper). `ConditionIcon`/`WindIcon` are reused from
`templates/weather-report/icons.tsx` rather than duplicated.
