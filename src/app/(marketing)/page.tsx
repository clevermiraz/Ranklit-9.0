import Link from "next/link";
import { ArrowRight, CheckCircle2, Play, Search, Sparkles } from "lucide-react";
import { ButtonLink, Container, SectionHeading, Stars } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { AgentFeed } from "@/components/home/agent-feed";
import { CountUp } from "@/components/home/count-up";
import { ScanShowcase } from "@/components/home/scan-showcase";
import { RankLegend } from "@/components/rank-grid";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { Faq } from "@/components/faq";
import { FloatingCta } from "@/components/product/floating-cta";
import { AgencyBanner, ComparisonTable, FinalCta, IndustryGuides } from "@/components/marketing/blocks";
import { AccountManager, MeetAgent } from "@/components/marketing/sections";
import { callResults, directories, homeFaqs, homeStats } from "@/lib/data/marketing";
import { trialHref } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <MeetAgent />
      <AccountManager />
      <RealResults />
      <WhatAgentDoes />
      <HowItWorks />
      <section className="bg-white py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="AI agent vs. agency" title="Agency work." highlight="Software price." />
          <Reveal className="mt-12">
            <ComparisonTable />
          </Reveal>
        </Container>
      </section>
      <section id="pricing" className="scroll-mt-20 py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Agency results."
            highlight="Without the agency bill."
            intro="Agencies charge $1,500 to $3,000 a month. Plans start at $99. No contracts."
            className="max-w-4xl"
          />
          <div className="mt-12">
            <PricingPlans />
          </div>
        </Container>
        <AgencyBanner />
      </section>
      <IndustryGuides />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Questions?" />
          <Faq items={homeFaqs} />
        </div>
      </section>
      <FinalCta />
      <FloatingCta href="#pricing" label="Start your free trial" note="3-day free trial. No contracts." />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
      <div className="absolute -top-40 left-[15%] size-[520px] rounded-full bg-brand-300/30 blur-[110px]" aria-hidden />
      <div className="absolute -top-20 right-0 size-[420px] rounded-full bg-fuchsia-200/40 blur-[110px]" aria-hidden />
      <Container className="relative grid grid-cols-1 items-center gap-14 pt-14 pb-20 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:pb-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 py-1 pr-3 pl-1 text-[13px] font-medium shadow-card">
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-700 to-night px-2.5 py-1 text-[11px] font-bold tracking-wider text-white">
              <Sparkles className="size-3" /> AI AGENT
            </span>
            Local SEO for Google Maps
          </span>
          <h1 className="tracking-display mt-6 [text-wrap:pretty] text-[44px] leading-[1.02] sm:text-6xl lg:text-[66px]">
            The AI agent that ranks you on <span className="text-gradient">Google Maps.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/65 sm:text-xl sm:leading-8">
            It works on your Google Business Profile every week. It posts, answers reviews, gets you listed, and tracks
            your rank. <strong className="font-bold text-ink">You get more calls.</strong>
          </p>
          <div id="hero-cta" className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={trialHref()} size="lg" arrow>
              Start your 3-day free trial
            </ButtonLink>
            <ButtonLink href="#pricing" variant="secondary" size="lg">
              See plans
            </ButtonLink>
          </div>
          <p className="mt-6 text-[15px] text-ink/60">From $99/mo · Cancel anytime · 30-day money-back guarantee</p>
          <p className="mt-4 flex items-center gap-2.5 text-[15px]">
            <Stars />
            <strong className="font-bold">4.9/5</strong>
            <span className="text-ink/55">from 500+ local businesses</span>
          </p>
        </div>
        <div className="mx-auto w-full max-w-[490px] lg:mr-0">
          <AgentFeed />
        </div>
      </Container>
    </section>
  );
}

function Stats() {
  const half = [...directories, ...directories];
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="grid gap-10 text-center sm:grid-cols-3">
          {homeStats.map((s) => (
            <div key={s.label}>
              <p className="text-gradient text-5xl font-extrabold tracking-tight sm:text-[56px]">
                <CountUp value={s.value} suffix="+" />
              </p>
              <p className="mt-2 text-ink/65">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-14 text-center text-[15px] text-ink/55">Your agent gets you listed on the sites Google trusts</p>
        <div className="mask-fade-x mt-5 overflow-hidden">
          <ul className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
            {half.map((d, i) => (
              <li key={i} aria-hidden={i >= directories.length} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[15px] text-ink/65 shadow-sm">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function RealResults() {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Real results"
              title="Real businesses."
              highlight="Real climbs."
              intro="Each dot is a spot on the map. The number is where the business ranks there."
            />
            <RankLegend className="mt-8" />
          </div>
          <div className="mx-auto w-full max-w-[480px]">
            <ScanShowcase />
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-ink/45">
          Sample scans showing first scan vs. newest scan for the same search. The street map is illustrative; the dots
          show rank. Individual results vary.
        </p>

        <h3 className="tracking-display mt-24 text-center text-4xl sm:text-[44px]">
          More calls, too. <span className="text-gradient">Counted by Google.</span>
        </h3>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {callResults.map((r, i) => (
            <Reveal key={r.who} delay={i * 80}>
              <div className="flex h-full flex-col rounded-3xl border border-ink/[0.06] bg-white p-7 shadow-card">
                <p className="text-6xl font-extrabold tracking-tight text-emerald-600">
                  +<CountUp value={r.pct} suffix="%" />
                </p>
                <p className="mt-2 text-lg font-bold">more calls in {r.days} days</p>
                <div className="mt-6 space-y-3 text-[13px] font-semibold">
                  <Bar label="Before" value={r.before} max={r.after} tone="bg-ink/15" />
                  <Bar label="After" value={r.after} max={r.after} tone="bg-emerald-500" strong />
                </div>
                <p className="mt-auto pt-10 text-[15px] text-ink/55">{r.who}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={160}>
            <div className="flex h-full flex-col rounded-3xl border border-ink/[0.06] bg-white p-7 shadow-card">
              <p className="text-6xl font-extrabold tracking-tight text-emerald-600">
                +<CountUp value={72} suffix="%" />
              </p>
              <p className="mt-2 text-lg font-bold">more calls in 90 days</p>
              <MiniReport />
              <p className="mt-4 text-[15px] text-ink/55">198 calls · A customer&apos;s Business Profile report</p>
            </div>
          </Reveal>
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center text-xs text-ink/45">
          Call counts come from Google Business Profile insights, compared to the period before. Your results will be different.
        </p>

        <Reveal className="mx-auto mt-20 grid max-w-4xl items-center gap-10 rounded-[32px] border border-ink/[0.06] bg-white p-8 shadow-card sm:p-10 md:grid-cols-[210px_1fr]">
          <div className="relative mx-auto aspect-[9/16] w-[210px] overflow-hidden rounded-3xl bg-gradient-to-b from-sky-500 via-brand-500 to-night">
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute top-1/2 left-1/2 grid size-14 -translate-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lift">
              <Play className="ml-0.5 size-6 fill-current" />
            </span>
            <span className="absolute bottom-4 left-4 text-sm font-bold text-white">Video testimonial</span>
          </div>
          <figure>
            <Stars className="size-5" />
            <blockquote className="tracking-display mt-5 text-3xl leading-tight font-extrabold">
              “We went from page two to the top of the map in our town. New customers just find us now.”
            </blockquote>
            <figcaption className="mt-6">
              <p className="font-bold">Marcus Reed</p>
              <p className="text-ink/55">Reed Lawn Co.</p>
            </figcaption>
          </figure>
        </Reveal>
        <p className="mt-10 text-center">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-lg font-bold text-brand-700 hover:underline">
            Read the case studies <ArrowRight className="size-5" />
          </Link>
        </p>
      </Container>
    </section>
  );
}

function Bar({ label, value, max, tone, strong }: { label: string; value: number; max: number; tone: string; strong?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-11 text-ink/50">{label}</span>
      <span className="h-2.5 flex-1 rounded-full bg-ink/[0.05]">
        <span className={`block h-full rounded-full ${tone}`} style={{ width: `${(value / max) * 100}%` }} />
      </span>
      <span className={strong ? "w-16 font-bold" : "w-16 text-ink/55"}>{value} calls</span>
    </div>
  );
}

function MiniReport() {
  const points = [8, 12, 6, 14, 10, 22, 9, 16, 30, 12, 18, 26, 14, 34, 20, 28, 40, 22, 30, 44];
  const max = Math.max(...points);
  const d = points.map((p, i) => `${(i / (points.length - 1)) * 300},${60 - (p / max) * 52}`).join(" ");
  return (
    <div className="mt-5 rounded-2xl border border-ink/[0.06] bg-brand-50/60 p-3" aria-hidden>
      <p className="text-[10px] font-bold text-ink/60">Business Profile · Performance</p>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {["1,402", "198", "143", "12"].map((v, i) => (
          <div key={i} className="rounded-md bg-white px-1.5 py-1 text-[9px] font-bold">
            {v}
            <span className="block h-1 w-6 rounded bg-emerald-300" />
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 60" className="mt-2 h-12 w-full">
        <polyline points={d} fill="none" stroke="#b95fe0" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function WhatAgentDoes() {
  const dots = ["mid", "mid", "good", "mid", "bad", "mid", "good", "good", "good", "mid", "good", "good", "good", "good", "good", "mid", "good", "good", "good", "mid", "bad", "mid", "good", "mid", "mid"];
  const tone = { good: "bg-rank-good", mid: "bg-rank-mid", bad: "bg-rank-bad" } as Record<string, string>;
  return (
    <section className="bg-white py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What your agent does"
          title="One AI agent."
          highlight="Your whole local SEO."
          intro="The work an agency does, done every week."
          className="max-w-4xl"
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="grid h-full overflow-hidden rounded-3xl border border-ink/[0.08] bg-canvas sm:grid-cols-[1.1fr_1fr]">
              <div className="bg-grid relative grid place-items-center bg-brand-50/60 p-10">
                <div className="grid grid-cols-5 gap-2.5" aria-hidden>
                  {dots.map((t, i) => (
                    <span key={i} className={`size-8 rounded-full ring-2 ring-white shadow-sm ${tone[t]}`} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center p-8">
                <h3 className="text-[22px] tracking-tight">Tracks your map rank</h3>
                <p className="mt-2 text-ink/65">Every week it checks 49 spots around you. You see where you rank.</p>
              </div>
            </div>
          </Reveal>
          <BentoCard title="Replies to your reviews" text="Fast, friendly replies that fit your brand.">
            <div className="w-full max-w-[290px]">
              <div className="rounded-2xl bg-white p-4 shadow-card">
                <Stars />
                <span className="mt-3 block h-2 w-4/5 rounded bg-ink/10" />
                <span className="mt-2 block h-2 w-1/2 rounded bg-ink/10" />
              </div>
              <div className="relative -mt-1 ml-4 rounded-2xl bg-brand-gradient p-4 text-white shadow-brand">
                <span className="flex items-center gap-1 text-xs font-bold">
                  <Sparkles className="size-3" /> AI reply
                </span>
                <span className="mt-3 block h-2 w-11/12 rounded bg-white/40" />
                <span className="mt-2 block h-2 w-3/5 rounded bg-white/40" />
              </div>
            </div>
          </BentoCard>
          <BentoCard title="Posts 3× a week" text="Fresh Google posts, written for your business.">
            <div className="w-full max-w-[310px] rounded-2xl bg-white p-3 shadow-card">
              {[
                ["Mon", "from-brand-200 to-brand-300"],
                ["Wed", "from-emerald-200 to-emerald-300"],
                ["Fri", "from-amber-200 to-amber-300"],
              ].map(([day, g]) => (
                <div key={day} className="flex items-center gap-3 border-b border-ink/[0.05] px-1 py-2.5 last:border-0">
                  <span className={`size-10 shrink-0 rounded-xl bg-gradient-to-br ${g}`} />
                  <span className="flex-1">
                    <span className="block h-2 w-4/5 rounded bg-ink/10" />
                    <span className="mt-1.5 block h-2 w-1/2 rounded bg-ink/10" />
                  </span>
                  <span className="text-right">
                    <span className="block text-[11px] text-ink/45">{day}</span>
                    <span className="mt-1 block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Posted ✓</span>
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>
          <BentoCard title="Lists you on 500+ sites" text="All in month one. Our team adds the top ones by hand.">
            <div className="text-center">
              <p className="text-gradient text-6xl font-extrabold tracking-tight">500+</p>
              <div className="mt-4 flex max-w-[260px] flex-wrap justify-center gap-1.5">
                {["Apple Maps", "Bing", "Yelp", "BBB", "Foursquare", "Yellow Pages"].map((d) => (
                  <span key={d} className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold shadow-sm">
                    <CheckCircle2 className="size-3.5 fill-emerald-600 text-white" /> {d}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>
          <BentoCard title="Checks your profile monthly" text="It finds what holds you back and fixes it.">
            <div className="w-full max-w-[260px] rounded-2xl bg-white p-3 shadow-card">
              <p className="flex items-center gap-1.5 px-1 text-xs font-bold text-brand-700">
                <Search className="size-3.5" /> Profile checkup
              </p>
              {["Hours", "Photos", "Services", "Categories"].map((x) => (
                <span key={x} className="mt-2 flex items-center justify-between rounded-lg bg-canvas px-3 py-2 text-[13px] font-semibold">
                  {x} <CheckCircle2 className="size-4 fill-emerald-600 text-white" />
                </span>
              ))}
            </div>
          </BentoCard>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/features" variant="secondary" arrow>
            See every feature
          </ButtonLink>
          <ButtonLink href="/rank-tracker" variant="secondary" arrow>
            How rank tracking works
          </ButtonLink>
        </div>
        <p className="mt-10 text-center text-[15px] text-ink/55">Try our free tools, too:</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {[
            ["Local SEO audit", "/tools/local-seo-audit-tool"],
            ["Citation finder", "/tools/local-citation-finder"],
            ["Business Profile optimizer", "/tools/google-business-profile-optimizer"],
            ["Local ranking calculator", "/tools/local-ranking-calculator"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[15px] font-semibold hover:border-brand-300 hover:text-brand-700">
              {label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function BentoCard({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.08] bg-canvas">
        <div className="grid min-h-[230px] place-items-center bg-gradient-to-b from-brand-100/70 to-brand-50/30 p-6">{children}</div>
        <div className="p-7">
          <h3 className="text-[22px] tracking-tight">{title}</h3>
          <p className="mt-2 text-ink/65">{text}</p>
        </div>
      </div>
    </Reveal>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Connect your Google profile", text: "Approve one Google email. It takes about 60 seconds." },
    { title: "Your agent gets to work", text: "Posts, review replies, and new listings start that week." },
    { title: "You climb the map", text: "Not climbing in 30 days? You get every dollar back." },
  ];
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow="How it works" title="Three steps to the" highlight="map pack." />
        <ol className="relative mt-16 grid gap-12 md:grid-cols-3">
          <span className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 md:block" aria-hidden />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <li className="relative text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-night text-2xl font-extrabold text-white ring-8 ring-canvas shadow-brand">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-[22px] tracking-tight">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[270px] text-ink/65">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export const metadata = {
  title: { absolute: "Ranklit: AI Local SEO Agent for Google Maps Rankings" },
};
