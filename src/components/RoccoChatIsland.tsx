import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { emitLoopEvent } from '../lib/loop';

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant';
interface Message {
  id: string;
  role: Role;
  content: string;
  showFeedback?: boolean;
}

type FeedbackState = 'none' | 'helpful' | 'not_helpful';

// ─── Markdown Renderer ────────────────────────────────────────────────────────
// Lightweight, XSS-safe: builds DOM nodes — never sets innerHTML
function renderMarkdown(text: string): HTMLElement {
  const container = document.createElement('span');

  // Split into blocks (paragraphs / lists)
  const blocks = text.split(/\n{2,}/);

  blocks.forEach((block, bi) => {
    if (bi > 0) {
      container.appendChild(document.createElement('br'));
      container.appendChild(document.createElement('br'));
    }

    // Detect list block (lines starting with - or * or number.)
    const listLines = block.split('\n').filter(l => l.trim());
    const isUnorderedList = listLines.every(l => /^[-*]\s/.test(l.trim()));
    const isOrderedList = listLines.every(l => /^\d+\.\s/.test(l.trim()));

    if ((isUnorderedList || isOrderedList) && listLines.length > 1) {
      const listEl = document.createElement(isOrderedList ? 'ol' : 'ul');
      listEl.className = 'rocco-chat__list';
      listLines.forEach(line => {
        const li = document.createElement('li');
        const rawText = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
        appendInlineFormatted(li, rawText);
        listEl.appendChild(li);
      });
      container.appendChild(listEl);
    } else {
      // Inline content with single newlines converted to <br>
      const lineSpan = document.createElement('span');
      const singleLines = block.split('\n');
      singleLines.forEach((line, li) => {
        if (li > 0) lineSpan.appendChild(document.createElement('br'));
        appendInlineFormatted(lineSpan, line);
      });
      container.appendChild(lineSpan);
    }
  });

  return container;
}

// Append inline formatted text (bold + links) to a parent element
function appendInlineFormatted(parent: HTMLElement, text: string): void {
  // Tokenize: **bold**, [link](url)
  const tokens = tokenizeInline(text);
  for (const tok of tokens) {
    if (tok.type === 'text') {
      parent.appendChild(document.createTextNode(tok.value));
    } else if (tok.type === 'bold') {
      const strong = document.createElement('strong');
      strong.appendChild(document.createTextNode(tok.value));
      parent.appendChild(strong);
    } else if (tok.type === 'link') {
      const a = document.createElement('a');
      // Only allow http/https URLs
      const href = tok.href ?? '';
      if (/^https?:\/\//i.test(href)) {
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'rocco-chat__link';
      }
      a.appendChild(document.createTextNode(tok.value));
      parent.appendChild(a);
    }
  }
}

interface Token {
  type: 'text' | 'bold' | 'link';
  value: string;
  href?: string;
}

function tokenizeInline(text: string): Token[] {
  const tokens: Token[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Try bold: **...**
    const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*(.*)/s);
    // Try link: [text](url)
    const linkMatch = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)/s);

    if (boldMatch && (!linkMatch || boldMatch[1].length <= (linkMatch[1]?.length ?? Infinity))) {
      if (boldMatch[1]) tokens.push({ type: 'text', value: boldMatch[1] });
      tokens.push({ type: 'bold', value: boldMatch[2] });
      remaining = boldMatch[3];
    } else if (linkMatch) {
      if (linkMatch[1]) tokens.push({ type: 'text', value: linkMatch[1] });
      tokens.push({ type: 'link', value: linkMatch[2], href: linkMatch[3] });
      remaining = linkMatch[4];
    } else {
      tokens.push({ type: 'text', value: remaining });
      remaining = '';
    }
  }

  return tokens;
}

// React component wrapper for markdown
function MarkdownMessage({ content }: { content: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    ref.current.appendChild(renderMarkdown(content));
  }, [content]);

  return <span ref={ref} className="rocco-chat__markdown" />;
}

// ─── HVAC Intent Detection ────────────────────────────────────────────────────
const HVAC_PATTERNS = [
  /\bhvac\b/i,
  /\bheat(ing)?\b/i,
  /\bcooling\b/i,
  /\bair\s*condition/i,
  /\b(ac|a\/c)\b/i,
  /\bfurnace\b/i,
  /\bthermostat\b/i,
  /\bduct(work)?\b/i,
  /\bvent(ilation)?\b/i,
  /\bblower\b/i,
  /\brefrigerant\b/i,
  /\bheat\s*pump\b/i,
  /\bunit\s*(stopped|won'?t|not|is)\b/i,
  /\b(home|house)\s+(too\s+)?(hot|cold|warm)\b/i,
  /\b(no|not|isn'?t|won'?t).{0,20}(heat|cool|blow|run)/i,
];

function detectHVAC(text: string): boolean {
  return HVAC_PATTERNS.some((p) => p.test(text));
}

// ─── Emergency Detection ──────────────────────────────────────────────────────
const EMERGENCY_PATTERNS = [
  /\bgas\s*(leak|smell|odor)/i,
  /\bsmell(ing)?\s*gas/i,
  /\bcarbon\s*monoxide\b/i,
  /\b\bco\s*(alarm|detector|leak)/i,
  /\belectrical\s*(fire|spark|smoke)/i,
  /\bwires?\s*(sparking|on fire|smoking)/i,
  /\bflooding\b.*\brapid/i,
  /\bfire\b.*\bspread/i,
];

function detectEmergency(text: string): boolean {
  return EMERGENCY_PATTERNS.some((p) => p.test(text));
}

// ─── Session ID ───────────────────────────────────────────────────────────────
function getSessionId(): string {
  let id = sessionStorage.getItem('rocco_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('rocco_session_id', id);
  }
  return id;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  city?: string;
  service?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RoccoChatIsland({ city = '', service = '' }: Props) {
  const sessionId = useRef(getSessionId()).current;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: city
        ? `Hey there — I'm Rocco. I know the ${city} area well. What's going on at the house?`
        : "Hey there — I'm Rocco. Tell me what's going on and I'll help you figure it out.",
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [hvacDetected, setHvacDetected] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  const [conversationStarted, setConversationStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    // First message event
    if (!conversationStarted) {
      setConversationStarted(true);
      emitLoopEvent('chat_started', { sessionId, city, service });
    }

    // Emergency detection
    if (detectEmergency(text)) {
      setEmergency(true);
      emitLoopEvent('emergency_detected', { sessionId, text: text.substring(0, 100) });
    }

    // HVAC detection
    if (!hvacDetected && detectHVAC(text)) {
      setHvacDetected(true);
      emitLoopEvent('hvac_intent_detected', { sessionId, city, service });
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setFeedback('none');

    // Build history for API
    const history = updatedMessages
      .filter((m) => m.id !== 'welcome' || m.role !== 'assistant')
      .map((m) => ({ role: m.role, content: m.content }));

    // Include welcome message as first assistant message for context
    const apiMessages = [
      ...messages.filter(m => m.id === 'welcome').map(m => ({ role: m.role as Role, content: m.content })),
      ...updatedMessages.filter(m => m.id !== 'welcome').map(m => ({ role: m.role as Role, content: m.content })),
    ];

    try {
      const res = await fetch('/.netlify/functions/rocco-chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId,
          city,
          service,
        }),
      });

      const data = await res.json() as { message: string; meta?: { emergency?: boolean; hvac?: boolean; asked_followup?: boolean; suggested_pro?: boolean; conversation_complete?: boolean; }; error?: string };

      if (!res.ok || data.error) {
        const errMsg: Message = {
          id: Date.now().toString() + '_err',
          role: 'assistant',
          content: data.error ?? "I'm having a little trouble right now. Try again in a moment.",
        };
        setMessages((prev) => [...prev, errMsg]);
        return;
      }

      // Handle meta signals
      if (data.meta?.emergency) setEmergency(true);
      if (data.meta?.hvac && !hvacDetected) setHvacDetected(true);
      if (data.meta?.asked_followup) {
        emitLoopEvent('followup_question_asked', { sessionId });
      }
      if (data.meta?.suggested_pro) {
        emitLoopEvent('pro_referral_suggested', { sessionId });
      }
      if (data.meta?.conversation_complete) {
        emitLoopEvent('conversation_completed', { sessionId });
      }

      const roccoMsg: Message = {
        id: Date.now().toString() + '_r',
        role: 'assistant',
        content: data.message,
        showFeedback: true,
      };

      setMessages((prev) => {
        // Only last Rocco message shows feedback
        const updated = prev.map(m => ({ ...m, showFeedback: false }));
        return [...updated, roccoMsg];
      });

      emitLoopEvent('rocco_response_generated', { sessionId, length: data.message.length });
    } catch {
      const errMsg: Message = {
        id: Date.now().toString() + '_err',
        role: 'assistant',
        content: "I'm having a little trouble right now. Try again in a moment.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      // Re-focus input on mobile after response
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages, conversationStarted, hvacDetected, sessionId, city, service]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFeedback = (helpful: boolean) => {
    if (feedback !== 'none') return;
    const newState: FeedbackState = helpful ? 'helpful' : 'not_helpful';
    setFeedback(newState);
    emitLoopEvent(helpful ? 'helpful_feedback' : 'not_helpful_feedback', { sessionId });
  };

  const handleARSConnect = () => {
    emitLoopEvent('ars_handoff_requested', { sessionId, city, service });
  };

  const handleReferralDeclined = () => {
    emitLoopEvent('referral_declined', { sessionId });
  };

  return (
    <div className="rocco-chat" role="region" aria-label="Chat with Rocco">
      {emergency && (
        <div className="rocco-emergency-banner" role="alert" aria-live="assertive">
          <strong>🚨 Safety emergency detected.</strong> If there is a gas leak, CO alarm, or electrical fire — leave immediately and call <strong>911</strong> or your utility company. Do not use switches.
          <button
            className="rocco-emergency-banner__dismiss"
            onClick={() => setEmergency(false)}
            aria-label="Dismiss emergency warning"
          >
            ✕
          </button>
        </div>
      )}

      <div className="rocco-chat__messages" aria-live="polite" aria-label="Conversation">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rocco-chat__msg rocco-chat__msg--${msg.role}`}
          >
            <div className="rocco-chat__bubble">
              {msg.role === 'assistant'
                ? <MarkdownMessage content={msg.content} />
                : <span>{msg.content}</span>
              }
            </div>
            {msg.role === 'assistant' && msg.showFeedback && (
              <div className="rocco-chat__feedback" aria-label="Was this helpful?">
                <span className="rocco-chat__feedback-label">Helpful?</span>
                <button
                  className={`rocco-chat__feedback-btn ${feedback === 'helpful' ? 'rocco-chat__feedback-btn--active' : ''}`}
                  onClick={() => handleFeedback(true)}
                  aria-label="Mark as helpful"
                  aria-pressed={feedback === 'helpful'}
                  disabled={feedback !== 'none'}
                  title="This was helpful"
                >
                  👍
                </button>
                <button
                  className={`rocco-chat__feedback-btn ${feedback === 'not_helpful' ? 'rocco-chat__feedback-btn--active' : ''}`}
                  onClick={() => handleFeedback(false)}
                  aria-label="Mark as not helpful"
                  aria-pressed={feedback === 'not_helpful'}
                  disabled={feedback !== 'none'}
                  title="This needs improvement"
                >
                  👎
                </button>
                {feedback !== 'none' && (
                  <span className="rocco-chat__feedback-thanks" aria-live="polite">
                    {feedback === 'helpful' ? 'Thanks! Glad I could help.' : 'Thanks for the feedback.'}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="rocco-chat__msg rocco-chat__msg--assistant" aria-label="Rocco is typing">
            <div className="rocco-chat__bubble">
              <span className="rocco-chat__dots" aria-hidden="true">
                <span /><span /><span />
              </span>
              <span className="sr-only">Rocco is typing…</span>
            </div>
          </div>
        )}

        {hvacDetected && !loading && (
          <div className="rocco-chat__hvac-cta" role="complementary" aria-label="HVAC referral offer">
            <p className="rocco-chat__hvac-text">Need a trusted HVAC technician in your area?</p>
            <div className="rocco-chat__hvac-actions">
              <button
                className="rocco-chat__hvac-btn"
                onClick={handleARSConnect}
                aria-label="Connect with a local HVAC technician"
              >
                Connect with a local tech
              </button>
              <button
                className="rocco-chat__hvac-decline"
                onClick={handleReferralDeclined}
                aria-label="No thanks, I'll handle it myself"
              >
                No thanks
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} aria-hidden="true" />
      </div>

      <form
        className="rocco-chat__form"
        onSubmit={(e) => { e.preventDefault(); send(); }}
        aria-label="Send a message to Rocco"
      >
        <textarea
          ref={inputRef}
          className="rocco-chat__input"
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell Rocco what's going on…"
          rows={1}
          maxLength={1000}
          aria-label="Your message"
          autoComplete="off"
          autoCorrect="on"
          autoCapitalize="sentences"
          enterKeyHint="send"
          disabled={loading}
        />
        <button
          type="submit"
          className="rocco-chat__send"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          {loading ? (
            <span className="rocco-chat__send-dots" aria-hidden="true">…</span>
          ) : (
            <span aria-hidden="true">↑</span>
          )}
        </button>
      </form>
    </div>
  );
}
