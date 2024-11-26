// components/layout/sections/Work.tsx
"use client";
import React, { useState, useRef } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { workExperiences, WorkExperience } from '@/data/workExperience';
import WorkTimelineItem from '@/components/layout/sections/WorkTimelineItem';
import WorkPopup from '@/components/layout/sections/WorkPopup';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { useScrollSection } from '@/hooks/use-scroll-section';
import { FaBriefcase } from 'react-icons/fa';
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/layout/SectionTitle';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const Work: React.FC = () => {
  const [active, setActive] = useState<WorkExperience | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isVisible } = useScrollSection();

  // Scroll progress animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useOutsideClick(popupRef, () => {
    if (active) {
      setActive(null);
    }
  });

  return (
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8 relative" ref={ref}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
        <SectionTitle {...sectionTitles.work} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="relative group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
            onClick={() => window.open('https://drive.google.com/file/d/1wYEWs-KIRjSusBDYOBgeX86NbPmX7zOu/view?usp=sharing', '_blank')}
          >
            <motion.span
              animate={{ 
                x: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download CV
            </motion.span>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
          </Button>
        </motion.div>
      </div>
      
      {/* Timeline container */}
      <div className="max-w-5xl mx-auto relative" ref={containerRef}>
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />
        <motion.div 
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary origin-top"
          style={{ scaleY: scaleX }}
        />
        
        {/* Timeline items */}
        <div className="relative">
          {workExperiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <WorkTimelineItem
                experience={experience}
                index={index}
                setActive={setActive}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Work details popup */}
      <AnimatePresence>
        {active && <WorkPopup active={active} setActive={setActive} ref={popupRef} />}
      </AnimatePresence>
    </section>
  );
};
