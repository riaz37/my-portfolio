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
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper'

const features = [
  {
    title: 'Frontend Development',
    description: 'Master modern UI development with React, Next.js, and responsive design principles.',
    icon: Globe,
    color: 'from-blue-500 to-blue-700',
  },
  {
    title: 'Backend Development',
    description: 'Learn server-side programming, API design, and database management.',
    icon: Server,
    color: 'from-green-500 to-green-700',
  },
  {
    title: 'Database Management',
    description: 'Explore database design, optimization, and advanced querying techniques.',
    icon: Database,
    color: 'from-purple-500 to-purple-700',
  },
  {
    title: 'Interview Preparation',
    description: 'Prepare for coding interviews with practice questions and mock interviews.',
    icon: BrainCircuit,
    color: 'from-red-500 to-red-700',
  }
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
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={item} className="text-center mb-6 sm:mb-10 md:mb-14">
            <SectionTitle 
              badge="Coding Journey"
              highlight="Full-Stack"
              subtitle="Join our community of learners and get personalized guidance, interactive challenges, and hands-on experience to accelerate your growth in tech."
              showDecoration={true}
            >
              Your Learning Path
            </SectionTitle>
          </motion.div>

          {/* Main Content Grid */}
          <div className="space-y-5 sm:space-y-7">
            {/* Features Grid */}
            <motion.div 
              variants={container}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {features.map((feature, index) => (
                <motion.div key={feature.title} variants={item} className="p-3 sm:p-4">
                  <Link href="/learning-path">
                    <Card 
                      className="relative group transition-colors duration-300 h-full border border-muted hover:border-primary/50 bg-background cursor-pointer"
                      interactive
                    >
                      <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                        <div className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center",
                          "bg-gradient-to-br ring-1 ring-primary/10",
                          feature.color
                        )}>
                          <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm sm:text-base font-semibold tracking-tight">
                            {feature.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Code Example */}
            <motion.div
              variants={item}
              className="relative rounded-lg overflow-hidden border border-muted bg-card/50 backdrop-blur-sm h-full max-w-3xl mx-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-10 bg-muted/50 flex items-center justify-between px-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant={activeLanguage === 'javascript' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveLanguage('javascript')}
                    className="flex items-center gap-1.5"
                  >
                    <SiJavascript className={cn(
                      "w-3.5 h-3.5",
                      activeLanguage === 'javascript' ? "text-primary-foreground" : "text-primary"
                    )} />
                    JavaScript
                  </Button>
                  <Button
                    variant={activeLanguage === 'python' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveLanguage('python')}
                    className="flex items-center gap-1.5"
                  >
                    <SiPython className={cn(
                      "w-3.5 h-3.5",
                      activeLanguage === 'python' ? "text-primary-foreground" : "text-primary"
                    )} />
                    Python
                  </Button>
                </div>
              </div>

              <div className="pt-10 p-5">
                <pre className="font-mono text-xs overflow-x-auto">
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
