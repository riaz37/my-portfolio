import { FaReact, FaNodeJs, FaPython, FaDatabase, FaLinkedin, FaSyncAlt } from 'react-icons/fa';
import { RiNextjsFill } from 'react-icons/ri';
import { SiTypescript, SiMongodb, SiTensorflow, SiPostgresql } from 'react-icons/si';

export interface Skill {
  name: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  technologies: string[];
  featured?: boolean;
  demo?: string;
  github?: string;
  image?: string;
  skills: Skill[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Acro Nation Website",
    description: "An IT firm website created using React and Next.js. It showcases their services, portfolio, and contact information.",
    icon: RiNextjsFill,
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "GSAP"],
    featured: true,
    demo: "https://acronation.net",
    image: "/projects/acronation.png",
    skills: [
      { name: "Full Stack Development" },
      { name: "UI/UX Design" },
      { name: "Responsive Web Design" },
      { name: "Performance Optimization" }
    ]
  },
  {
    id: 2,
    title: "Animated 3D E-Commerce",
    description: "A comprehensive 3D project that showcases a dynamic e-commerce website with interactive animations and immersive product displays.",
    icon: RiNextjsFill,
    technologies: ["Next.js", "JavaScript", "TailwindCSS", "GSAP", "Prismic"],
    featured: true,
    demo: "https://fizzi37.vercel.app",
    image: "/projects/ecommerce.png",
    skills: [
      { name: "3D Animation" },
      { name: "Interactive Design" },
      { name: "Performance Optimization" },
      { name: "User Experience" }
    ]
  },
  {
    id: 3,
    title: "Personal Portfolio",
    description: "A modern portfolio website built with Next.js and Framer Motion, featuring smooth animations and a clean design.",
    icon: FaReact,
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/riaz37/portfolio-website",
    image: "/projects/portfolio.png",
    skills: [
      { name: "Frontend Development" },
      { name: "UI/UX Design" },
      { name: "Animation" }
    ]
  },
  {
    id: 4,
    title: "Task Management API",
    description: "A RESTful API for task management built with Node.js and Express, featuring authentication and real-time updates.",
    icon: FaNodeJs,
    technologies: ["Node.js", "Express", "MongoDB", "WebSocket"],
    github: "https://github.com/riaz37/task-management-api",
    skills: [
      { name: "Backend Development" },
      { name: "API Design" },
      { name: "Database Management" }
    ]
  },
  {
    id: 5,
    title: "AI Image Generator",
    description: "A machine learning project that generates images using stable diffusion models and Python.",
    icon: FaPython,
    technologies: ["Python", "PyTorch", "TensorFlow", "OpenCV"],
    github: "https://github.com/riaz37/ai-image-generator",
    skills: [
      { name: "Machine Learning" },
      { name: "Computer Vision" },
      { name: "Python Development" }
    ]
  }
];
