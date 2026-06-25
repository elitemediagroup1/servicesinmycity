import type { Handler } from '@netlify/functions';

// EMG Loop event seam (ADR-005). NO-OP by design. Loop is NOT built.
// Validates aggregate consent; if granted, accepts and DISCARDS the event.
// Never joins to session identity. The contract is real so the seam exists.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false }) };
  }
  let consentScope = '';
  try {
    const body = JSON.parse(event.body || '{}');
    consentScope = body.consentScope;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  }
  // Gate: only aggregate-consented events are accepted. Then discarded in Phase 1.
  const accepted = consentScope === 'aggregate_insights';
  // Intentionally no persistence. (Future: write to anonymized, walled-off sink.)
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, data: { accepted } }),
  };
};
