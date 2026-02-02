import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SegmentEditor } from '@/components/editor/SegmentEditor';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Segment } from '@/types';
import { generateId } from '@/lib/utils';
import { createEmptySegment } from '@/lib/defaultsParser';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DefaultSegmentListProps {
  segments: Segment[];
  onUpdate: (segments: Segment[]) => void;
}

export function DefaultSegmentList({ segments, onUpdate }: DefaultSegmentListProps) {
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddSegment = () => {
    const newSegment: Segment = {
      ...createEmptySegment(),
      id: generateId(),
      label: 'New Segment',
    } as Segment;

    setEditingSegment(newSegment);
    setIsEditorOpen(true);
  };

  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment);
    setIsEditorOpen(true);
  };

  const handleSaveSegment = (updatedSegment: Segment) => {
    const existingIndex = segments.findIndex((s) => s.id === updatedSegment.id);

    if (existingIndex >= 0) {
      // Update existing segment
      const newSegments = [...segments];
      newSegments[existingIndex] = updatedSegment;
      onUpdate(newSegments);
    } else {
      // Add new segment
      onUpdate([...segments, updatedSegment]);
    }

    setIsEditorOpen(false);
    setEditingSegment(null);
  };

  const handleDeleteSegment = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onUpdate(segments.filter((s) => s.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingSegment(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Default Segments ({segments.length})</h2>
        <Button onClick={handleAddSegment} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Segment
        </Button>
      </div>

      {segments.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No segments yet</p>
          <Button onClick={handleAddSegment} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Segment
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {segments.map((segment) => (
            <Card key={segment.id} className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{segment.label}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {segment.description || 'No description'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Weight: {segment.weight} | ID: {segment.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSegment(segment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSegment(segment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Segment Editor Dialog */}
      <SegmentEditor
        segment={editingSegment}
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        onSave={handleSaveSegment}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Segment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the segment from the default configuration. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
