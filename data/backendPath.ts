import { CareerPath, SkillLevel } from "@/types/learningPath";

export const backendPath: CareerPath = {
  id: 'backend',
  title: 'Backend Developer',
  description: 'Master server-side development, databases, APIs, and cloud services to build robust and scalable applications.',
  icon: 'FaServer',
  learningPaths: [
    {
      id: 'backend-fundamentals',
      title: 'Backend Fundamentals',
      description: 'Learn the core concepts of backend development',
      icon: 'FaCode',
      estimatedTime: '2 months',
      difficulty: 'beginner',
      skills: [
        {
          id: 'node-express',
          name: 'Node.js & Express',
          description: 'Build web servers and RESTful APIs with Node.js',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'node-docs',
              title: 'Node.js Documentation',
              type: 'documentation',
              url: 'https://nodejs.org/docs/latest/api/',
              description: 'Official Node.js documentation'
            },
            {
              id: 'express-course',
              title: 'Express.js Course',
              type: 'course',
              url: 'https://expressjs.com/en/starter/installing.html',
              description: 'Official Express.js getting started guide'
            },
            {
              id: 'node-best-practices',
              title: 'Node.js Best Practices',
              type: 'documentation',
              url: 'https://github.com/goldbergyoni/nodebestpractices',
              description: 'Comprehensive Node.js best practices guide'
            },
            {
              id: 'node-security',
              title: 'Node.js Security',
              type: 'course',
              url: 'https://nodeguardians.io/',
              description: 'Learn Node.js security through gamification'
            }
          ]
        },
        {
          id: 'sql-databases',
          name: 'SQL & Databases',
          description: 'Master relational databases and SQL',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'postgresql-tutorial',
              title: 'PostgreSQL Tutorial',
              type: 'documentation',
              url: 'https://www.postgresqltutorial.com/',
              description: 'Comprehensive PostgreSQL tutorial'
            },
            {
              id: 'sql-course',
              title: 'SQL Course',
              type: 'course',
              url: 'https://sqlbolt.com/',
              description: 'Interactive SQL learning platform'
            },
            {
              id: 'database-design',
              title: 'Database Design',
              type: 'course',
              url: 'https://www.dbdesigner.net/',
              description: 'Visual database design tool and tutorials'
            },
            {
              id: 'sql-exercises',
              title: 'SQL Exercises',
              type: 'practice',
              url: 'https://www.hackerrank.com/domains/sql',
              description: 'Practice SQL with real-world problems'
            }
          ]
        }
      ]
    },
    {
      id: 'api-development',
      title: 'API Development & Integration',
      description: 'Design and build modern APIs',
      icon: 'FaCloud',
      estimatedTime: '3 months',
      difficulty: 'intermediate',
      skills: [
        {
          id: 'rest-apis',
          name: 'RESTful APIs',
          description: 'Design and implement RESTful APIs',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'rest-best-practices',
              title: 'REST API Design',
              type: 'documentation',
              url: 'https://restfulapi.net/',
              description: 'REST API design best practices'
            },
            {
              id: 'api-security',
              title: 'API Security',
              type: 'course',
              url: 'https://owasp.org/www-project-api-security/',
              description: 'OWASP API security guide'
            },
            {
              id: 'api-documentation',
              title: 'API Documentation',
              type: 'tool',
              url: 'https://swagger.io/tools/swagger-ui/',
              description: 'Learn API documentation with Swagger/OpenAPI'
            },
            {
              id: 'postman-tutorial',
              title: 'Postman Tutorial',
              type: 'course',
              url: 'https://learning.postman.com/docs/getting-started/introduction/',
              description: 'Master API testing with Postman'
            }
          ]
        },
        {
          id: 'graphql',
          name: 'GraphQL',
          description: 'Build flexible and efficient APIs with GraphQL',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'graphql-docs',
              title: 'GraphQL Documentation',
              type: 'documentation',
              url: 'https://graphql.org/learn/',
              description: 'Official GraphQL documentation'
            },
            {
              id: 'apollo-tutorial',
              title: 'Apollo GraphQL Tutorial',
              type: 'course',
              url: 'https://www.apollographql.com/tutorials/',
              description: 'Build full-stack apps with Apollo'
            },
            {
              id: 'graphql-security',
              title: 'GraphQL Security',
              type: 'documentation',
              url: 'https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html',
              description: 'GraphQL security best practices'
            },
            {
              id: 'graphql-tools',
              title: 'GraphQL Tools',
              type: 'tool',
              url: 'https://www.graphql-tools.com/introduction',
              description: 'Essential tools for GraphQL development'
            }
          ]
        }
      ]
    },
    {
      id: 'advanced-backend',
      title: 'Advanced Backend Development',
      description: 'Master advanced backend concepts and patterns',
      icon: 'FaServer',
      estimatedTime: '4 months',
      difficulty: 'advanced',
      skills: [
        {
          id: 'microservices',
          name: 'Microservices Architecture',
          description: 'Design and implement microservices',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'microservices-patterns',
              title: 'Microservices Patterns',
              type: 'book',
              url: 'https://microservices.io/patterns/index.html',
              description: 'Comprehensive microservices design patterns'
            },
            {
              id: 'event-driven',
              title: 'Event-Driven Architecture',
              type: 'course',
              url: 'https://www.confluent.io/learn/event-driven-architecture/',
              description: 'Learn event-driven microservices'
            },
            {
              id: 'kubernetes-microservices',
              title: 'Kubernetes for Microservices',
              type: 'course',
              url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
              description: 'Deploy microservices on Kubernetes'
            },
            {
              id: 'distributed-tracing',
              title: 'Distributed Tracing',
              type: 'documentation',
              url: 'https://opentelemetry.io/docs/',
              description: 'Implement distributed tracing with OpenTelemetry'
            }
          ]
        },
        {
          id: 'cloud-native',
          name: 'Cloud-Native Development',
          description: 'Build cloud-native applications',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'aws-fundamentals',
              title: 'AWS Fundamentals',
              type: 'course',
              url: 'https://aws.amazon.com/getting-started/hands-on/',
              description: 'Hands-on AWS tutorials'
            },
            {
              id: 'serverless',
              title: 'Serverless Architecture',
              type: 'documentation',
              url: 'https://www.serverless.com/framework/docs/',
              description: 'Build serverless applications'
            },
            {
              id: 'cloud-patterns',
              title: 'Cloud Design Patterns',
              type: 'documentation',
              url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/',
              description: 'Cloud-native architecture patterns'
            },
            {
              id: 'cloud-security',
              title: 'Cloud Security',
              type: 'course',
              url: 'https://www.cloudflare.com/learning/',
              description: 'Learn cloud security best practices'
            }
          ]
        },
        {
          id: 'performance',
          name: 'Performance & Scalability',
          description: 'Optimize and scale backend systems',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'caching',
              title: 'Caching Strategies',
              type: 'documentation',
              url: 'https://redis.io/docs/manual/',
              description: 'Learn caching with Redis'
            },
            {
              id: 'load-testing',
              title: 'Load Testing',
              type: 'tool',
              url: 'https://k6.io/docs/',
              description: 'Performance testing with k6'
            },
            {
              id: 'system-design',
              title: 'System Design',
              type: 'course',
              url: 'https://github.com/donnemartin/system-design-primer',
              description: 'Comprehensive system design guide'
            },
            {
              id: 'monitoring',
              title: 'Monitoring & Observability',
              type: 'documentation',
              url: 'https://grafana.com/tutorials/',
              description: 'Implement monitoring with Grafana'
            }
          ]
        }
      ]
    }
  ]
};
