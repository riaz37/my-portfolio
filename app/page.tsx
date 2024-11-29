'use client'

import Hero from "@/components/layout/sections/Hero";
import InteractiveLearning from '@/components/layout/sections/InteractiveLearning';
import { Button } from "@/components/shared/ui/core/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/shared/ui/section";

export default function Home() {
  return (
    <div className="relative flex flex-col">
      {/* Hero Section */}
      <section 
        id="home" 
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center w-full relative py-8 sm:py-12"
      >
        <Hero />
      </section>

      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Interactive Learning Section */}
        <motion.section
          id="learning"
          className="w-full py-12 sm:py-16 md:py-24 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <InteractiveLearning />
            </div>
          </div>
        </motion.section>

        {/* Learning CTA */}
        <motion.section 
          className="w-full py-12 sm:py-16 md:py-24 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <SectionTitle
                badge="Start Learning"
                highlight="Learning Journey"
                subtitle="Join our community of learners and get personalized guidance, interactive challenges, and hands-on experience to accelerate your growth in tech."
              >
                Ready to Start Your Learning Journey?
              </SectionTitle>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-6 sm:mt-8 flex justify-center"
              >
                <Button size="lg" className="group">
                  Get Started 
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}