import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { getAgencyStore, getClientAccess } from "@/lib/server/agency-store";
import { getBusiness } from "@/lib/server/store";
import { AgencyClientsView, type ClientRowData } from "@/components/app/agency/client-table";

export const instant = false;

export const metadata: Metadata = {
  title: "Agency Clients",
  description: "Manage client locations, white-label dashboards, and client reports.",
};

export default async function AgencyPage() {
  const { user, account } = await getApp();
  const store = getAgencyStore(user.id);

  const clientRows: ClientRowData[] = account.businesses.map((b) => {
    let avgRank = "No scan yet";
    let top3: string | undefined = undefined;
    let rating = 5.0;
    let reviewsCount = 3;

    try {
      const fullBiz = getBusiness(b.id);
      if (fullBiz.scans && fullBiz.scans.length > 0) {
        const latestScan = fullBiz.scans[0];
        const validRanks = latestScan.points.filter((r): r is number => typeof r === "number" && r > 0);
        if (validRanks.length > 0) {
          const avg = validRanks.reduce((a, c) => a + c, 0) / validRanks.length;
          avgRank = `#${avg.toFixed(1)}`;
          const inTop3 = validRanks.filter((r) => r <= 3).length;
          top3 = `${Math.round((inTop3 / validRanks.length) * 100)}%`;
        }
      }
      if (fullBiz.reviews && fullBiz.reviews.length > 0) {
        reviewsCount = fullBiz.reviews.length;
        const totalStars = fullBiz.reviews.reduce((sum, r) => sum + r.rating, 0);
        rating = +(totalStars / fullBiz.reviews.length).toFixed(1);
      }
    } catch {
      // fallback
    }

    const portal = getClientAccess(user.id, b.id);

    return {
      id: b.id,
      name: b.name,
      address: b.address,
      category: b.category,
      avgRank,
      top3,
      rating,
      reviewsCount,
      portal,
    };
  });

  const domain =
    store.branding.domainType === "custom"
      ? store.branding.customDomain
      : `${store.branding.instantSubdomain || "agency"}.clients.ranklit.com`;

  return <AgencyClientsView branding={store.branding} clients={clientRows} domain={domain} />;
}
