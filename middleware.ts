import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

type Role = "CEO" | "BOARD" | "MANAGER" | "CLIENT" | "GOVERNMENT" | "PUBLIC";

type WindowEntry = { count: number; startMs: number };

const windows = new Map<string, WindowEntry>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQ = 60;

function limitAi(userId: string) {
  const now = Date.now();
  const existing = windows.get(userId);

  if (!existing || now - existing.startMs > WINDOW_MS) {
    windows.set(userId, { count: 1, startMs: now });
    return { allowed: true, remaining: MAX_REQ - 1 };
  }

  if (existing.count >= MAX_REQ) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  windows.set(userId, existing);
  return { allowed: true, remaining: MAX_REQ - existing.count };
}

function hasRole(role: Role | undefined, allowed: Role[]) {
  if (!role) {
    return false;
  }
  return allowed.includes(role);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role as Role | undefined;
  const userId = (token?.sub as string | undefined) ?? "anon";

  if (pathname.startsWith("/government")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/board")) {
    if (!hasRole(role, ["CEO", "BOARD"])) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!hasRole(role, ["CEO"])) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/partner")) {
    if (!hasRole(role, ["CLIENT", "CEO", "BOARD"])) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/ai")) {
    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const quota = limitAi(userId);
    if (!quota.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

    const response = NextResponse.next();
    response.headers.set("x-rate-remaining", String(quota.remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/board/:path*", "/admin/:path*", "/partner/:path*", "/government/:path*", "/api/ai/:path*"],
};
