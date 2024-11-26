'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/core/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/overlay/dialog';

interface SubmitSolutionButtonProps {
  challengeId: string;
  solution: string;
}

export default function SubmitSolutionButton({
  challengeId,
  solution,
}: SubmitSolutionButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/playground/${challengeId}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/playground/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId,
          solution,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit solution');
      }

      setShowDialog(true);
    } catch (error) {
      console.error('Error submitting solution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Solution'}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solution Submitted!</DialogTitle>
            <DialogDescription>
              Your solution has been successfully submitted. Would you like to try another challenge?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/playground')}
            >
              Try Another Challenge
            </Button>
            <Button
              onClick={() => setShowDialog(false)}
            >
              Keep Working
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
