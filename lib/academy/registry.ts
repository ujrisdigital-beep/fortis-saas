import type { CredentialRecord } from "./credentials";

const registry = new Map<string, CredentialRecord>();

export function saveCredential(record: CredentialRecord): void {
  registry.set(record.serial, record);
}

export function findCredential(serial: string): CredentialRecord | undefined {
  return registry.get(serial);
}
