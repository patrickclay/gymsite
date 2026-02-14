import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE_NAME = "admin_session";
const SALT = "gymsite-admin-v1";

function sessionToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return "";
  return createHash("sha256").update(password + SALT).digest("hex");
}

export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token === sessionToken();
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}
