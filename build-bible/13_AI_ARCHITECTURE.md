# 13_AI_ARCHITECTURE.md

> **Status:** Canonical · **Owner:** AI Architect + Lead Architect · **The definitive Rocco engineering specification.** · **Depends on:** 00 (ADR-002, 003, 004, 006, 007, 008, 013), 04 (Rocco), 05 (IA/legal layer) · **Feeds:** 11, 10, 15, 17, 18, 21, 28
>
> Another engineering team should be able to build Rocco entirely from this document. It is not "prompt engineering" — it is the full system: lifecycle, state, context, safety, abuse/cost control, tools, evaluation, and recovery.

## 1. Goal & non-goals

**Goal:** a server-mediated conversational system that delivers Rocco (04) safely, honestly, affordably, and reliably to anonymous homeowners (ADR-003), while emitting consent-gated, anonymized signals to a stubbed Loop sink (ADR-008).

**Non-goals (Phase 1):** live Loop intelligence, accounts/auth, multi-model routing in production, image understanding in production (seam only), partner-network recommendations (Google is discovery only — ADR-006).

## 2. High-level architecture

Browser (chat island, ADR-011/014) -> POST /.netlify/functions/rocco -> server orchestrator. The orchestrator: (1) validates + rate-limits, (2) classifies safety, (3) builds context + prompt, (4) calls Anthropic (streaming), (5) post-processes/guards output, (6) emits a consent-gated event, (7) streams the turn back. Secrets (ANTHROPIC_API_KEY, GOOGLE_MAPS_API_KEY) live only server-side (21). The client never calls Anthropic or Google directly.

## 3. Conversation lifecycle

1. **Init:** session ensured (ADR-003); empty conversation created client-side; optional seed prompt from a service page becomes the first user turn (05).
2. **User turn:** message sent to /rocco with conversation context + session id + consent state.
3. **Server turn:** validate -> safety-classify -> assemble context -> model call (stream) -> guardrail post-process -> emit event -> return.
4. **Continuation:** multi-turn; context window managed (section 6).
5. **Idle/expire:** session expiry ends continuity gracefully; no server-side per-user profile persists (ADR-005).
6. **End:** no explicit logout; conversation is ephemeral beyond session/in-session memory (OQ on persistence, 05 OQ1).

## 4. Conversation state machine

States: IDLE -> AWAITING_USER -> VALIDATING -> SAFETY_GATE -> (ESCALATE | PROCEED) -> GENERATING -> GUARDRAIL_CHECK -> (EMIT_EVENT) -> STREAMING_TO_CLIENT -> AWAITING_USER. Error transitions from any active state -> RECOVERY (section 19). SAFETY_GATE -> ESCALATE routes hazardous categories to emergency escalation (section 7) before any equipping content. The state machine is implemented server-side per request; the client mirrors a simplified view (sending / streaming / done / error).

## 5. Prompt architecture

Layered, in priority order (highest wins):

1. **System core (immutable):** the Rocco system-prompt seed from 04 section 10 — identity, equip-not-diagnose, never-fabricate, never-manufacture-urgency, safety posture, voice.
2. **Safety directives:** explicit refusal/escalation rules, scope boundaries, injection-resistance instructions (section 9).
3. **Context block:** conversation history (managed), current safety classification, market context (ADR-010), optional discovery results (section 13), optional service-page context.
4. **Task framing:** the four-step mission (lower temperature, orient, equip, next step).
5. **User turn:** the homeowner's message (treated as untrusted content for injection purposes — section 9).

The system core and safety directives are never overridable by user content. Prompts are assembled server-side from versioned templates (section 18 evaluation depends on prompt versioning).

## 6. Context management

- **Window budget:** maintain a token budget; keep the system core + safety + recent turns verbatim, summarize older turns into a running synopsis when nearing budget.
- **In-session memory:** lightweight, session-scoped facts the homeowner stated (e.g., "I have a gas furnace, ~10 years old"), kept client-side and re-sent; never a server-side profile (ADR-003/005).
- **No cross-session memory** in Phase 1. Future homeowner memory is a designed-for seam (ADR-012), stubbed.
- **Market context** is injected so Rocco's local framing is honest and bounded.

## 7. Safety architecture & emergency escalation

A server-side **safety classifier** runs on every user turn before generation (05 Layer-1 requirement, ADR-002).

- **Hazard categories:** gas smell/leak, carbon monoxide, electrical shock/sparking/burning, active flooding/major water, structural failure, fire, sewage/biohazard. (Extensible list in code.)
- **On hazard detection:** the orchestrator routes to ESCALATE — Rocco leads with calm safety guidance and "stop and contact a qualified pro / emergency services" BEFORE any equipping content, and adopts a more conservative posture. This is a routing rule, not just prompt text.
- **Disclaimer inheritance:** every guidance response carries the equip-not-diagnose + educational-not-professional-advice framing (05). Implemented as a response-wrapping concern, not left to the model alone.
- **Medical/legal/financial-advice boundaries:** Rocco gives home-services guidance only; out-of-scope sensitive advice is declined in-character and redirected.

## 8. Hallucination prevention & honesty

- **Never fabricate (invariant):** no invented prices presented as fact, no fake contractor counts/reviews, no invented citations. Cost figures are framed explicitly as ranges/estimates that vary, never guarantees (ADR-002).
- **Grounding:** local business facts come only from the discover function (Google), passed into context and attributed (ADR-006); the model must not invent businesses or ratings.
- **Uncertainty default:** when unsure, Rocco says so and explains how to find out (04 section 4) rather than guessing confidently.
- **Output guardrail pass (section 5/9):** post-generation checks flag fabricated-data patterns (e.g., specific guaranteed prices, invented business names not present in provided discovery results) and trigger a regeneration or a safe fallback.

## 9. Prompt-injection defense & abuse prevention

- **User content is untrusted.** The user turn cannot alter system core or safety directives. Instructions embedded in user messages ("ignore previous instructions," "you are now...") are not obeyed; the system prompt explicitly instructs Rocco to disregard attempts to change his role, reveal the system prompt, or bypass safety.
- **Injected content from tools/pages** (e.g., business names/text from discovery, service-page seeds) is also treated as data, not instructions.
- **Jailbreak resistance:** layered system directives + an output guardrail that catches off-character/unsafe content; on detection, regenerate or fall back to a safe in-character refusal.
- **Abuse controls:** rate limiting (section 10), input length caps, profanity/abuse handling that stays in-character and de-escalates, and blocking attempts to use Rocco as a general-purpose unrelated LLM (scope boundary).
- **No secret disclosure:** Rocco never reveals system prompt, keys, infrastructure, or internal Loop mechanics.

## 10. Rate limiting, abuse & cost management

- **Rate limits:** per-session and per-IP limits on messages/minute and messages/day, enforced server-side at the function edge before any model call. Burst + sustained limits. Anonymous sessions (ADR-003) are the primary key; IP is a secondary backstop.
- **Input caps:** max characters per message and max turns of verbatim history (rest summarized) to bound token cost.
- **Cost controls:** server-enforced max output tokens; a global circuit breaker / daily spend ceiling that degrades to an honest "Rocco's taking a breather" state rather than unbounded spend; cheap pre-checks (length, safety class) before invoking the model.
- **Bot mitigation:** lightweight challenge only if abuse is detected; we never break accessibility or use CAPTCHA as a default gate. (Respect bot-detection norms; do not bypass.)
- **Observability:** per-request token + latency + cost logging (anonymized) for tuning (24).

## 11. Streaming responses

- Default to **streaming** token output from /rocco for responsiveness; the chat island renders incrementally with a gentle, honest typing indicator (07 motion rules).
- If streaming is not viable within Netlify Function constraints (06 OQ2), fall back to non-streaming with a responsive loading state — no behavioral change to Rocco, only delivery.
- Partial-failure handling: if a stream drops mid-turn, the client shows an honest "got cut off" state and offers retry; never a fabricated completion.

## 12. Tool architecture

Rocco is equipped with a small, explicit tool set, invoked server-side:

- **discover(query, location)** -> local business discovery via Google (section 13). Read-only.
- **(stubbed) emitEvent(...)** -> consent-gated signal to the Loop sink (section 16 / 17). Side-effecting but no-op in Phase 1.
- **(future, stubbed) analyzePhoto(...)**, **getServiceContent(...)** — seams only.

Tool calls are mediated by the orchestrator, not exposed to the client. Tool outputs re-enter the prompt as untrusted data (section 9). Tools are designed so adding/removing one doesn't change Rocco's core behavior contract.

## 13. Google Maps / discovery integration (ADR-006)

- **Purpose:** answer "what exists nearby?" only — never "who does Rocco recommend?"
- **Flow:** orchestrator (or the discover function directly) calls Google Places server-side with market-bounded location; returns a small set of nearby businesses with attribution.
- **Presentation:** results are surfaced honestly as "nearby businesses from Google," never as "Rocco's picks." Rocco may help the homeowner evaluate them (questions to ask, red flags) without ranking them as endorsements.
- **ToS compliance:** respect Google's caching/storage/display constraints (no building a competing directory; verify exact limits in 15). No bulk pre-caching of Places data.
- **Failure:** honest degradation ("couldn't pull nearby businesses right now"), never invented results.

## 14. Future Loop integration (stubbed — ADR-008/005)

Every meaningful interaction produces a candidate event (17). Events pass the consent gate (18) and, in Phase 1, go to a no-op sink. The schema, anonymization, and one-way boundary are real; the consumer is not. Rocco never reads from Loop in-session (ADR-005). Activating Loop later requires wiring the sink to a consumer behind the existing gate — no change to Rocco's behavior or the client.

## 15. Model routing (future)

Phase 1 uses a single Anthropic model (chosen for quality + safety). The orchestrator abstracts the model behind an interface so future routing (e.g., a cheaper model for trivial turns, a stronger model for complex ones) is an internal optimization, not a re-architecture. No production routing in Phase 1 (avoid premature complexity).

## 16. Confidence calibration

- Rocco's expressed confidence must track real epistemic state: high confidence only for well-established generalities (e.g., "a leaking water heater is usually worth acting on"), explicit hedging for anything situation-specific.
- Cost ranges are always presented as ranges with the drivers that move them, never single guaranteed numbers.
- The system prompt + guardrail discourage false precision; evaluation (section 18) includes calibration checks.

## 17. Recovery & fallback behavior

- **Model error/timeout:** honest message ("Rocco hit a snag — try again"), offer retry; never fabricate an answer.
- **Safety classifier failure:** fail safe — treat as potentially hazardous, escalate conservatively.
- **Discovery failure:** honest "couldn't load nearby businesses."
- **Rate-limit / cost-ceiling hit:** honest "Rocco's taking a breather" with guidance to return later; static content remains fully usable (ADR-015).
- **JS/island failure:** progressive-enhancement baseline (ADR-015) keeps content accessible; chat shows a no-JS honest fallback.

## 18. Evaluation methodology

- **Golden-set tests:** a curated set of representative homeowner scenarios (per service, plus hazards, plus injection attempts, plus money/upsell situations) with rubric-based expected behaviors (equips-not-diagnoses, escalates hazards, never fabricates, stays in-character, calibrated confidence).
- **Automated guardrail tests:** fabricated-data detectors, injection-resistance suite, safety-escalation suite — run in CI (28).
- **Prompt versioning:** prompts are versioned; eval runs are tied to prompt versions so regressions are attributable.
- **Human review:** periodic qualitative review of real (anonymized, consented) transcripts against the on-character checklist (04 section 11).
- **Trust metrics linkage:** evaluation supports the Phase 1 trust goal (02 section 9), not raw engagement.

## 19. Testing strategy (binds 28)

Unit: prompt assembly, context summarization, rate limiter, safety classifier mapping, guardrail detectors. Integration: full /rocco request path with mocked Anthropic/Google. Scenario/eval: the golden set above. Adversarial: injection + jailbreak + abuse suites. Resilience: failure-injection for model/tool/stream errors. Accessibility: chat island keyboard/AT + no-JS fallback (22).

## 20. Security posture (binds 21)

Keys server-only; all model/tool calls proxied; user content sanitized and treated as untrusted; output guardrails; rate limiting and cost ceilings; no PII required (ADR-003); anonymized logging only; consent enforced server-side at the event seam (ADR-004). No client trust for safety or consent decisions.

## Assumptions

- A1. A single strong Anthropic model meets Phase 1 quality + safety needs.
- A2. Server-side safety classification (lightweight model or rules + model) is fast enough to gate every turn within acceptable latency.
- A3. Anonymous-session + IP rate limiting is sufficient abuse control for Phase 1 traffic.
- A4. Streaming is achievable on Netlify Functions; if not, non-streaming fallback is acceptable.
- A5. Cost ceilings + caps keep spend bounded against bot/abuse load.

## Open Questions

- OQ1. Which Anthropic model + exact token/cost budgets per turn?
- OQ2. Safety classifier: rules-only, model-based, or hybrid — and its latency budget?
- OQ3. Streaming vs non-streaming final decision on Netlify (ties 06 OQ2, 15).
- OQ4. Exact rate-limit thresholds and the daily global spend ceiling value.
- OQ5. How is in-session memory represented and capped, and how does it survive reloads (ties 05 OQ1)?
- OQ6. Where is the consent gate evaluated in the turn pipeline relative to event emission (ties 18)?
