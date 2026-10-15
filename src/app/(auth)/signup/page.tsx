import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { verifyToken } from "@/lib/session";
import type { CheckoutToken } from "@/app/actions/checkout";
import { getCheckoutPlan } from "@/lib/pricing";

export const metadata: Metadata = { title: "Finish creating your account", robots: { index: false } };

export default function SignupPage(props: PageProps<"/signup">) {
  return (
    <AuthShell>
      <Suspense>
        <FinishSignup searchParams={props.searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function FinishSignup({ searchParams }: { searchParams: PageProps<"/signup">["searchParams"] }) {
  await connection();
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : "";
  const order = await verifyToken<CheckoutToken>(sessionId);
  // Accounts are created after checkout; without an order, send visitors to pick a plan.
  if (!order) redirect("/pricing");
  const plan = getCheckoutPlan(order.plan);

  return (
    <>
      <h1 className="tracking-display text-[28px] sm:text-[32px]">Finish creating your account</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
        Your {plan?.name ?? ""} trial is ready. Set a password to open your dashboard.
      </p>
      <SignupForm sessionId={sessionId} email={order.email} />
    </>
  );
}
