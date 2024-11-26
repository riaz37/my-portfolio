'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/core/card';
import { Code2, ExternalLink } from 'lucide-react';

interface PracticePlatform {
  name: string;
  description: string;
  url: string;
}

const platforms: PracticePlatform[] = [
  {
    name: 'LeetCode',
    description: 'Practice coding problems and prepare for technical interviews.',
    url: 'https://leetcode.com',
  },
  {
    name: 'HackerRank',
    description: 'Solve coding challenges and improve your programming skills.',
    url: 'https://www.hackerrank.com',
  },
  {
    name: 'CodeWars',
    description: 'Master your coding skills with programming challenges.',
    url: 'https://www.codewars.com',
  },
];

export function CodePractice() {
  return (
    <section className="py-8">
      <div className="container">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="p-2 bg-primary/10 rounded-full">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Practice Coding</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground"
          >
            Enhance your coding skills with these popular practice platforms.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
                <p className="text-muted-foreground flex-grow mb-4">
                  {platform.description}
                </p>
                <Button
                  asChild
                  className="w-full"
                >
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Visit Platform
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
