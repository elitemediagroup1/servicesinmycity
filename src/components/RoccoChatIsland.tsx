import { useState, useRef, useEffect } from 'react';
import { getSessionId } from '../lib/session';
import { emitLoopEvent } from '../lib/loop';
import ArsHandoffModal from './ArsHandoffModal';

type Role = 'user' | 'assistant';
interface Msg { role: Role; content: string; }

interface Props {
  service?: string;     // e.g. 'hvac' - enables ARS handoff offer on HVAC pages
  city?: string;        // e.g. 'Manahawkin'
  seedPrompt?: string;  // optional structured prompt to seed the conversation
}

const DEGRADE_MSG =
  "Rocco's taking a breather right now so we can keep the service reliable. Try again a little later.";

function track(name: string, params?: Record<string, unknown>) {
  // GA4 (ServicesInMyCity only). Safe no-op if gtag is absent.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.__sicTrack === 'function') w.__sicTrack(name, params);
}

export default function RoccoChatIsland({ service, city, seedPrompt }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState(seedPrompt || '');
  const [loading, setLoading] = useState(false);
  const [softLimited, setSoftLimited] = useState(false);
  const [showArs, setShowArs] = useState(false);
  const startedRef = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);

  const isHvac = service === 'hvac';

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, loading]);

  function detectHvacIntent(text: string) {
    if (!isHvac) return;
    if (/(ac|a\/c|air condition|furnace|heat|hvac|thermostat|no cool|no heat)/i.test(text)) {
      emitLoopEvent('hvac_intent_detected', { service, city });
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    if (!startedRef.current) {
      startedRef.current = true;
      emitLoopEvent('chat_started', { service, city });
      track('chat_started', { service, city });
    }
    detectHvacIntent(text);

    const next = [...messages, { role: 'user' as Role, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    setSoftLimited(false);

    try {
      const res = await fetch('/api/rocco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          city: city || null,
          service: service || null,
          sessionId: getSessionId(),
        }),
      });
      const data = await res.json();

      if (data && data.soft_limit) {
        setSoftLimited(true);
        setMessages([...next, { role: 'assistant', content: data.message || DEGRADE_MSG }]);
        return;
      }
      const reply = (data && data.data && data.data.reply && data.data.reply.content)
        ? data.data.reply.content
        : DEGRADE_MSG;
      setMessages([...next, { role: 'assistant', content: reply }]);
      emitLoopEvent('rocco_response_generated', { service, city });
      track('rocco_response_generated', { service, city });
    } catch {
      // Graceful degradation: never a blank failure.
      setSoftLimited(true);
      setMessages([...next, { role: 'assistant', content: DEGRADE_MSG }]);
    } finally {
      setLoading(false);
    }
  }

  function onArsRequest() {
    emitLoopEvent('ars_handoff_requested', { service: 'hvac', city });
    track('ars_handoff_requested', { service: 'hvac', city });
    setShowArs(true);
  }

  return (
    <div className="rocco-chat">
      <div className="rocco-chat__log" ref={logRef} aria-live="polite">
        {messages.length === 0 && (
          <p className="soft-note">
            No problem. Let's start with your city and what needs fixing.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble bubble--${m.role}`}>
            <strong>{m.role === 'user' ? 'You' : 'Rocco'}</strong>
            <p>{m.content}</p>
          </div>
        ))}
        {loading && <p className="soft-note">Rocco is thinking&hellip;</p>}
      </div>

      {isHvac && (
        <div className="ars-offer disclaimer">
          For HVAC in the Jersey Shore launch area, Rocco may connect you with a managed trusted partner.
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-secondary" onClick={onArsRequest}>
              Connect me with a trusted HVAC partner
            </button>
          </div>
        </div>
      )}

      <form
        className="rocco-chat__form"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <label className="sr-only" htmlFor="rocco-input">Ask Rocco</label>
        <input
          id="rocco-input"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          Send
        </button>
      </form>

      {softLimited && (
        <p className="soft-note" role="status">{DEGRADE_MSG}</p>
      )}

      {showArs && (
        <ArsHandoffModal
          city={city}
          onClose={() => setShowArs(false)}
        />
      )}
    </div>
  );
}
