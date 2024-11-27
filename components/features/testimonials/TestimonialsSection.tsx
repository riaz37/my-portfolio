'use client';

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";
import { Button } from "@/components/shared/ui/core/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/section';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "John Doe",
    role: "Senior Developer",
    company: "Tech Corp",
    image: "/testimonials/person1.jpg",
    content: "Working with you was an incredible experience. Your attention to detail and problem-solving skills are outstanding!",
    rating: 5
  },
  {
    name: "Jane Smith",
    role: "Project Manager",
    company: "Digital Solutions",
    image: "/testimonials/person2.jpg",
    content: "Your ability to translate complex requirements into elegant solutions is remarkable. You're a true professional!",
    rating: 5
  },
  {
    name: "Alex Johnson",
    role: "CTO",
    company: "Startup Inc",
    image: "/testimonials/person3.jpg",
    content: "I'm impressed by your technical expertise and collaborative approach. You're a valuable asset to any team!",
    rating: 5
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const handlePrevious = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Remove background gradient */}
      <div className="max-w-6xl mx-auto">
        <SectionTitle 
          highlight="Testimonials"
          subtitle={sectionTitles.testimonials.description}
          showDecoration={true}
        >
          Client Testimonials
        </SectionTitle>
        
        <div className="relative">
          <div className="flex justify-center items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 z-10 bg-background/80 backdrop-blur-sm"
              onClick={handlePrevious}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="overflow-hidden w-full max-w-md">
              <AnimatePresence mode="wait" initial={false}>
                <TestimonialCard key={currentIndex} {...testimonials[currentIndex]} />
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 z-10 bg-background/80 backdrop-blur-sm"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === currentIndex}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/20"
                }`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
