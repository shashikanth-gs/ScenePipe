// Minimal WAV utilities — no dependency needed. Parses RIFF chunks properly
// (not a fixed 44-byte header assumption) so it tolerates extra chunks some
// encoders add (LIST, fact, etc).
import fs from "node:fs";
import { execFileSync } from "node:child_process";

export function which(cmd) {
  try {
    execFileSync("which", [cmd], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts ANY input audio (mp3, differently-rated wav, etc.) into a
 * canonical 16-bit PCM mono WAV at the given sample rate. Every provider's
 * output gets normalized through this before concatenation, so a mismatched
 * format from one vendor can never silently corrupt the final audio.
 */
export function convertToWav(inputPath, outputPath, sampleRate) {
  if (which("ffmpeg")) {
    execFileSync("ffmpeg", ["-y", "-i", inputPath, "-ar", String(sampleRate), "-ac", "1", outputPath], {
      stdio: "ignore",
    });
  } else if (which("afconvert")) {
    execFileSync("afconvert", [inputPath, outputPath, "-d", `LEI16@${sampleRate}`, "-c", "1", "-f", "WAVE"]);
  } else {
    throw new Error("Need either ffmpeg or afconvert (macOS) on PATH to normalize audio format.");
  }
  return outputPath;
}

function readChunks(buffer) {
  const chunks = {};
  let offset = 12; // past "RIFF"<size>"WAVE"
  while (offset + 8 <= buffer.length) {
    // RIFF chunk IDs are padded to 4 bytes (the format chunk's literal ID is
    // "fmt " with a trailing space) — trim so callers can use `chunks.fmt`.
    const id = buffer.toString("ascii", offset, offset + 4).trim();
    const size = buffer.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    chunks[id] = { start: dataStart, size };
    offset = dataStart + size + (size % 2); // chunks are word-aligned
  }
  return chunks;
}

function readWav(path) {
  const buffer = fs.readFileSync(path);
  const chunks = readChunks(buffer);
  if (!chunks.fmt || !chunks.data) {
    throw new Error(`${path} doesn't look like a valid WAV file (missing fmt/data chunk)`);
  }
  const fmt = {
    audioFormat: buffer.readUInt16LE(chunks.fmt.start),
    channels: buffer.readUInt16LE(chunks.fmt.start + 2),
    sampleRate: buffer.readUInt32LE(chunks.fmt.start + 4),
    bitsPerSample: buffer.readUInt16LE(chunks.fmt.start + 14),
  };
  const data = buffer.subarray(chunks.data.start, chunks.data.start + chunks.data.size);
  return { fmt, data };
}

/** Exact duration in ms, computed from the data chunk size — not an estimate. */
export function getWavDurationMs(path) {
  const { fmt, data } = readWav(path);
  const bytesPerSecond = fmt.sampleRate * fmt.channels * (fmt.bitsPerSample / 8);
  return (data.length / bytesPerSecond) * 1000;
}

function writeWavHeader(dataLength, fmt) {
  const header = Buffer.alloc(44);
  const byteRate = fmt.sampleRate * fmt.channels * (fmt.bitsPerSample / 8);
  const blockAlign = fmt.channels * (fmt.bitsPerSample / 8);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(fmt.audioFormat, 20);
  header.writeUInt16LE(fmt.channels, 22);
  header.writeUInt32LE(fmt.sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(fmt.bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataLength, 40);
  return header;
}

/**
 * Concatenates WAV files that all share the same format (sample rate,
 * channels, bit depth — true for every file produced by one job, since
 * they all come from the same provider/voice). Throws if formats mismatch,
 * rather than silently producing garbled audio.
 */
export function concatWavFiles(paths, outPath) {
  const parsed = paths.map(readWav);
  const [{ fmt: referenceFmt }] = parsed;

  parsed.forEach(({ fmt }, i) => {
    const mismatch =
      fmt.sampleRate !== referenceFmt.sampleRate ||
      fmt.channels !== referenceFmt.channels ||
      fmt.bitsPerSample !== referenceFmt.bitsPerSample;
    if (mismatch) {
      throw new Error(
        `Cannot concatenate WAV files with different formats (file ${i}: ${JSON.stringify(fmt)} vs ${JSON.stringify(referenceFmt)}). Normalize audio format in the provider before returning.`,
      );
    }
  });

  const dataBuffers = parsed.map((p) => p.data);
  const totalDataLength = dataBuffers.reduce((sum, d) => sum + d.length, 0);
  const header = writeWavHeader(totalDataLength, referenceFmt);
  fs.writeFileSync(outPath, Buffer.concat([header, ...dataBuffers]));
}
