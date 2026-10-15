"use client";

import { useState } from "react";
import clsx from "clsx";
import { LoaderCircle, Sparkles, WandSparkles } from "lucide-react";
import { fixCategoriesAction, fixDescriptionAction, runAuditAction } from "@/app/actions/gbp";
import { useAction } from "@/components/app/toast";
import { btn } from "@/components/app/ui";

const STEPS = ["Reading your profile", "Checking description and categories", "Counting photos and services", "Reviewing reviews and replies", "Scoring 8 dimensions"];

/** Runs the audit with a short "analyzing" sequence so the result feels earned. */
export function RunAuditButton({ label, size = "sm" }: { label: string; size?: "sm" | "lg" }) {
  const { run, pending } = useAction();
  const [step, setStep] = useState<number | null>(null);
  const busy = pending || step !== null;

  const start = () => {
    setStep(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < STEPS.length) setStep(i);
      else {
        clearInterval(timer);
        run(() => runAuditAction(), () => setStep(null));
      }
    }, 380);
  };

  return (
    <span className="inline-flex flex-col items-center gap-2">
      <button type="button" onClick={start} disabled={busy} className={clsx(btn.fuchsia, size === "sm" ? btn.sm : "!px-5 !py-2.5")}>
        {busy ? <LoaderCircle className={clsx("animate-spin", size === "sm" ? "size-3.5" : "size-4")} /> : <Sparkles className={size === "sm" ? "size-3.5" : "size-4"} />} {busy ? "Analyzing…" : label}
      </button>
      {step !== null && size === "lg" && <span className="text-xs text-ink/55" aria-live="polite">{STEPS[step]}…</span>}
    </span>
  );
}

export function FixButton({ kind }: { kind: "description" | "categories" }) {
  const { run, pending } = useAction();
  return (
    <button type="button" disabled={pending} onClick={() => run(() => (kind === "description" ? fixDescriptionAction() : fixCategoriesAction()))} className={clsx(btn.fuchsia, btn.sm)}>
      {pending ? <LoaderCircle className="size-3.5 animate-spin" /> : <WandSparkles className="size-3.5" />} Fix it
    </button>
  );
}
