import { FaAws, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiCisco, SiOracle, SiRedhat } from 'react-icons/si';

export const certificationIcons = {
  aws: FaAws,
  google: FaGoogle,
  microsoft: FaMicrosoft,
  cisco: SiCisco,
  oracle: SiOracle,
  redhat: SiRedhat,
};

export interface Certification {
  title: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl: string;
  skills: string[];
  icon: keyof typeof certificationIcons;
}

// Add your actual certifications here
export const certifications: Certification[] = [
  // Example certification (replace with your actual certifications)
  {
    title: "Meta Front-End Developer",
    organization: "Meta",
    issueDate: "2023-01-15",
    credentialId: "META-FED-2023",
    verificationUrl: "https://www.coursera.org/account/accomplishments/professional-cert/",
    skills: ["React", "JavaScript", "Front-end Development", "Web Development"],
    icon: "microsoft", // Using microsoft icon as placeholder, you can change this
  },
];
