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

export function useNavItems() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return useMemo(() => {
    const items = [...defaultNavItems];

    if (status === 'authenticated' && isAdmin) {
      items.push(adminNavItem);
    }

    return items;
  }, [status, isAdmin]);
}
