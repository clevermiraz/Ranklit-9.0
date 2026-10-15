import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import { slugify, type Block } from "@/lib/data/blog";

const linkClass = "font-medium text-brand-700 underline decoration-brand-700/60 underline-offset-2 transition hover:decoration-brand-700";

/** Article typography, shared by blog posts and city guides. */
export const proseClass = {
  p: "my-6 text-[17px] leading-8 text-ink/[0.82] sm:text-lg",
  h2: "mt-14 mb-6 scroll-mt-24 text-pretty text-[26px] leading-tight font-bold tracking-tight sm:text-[30px] sm:leading-10",
  h3: "mt-10 mb-4 scroll-mt-24 text-xl leading-8 font-semibold tracking-tight sm:text-2xl sm:leading-9",
  ul: "my-6 list-disc space-y-3 pl-6 marker:text-brand-700",
  ulItem: "pl-2 text-[17px] leading-8 font-medium text-ink sm:text-lg",
  ol: "my-6 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-ink/55",
  olItem: "pl-2 text-[17px] leading-8 text-ink/[0.82] sm:text-lg",
  link: linkClass,
};

const inlinePattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

/** Renders `**bold**` and `[label](href)` inside a plain string. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(inlinePattern).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              <RichText text={part.slice(2, -2)} />
            </strong>
          );
        }
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
        if (link) return <InlineLink key={i} href={link[2]}>{link[1]}</InlineLink>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

export function ArticleBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <ArticleBlock key={i} block={block} />
      ))}
    </>
  );
}

function ArticleBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p className={proseClass.p}>
          <RichText text={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2 id={slugify(block.text)} className={proseClass.h2}>
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className={proseClass.h3}>{block.text}</h3>;
    case "ul":
      return (
        <ul className={proseClass.ul}>
          {block.items.map((item) => (
            <li key={item} className={proseClass.ulItem}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className={proseClass.ol}>
          {block.items.map((item) => (
            <li key={item} className={proseClass.olItem}>
              <RichText text={item} />
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <figure className="my-8">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[520px] text-left text-base leading-6">
              <thead>
                <tr className="border-b border-ink/20">
                  {block.head.map((h) => (
                    <th key={h} scope="col" className="pr-4 pb-3 font-semibold text-ink">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-ink/10">
                    {row.map((cell, c) => (
                      <td key={c} className={clsx("py-3 pr-4 align-top text-ink/[0.82]", c === 0 && "font-medium text-ink")}>
                        <RichText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="mt-5 text-[17px] leading-7 text-ink/70 italic">{block.caption}</figcaption>}
        </figure>
      );
    case "callout":
      return (
        <div className="my-8 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-[17px] leading-7 text-ink/[0.85]">
            <span className="mr-1.5 font-bold text-brand-700">{block.label ?? "Note"}:</span>
            <RichText text={block.text} />
          </p>
        </div>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-brand-700 pl-5">
          <p className="text-[17px] leading-8 font-medium text-ink italic sm:text-lg">
            “<RichText text={block.text} />”
          </p>
          {block.cite && <footer className="mt-2 text-sm font-semibold text-ink/55 not-italic">— {block.cite}</footer>}
        </blockquote>
      );
  }
}
