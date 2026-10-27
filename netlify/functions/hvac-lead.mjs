import approvedZips from '../../public/assets/ars-hvac-zips.json' with { type: 'json' };

const endpoint = 'https://script.google.com/macros/s/AKfycbyN5SgqHuF9_65yPzSaggW5IU8cZlcZLxLyHaH_KNUCStbfYgupG5130N1uu-ohILI/exec';
const coverage = new Set(approvedZips);
const services = new Set(['Maintenance / Tune-Up', 'Air Conditioning Repair', 'Heating Repair', 'Heat Pump Repair', 'Air Conditioning Replacement', 'Heating Replacement', 'New HVAC System Installation', 'Heat Pump Installation / Replacement']);
const respond = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export default async function handler(req) {
  if (req.method !== 'POST') return respond(405, { ok: false });
  if (req.headers.get('origin') && req.headers.get('origin') !== 'https://servicesinmycity.com') return respond(403, { ok: false });
  let p;
  try {
    const body = await req.text();
    if (body.length > 12000) return respond(413, { ok: false });
    p = JSON.parse(body);
    if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error();
  } catch { return respond(400, { ok: false, error: 'Invalid request.' }); }
  if (p.website) return respond(400, { ok: false });
  const value = key => String(p[key] || '').trim().slice(0, 2000);
  const rawPhone = value('phone').replace(/\D/g, '');
  const phone = rawPhone.length === 11 && rawPhone.startsWith('1') ? rawPhone.slice(1) : rawPhone;
  if (!value('first') || !value('last') || !/^\d{10}$/.test(phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email')) || !coverage.has(value('zip')) || !services.has(value('service')) || p.consent !== true) {
    return respond(400, { ok: false, error: 'Please check your contact details, service and ZIP code.' });
  }
  const fields = ['first', 'last', 'email', 'service', 'zip', 'gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const payload = new URLSearchParams({ formType: 'hvac', phone, consent: 'true', page_url: 'https://servicesinmycity.com/ars-hvac' });
  for (const key of fields) payload.set(key, value(key));
  try {
    const result = await fetch(endpoint, { method: 'POST', body: payload, signal: AbortSignal.timeout(20000) });
    if (!result.ok || (await result.json()).ok !== true) throw new Error();
    return respond(200, { ok: true });
  } catch {
    return respond(502, { ok: false, error: 'We could not confirm your request. Please call 1-855-448-4993.' });
  }
}

export const config = { rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 5 } };
