// Content-addressed cache: identical (text, voice, provider, language) never
// gets re-synthesized. Keying the provider into the hash means switching
// providers can never accidentally reuse another vendor's cached audio.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "voice");

function keyFor({ text, voice, provider, language }) {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ text, voice, provider, language }))
    .digest("hex")
    .slice(0, 24);
  return hash;
}

export function cachePaths(input) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const key = keyFor(input);
  return {
    key,
    audioPath: path.join(CACHE_DIR, `${key}.wav`),
    captionsPath: path.join(CACHE_DIR, `${key}.captions.json`),
  };
}

export function isCached({ audioPath, captionsPath }) {
  return fs.existsSync(audioPath) && fs.existsSync(captionsPath);
}
