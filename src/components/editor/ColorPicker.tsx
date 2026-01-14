import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DEFAULT_COLORS } from '@/constants/colors';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start gap-2', className)}
        >
          <div
            className="h-5 w-5 rounded border border-border"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-sm">{color.toUpperCase()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-4">
          <HexColorPicker color={color} onChange={onChange} className="w-full" />

          <div className="space-y-2">
            <Label htmlFor="hex-input">Hex Color</Label>
            <Input
              id="hex-input"
              value={color}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  onChange(value);
                }
              }}
              placeholder="#000000"
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="grid grid-cols-8 gap-1">
              {DEFAULT_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn(
                    'h-6 w-6 rounded border-2 transition-transform hover:scale-110',
                    color === presetColor ? 'border-primary' : 'border-transparent'
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onChange(presetColor)}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
