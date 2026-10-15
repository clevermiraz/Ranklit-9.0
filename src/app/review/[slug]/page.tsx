import type { Metadata } from "next";
import { Suspense } from "react";
import { getReviewExtras, publicBusinessBySlug } from "@/lib/server/reviews-store";
import { googleReviewUrl } from "@/components/app/reviews/shared";
import { PublicReviewFlow } from "@/components/app/reviews/public-review";

export const metadata: Metadata = { title: "Leave a review", robots: { index: false, follow: false } };

/** Public, no-auth review page customers reach from the review link / QR code. */
export default function ReviewPage(props: PageProps<"/review/[slug]">) {
  return (
    <Suspense fallback={<Frame accent="#8d3ebb" />}>
      <ReviewContent params={props.params} />
    </Suspense>
  );
}

async function ReviewContent({ params }: { params: PageProps<"/review/[slug]">["params"] }) {
  const { slug } = await params;
  const b = publicBusinessBySlug(slug);

  if (!b) {
    return (
      <Frame accent="#8d3ebb">
        <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 text-center shadow-[0_12px_40px_-12px_rgba(35,25,56,.25)]">
          <p className="text-4xl">🔗</p>
          <h1 className="mt-3 text-xl font-bold">This review page isn&apos;t available</h1>
          <p className="mt-1 text-sm text-black/55">The link may have changed. Ask the business for their latest review link or QR code.</p>
        </div>
      </Frame>
    );
  }

  const link = b.reviewLink;
  const look = {
    name: b.profile.name,
    logo: getReviewExtras(b.profile.id).logo,
    accent: link.accent,
    font: link.font,
    headline: link.headline,
    subtext: link.subtext,
  };
  return (
    <Frame accent={link.accent}>
      <PublicReviewFlow slug={slug} look={look} prompt={link.prompt} googleUrl={googleReviewUrl(b.profile)} sendAllToGoogle={link.sendAllToGoogle} />
    </Frame>
  );
}

function Frame({ accent, children }: { accent: string; children?: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10" style={{ background: `color-mix(in srgb, ${accent} 7%, #f7f5fa)` }}>
      {children ?? <div className="h-80 w-full max-w-md animate-pulse rounded-2xl bg-white/70" />}
      <p className="mt-8 text-xs text-black/40">
        Powered by{" "}
        <a href="https://ranklit.com" className="font-semibold text-black/55 hover:text-black/75">
          Ranklit
        </a>
      </p>
    </main>
  );
}
