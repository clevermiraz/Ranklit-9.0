import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { site, trialHref } from "@/lib/site";

/** Split promo card injected into articles right after the TL;DR. */
export function InlineCta({ title, text }: { title: string; text: string }) {
  return (
    <div
      className="my-8 rounded-[26px] p-[min(22px,3.2vw)]"
      style={{
        background:
          "radial-gradient(circle at 100% 0%, #eadcf3 0 150px, transparent 151px), radial-gradient(circle at 0% 100%, #eadcf3 0 130px, transparent 131px), linear-gradient(180deg, #f1e8f7, #f8f3fb)",
      }}
    >
      <div className="flex flex-wrap overflow-hidden rounded-[18px] bg-white shadow-[0_12px_34px_rgba(0,0,0,0.13)]">
        <div className="flex min-w-[220px] flex-[1_0_36%] flex-col items-start gap-3 bg-[linear-gradient(104deg,#461f5d_0%,#2a1238_82%,transparent_82.15%)] py-[30px] pr-[76px] pl-[26px] max-sm:bg-[linear-gradient(104deg,#461f5d_0%,#2a1238_100%)] max-sm:pr-[26px]">
          <span className="rounded-full bg-white px-[13px] py-1.5 text-xs font-extrabold tracking-[0.1em] text-[#572673] uppercase">{site.name}</span>
          <span className="text-xs text-white/75">{site.domain}</span>
        </div>
        <div className="flex-[1_1_320px] px-7 py-[30px]">
          <p className="text-[23px] leading-tight font-extrabold tracking-tight text-[#1f2937]">{title}</p>
          <span className="mt-3 mb-3.5 block h-1.5 w-14 rounded-[3px] bg-brand-700" aria-hidden />
          <p className="text-[15px] leading-[1.55] text-[#64748b]">{text}</p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-brand-700 py-[13px] pr-[22px] pl-[26px] text-[15px] font-bold text-white transition hover:brightness-110"
          >
            Explore {site.name}
            <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

const productPoints = [
  "Weekly Google Maps rank grid across your service area",
  "Google Business Profile audit and fixes",
  "Hand-placed citations on 40+ directories",
  "Weekly rank tracking and review replies on autopilot",
];

/** Dark product card shown after every article body. */
export function ProductCta() {
  return (
    <aside className="mt-16 overflow-hidden rounded-3xl border border-black/5 bg-ink text-white shadow-lg">
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">3-day free trial</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold tracking-wide text-green-300 uppercase">
            <ShieldCheck className="size-3.5" aria-hidden /> 30-day money-back
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">Climb Google Maps without lifting a finger.</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-white/70">
          {site.name} works on your Google Business Profile, citations, reviews and rank tracking every day, so new customers call you
          instead of the shop down the road. Try it free for 3 days. Rank scans run every week.
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {productPoints.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-white/80">
              <Check className="mt-0.5 size-4 shrink-0 text-green-400" strokeWidth={2.5} aria-hidden />
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm font-semibold text-white">3-day free trial · from $99/mo · cancel anytime.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={trialHref()}
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            Start your 3-day free trial <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            See our plans <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/50">Backed by our 30-day money-back ranking guarantee.</p>
      </div>
    </aside>
  );
}
