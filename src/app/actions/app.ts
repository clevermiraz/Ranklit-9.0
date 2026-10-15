"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/server/auth";
import { mutate } from "@/lib/server/app";
import { getAccountExtras, listBusinesses } from "@/lib/server/store";
import { updateUser } from "@/lib/server/users";

/** Master Autopilot switch (sidebar + Autopilot page). */
export async function setAutopilotAction(on: boolean) {
  return mutate(({ business }) => {
    business.autopilot = on;
    business.activity.unshift({
      id: crypto.randomUUID(),
      emoji: on ? "🚀" : "⏸️",
      text: on ? "Autopilot turned on — your bot will work on schedule." : "Autopilot turned off.",
      at: new Date().toISOString(),
    });
    return { ok: on ? "Autopilot is on." : "Autopilot is off." };
  });
}

export async function switchBusinessAction(businessId: string) {
  return mutate(({ user }) => {
    const extras = getAccountExtras(user.id)!;
    if (!listBusinesses(user.id).some((b) => b.profile.id === businessId)) return { error: "Business not found." };
    extras.currentBusinessId = businessId;
    return { ok: "Switched business." };
  });
}

/** Ends the free trial early and starts billing now. */
export async function startPlanNowAction() {
  return mutate(async ({ user }) => {
    await updateUser(user.id, { trialEndsAt: null });
    return { ok: "Your plan is active. Thanks for joining!" };
  });
}

export async function signOutAction() {
  await destroySession();
  redirect("/login");
}

const automationLabels = {
  autoReply: "Auto-reply to Google reviews",
  autoPost: "Auto-post to your Google profile",
  autoCitations: "Auto-build citations",
  autoScan: "Auto-scan your map rankings",
  refreshDescription: "Refresh your Google description",
} as const;

export type AutomationKey = keyof typeof automationLabels;

/** Flips one automation; pass `value` to set it explicitly. */
export async function toggleAutomationAction(key: AutomationKey, value?: boolean) {
  return mutate(({ business }) => {
    if (!(key in automationLabels)) return { error: "Unknown automation." };
    const next = value ?? !business.automations[key];
    business.automations[key] = next;
    business.automations.reviewed = true;
    return { ok: `${automationLabels[key]} turned ${next ? "on" : "off"}.` };
  });
}
