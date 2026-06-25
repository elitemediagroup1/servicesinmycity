# ADR-015 — Progressive Enhancement

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Lead Architect (Front-End) + Accessibility

## Context

A trust brand cannot afford a fragile experience. Slow connections, older devices, blocked scripts, JavaScript failures, and assistive technologies are all part of our real audience — anxious homeowners in a moment of need. The product must degrade gracefully rather than break.

## Decision

We build with **progressive enhancement**. Core content and navigation work as semantic HTML without JavaScript. Interactivity (notably the Ask Rocco chat island) enhances that baseline but is not a prerequisite for accessing information. When an enhancement is unavailable, the experience degrades honestly to a usable, accessible baseline rather than failing.

## Alternatives Considered

- **JS-required experience** where nothing works without client scripts.
- **Graceful degradation only** (build for the rich case, then patch fallbacks).

## Why Rejected

- JS-required excludes users on flaky connections/old devices and harms resilience, accessibility, and trust.
- Degradation-only inverts the priority and tends to leave fallbacks as afterthoughts that quietly rot.

## Consequences

- Static content (service pages, education, legal, about) is fully usable with HTML/CSS alone.
- The chat island is an enhancement: if it can't load, the page still informs the homeowner and offers an honest path (e.g., a no-JS message and links), never a broken shell.
- Forms and links use real semantics so they function and are accessible by default (supports 22).
- AI/discovery failures degrade to honest messaging, never fabricated content (consistent with the never-fabricate invariant and 13 recovery behavior).

## Future Impact

Progressive enhancement is a standing engineering principle for every EMG property. Resilience and accessibility are designed in from the baseline up, not bolted on.
