import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../src/theme";
import type { ConditionCategory } from "./icons";

const SKY_GRADIENTS: Record<ConditionCategory, string> = {
  sunny: `radial-gradient(circle at 50% 15%, #2a2410 0%, ${COLORS.background} 55%, ${COLORS.background} 100%)`,
  "partly-cloudy": `radial-gradient(circle at 50% 18%, ${COLORS.backgroundMid} 0%, ${COLORS.background} 50%, ${COLORS.background} 100%)`,
  cloudy: `radial-gradient(circle at 50% 20%, #1c2230 0%, ${COLORS.background} 55%, ${COLORS.background} 100%)`,
  rainy: `radial-gradient(circle at 50% 20%, #0e1c30 0%, ${COLORS.background} 55%, ${COLORS.background} 100%)`,
};

export const Sky: React.FC<{ category: ConditionCategory }> = ({ category }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill name="Sky" style={{ background: SKY_GRADIENTS[category] }}>
      <AbsoluteFill
        name="Drift"
        style={{
          opacity: 0.1,
          backgroundImage:
            "radial-gradient(circle, #ffffff33 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          translate: interpolate(frame, [0, durationInFrames], ["0px 0px", "-120px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <AbsoluteFill
        name="Vignette"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 55%, ${COLORS.background} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
