import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { CaptionsOverlay } from "../../src/CaptionsOverlay";
import { Grain } from "../../src/Grain";
import { Chrome } from "../../src/Chrome";
import { Sky } from "./Sky";
import { compensateForTransitions } from "../../src/transitionTiming";
import { CinematicWeatherScenes } from "../../skills/scenepipe-weather-report-cinematic/component";
import { DataInfographicWeatherScenes } from "../../skills/scenepipe-weather-report-data-infographic/component";
import type { WeatherReportTreatmentProps } from "./schema";

export { weatherReportTreatmentSchema } from "./schema";
export type { WeatherReportTreatmentProps } from "./schema";

const TRANSITION = 10;

// See skills/scenepipe-visual-standards/SKILL.md — no plain/centered
// fallback exists on purpose.
const STYLE_SCENES: Record<WeatherReportTreatmentProps["visualStyle"], React.FC<Parameters<typeof CinematicWeatherScenes>[0]>> = {
  cinematic: CinematicWeatherScenes,
  "data-infographic": DataInfographicWeatherScenes,
};

export const WeatherReportTreatment: React.FC<WeatherReportTreatmentProps> = (content) => {
  const { timings } = content;

  const natural = [
    timings.introEndFrame,
    timings.currentEndFrame - timings.introEndFrame,
    timings.forecastEndFrame - timings.currentEndFrame,
    timings.closingEndFrame - timings.forecastEndFrame,
    timings.totalFrames - timings.closingEndFrame,
  ];
  const durations = compensateForTransitions(natural, TRANSITION);

  const Scenes = STYLE_SCENES[content.visualStyle] ?? STYLE_SCENES.cinematic;

  return (
    <AbsoluteFill name={`${content.location} weather report (${content.visualStyle})`}>
      {content.visualStyle === "cinematic" && <Sky category={content.current.conditionCategory} />}
      <Audio src={staticFile(content.audioFile)} />

      <Scenes content={content} durations={durations} transitionLength={TRANSITION} />

      <CaptionsOverlay captionsFile={content.captionsFile} />
      <Grain />
      <Chrome />
    </AbsoluteFill>
  );
};
