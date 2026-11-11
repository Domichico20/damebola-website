import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import type { Role } from "./validators";

export const SESSION_COOKIE = "db_session";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
  sessionVersion: number;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) return null;
  return new TextEncoder().encode(value);
}

export function authConfigured() {
  return Boolean(secret());
}

export async function signSession(user: { id: string; email: string; role: string; sessionVersion: number }) {
  const key = secret();
  if (!key) throw new Error("AUTH_SECRET is missing");
  return new SignJWT({ email: user.email, role: user.role, sv: user.sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key);
}

export async function readToken(token: string) {
  const key = secret();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.role !== "string") return null;
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionVersion: typeof payload.sv === "number" ? payload.sv : 0,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await readToken(token);
  if (!payload) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: payload.id } });
  if (!user || !user.active || user.sessionVersion !== payload.sessionVersion) return null;
  if (user.role !== "owner" && user.role !== "admin" && user.role !== "support") return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    sessionVersion: user.sessionVersion,
  };
}

export async function requireUser(roles?: Role[]) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.mustChangePassword) redirect("/admin/cuenta?cambio=1");
  if (roles && !roles.includes(session.role)) redirect("/admin?aviso=permiso");
  return session;
}

export function safeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) return "/admin";
  if (value.startsWith("/admin/login")) return "/admin";
  return value;
}
