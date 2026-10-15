import type { Metadata } from "next";
import { AlertCircle, MessageSquare, Sparkles, Star } from "lucide-react";
import type { BusinessState } from "@/lib/app/types";
import { getApp } from "@/lib/server/app";
import { getReviewExtras, reviewWeeks, syncedLabel } from "@/lib/server/reviews-store";
import { PageHeader, StatCard } from "@/components/app/ui";
import { avgRating } from "@/components/app/reviews/shared";
import { ReviewsPerWeek } from "@/components/app/reviews/weekly-chart";
import { AutoReplyCard, FeedbackInbox, ReviewsHeaderActions, ReviewsList } from "@/components/app/reviews/reviews-client";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Reviews" };

function reviewsData(s: BusinessState) {
  const now = Date.now();
  const weeks = reviewWeeks(s.reviews, 12, now);
  return {
    weeks,
    avg: avgRating(s.reviews),
    unreplied: s.reviews.filter((r) => r.status === "unreplied").length,
    drafts: s.reviews.filter((r) => r.status === "draft").length,
    synced: syncedLabel(getReviewExtras(s.profile.id).lastSyncedAt, now),
  };
}

export default async function ReviewsPage() {
  const { business: s } = await getApp();
  const d = reviewsData(s);

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PageHeader
        title="Reviews"
        subtitle="Manage and respond to your Google reviews"
        actions={<ReviewsHeaderActions syncedLabel={d.synced} unreplied={d.unreplied} connected={s.profile.connected} />}
      />

      <AutoReplyCard on={s.automations.autoReply} />

      <div className="grid gap-5 lg:grid-cols-2">
        <ReviewsPerWeek labels={d.weeks.labels} counts={d.weeks.counts} delta={d.weeks.delta} last4={d.weeks.last4} total={s.reviews.length} avg={d.avg} />
        <FeedbackInbox feedback={s.feedback} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reviews" value={s.reviews.length} icon={MessageSquare} tone="purple" />
        <StatCard label="Average Rating" value={s.reviews.length ? d.avg.toFixed(1) : "—"} icon={Star} tone="amber" />
        <StatCard label="Unreplied" value={d.unreplied} icon={AlertCircle} tone="red" />
        <StatCard label="AI Drafts Ready" value={d.drafts} icon={Sparkles} tone="blue" />
      </div>

      <ReviewsList reviews={s.reviews} connected={s.profile.connected} />
    </div>
  );
}
