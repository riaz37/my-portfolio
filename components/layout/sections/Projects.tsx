'use client';

import { motion } from 'framer-motion';
import ProjectCard from '@/components/layout/ProjectCard';
import { projects } from '@/data/projects';
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/layout/SectionTitle';

export function Projects() {
  const featuredProjects = projects.filter(project => project.featured);

  return (
    <div className="container">
      <SectionTitle {...sectionTitles.projects} />
      
      {/* Featured Projects */}
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              isHovered={false}
              liveUrl={project.demo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};