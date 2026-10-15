"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/auth";
import { Button } from "@/components/ui";
import { inputClass } from "./auth-shell";

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  if (state?.ok) {
    return (
      <p role="status" className="mt-8 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[15px] text-emerald-900">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        {state.ok}
      </p>
    );
  }

  return (
    <form action={action} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[15px] font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@business.com" defaultValue={state?.values?.email} className={inputClass} />
      </div>
      {state?.error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
