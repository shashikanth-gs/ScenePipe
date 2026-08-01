# ScenePipe

**Give it an article. Get back a branded video.**

```bash
npx scenepipe --claude   # or --codex
```

ScenePipe turns a topic, an article, a URL, or a pile of notes into
narrated, captioned, on-brand short-form video — automatically. An AI agent
(Claude Code or Codex) decides what to make and writes the words.
Deterministic, hand-built Remotion code — your logo, your colors, real
scene transitions, real motion graphics — renders it. The AI never writes
rendering code, so every video looks like *you* made it, not like a
template got filled in.

## Why this exists

Most "AI video" tools land in one of two bad places: they look identical
every time (a template with your logo stamped on top), or they let the AI
generate the visuals fresh on every render — inconsistent quality, and
occasionally a broken video nobody caught before it shipped.

ScenePipe splits the job on purpose. AI is genuinely good at deciding what
to say. A small, human-reviewed library of real Remotion components is
good at making it look great — the same good way, every single time.

## What you actually get

- **Cinematic by default.** Full-bleed asymmetric layouts, real scene
  transitions, generated motion graphics. Not centered text on a black
  rectangle.
- **On your brand, automatically.** Your logo, your colors, your fonts,
  wired into every scene from one `brand-kit.json` — no per-video manual work.
- **Narration that's actually captioned right.** Pick a free on-device
  voice, or a cloud provider (ElevenLabs, Sarvam, Azure, Google). Captions
  are timed from the real synthesized audio, never guessed.
- **AI picks the strategy, not the pixels.** Claude Code or Codex reads
  your source, decides the angle, writes the copy. It never touches
  rendering code, brand assets, or config.
- **Ships as portable skills.** The whole workflow is packaged to the
  [skills.sh](https://skills.sh) spec, so the same package works in Claude
  Code and Codex today, and anything else that speaks the same convention
  tomorrow.

## Quickstart

```bash
npx scenepipe --claude my-brand-content
cd my-brand-content
npm run dev
```

That's a real demo video rendering in Remotion Studio, zero setup required.
Before your first *actual* one:

1. **Tell it who you are.** Edit `brand/BRAND.md` — voice, tone, audience.
   The strategy skill reads this every time.
2. **Drop in your logo.** `public/brand/logo/mark.svg` and `wordmark.svg`.
   Placeholders ship there so the demo renders — they aren't your brand.
3. **Voice provider key, if you picked a paid one.** Already written to
   `.env` if you filled it in during setup; otherwise see
   `scripts/voice/README.md`. The free on-device option needs nothing here.
4. **Open the agent, right in the project.** `claude` or `codex` — either
   already knows the whole workflow. Give it a topic, or point it at an
   article.

## A quick tour

Two content shapes today, five visual styles between them. Pick one
explicitly with `visualStyle` in a job's content model, or let the AI choose:

| Shape | Style | Feels like |
|---|---|---|
| `comparison` | `cinematic` *(default)* | Editorial, full-bleed color-block scenes |
| `comparison` | `kinetic-typography` | Punchy, frame-filling type, no graphics at all |
| `comparison` | `glitch-tape` | Raw VHS energy — scan lines, chromatic aberration |
| `weather-report` | `cinematic` *(default)* | Illustrated, postcard feel |
| `weather-report` | `data-infographic` | Animated counters and real bar charts |

Every style earns its place the same way: see
`skills/scenepipe-visual-standards/SKILL.md` for the bar each one has to
clear. There's no plain/centered fallback — that's on purpose.

## How it fits together

```
your source material
        │
        ▼
 strategy skill (agent)   decides what to make, scoped by your brand + config
        │
        ▼
 authoring skill (agent)  writes the words, picks a style
        │
        ▼
 render.mjs — deterministic, zero AI
        │   validates the content → synthesizes narration + captions →
        │   times every cut from the real audio → renders → tracks progress
        ▼
   your finished .mp4
```

## Where things stand

Built and working, not finished — here's the honest state:

- **Reels only, for now.** Two content shapes (`comparison`,
  `weather-report`), Instagram reels. Carousel/story/post are wired into
  config as the intended shape, but nothing renders them yet.
- **Voice**: the free on-device option and Whisper captions are tested
  end-to-end. ElevenLabs/Sarvam/Azure/Google are built to each provider's
  spec but not yet exercised against live keys.
- **No publishing.** It renders a finished file. Getting that onto
  Instagram is still on you.
- **No dashboard yet** to watch a job's progress live — the data's there
  (`content/<slug>/status.json`), the UI to read it isn't built.
- **Published on npm** as `scenepipe` — `npx scenepipe --claude` works
  directly, no clone needed.

Want to add a treatment, a visual style, or tackle any of the above? See
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

MIT
