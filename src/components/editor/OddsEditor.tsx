import { useState, useEffect } from 'react';
import { Plus, Lock, Unlock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWheelStore, useSegments, useTotalWeight } from '@/store/wheelStore';
import { getNextColor } from '@/constants/colors';
import { cn } from '@/lib/utils';

interface OddsEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SegmentOdds {
  id: string;
  label: string;
  color: string;
  percentage: number;
  isLocked?: boolean;
  isNew?: boolean;
}

export function OddsEditor({ isOpen, onClose }: OddsEditorProps) {
  const segments = useSegments();
  const totalWeight = useTotalWeight();
  const { setSegments } = useWheelStore();
  const [odds, setOdds] = useState<SegmentOdds[]>([]);

  // Initialize odds from segments when modal opens
  useEffect(() => {
    if (isOpen && segments.length > 0) {
      const initialOdds = segments.map(segment => ({
        id: segment.id,
        label: segment.label,
        color: segment.color,
        percentage: totalWeight > 0
          ? Math.round((segment.weight / totalWeight) * 100)
          : Math.round(100 / segments.length),
      }));

      // Adjust to ensure total is 100
      const total = initialOdds.reduce((sum, o) => sum + o.percentage, 0);
      if (total !== 100 && initialOdds.length > 0) {
        initialOdds[0].percentage += (100 - total);
      }

      setOdds(initialOdds);
    }
  }, [isOpen, segments, totalWeight]);

  const totalPercentage = odds.reduce((sum, o) => sum + o.percentage, 0);
  const isValid = totalPercentage === 100;

  const handlePercentageChange = (id: string, newPercentage: number) => {
    setOdds(prev => {
      const current = prev.find(o => o.id === id);
      if (!current) return prev;

      const oldPercentage = current.percentage;
      const difference = newPercentage - oldPercentage;

      // Get unlocked segments (excluding the one being changed)
      const unlockedOthers = prev.filter(o => o.id !== id && !o.isLocked);

      if (unlockedOthers.length === 0) {
        // No unlocked segments to adjust, just update the current one
        return prev.map(o =>
          o.id === id ? { ...o, percentage: newPercentage } : o
        );
      }

      // Calculate total percentage of unlocked segments
      const unlockedTotal = unlockedOthers.reduce((sum, o) => sum + o.percentage, 0);

      if (unlockedTotal === 0 && difference !== 0) {
        // All other unlocked segments are at 0, distribute evenly
        const perSegment = Math.abs(difference) / unlockedOthers.length;
        return prev.map(o => {
          if (o.id === id) {
            return { ...o, percentage: newPercentage };
          }
          if (!o.isLocked && o.id !== id) {
            return { ...o, percentage: Math.max(0, Math.round(perSegment)) };
          }
          return o;
        });
      }

      // Distribute the difference proportionally among unlocked segments
      return prev.map(o => {
        if (o.id === id) {
          return { ...o, percentage: newPercentage };
        }
        if (!o.isLocked && o.id !== id) {
          const proportion = o.percentage / unlockedTotal;
          const adjustment = Math.round(difference * proportion);
          const newValue = Math.max(0, Math.min(100, o.percentage - adjustment));
          return { ...o, percentage: newValue };
        }
        return o;
      });
    });
  };

  const toggleLock = (id: string) => {
    setOdds(prev => prev.map(o =>
      o.id === id ? { ...o, isLocked: !o.isLocked } : o
    ));
  };

  const handleAddSegment = () => {
    const existingColors = odds.map(o => o.color);
    const newColor = getNextColor(existingColors);
    const newId = `new-${Date.now()}`;

    setOdds(prev => [...prev, {
      id: newId,
      label: `Option ${prev.length + 1}`,
      color: newColor,
      percentage: 0,
      isNew: true,
    }]);
  };

  const handleSave = () => {
    if (!isValid) return;

    // Update existing segments and add new ones
    const updatedSegments = odds.map(o => {
      const existingSegment = segments.find(s => s.id === o.id);
      if (existingSegment) {
        return {
          ...existingSegment,
          weight: o.percentage,
        };
      }
      // New segment
      return {
        id: o.id.replace('new-', ''), // Clean up the temp id
        label: o.label,
        color: o.color,
        weight: o.percentage,
      };
    });

    setSegments(updatedSegments);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change Odds</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Total indicator */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
            <span className="text-sm font-medium">Total Allocation</span>
            <span className={cn(
              "text-lg font-bold tabular-nums",
              isValid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {totalPercentage}/100
            </span>
          </div>

          {/* Segment sliders */}
          <ScrollArea className="max-h-[50vh] pr-4">
            <div className="space-y-4">
              {odds.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLock(item.id)}
                        className="h-6 w-6 p-0 shrink-0"
                        title={item.isLocked ? 'Unlock' : 'Lock'}
                      >
                        {item.isLocked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Unlock className="h-3 w-3 opacity-50" />
                        )}
                      </Button>
                      <div
                        className="h-4 w-4 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                      {item.isNew && (
                        <span className="text-xs text-muted-foreground">(new)</span>
                      )}
                    </div>
                    <span className="text-sm font-medium tabular-nums w-12 text-right shrink-0">
                      {item.percentage}%
                    </span>
                  </div>
                  <Slider
                    value={[item.percentage]}
                    onValueChange={([value]) => handlePercentageChange(item.id, value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={item.isLocked}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Add segment button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSegment}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Segment
          </Button>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
