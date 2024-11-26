import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: string[];
  className?: string;
  cursorClassName?: string;
}) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTypingPaused, setIsTypingPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const type = () => {
      const currentWord = words[wordIndex];
      const shouldDelete = isDeleting;

      setText((current) => {
        if (shouldDelete) {
          return current.substring(0, current.length - 1);
        }
        return currentWord.substring(0, current.length + 1);
      });

      let typingSpeed = isDeleting ? 75 : 150;

      if (!isDeleting && text === currentWord) {
        setIsTypingPaused(true);
        timeout = setTimeout(() => {
          setIsTypingPaused(false);
          setIsDeleting(true);
        }, 2000);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex((current) => (current + 1) % words.length);
        timeout = setTimeout(type, 500);
        return;
      }

      timeout = setTimeout(type, typingSpeed);
    };

    if (!isTypingPaused) {
      timeout = setTimeout(type, 150);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, isTypingPaused, words]);

  return (
    <div className={cn("text-center", className)}>
      <span className="inline-block">{text}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block w-[2px] h-4 bg-primary ml-1",
          cursorClassName
        )}
      />
    </div>
  );
};
