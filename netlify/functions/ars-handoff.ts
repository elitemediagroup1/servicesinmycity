import type { Handler } from '@netlify/functions';

// ARS / A.J. Perri HVAC pilot handoff (STUB). Consent-first.
// Does NOT send real lead data anywhere unless ARS_HANDOFF_ENDPOINT is configured.
// Phase 1: validates consent + payload, then no-ops. Clearly stubbed.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false }) };
  }
  let payload: any = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, message: 'Invalid request' }) };
  }

  // Consent gate: never forward without explicit consent.
  if (payload.consent !== true) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, data: { forwarded: false, reason: 'no_consent' } }) };
  }

  const endpoint = process.env.ARS_HANDOFF_ENDPOINT;
  if (!endpoint) {
    // STUB: no endpoint configured. Accept but DO NOT send lead data anywhere.
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, data: { forwarded: false, stub: true } }),
    };
  }

  // When an endpoint is explicitly provided, forward the consented lead.
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        zip: payload.zip,
        issue: payload.issue,
        contactMethod: payload.contactMethod,
        city: payload.city,
        service: 'hvac',
        partner: 'ars-ajperri',
      }),
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true, data: { forwarded: true } }) };
  } catch {
    return { statusCode: 200, body: JSON.stringify({ ok: true, data: { forwarded: false, reason: 'partner_unreachable' } }) };
  }
};
