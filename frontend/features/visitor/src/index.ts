export { authConfig } from './lib/auth/auth.config';
export type { JWT, Session, User } from './lib/types/next-auth';

export { recordVisit } from './lib/actions/track';
export type { RecordVisitInput } from './lib/actions/track';
export { classifyReferrer, hostname } from './lib/utils/referrer';
export { getClientIp, getGeoFromHeaders } from './lib/utils/request-ip';
export { VISITOR_COOKIE_NAME, VISITOR_COOKIE_MAX_AGE, generateVisitorId } from './lib/utils/visitor-id';
export { visitorStore } from './lib/store';
export type { VisitorRecord, VisitorStore, ReferrerCategory } from './lib/store/types';
