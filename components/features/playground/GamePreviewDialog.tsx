'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/overlay/dialog';
import GamePreview from './GamePreview';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { ScrollArea } from '@/components/shared/ui/layout/scroll-area';

interface Game {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  imageUrl: string;
  gameUrl: string;
  instructions: string[];
  controls: {
    key: string;
    action: string;
  }[];
  features: string[];
}

interface GamePreviewDialogProps {
  game: Game | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GamePreviewDialog({
  game,
  open,
  onOpenChange,
}: GamePreviewDialogProps) {
  if (!game) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {game.title}
            <Badge variant="outline">{game.difficulty}</Badge>
            <Badge>{game.category}</Badge>
          </DialogTitle>
          <DialogDescription>{game.description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col gap-4">
          {/* Game Preview */}
          <GamePreview
            gameUrl={game.gameUrl}
            title={game.title}
            className="flex-1"
          />

          {/* Game Info */}
          <ScrollArea className="flex-1 px-4">
            {/* Instructions */}
            {game.instructions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {game.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Controls */}
            {game.controls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Controls</h3>
                <div className="grid grid-cols-2 gap-2">
                  {game.controls.map((control, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded border"
                    >
                      <Badge variant="outline" className="min-w-[80px] justify-center">
                        {control.key}
                      </Badge>
                      <span>{control.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {game.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  {game.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
