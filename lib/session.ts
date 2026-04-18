import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { COOKIE_NAME, verifyToken, type JWTPayload } from "./auth"

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession()
  if (!session) redirect("/auth/login")
  return session
}

export async function requireAdmin(): Promise<JWTPayload> {
  const session = await getSession()
  if (!session) redirect("/auth/login")
  if (session.role !== "ADMIN") redirect("/")
  return session
}
