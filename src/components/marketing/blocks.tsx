import Link from "next/link";
import { ArrowRight, Bot, Check, X } from "lucide-react";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { comparisonRows } from "@/lib/data/marketing";
import { industries } from "@/lib/data/industries";
import { trialHref } from "@/lib/site";

export function FinalCta({
  title = "Put your AI agent",
  highlight = "to work today.",
  text = "Plans from $99/mo. Rank higher in 30 days or get your money back.",
  cta = "Start your 3-day free trial",
  href = trialHref(),
  note = "3-day free trial · No contracts · Cancel anytime",
}: {
  title?: string;
  highlight?: string;
  text?: string;
  cta?: string;
  href?: string;
  note?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-night py-24 text-center sm:py-32">
      <div className="bg-grid-dark absolute inset-0" aria-hidden />
      <div className="absolute top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-700/40 blur-[120px]" aria-hidden />
      <Container className="relative">
        <Reveal>
          <h2 className="tracking-display mx-auto max-w-3xl text-5xl leading-[1.02] text-white sm:text-[66px]">
            {title} <span className="text-gradient-light">{highlight}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/70">{text}</p>
          <ButtonLink href={href} variant="white" size="lg" arrow className="mt-9">
            {cta}
          </ButtonLink>
          {note && <p className="mt-5 text-sm text-white/55">{note}</p>}
        </Reveal>
      </Container>
    </section>
  );
}

export function AgencyBanner() {
  return (
    <Container className="py-12">
      <Reveal className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-[32px] border border-brand-200/60 bg-gradient-to-br from-brand-100/70 via-white to-brand-100/60 px-8 py-12 text-center shadow-card sm:px-12 md:flex-row md:text-left">
        <div>
          <h2 className="tracking-display text-3xl sm:text-4xl">Run an agency?</h2>
          <p className="mt-2 text-lg text-ink/65">Give every client their own AI agent, under your brand and on your domain.</p>
        </div>
        <ButtonLink href="/agencies" arrow size="lg" className="shrink-0">
          See agency features
        </ButtonLink>
      </Reveal>
    </Container>
  );
}

export function ComparisonTable() {
  return (
    <div className="mx-auto max-w-[848px] overflow-hidden rounded-3xl border border-ink/[0.08] bg-white shadow-card">
      <div className="grid grid-cols-2 text-[15px] sm:grid-cols-[1fr_1.2fr_1.1fr]">
        <div className="hidden sm:block" />
        <div className="flex items-center gap-2 bg-gradient-to-r from-brand-700 to-night px-4 py-4 font-bold tracking-wide text-white uppercase sm:px-5">
          <Bot className="size-5" /> Ranklit
        </div>
        <div className="px-4 py-4 font-bold tracking-wide text-ink/50 uppercase sm:px-5">Typical agency</div>
        {comparisonRows.map((row) => (
          <div key={row.label} className="contents">
            {/* On mobile the label spans both columns above its two values. */}
            <div className="col-span-2 flex items-center border-t border-ink/[0.06] px-4 pt-4 text-xs font-bold tracking-[0.1em] text-ink/50 uppercase sm:col-span-1 sm:px-5 sm:py-4">
              {row.label}
            </div>
            <div className="flex items-center gap-2.5 bg-brand-50/80 px-4 py-3 font-bold sm:border-t sm:border-brand-100 sm:px-5 sm:py-4">
              <Check className="size-4 shrink-0 text-emerald-600" /> {row.us}
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 text-ink/55 sm:border-t sm:border-ink/[0.06] sm:px-5 sm:py-4">
              <X className="size-3.5 shrink-0 text-rose-400" /> {row.them}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IndustryGuides({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className="bg-white py-24">
      <Container>
        {withHeading && (
          <SectionHeading
            eyebrow="Local SEO services"
            title="Local SEO for your"
            highlight="trade and city"
            intro="Guides for the businesses we help every day, like plumbers, HVAC, dentists, and roofers. Sorted by city."
          />
        )}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 40}>
              <Link
                href={`/local-seo/${ind.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-lg font-bold transition-colors group-hover:text-brand-700">{ind.name}</span>
                  <span className="shrink-0 text-xs text-ink/50">{ind.cities.length} guides</span>
                </span>
                <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">{ind.description}</span>
                <span className="mt-auto flex items-center gap-1.5 pt-5 text-[15px] font-semibold text-brand-700">
                  View guides <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-12 text-center">
          <Link href="/local-seo" className="inline-flex items-center gap-2 text-lg font-bold text-brand-700 hover:underline">
            Browse all industries and cities <ArrowRight className="size-5" />
          </Link>
        </p>
      </Container>
    </section>
  );
}
