import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Codelore – AI Repository Analysis & Codebase Insights',
  description: 'Instantly understand any codebase with AI-generated repository summaries, architecture diagrams, and code explanations. Explore, document, and onboard faster with Codelore.',
  metadataBase: new URL('https://codelore.vercel.app/'),
  alternates: {
    canonical: 'https://codelore.vercel.app/',
  },
  openGraph: {
    title: 'Codelore – AI Repository Analysis & Codebase Insights',
    description: 'Instantly understand any codebase with AI-generated repository summaries, architecture diagrams, and code explanations.',
    url: 'https://codelore.vercel.app/',
    siteName: 'Codelore',
    images: [
      {
        url: 'https://codelore.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Codelore – AI Repository Analysis & Codebase Insights',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codelore – AI Repository Analysis & Codebase Insights',
    description: 'Instantly understand any codebase with AI-generated repository summaries, architecture diagrams, and code explanations.',
    site: '@codeloreapp',
    creator: '@codeloreapp',
    images: ['https://codelore.vercel.app/og-image.png'],
  },
  keywords: [
    'AI code analysis',
    'repository analysis',
    'codebase insights',
    'code documentation',
    'code summaries',
    'architecture diagrams',
    'developer tools',
    'code exploration',
    'onboarding',
    'Codelore',
    // Added relevant search intent keywords
    'AI code review',
    'code understanding',
    'codebase visualization',
    'source code analysis',
    'AI documentation',
    'automated code documentation',
    'codebase onboarding',
    'code mapping',
    'code search',
    'AI developer tools',
    'open source analysis',
    'code intelligence',
    'codebase summary',
    'repository visualization',
    'software architecture',
    'AI code assistant',
    'codebase explorer',
    'code insights platform',
    'AI code summarizer',
    'developer onboarding tools'
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  authors: [{ name: 'Codelore Team', url: 'https://codelore.vercel.app/' }],
  creator: 'Codelore Team',
  publisher: 'Codelore',
  category: 'technology',
  applicationName: 'Codelore',
  referrer: 'origin-when-cross-origin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark light" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`flex flex-col min-h-screen font-sans antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}