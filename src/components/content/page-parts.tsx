import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import clsx from "clsx";
import { tagSlug } from "@/lib/data/blog";

/** Plain intro header used by /blog and /local-seo listing pages. */
export function PageIntro({ eyebrow, title, intro, className }: { eyebrow: string; title: string; intro: ReactNode; className?: string }) {
  return (
    <header className={clsx("max-w-2xl", className)}>
      <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">{eyebrow}</p>
      <h1 className="mt-2 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink/65">{intro}</p>
    </header>
  );
}

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={clsx("text-sm text-ink/50", className)}>
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && (
            <span className="mx-1.5" aria-hidden>
              /
            </span>
          )}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink/70" aria-current="page">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

export function TagChips({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <div className={clsx("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog/tag/${tagSlug(tag)}`}
          className="rounded-full bg-[#fcdffe]/50 px-3 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-[#fcdffe]"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
