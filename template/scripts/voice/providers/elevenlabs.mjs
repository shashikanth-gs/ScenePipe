// ElevenLabs TTS — cloud, needs ELEVENLABS_API_KEY. Uses the "with-timestamps"
// endpoint, which returns character-level alignment alongside the audio. We
// collapse that into word-level timestamps so it can skip the Whisper
// fallback entirely when `preferNativeTimestamps` is set in scenepipe.config.json.
//
// NOTE: implemented against the documented ElevenLabs REST API shape but not
// exercised against a live key in this repo — verify the response shape
// against https://elevenlabs.io/docs before relying on it in production.
import fs from "node:fs/promises";

export const id = "elevenlabs";

export const capabilities = {
  offline: false,
  nativeTimestamps: true,
  languages: ["multi"], // model-dependent; see ELEVENLABS_MODEL_ID
  requiresEnv: ["ELEVENLABS_API_KEY"],
};

export function isAvailable() {
  return Boolean(process.env.ELEVENLABS_API_KEY);
}

function charTimestampsToWords(text, characters, startTimes, endTimes) {
  const words = [];
  let wordStart = null;
  let wordChars = "";

  const flush = (endIdx) => {
    if (wordChars.trim().length === 0) return;
    words.push({
      word: wordChars,
      startMs: Math.round(wordStart * 1000),
      endMs: Math.round(endTimes[endIdx] * 1000),
    });
    wordChars = "";
    wordStart = null;
  };

  characters.forEach((char, i) => {
    if (/\s/.test(char)) {
      flush(i - 1);
    } else {
      if (wordStart === null) wordStart = startTimes[i];
      wordChars += char;
    }
  });
  flush(characters.length - 1);

  return words;
}

/**
 * @param {{ text: string, voice: string, outPath: string }} input
 * @returns {Promise<{ audioPath: string, nativeTimestamps: Array<{word:string,startMs:number,endMs:number}> }>}
 */
export async function synthesize({ text, voice, outPath }) {
  const voiceId = voice; // pass an ElevenLabs voice_id via scenepipe.config.json `voice.voice`
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, model_id: modelId }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  await fs.writeFile(outPath, audioBuffer);

  const alignment = data.alignment ?? data.normalized_alignment;
  const nativeTimestamps = alignment
    ? charTimestampsToWords(text, alignment.characters, alignment.character_start_times_seconds, alignment.character_end_times_seconds)
    : undefined;

  return { audioPath: outPath, nativeTimestamps };
}
