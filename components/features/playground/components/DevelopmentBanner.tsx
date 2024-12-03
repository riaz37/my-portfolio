import { Construction, Sparkles, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/ui/feedback/alert";
import { cn } from "@/lib/utils";

export function DevelopmentBanner() {
  return (
    <Alert 
      variant="default" 
      className={cn(
        "mb-6 relative overflow-hidden group",
        "bg-gradient-to-br from-purple-500/10 via-primary/5 to-blue-500/10",
        "border border-primary/20 backdrop-blur-sm",
        "hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
        "dark:from-purple-400/10 dark:via-primary/5 dark:to-blue-400/10"
      )}
    >
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
          <Construction className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <AlertTitle className="font-semibold text-foreground flex items-center gap-2">
            Features Under Development
            <Zap className="h-4 w-4 text-yellow-500 animate-bounce" />
          </AlertTitle>
          <AlertDescription className="text-muted-foreground leading-relaxed">
            We&apos;re actively building exciting new features for the playground. Check back regularly for updates and improvements. Your feedback is valuable to us!
          </AlertDescription>
        </div>
      </div>
      
      {/* Animated decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
        <Sparkles className="absolute top-4 right-4 h-4 w-4 text-primary/40 animate-pulse" />
        <Sparkles className="absolute bottom-4 left-4 h-3 w-3 text-primary/30 animate-pulse delay-300" />
      </div>
    </Alert>
  );
}
