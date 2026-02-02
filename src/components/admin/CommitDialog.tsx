import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CommitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export function CommitDialog({ isOpen, onClose, onCommit, isLoading }: CommitDialogProps) {
  const [commitMessage, setCommitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim() || isLoading) return;

    await onCommit(commitMessage.trim());
    setCommitMessage('');
  };

  const handleClose = () => {
    if (!isLoading) {
      setCommitMessage('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Commit Changes to GitHub</DialogTitle>
            <DialogDescription>
              Enter a commit message to save your changes to the repository
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="commit-message">Commit Message</Label>
            <Input
              id="commit-message"
              placeholder="Update default segments"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              disabled={isLoading}
              className="mt-2"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!commitMessage.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Committing...
                </>
              ) : (
                'Commit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
