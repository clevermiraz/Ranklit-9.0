"use client";

import clsx from "clsx";
import { AlertTriangle, Check, Info, Loader2, RotateCcw } from "lucide-react";
import { resolveAlertAction, resolveAllAlertsAction } from "@/app/actions/settings";
import type { Alert } from "@/lib/app/types";
import { btn } from "@/components/app/ui";
import { useAction } from "@/components/app/toast";

export function AlertRow({ alert, when }: { alert: Alert; when: string }) {
  const { run, pending } = useAction();
  const resolved = !!alert.resolvedAt;
  const warn = alert.severity === "warning";
  return (
    <li className={clsx("flex items-center gap-3 rounded-xl border px-4 py-3", resolved ? "border-[#ece6f4] bg-[#faf8fc]" : warn ? "border-amber-200 bg-amber-50/60" : "border-[#e6d6f3] bg-[#f8f1fc]")}>
      <span className={clsx("grid size-8 shrink-0 place-items-center rounded-lg", resolved ? "bg-emerald-50 text-emerald-600" : warn ? "bg-amber-100 text-amber-600" : "bg-white text-brand-700")}>
        {resolved ? <Check className="size-4" /> : warn ? <AlertTriangle className="size-4" /> : <Info className="size-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={clsx("block text-sm font-medium", resolved && "text-ink/60")}>{alert.message}</span>
        <span className="block text-xs text-ink/50" suppressHydrationWarning>
          {when}
        </span>
      </span>
      {resolved ? (
        <button type="button" disabled={pending} onClick={() => run(() => resolveAlertAction(alert.id, false))} className={clsx(btn.ghost, "!text-xs")}>
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCcw className="size-3.5" />} Reopen
        </button>
      ) : (
        <button type="button" disabled={pending} onClick={() => run(() => resolveAlertAction(alert.id))} className={clsx(btn.outline, btn.sm)}>
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Resolve
        </button>
      )}
    </li>
  );
}

export function ResolveAllButton() {
  const { run, pending } = useAction();
  return (
    <button type="button" disabled={pending} onClick={() => run(() => resolveAllAlertsAction())} className={clsx(btn.ghost, "!text-xs")}>
      {pending && <Loader2 className="size-3.5 animate-spin" />} Resolve all
    </button>
  );
}
