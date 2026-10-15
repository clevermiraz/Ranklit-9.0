import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Play, Sparkles } from "lucide-react";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { AgentFeed } from "@/components/home/agent-feed";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { ComparisonTable, FinalCta } from "@/components/marketing/blocks";
import { AccountManager, MeetAgent } from "@/components/marketing/sections";
import { FloatingCta } from "@/components/product/floating-cta";

export const metadata: Metadata = {
  title: { absolute: "Local SEO Software Pricing: Plans From $99/Month | Ranklit" },
  description:
    "Local SEO plans from $99/mo per location: Google Business Profile automation, hand-placed citations, weekly map tracking and a 30-day money-back guarantee. 3-day free trial.",
};

const pricingFaqs = [
  {
    q: "What are scan credits?",
    a: "Credits power your Google Maps rank checks. Every plan includes a fresh allowance each month, and more credits means more scans. You can top up any time from your dashboard.",
  },
  {
    q: "What are premium citations placed by hand?",
    a: "Listings on large, trusted directories that Google pays attention to. Our team places them manually every month — 5 on Foundation, 10 on Growth — and you get the login to each one.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes. Switch plans any time from your dashboard. Upgrades take effect immediately; downgrades start at your next bill.",
  },
  {
    q: "What is AI search tracking?",
    a: "When people ask ChatGPT, Claude, Perplexity or Google's AI for a local business, we check whether you're mentioned and how. It's included with Growth.",
  },
  {
    q: "How does the 30-day guarantee work?",
    a: "If your map rank hasn't improved after 30 days, email us and we'll refund you — no long forms. Google takes a little time to trust new signals, but most customers see a lift sooner.",
  },
  {
    q: "What if I have more than one location?",
    a: "Every plan is priced per location, and Growth gets cheaper at 5 and 15 locations. Set your count at checkout or add locations later from your dashboard. Running an agency? See our agency pricing.",
  },
  {
    q: "Who looks after my account?",
    a: "Every customer has a dedicated account manager — an experienced local SEO specialist who reviews your agent's work and places your premium citations.",
  },
  {
    q: "Do I have to book a call?",
    a: "No. You can book an optional onboarding call with your account manager, or skip it and we'll set everything up for you.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" aria-hidden />
        <div className="absolute -top-32 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-brand-300/30 blur-[120px]" aria-hidden />
        <Container className="relative py-20 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 py-1 pr-3 pl-1 text-[13px] font-medium shadow-card">
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-700 to-night px-2.5 py-1 text-[11px] font-bold tracking-wider text-white">
              <Sparkles className="size-3" /> AI AGENT
            </span>
            Pricing
          </span>
          <h1 className="tracking-display mx-auto mt-6 max-w-3xl text-[40px] leading-[1.03] sm:text-6xl lg:text-[66px]">
            Pick a plan. <span className="text-gradient">Your AI agent does the rest.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/65 sm:text-xl">
            Plans start at $99 a month. No contracts. <strong className="text-ink">Rank higher in 30 days, or get your money back.</strong>
          </p>
          <div id="hero-cta" className="mt-8">
            <ButtonLink href="#plans" size="lg" arrow>
              Choose your plan
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm font-medium text-ink/55">3-day free trial · Cancel anytime · 30-day money-back guarantee</p>
        </Container>
      </section>

      <section id="plans" className="scroll-mt-24 border-t border-black/5 bg-white py-14">
        <Container>
          <PricingPlans showAgencyNote={false} />
          <p className="mt-6 text-center text-xs text-ink/50">
            Pricing is per location. Use the slider above, then set your count at checkout. Run an agency?{" "}
            <Link href="/agencies/pricing" className="font-semibold text-brand-700 hover:underline">
              See agency pricing →
            </Link>
          </p>
          <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
            {["No contracts", "Cancel any time", "30-day money-back guarantee", "Set up in minutes"].map((c) => (
              <li key={c} className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-[15px] font-bold shadow-sm">
                <CheckCircle2 className="size-4 fill-emerald-600 text-white" /> {c}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <MeetAgent
        eyebrow="In every plan"
        title="Every plan comes with"
        highlight="your own AI agent."
        intro="It posts on your Google profile, replies to reviews, gets you listed, and tracks your rank. Every week. You don't lift a finger."
        aside={<AgentFeed />}
      />

      <div id="account-oversight">
        <AccountManager />
      </div>

      <section className="pb-24">
        <Container>
          <SectionHeading
            eyebrow="See the results"
            title="Real wins,"
            highlight="in their Google data."
            intro="A walkthrough of real Google Business Profile numbers — the calls and clicks that came from climbing the map."
          />
          <Reveal className="mx-auto mt-10 max-w-4xl">
            <figure className="relative aspect-video overflow-hidden rounded-3xl border border-black/10 bg-ink shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-[#3b1758] to-night" />
              <div className="bg-grid-dark absolute inset-0" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid size-20 place-items-center rounded-full bg-white/95 text-brand-700 shadow-lift">
                  <Play className="ml-1 size-8 fill-current" />
                </span>
              </div>
              <figcaption className="absolute bottom-5 left-6 text-sm font-semibold text-white/85">Customer results — Business Profile walkthrough</figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="AI agent vs. agency" title="Agency work." highlight="Software price." />
          <Reveal className="mt-12">
            <ComparisonTable />
          </Reveal>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Pricing questions" />
          <Faq items={pricingFaqs} />
        </div>
      </section>

      <FinalCta
        title="Pick your plan."
        highlight="We do the rest."
        text="Rank higher in 30 days or your money back. No contracts. Cancel anytime."
        cta="Choose your plan"
        href="#plans"
        note=""
      />
      <FloatingCta href="#plans" label="Choose your plan" note="3-day free trial. No contracts." />
    </>
  );
}
