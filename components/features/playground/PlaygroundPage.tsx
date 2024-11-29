"use client";

import { Lock, Sparkles, ArrowRight, Code2 } from "lucide-react";
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
    const verificationStatus = searchParams.get('verified') ?? null;
    
    if (verificationStatus === 'true' && !hasCheckedVerification.current) {
      hasCheckedVerification.current = true;
      
      const handleVerification = async () => {
        await updateSession();
        router.replace('/playground');
      };
      
      handleVerification();
    }
  }, [searchParams, updateSession, router]);

  if (status === "loading" || isLoadingProgress) {
    return <LoadingComponent />;
  }

  return (
    <div className="relative w-full bg-gradient-to-b from-background via-background/95 to-background/90 z-0">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16">
        {/* Header Section */}
        <div className="relative mb-6 sm:mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 md:gap-8"
          >
            <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-primary/10 text-primary"
              >
                <Code2 className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Interactive Learning Platform
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              >
                <span className="inline-block bg-gradient-to-br from-primary to-violet-500 bg-clip-text text-transparent">
                  Playground
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground"
              >
                Dive into interactive demos and hands-on experiments. Level up your skills through practical challenges and real-world applications.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full sm:w-auto"
            >
              <UserMenu />
            </motion.div>
          </motion.div>
        </div>

        {/* Status Banners */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-6 sm:mb-8 md:mb-12">
          {/* Auth Banner */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl sm:rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden shadow-lg"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold">Restricted Access</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Sign in to unlock all features and track your progress</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => signIn()}
                    className="bg-primary/10 hover:bg-primary/20 text-primary w-full sm:w-auto text-sm sm:text-base"
                  >
                    Sign In <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Verification Banner */}
          {isAuthenticated && !isVerified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl sm:rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden shadow-lg"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="rounded-full bg-blue-500/10 p-2 sm:p-3">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold">Verify Your Email</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Didn&apos;t receive the verification email? Click to resend</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-blue-500/20 w-full sm:w-auto text-sm sm:text-base"
                  >
                    {isResending ? "Sending..." : "Resend Verification"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Development Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl sm:rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden shadow-lg"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="rounded-full bg-yellow-500/10 p-2 sm:p-3">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-500">Under Development</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Some features are currently under development. Stay tuned for the full release!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative z-10"
        >
          {playgroundSections.map((section, index) => (
            <motion.div
              key={section.title}
              variants={item}
              className={cn(
                "group transform transition-all duration-300 hover:scale-[1.02]",
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
      </div>
    </div>
  );
}
