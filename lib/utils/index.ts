import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export all utility functions
export * from './cache'
export * from './image'
export * from './logger'
export * from './string'
export * from './rate-limit'
