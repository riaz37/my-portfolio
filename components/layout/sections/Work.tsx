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
import { SectionTitle } from '@/components/shared/ui/section';
import { Button } from '@/components/shared/ui/core/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-8 right-0 w-72 h-72 bg-secondary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
          <SectionTitle 
            highlight="Experience"
            subtitle={sectionTitles.work.description}
            showDecoration={true}
          >
            Work History
          </SectionTitle>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              size="lg"
              className={cn(
                "bg-primary hover:bg-primary/90",
                "text-background",
                "transition-colors duration-200",
                "min-w-[160px]"
              )}
              onClick={() => window.open('https://drive.google.com/file/d/1wYEWs-KIRjSusBDYOBgeX86NbPmX7zOu/view?usp=sharing', '_blank')}
            >
              <Download className="h-5 w-5 mr-2" />
              Download CV
            </Button>
          </motion.div>
        </div>
        
        {/* Timeline container */}
        <div className="max-w-5xl mx-auto relative" ref={containerRef}>
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5" />
          <motion.div 
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/80 to-primary/60 origin-top"
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
                  onClick={() => setActive(experience)}
                  isActive={active?.id === experience.id}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Work Popup */}
        <AnimatePresence>
          {active && (
            <WorkPopup
              ref={popupRef}
              experience={active}
              onClose={() => setActive(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Work;
