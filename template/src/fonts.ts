// Fonts are loaded statically on purpose — @remotion/google-fonts needs a
// static import per font so the bundler can tree-shake correctly.
//
// To change your brand fonts: edit the three imports below to match the
// `fonts.display` / `fonts.body` / `fonts.mono` values in brand/brand-kit.json,
// then update the import paths (e.g. "@remotion/google-fonts/Poppins"). This
// is a deterministic, one-time edit — not something the AI should ever touch.
import { loadFont as loadDisplayFont } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBodyFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadMonoFont } from "@remotion/google-fonts/JetBrainsMono";
import brandKit from "../brand/brand-kit.json";

export const { fontFamily: displayFont } = loadDisplayFont("normal", {
  weights: brandKit.fonts.display.weights as ("500" | "700")[],
  subsets: ["latin"],
});

export const { fontFamily: bodyFont } = loadBodyFont("normal", {
  weights: brandKit.fonts.body.weights as ("400" | "600" | "800")[],
  subsets: ["latin"],
});

export const { fontFamily: monoFont } = loadMonoFont("normal", {
  weights: brandKit.fonts.mono.weights as ("400" | "700")[],
  subsets: ["latin"],
});
