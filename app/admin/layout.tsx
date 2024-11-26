'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  GamepadIcon,
  BookOpen,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { inter } from "@/app/fonts";

const sidebarItems = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/admin',
  },
  {
    name: 'Blog Posts',
    icon: <FileText className="h-5 w-5" />,
    href: '/admin/blogs',
  },
  {
    name: 'Projects',
    icon: <Briefcase className="h-5 w-5" />,
    href: '/admin/projects',
  },
  {
    name: 'Resources',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/admin/resources',
  },
  {
    name: 'Newsletter',
    icon: <Mail className="h-5 w-5" />,
    href: '/admin/newsletter',
  },
  {
    name: 'Playground',
    icon: <GamepadIcon className="h-5 w-5" />,
    href: '/admin/playground',
  },
  {
    name: 'Testimonials',
    icon: <MessageSquare className="h-5 w-5" />,
    href: '/admin/testimonials',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect if on login or reset password page
    const isAuthPage = window.location.pathname === '/admin/login' || 
                      window.location.pathname === '/admin/reset-password';
    if (status === 'unauthenticated' && !isAuthPage) {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't show admin layout on login or reset password page
  const isAuthPage = typeof window !== 'undefined' && 
    (window.location.pathname === '/admin/login' || 
     window.location.pathname === '/admin/reset-password');
  if (isAuthPage) {
    return <div className="bg-background">{children}</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <div className="flex relative">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="sticky top-0 left-0 z-[60] flex h-screen w-64 flex-col border-r border-border bg-card pt-24 overflow-y-auto"
        >
          <div className="flex h-full flex-col px-3 py-4">
            <div className="mb-10 flex items-center px-3">
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-black ${
                    typeof window !== 'undefined' &&
                    window.location.pathname === item.href
                      ? 'bg-accent text-black'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-1">
              <Link
                href="/admin/settings"
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-black ${
                  typeof window !== 'undefined' &&
                  window.location.pathname === '/admin/settings'
                    ? 'bg-accent text-black'
                    : 'text-muted-foreground'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="ml-3">Settings</span>
              </Link>

              <button
                onClick={() => router.push('/api/auth/signout')}
                className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-black"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Log Out</span>
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 py-8 pt-24 pb-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
