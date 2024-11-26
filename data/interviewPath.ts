import { CareerPath, SkillLevel } from "@/types/learningPath";

export const interviewPath: CareerPath = {
  id: 'coding-interview',
  title: 'Coding Interview Preparation',
  description: 'Master data structures, algorithms, and problem-solving techniques for technical interviews.',
  icon: 'FaCode',
  learningPaths: [
    {
      id: 'dsa-fundamentals',
      title: 'Data Structures & Algorithms Fundamentals',
      description: 'Learn essential data structures and algorithms',
      icon: 'FaCode',
      estimatedTime: '2 months',
      difficulty: 'beginner',
      skills: [
        {
          id: 'arrays-strings',
          name: 'Arrays & Strings',
          description: 'Master array and string manipulation',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'arrays-leetcode',
              title: 'LeetCode Arrays & Strings',
              type: 'practice',
              url: 'https://leetcode.com/explore/learn/card/array-and-string/',
              description: 'Practice array and string problems'
            },
            {
              id: 'arrays-course',
              title: 'Arrays & Strings Course',
              type: 'course',
              url: 'https://www.educative.io/courses/algorithms-ds-interview',
              description: 'Comprehensive array and string algorithms'
            }
          ]
        },
        {
          id: 'linked-lists',
          name: 'Linked Lists',
          description: 'Learn linked list operations and patterns',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'linkedlist-leetcode',
              title: 'LeetCode Linked Lists',
              type: 'practice',
              url: 'https://leetcode.com/explore/learn/card/linked-list/',
              description: 'Practice linked list problems'
            },
            {
              id: 'linkedlist-visualizer',
              title: 'Linked List Visualizer',
              type: 'tool',
              url: 'https://visualgo.net/en/list',
              description: 'Visualize linked list operations'
            }
          ]
        }
      ]
    },
    {
      id: 'advanced-dsa',
      title: 'Advanced Data Structures',
      description: 'Master complex data structures',
      icon: 'FaCode',
      estimatedTime: '3 months',
      difficulty: 'intermediate',
      skills: [
        {
          id: 'trees-graphs',
          name: 'Trees & Graphs',
          description: 'Learn tree and graph algorithms',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'trees-leetcode',
              title: 'LeetCode Trees & Graphs',
              type: 'practice',
              url: 'https://leetcode.com/explore/learn/card/data-structure-tree/',
              description: 'Practice tree and graph problems'
            },
            {
              id: 'graph-visualizer',
              title: 'Graph Algorithm Visualizer',
              type: 'tool',
              url: 'https://visualgo.net/en/graphds',
              description: 'Visualize graph algorithms'
            }
          ]
        },
        {
          id: 'dynamic-programming',
          name: 'Dynamic Programming',
          description: 'Master dynamic programming techniques',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'dp-leetcode',
              title: 'LeetCode Dynamic Programming',
              type: 'practice',
              url: 'https://leetcode.com/explore/learn/card/dynamic-programming/',
              description: 'Practice dynamic programming problems'
            },
            {
              id: 'dp-course',
              title: 'Dynamic Programming Course',
              type: 'course',
              url: 'https://www.educative.io/courses/grokking-dynamic-programming',
              description: 'Comprehensive DP patterns and techniques'
            }
          ]
        }
      ]
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Learn system design principles and patterns',
      icon: 'FaServer',
      estimatedTime: '3 months',
      difficulty: 'advanced',
      skills: [
        {
          id: 'system-design-fundamentals',
          name: 'System Design Fundamentals',
          description: 'Learn basic system design concepts',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'system-design-primer',
              title: 'System Design Primer',
              type: 'documentation',
              url: 'https://github.com/donnemartin/system-design-primer',
              description: 'Comprehensive system design guide'
            },
            {
              id: 'system-design-course',
              title: 'Grokking System Design',
              type: 'course',
              url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
              description: 'System design interview preparation'
            }
          ]
        },
        {
          id: 'distributed-systems',
          name: 'Distributed Systems',
          description: 'Learn distributed system concepts',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'distributed-systems-mit',
              title: 'MIT Distributed Systems',
              type: 'course',
              url: 'https://pdos.csail.mit.edu/6.824/',
              description: 'Advanced distributed systems course'
            },
            {
              id: 'distributed-systems-book',
              title: 'Designing Data-Intensive Applications',
              type: 'book',
              url: 'https://dataintensive.net/',
              description: 'Comprehensive guide to distributed systems'
            }
          ]
        }
      ]
    }
  ]
};
