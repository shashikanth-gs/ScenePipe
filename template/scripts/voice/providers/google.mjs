// Google Cloud Text-to-Speech — cloud, needs GOOGLE_APPLICATION_CREDENTIALS
// (a service-account JSON path) or GOOGLE_TTS_API_KEY. The basic synthesize
// call doesn't return word timestamps, so this always goes through the
// Whisper fallback for captions.
//
// NOTE: implemented against the documented Google Cloud TTS REST API shape
// but not exercised against live credentials in this repo — verify against
// https://cloud.google.com/text-to-speech/docs before relying on it in
// production. Using GOOGLE_TTS_API_KEY (API-key auth) here for simplicity;
// swap to a signed service-account token if your setup requires it.
import fs from "node:fs/promises";

export const id = "google";

export const capabilities = {
  offline: false,
  nativeTimestamps: false,
  languages: ["multi"],
  requiresEnv: ["GOOGLE_TTS_API_KEY"],
};

export function isAvailable() {
  return Boolean(process.env.GOOGLE_TTS_API_KEY);
}

/**
 * @param {{ text: string, voice: string, language: string, outPath: string }} input
 * @returns {Promise<{ audioPath: string }>}
 */
export async function synthesize({ text, voice, language, outPath }) {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: language || "en-US", name: voice || "en-US-Neural2-F" },
        audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 24000 },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Google TTS API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const audioBuffer = Buffer.from(data.audioContent, "base64");
  await fs.writeFile(outPath, audioBuffer);

  return { audioPath: outPath };
}
