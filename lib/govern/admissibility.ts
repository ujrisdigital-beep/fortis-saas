import type { ComplaintCategory, ComplaintChannel } from "./complaints";

export type ExclusionCode =
  | "sub_judice"
  | "judicial_function"
  | "national_security"
  | "frivolous"
  | "out_of_time"
  | "other_remedy";

export interface AdmissibilityInput {
  channel: ComplaintChannel;
  againstPublicAuthority: boolean;
  exhaustedInternal?: boolean;
  awarenessDate?: string;
  timeExtensionReason?: string;
  exclusionsDeclared: ExclusionCode[];
  identifiable: boolean;
  whistleblower: boolean;
}

export interface AdmissibilityScreen {
  suggestedAdmissible: boolean;
  flags: string[];
  humanDecisionRequired: true;
  reason: string;
}

export function screenAdmissibility(input: AdmissibilityInput): AdmissibilityScreen {
  const flags: string[] = [];
  if (input.channel === "ombudsman" && !input.againstPublicAuthority) {
    flags.push("may_be_private_dispute_not_ombudsman_act");
  }
  if (!input.identifiable && !input.whistleblower) {
    flags.push("identity_or_whistleblower_required");
  }
  if (input.exclusionsDeclared.length) {
    flags.push(...input.exclusionsDeclared.map((e) => `declared_${e}`));
  }
  if (input.awarenessDate) {
    const then = Date.parse(input.awarenessDate);
    if (!Number.isNaN(then)) {
      const months = (Date.now() - then) / (30.44 * 24 * 3600 * 1000);
      if (months > 12 && !input.timeExtensionReason?.trim()) {
        flags.push("outside_12_month_limit");
      }
    }
  }
  if (input.exhaustedInternal === false) {
    flags.push("internal_remedy_not_exhausted");
  }
  const blocking = flags.some((f) =>
    ["identity_or_whistleblower_required", "outside_12_month_limit", "declared_sub_judice"].includes(f),
  );
  return {
    suggestedAdmissible: !blocking,
    flags,
    humanDecisionRequired: true,
    reason: blocking
      ? "Flagged. A human officer must decide admissibility. AI does not refuse or accept the case."
      : "Passed machine pre-screen. A human officer still decides admissibility.",
  };
}

export const PUBLIC_CATEGORIES: ComplaintCategory[] = [
  "maladministration",
  "delay",
  "unfair_treatment",
  "service_failure",
  "access_to_information",
  "other",
];
