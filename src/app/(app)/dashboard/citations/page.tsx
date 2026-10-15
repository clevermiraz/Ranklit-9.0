import type { Metadata } from "next";
import { CheckCircle2, Clock, Link2 } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { Card, CardHeader, EmptyState, PageHeader, ProgressBar, StatCard } from "@/components/app/ui";
import { CitationsTable } from "@/components/app/listings/citations-table";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Citations" };

export default async function CitationsPage() {
  const { business } = await getApp();
  const citations = business.citations;
  const built = citations.filter((c) => c.status === "built").length;
  const pending = citations.filter((c) => c.status === "pending").length;
  const progress = citations.length ? Math.round((built / citations.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PageHeader title="Citations" subtitle="Directory listings boosting your local search authority" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Built" value={built} icon={CheckCircle2} tone="green" />
        <StatCard label="Pending" value={pending} icon={Clock} tone="amber" />
        <StatCard label="Progress" value={`${progress}%`}>
          <ProgressBar value={progress} tone="green" className="mt-2" />
        </StatCard>
      </div>

      <Card>
        <CardHeader
          icon={Link2}
          tone="teal"
          title="Directory Citations"
          description={citations.length ? "Directory listings built for your business by your SEO bot" : "Directory listings will appear here once your citations are uploaded."}
        />
        <div className="mt-4">
          {citations.length ? (
            <CitationsTable citations={citations} />
          ) : (
            <EmptyState
              icon={Link2}
              tone="teal"
              title="No listings yet"
              text="As soon as your account is set up, the directory listings we build for your business will start appearing here."
            />
          )}
        </div>
      </Card>
    </div>
  );
}
