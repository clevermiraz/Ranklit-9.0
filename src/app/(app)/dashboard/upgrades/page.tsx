import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { listOrders, organicRequestedAt, type AddonId } from "@/lib/server/orders-store";
import { Card, PageHeader } from "@/components/app/ui";
import { AddonsGrid } from "@/components/app/addons/addons-grid";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Add-ons" };

export default async function UpgradesPage() {
  const { business } = await getApp();
  const orders = listOrders(business.profile.id);
  const ordered: Partial<Record<AddonId, string>> = {};
  for (const o of orders) ordered[o.addon] ??= o.placedAt;

  return (
    <div className="mx-auto max-w-[840px] space-y-6">
      <PageHeader title="Add-ons" subtitle="Done-for-you boosts and member perks to accelerate your local rankings." />

      {orders.length > 0 && (
        <Card className="!py-4">
          <p className="text-sm font-bold">Your orders</p>
          <ul className="mt-2 divide-y divide-[#f1ecf7] text-sm">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2">
                <span>
                  <span className="font-semibold">{o.title}</span> <span className="text-ink/50">· ${o.price}</span>
                </span>
                <span suppressHydrationWarning className="text-xs text-ink/55">
                  Placed {new Date(o.placedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · Starting within 2 business days
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <AddonsGrid ordered={ordered} organicRequested={!!organicRequestedAt(business.profile.id)} />
    </div>
  );
}
