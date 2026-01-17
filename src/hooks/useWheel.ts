import { useRef, useEffect, useCallback, useState } from 'react';
import { Wheel } from 'spin-wheel';
import type { Segment, WheelConfig } from '@/types';
import { getWeightedRandomIndex } from '@/lib/utils';
import { loadIconImage, isValidIcon } from '@/lib/iconUtils';

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
  const [loadedIcons, setLoadedIcons] = useState<Map<string, HTMLImageElement>>(new Map());
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

  // Load images for segments (custom images or icons)
  useEffect(() => {
    const segmentsWithImages = segments.filter(s => s.image || (s.icon && isValidIcon(s.icon)));

    if (segmentsWithImages.length === 0) {
      setLoadedIcons(new Map());
      return;
    }

    const loadImages = async () => {
      const newImageMap = new Map<string, HTMLImageElement>();
      await Promise.all(
        segmentsWithImages.map(async (segment) => {
          try {
            if (segment.image) {
              // Load custom image from base64 data URL
              const img = new Image();
              await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = segment.image!;
              });
              newImageMap.set(segment.id, img);
            } else if (segment.icon && isValidIcon(segment.icon)) {
              // Fall back to Lucide icon
              const img = await loadIconImage(segment.icon, '#ffffff', 48);
              newImageMap.set(segment.id, img);
            }
          } catch (e) {
            console.warn(`Failed to load image for segment ${segment.id}:`, e);
          }
        })
      );
      setLoadedIcons(newImageMap);
    };

    loadImages();
  }, [segments]);

  // Convert segments to spin-wheel format
  const getItems = useCallback(() => {
    const segmentCount = segments.length;
    const anglePerSegment = 360 / segmentCount;

    return segments.map((segment, index) => {
      const item: Record<string, unknown> = {
        label: config.showLabels ? segment.label : '',
        backgroundColor: segment.color,
        labelColor: segment.textColor || config.textColor,
        weight: segment.weight,
      };

      // Add icon image if available
      const iconImage = loadedIcons.get(segment.id);
      if (iconImage) {
        item.image = iconImage;
        item.imageRadius = 0.55;
        item.imageScale = 0.25;
        // Calculate rotation to make icon face outward (perpendicular to radius)
        // Each segment is centered at its midpoint angle
        const segmentMidAngle = index * anglePerSegment + anglePerSegment / 2;
        // Rotate icon to face outward (add 90 degrees so icon points away from center)
        item.imageRotation = segmentMidAngle + 90;
      }

      return item;
    });
  }, [segments, config.textColor, config.showLabels, loadedIcons]);

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
