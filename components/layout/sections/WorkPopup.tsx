// components/WorkPopup.tsx
import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkExperience } from '@/data/workExperience';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface WorkPopupProps {
  experience: WorkExperience;
  onClose: () => void;
}

const WorkPopup = forwardRef<HTMLDivElement, WorkPopupProps>(({ experience, onClose }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={ref}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className={cn(
          "relative w-full max-w-2xl max-h-[80vh] overflow-y-auto",
          "bg-gradient-to-br from-card via-card/95 to-card/90",
          "text-card-foreground p-8 rounded-xl",
          "border border-border/50 shadow-xl",
          "backdrop-blur-sm"
        )}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
        
        {/* Close button */}
        <motion.button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full transition-all duration-300",
            "bg-gradient-to-br from-primary/10 to-primary/5",
            "hover:from-primary/20 hover:to-primary/10",
            "text-primary shadow-lg",
            "border border-primary/10"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <XMarkIcon className="w-6 h-6" />
        </motion.button>

        <div className="relative">
          {/* Header */}
          <div className="flex items-start space-x-6 mb-8">
            <motion.div 
              className="relative flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-gradient-to-br from-primary/10 to-primary/5 p-4",
                "group hover:from-primary/15 hover:to-primary/10",
                "transition-colors duration-300"
              )}>
                <Image
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>

            <div className="flex-grow">
              <motion.h3 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2"
              >
                {experience.position}
              </motion.h3>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-1"
              >
                <p className="text-lg font-semibold text-primary/80">{experience.company}</p>
                <p className="text-sm text-muted-foreground">{experience.duration}</p>
                <p className="text-sm text-muted-foreground">{experience.year}</p>
              </motion.div>
            </div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h4 className="text-lg font-semibold text-primary/90 mb-3">About the Role</h4>
            <div className="space-y-2">
              {experience.description.map((desc, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="text-lg font-semibold text-primary/90 mb-3">Technologies & Skills</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {experience.skills.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
                    "bg-gradient-to-br from-primary/10 to-primary/5",
                    "hover:from-primary/15 hover:to-primary/10",
                    "text-primary/90 hover:text-primary",
                    "border border-primary/10",
                    "group hover:shadow-md"
                  )}
                >
                  {React.createElement(skill.icon, { className: "w-4 h-4" })}
                  {skill.name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

WorkPopup.displayName = 'WorkPopup';

export default WorkPopup;
