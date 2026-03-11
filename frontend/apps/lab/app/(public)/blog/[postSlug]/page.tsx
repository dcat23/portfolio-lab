import { notFound } from "next/navigation";
import { BlogPostContent } from "@app/lab/components/public/blog/blog-post-content";
import { Footer } from "@app/lab/components/footer";
// import { generateBlogPostStructuredData } from "@/lib/structured-data";
import type { Metadata } from "next";
import { getBlogPosts, getPostBySlug } from "@feature/lab-client/server";

interface BlogPostPageProps {
  params: Promise<{ postSlug: string }>;
}

export async function generateStaticParams() {
  const { data } = await getBlogPosts()
  return data.map((post) => ({
    postSlug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { postSlug } = await params;
  const { success, data: post } = await getPostBySlug(postSlug);

  if (!success) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lab.catuns.xyz';
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const ogImageUrl = `${baseUrl}/og-images/${post.slug}.png`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    keywords: post.tags,
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
      creator: "@devincatuns",
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { postSlug } = await params;
  const { success, data } = await getPostBySlug(postSlug);

  if (!success) {
    notFound();
  }

  // const structuredData = generateBlogPostStructuredData(post, BASE_URL);

  return (
    <>
      <script
        type="application/ld+json"
        // dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <BlogPostContent post={data} />
      </div>
    </>
  );
}
