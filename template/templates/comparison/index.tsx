import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { CaptionsOverlay } from "../../src/CaptionsOverlay";
import { Grain } from "../../src/Grain";
import { Chrome } from "../../src/Chrome";
import { compensateForTransitions } from "../../src/transitionTiming";
import { CinematicComparisonScenes } from "../../skills/scenepipe-comparison-cinematic/component";
import { KineticTypographyComparisonScenes } from "../../skills/scenepipe-comparison-kinetic-typography/component";
import { GlitchTapeComparisonScenes } from "../../skills/scenepipe-comparison-glitch-tape/component";
import type { ComparisonTreatmentProps } from "./schema";

export { comparisonTreatmentSchema } from "./schema";
export type { ComparisonTreatmentProps } from "./schema";

const COLD_OPEN = 45;
const OUTRO_TAIL = 90;
const TRANSITION = 10;

// Every style listed here — see skills/scenepipe-visual-standards/SKILL.md
// for what "being here" requires. There is deliberately no plain/centered
// fallback: if a style doesn't meet the bar, it doesn't get added, full stop.
const STYLE_SCENES: Record<ComparisonTreatmentProps["visualStyle"], React.FC<Parameters<typeof CinematicComparisonScenes>[0]>> = {
  cinematic: CinematicComparisonScenes,
  "kinetic-typography": KineticTypographyComparisonScenes,
  "glitch-tape": GlitchTapeComparisonScenes,
};

/** How many extra frames every style needs beyond the raw narration timing
 * (cold open before + outro after). Root.tsx's calculateMetadata uses this
 * so the composition's total duration is correct before anything renders —
 * TransitionSeries itself doesn't change the total (see
 * src/transitionTiming.ts), only this cold-open/outro padding does. */
export function styleExtraFrames() {
  return COLD_OPEN + OUTRO_TAIL;
}

export const ComparisonTreatment: React.FC<ComparisonTreatmentProps> = (content) => {
  const { timings } = content;

  const natural = [
    COLD_OPEN,
    timings.hookEndFrame,
    timings.conceptEndFrame - timings.hookEndFrame,
    timings.limitEndFrame - timings.conceptEndFrame,
    timings.wrapEndFrame - timings.limitEndFrame,
    timings.analogyEndFrame - timings.wrapEndFrame,
    timings.closerEndFrame - timings.analogyEndFrame,
    OUTRO_TAIL,
  ];
  const durations = compensateForTransitions(natural, TRANSITION);

  const Scenes = STYLE_SCENES[content.visualStyle] ?? STYLE_SCENES.cinematic;

  return (
    <AbsoluteFill name={`${content.conceptA.label} vs ${content.conceptB.label} (${content.visualStyle})`}>
      <Scenes content={content} durations={durations} transitionLength={TRANSITION} />

      <Sequence from={COLD_OPEN} layout="none">
        <Audio src={staticFile(content.audioFile)} />
      </Sequence>
      <Sequence from={COLD_OPEN} layout="none">
        <CaptionsOverlay captionsFile={content.captionsFile} />
      </Sequence>

      <Grain />
      <Chrome />
    </AbsoluteFill>
  );
};
