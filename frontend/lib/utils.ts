import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate initials from a name string
 * @param name - The full name string
 * @returns The initials (max 2 characters) or 'U' if name is invalid
 */
export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'U' // Default initial for undefined/invalid names
  }
  
  return name
    .trim()
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Custom API Error class for handling API-related errors
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText?: string;

  constructor(message: string, status: number, statusText?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
