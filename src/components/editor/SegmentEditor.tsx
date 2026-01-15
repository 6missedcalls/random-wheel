import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './ColorPicker';
import { IconPicker, AVAILABLE_ICONS } from './IconPicker';
import { WeightSlider } from './WeightSlider';
import { useTotalWeight } from '@/store/wheelStore';
import type { Segment } from '@/types';

interface SegmentEditorProps {
  segment: Segment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (segment: Segment) => void;
  onDelete?: (id: string) => void;
}

export function SegmentEditor({
  segment,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: SegmentEditorProps) {
  const totalWeight = useTotalWeight();
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#FF6B6B');
  const [weight, setWeight] = useState(1);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<string | undefined>(undefined);

  // Update form when segment changes
  useEffect(() => {
    if (segment) {
      setLabel(segment.label);
      setColor(segment.color);
      setWeight(segment.weight);
      setDescription(segment.description || '');
      setIcon(segment.icon);
    }
  }, [segment]);

  const handleSave = () => {
    if (!segment || !label.trim()) return;

    onSave({
      ...segment,
      label: label.trim(),
      color,
      weight,
      description: description.trim() || undefined,
      icon,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!segment || !onDelete) return;
    onDelete(segment.id);
    onClose();
  };

  // Calculate weight including this segment's change
  const adjustedTotalWeight = segment
    ? totalWeight - segment.weight + weight
    : totalWeight + weight;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Segment</DialogTitle>
          <DialogDescription>
            Customize this wheel segment's appearance and probability.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="segment-label">Label</Label>
              <Input
                id="segment-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter segment label"
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground text-right">
                {label.length}/50 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="segment-description">Description (shown after spin)</Label>
              <Textarea
                id="segment-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description to display when this segment wins"
                maxLength={200}
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/200 characters
              </p>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Color</Label>
              <ColorPicker color={color} onChange={setColor} />
            </div>

            {/* Icon */}
            <IconPicker value={icon} onChange={setIcon} />

            {/* Weight */}
            <WeightSlider
              value={weight}
              onChange={setWeight}
              totalWeight={adjustedTotalWeight}
            />

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className="h-16 rounded-lg flex items-center justify-center gap-2 text-white font-medium shadow-inner"
                style={{ backgroundColor: color }}
              >
                {icon && AVAILABLE_ICONS[icon] && (() => {
                  const IconComponent = AVAILABLE_ICONS[icon];
                  return <IconComponent className="h-6 w-6" />;
                })()}
                {label || 'Preview'}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="sm:mr-auto"
            >
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!label.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
