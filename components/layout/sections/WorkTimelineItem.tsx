// components/WorkTimelineItem.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { WorkExperience } from '@/data/workExperience';
import { cn } from '@/lib/utils';

interface WorkTimelineItemProps {
  experience: WorkExperience;
  index: number;
  onClick: () => void;
  isActive: boolean;
}

const WorkTimelineItem: React.FC<WorkTimelineItemProps> = ({ 
  experience, 
  index, 
  onClick,
  isActive 
}) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      className={cn(
        "mb-16 relative",
        isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Year badge */}
      <motion.div 
        className={cn(
          "absolute top-0 transform -translate-y-1/2 z-10",
          "bg-gradient-to-r from-primary/90 to-primary/80 backdrop-blur-sm",
          "text-background rounded-full px-4 py-1 font-medium",
          "border border-white/10 shadow-lg",
          "left-4 md:left-1/2",
          isEven ? 'md:translate-x-8' : 'md:-translate-x-8'
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {experience.year}
      </motion.div>
      
      {/* Timeline dot */}
      <motion.div
        className={cn(
          "absolute top-0 transform -translate-x-[7px] -translate-y-[7px] z-20",
          "left-4 md:left-1/2 w-4 h-4",
          "bg-gradient-to-r from-primary to-primary/80 rounded-full",
          "shadow-lg shadow-primary/20"
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <motion.div
          className="absolute inset-0 bg-primary rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Content card */}
      <motion.div
        className={cn(
          "relative p-6 rounded-lg cursor-pointer transition-all duration-300",
          "border border-border/20 bg-card",
          "hover:border-primary/20 hover:shadow-lg",
          "ml-12 md:ml-0",
          isEven ? 'md:mr-8' : 'md:ml-8',
          isActive && "ring-2 ring-primary/50 shadow-xl"
        )}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        onClick={onClick}
      >
        {/* Company logo and details */}
        <div className="relative flex items-center mb-4 gap-4">
          <motion.div 
            className={cn(
              "relative overflow-hidden rounded-lg",
              "bg-primary/5",
              "p-3 transition-colors duration-300"
            )}
            whileHover={{ scale: 1.1 }}
          >
            <Image
              src={experience.logo}
              alt={`${experience.company} logo`}
              width={40}
              height={40}
              className="rounded-lg"
            />
          </motion.div>
          <div>
            <motion.h3 
              className="text-xl font-semibold text-primary"
            >
              {experience.position}
            </motion.h3>
            <motion.p className="text-primary/80 font-medium">
              {experience.company}
            </motion.p>
            <motion.p className="text-sm text-muted-foreground">
              {experience.duration}
            </motion.p>
          </div>
        </div>

        {/* Description preview */}
        <motion.p 
          className="text-muted-foreground/90 mb-4 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {experience.description[0]}
        </motion.p>

        {/* Skills */}
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {experience.skills.slice(0, 5).map((skill, i) => (
            <motion.span
              key={i}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300",
                "bg-primary/5 text-primary/90",
                "hover:bg-primary/10",
                "border border-primary/10"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {React.createElement(skill.icon, { className: "w-4 h-4" })}
              {skill.name}
            </motion.span>
          ))}
          {experience.skills.length > 5 && (
            <motion.span
              className={cn(
                "flex items-center px-3 py-1.5 rounded-lg text-sm",
                "bg-primary/5 text-primary/80",
                "border border-primary/10"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              +{experience.skills.length - 5} more
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WorkTimelineItem;
