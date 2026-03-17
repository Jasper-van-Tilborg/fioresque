import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "fioresque_admin_session";

export async function POST(request: NextRequest) {
  const url = request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/admin/login", url));
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
