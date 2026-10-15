import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Hand, MapPin, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Ranklit: Affordable, Done-For-You Local SEO",
  description:
    "Ranklit makes agency-grade, done-for-you local SEO affordable for every local business: 500+ citations per client, a 30-day ranking guarantee, from $99/mo.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "560+", label: "Businesses served" },
  { value: "500+", label: "Citations placed per client" },
  { value: "30 days", label: "Money-back ranking guarantee" },
  { value: "$99/mo", label: "Instead of $2,000 agencies" },
];

const reasons = [
  {
    icon: Bot,
    title: "AI-powered, done for you",
    text: "The platform handles the daily work (Google posts, review replies, rank scans) on its own, so you get agency output without paying for agency headcount.",
  },
  {
    icon: Hand,
    title: "Real work, placed by hand",
    text: "Where it counts, people do the work. Premium citations are built by hand every month on the directories Google trusts, never cheap bulk blasts.",
  },
  {
    icon: MapPin,
    title: "Affordable by design",
    text: "Agencies charge $1,500 to $3,000 a month for local SEO. We built the automation to deliver the same work from $99/mo, with no contracts and no lock-in.",
  },
  {
    icon: ShieldCheck,
    title: "Backed by a guarantee",
    text: "Every plan comes with a 30-day money-back ranking guarantee. If you aren't climbing the map, you get every dollar back.",
  },
];

export default function AboutPage() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Organization", name: "Ranklit LLC", url: site.url, email: site.email },
    { "@context": "https://schema.org", "@type": "AboutPage", name: "About Ranklit", url: `${site.url}/about` },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(35,25,56,.07) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
        <div
          className="absolute top-[-10%] left-[-8%] -z-10 size-[440px] rounded-full opacity-50 blur-[80px]"
          style={{ background: "#8d3ebb" }}
          aria-hidden
        />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">About us</p>
          <h1 className="mt-4 text-4xl leading-[1.05] font-bold tracking-[-0.025em] sm:text-6xl">
            Making local SEO accessible to <span className="text-gradient">every business</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-ink/70">
            Good local SEO shouldn&apos;t sit behind a $2,000-a-month agency retainer. We built Ranklit so any business can
            get the same work, done for them every day, at a fraction of the cost.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-black/5 bg-white p-8 shadow-sm sm:grid-cols-4 sm:p-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-brand-700 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-ink/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Who we are</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/75">
          <p>
            Ranklit is a done-for-you local SEO platform for small businesses and the agencies that serve them. We take
            care of the work that really moves the Google Maps local pack (Business Profile optimization, premium
            citations placed by hand, review generation, and weekly rank tracking) so owners can stay focused on running
            their business.
          </p>
          <p>
            We started Ranklit after running into the same problem over and over: local SEO works, but the businesses
            that need it most can&apos;t pay agency prices, and DIY tools leave all the real work with the owner. Our
            answer was to automate the repetitive parts, keep people on the parts that need a human touch, and pass the
            savings along.
          </p>
          <p>
            Today we work with hundreds of local businesses, placing hundreds of hand-built citations per client and
            tracking real ranking gains across their service areas, all backed by a 30-day money-back ranking guarantee.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-ink p-10 text-center text-white sm:p-14">
          <p className="text-xs font-bold tracking-wider uppercase opacity-80">Our mission</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Give every local business the SEO an agency would charge a fortune for.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            Affordable, transparent, and done for you, so the corner shop can outrank the franchise down the street.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Why businesses choose us</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="flex gap-5 rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-700 text-white">
                <r.icon className="size-6" aria-hidden />
              </span>
              <div>
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-ink">
        <div
          className="absolute top-0 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-[80px]"
          style={{ background: "#8d3ebb" }}
          aria-hidden
        />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Ready to climb the map?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Start your 3-day free trial. Rank higher in 30 days or get your money back.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-8 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start your 3-day free trial <ArrowRight className="size-[18px]" aria-hidden />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore features
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/50">From $99/mo · Cancel anytime</p>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
