import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "SUPER_ADMIN" | "CEO" | "BOARD" | "MANAGER" | "CLIENT" | "GOVERNMENT" | "PUBLIC";
      orgId?: string;
      emailVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "SUPER_ADMIN" | "CEO" | "BOARD" | "MANAGER" | "CLIENT" | "GOVERNMENT" | "PUBLIC";
    orgId?: string;
    emailVerified?: boolean;
  }
}
