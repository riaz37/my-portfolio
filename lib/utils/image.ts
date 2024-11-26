export function getImageSizes(sizes: { sm?: number; md?: number; lg?: number; xl?: number; default: number }): string {
  return Object.entries(sizes)
    .map(([breakpoint, size]) => {
      if (breakpoint === 'default') return `${size}px`;
      const breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      };
      return `(min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px) ${size}px`;
    })
    .join(', ');
}

export function getBlurDataURL(width: number, height: number): string {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3C/filter%3E%3Cpath fill='%23333' filter='url(%23b)' d='M0 0h${width}v${height}H0z'/%3E%3C/svg%3E`;
}
