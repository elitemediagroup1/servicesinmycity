# ServicesInMyCity Build Bible

The master blueprint for ServicesInMyCity, the first production application built on the EMG Loop platform. Every future build session should start here. This Build Bible is self-contained and does not depend on prior chat history.

## Core Invariants (never violate)

- Rocco works for homeowners. Contractors are customers. Homeowners are users.
- Recommendations are earned, never purchased.
- Never fabricate statistics, contractor counts, or reviews.
- Rocco equips; he never diagnoses.
- Consent is a gate, not a field.
- User trust is more valuable than revenue.
- The aggregate intelligence layer is walled off from individual user data.
- Design everything Loop-ready. Do not build Loop.

## Build Philosophy

Lock the invariants. Stub the infrastructure. Validate with users. Everything else waits. The first mission is to prove homeowners trust Rocco.

## Locked Technical Decisions

- Framework: Astro (static-first, Islands) - see ADR-011
- Hosting: Netlify; Serverless: Netlify Functions
- AI: Anthropic (Rocco); Local search: Google Maps/Places
- Identity: anonymous session identity, no accounts in Phase 1
- Geography: Jersey Shore launch market (Ocean & Monmouth County)
- Never expose API keys client-side

## Document Status

| # | Document | Status |
|---|----------|--------|
| 01 | PROJECT_OVERVIEW | Drafted / Committed |
| 02 | PRODUCT_STRATEGY | Drafted / Committed |
| 03 | BRAND_GUIDELINES | Drafted / Committed |
| 04 | ROCCO_PERSONALITY | Drafted / Committed |
| 05 | INFORMATION_ARCHITECTURE | Drafted / Committed |
| 06 | SITE_ARCHITECTURE | Drafted / Committed |
| 07 | DESIGN_SYSTEM | Drafted / Committed |
| 08 | COMPONENT_LIBRARY | Pending |
| 09 | PAGE_REQUIREMENTS | Pending |
| 10 | SERVICE_PAGE_FRAMEWORK | Drafted / Committed |
| 11 | CONTENT_GUIDELINES | Drafted / Committed |
| 12 | SEO_STRATEGY | Pending (Batch 4) |
| 13 | AI_ARCHITECTURE | Drafted / Committed |
| 14 | NETLIFY_ARCHITECTURE | Pending (Batch 4) |
| 15 | API_SPECIFICATION | Pending (Batch 4) |
| 16 | LOOP_INTEGRATION | Pending |
| 17 | EVENT_SCHEMA | Pending |
| 18 | CONSENT_ARCHITECTURE | Pending |
| 19 | PARTNER_ARCHITECTURE | Pending |
| 20 | RECOMMENDATION_ENGINE | Pending |
| 21 | SECURITY | Pending |
| 22 | ACCESSIBILITY | Pending |
| 23 | PERFORMANCE | Pending |
| 24 | ANALYTICS | Pending |
| 25 | DEVELOPER_STANDARDS | Pending |
| 26 | GITHUB_STRUCTURE | Pending |
| 27 | DEPLOYMENT_GUIDE | Pending |
| 28 | TESTING_CHECKLIST | Pending |
| 29 | PHASE_ONE_ROADMAP | Pending |
| 30 | FUTURE_LOOP_ROADMAP | Pending |

## Architecture Decision Records

Located in `architecture/adr/`. ADRs are immutable and append-only; supersede with new ADRs.

| ADR | Title | Status |
|-----|-------|--------|
| 001 | Homeowner-First | Accepted |
| 002 | Anonymous Session Identity | Accepted |
| 003 | Color System Layers | Accepted |
| 004 | Local Data Strategy | Accepted |
| 005 | Aggregate Intelligence Separation | Accepted |
| 006 | Legal/Disclaimer Architecture | Accepted |
| 007 | Geographic Scope | Accepted |
| 008 | Rocco Interaction Model | Accepted |
| 009 | Brand Color Reconciliation | Accepted |
| 010 | Recommendation Engine Stub | Accepted |
| 011 | Astro Architecture | Accepted |
| 012 | Dedicated Conversation Workspace | Accepted |
| 013 | AI-First Product | Accepted |
| 014 | Static-First Rendering Strategy | Accepted |
| 015 | Progressive Enhancement | Accepted |

## Reading Order

Start with 01-04 (product, brand, Rocco), then 05-07 (IA, site, design), then 13/11/10 (AI, content, service framework), then infrastructure (14, 15, 12).
