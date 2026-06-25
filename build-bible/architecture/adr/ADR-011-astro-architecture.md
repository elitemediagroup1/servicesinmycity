# ADR-011 — Astro Architecture

**Status:** Accepted
**Date:** Phase 1 founding
**Owner:** Lead Architect (Front-End)

## Context

ServicesInMyCity is a content-rich, SEO-dependent site (service and service x market pages) with one island of rich interactivity (the Ask Rocco chat). We need a front-end that ships fast static HTML for the discoverable surface while allowing a focused interactive island, deploys cleanly on Netlify, and stays maintainable for a decade.

## Decision

We adopt **Astro** as the front-end framework. Astro renders static-first HTML by default, hydrates only the components that need interactivity (Astro Islands), ships minimal JavaScript, has first-class content collections (ideal for service-page content), supports component frameworks (React/Vue/Svelte) where genuinely needed, and deploys to Netlify with minimal friction.

## Alternatives Considered

- **Next.js** — powerful React meta-framework; static export possible.
- **Eleventy (11ty)** — lightweight static-site generator.
- **Remix** — server-rendered React, data-loading focused.
- **Nuxt** — Vue meta-framework.
- **Traditional hand-rolled static site** — no framework.

## Why Rejected

- **Next.js:** ships a heavier JS baseline and steers toward an SPA/RSC model that's more than our mostly-static content needs; risks over-hydration and worse default performance for a content site.
- **Eleventy:** excellent for static output but a weaker component model and no built-in islands story; the chat island and shared design-system components would be more bespoke to maintain.
- **Remix:** optimized for server-rendered, data-heavy app UIs; mismatched with a static-content-dominant site and adds server runtime complexity we don't need in Phase 1.
- **Nuxt:** same meta-framework weight concerns as Next, in the Vue ecosystem; no advantage for our use case.
- **Hand-rolled static:** no component model, no content collections, poor long-term maintainability and consistency across hundreds of future service pages.

Astro uniquely matches our "static content + chat island" philosophy with the least shipped JS and the best content-collection ergonomics.

## Consequences

- Service/education/about/legal pages are static Astro pages; the chat is an island hydrated client-side and backed by Netlify Functions.
- Content collections become the source of truth for service-page content (feeds 10, 11, 12).
- The minimal-JS default reinforces the performance and trust goals (23).
- Component framework interop remains available if a complex interactive feature later warrants React/Svelte, without re-platforming.

## Future Impact

Sibling EMG products (Care/Pets/etc.) can reuse the Astro shell, the islands pattern, and the design-system components, swapping the product accent and the guide. This decision sets the front-end foundation for the ecosystem.
