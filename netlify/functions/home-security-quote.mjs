import { deliver, makeRequest, quoteStore, validateQuote } from '../lib/security-quotes.mjs';

const source = 'servicesinmycity.com';
const json = (data, status) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export default async function quote(req, context) {
  const wantsJson = req.headers.get('accept')?.includes('application/json');
  function error(message, status) {
    return wantsJson ? json({ error: message }, status) : new Response(message + ' Use your browser’s Back button to return to the form.', {
      status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  if (req.method === 'HEAD') {
    // Report only the deployed connection status. No lead data or CRM request is involved.
    try {
      const status = await quoteStore().get('integration/connection', { type: 'json' });
      return new Response(null, { status: 200, headers: {
        'Cache-Control': 'no-store', 'X-Quote-Delivery': status?.status || 'unchecked'
      } });
    } catch {
      return new Response(null, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
  }
  if (req.method !== 'POST') return error('Use the home security quote page to make a request.', 405);
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return error('Please submit your request on this site.', 403);
  if (!req.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return error('Use the home security quote form.', 415);
  if (Number(req.headers.get('content-length')) > 8192) return error('Your submission is too long.', 413);
  const body = await req.text();
  if (Buffer.byteLength(body) > 8192) return error('Your submission is too long.', 413);
  const form = new URLSearchParams(body);
  if (form.get('Website')) return error('Please check the form and try again.', 422);
  let lead;
  try { lead = validateQuote(form); } catch (e) { return error(e.message, 422); }
  // Production credentials are restricted to the production Functions context.
  if (!process.env.SECURE24_API_KEY) return error('Quote requests are temporarily unavailable. Please try again later.', 503);
  try {
    const store = quoteStore();
    const request = makeRequest(lead, source);
    if (!await store.getMetadata('receipts/' + request.key)) {
      await store.setJSON('pending/' + request.key, request.data, { onlyIfNew: true });
      // A saved request is recoverable even if CRM authentication or the network fails.
      const attempt = deliver(store, request.key).catch(() => console.error('Quote delivery needs review', request.data.reference));
      if (context.waitUntil) context.waitUntil(attempt);
      else await attempt;
    }
  } catch {
    return error('We couldn’t save your request. Please try again.', 503);
  }
  return wantsJson ? json({ received: true }, 202) : new Response(null, {
    status: 303, headers: { Location: '/home-security-quote/thanks/', 'Cache-Control': 'no-store' } });
}

export const config = { rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 8 } };
