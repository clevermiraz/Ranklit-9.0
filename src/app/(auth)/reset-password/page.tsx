import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Set a new password", robots: { index: false } };

// Reset links are emailed tokens; without a mail provider configured, every link is treated as expired.
export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <span className="grid size-12 place-items-center rounded-full bg-red-100 text-red-800">
        <AlertCircle className="size-6" />
      </span>
      <h1 className="tracking-display mt-5 text-[32px]">This link has expired</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
        A reset link works once, and only for one hour. Ask for a new one and try again.
      </p>
      <Link href="/forgot-password" className="mt-6 inline-block font-semibold text-brand-700 hover:underline">
        Send me a new link →
      </Link>
    </AuthShell>
  );
}
