import type { Handler } from '@netlify/functions';

// Deploy verification. No AI calls, exempt from spend accounting (15_API_SPECIFICATION).
export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      build: process.env.COMMIT_REF || 'dev',
      time: new Date().toISOString(),
    }),
  };
};
