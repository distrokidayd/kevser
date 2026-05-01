import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const langs = ["tr", "en", "ar", "de", "fr", "es", "ru", "fa", "ur", "zh", "id", "ms"];

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/trpc")
  ) {
    return NextResponse.next();
  }

  const hasLang = langs.some((lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`));

  if (hasLang) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/tr${pathname}`;

  return NextResponse.redirect(url);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
