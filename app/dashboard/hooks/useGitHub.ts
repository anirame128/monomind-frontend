import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { checkGitHubStatus, fetchRepositories, addRepository as addRepositoryApi, getGitHubAuthUrl } from '../lib/api';
import type { GitHubRepository, IndexedCodebase } from '../lib/types';

export function useGitHub(userId: string | undefined) {
  const searchParams = useSearchParams();
  const router = useRouter();
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
    const githubConnectedParam = searchParams.get('github_connected');
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    
    // Handle github_already_linked error
    if (errorParam === 'github_already_linked' && messageParam) {
      const errorMessage = decodeURIComponent(messageParam);
      setGithubError(errorMessage);
      toast.error(errorMessage, { duration: 6000 });
      setGithubConnected(false);
      router.replace('/dashboard');
      return;
    }
    
    // Handle auth_failed error
    if (errorParam === 'auth_failed') {
      const errorMessage = 'Failed to connect GitHub. Please try again.';
      setGithubError(errorMessage);
      toast.error(errorMessage);
      setGithubConnected(false);
      router.replace('/dashboard');
      return;
    }
    
    // Handle successful connection
    if (githubConnectedParam === 'true') {
      setGithubConnected(true);
      setGithubError(null);
      toast.success('GitHub account connected successfully!');
      router.replace('/dashboard');
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
  }, [userId, searchParams, router]);

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
      const errorMessage = error instanceof Error ? error.message : "Failed to load repositories. Please try again.";
      setReposError(errorMessage);
      toast.error(errorMessage);
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

  const addRepository = useCallback(async (githubRepoId: number) => {
    if (!userId) throw new Error("User ID required");
    try {
      // Get repo name before adding (from current repositories list)
      const existingRepo = repositories.find(r => r.githubId === githubRepoId);
      const repoName = existingRepo?.fullName || 'repository';
      
      await addRepositoryApi(userId, githubRepoId);
      await loadIndexedCodebases();
      await loadRepositories();
      
      toast.success(`Repository ${repoName} added successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add repository. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  }, [userId, repositories, loadIndexedCodebases, loadRepositories]);

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

