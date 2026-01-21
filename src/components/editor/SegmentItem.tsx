import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { segmentItemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { getImageCounterRotation } from '@/constants/segmentImages';
import type { Segment } from '@/types';

interface SegmentItemProps {
  segment: Segment;
  onEdit: (segment: Segment) => void;
  onDelete: (id: string) => void;
  onImageChange: (id: string, image: string | undefined) => void;
  onNameChange: (id: string, name: string) => void;
  className?: string;
}

export function SegmentItem({
  segment,
  onEdit,
  onDelete,
  onImageChange,
  onNameChange,
  className,
}: SegmentItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(segment.label);

  // Sync edited name when segment changes
  useEffect(() => {
    setEditedName(segment.label);
  }, [segment.label]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSave = () => {
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== segment.label) {
      onNameChange(segment.id, trimmedName);
    } else {
      setEditedName(segment.label);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditedName(segment.label);
      setIsEditingName(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 500 * 1024) {
      alert('Image must be less than 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      resizeImage(result, 128, 128, (resized) => {
        onImageChange(segment.id, resized);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const resizeImage = (
    dataUrl: string,
    maxWidth: number,
    maxHeight: number,
    callback: (resized: string) => void
  ) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/png', 0.8));
      }
    };
    img.src = dataUrl;
  };

  return (
    <motion.div
      variants={segmentItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors',
        className
      )}
    >
      {/* Drag handle */}
      <div className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Color indicator / Image - clickable for image upload */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="h-8 w-8 rounded-full shrink-0 shadow-sm overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all cursor-pointer"
        title="Click to change image"
      >
        {segment.image ? (
          <img
            src={segment.image}
            alt=""
            className="h-full w-full object-cover"
            style={{ transform: `rotate(${getImageCounterRotation(segment.image)}deg)` }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: segment.color }}
            aria-hidden="true"
          />
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Label - click to edit inline */}
      <div className="flex-1 min-w-0">
        {isEditingName ? (
          <Input
            ref={nameInputRef}
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleNameKeyDown}
            className="h-7 text-sm font-medium"
            maxLength={50}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingName(true)}
            className="w-full text-left font-medium truncate hover:text-primary transition-colors"
            title="Click to edit name"
          >
            {segment.label}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(segment)}
          aria-label={`Edit ${segment.label}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(segment.id)}
          aria-label={`Delete ${segment.label}`}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
