'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/core/card';
import { ArrowRight, Globe, Server, Database, BrainCircuit, Rocket } from 'lucide-react';
import { SiJavascript, SiPython } from 'react-icons/si';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SectionTitle } from '@/components/shared/ui/section';

const features = [
  {
    title: 'Frontend Development',
    description: 'Master modern UI development with React, Next.js, and responsive design principles.',
    icon: Globe,
    color: 'from-blue-500 to-blue-700',
  },
  {
    title: 'Backend Development',
    description: 'Build robust server-side applications with Node.js, Express, and RESTful APIs.',
    icon: Server,
    color: 'from-green-500 to-green-700',
  },
  {
    title: 'DevOps & Cloud',
    description: 'Learn cloud platforms, CI/CD pipelines, and modern deployment practices.',
    icon: Database,
    color: 'from-purple-500 to-purple-700',
  },
  {
    title: 'Interview Prep',
    description: 'Master DSA, system design, and ace your technical interviews.',
    icon: BrainCircuit,
    color: 'from-amber-500 to-amber-700',
  },
];

const codeSnippets = {
  javascript: `// 🚀 Your Learning Adventure Begins Here!
const createDeveloper = {
  name: "You",
  goal: "Become a Full-Stack Pro",
  
  skills: {
    frontend: [
      "React & Next.js Mastery",
      "Modern UI/UX Design",
      "State Management"
    ],
    backend: [
      "API Development",
      "Database Design",
      "Server Architecture"
    ],
    devops: [
      "Cloud Platforms",
      "CI/CD Pipelines",
      "Infrastructure as Code"
    ],
    interview: [
      "Data Structures",
      "System Design",
      "Problem Solving"
    ]
  },

  level: "Leveling Up Daily! 🎮"
};`,
  python: `# 🚀 Your Learning Adventure Begins Here!
developer = {
    "name": "You",
    "goal": "Become a Full-Stack Pro",
    
    "skills": {
        "frontend": [
            "React & Next.js Mastery",
            "Modern UI/UX Design",
            "State Management"
        ],
        "backend": [
            "API Development",
            "Database Design",
            "Server Architecture"
        ],
        "devops": [
            "Cloud Platforms",
            "CI/CD Pipelines",
            "Infrastructure as Code"
        ],
        "interview": [
            "Data Structures",
            "System Design",
            "Problem Solving"
        ]
    },
    
    "level": "Leveling Up Daily! 🎮"
}`
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function InteractiveLearning() {
  const [activeLanguage, setActiveLanguage] = useState<'javascript' | 'python'>('javascript');

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={item} className="text-center mb-16">
            <SectionTitle
              badge="Interactive Learning Platform"
              highlight="Full-Stack"
              subtitle="Join our community of learners and get personalized guidance, interactive challenges, and hands-on experience to accelerate your growth in tech."
            >
              Become a Full-Stack Developer
            </SectionTitle>
          </motion.div>

          {/* Main Content Grid */}
          <div className="space-y-8">
            {/* Features Grid */}
            <motion.div 
              variants={container}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div key={feature.title} variants={item}>
                  <Card 
                    className="relative group transition-colors duration-300 h-full border border-muted hover:border-primary/50 bg-background"
                    interactive
                  >
                    <div className="p-6 space-y-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        "bg-gradient-to-br ring-1 ring-primary/10",
                        feature.color
                      )}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Code Example */}
            <motion.div
              variants={item}
              className="relative rounded-lg overflow-hidden border border-muted bg-card/50 backdrop-blur-sm h-full max-w-4xl mx-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-12 bg-muted/50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={activeLanguage === 'javascript' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveLanguage('javascript')}
                    className="flex items-center gap-2"
                  >
                    <SiJavascript className={cn(
                      "w-4 h-4",
                      activeLanguage === 'javascript' ? "text-primary-foreground" : "text-primary"
                    )} />
                    JavaScript
                  </Button>
                  <Button
                    variant={activeLanguage === 'python' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveLanguage('python')}
                    className="flex items-center gap-2"
                  >
                    <SiPython className={cn(
                      "w-4 h-4",
                      activeLanguage === 'python' ? "text-primary-foreground" : "text-primary"
                    )} />
                    Python
                  </Button>
                </div>
              </div>

              <div className="pt-12 p-6">
                <pre className="font-mono text-sm overflow-x-auto">
                  <code>{codeSnippets[activeLanguage]}</code>
                </pre>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
