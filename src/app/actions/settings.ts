"use server";

import { mutate } from "@/lib/server/app";
import { addBusiness, getAccountExtras, listBusinesses, removeBusiness } from "@/lib/server/store";
import { findUserByEmail, setPassword, updateUser } from "@/lib/server/users";
import { deleteKeyHash, displayPrefix, generateApiKey, storeKeyHash } from "@/lib/server/apikeys-store";
import { getSettings, nextRenewal } from "@/lib/server/settings-store";
import { getPlan, MAX_LOCATIONS, quote, usd } from "@/lib/pricing";
import type { ApiKey } from "@/lib/app/types";

const clean = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

// ---- account ---------------------------------------------------------------------------------

export async function updateProfileAction(input: { firstName: string; lastName: string }) {
  return mutate(async ({ user }) => {
    const first = clean(input.firstName).slice(0, 60);
    const last = clean(input.lastName).slice(0, 60);
    if (!first) return { error: "Please enter your first name." };
    await updateUser(user.id, { name: [first, last].filter(Boolean).join(" ") });
    getAccountExtras(user.id)!.lastName = last;
    return { ok: "Profile saved." };
  });
}

export async function requestEmailChangeAction(email: string) {
  return mutate(async ({ user }) => {
    const next = clean(email).toLowerCase();
    if (!EMAIL_RE.test(next)) return { error: "Enter a valid email address." };
    if (next === user.email) return { error: "That's already your email address." };
    const taken = await findUserByEmail(next);
    if (taken && taken.id !== user.id) return { error: "Another account already uses that email." };
    getSettings(user.id).pendingEmail = next;
    return { ok: `Confirmation sent to ${next} and ${user.email}. Your email changes once both links are clicked.` };
  });
}

export async function cancelEmailChangeAction() {
  return mutate(({ user }) => {
    getSettings(user.id).pendingEmail = null;
    return { ok: "Email change cancelled." };
  });
}

export async function updateBusinessInfoAction(input: { name: string; phone: string; address: string; website: string; gbpUrl: string }) {
  return mutate(async ({ user, business }) => {
    const name = clean(input.name).slice(0, 100);
    const phone = clean(input.phone).slice(0, 30);
    const address = clean(input.address).slice(0, 200);
    let website = clean(input.website);
    const gbpUrl = clean(input.gbpUrl);
    if (!name) return { error: "Business name is required." };
    if (phone && !/^[+()\d\s.-]{7,}$/.test(phone)) return { error: "That phone number doesn't look right." };
    if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;
    if (website && !isUrl(website)) return { error: "Enter a valid website URL." };
    if (gbpUrl && !isUrl(gbpUrl)) return { error: "Enter a valid Google Business Profile URL (https://…)." };

    const p = business.profile;
    p.name = name;
    p.phone = phone;
    p.website = website;
    p.gbpUrl = gbpUrl;
    if (address !== p.address) {
      p.address = address;
      const parts = address.split(",").map((x) => x.trim()).filter(Boolean);
      if (parts.length >= 3) p.city = parts[parts.length - 2];
    }
    const first = listBusinesses(user.id)[0];
    if (first?.profile.id === p.id) await updateUser(user.id, { businessName: name });
    return { ok: "Business information saved." };
  });
}

export async function changePasswordAction(password: string, confirm: string) {
  return mutate(async ({ user }) => {
    if (typeof password !== "string" || password.length < 8) return { error: "Use at least 8 characters." };
    if (password.length > 200) return { error: "That password is too long." };
    if (password !== confirm) return { error: "The passwords don't match." };
    await setPassword(user.id, password);
    return { ok: "Password updated." };
  });
}

// ---- businesses ------------------------------------------------------------------------------

export async function addBusinessAction(name: string, address: string) {
  return mutate(({ user }) => {
    const n = clean(name).slice(0, 100);
    const a = clean(address).slice(0, 200);
    if (!n) return { error: "Enter the business name." };
    if (!a) return { error: "Enter the business address." };
    const state = addBusiness(user.id, n, a);
    const parts = a.split(",").map((x) => x.trim()).filter(Boolean);
    if (parts.length >= 3) state.profile.city = parts[parts.length - 2];
    return { ok: `${n} added — you're now viewing it.` };
  });
}

export async function editBusinessAction(id: string, input: { name: string; address: string; category: string }) {
  return mutate(({ user }) => {
    const b = listBusinesses(user.id).find((x) => x.profile.id === id);
    if (!b) return { error: "Business not found." };
    const name = clean(input.name).slice(0, 100);
    const address = clean(input.address).slice(0, 200);
    const category = clean(input.category).slice(0, 80);
    if (!name || !address) return { error: "Name and address are required." };
    b.profile.name = name;
    b.profile.address = address;
    if (category) {
      b.profile.primaryCategory = category;
      b.profile.categories = [category, ...b.profile.categories.filter((c) => c !== category)].slice(0, 10);
    }
    return { ok: "Business updated." };
  });
}

export async function cancelLocationAction(id: string) {
  return mutate(({ user }) => {
    const b = listBusinesses(user.id).find((x) => x.profile.id === id);
    if (!b) return { error: "Business not found." };
    if (!removeBusiness(user.id, id)) return { error: "You can't remove your only business. Cancel your subscription instead." };
    delete getSettings(user.id).locationCancellations[id];
    return { ok: `${b.profile.name} was removed from your account.` };
  });
}

// ---- plans & billing -------------------------------------------------------------------------

export async function switchPlanAction(planId: "foundation" | "growth", interval: "monthly" | "annual", locations: number) {
  return mutate(async ({ user }) => {
    if (planId !== "foundation" && planId !== "growth") return { error: "Unknown plan." };
    if (interval !== "monthly" && interval !== "annual") return { error: "Unknown billing cadence." };
    const locs = planId === "growth" ? Math.max(1, Math.min(MAX_LOCATIONS, Math.round(Number(locations) || 1))) : 1;
    const agency = !!user.plan?.startsWith("agency-");
    const nextId = agency ? `agency-${planId}` : planId;
    if (user.plan === nextId && user.interval === interval && (planId !== "growth" || user.locations === locs)) return { error: "You're already on this plan." };
    const plan = getPlan(planId);
    const q = quote(plan, interval, Math.max(1, locs));
    await updateUser(user.id, { plan: nextId, interval, locations: Math.max(1, locs) });
    return { ok: `Switched to ${plan.name} (${interval}). You'll be charged ${usd(q.dueEachPeriod)} per ${interval === "annual" ? "year" : "month"}.` };
  });
}

const CREDIT_PACKS: Record<number, number> = { 250: 20, 500: 40, 1000: 80 };

export async function buyCreditsAction(amount: number) {
  return mutate(({ user }) => {
    const price = CREDIT_PACKS[amount];
    if (!price) return { error: "Unknown credit pack." };
    const extras = getAccountExtras(user.id)!;
    extras.credits += amount;
    return { ok: `${amount.toLocaleString()} credits added for ${usd(price)}. You now have ${extras.credits.toLocaleString()} credits.` };
  });
}

export async function cancelTrialAction() {
  return mutate(async ({ user }) => {
    if (!user.trialEndsAt) return { error: "You're not on a trial." };
    await updateUser(user.id, { plan: null, trialEndsAt: null });
    return { ok: "Your trial was cancelled. You won't be charged." };
  });
}

export async function cancelSubscriptionAction(reason: string) {
  return mutate(async ({ user }) => {
    if (!user.plan) return { error: "You don't have an active subscription." };
    getSettings(user.id).cancelReason = clean(reason).slice(0, 200) || null;
    await updateUser(user.id, { plan: null, trialEndsAt: null });
    return { ok: "Your subscription was cancelled. We're sorry to see you go." };
  });
}

/** Schedules extra locations to stop at their renewal date (no refund). */
export async function scheduleLocationCancelAction(ids: string[]) {
  return mutate(({ user }) => {
    const all = listBusinesses(user.id);
    const mainId = all[0]?.profile.id;
    const valid = ids.filter((id) => id !== mainId && all.some((b) => b.profile.id === id));
    if (!valid.length) return { error: "Tick at least one extra location to cancel." };
    const s = getSettings(user.id);
    const until = nextRenewal(user.createdAt, user.interval);
    for (const id of valid) s.locationCancellations[id] = until;
    return { ok: `${valid.length} location${valid.length === 1 ? "" : "s"} will stop at the end of the billing period.` };
  });
}

export async function undoLocationCancelAction(id: string) {
  return mutate(({ user }) => {
    delete getSettings(user.id).locationCancellations[id];
    return { ok: "Cancellation undone — this location keeps renewing." };
  });
}

// ---- alerts ----------------------------------------------------------------------------------

export async function resolveAlertAction(id: string, resolved = true) {
  return mutate(({ business }) => {
    const a = business.alerts.find((x) => x.id === id);
    if (!a) return { error: "Alert not found." };
    a.resolvedAt = resolved ? new Date().toISOString() : null;
    return { ok: resolved ? "Alert resolved." : "Alert moved back to active." };
  });
}

export async function resolveAllAlertsAction() {
  return mutate(({ business }) => {
    const now = new Date().toISOString();
    let n = 0;
    for (const a of business.alerts) {
      if (a.resolvedAt) continue;
      a.resolvedAt = now;
      n++;
    }
    return n ? { ok: `Resolved ${n} alert${n === 1 ? "" : "s"}.` } : { error: "No active alerts." };
  });
}

// ---- API keys --------------------------------------------------------------------------------

type Scope = ApiKey["scopes"][number];
const SCOPES: Scope[] = ["post", "reply", "scan"];

/** Creates a key. The full key is returned exactly once; only a prefix + hash are kept. */
export async function createApiKeyAction(name: string, scopes: Scope[]) {
  let key: string | undefined;
  const res = await mutate(({ user }) => {
    const n = clean(name).slice(0, 60);
    if (!n) return { error: "Give the key a name." };
    const extras = getAccountExtras(user.id)!;
    if (extras.apiKeys.length >= 20) return { error: "You can have up to 20 keys. Revoke one first." };
    const full = generateApiKey();
    const record: ApiKey = {
      id: crypto.randomUUID(),
      name: n,
      prefix: displayPrefix(full),
      scopes: SCOPES.filter((s) => Array.isArray(scopes) && scopes.includes(s)),
      createdAt: new Date().toISOString(),
    };
    storeKeyHash(record.id, full);
    extras.apiKeys.unshift(record);
    key = full;
    return { ok: `Key “${n}” created. Copy it now — you won't see it again.` };
  });
  return { ...res, key };
}

export async function revokeApiKeyAction(id: string) {
  return mutate(({ user }) => {
    const extras = getAccountExtras(user.id)!;
    const k = extras.apiKeys.find((x) => x.id === id);
    if (!k) return { error: "Key not found." };
    extras.apiKeys = extras.apiKeys.filter((x) => x.id !== id);
    deleteKeyHash(id);
    return { ok: `Key “${k.name}” revoked. Anything using it lost access.` };
  });
}
