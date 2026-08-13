# Design System (ported from LearnSATMath)

This project should match the LearnSATMath visual style: a **neo-brutalist** look —
flat chalk-white background, hard offset drop shadows, thick black ("ink") borders,
rounded-full pill buttons that "press into" their shadow on hover, a serif/sans type
pairing, and bright flat accent colors. Build with **Astro + Tailwind CSS v3**.

## Stack
- Astro 4 + `@astrojs/tailwind`, Tailwind CSS 3.4
- GSAP 3 (+ ScrollTrigger) for entrance/scroll animations
- Fonts loaded from Google Fonts: **DM Sans** (sans) + **Lora** (serif)

## Tailwind config

Drop this into `tailwind.config.mjs` under `theme.extend`:

```js
colors: {
  chalk: '#F7F6F2',          // page background
  ink: { DEFAULT: '#141414', // near-black for text, borders, shadows
         mid: '#1b2a4a' },    // navy, used for dark sections
  coral: '#EE4E29',          // primary CTA / accent
  electric: '#FFE135',       // yellow highlighter / marker accent
  sky: '#C9E8FF',            // pastel fills
  mint: '#C8F0D0',
  peach: '#FFE0CB',
  lavender: '#EDE9FF',
},
fontFamily: {
  serif: ['Lora', 'Georgia', 'serif'],
  sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
},
letterSpacing: { tight: '-0.02em' },
boxShadow: {
  'offset-sm':    '3px 3px 0 0 #141414',
  'offset-md':    '5px 5px 0 0 #141414',
  'offset-hover': '1px 1px 0 0 #141414',
},
borderWidth: { '3': '3px' },
```

## Layout / global setup
- `<body class="bg-chalk font-sans text-ink antialiased">`
- Root font-size is height-adaptive (everything scales from the root):
  `html { font-size: 18px; }` by default, dropping to `16px` under
  `@media (min-width: 1024px) and (max-height: 1000px)` so laptop-height
  desktop viewports get a denser scale while tall monitors keep the 18px look
  and mobile is untouched. Also `html { scroll-behavior: smooth; }`.
- Invariant: nav height (`h-16`) and anchor offsets (`scroll-mt-20`) are both
  rem, so anchor clearance below the sticky nav holds at either root size.
- Load fonts in `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
  ```
- Content width: `max-w-6xl mx-auto px-6 lg:px-8` (use `max-w-5xl` for hero text).

## Core visual idioms

**Pill button (primary CTA).** Coral fill, white text, ink border, offset shadow that
collapses as the button translates into it on hover:
```html
<a class="group inline-flex items-center gap-2 bg-coral text-white font-bold
          px-8 py-4 rounded-full border-2 border-ink shadow-offset-sm
          hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
          transition-all duration-200 text-base">
```
This press-in-on-hover (`shadow-offset-sm → shadow-none` + `translate-x/y-[3px]`) is the
signature interaction — reuse it on cards and buttons alike.

**Sticker tile / card.** Pastel or chalk fill, 2px ink border, small offset shadow, a
slight rotation (`-rotate-3`, `rotate-2`, etc.) to feel hand-placed:
```html
<span class="w-14 h-14 rounded-xl bg-electric border-2 border-ink
             shadow-[3px_3px_0_0_#141414] rotate-3">
```

**Highlighter marker** behind key words (the yellow swipe under headline phrases):
```html
<span class="relative inline-block px-2 -rotate-1">
  <span class="absolute inset-0 bg-electric" aria-hidden="true"></span>
  <span class="relative">highlighted text</span>
</span>
```

**Dark section.** `bg-ink-mid text-chalk` (navy block), accents in `coral`/`electric`,
muted body text as `text-chalk/80`.

**Nav.** Sticky, chalk bg, `border-b-2 border-ink`. Active/hover links go `text-coral`;
logo wordmark is `font-black tracking-tight`.

## Typography
- Headlines: `font-sans font-black tracking-tight leading-tight` (e.g. `text-4xl lg:text-6xl`).
- Body: `font-sans font-semibold` for emphasis copy, `leading-relaxed`.
- `font-serif italic` for accent/decorative bits (e.g. math notation, pull quotes).
- Letter-spacing `tracking-tight` on large headings.

## Motion (GSAP)
- `src/scripts/motion.ts` registers ScrollTrigger and exports a `prefersReducedMotion()`
  guard. **Gate every animation behind it.**
- Scroll reveal: elements get class `reveal`; CSS hides them only when JS is active and
  motion is allowed (`html.js .reveal { opacity:0; transform: translateY(24px) }`), then
  `ScrollTrigger.batch` fades them up (`y:0, opacity:1, duration:0.6, ease:'power3.out',
  stagger:0.1, start:'top 90%', once:true`).
- Hero items use a staggered timeline; decorative shapes get gentle yoyo "drift" tweens
  plus scroll parallax (`scrub`). All decorative shapes are `aria-hidden`.
- Add `document.documentElement.classList.add('js')` inline in `<head>` so the no-JS
  fallback shows content.

## Principles
- Flat colors only — no gradients, no soft/blurry shadows. Shadows are hard offset
  (`Xpx Ypx 0 0 #141414`).
- Thick `border-2 border-ink` on interactive/elevated elements.
- Slight rotations on decorative elements for a playful, hand-made feel.
- Always respect `prefers-reduced-motion`.
