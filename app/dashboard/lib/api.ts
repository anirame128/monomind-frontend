import type { ApiKey, GitHubRepository, IndexedCodebase } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApiKeys(userId: string): Promise<ApiKey[]> {
  const res = await fetch(`${API_URL}/api-keys/${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to load API keys: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function generateApiKey(userId: string, name: string): Promise<{ api_key: string }> {
  const res = await fetch(`${API_URL}/api-keys/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerk_user_id: userId,
      name,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to generate API key: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function deleteApiKey(key: string): Promise<void> {
  const res = await fetch(`${API_URL}/api-keys/${key}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete API key: ${res.status} ${res.statusText}`);
  }
}

export async function checkGitHubStatus(userId: string): Promise<{ connected: boolean; username?: string }> {
  const res = await fetch(`${API_URL}/user/${userId}/github-status`);
  if (!res.ok) {
    throw new Error(`Failed to check GitHub status: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchRepositories(userId: string): Promise<GitHubRepository[]> {
  const url = `${API_URL}/github/repositories?clerk_user_id=${userId}`;
  const res = await fetch(url);
  
  if (!res.ok) {
    if (res.status === 400) {
      throw new Error("GitHub not connected");
    }
    if (res.status === 404) {
      throw new Error("Repositories endpoint not found. Please check if the backend is deployed.");
    }
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to load repositories: ${res.status} ${errorText}`);
  }
  
  return res.json();
}

export async function addRepository(userId: string, githubRepoId: number): Promise<void> {
  const res = await fetch(`${API_URL}/repositories/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerk_user_id: userId,
      github_repo_id: githubRepoId,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to add repository" }));
    throw new Error(errorData.detail || "Failed to add repository");
  }
}

export function getGitHubAuthUrl(userId: string): string {
  return `${API_URL}/auth/github?user_id=${userId}`;
}

