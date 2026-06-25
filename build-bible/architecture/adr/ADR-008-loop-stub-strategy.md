# ADR-008 — Loop Stub Strategy

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Lead Architect

## Context

The Phase 1 mission is "prove homeowners trust Rocco," not "build Loop." But the seams for Loop must exist so it can plug in later without re-plumbing the user experience or violating any invariant.

## Decision

**Lock the invariants, stub the infrastructure, validate with users.** Loop, the event pipeline, the partner system, and the recommendation engine are fully designed on paper and stubbed in code: events emit to a no-op sink behind the consent gate, the schema is defined, interfaces are exposed — but no live intelligence layer is built. The detail goes into the AI architecture (Rocco); the Loop documents stay at clean-seam depth.

## Alternatives Considered

- **Build Loop now.**
- **Ignore Loop entirely** and add it later from scratch.

## Why Rejected

- Building now is overbuild against the mission and risks premature, wrong abstractions.
- Ignoring entirely guarantees an expensive re-plumb and likely invariant violations when Loop is bolted on later.

## Consequences

- Every meaningful interaction emits an event that passes the consent gate and is dropped to a no-op sink in Phase 1.
- The event schema and boundaries are real even though the consumer is not.
- The default answer to Loop-flavored scope creep is "not yet — stub the seam."

## Future Impact

Phase 2+ activates Loop against pre-existing seams. This is the operational expression of "design everything Loop-ready; do not build Loop."
