// data/workExperience.ts
import {  FaReact} from 'react-icons/fa';
import { RiNextjsFill } from "react-icons/ri";
import { BiLogoTypescript } from "react-icons/bi";
import { SiNestjs, SiFramer} from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import React from 'react';
import { DiMongodb } from 'react-icons/di';

export interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  year: number;
  description: string[];
  skills: Skill[];
  logo: string;
}

export const workExperiences: WorkExperience[] = [

  {
    company: "Acro Nation",
    position: "Project Lead",
    duration: "October 2024 – Present",
    year: 2024,
    description: [
      "Engineered a predictive model using machine learning algorithms to forecast sales trends, enhancing decision-making accuracy and contributing to a 15% uplift in sales projections accuracy.",
      "Boosted data processing efficiency by 40% via custom Python scripts for ETL automation, ensuring precise data handling from extraction to in-depth analysis, integrating with AWS cloud.",
      "Led the team to optimize data processing workflows by 30% by migrating to AWS, enhancing both data handling efficiency and system scalability while also ensuring data accuracy.",
      "Developed a Python-based application with a Tkinter GUI for the marketing team to add and track quotes, integrating with Power BI to visually monitor progress and improve quote management efficiency.",
      "Established efficiency metrics and automated Excel dashboards using VBA scripting, which boosted the productivity and efficiency of designers and CAD technicians by over 25%.",
      "Enhanced business process efficiency and decision support by collaborating with teams to optimize data workflows and designing tailored Power BI dashboards and KPI reports, resulting in improved strategic planning across the organization."
    ],
    skills: [
      { name: "TypeScript", icon: BiLogoTypescript },
      { name: "Next.js", icon: RiNextjsFill },
      { name: "Nest.js", icon: SiNestjs },
      { name: "Tailwind", icon: RiTailwindCssFill },
      { name: "MongoDB", icon: DiMongodb },
    
    ],
    logo: "/logos/ia-flow.png"
  },
  {
    company: "Haze",
    position: "Frontend Developer",
    duration: "June 2023 – September 2024",
    year: 2023,
    description: [
      "Designed flow elements according to provided specifications using RW Miller software, improving product performance in the oil & gas sector.",
      "Managed technical quotations, effectively converting quotes to orders, demonstrating strong business communication skills.",
      "Handled client-centric reporting and documentation, ensuring tailored solutions and high customer satisfaction."
    ],
    skills: [
      { name: "React", icon: FaReact },
      { name: "Tailwind", icon: RiTailwindCssFill },
      { name: "Framer Motion", icon: SiFramer },

    ],
    logo: "/logos/ia-flow.png"
  }
];
