'use server';

import { withApi } from '@next-feature/client/server';
import api from '../config/client';
import type { ActivityItem } from '../types';
import { RECENT_ACTIVITY } from '../constants';

/**
 * [get-recent-activity]
 * next-feature@0.1.3-2
 * March 11th 2026, 12:48:39 pm
 */

export type GetRecentActivityRequest = {};

export const getRecentActivity = withApi(
  async (options?: GetRecentActivityRequest) => {
    const params = new URLSearchParams();
    const endpoint = '/activities/recent?' + params.toString();

    const response = await api.get<ActivityItem[]>(endpoint);
    return response;
  },
  { fallbackData: RECENT_ACTIVITY },
);
