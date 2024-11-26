import Link from 'next/link';
import { Button } from '@/components/shared/ui/core/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-xl">Page Not Found</p>
      <p className="text-muted-foreground text-center max-w-[500px]">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Button asChild>
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  );
}
