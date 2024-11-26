import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = true,
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIntersecting] = useState(false);
  const elementRef = useRef<Element | null>(null);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Don't observe if already frozen
    if (frozen.current && isIntersecting) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIntersecting(isElementIntersecting);

        if (freezeOnceVisible && isElementIntersecting) {
          frozen.current = true;
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { ref: elementRef, isIntersecting };
}
