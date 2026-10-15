import type { ReactNode } from "react";
import { site } from "@/lib/site";

export const LEGAL_UPDATED = "October 1, 2026";

/** Shared layout for the Privacy Policy and Terms of Service. */
export function LegalShell({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: `${site.url}${path}` };
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="text-sm font-semibold text-brand-700">Legal</p>
      <h1 className="mt-2 text-4xl leading-none font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-ink/55">Last updated: {LEGAL_UPDATED}</p>
      <div className="prose-ranklit mt-10 [&_a]:font-medium [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:font-bold [&_li]:pl-2 [&_li]:marker:text-brand-700 [&_p]:text-ink/80 [&_ul]:space-y-3 [&_ul]:text-ink/80 [&>p:first-child]:mt-0">
        {children}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

export function SupportEmail() {
  return <a href={`mailto:${site.email}`}>{site.email}</a>;
}
