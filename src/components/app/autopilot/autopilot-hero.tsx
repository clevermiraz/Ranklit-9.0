"use client";

import { useState } from "react";
import clsx from "clsx";
import { Loader2, Pause, Rocket, Sparkles } from "lucide-react";
import { setAutopilotAction } from "@/app/actions/app";
import { Switch } from "@/components/app/controls";
import { useAction } from "@/components/app/toast";

export function AutopilotHero({ on }: { on: boolean }) {
  const { run, pending } = useAction();
  const [value, setValue] = useState(on);
  const [prev, setPrev] = useState(on);
  if (on !== prev) {
    // Server state changed (e.g. the sidebar switch) — follow it.
    setPrev(on);
    setValue(on);
  }
  const toggle = (next: boolean) => {
    setValue(next);
    run(
      () => setAutopilotAction(next),
      (r) => r?.error && setValue(!next),
    );
  };
  return (
    <section
      className={clsx(
        "rounded-2xl border p-6 sm:p-7",
        value ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-[#f3e8fb]" : "border-[#e6d6f3] bg-gradient-to-br from-[#f3e8fb] via-[#faf5fd] to-white",
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        <span className={clsx("grid size-12 shrink-0 place-items-center rounded-2xl", value ? "bg-emerald-100 text-emerald-700" : "bg-white text-brand-700 shadow-sm")}>
          <Rocket className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            Autopilot is {value ? "on" : "off"}
            {value && <span className="size-2.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/65">
            {value
              ? "Your bot is working on schedule — posting, scanning and tidying your profile for the automations you've turned on. You can turn it off again any time."
              : "Right now nothing runs unless you click it yourself. Turn Autopilot on and your bot handles the work below on schedule. You can turn it off again any time."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Switch size="lg" checked={value} disabled={pending} onChange={toggle} label="Autopilot" />
            <button
              type="button"
              disabled={pending}
              onClick={() => toggle(!value)}
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60",
                value ? "border border-[#e4dcef] bg-white text-ink hover:border-brand-300" : "bg-brand-700 text-white shadow-[0_6px_20px_-6px_rgba(141,62,187,.6)] hover:bg-[#7b2fa8]",
              )}
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : value ? <Pause className="size-4" /> : <Sparkles className="size-4" />}
              {value ? "Turn off Autopilot" : "Turn on Autopilot"}
            </button>
            {value && <span className="text-xs font-semibold text-emerald-700">Running on schedule</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
