import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBlocks } from "@/components/content/article-blocks";
import { GuideCard } from "@/components/content/cards";
import { Breadcrumb, JsonLd } from "@/components/content/page-parts";
import { cityLabel, getAllGuideParams, getCityGuide } from "@/lib/data/guides";
import { site } from "@/lib/site";

// Fully prerendered via generateStaticParams; opt out of the dev-only instant-navigation check on `params`.
export const instant = false;

export function generateStaticParams() {
  return getAllGuideParams();
}

export async function generateMetadata({ params }: PageProps<"/local-seo/[industry]/[city]">): Promise<Metadata> {
  const { industry, city } = await params;
  const guide = getCityGuide(industry, city);
  if (!guide) return {};
  return {
    title: { absolute: guide.title },
    description: guide.description,
    alternates: { canonical: `/local-seo/${industry}/${city}` },
    openGraph: { type: "article", title: guide.title, description: guide.description },
  };
}

export default async function CityGuidePage({ params }: PageProps<"/local-seo/[industry]/[city]">) {
  const { industry: industrySlug, city: citySlug } = await params;
  const guide = getCityGuide(industrySlug, citySlug);
  if (!guide) notFound();

  const { industry, city, scan } = guide;
  const url = `${site.url}/local-seo/${industry.slug}/${city.slug}`;
  const moreLink = "font-semibold text-brand-700 hover:underline";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Local SEO", href: "/local-seo" },
          { label: industry.name, href: `/local-seo/${industry.slug}` },
        ]}
      />
      <h1 className="mb-6 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">{guide.title}</h1>

      <div className="[&>h2:first-child]:mt-0">
        <ArticleBlocks blocks={guide.blocks} />
      </div>

      <section className="mt-16 border-t border-black/5 pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Related local SEO guides</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {guide.related.map((g) => (
            <GuideCard key={g.href} href={g.href} title={g.title} />
          ))}
        </div>
        <p className="mt-6 text-sm text-ink/60">
          More in{" "}
          <Link href={`/local-seo/${industry.slug}`} className={moreLink}>
            {industry.name}
          </Link>{" "}
          and{" "}
          <Link href={`/local-seo/${city.slug}`} className={moreLink}>
            {cityLabel(city)}
          </Link>
          .
        </p>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          url,
          mainEntityOfPage: url,
          datePublished: "2026-06-10",
          dateModified: "2026-10-01",
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Top ${industry.name} ranking in ${city.name}`,
          itemListElement: scan.top.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name })),
        }}
      />
    </article>
  );
}
