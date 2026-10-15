import type { ReactNode } from "react";
import { site } from "@/lib/site";

export type FaqItem = { q: string; a: ReactNode };

/** Accordion built on native <details>; several items can be open at once. Emits FAQPage JSON-LD. */
export function Faq({ items, footer = true }: { items: { q: string; a: string }[]; footer?: boolean }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div>
      <div className="mt-10 border-t border-ink/10">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-ink/10">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-0.5 py-[22px] text-lg font-bold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                className="relative size-[30px] shrink-0 rounded-full bg-[#fcdffe] transition-[transform,background-color] duration-300 ease-[cubic-bezier(.16,.84,.24,1)] group-open:rotate-45 group-open:bg-brand-700"
                aria-hidden
              >
                <span className="absolute top-1/2 left-1/2 h-0.5 w-3 -translate-1/2 rounded bg-brand-700 group-open:bg-white" />
                <span className="absolute top-1/2 left-1/2 h-3 w-0.5 -translate-1/2 rounded bg-brand-700 group-open:bg-white" />
              </span>
            </summary>
            <p className="animate-fade-up pr-11 pb-[22px] pl-0.5 text-[17px] leading-relaxed text-ink/70 [animation-duration:320ms]">{item.a}</p>
          </details>
        ))}
      </div>
      {footer && (
        <p className="mt-8 text-center text-ink/55">
          Still curious? Email{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-brand-700 hover:underline">
            {site.email}
          </a>
          . A real person will write back.
        </p>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
