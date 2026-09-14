import { visitorStore } from '../store';
import type { VisitorRecord } from '../store/types';
import { classifyReferrer, hostname } from '../utils/referrer';
import { logger } from '@next-feature/logging/server';
import { getIpDetails, IpDetails } from './ipapi';
import { sendDiscordMessage } from './discord';
const log = logger.child({ module: 'track' });
// Repeat page views within this window count as the same visit; anything
// after it (a fresh tab tomorrow, coming back next week) increments
// visitCount as a new one.
const SESSION_GAP_MS = 30 * 60 * 1000;

export interface RecordVisitInput {
  visitorId: string;
  path: string;
  referrer: string | null;
  utmSource: string | null;
  ip: string | null;
  userAgent: string | null;
  /** request.nextUrl.hostname — used to ignore internal same-site navigation. */
  ownHost: string | null;
}

export async function recordVisit(input: RecordVisitInput): Promise<VisitorRecord> {
  const now = Date.now();
  const existing = await visitorStore.get(input.visitorId);

  const referrerHost = hostname(input.referrer);
  const isExternalReferrer = !!referrerHost && referrerHost !== input.ownHost;
  const hasAcquisitionSignal = isExternalReferrer || !!input.utmSource;

  const category = hasAcquisitionSignal
    ? classifyReferrer(input.referrer, input.utmSource)
    : (existing?.lastReferrerCategory ?? 'direct');

  // const isNewSession = !existing || now - existing.lastSeen > SESSION_GAP_MS;
  const isNewSession = true

  const record: VisitorRecord = {
    visitorId: input.visitorId,

    firstSeen: existing?.firstSeen ?? now,
    firstReferrer: existing?.firstReferrer ?? (hasAcquisitionSignal ? input.referrer : null),
    firstReferrerCategory: existing?.firstReferrerCategory ?? (hasAcquisitionSignal ? category : 'direct'),

    lastSeen: now,
    lastPath: input.path,
    lastIp: input.ip ?? existing?.lastIp ?? null,
    lastUserAgent: input.userAgent ?? existing?.lastUserAgent ?? null,

    // Only overwritten when this hit actually carries an external
    // referrer/UTM — clicking around the site itself doesn't reset "how
    // they got here."
    lastReferrer: hasAcquisitionSignal ? input.referrer : (existing?.lastReferrer ?? null),
    lastReferrerCategory: category,
    lastUtmSource: input.utmSource ?? existing?.lastUtmSource ?? null,

    visitCount: (existing?.visitCount ?? 0) + (isNewSession ? 1 : 0),
  };

  if (isNewSession) {
    const response = await getIpDetails({ ip: record.lastIp });

    log.info(record, 'recording visit');

    const [discordResponse] = await Promise.all([
      sendDiscordMessage({...record, ...response.data }),
    ]);


    log.info(discordResponse)
  }
  return visitorStore.upsert(record);
}
