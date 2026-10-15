import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "@/lib/session";
import { findUserById, toPublic } from "@/lib/server/users";

export async function createSession(uid: string) {
  (await cookies()).set(SESSION_COOKIE, await signSession(uid), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Returns the signed-in user or null. Reads cookies, so call it inside a Suspense boundary. */
export async function getUser() {
  // Session checks compare against the current time, so they must run per request.
  await connection();
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await findUserById(session.uid);
  return user ? toPublic(user) : null;
}

export async function requireUser() {
  const user = await getUser();
  // A valid cookie for a missing user (e.g. store reset) must be cleared, or Proxy would loop /login -> /dashboard.
  if (!user) redirect("/logout");
  return user;
}
