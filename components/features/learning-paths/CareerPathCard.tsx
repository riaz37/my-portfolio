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
        className="cursor-pointer hover:border-primary/50 transition-colors h-[300px] sm:h-[350px] md:h-[400px] flex flex-col"
        onClick={() => onClick(careerPath)}
      >
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            {Icon && <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mt-1 sm:mt-0" />}
            <div>
              <CardTitle className="text-lg sm:text-xl">{careerPath.title}</CardTitle>
              <CardDescription className="mt-1.5 sm:mt-2 text-sm sm:text-base line-clamp-2">{careerPath.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-0">
          <div className="space-y-3 sm:space-y-4">
            {/* Learning Paths Summary */}
            <div>
              <h4 className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Learning Paths:</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {careerPath.learningPaths.map((path) => (
                  <Badge key={path.id} variant="secondary" className="text-xs sm:text-sm py-0.5">
                    {path.title}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills Count */}
            <div>
              <h4 className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Total Skills:</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {careerPath.learningPaths.reduce(
                  (total, path) => total + path.skills.length,
                  0
                )}{" "}
                skills across all paths
              </p>
            </div>
          </div>

          {/* Start Learning Button */}
          <div className="mt-4 sm:mt-6">
            <Button className="w-full h-8 sm:h-10 text-sm sm:text-base">
              Start Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
