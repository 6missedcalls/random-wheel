import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Calculate weighted random index based on segment weights
 */
export function getWeightedRandomIndex(weights: number[]): number {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return i;
    }
  }

  return weights.length - 1;
}

/**
 * Format a number as percentage
 */
export function formatProbability(weight: number, totalWeight: number): string {
  const percentage = (weight / totalWeight) * 100;
  return `${percentage.toFixed(1)}%`;
}
