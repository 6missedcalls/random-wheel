import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Shuffle, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SegmentItem } from './SegmentItem';
import { SegmentEditor } from './SegmentEditor';
import { useWheelStore, useSegments } from '@/store/wheelStore';
import { containerVariants } from '@/lib/animations';
import { getNextColor, COLOR_PALETTES } from '@/constants/colors';
import type { Segment } from '@/types';
import { cn } from '@/lib/utils';

interface SegmentListProps {
  className?: string;
}

export function SegmentList({ className }: SegmentListProps) {
  const segments = useSegments();
  const { addSegment, updateSegment, removeSegment, setSegments } = useWheelStore();

  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddSegment = () => {
    const existingColors = segments.map((s) => s.color);
    const newColor = getNextColor(existingColors);

    addSegment({
      label: `Option ${segments.length + 1}`,
      color: newColor,
      weight: 1,
    });
  };

  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment);
    setIsEditorOpen(true);
  };

  const handleSaveSegment = (segment: Segment) => {
    updateSegment(segment.id, segment);
  };

  const handleDeleteSegment = (id: string) => {
    removeSegment(id);
  };

  const handleImageChange = (id: string, image: string | undefined) => {
    updateSegment(id, { image });
  };

  const handleRandomizeColors = () => {
    const palette = COLOR_PALETTES.vibrant;
    const updatedSegments = segments.map((segment, index) => ({
      ...segment,
      color: palette[index % palette.length],
    }));
    setSegments(updatedSegments);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all segments?')) {
      setSegments([]);
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between pb-4 border-b w-full text-left hover:bg-accent/50 -mx-2 px-2 rounded transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              isCollapsed && '-rotate-90'
            )}
          />
          <h2 className="text-lg font-semibold">Segments</h2>
        </div>
        <span
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Button onClick={handleAddSegment} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Segment list */}
            <div className="flex-1 min-h-0 overflow-y-auto py-4 max-h-[300px]">
              {segments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No segments yet.</p>
                  <p className="text-sm">Click "Add" to create your first segment.</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2 pr-2"
                >
                  <AnimatePresence mode="popLayout">
                    {segments.map((segment) => (
                      <SegmentItem
                        key={segment.id}
                        segment={segment}
                        onEdit={handleEditSegment}
                        onDelete={handleDeleteSegment}
                        onImageChange={handleImageChange}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Quick actions */}
            {segments.length > 0 && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomizeColors}
                  className="flex-1"
                >
                  <Shuffle className="h-4 w-4 mr-1" />
                  Randomize Colors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Segment editor dialog */}
      <SegmentEditor
        segment={editingSegment}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingSegment(null);
        }}
        onSave={handleSaveSegment}
        onDelete={handleDeleteSegment}
      />
    </div>
  );
}
