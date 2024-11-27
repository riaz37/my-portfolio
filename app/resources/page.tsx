'use client';

import { useState, useEffect } from 'react';
import { Loading } from '@/components/shared/loading';
import { Card, CardContent } from '@/components/shared/ui/core/card';
import { Button } from '@/components/shared/ui/core/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/core/select";
import { IResource } from '@/models/Resource';

const categories = [
  'All',
  'Programming',
  'Design',
  'Tools',
  'Frameworks',
  'Libraries',
  'Other'
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<IResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<IResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [selectedCategory, resources]);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  const filterResources = () => {
    if (selectedCategory === 'All') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(
        resources.filter((resource) => resource.category === selectedCategory)
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Loading text="Loading resources..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Learning Resources</h1>
        <p className="text-gray-600 text-center max-w-2xl mb-6">
          Explore our curated collection of resources to help you learn and grow in your development journey.
        </p>
        <div className="w-full max-w-xs">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {resource.category}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(resource.link, '_blank')}
                >
                  Visit Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No resources found in this category.
        </div>
      )}
    </div>
  );
}
