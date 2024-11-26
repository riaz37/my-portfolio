import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const HeroTitle = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center mb-8 relative"
  >
    <div className="relative w-32 h-32 mx-auto mb-6">
      <Image
        src="/hero/hero-image.jpg" // Update this with your actual image name
        alt="Riazul Islam"
        fill
        className="rounded-full object-cover"
        priority
      />
    </div>
    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">Riazul Islam</h1>
    <h2 className="text-xl md:text-2xl text-foreground">Full Stack Web Developer</h2>
  </motion.div>
);

export default HeroTitle;
