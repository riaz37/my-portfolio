// components/SkillsGrid.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaPython, FaDatabase, FaChartBar, FaCode, FaReact, FaJs, FaNodeJs, FaGithub } from 'react-icons/fa';
import { DiMongodb } from "react-icons/di";
import { RiNextjsFill } from "react-icons/ri";
import { BiLogoPostgresql,BiLogoTypescript } from "react-icons/bi";
import { SiNestjs, SiFramer, SiMysql} from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { TbBrandMysql } from "react-icons/tb";
const SkillsGrid = () => {
  const skills = useMemo(() => [
    { icon: <FaJs />, name: 'JavaScript' },
    { icon: <FaPython />, name: 'Python' },
    { icon: <FaReact />, name: 'React' },
    { icon: <RiTailwindCssFill />, name: 'Tailwind CSS' },
    { icon: <SiFramer />, name: 'Framer Motion' },
    { icon: <RiNextjsFill/>, name: 'Next.js' },
    { icon: <SiNestjs />, name: 'Nest.js' },
    { icon: <FaNodeJs />, name: 'Node.js' },
    { icon: <TbBrandMysql />, name: 'MySQL' },
    { icon: <BiLogoPostgresql />, name: 'PostgreSQL' },
    { icon: <DiMongodb />, name: 'MongoDB' },
    { icon: <FaGithub />, name: 'Git' },
    
  ], []);

  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 -mx-2 sm:mx-0"
    >
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          custom={index}
          variants={skillVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="bg-card text-card-foreground rounded-lg p-2 sm:p-3 text-center flex flex-col items-center justify-center"
        >
          <div className="text-2xl sm:text-3xl mb-1 text-primary">{skill.icon}</div>
          <p className="text-xs sm:text-sm font-medium">{skill.name}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SkillsGrid;
