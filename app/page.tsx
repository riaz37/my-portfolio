'use client'

import { AnimatePresence } from 'framer-motion';
import Hero from "@/components/layout/sections/Hero";
import InteractiveLearning from '@/components/layout/sections/InteractiveLearning';
import { Button } from "@/components/shared/ui/core/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <AnimatePresence mode="wait">
      <div className="relative flex flex-col gap-20">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center">
          <Hero />
        </section>

        {/* Interactive Learning Section */}
        <motion.section
          id="learning"
          className="container relative px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <InteractiveLearning />
        </motion.section>

        {/* Learning CTA */}
        <motion.section 
          className="w-full py-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of learners and get personalized guidance, interactive challenges, 
              and hands-on experience to accelerate your growth in tech.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" variant="default">
                <Link href="/playground">
                  Start Learning
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/playground/learning-paths">
                  View Learning Paths
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </AnimatePresence>
  );
}