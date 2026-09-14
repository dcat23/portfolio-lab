import type { ReferrerCategory } from '../store/types';

const GITHUB_HOSTS = ['github.com', 'github.io', 'githubusercontent.com'];
const SOCIAL_HOSTS = [
  'x.com',
  'twitter.com',
  't.co',
  'linkedin.com',
  'lnkd.in',
  'facebook.com',
  'fb.com',
  'reddit.com',
  'news.ycombinator.com',
  'instagram.com',
  'discord.com',
];
const SEARCH_HOSTS = ['google.', 'bing.com', 'duckduckgo.com', 'yahoo.com'];

function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function matchesHost(host: string, candidates: string[]): boolean {
  return candidates.some((entry) => host === entry || host.endsWith(`.${entry}`) || host.includes(entry));
}

/**
 * Best-effort acquisition channel. `referrer` is the raw Referer header —
 * unreliable on its own (browsers increasingly strip it cross-site,
 * especially from in-app browsers like Twitter/X, LinkedIn, Discord) — so
 * `utmSource` (a `?utm_source=github` you control on links you post
 * yourself) is checked first when present.
 */
export function classifyReferrer(referrer: string | null, utmSource: string | null): ReferrerCategory {
  const source = (utmSource ?? '').toLowerCase();
  if (source) {
    if (source.includes('github')) return 'github';
    if (['x', 'twitter', 'linkedin', 'facebook', 'reddit', 'discord', 'instagram'].some((s) => source.includes(s))) {
      return 'social';
    }
    if (['google', 'bing', 'duckduckgo', 'search'].some((s) => source.includes(s))) return 'search';
    return 'other';
  }

  const host = hostOf(referrer);
  if (!host) return 'direct';
  if (matchesHost(host, GITHUB_HOSTS)) return 'github';
  if (matchesHost(host, SOCIAL_HOSTS)) return 'social';
  if (matchesHost(host, SEARCH_HOSTS)) return 'search';
  return 'other';
}

export function hostname(url: string | null): string | null {
  return hostOf(url);
}
