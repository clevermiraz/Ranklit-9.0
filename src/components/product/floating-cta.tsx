"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { ButtonLink } from "@/components/ui";

/**
 * Floating CTA card (bottom-right on desktop, full-width bar on mobile).
 * Appears once the element with `watchId` (the hero CTA) has scrolled out of view,
 * and hides again near the bottom of the page where the final CTA lives.
 */
export function FloatingCta({
  href,
  label,
  note,
  watchId = "hero-cta",
}: {
  href: string;
  label: string;
  note: string;
  watchId?: string;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    let io: IntersectionObserver | undefined;
    if (target) {
      io = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0));
      io.observe(target);
    }
    const onScroll = () => setNearEnd(window.innerHeight + window.scrollY > document.body.scrollHeight - 1100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [watchId]);

  const show = pastHero && !nearEnd;

  return (
    <div
      data-show={show}
      className={clsx(
        "fixed z-40 border border-ink/[0.06] bg-white/92 p-2.5 text-center shadow-[0_18px_40px_-16px_rgba(35,25,56,.45)] backdrop-blur-md transition-all duration-300",
        "inset-x-0 bottom-0 rounded-t-3xl pb-[max(10px,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:rounded-3xl sm:pb-2.5",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <ButtonLink href={href} arrow tabIndex={show ? undefined : -1} className="px-6">
        {label}
      </ButtonLink>
      <p className="mt-1.5 mb-0.5 text-xs font-medium text-ink/55">{note}</p>
    </div>
  );
}
