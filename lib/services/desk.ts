import { publicCommerceReady } from "../commerce/readiness";
import { SLA_TAKE_BPS, splitSlaCommission } from "../commerce/sla-commission";
import { screenLeadMessage, type LeakHit } from "./lead-containment";

/** @deprecated use SLA_TAKE_BPS (4%) */
export const PLATFORM_COMMISSION_BPS = SLA_TAKE_BPS;
export const DESK_CURRENCY = "GMD";

export type DeskKind = "logistics" | "equipment" | "coach" | "courier" | "professionals";

export type DeskThread = {
  id: string;
  kind: DeskKind;
  subject: string;
  createdAt: string;
  messages: Array<{
    at: string;
    from: "seeker" | "merchant" | "ops";
    body: string;
    redacted?: boolean;
  }>;
  booked: false;
  escrow: false;
  commissionBps: number;
  circumventionFlags: LeakHit[];
};

const threads = new Map<string, DeskThread>();

export function commissionPreview(amountMinor: number) {
  const split = splitSlaCommission(amountMinor);
  return {
    currency: DESK_CURRENCY,
    amountMinor,
    commissionBps: SLA_TAKE_BPS,
    fortisBps: 300,
    integratorBps: 100,
    commissionMinor: split.fortisMinor + split.integratorMinor,
    fortisMinor: split.fortisMinor,
    integratorMinor: split.integratorMinor,
    netToOperatorMinor: split.merchantNetMinor,
    collectable: false,
    reason: publicCommerceReady()
      ? "gates_pass_but_adapter_not_wired"
      : "public_commerce_not_live",
  };
}

export function openDeskThread(input: { kind: DeskKind; subject: string; firstMessage: string }): DeskThread {
  if (!input.subject.trim() || !input.firstMessage.trim()) throw new Error("incomplete");
  const screen = screenLeadMessage(input.firstMessage);
  const id = `DSK-${new Date().getUTCFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
  const row: DeskThread = {
    id,
    kind: input.kind,
    subject: input.subject.trim(),
    createdAt: new Date().toISOString(),
    messages: [
      {
        at: new Date().toISOString(),
        from: "seeker",
        body: screen.storedBody,
        redacted: screen.blocked,
      },
    ],
    booked: false,
    escrow: false,
    commissionBps: PLATFORM_COMMISSION_BPS,
    circumventionFlags: screen.hits,
  };
  threads.set(id, row);
  return row;
}

export function postDeskMessage(
  id: string,
  body: string,
  from: "seeker" | "merchant" | "ops" = "seeker",
): DeskThread {
  const row = threads.get(id);
  if (!row) throw new Error("thread_not_found");
  if (!body.trim()) throw new Error("incomplete");
  const screen = from === "ops" ? { hits: [] as LeakHit[], blocked: false, storedBody: body.trim() } : screenLeadMessage(body);
  row.messages.push({
    at: new Date().toISOString(),
    from,
    body: screen.storedBody,
    redacted: screen.blocked,
  });
  row.circumventionFlags.push(...screen.hits);
  return row;
}

export function getDeskThread(id: string): DeskThread | undefined {
  return threads.get(id);
}

export function attemptDeskCheckout(_threadId: string) {
  return {
    ok: false as const,
    status: 503,
    booked: false,
    escrow: false,
    commission: commissionPreview(0),
    message:
      "Hire, freight and coach stay on-platform when a licensed PSP, KYB reviewers and PAYMENT_LIVE_DECISION are in place. WhatsApp is not a FORTIS rail. No deposit is held.",
  };
}

export type FreightLane = {
  origin: string;
  dest: string;
  mode: "road" | "sea" | "air";
};

/** Planning index only — not GPA, not a carrier tariff. */
export function estimateFreight(input: { kg: number; cbm?: number; origin: string; dest: string }) {
  const kg = Math.max(0, input.kg);
  const cbm = Math.max(0, input.cbm ?? 0);
  const chargeable = Math.max(kg, cbm * 167);
  const domestic = !/dakar|conakry|freetown|accra|lagos|london|dubai|guangzhou|mumbai|new york/i.test(input.dest);
  const sea = Math.round(chargeable * (domestic ? 8 : 22) + 1500);
  const air = Math.round(chargeable * (domestic ? 45 : 180) + 800);
  const road = Math.round(chargeable * (domestic ? 12 : 35) + 400);
  return {
    freshness: "ILLUSTRATIVE_MODEL" as const,
    origin: input.origin,
    dest: input.dest,
    chargeableKg: chargeable,
    gmd: { sea, air, road },
    assumptions: [
      "Not a GPA, carrier, or customs quote.",
      "Chargeable weight is max(actual kg, CBM × 167).",
      "Duty, VAT, last-mile and demurrage are excluded.",
    ],
  };
}

export const GAMBIAN_ORIGINS = [
  "Banjul Port",
  "Banjul International Airport",
  "Farafenni Border",
  "Karang Border",
  "Basse Land Border",
] as const;

export const FREIGHT_DESTINATIONS = [
  ...GAMBIAN_ORIGINS,
  "Dakar, Senegal",
  "Conakry, Guinea",
  "Freetown, Sierra Leone",
  "Accra, Ghana",
  "Lagos, Nigeria",
  "London, UK",
  "Dubai, UAE",
  "Guangzhou, China",
  "Mumbai, India",
  "New York, USA",
] as const;

export const EQUIPMENT_CLASSES = [
  "Construction plant",
  "Road freight vehicles",
  "Standby power / solar packs",
  "Agricultural machinery",
  "Event / media kit",
] as const;

export function resetDeskThreads(): void {
  threads.clear();
}
