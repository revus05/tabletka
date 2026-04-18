import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, COOKIE_NAME } from "@/lib/auth"

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/((?!_next|favicon.ico|api).*)"],
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const payload = token ? await verifyToken(token) : null
  const { pathname } = request.nextUrl

  // Pass pathname to layout via header (for conditional header rendering)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  if (pathname.startsWith("/admin")) {
    if (!payload) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (pathname.startsWith("/auth") && payload) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}
