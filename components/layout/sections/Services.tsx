"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { services } from '@/data/services';
import { Code2, Globe, Database, Sparkles, Palette, Rocket } from 'lucide-react';
import { useScrollSection } from '@/hooks/use-scroll-section';
import { SectionTitle } from '@/components/shared/ui/section';
import { cn } from '@/lib/utils';

const Services = () => {
  const { ref, isVisible } = useScrollSection();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  if (!services) return null;

  return (
    <motion.section 
      id="services" 
      className="w-full py-24 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      ref={ref}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-8 right-0 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            badge="Expert Services"
            highlight="Creative"
            subtitle="Innovative solutions that push the boundaries of digital excellence."
          >
            Creative Digital Services
          </SectionTitle>

          {/* Services Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate={isVisible ? "show" : "hidden"}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="group relative"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm">
                  {/* Card Background */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-background/80 via-background/50 to-background/30 border border-white/10" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative">
                    {/* Service Icon */}
                    <div className="mb-6">
                      <div className={cn(
                        "inline-flex items-center justify-center w-16 h-16 rounded-xl",
                        "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
                        "group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent",
                        "transition-all duration-300"
                      )}>
                        {React.createElement(service.icon, {
                          className: cn(
                            "w-8 h-8 text-primary/70",
                            "group-hover:text-primary transition-colors duration-300"
                          ),
                        })}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-center gap-3 text-sm text-muted-foreground/90"
                          initial={{ opacity: 0, x: -10 }}
                          animate={isVisible ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.5 + featureIndex * 0.1 }}
                        >
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full bg-primary/30",
                            "group-hover:bg-primary/50 transition-colors duration-300"
                          )} />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Services;
