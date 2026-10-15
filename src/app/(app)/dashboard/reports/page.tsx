import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { getAgencyStore } from "@/lib/server/agency-store";
import { AgencyReportsView } from "@/components/app/agency/reports-client";

export const instant = false;

export const metadata: Metadata = {
  title: "Client Reports",
  description: "Generate and publish white-label monthly SEO performance reports for clients.",
};

export default async function AgencyReportsPage() {
  const { user, account } = await getApp();
  const store = getAgencyStore(user.id);

  const businesses = account.businesses.map((b) => ({
    id: b.id,
    name: b.name,
  }));

  return (
    <AgencyReportsView
      branding={store.branding}
      businesses={businesses}
      reports={store.reports}
    />
  );
}
