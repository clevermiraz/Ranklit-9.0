import type { Metadata } from "next";
import { getApp } from "@/lib/server/app";
import { Card, PageHeader, formatDate } from "@/components/app/ui";
import { ApiKeys, ConnectAI } from "@/components/app/settings/api";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "AI & API" };

export default async function ApiPage() {
  const { account, business } = await getApp();
  const keys = account.apiKeys.map((k) => ({ ...k, created: formatDate(k.createdAt, "long") }));

  return (
    <div className="mx-auto max-w-[840px] space-y-5">
      <PageHeader
        title="AI & API"
        subtitle="Connect Claude, Cursor, Codex or another AI assistant to your account. It can read your rankings, reviews, AI visibility and reports, and, if you allow it, post to Google, reply to reviews and run map scans."
      />
      <Card>
        <ConnectAI business={business.profile.name} />
      </Card>
      <Card>
        <ApiKeys keys={keys} />
      </Card>
    </div>
  );
}
