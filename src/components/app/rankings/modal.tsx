"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { X } from "lucide-react";

/** Centered dialog (portalled to <body>, so it can be opened from inline text) over a dimmed page. Closes on Esc, backdrop click and the × button. */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
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
  return createPortal(
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-night/50">
      <div
        className="flex min-h-full items-center justify-center p-4"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={clsx(
            "relative w-full max-w-[460px] rounded-xl bg-white p-5 shadow-2xl",
            className,
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 grid size-8 place-items-center rounded-lg text-ink/50 hover:bg-ink/5 hover:text-ink"
          >
            <X className="size-4" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
