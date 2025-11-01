import { useState, useEffect, useCallback } from 'react';
import { checkGitHubStatus, fetchRepositories, addRepository as addRepositoryApi, getGitHubAuthUrl } from '../lib/api';
import type { GitHubRepository, IndexedCodebase } from '../lib/types';

export function useGitHub(userId: string | undefined) {
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [indexedCodebases, setIndexedCodebases] = useState<IndexedCodebase[]>([]);
  const [codebasesLoading, setCodebasesLoading] = useState(false);

  const checkConnection = useCallback(async () => {
    if (!userId) return;

    // Check URL params first (for immediate feedback after OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const githubConnectedParam = urlParams.get('github_connected');
    const errorParam = urlParams.get('error');
    
    if (errorParam === 'auth_failed') {
      setGithubError("GitHub authentication failed. Please try again.");
      setGithubConnected(false);
      window.history.replaceState({}, '', '/dashboard');
      return;
    }
    
    if (githubConnectedParam === 'true') {
      setGithubConnected(true);
      setGithubError(null);
      window.history.replaceState({}, '', '/dashboard');
      return;
    }

    // Then check actual database status
    try {
      const data = await checkGitHubStatus(userId);
      setGithubConnected(data.connected);
      setGithubError(null);
    } catch (error) {
      console.error("Failed to check GitHub status", error);
      setGithubError(null);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      checkConnection();
    }
  }, [userId, checkConnection]);

  const loadRepositories = useCallback(async () => {
    if (!userId || !githubConnected) {
      return;
    }

    setReposLoading(true);
    setReposError(null);

    try {
      const data = await fetchRepositories(userId);
      setRepositories(data || []);
    } catch (error) {
      console.error("Failed to load repositories", error);
      if (error instanceof Error) {
        setReposError(error.message);
      } else {
        setReposError("Failed to load repositories. Please try again.");
      }
      setRepositories([]);
    } finally {
      setReposLoading(false);
    }
  }, [userId, githubConnected]);

  const loadIndexedCodebases = useCallback(async () => {
    if (!userId || !githubConnected) {
      return;
    }

    setCodebasesLoading(true);
    try {
      const data = await fetchRepositories(userId);
      const indexed = data.filter((repo: GitHubRepository) => repo.isIndexed);
      setIndexedCodebases(indexed.map((repo: GitHubRepository) => ({
        id: repo.githubId.toString(),
        fullName: repo.fullName,
        githubUrl: repo.url,
        defaultBranch: repo.defaultBranch,
        isPrivate: repo.private,
        description: repo.description,
        status: 'INDEXED',
        createdAt: new Date().toISOString(),
      })));
    } catch (error) {
      console.error("Failed to load indexed codebases", error);
      setIndexedCodebases([]);
    } finally {
      setCodebasesLoading(false);
    }
  }, [userId, githubConnected]);

  useEffect(() => {
    if (githubConnected && userId) {
      loadIndexedCodebases();
    }
  }, [githubConnected, userId, loadIndexedCodebases]);

  const connectGitHub = () => {
    if (!userId) return;
    window.location.href = getGitHubAuthUrl(userId);
  };

  const addRepository = async (githubRepoId: number) => {
    if (!userId) throw new Error("User ID required");
    await addRepositoryApi(userId, githubRepoId);
    await loadIndexedCodebases();
    await loadRepositories();
  };

  return {
    githubConnected,
    githubError,
    repositories,
    reposLoading,
    reposError,
    indexedCodebases,
    codebasesLoading,
    checkConnection,
    loadRepositories,
    loadIndexedCodebases,
    connectGitHub,
    addRepository,
  };
}

