import { useState, useEffect, useCallback } from 'react';
import { Octokit } from '@octokit/rest';

const TOKEN_STORAGE_KEY = 'github_token';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
}

interface UseGitHubAuthReturn {
  isAuthenticated: boolean;
  token: string | null;
  user: GitHubUser | null;
  isValidating: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
}

export function useGitHubAuth(): UseGitHubAuthReturn {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateToken = useCallback(async (): Promise<boolean> => {
    if (!token) return false;

    setIsValidating(true);
    try {
      const octokit = new Octokit({ auth: token });
      const { data } = await octokit.rest.users.getAuthenticated();

      setUser({
        login: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
      });

      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [token]);

  const login = useCallback(async (newToken: string): Promise<boolean> => {
    const trimmedToken = newToken.trim();
    if (!trimmedToken) return false;

    setToken(trimmedToken);
    localStorage.setItem(TOKEN_STORAGE_KEY, trimmedToken);

    // Validate the token
    try {
      const octokit = new Octokit({ auth: trimmedToken });
      const { data } = await octokit.rest.users.getAuthenticated();

      setUser({
        login: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  // Validate token on mount
  useEffect(() => {
    if (token && !user) {
      validateToken();
    }
  }, [token, user, validateToken]);

  return {
    isAuthenticated: !!token && !!user,
    token,
    user,
    isValidating,
    login,
    logout,
    validateToken,
  };
}
