'use client';

import { Session } from 'next-auth';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Check,
  Mail,
  BadgeCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const { data: session, status, update: updateSession } = useSession();
  const { toast } = useToast();

  if (status === 'loading') {
    return <Button variant="ghost" className="w-[120px] cursor-default" />;
  }

  if (!session?.user) {
    return (
      <Link href="/auth/signin">
        <Button variant="default" className="rounded-lg text-black">
          Get Started
        </Button>
      </Link>
    );
  }

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  const userInitials = session.user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          {session.user.emailVerified ? (
            <div className="absolute -right-1 -top-1">
              <Badge variant="outline" className="h-5 w-5 rounded-full border-2 border-background bg-primary/10 p-0.5">
                <BadgeCheck className="h-3 w-3 text-primary" />
              </Badge>
            </div>
          ) : (
            <div className="absolute -right-1 -top-1">
              <Badge variant="outline" className="h-5 w-5 rounded-full border-2 border-background bg-warning p-0.5">
                <Mail className="h-3 w-3" />
              </Badge>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              {session.user.emailVerified && (
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href="/playground/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <Link href="/playground/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}