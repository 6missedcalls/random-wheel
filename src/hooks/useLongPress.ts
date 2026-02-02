import { useRef, useCallback } from 'react';

interface UseLongPressOptions {
  onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
  onStart?: () => void;
  onCancel?: () => void;
  delay?: number;
  moveThreshold?: number;
  isDisabled?: boolean;
}

interface Position {
  x: number;
  y: number;
}

export function useLongPress({
  onLongPress,
  onStart,
  onCancel,
  delay = 500,
  moveThreshold = 10,
  isDisabled = false,
}: UseLongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout>();
  const startPosRef = useRef<Position | null>(null);
  const eventRef = useRef<React.MouseEvent | React.TouchEvent | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    startPosRef.current = null;
    eventRef.current = null;
  }, []);

  const getPosition = (event: React.MouseEvent | React.TouchEvent): Position => {
    if ('touches' in event && event.touches.length > 0) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    return { x: (event as React.MouseEvent).clientX, y: (event as React.MouseEvent).clientY };
  };

  const handleStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (isDisabled) return;

      event.preventDefault();

      startPosRef.current = getPosition(event);
      eventRef.current = event;

      onStart?.();

      timerRef.current = setTimeout(() => {
        if (eventRef.current) {
          onLongPress(eventRef.current);
          clear();
        }
      }, delay);
    },
    [isDisabled, onLongPress, onStart, delay, clear]
  );

  const handleMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!startPosRef.current) return;

      const currentPos = getPosition(event);
      const distance = Math.sqrt(
        Math.pow(currentPos.x - startPosRef.current.x, 2) +
        Math.pow(currentPos.y - startPosRef.current.y, 2)
      );

      if (distance > moveThreshold) {
        onCancel?.();
        clear();
      }
    },
    [moveThreshold, onCancel, clear]
  );

  const handleEnd = useCallback(() => {
    if (timerRef.current) {
      onCancel?.();
    }
    clear();
  }, [onCancel, clear]);

  return {
    onMouseDown: handleStart,
    onMouseMove: handleMove,
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
  };
}
