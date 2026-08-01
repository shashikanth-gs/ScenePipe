import { z } from "zod";

const conditionCategorySchema = z.enum(["sunny", "partly-cloudy", "cloudy", "rainy"]);

const forecastDaySchema = z.object({
  label: z.string(),
  conditionCategory: conditionCategorySchema,
  highC: z.number(),
  lowC: z.number(),
  rainChancePercent: z.number(),
});

export const weatherReportTreatmentSchema = z.object({
  // See skills/scenepipe-visual-standards/SKILL.md — no plain/centered
  // fallback exists on purpose. "data-infographic" fits numbers-heavy
  // content especially well.
  visualStyle: z.enum(["cinematic", "data-infographic"]).default("cinematic"),
  audioFile: z.string(),
  captionsFile: z.string(),
  location: z.string(),
  dateLabel: z.string(),
  introHeadline: z.string(),
  current: z.object({
    tempC: z.number(),
    conditionLabel: z.string(),
    conditionCategory: conditionCategorySchema,
    feelsLikeC: z.number(),
    humidityPercent: z.number(),
    windKph: z.number(),
    windDirection: z.string(),
  }),
  forecastDays: z.array(forecastDaySchema).min(2).max(4),
  closingTip: z.string(),
  outroSubtitle: z.string(),
  timings: z.object({
    introEndFrame: z.number(),
    currentEndFrame: z.number(),
    forecastEndFrame: z.number(),
    closingEndFrame: z.number(),
    totalFrames: z.number(),
  }),
});

export type WeatherReportTreatmentProps = z.infer<typeof weatherReportTreatmentSchema>;
