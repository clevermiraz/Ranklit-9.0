import "server-only";
import { randomBytes, randomUUID, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Interval } from "@/lib/pricing";

const scrypt = promisify(_scrypt) as (pw: string, salt: string, len: number) => Promise<Buffer>;

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  businessName: string;
  plan: string | null;
  interval: Interval;
  locations: number;
  trialEndsAt: string | null;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

/**
 * In-memory user store (mock persistence).
 * Swap this module for a real database (Postgres, etc.) — the rest of the app only uses these functions.
 */
const store = globalThis as unknown as { __ranklitUsers?: Map<string, User> };
const users = (store.__ranklitUsers ??= new Map<string, User>());

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

async function checkPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(":");
  const hash = await scrypt(password, salt, 64);
  const expected = Buffer.from(hex, "hex");
  return expected.length === hash.length && timingSafeEqual(expected, hash);
}

export const DEMO_EMAIL = "demo@ranklit.com";
export const DEMO_PASSWORD = "demo1234";

async function ensureSeed() {
  if ([...users.values()].some((u) => u.email === DEMO_EMAIL)) return;
  users.set("demo", {
    id: "demo",
    name: "Jordan Avery",
    email: DEMO_EMAIL,
    passwordHash: await hashPassword(DEMO_PASSWORD),
    businessName: "Avery Plumbing & Drain",
    plan: "growth",
    interval: "monthly",
    locations: 2,
    trialEndsAt: null,
    createdAt: "2026-06-02T15:00:00.000Z",
  });
}

export function toPublic(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function findUserById(id: string) {
  await ensureSeed();
  return users.get(id) ?? null;
}

export async function findUserByEmail(email: string) {
  await ensureSeed();
  const e = email.trim().toLowerCase();
  return [...users.values()].find((u) => u.email === e) ?? null;
}

export async function verifyCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  return (await checkPassword(password, user.passwordHash)) ? user : null;
}

export async function createUser(input: { name: string; email: string; password: string; businessName?: string }) {
  await ensureSeed();
  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: await hashPassword(input.password),
    businessName: input.businessName?.trim() || `${input.name.trim().split(" ")[0]}'s business`,
    plan: null,
    interval: "monthly",
    locations: 1,
    trialEndsAt: null,
    createdAt: new Date().toISOString(),
  };
  users.set(user.id, user);
  return user;
}

export async function updateUser(id: string, patch: Partial<Omit<User, "id" | "passwordHash">>) {
  const user = await findUserById(id);
  if (!user) return null;
  Object.assign(user, patch);
  return user;
}

export async function setPassword(id: string, password: string) {
  const user = await findUserById(id);
  if (!user) return null;
  user.passwordHash = await hashPassword(password);
  return user;
}
