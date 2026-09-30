import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import legacyRedirects from "./data/legacy-redirects.json";

const intlProxy = createMiddleware(routing);

// Eski WordPress adresleri → yeni sayfalar (cPanel .htaccess'teki 143 kuralın aynısı)
const legacyRedirectMap = new Map<string, string>(Object.entries(legacyRedirects));

// Güzel Hosting (cPanel) çıplak alan adında kalır: e-posta, form e-postası (api/lead.php) ve eski WP görselleri orada
const CPANEL_ORIGIN = "https://ergentekstil.com";

// Yalnız asıl adres aramada görünür; ergentekstil.altyapi.io ve workers.dev kopya sayılmasın
const INDEXED_HOST = "www.ergentekstil.com";

function legacyWordPressResponse(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/wp-content/uploads/")) {
    return NextResponse.redirect(`${CPANEL_ORIGIN}${pathname}`, 301);
  }
  if (/^\/(feed|comments\/feed|wp-json|xmlrpc\.php|wp-login\.php|wp-admin)(\/|$)/.test(pathname)) {
    return new NextResponse(null, { status: 410 });
  }
  if (/^\/(sitemap_index|wp-sitemap|sitemap-index|[a-z_]+-sitemap\d*)\.xml$/.test(pathname)) {
    return NextResponse.redirect(new URL("/sitemap.xml", request.url), 301);
  }
  if (pathname === "/" && /(^|[?&])p=\d+/.test(search)) {
    return NextResponse.redirect(new URL("/tr/", request.url), 301);
  }

  let key = pathname;
  try {
    key = decodeURIComponent(pathname);
  } catch {}
  const destination = legacyRedirectMap.get(key.replace(/\/+$/, ""));
  if (destination) {
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }
  return null;
}

async function adminProxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // trailingSlash açık: yol "/admin/login/" olarak gelir
  const isLoginPage = request.nextUrl.pathname.replace(/\/$/, "") === "/admin/login";

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const indexed = request.headers.get("host") === INDEXED_HOST;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const response = await adminProxy(request);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const legacy = legacyWordPressResponse(request);
  if (legacy) return legacy;

  // Var olmayan dosya adresleri (ör. eski .php) dil önekine yönlenmesin, doğrudan 404 olsun
  if (request.nextUrl.pathname.includes(".")) return NextResponse.next();

  const response = intlProxy(request);
  if (!indexed) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Statik dosyalar Workers varlık katmanından önce sunulur; buraya yalnız bulunamayan adresler gelir
  matcher: ["/((?!api|trpc|_next|_vercel).*)"],
};
