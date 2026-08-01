---
name: scenepipe-visual-standards
description: The non-negotiable visual quality bar every scenepipe treatment/style must meet — read this before authoring content or building a new style
metadata:
  tags: visual-standards, design-system, scenepipe
---

# Visual standards

This is the one place the system-wide "how should this look" rule is
written down. Every `scenepipe-<treatment>-<style>` skill must follow it.
It exists so that adding style #5 next year can't quietly regress back to
centered-text-on-black just because nobody wrote the rule down anywhere.

## The rule

**Every style must be cinematic. There is no plain/centered/classic option.**
Concretely, every style skill's rendering code must have all of:

1. **Asymmetric layout.** Content lives in a specific zone (left-aligned,
   top-third, corner-anchored) — never dead-centered on an empty background.
   Different scenes may use different zones, but no scene should look like
   "text floating in the middle of a black rectangle." Exception: a style
   whose whole point is frame-filling kinetic text (see
   `scenepipe-comparison-kinetic-typography`) may center big, dynamic,
   rapidly-changing text — that's different in kind from small static text
   marooned in empty space, which is the actual thing this rule bans.
2. **Real motion between scenes**, not hard cuts. Use `@remotion/transitions`
   (`TransitionSeries`) or an equivalent presentation-level transition —
   never a bare `<Sequence>` swap with no blend.
3. **Generated or real graphics, never emoji as the visual payload.** Emoji
   are acceptable as small inline accents; they are never the main visual
   element of a scene. Build actual SVG/vector graphics, or use the brand's
   real logo assets.
4. **Brand-kit driven, never hardcoded.** Colors, fonts, and the logo must
   come from `src/theme.ts` / `brand/brand-kit.json` — a style skill that
   hardcodes a hex color or a font name (other than as the *default value*
   documented in `brand-kit.json` itself) is broken by definition, because
   it can't be reused across brands.
5. **Persistent brand chrome** — at minimum a small corner logo mark. A
   running timecode and/or scrubber bar (see `src/Chrome.tsx`) are
   recommended but optional per-style.
6. **Some texture, not flat digital-clean.** Film grain (`src/Grain.tsx`),
   scan lines, paper/tape artifacts — pick what fits the style, but pure flat
   color with zero texture reads as generic AI output. This is not a personal
   preference; see the 2026 motion-design trend research this was based on:
   grain/grit/tactile imperfection is what separates content that performs
   from content that doesn't.

## Shared primitives (use these, don't reinvent them)

- `src/Chrome.tsx` — logo mark, timecode, scrubber.
- `src/Grain.tsx` — animated film-grain overlay.
- `src/graphics.tsx` — generated vector primitives (node network, blocked
  path, loop diagram, connector) — style skills are encouraged to add more
  primitives here rather than inlining one-off SVG in a scene file, so future
  styles can reuse them too.
- `src/transitionTiming.ts` — `compensateForTransitions()`, required whenever
  a style uses `TransitionSeries` with a cold-open or outro padding, so
  visual cuts land exactly on the real audio-derived frame boundaries
  instead of drifting.
- `src/Logo.tsx`, `src/theme.ts`, `src/fonts.ts` — brand-kit-driven mark,
  colors, fonts.

## Adding a new style

1. Create `skills/scenepipe-<treatment>-<style>/`.
2. Write `SKILL.md` there: what makes this style distinct, when an author
   should pick it over the treatment's other styles, and any style-specific
   authoring rules (e.g. kinetic typography needs punchier/shorter phrases
   than a card-based style).
3. Write `component.tsx` in the same folder: the actual Remotion component,
   built against the treatment's existing schema (never invent new content
   fields for a style — a style renders the same content differently, it
   doesn't need different content).
4. Register it in `templates/<treatment>/index.tsx`'s style dispatcher and
   add the style name to `templates/<treatment>/schema.ts`'s `visualStyle`
   enum and `contentModel.schema.mjs`'s matching enum.
5. Render stills across the full timeline and check for layout collisions
   (captions overlap is the most common one) before considering it done.

This is intentionally a human/reviewed step, same as adding a new treatment
— the AI picks a style by name from this list, it never generates one.
