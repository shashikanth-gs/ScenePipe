#!/usr/bin/env node
// Deterministic. No AI runs anywhere in this file. Given a job slug, this:
//   1. validates content/<slug>/content-model.json against the treatment's schema
//   2. synthesizes narration + captions via scripts/voice (provider-agnostic)
//   3. computes exact scene frame boundaries from real caption timestamps
//   4. renders the matching Remotion composition
//   5. writes content/<slug>/status.json at every phase for a live dashboard
import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { narrateBeats } from "./voice/index.mjs";
import { startJob, setPhase, addOutput, failJob } from "./status.mjs";
import * as comparisonContentModel from "../templates/comparison/contentModel.schema.mjs";
import * as weatherReportContentModel from "../templates/weather-report/contentModel.schema.mjs";

const PROJECT_ROOT = process.cwd();

const envPath = path.join(PROJECT_ROOT, ".env");
if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath); // Node 20.6+ built-in, no dependency needed
}

// Every registered treatment's content-model schema + the two functions that
// turn a validated model into the Remotion props shape. Add an entry here
// (and to COMPOSITION_IDS below) whenever a new treatment is hand-authored.
const TREATMENT_CONTENT_MODELS = {
  comparison: comparisonContentModel,
  "weather-report": weatherReportContentModel,
};

const COMPOSITION_IDS = {
  "instagram-reel-comparison": { platform: "instagram", assetType: "reel", treatment: "comparison" },
  "instagram-reel-weather-report": { platform: "instagram", assetType: "reel", treatment: "weather-report" },
};

function findCompositionId(platform, assetType, treatment) {
  const entry = Object.entries(COMPOSITION_IDS).find(
    ([, v]) => v.platform === platform && v.assetType === assetType && v.treatment === treatment,
  );
  if (!entry) {
    throw new Error(
      `No composition registered for platform="${platform}" assetType="${assetType}" treatment="${treatment}". ` +
        `Add it to COMPOSITION_IDS in scripts/render.mjs once that treatment/asset combo exists.`,
    );
  }
  return entry[0];
}

async function renderJob(slug) {
  const jobDir = path.join(PROJECT_ROOT, "content", slug);
  const modelPath = path.join(jobDir, "content-model.json");

  if (!fs.existsSync(modelPath)) {
    throw new Error(`No content model found at ${modelPath}`);
  }

  const config = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, "scenepipe.config.json"), "utf8"));
  const rawModel = JSON.parse(fs.readFileSync(modelPath, "utf8"));

  startJob(jobDir, { slug, platform: rawModel.platform, assetType: rawModel.assetType, treatment: rawModel.treatment });

  try {
    setPhase(jobDir, "validating");
    const contentModel = TREATMENT_CONTENT_MODELS[rawModel.treatment];
    if (!contentModel) {
      throw new Error(`Unknown treatment "${rawModel.treatment}" — no content-model schema registered for it.`);
    }
    const model = contentModel.contentModelSchema.parse(rawModel); // throws with a precise message on any mismatch

    setPhase(jobDir, "synthesizing-audio");
    const beats = contentModel.narrationBeats(model);
    const { audioPath, captions, boundariesMs } = await narrateBeats({ beats, config, projectRoot: PROJECT_ROOT });

    setPhase(jobDir, "computing-timings");
    const publicJobDir = path.join(PROJECT_ROOT, "public", "content", slug);
    fs.mkdirSync(publicJobDir, { recursive: true });
    const publicAudioPath = path.join(publicJobDir, "narration.wav");
    const publicCaptionsPath = path.join(publicJobDir, "captions.json");
    fs.copyFileSync(audioPath, publicAudioPath);
    fs.writeFileSync(publicCaptionsPath, JSON.stringify(captions, null, 2));

    // Exact — computed from real synthesized audio duration per beat, not
    // from matching/guessing at transcribed text content.
    const boundaryFrames = boundariesMs.map((ms) => Math.round((ms / 1000) * config.render.fps));
    const totalFrames = boundaryFrames.at(-1) + config.render.fps; // + 1s outro tail

    const treatmentProps = contentModel.toTreatmentProps(model, {
      audioFile: `content/${slug}/narration.wav`,
      captionsFile: `content/${slug}/captions.json`,
      boundaryFrames,
      totalFrames,
    });

    setPhase(jobDir, "rendering");
    const compositionId = findCompositionId(model.platform, model.assetType, model.treatment);
    const bundleLocation = await bundle({ entryPoint: path.join(PROJECT_ROOT, "src", "index.ts") });
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: treatmentProps,
    });

    const outputDir = path.join(jobDir, "output", model.platform, model.assetType);
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `${slug}.mp4`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: treatmentProps,
      onProgress: ({ progress }) => setPhase(jobDir, "rendering", { renderProgress: Math.round(progress * 100) }),
    });

    addOutput(jobDir, { platform: model.platform, assetType: model.assetType, path: outputPath });
    setPhase(jobDir, "done");
    console.log(`✔ Rendered ${outputPath}`);
  } catch (error) {
    failJob(jobDir, error);
    console.error(`✖ Job "${slug}" failed:`, error);
    process.exitCode = 1;
  }
}

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/render.mjs <job-slug>");
  process.exit(1);
}

await renderJob(slug);
