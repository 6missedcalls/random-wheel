import { motion } from 'framer-motion';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { segmentItemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { Segment } from '@/types';

interface SegmentItemProps {
  segment: Segment;
  onEdit: (segment: Segment) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function SegmentItem({
  segment,
  onEdit,
  onDelete,
  className,
}: SegmentItemProps) {

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

      {/* Color indicator / Image */}
      {segment.image ? (
        <img
          src={segment.image}
          alt=""
          className="h-8 w-8 rounded-full shrink-0 shadow-sm object-cover"
        />
      ) : (
        <div
          className="h-8 w-8 rounded-full shrink-0 shadow-sm"
          style={{ backgroundColor: segment.color }}
          aria-hidden="true"
        />
      )}

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{segment.label}</p>
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
