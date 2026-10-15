import type { Metadata } from "next";
import clsx from "clsx";
import { Sparkles } from "lucide-react";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { AgentFeed } from "@/components/home/agent-feed";
import { ComparisonTable, FinalCta } from "@/components/marketing/blocks";
import { FeatureTile } from "@/components/product/feature-mockups";
import { FloatingCta } from "@/components/product/floating-cta";
import { CheckLine, HeroBackdrop, HeroPill, TextLink } from "@/components/product/page-bits";
import { featureRows } from "@/lib/data/features";
import { site, trialHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Local SEO Software | GBP, Reviews, Citations & Rank Tracking",
  description:
    "Put local SEO on autopilot: Google Business Profile posts, review generation, 500+ citations placed for you, Google Maps heat-map tracking, and AI visibility. Plans from $99/mo.",
  alternates: { canonical: "/features" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  publisher: { "@type": "Organization", name: `${site.name} Inc.` },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: 99,
    priceCurrency: "USD",
    offers: [
      { "@type": "Offer", name: "Foundation — done-for-you local SEO", price: 99, priceCurrency: "USD", url: "/pricing" },
      { "@type": "Offer", name: "Growth — done-for-you local SEO", price: 199, priceCurrency: "USD", url: "/pricing" },
    ],
  },
};

export default function FeaturesPage() {
  return (
    <>
      <Hero />
      <FeatureRows />
      <section className="border-t border-black/5 bg-canvas py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading eyebrow="One subscription" title="The whole agency stack." highlight="One AI agent." className="max-w-4xl" />
          <Reveal className="mt-12">
            <ComparisonTable />
          </Reveal>
        </div>
      </section>
      <FinalCta
        title="Let your AI agent"
        highlight="do the work."
        text="Plans from $99/mo. Climb the map in 30 days or get your money back."
        cta="See plans & pricing"
        href="/pricing"
      />
      <FloatingCta href="/pricing" label="See plans" note="3-day free trial. No contracts." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-black/5">
      <HeroBackdrop />
      <Container className="relative grid grid-cols-1 items-center gap-14 pt-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-16 lg:pb-28">
        <div className="text-center lg:text-left">
          <div className="animate-fade-up">
            <HeroPill icon={Sparkles} tag="AI agent">
              Features
            </HeroPill>
          </div>
          <h1 className="tracking-display animate-fade-up mt-6 text-[40px] leading-[1.02] [animation-delay:80ms] sm:text-6xl lg:text-[66px]">
            Everything you need to rank on <span className="text-gradient">Google Maps.</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink/65 [animation-delay:160ms] sm:text-xl sm:leading-8 lg:mx-0">
            One AI agent handles your entire local SEO. Here is what it does for you, <strong className="font-bold text-ink">every week.</strong>
          </p>
          <div id="hero-cta" className="animate-fade-up mt-9 flex flex-col items-center gap-3 [animation-delay:240ms] sm:flex-row sm:justify-center lg:justify-start">
            <ButtonLink href={trialHref()} size="lg" arrow className="w-full sm:w-auto">
              Start your 3-day free trial
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary" size="lg">
              See pricing
            </ButtonLink>
          </div>
          <p className="animate-fade-up mt-6 text-sm font-medium text-ink/55 [animation-delay:300ms]">
            From $99/mo · Cancel anytime · 30-day money-back guarantee
          </p>
        </div>
        <div className="mx-auto w-full max-w-[490px] lg:mr-0">
          <AgentFeed />
        </div>
      </Container>
    </section>
  );
}

function FeatureRows() {
  return (
    <section className="bg-white">
      <Container className="space-y-24 py-24 sm:py-28 lg:space-y-28">
        {featureRows.map((row, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={row.id} id={row.id} className="grid scroll-mt-24 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={clsx("text-center lg:text-left", flip && "lg:order-2")}>
                <Eyebrow>{row.eyebrow}</Eyebrow>
                <h2 className="tracking-display mt-4 text-[34px] leading-[1.06] sm:text-5xl lg:text-[52px]">{row.title}</h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/65 lg:mx-0">{row.text}</p>
                <CheckLine className="mt-6 justify-center text-left lg:justify-start">{row.check}</CheckLine>
                {row.note && <p className="mt-3 text-sm font-medium text-ink/50">{row.note}</p>}
                <TextLink href={row.link.href} className="mt-6">
                  {row.link.label}
                </TextLink>
              </Reveal>
              <FeatureTile viz={row.viz} className={clsx(flip && "lg:order-1")} />
            </div>
          );
        })}
      </Container>
    </section>
  );
}
