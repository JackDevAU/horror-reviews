import type { Metadata } from 'next'
import { Chivo } from 'next/font/google'
import './globals.scss'
import Navbar from '@/components/nav/navbar'
import Footer from '@/components/footer'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

const chivo = Chivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chivo',
})
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('bg-gray-950 text-gray-50  dark', chivo.className)}>
        <Navbar />
        <main className="bg-gray-950 text-gray-50 min-h-screen dark">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
