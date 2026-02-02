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

/**
 * Calculate which segment was clicked based on canvas coordinates
 * @param clickX - X coordinate relative to canvas
 * @param clickY - Y coordinate relative to canvas
 * @param canvasWidth - Width of canvas element
 * @param canvasHeight - Height of canvas element
 * @param wheelRotation - Current rotation of wheel in degrees
 * @param segmentCount - Total number of segments
 * @param pointerAngle - Pointer angle in degrees (0 = top)
 * @returns segment index (0-based) or null if click is outside wheel
 */
export function getSegmentFromCoordinates(
  clickX: number,
  clickY: number,
  canvasWidth: number,
  canvasHeight: number,
  wheelRotation: number,
  segmentCount: number,
  pointerAngle: number = 0
): number | null {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Calculate distance from center
  const dx = clickX - centerX;
  const dy = clickY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Check if click is within wheel radius (account for border, use 95% of radius)
  const wheelRadius = (Math.min(canvasWidth, canvasHeight) / 2) * 0.95;
  if (distance > wheelRadius || distance < wheelRadius * 0.15) {
    // Outside wheel or too close to center (dead zone)
    return null;
  }

  // Calculate angle from center to click point
  // atan2 returns angle in radians from -PI to PI, where 0 is right (3 o'clock)
  let angleRad = Math.atan2(dy, dx);
  let angleDeg = (angleRad * 180) / Math.PI;

  // Normalize to 0-360 range
  angleDeg = (angleDeg + 360) % 360;

  // Adjust for coordinate system:
  // - Canvas atan2: 0° is right (3 o'clock), increases clockwise
  // - Wheel: 0° is top (12 o'clock), and we need to account for rotation
  // Convert from atan2 coordinate system (0° = right) to wheel system (0° = top)
  angleDeg = (angleDeg - 90 + 360) % 360;

  // Adjust for current wheel rotation (subtract because wheel rotates)
  angleDeg = (angleDeg - wheelRotation + 360) % 360;

  // Adjust for pointer angle
  angleDeg = (angleDeg - pointerAngle + 360) % 360;

  // Calculate segment index
  const anglePerSegment = 360 / segmentCount;
  const segmentIndex = Math.floor(angleDeg / anglePerSegment);

  return segmentIndex % segmentCount;
}
