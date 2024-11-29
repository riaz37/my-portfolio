"use client";
import React, { useState, useRef, useEffect } from 'react';
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
import { Loading } from '@/components/shared/loading';

export const Work: React.FC = () => {
  const [active, setActive] = useState<WorkExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
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

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        // Simulating API call with workExperiences data
        // In a real app, you would fetch from an API
        setExperiences(workExperiences);
      } catch (error) {
        console.error('Error fetching work experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useOutsideClick(popupRef, () => {
    if (active) {
      setActive(null);
    }
  });

  if (loading) {
    return <Loading text="Loading work experience..." />;
  }

  return (
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" ref={ref}>
      <div className="container relative mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <SectionTitle {...sectionTitles.work}>
              {sectionTitles.work.children}
            </SectionTitle>
            <Button variant="outline" className="group">
              <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              Download Resume
            </Button>
          </div>

          <div ref={containerRef} className="relative">
            {/* Progress Bar */}
            <motion.div
              className="absolute left-9 md:left-1/2 top-3 w-[1px] h-[calc(100%-24px)] bg-border origin-top"
              style={{ scaleY: scaleX }}
            />

            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <div 
                  key={experience.company}
                  className="relative"
                >
                  <WorkTimelineItem
                    experience={experience}
                    index={index}
                    onClick={() => setActive(experience)}
                    isActive={active?.company === experience.company}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <WorkPopup
            ref={popupRef}
            experience={active}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Work;
