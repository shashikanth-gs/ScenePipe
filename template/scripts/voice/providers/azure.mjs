// Azure Cognitive Services Speech — cloud, needs AZURE_SPEECH_KEY +
// AZURE_SPEECH_REGION. This uses the plain REST synthesize endpoint (SSML in,
// audio bytes out). Azure's SDK *can* stream word-boundary events, but that
// requires the heavier @azure/... SDK over a websocket rather than a simple
// REST call — not implemented here to avoid an unverified dependency, so this
// provider always goes through the Whisper fallback for captions.
//
// NOTE: implemented against the documented Azure Speech REST API shape but
// not exercised against a live key in this repo — verify against
// https://learn.microsoft.com/azure/ai-services/speech-service before relying
// on it in production.
import fs from "node:fs/promises";

export const id = "azure";

export const capabilities = {
  offline: false,
  nativeTimestamps: false,
  languages: ["multi"], // voice-dependent
  requiresEnv: ["AZURE_SPEECH_KEY", "AZURE_SPEECH_REGION"],
};

export function isAvailable() {
  return Boolean(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION);
}

function escapeSsml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * @param {{ text: string, voice: string, language: string, outPath: string }} input
 * @returns {Promise<{ audioPath: string }>}
 */
export async function synthesize({ text, voice, language, outPath }) {
  const region = process.env.AZURE_SPEECH_REGION;
  const lang = language || "en-US";
  const voiceName = voice || "en-US-JennyNeural";

  const ssml = `<speak version="1.0" xml:lang="${lang}"><voice name="${voiceName}">${escapeSsml(text)}</voice></speak>`;

  const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
    },
    body: ssml,
  });

  if (!response.ok) {
    throw new Error(`Azure Speech API error: ${response.status} ${await response.text()}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outPath, audioBuffer);

  return { audioPath: outPath };
}
