import type { Membership } from "./policy";

/**
 * Load active organisation memberships for the authenticated user.
 * Fail closed: any datastore error yields no memberships (deny).
 */
export async function loadActiveMemberships(userId: string): Promise<Membership[]> {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const rows = await prisma.organisationMembership.findMany({
      where: { userId, status: "ACTIVE" },
    });
    await prisma.$disconnect();
    return rows.map((row) => ({
      organisationId: row.organisationId,
      userId: row.userId,
      roleKey: row.roleKey,
      status: row.status as Membership["status"],
    }));
  } catch {
    return [];
  }
}
