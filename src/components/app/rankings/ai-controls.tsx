"use client";

import { useState } from "react";
import clsx from "clsx";
import { RefreshCw } from "lucide-react";
import { useAction } from "@/components/app/toast";
import { btn } from "@/components/app/ui";
import { runAiCheckAction } from "@/app/actions/rankings";
import { Modal } from "./modal";

/** "Run Now": fires a one-off AI visibility check (no credits). */
export function RunAiCheckButton() {
  const { run, pending } = useAction();
  return (
    <button type="button" className={btn.outline} disabled={pending} onClick={() => run(() => runAiCheckAction())}>
      <RefreshCw className={clsx("size-4", pending && "animate-spin")} /> {pending ? "Checking…" : "Run Now"}
    </button>
  );
}

/** Inline "How we measure" link that opens an explainer. */
export function HowWeMeasure({ question, business }: { question: string; business: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-700">
        How we measure
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="How we measure AI visibility" className="max-w-[520px]">
        <h2 className="pr-8 text-lg font-bold">How we measure AI visibility</h2>
        <ol className="mt-3 space-y-3 text-sm text-ink/70">
          <li>
            <strong className="text-ink">1. We ask like a local customer.</strong> Each check asks every AI tool the same question someone nearby would type — for you that&apos;s{" "}
            <em className="text-ink">&ldquo;{question}&rdquo;</em>
          </li>
          <li>
            <strong className="text-ink">2. We read the answer.</strong> We note whether {business} is named, and where it appears in the list of businesses the tool recommends.
          </li>
          <li>
            <strong className="text-ink">3. We score it.</strong> Your visibility is the share of AI tools that named you. Six tools named you? That&apos;s 100%.
          </li>
          <li>
            <strong className="text-ink">4. We track it over time.</strong> With autopilot on, a check runs every week so you can see the trend. Run Now fires an extra check any time — it doesn&apos;t use credits.
          </li>
        </ol>
        <p className="mt-4 rounded-lg bg-[#f6f0fb] p-3 text-xs text-ink/60">
          AI answers change from day to day, even for the same question. Look at the trend across several checks rather than any single result.
        </p>
        <div className="mt-4 text-right">
          <button type="button" className={btn.primary} onClick={() => setOpen(false)}>
            Got it
          </button>
        </div>
      </Modal>
    </>
  );
}
