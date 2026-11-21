import { createHash, randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import coverage from '../../src/data/home-security.json' with { type: 'json' };

const states = new Set(coverage.areas.map(area => area.code));
const limits = { FirstName: 80, LastName: 80, Address: 180, City: 100, State: 2, Zip: 10, Phone: 30, Email: 254 };
export const consentVersion = 'quote-call-v1';
export const storeName = 'home-security-quotes';

export function validateQuote(form) {
  if (form.get('Consent') !== consentVersion) throw new Error('Please confirm that you own this home and would like a specialist to call.');
  const lead = {};
  for (const [name, max] of Object.entries(limits)) {
    const value = form.get(name)?.trim();
    if (!value || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) throw new Error('Please check your contact information and installation address.');
    lead[name] = value;
  }
  if (!states.has(lead.State)) throw new Error('This offer is available only in the states listed on the form and Washington, DC.');
  if (!/^\d{5}(-\d{4})?$/.test(lead.Zip)) throw new Error('Enter a five-digit ZIP code or ZIP+4.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.Email)) throw new Error('Enter a valid email address.');
  if (!/^[\d().+\s-]+$/.test(lead.Phone)) throw new Error('Enter a US phone number with area code.');
  lead.Phone = lead.Phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  if (!/^[2-9]\d{9}$/.test(lead.Phone)) throw new Error('Enter a ten-digit US phone number with area code.');
  return lead;
}

export function quoteStore() {
  return getStore({ name: storeName, consistency: 'strong' });
}

export function makeRequest(lead, source, now = new Date()) {
  const createdAt = now.toISOString();
  // Group identical requests within a UTC day, including native form resubmissions.
  const digest = createHash('sha256').update(JSON.stringify([source, createdAt.slice(0,10), ...Object.values(lead).map(v => v.toLowerCase())])).digest('hex');
  return { key: digest, data: { lead, source, createdAt, consentVersion, reference: randomUUID(), status: 'pending' } };
}

export function connection() {
  const key = process.env.SECURE24_API_KEY;
  const secret = process.env.SECURE24_SHARED_SECRET;
  const endpoint = new URL(process.env.SECURE24_API_URL);
  if (!key || !secret || endpoint.origin !== 'https://crm.thealarmprogram.com' || endpoint.username || endpoint.password) throw new Error('CRM configuration unavailable');
  return { key, secret, endpoint };
}

export async function sendQuote(request, credentials, transport = fetch, date = new Date()) {
  const { key, secret, endpoint } = credentials;
  const body = JSON.stringify({ APIKey: key, Method: 'lead-create', ...request.lead,
    ReferenceNum: request.reference, Notes: 'Home security quote requested on ' + request.source + ' at ' + request.createdAt + '. Homeowner authorized a call (' + request.consentVersion + ').' });
  const minute = date.toISOString().slice(0,16).replace('T',' ');
  const signature = createHash('md5').update(minute).update(body).update(secret).digest('hex');
  const response = await transport(endpoint, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(5000),
    headers: { 'Content-Type': 'application/json', Signature: signature }, body });
  const { ResultCode } = await response.json();
  const code = Number(ResultCode);
  if (response.ok && code === 200) return { status: 'delivered', code };
  // Protocol validation occurs before lead creation, so an authentication rejection is safe to retry.
  if (response.ok && code === 117) return { status: 'pending', code };
  return { status: 'review', code: Number.isInteger(code) ? code : null };
}

export async function deliver(store, key) {
  const path = 'pending/' + key;
  const entry = await store.getWithMetadata(path, { type: 'json' });
  if (!entry) return;
  if (entry.data.status === 'sending') {
    // A stopped invocation may have posted the lead. Reconcile it by reference before another send.
    if (Date.now() - Date.parse(entry.data.sendingAt) > 3600000) {
      if (!await store.getMetadata('receipts/' + key)) {
        await store.setJSON('review/' + key, { ...entry.data, status: 'review' }, { onlyIfNew: true });
        await store.setJSON('receipts/' + key, { reference: entry.data.reference, status: 'review' }, { onlyIfNew: true });
      }
      await store.delete(path);
    }
    return;
  }
  if (entry.data.status !== 'pending') return;
  const data = entry.data;
  if (await store.getMetadata('receipts/' + key)) { await store.delete(path); return; }
  if (data.nextAttempt && Date.parse(data.nextAttempt) > Date.now()) return;
  const credentials = connection();
  const claimed = await store.setJSON(path, { ...data, status: 'sending', sendingAt: new Date().toISOString() }, { onlyIfMatch: entry.etag });
  if (!claimed.modified) return;
  let result;
  try { result = await sendQuote(data, credentials); }
  catch { result = { status: 'review', code: null }; }
  if (result.status === 'delivered') {
    // Keep the receipt without a second copy of the customer's contact information.
    await store.setJSON('receipts/' + key, { reference: data.reference, source: data.source, consentVersion: data.consentVersion,
      requestedAt: data.createdAt, deliveredAt: new Date().toISOString() }, { onlyIfNew: true });
    await store.delete(path);
    return;
  }
  // A timeout can mean the partner received the lead. Keep it for reconciliation by reference.
  const aged = Date.now() - Date.parse(data.createdAt) > 7 * 86400000;
  const status = aged ? 'review' : result.status;
  const updated = { ...data, status, code: result.code, nextAttempt: new Date(Date.now() + 3600000).toISOString() };
  if (status === 'review') {
    await store.setJSON('review/' + key, updated, { onlyIfNew: true });
    // Retain a small marker for duplicate requests.
    await store.setJSON('receipts/' + key, { reference: data.reference, status: 'review' }, { onlyIfNew: true });
    await store.delete(path);
  } else {
    await store.setJSON(path, updated, { onlyIfMatch: claimed.etag });
  }
  console.warn('Home security CRM response', { reference: data.reference, status, code: result.code });
}
