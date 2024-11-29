'use client';

import { motion } from 'framer-motion';
import { Github, Star, GitFork, Users, ExternalLink, Search, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/core/card';
import { Badge } from '@/components/shared/ui/core/badge';
import { Input } from '@/components/shared/ui/form/input';
import { useState } from 'react';

// Famous open source projects data
const projects = [
  {
    name: "kubernetes",
    description: "Production-grade container scheduling and management platform. The foundation of modern cloud-native applications.",
    stars: "102k",
    forks: "38.1k",
    contributors: "4k+",
    tags: ["Go", "Cloud Native", "Container"],
    github: "https://github.com/kubernetes/kubernetes",
    website: "https://kubernetes.io",
    difficulty: "advanced",
    language: "Go",
    goodFirstIssues: 87
  },
  {
    name: "Visual Studio Code",
    description: "A lightweight but powerful source code editor with support for thousands of extensions.",
    stars: "149k",
    forks: "26.7k",
    contributors: "1.6k+",
    tags: ["TypeScript", "IDE", "Developer Tools"],
    github: "https://github.com/microsoft/vscode",
    website: "https://code.visualstudio.com",
    difficulty: "intermediate",
    language: "TypeScript",
    goodFirstIssues: 45
  },
  {
    name: "Node.js",
    description: "A JavaScript runtime built on Chrome's V8 JavaScript engine. Powers millions of servers worldwide.",
    stars: "98.4k",
    forks: "27.2k",
    contributors: "3.5k+",
    tags: ["JavaScript", "Runtime", "Backend"],
    github: "https://github.com/nodejs/node",
    website: "https://nodejs.org",
    difficulty: "advanced",
    language: "JavaScript",
    goodFirstIssues: 32
  },
  {
    name: "Flutter",
    description: "Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.",
    stars: "156k",
    forks: "25.8k",
    contributors: "900+",
    tags: ["Dart", "Mobile", "Cross-Platform"],
    github: "https://github.com/flutter/flutter",
    website: "https://flutter.dev",
    difficulty: "intermediate",
    language: "Dart",
    goodFirstIssues: 124
  },
  {
    name: "TensorFlow",
    description: "An end-to-end open source platform for machine learning. Used by researchers and developers worldwide.",
    stars: "177k",
    forks: "88.6k",
    contributors: "3.2k+",
    tags: ["Machine Learning", "AI", "Python"],
    github: "https://github.com/tensorflow/tensorflow",
    website: "https://tensorflow.org",
    difficulty: "advanced",
    language: "Python",
    goodFirstIssues: 52
  },
  {
    name: "freeCodeCamp",
    description: "Open source codebase and curriculum for learning to code. Used by millions to learn programming for free.",
    stars: "374k",
    forks: "33.8k",
    contributors: "4.5k+",
    tags: ["Education", "Web Development", "JavaScript"],
    github: "https://github.com/freeCodeCamp/freeCodeCamp",
    website: "https://www.freecodecamp.org",
    difficulty: "beginner",
    language: "JavaScript",
    goodFirstIssues: 95
  },
  {
    name: "Rust",
    description: "A systems programming language focused on safety, speed, and concurrency. Increasingly popular for system-level programming.",
    stars: "85.7k",
    forks: "11.2k",
    contributors: "3.5k+",
    tags: ["Systems Programming", "Language", "Performance"],
    github: "https://github.com/rust-lang/rust",
    website: "https://rust-lang.org",
    difficulty: "advanced",
    language: "Rust",
    goodFirstIssues: 128
  },
  {
    name: "Material-UI",
    description: "A comprehensive suite of React UI components implementing Google's Material Design. Popular choice for React applications.",
    stars: "88.9k",
    forks: "30.1k",
    contributors: "2.8k+",
    tags: ["React", "UI Library", "TypeScript"],
    github: "https://github.com/mui/material-ui",
    website: "https://mui.com",
    difficulty: "intermediate",
    language: "TypeScript",
    goodFirstIssues: 63
  },
  {
    name: "Supabase",
    description: "An open source alternative to Firebase. Build scalable applications with Postgres, Authentication, and Realtime subscriptions.",
    stars: "58.2k",
    forks: "4.8k",
    contributors: "600+",
    tags: ["Database", "Backend", "TypeScript"],
    github: "https://github.com/supabase/supabase",
    website: "https://supabase.com",
    difficulty: "intermediate",
    language: "TypeScript",
    goodFirstIssues: 42
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const difficultyColors = {
  beginner: "text-green-500",
  intermediate: "text-yellow-500",
  advanced: "text-red-500"
};

export default function CommunityHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
    const matchesLanguage = selectedLanguage === 'all' || project.language === selectedLanguage;
    return matchesSearch && matchesDifficulty && matchesLanguage;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Open Source Community Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and contribute to some of the world's most impactful open source projects.
          Find beginner-friendly issues and make your mark in the developer community.
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-md border bg-background"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            className="px-4 py-2 rounded-md border bg-background"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="all">All Languages</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Rust">Rust</option>
            <option value="Go">Go</option>
            <option value="Dart">Dart</option>
          </select>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProjects.map((project) => (
          <motion.div key={project.name} variants={itemVariants}>
            <Card className="p-6 h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-6 flex-grow">
                {project.description}
              </p>

              <div className="space-y-4 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>{project.forks}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{project.contributors}</span>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${difficultyColors[project.difficulty]}`}>
                    {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    {project.goodFirstIssues} Good First Issues
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Visit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Getting Started Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 p-8 rounded-lg bg-secondary/50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-4">New to Open Source?</h2>
        <p className="text-muted-foreground mb-6">
          Contributing to open source can be intimidating at first, but it's a great way to learn and grow as a developer.
          Start with projects tagged as "beginner" and look for "Good First Issues" to make your first contribution.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <a href="https://opensource.guide/how-to-contribute/" target="_blank" rel="noopener noreferrer">
              Learn How to Contribute
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://goodfirstissue.dev" target="_blank" rel="noopener noreferrer">
              Find More Beginner-Friendly Issues
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
