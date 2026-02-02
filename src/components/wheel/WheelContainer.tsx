import { useRef, useCallback } from 'react';
import useSound from 'use-sound';
import { WheelCanvas, WheelCanvasHandle } from './WheelCanvas';
import { WheelPointer } from './WheelPointer';
import { SpinButton } from './SpinButton';
import { ResultDisplay } from './ResultDisplay';
import { useSettings } from '@/store/wheelStore';
import { cn } from '@/lib/utils';

interface WheelContainerProps {
  className?: string;
}

export function WheelContainer({ className }: WheelContainerProps) {
  const wheelRef = useRef<WheelCanvasHandle>(null);
  const settings = useSettings();

  const [playTick] = useSound(`${import.meta.env.BASE_URL}sounds/tick.mp3`, {
    volume: settings.volume * 0.3,
    playbackRate: 1.2,
  });

  const [playWin] = useSound(`${import.meta.env.BASE_URL}sounds/win.mp3`, {
    volume: settings.volume,
  });

  const handleSpin = useCallback(() => {
    wheelRef.current?.spin();
  }, []);

  const handleTickSound = useCallback(() => {
    if (settings.soundEnabled) {
      playTick();
    }
  }, [settings.soundEnabled, playTick]);

  const handleWinSound = useCallback(() => {
    if (settings.soundEnabled) {
      playWin();
    }
  }, [settings.soundEnabled, playWin]);

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      {/* Result description above wheel */}
      <ResultDisplay className="min-h-[2rem]" />

      {/* Wheel section */}
      <div className="relative w-full max-w-[500px]" data-wheel-area>
        <WheelPointer />
        <WheelCanvas
          ref={wheelRef}
          onTickSound={handleTickSound}
          onWinSound={handleWinSound}
        />
      </div>

      {/* Spin button */}
      <SpinButton onClick={handleSpin} />
    </div>
  );
}
