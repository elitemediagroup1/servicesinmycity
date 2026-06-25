import { useState } from 'react';
import { setConsent } from '../lib/consent';
import { emitLoopEvent } from '../lib/loop';

interface Props {
  city?: string;
  onClose: () => void;
}

// ARS / A.J. Perri HVAC pilot handoff modal (consent-first, STUB).
// Honest language. Collects intent + contact, but does NOT send real lead data
// anywhere unless ARS_HANDOFF_ENDPOINT is configured server-side. Stubbed clearly.
export default function ArsHandoffModal({ city, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', zip: '', issue: '', contactMethod: 'phone',
  });

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consentGiven) return;

    // Consent is a gate, not a field. Record it before any handoff intent.
    await setConsent('aggregate_insights', true);
    emitLoopEvent('consent_accepted', { context: 'ars_handoff' });
    emitLoopEvent('ars_handoff_requested', { service: 'hvac', city });

    try {
      // STUB: server decides whether a real endpoint exists. If not, it no-ops.
      await fetch('/api/ars-handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, city, consent: true }),
      });
    } catch {
      // Non-fatal. The stub never blocks the user.
    }
    setSubmitted(true);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Connect with a trusted HVAC partner">
      <div className="modal">
        <button className="modal__close" onClick={onClose} aria-label="Close">&times;</button>

        {!submitted ? (
          <>
            <h2>Connect with a trusted HVAC partner</h2>
            <p className="disclaimer">
              For HVAC in the Jersey Shore launch area, Rocco may connect you with a managed trusted partner.
              Rocco equips, he never diagnoses. Sharing your details is optional and only used to arrange this connection.
            </p>
            <form onSubmit={submit}>
              <label>Name<input required value={form.name} onChange={(e) => update('name', e.target.value)} /></label>
              <label>Phone<input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label>
              <label>ZIP code<input required value={form.zip} onChange={(e) => update('zip', e.target.value)} /></label>
              <label>What's going on?<textarea value={form.issue} onChange={(e) => update('issue', e.target.value)} /></label>
              <label>Preferred contact method
                <select value={form.contactMethod} onChange={(e) => update('contactMethod', e.target.value)}>
                  <option value="phone">Phone</option>
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                </select>
              </label>
              <label className="consent-row">
                <input type="checkbox" checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)} />
                I agree to have my details shared with a managed trusted HVAC partner so they can contact me.
              </label>
              <button className="btn btn-primary" type="submit" disabled={!consentGiven}>
                Request connection
              </button>
              <p className="soft-note">Stub: no lead data is sent anywhere yet. This is a Phase 1 placeholder.</p>
            </form>
          </>
        ) : (
          <>
            <h2>Thanks &mdash; you're all set (for now)</h2>
            <p className="soft-note">
              This is a Phase 1 stub, so nothing was actually sent. When the trusted-partner
              connection is live, your request would be passed along here. Rocco's still here to help in the meantime.
            </p>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
}
