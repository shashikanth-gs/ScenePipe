import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { askBrandQuestions } from "./prompts.mjs";
import { writeBrandKit, writeEnvFile } from "./brandKit.mjs";

async function isEmptyOrMissing(dir) {
  try {
    const entries = await fs.readdir(dir);
    return entries.length === 0;
  } catch (err) {
    if (err.code === "ENOENT") return true;
    throw err;
  }
}

export async function init({ packageRoot, targetDir, claude, codex, yes, skipInstall, force }) {
  const resolvedTarget = path.resolve(process.cwd(), targetDir);
  const templateDir = path.join(packageRoot, "template");

  if (!force && !(await isEmptyOrMissing(resolvedTarget))) {
    console.error(
      `✖ ${resolvedTarget} is not empty. Re-run with --force to scaffold into it anyway (existing files with the same name will be overwritten).`,
    );
    process.exit(1);
  }

  console.log(`Scaffolding scenepipe into ${resolvedTarget} ...`);
  await fs.mkdir(resolvedTarget, { recursive: true });
  // verbatimSymlinks is required: without it, Node rewrites relative symlinks
  // (e.g. .claude/skills/* -> ../../skills/*) into absolute paths pointing at
  // THIS package's own template/ directory instead of the new project's own
  // copy — which would break the moment this tool runs on anyone else's
  // machine or from a published npm package.
  await fs.cp(templateDir, resolvedTarget, { recursive: true, verbatimSymlinks: true });

  // The template ships skills/ symlinks for every supported agent
  // unconditionally — only remove the ones that weren't actually requested,
  // so a project only ends up with the agent directories it asked for.
  if (!claude) {
    await fs.rm(path.join(resolvedTarget, ".claude"), { recursive: true, force: true });
  }
  if (!codex) {
    await fs.rm(path.join(resolvedTarget, ".codex"), { recursive: true, force: true });
  }

  const brand = yes ? null : await askBrandQuestions(packageRoot);
  await writeBrandKit(resolvedTarget, brand);
  await writeEnvFile(resolvedTarget, brand?.envValues);

  if (!skipInstall) {
    console.log("Installing dependencies (npm install) ...");
    execSync("npm install", { cwd: resolvedTarget, stdio: "inherit" });
  }

  const voiceProvider = brand?.voiceProvider ?? "macos-say";
  const needsWhisper = voiceProvider !== "elevenlabs";
  const missingEnv = brand?.envValues ? Object.entries(brand.envValues).filter(([, v]) => !v).map(([k]) => k) : [];

  const agentLines = [
    claude ? "claude   # opens Claude Code — it already knows the workflow via AGENTS.md + .claude/skills/" : null,
    codex ? "codex    # opens Codex — it already knows the workflow via AGENTS.md + .codex/skills/" : null,
  ].filter(Boolean);

  console.log(`
✔ Done.

Next steps:
  cd ${path.relative(process.cwd(), resolvedTarget) || "."}
  ${agentLines.join("\n  ")}

Before your first real run:
  - Edit brand/BRAND.md with your actual brand voice/ideology (the strategy skill reads this every time)
  - Place your logo files in public/brand/logo/ (matching the paths in brand/brand-kit.json's "logo" field — mark.svg and wordmark.svg by default)
  ${missingEnv.length > 0 ? `- Set ${missingEnv.join(", ")} in .env — you left ${missingEnv.length > 1 ? "these" : "this"} blank during setup (see scripts/voice/README.md)` : "- Voice provider credentials are already in .env from setup — nothing more to do there"}
  - Review scenepipe.config.json — which platforms/asset types are enabled by default
${needsWhisper ? "\nNote: your first real render will download Whisper (~1.5GB, one-time) to generate captions — this happens automatically, no action needed.\n" : ""}`);
}
