import type { FreshnessState } from "./types";

export function evaluateFreshness(input: {
  publishedAt: string | null;
  retrievedAt: string;
  expectedCadenceHours: number;
  now?: Date;
}): FreshnessState {
  const now = input.now ?? new Date();
  const retrieved = new Date(input.retrievedAt);
  const ageHours = (now.getTime() - retrieved.getTime()) / 36e5;
  if (Number.isNaN(retrieved.getTime())) return "UNAVAILABLE";
  if (ageHours > input.expectedCadenceHours * 2) return "STALE";
  if (!input.publishedAt) return "VERIFIED_SNAPSHOT";
  if (input.expectedCadenceHours <= 24) return "CURRENT";
  return "PERIODIC_OFFICIAL";
}

export function displayFreshness(state: FreshnessState): { label: string; masqueradeAsCurrent: false } {
  const labels: Record<FreshnessState, string> = {
    REAL_TIME: "Real-time feed",
    CURRENT: "Current (daily refresh)",
    PERIODIC_OFFICIAL: "Latest official period",
    VERIFIED_SNAPSHOT: "Verified snapshot",
    STALE: "Stale — do not treat as current",
    UNAVAILABLE: "Unavailable",
  };
  return { label: labels[state], masqueradeAsCurrent: false };
}
