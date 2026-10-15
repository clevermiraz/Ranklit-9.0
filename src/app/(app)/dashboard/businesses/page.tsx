import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { PageHeader } from "@/components/app/ui";
import { AddBusinessButton, BusinessCard } from "@/components/app/settings/businesses";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "My businesses" };

export default async function BusinessesPage() {
  const { account } = await getApp();
  const list = [...account.businesses].sort((a, b) => Number(b.id === account.currentBusinessId) - Number(a.id === account.currentBusinessId));

  return (
    <div className="mx-auto max-w-[944px] space-y-5">
      <PageHeader
        title="My businesses"
        subtitle={
          <>
            Every business here is fully covered by your subscription — Google posts, review replies, rank scans, and citations run for all of them. Switch which one the dashboard is{" "}
            <em>focused on</em> to open its reports, reviews, and settings.
          </>
        }
        actions={<AddBusinessButton />}
      />
      <div className="space-y-3">
        {list.map((b) => (
          <BusinessCard key={`${b.id}-${b.name}-${b.address}-${b.category}`} biz={b} current={b.id === account.currentBusinessId} onlyOne={account.businesses.length <= 1} />
        ))}
      </div>
      <p className="text-center text-xs text-ink/50">
        {account.businesses.length} business{account.businesses.length === 1 ? "" : "es"} on your account
      </p>
    </div>
  );
}
