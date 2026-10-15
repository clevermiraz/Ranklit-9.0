import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyNote, getCaseStudy } from "@/lib/data/case-studies";
import { site } from "@/lib/site";
import { CaseMeta, GradientCta, RichText } from "../parts";

// Every slug is prerendered; unknown slugs must block so they can return a real 404.
export const instant = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.seoTitle,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    url: `${site.url}/case-studies/${study.slug}`,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/case-studies" className="text-sm font-medium text-ink/50 hover:text-ink">
        ← All case studies
      </Link>

      <header className="mt-6">
        <CaseMeta study={study} />
        <h1 className="mt-3 text-3xl leading-10 font-bold tracking-tight text-wrap sm:text-4xl">{study.title}</h1>
        <p className="mt-4 text-lg text-ink/65">{study.summary}</p>
      </header>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-black/5 bg-black/5 sm:grid-cols-3">
        {study.stats.map((s) => (
          <div key={s.label} className="flex flex-col bg-white p-6 text-center">
            <dt className="text-sm font-medium text-ink/55">{s.label}</dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="prose-ranklit mt-12 [&_h2]:mt-14 [&_h2]:mb-6 [&_p]:leading-8 [&_p]:text-ink/80">
        {study.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>
              <RichText text={section.text} />
            </p>
          </section>
        ))}
        <blockquote className="mt-8 border-l-4 border-brand-700 pl-[18px] text-lg leading-8 font-medium text-ink italic">
          {caseStudyNote}
        </blockquote>
      </div>

      <blockquote className="mt-12 rounded-3xl bg-[#fcdffe]/40 p-8">
        <p className="text-xl leading-relaxed font-medium">“{study.quote.text}”</p>
        <footer className="mt-4 text-sm font-semibold text-ink/60">
          {study.quote.author} <span className="text-ink/30">—</span> {study.quote.role}
        </footer>
      </blockquote>

      <GradientCta
        className="mt-12"
        title={<h2 className="text-2xl font-bold text-white">Want results like this?</h2>}
        text="It comes from the same playbook we run for every customer: profile optimization, monthly citations, and ranking reports."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
