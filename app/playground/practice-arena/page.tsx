'use client';

import { motion } from 'framer-motion';

export default function PracticeArena() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-8 text-center"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Practice Arena
        </motion.h1>
        <p className="text-xl text-muted-foreground mb-8">
          A powerful live code editor supporting multiple programming languages, 
          designed to help you practice and improve your coding skills.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['Python', 'C++', 'Java', 'JavaScript', 'Rust', 'Go', 'PHP', 'C#'].map((lang, i) => (
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-lg bg-secondary/50 backdrop-blur-sm"
            >
              {lang}
            </motion.div>
          ))}
        </div>
        <motion.p 
          className="text-2xl font-semibold text-blue-500"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Coming Soon
        </motion.p>
      </motion.div>
    </div>
  );
}