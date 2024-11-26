'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/ui/core/button';
import { Card } from '@/components/shared/ui/data-display/card';
import { Input } from '@/components/shared/ui/form/input';
import { Textarea } from '@/components/shared/ui/form/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/core/select';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { toast } from 'sonner';
import { Plus, Trash, Save, FileCode, Users, Edit, ExternalLink } from 'lucide-react';
import { Loading } from '@/components/shared/loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shared/ui/feedback/alert-dialog";

// Types for challenges and community projects
type Challenge = {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  hints: string[];
  starterCode: {
    javascript: string;
    python: string;
  };
  testCases: {
    input: any;
    output: string;
  }[];
  createdAt: string;
};

type CommunityProject = {
  _id: string;
  name: string;
  description: string;
  stars: string;
  forks: string;
  contributors: string;
  tags: string[];
  github: string;
  website?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  goodFirstIssues: number;
  createdAt: string;
};

export default function PlaygroundAdmin() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [communityProjects, setCommunityProjects] = useState<CommunityProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Challenge | CommunityProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'challenge' | 'project' } | null>(null);

  // Challenge form state
  const [newChallenge, setNewChallenge] = useState<Partial<Challenge>>({
    title: '',
    description: '',
    difficulty: 'Easy',
    category: '',
    hints: [''],
    starterCode: {
      javascript: '',
      python: ''
    },
    testCases: [{ input: '', output: '' }]
  });

  // Community project form state
  const [newProject, setNewProject] = useState<Partial<CommunityProject>>({
    name: '',
    description: '',
    stars: '0',
    forks: '0',
    contributors: '0',
    tags: [],
    github: '',
    website: '',
    difficulty: 'beginner',
    language: '',
    goodFirstIssues: 0
  });

  // Fetch existing data
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'challenges') {
        const response = await fetch('/api/admin/playground/challenges');
        if (!response.ok) throw new Error('Failed to fetch challenges');
        const data = await response.json();
        setChallenges(data);
      } else {
        const response = await fetch('/api/admin/playground/community-projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setCommunityProjects(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit mode
  const handleEdit = (item: Challenge | CommunityProject) => {
    setEditingItem(item);
    setIsEditing(true);
    setShowForm(true);
    if ('title' in item) {
      setNewChallenge(item);
    } else {
      setNewProject(item);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string, type: 'challenge' | 'project') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint = itemToDelete.type === 'challenge' 
        ? `/api/admin/playground/challenges/${itemToDelete.id}`
        : `/api/admin/playground/community-projects/${itemToDelete.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      toast.success(`${itemToDelete.type === 'challenge' ? 'Challenge' : 'Project'} deleted successfully`);
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Handle challenge update
  const handleChallengeUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/playground/challenges/${editingItem?._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChallenge)
      });
      
      if (!response.ok) throw new Error('Failed to update challenge');
      
      toast.success('Challenge updated successfully');
      setNewChallenge({
        title: '',
        description: '',
        difficulty: 'Easy',
        category: '',
        hints: [''],
        starterCode: { javascript: '', python: '' },
        testCases: [{ input: '', output: '' }]
      });
      setShowForm(false);
      setIsEditing(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update challenge');
    }
  };

  // Handle project update
  const handleProjectUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/playground/community-projects/${editingItem?._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      
      if (!response.ok) throw new Error('Failed to update project');
      
      toast.success('Project updated successfully');
      setNewProject({
        name: '',
        description: '',
        stars: '0',
        forks: '0',
        contributors: '0',
        tags: [],
        github: '',
        website: '',
        difficulty: 'beginner',
        language: '',
        goodFirstIssues: 0
      });
      setShowForm(false);
      setIsEditing(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  // Handle challenge submission
  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/playground/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChallenge)
      });
      
      if (!response.ok) throw new Error('Failed to create challenge');
      
      toast.success('Challenge created successfully');
      setNewChallenge({
        title: '',
        description: '',
        difficulty: 'Easy',
        category: '',
        hints: [''],
        starterCode: { javascript: '', python: '' },
        testCases: [{ input: '', output: '' }]
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to create challenge');
    }
  };

  // Handle community project submission
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/playground/community-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      
      if (!response.ok) throw new Error('Failed to create project');
      
      toast.success('Project added successfully');
      setNewProject({
        name: '',
        description: '',
        stars: '0',
        forks: '0',
        contributors: '0',
        tags: [],
        github: '',
        website: '',
        difficulty: 'beginner',
        language: '',
        goodFirstIssues: 0
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to add project');
    }
  };

  if (loading) {
    return <Loading text="Loading..." />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Playground Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <div className="mb-6">
            <Button onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setIsEditing(false);
                setEditingItem(null);
                setNewChallenge({
                  title: '',
                  description: '',
                  difficulty: 'Easy',
                  category: '',
                  hints: [''],
                  starterCode: { javascript: '', python: '' },
                  testCases: [{ input: '', output: '' }]
                });
              }
            }}>
              {showForm ? 'Cancel' : 'Add New Challenge'}
            </Button>
          </div>

          {showForm ? (
            <Card className="p-6 mb-6">
              <form onSubmit={isEditing ? handleChallengeUpdate : handleChallengeSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    placeholder="Enter challenge title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    placeholder="Enter challenge description"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <Select
                      value={newChallenge.difficulty}
                      onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => 
                        setNewChallenge({ ...newChallenge, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Input
                      value={newChallenge.category}
                      onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                      placeholder="e.g., Arrays, Algorithms"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Starter Code (JavaScript)</label>
                  <Textarea
                    value={newChallenge.starterCode?.javascript}
                    onChange={(e) => setNewChallenge({
                      ...newChallenge,
                      starterCode: { ...newChallenge.starterCode, javascript: e.target.value }
                    })}
                    placeholder="Enter JavaScript starter code"
                    className="font-mono"
                    rows={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Starter Code (Python)</label>
                  <Textarea
                    value={newChallenge.starterCode?.python}
                    onChange={(e) => setNewChallenge({
                      ...newChallenge,
                      starterCode: { ...newChallenge.starterCode, python: e.target.value }
                    })}
                    placeholder="Enter Python starter code"
                    className="font-mono"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Challenge' : 'Create Challenge'}
                </Button>
              </form>
            </Card>
          ) : (
            <div className="grid gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                      <p className="text-muted-foreground mb-4">{challenge.description}</p>
                      <div className="flex gap-2 mb-4">
                        <Badge>{challenge.difficulty}</Badge>
                        <Badge variant="secondary">{challenge.category}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(challenge.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(challenge)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteClick(challenge._id, 'challenge')}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="community">
          <div className="mb-6">
            <Button onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setIsEditing(false);
                setEditingItem(null);
                setNewProject({
                  name: '',
                  description: '',
                  stars: '0',
                  forks: '0',
                  contributors: '0',
                  tags: [],
                  github: '',
                  website: '',
                  difficulty: 'beginner',
                  language: '',
                  goodFirstIssues: 0
                });
              }
            }}>
              {showForm ? 'Cancel' : 'Add New Project'}
            </Button>
          </div>

          {showForm ? (
            <Card className="p-6 mb-6">
              <form onSubmit={isEditing ? handleProjectUpdate : handleProjectSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <Input
                      value={newProject.github}
                      onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                      placeholder="https://github.com/..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <Input
                      value={newProject.website}
                      onChange={(e) => setNewProject({ ...newProject, website: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <Select
                      value={newProject.difficulty}
                      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                        setNewProject({ ...newProject, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <Input
                      value={newProject.language}
                      onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
                      placeholder="e.g., JavaScript, Python"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={newProject.tags?.join(', ')}
                    onChange={(e) => setNewProject({
                      ...newProject,
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                    placeholder="e.g., Web Development, Backend, Database"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Stars</label>
                    <Input
                      value={newProject.stars}
                      onChange={(e) => setNewProject({ ...newProject, stars: e.target.value })}
                      placeholder="e.g., 1.2k"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Forks</label>
                    <Input
                      value={newProject.forks}
                      onChange={(e) => setNewProject({ ...newProject, forks: e.target.value })}
                      placeholder="e.g., 500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Contributors</label>
                    <Input
                      value={newProject.contributors}
                      onChange={(e) => setNewProject({ ...newProject, contributors: e.target.value })}
                      placeholder="e.g., 100+"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Good First Issues</label>
                  <Input
                    type="number"
                    value={newProject.goodFirstIssues}
                    onChange={(e) => setNewProject({
                      ...newProject,
                      goodFirstIssues: parseInt(e.target.value) || 0
                    })}
                    placeholder="Number of good first issues"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Project' : 'Add Project'}
                </Button>
              </form>
            </Card>
          ) : (
            <div className="grid gap-6">
              {communityProjects.map((project) => (
                <Card key={project._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex gap-2 mb-4">
                        <Badge>{project.difficulty}</Badge>
                        <Badge variant="secondary">{project.language}</Badge>
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-4 mb-4">
                        <span>⭐ {project.stars}</span>
                        <span>🔄 {project.forks}</span>
                        <span>👥 {project.contributors}</span>
                        <span>🎯 {project.goodFirstIssues} good first issues</span>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                        >
                          GitHub <ExternalLink className="w-3 h-3" />
                        </a>
                        {project.website && (
                          <a 
                            href={project.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                          >
                            Website <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteClick(project._id, 'project')}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {itemToDelete?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
