import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const StyledPic: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInteraction = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500); // Reset after 0.5 second
  };

  return (
    <div
      className="relative mx-auto max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] w-full aspect-square cursor-pointer flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
    >
      <motion.div
        className="wrapper relative w-full h-full rounded-lg shadow-md overflow-hidden"
        animate={isAnimating ? {
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={isAnimating ? {
            y: [0, -10, 0],
            opacity: [1, 0.8, 1],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/pics/photo.png"
            alt="Profile"
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute inset-0 border-4 border-primary rounded-lg"
        animate={isAnimating ? {
          scale: [1, 1.05, 1],
          rotate: [0, -3, 0],
        } : {}}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default StyledPic;
