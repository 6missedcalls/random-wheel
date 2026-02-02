import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogOut, User } from 'lucide-react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { isAuthenticated, user, isValidating, login, logout } = useGitHubAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    const success = await login(tokenInput);

    if (success) {
      setTokenInput('');
    } else {
      setError('Invalid token. Please check your GitHub Personal Access Token and try again.');
    }

    setIsLoggingIn(false);
  };

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Authentication</CardTitle>
            <CardDescription>
              Enter your GitHub Personal Access Token to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">GitHub Personal Access Token</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  disabled={isLoggingIn}
                />
                <p className="text-sm text-muted-foreground">
                  Token needs <code className="px-1 py-0.5 bg-muted rounded">repo</code> scope
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoggingIn || !tokenInput.trim()}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Login'
                )}
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Don't have a token?{' '}
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Random%20Wheel%20Admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Create one on GitHub
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt={user.login}
              className="h-10 w-10 rounded-full"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{user?.name || user?.login}</span>
            </div>
            <p className="text-sm text-muted-foreground">@{user?.login}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      {children}
    </div>
  );
}
