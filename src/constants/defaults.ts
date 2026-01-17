import type { Segment, WheelConfig, AppSettings } from '@/types';

export const DEFAULT_SEGMENTS: Segment[] = [
  { id: '1', label: 'Option 1', color: '#FF6B6B', weight: 1 },
  { id: '2', label: 'Option 2', color: '#4ECDC4', weight: 1 },
  { id: '3', label: 'Option 3', color: '#45B7D1', weight: 1 },
  { id: '4', label: 'Option 4', color: '#96CEB4', weight: 1 },
];

export const DEFAULT_CONFIG: WheelConfig = {
  spinDuration: 3,
  rotations: 5,
  pointerAngle: 0,
  borderWidth: 2,
  borderColor: '#1f2937',
  textColor: '#ffffff',
  fontSize: 16,
  showLabels: false,
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  volume: 0.7,
  theme: 'system',
  reducedMotion: false,
  showConfetti: true,
  autoRemoveWinner: false,
};
