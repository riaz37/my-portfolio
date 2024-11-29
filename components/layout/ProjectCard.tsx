// components/ProjectCard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Code2, ExternalLink, Github, ArrowUpRight } from 'lucide-react';

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

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  description, 
  technologies, 
  demo, 
  github, 
  image, 
  isHovered, 
  liveUrl 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isClicked) {
        setIsClicked(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isClicked]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
  };

  return (
    <motion.div
      className="relative p-4 sm:p-6 rounded-xl bg-card text-card-foreground transition-all duration-300 cursor-pointer h-[400px] sm:h-[450px] flex flex-col border border-transparent hover:border-primary/20 hover:shadow-lg group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.025,
        boxShadow: "0 10px 25px -10px rgba(var(--primary-rgb), 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsClicked(false)}
      onClick={handleCardClick}
    >
      {/* Background Hover Effect */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />

      {/* Project Image */}
      <div className="relative w-full h-36 sm:h-48 mb-4 rounded-lg overflow-hidden">
        {image ? (
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
            <Code2 className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="flex-grow">
        <h3 className="text-lg sm:text-xl font-bold mb-2 transition-colors group-hover:text-primary duration-300">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4 transition-colors group-hover:text-foreground duration-300">
          {description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs bg-secondary/20 rounded-full transition-colors group-hover:bg-primary/10 group-hover:text-primary duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Project Links */}
      <div className="flex justify-between items-center">
        {demo && (
          <Link 
            href={demo} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary/70 group-hover:text-primary transition-colors group"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>Live Demo</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        )}
        {github && (
          <Link 
            href={github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors group"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>Source</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
