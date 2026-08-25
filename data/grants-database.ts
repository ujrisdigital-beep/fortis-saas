import { GRANT_WATCHLIST, type GrantWatch } from "../lib/tools/models";

/** @deprecated Use GRANT_WATCHLIST. Kept so old imports compile. */
export type GrantOpportunity = GrantWatch & {
  deadline?: string;
  fortisEligibilityScore?: number;
};

export const grantsDatabase: GrantOpportunity[] = GRANT_WATCHLIST;
