import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { COLORS, BRAND_NAME } from "../../src/theme";
import { displayFont, monoFont } from "../../src/fonts";
import type { ComparisonScenesProps } from "../../templates/comparison/styleTypes";

// Cheap deterministic pseudo-random from a frame number — no Math.random()
// so renders are always reproducible frame-for-frame.
function hashFrame(frame: number, salt: number) {
  const x = Math.sin(frame * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const ScanLines: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      backgroundImage: "repeating-linear-gradient(0deg, #00000055 0px, #00000055 1px, transparent 1px, transparent 3px)",
      opacity: 0.35,
      mixBlendMode: "multiply",
    }}
  />
);

const RecBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 12) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        right: 130,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: monoFont,
        fontWeight: 700,
        fontSize: 24,
        color: COLORS.secondary,
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 999, background: COLORS.secondary, opacity: blink ? 1 : 0.2 }} />
      REC
    </div>
  );
};

/** Occasional brief rectangular tracking-error flashes — deterministic, not random-per-render. */
const GlitchFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = frame % 50;
  const active = cycle < 3;
  if (!active) return null;
  const y = hashFrame(frame, 1) * 1700;
  const h = 20 + hashFrame(frame, 2) * 60;
  const xOffset = (hashFrame(frame, 3) - 0.5) * 40;
  return (
    <div
      style={{
        position: "absolute",
        left: xOffset,
        right: -xOffset,
        top: y,
        height: h,
        background: COLORS.text,
        opacity: 0.06,
        mixBlendMode: "difference",
      }}
    />
  );
};

const GlitchHeadline: React.FC<{ text: string; size: number; color: string; from: number }> = ({
  text,
  size,
  color,
  from,
}) => {
  const frame = useCurrentFrame();
  const settled = frame > from + 14;
  const jitter = settled ? 0 : hashFrame(frame, 7) * 10 - 5;
  const opacity = interpolate(frame, [from, from + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aberration = interpolate(frame, [from, from + 20], [6, 1.5], {
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
        lineHeight: 1.08,
        color,
        opacity,
        translate: `${jitter}px 0px`,
        textShadow: `-${aberration}px 0 ${COLORS.secondary}, ${aberration}px 0 ${COLORS.primary}`,
      }}
    >
      {text}
    </div>
  );
};

const Reel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
    <div style={{ position: "absolute", left: 80, top: 260, maxWidth: 860 }}>{children}</div>
    <ScanLines />
    <GlitchFlash />
    <RecBadge />
  </AbsoluteFill>
);

const ColdOpen: React.FC<{ conceptA: string; conceptB: string }> = ({ conceptA, conceptB }) => (
  <Reel>
    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 24, color: COLORS.dim, marginBottom: 20 }}>
      an {BRAND_NAME} explainer // rec
    </div>
    <GlitchHeadline text={`${conceptA} vs`} size={92} color={COLORS.primary} from={4} />
    <GlitchHeadline text={conceptB} size={92} color={COLORS.text} from={16} />
  </Reel>
);

const Hook: React.FC<{ question: string }> = ({ question }) => (
  <Reel>
    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 24, color: COLORS.secondary, marginBottom: 20 }}>
      // signal check
    </div>
    <GlitchHeadline text={question} size={78} color={COLORS.primary} from={6} />
  </Reel>
);

const ConceptBeat: React.FC<{ label: string; bullets: string[]; accent: string }> = ({ label, bullets, accent }) => {
  const frame = useCurrentFrame();
  return (
    <Reel>
      <GlitchHeadline text={label} size={82} color={accent} from={4} />
      <div style={{ display: "flex", flexDirection: "row", gap: 20, marginTop: 34 }}>
        {bullets.map((b, i) => (
          <div
            key={b}
            style={{
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 30,
              color: COLORS.text,
              padding: "12px 22px",
              border: `1.5px solid ${accent}66`,
              opacity: interpolate(frame, [30 + i * 10, 42 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {`[${b}]`}
          </div>
        ))}
      </div>
    </Reel>
  );
};

const LimitationBeat: React.FC<{ label: string; blockedActions: string[] }> = ({ label, blockedActions }) => {
  const frame = useCurrentFrame();
  return (
    <Reel>
      <GlitchHeadline text={`ERROR: ${label}`} size={72} color={COLORS.secondary} from={4} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 30 }}>
        {blockedActions.map((b, i) => (
          <div
            key={b}
            style={{
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 28,
              color: COLORS.dim,
              opacity: interpolate(frame, [30 + i * 12, 42 + i * 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {`404 :: ${b}`}
          </div>
        ))}
      </div>
    </Reel>
  );
};

const AnalogyBeat: React.FC<{ intro: string; aLabel: string; bLabel: string; takeaway: string }> = ({
  intro,
  aLabel,
  bLabel,
  takeaway,
}) => {
  const frame = useCurrentFrame();
  return (
    <Reel>
      <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 24, color: COLORS.dim, marginBottom: 20 }}>{intro}</div>
      <GlitchHeadline text={aLabel} size={64} color={COLORS.primary} from={6} />
      <GlitchHeadline text={bLabel} size={64} color={COLORS.secondary} from={22} />
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 32,
          color: COLORS.text,
          marginTop: 30,
          opacity: interpolate(frame, [46, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {takeaway}
      </div>
    </Reel>
  );
};

const CloserBeat: React.FC<{ lineA: string; lineB: string }> = ({ lineA, lineB }) => (
  <Reel>
    <GlitchHeadline text={lineA} size={90} color={COLORS.primary} from={2} />
    <GlitchHeadline text={lineB} size={90} color={COLORS.secondary} from={18} />
  </Reel>
);

const OutroBeat: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <Reel>
    <GlitchHeadline text={BRAND_NAME} size={56} color={COLORS.text} from={2} />
    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 28, color: COLORS.secondary, marginTop: 18 }}>
      {subtitle}
    </div>
  </Reel>
);

export const GlitchTapeComparisonScenes: React.FC<ComparisonScenesProps> = ({ content, durations, transitionLength }) => {
  const [coldOpenD, hookD, conceptD, limitD, wrapD, analogyD, closerD, outroD] = durations;
  const t = { durationInFrames: transitionLength };

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={coldOpenD}>
        <ColdOpen conceptA={content.conceptA.label} conceptB={content.conceptB.label} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={wipe({ direction: "from-left" })} />

      <TransitionSeries.Sequence durationInFrames={hookD}>
        <Hook question={content.hookQuestion} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={conceptD}>
        <ConceptBeat label={content.conceptA.label} bullets={content.conceptA.bullets} accent={COLORS.primary} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={wipe({ direction: "from-bottom" })} />

      <TransitionSeries.Sequence durationInFrames={limitD}>
        <LimitationBeat label={content.limitation.label} blockedActions={content.limitation.blockedActions} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={wrapD}>
        <ConceptBeat label={content.conceptB.label} bullets={content.conceptB.bullets} accent={COLORS.secondary} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={wipe({ direction: "from-left" })} />

      <TransitionSeries.Sequence durationInFrames={analogyD}>
        <AnalogyBeat
          intro={content.analogy.intro}
          aLabel={content.analogy.aLabel}
          bLabel={content.analogy.bLabel}
          takeaway={content.analogy.takeaway}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={closerD}>
        <CloserBeat lineA={content.closer.lineA} lineB={content.closer.lineB} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={wipe({ direction: "from-bottom" })} />

      <TransitionSeries.Sequence durationInFrames={outroD}>
        <OutroBeat subtitle={content.outroSubtitle} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
