"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { services } from '@/data/services';
import { Code2, Globe, Database, Sparkles, Palette, Rocket } from 'lucide-react';
import { useScrollSection } from '@/hooks/use-scroll-section';
import { SectionTitle } from '@/components/shared/ui/layout/SectionTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Services = () => {
  const { ref, isVisible } = useScrollSection();

  if (!services) return null;

  return (
    <section 
      id="services" 
      className="py-24 relative bg-gradient-to-b from-background via-background/90 to-background" 
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          badge="What I Offer"
          title="Professional Services"
          description="End-to-end solutions for your digital needs, from concept to deployment and maintenance."
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-full p-8 rounded-2xl bg-card hover:bg-card/80 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Service Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    {React.createElement(service.icon, {
                      className: "w-7 h-7 text-primary",
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
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
