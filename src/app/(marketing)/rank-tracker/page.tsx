import type { Metadata } from "next";
import clsx from "clsx";
import { BarChart3, LayoutGrid, MapPin, RotateCcw, ShieldCheck, type LucideIcon } from "lucide-react";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/marketing/blocks";
import { ScanDemo } from "@/components/product/scan-demo";
import { FloatingCta } from "@/components/product/floating-cta";
import { GreenCheck } from "@/components/product/feature-mockups";
import { HeroBackdrop, HeroPill } from "@/components/product/page-bits";
import { rankFaqs, rankFeatures, rankSteps, rankTrackerSignupHref, type RankFeatureIcon } from "@/lib/data/features";

export const metadata: Metadata = {
  title: { absolute: "Google Maps Rank Tracker | Local Rank Grid Scans | Ranklit Grid" },
  description:
    "Track your Google Maps rankings with weekly geo-grid scans. See your position at every point in your service area, schedule recurring scans, and send white-label reports.",
  alternates: { canonical: "/rank-tracker" },
};

const icons: Record<RankFeatureIcon, { icon: LucideIcon; tone: string }> = {
  grid: { icon: LayoutGrid, tone: "bg-[rgba(200,168,245,.22)] text-brand-700" },
  repeat: { icon: RotateCcw, tone: "bg-brand-100 text-brand-700" },
  chart: { icon: BarChart3, tone: "bg-emerald-100/70 text-emerald-600" },
  shield: { icon: ShieldCheck, tone: "bg-amber-100/80 text-amber-600" },
  pin: { icon: MapPin, tone: "bg-pink-100 text-pink-600" },
};

const note = "Weekly rank scans · By the Ranklit team";

export default function RankTrackerPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <section className="bg-canvas py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Features" title="Everything you need" highlight="to track local rank." className="max-w-4xl" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rankFeatures.map((f, i) => {
              const { icon: Icon, tone } = icons[f.icon];
              return (
                <Reveal key={f.title} delay={(i % 3) * 80}>
                  <div className="h-full rounded-3xl border border-ink/[0.08] bg-white p-[26px] shadow-[0_1px_2px_rgba(35,25,56,.05),0_12px_32px_-12px_rgba(35,25,56,.16)]">
                    <span className={clsx("grid size-[42px] place-items-center rounded-[13px]", tone)}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 text-xl tracking-tight">{f.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink/65">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
      <Band />
      <section className="border-t border-black/5 bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Rank tracker questions" />
          <Faq items={rankFaqs} footer={false} />
        </div>
      </section>
      <FinalCta
        title="See where you really rank."
        highlight="Track it weekly."
        text="Stop guessing. Run a grid scan and see your Google Maps rank from every direction."
        cta="Try Ranklit Grid"
        href={rankTrackerSignupHref}
        note={note}
      />
      <FloatingCta href={rankTrackerSignupHref} label="Try Ranklit Grid" note="Weekly rank scans. By the Ranklit team." />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-black/5">
      <HeroBackdrop />
      <Container className="relative grid grid-cols-1 items-center gap-12 pt-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-16 lg:pb-28">
        <div className="text-center lg:text-left">
          <div className="animate-fade-up">
            <HeroPill icon={MapPin} tag="Ranklit Grid">
              by the Ranklit team
            </HeroPill>
          </div>
          <h1 className="tracking-display animate-fade-up mt-6 text-[40px] leading-[1.02] [animation-delay:80ms] sm:text-6xl lg:text-[66px] lg:[text-wrap:wrap]">
            Google Maps <span className="text-gradient">rank tracker.</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink/65 [animation-delay:160ms] sm:text-xl sm:leading-8 lg:mx-0">
            Check your Google Maps rank from a grid of points across your area, not from a single spot.{" "}
            <strong className="font-bold text-ink">Watch the map turn green.</strong>
          </p>
          <div id="hero-cta" className="animate-fade-up mt-9 flex flex-col items-center gap-3 [animation-delay:240ms] sm:flex-row sm:justify-center lg:justify-start">
            <ButtonLink href={rankTrackerSignupHref} size="lg" arrow className="w-full sm:w-auto">
              Try Ranklit Grid
            </ButtonLink>
            <ButtonLink href="/features" variant="secondary" size="lg">
              All features
            </ButtonLink>
          </div>
          <p className="animate-fade-up mt-6 text-sm font-medium text-ink/55 [animation-delay:300ms]">{note}</p>
        </div>
        <div className="mx-auto w-full max-w-[480px] lg:mr-0">
          <ScanDemo />
        </div>
      </Container>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="The whole map,"
          highlight="not one spot."
          intro="Most rank trackers check from one location. Ranklit Grid checks from a whole grid, so you see where you win and where you don't."
          className="[&>p]:mx-auto [&>p]:max-w-xl [&>p]:text-ink/60"
        />
        <ol className="relative mx-auto mt-16 grid max-w-[976px] gap-12 md:grid-cols-3 md:gap-6">
          <span
            className="absolute top-7 right-[16.66%] left-[16.66%] hidden h-0.5 bg-[linear-gradient(90deg,#c8a8f5,#8d3ebb)] md:block"
            aria-hidden
          />
          {rankSteps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <li className="relative text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-[linear-gradient(135deg,#8d3ebb,#231938)] text-[22px] font-extrabold text-white shadow-[0_0_0_6px_#f9f7fc,0_12px_24px_-10px_rgba(141,62,187,.7)]">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-[22px] tracking-tight">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[260px] leading-relaxed text-ink/65">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Band() {
  return (
    <section className="bg-canvas px-4 pb-20">
      <Reveal className="mx-auto max-w-4xl rounded-[32px] border border-brand-700/[0.18] bg-white bg-[radial-gradient(120%_140%_at_0_0,rgba(252,223,254,.9),transparent_55%),radial-gradient(120%_140%_at_100%_100%,rgba(200,168,245,.45),transparent_55%)] px-6 py-12 text-center shadow-[0_1px_2px_rgba(35,25,56,.05),0_12px_32px_-12px_rgba(35,25,56,.16)] sm:px-12 sm:py-14">
        <span className="mx-auto grid size-14 place-items-center rounded-[18px] bg-[linear-gradient(135deg,#8d3ebb,#231938)] text-white shadow-brand">
          <MapPin className="size-6" aria-hidden />
        </span>
        <h2 className="tracking-display mt-6 text-3xl leading-tight sm:text-4xl">
          Ranklit Grid: the rank tracker <span className="text-gradient">made for local SEO.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink/65">
          It runs the same grid scans our AI agent relies on. Anyone can use it by itself to follow their Google Maps rank.
        </p>
        <ButtonLink href={rankTrackerSignupHref} size="lg" arrow className="mt-8">
          Try Ranklit Grid
        </ButtonLink>
        <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
          {["Weekly rank scans", "Built by Ranklit", "White-label reports"].map((c) => (
            <li key={c} className="flex items-center gap-2 rounded-full border border-ink/[0.08] bg-white py-2 pr-4 pl-2.5 text-[15px] font-bold">
              <GreenCheck className="size-5" /> {c}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
