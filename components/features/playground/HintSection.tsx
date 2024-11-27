import { useState } from 'react';
import { Button } from "@/components/shared/ui/core/button";
import { Card } from "@/components/shared/ui/core/card";
import { LightbulbIcon, LockIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface HintSectionProps {
  hints: string[];
  className?: string;
}

export default function HintSection({ hints, className }: HintSectionProps) {
  const { data: session } = useSession();
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  if (!session) {
    return (
      <Card className={cn("p-6 space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LightbulbIcon className="w-5 h-5" />
            Hints
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <LockIcon className="w-12 h-12 text-muted-foreground/50" />
          <div className="space-y-2">
            <p className="text-muted-foreground">Hints are only available for logged-in users</p>
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
              Sign in to view hints
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const handleNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const handlePrevHint = () => {
    if (currentHintIndex > 0) {
      setCurrentHintIndex(prev => prev - 1);
    }
  };

  return (
    <Card className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <LightbulbIcon className="w-5 h-5" />
          Hints
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">{hints[currentHintIndex]}</p>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevHint}
                disabled={currentHintIndex === 0}
              >
                Previous Hint
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentHintIndex + 1} of {hints.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextHint}
                disabled={currentHintIndex === hints.length - 1}
              >
                Next Hint
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
