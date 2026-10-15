import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBlocks, RichText, proseClass } from "@/components/content/article-blocks";
import { InlineCta, ProductCta } from "@/components/content/ctas";
import { JsonLd, TagChips } from "@/components/content/page-parts";
import { PostCover } from "@/components/content/post-cover";
import { formatDate, getAllPosts, getPost, getToc } from "@/lib/data/blog";
import { site } from "@/lib/site";

// Fully prerendered via generateStaticParams; opt out of the dev-only instant-navigation check on `params`.
export const instant = false;

/** Strip the inline markup used in post data. */
const plain = (text: string) => text.replace(/\*\*|\[([^\]]+)\]\([^)]+\)/g, (_, label?: string) => label ?? "");

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: { absolute: post.title },
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, tags: post.tags },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const toc = [...getToc(post), { id: "faq", text: "FAQ" }];
  const url = `${site.url}/blog/${post.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="text-[32px] leading-[1.1] font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-ink/50">
          Published <time dateTime={post.date}>{formatDate(post.date, "long")}</time>
        </p>
      </header>

      <div>
        <PostCover slug={post.slug} label={post.tags[0] ?? "Local SEO"} />

        {post.intro.map((text) => (
          <p key={text} className={proseClass.p}>
            <RichText text={text} />
          </p>
        ))}

        <hr className="my-14 border-ink/10" />

        <blockquote className="border-l-4 border-brand-700 pl-5 sm:pl-6">
          <p className="text-[17px] leading-8 font-semibold text-ink italic sm:text-lg">TL;DR:</p>
          <ul className={proseClass.ul}>
            {post.tldr.map((item) => (
              <li key={item} className={`${proseClass.ulItem} italic`}>
                <RichText text={item} />
              </li>
            ))}
          </ul>
        </blockquote>

        <hr className="my-14 border-ink/10" />

        <InlineCta title={post.cta.title} text={post.cta.text} />

        <h2 id="table-of-contents" className={proseClass.h2}>
          Table of Contents
        </h2>
        <ul className={proseClass.ul}>
          {toc.map((item) => (
            <li key={item.id} className={proseClass.ulItem}>
              <a href={`#${item.id}`} className={proseClass.link}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>

        <ArticleBlocks blocks={post.body} />

        <h2 id="faq" className={proseClass.h2}>
          FAQ
        </h2>
        {post.faqs.map((faq) => (
          <div key={faq.q}>
            <h3 className={proseClass.h3}>{faq.q}</h3>
            <p className={proseClass.p}>
              <RichText text={faq.a} />
            </p>
          </div>
        ))}

        <h2 id="recommended" className={proseClass.h2}>
          Recommended
        </h2>
        <ul className={proseClass.ul}>
          {post.recommended.map((item) => (
            <li key={item.href} className={proseClass.ulItem}>
              <RichText text={`[${item.label}](${item.href})`} />
            </li>
          ))}
        </ul>
      </div>

      <ProductCta />

      <footer className="mt-12 border-t border-black/5 pt-6">
        <TagChips tags={post.tags} />
      </footer>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.date,
          url,
          mainEntityOfPage: url,
          keywords: post.tags.join(", "),
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
        }}
      />
    </article>
  );
}
