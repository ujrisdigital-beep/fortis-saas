import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProductionBlock } from "./lib/production-readiness";

export function middleware(request: NextRequest) {
  const block = getProductionBlock(request.nextUrl.pathname, request.method);
  const enforceReadiness =
    process.env.NODE_ENV === "production" &&
    process.env.FORTIS_ALLOW_NON_PRODUCTION_MODULES !== "true";

  if (block && enforceReadiness) {
    const payload = {
      ok: false,
      code: "MODULE_NOT_PRODUCTION_READY",
      message: "This module is unavailable until its live production integration passes the FORTIS-SBN readiness gates.",
      reason: block.reason,
      requiredIntegration: block.replacement,
    };

    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(payload, {
        status: 503,
        headers: { "Retry-After": "86400" },
      });
    }

    const unavailableUrl = new URL("/", request.url);
    unavailableUrl.searchParams.set("notice", "module-not-production-ready");
    return NextResponse.redirect(unavailableUrl, 307);
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  response.headers.set(
    "X-Copyright",
    "© FORTIS INVICTA LTD. All rights reserved. FORTIS OS™, IKENGA™, UJU Cycle™ are trademarks of UJU GROUP LIMITED.",
  );
  response.headers.set("X-Legal-Inquiries", "legal@fortisos.gm");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)$).*)",
  ],
};
