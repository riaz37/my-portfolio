'use client';

import { Resource } from "@/types/learningPath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/data-display/card";
import { Badge } from "@/components/shared/ui/data-display/badge";
import { Button } from "@/components/shared/ui/core/button";
import { Checkbox } from "@/components/shared/ui/core/checkbox";
import { ExternalLink, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ResourceCardProps {
  resource: Resource;
  onClick?: () => void;
  onToggleComplete?: (completed: boolean) => void;
  showProgress?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  onClick, 
  onToggleComplete,
  showProgress = true 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleComplete) {
      onToggleComplete(!resource.completed);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card 
        className={`h-full flex flex-col ${resource.url || onClick ? 'cursor-pointer hover:border-primary/50' : ''} transition-colors relative`}
        onClick={handleClick}
      >
        {showProgress && resource.completed && (
          <div className="absolute top-3 right-3">
            <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          </div>
        )}
        
        <CardHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                {resource.title}
                {resource.url && <ExternalLink className="w-4 h-4" />}
              </CardTitle>
              <CardDescription className="mt-2">
                {resource.description}
              </CardDescription>
            </div>
            {showProgress && onToggleComplete && (
              <div onClick={handleToggleComplete}>
                <Checkbox 
                  checked={resource.completed}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Provider & Duration */}
            <div className="flex items-center justify-between">
              {resource.provider && (
                <Badge variant="outline">
                  {resource.provider}
                </Badge>
              )}
              {resource.duration && (
                <Badge variant="default">
                  {resource.duration}
                </Badge>
              )}
            </div>
          </div>

          {/* Level */}
          <div className="mt-4 pt-4 border-t">
            <Badge variant={
              resource.level === 'beginner' ? 'secondary' :
              resource.level === 'intermediate' ? 'default' : 'destructive'
            }>
              {resource.level}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
