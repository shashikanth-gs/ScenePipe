// On-device TTS via macOS `say`. Free, offline, no API key — the default
// fallback that always works. Does not return word-level timestamps, so
// captions always go through the Whisper fallback (see scripts/voice/whisper.mjs).
import { execFileSync } from "node:child_process";
import os from "node:os";

export const id = "macos-say";

export const capabilities = {
  offline: true,
  nativeTimestamps: false,
  languages: ["en-US", "en-GB", "en-AU", "en-IN"],
  requiresEnv: [],
};

export function isAvailable() {
  return os.platform() === "darwin";
}

/**
 * Writes raw AIFF next to the suggested outPath — the caller (scripts/voice/index.mjs)
 * normalizes whatever format/extension a provider returns into the canonical
 * WAV format centrally, so providers don't need to agree on a format.
 *
 * @param {{ text: string, voice: string, outPath: string }} input
 * @returns {Promise<{ audioPath: string }>}
 */
export async function synthesize({ text, voice, outPath }) {
  if (!isAvailable()) {
    throw new Error("macos-say is only available on macOS");
  }
  const aiffPath = `${outPath}.aiff`;
  execFileSync("say", ["-v", voice || "Samantha", "-o", aiffPath, text]);
  return { audioPath: aiffPath };
}
