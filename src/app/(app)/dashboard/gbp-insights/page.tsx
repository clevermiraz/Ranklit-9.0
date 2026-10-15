import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { btn, Card, EmptyState, PageHeader } from "@/components/app/ui";
import { Insights } from "@/components/app/gbp/insights";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Performance" };

/** When the insights cache was last refreshed (the mock refreshes on every visit, rounded to the minute). */
function lastFetched() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString();
}

export default async function GbpInsightsPage() {
  const { business: s } = await getApp();

  if (!s.profile.connected || s.insights.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-5">
        <PageHeader title="Performance" subtitle="Calls, website clicks, direction requests and views from your Google Business Profile." />
        <Card>
          <EmptyState
            icon={TrendingUp}
            title={s.profile.connected ? "No performance data yet" : "Connect Google to see your numbers"}
            text={
              s.profile.connected
                ? "Google usually shares the first numbers a few days after you connect. Check back soon."
                : "Once your Google Business Profile is linked, we pull in calls, website clicks, direction requests, messages, bookings and views — and compare them period over period."
            }
          >
            {!s.profile.connected && (
              <Link href="/dashboard/gbp" className={btn.primary}>
                Connect Google Business Profile
              </Link>
            )}
          </EmptyState>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <Insights days={s.insights} fetchedAt={lastFetched()} businessName={s.profile.name} />
    </div>
  );
}
