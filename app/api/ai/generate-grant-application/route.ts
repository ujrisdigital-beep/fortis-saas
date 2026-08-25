import { NextResponse } from "next/server";
import { GRANT_WATCHLIST, outlineGrantDraft } from "../../../../lib/tools/models";

export async function POST(req: Request) {
  const payload = (await req.json()) as {
    grantId?: string;
    projectDescription?: string;
    orgName?: string;
  };
  const grant = GRANT_WATCHLIST.find((item) => item.id === payload.grantId);
  if (!grant) {
    return NextResponse.json({ error: "Watchlist item not found." }, { status: 404 });
  }
  const draft = outlineGrantDraft({
    funder: grant.funder,
    project: payload.projectDescription ?? "",
    org: payload.orgName ?? "",
  });
  return NextResponse.json({
    draft,
    filing: false,
    notice: "Outline only. Not submitted to the funder.",
  });
}
