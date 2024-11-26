// components/WorkTimelineItem.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { WorkExperience } from '@/data/workExperience';

interface WorkTimelineItemProps {
  experience: WorkExperience;
  index: number;
  setActive: (experience: WorkExperience) => void;
}

const WorkTimelineItem: React.FC<WorkTimelineItemProps> = ({ experience, index, setActive }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      className={`mb-16 relative ${isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Year badge */}
      <motion.div 
        className={`absolute top-0 left-4 md:left-1/2 transform -translate-y-1/2 ${
          isEven ? 'md:translate-x-8' : 'md:-translate-x-8'
        } bg-primary text-black rounded-full px-4 py-1 font-medium z-10`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {experience.year}
      </motion.div>
      
      {/* Timeline dot */}
      <motion.div
        className={`absolute top-0 left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-[7px] -translate-y-[7px] z-20`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <motion.div
          className="absolute inset-0 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ opacity: 0.3 }}
        />
      </motion.div>
      
      {/* Content card */}
      <motion.div
        className={`relative bg-card hover:bg-card/80 p-6 rounded-lg ml-12 md:ml-0 ${
          isEven ? 'md:mr-8' : 'md:ml-8'
        } border border-border/50 backdrop-blur-sm cursor-pointer group transition-all`}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        onClick={() => setActive(experience)}
      >
        {/* Company logo and details */}
        <div className="flex items-center mb-4">
          <motion.div 
            className="relative bg-primary/5 rounded-lg p-3 mr-4 overflow-hidden group-hover:bg-primary/10 transition-colors"
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

        {/* Skills */}
        <motion.div 
          className="flex flex-wrap gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {experience.skills.slice(0, 5).map((skill, i) => (
            <motion.div
              key={i}
              className="flex items-center bg-primary/5 hover:bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm transition-colors"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {React.createElement(skill.icon, { className: "mr-1.5 w-4 h-4" })}
              <span className="text-xs font-medium">{skill.name}</span>
            </motion.div>
          ))}
          {experience.skills.length > 5 && (
            <motion.div
              className="flex items-center bg-primary/5 hover:bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm transition-colors"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + 5 * 0.1 }}
            >
              <span className="text-xs font-medium">+{experience.skills.length - 5} more</span>
            </motion.div>
          )}
        </motion.div>

        {/* View more hint */}
        <motion.div
          className="absolute bottom-2 right-2 text-xs text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Click to view details
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WorkTimelineItem;
