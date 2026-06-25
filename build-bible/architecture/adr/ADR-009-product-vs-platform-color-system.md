# ADR-009 — Product vs Platform Color System

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Brand + Design + Lead Architect

## Context

Two color stories existed in the brand assets: a warm, rugged product sheet for Rocco (navy + orange) and a cooler, techier deck for EMG Loop (navy + teal/green). They would collide in the design system unless reconciled deliberately.

## Decision

- **Shared EMG foundation:** Navy (#1E3A5F), White, Warm Light Gray, Neutral Stone. These belong to every EMG product.
- **ServicesInMyCity / Rocco product layer:** Orange (#F07A2B) — represents Rocco, guidance, human interaction, the homeowner, warmth, and trust.
- **EMG Loop platform layer:** Teal and Green — represents intelligence, the platform, data, shared infrastructure, and future products.

Users experience orange. Developers recognize teal. The distinction is intentional.

## Alternatives Considered

- **One unified accent** across product and platform.

## Why Rejected

- A single accent conflates the user layer and the platform layer that the entire architecture works to keep separate. The color split actually reinforces the wall between user-serving and Loop.

## Consequences

- The design system encodes two accent families with strict usage rules.
- Homeowner-facing UI reads orange; internal/Loop/dev surfaces read teal/green.
- The SVC heart logo (teal) and the Rocco brand sheet (orange) are reconciled under this rule: orange is the product accent, teal is the platform accent.

## Future Impact

Each future product receives its own warm product accent; teal/green remains Loop's signature across the ecosystem.
