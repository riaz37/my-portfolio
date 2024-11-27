'use client';

import { CareerPath } from "@/types/learningPath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/core/card";
import { Button } from "@/components/shared/ui/core/button";
import { Badge } from "@/components/shared/ui/core/badge";
import { motion } from "framer-motion";
import * as Icons from 'react-icons/fa';
import { IconType } from "react-icons";

interface CareerPathCardProps {
  careerPath: CareerPath;
  onClick: (careerPath: CareerPath) => void;
}

export const CareerPathCard: React.FC<CareerPathCardProps> = ({ careerPath, onClick }) => {
  const Icon = (Icons as Record<string, IconType>)[careerPath.icon];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="cursor-pointer hover:border-primary/50 transition-colors h-[400px] flex flex-col"
        onClick={() => onClick(careerPath)}
      >
        <CardHeader>
          <div className="flex items-center gap-4">
            {Icon && <Icon className="w-8 h-8 text-primary" />}
            <div>
              <CardTitle>{careerPath.title}</CardTitle>
              <CardDescription className="mt-2">{careerPath.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Learning Paths Summary */}
            <div>
              <h4 className="text-sm font-medium mb-2">Learning Paths:</h4>
              <div className="flex flex-wrap gap-2">
                {careerPath.learningPaths.map((path) => (
                  <Badge key={path.id} variant="secondary">
                    {path.title}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills Count */}
            <div>
              <h4 className="text-sm font-medium mb-2">Total Skills:</h4>
              <p className="text-muted-foreground">
                {careerPath.learningPaths.reduce(
                  (total, path) => total + path.skills.length,
                  0
                )}{" "}
                skills across all paths
              </p>
            </div>
          </div>

          {/* Start Learning Button */}
          <div className="mt-6">
            <Button className="w-full">
              Start Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
