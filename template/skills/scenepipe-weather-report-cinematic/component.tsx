import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { COLORS } from "../../src/theme";
import { displayFont, bodyFont } from "../../src/fonts";
import { ConditionIcon, HumidityIcon, WindIcon, compassToDegrees } from "../../templates/weather-report/icons";
import type { WeatherReportTreatmentProps } from "../../templates/weather-report/schema";
import type { WeatherScenesProps } from "../../templates/weather-report/styleTypes";

type Current = WeatherReportTreatmentProps["current"];
type ForecastDay = WeatherReportTreatmentProps["forecastDays"][number];

export const LocationHeader: React.FC<{ location: string; dateLabel: string }> = ({ location, dateLabel }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Location header" style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 150 }}>
      <Interactive.Div
        name="Location row"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Interactive.Div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 40,
            color: COLORS.text,
            letterSpacing: 1,
          }}
        >
          {location}
        </Interactive.Div>
        <Interactive.Div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 24, color: COLORS.dim }}>
          {dateLabel}
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const IntroScene: React.FC<{ headline: string }> = ({ headline }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Intro scene" style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <Interactive.Div
        style={{
          scale: interpolate(frame, [0, 20], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 11 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <ConditionIcon category="partly-cloudy" size={180} />
      </Interactive.Div>
      <Interactive.Div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 52,
          color: COLORS.text,
          textAlign: "center",
          marginTop: 24,
          opacity: interpolate(frame, [16, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {headline}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const CurrentConditionsScene: React.FC<{ current: Current }> = ({ current }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Current conditions scene" style={{ justifyContent: "center", alignItems: "center" }}>
      <Interactive.Div
        style={{
          opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [0, 16], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 10 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <ConditionIcon category={current.conditionCategory} size={160} />
      </Interactive.Div>
      <Interactive.Div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 130,
          color: COLORS.text,
          marginTop: 8,
          opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {Math.round(current.tempC)}°
      </Interactive.Div>
      <Interactive.Div
        style={{
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 34,
          color: COLORS.primary,
          opacity: interpolate(frame, [18, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {current.conditionLabel} · feels like {Math.round(current.feelsLikeC)}°
      </Interactive.Div>
      <Interactive.Div
        name="Stat chips"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          marginTop: 40,
          opacity: interpolate(frame, [34, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Interactive.Div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            padding: "18px 26px",
            borderRadius: 20,
            background: "#38bdf814",
            border: `1.5px solid ${COLORS.primary}55`,
          }}
        >
          <HumidityIcon size={44} percent={current.humidityPercent} />
          <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 24, color: COLORS.text }}>
            {current.humidityPercent}%
          </span>
        </Interactive.Div>
        <Interactive.Div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            padding: "18px 26px",
            borderRadius: 20,
            background: "#38bdf814",
            border: `1.5px solid ${COLORS.primary}55`,
          }}
        >
          <WindIcon size={44} directionDeg={compassToDegrees(current.windDirection)} />
          <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 24, color: COLORS.text }}>
            {Math.round(current.windKph)} km/h
          </span>
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const ForecastCard: React.FC<{ day: ForecastDay; index: number }> = ({ day, index }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: 150,
        padding: "24px 12px",
        borderRadius: 22,
        background: "#ffffff08",
        border: "1.5px solid #ffffff1a",
        opacity: interpolate(frame, [14 + index * 12, 28 + index * 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(frame, [14 + index * 12, 28 + index * 12], ["0px 20px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 24, color: COLORS.dim }}>{day.label}</span>
      <ConditionIcon category={day.conditionCategory} size={64} />
      <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 28, color: COLORS.text }}>
        {Math.round(day.highC)}°<span style={{ color: COLORS.dim, fontSize: 20 }}> / {Math.round(day.lowC)}°</span>
      </span>
      <span style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 18, color: COLORS.primary }}>
        {day.rainChancePercent}% rain
      </span>
    </Interactive.Div>
  );
};

export const ForecastScene: React.FC<{ days: ForecastDay[] }> = ({ days }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Forecast scene" style={{ justifyContent: "center", alignItems: "center" }}>
      <Interactive.Div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 40,
          color: COLORS.text,
          marginBottom: 40,
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Coming up
      </Interactive.Div>
      <Interactive.Div name="Forecast row" style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        {days.map((day, i) => (
          <ForecastCard key={day.label} day={day} index={i} />
        ))}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const ClosingScene: React.FC<{ tip: string }> = ({ tip }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Closing scene" style={{ justifyContent: "center", alignItems: "center", padding: "0 90px" }}>
      <Interactive.Div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 46,
          color: COLORS.highlight,
          textAlign: "center",
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [0, 18], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 11 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {tip}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const WeatherOutroScene: React.FC<{ location: string; subtitle: string }> = ({ location, subtitle }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Outro scene" style={{ justifyContent: "center", alignItems: "center" }}>
      <Interactive.Div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 48,
          color: COLORS.text,
          textAlign: "center",
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [0, 18], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 11 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {location} Weather
      </Interactive.Div>
      <Interactive.Div
        style={{
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 30,
          color: COLORS.highlight,
          marginTop: 26,
          opacity: interpolate(frame, [24, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {subtitle}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const CinematicWeatherScenes: React.FC<WeatherScenesProps> = ({ content, durations, transitionLength }) => {
  const [introD, currentD, forecastD, closingD, outroD] = durations;
  const t = { durationInFrames: transitionLength };

  return (
    <>
      <LocationHeader location={content.location} dateLabel={content.dateLabel} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={introD}>
          <IntroScene headline={content.introHeadline} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={currentD}>
          <CurrentConditionsScene current={content.current} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming(t)} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={forecastD}>
          <ForecastScene days={content.forecastDays} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming(t)} presentation={wipe({ direction: "from-bottom" })} />

        <TransitionSeries.Sequence durationInFrames={closingD}>
          <ClosingScene tip={content.closingTip} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={outroD}>
          <WeatherOutroScene location={content.location} subtitle={content.outroSubtitle} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
