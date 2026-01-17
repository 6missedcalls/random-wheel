import type { Segment, WheelConfig, AppSettings } from '@/types';

export const DEFAULT_SEGMENTS: Segment[] = [
  { id: '1', label: "You're drowning in bad habits!", description: 'Wear Water wings for 2 minutes!', color: '#3B82F6', weight: 1 },
  { id: '2', label: 'Go cool off!', description: 'Dunk your head in a bucket of ice water!', color: '#06B6D4', weight: 1 },
  { id: '3', label: 'Vinegar Spray', description: 'Taste the bitterness of your speech! Spritz 3 sprays of vinegar in your mouth! (administered by your coach)', color: '#10B981', weight: 1 },
  { id: '4', label: 'Sting Pong', description: 'Lift your shirt and your teammates get to smack a ping pong ball on your skin!', color: '#F59E0B', weight: 1 },
  { id: '5', label: 'Your language is a mess!', description: 'Shaving cream pie to the face! (administered by your coach!)', color: '#EF4444', weight: 1 },
  { id: '6', label: 'Feel the sting of your words!', description: 'Snap a big rubber band on your wrist', color: '#8B5CF6', weight: 1 },
  { id: '7', label: 'The tongue is set on fire by hell itself!', description: 'Eat 2 Blazing Hot Wings from BW3s!', color: '#EC4899', weight: 1 },
  { id: '8', label: 'Foul flavors for a foul mouth!', description: 'Eat 3 Bertie Bots every flavor beans', color: '#14B8A6', weight: 1 },
  { id: '9', label: 'Mercy', description: 'Let he who is without sin cast the first stone! Brother, where are your accusers? Behold! Your sins are forgiven! Go! And sin no more!', color: '#F97316', weight: 1 },
  { id: '10', label: 'Ducking ridiculous', description: 'Wear an exercise band around your knees for 2 minutes', color: '#6366F1', weight: 1 },
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
