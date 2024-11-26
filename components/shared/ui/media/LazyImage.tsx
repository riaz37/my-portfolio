import Image, { ImageProps } from 'next/image';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { getImageSizes, getBlurDataURL } from '@/lib/utils/image';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImageProps, 'sizes'> {
  wrapperClassName?: string;
  sizes?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    default: number;
  };
}

export function LazyImage({
  src,
  alt,
  className,
  wrapperClassName,
  sizes,
  width,
  height,
  ...props
}: LazyImageProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: '50px',
    freezeOnceVisible: true,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden', wrapperClassName)}
      style={{ width, height }}
    >
      {isIntersecting && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn('object-cover', className)}
          sizes={sizes ? getImageSizes(sizes) : undefined}
          placeholder="blur"
          blurDataURL={getBlurDataURL(width as number, height as number)}
          {...props}
        />
      )}
    </div>
  );
}
