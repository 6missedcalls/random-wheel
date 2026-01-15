import { useRef, useEffect, useCallback, useState } from 'react';
import { Wheel } from 'spin-wheel';
import type { Segment, WheelConfig } from '@/types';
import { getWeightedRandomIndex } from '@/lib/utils';

interface UseWheelOptions {
  segments: Segment[];
  config: WheelConfig;
  onSpinStart?: () => void;
  onSpinEnd?: (segment: Segment) => void;
  onSegmentChange?: (segment: Segment) => void;
}

interface UseWheelReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  spin: (targetIndex?: number) => void;
  spinToSegment: (segmentId: string) => void;
  stop: () => void;
  isReady: boolean;
}

export function useWheel({
  segments,
  config,
  onSpinStart,
  onSpinEnd,
  onSegmentChange,
}: UseWheelOptions): UseWheelReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<Wheel | null>(null);
  const [isReady, setIsReady] = useState(false);
  const segmentsRef = useRef(segments);

  // Keep refs updated for callbacks (avoids re-initializing wheel on callback changes)
  const onSpinStartRef = useRef(onSpinStart);
  const onSpinEndRef = useRef(onSpinEnd);
  const onSegmentChangeRef = useRef(onSegmentChange);

  // Keep segments ref updated
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  // Keep callback refs updated
  useEffect(() => {
    onSpinStartRef.current = onSpinStart;
    onSpinEndRef.current = onSpinEnd;
    onSegmentChangeRef.current = onSegmentChange;
  }, [onSpinStart, onSpinEnd, onSegmentChange]);

  // Convert segments to spin-wheel format
  const getItems = useCallback(() => segments.map((segment) => ({
    label: config.showLabels ? segment.label : '',
    backgroundColor: segment.color,
    labelColor: segment.textColor || config.textColor,
    weight: segment.weight,
  })), [segments, config.textColor, config.showLabels]);

  // Initialize wheel
  useEffect(() => {
    if (!containerRef.current || segments.length < 2) {
      setIsReady(false);
      return;
    }

    // Clean up existing wheel
    if (wheelRef.current) {
      wheelRef.current.remove();
    }

    // Create new wheel instance
    const items = getItems();
    wheelRef.current = new Wheel(containerRef.current, {
      items,
      borderWidth: config.borderWidth,
      borderColor: config.borderColor,
      lineWidth: 1,
      lineColor: config.borderColor,
      itemLabelFont: `bold ${config.fontSize}px Inter, system-ui, sans-serif`,
      itemLabelColors: [config.textColor],
      itemLabelAlign: 'center',
      itemLabelRadius: 0.85,
      itemLabelRadiusMax: 0.35,
      rotationSpeedMax: 1000,
      rotationResistance: -35,
      pointerAngle: config.pointerAngle,
      isInteractive: false,
    });

    // Set up event handlers (use refs to avoid stale closures)
    wheelRef.current.onSpin = () => {
      onSpinStartRef.current?.();
    };

    wheelRef.current.onCurrentIndexChange = (event: { currentIndex: number }) => {
      const segment = segmentsRef.current[event.currentIndex];
      if (segment) {
        onSegmentChangeRef.current?.(segment);
      }
    };

    wheelRef.current.onRest = (event: { currentIndex: number }) => {
      const segment = segmentsRef.current[event.currentIndex];
      if (segment) {
        onSpinEndRef.current?.(segment);
      }
    };

    setIsReady(true);

    return () => {
      if (wheelRef.current) {
        wheelRef.current.remove();
        wheelRef.current = null;
      }
      setIsReady(false);
    };
  }, [segments.length, config.borderWidth, config.borderColor, config.fontSize, config.textColor, config.pointerAngle, config.showLabels, getItems]);

  // Update wheel items when segments change
  useEffect(() => {
    if (wheelRef.current && isReady && segments.length >= 2) {
      wheelRef.current.items = getItems();
    }
  }, [getItems, isReady, segments.length]);

  // Spin function
  const spin = useCallback((targetIndex?: number) => {
    if (!wheelRef.current || !isReady) return;

    const duration = config.spinDuration * 1000;
    const rotations = config.rotations;

    if (targetIndex !== undefined) {
      // Spin to specific index
      wheelRef.current.spinToItem(targetIndex, duration, true, rotations);
    } else {
      // Random spin based on weights
      const weights = segmentsRef.current.map(s => s.weight);
      const randomIndex = getWeightedRandomIndex(weights);
      wheelRef.current.spinToItem(randomIndex, duration, true, rotations);
    }
  }, [config.spinDuration, config.rotations, isReady]);

  // Spin to specific segment by ID
  const spinToSegment = useCallback((segmentId: string) => {
    const index = segmentsRef.current.findIndex((s) => s.id === segmentId);
    if (index !== -1) {
      spin(index);
    }
  }, [spin]);

  // Stop spinning
  const stop = useCallback(() => {
    if (wheelRef.current) {
      wheelRef.current.stop();
    }
  }, []);

  return {
    containerRef,
    spin,
    spinToSegment,
    stop,
    isReady,
  };
}
