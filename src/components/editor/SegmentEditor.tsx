import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './ColorPicker';
import { ImageUpload } from './ImageUpload';
import { WeightSlider } from './WeightSlider';
import { useTotalWeight, useSegments } from '@/store/wheelStore';
import type { Segment } from '@/types';

interface SegmentEditorProps {
  segment: Segment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (segment: Segment, percentage: number) => void;
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
  const segments = useSegments();
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#FF6B6B');
  const [percentage, setPercentage] = useState(10);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);

  // Update form when segment changes
  useEffect(() => {
    if (segment && totalWeight > 0) {
      setLabel(segment.label);
      setColor(segment.color);
      // Calculate current percentage from weight
      const currentPercentage = Math.round((segment.weight / totalWeight) * 100);
      setPercentage(Math.max(1, Math.min(99, currentPercentage)));
      setDescription(segment.description || '');
      setImage(segment.image);
    }
  }, [segment, totalWeight]);

  const handleSave = () => {
    if (!segment || !label.trim()) return;

    onSave({
      ...segment,
      label: label.trim(),
      color,
      weight: percentage, // Store percentage as weight temporarily, will be recalculated
      description: description.trim() || undefined,
      image,
    }, percentage);
    onClose();
  };

  const handleDelete = () => {
    if (!segment || !onDelete) return;
    onDelete(segment.id);
    onClose();
  };

  const otherSegmentsCount = segment ? segments.length - 1 : segments.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Segment</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="segment-name">Name</Label>
              <Input
                id="segment-name"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter segment name"
                maxLength={50}
              />
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
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Color</Label>
              <ColorPicker color={color} onChange={setColor} />
            </div>

            {/* Custom Image */}
            <ImageUpload value={image} onChange={setImage} />

            {/* Chance */}
            <WeightSlider
              value={percentage}
              onChange={setPercentage}
              otherSegmentsCount={otherSegmentsCount}
            />
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
