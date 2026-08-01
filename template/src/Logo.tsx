import { CanvasImage, staticFile } from "remotion";
import { monoFont } from "./fonts";
import { COLORS, BRAND_NAME, LOGO } from "./theme";

// The mark is loaded as an actual asset (not reconstructed as JSX) so any
// brand's real logo file works here unmodified. The wordmark is rebuilt as
// text using the project's own loaded mono font, rather than trusting an
// arbitrary uploaded SVG's embedded <text> to render correctly — fonts
// inside an <img>-loaded SVG don't inherit the page's loaded @font-face
// fonts, only the mark (pure vector shapes) is safe to load that way.
export const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <CanvasImage src={staticFile(LOGO.mark)} style={{ width: size, height: size }} />
);

export const LogoLockup: React.FC<{ size: number; accent?: string }> = ({ size, accent = COLORS.highlight }) => (
  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: size * 0.3 }}>
    <LogoMark size={size} />
    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: size * 0.55, color: accent, letterSpacing: -1 }}>
      {BRAND_NAME}
    </div>
  </div>
);
