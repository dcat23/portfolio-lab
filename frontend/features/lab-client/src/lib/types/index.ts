/**
 * [project]
 * next-feature@0.1.3-1
 * March 1st 2026, 1:19:43 pm
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  year: string;
  stars: number;
  forks: number;
  url: string;
  homepage?: string;
  featured: boolean;
}

/**
 * [blog-post]
 * next-feature@0.1.2-3
 * February 23rd 2026, 11:31:47 am
 */
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  featured: boolean;
  color: string;
}

/**
 * [repo]
 * next-feature@0.1.3-2
 * March 11th 2026, 12:10:02 pm
 */
export interface Repo {
  id: string;
  name: string;
  description: string;
  progress: number;
  lastUpdated: string;
  url: string;
}

/**
 * [activity-item]
 * next-feature@0.1.3-2
 * March 11th 2026, 12:50:37 pm
 */
export interface ActivityItem {
  type: "commit" | "branch" | "issue" | "pull_request";
  project: string;
  message: string;
  time: string;
}
