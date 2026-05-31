import type { Metadata } from 'next'
import './globals.css'

import Providers from './providers'
import { getThemeScript } from '@/lib/theme'

export const metadata: Metadata = {
  title: 'G',
  description: 'G social network',
}

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
