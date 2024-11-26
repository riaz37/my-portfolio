"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { NewsletterSubscribe } from '@/components/common/footer/NewsletterSubscribe';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: FaGithub,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: FaLinkedin,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/yourusername',
    icon: FaTwitter,
  },
];

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="py-16 mt-20 bg-background border-t"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* About */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-5"
          >
            <h3 className="text-sm font-semibold leading-6 mb-4">About</h3>
            <p className="text-sm text-muted-foreground">
              I'm a full-stack developer passionate about building innovative web applications 
              and exploring new technologies. Let's create something amazing together!
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-3"
          >
            <h3 className="text-sm font-semibold leading-6 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-4 lg:col-start-9"
          >
            <NewsletterSubscribe />
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-12 pt-8 border-t text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-lg font-mono">
            Designed & Built by{' '}
            <span className="text-primary font-bold">
              Riazul Islam
            </span>{' '}
            <span className="animate-pulse inline-block">🚀</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()} Riazul Islam. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;