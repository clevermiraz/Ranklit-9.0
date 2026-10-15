"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import clsx from "clsx";
import { btn } from "@/components/app/ui";

/**
 * Small confirm dialog for purchases. Shows a summary, then a success state once `done` is set.
 * Uses the native <dialog> element so focus trapping and Esc work out of the box.
 */
export function ConfirmModal({
  open,
  onClose,
  title,
  summary,
  lines,
  total,
  totalLabel = "Total today",
  footnote = "Charged to the card on your Ranklit subscription. You'll get a receipt by email.",
  confirmLabel,
  onConfirm,
  pending,
  done,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  summary: ReactNode;
  lines: { label: string; value: string }[];
  total: string;
  totalLabel?: string;
  footnote?: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  pending: boolean;
  done: { title: string; text: ReactNode } | null;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && !pending && onClose()}
      className="m-auto w-[min(460px,calc(100vw-2rem))] rounded-2xl border border-[#ece6f4] bg-white p-0 text-ink shadow-2xl backdrop:bg-[#1b1029]/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="relative p-6">
        <button type="button" onClick={onClose} disabled={pending} className="absolute top-4 right-4 grid size-8 place-items-center rounded-lg text-ink/50 hover:bg-ink/5 hover:text-ink" aria-label="Close">
          <X className="size-4" />
        </button>
        {done ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
            <p className="mt-3 text-lg font-extrabold tracking-tight">{done.title}</p>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-ink/60">{done.text}</p>
            <button type="button" onClick={onClose} className={clsx(btn.primary, "mt-5")}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="pr-8 text-lg font-extrabold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink/60">{summary}</p>
            <dl className="mt-5 divide-y divide-[#f1ecf7] rounded-xl border border-[#ece6f4] text-sm">
              {lines.map((l) => (
                <div key={l.label} className="flex justify-between gap-4 px-4 py-2.5">
                  <dt className="text-ink/60">{l.label}</dt>
                  <dd className="text-right font-medium">{l.value}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 bg-[#faf8fc] px-4 py-3">
                <dt className="font-semibold">{totalLabel}</dt>
                <dd className="font-extrabold">{total}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink/50">{footnote}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={onClose} disabled={pending} className={btn.outline}>
                Cancel
              </button>
              <button type="button" autoFocus onClick={onConfirm} disabled={pending} className={btn.primary}>
                {pending && <Loader2 className="size-4 animate-spin" />} {confirmLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
