import { useRef, useCallback } from 'react';
import type { Segment } from '@/types';
import { useLongPress } from '@/hooks/useLongPress';
import { getSegmentFromCoordinates } from '@/lib/utils';

interface WheelInteractionOverlayProps {
  onSegmentLongPress: (segment: Segment) => void;
  isDisabled: boolean;
  getWheelRotation: () => number;
  segments: Segment[];
  pointerAngle: number;
}

export function WheelInteractionOverlay({
  onSegmentLongPress,
  isDisabled,
  getWheelRotation,
  segments,
  pointerAngle,
}: WheelInteractionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleLongPress = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!overlayRef.current || isDisabled) return;

      const rect = overlayRef.current.getBoundingClientRect();

      // Get click position
      let clientX: number, clientY: number;
      if ('touches' in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = (event as React.MouseEvent).clientX;
        clientY = (event as React.MouseEvent).clientY;
      }

      // Convert to canvas-relative coordinates
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      // Get current wheel rotation at the moment of long press
      const wheelRotation = getWheelRotation();

      // Calculate which segment was clicked
      const segmentIndex = getSegmentFromCoordinates(
        clickX,
        clickY,
        rect.width,
        rect.height,
        wheelRotation,
        segments.length,
        pointerAngle
      );

      if (segmentIndex !== null && segments[segmentIndex]) {
        onSegmentLongPress(segments[segmentIndex]);
      }
    },
    [isDisabled, getWheelRotation, segments, pointerAngle, onSegmentLongPress]
  );

  const longPressHandlers = useLongPress({
    onLongPress: handleLongPress,
    delay: 500,
    moveThreshold: 10,
    isDisabled,
  });

  return (
    <div
      ref={overlayRef}
      className={`absolute inset-0 ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
      style={{ touchAction: 'none', zIndex: 10 }}
      {...longPressHandlers}
    />
  );
}
