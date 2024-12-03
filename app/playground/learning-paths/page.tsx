"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { careerPaths } from "./data";
import { CareerPath, LearningPath, Skill } from "@/types/learningPath";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/shared/ui/core/button";
import { Card } from "@/components/shared/ui/core/card";
import { Badge } from "@/components/shared/ui/core/badge";
import { Progress } from "@/components/shared/ui/feedback/progress";
import Link from "next/link";
import { 
  BookOpen, Code2, Brain, 
  ChevronLeft, ChevronRight, 
  Check, ExternalLink, Flame, 
  ArrowRight, Star, TrendingUp 
} from "lucide-react";
import { useLearningProgress } from "./hooks/use-learning-progress";

// Enhanced Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardHoverVariants: Variants = {
  rest: { 
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  hover: { 
    scale: 1.03,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 255, 0.2), 0 10px 10px -5px rgba(128, 0, 255, 0.1)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

const Icons = {
  BookOpen: BookOpen,
  Code: Code2,
  Brain: Brain,
  ChevronLeft: ChevronLeft,
  ChevronRight: ChevronRight,
  Check: Check,
  ExternalLink: ExternalLink,
  Flame: Flame,
  ArrowRight: ArrowRight,
  Star: Star,
  TrendingUp: TrendingUp
} as const;

export default function LearningPathsPage() {
  const { data: session, status } = useSession();
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [selectedLearningPath, setSelectedLearningPath] = useState<LearningPath | null>(null);
  const {
    completedSkills,
    currentStreak,
    completeSkill,
    calculatePathProgress,
    calculateLearningPathProgress,
    isSkillAvailable,
  } = useLearningProgress();

  const handlePathSelect = (path: CareerPath) => {
    setSelectedPath(path);
    setSelectedLearningPath(null);
  };

  const handleLearningPathSelect = (learningPath: LearningPath) => {
    setSelectedLearningPath(learningPath);
  };

  if (status === "loading") {
    return <Loading text="Loading learning paths..." />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Please Sign In</h2>
          <p className="text-white/60 mb-6">You need to be logged in to view learning paths.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -right-4 -top-4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-8">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Learning Paths</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Learning Paths
          </motion.h1>
          
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore curated learning paths designed to help you master new skills and technologies. 
            Follow structured roadmaps to accelerate your learning journey.
          </motion.p>
        </motion.div>

        {/* Career Paths Grid */}
        {!selectedPath && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {careerPaths.map((path, index) => {
              const progress = calculatePathProgress(path);
              return (
                <motion.div
                  key={path.id}
                  initial="rest"
                  whileHover="hover"
                  variants={cardHoverVariants}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <div 
                    className="learning-path-card h-full cursor-pointer"
                    onClick={() => handlePathSelect(path)}
                  >
                    <div className="learning-path-card-bg" />
                    <div className="learning-path-card-border" />
                    
                    <div className="learning-path-card-content h-full flex flex-col p-6 relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        {path.icon && Icons[path.icon as keyof typeof Icons] && (
                          <div className="learning-path-icon p-3 rounded-lg bg-white/10">
                            {React.createElement(Icons[path.icon as keyof typeof Icons], { 
                              className: "w-6 h-6 text-primary" 
                            })}
                          </div>
                        )}
                        <div>
                          <h2 className="text-xl font-semibold text-white/90">
                            {path.title}
                          </h2>
                          <p className="text-sm text-white/60">
                            {path.overview.estimatedTimeToMastery}
                          </p>
                        </div>
                      </div>

                      <p className="text-white/70 mb-4 flex-grow">
                        {path.description}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60">
                            Progress
                          </span>
                          <span className="font-medium text-white/80">
                            {progress}%
                          </span>
                        </div>
                        <div className="learning-path-progress">
                          <Progress 
                            value={progress} 
                            className="h-2 bg-white/10" 
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {path.overview.requiredSkills.slice(0, 3).map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="secondary" 
                            className="bg-white/10 text-white/70"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {path.overview.requiredSkills.length > 3 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-white/10 text-white/70"
                          >
                            +{path.overview.requiredSkills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Selected Career Path View */}
        {selectedPath && (
          <div>
            <Button
              variant="ghost"
              className="mb-6 text-white/60 hover:text-white"
              onClick={() => setSelectedPath(null)}
            >
              <Icons.ChevronLeft className="w-4 h-4 mr-2" />
              Back to Paths
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Learning Paths Sidebar */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">{selectedPath.title}</h2>
                {selectedPath.learningPaths.map((learningPath) => {
                  const progress = calculateLearningPathProgress(learningPath);
                  return (
                    <motion.div
                      key={learningPath.id}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <Card
                        className={cn(
                          "bg-white/5 border-white/10 p-4 cursor-pointer transition-colors",
                          selectedLearningPath?.id === learningPath.id
                            ? "bg-primary/10 border-primary/20"
                            : "hover:bg-white/10"
                        )}
                        onClick={() => handleLearningPathSelect(learningPath)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{learningPath.title}</h3>
                              <p className="text-sm text-white/60">
                                {learningPath.estimatedWeeks} weeks
                              </p>
                            </div>
                            <Icons.ChevronRight className="w-4 h-4" />
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Skills and Resources */}
              <div className="lg:col-span-2">
                {selectedLearningPath ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {selectedLearningPath.title}
                      </h3>
                      <p className="text-white/60">
                        {selectedLearningPath.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Objectives</h4>
                      <ul className="space-y-2">
                        {selectedLearningPath.objectives.map((objective, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Icons.Check className="w-4 h-4 text-primary" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Skills</h4>
                      {selectedLearningPath.skills.map((skill) => {
                        const available = isSkillAvailable(skill);
                        const completed = completedSkills.has(skill.id);

                        return (
                          <motion.div
                            key={skill.id}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                          >
                            <Card
                              className={cn(
                                "bg-white/5 border-white/10 p-4 transition-colors",
                                !available && "opacity-50"
                              )}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h5 className="font-semibold">{skill.title}</h5>
                                  <p className="text-sm text-white/60">
                                    {skill.description}
                                  </p>
                                </div>
                                <Button
                                  variant={completed ? "default" : "outline"}
                                  size="sm"
                                  disabled={!available}
                                  onClick={() => completeSkill(skill.id)}
                                >
                                  {completed ? (
                                    <>
                                      <Icons.Check className="w-4 h-4 mr-2" />
                                      Completed
                                    </>
                                  ) : (
                                    "Mark Complete"
                                  )}
                                </Button>
                              </div>

                              <div className="space-y-2">
                                {skill.resources.map((resource) => (
                                  <a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h6 className="font-medium">
                                          {resource.title}
                                        </h6>
                                        <p className="text-sm text-white/60">
                                          {resource.estimatedTime} •{" "}
                                          {resource.priority}
                                        </p>
                                      </div>
                                      <Icons.ExternalLink className="w-4 h-4" />
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/60">
                      Select a learning path to view its content
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
