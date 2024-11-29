import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  FolderCode,
  Contact,
  Star,
  Award,
  Code,
  MessageCircle,
  Server,
} from "lucide-react";

const sections = [
  { id: "skills", label: "Skills", icon: Code },
  { id: "services", label: "Services", icon: Server },
  { id: "work", label: "Experience", icon: Briefcase },
  { id: "featuredprojects", label: "Projects", icon: FolderCode },
  { id: "github", label: "GitHub", icon: Star },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "clienttestimonial", label: "Testimonials", icon: MessageCircle },
];

const QuickNavigation: React.FC = () => {
  return (
    <motion.div
      className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 flex items-center sm:block hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-white/10 backdrop-blur-sm border border-primary/20 rounded-full p-2 shadow-xl">
          <div className="flex flex-col space-y-2">
            {sections.map((section) => (
              <div
                key={section.id}
                className="group relative flex items-center"
              >
                <motion.span
                  className="
                    bg-black backdrop-blur-sm 
                    px-3 py-1 rounded-full 
                    text-xs text-primary 
                    mr-2 
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300 
                    pointer-events-none
                    absolute right-full
                  "
                >
                  {section.label}
                </motion.span>
                <motion.a
                  href={`#${section.id}`}
                  className="
                    flex items-center justify-center 
                    w-10 h-10 rounded-full 
                    bg-transparent hover:bg-primary/10 
                    transition-all duration-300 ease-in-out
                  "
                  whileHover={{
                    scale: 1.05,
                    transition: {
                      type: "tween",
                      duration: 0.2,
                    },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <section.icon
                    className="
                      w-5 h-5 text-primary/60 
                      hover:text-primary 
                      transition-colors duration-300
                    "
                  />
                </motion.a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickNavigation;
