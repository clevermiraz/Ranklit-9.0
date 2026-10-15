import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/content/cards";
import { Breadcrumb, JsonLd, PageIntro } from "@/components/content/page-parts";
import { getAllCategories, getCategory } from "@/lib/data/guides";
import { site } from "@/lib/site";

// Fully prerendered via generateStaticParams; opt out of the dev-only instant-navigation check on `params`.
export const instant = false;

/** One template for every hub category: industries, cities and topics share the /local-seo/<slug> namespace. */
export function generateStaticParams() {
  return getAllCategories().map((c) => ({ industry: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/local-seo/[industry]">): Promise<Metadata> {
  const { industry } = await params;
  const category = getCategory(industry);
  if (!category) return {};
  return { title: category.title, description: category.description, alternates: { canonical: `/local-seo/${category.slug}` } };
}

const eyebrows = { industry: "Industry", city: "City", topic: "Topic" };

export default async function LocalSeoCategoryPage({ params }: PageProps<"/local-seo/[industry]">) {
  const { industry } = await params;
  const category = getCategory(industry);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Local SEO", href: "/local-seo" }, { label: category.name }]} />
      <PageIntro className="mt-6" eyebrow={eyebrows[category.kind]} title={category.title} intro={category.description} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {category.guides.map((g) => (
          <GuideCard key={g.href} href={g.href} title={g.title} />
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.title,
          description: category.description,
          url: `${site.url}/local-seo/${category.slug}`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: category.guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.title, url: `${site.url}${g.href}` })),
          },
        }}
      />
    </div>
  );
}
