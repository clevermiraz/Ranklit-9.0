import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { ChevronRight, Clock, ExternalLink, FileText, Lock, MapPin, Store, Tag, Wrench } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { WEEKDAYS, type BusinessProfile } from "@/lib/app/types";
import { Caps, Card, PageHeader, ProgressBar } from "@/components/app/ui";
import { ConnectCard, DisconnectLink } from "@/components/app/gbp/connect";
import { SuggestionsCard } from "@/components/app/gbp/suggestions";
import { CategoriesEditor, DescriptionEditor, HoursEditor, Notice, ServicesEditor } from "@/components/app/gbp/profile-editors";
import { aiContext, DAY_NAMES, DESCRIPTION_MAX, profileScore, suggestedCategories } from "@/components/app/gbp/logic";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Google Profile" };

const TABS = ["info", "hours", "description", "categories", "services"] as const;
type Tab = (typeof TABS)[number];

function todayHours(hours: BusinessProfile["hours"]) {
  const day = WEEKDAYS[(new Date().getDay() + 6) % 7];
  const h = hours.find((x) => x.day === day);
  return h?.open && h.close ? `Open today, ${h.open} – ${h.close}` : "Closed today";
}

export default async function GbpProfilePage(props: PageProps<"/dashboard/gbp">) {
  const { user, business: s } = await getApp();
  const sp = await props.searchParams;
  const p = s.profile;

  if (!p.connected) {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        <PageHeader title="Google Business Profile" subtitle="Connect your profile so your agent can post, reply to reviews and keep your listing up to date." />
        <ConnectCard email={user.email} name={user.name} businessName={p.name} />
      </div>
    );
  }

  const tab: Tab = TABS.includes(sp.tab as Tab) ? (sp.tab as Tab) : "info";
  const score = profileScore(s);
  const extraCats = p.categories.filter((c) => c !== p.primaryCategory).length;
  const sections: { key: Tab; icon: typeof Store; title: string; sub: string }[] = [
    { key: "info", icon: Store, title: "Business information", sub: p.phone || "Name, address, phone" },
    { key: "hours", icon: Clock, title: "Hours", sub: p.hours.some((h) => h.open) ? todayHours(p.hours) : "No hours set" },
    { key: "description", icon: FileText, title: "Description", sub: `${p.description.length} of ${DESCRIPTION_MAX} characters` },
    { key: "categories", icon: Tag, title: "Categories", sub: `${p.primaryCategory}${extraCats ? `, +${extraCats} more` : ""}` },
    { key: "services", icon: Wrench, title: "Services", sub: p.services.length ? `${p.services.length} services you offer` : "What you offer" },
  ];
  const active = sections.find((x) => x.key === tab)!;
  const panelSub: Record<Tab, string> = {
    info: "Your name, address, phone and website, as Google shows them.",
    hours: "When customers can reach you.",
    description: "What customers read about you on Google.",
    categories: "Tell Google what kind of business you are.",
    services: "The jobs customers can hire you for.",
  };
  const serviceSuggestions = [...s.strategy.services, ...(s.strategy.websiteLearned ?? []).filter((x) => !/metro|^[A-Z][a-z]+$/.test(x))];
  const mapsUrl = p.gbpUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.address}`)}`;

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <PageHeader title="Google Business Profile" subtitle={<>Managing “{p.name}”</>} actions={<DisconnectLink />} />

      <SuggestionsCard suggestions={s.suggestions} />

      <div className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="!p-0">
          <div className="border-b border-[#ece6f4] p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-bold">Profile score</p>
              <p className="text-sm font-extrabold">
                {score}
                <span className="font-semibold text-ink/45">/100</span>
              </p>
            </div>
            <ProgressBar value={score} className="mt-2" />
            <p className="mt-2 text-xs text-ink/50">{score === 100 ? "Every section is filled in. Nice work." : "Fill in every section to reach 100."}</p>
          </div>
          <nav className="p-2" aria-label="Profile sections">
            {sections.map((x) => (
              <Link
                key={x.key}
                href={x.key === "info" ? "/dashboard/gbp" : `/dashboard/gbp?tab=${x.key}`}
                scroll={false}
                aria-current={x.key === tab ? "page" : undefined}
                className={clsx("flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors", x.key === tab ? "bg-[#f3e8fb]" : "hover:bg-[#f8f6fb]")}
              >
                <span className={clsx("grid size-9 shrink-0 place-items-center rounded-lg", x.key === tab ? "bg-white text-brand-700" : "bg-[#f3e8fb] text-brand-700")}>
                  <x.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{x.title}</span>
                  <span className="block truncate text-xs text-ink/55">{x.sub}</span>
                </span>
                <ChevronRight className="size-4 text-ink/30" />
              </Link>
            ))}
          </nav>
        </Card>

        <Card className="!p-6">
          <h2 className="text-xl font-bold tracking-tight">{active.title}</h2>
          <p className="mt-0.5 text-sm text-ink/60">{panelSub[tab]}</p>
          <div className="mt-5">
            {tab === "info" && <BusinessInfo p={p} mapsUrl={mapsUrl} />}
            {tab === "hours" && <HoursEditor key={JSON.stringify(p.hours)} hours={p.hours} />}
            {tab === "description" && <DescriptionEditor key={p.description} live={p.description} ctx={aiContext(s)} />}
            {tab === "categories" && (
              <CategoriesEditor key={p.categories.join("|") + p.primaryCategory} primary={p.primaryCategory} categories={p.categories} suggestions={suggestedCategories(p.primaryCategory, p.categories)} />
            )}
            {tab === "services" && <ServicesEditor key={p.services.join("|")} services={p.services} suggestions={serviceSuggestions} />}
          </div>
          {tab === "hours" && (
            <p className="mt-4 text-xs text-ink/45">
              Live on Google:{" "}
              {p.hours.map((h) => `${DAY_NAMES[h.day].slice(0, 3)} ${h.open ? `${h.open}–${h.close}` : "closed"}`).join(" · ")}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

function BusinessInfo({ p, mapsUrl }: { p: BusinessProfile; mapsUrl: string }) {
  const fields = [
    { label: "Business name", value: p.name, note: "Edit on business.google.com. Changing the name can trigger Google re-verification." },
    { label: "Address", value: p.address, note: "Moves require re-verification." },
    { label: "Phone", value: p.phone, note: "We never change your phone number on Google." },
  ];
  return (
    <div className="space-y-4">
      <Notice>Changes save directly to your live Google Business Profile. Name, address and phone are locked here to protect your verification.</Notice>
      {fields.map((f) => (
        <div key={f.label}>
          <Caps>{f.label}</Caps>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#ece6f4] bg-[#f8f6fb] px-3.5 py-2.5 text-sm">
            <span className="flex-1">{f.value || <span className="text-ink/40">Not set</span>}</span>
            <Lock className="size-4 text-ink/35" aria-label="Locked" />
          </div>
          <p className="mt-1 text-xs text-ink/50">{f.note}</p>
        </div>
      ))}
      <div>
        <Caps>Website</Caps>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#ece6f4] bg-[#f8f6fb] px-3.5 py-2.5 text-sm">
          {p.website ? (
            <a href={p.website} target="_blank" rel="noreferrer" className="flex flex-1 items-center gap-1 font-medium text-brand-700 hover:underline">
              {p.website} <ExternalLink className="size-3.5" />
            </a>
          ) : (
            <span className="flex-1 text-ink/40">Not set</span>
          )}
          <Lock className="size-4 text-ink/35" aria-label="Locked" />
        </div>
      </div>
      <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <MapPin className="size-4" /> View on Google Maps <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}
