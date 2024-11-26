"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFacebook, FaEnvelope, FaUser, FaPaperPlane, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/riaz37',
    icon: <FaGithub className="w-6 h-6" />,
    color: 'hover:text-[#333]'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/riaz37',
    icon: <FaLinkedin className="w-6 h-6" />,
    color: 'hover:text-[#0077b5]'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/rafi302001',
    icon: <FaFacebook className="w-6 h-6" />,
    color: 'hover:text-[#1877f2]'
  },
];

const contactInfo = [
  {
    icon: <FaEnvelope className="w-5 h-5" />,
    title: 'Email',
    value: 'contact@yourdomain.com',
    link: 'mailto:contact@yourdomain.com'
  },
  {
    icon: <FaPhone className="w-5 h-5" />,
    title: 'Phone',
    value: '+1 (123) 456-7890',
    link: 'tel:+11234567890'
  },
  {
    icon: <FaMapMarkerAlt className="w-5 h-5" />,
    title: 'Location',
    value: 'San Francisco, CA',
    link: 'https://maps.google.com'
  }
];

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          ...formData,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setErrors({ form: 'There was an error submitting the form. Please try again.' });
      }
    } catch (error) {
      setErrors({ form: 'There was an error submitting the form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">{info.title}</h3>
                  <p className="text-foreground">{info.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect with me</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-all transform hover:scale-110 ${social.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="p-6 backdrop-blur-sm bg-card/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="John Doe"
                />
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="john@example.com"
                />
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={8}
                placeholder="Your message here..."
                className="resize-none min-h-[200px]"
              />
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
            </motion.div>

            {errors.form && (
              <motion.p
                className="text-sm text-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.form}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Sending...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <FaPaperPlane className="w-4 h-4" />
                    <span>Send Message</span>
                  </span>
                )}
              </Button>
            </motion.div>

            {isSubmitted && (
              <motion.div
                className="text-center text-green-500 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Thank you! Your message has been sent successfully.
              </motion.div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ContactForm;
