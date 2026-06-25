# ADR-006 — Google Discovery vs Recommendation

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Lead Architect + Legal

## Context

Google Places is our only local-data source in Phase 1. Its Terms of Service restrict caching, storing, and displaying its data and prohibit building a competing directory. Its ratings are also Google's algorithmic output, not our earned judgment.

## Decision

Google Places is a **discovery source only** — it answers "what exists nearby?" It is **not** our recommendation engine. Businesses surfaced from Google are presented **honestly as nearby businesses returned from Google**, never as "Rocco's Top Picks." Rocco answers "what should the homeowner know?"; Google answers "what exists nearby?" Those are different responsibilities.

## Alternatives Considered

- **Use Google ratings as de-facto recommendations.**
- **Build our own directory immediately.**

## Why Rejected

- Using Google ratings as recommendations would violate Google's ToS and ADR-007 (it launders Google's ranking as ours).
- Building our own directory now is premature overbuild against the Phase 1 mission.

## Consequences

- The recommendation engine is stubbed in Phase 1.
- UI must clearly attribute Google-sourced results and respect Google's display/caching rules.
- We never imply we have vetted businesses we have not vetted.

## Future Impact

Long term, the EMG Partner Network becomes our trusted recommendation source; Google remains a discovery layer. Rocco eventually recommends from the trusted network — and those recommendations remain independent of payment (ADR-007).
