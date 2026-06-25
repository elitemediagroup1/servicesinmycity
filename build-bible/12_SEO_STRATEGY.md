# 12 — SEO Strategy

> Status: Drafted. Depends on: 10_SERVICE_PAGE_FRAMEWORK, 06_SITE_ARCHITECTURE, 05_INFORMATION_ARCHITECTURE, ADR-007 (Geographic Scope), ADR-014 (Static-First). Feeds: 10 implementation, 24_ANALYTICS, content production.

This document defines how ServicesInMyCity earns organic visibility honestly. SEO here is a consequence of genuinely useful, trustworthy local content, not a growth hack. It must never tempt us to fabricate reviews, counts, or authority (core invariant).

## 1. Strategic Posture

We win local intent. The site exists to help homeowners in specific Jersey Shore towns get trustworthy guidance and find nearby pros. Our SEO advantage is depth of honest local + service content that big aggregators produce thinly. Static-first rendering (ADR-014) gives us fast, fully crawlable pages by default, which is the single biggest technical SEO lever.

## 2. URL & Site Structure

Clean, human-readable, hierarchical URLs that mirror the information architecture (05/06):

- /services/{service} (e.g. /services/plumbing)
- /services/{service}/{city} (e.g. /services/plumbing/manahawkin)
- /{city} city hub pages for the launch market
- /ask the Rocco conversation workspace (ADR-012)
- /guides/{topic} educational, equip-not-diagnose content

The service-by-city matrix is generated from the canonical Service Page Framework (10), so hundreds of pages stay structurally consistent. Geographic scope is honest: only launch-market towns (ADR-007) get city pages. We never spin up city pages for places we cannot honestly serve.

## 3. On-Page Hierarchy

Each page follows the 10 framework: one H1 expressing the primary local-service intent, structured H2/H3 for content blocks, a clear meta title and description, and a trust progression that reads naturally for humans first. Rocco insertion points are crawlable static content with progressive enhancement (ADR-015); the chat island never hides primary content behind JavaScript.

## 4. Structured Data (Schema.org)

We mark up only what is true. Candidate schema types:

- LocalBusiness / Service for service pages (describing the service category and area served).
- FAQPage for genuine Q&A blocks Rocco commonly answers.
- BreadcrumbList for navigation.
- Article for guides.

We do NOT emit AggregateRating or Review schema for contractors we have not honestly collected reviews for. Fabricated ratings are both an invariant violation and a structured-data spam risk. When Google Places returns ratings via /api/local-search, those are displayed as Google's data and attributed as such, not re-emitted as our own review schema.

## 5. Local SEO Signals

- Town-specific, genuinely useful content (local considerations, seasonal issues relevant to coastal NJ homes).
- Consistent NAP only where we have a real presence; we do not invent addresses.
- Internal linking between service hubs, city hubs, and guides.
- Honest empty states when we have nothing useful for a query (never thin doorway pages).

## 6. Technical SEO

- Static HTML, fast LCP, minimal client JS (ADR-014, see 23_PERFORMANCE).
- Auto-generated sitemap.xml and robots.txt at build time.
- Canonical tags to prevent service/city duplication issues.
- Open Graph / Twitter cards for shareability.
- Accessible markup doubles as crawlable semantic structure (see 22_ACCESSIBILITY).

## 7. Rocco, AI, and SEO Boundaries

Rocco content shown on static pages is real, reviewed content, not live model output injected at crawl time. The /ask workspace is a dynamic app surface and is not an SEO target for thin AI text. We never auto-publish unreviewed AI-generated pages at scale; that risks low-quality mass content penalties and violates our trust-first posture. AI assists content production; humans approve before publish.

## 8. Measurement

Success is qualified local organic traffic and, more importantly, whether that traffic trusts Rocco (engagement with /ask, return visits). Vanity ranking for non-launch geographies is explicitly not a goal. Analytics specifics live in 24_ANALYTICS.

## Assumptions

- The launch market has enough local search volume to validate the content model.
- Static-first rendering will keep Core Web Vitals strong without heavy optimization work in Phase 1.
- Google Places attribution is sufficient for displaying third-party ratings without emitting our own review schema.

## Open Questions

- How aggressively do we build the service-by-city matrix before validating demand (risk of thin pages vs coverage)?
- Do guides live under /guides or nest under services for topical authority?
- What is the minimum content quality bar before a city page is allowed to publish?
- Should we localize seasonal/coastal content per town, or share regional content with town-level framing?
