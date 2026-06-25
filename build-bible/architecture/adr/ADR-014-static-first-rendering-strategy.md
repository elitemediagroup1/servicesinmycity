# ADR-014 — Static-First Rendering Strategy

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Lead Architect (Front-End)

## Context

Our discoverable surface (service, service x market, about, legal pages) depends on SEO and must load fast to earn trust. Our interactive surface (Ask Rocco) needs rich client behavior. Rendering strategy must serve both without compromising either.

## Decision

**Static-first rendering.** All content/marketing/legal pages are pre-rendered to static HTML at build time and served from Netlify's CDN. Interactivity is added only where needed via Astro Islands (ADR-011), the primary island being the Ask Rocco chat. Privileged/dynamic work (AI, discovery, consent, events) runs in Netlify Functions, not in the page render.

## Alternatives Considered

- **Server-side rendering (SSR) everywhere.**
- **Client-side-rendered SPA.**

## Why Rejected

- SSR-everywhere adds server runtime cost and latency for pages that are essentially static, with no SEO or UX benefit for our content.
- A CSR SPA harms SEO (content not in initial HTML), hurts first-load performance, and ships unnecessary JS — the opposite of our trust/performance goals.

## Consequences

- Excellent Core Web Vitals and crawlability for the content surface (supports 12, 23).
- The chat island and Functions handle all dynamic behavior; the static pages stay cacheable and fast.
- Service x market pages are generated from content collections at build time, bounded honestly to launch markets (ADR-010).
- Any future need for on-demand rendering (e.g., personalized pages) is an explicit, scoped exception, not the default.

## Future Impact

Static-first is the default rendering posture for every EMG property. New dynamic capabilities are added as islands or Functions, preserving the fast, indexable static core.
