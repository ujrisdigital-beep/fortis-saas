export type ServiceKind = "professionals" | "equipment" | "logistics";
export type EnquiryStatus = "RECEIVED" | "TRIAGED";

export interface ServiceEnquiry {
  id: string;
  kind: ServiceKind;
  name: string;
  phone: string;
  note: string;
  consent: boolean;
  status: EnquiryStatus;
  createdAt: string;
}

const store: ServiceEnquiry[] = [];

export function openServiceEnquiry(input: {
  kind: ServiceKind;
  name: string;
  phone: string;
  note: string;
  consent: boolean;
}): ServiceEnquiry {
  if (!input.consent) throw new Error("consent_required");
  if (!input.name.trim() || !input.phone.trim() || !input.note.trim()) throw new Error("incomplete");
  const kinds: ServiceKind[] = ["professionals", "equipment", "logistics"];
  if (!kinds.includes(input.kind)) throw new Error("unknown_kind");
  const row: ServiceEnquiry = {
    id: `enq_${Date.now().toString(36)}`,
    kind: input.kind,
    name: input.name.trim(),
    phone: input.phone.trim(),
    note: input.note.trim(),
    consent: true,
    status: "RECEIVED",
    createdAt: new Date().toISOString(),
  };
  store.push(row);
  return row;
}

export function publicLiveListings(): never[] {
  return [];
}

export function resetServiceEnquiries(): void {
  store.length = 0;
}

export function listEnquiries(): ServiceEnquiry[] {
  return [...store];
}
