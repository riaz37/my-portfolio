'use client';

import { Resource } from "@/types/learningPath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/core/card";
import { Badge } from "@/components/shared/ui/core/badge";
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
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs sm:text-sm py-0.5">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          </div>
        )}
        
        <CardHeader className="flex-shrink-0 pb-3 sm:pb-4">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg">
                {resource.title}
                {resource.url && <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </CardTitle>
              <CardDescription className="mt-1.5 sm:mt-2 text-sm line-clamp-2">
                {resource.description}
              </CardDescription>
            </div>
            {showProgress && onToggleComplete && (
              <div onClick={handleToggleComplete} className="pt-1">
                <Checkbox 
                  checked={resource.completed}
                  className="w-4 h-4 sm:w-5 sm:h-5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between pt-0">
          <div className="space-y-3 sm:space-y-4">
            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div>
                <h4 className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Topics:</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs sm:text-sm py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Provider & Duration */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {resource.provider && (
                <Badge variant="outline" className="text-xs sm:text-sm py-0.5">
                  {resource.provider}
                </Badge>
              )}
              {resource.duration && (
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {resource.duration}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          {(resource.url || onClick) && (
            <div className="mt-4 sm:mt-6">
              <Button 
                variant="secondary" 
                className="w-full h-8 sm:h-10 text-sm sm:text-base"
              >
                {resource.url ? 'Visit Resource' : 'View Details'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
