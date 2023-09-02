import { ThemeProvider } from '@/components/theme/theme-provider'
import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react';
import { Button } from '@/components/ui/button'
import { BrainCircuit, Github, Twitter } from 'lucide-react'
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Fine Tuning",
    "Openai",
    "No code",
    "chatGPT",
    "AI"
  ],
  authors: [
    {
      name: "joris delorme",
      url: "https://jorisdelorme.fr",
    },
  ],
  creator: "joris delorme",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@joris_delorme_",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="absolute z-[99] flex justify-between w-full px-4 sm:top-6 sm:px-10 top-4 left-0">
            <div className="items-center space-x-2 flex">
              <BrainCircuit size={24} />
              <p className='hidden font-bold sm:inline-block'>Fine Tuning</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" asChild>
                <a href="mailto:hello@jorisdelorme.fr">request feature</a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a aria-label="Check out the Github" href="https://github.com/joris-delorme" target="_blank" rel="noopener noreferrer"><Github className='h-[1.2rem] w-[1.2rem]' /></a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a aria-label="Check out my Twitter" href="https://twitter.com/joris_delorme_" target="_blank" rel="noopener noreferrer"><Twitter className='h-[1.2rem] w-[1.2rem]' /></a>
              </Button>
              <ModeToggle />
            </div>
          </div>
          <Toaster  />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
