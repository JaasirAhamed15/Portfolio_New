import { NextResponse } from "next/server";
import { signAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const envUsername = process.env.ADMIN_USERNAME || "admin";
    const envPassword = process.env.ADMIN_PASSWORD || "admin1234";

    if (username !== envUsername || password !== envPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signAdminToken(username);

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

