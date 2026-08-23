export type ComplaintStatus = "RECEIVED" | "TRIAGED" | "CLOSED";

export interface Complaint {
  reference: string;
  subject: string;
  body: string;
  consent: boolean;
  status: ComplaintStatus;
}

export function openComplaint(input: { subject: string; body: string; consent: boolean }): Complaint {
  if (!input.consent) throw new Error("consent_required");
  if (!input.subject.trim() || !input.body.trim()) throw new Error("incomplete");
  const reference = `GOV-${Date.now().toString(36).toUpperCase()}`;
  return { reference, subject: input.subject.trim(), body: input.body.trim(), consent: true, status: "RECEIVED" };
}

export function advanceComplaint(c: Complaint, next: ComplaintStatus): Complaint {
  const allowed: Record<ComplaintStatus, ComplaintStatus[]> = {
    RECEIVED: ["TRIAGED"],
    TRIAGED: ["CLOSED"],
    CLOSED: [],
  };
  if (!allowed[c.status].includes(next)) throw new Error("invalid_transition");
  return { ...c, status: next };
}
