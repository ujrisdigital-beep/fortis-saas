export type PolicyAction =
  | "read"
  | "write"
  | "admin"
  | "billing.manage"
  | "entitlement.check"
  | "usage.record"
  | "payment.intent";

export type PolicyApplet =
  | "core"
  | "grow"
  | "govern"
  | "marketplace"
  | "training"
  | "billing"
  | "admin";

export interface PermissionRule {
  applet: PolicyApplet | "*";
  action: PolicyAction | "*";
  resource?: string;
}

export const SYSTEM_ROLES: Record<string, { name: string; grants: PermissionRule[] }> = {
  org_owner: {
    name: "Organisation owner",
    grants: [{ applet: "*", action: "*" }],
  },
  org_admin: {
    name: "Organisation admin",
    grants: [
      { applet: "core", action: "*" },
      { applet: "grow", action: "*" },
      { applet: "govern", action: "*" },
      { applet: "marketplace", action: "*" },
      { applet: "training", action: "*" },
      { applet: "billing", action: "read" },
      { applet: "billing", action: "entitlement.check" },
    ],
  },
  org_billing: {
    name: "Billing operator",
    grants: [
      { applet: "billing", action: "*" },
      { applet: "core", action: "read" },
    ],
  },
  org_member: {
    name: "Member",
    grants: [
      { applet: "grow", action: "read" },
      { applet: "grow", action: "write" },
      { applet: "training", action: "read" },
      { applet: "billing", action: "entitlement.check" },
    ],
  },
  org_viewer: {
    name: "Viewer",
    grants: [
      { applet: "grow", action: "read" },
      { applet: "training", action: "read" },
    ],
  },
};

export function roleAllows(
  roleKey: string,
  applet: PolicyApplet,
  action: PolicyAction,
  resource = "*",
): boolean {
  const role = SYSTEM_ROLES[roleKey];
  if (!role) return false;
  return role.grants.some((grant) => {
    const appletOk = grant.applet === "*" || grant.applet === applet;
    const actionOk = grant.action === "*" || grant.action === action;
    const resourceOk = !grant.resource || grant.resource === "*" || grant.resource === resource;
    return appletOk && actionOk && resourceOk;
  });
}
