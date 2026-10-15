import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-brand-700 lg:w-1/2" />}>
      <CheckoutForm />
    </Suspense>
  );
}
