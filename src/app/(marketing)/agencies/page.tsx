import type { Metadata } from "next";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/marketing/blocks";
import { AgentFeed } from "@/components/home/agent-feed";
import { CountUp } from "@/components/home/count-up";
import { AgencyHeroShell, AgentPill } from "@/components/agency/hero";
import { IconCardGrid } from "@/components/agency/icon-card";
import { WhiteLabelSection } from "@/components/agency/white-label-section";
import { AgencyCompareTable } from "@/components/agency/compare-table";
import { AgencySteps } from "@/components/agency/steps";
import { AgencyPricing } from "@/components/agency/agency-pricing";
import { FloatCta } from "@/components/agency/float-cta";
import { agencyFaqs, agencyFixes, agencyProblems } from "@/lib/data/agency";
import { homeStats } from "@/lib/data/marketing";

export const metadata: Metadata = {
  title: "Local SEO for Agencies: White-Label, Done-For-You at Scale",
  description:
    "Offer white-label, done-for-you local SEO to every client: hand-built citations, branded dashboards, up to 99 locations, and a 30-day ranking guarantee.",
  alternates: { canonical: "/agencies" },
};

export default function AgenciesPage() {
  return (
    <>
      <Hero />
      <Problem />
      <Fix />
      <WhiteLabelSection />

      <section className="border-t border-black/5 bg-white py-24 sm:py-28">
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="Why partner with us" title="The work other tools" highlight="leave on your desk." className="max-w-4xl" />
          <Reveal className="mt-12">
            <AgencyCompareTable />
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-black/5 bg-white py-12">
        <Container className="grid gap-10 text-center sm:grid-cols-3">
          {homeStats.map((s) => (
            <div key={s.label}>
              <p className="bg-gradient-to-br from-brand-700 to-ink bg-clip-text text-5xl font-extrabold tracking-[-0.03em] text-transparent sm:text-[54px]">
                <CountUp value={s.value} suffix="+" />
              </p>
              <p className="mt-2 text-[15px] font-medium text-ink/55">{s.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="How it works" title="Resell results" highlight="in four steps." />
          <AgencySteps />
        </Container>
      </section>

      <section id="pricing" className="scroll-mt-20 border-t border-black/5 bg-white py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Agency pricing"
            title="Scale with"
            highlight="your client base."
            intro="Each plan covers one client location, from $99/mo. Choose how many locations at checkout. You set your own price and keep the margin."
            className="max-w-2xl"
          />
          <AgencyPricing footer="more" />
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Agency questions" />
          <Faq items={agencyFaqs} footer={false} />
        </div>
      </section>

      <div id="final-cta">
        <FinalCta
          title="Add local SEO to your agency."
          highlight="Start today."
          text="Done-for-you work, listings by hand, white-label reports, and a guarantee you can resell."
          cta="See plans"
          href="#pricing"
          note="Up to 99 locations · White-label · Cancel anytime"
        />
      </div>

      <FloatCta
        href="#pricing"
        label="See agency plans"
        note="Up to 99 client locations. Cancel anytime."
        afterId="agency-hero-cta"
        hideIds={["pricing", "final-cta"]}
      />
    </>
  );
}

function Hero() {
  return (
    <AgencyHeroShell>
      <Container className="grid grid-cols-1 items-center gap-16 pt-12 pb-20 text-center lg:grid-cols-[1.05fr_0.95fr] lg:pt-16 lg:pb-28 lg:text-left">
        <div>
          <AgentPill>For agencies</AgentPill>
          <h1 className="tracking-display animate-fade-up mt-6 text-[40px] leading-[1.02] [animation-delay:80ms] sm:text-6xl lg:text-[66px]">
            Local SEO for every client. <span className="text-gradient">Done by AI, under your brand.</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/65 [animation-delay:160ms] sm:text-xl lg:mx-0">
            Add local SEO to your agency without hiring a team. An AI agent handles the work for each client, and our team
            places the top listings by hand. <strong className="font-bold text-ink">Your logo is on everything.</strong>
          </p>
          <div
            id="agency-hero-cta"
            className="animate-fade-up mt-9 flex flex-col items-center gap-3 [animation-delay:240ms] sm:flex-row sm:justify-center lg:justify-start"
          >
            <ButtonLink href="#pricing" size="lg" arrow>
              See plans
            </ButtonLink>
            <ButtonLink href="/agencies/pricing" variant="secondary" size="lg">
              Compare features
            </ButtonLink>
          </div>
          <p className="animate-fade-up mt-5 text-sm font-medium text-ink/55 [animation-delay:300ms]">
            Up to 99 client locations · White-label · Cancel anytime
          </p>
        </div>
        <div className="mx-auto w-full max-w-[520px] text-left lg:mr-0">
          <AgentFeed />
        </div>
      </Container>
    </AgencyHeroShell>
  );
}

function Problem() {
  return (
    <section className="border-t border-black/5 bg-white py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow="The problem" title="Local SEO is hard to sell" highlight="at a profit." className="max-w-4xl" />
        <IconCardGrid cards={agencyProblems} className="mt-12 md:grid-cols-3" />
      </Container>
    </section>
  );
}

function Fix() {
  return (
    <section className="relative overflow-hidden bg-night py-24 sm:py-28">
      <div className="bg-grid-dark absolute inset-0" aria-hidden />
      <div
        className="absolute top-1/2 right-0 h-[620px] w-[720px] -translate-y-1/3 translate-x-1/4"
        style={{ background: "radial-gradient(closest-side, rgba(141,62,187,.45), transparent)" }}
        aria-hidden
      />
      <Container className="relative">
        <SectionHeading
          dark
          eyebrow="The fix"
          title="One AI agent"
          highlight="for every client."
          intro="It handles the weekly local SEO work for each client. You keep the relationship and the margin."
          className="[&>p]:mx-auto [&>p]:max-w-xl"
        />
        <IconCardGrid cards={agencyFixes} dark className="mt-12 sm:grid-cols-2" />
      </Container>
    </section>
  );
}
