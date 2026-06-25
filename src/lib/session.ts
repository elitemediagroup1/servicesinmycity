// Anonymous session identity (ADR-002). No accounts, no PII, no login.
// Phase 1: a client-readable opaque id stored in localStorage with an expiry.
// The server issues/validates a signed cookie via /api/session; this helper
// is the client-side convenience layer for continuity within a session.

const SESSION_KEY = 'sic_session_id';
const SESSION_TS_KEY = 'sic_session_ts';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function makeId(): string {
  // Opaque, non-identifying random id. Not joinable to any person.
  const rnd = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return 'anon_' + rnd;
}

export function getSessionId(): string {
  if (typeof localStorage === 'undefined') return makeId();
  const ts = Number(localStorage.getItem(SESSION_TS_KEY) || '0');
  const existing = localStorage.getItem(SESSION_KEY);
  const fresh = existing && Date.now() - ts < SESSION_TTL_MS;
  if (fresh && existing) return existing;
  const id = makeId();
  localStorage.setItem(SESSION_KEY, id);
  localStorage.setItem(SESSION_TS_KEY, String(Date.now()));
  return id;
}

export function clearSession(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_TS_KEY);
}
