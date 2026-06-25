# 05_INFORMATION_ARCHITECTURE.md

> **Status:** Canonical · **Owner:** UX Architect + Lead Architect · **Depends on:** 00, 01-04 · **Feeds:** 06, 08, 09, 10, 12, 13, 17, 18

## 1. Purpose & scope

This document defines the **conceptual structure** of ServicesInMyCity: the content objects that exist, how they relate, how a homeowner moves through them, and how the legal, consent, and identity layers are woven through every surface. It is deliberately **render-agnostic** — 06_SITE_ARCHITECTURE maps these concepts to routes and Netlify rendering. IA defines *what and why*; Site Architecture defines *where and how*.

## 2. First principles for this IA

1. **The conversation is the center of gravity.** The open "Ask Rocco" chat is primary; everything else exists to feed into it or support it. The IA is a hub-and-spoke around Rocco, not a directory with a chatbot bolted on.
2. **Cross-cutting layers, not pages.** Identity (session), consent, and legal/disclaimer are inherited layers present on every surface — not destinations a user visits. This is the most important structural idea here.
3. **Market-scoped.** Everything lives within the Jersey Shore launch footprint (ADR-010). Location is a first-class dimension, not an afterthought.
4. **Honest emptiness is a designed state, not an error.** Every content object has a defined "we don't have this yet / not in your area yet" state.

## 3. The content object model

These are the canonical objects in the system. Their persisted shapes appear in 17_EVENT_SCHEMA and future data docs; here we define their meaning and relationships.

- **Conversation** — a homeowner's chat with Rocco; the product's core object. Belongs to a Session; may originate from a Service, a Seed Prompt, or the home; references Local Businesses; emits Events (consent-gated).
- **Session** — anonymous identity envelope (ADR-003). Owns Conversations and Consent State; expires.
- **Service** — a home-service category (HVAC, Plumbing, Electrical, Roofing). Has educational Content; offers Seed Prompts; scoped by Market.
- **Seed Prompt** — a structured starter that composes a first chat message (the guided fallback). Belongs to a Service (or general); produces a Conversation turn.
- **Local Business** — a nearby business returned from Google discovery (ADR-006). Surfaced within a Conversation/Service context; never ranked as "Rocco's pick"; attributed to Google.
- **Market** — a launch geography (town/county within Jersey Shore). Scopes Services and Local Business discovery; gates the "in your area?" experience.
- **Consent State** — the homeowner's current data-sharing choices (ADR-004). Belongs to Session; gates Event emission to Loop.
- **Legal Surface** — ToS, Privacy, "guidance not professional advice," safety/emergency disclaimers (ADR-002). Inherited by every guidance surface; some also standalone pages.
- **Event** — an anonymized signal (ADR-005/008). Emitted by interactions; passes through the Consent Gate to a no-op sink in Phase 1.
- **Partner (stubbed)** — future EMG trusted-network member. Not surfaced to homeowners in Phase 1; seam only.

**The relationship that matters most:** Service to Seed Prompt to Conversation (with Rocco) to optional Local Business surfacing, all wrapped in Session + Consent + Legal. That spine is the product.

## 4. Primary information zones

The IA organizes into five zones. Three are layers (omnipresent), not navigable sections.

- **Zone A — The Conversation (primary).** The "Ask Rocco" surface. Reachable from everywhere. Accepts free-text (primary) or a seeded prompt (secondary). This is where value is delivered.
- **Zone B — Service & Education.** Per-service explainer content that teaches honestly, is SEO discoverable, and hosts Seed Prompts that hand off to Zone A. Service pages are on-ramps to Rocco, not endpoints.
- **Zone C — Local Discovery.** Honest "what exists nearby" surfacing from Google, attributed and ToS-compliant, contextual to a service/market. Never a standalone directory that competes with Google (ADR-006).
- **Zone D — Trust & About.** Who Rocco is, who EMG is, the homeowner-first promise, how recommendations work (and don't), why we don't sell personal data. This zone is the trust-building surface and should be unusually transparent.
- **Layer 1 — Legal/Disclaimer** (cross-cutting). **Layer 2 — Consent** (cross-cutting). **Layer 3 — Identity/Session** (cross-cutting, invisible).

## 5. The homeowner journey (canonical flows)

- **Flow 1 — Direct ask (hero path).** Home, types a problem into Ask Rocco, conversation: Rocco lowers temperature, orients, equips, suggests next step, optionally surfaces nearby businesses honestly, homeowner leaves better-informed. No account, no friction.
- **Flow 2 — "I don't know what to type" (guided fallback).** Home or Service page, picks a Seed Prompt, which composes the first message, hands off to the same Rocco conversation, continues as Flow 1. The questionnaire never becomes a separate engine; it seeds chat.
- **Flow 3 — SEO entry.** Search engine, lands on a Service page, reads honest education, "Ask Rocco about this," Flow 1/2.
- **Flow 4 — Out-of-market.** User outside Jersey Shore: Rocco still helps with general guidance/education, but local discovery honestly says "I don't have good local coverage there yet" (ADR-010). No faking.
- **Flow 5 — Consent moment.** At the point where sharing would benefit the platform (not the user's immediate need), the consent gate appears in-context, plain-language, decline-friendly. Declining never degrades the core experience (ADR-004).

## 6. Navigation model

- Persistent, minimal global nav: Ask Rocco (primary CTA), Services, About/Trust. That's it. Restraint equals trust.
- Ask Rocco is omnipresent — a persistent affordance on every page, because the conversation is the product.
- Service pages cross-link to related services and always to Rocco.
- Footer carries the Legal Surfaces (ToS, Privacy, Disclaimers), consent management ("Manage your data"), market info, and EMG/Loop attribution.
- No dark-pattern nav: no fake notification badges, no manufactured-urgency banners, no gated phone numbers, no "get 3 quotes" pressure.

## 7. Legal/Disclaimer architecture (Layer 1 — product architecture, not just copy)

Per ADR-002, legal is inherited structure. Every guidance surface (Rocco's chat, service pages, any cost-range content) inherits four guarantees:

1. **Equips, not diagnoses** — present near guidance, not buried.
2. **Educational, not professional advice** — explicit, plain-language.
3. **Emergency escalation** — for hazardous categories (gas leak, electrical, active flooding, structural, CO), the surface escalates to "stop and call a pro/emergency services" before equipping. This is a routing rule in 13, not just text.
4. **Safety disclaimers** — context-appropriate, never alarmist.

**Architectural requirements:** implemented as a reusable disclaimer component plus a server-side safety-classification step (a message touching a hazardous category triggers escalation copy and a more conservative Rocco posture). Service-page cost ranges carry the same "educational, may be outdated" discipline as Rocco. Standalone pages: Terms of Service, Privacy Policy, How Rocco Works / Disclaimers.

## 8. Consent architecture in the IA (Layer 2)

Full spec in 18; here's how it threads the IA:

- Consent is contextual and just-in-time, not a wall on entry. The user gets value first; consent is requested only when data would flow to Loop.
- Consent state lives on the Session and is always reviewable/revocable via footer "Manage your data."
- Default equals minimal sharing. Nothing flows to Loop without an affirmative gate. Declining preserves full core functionality.
- A cookie/storage notice handles the session-ID mechanism itself (privacy-first defaults).

## 9. Identity/Session architecture in the IA (Layer 3)

Per ADR-003: invisible to the user. On first visit, an anonymous session ID is minted (cookie/localStorage, expiring). It enables conversation continuity and optional in-session memory, anchors consent, and is the (anonymized) join key for events. No PII is required or requested to use the product. When the session expires, continuity ends gracefully. This layer must be designed to forward-migrate to accounts later without breaking the event/consent model.

## 10. Honest-emptiness states (designed, not accidental)

Every object defines its empty/unavailable state: a Service with thin content says so; Local Discovery with few/no Google results says "not many businesses showing up nearby for this" rather than padding; an out-of-market user gets Flow 4. These states are first-class IA, owned here and componentized in 08.

## Assumptions

- A1. The primary value moment is conversational; service pages and discovery are supporting, not co-equal. (Challengeable if SEO/education turns out to drive most value.)
- A2. Anonymous sessions provide enough continuity for Phase 1 trust validation without accounts.
- A3. Google discovery is sufficient and ToS-compliant for "what's nearby" in the launch markets; exact ToS display/caching constraints will be verified in 15.
- A4. A small launch market keeps emptiness honest; service-page content can be authored credibly for Jersey Shore.
- A5. Just-in-time consent yields acceptable Loop signal later without dark patterns.

## Open Questions

- OQ1. Does in-session memory persist across page reloads within a session, and for how long until expiry? (Impacts 13, 21.)
- OQ2. Where exactly is the consent gate triggered — first event? first "save"? entering chat? (Impacts 18.)
- OQ3. Do service pages render Google discovery inline, or only via Rocco? (ToS + UX; impacts 06, 15.)
- OQ4. How do we handle a user who asks Rocco about a non-home or out-of-scope topic? (Scope boundary in 13.)
- OQ5. Multi-language need for the Jersey Shore market? (Accessibility/reach; deferred.)
