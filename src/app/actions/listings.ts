"use server";

import { mutate } from "@/lib/server/app";
import { markListingsSynced, syncedListings } from "@/lib/server/orders-store";
import { DIRECTORIES, directoryCoverage } from "@/components/app/listings/directories";

/** Pushes the business's details to one directory (or every out-of-sync one when `directory` is omitted). */
export async function fixListingAction(directory?: string) {
  return mutate(({ account, business }) => {
    if (account.trialEndsAt) return { error: "Listings management starts when your trial converts." };
    const bid = business.profile.id;
    const rows = directoryCoverage(bid, business.profile.connected, syncedListings(bid));
    if (directory) {
      if (!DIRECTORIES.some((d) => d.name === directory)) return { error: "Unknown directory." };
      if (directory === "Google" && !business.profile.connected) return { error: "Connect your Google profile first." };
    }
    const targets = rows
      .filter((r) => r.status !== "synced" && (directory ? r.name === directory : true))
      .filter((r) => r.name !== "Google" || business.profile.connected)
      .map((r) => r.name);
    if (!targets.length) return { ok: directory ? `${directory} is already in sync.` : "Everything is already in sync." };
    markListingsSynced(bid, targets);
    business.activity.unshift({
      id: crypto.randomUUID(),
      emoji: "🌐",
      text: targets.length === 1 ? `Listing on ${targets[0]} updated to match your Google profile.` : `${targets.length} directory listings updated to match your Google profile.`,
      at: new Date().toISOString(),
    });
    return { ok: targets.length === 1 ? `${targets[0]} is now in sync.` : `${targets.length} listings are now in sync.` };
  });
}
