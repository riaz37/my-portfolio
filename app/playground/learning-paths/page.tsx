'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/shared/ui/data-display/card';
import { Button } from '@/components/shared/ui/core/button';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Input } from '@/components/shared/ui/core/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { Progress } from '@/components/shared/ui/feedback/progress';
import { CareerPathCard } from '@/components/features/learning-paths/CareerPathCard';
import { ResourceCard } from '@/components/features/learning-paths/ResourceCard';
import { CodePractice } from '@/components/features/learning-paths/CodePractice';
import { ContinueLearningBanner } from '@/components/features/learning-paths/ContinueLearningBanner';
import { careerPaths } from '@/data/careerPaths';
import { CareerPath, LearningPath, Skill, ResourceType, Resource } from '@/types/learningPath';
import { useLearningProgress } from '@/hooks/use-learning-progress';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft,
  BookOpen,
  Code, 
  Globe, 
  Server,
  Video,
  FileText,
  GraduationCap,
  Search
} from 'lucide-react';

const LearningPathsPage = () => {
  const { data: session } = useSession();
  const [selectedCareerPath, setSelectedCareerPath] = useState<CareerPath | null>(null);
  const [selectedLearningPath, setSelectedLearningPath] = useState<LearningPath | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState<ResourceType | 'all'>('all');

  const { progress, loading, markResourceComplete } = useLearningProgress(
    selectedLearningPath?.id || null
  );

  const filteredCareerPaths = careerPaths.filter(path => 
    path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    path.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCareerPathClick = (careerPath: CareerPath) => {
    setSelectedCareerPath(careerPath);
    setSelectedLearningPath(null);
    setSelectedSkill(null);
    setSelectedResource(null);
    setSelectedResourceType('all');
  };

  const handleLearningPathClick = (learningPath: LearningPath) => {
    setSelectedLearningPath(learningPath);
    setSelectedSkill(null);
    setSelectedResource(null);
    setSelectedResourceType('all');
  };

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setSelectedResource(null);
    setSelectedResourceType('all');
  };

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleBack = () => {
    if (selectedResource) {
      setSelectedResource(null);
    } else if (selectedSkill) {
      setSelectedSkill(null);
    } else if (selectedLearningPath) {
      setSelectedLearningPath(null);
    } else {
      setSelectedCareerPath(null);
    }
    setSelectedResourceType('all');
  };

  const filteredResources = selectedSkill?.resources.filter(resource =>
    selectedResourceType === 'all' ? true : resource.type === selectedResourceType
  ) || [];

  const resourcesWithProgress = filteredResources.map(resource => ({
    ...resource,
    completed: progress?.completedResources?.some(
      r => r.resourceId === resource.id && r.skillId === selectedSkill?.id
    ) || false
  }));

  return (
    <div className="container py-16 space-y-12">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(selectedCareerPath || selectedLearningPath || selectedSkill || selectedResource) && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h1 className="text-3xl font-bold">
            {selectedResource ? selectedResource.title :
             selectedSkill ? selectedSkill.name :
             selectedLearningPath ? selectedLearningPath.title :
             selectedCareerPath ? selectedCareerPath.title :
             'Learning Paths'}
          </h1>
        </div>
        {!selectedSkill && !selectedResource && (
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        )}
      </div>

      {/* Progress Banner */}
      {selectedLearningPath && session?.user && (
        <div className="max-w-3xl mx-auto">
          <ContinueLearningBanner
            learningPath={selectedLearningPath}
            progress={progress}
            loading={loading}
          />
        </div>
      )}

      {/* Resource Type Tabs */}
      {selectedSkill && (
        <Tabs value={selectedResourceType} onValueChange={(value) => setSelectedResourceType(value as ResourceType | 'all')}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="article" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="course" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Practice
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {selectedResource ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {selectedResource.type === 'practice' ? (
              <CodePractice resource={selectedResource} />
            ) : (
              <div className="max-w-3xl mx-auto">
                <ResourceCard 
                  resource={{
                    ...selectedResource,
                    completed: progress?.completedResources?.some(
                      r => r.resourceId === selectedResource.id && r.skillId === selectedSkill?.id
                    ) || false
                  }}
                  showProgress={!!session?.user}
                  onToggleComplete={
                    selectedSkill ? 
                    (completed) => markResourceComplete(selectedResource.id, selectedSkill.id, completed) :
                    undefined
                  }
                />
              </div>
            )}
          </motion.div>
        ) : !selectedCareerPath ? (
          // Career Paths Grid
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCareerPaths.map((path) => (
              <CareerPathCard
                key={path.id}
                careerPath={path}
                onClick={handleCareerPathClick}
              />
            ))}
          </motion.div>
        ) : !selectedLearningPath ? (
          // Learning Paths Grid
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          >
            {selectedCareerPath.learningPaths.map((path) => (
              <Card
                key={path.id}
                className="cursor-pointer hover:border-primary/50 transition-colors p-6"
                onClick={() => handleLearningPathClick(path)}
              >
                <div className="flex flex-col min-h-[300px]">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                    <p className="text-muted-foreground mb-4">{path.description}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between pt-4 border-t mb-4">
                      <Badge variant="outline">{path.estimatedTime}</Badge>
                      <Badge variant={
                        path.difficulty === 'beginner' ? 'secondary' :
                        path.difficulty === 'intermediate' ? 'default' : 'destructive'
                      }>{path.difficulty}</Badge>
                    </div>
                    <Button className="w-full">Start Learning</Button>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        ) : !selectedSkill ? (
          // Skills Grid
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          >
            {selectedLearningPath.skills.map((skill) => (
              <Card
                key={skill.id}
                className="cursor-pointer hover:border-primary/50 transition-colors p-6 flex flex-col h-full"
                onClick={() => handleSkillClick(skill)}
              >
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                  <p className="text-muted-foreground mb-4">{skill.description}</p>
                </div>
                <div className="mt-auto pt-4 border-t">
                  <Badge variant={
                    skill.level === 'beginner' ? 'secondary' :
                    skill.level === 'intermediate' ? 'default' : 'destructive'
                  }>{skill.level}</Badge>
                </div>
              </Card>
            ))}
          </motion.div>
        ) : (
          // Resources Grid
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resourcesWithProgress.map((resource) => (
              <div key={resource.id} onClick={() => handleResourceClick(resource)}>
                <ResourceCard 
                  resource={resource}
                  showProgress={!!session?.user}
                  onToggleComplete={
                    (completed) => markResourceComplete(resource.id, selectedSkill.id, completed)
                  }
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningPathsPage;
