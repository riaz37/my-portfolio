import { CareerPath, SkillLevel } from "@/types/learningPath";

export const frontendPath: CareerPath = {
  id: 'frontend',
  title: 'Frontend Developer',
  description: 'Learn to build beautiful, interactive, and responsive user interfaces using modern web technologies.',
  icon: 'FaLaptopCode',
  learningPaths: [
    {
      id: 'frontend-fundamentals',
      title: 'Frontend Fundamentals',
      description: 'Master the core technologies of web development',
      icon: 'FaCode',
      estimatedTime: '2 months',
      difficulty: 'beginner',
      skills: [
        {
          id: 'html',
          name: 'HTML5',
          description: 'Learn modern HTML5 markup and semantic elements',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'html-mdn',
              title: 'MDN HTML Guide',
              type: 'documentation',
              url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
              description: 'Comprehensive HTML5 documentation and tutorials'
            },
            {
              id: 'html-practice',
              title: 'HTML Interactive Course',
              type: 'practice',
              url: 'https://www.freecodecamp.org/learn/responsive-web-design/#basic-html-and-html5',
              description: 'Interactive HTML exercises and projects'
            }
          ]
        },
        {
          id: 'css',
          name: 'CSS3',
          description: 'Master modern CSS styling and layouts',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'css-mdn',
              title: 'MDN CSS Guide',
              type: 'documentation',
              url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS',
              description: 'Comprehensive CSS documentation and tutorials'
            },
            {
              id: 'css-flexbox',
              title: 'Flexbox Froggy',
              type: 'practice',
              url: 'https://flexboxfroggy.com/',
              description: 'Learn CSS flexbox through a fun game'
            }
          ]
        },
        {
          id: 'javascript',
          name: 'JavaScript',
          description: 'Learn modern JavaScript programming',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'js-mdn',
              title: 'MDN JavaScript Guide',
              type: 'documentation',
              url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
              description: 'Comprehensive JavaScript documentation'
            },
            {
              id: 'js-practice',
              title: 'JavaScript.info',
              type: 'practice',
              url: 'https://javascript.info/',
              description: 'Modern JavaScript tutorial'
            }
          ]
        }
      ]
    },
    {
      id: 'frontend-frameworks',
      title: 'Modern Frontend Frameworks',
      description: 'Learn popular frontend frameworks and libraries',
      icon: 'FaReact',
      estimatedTime: '3 months',
      difficulty: 'intermediate',
      skills: [
        {
          id: 'react',
          name: 'React',
          description: 'Build modern web applications with React',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'react-docs',
              title: 'React Documentation',
              type: 'documentation',
              url: 'https://react.dev/',
              description: 'Official React documentation'
            },
            {
              id: 'react-course',
              title: 'React Course',
              type: 'course',
              url: 'https://fullstackopen.com/en/part1',
              description: 'Full Stack Open React Course'
            }
          ]
        },
        {
          id: 'nextjs',
          name: 'Next.js',
          description: 'Build server-side rendered React applications',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'nextjs-docs',
              title: 'Next.js Documentation',
              type: 'documentation',
              url: 'https://nextjs.org/docs',
              description: 'Official Next.js documentation'
            },
            {
              id: 'nextjs-course',
              title: 'Next.js Course',
              type: 'course',
              url: 'https://nextjs.org/learn',
              description: 'Official Next.js tutorial'
            }
          ]
        }
      ]
    },
    {
      id: 'frontend-advanced',
      title: 'Advanced Frontend Development',
      description: 'Master advanced frontend concepts and tools',
      icon: 'FaTools',
      estimatedTime: '3 months',
      difficulty: 'advanced',
      skills: [
        {
          id: 'typescript',
          name: 'TypeScript',
          description: 'Add static typing to your JavaScript applications',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'ts-docs',
              title: 'TypeScript Documentation',
              type: 'documentation',
              url: 'https://www.typescriptlang.org/docs/',
              description: 'Official TypeScript documentation'
            },
            {
              id: 'ts-course',
              title: 'TypeScript Deep Dive',
              type: 'course',
              url: 'https://basarat.gitbook.io/typescript/',
              description: 'Comprehensive TypeScript guide'
            }
          ]
        },
        {
          id: 'testing',
          name: 'Frontend Testing',
          description: 'Learn modern frontend testing practices',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'testing-docs',
              title: 'Testing Library',
              type: 'documentation',
              url: 'https://testing-library.com/docs/',
              description: 'Modern frontend testing documentation'
            },
            {
              id: 'testing-course',
              title: 'Testing JavaScript',
              type: 'course',
              url: 'https://testingjavascript.com/',
              description: 'Comprehensive JavaScript testing course'
            }
          ]
        }
      ]
    }
  ]
};
