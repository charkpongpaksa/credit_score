import type { Metadata } from 'next'
import { Prompt } from 'next/font/google'
import '../index.css'
import { AppProvider } from '@/context/AppContext'

const prompt = Prompt({ 
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['thai', 'latin'],
  display: 'swap',
  variable: '--font-prompt',
})

export const metadata: Metadata = {
  title: 'Credit Risk System',
  description: 'Analytical Sanctuary Credit Risk Assessment System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={prompt.variable}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
