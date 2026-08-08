# Bedrock Design System

The brand & UI system for **Bedrock** — an SAT-math practice *platform* (an
application, not a marketing site) and the web home of the **LearnSATMath**
YouTube channel. Bedrock prioritizes *quality over quantity*: a small, carefully
authored set of problems instead of thousands of AI-generated ones. It launched
under **desmosplease.com** (the call-to-action in the Desmos explainer video) as
V0.5 — a gated set of ~24 Desmos-flagged SAT problems, with the full "Bedrock
100" question bank, video tabs, and a course to follow.

The look is deliberately **neo-brutalist**: a flat chalk background, thick black
("ink") borders, hard offset drop shadows, rounded-full pill buttons that press
into their shadow on hover, a DM Sans / Lora type pairing, and bright flat accent
colors. It is playful and hand-made, but restrained — this is an app, so clarity
and fast interaction beat decoration.

## Sources
This system was reverse-engineered from the product's own code. Explore these to
build more accurately (access may be required):
- **App repo** — `qExobyte/bedrock` (Next.js App Router + Tailwind 4 + Supabase).
  Ground truth for the design system: `CLAUDE.md` (§Frontend / design system),
  `app/globals.css` (`@theme` tokens), and `app/_components/*` (the real UI).
  https://github.com/qExobyte/bedrock
- **Marketing/site repo** — `qExobyte/learnsatmath` (Astro + Tailwind 3).
  `DESIGN_SYSTEM.md` is the ported style guide; `public/*` holds site imagery.
  https://github.com/qExobyte/learnsatmath
- Related: `qExobyte/satmathranked`, `qExobyte.github.io` (the tutoring site).

---

## Content fundamentals — how Bedrock writes
- **Voice: second person, direct, encouraging.** Copy talks to the student —
  *"Create a free account to start solving problems!"*, *"Sign in to get
  started"*, *"Next problem"*. The founder uses first person only in narrative
  ("I make YouTube videos about the SAT Math").
- **Plain and confident, never salesy.** Short imperative labels: *Check answer*,
  *Skip*, *All*. The value prop is one line: *quality over quantity — everything
  you need, none of what you don't.*
- **Casing:** Sentence case for body and buttons; heavy Title/`font-black` for
  headings and the wordmark. Difficulty badges are the only UPPERCASE (EASY,
  MEDIUM, HARD, EXPERT).
- **Feedback is honest and gentle.** A wrong answer says *"Not quite — try
  again."* and never reveals the key; only solving reveals the correct choice.
- **Emoji: sparingly, only as playful punctuation** — the "Video coming soon 👀"
  placeholder is the canonical (and about the only) example. Never in problem
  content or serious UI.
- **Math is exact.** Variables and expressions are real notation (KaTeX), never
  approximated; topic names come from the fixed taxonomy, never free-typed.
- **Vibe:** a sharp, friendly tutor who respects your time.

## Visual foundations
- **Color:** flat only — *no gradients, ever*. A warm off-white **chalk**
  (`#F7F6F2`) page, near-black **ink** (`#141414`) for all text/borders/shadows,
  **coral** (`#EE4E29`) as the single primary action color, and a pastel accent
  set (sky, mint, peach, lavender) plus **electric** yellow for the highlighter.
  A navy **ink-mid** (`#1B2A4A`) is the optional dark contrast surface. Difficulty
  has its own green/amber/red/purple tier coding used across tiles, badges, and
  gauges.
- **Type:** **DM Sans** for everything structural (400–900; headings are `900`
  black with `-0.02em` tracking), **Lora** italic for accent bits — math notation
  labels and pull quotes. Root is 16px; body line-height 1.625.
- **Backgrounds:** solid chalk. No imagery, gradients, textures, or patterns
  behind content. Problem **diagrams** are matplotlib PNGs rendered directly on
  chalk with *no* card/border/shadow (they carry their own axes frame — wrapping
  double-frames them). Imagery, when present, is functional (video thumbnails,
  diagrams), not decorative.
- **Borders:** `2px solid ink` on every interactive/elevated element; `3px` for
  the occasional heavier edge; `4px` green only to emphasize the correct answer.
- **Shadows:** **hard offset only** — `Xpx Ypx 0 0 ink`, no blur, no spread.
  `shadow-sm` = 3/3, `shadow-md` = 5/5, and the shrunk `shadow-hover` = 1/1 used
  mid-press. There are no soft/ambient shadows anywhere.
- **The signature interaction — "press-in":** on hover a pill collapses its
  shadow (`shadow-sm → none`) while translating `+3px, +3px` into where the
  shadow was; tiles use the gentler `+2px` to `shadow-hover`. This one move is
  reused on buttons, tiles, cards, tools, and selects.
- **Radii:** `rounded-xl` (12px) grid tiles, `rounded-2xl` (16px) choice tiles,
  `rounded-3xl` (24px) modals/menus, and `rounded-full` pills/avatars/progress.
- **Cards ("sticker tiles"):** flat pastel or white fill, 2px ink border, hard
  offset shadow, and an optional *slight* rotation (−3°…+2°) to feel hand-placed.
  Rotation is used with restraint in the app (a few degrees, not a noisy grid).
- **Highlighter:** a flat electric-yellow swipe rotated ~1° behind a key phrase —
  the one "marker" flourish, for headline emphasis only.
- **Motion:** subtle and entrance-only — GSAP scroll reveals (fade up 16px,
  `power3.out`, ~0.6s, slight stagger), gentle drift on decorative shapes. The
  press-in transitions run 150–200ms. **Never animate the answer→verdict
  feedback** (it must be instant), and **every** animation is gated behind
  `prefers-reduced-motion` (base styles show the resolved state).
- **Hover/press states:** interactive elements press in (translate + shadow
  collapse); links go `coral` and/or underline; disabled drops to 50% opacity.
- **Transparency/blur:** almost none — the only translucency is the modal scrim
  (`ink` at 40% alpha). No frosted glass, no backdrop blur.
- **Layout:** centered columns — `max-w-7xl` app header, `max-w-6xl` page,
  `max-w-3xl` reading/problem column; `24px` gutters. The problem screen has a
  fixed collapsible left rail; the account control pins to the header's top-right.

## Iconography
- **Custom inline SVG line icons**, hand-defined in `app/_components/icons.tsx`
  and ported here into a single **`Icon`** component. Style: 24×24 viewBox, `2px`
  `currentColor` strokes, round caps/joins (verdict check/x use `3px`). Set:
  `calculator, formula, check, x, arrowRight, chevronDown, reset, signOut, play,
  pause`.
- **Brand exceptions that keep their own color:** the multi-color Google "G"
  (`google`, for the sign-in button) and the faceted **`boulder`** logo mark.
- **No icon font, no icon library** (no Lucide/Heroicons/etc.) — icons are
  bespoke and few. If you need a glyph that isn't here, draw it to match (2px,
  round joins, currentColor) rather than pulling in a set.
- **Emoji** appear only as rare playful punctuation (the "👀" placeholder); never
  as UI iconography. **Unicode glyphs** are used for the tiny rail chevrons
  (‹ › ← →) inside otherwise-bespoke controls.

## Logo
Bedrock had **no existing logo** — the mark here was designed for this system at
the user's request: an **angular, faceted "boulder"** (a nod to "bedrock"), three
flat facets (peach lit / coral / coral-dark shadow) with thick ink edges, matching
the neo-brutalist idiom. It ships three ways:
- `assets/bedrock-lockup.svg` — boulder + DM Sans wordmark; the **site-header** lockup.
- `assets/bedrock-icon.svg` — the boulder mark alone.
- `assets/bedrock-app-icon.svg` — boulder on a chalk ink-bordered rounded tile; the
  **favicon / app / tab** icon (reads down to ~24px).

---

## Index — what's in this system
- **`styles.css`** — the entry point consumers link. `@import`s only.
- **`tokens/`** — `fonts.css` (DM Sans + Lora via Google Fonts), `colors.css`,
  `typography.css`, `spacing.css`, `effects.css` (borders/shadows/motion),
  `base.css` (resets + `.bd-mark` / `.bd-press` helpers).
- **`assets/`** — the three logo lockups, the `desmos005` diagram, the SAT
  formula sheet.
- **`components/core/`** — `Button`, `IconButton`, `Badge`, `Card`,
  `Highlighter`, `Icon`.
- **`components/app/`** — `ProblemTile`, `ProgressGauge`, `Stopwatch`,
  `PillSelect`, `VideoEmbed`, `Modal`, `ChoiceTile`.
- **`ui_kits/bedrock-app/`** — interactive recreation of the V0.5 app (home →
  sign-in gate → problem screen → grading). See its `README.md`.
- **`guidelines/`** — foundation specimen cards (Brand, Colors, Type, Spacing)
  that populate the Design System tab.
- **`SKILL.md`** — Agent-Skills manifest for reuse in Claude Code.

### Intentional additions
- **`Icon`** wraps the app's ad-hoc `icons.tsx` glyphs (+ the brand `boulder`
  mark) into one component so consumers have a single icon API. **`Card`**,
  **`Modal`**, and **`Highlighter`** promote idioms the app expresses inline
  (sticker tiles, the sign-in modal shell, the marker swipe) into reusable
  primitives. Everything else maps 1:1 to a real Bedrock component.

## Font substitution
None. **DM Sans** and **Lora** are the product's real fonts, loaded from Google
Fonts (`tokens/fonts.css`) — the same source the app uses. No local binaries are
bundled; if you need offline/self-hosted fonts, add the `.woff2` files and
`@font-face` rules and flag it.
