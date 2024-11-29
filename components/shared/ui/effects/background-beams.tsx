import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 opacity-20 transition-opacity duration-300",
        className
      )}
      style={{
        background:
          "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%, transparent 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/10 mix-blend-normal" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 mix-blend-normal" />
    </div>
  );
};
