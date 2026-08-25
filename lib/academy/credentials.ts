import { createHmac, timingSafeEqual } from "node:crypto";

export interface CredentialRecord {
  serial: string;
  learnerId: string;
  programId: string;
  programTitle: string;
  issuedAt: string;
  signature: string;
  revokedAt?: string;
}

export function signCredential(
  record: Omit<CredentialRecord, "signature">,
  secret: string,
): CredentialRecord {
  const signature = createHmac("sha256", secret).update(canonical(record)).digest("hex");
  return { ...record, signature };
}

export function verifyCredential(
  record: CredentialRecord,
  secret: string,
): { valid: boolean; reason: string } {
  if (record.revokedAt) return { valid: false, reason: "revoked" };
  const expected = createHmac("sha256", secret).update(canonical(record)).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(record.signature, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "bad_signature" };
  }
  return { valid: true, reason: "ok" };
}

function canonical(record: Omit<CredentialRecord, "signature">): string {
  return [record.serial, record.learnerId, record.programId, record.programTitle, record.issuedAt].join("|");
}

export function newSerial(now = new Date()): string {
  const y = now.getUTCFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `FORTIS-CRED-${y}-${rand}`;
}
