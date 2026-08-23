export interface DualControlRequest {
  id: string;
  requestedBy: string;
  approvedBy?: string;
  secondApprovedBy?: string;
  status: "pending" | "partial" | "active" | "rejected";
}

export function firstApprove(req: DualControlRequest, actor: string): DualControlRequest {
  if (actor === req.requestedBy) throw new Error("separation_of_duties");
  if (req.status !== "pending") throw new Error("invalid_transition");
  return { ...req, approvedBy: actor, status: "partial" };
}

export function secondApprove(req: DualControlRequest, actor: string): DualControlRequest {
  if (req.status !== "partial" || !req.approvedBy) throw new Error("need_first_approval");
  if (actor === req.requestedBy || actor === req.approvedBy) throw new Error("separation_of_duties");
  return { ...req, secondApprovedBy: actor, status: "active" };
}

export function canReleasePii(req: DualControlRequest): boolean {
  return req.status === "active" && Boolean(req.approvedBy && req.secondApprovedBy);
}
