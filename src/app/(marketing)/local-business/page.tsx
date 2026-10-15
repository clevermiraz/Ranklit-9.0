import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Hand, MapPin, Phone, ShieldCheck, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui";
import { CountUp } from "@/components/home/count-up";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { ScansDashboardMockup } from "@/components/product/dashboard-mockup";
import { lbFaqs, lbReasons, lbSteps, type LbIcon } from "@/lib/data/features";
import { homeStats } from "@/lib/data/marketing";

export const metadata: Metadata = {
  title: { absolute: "Local SEO for Small Businesses: More Calls from Google Maps | Ranklit" },
  description:
    "Done-for-you local SEO from $99/mo. We optimize your Google Business Profile, place citations by hand, and track your Google Maps rankings every week so your phone rings more.",
  alternates: { canonical: "/local-business" },
};

const icons: Record<LbIcon, LucideIcon> = { phone: Phone, hand: Hand, bot: Bot, trend: TrendingUp, zap: Zap, pin: MapPin };

const primaryBase =
  "inline-flex items-center gap-2 rounded-full bg-brand-700 font-semibold text-white shadow-sm transition hover:opacity-90";
const primaryBtn = `${primaryBase} px-6 py-3`;
const note = "From $99/mo · 30-day money-back guarantee · Cancel anytime";

function Heading({ eyebrow, title, intro, dark }: { eyebrow: string; title: React.ReactNode; intro?: string; dark?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={dark ? "text-sm font-semibold tracking-wide text-brand-300 uppercase" : "text-sm font-semibold tracking-wide text-brand-700 uppercase"}>
        {eyebrow}
      </p>
      {title && <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>}
      {intro && <p className="mt-4 text-lg text-ink/65">{intro}</p>}
    </div>
  );
}

export default function LocalBusinessPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lbFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(35,25,56,.07)_1px,transparent_0)] bg-[size:22px_22px] opacity-60"
          aria-hidden
        />
        <div className="absolute top-[-10%] left-[-10%] size-[440px] rounded-full bg-brand-700 opacity-50 blur-[80px]" aria-hidden />
        <Container className="relative grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fcdffe] px-3 py-1 text-xs font-semibold text-brand-700">
              <MapPin className="size-3.5" aria-hidden /> For local business owners
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
              More customers near you — <span className="text-gradient">on autopilot.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              You&apos;re busy running your business. Ranklit gets you found on Google Maps and turns nearby searches into phone calls.
              It&apos;s fully done for you, with premium citations <strong className="font-bold text-ink">placed by hand</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pricing" className={primaryBtn}>
                See plans <ArrowRight className="size-4" aria-hidden />
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:bg-ink/5"
              >
                Compare features
              </Link>
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm text-ink/55">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden /> {note}
            </p>
          </div>
          <div className="relative lg:pl-6">
            <ScansDashboardMockup className="mx-auto max-w-[504px]" />
          </div>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <Heading
            eyebrow="Why local businesses choose us"
            title="All the work of an agency, without the agency bill"
            intro="The work that moves you up the map pack and makes your phone ring, handled for you every day."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {lbReasons.map((r) => {
              const Icon = icons[r.icon];
              return (
                <div
                  key={r.title}
                  className="rounded-2xl border border-black/5 bg-canvas/40 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-[#fcdffe] text-brand-700">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{r.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <Container>
          <Heading eyebrow="How it works" title="Set it up once. We handle the rest." />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {lbSteps.map((s, i) => {
              const Icon = icons[s.icon];
              return (
                <li key={s.title} className="relative rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <span className="absolute top-5 right-5 text-4xl font-bold text-brand-700/15" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="grid size-12 place-items-center rounded-xl bg-brand-700 text-white">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-ink py-20 text-white">
        <div className="absolute top-[-140px] left-1/2 h-[280px] w-[640px] -translate-x-1/2 rounded-full bg-brand-700 opacity-50 blur-[90px]" aria-hidden />
        <Container className="relative">
          <Heading eyebrow="Real results, by the numbers" title={null} dark />
          <div className="mt-10 grid gap-10 text-center md:grid-cols-3">
            {homeStats.map((s) => (
              <div key={s.label}>
                <p className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                  <CountUp value={s.value} />
                  <span className="text-gradient">+</span>
                </p>
                <p className="mx-auto mt-3 max-w-[15rem] text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 bg-white py-20 sm:py-28">
        <Container>
          <Heading
            eyebrow="Pricing"
            title="Simple pricing. Real results."
            intro="Plans start at $99/mo with no contracts. Cancel anytime. Not climbing in 30 days? You get every dollar back."
          />
          <div className="mt-14">
            <PricingPlans showAgencyNote={false} />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Heading eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-10 space-y-4">
            {lbFaqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-black/5 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <span className="text-xl leading-none text-brand-700 transition-transform duration-200 group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-ink py-20 text-center">
        <div className="absolute top-[-120px] left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-brand-700 opacity-50 blur-[90px]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Get the phone ringing <span className="text-gradient">automatically.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Join hundreds of local business owners who use Ranklit to climb Google Maps and get more calls.
          </p>
          <a href="#pricing" className={`${primaryBase} mt-8 px-7 py-3.5`}>
            Choose your plan <ArrowRight className="size-4" aria-hidden />
          </a>
          <p className="mt-4 text-sm text-white/50">{note}</p>
        </div>
      </section>
    </>
  );
}
