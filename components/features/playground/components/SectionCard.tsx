import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/ui/core/button";
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
    if (onResendVerification) {
      onResendVerification();
    }
  };

  const Icon = section.icon;

  const CardContent = () => (
    <>
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className={cn(
              "rounded-lg p-2 sm:p-2.5",
              section.color
            )}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            {section.progress !== undefined && (
              <div className="text-sm text-muted-foreground">
                {section.progress}% Complete
              </div>
            )}
          </div>
          <h3 className="mt-4 text-lg sm:text-xl font-semibold tracking-tight">{section.title}</h3>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground line-clamp-3">{section.description}</p>
        </div>

        {/* Tags */}
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {section.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs sm:text-sm bg-primary/10 text-primary whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <Button
              className={cn(
                "w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5",
                "bg-primary/10 hover:bg-primary/20 text-primary"
              )}
            >
              <span className="flex items-center justify-center w-full">
                Explore
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for restricted content */}
      {(isRestricted || needsVerification) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px] rounded-xl">
          <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 text-center">
            {isRestricted ? (
              <>
                <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary/80" />
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Sign in to access
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRestrictedClick}
                    className="w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </div>
              </>
            ) : needsVerification ? (
              <>
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary/80" />
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-sm sm:text-base font-medium text-foreground">
                    Verify to Access
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Check your email for the verification link
                  </p>
                  {onResendVerification && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVerificationClick}
                      disabled={isResending}
                      className="w-full sm:w-auto"
                    >
                      {isResending ? "Sending..." : "Resend Verification"}
                    </Button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );

  // Wrapper with appropriate click handling
  return (
    <div className="group relative">
      {isRestricted ? (
        <div
          onClick={handleRestrictedClick}
          className="cursor-pointer"
        >
          <div className={cn(
            "relative h-full overflow-hidden rounded-xl border bg-card p-4 sm:p-6 transition-all duration-300",
            "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
            "opacity-80"
          )}>
            <CardContent />
          </div>
        </div>
      ) : needsVerification ? (
        <div
          onClick={handleVerificationClick}
          className="cursor-pointer"
        >
          <div className={cn(
            "relative h-full overflow-hidden rounded-xl border bg-card p-4 sm:p-6 transition-all duration-300",
            "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
            "opacity-80"
          )}>
            <CardContent />
          </div>
        </div>
      ) : (
        <Link href={section.href} className="block">
          <div className={cn(
            "relative h-full overflow-hidden rounded-xl border bg-card p-4 sm:p-6 transition-all duration-300",
            "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
          )}>
            <CardContent />
          </div>
        </Link>
      )}
    </div>
  );
}
