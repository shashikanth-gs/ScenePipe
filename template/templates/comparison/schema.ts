import { z } from "zod";

export const conceptSchema = z.object({
  label: z.string(),
  icon: z.string(), // an emoji, kept simple and dependency-free
  bullets: z.array(z.string()).max(3),
});

export const comparisonTreatmentSchema = z.object({
  // Every option here meets the bar in skills/scenepipe-visual-standards/SKILL.md
  // — there is no plain/centered fallback. See each style's own SKILL.md
  // (skills/scenepipe-comparison-<style>/SKILL.md) for when to pick it.
  visualStyle: z.enum(["cinematic", "kinetic-typography", "glitch-tape"]).default("cinematic"),
  audioFile: z.string(), // path relative to public/, e.g. "content/<slug>/narration.wav"
  captionsFile: z.string(), // path relative to public/, e.g. "content/<slug>/captions.json"
  hookQuestion: z.string(),
  hookSubtitle: z.string(),
  conceptA: conceptSchema, // the "simple/limited" concept
  conceptB: conceptSchema, // the concept that extends/wraps concept A
  limitation: z.object({
    label: z.string(),
    blockedActions: z.array(z.string()).max(2),
  }),
  analogy: z.object({
    intro: z.string(),
    aLabel: z.string(),
    aIcon: z.string(),
    aSub: z.string(),
    bLabel: z.string(),
    bIcon: z.string(),
    bSub: z.string(),
    takeaway: z.string(),
  }),
  closer: z.object({
    lineA: z.string(),
    lineB: z.string(),
  }),
  outroSubtitle: z.string(),
  // Frame boundaries for each scene, computed by scripts/render.mjs from the
  // real caption timestamps — never guessed/hardcoded by the AI.
  timings: z.object({
    hookEndFrame: z.number(),
    conceptEndFrame: z.number(),
    limitEndFrame: z.number(),
    wrapEndFrame: z.number(),
    analogyEndFrame: z.number(),
    closerEndFrame: z.number(),
    totalFrames: z.number(),
  }),
});

export type ComparisonTreatmentProps = z.infer<typeof comparisonTreatmentSchema>;
