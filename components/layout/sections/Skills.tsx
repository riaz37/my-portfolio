import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  FaReact, 
  FaNodeJs, 
  FaGitAlt, 
  FaDocker, 
  FaAws,
  FaJenkins
} from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiFramer,
  SiNestjs,
  SiMongodb, 
  SiPostgresql,
  SiGraphql
} from 'react-icons/si';
import { BiCodeAlt } from 'react-icons/bi';
import { BsLightningChargeFill } from 'react-icons/bs';
import { SectionTitle } from '@/components/shared/ui/section';

const skillLevelMap = {
  90: { text: 'Expert', color: '#FF6B6B' },
  85: { text: 'Advanced', color: '#4ECDC4' },
  80: { text: 'Proficient', color: '#45B7D1' },
  75: { text: 'Intermediate', color: '#96CEB4' },
  70: { text: 'Competent', color: '#88D8B0' },
};

const skills = {
  'Frontend Development': [
    { name: 'React', level: 90, icon: FaReact },
    { name: 'Next.js', level: 90, icon: SiNextdotjs },
    { name: 'TypeScript', level: 85, icon: SiTypescript },
    { name: 'Tailwind CSS', level: 90, icon: SiTailwindcss },
    { name: 'Framer Motion', level: 80, icon: SiFramer },
  ],
  'Backend Development': [
    { name: 'Node.js', level: 85, icon: FaNodeJs },
    { name: 'NestJS', level: 85, icon: SiNestjs },
    { name: 'MongoDB', level: 80, icon: SiMongodb },
    { name: 'PostgreSQL', level: 75, icon: SiPostgresql },
    { name: 'GraphQL', level: 80, icon: SiGraphql },
  ],
  'Other Skills': [
    { name: 'Git & GitHub', level: 85, icon: FaGitAlt },
    { name: 'Docker', level: 75, icon: FaDocker },
    { name: 'AWS', level: 70, icon: FaAws },
    { name: 'CI/CD Pipeline', level: 80, icon: FaJenkins },
    { name: 'Problem Solving', level: 90, icon: BsLightningChargeFill },
  ],
};

const HexagonBadge = ({ name, level, icon: Icon }: { name: string; level: number; icon: React.ElementType }) => {
  const { text, color } = skillLevelMap[level as keyof typeof skillLevelMap];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col items-center"
    >
      <div className="relative">
        {/* Hexagon shape */}
        <div className={cn(
          "w-24 h-28 relative",
          "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full",
          "before:bg-white/10 dark:before:bg-gray-800/10",
          "before:clip-path-hexagon before:transition-all before:duration-300",
          "group-hover:before:bg-white/20 dark:group-hover:before:bg-gray-800/20"
        )}>
          {/* Skill ring */}
          <svg
            className="absolute top-0 left-0 w-full h-full -rotate-90 transform"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: level / 100 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="drop-shadow-[0_0_2px_rgba(0,0,0,0.3)]"
            />
          </svg>
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Skill info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-4 text-center"
      >
        <h4 className="font-medium text-sm">{name}</h4>
        <span className="text-xs text-muted-foreground mt-1 block" style={{ color }}>
          {text}
        </span>
      </motion.div>
    </motion.div>
  );
};

const SkillCategory = ({ title, skills }: { title: string; skills: { name: string; level: number; icon: React.ElementType }[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="space-y-8"
  >
    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
      {title}
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {skills.map((skill) => (
        <HexagonBadge key={skill.name} {...skill} />
      ))}
    </div>
  </motion.div>
);

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="container">
        <SectionTitle 
          highlight="Skills"
          subtitle="A comprehensive overview of my technical expertise and proficiency levels."
          showDecoration={false}
        >
          Technical Skills
        </SectionTitle>
        
        <div className="mt-12 space-y-16">
          {Object.entries(skills).map(([category, categorySkills]) => (
            <SkillCategory key={category} title={category} skills={categorySkills} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            I'm always learning and exploring new technologies to stay at the forefront of web development.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
