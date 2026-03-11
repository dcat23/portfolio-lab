'use server';

import { withApi } from '@next-feature/client/server';
import { z } from 'zod';
import api from '../config/client';
import type { Project } from '../types';

/**
 * [get-projects]
 * next-feature@0.1.2-3
 * February 23rd 2026, 11:19:33 am
 */
export type GetProjectsRequest = {};

export const getProjects = withApi(async function getProjects(
  options?: GetProjectsRequest,
): Promise<Project[]> {
  const params = new URLSearchParams();
  const endpoint = '/projects?' + params.toString();
  const response = await api.get<Project[]>(endpoint);

  return response;
}, {
  fallbackData: []
});
