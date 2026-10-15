"use client";

import { createContext, useCallback, useContext, useState, useTransition, type ReactNode } from "react";
import clsx from "clsx";
import { CheckCircle2, Info, XCircle } from "lucide-react";

type Toast = { id: number; kind: "ok" | "error" | "info"; text: string };

const ToastContext = createContext<{ push: (t: Omit<Toast, "id">) => void }>({ push: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const tid = Date.now() + Math.random();
    setToasts((all) => [...all, { ...t, id: tid }]);
    setTimeout(() => setToasts((all) => all.filter((x) => x.id !== tid)), 4200);
  }, []);

  return (
    <ToastContext value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[70] flex w-[min(400px,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "animate-fade-up pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-white px-4 py-3 text-sm shadow-lift [animation-duration:220ms]",
              t.kind === "error" ? "border-red-200" : "border-ink/10",
            )}
          >
            {t.kind === "ok" && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />}
            {t.kind === "error" && <XCircle className="mt-0.5 size-4 shrink-0 text-red-600" />}
            {t.kind === "info" && <Info className="mt-0.5 size-4 shrink-0 text-brand-700" />}
            <p>{t.text}</p>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export const useToast = () => useContext(ToastContext);

type Result = { ok?: string; error?: string } | void;

/** Runs a server action with a pending flag and toast feedback. */
export function useAction() {
  const { push } = useToast();
  const [pending, start] = useTransition();
  const run = useCallback(
    <R extends Result>(fn: () => Promise<R>, onDone?: (r: R) => void) => {
      start(async () => {
        try {
          const r = await fn();
          if (r?.error) push({ kind: "error", text: r.error });
          else if (r?.ok) push({ kind: "ok", text: r.ok });
          onDone?.(r);
        } catch (e) {
          // Let Next handle redirect()/notFound() thrown from actions.
          if (e && typeof e === "object" && "digest" in e) throw e;
          push({ kind: "error", text: "An unexpected error occurred" });
        }
      });
    },
    [push],
  );
  return { run, pending, push };
}
