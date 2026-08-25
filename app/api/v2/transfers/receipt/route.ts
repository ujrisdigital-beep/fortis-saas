import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { rideStore } from "@/lib/rides/registry";
import { issueProvisionalReceipt } from "@/lib/payments/receipt";
import { canUseService } from "@/lib/payments/transfer";

export async function GET(request: Request) {
  const access = await requireApiAccess("billing", "read");
  if (!access.ok) return access.response;
  const reference = new URL(request.url).searchParams.get("reference") ?? "";
  const instruction = rideStore.transfers.get(reference);
  if (!instruction || !canUseService(instruction)) {
    return NextResponse.json({ error: "receipt_unavailable", code: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json(
    issueProvisionalReceipt(instruction, {
      reference,
      payerName: "declared",
      method: "bank",
      declaredAmountMinor: instruction.amountMinor,
      proofNote: "on_file",
      declaredPaidAt: instruction.createdAt,
      submittedAt: new Date().toISOString(),
    }),
  );
}
