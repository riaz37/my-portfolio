'use client';

import React, { useState } from 'react';
import { Avatar, AvatarImage } from './avatar';
import { Button } from '../core/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../overlay/dialog';
import { cn } from '@/lib/utils';

const AVATAR_OPTIONS = [
  '/avatars/avatar-1.png',
  '/avatars/avatar-2.png',
  '/avatars/avatar-3.png',
  '/avatars/avatar-4.png',
  '/avatars/avatar-5.png',
  '/avatars/avatar-6.png',
  '/avatars/avatar-7.png',
  '/avatars/avatar-8.png',
  '/avatars/avatar-9.png',
  '/avatars/avatar-10.png',
];

interface AvatarSelectorProps {
  currentAvatar?: string;
  onSelect?: (avatarUrl: string) => void;
  className?: string;
}

export function AvatarSelector({ currentAvatar, onSelect, className }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || AVATAR_OPTIONS[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    onSelect?.(avatarUrl);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={cn("rounded-full p-0 h-20 w-20 relative group", className)}
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={selectedAvatar} alt="Selected avatar" />
          </Avatar>
          <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm">Change</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose an avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-4 p-4">
          {AVATAR_OPTIONS.map((avatar, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full p-0 h-16 w-16 relative group",
                selectedAvatar === avatar && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => handleSelect(avatar)}
            >
              <Avatar className="h-full w-full">
                <AvatarImage src={avatar} alt={`Avatar option ${index + 1}`} />
              </Avatar>
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
