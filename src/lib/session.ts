// Signed session tokens (HMAC-SHA256). Used by Proxy (Node.js runtime in Next 16) and server code.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "ranklit_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = { uid: string; exp: number };

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production");
  }
  return s ?? "dev-only-insecure-secret-change-me";
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

// Synchronous HMAC: avoids async I/O in render paths (Cache Components treats awaited crypto as uncached data).
function hmac(data: string) {
  return new Uint8Array(createHmac("sha256", secret()).update(data).digest());
}

/** Signs any JSON payload with an expiry. Used for sessions and checkout hand-off tokens. */
export async function signToken<T extends object>(data: T, maxAge: number) {
  const body = b64url(enc.encode(JSON.stringify({ ...data, exp: Math.floor(Date.now() / 1000) + maxAge })));
  return `${body}.${b64url(hmac(body))}`;
}

export async function verifyToken<T extends object>(token: string | undefined | null): Promise<(T & { exp: number }) | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(b64url(hmac(body)));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as T & { exp: number };
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

export const signSession = (uid: string, maxAge = SESSION_MAX_AGE) => signToken({ uid }, maxAge);
export const verifySession = (token: string | undefined) => verifyToken<{ uid: string }>(token);
