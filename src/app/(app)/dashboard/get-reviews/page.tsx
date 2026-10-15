import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { getReviewExtras, requestOrigin } from "@/lib/server/reviews-store";
import { PageHeader } from "@/components/app/ui";
import { BrandingCard, QrCard, RatingsRoutingCard, ReviewLinkCard } from "@/components/app/reviews/get-reviews-client";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Get Reviews" };

export default async function GetReviewsPage() {
  const { business: s } = await getApp();
  const origin = await requestOrigin();
  const link = s.reviewLink;
  const logo = getReviewExtras(s.profile.id).logo;
  const url = `${origin}/review/${link.slug}`;

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PageHeader
        title={`Review link — ${s.profile.name}`}
        icon={MapPin}
        iconClass="text-amber-500"
        subtitle="We do the asking for you — ratings of 4 stars and above go to Google, and lower ratings reach you privately."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <ReviewLinkCard origin={origin} slug={link.slug} />
        <QrCard url={url} slug={link.slug} name={s.profile.name} accent={link.accent} />
      </div>

      <RatingsRoutingCard sendAll={link.sendAllToGoogle} />

      <BrandingCard
        key={`${link.accent}${link.font}${link.headline}${link.subtext}${link.prompt}${link.website}${logo?.length ?? 0}`}
        name={s.profile.name}
        initial={{ accent: link.accent, font: link.font, headline: link.headline, subtext: link.subtext, prompt: link.prompt, website: link.website, logo }}
      />
    </div>
  );
}
