import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || "fallback_secret_portfolio_2026_key_99";
const key = new TextEncoder().encode(SECRET_KEY);

export const AUTH_COOKIE_NAME = "portfolio_admin_token";

export async function signAdminToken(username: string): Promise<string> {
  return await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = await verifyAdminToken(token);
  return !!payload;
}

