// Sarvam AI TTS — cloud, needs SARVAM_API_KEY. Strong option for English +
// Indian-language narration. Does not return word-level timestamps, so
// captions always go through the Whisper fallback.
//
// NOTE: implemented against the documented Sarvam TTS REST API shape but not
// exercised against a live key in this repo — verify request/response shape
// against https://docs.sarvam.ai before relying on it in production.
import fs from "node:fs/promises";

export const id = "sarvam";

export const capabilities = {
  offline: false,
  nativeTimestamps: false,
  languages: ["en-IN", "hi-IN", "ta-IN", "te-IN", "kn-IN", "ml-IN", "bn-IN", "gu-IN", "mr-IN", "pa-IN", "od-IN"],
  requiresEnv: ["SARVAM_API_KEY"],
};

export function isAvailable() {
  return Boolean(process.env.SARVAM_API_KEY);
}

/**
 * @param {{ text: string, voice: string, language: string, outPath: string }} input
 * @returns {Promise<{ audioPath: string }>}
 */
export async function synthesize({ text, voice, language, outPath }) {
  const response = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "API-Subscription-Key": process.env.SARVAM_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: language || "en-IN",
      speaker: voice || "meera",
      speech_sample_rate: 22050,
    }),
  });

  if (!response.ok) {
    throw new Error(`Sarvam API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const audioBuffer = Buffer.from(data.audios[0], "base64");
  await fs.writeFile(outPath, audioBuffer);

  return { audioPath: outPath };
}
