// EMG Loop event seam (ADR-005). The seam is REAL. The Loop is NOT built.
// Phase 1: events are emitted to /api/loop-event, which validates aggregate
// consent and then drops them. Events are anonymized and never joined to identity.
//
// 'Every conversation Rocco has is a signal. Every signal feeds the Loop.'
// In Phase 1 the signal goes nowhere meaningful by design.

import { hasConsent } from './consent';

export type LoopEventType =
  | 'chat_started'
  | 'rocco_response_generated'
  | 'service_selected'
  | 'consent_shown'
  | 'consent_accepted'
  | 'hvac_intent_detected'
  | 'ars_handoff_requested';

export interface LoopEvent {
  type: LoopEventType;
  anonymizedPayload?: Record<string, unknown>;
}

// No-op by contract: fire-and-forget, never blocks UX, never throws to caller.
export function emitLoopEvent(type: LoopEventType, anonymizedPayload: Record<string, unknown> = {}): void {
  // Aggregate consent gates whether the signal is even sent.
  if (!hasConsent('aggregate_insights')) return;
  try {
    const body = JSON.stringify({ type, anonymizedPayload, consentScope: 'aggregate_insights' });
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      navigator.sendBeacon('/api/loop-event', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/loop-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Swallow: the Loop seam must never affect the homeowner experience.
  }
}
