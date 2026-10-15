import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostGrid } from "@/components/content/cards";
import { Breadcrumb, PageIntro } from "@/components/content/page-parts";
import { getAllTags, getPostsByTag, getTag } from "@/lib/data/blog";

// Fully prerendered via generateStaticParams; opt out of the dev-only instant-navigation check on `params`.
export const instant = false;

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const found = getTag(tag);
  if (!found) return {};
  return {
    title: `Articles tagged “${found.label}”`,
    description: `Ranklit blog posts about ${found.label}: practical local SEO guides for small businesses and agencies.`,
  };
}

export default async function BlogTagPage({ params }: PageProps<"/blog/tag/[tag]">) {
  const { tag } = await params;
  const found = getTag(tag);
  if (!found) notFound();
  const posts = getPostsByTag(tag);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: found.label }]} />
      <PageIntro
        className="mt-6"
        eyebrow="Tag"
        title={found.label.charAt(0).toUpperCase() + found.label.slice(1)}
        intro={`${posts.length} ${posts.length === 1 ? "article" : "articles"} about ${found.label}, newest first.`}
      />
      <PostGrid posts={posts} />
    </div>
  );
}
