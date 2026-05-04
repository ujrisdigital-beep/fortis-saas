import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// FORTIS OS — Completely open access. No authentication required for any page.
// Security headers are applied on all responses.

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "X-Copyright",
    "© FORTIS INVICTA LTD. All rights reserved. FORTIS OS™, IKENGA™, UJU Cycle™ are trademarks of UJU GROUP LIMITED."
  );
  response.headers.set("X-Legal-Inquiries", "legal@fortisos.gm");
  if (process.env.NODE_ENV === "production") {
    response.headers.set("X-SourceMap", "disabled");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)$).*)",
  ],
};
