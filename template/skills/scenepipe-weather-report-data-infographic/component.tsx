import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { COLORS } from "../../src/theme";
import { displayFont, bodyFont, monoFont } from "../../src/fonts";
import { ConditionIcon, compassToDegrees, WindIcon } from "../../templates/weather-report/icons";
import { LogoLockup } from "../../src/Logo";
import type { WeatherReportTreatmentProps } from "../../templates/weather-report/schema";
import type { WeatherScenesProps } from "../../templates/weather-report/styleTypes";

type Current = WeatherReportTreatmentProps["current"];
type ForecastDay = WeatherReportTreatmentProps["forecastDays"][number];

const CountUp: React.FC<{ to: number; from?: number; size: number; color: string; suffix?: string; delay?: number }> = ({
  to,
  from = 0,
  size,
  color,
  suffix = "",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [delay, delay + 26], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: size, color }}>
      {Math.round(value)}
      {suffix}
    </span>
  );
};

const BarGauge: React.FC<{ label: string; percent: number; color: string; delay?: number }> = ({
  label,
  percent,
  color,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [delay, delay + 30], [0, percent], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 24, color: COLORS.dim }}>{label}</span>
        <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 24, color: COLORS.text }}>
          {Math.round(fill)}%
        </span>
      </div>
      <div style={{ width: "100%", height: 14, borderRadius: 7, background: "#ffffff14" }}>
        <div style={{ width: `${fill}%`, height: "100%", borderRadius: 7, background: color }} />
      </div>
    </div>
  );
};

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.08,
      backgroundImage:
        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }}
  />
);

const Panel: React.FC<{ children: React.ReactNode; kicker?: string }> = ({ children, kicker }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <Grid />
      {kicker && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 220,
            fontFamily: monoFont,
            fontWeight: 700,
            fontSize: 26,
            color: COLORS.secondary,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {kicker}
        </div>
      )}
      {children}
    </AbsoluteFill>
  );
};

const IntroBeat: React.FC<{ headline: string; location: string }> = ({ headline, location }) => (
  <Panel kicker={`// ${location.toUpperCase()}`}>
    <div style={{ position: "absolute", left: 80, top: 280, maxWidth: 700 }}>
      <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 68, lineHeight: 1.1, color: COLORS.text }}>
        {headline}
      </div>
    </div>
    <div style={{ position: "absolute", right: 60, bottom: 300, opacity: 0.85 }}>
      <ConditionIcon category="partly-cloudy" size={220} />
    </div>
  </Panel>
);

const CurrentBeat: React.FC<{ current: Current }> = ({ current }) => (
  <Panel kicker="RIGHT NOW">
    <div style={{ position: "absolute", left: 80, top: 300 }}>
      <CountUp to={Math.round(current.tempC)} size={190} color={COLORS.primary} suffix="°" />
      <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 30, color: COLORS.dim, marginTop: 8 }}>
        {current.conditionLabel} · feels {Math.round(current.feelsLikeC)}°
      </div>
    </div>
    <div style={{ position: "absolute", right: 70, top: 340, display: "flex", flexDirection: "column", gap: 30 }}>
      <BarGauge label="HUMIDITY" percent={current.humidityPercent} color={COLORS.primary} delay={20} />
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 14 }}>
        <WindIcon size={40} directionDeg={compassToDegrees(current.windDirection)} />
        <CountUp to={Math.round(current.windKph)} size={32} color={COLORS.text} suffix=" km/h" delay={34} />
      </div>
    </div>
  </Panel>
);

const ForecastBeat: React.FC<{ days: ForecastDay[] }> = ({ days }) => {
  const frame = useCurrentFrame();
  const maxTemp = Math.max(...days.map((d) => d.highC), 35);
  return (
    <Panel kicker="COMING UP">
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 400, display: "flex", flexDirection: "row", gap: 36, alignItems: "flex-end" }}>
        {days.map((day, i) => {
          const barHeight = interpolate(frame, [16 + i * 12, 46 + i * 12], [0, (day.highC / maxTemp) * 420], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div key={day.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 22, color: COLORS.secondary }}>
                {day.rainChancePercent}%
              </span>
              <div
                style={{
                  width: 64,
                  height: barHeight,
                  borderRadius: 10,
                  background: `linear-gradient(180deg, ${COLORS.primary}, ${COLORS.secondary})`,
                }}
              />
              <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 26, color: COLORS.text }}>
                {Math.round(day.highC)}°
              </span>
              <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 20, color: COLORS.dim }}>{day.label}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const ClosingBeat: React.FC<{ tip: string }> = ({ tip }) => (
  <Panel kicker="TAKEAWAY">
    <div style={{ position: "absolute", left: 80, top: 320, maxWidth: 760 }}>
      <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 52, lineHeight: 1.2, color: COLORS.secondary }}>
        {tip}
      </div>
    </div>
  </Panel>
);

const OutroBeat: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  return (
    <Panel>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 860,
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <LogoLockup size={60} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 960,
          fontFamily: monoFont,
          fontWeight: 700,
          fontSize: 28,
          color: COLORS.secondary,
          opacity: interpolate(frame, [20, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {subtitle}
      </div>
    </Panel>
  );
};

export const DataInfographicWeatherScenes: React.FC<WeatherScenesProps> = ({ content, durations, transitionLength }) => {
  const [introD, currentD, forecastD, closingD, outroD] = durations;
  const t = { durationInFrames: transitionLength };

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={introD}>
        <IntroBeat headline={content.introHeadline} location={content.location} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={currentD}>
        <CurrentBeat current={content.current} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={slide({ direction: "from-right" })} />

      <TransitionSeries.Sequence durationInFrames={forecastD}>
        <ForecastBeat days={content.forecastDays} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={wipe({ direction: "from-bottom" })} />

      <TransitionSeries.Sequence durationInFrames={closingD}>
        <ClosingBeat tip={content.closingTip} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={outroD}>
        <OutroBeat subtitle={content.outroSubtitle} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
