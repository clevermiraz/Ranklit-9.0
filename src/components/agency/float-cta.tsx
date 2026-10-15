"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { ButtonLink } from "@/components/ui";

/**
 * Floating CTA. Appears once `afterId` (the hero buttons) has scrolled out of view,
 * and hides again while any of `hideIds` (pricing, final CTA) is on screen.
 */
export function FloatCta({
  href,
  label,
  note,
  afterId,
  hideIds,
}: {
  href: string;
  label: string;
  note: string;
  afterId: string;
  hideIds: string[];
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      const anchor = document.getElementById(afterId);
      const past = anchor ? anchor.getBoundingClientRect().bottom < 0 : window.scrollY > 600;
      const blocked = hideIds.some((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r ? r.top < vh && r.bottom > 0 : false;
      });
      setShow(past && !blocked);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [afterId, hideIds]);

  return (
    <div
      inert={!show}
      data-show={show}
      className={clsx(
        "fixed inset-x-3.5 bottom-3.5 z-40 rounded-3xl border border-ink/[0.08] bg-white/[0.92] px-2 pt-2 pb-1.5 text-center shadow-[0_18px_40px_-16px_rgba(35,25,56,.45)] backdrop-blur",
        "transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(.16,.84,.24,1)] sm:inset-x-auto sm:right-6 sm:bottom-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[120px] opacity-0",
      )}
    >
      <ButtonLink href={href} arrow className="w-full sm:w-auto">
        {label}
      </ButtonLink>
      <p className="mt-1.5 text-xs font-semibold text-ink/60">{note}</p>
    </div>
  );
}
