'use server';

import { withApi, withForm } from '@next-feature/client/server';
import { z } from 'zod';
import api from '../config/client';
import { Repo } from '../types';

/**
 * [get-repos]
 * next-feature@0.1.3-2
 * March 11th 2026, 12:14:36 pm
 */

export type GetReposRequest = {};

export const getRepos = withApi(async (options?: GetReposRequest) => {
  const params = new URLSearchParams();
  const endpoint = '/repos?' + params.toString();

  const response = await api.get<Repo[]>(endpoint);
  return response;
}, { fallbackData: []});
