// components/WorkPopup.tsx
import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkExperience } from '@/data/workExperience';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface WorkPopupProps {
  active: WorkExperience | null;
  setActive: (experience: WorkExperience | null) => void;
}

const WorkPopup = forwardRef<HTMLDivElement, WorkPopupProps>(({ active, setActive }, ref) => {
  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
      >
        <motion.div
          ref={ref}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="bg-card text-card-foreground p-8 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative border border-border/50 shadow-xl"
        >
          {/* Close button */}
          <button
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-start space-x-6 mb-8">
            <motion.div 
              className="relative flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-primary/10 rounded-xl p-4">
                <Image
                  src={active.logo}
                  alt={`${active.company} logo`}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>
            </motion.div>

            <div className="flex-grow">
              <motion.h3 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-2"
              >
                {active.position}
              </motion.h3>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-1"
              >
                <p className="text-lg font-semibold text-primary/80">{active.company}</p>
                <p className="text-sm text-muted-foreground">{active.duration}</p>
                <p className="text-sm text-muted-foreground">{active.year}</p>
              </motion.div>
            </div>
          </div>

          {/* Skills grid */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {active.skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center bg-primary/5 hover:bg-primary/10 text-primary px-3 py-2 rounded-lg transition-colors"
              >
                {React.createElement(skill.icon, { className: "mr-2 w-4 h-4" })}
                <span className="text-sm font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-primary mb-4">Key Achievements & Responsibilities</h4>
            <ul className="space-y-3">
              {active.description.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  <span className="text-card-foreground/80">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

WorkPopup.displayName = 'WorkPopup';

export default WorkPopup;
