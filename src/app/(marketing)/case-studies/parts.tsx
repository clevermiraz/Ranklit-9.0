import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/lib/data/case-studies";

export function CaseMeta({ study, className }: { study: CaseStudy; className?: string }) {
  return (
    <p className={clsx("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold tracking-wide uppercase", className)}>
      <span className="text-brand-700">
        {study.industry} · {study.region}
      </span>
      <span className="text-ink/25" aria-hidden>
        •
      </span>
      <span className="text-ink/45">Sample case study</span>
    </p>
  );
}

/** Renders **bold** spans inside plain strings. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

export function GradientCta({ title, text, className }: { title: ReactNode; text: string; className?: string }) {
  return (
    <section className={clsx("overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-ink p-8 text-white shadow-lg", className)}>
      {title}
      <p className="mt-3 max-w-xl text-white/80">{text}</p>
      <Link
        href="/pricing"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ink shadow-sm transition-opacity hover:opacity-90"
      >
        See plans <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
