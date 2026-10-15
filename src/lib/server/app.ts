import "server-only";
import { refresh } from "next/cache";
import type { Account, BusinessState } from "@/lib/app/types";
import { requireUser } from "@/lib/server/auth";
import { DEMO_EMAIL, type PublicUser } from "@/lib/server/users";
import { ensureAccount, getBusiness, listBusinesses } from "@/lib/server/store";
import { getCheckoutPlan } from "@/lib/pricing";

export type AppCtx = { user: PublicUser; account: Account; business: BusinessState };

/** Signed-in user + their account + the business the dashboard is focused on. Reads cookies: use inside Suspense. */
export async function getApp(): Promise<AppCtx> {
  const user = await requireUser();
  const extras = ensureAccount(user.id, { businessName: user.businessName, populated: user.email === DEMO_EMAIL });
  const business = getBusiness(extras.currentBusinessId);
  const plan = getCheckoutPlan(user.plan);
  const growth = !!user.plan && /growth|agency/.test(user.plan);
  const trialDaysLeft = user.trialEndsAt ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / 864e5)) : 0;
  const [firstName, ...rest] = user.name.split(" ");

  const account: Account = {
    userId: user.id,
    firstName,
    lastName: extras.lastName || rest.join(" "),
    email: user.email,
    planId: user.plan,
    planName: plan?.name ?? "No plan",
    interval: user.interval,
    trialEndsAt: trialDaysLeft > 0 ? user.trialEndsAt : null,
    trialDaysLeft,
    credits: extras.credits,
    monthlyCredits: growth ? 4000 : 2000,
    maxKeywords: growth ? 20 : 10,
    maxGrid: 9,
    accountManager: "Lukas",
    apiKeys: extras.apiKeys,
    businesses: listBusinesses(user.id).map((b) => ({
      id: b.profile.id,
      name: b.profile.name,
      address: b.profile.address,
      category: b.profile.primaryCategory,
      kind: b.profile.kind,
    })),
    currentBusinessId: extras.currentBusinessId,
  };
  return { user, account, business };
}

export type ActionResult = { ok?: string; error?: string };

/**
 * Wraps a dashboard mutation: loads the current business, runs `fn`, then refreshes the router
 * so server components re-render with the new state.
 */
export async function mutate(fn: (ctx: AppCtx) => ActionResult | void | Promise<ActionResult | void>): Promise<ActionResult> {
  const ctx = await getApp();
  const result = (await fn(ctx)) ?? {};
  if (!result.error) refresh();
  return result;
}
