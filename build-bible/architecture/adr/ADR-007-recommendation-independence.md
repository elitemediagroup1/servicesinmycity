# ADR-007 — Recommendation Independence

**Status:** Accepted · Permanent invariant
**Date:** Phase 1 founding
**Owner:** Lead Architect + Product

## Context

The core trust promise is "recommendations are earned, never purchased." If money can ever influence what Rocco recommends, the entire moat collapses and the product becomes another lead-gen site.

## Decision

Any recommendation Rocco ever makes is **independent of payment**. Money may buy legitimate visibility, tools, or clearly-labeled advertising — never placement in Rocco's guidance. Advertising is visually and semantically separated from recommendation and never uses Rocco's voice.

## Alternatives Considered

- **Pay-to-rank.** Contractors pay for higher placement.
- **"Sponsored equals recommended."** Blend paid placement into guidance.

## Why Rejected

- Both destroy the only durable moat we have (earned trust) and violate ADR-001 (homeowner first).

## Consequences

- The recommendation path and the billing path are physically separate, auditable code.
- Ads are labeled as advertising and kept out of Rocco's mouth.
- If we cannot justify a placement to a skeptical homeowner's face, we do not ship it.

## Future Impact

This is a hard constraint on every monetization decision, forever, across every EMG product. It governs the partner architecture and the recommendation engine.
