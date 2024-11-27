'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/shared/ui/core/badge';
import { Card } from '@/components/shared/ui/core/card';
import { useScrollSection } from '@/hooks/use-scroll-section';
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/section';
import { certifications, certificationIcons, type Certification } from '@/data/certifications';

export function Certifications() {
  const { ref, isVisible } = useScrollSection();

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <SectionTitle 
          highlight="Achievements"
          badge="Certifications"
          subtitle="Professional certifications and accomplishments that showcase my expertise."
          showDecoration={true}
        >
          My Certifications
        </SectionTitle>
        
        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {certifications.map((cert, index) => {
            const Icon = certificationIcons[cert.icon];
            return (
              <motion.div
                key={cert.credentialId}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="p-6 relative">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-primary text-2xl">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">{cert.organization}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                      {cert.expiryDate && (
                        <p>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                      )}
                    </div>

                    {/* Credential ID */}
                    <div className="text-sm mb-4">
                      <span className="text-muted-foreground">Credential ID: </span>
                      <span className="font-mono">{cert.credentialId}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cert.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-secondary/10">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Verification Link */}
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Verify Credential →
                    </a>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
