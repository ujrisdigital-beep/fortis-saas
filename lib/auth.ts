import type { NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export type AppRole = "SUPER_ADMIN" | "CEO" | "BOARD" | "MANAGER" | "CLIENT" | "GOVERNMENT" | "PUBLIC";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: { email?: string; password?: string } | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            include: { organisation: true },
          });

          if (!user) {
            return null;
          }

          // Compare password with hashed password
          const passwordMatch = await bcrypt.compare(credentials.password, user.password || "");
          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            orgId: user.orgId,
          } as never;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: AppRole }).role ?? "PUBLIC";
        token.orgId = (user as { orgId?: string }).orgId ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as AppRole) ?? "PUBLIC";
        session.user.orgId = (token.orgId as string) ?? "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export async function getAppServerSession() {
  return getServerSession(authOptions);
}

export function requireRole(userRole: AppRole | undefined, roles: AppRole[]) {
  if (!userRole) {
    return false;
  }
  return roles.includes(userRole);
}
