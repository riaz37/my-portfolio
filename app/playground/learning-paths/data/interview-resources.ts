import { CareerPath } from "@/types/learningPath";

export const interviewPath: CareerPath = {
  id: "interview-preparation",
  title: "Technical Interview Preparation",
  description: "Master technical interviews with a focus on algorithms, system design, and coding challenges",
  category: "interview",
  icon: "Brain",
  overview: {
    description: "Technical interview preparation focuses on algorithms, data structures, system design, and problem-solving skills. This roadmap will help you ace your technical interviews.",
    jobProspects: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Technical Lead"
    ],
    requiredSkills: [
      "Data Structures",
      "Algorithms",
      "System Design",
      "Problem Solving",
      "Code Optimization",
      "Technical Communication"
    ],
    estimatedTimeToMastery: "3-4 months"
  },
  learningPaths: [
    {
      id: "algorithms-datastructures",
      title: "Algorithms & Data Structures",
      description: "Master fundamental algorithms and data structures",
      category: "interview",
      level: "intermediate",
      icon: "Brain",
      order: 1,
      estimatedWeeks: 6,
      objectives: [
        "Understand common data structures",
        "Learn algorithm analysis",
        "Master sorting and searching",
        "Practice problem-solving"
      ],
      milestones: [
        {
          id: "ds-basics",
          title: "Data Structures Fundamentals",
          description: "Implement common data structures",
          requiredSkills: ["arrays-strings", "linked-lists"],
          projectPrompt: "Implement 5 fundamental data structures from scratch"
        }
      ],
      skills: [
        {
          id: "arrays-strings",
          title: "Arrays & Strings",
          description: "Master array and string manipulation",
          level: "intermediate",
          status: "available",
          icon: "Code",
          order: 1,
          estimatedDays: 7,
          keyTakeaways: [
            "Array manipulation",
            "String algorithms",
            "Two-pointer technique",
            "Sliding window"
          ],
          resources: [
            {
              id: "arrays-guide",
              title: "Arrays & Strings Guide",
              description: "Comprehensive guide to array problems",
              type: "documentation",
              url: "https://leetcode.com/explore/learn/card/array-and-string/",
              estimatedTime: "6 hours",
              priority: "required",
              tags: ["arrays", "strings", "algorithms"],
              objectives: [
                "Master array manipulation",
                "Learn string algorithms",
                "Practice common patterns"
              ]
            },
            {
              id: "arrays-practice",
              title: "Array Problems",
              description: "Practice array and string problems",
              type: "practice",
              url: "https://leetcode.com/problemset/all/?topicSlugs=array",
              estimatedTime: "4 hours",
              priority: "required",
              tags: ["arrays", "practice"]
            }
          ]
        }
      ]
    },
    {
      id: "system-design",
      title: "System Design",
      description: "Learn to design scalable systems",
      category: "interview",
      level: "advanced",
      icon: "Network",
      order: 2,
      prerequisites: ["algorithms-datastructures"],
      estimatedWeeks: 4,
      objectives: [
        "Understand system architecture",
        "Learn scalability concepts",
        "Master database design",
        "Practice system design interviews"
      ],
      milestones: [
        {
          id: "system-basics",
          title: "System Design Fundamentals",
          description: "Design scalable systems",
          requiredSkills: ["architecture-basics", "scalability"],
          projectPrompt: "Design a social media platform's backend system"
        }
      ],
      skills: [
        {
          id: "architecture-basics",
          title: "Architecture Fundamentals",
          description: "Learn system architecture principles",
          level: "advanced",
          status: "locked",
          icon: "Network",
          order: 1,
          estimatedDays: 10,
          keyTakeaways: [
            "System components",
            "Scalability patterns",
            "Database selection",
            "Load balancing"
          ],
          resources: [
            {
              id: "system-guide",
              title: "System Design Guide",
              description: "Comprehensive system design guide",
              type: "documentation",
              url: "https://github.com/donnemartin/system-design-primer",
              estimatedTime: "10 hours",
              priority: "required",
              tags: ["system-design", "architecture"]
            },
            {
              id: "design-exercises",
              title: "Design Problems",
              description: "Practice system design questions",
              type: "practice",
              url: "https://www.educative.io/courses/grokking-the-system-design-interview",
              estimatedTime: "8 hours",
              priority: "required",
              tags: ["system-design", "practice"]
            }
          ]
        }
      ]
    },
    {
      id: "coding-interviews",
      title: "Coding Interviews",
      description: "Master coding interview techniques",
      category: "interview",
      level: "intermediate",
      icon: "Code",
      order: 3,
      prerequisites: ["algorithms-datastructures"],
      estimatedWeeks: 4,
      objectives: [
        "Learn interview strategies",
        "Practice problem-solving",
        "Improve code quality",
        "Master time management"
      ],
      milestones: [
        {
          id: "interview-practice",
          title: "Interview Practice",
          description: "Practice coding interviews",
          requiredSkills: ["problem-solving", "code-quality"],
          projectPrompt: "Complete 50 coding interview problems"
        }
      ],
      skills: [
        {
          id: "problem-solving",
          title: "Problem Solving Strategies",
          description: "Learn effective problem-solving techniques",
          level: "intermediate",
          status: "locked",
          icon: "Brain",
          order: 1,
          estimatedDays: 14,
          keyTakeaways: [
            "Problem analysis",
            "Solution design",
            "Code implementation",
            "Testing strategies"
          ],
          resources: [
            {
              id: "interview-patterns",
              title: "Coding Patterns",
              description: "Common coding interview patterns",
              type: "documentation",
              url: "https://www.educative.io/courses/grokking-coding-interview-patterns",
              estimatedTime: "12 hours",
              priority: "required",
              tags: ["interviews", "patterns"]
            },
            {
              id: "interview-practice",
              title: "Mock Interviews",
              description: "Practice coding interviews",
              type: "practice",
              url: "https://www.pramp.com/",
              estimatedTime: "8 hours",
              priority: "required",
              tags: ["interviews", "practice"]
            }
          ]
        }
      ]
    }
  ]
};
