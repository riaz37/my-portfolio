"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFacebook, FaEnvelope, FaUser, FaPaperPlane, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/shared/ui/core/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/shared/ui/core/card';

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
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Contact Information */}
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-3 sm:p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-medium text-xs sm:text-sm text-muted-foreground">{info.title}</h3>
                  <p className="text-sm sm:text-base text-foreground">{info.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Connect with me</h3>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 sm:p-3 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-all transform hover:scale-110 ${social.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6">
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-1.5 sm:space-y-2"
            >
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium">Name</label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-9 sm:pl-10 text-sm sm:text-base"
                  placeholder="John Doe"
                />
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1.5 sm:space-y-2"
            >
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium">Email</label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 sm:pl-10 text-sm sm:text-base"
                  placeholder="john@example.com"
                />
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1.5 sm:space-y-2"
            >
              <label htmlFor="message" className="block text-xs sm:text-sm font-medium">Message</label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Your message here..."
                className="resize-none min-h-[150px] sm:min-h-[200px] text-sm sm:text-base"
              />
              {errors.message && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.message}</p>}
            </motion.div>

            {errors.form && (
              <motion.p
                className="text-xs sm:text-sm text-red-500"
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
                className="w-full h-9 sm:h-10 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <motion.div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Sending...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <FaPaperPlane className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Send Message</span>
                  </span>
                )}
              </Button>
            </motion.div>

            {isSubmitted && (
              <motion.div
                className="text-center text-xs sm:text-sm text-green-500 mt-3 sm:mt-4"
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
