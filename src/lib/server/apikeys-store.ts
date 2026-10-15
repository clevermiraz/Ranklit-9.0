import "server-only";
import { createHash, randomBytes } from "node:crypto";

/**
 * API key secrets (mock persistence). The account only keeps the key's display prefix
 * (see ApiKey in types.ts); the full key is shown once and only its SHA-256 hash is kept here.
 */
const g = globalThis as unknown as { __rlApiKeyHashes?: Map<string, string> };
const hashes = (g.__rlApiKeyHashes ??= new Map<string, string>());

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const KEY_PREFIX = "rl_live_";

/** `rl_live_` + 32 random alphanumeric characters. */
export function generateApiKey() {
  const bytes = randomBytes(32);
  let body = "";
  for (const b of bytes) body += ALPHABET[b % ALPHABET.length];
  return `${KEY_PREFIX}${body}`;
}

export const hashApiKey = (key: string) => createHash("sha256").update(key).digest("hex");

/** Shown in lists, e.g. "rl_live_Ab3x". */
export const displayPrefix = (key: string) => key.slice(0, KEY_PREFIX.length + 4);

export function storeKeyHash(keyId: string, key: string) {
  hashes.set(keyId, hashApiKey(key));
}

export function deleteKeyHash(keyId: string) {
  hashes.delete(keyId);
}

/** Returns the key id a presented key belongs to, if any (for a future /api/mcp route). */
export function findKeyIdByKey(key: string) {
  const h = hashApiKey(key);
  for (const [id, stored] of hashes) if (stored === h) return id;
  return null;
}
