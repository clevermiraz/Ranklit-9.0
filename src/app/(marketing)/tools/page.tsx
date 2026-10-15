import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolIcon } from "@/components/tools/tool-icon";
import { toolCategories, tools, toolsInCategory } from "@/lib/data/tools";

export const metadata: Metadata = {
  title: `${tools.length} Free Local SEO Tools for Keyword Research & Rankings`,
  description: `${tools.length} free local SEO tools sorted by task: keyword research, rankings and visibility, citations, reviews, audits, and content and branding. No signup needed.`,
};

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">Free tools</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">Free local SEO tools</h1>
        <p className="mt-4 text-lg text-ink/65">
          {tools.length} free calculators and AI generators, sorted by what you&apos;re trying to get done. No signup needed.
        </p>
      </div>

      <nav aria-label="Tool categories" className="mt-8 flex flex-wrap gap-2">
        {toolCategories.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium text-ink/75 shadow-sm transition hover:border-brand-700/30 hover:text-brand-700"
          >
            <ToolIcon name={cat.icon} className="size-4 text-brand-700" />
            {cat.label}
            <span className="text-ink/40">{toolsInCategory(cat.id).length}</span>
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {toolCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-24" aria-labelledby={`${cat.id}-title`}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fcdffe] text-brand-700">
                <ToolIcon name={cat.icon} className="size-[22px]" />
              </span>
              <div>
                <h2 id={`${cat.id}-title`} className="text-xl font-bold text-ink">
                  {cat.label}
                </h2>
                <p className="text-sm text-ink/55">{cat.subtitle}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {toolsInCategory(cat.id).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h3 className="font-semibold text-ink group-hover:text-brand-700">{tool.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">{tool.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Open tool
                    <ArrowRight className="size-[15px] transition group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 rounded-3xl bg-[linear-gradient(135deg,#8d3ebb_0%,#231938_100%)] p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Want it all done for you?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          These tools are a solid first step. Ranklit runs your local SEO automatically, with profile optimization, hand-placed citations and weekly rank
          tracking.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ink transition hover:opacity-90"
        >
          Start your 3-day free trial
          <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
