import { ComparisonTreatment, comparisonTreatmentSchema } from "./comparison";
import { WeatherReportTreatment, weatherReportTreatmentSchema } from "./weather-report";

// This is the finite, human-reviewed library of visual treatments the AI is
// allowed to choose from. It never writes new entries here at runtime — only
// picks one by name and fills its schema. Add new treatments by hand-authoring
// a new folder (schema.ts + scenes.tsx + index.tsx) and registering it below.
export const TREATMENTS = {
  comparison: {
    component: ComparisonTreatment,
    schema: comparisonTreatmentSchema,
    description:
      "Two concepts, one extends/wraps the other (e.g. 'X vs X+Y'). Best for explainer content shaped as a comparison or upgrade. " +
      "Three visual styles, no plain/centered fallback: `cinematic` (default — full-bleed asymmetric layouts, generated vector graphics, real TransitionSeries cuts, brand chrome), `kinetic-typography` (frame-filling punch-in type, no cards/graphics), `glitch-tape` (chromatic aberration, scan lines, deterministic tracking-error glitches). Set content-model.json's `visualStyle` to pick one — see each style's own skills/scenepipe-comparison-<style>/SKILL.md.",
  },
  "weather-report": {
    component: WeatherReportTreatment,
    schema: weatherReportTreatmentSchema,
    description:
      "A linear data report: intro, current conditions, a short forecast strip, and a closing tip. Rich custom SVG graphics (sun/cloud/rain/wind/humidity), not emoji. Best for weather, stats, or any 'here's the current state of X' update. " +
      "Two visual styles: `cinematic` (default — illustrated condition icons) and `data-infographic` (animated counters, bar gauges, a real bar chart) — see each style's own skills/scenepipe-weather-report-<style>/SKILL.md.",
  },
} as const;

export type TreatmentName = keyof typeof TREATMENTS;
