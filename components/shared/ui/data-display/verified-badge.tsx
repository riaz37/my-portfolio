import { CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export function VerifiedBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified Account</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
