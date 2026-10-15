import type { Metadata } from "next";
import { HubCard } from "@/components/content/cards";
import { JsonLd, PageIntro } from "@/components/content/page-parts";
import { getCityCategories, getIndustryCategories, getTopicCategories, type Category } from "@/lib/data/guides";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Local SEO Services by Industry & City",
  description: "Local SEO guides for plumbers, HVAC companies, dentists, roofers and more, organized by industry, city and topic.",
};

function HubSection({ id, title, intro, items }: { id: string; title: string; intro: string; items: Category[] }) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-ink/60">{intro}</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <HubCard key={c.slug} href={`/local-seo/${c.slug}`} title={c.name} count={c.guides.length} description={c.description} />
        ))}
      </div>
    </section>
  );
}

export default function LocalSeoHubPage() {
  const industries = getIndustryCategories();
  const cities = getCityCategories();
  const topics = getTopicCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageIntro
        eyebrow="Local SEO services"
        title="Local SEO by industry and city"
        intro="Every trade and market we write about, grouped so you can jump from here to a city playbook in a single click."
      />
      <HubSection id="industries" title="By industry" intro="Trades and practices with their own local SEO guides." items={industries} />
      <HubSection id="cities" title="By city" intro="Markets where we publish city-specific playbooks." items={cities} />
      <HubSection id="topics" title="By topic" intro="Reviews, citations, rank tracking and the other building blocks of local SEO." items={topics} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Local SEO guides by industry and city",
          url: `${site.url}/local-seo`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: industries.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, url: `${site.url}/local-seo/${c.slug}` })),
          },
        }}
      />
    </div>
  );
}
