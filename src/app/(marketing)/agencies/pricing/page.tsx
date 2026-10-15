import type { Metadata } from "next";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/marketing/blocks";
import { AgencyHeroShell, AgentPill } from "@/components/agency/hero";
import { IconCardGrid } from "@/components/agency/icon-card";
import { AgencyCompareTable } from "@/components/agency/compare-table";
import { AgencyPricing } from "@/components/agency/agency-pricing";
import { FloatCta } from "@/components/agency/float-cta";
import { agencyPricingFaqs, agencyValueCards } from "@/lib/data/agency";

export const metadata: Metadata = {
  title: "Agency Pricing: White-Label Local SEO for Up to 99 Locations",
  description:
    "Resell done-for-you local SEO under your own brand from $99/mo per location, with hand-built citations, white-label reporting, and a 30-day ranking guarantee.",
  alternates: { canonical: "/agencies/pricing" },
};

export default function AgencyPricingPage() {
  return (
    <>
      <AgencyHeroShell>
        <Container className="pt-12 pb-20 text-center lg:pt-16 lg:pb-28">
          <AgentPill>Agency pricing</AgentPill>
          <h1 className="tracking-display animate-fade-up mx-auto mt-6 max-w-3xl text-[40px] leading-[1.02] [animation-delay:80ms] sm:text-6xl lg:text-[66px]">
            Resell local SEO. <span className="text-gradient">Keep the margin.</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/65 [animation-delay:160ms] sm:text-xl">
            Give every client an AI agent for their Google profile. Pricing grows with you, up to 99 client locations.{" "}
            <strong className="font-bold text-ink">Your brand on everything.</strong>
          </p>
          <div
            id="agency-pricing-hero-cta"
            className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 [animation-delay:240ms] sm:flex-row"
          >
            <ButtonLink href="#plans" size="lg" arrow>
              Choose a plan
            </ButtonLink>
            <ButtonLink href="/agencies" variant="secondary" size="lg">
              See agency features
            </ButtonLink>
          </div>
          <p className="animate-fade-up mt-5 text-sm font-medium text-ink/55 [animation-delay:300ms]">
            Up to 99 locations · White-label · Cancel anytime
          </p>
        </Container>
      </AgencyHeroShell>

      <section id="plans" className="scroll-mt-20 border-t border-black/5 bg-white pt-16 pb-14">
        <Container>
          <SectionHeading
            eyebrow="Plans"
            title="Per-client pricing"
            highlight="that scales."
            intro="Each plan covers one client location. Pick a plan, then choose how many locations at checkout. The total updates as you go."
            className="max-w-2xl"
          />
          <AgencyPricing footer="standard" />
        </Container>
      </section>

      <section className="py-20" aria-label="Why partner with us">
        <Container>
          <IconCardGrid cards={agencyValueCards} className="md:grid-cols-3" />
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white py-24 sm:py-28">
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="Why partner with us" title="The work other tools" highlight="leave on your desk." className="max-w-4xl" />
          <Reveal className="mt-12">
            <AgencyCompareTable />
          </Reveal>
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Agency questions" />
          <Faq items={agencyPricingFaqs} footer={false} />
        </div>
      </section>

      <div id="final-cta">
        <FinalCta
          title="Add local SEO to your agency."
          highlight="Start today."
          text="Done-for-you work, listings by hand, white-label reports, and a guarantee you can resell."
          cta="Choose a plan"
          href="#plans"
          note=""
        />
      </div>

      <FloatCta
        href="#plans"
        label="Choose a plan"
        note="Up to 99 client locations. Cancel anytime."
        afterId="agency-pricing-hero-cta"
        hideIds={["plans", "final-cta"]}
      />
    </>
  );
}
