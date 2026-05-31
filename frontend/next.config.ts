import type { NextConfig } from 'next'

const serverActionAllowedOrigins = (process.env.SERVER_ACTION_ALLOWED_ORIGINS ?? 'g.kosame.dev')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0)

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: serverActionAllowedOrigins,
    },
  },
  async rewrites () {
    const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
