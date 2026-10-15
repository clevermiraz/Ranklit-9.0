"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui";
import { GoogleIcon, inputClass } from "./auth-shell";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [googleNote, setGoogleNote] = useState(false);
  const next = useSearchParams().get("next") ?? "";

  return (
    <>
      <form action={action} className="mt-8 space-y-5" noValidate>
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[15px] font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@business.com"
            defaultValue={state?.values?.email}
            required
            className={inputClass}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-[15px] font-medium">
              Password
            </label>
            <Link href="/forgot-password" className="text-[15px] font-medium text-brand-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            required
            className={inputClass}
          />
        </div>
        {state?.error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Logging in…" : "Log in"}
          {!pending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ink/45">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>
      <Button variant="secondary" className="w-full shadow-none" onClick={() => setGoogleNote(true)}>
        <GoogleIcon /> Log in with Google
      </Button>
      {googleNote && (
        <p className="mt-3 flex gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm text-ink/70">
          <Info className="mt-0.5 size-4 shrink-0 text-brand-700" />
          Google sign-in isn&apos;t connected in this build. Use the demo account below.
        </p>
      )}
    </>
  );
}
