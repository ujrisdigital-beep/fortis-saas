import { grantsDatabase } from "../../data/grants-database";

export interface OrgGrantProfile {
  country: string;
  sectors: string[];
  asOf: string;
}

export function matchGrants(profile: OrgGrantProfile, now = new Date()) {
  return grantsDatabase
    .filter((g) => g.eligibilityCountries.includes(profile.country))
    .filter((g) => g.sectors.some((s) => profile.sectors.includes(s)))
    .map((g) => {
      const open = new Date(g.deadline) >= now;
      return {
        id: g.id,
        title: g.title,
        funder: g.funder,
        url: g.url,
        deadline: g.deadline,
        open,
        sourceNote: "Catalogue entry — not an official live call unless the funder URL confirms it",
        retrievedAsOf: profile.asOf,
        overlapSectors: g.sectors.filter((s) => profile.sectors.includes(s)),
        listedScore: g.fortisEligibilityScore,
        scoreKind: "editorial_hypothesis" as const,
      };
    });
}
