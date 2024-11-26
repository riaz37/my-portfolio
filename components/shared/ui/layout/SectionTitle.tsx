import { motion } from 'framer-motion';

interface SectionTitleProps {
  badge: string;
  title: string;
  description: string;
}

export function SectionTitle({ badge, title, description }: SectionTitleProps) {
  return (
    <motion.div 
      className="text-center mb-16 relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="inline-block"
      >
        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-secondary/10 text-secondary-foreground mb-4">
          <span className="mr-2">✨</span>
          {badge}
        </span>
      </motion.div>

      <motion.h2 
        className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h2>

      <motion.p 
        className="text-muted-foreground text-lg max-w-2xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
