// This is the ONLY shape the AI is ever allowed to produce for a "comparison"
// treatment job. render.mjs validates every content-model.json against this
// before touching anything else — a bad/incomplete AI output fails fast here
// instead of corrupting a render silently.
import { z } from "zod";

const conceptSchema = z.object({
  label: z.string().min(1),
  icon: z.string().min(1), // a single emoji
  bullets: z.array(z.string().min(1)).min(1).max(3),
  narration: z.string().min(1), // the spoken line(s) for this beat
});

export const contentModelSchema = z.object({
  treatment: z.literal("comparison"),
  platform: z.enum(["instagram", "threads", "x"]),
  assetType: z.enum(["reel", "carousel", "story", "post"]),
  // "cinematic" (default), "kinetic-typography", or "glitch-tape" — see each
  // style's SKILL.md (skills/scenepipe-comparison-<style>/SKILL.md) for when
  // to pick it over the default. No plain/centered option exists on purpose.
  visualStyle: z.enum(["cinematic", "kinetic-typography", "glitch-tape"]).default("cinematic"),
  hook: z.object({
    question: z.string().min(1),
    subtitle: z.string().min(1),
    narration: z.string().min(1),
  }),
  conceptA: conceptSchema,
  limitation: z.object({
    label: z.string().min(1),
    blockedActions: z.array(z.string().min(1)).min(1).max(2),
    narration: z.string().min(1),
  }),
  conceptB: conceptSchema, // conceptB.narration is the "wrap" beat
  analogy: z.object({
    intro: z.string().min(1),
    aLabel: z.string().min(1),
    aIcon: z.string().min(1),
    aSub: z.string().min(1),
    bLabel: z.string().min(1),
    bIcon: z.string().min(1),
    bSub: z.string().min(1),
    takeaway: z.string().min(1),
    narration: z.string().min(1),
  }),
  closer: z.object({
    lineA: z.string().min(1),
    lineB: z.string().min(1),
    narration: z.string().min(1),
  }),
  outroSubtitle: z.string().min(1),
});

/** The 6 narration beats, in the exact order they get concatenated for TTS. */
export function narrationBeats(model) {
  return [
    model.hook.narration,
    model.conceptA.narration,
    model.limitation.narration,
    model.conceptB.narration,
    model.analogy.narration,
    model.closer.narration,
  ];
}

/** Maps a validated content model + computed audio/timing data to the
 * Remotion treatment's props shape (see ./schema.ts). */
export function toTreatmentProps(model, { audioFile, captionsFile, boundaryFrames, totalFrames }) {
  const [hookEndFrame, conceptEndFrame, limitEndFrame, wrapEndFrame, analogyEndFrame, closerEndFrame] =
    boundaryFrames;

  return {
    visualStyle: model.visualStyle,
    audioFile,
    captionsFile,
    hookQuestion: model.hook.question,
    hookSubtitle: model.hook.subtitle,
    conceptA: { label: model.conceptA.label, icon: model.conceptA.icon, bullets: model.conceptA.bullets },
    conceptB: { label: model.conceptB.label, icon: model.conceptB.icon, bullets: model.conceptB.bullets },
    limitation: { label: model.limitation.label, blockedActions: model.limitation.blockedActions },
    analogy: {
      intro: model.analogy.intro,
      aLabel: model.analogy.aLabel,
      aIcon: model.analogy.aIcon,
      aSub: model.analogy.aSub,
      bLabel: model.analogy.bLabel,
      bIcon: model.analogy.bIcon,
      bSub: model.analogy.bSub,
      takeaway: model.analogy.takeaway,
    },
    closer: { lineA: model.closer.lineA, lineB: model.closer.lineB },
    outroSubtitle: model.outroSubtitle,
    timings: {
      hookEndFrame,
      conceptEndFrame,
      limitEndFrame,
      wrapEndFrame,
      analogyEndFrame,
      closerEndFrame,
      totalFrames,
    },
  };
}
