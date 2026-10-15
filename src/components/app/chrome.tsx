"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Loader2, Sparkles } from "lucide-react";
import { sectionFor } from "@/lib/app/nav";
import { startPlanNowAction } from "@/app/actions/app";
import { useAction } from "./toast";

export function TrialBanner({ daysLeft, chargeDate }: { daysLeft: number; chargeDate: string }) {
  const { run, pending } = useAction();
  return (
    <div className="mx-4 mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-brand-300/70 bg-[#f9e9fb] px-4 py-3 sm:mx-5">
      <Sparkles className="size-5 shrink-0 text-brand-700" />
      <p className="min-w-0 flex-1 text-sm text-brand-800">
        <strong>
          {daysLeft} day{daysLeft === 1 ? "" : "s"} left in your free trial.
        </strong>{" "}
        We&apos;ll charge your card on {chargeDate} unless you cancel before then.
      </p>
      <div className="flex gap-2">
        <button type="button" disabled={pending} onClick={() => run(() => startPlanNowAction())} className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-[#7b2fa8] disabled:opacity-60">
          {pending && <Loader2 className="size-4 animate-spin" />} Start plan now
        </button>
        <Link href="/settings/plans" className="rounded-full border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-800 hover:border-brand-500">
          Manage trial
        </Link>
      </div>
    </div>
  );
}

export function SubNav() {
  const pathname = usePathname();
  const { section, tab } = sectionFor(pathname);
  if (!section.tabs.length) return null;
  return (
    <nav className="mt-4 border-y border-[#ece6f4] bg-white px-4 py-2 sm:px-5" aria-label={`${section.label} pages`}>
      <div className="flex gap-1 overflow-x-auto">
        {section.tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={clsx(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              tab?.href === t.href ? "bg-[#f3e8fb] text-brand-700" : "text-ink/65 hover:bg-[#f7f4fb] hover:text-ink",
            )}
          >
            <t.icon className="size-4" />
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
