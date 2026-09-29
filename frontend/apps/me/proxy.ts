import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import {
  recordVisit,
  getClientIp,
  VISITOR_COOKIE_NAME,
  VISITOR_COOKIE_MAX_AGE,
  generateVisitorId,
} from '@feature/visitor';
import { logger } from '@next-feature/logging/server';

// Not wrapping this with next-auth's `auth()` HOF: in next-auth@5.0.0-beta.27
// its public types only cover App Route handlers (`ctx: { params }`), not
// the NextFetchEvent (`waitUntil`) shape a proxy actually receives — so it
// can't be typed correctly here. When route protection is needed, construct
// `NextAuth(authConfig)` (the provider-less, edge-safe config from
// `@feature/visitor`) here and call `await auth()` below instead.
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next();

  const existingVisitorId = request.cookies.get(VISITOR_COOKIE_NAME)?.value;
  const visitorId = existingVisitorId ?? generateVisitorId();

  if (!existingVisitorId) {
    response.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
      maxAge: VISITOR_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }

  // Fire-and-forget: tracking must never slow down or break a page load.
  // event.waitUntil keeps the write alive after the response is sent
  // instead of racing the runtime tearing the invocation down.
  event.waitUntil(
    recordVisit({
      visitorId,
      path: request.nextUrl.pathname,
      referrer: request.headers.get('referer'),
      utmSource: request.nextUrl.searchParams.get('utm_source'),
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent'),
      ownHost: request.nextUrl.hostname,
    }).catch((e) => {
      // Swallow errors — analytics must never break the response.
      logger.warn(e, "error recording visit")
    }),
  );

  return response;
}

export const config = {
  matcher: [
    // Real page navigations only — skip static assets, images, Next
    // internals, and API routes so we don't log a "visit" per JS chunk,
    // font, or the /api/log beacon call itself.
    '/((?!_next/static|_next/image|favicon.ico|site.webmanifest|robots.txt|api/).*)',
  ],
};
