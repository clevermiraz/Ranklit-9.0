import "server-only";
import { randomUUID } from "node:crypto";

/**
 * Mock persistence for add-on orders, managed-service requests and directory-listing sync state.
 * Kept out of BusinessState so the shared store stays untouched; keyed by business id.
 */

export type AddonId = "accelerator" | "guest-post" | "ai-assessment";

export type AddonOrder = { id: string; addon: AddonId; title: string; price: number; placedAt: string };

type BusinessExtras = {
  orders: AddonOrder[];
  organicRequestedAt: string | null;
  syncedListings: string[]; // directory names fixed via "Fix"
};

const g = globalThis as unknown as { __rlOrders?: Map<string, BusinessExtras> };
const extras = (g.__rlOrders ??= new Map<string, BusinessExtras>());

function get(businessId: string): BusinessExtras {
  let e = extras.get(businessId);
  if (!e) {
    e = { orders: [], organicRequestedAt: null, syncedListings: [] };
    extras.set(businessId, e);
  }
  return e;
}

export const ADDON_PRICES: Record<AddonId, { title: string; price: number }> = {
  accelerator: { title: "Local Ranking Accelerator", price: 150 },
  "guest-post": { title: "Local Guest Post", price: 99 },
  "ai-assessment": { title: "AI Visibility Assessment", price: 99 },
};

export function listOrders(businessId: string) {
  return [...get(businessId).orders];
}

export function placeOrder(businessId: string, addon: AddonId) {
  const meta = ADDON_PRICES[addon];
  const order: AddonOrder = { id: randomUUID(), addon, title: meta.title, price: meta.price, placedAt: new Date().toISOString() };
  get(businessId).orders.unshift(order);
  return order;
}

export function organicRequestedAt(businessId: string) {
  return get(businessId).organicRequestedAt;
}

export function requestOrganic(businessId: string) {
  const e = get(businessId);
  e.organicRequestedAt ??= new Date().toISOString();
  return e.organicRequestedAt;
}

export function syncedListings(businessId: string) {
  return [...get(businessId).syncedListings];
}

export function markListingsSynced(businessId: string, directories: string[]) {
  const e = get(businessId);
  e.syncedListings = [...new Set([...e.syncedListings, ...directories])];
}
