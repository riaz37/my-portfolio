'use client';

import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/shared/ui/core/badge';
import { Card } from '@/components/shared/ui/core/card';
import { useScrollSection } from '@/hooks/use-scroll-section';
import { sectionTitles } from '@/lib/config/section-titles';
import { SectionTitle } from '@/components/shared/ui/section';
import { Loading } from '@/components/shared/loading';
import { useToast } from '@/components/shared/ui/toast';
import useSWR from 'swr';
import { FaAward, FaCertificate, FaMedal, FaTrophy } from 'react-icons/fa';

interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl: string;
  category: string;
  description?: string;
  skills: string[];
  featured: boolean;
}

const certificationIcons: { [key: string]: any } = {
  'award': FaAward,
  'certificate': FaCertificate,
  'medal': FaMedal,
  'trophy': FaTrophy,
};

const fetcher = async (url: string) => {
  try {
    console.group('🚀 Certificate Fetcher Debug');
    console.log('🌐 Fetching URL:', url);
    console.log('🕒 Timestamp:', new Date().toISOString());
    
    const fullUrl = `${window.location.origin}${url}`;
    console.log('📍 Full URL:', fullUrl);

    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    });

    console.log('📡 Fetch Response Status:', res.status);
    console.log('📋 Response Headers:', Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Certificates Fetch Error:', {
        status: res.status,
        statusText: res.statusText,
        errorText
      });
      throw new Error(`Failed to fetch certificates: ${errorText}`);
    }

    const data = await res.json();
    
    console.log('📦 Raw Data:', data);
    console.log('🔢 Total Certificates:', data.length);
    console.log('⭐ Featured Certificates:', data.filter((c: Certificate) => c.featured));
    console.groupEnd();

    return data;
  } catch (error) {
    console.error('🚨 Fetch Certificates Error:', error);
    throw error;
  }
};

export function Certifications() {
  const { ref, isVisible } = useScrollSection();
  const { toast } = useToast();
  const { 
    data: certificates, 
    error, 
    isLoading 
  } = useSWR<Certificate[]>('/api/certificates?featured=true', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 3600000, // 1 hour
    onError: (err) => {
      console.error('SWR Certificates Error:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch certificates. Please try again later.',
        variant: 'error',
      });
    }
  });

  const certificatesToShow = useMemo(() => {
    if (!certificates) return [];
    const featured = certificates.filter(cert => cert.featured);
    return featured.length > 0 ? featured : certificates;
  }, [certificates]);

  if (isLoading) {
    return (
      <section className="py-20" ref={ref}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            highlight="Certifications"
            badge="Achievements"
            subtitle="Professional certifications and credentials that validate my expertise."
            showDecoration={true}
            className="mb-12"
            align="center"
          >
            Certifications
          </SectionTitle>
          <div className="flex justify-center items-center min-h-[300px]">
            <Loading />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20" ref={ref}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            highlight="Certifications"
            badge="Achievements"
            subtitle="Professional certifications and credentials that validate my expertise."
            showDecoration={true}
            className="mb-12"
            align="center"
          >
            Certifications
          </SectionTitle>
          <div className="text-center text-red-500 min-h-[300px] flex flex-col justify-center items-center">
            <p>Failed to load certificates</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          highlight="Certifications"
          badge="Achievements"
          subtitle="Professional certifications and credentials that validate my expertise."
          showDecoration={true}
          className="mb-12"
          align="center"
        >
          Certifications
        </SectionTitle>
      
        {(!certificates || certificates.length === 0) ? (
          <div className="text-center text-muted-foreground min-h-[300px] flex flex-col justify-center items-center">
            <p>No certificates found</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {certificatesToShow.map((certificate) => {
              const IconComponent = certificationIcons[certificate.category.toLowerCase()] || FaCertificate;
              
              return (
                <Card 
                  key={certificate._id} 
                  className="flex flex-col justify-between p-6 space-y-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <IconComponent className="text-3xl text-primary" />
                      <Badge variant="secondary">{certificate.category}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{certificate.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{certificate.issuer}</p>
                    <p className="text-xs text-muted-foreground">{certificate.issueDate}</p>
                  </div>
                  
                  {certificate.credentialUrl && (
                    <a 
                      href={certificate.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-primary hover:underline mt-4"
                    >
                      View Credential
                    </a>
                  )}
                </Card>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
