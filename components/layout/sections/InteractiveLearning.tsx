import { motion } from 'framer-motion';
import { Button } from '@/components/shared/ui/core/button';
import { Sparkles, Database, Globe, Server, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Card, CardContent } from '@/components/shared/ui/data-display/card';
import { useState } from 'react';
import { SiJavascript, SiPython } from 'react-icons/si';

export default function InteractiveLearning() {
  const [activeLanguage, setActiveLanguage] = useState<'javascript' | 'python'>('javascript');

  const codeSnippets = {
    javascript: `// 🚀 Your Learning Adventure Begins Here!

const createDeveloper = {
  name: "You",
  goal: "Become a Full-Stack Pro",
  
  skills: {
    🎨 frontend: [
      "Master React Wizardry",
      "Next.js Superpowers",
      "Beautiful UI Magic"
    ],
    
    ⚡️ backend: [
      "API Architecture",
      "Database Mastery",
      "Server-Side Genius"
    ],
    
    🧠 interview: [
      "Data Structures & Algorithms",
      "System Design Mastery",
      "Problem-Solving Skills"
    ]
  },

  level: "Leveling Up Daily! 🎮"
};

// Your journey to success starts now! 🌟`,

    python: `# 🚀 Your Learning Adventure Begins Here!

developer = {
    "name": "You",
    "goal": "Become a Full-Stack Pro",
    
    "skills": {
        "🎨 frontend": [
            "Master React Wizardry",
            "Next.js Superpowers",
            "Beautiful UI Magic"
        ],
        
        "⚡️ backend": [
            "API Architecture",
            "Database Mastery",
            "Server-Side Genius"
        ],
        
        "🧠 interview": [
            "Data Structures & Algorithms",
            "System Design Mastery",
            "Problem-Solving Skills"
        ]
    },
    
    "level": "Leveling Up Daily! 🎮"
}

# Your journey to success starts now! 🌟`
  };

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Frontend Development",
      description: "Master modern UI development with React, Next.js, and responsive design principles.",
      color: "text-blue-500"
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Backend Development",
      description: "Build robust server-side applications with Node.js, Express, and RESTful APIs.",
      color: "text-green-500"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Database & DevOps",
      description: "Learn database management, deployment, and modern DevOps practices.",
      color: "text-yellow-500"
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "Interview Preparation",
      description: "Master DSA, system design, and coding interviews with our comprehensive preparation program.",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Badge variant="outline" className="py-1 px-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Interactive Learning
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
              Become a Full-Stack Developer
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Master full-stack development and ace your tech interviews through hands-on practice,
            interactive challenges, and comprehensive learning paths designed for all skill levels.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className={`${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-lg overflow-hidden bg-card border p-1 max-w-4xl mx-auto"
        >
          <div className="absolute top-0 left-0 right-0 h-12 bg-muted/50 rounded-t-lg flex items-center justify-between px-4">
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
                <SiJavascript className="w-4 h-4 text-yellow-400" />
                JavaScript
              </Button>
              <Button 
                variant={activeLanguage === 'python' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveLanguage('python')}
                className="flex items-center gap-2"
              >
                <SiPython className="w-4 h-4 text-blue-400" />
                Python
              </Button>
            </div>
          </div>

          <div className="pt-12 p-6 bg-card rounded-lg">
            <pre className="font-mono text-sm overflow-x-auto">
              <code>{codeSnippets[activeLanguage]}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
