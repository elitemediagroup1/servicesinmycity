import type { Handler } from '@netlify/functions';

// Consent gate (core invariant: consent is a gate, not a field).
// Records consent state per scope. Withholding consent never degrades core help.
// Phase 1: echoes/acknowledges. A durable store can be wired later without API change.
type ConsentScope = 'session_memory' | 'aggregate_insights';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, message: 'Method not allowed' }) };
  }
  let scope: ConsentScope = 'session_memory';
  let granted = false;
  try {
    const body = JSON.parse(event.body || '{}');
    scope = body.scope;
    granted = body.granted === true;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, message: 'Invalid request' }) };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, data: { scope, granted, recordedAt: new Date().toISOString() } }),
  };
};
