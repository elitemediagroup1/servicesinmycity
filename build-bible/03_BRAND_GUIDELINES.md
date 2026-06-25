# 03_BRAND_GUIDELINES.md

> **Status:** Canonical · **Owner:** Brand + Design · **Depends on:** 01, 02 · **Feeds:** 07_DESIGN_SYSTEM.md

## 1. Brand idea in one line

**The guide who's on your side.** Everything the brand expresses — visually, verbally, structurally — should make a homeowner feel accompanied and equipped, not sold to.

## 2. Brand personality

ServicesInMyCity, expressed through Rocco, is:

- **Trustworthy** — calm, steady, never hype-y. The opposite of a flashing "ACT NOW" banner.
- **Knowledgeable, not know-it-all** — confident about ranges and questions, humble about certainty. Comfortable saying "it depends" and explaining what it depends on.
- **Plain-spoken** — talks like a smart, generous neighbor who happens to know the trades.
- **Protective** — quietly has the homeowner's back, especially around money and pressure tactics.
- **Warm but not cute** — friendly and human; never saccharine, never gimmicky.

What we are not: salesy, urgent, alarmist, corporate, jargon-heavy, or slick in a way that feels like it's hiding something.

## 3. Voice and tone

**Voice (constant):** clear, warm, grounded, honest. Short sentences. Real words. Respect for the reader's intelligence and their wallet.

**Tone (varies by context):**

- In a stressful moment: steady and reassuring first, informative second.
- On educational/service pages: calm and explanatory.
- Around money: direct and protective. Name the ranges, name the upsell risks, never inflate fear.
- Around uncertainty: honest. "I can't be sure from here, but here's how to find out."

**Tone rules:** never manufacture urgency; never talk down; never overpromise; prefer "you" and "here's what I'd do."

## 4. Messaging hierarchy

- **Tagline:** "Ask Rocco before you call anyone."
- **Supporting line:** Rocco works for you — not the contractor.
- **Product taglines (from assets):** "Find. Connect. Fix." (ServicesInMyCity). EMG Loop: "Signal to Solutions."
- **Value props (priority order):** understand your situation -> know a fair price range -> ask the right questions -> make a confident decision.

Lead with understanding and protection, not with finding a contractor.

## 5. The Rocco mascot — brand usage

Rocco is the face of the brand and the literal voice of the product. His personality and behavior are specified in 04; this section governs his brand expression.

- **Rocco "The Repair Guy"** — 20+ years in the trades; "Fixing problems. Building trust. Helping neighbors."
- Approachable, steady, friendly — a guide/companion archetype, not a salesperson and not a clown.
- Consistent everywhere; no "hype mode."
- Supportive posture — beside the homeowner facing the problem together, never selling across a counter.
- Visual signature: backwards navy cap, pencil behind the ear, leather tool belt, tape measure marked 25.
- Restraint: Rocco appears where he adds warmth or guidance (chat surface, empty states, key moments), not on every pixel.
- We never fabricate Rocco "credentials," fake testimonials, or invented stats about people helped.

## 6. Color philosophy

Exact tokens live in 07 and are locked by ADR-009. Intent:

- **Foundation: calm and trustworthy.** A clean, mostly-neutral canvas (soft neutrals, lots of breathing room) — navy + white + warm light gray (cream) + neutral stone.
- **Product accent (orange #F07A2B):** Rocco, guidance, human interaction, homeowner, warmth, trust. Used purposefully, not splashed everywhere.
- **Platform accent (teal/green):** EMG Loop only — intelligence, data, infrastructure. Not used as homeowner-facing decoration.
- **Functional semantic colors** for success/caution/danger/info — reserved for meaning, never decoration. Note: success green is a separate token from platform green (ADR-013/Decision 3).
- High contrast and legibility are non-negotiable (22).

Principle: color earns its place. When in doubt, remove color.

## 7. Typography philosophy

Per locked Decision 4 (detailed in 07):

- **Primary UI + body: Inter** — excellent readability, open source, modern, cross-platform.
- **Display: Manrope** — hero headlines, large marketing moments, Rocco callouts, important landing messaging only.
- **Body copy always remains Inter.**
- No more than two type families. Clear hierarchy; comfortable line-height and measure. Legibility over personality.

## 8. Imagery and iconography

- Real, honest, human imagery — real homeowner situations and homes, not glossy stock-photo theater. No fake "happy customer" imagery.
- One coherent, simple, functional icon set. Icons clarify; they don't perform.
- No dark-pattern visuals: no fake notification badges, no urgency timers, no decoy buttons, no manufactured scarcity.

## 9. Layout and "feel"

The product should feel like Rocco sounds: calm, uncluttered, confident, generous with space. Apple/Stripe/Linear restraint — whitespace, clear focal points, one obvious next action per screen. Density is the enemy of trust. A homeowner in a stressful moment should feel their shoulders drop when the page loads.

## 10. Brand guardrails (hard "never"s)

The brand must never: manufacture urgency, scarcity, or fear; use dark patterns; present advertising as recommendation or as Rocco's voice; display fabricated stats, counts, reviews, or testimonials; feel like a lead-gen funnel; or overpromise outcomes / imply Rocco diagnoses or guarantees. If a design or copy choice trips one of these, it is wrong by definition — regardless of how well it "converts."

## 11. Brand-to-system handoff

This document defines intent and constraints. 07_DESIGN_SYSTEM translates them into concrete tokens and 08_COMPONENT_LIBRARY into components. Any token or component that contradicts the intent here is wrong, even if it's technically clean. Brand intent is the spec; the design system is the implementation.

## Assumptions

- A1. A calm, restrained, trust-forward aesthetic outperforms a conversion-optimized aggressive one for our audience and goals.
- A2. Rocco's tradesperson-neighbor persona resonates with Jersey Shore homeowners.
- A3. Two type families (Inter + Manrope) are sufficient for all brand needs.

## Open Questions

- OQ1. How much illustrated-Rocco vs. photographic-Rocco do we use, and where?
- OQ2. Do we need a distinct visual treatment for "Rocco is speaking" vs. static brand copy?
- OQ3. Logo reconciliation: the teal heart-skyline logo vs. the orange Rocco brand sheet — confirm orange leads for the product surface (per ADR-009).
