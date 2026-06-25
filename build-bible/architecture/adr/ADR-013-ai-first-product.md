# ADR-013 — AI-First Product

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Lead Architect + Product

## Context

The company succeeds or fails based on whether homeowners trust Rocco. The conversation is not a feature bolted onto a directory — it is the product. We must order our engineering priorities accordingly.

## Decision

ServicesInMyCity is an **AI-first product**. The Rocco conversation is the primary surface and the primary value; everything else (service pages, local discovery, navigation) exists to feed or support it. Engineering, design, and content priority go to the AI experience first. This is why the Build Bible defines the AI architecture (13) before component implementation (08) — the AI experience is more foundational than the UI chrome around it.

## Alternatives Considered

- **Content-first / directory-first** with chat as a secondary helper.
- **Equal-weight** treatment of pages, discovery, and chat.

## Why Rejected

- Content-first reproduces the incumbent model (a directory with a bolted-on bot) and buries the one thing that earns trust.
- Equal-weight dilutes focus and risks shipping mediocre everything instead of an excellent core.

## Consequences

- 13_AI_ARCHITECTURE is the definitive Rocco engineering specification and is prioritized accordingly.
- Quality bars (safety, hallucination prevention, confidence calibration, recovery behavior) are first-class engineering concerns, not polish.
- Static content and discovery are deliberately restrained to keep focus on the conversation.

## Future Impact

Every future EMG product is also guide-first (Carl, Lucy, Coach, Chef, Advisor). The AI experience is the through-line of the ecosystem, and the AI architecture pattern is reused across products.
