'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { Work } from "@/components/layout/sections/Work";
import { TestimonialsSection } from "@/components/features/testimonials/TestimonialsSection";
import { GitHubStats } from "@/components/layout/sections/GitHubStats";
import { Projects } from "@/components/layout/sections/Projects";
import { Certifications } from "@/components/layout/sections/Certifications";
import { Skills } from "@/components/layout/sections/Skills";
import Services from "@/components/layout/sections/Services";
import { Button } from "@/components/shared/ui/core/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2 } from "lucide-react";
import { MouseScroll } from '@/components/shared/ui/mouse-scroll';
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  return (
    <AnimatePresence>
      <div className="min-h-screen">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative"
              >
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl pb-1 relative z-10">
                  <span className="inline-block animate-gradient-x bg-gradient-to-r from-violet-500 via-primary to-violet-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                    My
                  </span>
                  <span className="inline-block animate-gradient-x bg-gradient-to-r from-blue-500 via-primary to-blue-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                    Portfolio
                  </span>
                </h1>
                <div className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-violet-500/20 via-primary/20 to-blue-500/20 blur-2xl opacity-50 animate-pulse" />
              </motion.div>
            </div>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Explore my projects, skills, and achievements. From web applications to design systems,
              discover how I bring ideas to life through code and creativity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 justify-center"
            >
              <div className="flex items-center gap-2 text-muted-foreground backdrop-blur-sm px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Available for Work
              </div>
              <div className="flex items-center gap-2 text-muted-foreground backdrop-blur-sm px-4 py-2 rounded-full bg-secondary/5 border border-secondary/10">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                Open to Collaboration
              </div>
            </motion.div>

            {/* Mouse Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MouseScroll />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {/* Top CTA Button */}
            <div className="flex justify-center pt-8">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="relative group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors"
                >
                  <span className="relative flex items-center gap-2">
                    Let's Work Together
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </span>
                </Button>
              </Link>
            </div>

            {/* Skills */}
            <section className="py-20">
              <Skills />
            </section>

            {/* Services */}
            <section className="py-20 bg-secondary/5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              <Services />
            </section>

            {/* Work Experience */}
            <section className="py-20">
              <Work />
            </section>

            {/* Projects */}
            <section className="py-20">
              <Projects />
            </section>

            {/* GitHub Stats */}
            <section className="py-20 bg-secondary/5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              <GitHubStats />
            </section>

            {/* Certifications */}
            <section className="py-20">
              <Certifications />
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-secondary/5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              <TestimonialsSection />
            </section>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
