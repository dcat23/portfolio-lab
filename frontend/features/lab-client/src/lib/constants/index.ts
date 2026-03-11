import { ActivityItem, Repo } from '../types';

/**
 * [default-repos]
 * next-feature@0.1.3-2
 * March 11th 2026, 12:15:34 pm
 */
export const DEFAULT_REPOS: Repo[] = [
  {
    id: '1',
    name: 'next16-docker-tw4-starter',
    description:
      'Next.js 16 starter with App Router, Tailwind v4, Next-Auth v5, and Docker',
    progress: 85,
    lastUpdated: 'Dec 2024',
    url: 'https://github.com/dcat23/next16-docker-tw4-starter',
  },
  {
    id: '2',
    name: 'handbuilt-linux',
    description:
      'Minimal Linux distro from scratch with BusyBox and Syslinux bootloader',
    progress: 60,
    lastUpdated: 'Nov 2025',
    url: 'https://github.com/dcat23/handbuilt-linux',
  },
  {
    id: '3',
    name: 'einbiogpt',
    description: 'AI-powered social media bio generator with MCP integration',
    progress: 90,
    lastUpdated: 'Apr 2025',
    url: 'https://github.com/dcat23/einbiogpt',
  },
  {
    id: '4',
    name: 'llm-practice',
    description: 'Self-hosted chatbot API with RAG and MCP protocol support',
    progress: 75,
    lastUpdated: 'Apr 2025',
    url: 'https://github.com/dcat23/llm-practice',
  },
];

/**
 * [recent-activity]
 * next-feature@0.1.3-2
 * March 11th 2026, 12:51:31 pm
 */
export const RECENT_ACTIVITY: ActivityItem[] = [
  { type: "commit", project: "einui", message: "Add new Button variants", time: String(Date.now() - 2 * 60 * 60 * 1000) }, // 2 hours ago
  { type: "branch", project: "llm-practice", message: "Created feature/mcp branch", time: String(Date.now() - 5 * 60 * 60 * 1000) }, // 5 hours ago
  { type: "commit", project: "einbiogpt", message: "Implement MCP protocol handlers", time: String(Date.now() - 24 * 60 * 60 * 1000) }, // 1 day ago
  { type: "commit", project: "handbuilt-linux", message: "Update kernel config", time: String(Date.now() - 2 * 24 * 60 * 60 * 1000) }, // 2 days ago
];
