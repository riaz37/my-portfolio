"use client";

import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { SectionCard } from "./components/SectionCard";
import { playgroundSections } from "./data/sections";
import { useSession, signIn } from "next-auth/react";
import { useUserProgress } from "./hooks/useUserProgress";
import { useVerification } from "./hooks/useVerification";
import { Loading as LoadingComponent } from "@/components/shared/loading";
import { motion } from "framer-motion";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/ui/core/button";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export function PlaygroundPage() {
  const { data: session, status, update: updateSession } = useSession();
  const { progress, isLoading: isLoadingProgress } = useUserProgress();
  const { isResending, handleResendVerification } = useVerification(session);
  const isAuthenticated = status === "authenticated";
  const isVerified = !!session?.user?.emailVerified;
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasCheckedVerification = useRef(false);

  // Handle verification status update
  useEffect(() => {
    const verificationStatus = searchParams.get('verified');
    
    if (verificationStatus === 'true' && !hasCheckedVerification.current) {
      hasCheckedVerification.current = true;
      
      // Update session and remove the verified parameter
      const handleVerification = async () => {
        await updateSession();
        router.replace('/playground'); // Remove the verified parameter from URL
      };
      
      handleVerification();
    }
  }, [searchParams, updateSession, router]);

  if (status === "loading" || isLoadingProgress) {
    return <LoadingComponent />;
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <main className="relative">
        {/* Header Section */}
        <section className="px-6 py-12 sm:px-8 md:py-16 lg:px-10">
          <motion.div
            className="mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="relative">
                      <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                      <div className="absolute inset-0 animate-ping-slow">
                        <Sparkles className="h-5 w-5 text-primary opacity-50" />
                      </div>
                    </div>
                    <h2 className="text-sm font-medium text-muted-foreground">
                      Interactive Learning Platform
                    </h2>
                  </motion.div>
                  <div>
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="relative"
                      >
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl pb-1 relative z-10">
                          <span className="inline-block animate-gradient-x bg-gradient-to-r from-violet-500 via-primary to-violet-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                            Play
                          </span>
                          <span className="inline-block animate-gradient-x bg-gradient-to-r from-blue-500 via-primary to-blue-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                            ground
                          </span>
                        </h1>
                        <div className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-violet-500/20 via-primary/20 to-blue-500/20 blur-2xl opacity-50 animate-pulse" />
                      </motion.div>
                    </div>
                    <motion.p
                      className="mt-4 max-w-[700px] text-base text-muted-foreground/80 sm:text-lg relative z-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      Dive into interactive demos and hands-on experiments.
                      Level up your skills through practical challenges and
                      real-world applications.
                    </motion.p>
                  </div>
                </div>
              </div>
              <UserMenu />
            </div>

            {/* Auth Status Banner */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 rounded-xl border border-border/50 bg-gradient-to-r from-background via-muted/50 to-background backdrop-blur-sm overflow-hidden"
              >
                <div className="p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5" />
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Lock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-foreground">
                          Restricted Access
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Sign in to unlock all features and track your progress
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Verification Banner */}
            {isAuthenticated && !isVerified && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 rounded-xl border border-border/50 bg-gradient-to-r from-background via-muted/50 to-background backdrop-blur-sm overflow-hidden"
              >
                <div className="p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5" />
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-foreground">
                          Verify Your Email
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Didn't receive the verification email? Click the button to resend
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="shrink-0"
                    >
                      {isResending ? "Sending..." : "Resend Verification"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Under Development Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 rounded-xl border border-border/50 bg-gradient-to-r from-background via-muted/50 to-background backdrop-blur-sm overflow-hidden"
            >
              <div className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-yellow-500/10 p-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-yellow-500">
                        Under Development
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Some features are currently under development. Stay tuned for the full release with more interactive challenges and features!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Projects Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 sm:grid-cols-2 relative"
            >
              {playgroundSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  variants={item}
                  className={cn(
                    "transform transition-all duration-200 hover:scale-[1.02]",
                    index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
                  )}
                >
                  <SectionCard
                    section={{
                      ...section,
                      progress: progress[section.href] || 0,
                    }}
                    isAuthenticated={isAuthenticated}
                    isVerified={isVerified}
                    onResendVerification={handleResendVerification}
                    isResending={isResending}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
