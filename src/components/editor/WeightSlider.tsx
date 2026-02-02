import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface WeightSliderProps {
  value: number;
  onChange: (value: number) => void;
  totalWeight: number;
  className?: string;
}

export function WeightSlider({
  value,
  onChange,
  totalWeight,
  className,
}: WeightSliderProps) {
  const probability = totalWeight > 0 ? ((value / totalWeight) * 100).toFixed(1) : '0.0';

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label>Odds</Label>
        <span className="text-sm text-muted-foreground">
          {value} ({probability}% chance)
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={0}
        max={10}
        step={1}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Higher odds = more likely to be selected
      </p>
    </div>
  );
}
