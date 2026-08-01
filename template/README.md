# Your scenepipe project

Scaffolded by [scenepipe](https://github.com/) — see `AGENTS.md` (repo root)
for how the AI-authoring workflow works.

## Before your first real run

1. Edit `brand/BRAND.md` with your actual voice/tone/audience — read by the
   strategy skill on every run.
2. Edit `brand/brand-kit.json` (colors/fonts) and drop your logo into
   `public/brand/logo/`.
3. Review `scenepipe.config.json` — enabled platforms/asset types, and your
   voice provider + fallback chain. Copy `.env.example` to `.env` and fill in
   whichever provider's key you configured (macos-say needs none).

## Commands

```bash
npm run dev              # Remotion Studio, live preview of the demo reel
npm run render <slug>     # render content/<slug>/content-model.json to video
npm run lint              # typecheck + eslint
```

## Making content

Open Claude Code (`claude`) or Codex (`codex`) in this directory and give it
a topic, article text, or a path to a file/directory. Either already knows
the workflow via the root `AGENTS.md` and its own skills directory
(`.claude/skills/` or `.codex/skills/`). See the top-level scenepipe README
for the full architecture.

## Choosing a visual style

Each treatment defaults to its `cinematic` style, but you can set
`visualStyle` explicitly in a job's `content-model.json` (e.g.
`"kinetic-typography"`, `"glitch-tape"`, `"data-infographic"`). See
`skills/scenepipe-visual-standards/SKILL.md` for what every style has to
meet, and each style's own `skills/scenepipe-<treatment>-<style>/SKILL.md`
for when to pick it.
