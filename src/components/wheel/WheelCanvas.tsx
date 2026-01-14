import { forwardRef, useImperativeHandle, useCallback } from 'react';
import { useWheel } from '@/hooks/useWheel';
import { useWheelStore, useSegments, useConfig, useSettings } from '@/store/wheelStore';
import { cn, generateId } from '@/lib/utils';
import type { Segment } from '@/types';

export interface WheelCanvasHandle {
  spin: () => void;
  spinToSegment: (segmentId: string) => void;
  stop: () => void;
}

interface WheelCanvasProps {
  className?: string;
  onTickSound?: () => void;
  onWinSound?: () => void;
}

export const WheelCanvas = forwardRef<WheelCanvasHandle, WheelCanvasProps>(
  ({ className, onTickSound, onWinSound }, ref) => {
    const segments = useSegments();
    const config = useConfig();
    const settings = useSettings();
    const { setSpinning, setResult, addToHistory } = useWheelStore();

    const handleSpinStart = useCallback(() => {
      setSpinning(true);
      setResult(null);
    }, [setSpinning, setResult]);

    const handleSpinEnd = useCallback((segment: Segment) => {
      setSpinning(false);
      setResult(segment);

      if (settings.soundEnabled) {
        onWinSound?.();
      }

      addToHistory({
        id: generateId(),
        segment,
        timestamp: new Date().toISOString(),
      });
    }, [setSpinning, setResult, addToHistory, settings.soundEnabled, onWinSound]);

    const handleSegmentChange = useCallback(() => {
      if (settings.soundEnabled) {
        onTickSound?.();
      }
    }, [settings.soundEnabled, onTickSound]);

    const { containerRef, spin, spinToSegment, stop, isReady } = useWheel({
      segments,
      config,
      onSpinStart: handleSpinStart,
      onSpinEnd: handleSpinEnd,
      onSegmentChange: handleSegmentChange,
    });

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      spin,
      spinToSegment,
      stop,
    }));

    if (segments.length < 2) {
      return (
        <div
          className={cn(
            'relative aspect-square w-full max-w-[500px] flex items-center justify-center bg-muted rounded-full',
            className
          )}
        >
          <p className="text-muted-foreground text-center px-8">
            Add at least 2 segments to spin the wheel
          </p>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative aspect-square w-full max-w-[500px]',
          !isReady && 'opacity-50',
          className
        )}
        role="img"
        aria-label={`Spinning wheel with ${segments.length} segments: ${segments.map(s => s.label).join(', ')}`}
      />
    );
  }
);

WheelCanvas.displayName = 'WheelCanvas';
