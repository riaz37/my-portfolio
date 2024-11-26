import { motion } from 'framer-motion';

export function MouseScroll() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="relative">
        {/* Mouse outline */}
        <motion.div 
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center p-1 backdrop-blur-sm bg-background/50"
        >
          {/* Scrolling dot */}
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
