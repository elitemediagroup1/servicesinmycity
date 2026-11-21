import { quoteStore, deliver } from '../lib/security-quotes.mjs';

export default async function retry() {
  const store = quoteStore();
  const deadline = Date.now() + 20000;
  for await (const page of store.list({ prefix: 'pending/', paginate: true })) {
    for (let i = 0; i < page.blobs.length; i += 8) {
      const batch = page.blobs.slice(i, i + 8);
      const results = await Promise.allSettled(batch.map(({ key }) => deliver(store, key.slice('pending/'.length))));
      if (results.some(r => r.status === 'rejected')) console.error('Home security queue needs attention');
      if (Date.now() >= deadline) return;
    }
  }
}
export const config = { schedule: '17 * * * *' };
