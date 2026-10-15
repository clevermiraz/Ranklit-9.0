import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { PageHeader } from "@/components/app/ui";
import { MapEmbedGenerator, SchemaGenerator } from "@/components/app/website/tools";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Tools" };

export default async function ToolsPage() {
  const { business } = await getApp();
  return (
    <div className="mx-auto max-w-[944px] space-y-5">
      <PageHeader title="Tools" subtitle="Code to paste on your website, filled in from your Google profile." />
      <SchemaGenerator profile={business.profile} />
      <MapEmbedGenerator profile={business.profile} />
    </div>
  );
}
