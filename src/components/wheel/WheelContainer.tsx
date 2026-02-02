import { useRef, useCallback, useState } from 'react';
import useSound from 'use-sound';
import { WheelCanvas, WheelCanvasHandle } from './WheelCanvas';
import { WheelPointer } from './WheelPointer';
import { SpinButton } from './SpinButton';
import { ResultDisplay } from './ResultDisplay';
import { WheelInteractionOverlay } from './WheelInteractionOverlay';
import { SegmentEditor } from '@/components/editor/SegmentEditor';
import { useSettings, useSegments, useConfig, useWheelStore } from '@/store/wheelStore';
import { cn } from '@/lib/utils';
import type { Segment } from '@/types';

interface WheelContainerProps {
  className?: string;
}

export function WheelContainer({ className }: WheelContainerProps) {
  const wheelRef = useRef<WheelCanvasHandle>(null);
  const settings = useSettings();
  const segments = useSegments();
  const config = useConfig();
  const { isSpinning, updateSegment, removeSegment } = useWheelStore();

  // Editor state
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  const handleSegmentLongPress = useCallback((segment: Segment) => {
    setEditingSegment(segment);
    setIsEditorOpen(true);
  }, []);

  const handleEditorClose = useCallback(() => {
    setIsEditorOpen(false);
    setEditingSegment(null);
  }, []);

  const handleEditorSave = useCallback((segment: Segment) => {
    updateSegment(segment.id, segment);
    handleEditorClose();
  }, [updateSegment, handleEditorClose]);

  const handleEditorDelete = useCallback((id: string) => {
    removeSegment(id);
    handleEditorClose();
  }, [removeSegment, handleEditorClose]);

  const getWheelRotation = useCallback(() => {
    return wheelRef.current?.getRotation() ?? 0;
  }, []);

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
        <WheelInteractionOverlay
          onSegmentLongPress={handleSegmentLongPress}
          isDisabled={isSpinning}
          getWheelRotation={getWheelRotation}
          segments={segments}
          pointerAngle={config.pointerAngle}
        />
      </div>

      {/* Spin button */}
      <SpinButton onClick={handleSpin} />

      {/* Segment Editor Modal */}
      <SegmentEditor
        segment={editingSegment}
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        onSave={handleEditorSave}
        onDelete={handleEditorDelete}
      />
    </div>
  );
}
