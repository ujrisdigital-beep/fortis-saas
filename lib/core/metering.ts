export type ReservationState = "OPEN" | "COMMITTED" | "RELEASED" | "EXPIRED";

export interface UsageLimit {
  organisationId: string;
  featureKey: string;
  periodKey: string;
  hardLimit: number;
  alertThreshold?: number;
}

export interface UsageReservation {
  id: string;
  organisationId: string;
  featureKey: string;
  units: number;
  state: ReservationState;
  idempotencyKey: string;
}

export interface UsageEvent {
  id: string;
  organisationId: string;
  featureKey: string;
  units: number;
  kind: "consume" | "reverse" | "fail";
  reservationId?: string;
  idempotencyKey: string;
}

export interface MeterStore {
  limits: UsageLimit[];
  reservations: UsageReservation[];
  events: UsageEvent[];
}

function consumedAndReserved(store: MeterStore, org: string, feature: string): number {
  const reserved = store.reservations
    .filter((r) => r.organisationId === org && r.featureKey === feature && r.state === "OPEN")
    .reduce((s, r) => s + r.units, 0);
  const consumed = store.events
    .filter((e) => e.organisationId === org && e.featureKey === feature && e.kind === "consume")
    .reduce((s, e) => s + e.units, 0);
  const reversed = store.events
    .filter((e) => e.organisationId === org && e.featureKey === feature && e.kind === "reverse")
    .reduce((s, e) => s + e.units, 0);
  return reserved + consumed - reversed;
}

export function reserveUsage(
  store: MeterStore,
  input: {
    organisationId: string;
    featureKey: string;
    units: number;
    idempotencyKey: string;
    periodKey: string;
  },
): { ok: true; reservation: UsageReservation } | { ok: false; reason: string } {
  const existing = store.reservations.find((r) => r.idempotencyKey === input.idempotencyKey);
  if (existing) {
    return { ok: true, reservation: existing };
  }
  const limit = store.limits.find(
    (l) =>
      l.organisationId === input.organisationId &&
      l.featureKey === input.featureKey &&
      l.periodKey === input.periodKey,
  );
  if (!limit) {
    return { ok: false, reason: "no_limit" };
  }
  const used = consumedAndReserved(store, input.organisationId, input.featureKey);
  if (used + input.units > limit.hardLimit) {
    return { ok: false, reason: "allowance_exceeded" };
  }
  const reservation: UsageReservation = {
    id: `rsv_${input.idempotencyKey}`,
    organisationId: input.organisationId,
    featureKey: input.featureKey,
    units: input.units,
    state: "OPEN",
    idempotencyKey: input.idempotencyKey,
  };
  store.reservations.push(reservation);
  return { ok: true, reservation };
}

export function commitUsage(store: MeterStore, reservationId: string, idempotencyKey: string): UsageEvent {
  const existing = store.events.find((e) => e.idempotencyKey === idempotencyKey);
  if (existing) return existing;
  const reservation = store.reservations.find((r) => r.id === reservationId);
  if (!reservation || reservation.state !== "OPEN") {
    throw new Error("reservation_not_open");
  }
  reservation.state = "COMMITTED";
  const event: UsageEvent = {
    id: `evt_${idempotencyKey}`,
    organisationId: reservation.organisationId,
    featureKey: reservation.featureKey,
    units: reservation.units,
    kind: "consume",
    reservationId,
    idempotencyKey,
  };
  store.events.push(event);
  return event;
}

export function failUsage(store: MeterStore, reservationId: string, idempotencyKey: string): UsageEvent {
  const existing = store.events.find((e) => e.idempotencyKey === idempotencyKey);
  if (existing) return existing;
  const reservation = store.reservations.find((r) => r.id === reservationId);
  if (!reservation || reservation.state !== "OPEN") {
    throw new Error("reservation_not_open");
  }
  reservation.state = "RELEASED";
  const event: UsageEvent = {
    id: `evt_${idempotencyKey}`,
    organisationId: reservation.organisationId,
    featureKey: reservation.featureKey,
    units: reservation.units,
    kind: "fail",
    reservationId,
    idempotencyKey,
  };
  store.events.push(event);
  return event;
}

export function reverseUsage(store: MeterStore, consumeEventId: string, idempotencyKey: string): UsageEvent {
  const existing = store.events.find((e) => e.idempotencyKey === idempotencyKey);
  if (existing) return existing;
  const original = store.events.find((e) => e.id === consumeEventId && e.kind === "consume");
  if (!original) throw new Error("consume_event_missing");
  const event: UsageEvent = {
    id: `evt_${idempotencyKey}`,
    organisationId: original.organisationId,
    featureKey: original.featureKey,
    units: original.units,
    kind: "reverse",
    idempotencyKey,
  };
  store.events.push(event);
  return event;
}

export function shouldAlert(store: MeterStore, org: string, feature: string, periodKey: string): boolean {
  const limit = store.limits.find(
    (l) => l.organisationId === org && l.featureKey === feature && l.periodKey === periodKey,
  );
  if (!limit?.alertThreshold) return false;
  return consumedAndReserved(store, org, feature) >= limit.alertThreshold;
}
