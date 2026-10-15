"use client";

import { useEffect, type ReactNode } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

/** Centered dialog with backdrop; closes on Escape and backdrop click. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "max-w-[520px]",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-ink/35 p-4 backdrop-blur-[2px]" role="dialog" aria-modal aria-label={typeof title === "string" ? title : undefined}>
      <button type="button" className="fixed inset-0 cursor-default" onClick={onClose} aria-label="Close dialog" tabIndex={-1} />
      <div className={clsx("relative flex max-h-[calc(100dvh-2rem)] w-full flex-col rounded-2xl bg-white shadow-2xl", width)}>
        <div className="flex items-start justify-between gap-3 border-b border-[#ece6f4] px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-ink/60">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-lg text-ink/50 hover:bg-ink/5 hover:text-ink" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>}
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#ece6f4] px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  text,
  confirmLabel,
  danger,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  text: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  pending?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width="max-w-[440px]"
      footer={
        <>
          <button type="button" onClick={onClose} className="inline-flex items-center rounded-full border border-[#e4dcef] bg-white px-4 py-2 text-sm font-semibold hover:border-brand-300">
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className={clsx("inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-50", danger ? "bg-red-600 hover:bg-red-700" : "bg-brand-700 hover:bg-[#7b2fa8]")}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-ink/70">{text}</div>
    </Modal>
  );
}
