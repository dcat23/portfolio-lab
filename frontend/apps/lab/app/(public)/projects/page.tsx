import { ProjectsPageContent } from '../../../components/public/projects/projects-page-content';
import { BASE_URL } from '../../../lib/config/env';
import { getProjects } from "@feature/lab-client/server";
import type { Metadata } from "next";
import { logger } from "@next-feature/logging/server";

const log = logger.child({module: "projects-page"});

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore open source projects, experiments, and tools. From web applications to systems programming, dive into the code.",
  keywords: ["open source", "projects", "web development", "systems programming", "experiments"],
  openGraph: {
    title: "Projects — DCAT",
    description: "Explore open source projects, experiments, and tools.",
    url: `${BASE_URL}/projects`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image-projects.png`,
        width: 1200,
        height: 630,
        alt: "DCAT Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — DCAT",
    description: "Explore open source projects, experiments, and tools.",
    images: [`${BASE_URL}/og-image-projects.png`],
  },
  alternates: {
    canonical: `${BASE_URL}/projects`,
  },
};

export default async function ProjectsPage() {
  const response = await getProjects();

  if (!response.success) {
    if (response.error) {
      log.warn(response.error.body);
    } else {
      log.warn(response.message);
    }
  }
  return (
    <div className="pt-24">
      <ProjectsPageContent projects={response.data} />
    </div>
  );
}
