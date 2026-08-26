import './global.css'
import type { Metadata } from 'next'
import { Courier_Prime, Manrope } from 'next/font/google'
import Header from './components/layout/header'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/layout/footer'
import { baseUrl } from './sitemap'
import MainContent from './components/layout/MainContent'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Jacques Verré',
    template: '%s | Jacques Verré',
  },
  description: 'Essays and technical notes about AI products, language models, and software systems.',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon.png',
        color: '#000000',
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Jacques Verré',
    description: 'Essays and technical notes about AI products, language models, and software systems.',
    url: baseUrl,
    siteName: 'Jacques Verré',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og?title=${encodeURIComponent('Jacques Verré')}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jacques Verré',
    description: 'Essays and technical notes about AI products, language models, and software systems.',
  },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     'max-video-preview': -1,
  //     'max-image-preview': 'large',
  //     'max-snippet': -1,
  //   },
  // },
}

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
})

const mono = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="site-body">
        <div className="site-shell">
          <MainContent>
            <Header />
            {children}
            <Footer />
          </MainContent>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
