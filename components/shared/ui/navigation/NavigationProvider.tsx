'use client';

import { createContext, useContext, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { 
  FaHome, 
  FaBriefcase, 
  FaBlog, 
  FaProjectDiagram,
  FaEnvelope,
  FaGamepad,
  FaTachometerAlt
} from "react-icons/fa";

interface NavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

const defaultNavItems: NavItem[] = [
  {
    name: "Home",
    link: "/",
    icon: <FaHome className="w-4 h-4" />,
  },
  {
    name: "Portfolio",
    link: "/portfolio",
    icon: <FaBriefcase className="w-4 h-4" />,
  },
  {
    name: "Playground",
    link: "/playground",
    icon: <FaGamepad className="w-4 h-4" />,
  },
  {
    name: "Blog",
    link: "/blog",
    icon: <FaBlog className="w-4 h-4" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <FaEnvelope className="w-4 h-4" />,
  },
];

const adminNavItem: NavItem = {
  name: "Dashboard",
  link: "/admin",
  icon: <FaTachometerAlt className="w-4 h-4" />,
};

interface NavigationContextValue {
  navItems: NavItem[];
  isAdmin: boolean;
  status: string;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const value = useMemo(() => {
    const items = [...defaultNavItems];

    if (status === 'authenticated' && isAdmin) {
      items.push(adminNavItem);
    }

    return {
      navItems: items,
      isAdmin,
      status
    };
  }, [status, isAdmin]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export function useNavItems() {
  const { navItems } = useNavigation();
  return navItems;
}
