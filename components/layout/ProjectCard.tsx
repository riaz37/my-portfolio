// components/ProjectCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Code2, ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/shared/ui/core/badge';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  demo?: string;
  github?: string;
  image?: string;
  isHovered: boolean;
  liveUrl?: string;
}

const ProjectCard = React.memo(({ 
  title, 
  description, 
  technologies, 
  demo, 
  github, 
  image, 
  isHovered, 
  liveUrl 
}: ProjectCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      {/* Project Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        {image ? (
          <Image 
            src={image} 
            alt={title}
            fill 
            className={cn(
              "object-cover transition-all duration-300",
              isHovering && "scale-110 blur-sm brightness-50"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/20">
            <Code2 className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300",
          isHovering && "opacity-100"
        )}>
          {github && (
            <Link
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-background/90 p-3 text-foreground shadow-lg backdrop-blur-sm transition-transform hover:scale-110 hover:bg-background"
            >
              <Github className="h-5 w-5" />
            </Link>
          )}
          {liveUrl && (
            <Link
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-background/90 p-3 text-foreground shadow-lg backdrop-blur-sm transition-transform hover:scale-110 hover:bg-background"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-2 py-0.5 text-xs font-medium"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* View Project Link */}
        <Link
          href={liveUrl || github || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-primary",
            !liveUrl && !github && "pointer-events-none opacity-50"
          )}
        >
          View Project
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
