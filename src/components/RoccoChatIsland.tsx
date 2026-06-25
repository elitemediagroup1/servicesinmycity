import { useState, useRef, useEffect } from 'react';
import { getSessionId } from '../lib/session';
import { emitLoopEvent } from '../lib/loop';
import ArsHandoffModal from './ArsHandoffModal';

type Role = 'user' | 'assistant';
interface Msg { role: Role; content: string; }

interface Props {
  service?: string;    // e.g. 'hvac' - enables ARS handoff offer on HVAC pages
  city?: string;       // e.g. 'Manahawkin'
  seedPrompt?: string; // optional structured prompt to seed the conversation
}

const DEGRADE_MSG =
  "Rocco's taking a breather right now so we can keep the service reliable. Try again a little later.";

// GA4 (ServicesInMyCity only). Safe no-op if gtag is absent.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function track(name: string, params?: Record<string, unknown>) {
  const w = window as any;
  if (typeof w.__sicltrack === 'function') w.__sicltrack(name, params);
}

// ─── HVAC intent detection (Sprint 4) ────────────────────────────────────────
// Semantic rather than pure keyword: detects intent around heating/cooling
// whether or not the homeowner knows the word "HVAC".
function detectHvacIntent(text: string): boolean {
  const hvacPatterns = [
    /\bhvac\b/i,
    /\bheat(ing|er|s)?\b/i,
    /\bfurnace\b/i,
    /\bboiler\b/i,
    /\bair\s*condition/i,
    /\bac\b|\ba\.c\b/i,
    /\bcool(ing|er)?\b/i,
    /\bthermostat\b/i,
    /\bheat\s*pump\b/i,
    /\bduct(work|s)?\b/i,
    /\bvents?\b.*\bair\b/i,
    /\bno\s+(heat|air|cool)/i,
    /\bhome\s+too\s+(hot|cold|warm)/i,
    /\bunit\s+(not|won't|wont|stopped)\s+(work|run|heat|cool)/i,
    /\bfilter\b.*\bair\b/i,
  ];
  return hvacPatterns.some(p => p.test(text));
}

// ─── Emergency detection (Sprint 4) ──────────────────────────────────────────
// Client-side early detection for immediate UX response while server confirms.
function detectEmergency(text: string): boolean {
  const emergencyPatterns = [
    /gas\s*(smell|leak|odor)/i,
    /smell\s*(gas|like\s*gas)/i,
    /sparking/i,
    /burning\s*(smell|odor)/i,
    /smoke.*electr|electr.*smoke/i,
    /carbon\s*monoxide/i,
    /\bco\s*alarm\b/i,
    /flooding.*electr|electr.*flood/i,
  ];
  return emergencyPatterns.some(p => p.test(text));
}

export default function RoccoChatIsland({ service, city, seedPrompt }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [softLimited, setSoftLimited] = useState(false);
  const [isHvac, setIsHvac] = useState(service === 'hvac');
  const [showArs, setShowArs] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const startedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function onArsRequest() {
    emitLoopEvent('ars_handoff_requested', { service: 'hvac', city });
    track('ars_handoff_requested', { service: 'hvac', city });
    setShowArs(true);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    // First message tracking.
    if (!startedRef.current) {
      startedRef.current = true;
      emitLoopEvent('chat_started', { service, city });
      track('chat_started', { service, city });
    }

    // Client-side intent + emergency detection.
    const hvacIntent = detectHvacIntent(text);
    const isEmergencyMsg = detectEmergency(text);

    if (hvacIntent && !isHvac) {
      setIsHvac(true);
      emitLoopEvent('hvac_intent_detected', { service, city });
      track('hvac_intent_detected', { service, city });
    }
    if (isEmergencyMsg) {
      setEmergency(true);
      emitLoopEvent('emergency_detected' as any, { service, city, trigger: text.slice(0, 80) });
      track('emergency_detected', { service, city });
    }

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

      // Server-confirmed emergency signal.
      if (data?.meta?.emergency) {
        setEmergency(true);
      }

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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="rocco-chat">

      {emergency && (
        <div className="rocco-emergency-banner" role="alert">
          <strong>🚨 If this is a gas leak, fire, or carbon monoxide emergency — stop and call 911 or your utility company right now.</strong>
          {' '}Rocco will help you with next steps once you're safe.
        </div>
      )}

      <div className="rocco-chat__messages" aria-live="polite" aria-label="Conversation with Rocco">
        {messages.length === 0 && (
          <p className="soft-note rocco-chat__empty">
            {city
              ? `Hey — I'm Rocco, your local repair guide for ${city}. Tell me what's going on.`
              : "Hey — I'm Rocco, your local repair guide. Tell me what's going on with your home."}
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`rocco-chat__msg rocco-chat__msg--${m.role}`}>
            <span className="rocco-chat__msg-label">
              {m.role === 'user' ? 'You' : 'Rocco'}
            </span>
            <p>{m.content}</p>
          </div>
        ))}
        {loading && (
          <div className="rocco-chat__msg rocco-chat__msg--assistant rocco-chat__typing" aria-label="Rocco is typing">
            <span className="rocco-chat__msg-label">Rocco</span>
            <span className="rocco-chat__dots">
              <span /><span /><span />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {isHvac && (
        <div className="ars-offer disclaimer">
          For HVAC in the Jersey Shore launch area, Rocco can connect you with a trusted local partner.
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
          placeholder={loading ? "Rocco is thinking…" : "Type your message…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="off"
        />
        <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()}>
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
