'use client';

import { createElement, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import CareerPathsTab from './components/CareerPathsTab';
import LearningPathsTab from './components/LearningPathsTab';
import SkillsTab from './components/SkillsTab';
import ResourcesTab from './components/ResourcesTab';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { CareerPath, LearningPath, Skill, Resource, ResourceType, SkillLevel } from '@/types/learningPath';
import { Loading } from '@/components/shared/loading';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';

const RESOURCE_TYPES: ResourceType[] = ['video', 'article', 'documentation', 'course', 'practice'];
const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function LearningPathsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useCustomToast();
  
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

      toast({
        title: 'Success',
        description: 'Career path created successfully',
        variant: 'success',
      });
      setIsDialogOpen(false);
      // Reset form and refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create career path',
        variant: 'error',
      });
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

      toast({
        title: 'Success',
        description: 'Learning path created successfully',
        variant: 'success',
      });
      setIsDialogOpen(false);
      // Reset form and refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create learning path',
        variant: 'error',
      });
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

      toast({
        title: 'Success',
        description: 'Skill created successfully',
        variant: 'success',
      });
      setIsDialogOpen(false);
      // Reset form and refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create skill',
        variant: 'error',
      });
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

      toast({
        title: 'Success',
        description: 'Resource created successfully',
        variant: 'success',
      });
      setIsDialogOpen(false);
      // Reset form and refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create resource',
        variant: 'error',
      });
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
    <div className="container mx-auto py-8">
      {loading ? (
        <Loading text="Loading learning paths..." />
      ) : (
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
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
              <Tab.Panel key={idx}>
                {createElement(tab.component)}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      )}
    </div>
  );
}

export default LearningPathsPage;
