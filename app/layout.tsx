// app/layout.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerSession } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
import { authOptions } from "@/lib/auth";
import { Inter } from 'next/font/google';
import { RootProvider } from '@/components/providers/root-provider';
import { LayoutWrapper } from "@/components/layout/layout-content";
import { siteConfig } from '@/config/site';
import { Providers } from '@/components/providers/providers';
import { ThemeProvider } from 'next-themes';
import { ToastContextProvider } from '@/components/shared/ui/toast/toast-wrapper';
import "./globals.css";
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RootProvider session={session}>
            <Providers>
              <ToastContextProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </ToastContextProvider>
            </Providers>
          </RootProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
