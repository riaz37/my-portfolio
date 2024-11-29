'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Textarea } from '@/components/shared/ui/core/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/core/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shared/ui/overlay/dialog';
import { Card } from '@/components/shared/ui/core/card';
import { Badge } from '@/components/shared/ui/core/badge';
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Loading } from '@/components/shared/loading';

interface Skill {
  _id: string;
  name: string;
  description: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  resources: string[];
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export default function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState<{
    name: string;
    description: string;
    icon: string;
    level: SkillLevel;
  }>({
    name: '',
    description: '',
    icon: '',
    level: 'beginner',
  });
  const { toast } = useCustomToast();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/learning-paths/skills');
      if (!response.ok) throw new Error('Failed to fetch skills');
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch skills',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/learning-paths/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillForm),
      });

      if (!response.ok) throw new Error('Failed to add skill');

      toast({
        title: "Success",
        description: "Skill added successfully"
      });
      setIsDialogOpen(false);
      setSkillForm({
        name: '',
        description: '',
        icon: '',
        level: 'beginner',
      });
      fetchSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to add skill"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(`/api/admin/learning-paths/skills/${skillId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete skill');

      toast({
        title: "Success",
        description: "Skill deleted successfully"
      });
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to delete skill"
      });
    }
  };

  if (isLoading) {
    return <Loading text="Loading skills..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaPlus className="mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Skill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <Input
                placeholder="Name"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={skillForm.description}
                onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                required
              />
              <Input
                placeholder="Icon (component name)"
                value={skillForm.icon}
                onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                required
              />
              <Select
                value={skillForm.level}
                onValueChange={(value: SkillLevel) =>
                  setSkillForm({ ...skillForm, level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Skill'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <Card key={skill._id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
                <Badge className="mt-2">{skill.level}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSkill(skill)}
                >
                  <FaEdit className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSkill(skill._id)}
                >
                  <FaTrash className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            {skill.resources.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold">Resources</h4>
                <p className="text-sm text-muted-foreground">
                  {skill.resources.length} resource(s)
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
