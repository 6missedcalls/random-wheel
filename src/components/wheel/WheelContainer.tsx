import { useRef, useCallback } from 'react';
import useSound from 'use-sound';
import { WheelCanvas, WheelCanvasHandle } from './WheelCanvas';
import { WheelPointer } from './WheelPointer';
import { SpinButton } from './SpinButton';
import { ResultDisplay } from './ResultDisplay';
import { Confetti } from '@/components/effects/Confetti';
import { useSettings, useLastResult } from '@/store/wheelStore';
import { cn } from '@/lib/utils';

interface WheelContainerProps {
  className?: string;
}

export function WheelContainer({ className }: WheelContainerProps) {
  const wheelRef = useRef<WheelCanvasHandle>(null);
  const settings = useSettings();
  const lastResult = useLastResult();

  const [playTick] = useSound('/sounds/tick.mp3', {
    volume: settings.volume * 0.3,
    playbackRate: 1.2,
  });

  const [playWin] = useSound('/sounds/win.mp3', {
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
      {/* Confetti effect */}
      <Confetti
        trigger={!!lastResult}
        colors={lastResult ? [lastResult.color] : undefined}
      />

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

      {/* Result display */}
      <ResultDisplay className="mt-4" />
    </div>
  );
}
