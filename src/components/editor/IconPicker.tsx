import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AVAILABLE_ICONS } from '@/lib/icons';

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string | undefined) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const iconEntries = Object.entries(AVAILABLE_ICONS);

  return (
    <div className="space-y-2">
      <Label>Icon (optional)</Label>
      <div className="flex flex-wrap gap-2">
        {/* No icon option */}
        <Button
          type="button"
          variant={!value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(undefined)}
          className="h-10 w-10 p-0"
          title="No icon"
        >
          <span className="text-xs">-</span>
        </Button>

        {/* Show first row of icons or all if expanded */}
        {iconEntries.slice(0, isExpanded ? iconEntries.length : 7).map(([name, Icon]) => (
          <Button
            key={name}
            type="button"
            variant={value === name ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(name)}
            className={cn('h-10 w-10 p-0')}
            title={name}
          >
            <Icon className="h-5 w-5" />
          </Button>
        ))}

        {/* Expand/collapse button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-10 px-3"
        >
          {isExpanded ? 'Less' : `+${iconEntries.length - 7} more`}
        </Button>
      </div>
    </div>
  );
}
