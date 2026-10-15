import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ClipboardCheck, FileText, Link2, Sparkles, TrendingUp, Wrench, Check } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { organicRequestedAt } from "@/lib/server/orders-store";
import { Card, IconTile } from "@/components/app/ui";
import { GscChart } from "@/components/app/website/gsc-chart";
import { OrganicCta } from "@/components/app/website/organic-cta";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Organic SEO" };

const RESULTS = [
  {
    title: "4,720 clicks from 382K impressions",
    caption: "A home services business, last 12 months. Clicks climbed steadily as each month's new pages were indexed.",
    clicks: "4.72K",
    impressions: "382K",
    shape: "steady" as const,
    months: ["Nov", "Feb", "May", "Aug", "Oct"],
  },
  {
    title: "1.78M impressions in 16 months",
    caption: "A multi-location business. Pages and links stack on each other, so growth compounds instead of levelling off.",
    clicks: "21.4K",
    impressions: "1.78M",
    shape: "compound" as const,
    months: ["Jul", "Nov", "Mar", "Jul", "Oct"],
  },
  {
    title: "A newer site, 90 days in",
    caption: "A brand-new domain. Quiet for the first few weeks, then Google starts testing the new pages in search.",
    clicks: "214",
    impressions: "31.4K",
    shape: "new" as const,
    months: ["Jul 15", "Aug 15", "Sep 15", "Oct 13"],
  },
];

const INCLUDED = [
  { icon: Link2, title: "3–5 authority backlinks a month", text: "Real links from relevant, established sites — the signal Google leans on most to decide who deserves page one." },
  { icon: FileText, title: "30 web pages a month", text: "Service and area pages written around what your customers actually search, published straight to your site." },
  { icon: ClipboardCheck, title: "A full website audit", text: "We crawl every page and list everything holding you back: speed, titles, duplicate content, broken links and missing schema." },
  { icon: Wrench, title: "The cleanup, done for you", text: "We don't hand you a report and leave. We fix what the audit finds, so the new pages and links land on a site Google trusts." },
];

const TIMELINE = [
  { label: "Week 1", title: "Audit and plan", text: "We crawl your site, list everything Google trips over, and agree the first 30 pages with you by email." },
  { label: "Weeks 2–3", title: "Cleanup and first pages", text: "Titles, speed, broken links and schema get fixed, and the first pages go live on your site." },
  { label: "Week 4 onward", title: "Links and momentum", text: "Backlinks start landing, new pages keep shipping every month, and you get a Search Console report." },
];

const FAQ = [
  {
    q: "How is this different from what my plan already does?",
    a: "Your plan works on Google Maps: your profile, reviews, posts, citations and map rankings. The Organic Growth Plan works on your website, so you also show up in the regular Google results below the map — where a lot of ready-to-buy searches end up.",
  },
  {
    q: "How long until I see results?",
    a: "Most sites see impressions start to rise within 4–8 weeks and clicks follow over months 2–4. Newer sites take a little longer because Google tests them before trusting them. The work keeps compounding the longer it runs.",
  },
  {
    q: "Do I have to write anything?",
    a: "No. We write the pages from your strategy and Google profile, and only ask you to confirm services, prices or areas when we're unsure. You can review anything before it goes live if you'd like to.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, any time, from Plans & Credits or by emailing Lukas. There's no contract. Everything we've built — the pages on your site and the links pointing to it — stays yours.",
  },
];

export default async function OrganicSeoPage() {
  const { business } = await getApp();
  const requested = !!organicRequestedAt(business.profile.id);

  return (
    <div className="mx-auto max-w-[840px] space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-[#4a1d5e] to-[#2a1238] p-7 text-white shadow-[0_20px_40px_-24px_rgba(42,18,56,.8)] sm:p-9">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
          <TrendingUp className="size-3.5" /> Managed service
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">Organic Growth Plan</h1>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-white/90">
          Maps brings you the people searching nearby. This brings you the ones searching on Google itself — typing the thing they are ready to pay someone to fix.
        </p>
        <p className="mt-2 text-sm text-white/60">Done for you every month. It keeps working long after you stop paying for ads.</p>
        <p className="mt-6">
          <span className="text-3xl font-extrabold">$299</span> <span className="text-sm text-white/70">per month · cancel any time</span>
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <OrganicCta requested={requested} />
          <Link href="/dashboard/website" className="text-sm font-semibold text-white/85 underline-offset-4 hover:text-white hover:underline">
            Not sure yet? Run your free site audit →
          </Link>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
          {["3–5 backlinks a month", "30 web pages a month", "Full website audit", "SEO cleanup done for you"].map((x) => (
            <li key={x} className="flex items-center gap-1.5">
              <Check className="size-4 text-[#f6b8e4]" /> {x}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight">The results, straight from Google</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/65">
          These are the kind of Search Console graphs our clients see. Every click is someone who searched Google, found a page we built, and visited the site — no ad spend behind any of it.
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/65">
          Organic growth is slow for a month or two and then compounds: each new page and link adds to the last, which is why it keeps working after you stop.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {RESULTS.map((r) => (
            <Card key={r.title} className="!p-4">
              <GscChart clicks={r.clicks} impressions={r.impressions} shape={r.shape} months={r.months} />
              <p className="mt-3 text-sm font-bold">{r.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">{r.caption}</p>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-ink/40">Charts are illustrations of typical client results.</p>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight">What $299 a month gets you</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {INCLUDED.map((x) => (
            <Card key={x.title}>
              <IconTile icon={x.icon} />
              <p className="mt-3 font-bold">{x.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">{x.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight">What happens in your first month</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {TIMELINE.map((t) => (
            <Card key={t.label}>
              <p className="text-[11px] font-bold tracking-[0.14em] text-brand-700 uppercase">{t.label}</p>
              <p className="mt-2 font-bold">{t.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">{t.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight">Questions people ask first</h2>
        <div className="mt-5 divide-y divide-[#ece6f4] rounded-2xl border border-[#ece6f4] bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-4 shrink-0 text-ink/45 transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-ink/65">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-5 rounded-2xl bg-gradient-to-br from-[#4a1d5e] to-[#2a1238] p-7 text-white">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <Sparkles className="size-5 text-[#f6b8e4]" /> Ready to start ranking on Google, not just Maps?
          </p>
          <p className="mt-1 text-sm text-white/75">$299 a month. Cancel any time — the pages and links we build stay yours.</p>
        </div>
        <OrganicCta requested={requested} />
      </section>
    </div>
  );
}
