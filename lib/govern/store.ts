import type { Complaint } from "./complaints";

const byRef = new Map<string, Complaint>();

export function saveComplaint(c: Complaint): void {
  byRef.set(c.reference, c);
}

export function findComplaint(reference: string): Complaint | undefined {
  return byRef.get(reference.trim().toUpperCase()) ?? byRef.get(reference.trim());
}

export function resetComplaintStore(): void {
  byRef.clear();
}
