import type { VisitorRecord, VisitorStore } from './types';

/**
 * In-memory VisitorStore. Fine for local dev and for iterating on the
 * tracking logic itself, but:
 *
 *  - Does NOT survive a serverless cold start (Vercel Node functions get
 *    recycled; the Map resets).
 *  - Is NOT shared across concurrent function instances — two visitors
 *    hitting different instances get independently-counted visits.
 *
 * When a real backend exists (e.g. the planned Spring Boot service),
 * replace this with a `VisitorStore` implementation that calls it the same
 * way `getIpDetails` calls ipapi.co — via `@next-feature/client` — and swap
 * the export in `./index.ts`. Nothing outside this folder needs to change.
 */
const globalForVisitorStore = globalThis as unknown as {
  __visitorStore?: Map<string, VisitorRecord>;
};

// Stash on globalThis so Next.js dev-server module reloads (HMR) don't
// silently reset visit counts on every file save.
const records = globalForVisitorStore.__visitorStore ?? new Map<string, VisitorRecord>();
if (process.env.NODE_ENV !== 'production') {
  globalForVisitorStore.__visitorStore = records;
}

export const memoryVisitorStore: VisitorStore = {
  async get(visitorId) {
    return records.get(visitorId);
  },
  async upsert(record) {
    records.set(record.visitorId, record);
    return record;
  },
  async list(limit = 100) {
    return Array.from(records.values())
      .sort((a, b) => b.lastSeen - a.lastSeen)
      .slice(0, limit);
  },
};
