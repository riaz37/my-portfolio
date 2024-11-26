'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/core/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shared/ui/core/dialog";
import { Tab } from '@headlessui/react';
import CareerPathsTab from './components/CareerPathsTab';
import LearningPathsTab from './components/LearningPathsTab';
import SkillsTab from './components/SkillsTab';
import ResourcesTab from './components/ResourcesTab';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { CareerPath, LearningPath, Skill, Resource, ResourceType, SkillLevel } from '@/types/learningPath';

const RESOURCE_TYPES: ResourceType[] = ['video', 'article', 'documentation', 'course', 'practice'];
const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function LearningPathsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState<CareerPath | null>(null);
  const [selectedLearningPath, setSelectedLearningPath] = useState<LearningPath | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const [careerPathForm, setCareerPathForm] = useState({
    title: '',
    description: '',
    icon: '',
  });

  const [learningPathForm, setLearningPathForm] = useState({
    title: '',
    description: '',
    icon: '',
    estimatedTime: '',
    difficulty: 'beginner' as SkillLevel,
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    description: '',
    icon: '',
    level: 'beginner' as SkillLevel,
    prerequisites: '',
  });

  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    url: '',
    type: 'video' as ResourceType,
    level: 'beginner' as SkillLevel,
    duration: '',
    tags: '',
    provider: '',
    starterCode: '',
    instructions: '',
    language: '',
    solutionCode: '',
  });

  // Redirect if not admin
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/');
    return null;
  }

  const handleAddCareerPath = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/admin/learning-paths/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careerPathForm),
      });

      if (!response.ok) throw new Error('Failed to create career path');

      toast.success('Career path created successfully');
      setIsDialogOpen(false);
      // Reset form and refresh data
    } catch (error) {
      toast.error('Failed to create career path');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLearningPath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCareerPath) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/learning-paths/career/${selectedCareerPath.id}/path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(learningPathForm),
      });

      if (!response.ok) throw new Error('Failed to create learning path');

      toast.success('Learning path created successfully');
      setIsDialogOpen(false);
      // Reset form and refresh data
    } catch (error) {
      toast.error('Failed to create learning path');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLearningPath) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/learning-paths/path/${selectedLearningPath.id}/skill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...skillForm,
          prerequisites: skillForm.prerequisites.split(',').map(p => p.trim()),
        }),
      });

      if (!response.ok) throw new Error('Failed to create skill');

      toast.success('Skill created successfully');
      setIsDialogOpen(false);
      // Reset form and refresh data
    } catch (error) {
      toast.error('Failed to create skill');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/learning-paths/skill/${selectedSkill.id}/resource`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resourceForm,
          tags: resourceForm.tags.split(',').map(tag => tag.trim()),
        }),
      });

      if (!response.ok) throw new Error('Failed to create resource');

      toast.success('Resource created successfully');
      setIsDialogOpen(false);
      // Reset form and refresh data
    } catch (error) {
      toast.error('Failed to create resource');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { name: 'Career Paths', component: CareerPathsTab },
    { name: 'Learning Paths', component: LearningPathsTab },
    { name: 'Skills', component: SkillsTab },
    { name: 'Resources', component: ResourcesTab },
  ];

  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <tab.component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
