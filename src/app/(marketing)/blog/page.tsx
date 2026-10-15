import type { Metadata } from "next";
import { FeaturedPostCard, PostGrid } from "@/components/content/cards";
import { PageIntro } from "@/components/content/page-parts";
import { getAllPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Local SEO Blog: Guides, Tools and Strategies",
  description: "Practical local SEO guides for small business owners: Google Maps rankings, reviews, citations and the tools that actually move the needle.",
};

export default function BlogIndexPage() {
  const [featured, ...rest] = getAllPosts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageIntro
        eyebrow="Blog"
        title="Local SEO guides & playbooks"
        intro="How-tos, comparisons and strategies for busy owners who want more calls from Google Maps."
      />
      {featured && <FeaturedPostCard post={featured} />}
      <PostGrid posts={rest} />
    </div>
  );
}
