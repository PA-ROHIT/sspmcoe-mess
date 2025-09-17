import &apos;./globals.css&apos;
import type { Metadata } from &apos;next&apos;
import { Inter, Poppins } from &apos;next/font/google&apos;
import ClientLayout from &apos;./ClientLayout&apos;

const poppins = Poppins({ 
  weight: [&apos;400&apos;, &apos;500&apos;, &apos;600&apos;, &apos;700&apos;],
  subsets: [&apos;latin&apos;],
  variable: &apos;--font-poppins&apos;,
})

const inter = Inter({ 
  subsets: [&apos;latin&apos;],
  variable: &apos;--font-inter&apos;,
})

export const metadata: Metadata = {
  title: &apos;MESS - Mess Management System&apos;,
  description: &apos;A comprehensive mess management system&apos;,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}


