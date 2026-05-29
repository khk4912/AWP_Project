const TOKEN_KEY = 'token'
const AUTH_CHANGED_EVENT = 'auth-token-changed'
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function decodeJwtPayload (token: string): unknown {
  const payload = token.split('.')[1]
  if (payload == null || payload.length === 0) return null

  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const decoded = atob(padded)
  const parsed: unknown = JSON.parse(decoded)
  return parsed
}

export function getAuthToken (): string | null {
  if (typeof window === 'undefined') return null

  const tokenCookie = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${TOKEN_KEY}=`))

  if (tokenCookie == null) return null

  return decodeURIComponent(tokenCookie.slice(TOKEN_KEY.length + 1))
}

export function setAuthToken (token: string): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = [
    `${TOKEN_KEY}=${encodeURIComponent(token)}`,
    'path=/',
    `max-age=${TOKEN_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ].join('; ') + secure
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function clearAuthToken (): void {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function getUserIdFromToken (token: string | null = getAuthToken()): string {
  if (token == null) return ''

  try {
    const payload = decodeJwtPayload(token)
    if (!isRecord(payload)) return ''
    const userId = payload.userId
    return typeof userId === 'string' ? userId : ''
  } catch {
    return ''
  }
}

export function isAuthenticated (): boolean {
  return getAuthToken() != null
}
