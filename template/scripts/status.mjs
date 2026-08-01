// Structured, file-based progress tracking. A companion dashboard app (or
// `fs.watch` + SSE, same pattern as ScenePipe) reads content/<slug>/status.json
// to show what's actually happening in real time — no polling of logs needed.
import fs from "node:fs";
import path from "node:path";

export function statusPath(jobDir) {
  return path.join(jobDir, "status.json");
}

export function writeStatus(jobDir, patch) {
  const file = statusPath(jobDir);
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  const next = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  fs.mkdirSync(jobDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(next, null, 2));
  return next;
}

export function startJob(jobDir, meta) {
  return writeStatus(jobDir, {
    ...meta,
    phase: "queued",
    startedAt: new Date().toISOString(),
    error: null,
    outputs: [],
  });
}

export function setPhase(jobDir, phase, extra = {}) {
  return writeStatus(jobDir, { phase, ...extra });
}

export function addOutput(jobDir, output) {
  const file = statusPath(jobDir);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));
  return writeStatus(jobDir, { outputs: [...(existing.outputs ?? []), output] });
}

export function failJob(jobDir, error) {
  return writeStatus(jobDir, { phase: "error", error: String(error?.message ?? error) });
}
