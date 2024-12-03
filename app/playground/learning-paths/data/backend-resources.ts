import { CareerPath } from "@/types/learningPath";

export const backendPath: CareerPath = {
  id: "backend-development",
  title: "Backend Development",
  description: "Master backend development with Node.js, Express, and databases",
  category: "backend",
  icon: "Server",
  overview: {
    description: "Backend development focuses on server-side logic, databases, and APIs. This roadmap will guide you through building robust and scalable backend systems.",
    jobProspects: [
      "Backend Developer",
      "Node.js Developer",
      "API Developer",
      "Full Stack Developer (Backend focused)",
      "DevOps Engineer"
    ],
    requiredSkills: [
      "Node.js",
      "Express.js",
      "Databases",
      "API Design",
      "Authentication & Security",
      "Server Management"
    ],
    estimatedTimeToMastery: "6-8 months"
  },
  learningPaths: [
    {
      id: "nodejs-fundamentals",
      title: "Node.js Fundamentals",
      description: "Learn the core concepts of Node.js and server-side JavaScript",
      category: "backend",
      level: "beginner",
      icon: "Server",
      order: 1,
      estimatedWeeks: 4,
      objectives: [
        "Understand Node.js architecture",
        "Learn async programming",
        "Master npm ecosystem",
        "Build CLI applications"
      ],
      milestones: [
        {
          id: "node-basics",
          title: "Node.js Basics",
          description: "Build command-line applications with Node.js",
          requiredSkills: ["node-core", "async-js"],
          projectPrompt: "Create a CLI tool for file management"
        }
      ],
      skills: [
        {
          id: "node-core",
          title: "Node.js Core",
          description: "Learn Node.js fundamentals and core modules",
          level: "beginner",
          status: "available",
          icon: "Server",
          order: 1,
          estimatedDays: 7,
          keyTakeaways: [
            "Node.js architecture",
            "Core modules",
            "Event loop",
            "File system operations"
          ],
          resources: [
            {
              id: "node-docs",
              title: "Node.js Documentation",
              description: "Official Node.js documentation",
              type: "documentation",
              url: "https://nodejs.org/docs/latest/api/",
              estimatedTime: "6 hours",
              priority: "required",
              tags: ["nodejs", "backend"],
              objectives: [
                "Understand Node.js architecture",
                "Learn core modules",
                "Master async programming"
              ]
            },
            {
              id: "node-exercises",
              title: "Node.js Exercises",
              description: "Practice Node.js programming",
              type: "practice",
              url: "https://nodeschool.io/",
              estimatedTime: "4 hours",
              priority: "required",
              tags: ["nodejs", "practice"]
            }
          ]
        }
      ]
    },
    {
      id: "express-api",
      title: "API Development with Express",
      description: "Build RESTful APIs with Express.js",
      category: "backend",
      level: "intermediate",
      icon: "Server",
      order: 2,
      prerequisites: ["nodejs-fundamentals"],
      estimatedWeeks: 6,
      objectives: [
        "Design RESTful APIs",
        "Implement CRUD operations",
        "Handle authentication",
        "Manage database operations"
      ],
      milestones: [
        {
          id: "express-basics",
          title: "Express.js Fundamentals",
          description: "Build a RESTful API",
          requiredSkills: ["express-core", "mongodb-basics"],
          projectPrompt: "Create a RESTful API for a blog platform"
        }
      ],
      skills: [
        {
          id: "express-core",
          title: "Express.js Core",
          description: "Learn Express.js framework fundamentals",
          level: "intermediate",
          status: "locked",
          icon: "Server",
          order: 1,
          estimatedDays: 10,
          keyTakeaways: [
            "Routing and middleware",
            "Error handling",
            "Request validation",
            "Response formatting"
          ],
          resources: [
            {
              id: "express-docs",
              title: "Express Documentation",
              description: "Official Express.js guide",
              type: "documentation",
              url: "https://expressjs.com/",
              estimatedTime: "8 hours",
              priority: "required",
              tags: ["express", "nodejs"]
            },
            {
              id: "express-exercises",
              title: "API Exercises",
              description: "Build RESTful APIs",
              type: "practice",
              url: "https://github.com/goldbergyoni/nodebestpractices",
              estimatedTime: "6 hours",
              priority: "required",
              tags: ["express", "api"]
            }
          ]
        }
      ]
    },
    {
      id: "database-fundamentals",
      title: "Database Management",
      description: "Master database design and operations",
      category: "backend",
      level: "intermediate",
      icon: "Database",
      order: 3,
      prerequisites: ["express-api"],
      estimatedWeeks: 6,
      objectives: [
        "Learn database design",
        "Master SQL and NoSQL",
        "Implement data modeling",
        "Handle database operations"
      ],
      milestones: [
        {
          id: "database-basics",
          title: "Database Fundamentals",
          description: "Design and implement database systems",
          requiredSkills: ["sql-basics", "mongodb-basics"],
          projectPrompt: "Design and implement a database for an e-commerce platform"
        }
      ],
      skills: [
        {
          id: "mongodb-basics",
          title: "MongoDB Fundamentals",
          description: "Learn MongoDB database operations",
          level: "intermediate",
          status: "locked",
          icon: "Database",
          order: 1,
          estimatedDays: 8,
          keyTakeaways: [
            "Document model",
            "CRUD operations",
            "Indexing",
            "Aggregation"
          ],
          resources: [
            {
              id: "mongodb-docs",
              title: "MongoDB Manual",
              description: "Official MongoDB documentation",
              type: "documentation",
              url: "https://docs.mongodb.com/manual/",
              estimatedTime: "8 hours",
              priority: "required",
              tags: ["mongodb", "database"]
            },
            {
              id: "mongodb-exercises",
              title: "MongoDB Exercises",
              description: "Practice MongoDB operations",
              type: "practice",
              url: "https://university.mongodb.com/",
              estimatedTime: "6 hours",
              priority: "required",
              tags: ["mongodb", "practice"]
            }
          ]
        }
      ]
    }
  ]
};
