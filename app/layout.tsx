import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Products Search',
  description: 'Search for products with the power of AI',
  openGraph: {
    title: 'Products Search',
    description: 'Search for products with the power of AI',
    url: 'https://monto-products-search.vercel.app',
    siteName: 'Products Search',
    images: [
      {
        url: 'https://monto-products-search.vercel.app/og-image.png',
        alt: 'Products Search',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  )
}
