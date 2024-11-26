import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/shared/ui/core/button';
import { Avatar, AvatarImage } from '@/components/shared/ui/data-display/avatar';
import { cn } from '@/lib/utils';

const avatarOptions = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
  '/avatars/avatar7.png',
  '/avatars/avatar8.png',
  // Add more avatar options as needed
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => Promise<void>;
}

export function AvatarSelector({ currentAvatar, onAvatarChange }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAvatarChange = async () => {
    try {
      setIsUpdating(true);
      await onAvatarChange(selectedAvatar);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-0 h-auto hover:bg-transparent"
          onClick={() => setSelectedAvatar(currentAvatar)}
        >
          <Avatar className="h-20 w-20 border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <AvatarImage src={currentAvatar} alt="Your avatar" />
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your avatar</DialogTitle>
          <DialogDescription>
            Select a new avatar to represent you on the leaderboard
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {avatarOptions.map((avatar) => (
            <motion.button
              key={avatar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAvatar(avatar)}
              className="relative rounded-full overflow-hidden"
            >
              <Avatar className={cn(
                "h-16 w-16 border-2",
                selectedAvatar === avatar 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-transparent"
              )}>
                <AvatarImage src={avatar} alt="Avatar option" />
              </Avatar>
              {selectedAvatar === avatar && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Check className="h-6 w-6 text-primary" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleAvatarChange}
            disabled={selectedAvatar === currentAvatar || isUpdating}
          >
            <Check className="mr-2 h-4 w-4" />
            {isUpdating ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
