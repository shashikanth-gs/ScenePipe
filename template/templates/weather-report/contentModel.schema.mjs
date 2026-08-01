// This is the ONLY shape the AI is ever allowed to produce for a
// "weather-report" treatment job. render.mjs validates every
// content-model.json against this before touching anything else.
import { z } from "zod";

const conditionCategorySchema = z.enum(["sunny", "partly-cloudy", "cloudy", "rainy"]);

const forecastDaySchema = z.object({
  label: z.string().min(1), // e.g. a short date or day label
  conditionCategory: conditionCategorySchema,
  highC: z.number(),
  lowC: z.number(),
  rainChancePercent: z.number().min(0).max(100),
});

export const contentModelSchema = z.object({
  treatment: z.literal("weather-report"),
  platform: z.enum(["instagram", "threads", "x"]),
  assetType: z.enum(["reel", "carousel", "story", "post"]),
  visualStyle: z.enum(["cinematic", "data-infographic"]).default("cinematic"),
  location: z.string().min(1),
  dateLabel: z.string().min(1),
  intro: z.object({
    headline: z.string().min(1),
    narration: z.string().min(1),
  }),
  current: z.object({
    tempC: z.number(),
    conditionLabel: z.string().min(1),
    conditionCategory: conditionCategorySchema,
    feelsLikeC: z.number(),
    humidityPercent: z.number().min(0).max(100),
    windKph: z.number(),
    windDirection: z.string().min(1), // compass letters, e.g. "W", "NE"
    narration: z.string().min(1),
  }),
  forecast: z.object({
    days: z.array(forecastDaySchema).min(2).max(4),
    narration: z.string().min(1),
  }),
  closing: z.object({
    tip: z.string().min(1),
    narration: z.string().min(1),
  }),
  outroSubtitle: z.string().min(1),
});

/** The 4 narration beats, in the exact order they get concatenated for TTS. */
export function narrationBeats(model) {
  return [model.intro.narration, model.current.narration, model.forecast.narration, model.closing.narration];
}

/** Maps a validated content model + computed audio/timing data to the
 * Remotion treatment's props shape (see ./schema.ts). */
export function toTreatmentProps(model, { audioFile, captionsFile, boundaryFrames, totalFrames }) {
  const [introEndFrame, currentEndFrame, forecastEndFrame, closingEndFrame] = boundaryFrames;

  return {
    visualStyle: model.visualStyle,
    audioFile,
    captionsFile,
    location: model.location,
    dateLabel: model.dateLabel,
    introHeadline: model.intro.headline,
    current: {
      tempC: model.current.tempC,
      conditionLabel: model.current.conditionLabel,
      conditionCategory: model.current.conditionCategory,
      feelsLikeC: model.current.feelsLikeC,
      humidityPercent: model.current.humidityPercent,
      windKph: model.current.windKph,
      windDirection: model.current.windDirection,
    },
    forecastDays: model.forecast.days,
    closingTip: model.closing.tip,
    outroSubtitle: model.outroSubtitle,
    timings: {
      introEndFrame,
      currentEndFrame,
      forecastEndFrame,
      closingEndFrame,
      totalFrames,
    },
  };
}
