'use client';

import { motion } from "framer-motion";
import { QuoteIcon, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/shared/ui/core/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating?: number;
}

const variants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export function TestimonialCard({ 
  name, 
  role, 
  company, 
  image, 
  content,
  rating = 5 
}: TestimonialCardProps) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{name ? name.charAt(0) : 'N/A'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{role} at {company}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <QuoteIcon className="h-8 w-8 text-primary/20 mb-4" />
          <p className="text-muted-foreground">{content}</p>
        </CardContent>
        <CardFooter>
          <div className="flex gap-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
