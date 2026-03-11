import { BlogHero } from "@app/lab/components/public/blog/blog-hero";
import { BlogList } from "@app/lab/components/public/blog/blog-list";
import { BlogSidebar } from "@app/lab/components/public/blog/blog-sidebar";
import { BASE_URL } from "@app/lab/lib/config/env";
import { getBlogPosts } from "@feature/lab-client/server";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles, experiments, and insights from the digital laboratory. Exploring systems programming, web development, AI, and more.",
  openGraph: {
    title: "Blog — DCAT",
    description: "Technical articles, experiments, and insights from the digital laboratory.",
    url: `${BASE_URL}/blog`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image-blog.png`,
        width: 1200,
        height: 630,
        alt: "DCAT Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — DCAT",
    description: "Technical articles, experiments, and insights from the digital laboratory.",
    images: [`${BASE_URL}/og-image-blog.png`],
  },
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
};

export default async function BlogPage() {
  const { data: blogs } = await getBlogPosts();
  return (
    <div>
      <BlogHero />
      <section className="px-4 sm:px-6 py-16 sm:py-20 border-t border-border/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <BlogList blogPosts={blogs}/>
            <BlogSidebar blogPosts={blogs} />
          </div>
        </div>
      </section>
    </div>
  );
}
