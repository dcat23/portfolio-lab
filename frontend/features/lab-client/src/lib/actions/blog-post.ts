'use server';

import { withApi } from '@next-feature/client/server';
import api from '../config/client';
import type { BlogPost } from '../types';

/**
 * [get-blog-posts]
 * next-feature@0.1.2-3
 * February 23rd 2026, 11:28:26 am
 */

export type GetBlogPostsRequest = {
  category?: string[],
  tags?: string[],
  skip?: string[], // slug ids
  limit?: number
};

export const getBlogPosts = withApi(async function (
  options?: GetBlogPostsRequest,
): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  const endpoint = '/blog/posts?' + params.toString();
  const response = await api.get<BlogPost[]>(endpoint);
  return response;
}, {
  fallbackData: [],
})

/**
 * [get-post-by-slug]
 * next-feature@0.1.2-8
 * February 23rd 2026, 1:28:57 pm
 */
export const getPostBySlug = withApi(async (slug: string) => {
  const endpoint = `/blog/posts/${slug}`;
  const response = await api.get<BlogPost>(endpoint);
  return response;
}, {});

/**
 * [get-related-posts]
 * next-feature@0.1.2-10
 * February 23rd 2026, 5:03:47 pm
 */

export const getRelatedPosts = withApi(
  async (currentPost: BlogPost, limit: number = 3) => {
    const params = new URLSearchParams();
    params.append("limit", String(limit))
    const endpoint = `/blog/posts/${currentPost.id}/related` + params.toString();
    const response = await api.get<BlogPost[]>(endpoint);
    return response
      .filter((post) => post.slug !== currentPost.slug)
      .filter((post) => post.category === currentPost.category || post.tags.some((tag) => currentPost.tags.includes(tag)))
      .slice(0, limit)
  },
  { fallbackData: [] },
);
