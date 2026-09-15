import { Analytics } from '@vercel/analytics/next';
import {
  PROJECT_DESCRIPTION,
  PROJECT_NAME,
  PROJECT_TITLE,
} from '@app/lab/lib/constants/metadata';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './global.css';
import Providers from './providers';
import { Layout } from '../components/layout';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://lab.catuns.xyz',
  ),
  title: {
    default: PROJECT_NAME,
    template: `%s | ${PROJECT_NAME}`,
  },
  description: PROJECT_DESCRIPTION,
  keywords: [
    'Software Engineering',
    'Web Development',
    'Next.js',
    'React',
    'TypeScript',
    'AI',
    'Machine Learning',
    'Systems Programming',
    'Code Experiments',
  ],
  authors: [{ name: 'Devin Catuns', url: 'https://github.com/dcat23' }],
  creator: 'Devin Catuns',
  publisher: 'Devin Catuns',
  generator: 'next-feature',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: PROJECT_TITLE,
    description: PROJECT_DESCRIPTION,
    siteName: PROJECT_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "DCAT — Devin Catuns's Digital Laboratory",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PROJECT_TITLE,
    description: PROJECT_DESCRIPTION,
    creator: '@devincatuns',
    images: ['/og-image.png'],
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
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
