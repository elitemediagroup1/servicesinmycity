# ADR-005 — Aggregate Intelligence Separation

**Status:** Accepted · Permanent invariant
**Date:** Phase 1 founding
**Owner:** Lead Architect + Privacy

## Context

EMG Loop's value is cross-user learning; its risk is individual privacy. These must be reconciled at the architecture level, not by policy alone.

## Decision

The **aggregate intelligence layer is architecturally walled off** from individual user profiles. Individual data serves the individual in-session. Anonymized, aggregate data improves the platform. **Personal-level data is never sold.** The user-serving path never depends on Loop, and Loop never reaches back into an identifiable individual profile.

## Alternatives Considered

- **Unified data lake** keyed to individuals, with analytics layered on top.

## Why Rejected

- A unified, individual-keyed store collapses the wall, makes "never sell personal data" unenforceable, and turns a single breach into a catastrophic trust failure.

## Consequences

- Two logical data domains with a one-way, anonymizing boundary between them.
- Loop is stubbed in Phase 1 behind that boundary (see ADR-008).
- Events crossing the boundary must be de-identified by construction, not by after-the-fact scrubbing.

## Future Impact

This defines the entire Loop data model and event schema. Every future product feeding Loop inherits the same wall. It is the structural guarantee behind the promise that individual data serves the user while aggregate data improves the platform.
