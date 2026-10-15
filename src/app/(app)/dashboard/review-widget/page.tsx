import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Lock } from "lucide-react";
import type { BusinessState } from "@/lib/app/types";
import { getApp } from "@/lib/server/app";
import { requestOrigin } from "@/lib/server/reviews-store";
import { Card, CardHeader, PageHeader } from "@/components/app/ui";
import { avgRating, googleReviewUrl } from "@/components/app/reviews/shared";
import type { WidgetData } from "@/components/app/reviews/widget-render";
import { WidgetBuilder } from "@/components/app/reviews/widget-client";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Review Widget" };

const STEPS = [
  { title: "Copy the embed code", text: "Use the Copy button above. It includes the look you picked." },
  { title: "Open your website editor", text: "Go to the page where you want reviews — home page, testimonials, or a service page." },
  { title: "Add a custom HTML block", text: "Every site builder has one — it might be called Embed, Code, or Custom HTML. Paste the code in." },
  { title: "Publish", text: "Save and publish your page. Your reviews appear right away and stay in sync with Google." },
];

const PLATFORMS = [
  { name: "WordPress", text: "Add a Custom HTML block in the editor and paste the code." },
  { name: "Squarespace", text: "Click + to add a Code block, then paste the code and turn off “Display source”." },
  { name: "Wix", text: "Add → Embed Code → Embed HTML, choose “Code” and paste." },
  { name: "Webflow", text: "Drag an Embed element onto the page and paste the code." },
  { name: "Shopify", text: "Online Store → Themes → Customize → Add section → Custom Liquid, then paste." },
  { name: "GoHighLevel", text: "In the website or funnel builder, add a Custom JS/HTML element and paste." },
  { name: "Plain HTML", text: "Paste it into your page's HTML wherever the reviews should appear." },
];

function widgetData(s: BusinessState): { data: WidgetData; now: number } {
  const reviews = [...s.reviews].sort((a, b) => b.date.localeCompare(a.date));
  return {
    now: Date.now(),
    data: {
      business: { name: s.profile.name, rating: Math.round(avgRating(reviews) * 10) / 10, total: reviews.length, reviewUrl: googleReviewUrl(s.profile) },
      reviews: reviews.map((r) => ({ id: r.id, author: r.author, rating: r.rating, text: r.text, date: r.date })),
    },
  };
}

export default async function ReviewWidgetPage() {
  const { account, business: s } = await getApp();
  const origin = await requestOrigin();
  const clean = /growth|agency/.test(account.planId ?? "");
  const { data, now } = widgetData(s);

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PageHeader
        title="Review Widget"
        icon={Code2}
        iconClass="text-amber-500"
        subtitle="Embed your best Google reviews on your own website. Copy one snippet, paste it where you want the reviews to appear."
      />

      {!clean && (
        <Card className="flex items-start gap-3 !border-brand-200 !bg-[#f6f0fb]">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand-700">
            <Lock className="size-4" />
          </span>
          <div className="text-sm">
            <p className="font-bold">Your embeds include a &ldquo;Powered by Ranklit&rdquo; footer</p>
            <p className="mt-0.5 text-ink/60">
              The {account.planName === "No plan" ? "Foundation" : account.planName} plan includes the review widget for free with attribution.{" "}
              <Link href="/settings/plans" className="font-semibold text-brand-700 underline underline-offset-2">
                Upgrade to Growth
              </Link>{" "}
              to ship clean embeds without the badge.
            </p>
          </div>
        </Card>
      )}

      {!s.reviews.length && (
        <Card className="!border-amber-200 !bg-amber-50/50 !py-3 text-sm text-ink/70">
          You don&apos;t have any Google reviews yet, so the widget shows an empty state. {s.profile.connected ? "Share your review link to get the first ones in." : "Connect your Google profile to pull them in."}{" "}
          <Link href={s.profile.connected ? "/dashboard/get-reviews" : "/dashboard/gbp"} className="font-semibold text-amber-700 underline underline-offset-2">
            {s.profile.connected ? "Get reviews" : "Connect Google"}
          </Link>
        </Card>
      )}

      <WidgetBuilder data={data} now={now} origin={origin} businessId={s.profile.id} branding={!clean} />

      <Card>
        <CardHeader title="How to add it to your site" description="Takes about two minutes. No developer needed." />
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((st, i) => (
            <li key={st.title} className="rounded-xl border border-[#ece6f4] bg-[#fbfaff] p-4">
              <span className="grid size-7 place-items-center rounded-full bg-amber-500 text-xs font-bold text-white">{i + 1}</span>
              <p className="mt-2 text-sm font-semibold">{st.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink/55">{st.text}</p>
            </li>
          ))}
        </ol>

        <p className="mt-6 mb-2 text-[11px] font-bold tracking-[0.12em] text-ink/45 uppercase">Where to paste it</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((p) => (
            <div key={p.name} className="rounded-xl border border-[#ece6f4] p-3">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink/55">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-ink/55">
          Not showing up? Make sure you pasted the whole snippet — both the <code className="rounded bg-[#f3eefa] px-1 font-mono text-xs">&lt;div&gt;</code> and the{" "}
          <code className="rounded bg-[#f3eefa] px-1 font-mono text-xs">&lt;script&gt;</code> — and that your plan with your site builder allows custom code. Still stuck? Email{" "}
          <a href="mailto:support@ranklit.com" className="font-semibold text-brand-700">
            support@ranklit.com
          </a>{" "}
          and we&apos;ll add it for you.
        </p>
      </Card>
    </div>
  );
}
