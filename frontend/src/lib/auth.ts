import 'server-only'
import { cookies } from 'next/headers'

export const AUTH_COOKIE_NAME = 'token'
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60

export type AuthTokenPayload = {
  userId?: string
  sub?: string
  exp?: number
  iat?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

function getAuthCookieOptions () {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
  }
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function decodeBase64Url (value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8')
  }

  return decodeURIComponent(
    globalThis.atob(padded)
      .split('')
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  )
}

export function decodeJwtPayload (token: string): AuthTokenPayload | null {
  const [, payload] = token.split('.')

  if (!payload) {
    return null
  }

  try {
    const decoded = decodeBase64Url(payload)
    const parsed = JSON.parse(decoded) as unknown

    if (!isRecord(parsed)) return null
    return parsed
  } catch (error) {
    console.error('Failed to decode JWT payload:', error)
  }
  return null
}

export function getUserIdFromToken (token: string | null): string {
  const payload = decodeJwtPayload(token ?? '')
  return payload?.userId ?? payload?.sub ?? ''
}

export function isTokenExpired (token: string | null): boolean {
  const payload = decodeJwtPayload(token ?? '')
  if (!payload || typeof payload.exp !== 'number') return true

  return payload.exp <= Math.floor(Date.now() / 1000)
}

export async function getAuthToken (): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null
}

export async function setAuthToken (token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions())
}

export async function clearAuthToken (): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, '', {
    ...getAuthCookieOptions(),
    maxAge: 0,
  })
}

export async function requireAuthToken (): Promise<string> {
  const token = await getAuthToken()
  if (!token || isTokenExpired(token)) {
    throw new Error('Authentication required')
  }
  return token
}
