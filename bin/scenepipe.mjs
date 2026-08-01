#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import path from "node:path";
import { init } from "../src/init.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = { targetDir: ".", claude: false, codex: false, yes: false, skipInstall: false, force: false };
  const positional = [];

  for (const arg of argv) {
    if (arg === "--claude") args.claude = true;
    else if (arg === "--codex") args.codex = true;
    else if (arg === "--yes" || arg === "-y") args.yes = true;
    else if (arg === "--skip-install") args.skipInstall = true;
    else if (arg === "--force") args.force = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else positional.push(arg);
  }

  if (positional[0]) args.targetDir = positional[0];
  return args;
}

const HELP = `
scenepipe — bootstrap a brand-consistent, AI-authored content pipeline

Usage:
  npx scenepipe --claude [directory]
  npx scenepipe --codex [directory]
  npx scenepipe --claude --codex [directory]   # both agents at once

Options:
  --claude          Set up .claude/skills/ for Claude Code
  --codex           Set up .codex/skills/ for Codex
  --yes, -y         Skip interactive brand prompts, use neutral placeholder defaults
  --skip-install    Don't run npm install after scaffolding
  --force           Scaffold into a non-empty directory anyway
  --help, -h        Show this help

Every project gets a root AGENTS.md regardless of flags — that part is
shared across every agent tool (Claude, Codex, Cursor, etc.) by convention.
The flags only control which tool-specific skills/ symlinks get created.
If neither --claude nor --codex is given, --claude is used by default.

If no directory is given, scaffolds into the current directory.
`;

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(HELP);
  process.exit(0);
}

if (!args.claude && !args.codex) {
  console.log("Note: no agent flag given — defaulting to --claude. Pass --codex (or both) for other/additional agents.");
  args.claude = true;
}

await init({ packageRoot, ...args });
