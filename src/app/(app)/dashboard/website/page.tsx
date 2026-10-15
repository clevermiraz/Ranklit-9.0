import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ScanSearch, Sparkles } from "lucide-react";
import { getApp } from "@/lib/server/app";
import { Card, EmptyState, PageHeader, btn } from "@/components/app/ui";
import { CheckWebsiteButton, FixesList } from "@/components/app/website/fixes";

// Reads the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Optimize your website" };

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

export default async function WebsiteFixesPage() {
  const { business } = await getApp();
  const site = business.profile.website;
  const domain = domainOf(site);
  const hasStrategy = business.strategy.keywords.length > 0;

  return (
    <div className="mx-auto max-w-[944px] space-y-5">
      <PageHeader
        back={{ href: "/dashboard", label: "Back to Home" }}
        title="Optimize your website"
        subtitle={
          <>
            <p>What Google looks for on your site and can&apos;t find yet, with exactly what to add.</p>
            {domain && (
              <p className="mt-1 text-sm">
                Checking{" "}
                <a href={site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold text-ink hover:text-brand-700">
                  {domain} <ArrowUpRight className="size-3.5" />
                </a>
              </p>
            )}
          </>
        }
      />

      {!hasStrategy ? (
        <Card>
          <EmptyState
            icon={Sparkles}
            title="We'll check your site once your strategy is set"
            text="The strategy step tells us which services you want to rank for, so the suggestions use your own words instead of a guess."
          >
            <Link href="/dashboard/strategy" className={btn.primary}>
              Build my strategy
            </Link>
          </EmptyState>
        </Card>
      ) : !business.websiteChecked ? (
        <Card>
          <EmptyState
            icon={ScanSearch}
            title="Ready to check your website"
            text={`We'll read ${domain || "your site"} the way Google does and compare it against the ${business.strategy.keywords.length} keywords in your strategy. Takes a few seconds.`}
          >
            <CheckWebsiteButton domain={domain} />
          </EmptyState>
        </Card>
      ) : business.websiteFixes.length ? (
        <FixesList fixes={business.websiteFixes} />
      ) : (
        <Card>
          <EmptyState icon={Sparkles} title="Nothing to fix right now" text="Your site already covers what Google looks for. Re-check after you make changes.">
            <CheckWebsiteButton domain={domain} />
          </EmptyState>
        </Card>
      )}

      <Card className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-bold">Rather we did it for you?</p>
          <p className="text-sm text-ink/60">The Organic Growth Plan writes the pages, builds the links and cleans up your site every month.</p>
        </div>
        <Link href="/dashboard/organic-seo" className={btn.soft}>
          See the Organic Growth Plan →
        </Link>
      </Card>
    </div>
  );
}
