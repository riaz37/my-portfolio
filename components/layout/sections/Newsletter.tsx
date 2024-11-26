'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/shared/ui/core/input';
import { Button } from '@/components/shared/ui/core/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FaNewspaper } from 'react-icons/fa';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully subscribed to the newsletter!');
        setEmail('');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error: any) {
      if (error.code === 11000) {
        toast.error('Email already subscribed');
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-6 text-base text-muted-foreground flex items-center gap-2">
              <FaNewspaper className="w-4 h-4" />
              Stay Updated
            </span>
          </div>
        </div>
        
        <motion.div 
          className="mx-auto mt-12 max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Subscribe to My Newsletter
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Get the latest updates about web development, AI, and tech delivered straight to your inbox.
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-md gap-x-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex-grow">
            <Input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full",
                loading && "opacity-50 cursor-not-allowed"
              )}
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className={cn(
              "flex-none text-black",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </motion.form>

        <motion.p
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          No spam, unsubscribe at any time.
        </motion.p>
      </div>
    </section>
  );
}
