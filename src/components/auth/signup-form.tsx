"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { completeSignup } from "@/app/actions/auth";
import { Button } from "@/components/ui";
import { inputClass } from "./auth-shell";

export function SignupForm({ sessionId, email }: { sessionId: string; email: string }) {
  const [state, action, pending] = useActionState(completeSignup, undefined);

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="session_id" value={sessionId} />
      {state?.error === "exists" ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
          <p className="font-semibold">We already have an account for this email.</p>
          <p className="mt-1">Log in with your existing password, or reset it if you&apos;ve forgotten it.</p>
          <p className="mt-2 flex gap-4 font-semibold">
            <Link href="/forgot-password" className="underline">Set a password</Link>
            <Link href="/login" className="underline">Log in</Link>
          </p>
        </div>
      ) : (
        state?.error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
            {state.error}
          </p>
        )
      )}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">Your name</label>
        <input id="name" name="name" placeholder="John Smith" autoComplete="name" required defaultValue={state?.values?.name} className={inputClass} />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" value={email} readOnly className={`${inputClass} bg-[#f4f1fa] text-ink/60`} />
        <p className="text-xs text-ink/45">This is the email you paid with, so your plan stays linked.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" minLength={8} placeholder="At least 8 characters" autoComplete="new-password" required className={inputClass} />
      </div>
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Create account
        {!pending && <ArrowRight className="size-4" />}
      </Button>
    </form>
  );
}
