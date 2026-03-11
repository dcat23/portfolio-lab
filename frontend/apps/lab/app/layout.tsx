import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { ReactNode } from 'react';
import { Layout } from '../components/layout';
import './global.css';
import Providers from './providers';
import { Metadata } from "next";
import { PROJECT_DESCRIPTION } from "@feature/base/server"


// Configure fonts with proper options
const geist = Geist({
  subsets: ["latin"],
  variable: '--font-geist',
  display: 'swap',
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono',
  display: 'swap',
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lab.catuns.xyz'),
  title: {
    default: "DCAT — Devin Catuns's Digital Laboratory",
    template: "%s | DCAT",
  },
  description: PROJECT_DESCRIPTION,
  keywords: ["Software Engineering", "Web Development", "Next.js", "React", "TypeScript", "AI", "Machine Learning", "Systems Programming", "Code Experiments"],
  authors: [{ name: "Devin Catuns", url: "https://github.com/dcat23" }],
  creator: "Devin Catuns",
  publisher: "Devin Catuns",
  generator: "v0.app",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "DCAT — Devin Catuns's Digital Laboratory",
    description: "DESCRIPTION",
    siteName: "DCAT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DCAT — Devin Catuns's Digital Laboratory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DCAT — Devin Catuns's Digital Laboratory",
    description: "A digital workshop where code meets curiosity. Experiments, prototypes, and open-source artifacts.",
    creator: "@devincatuns",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
