import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate, type Post } from "@/lib/data/blog";

const cardBase = "group flex flex-col border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";

function MoreLink({ children, className = "mt-4" }: { children: string; className?: string }) {
  return (
    <span className={`${className} inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700`}>
      {children}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} aria-hidden />
    </span>
  );
}

/** Full-width gradient card for the newest post on /blog. */
export function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mt-12 block rounded-3xl border border-black/5 bg-[linear-gradient(135deg,#8d3ebb_0%,#231938_100%)] p-8 text-white shadow-lg transition hover:shadow-xl sm:p-12"
    >
      <span className="text-xs font-semibold tracking-wide text-white/70 uppercase">Featured</span>
      <h2 className="mt-3 max-w-3xl text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl">{post.title}</h2>
      <p className="mt-3 line-clamp-3 max-w-2xl leading-relaxed text-white/80">{post.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-2 font-semibold">
        Read article
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} aria-hidden />
      </span>
    </Link>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className={`${cardBase} rounded-2xl p-6`}>
      <time dateTime={post.date} className="text-xs font-medium text-ink/45">
        {formatDate(post.date)}
      </time>
      <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-700">{post.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/60">{post.excerpt}</p>
      <MoreLink>Read</MoreLink>
    </Link>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

/** Hub card: industry, city or topic with a guide count. */
export function HubCard({ href, title, count, description }: { href: string; title: string; count: number; description: string }) {
  return (
    <Link href={href} className={`${cardBase} rounded-3xl p-6`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-700">{title}</h3>
        <span className="shrink-0 text-xs font-medium text-ink/45">
          {count} {count === 1 ? "guide" : "guides"}
        </span>
      </div>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/60">{description}</p>
      <MoreLink>View guides</MoreLink>
    </Link>
  );
}

/** Compact guide card: title + "Read guide". */
export function GuideCard({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className={`${cardBase} rounded-2xl p-5`}>
      <h3 className="leading-snug font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-700">{title}</h3>
      <MoreLink className="mt-3">Read guide</MoreLink>
    </Link>
  );
}
