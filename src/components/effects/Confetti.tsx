import { useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useSettings } from '@/store/wheelStore';

interface ConfettiProps {
  trigger: boolean;
  colors?: string[];
}

export function Confetti({ trigger, colors }: ConfettiProps) {
  const settings = useSettings();
  const lastTrigger = useRef(false);

  const fireConfetti = useCallback(() => {
    if (!settings.showConfetti) return;

    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      colors: colors || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, [colors, settings.showConfetti]);

  useEffect(() => {
    // Only fire when trigger transitions from false to true
    if (trigger && !lastTrigger.current) {
      fireConfetti();
    }
    lastTrigger.current = trigger;
  }, [trigger, fireConfetti]);

  return null;
}
