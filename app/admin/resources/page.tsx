'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/data-display/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/core/select";
import { toast } from 'react-hot-toast';
import { FiExternalLink, FiPlus, FiTrash2, FiCode } from 'react-icons/fi';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Loading } from '@/components/shared/loading';
import { careerPaths } from '@/data/careerPaths';

interface Resource {
  _id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'documentation' | 'course' | 'practice';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  tags: string[];
  provider?: string;
  starterCode?: string;
  instructions?: string;
  language?: string;
  solutionCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourceType {
  id: string;
  title: string;
}

interface SkillLevel {
  id: string;
  title: string;
}

const resourceTypes: ResourceType[] = ['documentation', 'video', 'article', 'course', 'practice'];
const skillLevels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

export default function ResourceManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingResources, setFetchingResources] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [selectedCareerPath, setSelectedCareerPath] = useState(careerPaths[0].id);
  const [selectedLearningPath, setSelectedLearningPath] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  
  const [formData, setFormData] = useState<Partial<Resource>>({
    title: '',
    description: '',
    type: 'documentation',
    tags: [],
    level: 'beginner',
    url: '',
    duration: '',
    provider: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (selectedCareerPath && selectedLearningPath && selectedSkill) {
      fetchResources();
    }
  }, [selectedCareerPath, selectedLearningPath, selectedSkill]);

  const fetchResources = async () => {
    setFetchingResources(true);
    try {
      const careerPath = careerPaths.find(cp => cp.id === selectedCareerPath);
      const learningPath = careerPath?.learningPaths.find(lp => lp.id === selectedLearningPath);
      const skill = learningPath?.skills.find(s => s.id === selectedSkill);
      
      if (skill) {
        setResources(skill.resources);
      }
    } catch (error) {
      toast.error('Failed to fetch resources');
    }
    setFetchingResources(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newResource: Resource = {
        _id: Math.random().toString(36).substr(2, 9),
        ...formData as Resource
      };

      // Update the resources in the careerPaths data structure
      const careerPath = careerPaths.find(cp => cp.id === selectedCareerPath);
      const learningPath = careerPath?.learningPaths.find(lp => lp.id === selectedLearningPath);
      const skill = learningPath?.skills.find(s => s.id === selectedSkill);

      if (skill) {
        skill.resources.push(newResource);
        setResources([...skill.resources]);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'documentation',
          tags: [],
          level: 'beginner',
          url: '',
          duration: '',
          provider: '',
        });
        
        toast.success('Resource added successfully');
      }
    } catch (error) {
      toast.error('Failed to add resource');
    }

    setLoading(false);
  };

  const handleDelete = async (resourceId: string) => {
    try {
      const careerPath = careerPaths.find(cp => cp.id === selectedCareerPath);
      const learningPath = careerPath?.learningPaths.find(lp => lp.id === selectedLearningPath);
      const skill = learningPath?.skills.find(s => s.id === selectedSkill);

      if (skill) {
        skill.resources = skill.resources.filter(r => r._id !== resourceId);
        setResources([...skill.resources]);
        toast.success('Resource deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  if (status === 'loading' || loading) {
    return <Loading text="Loading resources..." />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Resource Management</h1>
        
        {/* Path Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            value={selectedCareerPath}
            onValueChange={setSelectedCareerPath}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Career Path" />
            </SelectTrigger>
            <SelectContent>
              {careerPaths.map(path => (
                <SelectItem key={path.id} value={path.id}>
                  {path.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedLearningPath}
            onValueChange={setSelectedLearningPath}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Learning Path" />
            </SelectTrigger>
            <SelectContent>
              {careerPaths
                .find(cp => cp.id === selectedCareerPath)
                ?.learningPaths.map(path => (
                  <SelectItem key={path.id} value={path.id}>
                    {path.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSkill}
            onValueChange={setSelectedSkill}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Skill" />
            </SelectTrigger>
            <SelectContent>
              {careerPaths
                .find(cp => cp.id === selectedCareerPath)
                ?.learningPaths
                .find(lp => lp.id === selectedLearningPath)
                ?.skills.map(skill => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Resource Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={formData.type}
                  onValueChange={(value: ResourceType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.level}
                  onValueChange={(value: SkillLevel) => setFormData(prev => ({ ...prev, level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="URL"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Duration (e.g., 2 hours)"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />

                <Input
                  placeholder="Provider (e.g., Udemy)"
                  value={formData.provider}
                  onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button type="button" onClick={addTag}>
                  <FiPlus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} <FiTrash2 className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>

              {formData.type === 'practice' && (
                <>
                  <Textarea
                    placeholder="Instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Starter Code"
                    value={formData.starterCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, starterCode: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Solution Code"
                    value={formData.solutionCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, solutionCode: e.target.value }))}
                  />
                </>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Resource'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resources List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Resources</h2>
          {fetchingResources ? (
            <Loading text="Loading resources..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <Card key={resource._id} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(resource._id)}
                      >
                        <FiTrash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Badge variant={
                          resource.level === 'beginner' ? 'secondary' :
                          resource.level === 'intermediate' ? 'default' : 'destructive'
                        }>{resource.level}</Badge>
                        {resource.duration && (
                          <Badge variant="outline">{resource.duration}</Badge>
                        )}
                      </div>

                      {(resource.tags?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(resource.tags || []).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {resource.provider && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          Provider: {resource.provider}
                        </p>
                      )}

                      {resource.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <FiExternalLink className="w-4 h-4 mr-2" />
                          Open Resource
                        </Button>
                      )}

                      {resource.type === 'practice' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          <FiCode className="w-4 h-4 mr-2" />
                          View Practice
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
