# ADR-003 — Anonymous Session Identity

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Lead Architect + Privacy

## Context

Consent revocation, walled-off aggregation, and conversation continuity all require *some* notion of identity. But user accounts add friction, collect PII, and create liability — and they contradict the Phase 1 privacy posture and the no-account-creation rule.

## Decision

Phase 1 uses an **anonymous session ID** (cookie/localStorage, with expiration). No accounts, no email/password, no profile, no login. The session exists only to support: conversation continuity, consent management, an anonymous event architecture, future Loop compatibility, privacy compliance, and optional in-session memory. No PII is required or requested to use the product.

## Alternatives Considered

- **(a) Fully ephemeral / no identity.** No ID at all.
- **(b) Full user accounts.** Email/password, profiles.

## Why Rejected

- (a) Cannot honor consent revocation or continuity, and produces weak Loop signal.
- (b) Adds friction + PII + liability, contradicts the no-account-creation posture, and is premature value-wise.

## Consequences

- The session ID is the (anonymized) join key for events and the anchor for consent state.
- Chat content tied to a session is still personal data, so GDPR/CCPA obligations apply.
- In-session memory is session-scoped only; no server-side per-user profile exists in Phase 1.

## Future Impact

User accounts remain possible later, gated on genuine homeowner value (not growth vanity). The session model must forward-migrate cleanly to accounts without breaking the event or consent architecture.
