'use client';

import { useState } from 'react';
import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from '@/components/shared/ui/section';
import { Card } from '@/components/shared/ui/core/card';
import { Button } from '@/components/shared/ui/core/button';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email for confirmation.');
        setEmail('');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    }
  };

  return (
    <Section id="newsletter" className="overflow-hidden">
      <SectionHeader>
        <SectionTitle>Stay Updated</SectionTitle>
        <SectionDescription>
          Get notified about the latest features, articles, and resources.
        </SectionDescription>
      </SectionHeader>

      <SectionContent>
        <Card className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative flex gap-2"
              >
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="block w-full rounded-lg border border-input bg-transparent py-3 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </motion.div>

              {/* Status Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: message ? 1 : 0,
                  y: message ? 0 : 10 
                }}
                className={`mt-2 text-sm ${
                  status === 'error' ? 'text-destructive' : 'text-primary'
                }`}
              >
                {message}
              </motion.div>
            </div>

            {/* Privacy Notice */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-sm text-muted-foreground"
            >
              By subscribing, you agree to our{' '}
              <a href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </a>
              . Unsubscribe at any time.
            </motion.p>
          </form>
        </Card>
      </SectionContent>
    </Section>
  );
}
