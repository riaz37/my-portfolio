import { Document } from 'mongoose';

export interface Experience extends Document {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  companyLogo?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
