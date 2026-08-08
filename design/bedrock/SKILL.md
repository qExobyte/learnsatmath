---
name: bedrock-design
description: Use this skill to generate well-branded interfaces and assets for Bedrock (the neo-brutalist SAT-math practice platform / LearnSATMath), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference
- **Aesthetic:** neo-brutalist — flat chalk background, thick 2px ink borders, HARD offset shadows (`Xpx Ypx 0 0 #141414`, never blurred), rounded-full pills that "press into" their shadow on hover. Flat colors only, no gradients.
- **Colors:** chalk `#F7F6F2`, ink `#141414`, navy `#1B2A4A`, coral `#EE4E29` (primary), electric `#FFE135`, pastels sky/mint/peach/lavender. Difficulty tiers: green/amber/red/purple.
- **Type:** DM Sans (400–900; headings `900`, `-0.02em` tracking) + Lora italic for math/accent. See `tokens/`.
- **Signature move:** press-in — on hover collapse the shadow and translate the element `+3px,+3px` (tiles `+2px`) into where the shadow was.
- **Logo:** faceted "boulder" mark in `assets/` (lockup / icon / app-tile).
- **Motion:** entrance-only, subtle, always gated on `prefers-reduced-motion`. Never animate answer→verdict feedback.

## Files
- `styles.css` — link this; it `@import`s all tokens + fonts.
- `tokens/` — colors, typography, spacing, effects, base helpers.
- `components/core/` + `components/app/` — React primitives (bundle: `_ds_bundle.js`, namespace `window.BedrockDesignSystem_*`).
- `ui_kits/bedrock-app/` — full interactive app recreation to copy patterns from.
- `assets/` — logos, the desmos005 diagram, the formula sheet.
