import "server-only";
import { headers } from "next/headers";
import type { BusinessState, Review } from "@/lib/app/types";
import { findBusinessBySlug, getBusiness } from "@/lib/server/store";

/*
 * Reviews-section state that BusinessState doesn't carry (last sync time, review-page logo),
 * plus the mock "AI" reply writer and the public lookups used by /review/[slug] and the embeds.
 */

type ReviewExtras = { lastSyncedAt: string | null; logo: string | null };

const g = globalThis as unknown as { __rlReviewExtras?: Map<string, ReviewExtras> };
const extras = (g.__rlReviewExtras ??= new Map<string, ReviewExtras>());

export function getReviewExtras(businessId: string): ReviewExtras {
  let e = extras.get(businessId);
  if (!e) {
    e = { lastSyncedAt: null, logo: null };
    extras.set(businessId, e);
  }
  return e;
}

// ---- public lookups -----------------------------------------------------------------------------

export function publicBusinessBySlug(slug: string) {
  return findBusinessBySlug(slug);
}

export function publicBusinessById(businessId: string): BusinessState | undefined {
  try {
    return getBusiness(businessId);
  } catch {
    return undefined;
  }
}

// ---- mock AI reply writer -----------------------------------------------------------------------

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const pick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];

/** Writes a short, on-brand reply. Deterministic per review so regenerating is stable but varied across reviews. */
export function draftReply(review: Review, business: BusinessState, variant = 0) {
  const first = review.author.split(" ")[0] || "there";
  const name = business.profile.name;
  const seed = hash(review.id) + variant;
  const text = review.text.toLowerCase();
  const mentions = [
    text.includes("on time") || text.includes("quick") || text.includes("same day") ? "showing up when we said we would" : null,
    text.includes("explain") || text.includes("honest") ? "keeping things clear and honest" : null,
    text.includes("friendly") ? "being friendly from start to finish" : null,
  ].filter(Boolean) as string[];

  if (review.rating >= 4) {
    const opener = pick([`Thanks so much, ${first}!`, `Thank you, ${first}!`, `${first}, thank you for the kind words!`], seed);
    const middle = mentions.length
      ? `We work hard at ${mentions[0]}, so it means a lot that you noticed.`
      : pick(
          [
            "We're really glad the job went smoothly for you.",
            "It's great to hear you had a good experience with our team.",
            `Reviews like yours help other ${business.profile.city} neighbours find us.`,
          ],
          seed >>> 3,
        );
    const extra = review.rating === 4 && text.includes("pric") ? " We hear you on price — we always try to quote clearly up front." : "";
    const close = pick([`See you next time — the ${name} team`, `We're here whenever you need us. — ${name}`, `Thanks again for choosing ${name}!`], seed >>> 5);
    return `${opener} ${middle}${extra} ${close}`;
  }
  if (review.rating === 3) {
    return `Thanks for the honest feedback, ${first}. We're glad parts of the visit went well, and we'd love to hear what would have made it a 5-star experience. Please reach out at ${business.profile.phone} — ${name}`;
  }
  const issue = text.includes("reschedul") || text.includes("late") || text.includes("wait") ? "the scheduling trouble" : "your experience";
  return `${first}, we're sorry about ${issue} — that's not the standard we hold ourselves to. We'd like to make it right. Please call us at ${business.profile.phone} and ask for the owner. — ${name}`;
}

// ---- weekly volume ----------------------------------------------------------------------------

function weekStart(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // back to Monday
  return x;
}

/** Reviews per week for the last `weeks` weeks (Monday-start), plus the 4-week trend. */
export function reviewWeeks(reviews: Review[], weeks = 12, now = Date.now()) {
  const thisWeek = weekStart(new Date(now));
  const starts = Array.from({ length: weeks }, (_, i) => {
    const d = new Date(thisWeek);
    d.setDate(d.getDate() - (weeks - 1 - i) * 7);
    return d;
  });
  const counts = starts.map(() => 0);
  for (const r of reviews) {
    const t = new Date(r.date).getTime();
    for (let i = weeks - 1; i >= 0; i--) {
      if (t >= starts[i].getTime()) {
        if (i < weeks - 1 || t <= now) counts[i]++;
        break;
      }
    }
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  const labels = starts.map((d) => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  const last4 = counts.slice(-4).reduce((a, b) => a + b, 0);
  const prior4 = counts.slice(-8, -4).reduce((a, b) => a + b, 0);
  return { labels, counts, last4, prior4, delta: last4 - prior4 };
}

export function syncedLabel(iso: string | null, now = Date.now()) {
  if (!iso) return "Not synced yet";
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 60) return "Synced just now";
  if (s < 3600) return `Synced ${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `Synced ${Math.floor(s / 3600)} hr ago`;
  return `Synced ${Math.floor(s / 86400)} d ago`;
}

/** Origin the dashboard is being served from (used to build shareable links + embed code). */
export async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "app.ranklit.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}
