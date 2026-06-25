# 02_PRODUCT_STRATEGY.md

> **Status:** Canonical · **Owner:** Product · **Depends on:** 01_PROJECT_OVERVIEW.md

## 1. The strategic thesis

Home services is a market defined by **information asymmetry and low trust.** Homeowners enter every transaction at a disadvantage: they don't know what's wrong, what it costs, whether they're being upsold, or who's competent. The incumbents (lead-gen marketplaces, review aggregators, contractor directories) largely monetize the homeowner's confusion — they sell the homeowner's intent to contractors as a lead, which structurally aligns them with the contractor, not the homeowner.

**Our wedge is the opposite alignment.** Rocco sits on the homeowner's side of the table before the transaction and before the lead. We win by being the one place a homeowner trusts to ask "what's actually going on here?" — and we monetize later, in ways that never compromise that trust. The thesis is that durable trust at the top of the funnel is more valuable, and more defensible, than extracted intent at the bottom.

## 2. Who we serve and who pays

**Users (homeowners)** are served. They never pay to ask Rocco. They are not the product to be sold. Their data serves them individually and, only with consent and only in anonymized aggregate, improves the platform.

**Customers (contractors/partners)** pay. But they pay for legitimate value (qualified visibility, tools, eventually well-structured connections), never for the ability to bias Rocco's guidance or buy a recommendation (ADR-007). The product is architected so the paying side can never purchase outcomes on the served side. This separation is the whole company.

## 3. The job-to-be-done

A homeowner "hires" ServicesInMyCity in a specific emotional moment: **something is wrong (or about to be), and they feel out of their depth and slightly afraid of being taken advantage of.** The job is: "Help me understand my situation well enough to make a confident, non-stupid decision and not get ripped off."

That breaks into four sub-jobs Rocco must serve:

- **Orient** — "What might be going on?" (possibilities, not diagnosis)
- **Calibrate** — "What's a reasonable cost range?" (ranges, not quotes)
- **Prepare** — "What should I ask, and what should make me walk away?" (questions, red flags)
- **Act** — "What's a sensible next step?" (a clear, low-pressure path forward)

## 4. Positioning

> For homeowners facing a home-service problem, ServicesInMyCity is the guide you talk to before you call anyone — because Rocco works for you, not the contractor.

We are explicitly not a marketplace, not a review site, and not a lead-gen funnel dressed as advice. We are a pre-decision guidance layer. Competitors answer "who should I call?" by selling your click. We answer "what's going on, and how do I not get burned?" — and only then, who might help, on the homeowner's terms.

## 5. Why now / why us

- **AI makes genuine guidance scalable.** For the first time, a homeowner can have a patient, knowledgeable, on-their-side conversation at 11pm without a human expert. Incumbents structurally can't offer this because their incentives point the other way.
- **Trust is an unclaimed position.** The category leaders are widely distrusted. The position "the one that's actually on your side" is open.
- **Loop compounds.** Each honest interaction teaches the platform (in aggregate, consented form) what homeowners actually struggle with — a data asset a pure lead-gen competitor can't replicate without changing their model.

## 6. The product principles (how strategy becomes decisions)

1. **Trust before scale.** We'd rather have 1,000 homeowners who'd swear by Rocco than 1,000,000 who feel manipulated.
2. **Equip, don't decide.** Every feature increases the homeowner's agency, never replaces their judgment.
3. **Earned, never bought.** Any ranking or surfacing is justified by homeowner-aligned criteria, never by who paid.
4. **Honest emptiness.** A sparse-but-true experience beats a full-but-fake one.
5. **Restraint as a feature.** We deliberately under-build; the product feels calm and uncrowded.

## 7. The monetization posture (Phase 1: deliberately deferred)

Phase 1 does not monetize. We are buying trust, not revenue. We design the eventual model so nothing we build now blocks or corrupts it.

- **Allowed eventual models:** partner subscriptions for legitimate tools/visibility; clearly-labeled advertising visually and semantically separated from recommendation; structured, consent-driven connections initiated by the homeowner.
- **Forbidden forever (invariants):** pay-to-rank, pay-to-be-recommended, selling personal-level data, laundering ads through Rocco's voice, fabricated trust signals.

The architecture (19, 20) keeps "who pays" and "what gets recommended" in separate, auditable code paths from day one, even though neither is monetized yet.

## 8. Competitive landscape (posture, not a teardown)

We treat incumbents as a category of misaligned incentives rather than as feature checklists to match. Instruction to engineers and designers: do not copy incumbent patterns reflexively. Many of their UX conventions (aggressive lead capture, "get 3 quotes now," gated phone numbers, dark-pattern urgency) are expressions of the model we're rejecting. Reaching for one of those patterns is a tell that we've drifted to the contractor's side of the table.

## 9. How we measure Phase 1 (trust, not vanity)

We do not optimize raw traffic, leads, or revenue in Phase 1. Candidate signals (qualitative-weighted):

- **Depth of engagement** — do homeowners actually converse (multi-turn), or bounce?
- **Return intent** — would they come back / "ask Rocco again"? (survey + behavior)
- **Felt alignment** — do users describe Rocco as "on my side"?
- **Honest outcomes** — did the homeowner report making a more confident decision?
- **Trust integrity (guardrail metric)** — zero fabricated data shipped; zero pay-to-rank leakage. Any violation is a failure regardless of growth.

Explicitly not Phase 1 north stars: pageviews, ad impressions, lead volume, SEO ranking for its own sake.

## 10. The roadmap shape (detail in 29 & 30)

- **Phase 1 — Prove trust.** Rocco + a handful of service pages + honest local search. Loop stubbed.
- **Phase 2 — Deepen & widen.** More verticals, refined recommendation logic, first careful partner relationships, consent flows exercised with real data. Loop seams begin emitting.
- **Phase 3+ — Activate Loop & the family.** Aggregate intelligence comes online; sibling products reuse the platform.

The roadmap is a ladder of trust, not a ladder of features. We don't climb to the next rung until the current one holds weight.

## 11. Strategic risks and how the architecture answers them

- Trust erosion via monetization pressure -> invariants in code; recommendation and payment paths separated and auditable (19, 20).
- Rocco "diagnosing" and being wrong -> equip-not-diagnose enforced in prompt + guardrails (04, 13).
- Looking empty in new markets -> honest-emptiness component states (08); never fabricate.
- Privacy/consent backlash -> consent-as-a-gate, walled-off Loop, no personal-data sale (16, 18).
- Scope creep into Loop too early -> Lock-Stub-Validate; "not yet" default.

## Assumptions

- A1. Trust at the top of the funnel is more defensible than extracted intent at the bottom.
- A2. Homeowners will value pre-decision guidance enough to return.
- A3. A deferred-monetization posture is financially survivable through Phase 1.

## Open Questions

- OQ1. What is the precise quantitative + qualitative definition of "trust" we will track? (Feeds 24.)
- OQ2. What is the first legitimate monetization motion in Phase 2, and how is it walled from recommendation?
- OQ3. What is the trigger to expand beyond the Jersey Shore launch market?
