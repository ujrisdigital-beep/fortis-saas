import { grantFit } from "../tools/models";

export interface OrgGrantProfile {
  country: string;
  sectors: string[];
  asOf: string;
}

export function matchGrants(profile: OrgGrantProfile) {
  return grantFit(profile.sectors).map((g) => ({
    id: g.id,
    title: g.title,
    funder: g.funder,
    url: g.url,
    deadline: null as string | null,
    open: false,
    sourceNote: "Watchlist only — confirm the live call on the funder URL. No editorial match score.",
    retrievedAsOf: profile.asOf,
    overlapSectors: g.themes.filter((s) => profile.sectors.includes(s)),
    listedScore: null as number | null,
    scoreKind: "theme_overlap_only" as const,
    countryOk: profile.country === "Gambia" || profile.country === "GM",
  }));
}
