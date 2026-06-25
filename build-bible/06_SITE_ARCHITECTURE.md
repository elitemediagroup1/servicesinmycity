# 06_SITE_ARCHITECTURE.md

> **Status:** Canonical · **Owner:** Lead Architect (Front-End) · **Depends on:** 00, 05, plus 14 (Netlify) · **Feeds:** 09, 10, 12, 26, 27

## 1. Purpose

Map the IA (05) to a concrete **route structure, rendering strategy, and front-end architecture** on Netlify — optimized for SEO discovery, fast trustworthy page loads, a persistent chat surface, and clean Loop/consent seams. This is the bridge between concept and code skeleton.

## 2. Rendering strategy (the key architectural decision)

ServicesInMyCity is a content-rich, SEO-dependent site with an interactive chat core. That dictates a hybrid:

- **Service & education pages, About/Trust, Legal pages -> static / pre-rendered** (build-time generated, served from Netlify's CDN). Reasons: SEO, performance/trust, and they change infrequently. These are the discoverable, indexable surface.
- **Ask Rocco conversation -> client-side interactive, powered by Netlify Functions.** The chat UI is a client island; all AI/Maps calls are proxied server-side (no keys client-side). The conversation itself is dynamic and not indexed.
- **Local discovery -> on-demand via Functions**, rendered into the relevant context, respecting Google ToS (no bulk pre-caching of Places data).

**Recommendation (CTO call):** adopt a static-site-generator + light client islands approach rather than a heavy SPA framework. Rationale: the SEO/education surface must be fast static HTML; only the chat needs rich interactivity. A full SPA would harm SEO/perf and overbuild against the mission. This recommendation is pending the framework decision in Decisions Required.

## 3. Route map (canonical)

```
/                              Home - hero "Ask Rocco" + value props + entry points     [static + chat island]
/ask                           Full-screen Ask Rocco conversation surface              [chat island]
/services                      Service index (Jersey Shore scope)                      [static]
/services/{service}            Service page (e.g. /services/hvac) - education + seeds   [static + chat island]
/services/{service}/{topic}    Optional sub-topic page (e.g. ac-not-cooling)            [static]  (SEO depth)
/areas/{market}                Market page (e.g. /areas/manahawkin) - local context     [static]  (local SEO)
/services/{service}/{market}   Service x market page (e.g. hvac/manahawkin)             [static]  (local SEO; honest)
/about                         About EMG + homeowner-first promise                      [static]
/about/rocco                   Who Rocco is                                             [static]
/how-it-works                  How Rocco helps / how recommendations work (and don't)   [static]
/trust                         Trust & transparency (no pay-to-rank, no data sale)      [static]
/legal/terms                   Terms of Service                                         [static]
/legal/privacy                 Privacy Policy                                           [static]
/legal/disclaimers             Guidance-not-advice + safety disclaimers                 [static]
/data                          "Manage your data" - consent & session controls          [interactive island]
/404, /offline                 Honest not-found / out-of-market / offline states        [static]

Functions (not user routes):
/.netlify/functions/rocco          AI proxy (Anthropic)       [server]
/.netlify/functions/discover       Local discovery (Google)   [server]
/.netlify/functions/event          Consent-gated event sink   [server, no-op in Phase 1]
/.netlify/functions/consent        Consent state read/write   [server]
/.netlify/functions/session        Session bootstrap          [server]
```

**URL philosophy:** human-readable, lowercase-hyphenated, hierarchical, stable. URLs are forever; design them for the national future (ADR-010). The /services/{service}/{market} pattern scales cleanly to any market without restructuring. No PII or session data in URLs ever.

## 4. The service x market matrix (SEO spine, honestly bounded)

This is the scalable content pattern (12 details it). For Phase 1, the matrix is bounded to the Jersey Shore markets and the launched services — we generate /services/{service}/{market} pages only for combinations we can populate honestly (real education + honest local context). We do not auto-generate thousands of thin national pages (that's the incumbent SEO spam pattern we reject, and it would violate honest-emptiness). The generator is capable of national scale; Phase 1 config restricts it to launch markets.

## 5. Front-end <-> Function boundary

The browser never holds a secret and never calls Anthropic or Google directly. All privileged work goes through Functions:

- Chat island -> POST /functions/rocco (server builds the Rocco system prompt from 04/13, calls Anthropic, applies guardrails, returns the turn).
- Discovery -> GET/POST /functions/discover (server calls Google Places, returns honest, attributed results).
- Every meaningful interaction -> POST /functions/event only if consent allows (Phase 1: validated then dropped to no-op sink — ADR-008).
- Consent/session -> dedicated functions so the gate is enforced server-side, not client-trusted (ADR-004).

## 6. Component & code organization (high-level; detail in 08, 25, 26)

- **Layout shell** (nav, footer with legal+consent, persistent Ask-Rocco affordance) wraps every page.
- **Static content pages** are largely presentational + the chat island.
- **Chat island** is the one stateful, complex client module — isolated so its complexity doesn't leak into the static surface.
- **Shared primitives** (design-system components from 07/08) used everywhere.
- **Function handlers** are thin, single-responsibility, and the only place secrets live.

## 7. State & continuity

- Session ID minted on first load (ADR-003); stored per 21 (httpOnly cookie preferred for the gate-relevant token; localStorage for non-sensitive continuity — finalized in 18/21).
- Conversation state is client-held during a session, with optional in-session memory (OQ1). No server-side per-user profile in Phase 1 (walled-off — ADR-005).

## 8. Performance & resilience posture (full detail 23)

- Static pages: CDN-served, instant, indexable.
- Chat: streaming responses from the rocco function for a responsive feel; graceful degradation if the AI call fails (honest error, never a fabricated answer).
- Discovery failures degrade honestly ("couldn't load nearby businesses right now"), never with invented results.
- No render-blocking dependence on third-party scripts for core content.

## 9. SEO & rendering interplay (full detail 12)

The static surface exists to be found. Every service and service x market page is pre-rendered with proper metadata, structured data, and honest local content, then hands the found homeowner to Rocco. The chat is intentionally not indexed. This cleanly separates "be discoverable" (static) from "deliver value" (chat).

## 10. Scalability path

- Adding a market = adding config + honest content, not re-architecting.
- Adding a service = new service definition + content + seed prompts.
- Activating Loop later = wiring the already-emitting event seam to a real consumer behind the consent gate; the front-end does not change.
- A future sibling product (Care/Pets/etc.) reuses the shell, the function pattern, and the design foundation, swapping the product accent and the guide.

## Assumptions

- A1. A static-generator + islands architecture fits the SEO+chat hybrid better than a full SPA. (Challengeable per framework decision.)
- A2. Netlify Functions are sufficient for Phase 1 AI/discovery/consent proxying at expected volume.
- A3. Streaming AI responses are feasible within Netlify Function limits; if not, fall back to non-streaming with a responsive loading state.
- A4. The route map covers Phase 1 needs; sub-topic and market pages are additive, not restructuring.

## Open Questions

- OQ1. Which static-site framework/generator? (Decisions Required — blocks 07/08 implementation specifics.)
- OQ2. Streaming vs. non-streaming for the rocco function on Netlify? (Impacts 13, 15, 23.)
- OQ3. Is /ask a distinct full-screen route, or only an expanded state of the omnipresent chat? (UX; impacts 08, 09.)
- OQ4. Cookie (httpOnly) vs localStorage split for session token vs continuity data? (Impacts 18, 21.)
- OQ5. Do we pre-render service x market pages at build time, or render on-demand and cache? (ToS + perf; impacts 12, 15.)
