"use server";

import { mutate } from "@/lib/server/app";
import { ACCOUNT_MANAGER_EMAIL } from "@/lib/app/types";
import { ADDON_PRICES, placeOrder, requestOrganic, type AddonId } from "@/lib/server/orders-store";

export async function placeAddonOrderAction(addon: AddonId) {
  return mutate(({ business }) => {
    const meta = ADDON_PRICES[addon];
    if (!meta) return { error: "Unknown add-on." };
    placeOrder(business.profile.id, addon);
    business.activity.unshift({ id: crypto.randomUUID(), emoji: "🛒", text: `Ordered ${meta.title} ($${meta.price}).`, at: new Date().toISOString() });
    return { ok: "Order placed — we'll start within 2 business days." };
  });
}

export async function requestOrganicAction() {
  return mutate(({ business }) => {
    requestOrganic(business.profile.id);
    business.activity.unshift({ id: crypto.randomUUID(), emoji: "📈", text: "Requested the Organic Growth Plan ($299/month).", at: new Date().toISOString() });
    return { ok: `Requested — Lukas will email you from ${ACCOUNT_MANAGER_EMAIL} within 1 business day.` };
  });
}
