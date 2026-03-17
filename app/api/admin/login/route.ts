import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "fioresque_admin_session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return Response.json(
        { error: "Admin login niet geconfigureerd" },
        { status: 500 }
      );
    }

    if (password !== expected) {
      return Response.json({ error: "Ongeldig wachtwoord" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, "ok", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch {
    return Response.json({ error: "Serverfout" }, { status: 500 });
  }
}
