'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '@/components/layout/ProjectCard';
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/section';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { Loading } from '@/components/shared/loading';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  imageUrl: string;
}

export function Projects() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useCustomToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setFeaturedProjects(data.filter((project: Project) => project.featured));
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch projects',
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  if (isLoading) {
    return <Loading text="Loading featured projects..." />;
  }

  return (
    <div id="featuredprojects" className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle {...sectionTitles.projects}>
        {sectionTitles.projects.children}
      </SectionTitle>
      
      {/* Featured Projects */}
      <div className="mt-12 mb-16">
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                demo={project.liveUrl}
                github={project.githubUrl}
                image={project.imageUrl}
                isHovered={false}
                liveUrl={project.liveUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            No featured projects found.
          </div>
        )}
      </div>
    </div>
  );
}
