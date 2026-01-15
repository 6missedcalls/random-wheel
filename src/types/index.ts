/**
 * Represents a single segment on the wheel
 */
export interface Segment {
  /** Unique identifier */
  id: string;

  /** Display text on the segment */
  label: string;

  /** Background color (hex format) */
  color: string;

  /** Optional Lucide icon name */
  icon?: string;

  /** Probability weight (default: 1) */
  weight: number;

  /** Optional text color override */
  textColor?: string;

  /** Optional description shown after spin */
  description?: string;
}

/**
 * Configuration options for wheel appearance and behavior
 */
export interface WheelConfig {
  /** Duration of spin animation in seconds */
  spinDuration: number;

  /** Number of full rotations during spin */
  rotations: number;

  /** Angle of the pointer (0 = top) */
  pointerAngle: number;

  /** Border width in pixels */
  borderWidth: number;

  /** Border color (hex format) */
  borderColor: string;

  /** Default text color for segments */
  textColor: string;

  /** Font size for segment labels */
  fontSize: number;
}

/**
 * A saved wheel configuration
 */
export interface SavedWheel {
  /** Unique identifier */
  id: string;

  /** User-defined name */
  name: string;

  /** Wheel segments */
  segments: Segment[];

  /** Wheel configuration */
  config: WheelConfig;

  /** ISO timestamp of creation */
  createdAt: string;

  /** ISO timestamp of last update */
  updatedAt: string;

  /** Optional thumbnail (base64 or data URL) */
  thumbnail?: string;
}

/**
 * Application-wide settings
 */
export interface AppSettings {
  /** Enable/disable sound effects */
  soundEnabled: boolean;

  /** Volume level (0-1) */
  volume: number;

  /** Theme preference */
  theme: 'light' | 'dark' | 'system';

  /** Respect prefers-reduced-motion */
  reducedMotion: boolean;

  /** Show confetti on spin complete */
  showConfetti: boolean;

  /** Auto-remove winning segment after spin */
  autoRemoveWinner: boolean;
}

/**
 * A single spin result for history
 */
export interface SpinResult {
  /** Unique identifier */
  id: string;

  /** The winning segment */
  segment: Segment;

  /** ISO timestamp */
  timestamp: string;

  /** Name of the wheel used (if saved) */
  wheelName?: string;
}

/**
 * Item format for spin-wheel library
 */
export interface WheelItem {
  label: string;
  backgroundColor?: string;
  labelColor?: string;
  weight?: number;
  image?: string;
}
