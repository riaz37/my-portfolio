import { getPublicUrl } from '@/utils/url';

export const siteConfig = {
  name: "Riazul's Portfolio",
  description: "Full Stack Web Developer and AI Enthusiast",
  author: "Riazul Islam",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://riaz37.vercel.app",
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
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/riaz37",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/riaz37",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/riaz37",
  },
  nav: [
    {
      title: "Home",
      href: getPublicUrl("/"),
    },
    {
      title: "Blog",
      href: getPublicUrl("/blog"),
    },
    {
      title: "Portfolio",
      href: getPublicUrl("/portfolio"),
    },
    {
      title: "Playground",
      href: getPublicUrl("/playground"),
    },
    {
      title: "Contact",
      href: getPublicUrl("/contact"),
    },
  ],
} as const;
