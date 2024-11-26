import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PlaygroundSection } from "../data/sections";
import { signIn } from "next-auth/react";

interface SectionCardProps {
  section: PlaygroundSection;
  isAuthenticated?: boolean;
  isVerified?: boolean;
  onResendVerification?: () => void;
  isResending?: boolean;
}

export function SectionCard({
  section,
  isAuthenticated,
  isVerified,
  onResendVerification,
  isResending
}: SectionCardProps) {
  const isRestricted = section.requiresAuth && !isAuthenticated;
  const needsVerification = section.requiresAuth && isAuthenticated && !isVerified;

  const handleRestrictedClick = () => {
    signIn(undefined, { callbackUrl: '/playground' });
  };

  const handleVerificationClick = () => {
    // Removed toast message
  };

  const Icon = section.icon;

  return (
    <div className="group relative">
      {/* Card Container */}
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300",
          "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
          "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent group-hover:before:translate-x-full",
          "after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300 group-hover:after:opacity-100 after:bg-gradient-to-br after:from-primary/5 after:to-transparent after:-z-10",
          (isRestricted || needsVerification) && "opacity-80"
        )}
      >
        {/* Hover Glow Effect */}
        <div className="absolute -inset-x-2 -inset-y-2 hidden rounded-[20px] bg-primary/10 opacity-0 blur-2xl transition duration-700 group-hover:opacity-70 group-hover:block" />
        
        {/* Icon */}
        <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
          <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Content */}
        <div className="relative space-y-2">
          <h3 className="font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary">{section.title}</h3>
          <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{section.description}</p>
        </div>

        {/* Progress Bar (if applicable) */}
        {section.progress !== undefined && section.progress > 0 && (
          <div className="relative mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted transition-colors duration-300 group-hover:bg-muted/70">
              <div
                className="h-full bg-primary transition-all duration-300 group-hover:bg-primary/80"
                style={{ width: `${section.progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">
              {section.progress}% Complete
            </p>
          </div>
        )}

        {/* Overlay for restricted content */}
        {(isRestricted || needsVerification) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px] rounded-xl">
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              {isRestricted ? (
                <>
                  <Lock className="h-8 w-8 text-primary/80" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Sign in to access
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestrictedClick}
                    >
                      Sign In
                    </Button>
                  </div>
                </>
              ) : needsVerification ? (
                <>
                  <Sparkles className="h-8 w-8 text-primary/80" />
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">
                      Verify to Access
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Check your email for the verification link
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Interactive Link Layer */}
        {!isRestricted && !needsVerification && (
          <Link
            href={section.href}
            className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span className="sr-only">Go to {section.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
