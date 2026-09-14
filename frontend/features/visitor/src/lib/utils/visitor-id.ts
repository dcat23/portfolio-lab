export const VISITOR_COOKIE_NAME = 'vid';
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year, in seconds

export function generateVisitorId(): string {
  return crypto.randomUUID();
}
