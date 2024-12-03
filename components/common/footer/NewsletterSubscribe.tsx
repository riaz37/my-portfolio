'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { FaPaperPlane, FaEnvelope } from 'react-icons/fa';

export function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const { toast } = useCustomToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast("error", "Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast("success", "Success", data.message || "Successfully subscribed to the newsletter!");
        setEmail('');
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error: any) {
      toast("error", "Error", error.message || "Failed to subscribe to newsletter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg -z-10"
        style={{
          filter: 'blur(40px)',
          transform: 'translate3d(0, 0, 0)', // Forces GPU acceleration
        }}
      />

      <div className="relative p-6 rounded-lg border bg-background/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-2 mb-4"
        >
          <div className="p-2 bg-primary/10 rounded-full">
            <FaEnvelope className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold leading-6">
            Subscribe to Newsletter
          </h3>
        </motion.div>

        <motion.p 
          className="text-sm text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Get the latest updates about web development, AI, and tech delivered straight to your inbox.
        </motion.p>

        <motion.form 
          onSubmit={handleSubmit} 
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full pl-10 bg-background/80 backdrop-blur-sm"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={loading}
              required
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>

          <motion.div
            initial={false}
            animate={{
              scale: focused ? 1.05 : 1,
              transition: { duration: 0.2 }
            }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? (
                'Subscribing...'
              ) : (
                <>
                  Subscribe <FaPaperPlane className="ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>

        <motion.p 
          className="mt-3 text-xs text-muted-foreground flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <span className="inline-block w-4 h-px bg-muted-foreground/30" />
          No spam, unsubscribe at any time
        </motion.p>
      </div>
    </motion.div>
  );
}
