export interface AuditEventInput {
  type: string;
  organisationId?: string;
  actorId?: string;
  correlationId: string;
  payload: Record<string, unknown>;
}

export function createAuditEvent(input: AuditEventInput) {
  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}
