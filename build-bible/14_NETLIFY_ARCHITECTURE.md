# 14 — Netlify Architecture

> Status: Drafted. Depends on: ADR-011 (Astro), ADR-013 (AI-First), ADR-014 (Static-First), ADR-005 (Aggregate Separation). Feeds: 15_API_SPECIFICATION, 21_SECURITY, 23_PERFORMANCE, 27_DEPLOYMENT_GUIDE.

This document defines the hosting, build, runtime, and serverless infrastructure for ServicesInMyCity on Netlify. Another engineer should be able to provision and operate the platform from this document alone. It does not contain application code; it defines the contract the code must satisfy.

## 1. Hosting Model

ServicesInMyCity is a static-first Astro site (ADR-014) deployed to Netlify CDN, with dynamic behavior delivered exclusively through Netlify Functions. The browser never talks to Anthropic or Google directly. All third-party API calls happen server-side inside Functions so that secrets never reach the client (core invariant: never expose API keys client-side).

Three runtime surfaces exist:

- Static assets (HTML, CSS, JS, images) served from CDN edge.
- Netlify Functions (standard, request/response) for Rocco chat, local search, consent, session, and Loop event ingestion stubs.
- Netlify Edge Functions (optional, future) for lightweight request shaping such as geolocation hints. Phase 1 uses standard Functions only to keep the model simple.

## 2. Environment Variables

Secrets live only in Netlify environment configuration, scoped to Functions. They are never inlined into the static build.

| Variable | Purpose | Exposure |
|----------|---------|----------|
| ANTHROPIC_API_KEY | Server-side Rocco model calls | Functions only |
| GOOGLE_MAPS_API_KEY | Server-side Places/local search | Functions only |
| ROCCO_MODEL | Configurable Anthropic model id (default: a Claude Sonnet model) | Functions only |
| ROCCO_MODEL_FALLBACK | Optional cheaper/faster model for classification or fallback | Functions only |
| DAILY_SPEND_CEILING_USD | Global daily AI spend ceiling | Functions only |
| SESSION_SECRET | Signs anonymous session cookies | Functions only |
| RATE_LIMIT_SESSION | Per-session request cap (tunable) | Functions only |
| RATE_LIMIT_IP | Per-IP request cap (tunable) | Functions only |

Any variable prefixed for client exposure (e.g. PUBLIC_) must contain only non-sensitive values. No key, secret, or model credential may ever be PUBLIC_.

## 3. Model Configuration (Decision 4)

The production default model is a Claude Sonnet model, chosen for the balance of quality and cost. Opus is explicitly NOT the production default due to cost. The model id is read from ROCCO_MODEL so it can be changed without a redeploy of application logic. A smaller/faster model (Haiku-class) may be wired via ROCCO_MODEL_FALLBACK for cheap pre-processing, safety classification, or graceful fallback. Future model routing (13_AI_ARCHITECTURE) reads these same variables; no model id is ever hardcoded in source.

## 4. Cost & Abuse Protection (Decision 3 & 6)

A global daily spend ceiling (DAILY_SPEND_CEILING_USD) caps total AI cost per day across all sessions. Spend is tracked in a lightweight counter (see 15_API_SPECIFICATION for the store). When the ceiling is reached, Rocco degrades gracefully and never silently fails. The user-facing message is honest and non-punishing:

> "Rocco's taking a breather right now so we can keep the service reliable. Try again a little later."

Rules for degradation:

- Never expose internal cost details, thresholds, or spend figures to the user.
- Never make the user feel punished.
- Never silently fail; always return a clear, friendly state with a 200-level conversational response or a structured soft-limit signal the UI can render.

Rate limiting uses conservative defaults (Decision 6): per anonymous session limit, per IP limit, the global daily spend ceiling, and abuse-detection hooks. Exact thresholds are tunable via environment variables during implementation. All limits fall back to the same graceful message rather than hard errors where the user is a legitimate homeowner.

## 5. Function Inventory (Phase 1)

| Function | Route | Responsibility |
|----------|-------|----------------|
| rocco-chat | /api/rocco | Server-side Anthropic call, safety layer, rate limit, spend check, (future) streaming |
| local-search | /api/local-search | Server-side Google Places query, honest 'nearby businesses' results |
| consent | /api/consent | Records consent state for the anonymous session (gate, not field) |
| session | /api/session | Issues/validates anonymous session id (no PII) |
| loop-event | /api/loop-event | No-op stub that accepts anonymized events; writes nowhere meaningful in Phase 1 |

Each Function validates the anonymous session, applies rate/spend limits, and returns structured JSON. The loop-event Function is intentionally a no-op seam so the event contract exists without building Loop (ADR-005, do-not-build-Loop invariant).

## 6. Build & Deploy

- Build command: astro build (produces static output in dist/).
- Publish directory: dist.
- Functions directory: netlify/functions.
- Node version pinned via .nvmrc / NETLIFY_USE_NODE.
- Deploys are atomic; previews on pull requests; production on main.
- netlify.toml is the single source of build/runtime config (see 27_DEPLOYMENT_GUIDE for the full file).

## 7. Streaming Posture (Decision 5)

Phase 1 may ship Rocco non-streaming for simplicity. The Function contract and the chat island are architected so streaming can be added later without breaking the API shape. Until streaming lands, the UI shows a clear "Rocco is thinking" loading state so the experience never feels frozen.

## 8. Security Boundaries

- All secrets server-side only.
- Aggregate intelligence (Loop) is architecturally separate from individual session data (ADR-005); the loop-event stub never joins to identifiable session records.
- Functions are the only egress path to third parties.
- See 21_SECURITY for headers, CSP, and threat model.

## Assumptions

- Netlify Functions latency is acceptable for conversational UX in Phase 1.
- A lightweight key-value store (Netlify Blobs or equivalent) is available for spend counters and rate-limit windows; if not, an external store is substituted without changing the API contract.
- Anonymous session volume in the Jersey Shore launch market is low enough that conservative limits will rarely affect legitimate users.

## Open Questions

- Which concrete store backs spend/rate counters (Netlify Blobs vs external KV)? Decide in 15.
- Do we need Edge Functions for geolocation in Phase 1, or is client-provided city sufficient?
- What is the initial dollar value for DAILY_SPEND_CEILING_USD? Tune during implementation.
- Will streaming be added before or after the first homeowner validation round?
