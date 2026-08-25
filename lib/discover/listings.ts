export type ListingStatus = "DRAFT" | "SUBMITTED" | "VERIFIED" | "REJECTED";

export interface Listing {
  id: string;
  name: string;
  category: string;
  status: ListingStatus;
  verifiedAt?: string;
}

export function submitListing(listing: Listing): Listing {
  if (listing.status !== "DRAFT") throw new Error("invalid_transition");
  return { ...listing, status: "SUBMITTED" };
}

export function verifyListing(listing: Listing, now = new Date()): Listing {
  if (listing.status !== "SUBMITTED") throw new Error("invalid_transition");
  return { ...listing, status: "VERIFIED", verifiedAt: now.toISOString() };
}

export function publicListings(all: Listing[]): Listing[] {
  return all.filter((l) => l.status === "VERIFIED");
}
