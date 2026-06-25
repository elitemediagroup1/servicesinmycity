# 11_CONTENT_GUIDELINES.md

> **Status:** Canonical · **Owner:** Brand + Content · **The permanent editorial guide for every EMG property.** · **Depends on:** 01, 02, 03, 04, 13 · **Feeds:** 10, 12, and all future products/guides
>
> This document is deliberately layered: **Part A** is universal EMG writing standards (inherited by every property and guide), **Part B** is the ServicesInMyCity implementation, and **Part C** defines how future guides (Carl, Lucy, Coach, Chef, Advisor) inherit Part A while defining their own Part B.

---

# Part A — Universal EMG Writing Standards

These standards apply to every EMG property, every guide, and every word of copy, forever. They are downstream of the company's core invariants (01) and cannot be overridden by a product's local style.

## A1. The EMG voice (constant across products)

EMG writing is **clear, warm, grounded, and honest.** It respects the reader's intelligence and their wallet. It explains without condescending and is confident without being arrogant. It sounds like a knowledgeable, generous human — never a brochure, never a hype machine, never a chatbot.

## A2. The universal "never"s

Across every EMG property, writing must never:

- Manufacture urgency, scarcity, or fear ("act now," countdowns, fake stock warnings).
- Use dark patterns or manipulative copy.
- Fabricate statistics, counts, reviews, ratings, testimonials, or credentials (invariant).
- Present advertising as recommendation or as the guide's own voice (ADR-007).
- Overpromise outcomes or guarantee results.
- Diagnose, prescribe, or give definitive professional advice where the guide should equip, not decide (ADR-002 generalized to all guides).
- Talk down to the reader, shame them, or exploit their anxiety.

## A3. The universal "always"s

- **Equip, don't decide.** Increase the reader's agency; never replace their judgment.
- **Honest emptiness.** If we don't have data/content, say so or omit it — never pad with fabrication.
- **Plain language.** Short sentences, real words, active voice. Define jargon when unavoidable.
- **Protect the reader**, especially around money and pressure.
- **Lead with understanding**, not with the sale.

## A4. Universal mechanics

- **Reading level:** aim for broad accessibility (roughly 7th-9th grade) without dumbing down substance.
- **Person:** second person ("you," "here's what I'd do").
- **Numbers & money:** ranges with the factors that move them; never single guaranteed figures presented as fact.
- **Inclusive, respectful language;** no stereotypes; accessible by default (pairs with 22).
- **Formatting:** prose first; use lists only when genuinely a list. Generous structure for scannability in stressful moments.

## A5. Universal legal/safety discipline

All guidance copy inherits: "educational, not professional advice," appropriate safety framing, and emergency escalation for hazards (05, ADR-002). This is editorial architecture, not a footer afterthought — the disclaimer lives near the guidance.

## A6. Copyright & originality

All content is original. We do not copy competitor copy, reproduce others' content, or fabricate quotes/attributions. Sourced facts (e.g., local business info) are attributed (ADR-006).

---

# Part B — ServicesInMyCity Implementation

The ServicesInMyCity expression of Part A, voiced through Rocco (04).

## B1. Rocco's editorial voice

Rocco is a sharp, generous tradesperson-neighbor with 20+ years of experience: straightforward, reliable, hardworking, protective, friendly, a little funny, and genuinely knowledgeable (04). His copy is plain and warm, protective about money, lightly funny (never in a scary moment), and always equips rather than diagnoses. Writers should pass every line through the on-character checklist (04 section 11).

## B2. Where Rocco's voice applies vs. doesn't

- **Rocco's voice:** chat responses, seed prompts, empty states, "how Rocco helps," conversational CTAs.
- **Brand/neutral voice (still EMG voice, not first-person Rocco):** legal pages, privacy, formal disclaimers, EMG/company copy. Rocco doesn't "speak" legalese; legal surfaces are plain but not in-character.
- **Never:** advertising copy in Rocco's voice (ADR-007).

## B3. Service & education content rules

- Teach honestly: what might be going on, what drives cost, what questions to ask, what red flags look like — mirroring Rocco's four-step mission.
- Cost ranges are ranges with drivers, dated/"may vary" framed, carrying the same equip-not-diagnose discipline as Rocco (05, ADR-002).
- Local content is honestly bounded to launch markets (ADR-010); no fake "serving your area" claims.
- Every service/education page routes the reader to Rocco ("Ask Rocco about this") — content is an on-ramp (ADR-013).

## B4. Microcopy & UI text

- Buttons/CTAs are clear and low-pressure ("Ask Rocco," "Tell Rocco what's going on") — never "Get 3 quotes now!" pressure.
- Error/empty states are honest and human ("Couldn't pull nearby businesses right now"), never fake.
- Consent copy (18) is plain, just-in-time, and decline-friendly — no dark patterns.

## B5. Taglines & key lines (locked)

- "Ask Rocco before you call anyone."
- "Rocco works for you — not the contractor."
- "Find. Connect. Fix." (ServicesInMyCity)
- Rocco's canonical lines (reference, not filler) per 04 section 5.

## B6. SEO content discipline (binds 12)

Honest, genuinely useful pages — never thin, auto-generated, keyword-stuffed spam (the incumbent pattern we reject, 02). Service x market pages exist only where we can populate them honestly (ADR-010).

---

# Part C — Future Guide Inheritance

How the editorial system extends to future guides without re-litigating standards.

## C1. The inheritance contract

Every future guide (Carl, Lucy, Coach, Chef, Advisor) **inherits Part A in full**, unchanged. A guide may not relax a universal "never" or "always." Each guide then authors its own "Part B" — its persona, voice specifics, domain content rules, taglines, and microcopy — exactly as Rocco does here.

## C2. What a new guide must define (its Part B template)

- Persona + canonical identity (the guide's equivalent of 04).
- Domain-specific equip-not-diagnose boundaries (what equipping means in that domain; where escalation is required).
- Voice specifics and sample lines.
- Where the guide's voice applies vs. neutral/brand/legal voice.
- Domain content + SEO discipline.
- Taglines and microcopy.

## C3. What a new guide may never do

- Override Part A.
- Diagnose/prescribe where it should equip (domain-appropriate version of ADR-002).
- Speak advertising or recommend-for-pay (ADR-007).
- Fabricate, manufacture urgency, or use dark patterns.

## C4. Cross-guide consistency

All guides share the EMG voice DNA (A1) even as personas differ — a reader moving from Rocco to Carl should feel the same underlying honesty and on-your-side posture, just a different expert neighbor. The platform (Loop) and tone are shared; the persona is local.

## Assumptions

- A1. A three-layer editorial model (universal / product / future-inheritance) scales across the EMG family without per-product rewrites.
- A2. Rocco's voice rules in Part B are sufficient for writers and for AI behavior alignment (with 13).
- A3. Keeping legal/neutral copy out of Rocco's first-person voice avoids both legal risk and tonal whiplash.

## Open Questions

- OQ1. Do we need a shared lint/style checklist (automated) to enforce Part A across content and AI output?
- OQ2. How do seed prompts stay on-voice as their library grows — central review or guidelines-only?
- OQ3. For future guides, who owns approving a new guide's Part B against the Part A contract?
