import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/data/case-studies";
import { site } from "@/lib/site";
import { CaseMeta, GradientCta } from "./parts";

export const metadata: Metadata = {
  title: "Local SEO Case Studies: Google Maps Ranking Results",
  description:
    "See how local businesses climb the Google Maps local pack with Ranklit and turn that visibility into more calls and website clicks, by industry.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ranklit case studies",
    url: `${site.url}/case-studies`,
    hasPart: caseStudies.map((c) => ({ "@type": "Article", headline: c.title, url: `${site.url}/case-studies/${c.slug}` })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">Case studies</p>
        <h1 className="mt-2 text-4xl leading-none font-bold tracking-tight text-wrap sm:text-5xl">Results local businesses can expect</h1>
        <p className="mt-4 text-lg leading-7 text-ink/65">
          How local businesses climb with Ranklit, measured with Google Business Profile performance data and our
          geo-grid rank scans. The studies below are illustrative samples, grouped by industry and region.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            className="group flex flex-col rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <CaseMeta study={study} />
            <p className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{study.headlineMetric}</p>
            <p className="mt-1 text-sm font-medium text-ink/55">{study.headlineCaption}</p>
            <h2 className="mt-5 text-xl leading-snug font-semibold text-wrap transition-colors group-hover:text-brand-700">{study.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-ink/60">{study.summary}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
              View case study
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink/45">
        These are sample case studies. The businesses are fictional composites, and the figures illustrate the kind of
        Google Business Profile and geo-grid data your Ranklit dashboard reports.
      </p>

      <GradientCta
        className="mt-16 sm:p-12"
        title={<h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl">Want results like these for your business?</h2>}
        text="Each of these wins follows the same playbook we run for you: Google Business Profile optimization, monthly citations, and ranking reports."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
