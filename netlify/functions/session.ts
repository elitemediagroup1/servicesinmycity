import type { Handler } from '@netlify/functions';
import crypto from 'node:crypto';

// Anonymous session identity (ADR-002, 15_API_SPECIFICATION).
// Issues/validates an opaque, signed session token. No PII, no accounts.
// Phase 1: minimal HMAC-signed id. Cookie is HttpOnly, Secure, SameSite=Lax.
const TTL_DAYS = 14;

function sign(value: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export const handler: Handler = async () => {
  const secret = process.env.SESSION_SECRET || 'dev-insecure-secret';
  const id = 'anon_' + crypto.randomUUID();
  const sig = sign(id, secret);
  const token = id + '.' + sig;
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + TTL_DAYS * 864e5).toISOString();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `sic_sid=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${TTL_DAYS * 86400}`,
    },
    body: JSON.stringify({ ok: true, data: { sessionId: id, createdAt, expiresAt } }),
  };
};
