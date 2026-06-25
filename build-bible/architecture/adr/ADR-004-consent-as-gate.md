# ADR-004 — Consent As Gate

**Status:** Accepted · Permanent invariant
**Date:** Phase 1 founding
**Owner:** Privacy + Lead Architect

## Context

The platform thesis is "every conversation Rocco has is a signal, and every signal feeds the Loop." That is only acceptable if the homeowner genuinely controls whether and how their data flows.

## Decision

Consent is an **architectural gate**, not a checkbox or a downstream field. Data flows to Loop *only* through an explicit, revocable gate enforced at the boundary (server-side). The default state shares nothing beyond what serves the in-session user. Consent is contextual and just-in-time — the user receives value first; consent is requested only when data would actually flow to Loop. Declining never degrades core functionality.

## Alternatives Considered

- **Implied consent** ("by using this site you agree...").
- **Consent as a field** we record and hope is honored downstream.

## Why Rejected

- Implied consent is a dark pattern and a legal landmine, and it violates the trust brand.
- Honor-system fields drift, get bypassed, and leak; they cannot be audited or enforced.

## Consequences

- Event emission checks consent at the seam before anything leaves the user boundary.
- Revocation must stop all future flow and be honored end-to-end.
- Consent state lives on the anonymous session and is always reviewable/revocable (footer "Manage your data").

## Future Impact

The same consent gate is reused by every EMG product that ever feeds Loop. It is foundational to the consent architecture and the event schema.
