"use server";

import { refresh } from "next/cache";
import { getApp, mutate } from "@/lib/server/app";
import { connectGoogle, getAccountExtras, startScan } from "@/lib/server/store";
import { addPhoto, getPhotos, MAX_PHOTOS, removePhoto } from "@/lib/server/gbp-store";
import type { BusinessState, Post, ProfileSuggestion, Weekday } from "@/lib/app/types";
import { WEEKDAYS } from "@/lib/app/types";
import {
  aiContext,
  BODY_MAX,
  checkPolicy,
  computeAudit,
  DESCRIPTION_MAX,
  generateDescription,
  generatePost,
  HEADLINE_MAX,
  suggestedCategories,
  type GbpPhoto,
} from "@/components/app/gbp/logic";

const now = () => new Date().toISOString();
const log = (s: BusinessState, emoji: string, text: string) => s.activity.unshift({ id: crypto.randomUUID(), emoji, text, at: now() });
const clean = (xs: string[]) => [...new Map(xs.map((x) => x.trim().replace(/\s+/g, " ")).filter(Boolean).map((x) => [x.toLowerCase(), x])).values()];

// ---- connection ---------------------------------------------------------------------------

/** Mock Google OAuth "Allow": links the profile (completes the Home onboarding step). */
export async function connectGoogleAction() {
  return mutate(({ user, business }) => {
    if (business.profile.connected) return { ok: "Your Google Business Profile is already connected." };
    // Reconnecting keeps the data we already pulled; a first connect seeds reviews, insights + a suggestion.
    if (business.insights.length) business.profile.connected = true;
    else connectGoogle(business, `${user.id}-${business.profile.id}`);
    business.profile.gbpUrl ||= `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.profile.name} ${business.profile.address}`)}`;
    log(business, "🔗", "Connected your Google Business Profile.");
    return { ok: "Google Business Profile connected." };
  });
}

export async function disconnectGoogleAction() {
  return mutate(({ business }) => {
    if (!business.profile.connected) return { error: "Your profile isn't connected." };
    business.profile.connected = false;
    log(business, "🔌", "Disconnected your Google Business Profile.");
    return { ok: "Disconnected. Your agent can't post or reply until you reconnect." };
  });
}

// ---- suggestions --------------------------------------------------------------------------

function applySuggestion(s: BusinessState, sg: ProfileSuggestion, value: string) {
  if (sg.field === "description") s.profile.description = value.trim();
  else {
    const list = clean(value.split(/[,\n]/));
    if (sg.field === "categories") {
      s.profile.primaryCategory = list[0] ?? s.profile.primaryCategory;
      s.profile.categories = list.length ? list : s.profile.categories;
    } else s.profile.services = list;
  }
}

export async function approveSuggestionAction(id: string, edited?: string) {
  return mutate(({ business }) => {
    const sg = business.suggestions.find((x) => x.id === id);
    if (!sg) return { error: "That suggestion is no longer available." };
    const value = (edited ?? sg.after).trim();
    if (!value) return { error: "The new value can't be empty." };
    if (sg.field === "description" && value.length > DESCRIPTION_MAX) return { error: `Descriptions can be at most ${DESCRIPTION_MAX} characters.` };
    if (!business.profile.connected) return { error: "Connect your Google Business Profile before approving changes." };
    applySuggestion(business, sg, value);
    business.suggestions = business.suggestions.filter((x) => x.id !== id);
    log(business, "✅", `Approved ${edited !== undefined && edited !== sg.after ? "your edited" : "the suggested"} ${sg.field} — it's live on Google.`);
    return { ok: `Your ${sg.field} is updated on Google.` };
  });
}

export async function rejectSuggestionAction(id: string) {
  return mutate(({ business }) => {
    const sg = business.suggestions.find((x) => x.id === id);
    if (!sg) return { error: "That suggestion is no longer available." };
    business.suggestions = business.suggestions.filter((x) => x.id !== id);
    log(business, "🚫", `Dismissed a suggested ${sg.field} change.`);
    return { ok: "Suggestion dismissed. Nothing changed on Google." };
  });
}

function createDescriptionSuggestion(s: BusinessState, source: string) {
  const ctx = aiContext(s);
  let after = generateDescription(ctx, s.suggestions.length + s.posts.length);
  if (after === s.profile.description) after = generateDescription(ctx, s.posts.length + 1);
  s.suggestions = s.suggestions.filter((x) => x.field !== "description");
  s.suggestions.unshift({
    id: crypto.randomUUID(),
    field: "description",
    source,
    explanation: `A fresh description built from your strategy: it names your main services${ctx.city ? ` and ${ctx.city}` : ""} in plain language, drops promotional filler, and stays under Google's 750-character limit.`,
    before: s.profile.description,
    after,
  });
  log(s, "👀", "Your bot drafted a new description for your Google profile.");
}

// ---- profile editors ----------------------------------------------------------------------

function requireConnected(s: BusinessState) {
  return s.profile.connected ? null : { error: "Connect your Google Business Profile first." };
}

const TIME = /^(1[0-2]|[1-9]):[0-5]\d (AM|PM)$/;
const minutes = (t: string) => {
  const [, h, m, ap] = t.match(/^(\d+):(\d+) (AM|PM)$/)!;
  return ((Number(h) % 12) + (ap === "PM" ? 12 : 0)) * 60 + Number(m);
};

export async function saveHoursAction(hours: { day: Weekday; open: string | null; close: string | null }[]) {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    if (hours.length !== 7 || !WEEKDAYS.every((d, i) => hours[i]?.day === d)) return { error: "Hours must include every day of the week." };
    for (const h of hours) {
      if (h.open === null && h.close === null) continue;
      if (!h.open || !h.close || !TIME.test(h.open) || !TIME.test(h.close)) return { error: `Set both an opening and closing time for ${h.day}.` };
      if (minutes(h.close) <= minutes(h.open)) return { error: `${h.day}: closing time must be after opening time.` };
    }
    business.profile.hours = hours.map((h) => ({ ...h }));
    log(business, "🕘", "Updated your opening hours on Google.");
    return { ok: "Hours saved to Google." };
  });
}

export async function saveDescriptionAction(text: string) {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    const value = text.trim().replace(/\s+\n/g, "\n");
    if (value.length < 50) return { error: "Write at least 50 characters." };
    if (value.length > DESCRIPTION_MAX) return { error: `Keep it under ${DESCRIPTION_MAX} characters.` };
    if (/(https?:\/\/|www\.)/i.test(value)) return { error: "Google doesn't allow links in the description." };
    business.profile.description = value;
    business.suggestions = business.suggestions.filter((x) => x.field !== "description");
    log(business, "📝", "Updated your Google description.");
    return { ok: "Description saved to Google." };
  });
}

export async function saveCategoriesAction(primary: string, additional: string[]) {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    const p = primary.trim();
    if (!p) return { error: "Choose a primary category." };
    const extra = clean(additional).filter((c) => c.toLowerCase() !== p.toLowerCase());
    if (extra.length > 9) return { error: "Google allows up to 9 additional categories." };
    business.profile.primaryCategory = p;
    business.profile.categories = [p, ...extra];
    log(business, "🏷️", "Updated your Google categories.");
    return { ok: "Categories saved to Google." };
  });
}

export async function saveServicesAction(services: string[]) {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    const list = clean(services);
    if (list.some((x) => x.length > 120)) return { error: "Service names can be at most 120 characters." };
    if (list.length > 50) return { error: "That's a lot of services — keep it to 50 or fewer." };
    business.profile.services = list;
    log(business, "🧰", "Updated the services on your Google profile.");
    return { ok: "Services saved to Google." };
  });
}

// ---- posts --------------------------------------------------------------------------------

export type PostInput = {
  id?: string;
  type: Post["type"];
  headline: string;
  body: string;
  cta: string | null;
  image: string | null;
  mode: "publish" | "schedule" | "draft";
  scheduledAt?: string | null;
};

function validImage(src: string | null) {
  if (!src) return true;
  if (src.startsWith("data:image/")) return src.length < 1_500_000;
  try {
    const u = new URL(src);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function savePostAction(input: PostInput) {
  return mutate(({ business }) => {
    const headline = input.headline.trim();
    const body = input.body.trim();
    if (!["Standard", "Event", "Offer", "Alert"].includes(input.type)) return { error: "Choose a post type." };
    if (!body && !(input.mode === "draft" && headline)) return { error: "Write some post content to continue." };
    if (headline.length > HEADLINE_MAX) return { error: `Headlines can be at most ${HEADLINE_MAX} characters.` };
    if (body.length > BODY_MAX) return { error: `Post content can be at most ${BODY_MAX} characters.` };
    if (!validImage(input.image)) return { error: "That image URL doesn't look right." };
    if (input.mode !== "draft") {
      const blocked = requireConnected(business);
      if (blocked) return { error: "Connect your Google Business Profile to publish. You can save a draft for now." };
      const failed = checkPolicy(headline, body).filter((r) => !r.ok && r.label !== "Length" && r.label !== "Tone");
      if (failed.length) return { error: `Policy check failed: ${failed[0].detail}` };
    }
    let date = now();
    if (input.mode === "schedule") {
      const t = input.scheduledAt ? new Date(input.scheduledAt).getTime() : NaN;
      if (!Number.isFinite(t)) return { error: "Pick a date and time to schedule the post." };
      if (t < Date.now() + 60_000) return { error: "Schedule the post for a time in the future." };
      date = new Date(t).toISOString();
    }
    const status: Post["status"] = input.mode === "publish" ? "published" : input.mode === "schedule" ? "scheduled" : "draft";
    const fields = { type: input.type, headline, body, cta: input.cta || null, image: input.image || null, status, date };

    if (input.id) {
      const post = business.posts.find((p) => p.id === input.id);
      if (!post) return { error: "That post no longer exists." };
      Object.assign(post, fields);
    } else {
      business.posts.unshift({ id: crypto.randomUUID(), byAgent: false, ...fields });
    }
    const title = headline || body.slice(0, 40);
    if (status === "published") log(business, "📝", `Published a Google post: “${title}”.`);
    if (status === "scheduled") log(business, "🗓️", `Scheduled a Google post: “${title}”.`);
    return {
      ok: status === "published" ? "Post published to Google." : status === "scheduled" ? `Post scheduled for ${new Date(date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}.` : "Draft saved.",
    };
  });
}

export async function deletePostAction(id: string) {
  return mutate(({ business }) => {
    const post = business.posts.find((p) => p.id === id);
    if (!post) return { error: "That post no longer exists." };
    business.posts = business.posts.filter((p) => p.id !== id);
    return { ok: post.status === "published" ? "Post deleted from Google." : "Post deleted." };
  });
}

export async function publishPostNowAction(id: string) {
  return mutate(({ business }) => {
    const post = business.posts.find((p) => p.id === id);
    if (!post) return { error: "That post no longer exists." };
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    if (!post.body.trim()) return { error: "Add some content before publishing." };
    const failed = checkPolicy(post.headline, post.body).filter((r) => !r.ok && r.label !== "Length" && r.label !== "Tone");
    if (failed.length) {
      post.status = "failed";
      return { error: `Google rejected the post: ${failed[0].detail}` };
    }
    post.status = "published";
    post.date = now();
    log(business, "📝", `Published a Google post: “${post.headline || post.body.slice(0, 40)}”.`);
    return { ok: "Post published to Google." };
  });
}

// ---- photo library ------------------------------------------------------------------------

export async function addPhotoAction(name: string, src: string): Promise<{ ok?: string; error?: string; photo?: GbpPhoto }> {
  const { business } = await getApp();
  if (!src.startsWith("data:image/")) return { error: "Only image files can be uploaded." };
  if (src.length > 1_500_000) return { error: "That image is too large. Try one under 5 MB." };
  if (getPhotos(business.profile.id, business.profile.name).length >= MAX_PHOTOS) return { error: `Your library is full (${MAX_PHOTOS} photos). Delete some first.` };
  const photo = addPhoto(business.profile.id, business.profile.name, name.slice(0, 80) || "Photo", src);
  refresh();
  return { ok: `Added “${photo.name}” to your library.`, photo };
}

export async function deletePhotoAction(photoId: string) {
  return mutate(({ business }) => (removePhoto(business.profile.id, business.profile.name, photoId) ? { ok: "Photo removed." } : { error: "Photo not found." }));
}

// ---- automation ---------------------------------------------------------------------------

function mainKeyword(s: BusinessState) {
  return s.strategy.keywords.find((k) => k.role === "main")?.term ?? s.strategy.targetKeywords[0] ?? `${s.profile.primaryCategory} ${s.profile.city}`.toLowerCase();
}

/** The agent's post: random strategy keyword, a photo not used in the last 5 posts, policy-checked. */
function agentPost(s: BusinessState) {
  const terms = s.strategy.keywords.length ? s.strategy.keywords.map((k) => k.term) : [mainKeyword(s)];
  const keyword = terms[Math.floor(Math.random() * terms.length)];
  const ctx = aiContext(s);
  const draft = generatePost(ctx, "Standard", "", "friendly", Math.floor(Math.random() * 10));
  const body = `Searching for ${keyword}? ${draft.body}`;
  const recent = new Set(s.posts.slice(0, 5).map((p) => p.image));
  const library = getPhotos(s.profile.id, s.profile.name);
  const fresh = library.filter((p) => !recent.has(p.src));
  const photo = (fresh.length ? fresh : library)[Math.floor(Math.random() * Math.max(1, (fresh.length ? fresh : library).length))];
  const policy = checkPolicy(draft.headline, body);
  const post: Post = {
    id: crypto.randomUUID(),
    type: "Standard",
    headline: draft.headline,
    body,
    cta: draft.cta,
    image: photo?.src ?? null,
    status: policy.every((r) => r.ok || r.label === "Length" || r.label === "Tone") ? "published" : "failed",
    date: now(),
    byAgent: true,
  };
  s.posts.unshift(post);
  log(s, "📝", post.status === "published" ? `Your agent published a Google post: “${post.headline}”.` : `Your agent's post failed a policy check: “${post.headline}”.`);
  return post;
}

export async function runAgentNowAction() {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    const post = agentPost(business);
    return post.status === "published" ? { ok: `Published “${post.headline}”.` } : { error: "The draft failed a policy check, so it wasn't published." };
  });
}

export async function refreshDescriptionAction() {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    createDescriptionSuggestion(business, "FROM AGENT");
    return { ok: "New description drafted — approve it on your Profile page." };
  });
}

export async function runEverythingAction() {
  return mutate(({ user, business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    const post = agentPost(business);
    createDescriptionSuggestion(business, "FROM AGENT");
    const photos = getPhotos(business.profile.id, business.profile.name).length;
    if (business.audit) business.audit = computeAudit(business, photos, Date.now());
    const extras = getAccountExtras(user.id);
    const cost = business.scanArea.grid * business.scanArea.grid;
    const keyword = mainKeyword(business);
    let scanned = false;
    if (extras && extras.credits >= cost) {
      extras.credits -= cost;
      startScan(business, keyword, business.scanArea, "autopilot");
      scanned = true;
    }
    log(business, "⚡", "Ran every agent task now.");
    return {
      ok: `Done: ${post.status === "published" ? "published a post" : "drafted a post"}, drafted a description${business.audit ? ", refreshed your audit" : ""}${scanned ? `, and started a map scan for “${keyword}”` : " (not enough credits for a map scan)"}.`,
    };
  });
}

// ---- audit --------------------------------------------------------------------------------

export async function runAuditAction() {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    const photos = getPhotos(business.profile.id, business.profile.name).length;
    business.audit = computeAudit(business, photos, Date.now());
    log(business, "🩺", `Profile audit finished — health score ${business.audit.score}/100.`);
    return { ok: `Audit complete. Health score: ${business.audit.score}/100.` };
  });
}

export async function fixDescriptionAction() {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    createDescriptionSuggestion(business, "FROM AUDIT");
    return { ok: "Rewrite ready — approve it under “Changes awaiting your approval” on your Profile." };
  });
}

export async function fixCategoriesAction() {
  return mutate(({ business }) => {
    const blocked = requireConnected(business);
    if (blocked) return blocked;
    const next = suggestedCategories(business.profile.primaryCategory, business.profile.categories)[0];
    if (!next) return { error: "No more category suggestions for your business." };
    if (business.profile.categories.length >= 10) return { error: "You already have the maximum number of categories." };
    business.profile.categories.push(next);
    business.audit = computeAudit(business, getPhotos(business.profile.id, business.profile.name).length, Date.now());
    log(business, "🏷️", `Added “${next}” as a category on Google.`);
    return { ok: `Added “${next}” to your categories.` };
  });
}
