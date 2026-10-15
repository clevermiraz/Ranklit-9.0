import "server-only";

/** Extra account settings not in the shared store (mock persistence), keyed by user id. */
export type SettingsExtras = {
  pendingEmail: string | null;
  /** businessId -> ISO date the location stops (scheduled cancellation, no refund). */
  locationCancellations: Record<string, string>;
  cancelReason: string | null;
};

const g = globalThis as unknown as { __rlSettings?: Map<string, SettingsExtras> };
const settings = (g.__rlSettings ??= new Map<string, SettingsExtras>());

export function getSettings(userId: string): SettingsExtras {
  let s = settings.get(userId);
  if (!s) {
    s = { pendingEmail: null, locationCancellations: {}, cancelReason: null };
    settings.set(userId, s);
  }
  return s;
}

/** Next renewal date for a subscription that started at `createdAt`, billed monthly or yearly. */
export function nextRenewal(createdAt: string, interval: "monthly" | "annual", from = Date.now()) {
  const d = new Date(createdAt);
  while (d.getTime() <= from) {
    if (interval === "annual") d.setFullYear(d.getFullYear() + 1);
    else d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString();
}
