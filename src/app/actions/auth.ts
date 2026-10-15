"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/server/auth";
import { createUser, findUserByEmail, updateUser, verifyCredentials } from "@/lib/server/users";
import { verifyToken } from "@/lib/session";
import type { CheckoutToken } from "@/app/actions/checkout";

export type FormState = { error?: string; ok?: string; values?: Record<string, string> } | undefined;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Only allow same-site relative redirects. */
function safeNext(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const values = { email };
  if (!isEmail(email)) return { error: "Enter a valid email address.", values };
  if (!password) return { error: "Enter your password.", values };

  const user = await verifyCredentials(email, password);
  if (!user) return { error: "That email and password don't match. Try again or reset your password.", values };

  await createSession(user.id);
  redirect(safeNext(form.get("next")));
}

export async function requestPasswordReset(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  if (!isEmail(email)) return { error: "Enter a valid email address.", values: { email } };
  // Always respond the same way so the form can't be used to discover accounts.
  await findUserByEmail(email);
  return { ok: `If an account exists for ${email}, we've sent a link to reset your password.` };
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function completeSignup(_: FormState, form: FormData): Promise<FormState> {
  const sessionId = String(form.get("session_id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const values = { name };

  const order = await verifyToken<CheckoutToken>(sessionId);
  if (!order) return { error: "This checkout link has expired. Please choose a plan again.", values };
  if (!name) return { error: "Enter your name.", values };
  if (password.length < 8) return { error: "Use at least 8 characters for your password.", values };
  if (await findUserByEmail(order.email)) return { error: "exists", values };

  const user = await createUser({ name, email: order.email, password });
  await updateUser(user.id, {
    plan: order.plan,
    interval: order.interval,
    locations: order.locations,
    trialEndsAt: new Date(Date.now() + 3 * 864e5).toISOString(),
  });
  await createSession(user.id);
  redirect("/dashboard?welcome=1");
}
