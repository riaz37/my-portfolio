import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beamsRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      
      // Calculate relative position (0 to 1)
      const x = clientX / innerWidth;
      const y = clientY / innerHeight;
      
      mousePosition.current = { x, y };
      
      if (beamsRef.current) {
        // Apply transform based on mouse position
        const translateX = (x - 0.5) * 20; // Move up to 20px left/right
        const translateY = (y - 0.5) * 20; // Move up to 20px up/down
        beamsRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={beamsRef}
      className={cn(
        "absolute inset-0 opacity-30 transition-transform duration-300",
        className
      )}
      style={{
        background:
          "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.1) 0%, transparent 70%, transparent 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/20 mix-blend-normal" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/20 mix-blend-normal" />
    </div>
  );
};
