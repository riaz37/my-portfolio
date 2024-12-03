import { CareerPath } from "@/types/learningPath";

export const frontendPath: CareerPath = {
  id: "frontend-development",
  title: "Frontend Development",
  description: "Master modern frontend development with a focus on React and Next.js ecosystem",
  category: "frontend",
  icon: "CodeIcon",
  overview: {
    description: "Frontend development is the art of creating user interfaces and experiences for web applications. This roadmap will guide you from the basics to advanced concepts, focusing on modern technologies and best practices.",
    jobProspects: [
      "Frontend Developer",
      "React Developer",
      "UI Developer",
      "Web Application Developer",
      "Full Stack Developer (Frontend focused)"
    ],
    requiredSkills: [
      "HTML & CSS",
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "UI/UX Principles"
    ],
    estimatedTimeToMastery: "6-8 months"
  },
  learningPaths: [
    {
      id: "web-fundamentals",
      title: "Web Development Fundamentals",
      description: "Master the core building blocks of web development",
      category: "frontend",
      level: "beginner",
      icon: "GlobeIcon",
      order: 1,
      estimatedWeeks: 4,
      objectives: [
        "Understand how the web works",
        "Master HTML5 semantic elements",
        "Learn modern CSS techniques",
        "Build responsive layouts"
      ],
      milestones: [
        {
          id: "html-css-basics",
          title: "HTML & CSS Foundations",
          description: "Create a responsive portfolio website using HTML and CSS",
          requiredSkills: ["html-basics", "css-basics"],
          projectPrompt: "Build a personal portfolio website with responsive design"
        }
      ],
      skills: [
        {
          id: "html-basics",
          title: "HTML5 Fundamentals",
          description: "Learn modern HTML5 elements and best practices",
          level: "beginner",
          status: "available",
          icon: "CodeIcon",
          order: 1,
          estimatedDays: 5,
          keyTakeaways: [
            "Understanding of semantic HTML",
            "Accessibility best practices",
            "Forms and validation",
            "SEO basics"
          ],
          resources: [
            {
              id: "html-mdn",
              title: "MDN HTML Guide",
              description: "Comprehensive guide to HTML5",
              type: "documentation",
              url: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
              estimatedTime: "4 hours",
              priority: "required",
              tags: ["html", "web"],
              objectives: [
                "Understand HTML document structure",
                "Learn semantic elements",
                "Master forms and validation"
              ]
            },
            {
              id: "html-exercises",
              title: "HTML Practice Exercises",
              description: "Hands-on exercises to practice HTML",
              type: "practice",
              url: "https://www.frontendmentor.io/challenges",
              estimatedTime: "3 hours",
              priority: "required",
              tags: ["html", "practice"]
            }
          ]
        },
        {
          id: "css-basics",
          title: "CSS Fundamentals",
          description: "Master modern CSS techniques and layouts",
          level: "beginner",
          status: "locked",
          icon: "PaletteIcon",
          order: 2,
          estimatedDays: 7,
          prerequisites: ["html-basics"],
          keyTakeaways: [
            "CSS Box Model",
            "Flexbox and Grid",
            "Responsive design",
            "CSS animations"
          ],
          resources: [
            {
              id: "css-mdn",
              title: "MDN CSS Guide",
              description: "Complete guide to CSS",
              type: "documentation",
              url: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
              estimatedTime: "6 hours",
              priority: "required",
              tags: ["css", "web"]
            },
            {
              id: "css-challenges",
              title: "CSS Layout Challenges",
              description: "Practice building layouts",
              type: "practice",
              url: "https://cssbattle.dev/",
              estimatedTime: "4 hours",
              priority: "required",
              tags: ["css", "layout"]
            }
          ]
        }
      ]
    },
    {
      id: "javascript-essentials",
      title: "JavaScript Fundamentals",
      description: "Master modern JavaScript programming",
      category: "frontend",
      level: "beginner",
      icon: "FileCodeIcon",
      order: 2,
      prerequisites: ["web-fundamentals"],
      estimatedWeeks: 6,
      objectives: [
        "Understand JavaScript fundamentals",
        "Master ES6+ features",
        "Learn async programming",
        "Understand DOM manipulation"
      ],
      milestones: [
        {
          id: "js-basics",
          title: "JavaScript Basics",
          description: "Build interactive web applications",
          requiredSkills: ["js-fundamentals", "js-dom"],
          projectPrompt: "Create an interactive todo application"
        }
      ],
      skills: [
        {
          id: "js-fundamentals",
          title: "JavaScript Core Concepts",
          description: "Learn JavaScript programming fundamentals",
          level: "beginner",
          status: "locked",
          icon: "FileCodeIcon",
          order: 1,
          estimatedDays: 10,
          keyTakeaways: [
            "Variables and data types",
            "Functions and scope",
            "Arrays and objects",
            "ES6+ features"
          ],
          resources: [
            {
              id: "js-mdn",
              title: "JavaScript Guide",
              description: "Comprehensive JavaScript documentation",
              type: "documentation",
              url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
              estimatedTime: "8 hours",
              priority: "required",
              tags: ["javascript"]
            },
            {
              id: "js-exercises",
              title: "JavaScript Challenges",
              description: "Practice JavaScript programming",
              type: "practice",
              url: "https://exercism.io/tracks/javascript",
              estimatedTime: "6 hours",
              priority: "required",
              tags: ["javascript", "practice"]
            }
          ]
        }
      ]
    },
    {
      id: "react-development",
      title: "React Development",
      description: "Master React and its ecosystem",
      category: "frontend",
      level: "intermediate",
      icon: "CodeIcon",
      order: 3,
      prerequisites: ["javascript-essentials"],
      estimatedWeeks: 8,
      objectives: [
        "Understand React fundamentals",
        "Master hooks and state management",
        "Learn component patterns",
        "Build real-world applications"
      ],
      milestones: [
        {
          id: "react-basics",
          title: "React Fundamentals",
          description: "Build a React application",
          requiredSkills: ["react-core", "react-hooks"],
          projectPrompt: "Create a social media dashboard"
        }
      ],
      skills: [
        {
          id: "react-core",
          title: "React Core Concepts",
          description: "Learn React fundamentals and patterns",
          level: "intermediate",
          status: "locked",
          icon: "CodeIcon",
          order: 1,
          estimatedDays: 14,
          keyTakeaways: [
            "Components and props",
            "State and lifecycle",
            "Event handling",
            "Conditional rendering"
          ],
          resources: [
            {
              id: "react-docs",
              title: "React Documentation",
              description: "Official React documentation",
              type: "documentation",
              url: "https://react.dev",
              estimatedTime: "10 hours",
              priority: "required",
              tags: ["react"]
            },
            {
              id: "react-exercises",
              title: "React Projects",
              description: "Build real-world React projects",
              type: "practice",
              url: "https://www.frontendmentor.io/challenges",
              estimatedTime: "8 hours",
              priority: "required",
              tags: ["react", "practice"]
            }
          ]
        }
      ]
    }
  ]
};
