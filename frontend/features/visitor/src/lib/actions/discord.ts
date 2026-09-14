'use server';

import { withApi } from '@next-feature/client/server';
import { z } from 'zod';
import { ApiClient } from '@next-feature/client';
import {
  DISCORD_WEBHOOK_ID,
  DISCORD_WEBHOOK_TOKEN,
} from '../config/env';
import axios from 'axios';
import { IpDetails } from '@feature/visitor/lib/actions/ipapi';
import { VisitorRecord } from '@feature/visitor';

const api = new ApiClient({
  baseURL: 'https://discord.com',
});

/**
 * [send-discord-message]
 * next-feature@0.1.4-2
 * September 14th 2026, 1:12:42 am
 */

export type SendDiscordMessageRequest = IpDetails & VisitorRecord & {
};

const dash = (value: string | null | undefined) => (value && value.trim() ? value : '—');
const toUnixSeconds = (ms: number) => Math.round(ms / 1000);
const relativeTimestamp = (ms: number) => `<t:${toUnixSeconds(ms)}:R>`;

const formatReferrer = (referrer: string | null, category: string) =>
  referrer ? `${referrer} (${category})` : `Direct (${category})`;

function formatDiscordMessage(options: SendDiscordMessageRequest): string {
  const flags = [
    options.mobile && 'Mobile',
    options.proxy && 'Proxy',
    options.hosting && 'Hosting',
  ].filter(Boolean) as string[];

  const lines = [
    `📍 **Location**`,
    `${dash(options.city)}, ${dash(options.regionName)}, ${dash(options.country)} ${options.zip ? `(${options.zip})` : ''}`.trim(),
    `${dash(options.isp)}${options.org && options.org !== options.isp ? ` — ${options.org}` : ''}`,
    `IP \`${dash(options.query)}\` • ${dash(options.timezone)}${flags.length ? ` • ${flags.join(' • ')}` : ''}`,
    ``,
    `👤 **Visitor** \`${options.visitorId}\` — visit #${options.visitCount}`,
    `First seen ${relativeTimestamp(options.firstSeen)} via ${formatReferrer(options.firstReferrer, options.firstReferrerCategory)}`,
    `Last seen ${relativeTimestamp(options.lastSeen)} on \`${dash(options.lastPath)}\``,
    `Referred by ${formatReferrer(options.lastReferrer, options.lastReferrerCategory)}${options.lastUtmSource ? ` • utm: ${options.lastUtmSource}` : ''}`,
    `User agent: ${dash(options.lastUserAgent)}`,
  ];

  return lines.join('\n');
}

export const sendDiscordMessage = withApi(
  async (options: SendDiscordMessageRequest) => {
    const content = formatDiscordMessage(options);
    const endpoint = `/api/webhooks/${DISCORD_WEBHOOK_ID}/${DISCORD_WEBHOOK_TOKEN}`
    return await api.post<void>(endpoint, { content });
  },
  {},
);
