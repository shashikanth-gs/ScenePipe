import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { COLORS, BRAND_NAME } from "../../src/theme";
import { displayFont, monoFont } from "../../src/fonts";
import { NodeNetwork, BlockedPath, LoopDiagram, Connector } from "../../src/graphics";
import { LogoLockup } from "../../src/Logo";
import type { ComparisonTreatmentProps } from "../../templates/comparison/schema";
import type { ComparisonScenesProps } from "../../templates/comparison/styleTypes";

type Concept = ComparisonTreatmentProps["conceptA"];

export const ColdOpen: React.FC<{ conceptA: Concept; conceptB: Concept }> = ({ conceptA, conceptB }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.secondary }}>
      <div style={{ position: "absolute", right: -80, bottom: -40, opacity: 0.35 }}>
        <NodeNetwork width={640} height={640} color={COLORS.background} drawFrames={40} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 640, maxWidth: 900 }}>
        <div
          style={{
            fontFamily: monoFont,
            fontWeight: 700,
            fontSize: 26,
            color: COLORS.background,
            opacity: interpolate(frame, [0, 12], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            marginBottom: 20,
          }}
        >
          an {BRAND_NAME} explainer
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 100,
            lineHeight: 1.05,
            color: COLORS.primary,
            opacity: interpolate(frame, [4, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [4, 20], ["0px 24px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {conceptA.label} <span style={{ color: COLORS.background }}>vs</span>
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 100,
            lineHeight: 1.05,
            color: COLORS.background,
            opacity: interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [14, 30], ["0px 24px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {conceptB.label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CinematicHook: React.FC<{ question: string }> = ({ question }) => {
  const frame = useCurrentFrame();
  const words = question.split(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div style={{ position: "absolute", right: -60, bottom: 120, opacity: 0.5 }}>
        <NodeNetwork width={560} height={560} color={COLORS.text} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 300, maxWidth: 860 }}>
        <div
          style={{
            fontFamily: monoFont,
            fontWeight: 700,
            fontSize: 24,
            color: COLORS.secondary,
            marginBottom: 24,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          // question
        </div>
        <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 82, lineHeight: 1.1, color: COLORS.primary }}>
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              style={{
                display: "inline-block",
                marginRight: 18,
                opacity: interpolate(frame, [8 + i * 6, 18 + i * 6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: interpolate(frame, [8 + i * 6, 18 + i * 6], ["0px 30px", "0px 0px"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                }),
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CinematicConcept: React.FC<{
  concept: Concept;
  background: string;
  accent: string;
  textColor: string;
  kicker: string;
  headline: string;
  graphic: "network" | "loop";
}> = ({ concept, background, accent, textColor, kicker, headline, graphic }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      <div style={{ position: "absolute", right: graphic === "network" ? -100 : -40, top: 280, opacity: graphic === "network" ? 0.6 : 0.9 }}>
        {graphic === "network" ? (
          <NodeNetwork width={620} height={620} color={accent} />
        ) : (
          <LoopDiagram width={560} height={560} color={background === COLORS.background ? COLORS.text : COLORS.background} />
        )}
      </div>

      <div style={{ position: "absolute", left: 80, top: 220, maxWidth: 720 }}>
        <div
          style={{
            fontFamily: monoFont,
            fontWeight: 700,
            fontSize: 26,
            color: textColor,
            opacity: interpolate(frame, [0, 10], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            marginBottom: 20,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1.08,
            color: textColor,
            opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [6, 20], ["-24px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {headline}
        </div>
      </div>

      <div style={{ position: "absolute", left: 80, top: 1180, display: "flex", flexDirection: "column", gap: 14 }}>
        {concept.bullets.map((line, i) => (
          <div
            key={line}
            style={{
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 34,
              color: textColor,
              opacity: interpolate(frame, [30 + i * 12, 42 + i * 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(frame, [30 + i * 12, 42 + i * 12], ["-16px 0px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {`> ${line}`}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const CinematicLimitation: React.FC<{ label: string; blockedActions: string[] }> = ({
  label,
  blockedActions,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div style={{ position: "absolute", left: 80, top: 260, maxWidth: 780 }}>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1.08,
            color: COLORS.secondary,
            opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [0, 16], ["-24px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {label}
        </div>
      </div>

      <div style={{ position: "absolute", left: 140, top: 560, opacity: 0.9 }}>
        <BlockedPath width={760} height={140} color={COLORS.primary} accent={COLORS.secondary} />
      </div>

      <div style={{ position: "absolute", left: 80, top: 1180, display: "flex", flexDirection: "column", gap: 16 }}>
        {blockedActions.map((line, i) => (
          <div
            key={line}
            style={{
              position: "relative",
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 34,
              color: "#ffffff88",
              opacity: interpolate(frame, [46 + i * 10, 58 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {`> ${line}`}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 2,
                background: COLORS.secondary,
                scale: interpolate(frame, [58 + i * 10, 70 + i * 10], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  output: "perceptual-scale",
                }),
                transformOrigin: "left",
              }}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const CinematicAnalogy: React.FC<{
  intro: string;
  aLabel: string;
  aSub: string;
  bLabel: string;
  bSub: string;
  takeaway: string;
}> = ({ intro, aLabel, aSub, bLabel, bSub, takeaway }) => {
  const frame = useCurrentFrame();
  const nodeA = { x: 220, y: 460 };
  const nodeB = { x: 760, y: 1000 };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.primary }}>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 300,
          fontFamily: monoFont,
          fontWeight: 700,
          fontSize: 26,
          color: COLORS.background,
          opacity: interpolate(frame, [0, 10], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {intro}
      </div>

      <Connector x1={nodeA.x} y1={nodeA.y} x2={nodeB.x} y2={nodeB.y} color={COLORS.background} delay={16} />

      <div
        style={{
          position: "absolute",
          left: nodeA.x - 60,
          top: nodeA.y - 60,
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ width: 120, height: 120, borderRadius: 999, background: COLORS.text }} />
        <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 44, color: COLORS.text, marginTop: 18 }}>
          {aLabel}
        </div>
        <div style={{ fontFamily: monoFont, fontSize: 24, color: COLORS.background, opacity: 0.8 }}>{aSub}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: nodeB.x - 60,
          top: nodeB.y - 60,
          opacity: interpolate(frame, [38, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ width: 120, height: 120, borderRadius: 999, background: COLORS.secondary }} />
        <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 44, color: COLORS.background, marginTop: 18 }}>
          {bLabel}
        </div>
        <div style={{ fontFamily: monoFont, fontSize: 24, color: COLORS.background, opacity: 0.8 }}>{bSub}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1420,
          maxWidth: 780,
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.25,
          color: COLORS.background,
          opacity: interpolate(frame, [70, 86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {takeaway}
      </div>
    </AbsoluteFill>
  );
};

export const CinematicCloser: React.FC<{ lineA: string; lineB: string }> = ({ lineA, lineB }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div style={{ position: "absolute", left: -140, bottom: -80, opacity: 0.18 }}>
        <LoopDiagram width={640} height={640} color={COLORS.text} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 700, maxWidth: 900 }}>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.08,
            color: COLORS.primary,
            opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [0, 16], ["0px 24px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {lineA}
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.08,
            color: COLORS.secondary,
            marginTop: 6,
            opacity: interpolate(frame, [24, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [24, 40], ["0px 24px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {lineB}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CinematicOutro: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.text }}>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 860,
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [0, 18], [0.92, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
            output: "perceptual-scale",
          }),
        }}
      >
        <LogoLockup size={64} accent={COLORS.background} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 970,
          fontFamily: monoFont,
          fontWeight: 700,
          fontSize: 30,
          color: COLORS.secondary,
          opacity: interpolate(frame, [20, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {subtitle}
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 30,
            background: COLORS.background,
            marginLeft: 8,
            opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
            verticalAlign: "middle",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const CinematicComparisonScenes: React.FC<ComparisonScenesProps> = ({ content, durations, transitionLength }) => {
  const [coldOpenD, hookD, conceptD, limitD, wrapD, analogyD, closerD, outroD] = durations;
  const t = { durationInFrames: transitionLength };

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={coldOpenD}>
        <ColdOpen conceptA={content.conceptA} conceptB={content.conceptB} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={slide({ direction: "from-right" })} />

      <TransitionSeries.Sequence durationInFrames={hookD}>
        <CinematicHook question={content.hookQuestion} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={wipe({ direction: "from-left" })} />

      <TransitionSeries.Sequence durationInFrames={conceptD}>
        <CinematicConcept
          concept={content.conceptA}
          background={COLORS.primary}
          accent={COLORS.secondary}
          textColor={COLORS.text}
          kicker="01 / concept A"
          headline={`${content.conceptA.label} = ${content.hookSubtitle}`}
          graphic="network"
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={slide({ direction: "from-bottom" })} />

      <TransitionSeries.Sequence durationInFrames={limitD}>
        <CinematicLimitation label={content.limitation.label} blockedActions={content.limitation.blockedActions} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={wrapD}>
        <CinematicConcept
          concept={content.conceptB}
          background={COLORS.secondary}
          accent={COLORS.background}
          textColor={COLORS.background}
          kicker="02 / concept B"
          headline={content.conceptB.label}
          graphic="loop"
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={slide({ direction: "from-right" })} />

      <TransitionSeries.Sequence durationInFrames={analogyD}>
        <CinematicAnalogy
          intro={content.analogy.intro}
          aLabel={content.analogy.aLabel}
          aSub={content.analogy.aSub}
          bLabel={content.analogy.bLabel}
          bSub={content.analogy.bSub}
          takeaway={content.analogy.takeaway}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={wipe({ direction: "from-bottom" })} />

      <TransitionSeries.Sequence durationInFrames={closerD}>
        <CinematicCloser lineA={content.closer.lineA} lineB={content.closer.lineB} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={linearTiming(t)} presentation={fade()} />

      <TransitionSeries.Sequence durationInFrames={outroD}>
        <CinematicOutro subtitle={content.outroSubtitle} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
