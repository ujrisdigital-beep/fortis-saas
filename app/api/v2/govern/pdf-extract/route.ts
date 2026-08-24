import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { extractPdfText } from "@/lib/govern/document-extract";

export async function POST(req: NextRequest) {
  const access = await requireApiAccess("govern", "write");
  if (!access.ok) return access.response;
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "file required", code: "INVALID_INPUT" }, { status: 400 });
  }
  if (file.type && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "pdf_only", code: "UNSUPPORTED_TYPE" }, { status: 415 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const extracted = await extractPdfText(bytes);
  if (!extracted.ok) {
    return NextResponse.json(
      { ok: false, reason: extracted.reason, invented: false },
      { status: extracted.reason === "not_a_pdf" ? 415 : 422 },
    );
  }
  return NextResponse.json({
    ok: true,
    pages: extracted.pages,
    text: extracted.text.slice(0, 20_000),
    truncated: extracted.text.length > 20_000,
    engine: "pdfjs",
    invented: false,
  });
}
