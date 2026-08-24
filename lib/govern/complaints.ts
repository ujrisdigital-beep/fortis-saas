import { screenAdmissibility, type AdmissibilityScreen, type ExclusionCode } from "./admissibility";

export type ComplaintStatus = "RECEIVED" | "TRIAGED" | "CLOSED";
export type ComplaintChannel = "ombudsman" | "platform_dispute";
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
  whistleblower: boolean;
  againstPublicAuthority: boolean;
  screen: AdmissibilityScreen;
  recommendationsBinding: false;
}

export function openComplaint(input: {
  subject: string;
  body: string;
  consent: boolean;
  channel?: ComplaintChannel;
  category?: ComplaintCategory;
  organisationNamed?: string;
  contact?: string;
  whistleblower?: boolean;
  againstPublicAuthority?: boolean;
  exhaustedInternal?: boolean;
  awarenessDate?: string;
  timeExtensionReason?: string;
  exclusionsDeclared?: ExclusionCode[];
}): Complaint {
  if (!input.consent) throw new Error("consent_required");
  if (!input.subject.trim() || !input.body.trim()) throw new Error("incomplete");
  const channel = input.channel ?? "ombudsman";
  const identifiable = Boolean(input.contact?.trim());
  const whistleblower = Boolean(input.whistleblower);
  const screen = screenAdmissibility({
    channel,
    againstPublicAuthority: input.againstPublicAuthority !== false && channel === "ombudsman",
    exhaustedInternal: input.exhaustedInternal,
    awarenessDate: input.awarenessDate,
    timeExtensionReason: input.timeExtensionReason,
    exclusionsDeclared: input.exclusionsDeclared ?? [],
    identifiable,
    whistleblower,
  });
  if (channel === "ombudsman" && !identifiable && !whistleblower) {
    throw new Error("identity_or_whistleblower_required");
  }
  const prefix = channel === "ombudsman" ? "OMB" : "DIS";
  const reference = `${prefix}-${new Date().getUTCFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    reference,
    subject: input.subject.trim(),
    body: input.body.trim(),
    consent: true,
    status: "RECEIVED",
    channel,
    category: input.category ?? "other",
    organisationNamed: input.organisationNamed?.trim() || undefined,
    contact: input.contact?.trim() || undefined,
    createdAt: new Date().toISOString(),
    feeToPublic: "free",
    whistleblower,
    againstPublicAuthority: input.againstPublicAuthority !== false && channel === "ombudsman",
    screen,
    recommendationsBinding: false,
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
    recommendationsBinding: false,
    screen: c.screen,
    notice:
      c.channel === "ombudsman"
        ? "Public-authority complaint for human Ombudsman officers. Recommendations are advisory, not a court order."
        : "Private platform dispute. Not an Ombudsman Act case.",
  };
}
