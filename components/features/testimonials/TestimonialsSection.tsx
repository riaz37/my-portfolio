'use client';

import { useState, useEffect } from "react";
import useSWR from 'swr';
import { AnimatePresence, motion } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/section';

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  featured: boolean;
  avatarUrl?: string;
}

const fetcher = async (url: string) => {
  try {
    console.group('🚀 Testimonials Fetcher Debug');
    console.log('🌐 Fetching URL:', url);
    console.log('🕒 Timestamp:', new Date().toISOString());
    
    const fullUrl = `${window.location.origin}${url}`;
    console.log('📍 Full URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    });

    console.log('📡 Fetch Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Testimonials Fetch Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`Failed to fetch testimonials: ${errorText}`);
    }

    const data = await response.json();
    
    console.log('📦 Raw Data:', data);
    console.log('🔢 Total Testimonials:', data.length);
    console.log('⭐ Featured Testimonials:', data.filter((t: Testimonial) => t.featured));
    console.groupEnd();

    return data;
  } catch (error) {
    console.error('🚨 Fetch Testimonials Error:', error);
    throw error;
  }
};

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { 
    data: testimonials = [], 
    error, 
    isLoading 
  } = useSWR<Testimonial[]>('/api/testimonials?featured=true', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0, // Disable automatic revalidation
    keepPreviousData: true,
    onError: (err) => {
      console.error('SWR Testimonials Error:', err);
    }
  });

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) return (
    <section className="container py-16">
      <div className="max-w-4xl mx-auto">
        <SectionTitle {...sectionTitles.testimonials} />
        <div className="flex justify-center items-center mt-12">
          <div className="animate-pulse w-full max-w-md h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="container py-16">
      <div className="max-w-4xl mx-auto">
        <SectionTitle {...sectionTitles.testimonials} />
        <div className="text-center text-red-500 mt-12">
          Failed to load testimonials. Please try again later.
          <pre className="mt-4 text-xs text-gray-600 whitespace-pre-wrap break-words">
            {error.toString()}
          </pre>
        </div>
      </div>
    </section>
  );

  if (testimonials.length === 0) return null;

  return (
    <section id="clienttestimonial" className="container py-16">
      <div className="max-w-4xl mx-auto">
        <SectionTitle {...sectionTitles.testimonials} />
        
        <div className="relative mt-12 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <TestimonialCard 
                key={testimonials[currentIndex]._id}
                testimonial={testimonials[currentIndex]} 
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-3 w-3 rounded-full ${
                  currentIndex === index ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
