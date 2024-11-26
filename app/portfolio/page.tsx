'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { Work } from "@/components/layout/sections/Work";
import { TestimonialsSection } from "@/components/features/testimonials/TestimonialsSection";
import { GitHubStats } from "@/components/layout/sections/GitHubStats";
import { Projects } from "@/components/layout/sections/Projects";
import { Certifications } from "@/components/layout/sections/Certifications";
import { Skills } from "@/components/layout/sections/Skills";
import Services from "@/components/layout/sections/Services";
import { Button } from "@/components/ui/button";
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

          {/* Certifications */}
          <section className="py-20 bg-secondary/5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <Certifications />
          </section>

          {/* GitHub Stats */}
          <section className="py-20">
            <GitHubStats />
          </section>

          {/* Testimonials */}
          <section className="py-20 bg-secondary/5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <TestimonialsSection />
          </section>

          {/* Work Together CTA */}
          <motion.section 
            className="relative py-32 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
           
            
            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-300" />

            <div className="relative container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm mb-8"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="text-sm text-muted-foreground">Available for New Projects</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient"
                >
                  Let's Create Something Amazing Together
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
                >
                  Whether you have a project in mind or just want to explore possibilities,
                  I'm here to help turn your ideas into reality with cutting-edge technology and creative solutions.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className="relative group overflow-hidden min-w-[200px] bg-transparent border-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#FF0080] blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#FF0080] animate-gradient-x group-hover:animate-gradient-x-fast" />
                      <div className="relative bg-background/10 backdrop-blur-sm px-6 py-3 rounded-md border border-white/10 shadow-2xl">
                        <motion.span 
                          className="flex items-center justify-center gap-2 text-white font-medium"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          Start a Project
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </motion.span>
                      </div>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </AnimatePresence>
  );
}
