import { useState, useEffect, useCallback } from 'react';
import { AuthGate } from '@/components/admin/AuthGate';
import { DefaultSegmentList } from '@/components/admin/DefaultSegmentList';
import { CommitDialog } from '@/components/admin/CommitDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { createGitHubService } from '@/services/github';
import { parseDefaultSegments, generateDefaultsFile } from '@/lib/defaultsParser';
import type { Segment } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function AdminPage() {
  const { token } = useGitHubAuth();
  const { toast } = useToast();

  const [segments, setSegments] = useState<Segment[]>([]);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [fileSha, setFileSha] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCommit, setLastCommit] = useState<{
    message: string;
    author: string;
    date: string;
  } | null>(null);

  const loadFromGitHub = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const github = createGitHubService(token);

      // Fetch file content and latest commit
      const [fileData, commitData] = await Promise.all([
        github.fetchFileContent(),
        github.getLatestCommit(),
      ]);

      setOriginalContent(fileData.content);
      setFileSha(fileData.sha);
      setLastCommit({
        message: commitData.message,
        author: commitData.author,
        date: commitData.date,
      });

      // Parse segments
      const parsedSegments = parseDefaultSegments(fileData.content);
      setSegments(parsedSegments);
      setIsDirty(false);

      toast({
        title: 'Loaded successfully',
        description: `Loaded ${parsedSegments.length} segments from GitHub`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load from GitHub';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  const handleSegmentsUpdate = (newSegments: Segment[]) => {
    setSegments(newSegments);
    setIsDirty(true);
  };

  const handleCommit = async (message: string) => {
    if (!token || !originalContent) return;

    try {
      const github = createGitHubService(token);

      // Generate new file content
      const newContent = generateDefaultsFile(segments, originalContent);

      // Commit to GitHub
      await github.commitFileChange(newContent, message, undefined, fileSha);

      toast({
        title: 'Success!',
        description: 'Changes committed to GitHub. GitHub Pages will rebuild automatically.',
      });

      // Reload from GitHub to get new SHA
      await loadFromGitHub();

      setIsCommitDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to commit changes';
      toast({
        title: 'Commit failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Load on mount
  useEffect(() => {
    if (token) {
      loadFromGitHub();
    }
  }, [token, loadFromGitHub]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <AuthGate>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage default segments</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadFromGitHub}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Load from GitHub
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsCommitDialogOpen(true)}
              disabled={!isDirty || isLoading || segments.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save to GitHub
              {isDirty && <span className="ml-2 text-xs">(unsaved)</span>}
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            {isDirty ? (
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium">
                {isDirty ? 'Unsaved Changes' : 'Synced with GitHub'}
              </p>
              {lastCommit && (
                <p className="text-sm text-muted-foreground mt-1">
                  Last commit: "{lastCommit.message}" by {lastCommit.author}
                  <br />
                  {new Date(lastCommit.date).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Segment List */}
        {!isLoading && segments.length >= 0 && (
          <DefaultSegmentList segments={segments} onUpdate={handleSegmentsUpdate} />
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading from GitHub...</p>
          </Card>
        )}

        {/* Commit Dialog */}
        <CommitDialog
          isOpen={isCommitDialogOpen}
          onClose={() => setIsCommitDialogOpen(false)}
          onCommit={handleCommit}
          isLoading={isLoading}
        />
      </div>
    </AuthGate>
  );
}
