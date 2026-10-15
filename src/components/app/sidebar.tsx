"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Building2, Check, ChevronDown, ChevronLeft, ChevronRight, HelpCircle, Menu, Plus, TrendingUp, X } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { sections, sectionFor } from "@/lib/app/nav";
import { setAutopilotAction, switchBusinessAction } from "@/app/actions/app";
import { Switch } from "./controls";
import { useAction } from "./toast";

export type SidebarData = {
  businessName: string;
  businesses: { id: string; name: string; address: string }[];
  currentBusinessId: string;
  badges: Partial<Record<string, number>>;
  autopilot: boolean;
  setupDone: boolean;
  planName: string;
  credits: number;
};

const promos = [
  { title: "Organic SEO", head: <>Get <span className="text-brand-300">30 local pages</span> built every month</>, body: "Plus authority backlinks, done for you. $299/mo.", href: "/dashboard/organic-seo" },
  { title: "Accelerator", head: <>Rank faster with <span className="text-brand-300">authority backlinks</span></>, body: "A one-time $150 boost to your citations.", href: "/dashboard/upgrades" },
  { title: "Guest Post", head: <>A <span className="text-brand-300">local guest post</span> on a trusted site</>, body: "Written and placed for you. $99 one-time.", href: "/dashboard/upgrades" },
  { title: "Credits", head: <>Need more <span className="text-brand-300">map scans</span>?</>, body: "Top up credits from $25. They never expire.", href: "/settings/plans" },
];

export function Sidebar({ data }: { data: SidebarData }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerFor, setDrawerFor] = useState<string | null>(null);
  const drawerOpen = drawerFor === pathname;
  const active = sectionFor(pathname).section.key;

  const body = (rail: boolean) => (
    <div className="flex h-full flex-col text-white">
      <div className="flex h-[52px] shrink-0 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="Ranklit home">
          <LogoMark className="size-6 shrink-0" />
          {!rail && (
            <span className="text-[17px] font-bold tracking-tight">
              rank<span className="text-brand-300">lit</span>
            </span>
          )}
        </Link>
        <button type="button" onClick={() => setCollapsed((c) => !c)} className="hidden text-white/50 hover:text-white lg:block" aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}>
          {rail ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
        <button type="button" onClick={() => setDrawerFor(null)} className="text-white/60 lg:hidden" aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>

      {!rail && <BusinessSwitcher data={data} />}

      <nav className="mt-2 flex-1 overflow-y-auto px-2.5" aria-label="Dashboard">
        {[1, 2].map((group) => (
          <div key={group} className={clsx(group === 2 && "mt-3 border-t border-white/10 pt-3")}>
            {sections
              .filter((s) => s.group === group)
              .map((s) => {
                const badge = data.badges[s.key];
                const isActive = active === s.key;
                return (
                  <Link
                    key={s.key}
                    href={s.href}
                    title={rail ? s.label : undefined}
                    onClick={() => setDrawerFor(null)}
                    className={clsx(
                      "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-brand-700 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <s.icon className="size-[17px] shrink-0" />
                    {!rail && <span className="flex-1">{s.label}</span>}
                    {!rail && !!badge && <span className="grid size-[18px] place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-night">{badge}</span>}
                    {!rail && s.key === "autopilot" && (
                      <span className={clsx("size-2 rounded-full", data.autopilot ? "bg-emerald-400" : "bg-white/30")} aria-label={data.autopilot ? "Autopilot on" : "Autopilot off"} />
                    )}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      {!rail && (
        <div className="shrink-0 px-2.5 pb-2">
          <PromoCarousel />
          <div className="mt-2 space-y-1 border-t border-white/10 px-1 pt-2 text-xs text-white/70">
            <Link href="/rank-tracker" className="flex items-center gap-1.5 hover:text-white">
              <span className="grid size-4 place-items-center rounded bg-brand-700 text-[9px] font-bold">G</span> Ranklit Grid ↗
            </Link>
            <Link href="/dashboard/ai-visibility" className="flex items-center gap-1.5 hover:text-white">
              <span className="grid size-4 place-items-center rounded bg-blue-600 text-[9px] font-bold">R</span> Recommended · $49/mo for life ↗
            </Link>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs">
            <span className="max-w-14 truncate font-bold tracking-wide text-white/60 uppercase" title={data.planName}>
              {data.planName}
            </span>
            <span className="flex-1 text-white/85">{data.credits.toLocaleString()} credits</span>
            <Link href="/settings/plans" className="rounded-md bg-brand-600 px-2 py-1 font-semibold text-white hover:bg-brand-500">
              Upgrade
            </Link>
          </div>
        </div>
      )}
      <AutopilotFooter rail={rail} autopilot={data.autopilot} setupDone={data.setupDone} />
    </div>
  );

  return (
    <>
      <aside className={clsx("sticky top-0 hidden h-dvh shrink-0 bg-[#231938] transition-[width] duration-200 lg:block", collapsed ? "w-16" : "w-[210px]")}>
        {body(collapsed)}
      </aside>
      <button type="button" onClick={() => setDrawerFor(pathname)} className="fixed top-2.5 left-3 z-40 grid size-9 place-items-center rounded-lg bg-[#231938] text-white lg:hidden" aria-label="Open menu">
        <Menu className="size-5" />
      </button>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setDrawerFor(null)} aria-label="Close menu" />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-[#231938]">{body(false)}</aside>
        </div>
      )}
    </>
  );
}

function BusinessSwitcher({ data }: { data: SidebarData }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { run } = useAction();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative mx-2.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-white/5"
      >
        <Building2 className="size-4 shrink-0 text-white/50" />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold tracking-wider text-white/45 uppercase">Managing</span>
          <span className="block truncate text-[13px] font-semibold">{data.businessName}</span>
        </span>
        <ChevronDown className={clsx("size-4 text-white/50 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/10 bg-[#2e2346] shadow-lift">
          {data.businesses.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setOpen(false);
                if (b.id !== data.currentBusinessId) run(() => switchBusinessAction(b.id));
              }}
              className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-white/5"
            >
              <Check className={clsx("mt-0.5 size-3.5 shrink-0", b.id === data.currentBusinessId ? "text-emerald-400" : "invisible")} />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold">{b.name}</span>
                <span className="block truncate text-[11px] text-white/50">{b.address}</span>
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/businesses");
            }}
            className="flex w-full items-center gap-2 border-t border-white/10 px-3 py-2 text-[13px] text-white/80 hover:bg-white/5"
          >
            <Plus className="size-3.5" /> Manage businesses
          </button>
        </div>
      )}
    </div>
  );
}

function PromoCarousel() {
  const [i, setI] = useState(0);
  const p = promos[i];
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-brand-700/40 to-white/5 p-3">
      <div className="flex items-center justify-between text-[11px] font-semibold text-white/80">
        <span className="flex items-center gap-1.5">
          <span className="grid size-5 place-items-center rounded-full bg-brand-600">
            <TrendingUp className="size-3" />
          </span>
          {p.title}
        </span>
        <button type="button" onClick={() => setI((x) => (x + 1) % promos.length)} className="flex items-center gap-0.5 hover:text-white" aria-label="Next offer">
          {i + 1}/{promos.length} <ChevronRight className="size-3" />
        </button>
      </div>
      <Link href={p.href} className="mt-2 block">
        <p className="text-[13px] leading-snug font-bold">{p.head}</p>
        <p className="mt-1 text-[11px] leading-snug text-white/60">{p.body}</p>
      </Link>
    </div>
  );
}

function AutopilotFooter({ rail, autopilot, setupDone }: { rail: boolean; autopilot: boolean; setupDone: boolean }) {
  const { run, pending } = useAction();
  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-white/10 px-4 py-3">
      <Switch checked={autopilot} disabled={pending} onChange={(v) => run(() => setAutopilotAction(v))} label="Autopilot" />
      {!rail && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold">Autopilot is {autopilot ? "ON" : "OFF"}</span>
            <span className="block text-[11px] leading-tight text-white/50">
              {autopilot ? "Your agent is working on schedule" : setupDone ? "Flip on to let your agent work" : "Setup needed before the agent can run"}
            </span>
          </span>
          <Link href="/dashboard/autopilot" className="text-white/40 hover:text-white" aria-label="What does Autopilot do?">
            <HelpCircle className="size-4" />
          </Link>
        </>
      )}
    </div>
  );
}
