import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { COLORS, BRAND_NAME } from "../../src/theme";
import { displayFont, monoFont } from "../../src/fonts";
import type { ComparisonScenesProps } from "../../templates/comparison/styleTypes";

// A single word/phrase that punches into frame (scale + slight rotate
// overshoot) and holds. The whole point of this style: the type itself is
// the only graphic — no cards, no icons, no generated diagrams.
const Punch: React.FC<{
  text: string;
  from: number;
  size: number;
  color: string;
  rotateDeg?: number;
}> = ({ text, from, size, color, rotateDeg = 0 }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [from, from + 10, from + 16], [0, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const opacity = interpolate(frame, [from, from + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(frame, [from, from + 16], [rotateDeg, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        fontFamily: displayFont,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.05,
        color,
        textAlign: "center",
        scale,
        rotate: `${rotate}deg`,
        opacity,
      }}
    >
      {text}
    </div>
  );
};

const Stage: React.FC<{ children: React.ReactNode; kicker?: string }> = ({ children, kicker }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center", padding: "0 90px" }}>
      {kicker && (
        <div
          style={{
            position: "absolute",
            top: 300,
            fontFamily: monoFont,
            fontWeight: 700,
            fontSize: 24,
            color: COLORS.dim,
            opacity: interpolate(frame, [0, 10], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {kicker}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>{children}</div>
    </AbsoluteFill>
  );
};

const ColdOpen: React.FC<{ conceptA: string; conceptB: string }> = ({ conceptA, conceptB }) => (
  <Stage>
    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 24, color: COLORS.secondary, marginBottom: 20 }}>
      an {BRAND_NAME} explainer
    </div>
    <Punch text={conceptA} from={4} size={110} color={COLORS.primary} rotateDeg={-6} />
    <Punch text="vs" from={16} size={60} color={COLORS.dim} />
    <Punch text={conceptB} from={26} size={110} color={COLORS.secondary} rotateDeg={6} />
  </Stage>
);

const Hook: React.FC<{ question: string }> = ({ question }) => {
  const words = question.split(" ");
  const chunkSize = 2;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) chunks.push(words.slice(i, i + chunkSize).join(" "));

  return (
    <Stage>
      {chunks.map((chunk, i) => (
        <Punch
          key={chunk}
          text={chunk}
          from={i * 16}
          size={92}
          color={i % 2 === 0 ? COLORS.primary : COLORS.text}
          rotateDeg={i % 2 === 0 ? -4 : 4}
        />
      ))}
    </Stage>
  );
};

const ConceptBeat: React.FC<{ label: string; bullets: string[]; accent: string }> = ({ label, bullets, accent }) => (
  <Stage>
    <Punch text={label} from={4} size={104} color={accent} />
    <div style={{ display: "flex", flexDirection: "row", gap: 24, marginTop: 30 }}>
      {bullets.map((b, i) => (
        <Punch key={b} text={b} from={26 + i * 12} size={40} color={COLORS.text} />
      ))}
    </div>
  </Stage>
);

const LimitationBeat: React.FC<{ label: string; blockedActions: string[] }> = ({ label, blockedActions }) => (
  <Stage>
    <Punch text={label} from={4} size={84} color={COLORS.secondary} rotateDeg={-3} />
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 30 }}>
      {blockedActions.map((b, i) => (
        <Punch key={b} text={`not ${b.toLowerCase()}`} from={26 + i * 14} size={34} color={COLORS.dim} />
      ))}
    </div>
  </Stage>
);

const AnalogyBeat: React.FC<{ aLabel: string; bLabel: string; takeaway: string }> = ({ aLabel, bLabel, takeaway }) => (
  <Stage>
    <Punch text={aLabel} from={4} size={90} color={COLORS.primary} rotateDeg={-5} />
    <Punch text="+" from={16} size={50} color={COLORS.dim} />
    <Punch text={bLabel} from={24} size={90} color={COLORS.secondary} rotateDeg={5} />
    <div style={{ marginTop: 34 }}>
      <Punch text={takeaway} from={50} size={36} color={COLORS.text} />
    </div>
  </Stage>
);

const CloserBeat: React.FC<{ lineA: string; lineB: string }> = ({ lineA, lineB }) => (
  <Stage>
    <Punch text={lineA} from={2} size={98} color={COLORS.primary} rotateDeg={-4} />
    <Punch text={lineB} from={22} size={98} color={COLORS.secondary} rotateDeg={4} />
  </Stage>
);

const OutroBeat: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <Stage>
    <Punch text={BRAND_NAME} size={64} from={2} color={COLORS.text} />
    <div style={{ marginTop: 20 }}>
      <Punch text={subtitle} from={20} size={30} color={COLORS.secondary} />
    </div>
  </Stage>
);

export const KineticTypographyComparisonScenes: React.FC<ComparisonScenesProps> = ({
  content,
  durations,
  transitionLength,
}) => {
  const [coldOpenD, hookD, conceptD, limitD, wrapD, analogyD, closerD, outroD] = durations;
  const t = { durationInFrames: transitionLength };

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={coldOpenD}>
        <ColdOpen conceptA={content.conceptA.label} conceptB={content.conceptB.label} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={hookD}>
        <Hook question={content.hookQuestion} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={slide({ direction: "from-right" })} />

      <TransitionSeries.Sequence durationInFrames={conceptD}>
        <ConceptBeat label={content.conceptA.label} bullets={content.conceptA.bullets} accent={COLORS.primary} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={limitD}>
        <LimitationBeat label={content.limitation.label} blockedActions={content.limitation.blockedActions} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={slide({ direction: "from-left" })} />

      <TransitionSeries.Sequence durationInFrames={wrapD}>
        <ConceptBeat label={content.conceptB.label} bullets={content.conceptB.bullets} accent={COLORS.secondary} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={analogyD}>
        <AnalogyBeat aLabel={content.analogy.aLabel} bLabel={content.analogy.bLabel} takeaway={content.analogy.takeaway} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={slide({ direction: "from-right" })} />

      <TransitionSeries.Sequence durationInFrames={closerD}>
        <CloserBeat lineA={content.closer.lineA} lineB={content.closer.lineB} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={outroD}>
        <OutroBeat subtitle={content.outroSubtitle} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
