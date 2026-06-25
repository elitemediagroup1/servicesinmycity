# 10_SERVICE_PAGE_FRAMEWORK.md

> **Status:** Canonical · **Owner:** Product + UX + SEO + Content · **Depends on:** 03, 04, 05, 06, 07, 11, 12, 13, 22 · **Feeds:** every service page, 09, 12
>
> This is the **canonical template** every ServicesInMyCity service page follows. One framework should generate hundreds of consistent, honest, high-trust, SEO-strong service pages (HVAC, Plumbing, Electrical, Roofing, etc.) across launch markets (ADR-010). It defines content hierarchy, SEO hierarchy, user psychology, trust progression, CTA placement, Rocco insertion points, local content blocks, schema, accessibility, and conversion strategy.

## 1. What a "service page" is (and isn't)

A service page is an **honest educational on-ramp to Rocco** for one home-service category, optionally scoped to a market (/services/{service} and /services/{service}/{market}, see 06). It is **not** a directory listing, a lead-capture funnel, or a sales page. Its job: help an anxious homeowner understand their situation enough to confidently talk to Rocco (ADR-013), and be discoverable when they search (12).

## 2. The page as a psychological journey (trust progression)

The template mirrors Rocco's four-step mission (04) and walks the reader from anxiety to confidence:

1. **Land & reassure** — you're in the right place; this is calm and on your side.
2. **Orient** — here's what might be going on (possibilities, not diagnosis).
3. **Calibrate** — here's what's reasonable (cost ranges + drivers, honestly framed).
4. **Prepare** — here's what to ask and what should make you walk away.
5. **Act** — talk to Rocco / see what's nearby, low-pressure.

Trust is earned top-to-bottom: we give value before asking for anything. No gate stands between the reader and the information.

## 3. Canonical content hierarchy (section order)

Every service page renders these blocks in this order (blocks may be omitted only with an honest empty state, never faked):

1. **Hero** — service name + one-line plain-language framing + primary Rocco CTA. Display type (Manrope) for the headline (07).
2. **Reassurance / "what this page helps with"** — short, calm, sets expectations.
3. **Common situations / symptoms** — "what might be going on" (orient). Possibilities framed honestly (ADR-002).
4. **What it typically costs** — ranges with the factors that move them; dated/"varies" framing; equip-not-diagnose discipline (11 B3).
5. **Questions to ask a pro + red flags** — the protective core; what good looks like, what to walk away from.
6. **DIY vs. call-a-pro** — honest guidance, including "you might have time / wait and see," and clear safety/escalation for hazards (05, 13 section 7).
7. **Ask Rocco block** — prominent invitation + seed prompts specific to this service (section 6).
8. **Local context block** — market-specific, honest (section 7).
9. **Nearby businesses (optional, discovery)** — Google-sourced, attributed, never "Rocco's picks" (ADR-006).
10. **Related services** — internal links (e.g., HVAC <-> Plumbing for water heaters).
11. **Disclaimers** — educational-not-advice + safety, inherited (05, 11 A5).

## 4. SEO hierarchy (binds 12)

- **One H1** = the primary service intent (e.g., "HVAC Help" or service x market variant). Exactly one per page.
- **H2s** map to the content blocks above (situations, costs, questions, DIY-vs-pro, local).
- **Semantic HTML**, real headings, descriptive links — progressive enhancement (ADR-015) means content is fully present without JS.
- **Metadata:** unique title + meta description per page; canonical URL; Open Graph.
- **Internal linking:** service<->market<->related-service mesh; every page links to Rocco.
- **No keyword stuffing, no thin pages** (11 B6, ADR-010).

## 5. Schema opportunities (structured data)

Use only schema we can populate honestly:

- **Service** / **HowTo** (for "questions to ask" / "what to check") where genuinely applicable.
- **FAQPage** for real Q&A blocks (only real questions/answers, never fabricated).
- **BreadcrumbList** for navigation.
- **LocalBusiness** schema is **not** asserted for businesses we don't own; Google-sourced businesses are attributed in-content, not claimed as our structured data (ADR-006).
- Never use schema to fake reviews/ratings/aggregate ratings (invariant).

## 6. Rocco insertion points (where the guide appears)

- **Hero CTA:** "Ask Rocco about your {service} problem."
- **After "common situations":** "Not sure which is yours? Tell Rocco what's happening." + seed prompts (e.g., "My AC is blowing warm air," "My heater won't turn on").
- **After "what it costs":** "Got a quote that feels off? Run it by Rocco."
- **Persistent floating widget** on the page (ADR-012) for anytime asks.
- Seed prompts compose the first chat turn and hand off to the same conversation engine (05, 13). They are on-ramps, not a separate flow.
- Rocco's voice in these blocks follows 11 Part B; legal/disclaimer copy stays neutral (11 B2).

## 7. Local content blocks (honest, market-scoped)

- For /services/{service}/{market}, include genuinely local context (e.g., climate/seasonal drivers relevant to the Jersey Shore, common local housing-stock issues) — only where we can write it credibly (ADR-010).
- Out-of-market or thin-market pages use honest empty states ("We're focused on the Jersey Shore right now") rather than generic filler.
- Local discovery (nearby businesses) is optional, Google-sourced, attributed, and never ranked as endorsements (ADR-006).

## 8. CTA placement & conversion strategy (honest conversion)

- **Primary conversion = starting a conversation with Rocco** (not a lead, not a sale). Success is an informed, confident homeowner (02, ADR-013).
- CTAs are calm, specific, low-pressure, and repeated at natural decision points (hero, after orient, after cost, end). Never manufactured urgency (03, 11 A2).
- No gated content; the information is the value, the conversation is the next step.
- One obvious next action per screen region (07 section 7).

## 9. Accessibility (binds 22)

- Semantic structure (one H1, logical heading order, landmarks), keyboard-navigable, AT-friendly.
- Fully usable without JavaScript (ADR-015): all educational content is static HTML; the Rocco widget is an enhancement with an honest no-JS fallback.
- Color/contrast per 07/22 (AA); never color-only meaning; respect reduced-motion.

## 10. The template as a generator (consistency at scale)

- Service pages are generated from **Astro content collections** (ADR-011): each service is a structured content entry (situations, cost-range data with drivers, questions, red flags, DIY-vs-pro guidance, seed prompts, related services), and each market adds honest local context.
- The template renders these entries into the canonical hierarchy (section 3) with consistent SEO (section 4), schema (section 5), and Rocco insertion points (section 6).
- **Authoring contract:** a new service ships by authoring its content entry to the schema below; no bespoke layout work. This is how one framework yields hundreds of consistent pages.

## 11. Service content entry schema (authoring contract — conceptual)

Each service entry provides: slug; display name; one-line framing; reassurance copy; list of common situations (each: label + honest "what it could mean" + whether-hazardous flag); cost guidance (ranges + drivers + "varies/dated" note); questions-to-ask list; red-flags list; DIY-vs-pro guidance (incl. safety/escalation notes); seed prompts; related service slugs; FAQ entries (real). Market entries add: local context blocks; seasonal/regional drivers; availability flag. (Exact field types finalized in implementation; this is the canonical shape.)

## 12. Quality bar / definition of done for a service page

A service page is done when: it walks the trust progression (section 2); every block is honest or honestly empty (never faked); cost is ranged + dated + equip-not-diagnose; hazards escalate (05/13); it has correct single-H1 SEO + honest schema; Rocco insertion points + seed prompts are present and on-voice (11); it's fully accessible and works without JS (ADR-015/22); and it links into the service/market/related mesh.

## Assumptions

- A1. A single content-collection-driven template can serve all Phase 1 services without per-service bespoke layouts.
- A2. The trust-progression order maximizes both homeowner confidence and honest conversion to a Rocco conversation.
- A3. Honest, useful pages outperform thin SEO-spam pages for our goals over time (12).
- A4. Local content can be authored credibly for Jersey Shore markets.

## Open Questions

- OQ1. Final field types/validation for the service + market content schema (ties 11, implementation).
- OQ2. Do nearby-business discovery results render inline on the static page or only via Rocco (ties 05 OQ3, 06 OQ5, 15, Google ToS)?
- OQ3. Which schema types are safe and beneficial given the never-fabricate constraint — confirm with 12?
- OQ4. How many seed prompts per service, and who maintains them on-voice as the library grows (ties 11 OQ2)?
- OQ5. How are cost ranges sourced and kept current without creating ADR-002 liability (owner + cadence)?
