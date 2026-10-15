import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthShell>
      <h1 className="tracking-display text-[32px]">Welcome back</h1>
      <p className="mt-2 text-[15px] text-ink/60">Log in to see how your business is doing on Google Maps.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-10 text-center text-[15px] text-ink/60">
        New here?{" "}
        <Link href="/pricing" className="font-semibold text-brand-700 hover:underline">
          See our plans →
        </Link>
      </p>
      <p className="mt-6 rounded-xl border border-dashed border-ink/15 px-4 py-3 text-center text-xs text-ink/55">
        Demo account: <strong className="text-ink">demo@ranklit.com</strong> / <strong className="text-ink">demo1234</strong>
      </p>
    </AuthShell>
  );
}
