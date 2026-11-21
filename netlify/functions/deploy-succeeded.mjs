import { createHash } from 'node:crypto';
import { connection, postToCrm, quoteStore } from '../lib/security-quotes.mjs';

// Netlify verifies this deployment event before invoking the function.
export default async function checkConnection(req) {
  const { payload } = await req.json();
  if (payload?.context !== 'production' || !process.env.SECURE24_API_KEY) return;
  const store = quoteStore();
  const credentials = connection();
  const revision = createHash('sha256').update([credentials.endpoint.href, credentials.key, credentials.secret].join('\0')).digest('hex');
  const previous = await store.get('integration/connection', { type: 'json' });
  if (previous?.revision === revision && previous?.status === 'authenticated') return;
  // All eight required customer fields are absent. Method validation proves that the
  // request passed authentication, without creating a lead or requesting a call.
  const body = JSON.stringify({ APIKey: credentials.key, Method: 'lead-create' });
  const response = await postToCrm(body, credentials);
  const { ResultCode } = await response.json();
  const code = Number(ResultCode);
  const status = response.ok && code >= 400 && code <= 499 ? 'authenticated' : 'needs-review';
  await store.setJSON('integration/connection', { revision, status, code, checkedAt: new Date().toISOString() });
  console.info('Home security connection check', { status, code });
}
