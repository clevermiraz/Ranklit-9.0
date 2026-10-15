"use server";

import { mutate } from "@/lib/server/app";
import type { BusinessState, WebsiteFix } from "@/lib/app/types";

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

/** Builds the list of website fixes from the business profile + strategy (mock site check). */
function buildFixes(s: BusinessState): Omit<WebsiteFix, "id" | "done">[] {
  const p = s.profile;
  const main = s.strategy.keywords.find((k) => k.role === "main")?.term ?? `${p.primaryCategory.toLowerCase()} ${p.city.toLowerCase()}`;
  const services = [...new Set([...s.strategy.services, ...p.services])].slice(0, 3);
  const fixes: Omit<WebsiteFix, "id" | "done">[] = [
    {
      title: `Put “${main}” in your homepage title`,
      detail: `Google reads your page title first. Yours doesn't say what you do or where. Use “${p.primaryCategory} in ${p.city} | ${p.name}”.`,
      impact: "high",
    },
    {
      title: "Match your name, address and phone to Google",
      detail: `Your footer should show exactly “${p.name}, ${p.address}, ${p.phone}” so Google can tie your site to your map pin.`,
      impact: "high",
    },
    ...services.map((svc, i) => ({
      title: `Create a page for ${svc.toLowerCase()}`,
      detail: `People search for “${svc.toLowerCase()} ${p.city.toLowerCase()}”, but there's no page about it on ${domainOf(p.website)}. Give it its own page with prices, photos and a call button.`,
      impact: (i === 0 ? "high" : "medium") as WebsiteFix["impact"],
    })),
    {
      title: "Add business details code (LocalBusiness schema)",
      detail: "Copy the code from Tools and paste it into your site's <head>. It tells Google your hours, address and phone in its own language.",
      impact: "medium",
    },
    {
      title: `Mention ${p.city} and nearby areas in your main heading`,
      detail: `Your H1 should say who you help and where, e.g. “Trusted ${p.primaryCategory.toLowerCase()} serving ${p.city}”.`,
      impact: "medium",
    },
    {
      title: "Write a meta description that asks for the call",
      detail: `About 150 characters: what you do, where, and why you. End with “Call ${p.phone}”.`,
      impact: "low",
    },
    {
      title: "Embed your Google map on the contact page",
      detail: "Ties your website to your map pin. The code is ready in Tools.",
      impact: "low",
    },
    {
      title: "Show your Google reviews on the homepage",
      detail: "A reviews widget near the top builds trust and keeps visitors on the page longer.",
      impact: "low",
    },
  ];
  return fixes;
}

function apply(s: BusinessState) {
  const before = new Map(s.websiteFixes.map((f) => [f.title, f.done]));
  s.websiteFixes = buildFixes(s).map((f) => ({ ...f, id: crypto.randomUUID(), done: before.get(f.title) ?? false }));
  s.websiteChecked = true;
}

/** First check: reads the site against the strategy and lists what's missing. */
export async function checkWebsiteAction() {
  return mutate(({ business }) => {
    if (!business.strategy.keywords.length) return { error: "Build your strategy first so we know what to look for." };
    apply(business);
    business.activity.unshift({ id: crypto.randomUUID(), emoji: "🔎", text: `Website checked — ${business.websiteFixes.length} fixes found.`, at: new Date().toISOString() });
    return { ok: `Done — we found ${business.websiteFixes.length} things to fix.` };
  });
}

export async function recheckWebsiteAction() {
  return mutate(({ business }) => {
    if (!business.strategy.keywords.length) return { error: "Build your strategy first so we know what to look for." };
    apply(business);
    const open = business.websiteFixes.filter((f) => !f.done).length;
    return { ok: open ? `Checked again — ${open} fixes still open.` : "Checked again — everything's fixed. Nice work!" };
  });
}

export async function toggleWebsiteFixAction(fixId: string) {
  return mutate(({ business }) => {
    const fix = business.websiteFixes.find((f) => f.id === fixId);
    if (!fix) return { error: "That fix no longer exists. Try re-checking your site." };
    fix.done = !fix.done;
    return { ok: fix.done ? "Marked as done." : "Moved back to your to-do list." };
  });
}
