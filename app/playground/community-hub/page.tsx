'use client';

import { motion } from 'framer-motion';
import { 
  Github, 
  Star, 
  GitFork, 
  Code2, 
  Search, 
  Filter, 
  Globe, 
  Users, 
  Award, 
  Zap 
} from 'lucide-react';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/core/card';
import { Badge } from '@/components/shared/ui/core/badge';
import { Input } from '@/components/shared/ui/form/input';
import { useState } from 'react';
import { FeatureGate } from '@/components/features/playground/FeatureGate';

// Mock data - replace with actual data source
const projects = [
  {
    name: 'OpenAI Gym',
    description: 'Toolkit for developing and comparing reinforcement learning algorithms',
    github: 'https://github.com/openai/gym',
    stars: 10200,
    forks: 3100,
    goodFirstIssues: 42,
    language: 'Python',
    difficulty: 'intermediate',
    tags: ['Machine Learning', 'AI', 'Reinforcement Learning']
  },
  {
    name: 'FastAPI',
    description: 'Modern, fast web framework for building APIs with Python',
    github: 'https://github.com/tiangolo/fastapi',
    stars: 52000,
    forks: 4400,
    goodFirstIssues: 87,
    language: 'Python',
    difficulty: 'beginner',
    tags: ['Web Framework', 'API', 'Backend']
  },
  // Add more projects...
];

export default function CommunityHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = !selectedLanguage || project.language === selectedLanguage;
    const matchesDifficulty = !selectedDifficulty || project.difficulty === selectedDifficulty;

    return matchesSearch && matchesLanguage && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/[0.05] border border-primary/10 mb-6">
              <Github className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Open Source Community</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent tracking-tight">
              Collaborate. Innovate. 
              <br />
              Open Source Ecosystem
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Discover, contribute, and grow with a global community of developers. 
              Explore cutting-edge projects, learn from peers, and make a meaningful impact.
            </p>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search projects by name or description" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary/20 bg-background/60 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <select 
                  value={selectedLanguage || ''}
                  onChange={(e) => setSelectedLanguage(e.target.value || null)}
                  className="px-4 py-2 rounded-lg border border-primary/20 bg-background/60 backdrop-blur-sm"
                >
                  <option value="">All Languages</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                </select>

                <select 
                  value={selectedDifficulty || ''}
                  onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                  className="px-4 py-2 rounded-lg border border-primary/20 bg-background/60 backdrop-blur-sm"
                >
                  <option value="">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex flex-col items-center space-y-4">
                <Code2 className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-semibold text-muted-foreground">
                  No projects found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5 
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <div className="bg-background/60 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 h-full flex flex-col transition-all hover:border-primary/30 hover:shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {project.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center border-t border-primary/10 pt-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Stars</div>
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {project.stars.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Forks</div>
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <GitFork className="h-4 w-4 text-green-500" />
                        {project.forks.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Issues</div>
                      <div className="font-semibold">
                        {project.goodFirstIssues}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Community Impact Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background/60 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 text-center"
          >
            <Users className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">4.5M+</h3>
            <p className="text-muted-foreground">Active Contributors</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/60 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 text-center"
          >
            <Globe className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">250K+</h3>
            <p className="text-muted-foreground">Open Source Projects</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background/60 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 text-center"
          >
            <Code2 className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">15M+</h3>
            <p className="text-muted-foreground">Lines of Code Shared</p>
          </motion.div>
        </div>
      </div>

      {/* Contribution Guide */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-6">
            <Zap className="h-4 w-4" />
            <span>Get Involved</span>
          </div>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            Your Journey Starts Here
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Contributing to open source is more than writing code. It's about learning, 
            collaborating, and growing together. Whether you're a beginner or an expert, 
            there's a place for you in our community.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/explore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Github className="mr-2 h-5 w-5" />
              Explore Projects
            </a>
            <a 
              href="/playground/contribution-guide" 
              className="inline-flex items-center px-6 py-3 rounded-lg border border-primary/20 bg-background hover:bg-primary/5 transition-colors"
            >
              <Award className="mr-2 h-5 w-5 text-primary" />
              Contribution Guide
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
