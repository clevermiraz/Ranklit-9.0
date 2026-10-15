import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { getAgencyStore } from "@/lib/server/agency-store";
import { AgencyBrandingView } from "@/components/app/agency/branding-forms";

export const instant = false;

export const metadata: Metadata = {
  title: "Branding & Domain",
  description: "Configure white-label agency branding, custom CNAME domain, and email identity.",
};

export default async function AgencyBrandingPage() {
  const { user } = await getApp();
  const store = getAgencyStore(user.id);

  return <AgencyBrandingView branding={store.branding} />;
}
