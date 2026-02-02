import { Octokit } from '@octokit/rest';
import { GITHUB_CONFIG } from '@/config/github';

export interface FileContent {
  content: string;
  sha: string;
}

export class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Fetch file content from GitHub repository
   */
  async fetchFileContent(
    path: string = GITHUB_CONFIG.filePath,
    ref: string = GITHUB_CONFIG.branch
  ): Promise<FileContent> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: GITHUB_CONFIG.owner,
        repo: GITHUB_CONFIG.repo,
        path,
        ref,
      });

      if ('content' in data && typeof data.content === 'string') {
        // Decode base64 content
        const content = atob(data.content.replace(/\n/g, ''));
        return {
          content,
          sha: data.sha,
        };
      }

      throw new Error('File content not found or is a directory');
    } catch (error) {
      console.error('Failed to fetch file content:', error);
      throw new Error(`Failed to fetch ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Commit file changes to GitHub repository
   */
  async commitFileChange(
    content: string,
    message: string,
    path: string = GITHUB_CONFIG.filePath,
    sha: string,
    branch: string = GITHUB_CONFIG.branch
  ): Promise<void> {
    try {
      // Encode content as base64
      const encodedContent = btoa(content);

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: GITHUB_CONFIG.owner,
        repo: GITHUB_CONFIG.repo,
        path,
        message,
        content: encodedContent,
        sha,
        branch,
        committer: GITHUB_CONFIG.commitAuthor,
        author: GITHUB_CONFIG.commitAuthor,
      });
    } catch (error) {
      console.error('Failed to commit file change:', error);
      throw new Error(`Failed to commit changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated();
      return data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw new Error('Failed to authenticate with GitHub');
    }
  }

  /**
   * Get repository information
   */
  async getRepository() {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner: GITHUB_CONFIG.owner,
        repo: GITHUB_CONFIG.repo,
      });
      return data;
    } catch (error) {
      console.error('Failed to get repository:', error);
      throw new Error('Failed to access repository');
    }
  }

  /**
   * Get latest commit for a file
   */
  async getLatestCommit(path: string = GITHUB_CONFIG.filePath): Promise<{
    sha: string;
    message: string;
    author: string;
    date: string;
  }> {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner: GITHUB_CONFIG.owner,
        repo: GITHUB_CONFIG.repo,
        path,
        per_page: 1,
      });

      if (data.length === 0) {
        throw new Error('No commits found');
      }

      const commit = data[0];
      return {
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name || 'Unknown',
        date: commit.commit.author?.date || '',
      };
    } catch (error) {
      console.error('Failed to get latest commit:', error);
      throw new Error('Failed to get commit history');
    }
  }
}

/**
 * Create a GitHub service instance with the provided token
 */
export function createGitHubService(token: string): GitHubService {
  return new GitHubService(token);
}
