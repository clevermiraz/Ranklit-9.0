"use client";

import { useState } from "react";
import clsx from "clsx";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useAction } from "@/components/app/toast";
import { requestOrganicAction } from "@/app/actions/addons";
import { ConfirmModal } from "@/components/app/addons/confirm-modal";

/** "Start for $299/month" pill: confirm modal → records the request → shows the requested state. */
export function OrganicCta({ requested, className }: { requested: boolean; className?: string }) {
  const { run, pending } = useAction();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  if (requested && !open) {
    return (
      <p className={clsx("inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25", className)}>
        <CheckCircle2 className="size-4 text-emerald-300" /> Requested — Lukas will email you within 1 business day
      </p>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx("inline-flex items-center gap-1.5 rounded-full bg-[#fbe4f4] px-5 py-2.5 text-sm font-bold text-[#3d1450] transition hover:bg-white", className)}
      >
        Start for $299/month <ArrowRight className="size-4" />
      </button>
      <ConfirmModal
        open={open}
        onClose={() => {
          setOpen(false);
          setDone(false);
        }}
        pending={pending}
        title="Start the Organic Growth Plan"
        summary="Pages, links and cleanup done for you every month, so you rank on Google itself — not just Maps."
        lines={[
          { label: "Organic Growth Plan", value: "$299 / month" },
          { label: "Billing", value: "Monthly, cancel any time" },
          { label: "First step", value: "Kickoff email from Lukas" },
          { label: "Work starts", value: "Week 1 — full site audit" },
        ]}
        totalLabel="First month"
        total="$299.00"
        footnote="Nothing is charged yet. Lukas confirms the details with you by email, then the plan is added to your subscription."
        confirmLabel="Request the plan"
        onConfirm={() => run(() => requestOrganicAction(), (r) => !r?.error && setDone(true))}
        done={done ? { title: "Requested", text: "Requested — Lukas will email you within 1 business day to get you started." } : null}
      />
    </>
  );
}
