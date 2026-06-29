# ServicesInMyCity — Art Direction Bible

> The visual DNA of ServicesInMyCity, and the foundation for every future EMG AI assistant (Carl, Lucy, Coach, and beyond).
> Version 1.0 — the creative bible. Code follows this document, not the other way around.

---

## 0. The North Star

We are not building a home-services website. We are building the first AI companion a homeowner trusts. Every visual decision answers one question: **"Does this make an anxious homeowner feel calmer, smarter, and in control?"**

If a design choice is clever but does not serve that feeling, we cut it.

Three words govern everything:

- **Calm** — never loud, never urgent, never salesy.
- **Warm** — human, lived-in, on the homeowner's side.
- **Certain** — quietly confident, like an expert who has seen this a hundred times.

The competition is not other contractor sites. It is the blank ChatGPT box, the 11pm Google search, the panicked group text. We win by feeling more trustworthy and more human than any of them.

---

## 1. Brand Personality

If ServicesInMyCity were a person: a calm, experienced neighbor who happens to know everything about homes. Never condescending. Never trying to sell you. The friend you call first because they tell you the truth.

| We are | We are not |
| --- | --- |
| Calm, warm, certain | Loud, urgent, flashy |
| A guide | A salesman |
| Lived-in and human | Corporate and sterile |
| Confidently simple | Cluttered and busy |
| Honest about limits | Over-promising |

**The feeling test:** relief on arrival, curiosity in the middle, momentum at the end.

---

## 2. Color System — "Evening Light on a Trusted Home"

The palette is built on a single emotional image: standing outside your home at dusk, windows glowing warm, everything safe inside. Navy is the trustworthy sky; orange is the warm light of help; cream is the calm of a clear mind.

### Core
| Token | Hex | Role | Emotion |
| --- | --- | --- | --- |
| Navy 900 | #16304C | Primary brand, confidence, structure | Trust, depth |
| Navy 700 | #22405F | Secondary navy, roofs, surfaces | Stability |
| Navy 500 | #2B4A6E | Lifted navy, gradients | Calm depth |
| Orange 500 | #E8762B | Action, Rocco, the warm light | Help, momentum |
| Orange 300 | #F4A24B | Glow, accents, window light | Warmth |
| Orange 100 | #FFE6B8 | Interior glow, highlights | Comfort |
| Cream 50 | #FBF8F2 | Primary background | Mental clarity |
| Cream 100 | #F6F1E8 | Section alternation | Quiet |

### Support (use sparingly)
| Token | Hex | Role |
| --- | --- | --- |
| Teal 500 | #3AA0A0 | "Alive"/status signals ONLY (Rocco is present, system is live) |
| Slate 600 | #52647A | Body text on light |
| Slate 300 | #A9BBD0 | Body text on navy |

### The one rule that protects the brand (ADR-009)
**Orange belongs to the homeowner and to Rocco.** It is the color of help, action, and warmth — the human side. **Teal/green belong to the platform/system layer** (status, "live," developer-facing) and must never be used as decorative homeowner color. This separation is sacred across the whole EMG ecosystem: it lets a user feel the difference between "this is for me" (orange) and "the machine is working" (teal) without ever being told.

---

## 3. THE HOUSE — The Signature

> This is to ServicesInMyCity what the knot is to ChatGPT and the owl is to Duolingo. It must be recognizable in a 32px favicon and breathtaking at full-screen. One house. One angle. One mood. Forever.

The House is not decoration and not a generic home icon. It is **the homeowner's home, seen with warmth** — the single image that says "your home is understood and cared for." Everything else on the site can change; the House cannot.

### 3.1 Architectural style
A warm, modern-traditional American home — the kind a wide range of homeowners recognize as "a real house," not a mansion and not a shack. Two stories. A simple, confident gabled roofline with a single chimney. Mixed but restrained materials: lap siding on the main body, a subtle stone or brick base, clean trim. A welcoming covered porch with two slim columns and a single warm porch light. It should read as aspirational-but-attainable: the home you could actually own, on its best evening.

Avoid: McMansion excess, sterile glass-box modernism, cartoon proportions, suburban blandness. The goal is "beloved home," not "real-estate listing."

### 3.2 Viewing angle and perspective
**Three-quarter front view, slightly elevated** — roughly 20-30 degrees off straight-on, camera at about adult eye height or a touch above, looking gently down. This angle shows two faces of the house (front + one side), which gives honest dimensionality without becoming an isometric diagram. Use a **gentle two-point perspective** with very long, soft vanishing — almost orthographic, so it feels stable and iconic rather than dramatic. Lens equivalent: a 50-65mm "human eye" feel. No fisheye, no aggressive foreshortening.

The house sits centered, with generous negative space (sky) above and a soft grounding shadow below. It must crop gracefully: the upper third (roof + chimney + sky) alone should still read as "the House" for favicons and avatars.

### 3.3 Color and material palette
Pulled directly from the brand palette so the House IS the brand:
- **Roof:** Navy 700 to Navy 900 gradient, top-lit.
- **Walls:** warm cream (Cream 50 to Cream 100), soft and matte.
- **Base/accent masonry:** muted warm stone, a desaturated sand tone.
- **Windows:** the hero detail — glowing Orange 100 to Orange 300, as if every room is warm inside.
- **Door:** Navy 700 with a single Orange 500 handle (the one spark of action color at the threshold).
- **Trim/frames:** soft navy line work, never harsh black.
Overall it should feel like the brand palette was always a house.

### 3.4 Lighting — "golden hour, just after sunset"
The defining mood. The sky behind is a deep navy dusk. The house is lit from a low, warm key light (the last of the sun, low-left), wrapping the front and one side in soft gold. Windows glow from within with warm interior light. Long, soft ambient shadows. A faint warm rim on the roofline. The emotional message of the lighting: **"the day is ending, everything is safe, you are home."** This single lighting choice does more brand work than any logo.

### 3.5 Interior visibility
Through the warm windows you can *suggest* life without literal clutter: a soft silhouette of a lamp, a hint of a kitchen, the warm glow of an occupied room. Just enough that the house feels **lived in, not empty**. On hover/focus, the relevant room's window brightens — the home responds to the homeowner's attention. Interiors are impressionistic, never detailed scenes; the glow matters more than the contents.

### 3.6 Landscaping
Minimal, intentional, evening-calm. A simple soft lawn base in muted green (kept low-saturation so it never competes with orange). One or two stylized trees or shrubs framing the edges for grounding. A short front path leading to the porch — subtly inviting the eye toward the door (the CTA of the architecture). A few tiny fireflies/warm motes optional at dusk. No fences, no driveways full of detail, no seasonal clutter in the base art.

### 3.7 Emotional feeling
**Curiosity wrapped in safety.** The viewer should feel "that's home" and want to lean in and explore it. It is calm enough to lower anxiety and warm enough to invite a question. If the hero creates relief, the House creates the gentle pull to engage.

### 3.8 Animation opportunities (subtle, always optional, reduced-motion safe)
- Windows breathe: warm glow gently pulses, slightly out of sync room to room.
- Chimney smoke drifts slowly and dissipates.
- Clouds drift across the dusk sky at varied speeds; a rare bird passes.
- The whole house responds to cursor with a few pixels of parallax depth.
- Porch light has a soft, steady halo.
- On hotspot hover, the matching room warms and the spot blooms.
- Idle "breathing" scale of ~1% over 6-7s so it feels alive, never static.
The rule: nothing should be noticeable on the first glance and everything should reward the second.

### 3.9 Seasonal variations (same house, same angle — only light and trim change)
- **Spring:** brighter dusk, blossoms on the trees, fresh green.
- **Summer:** long warm golden hour, fireflies, deep green.
- **Autumn:** amber sky, warm leaves drifting, the coziest version.
- **Winter:** blue-hour dusk, soft snow on roof, warmest window glow of all (contrast of cold outside / warm inside).
Seasons are an emotional gift to returning users, never a redesign. The silhouette is identical every time.

### 3.10 Mobile adaptation
On small screens the House tightens: less sky, the home fills more of the frame, hotspots become slightly larger touch targets with labels that appear on tap (not hover). The three-quarter angle and lighting are preserved exactly — we never flatten it to a front-on icon on mobile. The favicon/app-icon crop is the roof + glowing window detail at the three-quarter angle.

### 3.11 Production spec for the artist
- Delivered as layered, animatable art: separate layers for sky, clouds, house body, roof, each window glow, smoke, porch light, landscaping, ground shadow, hotspot anchors.
- Master built at large scale (e.g. 2400px wide) and as clean vector where possible so it scales from 32px to full-bleed.
- A documented "hotspot map": 12 named anchor points (Roof, Attic, Windows, HVAC, Electrical, Kitchen, Bathroom, Plumbing, Garage, Foundation, Basement, Outside) with exact x/y positions, each tied to a room that can light up.
- Provide light and dark/dusk variants and the four seasonal lighting passes.

---

## 4. ROCCO — The Visual Language

> Rocco is the face of the company and the most recognizable human in the homeowner world — as instantly known as Duolingo's owl, but warm, competent, and real. He is never a mascot gimmick and never a cartoon clip-art. He is the trusted guy who has seen your problem before and is genuinely on your side.

### 4.1 Who Rocco is, visually
A friendly, capable tradesperson in his 30s-40s: approachable, fit-for-the-job, the kind of face that makes you exhale. Warm eyes, easy half-smile, the confidence of competence rather than salesmanship. Signature wardrobe anchor: a **navy work shirt with a "Rocco" name patch** (already established) and a cap. The name patch is a brand asset in itself — it should appear consistently.

### 4.2 Expressions (the emotional range)
Rocco has a defined set, used contextually:
- **Welcoming** (default/hero): warm half-smile, eye contact, relaxed. "I've got you."
- **Listening:** slight head tilt, attentive, no smile-pressure. Used while the user types.
- **Reassuring:** calm, steady, a touch of empathy. Used on scary topics (leaks, electrical).
- **Confident:** subtle nod energy, assured. Used at recommendations/CTAs.
- **Thinking:** focused, looking slightly up/aside. Used during "Rocco is working."
Never: exaggerated surprise, slapstick, frustration, or hard-sell grin.

### 4.3 Poses
- **Hero pose:** chest-up, three-quarter turn toward the viewer, open and grounded.
- **Pointing/guiding pose:** gesturing toward the House or a detail — used when explaining.
- **Arms-relaxed standby:** for the persistent "Ask Rocco" presence.
- **Lean-in pose:** slightly forward, for "tell me what's going on" moments.
All poses keep him at eye level with the homeowner — never looking down on them, never tiny and subservient.

### 4.4 Clothing
Navy work shirt (Navy 700) with the Rocco name patch, optionally a cap. Clean but real — this is someone who works, not a model in costume. Sleeves can be rolled. One subtle orange accent allowed (a pen, a patch outline) to tie him to the action color. Seasonal: a navy jacket in winter, sleeves up in summer. Wardrobe is consistent enough to be a silhouette signature.

### 4.5 Lighting
Always warm and flattering, matching the House's golden-hour world: soft key light, gentle fill, a warm rim to separate him from navy backgrounds. He should look like he is standing in the same evening light as the home he protects. No harsh studio flash, no cold corporate lighting.

### 4.6 Composition
Generous negative space; Rocco occupies one side, message on the other (as in the Meet Rocco band). Eyes positioned on a comfortable upper-third line. He looks toward the content/the user, never away. Crops are intentional: hero (chest-up), avatar (head-and-shoulders, centered), icon (simplified mark).

### 4.7 The five Rocco "modes" (define each as a deliverable)
1. **Illustration style** — a warm, semi-stylized portrait illustration of Rocco for branded/marketing surfaces. Soft shapes, painterly light, same golden world as the House. This is the "canonical Rocco" when photography is not right.
2. **Photography style** — real, warm, documentary portraits of the Rocco character (see Photography section). Used for trust and humanity.
3. **Icon style** — a minimal Rocco mark: the silhouette of cap + shoulders + name-patch shape, reducible to a single navy glyph with an orange spark. Works at 24px. This becomes the "Rocco is here" symbol.
4. **Avatar style** — a circular, friendly head-and-shoulders crop with the teal "live" status dot for the Ask bar and chat. Consistent framing every time.
5. **Hero style** — the full-presence Rocco: chest-up, golden light, slight idle motion, the emotional anchor of the page.

### 4.8 Motion for Rocco (he must feel alive before he speaks)
Idle breathing/float, occasional slow blink, subtle gaze shifts toward whatever the user is doing, a gentle "listening" lean when the input is focused, and a typing/"thinking" shimmer in the Ask bar. Calm, never jittery. The teal status dot signals presence; the orange signals he is ready to help.

### 4.9 Extending Rocco to the EMG family
Each future assistant is a **distinct character in the same world**, not a recolor: Carl, Lucy, Coach share Rocco's lighting, warmth, eye-level respect, name-patch device, and the orange-equals-help rule — but each gets their own face, wardrobe, and domain. The world is shared; the personalities are unique. This is how the EMG ecosystem feels like one family of trusted guides.

---

## 5. Photography Direction

> Every photo earns its place. If it could appear on a generic contractor template, it does not belong here. We photograph **homeowners and their moments**, not products or sales reps.

### 5.1 What we photograph (homeowner moments)
Real, quiet, human beats: a parent making coffee in a warm kitchen on a normal morning; someone exhaling with relief after a problem is understood; a hand on a thermostat; kids doing homework while the house hums fine in the background; a homeowner and Rocco talking on a porch like neighbors. The emotion is **calm competence and relief**, never crisis or hard work being sold.

We do NOT use: call-center headsets, fake handshakes, posed sales reps, hard-hat stock, construction clip-art, before/after horror photos, stressed faces.

### 5.2 Camera and lenses
A documentary-portrait feel. Prime lenses: **35mm** for environmental homeowner-in-their-space shots (context + intimacy), **50mm** for natural portraits, **85mm** for tight, warm emotional close-ups with soft background fall-off. Wide, soft apertures (f/1.8-f/2.8) for gentle depth. Never the flat, deep-focus look of stock real-estate photography.

### 5.3 Framing and composition
Generous negative space to match the UI's calm. Subjects placed off-center on thirds, often looking into the layout's open space. Eye-level or slightly low angles that respect the homeowner. Foreground softness, real rooms, honest clutter kept minimal. Leave deliberate empty areas for type to live in.

### 5.4 Lighting and color
The same world as the House and Rocco: warm, soft, golden-hour or warm-window interior light. Natural light wherever possible. Warm white balance. Lifted shadows (never crushed black), gentle contrast. Color graded toward the brand: warm highlights, navy-leaning shadows, cream midtones. Every photo should feel like it belongs to the same evening.

### 5.5 Architecture in photography
Real, attainable American homes — the same modern-traditional spirit as the signature House. Lived-in, not staged-for-sale. Porches, kitchens, entryways, utility spaces shown with warmth and dignity. Avoid mansions, model-home sterility, and tight grimy crawlspaces presented as fear.

### 5.6 Diversity and inclusion
Homeowners across ages, races, family structures, and regions — because "homeowner" is everyone. Represent single people, couples, multigenerational households, renters-becoming-owners. Authentic casting over models. Real bodies, real homes, real warmth. Diversity is shown naturally, never as a checkbox tableau.

### 5.7 Environments
Kitchens, living rooms, entryways, porches, basements, garages, yards at dusk — the actual stage of home life. Seasonal range to match the House's seasons. Always warm, always safe-feeling, always the homeowner's own territory.

---

## 6. Motion Language — "Alive but Calm"

> Premium confidence, never flashy. Motion exists to make the product feel present and responsive, like a calm expert — not to entertain. If an animation calls attention to itself, it has failed.

### 6.1 Philosophy
Everything breathes; nothing performs. Motion should feel like the natural settling of a confident system. The benchmark is the quiet polish of high-end product design (Apple, Linear, Stripe) — motion you feel more than see.

### 6.2 Durations
- **Micro (hover, taps, focus):** 150-250ms.
- **Standard (cards, chips, buttons settling):** 250-400ms.
- **Reveals (sections arriving):** 600-900ms.
- **Ambient/idle loops (breathing, glow, drift):** 4-8s, long and unhurried.
Nothing snappy-fast (feels cheap) and nothing slow enough to make the user wait.

### 6.3 Easing
A single house easing curve for almost everything: a gentle ease-out — `cubic-bezier(0.2, 0.7, 0.2, 1)` — confident arrival, soft landing. Ambient loops use smooth ease-in-out sines. No bounces, no elastic, no linear (except continuous drift like clouds). Consistency of easing is a huge part of "premium."

### 6.4 Hover philosophy
Hover is a quiet acknowledgment, not a performance: a few pixels of lift, a soft shadow deepening, a gentle glow or accent. Always reversible and smooth. Things rise toward the user (translateY up) as if leaning in to help. Never scale aggressively, never flash color.

### 6.5 Parallax philosophy
Subtle depth, never motion sickness. The House gets a few pixels of cursor parallax to feel three-dimensional. Scroll parallax (if used) is gentle and layered (sky slower than house). Always disabled under reduced-motion and on coarse-pointer devices. Parallax is seasoning, not a main course.

### 6.6 Loading philosophy
Calm anticipation, not spinners-of-anxiety. Prefer warm shimmer/skeletons in brand tones, and for Rocco a "thinking" shimmer that feels like a person considering, not a machine buffering. Loading is a chance to reinforce that someone competent is on it. Never a harsh full-screen spinner.

### 6.7 Idle animations
The site is never fully still: house breathing, window glow, drifting clouds, Rocco's float and blink, the live status pulse. All extremely subtle, all reduced-motion safe. Idle motion is what separates "alive product" from "static page."

### 6.8 Reveal animations
Content arrives as the homeowner scrolls into it — a soft rise (~24px) and fade over 600-900ms, once, never re-triggering. Staggered slightly within a section so it feels orchestrated. This turns scrolling into a sequence of small arrivals — "moments," not a wall of content.

### 6.9 The motion contract
Every animation must: respect `prefers-reduced-motion` (off completely), never block interaction, never loop attention-grabbingly, and always serve calm-confidence. When in doubt, do less.

---

## 7. Emotional Design — Designing Toward Feeling

> We design sections toward an emotion first, layout second. Every section has one job: make the homeowner feel a specific way. If the layout does not produce the emotion, the layout is wrong.

| Section | Target emotion | How we create it |
| --- | --- | --- |
| **Hero** | **Relief** | Calm warm palette, a greeting that speaks to *you*, plain-language promise ("know what's wrong before anyone touches it"), no forms or pressure. The exhale of "okay, I'm in good hands." |
| **The House** | **Curiosity** | An inviting, glowing home you want to explore; hotspots that reward poking; the feeling of "wait, I can just ask about any of this?" |
| **Rocco** | **Confidence** | A real human on your side, eye-level, warm light, "works for you, not the contractor." Trust transferred from a face. |
| **Journey** | **Clarity** | A simple 1-2-3 story (notice it, understand it, meet a pro). The chaos of a home problem made legible. "Oh, this is how it works." |
| **Trust** | **Security** | Shown not told — process, honesty about limits, real proof over icon rows. "These people won't take advantage of me." |
| **CTA / Closing** | **Momentum** | Big confident type, one obvious warm action, zero friction. "I'll just ask one question." The easiest possible first step. |

**Design loop for any new section:** name the emotion -> choose the one moment that creates it -> remove everything that dilutes it. Layout serves emotion, always.

---

## 8. Three Signature Moments (creatively unique — hard to copy)

> Not technically difficult. Creatively distinct. These are the things a homeowner remembers and tells a friend, and that a competitor cannot simply lift without lifting our whole soul.

### Moment 1 — "Point to where it hurts" (the living House)
The homeowner explores their own glowing home and every part of it is a question Rocco can already answer. Hovering a room warms it and opens Rocco pre-loaded with context. It reframes a scary home problem as a calm, guided exploration. Competitors can copy a house graphic; they cannot copy the *emotional reframing* of "your home is a friend you can ask anything."

### Moment 2 — "Rocco already knows it's evening" (the present companion)
Before the user types a word, Rocco greets them by time of day, his status quietly alive, the Ask bar typing his welcome like a real person leaning in. It is the feeling that someone is already *there* and already paying attention to *you*. This is presence, not personalization-as-gimmick — and it is uniquely ours because it is tied to Rocco's character, not a generic "Hello {name}."

### Moment 3 — "The home that remembers the season" (the returning ritual)
The signature House quietly changes with the real-world season — snow on the roof in winter, fireflies in summer, amber leaves in fall — same home, same angle, just dressed for today. Returning users get a small, unannounced gift that says "this place is alive and it's still here for you." It builds the rarest thing online: a reason to come back just to see. Nearly impossible to copy meaningfully without our exact House and world.

---

## 9. The EMG Ecosystem DNA

> This document defines ServicesInMyCity, but it is also the seed for Carl, Lucy, Coach, and every future EMG AI guide. The ecosystem must feel like one family.

**Shared across all EMG assistants (the constants):**
- The "evening light, you are safe, someone competent is here" emotional world.
- The calm-warm-certain personality and the relief/curiosity/momentum arc.
- The color law: **orange = the human/help layer, teal/green = the system/platform layer.** Never crossed.
- Eye-level respect for the user; guides who serve, never sell.
- One house easing curve; "alive but calm" motion; reduced-motion always honored.
- A signature, ownable hero object (for SIMC it is the House) and a recognizable character with five modes (illustration, photography, icon, avatar, hero).
- Honesty: never fabricate reviews, stats, awards, or coverage; always state limits plainly.

**Unique per assistant (the variables):**
- The character (Rocco for homes; others for their domains) — own face, wardrobe, name-patch device, voice.
- The signature object (SIMC: the House; each product gets its own ownable icon).
- Domain-specific photography moments and color emphasis within the shared law.

The test for any new EMG product: *put it beside ServicesInMyCity. A stranger should feel "same family, different guide" instantly — without being told.*

---

## 10. Governance

- This document is the source of truth. UI implementation follows it; it does not follow the UI.
- Changes to the House silhouette, the color law (ADR-009), or Rocco's core identity require explicit sign-off — these are five-year decisions.
- Every new visual asset is checked against Section 0 (North Star) and Section 7 (Emotion) before it ships.
- When code and this bible disagree, the bible wins until the bible is deliberately revised.

*Visual DNA, v1.0. The next implementation is driven by this creative direction — not by incremental UI changes.*
