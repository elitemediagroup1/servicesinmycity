# ServicesInMyCity — Build Bible

> The permanent engineering and product constitution for **ServicesInMyCity**, the first production implementation of the **EMG Loop** platform by Elite Media Group (EMG).

This is not casual documentation. It is the source of truth. A future engineer, designer, writer, or AI session should be able to be told *"Build Section X"* or *"Build the HVAC service pages"* and find everything needed here without re-explaining the project. If you need context that isn't written down, that is a bug in the Bible — fix the Bible, then build.

## How to read this

Documents are numbered by foundational order. Lower numbers are more foundational; later docs depend on earlier ones. Read `00` (ADRs) and `01` first, then `04` (Rocco). The dependency spine is roughly: `00 → 01 → 02 → 03/04 → 05/06 → 07/08 → 09/10`, with `13–20` forming the AI/platform/Loop spine and `21–28` the engineering-discipline layer.

## Conventions

- **ADRs** (`/architecture/adr/`) are immutable, append-only historical records of *why*. We never edit a decided ADR's intent; we supersede it with a new ADR.
- Every document includes **Assumptions** (challengeable) and **Open Questions** (architectural backlog) sections.
- Every batch of work ends with an **Architecture Review** and explicit **Decisions Required**.
- Invariants (homeowner-first, equip-not-diagnose, earned-not-purchased, consent-as-gate, aggregate-separation) cannot be changed by an engineering decision — only a company-level decision recorded as a new ADR.

## Index

### Architecture Decision Records — `/build-bible/architecture/adr/`

- ADR-001 Homeowner First
- ADR-002 Rocco Equips Never Diagnoses
- ADR-003 Anonymous Session Identity
- ADR-004 Consent As Gate
- ADR-005 Aggregate Intelligence Separation
- ADR-006 Google Discovery vs Recommendation
- ADR-007 Recommendation Independence
- ADR-008 Loop Stub Strategy
- ADR-009 Product vs Platform Color System
- ADR-010 Honest Market Expansion

### Core documents — `/build-bible/`

| # | Document | Status |
|---|---|---|
| 01 | 01_PROJECT_OVERVIEW.md | Drafted (Batch 1) |
| 02 | 02_PRODUCT_STRATEGY.md | Drafted (Batch 1) |
| 03 | 03_BRAND_GUIDELINES.md | Drafted (Batch 1) |
| 04 | 04_ROCCO_PERSONALITY.md | Drafted (Batch 1) |
| 05 | 05_INFORMATION_ARCHITECTURE.md | Drafted (Batch 2) |
| 06 | 06_SITE_ARCHITECTURE.md | Drafted (Batch 2) |
| 07 | 07_DESIGN_SYSTEM.md | Drafted (Batch 2) |
| 08 | 08_COMPONENT_LIBRARY.md | Pending |
| 09 | 09_PAGE_REQUIREMENTS.md | Pending |
| 10 | 10_SERVICE_PAGE_FRAMEWORK.md | Pending |
| 11 | 11_CONTENT_GUIDELINES.md | Pending |
| 12 | 12_SEO_STRATEGY.md | Pending |
| 13 | 13_AI_ARCHITECTURE.md | Pending |
| 14 | 14_NETLIFY_ARCHITECTURE.md | Pending |
| 15 | 15_API_SPECIFICATION.md | Pending |
| 16 | 16_LOOP_INTEGRATION.md | Pending |
| 17 | 17_EVENT_SCHEMA.md | Pending |
| 18 | 18_CONSENT_ARCHITECTURE.md | Pending |
| 19 | 19_PARTNER_ARCHITECTURE.md | Pending |
| 20 | 20_RECOMMENDATION_ENGINE.md | Pending |
| 21 | 21_SECURITY.md | Pending |
| 22 | 22_ACCESSIBILITY.md | Pending |
| 23 | 23_PERFORMANCE.md | Pending |
| 24 | 24_ANALYTICS.md | Pending |
| 25 | 25_DEVELOPER_STANDARDS.md | Pending |
| 26 | 26_GITHUB_STRUCTURE.md | Pending |
| 27 | 27_DEPLOYMENT_GUIDE.md | Pending |
| 28 | 28_TESTING_CHECKLIST.md | Pending |
| 29 | 29_PHASE_ONE_ROADMAP.md | Pending |
| 30 | 30_FUTURE_LOOP_ROADMAP.md | Pending |

## Locked invariants (quick reference)

1. Rocco works for homeowners. Contractors are customers; homeowners are users.
2. Recommendations are earned, never purchased.
3. Never fabricate stats, contractor counts, reviews, or ratings.
4. Rocco equips; Rocco never diagnoses.
5. Consent is a gate, not a field.
6. User trust is more valuable than revenue.
7. The aggregate intelligence layer is walled off from the user layer.
8. Design everything Loop-ready. Do not build Loop yet (Lock, Stub, Validate).
