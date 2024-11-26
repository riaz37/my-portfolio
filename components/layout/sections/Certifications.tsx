'use client';

import { motion } from 'framer-motion';
import { FaAws, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiCisco, SiOracle, SiRedhat } from 'react-icons/si';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useScrollSection } from '@/hooks/use-scroll-section';
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/layout/SectionTitle';

interface Certification {
  title: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl: string;
  skills: string[];
  icon: keyof typeof certificationIcons;
}

const certificationIcons = {
  aws: FaAws,
  google: FaGoogle,
  microsoft: FaMicrosoft,
  cisco: SiCisco,
  oracle: SiOracle,
  redhat: SiRedhat,
};

const certifications: Certification[] = [
  {
    title: "AWS Solutions Architect Associate",
    organization: "Amazon Web Services",
    issueDate: "2023-01-15",
    expiryDate: "2026-01-15",
    credentialId: "AWS-SAA-12345",
    verificationUrl: "https://aws.amazon.com/verification",
    skills: ["AWS", "Cloud Architecture", "Infrastructure"],
    icon: "aws",
  },
  {
    title: "Google Cloud Professional Developer",
    organization: "Google Cloud",
    issueDate: "2023-03-20",
    expiryDate: "2025-03-20",
    credentialId: "GCP-PD-67890",
    verificationUrl: "https://cloud.google.com/certification",
    skills: ["Google Cloud", "Cloud Development", "Kubernetes"],
    icon: "google",
  },
  {
    title: "Azure Solutions Architect Expert",
    organization: "Microsoft",
    issueDate: "2023-02-10",
    expiryDate: "2025-02-10",
    credentialId: "AZ-303-11111",
    verificationUrl: "https://learn.microsoft.com/certifications",
    skills: ["Azure", "Cloud Solutions", "Enterprise Architecture"],
    icon: "microsoft",
  },
];

export function Certifications() {
  const { ref, isVisible } = useScrollSection();

  return (
    <div ref={ref} className="w-full max-w-7xl mx-auto">
      <SectionTitle {...sectionTitles.certifications} />
      
      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                >
                  <div className="absolute inset-0 bg-grid-white/[0.02]" />
                </motion.div>
                
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
  );
};
