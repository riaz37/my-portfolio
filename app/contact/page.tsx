'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Contact from "@/components/layout/sections/Contact";
import { FaEnvelope } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <AnimatePresence>
      <main className="relative">
        {/* Content */}
        <div className="relative">
          {/* Page Header */}
          <motion.section 
            className="py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                className="inline-block p-2 rounded-full bg-primary/10 text-primary mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <FaEnvelope className="w-6 h-6" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Let's Connect
              </motion.h1>
              
              <motion.p
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Have a question or want to work together? I'd love to hear from you.
              </motion.p>
            </div>
          </motion.section>

          {/* Contact Form Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Contact />
          </motion.section>
        </div>
      </main>
    </AnimatePresence>
  );
}
