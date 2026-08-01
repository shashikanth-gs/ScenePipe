import "./index.css";
import { Composition, CalculateMetadataFunction } from "remotion";
import { TREATMENTS } from "../templates/registry";
import type { ComparisonTreatmentProps } from "../templates/comparison";
import { styleExtraFrames } from "../templates/comparison";
import type { WeatherReportTreatmentProps } from "../templates/weather-report";
import config from "../scenepipe.config.json";

// Demo content so `npm run dev` shows a working example immediately, without
// needing a job to exist yet. Real renders pass their own inputProps and
// override this entirely (see scripts/render.mjs).
const demoComparisonProps: ComparisonTreatmentProps = {
  visualStyle: "cinematic",
  audioFile: "demo/narration.wav",
  captionsFile: "demo/captions.json",
  hookQuestion: "What's the real difference?",
  hookSubtitle: "What's the real difference?",
  conceptA: { label: "LLM", icon: "🧠", bullets: ["Reads", "Reasons", "Writes"] },
  conceptB: { label: "Agent Harness", icon: "⚙️", bullets: ["Memory", "Tools", "Loop"] },
  limitation: { label: "Can't take action", blockedActions: ["Click a button", "Run code"] },
  analogy: {
    intro: "Think of it like this",
    aLabel: "Pilot",
    aIcon: "🧑‍✈️",
    aSub: "= the LLM",
    bLabel: "Plane",
    bIcon: "✈️",
    bSub: "= the harness",
    takeaway: "One decides. The other moves.",
  },
  closer: { lineA: "LLM talks.", lineB: "Harness acts." },
  outroSubtitle: "Follow for more AI breakdowns",
  timings: {
    hookEndFrame: 98,
    conceptEndFrame: 227,
    limitEndFrame: 323,
    wrapEndFrame: 545,
    analogyEndFrame: 652,
    closerEndFrame: 784,
    totalFrames: 900,
  },
};

const demoWeatherProps: WeatherReportTreatmentProps = {
  visualStyle: "cinematic",
  audioFile: "demo/weather-narration.wav",
  captionsFile: "demo/weather-captions.json",
  location: "Bangalore",
  dateLabel: "August 1",
  introHeadline: "Your Bangalore weather update",
  current: {
    tempC: 26,
    conditionLabel: "Partly Cloudy",
    conditionCategory: "partly-cloudy",
    feelsLikeC: 25,
    humidityPercent: 58,
    windKph: 24,
    windDirection: "W",
  },
  forecastDays: [
    { label: "Aug 1", conditionCategory: "partly-cloudy", highC: 28, lowC: 20, rainChancePercent: 19 },
    { label: "Aug 2", conditionCategory: "partly-cloudy", highC: 30, lowC: 20, rainChancePercent: 23 },
    { label: "Aug 3", conditionCategory: "sunny", highC: 31, lowC: 20, rainChancePercent: 17 },
  ],
  closingTip: "Keep an umbrella handy in the afternoons.",
  outroSubtitle: "Follow for daily Bangalore weather updates",
  timings: {
    introEndFrame: 104,
    currentEndFrame: 303,
    forecastEndFrame: 536,
    closingEndFrame: 743,
    totalFrames: 773,
  },
};

const calculateReelMetadata: CalculateMetadataFunction<ComparisonTreatmentProps> = ({ props }) => {
  // Every style shares the same 8-scene skeleton (cold open + 6 narration
  // beats + outro), so the extra padding beyond raw narration timing is the
  // same regardless of which style is chosen.
  return {
    durationInFrames: props.timings.closerEndFrame + styleExtraFrames(),
    fps: config.render.fps,
    width: config.render.reelDimensions.width,
    height: config.render.reelDimensions.height,
  };
};

const calculateWeatherMetadata: CalculateMetadataFunction<WeatherReportTreatmentProps> = ({ props }) => {
  return {
    durationInFrames: props.timings.totalFrames,
    fps: config.render.fps,
    width: config.render.reelDimensions.width,
    height: config.render.reelDimensions.height,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="instagram-reel-comparison"
        component={TREATMENTS.comparison.component}
        durationInFrames={919}
        fps={config.render.fps}
        width={config.render.reelDimensions.width}
        height={config.render.reelDimensions.height}
        defaultProps={demoComparisonProps}
        calculateMetadata={calculateReelMetadata}
      />
      <Composition
        id="instagram-reel-weather-report"
        component={TREATMENTS["weather-report"].component}
        durationInFrames={773}
        fps={config.render.fps}
        width={config.render.reelDimensions.width}
        height={config.render.reelDimensions.height}
        defaultProps={demoWeatherProps}
        calculateMetadata={calculateWeatherMetadata}
      />
    </>
  );
};
