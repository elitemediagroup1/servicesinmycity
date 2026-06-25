# 01_PROJECT_OVERVIEW.md

> **Status:** Canonical · **Owner:** Lead Architect · **Audience:** Every engineer, designer, and writer touching this codebase · **Read this first.**

## 1. What this document is

This is the entry point to the ServicesInMyCity Build Bible. If you read nothing else before writing code, read this and 04_ROCCO_PERSONALITY. Everything in this repository descends from the principles stated here. When a later document conflicts with this one, this one wins until it is explicitly amended.

## 2. The one-sentence description

ServicesInMyCity is a homeowner-first home-services guidance product where a homeowner can "Ask Rocco what's going on" before they spend a dollar or call anyone — and it is the **first production implementation of the EMG Loop platform.**

## 3. The two things that are true at once

This is the single most important framing in the entire project, and almost every architectural decision traces back to it:

1. **ServicesInMyCity is a real, standalone, useful product on its own.** A homeowner with a leaking water heater can come here, talk to Rocco, understand their situation, and leave better informed. It must deliver value even if Loop never ships.
2. **ServicesInMyCity is simultaneously the proving ground for EMG Loop.** It is product #1 of an intended family (CareInMyCity, PetsInMyCity, GameDayInMyCity, HomesInMyCity, FamiliesInMyCity, BusinessInMyCity), each with its own AI guide (Rocco, Carl, Lucy, Coach, Chef, Advisor). Loop is the shared intelligence and infrastructure layer beneath all of them.

We build the standalone product. We *prepare* the platform. We do **not** build Loop yet (see section 8).

## 4. The cast of concepts

- **Elite Media Group (EMG)** — the company. Owns the platform and all products.
- **EMG Loop** — the platform. An anonymized, consent-gated aggregate intelligence layer plus shared infrastructure that all "InMyCity" products plug into.
- **ServicesInMyCity** — the first product. Home-services guidance for homeowners. The subject of this Build Bible.
- **Rocco** — the AI guide for ServicesInMyCity. Works for the homeowner. Powered by Anthropic.
- **Homeowner / User** — the person Rocco serves. The reason the product exists.
- **Contractor / Partner** — a home-service business. A customer of the platform, never the master of Rocco.

## 5. Mission and philosophy

**Mission:** Help homeowners make better home-service decisions before they spend money.

**Core philosophy:** "Ask Rocco before you call anyone."

Rocco exists to close the information gap between a homeowner who doesn't know what's wrong, what it should cost, what questions to ask, or who to trust — and the moment they make a decision. Rocco shrinks that gap. Rocco does not make the decision for them, and Rocco does not diagnose. **Rocco equips.**

## 6. The non-negotiable invariants

These are locked and referenced throughout the Bible. Changing one is a company-level decision, not an engineering one.

1. **Rocco works for homeowners.** Not contractors. Not EMG's revenue line. When the homeowner's interest and a partner's interest conflict, the homeowner wins, visibly. (ADR-001)
2. **Contractors are customers; homeowners are users.** Customers pay. Users are served. Never blur these roles in code, copy, or UX.
3. **Recommendations are earned, never purchased.** No pay-to-rank. No "sponsored equals recommended." (ADR-007)
4. **Never fabricate.** No invented statistics, contractor counts, review counts, ratings, or testimonials. If we don't have the data, the UI says so or omits it.
5. **Rocco equips; Rocco never diagnoses.** Possibilities, ranges, questions, red flags — never a definitive verdict or guaranteed price. (ADR-002)
6. **Consent is a gate, not a field.** Data flows to Loop only through an explicit, revocable consent gate enforced at the architecture level. (ADR-004)
7. **User trust is more valuable than revenue.** Every ambiguous call is resolved in favor of trust.
8. **The aggregate intelligence layer is separate from the user layer.** Individual data serves the individual; aggregate anonymized data improves the platform; personal-level data is never sold. (ADR-005)

## 7. Phase 1 objective (what success actually is)

> The first mission is NOT to build Loop. The first mission is to prove homeowners trust Rocco.

Phase 1 succeeds if a real homeowner, in a real moment of need, asks Rocco a real question and comes away feeling: that was genuinely on my side, and I'm better off than before I asked. We are not optimizing revenue in Phase 1. We are optimizing earned trust, measured by real usage and qualitative validation, not vanity metrics.

## 8. Build philosophy: Lock, Stub, Validate

1. **Lock the invariants.** The eight rules above and the Rocco personality (04) are enforced in code (prompt construction, server-side guards, consent gates).
2. **Stub the infrastructure.** Loop, the event pipeline, the partner system, and the recommendation engine are designed in full on paper (docs 16-20) and stubbed in code with clean seams — emitting events to a no-op sink, defining the schema, exposing interfaces — but not built into a live intelligence layer. (ADR-008)
3. **Validate with users.** Ship the smallest thing that lets real homeowners talk to Rocco, and learn.
4. **Everything else waits.** Default answer to scope creep is "not yet."

The practical rule for every PR: does this serve the Phase 1 mission, or is it Loop ambition leaking early? If the latter, stub the seam and move on.

## 9. Technology at a glance

- **Hosting:** Netlify (static front-end + serverless). See 14.
- **Front-end:** Astro (static-first + islands). See ADR-011.
- **Compute:** Netlify Functions. All secrets and AI/Maps calls server-side.
- **AI:** Anthropic powers Rocco. Never called from the client. See 13.
- **Local data:** Google Maps/Places. Discovery only, never the recommendation engine (ADR-006). Never called from the client.
- **Secrets:** Env vars ANTHROPIC_API_KEY and GOOGLE_MAPS_API_KEY. Never exposed client-side. See 21.

**Hard rule:** No API key ever reaches the browser. Every privileged call is proxied through a Netlify Function. A client-side key in a diff is an automatic PR rejection.

## 10. The Rocco interaction model (Phase 1)

Phase 1 supports two modes with a clear primary:

- **Primary — open conversational surface ("Ask Rocco what's going on").** Free-text chat is the front door and the hero experience. A persistent floating Ask Rocco widget exists on every page; a dedicated /ask page is the full conversational workspace (ADR-012).
- **Secondary — guided questionnaire (fallback/helper layer).** For homeowners who don't know what to type, especially on service pages, structured prompts seed the conversation. These are on-ramps that feed the same chat, not a separate engine.

**Architectural consequence:** the chat is the canonical interface. Structured prompts are seed generators that produce a first user turn for the chat. Detailed in 13.

## 11. What EMG Loop is (locked definition)

> EMG Loop is an anonymized, consent-gated aggregate intelligence layer that learns from homeowner interactions across ServicesInMyCity and future InMyCity products to improve the platform — architecturally walled off from individual user profiles.

- Individual data serves the user (in-session).
- Aggregate, anonymized data improves the platform.
- Personal-level data is never sold.

Loop is walled off from the user layer: the user-serving path never depends on Loop, and Loop never reaches back into an identifiable individual profile. We design every event, consent flow, and data boundary in Phase 1 so Loop plugs into seams that already exist. Full spec: 16, 17, 18, 20.

## 12. Scope boundaries (what this Bible does NOT authorize)

- Do not build CareInMyCity, PetsInMyCity, or any sibling product. Prepare architecture only.
- Do not build Carl, Lucy, Coach, Chef, Advisor, or any other guide. Rocco only.
- Do not build the live Loop intelligence layer. Stub the seams.
- Do not build partner billing, contractor dashboards, or paid placement in Phase 1.
- Do not ship any feature that requires fabricating data to look populated.

## 13. How to use the Build Bible

Documents are numbered for a reason: lower numbers are more foundational. A future session can be told "Build Section X" or "Build the HVAC service pages" and find everything it needs without re-explaining the project. If you need context that isn't written down, that is a bug in the Bible — fix the Bible, then build.

## Assumptions

- A1. ServicesInMyCity can deliver standalone value before Loop exists.
- A2. The conversational surface is the primary value driver in Phase 1.
- A3. Trust (not revenue) is the correct Phase 1 success metric.

## Open Questions

- OQ1. Exact Phase 1 trust metrics and how they're measured (see 02, 24).
- OQ2. When does the project graduate from Phase 1 to Phase 2 (Loop activation)?
