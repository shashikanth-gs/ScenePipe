import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont } from "./fonts";
import { COLORS } from "./theme";
import { LogoMark } from "./Logo";

function formatTimecode(frame: number, fps: number) {
  const totalSeconds = frame / fps;
  const mm = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const ss = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  const ff = Math.floor(frame % fps).toString().padStart(2, "0");
  return `${mm}:${ss}:${ff}`;
}

// Persistent "real editor" chrome: a small corner logo mark, a running
// timecode, and a bottom scrubber bar. Brand-agnostic — reads the logo and
// accent color from brand-kit.json.
export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 56, left: 56 }}>
        <LogoMark size={44} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 68,
          right: 56,
          fontFamily: monoFont,
          fontWeight: 400,
          fontSize: 22,
          color: "#ffffff88",
          letterSpacing: 1,
        }}
      >
        {formatTimecode(frame, fps)}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, width, height: 3, background: "#ffffff22" }}>
        <div style={{ width: width * progress, height: "100%", background: COLORS.highlight }} />
      </div>
    </AbsoluteFill>
  );
};
