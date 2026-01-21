import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface WeightSliderProps {
  value: number;
  onChange: (value: number) => void;
  otherSegmentsCount: number;
  className?: string;
}

export function WeightSlider({
  value,
  onChange,
  otherSegmentsCount,
  className,
}: WeightSliderProps) {
  // Calculate max percentage (leave at least 1% for each other segment)
  const maxPercentage = otherSegmentsCount > 0 ? 100 - otherSegmentsCount : 99;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label>Chance</Label>
        <span className="text-sm text-muted-foreground">
          {value}%
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={1}
        max={maxPercentage}
        step={1}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Other segments will share the remaining {100 - value}% evenly
      </p>
    </div>
  );
}
