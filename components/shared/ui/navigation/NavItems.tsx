'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { 
  FaHome, 
  FaBriefcase, 
  FaBlog, 
  FaProjectDiagram,
  FaEnvelope,
  FaGamepad,
  FaTachometerAlt,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";

interface NavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
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
    requiresAuth: true,
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
  requiresAdmin: true,
};

const authNavItems: NavItem[] = [
  {
    name: "Sign In",
    link: "/auth/signin",
    icon: <FaSignInAlt className="w-4 h-4" />,
  },
  {
    name: "Sign Up",
    link: "/auth/signup",
    icon: <FaUserPlus className="w-4 h-4" />,
  },
];

export function useNavItems() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const isAuthenticated = status === 'authenticated';
  const isVerified = session?.user?.isVerified;

  return useMemo(() => {
    const items = [...defaultNavItems];

    // Filter items based on auth status
    const filteredItems = items.filter(item => {
      if (item.requiresAuth && !isAuthenticated) return false;
      if (item.requiresAdmin && !isAdmin) return false;
      return true;
    });

    // Add admin dashboard if user is admin
    if (isAuthenticated && isAdmin) {
      filteredItems.push(adminNavItem);
    }

    // Add auth items if user is not authenticated
    if (!isAuthenticated) {
      filteredItems.push(...authNavItems);
    }

    return filteredItems;
  }, [status, isAdmin, isAuthenticated, isVerified]);
}
