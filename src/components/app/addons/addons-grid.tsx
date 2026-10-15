"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, CheckCircle2, ChevronDown, Coins, FileSearch, Globe, Newspaper, Rocket, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import { useAction } from "@/components/app/toast";
import { Caps } from "@/components/app/ui";
import { placeAddonOrderAction } from "@/app/actions/addons";
import { ConfirmModal } from "./confirm-modal";

type AddonId = "accelerator" | "guest-post" | "ai-assessment";

type Addon = {
  key: string;
  title: string;
  badge: string;
  icon: LucideIcon | "R";
  price: string;
  strike?: string;
  suffix: string;
  description: string;
  included: string[];
  cta: string;
  note?: string;
  variant?: "magenta" | "blue";
  action: { kind: "order"; id: AddonId; amount: number; delivery: string } | { kind: "link"; href: string; external?: boolean };
};

const GROUPS: { label: string; items: Addon[] }[] = [
  {
    label: "Rankings & Authority",
    items: [
      {
        key: "accelerator",
        title: "Local Ranking Accelerator",
        badge: "Upgrade",
        icon: Rocket,
        price: "$150",
        suffix: "one-time",
        description: "We build high-authority backlinks to your citations so Google trusts your listings faster — a one-time boost to your Maps ranking signals.",
        included: [
          "50+ high-authority backlinks pointing at your citations",
          "Indexing push so Google finds the new links quickly",
          "Premium citations on Apple Maps, Bing Places and BBB",
          "Before-and-after map scan so you can see the lift",
          "Delivered in 3–4 weeks, no work on your side",
        ],
        cta: "Get the Accelerator — $150",
        action: { kind: "order", id: "accelerator", amount: 150, delivery: "3–4 weeks" },
      },
      {
        key: "guest-post",
        title: "Local Guest Post",
        badge: "Add-on",
        icon: Newspaper,
        price: "$99",
        suffix: "one-time",
        description: "A real article about your business on a local or industry blog, with a link back to your website.",
        included: [
          "Placement on a real site with real traffic",
          "600+ word article written for you",
          "Do-follow link to the page you choose",
          "Your city and services mentioned naturally",
          "Live link sent to you within 14 days",
        ],
        cta: "Order a Guest Post — $99",
        action: { kind: "order", id: "guest-post", amount: 99, delivery: "within 14 days" },
      },
    ],
  },
  {
    label: "Strategy & Advice",
    items: [
      {
        key: "ai-assessment",
        title: "AI Visibility Assessment",
        badge: "Only $99",
        icon: Sparkles,
        price: "$99",
        strike: "$297",
        suffix: "one-time",
        description: "Find out whether ChatGPT, Gemini and Perplexity recommend you — and exactly what to change so they do.",
        included: [
          "50 real customer questions asked across 6 AI assistants",
          "Which competitors they name instead of you, and why",
          "Gaps in your profile, website and citations",
          "A prioritised, step-by-step fix list",
          "30-minute walkthrough call with your account manager",
        ],
        cta: "Get it for $99",
        note: "Upgrade to Pro and it's free, a $297 value.",
        variant: "magenta",
        action: { kind: "order", id: "ai-assessment", amount: 99, delivery: "within 5 business days" },
      },
      {
        key: "recommended",
        title: "Recommended",
        badge: "Founding deal",
        icon: "R",
        price: "$49",
        suffix: "/mo for life, instead of $99",
        description: "See whether AI assistants name your business when customers ask for a recommendation — checked every week.",
        included: [
          "Weekly checks across ChatGPT, Gemini, Perplexity, Claude and Google AI",
          "The competitors AI names, and how often",
          "Alerts when you're added or dropped",
          "Monthly tips to get named more often",
        ],
        cta: "Try Recommended",
        variant: "blue",
        action: { kind: "link", href: "/dashboard/ai-visibility" },
      },
    ],
  },
  {
    label: "Websites & Growth",
    items: [
      {
        key: "audit",
        title: "Website SEO Audit",
        badge: "Free",
        icon: FileSearch,
        price: "Free",
        suffix: "",
        description: "See what Google looks for on your site and can't find yet, with exactly what to add.",
        included: ["Title, heading and meta checks", "Missing service and location pages", "Name, address and phone match with Google", "Schema and map embed check", "A fix list you can tick off"],
        cta: "Run my audit",
        action: { kind: "link", href: "/dashboard/website" },
      },
      {
        key: "organic",
        title: "Organic Growth Plan",
        badge: "Managed service",
        icon: TrendingUp,
        price: "$299",
        suffix: "per month",
        description: "Rank on Google itself, not just Maps. Pages, links and cleanup done for you every month.",
        included: ["3–5 authority backlinks a month", "30 web pages a month", "A full website audit", "SEO cleanup done for you", "Monthly Search Console report"],
        cta: "See the results",
        action: { kind: "link", href: "/dashboard/organic-seo" },
      },
      {
        key: "website-build",
        title: "New Website Build",
        badge: "Partner offer",
        icon: Globe,
        price: "Free",
        suffix: "",
        description: "Need a new site? Our partner Local Web Builders builds fast, SEO-ready websites for local businesses with no upfront cost.",
        included: ["Custom design for your trade", "Service and area pages ready to rank", "Mobile-fast and secure", "Hosting and updates handled for you"],
        cta: "Explore Local Web Builders",
        action: { kind: "link", href: "https://localwebbuilders.io", external: true },
      },
    ],
  },
  {
    label: "Account Credits",
    items: [
      {
        key: "credits",
        title: "Credit Top-Up",
        badge: "Credits",
        icon: Coins,
        price: "From $25",
        suffix: "",
        description: "Extra credits for map scans and AI checks. One-time top-ups never expire and stack on your monthly credits.",
        included: ["250 credits — $25", "500 credits — $50", "1,000 credits — $100", "Never expire, used after your monthly credits"],
        cta: "Buy Credits",
        action: { kind: "link", href: "/settings/plans#credits" },
      },
    ],
  },
];

const ctaClass =
  "mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#fbe4f4] px-4 py-2.5 text-sm font-bold text-[#3d1450] transition hover:bg-white disabled:opacity-60";

export function AddonsGrid({ ordered, organicRequested }: { ordered: Partial<Record<AddonId, string>>; organicRequested: boolean }) {
  const { run, pending } = useAction();
  const [active, setActive] = useState<Addon | null>(null);
  const [done, setDone] = useState(false);

  const close = () => {
    setActive(null);
    setDone(false);
  };
  const confirm = () => {
    if (!active || active.action.kind !== "order") return;
    const id = active.action.id;
    run(() => placeAddonOrderAction(id), (r) => !r?.error && setDone(true));
  };

  return (
    <div className="space-y-7">
      {GROUPS.map((g) => (
        <section key={g.label}>
          <Caps className="mb-3">{g.label}</Caps>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((a) => {
              const orderedAt = a.action.kind === "order" ? ordered[a.action.id] : undefined;
              return <AddonCard key={a.key} addon={a} orderedAt={orderedAt} requested={a.key === "organic" && organicRequested} onOrder={() => setActive(a)} />;
            })}
          </div>
        </section>
      ))}

      {active && active.action.kind === "order" && (
        <ConfirmModal
          open
          onClose={close}
          pending={pending}
          title={`Order ${active.title}`}
          summary={active.description}
          lines={[
            { label: active.title, value: `$${active.action.amount}.00` },
            { label: "Billing", value: "One-time, no subscription" },
            { label: "We start", value: "Within 2 business days" },
            { label: "Delivery", value: active.action.delivery },
          ]}
          total={`$${active.action.amount}.00`}
          confirmLabel={`Pay $${active.action.amount}`}
          onConfirm={confirm}
          done={done ? { title: "Order placed", text: "Order placed — we'll start within 2 business days. Lukas will email you when it's underway." } : null}
        />
      )}
    </div>
  );
}

function AddonCard({ addon: a, orderedAt, requested, onOrder }: { addon: Addon; orderedAt?: string; requested: boolean; onOrder: () => void }) {
  const Icon = a.icon;
  const bg =
    a.variant === "blue"
      ? "bg-[#2b3fd4]"
      : a.variant === "magenta"
        ? "bg-gradient-to-br from-[#7b2a93] to-[#b2398f]"
        : "bg-gradient-to-br from-[#3d1450] to-[#5a1a6e]";
  return (
    <article className={clsx("flex flex-col rounded-xl p-5 text-white shadow-[0_8px_24px_-12px_rgba(61,20,80,.6)]", bg)}>
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-10 place-items-center rounded-xl bg-white/15">
          {Icon === "R" ? <span className="grid size-6 place-items-center rounded-md bg-white text-sm font-black text-[#2b3fd4]">R</span> : <Icon className="size-5" />}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#3d1450]">{a.badge}</span>
      </div>
      <h3 className="mt-4 text-[17px] font-bold text-white">{a.title}</h3>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
        <span className="text-3xl font-extrabold tracking-tight">{a.price}</span>
        {a.strike && <span className="text-sm text-white/55 line-through">{a.strike}</span>}
        {a.suffix && <span className="text-xs text-white/70">{a.suffix}</span>}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/80">{a.description}</p>

      <details className="group mt-3">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-white/90 [&::-webkit-details-marker]:hidden">
          What&apos;s included <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-2 space-y-1.5 text-[13px] text-white/85">
          {a.included.map((x) => (
            <li key={x} className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-[#f6b8e4]" /> {x}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-auto">
        {orderedAt && (
          <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/90">
            <CheckCircle2 className="mt-px size-3.5 shrink-0 text-emerald-300" /> Order placed — we&apos;ll start within 2 business days.
          </p>
        )}
        {requested && (
          <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/90">
            <CheckCircle2 className="mt-px size-3.5 shrink-0 text-emerald-300" /> Requested — Lukas will email you within 1 business day.
          </p>
        )}
        {a.action.kind === "order" ? (
          <button type="button" onClick={onOrder} className={ctaClass}>
            {orderedAt ? "Order another" : a.cta} →
          </button>
        ) : a.action.external ? (
          <a href={a.action.href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
            {a.cta} ↗
          </a>
        ) : (
          <Link href={a.action.href} className={ctaClass}>
            {a.cta} →
          </Link>
        )}
        {a.note && <p className="mt-2 text-center text-xs text-white/70">{a.note}</p>}
      </div>
    </article>
  );
}
