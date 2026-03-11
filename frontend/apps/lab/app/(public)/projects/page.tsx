import { ProjectsPageContent } from "@app/lab/components/public/projects/projects-page-content";
import { BASE_URL } from "@app/lab/lib/config/env";
import { getProjects } from "@feature/lab-client/server";
import type { Metadata } from "next";


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
  const { data: projects, error } = await getProjects();

  if (error) {
    console.error('[lab] Error fetching projects:', error);
  }
  return (
    <div className="pt-24">
      <ProjectsPageContent projects={projects} />
    </div>
  );
}
