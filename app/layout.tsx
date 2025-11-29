import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dreflabs.com'),
  title: 'Dref Labs | Big Data, AI & E-Government Expert',
  description:
    'Drefan Mardiawan - IT Expert with 17+ years of experience in Big Data, AI, Cyber Security, and E-Government Digital Transformation.',
  keywords: [
    'Big Data',
    'Artificial Intelligence',
    'Machine Learning',
    'Cyber Security',
    'E-Government',
    'Data Science',
    'Digital Transformation',
    'Government IT',
    'Social Media Analytics',
  ],
  authors: [{ name: 'Drefan Mardiawan' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dreflabs.com',
    siteName: 'Dref Labs',
    title: 'Dref Labs | Big Data, AI & E-Government Expert',
    description:
      'Transforming Data into Insights, Building Digital Government Solutions',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dref Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dref Labs | Big Data, AI & E-Government Expert',
    description:
      'Transforming Data into Insights, Building Digital Government Solutions',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

import CustomCursor from '@/components/ui/CustomCursor'

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans overflow-x-hidden`}>
        <CustomCursor />
        <div className="relative min-h-screen">
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
