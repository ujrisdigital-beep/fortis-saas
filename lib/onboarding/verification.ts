import { createHash, randomBytes } from "node:crypto";

export function issueEmailToken(email: string, now = Date.now()) {
  const raw = randomBytes(32).toString("hex");
  return {
    email,
    raw,
    hash: hashToken(raw),
    expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function tokenIsValid(stored: { hash: string; expiresAt: string; used: boolean }, raw: string, now = Date.now()) {
  if (stored.used) return false;
  if (new Date(stored.expiresAt).getTime() <= now) return false;
  return stored.hash === hashToken(raw);
}
