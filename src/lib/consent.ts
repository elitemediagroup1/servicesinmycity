// Consent is a gate, not a field (core invariant).
// Withholding consent must NEVER degrade core Rocco help. Consent only gates
// enhancements: session memory and anonymized aggregate (Loop) signals.

export type ConsentScope = 'session_memory' | 'aggregate_insights';

const KEY = 'sic_consent';

type ConsentState = Record<ConsentScope, boolean>;

const DEFAULT: ConsentState = {
  session_memory: false,
  aggregate_insights: false,
};

export function getConsent(): ConsentState {
  if (typeof localStorage === 'undefined') return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

export function hasConsent(scope: ConsentScope): boolean {
  return getConsent()[scope] === true;
}

// Records consent client-side and mirrors it to the server gate (/api/consent).
export async function setConsent(scope: ConsentScope, granted: boolean): Promise<void> {
  const next = { ...getConsent(), [scope]: granted };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  try {
    await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope, granted }),
    });
  } catch {
    // Non-fatal: the gate fails closed. Core help is unaffected.
  }
}
