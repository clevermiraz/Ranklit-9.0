"use server";

import { mutate } from "@/lib/server/app";
import { draftReply, getReviewExtras, publicBusinessBySlug } from "@/lib/server/reviews-store";
import { findBusinessBySlug } from "@/lib/server/store";
import { HEX_RE, REVIEW_FONTS, slugError } from "@/components/app/reviews/shared";

const now = () => new Date().toISOString();
const rid = () => crypto.randomUUID();

// ---- Reviews page ------------------------------------------------------------------------------

export async function syncReviewsAction() {
  return mutate(({ business }) => {
    if (!business.profile.connected) return { error: "Connect your Google Business Profile first so we can read your reviews." };
    getReviewExtras(business.profile.id).lastSyncedAt = now();
    let auto = 0;
    if (business.automations.autoReply) {
      for (const r of business.reviews) {
        if (r.rating >= 4 && r.status !== "replied") {
          r.reply = r.reply ?? draftReply(r, business);
          r.status = "replied";
          auto++;
        }
      }
      if (auto) business.activity.unshift({ id: rid(), emoji: "💬", text: `Your bot replied to ${auto} review${auto === 1 ? "" : "s"} automatically.`, at: now() });
    }
    const count = business.reviews.length;
    return {
      ok: `Synced ${count} review${count === 1 ? "" : "s"} from Google — no new reviews.${auto ? ` Auto-replied to ${auto}.` : ""}`,
    };
  });
}

export async function generateAllRepliesAction() {
  return mutate(({ business }) => {
    const todo = business.reviews.filter((r) => r.status === "unreplied");
    if (!todo.length) return { error: "Every review already has a reply or a draft." };
    for (const r of todo) {
      r.reply = draftReply(r, business);
      r.status = "draft";
    }
    return { ok: `Drafted ${todo.length} repl${todo.length === 1 ? "y" : "ies"}. Review and post them below.` };
  });
}

export async function generateReplyAction(reviewId: string, variant = 0) {
  let reply = "";
  const res = await mutate(({ business }) => {
    const r = business.reviews.find((x) => x.id === reviewId);
    if (!r) return { error: "Review not found." };
    if (r.status === "replied") return { error: "This review already has a reply." };
    reply = draftReply(r, business, variant);
    r.reply = reply;
    r.status = "draft";
    return { ok: "AI draft ready — edit it before posting if you like." };
  });
  return { ...res, reply };
}

function cleanReply(text: string) {
  const t = text.trim();
  if (!t) return { error: "Write a reply first." };
  if (t.length > 4000) return { error: "Google limits replies to 4,000 characters." };
  return { text: t };
}

export async function saveDraftAction(reviewId: string, text: string) {
  return mutate(({ business }) => {
    const r = business.reviews.find((x) => x.id === reviewId);
    if (!r) return { error: "Review not found." };
    const c = cleanReply(text);
    if ("error" in c) return c;
    r.reply = c.text;
    if (r.status !== "replied") r.status = "draft";
    return { ok: "Draft saved." };
  });
}

export async function postReplyAction(reviewId: string, text: string) {
  return mutate(({ business }) => {
    const r = business.reviews.find((x) => x.id === reviewId);
    if (!r) return { error: "Review not found." };
    if (!business.profile.connected) return { error: "Connect your Google Business Profile to post replies." };
    const c = cleanReply(text);
    if ("error" in c) return c;
    const wasReplied = r.status === "replied";
    r.reply = c.text;
    r.status = "replied";
    business.activity.unshift({ id: rid(), emoji: "💬", text: `Replied to ${r.author}'s ${r.rating}★ review.`, at: now() });
    return { ok: wasReplied ? "Reply updated on Google." : "Reply posted to Google." };
  });
}

export async function discardDraftAction(reviewId: string) {
  return mutate(({ business }) => {
    const r = business.reviews.find((x) => x.id === reviewId);
    if (!r) return { error: "Review not found." };
    if (r.status === "replied") return { error: "Posted replies can't be discarded here." };
    r.reply = null;
    r.status = "unreplied";
    return { ok: "Draft discarded." };
  });
}

export async function setAutoReplyAction(on: boolean) {
  return mutate(({ business }) => {
    business.automations.autoReply = on;
    business.activity.unshift({ id: rid(), emoji: on ? "🤖" : "⏸️", text: on ? "Automatic review replies turned on." : "Automatic review replies paused.", at: now() });
    return { ok: on ? "Automatic replies are on — your bot will answer new 4–5★ reviews." : "Automatic replies paused." };
  });
}

export async function dismissFeedbackAction(feedbackId: string) {
  return mutate(({ business }) => {
    const before = business.feedback.length;
    business.feedback = business.feedback.filter((f) => f.id !== feedbackId);
    if (business.feedback.length === before) return { error: "Feedback not found." };
    return { ok: "Feedback archived." };
  });
}

// ---- Get Reviews page ----------------------------------------------------------------------------

export async function updateSlugAction(slug: string) {
  return mutate(({ business }) => {
    const s = slug.trim().toLowerCase();
    const err = slugError(s);
    if (err) return { error: err };
    if (s === business.reviewLink.slug) return { ok: "That's already your link." };
    const taken = findBusinessBySlug(s);
    if (taken) return { error: "That link is taken — try adding your city or a number." };
    business.reviewLink.slug = s;
    return { ok: "Review link updated. Your old link and QR code no longer work — reprint any cards." };
  });
}

export async function setSendAllToGoogleAction(on: boolean) {
  return mutate(({ business }) => {
    business.reviewLink.sendAllToGoogle = on;
    return { ok: on ? "Every rating now goes to Google." : "Ratings below 4 stars now come to you privately." };
  });
}

export type BrandingInput = {
  accent: string;
  font: string;
  headline: string;
  subtext: string;
  prompt: string;
  website: string;
  logo: string | null;
};

export async function saveBrandingAction(input: BrandingInput) {
  return mutate(({ business }) => {
    if (!HEX_RE.test(input.accent)) return { error: "Accent colour must be a hex value like #8d3ebb." };
    if (!(REVIEW_FONTS as readonly string[]).includes(input.font)) return { error: "Pick a font from the list." };
    const headline = input.headline.trim();
    if (!headline) return { error: "Add a headline." };
    if (headline.length > 120) return { error: "Keep the headline under 120 characters." };
    if (input.subtext.trim().length > 200) return { error: "Keep the subtext under 200 characters." };
    if (!input.prompt.trim()) return { error: "Add a feedback prompt." };
    if (input.prompt.trim().length > 400) return { error: "Keep the feedback prompt under 400 characters." };
    const website = input.website.trim();
    if (website && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(website)) return { error: "Website must be a full URL, like https://yourbusiness.com." };
    if (input.logo && (!/^data:image\/(png|jpeg|webp|gif);base64,/.test(input.logo) || input.logo.length > 600_000)) {
      return { error: "Logo must be a PNG, JPG, WebP or GIF under 400 KB." };
    }
    Object.assign(business.reviewLink, {
      accent: input.accent.toLowerCase(),
      font: input.font,
      headline,
      subtext: input.subtext.trim(),
      prompt: input.prompt.trim(),
      website,
    });
    getReviewExtras(business.profile.id).logo = input.logo;
    return { ok: "Branding saved — your review page is updated." };
  });
}

const BRAND_PALETTE = ["#1a73e8", "#0f766e", "#c2410c", "#be123c", "#4338ca", "#15803d", "#0e7490", "#7c3aed", "#b45309", "#1e3a8a"];
const BRAND_FONTS = ["Inter", "Montserrat", "Poppins", "Open Sans", "Lato", "Nunito"];

/** Mock "pull brand from website": derives a stable accent + font from the domain. */
export async function matchBrandAction(website: string) {
  const url = website.trim();
  let host: string;
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    host = u.hostname.replace(/^www\./, "");
    if (!host.includes(".")) throw new Error("bad host");
  } catch {
    return { error: "Enter a website like https://yourbusiness.com." };
  }
  // Pretend to fetch the site.
  await new Promise((r) => setTimeout(r, 700));
  let h = 0;
  for (const ch of host) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return {
    ok: `Matched your brand from ${host}.`,
    accent: BRAND_PALETTE[h % BRAND_PALETTE.length],
    font: BRAND_FONTS[(h >>> 4) % BRAND_FONTS.length],
    website: `https://${host}`,
  };
}

// ---- Public review page (no auth) ------------------------------------------------------------------

export async function submitFeedbackAction(input: { slug: string; rating: number; name: string; contact: string; text: string }) {
  const business = publicBusinessBySlug(String(input.slug));
  if (!business) return { error: "This review page is no longer available." };
  const rating = Math.round(Number(input.rating));
  if (!(rating >= 1 && rating <= 5)) return { error: "Pick a star rating first." };
  const text = String(input.text ?? "").trim();
  if (text.length < 3) return { error: "Tell us a little about what happened." };
  if (text.length > 2000) return { error: "Please keep it under 2,000 characters." };
  const name = String(input.name ?? "").trim().slice(0, 80);
  const contact = String(input.contact ?? "").trim().slice(0, 120);
  if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^[+()\d\s.-]{7,}$/.test(contact)) {
    return { error: "Enter a valid email or phone number, or leave it blank." };
  }
  const at = now();
  business.feedback.unshift({
    id: rid(),
    name: (name || "Anonymous") + (contact ? ` · ${contact}` : ""),
    rating,
    text,
    date: at,
  });
  business.activity.unshift({ id: rid(), emoji: "📥", text: `New private feedback (${rating}★) from your review page.`, at });
  business.alerts.unshift({ id: rid(), severity: "warning", message: `New ${rating}★ private feedback from your review page`, createdAt: at, resolvedAt: null });
  return { ok: "Thanks — your feedback went straight to the owner." };
}
