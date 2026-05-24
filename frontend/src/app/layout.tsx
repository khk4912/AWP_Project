import type { Metadata } from 'next'
import { Noto_Sans_KR as notoSansKrFont } from 'next/font/google'

import './globals.css'

const notoSansKr = notoSansKrFont({
  // weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: 'Z',
  description: 'Z social network',
}

export default function RootLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ko'>
      <body className={notoSansKr.className}>{children}</body>
    </html>
  )
}
