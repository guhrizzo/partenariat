import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/constants/auth";

const SESSION_EXPIRES_IN_MS = 14 * 24 * 60 * 60 * 1000;

export async function createSessionCookie(idToken: string) {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN_MS,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRES_IN_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}
