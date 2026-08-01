// The universal, deterministic captioning backbone. Every voice provider's
// audio routes through here for word-level caption timing UNLESS the
// provider returned trustworthy native timestamps and
// scenepipe.config.json's voice.preferNativeTimestamps is true. On-device,
// free, no API key — this is what makes captions work no matter which TTS
// vendor produced the narration.
import fs from "node:fs";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import { convertToWav } from "./audio.mjs";

const WHISPER_VERSION = "1.5.5";
const MODEL = "medium.en";

/**
 * @param {string} audioPath - path to the narration audio (any common format)
 * @param {string} whisperDir - where whisper.cpp + models live (shared across jobs)
 * @returns {Promise<import("@remotion/captions").Caption[]>}
 */
export async function transcribeToCaptions(audioPath, whisperDir) {
  await installWhisperCpp({ to: whisperDir, version: WHISPER_VERSION });
  await downloadWhisperModel({ model: MODEL, folder: whisperDir });

  const wav16k = convertToWav(audioPath, audioPath.replace(/\.[^.]+$/, ".16k.wav"), 16000);

  const whisperCppOutput = await transcribe({
    model: MODEL,
    whisperPath: whisperDir,
    whisperCppVersion: WHISPER_VERSION,
    inputPath: wav16k,
    tokenLevelTimestamps: true,
  });

  fs.rmSync(wav16k, { force: true });

  const { captions } = toCaptions({ whisperCppOutput });
  return captions;
}
