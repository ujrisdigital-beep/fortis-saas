export type ComplaintStatus = "RECEIVED" | "TRIAGED" | "CLOSED";
export type ComplaintChannel = "ombudsman" | "govern";
export type ComplaintCategory =
  | "maladministration"
  | "delay"
  | "unfair_treatment"
  | "service_failure"
  | "access_to_information"
  | "other";

export interface Complaint {
  reference: string;
  subject: string;
  body: string;
  consent: boolean;
  status: ComplaintStatus;
  channel: ComplaintChannel;
  category: ComplaintCategory;
  organisationNamed?: string;
  contact?: string;
  createdAt: string;
  feeToPublic: "free";
}

export function openComplaint(input: {
  subject: string;
  body: string;
  consent: boolean;
  channel?: ComplaintChannel;
  category?: ComplaintCategory;
  organisationNamed?: string;
  contact?: string;
}): Complaint {
  if (!input.consent) throw new Error("consent_required");
  if (!input.subject.trim() || !input.body.trim()) throw new Error("incomplete");
  const reference = `OMB-${new Date().getUTCFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    reference,
    subject: input.subject.trim(),
    body: input.body.trim(),
    consent: true,
    status: "RECEIVED",
    channel: input.channel ?? "ombudsman",
    category: input.category ?? "other",
    organisationNamed: input.organisationNamed?.trim() || undefined,
    contact: input.contact?.trim() || undefined,
    createdAt: new Date().toISOString(),
    feeToPublic: "free",
  };
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

export function publicComplaintView(c: Complaint) {
  return {
    reference: c.reference,
    status: c.status,
    subject: c.subject,
    category: c.category,
    channel: c.channel,
    createdAt: c.createdAt,
    feeToPublic: c.feeToPublic,
    determination: null as string | null,
    notice: "Received for human review. No automated judgment.",
  };
}
