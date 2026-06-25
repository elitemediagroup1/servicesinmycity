# 15 — API Specification

> Status: Drafted. Depends on: 14_NETLIFY_ARCHITECTURE, 13_AI_ARCHITECTURE, ADR-002 (Anonymous Session), ADR-005 (Aggregate Separation), ADR-010 (Recommendation Stub). Feeds: Astro scaffold sprint, 21_SECURITY.

This document defines the HTTP contract between the ServicesInMyCity client (Astro islands) and the Netlify Functions backend. It is implementation-ready: another team could build the functions and the client against this spec without further explanation. All endpoints are server-side; the browser never holds API keys.

## Conventions

- Base path: /api (Netlify Functions, redirected via netlify.toml).
- All requests and responses are application/json unless noted.
- Every request carries the anonymous session via signed cookie (ADR-002); no PII, no accounts.
- All endpoints enforce rate limits and the global spend ceiling (14).
- Errors are friendly and structured; Rocco never silently fails.

## Common Response Envelope

```
{
  "ok": true,
  "data": { ... },
  "soft_limit": false,
  "message": null
}
```

When a limit or ceiling is reached, the envelope sets ok=true, soft_limit=true, and message to the honest degradation copy so the UI can render it conversationally. Hard errors (malformed input, server fault) return ok=false with a generic, non-leaking message.

## 1. POST /api/session

Issues or validates the anonymous session.

Request: empty body. Response data: { sessionId (opaque), createdAt, expiresAt }. The sessionId is an opaque, signed token; it is not joinable to any identity. Sets an HttpOnly, Secure, SameSite cookie. No PII is collected or returned.

## 2. POST /api/consent

Records consent state. Consent is a gate, not a field (invariant).

Request: { scope: 'session_memory' | 'aggregate_insights', granted: boolean }. Response data: { scope, granted, recordedAt }. Aggregate consent governs whether anonymized signals may feed the Loop seam; it is independent from session memory consent. Withholding consent must never degrade core Rocco help (consent gates enhancement, not the base experience).

## 3. POST /api/rocco

Primary Rocco conversation endpoint.

Request:
```
{
  "messages": [ { "role": "user" | "assistant", "content": "..." } ],
  "city": "Manahawkin",
  "seedPrompt": null
}
```

Server behavior:
- Validates session, applies per-session and per-IP rate limits, checks daily spend ceiling.
- Builds the system prompt and safety layer per 13_AI_ARCHITECTURE (equip-not-diagnose, emergency escalation, prompt-injection defense).
- Calls Anthropic using ROCCO_MODEL (Sonnet-class default; configurable). May use ROCCO_MODEL_FALLBACK for classification/fallback.
- Phase 1 returns a complete (non-streaming) assistant message. Response shape is forward-compatible with streaming (chunked transfer / SSE) without changing the request contract.

Response data: { reply: { role: 'assistant', content }, usedTool: null | 'local-search', safety: { flagged: boolean, category } }.

Degradation: if the spend ceiling or a hard rate limit is hit, return soft_limit=true with message: "Rocco's taking a breather right now so we can keep the service reliable. Try again a little later." Never expose cost or threshold internals.

## 4. POST /api/local-search

Honest discovery via Google Places (ADR-004, ADR-010). This is NOT the recommendation engine.

Request: { query: 'plumber', city: 'Toms River', radiusMeters: 16000 }. Response data: { businesses: [ { name, address, rating?, userRatingsTotal?, placeId } ], source: 'google_places' }. Results are presented honestly as nearby businesses returned from Google, never as 'Rocco's Top Picks'. If Google returns nothing, return an empty array and an honest empty state; never fabricate listings, counts, ratings, or reviews.

## 5. POST /api/loop-event (NO-OP STUB)

Accepts anonymized interaction signals for the future Loop. In Phase 1 this is a deliberate no-op seam (ADR-005, do-not-build-Loop).

Request: { type: string, anonymizedPayload: object, consentScope: 'aggregate_insights' }. Server behavior: validates aggregate consent is granted; if not, the event is dropped. If granted, the event is accepted and discarded (or written to a throwaway sink) in Phase 1. The event is never joined to the session identity. Response data: { accepted: boolean }. The contract exists so the seam is real without building Loop.

## 6. Status & Health

GET /api/health returns { ok: true, build, time } for deploy verification. It performs no AI calls and is exempt from spend accounting.

## Rate Limiting & Spend (summary)

All AI-consuming endpoints share the same guardrails defined in 14: per-session cap (RATE_LIMIT_SESSION), per-IP cap (RATE_LIMIT_IP), global daily ceiling (DAILY_SPEND_CEILING_USD), and abuse-detection hooks. Counters live in a lightweight KV store (Netlify Blobs or equivalent). Thresholds are env-configurable and tuned during implementation.

## Assumptions

- A single anonymous session cookie is sufficient for continuity in Phase 1; no cross-device sync.
- Google Places coverage in the Jersey Shore market is adequate for useful discovery.
- Non-streaming responses are acceptable latency-wise for the first homeowner validation round.

## Open Questions

- Final KV backing store and its consistency guarantees for spend counting.
- Exact seedPrompt taxonomy (which structured prompts seed conversations) — coordinate with 13 and 08.
- Should /api/local-search results be cached server-side to reduce Google cost, and for how long?
- When streaming lands, SSE vs chunked transfer for Netlify Functions.
