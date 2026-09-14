import type { IpDetails } from '../actions/ipapi';

export type ReferrerCategory = 'github' | 'social' | 'search' | 'direct' | 'other';

export interface VisitorRecord {
  visitorId: string;

  // Set once, on first sighting — "how did they originally find the site."
  firstSeen: number;
  firstReferrer: string | null;
  firstReferrerCategory: ReferrerCategory;

  // Updated on every sighting — "what are they doing now."
  lastSeen: number;
  lastPath: string;
  lastIp: string | null;
  lastUserAgent: string | null;

  // Updated only when a new *external* referrer/UTM shows up — internal
  // same-site navigation never overwrites these.
  lastReferrer: string | null;
  lastReferrerCategory: ReferrerCategory;
  lastUtmSource: string | null;

  // Incremented once per session (see SESSION_GAP_MS in track.ts), not per
  // page view.
  visitCount: number;
  ipDetails: IpDetails | null;
}

export interface VisitorStore {
  get(visitorId: string): Promise<VisitorRecord | undefined>;
  upsert(record: VisitorRecord): Promise<VisitorRecord>;
  list(limit?: number): Promise<VisitorRecord[]>;
}
