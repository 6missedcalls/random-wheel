import { useState } from 'react';
import { Save, FolderOpen, Trash2, Copy, Pencil, Check, X, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWheelStore, useSavedWheels, useSegments } from '@/store/wheelStore';
import { cn } from '@/lib/utils';

interface WheelManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WheelManager({ isOpen, onClose }: WheelManagerProps) {
  const savedWheels = useSavedWheels();
  const segments = useSegments();
  const { saveCurrentWheel, loadWheel, deleteWheel, renameWheel, duplicateWheel, createNewWheel } = useWheelStore();

  const [newWheelName, setNewWheelName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSave = () => {
    if (!newWheelName.trim()) return;
    saveCurrentWheel(newWheelName.trim());
    setNewWheelName('');
    setShowSaveForm(false);
  };

  const handleLoad = (id: string) => {
    loadWheel(id);
    onClose();
  };

  const handleDelete = (id: string) => {
    deleteWheel(id);
  };

  const handleDuplicate = (id: string) => {
    duplicateWheel(id);
  };

  const handleCreateNew = () => {
    createNewWheel();
    onClose();
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleRename = () => {
    if (editingId && editingName.trim()) {
      renameWheel(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Wheels</DialogTitle>
          <DialogDescription>
            Save, load, and manage your wheel configurations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Create new wheel button */}
          <Button
            onClick={handleCreateNew}
            variant="outline"
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Wheel
          </Button>

          {/* Save current wheel section */}
          {!showSaveForm ? (
            <Button
              onClick={() => setShowSaveForm(true)}
              className="w-full"
              disabled={segments.length < 2}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Current Wheel
            </Button>
          ) : (
            <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
              <Label htmlFor="wheel-name">Wheel Name</Label>
              <div className="flex gap-2">
                <Input
                  id="wheel-name"
                  value={newWheelName}
                  onChange={(e) => setNewWheelName(e.target.value)}
                  placeholder="Enter a name for this wheel"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <Button onClick={handleSave} disabled={!newWheelName.trim()}>
                  Save
                </Button>
                <Button variant="ghost" onClick={() => setShowSaveForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Saved wheels list */}
          <div className="space-y-2">
            <Label>Saved Wheels ({savedWheels.length})</Label>
            {savedWheels.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No saved wheels yet. Save your first wheel above!
              </p>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {savedWheels.map((wheel) => (
                    <div
                      key={wheel.id}
                      className={cn(
                        'p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors',
                        'flex items-center justify-between gap-2'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        {editingId === wheel.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename();
                                if (e.key === 'Escape') cancelEditing();
                              }}
                              autoFocus
                            />
                            <Button size="sm" variant="ghost" onClick={handleRename}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEditing}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium truncate">{wheel.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {wheel.segments.length} segments - {formatDate(wheel.updatedAt)}
                            </p>
                          </>
                        )}
                      </div>

                      {editingId !== wheel.id && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleLoad(wheel.id)}
                            title="Load wheel"
                          >
                            <FolderOpen className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(wheel.id, wheel.name)}
                            title="Rename wheel"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicate(wheel.id)}
                            title="Duplicate wheel"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(wheel.id)}
                            className="text-destructive hover:text-destructive"
                            title="Delete wheel"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
