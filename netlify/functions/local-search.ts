import type { Handler } from '@netlify/functions';

// Honest discovery via Google Places (ADR-004, ADR-010). NOT the recommendation engine.
// 'Google answers what exists nearby. Rocco answers what the homeowner should know.'
// Results are presented honestly as nearby businesses, never as ranked picks.
// No fabricated listings, counts, ratings, or reviews. Empty means empty.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false }) };
  }
  const key = process.env.GOOGLE_MAPS_API_KEY;
  let query = '';
  let city = '';
  try {
    const body = JSON.parse(event.body || '{}');
    query = String(body.query || '').slice(0, 80);
    city = String(body.city || '').slice(0, 80);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  }

  if (!key) {
    // No key configured: honest empty state, never fabricated data.
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, data: { businesses: [], source: 'google_places', note: 'search_unavailable' } }),
    };
  }

  try {
    const q = encodeURIComponent(`${query} in ${city}`.trim());
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&key=${key}`;
    const r = await fetch(url);
    const j = await r.json();
    const businesses = (j.results || []).slice(0, 8).map((p: any) => ({
      name: p.name,
      address: p.formatted_address,
      rating: p.rating,
      userRatingsTotal: p.user_ratings_total,
      placeId: p.place_id,
    }));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, data: { businesses, source: 'google_places' } }),
    };
  } catch {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, data: { businesses: [], source: 'google_places', note: 'search_error' } }),
    };
  }
};
