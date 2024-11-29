'use client';

import FloatingNav from '@/components/shared/ui/navigation/FloatingNavbar';
import Footer from '@/components/layout/sections/Footer';
import { NavigationProvider } from '@/components/shared/ui/navigation/NavigationProvider';
import { useNavItems } from '@/components/shared/ui/navigation/NavItems';

export default function BlogLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <NavigationProvider>
      <BlogLayoutContent>
        {children}
      </BlogLayoutContent>
    </NavigationProvider>
  );
}

function BlogLayoutContent({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const navItems = useNavItems();

  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNav navItems={navItems} />
      <div className="pt-20 flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
