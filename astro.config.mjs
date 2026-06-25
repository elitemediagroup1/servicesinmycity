import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

// ServicesInMyCity - Astro config (ADR-011, ADR-014 static-first).
// Static-first output; Netlify adapter enables serverless Functions for Rocco,
// local search, consent, session, and the Loop event seam. Secrets stay server-side.
export default defineConfig({
  site: 'https://servicesinmycity.com',
  output: 'static',
  adapter: netlify(),
  integrations: [react()],
  // Minimal client JS by default (progressive enhancement, ADR-015).
  // Only the Rocco chat island hydrates.
  build: {
    inlineStylesheets: 'auto'
  }
});
