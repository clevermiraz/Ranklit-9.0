import Link from "next/link";
import type { ToolCta } from "@/lib/data/tools";

export function ToolCtaBand({ cta }: { cta: ToolCta }) {
  return (
    <section className="mt-16 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#8d3ebb_0%,#231938_100%)] p-8 sm:p-10">
      <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">{cta.eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">{cta.title}</h2>
      <p className="mt-2 max-w-2xl text-white/80">{cta.body}</p>
      <Link href={cta.href} className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-ink transition-opacity hover:opacity-90">
        {cta.button}
      </Link>
    </section>
  );
}
