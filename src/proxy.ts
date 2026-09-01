import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import blogRedirects from "./data/blog-redirects.json";

const intlProxy = createMiddleware(routing);

const legacyRedirectMap = new Map(
  blogRedirects.map((r) => [r.source, r.destination])
);

export function proxy(request: NextRequest) {
  const destination = legacyRedirectMap.get(request.nextUrl.pathname);
  if (destination) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url, 308);
  }

  return intlProxy(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
