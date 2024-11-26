"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollSection } from "@/hooks/use-scroll-section";
import { FaGithub, FaCode, FaStar, FaCodeBranch, FaExternalLinkAlt, FaGlobe } from "react-icons/fa";
import { BiGitPullRequest } from "react-icons/bi";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface GitHubStats {
  totalContributions: number;
  repositories: number;
  stars: number;
  pullRequests: number;
  commits: number;
}

interface Repository {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  homepage: string | null;
  topics: string[];
  updatedAt: string;
}

type ProjectFilter = "featured" | "github";

export default function DeveloperPortfolio() {
  const [selectedFilter, setSelectedFilter] = useState<ProjectFilter>("featured");
  const [stats, setStats] = useState<GitHubStats>({
    totalContributions: 0,
    repositories: 0,
    stars: 0,
    pullRequests: 0,
    commits: 0,
  });
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isVisible } = useScrollSection();

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const [statsRes, reposRes] = await Promise.all([
          fetch("/api/github/stats"),
          fetch("/api/github/repos"),
        ]);
        
        if (!statsRes.ok || !reposRes.ok) {
          throw new Error("Failed to fetch GitHub data");
        }

        const statsData = await statsRes.json();
        const reposData = await reposRes.json();

        setStats(statsData);
        setRepos(reposData);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
    <motion.div
      className="flex items-center gap-3 bg-card p-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="text-primary text-xl">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value.toLocaleString()}</div>
      </div>
    </motion.div>
  );

  const FilterButton = ({ filter }: { filter: ProjectFilter }) => (
    <button
      onClick={() => setSelectedFilter(filter)}
      className={cn(
        "px-4 py-2 rounded-full transition-all",
        selectedFilter === filter
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      )}
    >
      {filter.charAt(0).toUpperCase() + filter.slice(1)}
    </button>
  );

  const renderProjects = () => {
    const displayProjects = selectedFilter === "featured" ? projects : repos;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayProjects.map((project, index) => (
            <motion.div 
              key={selectedFilter === "featured" ? project.id : project.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-lg border transition-all",
                selectedFilter === "featured"
                  ? "bg-gradient-to-br from-primary/10 via-background to-primary/5 hover:shadow-xl hover:shadow-primary/20 border-primary/20 col-span-1 md:col-span-2 lg:col-span-1"
                  : "bg-card hover:shadow-lg"
              )}
            >
              {/* Main content area - links to live demo */}
              <Link
                href={selectedFilter === "featured" 
                  ? (project.demo || '#')
                  : (project.homepage || project.url || '#')
                }
                target="_blank"
                className={cn(
                  "block relative group",
                  selectedFilter === "featured" ? "p-6" : "p-5"
                )}
                onClick={(e) => {
                  if (selectedFilter === "featured" && !project.demo) {
                    e.preventDefault();
                  }
                }}
              >
                {selectedFilter === "featured" && project.image && (
                  <div className={cn(
                    "relative overflow-hidden rounded-lg mb-4",
                    "h-64"
                  )}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                  </div>
                )}
                <h3 className={cn(
                  "font-semibold mb-2 transition-colors group-hover:text-primary break-words overflow-hidden",
                  selectedFilter === "featured" ? "text-4xl md:text-5xl" : "text-lg"
                )}>
                  {selectedFilter === "featured" ? project.title : project.name}
                </h3>
                <p className={cn(
                  "text-muted-foreground mb-4 break-words overflow-hidden",
                  selectedFilter === "featured" ? "text-lg" : "text-sm"
                )}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(selectedFilter === "featured" ? project.technologies : project.topics).map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "text-xs px-2 py-1 rounded-full transition-colors",
                        selectedFilter === "featured"
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "bg-muted"
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>

              {/* Footer with GitHub link and stats */}
              <div className={cn(
                "flex items-center gap-3",
                selectedFilter === "featured"
                  ? "p-6 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
                  : "p-5 border-t bg-muted/50"
              )}>
                {selectedFilter === "featured" ? (
                  // Featured project footer
                  <>
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="flex items-center gap-1.5">
                          <FaGithub className="w-5 h-5" />
                          <span className="text-sm">View Source</span>
                        </span>
                      </Link>
                    )}
                    <div className="ml-auto">
                      <motion.div 
                        className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <FaStar className="w-3.5 h-3.5" />
                        <span>Featured</span>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  // GitHub project footer
                  <>
                    <Link
                      href={project.url}
                      target="_blank"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="flex items-center gap-1.5">
                        <FaGithub className="w-5 h-5" />
                        <span className="text-sm">View Repository</span>
                      </span>
                    </Link>
                    <div className="ml-auto flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FaStar className="w-4 h-4" />
                        {project.stars}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FaCodeBranch className="w-4 h-4" />
                        {project.forks}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Live indicator */}
              {((selectedFilter === "featured" && project.demo) || 
                (selectedFilter === "github" && project.homepage)) && (
                <div className="absolute top-4 right-4">
                  <motion.div
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full shadow-lg",
                      selectedFilter === "featured"
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/90 text-primary-foreground"
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaGlobe className="w-3.5 h-3.5" />
                    <span>Live</span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section id="portfolio" className="py-20" ref={ref}>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            className="text-sm uppercase tracking-wider text-primary font-semibold mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Featured Projects
          </motion.div>
          <motion.div className="relative">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold inline-flex items-center gap-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <FaCode className="text-primary h-8 w-8 md:h-10 md:w-10" />
              <span className="text-primary">
                Portfolio
              </span>
            </motion.h2>
            <motion.div
              className="h-1 bg-primary mx-auto rounded-full mt-4"
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </motion.div>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Showcasing my featured projects and open-source contributions
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          <StatCard icon={<FaGithub />} label="Contributions" value={stats.totalContributions} />
          <StatCard icon={<FaCode />} label="Repositories" value={stats.repositories} />
          <StatCard icon={<FaStar />} label="Stars" value={stats.stars} />
          <StatCard icon={<BiGitPullRequest />} label="Pull Requests" value={stats.pullRequests} />
          <StatCard icon={<FaCodeBranch />} label="Commits" value={stats.commits} />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <FilterButton filter="featured" />
          <FilterButton filter="github" />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            renderProjects()
          )}
        </div>
      </motion.div>
    </section>
  );
}
