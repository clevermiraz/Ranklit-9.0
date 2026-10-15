"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import clsx from "clsx";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { mainNav } from "@/lib/site";
import { industries } from "@/lib/data/industries";

const ctaPill =
  "rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(141,62,187,.7)] transition hover:-translate-y-px";

export function Header() {
  const pathname = usePathname();
  const mobileRef = useRef<HTMLDetailsElement>(null);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const closeMobile = () => mobileRef.current?.removeAttribute("open");

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-canvas/75 backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/65">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          <div className="group relative">
            <Link
              href="/local-seo"
              className={clsx(
                "flex items-center gap-1 text-sm font-semibold transition-colors hover:text-ink",
                isActive("/local-seo") ? "text-ink" : "text-ink/65",
              )}
            >
              Local SEO
              <ChevronDown className="size-3.5 opacity-70" strokeWidth={1.8} />
            </Link>
            {/* Pure CSS dropdown: opens on hover or keyboard focus. pt-3 bridges the hover gap. */}
            <div className="invisible absolute left-0 top-full z-50 w-56 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-black/5 bg-white p-2 shadow-lg">
                <Link href="/local-seo" className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink hover:bg-canvas">
                  All industries
                </Link>
                {industries.map((ind) => (
                  <Link
                    key={ind.slug}
                    href={`/local-seo/${ind.slug}`}
                    className="block rounded-xl px-3 py-2 text-sm text-ink/70 hover:bg-canvas hover:text-ink"
                  >
                    {ind.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-semibold transition-colors hover:text-ink",
                isActive(item.href) ? "text-ink" : "text-ink/65",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink/65 hover:bg-ink/5 hover:text-ink sm:inline-block sm:px-4"
          >
            Log in
          </Link>
          <Link href="/pricing" className={ctaPill}>
            See plans
          </Link>

          {/* key={pathname} remounts the menu so it closes after navigation */}
          <details key={pathname} ref={mobileRef} className="group relative md:hidden">
            <summary
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-black/10 bg-white/80 text-ink [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <Menu className="size-[18px] group-open:hidden" />
              <X className="hidden size-[18px] group-open:block" />
            </summary>
            <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-black/5 bg-white p-2 shadow-xl">
              {[{ label: "Local SEO by industry", href: "/local-seo" }, ...mainNav, { label: "Pricing", href: "/pricing" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-canvas"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-1 border-t border-black/5 pt-2">
                <Link href="/login" onClick={closeMobile} className="block rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink/70 hover:bg-canvas">
                  Log in
                </Link>
                <Link
                  href="/pricing"
                  onClick={closeMobile}
                  className="mt-1 block rounded-xl bg-brand-700 px-3 py-2.5 text-center text-[15px] font-semibold text-white"
                >
                  See plans
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
