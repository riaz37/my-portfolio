'use client';

import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
}

export default function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full",
        className
      )}
    >
      <CheckCircle className="h-3 w-3" />
      <span>Verified</span>
    </div>
  );
}
