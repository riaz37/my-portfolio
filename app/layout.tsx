// app/layout.tsx
import type { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
import { authOptions } from "@/lib/auth";
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { LayoutWrapper } from "./LayoutContent";
import { siteConfig } from '@/config/site';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@' + siteConfig.author,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <main>
            <LayoutWrapper>{children}</LayoutWrapper>
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
