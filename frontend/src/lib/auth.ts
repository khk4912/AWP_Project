const TOKEN_KEY = 'token'

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
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken (token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken (): void {
  window.localStorage.removeItem(TOKEN_KEY)
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
