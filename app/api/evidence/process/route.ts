import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { scanEvidence } from "@/lib/govern/evidence";

export async function POST(req: NextRequest) {
  const access = await requireApiAccess("govern", "write");
  if (!access.ok) return access.response;
  const formData = await req.formData();
  const file = formData.get("files") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const scan = scanEvidence({
    bytes,
    scannerConfigured: Boolean(process.env.FORTIS_MALWARE_SCANNER),
  });
  if (!scan.accepted) {
    return NextResponse.json(
      { success: false, forensicReady: false, error: scan.reason, code: "SCANNER_REQUIRED" },
      { status: 503 },
    );
  }
  return NextResponse.json({ success: true, forensicReady: false, queued: true });
}

export async function GET() {
  return NextResponse.json({
    status: process.env.FORTIS_MALWARE_SCANNER ? "scanner_configured" : "scanner_unavailable",
    mockExtraction: false,
  });
}
