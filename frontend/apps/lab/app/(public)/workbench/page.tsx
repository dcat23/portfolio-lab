import { WorkbenchPageContent } from "@app/lab/components/public/workbench/workbench-page-content";
import { BASE_URL } from "@app/lab/lib/config/env";
import { getRepos } from "@feature/lab-client/lib/actions/repo";
import { getRecentActivity } from "@feature/lab-client/server";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Workbench",
  description: "Active experiments, prototypes, and work in progress. A peek into the digital workshop where ideas take shape.",
  keywords: ["experiments", "prototypes", "work in progress", "playground", "dev tools"],
  openGraph: {
    title: "Workbench — DCAT",
    description: "Active experiments, prototypes, and work in progress.",
    url: `${BASE_URL}/workbench`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image-workbench.png`,
        width: 1200,
        height: 630,
        alt: "DCAT Workbench",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workbench — DCAT",
    description: "Active experiments, prototypes, and work in progress.",
    images: [`${BASE_URL}/og-image-workbench.png`],
  },
  alternates: {
    canonical: `${BASE_URL}/workbench`,
  },
};

export default async function WorkbenchPage() {
  const [{ data: repos }, { data: activity }] = await Promise.all([
    getRepos(),
    getRecentActivity()
  ]);
  return (
    <div className="pt-24">
      <WorkbenchPageContent wipItems={repos} activityItems={activity}/>
    </div>
  );
}
