# 07_DESIGN_SYSTEM.md

> **Status:** Canonical · **Owner:** Design + Front-End · **Depends on:** 00 (ADR-009), 03 (Brand), 04 (Rocco) · **Feeds:** 08, 09, 10, 22, 23

## 1. Purpose

Translate brand intent (03) and the locked color decision (ADR-009) into concrete, implementable **design tokens**: color, typography, spacing, radius, elevation, and motion. This document is the single source of truth for visual primitives. Any token or component that contradicts brand intent (03) is wrong, even if technically clean. The system optimizes for one feeling above all: a calm, trustworthy space where an anxious homeowner's shoulders drop.

## 2. Token philosophy

- **Tokens, not hex-in-components.** Every color/space/type value is a named token. Components reference tokens, never raw values. This makes the product-vs-platform split enforceable and theming (future siblings) trivial.
- **Semantic over literal.** Prefer semantic tokens (color-action, color-surface, text-primary) layered on top of a primitive palette (navy-700, orange-500). Components use semantic tokens.
- **Two accent families, strictly separated** (ADR-009). Orange = product/Rocco/homeowner. Teal/Green = Loop/platform/dev. Homeowner-facing UI must not use the platform accents as decoration.
- **Restraint.** Color earns its place. When in doubt, remove color. A near-monochrome page with one intentional orange accent reads as more trustworthy than a colorful one.

## 3. Color — primitive palette

**Shared EMG foundation (every product):**

- navy-900: #14283F (deepest)
- navy-700: #1E3A5F (brand navy — ADR-009 anchor)
- navy-500: #335277
- white: #FFFFFF
- cream: #F4F1EA (warm light background)
- stone-200: #E7E3DA (neutral stone, borders/dividers)
- stone-400: #C9C3B6
- gray-500: #6B7280 (slate, secondary text / muted)
- gray-700: #434A54

**ServicesInMyCity / Rocco product accent (orange family):**

- orange-600: #D9661F (hover/active)
- orange-500: #F07A2B (primary brand accent — ADR-009)
- orange-300: #F8A867 (light)
- orange-100: #FDE8D6 (tint backgrounds)

**Supporting warm tone (from brand sheet, sparing use):**

- tan-400: #D9B27C (warm secondary, e.g. subtle highlights; never a primary action)

**EMG Loop platform accent (teal/green family) — NOT for homeowner decoration:**

- teal-500: #1FB6B6
- teal-700: #137B7B
- green-500: #2FB572

**Functional / semantic colors (meaning only, never decoration):**

- success: #2FB572 (note: distinct usage from platform green; reserved for state)
- caution: #E6A700
- danger: #C8442B
- info: #335277

## 4. Color — semantic tokens (what components actually use)

- color-bg-page: cream (#F4F1EA) — calm warm canvas
- color-bg-surface: white
- color-bg-surface-alt: #FBFAF6
- color-border: stone-200
- text-primary: navy-700
- text-secondary: gray-500
- text-on-dark: white
- color-action: orange-500 (primary CTAs, Rocco presence)
- color-action-hover: orange-600
- color-action-tint: orange-100 (subtle backgrounds, Rocco message bubble)
- color-rocco: orange-500 (Rocco identity — avatar ring, name, his bubble accent)
- color-link: navy-700 (underlined; orange reserved for actions)
- color-success / color-caution / color-danger / color-info: per functional palette
- **Platform tokens (internal/dev/Loop surfaces only):** color-platform: teal-500, color-platform-accent: green-500

**Hard rule:** homeowner-facing components may reference only foundation + orange + tan + functional tokens. Platform tokens are off-limits in the homeowner UI (ADR-009).

## 5. Contrast & accessibility (binds 22)

- Body text (navy-700 on cream) and all text/background pairings must meet **WCAG 2.1 AA** (4.5:1 normal, 3:1 large). 
- Orange-500 is a graphic/action accent; orange text on light backgrounds must be verified for contrast and is avoided for small body text (use navy-700). Orange on navy and white-on-orange-600 are the safe action treatments — each verified before use.
- Never rely on color alone to convey meaning (caution/danger pair with icon + text).

## 6. Typography

- **Two families maximum** (03). Primary: a clean, humanist sans-serif for UI and body (high legibility at body sizes). Optional display/accent: a sturdier sans for big headings / Rocco's "voice" moments. Final font choices pending (Open Question); tokens below are family-agnostic.
- **Type scale (rem, 16px base):**
  - display: 2.5 / 3rem, weight 700, tight leading — hero only
  - h1: 2rem, 700
  - h2: 1.5rem, 700
  - h3: 1.25rem, 600
  - body-lg: 1.125rem, 400 (chat, important reading)
  - body: 1rem, 400, line-height 1.6
  - small: 0.875rem, 400 (captions, disclaimers)
  - micro: 0.75rem (legal fine print, attribution)
- **Body measure:** max ~68ch for comfortable reading.
- **Legibility over personality** — calm reading of sometimes-stressful content wins over flair.

## 7. Spacing & layout

- **4px base unit.** Space scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 (tokens space-1 ... space-9).
- **Generous whitespace is a feature**, not wasted space (Apple/Stripe/Linear restraint). Density is the enemy of trust.
- **Container widths:** content max ~720px for reading surfaces; ~1120px for index/landing layouts; chat column ~640px.
- **One obvious next action per screen.** Layouts guide toward Ask Rocco.

## 8. Radius, elevation, borders

- radius-sm: 6px (inputs, small controls)
- radius-md: 10px (cards, message bubbles)
- radius-lg: 16px (modals, primary surfaces)
- radius-pill: 999px (Rocco CTA, chips)
- **Elevation:** soft, low shadows only (shadow-1 subtle, shadow-2 for modals/popovers). No harsh drop shadows; the feel is calm and flat-ish with gentle depth.
- Borders: 1px stone-200 default; avoid heavy outlines.

## 9. Motion

- **Calm and purposeful.** Durations: 120ms (micro), 200ms (standard), 300ms (entrances). Easing: ease-out for entrances, ease-in-out for movement.
- **No manufactured urgency** — no pulsing "act now," no attention-grabbing jitter, no fake notification animations (03 guardrails).
- Respect prefers-reduced-motion: disable non-essential animation entirely (22).
- Rocco's typing/streaming indicator is gentle and honest (reflects real generation, not theater).

## 10. Iconography & imagery

- One coherent icon set, simple and functional; icons clarify, never decorate. Stroke weight consistent.
- Imagery is real and honest (real homes/situations), never glossy stock theater (03). No fake "happy customer" imagery, no fabricated trust badges.
- Rocco's likeness usage follows 03/04: approachable, steady, beside-the-homeowner posture; used where he adds warmth (chat, empty states, key moments), not plastered everywhere.

## 11. Dark mode

- Phase 1: **not required.** The cream/navy light theme is the canonical calm surface. If added later, it must preserve AA contrast and the orange/navy identity. Tokenization above makes this additive, not a rewrite.

## 12. Theming for the EMG family (forward-looking)

The token architecture is built so a sibling product (Care/Pets/etc.) swaps the **product-accent family** (its own warm accent) and the **guide identity**, while inheriting the foundation, spacing, type, motion, and the platform (teal/green) Loop tokens unchanged. This operationalizes ADR-009 across the ecosystem. Do not build sibling themes now — just keep tokens swappable.

## Assumptions

- A1. A two-family type system with a humanist sans body is sufficient for Phase 1; exact fonts TBD.
- A2. Light theme (cream/navy) only for Phase 1; dark mode deferred.
- A3. Orange as action + Rocco identity, navy for links/text, gives enough hierarchy without a second product accent.
- A4. Soft, low-elevation visual language best communicates "calm and trustworthy."
- A5. WCAG 2.1 AA is the committed bar (confirmed in 22).

## Open Questions

- OQ1. Final typeface selection (license, performance, web-font loading strategy)? (Impacts 23.)
- OQ2. Exact verified contrast treatments for orange-on-light usages? (Impacts 22.)
- OQ3. Do we need a distinct "Rocco voice" display face, or is weight/size enough?
- OQ4. Should success green (#2FB572) be visually differentiated from platform green to avoid product/platform color bleed? (ADR-009 tension to resolve.)
- OQ5. Iconography: adopt an existing open set or commission a bespoke one?
