import type { NextRequest } from 'next/server';

/**
 * Resolve the visitor's IP address.
 *
 * `x-forwarded-for` is only trustworthy for the hop(s) added by
 * infrastructure YOU control — a client can put anything it wants in that
 * header itself. With exactly one trusted reverse proxy in front of the app
 * (Vercel, or the ngrok tunnel used locally), the proxy appends the true
 * client IP as the last entry, so anything earlier in the list may be
 * client-supplied and should not be trusted for security decisions.
 *
 * `x-real-ip` is preferred where available (Vercel sets it to a single,
 * unambiguous address) — verify this matches whatever sits in front of the
 * app in each environment (Vercel vs. the ngrok container vs. bare Node)
 * before relying on it for anything more than analytics.
 */
export function getClientIp(request: NextRequest): string | null {
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',').map((part) => part.trim());
    return parts[parts.length - 1] || null;
  }

  return null;
}

/**
 * Country/region/city as resolved by Vercel's edge network — free, instant,
 * and populated before the request reaches this app (so it can't be spoofed
 * by the client the way a body/query param could). Only falls back to an
 * external lookup (ipapi.co via getIpDetails) when you need something
 * Vercel doesn't provide, e.g. ISP/ASN or VPN/proxy/Tor detection — do that
 * lazily against a stored IP, not on every request.
 */
export function getGeoFromHeaders(request: NextRequest) {
  return {
    country: request.headers.get('x-vercel-ip-country'),
    region: request.headers.get('x-vercel-ip-country-region'),
    city: request.headers.get('x-vercel-ip-city'),
  };
}
