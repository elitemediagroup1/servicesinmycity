# ADR-001 — Homeowner First

**Status:** Accepted · Permanent invariant
**Date:** Phase 1 founding
**Owner:** Lead Architect

## Context

Home services runs on information asymmetry and low trust. Incumbents (lead-gen marketplaces, review aggregators, contractor directories) largely monetize the homeowner's confusion by selling the homeowner's intent to contractors as a lead. That structurally aligns them with the contractor, not the homeowner.

## Decision

Rocco and the entire ServicesInMyCity product serve the **homeowner (the user)**. Contractors are **customers**. When the homeowner's interest and a partner's interest conflict, the homeowner wins — visibly — in code, copy, and UX.

## Alternatives Considered

- **Neutral marketplace.** Position as an unbiased middle party.
- **Contractor-aligned lead-gen.** Monetize homeowner intent like incumbents.

## Why Rejected

- Neutrality is a fiction that, in practice, defaults to whoever pays. It cannot anchor a trust brand.
- Lead-gen is the precise distrust dynamic we exist to displace; adopting it forfeits the only durable moat (earned trust at the top of the funnel).

## Consequences

- "Who pays" and "what gets recommended" must live in separate, auditable code paths forever (see ADR-007).
- No pay-to-rank, ever.
- Phase 1 success is measured as **earned trust**, not revenue.
- Copy and UX must never adopt incumbent dark patterns (aggressive lead capture, gated phone numbers, manufactured urgency).

## Future Impact

This invariant constrains the partner architecture, the recommendation engine, all monetization, and every future EMG guide (Carl, Lucy, Coach, Chef, Advisor). Every guide serves its user, never the paying customer.
