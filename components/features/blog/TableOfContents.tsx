"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const getHeadings = () => {
      const elements = Array.from(document.querySelectorAll("h2, h3, h4")).filter(
        (element) => element.textContent && element.textContent.trim() !== ""
      );
      
      elements.forEach((element) => {
        if (!element.id) {
          const id = element.textContent?.toLowerCase().replace(/\W+/g, "-") || "";
          element.id = id;
          // Add scroll-margin-top to each heading
          element.style.scrollMarginTop = "100px";
        }
      });

      const items: TocItem[] = elements.map((element) => ({
        id: element.id,
        text: element.textContent || "",
        level: Number(element.tagName.charAt(1)),
      }));

      setHeadings(items);
    };

    getHeadings();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0.5,
      }
    );

    document.querySelectorAll("h2, h3, h4").forEach((element) => {
      if (element.id) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <motion.nav
      className="w-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-semibold text-lg mb-4">Table of Contents</h2>
      <ul className="space-y-2 max-h-[calc(100vh-12rem)] overflow-auto pr-4">
        {headings.map((heading) => (
          <motion.li
            key={heading.id}
            className={`${heading.level === 2 ? "" : "ml-4"}`}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`text-left w-full hover:text-primary transition-colors ${
                activeId === heading.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              } ${heading.level === 4 ? "text-sm" : ""}`}
              style={{
                paddingLeft: `${(heading.level - 2) * 1}rem`,
              }}
            >
              {heading.text}
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
