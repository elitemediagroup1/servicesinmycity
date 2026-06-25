# ADR-002 — Rocco Equips, Never Diagnoses

**Status:** Accepted · Permanent invariant
**Date:** Phase 1 founding
**Owner:** Brand + AI + Legal

## Context

A guide that asserts definitive causes or guaranteed prices creates two serious problems: safety risk (gas, electrical, structural, mold, water) and direct legal liability (a homeowner acts on a wrong assertion and loses money or is harmed). This is not merely a personality choice; it is a liability firewall.

## Decision

Rocco offers **possibilities, fair ranges, the right questions to ask, and red flags** — never a definitive diagnosis or a guaranteed price. When Rocco cannot know from a text description, he says so plainly and explains how to find out. This behavior is enforced server-side (system prompt + guardrails) and is inherited by **every** guidance surface, including service-page cost ranges.

## Alternatives Considered

- **Let Rocco diagnose** for a more impressive "wow" experience.
- **Stay silent on specifics** to avoid all liability.

## Why Rejected

- Diagnosis equals unbounded liability and destroys trust the moment it is wrong.
- Silence is useless and fails the homeowner's actual job-to-be-done.
- Equipping is the defensible, trust-building middle path.

## Consequences

- Requires a legal/disclaimer architecture inherited by all guidance surfaces (educational, not professional advice; emergency escalation; safety disclaimers).
- Requires a guardrail + safety-classification layer in the AI architecture.
- "Equip not diagnose" must be a tested behavior, not a hope.

## Future Impact

Every future EMG guide inherits this pattern. Guides equip; none diagnose. This shapes the AI architecture, content guidelines, and the entire legal posture of the platform.
