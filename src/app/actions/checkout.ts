"use server";

import { redirect } from "next/navigation";
import { signToken } from "@/lib/session";
import { getCheckoutPlan, MAX_CHECKOUT_LOCATIONS, type Interval } from "@/lib/pricing";

export type CheckoutToken = { email: string; plan: string; interval: Interval; locations: number };

/**
 * Mock payment step. A real build would create a Stripe Checkout Session / SetupIntent here.
 * Card details never reach this server — only the contact email and the order.
 */
export async function startTrial(input: { email: string; plan: string; interval: string; locations: number }) {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  const plan = getCheckoutPlan(input.plan);
  if (!plan) return { error: "That plan isn't available." };
  const interval: Interval = input.interval === "annual" ? "annual" : "monthly";
  const locations = Math.min(MAX_CHECKOUT_LOCATIONS, Math.max(1, Math.round(Number(input.locations) || 1)));

  const token = await signToken<CheckoutToken>({ email, plan: plan.id, interval, locations }, 60 * 60 * 24);
  redirect(`/signup?session_id=${encodeURIComponent(token)}`);
}
