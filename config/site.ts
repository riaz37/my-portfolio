export const siteConfig = {
  name: "Riazul's Portfolio",
  description: "Full Stack Web Developer and AI Enthusiast",
  author: "Riazul Islam",
  url: "https://riaz37.vercel.app",
  keywords: [
    "Riazul Islam",
    "Portfolio",
    "Full Stack Developer",
    "Web Developer",
    "AI",
    "Machine Learning",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
  ] as string[],
  links: {
    github: "https://github.com/riaz37",
    linkedin: "https://linkedin.com/in/riaz37",
    twitter: "https://twitter.com/riaz37",
  },
  nav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Portfolio",
      href: "/portfolio",
    },
    {
      title: "Playground",
      href: "/playground",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
} as const;
