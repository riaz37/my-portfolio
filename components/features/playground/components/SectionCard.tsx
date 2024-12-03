import Link from "next/link";
import { PlaygroundSection } from "../data/sections";
import { Progress } from "@/components/shared/ui/feedback/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionCardProps {
  section: PlaygroundSection;
  progress?: number;
  disabled?: boolean;
}

export function SectionCard({ section, progress = 0, disabled }: SectionCardProps) {
  const Icon = section.icon;

  return (
    <Link
      href={disabled ? "#" : section.href}
      className={cn(
        "block p-6",
        "h-[280px]", // Fixed height for all cards
        "rounded-xl border border-border/50",
        "bg-card/50 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
        "group relative overflow-hidden",
        disabled && "pointer-events-none opacity-75"
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-lg mb-4 shrink-0",
          "flex items-center justify-center",
          "bg-gradient-to-br",
          section.color,
          "group-hover:scale-110 transition-transform duration-300"
        )}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
            {section.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {section.description}
          </p>
        </div>

        {/* Progress Bar */}
        {typeof progress === "number" && (
          <div className="mt-4 space-y-1">
            <Progress value={progress} className="h-1" />
            <p className="text-xs text-muted-foreground">
              {progress}% Complete
            </p>
          </div>
        )}

        {/* Verification Badge */}
        {section.requiresVerification && (
          <div className="absolute top-4 right-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        )}
      </div>
    </Link>
  );
}
