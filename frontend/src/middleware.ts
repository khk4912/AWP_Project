import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'token'
const authRoutes = new Set(['/login', '/register', '/logout'])
const publicFilePattern = /\.(.*)$/

type AuthTokenPayload = {
  exp?: number
}

function decodeBase64Url (value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  )
}

function decodeJwtPayload (token: string): AuthTokenPayload | null {
  const [, payload] = token.split('.')
  if (payload == null) return null

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as unknown
    if (typeof parsed !== 'object' || parsed === null) return null
    return parsed
  } catch {
    return null
  }
}

function isTokenExpired (token: string | undefined): boolean {
  if (token == null || token.length === 0) return true

  const payload = decodeJwtPayload(token)
  if (typeof payload?.exp !== 'number') return true

  return payload.exp <= Math.floor(Date.now() / 1000)
}

function isAuthRoute (pathname: string): boolean {
  return authRoutes.has(pathname)
}

function isPublicFile (pathname: string): boolean {
  return publicFilePattern.test(pathname)
}

function getForwardedHeader (request: NextRequest, name: string): string | null {
  return request.headers.get(name)?.split(',')[0]?.trim() || null
}

function isLocalHost (host: string): boolean {
  return host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]')
}

function getRequestOrigin (request: NextRequest): string {
  const host = getForwardedHeader(request, 'x-forwarded-host') ??
    request.headers.get('host') ??
    request.nextUrl.host
  const forwardedProtocol = getForwardedHeader(request, 'x-forwarded-proto')
  const protocol = isLocalHost(host)
    ? (forwardedProtocol ?? request.nextUrl.protocol.replace(':', ''))
    : 'https'

  return `${protocol}://${host}`
}

function getLoginUrl (request: NextRequest): URL {
  const loginUrl = new URL('/login', getRequestOrigin(request))
  const searchParams = new URLSearchParams()
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`

  if (nextPath !== '/') {
    searchParams.set('next', nextPath)
  }

  searchParams.forEach((value, key) => {
    loginUrl.searchParams.set(key, value)
  })

  return loginUrl
}

export function middleware (request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (isPublicFile(pathname) || isAuthRoute(pathname)) {
    return NextResponse.next()
  }

  const isAuthenticated = !isTokenExpired(request.cookies.get(AUTH_COOKIE_NAME)?.value)

  if (!isAuthenticated) {
    if (pathname.startsWith('/internal-api')) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    return NextResponse.redirect(getLoginUrl(request))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
