"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Laptop } from "lucide-react";

const themes = [
  {
    name: "light",
    icon: Sun,
    color: "#fbbf24",
  },
  {
    name: "dark",
    icon: Moon,
    color: "#818cf8",
  },
  {
    name: "system",
    icon: Laptop,
    color: "#94a3b8",
  },
] as const;

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = themes.find((t) => t.name === theme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-accent"
      >
        {<currentTheme.icon className="w-5 h-5" />}
      </motion.button>

      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: {
            clipPath: "inset(0% 0% 0% 0%)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.4,
              delayChildren: 0.1,
              staggerChildren: 0.05,
            },
          },
          closed: {
            clipPath: "inset(10% 50% 90% 50%)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
        className={`absolute right-0 mt-2 bg-background border rounded-lg shadow-lg ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {themes.map((t) => (
          <motion.button
            key={t.name}
            variants={{
              open: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 300, damping: 24 },
              },
              closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
            }}
            onClick={() => {
              setTheme(t.name);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent first:rounded-t-lg last:rounded-b-lg"
          >
            <t.icon className="w-4 h-4 mr-2" />
            <span className="capitalize">{t.name}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
