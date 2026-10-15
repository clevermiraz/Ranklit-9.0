import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <h1 className="tracking-display text-[32px]">Reset your password</h1>
      <p className="mt-2 text-[15px] text-ink/60">Enter the email you signed up with and we&apos;ll send you a reset link.</p>
      <ForgotForm />
      <p className="mt-10 text-center text-[15px] text-ink/60">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">
          Back to log in →
        </Link>
      </p>
    </AuthShell>
  );
}
