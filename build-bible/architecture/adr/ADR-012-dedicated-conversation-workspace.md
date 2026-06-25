# ADR-012 — Dedicated Conversation Workspace

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Product + UX Architect

## Context

The Ask Rocco conversation is the product's core value. Quick questions should be answerable anywhere, but the conversation also has the potential to become a richer workspace (photos, multiple threads, local recommendations, session history, future memory). We must serve both the quick ask and the deep session without overbuilding the MVP.

## Decision

Two complementary surfaces:

1. A **persistent floating Ask Rocco widget** on every page — handles quick questions in context, never more than a tap away.
2. A **dedicated /ask page** — an immersive, full conversational workspace.

Phase 1 ships both, but the /ask workspace is intentionally minimal at launch. Its richer capabilities (photo upload, multiple follow-up conversations, local recommendations inline, session history, future homeowner memory when appropriate) are designed-for but not all built now.

## Alternatives Considered

- **Floating widget only.** Quick questions everywhere, no dedicated surface.
- **Dedicated page only.** A single chat destination, no in-context widget.

## Why Rejected

- Widget-only caps the experience at "quick Q&A" and leaves no home for the richer workspace the long-term vision needs.
- Page-only adds friction for the common quick-question case and breaks the "Rocco is always here" promise.

## Consequences

- Both surfaces share one conversation engine and one Rocco system prompt (13); the widget and /ask are views over the same model, not two implementations.
- /ask is architected with seams for future capabilities (uploads, threads, history) that are stubbed in Phase 1, consistent with Lock-Stub-Validate (ADR-008).
- Session continuity (ADR-003) lets a quick widget question expand into the /ask workspace without losing context.

## Future Impact

/ask becomes the homeowner's full conversational workspace as capabilities mature. Sibling products reuse the widget + workspace pattern for their own guides.
