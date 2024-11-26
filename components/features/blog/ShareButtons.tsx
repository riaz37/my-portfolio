"use client";

import { motion } from "framer-motion";
import { FaTwitter, FaLinkedin, FaFacebook, FaLink } from "react-icons/fa";
import { useToast } from '@/components/shared/ui/feedback/use-toast';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      icon: <FaTwitter className="w-5 h-5" />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-5 h-5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-[#0077B5]",
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="w-5 h-5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#4267B2]",
    },
  ];

  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
        duration: 3000,
      });
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="flex items-center gap-4 my-8">
      <span className="text-sm text-muted-foreground">Share:</span>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full hover:bg-accent transition-colors ${link.color}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Share on ${link.name}`}
          >
            {link.icon}
          </motion.a>
        ))}
        <motion.button
          onClick={copyToClipboard}
          className="p-2 rounded-full hover:bg-accent transition-colors hover:text-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Copy link"
        >
          <FaLink className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
