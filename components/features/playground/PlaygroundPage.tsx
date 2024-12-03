"use client";

import { Lock, User, Sparkles } from "lucide-react";
import { SectionCard } from "./components/SectionCard";
import { DevelopmentBanner } from "./components/DevelopmentBanner";
import { playgroundSections } from "./data/sections";
import { useSession, signIn } from "next-auth/react";
import { useUserProgress } from "./hooks/useUserProgress";
import { Loading as LoadingComponent } from "@/components/shared/loading";
import { motion } from "framer-motion";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/shared/ui/core/button";
import { cn } from "@/lib/utils";

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
  const { data: session, status } = useSession();
  const { progress, isLoading: isLoadingProgress } = useUserProgress();
  const isAuthenticated = status === "authenticated";

  if (status === "loading" || isLoadingProgress) {
    return <LoadingComponent />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Interactive Learning Environment</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Playground
              </span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Your personal sandbox for experimenting with code, learning new concepts, and building amazing projects.
            </p>
          </div>
          
          <div className="w-full sm:w-auto">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button
                onClick={() => signIn()}
                className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                size="lg"
              >
                <User className="h-4 w-4" />
                Sign In to Access
              </Button>
            )}
          </div>
        </div>

        {/* Development Banner */}
        <DevelopmentBanner />

        {/* Sections Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
        >
          {playgroundSections.map((section, index) => (
            <motion.div 
              key={section.id} 
              variants={item}
              className={cn(
                "group relative",
                "before:absolute before:inset-0 before:-z-10",
                "before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:opacity-0",
                "before:transition-opacity hover:before:opacity-100"
              )}
            >
              <div className="relative">
                {!isAuthenticated && (
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                    <div className="text-center p-6">
                      <div className="relative">
                        <Lock className="w-12 h-12 mx-auto mb-4 text-primary relative" />
                      </div>
                      <p className="text-lg font-medium text-primary mb-2">
                        Sign In to Access
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create an account to explore this section
                      </p>
                      <Button
                        onClick={() => signIn()}
                        variant="outline"
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                )}
                <SectionCard
                  section={section}
                  progress={progress}
                  disabled={!isAuthenticated}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
