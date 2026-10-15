import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { getAgencyStore } from "@/lib/server/agency-store";
import { AgencyEmailsView } from "@/components/app/agency/email-forms";

export const instant = false;

export const metadata: Metadata = {
  title: "Client Emails",
  description: "Configure automated white-label client digests, photo nudges, and review nudges.",
};

export default async function AgencyEmailsPage() {
  const { user } = await getApp();
  const store = getAgencyStore(user.id);

  return <AgencyEmailsView emails={store.emails} />;
}
