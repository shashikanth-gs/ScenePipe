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

/** Creates real symlinks — .claude/skills/<name> and/or .codex/skills/<name>,
 * each pointing at ../../skills/<name> — only for the agent(s) actually
 * requested. Generated fresh on the target's own filesystem every time,
 * rather than shipped pre-made, since those are the only kind guaranteed to
 * survive however this package reached the user (npm tarball, git clone,
 * local dev checkout — all handled identically by doing this at scaffold
 * time instead of relying on the source having pre-built symlinks). */
async function linkSkillsForAgents(resolvedTarget, { claude, codex }) {
  const skillNames = await fs.readdir(path.join(resolvedTarget, "skills"));

  for (const [agent, enabled] of [
    ["claude", claude],
    ["codex", codex],
  ]) {
    if (!enabled) continue;
    const skillsDir = path.join(resolvedTarget, `.${agent}`, "skills");
    await fs.mkdir(skillsDir, { recursive: true });
    for (const name of skillNames) {
      await fs.symlink(path.join("..", "..", "skills", name), path.join(skillsDir, name));
    }
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
  // The template itself ships NO .claude/ or .codex/ directories — npm pack
  // silently drops symlinks from published tarballs (verified directly: they
  // never appear in `npm pack --dry-run`'s file list), so anything we shipped
  // pre-symlinked in template/ would be missing entirely for anyone who
  // installed from the real published package. Instead, skills/<name>/ ships
  // as real files, and the agent-specific symlinks are created fresh below,
  // directly on the user's own filesystem, every time.
  await fs.cp(templateDir, resolvedTarget, { recursive: true });

  await linkSkillsForAgents(resolvedTarget, { claude, codex });

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
